class Stars extends Database
  stars_json_url: 'http://49.212.141.168/index.php'
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
    #あとでAjaxでバージョン情報を取得する処理を追加
    @version = 2
  check_version: (cb, current_version) =>
    log parseInt(current_version) , @version
    if parseInt(current_version) < @version
      @reset_stars_json =>
        reset_stars cb
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