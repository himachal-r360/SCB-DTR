import {Component,Inject} from '@angular/core';
import {APP_CONFIG, AppConfig} from '../../../configs/app.config';
import {environment} from '../../../../environments/environment';
import { SimpleGlobal } from 'ng2-simple-global';
@Component({
  selector: 'app-error404-page',
  templateUrl: './error404-page.component.html',
  styleUrls: ['./error404-page.component.scss']
})

export class Error404PageComponent {
appConfig: any; cdnUrl: any;
  constructor(@Inject(APP_CONFIG) appConfig: any,private sg: SimpleGlobal) {
    this.appConfig = appConfig;this.cdnUrl = environment.cdnUrl+this.sg['assetPath']; 
  }
}
