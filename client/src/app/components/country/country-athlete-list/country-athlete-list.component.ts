import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Country } from 'src/app/models/responses/country.response.model';

@Component({
  selector: 'app-country-athlete-list',
  templateUrl: './country-athlete-list.component.html',
  styleUrls: ['./country-athlete-list.component.scss']
})
export class CountryAthleteListComponent implements OnInit {
  constructor(
    private router: Router) { }

  ngOnInit(): void {
  }

  navigate($country: Country) {
    this.router.navigate(['/', 'country', 'athletes', $country.CountryID]);
  }
}
