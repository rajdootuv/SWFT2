import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';

import { UntypedFormControl } from '@angular/forms';
import {
    Observable,
    Subject,
    debounceTime,
    merge,
    map,
    switchMap,
    takeUntil,
} from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { SetupService } from '../../setup.service';
import { Studio, SetupPagination } from '../../setup.types';
import { fuseAnimations } from '@fuse/animations';
@Component({
    selector: 'app-liststudio',
    templateUrl: './liststudio.component.html',
    styleUrls: ['./liststudio.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class ListstudioComponent {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    studio$: Observable<Studio[]>;
    dataSource: MatTableDataSource<any> = new MatTableDataSource();
    selectedVisitor: Studio | null = new Studio();
    selection = new SelectionModel<Studio>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    pagination: SetupPagination;
    isLoading: boolean = false;
    deleteShow = false;
    oldvisitors: Studio[] = [];
    addcustomers: Studio | null = new Studio();
    editstudio: Studio = new Studio();
    answer: number = null;
    value = Math.floor(10 * Math.random());
    value2 = Math.floor(10 * Math.random());
    showMultiSelect = false;
    rowsSelected = 0;
    isScreenSmall = true;
    studio: any[] = [];
    COUNTRY = 0;
    country=[]
    states=[]
    STATE = []
    studioTableColumns2 = [
        { NAME: 'Name', INDEX: 'NAME', SHOW: true },
        { NAME: 'Website', INDEX: 'WEBSITE', SHOW: true },
        { NAME: 'City', INDEX: 'CITY', SHOW: true },
        { NAME: 'State', INDEX: 'STATE', SHOW: true },
        { NAME: 'Country', INDEX: 'COUNTRY', SHOW: true },
    ];

    studioTableColumns: string[] = [
        'checkbox',
        'ACTION',
        'NAME',
        'WEBSITE',
        'CITY',
        'STATE',
        'COUNTRY',
    ];

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _liveAnnouncer: LiveAnnouncer,
        private _changeDetectorRef: ChangeDetectorRef,
        private _inventoryService: SetupService,
        private _snackBar: MatSnackBar,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    ) {}

    ngOnInit(): void {
        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });
        // Get the visitors
        this.studio$ = this._inventoryService.studio$;
        this.studio$.subscribe((data) => {
            console.log(data);
            this.dataSource.data = data;
        });

        // Get the visitors
        this._inventoryService
            .getstudio(undefined, undefined, 'NAME', 'asc', undefined)
            .subscribe((data) => {
                // Update the brands
                this.oldvisitors = data.studio;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the pagination
        this._inventoryService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: SetupPagination) => {
                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.isLoading = true;
                    return this._inventoryService.getstudio(
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
                        return this._inventoryService.getstudio(
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

    // Get visitors if sort or page changes
    add() {
        this.addcustomers = new Studio();
        this.editstudio = new Studio();
    }

    // Get visitors if sort or page changes
    edit(data: Studio) {
        this.editstudio = data;
        console.log(this.editstudio, 'wertyu');
    }

    drawerClose(): void {
        this._changeDetectorRef.markForCheck();
        var d = document.getElementById('closeDrawer') as HTMLElement;
        d.click();
        console.log('hee');
    }

    get closeCallback() {
        return this.drawerClose.bind(this);
    }

    // Delete and Detail
    details(data: Studio) {
        this.selectedVisitor = data;
        this.deleteShow = false;
    }

    detailsDelete(data: Studio) {
        this.selectedVisitor = data;
        this.deleteShow = true;
        this.answer = null;
        this.value = Math.floor(10 * Math.random());
        this.value2 = Math.floor(10 * Math.random());
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

    // /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    // /** Selects all rows if they are not all selected; otherwise clear selection. */
    toggleAllRows() {
        if (this.isAllSelected()) {
            this.selection.clear();
            this.showMultiSelect = false;
            this.rowsSelected = 0;
            return;
        }
        console.log(this.selection.selected.length);

        this.selection.select(...this.dataSource.data);
        if (this.selection.selected.length > 0) {
            this.showMultiSelect = true;
            this.rowsSelected = this.selection.selected.length;
        }
    }

    showMultiBox() {
        this.rowsSelected = this.selection.selected.length;
        if (this.rowsSelected > 0) this.showMultiSelect = true;
        else this.showMultiSelect = false;
    }

    removeSelection() {
        if (this.dataSource.data.length === this.selection.selected.length) {
            this.toggleAllRows();
        } else {
            this.showMultiSelect = false;
            this.rowsSelected = 0;
            this.selection.clear();
        }
        this.selection.selected;
    }

    deleteSelection() {
        this.openSnackBar('Selected rows deleted successfully', 'S');
        this.removeSelection();
        this.selection.selected;
    }

    editSelection() {
        this.openSnackBar('Selected rows edited successfully', 'S');
        this.removeSelection();
        this.selection.selected;
    }

    // /** The label for the checkbox on the passed row */
    checkboxLabel(row): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
            row.ID + 1
        }`;
    }

    trackByFn(index: number, item: any): any {
        return item.ID || index;
    }

    updateAllComplete(event, i) {
        this.studioTableColumns2[i].SHOW = event;
        this.studioTableColumns = ['checkbox', 'ACTION', 'NAME'];

        this.studioTableColumns2.forEach((item) => {
            if (item.SHOW == true) {
                this.studioTableColumns.push(item.INDEX);
            }
        });
    }

    visitorDrawerClose(): void {
        this._changeDetectorRef.markForCheck();
        var d = document.getElementById('closeDrawer') as HTMLElement;
        d.click();
        console.log('hee');
    }

    // filter variables
    operators: string[] = ['AND', 'OR'];
    Select_columnName: string[] = [
        'NAME',
        'WEBSITE',
        'CITY',
        'STATE',
        'COUNTRY',
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
