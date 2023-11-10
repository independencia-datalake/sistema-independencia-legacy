import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';
import { DataLabService } from 'src/app/service/data-lab.service';
import { EmpresasServiceService } from 'src/app/service/empresas.service.service';

@Component({
  selector: 'app-barchart',
  template: `
  <ngx-charts-bar-vertical
        [view]="view"
        [scheme]="colorScheme"
        [results]="single"
        [gradient]="gradient"
        [xAxis]="showXAxis"
        [yAxis]="showYAxis"
        [legend]="showLegend"
        [showDataLabel]="showDataLabel"
        [showXAxisLabel]="showXAxisLabel"
        [showYAxisLabel]="showYAxisLabel"
        [xAxisLabel]="xAxisLabel"
        [yAxisLabel]="yAxisLabel"
        [barPadding]="2"
        [dataLabelFormatting]="dataLabelFormattingFunc"
    >
    </ngx-charts-bar-vertical>`,
    styleUrls: ['./charts.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class BarChartComponent {
  key_columna = localStorage.getItem('Columna')
//   key_columna = "alcohol"
  public diccionario_columna = {
    'total': 'Total',
    'alcohol': 'Alcohol',
    'comercial': 'Comercial',
    'profesional': 'Profesional',
    'industrial': 'Industrial',
    'microempresa': 'Microempresa',
    'estacionada': 'Estacionada',

    'licencia conducir': 'Licencia de Conducir',
    'permiso circulacion': 'Permisos de Circulacion',
  };
  public diccionario_columna_y = {
    'total': 'Patentes totales',
    'alcohol': 'Patentes de Alcohol',
    'comercial': 'Patentes Comerciales',
    'profesional': 'Patentes Profesionales',
    'industrial': 'Patentes Industriales',
    'microempresa': 'Patentes Microempresas',
    'estacionada': 'Patentes Estacionadas',

    'licencia conducir': 'Licencias de Conducir',
    'permiso circulacion': 'Permisos de Circulacion',
  };

  mapaDict = {
    "impuestos y derechos": ["total", "alcohol", "comercial", "profesional", "industrial", "microempresa", "estacionada"],
    "transito": ["licencias", "permisos"],
    "obras municipales": ["obrasmenores", "anulacion"]
};

@Input() dataBd: any[];

  // chartdataBd: any[]
  chartDataByType: { [key: string]: any[] } = {};

  ngOnInit() {
    this.empresas.getEmpresasRankDataLab().subscribe(data => {
        this.generateDataBd("impuestos y derechos", data);
        this.single = this.createChartData(this.key_columna);
        // Aquí puedes hacer cualquier otra cosa con los datos
    });



    this.generateDataBd
}

    single: any[];
    multi: any[];

    view: [number, number] = [1000, 600];
    padding: number = 8;

    // options
    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = true;
    showDataLabel = true;
    showXAxisLabel = true;
    xAxisLabel = 'Unidad Vecinal';
    showYAxisLabel = true;
    yAxisLabel = this.diccionario_columna_y[this.key_columna];

    colorScheme : any= {
        domain: ['#D4AF37', '#C0C0C0', '#CD7F32',]
    };

    constructor(private empresas: DataLabService) {
        // this.single = this.createChartData();
        // console.log(this.single)
    }

    onSelect(event) {
        console.log(event);
    }

    generateDataBd(key: string, data: any) {
      const categories = this.mapaDict[key];

      categories.forEach((category) => {
        const categoryData = data[category];
        const result = [];

        categoryData.forEach((item, idx) => {
          const value = item[category] === 0 ? 0.001 : item[category];
          result.push({
            "name": "uv-" + (item.uv - 1),
            "value": value
          });
        });

        this.chartDataByType[category] = result; // Almacenar los datos en el objeto
      });
    }

    ngOnChanges() {
      if (this.chartDataByType) { // Asegúrate de que chartDataByType está lleno
        this.key_columna = localStorage.getItem('Columna'); // Obtener el tipo seleccionado del almacenamiento local
        this.yAxisLabel = this.diccionario_columna_y[this.key_columna];
        this.single = this.createChartData(this.key_columna); // Establecer 'single' con los datos para el tipo seleccionado
      }
    }


  createChartData(selectedItem: string) {
    const selectedName = this.diccionario_columna[selectedItem].toLowerCase(); // Obtener el nombre legible para el ítem seleccionado

    // Recuperar los datos del objeto usando la clave
    console.log(this.chartDataByType)
    const filteredData = this.chartDataByType[selectedName];

    if (filteredData) {
      // Ordenar los datos y tomar el top 26
      return filteredData.sort((a, b) => b.value - a.value).slice(0, 26);
    } else {
      return []; // Devolver un array vacío si no hay datos para ese tipo
    }
  }

  dataLabelFormattingFunc(value: any): string {
    return value === 0.001 ? '0' : value.toString();
  }

}
