import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { AthleteDetail } from 'src/app/models/responses/athlete-details.response.model';
import { AthleteService } from 'src/app/services/athlete.service';

@Component({
  selector: 'app-athlete-details',
  templateUrl: './athlete-details.component.html',
  styleUrls: ['./athlete-details.component.scss']
})
export class AthleteDetailsComponent implements OnInit {
  athleteDetails: AthleteDetail[] = [];
  athleteDetail: AthleteDetail | null = null;

  constructor(
    private athleteService: AthleteService,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit(): void {

    combineLatest([this.route.params, this.route.queryParams], (params, queryParams) => ({ ...params, ...queryParams }))
      .subscribe(value => {
        this.athleteService.getAthleteDetails(value).subscribe(result => {
          this.athleteDetails = result.data;
          if (this.athleteDetails.length > 0) {
            this.athleteDetail = this.athleteDetails[0];
          }
        });
      });
  }

  // This has got to be the most cursed function I've ever needed to make
  getMedalEmoji(medalType: string) {
    switch (medalType) {
      case 'Gold':
        return '🥇';
      case 'Silver':
        return '🥈';
      case 'Bronze':
        return '🥉';
      default:
        return '';
    }
  }
}
