import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { from } from 'rxjs';
import { TrainsTravellerComponent,BottomSheetComponent,TravelInsuranceDialog, newUserValidate, covidconfirmation,ConfirmationDialog,ErrorDialog,ConfirmationDialogclose,ConfirmationDialogNew,passportDialog,userIDforgot } from './travellers.component';

import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatNativeDateModule, NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import { PaymentModule } from 'src/app/payment/payment.module';
import { NgxCleaveDirectiveModule } from 'ngx-cleave-directive';
import { CountdownModule } from 'ngx-countdown';
import { FoodsChoicesPipe } from 'src/app/shared/pipes/irctc/foods-choices.pipe';
import { NgxCaptchaModule } from 'ngx-captcha';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from "ngx-spinner";
import { DatePipe } from '@angular/common';
import { CouponsModule } from 'src/app/coupons/coupons.module';


@NgModule({
  declarations: [
    TrainsTravellerComponent,ConfirmationDialog,ErrorDialog,FoodsChoicesPipe,BottomSheetComponent,TravelInsuranceDialog,newUserValidate,
    ConfirmationDialogclose,ConfirmationDialogNew,passportDialog,userIDforgot,covidconfirmation
  ],
  imports: [
    CommonModule,
    MatExpansionModule,
    NoopAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    ReactiveFormsModule,
    MatDialogModule,
    NgxCleaveDirectiveModule,
    CountdownModule,
    PaymentModule,
    FormsModule,
    NgxCaptchaModule,
    NgbModule,
    NgxSpinnerModule,
    CouponsModule
  ],
  entryComponents: [ConfirmationDialog,ErrorDialog,BottomSheetComponent,TravelInsuranceDialog,newUserValidate,ConfirmationDialogclose,ConfirmationDialogNew,passportDialog,userIDforgot,covidconfirmation],
  exports: [
    TrainsTravellerComponent,FoodsChoicesPipe
  ],
  providers: [  
    MatDatepickerModule,DatePipe
  ],
})
export class TrainsTravellerModule { }
