import { Component, inject } from '@angular/core';
import { ListDataService } from '../service/list-data.service';

@Component({
  selector: 'app-to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrl: './to-do-list.component.css'
})
export class ToDoListComponent {
  readonly listDataService = inject(ListDataService);

  checkCompleted(key: string) {
    this.listDataService.changeIsCompleted(key);
  }

  onDeleteByKey(key: string) {
    this.listDataService.delete(key);
  }
}
