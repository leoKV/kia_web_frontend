import { Component, Input } from '@angular/core';
import { CancionDTO } from '../models/cancion.dto';

@Component({
  selector: 'app-card-song',
  templateUrl: './card-song.component.html',
  styleUrl: './card-song.component.css'
})
export class CardSongComponent {
  @Input() cancion: CancionDTO | undefined;
}
