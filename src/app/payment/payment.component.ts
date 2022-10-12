import { Component, OnInit,Input, Output, EventEmitter,Inject, ViewChild, ElementRef, HostListener } from '@angular/core'; 
import { ActivatedRoute, Router} from '@angular/router';
import {APP_CONFIG, AppConfig} from '../configs/app.config';
import { CommonHelper } from 'src/app/shared/utils/common-helper';
import { SimpleGlobal } from 'ng2-simple-global';
import {EncrDecrService} from 'src/app/shared/services/encr-decr.service';
import { Location, DatePipe, formatDate } from '@angular/common';
import {environment} from '../../environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { AppConfigService } from '../app-config.service';
import {  FormGroup,  FormControl,   Validators,   FormBuilder} from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { RestapiService} from 'src/app/shared/services/restapi.service';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { interval,Observable} from 'rxjs';
import { NgxCleaveDirectiveModule } from 'ngx-cleave-directive';
import {Overlay} from '@angular/cdk/overlay';
import { PayService } from 'src/app/shared/services/pay.service';
import { BnNgIdleService } from 'bn-ng-idle';
import { CountdownModule, CountdownComponent } from 'ngx-countdown';
import { CommunicationService } from 'src/app/shared/services/communication.service';
import { RecaptchaComponent } from 'ng-recaptcha';
import { commaSeparatorPipe } from 'src/app/shared/pipes/comma-separator.pipe';
import { CreditCardValidators } from 'angular-cc-library';
import { trigger } from '@angular/animations';
declare var $: any;


  
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  providers: [commaSeparatorPipe]
})
export class PaymentComponent implements OnInit {
        template: string = '<div class="app-loading-new"><div class="logo"></div></div>';
        getFlexiFare:any;
        //fetching coupon details from traveller.component.ts
        autoApplyError:number=0;
        selectedPg:string='CYBER';
        @Output() sendtotalfare = new EventEmitter<any>();
        flexiOtpButtonActive:boolean=true;
        cdnUrl: any;
        siteKey:any;
        couponOptions: any=[];
        firstCoupon: any;
        secondCoupon: any;
        thirdCoupon: any;
        firstCouponDesc: any;
        secondCouponDesc: any;
        thirdCouponDesc: any;
        showoffer:boolean=false;
        panelOpenState = false;
        payForm: FormGroup;
        upiForm: FormGroup;
        payzappForm: FormGroup;
        netbankingForm: FormGroup;
        emiForm: FormGroup;
        hdfcPgForm: FormGroup;
        creditForm: FormGroup;
        saveCardForm: FormGroup;
        promoForm: FormGroup;
        PayNoAmtForm:FormGroup
        RedeemStatus:Boolean=false;
        RedeemText:String;
        RedeemPoints:any='';
        PayNoAmtStatus:Boolean=true;
        redeemtext:string = '';
        RedeemAmount:any='';
        showProceedPayment:Boolean=false;
        showAllPayment:Boolean=true;
        submittedPayNoAmtForm:Boolean=false;
        assetPath:string;
        showVisaBox:boolean=true;
        showHdfcPg:boolean=false;
        lastFourdigitsofcardNumber:any;
        cardData;
        @Input() passSessionKey;
        @Input() isMobile;
        //@Input() passSavedCardsData;
        domainPath:string;
        appConfig: any;
        domainRedirect: string;
        minamount= AppConfig.flexiMinMax.minimumAmount;
        maxamount = AppConfig.flexiMinMax.maximumAmount;
        enable_dcemi2 :boolean=false;;
        @Input() set passSavedCardsData(p: any[]){
        if(p.length>0){
        this.cardData=p;
        const jobGroup: FormGroup = new FormGroup({});
        if(this.cardData.length>0){
        for (var i=0;i<Number(this.cardData.length);i++) {
        jobGroup.addControl('cardRow', new FormControl(i, Validators.required));
        if(i==0)
        jobGroup.addControl('save_cvvnumber'+i, new FormControl('', [Validators.required,Validators.pattern("^[0-9]*$"),Validators.minLength(3)]));
        else
        jobGroup.addControl('save_cvvnumber'+i, new FormControl('', [Validators.pattern("^[0-9]*$"),Validators.minLength(3)]));
        }
        }
        jobGroup.addControl('termscondition', new FormControl('', [Validators.required,Validators.pattern('true')]));
        this.saveCardForm = jobGroup;

        }  else {
        this.cardData=[];

        const jobGroup: FormGroup = new FormGroup({});
        jobGroup.addControl('cardRow', new FormControl(0, Validators.required));
        if(i==0)
        jobGroup.addControl('save_cvvnumber0', new FormControl('', [Validators.required,Validators.pattern("^[0-9]*$"),Validators.minLength(3)]));
        else
        jobGroup.addControl('save_cvvnumber0', new FormControl('', [Validators.pattern("^[0-9]*$"),Validators.minLength(3)]));
        jobGroup.addControl('termscondition', new FormControl('',[Validators.required,Validators.pattern('true')]));
        this.saveCardForm = jobGroup;


        }

        if(this.cardData.length > 0 )
        this.defaultCardVal=this.cardData[0]['card_id'];
        else
        this.defaultCardVal='';

        };

        XSRFTOKEN:string;
        @Input() set passXSRFTOKEN(p: string){  
        this.XSRFTOKEN=p;
        this.payForm = this.formBuilder.group({
        orderReferenceNumber:[, Validators.required],
        ctype:['', Validators.required],
        _token:[this.XSRFTOKEN, Validators.required],
        });
        };

        @Input() set passActualFare(p: string){  
        this.payActualFare=p;
        };

        convinenceFee:number=0;
        @Input()  set passConvinenceFee(p: number){  
        this.convinenceFee=p;
        };

        @Input() set passflexiFare(p:string){
        this.getFlexiFare = p;
        // console.log(this.getFlexiFare)
        }

        serviceId:string;
        @Input() set passServiceId(p: string){  
        this.serviceId=p;
        };

        IsDcemiEligibleFlag = false;

        @Input() set passIsDcemiEligibleFlag(p: boolean){  
        this.IsDcemiEligibleFlag=p;
        };

        Isflexipayeligible:boolean = false;
        flexiarray:any;

        @Input() set passFlexipayEligibleFlag(p: boolean){
        this.Isflexipayeligible = p;
        }
        isactualLogin:any;

        @Input() set passactualLogin(p: boolean){
        this.isactualLogin = p;
        }
        @Input() set passTotalFare(p: string){  
        this.payTotalFare=p;
        // console.log(this.payTotalFare);
        setTimeout(()=>{
        if((this.getFlexiFare < this.minamount) || (this.getFlexiFare) > this.maxamount) {
        this.Isflexipayeligible = false;
        this.sendflexiAmount.emit([{key: "0", value: "0"}]);
        this.showflexipaydefaultsection = true;
        this.showFlexiOTP=false;
        this.showVerificationDetails = false;
        this.selectedIndex = -1;
        this.flexiemisubmitted = false;
        this.flexipayOtpResponse = false;
        this.showcalcsection = false;
        }
        });
        
     
        if(this.pgSettingsEMI)
         this.emiArray=this.commonHelper.emiLogic(this.payTotalFare);
         else
          this.emiArray=[];
        
        if(this.pgSettingsDEBITEMI) 
        this.emiDebitArray=this.commonHelper.emiDebitLogic(this.payTotalFare);
        else
         this.emiDebitArray=[];
        
        this.flexipayArr=this.commonHelper.flexipayIntcalc(this.payTotalFare);
        };

        REWARD_MOBILE:string;
        @Input() set passREWARD_MOBILE(p: string){  
        this.REWARD_MOBILE=p;
        };

    emiArray:any[];
        ServiceToken:any;  
        @Input() partnerToken;   
         @Input() retryPay; 
        MAIN_SITE_URL:string;
        monthArray:any[];
        yearArray:any[];
    
        emiInterst:any[];
        emiDebitArray:any[];
        emiDebitInterst:any[];

        submittedCreditForm = false;
        submittedUpiForm= false;
        submittedPayzappForm= false;
        submittedNetBankingForm= false;
        submittedHdfcPgForm= false;
        submittedEmiForm= false;
        submittedPayForm= false;
        submittedSaveCardForm= false;
        domainName:string;
        pgSettingsHDFCPG:number=0;
        pgSettingsCYBER:number=0;
        pgSettingsNETBANKING:number=0;
        pgSettingsEMI:number=0;
        pgSettingsPAYZAPP:number=0;
        pgSettingsTESTPG:number=0;
        pgSettingsDEBITEMI:number=0;
        pgSettingsUPI:number=0;
        isLoggedIn:boolean=false;
        selectedCardIndex:number=0;
        defaultCardVal:string;
        pgSettingFlexipayEMI:number=0;
        flexipaySlected:any[];
        intrstopay:any;

        bookingRefNumber:string;
        orderReferenceNumber:string;
        ctype:string;
        payTotalFare;
        payActualFare;
        passData;
        passFareData;
        pgSettingsCYBERToken:number=0;
        showRewardsBox:boolean=false;
        couponApplied:boolean=false;
        couponShow:boolean=false;
        coupons:any=[];
        indexCoupon: any[];
        coupon_id: any;
        coupon_name: string;
        coupon_code: string;
        coupon_type: string;
        couponError: string;
        coupon_min_value: number;

        showDebitEMI:boolean=true;
        showDebitEMIOtp:boolean=false;
        showDebitEMIOtpConfirmation:boolean=false;

        DebitEMIFrom: FormGroup;
        submittedDebitEMIFrom = false;
        DCEMIapplicationId: string;
        DCEMItenure: any;
        DCEMISelectedAmount: any;
        DCEMIConfirmResponse: any;
        DCEMIError='';
        Debit2EMIFrom: FormGroup;

        DebitEMIOTPFrom: FormGroup;
        Debit2EMIOTPFrom: FormGroup;
        submittedDebitEMIOTPFrom = false;


        DebitEMIConfirmFrom: FormGroup;
        submittedDebitEMIConfirmFrom = false;
        customerInfo:any[];
        guestLogin:boolean=false;
        flexipayArr:any[];
        flexipayArrDefault:any[];
        flexiintrest:any;
        showvalue:boolean = false;
        flexiamnt:any;
        flexipayForm:FormGroup;
        flexipayOTPForm:FormGroup;
        flexipayverifationform:FormGroup;
        flexipayguestForm:FormGroup;
        selectedperiod:number=15;
        submittedflexiuserform:boolean=false;
        flexivaliduserresp:any;
        dcemivaliduserresp:any;
        openflexiOtp:boolean = false;
        flexipayOtpResponse:any;
        dcemiOtpResponse:any;
        showFlexiOTP:boolean = false;
        showVerificationDetails:boolean = false;
        showflexipaydefaultsection:boolean = true;
        selectedIndex: number = -1;
        showcalcsection: boolean= false;
        flexiemisubmitted= false;
        flexiOTPsubmitted = false;
        flexipayfinalSubmit = false;
        flexipayEligibleError:any;
        validateOTPresp:any;
        dcemi_validateOTPresp:any;
        flexiOTPerror:any;
        flexifinalamount:any;


        fp_token:string=''; 
        fb_bankReferenceNo:string='';
        fb_merchantReferenceNo:string='';
        fp_total_price:string='';
        fp_interestRate:string='';
        fp_tenure:string='';

        dcemi_token:string=''; 
        dcemi_bankReferenceNo:string='';
        dcemi_merchantReferenceNo:string='';
        dcemi_interestRate:string='';
        dcemi_tenure:string='';

        fpGuestsession:boolean = false;
        guestcardinvaliderror:any;
        flexiGuestformSubmitted = false;
        guestflexierror:any;
        count:number=0;
        pass_coupon_status:any;
        showNONSPCsuccessModal:any;
        availablePGids:any=[];
        passpgtype:any;
        openNoneligiblecouponDialog:any;
        flexiPayNewcalcArr:any;
        showFlexiValue:any;
        flexipayPGvalue:any;
        dfBookingDetails:any;
        payzrestriction:boolean=false;
        @ViewChild('flexipanelsection') public panel:ElementRef;



        /***----------REMOVE COUPON ----------***/
        @Input() remove_Coupon:any[];
        remove_Coupon_id:any;
        pointsPG: number = 0;
        enableNONSPC:any;
        serviceSettings:any;
        enableNONSPCForCoupon:any;
        ispgAllowed:boolean = false;
        allowPGOnRemoveCoupon:boolean = false;
		partnerId:number;
		
