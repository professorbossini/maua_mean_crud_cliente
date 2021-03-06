import { Component, OnInit, OnDestroy } from '@angular/core';
import { Cliente } from '../cliente.model';
import { ClienteService } from '../cliente.service';
import { UsuarioService } from '../../auth/usuario.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-cliente-lista',
  templateUrl: './cliente-lista.component.html',
  styleUrls: ['./cliente-lista.component.css'],
})
export class ClienteListaComponent implements OnInit, OnDestroy {

  constructor(
    private clienteService: ClienteService,
    private usuarioService: UsuarioService
  ) { }

  clientes: Cliente[] = [];
  private clientesSubscription: Subscription;
  public estaCarregando: boolean = false;
  public totalDeClientes: number = 0;
  public totalDeClientesPorPagina: number = 2;
  public paginaAtual: number = 1;
  public opcoesTotalDeClientesPorPagina: number[] = [2, 5, 10];
  public autenticado: boolean = false;
  public idUsuario: string;
  private authObserver: Subscription;

  ngOnInit(): void {
    this.estaCarregando = true;
    this.clienteService.getClientes(this.totalDeClientesPorPagina, this.paginaAtual);
    this.idUsuario = this.usuarioService.getIdUsuario();
    this.clientesSubscription = this.clienteService
      .getListaDeClientesAtualizadaObservable()
      .subscribe((dados: { clientes: [], maxClientes: number }) => {
        this.estaCarregando = false;
        this.clientes = dados.clientes;
        this.totalDeClientes = dados.maxClientes
      })
    this.autenticado = this.usuarioService.isAutenticado();
    this.authObserver = this.usuarioService.getStatusSubject().subscribe(autenticado => {
      this.autenticado = autenticado
    })
  }

  onDelete(id: string): void {
    this.estaCarregando = true;
    this.clienteService.removerCliente(id).subscribe(() => {
      this.clienteService.getClientes(this.totalDeClientesPorPagina, this.paginaAtual);
    });
  }

  onPaginaAlterada(dadosPagina: PageEvent) {
    //console.log(dadosPagina);
    this.estaCarregando = true;
    this.paginaAtual = dadosPagina.pageIndex + 1;
    this.totalDeClientesPorPagina = dadosPagina.pageSize;
    this.clienteService.getClientes(this.totalDeClientesPorPagina, this.paginaAtual);
  }

  ngOnDestroy(): void {
    this.clientesSubscription.unsubscribe();
    this.authObserver.unsubscribe();
  }
}
