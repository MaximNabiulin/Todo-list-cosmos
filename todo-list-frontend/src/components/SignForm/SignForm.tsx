// Отдельный гибкий компонент формы, в дальнейшем может быть использован для регистрации
// import { Link } from 'react-router-dom';
import React, { type FC } from 'react';
import './SignForm.css';

interface ISignFormProps {
  name: string,
  title: string,
  buttonText: string,
  // linkQuestionText: string,
  // linkText: string,
  // linkPath: string,
  children?: React.ReactNode,
  formValues: {
    login: string
    password: string
  },
  errors: {
    login?: string | undefined;
    password?: string | undefined;
  },
  isValid: boolean,
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void,
  onSubmit: (evt: React.FormEvent<HTMLFormElement>) => void,
  isLoading: boolean,
  submitError: string,
}

const SignForm: FC<ISignFormProps> = (props) => {
  const {
    name,
    title,
    buttonText,
    // linkQuestionText,
    // linkText,
    // linkPath,
    children,
    formValues,
    errors,
    isValid,
    onChange,
    onSubmit,
    isLoading,
    submitError
  } = props;

  const inputLoginClassName =
    `${!errors.login
      ? 'auth__input'
      : 'auth__input auth__input_error'
    }`;

  const inputPasswordClassName =
    `${!errors.password
      ? 'auth__input'
      : 'auth__input auth__input_error'
    }`;

  const isButtonDisabled = () => {
    return isLoading ||
    !isValid;
  }

  return (
    <div className="auth">
      <h3 className="auth__title">{title}</h3>
      <form
        id={`${name}-form`}
        name={`${name}-form`}
        onSubmit={onSubmit}
        noValidate
        className="auth__form"
      >
        <div className="auth__inputs">
          {children}
          <div className="auth__input-wrapper">
            <label htmlFor="auth-login" className="auth__input-label">Логин</label>
            <input
                type="text"
                id="auth-login"
                name="login"
                value={formValues.login}
                onChange={onChange}
                disabled={isLoading}
                required
                className={inputLoginClassName}
            />
            <span className="login-error auth__error-span">{errors.login}</span>
          </div>
          <div className="auth__input-wrapper">
            <label htmlFor="auth-password" className="auth__input-label">Пароль</label>
            <input
              id="auth-password"
              type="password"
              name="password"
              value={formValues.password}
              onChange={onChange}
              disabled={isLoading}
              required
              className={inputPasswordClassName}
            />
            <span className="password-error auth__error-span">{errors.password}</span>
          </div>
        </div>
        <p className="auth__submit-error">{submitError}</p>
        <button
          id = "auth-submit"
          type="submit"
          disabled={isButtonDisabled()}
          className="auth__submit-button"
        >
          {buttonText}
        </button>
        {/* <div className="auth__link-container">
          <p className="auth__link-text">{linkQuestionText}</p>
          <Link to={`/${linkPath}`} className="auth__link">{linkText}</Link>
        </div> */}
      </form>
    </div>
  )
}

export default SignForm;