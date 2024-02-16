<script setup lang="ts">
    import { twMerge } from "tailwind-merge";

    const props = defineProps<{
        class: any;
    }>();

    const classes = twMerge('relative py-3 pl-4 pr-10 leading-normal text-red-700 bg-red-100 rounded-sm', props.class);
</script>

<template>
    <div :class="classes" role="alert">
        <slot></slot>
    </div>
</template>

