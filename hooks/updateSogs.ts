import { useState, useCallback } from 'react';
import { cacheImages } from '../storage/Images';
import { storage } from '../storage/mmkv';
import { updateRandomWidget } from '@/widgets/SoggyWidget';

const IMAGES_JSON_URL = 'https://mirror.guweh.com/images.json';

const useUpdateSogs = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
	const [error, setError] = useState<string | null>(null);

	const updateSogs = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		setProgress(null);

		try {
			const response = await fetch(IMAGES_JSON_URL);
			if (!response.ok) {
				throw new Error(`Failed to fetch images list: ${response.status}`);
			}

			const imagePaths: string[] = await response.json();

			await cacheImages(imagePaths, (current, total) => {
				setProgress({ current, total });
			});
			
			await updateRandomWidget();
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Unknown error');
		} finally {
			setIsLoading(false);
		}
	}, []);

	return { updateSogs, isLoading, error };
};

const checkForUpdate = async (): Promise<boolean> => {
	console.log('[checkForUpdate] starting...');
	try {
		const response = await fetch(IMAGES_JSON_URL);
		console.log('[checkForUpdate] fetch status:', response.status);
		if (!response.ok) {
			console.log('[checkForUpdate] fetch not ok, returning false');
			return false;
		}

		const imagePaths: string[] = await response.json();
		const cachedCount = imagePaths.filter(
			imagePath => storage.contains(imagePath.replace(/[^a-zA-Z0-9]/g, '_'))
		).length;
		console.log(`[checkForUpdate] cached: ${cachedCount} / ${imagePaths.length}`);

		const hasNew = imagePaths.some(
			imagePath => !storage.contains(imagePath.replace(/[^a-zA-Z0-9]/g, '_'))
		);
		console.log('[checkForUpdate] hasNew:', hasNew);
		return hasNew;
	} catch (e) {
		console.error('[checkForUpdate] error:', e);
		return false;
	}
};

export { useUpdateSogs, checkForUpdate };