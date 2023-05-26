import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { ProductoFarmacia } from '../interface/farmacia/productofarmacia';
import { Observable, map } from 'rxjs';
import { BodegaVirtual } from '../interface/farmacia/bodegavirtual';
import { ProductoMermado } from '../interface/farmacia/productomermado';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  apiUrl = environment.apiURL;

  constructor(private http: HttpClient) {  }


//STOCK
getBodega() {
  return this.http.get<BodegaVirtual>(`${this.apiUrl}/stock/bodegavirtual/`)
  .pipe(map((response: any) => response.map(item => ({ id: item.id, stock: item.stock, stock_min: item.stock_min, holgura: item.holgura, id_producto: item.nombre}))));
}

getBodegaByProducto(id_producto): Observable<BodegaVirtual> {
  return this.http.get(`${this.apiUrl}/stock/bodegavirtual-by-producto/${id_producto}/`);
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
  return this.http.post<BodegaVirtual>(`${this.apiUrl}/stock/bodegavirtual/`, bodega);
}


// SALIDA DE STOCK
salidaProducto(salidaProducto: ProductoMermado): Observable<ProductoMermado> {
  return this.http.post<ProductoMermado>(`${this.apiUrl}/stock/productomermado/`, salidaProducto)
}
}

