let sec_per_turn = 30;

let sec = 0;
let song_count = 0;
let poster_count = 1;
let answers;
let correct = 0;
let score = 0;
let f_packages = 1;
let m_packages = 1;
let gr_packages = 1;
let hardcore_level = 1;
let options;
let skill = '';
let rate = '';
let lang = '';
let year = '';
let genre = '';
let artist_type = '';
let audioPath = 'audio/ru/';
let imgPath = 'img/';
let finalMessage = '';
let modeToggle;
let setMedia;
let rightAnswer;
let toggleFlag = false;
let withoutAnswers = false;
let isSingle = true;
let audio;
let start_count_down = false;
let rating = [];
let songs_backup;
let overall;

function mirror(txt, speed = 20, color){
$('#mirror_txt').replaceWith( '<marquee id="mirror_txt" class="font text-center align-middle ' + color + '" direction="up" scrolldelay="1" scrollamount="' + speed + '" behavior="slide"><font id="road_text">' + txt + '</font></marquee>' );
}

function mirror_eval(txt, speed = 20, color){
$('#eval_txt').replaceWith( '<marquee id="eval_txt" class="font text-center align-middle ' + color + '" direction="up" scrolldelay="1" scrollamount="' + speed + '" behavior="slide"><font id="road_text">' + txt + '</font></marquee>' );
}

function choose(num){
	$('#pause').show();
	let answer = '';
	if(num){
		answer = options[num-1];
	} else {
		answer = $('#answer_input').val();
	}
	start_count_down = false;
	if(audio && audio.paused){
		audio.play();
	}
	modeToggle();
	let group = songs[song_count].group;
	let song = songs[song_count].song;
	let song_year = songs[song_count].year;
	if(!song_year) {
		song_year = '';
	} else {
		song_year = ' (' + song_year + ')';
	}
	if(answer.toUpperCase() == songs[song_count].group.toUpperCase()){
		mirror_eval(rightAnswer(song_year), 20, "green");
		$("#option_" + num).addClass("green");
		correct++;
		if (!~rate.indexOf('+ ' + group)){
			$('#rate').html(rate = '<br/>+ ' + group + rate);
		}
		$('#score').html(++score);
	} else {
		mirror_eval(rightAnswer(song_year), 20, "red");
		$("#option_" + num).addClass("red");
		$('#skill').html(skill = '<br/>- ' + group + '<br/>"' + song + '"' + song_year + skill);
	}
		toggleGameButton();
		next();
}

function rightAnswer_EN(){
	return songs[song_count].song;
}

function rightAnswer_RU(year){
	return songs[song_count].group + ' "' + songs[song_count].song + '"' + year;
}

function next(){
	if(song_count==songs.length-1){
		$('#song_count').html(song_count+1);
		$('#song').css("visibility", "hidden");
		$('#mirror').show();
		let overall = songs.length
		let percent = calculatePercent(correct,overall);
		let msg = 'Верно: ' + percent + '%('
		+ correct + '/' + overall + ').';
		let color = 'red';
		if(percent>=65){
			color = 'green';
			msg+=finalMessage; 
		} else{
			msg+=' Послушайте ещё песенок и попробуйте снова.'
		}
		mirror(msg, 20, color);
		emptyOptions();
		song_count=0;
		shuffle(songs);
	} else {
		$('#song_count').html(++song_count);
		toggleLearn();
	}
}

function calculatePercent(correct,overall){
	let num = correct/overall*100;
	return parseFloat(num).toFixed(0);
}

function toggle(){
	if($('#learn').is('[disabled]')){
		$('#learn').prop('disabled', false);
		$('.game_button').prop('disabled', true);
	} else {
		$('#learn').prop('disabled', true);
		$('.game_button').prop('disabled', false);
	}
}

function toggleLearn(){
	if($('#learn').is('[disabled]')){
		$('#learn').prop('disabled', false);
	} else {
		$('#learn').prop('disabled', true);
	}
}

function toggleGameButton(){
	if($('.game_button').is('[disabled]')){
		$('.game_button').prop('disabled', false);
	} else {
		$('.game_button').prop('disabled', true);
	}
}

let lang_letter;

function learn(){
	hide_navi_icons();
	if(withoutAnswers){
		$('.without_answers').show();
	} else {
		$('.answer').show();
	}
	$('#pause').hide();
	$('#back').hide();
	$('#package_content').hide();
	$('#answer_input').val('');
	decolorOptions();
	modeToggle();
	toggleLearn();
	toggleGameButton();
	randomAnswers();
	setMedia();
	count_down(sec_per_turn);
	$('#mirror').hide();
}

