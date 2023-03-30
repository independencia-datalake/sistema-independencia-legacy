import { Component, ViewEncapsulation } from '@angular/core';
import { Map, tileLayer, polygon, marker } from 'leaflet';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { GeoJSON } from 'leaflet';
import { MatTableDataSource } from '@angular/material/table';

interface unidad_vecinal {
  nombre: any;
  densidad: any;
}

@Component({
  selector: 'app-vis',
  templateUrl: './vis.component.html',
  styleUrls: ['./vis.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class VisComponent {

  result: any[];
  map: Map;
  geoJsonLayer: L.GeoJSON;
  densityData: any;

  infoControl: any;
  info: L.Control;

  dataTabla: any=[];

  unidadesVecinales: unidad_vecinal[] = [];
  dataSource = new MatTableDataSource<unidad_vecinal>(this.unidadesVecinales);

  constructor(private http: HttpClient) {
   }



  ngAfterViewInit(): void{
    let geoJsonData: any;  // Definir la variable fuera del método subscribe


    // densidad

    this.http.get('../../assets/density-test.json').subscribe((data: any) => {
      this.densityData = data
      for (const [nombre, densidad] of Object.entries(data)) {
        this.unidadesVecinales.push({ nombre, densidad });
      }
      this.dataSource.data = this.unidadesVecinales;
    });

    // Convert the data to GeoJSON
    this.http.get('../../assets/uv_coordenadas.json').subscribe((data: any) => {
      geoJsonData = {
        type: 'FeatureCollection',
        features: Object.keys(data).map((key) => {
          const coords = Object.values(data[key]);
          const density = this.densityData[key]
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

      this.geoJsonLayer.addData(geoJsonData);  // Añadir los datos al layer aquí


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
    function getColor(d) {
      return d >= 90 ? '#FC3D59' :
             d >= 70 ? '#FA6378' :
             d >= 50 ? '#F88A97' :
             d >= 30 ? '#F6B0B5' :
             d >= 10 ? '#F4D6D4' :
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

var legend = new L.Control({position: 'bottomright'})
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend'),
  grades = [0, 10, 30, 50, 70, 90, 100],
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

// this.http.get('../../assets/density-test.json').subscribe((data: any) => {
//   this.densityData = data
//   console.log(this.densityData)
// });

// this.tablita
  }

tablita() {
  this.http.get('../../assets/density-test.json').subscribe((data: any) => {
  this.densityData = data
  // console.log([Object.keys(this.densityData)])
  // console.log(this.densityData)
  for (let i =0; i<2; i++) {
    this.dataTabla.push({nombre: Object.keys(this.densityData)[i], densidad: Object.values(this.densityData)[i]})
  }
  console.log(this.dataTabla)
  // console.log([{nombre:'UV-1', densidad: 5},{nombre:'UV-2', densidad: 10}])
  // return [{nombre:'UV-1', densidad: 5},{nombre:'UV-2', densidad: 10}]
  });
  // return [{nombre: Object.keys(this.densityData)[1], densidad: Object.values(this.densityData)[1]}];
  // return this.kekw
  // return this.dataTabla
  return [{nombre:'UV-1', densidad: 5},{nombre:'UV-2', densidad: 10}]
}

// TABLA
displayedColumns: string[] = ['nombre', 'densidad'];
pez: any = this.tablita();


}


