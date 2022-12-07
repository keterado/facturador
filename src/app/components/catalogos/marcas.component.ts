import { Component, OnInit } from '@angular/core';
import {ProductoService} from'../../services/producto.service'
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-marcas',
  templateUrl: './marcas.component.html',
  styleUrls: ['./marcas.component.css']
})
export class MarcasComponent implements OnInit {
  
  toast : any

  listaMarcas : any
  token : any
  listaTipos :any
  filtrarMarcas = ''
  filtrarTipos = ''

  MarcaEdit = false
  TipoEdit = false
  idMarcaEditar = 0
  idTipoEditar = 0
  nombreMarcaEditar = ''
  nombreMarcaInsertar = ''
  nombreTipoEditar=''
  nombreTipoInsertar=''

  constructor(private _productoServicio : ProductoService, private _usuariServicio :UsuarioService) { 
    this.token = JSON.parse(localStorage.getItem("token")?? ' ')
    this.toast = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000
      
    });
  }

setVacios(){
  this.MarcaEdit = false
  this.TipoEdit = false
  this.idMarcaEditar = 0
  this.idTipoEditar = 0
  this.nombreMarcaEditar = ''
  this.nombreMarcaInsertar = ''
  this.nombreTipoEditar=''
  this.nombreTipoInsertar=''
}

  setMarcaEditar(marca:any){
    this.idMarcaEditar = marca.id
    this.nombreMarcaEditar = marca.nombre
    this.MarcaEdit = true
  }

  cancelarEditarMarca(){
    this.idMarcaEditar = 0
    this.nombreMarcaEditar = ''
    this.MarcaEdit = false
  }

  cancelarEditarTipo(){
    this.idTipoEditar = 0
    this.nombreTipoEditar = ''
    this.TipoEdit = false
  }

modificarMarca(){
  this.hacerMayus()
  let body = {
    idModificar : this.idMarcaEditar, 
    nombre: this.nombreMarcaEditar
  }
  console.log("body mod: ", body);
  
  this._productoServicio.actualizarMarcas(body, this.token).subscribe({
      next:(v)=>{
        this.toast.fire({
          icon: 'success',
          title: v.mensaje
        })
        this.cancelarEditarMarca()
        this.cargarMarcasYTipos()

    }, error:(e)=>{
      if (e.error.message == 'El token ha expirado') {
        this._usuariServicio.logout();
      }
      this.toast.fire({
        icon: 'warning',
        title: e.mensaje
      })
    }})
}

  modificarTipo(){
  this.hacerMayus()
    let body = { 
      idModificar : this.idTipoEditar,
      nombre : this.nombreTipoEditar
    }
    this._productoServicio.actualizarTipos(body, this.token).subscribe({
      next:(v)=>{
        this.toast.fire({
          icon: 'success',
          title: v.mensaje
        })
        this.cancelarEditarTipo()
        this.cargarMarcasYTipos()

    }, error:(e)=>{
      if (e.error.message == 'El token ha expirado') {
        this._usuariServicio.logout();
      }
      this.toast.fire({
        icon: 'warning',
        title: e.mensaje
      })
    }})
  }

  setTipoEditar(tipo:any){
    this.idTipoEditar = tipo.id
    this.nombreTipoEditar = tipo.nombre
    this.TipoEdit = true
  }

hacerMayus(){
  this.nombreMarcaEditar = this.nombreMarcaEditar.toUpperCase()
  this.nombreMarcaInsertar = this.nombreMarcaInsertar.toUpperCase()
  this.nombreTipoEditar = this.nombreTipoEditar.toUpperCase()
  this.nombreTipoInsertar = this.nombreTipoInsertar.toUpperCase()
}

  cargarMarcasYTipos(){
    this._productoServicio.getMarcas(true,this.token).subscribe({
      next: (v) => {
      
      this.listaMarcas = v.respuesta;
      this.cargarTipos()

    }, error: (e)  => {
      console.log("error: ", e);
        if (e.error.message == 'El token ha expirado') {
          this._usuariServicio.logout();
        }
      }})
  }

  ngOnInit(): void {
    this.cargarMarcasYTipos()
  }

eliminarTipo(tipo:any){
  let body = {
    idTipo : tipo.id,
    estado : tipo.estado
  }
  this._productoServicio.DesactivarTipo(body, this.token).subscribe({
    next:(v)=>{
      this.cargarMarcasYTipos();
    }, 
    error: (e)=>{
      if (e.error.message == 'El token ha expirado') {
        this._usuariServicio.logout();
      }
    }})
}

  eliminarMarca(marca:any){
    let body = {
      idMarca : marca.id,
      estado :marca.estado
    }

    this._productoServicio.DesactivarMarca(body, this.token).subscribe({
      next:(v)=>{
        this.cargarMarcasYTipos();
      }, 
      error: (e)=>{
        if (e.error.message == 'El token ha expirado') {
          this._usuariServicio.logout();
        }
      }})

  }

  cargarTipos(){
    this._productoServicio.getTipos(true ,this.token).subscribe({
      next: (v) => {
      
      this.listaTipos = v.respuesta;

    }, error: (e)  => {
      console.log("error: ", e);
        if (e.error.message == 'El token ha expirado') {
          this._usuariServicio.logout();
        }
      }})
  }

guardarTipo(){
  this.hacerMayus()
  let body = {nombre: this.nombreTipoInsertar}
  this._productoServicio.crearTipo(body, this.token).subscribe({
    next:(v)=>{
      this.toast.fire({
        icon: 'success',
        title: v.mensaje
      })
      this.setVacios()
      this.cargarMarcasYTipos()
    },
    error:(e)=>{
      this.toast.fire({
        icon: 'warning',
        title: e.mensaje
      })
      console.log("error: ", e);
        if (e.error.message == 'El token ha expirado') {
          this._usuariServicio.logout();
        }
    }
  })
}

guardarMarca(){
  this.hacerMayus()

  let body = {nombre: this.nombreMarcaInsertar}

this._productoServicio.crearMarcas(body, this.token).subscribe({
    next:(v)=>{
      this.toast.fire({
        icon: 'success',
        title: v.mensaje
      })
      this.setVacios()
      this.cargarMarcasYTipos()
    },
    error:(e)=>{
      this.toast.fire({
        icon: 'warning',
        title: e.mensaje
      })
      console.log("error: ", e);
        if (e.error.message == 'El token ha expirado') {
          this._usuariServicio.logout();
        }
    }
  })
}

}
