import { ComprobanteVenta } from "./comprobanteventa";
import { ProductoFarmacia } from "./productofarmacia";

export interface ProductoVendido {
  id?: number;
  cantidad?: any;
  precio_venta?: any;
  nombre?: ProductoFarmacia;
  n_venta?: ComprobanteVenta;
  }