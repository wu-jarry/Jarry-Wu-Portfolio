import {EventEmitter} from "events";

export default class Time extends EventEmitter{
    constructor(){
        // super constructor provides access to everything in EventEmitter
        super();
        // the time this experience was initiated
        this.start = Date.now();
        this.current = this.start
        // time passed since initiating experience
        this.elapsed = 0;
        // time between each frame (16 milisec between each frame at 60fps)
        this.delta = 16;

        this.update();
    }
 
    update(){
        // get the time 1 after the "this.current"
        const currentTime = Date.now();
        // subtracting currentTime by the time 1 frame after provides delta between frames
        this.delta = currentTime - this.current;
        this.current = currentTime;
        // used to play an animation x seconds after website start
        this.elapsed = this.current - this.start;

        this.emit("update");
        window.requestAnimationFrame(() => this.update());
    }
}