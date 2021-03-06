import React, {Component} from 'react';
import  { Card, CardItem, Title, Container, Header, Left, Body, Right, Button, Icon, Segment, Content, Text, Item, Input, Form, Label, View } from 'native-base';
import {getProfileDetailById, displayMenu, displayType, displayItem, viewPendingOrders, viewOrderDetailById, getOrderLocationById, sortOrders, completeOrder, changeDefaultMode, changeUserName, changeProfilePhoto, createOrder,
        acceptOrder, sortOrdersByRequestTime, getItemDetailWithOnlyId, addOrderStatusChangeListener, removeOrderStatusChangeListener} from './../database.js';


export class TestPage extends Component {
     constructor(props){
         super(props);

     }

     async testdisplayMenu(){
         var test = await displayMenu();
         console.log(test);
    }

    async testdisplayType(){
        var test = await displayType("Hot Coffees");
        console.log(test);
    }

    async testdisplayItem(){
        var test = await displayItem("Hot Coffees", "HC02");
        console.log(test);
    }

    async testviewPendingOrders(){
        var test = await viewPendingOrders();
        console.log(test);
    }

    async testViewOrderDetailById(){
        var result = await viewOrderDetailById("0");
        console.log(result);
    }

    async testGetOrderLocationById(){
        var test = await getOrderLocationById("6");
        console.log(test);
    }

    async testSortOrders() {
      var test = await sortOrders('Warren Lecture Hall');
      console.log(test);
    }

    async testgetProfileDetailById(){
        var test = await getProfileDetailById('01');
        console.log(test);
    }

    async testChangeUserName(){
         await changeUserName("01", "illustrious");
    }
    async testCompleteOrders() {
      completeOrder('3', '678');
      //console.log(test);
    }

    async testChangeDefaultMode(){
        var test = await changeDefaultMode('01', 'carrier');
        console.log("default mode has changed!");
    }

