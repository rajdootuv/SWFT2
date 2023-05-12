
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
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher/media-watcher.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Country } from 'app/modules/admin/contacts/contacts.types';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SettingService } from './../../setting.service';
import { EmailSettingData, EmailSettingPagination, } from './../../setting.type';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-addemailsetting',
  templateUrl: './addemailsetting.component.html',
  styleUrls: ['./addemailsetting.component.scss']
})
export class AddemailsettingComponent {


  @Input() DATA: EmailSettingData = new EmailSettingData();
  @Input() drawerClose: Function;
  @Input() countries: Country[] = [];

  isScreenSmall: boolean;
  oldvisitors: any[] = [];
  vendors: any[] = [];
  emailproviders = ["ProtonMail", "Gmail", "Yahoo! Mail", "GMX", "Mailfence", "Hushmail"]
  showPassword: boolean = false;
  constructor(
    private _inventoryService: SettingService,
    private _fuseConfirmationService: FuseConfirmationService,
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



  }

  // show or hide the password

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
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



   /**
     * Close drawer
     *
     * @param closeDrawer
     */
  closeDrawer(form: NgForm): void {
    form.form.markAsUntouched();
    form.form.reset();
    this.drawerClose();
    this._changeDetectorRef.markForCheck();
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
     * Update the email setting
     */

  Save(form: NgForm): void {
    var isOk = true;
    //validations for all fields
    if (
      this.DATA.NAME == undefined &&
      this.DATA.EMAIL_PROVIDER == undefined &&
      this.DATA.EMAIL == undefined &&
      this.DATA.PASSWORD == undefined &&
      this.DATA.OWNER == undefined

    ) {
      isOk = false;
      this.openSnackBar('Please fill all required fields', 'E');
      form.form.markAllAsTouched();
    }
    else if (
      this.DATA.NAME == undefined ||
      this.DATA.NAME == null ||
      this.DATA.NAME.toString().trim() == ''
    ) {
      isOk = false;
      this.openSnackBar('Please Enter Name', 'E');
    } else if (
      this.DATA.EMAIL_PROVIDER == undefined ||
      this.DATA.EMAIL_PROVIDER == null ||
      this.DATA.EMAIL_PROVIDER.trim == ''
    ) {
      isOk = false;
      this.openSnackBar('Please Select Email Provider', 'E');
    } else if (
      this.DATA.EMAIL == undefined ||
      this.DATA.EMAIL == null ||
      this.DATA.EMAIL == 0
    ) {
      isOk = false;
      this.openSnackBar('Please Enter email', 'E');
    } else if (
      this.DATA.PASSWORD == undefined ||
      this.DATA.PASSWORD == null ||
      this.DATA.PASSWORD == ''
    ) {
      isOk = false;
      this.openSnackBar('Please Enter Password', 'E');
    } else if (
      this.DATA.OWNER == undefined ||
      this.DATA.OWNER == null ||
      this.DATA.OWNER == ''
    ) {
      isOk = false;
      this.openSnackBar('Please enter Owner', 'E');
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
