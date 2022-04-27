import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountryMedalListComponent } from './country-medal-list/country-medal-list.component';
import { CountryMapComponent } from './country-map/country-map.component';
import { CountryMedalsComponent } from './country-medals/country-medals.component';
import { CountryAthleteListComponent } from './country-athlete-list/country-athlete-list.component';
import { CountryAthletesComponent } from './country-athletes/country-athletes.component';
import { CountryMedalsPerCapitaComponent } from './country-medals-per-capita/country-medals-per-capita.component';
import { CountryLeaderboardsComponent } from './country-leaderboards/country-leaderboards.component';

const routes: Routes = [{
  path: 'country',
    children: [
      { path: 'medals', component: CountryMedalListComponent },
      { path: 'medals/map', component: CountryMapComponent},
      { path: 'medals/capita', component: CountryMedalsPerCapitaComponent},
      { path: 'medals/:id', component: CountryMedalsComponent },
      { path: 'athletes', component: CountryAthleteListComponent },
      { path: 'athletes/:id', component: CountryAthletesComponent },
      { path: 'leaderboards/:year', component: CountryLeaderboardsComponent },
      { path: 'leaderboards', redirectTo: 'leaderboards/All' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CountryRoutingModule { }