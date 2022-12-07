import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { UsuarioGuard } from './services/usuario.guard';
import {ClientesComponent} from './components/clientes/clientes.component'
import {ProductoComponent} from './components/producto/producto.component'
import {MarcasComponent} from './components/catalogos/marcas.component'
import{FacturarComponent} from './components/facturar/facturar.component'
import {ListaFacturasComponent} from './components/lista-facturas/lista-facturas.component'
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { AdminGuard } from './services/admin.guard';
const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'home', component:HomeComponent, canActivate: [UsuarioGuard]},
  {path: 'clientes', component:ClientesComponent, canActivate: [UsuarioGuard]},
  {path: 'producto', component:ProductoComponent, canActivate: [UsuarioGuard]},
  {path: 'marcas', component:MarcasComponent, canActivate: [UsuarioGuard]},
  {path: 'facturar', component: FacturarComponent, canActivate: [UsuarioGuard]},
  {path: 'lista-facturas', component: ListaFacturasComponent, canActivate: [UsuarioGuard]},
  {path: 'usuarios', component: UsuariosComponent, canActivate: [AdminGuard]},

  {path:'**',redirectTo:'login'},  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
