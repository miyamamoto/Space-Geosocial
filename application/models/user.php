<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');


class User extends CI_Model {

    function __construct()
    {
        // Model クラスのコンストラクタを呼び出す
        parent::__construct();
    }

	//ユーザIDからユーザの名前を返す
    public function get_username($uid)
    {

    	$sql = "SELECT uname FROM user WHERE uid = ?";
    	$var_array = array($uid);

		$this->db->query($sql, $var_array);

		$row = $query->row;

		return	$row->uname;

    }
}