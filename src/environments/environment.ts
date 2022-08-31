// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  LOCALLOGIN: 'true',
  COOKIE_DOMAIN: null,
  LOCALJSON: 'truea', 
  localInstance: 1,
  //  url:"https://smartbuyadminuat.reward360.in/",
  //url:"http://new.reward360.us/",
  url: "http://new.reward360.us/",
  cdnUrl: 'assets/',
  cdnnotifyUrl: 'https://d2hx8jjky1f7ly.cloudfront.net/unfied-v.0.2/notification/',
  cdnDealUrl: 'https://d157777v0iph40.cloudfront.net/smartbuy3.0/images/offers/',
  API_URL: {
    'SMARTBUY': 'http://new.reward360.us/api/',
    //'SMARTBUY': 'http://new.reward360.us/api/',
    'DINERS': 'http://new.reward360.us/diners/api/',
    'INFINIA': 'http://new.reward360.us/infinia/api/',
    'REGALIA': 'http://new.reward360.us/regalia/api/',
      'REGALIA_GOLD': 'http://new.reward360.us/regalia_gold/api/',
    'CORPORATE': 'http://new.reward360.us/corporate/api/',
    'BUSINESS': 'http://new.reward360.us/business/api/',
  },
  MAIN_SITE_URL: 'http://new.reward360.us/',
  SUB_SITE_URL: 'http://new.reward360.us/',
  ANGULAR_SITE_URL: 'http://new.reward360.us/lite/',
  enableEncryptionRequestResponse: false,
  'IS_MAIN': 0,
  recaptcha: {
    siteKey: '6Lf7UL0cAAAAAIt_m-d24WG4mA1XFPHE8yVckc5S',
  },

  API_URL_IRCTC:{
 'SMARTBUY': 'http://new.reward360.us/api/',
 'DINERS': 'http://new.reward360.us/diners/api/',
 'INFINIA'  : 'http://new.reward360.us/infinia/api/',
 'REGALIA': 'http://new.reward360.us/regalia/api/',
 'INFINIA_RESERVE'  : 'http://new.reward360.us/infinia_reserve/api/',
 'REGALIA_GOLD': 'http://new.reward360.us/regalia_gold/api/',
 'CORPORATE': 'http://new.reward360.us/corporate/api/',
 'BUSINESS': 'http://new.reward360.us/business/api/',
  },

  BUS_SITE_URL: {
    'SMARTBUY': 'http://new.reward360.us/lite/',
    'DINERS': 'http://new.reward360.us/lite/diners/',
    'INFINIA': 'http://new.reward360.us/lite/infinia/',
    'REGALIA': 'http://new.reward360.us/lite/regalia/',
     'REGALIA_GOLD': 'http://new.reward360.us/lite/regalia_gold/',
    'CORPORATE': 'http://new.reward360.us/lite/corporate/',
    'BUSINESS': 'http://new.reward360.us/lite/business/',
  },
  TRAIN_SITE_URL: {
    'SMARTBUY': 'http://new.reward360.us/lite/train/',
    'DINERS': 'http://new.reward360.us/lite/diners/train/',
    'INFINIA': 'http://new.reward360.us/lite/infinia/train/',
    'REGALIA': 'http://new.reward360.us/lite/regalia/train/',
     'REGALIA_GOLD': 'http://new.reward360.us/lite/regalia_gold/train/',
    'CORPORATE': 'http://new.reward360.us/lite/corporate/train/',
    'BUSINESS': 'http://new.reward360.us/lite/business/train/',
  },

  FRESHMENU_SITE_URL: {
    'SMARTBUY': 'http://new.reward360.us/lite/freshmenu/',
    'DINERS': 'http://new.reward360.us/lite/diners/freshmenu/',
    'INFINIA': 'http://new.reward360.us/lite/infinia/freshmenu/',
    'REGALIA': 'http://new.reward360.us/lite/regalia/freshmenu/',
    'CORPORATE': 'http://new.reward360.us/lite/corporate/freshmenu/',
    'BUSINESS': 'http://new.reward360.us/lite/business/freshmenu/',
  },

  GOLF_SITE_URL: {
    'SMARTBUY': 'http://new.reward360.us/lite/',
    'DINERS': 'http://new.reward360.us/lite/diners/',
    'INFINIA': 'http://new.reward360.us/lite/infinia/',
    // 'REGALIA': 'http://new.reward360.us/regalia/lite/',
    // 'CORPORATE': 'http://new.reward360.us/corporate/lite/',
    // 'BUSINESS': 'http://new.reward360.us/business/lite/',
  },



  GOLF_API_URL: {
    'SMARTBUY': 'http://new.reward360.us/api/golflan/',
    'DINERS': 'http://new.reward360.us/api/golflan/',
    'INFINIA': 'http://new.reward360.us/api/golflan/',
    'REGALIA': 'http://new.reward360.us/api/golflan/',
    'CORPORATE': 'http://new.reward360.us/api/golflan/',
    'BUSINESS': 'http://new.reward360.us/api/golflan/',
  },
  NATGEO_SITE_URL: {
    'DINERS': 'http://new.reward360.us/lite/diners/',
    'INFINIA': 'http://new.reward360.us/lite/infinia/',
  },
  NATGEO_API_URL: {
    'DINERS': 'http://new.reward360.us/diners/api/natgeo/',
    'INFINIA': 'http://new.reward360.us/infinia/api/natgeo/',
  },

  RD_SITE_URL: {
    'SMARTBUY': '//smartbuyuat.reward360.us/ecommerce/rdstore/',
    'DINERS': '//smartbuyuat.reward360.us/diners/ecommerce/rdstore/',
    'INFINIA': '//smartbuyuat.reward360.us/infinia/rdstore/',
    'REGALIA': '//smartbuyuat.reward360.us/regalia/ecommerce/rdstore/',
    'CORPORATE': '//smartbuyuat.reward360.us/corporate/ecommerce/rdstore/',
    'BUSINESS': '//smartbuyuat.reward360.us/business/ecommerce/rdstore/',
  },

  SHOPTIMIZE_SITE_URL: {
    'SMARTBUY': '//smartbuyuat.reward360.us/ecommerce/shoptimize/',
    'DINERS': '//smartbuyuat.reward360.us/diners/ecommerce/shoptimize/',
    'INFINIA': '//smartbuyuat.reward360.us/infinia/ecommerce/shoptimize/',
    'REGALIA': '//smartbuyuat.reward360.us/regalia/ecommerce/shoptimize/',
    'CORPORATE': '//smartbuyuat.reward360.us/corporate/ecommerce/shoptimize/',
    'BUSINESS': '//smartbuyuat.reward360.us/business/ecommerce/shoptimize/',
  },
  DREAMFOLKS_SITE_URL: {
    'SMARTBUY': 'http://new.reward360.us/lite/',
    'DINERS': 'http://new.reward360.us/lite/diners/',
    'INFINIA': 'http://new.reward360.us/lite/infinia/',
    'REGALIA': 'http://new.reward360.us/lite/regalia/',
  },
  "ENTRY_POINT": {
    "SMARTBUY": "bus",
    "DINERS": "diners/checknatgeo",
    "INFINIA": "infinia/checknatgeo",
    "REGALIA": "regalia/bus",
    "CORPORATE": "corporate/bus",
    "BUSINESS": "business/bus"
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
