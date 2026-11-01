
/* =================================
   EPILOGUE QUEST
   キャラクターデータベース
================================= */

const characterMaster = [
  {
    id: "01",
    name: "ゆうきちゃん",
    element: "闇",
    role: "アタッカー",
    skill: {
      name: "デーモンフレイム",
      description: "魔王の炎で敵を焼き尽くす",
      chance: 0.20,
      effect: "敵全体に攻撃力の200%の闇属性ダメージ"
    }
  },
  { id: "02", name: "らむ" },
  { id: "03", name: "Momo" },
  { id: "04", name: "菜月" },
  {
    id: "05",
    name: "だーりん",
    image: "images/05(仮).png"
  },
  { id: "06", name: "むあ" },
  { id: "07", name: "りせ" },
  { id: "08", name: "香守 笑凛" },
  {
    id: "09",
    name: "来栖 みお",
    image: "images/09(仮).png",
    element: "水",
    role: "サポーター",
    skill: {
      name: "アイドルの輝き",
      description: "みんなを引っ張る頑張りっ子",
      chance: 0.20,
      effect: "味方全体の攻撃力・防御力・素早さを50%上昇"
    }
  },
  { id: "10", name: "るぅあ" },
  {
    id: "11",
    name: "Mona",
    image: "images/11(仮).png",
    element: "光",
    role: "ヒーラー",
    skill: {
      name: "もなの息吹",
      description: "味方全体の治癒",
      chance: 0.20,
      effect: "味方全体に毎ターン最大HPの20%を回復する再生効果"
    }
  },
  {
    id: "12",
    name: "鈴猫",
    image: "images/12(仮).png"
  },
  { id: "13", name: "ちゆ" },
  {
    id: "14",
    name: "雨宮 憂",
    image: "images/14(仮).png"
  }
];

// キャラクターIDから情報を取得
function getCharacterById(id) {
  return characterMaster.find(character => character.id === id);
}
