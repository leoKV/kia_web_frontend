import { Component, OnInit } from '@angular/core';
import { CancionDTO } from './models/cancion.dto';
import { CancionService } from './services/cancion/cancion.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'kia_web_frontend';
  sideNavStatus:boolean = false;
  canciones: CancionDTO[] = [];
  page!:number;

  constructor(public cancionService: CancionService){}

  ngOnInit(): void {
    this.cancionService.getAllCanciones().subscribe((data: CancionDTO[]) => {
      this.canciones = data;
    });
  }

}
