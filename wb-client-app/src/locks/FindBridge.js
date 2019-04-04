import React, { Fragment, useEffect } from "react";
import { useOvermind } from "../overmind/overmind";
import { Form, Field } from "react-final-form";
import formatStringByPattern from "format-string-by-pattern";
import createFocusDecorator from "final-form-focus";
import { Spinner } from "../common/Spinner";
import { required } from "../common/forms/validators";
import { GoBack } from "../common/GoBack";
import { ROUTES } from "../routes/routes";
import "../css/Locks.scss";
import { action } from "overmind";

const focusOnError = createFocusDecorator();

const CHECK_BRIDGE_INTERVAL = 5000;

const parseNumbersOnly = value => {
  const onlyNumbers = value.replace(/[^\d]/g, "");

  return formatStringByPattern("9999-99999", onlyNumbers);
};

let interval = null;

export const FindBridge = ({ history }) => {
  const { state, actions } = useOvermind();

  useEffect(() => {
    if (state.bridge.ip && state.bridge.ip.length > 0) {
      history.push(ROUTES.foundBridge);
      return;
    }

    if (state.bridge.finding === true && !interval) {
      interval = setInterval(() => {
        actions.findBridge({ userFriendlyId: state.bridge.userFriendlyId });
      }, CHECK_BRIDGE_INTERVAL);

      console.log("* new interval", interval);
    }

    if (!state.bridge.finding && interval) {
      console.log("* clearing interval", interval);
      clearInterval(interval);
      interval = null;
    }
  }, [state.bridge.finding, state.bridge.ip]);

  const onCancel = e => {
    actions.cancelFindingBridge();
  };

  const onSubmit = values => {
    console.log("* values", values);
    actions.findBridge({
      userFriendlyId: values.userFriendlyId
    });
  };

  return (
    <div className="FindBridge">
      {state.bridge.finding ? (
        <Fragment>
          <h1 className="FindBridge__Header">FIND BRIDGE</h1>
          <Spinner width={80} className="FindBridge__Spinner" />
          <p className="Text Text--center">
            Please wait until the connection is established with the bridge.
          </p>
          <p className="Text Text--center">
            Make sure you set up a WiFi hot spot with correct name and password.
          </p>
          <div>
            <p className="Text Text--center">
              Trying to connect to a bridge identifying as:
            </p>
            <h1 className="FindBridge__Header">
              {state.bridge.userFriendlyId}
            </h1>
            <div className="FindBridge__Buttons">
              <button className="Button" onClick={onCancel}>
                Cancel
              </button>
            </div>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <h1 className="FindBridge__Header">Find your bridge</h1>
          <p className="Text Text--center">
            Please enter the bridge ID from the back of the bridge's cover.
          </p>
          <Form
            onSubmit={onSubmit}
            initialValues={{ userFriendlyId: state.bridge.userFriendlyId }}
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
                  <button className="Button" type="submit">
                    FIND
                  </button>
                </div>
              </form>
            )}
          />
          <GoBack history={history} route={ROUTES.hotSpot} />
        </Fragment>
      )}
    </div>
  );
};
