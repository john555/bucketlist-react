import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { shallow } from 'enzyme';
import App from '../App';
import LocalStorageMock from '../__mocks__/LocalstorageMock';
import HistoryMock from '../__mocks__/HistoryMock';
import renderer from 'react-test-renderer';

global.window = {};
global.localStorage = new LocalStorageMock();
global.history = new HistoryMock();

describe("App", () => {
  let app = new App();

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
  
  it("Snapshot test", () => {
    const rendered = renderer.create(
      <BrowserRouter>
        <App />
    </BrowserRouter>
    );
    expect(rendered.toJSON()).toMatchSnapshot();
  });
});
