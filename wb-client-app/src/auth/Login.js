import React, { useEffect } from "react";
import { Form, Field } from "react-final-form";
import createFocusDecorator from "final-form-focus";
import { useOvermind } from "../overmind/overmind";
import { required } from "common/forms/validators";
import "../css/Auth.scss";

const focusOnError = createFocusDecorator();

export const Login = props => {
  const { state, actions } = useOvermind();

  const onSubmit = values => {
    actions.login(values);
  };

  useEffect(() => {
    if (state.authenticated) {
      props.history.push("/locks");
    }
  }, [state.authenticated]);

  return (
    <div className="Login">
      <h1 className="Login-Header">Login</h1>
      <Form
        onSubmit={onSubmit}
        initialValues={{ username: "limal", password: "dupa8" }}
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
                    placeholder="username address"
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
    </div>
  );
};