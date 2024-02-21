<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";

import Typography from "@src/components/ui/data-display/Typography.vue";
import Button from "@src/components/ui/inputs/Button.vue";
import IconButton from "@src/components/ui/inputs/IconButton.vue";
import TextInput from "@src/components/ui/inputs/TextInput.vue";
import Alert from "@src/components/ui/utils/Alert.vue";
import { EyeSlashIcon, EyeIcon } from "@heroicons/vue/24/outline";
import { RouterLink } from "vue-router";
import { storeToRefs } from 'pinia';
import useStore from "@src/store/store";
import { isValidEmail } from "@src/hooks/utils.ts";

const emit = defineEmits(['signWithGoogleButtonClicked', 'signWithEmailAndPassword']);

const store = useStore();
const showPassword = ref(false);
const { errors } = storeToRefs(store);
const formData = reactive({
    email: '',
    password: ''
});

onMounted(() => {
   store.clearErrors();
});

const handleSignIn = () => {
    store.clearErrors();

    for(let key in formData) {
        if(formData[key].length === 0) {
            store.addError('Fields must not be empty');
        }
    }

    if( !isValidEmail(formData.email) ) {
        store.addError('Incorrect email address');
    }

    if( errors.value.length ) {
        return false;
    }

    // emit to parent
    emit('signWithEmailAndPassword', formData);
}

</script>

<template>
  <div
    class="p-5 md:basis-1/2 xs:basis-full flex flex-col justify-center items-center"
  >
    <div class="w-full md:px-[26%] xs:px-[10%]">
        <Alert v-for="error in errors" :key="error" class="mb-4">
            {{ error }}
        </Alert>

      <!--header-->
      <div class="mb-6 flex flex-col">
        <img
          src="@src/assets/vectors/logo-gradient.svg"
          class="w-[1.375rem] h-[1.125rem] mb-4 opacity-70"
          alt="bird logo"
        />
        <Typography variant="heading-2" class="mb-4">Welcome back</Typography>
        <Typography variant="body-3" class="text-opacity-75 font-light">
          Create an account a start messaging now!
        </Typography>
      </div>

      <!--form-->
      <div class="mb-6">
        <TextInput
            label="Email"
            placeholder="Enter your email"
            class="mb-5"
            @valueChanged="value => formData.email = value"
        />
        <TextInput
          label="Password"
          placeholder="Enter your password"
          :type="showPassword ? 'text' : 'password'"
          class="pr-[2.5rem]"
          @valueChanged="value => formData.password = value"
        >
          <template v-slot:endAdornment>
            <IconButton
              title="toggle password visibility"
              aria-label="toggle password visibility"
              class="m-[.5rem] p-2"
              @click="showPassword = !showPassword"
            >
              <EyeSlashIcon
                v-if="showPassword"
                class="w-5 h-5 text-black opacity-50 dark:text-white dark:opacity-60"
              />
              <EyeIcon
                v-else
                class="w-5 h-5 text-black opacity-50 dark:text-white dark:opacity-60"
              />
            </IconButton>
          </template>
        </TextInput>
      </div>

      <!--local controls-->
      <div class="mb-6">
        <Button class="w-full mb-4" @click="handleSignIn">Sign in</Button>
      </div>

      <!--divider-->
      <div class="mb-6 flex items-center">
        <span
          class="w-full border border-dashed border-gray-100 dark:border-gray-600 rounded-[.0625rem]"
        ></span>
        <Typography variant="body-3" class="px-4 text-opacity-75 font-light"
          >or</Typography
        >
        <span
          class="w-full border border-dashed border-gray-100 dark:border-gray-600 rounded-[.0625rem]"
        ></span>
      </div>

      <!--oauth controls-->
      <div>
        <Button variant="outlined" class="w-full mb-5" @click="emit('signWithGoogleButtonClicked')">
          <span class="flex">
            <img
              src="@src/assets/vectors/google-logo.svg"
              class="mr-3"
              alt="google logo"
            />
            Sign in with google
          </span>
        </Button>

        <!--bottom text-->
        <div class="flex justify-center">
          <Typography variant="body-2"
            >Don’t have an account ?
            <RouterLink
              to="/access/sign-up/"
              class="text-indigo-400 opacity-100"
            >
              Sign up
            </RouterLink>
          </Typography>
        </div>
      </div>
    </div>
  </div>
</template>
