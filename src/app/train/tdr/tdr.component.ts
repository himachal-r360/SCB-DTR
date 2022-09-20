import { Component, OnInit, Input,Inject } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { environment } from '../../../environments/environment';
import { RestapiService } from '../../shared/services/restapi.service';
import { EncrDecrService } from '../../shared/services/encr-decr.service';
import { HttpClient, HttpHeaders, HttpErrorResponse , HttpParams} from '@angular/common/http';
import { SimpleGlobal } from 'ng2-simple-global';
import {MatSelectModule} from '@angular/material/select';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule,FormArray,FormControl } from '@angular/forms';
import { IrctcApiService } from '../../shared/services/irctc.service';
import { DOCUMENT } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import { DatePipe } from '@angular/common';
//import { VALID } from '@angular/forms/src/model';
import { NgxSpinnerService } from "ngx-spinner";
import { AppConfig } from '../../configs/app.config';
import { AppConfigService } from '../../app-config.service';
import { DeviceDetectorService } from 'ngx-device-detector';
export interface DialogData {
  messageData: string;
  showC: boolean;
}
@Component({
  selector: 'app-tdr',
  templateUrl: './tdr.component.html',
  styleUrls: ['./tdr.component.scss']
})
export class TdrComponent implements OnInit {
cdnUrl: any;
checkRAC:any;
  REWARD_CUSTOMERID: string;
  REWARD_EMAILID: string;
  REWARD_MOBILE: string;
  REWARD_FIRSTNAME: string;
  REWARD_LASTNAME: string;
  XSRFTOKEN: string;
  fromstn:any;
  tostn:any;
  pnrForm: FormGroup;
  pnrID:string;
  tid:string;
  tdrResponse:any;
  tdrlen:any;
  //stationsdump:any=[];
  passdata:any=[];
  trainfrom:string;
  trainto:string;
  checkedList:any = [];
  showdetails:boolean;
  selectedreason:any;
  tdrdata:any;
  tdrsubmitresp:any;
  tdrReasons:any;
  checkerror:boolean;
  reasonerror:boolean;
  paramdata:any;
  errormesssage:boolean;
  urlParams:any
  sendreason:any;
  tdrpass:boolean = false;
  tdrHistoryData:any;
  tdrfiling:boolean = false;
  historyshow:boolean = false;
  tdrFetchingsubmitted:boolean = false;
  partnerresp:any;
  pnr:any;
  journeyClass:any;
  journeyQuota:any;
  template: string = '<div class="app-loading-new"><div class="logo"></div></div>';
  chartStatus:any;
  pnrsearchparam:any;
  selectTDRReasonForm:any;
  showwarningmsg:boolean= false;
  submitShowwarningmsg:boolean=false;
  iscancelallowed:boolean=true;
  isguestUser:string;
  selection: string = '1';
  placeholderValue:string='PNR';
  CheckedValue:any;
  dynamiclength:any;
  pnrnumber:any;
  tdrshowtermsConditions:any;
  domainName:any;
  filetdrURL:any;
  isMobile:boolean=false;
 

