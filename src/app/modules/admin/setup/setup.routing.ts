import { Route } from '@angular/router';
import { SetupComponent } from './setup.component';
import { AuthenticationBaysResolver, AuthenticationLaunguagesResolver, AuthenticationLaunguagesTranslationResolver, OrganizationResolver, SetupFloorsResolver, StudioResolver, ThemeResolver } from './setup.resolvers';
import { FloorListComponent } from './floor/floor-list/floor-list.component';
import { ListstudioComponent } from './studio/liststudio/liststudio.component';
import { LanguageTranslationListComponent } from './language-translation/language-translation-list/language-translation-list.component';
import { LanguagemasterComponent } from './language/languagemaster/languagemaster.component';
import { BaymasterComponent } from './Bay/baymaster/baymaster.component';
import { ListThemeComponent } from './Theme/list-theme/list-theme.component';
import { OrganizationlistComponent } from './Orgnization/organizationlist/organizationlist.component';

export const authenticationRoutes: Route[] = [
    {
        path: '',
        component: SetupComponent,

        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'floors',
            },
            {
                path: 'floors',
                component: FloorListComponent,
                resolve: {
                    products: SetupFloorsResolver,
                },
            },
            {
                path: 'studio',
                component: ListstudioComponent,
                resolve: {
                    products: StudioResolver,
                },
            },
            {
                path: 'language',
                component: LanguagemasterComponent,
                resolve: {
                    products: AuthenticationLaunguagesResolver,
                },
            },
            {
                path: 'bay',
                component: BaymasterComponent,
                resolve: {
                    products: AuthenticationBaysResolver,
                },
            },

            {
                path: 'language-translation',
                component: LanguageTranslationListComponent,
                resolve: {
                    products: AuthenticationLaunguagesTranslationResolver,
                },
            },

            {
                path     : 'theme',
                component: ListThemeComponent,
                resolve  : { 
                    products  : ThemeResolver
                }
            },
            {
                path     : 'organization',
                component: OrganizationlistComponent,
                resolve  : { 
                    products  : OrganizationResolver,   
                }
            }
        ],
    },
];
