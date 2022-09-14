import React, { useContext, useState } from 'react'
import { Store } from '../context/StateContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Cookies from 'js-cookie';
import { getError } from '../utils/error';

const Register = () => {
    const { state, dispatch} = useContext(Store);
    const {
        login,
        registerForm
    } = state;

    const hideLogin = () => {
        dispatch({type: login ? 'LOGIN_OFF' : 'LOGIN_ON'});
        const newLogin = !login;
        Cookies.set('login', newLogin ? 'ON' : 'OFF' );
    }

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();

    const submitHandler = async () => {
        if(password !== confirmPassword) {
            toast.error("Passwords don't match");
            return ;
        }

        try {
            const { data } = await axios.post(
                '/api/users/register', 
                {
                    name, 
                    email, 
                    password
                }
            );
            
            dispatch({type:'USER_LOGIN', payload: data});
            Cookies.set('userInfo', JSON.stringify(data));
            hideLogin();
        }catch(error) {
            toast.error(getError(error));
        }
    }
    
    const hideRegisterForm = () => {
        dispatch({type: registerForm ? 'RegisterFORM_OFF' : 'RegisterFORM_ON'});
        const newRegisterForm = !registerForm;
        Cookies.set('registerForm', newRegisterForm ? 'ON' : 'OFF' );
    }

    return (
        <div className='login'>
            <input
                className='input_login'
                type={'text'}
                placeholder="ex: Mohamed TAHIRI"
                onChange={(e) => {setName(e.target.value)}}
            />
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
            <input
                className='input_login'
                type={'password'}
                placeholder="*********"
                onChange={(e) => {setConfirmPassword(e.target.value)}}
            />      
            <button
                type='button'
                className='btn-login'
                onClick={submitHandler}
            >
                Sign up
            </button>
            <p className='login-change'>
                Have an account? 
                <span
                    className='sign'
                    onClick={hideRegisterForm}
                > 
                    Log in
                </span>
            </p>
        </div>
  )
}

export default Register