  @Input('stationsdump') stationsdump;
    domainRedirect: string;domainPath:string;
    customerInfo:any[];
      serviceSettings:any;
  constructor(private deviceService: DeviceDetectorService,private spinnerService: NgxSpinnerService,private routeactive: ActivatedRoute,private datePipe: DatePipe,private dialog: MatDialog,private fb: FormBuilder,public _irctc: IrctcApiService,public rest: RestapiService, private EncrDecr: EncrDecrService, private http: HttpClient,private sg: SimpleGlobal,@Inject(DOCUMENT) private document: any, private router: Router, public overlay: Overlay,private appConfigService:AppConfigService) {
   this.serviceSettings=this.appConfigService.getConfig();
    this.stationsdump =  require('src/assets/data/stations.json');
    this.domainName = this.sg['domainName'];
    this.domainPath=this.sg['domainPath'];
    this.isMobile = this.deviceService.isMobile();

   if(this.router.url == "/"+this.domainPath+"train/filetdr"){
    this.tdragreementPopup();
   }
  
   }
  ngOnInit() {



    this.tdrReasons = [
        {'id':1,'value':'Train late >3 hours & passenger not travelled'},
        {'id':2,'value':'Difference of fare in case proper coach not attached and passenger has to travel in lower class'},
        {'id':3,'value':'AC Failure'},
        {'id':4,'value':'All CNF passengers not travelled'},
        {'id':5,'value':'Train diverted & passenger not travelled'},
        {'id':6,'value':'Train diverted & train not touching boarding station'},
        {'id':7,'value':'Train diverted & train not touching destination station'},
        {'id':8,'value':'Party partially confirmed/waitlisted and waitlisted passengers did not travel'},
        {'id':9,'value':'Party partially confirmed/waitlisted and all passengers did not travel'},
        {'id':10,'value':'Party partially travelled'},
        {'id':11,'value':'Passenger not travelled as reservation provided in lower class'},
        {'id':12,'value':'Passenger not travelled due to coach damage'},
        {'id':13,'value':'Train terminated short of destination'},
        {'id':14,'value':'After charting no room provided'},
        {'id':15,'value':'Change in reservation status from confirmed to waitlisted/part waitlisted/RAC after chart preparation'},
        {'id':16,'value':'Party could not cancel because chart prepared at originating or previous remote location'},
        {'id':17,'value':'Passenger not travelled due to ticket in RAC after chart preparation'},
        {'id':18,'value':'Excess fare charged by TTE'},
        {'id':19, 'value':'Travelled without proper ID proof'}

    ];

  //user log-in information
        if(this.serviceSettings.DOMAIN_SETTINGS[this.sg['domainName']]['TRAIN']!=1){
     this.router.navigate(['/**']);
   }
  
    this.pnrForm = this.fb.group({
      pnrnumber:new FormControl(''),
      tdrbuttselection:new FormControl('1')
    }); 

    this.selectTDRReasonForm = this.fb.group({
      selectReason:['']
    })

    
  
    
    this.cdnUrl = environment.cdnUrl;
   
    this.domainRedirect=environment.MAIN_SITE_URL+this.domainPath;

  
           setTimeout(() => {
    //Check Laravel Seesion
        if(this.sg['customerInfo']){
          this.customerInfo = this.sg['customerInfo'];
       if(this.customerInfo["org_session"]==1){
          setTimeout(function() { this.validateUser = false;}.bind(this), 1000);
        
          this.REWARD_CUSTOMERID = this.customerInfo["id"];
          this.REWARD_EMAILID = this.customerInfo["email"];
          this.REWARD_MOBILE = this.customerInfo["mobile"];
          this.REWARD_FIRSTNAME = this.customerInfo["firstname"];
          this.REWARD_LASTNAME = this.customerInfo["lastname"];
          this.XSRFTOKEN = this.customerInfo["XSRF-TOKEN"];
          this.isguestUser = this.customerInfo["guestLogin"];
          var getaddresspostparam = {
          "customerId": this.REWARD_CUSTOMERID,
          "programName": this.sg['domainName']
          };
        } else {
          setTimeout(function() { this.validateUser = false;}.bind(this), 1000);
          this.REWARD_CUSTOMERID = '';
          this.REWARD_EMAILID = '';
          this.REWARD_MOBILE = '';
          this.REWARD_FIRSTNAME = '';
          this.REWARD_LASTNAME = '';
          this.XSRFTOKEN = 'NULL';
          if (environment.localInstance == 0) {
            this.document.location.href = environment.MAIN_SITE_URL+this.sg['domainPath'] + 'check-login';
          }
        }
    }else{
      setTimeout(function() { this.validateUser = false;}.bind(this), 1000);
      this.REWARD_CUSTOMERID = '';
      this.REWARD_EMAILID = '';
      this.REWARD_MOBILE = '';
      this.REWARD_FIRSTNAME = '';
      this.REWARD_LASTNAME = '';
      this.XSRFTOKEN = 'NULL';
      if (environment.localInstance == 0) {
        this.document.location.href = environment.MAIN_SITE_URL+this.sg['domainPath'] + 'check-login';
      }
   }
     }, 50);
    this.getcheckboxValues();
  }
 
  get formControls() { 
    return this.pnrForm.controls; 
  }

