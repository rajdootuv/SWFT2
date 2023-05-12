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
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { LoginActivityRoutes } from './loginactivity.routing';
import { LoginactivityComponent } from './loginactivity.component';
import { LoginactivitylistComponent } from './loginactivitylist/loginactivitylist.component';
import { ActiveuserComponent } from './activeuser/activeuser.component';
import { AddfeedbackComponent } from './StudioVisitorLog/addfeedback/addfeedback.component';
import { StudioLogComponent } from './StudioVisitorLog/studio-log/studio-log.component';
import { VisitorCheckedInComponent } from './StudioVisitorLog/visitor-checked-in/visitor-checked-in.component';
import { VisitorsComponent } from './StudioVisitorLog/visitors/visitors.component';
import { AddeventvisitorlogComponent } from './addeventvisitorlog/addeventvisitorlog.component';
import { ListEventVisitorComponent } from './list-event-visitor/list-event-visitor.component';
import { UserattendancelogComponent } from './userAttendanceLog/userattendancelog/userattendancelog.component';
import { DatePipe } from '@angular/common';
import { UserActivityComponent } from './user-activity/user-activity.component';

@NgModule({
    declarations: [
        LoginactivityComponent,
        LoginactivitylistComponent,
        ActiveuserComponent,

        ListEventVisitorComponent,
        UserattendancelogComponent,
        AddeventvisitorlogComponent,
        StudioLogComponent,
        AddfeedbackComponent,
        VisitorCheckedInComponent,
        VisitorsComponent,
        UserActivityComponent
    ],
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
    providers: [ DatePipe],
})
export class LoginActivityModule {}
