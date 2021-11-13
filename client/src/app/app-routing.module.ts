import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountryListComponent } from './components/country/country-list/country-list.component';
import { CountryMedalsComponent } from './components/country/country-medals/country-medals.component';

const routes: Routes = [{
  path: 'country',
  children: [
    { path: 'list', component: CountryListComponent },
    { path: 'medals', component: CountryMedalsComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
