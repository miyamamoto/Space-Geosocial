class Looks extends Database
  table_name: 'looks'
  schema: {
    id: 'INTEGER PRIMARY KEY AUTOINCREMENT'
    star_id: 'INTEGER'
    azimuth: 'REAL'
    elevation: 'REAL'
    hour_angle: 'REAL'
  }
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
            
            observe = new Orb.Observation(observer,target);
            look = observe.horizontal(time);
            
            queries.push {
              sql: 'INSERT INTO ' + @table_name + ' (star_id, azimuth, elevation, hour_angle) VALUES (?, ?, ?, ?);'
              data: [star.id, look.azimuth, look.elevation, look.hour_angle]
            }
          
          @execute cb, queries
  get_near_stars: (cb, alpha, gamma) =>
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
    
    log alpha_min, alpha_max, gamma_min, gamma_max
    
    cb()
      
