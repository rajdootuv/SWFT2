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
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AuthenticationService } from '../authentications.service';
import {
    Visitors,
    AuthenticationPagination,
    AuthenticationVendor,
    Visits,
    Users,
} from '../authentications.types';
import { MatSort } from '@angular/material/sort';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher/media-watcher.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ContactsService } from '../../contacts/contacts.service';
import { Country } from '../../contacts/contacts.types';

@Component({
    selector: 'users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class UsersComponent {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    users$: Observable<Users[]>;
    //   visits$: Observable<Visits[]>;
    recentTransactionsDataSource: MatTableDataSource<any> =
        new MatTableDataSource();
    //   visitsDataSource: MatTableDataSource<any> = new MatTableDataSource();
    usersTableColumns: string[] = [
        'checkbox',
        'ACTION',
        'NAME',
        'EMAIL_ID',
        'MOBILE_NO',
        'DOB',
        'USER_TYPE',
    ];
    visitorsTableColumns2 = [
        { NAME: 'Email Id', INDEX: 'EMAIL_ID', SHOW: true },
        { NAME: 'Mobile No.', INDEX: 'MOBILE_NO', SHOW: true },
        { NAME: 'Birth Date', INDEX: 'DOB', SHOW: true },
        { NAME: 'User Type', INDEX: 'USER_TYPE', SHOW: true },
    ];

    //   flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: AuthenticationPagination;
    pagination2: AuthenticationPagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedUser: Users | null = new Users();
    //   visits: Visits | null = new Visits();
    //   visitsLogs: Visits[] = [];
    //   selectedVisitorForm: UntypedFormGroup;
    //   tagsEditMode: boolean = false;
    //   vendors: AuthenticationVendor[];
    drawerOpened = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    isScreenSmall: boolean;
    deleteShow = false;
    step = 0;
    oldvisitors: Users[] = [];
    checkedAll = false;
    indeterminate = false;
    selection = new SelectionModel<Users>(true, []);
    countries: Country[] = [];
    answer: number = null;
    value = Math.floor(10 * Math.random());
    value2 = Math.floor(10 * Math.random());
    selectedCols = false;
    hide = true;
    hide1 = true;
    is_ChooseOptions = false;
    Type_of_User = ['admin', 'super admin', 'regular'];
    Type_of_UserBelongs = ['admin', 'super admin', 'regular'];
    numSelected = 0;
    isLargeScreen: boolean;
    
    rowsSelected = 0;
    showMultiSelect = false;

    /**
     *
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _inventoryService: AuthenticationService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _contactsService: ContactsService,
        private _snackBar: MatSnackBar,
        private breakpointObserver: BreakpointObserver
    ) {}

    showDiv1 = true;
    showDiv2 = false;

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    /** Whether the number of selected elements matches the total number of rows. */

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
    checkboxLabel(row?: Users): string {
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
                console.log(matchingAliases, 'akdjadajs');
                console.log(matchingAliases.includes('md'));

                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
                console.log(this.isScreenSmall);
                this.isLargeScreen = matchingAliases.includes('sm');
                console.log(this.isLargeScreen, 'for is large');
            });

        this._contactsService.getCountries().subscribe((data) => {
            this.countries = [...[], ...data];

            // Mark for check
            this._changeDetectorRef.markForCheck();
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

        // Get the user

        this.users$ = this._inventoryService.users$;
        this.users$.subscribe((data) => {
            this.recentTransactionsDataSource.data = data;
            console.log(this.recentTransactionsDataSource, 'users');
        });

        // Get the vendors

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.isLoading = true;
                    return this._inventoryService.getUsers(
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

        // Get the user
        this._inventoryService
            .getUsers(undefined, undefined, 'NAME', 'asc', undefined)
            .subscribe((data) => {
                console.log(data, 'get users adaata');

                // Update the brands
                this.oldvisitors = data.users;

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
                        return this._inventoryService.getUsers(
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

    edit(data: Users) {
        this.newuser = data;
        console.log(this.newuser);

        // this.selectedVisitor.DATE_OF_VISIT = new Date(data.DATE_OF_VISIT);
    }

    // add-user drawer
    visitorDrawer2Close(): void {
        this._changeDetectorRef.markForCheck();
        var d = document.getElementById('closeDrawer2') as HTMLElement;
        d.click();
    }

    get visitorDrawer2CloseCallback() {
        return this.visitorDrawer2Close.bind(this);
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

    newuser: Users = new Users();

    //   add User button
    addUser() {
        this.newuser = new Users();
        console.log(this.newuser);
    }

    //   new user drawer
    newvisitorDrawerClose(): void {
        this._changeDetectorRef.markForCheck();
        this.getOldVisitors();

        var d = document.getElementById('addUserDrawer') as HTMLElement;
        d.click();
    }

    get newuserDrawerCloseCallback() {
        return this.newvisitorDrawerClose.bind(this);
    }

    getOldVisitors() {
        // Get the visitors
        this._inventoryService
            .getVisitors(undefined, undefined, 'NAME', 'asc', undefined)
            .subscribe((data) => {
                console.log(data, 'oldvisitors');

                // Update the brands
                //   this.oldvisitors = data.visitors;

                // Mark for check
                this._changeDetectorRef.markForCheck();
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

    // filter variables
    operators: string[] = ['AND', 'OR'];
    Select_columnName: string[] = [
        'Full Name',
        'Email',
        'Phone No',
        'Date of Birth',
        'User Type',
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
     * Column1 search function
     */
    colum1Search(value: any) {
        this.isLoading = true;

        this._inventoryService
            .getCustomers(0, 10, 'NAME', 'asc', value)
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

        this._inventoryService
            .getCustomers(0, 10, 'NAME', 'asc', value)
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

        this._inventoryService
            .getCustomers(0, 10, 'NAME', 'asc', value)
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

        this._inventoryService
            .getCustomers(0, 10, 'NAME', 'asc', value)
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

        this._inventoryService
            .getCustomers(0, 10, 'NAME', 'asc', value)
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

    // create filter
    createFilter() {
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
