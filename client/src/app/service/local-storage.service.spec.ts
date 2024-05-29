import { TestBed } from '@angular/core/testing';
import { ListData, LocalStorageValue } from '../interface';
import { LocalStorageService } from './local-storage.service';
import { LocalStorageKey } from '../enum';

describe('LocalStorageService', () => {
  const fakeData = new Map([
    ['id1', {
      description: 'new desc1',
      isCompleted: false,
      timeStamp: Date()
    } as ListData,],
    ['id2', {
      description: 'new desc2',
      isCompleted: true,
      timeStamp: Date()
    } as ListData,],
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

  it('should set string', () => {
    service.set(LocalStorageKey.DEFAULT, '');

    expect(setItemSpy).toHaveBeenCalled();
  });

  it('should get Map data', () => {
    service.get(LocalStorageKey.TODO_DATA_STORE);

    expect(getItemSpy).toHaveBeenCalled();
  });

  it('should get string data', () => {
    service.get(LocalStorageKey.DEFAULT);

    expect(getItemSpy).toHaveBeenCalled();
  });
});
