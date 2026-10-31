/* =================================
   EPILOGUE QUEST
   ゲーム基本管理・画面切り替え
================================= */

const defaultGameData = {
  coins: 3000,
  jewels: 300,
  currentArea: 1,
  currentStage: 1,
  highestEndlessFloor: 0,
  characters: [],
  party: [],
  clearedStages: [],
  lastLoginDate: null,
  lastIdleClaim: Date.now()
};

// セーブデータ読み込み
function loadGameData() {
  try {
    const saved = localStorage.getItem("epilogueQuestSave");

    if (saved) {
      return {
        ...defaultGameData,
        ...JSON.parse(saved)
      };
    }
  } catch (error) {
    console.error("セーブデータ読み込みエラー:", error);
  }

  return { ...defaultGameData };
}

let gameData = loadGameData();

function saveGameData() {
  localStorage.setItem(
    "epilogueQuestSave",
    JSON.stringify(gameData)
  );
}

// ホーム画面
function renderHome() {
  const content = document.getElementById("game-content");

  content.innerHTML = `
    <section class="home-screen">

      <div class="resource-area">
        <div class="resource-box">
          <span>所持コイン</span>
          <strong>${gameData.coins.toLocaleString()}</strong>
        </div>

        <div class="resource-box">
          <span>所持ジュエル</span>
          <strong>${gameData.jewels.toLocaleString()}</strong>
        </div>
      </div>

      <div class="stage-box">
        <span>現在の冒険地点</span>
        <strong>
          AREA ${gameData.currentArea}
          - STAGE ${gameData.currentStage}
        </strong>
      </div>

      <div id="party-area">
        <h3>冒険パーティー</h3>
        <div class="party-slots">
          <div class="party-slot">仲間 1</div>
          <div class="party-slot">仲間 2</div>
          <div class="party-slot">仲間 3</div>
        </div>
      </div>

      <div class="idle-box">
        <h3>放置報酬</h3>
        <p>冒険していない間に貯まった報酬を受け取れます。</p>
        <button disabled>準備中</button>
      </div>

    </section>
  `;
}

