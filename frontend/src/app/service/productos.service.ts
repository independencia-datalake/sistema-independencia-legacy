import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { response } from 'express';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { ComprobanteVenta } from '../interface/farmacia/comprobanteventa';
import { ProductoFarmacia } from '../interface/farmacia/productofarmacia';
import { ProductoVendido } from '../interface/farmacia/productovendido';
import { Recetas } from '../interface/farmacia/recetas';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  apiUrl = environment.apiURL;

  constructor(private http: HttpClient) {  }

  // ASOCIADO A PRODUCTOS
  getProductos() {
    return this.http.get(`${this.apiUrl}/farmacia/productofarmacia/`)
      .pipe(map((response: any) => response.map(item => ({ id: item.id, marca_producto: item.marca_producto, precio: item.precio }))));
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

  updateProductoVendido(id_productovendido, producto_editado): Observable<any> {
    const url = `${this.apiUrl}/farmacia/productovendido/update/${id_productovendido}/`;
    return this.http.patch<any>(url, producto_editado);
  }

  deleteProductoVendido(id_productovendido): Observable<ProductoVendido> {
    return this.http.delete<ProductoVendido>(`${this.apiUrl}/farmacia/productovendido/delete/${id_productovendido}/`)
  }

  getComprobanteventa() {
    return this.http.get<ProductoVendido>(`${this.apiUrl}/farmacia/comprobanteventa/`)
    .pipe(map((response: any) => response.map(item => ({ id: item.id, created: item.created, comprador: item.comprador, farmaceuta: item.farmaceuta}))));
  }

  deleteComprobanteventa(id_comprobante): Observable<ComprobanteVenta> {
    return this.http.delete<ComprobanteVenta>(`${this.apiUrl}/farmacia/comprobanteventa/delete/${id_comprobante}/`)
  }

  // RECETAS

  createReceta(receta, comprobante_venta_id): Observable<Recetas> {
    const formData = new FormData();
    formData.append('receta', receta);
    formData.append('comprobante_venta', comprobante_venta_id);
    return this.http.post<Recetas>(`${this.apiUrl}/farmacia/recetas/`, formData);
}

  getRecetasPorVenta(venta_id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/farmacia/recetas-por-venta/${venta_id}/`);
  }
}
