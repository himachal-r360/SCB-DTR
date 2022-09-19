import {Component,OnInit,Input,Inject,ViewChild} from '@angular/core';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  environment
} from '../../../../environments/environment';
import {
  RestapiService
} from '../../../shared/services/restapi.service';
import {
  EncrDecrService
} from '../../../shared/services/encr-decr.service';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams
} from '@angular/common/http';
import {
  SimpleGlobal
} from 'ng2-simple-global';

import {
  MatSelectModule
} from '@angular/material/select';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormArray,
  FormControl
} from '@angular/forms';
import {
  IrctcApiService
} from 'src/app/shared/services/irctc.service';
import {
  DOCUMENT
} from '@angular/common';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import {
  Overlay
} from '@angular/cdk/overlay';
import {
  DatePipe
} from '@angular/common';
import {
  MatTableDataSource
} from '@angular/material/table';
import {
  MatPaginator
} from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
//import { resetCompiledComponents} from '@angular/core/src/render3/jit/module';
import { NgxSpinnerService } from "ngx-spinner";
import { MatInput } from '@angular/material/input';
import { AppConfigService } from '../../../app-config.service';
import * as moment from 'moment';


declare var $;
export interface PeriodicElement {
  id: number;
  pnr_no: string;
  order_ref_num: string;
  transaction_id: string;
  customer_id: string;
  train_no: string;
  from_station: string;
  to_station: string;
  journey_date: string;
  reason: string;
  tdrstatus: string;
  tdr_fileddate: string;
}



export interface DialogData {
  messageData: string;
  showC: boolean;
}
@Component({
  selector: 'app-tdr-history',
  templateUrl: './tdr-history.component.html',
  styleUrls: ['./tdr-history.component.scss']
})
export class TdrHistoryComponent implements OnInit {


  // @ViewChild('dataTable') table;
  dataTable: any;
  // dtOptions: any = {};

  dateToPass:any;
  displayedColumns: string[] = ['tdr_fileddate', 'pnr_no', 'transaction_id', 'from_station', 'to_station', 'tdrstatus'];
  
  //dataSource = new MatTableDataSource();
  dateForm: FormGroup;
  tdrHistoryData: any;
  cdnUrl: any;
  checkRAC: any;
  REWARD_CUSTOMERID: string;
  REWARD_EMAILID: string;
  REWARD_MOBILE: string;
  REWARD_FIRSTNAME: string;
  REWARD_LASTNAME: string;
  XSRFTOKEN: string;
  table: any;
  pnrValue: any;
  searchfrmstnValue: any;
  searchtostnValue: any;
  fromDate:any;
  isguestUser:string;
  domainName:any;
  // searchForm: FormGroup;
  template: string = '<div class="app-loading-new"><div class="logo"></div></div>';

  @ViewChild('fromdateInput', { read: MatInput})fromdateInput: MatInput;
  @ViewChild('todatenput', { read: MatInput})todatenput: MatInput;

  // ngAfterViewInit() {  }
  
 



  @Input('stationsdump') stationsdump;
  domainRedirect: string; domainPath: string;
  customerInfo: any[];
     serviceSettings:any;
  constructor(private spinnerService: NgxSpinnerService,private routeactive: ActivatedRoute,private datePipe: DatePipe, private dialog: MatDialog, private fb: FormBuilder, public _irctc: IrctcApiService, public rest: RestapiService, private EncrDecr: EncrDecrService, private http: HttpClient, private sg: SimpleGlobal, @Inject(DOCUMENT) private document: any, private router: Router, public overlay: Overlay,private appConfigService:AppConfigService) {
   this.serviceSettings=this.appConfigService.getConfig();
    this.stationsdump = require('src/assets/data/stations.json');
    this.domainName = this.sg['domainName'];
    this.domainPath = this.sg['domainPath'];
  }


