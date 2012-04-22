class Looks extends Database
  table_name: 'looks'
  schema: {
    id: 'INTEGER PRIMARY KEY AUTOINCREMENT'
    star_id: 'INTEGER'
    azimuth: 'REAL'
    elevation: 'REAL'
    hour_angle: 'REAL'
  }
  @observer
  constructor: (cb) ->
    @reset_params cb
  
  reset_params: (cb) =>
    time = new Orb.Time(new Date());
    navigator.geolocation.watchPosition (pos) =>
      log pos
      @observer = {
        latitude: pos.coords.latitude
        longitude: pos.coords.longitude
        acc: pos.coords.accuracy
      }
      cb() if cb? and typeof(cb) is 'function'
    , =>
      #if can't get geo location, set Tokyo location.
      @observer = {
        latitude: 35.658
        longitude: 139.741
        acc: 0
      }
      cb() if cb? and typeof(cb) is 'function'

  reset_looks: (cb) =>
    stars = new Stars()
    stars.get_all (error, tx, results) =>
      if error is null and results?.rows?.length? and results.rows.length > 0
        stars = []
        cnt = 0
        while cnt < results.rows.length
          stars.push(results.rows.item(cnt))
          cnt++
          
        @delete_all =>
          queries = []
          
          for star in stars
            target = {
              ra: star.rah
              dec: star.ded
            }
            
            observe = new Orb.Observation(@observer,target);
            look = observe.horizontal(time);
            
            queries.push {
              sql: 'INSERT INTO ' + @table_name + ' (star_id, azimuth, elevation, hour_angle) VALUES (?, ?, ?, ?);'
              data: [star.id, look.azimuth, look.elevation, look.hour_angle]
            }
          
          @execute cb, queries
  get_near_stars: (cb, alpha, gamma, margin = 30) =>
    #alpha = azimuth = 方位角
    #gamma = elevation = 高さ角度
    #MAX(azimuth): 359.9822305769781
    #MIN(azimuth): 0.001526993435919094
    #MAX(elevation): 88.79272717883012
    #MIN(elevation): -86.56037375363515
    
    alpha_min = alpha - margin
    alpha_max = alpha + margin
    gamma_min = gamma - margin
    gamma_max = gamma + margin
    
    #limited values
    min_alpha = 0
    max_alpha = 360
    min_gamma = -90
    max_gamma = 90
    
    gamma_min = min_gamma if gamma_min < min_gamma
    gamma_max = max_gamma if gamma_max > max_gamma
    
    wheres = ['elevation >= ?', 'elevation <= ?']
    values = [gamma_min, gamma_max]
    
    if alpha_min < min_alpha
      wheres.push '((' + @table_name + '.azimuth >= ? AND ' + @table_name + '.azimuth <= ?) OR (' + @table_name + '.azimuth >= ? AND ' + @table_name + '.azimuth <= ?))'  
      values.push min_alpha, alpha_max, (max_alpha - Math.abs(alpha_min)), max_alpha
    else if alpha_max > max_alpha
      wheres.push '((' + @table_name + '.azimuth >= ? AND ' + @table_name + '.azimuth <= ?) OR (' + @table_name + '.azimuth >= ? AND ' + @table_name + '.azimuth <= ?))'
      values.push alpha_min, max_alpha, min_alpha, (alpha_max - max_alpha)
    else
      wheres.push @table_name + '.azimuth >= ?', @table_name + '.azimuth <= ?'
      values.push alpha_min, alpha_max
    
    stars = new Stars()
    stars_keys_ary = []
    for index, value of stars.schema
      stars_keys_ary.push stars.table_name + '.' + index + ' AS ' + index
      
    stars_keys = stars_keys_ary.join(',') + ','
    
    @execute cb, [
      {
        sql: 'SELECT ' + stars_keys + ' looks.azimuth AS azimuth, looks.elevation AS elevation, looks.hour_angle AS hour_angle FROM ' + @table_name + ' LEFT JOIN stars ON stars.id = looks.star_id WHERE ' + wheres.join(' AND ')
        data: values
      }
    ]
