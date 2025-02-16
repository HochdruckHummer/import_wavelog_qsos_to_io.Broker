const request = require('request');

// Wavelog API settings using the new Wordpress endpoint
const WAVELOG_URL = "https://urltologbook.com/index.php/api/get_wp_stats";
const API_KEY = "demoapikey";
const STATION_PROFILE_ID = "1";

// Function for retrieving and processing data from the new API
function runScript() {
    const options = {
        url: WAVELOG_URL,
        method: "POST",
        json: true,
        body: {
            key: API_KEY,
            station_id: STATION_PROFILE_ID,
        },
        timeout: 15000
    };

    request(options, (error, response, body) => {
        if (error) {
            console.error("Error in API query:", error);
            return;
        }
        if (!body || body.status !== "successful") {
            console.error("Error: API did not return a successful status.");
            return;
        }

        // The new API now returns pre-aggregated QSO statistics.
        let totalQso      = body.statistics.totalalltime[0].count;
        let totalQsoYear  = body.statistics.totalthisyear[0].count;
        let ssbCount = 0, fmCount = 0, rttyCount = 0, ft8ft4Count = 0;
        let pskCount = 0, cwCount = 0, js8Count = 0, digiCount = 0;

        const digi_modes = ['FT8', 'FT4', 'PSK', 'RTTY', 'JS8', 'JT65', 'JT9', 'OLIVIA', 'CONTESTI', 'ROS']; // Add more as needed

        if (body.statistics.totalgroupedmodes) {
            body.statistics.totalgroupedmodes.forEach(mode => {
                const col_mode = mode.col_mode;
                const col_submode = mode.col_submode || '';

                if (col_mode === 'SSB') ssbCount += Number(mode.count);
                if (col_mode === 'FM') fmCount += Number(mode.count);
                if (col_mode === 'RTTY') rttyCount += Number(mode.count);
                if (col_mode === 'CW') cwCount += Number(mode.count);
                if (col_mode === 'PSK' || col_submode.startsWith('PSK')) pskCount += Number(mode.count);
                if (col_mode === 'JS8') js8Count += Number(mode.count);
                if (col_mode === 'FT8' || col_submode === 'FT4') ft8ft4Count += Number(mode.count);

                // Digital modes total
                digi_modes.forEach(digi => {
                    if (col_mode.startsWith(digi) || col_submode.startsWith(digi)) {
                        digiCount += Number(mode.count);
                    }
                });
            });
        }

        console.log(`Total QSOs: ${totalQso}, This Year: ${totalQsoYear}, SSB: ${ssbCount}, FM: ${fmCount}, RTTY: ${rttyCount}, FT8+FT4: ${ft8ft4Count}, PSK: ${pskCount}, CW: ${cwCount}, JS8: ${js8Count}, Digi: ${digiCount}`);

        // Write values to ioBroker datapoints (update these states as needed)
        setState("javascript.0.Wavelog.totalqso", totalQso, true);
        setState("javascript.0.Wavelog.totalqsoyear", totalQsoYear, true);
        setState("javascript.0.Wavelog.ssbqso", ssbCount, true);
        setState("javascript.0.Wavelog.fmqso", fmCount, true);
        setState("javascript.0.Wavelog.rttyqso", rttyCount, true);
        setState("javascript.0.Wavelog.ft8ft4qso", ft8ft4Count, true);
        setState("javascript.0.Wavelog.pskqso", pskCount, true);
        setState("javascript.0.Wavelog.cwqso", cwCount, true);
        setState("javascript.0.Wavelog.js8qso", js8Count, true);
        setState("javascript.0.Wavelog.digiqso", digiCount, true);
    });
}

// Run the script immediately
runScript();

// Schedule the script to run every 10 minutes
schedule("*/10 * * * *", runScript);
