import {
    ChangeDetectorRef,
    Component,
    Input,
    TemplateRef,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher/media-watcher.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SetupService } from '../../setup.service';
import { Studio } from '../../setup.types';
import { MatDialog } from '@angular/material/dialog';
import { Country } from 'app/modules/admin/contacts/contacts.types';

@Component({
    selector: 'app-addstudio',
    templateUrl: './addstudio.component.html',
    styleUrls: ['./addstudio.component.scss'],
})
export class AddstudioComponent {
    @Input() DATA: Studio = new Studio();
    @Input() drawerClose: Function;
    @Input() countries: Country[] = [];

    isScreenSmall: boolean;
    oldvisitors: any[] = [];
    studio: any[] = [];

    constructor(
        private _inventoryService: SetupService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _snackBar: MatSnackBar,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        public dialog: MatDialog
    ) {}

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    ngOnInit(): void {
        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });
 
    }

     

    closeDrawer(): void {
        this.drawerClose();
        this._changeDetectorRef.markForCheck();
    }

    openSnackBar(msg: string, type) {
        this._snackBar.open(msg, '', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: type == 'E' ? 'style-error' : 'style-success',
        });
    }

 

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
            this.DATA.WEBSITE.toString().trim() == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Enter Website', 'E');
        } else if (
            this.DATA.ADDRESS_LINE_1 == undefined ||
            this.DATA.ADDRESS_LINE_1 == null ||
            this.DATA.ADDRESS_LINE_1.toString().trim() == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Enter Address Line1', 'E');
        } else if (
            this.DATA.CITY == undefined ||
            this.DATA.CITY == null ||
            this.DATA.CITY.toString().trim() == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Enter City', 'E');
        } else if (
            this.DATA.STATE == undefined ||
            this.DATA.STATE == null ||
            this.DATA.STATE.toString().trim() == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Enter State', 'E');
        } else if (
            this.DATA.COUNTRY == undefined ||
            this.DATA.COUNTRY == null ||
            this.DATA.COUNTRY.toString().trim() == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Enter Country', 'E');
        } else if (
            this.DATA.PIN == undefined ||
            this.DATA.PIN == null ||
            this.DATA.PIN.toString().trim() == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Enter Country', 'E');
        }
        if (isOk) {
            this.openSnackBar('Information saved successfully', 'S');
            this.drawerClose();
            this._changeDetectorRef.markForCheck();

            // this.openSnackBar('Failed to saved information', 'E');
        }

        // Update the contact on the server
    }

    // location
    openDialog(templateRef: TemplateRef<any>) {
        this.dialog.open(templateRef);
    }
    //  dialog:any

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

    LATITUDE: any;

    LONGITUDE: any;

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
}
