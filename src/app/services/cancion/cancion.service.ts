import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CancionDTO } from '../../models/cancion.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CancionService {
  private API_URL = 'http://localhost:9000/kia_web/cancion/';

  constructor(private http:HttpClient) { }

  getAllCanciones(): Observable<CancionDTO[]>{
    return this.http.get<CancionDTO[]>(this.API_URL);
  }
}
