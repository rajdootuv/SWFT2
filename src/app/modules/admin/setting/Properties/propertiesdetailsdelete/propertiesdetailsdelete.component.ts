import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, takeUntil } from 'rxjs';
import { SettingService } from '../../setting.service';
import { Properties } from '../../setting.type';
@Component({
  selector: 'app-propertiesdetailsdelete',
  templateUrl: './propertiesdetailsdelete.component.html',
  styleUrls: ['./propertiesdetailsdelete.component.scss']
})
export class PropertiesdetailsdeleteComponent {

  @Input() DATA: Properties = new Properties();
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
            .getSMS(undefined, undefined, undefined, 'asc', undefined)
            .subscribe((data) => {
                // Update the brands
                this.dataList = data.sms;

                // Mark for check
                this._changeDetectorRef.markForCheck();

      });

      
}
}
