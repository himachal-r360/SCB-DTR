// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: true,
  COOKIE_DOMAIN:null,
  LOCALJSON:'false',
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
   enableEncryptionRequestResponse:false,

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
