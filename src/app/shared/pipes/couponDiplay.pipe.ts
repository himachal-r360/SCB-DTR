import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'couponDiplay'})
export class couponDiplayPipe implements PipeTransform {
  
  transform(amount: number,coupons: any[],partnerName:string): any {
   if(coupons[partnerName]){
     var discount_amount=0; var totalamount=0;
     var min_price=coupons[partnerName]['min_price'];
     //Percentage
     if(coupons[partnerName]['offer_type']==1){
 
       var percentage=coupons[partnerName]['percentage'];
       var max_fee=coupons[partnerName]['max_fee'];
        if (amount > min_price) {
        var totpercent = Math.round(amount * (percentage / 100));
        if (totpercent < max_fee) {
        discount_amount = totpercent;
        } else if (totpercent >= max_fee) {
        discount_amount = max_fee;
        }
        totalamount = Math.round(amount) - Math.round(discount_amount);
        } else {
        totalamount = Math.round(amount);
        discount_amount = 0;
        }
     
      return  'Use '+coupons[partnerName]['coupon_code']+' and get '+discount_amount+' discount';
     }else{
        discount_amount=coupons[partnerName]['discount_amount'];
        if (amount > min_price) {
        totalamount = Math.round(amount) - Math.round(discount_amount);
        } else {
        totalamount = Math.round(amount);
        discount_amount = 0;
        }
      return  'Use '+coupons[partnerName]['coupon_code']+' and get FLAT ₹ '+discount_amount+' discount';
     }
   
   }else{
   return '';
   }
  

  }
}


