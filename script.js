const apiKey = "de8102ee2bf3c44ae8dd881dd6c26f00";
const logBox = document.getElementById("log");

function log(msg) {
    logBox.innerHTML += `<span class="async">${msg}</span>\n`;
}

async function getWeather() {
    const city = document.getElementById("cityInput").value.trim();
    if (!city) return;

    logBox.innerHTML = "";
    log("[ASYNC] Start fetching");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=195f92a4c09e7551dc56d61b65e51210&units=metric`
        );
        const data = await response.json();

        // ❌ Invalid city
        if (data.cod === "404") {
            showError();
            log("[ASYNC] Data received");
            return;
        }

        // ✅ Valid city
        showWeather();

        document.getElementById("city").textContent =
            data.name + ", " + data.sys.country;
        document.getElementById("temp").textContent =
            data.main.temp + " °C";
        document.getElementById("weather").textContent =
            data.weather[0].main;
        document.getElementById("humidity").textContent =
            data.main.humidity + "%";
        document.getElementById("wind").textContent =
            data.wind.speed + " m/s";

        addHistory(city);
        log("[ASYNC] Data received");

    } catch {
        showError();
        log("[ASYNC] Error");
    }
}

/* ❌ Show only "City not found" */
function showError() {
    document.getElementById("weatherContent").style.display = "none";
    document.getElementById("errorMsg").style.display = "block";
}

/* ✅ Show full weather */
function showWeather() {
    document.getElementById("errorMsg").style.display = "none";
    document.getElementById("weatherContent").style.display = "block";
}

/* History (no duplicates) */
function addHistory(city) {
    const historyDiv = document.getElementById("history");
    const existing = Array.from(historyDiv.children)
        .map(btn => btn.textContent.toLowerCase());

    if (existing.includes(city.toLowerCase())) return;

    const btn = document.createElement("button");
    btn.textContent = city;
    btn.className = "history-btn";
    btn.onclick = () => {
        document.getElementById("cityInput").value = city;
        getWeather();
    };

    historyDiv.appendChild(btn);
}
