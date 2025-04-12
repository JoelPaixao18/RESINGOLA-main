import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  inputContainer: {
    width: "90%",
    height: height * 0.07, // Responsivo
    backgroundColor: "white",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    position: 'absolute',
    top: height * 0.05, // Responsivo
  },
  input: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  addressContainer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 5,
    alignItems: 'center',
  },
  addressText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  waitMapText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: height * 0.05, // Responsivo
  },
});

export default styles;