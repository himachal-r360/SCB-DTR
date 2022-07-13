import { NgModule } from '@angular/core';
import { CouponsComponent} from './coupons.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule,  MatButtonModule, MatDialogModule, MatRadioModule} from '@angular/material';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings, RecaptchaFormsModule } from 'ng-recaptcha';
import { CommonfunctionModule } from 'src/app/common.module';
import { MaterialModule } from '../../material.module'

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
    MatButtonModule, MatDialogModule,MatRadioModule,Ng4LoadingSpinnerModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    CommonfunctionModule,
  ],
  providers: [],
  exports: [CouponsComponent],

  entryComponents: [],


})

export class CouponsModule {}
