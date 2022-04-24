import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AthleteListResponse } from '../models/responses/athlete-list.response.model';
import { AthletesYearResponse } from '../models/responses/athletes-year.response.model';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class AthleteService {

  constructor(
    private http: HttpClient
  ) { }

  getAthleteList(params: {[x: string]: any;}) {
    return this.http.get<AthleteListResponse>(`${AppConfigService.settings.apiEndpoint}athletes/list`, {params: params});
  }

  getAthleteCountByYear(params: {[x: string]: any;}) {
    return this.http.get<AthletesYearResponse>(`${AppConfigService.settings.apiEndpoint}athletes/year`, {params: params});
  }
}
