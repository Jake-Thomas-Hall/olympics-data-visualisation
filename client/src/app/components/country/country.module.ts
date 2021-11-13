import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryMedalsComponent } from './country-medals/country-medals.component';
import { CountryListComponent } from './country-list/country-list.component';

@NgModule({
  declarations: [
    CountryListComponent,
    CountryMedalsComponent
  ],
  imports: [
    CommonModule
  ]
})
export class CountryModule { }
