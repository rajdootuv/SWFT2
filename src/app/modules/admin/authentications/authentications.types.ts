export class Visitors {
    ID: number;
    NAME: string;
    COMPANY_NAME: string;
    EMAIL_ID: string;
    MOBILE_NO: number;
    DESIGNATION: string;
    CODE: string = '+91';
    ACTIVE: boolean;
}

export class Visits {
    ID: number;
    VISITOR_ID: number;
    PURPOSE_OF_VISIT?: string;
    MEETING_WITH_ID: number;
    DATE_OF_VISIT: Date;
    DURATION_OF_VISIT: string;
    DURATION_HRS: number;
    DURATION_MINUTES: number;
    NAME: string;
}

export interface AuthenticationPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface AuthenticationVendor {
    ID: string;
    NAME: string;
    slug: string;
}


export interface SelectOptions {
    ID: string;
    FIELD_ID: string;
    VALUE: string;
    HTML: boolean;
}

export class Talents {
    ID: number;

    NAME: string;

    COMPANY_NAME: string;

    EMAIL_ID: string;

    DOB: string;

    MOBILE_NO: number;

    WHATSAPP_NO: number;

    PASSWORD: string;

    CONFIRM_PASSWORD: string;

    LEGAL_NAME: string;

    TALENT_TYPE: string;

    PORTFOLIO_TYPE = [];

    CATEGORIES: string;

    EXPERTIES: string;

    ADDRESS1: string;

    ADDRESS2: string;

    CITY: string;

    STATE: string;

    COUNTRY: string;

    PINCODE: number;

    CODE: string = '+91';

    ACTIVE: boolean;

    TAXNO: number;
}


export class Selectoptions {
    ID: number;
    FIELD_ID: string;
    VALUE: string
    HTML: boolean;
}



export class TagsList {
    ID: number;
    TAG_NAME: string
}

export class Users {
    ID: number;
    NAME: string;
    EMAIL_ID: string;
    MOBILE_NO: number;
    DOB: Date;
    USER_TYPE: string;
    CODE:string='+91';
    PICTURE:string;
    USERNAME:string;
    USER_BELONGS_TO : string;
    PASSWORD:string;
    CONF_PASSWORD : string;
}


export class Customers {
    ID: number;
    NAME: string;
    EMAIL_ID: string;
    MOBILE_NO: number;
    DOB: Date;
    COMPANEY_NAME : string;
    CODE:string='+91';
    PASSWORD:string;
    CONF_PASSWORD : string;
    WEBSITE_URL : string;
    IS_WHATSAPP_NO :boolean;
    LOGO : string;
    SOCIAL_MEDIA_URLS : string;
    TAX_NUMBER : string;
    ADDRESS_LINE1 : string;
    ADDRESS_LINE2 : string;
    CITY : string;
    COUNTRY : string;
    STATE : string;
    PINCODE : number;
    LOCATION : string;


}


export class Designations{
    ID:any;
    NAME:string='';
    IS_ACTIVE:Boolean = true;
}