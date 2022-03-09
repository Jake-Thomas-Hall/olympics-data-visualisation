import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountryListComponent } from './components/country/country-list/country-list.component';
import { CountryMapComponent } from './components/country/country-map/country-map.component';
import { CountryMedalsComponent } from './components/country/country-medals/country-medals.component';
import { HomeComponent } from './shared/components/home/home.component';

const routes: Routes = [{
  path: 'country',
    children: [
      { path: 'list', component: CountryListComponent },
      { path: 'medals/:id', component: CountryMedalsComponent },
      { path: 'map', component: CountryMapComponent}
    ]
  },
  { path: '', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
