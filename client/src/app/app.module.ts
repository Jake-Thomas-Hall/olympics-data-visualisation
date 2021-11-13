import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { AppConfigService } from './services/app-config.service';
import { StyleService } from './services/style.service';
import { CountryModule } from './components/country/country.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    CountryModule
  ],
  providers: [
    AppConfigService, 
    { provide: APP_INITIALIZER, useFactory: AppConfigService.initialiseAppConfigService, deps: [AppConfigService], multi: true },
    StyleService,
    { provide: APP_INITIALIZER, useFactory: StyleService.initialiseStyleService, deps: [StyleService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
