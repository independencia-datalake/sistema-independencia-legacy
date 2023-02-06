import { User } from "../user"
import { Laboratorios } from "./laboratorios"

export interface ProductoFarmacia {
  id?: number;
  marca_producto?: string;
  proveedor?: string;
  p_a?: string;
  dosis?: string;
  presentacion?: string;
  precio?: any;
  cenabast?: boolean;
  bioequivalencia?: boolean;
  laboratorio?: Laboratorios;
  autor?: User;
  }
  