// キャラクター一覧
function renderCharacters() {
  const content = document.getElementById("game-content");

  content.innerHTML = `
    <section class="home-screen">
      <h2>キャラクター</h2>
      <p>仲間たちの情報を確認できます。</p>

      <div class="character-grid">
        ${characterMaster.map(character => `
          <button
            class="character-card"
            onclick="showCharacterDetail('${character.id}')"
          >
            <div class="character-icon">✦</div>
            <strong>${character.name}</strong>
            <span>ID：${character.id}</span>
            <span>${character.element || "属性未設定"}</span>
            <span>${character.role || "役割未設定"}</span>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

// キャラクター詳細
function showCharacterDetail(id) {
  const character = getCharacterById(id);

  if (!character) return;

  const content = document.getElementById("game-content");

  content.innerHTML = `
    <section class="home-screen">
      <button onclick="renderCharacters()">← 一覧に戻る</button>

      <div class="character-icon">✦</div>
      <h2>${character.name}</h2>
      <p>ID：${character.id}</p>

      <div class="stage-box">
        <span>属性</span>
        <strong>${character.element || "未設定"}</strong>
      </div>

      <div class="stage-box">
        <span>役割</span>
        <strong>${character.role || "未設定"}</strong>
      </div>

      <div class="idle-box">
        <h3>スキル情報</h3>
        <p>${character.skill ? character.skill.name : "未設定"}</p>
        <p>${character.skill ? character.skill.description : "スキル情報は準備中です。"}</p>
        <p>${character.skill ? character.skill.effect : ""}</p>
      </div>

      <p>ステータス・育成機能は準備中です。</p>
    </section>
  `;
}

// 冒険画面
function renderAdventure() {
  const content = document.getElementById("game-content");

  let areaHTML = "";

  for (let area = 1; area <= 3; area++) {
    const areaUnlocked = area <= gameData.currentArea;

    let stagesHTML = "";

    for (let stage = 1; stage <= 5; stage++) {
      const stageKey = `${area}-${stage}`;
      const cleared = gameData.clearedStages.includes(stageKey);

      const unlocked =
        areaUnlocked &&
        (
          area < gameData.currentArea ||
          stage <= gameData.currentStage ||
          cleared
        );

      const boss = stage === 5;

      stagesHTML += `
        <button
          class="stage-box"
          ${unlocked
            ? `onclick="selectStage(${area}, ${stage})"`
            : "disabled"}
        >
          <strong>
            ${boss ? "BOSS " : "STAGE "}
            ${stage}
          </strong>
          <span>
            ${
              cleared
                ? "攻略済み"
                : unlocked
                  ? "挑戦可能"
                  : "未解放"
            }
          </span>
        </button>
      `;
    }

    areaHTML += `
      <div class="home-screen">
        <h3>
          AREA ${area}
          ${areaUnlocked ? "" : "（未解放）"}
        </h3>

        <div class="stage-list">
          ${stagesHTML}
        </div>
      </div>
    `;
  }

  content.innerHTML = `
    <section>
      <h2>冒険</h2>
      <p>エリアを選択してステージに挑戦します。</p>

      <div class="stage-box">
        <span>現在の攻略地点</span>
        <strong>
          AREA ${gameData.currentArea}
          - STAGE ${gameData.currentStage}
        </strong>
      </div>

      ${areaHTML}

      <p>※戦闘機能は準備中です。</p>
    </section>
  `;
}

// ステージ選択
function selectStage(area, stage) {
  const stageKey = `${area}-${stage}`;

  const unlocked =
    area <= gameData.currentArea &&
    (
      area < gameData.currentArea ||
      stage <= gameData.currentStage ||
      gameData.clearedStages.includes(stageKey)
    );

  if (!unlocked) return;

  gameData.selectedArea = area;
  gameData.selectedStage = stage;

  saveGameData();

  const content = document.getElementById("game-content");

  content.innerHTML = `
    <section class="home-screen">
      <button onclick="renderAdventure()">← ステージ一覧に戻る</button>

      <h2>ステージ選択</h2>

      <div class="stage-box">
        <span>選択中のステージ</span>
        <strong>AREA ${area} - STAGE ${stage}</strong>
      </div>

      <p>${stage === 5 ? "ボスステージ" : "通常ステージ"}</p>
      <p>戦闘機能は準備中です。</p>
    </section>
  `;
}

// その他の画面
function renderPage(page) {
  const content = document.getElementById("game-content");

  const pages = {
    gacha: {
      title: "ガチャ",
      description: "新しい仲間と出会う画面です。"
    },
    encyclopedia: {
      title: "図鑑",
      description: "登場キャラクターを確認する画面です。"
    }
  };

  const selected = pages[page];

  if (!selected) {
    renderHome();
    return;
  }

  content.innerHTML = `
    <section class="home-screen">
      <h2>${selected.title}</h2>
      <p>${selected.description}</p>
      <p>この機能は現在準備中です。</p>
    </section>
  `;
}

// メニュー切り替え
function setupNavigation() {
  const buttons = document.querySelectorAll(".bottom-nav button");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const page = button.dataset.page;

      buttons.forEach(item => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      if (page === "home") {
        renderHome();
      } else if (page === "characters") {
        renderCharacters();
      } else if (page === "adventure") {
        renderAdventure();
      } else {
        renderPage(page);
      }
    });
  });
}

// ゲーム起動
function startGame() {
  renderHome();
  setupNavigation();
  saveGameData();

  const homeButton = document.querySelector(
    '.bottom-nav button[data-page="home"]'
  );

  if (homeButton) {
    homeButton.classList.add("active");
  }

  console.log("EPILOGUE QUEST 起動！");
}

// =================================
// ガチャ機能
// =================================

