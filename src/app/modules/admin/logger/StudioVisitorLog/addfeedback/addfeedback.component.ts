import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { LoginService } from '../../loginactivity.service';
import { Country } from 'app/modules/admin/contacts/contacts.types';
import { feedbacksetting } from '../../loginativity.type';

@Component({
    selector: 'app-addfeedback',
    templateUrl: './addfeedback.component.html',
    styleUrls: ['./addfeedback.component.scss'],
})
export class AddfeedbackComponent {
    @Input() DATA: feedbacksetting = new feedbacksetting();
    @Input() drawerClose: Function;

    countries: Country[] = [];
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
        if (isOk) {
            // // Create the product
            this._inventoryService
                .createFeedback(this.DATA)
                .subscribe((data) => {
                    // Go to new product
                    this.DATA = new feedbacksetting();
                    console.log(data);

                    // Mark for check
                    this.openSnackBar('Information saved successfully', 'S');
                    this.drawerClose();
                    this._changeDetectorRef.markForCheck();
                });

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
        this.DATA = new feedbacksetting();
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
