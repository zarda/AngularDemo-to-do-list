import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '../app.module';
import { HarnessLoader } from '@angular/cdk/testing';
import { ListDataService } from '../service/list-data.service';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { ToDoListComponent } from './to-do-list.component';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

describe('ToDoListComponent', () => {
  const dataStoreFake = new Map();
  let component: ToDoListComponent;
  let fixture: ComponentFixture<ToDoListComponent>;
  let loader: HarnessLoader;
  let listDataServiceSpy: jasmine.SpyObj<ListDataService>;
  let checkboxes: MatCheckboxHarness[];
  let buttons: MatButtonHarness[];
  let inputs: MatInputHarness[];

  beforeEach(async () => {
    listDataServiceSpy = jasmine.createSpyObj(
      'listDataServiceSpy',
      ['getIsCompleted', 'getDescription', 'setDescription', 'changeIsCompleted', 'delete',],
      { keys: ['id1', 'id2', 'id3',] }
    );
    listDataServiceSpy.getIsCompleted.calls.reset();
    listDataServiceSpy.getDescription.calls.reset();
    listDataServiceSpy.setDescription.calls.reset();
    listDataServiceSpy.changeIsCompleted.calls.reset();
    listDataServiceSpy.delete.calls.reset();

    await TestBed.configureTestingModule({
      imports: [
        AppModule,
      ],
      declarations: [ToDoListComponent],
      providers: [
        { provide: ListDataService, useValue: listDataServiceSpy },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(ToDoListComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);

    checkboxes = await loader.getAllHarnesses(MatCheckboxHarness);
    buttons = await loader.getAllHarnesses(MatButtonHarness);
    inputs = await loader.getAllHarnesses(MatInputHarness);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have 3 checkboxes', () => {
    expect(checkboxes.length).toEqual(3);
    expect(buttons.length).toEqual(3);
    expect(inputs.length).toEqual(3);
  });

  it('should change the completed chackbox', async () => {
    const checkbox = checkboxes[0];
    listDataServiceSpy.getIsCompleted.and.returnValue(false);

    await checkbox.check();

    expect(await checkbox.isChecked()).toBeTrue();
    expect(listDataServiceSpy.changeIsCompleted).toHaveBeenCalledOnceWith('id1');
  });

  it('should delete the task item', async () => {
    const button = buttons[0];

    await button.click();

    expect(listDataServiceSpy.delete).toHaveBeenCalledOnceWith('id1');
  });

  it('should change the description', async () => {
    const input = inputs[0];
    const oldDesc = 'old description';
    const newDesc = 'new task';
    listDataServiceSpy.getDescription.and.returnValue(oldDesc);
    expect(await input.getValue()).toEqual(oldDesc);

    await input.setValue(newDesc);

    expect(await input.getValue()).toEqual(newDesc);
  });

  it('should trigger a change of description', async () => {
    const newDecs = 'new task';
    const inputHost = await inputs[0].host();

    await inputHost.dispatchEvent('change');

    expect(listDataServiceSpy.setDescription).toHaveBeenCalled();
  });
});
