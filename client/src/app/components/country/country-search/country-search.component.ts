import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subject, switchMap } from 'rxjs';
import { Country } from 'src/app/models/responses/country.response.model';
import { CountryService } from 'src/app/services/country.service';

@Component({
  selector: 'app-country-search',
  templateUrl: './country-search.component.html',
  styleUrls: ['./country-search.component.scss']
})
export class CountrySearchComponent implements OnInit {
  countrySearchForm: FormGroup;
  countries$: Observable<Country[]> = of([]);

  @Output() selectedCountry = new EventEmitter<Country>();

  constructor(
    private countryService: CountryService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) {
    this.countrySearchForm = this.fb.group({
      filter: [null]
    });
  }

  ngOnInit(): void {
    this.countrySearchForm.valueChanges.subscribe(value => {
      if (value['filter'] === '') {
        this.router.navigate([], { queryParams: null });
        return;
      }

      this.router.navigate([], { queryParams: value });
    });

    this.countrySearchForm.patchValue(this.route.snapshot.queryParams);

    this.route.queryParams.pipe(
      switchMap(sv => {
        return this.countryService.getAll(sv);
      })
    )
    .subscribe(response => {
      this.countries$ = of(response.data);
    });
  }
}
