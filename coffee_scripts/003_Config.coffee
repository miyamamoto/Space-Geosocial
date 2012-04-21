class Config extends Database
  table_name: 'config'
  schema: {
    id: 'INTEGER PRIMARY KEY AUTOINCREMENT'
    name: 'TEXT'
    value: 'TEXT'
  }
  get: (cb, name) => 
    query = [
      {
        sql: 'SELECT value FROM ' + @table_name + ' WHERE name = ? LIMIT 1;'
        data: [name]
      }
    ]
    @execute (error, tx, results) =>
      value = null
      if results?.rows?.length? and results.rows.length > 0
        value = results.rows.item(0).value
      cb(value)
    , query
  set: (cb, name, value) =>
    @get (err, tx, results) =>
      if results?.rows?.length? and results.rows.length > 0
        query = [
          {
            sql: 'UPDATE ' + @table_name + ' SET value = ? WHERE id = ?'
            data: [value, results.rows.item(0).id]
          }
        ]
      else
        query = [
          {
            sql: 'INSERT INTO ' + @table_name + ' (name, value) VALUES (?, ?);'
            data: [name, value]
          }
        ]
      @execute cb, query
    , name