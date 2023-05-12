import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
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
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { SetupService } from '../../setup.service';
import { Floors, SetupPagination } from '../../setup.types';
import { MatSort } from '@angular/material/sort';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher/media-watcher.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ContactsService } from 'app/modules/admin/contacts/contacts.service';
import { Country } from 'app/modules/admin/contacts/contacts.types';

@Component({
    selector: 'app-floor-list',
    templateUrl: './floor-list.component.html',
    styleUrls: ['./floor-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class FloorListComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    floors$: Observable<Floors[]>;
    recentTransactionsDataSource: MatTableDataSource<any> =
        new MatTableDataSource();
    floorsDataSource: MatTableDataSource<any> = new MatTableDataSource();
    floorsTableColumns: string[] = [
        'checkbox',
        'ACTION',
        'NAME',
        'LOCATION',
        'LENGTH',
        'WIDTH',
        'HEIGHT',
    ];
    floorsTableColumns2 = [
        { NAME: 'Location', INDEX: 'LOCATION', SHOW: true },
        { NAME: 'Length', INDEX: 'LENGTH', SHOW: true },
        { NAME: 'Width', INDEX: 'WIDTH', SHOW: true },
        { NAME: 'Height', INDEX: 'HEIGHT', SHOW: true },
    ];
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: SetupPagination;
    pagination2: SetupPagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedFloor: Floors | null = new Floors();
    selectedFloorForm: UntypedFormGroup;
    tagsEditMode: boolean = false;
    drawerOpened = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    isScreenSmall: boolean;
    deleteShow = false;
    step = 0;
    oldfloors: Floors[] = [];
    checkedAll = false;
    indeterminate = false;
    selection = new SelectionModel<Floors>(true, []);
    countries: Country[] = [];
    answer: number = null;
    value = Math.floor(10 * Math.random());
    value2 = Math.floor(10 * Math.random());
    selectedCols = false;
    showMultiSelect = false;

    // filter variables
    operators: string[] = ['AND', 'OR'];
    Select_columnName: string[] = [
        'Name',
        'Location',
        'Length',
        'Width',
        'Height',
    ];
    comparisons: string[] = ['=', '!=', '<', '>', '<=', '>='];
    values: string[] = ['John', '25', 'Male', '12-04-2023'];
    selectedOperator: string = 'AND';
    selectedColumn: string = '';
    selectedComparison: string = '';
    selectedValue: string = '';
    queries: string[] = [];
    tagList: string[] = [];
    tagList1: string[] = [];
    filterList: any[] = [];
    filterListOperators: string[] = [];
    showFilterBox = false;
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _apiService: SetupService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _contactsService: ContactsService,
        private _snackBar: MatSnackBar
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

        this._contactsService.getCountries().subscribe((data) => {
            this.countries = [...[], ...data];

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        // Get the pagination
        this._apiService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: SetupPagination) => {
                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the floors
        this.floors$ = this._apiService.floors$;
        this.floors$.subscribe((data) => {
            console.log(data);
            this.recentTransactionsDataSource.data = data;
        });

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.isLoading = true;
                    return this._apiService.getFloors(
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

        // Get the floors
        this._apiService
            .getFloors(undefined, undefined, 'NAME', 'asc', undefined)
            .subscribe((data) => {
                // Update the brands
                this.oldfloors = data.floors;

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

            // Get floors if sort or page changes
            merge(this._sort.sortChange, this._paginator.page)
                .pipe(
                    switchMap(() => {
                        this.isLoading = true;
                        return this._apiService.getFloors(
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
        } else {
            // Get floors if sort or page changes
            merge( this._paginator.page)
                .pipe(
                    switchMap(() => {
                        this.isLoading = true;
                        return this._apiService.getFloors(
                            this._paginator.pageIndex,
                            this._paginator.pageSize,
                            'NAME',
                            'asc'
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    /** Whether the number of selected elements matches the total number of rows. */
    rowsSelected = 0;
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
    checkboxLabel(row?: Floors): string {
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
     * Delete the selected product using the form data
     */
    deleteSelectedFloors(): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete product',
            message:
                'Are you sure you want to remove this product? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                // Get the product object
                const product = this.selectedFloorForm.getRawValue();

                // Delete the product on the server
                this._apiService.deleteFloor(product.ID).subscribe(() => {});
            }
        });
    }

    /**
     * Show flash message
     */
    showFlashMessage(type: 'success' | 'error'): void {
        // Show the message
        this.flashMessage = type;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Hide it after 3 seconds
        setTimeout(() => {
            this.flashMessage = null;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 3000);
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

    /**
     * edit floor data
     */
    edit(data: Floors) {
        this.newfloor = data;
    }

    /**
     * add new floor data
     */
    add() {
        this.newfloor = new Floors();
    }

    /**
     * floor drawer close
     */
    floororDrawerClose(): void {
        this._changeDetectorRef.markForCheck();
        var d = document.getElementById('closeDrawer') as HTMLElement;
        d.click();
    }

    get floororDrawerCloseCallback() {
        return this.floororDrawerClose.bind(this);
    }

    /**
     * floor details open
     */
    details(data: Floors) {
        this.selectedFloor = data;
        this.deleteShow = false;
    }

    /**
     * open delete floor details
     */
    detailsDelete(data: Floors) {
        this.selectedFloor = data;
        this.deleteShow = true;
        this.answer = null;
        this.value = Math.floor(10 * Math.random());
        this.value2 = Math.floor(10 * Math.random());
    }

    /**
     * delete floor details
     */
    deleteInfo() {
        if (this.answer == undefined || this.answer == null) {
            this.openSnackBar('Please solve the puzzle', 'E');
        } else if (this.answer != this.value + this.value2) {
            this.openSnackBar('Wrong answer', 'E');
        } else {
            this.openSnackBar('Information deleted successfully', 'S');
            var d = document.getElementById('closeDrawer2') as HTMLElement;
            d.click();
        }
    }

    /**
     * close delete floor details drawer
     */
    floororDrawer2Close(): void {
        this._changeDetectorRef.markForCheck();
        var d = document.getElementById('closeDrawer2') as HTMLElement;
        d.click();
    }

    get floororDrawer2CloseCallback() {
        return this.floororDrawer2Close.bind(this);
    }

    newfloor: Floors = new Floors();

    /**
     * close add new floor drawer
     */
    newfloorDrawerClose(): void {
        this._changeDetectorRef.markForCheck();

        var d = document.getElementById('closenewfloorDrawer') as HTMLElement;

        d.click();
    }

    get newfloorDrawerCloseCallback() {
        return this.newfloorDrawerClose.bind(this);
    }

    /**
     * close floor drawer
     */
    floorsDrawerClose(): void {
        this._changeDetectorRef.markForCheck();
        var d = document.getElementById('closefloorDrawer') as HTMLElement;
        d.click();
    }

    get floorsDrawerCloseCallback() {
        return this.floorsDrawerClose.bind(this);
    }

    /**
     * update multiple selected rows
     */
    updateAllComplete(event, i) {
        this.floorsTableColumns2[i].SHOW = event;
        this.floorsTableColumns = ['checkbox', 'ACTION', 'NAME'];

        this.floorsTableColumns2.forEach((item) => {
            if (item.SHOW == true) {
                this.floorsTableColumns.push(item.INDEX);
            }
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
            this.recentTransactionsDataSource.data.length ===
            this.selection.selected.length
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

    /**
     * Column1 search function
     */
    colum1Search(value: any) {
        this.isLoading = true;

        this._apiService
            .getFloors(0, 10, 'NAME', 'asc', value)
            .subscribe((data) => {
                this.isLoading = false;

                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * Column2 search function
     */
    colum2Search(value: any) {
        this.isLoading = true;

        this._apiService
            .getFloors(0, 10, 'NAME', 'asc', value)
            .subscribe((data) => {
                this.isLoading = false;

                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * Column3 search function
     */
    colum3Search(value: any) {
        this.isLoading = true;

        this._apiService
            .getFloors(0, 10, 'NAME', 'asc', value)
            .subscribe((data) => {
                this.isLoading = false;

                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * Column4 search function
     */
    colum4Search(value: any) {
        this.isLoading = true;

        this._apiService
            .getFloors(0, 10, 'NAME', 'asc', value)
            .subscribe((data) => {
                this.isLoading = false;

                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * Column5 search function
     */
    colum5Search(value: any) {
        this.isLoading = true;

        this._apiService
            .getFloors(0, 10, 'NAME', 'asc', value)
            .subscribe((data) => {
                this.isLoading = false;

                this._changeDetectorRef.markForCheck();
            });
    }

    /*******  query generation for filter***********/
    generateQuery() {
        var isOk = true;
        if (this.selectedColumn == undefined || this.selectedColumn == '') {
            isOk = false;
            this.openSnackBar('Please select column', 'E');
        } else if (
            this.selectedComparison == undefined ||
            this.selectedComparison == ''
        ) {
            isOk = false;
            this.openSnackBar('Please select camparison', 'E');
        } else if (
            this.selectedValue == undefined ||
            this.selectedValue == ''
        ) {
            isOk = false;
            this.openSnackBar('Please enter value', 'E');
        } else if (
            this.selectedOperator == undefined ||
            this.selectedOperator == ''
        ) {
            isOk = false;
            this.openSnackBar('Please select operator', 'E');
        }

        if (isOk) {
            let tag = `${this.selectedColumn} ${this.selectedComparison} '${this.selectedValue}'`;

            this.filterList.push({
                tagList: [tag],
                tagList1: [this.selectedOperator],
            });
            this.filterListOperators.push(this.selectedOperator);
            this.clearSelection();
        }
    }

    /*******  Delete sub filter***********/
    removeTagGroup(j: number, i: number) {
        this.filterList[j].tagList.splice(i, 1);
        this.filterList[j].tagList1.splice(i, 1);
        if (this.filterList[j].tagList1.length == 0) {
            this.filterListOperators.splice(j, 1);
            this.filterList.splice(j, 1);
        }
    }

    /*******  Clear form***********/
    clearSelection() {
        this.selectedColumn = '';
        this.selectedComparison = '';
        this.selectedValue = '';
        this.selectedOperator = 'AND';
    }

    /*******  insert sub query***********/
    insertSubCondition() {
        var isOk = true;
        if (this.selectedColumn == undefined || this.selectedColumn == '') {
            isOk = false;
            this.openSnackBar('Please select column', 'E');
        } else if (
            this.selectedComparison == undefined ||
            this.selectedComparison == ''
        ) {
            isOk = false;
            this.openSnackBar('Please select camparison', 'E');
        } else if (
            this.selectedValue == undefined ||
            this.selectedValue == ''
        ) {
            isOk = false;
            this.openSnackBar('Please enter value', 'E');
        } else if (
            this.selectedOperator == undefined ||
            this.selectedOperator == ''
        ) {
            isOk = false;
            this.openSnackBar('Please select operator', 'E');
        }

        if (isOk) {
            let tag = `${this.selectedColumn} ${this.selectedComparison} '${this.selectedValue}'`;
            if (this.filterList.length == 0) {
                this.filterList.push({
                    tagList: [tag],
                    tagList1: [this.selectedOperator],
                });
            } else if (
                this.filterList[this.filterList.length - 1].tagList ==
                    undefined ||
                this.filterList[this.filterList.length - 1].length == 0
            ) {
                this.filterList[this.filterList.length - 1] = {
                    tagList: [tag],
                    tagList1: [this.selectedOperator],
                };
            } else {
                this.filterList[this.filterList.length - 1].tagList.push(tag);
                this.filterList[this.filterList.length - 1].tagList1.push(
                    this.selectedOperator
                );
            }

            this.clearSelection();
        }
    }

    /*******  Reset filter ***********/
    resetFilter() {
        this.filterList = [];
        this.filterListOperators = [];
        this.showFilterBox = !this.showFilterBox;
    }

    /*******  Toggle Filter Box ***********/
    toggleFilterBox() {
        this.showFilterBox = !this.showFilterBox;
    }

    /*******  Create filter query***********/
    createFilterQuery() {
        var query = '';
        if (this.filterList.length == 0) {
            this.openSnackBar('Please add conditions', 'E');
        } else
            for (var i = 0; i < this.filterList.length; i++) {
                if (this.filterListOperators[i] != undefined)
                    query += this.filterListOperators[i] + '(';
                else query += '(';
                for (var j = 0; j < this.filterList[i]['tagList'].length; j++) {
                    query +=
                        this.filterList[i]['tagList'][j] +
                        '' +
                        this.filterList[i]['tagList1'][j];
                    if (j + 1 == this.filterList[i]['tagList'].length) {
                        query += ')';

                        if (i + 1 == this.filterList.length) {
                            //call search function
                            this.openSnackBar(
                                'Filter Generated Successfully',
                                'S'
                            );
                            this.showFilterBox = !this.showFilterBox;
                        }
                    }
                }
            }
    }
}
