import React, { useEffect } from "react";
import { useOvermind } from "../overmind/overmind";
import { Form, Field } from "react-final-form";
import createFocusDecorator from "final-form-focus";
import { required } from "../common/forms/validators";
import "../css/Locks.scss";

const focusOnError = createFocusDecorator();

export const FindBridge = () => {
  const { state, actions } = useOvermind();

  const onSubmit = values => {
    console.log("* values", values);
    actions.setWifiSelected({
      wifiSelected: values.wifiSelected,
      wifiPassword: values.password
    });
  };

  return (
    <div className="FindBridge">
      <h1 className="FindBridge__Header">Find your bridge</h1>
      <p className="Text">
        Please enter the bridge ID from the back of the bridge's cover.
      </p>
      <Form
        onSubmit={onSubmit}
        initialValues={{}}
        decorators={[focusOnError]}
        render={({ handleSubmit }) => (
          <form className="FindBridge__Form" onSubmit={handleSubmit}>
            <Field name="userFriendlyId" validate={required}>
              {({ input, meta }) => (
                <div className="Input">
                  <input {...input} placeholder="Bridge ID..." />
                  {meta.error && meta.touched && (
                    <span className="Input-Error">{meta.error}</span>
                  )}
                </div>
              )}
            </Field>
            <div className="FindBridge__Buttons">
              <button className="Button Button--padded" type="submit">
                FIND
              </button>
            </div>
          </form>
        )}
      />
    </div>
  );
};
