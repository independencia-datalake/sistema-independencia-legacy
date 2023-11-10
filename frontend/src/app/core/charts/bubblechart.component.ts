import { Component, Input } from '@angular/core';
import { MapaLegacyService } from 'src/app/service/mapa-legacy.service';

@Component({
  selector: 'app-bubble-chart',
  template: `
  <ngx-charts-bubble-chart
  [results]="bubbleChartData"
  [animations]="true"
  [xAxis]="true"
  [yAxis]="true"
  [legend]="false"
  [showXAxisLabel]="true"
  [showYAxisLabel]="true"
  [xAxisLabel]="'Poblacion'"
  [yAxisLabel]="'Superficie'"
  [scheme]="colorScheme"
  [maxRadius]="15"
  >
</ngx-charts-bubble-chart>


  `,
  styleUrls: ['./charts.component.css'],
})
export class BubbleChartComponent {
@Input() visdata: any;
  key_columna = localStorage.getItem('Columna')
  // dataBd:any = []

  bubbleChartData:any[];
  chartData: any[] = [];
  poblacionData: any = []


  constructor(private poblacion: MapaLegacyService) {
    // this.bubbleChartData = this.transformBubbleData(this.dataBd);
  }

  ngOnInit(): void {
    this.poblacion.getPoblacionUV().subscribe(
      (data) => {
        this.poblacionData = data;
      },
      (error) => {
        console.error('Ocurrió un error al obtener los datos', error);
      }
    );
  }

  transformBubbleData(dataBd: any[]) {
    const transformedData = [];

    // Agrupar los datos por UV
    for (const item of dataBd) {
      const series = [
        {
          name: 'Población',
          x: item.poblacion,
          y: item.superficie,
          r: item.total
        }
      ];

      transformedData.push({
        name: `UV ${item.uv}`,
        series: series
      });
    }

    return transformedData;
  }
  colorScheme:any = {
    domain: ['#00ffff', '#ff00ff', '#ffff00']
  };

  ngOnChanges() {
    this.key_columna = localStorage.getItem('Columna'); // Obtener el tipo de columna seleccionado

    if (this.key_columna === "licencia conducir") {
      this.key_columna = "licencia_conducir";
  } else if (this.key_columna === "permiso circulacion") {
      this.key_columna = "permiso_circulacion";
  }


    // Inicializar el array que contendrá los nuevos datos
    let newDataBd = [];

    // Asumiendo que poblacionData y visdata están indexados por UV (pero visdata tiene una UV-0 adicional)
    for (let i = 0; i < this.poblacionData.length; i++) {
      let poblacionItem = this.poblacionData[i];
      let visdataItem = this.visdata[i + 1]; // +1 para omitir la UV-0 en visdata

      // Combinar los datos
      let combinedData = {
        id: poblacionItem.id,
        uv: poblacionItem.id, // Asumiendo que id es igual a UV
        created: "2023-07-04T16:08:52.129169", // Puedes cambiar esto si tienes una fecha real
        api_call: 9, // Fijo a 9 según tu ejemplo
        total: visdataItem[this.key_columna], // Obtener el valor de la columna seleccionada de visdata
        poblacion: poblacionItem.total, // Población total de poblacionData
        superficie: poblacionItem.superficie // Superficie de poblacionData
      };

      newDataBd.push(combinedData);
    }

    // Ahora newDataBd contiene la información combinada.
    // Llamar a transformBubbleData para actualizar el gráfico
    this.bubbleChartData = this.transformBubbleData(newDataBd);
  }

}





