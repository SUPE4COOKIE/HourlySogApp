import { File, Paths } from 'expo-file-system';
import { DeviceEventEmitter } from 'react-native';
import { storage } from './mmkv';

const MIRROR_URL = 'https://mirror.guweh.com/';

const cacheImages = async (
	imagePaths: string[],
	onProgress?: (current: number, total: number) => void
) => {
	let current = 0;
	const total = imagePaths.length;

	for (const imagePath of imagePaths) {
		// replace any non A-Z, a-z, 0-9 characters with underscores
		const cacheKey = imagePath.replace(/[^a-zA-Z0-9]/g, '_');
		const cachedUri = storage.getString(cacheKey);
		if (!cachedUri) {
			const destination = new File(Paths.document, cacheKey);
			await File.downloadFileAsync(MIRROR_URL + imagePath, destination);
			storage.set(cacheKey, true);
		}
		
		current++;
		if (onProgress) {
			onProgress(current, total);
		}
		DeviceEventEmitter.emit('onImageCacheProgress', { current, total });
	}
}

export { cacheImages };