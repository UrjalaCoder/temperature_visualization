import React from "react";
import "./App.css";

class MyComponent extends React.Component {
  render() {
    return (
      <h3>Hello, World!</h3>
    );
  }
}

class App extends React.Component{
  render(){
    return(
      <div className="App">
        <MyComponent />
      </div>
    );
  }
}

export default App;
