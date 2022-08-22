import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestapiService} from 'src/app/shared/services/restapi.service';

@Component({
  selector: 'app-orders-retry',
  templateUrl: './orders-retry.component.html',
  styleUrls: ['./orders-retry.component.sass']
})
export class OrdersRetryComponent implements OnInit {

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    public rest:RestapiService

    ) { }

  randomFlightDetailKey : any;
  order_ref_num : string;
  orderData: any;
  DocKey:any;
  flightKey:any;
  flights:any;
  selected:any;
  queryFlightData:any;

  ngOnInit(): void { 

      this.route.queryParams.subscribe((params: any) => {
          this.order_ref_num = params.orderReferenceNumber;

          this.rest.getOrderRetryDetails( this.order_ref_num).subscribe(result => {

          this.orderData = result;


          this.DocKey = btoa("DEL|BOM|2022-08-09||1|0|0|E|DOM|O|WEB");

          this.flightKey = "DELBOM6E2182022-08-09";

          this.flights = '[{"departureAirport":"DEL","departureTerminal":"1","arrivalAirport":"BOM","arrivalTerminal":"1","departureDateTime":"2022-08-09T11:05","arrivalDateTime":"2022-08-09T13:15","airline":"6E","flightNumber":" 218","operatingAirline":"","stops":0,"equipment":"6E","duration":7800,"airlineName":"IndiGo"}]';

          this.selected = '{"travel":"DOM","travel_type":"O","docKey":"REVMfEJPTXwyMDIyLTA4LTA5fHwxfDB8MHxFfERPTXxPfFdFQg==","onwardFlightKey":"DELVNS6E66132022-08-09VNSBOM6E53772022-08-09","returnFlightKey":"","onwardFlights":[{"departureAirport":"DEL","departureTerminal":"1","arrivalAirport":"VNS","arrivalTerminal":"","departureDateTime":"2022-08-09T10:40","arrivalDateTime":"2022-08-09T12:05","airline":"6E","flightNumber":"6613","operatingAirline":"","stops":0,"equipment":"6E","duration":5100,"airlineName":"IndiGo"},{"departureAirport":"VNS","departureTerminal":"","arrivalAirport":"BOM","arrivalTerminal":"2","departureDateTime":"2022-08-09T14:30","arrivalDateTime":"2022-08-09T16:45","airline":"6E","flightNumber":"5377","operatingAirline":"","stops":0,"equipment":"6E","duration":8100,"airlineName":"IndiGo"}],"returnFlights":"","onwardPriceSummary":{"partnerName":"Easemytrip","splrtFareFlight":false,"baseFare":2000,"totalFare":2577,"refundStatus":1,"foodAllowance":"null","baggageAllowance":"","ctFareObject":"{\"IsInternational\":false,\"SSDetails\":null,\"SSRDetails\":null,\"BondType\":\"OutBound\",\"NearByAirport\":false,\"ShellPNR\":null,\"IsBrandAvailable\":false,\"JourneyIndex\":0,\"PromoCode\":null,\"ItineraryKey\":\"b7SqRwmVDL7OJQP+J0ySES9vx7BMZSMJFZdVwW+LEF0=\",\"description\":null,\"IsHoldBooking\":false,\"Remark\":\"\",\"CurrencyCode\":\"INR\",\"SearchId\":\"102,ADT:BF=2000.0000 Tax=577.00000,CHD:BF=0 Tax=0,INF:BF=0 Tax=0,DFValue=0,APFV=965.0000`-35`1000.0000`2000`2500`0`0```Kgs`15`True`0`0`0`0`,CPFV=,IPFV=,ATB=`Tax:647.00000!,CTB=,ITB=,TBA=2000.0000,TTA=577.00000,TFA=2577.00000,RTSearch=0\",\"InsuranceProvider\":0,\"FareIndicator\":0,\"Sessionfilepath\":null,\"IsCache\":true,\"Deeplink\":\"\",\"ExtSeatAvailStatus\":false,\"FareCategory\":0,\"EngineID\":0,\"IsBaggageFare\":false,\"IsSegmentChanged\":false,\"IsSpecial\":false,\"IsBranded\":false,\"VisaInfo\":null,\"ZCStatus\":false,\"Bonds\":[{\"IsBaggageFare\":false,\"Legs\":[{\"LayoverArrDT\":null,\"Origin\":\"DEL\",\"DepartureTime\":\"10:40\",\"Destination\":\"VNS\",\"FareClassOfService\":\"R\",\"FlightDesignator\":null,\"Group\":\"0\",\"SSRDetails\":null,\"BaggageWeight\":\"15\",\"DepartureTerminal\":\"1\",\"FlightDetailRefKey\":\"6E~6613~ ~~DEL~08/09/2022 10:40~VNS~08/09/2022 12:05~~\",\"AirlineName\":\"6E\",\"ArrivalTerminal\":\"\",\"FlightName\":\"Indigo\",\"AvailableSeat\":null,\"IsSeatOpen\":false,\"FareRulesKey\":null,\"CurrencyCode\":\"INR\",\"LayoverDuration\":null,\"Sold\":0,\"Cabin\":\"Economy\",\"Capacity\":0,\"Remarks\":null,\"ProviderCode\":\"6E`6613` ``DEL`08/09/2022 10:40`VNS`08/09/2022 12:05``?6E`5377` ``VNS`08/09/2022 14:30`BOM`08/09/2022 16:45``!2`R` `6E`R0IP`1057``0`34``X?1`R` `6E`R0IP`1057``0`77``!!6E`320```Kgs`15`Economy``6E`1`0`False`0``````01h 25m`R0IP`R\",\"IsConnecting\":false,\"DepartureDate\":\"Tue-09Aug2022\",\"ArrivalTime\":\"12:05\",\"Status\":null,\"AircraftCode\":\"6E\",\"FareBasisCode\":\"R0IP\",\"BaggageUnit\":\"Kgs\",\"BoundType\":\"OutBound\",\"LayoverAt\":null,\"Duration\":\"01h 25m\",\"CabinClasses\":null,\"GDSPnr\":null,\"NumberOfStops\":\"0\",\"ArrivalDate\":\"Tue-09Aug2022\",\"BookSeat\":null,\"FlightNumber\":\"6613\",\"OperatedBy\":\"\",\"CarrierCode\":\"6E\",\"LayoverDepDT\":null,\"OpenSegment\":false,\"AirlinePnr\":null,\"AircraftType\":\"320\"},{\"LayoverArrDT\":null,\"Origin\":\"VNS\",\"DepartureTime\":\"14:30\",\"Destination\":\"BOM\",\"FareClassOfService\":\"R\",\"FlightDesignator\":null,\"Group\":\"0\",\"SSRDetails\":null,\"BaggageWeight\":\"15\",\"DepartureTerminal\":\"\",\"FlightDetailRefKey\":\"6E~5377~ ~~VNS~08/09/2022 14:30~BOM~08/09/2022 16:45~~\",\"AirlineName\":\"6E\",\"ArrivalTerminal\":\"2\",\"FlightName\":\"Indigo\",\"AvailableSeat\":null,\"IsSeatOpen\":false,\"FareRulesKey\":null,\"CurrencyCode\":\"INR\",\"LayoverDuration\":null,\"Sold\":0,\"Cabin\":\"Economy\",\"Capacity\":0,\"Remarks\":null,\"ProviderCode\":\"6E`6613` ``DEL`08/09/2022 10:40`VNS`08/09/2022 12:05``?6E`5377` ``VNS`08/09/2022 14:30`BOM`08/09/2022 16:45``!2`R` `6E`R0IP`1057``0`34``X?1`R` `6E`R0IP`1057``0`77``!!6E`320`2``Kgs`15`Economy``6E``0`False`0``````02h 15m`R0IP`R\",\"IsConnecting\":false,\"DepartureDate\":\"Tue-09Aug2022\",\"ArrivalTime\":\"16:45\",\"Status\":null,\"AircraftCode\":\"6E\",\"FareBasisCode\":\"R0IP\",\"BaggageUnit\":\"Kgs\",\"BoundType\":\"OutBound\",\"LayoverAt\":null,\"Duration\":\"02h 15m\",\"CabinClasses\":null,\"GDSPnr\":null,\"NumberOfStops\":\"0\",\"ArrivalDate\":\"Tue-09Aug2022\",\"BookSeat\":null,\"FlightNumber\":\"5377\",\"OperatedBy\":\"\",\"CarrierCode\":\"6E\",\"LayoverDepDT\":null,\"OpenSegment\":false,\"AirlinePnr\":null,\"AircraftType\":\"320\"}],\"IsSSR\":false,\"JourneyTime\":\"06h 05m\",\"BoundType\":\"OutBound\",\"ItineraryKey\":\"b7SqRwmVDL7OJQP+J0ySES9vx7BMZSMJFZdVwW+LEF0=\",\"addOnDetail\":null}],\"FareRule\":\"CAN-BEF 8760_4:2000|CHG-BEF 8760_4:2500|EMTFee-0|CANCEL-BEF 8760_4:2000|CHANGE-BEF 8760_4:2500\",\"MemoryCreationTime\":\"/Date(1658378441458+0530)/\",\"IsSpecialId\":false,\"Fares\":null,\"Fare\":{\"ExchangeRate\":0,\"DueAmount\":0,\"SeatCharge\":0,\"TotalFareWithOutMarkUp\":2577,\"RefundAmount\":0,\"TotalSSRAmount\":0,\"PNRAmount\":0,\"FareName\":7,\"TotalConvFees\":200,\"PaxFares\":[{\"BaggageWeight\":\"15\",\"CancelPenalty\":2000,\"STF\":0,\"ExSeatFare\":0,\"Commission\":0,\"ChangePenalty\":2500,\"DFValue\":\"0\",\"TotalTax\":612,\"ZeroCancellationCharge\":0,\"PaxType\":0,\"ExSeatFareStatus\":false,\"TDS\":0,\"CDValue\":0,\"FareBasisCode\":\"R0IP\",\"IsZeroCancellation\":false,\"BaggageUnit\":\"Kgs\",\"AdminMarkUP\":0,\"Branded\":null,\"Refundable\":true,\"Cashback\":0,\"EquivCurrencyCode\":\"INR\",\"TransactionFee\":0,\"Fare\":[{\"ChargeCode\":\"Tax\",\"ChargeType\":\"Tax\",\"Amount\":647}],\"TransactionAmount\":0,\"TotalFare\":1612,\"ServiceFee\":0,\"GDSPnr\":null,\"InsuranceAmount\":0,\"ConvFees\":200,\"ZeroCancellationValidity\":null,\"BasicFare\":1000,\"MarkUP\":0,\"BaseTransactionAmount\":0,\"FareInfoKey\":\"2~R~ ~6E~R0IP~1057~~0~34~~X^1~R~ ~6E~R0IP~1057~~0~77~~\",\"FareInfoValue\":\"R\",\"AirlinePnr\":null},{\"BaggageWeight\":\"15\",\"CancelPenalty\":2000,\"STF\":0,\"ExSeatFare\":0,\"Commission\":0,\"ChangePenalty\":2500,\"DFValue\":\"0\",\"TotalTax\":-35,\"ZeroCancellationCharge\":0,\"PaxType\":0,\"ExSeatFareStatus\":false,\"TDS\":0,\"CDValue\":0,\"FareBasisCode\":null,\"IsZeroCancellation\":false,\"BaggageUnit\":\"Kgs\",\"AdminMarkUP\":0,\"Branded\":null,\"Refundable\":true,\"Cashback\":0,\"EquivCurrencyCode\":\"INR\",\"TransactionFee\":0,\"Fare\":[],\"TransactionAmount\":0,\"TotalFare\":965,\"ServiceFee\":0,\"GDSPnr\":null,\"InsuranceAmount\":0,\"ZeroCancellationValidity\":null,\"BasicFare\":1000,\"MarkUP\":0,\"BaseTransactionAmount\":0,\"FareInfoKey\":null,\"FareInfoValue\":null,\"AirlinePnr\":null}],\"TotalTaxWithOutMarkUp\":577,\"BasicFare\":2000,\"OfferedFare\":0,\"BrandKeys\":null,\"RequestedFare\":0,\"DiscountValue\":0},\"IsInsurance\":false,\"PaxSSRs\":null,\"IsRoundTrip\":false}"},"returnPriceSummary":"","splrtFlight":false,"queryFlightData":{"flightfrom":"DEL","flightto":"BOM","fromCity":"New Delhi","toCity":"Mumbai","fromContry":"IN","toContry":"IN","fromAirportName":"Indira Gandhi Airport","toAirportName":"Chatrapati Shivaji Airport","flightclass":"E","flightdefault":"O","departure":"2022-08-25","arrival":"","adults":"1","child":"0","infants":"0","mobFromAddress":"","mobToAddress":"","travel":"DOM"}}';

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

          console.log(this.orderData);

          let randomFlightDetailKey = 'UkVWTWZFSlBUWHd5TURJeUxUQTRMVEE1Zkh3eGZEQjhNSHhGZkVSUFRYeFBmRmRGUWc9PURFTFZOUzZFNjYxMzIwMjItMDgtMDlWTlNCT002RTUzNzcyMDIyLTA4LTA5RWFzZW15dHJpcA=='; //btoa('this.DocKey+this.flightKey+this.selected.partnerName');
         // sessionStorage.setItem(randomFlightDetailKey, JSON.stringify(flightDetailsArr));
  
          this.router.navigate(['/flight-checkout'], {
            queryParams: {
              searchFlightKey: randomFlightDetailKey, 
              retry:true,
            },
          });
          
        });

          
            
         

     });

  }

}
