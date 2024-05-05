import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subject, filter, fromEvent, takeUntil } from 'rxjs';
import { MapConfig } from 'src/app/interfaces/map-config';
import { SceneConfig } from 'src/app/interfaces/scene-config';
import { CgolService } from 'src/app/services/cgol.service';
import { MathHelperService } from 'src/app/services/math-helper.service';
import { ThreejsFactoryService } from 'src/app/services/threejs-factory.service';
import { ThreejsSceneService } from 'src/app/services/threejs-scene.service';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


@Component({
  selector: 'app-three-dee-background',
  templateUrl: './three-dee-background.component.html',
  styleUrls: ['./three-dee-background.component.scss']
})
export class ThreeDeeBackgroundComponent implements OnInit, OnChanges {

  @Input() mapConfig!: MapConfig;
  @Input() isPlaying: boolean = true;
  @Input() generationDuration: number = 5000;
  @Output() selectedCell: EventEmitter<number[]> = new EventEmitter<number[]>();

  private sceneConfig!: SceneConfig;
  private allBoxes: Array<THREE.Mesh[]> = [];
  private controls?: OrbitControls;
  private destroy$$: Subject<void> = new Subject();

  private isPointerDown: boolean = true;
  private objectUnderPointer?: THREE.Intersection;
  private activeCell?: THREE.Intersection;
  private activeCellCoordinates: number[] = [];

  private beavers: THREE.Mesh[] = [];

  constructor(
    private threeJsFactoryService: ThreejsFactoryService,
    private threeJsSceneService: ThreejsSceneService,
    private cgol: CgolService,
    private mathHelper: MathHelperService,
  ) { }