async function sec_15(){
	if(audio.paused){
		audio.play();
		count_down(15);
	} else {
		audio.currentTime += 15;
		if(time_left < 15){
			time_left = 15;
		}
	}
}

function song_pause() {
	if(audio.paused){
		audio.play();
	} else {
		audio.pause();
	}
}

let time_left = 0;
async function count_down(end){
	start_count_down = true;
	time_left = end;
	while(start_count_down && time_left-- > 0){
		await sleep(1000);
		if(isSingle){	
			$('#sec').html(new Intl.NumberFormat().format(sec+=1));
		} else if(isP1Turn) {
			$('#p1_sec').html(new Intl.NumberFormat().format(p1_sec+=1));
		} else {
			$('#p2_sec').html(new Intl.NumberFormat().format(p2_sec+=1));
		}
	}
	if(start_count_down){
		audio.pause();
	}
}

let time_min = 0;
async function count_time(){
	while(true){
		await sleep(60000);
		$('#min').html(++time_min);
	}
}

function time_toggle() {
	$('#sec_h2').toggle();
	$('#min_h2').toggle();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function decolorOptions(){
	for(let i = 1; i <= 4; i++){
		$("#option_" + i).removeClass("red");
		$("#option_" + i).removeClass("green");
	}
}

function setAudio(){
	if(audio){
		audio.pause();
	}
	if(!songs[song_count].audioPath){
		audio = new Audio(audioPath + songs[song_count].id + '.mp3');
	} else {
		audio = new Audio(songs[song_count].audioPath + '.mp3');
	}
	audio.play();
}

function randomAnswers(){
	options = [];
	let current_answers = answers;
	current_answers = removeDuplicates(current_answers);
	let correctAnswer = songs[song_count].group;
	options.push(correctAnswer);
	removeItemOnce(current_answers,correctAnswer);
	if(current_answers.length > 4){
		removeItemOnce(answers,correctAnswer);
	} else {
		current_answers = removeItemOnce(removeDuplicates(songs.map(item=>item.group)),correctAnswer);
	}
	shuffle(current_answers);
	options.push(current_answers[0]);
	options.push(current_answers[1]);
	options.push(current_answers[2]);
	shuffle(options);
	$('#option_1').html(options[0]);
	$('#option_2').html(options[1]);
	$('#option_3').html(options[2]);
	$('#option_4').html(options[3]);
}

function skipGroup(flag, group){
	group = group.replace("#", "'");
	if(!flag.checked){
		songs = jQuery.grep(songs, function(value) {
		  return value.group != group;
		});
		answers = songs.map(item=>item.group);
		$('#total').html(songs.length);
	} else {
		$('.group_item').prop('checked', true);
		songs = songs_backup;
		answers = songs.map(item=>item.group);
		$('#total').html(songs.length);
	}
}

function emptyOptions(){
	$('#option_1').html('');
	$('#option_2').html('');
	$('#option_3').html('');
	$('#option_4').html('');
}

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

function removeDuplicates(arr) {
	var uniqueValues = [];
	$.each(arr, function(i, el){
		if($.inArray(el, uniqueValues) === -1) uniqueValues.push(el);
	});
	return uniqueValues;
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function play_pause() {
   var mediaVideo = $("#song").get(0);
   if (mediaVideo.paused) {
       mediaVideo.play();
   } else {
       mediaVideo.pause();
  }
}

function toggleArtist(){
	if(toggleFlag){
		$('#artist').attr("src",  songs[song_count].imgPath + ".jpg");
		$('#artist').toggle();
	} else {
		toggleFlag = true;
	}
}

function load(){
	$('#answer_input').keypress(function (e) {
	  if (e.which == 13) {
		choose();
		return false;
	  }
	});	
	setup();
}

// RU songs
const ru_1990_m_icon = [
	'easy',
	'medium',
	'hard',
	'pop',
	'pop_2'
];

const RU_1990_M_PACK_1 = 1;
const RU_1990_M_PACK_2 = 2;
const RU_1990_M_PACK_3 = 3;
const RU_1990_M_PACK_4 = 4;
const RU_1990_M_PACK_5 = 5;

let ru_1990_m = [
		{
			pack : RU_1990_M_PACK_2,
			group : 'Кай Метов',
			song : 'Position №2',
			ignore: true
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Сергей Васюта',
			song : 'На белом покрывале января (ft. Сладкий Сон)'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Профессор Лебединский',
			song : 'Бегут года',
			state: ' по Профессору Лебединскому (ft. Русский Размер)',
			shorten: 'Лебединский',
			ignore : true
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Ярослав Евдокимов',
			song : 'Фантазёр',
			ignore : true
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Сергей Минаев',
			song : '22 притопа',
			state: ' по Минаеву',
			shorten: 'Минаев',
			ignore : true
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Леонид Агутин',
			song : 'Хоп-хей Лала Лэй'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Юрий Шатунов',
			song : 'Розовый вечер',
			ignore : true
		},
		{
			pack : RU_1990_M_PACK_2,
			group : "Алексей Глызин",
			song : 'Зимний сад'
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Михаил Шуфутинский',
			song : '3-е Сентября (1993)'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Сергей Васюта',
			song : 'Снег на розах (ft. Сладкий Сон)'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Леонид Агутин',
			song : 'Кого не стоило бы ждать'
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Михаил Шуфутинский',
			song : 'Пальма де Майорка (1997)'
		},
		{
			pack : RU_1990_M_PACK_5,
			group : 'Игорь Крутой',
			song : 'Незаконченный роман (ft Ирина Аллегрова)'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Вадим Казаченко',
			song : 'Белая метелица'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Вадим Казаченко',
			song : 'Больно мне, больно'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Вадим Казаченко',
			song : 'Жёлтые розы'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Игорь Тальков',
			song : 'Моя любовь'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Игорь Тальков',
			song : 'Я вернусь'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Игорь Тальков',
			song : 'Чистые пруды'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Егор Летов',
			song : 'Моя оборона'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Егор Летов',
			song : 'Всё идёт по плану'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Егор Летов',
			song : 'Далеко бежит дорога'
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Михаил Круг',
			song : 'Владимирский централ (1999)'
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Михаил Круг',
			song : 'Кольщик (1994)'
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Стас Михайлов',
			song : 'Тёмные глаза (1997)'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Стас Михайлов',
			song : 'Всё для тебя (2007)',
			ignore : true
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Александр Серов',
			song : 'Я люблю тебя до слёз',
			ignore : true
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Андрей Державин',
			song : 'Не плачь, Алиса (1991)'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Андрей Державин',
			song : 'Чужая свадьба (1991)'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Андрей Державин',
			song : 'Песня о первой любви (1993)'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Игорь Николаев',
			song : 'Выпьем за любовь',
			ignore : true
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Игорь Николаев',
			song : 'Такси (ft Наташа Королёва)',
			ignore : true
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Игорь Николаев',
			song : 'Старая Мельница',
			ignore : true
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Mr Credo',
			song : 'Медляк'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Mr Credo',
			song : 'Воздушный шар'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Оскар',
			song : 'Бег По Острию Ножа'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Оскар',
			song : 'Между мной и тобой'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Андрей Губин',
			song : 'Ночь',
			ignore : true
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Андрей Губин',
			song : 'Без тебя',
			ignore : true
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Андрей Губин',
			song : 'Милая моя далеко',
			ignore : true
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Влад Сташевский',
			song : 'Глаза чайного цвета'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Влад Сташевский',
			song : 'Вечерочки - вечерки'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Влад Сташевский',
			song : 'Девочка с перекрёсточка'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Дмитрий Маликов',
			song : 'Ты одна ты такая',
			ignore : true
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Дмитрий Маликов',
			song : 'Все вернется',
			ignore : true
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Дмитрий Маликов',
			song : 'Птицелов',
			ignore : true
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Шура',
			song : 'Холодная луна',
			ignore : true
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Шура',
			song : 'Don-don-don',
			ignore : true
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Евгений Осин',
			song : 'Иволга'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Евгений Осин',
			song : 'Попутчица'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Евгений Белоусов',
			song : 'Девчонка-девчоночка',
			ignore : true
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Евгений Белоусов',
			song : 'Алёшка',
			ignore : true
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Олег Газманов',
			song : 'Есаул'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Олег Газманов',
			song : 'Морячка'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Олег Газманов',
			song : 'Танцуй, пока молодой'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Валерий Леонтьев',
			song : 'Танго разбитых сердец'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Валерий Леонтьев',
			song : 'Девять хризантем'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Богдан Титомир',
			song : 'Делай как я'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Богдан Титомир',
			song : 'Ерунда'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Владимир Пресняков',
			song : 'Стюардесса по имени Жанна',
			ignore : true
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Владимир Пресняков',
			song : 'Замок из дождя',
			ignore : true
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Филипп Киркоров',
			song : 'Бегущая по волнам'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Филипп Киркоров',
			song : 'Зайка моя'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Филипп Киркоров',
			song : 'Мышь'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Игорь Корнелюк',
			song : 'Дожди',
			ignore : true
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Игорь Корнелюк',
			song : 'Пора домой',
			ignore : true
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Аркадий Укупник',
			song : 'Я на тебе никогда не женюсь'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Аркадий Укупник',
			song : 'Сим-Сим'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Гарик Сукачёв',
			song : 'Моя бабушка курит трубку (2002)',
			ignore : true
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Мурат Насыров',
			song : 'Я это ты'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Мурат Насыров',
			song : 'Мальчик хочет в Тамбов'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Валерий Меладзе',
			song : 'Девушки из высшего общества',
			ignore : true
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Владимир Кузьмин',
			song : 'Я не забуду тебя никогда'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Владимир Кузьмин',
			song : 'Моя любовь'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Владимир Кузьмин',
			song : 'Семь морей'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Григорий Лепс',
			song : 'Рюмка водки на столе (2002)',
			ignore : true
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Григорий Лепс',
			song : 'Самый лучший день (2011)',
			ignore : true
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Григорий Лепс',
			song : 'Натали (1995)'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Дельфин',
			song : 'Любовь'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Дельфин',
			song : 'Дверь'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Дельфин',
			song : 'Я буду жить'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Михей',
			song : 'Сука Любовь (ft Джуманджи)'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Михей',
			song : 'Мы Дети Большого Города (ft Джуманджи)'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Михей',
			song : 'Мы поплывем по волнам (ft Джуманджи)'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Николай Носков',
			song : 'Паранойя'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Николай Носков',
			song : 'Это здорово'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Николай Носков',
			song : 'Снег'
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Сергей Крылов',
			song : 'Девочка'
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Сергей Крылов',
			song : 'Осень-золотые листопады (ft Александр Добронравов)'
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Сергей Крылов',
			song : 'Короче, я звоню из Сочи'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Николай Трубач',
			song : 'Научись играть на гитаре'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Николай Трубач',
			song : 'Пять минут'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Борис Моисеев',
			song : 'Голубая луна (ft Николай Трубач)'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Николай Трубач',
			song : 'Адреналин'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Найк Борзов',
			song : 'Лошадка'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Найк Борзов',
			song : 'Верхом на звезде'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Найк Борзов',
			song : 'Три слова'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Сергей Чумаков',
			song : 'Жених'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Сергей Чумаков',
			song : 'От весны до весны'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Сергей Чумаков',
			song : 'Гадюка'
		},
		{
			pack : RU_1990_M_PACK_5,
			group : 'Игорёк',
			song : 'Подождём (1998)'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Вячеслав Быков',
			song : 'Любимая моя'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Вячеслав Быков',
			song : 'Я прихожу к тебе когда город спит'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Вячеслав Быков',
			song : 'Девочка Моя'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Игорь Саруханов',
			song : 'Скрипка-лиса'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Игорь Саруханов',
			song : 'Желаю тебе'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Александр Буйнов',
			song : 'Падают листья'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Александр Буйнов',
			song : 'Капитан Каталкин'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Александр Буйнов',
			song : 'Шансоньетка (ft Ирина Аллегрова)'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Максим Фадеев',
			song : 'Беги по небу (1997)'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Витас',
			song : 'Опера 2 (2001)',
			ignore : true
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Олег Пахомов',
			song : 'Белые лебеди',
			ignore : true
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Александр Иванов',
			song : 'Боже, какой пустяк (1997)'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Александр Иванов',
			song : 'Пуля (2022)',
			ignore : true
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Александр Иванов',
			song : 'Моя неласковая русь (1997)'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Гарик Сукачёв',
			song : 'За окошком месяц май (1996)'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Валерий Меладзе',
			song : 'Самба белого мотылька',
			ignore : true
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Алексей Глызин',
			song : 'Письма издалека'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Алексей Глызин',
			song : 'Пепел любви'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Шура',
			song : 'Отшумели летние дожди',
			ignore : true
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Александр Градский',
			song : 'Песня без названия'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Валерий Леонтьев',
			song : 'Кaждый xoчeт любить'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Никита',
			song : 'Улетели навсегда'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Никита',
			song : 'Однажды'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Никита',
			song : 'С неба ты сошла'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Игорь Саруханов',
			song : 'Парень с гитарой'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Mr Credo',
			song : 'Lambada'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Валерий Меладзе',
			song : 'Разведи огонь',
			ignore : true
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Александр Серов',
			song : 'Мадонна'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Александр Серов',
			song : 'Ворованная ночь'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Борис Моисеев',
			song : "Звёздочка"
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Борис Моисеев',
			song : "Чёрный бархат"
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Оскар',
			song : "Паноптикум"
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Александр Айвазов',
			song : "Бабочка-луна",
			ignore : true
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Леонид Агутин',
			song : 'Ты вернешься когда-нибудь снова'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Александр Барыкин',
			song : "За той рекой (1996)"
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Евгений Осин',
			song : 'Качка'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Владимир Маркин',
			song : "Я готов целовать песок (1991)"
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Вадим Усланов',
			song : "Танцы на воде"
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Вадим Усланов',
			song : "Ты сделана из огня"
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Вадим Усланов',
			song : "Не улетай"
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Павел Кашин',
			song : "Город (1992)"
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Владимир Маркин',
			song : "Домовой (1990)"
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Александр Кальянов',
			song : "Таганка (1990)"
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Александр Кальянов',
			song : "Всё, что было (1999)"
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Александр Кальянов',
			song : "Хрустнули огурчиком (1999)"
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Александр Новиков',
			song : "Шансоньетка (1995)"
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Александр Новиков',
			song : "Помнишь, девочка? (1996)"
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Александр Новиков',
			song : "Вези меня, извозчик (1991)"
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Александр Розенбаум',
			song : "Ау (1996)"
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Александр Розенбаум',
			song : "Гоп-стоп (1993)"
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Александр Розенбаум',
			song : "Братан (1999)"
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Беломорканал',
			song : "Разведённые мосты (1999)"
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Виктор Королев',
			song : "Пьяная Вишня (1998)"
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Вилли Токарев',
			song : "Массаж (1995)"
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Вилли Токарев',
			song : "Водочка (1993)"
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Григорий Лепс',
			song : 'Храни Вас Бог (1995)'
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Григорий Лепс',
			song : 'Не печалься, девочка моя (1995)'
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Ефрем Амирамов',
			song : 'Молодая (1994)'
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Иван Кучин',
			song : 'В таверне (1997)'
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Иван Кучин',
			song : 'Пройдут года (1996)'
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Иван Кучин',
			song : 'Обыкновенная (1998)'
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Лесоповал',
			song : 'Первый срок (1996)'
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Лесоповал',
			song : 'Я куплю тебе дом (1993)'
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Лесоповал',
			song : 'Столыпинский вагон (1992)'
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Михаил Гулько',
			song : 'Окурочек (1993)'
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Михаил Гулько',
			song : 'Мурка (1993)'
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Михаил Гулько',
			song : 'Не надо грустить, господа (1995)'
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Михаил Круг',
			song : 'Зек-рэп (1995)'
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Михаил Шелег',
			song : 'За тебя (За твои глаза карие) (1998)'
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Михаил Шелег',
			song : 'Америка, Европа (1997)'
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Михаил Шелег',
			song : 'Тихонечко так (1999)'
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Михаил Шуфутинский',
			song : 'За милых дам (1996)'
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Петлюра',
			song : 'Платье белое (1996)'
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Петлюра',
			song : 'Скорый поезд (1996)'
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Сергей Наговицын',
			song : 'Городские встречи (1993)'
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Сергей Наговицын',
			song : 'Потерянный край (1999)'
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Сергей Наговицын',
			song : 'Улица (1998)'
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Сергей Челобанов',
			song : 'Не обещай (1993)'
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Стас Михайлов',
			song : 'Разлука (1997)'
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Стас Михайлов',
			song : 'Мираж (1997)'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Максим Фадеев',
			song : 'Сестричка (1997)'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Вадим Байков',
			song : 'Золотая рыбка (1997)'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Вадим Байков',
			song : 'На Ордынке (1997)'
		},
		{
			pack : RU_1990_M_PACK_5,
			group : 'Валерий Залкин',
			song : 'Одинокая ветка сирени (1997)'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : "Веня Д'ркин",
			song : 'Кошка (1996)'
		},
		{
			pack : RU_1990_M_PACK_5,
			group : 'Виктор Чайка',
			song : 'Дорогая женщина (1995)'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Игорь Силиверстов',
			song : 'Шпана (1990)'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Игорь Силиверстов',
			song : 'Санта Лючия (1991)'
		},
		{
			pack : RU_1990_M_PACK_5,
			group : 'Александр Шевченко',
			song : 'Будет всё, как ты захочешь (ft Дежа-вю) (1997)'
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Александр Дюмин',
			song : 'Друзья (1999)'
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Александр Дюмин',
			song : 'Люберцы (1999)'
		},
		{
			pack : RU_1990_M_PACK_4,
			group : 'Геннадий Жаров',
			song : 'Ушаночка (1992)'
		}
];

let ru_1990_m_1 =	ru_1990_m.filter(item => item.pack == 1);
let ru_1990_m_2 =	ru_1990_m.filter(item => item.pack == 2);
let ru_1990_m_3 =	ru_1990_m.filter(item => item.pack == 3);
let ru_1990_m_4 =	ru_1990_m.filter(item => item.pack == 4);
let ru_1990_m_5 =	ru_1990_m.filter(item => item.pack == 5);


let music = [
	{
		arr: ru_1990_m,
		lang: 'ru',
		year: '1990',
		type: 'm',
		packs: [
				{
					arr: ru_1990_m_1,
					name: 'RU 1990s Male: Easy',
				},
				{
					arr: ru_1990_m_2,
					name: 'RU 1990s Male: Medium',
				},
				{
					arr: ru_1990_m_3,
					name: 'RU 1990s Male: Hard',
				},
				{
					arr: ru_1990_m_4,
					name: 'RU 1990s Male: Chanson',
				},
				{
					arr: ru_1990_m_5,
					name: 'RU 1990s Male: One Hit Wonders',
				}
			]
	}
]

let songs_to_map;
let mapping_result;
function map_songs(){
	back = back_to_current_pack;
	$('.package').hide();
	$('#mirror').hide();
	$('#map').hide();
	$('#package_content').hide();
	$('#sec_15_hist').show();
	$('#mapping_content').show();
	toggleLearn();
	for(var j=0; j < music.length; j++){
		music[j].arr = generateSongIdsWithPrefix(music[j].arr, music[j].lang, 
												music[j].year, music[j].type);
	}
	showMapping(0, "en_2000_gr", "gr");
}

function select_mapping_button(suffix, type){
	$('.gr').attr('src', 'img/chart/gr.png');
	$('.m').attr('src', 'img/chart/m.png');
	$('.f').attr('src', 'img/chart/f.png');
	let selected = 'img/chart/' + type + '_selected.png';
	$('#btn_' + suffix).attr('src', selected);
}

function showMapping(index, suffix, type){
	select_mapping_button(suffix, type);
	mapping_result = '';
	let h1_start = `<h1>`;
	let h1_end = `</h1>`;
	let br = `<br/>`;
	let hr = `<hr/>`;
	for(var j=0; j < music[index].packs.length; j++){
		mapping_result += h1_start + music[index].packs[j].name + h1_end;
		mapping_result += map_songs_format(music[index].packs[j].arr);
		mapping_result += br + hr;
	}
	$('#mapping_content').html(mapping_result);
}

function generateSongIdsWithPrefix(arr, lang, year, type){
	let prefix = lang + '_' + year + '_' + type + '_';
	let audioPath = 'audio/' + lang + '/' + year + '/' + type + '/';
	let imgPath = 'img/' + lang + '/' + year + '/' + type + '/';
	let id;
	for(var i=1; i <= arr.length; i++){
		id = 'Song (' + i + ')';
		arr[i-1].id = prefix + id;
		arr[i-1].audioPath = audioPath + id;
		arr[i-1].imgPath = imgPath + arr[i-1].group;
	}
	return arr;
}

function generateSongIdsByPaths(arr, audioPath, imgPath){
	for(var i=1; i <= arr.length; i++){
		arr[i-1].id = 'Song (' + i + ')';
		arr[i-1].audioPath = audioPath + 'Song (' + i + ')';
		arr[i-1].imgPath = imgPath + arr[i-1].song;
	}
	return arr;
}

function generateSongIdsImgGroup(arr, audioPath, imgPath){
	for(var i=1; i <= arr.length; i++){
		arr[i-1].id = 'Song (' + i + ')';
		arr[i-1].audioPath = audioPath + 'Song (' + i + ')';
		arr[i-1].imgPath = imgPath + arr[i-1].group;
	}
	return arr;
}

function generatePathsBySongName(arr, audioPath, imgPath){
	for(var i=1; i <= arr.length; i++){
		arr[i-1].audioPath = audioPath + arr[i-1].group;
		arr[i-1].imgPath = imgPath + arr[i-1].song;
	}
	return arr;
}

function map_songs_format(arr){
	arr = arr.filter(song => !song.ignore);
	let h2_start = `<h2 style='margin-bottom: -20px;'>`;
	let h2_end = `</h2>`;
	let h3_start = `<h3 style='font-family: serif; margin-left: 30px;' >`;
	let h3_end = `</h3>`;
	let div_start = `<div>`;
	let div_end = `</div>`;
	let br = `<br/>`;
	//let img_start = `<img width="300" height="300" src="`;
	let img_end = `.jpg" />`;
	let img_play_start = `<img class='pointer onhover' width="30" height="30" src="img/navi/play.png" onclick="playSong('`;
	let img_play_middle = `')" id='`;
	let img_play_end = `'" />`;
	let space = '&nbsp;';
	songs_to_map = arr.sort((a,b) => (a.group > b.group) ? 1 : ((b.group > a.group) ? -1 : 0));
	let curr_group = songs_to_map[0].group;
	//let result = img_start + songs_to_map[0].imgPath + img_end + br
	let result = h2_start + curr_group + ':' + h2_end + h3_start;
	let id;
	for(let i = 0; i < songs_to_map.length; i++){
		id = songs_to_map[i].id.replace(' ', '_').replace('(', '').replace(')', '');
		if(curr_group != songs_to_map[i].group){
			curr_group = songs_to_map[i].group;
			result += h3_end + h2_start + songs_to_map[i].group + ':' + h2_end 
			+ h3_start + songs_to_map[i].song + space
			+ img_play_start + songs_to_map[i].audioPath + "', '" + id
			+ img_play_middle + id + img_play_end + div_end;
		} else {
			result += div_start + songs_to_map[i].song + space
			+ img_play_start + songs_to_map[i].audioPath + "', '" + id 
			+ img_play_middle + id + img_play_end
			+ div_end;
		}
	}
	result += h3_end;
	return result;
}

let last_song_id;
let is_playing = false;
function playSong(audioPath, id){
	if(id == last_song_id){
		if(is_playing){
			audio.pause();
			$('#' + id).attr('src', 'img/navi/play.png');
			is_playing = false;
		} else {
			audio.play();
			$('#' + id).attr('src', 'img/navi/pause.png');
			is_playing = true;
		}
	} else {
		if(audio){
			audio.pause();
		}
		$('#' + last_song_id).attr('src', 'img/navi/play.png');
		last_song_id = id;
		is_playing = true;
		$('#' + id).attr('src', 'img/navi/pause.png');
		audio = new Audio(audioPath + '.mp3');
		audio.play();
	}
}

function getGroupNamesSorted(){
	let group_names = removeDuplicates(songs.map(item=>item.group)).sort();
	return group_names;
}

function showGroupNames(){
	songs_backup = songs;
	let group_names = getGroupNamesSorted();
	
	let tag_1 = `<h3><label class='checkbox-google'><input class='group_item' checked id='group_`;
	let tag_2 = `' type='checkbox' onchange='skipGroup(this,"`;
	let tag_3 = `");'><span class='checkbox-google-switch'></span></label> `;
	let tag_4 =	`</h3>`;
	let result = '';
	for(let i = 0; i < group_names.length; i++){
		result += tag_1 + i + tag_2 + group_names[i].replace("'", "#") + tag_3 + group_names[i] + tag_4;
	}
	$('#package_content').html(result);
	$('#package_content').show();
	toggleLearn();
}

function hide_navi_icons(){
	$('#map').hide();
	$('#mirror').hide();
	$('.settings').hide();
	
	$('#sec_15').show();
	$('#back').show();
}

let gr_package_names = [];
let package_names;

function show_packages(num){
	for(var i=1; i <= num; i++){
		if(package_names[i-1]){
			$('#package_' + i).attr("src", 'img/package/' + package_names[i-1] + ".png");
		} else {
			$('#package_' + i).attr("src", 'img/package/' + i + ".png");
		}
		$('#package_' + i).show();
	}
}

function package_num(num){
	$('#current_pack').show();
	$('#current_pack').attr('src', $('#package_' + num).attr('src'));
	$('.package').hide();
	setPathsByPack(num);
	showGroupNames();
}

function setPaths(artist_type, package_num, genre){
		let songs_str = lang + '_' + year;
			audioPath = 'audio/' + lang + '/' + year + '/';
			imgPath = 'img/' + lang + '/' + year + '/';
		if(genre){
			songs_str += '_' + genre;
			audioPath += genre + '/';
			imgPath += genre + '/';
		}
		if(artist_type){
			songs_str += '_' + artist_type;
			audioPath += artist_type + '/';
			imgPath += artist_type + '/';
		}
		if(package_num){
			songs_str += '_' + package_num;
			audioPath += package_num + '/';
			imgPath += package_num + '/';
		}
		songs = generateSongIds(eval(songs_str));
		answers = songs.map(item=>item.group);
		finalMessage = ' Ура! Вы освоили "Дискотеку ' + year + '-х"!';
		$('#total').html(songs.length);
		shuffle(songs);
}

function setPathsByPack(num){
	let arr = generateSongIds(eval(lang + '_' + year + '_' + artist_type));
	songs = arr.filter(song => song.pack == num && !song.ignore);
	songs.forEach(song => {
		song.audioPath = 'audio/' + lang + '/' + year + '/' + artist_type + '/' + song.id;
		song.imgPath = 'img/' + lang + '/' + year + '/' + artist_type + '/' + song.group;
	});
	finalMessage = ' Ура! Вы освоили "Дискотеку ' + year + '-х"!';
	$('#total').html(songs.length);
	shuffle(songs);
}
	
function setMusicalAlphabet(){
	let result = [];
	let arr = generateSongIds(eval(lang + '_' + year + '_gr'));
	let arr_pack;
	audioPath = 'audio/' + lang + '/' + year + '/gr/';
	imgPath = 'img/' + lang + '/' + year + '/gr/';
	for(let i = 1; i <= gr_packages; i++){
		arr_pack = arr.filter(song => song.pack == i);
		arr_pack = setMusicalAlphabetPack(arr_pack, 'Группа', audioPath, imgPath);
		shuffle(arr_pack);
		result.push(arr_pack.slice(0, 7));
	}
	arr = generateSongIds(eval(lang + '_' + year + '_m'));
	audioPath = 'audio/' + lang + '/' + year + '/m/';
	imgPath = 'img/' + lang + '/' + year + '/m/';
	for(let i = 1; i <= m_packages; i++){
		arr_pack = arr.filter(song => song.pack == i);
		arr_pack = setMusicalAlphabetPack(arr_pack, 'Исполнитель', audioPath, imgPath);
		shuffle(arr_pack);
		result.push(arr_pack.slice(0, 7));
	}
	arr = generateSongIds(eval(lang + '_' + year + '_f'));
	audioPath = 'audio/' + lang + '/' + year + '/f/';
	imgPath = 'img/' + lang + '/' + year + '/f/';
	for(let i = 1; i <= f_packages; i++){
		arr_pack = arr.filter(song => song.pack == i);
		arr_pack = setMusicalAlphabetPack(arr_pack, 'Исполнительница', audioPath, imgPath);
		shuffle(arr_pack);
		result.push(arr_pack.slice(0, 7));
	}
	result = result.flat();
	shuffle(result);
	songs = result.slice(0, 20);
	answers = songs.map(item=>item.group);
	finalMessage = ' Ура! Вы освоили "Дискотеку ' + year + '-х"!';
	$('#total').html(songs.length);
	showGroupNames();
}
	
function setMusicalAlphabetPack(arr, type, audioPath, imgPath){
	shuffle(arr);
	arr = arr.sort((a,b) => (a.group > b.group) ? 1 : ((b.group > a.group) ? -1 : 0));
	let group = arr[0].group;
	let result = [];
	result.push(arr[0]);
	for(let i = 1; i < arr.length; i++){
		if(group == arr[i].group){
			continue;
		} else {
			group = arr[i].group;
			result.push(arr[i]);
		}
	}
	result.forEach(song => {
		song.letter = Array.from(song.group)[0];
		song.type = type;
		song.audioPath = audioPath + song.id;
		song.imgPath = imgPath + song.group;
	});
	return result;
}

function generateSongIds(arr){
	for(var i=1; i <= arr.length; i++){
		arr[i-1].id = 'Song (' + i + ')';
	}
	return arr;
}

let back;
let expressMode = false;
let generateSongs;
let generateArr;
let generateAudioPath;
let generateImgPath;

function setup(){
	lang = 'ru';
	year = '1990';
	artist_type = 'm';
	modeToggle = toggleArtist;
	setMedia = setAudio;
	rightAnswer = rightAnswer_RU;
	count_time();
	package_names = ru_1990_m_icon;
	show_packages(package_names.length);
	document.body.scrollTop = document.documentElement.scrollTop = 0;
	useUrlParam();
}

let pack_num;
let year_url = 'https://sunquiz.netlify.app/1990';

function useUrlParam() {
	var url_string = window.location.href; 
	var url = new URL(url_string);
	pack_num = url.searchParams.get("pack");
	if(pack_num){
		package_num(pack_num);
	}
	back = back_to_browser;
}

function back_to_browser(){
	window.location.href = year_url;
}

function back_to_current_pack(){
	back = back_to_browser;
	$('#mapping_content').hide();
	$('#sec_15_hist').hide();
	song_stop();
	$('#map').show();
	package_num(pack_num);
}

function song_stop() {
	if(audio){
		audio.pause();
		audio = null;
	}
}