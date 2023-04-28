import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Theme } from '../../setup.types';
import { Observable, Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SetupService } from '../../setup.service';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ThemePalette } from '@angular/material/core';
import { AbstractControl, FormControl, NgForm } from '@angular/forms';

@Component({
    selector: 'app-add-theme',
    templateUrl: './add-theme.component.html',
    styleUrls: ['./add-theme.component.scss'],
})
export class AddThemeComponent {
    @Input() DATA: Theme = new Theme();
    @Input() drawerClose: Function;
    @Input()
    colort1: any;
    isScreenSmall: boolean;
    theme$: Observable<Theme[]>;
    dataList = [];
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
        console.log(this.DATA.FONTSIZE, 'this.DATA.FONTSIZE');
        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });

        this._apiService
            .getTheme(undefined, undefined, undefined, 'asc', undefined)
            .subscribe((data) => {
                // Update the brands
                this.dataList = data.floors;

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
     /**
     * Save the contact
     */
    Save(form:NgForm): void {

        var isOk = true;

        //  console.log(websitebannerPage.value);
        if (
            this.DATA.NAME == undefined ||
            this.DATA.NAME == null ||
            this.DATA.NAME == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Enter  Name', 'E');
        } else if (
            this.DATA.FONTFAMILY == undefined ||
            this.DATA.FONTFAMILY == null ||
            this.DATA.FONTFAMILY == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Select  Font Family', 'E');
        } else if (
            this.DATA.selectedColor == undefined ||
            this.DATA.selectedColor == null ||
            this.DATA.selectedColor == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Select  Primary  Color', 'E');
        } else if (
            this.DATA.selectedColor2 == undefined ||
            this.DATA.selectedColor2 == null ||
            this.DATA.selectedColor2 == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Select  Secondary  Color', 'E');
        } else if (
            this.DATA.background2light == undefined ||
            this.DATA.background2light == null ||
            this.DATA.background2light == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Select  Background Color Light', 'E');
        } else if (
            this.DATA.background1dark == undefined ||
            this.DATA.background1dark == null ||
            this.DATA.background1dark == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Select  Background Color Dark', 'E');
        } else if (
            this.DATA.textcolor1 == undefined ||
            this.DATA.textcolor1 == null ||
            this.DATA.textcolor1 == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Select  Text Color Light', 'E');
        } else if (
            this.DATA.Textdark1 == undefined ||
            this.DATA.Textdark1 == null ||
            this.DATA.Textdark1 == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Select Text Color Dark', 'E');
        } else if (
            this.DATA.info1 == undefined ||
            this.DATA.info1 == null ||
            this.DATA.info1 == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Select Info Color ', 'E');
        } else if (
            this.DATA.warning1 == undefined ||
            this.DATA.warning1 == null ||
            this.DATA.warning1 == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Select Warning Color ', 'E');
        } else if (
            this.DATA.d1 == undefined ||
            this.DATA.d1 == null ||
            this.DATA.d1 == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Select Danger Color ', 'E');
        } else if (
            this.DATA.BUTTONSTYLE == undefined ||
            this.DATA.BUTTONSTYLE == null ||
            this.DATA.BUTTONSTYLE == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Select Button Style ', 'E');
        } else if (
            this.DATA.MANUSTYLE == undefined ||
            this.DATA.MANUSTYLE == null ||
            this.DATA.MANUSTYLE == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Select Manu Style ', 'E');
        } else if (
            this.DATA.LAYOUTSTYLE == undefined ||
            this.DATA.LAYOUTSTYLE == null ||
            this.DATA.LAYOUTSTYLE == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Select Layout Style ', 'E');
        }
        if (isOk) {
            if (this.DATA.ID != undefined && this.DATA.ID > 0) {
                // // Create the product
                console.log(this.DATA.ID, 'this.DATA.ID');

                this._apiService
                    .updateTheme(this.DATA.ID, this.DATA)
                    .subscribe((data) => {
                        console.log(data);
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
                this._apiService.createtheme(this.DATA).subscribe((data) => {
                    this.openSnackBar('Information saved successfully', 'S');
                    this.drawerClose();
                    console.log(this.DATA);
                    // this.DATA.ID = this.DATA.ID + 1
                    // Go to new product
                    this.DATA = new Theme();

                    // Mark for check
                    this.openSnackBar('Information saved successfully', 'S');
                    this.drawerClose();
                    this._changeDetectorRef.markForCheck();
                });
                // } // // this.openSnackBar('Failed to saved information', 'E');
            }
        }
    }

 
    /**
     * Close drawer
     *
     * @param closeDrawer
     */
    closeDrawer(form:NgForm): void {

        form.form.untouched;
        form.resetForm();

        // this.DATA = new Theme();
        this.drawerClose();

        this._changeDetectorRef.markForCheck();
    }

   
}
