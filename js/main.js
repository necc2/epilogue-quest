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
        <button class="claim-button" disabled>準備中</button>
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

// その他の画面
function renderPage(page) {
  const content = document.getElementById("game-content");

  const pages = {
    adventure: {
      title: "冒険",
      description: "エリアやステージを選択する画面です。"
    },
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

startGame();
