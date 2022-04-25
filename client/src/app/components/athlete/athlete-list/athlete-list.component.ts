import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
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
      order: [null]
    });

    this.searchFilter = this.fb.control(null);

    this.sports$ = this.sportService.getAll();
  } 

  ngOnInit(): void {
    this.athleteListOptionsForm.valueChanges.subscribe(value => {
      this.router.navigate([], { queryParams: value, queryParamsHandling: 'merge' });
    });

    this.searchFilter.valueChanges.subscribe(value => {
      this.router.navigate([], { queryParams: { filter: value }, queryParamsHandling: 'merge'})
    });

    combineLatest([this.route.params, this.route.queryParams], (params, queryParams) => ({ ...params, ...queryParams })).subscribe(value => {
      // Set values from query params into form, do not emit update - don't want to cause a race condition of endless page reloads :)
      this.athleteListOptionsForm.patchValue({ medal: null, sport: null, order: null, ...value }, { emitEvent: false });

      if (value['filter'] === '') {
        delete value['filter'];
        this.router.navigate([], { queryParams: value });
        return;
      }

      if (value['page']) {
        this.page = +value['page'];
      }
      else {
        this.page = 1;
      }

      this.athleteService.getAthleteList({ page: 1, ...value}).subscribe(result => {
        if (result.data.length < 1) {
          this.router.navigate([], { queryParams: { page: null}, queryParamsHandling: 'merge' });
          return;
        }
        this.allowNext = result.data.length > 25;
        this.athletes = result.data.slice(0, 25);
      });
    });
  }

}
