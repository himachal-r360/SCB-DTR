import { NgModule } from '@angular/core';
import { TravelSearchComponent,ConfirmationDialog,CaptchaDialog,seniorCitizenDilog } from './travel-search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';


import { NgxCaptchaModule } from 'ngx-captcha';
import { RedirectPopupModule } from 'src/app/redirect-popup/redirect-popup.module';

@NgModule({
  declarations: [
    TravelSearchComponent,ConfirmationDialog,CaptchaDialog,seniorCitizenDilog
  ],
  imports: [
    CommonModule,ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
     MatCheckboxModule,  MatInputModule,
    MatFormFieldModule, MatDatepickerModule,
    MatNativeDateModule,NgxCaptchaModule,RedirectPopupModule,MatSelectModule
  ],
  providers: [],
  exports: [TravelSearchComponent  ],
  entryComponents: [ConfirmationDialog,CaptchaDialog,TravelSearchComponent,seniorCitizenDilog]
})

export class TravelSearchModule { }
