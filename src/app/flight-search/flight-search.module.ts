import { NgModule } from '@angular/core';
import { FlightSearchComponent } from './flight-search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DirectiveModule } from '../directives/directive.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';



@NgModule({
  declarations: [
    FlightSearchComponent
  ],
  imports: [
     CommonModule,
     ReactiveFormsModule,
    FormsModule,
    MatCheckboxModule,  
    MatInputModule,
    MatFormFieldModule, 
    MatDatepickerModule,
    MatSelectModule,
    DirectiveModule
  ],
  providers: [],
  exports: [FlightSearchComponent  ],
  entryComponents: []
})

export class FlightSearchModule { }
