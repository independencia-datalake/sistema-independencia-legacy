import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { response } from 'express';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { ComprobanteVenta } from '../interface/farmacia/comprobanteventa';
import { ProductoFarmacia } from '../interface/farmacia/productofarmacia';
import { ProductoVendido } from '../interface/farmacia/productovendido';
import { Recetas } from '../interface/farmacia/recetas';
import { Laboratorios } from '../interface/farmacia/laboratorios';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  apiUrl = environment.apiURL;
  token = localStorage.getItem('token')
  headers = new HttpHeaders();

  constructor(private http: HttpClient) {
    this.headers = this.headers.set('Authorization', `Bearer ${this.token}`);
   }

  // ASOCIADO A PRODUCTOS
  getProductos() {
    return this.http.get(`${this.apiUrl}/farmacia/productofarmacia/`, {headers: this.headers})
      .pipe(map((response: any) => response.map(item => ({ id: item.id, marca_producto: item.marca_producto, precio: item.precio, dosis: item.dosis, proveedor: item.proveedor, presentacion: item.presentacion, p_a: item.p_a, laboratorio: item.laboratorio, cenabast: item.cenabast, bioequivalencia: item.bioequivalencia }))));
  }

  getProductosLista(search = '',page: number, pageSize: number) {
    return this.http.get(`${this.apiUrl}/farmacia/productofarmacia-lista/?page=${page}&page_size=${pageSize}&search=${search}`, {headers: this.headers})
      // .pipe(map((response: any) => response.results.map(item => ({ id: item.id, marca_producto: item.marca_producto, precio: item.precio, dosis: item.dosis, proveedor: item.proveedor, presentacion: item.presentacion, p_a: item.p_a, laboratorio: item.laboratorio, cenabast: item.cenabast, bioequivalencia: item.bioequivalencia }))));
  }

  getProductoByid(id_producto): Observable<ProductoFarmacia> {
    return this.http.get<ProductoFarmacia>(`${this.apiUrl}/farmacia/productofarmacia/${id_producto}`, {headers: this.headers});
  }

  createProducto(producto: ProductoFarmacia): Observable<ProductoFarmacia> {
    return this.http.post<ProductoFarmacia>(`${this.apiUrl}/farmacia/productofarmacia/`, producto, {headers: this.headers});
  }

  updateProducto(id_producto, producto_editado): Observable<any> {
    const url = `${this.apiUrl}/farmacia/productofarmacia/update/${id_producto}/`;
    return this.http.patch<any>(url, producto_editado, {headers: this.headers});
  }

  venderProducto(productovendido: ProductoVendido): Observable<ProductoVendido> {
    return this.http.post<ProductoVendido>(`${this.apiUrl}/farmacia/productovendido/`, productovendido, {headers: this.headers})
  }

  // ASOCIADO A VENTA
  createComprobanteventa(comprobanteventa: ComprobanteVenta): Observable<ComprobanteVenta> {
    return this.http.post<ComprobanteVenta>(`${this.apiUrl}/farmacia/comprobanteventa/`, comprobanteventa, {headers: this.headers})
  }

  getLastComprobante(): Observable<ComprobanteVenta> {
    return this.http.get<ComprobanteVenta>(`${this.apiUrl}/farmacia/comprobanteventa/ultimo/`, {headers: this.headers})
  }

  getProductosvendidos() {
    return this.http.get<ProductoVendido>(`${this.apiUrl}/farmacia/productovendido/`, {headers: this.headers})
      .pipe(map((response: any) => response.map(item => ({ id: item.id, nombre: item.nombre, cantidad: item.cantidad, precio_venta: item.precio_venta, n_venta: item.n_venta }))));
  }

  updateProductoVendido(id_productovendido, producto_editado): Observable<any> {
    const url = `${this.apiUrl}/farmacia/productovendido/update/${id_productovendido}/`;
    return this.http.patch<any>(url, producto_editado, {headers: this.headers});
  }

  deleteProductoVendido(id_productovendido): Observable<ProductoVendido> {
    return this.http.delete<ProductoVendido>(`${this.apiUrl}/farmacia/productovendido/delete/${id_productovendido}/`, {headers: this.headers})
  }

  getComprobanteventa() {
    return this.http.get<ProductoVendido>(`${this.apiUrl}/farmacia/comprobanteventa/`, {headers: this.headers})
    .pipe(map((response: any) => response.map(item => ({ id: item.id, created: item.created, comprador: item.comprador, farmaceuta: item.farmaceuta, estado: item.estado}))));
  }

  getComprobanteventaLista(search = '',page: number, pageSize: number) {
    return this.http.get<ProductoVendido>(`${this.apiUrl}/farmacia/comprobanteventa-lista/?page=${page}&page_size=${pageSize}&search=${search}`, {headers: this.headers})
  }

  updateComprobanteventa(id_productovendido, producto_nuevo_estado): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/farmacia/comprobanteventa/update/${id_productovendido}/`,producto_nuevo_estado, {headers: this.headers})
  }

  deleteComprobanteventa(id_comprobante): Observable<ComprobanteVenta> {
    return this.http.delete<ComprobanteVenta>(`${this.apiUrl}/farmacia/comprobanteventa/delete/${id_comprobante}/`, {headers: this.headers})
  }

  // RECETAS

  createReceta(receta, comprobante_venta_id): Observable<Recetas> {
    const formData = new FormData();
    formData.append('receta', receta);
    formData.append('comprobante_venta', comprobante_venta_id);
    return this.http.post<Recetas>(`${this.apiUrl}/farmacia/recetas/`, formData, {headers: this.headers});
}

  getRecetasPorVenta(venta_id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/farmacia/recetas-por-venta/${venta_id}/`, {headers: this.headers});
  }

  // LABORATORIOS
  createLab(lab): Observable<Laboratorios> {
    const laboratorio: Laboratorios = {
      nombre_laboratorio: lab
    }
    return this.http.post<Laboratorios>(`${this.apiUrl}/farmacia/laboratorios/`, laboratorio, {headers: this.headers});
  }

  getLabByNombre(nombre: any): Observable<Laboratorios> {
    return this.http.get(`${this.apiUrl}/farmacia/laboratorios-by-nombre/${nombre}/`, {headers: this.headers});
  }
}
