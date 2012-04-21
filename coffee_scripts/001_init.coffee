data = STARS_DATA;

#data versions
stars_version = 1

#set margin
margin = 30

#for orb.js
date = new Date();
time = new Orb.Time(date);

observer = {  #tokyo
  "latitude":35.658,
  "longitude":139.741,
  "altitude":0
}

#open database
html5sql.openDatabase 'space_geosocial', 'Space Geosocial', 10 * 1024 * 1024

debugmode = true
log = ->
  if debugmode is true and console?.log?
    console.log arguments
