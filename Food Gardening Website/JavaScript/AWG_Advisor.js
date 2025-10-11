async function generateWeatherTip() {

	const weatherTip = document.getElementById('weatherTip');
	weatherTip.innerText = '🌤️ Detecting your location...';

	const openaiKey = 'AxTw5DnfPN7y0OfU1pWnkr368t2TuLqAjL0SiloGOObxpfhpWBy2JQQJ99BGACYeBjFXJ3w3AAABACOG9wTy'; // Replace with your Azure OpenAI key
	const endpoint = 'https://openaiweek.openai.azure.com/';
	const deployment = 'gpt-4.1';
	const apiVersion = '2023-03-15-preview';

	navigator.geolocation.getCurrentPosition(async (position) => {
		const lat = position.coords.latitude;
		const lon = position.coords.longitude;

		weatherTip.innerText = '🌦️ Fetching weather data...';

		try {
		  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_min,temperature_2m_max,precipitation_sum,windspeed_10m_max,relative_humidity_2m_mean&timezone=auto`;
		  const response = await fetch(weatherUrl);
		  const data = await response.json();

		  const d = data.daily;

		  if (
			!d?.time ||
			!d.temperature_2m_min ||
			!d.temperature_2m_max ||
			!d.precipitation_sum ||
			!d.relative_humidity_2m_mean ||
			!d.windspeed_10m_max
		  ) {
			console.log("❌ Missing fields in response:", d);
			weatherTip.innerText = '⚠️ Weather data format is incomplete.';
			return;
		  }

		  const summaryList = d.time.map((date, i) => {
			const minT = d.temperature_2m_min[i];
			const maxT = d.temperature_2m_max[i];
			const rain = d.precipitation_sum[i];
			const humidity = d.relative_humidity_2m_mean[i];
			const wind = d.windspeed_10m_max[i];

			return `• ${date}: Temp ${minT}–${maxT}°C, Rain: ${rain}mm, Humidity: ${humidity}%, Wind: ${wind} km/h`;
		  }).join('\n');

		  const prompt = `You are advising are a small scale farmer that is using an Atmospheric water generator to water their plants. Based on the following 7-day weather forecast:\n${summaryList}\n\nPlease provide practical irrigation and crop care tips focusing on sun, wind, rain forecast, temperature, and humidity. Keep it friendly and concise.`;

		  weatherTip.innerText = '🤖 Generating tip from AI...';

		  const aiResponse = await fetch(`${endpoint}openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`, {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			  'api-key': openaiKey
			},
			body: JSON.stringify({
			  messages: [{ role: 'user', content: prompt }],
			  max_tokens: 500,
			  temperature: 0.7
			})
		  });

		  const aiData = await aiResponse.json();
		  const reply = aiData.choices?.[0]?.message?.content.trim() || 'No suggestion available.';
		  weatherTip.innerText = `🌿 ${reply}`;
		} catch (error) {
		  console.error('❌ Error fetching data:', error);
		  weatherTip.innerText = '⚠️ Could not fetch weather or generate tip.';
		}

		const tips = [
			"💧 It's a good day for AWG efficiency — moderate humidity helps maximize water output. Use the collected watering.",
			"🌤️ Sunny day ahead. Run your AWG during cooler hours (early morning or evening) to save energy.",
			"🌧️ Rain is expected — you can reduce AWG use and store rainwater for irrigation instead.",
			"💨 Windy conditions detected — protect light crops and check AWG air filters for dust buildup.",
			"🌡️ Hot weather ahead — your AWG may use more power. Try placing it in a shaded, well-ventilated area.",
			"🌿 Ideal humidity today! Run the AWG efficiently and irrigate early to reduce evaporation.",
			"⚡ Power-saving tip: Use solar energy for AWG operation during high humidity periods for maximum yield."
		];

		const randomTip = tips[Math.floor(Math.random() * tips.length)];

		weatherTip.innerText = `${randomTip}`;
		}, () => {

		
	});
}