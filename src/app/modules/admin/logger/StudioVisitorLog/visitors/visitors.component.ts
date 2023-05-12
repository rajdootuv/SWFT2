import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';

import {
    Observable,
    Subject,
    debounceTime,
    map,
    merge,
    switchMap,
    takeUntil,
} from 'rxjs';
import { UntypedFormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../../loginactivity.service';
import { StudioLogs, VisitorLogs, SetupPagination } from '../../loginativity.type';

@Component({
    selector: 'app-visitors',
    templateUrl: './visitors.component.html',
    styleUrls: ['./visitors.component.scss'],
})
export class VisitorsComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    @Input() selectedVisitor: StudioLogs | null = new StudioLogs();
    isLoading = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    isScreenSmall: boolean;
    @Input() DATA: VisitorLogs[] = [];
    @Input() drawerClose: Function;
    @Input() pagination: SetupPagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    @Input() visitsDataSource: MatTableDataSource<any> =
        new MatTableDataSource();
    selectedCols = false;
    showMultiSelect = false;
    rowsSelected = 0;

    visitorsTableColumns: string[] = [
        'checkbox',
        'ACTION',
        'DATE',
        'LOCATION',
        'INOUTTIME',
        'PURPOSE',
        'MEETINGWITH',
    ];
    visitorsTableColumns2 = [
        { NAME: 'DATE', INDEX: 'DATE', SHOW: true },
        { NAME: 'LOCATION', INDEX: 'LOCATION', SHOW: true },
        { NAME: 'INOUTTIME', INDEX: 'INOUTTIME', SHOW: true },
        { NAME: 'PURPOSE', INDEX: 'PURPOSE', SHOW: true },
        { NAME: 'MEETINGWITH', INDEX: 'MEETINGWITH', SHOW: true },
    ];
    @Input() visits$: Observable<VisitorLogs[]>;
    checkedAll = false;
    indeterminate = false;
    selection = new SelectionModel<VisitorLogs>(true, []);
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _apiService: LoginService,
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

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.isLoading = true;
                    return this._apiService.getVisitors(
                        0,
                        10,
                        'MEETINGWITH',
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
            console.log(data);
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
    }
    /**
     * After view init
     */
    ngAfterViewInit(): void {
        console.log(this._sort);
        if (this._sort && this._paginator) {
            // Set the initial sort
            this._sort.sort({
                id: 'MEETINGWITH',
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
                        return this._apiService.getVisitors(
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

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    toggleAllRows() {
        if (this.isAllSelected()) {
            this.selection.clear();
            this.showMultiSelect = false;
            this.rowsSelected = 0;
            return;
        }
        console.log(this.selection.selected.length);

        this.selection.select(...this.visitsDataSource.data);
        if (this.selection.selected.length > 0) {
            this.showMultiSelect = true;
            this.rowsSelected = this.selection.selected.length;
        }
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: VisitorLogs): string {
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

    updateAllComplete(event, i) {
        this.visitorsTableColumns2[i].SHOW = event;
        this.visitorsTableColumns = ['checkbox', 'ACTION', 'DATE'];

        this.visitorsTableColumns2.forEach((item) => {
            if (item.SHOW == true) {
                this.visitorsTableColumns.push(item.INDEX);
            }
        });
    }

    showMultiBox() {
        this.rowsSelected = this.selection.selected.length;
        if (this.rowsSelected > 0) this.showMultiSelect = true;
        else this.showMultiSelect = false;
    }

    removeSelection() {
        if (
            this.visitsDataSource.data.length === this.selection.selected.length
        ) {
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
