class Dialog
  constructor: (@dialog) ->
    @name = $('#star-name', @dialog)
    @vmag = $('#star-vmag', @dialog)
    @cicnt = $('#user-count', @dialog)
    
    @vmag_suffix = '等星'
    @cicnt_suffix = '人がチェックインしてます'
    
    @close_btn = $('#close-btn', @dialog)
    @close_btn.on 'click', =>
      @close()
      false
    
  open: (name, vmag, checkin_count = 0) =>
    @name.text name
    @vmag.text vmag + @vmag_suffix
    @cicnt.text checkin_count + @cicnt_suffix
    @dialog.slideDown()
  
  close: =>
    @dialog.slideUp()
    
# $ =>
  # $dialog = $('#dialog')
  # d = new Dialog($dialog)
  # d.open('hoge', 2.3, 32)
