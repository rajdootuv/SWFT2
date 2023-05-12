import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { SettingService } from '../../setting.service';
import { Subject, takeUntil } from 'rxjs';
import { NgForm } from '@angular/forms';
import { whatsappsetting } from '../../setting.type';

@Component({
    selector: 'whataspp',
    templateUrl: './add-whatsapp-setting.component.html',
    styleUrls: ['./add-whatsapp-setting.component.scss'],
})
export class AddWhatsappSettingComponent {
    @Input() DATA: whatsappsetting = new whatsappsetting();
    @Input() drawerClose: Function;
    isScreenSmall: boolean;

    constructor(
        private _inventoryService: SettingService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _snackBar: MatSnackBar,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    ) {}

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    // vendors: AuthenticationType[] = [];
    dataList = [];

    ngOnInit(): void {
        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });
        this._inventoryService
            .getWhatsapp(undefined, undefined, undefined, 'asc', undefined)
            .subscribe((data) => {
                // Update the brands
                this.dataList = data.whatsapp;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    /**
     * Close drawer
     *
     * @param closeDrawer
     */
    closeDrawer(wpform: NgForm): void {
        wpform.form.markAsUntouched();
        wpform.form.reset();
        this.drawerClose();
        this._changeDetectorRef.markForCheck();
    }
    openSnackBar(msg: string, type) {
        this._snackBar.open(msg, '', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: type == 'E' ? 'style-error' : 'style-success',
        });
    }

    Save(wpform: NgForm): void {
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
                    .updatewhatsapp(this.DATA.ID, this.DATA)
                    .subscribe((data) => {
                        wpform.form.markAsUntouched();
                    wpform.form.reset();
                        console.log(data)
                        // Mark for check
                        this.openSnackBar(
                            'Information updated successfully',
                            'S'
                        );
                        this.drawerClose();
                        this._changeDetectorRef.markForCheck();
                    });
            }
            //  else {
            // // Create the product
            this._inventoryService
                .createWhatsapp(this.DATA)
                .subscribe((data) => {
                    console.log(data)
                    // Go to new product
                    this.DATA = new whatsappsetting();
                    wpform.form.markAsUntouched();
                    wpform.form.reset();

                    // Mark for check
                    this.openSnackBar('Information saved successfully', 'S');
                    this.drawerClose();
                    this._changeDetectorRef.markForCheck();
                });
        }

        // this.openSnackBar('Failed to saved information', 'E');
    }
}
