import React, { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { API_BASEURL, sendGetRequest } from "../Api";
import AutoForm, { FormInput } from "../components/Form";
import { UserContext } from "../User";

const loginFields: FormInput[] = [
    {
        name: 'username',
        placeholder: 'Username',
        type: 'text'
    },
    {
        name: 'password',
        placeholder: 'Password',
        type: 'password'
    }
];

const registerFields: FormInput[] = [...loginFields, {
    name: 'name',
    placeholder: 'Display name',
    type: 'text'
}];

const fields = {
    'login': loginFields,
    'register': registerFields
};

const actions = {
    'login': 'Login',
    'register': 'Register'
};

const otherActionText = {
    'login': 'or, if you don\'t have an account',
    'register': 'or, if you already have an account'
};

const Login = () => {
    const userContext = useContext(UserContext);

    const [loginError, setLoginError] = useState<string | null>(null);
    const [openPage, setOpenPage] = useState<'login' | 'register'>('login');

    const onSubmitLogin = (formData: { [id: string]: string }) => {
        sendGetRequest(`${API_BASEURL}/User/login`, formData)
            .then((req) => req.json())
            .then((json) => {
                userContext.setUser({
                    username: json['username'],
                    playerId: json['playerId'],
                    loggedIn: true
                });
            })
            .catch((err) => setLoginError(err.title));
    }

    const onSubmitRegister = (formData: { [id: string]: string }) => {

    }

    const switchPage = () => {
        if(openPage === 'login') {
            setOpenPage('register');
            return;
        }
        setOpenPage('login');
    }

    return (
        <Card bg="dark" text="white" 
        style={{ maxWidth: '36rem', marginLeft: 'auto', marginRight: 'auto', marginTop: '2em' }} 
        className="text-center">
            <Card.Header>Welcome!</Card.Header>
            <Card.Body>
                <Card.Title>Please {openPage}.</Card.Title>
                <AutoForm action={actions[openPage]} 
                    inputs={fields[openPage]}
                    onSubmit={openPage === 'login' ? onSubmitLogin : onSubmitRegister} />
                {loginError && <Card.Text>{loginError}</Card.Text>}
                <Card.Text>{otherActionText[openPage]}</Card.Text>
                <Button variant="warning" onClick={switchPage}>{openPage === 'login' ? 'Register' : 'Login'}</Button>
            </Card.Body>
        </Card>
    )
}

export default Login;