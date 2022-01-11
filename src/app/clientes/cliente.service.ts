import { Injectable } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common/'


//import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
import { Region } from './region'
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
//import { of } from 'rxjs/observable/of';
import { of, Observable, throwError } from 'rxjs';

import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8080/api/clientes';
  constructor(private http: HttpClient, private router: Router) { }
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  /*
    private agregarAuthorizationHeader() {
      let token = this.authService.token;
      if (token != null) {
        return this.httpHeaders.append('Authorization', 'Bearer ' + token);
      }
      return this.httpHeaders;
    }*/
  /*  private isNoAutorizado(e): boolean {
      if (e.status == 401) {
        if (this.authService.isAuthenticated) {
          this.authService.logout();
        }
        this.router.navigate(['/login']);
        return true;

      }
      if (e.status == 403) {
        swal.fire('Acceso denegado', `Hola ${this.authService.usuario.username}, no tienes acceso a este recurso`, 'warning');
        this.router.navigate(['/clientes']);
        return true;

      }
      return false;

    }*/
  getClientes(page: number): Observable<any> {
    //  return of(CLIENTES);
    return this.http.get<Cliente[]>(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
        console.log('ClientService: tap1');
        //  let clientes = response as Cliente[];
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
        }

        );
      }),
      map((response: any) => {

        (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();

          // cliente.createdAt = formatDate(cliente.createdAt, 'dd-MM-yyyy', 'en-US');
          let datePipe = new DatePipe('es');
          //  cliente.createdAt = datePipe.transform(cliente.createdAt,'EEEE dd, MMMM yyyy');
          return cliente;
        });
        return response;
      }),

      tap(response => {
        console.log('ClientService: tap2');
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
        }

        );
      }),


    );
    //return this.http.get(this.urlEndPoint).pipe(map(response => response as Cliente[]));
  }

  public create(cliente: Cliente): Observable<Cliente> {

    return this.http.post(this.urlEndPoint, cliente).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {

        if (e.status == 400) {
          return throwError(e);
        }
        console.error(e.error.mensaje);

        return throwError(e);
      })

    );
  }

  getCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/clientes']);
          console.error(e.error.mensaje);
        }


        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente)



  }

  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`)

  }

  subirFoto(archivo: File, id: string): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);
    let httpHeaders = new HttpHeaders();


    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    });
    return this.http.request(req)/*.pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );*/
  }

  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(this.urlEndPoint + '/regiones')

  }
}
