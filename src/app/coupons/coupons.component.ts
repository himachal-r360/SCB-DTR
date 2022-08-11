import { Component, OnInit,Input, Output, EventEmitter,Inject, ViewChild, ElementRef, HostListener } from '@angular/core'; 
import {APP_CONFIG, AppConfig} from '../configs/app.config';
import { CommonHelper } from 'src/app/shared/utils/common-helper';
import {EncrDecrService} from 'src/app/shared/services/encr-decr.service';
import {environment} from '../../environments/environment';
import { AppConfigService } from '../app-config.service';
import {  FormGroup,  FormControl,   Validators,   FormBuilder} from '@angular/forms';
import { RestapiService} from 'src/app/shared/services/restapi.service';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

declare var $: any;

import { RecaptchaComponent } from 'ng-recaptcha';
import { SimpleGlobal } from 'ng2-simple-global';
  import { DOCUMENT, NgStyle, DecimalPipe, DatePipe } from '@angular/common';
  
@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss']
})
export class CouponsComponent implements OnInit {
        selectedIndex: number = -1;
        showVerificationDetails:boolean = false;
        autoApplyError:number=0;
        @Output() sendtotalfare = new EventEmitter<any>();
        promoForm: FormGroup;
        cdnUrl: any;
        couponOptions: any=[];
        showoffer:boolean=false;
        assetPath:string;
        @Input() passSessionKey;
        @Input() orderReferenceNumber;
        domainPath:string;
        appConfig: any;
        domainRedirect: string;
       
        @Input() set passActualFare(p: string){  
        this.payActualFare=p;
        };


        convinenceFee:number=0;
        @Input()  set passConvinenceFee(p: number){  
        this.convinenceFee=p;
        };
         partnerToken:any;serviceToken:any;   
        @Input() set passServiceToken(p: string){  
        this.serviceToken=p;
        };
        
         @Input() set passPartnerToken(p: string){  
        this.partnerToken=p;
        };
        isactualLogin:any;

        @Input() set passactualLogin(p: boolean){
        this.isactualLogin = p;
        }
        @Input() set passTotalFare(p: string){  
        this.payTotalFare=p;
        };

        @Input() customerInfo;
        
         
        MAIN_SITE_URL:string;
       
        isLoggedIn:boolean=false;
        
        ctype:string;
        payTotalFare;
        payActualFare;
        passData;
        passFareData;

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

        count:number=0;
        pass_coupon_status:any;

        /***----------REMOVE COUPON ----------***/
        @Input() remove_Coupon:any[];
        remove_Coupon_id:any;
        pointsPG: number = 0;
	 siteKey: any;	
	 serviceSettings:any;	
	ngOnChanges(){

		
	}

	
	constructor(public rest:RestapiService,private EncrDecr: EncrDecrService,private http: HttpClient,private formBuilder: FormBuilder,public commonHelper: CommonHelper,public dialog: MatDialog,private sg: SimpleGlobal,private appConfigService: AppConfigService) { 
		this.assetPath=this.sg['assetPath']; 
		this.domainPath=this.sg['domainPath'];
		this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
		 this.serviceSettings=this.appConfigService.getConfig();
                this.siteKey = this.serviceSettings.SITEKEY;
	}
	
	ngOnInit() {
	
                this.showoffer = true;
                this.promoForm = new FormGroup({
                promoCode: new FormControl('',Validators.required),
                couponCaptcha: new FormControl({value: '', disabled: true},[Validators.required])
                });
                this.getCoupons();
                
	
	}

		
	/***----- COUPON ------***/
	
