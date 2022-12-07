import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from '../services/GLOBAL';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
public url: string;
  constructor(public _http: HttpClient) { 
    this.url = GLOBAL.url;
    
  }

  FirmarAutorizarSRIFactura(factura:any,token:any): Observable<any>{
    
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
//
    return this._http.post(this.url + 'facturar',factura,{headers:headers});
  }

  getFacturas(token:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    return this._http.get(this.url + 'listaFacturas',{headers:headers});
  }

  getFacturaPDF(pdfName:String,token:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/pdf').set('Authorization', token);
    return this._http.get(this.url + 'getfacturaPdf/'+pdfName ,{headers:headers});

  }

  printXML(claveAcceso:String ,token:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/pdf').set('Authorization', token);
    return this._http.get(this.url + 'test-print-xml/'+claveAcceso ,{headers:headers});
  }

}
