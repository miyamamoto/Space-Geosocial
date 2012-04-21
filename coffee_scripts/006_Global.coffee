class Global
  @looks
  @stars
  constructor: (@stars, @looks) ->
  
  get_near_stars: (cb, alpha = 0, gamma = 0, margin = 30) =>
    looks.get_near_stars =>
      cnt = 0
      near_stars = []
      while cnt < arguments[2].rows.length
        near_stars.push arguments[2].rows.item(cnt)
        cnt++
      if cb? and typeof(cb) is 'function'
        cb near_stars
    , alpha, gamma, margin