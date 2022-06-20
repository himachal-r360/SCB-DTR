import { Component, OnInit ,NgZone} from '@angular/core';
import { SimpleGlobal } from 'ng2-simple-global';
declare const annyang: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

fp_popup_control:number = 0;
customerInfo: any[];
customer_full_name:string;
public customerLogin: boolean=false;
public guestLogin: boolean=false;
showSearchBoxTop: boolean=false;
domainRedirect: string;
customeravailablepoints:any;customeravailableStatus:Boolean=false;
showdcEMI= false;
  dcemi_offer_image='';
  dcemi_offer_url='';  
  
  voiceActiveSectionDisabled: boolean = true;
	voiceActiveSectionError: boolean = false;
	voiceActiveSectionSuccess: boolean = false;
	voiceActiveSectionListening: boolean = false;
	voiceText: any;
    
  constructor(private sg: SimpleGlobal,private ngZone: NgZone) { 
  
       setTimeout(() => {
    //Check Laravel Seesion
        if(this.sg['customerInfo']){
         var customer_cookie;
          if(this.sg['customerInfo'].customer_cookie == 1)customer_cookie = 1;
            if(this.sg["customerInfo"]["guestLogin"]==true){
            this.guestLogin=true;
              this.customerLogin = false;
            }else{
          if(customer_cookie == 1){
               this.customerInfo = this.sg['customerInfo'];
               this.customer_full_name=this.customerInfo['firstname']+' '+this.customerInfo['lastname'];
             if(this.fp_popup_control==1 && sessionStorage.getItem("showfp")=="1"){
              this.showModal();  
              sessionStorage.setItem("showfp", "0");
              } 
  
              this.customerLogin = true;
              if (this.customerInfo.hasOwnProperty('ccustomer')){
                this.customeravailableStatus=true;
                this.customeravailablepoints=(Number(this.customerInfo['ccustomer'].points_available)).toLocaleString('en-IN'); 
                if(this.customerInfo['ccustomer'].card_variant)
                this.sg['card_variant'] = this.customerInfo['ccustomer'].card_variant;
                else
                 this.sg['card_variant'] = 'Other Credit/Debit Card';
              }else{
                this.customeravailableStatus=false;
                this.customeravailablepoints="";
                 this.sg['card_variant'] = 'Other Credit/Debit Card';
              }

		if(sessionStorage.getItem("showdcEMI")!="0"){
			this.showdcEMI=true;
			this.dcemi_offer_image=sessionStorage.getItem("dcemi_offer_image");
			this.dcemi_offer_url=sessionStorage.getItem("dcemi_offer_url");
			sessionStorage.setItem("showdcEMI", "0");

               }
      

          }else{
              this.customerInfo =[];
              this.customerLogin = false;
               this.sg['card_variant'] = 'Other Credit/Debit Card';
          }
        }  
        
      }

      
  }, 50);
  
  
  }

  ngOnInit(): void {
  }
  showModal() {
   /* this.modalService.open(this.modalContent, { centered: true, windowClass: 'flexi_popContent' }).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });*/
  }
  
  initializeVoiceRecognitionCallback(): void {
		annyang.addCallback('error', (err) => {
      if(err.error === 'network'){
        this.voiceText = "Internet is require";
        annyang.abort();
        this.ngZone.run(() => this.voiceActiveSectionSuccess = true);
      } else if (this.voiceText === undefined) {
				this.ngZone.run(() => this.voiceActiveSectionError = true);
				annyang.abort();
			}
		});

		annyang.addCallback('soundstart', (res) => {
      this.ngZone.run(() => this.voiceActiveSectionListening = true);
		});

		annyang.addCallback('end', () => {
      if (this.voiceText === undefined) {
        this.ngZone.run(() => this.voiceActiveSectionError = true);
				annyang.abort();
			}
		});

		annyang.addCallback('result', (userSaid) => {
			this.ngZone.run(() => this.voiceActiveSectionError = false);

			let queryText: any = userSaid[0];

			annyang.abort();

      this.voiceText = queryText;

			this.ngZone.run(() => this.voiceActiveSectionListening = false);
      this.ngZone.run(() => this.voiceActiveSectionSuccess = true);
		});
	}

	startVoiceRecognition(): void {
    this.voiceActiveSectionDisabled = false;
		this.voiceActiveSectionError = false;
		this.voiceActiveSectionSuccess = false;
    this.voiceText = undefined;

		if (annyang) {
			let commands = {
				'demo-annyang': () => { }
			};

			annyang.addCommands(commands);

      this.initializeVoiceRecognitionCallback();

			annyang.start({ autoRestart: false });
		}
	}

	closeVoiceRecognition(): void {
    this.voiceActiveSectionDisabled = true;
		this.voiceActiveSectionError = false;
		this.voiceActiveSectionSuccess = false;
		this.voiceActiveSectionListening = false;
		this.voiceText = undefined;

		if(annyang){
      annyang.abort();
    }
	}
  
  
}
