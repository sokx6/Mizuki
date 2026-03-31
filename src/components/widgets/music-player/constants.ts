import type { Song } from "./types";

export const STORAGE_KEY_VOLUME = "music-player-volume";

export const DEFAULT_VOLUME = 0.7;

export const LOCAL_PLAYLIST: Song[] = [
	{
		id: 1,
		title: "-遠い空へ-",
		artist: "市川淳",
		cover: "assets/music/cover/-遠い空へ- - 市川淳.png",
		url: "assets/music/url/-遠い空へ- - 市川淳.mp3",
		duration: 0,
	},
	{
		id: 2,
		title: "Bad Apple!!（東方幻想郷）Piano+Violin",
		artist: "TAMUSIC",
		cover: "assets/music/cover/Bad Apple!!（東方幻想郷）Piano+Violin - TAMUSIC.png",
		url: "assets/music/url/Bad Apple!!（東方幻想郷）Piano+Violin - TAMUSIC.mp3",
		duration: 0,
	},
	{
		id: 3,
		title: "dazbee",
		artist: "dazbee",
		cover: "assets/music/cover/dazbee.webp",
		url: "assets/music/url/dazbee.mp3",
		duration: 0,
	},
	{
		id: 4,
		title: "Miku",
		artist: "Anamanaguchi&初音ミク",
		cover: "assets/music/cover/Miku - Anamanaguchi&初音ミク.png",
		url: "assets/music/url/Miku - Anamanaguchi&初音ミク.mp3",
		duration: 0,
	},
	{
		id: 5,
		title: "One Last Kiss",
		artist: "宇多田ヒカル",
		cover: "assets/music/cover/One Last Kiss - 宇多田ヒカル.png",
		url: "assets/music/url/One Last Kiss - 宇多田ヒカル.mp3",
		duration: 0,
	},
	{
		id: 6,
		title: "勾指起誓",
		artist: "洛天依&ilem",
		cover: "assets/music/cover/勾指起誓 - 洛天依&ilem.png",
		url: "assets/music/url/勾指起誓 - 洛天依&ilem.mp3",
		duration: 0,
	},
	{
		id: 7,
		title: "夜の向日葵",
		artist: "szak",
		cover: "assets/music/cover/夜の向日葵 - szak.png",
		url: "assets/music/url/夜の向日葵 - szak.mp3",
		duration: 0,
	},
	{
		id: 8,
		title: "春日影",
		artist: "MyGO!!!!!",
		cover: "assets/music/cover/春日影 - MyGO!!!!!.png",
		url: "assets/music/url/春日影 - MyGO!!!!!.mp3",
		duration: 0,
	},
	{
		id: 9,
		title: "枫",
		artist: "周杰伦",
		cover: "assets/music/cover/枫 - 周杰伦.png",
		url: "assets/music/url/枫 - 周杰伦.mp3",
		duration: 0,
	},
	{
		id: 10,
		title: "鳥の詩",
		artist: "Lia",
		cover: "assets/music/cover/鳥の詩 - Lia.png",
		url: "assets/music/url/鳥の詩 - Lia.mp3",
		duration: 0,
	},
];

export const DEFAULT_SONG: Song = {
	title: "Sample Song",
	artist: "Sample Artist",
	cover: "/favicon/favicon.ico",
	url: "",
	duration: 0,
	id: 0,
};

export const DEFAULT_METING_API =
	"https://www.bilibili.uno/api?server=:server&type=:type&id=:id&auth=:auth&r=:r";
export const DEFAULT_METING_ID = "14164869977";
export const DEFAULT_METING_SERVER = "netease";
export const DEFAULT_METING_TYPE = "playlist";

export const ERROR_DISPLAY_DURATION = 3000;
export const SKIP_ERROR_DELAY = 1000;
