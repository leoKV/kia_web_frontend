import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoTagDTO } from '../../models/tipo-tag.dto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  private API_URL = `${environment.apiUrl}`;

  constructor(private http:HttpClient) { }

  getTagsByTipoTag(): Observable<TipoTagDTO[]> {
    return this.http.get<TipoTagDTO[]>(`${this.API_URL}tag/tipo/`);
  }

}
