class Global
  @looks
  @stars
  constructor: (@stars, @looks) ->
  reset_stars: (cb, stars) =>
    data = stars
    @stars.reset_stars =>
      @looks.reset_looks cb
  reset_params: (cb) =>
    looks.reset_params cb
  reset_looks: (cb) =>
    looks.reset_looks cb
  get_near_stars: (cb, alpha = 0, gamma = 0, margin = 30) =>
    looks.get_near_stars (error, tx, results) =>
      near_stars = []
      
      if error is null and results?.rows?.length? and results.rows.length > 0
        cnt = 0
        while cnt < results.rows.length
          near_stars.push results.rows.item(cnt)
          cnt++
      if cb? and typeof(cb) is 'function'
          cb near_stars
    , alpha, gamma, margin