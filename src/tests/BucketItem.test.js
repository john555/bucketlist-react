import React from 'react';
import {mount} from 'enzyme';
import {expect} from 'chai';

import BucketItem from '../components/BucketItem';


describe("Bucket item", () => {

    beforeEach(() => {
        
    });

    it("Can correctly indicate status", () => {
        let root = mount(
        <BucketItem key="1"
          title="Go to Nairobi"
          description="Looking forward to the Dojo"
          dueDate="08/12/2017"
          isComplete={true}
          createdAt="08/12/2017" />
        );
        expect(root.find('.complete')).to.have.lengthOf(1);

        let root2 = mount(
        <BucketItem key="1"
          title="Go to Nairobi"
          description="Looking forward to the Dojo"
          dueDate="08/12/2017"
          isComplete={false}
          createdAt="08/12/2017" />
        );
        expect(root2.find('.complete')).to.have.lengthOf(0);
    });
});
