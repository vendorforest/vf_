export const calculateDistance = (lat1, lng1, lat2, lng2) => {

	if (lat1 === lat2 && lng1 === lng2) return 0;

	var radlat1 = (Math.PI * lat1) / 180;

	var radlat2 = (Math.PI * lat2) / 180;

	var theta = lng1 - lng2;

	var radtheta = (Math.PI * theta) / 180;

	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

	if (dist > 1) dist = 1;

	dist = Math.acos(dist);

	dist = (dist * 180) / Math.PI;

	dist = dist * 60 * 1.1515;

	return dist * 1.609344;
};


export const getInfoFromVideoUrl = (url) => {

	const result = { type: 'vimeo' }
	
	if (url.includes('youtube.com')) result.type = 'youtube';

	if (result.type === 'youtube') {

		const regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;

		const match = url.match(regExp);

		result.videoId = (match && match[1].length === 11) ? match[1] : null;

	} else {

		const regExp = /vimeo.*\/(\d+)/i;

		const match = regExp.exec(url);
  
		result.videoId = match ? match[1] : null
	}

	return result
};
