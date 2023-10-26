import { Component, Input } from '@angular/core';
import { DataLabService } from 'src/app/service/data-lab.service';

@Component({
  selector: 'app-pie-chart',
  template: `
    <ngx-charts-pie-chart
      [results]="chartData"
      [labels]="false"
      [legend]="false"
      [explodeSlices]="false"
      [doughnut]="false"
    >
    </ngx-charts-pie-chart>
  `,
  styleUrls: ['./charts.component.css'],
})
export class PieChartComponent {
  key_columna = localStorage.getItem('Columna')
  diccionario_columna = {
    'total': 'total',
    'hombres': 'hombres',
    'mujeres': 'mujeres',
    'porcentaje_inmigrante': 'porcentaje_inmigrante',
    'superficie_total': 'superficie_total',
    'superficie_no_habitada': 'superficie_no_habitada',
    'superficie': 'superficie',
    'densidad_habitantekm2': 'densidad_habitantekm2',
    'ventas': 'ventas',
    'alcohol': 'alcohol',
    'comercial': 'comercial',
    'profesional': 'profesional',
    'industrial': 'industrial',
    'microempresa': 'microempresa',
    'estacionada': 'estacionada',
    'porciento50': 'porciento50',
    'porciento75': 'porciento75',
    'porciento100': 'porciento100',
    'anexion': 'anexion',
    'antiguas': 'antiguas',
    'anulacion': 'anulacion',
    'cambio de destino': 'cambio_destino',
    'fusion': 'fusion',
    'ley 20.898': 'ley_20898',
    'obras menores': 'obrasmenores',
    'permisos de edificacion': 'permisosedificacion',
    'recepcion final': 'recepcionfinal',
    'regularizaciones': 'regularizaciones',
    'regularizaciones ley 18.591': 'regularizaciones18591',
    'resolucion': 'resolucion',
    'subdivisiones': 'subdivisiones',
    'ventas por piso': 'ventasporpiso',
    'licencia conducir': 'licencia_conducir',
    'permiso circulacion': 'permiso_circulacion'
  };

@Input() dataBd: any;
  chartData: any[] = [];
  colorScheme:any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(private dataLabService: DataLabService) {
    // console.log(this.dataBd)
    // this.chartData = this.createChartData();
  }

  ngOnChanges() {
    if (this.dataBd) {
      this.key_columna = localStorage.getItem('Columna')
      this.chartData = this.createChartData();
    }
  }

  createChartData() {
    // console.log(this.dataBd2)
    const pieChartData = [];
    this.dataBd.forEach((item) => {
      const name = item.nombre;
      const value = item[this.diccionario_columna[this.key_columna]];
      // const value = item.licencia_conducir;

      pieChartData.push({ name, value });
    });
    return pieChartData;
  }
}
