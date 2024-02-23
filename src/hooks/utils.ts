export const isValidEmail = (email: String): boolean => {
    return /^[^@]+@\w+(\.\w+)+\w$/.test(email);
};