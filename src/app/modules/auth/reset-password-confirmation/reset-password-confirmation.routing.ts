import { Route } from '@angular/router';
import { ResetPasswordConfirmationComponent } from './reset-password-confirmation.component';

export const authResetPasswordConfirmRoutes: Route[] = [
    {
        path     : '',
        component: ResetPasswordConfirmationComponent 
    }
];