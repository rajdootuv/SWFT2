import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { SharedModule } from 'app/shared/shared.module';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { FuseDrawerModule } from '@fuse/components/drawer';

import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSliderModule } from '@angular/material/slider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {  MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { GoogleMapsModule } from '@angular/google-maps';

import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { LoginActivityRoutes } from './loginactivity.routing';
import { LoginactivityComponent } from './loginactivity.component';
import { LoginactivitylistComponent } from './loginactivitylist/loginactivitylist.component';
import { ActiveuserComponent } from './activeuser/activeuser.component';

@NgModule({
    declarations: [LoginactivityComponent, LoginactivitylistComponent,ActiveuserComponent],
    imports: [
        RouterModule.forChild(LoginActivityRoutes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressBarModule,
        MatTooltipModule,
        FuseFindByKeyPipeModule,
        SharedModule,
        MatSortModule,
        MatPaginatorModule,
        FuseDrawerModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatGridListModule,
        MatSliderModule,
        MatExpansionModule,
        MatTableModule,
        MatCheckboxModule,
        MatSnackBarModule,
        MatMenuModule,
        MatDialogModule,
    ],
})
export class LoginActivityModule {}
