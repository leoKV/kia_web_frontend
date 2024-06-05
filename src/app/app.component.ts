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
    this.cancionService.getCancionesByTags(tags).subscribe((data: CancionTagDTO[]) => {
      // Actualiza las canciones solo si se reciben datos
      if (data.length > 0) {
        console.log("Canciones filtradas:", data);
        this.cancionesByTags = data;
        this.isFiltered = true;
        this.noResults = false;
      }else{
        this.cancionesByTags = []
        this.isFiltered = true;
        this.noResults = true;
      }
    });
  }

}
