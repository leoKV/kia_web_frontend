import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CancionDTO } from '../../models/cancion.dto';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CancionTagDTO } from '../../models/cancion-tag.dto';
import { CancionDetailDTO } from '../../models/cancion-detail.dto';

@Injectable({
  providedIn: 'root'
})
export class CancionService {
  private API_URL =  `${environment.apiUrl}`;

  constructor(private http:HttpClient) { }

  getAllCanciones(): Observable<CancionDTO[]>{
    return this.http.get<CancionDTO[]>(`${this.API_URL}cancion/`);
  }

  getCancionesByTags(tags:number[]):Observable<CancionTagDTO[]>{
    const params = new HttpParams().set('tags', tags.join(','));
    return this.http.get<CancionTagDTO[]>(`${this.API_URL}cancionTag/`, { params });
  }

  getCancionesByNombre(nombre:string):Observable<CancionDTO[]>{
    const params = new HttpParams().set('nombre', nombre);
    return this.http.get<CancionDTO[]>(`${this.API_URL}cancion/buscar/`, {params})
  }

  getCancionDetailById(id:number):Observable<CancionDetailDTO>{
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<CancionDetailDTO>(`${this.API_URL}cancion/detalle/`, {params});
  }
}