	ngOnChanges(){
        let service_id = this.serviceId.toLowerCase();
          let partnername = this.partnerToken.toLowerCase();        
          this.partnerId = this.serviceSettings['partners'][service_id][partnername];
        this.remove_Coupon_id = this.remove_Coupon;
        if(this.remove_Coupon){
        this.coupon_name = "";
        this.coupon_code = "";
        }
	}

	
	constructor(public rest:RestapiService,private EncrDecr: EncrDecrService,public restApi:RestapiService,private http: HttpClient,private formBuilder: FormBuilder,private activatedRoute: ActivatedRoute,private cookieService: CookieService,private sg: SimpleGlobal,public commonHelper: CommonHelper,private location: Location,private spinnerService: NgxSpinnerService,public dialog: MatDialog, public overlay: Overlay,private pay: PayService,private appConfigService:AppConfigService,private communicate: CommunicationService, private commaSeparatorPipe: commaSeparatorPipe) { 
                this.assetPath=this.sg['assetPath']; 
                this.serviceSettings=this.appConfigService.getConfig();
                this.domainPath=this.sg['domainPath'];
                this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
                this.enableNONSPC = this.serviceSettings.enableNONSPC;
                this.enableNONSPCForCoupon = this.serviceSettings.enableNONSPCForCoupon;
                this.showNONSPCsuccessModal = this.serviceSettings.showNONSPCsuccessModal;
                this.openNoneligiblecouponDialog = this.serviceSettings.openNoneligiblecouponDialog;
                this.siteKey=this.serviceSettings.SITEKEY;
                this.ServiceToken =this.serviceId;
                this.ctype=sessionStorage.getItem(this.passSessionKey+'-ctype');
				this.enable_dcemi2 = this.serviceSettings.enable_dcemi2;
		
		this.spinnerService.show();
		      setTimeout(() => {
                        //Check Laravel Seesion
                        if(this.sg['customerInfo']){
                        this.customerInfo=this.sg['customerInfo'];
                        if(this.sg['customerInfo']["org_session"]==1){
                        var customerInfo = this.sg['customerInfo'];

                        this.rest.updateCardDetails(customerInfo);
                        this.guestLogin = this.customerInfo["guestLogin"];
                        if(customerInfo["guestLogin"]==true){
                        
                        if(this.serviceSettings.PAYSETTINGS[this.sg['domainName']][this.serviceId].FLEXI_PAY==1){
                        this.Isflexipayeligible = true;
                        this.fpGuestsession = true;
                        this.showFlexiOTP=false;
                        this.showflexipaydefaultsection = false;
                        this.showVerificationDetails = false;
                        this.showcalcsection = false;
                        this.flexipayOtpResponse = false;
                        // this.REWARD_MOBILE = this.customerInfo['mobile'];
                        if(this.customerInfo['mobile'] == '0'){
                        this.REWARD_MOBILE = '';
                        }else this.REWARD_MOBILE = this.customerInfo['mobile'];

                        }
                        this.isLoggedIn = true;
                        if(this.retryPay==1)
                         this.showRewardsBox=true;
                        }else{
                         if(this.retryPay==1){
                        if (this.serviceSettings.POINTCASH_SETTINGS[this.sg['domainName']][this.serviceId] == 1) {
                        this.showRewardsBox=true;
                        }else{
                        this.showRewardsBox=false;
                        }
                        }
                        this.isLoggedIn = true;
                        }
                         this.loadPayment();
                        this.spinnerService.hide();
                        }else{
                         this.showRewardsBox=false;
                         this.loadPayment();
                        this.spinnerService.hide();
                        this.isLoggedIn = false;
                        }
                        }else {
                        this.isLoggedIn = false;
                        this.pgSettingsHDFCPG = 0;
                         this.loadPayment();
                        this.spinnerService.hide();
                        }
             }, 50);


	}
	loadPayment(){


        this.pointsPG=this.serviceSettings.PAYSETTINGS[this.sg['domainName']][this.serviceId].POINTS;
        this.domainName=this.sg['domainName'];
        this.pgSettingsHDFCPG=this.serviceSettings.PAYSETTINGS[this.domainName][this.serviceId].HDFCPG;
        this.pgSettingsCYBERToken=this.serviceSettings.PAYSETTINGS.enableTokenization;
        this.pgSettingsCYBER=this.serviceSettings.PAYSETTINGS[this.domainName][this.serviceId].CYBER;
        this.pgSettingsNETBANKING=this.serviceSettings.PAYSETTINGS[this.domainName][this.serviceId].NETBANKING;
        this.pgSettingsEMI=this.serviceSettings.PAYSETTINGS[this.domainName][this.serviceId].EMI;
        this.pgSettingsTESTPG=this.serviceSettings.PAYSETTINGS[this.domainName][this.serviceId].TESTPG;
        this.pgSettingsDEBITEMI=this.serviceSettings.PAYSETTINGS[this.domainName][this.serviceId].DEBIT_EMI;
        this.pgSettingsUPI=this.serviceSettings.PAYSETTINGS[this.domainName][this.serviceId].UPI;
        this.pgSettingFlexipayEMI = this.serviceSettings.PAYSETTINGS[this.domainName][this.serviceId].FLEXI_PAY;
        
        if(!this.pgSettingsCYBER){
         this.cardData=[];
        }

        const cookieExistPay: boolean = this.cookieService.check(this.serviceSettings.payzapp_cookiename);

        if(cookieExistPay)
        this.pgSettingsPAYZAPP=1;
        else
        this.pgSettingsPAYZAPP=this.serviceSettings.PAYSETTINGS[this.domainName][this.serviceId].PAYZAPP;


        this.monthArray=Array.from(new Array(Number(12)),(val,index)=>index);
        
        if(this.pgSettingsEMI)
        this.emiArray=this.commonHelper.emiLogic(this.payTotalFare);
       else
         this.emiArray=[];

        if(AppConfig.EMI_FROM_API==0){
        this.emiInterst=AppConfig.emiInterst;
        }else{
        this.restApi.getCCEMIDetails().subscribe(response => {
        this.emiInterst = response;
        });
        }

        this.flexiamnt = (this.payTotalFare);
        this.flexipayArrDefault = this.commonHelper.flexipayIntcalc(this.payTotalFare);
        if(AppConfig.EMI_FROM_API==0){
        this.flexiintrest = AppConfig.flexipayInt;
        }else{
        this.restApi.getFlexipayDetails().subscribe(response => {
        this.flexiintrest = response;
        });
        }
        this.flexipayPGvalue = this.payTotalFare;
        this.flexiPayNewcalcArr = this.commonHelper.flexipayIntcalc(this.flexipayPGvalue);
        this.showFlexiValue = this.payTotalFare;

        if(this.pgSettingsDEBITEMI)
        this.emiDebitArray=this.commonHelper.emiDebitLogic(this.payTotalFare);
        else
          this.emiDebitArray=[];

        if(AppConfig.EMI_FROM_API==0){
        this.emiDebitInterst=AppConfig.emiDebitInterst;
        }else{
        this.restApi.getDCEMIDetails().subscribe(response => {
        this.emiDebitInterst = response;
        });
        }
        this.upiForm = this.formBuilder.group({
        virtual_address:['',Validators.required],
        termscondition:['',[Validators.required,Validators.pattern('true')]],
        });

        this.payzappForm = this.formBuilder.group({
        termscondition:['',[Validators.required,Validators.pattern('true')]],
        });

        this.netbankingForm = this.formBuilder.group({
        termscondition:['',[Validators.required,Validators.pattern('true')]],
        });

        this.emiForm = this.formBuilder.group({
        termscondition:['',[Validators.required,Validators.pattern('true')]],
        });
        this.hdfcPgForm = this.formBuilder.group({
        termscondition:['',[Validators.required,Validators.pattern('true')]],
        });

        let res = [];
        for (let i = new Date().getFullYear(); i < (new Date().getFullYear()+10); i++) {
        res.push(i);
        }
        this.yearArray=res;

        this.creditForm = this.formBuilder.group({
        cardnumber:['',  [Validators.required,CreditCardValidators.validateCCNumber,Validators.minLength(14)],this.isCardValid.bind(this)],
        nameoncard:['', Validators.required],
        expiryMonth:['', [ Validators.required,Validators.pattern("^[0-9]*$")]],
        expiryYear:['', [ Validators.required,Validators.pattern("^[0-9]*$")]],
        cvvnumber:['',  [ Validators.required,Validators.pattern("^[0-9]*$"),Validators.minLength(3)]],
        termscondition:['',[Validators.required,Validators.pattern('true')]],
        });

        this.DebitEMIFrom = this.formBuilder.group({
        cardnumber:['',  [Validators.required]],
        termscondition:['',[Validators.required,Validators.pattern('true')]],
        });
        this.Debit2EMIFrom = this.formBuilder.group({
                    panNo:['',  [Validators.required]],
                termscondition:['',[Validators.required,Validators.pattern('true')]],
        });

        this.DebitEMIOTPFrom = this.formBuilder.group({
        otpnumber:['', [ Validators.required,Validators.pattern("^[0-9]*$")]]
        });
        this.Debit2EMIOTPFrom = this.formBuilder.group({
                    otpnumber:['', [ Validators.required,Validators.pattern("^[0-9]*$")]],
                    termscondition:['',[Validators.required,Validators.pattern('true')]],
        });

        this.DebitEMIConfirmFrom = this.formBuilder.group({
        termscondition:['',[Validators.required,Validators.pattern('true')]],
        termscondition1:['',[Validators.required,Validators.pattern('true')]],
        });

        this.flexipayForm = this.formBuilder.group({
        flexiOptions:['',[Validators.required]],
        cardnumber:['',[Validators.required,Validators.minLength(14),Validators.maxLength(16),Validators.pattern('^[0-9]*$')]],
        termscondition:['',[Validators.required,Validators.pattern('true')]],
        });
        this.flexipayOTPForm = this.formBuilder.group({
        otpNumber:['',[Validators.required,Validators.pattern("^[0-9]*$"),Validators.minLength(6)]]
        })
        this.flexipayverifationform = this.formBuilder.group({
        terms:['',[Validators.required,Validators.pattern('true')]]

        })
        this.flexipayguestForm = this.formBuilder.group({
        mobileNumber:['',[Validators.required,Validators.minLength(10)]],

        })

        this.payForm = this.formBuilder.group({
        orderReferenceNumber:[, Validators.required],
        ctype:['', Validators.required],
        _token:[this.XSRFTOKEN, Validators.required],
        });
        this.MAIN_SITE_URL=environment.MAIN_SITE_URL+this.sg['domainPath'];
        this.domainRedirect=environment.MAIN_SITE_URL+this.domainPath;

        // const promoForm: FormGroup = new FormGroup({});
        // promoForm.addControl('promoCode', new FormControl('',Validators.required));
        // promoForm.addControl('couponCaptcha', new FormControl({ disabled: true, value: '' }));
        // this.promoForm = promoForm;

        this.promoForm = new FormGroup({
        promoCode: new FormControl('',Validators.required),
        couponCaptcha: new FormControl({value: '', disabled: true},[Validators.required])
        });

        const cookieExistsp: boolean = this.cookieService.check(this.serviceSettings.payzapp_cookiename);
        if(cookieExistsp){  
        this.payzrestriction=true;

        }

     }
	hidecheckoutPay(type){
	
	 if(type==1)
	  $('.chkout-btn_pay').hide();
	  else
	  $('.chkout-btn_pay').show(); 
	
	
	}
	
	pgSelectGuest(){
	
	  if(this.customerInfo["guestLogin"]==true){
	   if(!this.pgSettingsEMI && this.emiArray.length ==0 &&  this.pgSettingsDEBITEMI && this.emiDebitArray.length >0)
	   this.pgSelect('DEBIT_EMI');
	  }

	  if(this.pgSettingsEMI && this.emiArray.length > 0) {

		let element: HTMLElement = document.getElementById('cc-emi') as HTMLElement; 
		element.click();

	  }

	
	}
	
	pgSelect(pgType){
                //console.log(pgType);
                if(pgType=='DEBIT_EMI' && this.customerInfo["guestLogin"]==true){
                this.showDebitEMI=false;
                this.showDebitEMIOtp=false;
                this.showDebitEMIOtpConfirmation=false;

                //document.getElementById("pay-dcemi-info").scrollIntoView();
                $('#pay-dcemi-info').hide(); 
                const dialogDcemi = this.dialog.open(dcemiDialog,{
                data: {
                customerInfo: this.customerInfo
                },
				disableClose: true,
                scrollStrategy: this.overlay.scrollStrategies.noop()
                });

                dialogDcemi.afterClosed().subscribe(result => {
                if(result!=undefined){ 
                var customerMobile = result;
                var checkEligibleParams = {
                'client_token': 'HDFC243',
                'mobile': customerMobile,
                };
                var postCheckEligibleParam = {
                postData: this.EncrDecr.set(JSON.stringify(checkEligibleParams))
                };
                this.rest.IsDcemiEligible(postCheckEligibleParam).subscribe(results => {	
                if (results.result) {
                this.REWARD_MOBILE=customerMobile;
                let result = JSON.parse(this.EncrDecr.get(results.result));
                //console.log(result.eligible);
                if(result.eligible){
                let shadesEl=document.querySelector('#payDebitEmiOption'); 
                shadesEl.classList.add('show');
                $('#pay-dcemi-info').show();
                //document.getElementById("pay-dcemi-info").scrollIntoView();
                this.showDebitEMI=true;
                this.selectedPg=pgType;


                }else{

				let element: HTMLElement = document.getElementById('cc-emi') as HTMLElement; 
				element.click();

                var message="You are not eligible for Debit Card EMI payment";
                alert(message);
                }
                }
                });
                }else{
                //this.showDebitEMI=true;
                }
                });
                }

                if(pgType=='FLEXI_PAY'){
                let getFareData=sessionStorage.getItem(this.passSessionKey+'-passFareData');
                if(getFareData){
                let fareDataDecoded= JSON.parse(atob(getFareData));
                let totalFare = fareDataDecoded.totalFare;
                if(this.Isflexipayeligible && this.pgSettingFlexipayEMI && totalFare >= this.minamount &&  totalFare <= this.maxamount && pgType!='FLEXI_PAY'){
                this.sendtotalfare.emit(fareDataDecoded.totalFare);  
                }
                }

                this.sendflexiAmount.emit([{key: "0", value: "0"}]);
                this.showflexipaydefaultsection = true;
                this.showFlexiOTP=false;
                this.showVerificationDetails = false;
                this.selectedIndex = -1;
                this.flexiemisubmitted = false;
                this.flexipayOtpResponse = false;
                this.showcalcsection = false;
                this.flexipayForm.reset();
                this.flexipayOTPForm.reset();
                this.flexipayverifationform.reset();
                this.flexipayPGvalue = this.payTotalFare;
                this.flexiPayNewcalcArr = this.commonHelper.flexipayIntcalc(this.flexipayPGvalue);
                this.showFlexiValue = this.payTotalFare;
                }
                if(pgType=='FLEXI_PAY' && this.customerInfo["guestLogin"]==true){
                this.sendflexiAmount.emit([{key: "0", value: "0"}]);
                this.showflexipaydefaultsection = false;
                this.showFlexiOTP=false;
                this.showVerificationDetails = false;
                this.selectedIndex = -1;
                this.flexiemisubmitted = false;
                this.flexipayOtpResponse = false;
                this.showcalcsection = false;
                this.fpGuestsession = true;
                this.flexipayForm.reset();
                this.flexipayOTPForm.reset();
                this.flexipayverifationform.reset();
                }

                else{
                this.selectedPg=pgType;

                }
	}
			
	ngOnInit() {
	
	}
	@Output() sendflexiAmount = new EventEmitter<any>();

        //validate guest mobile number
        emiOptionChange(key){
        $('.emiTenure').addClass('hidden');
        $('.emiTenure-'+key).removeClass('hidden');
        $('.emi_check_radio').removeClass('emi-active');
        $('.emi_check_radio-'+key).addClass('emi-active');
        }
	fpGuestmobile(){

	this.flexiGuestformSubmitted = true;
		if(this.flexipayguestForm.status != 'VALID'){
			return;
		}else{

		this.spinnerService.show();
			let guestmobileNumber = this.flexipayguestForm.controls['mobileNumber'].value;
			var eligibleparam = {
				'mobile': guestmobileNumber 
				}

			var postparams = {
				postData:this.EncrDecr.set(JSON.stringify(eligibleparam))
			}

			this.rest.isFlexiPayEligible(postparams).subscribe(results =>{
				let decryptvalues = JSON.parse(this.EncrDecr.get(results.result));
				if(decryptvalues == false || decryptvalues == null || decryptvalues==undefined){
					this.spinnerService.hide();
					this.guestflexierror = "Something went wrong.";
					this.showflexipaydefaultsection = false;
					this.fpGuestsession= true;
					this.showFlexiOTP=false;
					this.showVerificationDetails = false;
					this.showcalcsection = false;
					this.flexipayOtpResponse = false;
					this.flexiGuestformSubmitted = false;
					this.isLoggedIn=false;
					this.flexiemisubmitted = false;
					
				}else{
			let userstatus = decryptvalues.status;
			if(userstatus == true){
				this.flexiPayNewcalcArr = this.commonHelper.flexipayIntcalc(this.payTotalFare);
				this.spinnerService.hide();
				this.showflexipaydefaultsection = true;
				this.fpGuestsession= false;
				this.showcalcsection = false;
				this.showFlexiOTP=false;
				this.showVerificationDetails = false;
				this.flexiGuestformSubmitted = true;
				this.isLoggedIn = true;
				this.guestflexierror = false;
				this.flexiemisubmitted=false;
			}else{
				this.spinnerService.hide();
				this.guestflexierror = decryptvalues.message;
				this.showflexipaydefaultsection = false;
				this.fpGuestsession= true;
				this.showFlexiOTP=false;
				this.showVerificationDetails = false;
				this.showcalcsection = false;
				this.flexipayOtpResponse = false;
				this.flexiGuestformSubmitted = false
				this.isLoggedIn=false;
				this.flexiemisubmitted=false;
			}
		}
			}),(err: HttpErrorResponse) => {
				this.spinnerService.hide();
				this.guestcardinvaliderror = "Something went wrong.";
				this.showflexipaydefaultsection = false;
				this.fpGuestsession= true;
				this.showFlexiOTP=false;
				this.showVerificationDetails = false;
				this.showcalcsection = false;
				this.flexipayOtpResponse = false;
				this.flexiGuestformSubmitted = false;
				this.isLoggedIn = false;
				this.flexiemisubmitted=false;
				
				};
		}
	}
	
	
openInfo(type){
  $('.infocardtype').html(type);
  if(type=='VISA / MASTER / DINERS'){
   $('.infocardimg').attr("src",this.cdnUrl+"images/VISA_MASTERCARD_DINERS_RUPAY.svg");
   $('.infocardtext').html('Avoids re-entering your card every time you transact with us');
  }else{
  $('.infocardimg').attr("src",this.cdnUrl+'images/'+type+".svg");
  $('.infocardtext').html('Continues to provide you benefit of using saved card on SmartBuy');
  }
     $('.payinfo_popup1').trigger('click');
}

checkInfo(event,id){

  $('#payinfoid').val(id);
  if(!event.target.checked){
    $('#tokenization'+ id).val(0);
   $('.payinfo_popup').trigger('click');
   }else{
     $('#tokenization'+ id).val(1);
   }  
}


checkInfo1(event){
  if(!event.target.checked){
    $('#tokenization').val(0);
   }else{
     $('#tokenization').val(1);
   }  
}
@Output() sendPointsPlusEvent = new EventEmitter<any>();
updatenewAmounttopay(event:any){
  this.payTotalFare=event.remain_value;
  this.sendPointsPlusEvent.emit(event);	  
  this.sendtotalfare.emit(this.payTotalFare);

}






securemycard() {
 $('#tokenization'+ $('#payinfoid').val()).prop('checked',true);
  $('#tokenization'+ $('#payinfoid').val()).val(1);
  $('.visa_close').trigger('click');
    this.checkNonSpcOfferforSaveCard();
}

nothanks() {
  $('#tokenization'+ $('#payinfoid').val()).val(0);
    $('.visa_close').trigger('click');
    this.checkNonSpcOfferforSaveCard();
}
	
