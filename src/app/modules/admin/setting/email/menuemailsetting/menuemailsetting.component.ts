import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    TemplateRef,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';

import { Subject, takeUntil } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher/media-watcher.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Country } from 'app/modules/admin/contacts/contacts.types';
import { SettingService } from './../../setting.service';
import { EmailSettingData, EmailSettingPagination } from './../../setting.type';

@Component({
    selector: 'app-menuemailsetting',
    templateUrl: './menuemailsetting.component.html',
    styleUrls: ['./menuemailsetting.component.scss'],
})

export class MenuemailsettingComponent {
    @Input() DATA1: EmailSettingData = new EmailSettingData();
    @Input() drawerClose1: Function;
    @Input() countries: Country[] = [];
    emailproviders=["ProtonMail","Gmail","Yahoo! Mail","GMX","Mailfence","Hushmail"]
    vendors: any[] = [];
    answer: number = null;
    isScreenSmall: boolean;
    @Input() deleteShow = false;
    @Input() value = Math.floor(10 * Math.random());
    @Input() value2 = Math.floor(10 * Math.random());

    EmailsettingDrawer(): void {
        this._changeDetectorRef.markForCheck();
        var d = document.getElementById('closeDrawer') as HTMLElement;
        d.click();
        console.log('hee');
    }

   
    constructor(                                                           
        private _changeDetectorRef: ChangeDetectorRef,
        private _snackBar: MatSnackBar
    ) {}

    get visitorDrawerCloseCallback() {
        return this.EmailsettingDrawer.bind(this);
    }

/****Show SnackBar ******/

    openSnackBar(msg: string, type) {
        this._snackBar.open(msg, '', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: type == 'E' ? 'style-error' : 'style-success',
        });
    }

    /**
     * delete floor details
     */
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
