
export interface ApplicationType {
    info: Info;
    attr: AttrElement[];
}

export interface AttrElement {
    attr: AttrAttr;
    name: string;
    label: Description;
    value: null | string;
    required: boolean;
    description: Description;
}

export interface AttrAttr {
}

export interface Description {
    default: string;
    "en-US": string;
}

export interface Info {
    name: string;
    author: string;
    website_url: string;
    docs_url: string;
    download_url: string;
    name_version: string;
    code_version: number;
    agreement_name: string;
    description: string;
    agreement_url: null;
}
