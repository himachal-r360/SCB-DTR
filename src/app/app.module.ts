import { NgModule,APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule} from '@angular/material/dialog';
import { CommonHelper } from 'src/app/shared/utils/common-helper';
import { CommunicationService } from './shared/services/communication.service';
import {MatBottomSheet, MatBottomSheetRef,MAT_BOTTOM_SHEET_DATA,MatBottomSheetConfig} from '@angular/material/bottom-sheet';


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
    BrowserAnimationsModule
  ],
  exports:[SearchComponent],
   providers: [
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
  bootstrap: [AppComponent]
})
export class AppModule { }
