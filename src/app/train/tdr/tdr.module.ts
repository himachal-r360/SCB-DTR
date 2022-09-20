import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TdrComponent, tdragreementDialog, filetdragreementDialog } from './tdr.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { tdrConfirmationDialog } from '../tdr/tdr.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import {DatePipe} from '@angular/common';
import { TdrHistoryComponent } from './tdr-history/tdr-history.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterModule, Routes } from '@angular/router';
import { MatRadioModule } from '@angular/material/radio'
import {MatNativeDateModule, NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { NgxSpinnerModule } from "ngx-spinner";
import {MatDialogModule } from '@angular/material/dialog';
@NgModule({
  declarations: [TdrComponent,tdrConfirmationDialog,tdragreementDialog, TdrHistoryComponent,filetdragreementDialog],
  imports: [
    CommonModule,
    MatExpansionModule,NgxSpinnerModule,MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSliderModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule,
    MatRadioModule
    

  ],
  exports:[TdrComponent],
  entryComponents:[tdrConfirmationDialog,tdragreementDialog,filetdragreementDialog],
  providers:[DatePipe]
})
export class TdrModule { }
