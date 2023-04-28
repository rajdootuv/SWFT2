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
import { SetupComponent } from './setup.component';
import { authenticationRoutes } from './setup.routing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSliderModule } from '@angular/material/slider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { FloorListComponent } from './floor/floor-list/floor-list.component';
import { AddfloorComponent } from './floor/addfloor/addfloor.component';
import { FloordetailsComponent } from './floor/floordetails/floordetails.component';
import { AddstudioComponent } from './studio/addstudio/addstudio.component';
import { DetailDeleteStudioComponent } from './studio/detail-delete-studio/detail-delete-studio.component';
import { ListstudioComponent } from './studio/liststudio/liststudio.component';
import { LanguageTranslationListComponent } from './language-translation/language-translation-list/language-translation-list.component';
import { AddlanguageComponent } from './language/addlanguage/addlanguage.component';
import { DeleteDetailsComponent } from './language/delete-details/delete-details.component';
import { LanguagemasterComponent } from './language/languagemaster/languagemaster.component';
import { ViewDetailsComponent } from './language/view-details/view-details.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BaymasterComponent } from './Bay/baymaster/baymaster.component';
import { AddbayDrawerComponent } from './Bay/addbay-drawer/addbay-drawer.component';
import { DeletedetailsbayComponent } from './Bay/deletedetailsbay/deletedetailsbay.component';
import { ActivateThemeComponent } from './Theme/activate-theme/activate-theme.component';
import { AddThemeComponent } from './Theme/add-theme/add-theme.component';
import { ListThemeComponent } from './Theme/list-theme/list-theme.component';
import { ThemedetailsdeleteComponent } from './Theme/themedetailsdelete/themedetailsdelete.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { MatRadioModule } from '@angular/material/radio';
import { AddorganizationComponent } from './Orgnization/addorganization/addorganization.component';
import { OrganizationlistComponent } from './Orgnization/organizationlist/organizationlist.component';
import { MenulistComponent } from './Orgnization/menulist/menulist.component';
import { GoogleMapsModule } from '@angular/google-maps';

@NgModule({
    declarations: [
        SetupComponent,
        FloorListComponent,
        AddfloorComponent,
        FloordetailsComponent,
        ListstudioComponent,
        AddstudioComponent,
        DetailDeleteStudioComponent,
        LanguagemasterComponent,
        AddlanguageComponent,
        LanguageTranslationListComponent,
        DeleteDetailsComponent,
        ViewDetailsComponent,
        BaymasterComponent,
        AddbayDrawerComponent,
        DeletedetailsbayComponent,
        AddThemeComponent,
        ListThemeComponent,
        ActivateThemeComponent,
        ThemedetailsdeleteComponent,
        OrganizationlistComponent,        
        AddorganizationComponent,
        MenulistComponent
    ],
    imports: [
        RouterModule.forChild(authenticationRoutes),
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
        MatNativeDateModule,
        MatGridListModule,
        MatSliderModule,
        MatExpansionModule,
        MatTableModule,
        MatCheckboxModule,
        MatSnackBarModule,
        MatCardModule,
        MatMenuModule,
        MatSlideToggleModule,
        ColorPickerModule,
        MatRadioModule,
        GoogleMapsModule
    ],
})
export class SetupModule {}
