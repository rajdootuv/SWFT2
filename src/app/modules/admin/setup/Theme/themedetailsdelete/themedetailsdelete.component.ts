import { ChangeDetectorRef, Component, Input } from '@angular/core';
// import { smssetting } from '../../../setting/setting.types';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, takeUntil } from 'rxjs';
import { Theme } from '../../setup.types';
import { SetupService } from '../../setup.service';
// import { SettingService } from '../../../setting/setting.service';
@Component({
  selector: 'app-themedetailsdelete',
  templateUrl: './themedetailsdelete.component.html',
  styleUrls: ['./themedetailsdelete.component.scss']
})
export class ThemedetailsdeleteComponent {

  @Input() DATA: Theme = new Theme();
  @Input() drawerClose: Function;
  oldvisitors = [];
  isScreenSmall: boolean =true;

    constructor(
      
        private _changeDetectorRef: ChangeDetectorRef,
        private _snackBar: MatSnackBar,
        private _inventoryService: SetupService,
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
            .getTheme(undefined, undefined, undefined, 'asc', undefined)
            .subscribe((data) => {
                // Update the brands
                this.dataList = data.floors;

                // Mark for check
                this._changeDetectorRef.markForCheck();

      });

      
}

}
