import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from '../services/GLOBAL';
@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  public url: string;

  constructor(public _http: HttpClient) { 
    this.url = GLOBAL.url;
  }

  getClienteDni(dni:string,token:any): Observable<any>{
    
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.get(this.url + 'clientePorDNI/'+ dni ,{headers:headers});
  }

  getClientes(limit:any,token:any): Observable<any>{
    
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.get(this.url + 'getClientes/'+limit ,{headers:headers});
  }

  crearCliente(body:any,token:any): Observable<any>{
    
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.post(this.url + 'crearCliente', body ,{headers:headers});
  }

  activarDesactivarCliente(body:any,token:any): Observable<any>{
    
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.post(this.url + 'activarDesactivarCliente', body ,{headers:headers});
  }

  modificarCliente(body:any,token:any): Observable<any>{
    
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.post(this.url + 'actualizarCliente', body ,{headers:headers});
  }

}
