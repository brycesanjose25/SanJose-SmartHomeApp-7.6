import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';
import type { Device, SensorData } from '../models/IoTModels';
type DeviceRow = {
	id: number;
	name: string;
	type: string;
	icon: Device['icon'];
	status: number;
};

let databasePromise: Promise<SQLiteDatabase> | null = null;

async function initializeDatabase(): Promise<SQLiteDatabase> {
	const database = await openDatabaseAsync('smart-home.db');

	await database.execAsync(`
		PRAGMA foreign_keys = ON;
		CREATE TABLE IF NOT EXISTS Device_table (
			ID INTEGER PRIMARY KEY NOT NULL,
			name TEXT NOT NULL,
			type TEXT NOT NULL,
			icon TEXT NOT NULL,
			status INTEGER NOT NULL CHECK (status IN (0, 1))
		);
		CREATE TABLE IF NOT EXISTS sensor_table (
			ID INTEGER PRIMARY KEY AUTOINCREMENT,
			Temperature REAL NOT NULL,
			light_level REAL NOT NULL,
			humidity REAL NOT NULL,
			device_id INTEGER,
			record_at TEXT NOT NULL,
			FOREIGN KEY (device_id) REFERENCES Device_table(ID)
		);
	`);

	const deviceCount = await database.getFirstAsync<{ count: number }>(
		'SELECT COUNT(*) AS count FROM Device_table'
	);

	if (!deviceCount) {
		throw new Error('Unable to read the device count from the local database.');
	}

	if (deviceCount.count === 0) {
		await database.withTransactionAsync(async () => {
			await database.runAsync(
				'INSERT INTO Device_table (ID, name, type, icon, status) VALUES (?, ?, ?, ?, ?)',
				1,
				'Living Room Light',
				'Smart Light',
				'bulb-outline',
				1
			);
			await database.runAsync(
				'INSERT INTO Device_table (ID, name, type, icon, status) VALUES (?, ?, ?, ?, ?)',
				2,
				'Bedroom Fan',
				'Smart Fan',
				'sync-outline',
				0
			);
			await database.runAsync(
				'INSERT INTO Device_table (ID, name, type, icon, status) VALUES (?, ?, ?, ?, ?)',
				3,
				'Front Door Lock',
				'Smart Lock',
				'lock-closed-outline',
				1
			);
		});
	}

	const sensorCount = await database.getFirstAsync<{ count: number }>(
		'SELECT COUNT(*) AS count FROM sensor_table'
	);

	if (!sensorCount) {
		throw new Error('Unable to read the sensor count from the local database.');
	}

	if (sensorCount.count === 0) {
		await database.runAsync(
			`INSERT INTO sensor_table
				(Temperature, light_level, humidity, device_id, record_at)
				VALUES (?, ?, ?, ?, ?)`,
			100,
			1000,
			99,
			null,
			new Date().toISOString()
		);
	}

	return database;
}

function getDatabase(): Promise<SQLiteDatabase> {
	if (!databasePromise) {
		databasePromise = initializeDatabase().catch((error: unknown) => {
			databasePromise = null;
			throw error;
		});
	}

	return databasePromise;
}

export async function getSensorData(): Promise<SensorData> {
	const database = await getDatabase();
	const sensor = await database.getFirstAsync<SensorData>(
		`SELECT
			ID AS id,
			Temperature AS temperature,
			humidity,
			light_level AS lightLevel,
			device_id AS deviceId,
			record_at AS recordAt
		FROM sensor_table
		ORDER BY record_at DESC, ID DESC
		LIMIT 1`
	);

	if (!sensor) {
		throw new Error('No sensor readings are available in the local database.');
	}

	return sensor;
}

export async function getDevices(): Promise<Device[]> {
	const database = await getDatabase();
	const rows = await database.getAllAsync<DeviceRow>(
		`SELECT ID AS id, name, type, icon, status
		FROM Device_table
		ORDER BY ID`
	);

	return rows.map((row) => ({
		id: row.id,
		name: row.name,
		type: row.type,
		icon: row.icon,
		status: row.status === 1,
	}));
}

export async function updateDeviceStatus(
	id: number,
	status: boolean
): Promise<Device> {
	const database = await getDatabase();
	const result = await database.runAsync(
		'UPDATE Device_table SET status = ? WHERE ID = ?',
		status ? 1 : 0,
		id
	);

	if (result.changes === 0) {
		throw new Error(`Device ${id} was not found.`);
	}

	const row = await database.getFirstAsync<DeviceRow>(
		`SELECT ID AS id, name, type, icon, status
		FROM Device_table
		WHERE ID = ?`,
		id
	);

	if (!row) {
		throw new Error(`Device ${id} could not be read after its status was updated.`);
	}

	return {
		id: row.id,
		name: row.name,
		type: row.type,
		icon: row.icon,
		status: row.status === 1,
	};
}
