import {Component, VERSION} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  constructor() { this.title = 'Angular 4 Showcase (' + VERSION.full + ')'; }
  title;

}
