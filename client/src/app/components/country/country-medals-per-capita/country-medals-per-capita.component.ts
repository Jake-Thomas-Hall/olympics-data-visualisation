import { Bullet, Circle, color, Label, p50, Root, Scrollbar, Template, Tooltip } from '@amcharts/amcharts5';
import { AxisRenderer } from '@amcharts/amcharts5/.internal/charts/xy/axes/AxisRenderer';
import { AxisRendererX } from '@amcharts/amcharts5/.internal/charts/xy/axes/AxisRendererX';
import { AxisRendererY } from '@amcharts/amcharts5/.internal/charts/xy/axes/AxisRendererY';
import { ValueAxis } from '@amcharts/amcharts5/.internal/charts/xy/axes/ValueAxis';
import { LineSeries } from '@amcharts/amcharts5/.internal/charts/xy/series/LineSeries';
import { XYChart } from '@amcharts/amcharts5/.internal/charts/xy/XYChart';
import { XYCursor } from '@amcharts/amcharts5/.internal/charts/xy/XYCursor';
import { Component, OnInit } from '@angular/core';
import { StyleService } from 'src/app/services/style.service';
import am5themes_Dark from '@amcharts/amcharts5/themes/Dark';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { CountryService } from 'src/app/services/country.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-country-medals-per-capita',
  templateUrl: './country-medals-per-capita.component.html',
  styleUrls: ['./country-medals-per-capita.component.scss']
})
export class CountryMedalsPerCapitaComponent implements OnInit {

  root!: Root;
  chart!: XYChart;
  xAxis!: ValueAxis<AxisRenderer>;
  yAxis!: ValueAxis<AxisRenderer>;

  constructor(
    private styleService: StyleService,
    private countryService: CountryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.root = Root.new('chartdiv');

    this.chart = this.root.container.children.push(XYChart.new(this.root, {
      panX: true,
      panY: true,
      pinchZoomX: true,
      pinchZoomY: true,
      wheelY: 'zoomXY'
    }));

    this.xAxis = this.chart.xAxes.push(ValueAxis.new(this.root, {
      renderer: AxisRendererX.new(this.root, {
        inversed: false
      }),
      tooltip: Tooltip.new(this.root, {}),
      logarithmic: false
    }));

    // Postion x axis label
    this.xAxis.children.moveValue(Label.new(this.root, {
      text: "Medals",
      x: p50,
      centerX: p50,
    }), this.xAxis.children.length - 1);

    // Create Y axis on logarithmic scale so that data isn't so tightly packed together
    this.yAxis = this.chart.yAxes.push(ValueAxis.new(this.root, {
      renderer: AxisRendererY.new(this.root, {
        inversed: false
      }),
      tooltip: Tooltip.new(this.root, {}),
      logarithmic: true
    }));

    // Move the bottom label to the centre
    this.yAxis.children.moveValue(Label.new(this.root, {
      rotation: -90,
      text: "Population per Medal",
      y: p50,
      centerX: p50
    }), 0);

    let toolTipTemplate: Template<Tooltip> = Template.new({});
    toolTipTemplate.events.on("click", (ev) => {
      let dataItem = ev.target.dataItem!;
      let dataContext = dataItem.dataContext as any;

      if (dataContext.CountryID) {
        this.router.navigate(['/', 'country', 'athletes', dataContext.CountryID]);
      }
    });

    // Configure series, sets the tooltip label text as well
    let series = this.chart.series.push(LineSeries.new(this.root, {
      calculateAggregates: true,
      xAxis: this.xAxis,
      yAxis: this.yAxis,
      valueYField: 'PopulationPerMedal',
      valueXField: "Medals",
      valueField: 'CountryPopulation',
      seriesTooltipTarget: 'bullet',
      tooltip: Tooltip.new(this.root, {
        pointerOrientation: 'horizontal',
        labelText: "[bold]{CountryName}[/]\nPopulation: {CountryPopulation.formatNumber('#,###.')}\nMedals: {Medals}\nPopulation per Medal: {PopulationPerMedal.formatNumber('#,###.')}"
      }, toolTipTemplate),
      fill: color("#FCB131")
    }));

    series.strokes.template.set('visible', false);

    let circleTemplate = Template.new({}) as Template<Circle>;
    circleTemplate.events.on("click", (ev) => {
      let dataItem = ev.target.dataItem!;
      let dataContext = dataItem.dataContext as any;

      if (dataContext.CountryID) {
        this.router.navigate(['/', 'country', 'athletes', dataContext.CountryID]);
      }
    });

    // Add the bullets for the scatter graph
    series.bullets.push(() => {
      var bulletCircle = Circle.new(this.root, {
        radius: 5,
        fill: series.get("fill"),
        fillOpacity: 0.4
      }, circleTemplate);

      return Bullet.new(this.root, {
        sprite: bulletCircle
      });
    });

    // Heat rule co countries with a larger population are larger cirlces
    series.set("heatRules", [
      {
        target: circleTemplate,
        min: 3,
        max: 60,
        dataField: "value",
        key: "radius"
      }
    ]);

    // Add cursor
    this.chart.set('cursor', XYCursor.new(this.root, {
      xAxis: this.xAxis,
      yAxis: this.yAxis,
      snapToSeries: [series]
    }));

    // Add scrollbars
    this.chart.set("scrollbarX", Scrollbar.new(this.root, {
      orientation: "horizontal"
    }));

    this.chart.set("scrollbarY", Scrollbar.new(this.root, {
      orientation: "vertical"
    }));

    this.chart.appear(2000, 300);

    // Get and set chart data upon component load
    this.countryService.getPerCapitaMedals().subscribe(result => {
      series.data.setAll(result.data);
      series.appear(1000, 0);
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
          am5themes_Animated.new(this.root)
        ]);
      }
    });
  }
}
