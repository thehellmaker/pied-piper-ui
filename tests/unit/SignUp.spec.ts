import { shallowMount } from '@vue/test-utils'
import SignUp from '@/views/authentication/SignUp.vue'
import authApp from 'authenticationPlugin/App'
const wrapper = shallowMount(SignUp)
beforeEach(() => {
    wrapper.vm.$data.error = ""
    wrapper.vm.$data.successMessage = ""
    wrapper.vm.$data.email = ""
    wrapper.vm.$data.password = ""
})

describe('SignUp.vue', () => {
    const indexOfLogin = wrapper.find('#login')
    const indexOfForgotpassword= wrapper.find('#forgotpassword')
    const indexOf_1stInputField= wrapper.find('#Email')
    const indexOf_2ndInputField=wrapper.find('#password')
    const indexOfSubmitButton=wrapper.find('#submit')
    const indexOfSignup=wrapper.find('#signup')
    it('Check if Sign In is present',() => {            //can be ommitted
        expect(indexOfLogin.text()).toBe("Sign In")
    })

    it('Check if Sign In has correct href',() => {
        expect(indexOfLogin.attributes().href).toBe('/login')
    })

    it('Check if Sign Up is present',() => {            //can be ommitted
        expect(indexOfSignup.text()).toBe("Sign Up")
    })

    it('Check if placeholders have correct fields', () => {         //can be ommitted
        expect(indexOf_1stInputField.attributes('placeholder')).toBe('Email')
        expect(indexOf_2ndInputField.attributes('placeholder')).toBe('Password')
    })

    it('Check if id of Password field is password so that it is masked', () => {
        expect(indexOf_2ndInputField.attributes('id')).toBe('password')
    })

    it('Check if forgot password exists and if it contains correct href', () => {
        expect(indexOfForgotpassword.text()).toBe('Forgot Password?')
        expect(indexOfForgotpassword.attributes().href).toBe('/forgotpassword')
    })

    it('Check if v-model binding is correct for the input the SignUp form takes', () => {
        expect(wrapper.vm.$data.email).toBe("")
        expect(wrapper.vm.$data.password).toBe("")
        indexOf_1stInputField.setValue("testEmail")
        indexOf_2ndInputField.setValue("my password")
        expect(wrapper.vm.$data.email).toBe("testEmail")
        expect(wrapper.vm.$data.password).toBe("my password")
    })

    it('Check if email and password is correctly set and if on submitting the forum, A success response is returned', async () => {
        const signup= authApp.signup
            authApp.signup = jest.fn((email: string, password: string) => {
                const msg='success'
                return msg
            });

        const button = indexOfSubmitButton
        button.trigger('click')

        await wrapper.vm.$nextTick()
        expect(wrapper.vm.$data.successMessage).toBe("success")
        authApp.signup = signup
    })

    it('Check if data returns an error message if the signup method throws an error', async () => {
        const err= {"err":{"message":"Network Error"}}
        authApp.signup = jest.fn((email: string) => {
            throw new Error(<any>err.err.message)
        });
        const button = indexOfSubmitButton
        button.trigger('click')
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.$data.error).toBe(err.err.message)
        expect(wrapper.vm.$data.successMessage).toBe("")
        expect(wrapper.vm.$data.email).toBe("")
        expect(wrapper.vm.$data.password).toBe("")
    })
})