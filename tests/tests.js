import {
  userSignup,
  userLogin,
  userPasswordChange,
  getProfileDetailById,
  logout,
  getProfileById,
  displayMenu,
  displayType,
  displayItem,
  viewPendingOrders,
  viewOrderDetailById,
  getOrderLocationById,
  sortOrders,
  completeOrder,
  changeDefaultMode,
  changeUserName,
  changeProfilePhoto,
  displayOrderHistory
} from '../database.js';
import {saveOrder, updateOrderRate, viewAllOrders} from "../database";

//var _Example = require("../database.js\"");
var config = {
  apiKey: "AIzaSyAQSNocuGrjIBtwErRJeHV7nUsfQGZC_uE",
  authDomain: "cmdatabase-c3084.firebaseapp.com",
  databaseURL: "https://cmdatabase-c3084.firebaseio.com",
  projectId: "cmdatabase-c3084",
  storageBucket: "cmdatabase-c3084.appspot.com",
  messagingSenderId: "964208744011"
};

main();

//npx babel-node tests.js
async function main() {

  await testuserSignup();
  await testuserLogin();
  await testdisplayMenu();
  await testdisplayType();
  await testdisplayItem();
  await testviewPendingOrders();


  //await testLogOut();
  //await testUserPasswordChange();
  //await testGetProfileById();
   //await testviewOrderDetailById();
 await testgetOrderLocationById();
  await testdisplayOrderHistory();
  await testupdateRate();
}


async function testuserSignup() {
  var email = "unittest@ucsd.edu";
  var password = "password";
  var returned = await userSignup(email, password);

  console.log("Testing function userSignup...");
  console.log("Expecting returned value:\t0");
  console.log("Actual returned value:\t" + returned);
  if (returned === 0) {
    console.log("PASSED!\n");
  } else {
    console.log("FAILED!\n");
  }
}


async function testuserLogin() {
  var email = "unittest@ucsd.edu";
  var password = "password";
  var returned = await userLogin(email, password);

  password = "badpassword";
  var returnederror = await userLogin(email, password);

  console.log("Testing function userLogin with correct user credentials...");
  console.log("Expecting returned value:\t0");
  console.log("Actual returned value:\t" + returned);
  if (returned === 0) {
    console.log("PASSED!\n");
  } else {
    console.log("FAILED!\n");
  }

  console.log("Testing function userLogin with incorrect user" +
    " credentials...");
  console.log("Expecting to return an error message");
  console.log("Actual returned value:\t" + returnederror);

  if (returnederror !== 0) {
    console.log("PASSED!\n");
  } else {
    console.log("PASSED!\n");
  }
}


async function testUserPasswordChange() {
  var email = "unittest@ucsd.edu";
  var password = "password";

  // What's current user in this case?
  await userPasswordChange("newPassword");

  var returnederror = await userLogin( email, password );

  console.log( "Testing function userPasswordChange with incorrect user" +
    " credentials..." );
  console.log( "Expecting to return an error message" );
  console.log( "Actual returned value:\t" + returnederror );
  if( returnederror === 0 ) { console.log( "FAILED!\n" ); } else { console.log( "PASSED!\n" ); }

  var password = "newPassword";
  var returned = await userLogin( email, password );

  console.log( "Testing function userPasswordChange with correct user credentials..." );
  console.log( "Expecting returned value:\t0" );
  console.log( "Actual returned value:\t" + returned );
  if( returned === 0 ) { console.log( "PASSED!\n" ); } else { console.log( "FAILED!\n" ); }
}

async function testChangeUserName () {
  // The method will return false if the user put a same name?
  var result = await changeUserName("id", "same name");

  console.log( "Testing function changeUserName with incorrect user credentials..." );
  console.log( "Expecting returned value:\t0" );
  console.log( "Actual returned value:\t" + returned );
  if( returned !== 0 ) { console.log( "PASSED!\n" ); } else { console.log( "FAILED!\n" ); }

  var result = await changeUserName("id", "new name");

  console.log( "Testing function changeUserName with correct user credentials..." );
  console.log( "Expecting returned value:\t0" );
  console.log( "Actual returned value:\t" + returned );
  if( returned === 0 ) { console.log( "PASSED!\n" ); } else { console.log( "FAILED!\n" ); }
}

async function testLogOut() {
  var email = "unittest@ucsd.edu";
  var password = "password";
  await userLogin( email, password );
  // Current user?
  var returned = logout();

  console.log( "Testing function logOut with correct user credentials..." );
  console.log( "Expecting returned value:\t0" );
  console.log( "Actual returned value:\t" + returned );
  if( returned === 0 ) { console.log( "PASSED!\n" ); } else { console.log( "FAILED!\n" ); }
}

