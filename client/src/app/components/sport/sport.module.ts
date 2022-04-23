import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SportGenderParticipationComponent } from './sport-gender-participation/sport-gender-participation.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SportRoutingModule } from './sport.routing.module';



@NgModule({
  declarations: [
    SportGenderParticipationComponent
  ],
  imports: [
    CommonModule,
    SportRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class SportModule { }
