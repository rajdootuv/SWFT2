import { Route } from '@angular/router';
import { AuthenticationComponent } from './authentications.component';
import { VisitorComponent } from './visitor/visitor.component';
import {
    AuthenticationDesignationResolver,
    AuthenticationVisitorsResolver,
    AuthenticationVisitsResolver,
} from './authentications.resolvers';
import { CoustomersComponent } from './coustomers/coustomers.component';
import { SelectOptionsComponent } from './select-options/select-options.component';
import { TagsComponent } from './tags/tags.component';
import { UsersComponent } from './users/users.component';
import { DesignationComponent } from './designation/designation.component';

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
            {
                path: 'users',
                component: UsersComponent,
                resolve: {
                    products: AuthenticationVisitorsResolver,
                    visits: AuthenticationVisitsResolver,
                },
            },
            {
                path: 'customers',
                component: CoustomersComponent,
                resolve: {
                    products: AuthenticationVisitorsResolver,
                    visits: AuthenticationVisitsResolver,
                },
            },

            {
                path: 'selectoption',
                component: SelectOptionsComponent,
                resolve: {
                    products: AuthenticationVisitorsResolver,
                    visits: AuthenticationVisitsResolver,
                },
            },

            {
                path: 'tags',
                component: TagsComponent,
                resolve: {
                    products: AuthenticationVisitorsResolver,
                    visits: AuthenticationVisitsResolver,
                },
            },
            {
                path: 'designation',
                component: DesignationComponent,
                resolve: {
                    products: AuthenticationDesignationResolver,
                },
            },
        ],
    },
];
