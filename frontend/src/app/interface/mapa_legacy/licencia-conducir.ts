import { Uv } from "../core/uv"

export interface LicenciaConducir {
  map(arg0: (item: any) => { nombre: string; licencia_conducir: any; }): any[];
  uv?: Uv;
  folio?: string;
  calle?: string;
  numero?: number;
  comuna?: string;
  fecha?: Date;
}
