import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { MathHelperService } from './math-helper.service';

@Injectable({
  providedIn: 'root'
})
export class ThreejsFactoryService {

  constructor(private mathHelper: MathHelperService) { }

  public createLineOfBoxes(amount: number, gap: THREE.Vector3 = new THREE.Vector3(10, 10, 10), randomRotation: boolean = true): THREE.Mesh[] {
    const boxes: THREE.Mesh[] = [];

    while(boxes.length < amount) {
      const box: THREE.Mesh = this.createBox();

      if(randomRotation) {
        box.position.x = gap.x * boxes.length;
        box.position.y = gap.y * boxes.length;
        box.position.z = gap.z * boxes.length;

        box.rotation.x = this.mathHelper.getRandomInt(0, 359);
        box.rotation.y = this.mathHelper.getRandomInt(0, 359);
        box.rotation.y = this.mathHelper.getRandomInt(0, 359);
      }
      boxes.push(box);
    }

    return boxes;
  }
  
  public createBox(size: THREE.Vector3 = new THREE.Vector3(1, 1, 1)): THREE.Mesh {
    const geometry: THREE.BoxGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
      const material: THREE.MeshStandardMaterial = this.createMaterial(Math.random() < .5);
    const sphere: THREE.Mesh = new THREE.Mesh(geometry, material);
    return sphere;
  }
  
  public createSphere(): THREE.Mesh {
    const geometry: THREE.SphereGeometry = new THREE.SphereGeometry(1, 9);
      const material: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
        color: 0xFF6347
      });
    const sphere: THREE.Mesh = new THREE.Mesh(geometry, material);
    return sphere;
  }

  public createTorus(): THREE.Mesh {
    const geometry: THREE.TorusGeometry = new THREE.TorusGeometry(10, 3, 16, 100);
      const material: THREE.MeshStandardMaterial = this.createMaterial(true);
    const torus: THREE.Mesh = new THREE.Mesh(geometry, material);
    return torus;
  }

  // MATERIALS
  public createMaterial(isAlive: boolean): THREE.MeshStandardMaterial {
    switch(isAlive) {
      case true:
        return new THREE.MeshStandardMaterial({
          color: 0x00FF00
        });
      case false:
      default: 
        return new THREE.MeshStandardMaterial({
          color: 0xFF0000
        });
    }
  }

  // LIGHTS
  public createPointLight(scene: THREE.Scene): THREE.PointLightHelper {
    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(20, 20,20 );
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(pointLight, ambientLight);

    const lightHelper = new THREE.PointLightHelper(pointLight);
    // scene.add(lightHelper);
    return lightHelper;
  } 

  // public createAmbientLight(scene: THREE.Scene): THREE.DirectionalLightHelper {
  //   const pointLight = new THREE.DirectionalLight(0xffffff);
  //   pointLight.position.set(20, 20,20 );
  //   const ambientLight = new THREE.AmbientLight(0xffffff);
  //   scene.add(pointLight, ambientLight);

  //   const lightHelper = new THREE.DirectionalLightHelper(pointLight);
  //   // scene.add(lightHelper);
  //   return lightHelper;
  // } 

}
