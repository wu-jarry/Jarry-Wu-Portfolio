import {EventEmitter} from "events";

export default class Theme extends EventEmitter{
    constructor(){
        // super constructor provides access to everything in EventEmitter
        super();

        this.theme = "light"

        // grab the button and circle from css file
        this.toggleButton = document.querySelector(".toggle-button")
        this.toggleCircle = document.querySelector(".toggle-circle")

        this.setEventListerners();
    }

    setEventListerners(){
        // assign the slide class to the circle when clicked and take it away when clicked again
        this.toggleButton.addEventListener("click", () => {
            this.toggleCircle.classList.toggle("slide");
            // create a ternerary operator to set the theme based on the click
            this.theme = this.theme === "light"? "dark" : "light";
            // add classes to the body and toggle them
            document.body.classList.toggle("dark-theme");
            document.body.classList.toggle("light-theme");

            // emit event by passing the "switch" event
            this.emit("switch", this.theme);
        });
    }

}