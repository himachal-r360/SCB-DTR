// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
  COOKIE_DOMAIN:null,
  LOCALJSON:'true',
  localInstance:1,
  // url:"https://smartbuyadminuat.reward360.in/"
  url:"https://smartbuydev.reward360.in/",
   cdnUrl: 'assets/',
  cdnDealUrl: 'https://d157777v0iph40.cloudfront.net/smartbuy3.0/images/offers/',
API_URL:{
 'SMARTBUY': 'https://smartbuydev.reward360.in/api/',
 'DINERS': 'https://smartbuydev.reward360.in/diners/api/',
 'INFINIA'  : 'https://smartbuydev.reward360.in/infinia/api/',
 'REGALIA': 'https://smartbuydev.reward360.in/regalia/api/',
 'CORPORATE': 'https://smartbuydev.reward360.in/corporate/api/',
 'BUSINESS': 'https://smartbuydev.reward360.in/business/api/',
  },
    MAIN_SITE_URL:'https://smartbuydev.reward360.in/',
 SUB_SITE_URL:'https://smartbuydev.reward360.in/',
    ANGULAR_SITE_URL:'https://smartbuydev.reward360.in/lite/',
   enableEncryptionRequestResponse:false,
  'IS_MAIN':0,
  
  
  
  BUS_SITE_URL:{
 'SMARTBUY': '//new.reward360.us/lite/',
 'DINERS': '//new.reward360.us/lite/diners/',
 'INFINIA'  : '//new.reward360.us/lite/infinia/',
 'REGALIA': '//new.reward360.us/lite/regalia/',
 'CORPORATE': '//new.reward360.us/lite/corporate/',
  'BUSINESS': '//new.reward360.us/lite/business/',
  },
  TRAIN_SITE_URL:{
 'SMARTBUY': '//new.reward360.us/lite/train/',
 'DINERS': '//new.reward360.us/lite/diners/train/',
 'INFINIA'  : '//new.reward360.us/lite/infinia/train/',
 'REGALIA': '//new.reward360.us/lite/regalia/train/',
 'CORPORATE': '//new.reward360.us/lite/corporate/train/',
  'BUSINESS': '//new.reward360.us/lite/business/train/',
  },
  
  FRESHMENU_SITE_URL  :{
 'SMARTBUY': '//new.reward360.us/lite/freshmenu/',
 'DINERS': '//new.reward360.us/lite/diners/freshmenu/',
 'INFINIA'  : '//new.reward360.us/lite/infinia/freshmenu/',
 'REGALIA': '//new.reward360.us/lite/regalia/freshmenu/',
 'CORPORATE': '//new.reward360.us/lite/corporate/freshmenu/',
  'BUSINESS': '//new.reward360.us/lite/business/freshmenu/',
  },
 
  GOLF_SITE_URL:{
    'SMARTBUY': '//new.reward360.us/lite/',
    'DINERS': '//new.reward360.us/lite/diners/',
    'INFINIA'  : '//new.reward360.us/lite/infinia/',
    // 'REGALIA': '//new.reward360.us/regalia/lite/',
    // 'CORPORATE': '//new.reward360.us/corporate/lite/',
    // 'BUSINESS': '//new.reward360.us/business/lite/',
  },



  GOLF_API_URL:{
  'SMARTBUY': '//new.reward360.us/api/golflan/',
   'DINERS': '//new.reward360.us/api/golflan/',
   'INFINIA'  : '//new.reward360.us/api/golflan/',
   'REGALIA': '//new.reward360.us/api/golflan/',
   'CORPORATE': '//new.reward360.us/api/golflan/',
   'BUSINESS': '//new.reward360.us/api/golflan/',
  },
  NATGEO_SITE_URL:{
    'DINERS': '//new.reward360.us/lite/diners/',
    'INFINIA'  : '//new.reward360.us/lite/infinia/',
  },
  NATGEO_API_URL:{
    'DINERS': '//new.reward360.us/diners/api/natgeo/',
    'INFINIA'  : '//new.reward360.us/infinia/api/natgeo/',
  },
  
    RD_SITE_URL:{
    'SMARTBUY': '//smartbuyuat.reward360.us/ecommerce/rdstore/',
    'DINERS': '//smartbuyuat.reward360.us/diners/ecommerce/rdstore/',
    'INFINIA'  : '//smartbuyuat.reward360.us/infinia/rdstore/',
    'REGALIA': '//smartbuyuat.reward360.us/regalia/ecommerce/rdstore/',
    'CORPORATE': '//smartbuyuat.reward360.us/corporate/ecommerce/rdstore/',
    'BUSINESS': '//smartbuyuat.reward360.us/business/ecommerce/rdstore/',
  },
  
  SHOPTIMIZE_SITE_URL:{
    'SMARTBUY': '//smartbuyuat.reward360.us/ecommerce/shoptimize/',
    'DINERS': '//smartbuyuat.reward360.us/diners/ecommerce/shoptimize/',
    'INFINIA'  : '//smartbuyuat.reward360.us/infinia/ecommerce/shoptimize/',
    'REGALIA': '//smartbuyuat.reward360.us/regalia/ecommerce/shoptimize/',
    'CORPORATE': '//smartbuyuat.reward360.us/corporate/ecommerce/shoptimize/',
    'BUSINESS': '//smartbuyuat.reward360.us/business/ecommerce/shoptimize/',
  },
  DREAMFOLKS_SITE_URL:{
    'SMARTBUY': '//new.reward360.us/lite/',
    'DINERS': '//new.reward360.us/lite/diners/',
    'INFINIA' : '//new.reward360.us/lite/infinia/',
    'REGALIA': '//new.reward360.us/lite/regalia/',
  } , 
  "ENTRY_POINT":{
    "SMARTBUY":"bus",
    "DINERS":"diners/checknatgeo",
    "INFINIA":"infinia/checknatgeo" ,
    "REGALIA":"regalia/bus",
    "CORPORATE":"corporate/bus",
    "BUSINESS":"business/bus"        
  }
  
  
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
