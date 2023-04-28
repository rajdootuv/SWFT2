import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
    TemplateRef,
    Input,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import {
    debounceTime,
    map,
    merge,
    Observable,
    Subject,
    switchMap,
    takeUntil,
} from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
// import { AuthenticationService } from '../../authentications/authentications.service';

import { MatSort } from '@angular/material/sort';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher/media-watcher.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoginService } from '../loginactivity.service';
import { loginActivityPagination, loginactivitydata } from '../loginativity.type';
import { cloneDeep } from 'lodash-es';
@Component({
    selector: 'app-loginactivitylist',
    templateUrl: './loginactivitylist.component.html',
    styleUrls: ['./loginactivitylist.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class LoginactivitylistComponent implements OnInit, AfterViewInit, OnDestroy {


    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _inventoryService: LoginService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        // private _contactsService: ContactsService,
        private _snackBar: MatSnackBar,
        public dialog: MatDialog
    ) { }



    isLoading: boolean = false;
    isScreenSmall: boolean;
    oldlogindatadata: loginactivitydata[] = [];
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    recentTransactionsDataSource: MatTableDataSource<any> =
        new MatTableDataSource();
    pagination: loginActivityPagination;
    loginactivitydata$: Observable<loginactivitydata[]>;
    selection = new SelectionModel<loginactivitydata>(true, []);
    trackByFn(index: number, item: any): any {
        return item.ID || index;
    }
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    showMultiSelect = false;
    rowsSelected = 0;


    LoginActivityTableColumns: string[] = ['checkbox',   'NAME', 'DATE', 'IPADDRESS', 'LOCATION', 'DEVICEID'];
    LoginActivityTableColumns2 = [
        { NAME: 'Name', INDEX: 'NAME', SHOW: true },
        { NAME: 'Date', INDEX: 'DATE', SHOW: true },
        { NAME: 'IP address', INDEX: 'IPADDRESS', SHOW: true },
        { NAME: 'Location', INDEX: 'LOCATION', SHOW: true },
        { NAME: 'Device Used', INDEX: 'DEVICEID', SHOW: true }
    ];


    showMultiBox() {
        this.rowsSelected = this.selection.selected.length;
        if (this.rowsSelected > 0) this.showMultiSelect = true;
        else this.showMultiSelect = false;
    }

    openNoteDialog(templateRef: TemplateRef<any>): void {
        this.dialog.open(templateRef);
        this.showImages
        console.log(this.showImages,"myimagehsbdbdd")
    }
    showImages: any
    data(event: any) {
        this.showImages = event
       
    }


    ngOnInit(): void {

        // Subscribe to media changes

        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });


        // Get the pagination
        this._inventoryService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: loginActivityPagination) => {
                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });


        // Get the visitors
        this.loginactivitydata$ = this._inventoryService.organization$;
        this.loginactivitydata$.subscribe((data) => {
            console.log(data);
            this.recentTransactionsDataSource.data = data;
            console.log(this.recentTransactionsDataSource.data, "this.recentTransactionsDataSource.data")
        });


        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.isLoading = true;
                    return this._inventoryService.getOrganization(
                        0,
                        10,
                        'NAME',
                        'asc',
                        query
                    );
                }),
                map(() => {
                    this.isLoading = false;
                })
            )
            .subscribe();



        this._inventoryService
            .getOrganization(undefined, undefined, 'NAME', 'asc', undefined)
            .subscribe((data) => {
                // Update the brands
                this.oldlogindatadata = data.organization;
                console.log(this.oldlogindatadata, 'this.oldorganizationdata')
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });











    }



    ngAfterViewInit(): void {

        console.log(this._sort);

        if (this._sort && this._paginator) {
            // Set the initial sort
            this._sort.sort({
                id: 'NAME',
                start: 'asc',
                disableClear: true,
            });

            // Mark for check
            this._changeDetectorRef.markForCheck();

            // If the user changes the sort order...
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    // Reset back to the first page
                    this._paginator.pageIndex = 0;
                });

            // Get visitors if sort or page changes
            merge(this._sort.sortChange, this._paginator.page)
                .pipe(
                    switchMap(() => {
                        this.isLoading = true;
                        return this._inventoryService.getOrganization(
                            this._paginator.pageIndex,
                            this._paginator.pageSize,
                            this._sort.active,
                            this._sort.direction
                        );
                    }),
                    map(() => {
                        this.isLoading = false;
                    })
                )
                .subscribe();
        }
    }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }



    updateAllComplete(event, i) {
        this.LoginActivityTableColumns2[i].SHOW = event;
        this.LoginActivityTableColumns = ['checkbox',  ];

        this.LoginActivityTableColumns2.forEach((item) => {
            if (item.SHOW == true) {
                this.LoginActivityTableColumns.push(item.INDEX);
            }
        });
    }
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.recentTransactionsDataSource.data.length;
        return numSelected === numRows;
    }

    checkboxLabel(row?: loginactivitydata): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.ID + 1
            }`;
    }

    toggleAllRows() {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }

        this.selection.select(...this.recentTransactionsDataSource.data);
        this.selection.select(...this.recentTransactionsDataSource.data);
        if (this.selection.selected.length > 0) {
            this.showMultiSelect = true;
            this.rowsSelected = this.selection.selected.length;
        }

    }


    openSnackBar(msg: string, type) {
        this._snackBar.open(msg, '', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: type == 'E' ? 'style-error' : 'style-success',
        });
    }
    removeSelection() {
        if (this.recentTransactionsDataSource.data.length === this.selection.selected.length) {
            this.toggleAllRows();

        } else {
            this.showMultiSelect = false;
            this.rowsSelected = 0;
            this.selection.clear();
        }

        //this.selection.selected
    }

    deleteSelection() {
        this.openSnackBar('Selected rows deleted successfully', 'S');
        this.removeSelection();
        //this.selection.selected

    }

    editSelection() {
        this.openSnackBar('Selected rows edited successfully', 'S');
        this.removeSelection();
        //this.selection.selected


    }

}
