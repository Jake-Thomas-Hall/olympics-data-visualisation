import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountryMedalListComponent } from './country-medal-list/country-medal-list.component';
import { CountryMapComponent } from './country-map/country-map.component';
import { CountryMedalsComponent } from './country-medals/country-medals.component';
import { CountryAthleteListComponent } from './country-athlete-list/country-athlete-list.component';
import { CountryAthletesComponent } from './country-athletes/country-athletes.component';

const routes: Routes = [{
  path: 'country',
    children: [
      { path: 'medals', component: CountryMedalListComponent },
      { path: 'medals/map', component: CountryMapComponent},
      { path: 'medals/:id', component: CountryMedalsComponent },
      { path: 'athletes', component: CountryAthleteListComponent },
      { path: 'athletes/:id', component: CountryAthletesComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CountryRoutingModule { }