    async testChangeProfilePhoto(){
        var test = await changeProfilePhoto('01', 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Lesser_Sooty_Owl_at_Bonadio%27s_Mabi_Wildlife_Reserve.jpg');
        console.log("profile photo has changed!");
    }

    async testCreateOrder(){
        var items = {
            HC01: {customization:"a drink"},
            CC01: {customization: "lsdjf;saljdf;laskjdf;laskjfd;"},
        }
        var test = await createOrder(items, "Warren Lecture Hall", "08:00 AM");
        console.log("order id is " + test);
    }

    async testAcceptOrder(){
        var test = await acceptOrder("0", "1234567");
    }

    async testsortOrdersByRequestTime(){
         console.log(JSON.stringify(await sortOrdersByRequestTime()));
    }

    async testgetItemDetailWithOnlyId(){
        console.log(JSON.stringify(await getItemDetailWithOnlyId("HC01")));
    }

    testorderStatusChangeListener(){
         addOrderStatusChangeListener("0");
    }

    testremoveOrderStatusChangeListener(){
        removeOrderStatusChangeListener("0");
    }

     render(){
         return(
             <Container>
                <Header>
                  <Left>
                    <Button transparent onPress={() => this.props.navigation.goBack()}>
                       <Icon name='arrow-back' />
                    </Button>
                  </Left>
                    <Body>
                        <Title>Testing</Title>
                    </Body>
                    <Right />
                </Header>


                <Content>
                    <Text style={{fontSize:15, color:'#000000', fontFamily:'Hiragino Sans', margin:10}}>Functions that does not change value in database will have a test button here.
                        Return value will be printed to console</Text>

                        <Card>
                        <CardItem header>
                          <Text>getProfileDetialById</Text>
                        </CardItem>

                        <CardItem>
                            <Body>
                                <Text>Input: profile_id</Text>
                                <Text>Output: Object that contains all details</Text>
                                <Text />
                                <Button small primary onPress={this.testgetProfileDetailById}>
                                    <Text>Test</Text>
                                </Button>
                            </Body>
                        </CardItem>
                    </Card>

                    <Card>
                        <CardItem header>
                          <Text>DisplayMenu</Text>
                        </CardItem>

                        <CardItem>
                            <Body>
                                <Text>Input: N/A</Text>
                                <Text>Output: Array of pairs which include image and name for all types</Text>
                                <Text />
                                <Button small primary onPress={this.testdisplayMenu}>
                                    <Text>Test</Text>
                                </Button>
                            </Body>
                        </CardItem>
                    </Card>

                    <Card>
                        <CardItem header>
                          <Text>DisplayType</Text>
                        </CardItem>

                        <CardItem>
                            <Body>
                                <Text>Input: String typeName (example input is "Hot Coffees")</Text>
                                <Text>Output: An array contains each item with image, id, and name.</Text>
                                <Text />
                                <Button small primary onPress={this.testdisplayType}>
                                    <Text>Test</Text>
                                </Button>
                            </Body>
                        </CardItem>
                    </Card>

                    <Card>
                        <CardItem header>
                          <Text>DisplayItem</Text>
                        </CardItem>

                        <CardItem>
                            <Body>
                                <Text>Input: String typeName, item_Id (example input is ("Hot Coffees", "HC02")</Text>
                                <Text>Output: Item object</Text>
                                <Text />
                                <Button small primary onPress={this.testdisplayItem}>
                                    <Text>Test</Text>
                                </Button>
                            </Body>
                        </CardItem>
                    </Card>

                    <Card>
                        <CardItem header>
                          <Text>ViewPendingOrders</Text>
                        </CardItem>

                        <CardItem>
                            <Body>
                                <Text>Input: N/A</Text>
                                <Text>Output: List of pending orders id</Text>
                                <Text />
                                <Button small primary onPress={this.testviewPendingOrders}>
                                    <Text>Test</Text>
                                </Button>
                            </Body>
                        </CardItem>
                    </Card>

                    <Card>
                        <CardItem header>
                          <Text>ViewOrderDetailById</Text>
                        </CardItem>

                        <CardItem>
                            <Body>
                                <Text>Input: string orderId (example: "2")</Text>
                                <Text>Output: Order object</Text>
                                <Text />
                                <Button small primary onPress={this.testViewOrderDetailById}>
                                    <Text>Test</Text>
                                </Button>
                            </Body>
                        </CardItem>
                    </Card>

                    <Card>
                        <CardItem header>
                          <Text>getOrderLocationById</Text>
                        </CardItem>

                        <CardItem>
                            <Body>
                                <Text>Input: Order_id</Text>
                                <Text>Output: String Location</Text>
                                <Text />
                                <Button small primary onPress={this.testGetOrderLocationById}>
                                    <Text>Test</Text>
                                </Button>
                            </Body>
                        </CardItem>
                    </Card>

                    <Card>
                        <CardItem header>
                          <Text>sortOrder</Text>
                        </CardItem>

                        <CardItem>
                            <Body>
                                <Text>Input: order id</Text>
                                <Text>Output: json object</Text>
                                <Text />
                                <Button small primary onPress={this.testSortOrders}>
                                    <Text>Test</Text>
                                </Button>
                            </Body>
                        </CardItem>
                    </Card>

                    <Card>
                    <CardItem header>
                        <Text>changeUserName</Text>
                    </CardItem>

                    <CardItem>
                        <Body>
                        <Text>Input: user_id newName</Text>
                        <Text />
                        <Button small primary onPress={this.testChangeUserName}>
                            <Text>Test</Text>
                        </Button>
                        </Body>
                    </CardItem>
                    </Card>

                    <Card>
                        <CardItem header>
                          <Text>completeOrder</Text>
                        </CardItem>

                        <CardItem>
                            <Body>
                                <Text>Input: order id</Text>
                                <Text>Output: json object</Text>
                                <Text />
                                <Button small primary onPress={this.testCompleteOrders}>
                                    <Text>Test</Text>
                                </Button>
                            </Body>
                        </CardItem>
                    </Card>


                    <Card>
                        <CardItem header>
                          <Text>changeDefaultMode</Text>
                        </CardItem>

                        <CardItem>
                            <Body>
                                <Text>Input: user_id, mode as a string</Text>
                                <Text>Output: database change</Text>
                                <Text />
                                <Button small primary onPress={this.testChangeDefaultMode}>
                                    <Text>Test</Text>
                                </Button>
                            </Body>
                        </CardItem>
                    </Card>


                    <Card>
                        <CardItem header>
                          <Text>changeProfilePhoto</Text>
                        </CardItem>

                        <CardItem>
                            <Body>
                                <Text>Input: profile_id, photo url as a string</Text>
                                <Text>Output: database change</Text>
                                <Text />
                                <Button small primary onPress={this.testChangeProfilePhoto}>
                                    <Text>Test</Text>
                                </Button>
                            </Body>
                        </CardItem>
                    </Card>

                    <Card>
                        <CardItem header>
                          <Text>createOrder</Text>
                        </CardItem>

                        <CardItem>
                            <Body>
                                <Text>Input: Object items, location, request time</Text>
                                <Text>Output: database change</Text>
                                <Text />
                                <Button small primary onPress={this.testCreateOrder}>
                                    <Text>Test</Text>
                                </Button>
                            </Body>
                        </CardItem>
                    </Card>

                    <Card>
                        <CardItem header>
                          <Text>acceptOrder</Text>
                            <Text>sortOrderByRequestTime</Text>
                        </CardItem>

                        <CardItem>
                            <Body>
                                <Text>Input: order_id, carrier id</Text>
                                <Text>Output: database change</Text>
                                <Text />
                                <Button small primary onPress={this.testAcceptOrder}>
                                    <Text>Test</Text>
                                </Button>
                            <Text>Output: orders sorted by time</Text>
                            <Text />
                            <Button small primary onPress={this.testsortOrdersByRequestTime}>
                                <Text>Test</Text>
                            </Button>
                            </Body>
                        </CardItem>
                    </Card>

                    <Card>
                        <CardItem header>
                            <Text>getItemDetailWithOnlyId</Text>
                        </CardItem>

                        <CardItem>
                            <Body>
                            <Text>Input: order_id, carrier id</Text>
                            <Text>Output: itemDetail</Text>
                            <Text />
                            <Button small primary onPress={this.testgetItemDetailWithOnlyId}>
                                <Text>Test</Text>
                            </Button>
                            </Body>
                        </CardItem>
                    </Card>

                    <Card>
                        <CardItem header>
                            <Text>testorderStatusChangeListener</Text>
                        </CardItem>

                        <CardItem>
                            <Body>
                            <Text />
                            <Button small primary onPress={this.testorderStatusChangeListener}>
                                <Text>Test</Text>
                            </Button>
                            </Body>
                        </CardItem>
                    </Card>

                    <Card>
                        <CardItem header>
                            <Text>testremoveOrderStatusChangeListener</Text>
                        </CardItem>

                        <CardItem>
                            <Body>
                            <Text />
                            <Button small primary onPress={this.testremoveOrderStatusChangeListener}>
                                <Text>Test</Text>
                            </Button>
                            </Body>
                        </CardItem>
                    </Card>

                </Content>

              </Container>
         );
     };

}
