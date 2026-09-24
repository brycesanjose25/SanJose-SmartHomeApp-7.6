import { Ionicons } from "@expo/vector-icons";

type Device = {
    id: number;
    name: string;
    type: string;
    icon: keyof typeof Ionicons.glyphMap;
    status: boolean;
};

type SensorData = {
    temperature: number;
    humidity: number;
    lightLevel: number;
};

const devices: Device[] = [
    //living room light
    {
        id: 1,
        name: "Living Room Light",
        type: "light",
        icon: "bulb-outline",
        status: false,
    },
    //bedroom light
    {
        id: 2,
        name: "Bedroom Light",
        type: "light",
        icon: "sync-outline",
        status: false,
    },
    //kitchen light
    {
        id: 3,
        name: "Kitchen Light",
        type: "light",
        icon: "lock-closed-outline",
        status: false,
    },
