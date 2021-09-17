import React from 'react';

import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

import auth from '@react-native-firebase/auth';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk';

GoogleSignin.configure({
  webClientId: '53620749362-4ua9a7jlcpidk469e7u1nn9cls756ani.apps.googleusercontent.com',
});


export default class App extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = 
    {
      signedIn : false,
      signedInVia : 'none',
      displayMessage : 'none'
    }
  }


  
  componentDidMount()
  {
    if(this.state.signedIn === false)
    {
      this.setState({displayMessage : 'Not Logged in', signedInVia : 'None'});
    }
  }

  loginAnonymously()
  {
    if(this.state.signedIn === false)
    {
      auth().signInAnonymously()
      .then(() => {
        this.setState({signedIn : true, signedInVia : 'Anonymously', displayMessage : 'Signed In Anonymously'});
      })
      .catch((error) => {
        var message = '';
        if (error.code === 'auth/operation-not-allowed') {
          console.log('Enable anonymous in your firebase console.');
          message = 'Enable anonymous in your firebase console. ';
        }

        this.setState({signedIn : false, signedInVia : 'None', displayMessage : message + error});
      });
    }
    else
    {
      this.setState({displayMessage : 'Already Signed In.'});
    }
  }

  registerEmailPassword()
  {
    if(this.state.signedIn === false)
    {
      auth().createUserWithEmailAndPassword('dummy@mywebsite.com', 'helloworld')
      .then(() => {
        this.setState({signedIn : true, signedInVia : 'Custom Email', displayMessage : 'Registered and Signed In Via Custom Email'});
      })
      .catch((error) => {
        var message = '';
        if (error.code === 'auth/email-already-in-use') {
          message += 'That email address is already in use! ';
          console.log('That email address is already in use!');
        }
    
        if (error.code === 'auth/invalid-email') {
          message += 'That email address is invalid! ';
          console.log('That email address is invalid!');
        }

        this.setState({signedIn : false, signedInVia : 'None', displayMessage : message + error});
      });
    }
    else
    {
      this.setState({displayMessage : 'Already Signed In.'});
    }
  }

  loginEmailPassword()
  {
    if(this.state.signedIn === false)
    {
      auth().signInWithEmailAndPassword('dummy@mywebsite.com', 'helloworld')
      .then(() => {
        this.setState({signedIn : true, signedInVia : 'Custom Email', displayMessage : 'Signed In Via Custom Email'});
      })
      .catch((error) => {
        var message = '';
        if (error.code === 'auth/email-already-in-use') {
          message += 'That email address is already in use! ';
          console.log('That email address is already in use!');
        }
    
        if (error.code === 'auth/invalid-email') {
          message += 'That email address is invalid! ';
          console.log('That email address is invalid!');
        }

        this.setState({signedIn : false, signedInVia : 'None', displayMessage : message + error});
      });
    }
    else
    {
      this.setState({displayMessage : 'Already Signed In.'});
    }
  }

  loginWithGoogle()
  {
    if(this.state.signedIn === false)
    {
      this.onGoogleButtonPress()
      .then(() => {
        this.setState({signedIn : true, signedInVia : 'Google', displayMessage : 'Signed In Via Google'});
      })
      .catch((error) => {
        var message = '';
        if (error.code === 'auth/email-already-in-use') {
          message += 'That email address is already in use! ';
          console.log('That email address is already in use!');
        }
    
        if (error.code === 'auth/invalid-email') {
          message += 'That email address is invalid! ';
          console.log('That email address is invalid!');
        }

        this.setState({signedIn : false, signedInVia : 'None', displayMessage : message + error});
      });
    }
    else
    {
      this.setState({displayMessage : 'Already Signed In.'});
    }
  }

  async onGoogleButtonPress() {
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();
  
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }
  
  loginWithFacebook()
  {
    if(this.state.signedIn === false)
    {
      this.onFacebookButtonPress()
      .then(() => {
        this.setState({signedIn : true, signedInVia : 'Facebook', displayMessage : 'Signed In Via Facebook'});
      })
      .catch((error) => {
        var message = '';
        if (error.code === 'auth/email-already-in-use') {
          message += 'That email address is already in use! ';
          console.log('That email address is already in use!');
        }
    
        if (error.code === 'auth/invalid-email') {
          message += 'That email address is invalid! ';
          console.log('That email address is invalid!');
        }

        this.setState({signedIn : false, signedInVia : 'None', displayMessage : message + error});
      });
    }
    else
    {
      this.setState({displayMessage : 'Already Signed In.'});
    }
  }

  async onFacebookButtonPress() {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
  
    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }
  
    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();
  
    if (!data) {
      throw 'Something went wrong obtaining access token';
    }
  
    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
  
    // Sign-in the user with the credential
    return auth().signInWithCredential(facebookCredential);
  }

  signOutNow()
  {
    if(this.state.signedIn === true)
    {
      auth().signOut()
      .then(() => {
        this.setState({signedIn : false, signedInVia : 'None', displayMessage : 'Signed Out Successful.'});
      });
    }
    else
    {
      this.setState({displayMessage : 'Not Logged In Already.'});
    }
  }

  render()
  {
    return(
      <View style = {styles.mainContainer}>
        <Text>{this.state.displayMessage}</Text>

        <TouchableOpacity style = {styles.logInButton} onPress = {() => this.loginAnonymously()}>
          <Text style = {styles.logInText}>Log In Anonymously</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style = {styles.logInButton} onPress = {() => this.registerEmailPassword()}>
          <Text style = {styles.logInText}>Register Email and Password(Dummy)</Text>
        </TouchableOpacity>

        <TouchableOpacity style = {styles.logInButton} onPress = {() => this.loginEmailPassword()}>
          <Text style = {styles.logInText}>Log In with Email and Password(Dummy)</Text>
        </TouchableOpacity>

        <TouchableOpacity style = {styles.logInButton} onPress = {() => this.loginWithGoogle()}>
          <Text style = {styles.logInText}>Log In with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style = {styles.logInButton} onPress = {() => this.loginWithFacebook()}>
          <Text style = {styles.logInText}>Log In with Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity style = {styles.logInButton} onPress = {() => this.signOutNow()}>
          <Text style = {styles.logInText}>Sign out now</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer : 
  {
    flex : 1,
    flexDirection : 'column',
    alignItems : 'center',
    justifyContent : 'space-evenly',
    marginVertical : 20
  },
  logInButton : 
  {
    height : 50,
    width : 200,
    backgroundColor : 'green',
    justifyContent : 'center',
    alignItems : 'center'
  },
  logInText : 
  {
    color : 'white',
    fontSize : 16,
    textAlign : 'center'
  }
});