import React, { Fragment, useEffect } from "react";
import { useOvermind } from "../overmind/overmind";
import { Form, Field } from "react-final-form";
import createFocusDecorator from "final-form-focus";
import { Success } from "../common/icons/Success";
import { required } from "../common/forms/validators";
import { GoBack } from "../common/GoBack";
import { ROUTES } from "../routes/routes";
import "../css/BridgeWifi.scss";

const focusOnError = createFocusDecorator();

export const FoundBridge = ({ history }) => {
  const { state, actions } = useOvermind();

  useEffect(() => {
    actions.getOccupied({ ipAddress: state.bridge.ip });
  }, [state.bridge.ip]);

  return (
    <div className="FoundBridge">
      <Fragment>
        <h1 className="FoundBridge__Header">SUCCESS</h1>
        <p className="Text Text--center">
          Your bridge has successfully connected to your WiFi hot spot.
        </p>
        <Success className="FoundBridge__Icon" width={96} height={96} />
        <input
          className="Button"
          type="submit"
          value="NEXT"
          onClick={e =>
            state.bridge.occupied
              ? history.push(ROUTES.login)
              : history.push(ROUTES.signUp)
          }
        />
      </Fragment>
    </div>
  );
};
