// FirebaseからAPIキーを取得
async function getApiKey() {
    try {
        const snapshot = await firebase.database().ref('/apiKeys/openWeatherMap').once('value');
        const apiKey = snapshot.val();
        if (!apiKey) {
            throw new Error("APIキーが見つかりません。");
        }
        return apiKey;
    } catch (error) {
        console.error("FirebaseからAPIキーを取得中にエラーが発生しました:", error);
        return null;
    }
}

// OpenWeatherMap APIを使用して天気情報を取得
async function getWeather(city, elementId, apiKey) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=ja`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`天気情報の取得に失敗しました: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data); // デバッグ用
        displayWeather(data, elementId);
    } catch (error) {
        console.error('エラー:', error);
        document.getElementById(elementId).textContent = error.message;
    }
}

// 天気情報を表示
function displayWeather(data, elementId) {
    if (!data || !data.main || !data.weather) {
        document.getElementById(elementId).textContent = '天気情報の取得に失敗しました。データが不完全です。';
        return;
    }
    const weatherInfoDiv = document.getElementById(elementId);
    weatherInfoDiv.innerHTML = `
        <h2>${data.name}の天気</h2>
        <p>温度: ${data.main.temp} °C</p>
        <p>天気: ${data.weather[0].description}</p>
        <p>湿度: ${data.main.humidity}%</p>
        <p>風速: ${data.wind.speed} m/s</p>
    `;
}

// 天気情報を初期化
async function initializeWeatherData() {
    const apiKey = await getApiKey();
    if (apiKey) {
        getWeather('Fukuoka', 'weather-info-fukuoka', apiKey);
        getWeather('Tokyo', 'weather-info-tokyo', apiKey);
        getWeather('Hokkaido', 'weather-info-hokkaido', apiKey);
    } else {
        console.error("天気情報の取得をスキップしました（APIキーがありません）。");
    }
}

// ページの読み込み後に実行
window.addEventListener('DOMContentLoaded', initializeWeatherData);
