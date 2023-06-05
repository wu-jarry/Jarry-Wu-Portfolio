import * as THREE from "three";
import Experience from "./Experience.js";

export default class Renderer{
    constructor(){
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.camera = this.experience.camera;

        // create renderer function
        this.setRenderer();
    }

    setRenderer(){
        this.renderer = new THREE.WebGLRenderer({
            // pass the canvas from this.experience
            canvas: this.canvas,
            // turn on antialias to avoid jagged edgey lines
            antialias: true,
        });

        // setting up some parameters for the renderer
        // physically correct lights
        this.renderer.useLegacyLights = true;
        // add some encoding
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        // add some tone
        this.renderer.toneMapping = THREE.CineonToneMapping;
        // add some exposure
        this.renderer.toneMappingExposure = 0.5;
        // enabline shadows
        this.renderer.shadowMap.enabled = true;
        // setting the type of shadow
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        // setting the size of renderer
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        // setting the pixel ratio of renderer
        this.renderer.setPixelRatio(this.sizes.pixelRatio);

    }

    resize(){
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(this.sizes.pixelRatio);
    }
    
    // add an update function because using orbital controls
    update(){
        // move screen to top right corner
        // this.renderer.setViewport(0, 0, this.sizes.width, this.sizes.height);
        this.renderer.render(this.scene, this.camera.perspectiveCamera);
        // create second screen
        // this.renderer.setScissorTest(true);
        // // set the location and size of the second screen
        // this.renderer.setViewport(
        //     this.sizes.width - this.sizes.width / 3,
        //     this.sizes.height - this.sizes.height / 3,
        //     this.sizes.width / 3,
        //     this.sizes.height / 3
        // );

        // this.renderer.setScissor(
        //     this.sizes.width - this.sizes.width / 3,
        //     this.sizes.height - this.sizes.height / 3,
        //     this.sizes.width / 3,
        //     this.sizes.height / 3
        // );

        this.renderer.render(this.scene, this.camera.orthographicCamera);

        this.renderer.setScissorTest(false);
    }
}