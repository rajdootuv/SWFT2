import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    ViewEncapsulation,
} from '@angular/core';
import {
    Subject,
    takeUntil,
} from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AuthenticationService } from '../../authentications.service';
import {
    Visitors,
    Customers,
} from '../../authentications.types';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher/media-watcher.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Country } from 'app/modules/admin/contacts/contacts.types';

@Component({
    selector: 'app-add-customer',
    templateUrl: './add-customer.component.html',
    styleUrls: ['./add-customer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class AddCustomerComponent {
    @Input() DATA: Customers = new Customers();
    @Input() drawerClose: Function;
    @Input() countries: Country[] = [];
    isScreenSmall: boolean;
    is_WhatsappNO = false;
    Type_of_User = ['admin', 'super admin', 'regular'];
    Countries_Name = [
        'India',
        'USA',
        'Canada',
        'Mexico',
        'Brazil',
        'Argentina',
        'France',
        'Germany',
        'Spain',
        'Italy',
        'China',
    ];
    statesInIndia = [
        'Andhra Pradesh',
        'Arunachal Pradesh',
        'Assam',
        'Bihar',
        'Chhattisgarh',
        'Goa',
        'Gujarat',
        'Haryana',
        'Himachal Pradesh',
        'Jharkhand',
        'Karnataka',
        'Kerala',
        'Madhya Pradesh',
        'Maharashtra',
        'Manipur',
        'Meghalaya',
        'Mizoram',
        'Nagaland',
        'Odisha',
        'Punjab',
        'Rajasthan',
        'Sikkim',
        'Tamil Nadu',
        'Telangana',
        'Tripura',
        'Uttarakhand',
        'Uttar Pradesh',
        'West Bengal',
    ];

    hide = true;
    hide1 = true;
    is_ChooseOptions = false;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    /**
     * Constructor
     */
    constructor(
        private _fuseConfirmationService: FuseConfirmationService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _snackBar: MatSnackBar,
        private _inventoryService: AuthenticationService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private dialog: MatDialog
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
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
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
     * Update the contact
     */
    Save(): void {
        var isOk = true;
        if (
            this.DATA.NAME == undefined ||
            this.DATA.NAME == null ||
            this.DATA.NAME == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Enter Full Name', 'E');
        } else if (
            this.DATA.COMPANEY_NAME == undefined ||
            this.DATA.COMPANEY_NAME == null ||
            this.DATA.COMPANEY_NAME == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Enter Companey Name', 'E');
        } else if (
            this.DATA.WEBSITE_URL == undefined ||
            this.DATA.WEBSITE_URL == null ||
            this.DATA.WEBSITE_URL == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Enter Website Url', 'E');
        }

        // else if (
        //     this.DATA.SOCIAL_MEDIA_URLS == undefined ||
        //     this.DATA.SOCIAL_MEDIA_URLS == null ||
        //     this.DATA.SOCIAL_MEDIA_URLS == ''
        // ) {
        //     isOk = false;
        //     this.openSnackBar('Please Enter Social Media Url', 'E');
        // }
        else if (
            this.DATA.TAX_NUMBER == undefined ||
            this.DATA.TAX_NUMBER == null ||
            this.DATA.TAX_NUMBER == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Enter Tax/vat Name', 'E');
        } else if (
            this.DATA.ADDRESS_LINE1 == undefined ||
            this.DATA.ADDRESS_LINE1 == null ||
            this.DATA.ADDRESS_LINE1 == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Enter Address Name', 'E');
        } else if (
            this.DATA.ADDRESS_LINE2 == undefined ||
            this.DATA.ADDRESS_LINE2 == null ||
            this.DATA.ADDRESS_LINE2 == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Enter Address Name', 'E');
        } else if (
            this.DATA.CITY == undefined ||
            this.DATA.CITY == null ||
            this.DATA.CITY == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Enter City Name', 'E');
        } else if (
            this.DATA.COUNTRY == undefined ||
            this.DATA.COUNTRY == null ||
            this.DATA.COUNTRY == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Select Country Name', 'E');
        } else if (
            this.DATA.STATE == undefined ||
            this.DATA.STATE == null ||
            this.DATA.STATE == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Select State Name', 'E');
        } else if (this.DATA.DOB == undefined || this.DATA.DOB == null) {
            isOk = false;
            this.openSnackBar('Please select Birth Date', 'E');
        } else if (
            this.DATA.EMAIL_ID == undefined ||
            this.DATA.EMAIL_ID == null ||
            this.DATA.EMAIL_ID == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Enter Email Id', 'E');
        } else if (!this.ValidateEmail(this.DATA.EMAIL_ID)) {
            isOk = false;
            this.openSnackBar('Please Enter Valid Email Id.', 'E');
        } else if (
            this.DATA.MOBILE_NO == undefined ||
            this.DATA.MOBILE_NO == null ||
            this.DATA.MOBILE_NO == 0
        ) {
            isOk = false;
            this.openSnackBar('Please Enter Mobile no.', 'E');
        } else if (!this.ValidateMobileNumber(this.DATA.MOBILE_NO)) {
            isOk = false;
            this.openSnackBar('Please Enter Valid Mobile no.', 'E');
        } else if (
            this.DATA.CITY == undefined ||
            this.DATA.CITY == null ||
            this.DATA.CITY == ''
        ) {
            isOk = false;
            this.openSnackBar('Please select User Type', 'E');
        } else if (
            this.DATA.CITY == undefined ||
            this.DATA.CITY == null ||
            this.DATA.CITY == ''
        ) {
            isOk = false;
            this.openSnackBar('Please select User Belongs Type', 'E');
        } else if (
            this.DATA.PASSWORD == undefined ||
            this.DATA.PASSWORD == null ||
            this.DATA.PASSWORD == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Enter Password', 'E');
        }

        if (isOk) {
            if (this.DATA.ID != undefined && this.DATA.ID > 0) {
                console.log('updated');

                // Update the product
                this._inventoryService
                    .updateCustomer(this.DATA.ID, this.DATA)
                    .subscribe((data) => {
                        // Mark for check
                        this.openSnackBar(
                            'Information updated successfully',
                            'S'
                        );
                        this.drawerClose();
                        this._changeDetectorRef.markForCheck();
                    });
            } else {
                // // Create the product
                console.log(this.DATA);

                this._inventoryService
                    .createCustomer(this.DATA)
                    .subscribe((data) => {
                        // Go to new product
                        this.DATA = new Customers();

                        // Mark for check
                        this.openSnackBar(
                            'Information saved successfully',
                            'S'
                        );
                        this.drawerClose();
                        this._changeDetectorRef.markForCheck();
                    });
            }

            // this.openSnackBar('Failed to saved information', 'E');
        }
    }

    /**
     * Close drawer
     *
     * @param closeDrawer
     */
    close() {
        this.drawerClose();
    }
    closeDrawer(): void {
        this.drawerClose();
        this._changeDetectorRef.markForCheck();
    }
    expertise = 0;
    formatLabel(value: number): string {
        if (value >= 1000) {
            return Math.round(value / 1000) + 'k';
        }

        return `${value}`;
    }

    newvisitor: Visitors = new Visitors();
    addVisitor() {
        this.newvisitor = new Visitors();
    }

    newvisitorDrawerClose(): void {
        this._changeDetectorRef.markForCheck();
        var d = document.getElementById('closeDrawer') as HTMLElement;
        d.click();
    }

    get newvisitorDrawerCloseCallback() {
        return this.newvisitorDrawerClose.bind(this);
    }

    ValidateMobileNumber(str) {
        return /^[6-9]\d{9}$/.test(str);
    }

    ValidateEmail(str) {
        return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(str);
    }

    removeAvatar() {
        const img: HTMLImageElement = document.getElementById(
            'avatar-preview'
        ) as HTMLImageElement;
        img.src =
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhdbyLuigk_nkMr3nDCb0j0zYexX2Pm6Iz-DAg9TMFC7BdtD954OvPXkoeMSVs7IfcMxM&usqp=CAU';
        this.DATA.LOGO = null;
    }

    previewImage(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const img: HTMLImageElement = document.getElementById(
                'avatar-preview'
            ) as HTMLImageElement;
            img.src = reader.result as string;
            this.DATA.LOGO = reader.result as string;
        };
        reader.readAsDataURL(file);

        this.is_ChooseOptions = false;
    }

    toggleEdit(event) {
        this.is_ChooseOptions = true;

        // if(this.is_ChooseOptions){
        //   console.log('set lskj alsdj');

        // const input: HTMLInputElement = event.target as HTMLInputElement;
        // input.value = '';
        // }
    }

    inputs = [{ value: '' }];

    addInput() {
        this.inputs.push({ value: '' });
    }

    removeInput(index: number) {
        this.inputs.splice(index, 1);
    }

    selectedLocationName: string;

    // constructor() {}

    // openMap(): void {
    //   const dialogRef = this.dialog.open(AddCustomerComponent, {
    //     width: '600px',
    //     height: '400px',
    //     disableClose: true
    //   });

    //   dialogRef.afterClosed().subscribe(result => {
    //     this.selectedLocationName = result;
    //   });
    // }

    // map location
    //     openDialog(templateRef: TemplateRef<any>) {
    //         this.dialog.open(templateRef);
    //       }

    //       latitude: number = 0;
    //       longitude: number = 0;
    //        LATITUDE:any
    //   LONGITUDE:any

    //       zoom = 12;
    //       @Input() center: google.maps.LatLngLiteral = {
    //         lat: 16.867634,
    //         lng: 74.570389,
    //       };
    //       markerOptions: google.maps.MarkerOptions = { draggable: true };
    //       @Input() markerPositions: google.maps.LatLngLiteral = {
    //         lat: 16.867634,
    //         lng: 74.570389,
    //       };

    //   addMarker2(event: any) {
    //     this.markerPositions = event.latLng.toJSON();
    //     this.latitude = this.markerPositions.lat;
    //     this.longitude = this.markerPositions.lng;

    //     this.LATITUDE = this.latitude.toString();
    //     this.LONGITUDE = this.longitude.toString();
    //   }
}
