import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import App from '../App';
import LocalStorageMock from '../__mocks__/LocalstorageMock';
import HistoryMock from '../__mocks__/HistoryMock';

global.window = {};
global.localStorage = new LocalStorageMock();
window.history = new HistoryMock();

describe("App", () => {
  let app = new App();

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <BrowserRouter>
      <App />
    </BrowserRouter>, div);
  });

  beforeEach(function(){
    app.state = {};
    app.state.buckets = [
      {
        name:"Learning bucket", 
        id: 1,
        description: "This is where all the stuff to learn goes"
      }
    ];
  });
  
});