  getcheckboxValues(){
    // const dynamicpnrField  = this.pnrForm.get('tdrbuttselection').value;
    // console.log(this.selection)
    this.buttonvalues.valueChanges.subscribe(checked => {
      // console.log(Number(checked))
      // [Validators.minLength(15),Validators.pattern("^(?!0+$)[0-9]{1,15}$")]
      this.CheckedValue = Number(checked)
      if(this.CheckedValue == 1 ){
        this.placeholderValue = 'PNR';
        this.pnrForm.get('pnrnumber').setValidators([Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern("^(?!0+$)[0-9]{1,19}$")]);
        this.showdetails = false;
        this.dynamiclength = 10;
        this.pnrForm.get('pnrnumber').setValue('');
        // this.pnrForm.get('pnrnumber').updateValueAndValidity();
      }else if(this.CheckedValue == 2){
        this.placeholderValue =' Transaction ID';
        this.pnrForm.get('pnrnumber').setValidators([Validators.required,Validators.minLength(15),Validators.maxLength(15),Validators.pattern("^(?!0+$)[0-9]{1,19}$")]);
        this.showdetails = false;
        this.dynamiclength = 15;
        this.pnrForm.get('pnrnumber').setValue('');
        // this.pnrForm.get('pnrnumber').updateValueAndValidity();
      }else if(this.CheckedValue == 3 ){
        this.placeholderValue = 'SmartBuy Reference ID';
        this.pnrForm.get('pnrnumber').setValidators([Validators.required,Validators.minLength(19),Validators.maxLength(19),Validators.pattern("^(?!0+$)[0-9]{1,19}$")]);
        this.showdetails = false;
        this.dynamiclength = 19;
        this.pnrForm.get('pnrnumber').setValue('');
        // this.pnrForm.get('pnrnumber').updateValueAndValidity();
      }
      this.pnrForm.get('pnrnumber').updateValueAndValidity();
    })

   }


   get buttonvalues(){
    return this.pnrForm.get('tdrbuttselection') as FormControl;
   }


  ngOnChanges(changes){
    const MyFormChanges = changes.pnrForm;
  }


  //retrive tdr information

