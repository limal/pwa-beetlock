import React from "react";
import { Form, Field } from "react-final-form";
import axios from "axios";
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

    axios.post("http://192.168.1.119:3000/setgoal", values).then(() => {});
  };

  getMotang = () => {
    axios.post("http://192.168.1.119:3000/getmotang", {}).then(values => {
      console.log(values);
    });
  };

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Form
          initialValues={{ opening: 2000, closing: 1000, dir: -1 }}
          onSubmit={this.onSubmit}
          render={({ handleSubmit, pristine, submitting }) => (
            <form onSubmit={handleSubmit}>
              <Field
                name="opening"
                component={TextFieldAdapter}
                placeholder="Opening"
                required
              />
              <Field
                name="closing"
                component={TextFieldAdapter}
                placeholder="Closing"
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
        <button onClick={this.getMotang}>GET MOTANG</button>
      </MuiThemeProvider>
    );
  }
}

export { Angles };
