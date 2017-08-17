import React from 'react';
import ReactDOM from 'react-dom';
import {expect} from 'chai';
import {mount} from 'enzyme';
import App from '../App';

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
    const app = mount(<App />);
    console.log(app.state());

  });

  it("Can delete a bucket", () => {

  });
  
  it("Can add items to bucket", () => {

  });

  it("Can delete items from bucket", () => {

  });

  it("Can edit bucket items", () => {

  });

});
