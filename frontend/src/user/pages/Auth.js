import React, { useState, useContext } from 'react'

import Card from '../../shared/components/UIElements/Card'
import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import ImageUpload from '../../shared/components/FormElements/ImageUpload'

import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from '../../shared/util/validators'

import { useForm } from '../../shared/hooks/form-hook'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'

import './Auth.css';

const Auth = () => {
  // context helper
  const auth = useContext(AuthContext)

  const [isLoginMode, setIsLoginMode] = useState(true)
  // helper http request 
  const { isLoading, error, sendRequest, clearError } = useHttpClient()

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
  
  // login or signUp mode ?
  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData({
          ...formState.inputs,
          name: undefined,
          image: undefined
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
          },
          image:{
            value: null,
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
    console.log('Authform: ', formState.inputs)

    if (isLoginMode) {
      try {
        // is in LOGIN mode using http-hook-helper
        const responsData = await sendRequest(
          'http://localhost:5000/api/users/login', 'POST', 
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }), 
          {
            'Content-Type': 'application/json'
          }
        )
        auth.login(responsData.user.id)
      } catch (err) {
        console.log(err)
      }
      // is in 'sign-Up-mode' now  
    } else {
      try {
        const responseData = await sendRequest(
          'http://localhost:5000/api/users/signup', 
          'POST',
          JSON.stringify({
            name : formState.inputs.name.value, 
            email: formState.inputs.email.value, 
            password: formState.inputs.password.value
          }),
          {'Content-Type' : 'application/json'},
        )
        // console.log('responseData', responseData)
        auth.login(responseData.user.id)
      } catch (err) {
        // empty catchblock
      }
    }
  }

  return (
    <React.Fragment>
      {/* not working for some damn reason */}
      {/* <ErrorModal error={error} onClear={clearError} /> */}
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
          {!isLoginMode && 
            <ImageUpload center id="Image" onInput={inputHandler} />}
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
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password, at least 6 characters."
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
