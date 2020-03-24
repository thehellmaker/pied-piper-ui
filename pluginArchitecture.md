# pied-piper-ui-login-plugin-architecture

## Authentication

The signature of **isAuthenticated API** will have no parameters,

**isAuthenticated API** just checks for the validity of the authentication token and checks if the user is authenticated or not and what user id it maps to.

Within the **isAuthenticated API** we can have different implementations for authentication like **Firebase** or **AWS-Cognito**

For different implementations, It will fetch different authentication tokens which are stored client side on the browser cookies, For example for **AWS-Cognito** it will fetch the auth token of **AWS-Cognito** and for **Firebase** it will fetch the auth token for **Firebase**

According to the plugin selected during build-time different components will render the authentication page, For example for **AWS-Amplify** it will render the Amplify component and for **Firebase** it will render a firebase component.

## Authorization

The signature of the **isAuthorized API** will take three parameters namely : **Authentication-Token** , **Pied-Piper-Resource-Name(PRN)**,**Action**

**Authentication-Token**

Authentication token returned by **IsAuthenticated API**

**Pied-Piper-Resource-Name(PRN)**

All the resources we want to restrict or give access too must has a PRN. PRN must either reference to a URL or Amazon-Resournce-Name(ARN) in the backend of the **isAuthorized API**.

**Action**

What action we want to authorize to be taken on that particular resource. Actions include Read,Write or Update

**isAuthorized API** checks if that user has access to the resource he is requesting or not and the type of access the user has for the requested resource (Action)