import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
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
import { AuthenticationService } from '../../authentications.service';
import {
  Visitors,
  AuthenticationPagination,
  AuthenticationVendor,
  Visits,
  Users,
} from '../../authentications.types';
import { MatSort } from '@angular/material/sort';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher/media-watcher.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactsService } from 'app/modules/admin/contacts/contacts.service';
import { Country } from 'app/modules/admin/contacts/contacts.types';


@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss']
})
export class DeleteUserComponent implements OnInit {
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;
  @Input() selectedUser : Users;
  users$: Observable<Users[]>;
  visits$: Observable<Visits[]>;
  recentTransactionsDataSource: MatTableDataSource<any> = new MatTableDataSource();
  visitsDataSource: MatTableDataSource<any> = new MatTableDataSource();
  usersTableColumns: string[] = [
      'checkbox',
      'ACTION',
      'NAME',
      'EMAIL_ID',
      'MOBILE_NO',
      'DOB',
      'USER_TYPE',
  ];
  visitorsTableColumns2 = [
      { NAME: 'Email Id', INDEX: 'EMAIL_ID', SHOW: true },
      { NAME: 'Mobile No.', INDEX: 'MOBILE_NO', SHOW: true },
      { NAME: 'Birth Date', INDEX: 'DOB', SHOW: true },
      { NAME: 'User Type', INDEX: 'USER_TYPE', SHOW: true },
  ];
  
  flashMessage: 'success' | 'error' | null = null;
  isLoading: boolean = false;
  pagination: AuthenticationPagination;
  pagination2: AuthenticationPagination;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
//   selectedUser: Users | null = new Users();
  visits: Visits | null = new Visits();
  visitsLogs: Visits[] = [];
  selectedVisitorForm: UntypedFormGroup;
  tagsEditMode: boolean = false;
  vendors: AuthenticationVendor[];
  drawerOpened = false;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  isScreenSmall: boolean;
  deleteShow = false;
  step = 0;
  oldvisitors: Users[] = [];
  checkedAll = false;
  indeterminate = false;
  selection = new SelectionModel<Visitors>(true, []);
  countries: Country[] = [];
  answer: number = null;
  value = Math.floor(10 * Math.random());
  value2 = Math.floor(10 * Math.random());
  selectedCols = false;
  hide = true;
  hide1 = true;
  is_ChooseOptions = false;
  Type_of_User = ['admin', 'super admin', 'regular'];
  Type_of_UserBelongs = ['admin', 'super admin', 'regular'];
  numSelected = 0;
  /**
   * Constructor
   */
  constructor(
      private _changeDetectorRef: ChangeDetectorRef,
      private _fuseConfirmationService: FuseConfirmationService,
      private _inventoryService: AuthenticationService,
      private _fuseMediaWatcherService: FuseMediaWatcherService,
      private _contactsService: ContactsService,
      private _snackBar: MatSnackBar
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
      const numSelect = this.selection.selected.length;
    //   console.log(numSelect , 'numselected');
      this.numSelected = numSelect;
      
      const numRows = this.recentTransactionsDataSource.data.length;
    //   console.log(numRows , 'rows');
      
      return numSelect === numRows;
  }

