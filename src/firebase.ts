import { initializeApp } from "firebase/app";
import { getAuth, signOut, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, set, ref as ref_database} from "firebase/database";
import router from "@src/router.ts";
import useStore from "@src/store/store";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain:import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

initializeApp(firebaseConfig);


export const registerUserWithEmailAndPassword = (email, password, userData) => {
    const store = useStore();

    createUserWithEmailAndPassword(getAuth(), email, password)
        .then((userCredential) => {
            const userId = userCredential.user.uid;

            if( userData !== undefined ) {
                saveUserData(userId, userData);
            }

            router.push('/');
        })
        .catch(error => {
                if( error.message === 'Firebase: Error (auth/email-already-in-use).' ) {
                    store.addError('Account with this email already exists');
                } else {
                    store.addError('Oops, something went wrong');
                    console.log(error);
                }
            }
        );
};

const saveUserData = (userId, userData) => {
    const db = getDatabase();

    const reference = ref_database(db, 'users/' + userId);
    set(reference, userData);
};

export const handleSignWithGoogle = () => {
    const store = useStore();
    const provider = new GoogleAuthProvider();

    store.clearErrors();

    signInWithPopup(getAuth(), provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)

            router.push('/');
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);

            console.log(errorCode);
            console.log(errorMessage);
            // store.addError('Oops, something went wrong');
    });
};

export const handleSignWithEmailAndPassword = (payload) => {
    signInWithEmailAndPassword(getAuth(), payload.email, payload.password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;

            router.push('/');
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            console.log(errorCode);
            console.log(errorMessage);

            if(errorCode === 'auth/invalid-credential') {
                store.addError('Invalid login credentials');
            }
        });
};

export const isUserSignedIn = (): boolean => {

    const auth = getAuth();

    console.log(auth.currentUser !== null);
    console.log(auth.currentUser);

    return auth.currentUser !== null;
};

export const signOutUser = () => {
    const auth = getAuth();

    signOut(auth).then(() => {
        console.log('Sign-out successful');
        router.push('/access/sign-in/');
    }).catch((error) => {
        console.log(error);
    });
};