// レアリティ設定
const rarityRates = [
  { rarity: "N", rate: 45 },
  { rarity: "R", rate: 32 },
  { rarity: "SR", rate: 20 },
  { rarity: "SSR", rate: 3 }
];

const rarityOrder = {
  N: 1,
  R: 2,
  SR: 3,
  SSR: 4
};

// 重複時の欠片数
const duplicateFragments = {
  N: 2,
  R: 5,
  SR: 12,
  SSR: 30
};

// ガチャ抽選
function drawRarity() {
  const random = Math.random() * 100;
  let total = 0;

  for (const item of rarityRates) {
    total += item.rate;

    if (random < total) {
      return item.rarity;
    }
  }

  return "N";
}

// キャラクター抽選
function drawCharacter() {
  const character =
    characterMaster[
      Math.floor(Math.random() * characterMaster.length)
    ];

  const rarity = drawRarity();

  if (!gameData.ownedCharacters) {
    gameData.ownedCharacters = {};
  }

  if (!gameData.fragments) {
    gameData.fragments = {};
  }

  const owned = gameData.ownedCharacters[character.id];

  let resultText = "新しい仲間が加入！";

  if (!owned) {
    gameData.ownedCharacters[character.id] = {
      rarity: rarity,
      level: 1
    };
  } else {
    const oldRarity = owned.rarity;

    if (rarityOrder[rarity] > rarityOrder[oldRarity]) {
      owned.rarity = rarity;
      resultText = `${oldRarity}から${rarity}に進化！`;
    } else {
      const fragments = duplicateFragments[oldRarity];

      gameData.fragments[character.id] =
        (gameData.fragments[character.id] || 0) + fragments;

      resultText = `重複！欠片${fragments}個を獲得`;
    }
  }

  return {
    name: character.name,
    rarity: rarity,
    message: resultText
  };
}

// ガチャ実行
function performGacha(count) {
  const cost = count === 10 ? 900 : 100;

  if (gameData.jewels < cost) {
    alert("ジュエルが足りません！");
    return;
  }

  gameData.jewels -= cost;

  const results = [];

  for (let i = 0; i < count; i++) {
    results.push(drawCharacter());
  }

  saveGameData();
  renderGachaResults(results);
}

// ガチャ結果表示
function renderGachaResults(results) {
  const content = document.getElementById("game-content");

  content.innerHTML = `
    <section class="home-screen">
      <h2>ガチャ結果</h2>

      ${results.map(result => `
        <div class="stage-box">
          <strong>${result.name}</strong>
          <span>レアリティ：${result.rarity}</span>
          <span>${result.message}</span>
        </div>
      `).join("")}

      <button onclick="renderGacha()">ガチャ画面に戻る</button>
    </section>
  `;
}

// ガチャ画面
function renderGacha() {
  const content = document.getElementById("game-content");

  content.innerHTML = `
    <section class="home-screen">
      <h2>通常ガチャ</h2>

      <p>所持ジュエル：${gameData.jewels.toLocaleString()}</p>

      <div class="stage-box">
        <strong>レアリティ提供割合</strong>
        <span>N：45%</span>
        <span>R：32%</span>
        <span>SR：20%</span>
        <span>SSR：3%</span>
      </div>

      <button onclick="performGacha(1)">
        1回引く（100ジュエル）
      </button>

      <button onclick="performGacha(10)">
        10連ガチャ（900ジュエル）
      </button>
    </section>
  `;
}

// ガチャ画面への切り替え
function renderPage(page) {
  if (page === "gacha") {
    renderGacha();
    return;
  }

  const content = document.getElementById("game-content");

  const pages = {
    encyclopedia: {
      title: "図鑑",
      description: "登場キャラクターを確認する画面です。"
    }
  };

  const selected = pages[page];

  if (!selected) {
    renderHome();
    return;
  }

  content.innerHTML = `
    <section class="home-screen">
      <h2>${selected.title}</h2>
      <p>${selected.description}</p>
      <p>この機能は現在準備中です。</p>
    </section>
  `;
}
startGame();
