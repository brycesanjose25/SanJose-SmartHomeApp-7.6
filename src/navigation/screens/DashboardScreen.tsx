import React from 'react';
import { View, Text, StyleSheet, Switch, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIoT } from '../../context/IoTContext';

export default function DashboardScreen() {
  const {
    devices,
    sensors,
    sensorsLoading,
    sensorError,
    deviceError,
    gatewayError,
    updatingDeviceId,
    retrySensors,
    toggleDevice,
  } = useIoT();

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Good evening</Text>
      <Text style={styles.title}>IoT Dashboard</Text>

      {gatewayError && <Text style={styles.errorText}>{gatewayError}</Text>}

      {sensorError && (
        <View style={styles.feedback}>
          <Text style={styles.errorText}>{sensorError}</Text>
          <Button title="Retry" onPress={() => void retrySensors()} />
        </View>
      )}

      <View style={styles.sensorRow}>
        <View style={styles.sensorCard}>
          <View style={styles.sensorHeader}>
            <Ionicons name="thermometer-outline" size={22} />
            <Text style={styles.sensorLabel}>Temperature</Text>
          </View>

          {sensorsLoading ? (
            <Text style={styles.loadingText}>Refreshing Sensors...</Text>
          ) : (
            <Text style={styles.sensorValue}>{sensors.temperature}°C</Text>
          )}
        </View>

        <View style={styles.sensorCard}>
          <View style={styles.sensorHeader}>
            <Ionicons name="water-outline" size={22} />
            <Text style={styles.sensorLabel}>Humidity</Text>
          </View>

          {sensorsLoading ? (
            <Text style={styles.loadingText}>Refreshing Sensors...</Text>
          ) : (
            <Text style={styles.sensorValue}>{sensors.humidity}%</Text>
          )}
        </View>
      </View>

      <View style={styles.sensorCardWide}>
        <View style={styles.sensorHeader}>
          <Ionicons name="sunny-outline" size={22} />
          <Text style={styles.sensorLabel}>Light Level</Text>
        </View>

        {sensorsLoading ? (
          <Text style={styles.loadingText}>Refreshing Sensors...</Text>
        ) : (
          <Text style={styles.sensorValue}>{sensors.lightLevel} lux</Text>
        )}
      </View>

      <Text style={styles.sectionTitle}>Device Status</Text>

      {deviceError && <Text style={styles.errorText}>{deviceError}</Text>}

      {devices.map((device) => (
        <View key={device.id} style={styles.deviceCard}>
          <View style={styles.deviceInfo}>
            <Ionicons name={device.icon} size={28} style={styles.deviceIcon} />

            <View style={styles.deviceTextWrap}>
              <Text style={styles.deviceName}>{device.name}</Text>
              <Text style={styles.deviceType}>{device.type}</Text>
              <Text style={[styles.deviceState, device.status ? styles.onState : styles.offState]}>
                {device.status ? 'ON' : 'OFF'}
              </Text>
            </View>
          </View>

          <Switch
            value={device.status}
            disabled={updatingDeviceId === device.id}
            onValueChange={(value) => {
              void toggleDevice(device.id, value);
            }}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  greeting: {
    fontSize: 14,
    color: '#4b5563',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 5,
  },
  sensorRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 25,
  },
  sensorCard: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  sensorCardWide: {
    marginTop: 12,
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  sensorLabel: {
    fontSize: 14,
    marginLeft: 8,
  },
  sensorValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 12,
  },
  deviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    marginBottom: 12,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deviceIcon: {
    marginRight: 12,
    color: '#111827',
  },
  deviceTextWrap: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deviceType: {
    fontSize: 13,
    marginTop: 3,
    color: '#4b5563',
  },
  deviceState: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: '600',
  },
  onState: {
    color: '#15803d',
  },
  offState: {
    color: '#b91c1c',
  },
  sensorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    marginTop: 10,
  },
  errorText: {
    color: '#b00020',
    marginTop: 8,
  },
  feedback: {
    marginTop: 8,
  },
});