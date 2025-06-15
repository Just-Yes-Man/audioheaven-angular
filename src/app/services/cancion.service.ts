import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { StorageService } from './storage.service';
import { Cancion } from '../models/canciones/Cancion';
import { CancionReaction } from '../models/canciones/CancionReaction';

@Injectable({
  providedIn: 'root',
})
export class CancionService {
  apiURL = 'https://audioheaven-spring.onrender.com/';
  token = '';

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
    this.token = this.storageService.getSession('token');
    console.log(this.token);
  }



  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: 'Bearer ' + this.token,
    }),
  };

  errorMessage = '';
  getHttpOptions() {
    const token = this.storageService.getSession('token'); // lee porque si no se me traba por alguna razon
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      }),
    };
  }
  postCancion(myCancion: Cancion): Observable<any> {
    return this.http
      .post(this.apiURL + 'api/cancion/create', myCancion, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }
  postReaccion(reactionRequest: CancionReaction): Observable<any> {
    return this.http.post(
      this.apiURL + 'api/reactions/create', // asegúrate de que esta ruta coincida
      reactionRequest,
      this.getHttpOptions()
    ).pipe(catchError(this.handleError));
  }

  getCanciones(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(
      `${this.apiURL}api/cancion/all?page=${page}&size=${size}`,
      this.getHttpOptions()
    ).pipe(retry(1), catchError(this.handleError));
  }

  getReaccionMasVotada(cancionId: number): Observable<string> {
    return this.http.get(`https://audioheaven-spring.onrender.com/api/reactions/most-voted/${cancionId}`, {
      responseType: 'text'
    });
  }
  postComentario(comentario: { contenido: string; cancionId: number }): Observable<any> {
    return this.http.post(this.apiURL + 'api/comentarios/create', comentario, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  getComentariosPorCancion(cancionId: number): Observable<any[]> {
    return this.http.get<any[]>(this.apiURL + `api/comentarios/get/${cancionId}`, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }
  buscarCanciones(termino: string): Observable<Cancion[]> {
    return this.http.get<Cancion[]>(`https://audioheaven-spring.onrender.com/api/cancion/buscar?termino=${termino}`);
  }
  deleteCancion(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiURL}api/cancion/delete/${id}`,
      {
        ...this.getHttpOptions(),
        responseType: 'text' as 'json'  // 👈 esto evita que Angular intente parsear JSON
      }
    ).pipe(
      catchError(this.handleError)
    );
  }








  handleError(error: any) {
    let errorMessage = '';

    if (error.status === 403) {
      errorMessage = 'No tienes permisos para borrar esta canción.';
    } else if (error.status === 404) {
      errorMessage = 'La canción no fue encontrada.';
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error ${error.status}: ${error.message}`;
    }

    console.error('Error desde handleError:', errorMessage);

    Swal.fire({
      icon: 'error',
      title: '¡Ups!',
      text: errorMessage,
      confirmButtonColor: '#d33'
    });

    return throwError(() => errorMessage);
  }


}
