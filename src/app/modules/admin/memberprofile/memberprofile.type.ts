export class Memberprofiledata {
    ID: number;
    NAME: any;
    EMAIL_ID: any;
    PHONE_NO: any
    WHATSAPP_NO: any
    DATE_OF_BIRTH: any
    COMPANY_NAME: any
    PERSONAL_IMAGES: any
}

export interface MemberprofilePagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}
