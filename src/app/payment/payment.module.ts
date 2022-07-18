import { NgModule } from '@angular/core';
import { PaymentComponent, dcemiDialog, PaywithpointsDialog, spcDialog, invalidpgdialog} from './payment.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxCleaveDirectiveModule } from 'ngx-cleave-directive';
import { CountdownModule } from 'ngx-countdown';
import { NgxSpinnerModule } from "ngx-spinner";
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings, RecaptchaFormsModule } from 'ng-recaptcha';
import { CommonfunctionModule } from 'src/app/common.module';
import { MaterialModule } from '../material.module'
import { CreditCardDirectivesModule } from 'angular-cc-library'; 
@NgModule({
  declarations: [
    PaymentComponent,dcemiDialog,PaywithpointsDialog,spcDialog,invalidpgdialog
  ],
  imports: [
    CommonModule, 
    MaterialModule,
    FormsModule,
    ReactiveFormsModule, MatInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatButtonModule, MatDialogModule,NgxCleaveDirectiveModule,MatSelectModule,MatRadioModule,CountdownModule,
    MatDatepickerModule,NgxSpinnerModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    CommonfunctionModule,CreditCardDirectivesModule,
  ],
  providers: [],
  exports: [PaymentComponent],

  entryComponents: [dcemiDialog,PaywithpointsDialog,spcDialog,invalidpgdialog],


})

export class PaymentModule { 
  constructor(private dateAdapter:DateAdapter<Date>) {
		dateAdapter.setLocale('en-in'); // DD/MM/YYYY
	}
}
