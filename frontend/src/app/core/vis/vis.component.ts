
import { Component, ViewEncapsulation, Inject, NgZone, PLATFORM_ID } from '@angular/core';
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
import { switchMap } from 'rxjs/operators';
import { MatSelectModule } from '@angular/material/select';
import { MapaLegacyService } from 'src/app/service/mapa-legacy.service';
import {MatTooltipModule} from '@angular/material/tooltip';
import { isPlatformBrowser } from '@angular/common';
// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';


interface data_UV {
  nombre: any;
  rank?:any;
  lp?: any; // Last Periodo de tiempo
  densidad: any;
  comercial?: any;
  // PARA TRANSITO
  licencia_conducir?: any;
  permiso_circulacion?: any;

}


@Component({
  selector: 'app-vis',
  templateUrl: './vis.component.html',
  styleUrls: ['./vis.component.css'],
  encapsulation: ViewEncapsulation.None,
})


export class VisComponent {
  //amcharts root
  private root!: am5.Root;

  uvCoordRequest = this.http.get('../../assets/uv_coordenadas.json');
  geoJsonData: any;
  tipo_mapa: any = 'ninguna';
  columnaResaltada: string = 'total';
  map: Map;
  label: any;
  geoJsonLayer: L.GeoJSON;
  public maximo:any;

  legend: L.Control;


  // dataSource = new MatTableDataSource<data_UV>([...this.dataByUV]);
  dataSource: any[] = [];
  displayedColumns: string[] = ['nombre', 'total', 'comercial'];

  fechaInicio: any;
  fechaFin: any;
  anioFin: any;
  anioFin_ly: any;

  // SLIDER

  // HARD CODE
  slider_value=0
  slider_highvalue=100

  slider_options: Options = {
    floor: 0,
    ceil: 100,
    noSwitching: true,
    getPointerColor: (value:number): string => {return '#FC3D59'},
  };

  dummy_value=0
  dummy_highvalue=100

  dummy_options: Options = {
    floor: 0,
    ceil: 100,
    noSwitching: true,

    getPointerColor: (value:number): string => {return '#FC3D59'},
  };

  public columnas = [
    { nombre: 'total', resaltada: false, element: 'total' },
    // { nombre: 'rank', resaltada: false },
    { nombre: 'ventas', resaltada: false, element: 'ventas' },
    { nombre: 'alcohol', resaltada: false, element: 'alcohol' },
    { nombre: 'comercial', resaltada: false, element: 'comercial' },
    { nombre: 'profesional', resaltada: false, element: 'profesional'},
    { nombre: 'industrial', resaltada: false, element: 'industrial' },
    { nombre: 'microempresa', resaltada: false, element: 'microempresa'},
    { nombre: 'estacionada', resaltada: false, element: 'estacionada'},
    { nombre: 'anexion', resaltada: false, element: 'anexion' },
    { nombre: 'antiguas', resaltada: false, element: 'antiguas' },
    { nombre: 'anulacion', resaltada: false, element: 'anulacion' },
    { nombre: 'cambio de destino', resaltada: false, element: 'cambio_destino' },
    { nombre: 'fusion', resaltada: false, element: 'fusion' },
    { nombre: 'ley 20.898', resaltada: false, element: 'ley_20898' },
    { nombre: 'obras menores', resaltada: false, element: 'obrasmenores' },
    { nombre: 'permisos de edificacion', resaltada: false, element: 'permisosedificacion' },
    { nombre: 'recepcion final', resaltada: false, element: 'recepcionfinal' },
    { nombre: 'regularizaciones', resaltada: false, element: 'regularizaciones' },
    { nombre: 'regularizaciones ley 18.591', resaltada: false, element: 'regularizaciones18591' },
    { nombre: 'resolucion', resaltada: false, element: 'resolucion' },
    { nombre: 'subdivisiones', resaltada: false, element: 'subdivisiones' },
    { nombre: 'ventas por piso', resaltada: false, element: 'ventasporpiso' },
    { nombre: 'licencia conducir', resaltada: false, element: 'licencia_conducir' },
    { nombre: 'permiso circulacion', resaltada: false, element: 'permiso_circulacion' },
    // Agrega las columnas restantes aquí...
  ];


