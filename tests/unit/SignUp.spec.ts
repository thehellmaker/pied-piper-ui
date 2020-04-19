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
    const _1stIndexOf_a = wrapper.findAll('a').at(0)
    const _2ndIndexOf_a= wrapper.findAll('a').at(1)
    const _1stIndexOf_input= wrapper.findAll('input').at(0)
    const _2ndIndexOf_input=wrapper.findAll('input').at(1)
    const _3rdIndexOf_input=wrapper.findAll('input').at(2)
    const _2ndIndexOf_h2=wrapper.findAll('h2').at(1)
    it('Check if Sign In is present',() => {            //can be ommitted
        expect(_1stIndexOf_a.text()).toBe("Sign In")
    })

    it('Check if Sign In has correct href',() => {
        expect(_1stIndexOf_a.attributes().href).toBe('/login')
    })

    it('Check if Sign Up is present',() => {            //can be ommitted
        expect(_2ndIndexOf_h2.text()).toBe("Sign Up")
    })

    it('Check if placeholders have correct fields', () => {         //can be ommitted
        expect(_1stIndexOf_input.attributes('placeholder')).toBe('Email')
        expect(_2ndIndexOf_input.attributes('placeholder')).toBe('Password')
    })

    it('Check if id of Password field is password so that it is masked', () => {
        expect(_2ndIndexOf_input.attributes('id')).toBe('password')
    })

    it('Check if forgot password exists and if it contains correct href', () => {
        expect(_2ndIndexOf_a.text()).toBe('Forgot Password?')
        expect(_2ndIndexOf_a.attributes().href).toBe('/forgotpassword')
    })

    it('Check if v-model binding is correct for the input the SignUp form takes', () => {
        expect(wrapper.vm.$data.email).toBe("")
        expect(wrapper.vm.$data.password).toBe("")
        _1stIndexOf_input.setValue("testEmail")
        _2ndIndexOf_input.setValue("my password")
        expect(wrapper.vm.$data.email).toBe("testEmail")
        expect(wrapper.vm.$data.password).toBe("my password")
    })

    it('Check if email and password is correctly set and if on submitting the forum, A success response is returned', async () => {
        const signup= authApp.signup
            authApp.signup = jest.fn((email: string, password: string) => {
                const msg='success'
                return msg
            });

        const button = _3rdIndexOf_input
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
        const button = _3rdIndexOf_input
        button.trigger('click')
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.$data.error).toBe(err.err.message)
        expect(wrapper.vm.$data.successMessage).toBe("")
        expect(wrapper.vm.$data.email).toBe("")
        expect(wrapper.vm.$data.password).toBe("")
    })
})