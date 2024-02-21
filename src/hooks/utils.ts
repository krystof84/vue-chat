export const isValidEmail = (email: String): boolean => {
    return /^[^@]+@\w+(\.\w+)+\w$/.test(email);
};

export const isUserLogged = (auth: { currentUser: any }): boolean => {
    return auth.currentUser !== null;
};
