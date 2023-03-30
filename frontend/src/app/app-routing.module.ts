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
import { CrearProductoComponent } from './farmacia/crear-producto/crear-producto.component';


const routes: Routes = [
  // AUTH
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent},
  // CORE
  {path:'',component:HomeComponent},
  {path:'quienes',component:QuienesSomosComponent, canActivate: [AuthGuard]},
  {path:'qna',component:QnaComponent},
  {path:'persona',component:PersonaComponent},
  {path:'persona/crear',component:PersonaCrearComponent},
  {path:'vis',component:VisComponent, canActivate: [AuthGuard]},
  {path: 'conoce-tu-area', component:InfoComunaComponent},
  {path: 'conoce-tu-uv', component:InfoUvComponent},

  // FARMACIA
  {path:'farmacia',component:FarmaciaHomeComponent},
  {path:'farmacia/informes',component:InformesFarmaciaComponent},
  {path:'farmacia/venta',component:VentaComponent},


  // STOCK
  {path:'stock',component:StockProductosComponent},
  {path:'stock/crear-producto',component:CrearProductoComponent},
  // SEGURIDAD
  {path:'seguridad', component:SeguridadHomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
