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
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _apiService: AuthenticationService,
        private _fuseMediaWatcherService: FuseMediaWatcherService
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
}
