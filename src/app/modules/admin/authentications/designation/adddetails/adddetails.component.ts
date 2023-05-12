import { Component, OnInit, ViewChild, ViewEncapsulation, Input, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, FormControl, NgForm, Validators, FormGroup, FormBuilder, FormGroupDirective } from '@angular/forms';

import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { designationMaster, AuthenticationPagination } from './adddetails';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { AuthenticationService } from '../../authentications.service';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-adddetails',
  templateUrl: './adddetails.component.html',
  styleUrls: ['./adddetails.component.scss']
})
export class AdddetailsComponent implements OnInit {
  @Input() data: designationMaster;
  @Input() drawerClose: Function;
  @Input() title: any;
  // infoForm: UntypedFormGroup;
  matcher = new MyErrorStateMatcher();
  productForm: UntypedFormGroup;
  showAlert: boolean = false;
  isScreenSmall: boolean;


  vendors: designationMaster[];

  /**
   * Constructor
   */
  constructor(
    private _authService: AuthService,
    private _formBuilder: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _inventoryService: AuthenticationService,
  ) {
  }
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  ngOnInit(): void {
    // Create the form
    this.productForm = this._formBuilder.group({
      name: ['', Validators.required],
      name2: ['', Validators.required],
    });

    let mydata = this.data;
    console.log(mydata, 'salkdjadjasd');

    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        // Check if the screen is small
        this.isScreenSmall = !matchingAliases.includes('md');
      });


  }

  //close the drawer
  close() {
    this.drawerClose();

  }

  //reset the drawer
  reset() {
    this.data.NAME = '';

  }


  //message service
  openSnackBar(msg: string, type) {

    this._snackBar.open(msg, '', {

      horizontalPosition: 'right',

      verticalPosition: 'top',

      duration: 3000,

      panelClass: type == 'E' ? 'style-error' : 'style-success',

    });

  }

  //to add the designation
  isOk = true;

  /****Crete & Update new designation */
  save() {
    this.isOk = true;
    if (this.data.NAME.trim() == "" && this.data.NAME.trim() == "") {
      this.isOk = false
      this.openSnackBar(" Please Fill All Required Fields", 'E');
    }
    if (this.isOk==true) {
      if (this.data.ID != undefined && this.data.ID > 0) {
          // // Create the product
          this._inventoryService
              .updateDesignation(this.data.ID, this.data)
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
          this._inventoryService
              .createDesignation(this.data)
              .subscribe((data) => {
                  // Go to new product
                  this.data = new designationMaster();

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
  olddesignation: designationMaster[] = [];
  designation: designationMaster[] = [];
}


