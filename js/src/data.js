// Generated by CoffeeScript 1.3.1
(function() {
  var Config, Database, Dialog, Global, Looks, Stars, check, config, current_count, data, debugmode, log, looks, next, reset_looks, set_global, set_stars, stars, table_count, time,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    _this = this;

  data = STARS_DATA;

  time = new Orb.Time(new Date());

  html5sql.openDatabase('space_geosocial', 'Space Geosocial', 10 * 1024 * 1024);

  debugmode = true;

  log = function() {
    if (debugmode === true && ((typeof console !== "undefined" && console !== null ? console.log : void 0) != null)) {
      return console.log(arguments);
    }
  };

  Database = (function() {

    Database.name = 'Database';

    function Database(cb) {
      this.truncate = __bind(this.truncate, this);

      this.delete_all = __bind(this.delete_all, this);

      this.get_len = __bind(this.get_len, this);

      this.get_all = __bind(this.get_all, this);

      this.create_table = __bind(this.create_table, this);

      this.drop_table = __bind(this.drop_table, this);

      this.execute = __bind(this.execute, this);

    }

    Database.prototype.execute = function(cb, query) {
      var error,
        _this = this;
      error = {};
      return html5sql.process(query, function(transaction, results) {
        log('EXECUTE SUCCESS >> ', transaction, results);
        if ((cb != null) && typeof cb === 'function') {
          return cb(null, transaction, results);
        }
      }, function(error) {
        log('EXECUTE ERRORS >> ', arguments);
        if ((cb != null) && typeof cb === 'function') {
          return cb(error);
        }
      });
    };

    Database.prototype.drop_table = function(cb) {
      var query;
      if (!this.table_name) {
        return false;
      }
      query = 'DROP TABLE IF EXISTS ' + this.table_name + ';';
      return this.execute(cb, query);
    };

    Database.prototype.create_table = function(cb) {
      var field_name, field_schema, fields, query, _ref;
      if (!(this.schema != null) || !this.table_name) {
        return false;
      }
      if (!this.schema_sql || this.schema_sql === '') {
        query = 'CREATE TABLE IF NOT EXISTS ' + this.table_name + ' (' + "\n";
        fields = '';
        _ref = this.schema;
        for (field_name in _ref) {
          field_schema = _ref[field_name];
          if (fields !== '') {
            fields += ",\n";
          }
          fields += field_name + ' ' + field_schema;
        }
        query += fields + "\n);";
        this.schema_sql = query;
      } else {
        query = this.schema_sql;
      }
      return this.execute(cb, query);
    };

    Database.prototype.get_all = function(cb) {
      var key, keys, query, value, _ref;
      keys = '';
      _ref = this.schema;
      for (key in _ref) {
        value = _ref[key];
        if (keys !== '') {
          keys += ',';
        }
        keys += key;
      }
      query = 'SELECT ' + keys + ' FROM ' + this.table_name + ';';
      return this.execute(cb, query);
    };

    Database.prototype.get_len = function(cb) {
      var query;
      query = 'SELECT COUNT(*) FROM ' + this.table_name + ';';
      return this.execute(cb, query);
    };

    Database.prototype.delete_all = function(cb) {
      var query;
      query = 'DELETE FROM ' + this.table_name + ';';
      log('!?', query);
      return this.execute(cb, query);
    };

    Database.prototype.truncate = function(cb) {
      var _this = this;
      return this.drop_table(function() {
        return _this.create_table(function() {
          if ((cb != null) && typeof cb === 'function') {
            return cb();
          }
        });
      });
    };

    return Database;

  })();

  Config = (function(_super) {

    __extends(Config, _super);

    Config.name = 'Config';

    function Config() {
      this.set = __bind(this.set, this);

      this.get = __bind(this.get, this);
      return Config.__super__.constructor.apply(this, arguments);
    }

    Config.prototype.table_name = 'config';

    Config.prototype.schema = {
      id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
      name: 'TEXT',
      value: 'TEXT'
    };

    Config.prototype.get = function(cb, name) {
      var query,
        _this = this;
      query = [
        {
          sql: 'SELECT value FROM ' + this.table_name + ' WHERE name = ? LIMIT 1;',
          data: [name]
        }
      ];
      return this.execute(function(error, tx, results) {
        var value, _ref;
        value = null;
        if (((results != null ? (_ref = results.rows) != null ? _ref.length : void 0 : void 0) != null) && results.rows.length > 0) {
          value = results.rows.item(0).value;
        }
        return cb(value);
      }, query);
    };

    Config.prototype.set = function(cb, name, value) {
      var _this = this;
      return this.get(function(err, tx, results) {
        var query, _ref;
        if (((results != null ? (_ref = results.rows) != null ? _ref.length : void 0 : void 0) != null) && results.rows.length > 0) {
          query = [
            {
              sql: 'UPDATE ' + _this.table_name + ' SET value = ? WHERE id = ?',
              data: [value, results.rows.item(0).id]
            }
          ];
        } else {
          query = [
            {
              sql: 'INSERT INTO ' + _this.table_name + ' (name, value) VALUES (?, ?);',
              data: [name, value]
            }
          ];
        }
        return _this.execute(cb, query);
      }, name);
    };

    return Config;

  })(Database);

  Looks = (function(_super) {

    __extends(Looks, _super);

    Looks.name = 'Looks';

    Looks.prototype.table_name = 'looks';

    Looks.prototype.schema = {
      id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
      star_id: 'INTEGER',
      azimuth: 'REAL',
      elevation: 'REAL',
      hour_angle: 'REAL'
    };

    Looks.observer;

    function Looks(cb) {
      this.get_near_stars = __bind(this.get_near_stars, this);

      this.reset_looks = __bind(this.reset_looks, this);

      this.reset_params = __bind(this.reset_params, this);
      this.reset_params(cb);
    }

    Looks.prototype.reset_params = function(cb) {
      var _this = this;
      time = new Orb.Time(new Date());
      return navigator.geolocation.watchPosition(function(pos) {
        log(pos);
        _this.observer = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          acc: pos.coords.accuracy
        };
        if ((cb != null) && typeof cb === 'function') {
          return cb();
        }
      }, function() {
        _this.observer = {
          latitude: 35.658,
          longitude: 139.741,
          acc: 0
        };
        if ((cb != null) && typeof cb === 'function') {
          return cb();
        }
      });
    };

    Looks.prototype.reset_looks = function(cb) {
      var stars,
        _this = this;
      stars = new Stars();
      return stars.get_all(function(error, tx, results) {
        var cnt, _ref;
        log('>>>>>', arguments);
        if (error === null && ((results != null ? (_ref = results.rows) != null ? _ref.length : void 0 : void 0) != null)) {
          stars = [];
          cnt = 0;
          while (cnt < results.rows.length) {
            stars.push(results.rows.item(cnt));
            cnt++;
          }
          return _this.delete_all(function() {
            var look, observe, queries, star, target, _i, _len;
            queries = [];
            for (_i = 0, _len = stars.length; _i < _len; _i++) {
              star = stars[_i];
              target = {
                ra: star.rah,
                dec: star.ded
              };
              observe = new Orb.Observation(_this.observer, target);
              look = observe.horizontal(time);
              queries.push({
                sql: 'INSERT INTO ' + _this.table_name + ' (star_id, azimuth, elevation, hour_angle) VALUES (?, ?, ?, ?);',
                data: [star.id, look.azimuth, look.elevation, look.hour_angle]
              });
            }
            return _this.execute(cb, queries);
          });
        }
      });
    };

    Looks.prototype.get_near_stars = function(cb, alpha, gamma, margin) {
      var alpha_max, alpha_min, gamma_max, gamma_min, index, max_alpha, max_gamma, min_alpha, min_gamma, stars, stars_keys, stars_keys_ary, value, values, wheres, _ref;
      if (margin == null) {
        margin = 30;
      }
      alpha_min = alpha - margin;
      alpha_max = alpha + margin;
      gamma_min = gamma - margin;
      gamma_max = gamma + margin;
      min_alpha = 0;
      max_alpha = 360;
      min_gamma = -90;
      max_gamma = 90;
      if (gamma_min < min_gamma) {
        gamma_min = min_gamma;
      }
      if (gamma_max > max_gamma) {
        gamma_max = max_gamma;
      }
      wheres = ['elevation >= ?', 'elevation <= ?'];
      values = [gamma_min, gamma_max];
      if (alpha_min < min_alpha) {
        wheres.push('((' + this.table_name + '.azimuth >= ? AND ' + this.table_name + '.azimuth <= ?) OR (' + this.table_name + '.azimuth >= ? AND ' + this.table_name + '.azimuth <= ?))');
        values.push(min_alpha, alpha_max, max_alpha - Math.abs(alpha_min), max_alpha);
      } else if (alpha_max > max_alpha) {
        wheres.push('((' + this.table_name + '.azimuth >= ? AND ' + this.table_name + '.azimuth <= ?) OR (' + this.table_name + '.azimuth >= ? AND ' + this.table_name + '.azimuth <= ?))');
        values.push(alpha_min, max_alpha, min_alpha, alpha_max - max_alpha);
      } else {
        wheres.push(this.table_name + '.azimuth >= ?', this.table_name + '.azimuth <= ?');
        values.push(alpha_min, alpha_max);
      }
      stars = new Stars();
      stars_keys_ary = [];
      _ref = stars.schema;
      for (index in _ref) {
        value = _ref[index];
        stars_keys_ary.push(stars.table_name + '.' + index + ' AS ' + index);
      }
      stars_keys = stars_keys_ary.join(',') + ',';
      return this.execute(cb, [
        {
          sql: 'SELECT ' + stars_keys + ' looks.azimuth AS azimuth, looks.elevation AS elevation, looks.hour_angle AS hour_angle FROM ' + this.table_name + ' LEFT JOIN stars ON stars.id = looks.star_id WHERE ' + wheres.join(' AND '),
          data: values
        }
      ]);
    };

    return Looks;

  })(Database);

  Stars = (function(_super) {

    __extends(Stars, _super);

    Stars.name = 'Stars';

    Stars.prototype.stars_json_url = '/index.php/checkin/starlist';

    Stars.prototype.version_json_url = '/index.php/checkin/dbversion';

    Stars.prototype.table_name = 'stars';

    Stars.prototype.schema = {
      id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
      hr: 'TEXT',
      bfid: 'TEXT',
      name: 'TEXT',
      rah: 'REAL',
      ded: 'REAL',
      vmag: 'REAL',
      sp: 'TEXT',
      pmra: 'REAL',
      pmde: 'REAL'
    };

    function Stars(cb) {
      this.reset_stars = __bind(this.reset_stars, this);

      this.reset_stars_json = __bind(this.reset_stars_json, this);

      this.reset_version = __bind(this.reset_version, this);

      this.check_version = __bind(this.check_version, this);
      this.reset_version(cb);
    }

    Stars.prototype.check_version = function(cb, current_version) {
      var _this = this;
      if (parseInt(current_version) < this.version) {
        return this.reset_stars_json(function() {
          return _this.reset_stars(cb);
        });
      }
    };

    Stars.prototype.reset_version = function(cb) {
      var _this = this;
      return $.ajax({
        type: 'get',
        url: this.version_json_url,
        dataType: 'json',
        success: function(data) {
          _this.version = parseInt(data.version);
          if ((cb != null) && typeof cb === 'function') {
            return cb();
          }
        },
        error: function(data) {
          return log('error happend');
        }
      });
    };

    Stars.prototype.reset_stars_json = function(cb) {
      var _this = this;
      log('hogefuga');
      return $.ajax({
        type: 'get',
        url: this.stars_json_url,
        dataType: 'json',
        success: function(stars) {
          data = stars;
          if ((cb != null) && typeof cb === 'function') {
            return cb();
          }
        },
        error: function() {
          return log('error >> ', arguments);
        },
        complete: function() {
          return log('complete >> ', arguments);
        }
      });
    };

    Stars.prototype.reset_stars = function(cb) {
      var _this = this;
      log('rest_stas');
      return this.delete_all(function() {
        var bfID, cnt, ded, hr, insert_query, name, pmde, pmra, queries, rah, sp, star, target, vmag, _i, _len;
        log('uhiaiaopakp');
        insert_query = 'INSERT INTO stars (hr, bfid, name, rah, ded, vmag, sp, pmra, pmde) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);';
        queries = [];
        cnt = 0;
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          star = data[_i];
          if (!((star != null ? star.RAh : void 0) != null) || !(star.DEd != null)) {
            continue;
          }
          target = {
            ra: star.RAh,
            dec: star.DEd
          };
          hr = star.HR != null ? star.HR : '';
          bfID = star.bfID != null ? star.bfID : '';
          name = star.Name != null ? star.Name : '';
          rah = star.RAh != null ? star.RAh : 0;
          ded = star.DEd != null ? star.DEd : 0;
          vmag = star.Vmag != null ? star.Vmag : 0;
          sp = star.Sp != null ? star.Sp : '';
          pmra = star.pmRA != null ? star.pmRA : 0;
          pmde = star.pmDE != null ? star.pmDE : 0;
          queries.push({
            sql: insert_query,
            data: [hr, bfID, name, rah, ded, vmag, sp, pmra, pmde]
          });
        }
        log('uipoupoiuiouoiu', queries[0]);
        return _this.execute(cb, queries);
      });
    };

    return Stars;

  })(Database);

  Global = (function() {

    Global.name = 'Global';

    Global.looks;

    Global.stars;

    function Global(stars, looks) {
      this.stars = stars;
      this.looks = looks;
      this.get_near_stars = __bind(this.get_near_stars, this);

      this.reset_looks = __bind(this.reset_looks, this);

      this.reset_params = __bind(this.reset_params, this);

      this.reset_stars = __bind(this.reset_stars, this);

    }

    Global.prototype.reset_stars = function(cb, stars) {
      var _this = this;
      data = stars;
      return this.stars.reset_stars(function() {
        return _this.looks.reset_looks(cb);
      });
    };

    Global.prototype.reset_params = function(cb) {
      return looks.reset_params(cb);
    };

    Global.prototype.reset_looks = function(cb) {
      return looks.reset_looks(cb);
    };

    Global.prototype.get_near_stars = function(cb, alpha, gamma, margin) {
      var _this = this;
      if (alpha == null) {
        alpha = 0;
      }
      if (gamma == null) {
        gamma = 0;
      }
      if (margin == null) {
        margin = 30;
      }
      return looks.get_near_stars(function(error, tx, results) {
        var cnt, near_stars, _ref;
        near_stars = [];
        if (error === null && ((results != null ? (_ref = results.rows) != null ? _ref.length : void 0 : void 0) != null) && results.rows.length > 0) {
          cnt = 0;
          while (cnt < results.rows.length) {
            near_stars.push(results.rows.item(cnt));
            cnt++;
          }
        }
        if ((cb != null) && typeof cb === 'function') {
          return cb(near_stars);
        }
      }, alpha, gamma, margin);
    };

    return Global;

  })();

  Dialog = (function() {

    Dialog.name = 'Dialog';

    function Dialog(dialog) {
      var _this = this;
      this.dialog = dialog;
      this.close = __bind(this.close, this);

      this.open = __bind(this.open, this);

      this.name = $('#star-name', this.dialog);
      this.vmag = $('#star-vmag', this.dialog);
      this.cicnt = $('#user-count', this.dialog);
      this.vmag_suffix = '等星';
      this.cicnt_suffix = '人がチェックインしてます';
      this.close_btn = $('#close-btn', this.dialog);
      this.close_btn.on('click', function() {
        _this.close();
        return false;
      });
    }

    Dialog.prototype.open = function(name, vmag, checkin_count) {
      if (checkin_count == null) {
        checkin_count = 0;
      }
      this.name.text(name);
      this.vmag.text(vmag + this.vmag_suffix);
      this.cicnt.text(checkin_count + this.cicnt_suffix);
      return this.dialog.slideDown();
    };

    Dialog.prototype.close = function() {
      return this.dialog.slideUp();
    };

    return Dialog;

  })();

  table_count = 3;

  current_count = 0;

  check = function() {
    current_count++;
    if (current_count >= table_count) {
      return next();
    }
  };

  config = new Config();

  config.create_table(check);

  stars = new Stars(function() {
    log('UHIHIHIHIHI');
    return stars.create_table(check);
  });

  looks = new Looks();

  looks.create_table(check);

  next = function() {
    var _this = this;
    log('next start');
    return config.get(function(value) {
      log('valval', parseInt(value));
      if ((value != null) && isNaN(parseInt(value)) !== true) {
        return stars.check_version(function() {
          log('HHH1');
          return set_stars();
        }, value);
      } else {
        log('e?');
        return stars.reset_stars_json(function() {
          log('HHH2');
          return stars.reset_stars(function() {
            log('HHH2.222');
            return set_stars();
          });
        });
      }
    }, 'stars_version');
  };

  set_stars = function() {
    var _this = this;
    log('HHH3');
    return config.set(function() {
      log('HHH4');
      return reset_looks();
    }, 'stars_version', stars.version);
  };

  reset_looks = function() {
    var _this = this;
    log('HHH5');
    return looks.reset_looks(function() {
      log('HHH6');
      return set_global();
    });
  };

  set_global = function() {
    var global;
    global = new Global(stars, looks);
    window.space_geosocial = global;
    return $(window).trigger('space_geosocial_ready');
  };

}).call(this);
