import firebase from 'firebase';
import {Alert} from 'react-native';

// Firebase configuration
var config = {
    apiKey: "AIzaSyC9lBfgxor-3FS__blFmwqda8LIvlKrq1c",
    authDomain: "caffeinemated-90dda.firebaseapp.com",
    databaseURL: "https://caffeinemated-90dda.firebaseio.com",
    projectId: "caffeinemated-90dda",
    storageBucket: "caffeinemated-90dda.appspot.com",
     messagingSenderId: "329358763029"
};
// Firebase initialization
firebase.initializeApp(config);

/*
* Name: userLogin
* Parameters: email - string; user login email
*             password - string; user login password
* Return:
*  Error Condition: 1) Error Message indicates what went wrong
*                   2) Error Inputs
* Success: 1
*/
export async function userLogin (email, password) {
  var result;
  await firebase.auth().signInWithEmailAndPassword(email, password).then(
    function success() {
      // callback with 0 indicating login success
      result = 0;




    }
  ).catch(
    function failure (error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    // callback with errorMessage
    result = errorMessage;
  });

  if (result === 0) {
      var curUser = getCurrentUserUID();
      var Profile = await getProfileById(curUser);
      if (Profile.current_order_as_buyer)
          addOrderStatusChangeListener(Profile.current_order_as_buyer);
  }
  return result;
}

/*
 * Name: userSignUp
 * Parameters: string: email, string: password
 * Return:
 * Error Condition: errorMessage
 * Success: 1 represents sign in successfully
 * If sign up successfully, firebase will create a default profile related to that uid
 */
