import { Route } from '@angular/router';
import { LoginactivityComponent } from './loginactivity.component';
import { LoginactivitylistComponent } from './loginactivitylist/loginactivitylist.component';
import { ActiveResolver, LoginActivityResolver } from './loginactivity.resolvers';
import { ActiveuserComponent } from './activeuser/activeuser.component';

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
        ],
    },
];
