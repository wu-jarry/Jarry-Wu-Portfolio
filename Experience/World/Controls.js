import Experience from "../Experience.js";
import GSAP from "gsap";
import Lenis from "@studio-freight/lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";

export default class Room{
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.sizes = this.experience.sizes;
        // getting the loaded glb room file
        this.resources = this.experience.resources;
        // getting the delta time
        this.time = this.experience.time;
        this.camera = this.experience.camera;
        this.room = this.experience.world.room.actualRoom;

        // look through all the room's children's childs and if it's a rectlight or spotlight, give it a child parameter so it can be animated with gsap
        this.room.children.forEach((child) => {
            if (child.type === "RectAreaLight") {
                this.rectLight = child;
            }
            if (child.type === "SpotLight") {
                this.spotLight = child;
            }
        });

        this.circleFirst = this.experience.world.floor.circleFirst;
        this.circleSecond = this.experience.world.floor.circleSecond;
        this.circleThird = this.experience.world.floor.circleThird;

        GSAP.registerPlugin(ScrollTrigger);

        document.querySelector(".page").style.position = "relative"

        this.setScrollTrigger();
    }

    setScrollTrigger(){

        const lenis = new Lenis({
            duration: 2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          });

          function raf(time) {
            lenis.raf(time);
            ScrollTrigger.update();
            requestAnimationFrame(raf);
          }
          
          requestAnimationFrame(raf);

        let matchMedia = GSAP.matchMedia();

        // Desktop timeline -------------------------------------------
        // setup animations and ScrollTriggers for screens 969px wide or greater...
        // These ScrollTriggers will be reverted/killed when the media query doesn't match anymore.
        matchMedia.add("(min-width: 969px)", () => {

            // console.log("desktop");

            // set smaller default room scale for mobile view
            this.room.scale.set(0.11, 0.11, 0.11);
            // scale rect light appropriately
            this.rectLight.width = 0.33;
            this.rectLight.height = 0.75;

            if(this.spotLight.intensity > 0){
                this.spotLight.intensity = 2;
                this.spotLight.distance = 50;
                // console.log("on")
            }

            this.circleSecond.position.x = 1.5;

            // First section -------------------------------------------
            this.firstMoveTimeline = new GSAP.timeline({
                scrollTrigger: {
                    // select which html section will act as a trigger for the scoll animation
                    trigger: ".first-move",
                    // select where the marker and start point will be
                    start: "top top",
                    // select where the marker and end point will be
                    end: "bottom bottom",
                    // plays animation as cursor scrolls instead of instantly and determines how long it takes animation to catch up to scroll
                    scrub: 0.6,
                    // provide responsive sizing by updating the functional value (x) everytime a refresh occurs
                    invalidateOnRefresh: true,
                },
            })
                .to(this.room.position, {
                    // make the distance the room moves update on window resize
                    x: () => {
                        // make the distance the room moves responsive to the window size
                        return this.sizes.width * 0.0011;
                    },
                })

            // Second section -------------------------------------------
            this.secondMoveTimeline = new GSAP.timeline({
                scrollTrigger: {
                    // select which html section will act as a trigger for the scoll animation
                    trigger: ".second-move",
                    // select where the marker and start point will be
                    start: "top top",
                    // select where the marker and end point will be
                    end: "bottom bottom",
                    // plays animation as cursor scrolls instead of instantly and determines how long it takes animation to catch up to scroll
                    scrub: 0.6,
                    // provide responsive sizing by updating the functional value (x) everytime a refresh occurs
                    invalidateOnRefresh: true,
                },
            })
                .to(
                    // make the distance the room moves update on window resize
                    this.room.position,
                    {
                        // don't move the room on the x-axis
                        x: () => {
                            return 1.9;
                        },
                        // move the room forward relative to the windows height
                        z: () => {
                            return this.sizes.height * 0.003;
                        },
                    },
                    // assign animations the same GSAP position parameters so they happen together
                    "same"
                )
                .to(this.room.scale,
                    {
                        x: 0.4,
                        y: 0.4,
                        z: 0.4,
                    },
                    "same"
                )
                .to(this.rectLight,
                    {
                        width: 0.33 * 4,
                        height: 0.75 * 4,
                    },
                    "same"
                )

                // if(this.spotLightOn){
                    this.secondMoveTimeline.to(this.spotLight.position,
                        {
                            x: 0,
                            y: 150,
                            z: 100,
                        },
                        "same"
                    )
                    .set(this.spotLight,
                        {
                            intensity: 1.5,
                            distance: 400,
                        },
                        "same"
                    );
                // }

            // Third section -------------------------------------------
            this.thirdMoveTimeline = new GSAP.timeline({
                scrollTrigger: {
                    // select which html section will act as a trigger for the scoll animation
                    trigger: ".third-move",
                    // select where the marker and start point will be
                    start: "top top",
                    // select where the marker and end point will be
                    end: "bottom bottom",
                    // plays animation as cursor scrolls instead of instantly and determines how long it takes animation to catch up to scroll
                    scrub: 0.6,
                    // provide responsive sizing by updating the functional value (x) everytime a refresh occurs
                    invalidateOnRefresh: true,
                },
            })
                .to(this.camera.orthographicCamera.position, {
                    // transform the camera 1.5 pixels up and 4.1 pixels to the left
                    y: 1,
                    x: -1.5,
            });
        });

        // Mobile timeline -------------------------------------------
        // use an arrow function to access the class variables set above
        matchMedia.add("(max-width: 969px)", () => {

            // console.log("mobile");

            // set smaller default room scale for mobile view
            this.room.scale.set(0.07, 0.07, 0.07);
            this.room.position.set (0, 0, 0);
            // scale rect light appropriately
            this.rectLight.width = 0.4;
            this.rectLight.height = 0.4;

            if(this.spotLight.intensity > 0){
                this.spotLight.intensity = 2;
                this.spotLight.distance = 200;
            }

            this.circleSecond.position.x = 0;

            // First section -------------------------------------------
            this.firstMoveTimeline = new GSAP.timeline({
                scrollTrigger: {
                    // select which html section will act as a trigger for the scoll animation
                    trigger: ".first-move",
                    // select where the marker and start point will be
                    start: "top top",
                    // select where the marker and end point will be
                    end: "bottom bottom",
                    // plays animation as cursor scrolls instead of instantly and determines how long it takes animation to catch up to scroll
                    scrub: 0.6,
                    // provide responsive sizing by updating the functional value (x) everytime a refresh occurs
                    invalidateOnRefresh: true,
                },
            })
                .to(this.room.scale,
                    {
                        x: 0.1,
                        y: 0.1,
                        z: 0.1,
                    })

            // Second section -------------------------------------------
            this.secondMoveTimeline = new GSAP.timeline({
                scrollTrigger: {
                    // select which html section will act as a trigger for the scoll animation
                    trigger: ".second-move",
                    // select where the marker and start point will be
                    start: "top top",
                    // select where the marker and end point will be
                    end: "bottom bottom",
                    // plays animation as cursor scrolls instead of instantly and determines how long it takes animation to catch up to scroll
                    scrub: 0.6,
                    // provide responsive sizing by updating the functional value (x) everytime a refresh occurs
                    invalidateOnRefresh: true,
                },
            })
                .to(this.room.scale, {
                    x: 0.25,
                    y: 0.25,
                    z: 0.25
                }, 
                "same"
            )
                .to(this.room.position, {
                    // don't move the room on the x-axis
                    x: () => {
                        return 1.5;
                    },
                    // move the room forward relative to the windows height
                    z: () => {
                        return this.sizes.height * -0.0009;
                    },
                }, "same"
            )

                .to(this.rectLight, {
                    width: 0.33 * 2,
                    height: 0.75 * 2,
                }, 
                "same"
            )

            // if(this.spotLightOn){
                this.secondMoveTimeline.to(this.spotLight.position,
                    {
                        x: 0,
                        y: 150,
                        z: 100,
                    },
                    "same"
                )
                .set(this.spotLight,
                    {
                        intensity: 1.5,
                        distance: 400,
                    },
                    "same"
                );
            // }

            // Third section -------------------------------------------
            this.thirdMoveTimeline = new GSAP.timeline({
                scrollTrigger: {
                    // select which html section will act as a trigger for the scoll animation
                    trigger: ".third-move",
                    // select where the marker and start point will be
                    start: "top top",
                    // select where the marker and end point will be
                    end: "bottom bottom",
                    // plays animation as cursor scrolls instead of instantly and determines how long it takes animation to catch up to scroll
                    scrub: 0.6,
                    // provide responsive sizing by updating the functional value (x) everytime a refresh occurs
                    invalidateOnRefresh: true,
                },
            })
                .to(this.camera.orthographicCamera.position, {
                    // transform the camera 1.5 pixels up and 4.1 pixels to the left
                    y: 3.35,
                    x: 0.2,
            });
        });
        
        // play this for all window sizes
        // ScrollTriggers created here aren't associated with a particular media query, so they persist.

        matchMedia.add("all", () => {
            this.sections = document.querySelectorAll(".section");
            this.sections.forEach(section => {
                // loop through each section and select the progress.wrapper class within the section
                this.progressWrapper = section.querySelector(".progress-wrapper");
                // same thing as above but for the progress bar
                this.progressBar = section.querySelector(".progress-bar");

                // check which side of the screen the border is on and animate it
                if(section.classList.contains("right")){
                    GSAP.to(section,{
                        borderTopLeftRadius: 10,
                        scrollTrigger: {
                            trigger: section,
                            start: "top bottom",
                            end: "top top",
                            scrub: 0.6,
                        },
                    });
                    GSAP.to(section,{
                        borderBottomLeftRadius: 300,
                        scrollTrigger: {
                            trigger: section,
                            start: "bottom bottom",
                            end: "bottom top",
                            scrub: 0.6,
                        },
                    });
                }
                else{
                    GSAP.to(section,{
                        borderTopRightRadius: 10,
                        scrollTrigger: {
                            trigger: section,
                            start: "top bottom",
                            end: "top top",
                            scrub: 0.6,
                        },
                    });
                    GSAP.to(section,{
                        borderBottomRightRadius: 300,
                        scrollTrigger: {
                            trigger: section,
                            start: "bottom bottom",
                            end: "bottom top",
                            scrub: 0.6,
                        },
                    });
                }

                // create an animation that extends the progress bar as the website scrolls
                GSAP.from(this.progressBar, {
                    scaleY: 0,
                    scrollTrigger: {
                        trigger: section,
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        pin: this.progressWrapper,
                        pinSpacing: true,
                    },
                });
            });

            // Circle & room animations -------------------------------------------
            // First section -------------------------------------------
            this.firstCircle = new GSAP.timeline({
                scrollTrigger: {
                    // select which html section will act as a trigger for the scoll animation
                    trigger: ".first-move",
                    // select where the marker and start point will be
                    start: "top top",
                    // select where the marker and end point will be
                    end: "bottom bottom",
                    // plays animation as cursor scrolls instead of instantly and determines how long it takes animation to catch up to scroll
                    scrub: 0.6,
                },
            })
                .to(this.circleFirst.scale, {
                    x: 10,
                    y: 10,
                    z: 10,
                })

            // Second section -------------------------------------------
            this.secondCircle = new GSAP.timeline({
                scrollTrigger: {
                    // select which html section will act as a trigger for the scoll animation
                    trigger: ".second-move",
                    // select where the marker and start point will be
                    start: "top top",
                    // select where the marker and end point will be
                    end: "bottom bottom",
                    // plays animation as cursor scrolls instead of instantly and determines how long it takes animation to catch up to scroll
                    scrub: 0.6,
                },
            })
                .to(this.circleSecond.scale, {
                    x: 10,
                    y: 10,
                    z: 10,
                },
                "same"
                )
                // move house up as room scales so it doesn't scale into the floor
                .to(this.room.position, {
                    y: 0.7,
                },
                "same"
                )

            // Third section -------------------------------------------
            this.playThirdAnimation = false;
            this.thirdCircle = new GSAP.timeline({
                scrollTrigger: {
                    // select which html section will act as a trigger for the scoll animation
                    trigger: ".third-move",
                    // select where the marker and start point will be
                    start: "top top",
                    // select where the marker and end point will be
                    end: "bottom bottom",
                    // plays animation as cursor scrolls instead of instantly and determines how long it takes animation to catch up to scroll
                    scrub: 0.6,
                    onEnter: () => {
                        this.playThirdAnimation = true;
                    }
                },
            })
                .to(this.circleThird.scale, {
                    x: 10,
                    y: 10,
                    z: 10,
                })

            // Mini platform animations -------------------------------------------
            this.secondPartTimeline = new GSAP.timeline({
                scrollTrigger: {
                    // select which html section will act as a trigger for the scoll animation
                    trigger: ".third-move",
                    // select where the marker and start point will be
                    start: "center center",
                },
            });

            // not using a timeline and adding tweens to that timeline instead of default gsap imported objects because the children aren't always in the same exact order so using tweens could mess up the order of the animations
            // look through each children's childs and if it is the mini floor, transform it to the position set
            this.room.children.forEach(child => {
                if(child.name === "Mini_floor"){
                    // creating variables for the tweens so they can be added in a timeline
                    this.first = GSAP.to(child.position, {
                        x: -6.40554,
                        z: 13.4568,
                        duration: 0.3,
                    });
                }

                // because this command is inside the scene, its scale is relative to the scene, which is relative to the world (i.e. this is just setting the mailbox to the full scale of the room)
                if(child.name === "Mailbox"){
                    this.second = GSAP.to(child.scale, {
                        x: 1,
                        y: 1,
                        z: 1,
                        ease: "back.out(2)",
                        duration: 0.4,
                    });
                }
                if(child.name === "Lamp"){
                    this.third = GSAP.to(child.scale, {
                        x: 1,
                        y: 1,
                        z: 1,
                        ease: "back.out(2)",
                        duration: 0.4,
                    });
                }
                if(child.name === "FloorFirst"){
                    this.fourth = GSAP.to(child.scale, {
                        x: 1,
                        y: 1,
                        z: 1,
                        ease: "back.out(2)",
                        duration: 0.4,
                    });
                }
                if(child.name === "FloorSecond"){
                    this.fifth = GSAP.to(child.scale, {
                        x: 1,
                        y: 1,
                        z: 1,
                        ease: "back.out(2)",
                        duration: 0.4,
                    });
                }
                if(child.name === "FloorThird"){
                    this.sixth = GSAP.to(child.scale, {
                        x: 1,
                        y: 1,
                        z: 1,
                        ease: "back.out(2)",
                        duration: 0.4,
                    });
                }
                if(child.name === "Dirt"){
                    this.seventh = GSAP.to(child.scale, {
                        x: 1,
                        y: 1,
                        z: 1,
                        ease: "back.out(2)",
                        duration: 0.4,
                    });
                }
                if(child.name === "WelcomeSign"){
                    this.eighth = GSAP.to(child.position, {
                        y: 1,
                        duration: 1,
                        ease: "power4.out",
                    });
                }
            });
        this.secondPartTimeline.add(this.first)
        this.secondPartTimeline.add(this.second)
        this.secondPartTimeline.add(this.third)
        this.secondPartTimeline.add(this.fourth, "-=0.0.2")
        this.secondPartTimeline.add(this.fifth, "-=0.0.2")
        this.secondPartTimeline.add(this.sixth, "-=0.0.2")
        this.secondPartTimeline.add(this.seventh)
        this.secondPartTimeline.add(this.eighth, "-=0.1")
        });
    }

    
    resize(){
    }
    
    update(){

    }
}