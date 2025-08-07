const request = require('request');

// Wavelog API-settings
const WAVELOG_URL = "https://urlzumlogbuch.de/index.php/api/get_contacts_adif";
const API_KEY = "demoapikey";
const STATION_PROFILE_ID = "1";

// Function for retrieving and processing data
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
            console.error("Error in API query:", error);
            return;
        }

        if (!body || !body.adif) {
            console.error("Error: No ADIF data received.");
            return;
        }

        const adifData = body.adif;

        // Count all QSOs 
        const totalQso = (adifData.match(/<CALL:/g) || []).length;

        // Count SSB-QSOs 
        const ssbCount = (adifData.match(/<MODE:\d+>SSB/g) || []).length;

        // Count FM-QSOs 
        const fmCount = (adifData.match(/<MODE:\d+>FM/g) || []).length;

        // Count RTTY-QSOs zählen
        const rttyCount = (adifData.match(/<MODE:\d+>RTTY/g) || []).length;

        // Count FT4 & FT8 QSOs summed up
        const ft4ft8Count = ((adifData.match(/<MODE:\d+>FT8/g) || []).length) + 
                            ((adifData.match(/<MODE:\d+>FT4/g) || []).length);

        // Count PSK-QSOs 
        const pskCount = (adifData.match(/<MODE:\d+>PSK/g) || []).length;

         // Count CW-QSOs 
        const cwCount = (adifData.match(/<MODE:\d+>CW/g) || []).length;

        // Count JS8-QSOs 
        const cwCount = (adifData.match(/<MODE:\d+>JS8/g) || []).length;


        // Count Digimode-QSOs  (all digital Modes)
        const digiModes = ["FT8", "FT4", "PSK", "RTTY", "JT65", "JS8","JT9", "OLIVIA", "CONTESTI", "ROS"];
        let digiCount = 0;

        digiModes.forEach(mode => {
            digiCount += (adifData.match(new RegExp(`<MODE:\\d+>${mode}`, "g")) || []).length;
        });

        console.log(`Total QSOs: ${totalQso}, SSB: ${ssbCount}, FM: ${fmCount}, RTTY: ${rttyCount}, FT8+FT4: ${ft4ft8Count}, PSK: ${pskCount}, CW: ${cwCount}, JS8: ${js8Count}, Digi: ${digiCount}`);

        // Write values in io.Broker datapoints
        setState("javascript.0.Wavelog.totalqso", totalQso, true);
        setState("javascript.0.Wavelog.SSB_QSOs", ssbCount, true);
        setState("javascript.0.Wavelog.fmqso", fmCount, true);
        setState("javascript.0.Wavelog.rttyqso", rttyCount, true);
        setState("javascript.0.Wavelog.ft8ft4qso", ft4ft8Count, true);
        setState("javascript.0.Wavelog.pskqso", pskCount, true);
        setState("javascript.0.Wavelog.digiqso", digiCount, true);
        setState("javascript.0.Wavelog.cwqso", cwCount, true);
        setState("javascript.0.Wavelog.js8qso", cwCount, true);

    });
}

// Start Skript automatically
runScript();

// Automatic repeat interval (every 10 minutes)
schedule("*/10 * * * *", function () {
    runScript();
});
