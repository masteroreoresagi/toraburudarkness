//
// CrSaveTimeValue.js
//
// 作者：美波鶴香
//
// 更新履歴：2017/06/11 v1.0
// 　　　　　2017/06/12 v1.1　時刻のゼロ埋め処理追加
// 　　　　　2017/06/13 v1.1　ヘルプを修正
// 　　　　　2017/06/22 v1.2　@typeの設定
//
/*:
 * @plugindesc セーブ時刻を記録する＋現在時刻の取得
 * ＋オートセーブコマンド＋セーブ時に変数を操作
 * @author 美波鶴香
 *
 * @param STSwitch
 * @type switch
 * @desc 処理に使うスイッチの番号
 * ※ゲーム内では使用しないでください
 * @default 10
 *
 * @param SaveTime
 * @type variable
 * @desc 日時を記録する変数
 * ※文字列が入ります
 * @default 1
 *
 * @param Looks
 * @type number
 * @desc セーブ日時の表記
 * 1～4
 * @default 1
 *
 * @param STYear
 * @type variable
 * @desc 年を記録する変数
 * @default 0
 *
 * @param STMonth
 * @type variable
 * @desc 月を記録する変数
 * @default 0
 *
 * @param STDate
 * @type variable
 * @desc 日を記録する変数
 * @default 0
 *
 * @param STHour
 * @type variable
 * @desc 時を記録する変数
 * @default 0
 *
 * @param STMinutes
 * @type variable
 * @desc 分を記録する変数
 * @default 0
 *
 * @param SaveSound
 * @type number
 * @desc オートセーブ時にSEを鳴らすかどうか
 * Off=0,On=1,指定SEを利用=2
 * @default 1
 *
 * @param SaveSE
 * @type file
 * @require 1
 * @dir audio/se
 * @desc オートセーブ成功時のSE名
 * 有効にするにはSaveSoundを2にしてください
 * @default Save
 *
 * @param STVvalue
 * @type variable
 * @desc セーブ直前にいじる変数
 * 0にすると無効
 * @default 2
 *
 * @param STsetValue
 * @desc STVvalueの操作内容
 * 現状では特定の数値を代入するしかできない
 * @default 0
 *
 * @help 
 * セーブした日時を変数に記録することができます。
 * プラグインコマンドからプレイ中の現在時刻を変数に入れることもできます。
 * この日時はプレイヤーのデバイスの時刻を参照します。
 * セーブファイルに変数を表示できるプラグインと併用するのにいいと思います。
 * （本当はこのプラグインで表示もさせたいけど難しそうだから諦めた。）
 * 他プラグインと併用するといいと言うのに、競合しそうな書き方してます。
 * （Scene_Save.prototype.onSavefileOkを直接書き換えてます）
 * JS未勉強の素人が書いたんだから仕方ないね？
 * …よい方法がわかったら直します。たぶん。
 * 
 * セーブ直前に変数をひとつ操作することができます。
 * これはくらむぼんさんのTimeEventプラグインを利用していて
 * プレイしていない間だけ変数を加算したいと思った時とかに使える機能です。
 * ( TimeEvent https://krmbn0576.github.io/rpgmakermv/homepage.html )
 * ロード時にスイッチをONにしたりコモンイベントを起こす別のプラグインも
 * 必要と思います。トリアコンタンさんが素敵なプラグインを公開しておられます。
 * ( https://triacontane.blogspot.jp/ )
 *
 * あと、オートセーブのためのコマンドも作りました。
 * 他の方のオートセーブのコマンドを使うとセーブ時刻を記録できないと思います。
 * ので、こちらのコマンドを利用するようにしてください。
 *
 * ☆プラグインパラメータ
 * 　STSwitch…処理に使うスイッチ番号を一つ指定してください（1以上の整数）
 * 　　　　　　指定したスイッチはゲーム内で操作しないように気を付けてください。
 * 　　　　　　デフォルトではスイッチ#0010が指定されています。
 * 　　　　　　オートセーブを使わない場合は0にして大丈夫です。
 * 　SaveTime…日時を記録する変数を指定できます。
 * 　　　　　　文字列を代入するので、ゲーム内で参照するときには注意してください。
 * 　　　　　　0にすると、記録しなくなります。
 * 　Looks…SaveTimeで指定した変数に入れる日時の形式を選択できます。
 * 　　　　 1=xxxx/xx/xx xx:xx
 * 　　　　 2=xxxx年xx月xx日xx時xx分
 * 　　　　 3=xx/xx xx:xx
 * 　　　　 4=xx月xx日xx時xx分
 * 　STYear等…記録された日時の要素のみを記録する変数を指定できます。
 * 　　　　　　数値のみを記録します。
 * 　　　　　　デフォルトの0だと記録しません。
 * 　　　　　　SaveTimeが0でも記録できます。
 * 　SaveSound…オートセーブの時にセーブ成功SEを鳴らすかどうかを設定できます。
 * 　　　　　　 1にするとシステムで設定しているセーブSEを鳴らします。
 * 　　　　　　 2にするとSaveSEで指定したファイル名のSEを再生します。
 * 　　　　　　 0にしていても失敗時のブザーは鳴ります。
 * 　SaveSE…SEの演奏で表示されているファイル名を半角で記入してください。
 * 　　　　　SaveSoundが2の時にオートセーブを実行(セーブ成功)すると、
 * 　　　　　ここで指定したSEが再生されます。
 * 　　　　　音量やピッチの調整コマンドを用意していないので、変えたい場合は
 * 　　　　　直接プラグインの中身を書き換えてください。
 * 　　　　　また、ここで指定したSEはデプロイメント時に除外される可能性があります。
 * 　　　　　audio>seフォルダを確認して、コピーされていないようだったら
 * 　　　　　手動でm4aファイルとoggファイルをコピペしてください。
 * 　STVvalue…セーブの直前に操作する変数をひとつ指定できます。
 * 　　　　　　1以上を指定で機能が有効になります。
 * 　　　　　プラグインファイル内の★セーブ直前に操作するマン★にスクリプトを
 * 　　　　　書き加えると複数の変数やスイッチを操作することもできます。
 * 　　　　　加減乗除等の計算結果を代入をするのもここで実装できます。
 * 　STsetValue…上記で指定した変数に代入する数値を指定します。
 *
 * ☆プラグインコマンド
 * 　CrSTV save　…オートセーブの処理ができます。
 * 　　　　　　　　最後にセーブorロードしたファイルに上書きします。
 * 　　　　　　　　該当するファイルがない場合は未使用の一番若い番号の
 * 　　　　　　　　ファイルに上書きセーブをします。
 * 　CrSTV time　…現在時刻を取得できます。
 * 　　　　　　　　セーブ時刻と同じ変数に代入されます。
 * 　プラグインコマンドの先頭に空白を入れないでください。
 * 　プラグインコマンドの隙間は半角スペースひとつです。
 *
 * よく理解してないけどMITライセンスというやつです。
 * http://opensource.org/licenses/mit-license.php
 *
 * このプラグインを作ったのはJS未勉強のど素人です。
 * 不具合とかあっても対応できるとは限りません。
 * 自分の環境で使えたらそれでいいんじゃいってな気持ちで作ってますのであしからず。
 *
 * 　美波鶴香（☆鶴香★ https://twitter.com/papipupeponnu0 ）
 * このプラグインの制作にあたって神無月サスケ様にアドバイスをいただきました。
 * また、その他にも公開されているプラグインや講座を参考にさせていただいた方が
 * たくさんいます！この場をかりて御礼申し上げます。
 *
 * ★わたしがお世話になっているセーブファイルに変数を表示できるプラグイン
 * TMSabeDataLabel.js セーブデータラベル tomoaky 様
 * 　http://hikimoki.sakura.ne.jp/plugin/plugin_menu.html#TMSaveDataLabel
 * 　- ひきも記は閉鎖しました。
 * 　ひとこと：シンプルでとても使いやすいです。
 * BB_CustomSaveWindow.js セーブウィンドウ改造プラグイン ビービー 様
 * 　http://bb-entertainment-blog.blogspot.jp/2016/11/blog-post_27.html
 * 　- BB ENTERTAINMENT BLOG
 * 　ひとこと：見た目がお洒落。上記プラグインより項目が沢山あって便利です。
 * 　
 */