	checkInputchanges(){
		this.flexipayEligibleError = false;
		this.flexiOTPerror =false;
		this.guestflexierror=false;
	}
	public moveToSpecificView(): void {
	setTimeout(() => {
			this.panel.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' });
	});
}
	calculateIntr(value){
		//let selectedperiod = $("input[id='payFlexiemi-subOne']:checked").val();
		this.showflexipaydefaultsection = true;
		this.fpGuestsession= false;
		//console.log(value)
		this.showFlexiOTP=false;
		this.showVerificationDetails = false;
		this.selectedperiod = value;
	// let totalfare =  this.payTotalFare;
	this.flexipayArr = this.commonHelper.flexipayIntcalc(this.flexipayPGvalue);
	this.flexipaySlected = this.flexipayArr.filter(intrest => intrest.key === value);
	this.intrstopay = this.flexipaySlected[0].value;
	this.showvalue=true;
	this.showcalcsection = true;
	this.sendflexiAmount.emit(this.flexipaySlected); 
	}

	validateFlexipayUser(){
		this.flexiemisubmitted = true;
		this.flexipayfinalSubmit = false;
		this.flexiOTPsubmitted = false;
		this.fpGuestsession= false;	
if (this.flexipayForm.status != 'VALID') {
return;
}


let flexipayfareData=sessionStorage.getItem(this.passSessionKey+'-passFareData');

let fareD= JSON.parse(atob(flexipayfareData));
delete fareD["avlDayList"];
// console.log(this.payActualFare)
if(this.flexipaySlected[0].key==15){
	this.flexifinalamount = ((Number(this.payActualFare)+
	Number(this.convinenceFee))-(Number(this.flexipaySlected[0].value)+Number(this.coupon_amount)));
}else this.flexifinalamount=Number(this.flexiamnt)-Number(this.coupon_amount);

var orderReferenceNumber = sessionStorage.getItem(this.passSessionKey+'-orderReferenceNumber');
this.showFlexiOTP=false;
this.showflexipaydefaultsection = true;
this.showVerificationDetails = false;
this.spinnerService.show();
		let cardnumber=this.flexipayForm.controls['cardnumber'].value;
			this.lastFourdigitsofcardNumber = cardnumber.substr(cardnumber.length - 4);
		var checkcustomerparams = {
			"card_number":cardnumber,
			"loanAmount":this.flexifinalamount,
			"mobile":this.REWARD_MOBILE,
			'orderReferenceNumber': orderReferenceNumber,
			'service_id':this.serviceId,
			'programName':this.sg['domainName']
		}

		var postparams = {
			postData:this.EncrDecr.set(JSON.stringify(checkcustomerparams))
		}

		this.rest.flexipayExistingCustomer(postparams).subscribe(results =>{
			let resp = JSON.parse(this.EncrDecr.get(results.result));
			this.flexivaliduserresp = resp;

	
			if(this.flexivaliduserresp.status == true){
				this.moveToSpecificView();

				this.spinnerService.hide();
				this.flexipayEligibleError = false;
				this.showFlexiOTP=true;
				this.flexiOtpButtonActive = true;
				this.showflexipaydefaultsection = false;
				this.showVerificationDetails = false;
				this.fpGuestsession= false;
			}else{
				this.spinnerService.hide();
				this.flexipayEligibleError = this.flexivaliduserresp.message;
				this.showflexipaydefaultsection = true;
				this.showVerificationDetails = false;
				this.showFlexiOTP = false;
				this.fpGuestsession= false;
				
			}
			
		}), (err: HttpErrorResponse) => {
			this.spinnerService.hide();
			this.flexipayEligibleError = "Something went wrong+";
			this.showflexipaydefaultsection = true;
			this.showVerificationDetails = false;
			this.showFlexiOTP = false;
			
			};

	}

	validateFlexipayOTP(){
		this.flexiOTPsubmitted = true;
		this.flexiemisubmitted = false;
		this.flexipayfinalSubmit = false;
		this.fpGuestsession= false;
		if (this.flexipayOTPForm.status != 'VALID') {
			return;
			}else
		this.showFlexiOTP=true;
		this.showVerificationDetails = false;
		this.showflexipaydefaultsection = false;
		let tenure = this.flexipaySlected[0].key;
		this.flexiOtpButtonActive = false;
		this.spinnerService.show();
		let otpValue = this.flexipayOTPForm.controls['otpNumber'].value;
		var validateotpParams = {
			"orderReferenceNumber": sessionStorage.getItem(this.passSessionKey+'-orderReferenceNumber'),
			"token":this.flexivaliduserresp.token,
			"bankReferenceNo":this.flexivaliduserresp.bankReferenceNo,
			"merchantReferenceNo":this.flexivaliduserresp.merchantReferenceNo,
			"loanAmount":this.flexifinalamount,
			"tenure":this.flexipaySlected[0].key,
			"otp":otpValue,
			"service_id":this.serviceId
		}
		
		this.fp_token=this.flexivaliduserresp.token; 
		this.fb_bankReferenceNo=this.flexivaliduserresp.bankReferenceNo;
		this.fb_merchantReferenceNo=this.flexivaliduserresp.merchantReferenceNo;
		this.fp_total_price=this.flexifinalamount;
		this.fp_interestRate=this.flexipaySlected[0].value;
		this.fp_tenure=this.flexipaySlected[0].key;

		var validateOTPpostparams = {
			postData:this.EncrDecr.set(JSON.stringify(validateotpParams))
		}
	
		
		this.rest.flexipayvalidateOTP(validateOTPpostparams).subscribe(results => {
			let resp = JSON.parse(this.EncrDecr.get(results.result)); 
			this.validateOTPresp = resp;
			// last6digitsnumber = validateOTPData.
			if(resp.status == true){
				this.spinnerService.hide();
				this.fpGuestsession= false;
			this.showFlexiOTP=false;
			this.showVerificationDetails = true;
			this.flexiOTPerror = false;
			this.flexipayOtpResponse = resp.validateOTPData;
			}else{
				this.spinnerService.hide();
				this.showFlexiOTP=true;
				this.showVerificationDetails = false;
				this.flexiOTPerror = this.validateOTPresp.message;
				// availableOTPAttempt
				this.flexiOtpButtonActive = true;
				if(this.validateOTPresp.availableOTPAttempt == 0){
					this.payNow(12);
				}
			}
		}), (err: HttpErrorResponse) => {
			this.spinnerService.hide();
			this.showFlexiOTP=true;
			this.showVerificationDetails = false;
			this.flexiOTPerror = 'Something went wrong.';
			this.flexiOtpButtonActive = true;
			};
	}
		

		

	
	/***----- APPLY COUPON ------***/
	@Output() sendCouponEvent = new EventEmitter<any>();
	coupon_amount:number=0;
	couponErrorCode:any;
	checkedCoupon:any;
	submittedpromoCode:Boolean=false;
	twoStep:Boolean=false;
	SHOWCAPTCHA:Boolean=false;
	verifiedCaptcha:string='';
	@ViewChild('recaptchaRef') public recaptchaRef: RecaptchaComponent;
	resolved(captchaResponse: string) {
		this.verifiedCaptcha=captchaResponse;
	}

	

	//get payment gateways values from radio button
	getPGvalues(pgvalue){
	var searchValue;
	var passpgtype;
	for(var i=0;i<this.availablePGids.length;i++){
		searchValue = this.availablePGids[i];
	}

	if(this.couponErrorCode == 1 && this.allowPGOnRemoveCoupon != true){
		var data = searchValue.indexOf(pgvalue);
		var checkCyberValue = searchValue.indexOf(5);
	if(this.openNoneligiblecouponDialog == 1){
		if((data != -1) || searchValue[0] == 0 ){
		passpgtype = pgvalue;
		this.ispgAllowed = true;
	} else if(checkCyberValue != -1 && data != -1){
		passpgtype = pgvalue;
		this.ispgAllowed = true;
	}else{
		this.ispgAllowed = false;
		let message = "This coupon is not elligble for this Payment gateway, please remove the coupon & try again";
		const showDialog =  this.dialog.open(invalidpgdialog, {
						disableClose: true,
						width: '600px',
						data: { messageData: message}
				});
				return;
	}
	}else{
		return null;
	}
	}
	return null;
	}

