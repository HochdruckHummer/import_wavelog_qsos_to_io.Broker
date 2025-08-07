# import_wavelog_qsos_to_io.Broker

Created by Daniel Beckemeier, DL8YDP

This Javascript imports QSO numbers to ioBroker objects. This data can then be used to visualize it, for example to push it to Awtrix devices (see how to below). 

## Compatibility

This script requires at least Wavelog version 2.0.1. to work, as there was an API implemented for this tool.


## Installation:

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

There are 3 versions of Javascript in this repository (you can choose which one you want to use):

**getwavelogdatatoiobroker_new_api_summed_up_stations.js (Use this one)**
Your way to go. Can handle and sum up multiple station IDs.

**getwavelogdatatoiobroker_new_wp_api.js (Might use it if version 1 doesn't work).**
The first stable version that retrieves Wavelog-Data via the dedicated wavelog endpoint. Can handle only one single station ID.


**getwavelogdatatoiobroker_old.js (DONT USE IT)**
This is old and it does not use the dedicated wavelog endpoint. Instead it calculates the total sums itself. Highly inefficient. I will delete this file in the future as this kind of data retrieval will be deprecated soon. Don't use it. 



This file lets you read from multiple Station IDs and sums up the values over multiple Station IDs. Yay.



## Visualisation on Awtrix device

If you want to read on, how I used this data to display it on my Ulanzi TC001 Pixel clock running Awtrix firmware, read on here: https://do8ydp.de/automated-display-of-qso-statistics-from-wavelog-on-the-ulanzi-tc001-pixelclock-with-awtrix-and-io-broker/

You can find suitable 16x16 pixel icons for the Awtrix or any other pixel clock in the archive called **amateur_radio_pixel_icons.zip**

<img width="533" alt="Bildschirmfoto 2025-02-15 um 17 44 03" src="https://github.com/user-attachments/assets/25a296b0-07b8-43c7-8e3c-2b5551592ab8" />

