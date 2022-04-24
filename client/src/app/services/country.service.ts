import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CountryMedalsRequest } from '../models/requests/country-medals.request.model';
import { CountryAthletesResponse } from '../models/responses/country-athletes.response.model';
import { CountryMapResponse } from '../models/responses/country-map.response.model';
import { CountryMedalSummaryResponse } from '../models/responses/country-medals.response.model';
import { CountryListResponse } from '../models/responses/country.response.model';
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

    return this.http.get<CountryMedalSummaryResponse>(`${AppConfigService.settings.apiEndpoint}country/medals`, {params: params});
  }

  getTopAthletes(params: {[x: string]: any;}) {
    return this.http.get<CountryAthletesResponse>(`${AppConfigService.settings.apiEndpoint}country/athletes`, {params: params});
  }

  getAll(params: {[x: string]: any;}) {
    return this.http.get<CountryListResponse>(`${AppConfigService.settings.apiEndpoint}country/list`, {params: params});
  }

  getMapData(params: {[x: string]: any;}) {
    return this.http.get<CountryMapResponse>(`${AppConfigService.settings.apiEndpoint}country/map`, {params: params});
  }
}
