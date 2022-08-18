import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheet,MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import {APP_CONFIG, AppConfig} from '../../../configs/app.config';
import {environment} from '../../../../environments/environment';
import { SimpleGlobal } from 'ng2-simple-global';
@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.scss']
})
export class CheckoutBottomSheetComponent implements OnInit {
appConfig: any;  cdnUrl: any;
  //btnSheetStatus:Boolean=true;
  constructor(@Inject (MAT_BOTTOM_SHEET_DATA) public data: any, private _bottomSheet: MatBottomSheet,@Inject(APP_CONFIG) appConfig: any,private sg: SimpleGlobal ) { this.appConfig = appConfig;this.cdnUrl = environment.cdnUrl+this.sg['assetPath']; }

  ngOnInit() {
  }
  closeBottomSheet(){
		this._bottomSheet.dismiss();
		event.preventDefault();
	 }


}
