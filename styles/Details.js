import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    header: {
        width: "100%",
        height: "40%",
    },
    headerImage: {
        width: 330,
        height: 220,
        position: "absolute",
        marginHorizontal: 40,
        top: 110,
        borderRadius: 12,
    },
    headerInfoButtons: {
        marginTop: 50,
        paddingHorizontal: 30,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerInfoButtonsText:{
        fontSize: 16,
    },
    headerInfoButtonsRight: {
        flexDirection: "row",
        gap: 10,
    },
    infoNameText: {
        fontSize: 28,
        fontWeight: "600",
        paddingHorizontal: 40,
        paddingTop: 20,
    },
    contentAddress:{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 30,
        paddingTop: 15,
    },
    contentAddressText:{
        fontSize: 12,
    },
    contentAddressPrice:{
        fontSize: 18,
        fontWeight: 400,
        marginHorizontal: "30%",
    },
    separator:{
        height: 1,
        marginHorizontal: 30,
        marginTop: 15,
        backgroundColor: "#dddddd",
    },
    descriptionView:{
        paddingTop: 20,
        paddingHorizontal: 40,
        paddingBottom: 20,
    },
    description:{
        paddingBottom: 5,
        fontSize: 20,
        fontWeight: 600,
    },
    descriptionText:{
        fontWeight: 400,
    },
    sellerInfo:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 40,
    },
    sellerInfoTextName:{
        fontSize: 16,
        fontWeight: 600,
    },
    sellerInfoTextSeller:{
        fontSize: 12,
    },
    sellerInfoRight:{
        width: 60,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#1A7526',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        margin: 25,
      },
      buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      },
});

export default styles