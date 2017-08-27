import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import BucketList from '../components/BucketList';

describe("Bucket list component", () => {
    
    it("Shows no content mesage if no buckets are present.", () => {
        let root = mount(<BucketList />);

        expect(root.find('div.no-buckets')).to.have.lengthOf(1);

        root = mount(<BucketList buckets={[]} />);

        expect(root.find('div.no-buckets')).to.have.lengthOf(1);
    });

    it("Renders bucket list", () => {
        let buckets = [
            {
                name:"PHP bucket", 
                id: 1,
                description: "desc"
            },
            {
                name: 'Java bucket',
                id: 2, 
                description:"Description 1"
            }
        ];

        let root = mount(<BucketList buckets={buckets} />);

        expect(root.find('.bucket')).to.have.lengthOf(buckets.length);
    });
});
