import type { Device, SensorData } from '../models/IoTModels';

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

export async function getSensorData(): Promise<SensorData> {
	await delay(requestDelay);
	simulateFailure();

	return { ...sensors };
}

export async function getDevices(): Promise<Device[]> {
	await delay(requestDelay);
	simulateFailure();

	return devices.map((device) => ({ ...device }));
}

export async function updateDeviceStatus(
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
