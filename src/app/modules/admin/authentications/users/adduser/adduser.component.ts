import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { Users, Visitors } from '../../authentications.types';
import { Subject, takeUntil } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher/media-watcher.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../../authentications.service';
import { Country } from 'app/modules/admin/contacts/contacts.types';


@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdduserComponent implements OnInit, OnDestroy {
  @Input() DATA: Users = new Users();
  @Input() drawerClose: Function;
  @Input() countries: Country[] = [];
  isScreenSmall: boolean;
  Type_of_User = ['admin', 'super admin', 'regular'];
  Type_of_UserBelongs = ['admin', 'super admin', 'regular'];
  hide = true;
  hide1 = true;
  is_ChooseOptions = true;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  /**
   * Constructor
   */
  constructor(
      private _fuseConfirmationService: FuseConfirmationService,
      private _changeDetectorRef: ChangeDetectorRef,
      private _snackBar: MatSnackBar,
      private _inventoryService: AuthenticationService,
      private _fuseMediaWatcherService: FuseMediaWatcherService
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
   *save & Update the contact
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
          this.DATA.DOB == undefined ||
          this.DATA.DOB == null
      ) {
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
      }else if (
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
          this.DATA.USER_TYPE == undefined ||
          this.DATA.USER_TYPE == null ||
          this.DATA.USER_TYPE == ''
      ) {
          isOk = false;
          this.openSnackBar('Please select User Type', 'E');
      }
      else if (
        this.DATA.USER_BELONGS_TO == undefined ||
        this.DATA.USER_BELONGS_TO == null ||
        this.DATA.USER_BELONGS_TO == ''
    ) {
        isOk = false;
        this.openSnackBar('Please select User Belongs Type', 'E');
    }
    else if (
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
                  .updateUser(this.DATA.ID, this.DATA)
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
                  .createUser(this.DATA)
                  .subscribe((data) => {
                      // Go to new product
                      this.DATA = new Users();

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
  close(){
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



//   for img remove
removeAvatar() {
    const img: HTMLImageElement = document.getElementById('avatar-preview') as HTMLImageElement;
    img.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhdbyLuigk_nkMr3nDCb0j0zYexX2Pm6Iz-DAg9TMFC7BdtD954OvPXkoeMSVs7IfcMxM&usqp=CAU';
    this.DATA.PICTURE = null;
  }
  
//   for add images  
previewImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const img: HTMLImageElement = document.getElementById('avatar-preview') as HTMLImageElement;
      this.DATA.PICTURE = reader.result as string;
    };
    reader.readAsDataURL(file);
  
    this.is_ChooseOptions = false;
  }
  

  
  toggleEdit(event) {
    console.log(this.is_ChooseOptions , 'sdadas');
    
    event.stopPropagation(); // prevent event from bubbling up to parent elements
    this.is_ChooseOptions = true;
  }

}
