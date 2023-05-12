import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ErrorStateMatcher, ThemePalette } from '@angular/material/core';
import {
    designationMaster,
    AuthenticationPagination,
} from './adddetails/adddetails';
import { SelectionModel } from '@angular/cdk/collections';
import { AuthenticationService } from '../authentications.service';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher/media-watcher.service';
// import { Observable } from 'rxjs/internal/Observable';
import {
    FormControl,
    FormGroupDirective,
    NgForm,
    UntypedFormControl,
} from '@angular/forms';
import {
    Observable,
    Subject,
    debounceTime,
    map,
    merge,
    switchMap,
    takeUntil,
} from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-designation',
    templateUrl: './designation.component.html',
    styleUrls: ['./designation.component.scss'],
})
export class DesignationComponent implements OnInit {
    designations$: Observable<designationMaster[]>;
    olddesignation: designationMaster[] = [];
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    @Input() selectedVisitor: designationMaster | null =
        new designationMaster();
    @Input() DATA: designationMaster[] = [];
    isLoading = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @Input() pagination: AuthenticationPagination;
    designations: designationMaster[];
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    designationTableColumns = [
        { NAME: 'NAME', INDEX: 'NAME', SHOW: true },
        { NAME: 'IS_ACTIVE', INDEX: 'IS_ACTIVE', SHOW: true },
    ];
    allComplete: boolean = false;

    drawerMode = 'side';
    drawerOpened = false;
    isScreenSmall = true;
    display: any;