	checkedList:any;
	CheckboxChange(option, event) {
		if(event.target.checked) {
			this.checkedList.push(option.id);
		} else {
			for(var i=0 ; i < this.couponOptions.length; i++) {
				if(this.checkedList[i] == option.id) {
					this.checkedList.splice(i,1);
				}
	 		} 
 		}
	}

isCardValid(control: FormControl) {
	const q = new Promise((resolve, reject) => {
	// resolve(null);
		setTimeout(() => {


	let prgramName=this.sg['domainName'];

	let cardnumber=control.value.replace(/-/g, "");

	if(prgramName=='SMARTBUY' || prgramName==''){
	var res = cardnumber.substring(0, 6);
	}else{
	var res = cardnumber.substring(0, 9);
	}
	const urlParams = new HttpParams()
		.set('card_number', res)
		.set('prgramName', prgramName)
		.set('_token', this.XSRFTOKEN);


	let body = urlParams.toString();

		this.restApi.isCardValid(body).subscribe((data) => {
			if(data==0){
			resolve({ 'isCardValid': true });

			}else
			resolve(null);
		}, () => { resolve({ 'isCardValid': true }); });
		}, 5000);
	});
	return q;	
}

onSavecardChange(cards,cardIndex){
	const jobGroup: FormGroup = new FormGroup({});
	for (var i=0;i<Number(this.cardData.length);i++) {
	jobGroup.addControl('cardRow', new FormControl(cardIndex, Validators.required));
	if(i==cardIndex)
	jobGroup.addControl('save_cvvnumber'+i, new FormControl('', [Validators.required,Validators.pattern("^[0-9]*$"),Validators.minLength(3)]));
	else
	jobGroup.addControl('save_cvvnumber'+i, new FormControl('', [Validators.pattern("^[0-9]*$"),Validators.minLength(3)]));
	jobGroup.addControl('tokenization'+i, new FormControl('', [Validators.pattern("^[0-9]*$"),Validators.minLength(1)]));
	}
	jobGroup.addControl('termscondition', new FormControl('', [Validators.required,Validators.pattern('true')]));
	this.saveCardForm = jobGroup;

	this.selectedCardIndex=cardIndex;
	this.defaultCardVal=cards.card_id;
}

openNoneligibleforcouponDialog(){
	let message = "This coupon is not elligble for this Payment gateway, please remove the coupon & try again"
				const openDialog = this.dialog.open(invalidpgdialog, {
					disableClose: true,
					width: '600px',
					data: { messageData: message}
			});

	return;
// }
}

payNow(ptype){ 


	if(this.openNoneligiblecouponDialog == 1){
	var searchValue;
	var passpgtype;

	for(var i=0;i<this.availablePGids.length;i++){
		searchValue = this.availablePGids[i];
	}

	if(this.couponErrorCode == 1 && this.allowPGOnRemoveCoupon != true){
		let data = searchValue.indexOf(ptype);
		let checkCyberValue = searchValue.indexOf(5);
		if(data != -1 || searchValue[0] == 0){
		passpgtype = ptype;
		this.ispgAllowed = true;
	}else if(checkCyberValue != -1 && data != -1 ||  ptype==55 ){
		passpgtype = ptype;
		this.ispgAllowed = true;
	}else{
		this.ispgAllowed = false;
		let message = "This coupon is not elligble for this Payment gateway, please remove the coupon & try again";
		const showDialog =  this.dialog.open(invalidpgdialog, {
						disableClose: true,
						width: '600px',
						data: { messageData: message}
				});
				return;
	}
		} else{
			passpgtype = ptype;
		}
	}else {
		passpgtype = ptype;
	}
	var savedcard,newcard;
	savedcard=0;
	newcard=0;var tokenization;

		switch(passpgtype) { 
			case 1: { 
			this.submittedHdfcPgForm = true;
			if (this.hdfcPgForm.status !='VALID') {
			return;
			}
			break; 
			} 

			case 2: { 
			this.submittedNetBankingForm = true;
			if (this.netbankingForm.status !='VALID') {
			return;
			}
			break; 
			} 

			case 3: { 
			this.submittedEmiForm = true;
			if (this.emiForm.status !='VALID') {
			return;
			}
			break; 
			}
			
			case 11: { 
			this.submittedDebitEMIConfirmFrom = true;
			if (this.DebitEMIConfirmFrom.status !='VALID') {
			return;
			}
			break; 
			}
			
			case 4: { 
			this.submittedPayzappForm = true;
			if (this.payzappForm.status !='VALID') {
			return;
			}

			break; 
			} 

			case 5: { 

			this.submittedSaveCardForm = true;
			if (this.saveCardForm.status !='VALID') {
			return;
			}
			var cardRow=this.saveCardForm.controls.cardRow.value;
				newcard=0;
			savedcard=1;
			  tokenization=$("#tokenization"+cardRow).val();
			break; 
			} 
			case 6: { 
			this.submittedUpiForm = true;
			if (this.upiForm.status !='VALID') {
			return;
			}
			break; 
			} 
			case 55: { 
			
				// this.submittedCreditForm = true;
				// if (this.creditForm.status !='VALID'  || this.isCardValidStatus!=1) {
				// return;
				// }

                        tokenization=$("#tokenization").val();

				var arr=[];
				arr.push('cardnumber='+this.creditForm.controls['cardnumber'].value);  
				arr.push('expiryMonth='+this.creditForm.controls['expiryMonth'].value); 
				arr.push('expiryYear='+this.creditForm.controls['expiryYear'].value); 
				arr.push('cvvnumber='+this.creditForm.controls['cvvnumber'].value);         

				arr.push('nameoncard='+this.creditForm.controls['nameoncard'].value);   
				arr.push('savecard='+$('#savecard').val());   
				arr.push('tokenization='+tokenization);   
				arr.push('termscondition='+this.creditForm.controls['termscondition'].value);   
				var postVal=arr.join('&');    

				var encrypted = this.EncrDecr.set(postVal );
				newcard=1;
				break; 
			} 
			case 12: { 
				this.flexipayfinalSubmit = true;
				if (this.flexipayverifationform.status != 'VALID') {
				return;
				}
				break; 
				}
			case 7: {
				this.submittedPayNoAmtForm=true;
				if (this.PayNoAmtForm.status !='VALID') { 
					return;
				}
				break;
			}

		} 


		this.orderReferenceNumber=sessionStorage.getItem(this.passSessionKey+'-orderReferenceNumber');
		this.bookingRefNumber=sessionStorage.getItem(this.passSessionKey+'-clientTransactionId');
		this.passData=sessionStorage.getItem(this.passSessionKey+'-passData');
		this.passFareData=sessionStorage.getItem(this.passSessionKey+'-passFareData');
		this.ctype=sessionStorage.getItem(this.passSessionKey+'-ctype');

		this.payForm['controls']['orderReferenceNumber'].setValue(this.orderReferenceNumber);
		this.payForm['controls']['ctype'].setValue(this.ctype);

		var passData;
	
		passData=this.passData;
		let fareD= JSON.parse(atob(this.passFareData));
		// let df_fareData = this.EncrDecr.set(JSON.stringify(fareD))

		this.submittedPayForm=true;
		if (this.payForm.status !='VALID') {
		return;
		}
		let form: HTMLFormElement = <HTMLFormElement>document.getElementById('payForm');
		
		if(this.payTotalFare){
			this.spinnerService.show();	
				
			//Pg Double Check
			
			var dcemi_installment;
			if(ptype==11){
			dcemi_installment=this.DCEMISelectedAmount[0]['value'];
			}else{
			dcemi_installment='';
			}
			var cvvnumber;
			if(ptype==5){
			cvvnumber= this.saveCardForm.controls['save_cvvnumber'+cardRow].value;
			}else{
			cvvnumber='';
			}
			
			if(ptype==55)
			ptype=5;
			else
			ptype=ptype;
			
			var emi_option;
			if(ptype==3)
			emi_option=$("input[name='payemi-sub']:checked").val();
			
			if(ptype==11)
			emi_option=(this.DCEMItenure);
			
			var flexipaydiscount;
			if(ptype==12){
			  if(this.flexipaySlected[0].key==15) flexipaydiscount = this.flexipaySlected[0].value;
			  else flexipaydiscount=0;
			}else flexipaydiscount=0; 
		  
		  
			
			this.paynowBtnDisabled_5=true;
			var validatePGParams = {
				'paymentData': passData,
				'fareData':fareD["totalFare"],
				'emi_option':emi_option,
				'dcemi_installment':dcemi_installment,
				'newcard':newcard,
				'card_id':this.defaultCardVal,
				'cvvnumber':cvvnumber,
				'jCryption':encrypted,
				'savedcard':savedcard,
				'tokenization':tokenization,
				'applicationId':this.DCEMIapplicationId,
				'ctype':this.ctype,
				'ptype':ptype,
				'bookingRefNumber':this.bookingRefNumber,
				'orderReferenceNumber':this.orderReferenceNumber,
				'fp_token':this.fp_token,
				'fp_bankReferenceNo':this.fb_bankReferenceNo,
				'fp_merchantReferenceNo':this.fb_merchantReferenceNo,
				'fp_total_price':this.flexifinalamount,
				'fp_interestRate':this.fp_interestRate,
				'fp_tenure':this.fp_tenure,
				'fp_discount':flexipaydiscount,

				'dcemi_token':this.dcemi_token,
				'dcemi_bankReferenceNo':this.dcemi_bankReferenceNo,
				'dcemi_merchantReferenceNo':this.dcemi_merchantReferenceNo,
				'dcemi_interestRate':this.dcemi_interestRate,
				'dcemi_tenure':this.dcemi_tenure,
			};
			
			var postPgvalidateParams = {
			orderReferenceNumber:this.orderReferenceNumber,
			postData:this.EncrDecr.set(JSON.stringify(validatePGParams))
			};

			this.rest.validatePGData(postPgvalidateParams).subscribe(results => { 
				if(results.result==true){
				
                                setTimeout(() => {
                               form.submit();
                                }, 100);
				
				
				}else{
				this.paynowBtnDisabled_5=false;
				this.spinnerService.hide();
				alert('Something went wrong');
				}
			}), (err: HttpErrorResponse) => {
				this.paynowBtnDisabled_5=false;
				this.spinnerService.hide();
				alert('Something went wrong');
			};
			//Pg Double Check Ends
  
        }else{	
			if(ptype==7){
				this.paynowBtnDisabled_5=true;
				//console.log('Transaction successful');
				validatePGParams = {
					'paymentData': passData,
					'fareData':fareD["totalFare"],
					'emi_option':'',
					'dcemi_installment':'',
					'newcard':'',
					'card_id':'',
					'cvvnumber':'',
					'jCryption':'',
					'savedcard':'',
					'tokenization':0,
					'applicationId':'',
					'ctype':this.ctype,
					'ptype':ptype,
					'bookingRefNumber':this.bookingRefNumber,
					'orderReferenceNumber':this.orderReferenceNumber,
					'fp_token':'',
					'fp_bankReferenceNo':'',
					'fp_merchantReferenceNo':'',
					'fp_total_price':'',
					'fp_interestRate':'',
					'fp_tenure':'',
					'fp_discount':'',

					'dcemi_token':'',
					'dcemi_bankReferenceNo':'',
					'dcemi_merchantReferenceNo':'',
					'dcemi_interestRate':'',
					'dcemi_tenure':'',
				};
				//console.log(validatePGParams);
				var postPgvalidateParams = {
					orderReferenceNumber:this.orderReferenceNumber,
					postData:this.EncrDecr.set(JSON.stringify(validatePGParams))
				};
				this.rest.validatePGData(postPgvalidateParams).subscribe(results => {
					if(results.result==true){
					         setTimeout(() => {
                               form.submit();
                                }, 100);
					}else{
				this.paynowBtnDisabled_5=false;
					this.spinnerService.hide();
					alert('Something went wrong');
					}
				}), (err: HttpErrorResponse) => {
				this.paynowBtnDisabled_5=false;
					this.spinnerService.hide();
					alert('Something went wrong');
				};
				
			}else{
				this.paynowBtnDisabled_5=false;
				alert('Invalid amount');
			}
        }

			let trackUrlParams = new HttpParams()
			.set('current_url', window.location.href)
			.set('category', 'Pay Now')
			.set('event', 'Payment Section')
			.set('metadata',this.EncrDecr.set(JSON.stringify(JSON.stringify(postPgvalidateParams))));

			const track_body: string = trackUrlParams.toString();
			this.rest.trackEvents( track_body).subscribe(result => {});

}

validateDebitEmi(){
	this.submittedDebitEMIFrom = true;
	if (this.DebitEMIFrom.status !='VALID') {
	return;
	}

	this.DCEMItenure=$("input[name='payDebitemi-sub']:checked").val();
	this.DCEMISelectedAmount = this.emiDebitArray.filter(
	emi => emi.key === this.DCEMItenure);

	var tmppassData1=JSON.parse(this.EncrDecr.get(sessionStorage.getItem(this.passSessionKey+'-passData')));
	
	var finalFare;
	if(this.serviceId=='RedBus'){
		finalFare=tmppassData1['total_price'];
	}else if(this.serviceId== 'Flight'){
		finalFare = tmppassData1['flightDetails']['fare']['totalFare']-tmppassData1['flightDetails']['fare']['discount'];
	}else if(this.serviceId== 'Hotel'){
			finalFare = tmppassData1['fare']['totalFare']-tmppassData1['fare']['discount'];
		
	} else {
		finalFare=tmppassData1['fareData']['totalFare'];
	}
	// console.log(finalFare)
	
	this.spinnerService.show();
	let cardnumber=this.DebitEMIFrom.controls['cardnumber'].value.replace(/-/g, "");
	// check Existing Customer for DC EMI
	var checkExistingCustomerParams = {
		'client_token': 'HDFC243',
	'card_number':cardnumber,
	'loanAmount':(Number(finalFare)+Number(this.convinenceFee)),
	'mobile':this.REWARD_MOBILE,
	 orderReferenceNumber: sessionStorage.getItem(
        this.passSessionKey + "-orderReferenceNumber"
        ),
	};
	// console.log(checkExistingCustomerParams)
	var postCheckExistingCustomerParams = {
	postData:this.EncrDecr.set(JSON.stringify(checkExistingCustomerParams))
	};

	this.rest.checkExistingCustomer(postCheckExistingCustomerParams).subscribe(results => {
	if(results.result ){
	this.spinnerService.hide();
	// console.log("===");
	// console.log(results);
	let cresults=JSON.parse(this.EncrDecr.get(results.result ));
        //console.log(cresults);
	if(cresults.status==true){
	this.DCEMIapplicationId=cresults.applicationId;
	this.showDebitEMIOtp=true;
	this.showDebitEMI=false;
	this.showDebitEMIOtpConfirmation=false;
	 this.DCEMIError='';
	}else{
	this.DCEMIapplicationId='';
	this.DCEMIError=cresults.errorMessage;
    if(cresults.errorMessage==null || cresults.errorMessage==""){
        this.DCEMIError=cresults.message;
    }

	this.showDebitEMIOtp=false;
	this.showDebitEMI=true;
	this.showDebitEMIOtpConfirmation=false;
	}
	}else{
	this.DCEMIapplicationId='';
	this.DCEMIError='There is a technical issue, please try again later.';
	this.showDebitEMIOtp=false;
	this.showDebitEMI=true;
	this.showDebitEMIOtpConfirmation=false;
	}
	});
}

validateDebitEmi_new(){
    this.submittedDebitEMIFrom = true;

    if (this.Debit2EMIFrom.status !='VALID') {
    return;
    }
    this.DCEMItenure=$("input[name='payDebitemi-sub']:checked").val();
    this.DCEMISelectedAmount = this.emiDebitArray.filter(
    emi => emi.key === this.DCEMItenure);
    
    var tmppassData1=JSON.parse(this.EncrDecr.get(sessionStorage.getItem(this.passSessionKey+'-passData')));    
    var finalFare=this.payTotalFare;
    this.spinnerService.show();
    let panNo=this.Debit2EMIFrom.controls['panNo'].value.replace(/-/g, "");
    
    var checkExistingCustomerParams = {
        'client_token': 'HDFC243',
        'panNo':panNo,
        'loanAmount':(Number(finalFare)),
        'mobile':this.REWARD_MOBILE,
        orderReferenceNumber: sessionStorage.getItem(
        this.passSessionKey + "-orderReferenceNumber"
        ),
    };
    console.log(checkExistingCustomerParams);
    var postCheckExistingCustomerParams = {
    postData:this.EncrDecr.set(JSON.stringify(checkExistingCustomerParams))
    };

    this.rest.checkExistingCustomer(postCheckExistingCustomerParams).subscribe(results => {
    if(results.result ){
    this.spinnerService.hide();
    let result=JSON.parse(this.EncrDecr.get(results.result ));
    console.log(result);
    this.dcemivaliduserresp = result;
    if(result.status==true){
        this.showDebitEMIOtp=true;
        this.showDebitEMI=false;
        this.showDebitEMIOtpConfirmation=false;
        this.DCEMIError='';
    }else{
        this.DCEMIError=result.errorMessage;
        this.showDebitEMIOtp=false;
        this.showDebitEMI=true;
        this.showDebitEMIOtpConfirmation=false;
    }
    }else{
        this.DCEMIError='There is a technical issue, please try again later.';
        this.showDebitEMIOtp=false;
        this.showDebitEMI=true;
        this.showDebitEMIOtpConfirmation=false;
    }
    });
}

validateDebitEmiOTP(){
this.submittedDebitEMIOTPFrom = true;
if (this.DebitEMIOTPFrom.status !='VALID') {
return;
}
this.spinnerService.show();
let otpnumber=this.DebitEMIOTPFrom.controls['otpnumber'].value;
var tmppassData1=JSON.parse(this.EncrDecr.get(sessionStorage.getItem(this.passSessionKey+'-passData')));
var finalFare;
if(this.serviceId=='RedBus'){
	finalFare=tmppassData1['total_price'];
}else if(this.serviceId== 'Flight'){
	finalFare = tmppassData1['flightDetails']['fare']['totalFare']-tmppassData1['flightDetails']['fare']['discount'];
}else if(this.serviceId== 'Hotel'){
		finalFare = tmppassData1['fare']['totalFare']-tmppassData1['fare']['discount'];
	
} else {
	finalFare=tmppassData1['fareData']['totalFare'];
}
// Validate OTP for DC EMI
//console.log("applicationID"+this.DCEMIapplicationId);
var validateParams = {
'client_token': 'HDFC243',
'otpnumber':otpnumber,
'invoicePrice':(Number(finalFare)+Number(this.convinenceFee)),
'applicationId':this.DCEMIapplicationId,
'service_id':this.serviceId,
'tenure':this.DCEMItenure,
'orderReferenceNumber':sessionStorage.getItem(this.passSessionKey+'-orderReferenceNumber'),
'programName':this.sg['domainName']
};

// console.log(validateParams);
var postvalidateParams = {
postData:this.EncrDecr.set(JSON.stringify(validateParams))
};


this.rest.validateOTPDCEMI(postvalidateParams).subscribe(results => {
  if(results.result ){
   this.spinnerService.hide();
     let result=JSON.parse(this.EncrDecr.get(results.result ));
     if(result.status==true){
     this.DCEMIConfirmResponse=result.Applicants;
     this.showDebitEMIOtp=false;
     this.showDebitEMI=false;
     this.showDebitEMIOtpConfirmation=true;
     this.DCEMIError='';
     }else{
     this.DCEMIConfirmResponse='';
     this.DCEMIError=result.message;
     this.showDebitEMIOtp=true;
     this.showDebitEMI=false;
     this.showDebitEMIOtpConfirmation=false;
     }
  }else{
       this.DCEMIConfirmResponse='';
    this.DCEMIError='There is a technical issue, please try again later.';
     this.showDebitEMIOtp=true;
     this.showDebitEMI=false;
     this.showDebitEMIOtpConfirmation=false;
  
  }
});

}
validateDebitEmiOTP_new(){

    this.submittedDebitEMIOTPFrom = true;
    if (this.Debit2EMIOTPFrom.status !='VALID') {
        return;
    }
    this.spinnerService.show();
    let otpnumber=this.Debit2EMIOTPFrom.controls['otpnumber'].value;
    var tmppassData1=JSON.parse(this.EncrDecr.get(sessionStorage.getItem(this.passSessionKey+'-passData')));
    var finalFare=this.payTotalFare;
    var dcemi_interest=AppConfig.emiDebitInterst;
    var validateParams = {
        'client_token': 'HDFC243',
        'otpnumber':otpnumber,
        'invoicePrice':(Number(finalFare)),
        'service_id':this.serviceId,
        'tenure':this.DCEMItenure,
        'orderReferenceNumber':sessionStorage.getItem(this.passSessionKey+'-orderReferenceNumber'),
        'programName':this.sg['domainName'],
        "token":this.dcemivaliduserresp.token,
        "bankReferenceNo":this.dcemivaliduserresp.bankReferenceNo,
        "merchantReferenceNo":this.dcemivaliduserresp.merchantReferenceNo,
    };
    this.dcemi_token=this.dcemivaliduserresp.token; 
    this.dcemi_bankReferenceNo=this.dcemivaliduserresp.bankReferenceNo;
    this.dcemi_merchantReferenceNo=this.dcemivaliduserresp.merchantReferenceNo;
    this.dcemi_interestRate=dcemi_interest[this.DCEMItenure];
    this.dcemi_tenure=this.DCEMItenure;
    //console.log(validateParams);
    var postvalidateParams = {
    postData:this.EncrDecr.set(JSON.stringify(validateParams))
    };
    //console.log(postvalidateParams);
    this.rest.validateOTPDCEMI(postvalidateParams).subscribe(results => {
      if(results.result ){
       this.spinnerService.hide();
         let result=JSON.parse(this.EncrDecr.get(results.result ));
         console.log(result);
         this.dcemi_validateOTPresp = result;
         if(result.status==true){
            
             this.showDebitEMIOtp=true;
             this.showDebitEMI=false;
             //this.showDebitEMIOtpConfirmation=true;
             this.DCEMIError='';
             //this.dcemiOtpResponse = result.validateOTPData;
             //this.DebitEMIConfirmFrom.status="VALID";
			
			 this.DebitEMIConfirmFrom.setValue({
				termscondition: true,
				termscondition1: true
			 });

             this.payNow(11);
         }else if(result.status==false && result.availableOTPAttempt==0){

			this.showDebitEMIOtp=true;
			this.showDebitEMI=false;
			this.DCEMIError='';
			this.DebitEMIConfirmFrom.setValue({
			   termscondition: true,
			   termscondition1: true
			});

			this.payNow(11);
		 }
		 else{
             this.DCEMIConfirmResponse='';
             this.DCEMIError=result.message;
             this.showDebitEMIOtp=true;
             this.showDebitEMI=false;
             this.showDebitEMIOtpConfirmation=false;
         }
      }else{
            this.DCEMIConfirmResponse='';
            this.DCEMIError='There is a technical issue, please try again later.';
            this.showDebitEMIOtp=true;
            this.showDebitEMI=false;
            this.showDebitEMIOtpConfirmation=false;
      }
    });

}
goback() {
	//this.location.back(); 
}
	/* CVV only number validation */
numberInput($event) {
	var keycode = $event.which;
	if(!(keycode >= 48 && keycode <= 57))
	{
			event.preventDefault();		
	}  
}
AvoidSpace($event) {
	var keycode = $event.which;
	if (keycode == 32)
	event.preventDefault();
}

//select flexipay index
select(index: number) {
	this.selectedIndex = index;
}
/*special char & number & rupee symbol ( Rs.)*/
flInput($event){
	var keycode = $event.which;
	if((keycode >= 33 && keycode <= 47) || (keycode >= 91 && keycode <= 96) || 
	(keycode >= 48 && keycode <= 64) || (keycode == 8377) || (keycode >= 123 && keycode <= 126))
	{
			event.preventDefault();
	}
}
convertToUpperCase($event) {
	$event.target.value = $event.target.value.toUpperCase();
}

calldialog(event) { 
    var message=event;
    const dialogPaywithpoints = this.dialog.open(PaywithpointsDialog, {
		disableClose: true,
		panelClass: 'pay_points_dia',
        data: {
          popup: message,
		  customerInfo: this.customerInfo,
		  payTotalFare: this.payTotalFare,
		  payActualFare: this.payActualFare,
		  ctype:sessionStorage.getItem(this.passSessionKey+'-ctype'),
		  passSessionKey: this.passSessionKey,
		  serviceId: this.serviceId
        }
	});
	dialogPaywithpoints.afterClosed().subscribe(result => {
		// console.log(result);
		if(result!=undefined){
			this.RedeemStatus=result[0].RedeemStatus;	
				if(this.RedeemStatus)this.showRewardsBox=false; //Hide the paywithpoints section
			this.RedeemPoints=result[0].RedeemPoints;
			this.payTotalFare=result[0].RemaingAmount;
			this.RedeemAmount=result[0].RedeemAmount;
			this.showProceedPayment=true;
			if(this.payTotalFare>0){
				this.PayNoAmtStatus=false;
				this.redeemtext='You have successfully redeemed '+this.RedeemPoints+' points for <b>Rs. '+this.RedeemAmount+'</b>.</br> Please pay the remaining balance <b>Rs. '+this.payTotalFare.toFixed(2)+'</b> through card.';

				this.flexiamnt = (this.payTotalFare);
        this.flexipayArrDefault = this.commonHelper.flexipayIntcalc(this.payTotalFare);

			}else{
				const PayNoAmtForm: FormGroup = new FormGroup({});
				PayNoAmtForm.addControl('termscondition', new FormControl('', [Validators.required,Validators.pattern('true')]));
				this.PayNoAmtForm = PayNoAmtForm;

				this.PayNoAmtStatus=true;
				this.showAllPayment=false;
				this.redeemtext='You have successfully redeemed '+this.RedeemPoints+' points for Rs. <b>'+this.RedeemAmount+'</b>. Continue for booking.';
			}
			
		}
	});
}
paynowBtnDisabled_55:Boolean=false;
checkNonSpcOfferforHDFCcards(){ 
	//check SPC enabled or not
	this.submittedCreditForm = true;
	//console.log(this.creditForm);
	if (this.creditForm.status !='VALID') { 
	return;
	}
	this.paynowBtnDisabled_55=true;
	if(this.enableNONSPC==1){ 
		var cardNumber=this.creditForm.controls['cardnumber'].value;
		cardNumber = cardNumber.replace(/-/g, "");
		var last4Digit = cardNumber.substring((cardNumber.length-4), cardNumber.length);
		var splitCard = "";
		
		//let voucher_amount=0;
               // this.passFareData=sessionStorage.getItem(this.passSessionKey+'-passFareData');
               // let fareD= JSON.parse(atob(this.passFareData));
               // voucher_amount=fareD.voucher_amount;
		
		
		splitCard = cardNumber.substring(0, 6);
		var request = {
			"key":this.passSessionKey,
			"partnerId":this.partnerToken,
			"servicesId":this.ServiceToken,
			"orderReferenceNumber": sessionStorage.getItem(this.passSessionKey+'-orderReferenceNumber'),
			"orderAmount": (this.payActualFare-this.convinenceFee),
			"convenienceFee": this.convinenceFee,
			"binNumber":btoa(splitCard),
			"last4Digit":btoa(last4Digit),
			"_token":this.XSRFTOKEN,
			"programName":this.sg['domainName'],
			"cardId":'',
			"type":0,
			"cardNumber":btoa(cardNumber),
			"mobileNumber":this.REWARD_MOBILE
		};
		
		var passData = {
			postData: this.EncrDecr.set(JSON.stringify(request)),
			postType: 1
		};
		//var passData = btoa(JSON.stringify(request));
		
	
		
		this.pay.checkNonSpcOffer(passData).subscribe(data => {
			let response = (data); 
			if(response.okResponse==true){
				if(response.available==true){ 
					var message = "";
					var couponType = response.couponType;
					//console.log(this.coupon_amount);
					if(Number(response.couponAmount) > Number(this.coupon_amount)){
						if(Number(response.finalAmount) > 0){
							if(response.couponType=="Flat"){
								message = "You are eligible for a special flat discount of Rs. "+response.couponAmount+" on this booking!";
							}else{
								message = "You are eligible for a special discount of "+response.percentage+"% on this booking!";
							}
							//open spc modal
							
							const dialogSPC = this.dialog.open(spcDialog, {
								disableClose: true,
								data: {
									message: message,
									passSessionKey: this.passSessionKey,
									checkNonSpcOfferResponse: response,
									customerInfo: this.customerInfo,
									payTotalFare: this.payTotalFare,
									payActualFare: this.payActualFare
								},
								position: {
									top: '20px',
								},
								
							});
							dialogSPC.afterClosed().subscribe(result => { 
								if(!result){
									//CONTINUE WITH HDFC CARD PAYMENT
									this.payNow(55);
									//console.log('1');
								}else{
									//updating fare in summary section
									var couponArray=[];
									couponArray["coupon_id"] = '';
									couponArray["coupon_name"] = result.couponType;
									couponArray["coupon_code"] = result.couponCode;
									couponArray["coupon_amount"] = result.couponAmount;
									this.couponApplied=true;
									var couponUpdatedArray={type: 0, couponOptions:couponArray}; 
									this.sendCouponEvent.emit(couponUpdatedArray);

									//CONTINUE WITH HDFC CARD PAYMENT
									this.payNow(55);
									//console.log('2');
								}
							});
						}else{
							//CONTINUE WITH HDFC CARD PAYMENT
							this.payNow(55);

						}
					}else{
						//CONTINUE WITH HDFC CARD PAYMENT
						this.payNow(55);
					}							
				}else{ 
					//CONTINUE WITH HDFC CARD PAYMENT
					this.payNow(55);
				}
			}else{
				//CONTINUE WITH HDFC CARD PAYMENT
				this.payNow(55);
			}
		}), (err: HttpErrorResponse) => {
			// var message = 'Something went wrong';
			// alert(message);
			//CONTINUE WITH HDFC CARD PAYMENT
			//console.log('3');
			this.payNow(55);
		};
	}else if(this.enableNONSPCForCoupon == 1){
		var searchValue;
		if(this.couponErrorCode == 1){
	for(var i=0;i<this.availablePGids.length;i++){
		searchValue = this.availablePGids[i];
	}

var checkCyberValue = searchValue.indexOf(5);

		if(checkCyberValue != -1 || searchValue[0]==0 ){
		var cardNumber=this.creditForm.controls['cardnumber'].value;
		cardNumber = cardNumber.replace(/-/g, "");
		var last4Digit = cardNumber.substring((cardNumber.length-4), cardNumber.length);
		var splitCard = "";
		splitCard = cardNumber.substring(0, 6);
		var request1 = {
			"key":this.passSessionKey,
			"partnerId":this.partnerToken,
			"servicesId":this.ServiceToken,
			"orderReferenceNumber": sessionStorage.getItem(this.passSessionKey+'-orderReferenceNumber'),
			"orderAmount": (this.payActualFare- this.convinenceFee),
			"convenienceFee": this.convinenceFee,
			"binNumber":btoa(splitCard),
			"last4Digit":btoa(last4Digit),
			"_token":this.XSRFTOKEN,
			"programName":this.sg['domainName'],
			"cardId":'',
			"type":0,
			"cardNumber":btoa(cardNumber),
			"mobileNumber":this.REWARD_MOBILE
		};
		
		var passData1 = {
			postData: this.EncrDecr.set(JSON.stringify(request1)),
			postType: 1
		}; 

		this.pay.checkNonSpcCardElligible(passData1).subscribe(data => {
			let response = (data); 
			if(response.okResponse==true && this.showNONSPCsuccessModal == 1){
				if(response.available==true){ 
					var message = "";
					var couponType = response.couponType;
					if(Number(response.couponAmount) > Number(this.coupon_amount)){
						if(Number(response.finalAmount) > 0){
							if(response.couponType=="Flat"){
								message = "You are eligible for a special flat discount of Rs. "+response.couponAmount+" on this booking!";
							}else{
								message = "You are eligible for a special discount of "+response.percentage+"% on this booking!";
							}
							//open spc modal
							const dialogSPC = this.dialog.open(spcDialog, {
								disableClose: true,
								data: {
									message: message,
									passSessionKey: this.passSessionKey,
									checkNonSpcOfferResponse: response,
									customerInfo: this.customerInfo,
									payTotalFare: this.payTotalFare,
									payActualFare: this.payActualFare
								},
								position: {
									top: '20px',
								},
								
							});
							dialogSPC.afterClosed().subscribe(result => { 
								if(!result){
									//CONTINUE WITH HDFC CARD PAYMENT
									this.payNow(55);
								}else{
									//updating fare in summary section
									var couponArray=[];
									couponArray["coupon_id"] = '';
									couponArray["coupon_name"] = result.couponType;
									couponArray["coupon_code"] = result.couponCode;
									couponArray["coupon_amount"] = result.couponAmount;
									this.couponApplied=true;
									var couponUpdatedArray={type: 0, couponOptions:couponArray}; 
									this.sendCouponEvent.emit(couponUpdatedArray);

									//CONTINUE WITH HDFC CARD PAYMENT
									this.payNow(55);
								}
							});
						}else{
							//CONTINUE WITH HDFC CARD PAYMENT
							this.payNow(55);
						}
				
					}else{
						//CONTINUE WITH HDFC CARD PAYMENT
						this.payNow(55);
					}							
				}else{ 
					//CONTINUE WITH HDFC CARD PAYMENT
					this.payNow(55);
				}
			}else if(response.okResponse==false){ 
				let message = "This coupon is not elligble for this Payment gateway, please remove the coupon & try again"
				const openDialog = this.dialog.open(invalidpgdialog, {
					disableClose: true,
					width: '600px',
					data: { messageData: message}
			});

			}else {
				//CONTINUE WITH HDFC CARD PAYMENT
				this.payNow(55);
			}
	}), (err: HttpErrorResponse) => {
		// var message = 'Something went wrong';
		// alert(message);
		//CONTINUE WITH HDFC CARD PAYMENT
		this.payNow(55);
	};
}else if(this.openNoneligiblecouponDialog == 1 && this.allowPGOnRemoveCoupon != true){
	this.openNoneligibleforcouponDialog();
}else{
	this.payNow(55);
}
}else{
	this.payNow(55);
}
}else{
		//CONTINUE WITH HDFC CARD PAYMENT
		this.payNow(55);
	}
}
paynowBtnDisabled_5:Boolean=false;
checkNonSpcOfferforSaveCard(){

      var cardRow = this.saveCardForm.controls.cardRow.value;
      var card_id = this.cardData[cardRow]["card_id"];
      var card_bin = this.cardData[cardRow]["bin"];
  
        if(this.cardData.length >1 && this.cardData[cardRow]["expired"]==1){
      alert('This card is expired. Please add new valid card details to proceed with the transaction.');
      return;
      }
      
            if(this.cardData.length ==1 && this.cardData[cardRow]["expired"]==1){
      alert('This card is expired. Please add new valid card details to proceed with the transaction.');
      return;
      }


	//check SPC enabled or not
	this.submittedSaveCardForm = true;
	if (this.saveCardForm.status !='VALID') {
	return;
	}
	
		if(this.pgSettingsCYBERToken){
        var selectedValue = cardRow;
        $('#payinfoid').val(selectedValue);
        if ($('#tokenization'+selectedValue).is(":checked")) {
        }else{
        $('.payinfo_popup').trigger('click');
        return;
        }
	}
	
	this.paynowBtnDisabled_5=true;
	if(this.enableNONSPC==1){
		
		
               // let voucher_amount=0;
               // this.passFareData=sessionStorage.getItem(this.passSessionKey+'-passFareData');
               // let fareD= JSON.parse(atob(this.passFareData));
               // voucher_amount=fareD.voucher_amount;
		
		
		var request = {
			"key":this.passSessionKey,
			"partnerId":this.partnerToken,
			"servicesId":this.ServiceToken,
			"orderReferenceNumber": sessionStorage.getItem(this.passSessionKey+'-orderReferenceNumber'),
			"orderAmount": (this.payActualFare-this.convinenceFee),
			"convenienceFee": this.convinenceFee,
			"binNumber":'',
			"last4Digit":'',
			"_token":this.XSRFTOKEN,
			"programName":this.sg['domainName'],
			"cardId":card_id,
			"type":1,
			"cardNumber":btoa(card_bin),
			"mobileNumber":this.REWARD_MOBILE   
		};
		var passData = {
			postData: this.EncrDecr.set(JSON.stringify(request)),
			postType: 1
	    };
	    
	  
		this.pay.checkNonSpcOffer(passData).subscribe(data => { 
			//let response = JSON.parse(this.EncrDecr.get(data));
			let response = (data);
			if(response.okResponse==true){
				if(response.available==true){
					var message = "";
					var couponType = response.couponType;
					if(Number(response.couponAmount) > Number(this.coupon_amount)){
						if(Number(response.finalAmount) > 0){
							if(response.couponType=="Flat"){
								message = "You are eligible for a special flat discount of Rs. "+response.couponAmount+" on this booking!";
							}else{
								message = "You are eligible for a special discount of "+response.percentage+"% on this booking!";
							}
							//open spc modal
							const dialogSPC = this.dialog.open(spcDialog, {
								disableClose: true,
								data: {
									message: message,
									passSessionKey: this.passSessionKey,
									checkNonSpcOfferResponse: response,
									customerInfo: this.customerInfo,
									payTotalFare: this.payTotalFare,
									payActualFare: this.payActualFare
								}
							});
							dialogSPC.afterClosed().subscribe(result => {
								if(!result){
									//CONTINUE WITH SAVED CARD PAYMENT
									this.payNow(5);
								}else{
									//updating fare in summary section
									var couponArray=[];
									couponArray["coupon_id"] = '';
									couponArray["coupon_name"] = result.couponType;
									couponArray["coupon_code"] = result.couponCode;
									couponArray["coupon_amount"] = result.couponAmount;
									this.couponApplied=true;
									var couponUpdatedArray={type: 0, couponOptions:couponArray}; 
									this.sendCouponEvent.emit(couponUpdatedArray);
									
									//CONTINUE WITH SAVED CARD PAYMENT
									this.payNow(5);
								}
							});
						}else{
							//CONTINUE WITH SAVED CARD PAYMENT
							this.payNow(5);
						}
					}else{
						//CONTINUE WITH SAVED CARD PAYMENT
						this.payNow(5);
					}
				}else{
					//CONTINUE WITH SAVED CARD PAYMENT
					this.payNow(5);
				}
			}
			else{
				//CONTINUE WITH SAVED CARD PAYMENT
				this.payNow(5);
			}
		}), (err: HttpErrorResponse) => {
			// var message = 'Something went wrong';
			// alert(message);
			//CONTINUE WITH SAVED CARD PAYMENT
			this.payNow(5);
		};
	}else if(this.enableNONSPCForCoupon==1){

		if(this.couponErrorCode == 1){
		var searchValue;
		for(var i=0;i<this.availablePGids.length;i++){
			searchValue = this.availablePGids[i];
		}
	
	var checkCyberValue = searchValue.indexOf(5);
		if(checkCyberValue != -1 || searchValue[0]== 0){
		//var cardRow=this.saveCardForm.controls.cardRow.value;
		//var card_id=this.cardData[cardRow]['card_id'];
		//var card_bin=this.cardData[cardRow]['bin'];
		var request1 = {
			"key":this.passSessionKey,
			"partnerId":this.partnerToken,
			"servicesId":this.ServiceToken,
			"orderReferenceNumber": sessionStorage.getItem(this.passSessionKey+'-orderReferenceNumber'),
			"orderAmount": this.payActualFare,
			"convenienceFee": this.convinenceFee,
			"binNumber":'',
			"last4Digit":'',
			"_token":this.XSRFTOKEN,
			"programName":this.sg['domainName'],
			"cardId":card_id,
			"type":1,
			"cardNumber":btoa(card_bin),
			"mobileNumber":this.REWARD_MOBILE   
		};
		
		var passData1 = {
			postData: this.EncrDecr.set(JSON.stringify(request1)),
			postType: 1
	    };
		this.pay.checkNonSpcCardElligible(passData1).subscribe(data => {
			//let response = JSON.parse(this.EncrDecr.get(data));
			let response = (data);
			if(response.okResponse==true  && this.showNONSPCsuccessModal == 1){
				if(response.available==true){
					var message = "";
					var couponType = response.couponType;
					// response.couponAmount = 3000;
					if(Number(response.couponAmount) > Number(this.coupon_amount)){
						if(Number(response.finalAmount) > 0){
							if(response.couponType=="Flat"){
								message = "You are eligible for a special flat discount of Rs. "+response.couponAmount+" on this booking!";
							}else{
								 message = "You are eligible for a special discount of "+response.percentage+"% on this booking!";
							}
							//open spc modal
							const dialogSPC = this.dialog.open(spcDialog, {
								disableClose: true,
								data: {
									message: message,
									passSessionKey: this.passSessionKey,
									checkNonSpcOfferResponse: response,
									customerInfo: this.customerInfo,
									payTotalFare: this.payTotalFare,
									payActualFare: this.payActualFare
								}
							});
							dialogSPC.afterClosed().subscribe(result => {
								if(!result){
									//CONTINUE WITH SAVED CARD PAYMENT
									this.payNow(5);
								}else{
									//updating fare in summary section
									var couponArray=[];
									couponArray["coupon_id"] = '';
									couponArray["coupon_name"] = result.couponType;
									couponArray["coupon_code"] = result.couponCode;
									couponArray["coupon_amount"] = result.couponAmount;
									this.couponApplied=true;
									var couponUpdatedArray={type: 0, couponOptions:couponArray}; 
									this.sendCouponEvent.emit(couponUpdatedArray);
									
									//CONTINUE WITH SAVED CARD PAYMENT
									this.payNow(5);
								}
							});
						}else{
							//CONTINUE WITH SAVED CARD PAYMENT
							this.payNow(5);
						}
					}else{
						//CONTINUE WITH SAVED CARD PAYMENT
						this.payNow(5);
					}
				}else{
					//CONTINUE WITH SAVED CARD PAYMENT
					this.payNow(5);
				}
			}else if(response.okResponse==false){
				let message = "This coupon is not elligble for this Payment gateway, please remove the coupon & try again";
				const openDialog = this.dialog.open(invalidpgdialog, {
					disableClose: true,
					width: '600px',
					data: { messageData: message}
			});
			}else{
				//CONTINUE WITH SAVED CARD PAYMENT
				this.payNow(5);
			}
		}), (err: HttpErrorResponse) => {
			// var message = 'Something went wrong';
			// alert(message);
			//CONTINUE WITH SAVED CARD PAYMENT
			this.payNow(5);
		};
	}else if(this.openNoneligiblecouponDialog == 1 && this.allowPGOnRemoveCoupon != true){
		this.openNoneligibleforcouponDialog();
	}else{
		this.payNow(5);
	}
}else{
	this.payNow(5);
}
	}else{
		//CONTINUE WITH SAVED CARD PAYMENT
		this.payNow(5);
	}
}
}

