import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
    TemplateRef,
    Input,
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
 
import { MatSort } from '@angular/material/sort';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher/media-watcher.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog'; 
import { Country } from 'app/modules/admin/contacts/contacts.types';
import { SetupPagination, OrganizationData } from '../../setup.types';
import { SetupService } from '../../setup.service';


@Component({
    selector: 'app-organizationlist',
    templateUrl: './organizationlist.component.html',
    styleUrls: ['./organizationlist.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class OrganizationlistComponent implements OnInit, AfterViewInit, OnDestroy {

    constructor(
        private _changeDetectorRef: ChangeDetectorRef, 
        private _inventoryService: SetupService,
        private _fuseMediaWatcherService: FuseMediaWatcherService, 
        private _snackBar: MatSnackBar,
        public dialog: MatDialog
    ) { }
    isLoading: boolean = false;
    @Input() closeDrawer: Function
    
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    organization$: Observable<OrganizationData[]>;
    addorganization: OrganizationData | null = new OrganizationData();
    recentTransactionsDataSource: MatTableDataSource<any> =
        new MatTableDataSource();

   

    organizationTableColumns: string[] = ['checkbox', 'ACTION', 'NAME', 'WEBSITE', 'CITY', 'STATE', 'COUNTRY'];
    organizationTableColumns2 = [
        { NAME: 'Name', INDEX: 'NAME', SHOW: true },
        { NAME: 'Website', INDEX: 'WEBSITE', SHOW: true },
        { NAME: 'City', INDEX: 'CITY', SHOW: true },
        { NAME: 'State', INDEX: 'STATE', SHOW: true },
        { NAME: 'Country', INDEX: 'COUNTRY', SHOW: true }
    ];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    trackByFn(index: number, item: any): any {
        return item.ID || index;
    }

    flashMessage: 'success' | 'error' | null = null;
    pagination: SetupPagination;
    pagination2: SetupPagination;
    selectedOrganization: OrganizationData | null = new OrganizationData();

    // OrganizationData : Visits | null = new Visits();
    selectedVisitorForm: UntypedFormGroup;
    tagsEditMode: boolean = false;
    vendors: any[];
    drawerOpened = false;
    // private _unsubscribeAll: Subject<any> = new Subject<any>();
    isScreenSmall: boolean;
    deleteShow = false;
    step = 0;
    oldvisitors: OrganizationData[] = [];
    checkedAll = false;
    indeterminate = false;
    selection = new SelectionModel<OrganizationData>(true, []);
    countries: Country[] = [];
    answer: number = null;
    value = Math.floor(10 * Math.random());
    value2 = Math.floor(10 * Math.random());
    selectedCols = false;

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.recentTransactionsDataSource.data.length;
        return numSelected === numRows;
    }
    showMultiSelect = false;
    rowsSelected = 0;


    showMultiBox() {
        this.rowsSelected = this.selection.selected.length;
        if (this.rowsSelected > 0) this.showMultiSelect = true;
        else this.showMultiSelect = false;
    }



    latitude: number = 0;
    longitude: number = 0;
    zoom = 12;
    @Input() center: google.maps.LatLngLiteral = {
        lat: 16.867634,
        lng: 74.570389,
    };
    markerOptions: google.maps.MarkerOptions = { draggable: true };
    @Input() markerPositions: google.maps.LatLngLiteral = {
        lat: 16.867634,
        lng: 74.570389,
    };


    openDialog(templateRef: TemplateRef<any>) {
        this.dialog.open(templateRef);
    }

    add() {
        // this.visits = new Visits();
        // this.visits.DATE_OF_VISIT = new Date();
        this.addorganization = new OrganizationData();

        console.log('click');
    }

    edit(property: OrganizationData) {
        // this.Property = property;
        this.addorganization = Object.assign({}, property);
        console.log(this.addorganization)

        // this.selectedOrganization.DATE_OF_VISIT = new Date(data.DATE_OF_VISIT);
    }

    onMenuItemClick(event: MouseEvent) {
        // add your custom code to handle the menu item click here
        event.stopPropagation();
    }


    details(property: OrganizationData) {
        this.selectedOrganization = property;
        this.deleteShow = false;
        // this.selectedOrganization.DATE_OF_VISIT = new Date(data.DATE_OF_VISIT);
    }


    detailsDelete(data: OrganizationData) {
        this.selectedOrganization = data;
        this.deleteShow = true;
        this.answer = null;
        this.value = Math.floor(10 * Math.random());
        this.value2 = Math.floor(10 * Math.random());
        // this.selectedVisitor.DATE_OF_VISIT = new Date(data.DATE_OF_VISIT);
    }


    removeSelection() {
        if (this.recentTransactionsDataSource.data.length === this.selection.selected.length) {
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
    toggleAllRows() {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }

        this.selection.select(...this.recentTransactionsDataSource.data);
        this.selection.select(...this.recentTransactionsDataSource.data);
        if (this.selection.selected.length > 0) {
            this.showMultiSelect = true;
            this.rowsSelected = this.selection.selected.length;
        }

    }

    get organizationDrawerCloseCallback() {
        return this.organizationdrawer.bind(this);
    }

    organizationdrawer(): void {
        this.closeDrawer()
        this._changeDetectorRef.markForCheck();
        var d = document.getElementById('closeDrawer') as HTMLElement;
        d.click();
        console.log('hee');
    }

    checkboxLabel(row?: OrganizationData): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.ID + 1
            }`;
    }

    newvisitor: OrganizationData = new OrganizationData();
    addVisitor() {
        this.newvisitor = new OrganizationData();
    }


    openSnackBar(msg: string, type) {
        this._snackBar.open(msg, '', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: type == 'E' ? 'style-error' : 'style-success',
        });
    }

    //   visits: OrganizationData = new OrganizationData();
    Property: OrganizationData | null = new OrganizationData();







    // visitors$: Observable<Visitors[]>;
    // properties$: Observable<OrganizationData[]>;
    organizationdata$: Observable<OrganizationData[]>;




    // oldvisitors1: Visitors[] = [];
    oldorganizationdata: OrganizationData[] = [];




    ngOnInit(): void {

        // Subscribe to media changes

        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
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


        // Get the visitors
        this.organizationdata$ = this._inventoryService.organization$;
        this.organizationdata$.subscribe((data) => {
            console.log(data);
            this.recentTransactionsDataSource.data = data;
            console.log(this.recentTransactionsDataSource.data, "this.recentTransactionsDataSource.data")
        });


        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.isLoading = true;
                    return this._inventoryService.getOrganization(
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
            .getOrganization(undefined, undefined, 'NAME', 'asc', undefined)
            .subscribe((data) => {
                // Update the brands
                this.oldorganizationdata = data.organization;
                console.log(this.oldorganizationdata, 'this.oldorganizationdata')
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });











    }



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
                        return this._inventoryService.getOrganization(
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


    // Properties: Properties | null = new Properties();

    visitorDrawerClose(): void {
        this._changeDetectorRef.markForCheck();
        var d = document.getElementById('closeDrawer') as HTMLElement;
        d.click();
        console.log('hee');
    }

    get visitorDrawerCloseCallback() {
        return this.visitorDrawerClose.bind(this);
    }




    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    updateAllComplete(event, i) {
        this.organizationTableColumns2[i].SHOW = event;
        this.organizationTableColumns = ['checkbox', 'ACTION', 'NAME',];

        this.organizationTableColumns2.forEach((item) => {
            if (item.SHOW == true) {
                this.organizationTableColumns.push(item.INDEX);
            }
        });
    }

}
