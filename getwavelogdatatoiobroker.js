const request = require('request');

// Wavelog API-Einstellungen
const WAVELOG_URL = "https://urlzumlogbuch.de/index.php/api/get_contacts_adif";
const API_KEY = "demoapikey";
const STATION_PROFILE_ID = "1";

// Funktion zum Abrufen und Verarbeiten der Daten
function runScript() {
    const options = {
        url: WAVELOG_URL,
        method: "POST",
        json: true,
        body: {
            key: API_KEY,
            station_id: STATION_PROFILE_ID,
            fetchfromid: 0
        }
    };

    request(options, (error, response, body) => {
        if (error) {
            console.error("Fehler bei der API-Abfrage:", error);
            return;
        }

        if (!body || !body.adif) {
            console.error("Fehler: Keine ADIF-Daten empfangen.");
            return;
        }

        const adifData = body.adif;

        // Alle QSOs zählen
        const totalQso = (adifData.match(/<CALL:/g) || []).length;

        // SSB-QSOs zählen
        const ssbCount = (adifData.match(/<MODE:\d+>SSB/g) || []).length;

        // FM-QSOs zählen
        const fmCount = (adifData.match(/<MODE:\d+>FM/g) || []).length;

        // RTTY-QSOs zählen
        const rttyCount = (adifData.match(/<MODE:\d+>RTTY/g) || []).length;

        // FT4 & FT8 QSOs zählen
        const ft4ft8Count = ((adifData.match(/<MODE:\d+>FT8/g) || []).length) + 
                            ((adifData.match(/<MODE:\d+>FT4/g) || []).length);

        // PSK-QSOs zählen
        const pskCount = (adifData.match(/<MODE:\d+>PSK/g) || []).length;

         // CW-QSOs zählen
        const cwCount = (adifData.match(/<MODE:\d+>CW/g) || []).length;

        // Digimode-QSOs zählen (alle digitalen Modi)
        const digiModes = ["FT8", "FT4", "PSK", "RTTY", "JT65", "JT9", "OLIVIA", "CONTESTI", "ROS"];
        let digiCount = 0;

        digiModes.forEach(mode => {
            digiCount += (adifData.match(new RegExp(`<MODE:\\d+>${mode}`, "g")) || []).length;
        });

        console.log(`Total QSOs: ${totalQso}, SSB: ${ssbCount}, FM: ${fmCount}, RTTY: ${rttyCount}, FT8+FT4: ${ft4ft8Count}, PSK: ${pskCount}, Digi: ${digiCount}`);

        // Werte in ioBroker schreiben
        setState("javascript.0.Wavelog.totalqso", totalQso, true);
        setState("javascript.0.Wavelog.SSB_QSOs", ssbCount, true);
        setState("javascript.0.Wavelog.fmqso", fmCount, true);
        setState("javascript.0.Wavelog.rttyqso", rttyCount, true);
        setState("javascript.0.Wavelog.ft8ft4qso", ft4ft8Count, true);
        setState("javascript.0.Wavelog.pskqso", pskCount, true);
        setState("javascript.0.Wavelog.digiqso", digiCount, true);
        setState("javascript.0.Wavelog.cwqso", cwCount, true);
    });
}

// Skript direkt einmal starten
runScript();

// Intervall für automatische Wiederholung (alle 10 Minuten)
schedule("*/10 * * * *", function () {
    runScript();
});
