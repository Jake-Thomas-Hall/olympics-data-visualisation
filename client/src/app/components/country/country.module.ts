import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryMedalsComponent } from './country-medals/country-medals.component';
import { CountryListComponent } from './country-list/country-list.component';
import { AppRoutingModule } from 'src/app/app-routing.module';

@NgModule({
  declarations: [
    CountryListComponent,
    CountryMedalsComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule
  ]
})
export class CountryModule { }
