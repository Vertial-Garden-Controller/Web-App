import React, { Fragment } from 'react'

import { withAuthenticationRequired } from '@auth0/auth0-react'
import Loading from '../components/Loading'

export const Weather = () => {
  var tempLocation = 97330

  return (
    <Fragment>
      <h1>Weather</h1>
      <p className="lead">
        {/* Implement input box for custom weather data */}
        Showing the weather for {tempLocation}, click here to see the weather
        elsewhere.
      </p>
    </Fragment>
  )
}

export default withAuthenticationRequired(Weather, {
  onRedirecting: () => <Loading />,
})
