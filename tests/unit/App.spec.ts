import myAuthenticationPlugin from 'authenticationPlugin/App'
jest.mock('firebase/app', () => {
    const firebase = {
        auth: jest.fn(() => {
            return {
                currentUser: {
                    email: 'test',
                    uid: '123',
                    emailVerified: <boolean>true
                },
            }
        }),
        initializeApp: jest.fn()
    }
    return firebase
})
describe('App.js (Authentication Plugin)', () => {
    describe('Tests for getLoggedInUser ()', () => {
        it('The API should return the email of the currently logged in user', () => {
            expect(myAuthenticationPlugin.getLoggedInUser().email).toBe('test')
        })

        it('The API should return the unique userID for the currently logged in user', () => {
            expect(myAuthenticationPlugin.getLoggedInUser().userId).toBe('123')
        })

        it('The API should return a boolean value telling us, If the email is verified or not ', () => {
            expect(myAuthenticationPlugin.getLoggedInUser().isEmailVerified).toBe(true)
        })
    })

    describe('Test for isAuthenticated ()',() => {
        it('The API should return a boolean value telling us, If the user is authenticated to access the resources or not', () => {
            expect(myAuthenticationPlugin.isAuthenticated()).toBe(true)
        })
    })
})