export async function userSignup (email, password, name) {
    var result;
    await firebase.auth().createUserWithEmailAndPassword(email, password).then(

      function success(){
        result = 0;
          var newUID = getCurrentUserUID();
          var newProfileDirName = "Profile/" + newUID;
          var ref = firebase.database().ref(newProfileDirName);
          ref.set({default_mode:"buyer", rate:5, username:name,
              history:{total_num:0}, photo:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-LV4tX2VqMy115iZNiIgowzRQ2UXWWBAqCfh5GoSIvyrzgD32"});
      }
    ).catch(
      function failure(error){
        var errorCode = error.code;
        var errorMsg = error.message;

        result = errorMsg;

      }
    );

    return result;
  }

  /*
  * Name: userPasswordChange
  * Parameters: string: newPassword
  * Return: N/A
  * Error Condition: errorMessage
  * Success: Password sucessfully
  */
  export async function userPasswordChange(newPassword){
    var user = firebase.auth().currentUser;
    var newPassword = getASecureRandomPassword();

    user.updatePassword(newPassword).then(function() {
      // Update successful.
    }).catch(function(error) {
      // An error happened.
    });

  }

  /*
  * Name: displayMenu
  * Parameters: None
  * Return: List of pairs. [[img, TypeName]...]
  * Error Condition: None
  */
  export async function displayMenu () {
    // access the Menu field in firebase
    const firebaseRef = firebase.database().ref("Menu");
    var result;
    await firebaseRef.once('value', function(snapshot){
      let menu = [];
      let type = [];

      // Find the value of the Menu field
      let types = snapshot.val();
      var typeName;

      // loop through all types in menu
      for( typeName in types){
        // for each different type, get the value
        let typeField = types[typeName];
        type = [];

        // find image and name
        type.push(typeField.image);
        type.push(typeName);
        menu.push(type);
      }
      result = menu;
    });

    return result;
  }

  /*
  * Name: displayType
  * Parameters: string: type
  * Return: an array contains each item with image, id, and name.
  * @image: url
  * @id: string
  * @name: string
  */
  export async function displayType (type) {
    let firebaseRef = firebase.database().ref('Menu');
    var drinks;
    await firebaseRef.once('value', dataSnapshot => {
      let info = [];
      let result = [];
      let menu = dataSnapshot.val();
      var index;
      for (index in menu[type].items) {
        let item = menu[type].items[index];
        info = [];
        //let drink = {image: item.image, id: index, name: item.name}
        info.push(item.image);
        info.push(index);
        info.push(item.name);
        result.push(info);
      }
      drinks = result;
    });
    return drinks;
  }

  /*
  * Name: displayItem
  * Parameters: string: type, string: item_id
  * Return:
  * The array containing name, description, image.
  */
  export async function displayItem (type, item_id) {
    // get the direction
    dir = "Menu/" + type + "/items/" + item_id;

    var coffee;
    await firebase.database().ref(dir).once("value", function (snapshot) {
      coffee = snapshot.val();

    });
    return coffee;
}

/*
 * Name: saveOrder
 * Description: save order object to database
 * Parameters: object: order
 * Return:
 * Error Condition: none
 * Success: return order id of saved order
 */
export async function saveOrder (order) {
  let orderRef = firebase.database().ref("Orders");
  let order_id = 0;
  await orderRef.once("value", dataSnapshot => {
    order_id = dataSnapshot.val().size;
    if (!order_id) {
      order_id = 0;
    }
    order.id = order_id;
    orderRef.child("items").child(order_id).set(order);
    orderRef.child("size").set(++order_id);
  });

  return order_id;
}

/*
 * Name: createOrder
 * Description: create buyer order
 * Parameters: Object items, string location, string request_time
 * Return: order_id
 */
  export async function createOrder(orders, orderLocation, requestTime){
    var buyerId = await getCurrentUserUID();
    var createTime = new Date().toLocaleString('en-US', { hour12: false });

    var orderObject ={
      buyer_id: buyerId,
      buyer_rate: -1,
      carrier_id: -1,
      create_time: createTime,
      items: orders,
      last_update_time: createTime,
      location: orderLocation,
      request_time: requestTime,
      status: 1
    }

    var orderId = await saveOrder(orderObject);
    profileRef = firebase.database().ref("Profile/" + buyerId);
    profileRef.child("current_order_as_buyer").set(orderId);
    addOrderStatusChangeListener(orderId - 1);
    return orderId;
  }


  /*
  * Name: cancelByBuyer
  * Description: delete order object from database
  * Parameters: string: order_id
  */
  export function cancelByBuyer(order_id) {
    let orderRef = firebase.database().ref("Orders/items/" + order_id);
    orderRef.remove();
  }


  /*
  * Name: cancelByCarrier
  * Description: return accepted order object to pending orders
  * Parameters: string: order_id
  */
  export function cancelByCarrier(order_id) {
    let orderRef = firebase.database().ref("Orders/items/" + order_id);
    orderRef.once('value', dataSnapshot => {
      if (dataSnapshot.val().status === 2) {
        orderRef.child('status').set(1);
      }
    });
  }

  /*
  * Name: viewPendingOrders
  * Description: This is for carrier to see all pending orders
  * Parameters: object: order
  * Return: An array of order_id
  * Error Condition: none
  * Success: N/A
  */
  export async function viewPendingOrders() {
    // access the Menu field in firebase
    const firebaseRef = firebase.database().ref("Orders");

    var pendingOrders;
    await firebaseRef.once('value', function(snapshot){

      // Find the value of Orders field
      let orders = snapshot.val();
      orders = orders.items;

      pendingOrders=[];
      var order_id;

      // loop through all types in orders
      for( order_id in orders){

        // check if it is a pending order
        let order = orders[order_id];
        if( order.status == 1){
          pendingOrders.push(order_id);
        }

      }
    }, function(errorObject){
      alert("failed:" + errorObject.code);
    });

    return pendingOrders;
  }

  /*
  * Name: updateOrderStatus
  * Description: update order status
  * Parameters: string: order_id
  * Return:
  * Error Condition: none
  * Success: update the order status
  */
  export async function updateOrderStatus(order_id) {
    let orderRef = firebase.database().ref("Orders/items/" + order_id);
    let status = -1;
    await orderRef.once("value", dataSnapshot => {
      if (!dataSnapshot) {
        return;
      } else {
        status = dataSnapshot.val().status;
        status = Math.min(++status, 3);
        orderRef.child("status").set(status);
      }

      updateLastTime(order_id);
    });
  }

  /*
  * Name: viewOrderDetailById
  * Parameters: string: order_id
  * Return: object orderInformation
  * The json containing the information of the order corresponding to the order_id
  *
  */
  export async function viewOrderDetailById (order_id) {
    // get the direction
    dir = "Orders/items/" + order_id;
    var orderInformation;
    await firebase.database().ref(dir).once("value", function (snapshot) {
      orderInformation = snapshot.val();
    });


    return orderInformation;
}


/*
 * Name: getOrderLocationById
 * Parameters: string: order_id
 * Return: return location string,
 * Parameter: string:order_id
 * Return: location of this order
 */
export async function getOrderLocationById (order_id){
  // get the direction
  dir = "Orders/items/" + order_id;
  var location;
  await firebase.database().ref(dir).once("value", function (snapshot){
    location = snapshot.val().location;
    location = location.split(' ').join('%20');
  });
  return location;
}

/*
 * Name: getProfileDetailById
 * Parameters: string: profile_id
 * Return: object profile
 *
 */
export async function getProfileDetailById(profile_id){
  dir = "Profile/" + profile_id;
  var result;
  await firebase.database().ref(dir).once("value", function(snapshot){
    result = snapshot.val();
  })

  return result;
}


/*
 * Name: acceptOrder
 * Parameter: string:order_id  string:carrier_id
 * Return: -1 if the order is not found or already accepted by others.
 * If the current order is still pending, the carrier will take the order.
 * The database will update the carrier_id entry with the current carrier_id.
 * If the order is already taken by others, it will return -1.
 */
export async function acceptOrder(order_id){
    var carrier_id = getCurrentUserUID();
  let orderRef = firebase.database().ref("Orders/items/" + order_id);
  let status = -1;
  await orderRef.once("value", dataSnapshot => {
      // the order is already accpeted by others if status is not 1
      if (dataSnapshot.val().status != 1) {
        alert("The order is already accepted by others. Try refresh!");
      }

      // update the carrier_id and status of the order.
      else {
        orderRef.child("carrier_id").set(carrier_id);
        orderRef.child("status").set(2);
      }

      updateLastTime(order_id);
    });
  }

  /*
  * Name: getDistance
  * Parameters: string: starting location, string destination, order_id
  * Return: a pair (location distance, order_id)
  *
  */
  export async function getDistance(origin, destination, id) {
    return new Promise(function(resolve,reject){
      const xhr = new XMLHttpRequest();

      const url = "https://maps.googleapis.com/maps/api/directions/json?origin="+origin+"&destination="+destination+"%20ucsd&mode=walking";
      xhr.responseType = 'json';
      //let orderWithDist;
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          var orderWithDist = {dist: xhr.response.routes[0].legs[0].distance.value, order_id: id};
          resolve(orderWithDist);
        }
      };

      xhr.ontimeout = function() {
        reject("timeout");
      }
      xhr.open('GET', url);
      xhr.send();
    });

  }

  /*
  *  Helper function used to compare two orders with ids.
  */
  function compare (a, b){
    if (a.dist > b.dist){
      return 1;
    }
    else if (a.dist < b.dist){
      return -1;
    }
    return 0;
  }

  /*
  * Name: sortOrder
  * Parameters: string: origin
  * Return: array containing order ids
  * Sort the pending order based on some rules (for now, we are only sorting it with
    * distance from the origin)
    */
    export async function sortOrders(origin) {
      let orders = await viewPendingOrders();
      let ordersWithDistance = [];
      var current;
      const loc = origin.split(' ').join('%20'); // initial location
      for (let i = 0; i < orders.length; i++) {
        current = await getDistance(loc, await getOrderLocationById(orders[i]), orders[i]);
        await ordersWithDistance.push(current);
      }

      await ordersWithDistance.sort(compare);
      console.log(ordersWithDistance);
      let ordersResult = [];
      for (let j = 0; j < ordersWithDistance.length; j++){
        ordersResult.push(ordersWithDistance[j].order_id);
      }
      return ordersResult;
    }

    export async function getOrderRequestTime(order_id) {
      let dir = "Orders/items/" + order_id;
      var location;
      await firebase.database().ref(dir).once("value", function (snapshot){
        location = snapshot.val().location;
        location = location.split(' ').join('%20');
      });
      return location;
    }

    export async function sortOrdersByRequestTime() {
      let orders = await viewPendingOrders();

      // build array with each object containing id and request_time
      let ordersWithRequestTime = [];
      for (let i = 0; i < orders.length; i++) {
        var orderRef = firebase.database().ref("Orders/items/"+orders[i]);
        await orderRef.once("value", dataSnapshot => {
          ordersWithRequestTime.push({orderId:orders[i],requestTime:dataSnapshot.val().request_time});
        });
      }

      await ordersWithRequestTime.sort(compareByRequestTime);

      // build the result array
      let resList = [];
      for (var j = 0; j < ordersWithRequestTime.length; j++){
        resList.push(ordersWithRequestTime[j].orderId);
      }
      return resList;

    }
    /*
    * Name: completeOrder
    * Parameter: string: order_id  string: user_id
    * Return: N/A
    */
    export async function completeOrder(order_id, user_id) {
      let profileRef = firebase.database().ref("Profile/" + user_id + "/hisory/");
      await profileRef.once("value", snapshot => {
        index = snapshot.val().totalNum;
      });

      let orderRef = firebase.database().ref("Orders/items/" + order_id);
      await orderRef.once("value", dataSnapshot => {

        // current order status is 4: completedByBuyer, then carrier click complete
        // update status to be 6: completed
        if (dataSnapshot.val().status === 4 && dataSnapshot.val().carrier_id == user_id) {
          orderRef.child("status").set(6);
          profileRef.child("orders").child(index).set(order_id);
          profileRef.child("total_num").set(++index);
      }

      // current order status is 5: completedByCarrier, then buyer click complete
      // update status to be 6: completed
      else if (dataSnapshot.val().status === 5 && dataSnapshot.val().buyer_id == user_id) {
          orderRef.child("status").set(6);
          profileRef.child("orders").child(index).set(order_id);
          profileRef.child("total_num").set(++index);

          ref = firebase.database().ref("Profile/" + user_id);
          ref.child("current_order_as_buyer").set('-1');
          removeOrderStatusChangeListener(orderId);
      }

      // current order status is 3: delivering, then buyer click complete
      // update status to be 4: completedByBuyer
      else if (dataSnapshot.val().status === 3 && dataSnapshot.val().buyer_id == user_id){
          orderRef.child("status").set(4);
          console.log("complete by buyer");
          profileRef.child("orders").child(index).set(order_id);
          profileRef.child("total_num").set(++index);

          ref = firebase.database().ref("Profile/" + user_id);
          ref.child("current_order_as_buyer").set('-1');
          removeOrderStatusChangeListener(orderId);
      }

      // current order status is 3: delivering, then carrier click complete
      // update status to be 5: completedByCarrier
      else if (dataSnapshot.val().status === 3 && dataSnapshot.val().carrier_id == user_id){
          orderRef.child("status").set(5);
          console.log("complete by carrier");
          profileRef.child("orders").child(index).set(order_id);
          profileRef.child("total_num").set(++index);
      }

      updateLastTime(order_id);
  });
}

