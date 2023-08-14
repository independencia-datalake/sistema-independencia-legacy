import { Component } from '@angular/core';

@Component({
  selector: 'app-pie-chart',
  template: `
    <ngx-charts-pie-chart
      [results]="chartData"
      [labels]="true"
      [legend]="true"
      [explodeSlices]="false"
      [doughnut]="false"
    >
    </ngx-charts-pie-chart>
  `,
  styleUrls: ['./charts.component.css'],
})
export class PieChartComponent {
  dataBd:any = [
    {
      "id": 1,
      "uv": 1,
      "licencia_conducir": 1,
      "permiso_circulacion": 1,
      "rank_licencia_conducir": 1,
      "rank_permiso_circulacion": 1,
      "created": "2023-07-04T16:08:52.129169",
      "api_call": 9
    },
    {
      "id": 3,
      "uv": 3,
      "licencia_conducir": 3,
      "permiso_circulacion": 3,
      "rank_licencia_conducir": 3,
      "rank_permiso_circulacion": 3,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    {
      "id": 4,
      "uv": 4,
      "licencia_conducir": 4,
      "permiso_circulacion": 4,
      "rank_licencia_conducir": 4,
      "rank_permiso_circulacion": 4,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    {
      "id": 2,
      "uv": 2,
      "licencia_conducir": 2,
      "permiso_circulacion": 2,
      "rank_licencia_conducir": 2,
      "rank_permiso_circulacion": 2,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    {
      "id": 8,
      "uv": 8,
      "licencia_conducir": 8,
      "permiso_circulacion": 8,
      "rank_licencia_conducir": 8,
      "rank_permiso_circulacion": 8,
      "created": "2023-07-04T16:08:52.129169",
      "api_call": 9
    },
    {
      "id": 6,
      "uv": 6,
      "licencia_conducir": 6,
      "permiso_circulacion": 6,
      "rank_licencia_conducir": 6,
      "rank_permiso_circulacion": 6,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    {
      "id": 7,
      "uv": 7,
      "licencia_conducir": 7,
      "permiso_circulacion": 7,
      "rank_licencia_conducir": 7,
      "rank_permiso_circulacion": 7,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    {
      "id": 9,
      "uv": 9,
      "licencia_conducir": 9,
      "permiso_circulacion": 9,
      "rank_licencia_conducir": 9,
      "rank_permiso_circulacion": 9,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    {
      "id": 10,
      "uv": 10,
      "licencia_conducir": 10,
      "permiso_circulacion": 10,
      "rank_licencia_conducir": 10,
      "rank_permiso_circulacion": 10,
      "created": "2023-07-04T16:08:52.129169",
      "api_call": 9
    },
    {
      "id": 11,
      "uv": 11,
      "licencia_conducir": 11,
      "permiso_circulacion": 11,
      "rank_licencia_conducir": 11,
      "rank_permiso_circulacion": 11,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    {
      "id": 12,
      "uv": 12,
      "licencia_conducir": 12,
      "permiso_circulacion": 12,
      "rank_licencia_conducir": 12,
      "rank_permiso_circulacion": 12,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    {
      "id": 13,
      "uv": 13,
      "licencia_conducir": 13,
      "permiso_circulacion": 13,
      "rank_licencia_conducir": 13,
      "rank_permiso_circulacion": 13,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    {
      "id": 14,
      "uv": 14,
      "licencia_conducir": 14,
      "permiso_circulacion": 14,
      "rank_licencia_conducir": 14,
      "rank_permiso_circulacion": 14,
      "created": "2023-07-04T16:08:52.129169",
      "api_call": 9
    },
    {
      "id": 15,
      "uv": 15,
      "licencia_conducir": 15,
      "permiso_circulacion": 15,
      "rank_licencia_conducir": 15,
      "rank_permiso_circulacion": 15,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    {
      "id": 16,
      "uv": 16,
      "licencia_conducir": 16,
      "permiso_circulacion": 16,
      "rank_licencia_conducir": 16,
      "rank_permiso_circulacion": 16,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    {
      "id": 17,
      "uv": 17,
      "licencia_conducir": 17,
      "permiso_circulacion": 17,
      "rank_licencia_conducir": 17,
      "rank_permiso_circulacion": 17,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    {
      "id": 18,
      "uv": 18,
      "licencia_conducir": 18,
      "permiso_circulacion": 18,
      "rank_licencia_conducir": 18,
      "rank_permiso_circulacion": 18,
      "created": "2023-07-04T16:08:52.129169",
      "api_call": 9
    },
    {
      "id": 19,
      "uv": 19,
      "licencia_conducir": 19,
      "permiso_circulacion": 19,
      "rank_licencia_conducir": 19,
      "rank_permiso_circulacion": 19,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    {
      "id": 20,
      "uv": 20,
      "licencia_conducir": 20,
      "permiso_circulacion": 20,
      "rank_licencia_conducir": 20,
      "rank_permiso_circulacion": 20,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    {
      "id": 21,
      "uv": 21,
      "licencia_conducir": 21,
      "permiso_circulacion": 21,
      "rank_licencia_conducir": 21,
      "rank_permiso_circulacion": 21,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    {
      "id": 22,
      "uv": 22,
      "licencia_conducir": 22,
      "permiso_circulacion": 22,
      "rank_licencia_conducir": 22,
      "rank_permiso_circulacion": 22,
      "created": "2023-07-04T16:08:52.129169",
      "api_call": 9
    },
    {
      "id": 23,
      "uv": 23,
      "licencia_conducir": 23,
      "permiso_circulacion": 23,
      "rank_licencia_conducir": 23,
      "rank_permiso_circulacion": 23,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    {
      "id": 24,
      "uv": 24,
      "licencia_conducir": 24,
      "permiso_circulacion": 24,
      "rank_licencia_conducir": 24,
      "rank_permiso_circulacion": 24,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    {
      "id": 25,
      "uv": 25,
      "licencia_conducir": 25,
      "permiso_circulacion": 25,
      "rank_licencia_conducir": 25,
      "rank_permiso_circulacion": 25,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    {
      "id": 26,
      "uv": 26,
      "licencia_conducir": 26,
      "permiso_circulacion": 26,
      "rank_licencia_conducir": 26,
      "rank_permiso_circulacion": 26,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    
  ]

  chartData: any[] = [];
  colorScheme:any = {
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
