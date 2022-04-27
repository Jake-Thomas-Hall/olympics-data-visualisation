import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryMedalsComponent } from './country-medals/country-medals.component';
import { CountryMedalListComponent } from './country-medal-list/country-medal-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { CountryMapComponent } from './country-map/country-map.component';
import { CountryRoutingModule } from './country-routing.module';
import { CountrySearchComponent } from './country-search/country-search.component';
import { CountryAthleteListComponent } from './country-athlete-list/country-athlete-list.component';
import { CountryAthletesComponent } from './country-athletes/country-athletes.component';
import { CountryMedalsPerCapitaComponent } from './country-medals-per-capita/country-medals-per-capita.component';
import { CountryLeaderboardsComponent } from './country-leaderboards/country-leaderboards.component';

@NgModule({
  declarations: [
    CountryMedalListComponent,
    CountryMedalsComponent,
    CountryMapComponent,
    CountrySearchComponent,
    CountryAthleteListComponent,
    CountryAthletesComponent,
    CountryMedalsPerCapitaComponent,
    CountryLeaderboardsComponent
  ],
  imports: [
    CommonModule,
    CountryRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class CountryModule { }
