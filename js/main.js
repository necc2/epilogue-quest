
/* =================================
   EPILOGUE QUEST
   ゲーム基本管理
================================= */

// ゲーム初期データ
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
    console.error("セーブデータの読み込みに失敗:", error);
  }

  return { ...defaultGameData };
}

// ゲームデータ
let gameData = loadGameData();

// セーブ
function saveGameData() {
  localStorage.setItem(
    "epilogueQuestSave",
    JSON.stringify(gameData)
  );
}

// ホーム画面表示
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

    </section>
  `;
}

// ゲーム起動
function startGame() {
  renderHome();
  saveGameData();

  console.log("EPILOGUE QUEST 起動！");
}

// 実行
startGame();
