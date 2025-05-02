import { StatusBar, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: StatusBar.currentHeight || 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f3f3f3",
    position: "absolute",
    top: StatusBar.currentHeight || 40,
    left: 0,
    right: 0,
    zIndex: 10,
    elevation: 4,
    width: "100%",
  },
  initialsCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  initialsText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
  userInfo: {
    marginLeft: 15,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
    color: "#666",
  },
  tel: {
    fontSize: 14,
    color: "#666",
  },
  editButtonContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 20,
    marginVertical: 10,
    marginTop: 35,
  },
  flatListContainer: {
    paddingTop: 120,
    paddingBottom: 20,
  },
  listingCard: {
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
  },
  fakeImage: {
    height: 180,
    backgroundColor: "#ccc",
  },
  listingInfo: {
    padding: 10,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  listingLocation: {
    fontSize: 14,
    color: "#555",
  },
  listingType: {
    fontSize: 14,
    color: "#007AFF",
    marginTop: 4,
  },
  menuIconContainer: {
    padding: 10,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  menuIcon: {
    fontSize: 30,
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: "80%",
    maxWidth: 400,
    alignItems: "center",
    elevation: 10,
  },
  menuItem: {
    marginBottom: 20,
  },
  menuText: {
    fontSize: 18,
    color: "#007AFF",
    textAlign: "center",
    fontWeight: "600",
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    width: "100%",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "500",
    textAlign: "center",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default styles;