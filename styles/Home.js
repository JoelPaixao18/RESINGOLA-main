import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { 
    paddingHorizontal: 20, 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  header: {
    marginTop: 80,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  inputContainer: {
    width: "100%",
    height: 56,
    backgroundColor: "white",
    borderStyle: "solid",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
  },
  content:{
    width: "100%",
    gap: 20,
  },
  cardContainer: {
    flexGrow: 1,
    padding: 10,
  },
  gridContainer: {
    flexDirection: 'row', // Cards na horizontal
    flexWrap: 'wrap', // Permite que os cards se ajustem para a linha seguinte
    justifyContent: 'space-between',
    padding: 5,
  },
  card: (screenWidth) => ({
    width: screenWidth / 2 - 20,
    borderRadius: 15,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    gap: 5,
    backgroundColor: "grey",
    margin: 10,
    width: 130,
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
  }),
  cardButton:{
    flexDirection: "columns",
  },
  cardImage:{
    width: 155,
    borderRadius: 15,
  },
  cardInfo:{
    paddingHorizontal: 10,
    gap: 10,
  },
  cardInfoTitle:{
    fontSize: 16,
    fontWeight: "600",
  },
  cardInfoSubTitle:{
    fontSize: 14,
    fontWeight: "400",
  },
  cardInfoBuy:{
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  cardInfoText:{
    fontSize: 18,
    fontWeight: 900,
  }
});

  export default styles