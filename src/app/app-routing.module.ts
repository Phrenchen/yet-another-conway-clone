import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InstructionsComponent} from "./components/instructions/instructions.component";
import {UrlaubBodenseeComponent} from "./components/urlaub-bodensee/urlaub-bodensee.component";
import {ConwayPageComponent} from "./components/conway-page/conway-page.component";

const routes: Routes = [
    {path: 'instructions', component: InstructionsComponent},
    {path: 'urlaub-bodensee', component: UrlaubBodenseeComponent},
    {path: '', component: ConwayPageComponent, pathMatch: 'full'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
