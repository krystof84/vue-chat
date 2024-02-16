<script setup lang="ts">
import { ref, defineEmits } from "vue";

import { EyeSlashIcon, EyeIcon } from "@heroicons/vue/24/outline";
import IconButton from "@src/components/ui/inputs/IconButton.vue";
import TextInput from "@src/components/ui/inputs/TextInput.vue";
import Button from "@src/components/ui/inputs/Button.vue";
import useStore from "@src/store/store";
import { storeToRefs } from 'pinia';

const store = useStore();
const showPassword = ref(false);
const showPasswordConfirm = ref(false);
const password = ref('');
const confirmPassword = ref('');
const { errors } = storeToRefs(store);

const emit = defineEmits(['passwordSectionFilled']);

const handlePasswordSection = () => {
    store.clearErrors();

    if(password.value.length === 0 || confirmPassword.value.length === 0) {
        store.addError('Fields must not be empty');
    }

    if(password.value !== confirmPassword.value) {
        store.addError('Password must be identical');
    }

    if(errors.value.length === 0) {
        emit('passwordSectionFilled', password.value);
    }
};

</script>

<template>
  <div>
    <div class="mb-5">
      <!--form-->
      <TextInput
        label="Password"
        placeholder="Enter your password"
        :type="showPassword ? 'text' : 'password'"
        :value="password.length ? password : ''"
        class="pr-[2.5rem] mb-5"
        @valueChanged="value => password = value"
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

      <TextInput
        label="Confirm Password"
        placeholder="Enter your password"
        :type="showPasswordConfirm ? 'text' : 'password'"
        :value="confirmPassword.length ? confirmPassword : ''"
        @valueChanged="value => confirmPassword = value"
      >
        <template v-slot:endAdornment>
          <IconButton
            title="toggle password visibility"
            aria-label="toggle password visibility"
            class="m-[.5rem] p-2"
            @click="showPasswordConfirm = !showPasswordConfirm"
          >
            <EyeSlashIcon
              v-if="showPasswordConfirm"
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

    <!--controls-->
    <div class="mb-5">
      <Button class="w-full mb-4" @click="handlePasswordSection">Sign up</Button>

      <Button
        variant="outlined"
        class="w-full"
        @click="
          $emit('active-section-change', {
            sectionName: 'personal-section',
            animationName: 'slide-right',
          })
        "
      >
        Back
      </Button>
    </div>
  </div>
</template>
