
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
    let uvNumber = parseInt(uv.split('-')[1]);
    this.data_poblacion_uv = this.data_poblacion.find(element => element.UV === uvNumber);
    this.data_lab.getFarmaciaDataLabByUV(uvNumber+1).subscribe(
      (data) => {
        this.data_farmacia_uv = data
      },
      (error) => {
        // console.log(error)
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

  arrayDeStrings = [
    "impuestos y derechos | La unidad vecinal N°x es top 3 en patentes, en 2023 se han registrado 450 patentes comerciales, 50 patentes de alcohol, 150 patentes industriales y 340 patentes profesionales. Representando un aporte de $115.000.000.- en promedio anual (medido durante los ultimos 10 años).",
    "direccion de transito | Durante 2023, este territorio registro solo 140 licencias de condicir, lo que representa un 2,40% de toda la comuna.",
    "obras municipales | Al parecer, no es un territorio con gran presión inmobiliaria, ya que no registra solicitud de permisos de edificacion u otros certificados relevantes",
    "seguridad municipal | Tiene un sostenido aumento de las denuncias por incivilidades, con una tasa promedio mensual de +15%",
    "presupuesto | La UV xx aporta un total aproximado de $190.000.000 anuales al Presupuesto municipal, ocupando el 3er lugar de la comuna",
    "asistencia social | Registra un aumento en las solicitudes de ayudas sociales, destinada mayoritariamente a la 3° edad.",
    "farmacias | Tiene un sostenido au,ento de solicitud de famacia, con una tasa promedio mensual de +15%"
  ];

  generateDictionary(municipalContentArray: string[], separator: string): { [key: string]: string } {
    const dictionary: { [key: string]: string } = {};
  
    municipalContentArray.forEach(item => {
      const [clave, content] = item.split(separator);
      dictionary[clave.trim()] = content.trim();
    });
  
    return dictionary;
  }
  
  dictionary = this.generateDictionary(this.arrayDeStrings, "|");

}
