/*
  Filename: Start.js
  Version: 0.1.0
  Description: This page is the first page of the app, contains UI elements with
  buttons to navigate to log in/sign up pages
*/
import React, {Component} from 'react';
import {Image} from 'react-native';
import {Container, Header, Content, Button, Text} from 'native-base';
import {styles} from '../CSS/Start.js';
import {StackNavigator} from 'react-navigation'

export class Start extends Component {

  static navigationOptions = {
    header: null,
    gesturesEnabled: false,
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container style={styles.container}>

        <Container style={styles.container}>

          <Image style={styles.logo} source={require('../resources/logo.png')}/>
          <Text style={styles.name}>
            CaffeineMated
          </Text>
        </Container>


        {/*Containing login/signup buttons*/}
        <Container style={styles.bottom}>
          <Button
            style={styles.buttons}
            light
            onPress={() => this.props.navigation.navigate('login')}>
            <Text style = {{color: '#FF9052', fontSize: 20}}>
              Log In
            </Text>
          </Button>
          <Button
            style={styles.buttons}
            light
            onPress={() => this.props.navigation.navigate('signup')}>
            <Text style = {{color: '#FF9052', fontSize: 20}}>
              Sign Up
            </Text>
          </Button>
        </Container>
      </Container>
    );
  }
}
