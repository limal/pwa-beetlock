import React from "react";
import { Form, Field } from "react-final-form";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import TextField from "material-ui/TextField";
import Toggle from "material-ui/Toggle";
import "./Angles.css";

const TextFieldAdapter = ({ input, meta, ...rest }) => (
  <TextField
    {...input}
    {...rest}
    onChange={(event, value) => input.onChange(value)}
    errorText={meta.touched ? meta.error : ""}
  />
);

const ToggleAdapter = ({ input: { onChange, value }, label, ...rest }) => (
  <Toggle
    label={label}
    toggled={value > 0 ? true : false}
    onToggle={(event, isInputChecked) => onChange(isInputChecked ? 1 : -1)}
    {...rest}
  />
);

class Angles extends React.Component {
  onSubmit = values => {
    console.log("* values", values);
  };

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Form
          initialValues={{ goal: 1000, dir: -1 }}
          onSubmit={this.onSubmit}
          render={({ handleSubmit, pristine, submitting }) => (
            <form onSubmit={handleSubmit}>
              <Field
                name="goal"
                component={TextFieldAdapter}
                placeholder="Goal"
                required
              />
              <Field
                name="dir"
                label="Direction"
                component={ToggleAdapter}
                placeholder="Direction"
              />
              <button type="submit" disabled={submitting}>
                Submit
              </button>
            </form>
          )}
        />
      </MuiThemeProvider>
    );
  }
}

export { Angles };
