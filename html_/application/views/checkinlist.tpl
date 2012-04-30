<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<style type="text/css">
<!--
td {
	padding: 5px;
	margin: 0px;
}

table .img_cell {
	border-top: 2px solid #cccccc;
	padding-top: 3px;
}

table .name_cell {

	border-top: 2px solid #cccccc;
	padding-top: 3px;
}

table .location_cell {

	border-top: 2px solid #cccccc;
	padding-top: 3px;
}

table .time_cell {

	border-top: 2px solid #cccccc;
	padding-top: 3px;
}

table .message_cell {

	border-top: 1px solid #eeeeee;
	padding: 10px;
}

.title {
	margin:0px;
	padding 20px;
	line-height:2em;
	background:#bbbbff;
}

-->
</style>

</head>
<p class="title">星「 {$starname} 」のチェックインリスト</p>
<table>
{section name=checkin loop=$checkinlist}
<tr>
	<td rowspan=2 class="img_cell"><img src="/img/test.png"></td>
	<td class="name_cell">{$checkinlist[checkin].uname} さん</td>
	<td class="time_cell" colspan=2>{$checkinlist[checkin].location}<span style="font-size:0.8em;">({$checkinlist[checkin].checkintime})</span></td>
</tr>
<tr>
	<td colspan=3 class="message_cell">{$checkinlist[checkin].message}</td>
</tr>
{/section}
</table>

</html>