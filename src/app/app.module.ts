import { CUSTOM_ELEMENTS_SCHEMA, NgModule,APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent,AlertDialogComponent } from './app.component';
import { FlightModule } from './flight/flight.module';
import { HeaderModule } from './header/header.module';
import { FooterModule } from './footer/footer.module';
import { CountdownModule } from 'ngx-countdown';
import { HomeComponent } from './home/home.component';
import { HttpClientModule,HttpClientXsrfModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchComponent } from './core/search/search.component';
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

export function appInitializerFn(appConfig: AppConfigService) {
   return () => appConfig.loadAppConfig();
}




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SearchComponent,
    AlertDialogComponent,
    
  ],
  imports: [
 BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FlightModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN'
    }),
    HeaderModule,FooterModule,CountdownModule,MatDialogModule,
    MaterialModule,DirectiveModule,PartnersModule,
    BrowserAnimationsModule,
    MaterialModule,
    DirectiveModule,
    CarouselModule,RegaliaGoldModule
    
  ],
  exports:[SearchComponent],
   providers: [

   StyleManagerService,
   AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [AppConfigService]
    },
SimpleGlobal,CommonHelper,CommunicationService,MatBottomSheet
  
  ],
     entryComponents: [AlertDialogComponent],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
