import { createRouter, createWebHistory } from "vue-router";
import AccessView from "@src/components/views/AccessView/AccessView.vue";
import HomeView from "@src/components/views/HomeView/HomeView.vue";
import PasswordResetView from "@src/components/views/PasswordResetView/PasswordResetView.vue";
import { isUserLogged } from "@src/hooks/utils.ts";
import { isUserSignedIn, getCurrentUser } from "@src/firebase.ts";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
    meta: {
        requiresAuth: true,
    }
  },
  {
    path: "/access/:method/",
    name: "Access",
    component: AccessView,
  },
  {
    path: "/reset/",
    name: "Password Reset",
    component: PasswordResetView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async(to) => {
    const currentUser = await getCurrentUser();

    if(to.matched.some(record => record.meta.requiresAuth)) {

        if(!currentUser) {
            return '/access/sign-in/';
        }
    }

    if(to.name === 'Access') {
        if(currentUser) {
            return "/";
        }
    }
});

export default router;
