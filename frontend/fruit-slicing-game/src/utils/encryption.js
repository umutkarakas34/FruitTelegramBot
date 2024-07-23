import CryptoJS from 'crypto-js';

const secretKey = 'aASXCBNASlkpAN=3483525?^%)5941ASXCMNCU____^^^^+%%'; // Bu anahtarı güvenli bir yerde sakla

export const encryptData = (data) => {
    return CryptoJS.AES.encrypt(data, secretKey).toString();
};

export const decryptData = (encryptedData) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};
