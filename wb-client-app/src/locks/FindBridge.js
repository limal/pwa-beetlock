import React, { useEffect } from "react";
import { useOvermind } from "../overmind/overmind";
import { Form, Field } from "react-final-form";
import formatStringByPattern from "format-string-by-pattern";
import createFocusDecorator from "final-form-focus";
import { required } from "../common/forms/validators";
import "../css/Locks.scss";

const focusOnError = createFocusDecorator();

const parseNumbersOnly = value => {
  const onlyNumbers = value.replace(/[^\d]/g, "");

  return formatStringByPattern("9999-99999", onlyNumbers);
};

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
      <p className="Text Text--center">
        Please enter the bridge ID from the back of the bridge's cover.
      </p>
      <Form
        onSubmit={onSubmit}
        initialValues={{}}
        decorators={[focusOnError]}
        render={({ handleSubmit }) => (
          <form className="FindBridge__Form" onSubmit={handleSubmit}>
            <Field
              name="userFriendlyId"
              validate={required}
              parse={parseNumbersOnly}
            >
              {({ input, meta }) => (
                <div className="Input FindBridge__Input">
                  <input {...input} placeholder="____-_____" />
                  {meta.error && meta.touched && (
                    <span className="Input-Error Input-Error--center">
                      {meta.error}
                    </span>
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
