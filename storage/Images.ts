import { File, Paths } from 'expo-file-system/next';
import { DeviceEventEmitter } from 'react-native';
import { storage } from './mmkv';

const MIRROR_URL = 'https://mirror.guweh.com/';
const CONCURRENCY = 8;
const MAX_RETRIES = 4;
const RETRY_BASE_DELAY_MS = 500;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const cacheImages = async (
	imagePaths: string[],
	onProgress?: (current: number, total: number) => void
) => {
	let current = 0;
	const total = imagePaths.length;

	const downloadOne = async (imagePath: string) => {
		// replace non-alphanumeric characters to create a safe cache key
		const cacheKey = imagePath.replace(/[^a-zA-Z0-9]/g, '_');
		if (!storage.contains(cacheKey)) {
			let lastError: unknown;
			for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
				try {
					const destination = new File(Paths.document, cacheKey);
					if (destination.exists) destination.delete();
					await File.downloadFileAsync(MIRROR_URL + encodeURIComponent(imagePath), destination);
					storage.set(cacheKey, true);
					lastError = undefined;
					break;
				} catch (e) {
					lastError = e;
					if (attempt < MAX_RETRIES) {
						const delay = RETRY_BASE_DELAY_MS * 2 ** attempt; // 500, 1000, 2000, 4000 ms
						console.warn(`[cacheImages] download failed for ${imagePath} (attempt ${attempt + 1}/${MAX_RETRIES}), retrying in ${delay}ms...`, e);
						await sleep(delay);
					}
				}
			}
			if (lastError !== undefined) {
				throw lastError;
			}
		}
		current++;
		onProgress?.(current, total);
		DeviceEventEmitter.emit('onImageCacheProgress', { current, total });
	};

	for (let i = 0; i < imagePaths.length; i += CONCURRENCY) {
		const batch = imagePaths.slice(i, i + CONCURRENCY);
		await Promise.all(batch.map(downloadOne));
	}
}

const clearImageCache = () => {
	const keys = storage.getAllKeys();
	for (const key of keys) {
		const file = new File(Paths.document, key);
		if (file.exists) file.delete();
	}
	storage.clearAll();
};

export { cacheImages, clearImageCache };