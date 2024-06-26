import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly urlBase: string;
  private readonly controllerToken: string = "tokenize";
  public token: string;  

  constructor(
    private router: Router, 
    private httpCliente: HttpClient,
  ) {
    this.urlBase = environment.api
  }

  public login(email: string, password: string): Observable<any>{
    return this.httpCliente.post<Observable<any>>(`${this.urlBase}${this.controllerToken}/web`, {
      document: email,
      password: password
    });
  }

  public userDatail(id: string): Observable<any>{
    const headers = {
      Authorization: `Bearer ${this.token}`
    };
    return this.httpCliente.get<Observable<any>>(`${this.urlBase}users/${id}`, { headers });
  }

  public logout(): void {
    sessionStorage.removeItem("AUTH_TOKE");
    this.router.navigate(["/auth/login"]);
  }
}
