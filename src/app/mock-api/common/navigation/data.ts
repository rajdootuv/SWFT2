/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'masters',
        title: 'Masters',
        subtitle: 'To provide data',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'masters.authentications',
                title: 'Authentication',
                type: 'collapsable',
                icon: 'heroicons_outline:clipboard-check',
                children: [
                    {
                        id: 'masters.authentications.visitors',
                        title: 'Visitors',
                        type: 'basic',
                        link: '/masters/authentications/visitors',
                    },
                    {
                        id: 'masters.authentications.designation',
                        title: 'Designation',
                        type: 'basic',
                        link: '/masters/authentications/designation',
                    },
                    {
                        id   : 'masters.authentications.inventory',
                        title: 'User',
                        type : 'basic',
                        link : '/masters/authentications/users'
                    },

                    {
                        id   : 'masters.authentications.inventory',
                        title: 'Customers',
                        type : 'basic',
                        link : '/masters/authentications/customers'
                    },

                    {
                        id   : 'masters.authentications.inventory',
                        title: 'SelectOption',
                        type : 'basic',
                        link : '/masters/authentications/selectoption'
                    },


                    {
                        id   : 'masters.authentications.inventory',
                        title: 'Tags',
                        type : 'basic',
                        link : '/masters/authentications/tags'
                    }
                ],
            },

            {
                id: 'masters.setup',
                title: 'Setup',
                type: 'collapsable',
                icon: 'heroicons_outline:clipboard-check',
                children: [
                    {
                        id: 'masters.setup.studio',
                        title: 'Studio',
                        type: 'basic',
                        link: '/masters/setup/studio',
                    },
                    {
                        id: 'masters.setup.floors',
                        title: 'Floors',
                        type: 'basic',
                        link: '/masters/setup/floors',
                    },
                    {
                        id: 'masters.setup.bay',
                        title: 'Bay',
                        type: 'basic',
                        link: '/masters/setup/bay',
                    },
                    {
                        id: 'masters.setup.language',
                        title: 'Language',
                        type: 'basic',
                        link: '/masters/setup/language',
                    },
                    {
                        id: 'masters.setup.language-translation',
                        title: 'Language Translation',
                        type: 'basic',
                        link: '/masters/setup/language-translation',
                    },
                    {
                        id: 'masters.setup.theme',

                        title: 'Theme',

                        type: 'basic',

                        link: '/masters/setup/theme',
                    },
                    {
                        id: 'masters.setup.organization',

                        title: 'Organization',

                        type: 'basic',

                        link: '/masters/setup/organization',
                    },
                ],
            },

            {
                id: 'masters.logger',
                title: 'Logger',
                type: 'collapsable',
                icon: 'heroicons_outline:clipboard-check',
                children: [
                    {
                        id: 'masters.logger.loginactivity',
                        title: 'Login Activity',
                        type: 'basic',
                        link: '/masters/logger/loginactivity',
                    },
                    {
                        id: 'masters.logger.activeusers',
                        title: 'Active Users',
                        type: 'basic',
                        link: '/masters/logger/activeusers',
                    },
                    {
                        id: 'masters.logger.inventory',
                        title: 'Event Visitors Logs',
                        type: 'basic',
                        link: '/masters/logger/eventlog',
                    },

                    {
                        id: 'masters.logger.inventory',
                        title: 'User Attendance Logs',
                        type: 'basic',
                        link: '/masters/logger/attendance',
                    },
                    {
                        id: 'masters.logger.inventory',
                        title: 'Studio Visitor Logs',
                        type: 'basic',
                        link: '/masters/logger/studio',
                    },
                    {
                        id: 'masters.logger.inventory',
                        title: 'User Activity',
                        type: 'basic',
                        link: '/masters/logger/user-activity',
                    },
                ],
            },
            {
                id: 'masters.setting',

                title: 'Setting',

                type: 'collapsable',

                icon: 'heroicons_outline:clipboard-check',

                children: [
                    {
                        id: 'masters.setting.emailsetting',

                        title: 'Email Setting',

                        type: 'basic',

                        link: '/masters/setting/emailsetting',
                    },
                    {
                        id: 'masters.setting.inventory',
                        title: 'Properties',
                        type: 'basic',
                        link: '/masters/setting/properties',
                    },
                    {
                        id: 'masters.setting.inventory',
                        title: 'SMTP Settings',
                        type: 'basic',
                        link: '/masters/setting/smtp',
                    },
                    {
                        id: 'masters.setting.inventory',
                        title: 'SMS Settings',
                        type: 'basic',
                        link: '/masters/setting/sms',
                    },
                    {
                        id: 'masters.setting.inventory',
                        title: 'Whatsapp Settings',
                        type: 'basic',
                        link: '/masters/setting/whatsapp',
                    },
                ],
            },
        ],
    },
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'apps',
        title: 'Masters',
        subtitle: 'To provide data',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'apps',
        title: 'Masters',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'apps',
        title: 'Masters',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
