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
  private idUsuario: string;

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

  public getIdUsuario (): string{
    return this.idUsuario;
  }

  criarUsuario(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    }
    this.httpClient.post("http://localhost:3000/api/usuarios/signup", authData)
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: () => this.authStatusSubject.next(false)
      })
  }

  login(email: string, senha: string) {
    const authData: AuthData = {
      email: email,
      password: senha
    }
    this.httpClient.post<{ token: string, expiresIn: number, idUsuario: string }>('http://localhost:3000/api/usuarios/login', authData).subscribe(resposta => {
      this.token = resposta.token;
      if (this.token){
        const tempoValidadeToken = resposta.expiresIn;
        this.tokenTimer = setTimeout(() => {
          this.logout()
        }, tempoValidadeToken * 1000);
        this.autenticado = true;
        this.idUsuario = resposta.idUsuario;
        this.authStatusSubject.next(true);
        this.salvarDadosAutenticacao(
                    this.token,
                    new Date( new Date().getTime() + tempoValidadeToken * 1000),
                    this.idUsuario
        );
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
    this.idUsuario = null;
    this.removerDadosDeAutenticacao();
    this.router.navigate(['/'])
  }

  private salvarDadosAutenticacao (token: string, validade: Date, idUsuario: string){
    localStorage.setItem ('token', token);
    localStorage.setItem('validade',validade.toISOString());
    localStorage.setItem('idUsuario', idUsuario);
  }

  private removerDadosDeAutenticacao (){
    localStorage.removeItem('token');
    localStorage.removeItem('validade');
    localStorage.removeItem('idUsuario');
  }

  private obterDadosDeAutenticacao (){
    const token = localStorage.getItem('token');
    const validade = localStorage.getItem('validade');
    const idUsuario = localStorage.getItem('idUsuario');
    return (token && validade) ? {token: token, validade: new Date(validade), idUsuario: idUsuario}: null;
  }

  autenticarAutomaticamente (){
    const dadosAutenticacao = this.obterDadosDeAutenticacao();
    if (dadosAutenticacao){
      const agora = new Date();
      const diferenca = dadosAutenticacao.validade.getTime() - agora.getTime();
      if (diferenca > 0){
        this.token = dadosAutenticacao.token;
        this.autenticado = true;
        this.idUsuario = dadosAutenticacao.idUsuario;
        this.authStatusSubject.next(true);
        this.tokenTimer = setTimeout(() => {
          this.logout()
        }, diferenca);

      }
    }
  }
}
