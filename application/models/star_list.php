<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');


class Star_list extends CI_Model {

	private $lang = "japanese";

    function __construct()
    {
        // Model クラスのコンストラクタを呼び出す
        parent::__construct();

        $language = $this->config->item('language');
        if(!empty($language))
        {
	        $this->lang = $language;
        }
    }

	//星IDから星の名前を返す
    public function get_starname($starid)
    {

    	$sql = "SELECT name_".$this->lang." as name FROM starlist WHERE starid = ?";
    	$var_array = array($starid);

		$query = $this->db->query($sql, $var_array);

		$row = $query->row();
		return	$row->name;

    }

    //星のリストを全部取ってくる
    public function get_all()
    {
    	$sql = "SELECT starid, hr, bfid, name_".$this->lang." as name, rah, ded, vmag, sp, pmra, pmde FROM starlist WHERE vmag<=3.0";
    	$var_array = array();

    	$query = $this->db->query($sql, $var_array);

    	$result = $query->result();

    	return $result;
    }

    //星DBのバージョン情報（テーブルの最終更新日時）を取得
    public function get_updatetime()
    {
    	$sql = "SHOW TABLE STATUS where Name= ?";
    	$var_array = array('starlist');

    	$query = $this->db->query($sql, $var_array);

    	$result = $query->row();


    	return $result->Update_time;
    }

}