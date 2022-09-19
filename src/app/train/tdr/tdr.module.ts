import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TdrComponent, tdragreementDialog, filetdragreementDialog } from './tdr.component';
import { MatExpansionModule, MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatSelectModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { tdrConfirmationDialog } from '../tdr/tdr.component';
import {MatDialogModule} from '@angular/material';
import {DatePipe} from '@angular/common';
import { TdrHistoryComponent } from './tdr-history/tdr-history.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material';
import {MatSortModule} from '@angular/material/sort';
import { MatDatepickerModule,MatNativeDateModule } from '@angular/material/datepicker';
import { RouterModule, Routes } from '@angular/router';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { MatRadioModule } from '@angular/material/radio'

@NgModule({
  declarations: [TdrComponent,tdrConfirmationDialog,tdragreementDialog, TdrHistoryComponent,filetdragreementDialog],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule,
    Ng4LoadingSpinnerModule,
    MatRadioModule
    

  ],
  exports:[TdrComponent],
  entryComponents:[tdrConfirmationDialog,tdragreementDialog,filetdragreementDialog],
  providers:[DatePipe]
})
export class TdrModule { }
