import { color, DataItem, Root } from '@amcharts/amcharts5';
import { Component, OnInit } from '@angular/core';
import am5themes_Dark from '@amcharts/amcharts5/themes/Dark';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
import { MapChart } from '@amcharts/amcharts5/.internal/charts/map/MapChart';
import { IMapPolygonSeriesDataItem, MapPolygonSeries } from '@amcharts/amcharts5/.internal/charts/map/MapPolygonSeries';
import { StyleService } from 'src/app/services/style.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { CountryService } from 'src/app/services/country.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-country-map',
  templateUrl: './country-map.component.html',
  styleUrls: ['./country-map.component.scss']
})
export class CountryMapComponent implements OnInit {
  countryMapOptionsForm: FormGroup;

  root!: Root;
  chart!: MapChart;
  series!: MapPolygonSeries;

  constructor(
    private styleService: StyleService,
    private router: Router,
    private countryService: CountryService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) { 
    this.countryMapOptionsForm = this.fb.group({
      games: [null]
    });
  }

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

    

    this.chart.appear(2000, 300);

    this.countryMapOptionsForm.valueChanges.subscribe(value => {
      this.router.navigate([], { queryParams: value})
    });

    
    combineLatest([this.route.params, this.route.queryParams], (params, queryParams) => ({ ...params, ...queryParams })).subscribe(value => {
      // Set values from query params into form, do not emit update - don't want to cause a race condition of endless page reloads :)
      this.countryMapOptionsForm.patchValue({ games: null, ...value}, { emitEvent: false });

      this.countryService.getMapData(value).subscribe(result => {
        // Remove the previous series to prevent a nasty memory leak
        if (this.series) {
          this.series.dispose();
        }

        // Need to recreate the series every time, for some stupid reason data cannot be added async after series creation...
        this.series = this.chart.series.push(
          MapPolygonSeries.new(
            this.root, {
            geoJSON: am5geodata_worldLow,
            exclude: ["AQ"],
            valueField: "Medals",
            calculateAggregates: true,
            fill: color("#d1d1d1")
          }
          )
        );
    
        this.series.mapPolygons.template.setAll({
          tooltipText: "{name}: {Medals}"
        });
    
        // Specifies the heat values for the map
        this.series.set("heatRules", [{
          target: this.series.mapPolygons.template,
          dataField: "value",
          min: color("#f5c6cd"),
          max: color("#EE334E"),
          key: "fill"
        }]);
    
        // Handle zooming into and navigating to medal details for clicked country.
        this.series.mapPolygons.template.events.on("click", (ev) => {
          let dataItem = ev.target.dataItem as DataItem<IMapPolygonSeriesDataItem>;
          let dataContext = dataItem.dataContext as any;
    
          if (dataContext.CountryID) {
            this.series.zoomToDataItem(dataItem);
            setTimeout(() => {
                this.router.navigate(['/', 'country', 'medals', dataContext.CountryID], { queryParams: value});
            }, 1000);
          }
        });

        this.series.data.setAll(result.data);
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
