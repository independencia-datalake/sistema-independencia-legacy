import { Component } from '@angular/core';

@Component({
  selector: 'app-pie-chart-compare',
  template: `
    <ngx-charts-pie-chart
      [results]="chartData"
      [labels]="true"
      [legend]="false"
      [explodeSlices]="true"
      [doughnut]="false"
    >
    </ngx-charts-pie-chart>
  `,
  styleUrls: ['./charts.component.css'],
})
export class PieChartCompareComponent {
  dataBd:any = [
    {
      "id": 1,
      "uv": 1,
      "licencia_conducir":Math.floor(Math.random() * 10000000),
      "permiso_circulacion": Math.floor(Math.random() * 10000000),
      "rank_licencia_conducir": Math.floor(Math.random() * 10000000),
      "rank_permiso_circulacion": 1,
      "created": "2023-07-04T16:08:52.129169",
      "api_call": 9
    },
    {
      "id": 3,
      "uv": 3,
      "licencia_conducir":Math.floor(Math.random() * 10000000),
      "permiso_circulacion": Math.floor(Math.random() * 10000000),
      "rank_licencia_conducir": Math.floor(Math.random() * 10000000),
      "rank_permiso_circulacion": 3,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    {
      "id": 4,
      "uv": 4,
      "licencia_conducir":Math.floor(Math.random() * 10000000),
      "permiso_circulacion": Math.floor(Math.random() * 10000000),
      "rank_licencia_conducir": Math.floor(Math.random() * 10000000),
      "rank_permiso_circulacion": 4,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    {
      "id": 2,
      "uv": 2,
      "licencia_conducir":Math.floor(Math.random() * 10000000),
      "permiso_circulacion": Math.floor(Math.random() * 10000000),
      "rank_licencia_conducir": Math.floor(Math.random() * 10000000),
      "rank_permiso_circulacion": 2,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    {
      "id": 8,
      "uv": 8,
      "licencia_conducir":Math.floor(Math.random() * 10000000),
      "permiso_circulacion": Math.floor(Math.random() * 10000000),
      "rank_licencia_conducir": Math.floor(Math.random() * 10000000),
      "rank_permiso_circulacion": 8,
      "created": "2023-07-04T16:08:52.129169",
      "api_call": 9
    },
    {
      "id": 6,
      "uv": 6,
      "licencia_conducir":Math.floor(Math.random() * 10000000),
      "permiso_circulacion": Math.floor(Math.random() * 10000000),
      "rank_licencia_conducir": Math.floor(Math.random() * 10000000),
      "rank_permiso_circulacion": 6,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    {
      "id": 7,
      "uv": 7,
      "licencia_conducir":Math.floor(Math.random() * 10000000),
      "permiso_circulacion": Math.floor(Math.random() * 10000000),
      "rank_licencia_conducir": Math.floor(Math.random() * 10000000),
      "rank_permiso_circulacion": 7,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    {
      "id": 9,
      "uv": 9,
      "licencia_conducir":Math.floor(Math.random() * 10000000),
      "permiso_circulacion": Math.floor(Math.random() * 10000000),
      "rank_licencia_conducir": Math.floor(Math.random() * 10000000),
      "rank_permiso_circulacion": 9,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    {
      "id": 10,
      "uv": 10,
      "licencia_conducir":Math.floor(Math.random() * 10000000),
      "permiso_circulacion": Math.floor(Math.random() * 10000000),
      "rank_licencia_conducir": Math.floor(Math.random() * 10000000),
      "rank_permiso_circulacion": 10,
      "created": "2023-07-04T16:08:52.129169",
      "api_call": 9
    },
    {
      "id": 11,
      "uv": 11,
      "licencia_conducir":Math.floor(Math.random() * 10000000),
      "permiso_circulacion": Math.floor(Math.random() * 10000000),
      "rank_licencia_conducir": Math.floor(Math.random() * 10000000),
      "rank_permiso_circulacion": 11,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    {
      "id": 12,
      "uv": 12,
      "licencia_conducir":Math.floor(Math.random() * 10000000),
      "permiso_circulacion": Math.floor(Math.random() * 10000000),
      "rank_licencia_conducir": Math.floor(Math.random() * 10000000),
      "rank_permiso_circulacion": 12,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    {
      "id": 13,
      "uv": 13,
      "licencia_conducir":Math.floor(Math.random() * 10000000),
      "permiso_circulacion": Math.floor(Math.random() * 10000000),
      "rank_licencia_conducir": Math.floor(Math.random() * 10000000),
      "rank_permiso_circulacion": 13,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    {
      "id": 14,
      "uv": 14,
      "licencia_conducir":Math.floor(Math.random() * 10000000),
      "permiso_circulacion": Math.floor(Math.random() * 10000000),
      "rank_licencia_conducir": Math.floor(Math.random() * 10000000),
      "rank_permiso_circulacion": 14,
      "created": "2023-07-04T16:08:52.129169",
      "api_call": 9
    },
    {
      "id": 15,
      "uv": 15,
      "licencia_conducir":Math.floor(Math.random() * 10000000),
      "permiso_circulacion": Math.floor(Math.random() * 10000000),
      "rank_licencia_conducir": Math.floor(Math.random() * 10000000),
      "rank_permiso_circulacion": 15,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    {
      "id": 16,
      "uv": 16,
      "licencia_conducir":Math.floor(Math.random() * 10000000),
      "permiso_circulacion": Math.floor(Math.random() * 10000000),
      "rank_licencia_conducir": Math.floor(Math.random() * 10000000),
      "rank_permiso_circulacion": 16,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    {
      "id": 17,
      "uv": 17,
      "licencia_conducir":Math.floor(Math.random() * 10000000),
      "permiso_circulacion": Math.floor(Math.random() * 10000000),
      "rank_licencia_conducir": Math.floor(Math.random() * 10000000),
      "rank_permiso_circulacion": 17,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    {
      "id": 18,
      "uv": 18,
      "licencia_conducir":Math.floor(Math.random() * 10000000),
      "permiso_circulacion": Math.floor(Math.random() * 10000000),
      "rank_licencia_conducir": Math.floor(Math.random() * 10000000),
      "rank_permiso_circulacion": 18,
      "created": "2023-07-04T16:08:52.129169",
      "api_call": 9
    },
    {
      "id": 19,
      "uv": 19,
      "licencia_conducir":Math.floor(Math.random() * 10000000),
      "permiso_circulacion": Math.floor(Math.random() * 10000000),
      "rank_licencia_conducir": Math.floor(Math.random() * 10000000),
      "rank_permiso_circulacion": 19,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    {
      "id": 20,
      "uv": 20,
      "licencia_conducir":Math.floor(Math.random() * 10000000),
      "permiso_circulacion": Math.floor(Math.random() * 10000000),
      "rank_licencia_conducir": Math.floor(Math.random() * 10000000),
      "rank_permiso_circulacion": 20,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    {
      "id": 21,
      "uv": 21,
      "licencia_conducir":Math.floor(Math.random() * 10000000),
      "permiso_circulacion": Math.floor(Math.random() * 10000000),
      "rank_licencia_conducir": Math.floor(Math.random() * 10000000),
      "rank_permiso_circulacion": 21,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    {
      "id": 22,
      "uv": 22,
      "licencia_conducir":Math.floor(Math.random() * 10000000),
      "permiso_circulacion": Math.floor(Math.random() * 10000000),
      "rank_licencia_conducir": Math.floor(Math.random() * 10000000),
      "rank_permiso_circulacion": 22,
      "created": "2023-07-04T16:08:52.129169",
      "api_call": 9
    },
    {
      "id": 23,
      "uv": 23,
      "licencia_conducir":Math.floor(Math.random() * 10000000),
      "permiso_circulacion": Math.floor(Math.random() * 10000000),
      "rank_licencia_conducir": Math.floor(Math.random() * 10000000),
      "rank_permiso_circulacion": 23,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    {
      "id": 24,
      "uv": 24,
      "licencia_conducir":Math.floor(Math.random() * 10000000),
      "permiso_circulacion": Math.floor(Math.random() * 10000000),
      "rank_licencia_conducir": Math.floor(Math.random() * 10000000),
      "rank_permiso_circulacion": 24,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    {
      "id": 25,
      "uv": 25,
      "licencia_conducir":Math.floor(Math.random() * 10000000),
      "permiso_circulacion": Math.floor(Math.random() * 10000000),
      "rank_licencia_conducir": Math.floor(Math.random() * 10000000),
      "rank_permiso_circulacion": 25,
      "created": "2023-07-04T16:08:52.134417",
      "api_call": 9
    },
    {
      "id": 26,
      "uv": 26,
      "licencia_conducir":Math.floor(Math.random() * 10000000),
      "permiso_circulacion": Math.floor(Math.random() * 10000000),
      "rank_licencia_conducir": Math.floor(Math.random() * 10000000),
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
    this.chartData = this.createChartData(10);
  }

  createChartData(uvFilter) {
    const pieChartData = [];
    this.dataBd.forEach((item) => {
      if(uvFilter === item.uv){
        const namelc = `Licencia de Conducir`;
        const namepc = `Permiso de Circulación`;
        const valuelc = item.licencia_conducir;
        const valuepc = item.permiso_circulacion;
        pieChartData.push({ name:namelc, value:valuelc });
        pieChartData.push({ name:namepc, value:valuepc });
      }
    });

    return pieChartData;
  }
}
