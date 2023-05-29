import { Component, ViewEncapsulation } from '@angular/core';
import { Map, tileLayer, polygon, marker } from 'leaflet';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { GeoJSON } from 'leaflet';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';
import { EmpresasServiceService } from 'src/app/service/empresas.service.service';
import { ChangeDetectorRef } from '@angular/core';
import { Options, PointerType } from "@angular-slider/ngx-slider";
import { of } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';


interface unidad_vecinal {
  nombre: any;
  rank?:any;
  lp?: any; // Last Periodo de tiempo
  densidad: any;
  comercial?: any;
}

@Component({
  selector: 'app-vis',
  templateUrl: './vis.component.html',
  styleUrls: ['./vis.component.css'],
  encapsulation: ViewEncapsulation.None,
})


export class VisComponent {

  columnaResaltada: string = 'total';

  fechaInicio: Date;
  fechaInicioFormateada: any;
  fechaFin: Date;
  fechaFinFormateada;

  minValue: number= new Date('2020-01-01').getTime();
  maxValue: number= new Date('2022-12-31').getTime();

  step = (this.maxValue-this.minValue)/100
  minSliderValue:number= new Date('2020-01-01').getTime();
  maxSliderValue:number= new Date('2022-12-31').getTime();

  value: number = this.minSliderValue;
  highValue: number = this.maxSliderValue;
  options: Options = {
    floor: this.minSliderValue,
    ceil: this.maxSliderValue,
    step: this.step,
    noSwitching: true,
    translate: (value: number): string => {
      return this.formatDate(value)
    },
    getPointerColor: (value:number): string => {return '#FC3D59'},
  };

  result: any[];
  map: Map;
  geoJsonLayer: L.GeoJSON;
  densityData: any;
  densityDataRank; any
  comercialData: any;
  empresasData: any[];
  sumByM: {[key: string]: number} = {};
  public maximo:any;

  infoControl: any;
  info: L.Control;

  dataTabla: any=[];

  legend: L.Control;

  dateFlag: boolean = false;

  unidadesVecinales: unidad_vecinal[] = [];
  // dataSource = new MatTableDataSource<unidad_vecinal>(this.unidadesVecinales);
  dataSource = new MatTableDataSource<unidad_vecinal>([...this.unidadesVecinales]);

  formatLabel(value: number): string {
    const texto_label = new Date(value);
    // return `${texto_label}`;
    return `${texto_label.getDate()}-${texto_label.getMonth() + 1}-${texto_label.getFullYear()}`;
  }

  constructor(private http: HttpClient,
              private empresas: EmpresasServiceService,
              ) {

   }



