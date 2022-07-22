import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { commaSeparatorPipe} from 'src/app/shared/pipes/comma-separator.pipe';

@NgModule({
  declarations: [commaSeparatorPipe],
  imports: [
    CommonModule
  ],
  exports: [ commaSeparatorPipe
   
  ]
})
export class CommonfunctionModule { }
