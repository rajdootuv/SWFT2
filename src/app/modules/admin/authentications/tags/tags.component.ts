import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthenticationService } from '../authentications.service';
import { TagsList } from '../authentications.types';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-tags',
    templateUrl: './tags.component.html',
    styleUrls: ['./tags.component.scss'],

    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class TagsComponent implements OnInit {
    taglists$: Observable<TagsList[]>;
    recentTransactionsDataSource: MatTableDataSource<any> =
        new MatTableDataSource();
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    isLoading = false;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _inventoryService: AuthenticationService,
        private _snackBar: MatSnackBar
    ) {}

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
     * On init
     */
    ngOnInit(): void {
        // taglist array
        this.taglists$ = this._inventoryService.taglists$;
        this.taglists$.subscribe((data) => {
            this.recentTransactionsDataSource.data = data;
            console.log(
                this.recentTransactionsDataSource.filteredData,
                'ttaglistsags'
            );
        });

        // get list tags
        this._inventoryService
            .gettagsList(undefined, undefined, 'NAME', 'asc', undefined)
            .subscribe((data) => {
                console.log(data, 'get users adaata');

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // remove or delete tag
    removeTag(tagID, tag) {
        console.log(tagID);
        console.log(tag);

        this._inventoryService.deleteTaglist(tagID).subscribe((data) => {
            console.log(data);

            this.openSnackBar('Information Delete successfully', 'S');
            this._changeDetectorRef.markForCheck();
        });
    }

    DATA: TagsList = new TagsList();

    // save tag method

    Save(): void {
        var isOk = true;
        if (
            this.DATA.TAG_NAME == undefined ||
            this.DATA.TAG_NAME == null ||
            this.DATA.TAG_NAME == ''
        ) {
            isOk = false;
            this.openSnackBar('Please Enter tag Name', 'E');
        }

        if (isOk) {
            // // Create the product
            console.log(this.DATA);

            this._inventoryService
                .createTagslist(this.DATA)
                .subscribe((data) => {
                    // Go to new product
                    console.log(data);

                    this.DATA = new TagsList();

                    // Mark for check
                    this.openSnackBar('Information saved successfully', 'S');
                    this._changeDetectorRef.markForCheck();
                });

            // this.openSnackBar('Failed to saved information', 'E');
        }
    }
}
