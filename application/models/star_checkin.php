<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');


class Star_checkin extends CI_Model {

	private $lang = "japanese";

    function __construct()
    {
        // Model クラスのコンストラクタを呼び出す
        parent::__construct();

        $this->load->model('Checkin_count');
        $language = $this->config->item('language');
        if(!empty($language))
        {
	        $this->lang = $language;
        }
    }

    //チェックインを登録する
    public function reg_checkin($reg_data)
    {

    	$sql = "INSERT INTO checkinlist (uid, starid, location_japanese, location_english, message, checkintime) VALUES (?, ?, ?, ?, ?, UTC_TIMESTAMP( ))";
    	$var_array = array($reg_data['uid'], $reg_data['starid'], $reg_data['location_japanese'], $reg_data['location_english'], $reg_data['message']);

		$this->db->query($sql, $var_array);

		if($this->db->affected_rows() == 1)
		{
			//チェックイン数のカウントアップ
			$this->Checkin_count->count_up($reg_data['starid']);

			return TRUE;
		}
		else
		{
			return FALSE;
		}

    }

    //星IDからその星にチェックインしているデータ一覧を取得
    public function get_checkinlist($starid)
    {

    	$sql = "SELECT checkinid, uid, (SELECT uname FROM user WHERE uid = checkinlist.uid) as uname, (SELECT icon FROM user WHERE uid = checkinlist.uid) as icon, location_".$this->lang." as location, message, DATE_FORMAT(checkintime,'%Y/%m/%d %k:%i') as checkintime FROM checkinlist WHERE starid = ? ORDER BY checkinid DESC";
    	$var_array = array($starid);

		$query = $this->db->query($sql, $var_array);

		return	$query->result_array();

    }


}


