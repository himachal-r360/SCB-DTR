import { CUSTOM_ELEMENTS_SCHEMA, NgModule,APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent,AlertDialogComponent } from './app.component';
import { FlightModule } from './flight/flight.module';
import { HeaderModule } from './header/header.module';
import { FooterModule } from './footer/footer.module';
import { CountdownModule } from 'ngx-countdown';
import { HomeModule } from './home/home.module';
import { FlightSearchModule } from './flight-search/flight-search.module';
import { HttpClientModule,HttpClientXsrfModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppConfigService } from './app-config.service';
import {APP_CONFIG, AppConfig} from './configs/app.config';
import { SimpleGlobal } from 'ng2-simple-global';
import { MatDialogModule} from '@angular/material/dialog';
import { CommonHelper } from 'src/app/shared/utils/common-helper';
import { CommunicationService } from './shared/services/communication.service';
import {MatBottomSheet, MatBottomSheetRef,MAT_BOTTOM_SHEET_DATA,MatBottomSheetConfig} from '@angular/material/bottom-sheet';
import {MaterialModule} from './material.module';
import { StyleManagerService } from 'src/app/shared/services/style-manager.service';
import { DirectiveModule } from './directives/directive.module';
import { PartnersModule } from './partners/partners.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { RegaliaGoldModule } from './regalia-gold/regalia-gold.module';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { CustomReuseStrategy } from './route-reuse-strategy';
import { ToastrModule } from 'ngx-toastr';
import { CssLoaderComponent } from './css-loader.component';
import { BusSearchModule } from './bus/bus-search/bus-search.module';
import { TrainSearchModule } from './train/train-search/train-search.module';
import { BusModule } from './bus/bus.module';
import { ListModule } from './bus/list-card/list-card.module';
import { FilterModule } from './bus/filter/filter.module';
import { TrainModule } from './train/train.module';
import { TrainsTravellerModule } from './train/trains-traveller/travellers.module';
import { IrctcregModule } from './train/trains/irctcreg/irctcreg.module';
import { HotelModule } from './hotel/hotel.module';
import { HotelSearchModule } from './hotel/hotel-search/hotel-search.module';

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
    BrowserAnimationsModule,
    AppRoutingModule,
    FlightModule,BusModule,ListModule,FilterModule,BusSearchModule,TrainSearchModule,
    TrainModule,TrainsTravellerModule,IrctcregModule,HotelModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN'
    }),
    HeaderModule,FooterModule,CountdownModule,MatDialogModule,
    MaterialModule,DirectiveModule,PartnersModule,HomeModule,FlightSearchModule,BusSearchModule,TrainSearchModule,
    BrowserAnimationsModule,HotelSearchModule,
    MaterialModule,
    DirectiveModule,
    CarouselModule,RegaliaGoldModule,
    ToastrModule.forRoot()
    

  ],
  exports:[],
   providers: [
   StyleManagerService,
   AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [AppConfigService]
    },
     {
      provide: RouteReuseStrategy,
      useClass: CustomReuseStrategy,
    },
SimpleGlobal,CommonHelper,CommunicationService,MatBottomSheet

  ],
     entryComponents: [AlertDialogComponent],
  bootstrap: [CssLoaderComponent,AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
