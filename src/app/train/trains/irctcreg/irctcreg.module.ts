import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IrctcregComponent } from './irctcreg.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';

import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import { NgxCleaveDirectiveModule } from 'ngx-cleave-directive';
import { CountdownModule } from 'ngx-countdown';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {ConfirmationDialog} from './irctcreg.component';
import {SuccessDialog} from './irctcreg.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { MatDatepickerModule } from '@angular/material/datepicker';

import {MatNativeDateModule, NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';

import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';


@NgModule({
  declarations: [ IrctcregComponent ,ConfirmationDialog,SuccessDialog],
  imports: [
    CommonModule,
    MatExpansionModule,
    NoopAnimationsModule,
    MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    ReactiveFormsModule,
    MatDialogModule,
    NgxCleaveDirectiveModule,
    CountdownModule,
    FormsModule,
    NgbModule,
    NgxCaptchaModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RecaptchaModule,RecaptchaFormsModule
  ],
  entryComponents: [ConfirmationDialog,SuccessDialog],
  exports: [ IrctcregComponent ],
  providers: [  
    MatDatepickerModule,  
  ],
})
export class IrctcregModule { }
