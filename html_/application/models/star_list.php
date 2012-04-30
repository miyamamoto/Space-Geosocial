<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');


class Star_list extends CI_Model {

    function __construct()
    {
        // Model クラスのコンストラクタを呼び出す
        parent::__construct();
    }

	//星IDから星の名前を返す
    public function get_starname($starid)
    {

    	$sql = "SELECT name FROM starlist WHERE starid = ?";
    	$var_array = array($starid);

		$query = $this->db->query($sql, $var_array);

		$row = $query->row();
		return	$row->name;

    }

    //星のリストを全部取ってくる
    public function get_all()
    {
    	$sql = "SELECT starid, hr, bfid, name, rah, ded, vmag, sp, pmra, pmde FROM starlist WHERE 1";
    	$var_array = array();

    	$query = $this->db->query($sql, $var_array);

    	$result = $query->result();

    	return $result;
    }

}