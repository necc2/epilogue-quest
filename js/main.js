
/* =================================
   EPILOGUE QUEST
   ゲーム基本管理
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

// セーブ
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
      <h2>冒険のはじまり</h2>
      <p>物語の、その先へ。</p>

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
        <p>仲間を準備しています...</p>
        <p>最大3人まで編成できます。</p>
      </div>

      <div class="idle-box">
        <h3>放置報酬</h3>
        <p>冒険していない間も報酬が貯まります。</p>
        <p>最大8時間まで蓄積されます。</p>
      </div>

      <div class="character-list">
        <h3>キャラクター一覧</h3>
        <p>登録キャラクター：${characterMaster.length}名</p>

        <div class="character-grid">
          ${characterMaster.map(character => `
            <div class="character-card">
              <div class="character-icon">✦</div>
              <strong>${character.name}</strong>
              <span>ID：${character.id}</span>
              <span>${character.element || "属性未設定"}</span>
              <span>${character.role || "役割未設定"}</span>
            </div>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

// 起動
function startGame() {
  renderHome();
  saveGameData();
  console.log("EPILOGUE QUEST 起動！");
}

startGame();