//SPC OFFER DIALOG
@Component({
	selector: 'spc-dialog',
	templateUrl: './spc-dialog.html',
	styleUrls: ['./payment.component.scss']
})
export class spcDialog {
	customerInfo:any[];
	checkNonSpcOfferResponse: any;
	discountAmount:any;
	message:any;
	available:any;
	binNumber:any;
	percentage:any;
	couponType:any;
	couponCode:any;
	couponAmount:any;
	maxDiscount:any;
	finalAmount:any;
	oldAmount:any;
	payTotalFare:any;
	payActualFare:any;
	convenienceFee:any
	passSessionKey:any;
	oldOrderAmt:any;
	newOrderAmt:any;
	oldOrderAmtWithFee:any;
	newOrderAmtWithFee:any;
	constructor(public dialogSpc: MatDialogRef < spcDialog >,@Inject(MAT_DIALOG_DATA) public data: any,private pay: PayService,private EncrDecr: EncrDecrService) {
		this.message=data.message;
		this.passSessionKey=data.passSessionKey;
		this.checkNonSpcOfferResponse=data.checkNonSpcOfferResponse;
		this.customerInfo=data.customerInfo;
		this.payTotalFare=Number(data.payTotalFare);
		this.payActualFare=Number(data.payActualFare);
	}
	ngOnInit() {
		this.available=this.checkNonSpcOfferResponse.available;
		this.binNumber=this.checkNonSpcOfferResponse.binNumber;
		this.percentage=this.checkNonSpcOfferResponse.percentage;
		this.couponType=this.checkNonSpcOfferResponse.couponType;
		this.couponCode=this.checkNonSpcOfferResponse.couponCode;
		this.couponAmount=Number(this.checkNonSpcOfferResponse.couponAmount);
		this.maxDiscount=this.checkNonSpcOfferResponse.maxDiscount;
		this.finalAmount=Number(this.checkNonSpcOfferResponse.finalAmount);
		this.oldAmount=Number(this.checkNonSpcOfferResponse.oldAmount);
		this.convenienceFee=Number(this.checkNonSpcOfferResponse.convenienceFee);

		this.oldOrderAmt=Number(this.oldAmount) - Number(this.convenienceFee);
		this.newOrderAmt=Number(this.finalAmount) - Number(this.convenienceFee);
		this.oldOrderAmtWithFee=Number(this.oldAmount);
		this.newOrderAmtWithFee=Number(this.finalAmount);
		
	}
	applyNonSpcOffer(){
		var request = {
			"session_flight_key": this.passSessionKey,
			"orderReferenceNumber": sessionStorage.getItem(this.passSessionKey+'-orderReferenceNumber'),
		};
		var passData = {
			postData: this.EncrDecr.set(JSON.stringify(request)),
			postType: 1
	    };
		this.pay.applyNonSpcOffer(passData).subscribe(data => {
			//let response = JSON.parse(this.EncrDecr.get(data));
			let response=data;
			if(response.status==true){
				let val=true;
				this.dialogSpc.close(this.checkNonSpcOfferResponse);
			}else{
				let val=false;
				this.dialogSpc.close(val);
			}
		}), (err: HttpErrorResponse) => {
			var message = 'Something went wrong';
			alert(message);
		};
	}
	closeDialog(){
		let val=false;
		this.dialogSpc.close(val);
	}
}

