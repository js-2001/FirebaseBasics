import React, { Component } from 'react';
import firebase, { usersCollection } from "../../utils/firebase"

class LoginForm extends Component {

    state = {
        register: true,
        user: {
            email:'',
            password:''
        }
    }

    handleForm = (e) => {
        e.preventDefault()
        const {email, password} = this.state.user;
        if(this.state.register){
            firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then(response => {
                    this.handleStoreRegisterUser(response);
                    response.user.sendEmailVerification().then(()=> {
                        console.log("email sent")
                    })
                })
                .catch( e => {
                    console.log(e)
                })
        } else {
            firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then(response => {
                    console.log("AUTH: ", response)
                })
                .catch( e => {
                    console.log(e)
                })
        }

    }

    handleGoogleSignIn = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase
            .auth()
            .signInWithPopup(provider)
            .then((res) => {
                this.handleStoreRegisterUser(res);
                console.log(res)
            })
            .catch((e) => console.log(e))
    }

    handleStoreRegisterUser = (data) => {
        usersCollection
        .doc(data.user.uid)
        .set({
            email: data.user.email
        })
        .then( data => { console.log(data)})
        .catch( e => {console.log(e) })
    }

    changeHandler = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        this.setState( prevState => ({
            user:{
                ...prevState.user,
                [name]: value
            }
        }))

        
    }

    handleUpdateEmail = () => {
        let getUser = firebase.auth().currentUser
        if (getUser) {
            getUser.updateEmail("newemail@gmail.com").then(res => console.log(res))
        }
    }

    handleLogout = () => {
        console.log("logout bro")
        firebase 
            .auth()
            .signOut()
            .then(() => console.log("Logged out Successfully"))
    }

    getUserInfo = () => {
        let getUser = firebase.auth().currentUser;
        
        // allows them to change password and email without having to log in again
        let credential = firebase.auth.EmailAuthProvider.credential('newemail@gmail.com', 'testing123');

        if (getUser) {

            getUser.reauthenticateWithCredential(credential).then(res => {
                getUser.updateEmail('steve@gmail.com')
            })

            // getUser.getIdToken().then(res => console.log(res))
            // getUser.getIdTokenResult().then(res => console.log(res))
        } else {
            console.log("no user info")
        }
    }

    handleUpdateProfile = () => {
        let getUser = firebase.auth().currentUser;
        getUser.updateProfile({
            displayName: "Janice",
            photoURL: "https://www.nj.com/resizer/h8MrN0-Nw5dB5FOmMVGMmfVKFJo=/450x0/smart/cloudfront-us-east-1.images.arcpublishing.com/advancelocal/SJGKVE5UNVESVCW7BBOHKQCZVE.jpg"
        }).then(() => {
            console.log(getUser)
        })
    }

   
    render(){
        return(
            <>
                <form onSubmit={ (e)=> this.handleForm(e) }>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            onChange={ (e) => this.changeHandler(e)}
                        >
                        </input>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            onChange={ (e) => this.changeHandler(e)}
                        >
                        </input>
                    </div>

                    <button type="submit" className="btn btn-primary">
                        { this.state.register ? 'Register' : 'Sign in'}
                    </button>

                </form>
                <hr />
                <button onClick={() => this.handleLogout()} className="btn btn-primary">Logout</button>
                <hr />
                <button onClick={() => this.getUserInfo()} className="btn btn-primary">Ask about user Info</button>
                <hr />
                <button onClick={() => this.handleUpdateEmail()} className="btn btn-primary">Update Email</button>
                <hr />
                <button onClick={() => this.handleUpdateProfile()} className="btn btn-primary">Update Profile</button>
                <hr />
                <button onClick={() => this.handleGoogleSignIn()} className="btn btn-primary">Google Signin</button>
            </>

        )
    }
}

export default LoginForm;