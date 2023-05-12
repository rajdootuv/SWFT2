import { ChangeDetectorRef, Component, Input } from '@angular/core';
import {  smtpsetting } from '../../setting.type';
import { SettingService } from '../../setting.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-add-smtp',
    templateUrl: './add-smtp.component.html',
    styleUrls: ['./add-smtp.component.scss'],
})
export class AddSMTPComponent {
    @Input() DATA: smtpsetting = new smtpsetting();
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

    oldvisitors = [];
    dataList = [];

    ngOnInit(): void {
        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });

        // Authentication  Type Dropdown
        this._inventoryService
            .getSMTP(undefined, undefined, undefined, 'asc', undefined)
            .subscribe((data) => {
                // Update the brands
                this.dataList = data.smtp;

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
    closeDrawer(): void {
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

    Save(): void {
        var isOk = true;
       
        if (isOk) {
            if (this.DATA.ID != undefined && this.DATA.ID > 0) {
                // // Create the product
                this._inventoryService
                    .updateSMTP(this.DATA.ID, this.DATA)
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
             else {
                // // Create the product
                this._inventoryService
                    .createSMTP(this.DATA)
                    .subscribe((data) => {
                        console.log(data)
                        // Go to new product
                        this.DATA = new smtpsetting();

                        // Mark for check
                        this.openSnackBar(
                            'Information saved successfully',
                            'S'
                        );
                        this.drawerClose();
                        this._changeDetectorRef.markForCheck();
                    });
        }

        // this.openSnackBar('Failed to saved information', 'E');
    }
    }
}
