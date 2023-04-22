import { Uv } from "../core/uv"


export interface Empresas {
  map(arg0: ({ uv, count }: { uv: any; count: any; }) => { nombre: string; densidad: any; }): unknown;
  uv?: Uv;
  rol?: number;
  razon_social?: string;
  rut?: string;
  giro?: string;
  calle?: string;
  numeracion?: number;
  tipo?: string | null;
  trabajadores_pais?: number | null;
  trabajadores_comuna?: number | null;
  trabajadores_patente?: number | null;
  created?: string;
}