  ngOnInit() {
   

    //user log-in information
    if (this.serviceSettings.DOMAIN_SETTINGS[this.sg['domainName']]['TRAIN'] != 1) {
      this.router.navigate([ '/**']);
    }
    this.cdnUrl = environment.cdnUrl;
    this.domainRedirect = environment.MAIN_SITE_URL + this.domainPath;
      setTimeout(() => {
    //Check Laravel Seesion
        if(this.sg['customerInfo']){
         this.customerInfo = this.sg['customerInfo'];
     if(this.customerInfo["org_session"]==1){
        setTimeout(function () {
          this.validateUser = false;
        }.bind(this), 1000);
       
        this.REWARD_CUSTOMERID = this.customerInfo["id"];
        this.REWARD_EMAILID = this.customerInfo["email"];
        this.REWARD_MOBILE = this.customerInfo["mobile"];
        this.REWARD_FIRSTNAME = this.customerInfo["firstname"];
        this.REWARD_LASTNAME = this.customerInfo["lastname"];
        this.XSRFTOKEN = this.customerInfo["XSRF-TOKEN"];
        this.isguestUser = this.customerInfo["guestLogin"];
          this.tdrhistory();
      } else {
        setTimeout(function () {
          this.validateUser = false;
        }.bind(this), 1000);
        this.REWARD_CUSTOMERID = '';
        this.REWARD_EMAILID = '';
        this.REWARD_MOBILE = '';
        this.REWARD_FIRSTNAME = '';
        this.REWARD_LASTNAME = '';
        this.XSRFTOKEN = 'NULL';
        if (environment.localInstance == 0) {
          this.document.location.href = environment.MAIN_SITE_URL + this.sg['domainPath'] + 'check-login';
        }
         this.spinnerService.hide();
      }
   }else{
      setTimeout(function () {
        this.validateUser = false;
      }.bind(this), 1000);
      this.REWARD_CUSTOMERID = '';
      this.REWARD_EMAILID = '';
      this.REWARD_MOBILE = '';
      this.REWARD_FIRSTNAME = '';
      this.REWARD_LASTNAME = '';
      this.XSRFTOKEN = 'NULL';
      if (environment.localInstance == 0) {
        this.document.location.href = environment.MAIN_SITE_URL + this.sg['domainPath'] + 'check-login';
      }
       this.spinnerService.hide();
    }
     }, 50);
   
  }

  ////////////////////////////////////////////

  normalizeDate(dateString) {
    var date = new Date(dateString);
    var normalized = date.getFullYear() + '' + (("0" + (date.getMonth() + 1)).slice(-2)) + '' + ("0" + date.getDate()).slice(-2);
    return normalized;
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  
  }
  specialcharInput($event) {
    var keycode = $event.which;
    if ((keycode >= 33 && keycode <= 47) || (keycode >= 91 && keycode <= 96) || (keycode >= 58 && keycode <= 64) ||
    (keycode >= 123 && keycode <= 126) || (keycode == 8377) || (keycode == 8364) || (keycode == 128) || (keycode == 163) ||
    (keycode == 165)){
      event.preventDefault();
    }
  }

getfromdate(){
  let date = $('#searchtdate').val();
  this.fromDate = new Date(date);
}


