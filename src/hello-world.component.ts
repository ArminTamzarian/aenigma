import { Component } from '@angular/core';

@Component({
  selector: 'aenigma-hello-world',
  template: 'Hello world from the {{ projectTitle }} module!'
})
export class HelloWorldComponent {
  projectTitle: string = 'aenigma';
}
