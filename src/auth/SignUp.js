import React, { useEffect } from "react";
import { Form, Field } from "react-final-form";
import createFocusDecorator from "final-form-focus";
import { useOvermind } from "../overmind/overmind";
import { ROUTES } from "../routes/routes";
import { composeValidators, password, required } from "common/forms/validators";
import "../css/Auth.scss";

const focusOnError = createFocusDecorator();

export const SignUp = ({ history, ...props }) => {
  const { state, actions } = useOvermind();

  const onSubmit = values => {
    actions.register(values);
  };

  useEffect(() => {
    if (state.authenticated) {
      history.push(ROUTES.locks);
    }
  }, [state.authenticated]);

  return (
    <div className="SignUp">
      <h1 className="SignUp-Header">SignUp</h1>
      <p className="Text Text--center">
        Please set up your master account for the lock.
      </p>
      <Form
        onSubmit={onSubmit}
        decorators={[focusOnError]}
        render={({ handleSubmit, reset, submitting, pristine, values }) => (
          <form className="SignUp-Form" onSubmit={handleSubmit}>
            {state.signup.errors && (
              <div className="Form-Errors">{state.signup.errors.error}</div>
            )}
            <Field name="username" validate={required}>
              {({ input, meta }) => (
                <div className="Input">
                  <input
                    {...input}
                    type="text"
                    placeholder="Email address..."
                    autoFocus
                  />
                  {meta.error && meta.touched && (
                    <span className="Input-Error">{meta.error}</span>
                  )}
                </div>
              )}
            </Field>
            <Field
              name="password"
              validate={composeValidators(required, password)}
            >
              {({ input, meta }) => (
                <div className="Input">
                  <input {...input} type="password" placeholder="Password" />
                  {meta.error && meta.touched && (
                    <span className="Input-Error">{meta.error}</span>
                  )}
                </div>
              )}
            </Field>
            <div className="SignUp-Buttons">
              <button
                className="Button"
                type="submit"
                disabled={state.login.loading || submitting}
              >
                Submit
              </button>
            </div>
          </form>
        )}
      />
      <p className="GoBack">
        or{" "}
        <span className="Link" onClick={e => history.push(ROUTES.login)}>
          login
        </span>
      </p>
    </div>
  );
};
