import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import { shallow } from 'enzyme';
import App from '../App';
import renderer from 'react-test-renderer';

global.window = {};
global.history = {};

let store = {}
global.localStorage = {
    getItem: key => {
        return `{"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHBpcnkiOiIyMDE3LTA5LTI3IDIwOjAyOjUyLjYxNjk0MSJ9.3Qgmdip-oluZKFlFsCTrqq16H8gwnVpQQyY2z4YzJSU","user":{"email":"jdoe@example.com","first_name":"john","last_name":"doe","user_name":"jdoe"}}`
    },
    setItem: (key, value) => {
        store[key] = value
    }
}


describe("App", () => {
  let app = new App();
  const wrapper = shallow(
    <App />
);

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
  
  it("Snapshot test", () => {
    const rendered = renderer.create(
      <MemoryRouter>
        <App />
    </MemoryRouter>
    );
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it("Can search", () => {
    let { state } = wrapper.instance();
    state.search = "kdk"
    
    state.currentBucket = {
        id: '9390283'
      }

    wrapper.instance().setState(state);
    
    wrapper.instance().onSearchKeyDown({
      keyCode: 13,
      preventDefault: () => {}
    })

    expect(wrapper.instance().state.isSearching).toBe(true)
  });

  describe("New bucket", () => {
      
      it("Should disable submit button when form is submitted", () => {
          wrapper.find('NewBucketForm').simulate('submit', {
            preventDefault: () => {}
          })

          expect(wrapper.find('NewBucketForm').props().isDisabled).toBe(true)
      })
      
  })

  describe("New item", () => {
    
    it("Should disable submit button when form is submitted", () => {
        wrapper.instance().setState({currentBucket: {
          id: '927818'
        }})

        wrapper.find('NewItemForm').simulate('submit', {
          preventDefault: () => {}
        })

        expect(wrapper.find('NewItemForm').props().isDisabled).toBe(true)
    })
    
  })

  describe("Edit bucket", () => {
    
    it("Should disable submit button when form is submitted", () => {
        wrapper.instance().setState({currentBucket: {
          id: '927818'
        }})
        wrapper.find('EditBucketForm').simulate('submit', {
          preventDefault: () => {}
        })

        expect(wrapper.find('EditBucketForm').props().isDisabled).toBe(true)
    })
    
  })

  describe("Password reset", () => {
    it("Should disable submit button when form is submitted", () => {
         wrapper.instance().setState({
          resetPassword: {
            oldPassword: '', 
            newPassword: '1234567890', 
            newPasswordRepeat: '1234567890'
          }
        })

        wrapper.find('ResetPasswordForm').simulate('submit', {
          preventDefault: () => {}
        })

        expect(wrapper.find('ResetPasswordForm').props().isDisabled).toBe(true)
    })


    it("Should fail when paswords do not match", () => {
      wrapper.instance().setState({
        resetPassword: {
          oldPassword: '', 
          newPassword: '12345678jsk', 
          newPasswordRepeat: '1234567890'
        }
      })

      wrapper.find('ResetPasswordForm').simulate('submit', {
        preventDefault: () => {}
      })

      expect(wrapper.find('ResetPasswordForm').props().formClass).toBe('failed')
    })

    it("New password length should be < 8", () => {
      wrapper.instance().setState({
        resetPassword: {
          oldPassword: '', 
          newPassword: '1234567', 
          newPasswordRepeat: '1234567'
        }
      })

      wrapper.find('ResetPasswordForm').simulate('submit', {
        preventDefault: () => {}
      })

      expect(wrapper.find('ResetPasswordForm').props().formClass).toBe('failed')
    })
    
  });


});
