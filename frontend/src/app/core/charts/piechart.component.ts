import { Component } from '@angular/core';

@Component({
  selector: 'app-pie-chart',
  template: `
    <ngx-charts-pie-chart
      [scheme]="colorScheme"
      [results]="chartData"
      [labels]="true"
      [legend]="true"
      [explodeSlices]="false"
      [doughnut]="false"
    >
    </ngx-charts-pie-chart>
  `,
  styles: []
})
export class PieChartComponent {
  dataBd: any[] = [
    {
      "id": 29,
      "uv": 2,
      "licencia_conducir": 226,
      "permiso_circulacion": 1203,
      "rank_licencia_conducir": 10,
      "rank_permiso_circulacion": 24,
      "created": "2023-07-04T16:08:52.129169",
      "api_call": 9
    },
    {
      "id": 30,
      "uv": 3,
      "licencia_conducir": 268,
      "permiso_circulacion": 3302,
      "rank_licencia_conducir": 1,
      "rank_permiso_circulacion": 12,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    {
      "id": 20,
      "uv": 4,
      "licencia_conducir": 268,
      "permiso_circulacion": 3302,
      "rank_licencia_conducir": 26,
      "rank_permiso_circulacion": 12,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    {
      "id": 24,
      "uv": 10,
      "licencia_conducir": 268,
      "permiso_circulacion": 3302,
      "rank_licencia_conducir": 5,
      "rank_permiso_circulacion": 5,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    }
  ];

  chartData: any[] = [];
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor() {
    this.chartData = this.createChartData();
  }

  createChartData() {
    const pieChartData = [];
    this.dataBd.forEach((item) => {
      const name = `ID ${item.id}`;
      const value = item.rank_licencia_conducir;
      pieChartData.push({ name, value });
    });

    return pieChartData;
  }
}
