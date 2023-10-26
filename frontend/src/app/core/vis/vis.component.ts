
import { Component, ViewEncapsulation, Inject, NgZone, PLATFORM_ID, HostListener } from '@angular/core';
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

@Component({
  selector: 'app-vis',
  templateUrl: './vis.component.html',
  styleUrls: ['./vis.component.css'],
  encapsulation: ViewEncapsulation.None,
})


export class VisComponent {
  //amcharts root
  private root!: am5.Root;
  isBotoneraFixed = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 60) { // Ajusta esto según la altura de tu barra de navegación
      this.isBotoneraFixed = true;
    } else {
      this.isBotoneraFixed = false;
    }
  }


  uvCoordRequest = this.http.get('../../assets/uv_coordenadas.json');
  geoJsonData: any;
  tipo_mapa: any = 'ninguna';
  subgrupos: any[] = [];
  columnaResaltada: string = 'total';
  map: Map;
  label: any;
  geoJsonLayer: L.GeoJSON;
  public maximo:any;
  legend: L.Control;

  public uvPoblacionData: any;
  public visPoblacionData: any = 'Ninguna';
  public visPoblacionlegend : string = 'Ninguna';
  onToggleChange(value: string) {
    console.log(value)
    this.visPoblacionData = value;
    this.initializeMapData();
    this.visPoblacionlegend = this.visPoblacionData == 'Ninguna' ? 'Total': 'Total Poblacion' ? 'Habitante' : 'Superficie' ? 'Superficie' : 'Porcentaje';
  }



  // dataSource = new MatTableDataSource<data_UV>([...this.dataByUV]);
  dataSource: any[] = [];
  displayedColumns: string[] = ['nombre', 'total', 'comercial'];

  dataPieChart: any[] = [];

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

  calculateDensidad(element, uvData, property, percentageProperty) {
    if (this.visPoblacionData === 'Total Poblacion' && uvData && uvData.total != 0) {
      return parseFloat((1000 * element[property] / uvData.total).toFixed(0));
    } else if (this.visPoblacionData === 'Superficie' && uvData && uvData.superficie != 0) {
      return parseFloat((10000 * element[property] / uvData.superficie).toFixed(2));
    } else if (this.visPoblacionData === 'Porcentaje') {
      return element[percentageProperty];
    } else {
      return element[property];
    }
  }
  calculateValue = (element, uvData, property, percentageProperty) => {
    if (this.visPoblacionData === 'Total Poblacion' && uvData && uvData.total != 0) {
      return (1000*element[property] / uvData.total).toFixed(0);
    } else if (this.visPoblacionData === 'Superficie' && uvData && uvData.superficie != 0) {
      return (10000 * element[property] / uvData.superficie).toFixed(1);
    } else if (this.visPoblacionData === 'Porcentaje') {
      return element[percentageProperty];
    } else {
      return element[property];
    }
  }

  public columnas = [
    { nombre: 'total', resaltada: false, element: 'total' ,nombre_columna:"Total"},
    // { nombre: 'rank', resaltada: false },
    // POBLACION
    { nombre: 'hombres', resaltada: false, element: 'hombres' },
    { nombre: 'mujeres', resaltada: false, element: 'mujeres' },
    { nombre: 'porcentaje_inmigrante', resaltada: false, element: 'porcentaje_inmigrante' },
    { nombre: 'superficie_total', resaltada: false, element: 'superficie_total' },
    { nombre: 'superficie_no_habitada', resaltada: false, element: 'superficie_no_habitada' },
    { nombre: 'superficie', resaltada: false, element: 'superficie' },
    { nombre: 'densidad_habitantekm2', resaltada: false, element: 'densidad_habitantekm2' },
    // VENTAS FARMACIA
    { nombre: 'ventas', resaltada: false, element: 'ventas' },
    // EMPRESAS
    { nombre: 'alcohol', resaltada: false, element: 'alcohol',nombre_columna: "Patentes de Alcohol" },
    { nombre: 'comercial', resaltada: false, element: 'comercial',nombre_columna: "Patentes Comerciales"},
    { nombre: 'profesional', resaltada: false, element: 'profesional',nombre_columna: "Patentes Profesionales"},
    { nombre: 'industrial', resaltada: false, element: 'industrial',nombre_columna: "Patentes Industriales"},
    { nombre: 'microempresa', resaltada: false, element: 'microempresa',nombre_columna: "Patentes Microempresas"},
    { nombre: 'estacionada', resaltada: false, element: 'estacionada',nombre_columna: "Patentes Estacionadas"},
    // EXENCION ASEO
    { nombre: 'porciento50', resaltada: false, element: 'porciento50', nombre_columna: "percentil 50"},
    { nombre: 'porciento75', resaltada: false, element: 'porciento75', nombre_columna: "percentil 75"},
    { nombre: 'porciento100', resaltada: false, element: 'porciento100', nombre_columna: "percentil 100"},
    // DOM
    { nombre: 'anexion', resaltada: false, element: 'anexion', nombre_columna: "Anexión" },
    { nombre: 'antiguas', resaltada: false, element: 'antiguas', nombre_columna: "Antiguas" },
    { nombre: 'anulacion', resaltada: false, element: 'anulacion', nombre_columna: "Anulación" },
    { nombre: 'cambio de destino', resaltada: false, element: 'cambio_destino', nombre_columna: "Cambio de Destino" },
    { nombre: 'fusion', resaltada: false, element: 'fusion', nombre_columna: "Fusión" },
    { nombre: 'ley 20.898', resaltada: false, element: 'ley_20898', nombre_columna: "Ley 20.898" },
    { nombre: 'obras menores', resaltada: false, element: 'obrasmenores', nombre_columna: 'Obras Menores' },
    { nombre: 'permisos de edificacion', resaltada: false, element: 'permisosedificacion', nombre_columna: 'Permisos de Edificación' },
    { nombre: 'recepcion final', resaltada: false, element: 'recepcionfinal', nombre_columna: 'Recepción Final' },
    { nombre: 'regularizaciones', resaltada: false, element: 'regularizaciones', nombre_columna: 'Regularizaciones' },
    { nombre: 'regularizaciones ley 18.591', resaltada: false, element: 'regularizaciones18591', nombre_columna: 'Regularizaciones ley 18.591' },
    { nombre: 'resolucion', resaltada: false, element: 'resolucion', nombre_columna: 'Resolucion' },
    { nombre: 'subdivisiones', resaltada: false, element: 'subdivisiones', nombre_columna: 'Subdivisiones' },
    { nombre: 'ventas por piso', resaltada: false, element: 'ventasporpiso', nombre_columna: 'Ventas por piso' },
    // TRANSITO
    { nombre: 'licencia conducir', resaltada: false, element: 'licencia_conducir', nombre_columna: "Licencias de Conducir" },
    { nombre: 'permiso circulacion', resaltada: false, element: 'permiso_circulacion', nombre_columna: "Permisos de Circulación" },
    // Agrega las columnas restantes aquí...
  ];


  constructor(
    private http: HttpClient,
    private mapa_legacy: MapaLegacyService,
    @Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone
  ) {}


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

    } else if (this.tipo_mapa === 'poblacion') {
      this.mapa_legacy.getRangoFechasGeneralByTipo('impuestosyderechos', 'total').pipe(
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
          return forkJoin([this.mapa_legacy.getPoblacionUV(), this.uvCoordRequest])
        })
      ).subscribe(([poblacionUVData, uvCoordData]) => {
        let densidadPorUV = {};
        const values = Object.values(poblacionUVData);

        let clave = this.columnaResaltada

        values.forEach((element:any) => {
          densidadPorUV[element.uv] = element[clave]
        })

        let densidades = (poblacionUVData as any[]).map(item => item[clave])

        this.maximo = Math.max(...densidades)

        this.dataSource = (poblacionUVData as any[]).map(item => {
          return { nombre:'UV-' + (item.uv), total: item.total, hombres: item.hombres, mujeres: item.mujeres, porcentaje_inmigrante: item.porcentaje_inmigrante, superficie_total: item.superficie_total, superficie_no_habitada: item.superficie_no_habitada, superficie: item.superficie, densidad_habitantekm2: item.densidad_habitantekm2 }
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

      this.displayedColumns = ['nombre', 'rank', 'total', 'hombres', 'mujeres', 'porcentaje_inmigrante', 'superficie_total', 'superficie_no_habitada', 'superficie', 'densidad_habitantekm2'];

    } else if (this.tipo_mapa === 'farmacia') {

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
          // densidadPorUV[element.uv-1] = element[clave];  // Accede a la propiedad de 'element' basada en la clave
          let uvData = this.uvPoblacionData[element.uv - 1]
          densidadPorUV[element.uv - 1] = this.calculateDensidad(element, uvData, clave,clave+'_porcentaje' )
        });

        let densidades = (empresasTotalByUVData as any[]).map(item => {
          // item[clave]
          let uvData = this.uvPoblacionData[item.uv - 1]
          return this.calculateDensidad(item, uvData, clave, clave+'_porcentaje')
        });  // Mapea la propiedad de 'item' basada en la clave

        this.maximo = Math.max(...densidades);

        this.dataSource = empresasTotalByUVData.map(item => {

          let rank = item[`rank_${this.columnaResaltada}`];
          let rank_ly = item[`rank_${this.columnaResaltada}_ly`];
          let uvData = this.uvPoblacionData[item.uv - 1]

          let tipo_patentes = ['total', 'alcohol', 'comercial', 'profesional', 'industrial', 'microempresa', 'estacionada'];
          let values = tipo_patentes.map(palabra => this.calculateValue(item, uvData, palabra, palabra + '_porcentaje'));
          let [total, alcohol, comercial, profesional, industrial, microempresa, estacionada] = values;

          rank = rank || '-';  // Si rank es null o undefined, se le asigna "-"
          rank_ly = rank_ly || '-';

          return { nombre:'UV-' + (item.uv-1), rank: rank, rank_ly: rank_ly, total: total, alcohol: alcohol, comercial: comercial, profesional: profesional, industrial: industrial, microempresa: microempresa, estacionada: estacionada}
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

      this.displayedColumns = ['nombre', 'rank', 'total', 'alcohol', 'comercial', 'profesional', 'industrial', 'microempresa', 'estacionada'];

    } else if (this.tipo_mapa === 'exencionbasura') {
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

          return forkJoin([this.mapa_legacy.getExencionByUV(this.fechaInicio, this.fechaFin), this.uvCoordRequest]);
        })
      ).subscribe(([exencionAseoByUVData, uvCoordData]) => {
        let densidadPorUV = {};
        const values = Object.values(exencionAseoByUVData)
        let clave = this.columnaResaltada

        values.forEach((element:any) => {
          densidadPorUV[element.uv-1] = element[clave];
        })

        let densidades = (exencionAseoByUVData as any[]).map(item => item[clave])

        this.maximo = Math.max(...densidades)

        this.dataSource = (exencionAseoByUVData as any[]).map(item => {
          let rank = item[`rank_${this.columnaResaltada}`];
          rank = rank || '-';
          return { nombre:'UV-' + (item.uv-1), rank: rank, total: item.total, porciento50: item.porciento50, porciento75: item.porciento75, porciento100: item.porciento100}
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

      this.displayedColumns = ['nombre', 'rank', 'total', 'porciento50', 'porciento75', 'porciento100'];



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
        console.log(clave)

        values.forEach(element => {
          // densidadPorUV[element.uv-1] = element[clave];
          let uvData = this.uvPoblacionData[element.uv - 1]
          densidadPorUV[element.uv - 1] = this.calculateDensidad(element, uvData, clave, clave+'_porcentaje')
        })

        let densidades = (obrasMunicipalesByUVData as any[]).map(item => {
          let uvData = this.uvPoblacionData[item.uv - 1]
          return this.calculateDensidad(item, uvData, clave, clave+'_porcentaje')
        })

        this.maximo = Math.max(...densidades);

        this.dataSource = obrasMunicipalesByUVData.map(item => {

          let formattedColumnName = this.formatColumnName(this.columnaResaltada);
          let rank;
          let rank_ly;
          let uvData = this.uvPoblacionData[item.uv - 1]

          let tipo_dom = ['total', 'anexion', 'antiguas', 'anulacion', 'cambiodestino', 'fusion', 'ley 20.898', 'obras menores', 'permisos de edificacion', 'recepcion final', 'regularizaciones', 'regularizaciones ley 18.591', 'resolucion', 'subdivisiones', 'ventas por piso']
          let values = tipo_dom.map(palabra => this.calculateValue(item,uvData,palabra,palabra+'_porcentaje'))
          let [total, anexion, antiguas, anulacion, cambio_destino, fusion, ley_20898, obrasmenores, permisos_edificacion, recepcionfinal, regularizaciones, regularizaciones18591, resolucion, subdivisiones, ventasporpiso] = values;

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
                   total: total,
                   anexion: anexion,
                   antiguas: antiguas,
                   anulacion: anulacion,
                   cambio_destino: cambio_destino,
                   fusion: fusion,
                  ley_20898: ley_20898,
                  obrasmenores: obrasmenores,
                  permisosedificacion: permisos_edificacion,
                  recepcionfinal: recepcionfinal,
                   regularizaciones: regularizaciones,
                  regularizaciones18591: regularizaciones18591,
                   resolucion: resolucion,
                   subdivisiones: subdivisiones,
                  ventasporpiso: ventasporpiso}
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
        console.log(licenciasTotalByUVData)

        if (this.columnaResaltada === 'licencia conducir') {
          values.forEach(element => {
            let uvData = this.uvPoblacionData[element.uv - 1];
            densidadPorUV[element.uv - 1] = this.calculateDensidad(element, uvData, 'licencia_conducir', 'licencia_conducir_porcentaje');
          });

          let densidades = (licenciasTotalByUVData as any[]).map(item => {
            let uvData = this.uvPoblacionData[item.uv - 1];
            return this.calculateDensidad(item, uvData, 'licencia_conducir', 'licencia_conducir_porcentaje');
          });

          this.maximo = Math.max(...densidades);
        } else if (this.columnaResaltada === 'permiso circulacion') {
          values.forEach(element => {
            let uvData = this.uvPoblacionData[element.uv - 1];
            densidadPorUV[element.uv - 1] = this.calculateDensidad(element, uvData, 'permiso_circulacion', 'permiso_circulacion_porcentaje');
          });

          let densidades = (licenciasTotalByUVData as any[]).map(item => {
            let uvData = this.uvPoblacionData[item.uv - 1];
            return this.calculateDensidad(item, uvData, 'permiso_circulacion', 'permiso_circulacion_porcentaje');
          });

          this.maximo = Math.max(...densidades);
        }

        this.dataSource = licenciasTotalByUVData.map(item => {
          let rank = this.columnaResaltada === 'licencia conducir' ? item.rank_licencia : item.rank_permiso;
          let rank_ly = this.columnaResaltada === 'licencia conducir' ? item.rank_licencia_ly : item.rank_permiso_ly;
          let uvData = this.uvPoblacionData[item.uv - 1];

          let licencia_conducir = this.calculateValue(item, uvData, 'licencia_conducir', 'licencia_conducir_porcentaje');
          let permiso_circulacion = this.calculateValue(item, uvData, 'permiso_circulacion', 'permiso_circulacion_porcentaje');

          rank = rank || '-';  // Si rank es null o undefined, se le asigna "-"
          rank_ly = rank_ly || '-';

          return { nombre:'UV-' + (item.uv-1), rank: rank, rank_ly: rank_ly, licencia_conducir: licencia_conducir, permiso_circulacion: permiso_circulacion }
        });
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
    // this.map = new Map('map-vis', mapOptions).setView([-33.416793, -70.662822], 14);
    this.map = new Map('map-vis', mapOptions).setView([-33.416793, -70.662822], 14);


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

    this.mapa_legacy.getPoblacionUV().subscribe(data => {
      this.uvPoblacionData = data;
      this.uvPoblacionData.unshift({
        id: 0,
        total: 10000000000000,
        superficie: 100000000000,
        superficie_total: 1000000000000,
        // Agrega aquí las demás propiedades que necesites
      });
    })

      // Añadir el objeto a uvPoblacionData
      // this.uvPoblacionData['UV-0'] = {Total: '1', 'Superficie m2': '1'};

    // });

  }


  tipoMapaChange(opcion: string) {
    this.tipo_mapa = opcion
    if (this.tipo_mapa === 'farmacia') {
      this.columnaResaltada = 'ventas'
      localStorage.setItem('Columna', 'ventas')
    } else if(this.tipo_mapa === 'impuestosyderechos') {
      this.columnaResaltada = 'total'
      localStorage.setItem('Columna', 'total')
      this.subgrupos = [
        { titulo: 'Total', abierto: "total", descripcion: 'Una patente es un derecho exclusivo que concede el Estado para la protección de una invención, la que proporciona derechos exclusivos que permitirán utilizar y explotar su invención e impedir que terceros la utilicen sin su consentimiento. Si opta por no explotar la patente, puede venderla o ceder los derechos a otra empresa para que la comercialice bajo licencia.' },
        { titulo: 'Alcohol', abierto: "alcohol", descripcion: 'Permiso otorgado a los contribuyentes, sean estos personas naturales y/o jurídicas constituidas legalmente, que deseen expender, consumir o mantener bebidas alcohólicas para su comercialización. Todos los establecimientos de expendio de bebidas alcohólicas quedarán clasificados dentro de categorías y tendrán las características que se señalan conforme la Ley N° 19.925 sobre Expendio y Consumo de Bebidas Alcohólicas.' },
        { titulo: 'Comercial', abierto: "comercial", descripcion: 'La Patente Comercial es un permiso municipal que deben tramitar todos quienes deseen desarrollar o ejercer una actividad comercial en una comuna. Para establecimientos de Comercio, es decir, establecimientos destinados principalmente a las actividades de compraventa de mercaderías diversas'  },
        { titulo: 'Profesional', abierto: "profesional", descripcion: 'Las personas que ejerzan profesiones liberales o cualquier otra profesión u ocupación lucrativa, es decir cualquier actividad ejercida en forma independiente por personas naturales y en la cual predomine el trabajo personal basado en el conocimiento de una ciencia, arte, oficio o técnica por sobre el empleo de maquinarias, herramientas, equipos u otros bienes de capital, pagarán su patente anual sólo en la comuna donde tengan instalada su consulta, estudio u oficina principal, lo que las habilitará para ejercer en todo el territorio nacional.' },
        { titulo: 'Industrial', abierto: "industrial", descripcion: 'Para establecimientos industriales, es decir, para negocios cuyo giro es la producción o manufacturas, como panaderías, fábricas de productos, alimentos, etc. Tales establecimientos serán calificados caso a caso por el Secretaría Regional Ministerial de Salud respectiva, en consideración a los riesgos que su funcionamiento pueda causar a sus trabajadores, vecindario y comunidad; para estos efectos, se calificarán como sigue: Peligroso, Insalubre o Contaminante, Molesto, Inofensivo.' },
        { titulo: 'Microempresa', abierto: "microempresa", descripcion: 'El otorgamiento de patente a las microempresas familiares se regular por lo establecido en la Ley N° 19.749, que Establece Normas para la Creación de Microempresas Familiares, cuyo objeto fue procurar una vía más expedita para la formalización de sus actividades, beneficiando así a quienes, contando con recursos limitados, ejerzan una actividad económica lícita, que no sea peligrosa, contaminante o molesta, exceptuándola de las limitaciones relativas a la zonificación comercial o industrial y de algunas autorizaciones previas de tipo sanitario y otras que contemplen las leyes.' },
        { titulo: 'Estacionada', abierto: "estacionada", descripcion: 'Se entenderá como feria libre, el comercio que se ejerce en la vía pública, en los días y horarios fijados por la Municipalidad, en los cuales se expenden artículos alimenticios de origen natural, vegetal o mineral. Los permisos para el comercio en la ferias son personales, intransferibles e intransmisibles de acuerdo a lo señalado en la Ley orgánica constitucional de Municipalidades. Los feriantes deberán pagar las patentes correspondientes a los derechos que señale la respectiva Ordenanza Municipal, sin perjuicio de sus obligaciones tributarias según lo dispuso en el artículo 24 de la Ley sobre Impuesto a la Renta.' }
      ]
    } else if (this.tipo_mapa === 'exencionbasura') {
      this.columnaResaltada = 'total'
      localStorage.setItem('Columna', 'total')
    } else if(this.tipo_mapa === 'obrasmunicipales'){
      this.columnaResaltada ='total'
      localStorage.setItem('Columna', 'total')
      this.subgrupos = [
        { titulo: 'Total', descripcion: 'Descripción de total', abierto: "total" },
        { titulo: 'Anexión', descripcion: 'Descripción de anexión', abierto: "anexion" },
        { titulo: 'Antiguas', descripcion: 'Descripción de antiguas', abierto: "antiguas" },
        { titulo: 'Anulación', descripcion: 'Descripción de anulación', abierto: "anulacion" },
        { titulo: 'Cambio de destino', descripcion: 'Descripción de cambio de destino', abierto: "cambio de destino" },
        { titulo: 'Fusión', descripcion: 'Descripción de fusión', abierto: "fusion" },
        { titulo: 'Ley 20.898', descripcion: 'Descripción de ley 20.898', abierto: "ley 20.898" },
        { titulo: 'Obras menores', descripcion: 'Descripción de obras menores', abierto: "obras menores" },
        { titulo: 'Permisos de edificación', descripcion: 'Descripción de permisos de edificación', abierto: "permisos de edificacion" },
        { titulo: 'Recepción final', descripcion: 'Descripción de recepción final', abierto: "repecion final" },
        { titulo: 'Regularizaciones', descripcion: 'Descripción de regularizaciones', abierto: "regularizaciones" },
        { titulo: 'Regularizaciones ley 18.591', descripcion: 'Descripción de regularizaciones ley 18.591', abierto: "regularizaciones ley 18.591" },
        { titulo: 'Resolución', descripcion: 'Descripción de resolución', abierto: "resolucion" },
        { titulo: 'Subdivisiones', descripcion: 'Descripción de subdivisiones', abierto: "subdivisiones" },
        { titulo: 'Ventas por piso', descripcion: 'Descripción de ventas por piso', abierto: "ventas por piso" }
      ];
    } else if (this.tipo_mapa === 'transito') {
      this.columnaResaltada = 'licencia conducir'
      localStorage.setItem('Columna', 'licencia conducir')
      this.subgrupos =  [
        { titulo: 'Licencias de Conducir', descripcion: 'Descripción de licencias de conducir', abierto: "licencia conducir" },
        { titulo: 'Permisos de Circulación', descripcion: 'Descripción de permisos de circulación', abierto: "permiso circulacion" },
      ];
    }

    this.initializeMapData()
  }

  fechaChange(flag_slider = false) {

    let fechaInicioString = this.formatDate(this.fechaInicio);
    let fechaFinString = this.formatDate(this.fechaFin);

    // console.log(fechaInicioString)
    // console.log(fechaFinString)

    this.initializeMapData(fechaInicioString, fechaFinString, flag_slider);
    console.log('=====DATA SOURCE====')
    console.log(this.dataSource)
    console.log('=====DATA SOURCE====')
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
    } else if (this.tipo_mapa === 'poblacion') {
      this.label.updateContent( '<h4>Poblacion  ' + columnita +  '</h4>' + '<b>'+ properties['name'] +'</b>' + '<br />Densidad:' + properties['density'] + '<br />');
    } else if (this.tipo_mapa === 'impuestosyderechos') {
      if (this.visPoblacionData === 'Total Poblacion') {
        this.label.updateContent( '<h4>Patentes de tipo ' + columnita +  '<br /> por cada 1000 habitantes: </h4>' + '<b>'+ properties['name'] +'</b>' + '<br />Densidad:' + properties['density'] + '<br />');
      } else if (this.visPoblacionData === 'Superficie') {
        this.label.updateContent( '<h4>Patentes de tipo ' + columnita +  '<br />por hectarea: </h4>' + '<b>'+ properties['name'] +'</b>' + '<br />Densidad:' + properties['density'] + '<br />');
      } else if (this.visPoblacionData === 'Porcentaje') {
        this.label.updateContent( '<h4>Porcentaje de Patentes de ' + columnita +  '</h4>' + '<b>'+ properties['name'] +'</b>' + '<br />Densidad:' + properties['density'] + '<br />');
      } else {
        this.label.updateContent( '<h4>Patentes de tipo ' + columnita +  '</h4>' + '<b>'+ properties['name'] +'</b>' + '<br />Densidad:' + properties['density'] + '<br />');
      }
    } else if (this.tipo_mapa === 'exencionbasura') {
      this.label.updateContent( '<h4>Exencion Basura ' + columnita +  '</h4>' + '<b>'+ properties['name'] +'</b>' + '<br />Densidad:' + properties['density'] + '<br />');
    } else if (this.tipo_mapa === 'obrasmunicipales'){
      if (this.visPoblacionData === 'Total Poblacion') {
        this.label.updateContent( '<h4>Obras Municipales<br />' + columnita +  ' por cada 1000 habitantes: </h4>' + '<b>'+ properties['name'] +'</b>' + '<br />Densidad:' + properties['density'] + '<br />');
      } else if ( this.visPoblacionData === 'Superficie') {
        this.label.updateContent( '<h4>Obras Municipales '+columnita +  ' por hectarea: </h4>' + '<b>'+ properties['name'] +'</b>' + '<br />Densidad:' + properties['density'] + '<br />');
      } else if (this.visPoblacionData === 'Porcentaje') {
        this.label.updateContent( '<h4>Porcentaje de Obras Municipales '+columnita +  ': </h4>' + '<b>'+ properties['name'] +'</b>' + '<br />Densidad:' + properties['density'] + '%<br />');
      } else {
        this.label.updateContent( '<h4>Obras Municipales '+columnita +  ': </h4>' + '<b>'+ properties['name'] +'</b>' + '<br />Densidad:' + properties['density'] + '<br />');
      }
    } else if (this.tipo_mapa ==='transito') {
      if (this.visPoblacionData === 'Total Poblacion') {
        this.label.updateContent( '<h4>'+columnita +  ' por cada 1000 habitantes: </h4>' + '<b>'+ properties['name'] +'</b>' + '<br />Densidad:' + properties['density'] + '<br />');
      } else if ( this.visPoblacionData === 'Superficie') {
        this.label.updateContent( '<h4>'+columnita +  ' por hectarea: </h4>' + '<b>'+ properties['name'] +'</b>' + '<br />Densidad:' + properties['density'] + '<br />');
      } else if (this.visPoblacionData === 'Porcentaje') {
        this.label.updateContent( '<h4>Porcentaje de '+columnita +  ': </h4>' + '<b>'+ properties['name'] +'</b>' + '<br />Densidad:' + properties['density'] + '%<br />');
      } else {
        this.label.updateContent( '<h4>'+columnita +  ': </h4>' + '<b>'+ properties['name'] +'</b>' + '<br />Densidad:' + properties['density'] + '<br />');
      }
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

  descargar(){
    console.log('descargar')
  }

  seleccionarOpcion(opcion: string) {
    console.log(`Se seleccionó la opción: ${opcion}`);
    // Aquí puedes realizar las acciones correspondientes a la opción seleccionada
  }

}
