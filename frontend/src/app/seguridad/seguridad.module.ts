import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';

import { SeguridadHomeComponent } from './seguridad-home/seguridad-home.component';



@NgModule({
  declarations: [
    SeguridadHomeComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
  ]
})
export class SeguridadModule { }
