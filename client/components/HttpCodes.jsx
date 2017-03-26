import React from 'react';
import axios from 'axios';
import { Map, List } from "immutable";

import HttpCode from './HttpCode.jsx';
import { baseURL, apiKey } from '../config';

export default class HttpCodes extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data: Map({
        codeSelected: false,
        templateUrl: '',
        httpCodes: List([])
      })
    };
  }

  // lifecycle functions

  componentDidMount() {
    // get config
    this.fetchConfig().then(configuration => {
      let state = this.initConfiguration(configuration)
      this.pollCounts(state)
    })
    // poll counts
    this.pollCountsId = setInterval(
      () => this.pollCounts(),
      2000
    );
  }

  componentWillUnmount() {
    clearInterval(this.pollCountsId);
  }

  // state update

  initConfiguration(configuration) {
    return {
      data: Map({
        codeSelected: false,
        templateUrl: configuration.templateUrl,
        httpCodes: List(configuration.codes).map(code => {
          return {
            code: code,
            count: 0
          }
        })
      })
    }
  }

  pollCounts(state) {
    this.fetchCount().then((counts) => {
      this.updateCounts(counts, state)
    })  
  }

  updateCounts(counts, state) {
    this.setState((previousState) => {
      let data = state ? state.data : previousState.data;
      return {
        data: data.update('httpCodes', previousList => previousList.map(code => {
          if (counts[code.code] != undefined) {
            return {
              code: code.code,
              count: counts[code.code]  
            }
          } else {
            return {
              code: code.code,
              count: 0  
            }
          }
        }))
      }
    })
  }

  handleClick(selectedCode) {
    if(this.state.data.get('codeSelected')) {
      this.setState((previousState) => {
        return {
          data: previousState.data.set('codeSelected', false)
        }
      })
    } else {
      this.incrementCount(selectedCode).then(() => {
        this.setState((previousState) => {
          return {
            data: previousState.data.set('codeSelected', true).set('code', selectedCode).update('httpCodes', previousList => previousList.map(code => {
              if (code.code === selectedCode) {
                return {
                  code: code.code,
                  count: code.count + 1  
                }
              } else {
                return code;
              }
            }))
          }
        })
      })
    }
  }

  // data fetchers

  fetchConfig() {
    return axios.get(`${baseURL}/configuration`, {  
      headers: {
        'X-Api-Key': apiKey
      }
    }).then(res => {
      return res.data
    })
  }

  fetchCount() {
    return axios.get(`${baseURL}/codes`, {  
      headers: {
        'X-Api-Key': apiKey
      }
    }).then(res => {
      return res.data
    })
  }

  incrementCount(selectedCode) {
    return axios.put(`${baseURL}/code/${selectedCode}`, {}, {  
      headers: {
        'X-Api-Key': apiKey
      }
    })
  }

  // render

  render() {
    if(this.state.data.get('codeSelected')) {
      return (
        <div className="container">
          <div className="row">
            <div className="page-header col-xs-12 col-md-12 text-warning">
              <h1>Http Status Codes Illustrated</h1>
            </div>  
          </div> 
          <div className="row">
            {this.state.data.get('httpCodes').map(httpCode =>
              <HttpCode key={httpCode.code} code={httpCode.code} templateUrl={this.state.data.get('templateUrl')} count={httpCode.count} onClick={() => this.handleClick(httpCode.code)}/>
            )}
          </div>
          <div className="overlay">
            <div className="container">
              <div className="row">
                <div className="page-header col-xs-12 col-md-12 text-warning">
                  <h1>Http Status Codes Illustrated</h1>
                </div>  
              </div> 
              <div className="row">
                <HttpCode code={this.state.data.get('code')} templateUrl={this.state.data.get('templateUrl')} full={true} onClick={() => this.handleClick(this.state.data.get('code'))}/>
              </div>  
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="container">
          <div className="row">
            <div className="page-header col-xs-12 col-md-12 text-warning">
              <h1>Http Status Codes Illustrated</h1>
            </div>  
          </div> 
          <div className="row">
            {this.state.data.get('httpCodes').map(httpCode =>
              <HttpCode key={httpCode.code} code={httpCode.code} templateUrl={this.state.data.get('templateUrl')} count={httpCode.count} onClick={() => this.handleClick(httpCode.code)}/>
            )}
          </div>
        </div>
      )
    }  
  }
}
