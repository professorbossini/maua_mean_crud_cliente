import { Component, OnInit, OnDestroy } from '@angular/core';
import { Cliente } from '../cliente.model';
import { ClienteService } from '../cliente.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-cliente-lista',
  templateUrl: './cliente-lista.component.html',
  styleUrls: ['./cliente-lista.component.css'],
})
export class ClienteListaComponent implements OnInit, OnDestroy {
  constructor(public clienteService: ClienteService) {}

  clientes: Cliente[] = [];
  private clientesSubscription: Subscription;
  public estaCarregando: boolean = false;
  public totalDeClientes: number = 10;
  public totalDeClientesPorPagina: number = 2;
  public paginaAtual: number = 1;
  public opcoesTotalDeClientesPorPagina: number[] = [2, 5, 10];

  ngOnInit(): void {
    this.estaCarregando = true;
    this.clienteService.getClientes(this.totalDeClientesPorPagina, this.paginaAtual);
    this.clientesSubscription = this.clienteService
      .getListaDeClientesAtualizadaObservable()
      .subscribe((clientes: Cliente[]) => {
        this.estaCarregando = false;
        this.clientes = clientes;
      });
  }

  onDelete (id: string): void {
    this.clienteService.removerCliente(id);
  }

  onPaginaAlterada (dadosPagina: PageEvent){
    //console.log(dadosPagina);
    this.estaCarregando = true;
    this.paginaAtual = dadosPagina.pageIndex + 1;
    this.totalDeClientesPorPagina = dadosPagina.pageSize;
    this.clienteService.getClientes (this.totalDeClientesPorPagina, this.paginaAtual);
  }

  ngOnDestroy(): void {
    this.clientesSubscription.unsubscribe();
  }
}
