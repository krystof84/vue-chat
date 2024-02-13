<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { computed, ref } from "vue";
import { getDatabase, set, ref as ref_database} from "firebase/database";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import LoginForm from "@src/components/views/AccessView/LoginForm.vue";
import RegisterForm from "@src/components/views/AccessView/RegisterForm/RegisterForm.vue";
import Cover from "@src/components/views/AccessView/Cover.vue";
import FadeTransition from "@src/components/ui/transitions/FadeTransition.vue";

const route = useRoute();
const router = useRouter();
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
            router.push('/');
        })
        .catch(error => {
            console.log(error.message);
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
        />
      </FadeTransition>
      <Cover />
    </div>
  </div>
</template>
