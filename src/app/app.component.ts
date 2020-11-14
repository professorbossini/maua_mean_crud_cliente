import { Component, OnInit } from '@angular/core';

import { UsuarioService } from './auth/usuario.service';

//import { Cliente } from './clientes/cliente.model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit{

  constructor (private usuarioService: UsuarioService){}

  ngOnInit (){
    this.usuarioService.autenticarAutomaticamente();
  }

  /*clientes: Cliente[] = [];
  onClienteAdicionado(cliente) {
    this.clientes = [cliente, ...this.clientes];
  }*/
}
