


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
import { FuseConfirmationService } from '@fuse/services/confirmation';


import { MatSort } from '@angular/material/sort';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher/media-watcher.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

import { ContactsService } from 'app/modules/admin/contacts/contacts.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmailSettingData, EmailSettingPagination } from './../../setting.type';;
import { SettingService } from './../../setting.service';

@Component({
  selector: 'app-emailsettinglist',
  templateUrl: './emailsettinglist.component.html',
  styleUrls: ['./emailsettinglist.component.scss']
})
export class EmailsettinglistComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,
    private _inventoryService: SettingService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _contactsService: ContactsService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }
  isLoading: boolean = false;

  searchInputControl: UntypedFormControl = new UntypedFormControl();
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;
  emailsetting$: Observable<EmailSettingData[]>;
  addemailsetting: EmailSettingData | null = new EmailSettingData();
  recentTransactionsDataSource: MatTableDataSource<any> =
    new MatTableDataSource();


  showFilterBox = false;

  emailsettingTableColumns: string[] = ['checkbox', 'ACTION', 'NAME', 'EMAIL_PROVIDER', 'EMAIL', 'OWNER'];
  emailsettingTableColumns2 = [
    { NAME: 'Name', INDEX: 'NAME', SHOW: true },
    { NAME: 'Email Provider', INDEX: 'EMAIL_PROVIDER', SHOW: true },
    { NAME: 'Email', INDEX: 'EMAIL', SHOW: true },
    { NAME: 'Owner', INDEX: 'OWNER', SHOW: true },
  ];
  private _unsubscribeAll: Subject<any> = new Subject<any>();


  trackByFn(index: number, item: any): any {
    return item.ID || index;
  }

  flashMessage: 'success' | 'error' | null = null;
  pagination: EmailSettingPagination;
  pagination2: EmailSettingPagination;
  selectedemailsetting: EmailSettingData | null = new EmailSettingData();

  // EmailSettingData : Visits | null = new Visits();
  selectedVisitorForm: UntypedFormGroup;
  tagsEditMode: boolean = false;
  vendors: any[];
  drawerOpened = false;
  // private _unsubscribeAll: Subject<any> = new Subject<any>();
  isScreenSmall: boolean;
  deleteShow = false;
  step = 0;
  oldvisitors: EmailSettingData[] = [];
  countries = [];
  checkedAll = false;
  indeterminate = false;
  selection = new SelectionModel<EmailSettingData>(true, []);
  // countries: Country[] = [];
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

  filterList: any[] = [];
  operators: string[] = ['AND', 'OR'];
  Select_columnName: string[] = ['NAME', 'EMAIL_PROVIDER', 'EMAIL', 'OWNER']
  comparisons: string[] = ['=', '!=', '<', '>', '<=', '>='];
  selectedColumn: string = '';
  selectedComparison: string = '';
  selectedValue: string = '';
  selectedOperator: string = 'AND';
  filterListOperators: string[] = [];
  showMultiBox() {
    this.rowsSelected = this.selection.selected.length;
    if (this.rowsSelected > 0) this.showMultiSelect = true;
    else this.showMultiSelect = false;
  }



  details(property: EmailSettingData) {
    this.selectedemailsetting = property;
    this.deleteShow = false;
    // this.selectedemailsetting.DATE_OF_VISIT = new Date(data.DATE_OF_VISIT);
  }

  detailsDelete(data: EmailSettingData) {
    this.selectedemailsetting = data;
    this.deleteShow = true;
    this.answer = null;
    this.value = Math.floor(10 * Math.random());
    this.value2 = Math.floor(10 * Math.random());
    // this.selectedVisitor.DATE_OF_VISIT = new Date(data.DATE_OF_VISIT);
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
    this.addemailsetting = new EmailSettingData();

    console.log('click');
  }

  edit(property: EmailSettingData) {
    // this.Property = property;
    this.addemailsetting = Object.assign({}, property);
    console.log(this.addemailsetting)

    // this.selectedemailsetting.DATE_OF_VISIT = new Date(data.DATE_OF_VISIT);
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
      this.showMultiSelect = false;
      this.rowsSelected = 0;
      return;
    }

    this.selection.select(...this.recentTransactionsDataSource.data);
    this.selection.select(...this.recentTransactionsDataSource.data);
    if (this.selection.selected.length > 0) {
      this.showMultiSelect = true;
      this.rowsSelected = this.selection.selected.length;
    }

  }

  get EmailsettingDrawerCloseCallback() {
    return this.EmailsettingDrawer.bind(this);
  }

  EmailsettingDrawer(): void {
    this._changeDetectorRef.markForCheck();
    var d = document.getElementById('closeDrawer') as HTMLElement;
    d.click();
    console.log('hee');
  }

  checkboxLabel(row?: EmailSettingData): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.ID + 1
      }`;
  }

  newvisitor: EmailSettingData = new EmailSettingData();
  addVisitor() {
    this.newvisitor = new EmailSettingData();
  }


  openSnackBar(msg: string, type) {
    this._snackBar.open(msg, '', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 3000,
      panelClass: type == 'E' ? 'style-error' : 'style-success',
    });
  }

  //   visits: EmailSettingData = new EmailSettingData();
  Property: EmailSettingData | null = new EmailSettingData();







  // visitors$: Observable<Visitors[]>;
  // properties$: Observable<EmailSettingData[]>;
  emailsettingdata$: Observable<EmailSettingData[]>;




  // oldvisitors1: Visitors[] = [];
  oldorganizationdata: EmailSettingData[] = [];




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
      .subscribe((pagination: EmailSettingPagination) => {
        // Update the pagination
        this.pagination = pagination;

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });


    // Get the visitors
    this.emailsettingdata$ = this._inventoryService.emailsetting$;
    this.emailsettingdata$.subscribe((data) => {
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
          return this._inventoryService.getemailsettingdata(
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
      .getemailsettingdata(undefined, undefined, 'NAME', 'asc', undefined)
      .subscribe((data) => {
        // Update the brands
        this.oldorganizationdata = data.emailsetting;
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
            return this._inventoryService.getemailsettingdata(
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

  onMenuItemClick(event: MouseEvent) {
    // add your custom code to handle the menu item click here
    event.stopPropagation();
  }


  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  updateAllComplete(event, i) {
    this.emailsettingTableColumns2[i].SHOW = event;
    this.emailsettingTableColumns = ['checkbox', 'ACTION', 'NAME',];

    this.emailsettingTableColumns2.forEach((item) => {
      if (item.SHOW == true) {
        this.emailsettingTableColumns.push(item.INDEX);
      }
    });
  }

  /*******  Toggle Filter Box ***********/
  toggleFilterBox() {
    this.showFilterBox = !this.showFilterBox;
  }

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


  /*******  Delete sub filter***********/
  removeTagGroup(j: number, i: number) {
    this.filterList[j].tagList.splice(i, 1);
    this.filterList[j].tagList1.splice(i, 1);
    if (this.filterList[j].tagList1.length == 0) {
      this.filterListOperators.splice(j, 1);
      this.filterList.splice(j, 1);
    }
  }

}
