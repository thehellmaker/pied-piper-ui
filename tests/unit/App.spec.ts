import myAuthenticationPlugin from 'authenticationPlugin/App'
const userCredentialMock = {
  user: {
    sendEmailVerification: jest.fn()
  }
}
describe('App.js (Authentication Plugin)', () => {
  const email = 'test'
  const password = 'mypassword'
  beforeEach(() => {
    myAuthenticationPlugin.firebase = {
      auth: jest.fn().mockReturnThis(),
      currentUser: {
        email: 'test',
        uid: '123',
        emailVerified: true
      },
      signInWithEmailAndPassword: jest.fn(),
      createUserWithEmailAndPassword: jest.fn(() => userCredentialMock),
      sendPasswordResetEmail: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChanged: jest.fn(),
      initializeApp: jest.fn()
    }
  })


  describe('Tests for getLoggedInUser ()', () => {
    it('should return user', () => {
      const actual = myAuthenticationPlugin.getLoggedInUser();
      expect(actual).toEqual({
        email: 'test',
        userId: '123',
        isEmailVerified: true,
      });
    });

    it('Should return undefined when user is not logged in', () => {
      afterEach(() => {
        jest.resetAllMocks()
      });
      myAuthenticationPlugin.firebase = {
        auth: jest.fn().mockReturnThis(),
        currentUser: null
      }
      const actual = myAuthenticationPlugin.getLoggedInUser();
      expect(actual).toBe(undefined)
    })

    it('Expect getLoggedInUser () to throw if auth () throws', () => {
      afterEach(() => {
        jest.resetAllMocks()
      });
      myAuthenticationPlugin.firebase = {
        auth: jest.fn(() => { throw new Error })
      }
      expect(myAuthenticationPlugin.getLoggedInUser).toThrow()
    })
  })

  describe('Test for isAuthenticated ()', () => {
    it('The API should return true if Email is verified', () => {
      expect(myAuthenticationPlugin.isAuthenticated()).toBe(true)
    })

    it('The API should return false if Email is  NOT verified', () => {
      afterEach(() => {
        jest.resetAllMocks()
      })
      const copyGetLoggedInUser = myAuthenticationPlugin.getLoggedInUser;
      myAuthenticationPlugin.getLoggedInUser = jest.fn().mockImplementation(() => {
        return {
          email: 'test',
          userId: '123',
          isEmailVerified: false
        }
      });
      expect(myAuthenticationPlugin.isAuthenticated()).toBe(false)
      myAuthenticationPlugin.getLoggedInUser = copyGetLoggedInUser;
    })

    it('Expect isAuthenticated () to throw if getLoggedInUser () throws', async () => {
      const copyGetLoggedInUser = myAuthenticationPlugin.getLoggedInUser;
      myAuthenticationPlugin.getLoggedInUser = jest.fn().mockImplementation(() => {
        throw new Error
      });
      expect(myAuthenticationPlugin.isAuthenticated).toThrow()
      myAuthenticationPlugin.getLoggedInUser = copyGetLoggedInUser;
    })
  })

  describe('Test for authenticate (email,password)', () => {
    it('signInWithEmailAndPassword (), Expected to be called with right parameters', async () => {
      await myAuthenticationPlugin.authenticate(email, password);
      expect(myAuthenticationPlugin.firebase.auth().signInWithEmailAndPassword).toBeCalledWith(email, password);
    })

    it('Expect authenticate () to throw if signInWithEmailAndPassword throws', async () => {
      afterEach(() => {
        jest.resetAllMocks()
      });
      myAuthenticationPlugin.firebase = {
        auth: jest.fn().mockReturnThis(),
        signInWithEmailAndPassword: jest.fn(() => {
          throw new Error
        }),
      }
      await expect(myAuthenticationPlugin.authenticate()).rejects.toThrow()
    })
  })

  describe('Test for signup (email,password)', () => {
    it('createUserWithEmailAndPassword (email,password), Expected to be called with right parameters', async () => {
      await myAuthenticationPlugin.signup(email, password)
      expect(myAuthenticationPlugin.firebase.auth().createUserWithEmailAndPassword).toBeCalledWith(email, password)
    })

    it('sendEmailVerification(), Check if the method is called', async () => {
      const actual = await myAuthenticationPlugin.signup(email, password)
      const userCredential = await myAuthenticationPlugin.firebase.auth().createUserWithEmailAndPassword(email, password)
      expect(actual).toEqual('Check your email for verification mail before logging in')
      if (userCredential.user != null) {
        expect(userCredential.user.sendEmailVerification).toBeCalled()
      }
    })

    it('Expect signup to throw if createUserWithEmailAndPassword throws ', async () => {
      afterEach(() => {
        jest.resetAllMocks()
      });
      myAuthenticationPlugin.firebase = {
        auth: jest.fn().mockReturnThis(),
        createUserWithEmailAndPassword: jest.fn(() => {
          throw new Error
        }),
      }
      await expect(myAuthenticationPlugin.signup()).rejects.toThrow()
    })

    it('Expect signup to throw if sendEmailVerification() throws', async () => {
      afterEach(() => {
        jest.resetAllMocks()
      });
      const userCredentialErrorMock = {
        user: {
          sendEmailVerification: jest.fn(() => { throw new Error })
        }
      }
      myAuthenticationPlugin.firebase = {
        auth: jest.fn().mockReturnThis(),
        createUserWithEmailAndPassword: jest.fn(() => userCredentialErrorMock)
      }
      await expect(myAuthenticationPlugin.signup()).rejects.toThrow()
    })
  })

  describe('Test for forgotPassword (email)', () => {
    it('sendPasswordResetEmail(email), Check if the method is called with right parameters and if the parent method returns a success response', async () => {
      const successMessage = await myAuthenticationPlugin.forgotPassword(email)
      expect(myAuthenticationPlugin.firebase.auth().sendPasswordResetEmail).toHaveBeenCalledWith(email)
      expect(successMessage).toEqual(`Reset password link sent to ${email}`)
    })

    it('Expect forgotPassword (email) to throw if sendPasswordResetEmail throws', async () => {
      afterEach(() => {
        jest.resetAllMocks()
      });
      myAuthenticationPlugin.firebase = {
        auth: jest.fn().mockReturnThis(),
        sendPasswordResetEmail: jest.fn(() => {
          throw new Error
        }),
      }
      await expect(myAuthenticationPlugin.forgotPassword()).rejects.toThrow()
    })
  })

  describe('Test for logout ()', () => {
    it('signout(), Check if the method is called', async () => {
      await myAuthenticationPlugin.logout()
      expect(myAuthenticationPlugin.firebase.auth().signOut).toBeCalled()
    })

    it('Expect logout () to throw if signOut() throws', async () => {
      afterEach(() => {
        jest.resetAllMocks()
      });
      myAuthenticationPlugin.firebase = {
        auth: jest.fn().mockReturnThis(),
        signOut: jest.fn(() => {
          throw new Error
        }),
      }
      await expect(myAuthenticationPlugin.logout()).rejects.toThrow()
    })
  })

  describe('Test for onAuthStateChanged ()', () => {
    const onAuthStateChangedCallback = (() => { })
    it('onAuthStateChanged(), Check if the method is called', async () => {
      await myAuthenticationPlugin.onAuthStateChanged(onAuthStateChangedCallback)
      expect(myAuthenticationPlugin.firebase.auth().onAuthStateChanged).toBeCalledWith(onAuthStateChangedCallback)
    })

    it('Expect onAuthStateChange to throw', () => {
      afterEach(() => {
        jest.resetAllMocks()
      });
      myAuthenticationPlugin.firebase = {
        auth: jest.fn().mockReturnThis(),
        onAuthStateChanged: jest.fn(() => {
          throw new Error
        }),
      }
      expect(myAuthenticationPlugin.onAuthStateChanged).toThrow()
    })
  })
})
