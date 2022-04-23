import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SportGenderParticipationComponent } from './sport-gender-participation/sport-gender-participation.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SportRoutingModule } from './sport.routing.module';
import { MostPopularSportsComponent } from './most-popular-sports/most-popular-sports.component';



@NgModule({
  declarations: [
    SportGenderParticipationComponent,
    MostPopularSportsComponent
  ],
  imports: [
    CommonModule,
    SportRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class SportModule { }
