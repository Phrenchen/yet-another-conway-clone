import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InstructionsComponent} from "./components/instructions/instructions.component";
import {ConwayPageComponent} from "./components/conway-page/conway-page.component";
import { GamePageComponent } from './components/game-page/game-page.component';

const routes: Routes = [
    {path: 'instructions', component: InstructionsComponent},
    {path: 'game', component: GamePageComponent},
    {path: '', component: ConwayPageComponent, pathMatch: 'full'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
