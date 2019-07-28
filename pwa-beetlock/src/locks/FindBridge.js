import React, { Fragment, useEffect, useState } from "react";
import { useOvermind } from "../overmind/overmind";
import { Form, Field } from "react-final-form";
import formatStringByPattern from "format-string-by-pattern";
import createFocusDecorator from "final-form-focus";
import { Spinner } from "../common/Spinner";
import { required } from "../common/forms/validators";
import { GoBack } from "../common/GoBack";
import { ROUTES } from "../routes/routes";
import "../css/BridgeWifi.scss";
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

  const [showIpField, setShowIpField] = useState(false);

  useEffect(() => {
    if (state.bridge.ip && state.bridge.ip.length > 0) {
      clearInterval(interval);
      history.push(ROUTES.foundBridge);
      return;
    }

    if (state.bridge.finding === true && !interval) {
      interval = setInterval(() => {
        actions.findBridge({ userFriendlyId: state.bridge.userFriendlyId });
      }, CHECK_BRIDGE_INTERVAL);
    }

    if (!state.bridge.finding && interval) {
      clearInterval(interval);
      interval = null;
    }
  }, [state.bridge.finding, state.bridge.ip]);

  const onCancel = e => {
    actions.cancelFindingBridge();
  };

  const toggleIpField = e => {
    setShowIpField(!showIpField);
  };

  const onSubmit = values => {
    console.log("* values", values);
    if (values.manualIp && values.manualIp.length) {
      actions.setManualBridge({ ipAddress: values.manualIp });
    } else {
      actions.findBridge({
        userFriendlyId: values.userFriendlyId
      });
    }
  };

  return (
    <div className="FindBridge">
      {state.bridge.finding ? (
        <Fragment>
          <h1 className="FindBridge__Header">FIND BRIDGE</h1>
          <Spinner width={80} className="FindBridge__Spinner" />
          {state.bridge.error && (
            <div className="ErrorMessage">
              {state.bridge.error}
              <br />
              <br />
              Please check that bridge ID below is correct.
            </div>
          )}
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
                {!showIpField && (
                  <Field
                    name="userFriendlyId"
                    validate={required}
                    parse={parseNumbersOnly}
                  >
                    {({ input, meta }) => (
                      <div className="Input FindBridge__Input">
                        <input {...input} placeholder="____-_____" autoFocus />
                        {meta.error && meta.touched && (
                          <span className="Input-Error Input-Error--center">
                            {meta.error}
                          </span>
                        )}
                      </div>
                    )}
                  </Field>
                )}
                <p
                  className="Text Text--center CursorPointer"
                  onClick={toggleIpField}
                >
                  {!showIpField ? (
                    <span>
                      or <span className="Underlined">enter</span> the IP
                      address manually
                    </span>
                  ) : (
                    <span>
                      <span className="Underlined">Cancel</span> manually
                      entering IP address
                    </span>
                  )}
                </p>
                {showIpField && (
                  <Field name="manualIp">
                    {({ input, meta }) => (
                      <div className="Input">
                        <input {...input} placeholder="IP address..." />
                      </div>
                    )}
                  </Field>
                )}
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
