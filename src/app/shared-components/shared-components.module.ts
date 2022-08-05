import { NgModule, NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaterialModule } from '../material.module';
import { BannersComponent } from './banners/banners.component';
import { TravelComponent } from './travel/travel.component';
import { ExclusiveComponent } from './exclusive/exclusive.component';
import { BrandsComponent } from './brands/brands.component';
import { DealsComponent } from './deals/deals.component';
import { BenefitsComponent } from './benefits/benefits.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxCaptchaModule } from 'ngx-captcha';





@NgModule({
  declarations: [
    BannersComponent,
    TravelComponent,
    ExclusiveComponent,
    BrandsComponent,
    DealsComponent,
    BenefitsComponent,
  
  ],
  imports: [
    CommonModule,
    MaterialModule,
    CarouselModule,
    NgbModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
     MatCheckboxModule,  MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,NgxCaptchaModule,MatSelectModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  exports: [BannersComponent, TravelComponent, ExclusiveComponent, BrandsComponent, DealsComponent, BenefitsComponent ],

})
export class SharedComponentsModule { }
