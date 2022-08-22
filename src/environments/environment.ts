// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  LOCALLOGIN: 'true',
  COOKIE_DOMAIN: null,
  LOCALJSON: 'false', 
  localInstance: 1,
  //  url:"https://smartbuyadminuat.reward360.in/",
  //url:"https://smartbuydev.reward360.in/",
  url: "https://smartbuydev.reward360.in/",
  cdnUrl: 'assets/',
  cdnnotifyUrl: 'https://d2hx8jjky1f7ly.cloudfront.net/unfied-v.0.2/notification/',
  cdnDealUrl: 'https://d157777v0iph40.cloudfront.net/smartbuy3.0/images/offers/',
  API_URL: {
    'SMARTBUY': 'https://smartbuydev.reward360.in/api/',
    //'SMARTBUY': 'https://smartbuydev.reward360.in/api/',
    'DINERS': 'https://smartbuydev.reward360.in/diners/api/',
    'INFINIA': 'https://smartbuydev.reward360.in/infinia/api/',
    'REGALIA': 'https://smartbuydev.reward360.in/regalia/api/',
      'REGALIA_GOLD': 'https://smartbuydev.reward360.in/regalia/api/',
    'CORPORATE': 'https://smartbuydev.reward360.in/corporate/api/',
    'BUSINESS': 'https://smartbuydev.reward360.in/business/api/',
  },
  MAIN_SITE_URL: 'https://smartbuydev.reward360.in/',
  SUB_SITE_URL: 'https://smartbuydev.reward360.in/',
  ANGULAR_SITE_URL: 'https://smartbuydev.reward360.in/lite/',
  enableEncryptionRequestResponse: false,
  'IS_MAIN': 0,
  recaptcha: {
    siteKey: '6Lf7UL0cAAAAAIt_m-d24WG4mA1XFPHE8yVckc5S',
  },

  API_URL_IRCTC:{
 'SMARTBUY': 'https://smartbuydev.reward360.in/api/',
 'DINERS': 'https://smartbuydev.reward360.in/diners/api/',
 'INFINIA'  : 'https://smartbuydev.reward360.in/infinia/api/',
 'REGALIA': 'https://smartbuydev.reward360.in/regalia/api/',
 'INFINIA_RESERVE'  : 'https://smartbuydev.reward360.in/infinia_reserve/api/',
 'REGALIA_GOLD': 'https://smartbuydev.reward360.in/regalia_gold/api/',
 'CORPORATE': 'https://smartbuydev.reward360.in/corporate/api/',
 'BUSINESS': 'https://smartbuydev.reward360.in/business/api/',
  },

  BUS_SITE_URL: {
    'SMARTBUY': 'https://smartbuydev.reward360.in/lite/',
    'DINERS': 'https://smartbuydev.reward360.in/lite/diners/',
    'INFINIA': 'https://smartbuydev.reward360.in/lite/infinia/',
    'REGALIA': 'https://smartbuydev.reward360.in/lite/regalia/',
     'REGALIA_GOLD': 'https://smartbuydev.reward360.in/lite/regalia_gold/',
    'CORPORATE': 'https://smartbuydev.reward360.in/lite/corporate/',
    'BUSINESS': 'https://smartbuydev.reward360.in/lite/business/',
  },
  TRAIN_SITE_URL: {
    'SMARTBUY': 'https://smartbuydev.reward360.in/lite/train/',
    'DINERS': 'https://smartbuydev.reward360.in/lite/diners/train/',
    'INFINIA': 'https://smartbuydev.reward360.in/lite/infinia/train/',
    'REGALIA': 'https://smartbuydev.reward360.in/lite/regalia/train/',
     'REGALIA_GOLD': 'https://smartbuydev.reward360.in/lite/regalia_gold/train/',
    'CORPORATE': 'https://smartbuydev.reward360.in/lite/corporate/train/',
    'BUSINESS': 'https://smartbuydev.reward360.in/lite/business/train/',
  },

  FRESHMENU_SITE_URL: {
    'SMARTBUY': 'https://smartbuydev.reward360.in/lite/freshmenu/',
    'DINERS': 'https://smartbuydev.reward360.in/lite/diners/freshmenu/',
    'INFINIA': 'https://smartbuydev.reward360.in/lite/infinia/freshmenu/',
    'REGALIA': 'https://smartbuydev.reward360.in/lite/regalia/freshmenu/',
    'CORPORATE': 'https://smartbuydev.reward360.in/lite/corporate/freshmenu/',
    'BUSINESS': 'https://smartbuydev.reward360.in/lite/business/freshmenu/',
  },

  GOLF_SITE_URL: {
    'SMARTBUY': 'https://smartbuydev.reward360.in/lite/',
    'DINERS': 'https://smartbuydev.reward360.in/lite/diners/',
    'INFINIA': 'https://smartbuydev.reward360.in/lite/infinia/',
    // 'REGALIA': 'https://smartbuydev.reward360.in/regalia/lite/',
    // 'CORPORATE': 'https://smartbuydev.reward360.in/corporate/lite/',
    // 'BUSINESS': 'https://smartbuydev.reward360.in/business/lite/',
  },



  GOLF_API_URL: {
    'SMARTBUY': 'https://smartbuydev.reward360.in/api/golflan/',
    'DINERS': 'https://smartbuydev.reward360.in/api/golflan/',
    'INFINIA': 'https://smartbuydev.reward360.in/api/golflan/',
    'REGALIA': 'https://smartbuydev.reward360.in/api/golflan/',
    'CORPORATE': 'https://smartbuydev.reward360.in/api/golflan/',
    'BUSINESS': 'https://smartbuydev.reward360.in/api/golflan/',
  },
  NATGEO_SITE_URL: {
    'DINERS': 'https://smartbuydev.reward360.in/lite/diners/',
    'INFINIA': 'https://smartbuydev.reward360.in/lite/infinia/',
  },
  NATGEO_API_URL: {
    'DINERS': 'https://smartbuydev.reward360.in/diners/api/natgeo/',
    'INFINIA': 'https://smartbuydev.reward360.in/infinia/api/natgeo/',
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
    'SMARTBUY': 'https://smartbuydev.reward360.in/lite/',
    'DINERS': 'https://smartbuydev.reward360.in/lite/diners/',
    'INFINIA': 'https://smartbuydev.reward360.in/lite/infinia/',
    'REGALIA': 'https://smartbuydev.reward360.in/lite/regalia/',
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
