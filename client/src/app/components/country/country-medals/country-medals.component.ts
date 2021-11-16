import { color, Legend, percent, Root } from '@amcharts/amcharts5';
import { PieChart } from '@amcharts/amcharts5/.internal/charts/pie/PieChart';
import { PieSeries } from '@amcharts/amcharts5/.internal/charts/pie/PieSeries';
import am5themes_Dark from '@amcharts/amcharts5/themes/Dark';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { Component, OnInit } from '@angular/core';
import { StyleService } from 'src/app/services/style.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryService } from 'src/app/services/country.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CountryMedals } from 'src/app/models/country-medals.model';
import { FormControl } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { Location } from '@angular/common';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-country-medals',
  templateUrl: './country-medals.component.html',
  styleUrls: ['./country-medals.component.scss']
})
export class CountryMedalsComponent implements OnInit {
  root!: Root;
  chart!: PieChart;
  series!: PieSeries;
  error: string | null = null;
  countryMedalsResponse: CountryMedals | null = null;
  hasNoMedals = false;
  type = new FormControl(null);
  routeId: number = 0;

  constructor(private styleService: StyleService,
    private route: ActivatedRoute,
    private router: Router,
    private countryService: CountryService) {
  }

  ngOnInit(): void {


    this.root = Root.new('chartdiv');

    this.root.setThemes([
      am5themes_Animated.new(this.root),
      am5themes_Dark.new(this.root)
    ]);

    this.chart = this.root.container.children.push(
      PieChart.new(
        this.root, {
        radius: percent(60),
        innerRadius: percent(50)
      }
      )
    );

    this.series = this.chart.series.push(
      PieSeries.new(
        this.root, {
        valueField: 'value',
        categoryField: 'category',
        fillField: 'fill',
        alignLabels: false
      }
      )
    );

    this.series.labels.template.setAll({
      text: '{category}: {value}',
      textType: 'radial',
      radius: 50,
      fontSize: 15
    });

    let legend = this.chart.children.push(Legend.new(this.root, {}));

    this.styleService.isDarkTheme.subscribe(value => {
      if (value) {
        this.root.setThemes([
          am5themes_Animated.new(this.root),
          am5themes_Dark.new(this.root)
        ]);
      }
      else {
        this.root.setThemes([
          am5themes_Animated.new(this.root),
        ]);
      }
    });

    combineLatest({paramMap: this.route.paramMap, queryParamMap: this.route.queryParamMap}).subscribe(value => {
      this.routeId = +value.paramMap.get('id')!;
      const type = value.queryParamMap.get('type');
      this.type.setValue(type, {emitEvent: false});

      this.countryService.getMedals(this.routeId, type).subscribe({
        next: value => {
          this.countryMedalsResponse = value;
          this.series.data.setAll([]);

          if (value.Medals < 1) {
            this.hasNoMedals = true;
            return;
          }
          else {
            this.hasNoMedals = false;
          }

          if (value.Golds > 0) {
            this.series.data.push({
              category: 'Gold',
              value: value.Golds,
              fill: color(0xFFD700),
            });
          }

          if (value.Silvers > 0) {
            this.series.data.push({
              category: 'Silver',
              value: value.Silvers,
              fill: color(0xC0C0C0),
            });
          }

          if (value.Bronze > 0) {
            this.series.data.push({
              category: 'Bronze',
              value: value.Bronze,
              fill: color(0xE67E22),
            });
          }

          legend.data.setAll(this.series.dataItems);
        },
        error: (error: HttpErrorResponse) => {
          this.error = `Country with id ${this.routeId} could not be found. HTTP Error response: ${error.status}`;
        }
      });
    });

    this.type.valueChanges.subscribe(value => {
      if (value != null) {
        this.router.navigate(['../../medals', this.routeId], {queryParams: {type: value}, relativeTo: this.route});
      }
      else {
        this.router.navigate(['../../medals', this.routeId], {relativeTo: this.route, });
      }
    });
  }
}
