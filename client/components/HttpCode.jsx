import React from 'react';

export default function HttpCode(props) {
  if(props.full) {
    return (
      <div className='col-xs-12 col-md-12' >
        <img className="img-responsive center-block" src={props.templateUrl.replace('_code_', props.code)} alt={props.code} onClick={() => props.onClick()} />
      </div>  
    );
  } else {
    let vue = 'vue';
    if(props.count > 1) vue = 'vues';
    return (
      <div className='col-xs-6 col-md-4' onClick={() => props.onClick()}>
        <div className='thumbnail'>
          <img src={props.templateUrl.replace('_code_', props.code)} alt={props.code} />
          <div className="caption text-center">
            <h3>{props.count} {vue}</h3>
          </div>
        </div>
      </div>
    );
  }
}

