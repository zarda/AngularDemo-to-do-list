import { Injectable } from '@angular/core';
import { LocalStorageKey } from '../enum';
import { LocalStorageValue } from '../interface';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  /**
   * @param key LocalStorage key
   */
  get<T extends LocalStorageKey>(key: T): LocalStorageValue[T] | null {
    const str = globalThis.localStorage.getItem(key);
    try {
      if (str == null) {
        return null;
      }
      return JSON.parse(str, reviver) as LocalStorageValue[T];
    } catch (err) {
      // If str originally is a string, then parse will fail, just return it.
      return str as LocalStorageValue[T];
    }
  }

  /**
   * @param key      LocalStorage key
   * @param value    LocalStorage value
   */
  set<T extends LocalStorageKey>(key: T, value: LocalStorageValue[T]) {
    // If `str` is string, do not JSON.stringify it, otherwise it will be, e.g.
    // `str='xxx'` -> `str='"str"'. (Have extra quotation)
    const str = typeof value === 'string' ? value : JSON.stringify(value, replacer);
    globalThis.localStorage.setItem(key, str);
  }
}

// Help function for JSON.stringify
function replacer(key: string, value: any) {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value),
    };
  } else {
    return value;
  }
}

// Help function for JSON.parse
function reviver(key: string, value: any) {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}
