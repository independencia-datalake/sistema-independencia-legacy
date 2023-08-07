
import { Component, AfterViewInit, ViewEncapsulation, OnInit, OnDestroy, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { Map, tileLayer, polygon, marker } from 'leaflet';
import { MatDialog } from '@angular/material/dialog';
import { DialogUVComponent } from './dialog-uv/dialog-uv.component';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { DataLabService } from 'src/app/service/data-lab.service';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { of } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import {MatTooltipModule} from '@angular/material/tooltip'; 
import { isPlatformBrowser } from '@angular/common';
// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';



@Component({
  selector: 'app-info-uv',
  templateUrl: './info-uv.component.html',
  styleUrls: ['./info-uv.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class InfoUvComponent implements OnDestroy, AfterViewInit {

  datag=[];

  private root!: am5.Root;
  

  private map: Map; // Declarar la variable map como propiedad de la clase
  unidad_vecinal: string;

  public data_poblacion: any;
  // data_poblacion_uv: any = { "UV": 0, "Total": 0, "Hombres": 0, "Mujeres": 0, "% Población inmigrante": 0, "Superficie total m2": 0, "Superficies no habitadas m2": 0, "Superficie m2": 0, "Densidad Habitantes/Km2": 0 };
  data_poblacion_uv: any = { };
  data_farmacia_uv: any = {};
  data_empresas_uv: any = { };
  data_DOM_uv: any = { };
  data_transito_uv: any = { };

  constructor(public dialog: MatDialog, private http: HttpClient, private data_lab: DataLabService, @Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone) { }
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }


  ngAfterViewInit(): void{
      const dataBd = [
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
        },
        
      ]

      let data = dataBd.map(element => {
        return {
          category: element.uv,
          value: element.licencia_conducir,
          meditionValue: 'Licencia de conducir',
          rank: element.rank_licencia_conducir,
          opacity: 0.9-(element.rank_licencia_conducir/100)

        }
      }).sort((el1,el2) => el1.rank - el2.rank)
      console.log(data)

      this.datag = [...data];
      console.log('======== ',this.datag)


    const dialogRef = this.dialog.open(DialogUVComponent, {
      width: 'auto'
    });


    this.map = new Map('map-barrial').setView([-33.414316, -70.664376], 14,); // asignar el valor de la variable map
    tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      // maxZoom: 14
    }).addTo(this.map); // Usar this.map en lugar de map
    setTimeout(() => {
      this.map.invalidateSize();
    }, 0);

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
      width: 'auto'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.unidad_vecinal = result;

      console.log(this.unidad_vecinal)
      this.zoomUV(this.unidad_vecinal);
      this.selectUV(this.unidad_vecinal);

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
    console.log('EN select uv')
    console.log(uv)
    let uvNumber = parseInt(uv.split('-')[1]);
    this.data_poblacion_uv = this.data_poblacion.find(element => element.UV === uvNumber);
    this.data_lab.getFarmaciaDataLabByUV(uvNumber+1).subscribe(
      (data) => {
        this.data_farmacia_uv = data
      },
      (error) => {
        console.log(error)
      }
    )
    this.data_lab.getEmpresasDataLabByUV(uvNumber+1).subscribe(
      (data) => {
        this.data_empresas_uv = data;
      },
      (error) => {
        console.error(error)
      }
    )
    this.data_lab.getDOMDataLabByUV(uvNumber+1).subscribe(
      (data) => {
        this.data_DOM_uv = data;
      },
      (error) => {
        console.error(error);
      }
    );
    this.data_lab.getTransitoDataLabByUV(uvNumber+1).subscribe(
      (data) => {
        this.data_transito_uv = data;
      },
      (error) => {
        console.error(error);
      }
    );
    console.log(this.data_DOM_uv)
    console.log(this.data_empresas_uv)
  }

  ngOnDestroy(): void {
    this.map.remove()
  }

}