    ngOnInit(): void {
        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.isLoading = true;
                    return this._inventoryService.getDesignations(
                        0,
                        5,
                        'name',
                        'asc',
                        query
                    );
                }),
                map((data) => {
                    this.isLoading = false;
                    this.dataSource.data = data.designations;
                    this.pagination = data.pagination;
                })
            )
            .subscribe();

        this.designations$ = this._inventoryService.designations$;
        this.designations$.subscribe((data) => {
            this.dataSource.data = data;
            console.log(data, 'jhgjyg');
        });

        this._inventoryService
            .getDesignations(undefined, undefined, 'NAME', 'asc', undefined)
            .subscribe((data) => {
                // Update the brands
                this.olddesignation = data.designations;
                // Mark for check
                this._changeDetectorRef.markForCheck();
                // console.log(this.designations)
            });

        this._inventoryService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: AuthenticationPagination) => {
                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    title = 'Add New Designation';
    displayedColumns: string[] = ['select', 'Action', 'NAME', 'IS_ACTIVE'];
    // dataSource = new MatTableDataSource<designationMaster>();

    @Input() dataSource: MatTableDataSource<any> = new MatTableDataSource();
    selection = new SelectionModel<designationMaster>(true, []);
    abc: any = ELEMENT_DATA;

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
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

        this.selection.select(...this.dataSource.data);
        if (this.selection.selected.length > 0) {
            this.showMultiSelect = true;
            this.rowsSelected = this.selection.selected.length;
        }
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: designationMaster): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
            row.ID + 1
        }`;
    }

    isChecked: boolean = false;
    hidePassword: boolean = false;

    USERINFO: designationMaster = new designationMaster();
    USERINFO1: designationMaster = new designationMaster();

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    ngAfterViewInit() {
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
                        return this._inventoryService.getDesignations(
                            this._paginator.pageIndex,
                            this._paginator.pageSize,
                            this._sort.active,
                            this._sort.direction,
                            undefined
                        );
                    }),
                    map((data) => {
                        this.isLoading = false;
                        this.dataSource.data = data.designations;
                        console.log('here');
                        this.pagination = data.pagination;
                    })
                )
                .subscribe();
        } else {
            // Mark for check
            this._changeDetectorRef.markForCheck();
            // Get visitors if sort or page changes
            merge(this._paginator.page)
                .pipe(
                    switchMap(() => {
                        this.isLoading = true;
                        return this._inventoryService.getDesignations(
                            this._paginator.pageIndex,
                            this._paginator.pageSize,
                            'NAME',
                            'asc',
                            undefined
                        );
                    }),
                    map((data) => {
                        this.isLoading = false;
                        console.log(data);

                        this.dataSource.data = data.designations;
                        this.pagination = data.pagination;
                    })
                )
                .subscribe();
        }
    }
    constructor(
        private _liveAnnouncer: LiveAnnouncer,
        private _inventoryService: AuthenticationService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _snackBar: MatSnackBar
    ) {}

    announceSortChange(sortState: Sort) {
        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this._liveAnnouncer.announce('Sorting cleared');
        }
    }

    toggle = true;
    status = 'Enable';

    enable(job) {
        this.toggle = !this.toggle;
        this.status = this.toggle ? 'Enable' : 'Disable';
    }

    /******adddetails Drawer ******/
    toggleDrawerMode(): void {
        this.drawerMode = this.drawerMode === 'side' ? 'over' : 'side';
    }

    /******To Open adddetails Drawer******/
    toggleDrawerOpen(): void {
        this.USERINFO = new designationMaster();
        this.drawerOpened = !this.drawerOpened;
    }

    /******To Close adddetails Drawer******/
    drawerClose() {
        this.reset();
        this.drawerOpened = false;
    }

    /******Reset adddetails  Drawer******/
    reset() {
        this.USERINFO = new designationMaster();
    }

    /******Close of adddetails  Drawer******/
    get closeCallback() {
        return this.drawerClose.bind(this);
    }
    //   @param opened

    drawerOpenedChanged(opened: boolean): void {
        this.drawerOpened = opened;
    }

    /******Edit adddetails Drawer******/
    editData(data: designationMaster) {
        // this.title="Update the Designation"
        this.USERINFO = Object.assign({}, data);
        console.log(data);
        // console.log(this.USERINFO);

        this.drawerOpened = true;
    }

    /******To Open detailview Drawer******/
    editDetails(data: designationMaster) {
        // this.title="Update the Designation"
        this.USERINFO1 = Object.assign({}, data);
        console.log(data);
        // console.log(this.USERINFO);

        // this.setItem('Details')
    }

    /*****This is for details drawer**** */
    drawerMode1 = 'side';
    drawerOpened1 = false;
    isScreenSmall1 = true;

    toggleDrawerMode1(): void {
        this.drawerMode1 = this.drawerMode1 === 'side' ? 'over' : 'side';
    }

    /******To Open details drawer******/

    toggleDrawerOpen1(): void {
        this.drawerOpened1 = !this.drawerOpened1;
        // this.USERINFO = Object.assign({}, data);
    }

    /******to close details drawer */
    drawerClose1() {
        this.drawerOpened1 = false;
        this.USERINFO = new designationMaster();
    }

    get closeCallback1() {
        return this.drawerClose1.bind(this);
    }
    //   @param opened

    drawerOpenedChanged1(opened: boolean): void {
        this.drawerOpened1 = opened;
    }

    /****This is for Delete drawer */
    drawerMode2 = 'side';
    drawerOpened2 = false;
    isScreenSmall2 = true;
    toggleDrawerMode2(): void {
        this.drawerMode2 = this.drawerMode2 === 'side' ? 'over' : 'side';
    }

    /*****Open Delete drawer*****/
    toggleDrawerOpen2(): void {
        this.drawerOpened2 = !this.drawerOpened2;
    }

    /******Close Delete drawer *******/
    drawerClose2() {
        this.reset2();
        this.drawerOpened2 = false;
    }

    /****Reset Delete drawer *****/
    reset2() {
        this.USERINFO = new designationMaster();
    }

    get closeCallback2() {
        return this.drawerClose2.bind(this);
    }
    //   @param opened

    drawerOpenedChanged2(opened: boolean): void {
        this.drawerOpened2 = opened;
    }

    answer1: number = null;
    value = Math.floor(10 * Math.random());
    value2 = Math.floor(10 * Math.random());

    /*****Delete Equation Generate */
    detailsDelete(data: designationMaster) {
        // this.selectedVisitor = data;
        this.answer1 = null;
        this.USERINFO = Object.assign({}, data);
        console.log(data);
        this.value = Math.floor(10 * Math.random());
        this.value2 = Math.floor(10 * Math.random());
        // this.selectedVisitor.DATE_OF_VISIT = new Date(data.DATE_OF_VISIT);
    }
    /****** This is for Roles drawer*/

    drawerMode3 = 'side';
    drawerOpened3 = false;
    isScreenSmall3 = true;

    /****To open Roles Drawer */
    toggleDrawerMode3(): void {
        this.drawerMode3 = this.drawerMode3 === 'side' ? 'over' : 'side';
    }

    toggleDrawerOpen3(): void {
        this.drawerOpened3 = !this.drawerOpened3;
    }

    drawerClose3() {
        this.reset3();
        this.drawerOpened3 = false;
    }

    reset3() {
        this.USERINFO = new designationMaster();
    }

    get closeCallback3() {
        return this.drawerClose3.bind(this);
    }
    //   @param opened

    drawerOpenedChanged3(opened: boolean): void {
        this.drawerOpened2 = opened;
    }

    /****Sort table***/
    updateAllComplete(event, i) {
        this.designationTableColumns[i].SHOW = event;
        this.displayedColumns = ['select', 'Action'];

        this.designationTableColumns.forEach((item) => {
            if (item.SHOW == true) {
                this.displayedColumns.push(item.INDEX);
            }
        });
    }

    /******Show snak bar*****/
    openSnackBar(msg: string, type) {
        this._snackBar.open(msg, '', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: type == 'E' ? 'style-error' : 'style-success',
        });
    }

    /***Selection Model ****/
    showMultiBox() {
        this.rowsSelected = this.selection.selected.length;
        if (this.rowsSelected > 0) this.showMultiSelect = true;
        else this.showMultiSelect = false;
    }

    /**** Remove Selection****/
    removeSelection() {
        if (this.dataSource.data.length === this.selection.selected.length) {
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
    showMultiSelect = false;
    rowsSelected = 0;

    editSelection() {
        this.openSnackBar('Selected rows edited successfully', 'S');
        this.removeSelection();
        //this.selection.selected
    }
}

const ELEMENT_DATA: designationMaster[] = [
    { ID: 1, NAME: 'Akshaya', IS_ACTIVE: true },
    { ID: 2, NAME: 'Akshayaa', IS_ACTIVE: true },
    { ID: 3, NAME: 'Akshaya Jadhav', IS_ACTIVE: false },
    { ID: 4, NAME: 'Akshayaa', IS_ACTIVE: true },
    { ID: 5, NAME: 'Akshaya1', IS_ACTIVE: false },
    { ID: 6, NAME: 'Shreyaa', IS_ACTIVE: true },
    { ID: 7, NAME: 'Pradnya', IS_ACTIVE: false },
    { ID: 8, NAME: 'Purva', IS_ACTIVE: true },
    { ID: 9, NAME: 'Prachi', IS_ACTIVE: false },
    { ID: 10, NAME: 'Vibhavari', IS_ACTIVE: true },
    { ID: 11, NAME: 'Rutuja', IS_ACTIVE: true },
    { ID: 12, NAME: 'Vaishnavi', IS_ACTIVE: false },
];
