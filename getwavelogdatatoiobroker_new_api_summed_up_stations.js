const request = require('request');

// Wavelog API settings using the new WordPress endpoint
const WAVELOG_URL = "https://waveloginstance.com/index.php/api/get_wp_stats";
const API_KEY = "APIkey1234";
const STATION_PROFILE_IDS = ["01", "02"]; // List of station IDs to query

function runScript() {
  // Initialize counters
  let totalQso = 0, totalQsoYear = 0;
  let ssbCount = 0, fmCount = 0, rttyCount = 0, ft8ft4Count = 0;
  let pskCount = 0, cwCount = 0, js8Count = 0, digiCount = 0;

  // List of digital modes for grouped counting
  const digi_modes = ['FT8','FT4','PSK','RTTY','JS8','JT65','JT9','OLIVIA','CONTESTI','ROS'];

  // Counter to track how many API requests are still pending
  let remaining = STATION_PROFILE_IDS.length;

  // Iterate over each station ID and send an API request
  STATION_PROFILE_IDS.forEach(stationId => {
    const options = {
      url: WAVELOG_URL,
      method: "POST",
      json: true,
      body: { key: API_KEY, station_id: stationId },
      timeout: 15000
    };

    request(options, (error, response, body) => {
      try {
        if (error) {
          console.error(`API error for station ${stationId}:`, error);
        } else if (!body || body.status !== "successful") {
          console.error(`Station ${stationId}: API did not return a successful status.`);
        } else {
          // Add total QSO counts
          totalQso      += Number(body.statistics?.totalalltime?.[0]?.count || 0);
          totalQsoYear  += Number(body.statistics?.totalthisyear?.[0]?.count || 0);

          // Process grouped modes
          (body.statistics?.totalgroupedmodes || []).forEach(mode => {
            const col_mode = mode.col_mode || '';
            const col_submode = mode.col_submode || '';
            const count = Number(mode.count || 0);

            if (col_mode === 'SSB') ssbCount += count;
            if (col_mode === 'FM') fmCount += count;
            if (col_mode === 'RTTY') rttyCount += count;
            if (col_mode === 'CW') cwCount += count;
            if (col_mode === 'PSK' || col_submode.startsWith('PSK')) pskCount += count;
            if (col_mode === 'JS8') js8Count += count;

            // FT8 and FT4 (FT4 can also appear as a submode)
            if (col_mode === 'FT8' || col_submode === 'FT4') ft8ft4Count += count;

            // Digital modes total
            digi_modes.forEach(digi => {
              if (col_mode.startsWith(digi) || col_submode.startsWith(digi)) {
                digiCount += count;
              }
            });
          });
        }
      } finally {
        // Mark this request as finished (success or failure)
        remaining--;

        // When all requests are finished, write results to ioBroker
        if (remaining === 0) {
          console.log(`Total QSOs: ${totalQso}, This Year: ${totalQsoYear}, SSB: ${ssbCount}, FM: ${fmCount}, RTTY: ${rttyCount}, FT8+FT4: ${ft8ft4Count}, PSK: ${pskCount}, CW: ${cwCount}, JS8: ${js8Count}, Digi: ${digiCount}`);

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
        }
      }
    });
  });
}

// Run the script immediately
runScript();

// Schedule the script to run every 10 minutes
schedule("*/10 * * * *", runScript);
