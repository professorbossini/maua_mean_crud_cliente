import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../usuario.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  estaCarregando: boolean = false;
  tipoUsuario: string;
  private authObserver: Subscription;

  onSignup(form: NgForm){
    if (form.invalid) return;
    this.usuarioService.criarUsuario(form.value.email, form.value.password);
  }

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.authObserver = this.usuarioService.getStatusSubject().subscribe( (authStatus) => {
      this.estaCarregando = false;
    });
  }

  ngOnDestroy(): void{
    this.authObserver.unsubscribe();
  }

}