async function testCompleteOrder() {
  await completeOrder("01", "666");
}

// async function testGetProfileById() {
//   console.log( "Testing function getProfileById..." );
//   var his = await getProfileById( "3" );
//   console.log(his);
//   var his = await getProfileById( "1" );
//   console.log(his);
//
//   var his = await getProfileById( "2" );
//   console.log(his);
//
//   var his = await getProfileById( "5" );
//   console.log(his);
// }

async function testdisplayMenu( ) {
  var gotMenu = await displayMenu();

  var expectedReturnedMenu = [
    ['https://globalassets.starbucks.com/assets/73f48e9a2580412b8b28a8e75d4b4642.jpg',
      'Cold Coffees'],
    ['https://globalassets.starbucks.com/assets/3056aa7849a0477ea4ed137b66910324.jpg',
      'Drinks'],
    ['https://www.starbucks.com/assets/963d78767f4a4710b6d48fd526fe9eb8.jpg',
      'Frappuccino'],
    ['https://globalassets.starbucks.com/assets/60058630d5a14a679054712b6afa77c3.jpg',
      'Hot Coffees'],
    ['https://globalassets.starbucks.com/assets/98659cd2d5d94dfdad933dfa17c3d6f3.jpg',
      'Hot Teas'],
    ['https://www.starbucks.com/assets/8bffaf8cd08743b6add5b20cb1f3eb2b.jpg',
      'Iced Teas']
  ];

  console.log("Testing function displayMenu...");
  //console.log( "Expecting returned list of pairs of [img, type]" );
  //console.log( "Actual returned value:\n" );
  var noProblem = true;
  for (pair in gotMenu) {
    if (gotMenu[pair][0] !== expectedReturnedMenu[pair][0] ||
      gotMenu[pair][1] !== expectedReturnedMenu[pair][1]) {
      noProblem = false;
    }
    //console.log( gotMenu[pair][0] );
  }
  if (noProblem) {
    console.log("PASSED!\n");
  } else {
    console.log("FAILED!\n");
  }
}

async function testdisplayType() {
  var gotSubMenu = await displayType('Drinks');
  var expectedReturnedDrinks = [
    [
      'https://globalassets.starbucks.com/assets/3056aa7849a0477ea4ed137b66910324.jpg',
      'D01',
      'Pink Drink'
    ],
    [
      'https://globalassets.starbucks.com/assets/452d9229393844b9b57263a7d0d9cf1e.jpg',
      'D02',
      'Hot Chocolate'
    ],
    [
      'https://globalassets.starbucks.com/assets/cff93f212cda4cd09e7dfa5a358caeed.jpg',
      'D03',
      'Strawberry Acai Starbucks Refreshers™ Beverage'
    ]
  ];

  //console.log( "Expecting returned list of pairs of [img, id, name]" );
  //console.log( "Actual returned value:" );
  var noProblem = true;
  for (pair in gotSubMenu) {
    if (gotSubMenu[pair][0] !== expectedReturnedDrinks[pair][0] ||
      gotSubMenu[pair][1] !== expectedReturnedDrinks[pair][1]) {
      noProblem = false;
    }
  }
  if (noProblem) {
    console.log("PASSED!\n");
  } else {
    console.log("FAILED!\n");
  }
}

async function testdisplayItem() {
  var got = await displayItem("Hot Coffees", "HC02");
  var expectedItem = {
    description: 'Espresso shots are topped with hot water to produce a light layer of crema. The result is this wonderfully rich cup with depth and nuance.',
    image: 'https://globalassets.starbucks.com/assets/2a4807223b53455b89f792b5e25ce89e.jpg',
    name: 'Caffè Americano',
    price: {grande: 3.25, short: 2.45, tall: 2.65, venti: 3.45}
  };


  console.log("Testing function displayItem...");
  //console.log( "Expecting returned list of [name, description, image]" );
  //console.log( "Actual returned value:" );
  var noProblem = true;
  for (pair in got) {
    if (pair !== "price" && got[pair] !== expectedItem[pair]) {
      noProblem = false;
    }
    else if (pair === "price") {
      for (tag in got.price) {
        if (got.price[tag] !== expectedItem.price[tag]) {
          noProblem = false;
        }
      }
    }
  }
  if (noProblem) {
    console.log("PASSED!\n");
  } else {
    console.log("FAILED!\n");
  }
}

function compareObj(obj1, obj2) {
  var equal = true;

  for (tag in obj1) {
    if (obj1[tag] !== obj2[tag]) {
      noProblem = false;
    }
  }

  return equal;
}

