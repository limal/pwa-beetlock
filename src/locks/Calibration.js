import React, { Fragment, useEffect } from "react";
import { useOvermind } from "../overmind/overmind";
import "../css/Calibration.scss";
import { useForm, useField } from "react-final-form-hooks";
import { action } from "overmind";

export const Calibration = () => {
  const { state, actions } = useOvermind();
  const { form, handleSubmit, values } = useForm({
    initialValues: {
      phase_open: true,
      time: 20
    },
    onSubmit: values => {
      actions.setTime(values.time);
    }
  });
  const phaseCheckbox = useField("phase_open", form);
  const timeInput = useField("time", form);

  useEffect(() => {
    actions.setPhaseOpen(phaseCheckbox.input.value);
  }, [phaseCheckbox.input.value]);

  const open = e => actions.calibrateOpen();
  const close = e => actions.calibrateClose();

  return (
    <div className="Calibration">
      <h1 className="Calibration__Header">Lock set up</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor={phaseCheckbox.input.name}>Reverse</label>
        <input
          type="checkbox"
          id={phaseCheckbox.input.name}
          checked={phaseCheckbox.input.value}
          {...phaseCheckbox.input}
        />
        <input
          type="text"
          id={timeInput.input.name}
          checked={timeInput.input.value}
          {...timeInput.input}
        />

        <div>
          <pre>{JSON.stringify(values, null, 2)}</pre>
        </div>
      </form>
      <div className="Calibration__Control">
        <div className="Calibration__Left" onClick={open} />
        <div className="Calibration__Right" onClick={close} />
      </div>
      <div>
        {state.lock.calibrate.opened}, {state.lock.calibrate.closed}
      </div>
      <div
        className="Calibration__Action"
        onClick={e => actions.calibrateSendAngles()}
      >
        SEND ANGLES
      </div>
      <div
        className="Calibration__Action"
        onClick={e => actions.calibrateSave()}
      >
        SAVE ANGLES
      </div>
    </div>
  );
};
