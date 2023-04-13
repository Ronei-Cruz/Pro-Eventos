import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-titulo',
  templateUrl: './titulo.component.html',
  styleUrls: ['./titulo.component.scss']
})
export class TituloComponent implements OnInit {
  @Input() titulo: string;
  @Input() subtitulo: string;
  @Input() iconClass: string;
  @Input() botaoListar: boolean;

  constructor() {
    this.titulo = '';
    this.subtitulo = 'Desde 2023'
    this.iconClass = '';
    this.botaoListar = false;
  }

  ngOnInit() : void {
  }

}
