import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ClienteService } from 'src/app/services/cliente.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { GLOBAL } from 'src/app/services/GLOBAL';
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  token: any
  listaClientes :any
  toast :any
  listaProductosBuscados :any
  termB = ''
 limit = 100
  listaDocumentos = GLOBAL.listaDNI
  
  camposInsertCompletos = false

  nombreinsert = ''
  direccionInsert = ''
  tipoIdInsert = '05'
  dniClienteInsert = ''
  telefonoInsert = ''
  emailInsert = ''


  camposUpdateCompletos = false
  idModificar = 0
  nombreUpdate = ''
  direccionUpdate = ''
  tipoIdUpdate = '05'
  dniClienteUpdate = ''
  telefonoUpdate = ''
  emailUpdate = ''

  listaDNI = GLOBAL.listaDNI

  constructor(
    private _clienteServicio :ClienteService,
    private _usuariServicio :UsuarioService,

  ) {
    this.token = JSON.parse(localStorage.getItem("token")?? ' ')
    this.toast = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000
      
    });
   }

  ngOnInit(): void {
    this.test()
  }

  limpiarInsert(){
    this.nombreinsert = ''
    this.direccionInsert = ''
    this.tipoIdInsert = '05'
    this.dniClienteInsert = ''
    this.telefonoInsert = ''
    this.emailInsert = ''
  }

  guardarCliente(){
    this.hacerTodoMayus()
    let body = {
      nombreCompleto : this.nombreinsert,
      identificacionComprador : this.dniClienteInsert,
      direccion : this.direccionInsert,
      telefono : this.telefonoInsert , 
      email : this.emailInsert,
      tipoid : this.tipoIdInsert
    }
    this._clienteServicio.crearCliente(body,this.token).subscribe({next:(v)=> {
      this.toast.fire({
        icon: 'success',
        title: v.mensaje
      })
      //limpiar insert variables
      this.limpiarInsert()
    },error:(e)=> {
      console.log("error: ", e);
        if (e.error.message == 'El token ha expirado') {
          this._usuariServicio.logout();
        }else{
          this.toast.fire({
            icon: 'warning',
            title: e.mensaje
          })
        }
    },})
  }

hacerTodoMayus(){
   this.nombreinsert = this.nombreinsert.toUpperCase();
    this.direccionInsert = this.direccionInsert.toUpperCase();
    this.nombreUpdate = this.nombreUpdate.toUpperCase();
    this.direccionUpdate = this.direccionUpdate.toUpperCase();
}

  validarVaciosInsert(){
    //this.hacerTodoMayus()
    if(this.dniClienteInsert.length < 10 || this.nombreinsert.length < 4 || this.telefonoInsert.length <5 || this.direccionInsert.length < 4 || this.emailInsert.length <1 ){
      this.camposInsertCompletos = false
      //console.log('sin completar');
      
    }else{
      this.camposInsertCompletos = true
      //console.log('completar');

    }
  }

  tabChanged(event:MatTabChangeEvent){
    console.log('tabChangeEvent => ', event); 
    console.log('index => ', event.index); 
    if(event.index == 1){
      this.cargarClientes()
    }
  }

  activarDesactivarCliente(cliente:any){
    let body = {
      idCliente: cliente.id,
      estado : cliente.estado
    }
    this._clienteServicio.activarDesactivarCliente(body, this.token).subscribe({next:(v)=>{
      this.toast.fire({
        icon: 'success',
        title: v.mensaje
      })
      //cargar lista de cliente
      this.cargarClientes()

    }, error:(e)=>{
      this.toast.fire({
        icon: 'warning',
        title: e.mensaje
      })
    }})
  }

cargarClientes(){
  //cargar todos los clientes para hacer busqueda
  this._clienteServicio.getClientes(this.limit,this.token).subscribe({next:(v)=>{
    for (const cliente of v.clientes) {
      
       for (const doc of this.listaDocumentos) {
          if(cliente.tipoid == doc.value){
            cliente.tipoDescripcion = doc.option
          }
       }
    }
    this.listaClientes = v.clientes
  }, error:(e)=>{
    
    console.log("error: ", e);
        if (e.error.message == 'El token ha expirado') {
          this._usuariServicio.logout();
        }else{
          this.toast.fire({
            icon: 'warning',
            title: e.mensaje
          })
        }
  }})
}


  test(){}

  cargarActualizarCliente(cliente:any){
    this.idModificar = cliente.id
    this.nombreUpdate = cliente.nombreCompleto
    this.direccionUpdate = cliente.direccion
    this.telefonoUpdate = cliente.telefono
    this.emailUpdate = cliente.email
    this.dniClienteUpdate = cliente.identificacionComprador
    this.tipoIdUpdate = cliente.tipoid
    this.camposUpdateCompletos = true
  }

  cargardespuesUpdate(){
    this.cargarClientes()
  }

  validarVaciosUpdate(){
    //this.hacerTodoMayus()
    
    if(this.dniClienteUpdate.length < 10 || this.nombreUpdate.length < 4 || this.telefonoUpdate.length <5 || this.direccionUpdate.length < 4 || this.emailUpdate.length <1 ){
      this.camposUpdateCompletos = false
      //console.log('sin completar');
      
    }else{
      this.camposUpdateCompletos = true
      //console.log('completar');

    }
  }

  modificarCliente(){
    this.hacerTodoMayus()
    let body = {
      idCliente : this.idModificar,
      nombreCompleto : this.nombreUpdate,
      identificacionComprador : this.dniClienteUpdate,
      direccion :  this.direccionUpdate,
      telefono : this.telefonoUpdate,
      email: this.emailUpdate,
      tipoid : this.tipoIdUpdate
    }
    this._clienteServicio.modificarCliente(body,this.token).subscribe({
      next:(v)=>{
        this.toast.fire({
          icon: 'success',
          title: v.mensaje
        })
      },
      error:(e)=>{
        if (e.error.message == 'El token ha expirado') {
          this._usuariServicio.logout();
        }else{
          this.toast.fire({
            icon: 'warning',
            title: e.mensaje
          })
        }
      }
    })
  }

}
