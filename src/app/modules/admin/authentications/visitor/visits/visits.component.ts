import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    Observable,
    Subject,
    debounceTime,
    map,
    merge,
    switchMap,
    takeUntil,
} from 'rxjs';
import { AuthenticationService } from '../../authentications.service';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher/media-watcher.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import {
    AuthenticationPagination,
    Visitors,
    Visits,
} from '../../authentications.types';
import { UntypedFormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'visits',
    templateUrl: './visits.component.html',
    styleUrls: ['./visits.component.scss'],
})
export class VisitsComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    @Input() selectedVisitor: Visitors | null = new Visitors();
    isLoading = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    isScreenSmall: boolean;
    @Input() DATA: Visits[] = [];
    @Input() drawerClose: Function;
    @Input() pagination: AuthenticationPagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    @Input() visitsDataSource: MatTableDataSource<any> =
        new MatTableDataSource();
    visitorsTableColumns: string[] = [
        'checkbox',
        'ACTION',
        'NAME',
        'DATE_OF_VISIT',
        'DURATIO_OF_VISIT',
        'PURPOSE_OF_VISIT',
        'MEETING_WITH_NAME',
    ];
    @Input() visits$: Observable<Visits[]>;
    checkedAll = false;
    indeterminate = false;
    selection = new SelectionModel<Visits>(true, []);
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
    rowsSelected = 0;
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
        private _apiService: AuthenticationService,
        private _snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.isLoading = true;
                    return this._apiService.getVisits(
                        0,
                        10,
                        'name',
                        'asc',
                        query,
                        this.selectedVisitor.ID
                    );
                }),
                map((data) => {
                    this.isLoading = false;
                    this.visitsDataSource.data = data.visits;
                    this.pagination = data.pagination;
                })
            )
            .subscribe();

        // Get the visitors
        this.visits$ = this._apiService.visits$;
        this.visits$.subscribe((data) => {
            this.visitsDataSource.data = data;
        });

        // Get the pagination
        this._apiService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: AuthenticationPagination) => {
                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }
    /**
     * After view init
     */
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
                        return this._apiService.getVisits(
                            this._paginator.pageIndex,
                            this._paginator.pageSize,
                            this._sort.active,
                            this._sort.direction,
                            undefined,
                            this.selectedVisitor.ID
                        );
                    }),
                    map((data) => {
                        this.isLoading = false;
                        this.visitsDataSource.data = data.visits;
                        this.pagination = data.pagination;
                    })
                )
                .subscribe();
        }
    }
    sortUsers(sort: Sort): void {
        console.log(sort);
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.visitsDataSource.data.length;
        return numSelected === numRows;
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
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    toggleAllRows() {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }

        this.selection.select(...this.visitsDataSource.data);
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: Visits): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
            row.ID + 1
        }`;
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
            this.visitsDataSource.data.length ===
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
            .getVisits(0, 10, 'NAME', 'asc', value,undefined)
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
            .getVisits(0, 10, 'NAME', 'asc', value,undefined)
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
            .getVisits(0, 10, 'NAME', 'asc', value,undefined)
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
            .getVisits(0, 10, 'NAME', 'asc', value,undefined)
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
            .getVisits(0, 10, 'NAME', 'asc', value,undefined)
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
