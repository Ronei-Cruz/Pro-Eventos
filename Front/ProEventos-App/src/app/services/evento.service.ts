import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evento } from '../models/Evento';

@Injectable(
  //{providedIn: 'root'} -> umas das maneiras de injeção de dependência
  )
export class EventoService {

  baseURL = 'https://localhost:5001/api/eventos';
  constructor(private http: HttpClient) { }

  public getEventos() : Observable<Evento[]>{
    return this.http.get<Evento[]>(this.baseURL);
  }

  public getEventosByTema(tema: string) : Observable<Evento[]>{
    return this.http.get<Evento[]>(`${this.baseURL}/${tema}/tema`);
  }

  public getEventoById(id: number) : Observable<Evento>{
    return this.http.get<Evento>(`${this.baseURL}/${id}`);
  }

  public post(evento: Evento) : Observable<Evento>{
    return this.http.post<Evento>(this.baseURL, evento);
  }

  public put(evento: Evento) : Observable<Evento>{
    return this.http.put<Evento>(`${this.baseURL}/${evento.id}`, evento);
  }

  public deleteEvento(id: number) : Observable<any>{
    return this.http.delete(`${this.baseURL}/${id}`);
  }

  public save(evento: Evento): Observable<Evento> {
    if (evento.id) {
      return this.put(evento);
    } else {
      return this.post(evento);
    }
  }
}
