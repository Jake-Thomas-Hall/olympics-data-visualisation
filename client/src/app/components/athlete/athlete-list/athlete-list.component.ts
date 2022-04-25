import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable, switchMap } from 'rxjs';
import { AllSportsResponse } from 'src/app/models/responses/all-sports.response.model';
import { AthleteListItem, AthleteListResponse } from 'src/app/models/responses/athlete-list.response.model';
import { AthleteService } from 'src/app/services/athlete.service';
import { SportService } from 'src/app/services/sport.service';

@Component({
  selector: 'app-athlete-list',
  templateUrl: './athlete-list.component.html',
  styleUrls: ['./athlete-list.component.scss']
})
export class AthleteListComponent implements OnInit {
  athleteListOptionsForm: FormGroup;
  searchFilter: FormControl;
  sports$: Observable<AllSportsResponse>;
  athletes: AthleteListItem[] = [];
  allowNext = false;
  page = 1;

  constructor(
    private fb: FormBuilder,
    private sportService: SportService,
    private athleteService: AthleteService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.athleteListOptionsForm = this.fb.group({
      medal: [null],
      sport: [null],
      order: [null],
      filter: [null]
    });

    this.searchFilter = this.fb.control(null);

    this.sports$ = this.sportService.getAll();
  }

  ngOnInit(): void {
    this.athleteListOptionsForm.valueChanges.subscribe(value => {
      this.router.navigate([], { queryParams: value, queryParamsHandling: 'merge' });
    });

    combineLatest([this.route.params, this.route.queryParams], (params, queryParams) => ({ ...params, ...queryParams }))
    // Do a switchmap here so that previous requests are cancelled if params are changed quickly (namely, typing)
    .pipe(switchMap(sv => {
      // Set values from query params into form, do not emit update - don't want to cause a race condition of endless page reloads :)
      this.athleteListOptionsForm.patchValue({ medal: null, sport: null, order: null, filter: null, ...sv }, { emitEvent: false });

      // Remove filter value if empty
      if (sv['filter'] === '') {
        delete sv['filter'];
        this.router.navigate([], { queryParams: sv });
      }

      // Set the page value back into the component
      if (sv['page']) {
        this.page = +sv['page'];
      }
      else {
        this.page = 1;
      }

      return this.athleteService.getAthleteList({ page: 1, ...sv })
    }))
    .subscribe(result => {
        // If there are no results, then navigate back to the first page
        if (result.data.length < 1 && this.page > 1) {
          this.router.navigate([], { queryParams: { page: null }, queryParamsHandling: 'merge' });
          return;
        }
        this.allowNext = result.data.length > 25;
        this.athletes = result.data.slice(0, 25);
    });
  }

}
