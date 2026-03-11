import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, DeviceEventEmitter } from 'react-native';
import { cacheImages } from "@/storage/images";

const DownloadBar = () => {
	const [progress, setProgress] = useState(0);
	const [isVisible, setIsVisible] = useState(false);
	const [status, setStatus] = useState({ current: 0, total: 0 });

	useEffect(() => {
		// Listen for the global event from images.ts
		const subscription = DeviceEventEmitter.addListener(
			'onImageCacheProgress',
			({ current, total }: { current: number; total: number }) => {
				if (total === 0) return;

				setIsVisible(true);
				setStatus({ current, total });
				setProgress(current / total);

				// Hide the bar nicely after it finishes
				if (current === total) {
					setTimeout(() => {
						setIsVisible(false);
						setProgress(0);
						setStatus({ current: 0, total: 0 });
					}, 1500);
				}
			}
		);

		return () => subscription.remove();
	}, []);

	if (!isVisible) return null;

	return (
		<View style={styles.container}>
			<Text style={styles.text}>
				Downloading images... {status.current} / {status.total}
			</Text>
			<View style={styles.progressBarBackground}>
				<View 
					style={[styles.progressBarFill, { width: `${progress * 100}%` }]} 
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 16,
		backgroundColor: '#333',
		borderRadius: 8,
		margin: 16,
	},
	text: {
		color: '#fff',
		marginBottom: 8,
		fontSize: 14,
		fontWeight: 'bold',
	},
	progressBarBackground: {
		height: 8,
		backgroundColor: '#555',
		borderRadius: 4,
		overflow: 'hidden',
		width: '100%',
	},
	progressBarFill: {
		height: '100%',
		backgroundColor: '#4caf50', // green color
		borderRadius: 4,
	},
});

export default DownloadBar;