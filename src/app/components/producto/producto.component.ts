import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import {ProductoService} from'../../services/producto.service'
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import {GLOBAL} from '../../services/GLOBAL'
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})

export class ProductoComponent implements OnInit {
  
  
  numProductosActivos = 0
    idUpdate:any;
    nombreUpdate ='';
    codigo_internoUpdate ='';
    descripcionUpdate='';
    stockUpdate:any;
    precioUpdate:any;
    tallaUpdate:any;
    codigo_externoUpdate='';
    marcaIdUpdate:any;
    generoUpdate:any;
    tipoIdUpdate:any;

  datosCompletos = false
  datosCompletosUpdate = false
  public toast :any;
  nombreInsert = ''
  codigo_internoInsert = ''
  descripcionInsert = ''
  stockInsert = 0
  precioInsert = 0
  tallaInsert = 0
  codigo_externoInsert = ''
  marcaIdInsert = 0
  marcaIdBusqueda = 0
  tipoIdBusqueda = 0
  listaMarcas = [{id: 0, nombre:"cero"}]
  listaTipos :any
  precioFiltro :any
  tallaMayorIgual = 'false'
  stockMayorIgual = 'false'
  tallaFiltro :any
  generoFiltro = ''
  stockFiltro :any
  token: any
  listaGeneros :any
  term = ''
  generoInsert = ''
  listaProductos:any 
  
  termB = ''
  tipoBusqueda = 'normal'
  limit = 100
  tipoIdInsert = 0
  
  constructor(
    private _productoServicio : ProductoService,
    private _usuariServicio :UsuarioService
  ) {
    this.token = JSON.parse(localStorage.getItem("token")?? ' ')
    this.listaGeneros = GLOBAL.generos
    this.toast = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000
      
    });
   }
  

  

radiotipoBusqueda(event: MatRadioChange ){
  this.cargardespuesUpdate()
  if(this.tipoBusqueda == 'normal'){
    if(this.limit < 100){
      this.limit = 100
    }
  }
}


filtrosCambios(){
  let body = {
      term: this.termB,
      marcaIdBusqueda: this.marcaIdBusqueda,
      precioFiltro: this.precioFiltro,
      tallaMayorIgual : this.tallaMayorIgual,
      tallaFiltro: this.tallaFiltro,
      generoFiltro : this.generoFiltro,
      stockFiltro: this.stockFiltro,
      tipoProductoFiltro : this.tipoIdBusqueda,
      stockMayorIgual : this.stockMayorIgual
    }
    this._productoServicio.busquedaAvanzadaProducto(body, this.token).subscribe({next:(v)=>{
      /* if(v.respuesta){
      } */
      this.listaProductos = v.respuesta
        console.log("resp cliente v: ", v);
        
    }, error: (e)=>{
      console.log("error: ", e);
        if (e.error.message == 'El token ha expirado') {
          this._usuariServicio.logout();
        }
    }})
}