//DCEMI DIALOG
@Component({
  selector: 'dcemi-dialog',
  templateUrl: './dcemi-dialog.html',
  styleUrls: ['./payment.component.scss']
})
export class dcemiDialog {
	customerInfo:any[];
	REWARD_EMAILID: string;
	REWARD_MOBILE: Number;
	Form1: FormGroup;
	submitted:Boolean = false;
	sub:any;
	serviceSettings : any;
	pgSettingsEMI:number=0;
	domainName:string;

		serviceId:string;
		@Input() set passServiceId(p: string){  
		this.serviceId=p;
		};

	
	constructor(public dialogDcemi: MatDialogRef < dcemiDialog > ,@Inject(MAT_DIALOG_DATA) public data: any,private appConfigService:AppConfigService,private sg: SimpleGlobal) {
	  this.customerInfo=data.customerInfo;
	  this.serviceSettings=this.appConfigService.getConfig();
	  this.domainName=this.sg['domainName'];
	  
	}
	

	ngOnInit() {
	  this.REWARD_EMAILID = this.customerInfo["email"];
	  this.REWARD_MOBILE = Number(this.customerInfo["mobile"]);
  
	  const Form1: FormGroup = new FormGroup({});
	  Form1.addControl('mobileNo', new FormControl('',[Validators.required, Validators.pattern("^[6-9][0-9]{9}$")]));
	  this.Form1 = Form1;
	  //pop-up will close after 10 mins(600000) 
	  
	  this.sub =  interval(600000).subscribe(x => {
		    this.dialogClose();
	  });
	}
	AvoidSpace($event) {
	  var keycode = $event.which;
	  if (keycode == 32)
	  event.preventDefault();
	}
	numberInput($event) {
	  var keycode = $event.which;
	  if (!(keycode >= 48 && keycode <= 57)) {
		  event.preventDefault();
	  }
	}
	dialogClose(){
		var val = this.Form1.controls['mobileNo']['value'];
		this.sub.unsubscribe();
		this.submitted = true;
		if (this.Form1.invalid) {
			return;
		} else {
			this.dialogDcemi.close(val);
		}
	}
	close(){


		let elementCyber: HTMLElement = document.getElementById('tab-ccdcCards') as HTMLElement; 
		elementCyber.click();
        

		this.dialogDcemi.close();
	}
}

//PAYWITHPOINTS DIALOG
@Component({
	selector: 'paywithpoints-dialog',
	templateUrl: './paywithpoints-dialog.html',
	styleUrls: ['./payment.component.scss'],
	providers: [   ]
})
export class PaywithpointsDialog {
	Form1: FormGroup;
	Form2: FormGroup;
	Form3: FormGroup;
	voucherForm1: FormGroup;
	//voucherForm2: FormGroup = new FormGroup({});
	submittedForm1: Boolean = false;
	submittedForm2: Boolean = false;
	submittedForm3: Boolean = false;
	submitted1: Boolean = false;
	//submittedvoucherForm2: Boolean = false;
	checkDate: any;  
	maxDate: any;
	saveCard: any;
	cdnUrl: any;
	serviceId: string;
	first9digit:String;
	public mask = {
		guide: true,
		showMask : true,
		mask: [/\d/, /\d/, '/', /\d/, /\d/, '/',/\d/, /\d/,/\d/, /\d/]
	};
	appConfig: any;
	customerInfo:any[];
	REWARD_EMAILID: string;
	REWARD_MOBILE: Number;
	XSRFTOKEN: string;
	passData:any=[];
	status:any=[];
	points_available:any;
	points_percentage:any;
	orderamount:any;
	totalorderpts:any;
	//conv_amount:any;
	infiniaPts:Number=null;
	conv_amount:Number=null;
	response0:any;
	
