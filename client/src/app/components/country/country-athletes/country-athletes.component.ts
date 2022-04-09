import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CountryAthletesResponse } from 'src/app/models/responses/country-athletes.response.model';
import { StyleService } from 'src/app/services/style.service';
import am5themes_Dark from '@amcharts/amcharts5/themes/Dark';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { Legend, p50, Root, Tooltip } from '@amcharts/amcharts5';
import { XYChart } from '@amcharts/amcharts5/.internal/charts/xy/XYChart';
import { CategoryAxis } from '@amcharts/amcharts5/.internal/charts/xy/axes/CategoryAxis';
import { AxisRendererY } from '@amcharts/amcharts5/.internal/charts/xy/axes/AxisRendererY';
import { ValueAxis } from '@amcharts/amcharts5/.internal/charts/xy/axes/ValueAxis';
import { AxisRendererX } from '@amcharts/amcharts5/.internal/charts/xy/axes/AxisRendererX';

@Component({
  selector: 'app-country-athletes',
  templateUrl: './country-athletes.component.html',
  styleUrls: ['./country-athletes.component.scss']
})
export class CountryAthletesComponent implements OnInit {

  countryAthletesResponse: CountryAthletesResponse | null = null;
  countryAthletesOptionsForm: FormGroup;
  error?: string; 
  hasNoAthletes = false;

  root!: Root;
  chart!: XYChart;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private styleService: StyleService) 
  {
    this.countryAthletesOptionsForm = this.fb.group({
      weighting: [null],
      gender: [null]
    });
  }

  ngOnInit(): void {
    this.root = Root.new('chartdiv');

    this.chart = this.root.container.children.push(XYChart.new(this.root, {
      panX: false,
      panY: false,
      wheelX: 'panY',
      wheelY: 'zoomY',
      layout: this.root.verticalLayout
    }));

    let yAxis = this.chart.yAxes.push(CategoryAxis.new(this.root, {
      categoryField: 'AthleteFullName',
      renderer: AxisRendererY.new(this.root, {}),
      tooltip: Tooltip.new(this.root, {})
    }));

    let xAxis = this.chart.xAxes.push(ValueAxis.new(this.root, {
      min: 0,
      renderer: AxisRendererX.new(this.root, {})
    }));

    let legend = this.chart.children.push(Legend.new(this.root, {
      centerX: p50,
      x: p50
    }));

    this.countryAthletesOptionsForm.valueChanges.subscribe(value => {
      this.router.navigate([], {queryParams: value});
    });

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
  }

}
