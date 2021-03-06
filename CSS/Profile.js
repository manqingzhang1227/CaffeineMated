import {StyleSheet, Dimensions} from 'react-native';

export const styles = StyleSheet.create({
  color_theme: {
    backgroundColor: '#f8f8f8',
  },
  icon: {
    color: '#FF9052',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  profileSection: {
    flex: 0.35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailSection: {
    flex: 0.55,
  },
  starSection: {
    flex: 0.25,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttons: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius:10,
    borderWidth: 2,
    borderColor: '#FF9052',
    //fontSize: 30,
    width: 150,
    padding: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  bottom:{
    flex: 0.125,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    //alignSelf: 'flex-end'
  },
  button_text: {
    color: '#ffffff',
  },
  signOut: {
    backgroundColor: '#FF9052',
  },
  signOutText: {
    color: "#ffffff",
  },
});
