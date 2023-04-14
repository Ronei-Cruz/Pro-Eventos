import { Component, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
  // providers: [EventoService] -> umas das maneiras de injeção de dependência
})

export class EventosComponent implements OnInit {

  constructor( ) { }

  public ngOnInit() {

  }

}
