import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaywithpointsComponent } from './paywithpoints.component';
import {ConfirmationDialog} from './paywithpoints.component';
import { Ng5SliderModule } from 'ng5-slider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { FormsModule,ReactiveFormsModule }  from '@angular/forms';
import { CountdownModule } from 'ngx-countdown';


@NgModule({
  declarations: [PaywithpointsComponent,ConfirmationDialog],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    Ng5SliderModule,
    MatFormFieldModule,
    MatDatepickerModule, 
    MatNativeDateModule,
    CountdownModule    
  ],
  entryComponents: [ConfirmationDialog],
  exports: [MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,PaywithpointsComponent
  ],
  providers: [  
    MatDatepickerModule,  
  ],
})
export class PaywithpointsModule { }
