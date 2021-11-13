import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppConfig } from '../models/app-config.model';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  static settings: AppConfig;

  constructor(private http: HttpClient) { }

  load() {
    const jsonFile = `assets/config.${environment.name}.json`;
    return new Promise<void>((resolve, reject) => {
      this.http.get<AppConfig>(jsonFile).subscribe({ 
        next: (response) => {
          AppConfigService.settings = response;
          resolve();
        },
        error: (response) => {
          reject(`Could not load file ${jsonFile}: ${JSON.stringify(response)}`);
        }
      });
    });
  }

  static initialiseAppConfigService(appConfig: AppConfigService) {
    return () => appConfig.load();
  }
}