  removeSelect(){
    this.selection.clear();
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
      if (this.isAllSelected()) {
          this.selection.clear();
          return;
      }

      this.selection.select(...this.recentTransactionsDataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Visitors): string {
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

      // Get the user












      
      this.users$ = this._inventoryService.users$;
      this.users$.subscribe((data) => {
          this.recentTransactionsDataSource.data = data;
          console.log(this.recentTransactionsDataSource, 'users');

      });

      // Get the vendors
      this._inventoryService
          .getVendors()
          .subscribe((vendors: AuthenticationVendor[]) => {
              // Update the vendors
              this.vendors = vendors;

              // Mark for check
              this._changeDetectorRef.markForCheck();
          });

      // Subscribe to search input field value changes
      this.searchInputControl.valueChanges
          .pipe(
              takeUntil(this._unsubscribeAll),
              debounceTime(300),
              switchMap((query) => {
                  this.isLoading = true;
                  return this._inventoryService.getUsers(
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

      // Get the user
      this._inventoryService
          .getUsers(undefined, undefined, 'NAME', 'asc', undefined)
          .subscribe((data) => {
            console.log(data , 'get users adaata');
            
              // Update the brands
              this.oldvisitors = data.users;

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

          // Get visitors if sort or page changes
          merge(this._sort.sortChange, this._paginator.page)
              .pipe(
                  switchMap(() => {
                      this.isLoading = true;
                      return this._inventoryService.getUsers(
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

  /**
   * Delete the selected product using the form data
   */
//   deleteSelectedVisitor(): void {
//       // Open the confirmation dialog
//       const confirmation = this._fuseConfirmationService.open({
//           title: 'Delete product',
//           message:
//               'Are you sure you want to remove this product? This action cannot be undone!',
//           actions: {
//               confirm: {
//                   label: 'Delete',
//               },
//           },
//       });

//       // Subscribe to the confirmation dialog closed action
//       confirmation.afterClosed().subscribe((result) => {
//           // If the confirm button pressed...
//           if (result === 'confirmed') {
//               // Get the product object
//               const product = this.selectedVisitorForm.getRawValue();

//               // Delete the product on the server
//               this._inventoryService
//                   .deleteVisitor(product.ID)
//                   .subscribe(() => {});
//           }
//       });
//   }

  /**
   * Show flash message
   */
//   showFlashMessage(type: 'success' | 'error'): void {
//       // Show the message
//       this.flashMessage = type;

//       // Mark for check
//       this._changeDetectorRef.markForCheck();

//       // Hide it after 3 seconds
//       setTimeout(() => {
//           this.flashMessage = null;

//           // Mark for check
//           this._changeDetectorRef.markForCheck();
//       }, 3000);
//   }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
      return item.ID || index;
  }

  edit(data: Users) {
      this.newvisitor = data;
      console.log(this.newvisitor);
      
      // this.selectedVisitor.DATE_OF_VISIT = new Date(data.DATE_OF_VISIT);
  }

  add() {
      this.visits = new Visits();
      this.visits.DATE_OF_VISIT = new Date();
  }

  visitorDrawerClose(): void {
      this._changeDetectorRef.markForCheck();
      var d = document.getElementById('closeDrawer') as HTMLElement;
      d.click();
      console.log('hee');
  }

  get visitorDrawerCloseCallback() {
      return this.visitorDrawerClose.bind(this);
  }


//   user details method 
  details(data: Users) {
      this.selectedUser = data;
      this.deleteShow = false;
      // this.selectedVisitor.DATE_OF_VISIT = new Date(data.DATE_OF_VISIT);
  }

//   delete user details 

  detailsDelete(data: Users,) {
      this.selectedUser = data;
      this.deleteShow = true;
      this.answer = null;
      this.value = Math.floor(10 * Math.random());
      this.value2 = Math.floor(10 * Math.random());
      // this.selectedVisitor.DATE_OF_VISIT = new Date(data.DATE_OF_VISIT);
  }

//   related into delete method 
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

  visitorDrawer2Close(): void {
      this._changeDetectorRef.markForCheck();
      var d = document.getElementById('closeDrawer2') as HTMLElement;
      d.click();
  }

  get visitorDrawer2CloseCallback() {
      return this.visitorDrawer2Close.bind(this);
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

  newvisitor: Users = new Users();

//   add User button 
addUser() {
      this.newvisitor = new Users();
      console.log(this.newvisitor);
      
  }


//   new visitor drawer 
  newvisitorDrawerClose(): void {
      this._changeDetectorRef.markForCheck();
      this.getOldVisitors();

      var d = document.getElementById('closenewvisitorDrawer') as HTMLElement;
      d.click();
  }

  get newvisitorDrawerCloseCallback() {
      return this.newvisitorDrawerClose.bind(this);
  }

//   viewVisitorLogs(data: Users) {
//       this.selectedVisitor = data;

//       this._inventoryService
//           .getVisits(
//               undefined,
//               undefined,
//               undefined,
//               undefined,
//               undefined,
//               data.ID
//           )
//           .subscribe((data2) => {
//               // Update the brands
//               console.log(data2);
//               this.visitsLogs = [...[], ...data2.visits];
//               this.pagination2 = data2.pagination;
//               this.visitsDataSource.data = this.visitsLogs;
//               var d = document.getElementById(
//                   'openvisitDrawer'
//               ) as HTMLElement;
//               d.click();
//               // Mark for check
//               this._changeDetectorRef.markForCheck();
//           });
//   }

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
          .getVisitors(undefined, undefined, 'NAME', 'asc', undefined)
          .subscribe((data) => {
            console.log(data , 'oldvisitors');
            
              // Update the brands
            //   this.oldvisitors = data.visitors;

              // Mark for check
              this._changeDetectorRef.markForCheck();
          });
  }


//   checkbox update 

  updateAllComplete(event, i) {
    console.log(event , 'menus');
    
      this.visitorsTableColumns2[i].SHOW = event;
      this.usersTableColumns = ['checkbox', 'ACTION', 'NAME'];

      this.visitorsTableColumns2.forEach((item) => {
          if (item.SHOW == true) {
              this.usersTableColumns.push(item.INDEX);
          }
      });
  }



// for remove images 

    removeAvatar() {
    // this.contact.avatar = null; // set the avatar to null to remove the current image
    const img: HTMLImageElement = document.getElementById('avatar-preview') as HTMLImageElement;
    img.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhdbyLuigk_nkMr3nDCb0j0zYexX2Pm6Iz-DAg9TMFC7BdtD954OvPXkoeMSVs7IfcMxM&usqp=CAU';

  }

// for add images 

  previewImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const img: HTMLImageElement = document.getElementById('avatar-preview') as HTMLImageElement;
      img.src = reader.result as string;
      let src1 = img.src;
      console.log(src1);



    };
    reader.readAsDataURL(file);

    this.is_ChooseOptions = false;
  }
}
