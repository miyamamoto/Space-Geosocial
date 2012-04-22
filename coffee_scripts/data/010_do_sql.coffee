table_count = 3
current_count = 0

inicheck = ->
  current_count++
  if current_count >= table_count
    current_count = 0
    stars.create_table(check)
    config.create_table(check)
    looks.create_table(check)
check = ->
  current_count++
  if current_count >= table_count
    next()

config = new Config(inicheck)

stars = new Stars(inicheck)

looks = new Looks(inicheck)

next = ->
  config.get (value) =>
    log 'VERSION >>> ', value
    if value? and isNaN(parseInt(value)) isnt true
      log 'H1'
      stars.check_version( =>
        log 'H2'
        set_stars()
      , value)
    else
      log 'H3'
      stars.reset_stars_json =>
        log 'H4'
        stars.reset_stars =>
          log 'H5'
          set_stars()
  , 'stars_version'

set_stars = ->
  log '(^^)', stars.version
  config.set( =>
    reset_looks()
  , 'stars_version', stars.version)

reset_looks = ->
  looks.reset_looks =>
    set_global()

ready_flag = false
set_global = ->
  if ready_flag
    glob_done()
  else
    $ =>
      glob_done()
    
glob_done = ->
  dialog = new Dialog($('dialog'))
  global = new Global(stars, looks, dialog)
  window.space_geosocial = global
  $(window).trigger('space_geosocial_ready')

$ =>
  ready_flag = true