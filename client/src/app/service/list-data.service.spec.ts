import { TestBed } from '@angular/core/testing';
import { ListDataService } from './list-data.service';
import { ListData } from '../interface';
import { DataOrder } from '../enum';

describe('ListDataService', () => {
  const numberOfTestData = 10;
  let service: ListDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListDataService);

    for (let i = 0; i < numberOfTestData; i++) {
      service.add(`task${i}`);
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default values', () => {
    const freshService = new ListDataService();
    expect(freshService.dataStore.size).toEqual(0);
    expect(freshService.keys.length).toEqual(0);
    expect(freshService.dataOrder).toEqual(DataOrder.DEFAULT);
  });

  it(`should have ${numberOfTestData} data after adding`, () => {
    expect(service.getDataSize()).toEqual(numberOfTestData);
  });

  it('should add a new task with correct initial values', () => {
    const initialSize = service.getDataSize();
    service.add('My New Task');

    expect(service.getDataSize()).toEqual(initialSize + 1);
    const newestKey = service.keys[0]; // newest is first (reversed keys)
    expect(service.getDescription(newestKey)).toEqual('My New Task');
    expect(service.getIsCompleted(newestKey)).toBeFalse();
    expect(service.getTimestamp(newestKey)).toBeDefined();
  });

  it('should place newest task at the front of keys', () => {
    service.add('Latest Task');
    const firstKey = service.keys[0];

    expect(service.getDescription(firstKey)).toEqual('Latest Task');
  });

  it(`should delete ${numberOfTestData / 2} data`, () => {
    const targetKeys = service.getKeys().slice(0, numberOfTestData / 2);
    targetKeys.forEach(key => service.delete(key));

    expect(service.getDataSize()).toEqual(numberOfTestData / 2);
  });

  it('should remove key from keys array when deleting', () => {
    const keyToDelete = service.keys[0];
    const initialKeysLength = service.keys.length;

    service.delete(keyToDelete);

    expect(service.keys.length).toEqual(initialKeysLength - 1);
    expect(service.keys).not.toContain(keyToDelete);
  });

  it('should handle deleting a non-existent key gracefully', () => {
    const initialSize = service.getDataSize();
    const initialKeysLength = service.keys.length;

    service.delete('non-existent-key');

    expect(service.getDataSize()).toEqual(initialSize);
    expect(service.keys.length).toEqual(initialKeysLength);
  });

  it('should get description', () => {
    const targetIndex = 3;
    const key = service.getKeys()[targetIndex];

    expect(service.getDescription(key)).toEqual(`task${targetIndex}`);
  });

  it('should return undefined for description of non-existent key', () => {
    expect(service.getDescription('non-existent-key')).toBeUndefined();
  });

  it('should set description', () => {
    const targetIndex = 4;
    const targetDesc = 'new task';
    const key = service.getKeys()[targetIndex];

    service.setDescription(key, targetDesc);

    expect(service.getDescription(key)).toEqual(targetDesc);
  });

  it('should not set description for non-existent key', () => {
    service.setDescription('non-existent-key', 'new desc');

    expect(service.getDescription('non-existent-key')).toBeUndefined();
  });

  it('should preserve other fields when setting description', () => {
    const key = service.getKeys()[0];
    const originalTimestamp = service.getTimestamp(key);
    const originalIsCompleted = service.getIsCompleted(key);

    service.setDescription(key, 'updated description');

    expect(service.getTimestamp(key)).toEqual(originalTimestamp!);
    expect(service.getIsCompleted(key)).toEqual(originalIsCompleted!);
  });

  it('should get timestamp', () => {
    const targetIndex = 2;
    const key = service.getKeys()[targetIndex];
    const timestamp = service.getTimestamp(key);

    expect(timestamp).toBeDefined();
    expect(typeof timestamp).toBe('string');
  });

  it('should return undefined for timestamp of non-existent key', () => {
    expect(service.getTimestamp('non-existent-key')).toBeUndefined();
  });

  it('should store valid ISO timestamp', () => {
    const key = service.getKeys()[0];
    const timestamp = service.getTimestamp(key);

    expect(timestamp).toBeDefined();
    const parsed = new Date(timestamp!);
    expect(parsed.getTime()).not.toBeNaN();
  });

  it('should get isCompleted', () => {
    const key = service.getKeys()[1];

    expect(service.getIsCompleted(key)).toBeFalse();
  });

  it('should return undefined for isCompleted of non-existent key', () => {
    expect(service.getIsCompleted('non-existent-key')).toBeUndefined();
  });

  it('should change isCompleted (toggle on)', () => {
    const key = service.getKeys()[3];
    expect(service.getIsCompleted(key)).toBeFalse();

    service.changeIsCompleted(key);

    expect(service.getIsCompleted(key)).toBeTrue();
  });

  it('should change isCompleted (toggle off)', () => {
    const key = service.getKeys()[3];
    service.changeIsCompleted(key); // toggle on
    expect(service.getIsCompleted(key)).toBeTrue();

    service.changeIsCompleted(key); // toggle off

    expect(service.getIsCompleted(key)).toBeFalse();
  });

  it('should not change isCompleted for non-existent key', () => {
    service.changeIsCompleted('non-existent-key');

    expect(service.getIsCompleted('non-existent-key')).toBeUndefined();
  });

  it('should preserve other fields when changing isCompleted', () => {
    const key = service.getKeys()[0];
    const originalDesc = service.getDescription(key);
    const originalTimestamp = service.getTimestamp(key);

    service.changeIsCompleted(key);

    expect(service.getDescription(key)).toEqual(originalDesc!);
    expect(service.getTimestamp(key)).toEqual(originalTimestamp!);
  });

  it('should get reversed keys', () => {
    const testKeys = service.getReversedKeys();
    const keys = service.getKeys();

    testKeys.reverse();

    expect(testKeys).toEqual(keys);
  });

  it('should return keys in insertion order via getKeys', () => {
    const keys = service.getKeys();

    expect(keys.length).toEqual(numberOfTestData);
    for (let i = 0; i < numberOfTestData; i++) {
      expect(service.getDescription(keys[i])).toEqual(`task${i}`);
    }
  });

  it('should sort keys with done tasks first', () => {
    const key1 = service.getKeys()[numberOfTestData / 2 - 1];
    service.changeIsCompleted(key1);
    const key2 = service.getKeys()[numberOfTestData / 2 + 1];
    service.changeIsCompleted(key2);

    const doneKeys = service.getDoneKeys(service.getKeys());

    expect(service.getIsCompleted(doneKeys.first[0])).toBeTrue();
    expect(service.getIsCompleted(doneKeys.first[1])).toBeTrue();
    expect(service.getIsCompleted(doneKeys.last[numberOfTestData - 1])).toBeTrue();
    expect(service.getIsCompleted(doneKeys.last[numberOfTestData - 2])).toBeTrue();
  });

  it('should handle getDoneKeys with all undone', () => {
    const doneKeys = service.getDoneKeys(service.getKeys());

    expect(doneKeys.first.length).toEqual(numberOfTestData);
    expect(doneKeys.last.length).toEqual(numberOfTestData);
    // All undone, so first and last should be the same
    expect(doneKeys.first).toEqual(doneKeys.last);
  });

  it('should handle getDoneKeys with all done', () => {
    service.getKeys().forEach(key => service.changeIsCompleted(key));

    const doneKeys = service.getDoneKeys(service.getKeys());

    expect(doneKeys.first.length).toEqual(numberOfTestData);
    expect(doneKeys.last.length).toEqual(numberOfTestData);
    expect(doneKeys.first).toEqual(doneKeys.last);
  });

  it('should cycle through data order states', () => {
    service.dataOrder = DataOrder.DEFAULT;
    spyOn(service, 'getDoneKeys').and.callThrough();

    service.switchDataOrder();
    expect(service.dataOrder as DataOrder).toEqual(DataOrder.DONE_FIRST);
    expect(service.getDoneKeys).toHaveBeenCalled();

    service.switchDataOrder();
    expect(service.dataOrder as DataOrder).toEqual(DataOrder.DONE_LAST);
    expect(service.getDoneKeys).toHaveBeenCalled();

    service.switchDataOrder();
    expect(service.dataOrder as DataOrder).toEqual(DataOrder.DEFAULT);
  });

  it('should sort by timestamp descending when returning to DEFAULT order', () => {
    // Cycle through to DEFAULT to trigger timestamp sort
    service.switchDataOrder(); // -> DONE_FIRST
    service.switchDataOrder(); // -> DONE_LAST
    service.switchDataOrder(); // -> DEFAULT (sorts by timestamp desc)

    // Verify the keys are sorted by timestamp descending
    for (let i = 0; i < service.keys.length - 1; i++) {
      const tsA = service.getTimestamp(service.keys[i]) ?? '';
      const tsB = service.getTimestamp(service.keys[i + 1]) ?? '';
      expect(tsA.localeCompare(tsB)).toBeGreaterThanOrEqual(0);
    }
  });

  it('should retrieve to default data order when no word to filter', () => {
    const defaultKeys = service.getReversedKeys();
    service.switchDataOrder();
    expect(service.keys).not.toEqual(defaultKeys);

    service.filterDescFrom('');

    expect(service.keys).toEqual(defaultKeys);
  });

  it('should filter a key from a word', () => {
    const targetIndex = 5;

    service.filterDescFrom(targetIndex.toString());

    expect(service.keys.length).toEqual(1);
    expect(service.getDescription(service.keys[0])).toEqual(`task${targetIndex}`);
  });

  it('should filter case-insensitively', () => {
    service.add('Important TASK');

    service.filterDescFrom('important');

    expect(service.keys.length).toEqual(1);
    expect(service.getDescription(service.keys[0])).toEqual('Important TASK');
  });

  it('should return empty keys when filter matches nothing', () => {
    service.filterDescFrom('nonexistentword');

    expect(service.keys.length).toEqual(0);
  });

  it('should filter multiple matching tasks', () => {
    // 'task' is in all descriptions (task0 through task9)
    service.filterDescFrom('task');

    expect(service.keys.length).toEqual(numberOfTestData);
  });

  it('should replace all data', () => {
    service.replaceDataStore([['id1', {
      description: 'new desc',
      isCompleted: false,
      timeStamp: new Date().toISOString()
    } as ListData]]);

    expect(service.dataStore.size).toEqual(1);
    expect(service.keys.length).toEqual(1);
  });

  it('should replace data with empty store', () => {
    service.replaceDataStore([]);

    expect(service.dataStore.size).toEqual(0);
    expect(service.keys.length).toEqual(0);
  });

  it('should replace data with multiple entries', () => {
    const entries: [string, ListData][] = [
      ['a', { description: 'desc a', isCompleted: false, timeStamp: new Date().toISOString() }],
      ['b', { description: 'desc b', isCompleted: true, timeStamp: new Date().toISOString() }],
      ['c', { description: 'desc c', isCompleted: false, timeStamp: new Date().toISOString() }],
    ];

    service.replaceDataStore(entries);

    expect(service.dataStore.size).toEqual(3);
    expect(service.keys.length).toEqual(3);
    expect(service.getDescription('a')).toEqual('desc a');
    expect(service.getIsCompleted('b')).toBeTrue();
  });

  it('should provide trackByKey function', () => {
    expect(service.trackByKey(0, 'test-key')).toEqual('test-key');
  });

  it('should return the key regardless of index in trackByKey', () => {
    expect(service.trackByKey(99, 'any-key')).toEqual('any-key');
  });

  it('should return correct data size', () => {
    expect(service.getDataSize()).toEqual(numberOfTestData);

    service.add('extra');
    expect(service.getDataSize()).toEqual(numberOfTestData + 1);

    const key = service.getKeys()[0];
    service.delete(key);
    expect(service.getDataSize()).toEqual(numberOfTestData);
  });
});
