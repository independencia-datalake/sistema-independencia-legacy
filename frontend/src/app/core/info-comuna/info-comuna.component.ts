import { Component, ViewEncapsulation } from '@angular/core';
import { Map, tileLayer, polygon, marker } from 'leaflet';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';


@Component({
  selector: 'app-info-comuna',
  templateUrl: './info-comuna.component.html',
  styleUrls: ['./info-comuna.component.css'],
  encapsulation: ViewEncapsulation.None,
})



export class InfoComunaComponent {

  puntosInteres: {[key: string]: [string, [number, number], string]} = {};
  opciones_interes: string[];
  markers: any[] = [];
  showMarkers = false;

  puntosSalud: {[key: string]: [string, [number, number], string]} = {};
  opciones_salud: string[];
  markerssalud: any[] = [];
  showMarkerssalud= false;

  puntosEduc: {[key: string]: [string, [number, number], string]} = {};
  opciones_educ: string[];
  markerseduc: any[] = [];
  showMarkerseduc = false;

  puntosMonumento: {[key: string]: [string, [number, number], string]} = {};
  opciones_monumento: string[];
  markersmonumento: any[] = [];
  showMarkersmonumento = false;

  opciones_UV: string[] = [];

  poligono_independencia: any;
  map: Map; // Declarar la variable map como propiedad de la clase
  selectedOption: string;
  private poligonoUV: L.LayerGroup;



  // Crea una capa vacía para los polígonos

  constructor(private http: HttpClient) {
    // PUNTOS DE INTERES
    this.puntosInteres['P1'] = ['Laboratorio Ciudadano', [-33.4251376,-70.651285], 'La paz 482']
    this.puntosInteres['P2'] = ['Municipalidad de Independencia', [-33.4223639,-70.6552055], 'Av. Independencia 753']
    this.puntosInteres['P3'] = ['Polideportivo Enrique Soro', [-33.4174685,-70.6709229], 'Enrique Soro 1090']
    this.opciones_interes= Object.keys(this.puntosInteres)

    // PUNTOS DE SALUD
    this.puntosSalud['P1'] = ['Hospital Clínico de la Universidad de Chile', [-33.4203, -70.6532], 'Santos Dumont 999']
    this.puntosSalud['P2'] = ['Hospital San José', [-33.4162889,-70.6539006], 'Av San José 1196']
    this.puntosSalud['P3'] = ['Hospital Roberto del Río', [-33.4157994,-70.6562174], 'Prof. Zañartu 1085']
    this.puntosSalud['P4'] = ['Instituto de oncología Dr. Caupolicán Pardo Correa', [-33.4177683,-70.6544274], 'Prof. Zañartu 1010']
    this.puntosSalud['P5'] = ['Centro Comunitario de Salud Mental Familiar (COSAM)', [-33.4137618,-70.6548573], 'Avenida Belisario Prats 1485']
    this.puntosSalud['P6'] = ['Centro de Salud Comunitario Familiar (Cecosf) Las Enredaderas', [-33.4059212,-70.6714675], 'Las Enredaderas 2437']
    this.puntosSalud['P7'] = ['Centro de Salud Comunitario Familiar (Cecosf) Soberanía', [-33.4173118,-70.6708501], 'Soberanía N°1180']

    this.opciones_salud= Object.keys(this.puntosSalud)

    // PUNTOS DE EDUCACION
    this.puntosEduc['P1'] = ['Liceo Multigénero Eloísa Díaz', [-33.4096672,-70.6618072], 'Huasco 1889']
    this.puntosEduc['P2'] = ['Liceo Mixto San Francisco de Quito', [-33.4106547,-70.6624192], 'Huasco: 1801']
    this.puntosEduc['P3'] = ['Liceo Mixto Gabriela Mistral', [-33.4159794,-70.6567967], 'Av. Independencia  1225']
    this.puntosEduc['P4'] = ['Liceo P. Mixto Presidente José Manuel Balmaceda', [-33.4190246,-70.671816], 'Salomón Sack 331']
    this.puntosEduc['P5'] = ['Escuela de Párvulos Antu Huilen', [-33.4217389,-70.6664755], 'Gamero 1985']
    this.puntosEduc['P6'] = ['Escuela Básica Nueva Zelandia', [-33.4222818,-70.6714061], 'Gamero 2722']
    this.puntosEduc['P7'] = ['Escuela Básica Camilo Mori', [-33.4245018,-70.6666539], 'Baldomero Flores 2096']
    this.puntosEduc['P8'] = ['Escuela Básica Luis Galdames', [-33.4063005,-70.6730905], 'Luis Galdámes 2110']
    this.puntosEduc['P9'] = ['Escuela Básica Cornelia Olivares', [-33.4231028,-70.6564865], 'Maruri  697']
    this.puntosEduc['P10'] = ['Sala Cuna Sonrisitas de Independencia', [-33.4218549,-70.6661176], 'Gamero 1985, esquina Salomón Sack']


    this.opciones_educ = Object.keys(this.puntosEduc)

      // PUNTOS DE MONUMENTOS
      this.puntosMonumento['P1'] = ['Antigua Cervecería Andrés Ebner', [-33.4251454,-70.6545927], 'Av. Independencia 565']
      this.puntosMonumento['P2'] = ['La Casa de Avenida Francia', [-33.4117164,-70.6597669], 'Francia 1442']
      this.puntosMonumento['P3'] = ['Antiguo Hospital San José', [-33.414873,-70.653675], 'San José 1053']
      this.puntosMonumento['P4'] = ['Iglesia y Convento del Buen Pastor', [-33.426322,-70.660367], 'Rivera 2001']
      this.puntosMonumento['P5'] = ['Monasterio del Carmen Bajo', [-33.429608,-70.653191], 'Av. Independencia 225']
      this.puntosMonumento['P6'] = ['Capilla del Antiguo Lazareto de San Vicente de Paul', [-33.421279,-70.650769], 'Santos Dumont 991']
      this.puntosMonumento['P7'] = ['Antiguo Instituto de Higiene', [-33.431228,-70.653559], 'Av. Independencia 56']
      this.puntosMonumento['P8'] = ['Población Manuel Montt', [-33.427638,-70.658558], 'Entre Gamero, Comandante Canales, Vivaceta y Carlos Medina.']
      this.puntosMonumento['P9'] = ['Población Los Castaños', [-33.423984,-70.665232], 'Av. Francia entre Independencia y Vivaceta.']
      this.puntosMonumento['P10'] = ['Anfiteatro Instituto de Anatomía U. de Chile', [-33.4178233,-70.6544564], 'Av. Profesor Zañartu 1130']


      this.opciones_monumento = Object.keys(this.puntosMonumento)

  }




