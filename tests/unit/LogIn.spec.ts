import { shallowMount } from '@vue/test-utils'
import LogIn from '@/views/authentication/LogIn.vue'
import authApp from 'authenticationPlugin/App'
const err= {"err":{"message":"Network Error"}}
const $router = {
    push: jest.fn(),
    go: jest.fn(),
    path: jest.fn()
  };

const $route = {
    query: {redirect:jest.fn()}
}
const wrapper = shallowMount(LogIn,{
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
    const _1stIndexOf_a = wrapper.findAll('a').at(0)
    const _2ndIndexOf_a= wrapper.findAll('a').at(1)
    const _1stIndexOf_input= wrapper.findAll('input').at(0)
    const _2ndIndexOf_input=wrapper.findAll('input').at(1)
    const _3rdIndexOf_input=wrapper.findAll('input').at(2)
    const _1stIndexOf_h2=wrapper.findAll('h2').at(0)
    const _2ndIndexOf_h2=wrapper.findAll('h2').at(1)

    it('Check if Sign In is present',() => {    //can be ommitted
        expect(_1stIndexOf_h2.text()).toBe("Sign In")
    })

    it('Check if Sign Up is present',() => {    //can be ommitted
        expect(_2ndIndexOf_h2.text()).toBe("Sign Up")
    })

    it('Check if Sign Up has correct href',() => {
        expect(_1stIndexOf_a.attributes().href).toBe('/signup')
    })

    it('Check if placeholders have correct fields', () => {     //can be ommitted
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

    it('Check if v-model binding is correct for the input the LogIn form takes', () => {
        expect(wrapper.vm.$data.email).toBe("")
        expect(wrapper.vm.$data.password).toBe("")
        _1stIndexOf_input.setValue("testEmail")
        _2ndIndexOf_input.setValue("my password")
        expect(wrapper.vm.$data.email).toBe("testEmail")
        expect(wrapper.vm.$data.password).toBe("my password")
    })

    it('Check if user is authenticated and Email is verified then user should be redirected to the correct path', async () => {
        const authenticate= authApp.authenticate
        const getLoggedInUser= authApp.getLoggedInUser

            authApp.authenticate = jest.fn((email: string, password: string) => {
            });

            authApp.getLoggedInUser = jest.fn((email: string, password: string) => {
                return {
                    isEmailVerified: true
                  }
            });

        const button = _3rdIndexOf_input
        button.trigger('click')

        await wrapper.vm.$nextTick()
        expect(wrapper.vm.$data.isEmailVerified).toBe(true)

        expect($router.push).toBeCalledWith({ path: $route.query.redirect });
        expect($router.go).toBeCalledWith({ path: $router.path });

        authApp.authenticate = authenticate
        authApp.getLoggedInUser = getLoggedInUser
    })


    it('Check if authenticate throws an error then data returns an error message', async () => {
        const authenticate= authApp.authenticate
        const getLoggedInUser= authApp.getLoggedInUser

            authApp.authenticate = jest.fn((email: string, password: string) => {
                throw new Error(<any>err.err.message)
            });

            authApp.getLoggedInUser = jest.fn((email: string, password: string) => {
            });

        const button = _3rdIndexOf_input
        button.trigger('click')

        await wrapper.vm.$nextTick()
        expect(wrapper.vm.$data.error).toBe(err.err.message)
        expect(wrapper.vm.$data.successMessage).toBe("")
        expect(wrapper.vm.$data.email).toBe("")
        expect(wrapper.vm.$data.password).toBe("")
        expect(wrapper.vm.$data.isEmailVerified).toBe("")
        authApp.authenticate = authenticate
        authApp.getLoggedInUser = getLoggedInUser
    })

    it('Check if getLoggedInUser throws an error then data returns an error message', async () => {
        const authenticate= authApp.authenticate
        const getLoggedInUser= authApp.getLoggedInUser

            authApp.authenticate = jest.fn((email: string, password: string) => {
            });

            authApp.getLoggedInUser = jest.fn((email: string, password: string) => {
                throw new Error(<any>err.err.message)
            });

        const button = _3rdIndexOf_input
        button.trigger('click')

        await wrapper.vm.$nextTick()
        expect(wrapper.vm.$data.error).toBe(err.err.message)
        expect(wrapper.vm.$data.successMessage).toBe("")
        expect(wrapper.vm.$data.email).toBe("")
        expect(wrapper.vm.$data.password).toBe("")
        expect(wrapper.vm.$data.isEmailVerified).toBe("")
        authApp.authenticate = authenticate
        authApp.getLoggedInUser = getLoggedInUser
    })
})