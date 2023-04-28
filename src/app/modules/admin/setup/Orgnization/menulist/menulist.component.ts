import {
    ChangeDetectorRef,
    Component,
    Input,
    TemplateRef,
} from '@angular/core'; 
import { MatSnackBar } from '@angular/material/snack-bar';

import {
    MatDialog, 
} from '@angular/material/dialog';
import { Country } from 'app/modules/admin/contacts/contacts.types';
import { OrganizationData } from '../../setup.types'; 

@Component({
    selector: 'app-menulist',
    templateUrl: './menulist.component.html',
    styleUrls: ['./menulist.component.scss'],
})
export class MenulistComponent {
    @Input() DATA1: OrganizationData = new OrganizationData();
    @Input() drawerClose1: Function;
    @Input() countries: Country[] = [];
    vendors: any[] = [];
    answer: number = null;
    isScreenSmall: boolean;
    @Input() deleteShow = false;
    @Input() value = Math.floor(10 * Math.random());
    @Input() value2 = Math.floor(10 * Math.random());

    visitorDrawerClose(): void {
        this._changeDetectorRef.markForCheck();
        var d = document.getElementById('closeDrawer') as HTMLElement;
        d.click();
        console.log('hee');
    }

    openDialog(templateRef: TemplateRef<any>) {
        this.dialog.open(templateRef);
    }

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _snackBar: MatSnackBar,
        public dialog: MatDialog
    ) {}

    get visitorDrawerCloseCallback() {
        return this.visitorDrawerClose.bind(this);
    }

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
