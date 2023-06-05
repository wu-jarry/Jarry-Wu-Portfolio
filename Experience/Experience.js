// import everything as three from three.js
import * as THREE from "three";

import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";
import Resources from "./Utils/Resources.js";
import assets from "./Utils/assets.js";

import Camera from "./Camera.js";
import Theme from "./Theme.js";
import Renderer from "./Renderer.js";
import Preloader from "./Preloader.js";

import World from "./World/World.js";
import Controls from "./World/Controls.js";

export default class Experience{
    // Begin creating the singleton design pattern
    static instance;
    // take in canvas element that was passed in
    constructor(canvas){
        if(Experience.instance){
            return Experience.instance;
        }
        Experience.instance = this
        // set variable to canvas that was passed in
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.time = new Time();
        this.sizes = new Sizes();
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.resources = new Resources(assets);
        this.theme = new Theme();
        this.world =  new World();
        this.preloader = new Preloader();

        this.preloader.on("enablecontrols", () => {
            this.controls = new Controls();
        });

        this.time.on("update", () => {
            this.update();
        })

        this.sizes.on("resize", () => {
            this.resize();
        })
    }

    resize(){
        // calls resize function in Camera.js
        this.camera.resize();
        this.world.resize();
        // calls resize function in Renderer.js
        this.renderer.resize();
    }

    update(){
        this.preloader.update();
        // calls update function in Camera.js
        this.camera.update();
        // calls update function in Renderer.js
        this.renderer.update();
        this.world.update();
        this.preloader.update();
    }
}