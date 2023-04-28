import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher'; 
import { Subject, takeUntil } from 'rxjs'; 
import { MatSnackBar } from '@angular/material/snack-bar';  
import { ContactsService } from 'app/modules/admin/contacts/contacts.service';
import { Country } from 'app/modules/admin/contacts/contacts.types';
import { Talents } from 'app/modules/admin/authentications/authentications.types';

@Component({
  selector: 'app-registation-master',
  templateUrl: './registation-master.component.html',
  styleUrls: ['./registation-master.component.scss']
})
export class RegistationMasterComponent implements OnInit {
  DATA: Talents = new Talents();
  // @Input() drawerClose: Function;
  countries: Country[] = [];
  WIDTH_UNIT: any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  isScreenSmall: boolean;
  constructor(private _changeDetectorRef: ChangeDetectorRef,
      private _snackBar: MatSnackBar, 
      private _fuseMediaWatcherService: FuseMediaWatcherService,
      private _contactsService: ContactsService,
      private route: Router) { }
  ngOnInit(): void {
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
  }

  // PhoneToWsp=false;
  Cetegory = ['abcd', 'sddf', 'fger', 'ewresd', 'edxcc'];
  LengthType = ['aaa', 'ssss'];
  Save() {
      var isOk = true;
      if (this.DATA.NAME == undefined || this.DATA.NAME == null || this.DATA.NAME == '') {
          isOk = false;
          this.openSnackBar('Please Enter Full Name', 'E');
      }
      else if (this.DATA.EMAIL_ID == undefined || this.DATA.EMAIL_ID == null || this.DATA.EMAIL_ID == '') {
          isOk = false;
          this.openSnackBar('Please Enter Email Id', 'E');
      }
      else if (!this.ValidateEmail(this.DATA.EMAIL_ID)) {
          isOk = false;
          this.openSnackBar('Please Enter Valid Email Id.', 'E');
      }
      else if (this.DATA.MOBILE_NO == undefined || this.DATA.MOBILE_NO == null || this.DATA.MOBILE_NO == 0) {
          isOk = false;
          this.openSnackBar('Please Enter Mobile no.', 'E');
      }
      else if (this.PhoneToWsp == true && (this.DATA.WHATSAPP_NO == undefined || this.DATA.WHATSAPP_NO == null || this.DATA.WHATSAPP_NO == 0)) {
          isOk = false;
          this.openSnackBar('Please Enter Mobile no.', 'E');
      }
      else if (this.DATA.COMPANY_NAME == undefined || this.DATA.COMPANY_NAME == null || this.DATA.COMPANY_NAME == '') {
          isOk = false;
          this.openSnackBar('Please Enter Company Name', 'E');
      }
      else if (this.DATA.PASSWORD == undefined || this.DATA.PASSWORD == null || this.DATA.PASSWORD == '') {
          isOk = false;
          this.openSnackBar('Please Enter Password', 'E');
      }
      else if (this.DATA.CONFIRM_PASSWORD == undefined || this.DATA.CONFIRM_PASSWORD == null || this.DATA.CONFIRM_PASSWORD == '') {
          isOk = false;
          this.openSnackBar('Please Enter Confirm Password', 'E');
      }
      else if (this.DATA.CONFIRM_PASSWORD != this.DATA.PASSWORD) {
          isOk = false;
          this.openSnackBar('Please Enter Correct Password', 'E');
      }
      else {
          this.route.navigate(['/masters/authentications/resister']);
      }
  }

  isLoading: boolean = false;
  hide = true;

  ValidateMobileNumber(str) {
      return /^[6-9]\d{9}$/.test(str);
  }

  ValidateEmail(str) {
      return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(str);
  }

  PhoneToWsp: boolean = true;
  PhoneToWSP() {
      if (this.PhoneToWsp == false) {
          this.PhoneToWsp = true;
      }
      else {
          this.PhoneToWsp = false;
      }
      console.log(this.PhoneToWsp);
      if (this.PhoneToWsp == false) {
          this.DATA.WHATSAPP_NO = this.DATA.MOBILE_NO;
          console.log(this.DATA.WHATSAPP_NO);
      }
      if (this.PhoneToWsp == true) {
          this.DATA.WHATSAPP_NO = 0;
      }
  }

  openSnackBar(msg: string, type) {
      this._snackBar.open(msg, '', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: type == 'E' ? 'style-error' : 'style-success',
      });
  }
  closeDrawer(): void {
      // this.drawerClose();
      this._changeDetectorRef.markForCheck();
  }
}

