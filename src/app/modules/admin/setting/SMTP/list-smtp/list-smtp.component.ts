import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
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

import { MatSort } from '@angular/material/sort';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher/media-watcher.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingService } from '../../setting.service';
import {
    SettingsPagination,
    SettingsPaginationsmtp,
    smtpsetting,
} from '../../setting.type';

@Component({
    selector: 'app-list-smtp',
    templateUrl: './list-smtp.component.html',
    styleUrls: ['./list-smtp.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class ListSMTPComponent {
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    recentTransactionsDataSource: MatTableDataSource<any> =
        new MatTableDataSource();

    smtpTableColumns: string[] = [
        'checkbox',
        'ACTION',
        'SERVICENAME',
        'HOSTNAME',
        'PORTNUMBER',
        'SSEnabled',
        'AUTHENTICATIONTYPE',
    ];
    smtpTableColumns2 = [
        { NAME: 'Servicename', INDEX: 'SERVICENAME', SHOW: true },
        { NAME: 'Hostname', INDEX: 'HOSTNAME', SHOW: true },
        { NAME: 'portnumber', INDEX: 'PORTNUMBER', SHOW: true },
        { NAME: 'ssenabled', INDEX: 'SSEnabled', SHOW: true },
        { NAME: 'Authenticationtype', INDEX: 'AUTHENTICATIONTYPE', SHOW: true },
    ];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    trackByFn(index: number, item: any): any {
        return item.ID || index;
    }

    flashMessage: 'success' | 'error' | null = null;
    pagination: SettingsPagination;
    pagination2: SettingsPagination;
    selectedVisitor: smtpsetting | null = new smtpsetting();
    selectedVisitorForm: UntypedFormGroup;
    tagsEditMode: boolean = false;
    drawerOpened = false;
    isScreenSmall: boolean;
    deleteShow = false;
    step = 0;
    oldvisitors: smtpsetting[] = [];
    checkedAll = false;
    indeterminate = false;
    selection = new SelectionModel<smtpsetting>(true, []);
    answer: number = null;
    value = Math.floor(10 * Math.random());
    value2 = Math.floor(10 * Math.random());
    selectedCols = false;
    smtp$: Observable<smtpsetting[]>;
    oldvisitors12: smtpsetting[] = [];
    dataList = [];

    isLoading: boolean = false;
    @Input() DATA: smtpsetting = new smtpsetting();
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _inventoryService: SettingService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
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

        // Get the pagination
        this._inventoryService.pagination1$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: SettingsPaginationsmtp) => {
                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the visitors
        this.smtp$ = this._inventoryService.smtp$;
        this.smtp$.subscribe((data) => {
            console.log(data);
            this.recentTransactionsDataSource.data = data;
            this.dataList = data;
        });

        this._inventoryService
            .getSMTP(undefined, undefined, 'SERVICENAME', 'asc', undefined)
            .subscribe((data) => {
                // Update the brands
                this.oldvisitors12 = data.smtp;
                console.log(this.oldvisitors12, 'this.oldvisitors12');
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.isLoading = true;
                    return this._inventoryService.getSMTP(
                        0,
                        10,
                        'SERVICENAME',
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
        console.log(this._sort);

        if (this._sort && this._paginator) {
            // Set the initial sort
            this._sort.sort({
                id: 'SERVICENAME',
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
                        return this._inventoryService.getSMTP(
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
    /** Whether the number of selected elements matches the total number of rows. */

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.recentTransactionsDataSource.data.length;
        return numSelected === numRows;
    }
    showMultiSelect = false;
    rowsSelected = 0;
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

    onMenuItemClick(event: MouseEvent) {
        // add your custom code to handle the menu item click here
        event.stopPropagation();
    }
    /** The label for the checkbox on the passed row */

    checkboxLabel(row?: smtpsetting): string {
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

    Propert: smtpsetting = new smtpsetting();
    Propert1: smtpsetting = new smtpsetting();
    Property: smtpsetting | null = new smtpsetting();

    add() {
        this.Propert = new smtpsetting();
        console.log('click');
    }

    edit(property: smtpsetting) {
        this.Propert = property;
        console.log(this.Propert);
    }

    details(property: smtpsetting) {
        this.selectedVisitor = property;
        this.deleteShow = false;
    }

    detailsDelete(data: smtpsetting) {
        this.selectedVisitor = data;
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

    // smtp add edit drawer close back
    addDrawerClose(): void {
        this._changeDetectorRef.markForCheck();
        var d = document.getElementById('closeDrawersmtp') as HTMLElement;
        d.click();
        console.log('hee');
    }
    get smtpaddDrawerCloseCallback() {
        return this.addDrawerClose.bind(this);
    }
    smtpDrawerClose(): void {
        // this._changeDetectorRef.markForCheck();
        // var d = document.getElementById('closeDrawer') as HTMLElement;
        // d.click();
        // console.log('hee');
    }
    get smtpDrawerCloseCallback() {
        return this.smtpDrawerClose.bind(this);
    }

    updateAllComplete(event, i) {
        this.smtpTableColumns2[i].SHOW = event;
        this.smtpTableColumns = ['checkbox', 'ACTION', 'SERVICENAME'];

        this.smtpTableColumns2.forEach((item) => {
            if (item.SHOW == true) {
                this.smtpTableColumns.push(item.INDEX);
            }
        });
    }

    // filter variables
    operators: string[] = ['AND', 'OR'];
    Select_columnName: string[] = [
        'SERVICENAME',
        'HOSTNAME',
        'PORTNUMBER',
        'SSEnabled',
        'AUTHENTICATIONTYPE',
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
