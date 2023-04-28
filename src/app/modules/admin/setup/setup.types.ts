export class Floors {
    ID: number;
    NAME: string;
    LOCATION: string;
    LENGTH: number;
    WIDTH: number;
    HEIGHT: number;
    LENGTH_UNIT = 'F';
    WIDTH_UNIT = 'F';
    HEIGHT_UNIT = 'F';
}

export interface SetupPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export class Studio {
    ID: number;
    NAME: string;
    WEBSITE: string;
    COUNTRY: string;
    CITY: string;
    STATE: string;
    ADDRESS_LINE_1: string;
    ADDRESS_LINE_2: string;
    PIN: string;
    GEO_LOCATION: string;
}

export class Language {
    ID: number;
    NAME: string;
    CODE: string;
    IS_DIALECT: boolean = false;
    DIALECT_OF: string;
}

export class LanguageTranslation {
    ID: number;
    SR_NO: number;
    KEYWORD: string;
    ENGLISH: string;
    LANG1: string;
    LANG2: string;
    LANG3: string;
    LANG4: string;
}

export class Bays {
    ID: number;

    NAME: string;

    LENGTH: number;

    WIDTH: number;

    SHOOT_TYPE: string;

    WIDTH_UNIT: string = 'F';

    LENGTH_UNIT: string = 'F';
}

export class Theme {
    ID: number;
    NAME: string;
    FONTFAMILY: string;
    FONTSIZE = 1; 
    COLOR_CODE_T1: any = '';
    selectedColor: string = '#707070';
    selectedColor2: string = '#707070';
    selectedColor3: string = '#707070';
    background2light: string = '#707070';
    background1dark: string = '#707070';
    textcolor1: string = '#707070';
    Textdark1: string = '#707070';
    info1: string = '#707070';
    warning1: string = '#707070';
    d1: string = '#707070';
    accentcolor: string = '#707070';
    BUTTONSTYLE: string;
    MANUSTYLE: string;
    CUSTOMSTYLE: string;
    LAYOUTSTYLE: string;
    CustomCss: string;
}

export interface themePagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}
export class OrganizationData {
    ID: number;
    NAME:any;
    WEBSITE:any;
    BILLING_INFORMATION_ID:any;
    ADDRESS_LINE_1:any    
    ADDRESS_LINE_2:any    
    CITY:any  
    STATE:any    
    COUNTRY:any
    PRN:any    
    GEO_LOCATION:any 
    BillingADDRESS_LINE_1:any    
    BillingADDRESS_LINE_2:any    
    BillingCITY:any  
    BillingSTATE:any    
    BillingCOUNTRY:any
    BillingPRN:any    
    BillingGEO_LOCATION:any
 
}
