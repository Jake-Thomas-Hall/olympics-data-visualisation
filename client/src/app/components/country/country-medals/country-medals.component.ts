import { color, Legend, percent, Root } from '@amcharts/amcharts5';
import { PieChart } from '@amcharts/amcharts5/.internal/charts/pie/PieChart';
import { PieSeries } from '@amcharts/amcharts5/.internal/charts/pie/PieSeries';
import am5themes_Dark from '@amcharts/amcharts5/themes/Dark';
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import { Component, OnInit } from '@angular/core';
import { StyleService } from 'src/app/services/style.service';

@Component({
  selector: 'app-country-medals',
  templateUrl: './country-medals.component.html',
  styleUrls: ['./country-medals.component.scss']
})
export class CountryMedalsComponent implements OnInit {
  root!: Root;
  chart!: PieChart;
  series!: PieSeries;

  constructor(private styleService: StyleService) {
  }

  ngOnInit(): void {
    this.root = Root.new('chartdiv');

    this.root.setThemes([
      am5themes_Animated.new(this.root),
      am5themes_Dark.new(this.root),
      //am5themes_Responsive.new(this.root)
    ]);

    this.chart = this.root.container.children.push(
      PieChart.new(
        this.root, {
        radius: percent(70),
        innerRadius: percent(50)
      }
      )
    );

    this.series = this.chart.series.push(
      PieSeries.new(
        this.root, {
        valueField: "value",
        categoryField: "category",
        fillField: "fill",
        alignLabels: false
      }
      )
    );

    this.series.labels.template.setAll({
      text: '{category}: [bold]{valuePercentTotal.formatNumber(\'0.00\')}%[/] ({value})',
      textType: 'circular'
    });

    this.series.slices.template.setAll({
      tooltipText: '{category} - {value}'
    });

    this.series.data.setAll(
      [
        {
          category: "Gold",
          value: 2,
          fill: color(0xFFD700),
        },
        {
          category: "Silver",
          value: 234,
          fill: color(0xC0C0C0)
        },
        {
          category: "Bronze",
          value: 343,
          fill: color(0xE67E22)
        }
      ]);

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

    let legend = this.chart.children.push(Legend.new(this.root, {}));
    legend.data.setAll(this.series.dataItems);
  }
}
