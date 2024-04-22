import {Component, OnInit} from '@angular/core';
import { SceneConfig } from 'src/app/interfaces/scene-config';
import { ThreejsFactoryService } from 'src/app/services/threejs-factory.service';
import { ThreejsSceneService } from 'src/app/services/threejs-scene.service';

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';


@Component({
  selector: 'app-three-dee-background',
  templateUrl: './three-dee-background.component.html',
  styleUrls: ['./three-dee-background.component.scss']
})
export class ThreeDeeBackgroundComponent implements OnInit{

  private sceneConfig!: SceneConfig;

  constructor(
    private threeJsFactoryService: ThreejsFactoryService,
    private threeJsSceneService: ThreejsSceneService
  ) {}

  ngOnInit(): void {
    this.sceneConfig  = this.threeJsSceneService.createScene(document.querySelector('#bg') as HTMLCanvasElement);

    const rows = 5;
    const columns = 15;
    const lineGap = 5;
  
    for(let i=0; i<rows; i++) {
      const lineOfBoxes: THREE.Mesh[] = this.threeJsFactoryService.createLineOfBoxes(columns, new THREE.Vector3(5, 0, 0));

      lineOfBoxes.forEach(box => {
        box.position.y = i * lineGap;
        this.sceneConfig.scene.add(box);
      });
  
    }


    // const box: THREE.Mesh = this.threeJsFactoryService.createBox();
    // this.sceneConfig.scene.add(box);


    const lightHelper = this.threeJsFactoryService.createPointLight(this.sceneConfig.scene);
    this.sceneConfig.scene.add(lightHelper);
    
    const controls = new OrbitControls(this.sceneConfig.camera, this.sceneConfig.renderer.domElement);






// game loop ++++++++++++
    const animate = () => {
      requestAnimationFrame(animate);

      // torus.rotation.x += 0.01;
      // torus.rotation.y += 0.005;
      // torus.rotation.z += 0.01;
      // torus.position.setX(torus.position.x + 0.05);
      // torus.position.setY(torus.position.y + 0.05);
      // torus.position.setZ(torus.position.z - 0.03);


      controls.update();

      this.sceneConfig.renderer.render(this.sceneConfig.scene, this.sceneConfig.camera);
    }
    animate();

    console.log('blubb')
  }

}
