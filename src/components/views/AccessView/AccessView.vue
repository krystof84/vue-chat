<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { computed, ref } from "vue";
import { getDatabase, set, ref as ref_database} from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, signInWithEmailAndPassword, GoogleAuthProvider  } from "firebase/auth";
import useStore from "@src/store/store";

import LoginForm from "@src/components/views/AccessView/LoginForm.vue";
import RegisterForm from "@src/components/views/AccessView/RegisterForm/RegisterForm.vue";
import Cover from "@src/components/views/AccessView/Cover.vue";
import FadeTransition from "@src/components/ui/transitions/FadeTransition.vue";

import { isUserLogged } from "@src/hooks/utils.ts";

const store = useStore();
const route = useRoute();
const router = useRouter();
const provider = new GoogleAuthProvider();
const auth = getAuth();

const newUser = ref({
    firstName: '',
    lastName: '',
    email: ''
});

const handlePersonalSection = (payload) => {
    newUser.firstName = payload.firstName;
    newUser.lastName = payload.lastName;
    newUser.email = payload.email;
};

const handlePasswordSection = (password) => {
    createUserWithEmailAndPassword(getAuth(), newUser.email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            const db = getDatabase();
            const reference = ref_database(db, 'users/' + user.uid);

            const additionalData = {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email
            };

            set(reference, additionalData);
            router.push('/access/sign-up/');
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

const ActiveMethod = computed((): any => {
  if (route.params.method === "sign-up") {
    return RegisterForm;
  } else if (route.params.method === "sign-in") {
    return LoginForm;
  }
});

const handleSignWithGoogle = () => {
    store.clearErrors();

    signInWithPopup(auth, provider)
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

const handleSignWithEmailAndPassword = (payload) => {
    signInWithEmailAndPassword(auth, payload.email, payload.password)
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
</script>

<template>
  <div class="w-full h-full">
    <div class="w-full h-full flex dark:bg-gray-800">
      <!--login and register forms-->
      <FadeTransition>
        <component
            :is="ActiveMethod"
            @personalSectionFilled="handlePersonalSection"
            @passwordSectionFilled="handlePasswordSection"
            @signWithGoogleButtonClicked="handleSignWithGoogle"
            @signWithEmailAndPassword="handleSignWithEmailAndPassword"
        />
      </FadeTransition>
      <Cover />
    </div>
  </div>
</template>
