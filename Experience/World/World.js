import * as THREE from "three";
import Experience from "../Experience.js";

import Room from "./Room.js";
import Floor from "./Floor.js";
import Controls from "./Controls.js";
import Environment from "./Environment.js";
import {EventEmitter} from "events";

// extend event emitter so once everything is instantiated, the preloader can begin playing intro animation
export default class World extends EventEmitter{
    constructor(){
        super();
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.camera = this.experience.camera;
        this.resources = this.experience.resources;
        this.theme = this.experience.theme;

        // listens to Resources.js emitter to run .js files after resources are done loading
        this.resources.on("ready",()=>{
            this.environment = new Environment();
            // floor must come before room or there will be an error saying circles are undefined
            this.floor = new Floor();
            this.room = new Room();
            // this.controls = new Controls();
            // once everything is instantiated emit "worldready"
            this.emit("worldready");
        });

        // grab theme that was passed in and pass it to a function
        this.theme.on("switch",(theme) => {
            this.switchTheme(theme);
        });
        this.theme.on("switch",(room) => {
            this.switchTheme(room);
        });
    }

    // create the function theme is being passed to
    switchTheme(theme){
        if(this.environment){
            // create a new method and pass theme into method
            this.environment.switchTheme(theme);
            this.controls.checkSpotLight(theme);
        };
    }

    switchTheme(room){
        if(this.environment){
            this.environment.switchTheme(room);
        }
    }

    resize(){
    }
    
    update(){
        // prevent null error from Experience calling function before room is created (i.e. once room is created start updating it)
        if(this.room){
            this.room.update();
        }
        // if controls exists update controls
        if(this.controls){
            this.controls.update();
        }
    }
}