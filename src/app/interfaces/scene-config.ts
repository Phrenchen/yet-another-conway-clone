import * as THREE from 'three';

export interface SceneConfig {
    scene: THREE.Scene;
    camera: THREE.Camera;
    renderer: THREE.Renderer;
}
