extends Node

signal language_changed(new_lang_code)

# Danh sách 10 quốc gia và thị trường game lớn nhất
const LANGUAGES = [
	{"code": "en", "name": "English", "flag": "🇺🇸"},
	{"code": "vi", "name": "Tiếng Việt", "flag": "🇻🇳"},
	{"code": "ja", "name": "日本語", "flag": "🇯🇵"},
	{"code": "ko", "name": "한국어", "flag": "🇰🇷"},
	{"code": "zh_CN", "name": "简体中文", "flag": "🇨🇳"},
	{"code": "es", "name": "Español", "flag": "🇪🇸"},
	{"code": "pt_BR", "name": "Português", "flag": "🇧🇷"},
	{"code": "de", "name": "Deutsch", "flag": "🇩🇪"},
	{"code": "fr", "name": "Français", "flag": "🇫🇷"},
	{"code": "ru", "name": "Русский", "flag": "🇷🇺"}
]

var current_lang_index: int = 0
var current_lang: String = "en"

var translations: Dictionary = {
	"KEY_TITLE": {
		"en": "CLUCK & DROP", "vi": "CLUCK & DROP", "ja": "CLUCK & DROP", "ko": "CLUCK & DROP",
		"zh_CN": "CLUCK & DROP", "es": "CLUCK & DROP", "pt_BR": "CLUCK & DROP", "de": "CLUCK & DROP",
		"fr": "CLUCK & DROP", "ru": "CLUCK & DROP"
	},
	"KEY_SUBTITLE": {
		"en": "BUNKER BUSTER 60 LEVELS",
		"vi": "CHIẾN DỊCH 60 MÀN HẦM NGỤC",
		"ja": "地下バンカーバスター 60ステージ",
		"ko": "지하 벙커 버스터 60레벨",
		"zh_CN": "地下地堡破坏者 60关",
		"es": "DESTRUCTOR DE BÚNKER 60 NIVELES",
		"pt_BR": "DESTRUIDOR DE BUNKER 60 FASES",
		"de": "BUNKER-BRECHER 60 LEVEL",
		"fr": "CASSEUR DE BUNKER 60 NIVEAUX",
		"ru": "БУНКЕР БАСТЕР 60 УРОВНЕЙ"
	},
	"KEY_PLAY": {
		"en": "▶ PLAY NOW", "vi": "▶ CHƠI NGAY", "ja": "▶ プレイ", "ko": "▶ 지금 플레이",
		"zh_CN": "▶ 开始游戏", "es": "▶ JUGAR AHORA", "pt_BR": "▶ JOGAR AGORA", "de": "▶ JETZT SPIELEN",
		"fr": "▶ JOUER", "ru": "▶ ИГРАТЬ"
	},
	"KEY_SELECT_LEVEL": {
		"en": "🗺️ SELECT LEVEL", "vi": "🗺️ CHỌN MÀN", "ja": "🗺️ ステージ選択", "ko": "🗺️ 레벨 선택",
		"zh_CN": "🗺️ 选择关卡", "es": "🗺️ SELECCIONAR NIVEL", "pt_BR": "🗺️ SELECIONAR FASE",
		"de": "🗺️ LEVEL WÄHLEN", "fr": "🗺️ CHOISIR NIVEAU", "ru": "🗺️ ВЫБОР УРОВНЯ"
	},
	"KEY_SOUND_ON": {
		"en": "🔊 ON", "vi": "🔊 BẬT", "ja": "🔊 オン", "ko": "🔊 켜짐",
		"zh_CN": "🔊 开启", "es": "🔊 SÍ", "pt_BR": "🔊 LIGADO", "de": "🔊 AN",
		"fr": "🔊 OUI", "ru": "🔊 ВКЛ"
	},
	"KEY_SOUND_OFF": {
		"en": "🔇 OFF", "vi": "🔇 TẮT", "ja": "🔇 オフ", "ko": "🔇 꺼짐",
		"zh_CN": "🔇 关闭", "es": "🔇 NO", "pt_BR": "🔇 DESLIGADO", "de": "🔇 AUS",
		"fr": "🔇 NON", "ru": "🔇 ВЫКЛ"
	},
	"KEY_LEVEL": {
		"en": "🏰 LEVEL %d", "vi": "🏰 MÀN %d", "ja": "🏰 ステージ %d", "ko": "🏰 레벨 %d",
		"zh_CN": "🏰 关卡 %d", "es": "🏰 NIVEL %d", "pt_BR": "🏰 FASE %d", "de": "🏰 LEVEL %d",
		"fr": "🏰 NIVEAU %d", "ru": "🏰 УРОВЕНЬ %d"
	},
	"KEY_SCORE": {
		"en": "SCORE: %d", "vi": "ĐIỂM: %d", "ja": "スコア: %d", "ko": "점수: %d",
		"zh_CN": "得分: %d", "es": "PUNTOS: %d", "pt_BR": "PONTOS: %d", "de": "PUNKTE: %d",
		"fr": "SCORE : %d", "ru": "ОЧКИ: %d"
	},
	"KEY_VICTORY": {
		"en": "🎉 BUNKER DESTROYED! 🎉", "vi": "🎉 SẬP HẦM THÀNH CÔNG! 🎉",
		"ja": "🎉 バンカー壊滅成功! 🎉", "ko": "🎉 벙커 파괴 성공! 🎉",
		"zh_CN": "🎉 地堡摧毁成功! 🎉", "es": "🎉 ¡BÚNKER DESTRUIDO! 🎉",
		"pt_BR": "🎉 BUNKER DESTRUÍDO! 🎉", "de": "🎉 BUNKER ZERSTÖRT! 🎉",
		"fr": "🎉 BUNKER DÉTRUIT ! 🎉", "ru": "🎉 БУНКЕР УНИЧТОЖЕН! 🎉"
	},
	"KEY_FINAL_SCORE": {
		"en": "Total Score: %d", "vi": "Tổng Điểm: %d", "ja": "合計スコア: %d", "ko": "최종 점수: %d",
		"zh_CN": "总得分: %d", "es": "Puntos Totales: %d", "pt_BR": "Pontuação Total: %d",
		"de": "Gesamtpunktzahl: %d", "fr": "Score Total : %d", "ru": "Итоговые Очки: %d"
	},
	"KEY_NEXT_LEVEL": {
		"en": "NEXT LEVEL ▶", "vi": "MÀN TIẾP THEO ▶", "ja": "次のステージ ▶", "ko": "다음 레벨 ▶",
		"zh_CN": "下一关 ▶", "es": "SIGUIENTE ▶", "pt_BR": "PRÓXIMA FASE ▶",
		"de": "NÄCHSTES LEVEL ▶", "fr": "NIVEAU SUIVANT ▶", "ru": "СЛЕДУЮЩИЙ ▶"
	},
	"KEY_RETRY": {
		"en": "🔄 RETRY", "vi": "🔄 THỬ LẠI", "ja": "🔄 もう一度", "ko": "🔄 다시 시도",
		"zh_CN": "🔄 重试", "es": "🔄 REINTENTAR", "pt_BR": "🔄 TENTAR DE NOVO",
		"de": "🔄 WIEDERHOLEN", "fr": "🔄 RÉESSAYER", "ru": "🔄 ЗАНОВО"
	},
	"KEY_FAIL": {
		"en": "💀 OUT OF EGGS! 💀", "vi": "💀 HẾT TRỨNG RỒI! 💀",
		"ja": "💀 タマゴ切れ! 💀", "ko": "💀 달걀 소진! 💀",
		"zh_CN": "💀 鸡蛋用光了! 💀", "es": "💀 ¡SIN HUEVOS! 💀",
		"pt_BR": "💀 SEM OVOS! 💀", "de": "💀 KEINE EIER MEHR! 💀",
		"fr": "💀 PLUS D'OEUFS ! 💀", "ru": "💀 ЯЙЦА ЗАКОНЧИЛИСЬ! 💀"
	},
	"KEY_AD_NUKE": {
		"en": "📺 WATCH AD FOR BLACK HOLE", "vi": "📺 XEM AD NHẬN LỖ ĐEN",
		"ja": "📺 広告を見てブラックホール獲得", "ko": "📺 광고 보고 블랙홀 받기",
		"zh_CN": "📺 看广告获得黑洞蛋", "es": "📺 VER ANUNCIO: AGUJERO NEGRO",
		"pt_BR": "📺 VER ANÚNCIO: BURACO NEGRO", "de": "📺 WERBUNG: SCHWARZES LOCH",
		"fr": "📺 PUB POUR TROU NOIR", "ru": "📺 РЕКЛАМА: ЧЁРНАЯ ДЫРА"
	},
	"KEY_PAUSE": {
		"en": "⏸️ PAUSED", "vi": "⏸️ TẠM DỪNG", "ja": "⏸️ 一時停止", "ko": "⏸️ 일시 정지",
		"zh_CN": "⏸️ 暂停", "es": "⏸️ PAUSA", "pt_BR": "⏸️ PAUSA",
		"de": "⏸️ PAUSE", "fr": "⏸️ PAUSE", "ru": "⏸️ ПАУЗА"
	},
	"KEY_RESUME": {
		"en": "RESUME ▶", "vi": "TIẾP TỤC ▶", "ja": "再開 ▶", "ko": "계속하기 ▶",
		"zh_CN": "继续 ▶", "es": "CONTINUAR ▶", "pt_BR": "CONTINUAR ▶",
		"de": "WEITER ▶", "fr": "REPRENDRE ▶", "ru": "ПРОДОЛЖИТЬ ▶"
	},
	"KEY_MENU": {
		"en": "◀ MENU", "vi": "◀ MENU", "ja": "◀ メニュー", "ko": "◀ 메뉴",
		"zh_CN": "◀ 主菜单", "es": "◀ MENÚ", "pt_BR": "◀ MENU",
		"de": "◀ MENÜ", "fr": "◀ MENU", "ru": "◀ МЕНЮ"
	},
	"KEY_WORLD_1": {
		"en": "WORLD 1: FARM CAVERN (1 - 15)", "vi": "THẾ GIỚI 1: NÔNG TRẠI (1 - 15)",
		"ja": "ワールド1: 農場洞窟 (1 - 15)", "ko": "월드 1: 농장 동굴 (1 - 15)",
		"zh_CN": "世界 1: 农场洞穴 (1 - 15)", "es": "MUNDO 1: CAVERNA GRANJA (1 - 15)",
		"pt_BR": "MUNDO 1: CAVERNA FAZENDA (1 - 15)", "de": "WELT 1: FARM-HÖHLE (1 - 15)",
		"fr": "MONDE 1 : CAVERNE FERME (1 - 15)", "ru": "МИР 1: ФЕРМЕРСКАЯ ПЕЩЕРА (1 - 15)"
	},
	"KEY_WORLD_2": {
		"en": "WORLD 2: STONE QUARRY (16 - 30)", "vi": "THẾ GIỚI 2: MỎ ĐÁ BÊ TÔNG (16 - 30)",
		"ja": "ワールド2: 採石場 (16 - 30)", "ko": "월드 2: 채석장 (16 - 30)",
		"zh_CN": "世界 2: 采石场 (16 - 30)", "es": "MUNDO 2: CANTERA (16 - 30)",
		"pt_BR": "MUNDO 2: PEDREIRA (16 - 30)", "de": "WELT 2: STEINBRUCH (16 - 30)",
		"fr": "MONDE 2 : CARRIÈRE (16 - 30)", "ru": "МИР 2: КАМЕННЫЙ КАРЬЕР (16 - 30)"
	},
	"KEY_WORLD_3": {
		"en": "WORLD 3: TOXIC FACTORY (31 - 45)", "vi": "THẾ GIỚI 3: NHÀ MÁY ĐỘC (31 - 45)",
		"ja": "ワールド3: 毒薬工場 (31 - 45)", "ko": "월드 3: 독극물 공장 (31 - 45)",
		"zh_CN": "世界 3: 毒气工厂 (31 - 45)", "es": "MUNDO 3: FÁBRICA TÓXICA (31 - 45)",
		"pt_BR": "MUNDO 3: FÁBRICA TÓXICA (31 - 45)", "de": "WELT 3: GIFT-FABRIK (31 - 45)",
		"fr": "MONDE 3 : USINE TOXIQUE (31 - 45)", "ru": "МИР 3: ХИМИЧЕСКИЙ ЗАВОД (31 - 45)"
	},
	"KEY_WORLD_4": {
		"en": "WORLD 4: LAVA CORE (46 - 60)", "vi": "THẾ GIỚI 4: HẦM NÚI LỬA (46 - 60)",
		"ja": "ワールド4: 溶岩コア (46 - 60)", "ko": "월드 4: 용암 요새 (46 - 60)",
		"zh_CN": "世界 4: 熔岩地堡 (46 - 60)", "es": "MUNDO 4: NÚCLEO DE LAVA (46 - 60)",
		"pt_BR": "MUNDO 4: NÚCLEO DE LAVA (46 - 60)", "de": "WELT 4: LAVA-KERN (46 - 60)",
		"fr": "MONDE 4 : COEUR DE LAVE (46 - 60)", "ru": "МИР 4: ЛАВОВОЕ ЯДРО (46 - 60)"
	},
	"KEY_PREV_WORLD": {
		"en": "◀ PREV", "vi": "◀ TRƯỚC", "ja": "◀ 前へ", "ko": "◀ 이전",
		"zh_CN": "◀ 上一个", "es": "◀ ANTERIOR", "pt_BR": "◀ ANTERIOR",
		"de": "◀ ZURÜCK", "fr": "◀ PRÉCÉDENT", "ru": "◀ НАЗАД"
	},
	"KEY_NEXT_WORLD": {
		"en": "NEXT ▶", "vi": "SAU ▶", "ja": "次へ ▶", "ko": "다음 ▶",
		"zh_CN": "下一个 ▶", "es": "SIGUIENTE ▶", "pt_BR": "PRÓXIMO ▶",
		"de": "WEITER ▶", "fr": "SUIVANT ▶", "ru": "ВПЕРЁД ▶"
	},
	"KEY_FOOTER": {
		"en": "Physics Destruction • 7 Mutant Eggs • 4 Worlds",
		"vi": "Vật lý phá hủy • 7 Loại Trứng Dị Biến • 4 Thế Giới",
		"ja": "物理破壊パズル • 7種の変異タマゴ • 4つの世界",
		"ko": "물리 파괴 퍼즐 • 7종의 변종 알 • 4개 월드",
		"zh_CN": "物理破坏解谜 • 7种变异蛋 • 4个世界",
		"es": "Destrucción Física • 7 Huevos Mutantes • 4 Mundos",
		"pt_BR": "Destruição Física • 7 Ovos Mutantes • 4 Mundos",
		"de": "Physik-Zerstörung • 7 Mutierte Eier • 4 Welten",
		"fr": "Destruction Physique • 7 Oeufs Mutants • 4 Mondes",
		"ru": "Физическое Разрушение • 7 Яиц-Мутантов • 4 Мира"
	}
}

