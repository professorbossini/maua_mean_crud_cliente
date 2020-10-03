import { Component, OnInit, OnDestroy } from '@angular/core';
import { Cliente } from '../cliente.model';
import { ClienteService } from '../cliente.service';
import { Subscription } from 'rxjs';

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

  ngOnInit(): void {
    this.estaCarregando = true;
    this.clienteService.getClientes();
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

  ngOnDestroy(): void {
    this.clientesSubscription.unsubscribe();
  }
}
