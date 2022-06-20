import { Component, Input, OnInit, OnChanges,Inject} from '@angular/core'; 
import {environment} from '../../environments/environment';
import { SimpleGlobal } from 'ng2-simple-global';
import { DeviceDetectorService } from 'ngx-device-detector';
declare var $: any;

@Component({
  selector: 'app-redirect-popup',
  templateUrl: './redirect-popup.component.html',
  styleUrls: ['./redirect-popup.component.scss']
})
export class RedirectPopupComponent implements OnChanges {
        @Input() redirectPopupPartner: any[];
        @Input() redirectPopupType: any[];
        @Input() redirectPopupImpmessage: any[];
        @Input() redirectPopupMessage: any[];
        @Input() redirectPopupUrl: any[];
        @Input() redirectPopupTrigger;
        @Input() redirectPopup;  
        @Input() redirectPopupTriggerTimestamp;
        domainRedirect: string;
        @Input() redirectPopupHeader;
 deviceInfo = null;

  constructor(private sg: SimpleGlobal,private deviceService: DeviceDetectorService) {
  this.domainRedirect=environment.MAIN_SITE_URL+this.sg['domainPath'];
  }



    ngOnChanges() {
       this.deviceInfo = this.deviceService.getDeviceInfo();
       
      if(this.deviceService.isMobile()){
      $('.lgpopup').addClass('mdis');
      $('.lgpopupbody').addClass('mdisbody');
       $('.lgpopuptop').addClass('mdistop');
      
      }
      if(this.redirectPopupTrigger==1){
       if(this.redirectPopup==1){
        $('#redirectPopupTitle').html(this.redirectPopupHeader);
        $('#redirectPopupMessage').html(this.redirectPopupMessage);
        if(this.redirectPopupImpmessage){
        $('#redirectPopupMessageL').show();
        $('#redirectPopupImpmessage').html(this.redirectPopupImpmessage);
       } else{
        $('#redirectPopupMessageL').hide();
        }
        $(".redirectPopupUrl").attr("href", this.redirectPopupUrl);
        $('.redirection_popup').trigger('click');
       }else if(this.redirectPopup==3){
        $(".redirectPopupUrlR").attr("href", this.redirectPopupUrl);
        $(".redirectPopupUrlR").attr("target", '_blank')
        $('.redirection_dis_popup').trigger('click');
       }else{
          $(".redirectPopupUrlR").attr("href", this.redirectPopupUrl);
        $('.redirection_dis_popup').trigger('click');
       }
       }
  }

     closePopup(){
     $('.close-popup').trigger('click');
     }
     
     

}


