import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingService } from '../../setting.service';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, takeUntil } from 'rxjs';
import { smtpsetting } from '../../setting.type';

@Component({
    selector: 'app-smtpdetailsdelete',
    templateUrl: './smtpdetailsdelete.component.html',
    styleUrls: ['./smtpdetailsdelete.component.scss'],
})
export class SmtpdetailsdeleteComponent {
    @Input() DATA: smtpsetting = new smtpsetting();
    @Input() drawerClose: Function;
    oldvisitors = [];
    isScreenSmall: boolean = true;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _snackBar: MatSnackBar,
        private _inventoryService: SettingService,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    ) {}

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    dataList = [];
    ngOnInit(): void {
        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });

        this._inventoryService
            .getSMTP(undefined, undefined, undefined, 'asc', undefined)
            .subscribe((data) => {
                // Update the brands
                this.dataList = data.smtp;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }
}
