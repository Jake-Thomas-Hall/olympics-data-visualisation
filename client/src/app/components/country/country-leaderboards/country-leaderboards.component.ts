import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { CountryLeaderboardItem } from 'src/app/models/responses/country-leaderboard.response.model';
import { VenueYearsResponse } from 'src/app/models/responses/venue-years.response.model';
import { AppConfigService } from 'src/app/services/app-config.service';
import { CountryService } from 'src/app/services/country.service';
import { StyleService } from 'src/app/services/style.service';
import { VenueService } from 'src/app/services/venue.service';
import am5themes_Dark from '@amcharts/amcharts5/themes/Dark';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { array, Bullet, Circle, color, Color, Container, Label, p100, p50, percent, Picture, Root, Tooltip } from '@amcharts/amcharts5';
import { XYChart } from '@amcharts/amcharts5/.internal/charts/xy/XYChart';
import { AxisRendererX } from '@amcharts/amcharts5/.internal/charts/xy/axes/AxisRendererX';
import { CategoryAxis } from '@amcharts/amcharts5/.internal/charts/xy/axes/CategoryAxis';
import { AxisRenderer } from '@amcharts/amcharts5/.internal/charts/xy/axes/AxisRenderer';
import { ValueAxis } from '@amcharts/amcharts5/.internal/charts/xy/axes/ValueAxis';
import { AxisRendererY } from '@amcharts/amcharts5/.internal/charts/xy/axes/AxisRendererY';
import { ColumnSeries } from '@amcharts/amcharts5/.internal/charts/xy/series/ColumnSeries';
import { AxisBullet } from '@amcharts/amcharts5/.internal/charts/xy/axes/AxisBullet';

@Component({
  selector: 'app-country-leaderboards',
  templateUrl: './country-leaderboards.component.html',
  styleUrls: ['./country-leaderboards.component.scss']
})
export class CountryLeaderboardsComponent implements OnInit {
  leaderboardsOptionsForm: FormGroup;
  venueYears$: Observable<VenueYearsResponse>;
  summerLeaderboard: CountryLeaderboardItem[] = [];
  winterLeaderboard: CountryLeaderboardItem[] = [];

  roots: Root[] = [];
  charts: XYChart[] = [];
  xAxis: CategoryAxis<AxisRenderer>[] = [];
  yAxis: ValueAxis<AxisRenderer>[] = [];

  constructor(
    private fb: FormBuilder,
    private venueService: VenueService,
    private router: Router,
    private route: ActivatedRoute,
    private countryService: CountryService,
    private styleService: StyleService
  ) {
    this.leaderboardsOptionsForm = this.fb.group({
      year: ['All'],
    });

    this.venueYears$ = this.venueService.getAllVenueYears();
  }

