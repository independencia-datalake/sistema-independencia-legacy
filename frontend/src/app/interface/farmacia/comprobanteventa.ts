import { Persona } from "../core/persona";
import { User } from "../user";

export interface ComprobanteVenta {
  id?: number;
  estado?: string;
  comprador?: Persona;
  farmaceuta?: User;
  }
