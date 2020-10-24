import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context'

import './Auth.css';

const Auth = () => {
  // context helper
  const auth = useContext(AuthContext)

  const [isLoginMode, setIsLoginMode] = useState(true)
  // loading wheel feedback shissle
  const [isLoading, setIsLoading] = useState(false)
  // errors: undefined at start
  const [error, setError] = useState()

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      }
    },
    false
  )
  
  // login or signUp mode 
  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData({
          ...formState.inputs,
          name: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      )
      // signup mode
    } else {
      setFormData({
          ...formState.inputs,
          name: {
            value: '',
            isValid: false
          }
        },
        false
      );
    }
    setIsLoginMode(prevMode => !prevMode);
  }

  const authSubmitHandler = async event => {
    event.preventDefault();
    // connect to backend
    setIsLoading(true)
    if (isLoginMode) {
      try {
        // is in LOGIN mode
        const response = await fetch('http://localhost:5000/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
        })
        // actual response payload
        const responseData = await response.json()
        // status is a NOT-200
        if (!response.ok) {
          throw new Error(responseData.message)
        }
        console.log('responseData login', responseData)
        setIsLoading(false)
        auth.login()
      } catch (err) {
        console.log(err)
        setIsLoading(false)
        // something else than a 400 or 500'ish error occured
        setError(err.message || 'completely obsolete auth error message from frontend.')
      }
    } else {
      // is in sign-Up-mode now  
      try {
        const response = await fetch('http://localhost:5000/api/users/signup', {
          method: 'POST',
          headers: {
            'Content-Type' : 'application/json'
          },
          body: JSON.stringify({
            name : formState.inputs.name.value, 
            email: formState.inputs.email.value, 
            password: formState.inputs.password.value
          }),
        })
        // actual response payload
        const responseData = await response.json()
        // status is a NOT-200
        if (!response.ok) {
          throw new Error(responseData.message)
        }
        console.log('responseData', responseData)
        setIsLoading(false)
        auth.login()
      } catch (err) {
        console.log(err)
        setIsLoading(false)
        // something else than a 400 or 500'ish error occured
        setError(err.message || 'completely obsolete auth error message from frontend.')
      }
    }
  }

  const errorHandler = () => {
    // reset to
    setError(null)
  }

  return (
    <React.Fragment>
      {/* not working for some damn reason */}
      {/* <ErrorModal error={error} onClear={errorHandler} /> */}
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay/>}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputHandler}
            />
          )}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid password, at least 5 characters."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
        </Button>
      </Card>
    </React.Fragment>
  )
}

export default Auth;
