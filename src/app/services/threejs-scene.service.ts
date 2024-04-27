import { Injectable } from '@angular/core';
import { SceneConfig } from '../interfaces/scene-config';

import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class ThreejsSceneService {

  private rayCaster: THREE.Raycaster = new THREE.Raycaster();
  
  public lastMouse: THREE.Vector2 = new THREE.Vector2();
  public mouse: THREE.Vector2 = new THREE.Vector2();

  constructor() {
    window.addEventListener('mousemove', (event: any) => this.onMouseMove(event), false);
   }

   private onMouseMove(event: Event | any) {
    // Calculate mouse position in normalized device coordinates
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
  }

  public getObjectsUnderPointer(scene: THREE.Scene, camera: THREE.Camera, targets: THREE.Mesh[][]): THREE.Intersection[] {
    this.rayCaster.setFromCamera(this.mouse, camera);
    

    // Calculate objects intersecting the picking ray
    let intersects: any[] = [];

    targets.forEach(row => {
      const rowIntersects: any[] = this.rayCaster.intersectObjects(row).filter((intersect: THREE.Intersection) => {
        return true; // intersect.object.name.includes('selectable');
      });
      // check if objects are supposed to be hoverable



      if(rowIntersects.length > 0) {
        intersects = [...intersects, ...rowIntersects];
      }

      // row.forEach(box => {

      // });
    });

      // = this.rayCaster.intersectObjects(scene.children);

     // If there are intersections, handle hover
     if (intersects.length > 0) {
      // console.log('woohhohooo ', intersects.length);
      
         // Handle hover effect for intersected object(s)
         // For example, change color or scale
        //  intersects[0].object.material.color.set(0xff0000);
     } else {
         // Reset hover effect for all objects when not hovering
        //  scene.children.forEach(function (object) {
        //      object.material.color.set(0xffffff);
        //  });
     }
 

    return intersects;
  }

  public createScene(canvas: HTMLCanvasElement): SceneConfig {
    const scene: THREE.Scene = new THREE.Scene();
    const camera: THREE.Camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer: THREE.Renderer = new THREE.WebGLRenderer({
      canvas
    })


    const gridHelper = new THREE.GridHelper(100, 100);
    // scene.add(gridHelper);

    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setX(0);
    camera.position.setY(20);
    camera.position.setZ(0);
    // camera.lookAt(new THREE.Vector3(0, 0, 0));
    renderer.render(scene, camera);

    return {
      scene,
      camera,
      renderer
    }
  }
}
