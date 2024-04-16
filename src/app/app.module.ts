import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './components/header/header.component';
import {CgolMapComponent} from './components/cgol-map/cgol-map.component';
import {PatternListComponent} from './components/pattern-list/pattern-list.component';
import {MapNamePipe} from './pipes/map-name.pipe';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MapSizePipe} from './pipes/map-size.pipe';
import {InstructionsComponent} from './components/instructions/instructions.component';
import {ConwayPageComponent} from './components/conway-page/conway-page.component';
// import { CalculateMapProgressComponent } from './components/calculate-map-progress/calculate-map-progress.component';
// import { WorkerControlComponent } from './components/worker-control/worker-control.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        CgolMapComponent,
        PatternListComponent,
        MapNamePipe,
        MapSizePipe,
        InstructionsComponent,
        ConwayPageComponent,
        // CalculateMapProgressComponent,
        // WorkerControlComponent,
        // TODO: es ist kaputt. versuche den letzten lokalen stand hier einzufügen -> iCloud
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
