table_count = 3
current_count = 0
check = ->
  current_count++
  if current_count >= table_count
    next()

config = new Config()
config.create_table(check)

stars = new Stars =>
  stars.create_table(check)

looks = new Looks()
looks.create_table(check)

next = ->
  config.get (value) =>
    if value?
      stars.check_version( =>
        set_stars()
      , value)
    else
      stars.reset_stars_json =>
        set_stars()
  , 'stars_version'

set_stars = ->
  config.set( =>
    reset_looks()
  , 'stars_version', stars.stars_version)

reset_looks = ->
  looks.reset_looks =>
    set_global()

set_global = ->
  global = new Global(stars, looks)
  window.space_geosocial = global
  $(window).trigger('space_geosocial_ready')