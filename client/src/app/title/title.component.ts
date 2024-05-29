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
  routine!: ReturnType<typeof setInterval>;

  constructor(
    readonly listDataService: ListDataService,
    readonly localStorageService: LocalStorageService,
  ) {
    this.searchWord = '';
  }

  ngOnInit() {
    const storageData = this.localStorageService.get(LocalStorageKey.TODO_DATA_STORE);
    if (storageData !== null) {
      this.listDataService.dataStore = storageData;
      this.listDataService.keys = [...storageData.keys()].reverse();
    }

    this.routine = setInterval(() => {
      console.log('Saved data to local storage.');
      this.localStorageService.set(LocalStorageKey.TODO_DATA_STORE, this.listDataService.dataStore);
    }, 5000);
  }
}