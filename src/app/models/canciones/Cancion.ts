import { CancionReaction } from "./CancionReaction";

export class Cancion {
    id: number = 0;
    nombre: string = '';
    autor: string = '';
    link: string = '';
    postedBy: {
        id: number;
        username: string;
    } | null = null;
    reaccionMasVotada?: string;
    comentarios?: { id: number; contenido: string; nombreUsuario: string }[] = [];
    nuevoComentario?: string = '';
}