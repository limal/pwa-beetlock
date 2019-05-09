import React, { Fragment, useEffect } from "react";
import { useOvermind } from "../overmind/overmind";
import "../css/Calibration.scss";
import { useForm, useField } from "react-final-form-hooks";

export const Calibration = () => {
  const { state, actions } = useOvermind();
  const { form, handleSubmit, values } = useForm({
    initialValues: {
      phase_open: true
    },
    onSubmit: values => console.log(values)
  });
  const phaseCheckbox = useField("phase_open", form);

  useEffect(() => {
    actions.phaseOpen(phaseCheckbox.input.value);
  }, [phaseCheckbox.input.value]);

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

        <div>
          <pre>{JSON.stringify(values, null, 2)}</pre>
        </div>
      </form>
    </div>
  );
};
