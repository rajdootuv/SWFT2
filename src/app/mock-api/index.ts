import { AuthMockApi } from 'app/mock-api/common/auth/api';
import { NavigationMockApi } from 'app/mock-api/common/navigation/api';
import { VisitorsMockApi } from 'app/mock-api/apps/visitors/api'; 
import { CustomersMockApi } from './apps/customers/api';
import { UsersMockApi } from './apps/users/api';
import { MessagesMockApi } from './common/messages/api';
import { NotificationsMockApi } from './common/notifications/api';
import { ContactsMockApi } from './apps/contacts/api';
import { FloorsMockApi } from './apps/floors/api';
import { ShortcutsMockApi } from './common/shortcuts/api';
import { StudioMockApi } from './apps/studio/api';
import { BaysMockApi } from './apps/bay/api';
import { LanguagesMockApi } from './apps/language/api';
import { LanguageTranslationMockApi } from './apps/language-translation/api';
import { TalentsMockApi } from './apps/talents/api';
import { ThemeMockApi } from './apps/Theme/api';
import { organizationMockApi } from './apps/organization/api';
import { loginMockApi } from './apps/login/api';
import { memberprofileMockApi } from './apps/memberprofile/api';
import { ActiveMockApi } from './apps/active/api';

export const mockApiServices = [
   
    AuthMockApi,   
    NavigationMockApi,
    VisitorsMockApi,
    FloorsMockApi,
    UsersMockApi,
    CustomersMockApi,
    MessagesMockApi,
    NotificationsMockApi,
    ContactsMockApi,
    ShortcutsMockApi,
    StudioMockApi,
    BaysMockApi,
    LanguagesMockApi,
    LanguageTranslationMockApi,
    TalentsMockApi,
    ThemeMockApi,
    organizationMockApi,
    loginMockApi,
    memberprofileMockApi,
    ActiveMockApi
];
