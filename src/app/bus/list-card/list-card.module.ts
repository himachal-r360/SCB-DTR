import { NgModule } from '@angular/core';
import { ListComponent } from './list-card.component';
import { CommonModule } from '@angular/common';
import {MatExpansionModule} from '@angular/material/expansion';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatChipsModule} from '@angular/material/chips';
import {ConfirmationDialog} from './list-card.component';
import { RemovespacePipe } from 'src/app/shared/pipes/removespace.pipe';
import { CommonfunctionModule } from 'src/app/common.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';

@NgModule({
  declarations: [
    ListComponent,ConfirmationDialog, RemovespacePipe
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
    MatChipsModule,
    MatProgressSpinnerModule,
    CommonfunctionModule,LoaderModule
  ],
  entryComponents: [ConfirmationDialog,],
  providers: [],
  exports: [ListComponent,RemovespacePipe]
})

export class ListModule { }
