import { Component, OnInit } from '@angular/core';
import {UsuarioService} from '../../services/usuario.service'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private _userService: UsuarioService
  ) { }


  ngOnInit(): void {
    this._userService.getIdentity()
    this._userService.getToken()
  }

}
