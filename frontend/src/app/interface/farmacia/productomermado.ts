import { User } from "../user"
import { ProductoFarmacia } from "./productofarmacia"

export interface ProductoMermado {
    id?: number;
    cantidad?: any;
    motivo?: any;
    nombre?: ProductoFarmacia;
    farmaceuta?: User;
  }