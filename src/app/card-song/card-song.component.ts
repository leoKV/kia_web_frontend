import { Component, Input } from '@angular/core';
import { CancionDTO } from '../models/cancion.dto';
import { CancionTagDTO } from '../models/cancion-tag.dto';

@Component({
  selector: 'app-card-song',
  templateUrl: './card-song.component.html',
  styleUrl: './card-song.component.css'
})
export class CardSongComponent {
  @Input() cancion: CancionDTO | undefined;
  @Input() cancionTag: CancionTagDTO | undefined;

  get nombreCancion(): string {
    return this.getField('nombreCancion');
  }

  get nombreArtista(): string {
    return this.getField('nombreArtista');
  }

  private getField(field: string):string{
    switch(field){
      case 'nombreCancion':
        if (this.cancion) return this.cancion.nombreCancion;
        if (this.cancionTag) return this.cancionTag.cancion_nombre;
        break;
      case 'nombreArtista':
        if (this.cancion) return this.cancion.nombreArtista;
        if (this.cancionTag) return this.cancionTag.artista;
        break;
      default:
        return '';
    }
    return '';
  }
}
