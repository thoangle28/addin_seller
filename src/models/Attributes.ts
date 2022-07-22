export interface iCreateValue {
    name: string;
    parrent_attribute: string;
    parent_id: number
}

export interface iUpdateAttribute {
    parent_id: number;
    new_attribute_term_name: string;
    taxonomy: string
}

export interface iListItem {
    id: number,
    label: string,
    name: string,
    value: string,
    options: iOption[]
}

export interface iOption {
    id: number,
    label: string,
    value: string,
    attr: string
}

export interface iUpdateAttributeTerm {
    id_term: number,
    parent_id: number | string,
    new_attribute_term_name: string,
    access_token: string;
}

export interface iUpdateDataAttr {
    old_attribute_name: string,
    new_attribute_name: string,
    access_token: string
}

export interface iCreateProductAttrPayload {
    user_id: number,
    access_token: string
    label_name: string,
}

export interface iCreateTermAttrPayload {
    parent_id: number | string;
    term_name: string,
    access_token: string
}