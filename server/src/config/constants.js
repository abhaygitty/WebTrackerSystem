/**
 * Created by pzheng on 8/02/2017.
 */
'use strict';
(function(){
  var routingConfig = (function() {
    return {
      userRoles: {
        public: 1, // 001
        user: 2, // 010
        admin: 4  // 100
      },

      accessLevels: {
        public: 7, // 111
        anon: 1, // 001
        user: 6, // 110
        admin: 4  // 100
      }
    };
  })();

  //Thanks to Matteo Agosti at http://www.matteoagosti.com/blog/2013/02/24/writing-javascript-modules-for-both-browser-and-node/
  if( typeof module !== 'undefined' && typeof module.exports !== 'undefined' ) {
    module.exports = routingConfig;
  } else {
    window.routingConfig = routingConfig;
  }

})();
