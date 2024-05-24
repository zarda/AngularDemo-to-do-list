import { Injectable } from '@angular/core';
import { ListData } from '../interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ListDataService {
  dataStore: Map<string, ListData>;

  constructor() {
    this.dataStore = new Map();
  }

  addList(desc: string) {
    const id = uuidv4();
    console.log(`Create a new list of id ${id}.`);

    const now = new Date();
    const newData: ListData = { description: desc, isCompleted: false, timeStamp: now.toISOString() };
    this.dataStore.set(id, newData);
  }

  delList(key: string) {
    this.dataStore.delete(key);
  }

  getKeys(): string[] {
    return [...this.dataStore.keys()];
  }

  getSortedKeys(): string[] {
    const sortedKeys = this.getKeys();
    sortedKeys.sort();
    return sortedKeys;
  }

  getDataSize() {
    return this.dataStore.size;
  }

  setDescription(key: string, newDesc: string) {
    const targetData = this.dataStore.get(key);
    if(targetData == undefined) {
      return;
    }

    this.dataStore.set(key, {...targetData, description: newDesc});
  }

  getDescription(key: string) {
    return this.dataStore.get(key)?.description;
  }

  changeIsCompleted(key: string) {
    const targetData = this.dataStore.get(key);
    if(targetData == undefined) {
      return;
    }
    const isCompleted = this.dataStore.get(key)?.isCompleted;
    if(isCompleted == undefined) {
      return;
    }

    this.dataStore.set(key, {...targetData, isCompleted: !isCompleted});
  }

  getIsCompleted(key: string) {
    return this.dataStore.get(key)?.isCompleted;
  }
}
