import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { Subject, filter, fromEvent, takeUntil } from 'rxjs';
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
  @Input() isPlaying: boolean = true;

  private sceneConfig!: SceneConfig;
  private allBoxes: Array<THREE.Mesh[]> = [];
  private controls?: OrbitControls;
  private destroy$$: Subject<void> = new Subject();

  private isPointerDown: boolean = true;
  private objectUnderPointer?: THREE.Intersection;

  constructor(
    private threeJsFactoryService: ThreejsFactoryService,
    private threeJsSceneService: ThreejsSceneService,
    private cgol: CgolService,
  ) {}

  ngOnInit(): void {
    this.sceneConfig  = this.threeJsSceneService.createScene(document.querySelector('#bg') as HTMLCanvasElement);

    const lightHelper = this.threeJsFactoryService.createPointLight(this.sceneConfig.scene);
    this.sceneConfig.scene.add(lightHelper);
    
    this.controls = new OrbitControls(this.sceneConfig.camera, this.sceneConfig.renderer.domElement);
    

    // observe keyboard input
    fromEvent(window, 'mousedown')
      .pipe()
      .subscribe(res => {
        console.log('mouse down');
        this.isPointerDown = true;
      });

    fromEvent(window, 'mouseup')
      .pipe()
      .subscribe(res => {
        console.log('mouse up');
        // this.isPointerDown = false;
      });


    // game loop ++++++++++++
    const animate = () => {
      requestAnimationFrame(animate);

      // raycast objects


      // rotate all boxes. remove?
      this.allBoxes.forEach((row, y) => {
        row.forEach((box, x) => {
          // box.rotation.x += .0001 * (x);
          // box.rotation.y += .01;
          // box.rotation.z += .01;
        });
      });

      this.controls?.update();

      // detect objects under pointer
      const newObjectsUnderPointer: THREE.Intersection[] = this.threeJsSceneService.getObjectsUnderPointer(this.sceneConfig.scene, this.sceneConfig.camera, this.allBoxes);
      let newObjectUnderPointer: THREE.Intersection | undefined = undefined;
      const lastObjectUnderPointer: THREE.Intersection | undefined = this.objectUnderPointer;

      if (newObjectsUnderPointer.length > 0) {
        // this.objectUnderPointer = newObjectsUnderPointer[0];
        newObjectUnderPointer = newObjectsUnderPointer[0];
        (newObjectUnderPointer.object as THREE.Mesh | any)?.material.color?.set( 0xffffff );
        // console.log('new object under pointer', newObjectUnderPointer);
        
      }


      if (lastObjectUnderPointer && lastObjectUnderPointer !== newObjectUnderPointer
      // && (this.threeJsSceneService.mouse.x != this.threeJsSceneService.lastMouse.x || 
      // this.threeJsSceneService.mouse.y != this.threeJsSceneService.lastMouse.y)
    ) {
        const tileName: string | undefined = this.objectUnderPointer?.object.name || undefined;
        
        console.log('tilename', tileName);
        if (tileName && tileName.length > 0) {
          // selectable-0,1
          // const coordinateStr = tileName.split('selectable-')[1]?.split(',');
          const parts = tileName.split('selectable-');
          console.log('tilename', tileName, parts);

          (this.objectUnderPointer?.object as THREE.Mesh | any)?.material.color?.set( 0x00ffff);  
          this.objectUnderPointer = newObjectUnderPointer;
          
        }
        
        

       
      }

     
      

      this.sceneConfig.renderer.render(this.sceneConfig.scene, this.sceneConfig.camera);
    }
    // game loop END +++++++++++++
    animate();  // trigger loop
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

      // TODO: @Input tickDuration
      const tickDuration = 100; // 1000 == 1fps / second
      
      this.cgol.playGame(this.mapConfig, tickDuration)
        .pipe(
          filter(() => !this.isPlaying),
          takeUntil(this.destroy$$),
        )
        .subscribe(nextGen => {
          // console.log('game tick:', nextGen);

          this.mapConfig = nextGen;
          this.updateMaterials(nextGen);
        });


        this.updateMaterials(this.mapConfig);

      }, 0
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
      lineOfBoxes = this.threeJsFactoryService.createLine(
        'box', 
        columns, 
        i,
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
        (box.material as THREE.MeshStandardMaterial | any).color?.set( mapConfig.cells[y][x] === 1 ? 0x00FF00 : 0xFF0000);
      });
    });
  }
}
