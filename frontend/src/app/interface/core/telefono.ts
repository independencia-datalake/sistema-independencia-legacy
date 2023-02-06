import { Persona } from "./persona"

export interface Telefono {
  id?: number;
  telefono?: string;
  telefono_secundario?: string;
  tipo_telefono?: any;
  tipo_telefono_secundario?: any;
  persona?: Persona;
  }