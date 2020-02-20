export default function calculateConstrainedDimensions(sourceWidthHeight, maxWidthHeight) {
	var ratio = Math.min(maxWidthHeight.width / sourceWidthHeight.width, maxWidthHeight.height / sourceWidthHeight.height);

    return { width: sourceWidthHeight.width*ratio, height: sourceWidthHeight.height*ratio };
}