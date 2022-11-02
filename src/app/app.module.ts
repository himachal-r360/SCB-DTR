import { CUSTOM_ELEMENTS_SCHEMA, NgModule,APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent,AlertDialogComponent } from './app.component';
import { FlightModule } from './flight/flight.module';
import { HeaderModule } from './header/header.module';
import { FooterModule } from './footer/footer.module';
import { CountdownModule } from 'ngx-countdown';
import { HomeModule } from './home/home.module';
import { FlightSearchModule } from './flight/flight-search/flight-search.module';
import { HttpClientModule,HttpClientXsrfModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppConfigService } from './app-config.service';
import {APP_CONFIG, AppConfig} from './configs/app.config';
import { SimpleGlobal } from 'ng2-simple-global';
import { CommonHelper } from 'src/app/shared/utils/common-helper';
import { CommunicationService } from './shared/services/communication.service';
import { StyleManagerService } from 'src/app/shared/services/style-manager.service';
import { PartnersModule } from './partners/partners.module';
import { RegaliaGoldModule } from './regalia-gold/regalia-gold.module';
import { ToastrModule } from 'ngx-toastr';
import { CssLoaderComponent } from './css-loader.component';
import { BusSearchModule } from './bus/bus-search/bus-search.module';
import { TrainSearchModule } from './train/train-search/train-search.module';
import { BusModule } from './bus/bus.module';
import { ListModule } from './bus/list-card/list-card.module';
import { TrainModule } from './train/train.module';
import { TrainsTravellerModule } from './train/trains-traveller/travellers.module';
import { IrctcregModule } from './train/trains/irctcreg/irctcreg.module';
import { HotelModule } from './hotel/hotel.module';
import { HotelSearchModule } from './hotel/hotel-search/hotel-search.module';
import {  LOCALE_ID } from '@angular/core';
import { TdrModule } from './train/tdr/tdr.module';
import "@angular/common/locales/global/en-IN";
import { InfiniaModule } from './infinia/infinia.module';
import { UnificationModule } from './unification/unification.module';


export function appInitializerFn(appConfig: AppConfigService) {
   return () => appConfig.loadAppConfig();
}


@NgModule({
  declarations: [
    AppComponent,
    AlertDialogComponent,CssLoaderComponent
  ],
  imports: [
 BrowserModule,
    AppRoutingModule,
    FlightModule,BusModule,ListModule,
    TrainModule,TrainsTravellerModule,IrctcregModule,HotelModule,TdrModule,InfiniaModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN'
    }),
    HeaderModule,FooterModule,CountdownModule,
    PartnersModule,HomeModule,FlightSearchModule,BusSearchModule,TrainSearchModule,
    HotelSearchModule,
    RegaliaGoldModule,UnificationModule,
    ToastrModule.forRoot()
  ],
  exports:[],
   providers: [
   { provide: LOCALE_ID, useValue: 'en-IN' },
   StyleManagerService,
   AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [AppConfigService]
    },
   SimpleGlobal,CommonHelper,CommunicationService

  ],
     entryComponents: [AlertDialogComponent],
  bootstrap: [CssLoaderComponent,AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
