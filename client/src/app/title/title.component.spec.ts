import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '../app.module';
import { HarnessLoader } from '@angular/cdk/testing';
import { ListDataService } from '../service/list-data.service';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { TitleComponent } from './title.component';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

describe('TitleComponent', () => {
  let component: TitleComponent;
  let fixture: ComponentFixture<TitleComponent>;
  let loader: HarnessLoader;
  let listDataServiceSpy: jasmine.SpyObj<ListDataService>;

  beforeEach(async () => {
    listDataServiceSpy = jasmine.createSpyObj(
      'listDataServiceSpy',
      ['add', 'switchDataOrder', 'filterDescFrom']
    );
    listDataServiceSpy.add.calls.reset();
    listDataServiceSpy.switchDataOrder.calls.reset();
    listDataServiceSpy.filterDescFrom.calls.reset();

    await TestBed.configureTestingModule({
      imports: [
        AppModule,
      ],
      declarations: [
        TitleComponent,
      ],
      providers: [
        { provide: ListDataService, useValue: listDataServiceSpy },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(TitleComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should click the "add" button ', async () => {
    const button = await loader.getHarness(MatButtonHarness.with({ text: 'add' }));

    await button.click();

    expect(listDataServiceSpy.add).toHaveBeenCalledWith('New Task');
  });

  it('should click the "sort" button ', async () => {
    const button = await loader.getHarness(MatButtonHarness.with({ text: 'sort' }));

    await button.click();

    expect(listDataServiceSpy.switchDataOrder).toHaveBeenCalled();
  });

  it('should change the "Search" input ', async () => {
    const input = await loader.getHarness(MatInputHarness.with({ placeholder: 'Search' }));

    await input.setValue('new');

    expect(listDataServiceSpy.filterDescFrom).toHaveBeenCalled();
  });
});
