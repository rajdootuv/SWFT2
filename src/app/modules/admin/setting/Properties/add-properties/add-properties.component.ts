import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Properties } from '../../setting.type';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { SettingService } from '../../setting.service';

@Component({
  selector: 'app-add-properties',
  templateUrl: './add-properties.component.html',
  styleUrls: ['./add-properties.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class AddPropertiesComponent implements OnInit, OnDestroy{
  @Input() DATA: Properties = new Properties();
  @Input() drawerClose: Function;
  isScreenSmall: boolean;

  constructor(

    private _inventoryService: SettingService,

    
    private _fuseConfirmationService: FuseConfirmationService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    private _fuseMediaWatcherService: FuseMediaWatcherService

) {}

private _unsubscribeAll: Subject<any> = new Subject<any>();


ngOnInit(): void {
  // Subscribe to media changes
  this._fuseMediaWatcherService.onMediaChange$
  .pipe(takeUntil(this._unsubscribeAll))
  .subscribe(({ matchingAliases }) => {
      // Check if the screen is small
      this.isScreenSmall = !matchingAliases.includes('md');
      console.log(this.isScreenSmall ,'this.isScreenSmall ');
      
  });
}

ngOnDestroy(): void {
  // Unsubscribe from all subscriptions
  this._unsubscribeAll.next(null);
  this._unsubscribeAll.complete();
}
 /**
     * Close drawer
     *
     * @param closeDrawer
     */
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

  // console.log('abc.Value',abc.Value)
if (isOk) {
  if (this.DATA.ID != undefined && this.DATA.ID > 0) {
      // // Create the product
      this._inventoryService
          .updateProperties(this.DATA.ID, this.DATA)
          .subscribe((data) => {
              // Mark for check
              this.openSnackBar(
                  'Information updated successfully',
                  'S'
              );
              this.drawerClose();
              this._changeDetectorRef.markForCheck();
          });
  }
   else {
      // // Create the product
      this._inventoryService
          .createproperties(this.DATA)
          .subscribe((data) => {

            console.log(data)
              // Go to new product
              this.DATA = new Properties();

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
}
