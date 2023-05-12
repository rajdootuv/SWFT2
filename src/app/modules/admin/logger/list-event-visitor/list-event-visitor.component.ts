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
// import { SetupService } from '../setup.service';
// import { Floors, SetupPagination } from '../setup.types';
import { MatSort } from '@angular/material/sort';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher/media-watcher.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ContactsService } from '../../contacts/contacts.service';
import { Country } from '../../contacts/contacts.types';
import { EventLogs, SetupPagination } from '../loginativity.type';
import { LoginService } from '../loginactivity.service';

@Component({
    selector: 'app-list-event-visitor',
    templateUrl: './list-event-visitor.component.html',
    styleUrls: ['./list-event-visitor.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class ListEventVisitorComponent {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    Event$: Observable<EventLogs[]>;
    recentTransactionsDataSource: MatTableDataSource<any> =
        new MatTableDataSource();

    eventTableColumns: string[] = [
        'checkbox',
        'ACTION',
        'FULLNAME',
        'EMAILID',
        'CONTACTNO',
        'COMPANY',
        'VISITEDON',
    ];
    eventTableColumns2 = [
        { NAME: 'FULLNAME', INDEX: 'FULLNAME', SHOW: true },
        { NAME: 'EMAILID', INDEX: 'EMAILID', SHOW: true },
        { NAME: 'CONTACTNO', INDEX: 'CONTACTNO', SHOW: true },
        { NAME: 'COMPANY', INDEX: 'COMPANY', SHOW: true },
        { NAME: 'VISITEDON', INDEX: 'VISITEDON', SHOW: true },
    ];
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: SetupPagination;
    pagination2: SetupPagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedFloor: EventLogs | null = new EventLogs();
    selectedFloorForm: UntypedFormGroup;
    tagsEditMode: boolean = false;
    drawerOpened = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    isScreenSmall: boolean;
    deleteShow = false;
    step = 0;
    oldfloors: EventLogs[] = [];
    checkedAll = false;
    indeterminate = false;
    selection = new SelectionModel<EventLogs>(true, []);
    // countries: Country[] = [];
    answer: number = null;
    value = Math.floor(10 * Math.random());
    value2 = Math.floor(10 * Math.random());
    selectedCols = false;
    showMultiSelect = false;
    newevent: EventLogs = new EventLogs();
    dataList = [];
    countries: Country[] = [];

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _apiService: LoginService,
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
                console.log('this.pagination', this.pagination);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the events
        this.Event$ = this._apiService.eventlogs$;
        this.Event$.subscribe((data) => {
            console.log(data);
            this.recentTransactionsDataSource.data = data;
            this.dataList = data;

            console.log(this.dataList, 'this.dataList ');
        });

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.isLoading = true;
                    return this._apiService.getEvent(
                        0,
                        10,
                        'FULLNAME',
                        'asc',
                        query
                    );
                }),
                map(() => {
                    this.isLoading = false;
                })
            )
            .subscribe();

        // Get the events
        this._apiService
            .getEvent(undefined, undefined, 'FULLNAME', 'asc', undefined)
            .subscribe((data) => {
                // Update the brands
                this.oldfloors = data.events;

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
                id: 'FULLNAME',
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

            // Get events if sort or page changes
            merge(this._sort.sortChange, this._paginator.page)
                .pipe(
                    switchMap(() => {
                        this.isLoading = true;
                        return this._apiService.getEvent(
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

    onMenuItemClick(event: MouseEvent) {
        // add your custom code to handle the menu item click here
        event.stopPropagation();
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
    checkboxLabel(row?: EventLogs): string {
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
                // this._apiService.deleteFloor(product.ID).subscribe(() => {});
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

    edit(data: EventLogs) {
        this.newevent = data;
        console.log(this.newevent);
        // this.selectedVisitor.DATE_OF_VISIT = new Date(data.DATE_OF_VISIT);
    }

    add() {
        this.newfloor = new EventLogs();
        // this.newfloor.FONTSIZE = null
    }

    //  edit event drawer close
    eventDrawerClose(): void {
        this._changeDetectorRef.markForCheck();
        var d = document.getElementById('closeneweventDrawer') as HTMLElement;
        d.click();
        console.log('hee');
    }

    get neweventDrawerCloseCallback() {
        return this.eventDrawerClose.bind(this);
    }

    details(data: EventLogs) {
        this.selectedFloor = data;
        this.deleteShow = false;
    }

    detailsDelete(data: EventLogs) {
        this.selectedFloor = data;
        this.deleteShow = true;
        this.answer = null;
        this.value = Math.floor(10 * Math.random());
        this.value2 = Math.floor(10 * Math.random());
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

    floororDrawer2Close(): void {
        this._changeDetectorRef.markForCheck();
        var d = document.getElementById('closeDrawer2') as HTMLElement;
        d.click();
    }

    get floororDrawer2CloseCallback() {
        return this.floororDrawer2Close.bind(this);
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

    newfloor: EventLogs = new EventLogs();

    updateAllComplete(event, i) {
        this.eventTableColumns2[i].SHOW = event;
        this.eventTableColumns = [
            'checkbox',
            'ACTION',
            'FULLNAME',
            'EMAILID',
            'CONTACTNO',
            'COMPANY',
            'VISITEDON',
        ];

        this.eventTableColumns2.forEach((item) => {
            if (item.SHOW == true) {
                this.eventTableColumns.push(item.INDEX);
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
        'FULLNAME',
        'EMAILID',
        'CONTACTNO',
        'COMPANY',
        'VISITEDON',
    ];

    comparisons1: any[] = ['=', '!=', '<', '>', '<=', '>='];

     values: string[] = ['John', '25', 'Male', '12-04-2023'];
     selectedOperator: string = 'AND';
     selectedColumn: string = '';
     selectComparison: string = '';
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
             this.selectComparison == undefined ||
             this.selectComparison == ''
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
             let tag = `${this.selectedColumn} ${this.selectComparison} '${this.selectedValue}'`;
 
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
         this.selectComparison = '';
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
             this.selectComparison == undefined ||
             this.selectComparison == ''
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
             let tag = `${this.selectedColumn} ${this.selectComparison} '${this.selectedValue}'`;
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