  constructor(
    private http: HttpClient,
    private empresas: EmpresasServiceService,
    private mapa_legacy: MapaLegacyService,
    @Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone
  ) {}

  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }


   ngOnInit(): void {
    this.initializeMapData()
   }

   initializeMapData(fecha_inicio_init = null, fecha_fin_init = null, flag_slider = false) {

    // Si geoJsonLayer y legend ya existen, removerlos del mapa
    if (this.geoJsonLayer) {
      this.map.removeLayer(this.geoJsonLayer);
      this.geoJsonLayer = null;
    }
    if (this.legend) {
      this.legend.remove();
      this.legend = null;
    }

    if (this.tipo_mapa === 'ninguna') {
      this.uvCoordRequest.subscribe(uvCoordData => {
        const newData: {[key: string]: number} = {};
        // console.log(uvCoordData)
        this.maximo = Math.max(...Object.values(newData));

        // Lógica relacionada con uvCoordData
        this.geoJsonData = {
          type: 'FeatureCollection',
          features: Object.keys(uvCoordData).map((key) => {
            const coords = Object.values(uvCoordData[key]);
            return {
              type: 'Feature',
              properties: {
                "name": key,
                "density": 0,
              },
              geometry: {
                type: 'Polygon',
                coordinates: [coords],
              },
            };
          }),
        };

        this.geoJsonLayer.addData(this.geoJsonData);

        // this.legend = new L.Control({ position: 'bottomright' });


      });
    }else if (this.tipo_mapa === 'farmacia') {

      this.mapa_legacy.getRangoFechasGeneralByTipo(this.tipo_mapa, this.columnaResaltada).pipe(
        switchMap(fechas => {
          if (fecha_inicio_init && fecha_fin_init) {
            this.fechaInicio = fecha_inicio_init
            this.fechaFin = fecha_fin_init
          } else {
            this.fechaInicio = fechas.fecha_inicio
            this.fechaFin = fechas.fecha_fin
          }
          if (flag_slider === true) {
          } else if (flag_slider === false) {
            this.initializeSlider(this.fechaInicio,this.fechaFin)
          }
          return forkJoin([this.mapa_legacy.getVentasFarmaciaByUV(this.fechaInicio, this.fechaFin), this.uvCoordRequest])
        })
      ).subscribe(([ventasFarmaciaTotalByUVData, uvCoordData]) => {
        let densidadPorUV = {};
        const values = Object.values(ventasFarmaciaTotalByUVData);
        if ( this.columnaResaltada === 'ventas') {
          values.forEach((element: any) => {
            densidadPorUV[element.uv-1] = element.ventas
          });
          let densidades = (ventasFarmaciaTotalByUVData as any[]).map(item => item.ventas);
          this.maximo = Math.max(...densidades);
        }
        this.dataSource = ventasFarmaciaTotalByUVData.map(item => {
          return { nombre:'UV-' + (item.uv-1), ventas: item.ventas}
        })

        // Utilizar los datos al crear geoJsonData
        this.geoJsonData = {
          type: 'FeatureCollection',
          features: Object.keys(uvCoordData).map((key) => {
            const coords = Object.values(uvCoordData[key]);
            // La clave de UV se asume que está en formato 'UV-#' y se extrae el número
            let uvNumber = parseInt(key.split('-')[1]);
            // Obtener la densidad correspondiente de densidadPorUV, o 0 si no hay datos
            let densidad = densidadPorUV[uvNumber] || 0;
            return {
              type: 'Feature',
              properties: {
                "name": key,
                "density": densidad,
              },
              geometry: {
                type: 'Polygon',
                coordinates: [coords],
              },
            };
          }),
        };

        // Luego puedes actualizar la data del layer geoJson con los nuevos datos
        this.geoJsonLayer.clearLayers();
        this.geoJsonLayer.addData(this.geoJsonData);

        this.legend = new L.Control({ position: 'bottomright' });
        this.updateLegend(this.maximo);
        this.legend.addTo(this.map);

      })

      this.displayedColumns = ['nombre', 'ventas'];

    }else if (this.tipo_mapa === 'impuestosyderechos') {
      // console.log('impuestos y derechos')
      this.mapa_legacy.getRangoFechasGeneralByTipo(this.tipo_mapa, this.columnaResaltada).pipe(
        switchMap(fechas => {
          if (fecha_inicio_init && fecha_fin_init) {
            this.fechaInicio = fecha_inicio_init
            this.fechaFin = fecha_fin_init
          } else {
            this.fechaInicio = fechas.fecha_inicio
            this.fechaFin = fechas.fecha_fin
          }
          if (flag_slider === true) {
          } else if (flag_slider === false) {
            this.initializeSlider(this.fechaInicio,this.fechaFin)
          }

          const fechaFinObj = new Date(this.fechaFin)
          this.anioFin = fechaFinObj.getFullYear();
          this.anioFin_ly = this.anioFin-1

          return forkJoin([this.mapa_legacy.getEmpresasByUV(this.fechaInicio, this.fechaFin), this.uvCoordRequest]);
        })
      ).subscribe(([empresasTotalByUVData, uvCoordData]) => {
        let densidadPorUV = {};
        const values = Object.values(empresasTotalByUVData);

        let clave = this.columnaResaltada

        values.forEach(element => {
          densidadPorUV[element.uv-1] = element[clave];  // Accede a la propiedad de 'element' basada en la clave
        });

        let densidades = (empresasTotalByUVData as any[]).map(item => item[clave]);  // Mapea la propiedad de 'item' basada en la clave

        this.maximo = Math.max(...densidades);

        this.dataSource = empresasTotalByUVData.map(item => {

          let rank = item[`rank_${this.columnaResaltada}`];
          let rank_ly = item[`rank_${this.columnaResaltada}_ly`];

          rank = rank || '-';  // Si rank es null o undefined, se le asigna "-"
          rank_ly = rank_ly || '-';

          return { nombre:'UV-' + (item.uv-1), rank: rank, rank_ly: rank_ly, total: item.total, alcohol: item.alcohol, comercial: item.comercial, profesional: item.profesional, industrial: item.industrial, microempresa: item.microempresa, estacionada: item.estacionada}
        })

        // Utilizar los datos al crear geoJsonData
        this.geoJsonData = {
          type: 'FeatureCollection',
          features: Object.keys(uvCoordData).map((key) => {
            const coords = Object.values(uvCoordData[key]);
            // La clave de UV se asume que está en formato 'UV-#' y se extrae el número
            let uvNumber = parseInt(key.split('-')[1]);
            // Obtener la densidad correspondiente de densidadPorUV, o 0 si no hay datos
            let densidad = densidadPorUV[uvNumber] || 0;
            return {
              type: 'Feature',
              properties: {
                "name": key,
                "density": densidad,
              },
              geometry: {
                type: 'Polygon',
                coordinates: [coords],
              },
            };
          }),
        };

        // Luego puedes actualizar la data del layer geoJson con los nuevos datos
        this.geoJsonLayer.clearLayers();
        this.geoJsonLayer.addData(this.geoJsonData);

        this.legend = new L.Control({ position: 'bottomright' });
        this.updateLegend(this.maximo);
        this.legend.addTo(this.map);
      })

      this.displayedColumns = ['nombre', 'rank', 'rank_ly', 'total', 'alcohol', 'comercial', 'profesional', 'industrial', 'microempresa', 'estacionada'];


    } else if (this.tipo_mapa === 'obrasmunicipales') {
      this.mapa_legacy.getRangoFechasGeneralByTipo(this.tipo_mapa, this.columnaResaltada).pipe(
        switchMap(fechas => {
          if (fecha_inicio_init && fecha_fin_init) {
            this.fechaInicio = fecha_inicio_init
            this.fechaFin = fecha_fin_init
          } else {
            this.fechaInicio = fechas.fecha_inicio
            this.fechaFin = fechas.fecha_fin
          }
          if (flag_slider === true) {
          } else if (flag_slider === false) {
            this.initializeSlider(this.fechaInicio,this.fechaFin)
          }

          const fechaFinObj = new Date(this.fechaFin)
          this.anioFin = fechaFinObj.getFullYear();
          this.anioFin_ly = this.anioFin-1

          return forkJoin([this.mapa_legacy.getObrasMunicipalesTotalByUV(this.fechaInicio, this.fechaFin), this.uvCoordRequest]);
        })
      ).subscribe(([obrasMunicipalesByUVData, uvCoordData]) => {
        let densidadPorUV = {};
        const values = Object.values(obrasMunicipalesByUVData)

        let clave = this.columnaResaltada

        values.forEach(element => {
          densidadPorUV[element.uv-1] = element[clave];
        })

        let densidades = (obrasMunicipalesByUVData as any[]).map(item => item[clave])

        this.maximo = Math.max(...densidades);

        this.dataSource = obrasMunicipalesByUVData.map(item => {

          let formattedColumnName = this.formatColumnName(this.columnaResaltada);
          let rank;
          let rank_ly;
          if (this.columnaResaltada === 'cambio de destino') {
              rank = item.rank_cambiodestino;
          } else if (this.columnaResaltada === 'permisos de edificacion') {
              rank = item.rank_permisosedificacion;
              rank_ly = item.rank_permisosedificacion_ly;
          } else if (this.columnaResaltada === 'regularizaciones ley 18.591') {
              rank = item.rank_regularizaciones18591;
              rank_ly = item.rank_regularizaciones18591_ly;
          } else {
            rank = item[`rank_${formattedColumnName}`];
            rank_ly = item[`rank_${formattedColumnName}_ly`];
          }

          return { nombre:'UV-' + (item.uv-1),
                   rank: rank,
                   total: item.total,
                   anexion: item.anexion,
                   antiguas: item.antiguas,
                   anulacion: item.anulacion,
                   cambio_destino: item['cambio de destino'],
                   fusion: item.fusion,
                   ley_20898: item['ley 20.898'],
                   obrasmenores: item['obras menores'],
                  permisosedificacion: item['permisos de edificacion'],
                   recepcionfinal: item['recepcion final'],
                   regularizaciones: item.regularizaciones,
                   regularizaciones18591: item['regularizaciones ley 18.591'],
                   resolucion: item.resolucion,
                   subdivisiones: item.subdivisiones,
                  ventasporpiso: item['ventas por piso'] }
        })
        // Utilizar los datos al crear geoJsonData
        this.geoJsonData = {
          type: 'FeatureCollection',
          features: Object.keys(uvCoordData).map((key) => {
            const coords = Object.values(uvCoordData[key]);
            // La clave de UV se asume que está en formato 'UV-#' y se extrae el número
            let uvNumber = parseInt(key.split('-')[1]);
            // Obtener la densidad correspondiente de densidadPorUV, o 0 si no hay datos
            let densidad = densidadPorUV[uvNumber] || 0;
            return {
              type: 'Feature',
              properties: {
                "name": key,
                "density": densidad,
              },
              geometry: {
                type: 'Polygon',
                coordinates: [coords],
              },
            };
          }),
        };

        // Luego puedes actualizar la data del layer geoJson con los nuevos datos
        this.geoJsonLayer.clearLayers();
        this.geoJsonLayer.addData(this.geoJsonData);

        this.legend = new L.Control({ position: 'bottomright' });
        this.updateLegend(this.maximo);
        this.legend.addTo(this.map);


      })

      this.displayedColumns = ['nombre', 'rank', 'total', 'anexion', 'antiguas', 'anulacion', 'cambio de destino', 'fusion', 'ley 20.898', 'obras menores', 'permisos de edificacion', 'recepcion final', 'regularizaciones', 'regularizaciones ley 18.591', 'resolucion', 'subdivisiones', 'ventas por piso']


    } else if (this.tipo_mapa === 'transito') {

      this.mapa_legacy.getRangoFechasGeneralByTipo(this.tipo_mapa, this.columnaResaltada).pipe(
        switchMap(fechas => {
          if (fecha_inicio_init && fecha_fin_init) {
            this.fechaInicio = fecha_inicio_init
            this.fechaFin = fecha_fin_init
          } else {
            this.fechaInicio = fechas.fecha_inicio
            this.fechaFin = fechas.fecha_fin
          }

          if (flag_slider === true) {
          } else if (flag_slider === false) {
            this.initializeSlider(this.fechaInicio,this.fechaFin)
          }
          const fechaFinObj = new Date(this.fechaFin)
          this.anioFin = fechaFinObj.getFullYear();
          this.anioFin_ly = this.anioFin-1
          // this.initializeSlider(this.fechaInicio,this.fechaFin)
          return forkJoin([this.mapa_legacy.getTransitoByUV(this.fechaInicio,this.fechaFin), this.uvCoordRequest]);
        })
      ).subscribe(([licenciasTotalByUVData, uvCoordData]) => {
        let densidadPorUV = {};
        const values = Object.values(licenciasTotalByUVData);

        if (this.columnaResaltada === 'licencia conducir') {
          values.forEach(element => {
            densidadPorUV[element.uv-1] = element.licencia_conducir;
          });

          let densidades = (licenciasTotalByUVData as any[]).map(item => item.licencia_conducir);
          this.maximo = Math.max(...densidades);
        } else if (this.columnaResaltada === 'permiso circulacion') {
          values.forEach(element => {
            densidadPorUV[element.uv-1] = element.permiso_circulacion;
          });

          let densidades = (licenciasTotalByUVData as any[]).map(item => item.permiso_circulacion);
          this.maximo = Math.max(...densidades);
        }

        this.dataSource = licenciasTotalByUVData.map(item => {
          let rank;
          let rank_ly
          if (this.columnaResaltada === 'licencia conducir') {
            rank = item.rank_licencia
            rank_ly = item.rank_licencia_ly
          } else if (this.columnaResaltada === 'permiso circulacion') {
            rank = item.rank_permiso
            rank_ly = item.rank_permiso_ly
          }

          rank = rank || '-';  // Si rank es null o undefined, se le asigna "-"
          rank_ly = rank_ly || '-';

          return { nombre:'UV-' + (item.uv-1), rank: rank, rank_ly: rank_ly, licencia_conducir: item.licencia_conducir, permiso_circulacion: item.permiso_circulacion}
        })

        // Utilizar los datos al crear geoJsonData
        this.geoJsonData = {
          type: 'FeatureCollection',
          features: Object.keys(uvCoordData).map((key) => {
            const coords = Object.values(uvCoordData[key]);
            // La clave de UV se asume que está en formato 'UV-#' y se extrae el número
            let uvNumber = parseInt(key.split('-')[1]);
            // Obtener la densidad correspondiente de densidadPorUV, o 0 si no hay datos
            let densidad = densidadPorUV[uvNumber] || 0;
            return {
              type: 'Feature',
              properties: {
                "name": key,
                "density": densidad,
              },
              geometry: {
                type: 'Polygon',
                coordinates: [coords],
              },
            };
          }),
        };
        this.geoJsonLayer.clearLayers();
        this.geoJsonLayer.addData(this.geoJsonData);

        this.legend = new L.Control({ position: 'bottomright' });
        this.updateLegend(this.maximo);
        this.legend.addTo(this.map);
      })
      this.displayedColumns = ['nombre', 'rank', 'rank_ly', 'licencia conducir', 'permiso circulacion'];
    }

    if (this.tipo_mapa !== 'ninguna') {
      this.geoJsonLayer = L.geoJSON(null, {
        style: this.style,
        onEachFeature: (feature, layer) => this.onEachFeature(feature, layer)
      }).addTo(this.map);

    }
   }

  ngAfterViewInit(): void{


  localStorage.setItem('Columna', 'total')

    // this.map = new Map('map').setView([-33.414316, -70.664376], 14); // asignar el valor de la variable map
    const mapOptions = {
      dragging: false,     // Deshabilitar el arrastre del mapa
      zoomControl: false,   // Deshabilitar el control de zoom
      scrollWheelZoom: false
    };
    this.map = new Map('map', mapOptions).setView([-33.416793, -70.662822], 14);


    tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      opacity:0,
      // maxZoom: 14
    }).addTo(this.map); // Usar this.map en lugar de map

    if (this.tipo_mapa === 'ninguna') {
      this.geoJsonLayer = L.geoJSON(null, {style: {color: '#FC3D59',}}).addTo(this.map);
    }
    const image = '../../../assets/PREDIOS_INDEPENDENCIA.neo.Png';
    const imageBounds = L.latLngBounds([[-33.3988667, -70.681777777], [-33.4322444, -70.650155555]]);
    const imageOptions = {
      opacity: 0.5,
      zIndex: 1,
      attribution: 'Image attribution',
      interactive: true
    };
    L.imageOverlay(image, imageBounds, imageOptions).addTo(this.map);

    const info = L.Control.extend({
      onAdd: function(map) {
        const div = L.DomUtil.create('div', 'info');
        div.innerHTML =  '<h4>Mapa de visualizacion de data </h4>' + '<b>Elija un tipo de mapa</b>';
        // Guardar una referencia al div para actualizarlo más tarde
        this._div = div;
        return div;
      },
      updateContent: function(content) {
        this._div.innerHTML = content;
      }});

    this.label = new info(); // label es la etiqueta de arriba a la derecha del mapa
    this.label.addTo(this.map);

    ///amchart
     // Chart code goes in here
     this.browserOnly(() => {
      let root = am5.Root.new("chartdiv");

      root.setThemes([am5themes_Animated.new(root)]);

      // let chart = root.container.children.push(
      //   am5xy.XYChart.new(root, {
      //     panY: false,
      //     layout: root.verticalLayout
      //   })
      // );

      let chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        layout: root.verticalLayout,
        paddingRight: 30
      }));

      // Define data
      // let data = [
      //   {
      //     category: "Research",
      //     value1: 1000,
      //     value2: 588
      //   },
      //   {
      //     category: "Marketing",
      //     value1: 1200,
      //     value2: 1800
      //   },
      //   {
      //     category: "Sales",
      //     value1: 850,
      //     value2: 1230
      //   }
      // ];

      let data = [{
        category: "15",
        value: 100,
        columnSettings: {
          fill: am5.color(0xc6251a)
        }
      }, {
        category: "14",
        value: 100,
        columnSettings: {
          fill: am5.color(0xc6251a)
        }
      }, {
        category: "13",
        value: 100,
        columnSettings: {
          fill: am5.color(0xc6251a)
        }
      }, {
        category: "12",
        value: 100,
        columnSettings: {
          fill: am5.color(0xc6251a)
        }
      }, {
        category: "11",
        value: 100,
        columnSettings: {
          fill: am5.color(0xc6251a)
        }
      }, {
        category: "10",
        value: 100,
        currentBullet: true,
        columnSettings: {
          fill: am5.color(0xfcc034)
        }
      }, {
        category: "9",
        value: 100,
        columnSettings: {
          fill: am5.color(0xfcc034)
        }
      }, {
        category: "8",
        value: 100,
        columnSettings: {
          fill: am5.color(0xfcc034)
        }
      }, {
        category: "7",
        value: 100,
        columnSettings: {
          fill: am5.color(0xfcc034)
        }
      }, {
        category: "6",
        value: 100,
        columnSettings: {
          fill: am5.color(0xfcc034)
        }
      }, {
        category: "5",
        value: 100,
        columnSettings: {
          fill: am5.color(0x6bc352)
        }
      }, {
        category: "4",
        value: 100,
        columnSettings: {
          fill: am5.color(0x6bc352)
        }
      }, {
        category: "3",
        value: 100,
        columnSettings: {
          fill: am5.color(0x6bc352)
        }
      }, {
        category: "2",
        value: 100,
        columnSettings: {
          fill: am5.color(0x6bc352)
        }
      }, {
        category: "1",
        value: 100,
        columnSettings: {
          fill: am5.color(0x6bc352)
        }
      }, {
        category: "0",
        value: 100,
        targetBullet: true,
        columnSettings: {
          fill: am5.color(0xffffff)
        }  
      }];

      // // Create Y-axis
      // let yAxis = chart.yAxes.push(
      //   am5xy.ValueAxis.new(root, {
      //     renderer: am5xy.AxisRendererY.new(root, {})
      //   })
      // );

      // // Create X-Axis
      // let xAxis = chart.xAxes.push(
      //   am5xy.CategoryAxis.new(root, {
      //     renderer: am5xy.AxisRendererX.new(root, {}),
      //     categoryField: "category"
      //   })
      // );
      // xAxis.data.setAll(data);

      let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
        categoryField: "category",
        renderer: am5xy.AxisRendererX.new(root, {
      
        }),
        tooltip: am5.Tooltip.new(root, {})
      }));
      
      let xRenderer = xAxis.get("renderer");
      
      xRenderer.grid.template.set("forceHidden", true);
      xRenderer.labels.template.set("forceHidden", true);
      
      xAxis.data.setAll(data);
      
      let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        min: 0,
        max: 400,
        strictMinMax: true,
        renderer: am5xy.AxisRendererY.new(root, {})
      }));
      
      let yRenderer = yAxis.get("renderer");
      
      yRenderer.grid.template.set("forceHidden", true);
      yRenderer.labels.template.set("forceHidden", true);

      // Create series
      // let series1 = chart.series.push(
      //   am5xy.ColumnSeries.new(root, {
      //     name: "Series",
      //     xAxis: xAxis,
      //     yAxis: yAxis,
      //     valueYField: "value1",
      //     categoryXField: "category"
      //   })
      // );
      // series1.data.setAll(data);

      // let series2 = chart.series.push(
      //   am5xy.ColumnSeries.new(root, {
      //     name: "Series",
      //     xAxis: xAxis,
      //     yAxis: yAxis,
      //     valueYField: "value2",
      //     categoryXField: "category"
      //   })
      // );
      // series2.data.setAll(data);

      let series = chart.series.push(am5xy.ColumnSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        categoryXField: "category",
        maskBullets: false
      }));
      
      series.columns.template.setAll({
        //tooltipText: "{categoryX}: {valueY}",
        width: am5.p100,
        tooltipY: 0,
        strokeOpacity: 1,
        strokeWidth:2,
        stroke:am5.color(0xffffff),
        templateField: "columnSettings"
      });
      
      // series.bullets.push((root, target, dataItem) => {
      //   if (dataItem.dataContext.currentBullet) {
      //     let container = am5.Container.new(root, {});
          
      //     let pin = container.children.push(am5.Graphics.new(root, {
      //       fill: dataItem.dataContext.columnSettings.fill,
      //       dy: -5,
      //       centerY: am5.p100,
      //       centerX: am5.p50,
      //       svgPath: "M66.9 41.8c0-11.3-9.1-20.4-20.4-20.4-11.3 0-20.4 9.1-20.4 20.4 0 11.3 20.4 32.4 20.4 32.4s20.4-21.1 20.4-32.4zM37 41.4c0-5.2 4.3-9.5 9.5-9.5s9.5 4.2 9.5 9.5c0 5.2-4.2 9.5-9.5 9.5-5.2 0-9.5-4.3-9.5-9.5z"
      //     }));
          
      //     let label = container.children.push(am5.Label.new(root, {
      //       text: dataItem.get("categoryX"),
      //       dy: -38,
      //       centerY: am5.p50,
      //       centerX: am5.p50,
      //       populateText: true,
      //       paddingTop: 5,
      //       paddingRight: 5,
      //       paddingBottom: 5,
      //       paddingLeft: 5,
      //       background: am5.RoundedRectangle.new(root, {
      //         fill: am5.color(0xffffff),
      //         cornerRadiusTL: 20,
      //         cornerRadiusTR: 20,
      //         cornerRadiusBR: 20,
      //         cornerRadiusBL: 20,
      //       })
      //     }));
          
      //     return am5.Bullet.new(root, {
      //       locationY: 1,
      //       sprite: container
      //     });
      //   }
      //   else if (dataItem.dataContext.targetBullet) {
      //     let container = am5.Container.new(root, {
      //       dx: 15
      //     });
          
      //     let circle = container.children.push(am5.Circle.new(root, {
      //       radius: 34,
      //       fill: am5.color(0x11326d),
      //     }));
          
      //     let label = container.children.push(am5.Label.new(root, {
      //       text: "GOAL\n[bold]ZERO[/]",
      //       textAlign: "center",
      //       //fontSize: "10",
      //       fill: am5.color(0xffffff),
      //       centerY: am5.p50,
      //       centerX: am5.p50,
      //       populateText: true,
      //     }));
      //     return am5.Bullet.new(root, {
      //       locationY: 0.5,
      //       sprite: container
      //     });
      //   }
      //   return false;
      // });
      
      series.data.setAll(data);

      //labels
      function addAxisLabel(category, text) {
        let rangeDataItem = xAxis.makeDataItem({
          category: category
        });
        
        let range = xAxis.createAxisRange(rangeDataItem);
      
        range.get("label").setAll({
          //fill: am5.color(0xffffff),
          text: text,
          forceHidden: false
        });
      
        range.get("grid").setAll({
          //stroke: color,
          strokeOpacity: 1,
          location: 1
        });
      }
      
      addAxisLabel("15", "20+");
      addAxisLabel("10", "10");
      addAxisLabel("5", "5");

      // Add legend
      // let legend = chart.children.push(am5.Legend.new(root, {}));
      // legend.data.setAll(chart.series.values);

      let legend = chart.children.push(
        am5.Legend.new(root, {
          centerX: am5.p50,
          x: am5.p50
        })
      );
      series.appear(1000, 100);
      chart.appear(1000, 100);

      // Add cursor
      chart.set("cursor", am5xy.XYCursor.new(root, {}));

      this.root = root;
    });
  }


  tipoMapaChange(opcion: string) {
    this.tipo_mapa = opcion
    if (this.tipo_mapa === 'farmacia') {
      this.columnaResaltada = 'ventas'
      localStorage.setItem('Columna', 'ventas')
    } else if(this.tipo_mapa === 'impuestosyderechos') {
      this.columnaResaltada = 'total'
      localStorage.setItem('Columna', 'total')
    }else if(this.tipo_mapa === 'obrasmunicipales'){
      this.columnaResaltada ='total'
    } else if (this.tipo_mapa === 'transito') {
      this.columnaResaltada = 'licencia conducir'
      localStorage.setItem('Columna', 'licencia conducir')
    }

    this.initializeMapData()
  }

  fechaChange(flag_slider = false) {

    let fechaInicioString = this.formatDate(this.fechaInicio);
    let fechaFinString = this.formatDate(this.fechaFin);

    // console.log(fechaInicioString)
    // console.log(fechaFinString)

    this.initializeMapData(fechaInicioString, fechaFinString, flag_slider);


  }

  sliderChange(event) {

    if (event.pointerType === PointerType.Min) {
      // console.log(this.formatDateSlider(event.value, true))
      this.fechaInicio = this.formatDateSlider(event.value, true)
    } else if (event.pointerType === PointerType.Max) {
      // console.log(this.formatDateSlider(event.highValue, true))
      this.fechaFin = this.formatDateSlider(event.highValue, true)
    }

    this.fechaChange(true)
  }

  // FUNCIONES

  style = (feature) => {
    return {
      fillColor: this.getColor(feature.properties.density, this.maximo),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  }

  getColor = (d, max) => {
    max = max || this.maximo; // asignar un valor por defecto para max

    return d >= 0.8 * max ? '#FC3D59' :
      d >= 0.6 * max ? '#FA527F' :
      d >= 0.4 * max ? '#F886A8' :
      d >= 0.2 * max ? '#FBB5C5' :
      d >= 0   * max ? '#FDE5ED' :
                      '#FFFFFF';
  }

  onEachFeature(feature, layer) {
    layer.on({
      mouseover: (e:any) => this.highlightFeature(e, localStorage.getItem('Columna')),
      // mouseout: this.resetHighlight,
      mouseout: (e:any) => this.resetHighlight(e),

    });
  }

  highlightFeature(e:any, columnita: string) {
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
    // console.log(properties['name'])

    //Tipo de label
    if (this.tipo_mapa === 'farmacia') {
      this.label.updateContent( '<h4>Ventas de farmacia ' +  '</h4>' + '<b>'+ properties['name'] +'</b>' + '<br />Densidad:' + properties['density'] + '<br />');
    } else if (this.tipo_mapa === 'impuestosyderechos') {
      this.label.updateContent( '<h4>Patentes de tipo ' + columnita +  '</h4>' + '<b>'+ properties['name'] +'</b>' + '<br />Densidad:' + properties['density'] + '<br />');
    } else if (this.tipo_mapa === 'obrasmunicipales'){
      this.label.updateContent( '<h4>Obras Municipales ' + columnita +  '</h4>' + '<b>'+ properties['name'] +'</b>' + '<br />Densidad:' + properties['density'] + '<br />');
    } else if (this.tipo_mapa ==='transito') {
    this.label.updateContent( '<h4>'+columnita +  ': </h4>' + '<b>'+ properties['name'] +'</b>' + '<br />Densidad:' + properties['density'] + '<br />');

    }
  }

  resetHighlight = (e) => {
    const layer: GeoJSON = e.target;
    layer.setStyle({
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
    });
  }

  updateLegend(valorMaximo: number): void {
    const self = this; // Captura `this` en una variable
    this.legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend');
      const factors = [0, 0.2, 0.4, 0.6, 0.8];
      var grades = factors.map((factor) => Number((valorMaximo * factor).toFixed(0)));
      var labels = [];

      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
          '<i style="background:' + self.getColor(grades[i] + 1, valorMaximo) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '&ndash;'+valorMaximo);
      }

      return div;
    };
  }

  updateColumna(columna) {
    this.columnaResaltada = columna
    localStorage.setItem('Columna', columna)
    this.initializeMapData()
  }

  formatDate(dateInput) {
    if (typeof dateInput === 'string') {
      // Si ya es una cadena, asumimos que está en el formato correcto
      return dateInput;
    } else if (dateInput instanceof Date) {
      // Si es un objeto Date, convertimos a 'yyyy-mm-dd'
      return dateInput.toISOString().split('T')[0];
    } else {
      // Si no es ninguno de los anteriores, devolvemos null o puedes manejarlo de la manera que prefieras
      return null;
    }
  }

  initializeSlider(fecha_inicio, fecha_fin) {
    // console.log('inicializando slider')

    let minValue = new Date(fecha_inicio).getTime();
    let maxValue = new Date(fecha_fin).getTime();

    const yearms = 31536000000
    const step = yearms

    const minSliderValue= new Date(fecha_inicio).getTime();
    const maxSliderValue= new Date(fecha_fin).getTime();

    this.slider_value = minSliderValue;
    this.slider_highvalue= maxSliderValue;
    this.slider_options = {
      floor: minSliderValue,
      ceil: maxSliderValue,
      step: step,
      noSwitching: true,
      translate: (value: number): string => {
        return this.formatDateSlider(value)
      },
      getPointerColor: (value:number): string => {return '#FC3D59'},
    };

  }

  // Función para convertir milisegundos en una cadena de fecha legible
  formatDateSlider(milliseconds: number, fecha_django = false): string {
    const date = new Date(milliseconds);
    if (fecha_django === false) {
      return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    } else if (fecha_django === true) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }
    else {
      return 'error'
    }
  }

  formatColumnName(name) {
    // Reemplaza los espacios y puntos por nada
    return name.replace(/[\s\.]/g, '');
  }


  
  





  /////////////////////
  /* Imports */


// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

/* Chart code */
// Create root element
// https://www.amcharts.com/docs/v5/getting-started/#Root_element
// let root = am5.Root.new("chartdiv");


// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/



// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/



// Add legend
// https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/



// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/



// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/



// Add labels



// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/


}
