import React from 'react';
import ReactDOM from 'react-dom';
import {expect} from 'chai';
import {mount} from 'enzyme';
import App from '../App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

it('sample', ()=>{
  expect([]).to.have.lengthOf(0);
});
