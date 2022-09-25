<template>
    <!-- <div class="login-container d-flex flex-column justify-content-center align-items-center">
        <div class="w-25 p-5 shadow">
            <h2>My Notes App</h2>
            <form @submit.prevent="registerOrLogin">
                <p class="d-block float-left mt-3">Login or Register</p>
                <label class="mt-3 fs">
                    <input class="me-2" type="checkbox" v-model="isRegister">I'm new user.I want to Register
                </label>
                
                <div class="form-group mt-3">
                    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" v-model="email">
                </div>
                <div class="form-group mt-3">
                    <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" v-model="password">
                </div>
                
                <button class="btn btn-primary mt-3">Login or SignUp</button>
            </form>
        </div>
    </div> -->

    <section class="Form my-4 mx-5">
        <div class="container">
            <div class="row g-0">
                <div class="col-lg-5">
                    <img src="../../public/pexels-photo-6929217.webp" alt="">
                </div>
                <div class="col-lg-7 px-5 d-flex flex-column justify-content-center">
                    <h1 class="mt-5">Note App</h1>
                    <h4 class="mt-3">SignIn or SignUp your account</h4>
                    <p class="mt-3"><input class="me-2" type="checkbox" v-model="isRegister">Please check this checkbox if you don't have an acoount</p>
                    <form @submit.prevent="registerOrLogin">
                        <div class="form-row">
                            <div class="col-lg-7">
                                <input type="email" v-model="email" class="form-control my-3 p-2" placeholder="Email address">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="col-lg-7">
                                <input type="password" v-model="password" class="form-control my-3 p-2" placeholder="***********">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="col-lg-7">
                                <button type="submit" class="btn1">Login or SignUp</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { 
        useSignInEmailPassword,
        useSignUpEmailPassword
    } from '@nhost/vue'
    const router = useRouter()
    const isRegister = ref(false)
    const email = ref('')
    const password = ref('')
    const { signUpEmailPassword } = useSignUpEmailPassword()
    const { signInEmailPassword } = useSignInEmailPassword()
    const registerOrLogin = async () => {
        if (
            !email.value || 
            !password.value
        ) return alert("Please fill in all fields")
        const res = isRegister.value ? await signUpEmailPassword(email.value, password.value) : await signInEmailPassword(email.value, password.value)
        if (res.isError) return alert(res.error.message)
        router.push('/')
    }
    </script>

<style scoped>
    *{
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }

    body{
        background-color: #000;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .row{
        background: rebeccapurple;
        border-radius: 30px;
        color: white;
    }
    .left-section{
        /* height: 100vh; */
        background: darkblue;
        color:white;
    }
    img{
        height: 90vh;
        width: 100%;
        border-top-left-radius: 30px;
        border-bottom-left-radius: 30px;
    }
    .btn1{
        border: none;
        outline: none;
        height: 50px;
        width: 100%;
        background-color: black;
        color: white;
        border-radius: 4px;
        font-weight: bold;
    }

    .btn1:hover{
        background-color: white;
        border: 1px solid;
        color: black;
    }
</style>