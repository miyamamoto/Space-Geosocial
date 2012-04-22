class Dialog
  constructor: (@dialog) ->
    @name = $('#star-name', @dialog)
    @vmag = $('#star-vmag', @dialog)
    @cicnt = $('#user-count', @dialog)
    
    @form = $('#checkin-form', @dialog)
    @latitude = $('input[name="latitude"]', @form)
    @longitude = $('input[name="longitude"]', @form)
    @submit = $('#checkin-btn', @form)
    
    @vmag_suffix = '等星'
    @cicnt_suffix = '人がチェックインしてます'
    
    @close_btn = $('#close-btn', @dialog)
    @close_btn.on 'click', =>
      @close()
      false
    
  open: (id, name, vmag, checkin_count = 0) =>
    @name.text name
    @vmag.text vmag + @vmag_suffix
    @cicnt.text checkin_count + @cicnt_suffix
    @submit.off('click').on('click', =>
      console.log('clicked')
      #send = @send
      # navigator.geolocation.watchPosition (pos) =>
        # console.log('send', send)
        # send(id, pos.coords.latitude, pos.coords.longitude)
      # , =>
        # console.log('send2', send)
        # send(id, 35.658, 139.741)
      @send(id, 35.658, 139.741)
      return false
    )
    
    @dialog.slideDown()
    
  send: (star_id, lat, long)=>
    console.log arguments
    @latitude.val lat
    @longitude.val long
    @form.attr 'action', '/index.php/checkin/reg_checkin/' + id
    @form.submit()
  close: =>
    @dialog.slideUp()
    
# $ =>
  # $dialog = $('#dialog')
  # d = new Dialog($dialog)
  # d.open('hoge', 2.3, 32)
