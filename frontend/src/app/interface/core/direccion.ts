import { Persona } from "./persona"
import { Uv } from "./uv";

export interface Direccion {
  id?: number;
  active?: boolean;
  persona: Persona;
  uv?: Uv;
  calle: string;
  numero: any;
  complemento_direccion: string;
}
