import { NgModule } from '@angular/core';
import { CouponsComponent} from './coupons.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings, RecaptchaFormsModule } from 'ng-recaptcha';
import { CommonfunctionModule } from 'src/app/common.module';
import { MaterialModule } from '../material.module'

@NgModule({
  declarations: [
    CouponsComponent
  ],
  imports: [
    CommonModule, 
    MaterialModule,
    FormsModule,
    ReactiveFormsModule, MatInputModule,
    MatFormFieldModule,
    MatButtonModule, MatDialogModule,MatRadioModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    CommonfunctionModule,
  ],
  providers: [],
  exports: [CouponsComponent],

  entryComponents: [],


})

export class CouponsModule {}