  gettdrdata(){
    this.tdrFetchingsubmitted = true;
    this.errormesssage=false;
    if(this.pnrForm.status != 'VALID'){
      this.spinnerService.hide();
      this.showdetails = false;
      return;
    }

    else
    
    this.pnrID = this.pnrForm.get('pnrnumber').value;
    // console.log(this.pnrID)
    
    this.errormesssage=false;
    if(this.CheckedValue == 1){
    this.urlParams = new HttpParams()
    .set('pnrNumber', this.pnrID)
    .set('transactionID','')
    .set("orderRefNum", '') 
    }
    else if(this.CheckedValue == 2){
      this.urlParams = new HttpParams()
      .set('pnrNumber', '')
      .set('transactionID',this.pnrID)
      .set("orderRefNum", '') 
    }
    else if(this.CheckedValue == 3){
      this.urlParams = new HttpParams()
      .set('pnrNumber', '')
      .set('transactionID','')
      .set("orderRefNum", this.pnrID)
    }

    // console.log(this.urlParams)
            
  const body:string = this.urlParams.toString();
  this.spinnerService.show();
  this._irctc.gettdrDetails(body).subscribe(data => {
  this.tdrResponse = data.partnerResponse.bookingResponseList;
  this.tdrReasons = data.partnerResponse.tdrReasonList;

if(data.errorcode != 1){
    let pnrurlParams = new HttpParams()
        .set('pnrnumber', this.tdrResponse.pnrNumber);

    var postParam:string = pnrurlParams.toString();
    // if()
    this._irctc.getPnr(postParam).subscribe(chartResp =>{
      //console.log(chartResp);
      this.spinnerService.hide();
      if(chartResp.errorcode!=1){
      this.chartStatus = chartResp.partnerResponse.chartStatus;
      let indexValue = AppConfig.canFileTDRarr.indexOf(this.chartStatus);
      var  psngerlist = chartResp.partnerResponse.passengerList;
      //console.log(psngerlist);
      var len = (chartResp.partnerResponse.passengerList).length;
      var temp = [];
      //console.log(len);
      for(var i=0;i<len;i++){
        //console.log(psngerlist[i]);
       temp.push(psngerlist[i].currentStatus);

      }
      var canceledCount = temp.filter(function(x){ return x == "CAN"; }).length;

      var totalCount = temp.length;
      /*if((totalCount == canceledCount) && (indexValue != -1 || indexValue == -1)){
        this.cancelledpopup();
        return      
      }*/
      // if(indexValue != -1){
     if(false){   
       this.optCancelpopUp();
        this.showdetails = false;
      }   
      else{
    this.showdetails = true;
    this.partnerresp = data;
    this.checkedList.length = 0;
  this.selectedreason = undefined;
  if(this.partnerresp.errorcode == 0){
    this.errormesssage = false;
    var date:any = this.datePipe.transform(new Date(),'M/d/yy, h:mm a');

    var actualtodayTime = new Date(date).getTime()
    var journeyDate:any = this.datePipe.transform(this.tdrResponse.journeyDate,'M/d/yy, h:mm a');
    var journeyTime = new Date(journeyDate).getTime();
      
      this.showdetails = true;
    this.fromstn = this.stationsdump[this.tdrResponse.fromStn];
    this.tostn = this.stationsdump[this.tdrResponse.destStn];
    this.journeyClass = AppConfig.IRCTC_Classes[this.tdrResponse.journeyClass];
    this.journeyQuota = AppConfig.IRCTC_Quota[this.tdrResponse.journeyQuota];

    if(Array.isArray(this.tdrResponse.psgnDtlList)){
      this.passdata = this.tdrResponse.psgnDtlList;
    }
  else{
      var tmp =[];
      tmp.push(this.tdrResponse.psgnDtlList);
      this.passdata = tmp;
    }
    
  }

  else if(this.partnerresp.errorcode==1){
        var message = this.partnerresp.partnerResponse;
                const dialogRef = this.dialog.open(tdrConfirmationDialog, {
                    disableClose: true,
                    width: '600px',
                    id: 'messageforMliteDialog',
                    data: {
                        errorDialog: true,
                        messageData: message
                    }
                });
                this.showdetails=false;
}
      }
    }else{
      this.spinnerService.hide();
    var pnrErrormessage = chartResp.partnerResponse;
    const dialogRef = this.dialog.open(tdrConfirmationDialog, {
      disableClose: true,
      width: '600px',
      id: 'messageforMliteDialog',
      data: {
          errorDialog: true,
          messageData: pnrErrormessage
      }
  });
  this.showdetails=false;
    }
  }),(err:HttpErrorResponse) => {
    this.spinnerService.hide();
    var message = 'Something went wrong';
    const dialogRef = this.dialog.open(tdrConfirmationDialog, {
      disableClose: true,
      width: '600px',
      id: 'messageforMliteDialog',
      data: {
          errorDialog: true,
          messageData: message
      }
  });
  this.showdetails=false;
  };
}else{
  this.spinnerService.hide();
  var message = this.tdrResponse;
                const dialogRef = this.dialog.open(tdrConfirmationDialog, {
                    disableClose: true,
                    width: '600px',
                    id: 'messageforMliteDialog',
                    data: {
                        errorDialog: true,
                        messageData: message
                    }
                });
                this.showdetails=false;
}
});
    // }
    
    this.errormesssage=true;
  //  this.tdrFetchingsubmitted=true;
  this.showdetails=false;
}
  
