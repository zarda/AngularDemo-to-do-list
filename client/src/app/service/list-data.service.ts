import { Injectable } from '@angular/core';
import { ListData } from '../interface';
import { DataOrder } from '../enum';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ListDataService {
  dataStore: Map<string, ListData>;
  keys: string[];
  dataOrder: DataOrder;

  constructor() {
    this.dataStore = new Map();
    this.keys = [];
    this.dataOrder = DataOrder.DEFAULT;
  }

  add(desc: string) {
    const id = uuidv4();
    console.log(`Create a new list of id ${id}.`);

    const now = new Date();
    const newData: ListData = { description: desc, isCompleted: false, timeStamp: now.toISOString() };
    this.dataStore.set(id, newData);
    this.keys = this.getReversedKeys();
  }

  delete(key: string) {
    this.dataStore.delete(key);
    const index = this.keys.indexOf(key);
    if (index !== -1) {
      this.keys.splice(index, 1);
    }
  }

  getDataSize(): number {
    return this.dataStore.size;
  }

  setDescription(key: string, newDesc: string) {
    const targetData = this.dataStore.get(key);
    if (targetData == undefined) {
      return;
    }

    this.dataStore.set(key, { ...targetData, description: newDesc });
  }

  getDescription(key: string) {
    return this.dataStore.get(key)?.description;
  }

  getTimestamp(key: string) {
    return this.dataStore.get(key)?.timeStamp;
  }

  changeIsCompleted(key: string) {
    const targetData = this.dataStore.get(key);
    if (targetData == undefined) {
      return;
    }
    const isCompleted = this.dataStore.get(key)?.isCompleted;
    if (isCompleted == undefined) {
      return;
    }

    this.dataStore.set(key, { ...targetData, isCompleted: !isCompleted });
  }

  getIsCompleted(key: string) {
    return this.dataStore.get(key)?.isCompleted;
  }

  getDoneKeys(keys: string[]) {
    const done: string[] = [];
    const undone: string[] = [];
    for (let key of keys) {
      if (this.getIsCompleted(key)) {
        done.unshift(key);
      } else {
        undone.unshift(key);
      }
    };
    return { first: [...done, ...undone], last: [...undone, ...done] };
  }

  getKeys(): string[] {
    return [...this.dataStore.keys()];
  }

  getReversedKeys(): string[] {
    return this.getKeys().reverse();
  }

  switchDataOrder() {
    switch (this.dataOrder) {
      case DataOrder.DEFAULT:
        this.dataOrder = DataOrder.DONE_FIRST;
        this.keys = this.getDoneKeys(this.keys).first;
        break;
      case DataOrder.DONE_FIRST:
        this.dataOrder = DataOrder.DONE_LAST;
        this.keys = this.getDoneKeys(this.keys).last;
        break;
      case DataOrder.DONE_LAST:
      default:
        this.dataOrder = DataOrder.DEFAULT;
        this.keys.sort((a, b) => {
          return (''+this.getTimestamp(a)).localeCompare(this.getTimestamp(b)+'');
        }).reverse();
        break;
    }
  }

  filterDescFrom(word: string) {
    if (word.length === 0) {
      this.keys = this.getReversedKeys();
    }

    const keys: string[] = [];
    for (let key of this.getKeys()) {
      const desc = this.getDescription(key);
      if (desc === undefined) {
        continue;
      }
      if (desc.toLowerCase().includes(word.toLowerCase())) {
        keys.unshift(key);
      }
    }
    this.keys = keys;
  }

  replaceDataStore(newDataStore: [string, ListData][]) {
    this.dataStore = new Map(newDataStore);
    this.keys = this.getReversedKeys();
  }
}
