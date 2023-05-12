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

import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { GoogleMapsModule } from '@angular/google-maps'; 
import { MatTreeModule } from '@angular/material/tree';
import { MatDividerModule } from '@angular/material/divider'; 
import { MatSlideToggleModule } from '@angular/material/slide-toggle'; 
import { SettingRoutes } from './setting.routing';
import { SettingComponent } from './setting.component';
import { EmailsettinglistComponent } from './email/emailsettinglist/emailsettinglist.component';
import { AddemailsettingComponent } from './email/addemailsetting/addemailsetting.component';
import { MenuemailsettingComponent } from './email/menuemailsetting/menuemailsetting.component';
import { AddPropertiesComponent } from './Properties/add-properties/add-properties.component';
import { ListPropertiesComponent } from './Properties/list-properties/list-properties.component';
import { PropertiesdetailsdeleteComponent } from './Properties/propertiesdetailsdelete/propertiesdetailsdelete.component';
import { AddSMSSettingComponent } from './SMSSetting/add-smssetting/add-smssetting.component';
import { SmsdetailsComponent } from './SMSSetting/details-delete/smsdetails/smsdetails.component';
import { ListSMSSettingComponent } from './SMSSetting/list-smssetting/list-smssetting.component';
import { AddSMTPComponent } from './SMTP/add-smtp/add-smtp.component';
import { ListSMTPComponent } from './SMTP/list-smtp/list-smtp.component';
import { SmtpdetailsdeleteComponent } from './SMTP/smtpdetailsdelete/smtpdetailsdelete.component';
import { AddWhatsappSettingComponent } from './WhatsappSetting/add-whatsapp-setting/add-whatsapp-setting.component';
import { ListWhatsappSettingComponent } from './WhatsappSetting/list-whatsapp-setting/list-whatsapp-setting.component';
import { WpdetailsdeleteComponent } from './WhatsappSetting/wpdetailsdelete/wpdetailsdelete.component';

@NgModule({
    declarations: [
        SettingComponent,
        EmailsettinglistComponent,
        AddemailsettingComponent,
        MenuemailsettingComponent,
        AddWhatsappSettingComponent ,
        ListWhatsappSettingComponent,
        ListSMSSettingComponent,
        AddSMSSettingComponent,
        AddPropertiesComponent, 
        ListPropertiesComponent,
        AddSMTPComponent,
        ListSMTPComponent,
        SettingComponent,
        SmsdetailsComponent,
        WpdetailsdeleteComponent,
        SmtpdetailsdeleteComponent,
        PropertiesdetailsdeleteComponent
        
 
    ],
    imports: [
        RouterModule.forChild(SettingRoutes),
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
        MatCardModule,
        MatMenuModule,
        GoogleMapsModule,

        MatTreeModule,
        MatDividerModule,
        MatSlideToggleModule,
    ],
})
export class SettingModule {}
