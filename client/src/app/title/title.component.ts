import { Component } from '@angular/core';
import { ListDataService } from '../service/list-data.service';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrl: './title.component.css'
})
export class TitleComponent {

  constructor(readonly listDataService: ListDataService) { }

}
