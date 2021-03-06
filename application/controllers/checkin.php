<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');


class Checkin extends CI_Controller {

	private $view_data =array();

    public function __construct()
    {
        parent::__construct();
        $this->lang->load('linkastar');
        $this->load->model('Star_checkin');
        $this->load->model('Star_list');
        $this->load->model('User');
		$this->load->helper('date');

    }

    public function index()
    {

    }

    //星DBのバージョン情報をJSONで返す
    public function dbversion()
    {
    	/* 星DBバージョン取得処理 */
		$version = array('version' => human_to_unix($this->Star_list->get_updatetime()));

		//JSONエンコード
		$virsion = json_encode($version);

		//出力時のHEADER指定
		$this->output->set_header("Content-Type: text/javascript; charset=utf-8");
		echo($virsion);

    }

    //構成データ一覧をJSONで返す
    public function starlist()
    {
    	/* 星データ取得処理 */
		$slist=$this->Star_list->get_all();

		//JSONエンコード
		$slist = json_encode($slist);

		//出力時のHEADER指定
		$this->output->set_header("Content-Type: text/javascript; charset=utf-8");
		echo($slist);

    }


    //チェックイン処理
    public function reg_checkin($starid = 0)
    {
    	//POST値の取得
    	$in_data = $this->input->post();

		//TODO 不要時には削除 DATA FOR DEBUG
    	//$in_data['latitude'] = "35.664035";
    	//$in_data['longitude'] = "139.698212";

    	//緯度経度から場所情報の取得（日本語/英語）して登録データ配列に追加
		$reg_data['location_japanese'] = trim($this->_revgeo($in_data['latitude'], $in_data['longitude'],'ja'));
		$reg_data['location_english'] = trim($this->_revgeo($in_data['latitude'], $in_data['longitude'],'en'));

		$reg_data['starid'] = $starid;

		//TODO 不要時には削除 DATA FOR DEBUG
		$reg_data = array('uid'=>'1','location_japanese'=>$reg_data['location_japanese'],'location_english'=>$reg_data['location_english'],'message'=>$in_data['message'],'starid'=>$starid);
    	//DBへの登録
		$this->Star_checkin->reg_checkin($reg_data);

	    //チェックインリストの取得
		$checkinlist = $this->Star_checkin->get_checkinlist($starid);

		//JSONエンコード
		$checkinlist = json_encode($checkinlist);

		//出力時のHEADER指定
		$this->output->set_header("Content-Type: text/javascript; charset=utf-8");
		echo($checkinlist);

    }



    //チェックインリストの取得と表示処理
    public function checkinlist($starid)
    {
    	//POST値の取得
		$in_data = $this->input->post();

    	//チェックインリスト一覧の取得
		$checkinlist = $this->Star_checkin->get_checkinlist($starid);

		//JSONエンコード
		$checkinlist = json_encode($checkinlist);

		//出力時のHEADER指定
		$this->output->set_header("Content-Type: text/javascript; charset=utf-8");
		echo($checkinlist);

    }



	//緯度経度から場所情報を取得（GoogleMAP APIをたたく）
    private function _revgeo($latitude, $longitude, $language = "ja")
    {
        $url_string = "http://maps.googleapis.com/maps/api/geocode/json?latlng=".$latitude.",".$longitude."&sensor=true&language=".$language;
    	$res = file_get_contents($url_string);
    	$res= json_decode($res);
    	$addr_array = array();
    	foreach($res->results[0]->address_components as $component)
    	{
    		$addr_array[] = $component->long_name;
    	}
    	$addr_array = array_reverse($addr_array);

		if($language == 'ja')
    	{
		   	return $addr_array[1].$addr_array[2].'['.$addr_array[0].']';
    	}
    	else
    	{
		   	return $addr_array[2].','.$addr_array[1].'['.$addr_array[0].']';
    	}
    }

}