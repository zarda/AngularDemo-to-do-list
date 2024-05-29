import { LocalStorageKey } from './enum';

/**
 * List type
 */
export interface ListData {
    description: string;
    isCompleted: boolean;
    timeStamp: string;
}

/**
 * Local storage value type
 */
export interface LocalStorageValue {
    [LocalStorageKey.DEFAULT]: string;
    [LocalStorageKey.TODO_DATA_STORE]: Map<string, ListData>;
  }
  