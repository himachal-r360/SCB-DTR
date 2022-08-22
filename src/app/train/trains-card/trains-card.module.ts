import { NgModule } from '@angular/core';
import { TrainscardComponent } from './trains-card.component';
import { CommonModule } from '@angular/common';
import {MatExpansionModule} from '@angular/material/expansion';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatDialogModule} from '@angular/material/dialog';
import { ConfirmationDialog, ConfirmationDialogclose,covidDialog} from '../trains-card/trains-card.component';
import { NgxSpinnerModule } from "ngx-spinner";



@NgModule({
  declarations: [
    TrainscardComponent,ConfirmationDialog,ConfirmationDialogclose,covidDialog
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    MatExpansionModule,
    NoopAnimationsModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatBottomSheetModule,
    MatDialogModule,
    NgxSpinnerModule
  ],
  providers: [],
  exports: [TrainscardComponent],
  entryComponents: [ConfirmationDialog,ConfirmationDialogclose,covidDialog]
})

export class TrainscardModule { }
