import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { response } from 'express';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { ComprobanteVenta } from '../interface/farmacia/comprobanteventa';
import { ProductoFarmacia } from '../interface/farmacia/productofarmacia';
import { ProductoVendido } from '../interface/farmacia/productovendido';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  apiUrl = environment.apiURL;

  constructor(private http: HttpClient) {  }

  // ASOCIADO A PRODUCTOS
  getProductos() {
    return this.http.get(`${this.apiUrl}/farmacia/productofarmacia/`)
      .pipe(map((response: any) => response.map(item => ({ id: item.id, marca_producto: item.marca_producto }))));
  }

  getProductoByid(id_producto): Observable<ProductoFarmacia> {
    return this.http.get<ProductoFarmacia>(`${this.apiUrl}/farmacia/productofarmacia/${id_producto}`);
  }

  createProducto(producto: ProductoFarmacia): Observable<ProductoFarmacia> {
    return this.http.post<ProductoFarmacia>(`${this.apiUrl}/farmacia/productofarmacia/`, producto);
  }

  venderProducto(productovendido: ProductoVendido): Observable<ProductoVendido> {
    return this.http.post<ProductoVendido>(`${this.apiUrl}/farmacia/productovendido/`, productovendido)
  }

  // ASOCIADO A VENTA
  createComprobanteventa(comprobanteventa: ComprobanteVenta): Observable<ComprobanteVenta> {
    return this.http.post<ComprobanteVenta>(`${this.apiUrl}/farmacia/comprobanteventa/`, comprobanteventa)
  }

  getProductosvendidos() {
    return this.http.get<ProductoVendido>(`${this.apiUrl}/farmacia/productovendido/`)
      .pipe(map((response: any) => response.map(item => ({ id: item.id, nombre: item.nombre, cantidad: item.cantidad, precio_venta: item.precio_venta, n_venta: item.n_venta }))));
  }

  getComprobanteventa() {
    return this.http.get<ProductoVendido>(`${this.apiUrl}/farmacia/comprobanteventa/`)
    .pipe(map((response: any) => response.map(item => ({ id: item.id, created: item.created, comprador: item.comprador, farmaceuta: item.farmaceuta}))));
  }

}
