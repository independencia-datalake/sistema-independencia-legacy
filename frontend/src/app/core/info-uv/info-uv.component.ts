
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Map, tileLayer, polygon, marker } from 'leaflet';
import { MatDialog } from '@angular/material/dialog';
import { DialogUVComponent } from './dialog-uv/dialog-uv.component';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-info-uv',
  templateUrl: './info-uv.component.html',
  styleUrls: ['./info-uv.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class InfoUvComponent {

  map: Map; // Declarar la variable map como propiedad de la clase
  unidad_vecinal: string;

  public data_poblacion: any;
  data_poblacion_uv: any = { "UV": 0, "Total": 0, "Hombres": 0, "Mujeres": 0, "% Población inmigrante": 0, "Superficie total m2": 0, "Superficies no habitadas m2": 0, "Superficie m2": 0, "Densidad Habitantes/Km2": 0 };

  constructor(public dialog: MatDialog, private http: HttpClient) { }

  ngAfterViewInit(): void{

    const dialogRef = this.dialog.open(DialogUVComponent, {
      width: '300px'
    });


    this.map = new Map('map').setView([-33.414316, -70.664376], 14,); // asignar el valor de la variable map
    tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      // maxZoom: 14
    }).addTo(this.map); // Usar this.map en lugar de map

      const poligonoUV = L.layerGroup().addTo(this.map);

          this.http.get('../../assets/uv_coordenadas.json').subscribe((data: any) => {
      const popup = L.popup();
      const mapObj = this.map;
      for (let id in data) {
        const coords = [];
        for (let pointId in data[id]) {
          const point = data[id][pointId];
          coords.push([point[1], point[0]]);
        }
        const poligono_uv = L.polygon([coords], {color:'#FC3D59'}).addTo(poligonoUV);

      }

    });

    dialogRef.afterClosed().subscribe(result => {
      this.unidad_vecinal = result


      this.zoomUV(this.unidad_vecinal)
      this.selectUV(this.unidad_vecinal)
    });

    this.http.get('../../assets/uv_poblacion.json').subscribe((data:any) => {
      this.data_poblacion = data
    })

      }

  dialogUV() {
    const dialogRef = this.dialog.open(DialogUVComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.unidad_vecinal = result


      this.zoomUV(this.unidad_vecinal)
      this.selectUV(this.unidad_vecinal)

    });

  }

  zoomUV(id) {

    this.http.get('../../assets/uv_coordenadas.json').subscribe((data: any) => {

      // console.log(data[id])
      const coordsaux = [];
      for (let pointId in data[id]) {
        const point = data[id][pointId];
        coordsaux.push([point[1], point[0]]);
      }
      const poligono_aux = L.polygon([coordsaux]);
      const centro_uv_aux = poligono_aux.getBounds();
      this.map.fitBounds(centro_uv_aux);

    });

  }

  selectUV(uv) {
    let uvNumber = parseInt(uv.split('-')[1]);
    this.data_poblacion_uv = this.data_poblacion.find(element => element.UV === uvNumber);


    // console.log(uv)
    // console.log(this.data_poblacion)
    console.log(this.data_poblacion_uv)

  }

}
