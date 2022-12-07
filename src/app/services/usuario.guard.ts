import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {UsuarioService} from "../services/usuario.service"

@Injectable({
  providedIn: 'root'
})
export class UsuarioGuard implements CanActivate {
  constructor(
    private _router: Router,
    private _userService: UsuarioService){
    
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
     
      let identity = this._userService.getIdentity();
      if(identity){
        if(identity.rol == 'VENDEDOR' || identity.rol == 'ADMIN'){
          return true;
        } else{     
          this._userService.logout()     

        return false;
        }
      }else{
        this._userService.logout()     


        return false
      }

    
  }
  
}
