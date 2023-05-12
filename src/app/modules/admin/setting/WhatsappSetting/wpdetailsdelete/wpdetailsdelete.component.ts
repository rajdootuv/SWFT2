import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingService } from '../../setting.service';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, takeUntil } from 'rxjs';
import { whatsappsetting } from '../../setting.type';

@Component({
  selector: 'app-wpdetailsdelete',
  templateUrl: './wpdetailsdelete.component.html',
  styleUrls: ['./wpdetailsdelete.component.scss']
})
export class WpdetailsdeleteComponent {
  @Input() DATA: whatsappsetting = new whatsappsetting();
  @Input() drawerClose: Function;
  oldvisitors = [];
  isScreenSmall: boolean =true;

    constructor(
      
        private _changeDetectorRef: ChangeDetectorRef,
        private _snackBar: MatSnackBar,
        private _inventoryService: SettingService,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    ) {}

    private _unsubscribeAll: Subject<any> = new Subject<any>();


    dataList = []
  ngOnInit(): void {
    // Subscribe to media changes
    this._fuseMediaWatcherService.onMediaChange$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(({ matchingAliases }) => {
            // Check if the screen is small
            this.isScreenSmall = !matchingAliases.includes('md');
        });



        this._inventoryService
            .getWhatsapp(undefined, undefined, undefined, 'asc', undefined)
            .subscribe((data) => {
                // Update the brands
                this.dataList = data.whatsapp;

                // Mark for check
                this._changeDetectorRef.markForCheck();

      });

      
}

}
