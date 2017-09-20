import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Search from '../components/Search';

describe("Search component", () => {
    it("Should render", () => {
        let root = shallow(<Search />);
        expect(root.find('.search-title span').text()).to.contain("Search")
    });
});
