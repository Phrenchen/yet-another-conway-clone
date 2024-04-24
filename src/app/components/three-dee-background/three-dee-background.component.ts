import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MapConfig } from 'src/app/interfaces/map-config';
import { SceneConfig } from 'src/app/interfaces/scene-config';
import { CgolService } from 'src/app/services/cgol.service';
import { ThreejsFactoryService } from 'src/app/services/threejs-factory.service';
import { ThreejsSceneService } from 'src/app/services/threejs-scene.service';

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';


@Component({
  selector: 'app-three-dee-background',
  templateUrl: './three-dee-background.component.html',
  styleUrls: ['./three-dee-background.component.scss']
})
export class ThreeDeeBackgroundComponent implements OnInit, OnChanges{

  @Input() mapConfig!: MapConfig;

  private sceneConfig!: SceneConfig;

  private allBoxes: Array<THREE.Mesh[]> = [];
  private allBoxesCopy: Array<THREE.Mesh[]> = this.allBoxes;

  private controls?: OrbitControls;

  private destroy$$: Subject<void> = new Subject();

  constructor(
    private threeJsFactoryService: ThreejsFactoryService,
    private threeJsSceneService: ThreejsSceneService,
    private cgol: CgolService,
  ) {}

  ngOnInit(): void {
    this.sceneConfig  = this.threeJsSceneService.createScene(document.querySelector('#bg') as HTMLCanvasElement);


  //   const rows: number = this.mapConfig.cells.length;
  //   const columns: number = this.mapConfig.cells[0].length;
  //   const size: number = 1;
  //   const gap: number = size;
  //   const boxSize: number = .9;
  //   let lineOfBoxes: THREE.Mesh[];

  //   for(let i=0; i<rows; i++) {
  //     lineOfBoxes = this.threeJsFactoryService.createGrid(
  //       'box', 
  //       columns, 
  //       new THREE.Vector3(boxSize, boxSize, boxSize),
  //       new THREE.Vector3(0, 0, gap)
  //   );

  //   this.allBoxes = [...this.allBoxes, lineOfBoxes];
  //   lineOfBoxes.forEach(box => {
  //     box.position.setX(i * gap);
  //     this.sceneConfig.scene.add(box);
  //   });
  // }

    this.allBoxesCopy = [...this.allBoxes]; // todo: avoid cloning large array

    const lightHelper = this.threeJsFactoryService.createPointLight(this.sceneConfig.scene);
    this.sceneConfig.scene.add(lightHelper);
    
    this.controls = new OrbitControls(this.sceneConfig.camera, this.sceneConfig.renderer.domElement);
  
    // this.startGame();
    


// game loop ++++++++++++
    const animate = () => {
      requestAnimationFrame(animate);

      this.allBoxes.forEach((row, y) => {
        row.forEach((box, x) => {
          box.rotation.x += .0001 * (y + x);
          // box.rotation.y += .01;
          // box.rotation.z += .01;
        });
      });


      this.controls?.update();

      this.sceneConfig.renderer.render(this.sceneConfig.scene, this.sceneConfig.camera);
    }
    animate();

    console.log('*** started animation loop ***');
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.destroy$$.next();

    console.log('start new game?');
    
    this.startGame();
    // this.updateMaterials();
  }

  private startGame(): void {
    console.log('starting new game');
    
    // dispose old game
    if(this.allBoxes.length > 0) {
      this.allBoxes.forEach(row => {
        row.forEach(box => {
          this.sceneConfig.scene.remove(box);
        });
      });

      this.allBoxes = [];
      console.log('disposed old game.');
    }

    setTimeout(() => {
      this.createBoxes();

      const gameTickDelay = 1000; // 1000 == 1fps / second
      
      this.cgol.playGame(this.mapConfig, gameTickDelay)
        .pipe(
          takeUntil(this.destroy$$),
        )
        .subscribe(nextGen => {
          // console.log('game tick:', nextGen);

          this.mapConfig = nextGen;
          this.updateMaterials(nextGen);
        });


        this.updateMaterials(this.mapConfig);

      }, 1000
    );
  }

  private createBoxes(): void {
    const rows: number = this.mapConfig.cells.length;
    const columns: number = this.mapConfig.cells[0].length;
    const size: number = 1;
    const gap: number = size;
    const boxSize: number = .9;
    let lineOfBoxes: THREE.Mesh[];

    for(let i=0; i<rows; i++) {
      lineOfBoxes = this.threeJsFactoryService.createGrid(
        'box', 
        columns, 
        new THREE.Vector3(boxSize, boxSize, boxSize),
        new THREE.Vector3(0, 0, gap)
      );

      this.allBoxes = [...this.allBoxes, lineOfBoxes];
      lineOfBoxes.forEach(box => {
        box.position.setX(i * gap);
        this.sceneConfig.scene.add(box);
      });
    }
  }

  private updateMaterials(mapConfig: MapConfig): void {
    this.allBoxes.forEach((row, y) => {
      row.forEach((box, x) => {
        box.material = this.threeJsFactoryService.createMaterial(mapConfig.cells[y][x] === 1);
      });
    });
  }
}
