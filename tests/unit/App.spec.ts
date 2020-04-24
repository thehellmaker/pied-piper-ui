import myAuthenticationPlugin from 'authenticationPlugin/App'
import firebase from 'firebase/app'

jest.mock('firebase/app', () => {
  const userCredentialMock = {
    user: {
      sendEmailVerification: jest.fn(),
    },
  };
  return {
    auth: jest.fn().mockReturnThis(),
    currentUser: {
      email: 'test',
      uid: '123',
      emailVerified: true
    },
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword:jest.fn(() => userCredentialMock),
    sendPasswordResetEmail:jest.fn(),
    signOut:jest.fn(),
    onAuthStateChanged:jest.fn(),
    initializeApp:jest.fn()
  };
});
describe('App.js (Authentication Plugin)', () => {
  const email = 'test'
  const password = 'mypassword'
  afterAll(() => {
    jest.resetAllMocks();
  });
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

  describe('Test for isAuthenticated ()', () => {
    it('The API should return a boolean value telling us, If the user is authenticated to access the resources or not', () => {
      expect(myAuthenticationPlugin.isAuthenticated()).toBe(true)
    })
  })

  describe('Test for authenticate (email,password)',() => {
    it('signInWithEmailAndPassword (), Expected to be called with right parameters',async () => {
      await myAuthenticationPlugin.authenticate(email, password)
      expect(firebase.auth().signInWithEmailAndPassword).toBeCalledWith(email, password);
    })
  })

  describe('Test for signup (email,password)',() => {

    it('createUserWithEmailAndPassword (email,password), Expected to be called with right parameters',async () => {
      await myAuthenticationPlugin.signup(email, password)
      expect(firebase.auth().createUserWithEmailAndPassword).toBeCalledWith(email, password)
    })

    it('sendEmailVerification(), Check if the method is called',async () => {
      const actual = await myAuthenticationPlugin.signup(email, password)
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email,password)
      expect(actual).toEqual('Check your email for verification mail before logging in');
      if(userCredential.user!=null){
      expect(userCredential.user.sendEmailVerification).toBeCalled()
      }
    })
  })

  describe('Test for forgotPassword (email)', () => {

    it('sendPasswordResetEmail(email), Check if the method is called with right parameters and if the parent method returns a success response',async () => {
      const successMessage = await myAuthenticationPlugin.forgotPassword(email)
      expect(firebase.auth().sendPasswordResetEmail).toHaveBeenCalledWith(email)
      expect(successMessage).toEqual(`Reset password link sent to ${email}`)
    })
  })

  describe('Test for logout ()', () => {

    it('signout(), Check if the method is called',async () => {
      await myAuthenticationPlugin.logout()
      expect(firebase.auth().signOut).toBeCalled()
    })
  })

  describe('Test for onAuthStateChanged ()', () => {

      it('onAuthStateChanged(), Check if the method is called', async () => {
        await myAuthenticationPlugin.onAuthStateChanged()
        expect(firebase.auth().onAuthStateChanged).toBeCalled()
      })
  })
})
