import { Uv } from "../core/uv"

export interface DOM {
  map(arg0: (item: any) => { nombre: string; total: any; }): any[];
  uv?: Uv;
  tramite?: string;
  manzana?: string;
  predio?: number;
  calle?: string;
  numero?: Number;
  n_permiso?: String;
  created?: string;
}
