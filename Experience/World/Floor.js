import * as THREE from "three";
import Experience from "../Experience.js";

export default class Floor{
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;

        // create a function to build out the floor
        this.setFloor();
        this.setCircles();

    }

    setFloor(){
        // create a geometry that is 100 x 100
        this.geometry = new THREE.PlaneGeometry(100, 100);
        // define the floors attributes
        this.material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            side: THREE.BackSide
        });
        // create a floor using geometry and material above
        this.plane = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.plane);
        // set the floor to be horizontal
        this.plane.rotation.x = Math.PI / 2;
        this.plane.position.y = -0.1;
        // allow it to have shadows cast on it
        this.plane.receiveShadow = true;
    }

    setCircles(){
        const geometry = new THREE.CircleGeometry( 5, 32 ); 
        // use mesh standard material so it can receive shadows
        const material1 = new THREE.MeshStandardMaterial( { color: 0x7CB8C2 } ); 
        const material2 = new THREE.MeshStandardMaterial( { color: 0xe5a1aa } ); 
        const material3 = new THREE.MeshStandardMaterial( { color: 0x8395CD } ); 

        this.circleFirst = new THREE.Mesh( geometry, material1 );
        this.circleSecond = new THREE.Mesh( geometry, material2 );
        this.circleThird = new THREE.Mesh( geometry, material3 );

        this.circleFirst.position.y = -0.09;
        this.circleSecond.position.y = -0.08;
        this.circleThird.position.y = -0.07;
        
        this.circleFirst.scale.set(0, 0, 0);
        this.circleSecond.scale.set(0, 0, 0);
        this.circleThird.scale.set(0, 0, 0);

        this.circleFirst.rotation.x = 
            this.circleSecond.rotation.x =
            this.circleThird.rotation.x = 
                 -Math.PI / 2;

        this.circleFirst.receiveShadow = 
            this.circleSecond.receiveShadow =
            this.circleThird.receiveShadow = 
                true;

        this.scene.add( this.circleFirst );
        this.scene.add( this.circleSecond );
        this.scene.add( this.circleThird );
    }

    resize(){
    }
    
    update(){

    }
}