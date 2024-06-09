import { Component } from '@angular/core';

@Component({
  selector: 'app-area-chart-stacked',
  template: `
  <ngx-charts-area-chart-stacked
  [results]="stackedAreaChartData"
  [gradient]="true"
  [xAxis]="true"
  [yAxis]="true"
  [legend]="true"
  [showXAxisLabel]="true"
  [showYAxisLabel]="true"
  [xAxisLabel]="'Date'"
  [yAxisLabel]="'Value'">
</ngx-charts-area-chart-stacked>


  `,
  styleUrls: ['./charts.component.css'],
})
export class AreaChartStackedComponent {


  dataBd:any = [
    {
      "name": "Alcohol",
      "series": [
        {
          "value": 5571,
          "name": "2016-09-19T23:05:33.900Z"
        },
        {
          "value": 5868,
          "name": "2016-09-18T07:55:22.748Z"
        },
        {
          "value": 5511,
          "name": "2016-09-18T18:28:44.071Z"
        },
        {
          "value": 3334,
          "name": "2016-09-19T19:07:04.888Z"
        },
        {
          "value": 6920,
          "name": "2016-09-18T11:12:47.859Z"
        }
      ]
    },
    {
      "name": "Comercial",
      "series": [
        {
          "value": 3066,
          "name": "2016-09-19T23:05:33.900Z"
        },
        {
          "value": 3855,
          "name": "2016-09-18T07:55:22.748Z"
        },
        {
          "value": 6354,
          "name": "2016-09-18T18:28:44.071Z"
        },
        {
          "value": 3990,
          "name": "2016-09-19T19:07:04.888Z"
        },
        {
          "value": 4009,
          "name": "2016-09-18T11:12:47.859Z"
        }
      ]
    },
    {
      "name": "Profesional",
      "series": [
        {
          "value": 2445,
          "name": "2016-09-19T23:05:33.900Z"
        },
        {
          "value": 4578,
          "name": "2016-09-18T07:55:22.748Z"
        },
        {
          "value": 3439,
          "name": "2016-09-18T18:28:44.071Z"
        },
        {
          "value": 6801,
          "name": "2016-09-19T19:07:04.888Z"
        },
        {
          "value": 6850,
          "name": "2016-09-18T11:12:47.859Z"
        }
      ]
    },
    {
      "name": "Industrial",
      "series": [
        {
          "value": 6736,
          "name": "2016-09-19T23:05:33.900Z"
        },
        {
          "value": 3332,
          "name": "2016-09-18T07:55:22.748Z"
        },
        {
          "value": 5646,
          "name": "2016-09-18T18:28:44.071Z"
        },
        {
          "value": 6714,
          "name": "2016-09-19T19:07:04.888Z"
        },
        {
          "value": 3147,
          "name": "2016-09-18T11:12:47.859Z"
        }
      ]
    },
    {
      "name": "Microempresa",
      "series": [
        {
          "value": 3363,
          "name": "2016-09-19T23:05:33.900Z"
        },
        {
          "value": 3841,
          "name": "2016-09-18T07:55:22.748Z"
        },
        {
          "value": 3744,
          "name": "2016-09-18T18:28:44.071Z"
        },
        {
          "value": 3750,
          "name": "2016-09-19T19:07:04.888Z"
        },
        {
          "value": 5838,
          "name": "2016-09-18T11:12:47.859Z"
        }
      ]
    },
    {
      "name": "Estacionada",
      "series": [
        {
          "value": 3163,
          "name": "2016-09-19T23:05:33.900Z"
        },
        {
          "value": 3791,
          "name": "2016-09-18T07:55:22.748Z"
        },
        {
          "value": 3834,
          "name": "2016-09-18T18:28:44.071Z"
        },
        {
          "value": 3753,
          "name": "2016-09-19T19:07:04.888Z"
        },
        {
          "value": 5821,
          "name": "2016-09-18T11:12:47.859Z"
        }
      ]
    },

  ]


  stackedAreaChartData:any[];
  chartData: any[] = [];


  constructor() {
    this.stackedAreaChartData = this.transformData(this.dataBd);
  }
  transformData(dataBd: any[]) {
    const transformedData = [];

    for (let item of dataBd) {
      const series = item.series.map(s => {
        return {
          // name: new Date(s.name).toLocaleDateString(),
          name: s.name,
          value: s.value
        };
      });
      transformedData.push({
        name: item.name,
        series: series
      });
    }

    return transformedData;
  }
}