/*
 * Name: changeDefaultMode
 * Parameters: string id, string mode
 * Return: N/A
 * change the default mode to given mode.
 */
export async function changeDefaultMode(id, mode) {
  let profileRef = firebase.database().ref("Profile/"+id);
  let defaultMode;
  await profileRef.once("value", dataSnapshot => {
      profileRef.child("default_mode").set(mode);
    }
  );

}


/*
 * Name: changeProfilePhoto
 * Parameters: string id, string url
 * Return: N/A
 * update user profile photo
 */
export async function changeProfilePhoto(id, url) {
  let profileRef = firebase.database().ref("Profile/"+id);
  await profileRef.once("value", dataSnapshot => {
    profileRef.child("photo").set(url);
  });
}

/*
 * Name: logout
 * Parameters: N/A
 * Return: 0 if success, otherwise return error message
 * logout the user
 */
export async function logout() {

    var curUser = getCurrentUserUID();
    var Profile = await getProfileById(curUser);
    if (Profile.current_order_as_buyer != null && Profile.current_order_as_buyer != -1)
        removeOrderStatusChangeListener(Profile.current_order_as_buyer);

  var result;
    await firebase.auth().signOut().then(

      function success(){
        result = 0;
      }
    ).catch(
      function failure(error){
        var errorCode = error.code;
        var errorMsg = error.message;

        result = errorMsg;

      }
    );

    return result;
  }

  /*
  * Name: displayOrderHistory
  * Parameters: string user_id
  * Return: order history
  * return order history of the given user
  */
  export async function displayOrderHistory(user_id) {
    // get the directory
    let dir = "Profile/" + user_id + "/history";
    let orderHis;
    await firebase.database().ref(dir).once("value", function (snapshot) {
      orderHis = snapshot.val();
    });

    return orderHis;
  }

  /*
  * Name: getProfileById
  * Parameters: string user_id
  * Return: object profile
  * return profile information of the given user
  */
  export async function getProfileById(user_id) {
    // get the directory
    let dir = "Profile/" + user_id;
    let profile;
    await firebase.database().ref(dir).once("value", function (snapshot) {
      profile = snapshot.val();
  });

  return profile;
}

