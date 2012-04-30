data = STARS_DATA;

#observe
time = new Orb.Time(new Date());

#open database
html5sql.openDatabase 'space_geosocial', 'Space Geosocial', 10 * 1024 * 1024

debugmode = false
log = ->
  if debugmode is true and console?.log?
    console.log arguments
