class Database
  constructor: (cb) ->
  execute: (cb, query) =>
    error = {}
    html5sql.process(
      query, (transaction, results) =>
        log 'EXECUTE SUCCESS >> ', transaction, results
        if cb? and typeof(cb) is 'function'
          cb(null, transaction, results)
      , (error) ->
        log 'EXECUTE ERRORS >> ', arguments
        if cb? and typeof(cb) is 'function'
          cb(error)
    )
 
  drop_table: (cb) =>
    if !(@table_name)
      return false
    
    query = 'DROP TABLE IF EXISTS ' + @table_name + ';'
    @execute cb, query
    
  create_table: (cb) =>
    if !(@schema?) or !(@table_name)
      return false
    
    if !(@schema_sql) or @schema_sql is ''
      query = 'CREATE TABLE IF NOT EXISTS ' + @table_name + ' (' + "\n"
      fields = ''
      for field_name, field_schema of @schema
        fields += ",\n" if fields isnt ''
        fields += field_name + ' ' + field_schema
      query += fields + "\n);"
      @schema_sql = query
      
    else
      query = @schema_sql
    
    @execute cb, query
  get_all: (cb) =>
    keys = ''
    for key, value of @schema
      keys += ',' if keys isnt ''
      keys += key
    query = 'SELECT ' + keys + ' FROM ' + @table_name + ';'
    @execute cb, query
  get_len: (cb) =>
    query = 'SELECT COUNT(*) FROM ' + @table_name + ';'
    @execute cb, query
  delete_all: (cb) =>
    query = 'DELETE FROM ' + @table_name + ';'
    @execute cb, query
  truncate: (cb) =>
    @drop_table =>
      @create_table =>
        cb() if cb? and typeof(cb) is 'function'
