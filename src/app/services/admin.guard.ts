import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UsuarioService } from './usuario.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class AdminGuard implements CanActivate {
  constructor(
    private _router: Router,
    private _userService: UsuarioService){
    
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
     let identity = this._userService.getIdentity();
      if(identity){
        if(identity.rol == 'ADMIN'){
          return true;
          
        } else{
          this._userService.logout()     
          //this._router.navigate(['/login']);
        return false;
        }
      }else{
          this._userService.logout()     

        //this._router.navigate(['/login']);

        return false
      }
  }
  
}
