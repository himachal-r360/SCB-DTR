import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { map, catchError, tap ,shareReplay} from 'rxjs/operators';
import { AppConfig } from '../../configs/app.config';
import { environment } from '../../../environments/environment';
import { Location } from '@angular/common';

const CACHE_SIZE = 1;
const endpoint = environment.API_URL;
const MAIN_SITE_URL = environment.MAIN_SITE_URL;
const hammock = AppConfig.HAMMOCK;
const LOCALJSON = environment.LOCALJSON;

declare var jQuery: any;
declare var $: any;
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};

const config = {
    headers : {
        'Content-Type': 'application/json'
    }
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
 domainName;
 domainNameUrl;
endpoint;
apiendpoint;
empty=[];
private updatedcart = new BehaviorSubject(this.empty);
  cartDetails = this.updatedcart.asObservable();

private cartItemsObserver: any;
    // cartItems$: Observable<any>;
    public cartName = 'freshmenu';
    public clearCart = false;
    public items = [];

    sku: string;
    productname: string;
    unitprice: any;
    saleprice: any;
    showsale: Boolean;
    quantity: any;
    sh: any;
    faux: Boolean;

    serviceName: any;
    merchantID: any;
    options: any;
  private cache$: Observable<Array<any>>;
  constructor(private http: HttpClient,private location:Location) {
    let urlToSplit =this.location.path();
    let unification =urlToSplit.split("/");
  
    switch (unification[1]) {
    case ('diners'):
          this.domainName='DINERS';this.domainNameUrl='diners/';
    break;
    case ('infinia'):
          this.domainName='INFINIA';this.domainNameUrl='infinia/';
    break;
    case ('regalia'):
          this.domainName='REGALIA';this.domainNameUrl='regalia/';
    break;
    case ('corporate'):
          this.domainName='CORPORATE';this.domainNameUrl='corporate/';
    break;
    case ('business'):
          this.domainName='BUSINESS';this.domainNameUrl='business/';
    break;
    default:
          this.domainName='SMARTBUY';this.domainNameUrl='';
    break; }
    //this.endpoint = environment.MAIN_SITE_URL;
    this.endpoint = environment.MAIN_SITE_URL+this.domainNameUrl;
    this.apiendpoint = environment.API_URL[this.domainName];
   }


   addcart(param){
        if(LOCALJSON=='true'){
          return this.http.get('assets/data/cartupdate.json').pipe(map((response:any) => response));
        }
        else{
            //return this.http.get('assets/data/cartupdate.json').pipe(map((response:any) => response));
          return this.http.post(this.endpoint+'addcart', param, config).pipe(map((response:any) => response));
        }
      }

   updatecart(param){
    if(LOCALJSON=='true'){
       // return this.http.post(this.endpoint+'updatecart', param, config).pipe(map((response:any) => response));
      return this.http.get('assets/data/cartupdate.json').pipe(map((response:any) => response));
    }
    else{
       // return this.http.get('assets/data/cartupdate.json').pipe(map((response:any) => response));
        return this.http.post(this.endpoint+'updatecart', param, config).pipe(map((response:any) => response));
    }
   }

      getcartdetails(){
          var param = {partnerToken:'freshmenu'}
        if(LOCALJSON=='true'){
          return this.http.get('assets/data/cartupdate.json').pipe(map((response:any) => response));
        }
        else{
            return this.http.post(this.endpoint+'getcart', param, config).pipe(map((response:any) => response));
        }
      }
      emptycart(ptoken){
        var param = {partnerToken:ptoken}
        if(LOCALJSON=='true'){
        // return this.http.post(this.endpoint+'emptycart', param, config).pipe(map((response:any) => response));
            return this.http.get('assets/data/emptycart.json').pipe(map((response:any) => response));
        }
        else{
            return this.http.post(this.endpoint+'emptycart', param, config).pipe(map((response:any) => response));
        }
    }
        

      getCustomerAddress(param){
        if(LOCALJSON=='true'){
            return this.http.get('assets/data/getaddress.json').pipe(map((response:any) => response));
        }else{
           return this.http.post(this.apiendpoint+'getaddress', param, config).pipe(map((response:any) => response));
           // return this.http.get('assets/data/getaddress.json').pipe(map((response:any) => response));
        }
      }
      deleteCustomerAddress(param){
        if(LOCALJSON=='true'){
            return this.http.get('assets/data/deleteCustomerAddress.json').pipe(map((response:any) => response));
        }else{
           return this.http.post(this.apiendpoint+'deleteCustomerAddress', param, config).pipe(map((response:any) => response));
        }
      }
      createCustomerAddress(param){
            if(LOCALJSON=='true'){
                return this.http.get('assets/data/createCustomerAddress.json').pipe(map((response:any) => response));
            }else{
                return this.http.post(this.apiendpoint+'createCustomerAddress', param, config).pipe(map((response:any) => response));
            }
        }
        checkAddressAvailability(param){
            if(LOCALJSON=='true'){
                return this.http.get('assets/data/checkAddressAvailability.json').pipe(map((response:any) => response));
            }else{
                return this.http.post(this.apiendpoint+'checkAddress_avail', param, config).pipe(map((response:any) => response));
            }
        }

    // load items from local storage
    loadItems() {

        let items = localStorage != null ? localStorage[this.cartName + '_items'] : null;
        if (items != null && JSON != null) {
            try {
                items = JSON.parse(items);
                for (let i = 0; i < items.length; i++) {
                    let item = items[i];
                    if (item.sku != null && item.productname != null &&
                        item.unitprice != null && item.saleprice != null &&
                        item.showsale != null && item.quantity != null && item.sh != null &&
                        item.faux != null) {
                        item = new this.cartItem(item.sku, item.productname, item.unitprice,
                            item.saleprice, item.showsale, item.quantity, item.sh, item.faux);
                            
                        this.items.push(item);
                    }
                }
            } catch (err) {
                // ignore errors while loading...
            }
        }
        return items;
    }

    // save items to local storage
    saveItems() {
        if (localStorage != null && JSON != null) {
            localStorage[this.cartName + '_items'] = JSON.stringify(this.items);
        }
    }

    // adds an item to the cart
    addItem(sku, productname, unitprice,
        saleprice, showsale, quantity, sh, faux) {
        const _return = true;
        if (!faux) {
            let found = false;
            for (let i = 0; i < this.items.length && !found; i++) {
                const item = this.items[i];
                if (item.sku === sku) {
                    found = true;
                    item.quantity = this.toNumber(item.quantity + quantity);
                    if (item.quantity <= 0) {
                        this.items.splice(i, 1);
                    }
                }
            }
            // if item wasn't already in cart, add it now
            if (!found) {
                const item = new this.cartItem(sku, productname, unitprice, saleprice, showsale, quantity, sh, faux);
                this.items.push(item);
            }
            // save changes
            this.saveItems();
        } else {
            alert('This product is shown for demonstration purposes only!');
        }
        return _return;
    }

    // adds an item to the cart from non-angular page using url parameters
    addItemUrl(sku, productname, unitprice, saleprice,
        showsale, quantity, sh, faux) {
        this.addItem(sku, productname, unitprice, saleprice,
        showsale, quantity, sh, faux);
    }

    // get the total price for all items currently in the cart
    getTotalPrice(sku) {
        let total: any;
        total = 0;
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if (sku === null || item.sku === sku) {
                if (item.showsale) {
                    total += this.toNumber(item.quantity * item.saleprice);
                } else {
                    total += this.toNumber(item.quantity * item.unitprice);
                }
            }
        }
        return total;
    }

    // get the total shipping & handling for all items currently in the cart
    // You can customize this any way you want.
    // Here I decided to charge whatever the max sh is for the items in the cart
    getTotalSH(sku) {
        const myArray = [];
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            // alert(this.toNumber(item.sh));
            if (sku === null || item.sku === sku) {
                // alert(this.toNumber(item.sh));
                myArray.push(this.toNumber(item.sh));
            }
        }
        if (myArray.length < 1) {
            return undefined;
        } else {
            return Math.max.apply(Math, myArray);
        }
    }

    // get the total price for all items currently in the cart
    getTotalCount(sku) {
        let count: any;
        count = 0;
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if (sku === null || item.sku === sku) {
                count += this.toNumber(item.quantity);
            }
        }
        return count;
    }

    // clear the cart
    clearItems() {
        this.items = [];
        this.saveItems();
    }

    createGuid4(): string {
        return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
        function(c: string) {
            const r = Math.floor(Math.random() * 16),
                v = c === 'x' ? r : (r % 4 + 4);
            return v.toString(16);
        }).toUpperCase();
    }

  
    addFormFields(form, data) {
        if (data != null) {
            $.each(data, function (name, value) {
                if (value != null) {
                    const input = $('<input></input>').attr('type', 'hidden').attr('name', name).val(value);
                    form.append(input);
                }
            });
        }
    }
    toNumber(value) {
        const num: any = this.stripNonNumeric(value);
        value = num * 1;
        return isNaN(value) ? 0 : value;
    }

    stripNonNumeric(str) {
        str += '';
        const rgx = /^d|.|-$/;
        let out = '';
        for (let i = 0; i < str.length; i++) {
            if (rgx.test(str.charAt(i))) {
                if (!((str.charAt(i) === '.' && out.indexOf('.') !== -1) ||
                    (str.charAt(i) === '-' && out.length !== 0))) {
                    out += str.charAt(i);
                }
            }
        }
        return out;
    }

