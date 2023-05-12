import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher/media-watcher.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { Country } from '../../contacts/contacts.types';
import { EventLogs } from '../loginativity.type';
import { LoginService } from '../loginactivity.service';

@Component({
    selector: 'app-addeventvisitorlog',
    templateUrl: './addeventvisitorlog.component.html',
    styleUrls: ['./addeventvisitorlog.component.scss'],
})
export class AddeventvisitorlogComponent {
    @Input() DATA: EventLogs = new EventLogs();
    @Input() drawerClose: Function;
    @Input() countries: Country[] = [];
    isScreenSmall: boolean;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    /**
     * Constructor
     */
    constructor(
        private _fuseConfirmationService: FuseConfirmationService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _snackBar: MatSnackBar,
        private _inventoryService: LoginService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private datePipe: DatePipe
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
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
     * Update the contact
     */
    Save(): void {
        this.DATA.VISITEDON = this.datePipe.transform(
            this.DATA.VISITEDON,
            'dd/MM/yyyy'
        );

        console.log('this.DATA.VISITEDON', this.DATA.VISITEDON);

        var isOk = true;
       
        if (isOk) {
            if (this.DATA.ID != undefined && this.DATA.ID > 0) {
                // Create the product
                this._inventoryService
                    .updatevents(this.DATA.ID, this.DATA)
                    .subscribe((data) => {
                        // Mark for check
                        this.openSnackBar(
                            'Information updated successfully',
                            'S'
                        );
                        this.drawerClose();
                        this._changeDetectorRef.markForCheck();
                    });
            }
           

            // this.openSnackBar('Failed to saved information', 'E');
        }
    }

    /**
     * Close drawer
     *
     * @param closeDrawer
     */
    closeDrawer(): void {
        this.drawerClose();
        this._changeDetectorRef.markForCheck();
    }
    expertise = 0;
    formatLabel(value: number): string {
        if (value >= 1000) {
            return Math.round(value / 1000) + 'k';
        }

        return `${value}`;
    }

    ValidateMobileNumber(str) {
        return /^[6-9]\d{9}$/.test(str);
    }

    ValidateEmail(str) {
        return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(str);
    }
}