  changeEvent(){
    this.errormesssage = false;
    this.tdrFetchingsubmitted=false;
  }
  

//passenger array creation on selecting checkbox
  onCheckboxChange(option, event) { 
    var nwArr = [];
    nwArr.push({sno:option.passengerSerialNumber,name:option.passengerName,age:option.passengerAge,bookingstatus:option.currentStatus,gender:option.passengerGender});
    this.checkerror = false;
    if(event.target.checked) {
      this.checkerror = false;
      this.checkedList.push({sno:option.passengerSerialNumber,name:option.passengerName,age:option.passengerAge,bookingstatus:option.currentStatus,gender:option.passengerGender}); 
    } else {
      this.checkerror=true;
      
    for(var i=0 ; i < this.passdata.length; i++) {
        this.checkedList.splice(i,1);
   }
 }

}



//capture the selected option for TDR
onChange(event){
  this.selectedreason = parseInt(event.value);
//var data_filter = this.tdrReasons.filter( element => element.id == this.selectedreason);
//console.log(data_filter[0].value)
this.sendreason = parseInt(event.value);
this.tdrConditions()
}

//reset the PNR form
resetpnrform(){
  this.showdetails = false;
  this.errormesssage = false;
  this.tdrFetchingsubmitted = false;
  if(this.pnrID!= ''){
  // this.pnrForm.get('pnrnumber').setErrors(null);
  this.pnrForm.get('pnrnumber').reset();
  // this.pnrForm.get('pnrnumber').updateValueAndValidity();
  }
  
  // this.pnrForm.setErrors(null);
} 
numberOnly(event): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;

}
optCancelpopUp(){
  let message = 'Filing a TDR for the PNR '+this.tdrResponse.pnrNumber+' is not allowed.';
  let dialogRef = this.dialog.open(tdrConfirmationDialog, {
   disableClose: true,
   width: '800px',
   data: { messageData: message, },
   scrollStrategy: this.overlay.scrollStrategies.noop()
});

}
cancelledpopup(){
  let message = 'TDR for PNR '+this.tdrResponse.pnrNumber +' cannot be filed as the ticket has already been cancelled.';
  let dialogRef = this.dialog.open(tdrConfirmationDialog, {
   disableClose: true,
   width: '800px',
   data: { messageData: message, },
   scrollStrategy: this.overlay.scrollStrategies.noop()
});

}

agreementPopup(){
  // let message = "SmartBuy does not restrict TDR filing for any PNR. The final decision of accepting/rejecting the filed TDR will rest with IRCTC as per the T&C mentioned by IRCTC for the selected TDR reason. SmartBuy will not be liable/responsible for any decision taken by IRCTC in this regard.";
  let popupDialog = this.dialog.open(tdragreementDialog, {
         disableClose: true,
         width: '600px',
         data: { },
         scrollStrategy: this.overlay.scrollStrategies.noop(),
     });
     popupDialog.afterClosed().subscribe(result =>{
      //  if(result == 0){

      //  }
       if(result == 1){
       this.tdrpass = true;
       this.submitShowwarningmsg = true;
       }else if(result ==0){
         this.tdrpass = false;
       }
     })
}


tdragreementPopup(){
  // let message = "SmartBuy does not restrict TDR filing for any PNR. The final decision of accepting/rejecting the filed TDR will rest with IRCTC as per the T&C mentioned by IRCTC for the selected TDR reason. SmartBuy will not be liable/responsible for any decision taken by IRCTC in this regard.";
  let popupDialog = this.dialog.open(filetdragreementDialog, {
         disableClose: true,
         width: '600px',
         data: { },
         scrollStrategy: this.overlay.scrollStrategies.noop(),
         autoFocus: false
     });
     popupDialog.afterClosed().subscribe(result =>{
      if(result ==0){
         this.router.navigate([this.sg['domainPath']+'/train/tdrhistory']);
       }else return;
     })
}



