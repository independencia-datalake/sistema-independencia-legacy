import { OrdenIngresoProducto } from "./ordeningresoproducto"
import { ProductoFarmacia } from "./productofarmacia"

export interface ProductoIngresado {
    id?: number;
    cantidad?: any;
    lote?: string;
    precio_compra?: any;
    precio_venta?: any;
    n_factura?: string;
    nombre?: ProductoFarmacia;
    n_venta?: OrdenIngresoProducto;
  }