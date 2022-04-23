import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SportGenderParticipationComponent } from './sport-gender-participation/sport-gender-participation.component';

const routes: Routes = [{
  path: 'sport',
    children: [
      { path: 'gender/participation/:games', component: SportGenderParticipationComponent },
      { path: 'gender/participation', redirectTo: 'gender/participation/Summer' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SportRoutingModule { }