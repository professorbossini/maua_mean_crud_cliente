import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../cliente.service';
import {  FormGroup, FormControl, Validators } from '@angular/forms';
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
  public estaCarregando: boolean = false;
  form: FormGroup;
  constructor(public clienteService: ClienteService, public route: ActivatedRoute) {

  }


  ngOnInit(){
    this.form = new FormGroup({
      nome: new FormControl (null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      fone: new FormControl (null, {
        validators: [Validators.required]
      }),
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email]
      })
    });


    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has("idCliente")) {
        this.modo = "editar";
        this.idCliente = paramMap.get("idCliente");
        this.estaCarregando = true;
        this.clienteService.getCliente (this.idCliente).subscribe (dadosCli => {
          this.estaCarregando = false;
          this.cliente = {
            id: dadosCli._id,
            nome: dadosCli.nome,
            fone: dadosCli.fone,
            email: dadosCli.email
          }
          this.form.setValue({
            nome: this.cliente.nome,
            fone: this.cliente.fone,
            email: this.cliente.email
          })
        });
      } else {
        this.modo = "criar";
        this.idCliente = null;
      }
    });
  }

  onSalvarCliente() {
    if (this.form.invalid) return;
    this.estaCarregando = true;
    if (this.modo === "criar"){
      this.clienteService.adicionarCliente(
        this.form.value.nome,
        this.form.value.fone,
        this.form.value.email
      );
    }
    else{
      this.clienteService.atualizarCliente(
        this.idCliente,
        this.form.value.nome,
        this.form.value.fone,
        this.form.value.email
      );
    }
    this.form.reset();
  }
}