(function(){

 //★プラグインパラメータを読み取るやつ★
 var CrParameters = PluginManager.parameters('CrSaveTimeValue');
 var STswitch = Number(CrParameters['STSwitch'])||10;
 var STvalue = Number(CrParameters['SaveTime'])||0;
 var STview = Number(CrParameters['Looks'])||1;
 var STYear = Number(CrParameters['STYear'])||0;
 var STMonth = Number(CrParameters['STMonth'])||0;
 var STDate = Number(CrParameters['STDate'])||0;
 var STHour = Number(CrParameters['STHour'])||0;
 var STMinutes = Number(CrParameters['STMinutes'])||0;
 var STsound = Number(CrParameters['SaveSound'])||0;
 var SaveSE = String(CrParameters['SaveSE'])||'save';
 var STVvalue = Number(CrParameters['STVvalue'])||0;
 var STset = Number(CrParameters['STsetValue'])||0;

 var Cr_SaveTime = {};
 
 //★桁揃えるマン★
 Cr_SaveTime.padding = function( N ,L ){
 	 return ( Array( L ).join('0') + N ).slice( -L );
 }
 
 //★デバイスの現在時刻を読み取って変数に入れるマン★
 Cr_SaveTime.getTime = function(){

    var STime = 0;
	
	var timeget = new Date();
	var Year = timeget.getFullYear();
	var Month = timeget.getMonth() + 1;
	var Month0 = Cr_SaveTime.padding(Month,2);
	var Dates = timeget.getDate();
	var Date0 = Cr_SaveTime.padding(Dates,2);
	var hour = timeget.getHours();
	var Hour = Cr_SaveTime.padding(hour,2);
	var minutes = timeget.getMinutes();
	var Minutes = Cr_SaveTime.padding(minutes,2);

	if(STYear > 0){
		$gameVariables.setValue(STYear,Year);
	}
	if(STMonth > 0){
		$gameVariables.setValue(STMonth,Month);
	}
	if(STDate > 0){
		$gameVariables.setValue(STDate,Dates);
	}
	if(STHour > 0){
		$gameVariables.setValue(STHour,hour);
	}
	if(STMinutes > 0){
		$gameVariables.setValue(STMinutes,minutes);
	}
	if(STview === 1){
	  var STime = Year+'/'+Month0+'/'+Date0+'\t'+Hour+':'+Minutes;
	}
	if(STview === 2){
	  var STime = Year+'年'+Month+'月'+Dates+'日'+hour+'時'+minutes+'分';
	}
	if(STview === 3){
	  var STime = Month0+'/'+Date0+'\t'+Hour+':'+Minutes;
	}
	if(STview === 4){
	  var STime = Month+'月'+Dates+'日'+hour+'時'+minutes+'分';
	}
	if(STvalue > 0){
	 $gameVariables.setValue(STvalue,STime);
	}
	return STime;
 };

 //★セーブ直前に操作するマン★
 Cr_SaveTime.setValue = function(){
    //ここに書き加えればセーブの時にいろいろできる
    if(STVvalue > 0){
     $gameVariables.setValue(STVvalue,STset);
    }
 };

 //★オートセーブするマン★
 Cr_SaveTime.AutoSave = function(){
   
    if($gameSwitches.value(STswitch)){
	  //ロード時
      $gameSwitches.setValue(STswitch,false);
	  return;
	}else{
	  //セーブ時
	  $gameSwitches.setValue(STswitch,true);
      Cr_SaveTime.getTime();
	  Cr_SaveTime.setValue();

      $gameSystem.onBeforeSave();
      if (DataManager.saveGame(DataManager.lastAccessedSavefileId())) {
        if(STsound === 1){
		 SoundManager.playSave();
		}
        if(STsound === 2){
		 AudioManager.playSe({"name":SaveSE,"volume":90,"pitch":100,"pan":0});//オートセーブ成功SEの再生はココ☆彡
		}
		 StorageManager.cleanBackup(DataManager.lastAccessedSavefileId());
      } else {
		//if(STsound === 1){
		 SoundManager.playBuzzer();
		//}
      }	
	}
	$gameSwitches.setValue(STswitch,false);
 };

 //★セーブファイル選択してセーブする時★//こいつ直接書き換えてるから注意
 Scene_Save.prototype.onSavefileOk = function() {

    Scene_File.prototype.onSavefileOk.call(this);
	
	//この2行を書き足してるだけ。
	Cr_SaveTime.getTime();
	Cr_SaveTime.setValue();

    $gameSystem.onBeforeSave();
    if (DataManager.saveGame(this.savefileId())) {
        this.onSaveSuccess();
    } else {
        this.onSaveFailure();
    }
 };
  
 //★プラグインコマンドを読み取るやつ★
 var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
 Game_Interpreter.prototype.pluginCommand = function(command, args) {
   _Game_Interpreter_pluginCommand.call(this, command, args);
   if(command == 'CrSTV'){
   	   if(args[0] == 'save'){
		   Cr_SaveTime.AutoSave();
	   }
   	   if(args[0] == 'time'){
		   Cr_SaveTime.getTime();
	   }
   }
 }
})();