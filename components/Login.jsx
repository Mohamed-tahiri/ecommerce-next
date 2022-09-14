import Cookies from 'js-cookie';
import React, { useContext, useState } from 'react'
import { toast } from 'react-hot-toast';
import { Store } from '../context/StateContext';
import axios from 'axios'
import { getError } from '../utils/error';

const Login = () => {
    const { state, dispatch} = useContext(Store);
    const {
        login,
        registerForm
    } = state;

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const showRegisterForm = () => {
        dispatch({type: registerForm ? 'RegisterFORM_OFF' : 'RegisterFORM_ON'});
        const newRegisterForm = !registerForm;
        Cookies.set('registerForm', newRegisterForm ? 'ON' : 'OFF' );
    }

    const hideLogin = () => {
        dispatch({type: login ? 'LOGIN_OFF' : 'LOGIN_ON'});
        const newLogin = !login;
        Cookies.set('login', newLogin ? 'ON' : 'OFF' );
    }

    const submitHandler = async () => {
        try {
            const { data } = await axios.post(
                '/api/users/login', 
                {
                    email, 
                    password
                }
            );
            
            dispatch({type:'USER_LOGIN', payload: data});
            Cookies.set('userInfo', JSON.stringify(data));
            toast.success('Login successfully')
            hideLogin();
        }catch(error) {
            toast.error(getError(error));
        }
    }

    return (
        <div className='login'>
            <input
                className='input_login'
                type={'email'}
                placeholder="mail@mail.com"
                onChange={(e) => {setEmail(e.target.value)}}
            />      
            <input
                className='input_login'
                type={'password'}
                placeholder="*********"
                onChange={(e) => {setPassword(e.target.value)}}
            />      
            <button
                type='button'
                className='btn-login'
                onClick={submitHandler}
            >
                Login
            </button>
            
            <p className='login-change'>
                Don&#39;t have an account ?
                <span
                    className='sign'
                    onClick={showRegisterForm}
                > 
                    Sign up
                </span>
            </p>
        </div>
    )
}

export default Login
