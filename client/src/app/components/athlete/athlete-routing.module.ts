import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AthleteListComponent } from './athlete-list/athlete-list.component';
import { AthleteYearComponent } from './athlete-year/athlete-year.component';

const routes: Routes = [{
  path: 'athlete',
    children: [
      { path: 'year/:year', component: AthleteYearComponent },
      { path: 'year', redirectTo: 'year/2014' },
      { path: 'list', component: AthleteListComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AthleteRoutingModule { }