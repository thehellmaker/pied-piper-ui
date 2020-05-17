import { shallowMount } from '@vue/test-utils'
import ForgotPassword from '@/views/authentication/ForgotPassword.vue'
import authApp from 'authenticationPlugin/App'
const wrapper = shallowMount(ForgotPassword)
beforeEach(() => {
    wrapper.vm.$data.error = ""
    wrapper.vm.$data.successMessage = ""
    wrapper.vm.$data.email = ""
})
describe('ForgotPassword.vue', () => {
    const indexOfLogin = wrapper.find('#login')
    const indexOfSignup = wrapper.find('#signup')
    const indexOf_1stInputField = wrapper.find('#Email')
    const indexOfSubmitButton = wrapper.find('#submit')
    it('Check if Sign In is present and has correct href', () => {
        expect(indexOfLogin.text()).toBe("Sign In")
        expect(indexOfLogin.attributes().href).toBe('/login')
    })
    it('Check if Sign Up is present and has correct href', () => {
        expect(indexOfSignup.text()).toBe("Sign Up")
        expect(indexOfSignup.attributes('href')).toBe('/signup')
    })

    it('Check if placeholder has correct name', () => {
        expect(indexOf_1stInputField.attributes('placeholder')).toBe('Email')
    })
    it('Check if v-model binding is correct for the input the forgot password forum takes', () => {
        expect(wrapper.vm.$data.email).toBe("")
        indexOf_1stInputField.setValue("testEmail")
        expect(wrapper.vm.$data.email).toBe("testEmail")
    })

    it('Check if email is correctly set and if on submitting the forum, A success response is returned', async () => {
        const forgotPassword = authApp.forgotPassword
        authApp.forgotPassword = jest.fn((email: string) => {
            const msg = 'success'
            email = 'a'
            return msg
        });

        const button = indexOfSubmitButton
        button.trigger('click')

        await wrapper.vm.$nextTick()
        expect(wrapper.vm.$data.successMessage).toBe("success")
        authApp.forgotPassword = forgotPassword
    })
    it('Check if data returns an error message if the forgot password method throws an error', async () => {
        const err = { "err": { "message": "Network Error" } }
        authApp.forgotPassword = jest.fn((email: string) => {
            throw new Error(<any>err.err.message)
        });
        const button = indexOfSubmitButton
        button.trigger('click')
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.$data.error).toBe(err.err.message)
        expect(wrapper.vm.$data.successMessage).toBe("")
        expect(wrapper.vm.$data.email).toBe("")
    })
})