async actualizarNumProdActivo() {
  //numProductosActivos
  this._productoServicio.getNumProductosActivos(this.token).subscribe({
    next:(v)=>{
      //console.log(v.mensaje);
      
      this.numProductosActivos = v.mensaje.count 
    },
    error: (e)=>{
      console.log("error: ", e);
      if (e.error.message == 'El token ha expirado') {
        this._usuariServicio.logout();
      }
    }
  })
}

  async ngOnInit(){
    
    this.actualizarNumProdActivo()
    this._productoServicio.getMarcas(false,this.token).subscribe({
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

  cargarTipos(){
    this._productoServicio.getTipos(false,this.token).subscribe({
      next: (v) => {
      
      this.listaTipos = v.respuesta;

    }, error: (e)  => {
      console.log("error: ", e);
        if (e.error.message == 'El token ha expirado') {
          this._usuariServicio.logout();
        }
      }})
  }

  cargarActualizarProducto(product:any){
    this.idUpdate = product.id
    this.nombreUpdate = product.nombre
    this.codigo_internoUpdate = product.codigo_interno
    this.descripcionUpdate= product.descripcion
    this.stockUpdate= product.stock
    this.precioUpdate= product.precio
    this.tallaUpdate= product.talla
    this.codigo_externoUpdate= product.codigo_externo
    this.marcaIdUpdate= product.idmarca
    this.generoUpdate= product.genero
    this.tipoIdUpdate= product.idtipo
    this.validarVaciosUpdate()
  }

hacerTodoMayus(){
  this.descripcionUpdate= this.descripcionUpdate.toUpperCase();
  this.nombreUpdate=this.nombreUpdate.toUpperCase();
  this.codigo_externoUpdate=this.codigo_externoUpdate.toUpperCase();
  this.descripcionInsert= this.descripcionInsert.toUpperCase();
  this.nombreInsert=this.nombreInsert.toUpperCase();
  this.codigo_externoInsert=this.codigo_externoInsert.toUpperCase();
}


validarVaciosUpdate(){
    //this.tallaInsert=this.tallaInsert.toUpperCase();
    if(this.tipoIdUpdate == 1 || this.tipoIdUpdate == 5 || this.tipoIdInsert == 12){
      if(this.nombreUpdate.length >0 && this.descripcionUpdate.length >0 
        && this.codigo_externoUpdate.length >0 && this.marcaIdUpdate > 0 
        && this.precioUpdate > 0 && this.stockUpdate 
        && this.tallaUpdate>0 && this.generoUpdate != ""
        && this.tipoIdUpdate > 0 ){
        this.datosCompletosUpdate = true
      }else{
        this.datosCompletosUpdate = false
      }

    }else{
      this.tallaUpdate = 0
      if(this.nombreUpdate.length >0 && this.descripcionUpdate.length >0 
        && this.codigo_externoUpdate.length >0 && this.marcaIdUpdate > 0 
        && this.precioUpdate > 0 && this.stockUpdate && this.generoUpdate != ""
        && this.tipoIdUpdate > 0 ){
        this.datosCompletosUpdate = true
      }else{
        this.datosCompletosUpdate = false
      }
    }
}



  validarVacios(){
    //this.tallaInsert=this.tallaInsert.toUpperCase();
    if(this.tipoIdInsert == 1 || this.tipoIdInsert == 5 || this.tipoIdInsert == 12){
      if(this.nombreInsert.length >0 && this.descripcionInsert.length >0 
        && this.codigo_externoInsert.length >0 && this.marcaIdInsert > 0 
        && this.precioInsert > 0 && this.stockInsert 
        && this.tallaInsert>0 && this.generoInsert != ""
        && this.tipoIdInsert > 0 ){
        this.datosCompletos = true
      }else{
        this.datosCompletos = false
      }

    }else{
      this.tallaInsert = 0
      if(this.nombreInsert.length >0 && this.descripcionInsert.length >0 
        && this.codigo_externoInsert.length >0 && this.marcaIdInsert > 0 
        && this.precioInsert > 0 && this.stockInsert && this.generoInsert != ""
        && this.tipoIdInsert > 0 ){
        this.datosCompletos = true
      }else{
        this.datosCompletos = false
      }
    }

  }
  
guardarProducto(){
  this.hacerTodoMayus()
  this.codigo_internoInsert = this.codigo_externoInsert +'-'+ this.tallaInsert + this.generoInsert 
  let body = {
    nombre:this.nombreInsert,
    codigo_interno:this.codigo_internoInsert,
    descripcion:this.descripcionInsert,
    stock:this.stockInsert,
    precio:this.precioInsert,
    talla:this.tallaInsert,
    codigo_externo:this.codigo_externoInsert,
    marca:this.marcaIdInsert,
    genero: this.generoInsert,
    tipo: this.tipoIdInsert
  }
  this._productoServicio.crearProducto(body, this.token).subscribe({next:(v)=>{
    this.actualizarNumProdActivo()
    this.toast.fire({
                  icon: 'success',
                  title: v.mensaje
                })

  },
  error: (e)=>{
    console.log("error: ", e);
        if (e.error.message == 'El token ha expirado') {
          this._usuariServicio.logout();
        }
  }
})
}

tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    console.log('tabChangeEvent => ', tabChangeEvent); 
    console.log('index => ', tabChangeEvent.index); 
    if(tabChangeEvent.index == 1){
      this.cargarTodoProducto()
    }
}

cargarTodoProducto(){
this._productoServicio.getTodoProducto(this.limit, this.token).subscribe({next:(v)=>{
        if(v.respuesta){
          this.listaProductos = v.respuesta
        }else{
          this.toast.fire({
                icon: 'warning',
                title: v.mensaje
              })
        }

      }, error: (e)=>{
        console.log("error: ", e);
        if (e.error.message == 'El token ha expirado') {
          this._usuariServicio.logout();
        }
      }})
}

eliminarProducto(id:number, estado:boolean){
  this._productoServicio.eliminarProductoPorId(id,estado, this.token).subscribe({next:(v)=>{
    
    this.toast.fire({
          icon: 'success',
          title: v.mensaje
        })
          this.cargarTodoProducto()
        
        
  }, error: (e)=>{
    console.log("error: ", e);
        if (e.error.message == 'El token ha expirado') {
          this._usuariServicio.logout();
        }
  }})
}

cargardespuesUpdate(){
  if(this.tipoBusqueda == "normal"){
    this.cargarTodoProducto()
  }else{
    this.filtrosCambios()
  }
}


onUpdateProduct(){
  this.hacerTodoMayus()
  this.codigo_internoUpdate = this.codigo_externoUpdate +'-'+ this.tallaUpdate + this.generoUpdate 
  let body = {
    id: this.idUpdate,
    nombre:this.nombreUpdate,
    codigo_interno:this.codigo_internoUpdate,
    descripcion:this.descripcionUpdate,
    stock:this.stockUpdate,
    precio:this.precioUpdate,
    talla:this.tallaUpdate,
    codigo_externo:this.codigo_externoUpdate,
    marca:this.marcaIdUpdate,
    genero: this.generoUpdate,
    tipo: this.tipoIdUpdate
  }
  this._productoServicio.actualizarProducto(body, this.token).subscribe({next:(v)=>{
    console.log("ejecucion de servicio");
    

    this.toast.fire({
                  icon: 'success',
                  title: v.mensaje
                })
              

  },
  error: (e)=>{
    console.log("error: ", e);
        if (e.error.message == 'El token ha expirado') {
          this._usuariServicio.logout();
        }
  }
})
}

}
