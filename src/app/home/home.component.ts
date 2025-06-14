import { Component } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { CancionService } from '../services/cancion.service';
import { Cancion } from '../models/canciones/Cancion';
import { CancionReaction } from '../models/canciones/CancionReaction';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'], // <- typo: era `styleUrl` y debe ser `styleUrls`
})
export class HomeComponent {
  username: string = '';
  cancionNombre: string = '';
  cancionLink: string = '';
  canciones: Cancion[] = [];
  cancionAutor: string = '';


  paginaActual: number = 0;
  tamañoPagina: number = 10;
  totalPaginas: number = 0;

  constructor(
    private storageService: StorageService,
    private cancionService: CancionService
  ) {
    this.username = this.storageService.getSession('user');
    console.log('Usuario:', this.username);
    this.getCanciones();
  }


  public getCanciones() {
    this.cancionService.getCanciones(this.paginaActual, this.tamañoPagina).subscribe((res: any) => {
      this.canciones = res.content;
      this.totalPaginas = res.totalPages;

      this.canciones.forEach((cancion) => {
        this.cancionService.getReaccionMasVotada(cancion.id).subscribe({
          next: (reaccion) => (cancion.reaccionMasVotada = reaccion),
          error: () => (cancion.reaccionMasVotada = 'Sin votos')
        });

        this.cargarComentarios(cancion);
      });
    });
  }

  getNumeroEstrellas(reaccion: string): number {
    const match = reaccion.match(/STAR_(\d)/);
    return match ? parseInt(match[1], 10) : 0;
  }


  public addCancion() {
    const nuevaCancion: Cancion = {
      id: 0,
      nombre: this.cancionNombre,
      link: this.cancionLink,
      autor: this.cancionAutor,
      postedby: this.username
    };

    console.log('Canción agregada:', nuevaCancion);
    this.cancionService.postCancion(nuevaCancion).subscribe((respuesta: any) => {
      console.log('Canción agregada:', respuesta);
      this.getCanciones();
    });
  }

  public reaccionar(cancionId: number, reactionId: number) {
    const reaccion: CancionReaction = {
      cancionId: cancionId,
      reactionId: reactionId,
    };

    this.cancionService.postReaccion(reaccion).subscribe({
      next: (res) => {
        console.log('Reacción enviada:', res);
        this.getCanciones(); // recargar para ver la reacción más votada actualizada
      },
      error: (err) => {
        console.error('Error al enviar reacción:', err);
      }
    });
  }

  public cargarComentarios(cancion: Cancion) {
    this.cancionService.getComentariosPorCancion(cancion.id).subscribe({
      next: (comentarios) => {
        cancion.comentarios = comentarios;
      },
      error: (err) => {
        console.error(`Error al cargar comentarios para la canción ${cancion.id}`, err);
      }
    });
  }

  public crearComentario(cancion: Cancion) {
    if (!cancion.nuevoComentario || cancion.nuevoComentario.trim() === '') return;

    const comentario = {
      contenido: cancion.nuevoComentario,
      cancionId: cancion.id
    };

    this.cancionService.postComentario(comentario).subscribe({
      next: () => {
        cancion.nuevoComentario = '';
        this.cargarComentarios(cancion);
      },
      error: (err) => {
        console.error('Error al crear comentario:', err);
      }
    });
  }

}
