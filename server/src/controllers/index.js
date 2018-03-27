/**
 * Created by pzheng on 29/11/2016.
 */
'use strict';
exports.render = function(req, res) {
  res.render('index', {     /* render ../views/index.pug */
    title: 'Index Form',  /* Object in  ../views/index.pug */
    userFullName: req.user ? req.user.fullName : '',
    user: JSON.stringify(req.user)
  });
};
