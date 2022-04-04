import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HomeResponse } from '../models/responses/home.response.model';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  get() {
    return this.http.get<HomeResponse>(`${AppConfigService.settings.apiEndpoint}/home`);
  }
}
