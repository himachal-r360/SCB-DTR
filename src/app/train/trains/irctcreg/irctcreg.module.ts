import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IrctcregComponent } from './irctcreg.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatSelectModule,MatDialogModule } from '@angular/material';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import { PaymentsModule } from 'src/app/shared/components/payments/payments.module';
import { NgxCleaveDirectiveModule } from 'ngx-cleave-directive';
import { CountdownModule } from 'ngx-countdown';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { ConfirmationDialog } from '../../irctc-home/home.component';
import {ConfirmationDialog} from './irctcreg.component';
import {SuccessDialog} from './irctcreg.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import {MatDatepickerModule,MatNativeDateModule} from '@angular/material';
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
    PaymentsModule,
    FormsModule,
    DeviceDetectorModule.forRoot(),
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
