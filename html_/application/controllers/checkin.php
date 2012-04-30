<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');


class Checkin extends CI_Controller {

	private $view_data =array();

    public function __construct()
    {
        parent::__construct();
        $this->load->model('Star_checkin');
        $this->load->model('Star_list');
        $this->load->model('User');

    }

    public function index()
    {
    	/* 星データ取得処理 */
		$slist=$this->Star_list->get_all();

		//JSONエンコード
		$slist = json_encode($slist);
		echo($slist);
    	//$this->view_data['message'] = "動的なメッセージ表示";
    	//$this->parser->parse('checkinlist.tpl', $this->view_data);

    }

    //チェックイン処理
    public function reg_checkin($starid = 0)
    {
    	//POST値の取得
    	//$in_data = $this->input->post();

		//TODO 不要時には削除 DATA FOR DEBUG
    	//$in_data['latitude'] = "40.714224";
    	//$in_data['longtitude'] = "-73.961452";
    	$in_data['latitude'] = "35.664035";
    	$in_data['longtitude'] = "139.698212";


    	//緯度経度から場所情報の取得
		$location = $this->_revgeo($in_data['latitude'], $in_data['longtitude']);

		//TODO 不要時には削除 DATA FOR DEBUG
		$reg_data = array('uid'=>'1','location'=>$location,'message'=>'この星にチェックインしてみました。今、空の中で一番きれいですよ。','starid'=>$starid);
    	//DBへの登録
		$this->Star_checkin->reg_checkin($reg_data);

	    //チェックインリストの取得
		$checkinlist = $this->checkinlist($starid);
		$this->view_data['checkinlist'] = $checkinlist;

		//星の名前を取得
		$starname = $this->Star_list->get_starname($starid);
		$this->view_data['starname'] = $starname;


    	$this->parser->parse('checkinlist.tpl', $this->view_data);

    }



    //チェックインリストの取得と表示処理
    public function checkinlist($starid)
    {
    	//POST値の取得
		$in_data = $this->input->post();

    	//チェックインリスト一覧の取得
		$res = $this->Star_checkin->get_checkinlist($starid);
       	return $res;

    }



	//緯度経度から場所情報を取得（GoogleMAP APIをたたく）
    private function _revgeo($latitude, $longtitude, $language = "ja")
    {
	    $url_string = "http://maps.googleapis.com/maps/api/geocode/json?latlng=".$latitude.",".$longtitude."&sensor=true&language=ja";
    	$res = file_get_contents($url_string);
    	$res= json_decode($res);
    	$res_split = explode(',',$res->results[10]->formatted_address);
    	return $res_split[1];
    }

}