import { Circle, color, ColorSet, Container, p100, p50, Picture, Root, Tooltip } from '@amcharts/amcharts5';
import { AxisBullet } from '@amcharts/amcharts5/.internal/charts/xy/axes/AxisBullet';
import { AxisRenderer } from '@amcharts/amcharts5/.internal/charts/xy/axes/AxisRenderer';
import { AxisRendererX } from '@amcharts/amcharts5/.internal/charts/xy/axes/AxisRendererX';
import { AxisRendererY } from '@amcharts/amcharts5/.internal/charts/xy/axes/AxisRendererY';
import { CategoryAxis } from '@amcharts/amcharts5/.internal/charts/xy/axes/CategoryAxis';
import { ValueAxis } from '@amcharts/amcharts5/.internal/charts/xy/axes/ValueAxis';
import { ColumnSeries } from '@amcharts/amcharts5/.internal/charts/xy/series/ColumnSeries';
import { XYChart } from '@amcharts/amcharts5/.internal/charts/xy/XYChart';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { AthleteCountry } from 'src/app/models/responses/athletes-year.response.model';
import { VenueYearsResponse } from 'src/app/models/responses/venue-years.response.model';
import { AppConfigService } from 'src/app/services/app-config.service';
import { AthleteService } from 'src/app/services/athlete.service';
import { StyleService } from 'src/app/services/style.service';
import { VenueService } from 'src/app/services/venue.service';
import am5themes_Dark from '@amcharts/amcharts5/themes/Dark';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

@Component({
  selector: 'app-athlete-year',
  templateUrl: './athlete-year.component.html',
  styleUrls: ['./athlete-year.component.scss']
})
export class AthleteYearComponent implements OnInit {
  athleteYearOptionsForm: FormGroup;
  venueYears$: Observable<VenueYearsResponse>;
  hasNoData = false;
  athletesYearResponse: AthleteCountry[] = [];
  totalAthletes = 0;

  root!: Root;
  chart!: XYChart;
  xAxis!: CategoryAxis<AxisRenderer>;
  yAxis!: ValueAxis<AxisRenderer>;

  constructor(
    private fb: FormBuilder,
    private venueService: VenueService,
    private athleteService: AthleteService,
    private route: ActivatedRoute,
    private router: Router,
    private styleService: StyleService
  ) {
    this.athleteYearOptionsForm = this.fb.group({
      year: [null],
      filter: [null]
    });

    this.venueYears$ = this.venueService.getAllVenueYears();
  }

  ngOnInit(): void {
    this.root = Root.new('chartdiv');

    this.chart = this.root.container.children.push(XYChart.new(this.root, {
      panX: false,
      panY: false,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true,
      layout: this.root.verticalLayout
    }));

    let xRenderer = AxisRendererX.new(this.root, { minGridDistance: 0 });
    xRenderer.labels.template.setAll({
      rotation: -40,
      centerY: p50,
      centerX: p100,
      paddingTop: 20
    });

    this.xAxis = this.chart.xAxes.push(CategoryAxis.new(this.root, {
      categoryField: 'CountryName',
      renderer: xRenderer,
      bullet: (root, axis, dataItem) => {
        let maskCircle = Circle.new(root, { radius: 12 });

        let imageContainer = Container.new(root, {
          mask: maskCircle
        });

        imageContainer.children.push(
          Picture.new(root, {
            width: 24,
            height: 24,
            centerY: p50,
            centerX: p50,
            src: (dataItem.dataContext as any).icon
          })
        );

        return AxisBullet.new(root, {
          location: 0.5,
          sprite: imageContainer
        });
      }
    }));

    this.yAxis = this.chart.yAxes.push(ValueAxis.new(this.root, {
      renderer: AxisRendererY.new(this.root, {})
    }));

    let series = this.chart.series.push(ColumnSeries.new(this.root, {
      xAxis: this.xAxis,
      yAxis: this.yAxis,
      valueYField: "TotalAthletes",
      categoryXField: "CountryName"
    }));

    series.columns.template.setAll({
      tooltipText: "{categoryX}: {valueY}",
      tooltipY: 0,
      strokeOpacity: 0,
      templateField: "columnSettings"
    });

    this.chart.appear(1000, 500);

    this.athleteYearOptionsForm.get('filter')?.valueChanges.subscribe(value => {
      this.router.navigate([], { queryParams: { filter: value }, queryParamsHandling: 'merge' });
    });

    this.athleteYearOptionsForm.get('year')?.valueChanges.subscribe(value => {
      this.router.navigate(['..', value], { relativeTo: this.route, queryParamsHandling: 'merge' });
    });

    combineLatest([this.route.params, this.route.queryParams], (params, queryParams) => ({ ...params, ...queryParams })).subscribe(value => {
      // Set values from query params into form, do not emit update - don't want to cause a race condition of endless page reloads :)
      this.athleteYearOptionsForm.patchValue({ filter: null, ...value }, { emitEvent: false });

      this.athleteService.getAthleteCountByYear(value).subscribe(result => {
        this.athletesYearResponse = result.data.allCountries;
        this.totalAthletes = result.data.totalAthletes;

        let data = result.data.topCountries.map((value) => ({
          CountryName: value.CountryName,
          TotalAthletes: value.TotalAthletes,
          icon: `${AppConfigService.settings.endpoint}assets/flags/1x1/${value.CountryISOalpha2 ? value.CountryISOalpha2.toLowerCase() : 'xx'}.svg`,
          columnSettings: { fill: color("#0081C8") }
        }));

        if (data.length > 0) {
          this.hasNoData = false;
          this.xAxis.bulletsContainer.children.clear();
          data[data.length - 1].columnSettings = { fill: color("#bdbdbd") };

          this.xAxis.data.setAll(data);
          series.data.setAll(data);
          series.appear(700, 100);
        }
        else {
          this.hasNoData = true;
          this.xAxis.data.clear();
          this.xAxis.bulletsContainer.children.clear();
          series.data.clear();
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
}