async function helpaddingOrder(ord, callback) {
  setTimeout(function () {
    var addedOrderId = saveOrder(ord);
    callback();
    return addedOrderId;
  }, 1000);
}

async function helpviewpending(callback) {
  setTimeout(function () {
    var got = viewPendingOrders();
    callback();
    return got;
  }, 1000);

}

async function testviewPendingOrders() {
/*
  var add = {
    buyer_id: "001",
    buyer_rate: "4.5",
    carrier_id: "002",
    carrier_rate: "4",
    create_time: "12:55 pm, Friday, May 22, 2021",
    items: {
      customization: "lol",
      item_name: "pink drink",
      size: "grande"
    },
    last_update_time: "13:01 pm",
    location: "Warren Lecture Hall",
    request_time: "1:08 pm",
    status: 1

  };

    let gotPendingId;

    let addedOrderId = helpaddingOrder( add, function () {
      gotPendingId = helpviewpending( function () {

      });
    });*/

  var gotPendingId = await viewPendingOrders();
  var gotAllId = await viewAllOrders();
  var noProblem1 = true;


  console.log("Testing function viewPendingOrders...");

  console.log("Comparing if all fetched orders are of pending status");


  for ( index in gotPendingId) {
    let order = await viewOrderDetailById( gotPendingId[index] );
    //console.log(gotPendingId[index]);
    if( order.status != 1){
      noProblem1 = false;
    }
  }
  if (noProblem1) {
    console.log("PASSED!\n");
  } else {
    console.log("FAILED! Not all fetched orders are pending orders\n");
  }



console.log("Comparing if all pending orders fetched");
  var noProblem2 = true;


  for ( index in gotAllId) {

    let order = await viewOrderDetailById( gotAllId[index] );

    if( order.status == 1 && !gotPendingId.includes( gotAllId[index] ) ){
      noProblem2 = false;
    }
  }

  if (noProblem2) {
    console.log("PASSED!\n");
  } else {
    console.log("FAILED! Not all pending orders are fetched\n");
  }


  if (noProblem1 && noProblem2) {
    console.log("Both tests PASSED!\n");
  } else {
    console.log("FAILED!\n");
  }
}
/*
async function testviewOrderDetailById() {
  var got = await viewOrderDetailById("3");
  console.log("Testing function viewOrderDetailById...");


  var expectedItem = {
    buyer_id: "678",
    buyer_rate: "3.3",
    carrier_id: "234567",
    carrier_rate: "0.5",
    create_time: "9:30 am, Monday, March 29, 2018",
    items:
      { FR02:
          { customization: 'wulalalalalililalalilalidalidalidayou',
            item_name: 'Caramel Cocoa Cluster Frappuccino',
            size: 'tall' } },
    last_update_time: '9:50 am',
    location: 'Atkinson Hall',
    request_time: '10:20 am',
    status: 1
};

  var noProblem = true;
  console.log(got);
  for (pair in got) {
    if (pair !== "items" && got[pair] != expectedItem[pair]) {
      noProblem = false;
      console.log(got[pair]);
      console.log(expectedItem[pair]);
    }
    else if (pair === "items") {
      /*for (tag in got[items]) {
        for (item in tag) {
          if (got.price[tag] !== expectedItem.price[tag]) {
            noProblem = false;
          }
        }
      }
    }
  }
  if (noProblem) {
    console.log("PASSED!\n");
  } else {
    console.log("FAILED!\n");
  }

}*/

async function testgetOrderLocationById() {
  var gotAllId = await viewAllOrders();

  console.log("Testing function getOrderLocationById...");

  console.log("Comparing location got with location stored in order object");
  var noProblem = true;


  for ( index in gotAllId) {

    let order = await viewOrderDetailById( gotAllId[index] );
    let loc = await getOrderLocationById( gotAllId[index] );

    if( order.location.split(' ').join('%20') != loc ){
      noProblem = false;
    }
  }

  if (noProblem) {
    console.log("PASSED!\n");
  } else {
    console.log("FAILED!\n");
  }

}

async function testsortOrders() {
  //later depend on save order
}

async function testdisplayOrderHistory() {
  var prof = await getProfileDetailById( "test1" );
  var his = await displayOrderHistory("test1");

  var noProblem = true;

  if( prof.history.length != his.length ){
    noProblem = false;
  }

  for ( index in his) {

    if( his[index] != prof.history[index] ){
      noProblem = false;
    }
  }

  if (noProblem) {
    console.log("PASSED!\n");
  } else {
    console.log("FAILED!\n");
  }
}

async function testupdateRate() {
  updateOrderRate( 0, 0, true );
}
