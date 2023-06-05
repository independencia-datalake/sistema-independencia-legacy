
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
import { switchMap } from 'rxjs/operators';
import { MatSelectModule } from '@angular/material/select';
import { MapaLegacyService } from 'src/app/service/mapa-legacy.service';

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

  constructor(private http: HttpClient,
              private empresas: EmpresasServiceService,
              private mapa_legacy: MapaLegacyService,
              ) {

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
    } else if (this.tipo_mapa === 'farmacia') {
      // console.log('farmacia')
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

          return forkJoin([this.mapa_legacy.getEmpresasByUV(this.fechaInicio, this.fechaFin), this.uvCoordRequest]);
        })
      ).subscribe(([empresasTotalByUVData, uvCoordData]) => {
        let densidadPorUV = {};
        const values = Object.values(empresasTotalByUVData);
        if (this.columnaResaltada === 'total') {
          values.forEach(element => {
            densidadPorUV[element.uv-1] = element.total
          });
          let densidades = (empresasTotalByUVData as any[]).map(item => item.total);
          this.maximo = Math.max(...densidades);
        } else if (this.columnaResaltada === 'comercial') {
          values.forEach(element => {
            densidadPorUV[element.uv-1] = element.comercial
          });
          let densidades = (empresasTotalByUVData as any[]).map(item => item.comercial);
          this.maximo = Math.max(...densidades);
        } else if (this.columnaResaltada === 'alcohol') {
          values.forEach(element => {
            densidadPorUV[element.uv-1] = element.alcohol
          });
          let densidades = (empresasTotalByUVData as any[]).map(item => item.alcohol);
          this.maximo = Math.max(...densidades);
        }
        this.dataSource = empresasTotalByUVData.map(item => {
          return { nombre:'UV-' + (item.uv-1), total: item.total, comercial: item.comercial, alcohol: item.alcohol}
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

      this.displayedColumns = ['nombre', 'total', 'comercial', 'alcohol'];


    } else if (this.tipo_mapa === 'obrasmunicipales') {
      this.columnaResaltada = 'total'
      // this.mapa_legacy.getRangoFechasGeneralByTipo(this.tipo_mapa, this.columnaResaltada).pipe(
      //   switchMap(fechas => {
      //     if (fecha_inicio_init && fecha_fin_init) {
      //       this.fechaInicio = fecha_inicio_init
      //       this.fechaFin = fecha_fin_init
      //     } else {
      //       this.fechaInicio = fechas.fecha_inicio
      //       this.fechaFin = fechas.fecha_fin
      //     }

      //     if (flag_slider === true) {
      //     } else if (flag_slider === false) {
      //       this.initializeSlider(this.fechaInicio,this.fechaFin)
      //     }

      //     return forkJoin([this.mapa_legacy.getObrasMunicipalesTotalByUV])
      //   })
      // )


      const ObrasMunicipalesTotalByUV = this.mapa_legacy.getObrasMunicipalesTotalByUV();
      forkJoin([ObrasMunicipalesTotalByUV, this.uvCoordRequest]).subscribe(([ObrasMunicipalesTotalByUVData, uvCoordData]) => {
        let densidadPorUV = {};
        const values = Object.values(ObrasMunicipalesTotalByUVData);
        values.forEach(element => {
          densidadPorUV[element.uv-1] = element.densidad;
        });

        let densidades = (ObrasMunicipalesTotalByUVData as any[]).map(item => item.densidad);
        this.maximo = Math.max(...densidades);

        this.dataSource = ObrasMunicipalesTotalByUVData.map(item => {
          return { nombre:'UV-' + (item.uv-1), total: item.densidad}
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
      this.displayedColumns = ['nombre', 'total'];

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
          return { nombre:'UV-' + (item.uv-1), licencia_conducir: item.licencia_conducir, permiso_circulacion: item.permiso_circulacion}
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
      this.displayedColumns = ['nombre', 'licencia conducir', 'permiso circulacion'];
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
  }

  tipoMapaChange(opcion: string) {
    this.tipo_mapa = opcion
    if (this.tipo_mapa === 'farmacia') {

    } else if(this.tipo_mapa === 'impuestosyderechos') {
      this.columnaResaltada = 'total'
      localStorage.setItem('Columna', 'total')
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

}
