import * as THREE from 'three';

export interface SceneConfig {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.Renderer;
}
