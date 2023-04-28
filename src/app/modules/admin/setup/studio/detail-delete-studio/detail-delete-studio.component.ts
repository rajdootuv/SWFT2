import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, takeUntil } from 'rxjs';
import { Studio } from '../../setup.types';

@Component({
  selector: 'app-detail-delete-studio',
  templateUrl: './detail-delete-studio.component.html',
  styleUrls: ['./detail-delete-studio.component.scss']
})
export class DetailDeleteStudioComponent {

    isScreenSmall = true;

    @Input() DATA: Studio = new Studio();
    @Input() drawerClose: Function;
    selectedVisitor: Studio | null = new Studio();
    answer: number = null;
    value = Math.floor(10 * Math.random());
    value2 = Math.floor(10 * Math.random());
    deleteShow = false;

    studio: any[] = [];

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _snackBar: MatSnackBar,
        private _fuseMediaWatcherService: FuseMediaWatcherService,) { };

    ngOnInit(): void {

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(({ matchingAliases }) => {
            // Check if the screen is small
            this.isScreenSmall = !matchingAliases.includes('md');
        });
    }


     // Delete and Detail
     details(data: Studio) {
        this.DATA = data;
        this.deleteShow = false;
    }



    detailsDelete(data: Studio) {
        this.DATA = data;
        this.deleteShow = true;
        this.answer = null;
        this.value = Math.floor(10 * Math.random());
        this.value2 = Math.floor(10 * Math.random());
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
    deleteInfo() {
        if (this.answer == undefined || this.answer == null) {
            this.openSnackBar('Please solve the puzzle', 'E');
        } else if (this.answer != this.value + this.value2) {
            this.openSnackBar('Wrong answer', 'E');
        } else {
            this.openSnackBar('Information deleted successfully', 'S');
            var d = document.getElementById('closeDrawer2') as HTMLElement;
            d.click();
        }
    }


}
