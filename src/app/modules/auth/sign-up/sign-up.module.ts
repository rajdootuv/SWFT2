import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FuseCardModule } from '@fuse/components/card';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { AuthSignUpComponent } from 'app/modules/auth/sign-up/sign-up.component';
import { authSignupRoutes } from 'app/modules/auth/sign-up/sign-up.routing';
import { RegisterTabsComponent } from './register-tabs/register-tabs.component';
import { RegistationMasterComponent } from './registation-master/registation-master.component';
import { GoogleMapsModule } from '@angular/google-maps';
 

import { MatSortModule } from '@angular/material/sort';

import { MatPaginatorModule } from '@angular/material/paginator';

import { MatSelectModule } from '@angular/material/select';

import { FuseDrawerModule } from '@fuse/components/drawer';

import { MatDatepickerModule } from '@angular/material/datepicker';

import { MatTabsModule } from '@angular/material/tabs';

import { MatRadioModule } from '@angular/material/radio';

import { MatNativeDateModule } from '@angular/material/core';

import { MatExpansionModule } from '@angular/material/expansion';

import { MatSliderModule } from '@angular/material/slider';

import { MatGridListModule } from '@angular/material/grid-list';

import { MatCardModule } from '@angular/material/card';

import { MatSnackBarModule } from '@angular/material/snack-bar';

import { MatTableModule } from '@angular/material/table';

import { MatMenuModule } from '@angular/material/menu';
import { GoogleMapComponent } from './google-map/google-map.component';

@NgModule({
    declarations: [
        AuthSignUpComponent,
        RegisterTabsComponent,
        RegistationMasterComponent,
        GoogleMapComponent
    ],
    imports: [
        RouterModule.forChild(authSignupRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        FuseCardModule,
        FuseAlertModule,
        SharedModule,
        GoogleMapsModule,
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

        MatCardModule,

        MatMenuModule,

        GoogleMapsModule,

        MatRadioModule,

        MatTabsModule,
    ],
})
export class AuthSignUpModule {}
