import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioComponent } from './Inicio/Inicio.component';
import { HeaderComponent } from './header/header.component';
import { FarmaciaComponent } from './farmacia/farmacia.component';
import { RouterModule, Routes } from '@angular/router';

const appRoutes:Routes=[
{path:'',component:InicioComponent},
{path:'farmacia', component:FarmaciaComponent}

];

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    HeaderComponent,
    FarmaciaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
