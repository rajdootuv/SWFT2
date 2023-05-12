import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    TemplateRef,
    ViewChild,
    ViewEncapsulation,
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
import { AuthenticationService } from '../authentications.service';
import {
    AuthenticationPagination,
    Selectoptions,
} from '../authentications.types';
import { MatSort } from '@angular/material/sort';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher/media-watcher.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ContactsService } from '../../contacts/contacts.service';

@Component({
    selector: 'app-select-options',
    templateUrl: './select-options.component.html',
    styleUrls: ['./select-options.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class SelectOptionsComponent {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    is_addfielsShow = false;
    selectoptions$: Observable<Selectoptions[]>;
    recentTransactionsDataSource: MatTableDataSource<any> =
        new MatTableDataSource();
    customerTableColumns: string[] = [
        'checkbox',
        'ACTION',
        'FIELD_ID',
        'VALUE',
        'HTML',
    ];
    visitorsTableColumns2 = [
        { NAME: 'FIELD_ID', INDEX: 'FIELD_ID', SHOW: true },
        { NAME: 'VALUE', INDEX: 'VALUE', SHOW: true },
        { NAME: 'HTML', INDEX: 'HTML', SHOW: true },
    ];

    isLoading: boolean = false;
    pagination: AuthenticationPagination;
    pagination2: AuthenticationPagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    isScreenSmall: boolean;
    isLargeScreen: boolean;

    step = 0;
    oldvisitors: Selectoptions[] = [];
    checkedAll = false;
    selection = new SelectionModel<Selectoptions>(true, []);

    is_ChooseOptions = false;
    Type_of_User = ['Name', 'Email', 'Number'];
    numSelected = 0;

    rowsSelected = 0;
    showMultiSelect = false;
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _inventoryService: AuthenticationService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _contactsService: ContactsService,
        private _snackBar: MatSnackBar,
        private dialog: MatDialog
    ) {}

    // select check box

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.recentTransactionsDataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    toggleAllRows() {
        if (this.isAllSelected()) {
            this.selection.clear();
            this.showMultiSelect = false;
            this.rowsSelected = 0;
            return;
        }
        console.log(this.selection.selected.length);

        this.selection.select(...this.recentTransactionsDataSource.data);
        if (this.selection.selected.length > 0) {
            this.showMultiSelect = true;
            this.rowsSelected = this.selection.selected.length;
        }
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: Selectoptions): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
            row.ID + 1
        }`;
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
     * On init
     */
    ngOnInit(): void {
        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
                this.isLargeScreen = matchingAliases.includes('sm');
            });

        // Get the pagination
        this._inventoryService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: AuthenticationPagination) => {
                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the select options

        this.selectoptions$ = this._inventoryService.selectoptions$;
        this.selectoptions$.subscribe((data) => {
            this.recentTransactionsDataSource.data = data;
            console.log(this.recentTransactionsDataSource, 'selectoptions');
        });

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.isLoading = true;
                    return this._inventoryService.getSelectoptions(
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

        // Get the select option value
        this._inventoryService
            .getSelectoptions(undefined, undefined, 'NAME', 'asc', undefined)
            .subscribe((data) => {
                console.log(data, 'get users adaata');

                // Update the brands
                this.oldvisitors = data.selectoptions;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {
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
                        return this._inventoryService.getSelectoptions(
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

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.ID || index;
    }

    //   edit select options
    edit(data: Selectoptions) {
        this.is_addfielsShow = true;
        this.DATA = data;
        console.log(this.DATA);

        // this.selectedVisitor.DATE_OF_VISIT = new Date(data.DATE_OF_VISIT);
    }

    //   delete options details
    deleteData: any;
    detailsDelete(data: Selectoptions) {
        console.log(data);
        this.deleteData = data;
        // this.selectedVisitor.DATE_OF_VISIT = new Date(data.DATE_OF_VISIT);
    }

    setStep(index: number) {
        this.step = index;
    }

    nextStep() {
        this.step++;
    }

    prevStep() {
        this.step--;
    }

    //   checkbox update

    updateAllComplete(event, i) {
        console.log(event, 'menus');

        this.visitorsTableColumns2[i].SHOW = event;
        this.customerTableColumns = ['checkbox', 'ACTION', 'NAME'];

        this.visitorsTableColumns2.forEach((item) => {
            if (item.SHOW == true) {
                this.customerTableColumns.push(item.INDEX);
            }
        });
    }

    DATA: Selectoptions = new Selectoptions();

    Save(): void {
        var isOk = true;
        if (
            this.DATA.FIELD_ID == undefined ||
            this.DATA.FIELD_ID == null ||
            this.DATA.FIELD_ID == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Enter Field Name', 'E');
        } else if (
            this.DATA.VALUE == undefined ||
            this.DATA.VALUE == null ||
            this.DATA.VALUE == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Enter Value ', 'E');
        }

        if (isOk) {
            if (this.DATA.ID != undefined && this.DATA.ID > 0) {
                console.log('updated');

                // Update the product
                this._inventoryService
                    .updateSelectoption(this.DATA.ID, this.DATA)
                    .subscribe((data) => {
                        // Mark for check
                        this.openSnackBar(
                            'Information updated successfully',
                            'S'
                        );
                        this.is_addfielsShow = false;
                        this._changeDetectorRef.markForCheck();
                    });
            } else {
                // // Create the product
                console.log(this.DATA);

                this._inventoryService
                    .createSelectoption(this.DATA)
                    .subscribe((data) => {
                        // Go to new product
                        this.DATA = new Selectoptions();

                        // Mark for check
                        this.openSnackBar(
                            'Information saved successfully',
                            'S'
                        );
                        this.is_addfielsShow = false;
                        this._changeDetectorRef.markForCheck();
                    });
            }

            // this.openSnackBar('Failed to saved information', 'E');
        }
    }

    // for material dialog

    @ViewChild('dialogTemplate') dialogTemplate: TemplateRef<any>;
    selectedOption: any;

    // constructor(public dialog: MatDialog) { }

    openDialog(): void {
        const dialogRef = this.dialog.open(this.dialogTemplate, {
            width: '400px',
            data: { selectedOption: this.selectedOption },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            console.log(result);
        });
    }

    closeDialog(): void {
        this.dialog.closeAll();
    }

    deleteItem(): void {
        console.log(this.deleteData);
        console.log(this.deleteData.ID);

        // Perform delete action

        this._inventoryService
            .deleteSelectoption(this.deleteData.ID)
            .subscribe((data) => {
                console.log(data);
                this.openSnackBar('Delete SuccessFully', 'E');
                console.log('Delete item');
                this.closeDialog();
            });
    }

    
    /**
     * view multiple selected rows details box
     */
    showMultiBox() {
        this.rowsSelected = this.selection.selected.length;
        if (this.rowsSelected > 0) this.showMultiSelect = true;
        else this.showMultiSelect = false;
    }

    /**
     * deselect all selected rows
     */
    removeSelection() {
        if (
            this.recentTransactionsDataSource.data.length === this.selection.selected.length
        ) {
            this.toggleAllRows();
        } else {
            this.showMultiSelect = false;
            this.rowsSelected = 0;
            this.selection.clear();
        }

        //this.selection.selected
    }

    /**
     * delete all selected rows
     */
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
