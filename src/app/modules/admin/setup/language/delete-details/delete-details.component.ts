import { Component, Input } from '@angular/core'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { Language } from '../../setup.types';

@Component({
  selector: 'app-delete-details',
  templateUrl: './delete-details.component.html',
  styleUrls: ['./delete-details.component.scss']
})
export class DeleteDetailsComponent {
  @Input() DATA: Language = new Language();
  @Input() drawerClose: Function;

  answer: number = null;
  value = Math.floor(10 * Math.random());
  value2 = Math.floor(10 * Math.random());
  isScreenSmall: boolean;
  oldlanguages2 = ['Maharashtra', 'Karnataka', 'Uttar Pradesh', 'Assam', 'Goa'];

  constructor(private _snackBar: MatSnackBar) { }

  /****Show SnackBar ******/
  openSnackBar(msg: string, type) {
    this._snackBar.open(msg, '', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 3000,
      panelClass: type == 'E' ? 'style-error' : 'style-success',
    });
  }

  deleteInfo() {
    if (this.answer == undefined || this.answer == null) {
      this.openSnackBar('Please solve the puzzle', 'E');
    } else if (this.answer != this.value + this.value2) {
      this.openSnackBar('Wrong answer', 'E');
    } else {
      this.openSnackBar('Information deleted successfully', 'S');
      var d = document.getElementById('closeDrawer2') as HTMLElement;
      d.click();
    }
  }
}