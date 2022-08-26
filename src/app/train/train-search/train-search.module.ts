import { NgModule } from '@angular/core';
import { TrainSearchComponent , CaptchaDialog, DialogOverviewExampleDialog,ConfirmationDialog } from './train-search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DirectiveModule } from '../../directives/directive.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import {APP_CONFIG, AppConfig} from '../../configs/app.config';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxCaptchaModule } from 'ngx-captcha';

@NgModule({
  declarations: [
    TrainSearchComponent,ConfirmationDialog,CaptchaDialog,DialogOverviewExampleDialog
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
    DirectiveModule,NgxCaptchaModule,MatDialogModule
  ],
  providers: [MatDatepickerModule, {provide: APP_CONFIG, useValue: AppConfig}],
  exports: [TrainSearchComponent  ],
   entryComponents: [ConfirmationDialog,CaptchaDialog,DialogOverviewExampleDialog],
})

export class TrainSearchModule { }