  ngAfterViewInit(): void{

  localStorage.setItem('Columna', 'total')
  this.rangoFechas()

  let geoJsonData: any;  // Definir la variable fuera del método subscribe

  // Realizar ambas solicitudes HTTP en paralelo y esperar a que ambas se completen
  // const gslRequest = this.http.get('../../assets/gsl.json');
  const uvCoordRequest = this.http.get('../../assets/uv_coordenadas.json');
  const empresasTotalByUVRequest = this.empresas.getEmpresasTotalByUV();
  const empresasComercialByUV = this.empresas.getEmpresasComercialByUV();

  forkJoin([uvCoordRequest, empresasTotalByUVRequest, empresasComercialByUV]).subscribe(([uvCoordData, empresasTotalByUVData, empresasComercialByUVData]) => {
    const newData: {[key: string]: number} = {};;
    const comercialData: {[key: string]: number} = {};;
    for (const item of this.densityData) {
      newData[`UV-${item.uv-1}`] = item.densidad;
    }
    for (const item of this.comercialData) {
      comercialData[`UV-${item.uv-1}`] = item.densidad;
    }

    this.maximo = Math.max(...Object.values(newData))
    this.densityData = newData
    for (const [nombre, densidad] of Object.entries(newData)) {
      this.unidadesVecinales.push({ nombre, densidad });
    }
    // this.dataSource.data = this.unidadesVecinales;

    // Lógica relacionada con uvCoordData
    geoJsonData = {
      type: 'FeatureCollection',
      features: Object.keys(uvCoordData).map((key) => {
        const coords = Object.values(uvCoordData[key]);
        const density = this.densityData[key] && this.densityData[key];
        return {
          type: 'Feature',
          properties: {
            "name": key,
            "density": density,
          },
          geometry: {
            type: 'Polygon',
            coordinates: [coords],
          },
        };
      }),
    };

    this.geoJsonLayer.addData(geoJsonData);

    this.legend = new L.Control({ position: 'bottomright' });

    this.updateLegend(this.maximo);

    this.legend.addTo(this.map);


  });

    this.map = new Map('map').setView([-33.416793, -70.662822], 14); // asignar el valor de la variable map

    tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      opacity:0,
      // maxZoom: 14
    }).addTo(this.map); // Usar this.map en lugar de map

    // this.geoJsonLayer = L.geoJSON().addTo(this.map);
    this.geoJsonLayer = L.geoJSON(null, {
      style: style,
      onEachFeature: onEachFeature
    }).addTo(this.map);

    // const image = '../../../assets/PREDIOS_INDEPENDENCIA.mid.Png';
    const image = '../../../assets/PREDIOS_INDEPENDENCIA.neo.Png';
    // const image = '../../../assets/PREDIOS_INDEPENDENCIA.small.Png';
    const imageBounds = L.latLngBounds([[-33.3988667, -70.681777777], [-33.4322444, -70.650155555]]);
    // const imageBounds = L.latLngBounds([[-33.3988667, -70.68177815372947], [-33.43226186336609, -70.65015499735182]]);

    // L.rectangle(imageBounds).addTo(this.map);
    // this.map.fitBounds(imageBounds);

    const imageOptions = {
      opacity: 0.5,
      zIndex: 1,
      attribution: 'Image attribution',
      interactive: true
    };
    L.imageOverlay(image, imageBounds, imageOptions).addTo(this.map);

    const getColor = (d, max=this.maximo) => {

    return d >= 0.8 * max ? '#FC3D59' :
    d >= 0.6 * max ? '#FA527F' :
    d >= 0.4 * max ? '#F886A8' :
    d >= 0.2 * max ? '#FBB5C5' :
    d >= 0   * max ? '#FDE5ED' :
                     '#FFFFFF';
}


    function style(feature) {
      return {
          fillColor: getColor(feature.properties.density),
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.7
      };
    }
function onEachFeature(feature, layer) {
  layer.on({
    mouseover: (e:any) => highlightFeature(e, localStorage.getItem('Columna')),
    mouseout: resetHighlight,

  });
}

function highlightFeature(e:any, columnita: string) {
  const layer: GeoJSON = e.target;

  layer.setStyle({
    weight: 5,
    color: 'black',
    dashArray: '',
    fillOpacity: 0.7
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }

  // console.log((layer.feature as GeoJSON.Feature).properties);
  const properties = (layer.feature as GeoJSON.Feature).properties
  // console.log(properties['density'])

  label.updateContent( '<h4>Patentes de tipo ' + columnita +  '</h4>' + '<b>'+ properties['name'] +'</b>' + '<br />Densidad:' + properties['density'] + '<br />');
}


function resetHighlight(e) {
  const layer: GeoJSON = e.target;
  layer.setStyle({
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.7
  });
}

const info = L.Control.extend({
  onAdd: function(map) {
    const div = L.DomUtil.create('div', 'info');
    div.innerHTML =  '<h4>Impuestos y Derechos </h4>' + '<b>Patentes y sus tipos</b>';
    // Guardar una referencia al div para actualizarlo más tarde
    this._div = div;

    return div;
  },

  updateContent: function(newContent) {
    // Actualizar el contenido del div
    this._div.innerHTML = newContent;
  }
});

const label = new info(); // label es la etiqueta de arriba a la derecha del mapa
label.addTo(this.map);
  }

  getColor2(d, max) {
    max = max || this.maximo; // asignar un valor por defecto para max

    return d >= 0.8 * max ? '#FC3D59' :
    d >= 0.6 * max ? '#FA527F' :
    d >= 0.4 * max ? '#F886A8' :
    d >= 0.2 * max ? '#FBB5C5' :
    d >= 0   * max ? '#FDE5ED' :
                    '#FFFFFF';
    }

updateMapData(newData: {[key: string]: number}) {
  // Calcular el valor máximo en los nuevos datos
  this.maximo = Math.max(...Object.values(newData));

  // Actualizar el contenido de la capa geoJSON
  this.geoJsonLayer.eachLayer((layer: L.Layer) => {
    const feature = (layer as L.GeoJSON).feature as GeoJSON.Feature;
    const key = feature.properties["name"];
    const density = newData[key] && newData[key];
    feature.properties["density"] = density;
    // Actualizar el estilo de la capa
    (layer as L.GeoJSON).setStyle({
      fillColor: this.getColor2(density, this.maximo),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    });
  });
}


