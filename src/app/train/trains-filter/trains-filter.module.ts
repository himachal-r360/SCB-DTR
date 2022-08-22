import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TrainsFilterComponent } from './trains-filter.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';


import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TrainsFilterComponent
  ],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatButtonModule, MatCheckboxModule,FormsModule,NgbModule
  ],
  bootstrap: [TrainsFilterComponent],
  exports: [
    TrainsFilterComponent
  ]
})
export class TrainsFilterModule{ }
