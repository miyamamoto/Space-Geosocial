data = STARS_DATA;

#data versions
stars_version = 1

#observe
time = new Orb.Time(new Date());

#open database
html5sql.openDatabase 'space_geosocial', 'Space Geosocial', 10 * 1024 * 1024

debugmode = true
log = ->
  if debugmode is true and console?.log?
    console.log arguments
