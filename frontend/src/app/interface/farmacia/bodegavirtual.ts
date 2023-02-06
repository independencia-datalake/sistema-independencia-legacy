import { ProductoFarmacia } from "./productofarmacia"

export interface BodegaVirtual {
  id?: number;
  stock?: any;
  stock_min?: any;
  stock_max?: any;
  holgura?: any;
  nombre?: ProductoFarmacia;
  }
