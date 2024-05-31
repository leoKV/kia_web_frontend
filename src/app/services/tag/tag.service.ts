import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoTagDTO } from '../../models/tipo-tag.dto';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  private API_URL = 'http://localhost:9000/kia_web/tag/tipo/';

  constructor(private http:HttpClient) { }

  getTagsByTipoTag(): Observable<TipoTagDTO[]> {
    return this.http.get<TipoTagDTO[]>(this.API_URL);
  }
}
