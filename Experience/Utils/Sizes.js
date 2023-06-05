import {EventEmitter} from "events";

export default class Sizes extends EventEmitter{
    constructor(){
        // super constructor provides access to everything in EventEmitter
        super();
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.aspect = this.width/this.height;
        // min function to select lowest pixel ratio up to 2 (no benefit above 2)
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);

        this.frustrum = 3.5;

        // checking for either a desktop or mobile browser window size
        if(this.width < 968){
            this.device = "mobile";
        }
        else{
            this.device = "desktop";
        }

        // To update all values on resize
        window.addEventListener("resize",()=>{
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.aspect = this.width / this.height;
            this.pixelRatio = Math.min(window.devicePixelRatio, 2);
            this.emit("resize");

            // check when browser changes to mobile and not everytime it is resized
            if(this.width < 958 && this.device !== "mobile") {
                this.device = "mobile";
                this.emit("switchdevice", this.device);
            } 
            // same as above but with desktop
            else if(this.width >= 968 && this.device !== "desktop"){
                this.device = "desktop";
                this.emit("switchdevice", this.device);
            }
        });
    }
}