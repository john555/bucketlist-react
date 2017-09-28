import React from 'react';
import { shallow } from 'enzyme';
import Login from '../components/Login';

describe("Login component", () => {
    let wrapper = shallow(<Login />);

    it("Should render", () => {
        expect(wrapper.find('.form-heading').text()).toContain("Sign in to your account")
    });

    it("Should disable submit button when form is submitted", () => {
       
        wrapper.find('#entry-form').simulate('submit', {
            preventDefault: () => {}
        });
        
        expect(wrapper.find('#entry-form button').props().disabled).toBe(true)
    })

});
