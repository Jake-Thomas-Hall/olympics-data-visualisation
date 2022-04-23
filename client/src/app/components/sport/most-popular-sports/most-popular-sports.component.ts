import { color, percent, Root } from '@amcharts/amcharts5';
import { AxisRendererCircular } from '@amcharts/amcharts5/.internal/charts/radar/AxisRendererCircular';
import { AxisRendererRadial } from '@amcharts/amcharts5/.internal/charts/radar/AxisRendererRadial';
import { RadarChart } from '@amcharts/amcharts5/.internal/charts/radar/RadarChart';
import { RadarColumnSeries } from '@amcharts/amcharts5/.internal/charts/radar/RadarColumnSeries';
import { AxisRenderer } from '@amcharts/amcharts5/.internal/charts/xy/axes/AxisRenderer';
import { CategoryAxis } from '@amcharts/amcharts5/.internal/charts/xy/axes/CategoryAxis';
import { ValueAxis } from '@amcharts/amcharts5/.internal/charts/xy/axes/ValueAxis';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { VenueYearsResponse } from 'src/app/models/responses/venue-years.response.model';
import { SportService } from 'src/app/services/sport.service';
import { StyleService } from 'src/app/services/style.service';
import { VenueService } from 'src/app/services/venue.service';
import am5themes_Dark from '@amcharts/amcharts5/themes/Dark';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { SportPopularity } from 'src/app/models/responses/sport-popularity.response.model';

@Component({
  selector: 'app-most-popular-sports',
  templateUrl: './most-popular-sports.component.html',
  styleUrls: ['./most-popular-sports.component.scss']
})
export class MostPopularSportsComponent implements OnInit {
  mostPopularSportsOptionsForm: FormGroup;
  venueYears$: Observable<VenueYearsResponse>;
  sportPopularities: SportPopularity[] = [];
  hasNoData = false;

  root!: Root;
  chart!: RadarChart;
  xAxis!: CategoryAxis<AxisRenderer>;
  yAxis!: ValueAxis<AxisRenderer>;

  constructor(
    private fb: FormBuilder,
    private styleService: StyleService,
    private venueService: VenueService,
    private router: Router,
    private route: ActivatedRoute,
    private sportService: SportService
  ) {
    this.mostPopularSportsOptionsForm = this.fb.group({
      year: [null],
      games: [null]
    });

    this.venueYears$ = this.venueService.getAllVenueYears();
  }

  ngOnInit(): void {
    this.root = Root.new('chartdiv');

    this.chart = this.root.container.children.push(RadarChart.new(this.root, {
      panX: true,
      panY: true,
      wheelX: "none",
      wheelY: "none",
      pinchZoomX: true,
      innerRadius: percent(40),
      radius: percent(70)
    }));
    this.chart.appear(2000, 300);

    let xRenderer = AxisRendererCircular.new(this.root, {
      minGridDistance: 10
    });
    xRenderer.grid.template.set("visible", false);
    xRenderer.labels.template.setAll({
      textType: "radial",
      oversizedBehavior: "fit",
      maxWidth: 90
    });

    this.xAxis = this.chart.xAxes.push(CategoryAxis.new(this.root, {
      maxDeviation: 0.3,
      categoryField: "SportType",
      renderer: xRenderer
    }));

    this.yAxis = this.chart.yAxes.push(ValueAxis.new(this.root, {
      maxDeviation: 0.3,
      renderer: AxisRendererRadial.new(this.root, {})
    }));

    let series = this.chart.series.push(RadarColumnSeries.new(this.root, {
      name: "Sports",
      xAxis: this.xAxis,
      yAxis: this.yAxis,
      valueYField: "Medals",
      categoryXField: "SportType",
      templateField: "columnSettings",
      fill: color("#0081C8"),
      stroke: color("#0081C8")
    }));

    series.columns.template.setAll({
      cornerRadius: 5,
      tooltipText: "{categoryX}: {valueY}"
    });

    this.mostPopularSportsOptionsForm.get('year')?.valueChanges.subscribe(value => {
      this.router.navigate(['..', value], { queryParamsHandling: 'merge', relativeTo: this.route });
    });

    this.mostPopularSportsOptionsForm.get('games')?.valueChanges.subscribe(value => {
      this.router.navigate([], { queryParams: { games: value }, queryParamsHandling: 'merge'});
    });

    combineLatest([this.route.params, this.route.queryParams], (params, queryParams) => ({ ...params, ...queryParams })).subscribe(value => {
      // Set values from query params into form, do not emit update - don't want to cause a race condition of endless page reloads :)
      this.mostPopularSportsOptionsForm.patchValue(value, { emitEvent: false });

      if (!value['games']) {
        this.router.navigate([], { queryParams: { games: 'Summer' }, queryParamsHandling: 'merge'});
        return;
      }

      this.sportService.getSportPopularity(value).subscribe(result => {
        this.sportPopularities = result.data;

        this.hasNoData = this.sportPopularities.length < 1;

        let mappedData = result.data.map(obj => ({ SportType: obj.SportType, Medals: obj.Medals }))

        this.xAxis.data.setAll(mappedData);
        series.data.setAll(mappedData);
        series.appear(1000, 0);
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

}
