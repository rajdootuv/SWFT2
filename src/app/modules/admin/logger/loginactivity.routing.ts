import { Route } from '@angular/router';
import { LoginactivityComponent } from './loginactivity.component';
import { LoginactivitylistComponent } from './loginactivitylist/loginactivitylist.component';
import { ActiveResolver, AuthenticationUseractivityResolver, LoginActivityResolver, SetupEventResolver, SetupStudioResolver } from './loginactivity.resolvers';
import { ActiveuserComponent } from './activeuser/activeuser.component';
import { StudioLogComponent } from './StudioVisitorLog/studio-log/studio-log.component';
import { VisitorCheckedInComponent } from './StudioVisitorLog/visitor-checked-in/visitor-checked-in.component';
import { ListEventVisitorComponent } from './list-event-visitor/list-event-visitor.component';
import { UserattendancelogComponent } from './userAttendanceLog/userattendancelog/userattendancelog.component';
import { UserActivityComponent } from './user-activity/user-activity.component';

export const LoginActivityRoutes: Route[] = [
    {
        path: '',
        component: LoginactivityComponent,

        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'loginactivity',
            },
            {
                path: 'loginactivity',
                component: LoginactivitylistComponent,
                resolve: {
                    products: LoginActivityResolver,
                },
            },
            {
                path: 'activeusers',
                component: ActiveuserComponent,
                resolve: {
                    products: ActiveResolver,
                },
            },

            {
                path: 'eventlog',
                component: ListEventVisitorComponent,
                resolve: {
                    products  : SetupEventResolver
                },
            },
            {
                path: 'attendance',
                component: UserattendancelogComponent,
                resolve: {
                    // products  : SetupEventResolver
                },
            },
            {
                path: 'studio',
                component: StudioLogComponent,
                resolve: {
                    products  : SetupStudioResolver
                },
            },
            {
                path: 'checkin',
                component: VisitorCheckedInComponent,
                resolve: {
                    // products  : SetupStudioResolver
                },
            },

            {
                path     : 'user-activity',
                component: UserActivityComponent,
                resolve  : { 
                    useractivity : AuthenticationUseractivityResolver,
                }
            }
        ],
    },
];
