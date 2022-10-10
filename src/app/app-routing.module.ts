import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ForyouTabComponent } from './foryou-tab/foryou-tab.component';
import { PartnersComponent} from './partners/partners.component';
import { BannersComponent } from './shared-components/banners/banners.component';
import { RegaliaGoldModule } from './regalia-gold/regalia-gold.module';
import { SharedComponentsModule } from './shared-components/shared-components.module';
import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';
import { HotelListComponent } from './hotel/hotel-list/hotel-list.component';
import { UnificationModule } from './unification/unification.module';
const routes: Routes = [
  { path: '', loadChildren: () => import('./foryou-tab/foryou-tab.module').then(m => m.ForyouTabModule) },
  {
    path:"compare-fly" , component:HomeComponent
  },
    {
    path:"multicity" , component:HomeComponent
  },
    {
    path:"compare-stay" , component:HomeComponent
  },
    {
    path:"bus" , component:HomeComponent
  },
    {
    path:"train" , component:HomeComponent
  },
      {
    path:"train/pnr" , component:HomeComponent
  },

    {
    path:"regalia_gold/compare-fly" , component:HomeComponent
  },
    {
    path:"regalia_gold/multicity" , component:HomeComponent
  },
    {
    path:"regalia_gold/compare-stay" , component:HomeComponent
  },
    {
    path:"regalia_gold/bus" , component:HomeComponent
  },
    {
    path:"regalia_gold/train" , component:HomeComponent
  },
      {
    path:"regalia_gold/train/pnr" , component:HomeComponent
  },

  {
    path:"infinia/compare-fly" , component:HomeComponent
  },
    {
    path:"infinia/multicity" , component:HomeComponent
  },
    {
    path:"infinia/compare-stay" , component:HomeComponent
  },
    


    {
    path: 'partners',
    loadChildren: () => import('./partners/partners.module').then(m => m.PartnersModule)
  },
  {

    path: 'flights',
    loadChildren: () => import('./flight/flight.module').then(m => m.FlightModule)
  },
  {

    path: 'hotels',
    loadChildren: () => import('./hotel/hotel.module').then(m => m.HotelModule)
  },

  /* {

    path: 'infinia',
    loadChildren: () => import('./infinia/infinia.module').then(m => m.InfiniaModule)
  }, */
  {
    path: 'infinia',
    loadChildren: () => import('./unification/unification.module').then(m => m.UnificationModule)
  },

  {
    path: 'diners',
    loadChildren: () => import('./unification/unification.module').then(m => m.UnificationModule)
  },

  {
    path: 'foryou',
    loadChildren: () => import('./foryou-tab/foryou-tab.module').then(m => m.ForyouTabModule)
  },

  /* {
    path: 'regalia_gold',
    loadChildren: () => import('./regalia-gold/regalia-gold.module').then(m => m.RegaliaGoldModule),
  },
  {
    path: 'infinia',
    loadChildren: () => import('./regalia-gold/regalia-gold.module').then(m => m.RegaliaGoldModule),
  }, */

  //{ path: '404', component: Error404PageComponent },
  // otherwise redirect to 404
//  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [
    RegaliaGoldModule,
    UnificationModule,
    SharedComponentsModule,
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      onSameUrlNavigation: 'reload'
    })

    ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
