import { Component, OnInit } from '@angular/core';
import { FacturaService } from 'src/app/services/factura.service';
import {GLOBAL} from '../../services/GLOBAL'
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-facturas',
  templateUrl: './lista-facturas.component.html',
  styleUrls: ['./lista-facturas.component.css']
})
export class ListaFacturasComponent implements OnInit {
  term= ''
  listaFacturas :any
  token: any
  public toast :any;
  constructor(
    private _facturaServicio : FacturaService,
    private _usuariServicio : UsuarioService
    ) { 
      this.toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000
        
      });
    this.token = JSON.parse(localStorage.getItem("token")?? ' ')
  }

  ngOnInit(): void {
    this.cargarFacturas()
  }

  cargarFacturas(){
    this._facturaServicio.getFacturas(this.token).subscribe({
      next:(v)=>{
        console.log("facturas: ", v);
        this.listaFacturas = v.listaFacturas
      },
      error:(e)=>{
        console.log("error: ", e);
        if (e.error.message == 'El token ha expirado') {
          this._usuariServicio.logout();
        }
      }
    })
  }

  getPdf(pdfName:String){
    let url = GLOBAL.url + "getfacturaPdf/"+pdfName
    window.open(url, "_blank");

   /*  this._facturaServicio.getFacturaPDF(pdfName, this.token).subscribe({
      next:(v)=>{
        window.open(v, "_blank");
      },
      error:(e)=>{
        console.log("error pdf: ", e);
        
      }  
    }) */
  }

  imprimirXML(claveAcceso:String){
    Swal.fire({
      title: 'Quieres volver a imprimir esta factura?',
      showDenyButton: true,
      confirmButtonText: 'Si, imprimir',
      denyButtonText: `No, volver`,
    }).then((result) => {
      console.log("result swal: ", result);
      if (result.isConfirmed) {
        console.log("confirmado");
        this.CallFacturar(claveAcceso)
      
      } else {
        Swal.fire('Volviendo sin imprimir', '', 'info')
        console.log("No");
        }
      })
    
    

  }
  
  CallFacturar(claveAcceso :String) {
    this._facturaServicio.printXML(claveAcceso, this.token).subscribe({
      next:(v)=>{
        this.toast.fire({
          icon: 'success',
          title: v.mensaje
        })
      },
      error:(e)=>{
        console.log("error pdf: ", e);
        
      }  
    }) 
  }


}