	response1:any=[];
	CcCharges:number=99;
	commonmessage:string='';
	response2:any;
	applyVoucherRes:any;
	response3:any;
	response4:any;
	applicable:Number=1;
	customermobile:any;
	saveCardShow:Boolean;
	payTotalFare;payActualFare;
	popup:any;
	ordertotalamount:any;
	VoucherPreRedeemBalance:any;
	VoucherPostRedeemBalance:any;
	AmountRedeemed:any;
	RemaingAmount:any;
	RedeemedPoints:any;
	vouchertransID:any;
	getVoucherPreRedeemBalance:any;
	getVoucherPostRedeemBalance:any;
	tab1:Boolean=true;
	tab2:Boolean=false;
	tab3:Boolean=false;
	vouchertab1:Boolean=true;
	vouchertab2:Boolean=false;
	selectedCust_id:any;
	cust_customer_id:any;
	cust_bin:any;
	cust_first4digit:any;
	cust_last4digit:any;
	cust_dob:any;
	cust_mobile:any;
	cust_is_primary:any;
	cust_program_name:any;
	cust_created_date:any;
	cust_modified_date:any;
	cust_status:any;
	ctype:string;
	passSessionKey:any;
	radioSavedCard:Boolean=true;
	radioAddNewCard:Boolean=false;
	customercards:any;primaryCust:any;
	buttonLoading:Boolean=true;
	buttonContinue1:Boolean=true;
	buttonContinue2:Boolean=true;
	Balfare:number = 0;
	serviceSettings:any;
	verificationText:any;
	noLeadingZeroPattern=/^(?!0)[0-9]*$/;
	VOUCHER_NAME:any="Voucher Code";
	constructor(public dialogPaywithpoints: MatDialogRef < PaywithpointsDialog >,@Inject(MAT_DIALOG_DATA) public data: any,private formBuilder: FormBuilder,private sg: SimpleGlobal,public rest:RestapiService,private EncrDecr: EncrDecrService,private pay: PayService,private bnIdle: BnNgIdleService,private communicate: CommunicationService,private appConfigService:AppConfigService) {
			this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
			this.popup=data.popup;
			this.passSessionKey=data.passSessionKey;
			this.customerInfo = data.customerInfo;
			this.payTotalFare = data.payTotalFare;
			this.Balfare = data.payTotalFare;
			this.payActualFare = data.payActualFare;
			this.ctype = data.ctype;
			this.REWARD_EMAILID = this.customerInfo["email"];
			this.REWARD_MOBILE = this.customerInfo["mobile"];
			this.XSRFTOKEN = this.customerInfo["XSRF-TOKEN"];
			this.customermobile = this.REWARD_MOBILE;
			this.serviceId=data.serviceId;

	}
	ngOnInit() {
		this.serviceSettings=this.appConfigService.getConfig();
		this.verificationText=this.serviceSettings.VERIFICATION_CODE_TEXT[this.sg['domainName']];
		this.VOUCHER_NAME=this.serviceSettings.VOUCHER_NAME;

		//this.verificationText="Please call concierge @1800-118-887/ 9986286688 if you haven't received the RP Redeption code";
		
		const form1: FormGroup = new FormGroup({});
		form1.addControl('first4digit', new FormControl('', [Validators.required,Validators.minLength(9),Validators.pattern("^[0-9]*$")],this.isCardValid.bind(this)));
		form1.addControl('last4digit', new FormControl('', [Validators.required,Validators.minLength(4),Validators.pattern("^[0-9]*$")]));
		form1.addControl('mobile', new FormControl('', [Validators.required,Validators.pattern("^[6-9][0-9]{9}$")]));
		form1.addControl('dob', new FormControl('', Validators.required));
		form1.addControl('savecard', new FormControl('', []));
		this.Form1 = form1;

		
		const form2: FormGroup = new FormGroup({});
		form2.addControl('infiniaPts', new FormControl('', Validators.required));
		form2.addControl('conv_amount', new FormControl('', [Validators.required,Validators.pattern(this.noLeadingZeroPattern)]));
		form2.addControl('termsconditions', new FormControl('', [Validators.required,Validators.pattern('true')]));
		this.Form2 = form2;

		
		const form3: FormGroup = new FormGroup({});
		form3.addControl('redeemCode', new FormControl('', [Validators.required,Validators.pattern("^[0-9]*$")]));
		this.Form3 = form3;

		const vForm1: FormGroup = new FormGroup({});
		vForm1.addControl('first4digit', new FormControl('', [Validators.required,Validators.minLength(9),Validators.pattern("^[0-9]*$")],this.isCardValid.bind(this)));
		vForm1.addControl('last4digit', new FormControl('', [Validators.required,Validators.minLength(4),Validators.pattern("^[0-9]*$")]));
		vForm1.addControl('applymobile', new FormControl('', [Validators.required,Validators.pattern("^[6-9][0-9]{9}$")]));
		vForm1.addControl('dob', new FormControl('', Validators.required));
		vForm1.addControl('applyvouchercode', new FormControl('', [Validators.required,Validators.pattern("^[a-zA-Z0-9]*$")]));
		this.voucherForm1 = vForm1;
		
		//SAVE CARD VALUE FROM CONFIG FILE
		this.saveCard=AppConfig.saveCard;
		if(this.saveCard==1){
			this.getCardDetails();		//fetch card details for normal login
			//UPDATE AVAILABLE POINTS 
			if(this.custCardsAvailable==true){
				this.pay.updateavaliablepoints().subscribe(res => {
					if(res['points_available']!=undefined || res['points_available']!=null){
						this.updatedPointsAvailable = res['points_available'];
						this.communicate.raiseEvent7(this.updatedPointsAvailable);
					}else{
						let msg="Points not updated";
						if(res['message']!=undefined)
						{
							msg=res['message'];
						}
						
					}
				}), (err: HttpErrorResponse) => {
					var message = 'Something went wrong';
					alert(message);
				};
			}
		}

		if(this.customerInfo["guestLogin"]==true){
			this.saveCardShow=false;
		}else{
			this.saveCardShow=true;
			this.getCardDetails();		//fetch card details for normal login
		}

		this.checkDate=new Date();	
	}
	closeDialog(): void {
		this.dialogPaywithpoints.close();
	}
	/***   REDEEM POINTS  ***/
	switchTab(val){
		if(val=='1'){
			this.tab1=true;
			this.tab2=false;
			this.tab3=false;
			this.showCloseBtn=true;
		}else if(val=='2'){
			const form2: FormGroup = new FormGroup({});
			form2.addControl('infiniaPts', new FormControl('', Validators.required));
			form2.addControl('conv_amount', new FormControl('', [Validators.required,Validators.pattern(this.noLeadingZeroPattern)]));
			form2.addControl('termsconditions', new FormControl('', [Validators.required,Validators.pattern('true')]));
			this.Form2 = form2;
			this.tab1=false;
			this.tab2=true;
			this.tab3=false;
			this.showCloseBtn=true;
		}else if(val=='3'){
			const form3: FormGroup = new FormGroup({});
			form3.addControl('redeemCode', new FormControl('', [Validators.required,Validators.pattern("^[a-zA-Z0-9]*$")]));
			this.Form3 = form3;
			this.tab1=false;
			this.tab2=false;
			this.tab3=true;
			this.showCloseBtn=true;
		}
	}
	changeRadio(){
		this.errorMsg="";
		this.errorMsg0="";
	}
	// pointsToRs(val){
	// 	this.infiniaPts=val;
	// 	this.conv_amount=Math.round(Number(this.points_percentage)*Number(this.infiniaPts));
	// 	this.checkApply(this.infiniaPts,this.conv_amount);
	// }
	RsToPoints(val){ 
		let conv_amount_checkNaN=Number(val);
        if( (val!=null) && (Number.isNaN(conv_amount_checkNaN) )==false ){
			this.conv_amount=val;
			this.infiniaPts=Math.round(Number(this.conv_amount)/Number(this.points_percentage));
			this.checkApply(this.infiniaPts,this.conv_amount);
		}
	}
	checkApply(infiniaPts,conv_amount){ 
		if( conv_amount.trim() !=''){
			this.totalorderpts=Number(this.payTotalFare)/Number(this.points_percentage);
			var Balfare = Number(this.payTotalFare) - Number(conv_amount);

			if(Balfare>=0){
				this.Balfare=Balfare;
			}else{
				this.Balfare=0;
			}
			var customername=this.response1['customername'];
			this.points_available=this.response1['points_available'];
			this.points_percentage=this.response1['points_percentage'];
			var client_type=this.response1['client_type'];
			var total_transvalue=this.response1['condition'].total_transvalue;

			if(infiniaPts > this.points_available){
				this.status['apply'] = false;
				this.status['message']="You do not have enough points to redeem";
			}else if(Object.keys(this.response1['condition']).length!=0){
				var name=this.response1['condition']['name'];
				var condition_type=this.response1['condition'].condition_type; 
				var redemption_type=this.response1['condition'].redemption_type;
				var redemption_value=this.response1['condition'].redemption_value;
				var min_value=this.response1['condition'].min_value;
				var max_value=this.response1['condition'].max_value;
				var monthly_trn_limit=this.response1['condition'].monthly_trn_limit;
				var monthly_trn_value=this.response1['condition'].monthly_trn_value;
				var total_count=this.response1['condition'].total_count;
				var total_transvalue=this.response1['condition'].total_transvalue;

				switch(condition_type)
				{
					case 1: //CASH
						if(min_value<=conv_amount)
						{
							if(max_value>=conv_amount || max_value==0)
							{
								switch(redemption_type)
								{
								case 1: //PERCENT
										var percentagevalue=(this.payTotalFare*redemption_value)/100;
										// console.log(percentagevalue); 
										// console.log(conv_amount);
										if(percentagevalue>=conv_amount){
										this.status['apply']=true;
										this.status['message']="";
										}else{
										this.status['apply']=false;
										this.status['message']="You can redeem "+redemption_value+"% (Rs "+Math.floor(percentagevalue)+") of your order amount ";
										}
										break;
								case 2: //FLAT
										if(redemption_value>conv_amount){
										this.status['apply']=true;
										this.status['message']="";
										}else{
										this.status['apply']=false;
										this.status['message']="You can redeem  Rs. "+redemption_value+" of your order amount ";
										}
										break;
								case 0:
										this.status['apply']=true;
										this.status['message']="";
										break;
								}
								if(status['apply']==true){
								if(monthly_trn_limit>total_count){
									if(monthly_trn_value>total_transvalue){
									this.status['apply']=true;
									this.status['message']="";
									}else{
									this.status['apply']=false;
									this.status['message']="Only Rs+"+monthly_trn_value+" limit for month";
									}
								}else{
									this.status['apply']=false;
									this.status['message']="Sorry, you have reached the maximum number of points redemption transaction for this month";
								}
								}
							}else{
							this.status['apply']=false;
							this.status['message']="Amount should be lesser than or equal to Rs. "+max_value+" ";
							}
						}else{
							this.status['apply']=false;
							this.status['message']="Amount should be greater than  or equal to Rs. "+min_value+" ";
						}
						break;
					case 2: //POINTS
						if(min_value<=infiniaPts)
						{
							if(max_value>=infiniaPts || max_value==0)
							{
							switch(redemption_type)
							{
								case 1:
									var total=this.points_available;
									var percentagevalue=(total*redemption_value)/100;
									if(percentagevalue>=infiniaPts && infiniaPts <= this.totalorderpts){
										this.status['apply']=true;
										this.status['message']="";
									}else{
										this.status['apply']=false;
										this.status['message']="You can redeem "+redemption_value+"% of your available points or equivalent to order value";
									}
									break;
								case 2:
									if(redemption_value>infiniaPts){
										this.status['apply']=true;
										this.status['message']="";
									}else{
										this.status['apply']=false;
										this.status['message']="Points can apply only "+redemption_value+"pts of your available points ";
									}
									break;
								case 0:
									this.status['apply']=true;
									this.status['message']="";
									break;
							}
							if(this.status['apply']==true){
								if(monthly_trn_limit>total_count){
								if(monthly_trn_value>total_transvalue){
									this.status['apply']=true;
									this.status['message']="";
								}else{
									this.status['apply']=false;
									this.status['message']="Only "+monthly_trn_value+"pts limit for month";
								}
								}else{
								this.status['apply']=false;
								this.status['message']="Sorry, you have reached the maximum number of points redemption transaction for this month";
								}
							}
							}else{
							this.status['apply']=false;
							this.status['message']="Points should be lesser than  or equal to "+max_value;
							}
						}else{
							this.status['apply']=false;
							this.status['message']="Points should be greater than  or equal to "+min_value;
						}
						break;
					default:
						this.status['apply']=false;
						break;
				}
				
			}else{
				this.status['apply']=true;
				this.status['message']="";
			}
		}else{ 
			this.Balfare=Number(this.payTotalFare);
			this.Form2.controls.infiniaPts.setValue('');
			this.status['apply'] = true;
			this.status['message']="";
		}	
		if(this.status['apply']){	 
			this.applicable=0;
		}else{
			this.applicable=1;
		}			
	}
	intitialconversionptoc(){ 						
		this.totalorderpts=Number(this.payTotalFare)/Number(this.points_percentage);
		var total =  this.payTotalFare;
		var customername=this.response1['customername'];
		this.points_available=this.response1['points_available'];
		this.points_percentage=this.response1['points_percentage'];
		var client_type=this.response1['client_type'];
		var total_transvalue=this.response1['condition'].total_transvalue;

		if(Object.keys(this.response1['condition']).length!=0){
			var name=this.response1['condition']['name']; 
			var condition_type=this.response1['condition'].condition_type; 
			var redemption_type=this.response1['condition'].redemption_type;
			var redemption_value=this.response1['condition'].redemption_value;

			var min_value=this.response1['condition'].min_value;
			var max_value=this.response1['condition'].max_value;
			var monthly_trn_limit=this.response1['condition'].monthly_trn_limit;
			var monthly_trn_value=this.response1['condition'].monthly_trn_value;
			var total_count=this.response1['condition'].total_count;
			var total_transvalue=this.response1['condition'].total_transvalue;
			var redemption_value = this.response1['condition'].redemption_value;
			var totalorderpts=this.voucherpoints_conversion(this.payTotalFare,this.points_percentage);
			var pointsvalue =  this.amount_conversion(this.points_available,this.points_percentage);
			var commonmessage = '';
			switch(condition_type)
			{
				case 1:					
					switch(redemption_type)
					{
					case 1: 
						var max = this.voucherpoints_conversion(Math.floor(total*redemption_value/100), this.points_percentage); 
						var value =  this.amount_conversion(max,this.points_percentage);
				
						if(redemption_value != 100)
						commonmessage="Please note that you can pay maximum "+redemption_value+"% of the transaction amount through Points i.e. Rs. "+value+" ("+redemption_value+"% of "+total+") only. Balance amount should be paid by Card or Account. ";
						
						if(pointsvalue < value)commonmessage="Please note that you can pay maximum  Rs. "+pointsvalue+" through Points. Balance amount should be paid by Card or Account. ";
					break;
					case 2:
						var payamount = redemption_value; 
						if(redemption_value>=total){
							payamount = total;
						}
						if(redemption_value != total)
						commonmessage="Please note that you can pay maximum  Rs. "+payamount+" only. Balance amount should be paid by Card or Account. ";

						if(pointsvalue < payamount)commonmessage="Please note that you can pay maximum  Rs. "+pointsvalue+" through Points. Balance amount should be paid by Card or Account. ";
					break;
					case 0:
						commonmessage="Please note that you can pay maximum  Rs. "+this.payTotalFare+"";
					break;
					}							
				break;
				case 2:						
					switch(redemption_type)
					{
						case 1:	
							total=this.points_available;
							var percentagevalue=Math.floor(total*redemption_value)/100;
							if(redemption_value != 100)
							commonmessage="Please note that you can pay maximum "+redemption_value+"% of your available points i.e. Rs. "+percentagevalue+" ("+redemption_value+"% of "+total+") only or equal to order amount Rs. "+this.payTotalFare+" Balance amount should be paid by Card or Account. ";
						break;
						case 2:
							commonmessage="Please note that you can pay maximum Rs. "+redemption_value+" of your available points only. Balance amount should be paid by Card or Account. ";
						break;
						case 0:
							commonmessage="Please note that you can pay maximum  Rs. "+this.payTotalFare+"";
						break;
					}						
				break;
				default:
						commonmessage="Please note that you can pay maximum  Rs. "+this.payTotalFare+"";
				break;
			}
	
		}else{
			commonmessage="Please note that you can pay maximum  Rs. "+this.payTotalFare+"";

		}
		this.commonmessage = commonmessage;
	}
	voucherpoints_conversion(mrp,points_percentage)
	{	
		return Math.round(Number(mrp)/Number(points_percentage));
	}
	amount_conversion(points,points_percentage)
	{	
		var main_value=points*points_percentage;
		return this.RoundHalfDown(main_value);
	}
	RoundHalfDown(num) {
		return -Math.round(-num);
	}
	handleEvent($event,ref){
		//console.log($event);
	}
	