  ngOnInit(): void {
    this.sceneConfig = this.threeJsSceneService.createScene(document.querySelector('#bg') as HTMLCanvasElement);

    const lightHelper = this.threeJsFactoryService.createPointLight(this.sceneConfig.scene);
    this.sceneConfig.scene.add(lightHelper);

    this.controls = new OrbitControls(this.sceneConfig.camera, this.sceneConfig.renderer.domElement);

    this.createObjects();

    this.initEvents();

    // game loop ++++++++++++
    const animate = () => {
      requestAnimationFrame(animate);

      this.updateObjects();
      this.controls?.update();
      this.detectObjectSelection();

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

  private createObjects(): void {
    this.beavers = new Array(1).fill(0).map(() => {
      const beaver = this.threeJsFactoryService.createBeaver(new THREE.Vector3(2, 3, 2));
      // beaver.position.setX(this.mathHelper.getRandomInt(0, 10) + .5);
      // beaver.position.setY(this.mathHelper.getRandomInt(1, 1));
      // beaver.position.setZ(this.mathHelper.getRandomInt(0, 10) + .5);
      beaver.position.setX(-1.5);
      beaver.position.setY(0);
      beaver.position.setZ(-1.5);
      this.sceneConfig.scene.add(beaver);
      return beaver;
    });
  }

  private updateObjects(): void {
    // this.beavers.forEach(beaver => {
    //   //   beaver.rotateX(this.mathHelper.getRandomInt(1, 1000) / 100000);
    //   beaver.rotateY(this.mathHelper.getRandomInt(1, 1000) / 100000);
    //   //   beaver.rotateZ(this.mathHelper.getRandomInt(1, 1000) / 100000);
    // });

    // rotate all boxes. remove?
    // this.allBoxes.forEach((row, y) => {
    //   row.forEach((box, x) => {
    // box.rotation.x += .0001 * (x);
    // box.rotation.y += .01;
    // box.rotation.z += .01;
    //   });
    // });
  }

  // TODO: more than 2 states?
  private getCellState(objectName: string): boolean {
    // console.log('tilename', tileName);
    if (objectName && objectName.length > 0) {
      // selectable-0,1
      // const coordinateStr = tileName.split('selectable-')[1]?.split(',');
      // const parts = objectName.split('selectable-');

      // find config for the selected tile at position
      this.activeCellCoordinates = this.getCellCoordinates(objectName);

      return this.mapConfig.cells[this.activeCellCoordinates[0]][this.activeCellCoordinates[1]] == 1;
    }
    return false;
  }

  // TODO: refactor to use THREE.Vector2 ?
  private getCellCoordinates(objectName: string): number[] {
    const parts = objectName.split('selectable-');

    // find config for the selected tile at position
    return parts[1]
      .split(',')
      .map(coordinate => {
        return parseInt(coordinate);
      });
  }

  private detectObjectSelection(): void {
    // detect objects under pointer
    const newObjectsUnderPointer: THREE.Intersection[] = this.threeJsSceneService.getObjectsUnderPointer(this.sceneConfig.scene, this.sceneConfig.camera, this.allBoxes);

    if (newObjectsUnderPointer.length > 0) {
      // this.objectUnderPointer = newObjectsUnderPointer[0];
      if (newObjectsUnderPointer[0] !== this.objectUnderPointer) {
        if (this.objectUnderPointer) {
          const isAlive = this.getCellState(this.objectUnderPointer.object.name);
          (this.objectUnderPointer.object as THREE.Mesh | any)?.material.color?.set(isAlive ? 0x00ff00 : 0xff0000);
        }
      }

      this.objectUnderPointer = newObjectsUnderPointer[0];

      // (this.objectUnderPointer.object as THREE.Mesh | any)?.material.color?.set(0xffffff);
      // console.log('new object under pointer', newObjectUnderPointer);
    } else {
      // no object under pointer:
      // remove highlight from last object
      if (this.objectUnderPointer) {
        const isAlive = this.getCellState(this.objectUnderPointer.object.name);
        (this.objectUnderPointer.object as THREE.Mesh | any)?.material.color?.set(isAlive ? 0x00ff00 : 0xff0000);
        this.objectUnderPointer = undefined;
      }
    }

    if (!this.objectUnderPointer) {
      return;
    }

    const isAliveNew = this.getCellState(this.objectUnderPointer.object.name);
    // console.log('tilename', this.activeCellCoordinates, isAliveNew);
    // highlight pointer-over
    (this.objectUnderPointer.object as THREE.Mesh | any)?.material.color?.set(0x0000ff);


    // if(lastObjectUnderPointer && lastObjectUnderPointer !== this.objectUnderPointer) {
    //   (lastObjectUnderPointer.object as THREE.Mesh | any)?.material.color?.set(0xcccccc);
    // }
  }

  private initEvents(): void {
    fromEvent(window, 'click')
      .pipe()
      .subscribe(res => {
        // console.log('click', res);
        this.activateCurrentCell();
      });

    fromEvent(window, 'mousedown')
      .pipe()
      .subscribe(res => {
        // console.log('mouse down');
        this.isPointerDown = true;
      });

    fromEvent(window, 'mouseup')
      .pipe()
      .subscribe(res => {
        // console.log('mouse up');
        this.isPointerDown = false;
      });
  }

  private activateCurrentCell(): void {
    if (this.objectUnderPointer) {

      // (this.objectUnderPointer.object as THREE.Mesh | any)?.material.color?.set(0x0000ff);
      this.activeCell = this.objectUnderPointer;
      console.log('activate!°!', this.activeCell.object.name, this.getCellCoordinates(this.activeCell.object.name));
      
      this.selectedCell.emit(this.getCellCoordinates(this.activeCell.object.name));
    }
  }

  private startGame(): void {
    console.log('starting new game');

    // dispose old game
    if (this.allBoxes.length > 0) {
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

      this.cgol.playGame(this.mapConfig, this.generationDuration)
        .pipe(
          filter(() => this.isPlaying),
          takeUntil(this.destroy$$),
        )
        .subscribe(nextGen => {
          // console.log('game tick:', nextGen);

          this.mapConfig = nextGen;
          this.updateMaterials(nextGen);
        });


      // this.updateMaterials(this.mapConfig);

    }, 0);
  }

  private createBoxes(): void {
    const rows: number = this.mapConfig.cells.length;
    const columns: number = this.mapConfig.cells[0].length;
    const size: number = 1;
    const gap: number = size;
    const boxSize: number = .9;
    let lineOfBoxes: THREE.Mesh[];

    for (let i = 0; i < rows; i++) {
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
        (box.material as THREE.MeshStandardMaterial | any).color?.set(mapConfig.cells[y][x] === 1 ? 0x00FF00 : 0xFF0000);
      });
    });
  }
}
