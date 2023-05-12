// import { ChangeDetectorRef, Component, Input, ViewEncapsulation } from '@angular/core';
import { smssetting } from '../../setting.type';
import { SettingService } from '../../setting.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, takeUntil } from 'rxjs';
import { FormControl, NgForm, Validators } from '@angular/forms';

import {
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';

@Component({
    selector: 'app-add-smssetting',
    templateUrl: './add-smssetting.component.html',
    styleUrls: ['./add-smssetting.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AddSMSSettingComponent implements OnInit, OnDestroy {
    @Input() DATA: smssetting = new smssetting();
    @Input() drawerClose: Function;
    isScreenSmall: boolean ;
    dataList = []


     /**
     * Constructor
     */
    constructor(
        private _inventoryService: SettingService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _snackBar: MatSnackBar,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    ) {}

    private _unsubscribeAll: Subject<any> = new Subject<any>();
 
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

            // used for  dropdown values
            this._inventoryService
            .getSMS(undefined, undefined, undefined, 'asc', undefined)
            .subscribe((data) => {
                // Update the brands
                this.dataList = data.sms;
                console.log(this.dataList,'this.dataListthis.dataListthis.dataList')

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
     * Update the sms
     */

    Save(myForm:NgForm): void {
        var isOk = true;

        if (this.DATA.NAME == null || this.DATA.NAME.toString().trim() == '') {
            isOk = false;
            this.openSnackBar('Please enter Name', 'E');
        } else if (
            this.DATA.BaseUrl == null ||
            this.DATA.BaseUrl.toString().trim() == ''
        ) {
            isOk = false;
            this.openSnackBar('Please enter Base URL', 'E');
        } else if (
            this.DATA.Method == null ||
            this.DATA.Method.toString().trim() == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Select Method', 'E');
        }
        // isOk = true

        if (isOk) {
            if (this.DATA.ID != undefined && this.DATA.ID > 0) {
                // // Create the product
                this._inventoryService
                    .updatesms(this.DATA.ID, this.DATA)
                    .subscribe((data) => {
                        myForm.form.markAsUntouched();
                        myForm.form.reset();
                        // Mark for check
                        this.openSnackBar(
                            'Information updated successfully',
                            'S'
                        );
                        this.drawerClose();
                        this._changeDetectorRef.markForCheck();
                    });
            }
             else {
                // // Create the product
                this._inventoryService
                    .createsms(this.DATA)
                    .subscribe((data) => {
                        console.log(data)
                        console.log(this.DATA.ID)

                        // Go to new product
                        this.DATA = new smssetting();
                        myForm.form.markAsUntouched();
                    myForm.form.reset();
                        // Mark for check
                        this.openSnackBar(
                            'Information saved successfully',
                            'S'
                        );
                        this.drawerClose();
                        this._changeDetectorRef.markForCheck();
                    });

                }
                    
        }

        // this.openSnackBar('Failed to saved information', 'E');
    }

      /**
     * Close drawer
     *
     * @param closeDrawer
     */
      closeDrawer(myForm:NgForm): void {
        this.drawerClose();
        myForm.form.markAsUntouched();
        myForm.form.reset();
        this._changeDetectorRef.markForCheck();
    }
  
}
