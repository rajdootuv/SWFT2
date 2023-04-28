import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core'; 
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ContactsService } from 'app/modules/admin/contacts/contacts.service';
import { AuthenticationService } from 'app/modules/admin/authentications/authentications.service';
import { Talents } from 'app/modules/admin/authentications/authentications.types';
import { Country } from 'app/modules/admin/contacts/contacts.types';
import { GoogleMapComponent } from '../google-map/google-map.component';

@Component({
  selector: 'app-register-tabs',
  templateUrl: './register-tabs.component.html',
  styleUrls: ['./register-tabs.component.scss']
})
export class RegisterTabsComponent implements OnInit  {
  isScreenSmall: boolean;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  panelOpenState = false;
  constructor(private _changeDetectorRef: ChangeDetectorRef, 
      private _inventoryService: AuthenticationService,
      private _fuseMediaWatcherService: FuseMediaWatcherService,
      private _contactsService: ContactsService,
      private _snackBar: MatSnackBar, public dialog: MatDialog,) {

  }
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

      this.PortFolioArray.push({
          INPUT: ""
      });
      this.SocialMediaArray.push({
          INPUT: ""
      });
      this.AccDetails.push({
          ACC_NAME: "", BANK_NAME: "", ACC_NO: "", BANK_CODE: "", PRIMARY1: ""
      });
      this.ContactNo.push({
          CONTACT: ""
      });
      this.EmailAdd.push({
          EMAIL: ""
      })

      this.ContactInfo.push({
          CONTACT: ""
      })

