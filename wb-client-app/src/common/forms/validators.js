const MIN_PASSWORD_LENGTH = 8;

export const required = value =>
  value ? undefined : "Required. Please enter.";
export const password = value =>
  value.length >= MIN_PASSWORD_LENGTH
    ? undefined
    : `Password must have at least ${MIN_PASSWORD_LENGTH} characters`;

export const composeValidators = (...validators) => value =>
  validators.reduce((error, validator) => error || validator(value), undefined);
