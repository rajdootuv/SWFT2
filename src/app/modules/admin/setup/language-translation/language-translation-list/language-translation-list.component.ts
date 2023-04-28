import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  Observable, Subject, debounceTime, map, merge,
  of,
  switchMap, takeUntil
} from 'rxjs'; 
import { UntypedFormControl } from '@angular/forms'; 
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AuthenticationPagination } from 'app/modules/admin/authentications/authentications.types'; 
import { LanguageTranslation } from '../../setup.types';
import { SetupService } from '../../setup.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-language-translation-list',
  templateUrl: './language-translation-list.component.html',
  styleUrls: ['./language-translation-list.component.scss'],  
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations,
})
export class LanguageTranslationListComponent {
  @ViewChild(MatSort) private _sort: MatSort;
  @ViewChild(MatPaginator) private _paginator: MatPaginator;

  recentTransactionsDataSource: MatTableDataSource<any> = new MatTableDataSource();
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  selection = new SelectionModel<LanguageTranslation>(true, []);
  selectedLanguage: LanguageTranslation | null = new LanguageTranslation();

  pagination: AuthenticationPagination;
  languageTranslations$: Observable<LanguageTranslation[]>;
  isLoading: boolean = false;
  isScreenSmall: boolean;

  showMultiSelect = false;
  rowsSelected = 0;
  deleteShow = false;
  selectLanguage = ['Marathi', 'Hindi', 'Gujarati', 'Kashmiri',]

  selectedLanguage2 = ''
  languageTableColumns: string[] = [
    'checkbox',
    'SRNO',
    'KEYWORD',
    'ENGLISH',
    'LANG1',
    'LANG2',
    'LANG3',
    'LANG4'

  ];

  languageTableColumns2 = [
    { NAME: 'Lang1', INDEX: 'LANG1', SHOW: true },
    { NAME: 'Lang2', INDEX: 'LANG2', SHOW: true },
    { NAME: 'Lang3', INDEX: 'LANG3', SHOW: true },
    { NAME: 'Lang4', INDEX: 'LANG4', SHOW: true },
  ];

  constructor(private _inventoryService: SetupService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    private _fuseMediaWatcherService: FuseMediaWatcherService,

  ) { }

  // LTarray = [];
  // LanguageSelected(event) {
  //   console.log(event);
  //   this.LTarray = event
  //   this.languageTableColumns = [...this.languageTableColumns, ...event];
  //   console.log("column", this.languageTableColumns);
  // }

  // function of column filter 
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.recentTransactionsDataSource.filter = filterValue.trim().toLowerCase();
  }

  res: Observable<null | string> = of(null);
  loadingPercent = 50;
  intervalId = {} as any;

  progressInLoading() {
    if (this.loadingPercent === 100) {
      clearInterval(this.intervalId);
      this.res = of("Item Loaded");
    }
    console.log('Loading: ' + this.loadingPercent + '%');
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
    this.languageTranslations$ = this._inventoryService.languageTranslations$;
    this.languageTranslations$.subscribe((data) => {
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
          return this._inventoryService.getLanguageTranslations(
            0,
            10,
            'ENGLISH',
            'asc',
            query
          );
        }),
        map(() => {
          this.isLoading = false;
        })
      )
      .subscribe();

    // method of  column filter with particular column declaration
    // column filter 1
    this.recentTransactionsDataSource.filterPredicate = function (record, filter) {
      return record.ENGLISH.toLocaleLowerCase() == filter.toLocaleLowerCase();
    }

    // column filter 2
    this.recentTransactionsDataSource.filterPredicate = function (record, filter) {
      return record.LANG1.toLocaleLowerCase() == filter.toLocaleLowerCase();
    }

    // column filter 3
    this.recentTransactionsDataSource.filterPredicate = function (record, filter) {
      return record.LANG2.toLocaleLowerCase() == filter.toLocaleLowerCase();
    }

    // column filter 4
    this.recentTransactionsDataSource.filterPredicate = function (record, filter) {
      return record.LANG3.toLocaleLowerCase() == filter.toLocaleLowerCase();
    }

    // column filter 5
    this.recentTransactionsDataSource.filterPredicate = function (record, filter) {
      return record.LANG4.toLocaleLowerCase() == filter.toLocaleLowerCase();
    }

  }

  /**
   * After view init
   */
  ngAfterViewInit(): void {
    if (this._sort && this._paginator) {
      // Set the initial sort
      this._sort.sort({
        id: 'ENGLISH',
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
            return this._inventoryService.getLanguageTranslations(
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
    this.languageTableColumns = ['checkbox', 'SRNO', 'KEYWORD', 'ENGLISH'];

    this.languageTableColumns2.forEach((item) => {
      if (item.SHOW == true) {
        this.languageTableColumns.push(item.INDEX);
      }
    });
  }

  /**
 * Track by function for ngFor loops
 *
  @param index
  @param item
 
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: LanguageTranslation): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.ID + 1
      }`;
  }

  trackByFn(index: number, item: any): any {
    return item.ID || index;
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

}