func _ready() -> void:
	# Tự động nhận diện ngôn ngữ của máy người chơi
	_init_language()

func _init_language() -> void:
	var saved_lang = ""
	if has_node("/root/SaveManager"):
		saved_lang = get_node("/root/SaveManager").save_data.get("language", "")

	if saved_lang != "":
		set_language_by_code(saved_lang)
	else:
		# Lấy ngôn ngữ hệ thống
		var os_locale = OS.get_locale_language()
		var found = false
		for i in range(LANGUAGES.size()):
			if LANGUAGES[i]["code"].begins_with(os_locale):
				current_lang_index = i
				current_lang = LANGUAGES[i]["code"]
				found = true
				break
		if not found:
			current_lang_index = 0
			current_lang = "en"

func get_current_language_display() -> String:
	var cur = LANGUAGES[current_lang_index]
	return "%s %s" % [cur["flag"], cur["name"]]

func get_current_flag() -> String:
	return LANGUAGES[current_lang_index]["flag"]

func cycle_language() -> void:
	current_lang_index = (current_lang_index + 1) % LANGUAGES.size()
	current_lang = LANGUAGES[current_lang_index]["code"]

	if has_node("/root/SaveManager"):
		var sm = get_node("/root/SaveManager")
		sm.save_data["language"] = current_lang
		sm.save_game()

	language_changed.emit(current_lang)

func set_language_by_code(code: String) -> void:
	for i in range(LANGUAGES.size()):
		if LANGUAGES[i]["code"] == code:
			current_lang_index = i
			current_lang = code
			language_changed.emit(current_lang)
			return

func t(key: String) -> String:
	if translations.has(key):
		var dict = translations[key]
		if dict.has(current_lang):
			return dict[current_lang]
		elif dict.has("en"):
			return dict["en"]
	return key
