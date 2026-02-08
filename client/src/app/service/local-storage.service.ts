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
    } catch {
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

/** Helper function for JSON.stringify to handle Map serialization */
function replacer(_key: string, value: unknown): unknown {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value),
    };
  }
  return value;
}

/** Helper function for JSON.parse to handle Map deserialization */
function reviver(_key: string, value: unknown): unknown {
  if (typeof value === 'object' && value !== null) {
    const obj = value as Record<string, unknown>;
    if (obj['dataType'] === 'Map') {
      return new Map(obj['value'] as Iterable<readonly [unknown, unknown]>);
    }
  }
  return value;
}
