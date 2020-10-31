import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { AuthData } from './auth-data.model';

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private token: string;
  private autenticado: boolean = false;
  private authStatusSubject = new Subject<boolean>();

  constructor(private httpClient: HttpClient) {

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
    this.httpClient.post<{ token: string }>('http://localhost:3000/api/usuarios/login', authData).subscribe(resposta => {
      this.token = resposta.token;
      if (this.token){
        this.autenticado = true;
        this.authStatusSubject.next(true);
        console.log(resposta);
      }
    })
  }
}
