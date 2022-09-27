import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { BannersComponent } from './../shared-components/banners/banners.component';
import { BenefitsComponent } from './benefits/benefits.component';
import { UnificationHomeComponent } from './unification-home/unification-home.component';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { CustomReuseStrategy } from '../route-reuse-strategy';


const routes: Routes = [
  {
    path:"infinia" ,component:UnificationHomeComponent,
  },
  {
    path:"infinia/know-your-card" ,component:BenefitsComponent
  },
  


];

@NgModule({
  declarations: [
    UnificationHomeComponent,
    BenefitsComponent
  ],
  imports: [
    CommonModule,
    SharedComponentsModule,
    /* RouterModule.forChild(routes) */
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      onSameUrlNavigation: 'reload'
    }),
  ],
exports: [RouterModule],
providers:[ {
  provide: RouteReuseStrategy,
  useClass: CustomReuseStrategy,
}],
})
export class UnificationModule { }
