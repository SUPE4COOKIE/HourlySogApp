import { Image } from 'react-native';

export default function getBestfit(imgWidth: number, imgHeight: number, widgetWidth: number, widgetHeight: number) : { width: number, height: number }
{
	const imgAspectRatio = imgWidth / imgHeight;
	const widgetAspectRatio = widgetWidth / widgetHeight;

	let newWidth, newHeight;

	if (imgAspectRatio > widgetAspectRatio) {
		newWidth = widgetWidth;
		newHeight = widgetWidth / imgAspectRatio;
	} else {
		newHeight = widgetHeight;
		newWidth = widgetHeight * imgAspectRatio;
	}

	return { width: Math.round(newWidth), height: Math.round(newHeight) };

}

export function getImageDimensions(uri: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => resolve({ width, height }),
      (error) => reject(error)
    );
  });
}