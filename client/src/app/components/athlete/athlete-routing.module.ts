import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AthleteYearComponent } from './athlete-year/athlete-year.component';

const routes: Routes = [{
  path: 'athlete',
    children: [
      { path: 'year/:year', component: AthleteYearComponent },
      { path: 'year', redirectTo: 'year/2014' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AthleteRoutingModule { }