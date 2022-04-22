import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AthleteRoutingModule } from './athlete-routing.module';
import { AthleteYearComponent } from './athlete-year/athlete-year.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    AthleteYearComponent
  ],
  imports: [
    CommonModule,
    AthleteRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class AthleteModule { }
