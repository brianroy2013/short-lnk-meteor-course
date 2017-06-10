import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';

import '../imports/api/users'
import { Links } from '../imports/api/links'
import '../imports/startup/simple-schema-configuration';

Meteor.startup(() => {
  WebApp.connectHandlers.use((req, res, next) =>{
    console.log('This is from my custom middleware');
    const _id = req.url.slice(1);
    const link = Links.findOne({_id})

    if (link){
      // redirect to the link found in the database
      res.statusCode = 302;
      res.setHeader('Location',link.url);
      res.end();
      Meteor.call('links.trackVisit', _id)
    } else {
      // allow the server to continue on...
      next();
    }
  });
});
