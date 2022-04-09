import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CountryService } from 'src/app/services/country.service';
import { Country, CountryListResponse } from '../../../models/responses/country.response.model';

@Component({
  selector: 'app-country-list',
  templateUrl: './country-medal-list.component.html',
  styleUrls: ['./country-medal-list.component.scss']
})
export class CountryMedalListComponent implements OnInit {

  constructor(
    private router: Router) { }

  ngOnInit(): void {
  }

  navigate($country: Country) {
    this.router.navigate(['/', 'country', 'medals', $country.CountryID]);
  }
}
