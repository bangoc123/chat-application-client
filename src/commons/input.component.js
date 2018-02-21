import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class Input extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div>
        <MuiThemeProvider>
          <TextField 
            onChange={(e) => this.props.onTextChange(e)}
            hintText={this.props.hintText}
            floatingLabelText={this.props.floatingLabelText}
            name={this.props.name}
            onKeyPress={(e) => this.props.onKeyPress(e)}
            />
        </MuiThemeProvider>
      </div>
    )
  }
}

export default Input;
