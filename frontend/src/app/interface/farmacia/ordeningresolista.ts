import { ProductoFarmacia } from "./productofarmacia"

export interface Root {
    id?: number;
    cantidad_ingresada?: any;
    precio_compra?: any;
    precio_venta?: any;
    n_lote?: string;
    n_factura?: string;
    producto?: ProductoFarmacia;
  }