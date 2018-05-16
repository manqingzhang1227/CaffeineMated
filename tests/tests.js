import {userSignup, userLogin, getProfileDetailById, displayMenu, displayType, displayItem, viewPendingOrders, viewOrderDetailById, getOrderLocationById, sortOrders, completeOrder, changeDefaultMode, changeUserName, changeProfilePhoto} from '../database.js';

//var _Example = require("../database.js\"");

main();


function main() {
  testUserSignup();
  testUserLogin();
}

function testUserSignup( ) {
  var email = "unittest@ucsd.edu";
  var password = "password";
  var returned = userSignup( email, password );

  console.log( "Testing function userSignup..." );
  console.log( "Expecting returned value:\t1" );
  console.log( "Actual returned value:\t" + returned );
  if( returned === 0 ) { console.log( "PASSED!\n" ); } else { console.log( "FAILED!\n" ); }
}


function testUserLogin( ) {
  var email = "unittest@ucsd.edu";
  var password = "password";
  var returned = userLogin( email, password );

  console.log( "Testing function userLogin with correct user credentials..." );
  console.log( "Expecting returned value:\t1" );
  console.log( "Actual returned value:\t" + returned );
  if( returned === 0 ) { console.log( "PASSED!\n" ); } else { console.log( "FAILED!\n" ); }
}