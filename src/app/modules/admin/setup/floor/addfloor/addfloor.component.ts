import {
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher/media-watcher.service';
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { Floors } from '../../setup.types';
import { SetupService } from '../../setup.service';
import { NgForm } from '@angular/forms';
import { Country } from 'app/modules/admin/contacts/contacts.types';

@Component({
    selector: 'addfloor',
    templateUrl: './addfloor.component.html',
    styleUrls: ['./addfloor.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AddfloorComponent implements OnInit, OnDestroy {
    @Input() DATA: Floors = new Floors();
    @Input() drawerClose: Function;
    @Input() countries: Country[] = [];
    isScreenSmall: boolean;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _snackBar: MatSnackBar,
        private _apiService: SetupService,
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
    Save(floorForm: NgForm): void {
        var isOk = true;
        //validations for all fields
        if (
            this.DATA.NAME == undefined &&
            this.DATA.LOCATION == undefined &&
            this.DATA.LENGTH == undefined &&
            this.DATA.WIDTH == undefined
        ) {
            isOk = false;
            this.openSnackBar('Please fill all required fields', 'E');
            floorForm.form.markAllAsTouched();
        } else if (
            this.DATA.NAME == undefined ||
            this.DATA.NAME == null ||
            this.DATA.NAME == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Enter Floor Name', 'E');
        } else if (
            this.DATA.LOCATION == undefined ||
            this.DATA.LOCATION == null ||
            this.DATA.LOCATION == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Enter Location', 'E');
        } else if (
            this.DATA.LENGTH == undefined ||
            this.DATA.LENGTH == null ||
            this.DATA.LENGTH == 0
        ) {
            isOk = false;
            this.openSnackBar('Please Enter Length', 'E');
        } else if (
            this.DATA.WIDTH == undefined ||
            this.DATA.WIDTH == null ||
            this.DATA.WIDTH == 0
        ) {
            isOk = false;
            this.openSnackBar('Please Enter Width', 'E');
        }

        //funcation if all fields are ok
        if (isOk) {
            if (this.DATA.ID != undefined && this.DATA.ID > 0) {
                // // update the product
                this._apiService
                    .updateFloor(this.DATA.ID, this.DATA)
                    .subscribe((data) => {
                        floorForm.form.markAsUntouched();
                        floorForm.form.reset();
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
                this._apiService.createFloor(this.DATA).subscribe((data) => {
                    // Go to new product
                    this.DATA = new Floors();
                    floorForm.form.markAsUntouched();
                    floorForm.form.reset();
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
    closeDrawer(floorForm:NgForm): void {
        floorForm.form.markAsUntouched();
        floorForm.form.reset();
        this.drawerClose();
        this._changeDetectorRef.markForCheck();
    }


     /**
     * Close drawer
     *
     * @param closeDrawer
     */
    ValidateMobileNumber(str) {
        return /^[6-9]\d{9}$/.test(str);
    }

    ValidateEmail(str) {
        return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(str);
    }
}
