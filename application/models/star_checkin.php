<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');


class Star_checkin extends CI_Model {

    function __construct()
    {
        // Model クラスのコンストラクタを呼び出す
        parent::__construct();
    }

    //チェックインを登録する
    public function reg_checkin($reg_data)
    {

    	$sql = "INSERT INTO checkinlist (uid, checkintime, location, message, starid) VALUES (?, now(), ?, ?, ?)";
    	$var_array = array($reg_data['uid'], $reg_data['location'], $reg_data['message'], $reg_data['starid']);

		$this->db->query($sql, $var_array);

		if($this->db->affected_rows() == 1)
		{
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

    	$sql = "SELECT uid, (SELECT uname FROM user WHERE uid = checkinlist.uid) as uname, DATE_FORMAT(checkintime,'%Y/%m/%d %k:%i') as checkintime, location, message FROM checkinlist WHERE starid = ? ORDER BY checkintime DESC";
    	$var_array = array($starid);

		$query = $this->db->query($sql, $var_array);

		return	$query->result_array();

    }


}


