import React, { useEffect } from "react";
import { useOvermind } from "../overmind/overmind";
import { Form, Field } from "react-final-form";
import createFocusDecorator from "final-form-focus";
import { required } from "../common/forms/validators";
import "../css/BridgeWifi.scss";

const focusOnError = createFocusDecorator();

export const WifiSetup = () => {
  const { state, actions } = useOvermind();

  useEffect(() => {
    if (state.bridge.wifis.length === 0 && !state.bridge.loading) {
      actions.getWifis();
    }
  }, [state.bridge.wifis]);

  const handleCancel = e => {
    actions.setWifiSelected({ wifiSelected: null });
  };

  const handleConnect = e => {
    e.preventDefault();
    console.log("* wifiSelected", state.bridge.wifiSelected);
    actions.connectWifi({
      ssid: state.bridge.wifiSelected,
      password: state.bridge.wifiPassword
    });
  };

  const onSubmit = values => {
    console.log("* values", values);
    actions.setWifiSelected({
      wifiSelected: values.wifiSelected,
      wifiPassword: values.password
    });
  };

  return (
    <div className="Locks">
      <div className="Text">
        {state.bridge.wifiSelected ? (
          <div className="WifiSetup-WifiSelected">
            <div className="Text">
              <p>
                Please confirm your WiFi network name is:
                <br />
                <strong className="WifiSetup-Name">
                  {state.bridge.wifiSelected}
                </strong>
              </p>
            </div>
            <input
              className="Button"
              type="submit"
              value="CONNECT"
              onClick={handleConnect}
            />
            <p>
              or{" "}
              <span className="Link" onClick={handleCancel}>
                go back
              </span>
            </p>
          </div>
        ) : (
          <div>
            <p>
              <strong>
                Please select your WiFi network and enter the password.
              </strong>
            </p>
            <Form
              onSubmit={onSubmit}
              initialValues={{}}
              decorators={[focusOnError]}
              render={({ handleSubmit }) => (
                <form className="Login-Form" onSubmit={handleSubmit}>
                  <Field
                    name="wifiSelected"
                    component="select"
                    validate={required}
                  >
                    {({ input, meta }) => (
                      <React.Fragment>
                        <select {...input}>
                          <option value="">Please select...</option>
                          {state.bridge.wifis.map(wifi => (
                            <option value={wifi.ssid} key={wifi.mac}>
                              {wifi.ssid}
                            </option>
                          ))}
                        </select>
                        {meta.error && meta.touched && (
                          <span className="Input-Error Input-Error--select">
                            {meta.error}
                          </span>
                        )}
                      </React.Fragment>
                    )}
                  </Field>
                  <Field name="password" validate={required}>
                    {({ input, meta }) => (
                      <div className="Input">
                        <input
                          {...input}
                          type="password"
                          placeholder="Password"
                        />
                        {meta.error && meta.touched && (
                          <span className="Input-Error">{meta.error}</span>
                        )}
                      </div>
                    )}
                  </Field>
                  <p className="Password-Hint">
                    Your password is safe and will not be shared with anyone -
                    even us. It will enable your WB Lock Bridge to connect to
                    the Internet.
                  </p>
                  <div className="WifiSetup-Buttons">
                    <button className="Button Button--padded" type="submit">
                      NEXT
                    </button>
                  </div>
                </form>
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
};
