import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './core/home/home.component';
import { InfoComunaComponent } from './core/info-comuna/info-comuna.component';
import { InfoUvComponent } from './core/info-uv/info-uv.component';
import { PersonaCrearComponent } from './core/persona-crear/persona-crear.component';
import { PersonaComponent } from './core/persona/persona.component';

import { QnaComponent } from './core/qna/qna.component';
import { QuienesSomosComponent } from './core/quienes-somos/quienes-somos.component';
import { VisComponent } from './core/vis/vis.component';
import { FarmaciaHomeComponent } from './farmacia/farmacia-home/farmacia-home.component';
import { InformesFarmaciaComponent } from './farmacia/informes-farmacia/informes-farmacia.component';
import { StockProductosComponent } from './farmacia/stock-productos/stock-productos.component';
import { VentaComponent } from './farmacia/venta/venta.component';
import { SeguridadHomeComponent } from './seguridad/seguridad-home/seguridad-home.component';

import { AuthGuard } from './guards/auth.guard';
import { AuthFarmaciaGuard } from './guards/authFarmacia.guard';
import { CrearProductoComponent } from './farmacia/crear-producto/crear-producto.component';
import { ComprobanteventaDetailComponent } from './farmacia/comprobanteventa-detail/comprobanteventa-detail.component';
import { InformesProductosComponent } from './farmacia/informes-productos/informes-productos.component';
import { InformesStockComponent } from './farmacia/informes-stock/informes-stock.component';
import { ResumenPersonaComponent } from './farmacia/lista-personas/lista-personas.component';
import { ListaVentaComponent } from './farmacia/lista-ventas/lista-ventas.component';
import { FichaIngresoComponent } from './farmacia/ficha-ingreso/ficha-ingreso.component';
import { FichaSalidaComponent } from './farmacia/ficha-salida/ficha-salida.component';
import { AdminComponent } from './core/admin/admin.component';
import { CargaMasivaComponent } from './farmacia/carga-masiva/carga-masiva.component';
import { EditarPersonaComponent } from './farmacia/editar-persona/editar-persona.component';
import { CargaMasivaPersonasComponent } from './farmacia/carga-masiva-personas/carga-masiva-personas.component';


const routes: Routes = [
  // AUTH
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  // CORE
  { path: '', component: HomeComponent },
  { path: 'quienes', component: QuienesSomosComponent, canActivate: [AuthGuard] },
  { path: 'qna', component: QnaComponent },
  { path: 'persona', component: PersonaComponent },
  { path: 'persona/crear', component: PersonaCrearComponent },
  { path: 'persona/carga-masiva', component: CargaMasivaPersonasComponent  },
  { path: 'vis', component: VisComponent, canActivate: [AuthGuard] },
  { path: 'conoce-tu-area', component: InfoComunaComponent },
  { path: 'ficha-barrial', component: InfoUvComponent },

  // FARMACIA
  { path: 'farmacia', component: FarmaciaHomeComponent, canActivate: [AuthFarmaciaGuard] },
  { path: 'farmacia/informes', component: InformesFarmaciaComponent, canActivate: [AuthFarmaciaGuard] },
  { path: 'farmacia/venta', component: VentaComponent, canActivate: [AuthFarmaciaGuard] },
  { path: 'farmacia/informe-productos', component: InformesProductosComponent, canActivate: [AuthFarmaciaGuard] },
  { path: 'farmacia/informe-stock', component: InformesStockComponent, canActivate: [AuthFarmaciaGuard] },
  { path: 'farmacia/resumen-persona', component: ResumenPersonaComponent, canActivate: [AuthFarmaciaGuard] },
  { path: 'farmacia/lista-venta', component: ListaVentaComponent, canActivate: [AuthFarmaciaGuard] },
  { path: 'farmacia/comprobanteventa-detail', component: ComprobanteventaDetailComponent, canActivate: [AuthFarmaciaGuard] },
  { path: 'editar-persona/:id_persona', component: EditarPersonaComponent, canActivate: [AuthFarmaciaGuard]  },


  // STOCK
  { path: 'stock', component: StockProductosComponent, canActivate: [AuthFarmaciaGuard] },
  { path: 'stock/crear-producto', component: CrearProductoComponent, canActivate: [AuthFarmaciaGuard] },
  { path: 'stock/ficha-ingreso', component: FichaIngresoComponent, canActivate: [AuthFarmaciaGuard]},
  { path: 'stock/ficha-salida', component: FichaSalidaComponent, canActivate: [AuthFarmaciaGuard]},
  { path: 'stock/carga-masiva', component: CargaMasivaComponent, canActivate: [AuthFarmaciaGuard]},
  // SEGURIDAD
  { path: 'seguridad', component: SeguridadHomeComponent },

  //ADMIN
  { path: 'admin', component: AdminComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