  ngOnInit(): void {
    // Create roots
    this.roots.push(Root.new('chartdivSummer'));
    this.roots.push(Root.new('chartdivWinter'));

    // Create chart for summer and winter chart
    this.charts.push(this.roots[0].container.children.push(XYChart.new(this.roots[0], {
      panX: false,
      panY: false,
      layout: this.roots[0].verticalLayout
    })));
    this.charts.push(this.roots[1].container.children.push(XYChart.new(this.roots[1], {
      panX: false,
      panY: false,
      layout: this.roots[1].verticalLayout
    })));

    // create x axis for each chart
    this.xAxis.push(this.charts[0].xAxes.push(CategoryAxis.new(this.roots[0], {
      categoryField: 'CountryName',
      renderer: AxisRendererX.new(this.roots[0], { 
        minGridDistance: 0
      }),
      tooltip: Tooltip.new(this.roots[0], {}),
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
    })));
    this.xAxis.push(this.charts[1].xAxes.push(CategoryAxis.new(this.roots[1], {
      categoryField: 'CountryName',
      renderer: AxisRendererX.new(this.roots[1], { 
        minGridDistance: 0
      }),
      tooltip: Tooltip.new(this.roots[1], {}),
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
    })));

    // Change angle of labels
    this.xAxis[0].get("renderer").labels.template.setAll({
      rotation: -40,
      centerY: p50,
      centerX: p100,
      paddingTop: 20
    });
    this.xAxis[1].get("renderer").labels.template.setAll({
      rotation: -40,
      centerY: p50,
      centerX: p100,
      paddingTop: 20
    });

    // Create y axis for each chart
    this.yAxis.push(this.charts[0].yAxes.push(ValueAxis.new(this.roots[0], {
      min: 0,
      renderer: AxisRendererY.new(this.roots[0], {})
    })));
    this.yAxis.push(this.charts[1].yAxes.push(ValueAxis.new(this.roots[1], {
      min: 0,
      renderer: AxisRendererY.new(this.roots[1], {})
    })));

    // Create series for summer table
    this.createSeries('Bronze', 'Bronze', color(0xE67E22), true, 0);
    this.createSeries('Silver', 'Silvers', color(0xC0C0C0), true, 0);
    this.createSeries('Gold', 'Golds', color(0xFFD700), true, 0);
    this.createSeries('Weighted', 'Weighted', color(0x953db3), false, 0);

    // Create series for winter table
    this.createSeries('Bronze', 'Bronze', color(0xE67E22), true, 1);
    this.createSeries('Silver', 'Silvers', color(0xC0C0C0), true, 1);
    this.createSeries('Gold', 'Golds', color(0xFFD700), true, 1);
    this.createSeries('Weighted', 'Weighted', color(0x953db3), false, 1);

    this.leaderboardsOptionsForm.get('year')?.valueChanges.subscribe(value => {
      this.router.navigate(['..', value], { relativeTo: this.route });
    });

    // Animate showing of charts
    this.charts.forEach(chart => {
      chart.appear(2000, 300);
    });

    combineLatest([this.route.params, this.route.queryParams], (params, queryParams) => ({ ...params, ...queryParams })).subscribe(value => {
      // Set values from query params into form, do not emit update - don't want to cause a race condition of endless page reloads :)
      this.leaderboardsOptionsForm.patchValue(value, { emitEvent: false });

      this.countryService.getLeaderboards(value).subscribe(result => {
        this.xAxis.forEach(axis => {
          axis.data.clear();
          axis.bulletsContainer.children.clear();
        });

        this.charts[0].series.each(series => {
          series.data.clear();
        });
        this.charts[1].series.each(series => {
          series.data.clear();
        });

        this.summerLeaderboard = result.data.summer;
        this.winterLeaderboard = result.data.winter;

        let top10Summer = result.data.summer.slice(0, 10);
        let top10Winter = result.data.winter.slice(0, 10);

        top10Summer.forEach(topSummer => {
          topSummer.icon = `${AppConfigService.settings.endpoint}assets/flags/1x1/${topSummer.CountryISOalpha2 ? topSummer.CountryISOalpha2.toLowerCase() : 'xx'}.svg`
        });
        top10Winter.forEach(topWinter => {
          topWinter.icon = `${AppConfigService.settings.endpoint}assets/flags/1x1/${topWinter.CountryISOalpha2 ? topWinter.CountryISOalpha2.toLowerCase() : 'xx'}.svg`
        });

        this.xAxis[0].data.setAll(top10Summer);
        this.xAxis[1].data.setAll(top10Winter);

        this.charts[0].series.each(series => {
          series.data.setAll(top10Summer);
          series.appear(500, 0);
        });
        this.charts[1].series.each(series => {
          series.data.setAll(top10Winter);
          series.appear(500, 0);
        });
      });
    });

    // Toggle graph between dark/light theme based on style service
    this.styleService.isDarkTheme.subscribe(value => {
      if (value) {
        this.roots.forEach(root => {
          root.setThemes([
            am5themes_Animated.new(root),
            am5themes_Dark.new(root)
          ]);
        });
      }
      else {
        this.roots.forEach(root => {
          root.setThemes([
            am5themes_Animated.new(root)
          ]);
        });
      }
    });
  }

  // Helper function for creating series, useful in this case due to necessity for lots of different series
  private createSeries(name: string, valueField: string, colour: Color, stacked: boolean, index: number): ColumnSeries {
    let series = this.charts[index].series.push(ColumnSeries.new(this.roots[index], {
      name: name,
      stacked: stacked,
      xAxis: this.xAxis[index],
      yAxis: this.yAxis[index],
      valueYField: valueField,
      categoryXField: 'CountryName',
      fill: colour
    }));

    // Add tooltip
    series.columns.template.setAll({
      tooltipText: '{name}, {categoryX}: {valueY}',
      tooltipY: percent(10)
    });

    // Create bullets for this series.
    series.bullets.push(() => {
      return Bullet.new(this.roots[index], {
        sprite: Label.new(this.roots[index], {
          text: '{valueY}',
          fill: this.roots[index].interfaceColors.get('alternativeText'),
          centerY: p50,
          centerX: p50,
          populateText: true
        })
      });
    });

    // Hide bullets (the number on the series) if the series data is zero.
    series.columns.template.onPrivate('height', (height, target) => {
      if (target!.dataItem!.bullets!) {
        array.each(target!.dataItem!.bullets!, (bullet) => {
          if (height! > 0) {
            bullet.get('sprite').show();
          }
          else {
            bullet.get('sprite').hide();
          }
        });
      }
    });

    return series;
  }
}
