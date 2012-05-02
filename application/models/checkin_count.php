<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');


class Checkin_count extends CI_Model {


    function __construct()
    {
        // Model クラスのコンストラクタを呼び出す
        parent::__construct();
    }

    //チェックイン数のカウントアップを行う
    public function count_up($starid)
    {

    	$sql = "INSERT INTO checkin_count (starid, count) VALUES (?, 1) ON DUPLICATE KEY UPDATE count = count+1";
    	$var_array = array($starid);

    	$this->db->query($sql, $var_array);

    }
}