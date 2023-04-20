import { Component, ViewEncapsulation } from '@angular/core';
import { Map, tileLayer, polygon, marker } from 'leaflet';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { GeoJSON } from 'leaflet';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { EmpresasServiceService } from 'src/app/service/empresas.service.service';
import { ChangeDetectorRef } from '@angular/core';

interface unidad_vecinal {
  nombre: any;
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

  fechaInicio: Date;
  fechaFin: Date;
  minValue: number;
  maxValue: number;
  sliderValue: number[] = [0, 100];

  result: any[];
  map: Map;
  geoJsonLayer: L.GeoJSON;
  densityData: any;
  comercialData: any;
  gslData: any[];
  empresasData: any[];
  sumByM: {[key: string]: number} = {};
  public maximo:any = 101;

  infoControl: any;
  info: L.Control;

  dataTabla: any=[];

  unidadesVecinales: unidad_vecinal[] = [];
  // dataSource = new MatTableDataSource<unidad_vecinal>(this.unidadesVecinales);
  dataSource = new MatTableDataSource<unidad_vecinal>([...this.unidadesVecinales]);

  constructor(private http: HttpClient,
              private empresas: EmpresasServiceService,
              private cdr: ChangeDetectorRef,
              ) {
   }



  ngAfterViewInit(): void{
    let geoJsonData: any;  // Definir la variable fuera del método subscribe

  // Realizar ambas solicitudes HTTP en paralelo y esperar a que ambas se completen
  const gslRequest = this.http.get('../../assets/gsl.json');
  const uvCoordRequest = this.http.get('../../assets/uv_coordenadas.json');
  const empresasTotalByUVRequest = this.empresas.getEmpresasTotalByUV();
  const empresasComercialByUV = this.empresas.getEmpresasComercialByUV();

  forkJoin([gslRequest, uvCoordRequest, empresasTotalByUVRequest, empresasComercialByUV]).subscribe(([gslData, uvCoordData, empresasTotalByUVData, empresasComercialByUVData]) => {
    const newData: {[key: string]: number} = {};;
    const comercialData: {[key: string]: number} = {};;
    for (const item of this.densityData) {
      newData[`UV-${item.uv-1}`] = item.densidad;
    }
    for (const item of this.comercialData) {
      comercialData[`UV-${item.uv-1}`] = item.densidad;
    }

    // Lógica relacionada con gslData
    this.gslData = gslData as any[];
    // this.sumByM = this.aporteEconomicoUV(this.gslData);
    // console.log(this.sumByM)
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

    var legend = new L.Control({position: 'bottomright'})
    const valorMaximo = this.maximo;
    const factors = [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1];
    legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend'),
      grades = factors.map((factor) => Number((valorMaximo * factor).toFixed(0))),
      labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }

      return div;

    };

    legend.addTo(this.map)


  });

    // this.map = new Map('map').setView([-33.414316, -70.664376], 14); // asignar el valor de la variable map
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
      // console.log(this.maximo);
      return d >= 0.9 * max ? '#FC3D59' :
             d >= 0.7 * max ? '#FA6378' :
             d >= 0.5 * max ? '#F88A97' :
             d >= 0.3 * max ? '#F6B0B5' :
             d >= 0.1 * max ? '#F4D6D4' :
                               '#FFC6D9';
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
    mouseover: highlightFeature,
    mouseout: resetHighlight,

  });
}

function highlightFeature(e:any) {
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

  label.updateContent( '<h4>Visualizador de XXXX</h4>' + '<b>'+ properties['name'] +'</b>' + '<br />Densidad:' + properties['density']);


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
    div.innerHTML =  '<h4>Visualizador de XXXX</h4>' + '<b>UV</b>' + '<br />Cantidad numerica';
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

tablita() {

  forkJoin({
    comercialData: this.empresas.getEmpresasComercialByUV(),
    densityData: this.empresas.getEmpresasTotalByUV(),
  }).subscribe(({ comercialData, densityData}) => {
    // this.dataTabla = this.combineData(comercialData, densityData);
    // console.log(densityData)
    this.densityData = densityData
    this.comercialData = comercialData

    for (let i = 0; i < this.densityData.length; i++) {
      // this.dataTabla.push({nombre: Object.keys(this.densityData)[i], densidad: Object.values(this.densityData)[i]})
      this.dataTabla.push({
        nombre: 'UV-' + (densityData[i].uv-1),
        total: densityData[i].densidad,
        comercial: comercialData[i].densidad,
      });
    }

    this.dataSource.data = this.dataTabla.map(item => ({
      nombre: item.nombre,
      total: item.total,
      comercial: item.comercial,
    }));



  });

}

// TABLA
displayedColumns: string[] = ['nombre', 'total', 'comercial'];
pez: any = this.tablita();

logElement(element: any) {
  console.log(element);
}



aporteEconomicoUV(gslData: any[]): any {
  const sumByM: any = {};
  // console.log(gslData)
  gslData.forEach((row) => {
    if (row['E'] === 'Aporte económico' && row['M'] !== '-' && row['M'] !== 'false') {
      const m = `UV-${row['M']}`;
      const count = sumByM[m] || 0;
      sumByM[m] = count + (Number(row['M']) !== 0 ? 1 : 0);
    }
  });
  // console.log(sumByM)

  const orderedKeys = Object.keys(sumByM).sort((a, b) => {
    const aNum = parseInt(a.replace('UV-', ''));
    const bNum = parseInt(b.replace('UV-', ''));
    return aNum - bNum;
  });

  const orderedSumByM = {};
  orderedKeys.forEach(key => {
    orderedSumByM[key] = sumByM[key];
  });

  return orderedSumByM;
}


buscar() {
  const fechaInicio = this.fechaInicio.getTime();
  const fechaFin = this.fechaFin.getTime();

  // Actualizar el rango del slider
  this.minValue = fechaInicio;
  this.maxValue = fechaFin;

  // ... Resto de la lógica de búsqueda
}



}


