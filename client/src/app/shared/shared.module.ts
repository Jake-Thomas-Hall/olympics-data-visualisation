import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './components/navigation/navigation.component';
import { AppRoutingModule } from '../app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { BackButtonDirective } from './directives/back-button.directive';
import { SearchHighlightDirective } from './directives/search-highlight.directive';

@NgModule({
  declarations: [
    NavigationComponent,
    HomeComponent,
    BackButtonDirective,
    SearchHighlightDirective
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  exports: [
    NavigationComponent,
    HomeComponent,
    BackButtonDirective,
    SearchHighlightDirective
  ]
})
export class SharedModule { }
