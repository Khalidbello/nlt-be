interface vAccountType {
    account_number: number;
    account_name: string;
    bank_name: string;
    balance: number;
}

interface checkUserExistType {
    password: string;
    first_name: string;
    last_name: string;
    gender: string;
    user_id: number
}

export type {
    vAccountType,
    checkUserExistType
}