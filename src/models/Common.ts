export interface iOrderOptions {
    name: string;
    value: string;
}

export interface iApiStatus {
    name: string;
    key: string;
    btnStatus: string;
}

export interface iTableHead {
    name: string;
    className: string;
}

export interface iBaseResponse {
    current_page: number,
    total_order: number | string,
    page_size: number,
    total_pages: number,
}
export interface iPopupStatus {
    name: string;
    status: string;
}
