import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";
import GUI from 'lil-gui'; 

export default class Environemnt{
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;
        // getting the loaded glb room file
        this.resources = this.experience.resources;
        // this.actualRoom = this.room = this.experience.world.room;


        this.obj = {
            colorObj: {r: 0, g: 0, b: 0},
            intensity: 3,
        }

        this.setSunLight();
        // this.setGUI();
    }

    // setGUI(){
    //     // use onChange lil-gui method to update theme colour with lil-gui
    //     this.gui.addColor(this.obj, "colorObj").onChange(() => {
    //         // set sunlight and ambient light colors to the colour selected with lil-gui
    //         this.sunLight.color.copy(this.obj.colorObj)
    //         this.ambientLight.color.copy(this.obj.colorObj)
    //         console.log(this.obj.colorObj);
    //     });
    //     this.gui.add(this.obj, "intensity", 0, 10).onChange(() => {
    //         // set the sinlight and ambient light light intensity
    //         this.sunLight.intensity = this.obj.intensity
    //         this.ambientLight.intensity = this.obj.intensity
    //     })
    // }

    setSunLight(){
        // creating a new sunlight and setting the colour and intensity
        this.sunLight = new THREE.DirectionalLight("#ffffff, 3");
        this.sunLight.castShadow = true;
        this.sunLight.shadow.camera.far = 20;
        // setting the quality of shadows
        this.sunLight.shadow.mapSize.set(2048, 2048);
        // setting how defined the shadow edges need to be
        this.sunLight.shadow.normalBias = 0.05;

        // const helper = new THREE.CameraHelper(this.sunlight.shadow.camera);
        // this.scene.add(helper);

        // setting the position of shadows
        this.sunLight.position.set(-1.5, 7, 3);
        // adding sunlight to the scene
        this.scene.add(this.sunLight);

        this.ambientLight = new THREE.AmbientLight("ffffff", 1);
        this.scene.add(this.ambientLight)
    }

    // use GSAP to change the colors when theme changes
    switchTheme(theme){
        if(theme === "dark"){
            GSAP.to(this.sunLight.color,{
                // rgb values must be between [0, 1] in three.js
                r: 0.19215686274509805,
                g: 0.3254901960784314,
                b: 0.7254901960784313
            });
            GSAP.to(this.sunLight, {
                intensity: 0.78
            });
            GSAP.to(this.ambientLight.color, {
                // rgb values must be between [0, 1] in three.js
                r: 0.19215686274509805,
                g: 0.3254901960784314,
                b: 0.7254901960784313
            });

        }
        else{
            GSAP.to(this.sunLight.color,{
                // rgb values must be between [0, 1] in three.js
                r: 255 / 255,
                g: 255 / 255,
                b: 255 / 255
            });
            GSAP.to(this.sunLight, {
                intensity: 1
            });
            GSAP.to(this.ambientLight.color,{
                // rgb values must be between [0, 1] in three.js
                r: 255 / 255,
                g: 255 / 255,
                b: 255 / 255
            });
            GSAP.to(this.ambientLight, {
                intensity: 1
            });

            // this.actualRoom.remove( this.spotLight ); 
            // this.actualRoom.remove (this.spotLight.target);
        }

    }

    resize(){
    }
    
    update(){
    }
}