import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestapiService} from 'src/app/shared/services/restapi.service';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { EncrDecrService } from 'src/app/shared/services/encr-decr.service';

@Component({
  selector: 'app-orders-retry',
  templateUrl: './orders-retry.component.html',
  styleUrls: ['./orders-retry.component.sass']
})
export class OrdersRetryComponent implements OnInit {

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    public rest:RestapiService,
    private EncrDecr: EncrDecrService

    ) { }

  randomFlightDetailKey : any;
  order_ref_num : any;
  orderData: any;
  DocKey:any;
  flightKey:any;
  flights:any;
  selected:string;
  queryFlightData:any;

  ngOnInit(): void { 

      this.route.queryParams.subscribe((params: any) => {
          this.order_ref_num = {'order_ref_num': params.orderReferenceNumber}; 

        const urlParams = this.order_ref_num;
        var retryParam = {
        postData:this.EncrDecr.set(JSON.stringify(urlParams))
        };

          this.rest.getOrderRetryDetails( retryParam).subscribe(result => {

          this.orderData = result;
          console.log((this.orderData));
          console.log("hllo");
          this.DocKey = 'REVMfEJPTXwyMDIzLTAxLTAxfG51bGx8MXwwfDB8RXxET018T3x3ZWI='; //btoa("DEL|BOM|2022-08-09||1|0|0|E|DOM|O|WEB");

          this.flightKey = "DELBOM6E2182022-08-09";

          this.flights = '[{"departureAirport":"DEL","departureTerminal":"1","arrivalAirport":"BOM","arrivalTerminal":"1","departureDateTime":"2022-08-09T11:05","arrivalDateTime":"2022-08-09T13:15","airline":"6E","flightNumber":" 218","operatingAirline":"","stops":0,"equipment":"6E","duration":7800,"airlineName":"IndiGo"}]';

          this.selected = '{"travel":"DOM","travel_type":"O","docKey":"REVMfEJPTXwyMDIzLTAxLTAxfG51bGx8MXwwfDB8RXxET018T3x3ZWI=","onwardFlightKey":"DELBOMG83232023-01-01","returnFlightKey":"","onwardFlights":[{"departureAirport":"DEL","departureTerminal":"2","arrivalAirport":"BOM","arrivalTerminal":"1","departureDateTime":"2023-01-01T18:20","arrivalDateTime":"2023-01-01T20:35","airline":"G8","flightNumber":" 323","operatingAirline":"","stops":0,"equipment":"G8","duration":8100,"airlineName":"Go First"}],"returnFlights":"","onwardPriceSummary":{"partnerName":"Easemytrip","splrtFareFlight":false,"baseFare":1478,"totalFare":2843,"refundStatus":1,"foodAllowance":"null","baggageAllowance":"","ctFareObject":"{\"IsInternational\":false,\"SSDetails\":null,\"SSRDetails\":null,\"BondType\":\"OutBound\",\"NearByAirport\":false,\"ShellPNR\":null,\"IsBrandAvailable\":false,\"JourneyIndex\":0,\"PromoCode\":null,\"ItineraryKey\":\"g4QgYpLlUGz6eKZ1a7tY6XD50uTLBonaRNrSj6fmn/k=\",\"description\":null,\"IsHoldBooking\":false,\"Remark\":\"\",\"CurrencyCode\":\"INR\",\"SearchId\":\"110,ADT:BF=1478.0000 Tax=1365.00000,CHD:BF=0 Tax=0,INF:BF=0 Tax=0,DFValue=0,APFV=2843.00000`1365.00000`1478.0000`1478`2500`0`0`MO9RBINX``Kgs`15`True`0`0`0`0`,CPFV=,IPFV=,ATB=`Tax:1365.00000,CTB=,ITB=,TBA=1478.0000,TTA=1365.00000,TFA=2843.00000,RTSearch=0\",\"InsuranceProvider\":0,\"FareIndicator\":0,\"Sessionfilepath\":null,\"IsCache\":false,\"Deeplink\":\"\",\"ExtSeatAvailStatus\":false,\"FareCategory\":0,\"EngineID\":5,\"IsBaggageFare\":false,\"IsSegmentChanged\":false,\"IsSpecial\":false,\"IsBranded\":false,\"VisaInfo\":null,\"ZCStatus\":false,\"Bonds\":[{\"IsBaggageFare\":false,\"Legs\":[{\"LayoverArrDT\":null,\"Origin\":\"DEL\",\"DepartureTime\":\"18:20\",\"Destination\":\"BOM\",\"FareClassOfService\":\"M\",\"FlightDesignator\":null,\"Group\":\"0\",\"SSRDetails\":null,\"BaggageWeight\":\"15\",\"DepartureTerminal\":\"2\",\"FlightDetailRefKey\":\"G8~ 323~ ~~DEL~01/01/2023 18:20~BOM~01/01/2023 20:35~~\",\"AirlineName\":\"G8\",\"ArrivalTerminal\":\"1\",\"FlightName\":\"GoAir\",\"AvailableSeat\":null,\"IsSeatOpen\":false,\"FareRulesKey\":null,\"CabinBagWT\":\"7\",\"CurrencyCode\":\"INR\",\"LayoverDuration\":null,\"CabinBagUT\":\"Kgs\",\"Sold\":0,\"Cabin\":\"Economy\",\"Capacity\":0,\"Remarks\":null,\"ProviderCode\":\"G8` 323` ``DEL`01/01/2023 18:20`BOM`01/01/2023 20:35``!0`M` `G8`MO9RBINX`0001``0`60``X!!G8``1``Kgs`15`Economy``G8`2`0`False`0``````02h 15m`MO9RBINX`M\",\"IsConnecting\":false,\"DepartureDate\":\"Sun-01Jan2023\",\"ArrivalTime\":\"20:35\",\"Status\":null,\"AircraftCode\":\"G8\",\"FareBasisCode\":\"MO9RBINX\",\"BaggageUnit\":\"Kgs\",\"BoundType\":\"OutBound\",\"LayoverAt\":null,\"Duration\":\"02h 15m\",\"CabinClasses\":null,\"GDSPnr\":null,\"NumberOfStops\":\"0\",\"ArrivalDate\":\"Sun-01Jan2023\",\"BookSeat\":null,\"FlightNumber\":\" 323\",\"OperatedBy\":null,\"CarrierCode\":\"G8\",\"LayoverDepDT\":null,\"OpenSegment\":false,\"AirlinePnr\":null,\"AircraftType\":null}],\"IsSSR\":false,\"JourneyTime\":\"02h 15m\",\"BoundType\":\"OutBound\",\"ItineraryKey\":\"g4QgYpLlUGz6eKZ1a7tY6XD50uTLBonaRNrSj6fmn/k=\",\"addOnDetail\":null}],\"FareRule\":\"CAN-BEF 8760_4:1478|CHG-BEF 8760_4:2500|EMTFee-0|CANCEL-BEF 8760_4:1478|CHANGE-BEF 8760_4:2500\",\"MemoryCreationTime\":\"/Date(1661183195126+0530)/\",\"IsSpecialId\":false,\"Fares\":null,\"Fare\":{\"ExchangeRate\":0,\"DueAmount\":0,\"SeatCharge\":0,\"TotalFareWithOutMarkUp\":2843,\"RefundAmount\":0,\"TotalSSRAmount\":0,\"PNRAmount\":0,\"FareName\":16,\"TotalConvFees\":200,\"PaxFares\":[{\"BaggageWeight\":\"15\",\"CancelPenalty\":1478,\"STF\":0,\"ExSeatFare\":0,\"Commission\":0,\"ChangePenalty\":2500,\"DFValue\":\"0\",\"TotalTax\":1365,\"ZeroCancellationCharge\":0,\"PaxType\":0,\"ExSeatFareStatus\":false,\"TDS\":0,\"CDValue\":0,\"FareBasisCode\":\"MO9RBINX\",\"IsZeroCancellation\":false,\"BaggageUnit\":\"Kgs\",\"AdminMarkUP\":0,\"Branded\":null,\"Refundable\":true,\"Cashback\":0,\"EquivCurrencyCode\":\"INR\",\"TransactionFee\":0,\"Fare\":[{\"ChargeCode\":\"Tax\",\"ChargeType\":\"Tax\",\"Amount\":1365}],\"TransactionAmount\":0,\"TotalFare\":2843,\"ServiceFee\":0,\"GDSPnr\":null,\"InsuranceAmount\":0,\"ConvFees\":200,\"ZeroCancellationValidity\":null,\"BasicFare\":1478,\"MarkUP\":0,\"BaseTransactionAmount\":0,\"FareInfoKey\":\"0~M~ ~G8~MO9RBINX~0001~~0~60~~X\",\"FareInfoValue\":\"M\",\"AirlinePnr\":null}],\"TotalTaxWithOutMarkUp\":1365,\"BasicFare\":1478,\"OfferedFare\":0,\"BrandKeys\":null,\"RequestedFare\":0,\"DiscountValue\":0},\"IsInsurance\":false,\"PaxSSRs\":null,\"IsRoundTrip\":false}"},"returnPriceSummary":"","splrtFlight":false,"queryFlightData":{"flightTripType":"O","flightfrom":"DEL","flightto":"BOM","fromCity":"New Delhi","toCity":"Mumbai","fromContry":"IN","toContry":"IN","fromAirportName":"Indira Gandhi Airport","toAirportName":"Chatrapati Shivaji Airport","flightclass":"E","flightdefault":"O","departure":"2023-01-01","arrival":"null","adults":"1","child":"0","infants":"0","travel":"DOM"}}';

          this.queryFlightData = '{"flightfrom":"DEL","flightto":"BOM","fromCity":"New Delhi","toCity":"Mumbai","fromContry":"IN","toContry":"IN","fromAirportName":"Indira Gandhi Airport","toAirportName":"Chatrapati Shivaji Airport","flightclass":"E","flightdefault":"O","departure":"2022-08-25","arrival":"","adults":"1","child":"0","infants":"0","mobFromAddress":"","mobToAddress":"","travel":"DOM"}';

          let flightDetailsArr: any = {
            "travel":"DOM",
            "travel_type":"O",
            "docKey": this.DocKey,
            "onwardFlightKey": this.flightKey,
            "returnFlightKey": '',
            "onwardFlights": this.flights,
            "returnFlights":'' ,
            "onwardPriceSummary": this.selected,
            "returnPriceSummary": '',
             "splrtFlight": false,
            "queryFlightData":this.queryFlightData
            };

          let sample = 'DELBLRI57472023-01-01BLRBOMI53392023-01-02Yatra';

          let randomFlightDetailKey = 'UkVWTWZFSlBUWHd5TURJeUxUQTRMVEE1Zkh3eGZEQjhNSHhGZkVSUFRYeFBmRmRGUWc9PURFTFZOUzZFNjYxMzIwMjItMDgtMDlWTlNCT002RTUzNzcyMDIyLTA4LTA5RWFzZW15dHJpcA==';//btoa(this.DocKey+sample); //btoa('this.DocKey+this.flightKey+this.selected.partnerName');
          //sessionStorage.setItem(randomFlightDetailKey, JSON.stringify(flightDetailsArr));

          //sessionStorage.setItem(randomFlightDetailKey, this.selected); 


        

          //console.log(this.EncrDecr.get(JSON.stringify(JSON.stringify(raw))));

                                                                          let trackUrlParams = new HttpParams()
                                                                          .set('current_url', window.location.href)
                                                                          .set('category', 'Flight')
                                                                          .set('event', 'Order Retry angf')
                                                                          .set('metadata', this.EncrDecr.set(JSON.stringify(JSON.stringify(flightDetailsArr))));

                                                                          const track_body: string = trackUrlParams.toString();
                                                                          this.rest.trackEvents(track_body).subscribe(result => { });

  
          this.router.navigate(['/flight-checkout'], {
            queryParams: {
              searchFlightKey: randomFlightDetailKey, 
              retry:true,
            },
          });
          
        },
        error => console.error('oops ', error)
        
        );

          
            
         

     });

  }

}
