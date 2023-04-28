// import { Component } from '@angular/core';
// { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
// import { AuthenticationPagination, userMaster, ActiveUsers } from 'app/demo/listvender/manage-venders';
// import { ExampleModule } from './example.module';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { UntypedFormControl } from '@angular/forms'; 
import { debounceTime, map, Observable, merge, Subject, switchMap, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core'; 
import { ActiveUsers, loginActivityPagination } from '../loginativity.type';
import { LoginService } from '../loginactivity.service';

@Component({
  selector: 'app-activeuser',
  templateUrl: './activeuser.component.html',
  styleUrls: ['./activeuser.component.scss']
})
export class ActiveuserComponent {

  isChecked: boolean = false;
  hidePassword: boolean = false;
  ELEMENT_DATA = [];
  USERINFO: ActiveUsers = new ActiveUsers();
  drawerMode: 'over' | 'side' = 'side';
  showFiller = true;
  show_drawer = true;
  index = "";
  oldactiveUsers: ActiveUsers[] = [];
  showMultiSelect = false;
  activeUsers$: Observable<ActiveUsers[]>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  @ViewChild(MatSort) private _sort: MatSort;
  @ViewChild(MatPaginator) private _paginator: MatPaginator;

  // floors$: Observable<Floors[]>;
  recentTransactionsDataSource: MatTableDataSource<any> =
    new MatTableDataSource();




  drawerOpened1 = false;
  isScreenSmall1 = true;

  toggleDrawerMode1(): void {
    this.drawerMode = this.drawerMode === 'side' ? 'over' : 'side';
  }



  displayedColumns: string[] = ['select', 'action', 'NAME', 'BaseUrl', 'AuthenticationHeader', 'Method', 'Body',];
 
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  selection = new SelectionModel<ActiveUsers>(true, []);



  constructor(private _liveAnnouncer: LiveAnnouncer, private _changeDetectorRef: ChangeDetectorRef, private _inventoryService: LoginService, private _snackBar: MatSnackBar) { };
  // Rajddoot sir
  ngOnInit(): void {

    // Get the activeUsers
    this.activeUsers$ = this._inventoryService.activeUsers$;
    this.activeUsers$.subscribe((data) => {
      console.log(data);
      this.dataSource.data = data;
    });

    // Get the activeUsers
    this._inventoryService
      .getActiveUsers()
      .subscribe((data) => {
        console.log(data);
        this.oldactiveUsers = data.activeUsers;

        this._changeDetectorRef.markForCheck();
      });


    // Subscribe to search input field value changes
    this.searchInputControl.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        switchMap((query) => {
          this.isLoading = true;
          return this._inventoryService.getActiveUsers(
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



    // // Get the pagination
    // this._inventoryService.pagination$
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe((pagination: AuthenticationPagination) => {
    //     // Update the pagination
    //     this.pagination = pagination;

    //     // Mark for check
    //     this._changeDetectorRef.markForCheck();
    //   });

    // Get the pagination
    this._inventoryService.pagination$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagination: loginActivityPagination) => {
        // Update the pagination
        this.pagination = pagination;

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });

  }



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

      // Get activeUsers if sort or page changes
      merge(this._sort.sortChange, this._paginator.page)
        .pipe(
          switchMap(() => {
            this.isLoading = true;
            return this._inventoryService.getActiveUsers(
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


  isLoading: boolean = false;
  searchInputControl: UntypedFormControl = new UntypedFormControl();


  pagination: loginActivityPagination;

  trackByFn(index: number, item: any): any {
    return item.ID || index;
  }

  customerTableColumns2 = [
    { NAME: 'Name', INDEX: 'FULL_NAME', SHOW: true },
    { NAME: 'Active Since', INDEX: 'ACTIVE_SINCE', SHOW: true },
    { NAME: 'Location.', INDEX: 'LOCATION', SHOW: true },
    { NAME: 'Ip Address', INDEX: 'IP_ADDRESS', SHOW: true },
    { NAME: 'Device', INDEX: 'DEVICE', SHOW: true },

  ];

  customerTableColumns: string[] = [
    'checkbox',
    'ACTION',
    'FULL_NAME',
    'ACTIVE_SINCE',
    'IP_ADDRESS',
    'DEVICE'
  ];
  updateAllComplete(event, i) {
    this.customerTableColumns2[i].SHOW = event;
    this.customerTableColumns = ['checkbox', 'ACTION'];

    this.customerTableColumns2.forEach((item) => {
      if (item.SHOW == true) {
        this.customerTableColumns.push(item.INDEX);
      }
    });
  }


  visitorDrawerClose(): void {
    this._changeDetectorRef.markForCheck();
    var d = document.getElementById('closeDrawer') as HTMLElement;
    d.click();
    console.log('hee');
  }
  // End Rajddoot sir
  rowsSelected = 0;
  /****Show SnackBar ******/
  openSnackBar(msg: string, type) {
    this._snackBar.open(msg, '', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 3000,
      panelClass: type == 'E' ? 'style-error' : 'style-success',
    });
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



  editSelection() {
    this.openSnackBar('Selected rows edited successfully', 'S');
    this.removeSelection();
    //this.selection.selected


  }


  deleteSelection() {
    this.openSnackBar('Selected rows deleted successfully', 'S');
    this.removeSelection();
    //this.selection.selected

  }


  showMultiBox() {
    this.rowsSelected = this.selection.selected.length;
    if (this.rowsSelected > 0) this.showMultiSelect = true;
    else this.showMultiSelect = false;
  }


  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }


  // toggleAllRows() {
  //   if (this.isAllSelected()) {
  //     this.selection.clear();
  //     this.showMultiSelect = false;
  //     this.rowsSelected = 0;
  //     return;
  //   }
  //   console.log(this.selection.selected.length);



  //   this.selection.select(...this.recentTransactionsDataSource.data);
  //   if (this.selection.selected.length > 0) {
  //     this.showMultiSelect = true;
  //     this.rowsSelected = this.selection.selected.length;
  //   }
  // }


  checkboxLabel(row): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.ID + 1}`;
  }


  // detailsDrawerOpen(): void {
  //   this.drawerOpened1 = !this.drawerOpened1;
  // }



//   toggleAllRows() {
//     if (this.isAllSelected()) {
//         this.selection.clear();
//         return;
//     }

//     this.selection.select(...this.recentTransactionsDataSource.data);
// }


toggleAllRows() {
  if (this.isAllSelected()) {
    this.selection.clear();
    return;
  }

  this.selection.select(...this.dataSource.data);
}


}
