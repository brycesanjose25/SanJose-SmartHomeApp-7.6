import React from 'react';
import { View, Text, StyleSheet, Switch, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIoT } from '../../context/IoTContext';



export default function DashboardScreen() {
    // const [deviceStatus, setDeviceStatus] = useState(
    //     devices.reduce((acc, device) => {
    //         acc[device.id] = device.status;
    //         return acc;
    //     }, {} as Record<number, boolean>)
    // );

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

            <Text style={styles.greeting}>
                Good evening
            </Text>

            <Text style={styles.title}>
                IoT Dashboard
            </Text>

            {gatewayError && (
                <Text style={styles.errorText}>{gatewayError}</Text>
            )}

            {sensorError && (
                <View style={styles.feedback}>
                    <Text style={styles.errorText}>{sensorError}</Text>
                    <Button title="Retry" onPress={() => void retrySensors()} />
                </View>
            )}
            <View style={styles.sensorRow}>

                <View style={styles.sensorCard}>
                    <View style={styles.sensorHeader}>
                        <Ionicons
                            name="water-outline"
                            size={22}
                        />

                        <Text style={styles.sensorLabel}>
                            Temperature
                        </Text>
                    </View>

                    {sensorsLoading ? (
                        <Text style={styles.loadingText}>Refreshing Sensors...</Text>
                    ) : (
                        <Text style={styles.sensorValue}>
                            {sensors.temperature}°C
                        </Text>
                    )}
                </View>

                <View style={styles.sensorCard}>
                    <View style={styles.sensorHeader}>
                        <Ionicons
                            name="water-outline"
                            size={22}
                        />

                        <Text style={styles.sensorLabel}>
                            Humidity
                        </Text>
                    </View>

                    {sensorsLoading ? (
                        <Text style={styles.loadingText}>Refreshing Sensors...</Text>
                    ) : (
                        <Text style={styles.sensorValue}>
                            {sensors.humidity}%
                        </Text>
                    )}
                </View>

            </View>

            <Text style={styles.sectionTitle}>
                Device Status
            </Text>

            {deviceError && (
                <Text style={styles.errorText}>{deviceError}</Text>
            )}
            {/* <View style={styles.deviceCard}>

                <View style={styles.deviceInfo}>
                    <Text style={styles.deviceIcon}>
                        💡
                    </Text>

                    <View>
                        <Text style={styles.deviceName}>
                            Living Room Light
                        </Text>

                        <Text style={styles.deviceType}>
                            Smart Light
                        </Text>
                    </View>
                </View>

                <Text style={styles.deviceStatus}>
                    ON
                </Text>

            </View>

        </View>
    ); */}

            {devices.map((device) => (

                <View
                    key={device.id}
                    style={styles.deviceCard}
                >

                    <View style={styles.deviceInfo}>

                        <Ionicons
                            name={device.icon}
                            size={28}
                            style={styles.deviceIcon}
                        />

                        <View>
                            <Text style={styles.deviceName}>
                                {device.name}
                            </Text>

                            <Text style={styles.deviceType}>
                                <Text style={styles.deviceState}>
                                    {device.status ? 'ON' : 'OFF'}
                                </Text>
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
        backgroundColor: '#eeeeee',
    },

    sensorLabel: {
        fontSize: 14,
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
        backgroundColor: '#eeeeee',
    },

    deviceInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    deviceIcon: {
        fontSize: 28,
        marginRight: 12,
    },

    deviceName: {
        fontSize: 16,
        fontWeight: 'bold',
    },

    deviceType: {
        fontSize: 13,
        marginTop: 3,
    },

    deviceStatus: {
        fontSize: 14,
        fontWeight: 'bold',
    },

    sensorHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },

    deviceState:{

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
    }


});