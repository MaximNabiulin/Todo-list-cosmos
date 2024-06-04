import React, { ChangeEvent, useCallback } from 'react';
import validator from 'validator';

const EMPTY_INPUT_ERROR_MESSAGE = 'Это поле обязательное к заполнению'
const NAME_VALIDATION_ERROR_MESSAGE = 'Поле должно содержать только латиницу или кириллицу';
const LOGIN_VALIDATION_ERROR_MESSAGE = 'Поле должно содержать только латиницу, цифры, дефис и спец символы';
const NOT_EMAIL_ERROR_MESSAGE = 'Неверный формат электронной почты.';

function validateEmpty(value: string): string | undefined {
  if (value === '') return EMPTY_INPUT_ERROR_MESSAGE;
}

function validateNames(value: string): string {
  if (value === '') return EMPTY_INPUT_ERROR_MESSAGE;
  const regex = /^[a-zа-яё]{2,}$/gi;
  if (!regex.test(value)) return NAME_VALIDATION_ERROR_MESSAGE;
  return '';
}

function validateLogin(value: string): string {
  if (value === '') return EMPTY_INPUT_ERROR_MESSAGE;
  const regex = /^[\w\\-]{2,}$/gi;
  if (!regex.test(value)) return LOGIN_VALIDATION_ERROR_MESSAGE;
  return '';
}

function validateEmail(value: string): string {
  if (value === '') return EMPTY_INPUT_ERROR_MESSAGE;
  if (!validator.isEmail(value)) return NOT_EMAIL_ERROR_MESSAGE;
  return '';
}

function validatePassword(value: string): string {
  if (value === '') return EMPTY_INPUT_ERROR_MESSAGE;
  return '';
}

export function useForm<T extends object>(inputValues: T ) {
  const [formValues, setFormValues] = React.useState<T>(inputValues);
  const [errors, setErrors] = React.useState<{ [key in keyof T]?: string }>({});
  const [isValid, setIsValid] = React.useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = event.target
    const { name, value } = target;

    const nameErrorMessage = validateNames(value);
    const emailErrorMessage = validateEmail(value);
    const loginErrorMessage = validateLogin(value);
    const passwordErrorMessage = validatePassword(value);
    const emptyErrorMessage = validateEmpty(value);

    switch (name) {
      // ---Валидация полей пользователя:---
      // потенциальные поля регистрации пользователя
      case 'firstName':
      case 'lastName':
      case 'patronymic':
        setErrors(oldState => ({
          ...oldState,
          [name]: nameErrorMessage
        }));
        target.setCustomValidity(nameErrorMessage);
        break;

      case 'email':
        setErrors(oldState => ({
          ...oldState,
          [name]: emailErrorMessage
        }));
        target.setCustomValidity(emailErrorMessage);
        break;

      // Поля для логина пользователя
      case 'login':
      setErrors(oldState => ({
        ...oldState,
        [name]: loginErrorMessage
      }));
      target.setCustomValidity(loginErrorMessage);
      break;

      case 'password':
        setErrors(oldState => ({
          ...oldState,
          [name]: passwordErrorMessage
        }));
        target.setCustomValidity(passwordErrorMessage);
        break;

      // ---Валидация полей задачи:---
      case 'title':
      case 'description':
      case 'dueDate':
        setErrors(oldState => ({
          ...oldState,
          [name]: emptyErrorMessage
        }));
        target.setCustomValidity(emptyErrorMessage || '');
        break;

      default:
        setErrors(oldState => ({
          ...oldState,
          [name]: target.validationMessage
        }));
    }

    setFormValues(oldState => ({
      ...oldState,
      [name]: value
    }));

    setIsValid((target.closest("form") as HTMLFormElement).checkValidity());
  };

  const resetForm = useCallback((
      newFormValues: T = {} as T,
      newErrors: { [key in keyof T]? : string } = {},
      newIsValid = false
    ) => {
      setFormValues(newFormValues);
      setErrors(newErrors);
      setIsValid(newIsValid);
    }, [setFormValues, setErrors, setIsValid]
  );
  return {
    formValues,
    handleChange,
    setFormValues,
    errors,
    isValid,
    resetForm
  };
}

