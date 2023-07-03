import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { ProductoFarmacia } from '../interface/farmacia/productofarmacia';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { BodegaVirtual } from '../interface/farmacia/bodegavirtual';
import { ProductoMermado } from '../interface/farmacia/productomermado';
import { ProductoIngresado } from '../interface/farmacia/productoingresado';
import { OrdenIngresoProducto } from '../interface/farmacia/ordeningresoproducto';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  apiUrl = environment.apiURL;
  token = localStorage.getItem('token')
  headers = new HttpHeaders();

  constructor(private http: HttpClient) {
    this.headers = this.headers.set('Authorization', `Bearer ${this.token}`);
   }


//STOCK
getBodega() {
  return this.http.get<BodegaVirtual>(`${this.apiUrl}/stock/bodegavirtual/`, {headers: this.headers})
  .pipe(map((response: any) => response.map(item => ({ id: item.id, stock: item.stock, stock_min: item.stock_min, holgura: item.holgura, id_producto: item.nombre}))));
}

getBodegaLista( search = '', page: number, pageSize: number) {
  return this.http.get<BodegaVirtual>(`${this.apiUrl}/stock/bodegavirtual-lista/?page=${page}&page_size=${pageSize}&search=${search}`, {headers: this.headers})
}

getBodegaByProducto(id_producto): Observable<BodegaVirtual> {
  return this.http.get(`${this.apiUrl}/stock/bodegavirtual-by-producto/${id_producto}/`, {headers: this.headers});
}

// CREACION DE STOCK

createBodega(idProducto: any, stockMinimo: number): Observable<BodegaVirtual> {
  const bodega: BodegaVirtual = {
    nombre: idProducto,
    stock: 0,
    stock_min: stockMinimo, // Asignar el valor del stock mínimo proporcionado
    stock_max: 0,
    holgura: 0,
  };
  return this.http.post<BodegaVirtual>(`${this.apiUrl}/stock/bodegavirtual/`, bodega, {headers: this.headers});
}


// SALIDA DE STOCK
salidaProducto(salidaProducto: ProductoMermado): Observable<ProductoMermado> {
  return this.http.post<ProductoMermado>(`${this.apiUrl}/stock/productomermado/`, salidaProducto, {headers: this.headers})
}
// INGRESO DE PRODUCTO
getEstadoIngreso() {
  return this.http.get(`${this.apiUrl}/stock/ordeningresoproducto/`, {headers: this.headers})
}

createEstadoIngreso(estadoOrdenIngreso: OrdenIngresoProducto): Observable<OrdenIngresoProducto> {
  return this.http.post<OrdenIngresoProducto>(`${this.apiUrl}/stock/ordeningresoproducto/`, estadoOrdenIngreso, {headers: this.headers})
}

updateEstadoIngreso(id): Observable<OrdenIngresoProducto> {
  let estadoOrdenIngreso = {
    estado: true
  };
  return this.http.put<OrdenIngresoProducto>(`${this.apiUrl}/stock/ordeningresoproducto/update/${id}/`, estadoOrdenIngreso, {headers: this.headers})
}

getFichaIngreso() {
  return this.http.get(`${this.apiUrl}/stock/ordeningresolista/`, {headers: this.headers})
}

fichaIngreso(producto_ingresar: ProductoIngresado): Observable<ProductoIngresado> {
  return this.http.post<ProductoIngresado>(`${this.apiUrl}/stock/ordeningresolista/`, producto_ingresar, {headers: this.headers})
}

deteleProductosIngresados(): Observable<any> {
  return this.http.get(`${this.apiUrl}/stock/ordeningresolista/`, {headers: this.headers}).pipe(
    switchMap((data: any[]) => {
      // Mapea cada item a un observable de una solicitud DELETE
      const deleteObservables = data.map(item =>
        this.http.delete(`${this.apiUrl}/stock/ordeningresolista/delete/${item.id}`, {headers: this.headers})
      );
      // forkJoin espera a que todos los observables se completen
      return forkJoin(deleteObservables);
    })
  );
}

createProductoIngresado(producto_ingresado: ProductoIngresado): Observable<ProductoIngresado> {
  return this.http.post<ProductoIngresado>(`${this.apiUrl}/stock/productoingresado/`, producto_ingresado, {headers: this.headers})
}
}

