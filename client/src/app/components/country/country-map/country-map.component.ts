import { Root } from '@amcharts/amcharts5';
import { Component, OnInit } from '@angular/core';
import am5themes_Dark from '@amcharts/amcharts5/themes/Dark';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
import { MapChart } from '@amcharts/amcharts5/.internal/charts/map/MapChart';
import { MapPolygonSeries } from '@amcharts/amcharts5/.internal/charts/map/MapPolygonSeries';
import { StyleService } from 'src/app/services/style.service';

@Component({
  selector: 'app-country-map',
  templateUrl: './country-map.component.html',
  styleUrls: ['./country-map.component.scss']
})
export class CountryMapComponent implements OnInit {
  root!: Root;
  chart!: MapChart;
  series!: MapPolygonSeries;
  
  constructor(
    private styleService: StyleService
  ) { }

  ngOnInit(): void {
    this.root = Root.new('chartdiv');

    this.root.setThemes([
      am5themes_Animated.new(this.root),
      am5themes_Dark.new(this.root)
    ]);

    this.chart = this.root.container.children.push(
      MapChart.new(
        this.root, {}
      )
    );

    this.series = this.chart.series.push(
      MapPolygonSeries.new(
        this.root, {
        geoJSON: am5geodata_worldLow,
        exclude: ["AQ"]
      }
      )
    );

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
