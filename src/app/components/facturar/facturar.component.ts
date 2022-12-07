import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import {GLOBAL} from '../../services/GLOBAL'
import {ProductoService} from'../../services/producto.service'
import { FacturaService } from 'src/app/services/factura.service';
import Swal from 'sweetalert2';
import { MatRadioChange } from '@angular/material/radio';
@Component({
  selector: 'app-facturar',
  templateUrl: './facturar.component.html',
  styleUrls: ['./facturar.component.css']
})
export class FacturarComponent implements OnInit {
  formatterUSD = new Intl.NumberFormat('en-US',
  {maximumSignificantDigits: 2});
  dniCliente = ''
  nombreCliente = ''
  emailCliente = ''
  direccion = ''
  telefono = ''
  formaPago = '01'
usuarioEncontrado = false
  token: any
  toast : any
  listaPagos :any
  diferido ='false'
  plazo = 3
  subtotal = 0
  descuento = 0
  grava_12 = 0
  grava_0 = 0
  iva = 0
  total = 0
  listaProductos :any
  listaProductosBuscados :any
  tipoBusqueda = 'normal'
  termB = ''
  limit = 100
marcaIdBusqueda = 0
precioFiltro = 0
tallaMayorIgual = 'false'
stockMayorIgual = 'true'
tallaFiltro:any
generoFiltro = ''
stockFiltro = 1
tipoIdBusqueda = 0
  listaTipos :any
listaMarcas : any
listaGeneros : any
tipoDNI = '04'
listaDNI :any
consumidorFinal = false
idCliente = 0
  constructor(
    private _clienteServicio :ClienteService,
    private _usuariServicio :UsuarioService,
    private _productoServicio : ProductoService,
    private _facturaServicio : FacturaService

  ) { 
    this.listaPagos = GLOBAL.formasPago
    this.token = JSON.parse(localStorage.getItem("token")?? ' ')
    this.listaGeneros = GLOBAL.generos
    this.listaDNI = GLOBAL.listaDNI
    this.toast = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000
      
    });
  }

