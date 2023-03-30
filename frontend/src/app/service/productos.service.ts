import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { response } from 'express';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { ProductoFarmacia } from '../interface/farmacia/productofarmacia';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  apiUrl = environment.apiURL;

  constructor(private http: HttpClient) {  }

  getProductos() {
    return this.http.get(`${this.apiUrl}/farmacia/productofarmacia/`)
      .pipe(map((response:[]) => response.map(item => item['marca_producto'])));
  }

  createProducto(producto: ProductoFarmacia): Observable<ProductoFarmacia> {
    return this.http.post<ProductoFarmacia>(`${this.apiUrl}/farmacia/productofarmacia/`, producto);
  }
}
