import {
    ChangeDetectorRef,
    Component,
    Input,
    ViewEncapsulation,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, takeUntil } from 'rxjs';
import { FormControl, NgForm, Validators } from '@angular/forms';

import { Language } from '../../setup.types';
import { SetupService } from '../../setup.service';

@Component({
    selector: 'app-addlanguage',
    templateUrl: './addlanguage.component.html',
    styleUrls: ['./addlanguage.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AddlanguageComponent {
    @Input() DATA: Language = new Language();
    @Input() drawerClose: Function;
    isScreenSmall: boolean;
    oldlanguages: Language[] = [];
    oldlanguages2 = [
        'Maharashtra',
        'Karnataka',
        'Uttar Pradesh',
        'Assam',
        'Goa',
    ];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    name = new FormControl('', [Validators.required]);
    code = new FormControl('', [Validators.required]);
    dailectOf = new FormControl('', [Validators.required]);

    getErrorMessage1() {
        return this.name.hasError('required') ? 'You must enter a Name' : '';
    }
    getErrorMessage2() {
        return this.code.hasError('required') ? 'You must enter a Code' : '';
    }

    getErrorMessage3() {
        return this.dailectOf.hasError('required')
            ? 'You must enter a Dailect Of'
            : '';
    }

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _snackBar: MatSnackBar,
        private _inventoryService: SetupService,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    ) {}

    /**
     * Close drawer
     *
     * @param closeDrawer
     */
    closeDrawer(languageForm: NgForm): void {
        languageForm.form.markAsUntouched();
        languageForm.form.reset();
        this.drawerClose();
        this._changeDetectorRef.markForCheck();
    }

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

    Save(languageForm: NgForm): void {
        var isOk = true;
        if (
            this.DATA.NAME == undefined ||
            this.DATA.NAME == null ||
            this.DATA.NAME == '' ||
            this.DATA.NAME.trim() == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Enter Name', 'E');
        } else if (
            this.DATA.CODE == undefined ||
            this.DATA.CODE == null ||
            this.DATA.CODE == '' ||
            this.DATA.CODE.trim() == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Enter Code', 'E');
        }
        if (this.DATA.IS_DIALECT == true) {
            if (
                this.DATA.DIALECT_OF == undefined ||
                this.DATA.DIALECT_OF == null ||
                this.DATA.DIALECT_OF == '' ||
                this.DATA.DIALECT_OF.trim() == ''
            ) {
                isOk = false;
                this.openSnackBar('Please Enter Dialect Of', 'E');
            }
        }

        if (isOk) {
            if (this.DATA.ID != undefined && this.DATA.ID > 0) {
                // // Create the product
                this._inventoryService
                    .updateLanguage(this.DATA.ID, this.DATA)
                    .subscribe((data) => {
                        // Mark for check
                        this.openSnackBar(
                            'Information updated successfully',
                            'S'
                        );
                        languageForm.form.markAsUntouched();
                        languageForm.form.reset();
                        this.drawerClose();
                        this._changeDetectorRef.markForCheck();
                    });
            } else {
                // // Create the product
                this._inventoryService
                    .createLanguage(this.DATA)
                    .subscribe((data) => {
                        // Go to new product
                        this.DATA = new Language();

                        // Mark for check
                        this.openSnackBar(
                            'Information saved successfully',
                            'S'
                        );
                        languageForm.form.markAsUntouched();
                        languageForm.form.reset();
                        this.drawerClose();
                        this._changeDetectorRef.markForCheck();
                    });
            }
        }
    }
}
