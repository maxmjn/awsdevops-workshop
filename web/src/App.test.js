import React from 'react'
import { shallow, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import App from './App'

configure({ adapter: new Adapter() })

describe('<App />', () => {
  describe('Snapshots', () => {
    it('should render the login form if no user is present', () => {
      const rendered = shallow(<App />)
      expect(rendered.debug()).toMatchSnapshot()
    })
  })
})
