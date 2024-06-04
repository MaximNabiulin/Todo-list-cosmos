import React, { type FC } from 'react';
import SignForm from '../SignForm/SignForm';

import './Signin.css';

import { useForm } from '../../hooks/useForm';

const initValues = {
  login: '',
  password: '',
}

interface LoginFormValues {
  login: string
  password: string
}

interface ISigninProps {
  onLogin: (formData: LoginFormValues) => void,
  isLoading: boolean,
  submitError: string,
}



const Signin: FC<ISigninProps> = (props) => {
  const { onLogin, isLoading, submitError } = props;
  const {
    formValues,
    handleChange,
    errors,
    isValid,
  } = useForm(initValues);

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const {password, login} = formValues;
    if (!password || !login) return;
    // console.log(password);
    // console.log(login);

    onLogin(formValues);
  }

  return (
    <div className="auth-page">
      <SignForm
        name="signin"
        title="Авторизация"
        buttonText="Войти"
        // linkQuestionText="Ещё не зарегистрированы?"
        // linkText="Регистрация"
        // linkPath="signup"
        formValues={formValues}
        errors={errors}
        isValid={isValid}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitError={submitError}
      />
    </div>
  )
};

export default Signin;