import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SportGenderParticipationResponse } from '../models/responses/sport-gender-participation.response.model';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class SportService {

  constructor(
    private http: HttpClient
  ) { }

  getSportGenderParticipation(params: {[x: string]: any;}) {
    return this.http.get<SportGenderParticipationResponse>(`${AppConfigService.settings.apiEndpoint}sports/gender`, {params: params});
  }
}
