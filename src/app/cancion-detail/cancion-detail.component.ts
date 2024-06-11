import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CancionService } from '../services/cancion/cancion.service';
import { CancionDetailDTO } from '../models/cancion-detail.dto';

@Component({
  selector: 'app-cancion-detail',
  templateUrl: './cancion-detail.component.html',
  styleUrl: './cancion-detail.component.css'
})
export class CancionDetailComponent implements OnInit {
  
  cancionDetail : CancionDetailDTO | undefined;

  constructor(
    private route: ActivatedRoute,
    private cancionService:CancionService
  ){}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCancionDetail(parseInt(id, 10));
    }
    // this.route.params.subscribe(params => {
    //   const id = +params['id'];
    //   this.loadCancionDetail(id);
    // });
  }

  loadCancionDetail(id: number): void {
    this.cancionService.getCancionDetailById(id).subscribe((data: CancionDetailDTO) => {
      this.cancionDetail = data;
    });
  }
}


