import React from "react";
import "../css/Layout.scss";

class Layout extends React.Component {
  render() {
    const { children } = this.props;

    return (
      <div className="Layout">
        <div className="Layout-Header">WB LOCK</div>
        {children}
      </div>
    );
  }
}

export { Layout };
