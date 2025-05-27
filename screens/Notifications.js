import React from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function Notifications({ route }) {
  const navigation = useNavigation();
  const { notifications, onMarkAsRead } = route.params;

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.notificationItem, !item.read && styles.unreadNotification]}
      onPress={() => !item.read && onMarkAsRead(item.id)}
    >
      <View style={styles.notificationIconContainer}>
        <Icon 
          name={item.read ? "notifications-outline" : "notifications"} 
          size={24} 
          color={item.read ? "#555" : "#1A7526"} 
        />
        {!item.read && <View style={styles.unreadDot} />}
      </View>
      <View style={styles.notificationContent}>
        <Text style={[
          styles.notificationText,
          !item.read && styles.unreadNotificationText
        ]}>
          {item.message}
        </Text>
        <Text style={styles.notificationDate}>{item.created_at}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyNotifications = () => (
    <View style={styles.emptyContainer}>
      <Icon name="notifications-outline" size={50} color="#ccc" />
      <Text style={styles.emptyText}>Nenhuma notificação</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificações</Text>
        <View style={styles.headerRight} />
      </View>

      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={renderEmptyNotifications}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 40,
  },
  listContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  unreadNotification: {
    backgroundColor: '#f8f9fa',
  },
  notificationIconContainer: {
    marginRight: 16,
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1A7526',
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  unreadNotificationText: {
    fontWeight: 'bold',
    color: '#000',
  },
  notificationDate: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
}); 