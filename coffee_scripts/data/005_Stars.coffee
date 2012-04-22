class Stars extends Database
  stars_json_url: '/index.php/checkin/starlist'
  version_json_url: '/index.php/checkin/dbversion'
  table_name: 'stars'
  schema: {
    id: 'INTEGER PRIMARY KEY AUTOINCREMENT'
    hr: 'TEXT'
    bfid: 'TEXT'
    name: 'TEXT'
    rah: 'REAL'
    ded: 'REAL'
    vmag: 'REAL'
    sp: 'TEXT'
    pmra: 'REAL'
    pmde: 'REAL'
  }
  constructor: (cb) ->
    @reset_version cb
  check_version: (cb, current_version) =>
    if parseInt(current_version) < @version
      @reset_stars_json =>
        reset_stars cb
  reset_version: (cb) =>
    $.ajax {
      type: 'get'
      url: @version_json_url
      dataType: 'json'
      success: (data) =>
        @version = parseInt(data.version)
        cb() if cb? and typeof(cb) is 'function'
      error: (data) =>
        log 'error happend'
    }
  reset_stars_json: (cb) =>
    log 'hogefuga'
    $.ajax {
      type: 'get'
      url: @stars_json_url
      dataType: 'json'
      success: =>
        log 'success >> ', arguments
        cb() if cb? and typeof(cb) is 'function'
      error: =>
        log 'error >> ', arguments
      complete: =>
        log 'complete >> ', arguments
      
    }
  reset_stars: (cb) =>
    @delete_all =>
      insert_query = 'INSERT INTO stars (hr, bfid, name, rah, ded, vmag, sp, pmra, pmde) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);'
      queries = []
      cnt = 0
      for star in data
        if !(star?.RAh?) or !(star.DEd?)
          continue
        
        target = {
          ra: star.RAh
          dec: star.DEd
        }
  
        hr = if star.HR? then star.HR else ''
        bfID = if star.bfID? then star.bfID else ''
        name = if star.Name? then star.Name else ''
        rah = if star.RAh? then star.RAh else 0
        ded = if star.DEd? then star.DEd else 0
        vmag = if star.Vmag? then star.Vmag else 0
        sp = if star.Sp? then star.Sp else ''
        pmra = if star.pmRA? then star.pmRA else 0
        pmde = if star.pmDE? then star.pmDE else 0
        
        queries.push({
          sql: insert_query
          data: [hr, bfID, name, rah, ded, vmag, sp, pmra, pmde]
        })
        
      @execute cb, queries