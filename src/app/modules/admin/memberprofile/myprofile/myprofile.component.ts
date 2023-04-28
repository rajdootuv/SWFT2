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
  from,
  map,
  merge,
  Observable,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
// import { AuthenticationService } from '../../authentications/authentications.service';

import { MatSort } from '@angular/material/sort';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher/media-watcher.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MemberProfileService } from '../memberprofile.service';
import { Memberprofiledata, MemberprofilePagination } from '../memberprofile.type';
import { cloneDeep } from 'lodash-es';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.scss']
})
export class MyprofileComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoading: boolean = false
  yearlyBilling: boolean = true
  Customer: boolean = true
  Vender: boolean = false
  Talent: boolean = false
  Model: boolean = false
  addorganization = []
  pagination: MemberprofilePagination;


  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;
  
  isScreenSmall: boolean;
  Memberprofiledata$: Observable<Memberprofiledata[]>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  recentTransactionsDataSource: MatTableDataSource<any> =
    new MatTableDataSource();
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  oldlogindatadata: Memberprofiledata[] = [];

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,
    private _inventoryService: MemberProfileService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    // private _contactsService: ContactsService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }


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
            .subscribe((pagination: MemberprofilePagination) => {
                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });


        // Get the visitors
        this.Memberprofiledata$ = this._inventoryService.organization$;
        this.Memberprofiledata$.subscribe((data) => {
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
                this.oldlogindatadata = data.organization;
                console.log(this.oldlogindatadata, 'this.oldorganizationdata')
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
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }


  get organizationDrawerCloseCallback() {
    return this.organizationdrawer.bind(this);
  }


  organizationdrawer(): void {
    this._changeDetectorRef.markForCheck();
    var d = document.getElementById('closeDrawer') as HTMLElement;
    d.click();
    console.log('hee');
  }



  edit() {

  }
  customer() {
    this.Customer = true
    this.Vender = false
    this.Talent = false
    this.Model = false
  }

  vender() {
    this.Customer = false
    this.Vender = true
    this.Talent = false
    this.Model = false
  }

  talent() {
    this.Customer = false
    this.Vender = false
    this.Talent = true
    this.Model = false
  }

  model() {
    this.Customer = false
    this.Vender = false
    this.Talent = false
    this.Model = true
  }
}