tablita(flag) {

  // console.log(this.densityData)

  let densityDataObservable = null;
  let densityDataObservableRank = null;
  let densityDataObservableRankLP = null;
  let comercialObservable = null;

  if (flag === false) {
    densityDataObservable = this.empresas.getEmpresasTotalByUV()
    // densityDataObservable = this.empresas.getEmpresasTotalByUvFecha(this.formatDatedjango(this.minValue),this.formatDatedjango(this.maxValue));
    densityDataObservableRank = this.empresas.getEmpresasTotalByUV()
    densityDataObservableRankLP = this.empresas.getEmpresasTotalByUV()
    comercialObservable = this.empresas.getEmpresasComercialByUV()
  } else {
    console.log(this.fechaInicioFormateada)
    console.log(this.fechaFinFormateada)

    const fechaFinAnterior = new Date(this.fechaFinFormateada);
    fechaFinAnterior.setFullYear(fechaFinAnterior.getFullYear() - 1);
    const fechaInicioUnAnioAntes = fechaFinAnterior.toISOString().split('T')[0];
    // console.log(this.fechaInicioFormateada)
    // console.log(this.minValue)
    // console.log(this.formatDatedjango(this.minValue))
    densityDataObservable = this.empresas.getEmpresasTotalByUvFecha(this.fechaInicioFormateada, this.fechaFinFormateada)
    // densityDataObservable = this.empresas.getEmpresasTotalByUvFecha(this.formatDatedjango(this.minValue),this.formatDatedjango(this.maxValue));
    densityDataObservableRank = this.empresas.getEmpresasTotalByUvFechaRank(this.fechaInicioFormateada, this.fechaFinFormateada)
    densityDataObservableRankLP = this.empresas.getEmpresasTotalByUvFechaRank(this.fechaInicioFormateada, fechaInicioUnAnioAntes)

    comercialObservable =  this.empresas.getEmpresasByUvFechaTipo(this.fechaInicioFormateada, this.fechaFinFormateada,'comercial')


  }

  // console.log(this.densityData)

  forkJoin({
    // comercialData: this.empresas.getEmpresasComercialByUV(),
    comercialData: comercialObservable,
    // densityData: this.empresas.getEmpresasTotalByUV(),
    densityData: densityDataObservable,
    densityDataRank: densityDataObservableRank,
    densityDataRankLP: densityDataObservableRankLP


  }).subscribe(({ comercialData, densityData, densityDataRank, densityDataRankLP}) => {
    // this.dataTabla = this.combineData(comercialData, densityData);
    // console.log(densityData)
    // console.log(densityDataRank)
    this.densityData = densityData
    this.densityDataRank = densityDataRank
    // console.log(this.densityData)
    // console.log(this.densityDataRank)
    // console.log(this.densityData)
    this.comercialData = comercialData

    this.dataTabla.splice(0, this.dataTabla.length);

    for (let i = 0; i < this.densityData.length; i++) {
      // this.dataTabla.push({nombre: Object.keys(this.densityData)[i], densidad: Object.values(this.densityData)[i]})
      this.dataTabla.push({
        nombre: 'UV-' + (densityData[i].uv-1),
        rank: [densityDataRank[i].rank,densityDataRank[i].rank-densityDataRankLP[i].rank],
        lp: densityDataRankLP[i].rank,
        total: densityData[i].densidad,
        comercial: comercialData[i].densidad,
      });
    }

    this.dataSource.data = this.dataTabla.map(item => ({
      nombre: item.nombre,
      rank: item.rank,
      lp: item.lp,
      total: item.total,
      comercial: item.comercial,
    }));

  });
}

// TABLA
displayedColumns: string[] = ['nombre', 'rank', 'lp', 'total', 'comercial'];
display_tabla: any = this.tablita(this.dateFlag);

updateColumn(columna: string) {
  if (columna === "total" && this.dateFlag===false) {
    // console.log(this.densityData)
    this.updateMapData(this.densityData);

  }else if (columna ==="total" && this.dateFlag===true) {
    // console.log(this.densityData)
    const totalData: { [key: string]: number } = {};
    for (const item of this.densityData) {
      totalData[`UV-${item.uv - 1}`] = item.densidad;
    }
    this.updateMapData(totalData);
  } else if (columna === "comercial") {
    const comercialData: { [key: string]: number } = {};
    for (const item of this.comercialData) {
      comercialData[`UV-${item.uv - 1}`] = item.densidad;
    }
    this.updateMapData(comercialData);
  }
}

