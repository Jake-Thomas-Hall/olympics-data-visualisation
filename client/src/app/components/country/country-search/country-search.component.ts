import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Country } from 'src/app/models/responses/country.response.model';
import { CountryService } from 'src/app/services/country.service';

@Component({
  selector: 'app-country-search',
  templateUrl: './country-search.component.html',
  styleUrls: ['./country-search.component.scss']
})
export class CountrySearchComponent implements OnInit {
  countries: Country[] = [];

  @Output() selectedCountry = new EventEmitter<Country>();

  constructor(private countryService: CountryService) { }

  ngOnInit(): void {
    this.getCountries();
  }

  getCountries(): void {
    this.countryService.getAll().subscribe({
      next: (response) => {
        this.countries = response.data;
      }
    });
  }
}
