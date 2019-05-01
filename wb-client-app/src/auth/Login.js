import React, { useEffect } from "react";
import { Form, Field } from "react-final-form";
import createFocusDecorator from "final-form-focus";
import { useOvermind } from "../overmind/overmind";
import { ROUTES } from "../routes/routes";
import { required } from "common/forms/validators";
import "../css/Auth.scss";

const focusOnError = createFocusDecorator();

export const Login = ({ history, ...props }) => {
  const { state, actions } = useOvermind();

  const onSubmit = values => {
    actions.login(values);
  };

  const handleRemoveBridge = e => {
    console.log("* removeing bridge");
    actions.removeBridge();
    history.push(ROUTES.home);
  };

  useEffect(() => {
    if (state.authenticated) {
      history.push(ROUTES.locks);
    }
  }, [state.authenticated]);

  return (
    <div className="Login">
      <h1 className="Login-Header">Login</h1>
      <Form
        onSubmit={onSubmit}
        decorators={[focusOnError]}
        render={({ handleSubmit, reset, submitting, pristine, values }) => (
          <form className="Login-Form" onSubmit={handleSubmit}>
            {state.login.errors && (
              <div className="Form-Errors">{state.login.errors.error}</div>
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
            <Field name="password" validate={required}>
              {({ input, meta }) => (
                <div className="Input">
                  <input {...input} type="password" placeholder="Password" />
                  {meta.error && meta.touched && (
                    <span className="Input-Error">{meta.error}</span>
                  )}
                </div>
              )}
            </Field>
            <div className="Login-Buttons">
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
      <p className="GoBack Login__Disconnect">
        or{" "}
        <span className="Link" onClick={handleRemoveBridge}>
          disconnect from the bridge
        </span>
      </p>
    </div>
  );
};