/*
 * Name: updateDelivery
 * Parameters: order_id,
 * Return: database change
 * update user profile photo
 */

 export async function updateLastTime(order_id){
   let dir;
   dir = "Orders/items/" + order_id + "/last_update_time";
   let update_time = firebase.database().ref(dir);
   var createTime = new Date().toLocaleString('en-US', { hour12: false });
   update_time.set(createTime);

 }

 /*
 * Name: updateOrderRate
 * Parameters: string order_id, string rate, boolean isBuyer, string user_id
 * Return: N/A
 * update rate in order and rate in given user
 */
export async function updateOrderRate(order_id, rate, isBuyer, user_id) {
  let orderDir;
  if (isBuyer) { // get direction
    orderDir = "Orders/items/" + order_id + "/buyer_rate";
  } else {
    orderDir = "Orders/items/" + order_id + "/carrier_rate";
  }
  let orderRef = firebase.database().ref(orderDir);
  orderRef.set(rate);

  let profileDir = "Profile/" + user_id;
  let prevRate;
  let totalNum;
  await firebase.database().ref(profileDir).once("value", function (snapshot) {
    user = snapshot.val();
    prevRate = user.rate;
    totalNum = user.history.total_num;
  });
  let newRate = (parseFloat(prevRate) * (parseInt(totalNum)-1) + parseFloat(rate)) / (parseInt(totalNum));
  let rateRef = firebase.database().ref(profileDir + "/rate");
  rateRef.set(newRate);
}

