<?php /* Smarty version Smarty-3.1.7, created on 2012-04-29 16:46:58
         compiled from "D:\pleiades\xampp\htdocs\linkastar\application\views\checkinlist.tpl" */ ?>
<?php /*%%SmartyHeaderCode:16114f9cf1f26be1b7-92211903%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '406124f7b8c6a714b39f12bb9fe2055087af2b48' => 
    array (
      0 => 'D:\\pleiades\\xampp\\htdocs\\linkastar\\application\\views\\checkinlist.tpl',
      1 => 1335629174,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '16114f9cf1f26be1b7-92211903',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'title' => 0,
    'checkinlist' => 0,
    'uname_suffix' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.7',
  'unifunc' => 'content_4f9cf202369fd',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_4f9cf202369fd')) {function content_4f9cf202369fd($_smarty_tpl) {?><html>
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
<p class="title"><?php echo $_smarty_tpl->tpl_vars['title']->value;?>
</p>
<table>
<?php if (isset($_smarty_tpl->tpl_vars['smarty']->value['section']['checkin'])) unset($_smarty_tpl->tpl_vars['smarty']->value['section']['checkin']);
$_smarty_tpl->tpl_vars['smarty']->value['section']['checkin']['name'] = 'checkin';
$_smarty_tpl->tpl_vars['smarty']->value['section']['checkin']['loop'] = is_array($_loop=$_smarty_tpl->tpl_vars['checkinlist']->value) ? count($_loop) : max(0, (int)$_loop); unset($_loop);
$_smarty_tpl->tpl_vars['smarty']->value['section']['checkin']['show'] = true;
$_smarty_tpl->tpl_vars['smarty']->value['section']['checkin']['max'] = $_smarty_tpl->tpl_vars['smarty']->value['section']['checkin']['loop'];
$_smarty_tpl->tpl_vars['smarty']->value['section']['checkin']['step'] = 1;
$_smarty_tpl->tpl_vars['smarty']->value['section']['checkin']['start'] = $_smarty_tpl->tpl_vars['smarty']->value['section']['checkin']['step'] > 0 ? 0 : $_smarty_tpl->tpl_vars['smarty']->value['section']['checkin']['loop']-1;
if ($_smarty_tpl->tpl_vars['smarty']->value['section']['checkin']['show']) {
    $_smarty_tpl->tpl_vars['smarty']->value['section']['checkin']['total'] = $_smarty_tpl->tpl_vars['smarty']->value['section']['checkin']['loop'];
    if ($_smarty_tpl->tpl_vars['smarty']->value['section']['checkin']['total'] == 0)
        $_smarty_tpl->tpl_vars['smarty']->value['section']['checkin']['show'] = false;
} else
    $_smarty_tpl->tpl_vars['smarty']->value['section']['checkin']['total'] = 0;
if ($_smarty_tpl->tpl_vars['smarty']->value['section']['checkin']['show']):

            for ($_smarty_tpl->tpl_vars['smarty']->value['section']['checkin']['index'] = $_smarty_tpl->tpl_vars['smarty']->value['section']['checkin']['start'], $_smarty_tpl->tpl_vars['smarty']->value['section']['checkin']['iteration'] = 1;
                 $_smarty_tpl->tpl_vars['smarty']->value['section']['checkin']['iteration'] <= $_smarty_tpl->tpl_vars['smarty']->value['section']['checkin']['total'];
                 $_smarty_tpl->tpl_vars['smarty']->value['section']['checkin']['index'] += $_smarty_tpl->tpl_vars['smarty']->value['section']['checkin']['step'], $_smarty_tpl->tpl_vars['smarty']->value['section']['checkin']['iteration']++):
$_smarty_tpl->tpl_vars['smarty']->value['section']['checkin']['rownum'] = $_smarty_tpl->tpl_vars['smarty']->value['section']['checkin']['iteration'];
$_smarty_tpl->tpl_vars['smarty']->value['section']['checkin']['index_prev'] = $_smarty_tpl->tpl_vars['smarty']->value['section']['checkin']['index'] - $_smarty_tpl->tpl_vars['smarty']->value['section']['checkin']['step'];
$_smarty_tpl->tpl_vars['smarty']->value['section']['checkin']['index_next'] = $_smarty_tpl->tpl_vars['smarty']->value['section']['checkin']['index'] + $_smarty_tpl->tpl_vars['smarty']->value['section']['checkin']['step'];
$_smarty_tpl->tpl_vars['smarty']->value['section']['checkin']['first']      = ($_smarty_tpl->tpl_vars['smarty']->value['section']['checkin']['iteration'] == 1);
$_smarty_tpl->tpl_vars['smarty']->value['section']['checkin']['last']       = ($_smarty_tpl->tpl_vars['smarty']->value['section']['checkin']['iteration'] == $_smarty_tpl->tpl_vars['smarty']->value['section']['checkin']['total']);
?>
<tr>
	<?php if (!(1 & $_smarty_tpl->getVariable('smarty')->value['section']['checkin']['iteration'])){?><td rowspan=2 class="img_cell"><img src="/img/even.jpeg"></td><?php }?>
	<?php if ((1 & $_smarty_tpl->getVariable('smarty')->value['section']['checkin']['iteration'])){?><td rowspan=2 class="img_cell"><img src="/img/odd.jpeg"></td><?php }?>
	<td class="name_cell"><?php echo $_smarty_tpl->tpl_vars['checkinlist']->value[$_smarty_tpl->getVariable('smarty')->value['section']['checkin']['index']]['uname'];?>
 <?php echo $_smarty_tpl->tpl_vars['uname_suffix']->value;?>
</td>
	<td class="time_cell" colspan=2><?php echo $_smarty_tpl->tpl_vars['checkinlist']->value[$_smarty_tpl->getVariable('smarty')->value['section']['checkin']['index']]['location'];?>
<span style="font-size:0.8em;">(<?php echo $_smarty_tpl->tpl_vars['checkinlist']->value[$_smarty_tpl->getVariable('smarty')->value['section']['checkin']['index']]['checkintime'];?>
)</span></td>
</tr>
<tr>
	<td colspan=3 class="message_cell"><?php echo $_smarty_tpl->tpl_vars['checkinlist']->value[$_smarty_tpl->getVariable('smarty')->value['section']['checkin']['index']]['message'];?>
</td>
</tr>
<?php endfor; endif; ?>
</table>

</html><?php }} ?>