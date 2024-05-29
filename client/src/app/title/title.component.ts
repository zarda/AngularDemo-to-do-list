import { Component, OnInit } from '@angular/core';
import { ListDataService } from '../service/list-data.service';
import { LocalStorageKey } from '../enum';
import { LocalStorageService } from '../service/local-storage.service';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrl: './title.component.css'
})
export class TitleComponent implements OnInit {
  searchWord: string;
  routine: ReturnType<typeof setInterval>;

  constructor(
    private readonly listDataService: ListDataService,
    private readonly localStorageService: LocalStorageService,
  ) {
    this.searchWord = '';
    this.routine = setInterval(() => {
      console.log('Saved data to local storage.');
      this.localStorageService.set(LocalStorageKey.TODO_DATA_STORE, this.listDataService.dataStore);
    }, 5000);
  }

  ngOnInit(): void {
    const storageData = this.localStorageService.get(LocalStorageKey.TODO_DATA_STORE) || new Map();
    if (storageData.size) {
      () => this.listDataService.replaceDataStore(Array.from(storageData.entries()));
    }
  }

  onAdd() {
    this.listDataService.add('New Task');
  }

  onSort() {
    this.listDataService.switchDataOrder();
  }

  onFilter($event: any) {
    this.listDataService.filterDescFrom($event);
  }
}