tdrConditions(){
/*var date = new Date();
var traindate = new Date(this.tdrResponse.journeyDate);
var actualtodayTime = new Date(date).getTime()
var traintime = new Date(traindate).getTime()*/
switch(this.selectedreason) {
  case 1:  case 4: case 5: case 6: case 7:  case 9: case 10: case 11: case 12: case 13: case 14:
    case 15: case 16: case 17: case 25:  {
      this.showwarningmsg = false;
      this.submitShowwarningmsg = false;
      this.agreementPopup();
      break;
    }
    case 2: case 3: case 8: case 18: case 19: case 22: case 28: case 29:{
      this.showwarningmsg = true;
      this.submitShowwarningmsg = true;
      this.agreementPopup();
      break;
    }
}





}
submittdrData(){
  if(this.checkedList.length > 0){
    this.checkerror = false;
    if(this.selectedreason!= undefined){
    this.reasonerror = false;
    
    if(this.tdrpass == true){


//6: Maximum passengers allowed for a ticket Below code as per new API for filing TDR
	var concatcheckedPassenger = '';
	for(var i=1 ; i <= 6; i++) {

        var data_filter = this.checkedList.filter( element => element.sno == i);
	if(data_filter.length)concatcheckedPassenger = concatcheckedPassenger+'Y';
	else concatcheckedPassenger = concatcheckedPassenger+'N';

   	}

      this.spinnerService.show();
      var rsnindx = this.tdrReasons.filter( element => element.reasonIndex == this.sendreason);

  this.tdrdata = {
    "Passengerdetails":concatcheckedPassenger,
    "customerid": this.REWARD_CUSTOMERID,
    "fromStation":this.tdrResponse.fromStn,
    "journeyDate":this.tdrResponse.journeyDate,
    //"orderRefNumber":this.tdrResponse.requestedClientTransactionId,
    "pnrno":this.tdrResponse.pnrNumber,
    "reason":this.sendreason,
    "rsnTxt":rsnindx[0].tdrReason,
    "toStation":this.tdrResponse.destStn,
    "trainno":this.tdrResponse.trainNumber,
    "transactionid":this.tdrResponse.reservationId
  }
  // console.log(this.tdrdata)
  
	var postParam = {
	postData: this.EncrDecr.set(JSON.stringify(this.tdrdata))
	};

 this._irctc.tdrReequestDTO(postParam).subscribe(resp =>{
  this.spinnerService.hide();
   this.tdrsubmitresp = resp.error;
   this.showdetails = false;
  //  this.resetpnrform();
   this.selectedreason = undefined;
   let message = this.tdrsubmitresp;
   let dialogRef = this.dialog.open(tdrConfirmationDialog, {
    disableClose: true, 
    width: '300px',
    data: { messageData: message},
    scrollStrategy: this.overlay.scrollStrategies.noop()
});
dialogRef.afterClosed().subscribe(result =>{
  this.router.navigate([this.sg['domainPath']+'/train/tdrhistory']);
})

  // console.log(this.tdrsubmitresp);
 })
 
}
    }
    else this.reasonerror = true;
  }else this.checkerror = true;
}


}

@Component({
  // selector: 'confirmation-dialog2',
  templateUrl: './tdrconfirm.html',
  styleUrls: ['./tdr.component.scss']
})
export class tdrConfirmationDialog {
  domainName:any;
  constructor(private sg:SimpleGlobal ,public dialogRef: MatDialogRef<tdrConfirmationDialog>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) { 
        this.domainName = this.sg['domainName']
      }

  onYesClick(): void {
      this.dialogRef.close(true);
  }

}

@Component({
  // selector: 'confirmation-dialog2',
  templateUrl: './tdragreement.html',
  styleUrls: ['./tdr.component.scss']
})
export class tdragreementDialog {
  tdragreementForm: FormGroup;
  submitted:boolean = false;
  domainName:any;
  constructor(private sg:SimpleGlobal,private agreementForm: FormBuilder,public dialogRef: MatDialogRef<tdragreementDialog>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) { 

        this.domainName = this.sg['domainName']

        this.tdragreementForm = this.agreementForm.group({
          termsandcondition: ['',[Validators.required,Validators.pattern('true')]]
        })

      }


  onYesClick(): void {
    this.submitted = true;
    if(this.tdragreementForm.status != 'VALID'){
      return;
    }else
    this.submitted = true;
      this.dialogRef.close(1);
  }
  onNoClick():void{
    this.dialogRef.close(0);
  }

}


@Component({
  // selector: 'confirmation-dialog2',
  templateUrl: './filetdragreement.html',
  styleUrls: ['./tdr.component.scss']
})
export class filetdragreementDialog {
  filetdragreementForm: FormGroup;
  submitted:boolean = false;
  domainName:any;
  constructor(private sg:SimpleGlobal, private agreementForm: FormBuilder,public dialogRef: MatDialogRef<filetdragreementDialog>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) { 

        this.filetdragreementForm = this.agreementForm.group({
          termsandconditioncheck: ['',[Validators.required,Validators.pattern('true')]]
        })
        this.domainName = this.sg['domainName'];
      }


  onYesClick(): void {
    this.submitted = true;
    if(this.filetdragreementForm.status != 'VALID'){
      return;
    }else
    this.submitted = true;
      this.dialogRef.close(1);
  }
  onNoClick():void{
    this.dialogRef.close(0);
  }

}
