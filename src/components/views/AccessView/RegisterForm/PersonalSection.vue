<script setup lang="ts">
import Button from "@src/components/ui/inputs/Button.vue";
import TextInput from "@src/components/ui/inputs/TextInput.vue";
import Typography from "@src/components/ui/data-display/Typography.vue";
import { isValidEmail } from "@src/hooks/utils.ts";
import { reactive, defineEmits, computed } from 'vue';
import useStore from "@src/store/store";
import { storeToRefs } from 'pinia';

const emit = defineEmits(['personalSectionFilled', 'signWithGoogleButtonClicked']);
const store = useStore();
const { errors } = storeToRefs(store);

const formData = reactive({
    email: '',
    firstName: '',
    lastName: ''
});

const handlePersonalSectionForm = () => {
    store.clearErrors();

    // Check if input fields are not empty
    for(let key in formData) {
        if(formData[key].length === 0) {
            store.addError('Fields must not be empty');
        }
    }

    if(!isValidEmail(formData.email)) {
        store.addError('Incorrect email address');
    }

    if( errors.value.length ) {
        return false;
    }

    store.clearErrors();
    emit('personalSectionFilled', formData);

    emit('active-section-change', {
        sectionName: 'password-section',
        animationName: 'slide-left',
    });
}

</script>

<template>
  <div>
    <!--form-->
    <div class="mb-5">
      <TextInput
        label="Email"
        placeholder="Enter your email"
        class="mb-5"
        @valueChanged="value => formData.email = value"
      />
      <TextInput
        label="First Name"
        placeholder="Enter your first name"
        class="mb-5"
        @valueChanged="value => formData.firstName = value"
      />
      <TextInput
        label="Last Name"
        placeholder="Enter your last name"
        class="mb-5"
        @valueChanged="value => formData.lastName = value"
      />
    </div>

    <!--local controls-->
    <div class="mb-6">
      <Button
        class="w-full mb-4"
        @click="handlePersonalSectionForm"
        >Next</Button>
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
    <Button
        variant="outlined"
        class="w-full mb-5"
        @click="emit('signWithGoogleButtonClicked', true)"
    >
      <span class="flex">
        <img
          src="@src/assets/vectors/google-logo.svg"
          class="mr-3"
          alt="google-logo"
        />
        Sign in with google
      </span>
    </Button>
  </div>
</template>
