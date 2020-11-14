import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { AuthData } from './auth-data.model';

import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private token: string;
  private autenticado: boolean = false;
  private authStatusSubject = new Subject<boolean>();
  private tokenTimer: NodeJS.Timer;

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) {

  }

  public getStatusSubject (){
    return this.authStatusSubject.asObservable();
  }

  public isAutenticado (): boolean{
    return this.autenticado;
  }

  public getToken(): string {
    return this.token;
  }

  criarUsuario(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    }
    this.httpClient.post("http://localhost:3000/api/usuarios/signup", authData)
      .subscribe((resposta) => {
        console.log(resposta);
      })
  }

  login(email: string, senha: string) {
    const authData: AuthData = {
      email: email,
      password: senha
    }
    this.httpClient.post<{ token: string, expiresIn: number }>('http://localhost:3000/api/usuarios/login', authData).subscribe(resposta => {
      this.token = resposta.token;
      if (this.token){
        const tempoValidadeToken = resposta.expiresIn;
        this.tokenTimer = setTimeout(() => {
          this.logout()
        }, tempoValidadeToken * 1000);
        this.autenticado = true;
        this.authStatusSubject.next(true);
        this.salvarDadosAutenticacao(this.token, new Date( new Date().getTime() + tempoValidadeToken * 1000));
        console.log(resposta);
        this.router.navigate(['/']);
      }
    })
  }

  logout(){
    this.token = null;
    this.autenticado = false;
    this.authStatusSubject.next(false)
    clearTimeout(this.tokenTimer);
    this.removerDadosDeAutenticacao();
    this.router.navigate(['/'])
  }

  private salvarDadosAutenticacao (token: string, validade: Date){
    localStorage.setItem ('token', token);
    localStorage.setItem('validade',validade.toISOString());
  }

  private removerDadosDeAutenticacao (){
    localStorage.removeItem('token');
    localStorage.removeItem('validade');
  }

  private obterDadosDeAutenticacao (){
    const token = localStorage.getItem('token');
    const validade = localStorage.getItem('validade');
    return (token && validade) ? {token: token, validade: new Date(validade)}: null;
  }

  autenticarAutomaticamente (){
    const dadosAutenticacao = this.obterDadosDeAutenticacao();
    if (dadosAutenticacao){
      const agora = new Date();
      const diferenca = dadosAutenticacao.validade.getTime() - agora.getTime();
      if (diferenca > 0){
        this.token = dadosAutenticacao.token;
        this.autenticado = true;
        this.authStatusSubject.next(true);
        this.tokenTimer = setTimeout(() => {
          this.logout()
        }, diferenca);

      }
    }
  }
}
