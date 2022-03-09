import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryMedalsComponent } from './country-medals/country-medals.component';
import { CountryListComponent } from './country-list/country-list.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { CountryMapComponent } from './country-map/country-map.component';
import { CountryRoutingModule } from './country-routing.module';

@NgModule({
  declarations: [
    CountryListComponent,
    CountryMedalsComponent,
    CountryMapComponent
  ],
  imports: [
    CommonModule,
    CountryRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class CountryModule { }
