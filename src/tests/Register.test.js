import React from 'react';
import { shallow } from 'enzyme';
import Register from '../components/Register';

describe("Register component", () => {
    const wrapper = shallow(<Register />);

    it("Should render", () => {
        
        expect(wrapper.find('.form-heading').text()).toContain("Create an account")
    });

    it("Should disable submit button when form is submitted", () => {
        wrapper.find('#entry-form').simulate('submit', {
            preventDefault: () => {}
        });
        
        expect(wrapper.find('#entry-form button').props().disabled).toBe(true)
    });
});
