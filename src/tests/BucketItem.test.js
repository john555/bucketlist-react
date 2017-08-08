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

    it("Can display due date correctly", () => {
      let bucketItem = new BucketItem();
      bucketItem.props = {};
      expect(bucketItem.getDueDay()).to.equal(null);
      expect(bucketItem.getDueDay()).to.equal(null);

      bucketItem.props.dueDate = "Thu, 03 Aug 2017 00:00:00 GMT";
      expect(bucketItem.getDueDay()).to.equal('03');
      expect(bucketItem.getDueMonthAndYearString()).to.equal('August, 2017');
      //bucketItem.id = 1;
      
      //bucketItem.description = "The simple UI framework by Facebook.";
      //bucketItem.isComplete = false;
      //bucketItem.title = "ReactJS";
    });

    it("Can display created date correctly", () => {
      let bucketItem = new BucketItem();
      bucketItem.props = {};
      expect(bucketItem.getCreatedDate()).to.equal(null);
      bucketItem.props.createdAt = "Wed, 02 Aug 2017 12:24:42 GMT";
      expect(bucketItem.getCreatedDate()).to.equal('August 02, 2017');
    });
});