      this.PassportDetails.push({
          IDs: "", COUNTRY: "", ISSUE: "", Upload: "", IS_PRIMARY: ""
      })
      this.VisasDetails.push({
          PLACE: "", TYPE: "", START_DATE: "", END_DATE: ""
      })
      this.ContactDetails.push({
          NAME: "", RELATION: ""
      })
      this.Address.push({
          ADDRESSLINE1: "", ADDRESSLINE2: "", COUNTRY: "", STATE: "", CITY: "", PINCODE: "", IS_PRIMARY: ""
      })
  }
  ContactDetails = [];
  PassportDetails = [];
  VisasDetails = [];
  Address = [];

  @ViewChild('fileInput')
  fileInput;

  file: File | null = null;
  EmailAdd = [];
  ContactInfo=[];

  onClickFileInputButton(): void {
      this.fileInput.nativeElement.click();
  }

  onChangeFileInput(): void {
      const files: { [key: string]: File } = this.fileInput.nativeElement.files;
      this.file = files[0];
  }



  DATA: Talents = new Talents();
  PLACE: any;
  TYPE: any;
  GENDER: any;
  NATIONALITY: any;
  COUNTRY: any;
  START_DATE: any;
  END_DATE: any;
  countries: Country[] = [];
  PhoneToWsp: boolean = true;
  AccDetails = [];
  EXP_ON: any;
  ISSUED_ON: any;
  IS_PRIMARY: any;
  Country = ['India', 'Indonatia', 'ddcede', 'looop'];
  Gender = ['Male', 'Female', 'Other'];
  Nationality = ['Indian', 'Indonatia', 'Dyav', 'Dumb'];
  IDS = ['1', '2', '3', '4', '5'];
  CONTACT_NO: any;
  ContactNo = [];
  RADIO: any;


  ClickOnPlusContact() {
      this.ContactNo.push({
          CONTACT: ""
      });
      return true;
  }

  ClickOnPlusEmail() {
      this.EmailAdd.push({
          EMAIL: ""
      });
      return true;
  }

  ClickOnDeleteEmail(i: any) {
      if (i >= this.EmailAdd.length - 1) {
          return false;
      } else {
          this.EmailAdd.splice(i, 1);
          return true;
      }
  }

  ClickOnDeleteContact(i: any) {
      if (i >= this.ContactNo.length - 1) {
          return false;
      } else {
          this.ContactNo.splice(i, 1);
          return true;
      }
  }

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

  ClickOnPlusAccDetails() {
      this.AccDetails.push({
          ACC_NAME: "", BANK_NAME: "", ACC_NO: "", BANK_CODE: "", PRIMARY1: ""
      });
      return true;
  }



  hide = true;
  PortFolioArray = [];
  oldvisitors: Talents[] = [];
  SocialMediaArray = [];
  State = ['Maharashtra', 'Karnataka', 'Bengaluru'];
  SOCIAL_MEDIA: any;
  HEIGHT: any;
  HEIGHT_CODE: any;
  ClickOnPlus() {
      this.PortFolioArray.push({
          INPUT: ""
      });
      return true;
  }

  ClickOnPlus1() {
      this.SocialMediaArray.push({
          INPUT: ""
      });
      return true;
  }
  Cetegory = ['ds', 'sdsadfd', 'ewqeq', 'wewsd', 'wer4r43fd']
  toppingList = ['HDFC', 'BOI', 'Central Bank', 'Shahu Bank', 'SBI'];


  ValidateEmail(str) {
      return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(str);
  }

  Save(): void {
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
        else if (this.DATA.DOB == undefined || this.DATA.DOB == null || this.DATA.DOB == '') {
            isOk = false;
            this.openSnackBar('Please Enter Date Of Birth', 'E');
        }
        else if (this.DATA.DOB == undefined || this.DATA.DOB == null || this.DATA.DOB == '') {
            isOk = false;
            this.openSnackBar('Please Enter Date Of Birth', 'E');
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
        else if (this.DATA.LEGAL_NAME == undefined || this.DATA.LEGAL_NAME == null || this.DATA.LEGAL_NAME == '') {
            isOk = false;
            this.openSnackBar('Please Enter Legal Name', 'E');
        }
        else if (this.DATA.PASSWORD != this.DATA.CONFIRM_PASSWORD) {
            isOk = false;
            this.openSnackBar('Confirm Pasword is not same as Password ', 'E');
        }
        if (isOk) {
            if (this.DATA.ID != 0) {
                // // Update the product
                this._inventoryService
                    .updateTalent(this.DATA.ID, this.DATA)
                    .subscribe((data) => {
                        // Mark for check
                        this.openSnackBar(
                            'Information updated successfully',
                            'S'
                        );
                        // this.drawerClose();
                        this._changeDetectorRef.markForCheck();
                    });
            } else {
                // // Create the product
                this._inventoryService
                    .createTalent(this.DATA)
                    .subscribe((data) => {
                        // Go to new product
                        this.DATA = new Talents();

                        // Mark for check
                        this.openSnackBar(
                            'Information saved successfully',
                            'S'
                        );
                        // this.drawerClose();
                        this._changeDetectorRef.markForCheck();
                    });
            }

        }
  }

  Expertirs1: any;
  Expertise2: any;
  formatLabel(value: number): string {
      if (value >= 1000) {
          return Math.round(value / 1000) + 'k';
      }

      return `${value}`;
  }


  openSnackBar(msg: string, type) {
      this._snackBar.open(msg, '', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: type == 'E' ? 'style-error' : 'style-success',
      });
  }


  showMap: boolean = false;
  openDialog() {
      const dialogRef = this.dialog.open(GoogleMapComponent, {
          width: '800px', disableClose: true
      });

  }

  ClickOnDelete(i: any) {
      if (i >= this.PortFolioArray.length - 1) {

          return false;
      } else {
          this.PortFolioArray.splice(i, 1);
          return true;

      }
  }

  ClickOnDelete1(i: any) {
      if (i >= this.SocialMediaArray.length - 1) {

          return false;
      } else {
          this.SocialMediaArray.splice(i, 1);
          return true;

      }
  }


  ClickdeleteAccDetail(i: any) {
      console.log("Hiii");

      if (i >= this.AccDetails.length - 1) {
          return false;
      } else {
          this.AccDetails.splice(i, 1);
          return true;
      }
  }

  ClickdeletePassport(i: any) {
      if (i >= this.PassportDetails.length - 1) {
          return false;
      } else {
          this.PassportDetails.splice(i, 1);
          return true;
      }
  }

  ClickOnPlusPassport() {
      this.PassportDetails.push({
          IDs: "", COUNTRY: "", ISSUE: "", Upload: "", IS_PRIMARY: ""
      });
      return true;
  }
  ClickOnPlusVisas() {
      this.VisasDetails.push({
          PLACE: "", TYPE: "", START_DATE: "", END_DATE: ""
      })
  }

  ClickdeleteVisas(i: any) {
      if (i >= this.VisasDetails.length - 1) {
          return false;
      } else {
          this.VisasDetails.splice(i, 1);
          return true;
      }
  }

  // ContactDetails
  ClickPlusContact() {
      this.ContactDetails.push({
          NAME: "", RELATION: ""
      })
  }

  ClickdeleteContact(i: any) {
      if (i >= this.ContactDetails.length - 1) {
          return false;
      } else {
          this.ContactDetails.splice(i, 1);
          return true;
      }
  }

  // Address
  ClickPlusAddress() {
      this.Address.push({
          ADDRESSLINE1: "", ADDRESSLINE2: "", COUNTRY: "", STATE: "", CITY: "", PINCODE: "", IS_PRIMARY: ""
      })
  }

  NOTES: any
  ClickdeleteAddress(i: any) {
      if (i >= this.Address.length - 1) {
          return false;
      } else {
          this.Address.splice(i, 1);
          return true;
      }
  }
}
