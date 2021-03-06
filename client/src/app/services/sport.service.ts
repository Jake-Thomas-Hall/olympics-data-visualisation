import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AllSportsResponse } from '../models/responses/all-sports.response.model';
import { SportGenderParticipationResponse } from '../models/responses/sport-gender-participation.response.model';
import { SportPopularityResponse } from '../models/responses/sport-popularity.response.model';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class SportService {

  constructor(
    private http: HttpClient
  ) { }

  getAll() {
    return this.http.get<AllSportsResponse>(`${AppConfigService.settings.apiEndpoint}sports/all`);
  }

  getSportGenderParticipation(params: {[x: string]: any;}) {
    return this.http.get<SportGenderParticipationResponse>(`${AppConfigService.settings.apiEndpoint}sports/gender`, {params: params});
  }

  getSportPopularity(params: {[x: string]: any;}) {
    return this.http.get<SportPopularityResponse>(`${AppConfigService.settings.apiEndpoint}sports/popularity`, {params: params});
  }
}
