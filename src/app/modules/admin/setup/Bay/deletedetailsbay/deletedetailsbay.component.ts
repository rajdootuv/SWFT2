import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, Subject, debounceTime, map, merge, switchMap, takeUntil } from 'rxjs'; 
import { MatTableDataSource } from '@angular/material/table';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections'; 
import { FuseConfirmationService } from '@fuse/services/confirmation'; 
import { FuseMediaWatcherService } from '@fuse/services/media-watcher'; 
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { Visits, AuthenticationPagination, AuthenticationVendor } from 'app/modules/admin/authentications/authentications.types';
import { ContactsService } from 'app/modules/admin/contacts/contacts.service';
import { Country } from 'app/modules/admin/contacts/contacts.types';
import { Bays } from '../../setup.types';
import { SetupService } from '../../setup.service';

@Component({
  selector: 'app-deletedetailsbay',
  templateUrl: './deletedetailsbay.component.html',
  styleUrls: ['./deletedetailsbay.component.scss']
})
export class DeletedetailsbayComponent {
  @Input() DATA: Bays = new Bays();
  @Input() drawerClose: Function;
  @Input() deleteShow: boolean;
  @Input() selectedVisitor: Bays | null = new Bays();

  bays$: Observable<Bays[]>;
  visits$: Observable<Visits[]>;
  recentTransactionsDataSource: MatTableDataSource<any> =
    new MatTableDataSource();
  visitsDataSource: MatTableDataSource<any> = new MatTableDataSource();
  visitorsTableColumns: string[] = [
    'checkbox',
    'ACTION',
    'NAME',
    'LENGTH',
    'WIDTH',
    'SHOOT_TYPE'
    // 'EMAIL_ID',
    // 'MOBILE_NO',
    // 'COMPANY_NAME',
    // 'DESIGNATION',
    // 'COUNTRY',
    // 'CITY',
    // 'ACTIVE',
  ];
  visitorsTableColumns2 = [
    { NAME: 'Length', INDEX: 'LENGTH', SHOW: true },
    { NAME: 'Width', INDEX: 'WIDTH', SHOW: true },
    { NAME: 'Shoot Type', INDEX: 'SHOOT_TYPE', SHOW: true },
    // { NAME: 'Profession', INDEX: 'DESIGNATION', SHOW: true },
    // { NAME: 'Country', INDEX: 'COUNTRY', SHOW: true },
    // { NAME: 'City', INDEX: 'CITY', SHOW: true },
    // { NAME: 'Active', INDEX: 'ACTIVE', SHOW: true },
  ];
  flashMessage: 'success' | 'error' | null = null;
  isLoading: boolean = false;
  pagination: AuthenticationPagination;
  pagination2: AuthenticationPagination;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  visits: Visits | null = new Visits();
  selectedVisitorForm: UntypedFormGroup;
  tagsEditMode: boolean = false;
  vendors: AuthenticationVendor[];
  drawerOpened = false;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  isScreenSmall: boolean;
  // deleteShow = false;
  step = 0;
  oldvisitors: Bays[] = [];
  checkedAll = false;
  indeterminate = false;
  selection = new SelectionModel<Bays>(true, []);
  countries: Country[] = [];
  answer: number = null;
  value = Math.floor(10 * Math.random());
  value2 = Math.floor(10 * Math.random());
  selectedCols = false;

  showMultiSelect = false;

  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,
    private _inventoryService: SetupService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _contactsService: ContactsService,
    private _snackBar: MatSnackBar
  ) { }

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
  checkboxLabel(row?: Bays): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.ID + 1
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
    this.bays$ = this._inventoryService.bays$;
    this.bays$.subscribe((data) => {
      console.log("Only data", data);
      this.recentTransactionsDataSource.data = data;
    });

 

    // Subscribe to search input field value changes
    this.searchInputControl.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        switchMap((query) => {
          this.isLoading = true;
          return this._inventoryService.getBays(
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
      .getBays(undefined, undefined, 'NAME', 'asc', undefined)
      .subscribe((data) => {
        // Update the brands
        this.oldvisitors = data.bays;

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });
  }

  /**
   * After view init
   */
  // ngAfterViewInit(): void {
  //     if (this._sort && this._paginator) {
  //         // Set the initial sort
  //         this._sort.sort({
  //             id: 'NAME',
  //             start: 'asc',
  //             disableClear: true,
  //         });

  //         // Mark for check
  //         this._changeDetectorRef.markForCheck();

  //         // If the user changes the sort order...
  //         this._sort.sortChange
  //             .pipe(takeUntil(this._unsubscribeAll))
  //             .subscribe(() => {
  //                 // Reset back to the first page
  //                 this._paginator.pageIndex = 0;
  //             });

  //         // Get visitors if sort or page changes
  //         merge(this._sort.sortChange, this._paginator.page)
  //             .pipe(
  //                 switchMap(() => {
  //                     this.isLoading = true;
  //                     return this._inventoryService.getBays(
  //                         this._paginator.pageIndex,
  //                         this._paginator.pageSize,
  //                         this._sort.active,
  //                         this._sort.direction
  //                     );
  //                 }),
  //                 map(() => {
  //                     this.isLoading = false;
  //                 })
  //             )
  //             .subscribe();
  //     }
  // }

  rowsSelected = 0;


  showMultiBox() {
    this.rowsSelected = this.selection.selected.length;
    if (this.rowsSelected > 0) this.showMultiSelect = true;
    else this.showMultiSelect = false;
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

  edit(data: Bays) {
    this.newvisitor = data;
  }

  add() {
    this.newvisitor = new Bays();
    this.newvisitor.ID = 0;
    console.log('ID = ', this.newvisitor.ID);
  }

  Cetegory = ['abcd', 'sddf', 'fger', 'ewresd', 'edxcc'];
  LengthType = ['aaa', 'ssss'];

  deleteInfo() {
    if (this.answer == undefined || this.answer == null) {
      this.openSnackBar('Please solve the puzzle', 'E');
    } else if (this.answer != this.value + this.value2) {
      this.openSnackBar('Wrong answer', 'E');
    } else {
      this.openSnackBar('Information deleted successfully', 'S');
      this.drawerClose();
      var d = document.getElementById('closeDrawer') as HTMLElement;
      d.click();
    }
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

  newvisitor: Bays = new Bays();
  addVisitor() {
    this.newvisitor = new Bays();
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
      .getBays(undefined, undefined, 'NAME', 'asc', undefined)
      .subscribe((data) => {
        // Update the brands
        this.oldvisitors = data.bays;

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });
  }

  updateAllComplete(event, i) {
    this.visitorsTableColumns2[i].SHOW = event;
    this.visitorsTableColumns = ['checkbox', 'ACTION', 'NAME'];

    this.visitorsTableColumns2.forEach((item) => {
      if (item.SHOW == true) {
        this.visitorsTableColumns.push(item.INDEX);
      }
    });
  }
}
