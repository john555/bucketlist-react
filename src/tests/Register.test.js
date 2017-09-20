import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Register from '../components/Register';

describe("Register component", () => {
    it("Should render", () => {
        let root = shallow(<Register />);
        expect(root.find('.form-heading').text()).to.contain("Create an account")
    });

});