	isCardValid(control: FormControl) {
		const q = new Promise((resolve, reject) => {
		// resolve(null);
		setTimeout(() => {
		let prgramName=this.sg['domainName'];
		//let cardnumber=control.value.replace(/-/g, "");
		let cardnumber=control.value;
		if(prgramName=='SMARTBUY' || prgramName==''){
		var res = cardnumber.substring(0, 6);
		}else{
		var res = cardnumber.substring(0, 9);
		}
		const urlParams = new HttpParams()
		.set('card_number', res)
		.set('prgramName', prgramName)
		.set('_token', this.XSRFTOKEN);
			let body = urlParams.toString();
			this.rest.isCardValid(body).subscribe((data) => {
			if(data==0){
			resolve({ 'isCardValid': true });
			}else
			resolve(null);
			}, () => { resolve({ 'isCardValid': true }); });
		}, 5000);
		});
		return q;
	}
	AvoidSpace($event) {
		var keycode = $event.which;
		if (keycode == 32)
		event.preventDefault();
	}
	noLeadingZero($event) {
		if ($event.target.value.length == 0 && $event.which == 48 ){
			event.preventDefault();
		}
	}
	preventLeftRightKeyScroll($event){
		if ($event.which == 37 || $event.which == 39) {
			$event.preventDefault();
		}
	}
	numberInput($event) {
		var keycode = $event.which;
		if (!(keycode >= 48 && keycode <= 57)) {
			event.preventDefault();
		}
	}
	moveOnNext($event,nextFieldID){
		if($event.target.value.length >= $event.target.maxLength){
			document.getElementById(nextFieldID).focus();
			if(nextFieldID=='dob'){
				let element: HTMLElement = document.getElementsByClassName('mat-icon-button')[0] as HTMLElement;
				element.click();
			}
		}
	}
	moveOnNext2($event,nextFieldID){
		if($event.target.value.length >= $event.target.maxLength){
			document.getElementById(nextFieldID).focus();
			if(nextFieldID=='dob2'){
				let element: HTMLElement = document.getElementsByClassName('mat-icon-button')[0] as HTMLElement;
				element.click();
			}
		}
		// if(nextFieldID=='applyvouchercode'){ 
		// 	document.getElementById('applyvouchercode').focus();
		// }
	}
	pastedtext:number;
	onPaste($event: ClipboardEvent) {
		var pastedtextstr = $event.clipboardData.getData('text');
		var pastedtext = Number($event.clipboardData.getData('text'));
		// console.log(pastedtextstr.indexOf(".") == -1)
		// console.log(Number.isNaN(pastedtext));
		if(Number.isNaN(pastedtext) || !(pastedtextstr.indexOf(".") == -1))
		{
			event.preventDefault();
		}
	}
	/*special char & rupee symbol ( Rs.)*/
	specialcharInput($event) {
		var keycode = $event.which;
		if ((keycode >= 33 && keycode <= 47) || (keycode >= 91 && keycode <= 96) || (keycode >= 58 && keycode <= 64) ||
		(keycode >= 123 && keycode <= 126) || (keycode == 8377) || (keycode == 8364) || (keycode == 128) || (keycode == 163) ||
		(keycode == 165)){
		event.preventDefault();
		}
	}
	convertToUpperCase($event) {
		$event.target.value = $event.target.value.toUpperCase();
	}
	selectedCardDetails:any;
	selectedCard(each){
		//this.selectedCust=each;
		this.selectedCardDetails=each;
		//this.selectedCust_id=each.id;
	}
	disabledbtn:Boolean=true;
	custCardsAvailable:Boolean;
	getCardDetails(){ 
		const urlParams = new HttpParams()
		.set('postData', 'XXXXX')
		const body: string = urlParams.toString();
		this.rest.getupdateCardDetails().subscribe(response => {
			this.disabledbtn=false;
			this.response4 = response;

			if (response.hasOwnProperty('customercards')){
				let customercards = response.customercards;
				//console.log(customercards);
				this.customercards=customercards;
				if(customercards.length>0){
					this.custCardsAvailable=true;
					//get primary card detail
					for(let i=0; i<customercards.length; i++){
						if(customercards[i].is_primary==1){
							this.selectedCardDetails=customercards[i];
							//this.selectedCust_id=customercards[i].id;
						}
					}
				}else{
					this.custCardsAvailable=false;
					this.radioAddNewCard=true;
				}
			}else{
				this.custCardsAvailable=false;
				this.radioAddNewCard=true;
			}


		}), (err: HttpErrorResponse) => {
			var message = 'Something went wrong';
			alert(message);
		};
	}
	collapseStatus1="collapse";errorMsg0:any="";
	checkAvailablePointsforSavedCard(){
		this.buttonContinue1=false; 
		this.showCloseBtn=false; 
		this.collapseStatus1=""; 
		var request = {
			"takecard":this.selectedCardDetails.id,
			"type":"available_points",
			"bin":"",
			"clientToken":this.sg['domainName'].toUpperCase(),
			"ctype":this.ctype,
			"modal":"DIGITAL",
			"noopt": 1,
			"customer_id":this.customerInfo["customerid"],
			"programName":this.sg['domainName'],
			"_token":this.XSRFTOKEN
		};
		var passData = {
		  postData: this.EncrDecr.set(JSON.stringify(request))
		};
		this.pay.getcustomercardpoints(passData).subscribe(response => {
			this.buttonContinue1=true;
			this.showCloseBtn=true;
			this.collapseStatus1="collapse";
			this.response1=response;
			if(this.response1['status']!=undefined && (this.response1['status']==true || this.response1['status']=='true'))
			{
				this.errorMsg0=""
				var customername=this.response1['customername'];
				this.points_available=this.response1['points_available'];
				this.points_percentage=this.response1['points_percentage'];
				var client_type=this.response1['client_type'];
				var card_type=this.response1['card_type'];
				this.CcCharges = this.response1['CcCharges'];
				this.intitialconversionptoc();
				this.switchTab(2);
			}else{
				this.errorMsg0="Something went wrong";
				if(this.response1['message']!=undefined)
				{
					this.errorMsg0=this.response1['message'];
				}
			}
		}), (err: HttpErrorResponse) => {
			var message = 'Something went wrong';
			alert(message);
			this.errorMsg0="";
			this.buttonContinue1=true;
			this.showCloseBtn=true;
			this.collapseStatus1="collapse";
		};
	}
	//CHECK AVAILABLE POINTS
	collapseStatus2="collapse";
	errorMsg:any="";
	checkAvailablePoints(){
		this.submittedForm1 = true;
		if (this.Form1.status !='VALID') {
		return;
		}else{
			this.buttonContinue2=false; 
			this.showCloseBtn=false;
			this.collapseStatus2="";
			var first9digit = this.Form1.controls['first4digit'].value;
			var first4digit = first9digit.substring(0, 4).trim();
			var last4digit = this.Form1.controls['last4digit'].value;
			var mobile = this.Form1.controls['mobile'].value;
			var dob = this.Form1.controls['dob'].value;
			var datePipe = new DatePipe('en-US'); 
			var dobStr = datePipe.transform(dob,'dd/MM/yyyy');
			if(this.Form1.controls['savecard'].value==true){
				var savecard=1;
			}else{
				var savecard=0;
			}
			var request = {
				"first4digit":first4digit,
				"last4digit":last4digit,
				"mobile":mobile,
				"DOB":dobStr,
				"type":"available_points",
				"bin":first9digit,
				"clientToken":this.sg['domainName'].toUpperCase(),
				"services_id":this.serviceId,
				"partner_id":42,
				"modal":"DIGITAL",
				"noopt": 1,
				"savecard":savecard,
				"customer_id":this.customerInfo["customerid"],
				"programName":this.sg['domainName'],
				"_token":this.XSRFTOKEN,
			};
			//console.log(request);
			var passData = {
			  postData: this.EncrDecr.set(JSON.stringify(request))
			};
			this.pay.availablePoints(passData).subscribe(response => {
				this.buttonContinue2=true; 
				this.showCloseBtn=true;
				this.collapseStatus2="collapse";
				this.response1 = response;
				if(this.response1['status']!=undefined && (this.response1['status']==true || this.response1['status']=='true'))
				{
					this.errorMsg="";
					var customername=this.response1['customername'];
					this.points_available=this.response1['points_available'];
					this.points_percentage=this.response1['points_percentage'];
					var client_type=this.response1['client_type'];
					var card_type=this.response1['card_type'];
					this.CcCharges = this.response1['CcCharges'];
					this.intitialconversionptoc();
					this.switchTab(2);
				}else{
					this.errorMsg="Something went wrong";
					if(this.response1['message']!=undefined)
					{
						this.errorMsg=this.response1['message'];
					}
				}
			}), (err: HttpErrorResponse) => {
				var message = 'Something went wrong';
				alert(message);
				this.errorMsg="";
				this.buttonContinue2=true; 
				this.showCloseBtn=true;
				this.collapseStatus2="collapse";
			};
		}
	}
	//PAY WiTH POINTS
	errorMsg4:any;updatedPointsAvailable:any;
	pointsRedemption(){ 
		this.submittedForm2 = true;
		
		if (this.Form2.status !='VALID' || this.applicable==1) {
			return;
		}else{
			this.buttonLoading=false;
			var first9digit = this.Form1.controls['first4digit'].value;
			var first4digit = first9digit.substring(0, 4).trim();
			var last4digit = this.Form1.controls['last4digit'].value;
			var mobile = this.Form1.controls['mobile'].value;
			var dob = this.Form1.controls['dob'].value;
			var datePipe = new DatePipe('en-US'); 
			var dobStr = datePipe.transform(dob,'dd/MM/yyyy');
			var infiniaPts = this.Form2.controls['infiniaPts'].value;
			var conv_amount = this.Form2.controls['conv_amount'].value;
			var request ={
				"type": "redeem_points",
				"points": infiniaPts,
				"programName":this.sg['domainName'],
				"amount":conv_amount,
				"clientToken":this.sg['domainName'].toUpperCase(),
				"partner_id": 42,
				"services_id": this.serviceId,
				"rewards": 0,
				"isConcierge": 0,
				"modal": "DIGITAL",
				"ctype":this.ctype,
				"total_amount": this.payTotalFare,
				"points_available": this.points_available,
				 "_token": this.XSRFTOKEN
			}
			//var passData = JSON.stringify(request);
			var passData = {
				postData: this.EncrDecr.set(JSON.stringify(request))
			};
			this.pay.pointsRedemption(passData).subscribe(response => {
				this.buttonLoading=true;
				//this.response2 = JSON.parse(this.EncrDecr.get(response));
				this.response2 = response;
				if(this.response2.status!=undefined && (this.response2.status || this.response2.status=="true")){
					this.errorMsg4="";
					this.switchTab(3); //redirect to otp page

					//UPDATE AVAILABLE POINTS -when there is saved cards then make this call
					if(this.custCardsAvailable==true){
						this.pay.updateavaliablepoints().subscribe(res => {
							if(res['points_available']!=undefined || res['points_available']!=null){
								this.updatedPointsAvailable = res['points_available'];
								this.communicate.raiseEvent7(this.updatedPointsAvailable);
							}else{
								let msg="Points not updated";
								if(res['message']!=undefined)
								{
									msg=res['message'];
								}
						
							}
						}), (err: HttpErrorResponse) => {
							var message = 'Something went wrong';
							alert(message);
						};
					}
				}else{
					this.errorMsg4="Something went wrong";
                    if(this.response2['message']!=undefined)
                    {
                        this.errorMsg4=this.response2['message'];
                    }
				}
			}), (err: HttpErrorResponse) => {
				this.errorMsg4="";
				this.buttonLoading=true;
				var message = 'Something went wrong';
				alert(message);
			};
		}
	}
	//SEND REDEMPTION CODE
	errorMsg2:any;
	codeVerification(){
		this.submittedForm3=true;
		if (this.Form3.status !='VALID') {
		return;
		}else{
			this.errorMsg2="";
			var code = this.Form3.controls['redeemCode'].value;
			var request = {
				"otp": code,
				"_token":this.XSRFTOKEN,
				"verifycode":1,
				"ctype":this.ctype,
				"total_amount": this.payTotalFare,
				"modal": "DIGITAL",
				'orderReferenceNumber': sessionStorage.getItem(this.passSessionKey+'-orderReferenceNumber'),
			}
			//var passData = JSON.stringify(request);
			var passData = {
				postData: this.EncrDecr.set(JSON.stringify(request))
			};
			this.pay.voucherRedemption(passData).subscribe(response => {
				//this.response3 = JSON.parse(this.EncrDecr.get(response));
				this.response3 = response;
				
				if(this.response3.status!=undefined && (this.response3.status || this.response3.status=="true")){
					this.errorMsg2="";
					this.ordertotalamount = this.response3.ordertotalamount
					this.VoucherPreRedeemBalance = this.response3.VoucherPreRedeemBalance;
					this.VoucherPostRedeemBalance = this.response3.VoucherPostRedeemBalance;
					this.AmountRedeemed = this.response3.AmountRedeemed;
					this.RemaingAmount = this.response3.RemaingAmount;
					this.RedeemedPoints = this.response3.RedeemedPoints;
					this.vouchertransID = this.response3.vouchertransID;
					var submitSuccess = true;
					this.popup="apply_voucher";
					this.switchvoucherTab(2);
					this.payTotalFare = this.payTotalFare - this.AmountRedeemed;
				}else{
					this.errorMsg2="Something went wrong";
                    if(this.response3['message']!=undefined)
                    {
                        this.errorMsg2=this.response3['message'];
                    }
					// var submitSuccess = false;
					// this.dialogPaywithpoints.close();
				}
			}), (err: HttpErrorResponse) => {
				this.errorMsg2="";
				var message = 'Something went wrong';
				alert(message);
			};
		}
		//this.closeDialog();
	}
	disabledbtnVerification:Boolean=false;
	msg:String='';
	onFinishedTimer(): void {
		this.disabledbtnVerification=true;
		setTimeout(function(){ 
			alert("Session expired! Please regenerate a new OTP or proceed with other payment options.");
		}, 500);
	}
	//RESEND REDEMPTION CODE
	resendCount=0;
	resendBtnStatus:Boolean=true;
	ResendingConfirm:Boolean=false;
	resendStatus:Boolean=true;
	resendCode(ref){
		this.errorMsg2="";
		this.resendBtnStatus=false;
		this.resendCount++;
		//console.log(this.resendCount)
			if(this.resendCount==2){
				this.resendBtnStatus=true;
				this.errorMsg2="This is your last attempt to generate the OTP.";
				//this.resendStatus=false;
			}
			if(this.resendCount>2){
				alert("You have exceeded maximum entry of OTPs. Please regenerate a new OTP or proceed with other payment options.");
				this.closeDialog();
				return;
			}else{
				ref.restart();
				this.disabledbtnVerification=false;
				var request = {
					"_token": this.XSRFTOKEN
				}
				var passData = {
					postData: this.EncrDecr.set(JSON.stringify(request))
				};
				this.pay.resendRedemptionOtp(passData).subscribe(response => { 
					this.resendBtnStatus=true;
					//this.response3 = JSON.parse(this.EncrDecr.get(response));
					this.response3 = response;
					if(this.response3.status!=undefined && (this.response3.status || this.response3.status=="true")){
						this.ResendingConfirm=true;
						setTimeout(function() { 
							this.ResendingConfirm=false;
						}.bind(this), 2000);
						
						this.VoucherPreRedeemBalance = this.response3.VoucherPreRedeemBalance;
						this.VoucherPostRedeemBalance = this.response3.VoucherPostRedeemBalance;
						this.AmountRedeemed = this.response3.AmountRedeemed;
						this.RemaingAmount = this.response3.RemaingAmount;
						this.RedeemedPoints = this.response3.RedeemedPoints;
						this.vouchertransID = this.response3.vouchertransID;
						var submitSuccess = true;
					}else{
						this.errorMsg2="Something went wrong";
						if(this.response3['message']!=undefined)
						{
							this.errorMsg2=this.response3['message'];
						}
						this.resendBtnStatus=true;
					}
				}), (err: HttpErrorResponse) => {
					this.errorMsg2="";
					this.resendBtnStatus=true;
					var message = 'Something went wrong';
					alert(message);
				};
			}
	
	}
	clearErrMsg(){
		this.errorMsg2="";
	}

	/***   APPLY VOUCHER  ***/
	showCloseBtn:Boolean=true;
	switchvoucherTab(val){
		if(val=='1'){
			this.showCloseBtn=true;
			this.vouchertab1=true;
			this.vouchertab2=false;
		}else if(val=='2'){
			this.showCloseBtn=false;
			this.vouchertab1=false;
			this.vouchertab2=true;
		}
	}
	//REDEEM VOUCHER
	errorMsg3:any;
	voucherRedemption(){ 
		this.submitted1=true;
		if (this.voucherForm1.status !='VALID') {
		return;
		}else{
			var first9digit = this.voucherForm1.controls['first4digit'].value;
			var first4digit = first9digit.substring(0, 4).trim();
			var last4digit = this.voucherForm1.controls['last4digit'].value;
			var applymobile = this.voucherForm1.controls['applymobile'].value;
			var dob = this.voucherForm1.controls['dob'].value;
			var datePipe = new DatePipe('en-US'); 
			var dobStr = datePipe.transform(dob,'dd/MM/yyyy');
			var applyvouchercode = this.voucherForm1.controls['applyvouchercode'].value;
			var request = {
				"first4digit": first4digit,
				"last4digit": last4digit,
				"mobile": applymobile,
				"DOB": dobStr,
				"bin": first9digit,
				"partner_id": 42,
				"services_id": this.serviceId,
				"total_amount": this.payTotalFare,
				"applyvouchercode": applyvouchercode,
				"ctype": this.ctype,
				"modal": "DIGITAL",
				'orderReferenceNumber': sessionStorage.getItem(this.passSessionKey+'-orderReferenceNumber'),
				"_token":this.XSRFTOKEN 
			}
			//var passData = JSON.stringify(request);
			var passData = {
				postData: this.EncrDecr.set(JSON.stringify(request))
			};
			this.pay.voucherRedemption(passData).subscribe(response => {
				//this.applyVoucherRes = JSON.parse(this.EncrDecr.get(response));
				this.applyVoucherRes = response;
				
				if(this.applyVoucherRes.status!=undefined && (this.applyVoucherRes.status || this.applyVoucherRes.status=="true")){ 
					this.errorMsg3="";
					this.ordertotalamount = this.applyVoucherRes.ordertotalamount
					this.VoucherPreRedeemBalance = this.applyVoucherRes.VoucherPreRedeemBalance;
					this.VoucherPostRedeemBalance = this.applyVoucherRes.VoucherPostRedeemBalance;
					this.AmountRedeemed = this.applyVoucherRes.AmountRedeemed;
					this.RemaingAmount = this.applyVoucherRes.RemaingAmount;
					this.RedeemedPoints = this.applyVoucherRes.RedeemedPoints;
					this.vouchertransID = this.applyVoucherRes.vouchertransID;
					this.switchvoucherTab(2); //redirect to otp page
					this.payTotalFare = this.payTotalFare - this.AmountRedeemed; 
				}else{
					this.errorMsg3="Something went wrong";
					if(this.applyVoucherRes['message']!=undefined)
					{
						this.errorMsg3=this.applyVoucherRes['message'];
					}
					// var message = 'Something went wrong';
					// alert(message);
				}
			}), (err: HttpErrorResponse) => {
				this.errorMsg3="";
				var message = 'Something went wrong';
				alert(message);
			};
		}
	}
	submitVoucher(){ 
		let res = [];
		this.dialogPaywithpoints.close(res);
		res.push(
			{
				RedeemStatus:true,
				RedeemPoints:this.RedeemedPoints,
				RedeemAmount:this.AmountRedeemed,
				RemaingAmount:this.RemaingAmount
			}
		);
	}

}

  

export interface DialogData {
	messageData: string;
	showC: boolean;
}
@Component({
	// selector: 'confirmation-new-dialog',
	templateUrl: './nonspcpgnoteligible.html',
	styleUrls: ['./payment.component.scss'],
})
export class invalidpgdialog {
	constructor(public invalidPGDialog: MatDialogRef<invalidpgdialog>,
			@Inject(MAT_DIALOG_DATA) public data: DialogData) { 
				invalidPGDialog.disableClose = true;

			}

			invalidPGdDialog(): void {
			this.invalidPGDialog.close();
	}
	// onNoClick():void{
	// 		this.nonpscpgnotellible.close(0);
	// }
}

  
