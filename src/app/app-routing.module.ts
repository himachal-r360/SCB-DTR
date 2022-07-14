import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlightListComponent } from './flight/flight-list/flight-list.component';
import { HomeComponent } from './home/home.component';
import { ForyouTabComponent } from './foryou-tab/foryou-tab.component';
import {PartnersComponent} from './partners/partners.component'
const routes: Routes = [
  {
    path:"" , component:HomeComponent
  },
  {
    path:"home" , component:HomeComponent 
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
    path: 'foryou',
    loadChildren: () => import('./foryou-tab/foryou-tab.module').then(m => m.ForyouTabModule)
  },
   {
    path: 'diners/foryou',
    loadChildren: () => import('./foryou-tab/foryou-tab.module').then(m => m.ForyouTabModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
