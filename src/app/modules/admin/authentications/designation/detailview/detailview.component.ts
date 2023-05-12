import { Component, OnInit, ViewChild, ViewEncapsulation ,Input, EventEmitter, Output, Injectable, AfterViewInit} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup,FormControl, NgForm, Validators, FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { BehaviorSubject, Observable, finalize } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertService, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { detailView } from './detailview';
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
    selector     : 'app-detailview',
    templateUrl  : './detailview.component.html',
    styleUrls: ['./detailview.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class DetailViewComponent implements OnInit
{
    panelOpenState = false;

    /****Accordation Module */
     @ViewChild(MatAccordion) accordion: MatAccordion;
  
     @Input()data: designationMaster;
   
    @Input() drawerClose: Function;


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
    )
    {
    }
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    isdisable=true;
    isScreenSmall: boolean;

    ngOnInit(): void
    {
       
        this._fuseMediaWatcherService.onMediaChange$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(({ matchingAliases }) => {
            // Check if the screen is small
            this.isScreenSmall = !matchingAliases.includes('md');
        });
    }



    trackByFn(index: number, item: any): any
    {
        return item.ID || index;
    }



/***Drawer Close */
    close(){
        this.drawerClose();
     
      }


}
  
  