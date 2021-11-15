import { color, Legend, percent, Root } from '@amcharts/amcharts5';
import { PieChart } from '@amcharts/amcharts5/.internal/charts/pie/PieChart';
import { PieSeries } from '@amcharts/amcharts5/.internal/charts/pie/PieSeries';
import am5themes_Dark from '@amcharts/amcharts5/themes/Dark';
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import { Component, OnInit } from '@angular/core';
import { StyleService } from 'src/app/services/style.service';
import { ActivatedRoute } from '@angular/router';
import { CountryService } from 'src/app/services/country.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CountryMedals } from 'src/app/models/country-medals.model';

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

  constructor(private styleService: StyleService,
    private route: ActivatedRoute,
    private countryService: CountryService) {
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

    

    this.route.paramMap.subscribe(params => {
      const id = +params.get('id')!;

      this.countryService.getMedals(id).subscribe({
        next: value => {
          this.countryMedalsResponse = value;
          this.series.data.setAll([]);

          if (value.Medals < 1) {
            this.hasNoMedals = true;
            return;
          }

          if (value.Golds > 0) {
            this.series.data.push({
              category: "Gold",
              value: value.Golds,
              fill: color(0xFFD700),
            });
          }

          if (value.Silvers > 0) {
            this.series.data.push({
              category: "Silver",
              value: value.Silvers,
              fill: color(0xC0C0C0),
            });
          }

          if (value.Bronze > 0) {
            this.series.data.push({
              category: "Bronze",
              value: value.Bronze,
              fill: color(0xE67E22),
            });
          }

          let legend = this.chart.children.push(Legend.new(this.root, {}));
          legend.data.setAll(this.series.dataItems);
        },
        error: (error: HttpErrorResponse) => {
          this.error = `Country with id ${id} could not be found. HTTP Error response: ${error.status}`;
        }
      });
    });
  }
}
