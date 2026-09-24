import React, {
    createContext,
    useEffect,
    useContext,
    useState,
} from 'react';
import type { Device, SensorData } from '../models/IoTModels';
import {
    getDevices,
    getSensorData,
    updateDeviceStatus,
} from '../services/IoTService';

type IoTContextType = {
    devices: Device[];
    sensors: SensorData;
    sensorsLoading: boolean;
    devicesLoading: boolean;
    sensorError: string | null;
    deviceError: string | null;
    gatewayError: string | null;
    updatingDeviceId: number | null;
    retrySensors: () => Promise<void>;
    retryDevices: () => Promise<void>;
    toggleDevice: (id: number, value: boolean) => Promise<void>;
};

const IoTContext = createContext<IoTContextType | undefined>(
    undefined
);

export function IoTProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [devices, setDevices] = useState<Device[]>([]);
    const [sensors, setSensors] = useState<SensorData>({
        temperature: 0,
        humidity: 0,
        lightLevel: 0,
    });
    const [sensorsLoading, setSensorsLoading] = useState(true);
    const [devicesLoading, setDevicesLoading] = useState(true);
    const [sensorError, setSensorError] = useState<string | null>(null);
    const [deviceError, setDeviceError] = useState<string | null>(null);
    const [gatewayError, setGatewayError] = useState<string | null>(null);
    const [updatingDeviceId, setUpdatingDeviceId] = useState<number | null>(null);

    const retrySensors = async (): Promise<void> => {
        setSensorsLoading(true);
        setSensorError(null);
        setGatewayError(null);

        try {
            setSensors(await getSensorData());
        } catch (error) {
            console.error('Unable to retrieve sensor data.', error);
            setSensorError('Unable to retrieve sensor data.');
            setGatewayError('IoT Gateway is disconnected.');
        } finally {
            setSensorsLoading(false);
        }
    };

    const retryDevices = async (): Promise<void> => {
        setDevicesLoading(true);
        setDeviceError(null);
        setGatewayError(null);

        try {
            setDevices(await getDevices());
        } catch (error) {
            console.error('Unable to retrieve devices.', error);
            setDeviceError('Unable to retrieve devices.');
            setGatewayError('IoT Gateway is disconnected.');
        } finally {
            setDevicesLoading(false);
        }
    };

    useEffect(() => {
        void retrySensors();
        void retryDevices();
    }, []);

    const toggleDevice = async (
        id: number,
        value: boolean
    ): Promise<void> => {
        const device = devices.find((item) => item.id === id);

        setUpdatingDeviceId(id);
        setDeviceError(null);
        setGatewayError(null);

        try {
            const updatedDevice = await updateDeviceStatus(id, value);

            setDevices((currentDevices) => currentDevices.map((device) => (
                device.id === updatedDevice.id ? updatedDevice : device
            )));
        } catch (error) {
            console.error('Unable to update device status.', error);
            setDeviceError(
                `Unable to update ${device?.name ?? 'device'}.`
            );
            setGatewayError('IoT Gateway is disconnected.');
        } finally {
            setUpdatingDeviceId(null);
        }
    };

    return (
        <IoTContext.Provider
            value={{
                devices,
                sensors,
                sensorsLoading,
                devicesLoading,
                sensorError,
                deviceError,
                gatewayError,
                updatingDeviceId,
                retrySensors,
                retryDevices,
                toggleDevice,
            }}
        >
            {children}
        </IoTContext.Provider>
    );
}

export function useIoT() {

    const context = useContext(IoTContext);

    if (!context) {
        throw new Error(
            'useIoT must be used inside IoTProvider'
        );
    }

    return context;
}