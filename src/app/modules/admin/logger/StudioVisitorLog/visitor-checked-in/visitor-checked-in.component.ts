import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';

import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { CheckedIN } from '../../loginativity.type';
import { LoginService } from '../../loginactivity.service';

@Component({
    selector: 'app-visitor-checked-in',
    templateUrl: './visitor-checked-in.component.html',
    styleUrls: ['./visitor-checked-in.component.scss'],
})
export class VisitorCheckedInComponent {
    @Input() DATA: CheckedIN = new CheckedIN();
    @Input() drawerClose: Function;
    @Input() countries: any;
    @Input() vendors: any;
    emailpattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    /**
     * Constructor
     */
    constructor(
        private _fuseConfirmationService: FuseConfirmationService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _snackBar: MatSnackBar,
        private _inventoryService: LoginService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private router: Router ,
        private datePipe: DatePipe
    ) {}
    CheckIn() {
        this.router.navigate(['/masters/logger/studio']);
    }

    isScreenSmall: boolean;

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

        console.log(this.vendors);
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

    onMenuItemClick(event: MouseEvent) {
        // add your custom code to handle the menu item click here
        event.stopPropagation();
    }
    /**
     * Update the contact
     */
    Save(supportNgForm:NgForm): void {
        // this.drawerClose();
        // this._changeDetectorRef.markForCheck();
     
        this.DATA.DATE_OF_VISIT = this.datePipe.transform(
            this.DATA.DATE_OF_VISIT,
            'dd/MM/yyyy'
        );

        console.log('this.DATA.DATE_OF_VISIT', this.DATA.DATE_OF_VISIT);

     
        var isOk = true;
        if (isOk) {
           
            // // Create the product
            this._inventoryService
                .createcheckin(this.DATA)
                .subscribe((data) => {
                    console.log(data);
                    console.log(this.DATA.ID);

                    // Go to new product
                    this.DATA = new CheckedIN();
                    supportNgForm.form.markAsUntouched();
                    supportNgForm.form.reset();
                    console.log(data);

                    // Mark for check
                    this.openSnackBar('Information saved successfully', 'S');
                    this.drawerClose();
                    this._changeDetectorRef.markForCheck();
                });
        }
    }

    /**
     * Close drawer
     *
     * @param closeDrawer
     */
    closeDrawer(supportNgForm:NgForm): void {
        this.DATA = new CheckedIN();
          this.drawerClose();
          supportNgForm.form.markAsUntouched();
          supportNgForm.form.reset();
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
