<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, ref } from "vue";

import LoginForm from "@src/components/views/AccessView/LoginForm.vue";
import RegisterForm from "@src/components/views/AccessView/RegisterForm/RegisterForm.vue";
import Cover from "@src/components/views/AccessView/Cover.vue";
import FadeTransition from "@src/components/ui/transitions/FadeTransition.vue";

import {
    registerUserWithEmailAndPassword,
    handleSignWithGoogle,
    handleSignWithEmailAndPassword,
    saveUserData,
    isUserSignedIn
} from "@src/firebase.ts"

const route = useRoute();

const newUser = ref({
    firstName: '',
    lastName: '',
    email: ''
});

const ActiveMethod = computed((): any => {
    if (route.params.method === "sign-up") {
        return RegisterForm;
    } else if (route.params.method === "sign-in") {
        return LoginForm;
    }
});

const handlePersonalSection = (payload) => {
    newUser.firstName = payload.firstName;
    newUser.lastName = payload.lastName;
    newUser.email = payload.email;
};

const handlePasswordSection = (password) => {

    const user = {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email
    };

    registerUserWithEmailAndPassword(newUser.email, password, user);
};
</script>

<template>
  <div class="w-full h-full">
      <!--<button @click="isUserSignedIn">IS USER LOGIN</button>-->

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
