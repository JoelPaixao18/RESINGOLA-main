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
        fontSize: 32,
        fontWeight: "400",
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
    separator:{
        height: 1,
        marginHorizontal: 30,
        marginTop: 15,
        backgroundColor: "#dddddd",
    },
});

export default styles