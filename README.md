# import_wavelog_qsos_to_io.Broker

Created by Daniel Beckemeier, DO8YDP

This Javascript imports QSO numbers to ioBroker objects. This data can then be used to visualize it, for example to push it to Awtrix devices for example. 

##Installation:

1. Create the following objects underneath the Javascript-Adapter-objects in io.Broker:

<img width="614" alt="Bildschirmfoto 2025-02-15 um 17 39 04" src="https://github.com/user-attachments/assets/1eb47cbb-6b8a-4022-ac8d-a91b340b223a" />

javascript.0.Wavelog.totalqso  
javascript.0.Wavelog.totalqsoyear  
javascript.0.Wavelog.ssb  
javascript.0.Wavelog.fmqso  
javascript.0.Wavelog.rttyqso  
javascript.0.Wavelog.ft8ft4qso  
javascript.0.Wavelog.ft8qso  
javascript.0.Wavelog.ft4qso  
javascript.0.Wavelog.pskqso  
javascript.0.Wavelog.digiqso  
javascript.0.Wavelog.cwqso  
javascript.0.Wavelog.js8qso  
javascript.0.Wavelog.pskqso  
javascript.0.Wavelog.amqso  




2. Just create the Javascript in your io.Broker Javascript Adapter. This script will auto-run every 10 minutes to update the data objects in io.Broker.
Make shure to replace the URL, Read-only API-key from Wavelog and station ID with the correct data from your wavelog instance.


If you want to read on, how I used this data to display it on my Ulanzi TC001 Pixel clock running Awtrix firmware, read on here: https://do8ydp.de/automated-display-of-qso-statistics-from-wavelog-on-the-ulanzi-tc001-pixelclock-with-awtrix-and-io-broker/
