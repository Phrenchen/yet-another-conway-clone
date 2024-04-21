import {Component, OnInit} from '@angular/core';

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';


@Component({
  selector: 'app-three-dee-background',
  templateUrl: './three-dee-background.component.html',
  styleUrls: ['./three-dee-background.component.scss']
})
export class ThreeDeeBackgroundComponent implements OnInit{
  ngOnInit(): void {
    const scene: THREE.Scene = new THREE.Scene();
    const camera: THREE.Camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer: THREE.Renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('#bg') as HTMLCanvasElement,
    })
// renderer.setPixelratio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(30);
    renderer.render(scene, camera);

//
    const geometry: THREE.TorusGeometry = new THREE.TorusGeometry(10, 3, 16, 100);
    const material: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0xFF6347
    });
    const torus: THREE.Mesh = new THREE.Mesh(geometry, material);
    scene.add(torus);


    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(20, 20,20 );
    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(pointLight, ambientLight);

    const lightHelper = new THREE.PointLightHelper(pointLight);
    scene.add(lightHelper);

    const controls = new OrbitControls(camera, renderer.domElement);





// game loop ++++++++++++
    function animate() {
      requestAnimationFrame(animate);

      // torus.rotation.x += 0.01;
      torus.rotation.y += 0.005;
      // torus.rotation.z += 0.01;
      // torus.position.setX(torus.position.x + 0.05);
      // torus.position.setY(torus.position.y + 0.05);
      torus.position.setZ(torus.position.z - 0.03);


      controls.update();

      renderer.render(scene, camera);
    }
    animate();

    console.log('blubb')
  }

}
