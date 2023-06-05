import {EventEmitter} from "events";
import Experience from "./Experience.js";
import GSAP from "gsap";
import convert from "./Utils/convertDivstoSpans.js";

export default class Sizes extends EventEmitter{
    constructor(){
        // super constructor provides access to everything in EventEmitter
        super();

        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.sizes = this.experience.sizes;
        // getting the loaded glb room file
        this.resources = this.experience.resources;
        this.camera = this.experience.camera;
        this.world = this.experience.world;
        this.device = this.sizes.device;

        this.sizes.on("switchdevice", (device) => {
            this.device = device;
        });

        this.world.on( "worldready", () => {
            this.setAssets();
            this.playIntro();
        });
    }

    setAssets(){
        convert(document.querySelector(".intro-text"))
        convert(document.querySelector(".hero-main-title"))
        convert(document.querySelector(".hero-main-decription"))
        convert(document.querySelector(".first-sub"))
        convert(document.querySelector(".second-sub"))
        this.room = this.experience.world.room.actualRoom;
        // pulling in the this.roomChildren[child.name] = child object provided in Room.js 
        this.roomChildren = this.experience.world.room.roomChildren;
    }

    firstIntro(){
        // allow for an asynchronous function so it is only allowed to happen after the first intro animation
        return new Promise ((resolve) => {
            this.timeline = new GSAP.timeline();
            this.timeline.set(".animatedis", {y: 0, yPercent: 100})

            this.timeline.to(".preloader", {
                opacity: 0,
                delay: 1,
                onComplete: () => {
                    document
                        // add the hidden class to the preloader class to remove the loading animation
                        .querySelector(".preloader")
                        .classList.add("hidden");
                }
            })

            if(this.device === "desktop"){
            this.timeline
                .to(this.roomChildren.Cube.scale, {
                    x: 1.4,
                    y: 1.4,
                    z: 1.4,
                    ease: "back.out(2.5)",
                    duration: 0.7,
                })
                .to(this.room.position, {
                    x: -1,
                    ease: "power1.out",
                    duration: 0.7,
                    // gsap tool that calls something once the animation is completed
                });
            }
            else{
                this.timeline.to(this.roomChildren.Cube.scale, {
                    x: 1.4,
                    y: 1.4,
                    z: 1.4,
                    ease: "back.out(2.5)",
                    duration: 0.7,
                })
                    .to(this.room.position, {
                        z: -1,
                        ease: "power1.out",
                        duration: 0.7,
                    });
            }
            this.timeline
            .to(".intro-text .animatedis", {
                yPercent: 0,
                stagger: 0.05,
                ease: "back.out(1.7)",
            })
            .to(".arrow-svg-wrapper", {
                opacity: 1,
            }, "same")
            .to(".toggle-bar", {
                opacity: 1,
                onComplete: resolve,
            }, "same")
        });
        
    }

