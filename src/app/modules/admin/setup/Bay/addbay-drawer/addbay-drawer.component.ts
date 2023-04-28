import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
 
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, takeUntil } from 'rxjs';
import { Bays } from '../../setup.types';
import { SetupService } from '../../setup.service';

@Component({
  selector: 'app-addbay-drawer',
  templateUrl: './addbay-drawer.component.html',
  styleUrls: ['./addbay-drawer.component.scss']
})
export class AddbayDrawerComponent implements OnInit {
  @Input() DATA: Bays = new Bays();
  @Input() drawerClose: Function;
  // @Input() countries: Country[] = [];

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  isScreenSmall: boolean;
  constructor(private _changeDetectorRef: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    private _inventoryService: SetupService,
    private _fuseMediaWatcherService: FuseMediaWatcherService) { }
  ngOnInit(): void {
    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        // Check if the screen is small
        this.isScreenSmall = !matchingAliases.includes('md');
      });
  }

  Cetegory = ['abcd', 'sddf', 'fger', 'ewresd', 'edxcc'];
  LengthType = ['aaa', 'ssss'];

  Save(): void {
    var isOk = true;
    if (this.DATA.NAME == undefined || this.DATA.NAME == null || this.DATA.NAME == '') {
      isOk = false;
      this.openSnackBar('Please Enter Full Name', 'E');
    }
    else if (this.DATA.LENGTH == undefined || this.DATA.LENGTH == null || this.DATA.LENGTH == 0) {
      isOk = false;
      this.openSnackBar('Please Enter Length', 'E');
    }

    else if (this.DATA.WIDTH == undefined || this.DATA.WIDTH == null || this.DATA.WIDTH == 0) {
      isOk = false;
      this.openSnackBar('Please Enter Width', 'E');
    }
    else if (this.DATA.SHOOT_TYPE == undefined || this.DATA.SHOOT_TYPE == null || this.DATA.SHOOT_TYPE == '') {
      isOk = false;
      this.openSnackBar('Please Enter Shoot Type', 'E');
    }
 

    if (isOk) {
      if (this.DATA.ID != 0) {
        // // Create the product
        this._inventoryService
          .updateBays
          (this.DATA.ID, this.DATA)
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
          .createBay(this.DATA)
          .subscribe((data) => {
            // Go to new product
            this.DATA = new Bays();

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

  openSnackBar(msg: string, type) {
    this._snackBar.open(msg, '', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 3000,
      panelClass: type == 'E' ? 'style-error' : 'style-success',
    });
  }
  closeDrawer(): void {
    this.drawerClose();
    this._changeDetectorRef.markForCheck();
  }
}