  tdrhistory() {
    this.spinnerService.show();
	let tdrParam  = {
	"customerid": this.REWARD_CUSTOMERID
	};
	
	let postParam  = {
	postData: this.EncrDecr.set(JSON.stringify(tdrParam))
	};
    
    this._irctc.tdrhistory(postParam).subscribe(resp => {
      this.tdrHistoryData = resp.partnerResponse;
      loadTable(this.tdrHistoryData);
      this.spinnerService.hide();
      $('#search_submit').click(function () {

        //]loadTable(this.tdrHistoryData);
        var searchpnr = $('#searchpnr').val(),
          searchfrmstn = $('#searchfrmstn').val(),
          searchfromjdate = $('#searchtdate').val(),
          searchtodate = $('#searchjdate').val(),
          searchtsID = $('#searchtsID').val(),
          searchtostn = $('#searchtostn').val();
        //  refernceID = $('#refernceID').val();

        var srcCount = 0;
        // console.log(searchfromjdate+"---"+searchtodate)
        if (searchpnr == '' && searchfromjdate == ''  && searchtodate =='' && searchtsID == '' && searchfrmstn == '' && searchtostn == '') {
          // &&  
          alert('Please fill any of the fields ');
        } else {
          $.fn.dataTableExt.afnFiltering.length = 0;
          if (searchpnr !== '' && searchpnr !== undefined) {
            search(1, searchpnr);
            srcCount++;
          }
          // if (refernceID !== '' && refernceID !== undefined) {
          //   search(4, refernceID);
          //   srcCount++
          // }
          if (searchtsID !== '' && searchtsID !== undefined) {
            search(2, searchtsID);
            srcCount++
          }
          if ((searchfromjdate !== '' && searchfromjdate !== undefined) && (searchtodate !== '' && searchtodate !== undefined)) {
            filterByDate(0, searchfromjdate, searchtodate);
            srcCount++;

          }
          if((searchfromjdate != '' && searchtodate =='')|| (searchfromjdate != undefined && searchtodate ==undefined)){
            filterBySearchDate(0, searchfromjdate);
              srcCount++;
            }
          if (searchfrmstn !== '' && searchfrmstn !== undefined) {
            search(3, searchfrmstn);
            srcCount++;
          }
          if (searchtostn !== '' && searchtostn !== undefined) {
            search(4, searchtostn);
            srcCount++;
          }
          if(searchfromjdate == '' && searchtodate !=''){
            alert('Please select from date.')
          }
          if (srcCount == 0) $.fn.dataTableExt.afnFiltering.length = 0;

          $("#historyTable").dataTable().fnDraw();

        }
      });

      var search = function (columndId, val) {
        $.fn.dataTable.ext.search.push(
          function (settings, data, dataIndex) {
            if (data[columndId] == val) {

              return true;
            }
            return false;
          }
        );
      };

      // filterByDate(0, searchfromjdate, searchtodate);
      var filterByDate = function (column, startDate, endDate) {
        // Custom filter syntax requires pushing the new filter to the global filter array
        $.fn.dataTableExt.afnFiltering.push(
          function (oSettings, aData, iDataIndex) {
            var rowDate = normalizeDate(aData[column]),
              start = normalizeDate(startDate),
              end = normalizeDate(endDate);

            //   var searchfromjdate = $('#searchtdate').val(),
            //   searchtodate = $('#searchjdate').val(),
            //   rowdate = aData[column].val();

            // console.log(rowDate + "---  " + start + "---" + end);
            // console.log(rowDate)
            

            // If our date from the row is between the start and end
            if (start <= rowDate && rowDate <= end) { console.log('hi')
              return true;
            } else if (rowDate >= start && end === '' && start !== '') { 
              return true;
            } else if (rowDate <= end && start === '' && end !== '') { 
              return true;
            } else { 
              return false;
            }
          }
        );
      };

      var filterBySearchDate = function(column, svalue) {
        $.fn.dataTableExt.afnFiltering.push(
        function( oSettings, aData, iDataIndex ) {
        var rowDate = normalizeDate(aData[column]),
        jDate = normalizeDate(svalue);
        if(rowDate==jDate)
        return true;
        else
        return false;
        }
        );
        };
    })




    var loadTable = function (tdata) {

      var table1 = $('#historyTable').DataTable({
        data: tdata,
        // "searching":false,
        "lengthChange": false,
        "info": true,
        "pageLength": 9,
        "dom": 'lrtip',
        "retrieve": true,


        columns: [
          {
            data: 'tdr_fileddate',
            "render": function (data) {
              var date = new Date(data);
              var month = date.getMonth() + 1;
              return (month.toString().length > 1 ? month : "0" + month) + "/" + date.getDate() + "/" + date.getFullYear();
            }
          },
          
          {
          data: 'pnr_no'
        },
        {
          data: 'train_no'
        },
        {
          data: 'from_station'
        },
        {
          data: 'reason'
        },
        {
          data: 'tdrstatus'
        }

        ],

      });
    }


    var normalizeDate = function (dateString) {
      var date = new Date(dateString);
      var normalized = date.getFullYear() + '' + (("0" + (date.getMonth() + 1)).slice(-2)) + '' + ("0" + date.getDate()).slice(-2);
      return normalized;
    }
    $(document).ready(function () {
      $(".dataTables_filter").hide();
    });
  }


  reset() {
    this.fromdateInput.value = '';
    this.todatenput.value = '';
    $.fn.dataTableExt.afnFiltering.length = 0;
    $("#historyTable").dataTable().fnDraw();
    $('#searchpnr').val(''),
      $('#searchfrmstn').val(''),
     // $('#searchjdate').val(''),
      //$('#searchtdate').val(''),
      $('#searchtsID').val(''),
      $('#searchtostn').val('');
    // $('#refernceID').val('');
  }


}
