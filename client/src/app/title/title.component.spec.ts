import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '../app.module';
import { HarnessLoader } from '@angular/cdk/testing';
import { ListDataService } from '../service/list-data.service';
import { LocalStorageService } from '../service/local-storage.service';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { TitleComponent } from './title.component';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { LocalStorageKey } from '../enum';

describe('TitleComponent', () => {
  let component: TitleComponent;
  let fixture: ComponentFixture<TitleComponent>;
  let loader: HarnessLoader;
  let listDataServiceSpy: jasmine.SpyObj<ListDataService>;
  let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;

  beforeEach(async () => {
    listDataServiceSpy = jasmine.createSpyObj(
      'listDataServiceSpy',
      ['add', 'switchDataOrder', 'filterDescFrom', 'replaceDataStore'],
      { dataStore: new Map() }
    );
    listDataServiceSpy.add.calls.reset();
    listDataServiceSpy.switchDataOrder.calls.reset();
    listDataServiceSpy.filterDescFrom.calls.reset();
    listDataServiceSpy.replaceDataStore.calls.reset();

    localStorageServiceSpy = jasmine.createSpyObj(
      'localStorageServiceSpy',
      ['get', 'set']
    );
    localStorageServiceSpy.get.and.returnValue(null);

    await TestBed.configureTestingModule({
      imports: [
        AppModule,
      ],
      declarations: [
        TitleComponent,
      ],
      providers: [
        { provide: ListDataService, useValue: listDataServiceSpy },
        { provide: LocalStorageService, useValue: localStorageServiceSpy },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(TitleComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    clearInterval(component.routine);

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize searchWord as empty string', () => {
    expect(component.searchWord).toEqual('');
  });

  it('should click the "add" button', async () => {
    const button = await loader.getHarness(MatButtonHarness.with({ text: 'add' }));

    await button.click();

    expect(listDataServiceSpy.add).toHaveBeenCalledWith('New Task');
  });

  it('should click the "sort" button', async () => {
    const button = await loader.getHarness(MatButtonHarness.with({ text: 'sort' }));

    await button.click();

    expect(listDataServiceSpy.switchDataOrder).toHaveBeenCalled();
  });

  it('should change the "Search" input', async () => {
    const input = await loader.getHarness(MatInputHarness.with({ placeholder: 'Search' }));

    await input.setValue('new');

    expect(listDataServiceSpy.filterDescFrom).toHaveBeenCalled();
  });

  it('should clear interval on destroy', () => {
    component.routine = setInterval(() => undefined, 5000);
    spyOn(globalThis, 'clearInterval').and.callThrough();

    component.ngOnDestroy();

    expect(globalThis.clearInterval).toHaveBeenCalled();
  });

  it('should load data from localStorage on init when data exists', () => {
    const fakeStorageData = new Map([
      ['id1', { description: 'stored task', isCompleted: false, timeStamp: new Date().toISOString() }],
    ]);
    localStorageServiceSpy.get.and.returnValue(fakeStorageData);

    component.ngOnInit();

    expect(localStorageServiceSpy.get).toHaveBeenCalledWith(LocalStorageKey.TODO_DATA_STORE);
    expect(listDataServiceSpy.replaceDataStore).toHaveBeenCalledWith(
      Array.from(fakeStorageData.entries())
    );
  });

  it('should not replace data store when localStorage is empty', () => {
    localStorageServiceSpy.get.and.returnValue(null);

    component.ngOnInit();

    expect(localStorageServiceSpy.get).toHaveBeenCalledWith(LocalStorageKey.TODO_DATA_STORE);
    expect(listDataServiceSpy.replaceDataStore).not.toHaveBeenCalled();
  });

  it('should not replace data store when localStorage returns empty Map', () => {
    localStorageServiceSpy.get.and.returnValue(new Map());

    component.ngOnInit();

    expect(listDataServiceSpy.replaceDataStore).not.toHaveBeenCalled();
  });

  it('should have a toolbar with title text', () => {
    const toolbar = fixture.nativeElement.querySelector('mat-toolbar');
    expect(toolbar).toBeTruthy();
    expect(toolbar.textContent).toContain('A simple to-do-list');
  });

  it('should call onAdd when add button is clicked', () => {
    spyOn(component, 'onAdd');

    const addButton = fixture.nativeElement.querySelector('button[aria-label*="add new to-do task"]');
    addButton.click();

    expect(component.onAdd).toHaveBeenCalled();
  });

  it('should call onSort when sort button is clicked', () => {
    spyOn(component, 'onSort');

    const sortButton = fixture.nativeElement.querySelector('button[aria-label*="change the order"]');
    sortButton.click();

    expect(component.onSort).toHaveBeenCalled();
  });
});