consumidorFinalChange(){
  if(this.consumidorFinal){
    this.direccion = 'CONSUMIDOR FINAL'
    this.nombreCliente = 'CONSUMIDOR FINAL'
    this.emailCliente = 'CONSUMIDOR FINAL'
    this.telefono = '0000000000'
    this.dniCliente = '9999999999999'
    this.tipoDNI = '07'
    this.usuarioEncontrado = false
  }else{
    this.direccion = ''
    this.nombreCliente = ''
    this.emailCliente = ''
    this.telefono = ''
    this.dniCliente = ''
    this.tipoDNI = '04'
    this.usuarioEncontrado = false
  }
}

  radiotipoBusqueda(event: MatRadioChange){
    this.cargardespuesUpdate()
  if(this.tipoBusqueda == 'normal'){
    if(this.limit < 100){
      this.limit = 100
    }
  }
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

  cargardespuesUpdate(){
  if(this.tipoBusqueda == "normal"){
    this.cargarTodoProducto()
  }else{
    this.filtrosCambios()
  }
}


agregarProducto(producto:any){
 /*  if(this.listaProductos.length == 0){
    this.listaProductos = [{producto}]
  } */
  let productoConUnidad = producto
  productoConUnidad.cantidad = 1
  productoConUnidad.descuento = 0
  productoConUnidad.descuentoInput = 0

  productoConUnidad.precioUnitario = this.redondear((productoConUnidad.precio/1.12), 2)
  productoConUnidad.iva = this.redondear(productoConUnidad.precioUnitario * 0.12, 2)
  productoConUnidad.ivaInmutable = this.redondear(productoConUnidad.precioUnitario * 0.12, 2)

  if(!this.listaProductos){
    this.listaProductos = []
  }
  this.listaProductos.push(productoConUnidad)
  //quita repetido
  this.listaProductos=this.listaProductos.filter((v:any,i:any,a:any)=>a.findIndex((v2:any)=>(v2===v))===i)
  this.calcular()
}

eliminarProducto(producto:any){
this.listaProductos = this.listaProductos.filter((person:any) => person != producto);
this.calcular()
}

redondear(numero:number, digitos:number){
    let base = Math.pow(10, digitos);
    let entero = Math.round(numero * base);
    return entero / base;
}

setCantidadMinima(producto :any){
  if(producto.cantidad < 1){
    producto.cantidad = 1
  }
  if(producto.cantidad > producto.stock){
    producto.cantidad = producto.stock
  }
}

calcular(){
  
  let total =0
  
  let totalSinImpuestos = 0 //o subtotal
  let baseImponible = 0 //grava 12
  let descuentoTotal = 0
  let ivaTotal = 0
  let i = 0
  for (const product of this.listaProductos) {
    //product.descuentoInput para calcular , y product.descuento es el que se envia a SRI
    let totalPVP = this.redondear(product.precio * product.cantidad, 2 )
    let totalProducto = this.redondear(product.precioUnitario * product.cantidad , 2) //subtotal sin iva
    let totalIVA = this.redondear(product.ivaInmutable * product.cantidad, 2) //iva de todo el subtotal

    if(product.descuentoInput > 0){
      //hay que calcular nuevos totales y descuento del producto 
      totalPVP = this.redondear(totalPVP - product.descuentoInput, 2)
      let precioUni = this.redondear(this.redondear(totalPVP/product.cantidad , 2)/1.12 , 2)
      let ivaPro = this.redondear(precioUni * 0.12, 2)
      //let pvp = precioUni + ivaPro
      product.precioTotalSinImpuesto = this.redondear(precioUni * product.cantidad, 2)
      product.iva = this.redondear(ivaPro * product.cantidad, 2)
      product.descuento = this.redondear(totalProducto - product.precioTotalSinImpuesto, 2)
      ivaTotal = this.redondear(ivaTotal + product.iva, 2)
      totalSinImpuestos = this.redondear(totalSinImpuestos + product.precioTotalSinImpuesto, 2)
      total = this.redondear(total + totalPVP, 2)
    }else{
      //totales sin considerar descuento
      product.precioTotalSinImpuesto = totalProducto
      product.iva = totalIVA
      ivaTotal = this.redondear(ivaTotal + totalIVA, 2)
      totalSinImpuestos = this.redondear(totalSinImpuestos + totalProducto, 2)
      total = this.redondear(total + totalPVP, 2)
    }

    descuentoTotal = this.redondear(descuentoTotal +product.descuento, 2) //bien

  }

  console.log("lista a facturar: ", this.listaProductos);
  
  //totalSinImpuestos = total //aún no tiene el iva sumado
  
  baseImponible = totalSinImpuestos
  //ivaTotal = this.redondear((0.12*totalSinImpuestos), 2)
  //ivaTotal = this.redondear((0.12*totalSinImpuestos), 2)

  this.descuento = descuentoTotal
  this.subtotal = totalSinImpuestos
  this.grava_12 = baseImponible
  this.iva = ivaTotal
  this.total = this.redondear(totalSinImpuestos + ivaTotal, 2)
  //console.log("calculos: ", );
  
}

cargarTodoProducto(){
this._productoServicio.getTodoProducto(this.limit, this.token).subscribe({next:(v)=>{
        if(v.respuesta){
          this.listaProductosBuscados = v.respuesta
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

filtrosCambios(){
  let body = {
      term: this.termB,
      marcaIdBusqueda: this.marcaIdBusqueda,
      precioFiltro: this.precioFiltro,
      tallaMayorIgual : this.tallaMayorIgual,
      stockMayorIgual : this.stockMayorIgual,
      tallaFiltro: this.tallaFiltro,
      generoFiltro : this.generoFiltro,
      stockFiltro: this.stockFiltro,
      tipoProductoFiltro : this.tipoIdBusqueda
    }
    this._productoServicio.busquedaAvanzadaProducto(body, this.token).subscribe({next:(v)=>{
      /* if(v.respuesta){
      } */
      this.listaProductosBuscados = v.respuesta
        console.log("resp cliente v: ", v);
        
    }, error: (e)=>{
      console.log("error: ", e);
        if (e.error.message == 'El token ha expirado') {
          this._usuariServicio.logout();
        }
    }})
}

  ngOnInit(): void {
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


  CallFacturar(){
    let bodyFactura:any
    let idCliente = 0
    if(this.usuarioEncontrado){
      idCliente = this.idCliente
    }
    bodyFactura = {
      idCliente: idCliente,
    id:"comprobante",
    version:"1.0.0",
   infoTributaria : {
       ambiente : 1,
       tipoEmision : 1,
       razonSocial : "",
       nombreComercial : "",
       ruc: "",
       claveAcceso: "",
       codDoc : "01",
       estab : "" ,
       ptoEmi : "" ,
       secuencial : "",
       dirMatriz : ""
   },
   infoFactura:{
        fechaEmision: "",
        dirEstablecimiento:"",
        tipoIdentificacionComprador:this.tipoDNI,
        
        razonSocialComprador: this.nombreCliente,
        identificacionComprador:this.dniCliente,
        direccionComprador:this.direccion,
        totalSinImpuestos: this.subtotal,
        totalDescuento: this.descuento,
        totalConImpuestos:{
            totalImpuesto:
                    {
                        codigo:2,
                        codigoPorcentaje:2,
                        
                        baseImponible:this.grava_12,
                        valor:this.iva
                    }        
        },
        propina:0.00,
        importeTotal:this.total,
        moneda:"",
        pagos:{
          pago:{
                formaPago:this.formaPago,
                total:this.total
            }
          }
        
   }
   
}
if(this.diferido ==='true'){
  bodyFactura.infoFactura.pagos.plazo = this.plazo
}
var detalle = []
for (const product of this.listaProductos) {
  detalle.push({
    codigoPrincipal : product.codigo_interno,
    descripcion : product.nombre,
    cantidad : product.cantidad,
    precioUnitario: product.precioUnitario,
    descuento: product.descuento,
     precioTotalSinImpuesto: product.precioTotalSinImpuesto,
     impuestos:{
      impuesto:{
        codigo:2,
        codigoPorcentaje:2,
        tarifa:12,
        baseImponible : product.precioTotalSinImpuesto,
        valor: product.iva
      }
     },
     stock : product.stock,
     id: product.id
  })
}

bodyFactura.detalles = {detalle:detalle}
bodyFactura.infoAdicional = 
{
  campoAdicional:{
  nombre:"Email",
  text: this.emailCliente
}
}


  this._facturaServicio.FirmarAutorizarSRIFactura(bodyFactura, this.token).subscribe({
    next:(v)=>{
      console.log("respuesta 1: ", v);
      this.toast.fire({
                    icon: 'success',
                    title: v.mensaje
                  })
      //limpiar formulario
      setTimeout(() => {
          window.location.reload()
        }, 3000);

    }, 
    error: (e)=>{
      console.log("error 1: ", e.error.error);
      if(e.error.error){
        //probablemente solo de el no autorizado
        this.toast.fire({
                    icon: 'error',
                    title: e.error.error
                  })
      }
      if(e.error.err.error == "NO SE ENCONTRÓ IMPRESORA"){
        setTimeout(() => {
          window.location.reload()
        }, 3000);
        this.toast.fire({
                      icon: 'warning',
                      title: e.error.err.error
                    })
      }
    }})
  }

  facturar(){

  Swal.fire({
    title: 'Quieres iniciar proceso de firma y autorización de esta factura?',
    showDenyButton: true,
    confirmButtonText: 'Si, facturar',
    denyButtonText: `No, volver`,
  }).then((result) => {
    console.log("result swal: ", result);
    if (result.isConfirmed) {
      console.log("confirmado");
      this.CallFacturar()
    
    } else {
      Swal.fire('No se ha iniciado proceso de firma y autorización', '', 'info')
      console.log("No");
      }
    })

    
  }

  radioDiferido(event:MatRadioChange){

  }



  buscarCliente(){
    if(this.dniCliente.length >= 10){
      this._clienteServicio.getClienteDni(this.dniCliente , this.token).subscribe({
        next:(v)=>{
          if(v.respuesta.length > 0){
            this.usuarioEncontrado = true
            this.idCliente = v.respuesta[0].id
            console.log("res: ", v);
            this.direccion = v.respuesta[0].direccion
            this.nombreCliente = v.respuesta[0].nombreCompleto
            this.emailCliente = v.respuesta[0].email
            this.telefono = v.respuesta[0].telefono
            this.tipoDNI = v.respuesta[0].tipoid
            this.toast.fire({
                    icon: 'success',
                    title: v.mensaje
                  })
            }else{
              if(this.usuarioEncontrado){
                this.direccion = ''
                this.nombreCliente = ''
                this.emailCliente = ''
                this.telefono = ''
                this.tipoDNI = '04'
              }
              this.usuarioEncontrado = false
              this.toast.fire({
                    icon: 'warning',
                    title: v.mensaje
                  })
            }

        },
        error: (e) =>{
          console.log("error: ", e);
          this.usuarioEncontrado = false
          if (e.error.message == 'El token ha expirado') {
          this._usuariServicio.logout();
          }
        }
      })
    }else{
      if(this.usuarioEncontrado){
        this.direccion = ''
        this.nombreCliente = ''
        this.emailCliente = ''
        this.telefono = ''
        this.tipoDNI = '04'
      }
      this.usuarioEncontrado = false
    }
  }

}
