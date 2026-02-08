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

  it(`should have ${numberOfTestData} data`, () => {
    expect(service.getDataSize()).toEqual(numberOfTestData);
  });

  it(`should delete ${numberOfTestData / 2} data`, () => {
    const targetKeys = service.getKeys().slice(0, numberOfTestData / 2);
    targetKeys.forEach(key => service.delete(key));

    expect(service.getDataSize()).toEqual(numberOfTestData / 2);
  });

  it('should get description', () => {
    const targetIndex = 3;
    const key = service.getKeys()[targetIndex];

    expect(service.getDescription(key)).toEqual(`task${targetIndex}`);
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

  it('should get timestamp', () => {
    const targetIndex = 2;
    const key = service.getKeys()[targetIndex];
    const timestamp = service.getTimestamp(key);

    expect(timestamp).toBeDefined();
    expect(typeof timestamp).toBe('string');
  });

  it('should get isCompleted', () => {
    const key = service.getKeys()[1];

    expect(service.getIsCompleted(key)).toBeFalse();
  });

  it('should change isCompleted', () => {
    const key = service.getKeys()[3];
    expect(service.getIsCompleted(key)).toBeFalse();

    service.changeIsCompleted(key);

    expect(service.getIsCompleted(key)).toBeTrue();
  });

  it('should not change isCompleted for non-existent key', () => {
    service.changeIsCompleted('non-existent-key');

    expect(service.getIsCompleted('non-existent-key')).toBeUndefined();
  });

  it('should get reversed keys', () => {
    const testKeys = service.getReversedKeys();
    const keys = service.getKeys();

    testKeys.reverse();

    expect(testKeys).toEqual(keys);
  });

  it('should sort keys', () => {
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

  it('should cycle through data order states', () => {
    service.dataOrder = DataOrder.DEFAULT;
    spyOn(service, 'getDoneKeys').and.callThrough();

    service.switchDataOrder();
    expect(service.dataOrder).toEqual(DataOrder.DONE_FIRST);
    expect(service.getDoneKeys).toHaveBeenCalled();

    service.switchDataOrder();
    expect(service.dataOrder).toEqual(DataOrder.DONE_LAST);
    expect(service.getDoneKeys).toHaveBeenCalled();

    service.switchDataOrder();
    expect(service.dataOrder).toEqual(DataOrder.DEFAULT);
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

  it('should replace all data', () => {
    service.replaceDataStore([['id1', {
      description: 'new desc',
      isCompleted: false,
      timeStamp: new Date().toISOString()
    } as ListData]]);

    expect(service.dataStore.size).toEqual(1);
    expect(service.keys.length).toEqual(1);
  });

  it('should provide trackByKey function', () => {
    expect(service.trackByKey(0, 'test-key')).toEqual('test-key');
  });
});