// WS
    // ----------------------------------------------------------------
    // checkout parameters (one per supported payment service)
    //
    checkoutParameters(serviceName, merchantID, options) {
        this.serviceName = serviceName;
        this.merchantID = merchantID;
        this.options = options;
        return this;
    }

    // ----------------------------------------------------------------
    // items in the cart
    //
    cartItem(sku, productname, unitprice, saleprice, showsale, quantity, sh, faux) {
        this.sku = sku;
        this.productname = productname;
        this.unitprice = unitprice * 1;
        this.saleprice = saleprice * 1;
        this.showsale = showsale;
        this.quantity = quantity * 1;
        this.sh = sh * 1;
        this.faux = faux;
    }

    buyNow(obj: any) {
        window.open(obj.buynowlink);
    }

    getProductdetails(productdetails,partner){
        var product:any = [];
        switch (partner) {
            case ('freshmenu'):
                    var item = productdetails.itemdetails;
                    var price = productdetails.pricedetails;
                    var images = item.medias;
                    
                product = {
                    'id' :  item.id,
                    'name' : item.appTitle,
                    'price': price.sellingPrice,
                    'category' : item.categories[0].categoryType,
                    'slug' : item.skuId,
                    'short_desc' : item.details,
                    'image' : '',
                    'qty' : 1, 
                    'tax' :  0,
                    'cash_component' : 'mrp',
                    'points_percentage' : 1,
                    'is_vocha_gram' :  0,
                    'client_item_code' :  item.skuId,
                    'canadd' : item.actionType,
                    'partnerToken' : 'freshmenu',
                    'media' : images,
                    'isVegEggMeat': item.additionalProperties.isVegEggMeat,
                   
                } 
            
            break;
            
            default:
            break;
            }
            return product;

    }
    updatecartdetails(message:any) {
        this.updatedcart.next(message)
      }
}
