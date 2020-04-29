import { shallowMount } from '@vue/test-utils'
import LogIn from '@/views/authentication/LogIn.vue'
import authApp from 'authenticationPlugin/App'
const err = { "err": { "message": "Network Error" } }
const $router = {
    push: jest.fn(),
    go: jest.fn(),
    path: jest.fn()
};

const $route = {
    query: { redirect: jest.fn() }
}
const wrapper = shallowMount(LogIn, {
    mocks: {
        $router,
        $route
    }
})
beforeEach(() => {
    wrapper.vm.$data.error = ""
    wrapper.vm.$data.email = ""
    wrapper.vm.$data.password = ""
    wrapper.vm.$data.isEmailVerified = ""
})

describe('LogIn.vue', () => {
    const indexOfSignup = wrapper.find('#signup')
    const indexOfForgotpassword = wrapper.find('#forgotpassword')
    const indexOf_1stInputField = wrapper.find('#Email')
    const indexOf_2ndInputField = wrapper.find('#password')
    const indexOfSubmitButton = wrapper.find('#submit')
    const indexOfLogin = wrapper.find('#login')

    it('Check if Sign In is present', () => {
        expect(indexOfLogin.text()).toBe("Sign In")
    })

    it('Check if Sign Up is present and has correct href', () => {
        expect(indexOfSignup.text()).toBe("Sign Up")
        expect(indexOfSignup.attributes().href).toBe('/signup')
    })
    it('Check if placeholders have correct fields and if password is masked', () => {
        expect(indexOf_1stInputField.attributes('placeholder')).toBe('Email')
        expect(indexOf_2ndInputField.attributes('placeholder')).toBe('Password')
        expect(indexOf_2ndInputField.attributes('id')).toBe('password')
    })
    it('Check if forgot password exists and if it contains correct href', () => {
        expect(indexOfForgotpassword.text()).toBe('Forgot Password?')
        expect(indexOfForgotpassword.attributes().href).toBe('/forgotpassword')
    })

    it('Check if v-model binding is correct for the input the LogIn form takes', () => {
        expect(wrapper.vm.$data.email).toBe("")
        expect(wrapper.vm.$data.password).toBe("")
        indexOf_1stInputField.setValue("testEmail")
        indexOf_2ndInputField.setValue("my password")
        expect(wrapper.vm.$data.email).toBe("testEmail")
        expect(wrapper.vm.$data.password).toBe("my password")
    })

    it('Check if user is authenticated and Email is verified then user should be redirected to the correct path', async () => {
        const authenticate = authApp.authenticate
        const getLoggedInUser = authApp.getLoggedInUser

        authApp.authenticate = jest.fn((email: string, password: string) => {
        });

        authApp.getLoggedInUser = jest.fn((email: string, password: string) => {
            return {
                isEmailVerified: true
            }
        });

        const button = indexOfSubmitButton
        button.trigger('click')

        await wrapper.vm.$nextTick()
        expect(wrapper.vm.$data.isEmailVerified).toBe(true)

        expect($router.push).toBeCalledWith({ path: $route.query.redirect });
        expect($router.go).toBeCalledWith({ path: $router.path });

        authApp.authenticate = authenticate
        authApp.getLoggedInUser = getLoggedInUser
    })


    it('Check if authenticate throws an error then data returns an error message', async () => {
        const authenticate = authApp.authenticate
        const getLoggedInUser = authApp.getLoggedInUser

        authApp.authenticate = jest.fn((email: string, password: string) => {
            throw new Error(<any>err.err.message)
        });

        authApp.getLoggedInUser = jest.fn((email: string, password: string) => {
        });

        const button = indexOfSubmitButton
        button.trigger('click')

        await wrapper.vm.$nextTick()
        expect(wrapper.vm.$data.error).toBe(err.err.message)
        expect(wrapper.vm.$data.email).toBe("")
        expect(wrapper.vm.$data.password).toBe("")
        expect(wrapper.vm.$data.isEmailVerified).toBe("")
        authApp.authenticate = authenticate
        authApp.getLoggedInUser = getLoggedInUser
    })

    it('Check if getLoggedInUser throws an error then data returns an error message', async () => {
        const authenticate = authApp.authenticate
        const getLoggedInUser = authApp.getLoggedInUser

        authApp.authenticate = jest.fn((email: string, password: string) => {
        });

        authApp.getLoggedInUser = jest.fn((email: string, password: string) => {
            throw new Error(<any>err.err.message)
        });

        const button = indexOfSubmitButton
        button.trigger('click')

        await wrapper.vm.$nextTick()
        expect(wrapper.vm.$data.error).toBe(err.err.message)
        expect(wrapper.vm.$data.email).toBe("")
        expect(wrapper.vm.$data.password).toBe("")
        expect(wrapper.vm.$data.isEmailVerified).toBe("")
        authApp.authenticate = authenticate
        authApp.getLoggedInUser = getLoggedInUser
    })
})