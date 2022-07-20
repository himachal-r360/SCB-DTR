import { Injectable } from '@angular/core';
import * as moment from 'moment'; 
import {AppConfig} from '../../configs/app.config';
import { RestapiService} from 'src/app/shared/services/restapi.service';
@Injectable()
export class CommonHelper {
intrest:any;
    flexiconfig:any;
    configEmi:any;
    configDCEmi:any;
    constructor(public restApi:RestapiService   ) { 

   }
    


emiLogic(amount: number)
    {

    var emiArray = [];let  configEmi;
     if (Number(amount) >= 3000) {
      if(AppConfig.EMI_FROM_API==0){
        configEmi=AppConfig.emiInterst;
       	for (let key in configEmi) {
	let value = ((configEmi[key] / 12) / 100).toFixed(4);
 	let factor = Math.pow(1 + Number(value), Number(key)) - 1;
 	
	let emi = Number(amount) * Number(value) * Math.pow((1 + Number(value)),Number(key)) / factor;
	  emiArray.push({key:key,value: Math.round(emi)});
	}
      }else{
       this.restApi.getCCEMIDetails().subscribe(response => {
         this.configEmi = response;
        });
        
       for (let key in this.configEmi) {
	let value = ((this.configEmi[key] / 12) / 100).toFixed(4);
 	let factor = Math.pow(1 + Number(value), Number(key)) - 1;
 	
	let emi = Number(amount) * Number(value) * Math.pow((1 + Number(value)),Number(key)) / factor;
	  emiArray.push({key:key,value: Math.round(emi)});
	}
        
       } 


        }
    
      return emiArray ;

    }
    
    
emiDebitLogic(amount: number)
    {

    var emiArray = [];let  configEmi;
     if (Number(amount) >= 5000) {
      if(AppConfig.EMI_FROM_API==0){
        configEmi=AppConfig.emiDebitInterst;
        for (let key in configEmi) {
	let value = ((configEmi[key] / 12) / 100).toFixed(4);
 	let factor = Math.pow(1 + Number(value), Number(key)) - 1;
	let emi = Number(amount) * Number(value) * Math.pow((1 + Number(value)),Number(key)) / factor;
	  emiArray.push({key:key,value: Math.round(emi)});
	}
      }else{
        this.restApi.getDCEMIDetails().subscribe(response => {
         this.configDCEmi = response;
        });
        
        for (let key in this.configEmi) {
	let value = ((this.configEmi[key] / 12) / 100).toFixed(4);
 	let factor = Math.pow(1 + Number(value), Number(key)) - 1;
	let emi = Number(amount) * Number(value) * Math.pow((1 + Number(value)),Number(key)) / factor;
	  emiArray.push({key:key,value: Math.round(emi)});
	}
      }
	

        }
      return emiArray ;

    }

