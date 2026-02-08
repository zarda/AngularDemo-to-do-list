import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ListDataService } from '../service/list-data.service';
import { LocalStorageKey } from '../enum';
import { LocalStorageService } from '../service/local-storage.service';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrl: './title.component.css'
})
export class TitleComponent implements OnInit, OnDestroy {
  searchWord: string;
  routine: ReturnType<typeof setInterval>;

  private readonly listDataService = inject(ListDataService);
  private readonly localStorageService = inject(LocalStorageService);

  constructor() {
    this.searchWord = '';
    this.routine = setInterval(() => {
      this.localStorageService.set(LocalStorageKey.TODO_DATA_STORE, this.listDataService.dataStore);
    }, 5000);
  }

  ngOnInit(): void {
    const storageData = this.localStorageService.get(LocalStorageKey.TODO_DATA_STORE) || new Map();
    if (storageData.size) {
      this.listDataService.replaceDataStore(Array.from(storageData.entries()));
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.routine);
  }

  onAdd() {
    this.listDataService.add('New Task');
  }

  onSort() {
    this.listDataService.switchDataOrder();
  }

  onFilter($event: string) {
    this.listDataService.filterDescFrom($event);
  }
}