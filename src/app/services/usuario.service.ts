import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from '../services/GLOBAL';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  public url: string;
  public token:any;
  public identity:any;

  constructor(public _http: HttpClient, public _router:Router) {
    this.url = GLOBAL.url;

   }
   
   getLogin(usuario:any, contrasena:any): Observable<any>{
    let body ={
      usuario: usuario,
      contrasena: contrasena
    }
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.post(this.url + 'login', body ,{headers:headers});
  }

  logout(){
    localStorage.clear();
    this.identity = null
    this.token = null
    this._router.navigate(['/login']);
  }

  getIdentity(){
    try {
      let identity = JSON.parse(localStorage.getItem("usuario")?? ' ');
      if(identity != undefined){
        this.identity = identity;
      }else {
        this.identity = null;
      }    
      console.log( 'identidad: ', this.identity);        
      return this.identity;
      
    } catch (error) {
      this.identity = null
      this.token = null
      return this.identity;

    }
    
  }

  getToken(){
    let token = JSON.parse(localStorage.getItem('token')?? ' ');
    if(token != undefined){
      this.token = token;
    }else{
      this.token = null;
    }
    console.log("token: ", this.token);
    
    return this.token;
  }

}
