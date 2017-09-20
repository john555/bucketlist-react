import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Login from '../components/Login';

describe("Login component", () => {
    it("Should render", () => {
        let root = shallow(<Login />);
        expect(root.find('.form-heading').text()).to.contain("Sign in to your account")
    });

});
