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
import { combineLatest, forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

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
  page = 1;
  endPage = 1;

  root!: Root;
  chart!: XYChart;
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

    let xRenderer = AxisRendererX.new(this.root, { minGridDistance: 0 });
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

    // Create the three main series, series for weighted scores is dynamically added/removed
    this.createSeries('Bronze', 'Bronze', color(0xE67E22), true);
    this.createSeries('Silver', 'Silvers', color(0xC0C0C0), true);
    this.createSeries('Gold', 'Golds', color(0xFFD700), true);

    // Navigate (query params) on changes to the two form controls.
    this.countryAthletesOptionsForm.valueChanges.subscribe(value => {
      this.router.navigate([], { queryParams: value, queryParamsHandling: 'merge' });
    });

    this.chart.appear(2000, 300);

    combineLatest([this.route.params, this.route.queryParams], (params, queryParams) => ({ ...params, ...queryParams })).subscribe(value => {
      // Set values from query params into form, do not emit update - don't want to cause a race condition of endless page reloads :)
      this.countryAthletesOptionsForm.patchValue({weighted: null, gender: null, ...value}, { emitEvent: false });
      // Set the page value, check if page exists, if it does set to value from query param, if not, set to one.
      this.page = value['page'] ? +value['page'] : 1;

      // Peform a forkJoin to perform both query for top 10 and query for all at same time.
      // Takes advantage of the behaviour of object creation; value of 'page' is overridden with value from query params if present.
      forkJoin({
        top10: this.countryService.getTopAthletes(value),
        all: this.countryService.getTopAthletes({ page: this.page, ...value, all: true })
      }).subscribe({
        next: result => {
          // Remove or add the series for the weighted data depending on the query param for it.
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

          // Set data into xAxis, and all present series.
          this.xAxis.data.setAll(result.top10.data.athletes);
          this.chart.series.each(series => {
            series.data.setAll(result.top10.data.athletes);
            series.appear(500, 0);
          });

          // Calculate end page, use ceiling to ensure round number
          this.endPage = Math.ceil(result.all.data.total! / 25);
          this.countryAthletesResponse = result.all;

          // If the endpage in query params happens to be more than actually is in the result set, re-navigate to actual end page.
          if (result.all.data.athletes.length < 1 && this.endPage > 0) {
            this.router.navigate([], { queryParams: { page: this.endPage }, queryParamsHandling: 'merge' });
          }

          // Hide or show graph and data depending on if there are actually any athletes.
          if (result.all.data.total! < 1) {
            this.hasNoAthletes = true;
          }
          else {
            this.hasNoAthletes = false;
          }
        },
        error: (result: HttpErrorResponse) => {
          this.error = result.error.message;
        }
      });
    });

    // Toggle graph between dark/light theme based on style service
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

  // Helper function for creating series, useful in this case due to necessity for four different series.
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

    // Add tooltip
    series.columns.template.setAll({
      tooltipText: '{name}, {categoryX}: {valueY}',
      tooltipY: percent(10)
    });

    // Create bullets for this series.
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

    // Hide bullets (the number on the series) if the series data is zero.
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
