import { StyleSheet, Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  inputContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? height * 0.06 : height * 0.04,
    left: width * 0.05,
    width: width * 0.9,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 10,
    color: "#333",
  },
  addressContainer: {
    position: "absolute",
    bottom: 20,
    left: width * 0.05,
    width: width * 0.9,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    alignItems: "center",
  },
  addressText: {
    fontSize: 15,
    color: "#333",
    textAlign: "center",
    fontWeight: "600",
  },
  waitMapText: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    color: "#555",
    paddingTop: height * 0.3,
  },
});

export default styles;
