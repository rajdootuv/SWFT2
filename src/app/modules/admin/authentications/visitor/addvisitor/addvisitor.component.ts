import {
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { Visitors } from '../../authentications.types';
import { Subject, takeUntil } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher/media-watcher.service';
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { AuthenticationService } from '../../authentications.service';
import { MapMarker } from '@angular/google-maps';
import { Country } from 'app/modules/admin/contacts/contacts.types';

@Component({
    selector: 'addvisitor',
    templateUrl: './addvisitor.component.html',
    styleUrls: ['./addvisitor.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AddvisitorComponent implements OnInit, OnDestroy {
    @Input() DATA: Visitors = new Visitors();
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
        private _apiService: AuthenticationService,
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
            this.DATA.NAME == undefined ||
            this.DATA.NAME == null ||
            this.DATA.NAME == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Enter Full Name', 'E');
        } else if (
            this.DATA.COMPANY_NAME == undefined ||
            this.DATA.COMPANY_NAME == null ||
            this.DATA.COMPANY_NAME == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Enter Company Name', 'E');
        } else if (
            this.DATA.EMAIL_ID == undefined ||
            this.DATA.EMAIL_ID == null ||
            this.DATA.EMAIL_ID == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Enter Email Id', 'E');
        } else if (!this.ValidateEmail(this.DATA.EMAIL_ID)) {
            isOk = false;
            this.openSnackBar('Please Enter Valid Email Id.', 'E');
        } else if (
            this.DATA.MOBILE_NO == undefined ||
            this.DATA.MOBILE_NO == null ||
            this.DATA.MOBILE_NO == 0
        ) {
            isOk = false;
            this.openSnackBar('Please Enter Mobile no.', 'E');
        } else if (!this.ValidateMobileNumber(this.DATA.MOBILE_NO)) {
            isOk = false;
            this.openSnackBar('Please Enter Valid Mobile no.', 'E');
        } else if (
            this.DATA.DESIGNATION == undefined ||
            this.DATA.DESIGNATION == null ||
            this.DATA.DESIGNATION == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Enter Designation/Profession', 'E');
        }

        if (isOk) {
            if (this.DATA.ID != undefined && this.DATA.ID > 0) {
                // // Create the product
                this._apiService
                    .updateVisitor(this.DATA.ID, this.DATA)
                    .subscribe((data) => {
                        // Mark for check
                        this.openSnackBar(
                            'Information updated successfully',
                            'S'
                        );
                        this.drawerClose();
                        this._changeDetectorRef.markForCheck();
                    });
            } else {
                // // Create the product
                this._apiService.createVisitor(this.DATA).subscribe((data) => {
                    // Go to new product
                    this.DATA = new Visitors();

                    // Mark for check
                    this.openSnackBar('Information saved successfully', 'S');
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

    newvisitor: Visitors = new Visitors();
    addVisitor() {
        this.newvisitor = new Visitors();
    }

    newvisitorDrawerClose(): void {
        this._changeDetectorRef.markForCheck();
        var d = document.getElementById('closeDrawer') as HTMLElement;
        d.click();
    }

    get newvisitorDrawerCloseCallback() {
        return this.newvisitorDrawerClose.bind(this);
    }

    ValidateMobileNumber(str) {
        return /^[6-9]\d{9}$/.test(str);
    }

    ValidateEmail(str) {
        return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(str);
    }


}
