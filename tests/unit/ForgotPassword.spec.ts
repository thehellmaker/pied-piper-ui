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
    const _1stIndexOf_a = wrapper.findAll('a').at(0)
    const _2ndIndexOf_a= wrapper.findAll('a').at(1)
    const _1stIndexOf_input= wrapper.findAll('input').at(0)
    const _2ndIndexOf_input=wrapper.findAll('input').at(1)
    it('Check if Sign In is present',() => {                //can be ommitted
        expect(_1stIndexOf_a.text()).toBe("Sign In")
    })

    it('Check if Sign In has correct href',() => {
        expect(_1stIndexOf_a.attributes().href).toBe('/login')
    })

    it('Check if Sign Up is present',() => {                //can be ommitted
        expect(_2ndIndexOf_a.text()).toBe("Sign Up")
    })

    it('Check if Sign Up has correct href', () => {
        expect(_2ndIndexOf_a.attributes('href')).toBe('/signup')
    })

    it('Check if placeholder has correct name', () => {     //can be ommitted
        expect(_1stIndexOf_input.attributes('placeholder')).toBe('Email')
    })
    it('Check if v-model binding is correct for the input the forgot password forum takes', () => {
        expect(wrapper.vm.$data.email).toBe("")
        _1stIndexOf_input.setValue("testEmail")
        expect(wrapper.vm.$data.email).toBe("testEmail")
    })

    it('Check if email is correctly set and if on submitting the forum, A success response is returned', async () => {
        const forgotPassword= authApp.forgotPassword
            authApp.forgotPassword = jest.fn((email: string) => {
                const msg='success'
                email='a'
                return msg
            });

        const button = _2ndIndexOf_input
        button.trigger('click')

        await wrapper.vm.$nextTick()
        expect(wrapper.vm.$data.successMessage).toBe("success")
        authApp.forgotPassword = forgotPassword
    })
    it('Check if data returns an error message if the forgot password method throws an error', async () => {
        const err= {"err":{"message":"Network Error"}}
        authApp.forgotPassword = jest.fn((email: string) => {
            throw new Error(<any>err.err.message)
        });
        const button = _2ndIndexOf_input
        button.trigger('click')
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.$data.error).toBe(err.err.message)
        expect(wrapper.vm.$data.successMessage).toBe("")
        expect(wrapper.vm.$data.email).toBe("")
    })
   })
