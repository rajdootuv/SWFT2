import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-activate-theme',
  templateUrl: './activate-theme.component.html',
  styleUrls: ['./activate-theme.component.scss']
})
export class ActivateThemeComponent {

  @Input() drawerClose: Function;
  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef ,
    private _fuseMediaWatcherService: FuseMediaWatcherService ,
    private _snackBar: MatSnackBar)
   
    
    {
      
    }

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    isScreenSmall: boolean;
    seasons: string[] = ['Winter', 'Spring', 'Summer', 'Autumn'];
    selectedColor: string;


    ngOnInit(): void {

      // console.log(this.DATA.FONTSIZE,'this.DATA.FONTSIZE' )
      // Subscribe to media changes
      this._fuseMediaWatcherService.onMediaChange$
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(({ matchingAliases }) => {
              // Check if the screen is small
              this.isScreenSmall = !matchingAliases.includes('md');
          });


        
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
     * Close drawer
     *
     * @param closeDrawer
     */
     closeDrawer(): void {
      this.drawerClose();
      this._changeDetectorRef.markForCheck();
  }

       /**
     * Close drawer
     *
     * @param save
     */
       save(): void {

        this.openSnackBar('Theme Applied successfully', 'S');

        this.drawerClose();
        this._changeDetectorRef.markForCheck();
    }
}

