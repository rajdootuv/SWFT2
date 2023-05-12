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
import { ContactsService } from 'app/modules/admin/contacts/contacts.service';
import { whatsappPagination, whatsappsetting } from '../../setting.type';


@Component({
    selector: 'app-list-whatsapp-setting',
    templateUrl: './list-whatsapp-setting.component.html',
    styleUrls: ['./list-whatsapp-setting.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class ListWhatsappSettingComponent {
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    recentTransactionsDataSource: MatTableDataSource<any> =
        new MatTableDataSource();

    whatsappTableColumns: string[] = [
        'checkbox',
        'ACTION',
        'NAME',
        'BaseUrl',
        'AuthenticationHeader',
        'Method',
        'Body',
    ];
    whatsappTableColumns2 = [
        { NAME: 'NAME', INDEX: 'NAME', SHOW: true },
        { NAME: 'BaseUrl', INDEX: 'BaseUrl', SHOW: true },
        {
            NAME: 'AuthenticationHeader',
            INDEX: 'AuthenticationHeader',
            SHOW: true,
        },
        { NAME: 'Method', INDEX: 'Method', SHOW: true },
        { NAME: 'Body', INDEX: 'Body', SHOW: true },
    ];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    trackByFn(index: number, item: any): any {
        return item.ID || index;
    }

    flashMessage: 'success' | 'error' | null = null;
    pagination: whatsappPagination;
    pagination2: whatsappPagination;
    selectedVisitor: whatsappsetting | null = new whatsappsetting();
    @Input() DATA: whatsappsetting = new whatsappsetting();
    selectedVisitorForm: UntypedFormGroup;
    tagsEditMode: boolean = false;
    drawerOpened = false;
    isScreenSmall: boolean;
    deleteShow = false;
    step = 0;
    oldvisitors: whatsappsetting[] = [];
    checkedAll = false;
    indeterminate = false;
    selection = new SelectionModel<whatsappsetting>(true, []);
    answer: number = null;
    value = Math.floor(10 * Math.random());
    value2 = Math.floor(10 * Math.random());
    selectedCols = false;
    isLoading: boolean = false;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _inventoryService: SettingService,
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
        // this.getauthentication();

        // Subscribe to media changes

        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });

        // Get the pagination
        this._inventoryService.pagination3$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: whatsappPagination) => {
                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the visitors
        this.whatsapp$ = this._inventoryService.whatsapp$;
        this.whatsapp$.subscribe((data) => {
            console.log(data);
            this.recentTransactionsDataSource.data = data;
            this.dataList = data;
        });

        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.isLoading = true;
                    return this._inventoryService.getWhatsapp(
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

        this._inventoryService
            .getWhatsapp(undefined, undefined, 'NAME', 'asc', undefined)
            .subscribe((data) => {
                // Update the brands
                this.oldvisitors12 = data.whatsapp;
                console.log(this.oldvisitors12, 'this.oldvisitors12');
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
                        return this._inventoryService.getWhatsapp(
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
    /** The label for the checkbox on the passed row */

    checkboxLabel(row?: whatsappsetting): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
            row.ID + 1
        }`;
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
    /****Show SnackBar ******/

    openSnackBar(msg: string, type) {
        this._snackBar.open(msg, '', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: type == 'E' ? 'style-error' : 'style-success',
        });
    }

    Propert: whatsappsetting = new whatsappsetting();
    Propert1: whatsappsetting = new whatsappsetting();
    Property: whatsappsetting | null = new whatsappsetting();

    add() {
        this.Propert = new whatsappsetting();
        console.log('click');
    }

    edit(property: whatsappsetting) {
        // this.Propert = Object.assign({}, property);
        this.Propert = property;
        console.log(this.Propert);
    }

    details(property: whatsappsetting) {
        this.selectedVisitor = property;
        this.deleteShow = false;
    }

    detailsDelete(data: whatsappsetting) {
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

    whatsapp$: Observable<whatsappsetting[]>;

    oldvisitors12: whatsappsetting[] = [];
    dataList = [];

    // add edit drawer close
    wpDrawerClose(): void {
        this._changeDetectorRef.markForCheck();
        var d = document.getElementById('closewhatsappDrawer') as HTMLElement;
        d.click();
        console.log('hee');
    }
    get wpDrawerCloseCallback() {
        return this.wpDrawerClose.bind(this);
    }

    // details delete drawer close
    whatsappDrawerClose(): void {
        this._changeDetectorRef.markForCheck();
        var d = document.getElementById('closeDrawer2') as HTMLElement;
        d.click();
        console.log('hee');
    }
    get whatsappDrawerCloseCallback() {
        return this.whatsappDrawerClose.bind(this);
    }

    updateAllComplete(event, i) {
        this.whatsappTableColumns2[i].SHOW = event;
        this.whatsappTableColumns = ['checkbox', 'ACTION', 'NAME'];

        this.whatsappTableColumns2.forEach((item) => {
            if (item.SHOW == true) {
                this.whatsappTableColumns.push(item.INDEX);
            }
        });
    }
    onMenuItemClick(event: MouseEvent) {
        // add your custom code to handle the menu item click here
        event.stopPropagation();
    }
}