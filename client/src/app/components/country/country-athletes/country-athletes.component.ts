import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { CountryAthletesResponse } from 'src/app/models/responses/country-athletes.response.model';
import { StyleService } from 'src/app/services/style.service';
import am5themes_Dark from '@amcharts/amcharts5/themes/Dark';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { array, Bullet, Color, color, Label, Legend, p100, p50, percent, Root, Tooltip } from '@amcharts/amcharts5';
import { XYChart } from '@amcharts/amcharts5/.internal/charts/xy/XYChart';
import { CategoryAxis } from '@amcharts/amcharts5/.internal/charts/xy/axes/CategoryAxis';
import { AxisRendererY } from '@amcharts/amcharts5/.internal/charts/xy/axes/AxisRendererY';
import { ValueAxis } from '@amcharts/amcharts5/.internal/charts/xy/axes/ValueAxis';
import { AxisRendererX } from '@amcharts/amcharts5/.internal/charts/xy/axes/AxisRendererX';
import { ColumnSeries } from '@amcharts/amcharts5/.internal/charts/xy/series/ColumnSeries';
import { AxisRenderer } from '@amcharts/amcharts5/.internal/charts/xy/axes/AxisRenderer';
import { CountryService } from 'src/app/services/country.service';
import { combineLatest } from 'rxjs';

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
  data: any[] = [];
  xAxis!: CategoryAxis<AxisRenderer>;
  yAxis!: ValueAxis<AxisRenderer>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private countryService: CountryService,
    private route: ActivatedRoute,
    private styleService: StyleService) {
    this.countryAthletesOptionsForm = this.fb.group({
      weighted: [null],
      gender: [null]
    });
  }

  ngOnInit(): void {
    this.root = Root.new('chartdiv');

    this.chart = this.root.container.children.push(XYChart.new(this.root, {
      panX: false,
      panY: false,
      layout: this.root.verticalLayout
    }));

    let xRenderer = AxisRendererX.new(this.root, { minGridDistance: 0});
    xRenderer.labels.template.setAll({
      rotation: -40,
      centerY: p50,
      centerX: p100
    });

    this.xAxis = this.chart.xAxes.push(CategoryAxis.new(this.root, {
      categoryField: 'AthleteFullName',
      renderer: xRenderer,
      tooltip: Tooltip.new(this.root, {})
    }));

    this.yAxis = this.chart.yAxes.push(ValueAxis.new(this.root, {
      min: 0,
      renderer: AxisRendererY.new(this.root, {})
    }));

    this.createSeries('Bronze', 'Bronze', color(0xE67E22), true);
    this.createSeries('Silver', 'Silvers', color(0xC0C0C0), true);
    this.createSeries('Gold', 'Golds', color(0xFFD700), true);

    this.chart.appear(1000, 100);

    this.countryAthletesOptionsForm.valueChanges.subscribe(value => {
      this.router.navigate([], { queryParams: value });
    });

    combineLatest([this.route.params, this.route.queryParams], (params, queryParams) => ({...params, ...queryParams})).subscribe(value => {
      this.countryAthletesOptionsForm.patchValue(value, { emitEvent: false });
      this.countryService.getTopAthletes(value).subscribe(result => {
        if (value['weighted'] === 'true') {
          if (this.chart.series.length <= 3) {
            this.createSeries('Weighted', 'Weighted', color(0x953db3), false);
          }
        }
        else {
          if (this.chart.series.length > 3) {
            this.chart.series.removeIndex(3).dispose();
          }
        }

        this.xAxis.data.setAll(result.data.athletes);
        this.chart.series.each(series => {
          series.data.setAll(result.data.athletes);
        });

        this.countryAthletesResponse = result;
      });
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

  private createSeries(name: string, valueField: string, colour: Color, stacked: boolean): ColumnSeries {
    let series = this.chart.series.push(ColumnSeries.new(this.root, {
      name: name,
      stacked: stacked,
      xAxis: this.xAxis,
      yAxis: this.yAxis,
      valueYField: valueField,
      categoryXField: 'AthleteFullName',
      fill: colour
    }));

    series.columns.template.setAll({
      tooltipText: '{name}, {categoryX}: {valueY}',
      tooltipY: percent(10)
    });
    series.appear();

    series.bullets.push(() => {
      return Bullet.new(this.root, {
        sprite: Label.new(this.root, {
          text: '{valueY}',
          fill: this.root.interfaceColors.get('alternativeText'),
          centerY: p50,
          centerX: p50,
          populateText: true
        })
      });
    });

    series.columns.template.onPrivate('height', (height, target) => {
      array.each(target!.dataItem!.bullets!, (bullet) => {
        if (height! > 0) {
          bullet.get('sprite').show();
        }
        else {
          bullet.get('sprite').hide();
        }
      });
    });

    return series;
  }
}
