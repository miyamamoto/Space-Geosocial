class Stars extends Database
  stars_json_url: '/index.php/checkin/starlist'
  version_json_url: '/index.php/checkin/dbversion'
  table_name: 'stars'
  schema: {
    id: 'INTEGER PRIMARY KEY AUTOINCREMENT'
    starid: 'TEXT'
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
  schema_version: 1
  constructor: (cb) ->
    @data = data
    @reset_version cb
  check_version: (cb, current_version) =>
    log 'VERSION *** ', parseInt(current_version) , @version, parseInt(current_version) < @version
    if parseInt(current_version) < @version
      @reset_stars_json =>
        @reset_stars cb
    else
      cb if cb? and typeof(cb) is 'function'
  reset_version: (cb) =>
    $.ajax {
      type: 'get'
      url: @version_json_url
      dataType: 'json'
      success: (data) =>
        log 'DATA>VERSION', data
        @version = parseInt(data.version)
      error: (data) =>
        @version = 0
      complete: ->
        cb() if cb? and typeof(cb) is 'function'
    }
  reset_stars_json: (cb) =>
    $.ajax {
      type: 'get'
      url: @stars_json_url
      dataType: 'json'
      success: (stars) =>
        @data = stars
      error: =>
      complete: =>
        cb() if cb? and typeof(cb) is 'function'
    }
  reset_stars: (cb) =>
    @delete_all =>
      insert_query = 'INSERT INTO stars (starid, hr, bfid, name, rah, ded, vmag, sp, pmra, pmde) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);'
      queries = []
      cnt = 0
      
      for star in @data
        if !(star?.rah?) or !(star.ded?)
          continue
        
        starid = if star.starid? then star.starid else 0
        hr = if star.hr? then star.hr else ''
        bfID = if star.bfid? then star.bfid else ''
        name = if star.name? then star.name else ''
        rah = if star.rah? then star.rah else 0
        ded = if star.ded? then star.ded else 0
        vmag = if star.vmag? then star.vmag else 0
        sp = if star.sp? then star.sp else ''
        pmra = if star.pmra? then star.pmra else 0
        pmde = if star.pmde? then star.pmde else 0
        
        queries.push {
          sql: insert_query
          data: [starid, hr, bfID, name, rah, ded, vmag, sp, pmra, pmde]
        }
      
      @execute cb, queries