import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent,RedirectDialog,DisclaimerBottomSheetComponent ,bulkOrderdialogHeader} from './header.component';
import {FormBuilder, FormGroup} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { SlugifyPipe } from 'src/app/shared/pipes/slugify.pipe';
import { NospacePipe } from 'src/app/shared/pipes/nospace.pipe';
import { ClickOutsideModule } from 'ng-click-outside';
import { RedirectPopupModule } from 'src/app/redirect-popup/redirect-popup.module';

@NgModule({
  declarations: [HeaderComponent, SlugifyPipe, NospacePipe, bulkOrderdialogHeader,RedirectDialog,DisclaimerBottomSheetComponent],
  imports: [ FormsModule,CommonModule,ClickOutsideModule,RedirectPopupModule],
  exports: [ HeaderComponent,SlugifyPipe,NospacePipe ],
  entryComponents: [ bulkOrderdialogHeader,RedirectDialog,DisclaimerBottomSheetComponent ]
})
export class HeaderModule {}


