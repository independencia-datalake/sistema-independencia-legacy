import { Uv } from "./uv"

export interface Persona {
    id?: number;
    tipo_identificacion?: string;
    numero_identificacion?: string;
    nombre_persona?: string;
    apellido_paterno?: string;
    apellido_materno?: string;
    nombre_completo?: string;
    fecha_nacimiento?: any;
    estado_civil?: string;
    hijos?: any;
    nacionalidad?: string;
    enfermedad?: string;
    medicamento?: string;
    lugar_de_atencion?: string;
    discapacidad?: boolean;
    certificado_compin?: boolean;
    embarazo?: boolean;
    certificado_embarazo?: boolean;
    created?: string;
    updated: string;
    uv?: Uv;
  }
