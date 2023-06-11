const userInput = "User's input"; // Replace with the actual user input

fetch('/api/bartender', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ userInput })
})
.then(response => response.json())
.then(data => {
  const response = data.response;
  // Process the response from the Python backend
  console.log(response);
})
.catch(error => {
  // Handle the error
  console.error(error);
});