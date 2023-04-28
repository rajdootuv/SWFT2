import { Component, Input } from '@angular/core';  
import { Language } from '../../setup.types';

@Component({
  selector: 'app-view-details',
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.scss']
})
export class ViewDetailsComponent {
  @Input() DATA: Language = new Language();
  @Input() drawerClose: Function;
  
  isScreenSmall: boolean;
  oldlanguages2 = ['Maharashtra', 'Karnataka', 'Uttar Pradesh', 'Assam', 'Goa'];
}
