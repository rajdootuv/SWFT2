import { Route } from '@angular/router';
import { AuthSignUpComponent } from 'app/modules/auth/sign-up/sign-up.component';
import { RegistationMasterComponent } from './registation-master/registation-master.component';

export const authSignupRoutes: Route[] = [
    {
        path     : '',
        component: RegistationMasterComponent
    }
];
