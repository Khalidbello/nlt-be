const generateRandomAlphanumericCode = (length: number, onlyNumber: boolean): string | number => {
    let characters = onlyNumber ? '123456789' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    };

    const toReturn: string | number = onlyNumber ? parseInt(result) : result;
    return toReturn;
}

export default generateRandomAlphanumericCode;