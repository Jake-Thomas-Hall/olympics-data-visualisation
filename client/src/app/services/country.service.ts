import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CountryMedals } from '../models/country-medals.model';
import { Country } from '../models/country.model';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(private http: HttpClient) { }

  getMedals(id: number) {
    let params = new HttpParams().set('id', id);

    return this.http.get<CountryMedals>(`${AppConfigService.settings.apiEndpoint}country/medals`, {params: params});
  }

  getAll() {
    return this.http.get<Country[]>(`${AppConfigService.settings.apiEndpoint}country/list`);
  }
}
