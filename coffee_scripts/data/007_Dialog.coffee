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
    console.log(@submit);
    @submit.off('click').on('click', =>
      $form = @form
      $lat = @latitude
      $lon = @longitude
      looks = new Looks =>
        ob = looks.observer
        lat = ob.latitude
        lon = ob.longitude
        $lat.val lat
        $lon.val lon
        console.log $form
        $form.attr 'action', '/index.php/checkin/reg_checkin/' + id
        $form.submit()
        
      return false
    )
    
    console.log(@dialog)
    @dialog.slideDown()
    
  
  close: =>
    @dialog.slideUp()
    
# $ =>
  # $dialog = $('#dialog')
  # d = new Dialog($dialog)
  # d.open('hoge', 2.3, 32)
