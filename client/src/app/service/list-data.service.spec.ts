import { TestBed } from '@angular/core/testing';
import { ListDataService } from './list-data.service';
import { ListData } from '../interface';

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

  it('should get timestamp', () => {
    const targetIndex = 2;
    const key = service.getKeys()[targetIndex];
    let targetDate = (new Date()).toISOString();
    targetDate.slice(0, targetDate.length - 2);
    spyOn(globalThis, 'Date').and.returnValue(targetDate);

    expect(service.getTimestamp(key)).toContain(targetDate);
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

  it('should get reversed keys', () => {
    const testKeys = service.getReversedKeys();
    const keys = service.getKeys();

    testKeys.reverse();

    expect(JSON.stringify(testKeys)).toEqual(JSON.stringify(keys));
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

  it('should change dateOrder', () => {
    service.dataOrder = 0;
    spyOn(service, 'getDoneKeys').and.callThrough();

    service.switchDataOrder();

    expect(service.dataOrder.toString()).toEqual('1');
    expect(service.getDoneKeys).toHaveBeenCalled();

    service.switchDataOrder();

    expect(service.dataOrder.toString()).toEqual('2');
    expect(service.getDoneKeys).toHaveBeenCalled();

    service.switchDataOrder();

    expect(service.dataOrder.toString()).toEqual('0');
    expect(service.getDoneKeys).toHaveBeenCalled();
  });

  it('should retrieve to default data order when no word to filter', () => {
    const defaultKeys = service.getReversedKeys();
    service.switchDataOrder();
    expect(JSON.stringify(service.keys)).not.toEqual(JSON.stringify(defaultKeys));

    service.filterDescFrom('');

    expect(JSON.stringify(service.keys)).toEqual(JSON.stringify(defaultKeys));
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
      timeStamp: Date()
    } as ListData,]]);

    expect(service.dataStore.size).toEqual(1);
  });
});
