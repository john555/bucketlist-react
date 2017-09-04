import React from 'react';
import ReactDOM from 'react-dom';
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
    ReactDOM.render(<App />, div);
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

  it("Can add a new bucket", () => {
    expect(app.state.buckets).to.have.lengthOf(1);
  });

  it("Can add edit a bucket", () => {
    const app = shallow(<App />);

  });

  it.skip("Can delete a bucket", () => {

  });
  
  it.skip("Can add items to bucket", () => {

  });

  it.skip("Can delete items from bucket", () => {

  });

  it.skip("Can edit bucket items", () => {

  });

});
