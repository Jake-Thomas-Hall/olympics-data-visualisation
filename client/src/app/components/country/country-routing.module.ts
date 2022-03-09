import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountryListComponent } from './country-list/country-list.component';
import { CountryMapComponent } from './country-map/country-map.component';
import { CountryMedalsComponent } from './country-medals/country-medals.component';

const routes: Routes = [{
  path: 'country',
    children: [
      { path: 'list', component: CountryListComponent },
      { path: 'medals/:id', component: CountryMedalsComponent },
      { path: 'map', component: CountryMapComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CountryRoutingModule { }