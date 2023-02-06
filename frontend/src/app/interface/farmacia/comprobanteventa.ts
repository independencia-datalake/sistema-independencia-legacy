import { Persona } from "../core/persona";
import { User } from "../user";

export interface ComprobanteVenta {
  id?: number;
  comprador?: Persona;
  farmaceuta?: User;
  }