import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import {
    AuthenticationVendor,
    Visitors,
    Visits,
} from '../../authentications.types';
import { Subject, takeUntil } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AuthenticationService } from '../../authentications.service';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher/media-watcher.service';
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { Country } from 'app/modules/admin/contacts/contacts.types';

@Component({
    selector: 'addvisits',
    templateUrl: './addvisits.component.html',
    styleUrls: ['./addvisits.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AddvisitsComponent {
    @Input() DATA: Visits = new Visits();
    @Input() drawerClose: Function;
    @Input() countries: Country[] = [];
    oldvisitors: Visitors[] = [];
    vendors: AuthenticationVendor[] = [];
    isScreenSmall: boolean;
    hrsList: string[] = [
        '00',
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '11',
        '12',
    ];
    minuteList: string[] = [
        '00',
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
    ];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    /**
     * Constructor
     */
    constructor(
        private _apiService: AuthenticationService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _snackBar: MatSnackBar,
        private _fuseMediaWatcherService: FuseMediaWatcherService
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
        this.getOldVisitors();
        // Get the vendors
        this._apiService.vendors$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((vendors: AuthenticationVendor[]) => {
                // Update the vendors
                this.vendors = vendors;

                // Mark for check
                this._changeDetectorRef.markForCheck();
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
        var isOk = true;
        if (
            this.DATA.VISITOR_ID == undefined ||
            this.DATA.VISITOR_ID == null ||
            this.DATA.VISITOR_ID == 0
        ) {
            isOk = false;
            this.openSnackBar('Please Select Visitor', 'E');
        } else if (
            this.DATA.PURPOSE_OF_VISIT == undefined ||
            this.DATA.PURPOSE_OF_VISIT == null ||
            this.DATA.PURPOSE_OF_VISIT.toString().trim() == ''
        ) {
            isOk = false;
            this.openSnackBar('Please enter Purpose of visit', 'E');
        } else if (
            this.DATA.MEETING_WITH_ID == undefined ||
            this.DATA.MEETING_WITH_ID == null ||
            this.DATA.MEETING_WITH_ID == 0
        ) {
            isOk = false;
            this.openSnackBar('Please select meeting with', 'E');
        } else if (
            this.DATA.DATE_OF_VISIT == undefined ||
            this.DATA.DATE_OF_VISIT == null
        ) {
            isOk = false;
            this.openSnackBar('Please select date', 'E');
        } else if (
            this.DATA.DURATION_HRS == undefined ||
            this.DATA.DURATION_HRS == null ||
            this.DATA.DURATION_HRS < 0
        ) {
            isOk = false;
            this.openSnackBar('Please enter duration in hrs', 'E');
        } else if (
            this.DATA.DURATION_MINUTES == undefined ||
            this.DATA.DURATION_MINUTES == null ||
            this.DATA.DURATION_MINUTES < 0
        ) {
            isOk = false;
            this.openSnackBar('Please enter duration in minutes', 'E');
        } else if (
            this.DATA.DURATION_HRS <= 0 &&
            this.DATA.DURATION_MINUTES <= 0
        ) {
            isOk = false;
            this.openSnackBar('Please enter valid duration', 'E');
        }

        if (isOk) {
            this.openSnackBar('Information saved successfully', 'S');
            this.drawerClose();
            this._changeDetectorRef.markForCheck();

            // this.openSnackBar('Failed to saved information', 'E');
        }

        // // Update the contact on the server
        // this._contactsService
        //     .updateContact(contact.id, contact)
        //     .subscribe(() => {
        //         // Toggle the edit mode off
        //         this.toggleEditMode(false);
        //     });
    }

    /**
     * Delete the contact
     */
    deleteContact(): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete contact',
            message:
                'Are you sure you want to delete this visit? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });
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

    newvisitor: Visitors = new Visitors();
    addVisitor() {
        this.newvisitor = new Visitors();
    }

    newvisitorDrawerClose(): void {
        this._changeDetectorRef.markForCheck();
        this.getOldVisitors();
        var d = document.getElementById('closenewvisitorDrawer') as HTMLElement;
        d.click();
    }

    get newvisitorDrawerCloseCallback() {
        return this.newvisitorDrawerClose.bind(this);
    }

    getOldVisitors() {
        // Get the visitors
        this._apiService
            .getVisitors(undefined, undefined, 'NAME', 'asc', undefined)
            .subscribe((data) => {
                // Update the brands
                this.oldvisitors = data.visitors;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }
}