/*
 * Name: changeUserName
 * Parameters: string: user_id string:newName
 * Return: none
 * change the name of the user
 */
export async function changeUserName(user_id, newName){
    let profileRef = firebase.database().ref("Profile/" + user_id);
    var result;
    await profileRef.once("value", dataSnapshot => {
      if (!dataSnapshot) {
        result = -1;
      } else {
        profileRef.child("username").set(newName);
        result = 0;
      }
    });
    return result;
  }

  /*
  * Name: getCurrentUserUID
  * Parameter: None
  * Return: the uid of current user.
  * get the current user uid
  */
  export function getCurrentUserUID(){
    var currentUser = firebase.auth().currentUser;
    if (currentUser != null){
      return currentUser.uid;
    }
    return -1;
  }

  /*
  *  Helper function used to compare two orders with time.
  *  NOTICE: should be 24 hours format
  */
  function compareByRequestTime (a, b){
    // initialize array containing hours and minutes
    var aTime = a.requestTime.split(":");
    var bTime = b.requestTime.split(":");

    // compare hours
    if (aTime[0] > bTime[0]){
      return 1;
    }
    else if (aTime[0] < bTime[0]){
      return -1;
    }

    // compare minutes
    else if (aTime[1] > bTime[1]){
      return 1;
    }
    else if (aTime[1] < bTime[1]){
      return -1;
    }
    return 0;
}

/*
 * Name: getItemDetailWithOnlyId
 * Parameter: itemId
 * Return: the json containing item details
 * this function allows us to get item details with only id
 */
export async function getItemDetailWithOnlyId(itemId) {
    var dict = {HC:"Hot Coffees",
                DR:"Drinks",
                FR:"Frappuccino",
                CC:"Cold Coffees",
                HT:"Hot Teas",
                IT:"Iced Teas"};
    var type = dict[itemId.substring(0,2)];
    var itemDetail = await displayItem(type, itemId);
    return itemDetail;
}

export function addOrderStatusChangeListener(orderId){
    ref = firebase.database().ref("Orders/items/" + orderId +"/status");
    ref.on('value', statusUpdated);
}

export function removeOrderStatusChangeListener(orderId){
    ref = firebase.database().ref("Orders/items/" + orderId +"/status");
    ref.off('value', statusUpdated);
}

function statusUpdated(snapshot) {
    var changedChild = snapshot.val();
    if (changedChild === 2) {
        Alert.alert("Notification", "Someone just accepted your order!\n Please refresh the page!");
    }
    else if (changedChild != 1) {
        Alert.alert("Notification", "Your Order has been updated!\n Please refresh the page! ");
    }
}

export async function randomCoffee() {
  // random an integer for type
  let type = Math.floor(Math.random() * 6);

  // random an integer for item
  let item = Math.floor(Math.random() * 3) + 1;
  let hotTea = Math.floor(Math.random() * 3) + 1;

  let typeRef;
  let prefix;

  if (type === 0) {
    typeRef = 'Cold Coffees';
    prefix = 'CC';
  } else if (type === 1) {
    typeRef = 'Drinks';
    prefix = 'DR';
  } else if (type === 2) {
    typeRef = 'Frappuccino';
    prefix = 'FR';
  } else if (type === 3) {
    typeRef = 'Hot Coffees';
    prefix = 'HC';
  } else if (type === 4) {
    typeRef = 'Hot Teas';
    prefix = 'HT';
  } else if (type === 5) {
    typeRef = 'Iced Teas';
    prefix = 'IT';
  }

  let dir;
  // if (typeRef === 'Hot Teas') {
  //   dir = "Menu/" + typeRef + "/items/" + prefix + '0' + hotTea;
  // }
  dir = "Menu/" + typeRef + "/items/" + prefix + '0' + item;
  console.log("prefix is: " + prefix);
  console.log("dir in random is " + dir);
  var coffee;
  await firebase.database().ref(dir).once("value", function (snapshot) {
    coffee = snapshot.val();
  });
  return coffee;
}