resaltarColumna(columna: string) {
  // console.log(columna)
  this.columnaResaltada = columna;
  localStorage.setItem('Columna',columna)
  this.updateColumn(columna);
  // this.updateLegend(1408)
  this.onMaxValueChanged(this.maximo)
  this.rangoFechas()



}

updateLegend(valorMaximo: number): void {
  this.legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    const factors = [0, 0.2, 0.4, 0.6, 0.8];
    var grades = factors.map((factor) => Number((valorMaximo * factor).toFixed(0)));
    var labels = [];

    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColorLegend(grades[i] + 1, valorMaximo) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '&ndash;'+valorMaximo);
    }

    return div;
  };
}

  // Llama a esta función cada vez que el valor máximo cambie
  onMaxValueChanged(newValue: number): void {
    this.maximo = newValue;
    this.legend.remove();
    this.updateLegend(this.maximo);
    this.legend.addTo(this.map);
  }

// ASOCIADO A LA FECHA
buscar() {
  const fechaInicio = new Date(this.fechaInicio.getTime());
  const fechaFin = new Date(this.fechaFin.getTime());
  const fechaInicioF = `${fechaInicio.getFullYear()}-${fechaInicio.getMonth() + 1}-${fechaInicio.getDate()}`;
  const fechaFinF = `${fechaFin.getFullYear()}-${fechaFin.getMonth() + 1}-${fechaFin.getDate()}`;
  // Actualizar el rango del slider
  this.minValue = this.fechaInicio.getTime()
  this.maxValue = this.fechaFin.getTime();

  this.value = this.fechaInicio.getTime()
  this.highValue = this.fechaFin.getTime();
  this.options = {
    floor: this.minValue,
    ceil: this.maxValue,
    step: this.step,
    noSwitching: true,
    translate: (value: number): string => {
      return this.formatDate(value);
    },
    getPointerColor: (value: number): string => {
      return '#FC3D59';
    },
  }
  // this.options.ceil = this.fechaFin.getTime();

  this.fechaInicioFormateada = fechaInicioF
  this.fechaFinFormateada = fechaFinF

  this.dateFlag = true
  this.tablita(true)
  this.resaltarColumna(localStorage.getItem('Columna'))

}

  // Función para convertir milisegundos en una cadena de fecha legible
  formatDate(milliseconds: number): string {
    const date = new Date(milliseconds);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  }

  formatDatedjango(milliseconds: number): string {
    const date = new Date(milliseconds);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }


  onSliderChange(event) {
    if (event.pointerType === PointerType.Min) {
      const minValue = event.value;
      const formattedMinValue = this.formatDate(minValue);
      const formattedMinValueDJ = this.formatDatedjango(minValue)
      this.fechaInicioFormateada = formattedMinValueDJ
      // console.log(this.fechaInicioFormateada)
      this.dateFlag = true;
      this.tablita(true)
      this.resaltarColumna(localStorage.getItem('Columna'))

      // console.log('Valor del slider mínimo:', formattedMinValue);
    } else if (event.pointerType === PointerType.Max) {
      const maxValue = event.highValue;
      const formattedMaxValue = this.formatDate(maxValue);
      const formattedMaxValueDJ = this.formatDatedjango(maxValue)
      this.fechaFinFormateada = formattedMaxValueDJ
      this.dateFlag = true
      this.tablita(true)
      this.resaltarColumna(localStorage.getItem('Columna'))
      // console.log('Valor del slider máximo:', formattedMaxValue);
    }
  }

rangoFechas() {
  this.empresas.getRangoFechasByTipo(this.columnaResaltada).subscribe(
    (data) => {
      this.fechaInicio = new Date(data.fecha_inicio)
      this.fechaFin = new Date(data.fecha_fin)

    },
    (error) => {
      // Manejo de errores
      console.error(error);
    }
  );
  // this.buscar()
}

selectMapa() {
  console.log('map')
}

}


function getColorLegend(d, max: number) {
  max = max || this.maximo; // asignar un valor por defecto para max
return d >= 0.8 * max ? '#FC3D59' :
d >= 0.6 * max ? '#FA527F' :
d >= 0.4 * max ? '#F886A8' :
d >= 0.2 * max ? '#FBB5C5' :
d >= 0   * max ? '#FDE5ED' :
                 '#FFFFFF';
}
