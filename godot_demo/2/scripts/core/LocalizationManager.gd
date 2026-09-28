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
		"en": "200 BUNKER CAMPAIGN LEVELS",
		"vi": "CHIẾN DỊCH 200 MÀN HẦM NGỤC",
		"ja": "地下バンカーバスター 200ステージ",
		"ko": "지하 벙커 버스터 200레벨",
		"zh_CN": "地下地堡破坏者 200关",
		"es": "DESTRUCTOR DE BÚNKER 200 NIVELES",
		"pt_BR": "DESTRUIDOR DE BUNKER 200 FASES",
		"de": "BUNKER-BRECHER 200 LEVEL",
		"fr": "CASSEUR DE BUNKER 200 NIVEAUX",
		"ru": "БУНКЕР БАСТЕР 200 УРОВНЕЙ"
	},
	"KEY_PLAY": {
		"en": "PLAY NOW", "vi": "CHƠI NGAY", "ja": "プレイ", "ko": "지금 플레이",
		"zh_CN": "开始游戏", "es": "JUGAR AHORA", "pt_BR": "JOGAR AGORA", "de": "JETZT SPIELEN",
		"fr": "JOUER", "ru": "ИГРАТЬ"
	},
	"KEY_SELECT_LEVEL": {
		"en": "SELECT LEVEL", "vi": "CHỌN MÀN", "ja": "ステージ選択", "ko": "레벨 선택",
		"zh_CN": "选择关卡", "es": "SELECCIONAR NIVEL", "pt_BR": "SELECIONAR FASE",
		"de": "LEVEL WÄHLEN", "fr": "CHOISIR NIVEAU", "ru": "ВЫБОР УРОВНЯ"
	},
	"KEY_SOUND_ON": {
		"en": "ON", "vi": "BẬT", "ja": "オン", "ko": "켜짐",
		"zh_CN": "开启", "es": "SÍ", "pt_BR": "LIGADO", "de": "AN",
		"fr": "OUI", "ru": "ВКЛ"
	},
	"KEY_SOUND_OFF": {
		"en": "OFF", "vi": "TẮT", "ja": "オフ", "ko": "꺼짐",
		"zh_CN": "关闭", "es": "NO", "pt_BR": "DESLIGADO", "de": "AUS",
		"fr": "NON", "ru": "ВЫКЛ"
	},
	"KEY_LEVEL": {
		"en": "LEVEL %d", "vi": "MÀN %d", "ja": "ステージ %d", "ko": "레벨 %d",
		"zh_CN": "关卡 %d", "es": "NIVEL %d", "pt_BR": "FASE %d", "de": "LEVEL %d",
		"fr": "NIVEAU %d", "ru": "УРОВЕНЬ %d"
	},
	"KEY_SCORE": {
		"en": "SCORE: %d", "vi": "ĐIỂM: %d", "ja": "スコア: %d", "ko": "점수: %d",
		"zh_CN": "得分: %d", "es": "PUNTOS: %d", "pt_BR": "PONTOS: %d", "de": "PUNKTE: %d",
		"fr": "SCORE : %d", "ru": "ОЧКИ: %d"
	},
	"KEY_VICTORY": {
		"en": "BUNKER DESTROYED!", "vi": "CHIẾN THẮNG RỰC RỠ!",
		"ja": "バンカー壊滅成功!", "ko": "벙커 파괴 성공!",
		"zh_CN": "地堡摧毁成功!", "es": "¡BÚNKER DESTRUIDO!",
		"pt_BR": "BUNKER DESTRUÍDO!", "de": "BUNKER ZERSTÖRT!",
		"fr": "BUNKER DÉTRUIT !", "ru": "БУНКЕР УНИЧТОЖЕН!"
	},
	"KEY_FINAL_SCORE": {
		"en": "Total Score: %d", "vi": "Tổng Điểm: %d", "ja": "合計スコア: %d", "ko": "최종 점수: %d",
		"zh_CN": "总得分: %d", "es": "Puntos Totales: %d", "pt_BR": "Pontuação Total: %d",
		"de": "Gesamtpunktzahl: %d", "fr": "Score Total : %d", "ru": "Итоговые Очки: %d"
	},
	"KEY_NEXT_LEVEL": {
		"en": "NEXT LEVEL", "vi": "MÀN TIẾP THEO", "ja": "次のステージ", "ko": "다음 레벨",
		"zh_CN": "下一关", "es": "SIGUIENTE", "pt_BR": "PRÓXIMA FASE",
		"de": "NÄCHSTES LEVEL", "fr": "NIVEAU SUIVANT", "ru": "СЛЕДУЮЩИЙ"
	},
	"KEY_RETRY": {
		"en": "RETRY", "vi": "THỬ LẠI", "ja": "もう一度", "ko": "다시 시도",
		"zh_CN": "重试", "es": "REINTENTAR", "pt_BR": "TENTAR DE NOVO",
		"de": "WIEDERHOLEN", "fr": "RÉESSAYER", "ru": "ЗАНОВО"
	},
	"KEY_FAIL": {
		"en": "OUT OF EGGS!", "vi": "HẾT TRỨNG RỒI!",
		"ja": "タマゴ切れ!", "ko": "달걀 소진!",
		"zh_CN": "鸡蛋用光了!", "es": "¡SIN HUEVOS!",
		"pt_BR": "SEM OVOS!", "de": "KEINE EIER MEHR!",
		"fr": "PLUS D'OEUFS !", "ru": "ЯЙЦА ЗАКОНЧИЛИСЬ!"
	},
	"KEY_AD_NUKE": {
		"en": "WATCH AD FOR BLACK HOLE", "vi": "XEM AD NHẬN LỖ ĐEN",
		"ja": "広告を見てブラックホール獲得", "ko": "광고 보고 블랙홀 받기",
		"zh_CN": "看广告获得黑洞蛋", "es": "VER ANUNCIO: AGUJERO NEGRO",
		"pt_BR": "VER ANÚNCIO: BURACO NEGRO", "de": "WERBUNG: SCHWARZES LOCH",
		"fr": "PUB POUR TROU NOIR", "ru": "РЕКЛАМА: ЧЁРНАЯ ДЫРА"
	},
	"KEY_PAUSE": {
		"en": "PAUSED", "vi": "TẠM DỪNG", "ja": "一時停止", "ko": "일시 정지",
		"zh_CN": "暂停", "es": "PAUSA", "pt_BR": "PAUSA",
		"de": "PAUSE", "fr": "PAUSE", "ru": "ПАУЗА"
	},
	"KEY_RESUME": {
		"en": "RESUME", "vi": "TIẾP TỤC", "ja": "再開", "ko": "계속하기",
		"zh_CN": "继续", "es": "CONTINUAR", "pt_BR": "CONTINUAR",
		"de": "WEITER", "fr": "REPRENDRE", "ru": "ПРОДОЛЖИТЬ"
	},
	"KEY_MENU": {
		"en": "MENU", "vi": "MENU", "ja": "メニュー", "ko": "메뉴",
		"zh_CN": "主菜单", "es": "MENÚ", "pt_BR": "MENU",
		"de": "MENÜ", "fr": "MENU", "ru": "МЕНЮ"
	},
	"KEY_LUCKY_WHEEL": {
		"en": "LUCKY WHEEL", "vi": "VÒNG QUAY MAY MẮN", "ja": "ラッキーホイール", "ko": "행운의 룰렛",
		"zh_CN": "幸运转盘", "es": "RULETA DE LA SUERTE", "pt_BR": "ROLETA DA SORTE",
		"de": "GLÜCKSRAD", "fr": "ROUE DE LA CHANCE", "ru": "КОЛЕСО УДАЧИ"
	},
	"KEY_WORLD_1": {
		"en": "WORLD 1: FARM CAVERN (1 - 20)", "vi": "THẾ GIỚI 1: NÔNG TRẠI (1 - 20)",
		"ja": "ワールド1: 農場洞窟 (1 - 20)", "ko": "월드 1: 농장 동굴 (1 - 20)",
		"zh_CN": "世界 1: 农场洞穴 (1 - 20)", "es": "MUNDO 1: CAVERNA GRANJA (1 - 20)",
		"pt_BR": "MUNDO 1: CAVERNA FAZENDA (1 - 20)", "de": "WELT 1: FARM-HÖHLE (1 - 20)",
		"fr": "MONDE 1 : CAVERNE FERME (1 - 20)", "ru": "МИР 1: ФЕРМЕРСКАЯ ПЕЩЕРА (1 - 20)"
	},
	"KEY_WORLD_2": {
		"en": "WORLD 2: STONE QUARRY (21 - 40)", "vi": "THẾ GIỚI 2: MỎ ĐÁ BÊ TÔNG (21 - 40)",
		"ja": "ワールド2: 採石場 (21 - 40)", "ko": "월드 2: 채석장 (21 - 40)",
		"zh_CN": "世界 2: 采石场 (21 - 40)", "es": "MUNDO 2: CANTERA (21 - 40)",
		"pt_BR": "MUNDO 2: PEDREIRA (21 - 40)", "de": "WELT 2: STEINBRUCH (21 - 40)",
		"fr": "MONDE 2 : CARRIÈRE (21 - 40)", "ru": "МИР 2: КАМЕННЫЙ КАРЬЕР (21 - 40)"
	},
	"KEY_WORLD_3": {
		"en": "WORLD 3: TOXIC FACTORY (41 - 60)", "vi": "THẾ GIỚI 3: NHÀ MÁY ĐỘC (41 - 60)",
		"ja": "ワールド3: 毒薬工場 (41 - 60)", "ko": "월드 3: 독극물 공장 (41 - 60)",
		"zh_CN": "世界 3: 毒气工厂 (41 - 60)", "es": "MUNDO 3: FÁBRICA TÓXICA (41 - 60)",
		"pt_BR": "MUNDO 3: FÁBRICA TÓXICA (41 - 60)", "de": "WELT 3: GIFT-FABRIK (41 - 60)",
		"fr": "MONDE 3 : USINE TOXIQUE (41 - 60)", "ru": "МИР 3: ХИМИЧЕСКИЙ ЗАВОД (41 - 60)"
	},
	"KEY_WORLD_4": {
		"en": "WORLD 4: LAVA CORE (61 - 80)", "vi": "THẾ GIỚI 4: HẦM NÚI LỬA (61 - 80)",
		"ja": "ワールド4: 溶岩コア (61 - 80)", "ko": "월드 4: 용암 요새 (61 - 80)",
		"zh_CN": "世界 4: 熔岩地堡 (61 - 80)", "es": "MUNDO 4: NÚCLEO DE LAVA (61 - 80)",
		"pt_BR": "MUNDO 4: NÚCLEO DE LAVA (61 - 80)", "de": "WELT 4: LAVA-KERN (61 - 80)",
		"fr": "MONDE 4 : COEUR DE LAVE (61 - 80)", "ru": "МИР 4: ЛАВОВОЕ ЯДРО (61 - 80)"
	},
	"KEY_WORLD_5": {
		"en": "WORLD 5: CRYSTAL CITADEL (81 - 100)", "vi": "THẾ GIỚI 5: THÁNH ĐỊA PHA LÊ (81 - 100)",
		"ja": "ワールド5: 水晶の要塞 (81 - 100)", "ko": "월드 5: 크리스탈 성채 (81 - 100)",
		"zh_CN": "世界 5: 水晶城堡 (81 - 100)", "es": "MUNDO 5: CIUDADELA CRISTAL (81 - 100)",
		"pt_BR": "MUNDO 5: CIDADELA DE CRISTAL (81 - 100)", "de": "WELT 5: KRISTALL-ZITADELLE (81 - 100)",
		"fr": "MONDE 5 : CITADELLE DE CRISTAL (81 - 100)", "ru": "МИР 5: КРИСТАЛЬНАЯ ЦИТАДЕЛЬ (81 - 100)"
	},
	"KEY_WORLD_6": {
		"en": "WORLD 6: CYBER BUNKER (101 - 120)", "vi": "THẾ GIỚI 6: HẦM CÔNG NGHỆ (101 - 120)",
		"ja": "ワールド6: サイバー要塞 (101 - 120)", "ko": "월드 6: 사이버 벙커 (101 - 120)",
		"zh_CN": "世界 6: 赛博地堡 (101 - 120)", "es": "MUNDO 6: BÚNKER CIBER (101 - 120)",
		"pt_BR": "MUNDO 6: BUNKER CIBERNÉTICO (101 - 120)", "de": "WELT 6: CYBER-BUNKER (101 - 120)",
		"fr": "MONDE 6 : BUNKER CYBER (101 - 120)", "ru": "МИР 6: КИБЕР БУНКЕР (101 - 120)"
	},
	"KEY_WORLD_7": {
		"en": "WORLD 7: TOXIC JUNGLE (121 - 140)", "vi": "THẾ GIỚI 7: RỪNG ĐỘC HẦM NGẦM (121 - 140)",
		"ja": "ワールド7: 猛毒の密林 (121 - 140)", "ko": "월드 7: 맹독 정글 (121 - 140)",
		"zh_CN": "世界 7: 剧毒丛林 (121 - 140)", "es": "MUNDO 7: JUNGLA TÓXICA (121 - 140)",
		"pt_BR": "MUNDO 7: SELVA TÓXICA (121 - 140)", "de": "WELT 7: GIFT-DSCHUNGEL (121 - 140)",
		"fr": "MONDE 7 : JUNGLE TOXIQUE (121 - 140)", "ru": "МИР 7: ТОКСИЧНЫЕ ДЖУНГЛИ (121 - 140)"
	},
	"KEY_WORLD_8": {
		"en": "WORLD 8: GLACIER VAULT (141 - 160)", "vi": "THẾ GIỚI 8: KHO BĂNG VĨNH CỬU (141 - 160)",
		"ja": "ワールド8: 氷河の宝物庫 (141 - 160)", "ko": "월드 8: 빙하 금고 (141 - 160)",
		"zh_CN": "世界 8: 极寒冰窟 (141 - 160)", "es": "MUNDO 8: BÓVEDA GLACIAR (141 - 160)",
		"pt_BR": "MUNDO 8: COFRE GLACIAL (141 - 160)", "de": "WELT 8: GLETSCHER-TRESOR (141 - 160)",
		"fr": "MONDE 8 : CRYPTE GLACIAIRE (141 - 160)", "ru": "МИР 8: ЛЕДЯНОЙ БУНКЕР (141 - 160)"
	},
	"KEY_WORLD_9": {
		"en": "WORLD 9: DRAGON ABYSS (161 - 180)", "vi": "THẾ GIỚI 9: VỰC THẲM RỒNG CỔ (161 - 180)",
		"ja": "ワールド9: 竜の深淵 (161 - 180)", "ko": "월드 9: 드래곤 심연 (161 - 180)",
		"zh_CN": "世界 9: 巨龙深渊 (161 - 180)", "es": "MUNDO 9: ABISMO DEL DRAGÓN (161 - 180)",
		"pt_BR": "MUNDO 9: ABISMO DO DRAGÃO (161 - 180)", "de": "WELT 9: DRACHEN-ABGRUND (161 - 180)",
		"fr": "MONDE 9 : ABÎME DU DRAGON (161 - 180)", "ru": "МИР 9: БЕЗДНА ДРАКОНА (161 - 180)"
	},
	"KEY_WORLD_10": {
		"en": "WORLD 10: CELESTIAL NEXUS (181 - 200)", "vi": "THẾ GIỚI 10: THẦN ĐIỆN VŨ TRỤ (181 - 200)",
		"ja": "ワールド10: 宇宙の特異点 (181 - 200)", "ko": "월드 10: 천상 넥서스 (181 - 200)",
		"zh_CN": "世界 10: 奇点神殿 (181 - 200)", "es": "MUNDO 10: NEXO CELESTIAL (181 - 200)",
		"pt_BR": "MUNDO 10: NEXO CELESTIAL (181 - 200)", "de": "WELT 10: KOSMISCHER NEXUS (181 - 200)",
		"fr": "MONDE 10 : NEXUS CÉLESTE (181 - 200)", "ru": "МИР 10: КОСМИЧЕСКИЙ НЕКСУС (181 - 200)"
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
		"en": "Physics Destruction • 7 Mutant Eggs • 10 Worlds",
		"vi": "Vật lý phá hủy • 7 Loại Trứng Dị Biến • 10 Thế Giới",
		"ja": "物理破壊パズル • 7種の変異タマゴ • 10の世界",
		"ko": "물리 파괴 퍼즐 • 7종의 변종 알 • 10개 월드",
		"zh_CN": "物理破坏解谜 • 7种变异蛋 • 10个世界",
		"es": "Destrucción Física • 7 Huevos Mutantes • 10 Mundos",
		"pt_BR": "Destruição Física • 7 Ovos Mutantes • 10 Mundos",
		"de": "Physik-Zerstörung • 7 Mutierte Eier • 10 Welten",
		"fr": "Destruction Physique • 7 Oeufs Mutants • 10 Mondes",
		"ru": "Физическое Разрушение • 7 Яиц-Мутантов • 10 Миров"
	},
	"KEY_LOCKED": {
		"en": "LOCKED", "vi": "CHƯA MỞ", "ja": "ロック中", "ko": "잠김",
		"zh_CN": "未解锁", "es": "BLOQUEADO", "pt_BR": "BLOQUEADO", "de": "GESPERRT",
		"fr": "VERROUILLÉ", "ru": "ЗАКРЫТО"
	},
	"KEY_TUTORIAL_AIM": {
		"en": "👇 DRAG DOWN TO AIM & RELEASE TO DROP! 👇",
		"vi": "👇 KÉO XUỐNG ĐỂ NGẮM & THẢ RA ĐỂ BẮN! 👇",
		"ja": "👇 下に引いて狙い、離して投下！ 👇",
		"ko": "👇 아래로 당겨 조준하고 놓아서 투하! 👇",
		"zh_CN": "👇 向下拉动瞄准，松开投掷！ 👇",
		"es": "👇 ¡ARRASTRA HACIA ABAJO PARA APUNTAR Y SUELTA! 👇",
		"pt_BR": "👇 ARRASTE PARA BAIXO PARA MIRAR E SOLTE! 👇",
		"de": "👇 ZUM ZIELEN NACH UNTEN ZIEHEN & LOSLASSEN! 👇",
		"fr": "👇 GLISSEZ VERS LE BAS POUR VISER ET LÂCHEZ ! 👇",
		"ru": "👇 ТЯНИТЕ ВНИЗ ДЛЯ ПРИЦЕЛА И ОТПУСТИТЕ! 👇"
	},
	"KEY_GOLD_REWARD": {
		"en": "+%d GOLD", "vi": "+%d VÀNG", "ja": "+%d コイン", "ko": "+%d 골드",
		"zh_CN": "+%d 金币", "es": "+%d ORO", "pt_BR": "+%d OURO", "de": "+%d GOLD",
		"fr": "+%d OR", "ru": "+%d ЗОЛОТА"
	},
	"KEY_CLAIM_TRIPLE": {
		"en": "CLAIM X3 GOLD (+%d)", "vi": "NHẬN X3 VÀNG (+%d)",
		"ja": "3倍ゴールド獲得 (+%d)", "ko": "골드 3배 받기 (+%d)",
		"zh_CN": "领取3倍金币 (+%d)", "es": "RECLAMAR X3 ORO (+%d)",
		"pt_BR": "RECEBER 3X OURO (+%d)", "de": "3X GOLD ERHALTEN (+%d)",
		"fr": "RÉCLAMER 3X OR (+%d)", "ru": "ЗАБРАТЬ X3 ЗОЛОТА (+%d)"
	},
	"KEY_CONTINUE_REWARD": {
		"en": "CONTINUE (+%d Gold)", "vi": "TIẾP TỤC (+%d Vàng)",
		"ja": "続ける (+%d コイン)", "ko": "계속하기 (+%d 골드)",
		"zh_CN": "继续 (+%d 金币)", "es": "CONTINUAR (+%d Oro)",
		"pt_BR": "CONTINUAR (+%d Ouro)", "de": "WEITER (+%d Gold)",
		"fr": "CONTINUER (+%d Or)", "ru": "ПРОДОЛЖИТЬ (+%d Золота)"
	},
	"KEY_LAST_STAND_TITLE": {
		"en": "LAST CHANCE!", "vi": "CƠ HỘI CUỐI!",
		"ja": "ラストチャンス!", "ko": "마지막 기회!",
		"zh_CN": "最后机会!", "es": "¡ÚLTIMA OPORTUNIDAD!",
		"pt_BR": "ÚLTIMA CHANCE!", "de": "LETZTE CHANCE!",
		"fr": "DERNIÈRE CHANCE !", "ru": "ПОСЛЕДНИЙ ШАНС!"
	},
	"KEY_LAST_STAND_SUB": {
		"en": "Only %d monster left! Don't give up!",
		"vi": "Chỉ còn %d quái vật! Đừng bỏ cuộc!",
		"ja": "残りモンスターあと%d体! 諦めるな!",
		"ko": "몬스터가 %d마리 남았습니다! 포기하지 마세요!",
		"zh_CN": "仅剩%d只怪物! 不要放弃!",
		"es": "¡Solo queda %d monstruo! ¡No te rindas!",
		"pt_BR": "Resta apenas %d monstro! Não desista!",
		"de": "Nur noch %d Monster übrig! Gib nicht auf!",
		"fr": "Plus que %d monstre ! N'abandonne pas !",
		"ru": "Остался всего %d монстр! Не сдавайся!"
	},
	"KEY_LAST_STAND_AD": {
		"en": "+1 BOMB EGG TO RESCUE", "vi": "+1 TRỨNG NỔ CỨU THUA",
		"ja": "+1 爆弾タマゴで救済", "ko": "+1 폭탄 알로 구출",
		"zh_CN": "+1 炸弹蛋救援", "es": "+1 HUEVO BOMBA AL RESCATE",
		"pt_BR": "+1 OVO BOMBA DE RESGATE", "de": "+1 BOMBEN-EI ZUR RETTUNG",
		"fr": "+1 OEUF BOMBE DE SECOURS", "ru": "+1 БОМБОВОЕ ЯЙЦО ДЛЯ СПАСЕНИЯ"
	},
	"KEY_SKIP": {
		"en": "SKIP", "vi": "BỎ QUA", "ja": "スキップ", "ko": "건너뛰기",
		"zh_CN": "跳过", "es": "SALTAR", "pt_BR": "PULAR", "de": "ÜBERSPRINGEN",
		"fr": "PASSER", "ru": "ПРОПУСТИТЬ"
	},
	"KEY_WHEEL_TITLE": {
		"en": "LUCKY WHEEL", "vi": "VÒNG QUAY MAY MẮN", "ja": "ラッキーホイール", "ko": "행운의 룰렛",
		"zh_CN": "幸运转盘", "es": "RULETA DE LA SUERTE", "pt_BR": "ROLETA DA SORTE",
		"de": "GLÜCKSRAD", "fr": "ROUE DE LA CHANCE", "ru": "КОЛЕСО УДАЧИ"
	},
	"KEY_WHEEL_SPIN_FREE": {
		"en": "SPIN FOR FREE", "vi": "QUAY MIỄN PHÍ", "ja": "無料スピン", "ko": "무료 스핀",
		"zh_CN": "免费旋转", "es": "GIRAR GRATIS", "pt_BR": "GIRAR GRÁTIS", "de": "GRATIS DREHEN",
		"fr": "TOURNER GRATUIT", "ru": "КРУТИТЬ БЕСПЛАТНО"
	},
	"KEY_WHEEL_SPIN_AD": {
		"en": "WATCH AD TO SPIN (%d/4)", "vi": "XEM VIDEO QUAY THÊM (%d/4)",
		"ja": "広告を見てスピン (%d/4)", "ko": "광고 보고 스핀 (%d/4)",
		"zh_CN": "看广告旋转 (%d/4)", "es": "VER ANUNCIO (%d/4)",
		"pt_BR": "VER ANÚNCIO (%d/4)", "de": "WERBUNG SEHEN (%d/4)",
		"fr": "REGARDER PUB (%d/4)", "ru": "РЕКЛАМА ДЛЯ ВРАЩЕНИЯ (%d/4)"
	},
	"KEY_WHEEL_EXHAUSTED": {
		"en": "OUT OF SPINS TODAY", "vi": "ĐÃ HẾT LƯỢT HÔM NAY",
		"ja": "本日のスピン終了", "ko": "오늘 스핀 소진",
		"zh_CN": "今日次数已用尽", "es": "SIN GIROS POR HOY",
		"pt_BR": "SEM GIROS HOJE", "de": "KEINE DREHUNGEN MEHR",
		"fr": "PLUS DE TOURS", "ru": "НЕТ ВРАЩЕНИЙ СЕГОДНЯ"
	},
	"KEY_WHEEL_STATUS_FREE": {
		"en": "First daily spin: 100% FREE!",
		"vi": "Lượt quay đầu tiên trong ngày: MIỄN PHÍ!",
		"ja": "本日の初回スピンは無料です!",
		"ko": "오늘 첫 번째 스핀은 100% 무료!",
		"zh_CN": "每日首次旋转完全免费!",
		"es": "¡Primer giro diario: GRATIS!",
		"pt_BR": "Primeiro giro do dia: GRÁTIS!",
		"de": "Erster täglicher Dreh: GRATIS!",
		"fr": "Premier tour du jour : GRATUIT !",
		"ru": "Первое вращение дня: БЕСПЛАТНО!"
	},
	"KEY_WHEEL_STATUS_AD": {
		"en": "Watch a short ad for an extra spin!",
		"vi": "Xem 1 video ngắn để nhận thêm lượt quay!",
		"ja": "短い動画を見て追加スピンを獲得!",
		"ko": "짧은 광고를 보고 추가 스핀을 받으세요!",
		"zh_CN": "观看简短广告获得额外旋转机会!",
		"es": "¡Mira un anuncio corto para otro giro!",
		"pt_BR": "Assista a um anúncio para um giro extra!",
		"de": "Sieh ein kurzes Video für einen weiteren Dreh!",
		"fr": "Regardez une pub pour un tour supplémentaire !",
		"ru": "Посмотрите видео для дополнительного вращения!"
	},
	"KEY_WHEEL_STATUS_DONE": {
		"en": "All 4 spins used today. Come back tomorrow!",
		"vi": "Đã dùng hết 4 lượt quay hôm nay. Hãy quay lại vào ngày mai!",
		"ja": "本日の4回スピンは終了しました。また明日!",
		"ko": "오늘 4번의 스핀을 모두 사용했습니다. 내일 다시 오세요!",
		"zh_CN": "今日4次旋转已用尽，明天再来吧!",
		"es": "¡Usaste los 4 giros de hoy! ¡Vuelve mañana!",
		"pt_BR": "Você usou os 4 giros de hoje. Volte amanhã!",
		"de": "Alle 4 Drehungen für heute genutzt. Bis morgen!",
		"fr": "Tous les 4 tours utilisés aujourd'hui. À demain !",
		"ru": "Все 4 вращения использованы. Приходите завтра!"
	},
	"KEY_WHEEL_CLOSE": {
		"en": "CLOSE", "vi": "ĐÓNG", "ja": "閉じる", "ko": "닫기",
		"zh_CN": "关闭", "es": "CERRAR", "pt_BR": "FECHAR", "de": "SCHLIESSEN",
		"fr": "FERMER", "ru": "ЗАКРЫТЬ"
	},
	"KEY_WHEEL_REWARD_COINS": {
		"en": "🎉 +%d COINS! 🎉", "vi": "🎉 +%d VÀNG! 🎉", "ja": "🎉 +%d コイン! 🎉", "ko": "🎉 +%d 코인! 🎉",
		"zh_CN": "🎉 +%d 金币! 🎉", "es": "🎉 +%d MONEDAS! 🎉", "pt_BR": "🎉 +%d MOEDAS! 🎉", "de": "🎉 +%d MÜNZEN! 🎉",
		"fr": "🎉 +%d PIÈCES! 🎉", "ru": "🎉 +%d МОНЕТ! 🎉"
	},
	"KEY_WHEEL_REWARD_EGG": {
		"en": "🎉 +1 %s EGG! 🎉", "vi": "🎉 +1 TRỨNG %s! 🎉", "ja": "🎉 +1 %s たまご! 🎉", "ko": "🎉 +1 %s 알! 🎉",
		"zh_CN": "🎉 +1 %s 蛋! 🎉", "es": "🎉 +1 HUEVO %s! 🎉", "pt_BR": "🎉 +1 OVO %s! 🎉", "de": "🎉 +1 %s-EI! 🎉",
		"fr": "🎉 +1 ŒUF %s! 🎉", "ru": "🎉 +1 ЯЙЦО %s! 🎉"
	},
	"KEY_SHOP": {
		"en": "SHOP", "vi": "CỬA HÀNG", "ja": "ショップ", "ko": "상점",
		"zh_CN": "商店", "es": "TIENDA", "pt_BR": "LOJA", "de": "LADEN",
		"fr": "BOUTIQUE", "ru": "МАГАЗИН"
	},
	"KEY_SHOP_TITLE": {
		"en": "EGG & BOOSTER SHOP", "vi": "CỬA HÀNG ĐẠO CỤ", "ja": "タマゴ＆ブースターショップ", "ko": "알 & 부스터 상점",
		"zh_CN": "鸡蛋与道具商店", "es": "TIENDA DE HUEVOS", "pt_BR": "LOJA DE OVOS", "de": "EIER & BOOSTER SHOP",
		"fr": "BOUTIQUE D'OEUFS", "ru": "МАГАЗИН ЯИЦ"
	},
	"KEY_BUY": {
		"en": "BUY", "vi": "MUA", "ja": "購入", "ko": "구매",
		"zh_CN": "购买", "es": "COMPRAR", "pt_BR": "COMPRAR", "de": "KAUFEN",
		"fr": "ACHETER", "ru": "КУПИТЬ"
	},
	"KEY_INVENTORY": {
		"en": "INVENTORY: x%d", "vi": "TỒN KHO: x%d", "ja": "所持数: x%d", "ko": "보유량: x%d",
		"zh_CN": "库存: x%d", "es": "INVENTARIO: x%d", "pt_BR": "ESTOQUE: x%d", "de": "BESTAND: x%d",
		"fr": "INVENTAIRE: x%d", "ru": "В НАЛИЧИИ: x%d"
	},
	"KEY_SHOP_BOMB_DESC": {
		"en": "Massive blast clears entire bunkers", "vi": "Sức công phá khủng khiếp, san bằng boong-ke quái"
	},
	"KEY_SHOP_DRILL_DESC": {
		"en": "Hypersonic drill pierces 4 layers of steel", "vi": "Mũi khoan siêu thanh xuyên thủng 4 tầng đá thép"
	},
	"KEY_SHOP_ACID_DESC": {
		"en": "Dissolves and melts barriers continuously", "vi": "Vũng axit ăn mòn tan chảy chướng ngại vật"
	},
	"KEY_SHOP_FROST_DESC": {
		"en": "Freezes blocks and monsters into brittle glass",
		"vi": "Đóng băng cấu trúc và quái thành thủy tinh giòn",
		"ja": "ブロックと敵を凍らせて脆いガラスに変える",
		"ko": "블록과 몬스터를 얼려 깨지기 쉬운 유리로 변환",
		"zh_CN": "冰冻障碍与怪物，将其化为易碎玻璃",
		"es": "Congela bloques y monstruos en vidrio frágil",
		"pt_BR": "Congela blocos e monstros em vidro quebradiço",
		"de": "Friert Blöcke und Monster zu sprödem Glas ein",
		"fr": "Gèle blocs et monstres en verre fragile",
		"ru": "Замораживает блоки и монстров в хрупкое стекло"
	},
	"KEY_SHOP_CLUSTER_DESC": {
		"en": "Hatches 4 explosive kamikaze chicks on tap",
		"vi": "Nở ra 4 chú gà con cảm tử phát nổ diện rộng",
		"ja": "タップで4羽の爆発特攻ヒヨコが分裂拡散",
		"ko": "터치 시 4마리의 폭발 자폭 병아리 부화",
		"zh_CN": "点击分裂孵化4只自爆特攻小鸡",
		"es": "Eclosiona 4 pollitos explosivos al pulsar",
		"pt_BR": "Choca 4 pintinhos explosivos ao tocar",
		"de": "Schlüpft 4 explosive Kamikaze-Küken bei Tippen",
		"fr": "Fait éclore 4 poussins explosifs au toucher",
		"ru": "Выпускает 4 взрывных цыплёнка при нажатии"
	},
	"KEY_SHOP_BLACKHOLE_DESC": {
		"en": "Cosmic singularity sucks and crushes everything",
		"vi": "Hố đen vũ trụ hút sạch và nghiền nát mọi thứ",
		"ja": "宇宙特異点が全てを吸い込み粉砕する",
		"ko": "우주 특이점이 모든 것을 빨아들여 분쇄",
		"zh_CN": "宇宙奇点引力黑洞，吞噬粉碎一切",
		"es": "Singularidad cósmica que succiona y aplasta todo",
		"pt_BR": "Singularidade cósmica que suga e esmaga tudo",
		"de": "Kosmische Singularität saugt und zermalmt alles",
		"fr": "Singularité cosmique qui aspire et broie tout",
		"ru": "Космическая сингулярность засасывает и дробит всё"
	},
	"KEY_SHOP_COMBO_DESC": {
		"en": "Mega Arsenal Pack: 1 of every special egg!",
		"vi": "Gói Kho Vũ Khí: Sở hữu 1 quả mỗi loại trứng đặc biệt!",
		"ja": "メガ兵器パック：全特殊タマゴ各1個！",
		"ko": "메가 아스널 팩: 모든 특수 알 각 1개씩!",
		"zh_CN": "超级军火包：包含全部特殊变异蛋各1枚！",
		"es": "¡Megapack Arsenal: 1 de cada huevo especial!",
		"pt_BR": "Megapacote Arsenal: 1 de cada ovo especial!",
		"de": "Mega-Arsenal-Pack: 1 von jedem Spezial-Ei!",
		"fr": "Pack Méga Arsenal : 1 de chaque œuf spécial !",
		"ru": "Мега Арсенал: по 1 яйцу каждого спец-типа!"
	},
	"KEY_SHOP_NOT_ENOUGH": {
		"en": "Not enough coins!", "vi": "Không đủ vàng!"
	},
	"KEY_NEW_RECORD": {
		"en": "NEW RECORD!", "vi": "KỶ LỤC MỚI!", "ja": "新記録!", "ko": "신기록!",
		"zh_CN": "新纪录!", "es": "¡NUEVO RÉCORD!", "pt_BR": "NOVO RECORDE!", "de": "NEUER REKORD!",
		"fr": "NOUVEAU RECORD !", "ru": "НОВЫЙ РЕКОРД!"
	},
	"KEY_EGG_BONUS": {
		"en": "Egg Bonus: +%d", "vi": "Thưởng Trứng Thừa: +%d", "ja": "タマゴボーナス: +%d", "ko": "남은 알 보너스: +%d",
		"zh_CN": "剩余鸡蛋奖励: +%d", "es": "Bonus de Huevos: +%d", "pt_BR": "Bônus de Ovos: +%d", "de": "Eier-Bonus: +%d",
		"fr": "Bonus d'oeufs : +%d", "ru": "Бонус за яйца: +%d"
	},
	"KEY_SETTINGS": {
		"en": "SETTINGS", "vi": "CÀI ĐẶT", "ja": "設定", "ko": "설정",
		"zh_CN": "设置", "es": "AJUSTES", "pt_BR": "CONFIGURAÇÕES", "de": "EINSTELLUNGEN",
		"fr": "PARAMÈTRES", "ru": "НАСТРОЙКИ"
	},
	"KEY_BGM_VOLUME": {
		"en": "Music Volume", "vi": "Nhạc nền", "ja": "BGM音量", "ko": "배경음악",
		"zh_CN": "背景音乐", "es": "Música", "pt_BR": "Música", "de": "Musik",
		"fr": "Musique", "ru": "Музыка"
	},
	"KEY_SFX_VOLUME": {
		"en": "Sound FX", "vi": "Hiệu ứng", "ja": "効果音", "ko": "효과음",
		"zh_CN": "音效", "es": "Efectos", "pt_BR": "Efeitos", "de": "Effekte",
		"fr": "Effets", "ru": "Звуки"
	},
	"KEY_VIBRATION": {
		"en": "Vibration", "vi": "Rung xúc giác", "ja": "振動", "ko": "진동",
		"zh_CN": "震动", "es": "Vibración", "pt_BR": "Vibração", "de": "Vibration",
		"fr": "Vibration", "ru": "Вибрация"
	},
	"KEY_RESET_PROGRESS": {
		"en": "Reset All Progress", "vi": "Xóa toàn bộ tiến trình", "ja": "進行状況をリセット", "ko": "진행 상황 초기화",
		"zh_CN": "重置所有进度", "es": "Restablecer Progreso", "pt_BR": "Redefinir Progresso", "de": "Fortschritt zurücksetzen",
		"fr": "Réinitialiser", "ru": "Сбросить прогресс"
	},
	"KEY_RESET_CONFIRM_DESC": {
		"en": "All 200 levels and coins will be permanently reset!", "vi": "Toàn bộ 200 màn chơi và vàng sẽ bị xóa vĩnh viễn!",
		"ja": "200ステージとコインがすべて初期化されます！", "ko": "200개의 레벨과 코인이 영구 삭제됩니다!",
		"zh_CN": "所有200关及金币将被永久重置！", "es": "¡Se restablecerán permanentemente los 200 niveles y monedas!",
		"pt_BR": "Todas as 200 fases e moedas serão redefinidas permanentemente!", "de": "Alle 200 Level und Münzen werden dauerhaft zurückgesetzt!",
		"fr": "Tous les 200 niveaux et pièces seront réinitialisés définitivement !", "ru": "Все 200 уровней и монеты будут сброшены безвозвратно!"
	},
	"KEY_CONFIRM": {
		"en": "CONFIRM", "vi": "XÁC NHẬN", "ja": "確認", "ko": "확인",
		"zh_CN": "确认", "es": "CONFIRMAR", "pt_BR": "CONFIRMAR", "de": "BESTÄTIGEN",
		"fr": "CONFIRMER", "ru": "ПОДТВЕРДИТЬ"
	},
	"KEY_CANCEL": {
		"en": "CANCEL", "vi": "HỦY", "ja": "キャンセル", "ko": "취소",
		"zh_CN": "取消", "es": "CANCELAR", "pt_BR": "CANCELAR", "de": "ABBRECHEN",
		"fr": "ANNULER", "ru": "ОТМЕНА"
	},
	"KEY_CLOSE": {
		"en": "CLOSE", "vi": "ĐÓNG", "ja": "閉じる", "ko": "닫기",
		"zh_CN": "关闭", "es": "CERRAR", "pt_BR": "FECHAR", "de": "SCHLIESSEN",
		"fr": "FERMER", "ru": "ЗАКРЫТЬ"
	},
	"KEY_BOMB_BOOSTER": {
		"en": "Bomb Egg", "vi": "Trứng Bom", "ja": "爆弾タマゴ", "ko": "폭탄 달걀",
		"zh_CN": "炸弹蛋", "es": "Huevo Bomba", "pt_BR": "Ovo Bomba", "de": "Bomben-Ei",
		"fr": "Œuf Bombe", "ru": "Яйцо-Бомба"
	},
	"KEY_DRILL_BOOSTER": {
		"en": "Drill Egg", "vi": "Trứng Khoan", "ja": "ドリルタマゴ", "ko": "드릴 달걀",
		"zh_CN": "钻头蛋", "es": "Huevo Taladro", "pt_BR": "Ovo Broca", "de": "Bohrer-Ei",
		"fr": "Œuf Foreuse", "ru": "Яйцо-Бур"
	},
	"KEY_ACID_BOOSTER": {
		"en": "Acid Egg", "vi": "Trứng Axit", "ja": "酸性タマゴ", "ko": "산성 달걀",
		"zh_CN": "酸性蛋", "es": "Huevo Ácido", "pt_BR": "Ovo Ácido", "de": "Säure-Ei",
		"fr": "Œuf Acide", "ru": "Яйцо-Кислота"
	},
	"KEY_FROST_BOOSTER": {
		"en": "Frost Egg", "vi": "Trứng Băng", "ja": "フロストタマゴ", "ko": "냉기 달걀",
		"zh_CN": "冰霜蛋", "es": "Huevo Helado", "pt_BR": "Ovo Gélido", "de": "Frost-Ei",
		"fr": "Œuf de Givre", "ru": "Ледяное Яйцо"
	},
	"KEY_CLUSTER_BOOSTER": {
		"en": "Cluster Egg", "vi": "Trứng Chùm", "ja": "クラスタータマゴ", "ko": "클러스터 달걀",
		"zh_CN": "群鸟分裂蛋", "es": "Huevo Racimo", "pt_BR": "Ovo Cluster", "de": "Cluster-Ei",
		"fr": "Œuf à Fragmentation", "ru": "Кассетное Яйцо"
	},
	"KEY_BLACKHOLE_BOOSTER": {
		"en": "Black Hole Egg", "vi": "Trứng Lỗ Đen", "ja": "ブラックホールタマゴ", "ko": "블랙홀 달걀",
		"zh_CN": "黑洞引力蛋", "es": "Huevo Agujero Negro", "pt_BR": "Ovo Buraco Negro", "de": "Schwarzes-Loch-Ei",
		"fr": "Œuf Trou Noir", "ru": "Яйцо Чёрная Дыра"
	},
	"KEY_COMBO_BOOSTER": {
		"en": "Mega Arsenal Pack", "vi": "Gói Kho Vũ Khí", "ja": "メガ兵器パック", "ko": "메가 아스널 팩",
		"zh_CN": "超级军火包", "es": "Paquete Mega Arsenal", "pt_BR": "Pacote Mega Arsenal", "de": "Mega-Arsenal-Pack",
		"fr": "Pack Méga Arsenal", "ru": "Набор Мега Арсенал"
	},
	"KEY_PURCHASED": {
		"en": "PURCHASED SUCCESSFULLY!", "vi": "ĐÃ MUA THÀNH CÔNG!", "ja": "購入が完了しました！", "ko": "구매 완료!",
		"zh_CN": "购买成功！", "es": "¡COMPRA EXITOSA!", "pt_BR": "COMPRA CONCLUÍDA!", "de": "ERFOLGREICH GEKAUFT!",
		"fr": "ACHAT RÉUSSI !", "ru": "УСПЕШНО КУПЛЕНО!"
	},
	"KEY_LANGUAGE": {
		"en": "Language", "vi": "Ngôn ngữ", "ja": "言語", "ko": "언어",
		"zh_CN": "语言", "es": "Idioma", "pt_BR": "Idioma", "de": "Sprache",
		"fr": "Langue", "ru": "Язык"
	},
	"KEY_RESET_SUCCESS": {
		"en": "Progress Reset!", "vi": "Đã xóa tiến trình!", "ja": "リセット完了！",
		"ko": "초기화 완료!", "zh_CN": "进度已重置！", "es": "¡Progreso restablecido!",
		"pt_BR": "Progresso redefinido!", "de": "Fortschritt zurückgesetzt!",
		"fr": "Progression réinitialisée!", "ru": "Прогресс сброшен!"
	}
}

func _ready() -> void:
	# Tự động nhận diện ngôn ngữ của máy người chơi
	_init_language()

func _init_language() -> void:
	var saved_lang = ""
	if is_inside_tree() and has_node("/root/SaveManager"):
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

func get_short_language_display() -> String:
	var cur = LANGUAGES[current_lang_index]
	var code_display = cur["code"].to_upper().split("_")[0]
	return "%s %s" % [cur["flag"], code_display]

func get_current_flag() -> String:
	return LANGUAGES[current_lang_index]["flag"]

func cycle_language() -> void:
	current_lang_index = (current_lang_index + 1) % LANGUAGES.size()
	current_lang = LANGUAGES[current_lang_index]["code"]

	if is_inside_tree() and has_node("/root/SaveManager"):
		var sm = get_node("/root/SaveManager")
		sm.save_data["language"] = current_lang
		sm.save_game()

	language_changed.emit(current_lang)

func set_language(code: String) -> void:
	set_language_by_code(code)

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
