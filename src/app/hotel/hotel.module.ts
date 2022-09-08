import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotelSearchModule } from './hotel-search/hotel-search.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { HotelListComponent } from './hotel-list/hotel-list.component';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { CustomReuseStrategy } from '../route-reuse-strategy';
import { InputMaskModule } from '@ngneat/input-mask';

const routes: Routes = [
  {path:"hotel-list",component:HotelListComponent}
]

@NgModule({
  declarations: [
    HotelListComponent
  ],
  imports: [
    CommonModule,
    InputMaskModule,
    HotelSearchModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      onSameUrlNavigation: 'reload'
    })

  ],
  exports: [RouterModule],
  providers:[ {
    provide: RouteReuseStrategy,
    useClass: CustomReuseStrategy,
  }]
})
export class HotelModule { }
