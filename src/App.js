import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import $ from 'jquery';
import  Bluebird from 'bluebird';
import _ from 'lodash';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
			resultArray:[]
		}
    this.jqErrHandler = this.jqErrHandler.bind(this);
  }
  componentWillMount() {
    /*let result = $.ajax({url: "https://pokeapi.co/api/v2/pokemon/?limit=20&offset=0", type: 'GET', success: function(result){
       return result
   }});*/
   const ajaxDefaults = {
    	method: 'GET',
    	contentType: 'application/json'
  };
  const options = {url: "https://pokeapi.co/api/v2/pokemon/?limit=20&offset=0",
                   type: 'GET',
                   contentType: 'application/json'
  };
   //const opt = _.default(options, ajaxDefaults);
   let result = Bluebird.resolve($.ajax(options))
		.catch(this.jqErrHandler.bind(null, options))
		.then( (response)=> {
        this.setState({resultArray:response.results});
				return response;
		});
  }

  jqErrHandler(opt, jqXHR) {
	if (jqXHR.status == 200) {
		// handling 200 responses with no body
		return Bluebird.resolve();
	}

	const errText = jqXHR.status === 500 ? 'An unknown error occurred.' : jqXHR.responseText;
	const err = new Error(errText || 'An unknown error occurred.');
	err.statusCode = jqXHR.status;
	if (jqXHR.status === 409) err.isConflict = true;
	if ((jqXHR.status === 401 || jqXHR.status === 403) && !opt.ignoreAuth) {
		//window.location = bootstrapData.headerUrl.logOutUrl;
	}
	throw err;
}

  render() {
    var result = this.state.resultArray;
    return (
      <div className="App">
        <p className="App-intro">
        <table>
          <thead>
            <tr>
              <th>DeviceID</th>
              <th>TimeStamp</th>
              <th>Temperature(F)</th>
              <th>Humidity(%)</th>
            </tr>
          </thead>
          {this.state.resultArray.map(pokemonObject =>
            <tr className='success'>
              <td>{pokemonObject.url}</td>
              <td>{pokemonObject.name}</td>
            </tr>
          )}
        </table>
        </p>
      </div>
    );
  }
}

export default App;
