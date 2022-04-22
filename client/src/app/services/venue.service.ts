import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VenueYearsResponse } from '../models/responses/venue-years.response.model';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class VenueService {

  constructor(
    private http: HttpClient
  ) { }

  getAllVenueYears() {
    return this.http.get<VenueYearsResponse>(`${AppConfigService.settings.apiEndpoint}venues/years`);
  }
}
