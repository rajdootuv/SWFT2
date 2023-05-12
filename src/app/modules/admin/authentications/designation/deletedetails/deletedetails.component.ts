import { Component, OnInit, ViewChild, ViewEncapsulation ,Input, EventEmitter, Output, Injectable, AfterViewInit} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup,FormControl, NgForm, Validators, FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { BehaviorSubject, Observable, finalize } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertService, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { detailView } from '../detailview/detailview';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatAccordion } from '@angular/material/expansion';
import { ThemePalette } from '@angular/material/core';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import { FuseAlertModule } from '@fuse/components/alert';
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource } from '@angular/material/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { values } from 'lodash';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher/media-watcher.service';

import { designationMaster } from '../adddetails/adddetails';
@Component({
  selector: 'app-deletedetails',
  templateUrl: './deletedetails.component.html',
  styleUrls: ['./deletedetails.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class DeletedetailsComponent 
  {
    panelOpenState = false;

    @ViewChild(MatAccordion) accordion: MatAccordion;
    selectedProduct: detailView | null = null;
    @Input() data: designationMaster;
    // dataSource = new MatTableDataSource<detailView>(ELEMENT_DATA);
    @Input() drawerClose: Function;
    @Input() show: any;

    productForm: UntypedFormGroup;
    showAlert: boolean = false;
    dialog: any;
    selection: any;



    /**
     * Constructor
     */
    constructor(
        private _snackBar: MatSnackBar,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    ) {
    }
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    isdisable = true;
    isScreenSmall: boolean;
    ngOnInit(): void {


        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });
    }



    trackByFn(index: number, item: any): any {
        return item.ID || index;
    }




    /**
     * Close the details
     */
    closeDetails(): void {
        this.selectedProduct = null;
    }

    /***Drawer Close */
    close() {
        this.drawerClose();

    }

    /****Message service */
    openSnackBar(msg: string, type) {

        this._snackBar.open(msg, '', {

            horizontalPosition: 'right',

            verticalPosition: 'top',

            duration: 3000,

            panelClass: type == 'E' ? 'style-error' : 'style-success',

        });

    }



    @Input() value: any;
    @Input() value2: any;
    @Input() answer1: any;
    /*****Functionality for delete answer*/
    deleteInfo() {
        if (this.answer1 == undefined || this.answer1 == null) {
            this.openSnackBar('Please solve the puzzle', 'E');
        } else if (this.answer1 != this.value + this.value2) {
            this.openSnackBar('Wrong answer', 'E');
        } else {
            this.openSnackBar('Information deleted successfully', 'S');
            // var d = document.getElementById('closeDrawer2') as HTMLElement;
            // d.click();
            this.answer1 = null
            this.close();

        }
    }




}
