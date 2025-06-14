import { CancionReaction } from "./CancionReaction";

export class Cancion {
    id: number = 0;
    nombre: string = '';
    autor: string = '';
    link: string = '';
    postedby: string = '';
    reaccionMasVotada?: string;
    comentarios?: { id: number; contenido: string; nombreUsuario: string }[] = [];
    nuevoComentario?: string = '';

}