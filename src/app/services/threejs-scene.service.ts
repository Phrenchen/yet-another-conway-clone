import { Injectable } from '@angular/core';
import { SceneConfig } from '../interfaces/scene-config';

import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class ThreejsSceneService {

  constructor() { }

  public createScene(canvas: HTMLCanvasElement): SceneConfig {
    const scene: THREE.Scene = new THREE.Scene();
    const camera: THREE.Camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer: THREE.Renderer = new THREE.WebGLRenderer({
      canvas
    })


    const gridHelper = new THREE.GridHelper(100, 100);
    scene.add(gridHelper);

    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setX(0);
    camera.position.setY(20);
    camera.position.setZ(0);
    renderer.render(scene, camera);

    return {
      scene,
      camera,
      renderer
    }
  }
}
