import * as THREE from "three";

import {EventEmitter} from "events";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader.js";
import Experience from "../Experience.js";

export default class Resources extends EventEmitter{
    // by importing assets into Experience.js, we can pull the assets array through Experience.js into Resources.js
    constructor(assets){
        // super constructor provides access to everything in EventEmitter
        super();
        this.experience = new Experience();
        this.renderer = this.experience.renderer;

        this.assets = assets;

        // this will hold all loaded items
        this.items = {};
        // this will return how many items are in queue to be loaded
        this.queue = this.assets.length;
        // the loaded counter this.queue will display to show queue
        this.loaded = 0;

        this.setLoader();
        this.startLoading();
    }
    setLoader(){
        // this object will contain all loaders
        this.loaders = {};
        // setting up loaders
        this.loaders.gltfLoader = new GLTFLoader();
        this.loaders.dracoLoader = new DRACOLoader();
        // setting the path to the draco folder that was copied into "public"
        this.loaders.dracoLoader.setDecoderPath("/draco/");
        // setting the gltf loader by using the draco loader to uncompress blender file
        this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader);
    }
    startLoading(){
        for(const asset of this.assets){
            if(asset.type === "glbModel"){
                // setting the correct loader to the asset and add a callback for the loaded file
                this.loaders.gltfLoader.load(asset.path, (file)=>{
                    this.singleAssetLoaded(asset, file);
                });
            }
            else if(asset.type === "videoTexture"){
                // hold everything related to html
                this.video = {};
                // hold everything related to the three.js configuration of video textures
                this.videoTexture = {};

                this.video[asset.name] = document.createElement("video");
                // set video source to the asset path
                this.video[asset.name].src = asset.path;
                // mute the video
                this.video[asset.name].muted = true;
                // make the video play from where it is in the model
                this.video[asset.name].playsInline = true;
                // make the video autoplay
                this.video[asset.name].autoplay = true;
                // make the video loop
                this.video[asset.name].loop = true;
                // make the video play automatically
                this.video[asset.name].play();

                // create a video texture using the div element above
                this.videoTexture[asset.name] = new THREE.VideoTexture(this.video[asset.name]);
                // depending on how UV is set up this will be true/false
                this.videoTexture[asset.name].flipY = false;
                this.videoTexture[asset.name].minFilter = THREE.NearestFilter;
                this.videoTexture[asset.name].magFilter = THREE.NearestFilter;
                this.videoTexture[asset.name].generateMipmaps = false;
                this.videoTexture[asset.name].colorSpace = THREE.SRGBColorSpace;

                this.singleAssetLoaded(asset, this.videoTexture[asset.name]);
            }
        }
    }
    singleAssetLoaded(asset, file){
        this.items[asset.name] = file;
        // everytime an asset is loaded from the file increases loaded counter by 1
        this.loaded++;

        // if statement to verify that all assets are loaded
        if(this.loaded === this.queue){
            this.emit("ready");
        }
    }
}