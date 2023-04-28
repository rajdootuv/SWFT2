import { Route } from '@angular/router';

 import { MemberprofileComponent } from './memberprofile.component'; 
 import { MyprofileComponent } from './myprofile/myprofile.component';
 
export const MemberProfileRoutes: Route[] = [
    {
        path     : '',
        component: MemberprofileComponent,
        
        children : [
            {
                path     : '', 
                component: MyprofileComponent,
                
            }
        ]
    }
];
