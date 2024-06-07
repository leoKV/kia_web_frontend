import { Component, OnInit } from '@angular/core';
import { CancionDTO } from './models/cancion.dto';
import { CancionService } from './services/cancion/cancion.service';
import { CancionTagDTO } from './models/cancion-tag.dto';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'kia_web_frontend';
  sideNavStatus:boolean = false;
  canciones: CancionDTO[] = [];
  cancionesByTags:CancionTagDTO[] =[];
  page!:number;
  isFiltered: boolean = false;
  noResults: boolean = false;

  constructor(public cancionService: CancionService){}

  ngOnInit(): void {
    this.loadAllCanciones();
  }

  loadAllCanciones(){
    this.cancionService.getAllCanciones().subscribe((data: CancionDTO[]) => {
      this.canciones = data;
      this.isFiltered = false;
      this.noResults = false;
    });
  }
  
  onTagsSelected(tags: number[]): void {
    if (tags.length === 0) {
      this.loadAllCanciones(); // Si no hay etiquetas seleccionadas, cargar todas las canciones
      return;
    }

    this.cancionService.getCancionesByTags(tags).subscribe((data: CancionTagDTO[]) => {
      //console.log("Canciones filtradas:", data);

      this.cancionesByTags = data;
      this.isFiltered = true;
      this.noResults = data.length === 0; // Si no hay resultados, mostrar el mensaje de "sin resultados"

      // Actualizar el arreglo de canciones filtradas y los estados
      if (data.length > 0) {
        this.cancionesByTags = data;
        this.noResults = false;
        this.page=1;
      } else {
        this.cancionesByTags = [];
        this.noResults = true;
      }
    }, (error) => {
      //console.error("Error al filtrar canciones:", error);
      this.cancionesByTags = [];
      this.isFiltered = true;
      this.noResults = true;
    });
  }
}
