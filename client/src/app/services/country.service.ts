import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CountryMedalsRequest } from '../models/requests/country-medals.request.model';
import { CountryMedals } from '../models/responses/country-medals.response.model';
import { Country } from '../models/responses/country.response.model';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(private http: HttpClient) { }

  getMedals(requestOptions: CountryMedalsRequest) {
    let params = new HttpParams();
    params = params.append('id', requestOptions.id);
    if (requestOptions.type) {
      params = params.append('type', requestOptions.type);
    }

    return this.http.get<CountryMedals>(`${AppConfigService.settings.apiEndpoint}country/medals`, {params: params});
  }

  getAll() {
    return this.http.get<Country[]>(`${AppConfigService.settings.apiEndpoint}country/list`);
  }
}
