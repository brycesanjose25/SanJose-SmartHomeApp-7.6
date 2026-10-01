import type { Device, SensorData } from '../models/IoTModels';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

const requestDelay = 1500;
const failureRate = 0.1;

let devices: Device[] = [
	{
		id: 1,
		name: 'Living Room Light',
		type: 'Smart Light',
		icon: 'bulb-outline',
		status: true,
	},
	{
		id: 2,
		name: 'Bedroom Fan',
		type: 'Smart Fan',
		icon: 'sync-outline',
		status: false,
	},
	{
		id: 3,
		name: 'Front Door Lock',
		type: 'Smart Lock',
		icon: 'lock-closed-outline',
		status: true,
	},
];

const sensors: SensorData = {
	temperature: 100,
	humidity: 99,
	lightLevel: 1000,
};

function delay(milliseconds: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function simulateFailure(): void {
	if (Math.random() < failureRate) {
		throw new Error('The simulated IoT API is unavailable.');
	}
}

async function requestJson<T>(
	path: string,
	options?: RequestInit
): Promise<T> {
	if (!API_BASE_URL) {
		throw new Error('API base URL is not configured.');
	}

	const response = await fetch(`${API_BASE_URL}${path}`, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...(options?.headers ?? {}),
		},
	});

	if (!response.ok) {
		throw new Error(`Request failed with status ${response.status}`);
	}

	return (await response.json()) as T;
}

async function getMockSensorData(): Promise<SensorData> {
	await delay(requestDelay);
	simulateFailure();

	return { ...sensors };
}

async function getMockDevices(): Promise<Device[]> {
	await delay(requestDelay);
	simulateFailure();

	return devices.map((device) => ({ ...device }));
}

async function updateMockDeviceStatus(
	id: number,
	status: boolean
): Promise<Device> {
	await delay(requestDelay);
	simulateFailure();

	const device = devices.find((item) => item.id === id);

	if (!device) {
		throw new Error(`Device ${id} was not found.`);
	}

	device.status = status;

	return { ...device };
}

export async function getSensorData(): Promise<SensorData> {
	if (API_BASE_URL) {
		try {
			return await requestJson<SensorData>(API_ENDPOINTS.sensors);
		} catch (error) {
			console.warn('Falling back to mock sensor data.', error);
		}
	}

	return getMockSensorData();
}

export async function getDevices(): Promise<Device[]> {
	if (API_BASE_URL) {
		try {
			return await requestJson<Device[]>(API_ENDPOINTS.devices);
		} catch (error) {
			console.warn('Falling back to mock device data.', error);
		}
	}

	return getMockDevices();
}

export async function updateDeviceStatus(
	id: number,
	status: boolean
): Promise<Device> {
	if (API_BASE_URL) {
		try {
			return await requestJson<Device>(API_ENDPOINTS.deviceStatus(id), {
				method: 'PATCH',
				body: JSON.stringify({ status }),
			});
		} catch (error) {
			console.warn(`Falling back to mock update for device ${id}.`, error);
		}
	}

	return updateMockDeviceStatus(id, status);
}
