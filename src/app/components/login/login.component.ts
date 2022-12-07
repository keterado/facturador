import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[UsuarioService]
})

export class LoginComponent implements OnInit {
  public usuario = ''
  public password = ''
  public flag = ''
  public toast :any;
  
  
  constructor(
    private _userService: UsuarioService,
    private _router: Router
  ) { 
    
    this.toast = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000
      /* ,
      onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      } */
    });
  }

  ngOnInit(): void {
  }

  async login(){
    this._userService.getLogin(this.usuario, this.password).subscribe(v=>{
      if(v.usuario){
        console.log("respuesta login: ", v);
        this.toast.fire({
                icon: 'success',
                title:'BIENVENIDO '+ v.usuario.usuario
              })
        localStorage.setItem('token', JSON.stringify(v.token));
        localStorage.setItem('usuario', JSON.stringify(v.usuario));
        this._userService.identity = v.usuario
        this._userService.token = v.token
        this._router.navigate(['/home']);
        

      }else{
        console.log("respuesta login: ", v);
        this.toast.fire({
                icon: 'warning',
                title: v.mensaje
              })
      }
    })
    
  }

}
