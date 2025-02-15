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
            fetchfromid: 0
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
        const totalQso      = body.total_qso;
        const totalQsoYear  = body.total_qso_year;
        const ssbCount      = body.ssb_qso;
        const fmCount       = body.fm_qso;
        const rttyCount     = body.rtty_qso;
        const ft8ft4Count   = body.ft8ft4_qso;
        const pskCount      = body.psk_qso;
        const cwCount       = body.cw_qso;
        const js8Count      = body.js8_qso;
        const digiCount     = body.digi_qso;

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
