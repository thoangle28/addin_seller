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
