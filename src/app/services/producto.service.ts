import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from '../services/GLOBAL';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  public url: string;
  

  constructor(public _http: HttpClient) {
    this.url = GLOBAL.url;
   }

   getMarcas(admin:boolean,token:any): Observable<any>{
    
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.get(this.url + 'listaMarcas/'+admin,{headers:headers});
  }

  DesactivarMarca(body:any,token:any): Observable<any>{
    
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.post(this.url + 'eliminarMarcarPorId', body, {headers:headers});
  }

  DesactivarTipo(body:any,token:any): Observable<any>{
    
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.post(this.url + 'eliminarTipoPorId', body, {headers:headers});
  }

  getTipos (admin:boolean,token:any): Observable<any>{
    
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.get(this.url + 'listaTipos/'+admin,{headers:headers});
  }

  getNumProductosActivos (token:any): Observable<any>{
    
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.get(this.url + 'getNumProductosActivos',{headers:headers});
  }

  crearProducto(body:any, token:any):Observable<any>{
    
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.post(this.url + 'crearProducto', body,{headers:headers});
  }

  actualizarProducto(body:any, token:any):Observable<any>{
    
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.post(this.url + 'actualizarProducto', body,{headers:headers});
  }

  getTodoProducto(limit:any, token:any):Observable<any>{
    
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.get(this.url + 'getTodoProducto/'+limit , {headers:headers});
  }

  eliminarProductoPorId(idEliminar:number, estado:boolean, token:any):Observable<any>{
    
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    let body = {
      idProducto: idEliminar,
      estado: estado
    }
    return this._http.post(this.url + 'eliminarProductoPorId',body , {headers:headers});
  }

  busquedaAvanzadaProducto(body:any, token:any):Observable<any>{
    
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    
    return this._http.post(this.url + 'buscarProducto',body , {headers:headers});
  }

  actualizarTipos(body:any, token:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    
    return this._http.post(this.url + 'modificarTipoProducto',body , {headers:headers});
  }

  actualizarMarcas(body:any, token:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    
    return this._http.post(this.url + 'modificarMarcaProducto',body , {headers:headers});
  }

  crearMarcas(body:any, token:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    
    return this._http.post(this.url + 'crearMarcaProducto',body , {headers:headers});
  }

  crearTipo(body:any, token:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    
    return this._http.post(this.url + 'crearTipoProducto',body , {headers:headers});
  }

}