	getCoupons(){
		var couponMinValCheckArr = [];
			const urlParams = {'client_token': 'HDFC243','service_name':this.serviceToken,'partner_name':this.partnerToken};
			
			var couponParam = {
			postData:this.EncrDecr.set(JSON.stringify(urlParams))
			};

			this.rest.getCoupons(couponParam).subscribe(results => { 
				var datePipe = new DatePipe('en-US'); 
				var todayDt = datePipe.transform(new Date(), 'yyyy-MM-dd 00:00:00'); 
				var todayDtStr = new Date(todayDt);   
				var todayTimestamp = todayDtStr.setDate(todayDtStr.getDate()); 
				let result=JSON.parse(this.EncrDecr.get(results.result ));
				// console.log(result)
				
				for(var i=0; i<result.values.length; i++) {
					var fromString = result.values[i].from_date; 
					var fromParts = fromString.split("/");		
					var fromDate = new Date(+fromParts[2], fromParts[1] - 1, +fromParts[0]); 
					var from = fromDate.setDate(fromDate.getDate()); 

					var toString = result.values[i].to_date; 
					var toParts = toString.split("/");		
					var toDate = new Date(+toParts[2], toParts[1] - 1, +toParts[0]); 
					var to = toDate.setDate(toDate.getDate()); 
					
					this.pass_coupon_status = result.values[i].status;
					if(((todayTimestamp>=from) && (todayTimestamp<=to)) )
					{
						couponMinValCheckArr.push(result.values[i]);
					}
				}
				this.couponOptions=couponMinValCheckArr;
				
				
				//console.log(this.couponOptions);
				
        		if(this.couponOptions[0])
			this.validateCoupon(this.couponOptions[0]);
		});
		
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
	clearErrorMsg(){ 
		this.removeCoupon(1);
		if(this.twoStep){
			this.SHOWCAPTCHA=true;
			this.verifiedCaptcha='';
			this.promoForm.controls['couponCaptcha'].enable();
			if(this.recaptchaRef!=undefined){
				this.recaptchaRef.reset();
			}	
		}
	}
	applyCoupon(couponArray){ 
	    this.removeCoupon(0);

		this.coupon_code=couponArray.coupon_code;
		//CAPTCHA ADD-REMOVE-RESET
		if(this.twoStep){
			this.SHOWCAPTCHA=true;
			this.verifiedCaptcha='';
			this.promoForm.controls['couponCaptcha'].enable();
			if(this.recaptchaRef!=undefined){
				this.recaptchaRef.reset();
			}
			
			if(this.couponApplied){	// REMOVE BTN IS SHOWING
				this.submittedpromoCode=true;
				if (this.promoForm.invalid) {
					return;
				}else{	
					this.validateCoupon(couponArray);
				}
			}else{	 //APPLY BTN IS SHOWING	
				/** onclick of APPLY btn form will be validated */	
			}
		}else{	
			if(this.recaptchaRef!=undefined){
				this.recaptchaRef.reset();
			}	
			this.promoForm.controls['couponCaptcha'].disable();
			this.SHOWCAPTCHA=false;
			this.validateCoupon(couponArray);
		}
		
	}
	validateCoupon(couponArray){
		this.coupon_code=couponArray.coupon_code;
	
		this.showVerificationDetails = false;
		this.selectedIndex = -1;

		this.submittedpromoCode=false;

		var urlParams = {
			'client_token': 'HDFC243',
			'service_name':this.serviceToken,'partner_name':this.partnerToken,
			'order_amount': this.payActualFare,
			'orderReferenceNumber': this.orderReferenceNumber,	
			'coupon_code':couponArray.coupon_code,
			'coupon_status':couponArray.status,
			'g-recaptcha-response':this.verifiedCaptcha,
			'customer_id':this.customerInfo['id']
		};
		
		
		var couponApplyParam = {
			postData:this.EncrDecr.set(JSON.stringify(urlParams))
		};
		var couponUpdatedArray ;
		this.rest.validateCoupon(couponApplyParam).subscribe(results => {
			if(results.result ){
				let result=JSON.parse(this.EncrDecr.get(results.result ));
				this.couponErrorCode = result.errorcode;

				//SETTING variable "twoStep" as true
				if(result.twoStep==true){
					this.twoStep=true;
				}
				if(result.hasOwnProperty('status') && result.status=="fail"){
					this.coupon_name ='';
					this.coupon_code =this.coupon_code;
					this.coupon_amount =0; 
					this.couponApplied=false;
					this.couponError=result.error;
					this.autoApplyError=1;
					couponUpdatedArray = {type: 1, couponOptions: this.couponOptions}; 
					this.sendCouponEvent.emit(couponUpdatedArray);
					//SHOW CAPTCHA AFTER FAIL RESPONSE	
					if(this.twoStep){
						this.SHOWCAPTCHA=true;
						this.verifiedCaptcha='';
						this.promoForm.controls['couponCaptcha'].enable();
						if(this.recaptchaRef!=undefined){
							this.recaptchaRef.reset();
						}	
					}
				}else{
					if(this.couponErrorCode==1){
						this.coupon_amount =result.value;
						this.coupon_name =couponArray.coupon_name;
						this.coupon_code =couponArray.coupon_code;
						this.couponError='';
						this.couponApplied=true;
						couponArray["coupon_id"] = this.coupon_name;
						couponArray["coupon_name"] = this.coupon_name;
						couponArray["coupon_code"] = this.coupon_code;
						couponArray["coupon_amount"] = this.coupon_amount;
					
						couponUpdatedArray={type: 0, couponOptions:couponArray}; 
						this.sendCouponEvent.emit(couponUpdatedArray);
                                                $('#promo-'+this.coupon_code).attr('checked', true);
                                                $('#promo_code').val(this.coupon_code);
						//$('.couponcode-list-'+this.coupon_code).addClass('active');
						//$('.couponcode-message-'+this.coupon_code).removeClass('hideHeader');
						//$('.couponcode-remove-'+this.coupon_code).removeClass('hideHeader');
						
						//DISABLE CAPTCHA ON SUCCESS 
						this.SHOWCAPTCHA=false;
						this.verifiedCaptcha='';
						if(this.recaptchaRef!=undefined){
							this.recaptchaRef.reset();
						}	
						this.promoForm.controls['couponCaptcha'].disable();
					}else{	
						this.coupon_name ='';
						this.coupon_code =this.coupon_code;
						this.coupon_amount =0; 
						this.couponApplied=false;
						this.couponError=result.errorDesc;
						this.autoApplyError=1;
						couponUpdatedArray = {type: 1, couponOptions: this.couponOptions}; 
						this.sendCouponEvent.emit(couponUpdatedArray);	
						//SHOW CAPTCHA AFTER FAIL RESPONSE	
						if(this.twoStep){
							this.SHOWCAPTCHA=true;
							this.verifiedCaptcha='';
							this.promoForm.controls['couponCaptcha'].enable();
							if(this.recaptchaRef!=undefined){
								this.recaptchaRef.reset();
							}	
						}	
					}
				}
			}
		});
	}
	manualApplyCoupon(){
	
		this.selectedIndex = -1;
	
		this.submittedpromoCode=true;
		this.couponError='';
		if (this.promoForm.invalid) {
			return;
		}else{
			var couponCode=this.promoForm.controls['promoCode'].value; //taking coupon code from input field
			this.coupon_code =couponCode;
			var res = couponCode.substring(0, 2);
			var couponUpdatedArray ;var couponArray = {};
			//Check SB Vouchers
			if(AppConfig.voucherCoupons.indexOf(res) != -1)
			{
				var vcouponParam = {
					'client_token': 'HDFC243',
					'service_name':this.serviceToken,'partner_name':this.partnerToken,
					'order_amount':Math.round(this.payActualFare),
					'coupon_code':couponCode,
					'bookingRefNumber':sessionStorage.getItem(this.passSessionKey+'-clientTransactionId'),
					'orderReferenceNumber': this.orderReferenceNumber,
					'coupon_status':0,
					'g-recaptcha-response':this.verifiedCaptcha,
					'customer_id':this.customerInfo['id']
				};
				var vcouponApplyParam = {
					postData:this.EncrDecr.set(JSON.stringify(vcouponParam))
				};
				this.rest.validateSBCoupon(vcouponApplyParam).subscribe(results => { 		
					if(results.result ){
						let result=JSON.parse(this.EncrDecr.get(results.result ));
						this.submittedpromoCode=false; //FORM VALIDATION IS RESET AFTER GETTING RESPONSE

						//SETTING local variable "twoStep" as true
						if(result.twoStep==true){
							this.twoStep=true;
						}
						if(result.status=="success"){
							this.coupon_amount =result.value; 
							this.coupon_name ='SB-Vouchers';
							this.coupon_code =couponCode;
							this.couponError='';
							this.couponApplied=true;
							couponArray["coupon_id"] = this.coupon_name;
							couponArray["coupon_name"] = this.coupon_name;
							couponArray["coupon_code"] = this.coupon_code;
							couponArray["coupon_amount"] = this.coupon_amount;
							couponUpdatedArray={type: 0, couponOptions:couponArray}; 
							this.sendCouponEvent.emit(couponUpdatedArray);
							//DISABLE CAPTCHA ON SUCCESS 
							this.SHOWCAPTCHA=false;
							this.verifiedCaptcha='';
							if(this.recaptchaRef!=undefined){
								this.recaptchaRef.reset();
							}	
							this.promoForm.controls['couponCaptcha'].disable();
						}else{
							this.coupon_name ='';
							this.coupon_code = this.coupon_code;
							this.coupon_amount =0; 
							this.couponApplied=false;
							this.couponError=result.error;
							couponUpdatedArray = {type: 1, couponOptions: this.couponOptions}; 
							this.sendCouponEvent.emit(couponUpdatedArray);
							//SHOW CAPTCHA AFTER FAIL RESPONSE	
							if(this.twoStep){
								this.SHOWCAPTCHA=true;
								this.verifiedCaptcha='';
								this.promoForm.controls['couponCaptcha'].enable();
								if(this.recaptchaRef!=undefined){
									this.recaptchaRef.reset();
								}	
							}
						}

			
						
							
					}
				});
			}else{
				//CHECK COUPON FROM RADIO-BUTTON COUPON LIST
				var filterCoupon= this.couponOptions.filter(a => { return a.coupon_code== couponCode.toUpperCase();});
				if(filterCoupon.length > 0){
					this.validateCoupon(filterCoupon[0]);
				}else{
					//INVALID COUPON
					const urlParams = {
						'client_token': 'HDFC243',
						'service_name':this.serviceToken,'partner_name':this.partnerToken,
						'order_amount': this.payActualFare,
						'orderReferenceNumber': this.orderReferenceNumber,	
						'coupon_code':couponCode.toUpperCase(),
						'coupon_status':'',
						'g-recaptcha-response':this.verifiedCaptcha,
						'customer_id':this.customerInfo['id']
					};
					var couponApplyParam = {
						postData:this.EncrDecr.set(JSON.stringify(urlParams))
					};
					var couponUpdatedArray ;
					this.rest.validateCoupon(couponApplyParam).subscribe(results => {
						if(results.result ){
							let result=JSON.parse(this.EncrDecr.get(results.result));
							this.submittedpromoCode=false; //FORM VALIDATION IS RESET AFTER GETTING RESPONSE
							this.couponErrorCode = result.errorcode;
							//SETTING local variable "twoStep" as true
							if(result.twoStep==true){
								this.twoStep=true;
							}
							if(result.hasOwnProperty('status') && result.status=="fail"){
								this.coupon_name ='';
								this.coupon_code =this.coupon_code;
								this.coupon_amount =0; 
								this.couponApplied=false;
								this.couponError=result.error;
								this.autoApplyError=1;
								couponUpdatedArray = {type: 1, couponOptions: this.couponOptions}; 
								this.sendCouponEvent.emit(couponUpdatedArray);	
								//SHOW CAPTCHA AFTER FAIL RESPONSE	
								if(this.twoStep){
									this.SHOWCAPTCHA=true;
									this.verifiedCaptcha='';
									this.promoForm.controls['couponCaptcha'].enable();
									if(this.recaptchaRef!=undefined){
										this.recaptchaRef.reset();
									}	
								}	
							}else{
								if(this.couponErrorCode==1){
									this.coupon_amount =result.value;
									this.coupon_name =result.values[0].coupon_name;
									this.coupon_code =result.values[0].coupon_code;
									this.couponError='';
									this.couponApplied=true;
						
									couponArray["coupon_id"] = this.coupon_name;
									couponArray["coupon_name"] = this.coupon_name;
									couponArray["coupon_code"] = this.coupon_code;
									couponArray["coupon_amount"] = this.coupon_amount;
								
									couponUpdatedArray={type: 0, couponOptions:couponArray}; 
									this.sendCouponEvent.emit(couponUpdatedArray);
			
													
									//DISABLE CAPTCHA ON SUCCESS 
									this.SHOWCAPTCHA=false;
									this.verifiedCaptcha='';
									if(this.recaptchaRef!=undefined){
										this.recaptchaRef.reset();
									}	
									this.promoForm.controls['couponCaptcha'].disable();
								}else{
									this.coupon_name ='';
									this.coupon_code =this.coupon_code;
									this.coupon_amount =0; 
									this.couponApplied=false;
									this.couponError='Please enter valid coupon.';
									this.autoApplyError=1;
									couponUpdatedArray = {type: 1, couponOptions: this.couponOptions}; 
									this.sendCouponEvent.emit(couponUpdatedArray);	
									//SHOW CAPTCHA AFTER FAIL RESPONSE	
									if(this.twoStep){
										this.SHOWCAPTCHA=true;
										this.verifiedCaptcha='';
										this.promoForm.controls['couponCaptcha'].enable();
										if(this.recaptchaRef!=undefined){
											this.recaptchaRef.reset();
										}	
									}	
								}
							}
						}
					});
					
				}
			}
		}
	}
	/**----------REMOVE COUPON----------**/
	removeCoupon(rtype)
	{
	
		this.showVerificationDetails = false;
		this.selectedIndex = -1;

                if(rtype==1)
		$('input[name="promo"]').prop("checked",false);

		var couponCode=this.promoForm.controls['promoCode'].value
		//var res = couponCode.substring(0, 2);
		var vcouponParam = {'client_token': 'HDFC243',
		'coupon_code':couponCode,
		'bookingRefNumber':sessionStorage.getItem(this.passSessionKey+'-clientTransactionId'),
		'orderReferenceNumber':this.orderReferenceNumber,
		};
		var vcouponApplyParam = {
		postData:this.EncrDecr.set(JSON.stringify(vcouponParam))
		};
		this.rest.removeSBCoupon(vcouponApplyParam).subscribe();
			
		var couponUpdatedArray ;
		this.coupon_name ='';
		this.coupon_code ='';
		this.coupon_amount =0; 
		this.couponApplied=false;
		this.couponError='';
		couponUpdatedArray = {type: 1, couponOptions: this.couponOptions}; 
		this.sendCouponEvent.emit(couponUpdatedArray);
		
		
		//CAPTCHA ADD-REMOVE-RESET
		if(this.twoStep==true){
			this.SHOWCAPTCHA=true;
			this.verifiedCaptcha='';
			this.promoForm.controls['couponCaptcha'].enable();
			if(this.recaptchaRef!=undefined){
				//this.promoForm.reset();
				this.recaptchaRef.reset();
			}
		}else{	
			if(this.recaptchaRef!=undefined){
				this.recaptchaRef.reset();
			}	
			this.promoForm.controls['couponCaptcha'].disable();
			this.SHOWCAPTCHA=false;
		}
	
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

convertToUpperCase($event) {
	$event.target.value = $event.target.value.toUpperCase();
}



}


