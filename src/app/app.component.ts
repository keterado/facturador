import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import{UsuarioService}from'./services/usuario.service'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {

  constructor(
    private _router: Router,
    public _userService: UsuarioService
  ){

  }

  title = 'facturador';
  public token : any
  public identity : any
  public logeado = false

   async ngOnInit(){
    //this.checkLogin()

   }

   checkLogin () {
    
   }

   cerrarSesion(){
    localStorage.clear();
    this._userService.identity = null
    this._userService.token = null
    this._router.navigate(['/login']);
   }

}


