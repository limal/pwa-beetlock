import React from "react";
import { Form, Field } from "react-final-form";
import createFocusDecorator from "final-form-focus";
import { useOvermind } from "../state/index";
import { required } from "common/forms/validators";
import "../css/Auth.scss";

const focusOnError = createFocusDecorator();

export const Login = ({}) => {
  const { state } = useOvermind();

  const onSubmit = values => {
    window.alert(JSON.stringify(values, 0, 2));
  };

  return (
    <div className="Login">
      <h1 className="Login-Header">Login</h1>
      <Form
        onSubmit={onSubmit}
        decorators={[focusOnError]}
        render={({ handleSubmit, reset, submitting, pristine, values }) => (
          <form className="Login-Form" onSubmit={handleSubmit}>
            <Field name="email" validate={required}>
              {({ input, meta }) => (
                <div className="Input">
                  <input
                    {...input}
                    type="text"
                    placeholder="Email address"
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
              <button className="Button" type="submit" disabled={submitting}>
                Submit
              </button>
            </div>
            {JSON.stringify(state)}
          </form>
        )}
      />
    </div>
  );
};
