import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../cliente.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Cliente } from '../cliente.model';

@Component({
  selector: 'app-cliente-inserir',
  templateUrl: './cliente-inserir.component.html',
  styleUrls: ['./cliente-inserir.component.css'],
})
export class ClienteInserirComponent implements OnInit{
  private modo: string = "criar";
  private idCliente: string;
  public cliente: Cliente;
  constructor(public clienteService: ClienteService, public route: ActivatedRoute) {

  }


  ngOnInit(){
    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has("idCliente")) {
        this.modo = "editar";
        this.idCliente = paramMap.get("idCliente");
        this.clienteService.getCliente (this.idCliente).subscribe (dadosCli => {
          this.cliente = {
            id: dadosCli._id,
            nome: dadosCli.nome,
            fone: dadosCli.fone,
            email: dadosCli.email
          }
        });
      } else {
        this.modo = "criar";
        this.idCliente = null;
      }
    });
  }

  onSalvarCliente(form: NgForm) {
    if (form.invalid) return;
    if (this.modo === "criar"){
      this.clienteService.adicionarCliente(
        form.value.nome,
        form.value.fone,
        form.value.email
      );
    }
    else{
      this.clienteService.atualizarCliente(
        this.idCliente,
        form.value.nome,
        form.value.fone,
        form.value.email
      )
    }
    form.resetForm();
  }
}
