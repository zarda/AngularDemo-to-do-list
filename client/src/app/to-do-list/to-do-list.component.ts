import { Component, OnInit } from '@angular/core';
import { ListDataService } from '../service/list-data.service';
import { LocalStorageService } from '../service/local-storage.service';
import { LocalStorageKey } from '../enum';

@Component({
  selector: 'to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrl: './to-do-list.component.css'
})
export class ToDoListComponent implements OnInit {
  routine!: ReturnType<typeof setInterval>;

  constructor(
    readonly listDataService: ListDataService,
    readonly localStorageService: LocalStorageService,
  ) { }

  ngOnInit() {
    const storageData = this.localStorageService.get(LocalStorageKey.TODO_DATA_STORE);
    if (storageData !== null) {
      this.listDataService.dataStore = storageData;
      this.listDataService.keys = this.listDataService.getReversedKeys();
    }

    this.routine = setInterval(() => {
      console.log('Saved data to local storage.');
      this.localStorageService.set(LocalStorageKey.TODO_DATA_STORE, this.listDataService.dataStore);
    }, 5000);
  }

  checkCompleted(key: string) {
    this.listDataService.changeIsCompleted(key);
  }

  onDeleteByKey(key: string, $event: any) {
    this.listDataService.delete(key);
  }
}
