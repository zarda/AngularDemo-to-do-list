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

  addList(desc: string) {
    const id = uuidv4();
    console.log(`Create a new list of id ${id}.`);

    const now = new Date();
    const newData: ListData = { description: desc, isCompleted: false, timeStamp: now.toISOString() };
    this.dataStore.set(id, newData);
    this.keys.unshift(id);
  }

  delList(key: string) {
    this.dataStore.delete(key);
    const index = this.keys.indexOf(key);
    if (index !== -1) {
      this.keys.splice(index, 1);
    }
  }

  getDataSize() {
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

  getDoneFirstKeys() {
    const done: string[] = [];
    const undone: string[] = [];
    for (let key of this.keys) {
      if (this.getIsCompleted(key)) {
        done.push(key);
      } else {
        undone.push(key);
      }
    };
    return [...done, ...undone];
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
        this.keys = this.getDoneFirstKeys().reverse();
        break;
      case DataOrder.DONE_FIRST:
        this.dataOrder = DataOrder.DONE_LAST;
        this.keys = this.getDoneFirstKeys();
        break;
      case DataOrder.DONE_LAST:
      default:
        this.dataOrder = DataOrder.DEFAULT;
        this.keys = this.getReversedKeys();
        break;
    }
  }
}
