# import_wavelog_qsos_to_io.Broker

Created by Daniel Beckemeier, DO8YDP

This Javascript imports QSO numbers to ioBroker objects. This data can then be used to visualize it, for example to push it to Awtrix devices for example. 

Installation:

1. Create the following objects underneath the Javascript-Adapter-objects in io.Broker:


javascript.0.Wavelog.totalqso
javascript.0.Wavelog.SSB_QSOs
javascript.0.Wavelog.fmqso
javascript.0.Wavelog.rttyqso
javascript.0.Wavelog.ft8ft4qso
javascript.0.Wavelog.pskqso
javascript.0.Wavelog.digiqso
javascript.0.Wavelog.cwqso
javascript.0.Wavelog.js8qso


2. Just create the Javascript in your io.Broker Javascript Adapter. This script will auto-run every 10 minutes to update the data objects in io.Broker.
Make shure to replace the URL, Read-only API-key from Wavelog and station ID with the correct data from your wavelog instance.
