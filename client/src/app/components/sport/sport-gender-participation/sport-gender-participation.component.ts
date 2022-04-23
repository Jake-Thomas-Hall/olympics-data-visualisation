import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StyleService } from 'src/app/services/style.service';
import am5themes_Dark from '@amcharts/amcharts5/themes/Dark';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { Color, color, DataProcessor, Legend, p50, Root, Series, Tooltip } from '@amcharts/amcharts5';
import { XYChart } from '@amcharts/amcharts5/.internal/charts/xy/XYChart';
import { SportService } from 'src/app/services/sport.service';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { XYCursor } from '@amcharts/amcharts5/.internal/charts/xy/XYCursor';
import { DateAxis } from '@amcharts/amcharts5/.internal/charts/xy/axes/DateAxis';
import { AxisRendererX } from '@amcharts/amcharts5/.internal/charts/xy/axes/AxisRendererX';
import { ValueAxis } from '@amcharts/amcharts5/.internal/charts/xy/axes/ValueAxis';
import { AxisRendererY } from '@amcharts/amcharts5/.internal/charts/xy/axes/AxisRendererY';
import { LineSeries } from '@amcharts/amcharts5/.internal/charts/xy/series/LineSeries';
import { CategoryAxis } from '@amcharts/amcharts5/.internal/charts/xy/axes/CategoryAxis';
import { AxisRenderer } from '@amcharts/amcharts5/.internal/charts/xy/axes/AxisRenderer';

@Component({
  selector: 'app-sport-gender-participation',
  templateUrl: './sport-gender-participation.component.html',
  styleUrls: ['./sport-gender-participation.component.scss']
})
export class SportGenderParticipationComponent implements OnInit {
  sportGenderOptionsForm: FormGroup;

  root!: Root;
  chart!: XYChart;
  xAxis!: CategoryAxis<AxisRenderer>;
  yAxis!: ValueAxis<AxisRenderer>;

  constructor(
    private fb: FormBuilder,
    private styleService: StyleService,
    private sportService: SportService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.sportGenderOptionsForm = this.fb.group({
      games: ['Summer']
    });
  }

  ngOnInit(): void {
    this.root = Root.new('chartdiv');

    this.chart = this.root.container.children.push(XYChart.new(this.root, {
      panX: true,
      panY: false,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true,
      layout: this.root.verticalLayout
    }));

    let cursor = this.chart.set("cursor", XYCursor.new(this.root, {
      behavior: "none"
    }));
    cursor.lineY.set("visible", false);

    this.xAxis = this.chart.xAxes.push(CategoryAxis.new(this.root, {
      categoryField: "VenueYear",
      renderer: AxisRendererX.new(this.root, {
        minGridDistance: 50
      })
    }));

    this.yAxis = this.chart.yAxes.push(ValueAxis.new(this.root, {
      min: 0,
      renderer: AxisRendererY.new(this.root, {})
    }));

    this.createSeries("Total Athletes", "TotalSports", "{categoryX} total sports: {valueY}", color("#b3b3b3"));
    this.createSeries("Female Athletes", "Women", "{categoryX} womens sports: {valueY}", color("#eb54ff"));
    this.createSeries("Male Athletes", "Men", "{categoryX} mens sports: {valueY}", color("#0f68f7"));
    
    let legend = this.chart.children.push(Legend.new(this.root, {
      centerX: p50,
      x: p50
    }));
    legend.data.setAll(this.chart.series.values);

    this.sportGenderOptionsForm.get('games')?.valueChanges.subscribe(value => {
      this.router.navigate(['..', value], { relativeTo: this.route, queryParamsHandling: 'merge' });
    });

    this.chart.appear(1000, 300);

    combineLatest([this.route.params, this.route.queryParams], (params, queryParams) => ({ ...params, ...queryParams })).subscribe(value => {
      // Set values from query params into form, do not emit update - don't want to cause a race condition of endless page reloads :)
      this.sportGenderOptionsForm.patchValue(value, { emitEvent: false });

      this.sportService.getSportGenderParticipation(value).subscribe(result => {
        let data = result.data.map((obj) => ({ VenueYear: obj.VenueYear.toString(), TotalSports: obj.TotalSports, Women: obj.Women, Men: obj.Men }))
        this.xAxis.data.setAll(data);
        let duration = 1000;
        this.chart.series.each((series, index) => {
          series.data.setAll(data);
          series.appear(duration, 0);
          duration += 500;
        });
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

  private createSeries(seriesName: string, valueYField: string, labelText: string, color: Color) {
    let series = this.chart.series.push(LineSeries.new(this.root, {
      name: seriesName,
      xAxis: this.xAxis,
      yAxis: this.yAxis,
      valueYField: valueYField,
      categoryXField: "VenueYear",
      tooltip: Tooltip.new(this.root, {
        pointerOrientation: "horizontal",
        labelText: labelText
      }),
      stroke: color,
      fill: color
    }));

    series.fills.template.setAll({
      fillOpacity: 0.1,
      visible: true
    });

    series.strokes.template.setAll({
      strokeWidth: 2
    });

    return series;
  }
}
