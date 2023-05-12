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
} from '../authentications.types';
import { MatSort } from '@angular/material/sort';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher/media-watcher.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactsService } from '../../contacts/contacts.service';
import { Country } from '../../contacts/contacts.types';

@Component({
    selector: 'visitors',
    templateUrl: './visitor.component.html',
    styleUrls: ['./visitor.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class VisitorComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    visitors$: Observable<Visitors[]>;
    visits$: Observable<Visits[]>;
    recentTransactionsDataSource: MatTableDataSource<any> =
        new MatTableDataSource();
    visitsDataSource: MatTableDataSource<any> = new MatTableDataSource();
    visitorsTableColumns: string[] = [
        'checkbox',
        'ACTION',
        'NAME',
        'EMAIL_ID',
        'MOBILE_NO',
        'COMPANY_NAME',
        'DESIGNATION',
        'COUNTRY',
        'CITY',
        'ACTIVE',
    ];
    visitorsTableColumns2 = [
        { NAME: 'Email Id', INDEX: 'EMAIL_ID', SHOW: true },
        { NAME: 'Mobile No.', INDEX: 'MOBILE_NO', SHOW: true },
        { NAME: 'Company Name', INDEX: 'COMPANY_NAME', SHOW: true },
        { NAME: 'Profession', INDEX: 'DESIGNATION', SHOW: true },
        { NAME: 'Country', INDEX: 'COUNTRY', SHOW: true },
        { NAME: 'City', INDEX: 'CITY', SHOW: true },
        { NAME: 'Active', INDEX: 'ACTIVE', SHOW: true },
    ];
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: AuthenticationPagination;
    pagination2: AuthenticationPagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedVisitor: Visitors | null = new Visitors();
    visits: Visits | null = new Visits();
    visitsLogs: Visits[] = [];
    selectedVisitorForm: UntypedFormGroup;
    tagsEditMode: boolean = false;
    vendors: AuthenticationVendor[];
    drawerOpened = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    isScreenSmall: boolean;
    deleteShow = false;
    step = 0;
    oldvisitors: Visitors[] = [];
    checkedAll = false;
    indeterminate = false;
    selection = new SelectionModel<Visitors>(true, []);
    countries: Country[] = [];
    answer: number = null;
    value = Math.floor(10 * Math.random());
    value2 = Math.floor(10 * Math.random());

    rowsSelected = 0;
    showMultiSelect = false;

    // filter variables
    numSelected = 0;
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

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _inventoryService: AuthenticationService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _contactsService: ContactsService,
        private _snackBar: MatSnackBar
    ) {}

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
      checkboxLabel(row?: Visitors): string {
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

        // Get the visitors
        this.visitors$ = this._inventoryService.visitors$;
        this.visitors$.subscribe((data) => {
            console.log(data, 'vistior');
            this.recentTransactionsDataSource.data = data;
        });

        // Get the vendors
        // this._inventoryService
        //     .getVendors()
        //     .subscribe((vendors: AuthenticationVendor[]) => {
        //         // Update the vendors
        //         this.vendors = vendors;

        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     });

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.isLoading = true;
                    return this._inventoryService.getVisitors(
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

        // Get the visitors
        this._inventoryService
            .getVisitors(undefined, undefined, 'NAME', 'asc', undefined)
            .subscribe((data) => {
                // Update the brands
                this.oldvisitors = data.visitors;

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
            // this._sort.sortChange
            //     .pipe(takeUntil(this._unsubscribeAll))
            //     .subscribe(() => {
            //         // Reset back to the first page
            //         this._paginator.pageIndex = 0;
            //     });

            // Get visitors if sort or page changes
            merge(this._sort.sortChange, this._paginator.page)
                .pipe(
                    switchMap(() => {
                        this.isLoading = true;
                        return this._inventoryService.getVisitors(
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Delete the selected product using the form data
     */
    deleteSelectedVisitor(): void {
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
                const product = this.selectedVisitorForm.getRawValue();

                // Delete the product on the server
                this._inventoryService;
                // .deleteVisitor(product.ID)
                // .subscribe(() => {});
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

    edit(data: Visitors) {
        this.newvisitor = data;
        // this.selectedVisitor.DATE_OF_VISIT = new Date(data.DATE_OF_VISIT);
    }

    add() {
        this.visits = new Visits();
        this.visits.DATE_OF_VISIT = new Date();
    }

    visitorDrawerClose(): void {
        this._changeDetectorRef.markForCheck();
        var d = document.getElementById('closeDrawer') as HTMLElement;
        d.click();
        console.log('hee');
    }

    get visitorDrawerCloseCallback() {
        return this.visitorDrawerClose.bind(this);
    }

    details(data: Visitors) {
        this.selectedVisitor = data;
        this.deleteShow = false;
        // this.selectedVisitor.DATE_OF_VISIT = new Date(data.DATE_OF_VISIT);
    }

    detailsDelete(data: Visitors) {
        this.selectedVisitor = data;
        this.deleteShow = true;
        this.answer = null;
        this.value = Math.floor(10 * Math.random());
        this.value2 = Math.floor(10 * Math.random());
        // this.selectedVisitor.DATE_OF_VISIT = new Date(data.DATE_OF_VISIT);
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

    newvisitor: Visitors = new Visitors();
    addVisitor() {
        this.newvisitor = new Visitors();
    }

    newvisitorDrawerClose(): void {
        this._changeDetectorRef.markForCheck();
        this.getOldVisitors();

        var d = document.getElementById('closenewvisitorDrawer') as HTMLElement;
        console.log('fff', d);
        d.click();
    }

    get newvisitorDrawerCloseCallback() {
        return this.newvisitorDrawerClose.bind(this);
    }

    viewVisitorLogs(data: Visitors) {
        this.selectedVisitor = data;

        this._inventoryService
            .getVisits(
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                data.ID
            )
            .subscribe((data2) => {
                // Update the brands
                console.log(data2);
                this.visitsLogs = [...[], ...data2.visits];
                this.pagination2 = data2.pagination;
                this.visitsDataSource.data = this.visitsLogs;
                var d = document.getElementById(
                    'openvisitDrawer'
                ) as HTMLElement;
                d.click();
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    visitsDrawerClose(): void {
        this._changeDetectorRef.markForCheck();
        var d = document.getElementById('closevisitDrawer') as HTMLElement;
        d.click();
    }

    get visitsDrawerCloseCallback() {
        return this.visitsDrawerClose.bind(this);
    }

    getOldVisitors() {
        // Get the visitors
        this._inventoryService
            .getVisitors(undefined, undefined, 'NAME', 'asc', undefined)
            .subscribe((data) => {
                // Update the brands
                this.oldvisitors = data.visitors;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
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

        this._inventoryService
            .getVisits(0, 10, 'NAME', 'asc', value, undefined)
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
            .getVisits(0, 10, 'NAME', 'asc', value, undefined)
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
            .getVisits(0, 10, 'NAME', 'asc', value, undefined)
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
            .getVisits(0, 10, 'NAME', 'asc', value, undefined)
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
            .getVisits(0, 10, 'NAME', 'asc', value, undefined)
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
