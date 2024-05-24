import { Component } from '@angular/core';
import { ListDataService } from '../service/list-data.service';

@Component({
  selector: 'to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrl: './to-do-list.component.css'
})
export class ToDoListComponent {

  constructor(readonly listDataService: ListDataService) {
    DEMO_DATA.forEach(data => this.listDataService.addList(data.description));
  }

  checkCompleted(key: string) {
    this.listDataService.changeIsCompleted(key);
  }
}

const DEMO_DATA = [
  { description: 'demo1', isCompleted: false },
  { description: 'demo2', isCompleted: true },
  { description: 'demo3', isCompleted: false },
];