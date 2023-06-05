import * as THREE from "three";
import Experience from "./Experience.js";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";

export default class Camera{
    constructor(){
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;

        // add additional camera functions to help with pathing later
        this.createPerspectiveCamera();
        this.createOrthographicCamera();
        // instantiate orbit controls
        this.setOrbitControls();
    }

    // defining the perspective camera
    createPerspectiveCamera(){
        this.perspectiveCamera = new THREE.PerspectiveCamera(
            35, 
            this.sizes.aspect, 
            0.1, 
            1000,
        );
        this.scene.add(this.perspectiveCamera)
        this.perspectiveCamera.position.x = -0.019862591856141948;
        this.perspectiveCamera.position.y = 4.42887345672698;
        this.perspectiveCamera.position.z = 20.59889374689583;
    }
    // defining the orthographic camera
    createOrthographicCamera(){
        this.orthographicCamera = new THREE.OrthographicCamera(
            // setting up the left view
            (-this.sizes.aspect * this.sizes.frustrum)/2,
            // setting up the right view
            (this.sizes.aspect * this.sizes.frustrum)/2,
            // setting up the top view
            this.sizes.frustrum/2,
            // setting up the bottom view
            -this.sizes.frustrum/2,
            // add far and near values
            -50,
            50,
        );

        // setting the orthographic camera to look at room
        this.orthographicCamera.rotation.x = -Math.PI / 6;
        this.orthographicCamera.position.y = 3;
        this.orthographicCamera.position.z = 5;

        this.scene.add(this.orthographicCamera);

        // this.helper = new THREE.CameraHelper(this.orthographicCamera);
        // this.scene.add(this.helper);

        const size = 20;
        const divisions = 20;

        // const gridHelper = new THREE.GridHelper(size, divisions);
        // this.scene.add(gridHelper);

        // const axesHelper = new THREE.AxesHelper(5);
        // this.scene.add(axesHelper);
    }

    setOrbitControls(){
        this.controls = new OrbitControls(this.perspectiveCamera, this.canvas)
        this.controls.enableDamping = true;
        this.controls.enableZoom = false;
    }

    resize(){
        // updating perspective camera on resize
        this.perspectiveCamera.aspect = this.sizes.aspect;
        this.perspectiveCamera.updateProjectionMatrix();

        // update orthographic camera on resize
        this.orthographicCamera.left = 
            (-this.sizes.aspect * this.sizes.frustrum)/2;
        this.orthographicCamera.right =
            (this.sizes.aspect * this.sizes.frustrum)/2;
        this.orthographicCamera.top = this.sizes.frustrum/2;
        this.orthographicCamera.bottom = -this.sizes.frustrum/2;
        this.orthographicCamera.updateProjectionMatrix();
    }

    // add an update function because using orbital controls
    update(){
        this.controls.update();
        // // update the helper camera to copy the orthographic camera position & rotation when it is moved
        // this.helper.matrixWorldNeedsUpdate = true;
        // this.helper.update();
        // this.helper.position.copy(this.orthographicCamera.position);
        // this.helper.rotation.copy(this.orthographicCamera.rotation);
    }
}