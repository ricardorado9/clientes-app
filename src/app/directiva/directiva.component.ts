import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html'
})
export class DirectivaComponent {
  listaCurso: string[] = ['TypeScript', 'JavaScipt', 'Java', 'C#', 'PHP'];
  habilitar: boolean = true;
  constructor() { }

 setHabilitar(): void {this.habilitar = !this.habilitar;}

}
