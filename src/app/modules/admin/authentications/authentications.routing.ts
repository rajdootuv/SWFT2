import { Route } from '@angular/router';
import { AuthenticationComponent } from './authentications.component';
import { VisitorComponent } from './visitor/visitor.component';
import {
    AuthenticationVisitorsResolver,
    AuthenticationVisitsResolver,
} from './authentications.resolvers'; 

export const authenticationRoutes: Route[] = [
    {
        path: '',
        component: AuthenticationComponent,

        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'visitors',
            },
            {
                path: 'visitors',
                component: VisitorComponent,
                resolve: {
                    products: AuthenticationVisitorsResolver,
                    visits: AuthenticationVisitsResolver,
                },
            },

       
        ],
    },
];
