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
}
export type {
    vAccountType,
    checkUserExistType
}