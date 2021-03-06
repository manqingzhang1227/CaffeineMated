import {StyleSheet, Dimensions} from 'react-native';

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const deviceWidthScale = 0.80;
const deviceHeightScale = 0.07;

export const styles = StyleSheet.create({
  container:{
    borderColor: '#c8c8c8',
    borderWidth: 2,
    borderRadius: 6,
    flex: 0.74,
    width: deviceWidth*deviceWidthScale,
    alignSelf: 'center',
    //marginTop: '1%',
    backgroundColor: '#FFFFFF',
  },
  progressBarView:{
    borderColor: '#c8c8c8',
    borderWidth: 2,
    borderRadius: 6,
    flex: 0.08,
    width: 4*deviceWidth/5,
    alignSelf: 'center',
    marginTop: 10,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  progressBar: {
    justifyContent: 'center',
    flexDirection: 'row'
  },
  progressText: {
    fontSize: 12,
    fontWeight: '300',
    alignSelf: 'center',
    //marginTop: 10,
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 150/2,
    borderWidth: 1,
    borderColor: 'grey',
    backgroundColor: '#D8D8D8'
  },
  circleFilled: {
    width: 16,
    height: 16,
    borderRadius: 150/2,
    borderWidth: 1,
    borderColor: 'grey',
    backgroundColor: '#FF9052'
  },
  line: {
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    width: 20,
    marginBottom: 8,
  },
  carrierView: {
    flexDirection: 'row',
    marginTop: 10
  },
  carrierText: {
    flex: 0.65
  },
  carrierPic: {
    flex: 0.35,
    justifyContent: 'center',
    flexDirection: 'column'
  },
  carrierStars: {
    justifyContent: 'center',
    flexDirection: 'row'
  },
  buttons_submit: {
    backgroundColor: '#ff9052',
    flexDirection: 'row',
    justifyContent: 'center',
    //fontSize: 30,
    width: deviceWidth*deviceWidthScale,
    height:deviceHeight*deviceHeightScale,
    padding: 5,
    borderWidth: 2,
    borderColor: '#ff9052',
    marginTop: 10,
    alignSelf: 'center',
  },
  menuText:{
    color: '#ffffff',
    fontSize: 24,
  },
  carrierTitle:{
    color: '#FF9052',
    fontSize: 24,
    alignSelf: 'center',
    marginTop: 5
  },
  icon: {
    color: '#FF9052',
    fontSize: 20,
  },
  orderTitle:{
    color: '#FF9052',
    fontSize: 24,
    alignSelf: 'center',
    marginTop: 20,
  },
  progressSpinLabel: {
    fontSize: 16,
    color: '#8E8E93',
    alignSelf: 'center',
  },
  progressSpin: {
    transform: [{ scale: 0.5 }],
    alignSelf: 'flex-start',
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  labelTextFirst: {
    fontSize: 12,
    fontWeight: '300',
    left: 5,
    marginTop: '2%'
  },
  labelContent: {
    fontSize: 18,
    left: 30,
    marginTop: '2%'
  },
  labelTextItems: {
    fontSize: 12,
    fontWeight: '300',
    left: 5,
    marginTop: 10,
  },
  orderCard: {
    height: 90,
  },
  cardTextView:{
    right: 7,
    justifyContent: 'center',
  },
  cardPrimaryText: {
    textAlign: 'right',
    fontSize: 14,
    alignSelf: 'flex-end'
  },
  cardSecondaryText: {
    textAlign: 'right',
    fontSize: 12,
    fontWeight: '300',
    fontStyle: 'italic',
    alignSelf: 'flex-end'
  },
  itemImage: {
    marginTop: 15,
    left: 10
  },
  orderDetailText:{
    alignSelf: 'center',
    borderBottomColor: '#c8c8c8',
    borderBottomWidth: 2,
    marginTop: '2%',
    //marginBottom: '2%',
    width: '100%'
  },
  orderText: {
    textAlign: 'center',
    fontSize: 24,
    color: '#ff9052',
    marginBottom: '2%',
  },
  listItems : {
    alignSelf : 'center',
    alignItems : 'center',
    width: '100%',
    borderBottomColor: '#c8c8c8',
    borderBottomWidth: 2,
    justifyContent: 'center',
    width : deviceWidth*deviceWidthScale
  },

});
