// import { Component } from '@angular/core';
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
// import { Theme, themePagination } from '../setup.types';
import { MatSort } from '@angular/material/sort';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher/media-watcher.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
// import { Country } from '../../apps/contacts/contacts.types';
// import { ContactsService } from '../../apps/contacts/contacts.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { Theme, themePagination } from '../../setup.types';
import { SetupService } from '../../setup.service';

@Component({
    selector: 'app-list-theme',
    templateUrl: './list-theme.component.html',
    styleUrls: ['./list-theme.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class ListThemeComponent {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    theme$: Observable<Theme[]>;
    recentTransactionsDataSource: MatTableDataSource<any> =
        new MatTableDataSource();
    // ID: number;
    // NAME: string;
    // FONTFAMILY: string;
    // FONTSIZE: string;
    // PRIMARYCOLOR: string;
    // SECONDARYCOLOR: string;

    themeDataSource: MatTableDataSource<any> = new MatTableDataSource();
    themeTableColumns: string[] = [
        'checkbox',
        'ACTION',
        'NAME',
        'FONTFAMILY',
        'FONTSIZE',
        'PRIMARYCOLOR',
        'SECONDARYCOLOR',
    ];
    themeTableColumns2 = [
        { NAME: 'NAME', INDEX: 'NAME', SHOW: true },
        { NAME: 'FONTFAMILY', INDEX: 'FONTFAMILY', SHOW: true },
        { NAME: 'FONTSIZE', INDEX: 'FONTSIZE', SHOW: true },
        { NAME: 'PRIMARYCOLOR', INDEX: 'PRIMARYCOLOR', SHOW: true },
        { NAME: 'SECONDARYCOLOR', INDEX: 'SECONDARYCOLOR', SHOW: true },
    ];
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: themePagination;
    pagination2: themePagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedFloor: Theme = new Theme();

    selectedFloorForm: UntypedFormGroup;
    tagsEditMode: boolean = false;
    drawerOpened = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    isScreenSmall: boolean;
    deleteShow = false;
    step = 0;
    oldfloors: Theme[] = [];
    checkedAll = false;
    indeterminate = false;
    selection = new SelectionModel<Theme>(true, []);
    // countries: Country[] = [];
    answer: number = null;
    value = Math.floor(10 * Math.random());
    value2 = Math.floor(10 * Math.random());
    selectedCols = false;
    showMultiSelect = false;
    dataList = [];

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _apiService: SetupService,
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
        this._apiService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: themePagination) => {
                // Update the pagination
                this.pagination = pagination;
                console.log('this.pagination', this.pagination);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the themes
        this.theme$ = this._apiService.theme$;
        this.theme$.subscribe((data) => {
            console.log(data);
            this.recentTransactionsDataSource.data = data;
            this.dataList = data;
        });

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.isLoading = true;
                    return this._apiService.getTheme(
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

        // Get the themes
        this._apiService
            .getTheme(undefined, undefined, 'NAME', 'asc', undefined)
            .subscribe((data) => {
                // Update the brands
                this.oldfloors = data.floors;
                this.dataList = this.oldfloors

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

            // Get themes if sort or page changes
            merge(this._sort.sortChange, this._paginator.page)
                .pipe(
                    switchMap(() => {
                        this.isLoading = true;
                        return this._apiService.getTheme(
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
    checkboxLabel(row?: Theme): string {
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
                this._apiService.deleteFloor(product.ID).subscribe(() => {});
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

 

    /**
     * add drawer open
     *
     *
     */

    add() {
        this.newfloor = new Theme();
        // this.newfloor.FONTSIZE = null;
    }

    // floororDrawerClose(): void {
    //     this._changeDetectorRef.markForCheck();
    //     var d = document.getElementById('closeDrawer') as HTMLElement;
    //     d.click();
    //     console.log('hee');
    // }

    // get floororDrawerCloseCallback() {
    //     return this.floororDrawerClose.bind(this);
    // }

       /**
     * Edit drawer open
     *
     *
     */

       edit(data: Theme) {
        this.newfloor = data;
        console.log(this.newfloor, 'this.newfloor');
        this.newfloor.FONTFAMILY = data['FONTFAMILY'];
        this.newfloor.FONTSIZE = data['FONTSIZE'];
    }

    /**
     * details drawer open
     *
     *
     */

    details(data: Theme) {
        this.selectedFloor = data;
        console.log(this.newfloor, 'this.newfloor');
        this.deleteShow = false;
    }

    detailsDelete(data: Theme) {
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
            var d = document.getElementById('closeDrawer22') as HTMLElement;
            d.click();
        }
    }

    // floororDrawer2Close(): void {
    //     this._changeDetectorRef.markForCheck();
    //     var d = document.getElementById('closeDrawer2') as HTMLElement;
    //     d.click();
    // }

    // get floororDrawer2CloseCallback() {
    //     return this.floororDrawer2Close.bind(this);
    // }

    setStep(index: number) {
        this.step = index;
    }

    nextStep() {
        this.step++;
    }

    prevStep() {
        this.step--;
    }

    newfloor: Theme = new Theme();

    addFloors() {
        this.newfloor = new Theme();
    }

    // add and edit drawer close
    newthemeDrawerClose(): void {
        this._changeDetectorRef.markForCheck();

        var d = document.getElementById('closenewthemeDrawer') as HTMLElement;
        console.log('fff', d);
        d.click();
    }

    get newthemeDrawerCloseCallback() {
        return this.newthemeDrawerClose.bind(this);
    }



   // Activate Theme For Organization drawer close

    newfloorDrawertheme(): void {
        this._changeDetectorRef.markForCheck();

        var d = document.getElementById('closenewthemeDrawer') as HTMLElement;
        console.log('fff', d);
        d.click();
    }

    get newDrawerthemeCloseCallback() {
        return this.newfloorDrawertheme.bind(this);
    }


// Activate Theme For Organization drawer close


    // floorsDrawerClose(): void {
    //     this._changeDetectorRef.markForCheck();
    //     var d = document.getElementById('closefloorDrawer') as HTMLElement;
    //     d.click();
    // }

    // get floorsDrawerCloseCallback() {
    //     return this.floorsDrawerClose.bind(this);
    // }

    themeDrawerClose(): void {
        this._changeDetectorRef.markForCheck();
        var d = document.getElementById('closeDrawer22') as HTMLElement;
        d.click();
    }

    get themeDrawerCloseCallback() {
        return this.themeDrawerClose.bind(this);
    }


    // update check box

    updateAllComplete(event, i) {
        this.themeTableColumns2[i].SHOW = event;
        this.themeTableColumns = ['checkbox', 'ACTION', 'NAME'];

        this.themeTableColumns2.forEach((item) => {
            if (item.SHOW == true) {
                this.themeTableColumns.push(item.INDEX);
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
}
