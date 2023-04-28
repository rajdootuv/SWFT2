import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
 
import { FuseMediaWatcherService } from '@fuse/services/media-watcher/media-watcher.service';
import { MatSnackBar } from '@angular/material/snack-bar';
 
import { MatDialog, } from '@angular/material/dialog';
import { OrganizationData } from '../../setup.types';
import { Country } from 'app/modules/admin/contacts/contacts.types';



@Component({
  selector: 'app-addorganization',
  templateUrl: './addorganization.component.html',
  styleUrls: ['./addorganization.component.scss'],
  encapsulation: ViewEncapsulation.None,
})


export class AddorganizationComponent {

  @Input() DATA: OrganizationData = new OrganizationData();
  @Input() drawerClose: Function;
  @Input() countries: Country[] = [];

  isScreenSmall: boolean;
  oldvisitors: any[] = [];
  vendors: any[] = [];


  constructor( 
    private _changeDetectorRef: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    public dialog: MatDialog
  ) { }

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  ngOnInit(): void {
    // Subscribe to media changes
    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        // Check if the screen is small
        this.isScreenSmall = !matchingAliases.includes('md');
      });


    // this.getauthentication();
  }

  // getauthentication() {
  //   // Get the visitors
  //   this._inventoryService
  //       .getauthentication()
  //       .subscribe((data) => {
  //           // Update the brands
  //           console.log(data)
  //           this.oldvisitors = data
  //           console.log(this.oldvisitors)

  //           // Mark for check
  //           this._changeDetectorRef.markForCheck();
  //       });
  // }
  // @ViewChild('secondDialog', { static: true }) secondDialog: TemplateRef<any>;
  openDialog(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef);
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
  LATITUDE:any
  LONGITUDE:any

  addMarker2(event: any) {
    this.markerPositions = event.latLng.toJSON();
    this.latitude = this.markerPositions.lat;
    this.longitude = this.markerPositions.lng;

    this.LATITUDE = this.latitude.toString();
    this.LONGITUDE = this.longitude.toString();
  }

  googleMapPointer() {
    this.center = {
      lat: Number(this.LATITUDE),
      lng: Number(this.LONGITUDE),
    };
    this.markerPositions = {
      lat: Number(this.LATITUDE),
      lng: Number(this.LONGITUDE),
    };
  }




  closeDrawer(): void {
    this.drawerClose();
    this._changeDetectorRef.markForCheck();
  }

  // closeDrawer( form:NgForm): void {
  //   this.resetDrawer(form);
  //   form.form.reset();
  //   this._changeDetectorRef.markForCheck();
  // }

  // resetDrawer(form: NgForm) {
  //   // form.form.reset();
  //   this.DATA = new OrganizationData();
  //   form.form.markAsPristine();
  //   form.form.markAsUntouched();
  //   form.form.valid
  // }

  openSnackBar(msg: string, type) {
    this._snackBar.open(msg, '', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 3000,
      panelClass: type == 'E' ? 'style-error' : 'style-success',
    });
  }

  // Save(){}

  Save(): void {
    var isOk = true;
    if (
      this.DATA.NAME == undefined ||
      this.DATA.NAME == null ||
      this.DATA.NAME.toString().trim() == ''
    ) {
      isOk = false;
      this.openSnackBar('Please Enter Name', 'E');
    } else if (
      this.DATA.WEBSITE == undefined ||
      this.DATA.WEBSITE == null ||
      this.DATA.WEBSITE.trim == ''
    ) {
      isOk = false;
      this.openSnackBar('Please enter Website', 'E');
    } else if (
      this.DATA.BILLING_INFORMATION_ID == undefined ||
      this.DATA.BILLING_INFORMATION_ID == null ||
      this.DATA.BILLING_INFORMATION_ID == 0
    ) {
      isOk = false;
      this.openSnackBar('Please select Billing Information', 'E');
    } else if (
      this.DATA.ADDRESS_LINE_1 == undefined ||
      this.DATA.ADDRESS_LINE_1 == null ||
      this.DATA.ADDRESS_LINE_1 == ''
    ) {
      isOk = false;
      this.openSnackBar('Please Enter Address line 1 ', 'E');
    } else if (
      this.DATA.CITY == undefined ||
      this.DATA.CITY == null ||
      this.DATA.CITY == ''
    ) {
      isOk = false;
      this.openSnackBar('Please enter City', 'E');
    } else if (
      this.DATA.COUNTRY == undefined ||
      this.DATA.COUNTRY == null ||
      this.DATA.COUNTRY < 0
    ) {
      isOk = false;
      this.openSnackBar('Please select Country ', 'E');
    } else if (
      this.DATA.STATE == undefined ||
      this.DATA.STATE == null ||
      this.DATA.STATE == ''
    ) {
      isOk = false;
      this.openSnackBar('Please select State', 'E');

    } else if (
      this.DATA.PRN == undefined ||
      this.DATA.PRN == null ||
      this.DATA.PRN == ''
    ) {
      isOk = false;
      this.openSnackBar('Please Enter PRN/ZIP', 'E');

    } else if (
      this.DATA.BillingADDRESS_LINE_1 == undefined ||
      this.DATA.BillingADDRESS_LINE_1 == null ||
      this.DATA.BillingADDRESS_LINE_1 == ''
    ) {
      isOk = false;
      this.openSnackBar('Please Enter Address line 1 ', 'E');
    } else if (
      this.DATA.BillingCITY == undefined ||
      this.DATA.BillingCITY == null ||
      this.DATA.BillingCITY == ''
    ) {
      isOk = false;
      this.openSnackBar('Please enter City', 'E');
    } else if (
      this.DATA.BillingCOUNTRY == undefined ||
      this.DATA.BillingCOUNTRY == null ||
      this.DATA.BillingCOUNTRY < 0
    ) {
      isOk = false;
      this.openSnackBar('Please select Country ', 'E');
    } else if (
      this.DATA.BillingSTATE == undefined ||
      this.DATA.BillingSTATE == null ||
      this.DATA.BillingSTATE == ''
    ) {
      isOk = false;
      this.openSnackBar('Please select State', 'E');

    } else if (
      this.DATA.BillingPRN == undefined ||
      this.DATA.BillingPRN == null ||
      this.DATA.BillingPRN == ''
    ) {
      isOk = false;
      this.openSnackBar('Please Enter PRN/ZIP', 'E');
    }

    if (isOk) {
      this.openSnackBar('Information saved successfully', 'S');
      this.drawerClose();
      this._changeDetectorRef.markForCheck();

      // this.openSnackBar('Failed to saved information', 'E');
    }

    // Update the contact on the server

  }


}