  ngAfterViewInit(): void{
    this.map = new Map('map').setView([-33.414316, -70.664376], 14,); // asignar el valor de la variable map
    tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      // maxZoom: 14
    }).addTo(this.map); // Usar this.map en lugar de map

    const poligonoIndependencia = L.layerGroup().addTo(this.map);
    const poligonoUV = L.layerGroup().addTo(this.map);

    // this.http.get('../../assets/poligono_independencia.json').subscribe(response => {
    //   this.poligono_independencia = response;
    //   const puntos = Object.values(this.poligono_independencia).map(punto => [punto[1], punto[0]]);
    //   const poligono = L.polygon([puntos], {color:'#FC3D59'}).addTo(poligonoIndependencia); // Usar this.map en lugar de map
    //   const popup = poligono.bindPopup("Comuna de Independencia.");
    //   poligono.on('mouseover', function(e) {
    //     popup.openPopup();
    //   });
    //   poligono.on('mouseout', function() {
    //     poligono.closePopup();
    //   });
    // });

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

        // Agregar contenido del popup
        poligono_uv.bindPopup(id);

        // Agregar opciones a la lista
        this.opciones_UV.push(id);

        // Agregar eventos para mostrar/ocultar el popup
        poligono_uv.on('mouseover', function (e) {
          popup.setLatLng(e.latlng)
               .setContent(e.target._popup._content)
               .openOn(mapObj);
          e.target.setStyle({
            weight: 5,
            color: '#FC3D59',
            dashArray: '',
            fillOpacity: 0.7
          });

        });

        poligono_uv.on('mouseout', function (e) {
          mapObj.closePopup(popup);

        // Cambiar el estilo del polígono
        e.target.setStyle({
          weight: 3,
          color: '#FC3D59',
          dashArray: '',
          fillOpacity: 0.2
        });
        });
      }
    });

    var capas = {
    "Polígono Independencia": poligonoIndependencia,
     "Polígono Unidades Vecinales": poligonoUV
    }

    // Agrega la capa al LayerControl
      const layerControl = L.control.layers(null, capas).addTo(this.map);



  }


  onCheckboxChangeInteres() {
    var redIcon = L.icon({
      iconUrl: '../../../assets/redPin.png',
      iconSize:     [25, 25], // size of the icon
  });
    if (this.showMarkers) {
      // Eliminar todos los marcadores del mapa
      this.markers.forEach(marker => marker.removeFrom(this.map));
      this.markers = [];
    } else {
      // Agregar los marcadores al mapa
      for (let key in this.puntosInteres) {
        const punto = this.puntosInteres[key]
        const marker = L.marker(punto[1], {icon: redIcon}).addTo(this.map);
        marker.bindPopup(`<b>${punto[0]}</b><br>Ubicacion: ${punto[2]}`);
        this.markers.push(marker);
      }
    }
    this.showMarkers = !this.showMarkers;
  }

  onCheckboxChangeSalud() {
    var blueIcon = L.icon({
      iconUrl: '../../../assets/bluePin.png',
      iconSize:     [25, 25], // size of the icon
  });
    if (this.showMarkerssalud) {
      // Eliminar todos los marcadores del mapa
      this.markerssalud.forEach(marker => marker.removeFrom(this.map));
      this.markerssalud = [];
    } else {
      // Agregar los marcadores al mapa
      for (let key in this.puntosSalud) {
        const punto = this.puntosSalud[key]
        const marker = L.marker(punto[1], {icon: blueIcon}).addTo(this.map);
        marker.bindPopup(`<b>${punto[0]}</b><br>Ubicacion: ${punto[2]}`);
        this.markerssalud.push(marker);
      }
    }
    this.showMarkerssalud = !this.showMarkerssalud;
  }
  onCheckboxChangeEducacion() {
    var greenIcon = L.icon({
      iconUrl: '../../../assets/greenPin.png',
      iconSize:     [25, 25], // size of the icon
  });
    if (this.showMarkerseduc) {
      // Eliminar todos los marcadores del mapa
      this.markerseduc.forEach(marker => marker.removeFrom(this.map));
      this.markerseduc = [];
    } else {
      // Agregar los marcadores al mapa
      for (let key in this.puntosEduc) {
        const punto = this.puntosEduc[key]
        const marker = L.marker(punto[1], {icon: greenIcon}).addTo(this.map);
        marker.bindPopup(`<b>${punto[0]}</b><br>Ubicacion: ${punto[2]}`);
        this.markerseduc.push(marker);
      }
    }
    this.showMarkerseduc = !this.showMarkerseduc;

  }

  onCheckboxChangeMonumento() {
    var yellowIcon = L.icon({
      iconUrl: '../../../assets/yellowPin.png',
      iconSize:     [25, 25], // size of the icon
  });
    if (this.showMarkersmonumento) {
      // Eliminar todos los marcadores del mapa
      this.markersmonumento.forEach(marker => marker.removeFrom(this.map));
      this.markersmonumento = [];
    } else {
      // Agregar los marcadores al mapa
      for (let key in this.puntosMonumento) {
        const punto = this.puntosMonumento[key]
        const marker = L.marker(punto[1], {icon: yellowIcon}).addTo(this.map);
        marker.bindPopup(`<b>${punto[0]}</b><br>Ubicacion: ${punto[2]}`);
        this.markersmonumento.push(marker);
      }
    }
    this.showMarkersmonumento = !this.showMarkersmonumento;

  }

  onSelectionChangeInteres() {
    const puntoInteres = this.puntosInteres[this.selectedOption];
    const marker = L.marker(puntoInteres[1]);
    this.map.flyTo(marker.getLatLng(), 16);
  }

  onSelectionChangeSalud() {
    const puntoSalud = this.puntosSalud[this.selectedOption];
    const marker = L.marker(puntoSalud[1]);
    this.map.flyTo(marker.getLatLng(), 16);
  }

  onSelectionChangeEducacion() {
    const puntoEduc = this.puntosEduc[this.selectedOption];
    const marker = L.marker(puntoEduc[1]);
    this.map.flyTo(marker.getLatLng(), 16);
  }

  onSelectionChangeMonumento() {
    const puntoMonumento = this.puntosMonumento[this.selectedOption];
    const marker = L.marker(puntoMonumento[1]);
    this.map.flyTo(marker.getLatLng(), 16);
  }

  onSelectionChangeUV() {
    const id = this.selectedOption;
    console.log(this.poligonoUV)
  }
}
