/*
  Filename: BuyerMain.js
  Version: 0.1.0
  Description: This page contains UI elements for the buyer's main page, 
  as well as functions for date time picker and swipable list.
*/
import React, {Component} from 'react';
import { TouchableOpacity, Image, RefreshControl, ListView } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Container, Header, Left, Body, Right, Button, Icon, Segment, Content, Text, Item, Input, Form, Label, View, List, ListItem, Spinner, Thumbnail,Card, CardItem, Toast } from 'native-base';
import {viewPendingOrders, viewOrderDetailById, acceptOrder, updateOrderStatus, completeOrder, cancelByCarrier, getProfileDetailById, createOrder} from './../database.js';
import {styles} from '../CSS/Main.js';
import SubmitOrder from './SubmitOrder.js';
import IconVector from 'react-native-vector-icons/Entypo';
import { PlaceChoose } from './PlaceChoose.js';
import { CoffeeOfTheDay } from './CoffeeOfTheDay.js';

export class BuyerMain extends Component {

  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    // Used for swipable list
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      orderSubmitted : false,
      placeChoose : false,
      // Order data containing all drinks ordered
      order_data : this.props.get("order_data"),
    }

    // Bind function
    this.submitValidityCheck = this.submitValidityCheck.bind(this);
  }

  // For date time picker ------------------------------------------------------------
  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });
  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (date) => {
    // Extract the hr:min part
    var time = date.toString().substring(16, 21);
    this.props.change("buyer_whenLogan", time);
    //this.setState({whenLogan: time});
    this._hideDateTimePicker();
  };
  // Date time picker End ------------------------------------------------------------

  orderCancelled = () => {
    // Update states & alert
    this.setState({orderSubmitted: false});
    this.setState({orderSubmitted: false});
    alert('Order Cancelled');
  }

  async submitValidityCheck() {
    // Make sure everything is selected and the buyer has ordered at least 1 drink
    if(this.props.get('buyer_whereLogan') == 'Specify a place' ||
       this.props.get('buyer_whenLogan') == 'Pick a time') {
      // If not, alert /the user and not proceed
      alert('Please fill out location & time!');
    } else if(this.props.get('order_data').length == 0) {
      alert(
        'Please order at least one drink!');
      } else {
        // Proceed; call the backend function to create the order
        var id = await createOrder(this.props.get('order_data'),
                             this.props.get('buyer_whereLogan'),
                             this.props.get('buyer_whenLogan'));
        // Update states
        this.setState({orderSubmitted: true});
        this.props.change('orderId', id);
        this.props.change('orderSubmitted', true);
      }
    }

    // For swipable list delete one row (from nativebase)
    deleteRow(secId, rowId, rowMap) {
      rowMap[`${secId}${rowId}`].props.closeRow();
      var newData = [...this.props.get('order_data')];
      rowId = parseInt(rowId); 
      newData.splice(rowId, 1);
      this.props.change('order_data', newData);
      var newTotalPrice = 0;
      for(var i = 0; i < newData.length; i++) {
        newTotalPrice += newData[i].itemObject.price;
      }
      this.props.change('totalPrice', newTotalPrice);
      this.setState({ order_data: newData });
    }

    render(){
      // For swipable list
      const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
      // Texts displayed (as well as keeping track of) for when & where
      var saveInfoObject = {
        buyer_whenLogan: this.props.get("buyer_whenLogan"),
        buyer_whereLogan: this.props.get("buyer_whereLogan"),
        carrier_whenLogan: this.props.get("carrier_whenLogan"),
        carrier_whereLogan: this.props.get("carrier_whereLogan")
     }

      return(
        <Container style = {styles.Container}>
          <View style= {styles.banner}>
            {/* ------------------------ When & Where section -------------------------- */}
            <View style={styles.textInput}>
              <Button iconLeft style={styles.Whenbutton} onPress={this._showDateTimePicker}>
                <Icon style={styles.Whenwheretext} name='alarm' />
                <Text style={styles.Whenwheretext}>{this.props.get("buyer_whenLogan")}</Text>
              </Button>
              {/* DateTime Picker from github open source project */}
              <DateTimePicker
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this._handleDatePicked}
                onCancel={this._hideDateTimePicker}
                mode='time'
                titleIOS='Pick a time'
                is24Hour={true}
                timeZoneOffsetInMinutes={-7 * 60}
              />
            </View>

            <View style={styles.textInput}>
              <Button iconRight style={styles.Wherebutton} onPress={()=> {
                this.props.change("buyer_choosePlaces")}
              }>
                <Text numberOfLines={1} style={styles.Whenwheretext2}>{this.props.get("buyer_whereLogan")}</Text>
                <Icon style={styles.Whenwheretext} name='navigate' />
              </Button>
            </View>

            {/* ------------------------------- Menu button section ------------------------------- */}
            <View style={styles.textInput_menu}>
              <Button style={styles.buttons_menu}  color="#ffffff"
                onPress={() => this.props.navigation.navigate('menu', {
                  data: this.props.get("order_data"),
                  saveInfo: saveInfoObject,
                })}>
                <Text style={styles.menuText}> Menu </Text>
              </Button>
            </View>

            {/* ------------------------ LIST OF ORDER ITEMS ------------------------- */}
            <View style={styles.orderItem}>
              
                <View style={styles.orderDetailText}> 
                  <Text style={styles.orderText}> Order Details </Text>
                </View>

                {this.props.get("order_exists") &&
                // The actual list used to display orders
                <List contentContainerStyle={styles.itemList} dataSource={this.ds.cloneWithRows(this.props.get("order_data"))}

                  renderRow={data =>
                  // Each list item
                  <ListItem style={styles.listItems}>
                      <View style = {{flexDirection: 'row'}} />

                        <Left>
                          <Thumbnail style={styles.itemImage} source={{uri: data.image}} />
                        </Left>

                      <Container style = {styles.cardTextView}>
                        <Container style = {{flexWrap: "wrap", height: '100%', width: '70%', alignSelf: 'flex-end'}}>
                          <Text style ={styles.cardPrimaryText}>
                            {data.name}
                          </Text>
                          </Container>
                          <Text style ={styles.cardSecondaryText}>
                            {data.itemObject.size}
                          </Text>
                          <Text style ={styles.cardSecondaryText}>
                            ${data.itemObject.price}
                          </Text>
                        </Container>
                  </ListItem>}
                  
                  showsHorizontalScrollIndicator={false}
                  directionalLockEnabled = {true}
                  renderRightHiddenRow={(data, secId, rowId, rowMap) =>
                  <Button full danger onPress={_ => this.deleteRow(secId, rowId, rowMap)}>
                  <Icon active name="trash" />
                  </Button>}
                  rightOpenValue={-75}
                />
                }

                {/* ------------------------- No orders ------------------------- */}
                {!this.props.get("order_exists") &&
                    <CoffeeOfTheDay />
                 }
              
            </View>

            {/* ----------------------END OF LIST OF ORDER ITEMS ------------------------- */}


            {/* ----------------------- Estimated price section ------------------------- */}
              <Text style={styles.priceText}>
                Total Estimated Price: ${this.props.get('totalPrice')}
              </Text>

            {/* ------------------------- Submit button section ----------------------------- */}
            <View style={styles.buttonItem}>
              <Button
                style={styles.buttons_submit}
                color="#ffffff"
                onPress={this.submitValidityCheck}>
              <Text style={styles.submitText}> Submit </Text>
              </Button>
            </View>

          </View>
        </Container>
      );
    }
  }
  export default BuyerMain;
