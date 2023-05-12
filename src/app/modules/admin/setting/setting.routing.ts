import { SettingComponent } from './setting.component';
import { EmailsettinglistComponent } from './email/emailsettinglist/emailsettinglist.component';
import { Route } from '@angular/router';
import { AuthenticationPropertiesResolver, AuthenticationSMSResolver, AuthenticationSMTPResolver, AuthenticationwpResolver, EmailsettingResolver } from './setting.resolvers';
import { ListPropertiesComponent } from './Properties/list-properties/list-properties.component';
import { ListSMSSettingComponent } from './SMSSetting/list-smssetting/list-smssetting.component';
import { ListSMTPComponent } from './SMTP/list-smtp/list-smtp.component';
import { ListWhatsappSettingComponent } from './WhatsappSetting/list-whatsapp-setting/list-whatsapp-setting.component';

export const SettingRoutes: Route[] = [

    {
        path: '',
        component: SettingComponent,

        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'emailsetting',
            },
            {
                path     : 'emailsetting',
                component: EmailsettinglistComponent,
                resolve  : { 
                    products  : EmailsettingResolver,   
                }
            },
            {
                path     : 'properties',
                component: ListPropertiesComponent,
                resolve  : { 
                    // products  : AuthenticationVisitorsResolver,  
                    // visits  : AuthenticationVisitsResolver,  
                    products :AuthenticationPropertiesResolver
                }
            },
            {
                path     : 'smtp',
                component: ListSMTPComponent,
                resolve  : { 
                    products  : AuthenticationSMTPResolver,  
                    // visits  : AuthenticationVisitsResolver,  
                }
            },
            {
                path     : 'sms',
                component: ListSMSSettingComponent,
                resolve  : { 
                    products  : AuthenticationSMSResolver,  
                    // visits  : AuthenticationVisitsResolver,  
                }
            },
            {
                path     : 'whatsapp',
                component: ListWhatsappSettingComponent,
                resolve  : { 
                    products  : AuthenticationwpResolver,  
                    // visits  : AuthenticationVisitsResolver,  
                }
            }
            
        ],
    },
]