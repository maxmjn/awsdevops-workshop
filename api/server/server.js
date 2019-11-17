/* eslint-disable no-console */

// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: loopback-workspace
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict'

const loopback = require('loopback')
const boot = require('loopback-boot')

const app = loopback()
module.exports = app

app.start = function serverBootup () {
  // start the web server
  return app.listen(() => {
    app.emit('started')
    const baseUrl = app.get('url').replace(/\/$/, '')
    console.log('Web server listening at: %s', baseUrl)
    if (app.get('loopback-component-explorer')) {
      const explorerPath = app.get('loopback-component-explorer').mountPath
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath)
    }
  })
}

const bootOptions = {
  appRootDir: __dirname,
  // whatever you put here is run.  But the base of `boot` is also still run
  bootDirs: [`${__dirname}/boot/migrations`],
}

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, bootOptions, (err) => {
  if (err) throw err

  // start the server if `$ node server.js`
  if (require.main === module) app.start()
})
