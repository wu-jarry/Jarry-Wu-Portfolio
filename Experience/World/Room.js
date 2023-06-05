import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

export default class Room{
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;
        // getting the loaded glb room file
        this.resources = this.experience.resources;
        // getting the delta time for animations
        this.time = this.experience.time;
        // getting the items in the room asset
        this.room = this.resources.items.room;
        // getting only the scene details of the room (the visuals items)
        this.actualRoom = this.room.scene;
        this.roomChildren = {}
        
        this.lerp = {
            // begin linear interpolation between current and target values
            current: 0,
            target: 0,
            // set how smooth the camera movement is
            ease: 0.1,
        };

        // create a function to build out the actual room
        this.setModel();
        // create a function to animate fish
        this.setAnimation();
        this.onMouseMove();
        this.setLights();
    }

    setModel(){
        // allow each mesh to cast a shadow and have a shadow cast on it
        this.actualRoom.children.forEach((child) => {
            child.castShadow = true;
            child.receiveShadow = true;
            this.roomChildren[child.name] = child

            // allow each mesh within a group to cast a shadow and have a shadow cast on it
            if(child instanceof THREE.Group){
                child.children.forEach((groupchild) => {
                    groupchild.castShadow = true;
                    groupchild.receiveShadow = true;
                });
            }
            
            if(child.name === "Acquarium"){
                // turn the "aquariam glass" mesh into glass using three.js properties
                child.children[0].material = new THREE.MeshPhysicalMaterial();
                child.children[0].material.roughness = 0;
                child.children[0].material.color.set(0xb8f3ff);
                // setting index of refraction
                child.children[0].material.ior = 3;
                child.children[0].material.transmission = 1;
                child.children[0].material.opacity = 1;
            };

            // map the screen asset to the screen mesh
            if(child.name === "Computer"){
                child.children[1].material = new THREE.MeshBasicMaterial({
                    map: this.resources.items.screen
                });
            }

            // set the position of the mini floor inside the floor so it can be animated out
            if(child.name === "Mini_floor"){
                child.position.x = 3.18109;
                child.position.z = -0.874266;
            }

            if(child.name === "WelcomeSign"){
                child.position.y = 200;
            }
            
            if(child.name !== "WelcomeSign"){
                child.scale.set (0, 0, 0);
            }

            if(child.name === "Cube"){
                child.position.set(0, 1, 0);
                child.rotation.y = Math.PI / 4;
            }
        });

        // add the blender room to the scene
        this.scene.add(this.actualRoom);
        // shrinking actual room
        this.actualRoom.scale.set(0.11, 0.11, 0.11);
    }

    setLights(){
        // set light characteristics
        this.width = 0.33;
        this.height = 0.75;
        this.intensity = 3;
        // create a new light for the fish tank and apply characteristics
        this.rectLight = new THREE.RectAreaLight( 0xffffff, this.intensity, this.width, this.height );
        this.rectLight.position.set( 6.68381, 7.1, 0.934939 );
        this.rectLight.rotation.x = -Math.PI / 2;
        this.rectLight.rotation.z = Math.PI / 4;
        this.actualRoom.add( this.rectLight );

        this.roomChildren["rectLight"] = this.rectLight;
        this.rectLight.scale.set(0, 0, 0);

        // create a spotlight for ceiling light
        this.spotIntensity = 0;
        this.spotDistance = 50;
        this.spotAngle = 0.07;
        this.spotPenumbra = 1;
        this.spotLight = new THREE.SpotLight(0xFFE664, this.spotIntensity, this.spotDistance, this.spotAngle, this.spotPenumbra);
        this.spotLight.position.set( 0, 200, 100 );

        this.spotLight.castShadow = true;
        this.spotLight.shadow.camera.near = 500;
        this.spotLight.shadow.camera.far = 4000;
        this.spotLight.shadow.camera.fov = 30;

        this.actualRoom.add( this.spotLight ); 
        this.actualRoom.add (this.spotLight.target);

        this.roomChildren["spotLight"] = this.spotLight;

        // const spotLightHelper = new THREE.SpotLightHelper( this.spotLight );
        // this.actualRoom.add( spotLightHelper );
    }

    setAnimation(){
        this.mixer = new THREE.AnimationMixer(this.actualRoom);
        // assign the "fish animation" to the fish
        this.swim = this.mixer.clipAction(this.room.animations[6]);
        // play the animation
        this.swim.play();
    }

    onMouseMove(){
        window.addEventListener("mousemove", (e) => {
            // take the mouse's x position and convert it to a [0, 1] range to make it easier to work with
            this.rotation = ((e.clientX - window.innerWidth / 2) * 2) / window.innerWidth;
            // set the target rotation position to the mouse position in the client
            this.lerp.target = this.rotation * 0.1;
        });
    }

    resize(){
    }
    
    update(){
        // use GSAP tool set to access interpolation function
        this.lerp.current = GSAP.utils.interpolate(
            this.lerp.current,
            this.lerp.target,
            this.lerp.ease,
        );

        this.actualRoom.rotation.y = this.lerp.current;

        this.mixer.update(this.time.delta * 0.0005);
    }
}