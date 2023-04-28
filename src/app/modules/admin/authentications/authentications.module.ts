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
import { AuthenticationComponent } from './authentications.component';
import { authenticationRoutes } from './authentications.routing';
import { VisitorComponent } from './visitor/visitor.component'; 
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { AddvisitorComponent } from './visitor/addvisitor/addvisitor.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSliderModule } from '@angular/material/slider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AddvisitsComponent } from './visitor/addvisits/addvisits.component';
import { VisitsComponent } from './visitor/visits/visits.component';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { GoogleMapsModule } from '@angular/google-maps'; 
import { MatTreeModule } from '@angular/material/tree';
import { MatDividerModule } from '@angular/material/divider'; 
import { MatSlideToggleModule } from '@angular/material/slide-toggle'; 

@NgModule({
    declarations: [
        AuthenticationComponent,
        VisitorComponent, 
        AddvisitorComponent,
        AddvisitsComponent,
        VisitsComponent,
 
    ],
    imports: [
        RouterModule.forChild(authenticationRoutes),
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
        MatCardModule,
        MatMenuModule,
        GoogleMapsModule,

        MatTreeModule,
        MatDividerModule,
        MatSlideToggleModule,
    ],
})
export class AuthenticationModule {}