    flexipayIntcalc(amount:number){
      let minamont= AppConfig.flexiMinMax.minimumAmount;
      let maxamount = AppConfig.flexiMinMax.maximumAmount;
       var flexiarr = [];let  flexiconfig;
              
      if(amount>=minamont && amount<=maxamount){
       if(AppConfig.EMI_FROM_API==0){
         flexiconfig = AppConfig.flexipayInt;
         for(let key in flexiconfig){
        if(Number(key) == Number('15')){
          this.intrest = ((Number(amount)*Number(key)*Number(flexiconfig[key]))/36000).toFixed(2);
        }else
        this.intrest = ((Number(amount)*30*Number(flexiconfig[key]))/36000).toFixed(2);
        flexiarr.push({key:key,value:this.intrest})
      }
        }else{
        this.restApi.getFlexipayDetails().subscribe(response => {
         this.flexiconfig = response;
        });
        
       for(let key in this.flexiconfig){
        if(Number(key) == Number('15')){
          this.intrest = ((Number(amount)*Number(key)*Number(this.flexiconfig[key]))/36000).toFixed(2);
        }else
        this.intrest = ((Number(amount)*30*Number(this.flexiconfig[key]))/36000).toFixed(2);
        flexiarr.push({key:key,value:this.intrest})
      }
        
       }

      }
        return flexiarr
    

    }

unserialize (data:any) {
  //  discuss at: http://locutus.io/php/unserialize/
  // original by: Arpad Ray (mailto:arpad@php.net)
  // improved by: Pedro Tainha (http://www.pedrotainha.com)
  // improved by: Kevin van Zonneveld (http://kvz.io)
  // improved by: Kevin van Zonneveld (http://kvz.io)
  // improved by: Chris
  // improved by: James
  // improved by: Le Torbi
  // improved by: Eli Skeggs
  // bugfixed by: dptr1988
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: philippsimon (https://github.com/philippsimon/)
  //  revised by: d3x
  //    input by: Brett Zamir (http://brett-zamir.me)
  //    input by: Martin (http://www.erlenwiese.de/)
  //    input by: kilops
  //    input by: Jaroslaw Czarniak
  //    input by: lovasoa (https://github.com/lovasoa/)
  //      note 1: We feel the main purpose of this function should be
  //      note 1: to ease the transport of data between php & js
  //      note 1: Aiming for PHP-compatibility, we have to translate objects to arrays
  //   example 1: unserialize('a:3:{i:0;s:5:"Kevin";i:1;s:3:"van";i:2;s:9:"Zonneveld";}')
  //   returns 1: ['Kevin', 'van', 'Zonneveld']
  //   example 2: unserialize('a:2:{s:9:"firstName";s:5:"Kevin";s:7:"midName";s:3:"van";}')
  //   returns 2: {firstName: 'Kevin', midName: 'van'}
  //   example 3: unserialize('a:3:{s:2:"ü";s:2:"ü";s:3:"四";s:3:"四";s:4:"𠜎";s:4:"𠜎";}')
  //   returns 3: {'ü': 'ü', '四': '四', '𠜎': '𠜎'}

  var $global = (typeof window !== 'undefined' ? window : global)

  var utf8Overhead = function (str) {
    var s = str.length
    for (var i = str.length - 1; i >= 0; i--) {
      var code = str.charCodeAt(i)
      if (code > 0x7f && code <= 0x7ff) {
        s++
      } else if (code > 0x7ff && code <= 0xffff) {
        s += 2
      }
      // trail surrogate
      if (code >= 0xDC00 && code <= 0xDFFF) {
        i--
      }
    }
    return s - 1
  }
  var error = function (type,
    msg, filename, line) {
    throw new $global[type](msg, filename, line)
  }
  var readUntil = function (data, offset, stopchr) {
    var i = 2
    var buf = []
    var chr = data.slice(offset, offset + 1)

    while (chr !== stopchr) {
      if ((i + offset) > data.length) {
       console.error( 'Invalid')
      }
      buf.push(chr)
      chr = data.slice(offset + (i - 1), offset + i)
      i += 1
    }
    return [buf.length, buf.join('')]
  }
  var readChrs = function (data, offset, length) {
    var i, chr, buf

    buf = []
    for (i = 0; i < length; i++) {
      chr = data.slice(offset + (i - 1), offset + i)
      buf.push(chr)
      length -= utf8Overhead(chr)
    }
    return [buf.length, buf.join('')]
  }
  function _unserialize (data, offset) {
    var dtype
    var dataoffset
    var keyandchrs
    var keys
    var contig
    var length
    var array
    var readdata
    var readData
    var ccount
    var stringlength
    var i
    var key
    var kprops
    var kchrs
    var vprops
    var vchrs
    var value
    var chrs = 0
    var typeconvert = function (x) {
      return x
    }

    if (!offset) {
      offset = 0
    }
    dtype = (data.slice(offset, offset + 1)).toLowerCase()

    dataoffset = offset + 2

    switch (dtype) {
      case 'i':
        typeconvert = function (x) {
          return parseInt(x, 10)
        }
        readData = readUntil(data, dataoffset, ';')
        chrs = readData[0]
        readdata = readData[1]
        dataoffset += chrs + 1
        break
      case 'b':
        typeconvert = function (x) {
          return parseInt(x, 10) !== 0
        }
        readData = readUntil(data, dataoffset, ';')
        chrs = readData[0]
        readdata = readData[1]
        dataoffset += chrs + 1
        break
      case 'd':
        typeconvert = function (x) {
          return parseFloat(x)
        }
        readData = readUntil(data, dataoffset, ';')
        chrs = readData[0]
        readdata = readData[1]
        dataoffset += chrs + 1
        break
      case 'n':
        readdata = null
        break
      case 's':
        ccount = readUntil(data, dataoffset, ':')
        chrs = ccount[0]
        stringlength = ccount[1]
        dataoffset += chrs + 2

        readData = readChrs(data, dataoffset + 1, parseInt(stringlength, 10))
        chrs = readData[0]
        readdata = readData[1]
        dataoffset += chrs + 2
        if (chrs !== parseInt(stringlength, 10) && chrs !== readdata.length) {
        console.error( 'String length mismatch')
        }
        break
      case 'a':
        readdata = {}

        keyandchrs = readUntil(data, dataoffset, ':')
        chrs = keyandchrs[0]
        keys = keyandchrs[1]
        dataoffset += chrs + 2

        length = parseInt(keys, 10)
        contig = true

        for (i = 0; i < length; i++) {
          kprops = _unserialize(data, dataoffset)
          kchrs = kprops[1]
          key = kprops[2]
          dataoffset += kchrs

          vprops = _unserialize(data, dataoffset)
          vchrs = vprops[1]
          value = vprops[2]
          dataoffset += vchrs

          if (key !== i) {
            contig = false
          }

          readdata[key] = value
        }

        if (contig) {
          array = new Array(length)
          for (i = 0; i < length; i++) {
            array[i] = readdata[i]
          }
          readdata = array
        }

        dataoffset += 1
        break
      default:
     console.error( 'Unknown / Unhandled data type(s): ' + dtype)
        break
    }
    return [dtype, dataoffset - offset, typeconvert(readdata)]
  }

  return _unserialize((data + ''), 0)[2]
}


search(input,filtereditems,searchkey){

	filtereditems=  filtereditems.filter(a => {
		var nameA=a[searchkey].toLowerCase(), input1=input.toLowerCase()
		return input1.length ? nameA.search(input1) != -1 : filtereditems
	});
	return filtereditems;
   }

get_service_earn_points(card: any,purchase_value: number,cvalue: any){
let saving_price;
switch(card) {
        case 'Infinia Credit card':
        saving_price =((purchase_value/150)*5)+(Math.min(((purchase_value/150))*5*cvalue,15000));
        if(saving_price>0)
        return 'Earn '+Math.round(saving_price)+" Pts";
        break;

        case 'Diners Black Credit card':
        saving_price =((purchase_value/150)*5)+(Math.min(((purchase_value/150))*5*cvalue,7500));
        if(saving_price>0)
        return 'Earn '+Math.round(saving_price)+" Pts";
        break;

        case 'Regalia Credit card':
        saving_price=Math.round((Math.min(purchase_value*cvalue,2000)));
        if(saving_price>0)
       return 'Earn '+Math.round(saving_price)+" Pts";
        break;


        case 'Diners Privilege Credit card':
        saving_price=Math.round((Math.min(purchase_value*cvalue,2000)));
        if(saving_price>0)
        return '<div class="earn_back_tag pos-relative"><span> Earn '+Math.round(saving_price)+" Pts </span></div>"
        break;

        case 'Millennia Credit card':
        var regular_cb=Math.round(Math.min(purchase_value*cvalue,1000));     
        var millennia_cb=(purchase_value>=1000) ? Math.round(Math.min(0.05*purchase_value,750)) : 0;
        saving_price=Math.round(regular_cb+millennia_cb);
        if(saving_price>0)
        return 'Earn '+Math.round(saving_price)+" Pts";
        break;

        case 'Millennia Debit / Prepaid card':
        var regular_cb=Math.round(Math.min(purchase_value*cvalue,1000));     
        var millennia_cb=(purchase_value>=400) ? Math.round(Math.min(0.05*purchase_value,400)) : 0;
        saving_price=Math.round(regular_cb+millennia_cb);
        if(saving_price>0)
        return 'Earn '+Math.round(saving_price)+" Pts";
        break;

        case 'Other Credit/Debit Card':
        saving_price=Math.round((Math.min(purchase_value*cvalue,1000)));
        return 'Get Cashback Rs.'+Math.round(saving_price);
        break;				

        case 'PayZapp card':
        saving_price=Math.round((Math.min(purchase_value*cvalue,1000)));
         return 'Get Cashback Rs.'+Math.round(saving_price);
        break; 
       default:
        saving_price=Math.round((Math.min(purchase_value*cvalue,1000)));
        return 'Get Cashback Rs.'+Math.round(saving_price);
        break;
}

}


parseQuery(search: any) {

    var args = search.substring(1).split('&');

    var argsParsed = {};

    var i, arg, kvp, key, value;

    for (i=0; i < args.length; i++) {

        arg = args[i];

        if (-1 === arg.indexOf('=')) {

            argsParsed[decodeURIComponent(arg).trim()] = true;
        }
        else {

            kvp = arg.split('=');

            key = decodeURIComponent(kvp[0]).trim();

            value = decodeURIComponent(kvp[1]).trim();

            argsParsed[key] = value;
        }
    }

    return argsParsed;
}

trainDuration(value: any) {
var res = value.split(":");
return res[0]+' hrs '+res[1]+' mins';

}

}
