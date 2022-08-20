import {InjectionToken} from '@angular/core';
export let APP_CONFIG = new InjectionToken('app.config');
export const AppConfig: any = {
  routes: {
    error404: '404'
  },
  snackBarDuration: 3000, 

repositoryURL: '',
sentryDSN: '',
HAMMOCK:'false',
enable_dcemi2:true,

IRCTC_Classes:{ 
 '1A': 'First AC',
 'EC': 'AC Executive Class',
 '2A': 'AC 2 Tier',
 'FC': 'First Class',
 '3A': 'AC 3 Tier',
 '3E': 'Third AC Economy',
 'CC': 'AC Chair Car',
 'SL': 'Sleeper',
 '2S': 'Second Seating'    
 },
 IRCTC_Traintypes:{
 'SV': 'Suvidha Trains',
 'ST': 'Special Tatkal Trains',
 'SP': 'Special Trains',
 'G': 'GARIB RATH',
 'Y': 'YUVA EXPRESS',
 'O': 'OTHERS',
 'D': 'DURONTO',
 'R': 'RAJDHANI',
 'JS': 'JAN SHATABDI',
 'S': 'SHATABDI'
 },
IRCTC_Quota:{
 'GN': 'General',
 'TQ': 'Tatkal Quota',
 'PT': 'Premium Tatkal Quota',
 'LD': 'Ladies Quota',
 'SS': 'Lower Berth Quota',
 'HP': 'Physically Handicapped Quota',
 'HO': 'Headquarters/High official Quota',
 'PH': 'Parliament House Quota',
 'DF': 'Defence Quota',
 'FT': 'Foreign Tourist Quota',
 'DP': 'Duty Pass Quota',
 'YU': 'Yuva Quota'
 },
 
IRCTC_List_Quota:{
 'GN': 'GENERAL',
 'LD': 'LADIES',
 'SS': 'LOWER BERTH/SR.CITIZEN',
 'TQ': 'TATKAL'
 },
  
 // 'PT': 'PREMIUM TATKAL'
 IRCTC_Berth:{
  'LB': 'Lower Berth',
  'MB': 'Middle Berth',
  'UB': 'Upper Berth',
  'SL': 'Side Lower Berth',
  'SU': 'Side Upper Berth',
  'SM': 'Side Middle',
  'WS': 'Window Side',
  'CB': 'Cabin',
  'CP': 'Coupe'
  },
  IRCTC_Food:{
    'V': 'VEG',
    'N': 'NON_VEG',
    'D': 'NO_FOOD'
  },
 emiInterst:{
 '3':'16',
 '6':'16',
 '9':'16',
 '12':'16'
 },
  emiDebitInterst:{
  '3':'16',
 '6':'16',
 '9':'16',
 '12':'16',
 '18':'16'
 },
 blocktimings:{
   'generaltktblockingstart':'0800',
   'generaltktblockingend':'0815',
   'morningACblockingStart':'1000',
   'morningACblockingEnd':'1015',
   'morningSleeperBlockStart':'1100',
  'morningSleeperBlockEnd':'1115',
  'agentBookingblockstart':'2345', 
  'agentBookingblockend':'0015',
  'tatkalBookingtimeStart':'',
  'tatkalBookingtimeEnd':'',
  'userUpdateBlockstart':'1645',
  'userUpdateBlockend':'1745' 
 },
 couponcontroll:{
  'RedBus':1, 
  'IRCTC':1,
  'Freshmenu':1
 },
 flexipayInt:{
   '15':'28',
   '30':'28',
   '60':'28',
   '90':'28'
 },
 flexiMinMax:{
'minimumAmount':1000,
'maximumAmount':20000
 },
 concierge:{
  'conciergeNumber':'1860 425 1188',
  'conciergeNumber_footer':'1860 425 1188 / 9986286688',
  'programEmail':'support@smartbuyoffers.co'
},
voucherCoupons:['U1','U2','U3','XM','UO'],
 dcEMICashback: '5',
'disableonemi':1, 
'checkstr':'EMI',
'saveCard':1,

successusers : ["1#1#1#1", "1#8#1#1"],

canFileTDRarr:["Chart Not Prepared"],

FM_BULKORDER_PHONENO:"+91-9513942429",
FM_BULKORDER_EMAIL:"order@freshmenu.in",
FM_BULKORDER_QTYLIMIT:"15",

FM_BULKORDER_NOTE:"Please note that in case of bulk orders, there will be no 10X reward points or 5% cash back or any other SmartBuy offer applicable.",

TOP_AIRPORTS : {
  'DOMESTIC': ['DEL','HYD','BOM','CCU','BLR','MAA','COK','AMD'],
  'INTERNATIONAL': ['DXB','LHR','HKG','AMS','JFK','CDG','FRA','ICN'],
},
DREAMFOLKS_COUNT : {
   'LOUNGES': 1000,
   'COUNTRIES' : 130
},

EMI_FROM_API:0

};


