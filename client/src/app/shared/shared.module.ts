import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './components/navigation/navigation.component';
import { AppRoutingModule } from '../app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { BackButtonDirective } from './directives/back-button.directive';

@NgModule({
  declarations: [
    NavigationComponent,
    HomeComponent,
    BackButtonDirective
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  exports: [
    NavigationComponent,
    HomeComponent,
    BackButtonDirective
  ]
})
export class SharedModule { }
