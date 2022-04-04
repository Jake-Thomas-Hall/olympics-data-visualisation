import { Component, OnInit } from '@angular/core';
import { HomeResponse } from 'src/app/models/responses/home.response.model';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  homeResponse!: HomeResponse;

  constructor(private homeService: HomeService) { }

  ngOnInit(): void {
    this.homeService.get().subscribe({
      next: (response) => {
        this.homeResponse = response;
      }
    });
  }

}
