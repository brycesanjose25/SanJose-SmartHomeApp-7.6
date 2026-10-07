import { Ionicons } from '@expo/vector-icons';

export type Device = {
	id: number;
	name: string;
	type: string;
	icon: keyof typeof Ionicons.glyphMap;
	status: boolean;
};

export type SensorData = {
	id: number;
	temperature: number;
	humidity: number;
	lightLevel: number;
	deviceId: number | null;
	recordAt: string;
};
