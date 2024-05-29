import { Component } from '@angular/core';
import { ListDataService } from '../service/list-data.service';

@Component({
  selector: 'to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrl: './to-do-list.component.css'
})
export class ToDoListComponent {
  constructor(
    readonly listDataService: ListDataService,
  ) { }

  checkCompleted(key: string) {
    this.listDataService.changeIsCompleted(key);
  }

  onDeleteByKey(key: string, $event: any) {
    this.listDataService.delete(key);
  }
}
