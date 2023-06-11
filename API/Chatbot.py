import os
import openai
from dotenv import load_dotenv
from colorama import Fore, Back, Style
from flask import Flask, request, jsonify
from flask_cors import CORS

# load values from the .env file if it exists
load_dotenv()

# configure OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

INSTRUCTIONS = """You are an expert bartender at a local bar. You are incredibly knowledgeable of cocktails, wines, spirits, and beers.

You can provide advice on drink menus, cocktail ingredients, how to make cocktails, and anything else related to alcoholic drinks.

If a question or prompt is alludes to something beyond bartending and alcoholic beverages, provide a quippy answer that diverts the user back to your area of expertise. For example, if asked about a very philosophical question, you could respond with "I've never really thought about that, but I think this topic is best discussed with a drink in hand. Care to pick your poison?"

Aim to be as helpful, creative, and friendly as possible with a light level of humour to each response.

Do not use any external URLs in your answer and do not refer to any other third party sources like blogs or articles in your answer.

Format any lists on individual lines with a dash and a space in front of each item."""

TEMPERATURE = 1
MAX_TOKENS = 256
FREQUENCY_PENALTY = 1
PRESENCE_PENALTY = 1
# limits how many questions we include in the prompt
MAX_CONTEXT_QUESTIONS = 10

app = Flask(__name__)
cors = CORS(app)
previous_questions_and_answers = []

def get_response(instructions, previous_questions_and_answers, new_question):
    """Get a response from ChatCompletion

    Args:
        instructions: The instructions for the chat bot - this determines how it will behave
        previous_questions_and_answers: Chat history
        new_question: The new question to ask the bot

    Returns:
        The response text
    """
    # build the messages
    messages = [
        { "role": "system", "content": instructions },
    ]
    # add the previous questions and answers
    for question, answer in previous_questions_and_answers[-MAX_CONTEXT_QUESTIONS:]:
        messages.append({ "role": "user", "content": question })
        messages.append({ "role": "assistant", "content": answer })
    # add the new question
    messages.append({ "role": "user", "content": new_question })

    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
        temperature=TEMPERATURE,
        max_tokens=MAX_TOKENS,
        top_p=1,
        frequency_penalty=FREQUENCY_PENALTY,
        presence_penalty=PRESENCE_PENALTY,
    )
    return completion.choices[0].message.content


def get_moderation(question):
    """
    Check the question is safe to ask the model

    Parameters:
        question (str): The question to check

    Returns a list of errors if the question is not safe, otherwise returns None
    """

    errors = {
        "hate": "Content that expresses, incites, or promotes hate based on race, gender, ethnicity, religion, nationality, sexual orientation, disability status, or caste.",
        "hate/threatening": "Hateful content that also includes violence or serious harm towards the targeted group.",
        "self-harm": "Content that promotes, encourages, or depicts acts of self-harm, such as suicide, cutting, and eating disorders.",
        "sexual": "Content meant to arouse sexual excitement, such as the description of sexual activity, or that promotes sexual services (excluding sex education and wellness).",
        "sexual/minors": "Sexual content that includes an individual who is under 18 years old.",
        "violence": "Content that promotes or glorifies violence or celebrates the suffering or humiliation of others.",
        "violence/graphic": "Violent content that depicts death, violence, or serious physical injury in extreme graphic detail.",
    }
    response = openai.Moderation.create(input=question)
    if response.results[0].flagged:
        # get the categories that are flagged and generate a message
        result = [
            error
            for category, error in errors.items()
            if response.results[0].categories[category]
        ]
        return result
    return None

@app.route('/api/bartender', methods=['POST'])
def bartender_api():

    data = request.get_json()
    print(data)
    user_input = data['userInput']
    # check the question is safe
    errors = get_moderation(user_input)
    if errors:
        response = {"error": errors}
    else:
        response = get_response(INSTRUCTIONS, previous_questions_and_answers, user_input)
    return jsonify({'response': response})


def main():
    os.system("cls" if os.name == "nt" else "clear")
    # keep track of previous questions and answers
    # Need to not run on port 5000 bc mac uses it for fucking airdrop.
    app.run(port=5050, debug=True)
    while True:
        # ask the user for their question
        new_question = input(
            Fore.GREEN + Style.BRIGHT + "What can I get you?: " + Style.RESET_ALL
        )
        # check the question is safe
        errors = get_moderation(new_question)
        if errors:
            print(
                Fore.RED
                + Style.BRIGHT
                + "Sorry, you're question didn't pass the moderation check:"
            )
            for error in errors:
                print(error)
            print(Style.RESET_ALL)
            continue
        response = get_response(INSTRUCTIONS, previous_questions_and_answers, new_question)

        # add the new question and answer to the list of previous questions and answers
        previous_questions_and_answers.append((new_question, response))

        # print the response
        print(Fore.CYAN + Style.BRIGHT + "Here you go: " + Style.NORMAL + response)


if __name__ == "__main__":
    main()