    secondIntro(){
        return new Promise ((resolve) => {

            this.room = this.experience.world.room.actualRoom;
            // pulling in the this.roomChildren[child.name] = child object provided in Room.js 
            this.roomChildren = this.experience.world.room.roomChildren;

            this.secondTimeline = new GSAP.timeline();

            this.secondTimeline
            .to(".intro-text .animatedis", {
                yPercent: 100,
                stagger: 0.05,
                ease: "back.in(1.7)",
            }, "fadeout")
            .to(".arrow-svg-wrapper", {
                opacity: 0,
            }, "fadeout")
            .to(this.room.position, {
                x: 0,
                y: 0,
                z: 0,
                ease: "power1.out",
            }, "same")
            .to(this.roomChildren.Cube.rotation, {
                y: 2*Math.PI + Math.PI/4 + Math.PI,
            }, "same")
            .to(this.roomChildren.Cube.scale, {
                x: 8,
                y: 8,
                z: 8,
            }, "same")
            .to(this.camera.orthographicCamera.position, {
                y: 3.65,
            }, "same")
            .to(this.roomChildren.Cube.position, {
                x: 0.008587,
                y: 8.63063,
                z: 2.19473,
            }, "same")
            .set(this.roomChildren.Body.scale, {
                x: 1,
                y: 1,
                z: 1,
            })
            .to(this.roomChildren.Cube.position, {
                y: 200,
                duration: 1.5,
            }, "intro text")
            .set(this.roomChildren.Cube.scale, {
                x: 0,
                y: 0,
                z: 0,
            })
            .to(".hero-main-title .animatedis", {
                yPercent: 0,
                stagger: 0.07,
                ease: "back.out(1.7)",
            }, "intro text")
            .to(".hero-main-decription .animatedis", {
                yPercent: 0,
                stagger: 0.07,
                ease: "back.out(1.7)",
            }, "intro text")
            .to(".first-sub .animatedis", {
                yPercent: 0,
                stagger: 0.07,
                ease: "back.out(1.7)",
            }, "intro text")
            .to(".second-sub .animatedis", {
                yPercent: 0,
                stagger: 0.07,
                ease: "back.out(1.7)",
            }, "intro text")

            // Names of children to exclude from animation
            const excludedChildren = ["Cube", "Dirt", "FloorFirst", "FloorSecond", "FloorThird", "Lamp", "Mailbox", "WelcomeSign"];

            // Specify the desired order of children
            const childrenOrder = ["Desks", "Computer", "Table_stuff", "Floor_items", "Chair", "Ceiling_lamp"];

            const includedChildren = this.room.children.filter((child) => {
            return !excludedChildren.includes(child.name);
            });

            const childTargets = includedChildren
            .sort((a, b) => {
                const indexA = childrenOrder.indexOf(a.name);
                const indexB = childrenOrder.indexOf(b.name);
                return indexA - indexB;
            })
            .map((child) => child.scale);

            this.secondTimeline.staggerTo(childTargets, 0.4, {
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(1)",
                stagger: 0.1,
            })
            .to(this.roomChildren.Chair.rotation, {
                y: -Math.PI,
                ease: "elastic.out(1, 0.75)",
                duration: 2,
            }, "after stagger move")
            .to(this.roomChildren.spotLight, {
                intensity: 2,
            }, "after stagger move")
            .to(".arrow-svg-wrapper", {
                opacity: 1,
                onComplete: resolve,
            })
        });
    }

    onScroll(e){
        // only play the next animation after the previous one is finished and the browser scrolls down
        if(e.deltaY > 0){
            this.removeEventListeners();
            this.playSecondIntro();
        }
    }

    onTouch(e){
        this.initialY = e.touches[0].clientY;
    }

    onTouchMove(e){
        let currentY = e.touches[0].clientY;
        let difference = this.initialY - currentY;
        if(difference > 0){
            // console.log("swipped")
            this.removeEventListeners();
            this.playSecondIntro();
        }

        // resetting initial value
        this.initialY = null;
    }

    removeEventListeners(){
        window.removeEventListener("wheel", this.scrollOnceEvent);
        window.removeEventListener("touchstart", this.touchStart);
        window.removeEventListener("touchmove", this.touchMove);
    }

    async playIntro(){
        // wait for firstIntro to complete before moving on
        await this.firstIntro();
        // set moveFlag to true after firstIntro plays so the cube adjusts depending on screensize
        this.moveFlag = true;
        // add a pointer variable to the instance of this function so it can be added and removed
        this.scrollOnceEvent = this.onScroll.bind(this);

        // same thing as scrollOnceEvent but for mobile touch screen
        this.touchStart = this.onTouch.bind(this);
        this.touchMove = this.onTouchMove.bind(this);

        // play functions once the window sees someone scrolling
        window.addEventListener("wheel", this.scrollOnceEvent);
        window.addEventListener("touchstart", this.touchStart);
        window.addEventListener("touchmove", this.touchMove);
    }

    async playSecondIntro(){
        // set moveFlag to false so the cube doesn't move during second animation
        this.moveFlag = false;
        // allow room to scale according to browser size during second intro animation and turn it off immediately after
        this.scaleFlag = true;
        await this.secondIntro();
        this.scaleFlag = false;
        this.emit("enablecontrols")
    }

    move(){
        if(this.device === "desktop"){
            this.room.position.set(-1, 0, 0);
        }
        else{
            this.room.position.set(0, 0, -1);
        }
    }

    scale(){
        this.roomChildren.rectLight.width = 0;
        this.roomChildren.rectLight.height = 0;
        if(this.device === "desktop"){
            this.room.scale.set(0.11, 0.11, 0.11);
        }
        else{
            this.room.scale.set(0.07, 0.07, 0.07);
        }
    }

    update(){
        if(this.moveFlag){
            this.move();
        }

        if(this.scaleFlag){
            this.scale();
        }
    }
}