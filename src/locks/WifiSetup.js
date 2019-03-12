import React, { useEffect } from "react";
import { useOvermind } from "../overmind/overmind";
import { Form, Field } from "react-final-form";
import createFocusDecorator from "final-form-focus";
import { required } from "../common/forms/validators";
import "../css/Locks.scss";

const focusOnError = createFocusDecorator();

export const WifiSetup = () => {
  const { state, actions } = useOvermind();

  useEffect(() => {
    if (state.bridge.wifis.length === 0 && !state.bridge.loading) {
      actions.getWifis();
    }
  }, [state.bridge.wifis]);

  const onSubmit = values => {
    console.log("* values", values);
    actions.setWifiSelected(values);
  };

  return (
    <div className="Locks">
      <div className="Text">
        <p>
          <br />
          <strong>
            Please select your WiFi network and enter the password.
          </strong>
        </p>
        {state.bridge.wifiSelected ? (
          <form action="/wifi" method="post">
            <div className="Text">
              <p>
                Please confirm your WiFi network name is:
                <br />
                <strong className="Wifi-Name">
                  {state.bridge.wifiSelected}
                </strong>
              </p>
            </div>
            <input className="Button" type="submit" value="CONNECT" />
            <p className="Hint">
              After clicking this button you can disconnect from WB-Lock-Bridge
              WiFi network and login to your WB Lock website to complete the
              installation process.
            </p>
          </form>
        ) : (
          <Form
            onSubmit={onSubmit}
            initialValues={{}}
            decorators={[focusOnError]}
            render={({ handleSubmit, reset, submitting, pristine, values }) => (
              <form className="Login-Form" onSubmit={handleSubmit}>
                <Field
                  name="wifiSelected"
                  component="select"
                  validate={required}
                >
                  <option value="">Please select...</option>
                  {state.bridge.wifis.map(wifi => (
                    <option value={wifi.ssid}>{wifi.ssid}</option>
                  ))}
                </Field>
                <p className="Password-Hint">
                  Your password is safe and will not be shared with anyone -
                  even us. It will enable your WB Lock Bridge to connect to the
                  Internet.
                </p>
                <div className="WifiSetup-Buttons">
                  <button className="Button Button--padded" type="submit">
                    NEXT
                  </button>
                </div>
              </form>
            )}
          />
        )}
      </div>
    </div>
  );
};
