import { TestBed } from '@angular/core/testing';
import { ListData } from '../interface';
import { LocalStorageService } from './local-storage.service';
import { LocalStorageKey } from '../enum';

describe('LocalStorageService', () => {
  const fakeData = new Map([
    ['id1', {
      description: 'new desc1',
      isCompleted: false,
      timeStamp: new Date().toISOString(),
    } as ListData],
    ['id2', {
      description: 'new desc2',
      isCompleted: true,
      timeStamp: new Date().toISOString(),
    } as ListData],
  ]);
  let service: LocalStorageService;
  let setItemSpy: jasmine.Spy;
  let getItemSpy: jasmine.Spy;

  beforeEach(() => {
    setItemSpy = spyOn(globalThis.localStorage, 'setItem');
    setItemSpy.and.callThrough();
    setItemSpy.calls.reset();
    getItemSpy = spyOn(globalThis.localStorage, 'getItem');
    getItemSpy.and.callThrough();
    getItemSpy.calls.reset();

    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set Map data', () => {
    service.set(LocalStorageKey.TODO_DATA_STORE, fakeData);

    expect(setItemSpy).toHaveBeenCalled();
  });

  it('should set string data', () => {
    service.set(LocalStorageKey.DEFAULT, 'test-memo');

    expect(setItemSpy).toHaveBeenCalledWith(LocalStorageKey.DEFAULT, 'test-memo');
  });

  it('should set empty string', () => {
    service.set(LocalStorageKey.DEFAULT, '');

    expect(setItemSpy).toHaveBeenCalledWith(LocalStorageKey.DEFAULT, '');
  });

  it('should get Map data', () => {
    service.get(LocalStorageKey.TODO_DATA_STORE);

    expect(getItemSpy).toHaveBeenCalledWith(LocalStorageKey.TODO_DATA_STORE);
  });

  it('should get string data', () => {
    service.get(LocalStorageKey.DEFAULT);

    expect(getItemSpy).toHaveBeenCalledWith(LocalStorageKey.DEFAULT);
  });

  it('should return null when key does not exist in localStorage', () => {
    getItemSpy.and.returnValue(null);

    const result = service.get(LocalStorageKey.TODO_DATA_STORE);

    expect(result).toBeNull();
  });

  it('should round-trip Map data correctly (set then get)', () => {
    // Allow callThrough for set, but intercept get to return what was stored
    let storedValue: string | null = null;
    setItemSpy.and.callFake((_key: string, value: string) => {
      storedValue = value;
    });
    getItemSpy.and.callFake(() => storedValue);

    service.set(LocalStorageKey.TODO_DATA_STORE, fakeData);
    const result = service.get(LocalStorageKey.TODO_DATA_STORE);

    expect(result).toBeTruthy();
    expect(result instanceof Map).toBeTrue();
    expect((result as Map<string, ListData>).size).toEqual(2);
    expect((result as Map<string, ListData>).get('id1')?.description).toEqual('new desc1');
    expect((result as Map<string, ListData>).get('id2')?.isCompleted).toBeTrue();
  });

  it('should return raw string when JSON.parse fails', () => {
    const plainString = 'not-json-content';
    getItemSpy.and.returnValue(plainString);

    const result = service.get(LocalStorageKey.DEFAULT);

    expect(result).toEqual(plainString);
  });

  it('should handle valid JSON that is not a Map', () => {
    const jsonString = JSON.stringify({ some: 'data' });
    getItemSpy.and.returnValue(jsonString);

    const result = service.get(LocalStorageKey.TODO_DATA_STORE);

    expect(result).toBeTruthy();
  });

  it('should serialize Map with nested data correctly', () => {
    const nestedMap = new Map([
      ['id-test', {
        description: 'A task with special chars: <>&"',
        isCompleted: true,
        timeStamp: '2024-01-01T00:00:00.000Z',
      } as ListData],
    ]);

    service.set(LocalStorageKey.TODO_DATA_STORE, nestedMap);

    expect(setItemSpy).toHaveBeenCalled();
    const storedValue = setItemSpy.calls.mostRecent().args[1];
    expect(typeof storedValue).toBe('string');
    expect(storedValue).toContain('dataType');
    expect(storedValue).toContain('Map');
  });

  it('should handle empty Map', () => {
    let storedValue: string | null = null;
    setItemSpy.and.callFake((_key: string, value: string) => {
      storedValue = value;
    });
    getItemSpy.and.callFake(() => storedValue);

    const emptyMap = new Map<string, ListData>();
    service.set(LocalStorageKey.TODO_DATA_STORE, emptyMap);
    const result = service.get(LocalStorageKey.TODO_DATA_STORE);

    expect(result instanceof Map).toBeTrue();
    expect((result as Map<string, ListData>).size).toEqual(0);
  });
});
