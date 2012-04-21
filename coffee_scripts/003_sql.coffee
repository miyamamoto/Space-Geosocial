   # {
      # "HR": "2491",
      # "bfID": "9Alp CMa",
      # "Name": "Sirius",
      # "RAh": 6.752472222,
      # "DEd": -16.71611111,
      # "Vmag": -1.46,
      # "Sp": "A1Vm",
      # "pmRA": -0.553,
      # "pmDE": -1.205
    # }
create_table = '''
  CREATE TABLE config IF NOT EXISTS (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name TEXT,
    value TEXT
  );
  
  CREATE TABLE looks IF NOT EXISTS (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    hr TEXT,
    bfid TEXT,
    name TEXT,
    rah REAL,
    ded REAL,
    vmag REAL,
    sp TEXT,
    pmra REAL,
    pmde REAL,
    azimuth REAL,
    elevation REAL,
    hour_angle REAL
  );
  
  
  
'''
