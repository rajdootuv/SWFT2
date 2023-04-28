import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  Observable, Subject, debounceTime, map, merge,
  switchMap, takeUntil
} from 'rxjs'; 
import { UntypedFormControl } from '@angular/forms'; 
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AuthenticationService } from 'app/modules/admin/authentications/authentications.service';
import { AuthenticationPagination } from 'app/modules/admin/authentications/authentications.types';
 
import { Language } from '../../setup.types';
import { SetupService } from '../../setup.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-languagemaster',
  templateUrl: './languagemaster.component.html',
  styleUrls: ['./languagemaster.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations,
})
export class LanguagemasterComponent {
  @ViewChild(MatSort) private _sort: MatSort;
  @ViewChild(MatPaginator) private _paginator: MatPaginator;

  recentTransactionsDataSource: MatTableDataSource<any> = new MatTableDataSource();
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  selection = new SelectionModel<Language>(true, []);
  selectedLanguage: Language | null = new Language();
  language: Language | null = new Language();
  newLanguages: Language = new Language();
  pagination: AuthenticationPagination;
  languages$: Observable<Language[]>;
  language$: Observable<Language[]>;
  oldLanguages: Language[] = [];
  isLoading: boolean = false;
  isScreenSmall: boolean;
  answer: number = null;
  showMultiSelect = false;
  rowsSelected = 0;
  deleteShow = false;
  editable: boolean = true;

  value = Math.floor(10 * Math.random());
  value2 = Math.floor(10 * Math.random());
  oldlanguages2 = ['Maharashtra', 'Karnataka', 'Uttar Pradesh', 'Assam', 'Goa'];

  languageTableColumns: string[] = [
    'checkbox',
    'ACTION',
    'NAME',
    'CODE',
    'IS_DIALECT',
    'DIALECT_OF',
  ];

  languageTableColumns2 = [
    // { NAME: 'Name', INDEX: 'NAME', SHOW: true },
    { NAME: 'Code', INDEX: 'CODE', SHOW: true },
    { NAME: 'Is Dialect', INDEX: 'IS_DIALECT', SHOW: true },
    { NAME: 'Dialect Of', INDEX: 'DIALECT_OF', SHOW: true },
  ];

  constructor(private _inventoryService: SetupService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    private _fuseMediaWatcherService: FuseMediaWatcherService,

  ) { }

  // function of column filter 
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.recentTransactionsDataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {

    // Get the pagination
    this._inventoryService.pagination$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagination: AuthenticationPagination) => {
        // Update the pagination
        this.pagination = pagination;

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });

    // Get the languages
    this.languages$ = this._inventoryService.languages$;
    this.languages$.subscribe((data) => {
      console.log(data);
      this.recentTransactionsDataSource.data = data;
    });


    // Subscribe to search input field value changes
    this.searchInputControl.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        switchMap((query) => {
          this.isLoading = true;
          return this._inventoryService.getLanguage(
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

    // Get the languages
    this._inventoryService
      .getLanguage(undefined, undefined, 'NAME', 'asc', undefined)
      .subscribe((data) => {
        // Update the brands
        this.oldLanguages = data.language;

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });



    // method of  column filter with particular column declaration
    // column filter 1
    this.recentTransactionsDataSource.filterPredicate = function (record, filter) {
      return record.NAME.toLocaleLowerCase() == filter.toLocaleLowerCase();
    }

    // column filter 2
    this.recentTransactionsDataSource.filterPredicate = function (record, filter) {
      return record.CODE.toLocaleLowerCase() == filter.toLocaleLowerCase();
    }

    // column filter 3
    this.recentTransactionsDataSource.filterPredicate = function (record, filter) {
      return record.DIALECT_OF.toLocaleLowerCase() == filter.toLocaleLowerCase();
    }
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

      // Get Languages if sort or page changes
      merge(this._sort.sortChange, this._paginator.page)
        .pipe(
          switchMap(() => {
            this.isLoading = true;
            return this._inventoryService.getLanguage(
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

  add() {
    this.language = new Language();
  }

  edit(data: Language) {
    this.newLanguages = data;
  }


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

  updateAllComplete(event, i) {
    this.languageTableColumns2[i].SHOW = event;
    this.languageTableColumns = ['checkbox', 'ACTION', 'NAME'];

    this.languageTableColumns2.forEach((item) => {
      if (item.SHOW == true) {
        this.languageTableColumns.push(item.INDEX);
      }
    });
  }

  languageDrawerClose(): void {
    this._changeDetectorRef.markForCheck();
    var d = document.getElementById('closeDrawer') as HTMLElement;
    d.click();
    // console.log('hee');
  }

  get languageDrawerCloseCallback() {
    return this.languageDrawerClose.bind(this);
  }

  /**
 * Track by function for ngFor loops
 *
  @param index
  @param item
 
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Language): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.ID + 1
      }`;
  }

  trackByFn(index: number, item: any): any {
    return item.ID || index;
  }

  getOldLanguages() {
    // Get the languages
    this._inventoryService
      .getLanguage(undefined, undefined, 'NAME', 'asc', undefined)
      .subscribe((data) => {
        // Update the brands
        this.oldLanguages = data.language;

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });
  }

  newlanguageDrawerClose(): void {
    this._changeDetectorRef.markForCheck();
    this.getOldLanguages();

    var d = document.getElementById('closenewLanguageDrawer') as HTMLElement;
    console.log('fff', d);
    d.click();
  }

  get newlanguageDrawerCloseCallback() {
    return this.newlanguageDrawerClose.bind(this);
  }

  languageDrawerClose3(): void {
    this._changeDetectorRef.markForCheck();
    var d = document.getElementById('closeDrawer3') as HTMLElement;
    d.click();
  }

  get languageDrawer3CloseCallback() {
    return this.languageDrawerClose3.bind(this);
  }

  details(data: Language) {
    this.selectedLanguage = data;
    this.deleteShow = false;
  }

  detailsDelete(data: Language) {
    this.selectedLanguage = data;
    this.deleteShow = true;
    this.answer = null;
    this.value = Math.floor(10 * Math.random());
    this.value2 = Math.floor(10 * Math.random());
  }

  languageDrawer2Close(): void {
    this._changeDetectorRef.markForCheck();
    var d = document.getElementById('closeDrawer2') as HTMLElement;
    d.click();
  }

  get languageDrawer2CloseCallback() {
    return this.languageDrawer2Close.bind(this);
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

}
