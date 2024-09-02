// script.js
const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];

const stopButtons = [
    document.getElementById('stop1'),
    document.getElementById('stop2'),
    document.getElementById('stop3')
];

const rerollButton = document.getElementById('reroll');
const startButton = document.getElementById('start');
const betInput = document.getElementById('bet');
const moneyDisplay = document.getElementById('money');
const messageDisplay = document.getElementById('message');
const controlsContainer = document.querySelector('.controls');

const symbols = ['A', 'B', 'C', 'D']; // EとFを削除
let intervals = [null, null, null];
let money = 100;
let currentBet = 0;

const payoutMultipliers = {
    'A': 5,
    'B': 3,
    'C': 2,
    'D': 1
};

// リールの初期表示を設定（スタート前に動かないように）
function resetReels() {
    for (let i = 0; i < reels.length; i++) {
        reels[i].textContent = symbols[0];
        reels[i].style.animation = 'none';
    }
}

// リールを回転させる関数
function startReel(reelIndex) {
    intervals[reelIndex] = setInterval(() => {
        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        reels[reelIndex].textContent = randomSymbol;
    }, 100);
}

// リールを停止させる関数
function stopReel(reelIndex) {
    clearInterval(intervals[reelIndex]);
    intervals[reelIndex] = null; // リールの回転を停止
    reels[reelIndex].style.animation = 'none'; // スムーズに止める
    checkAllReelsStopped();
}

// すべてのリールを回転させる関数
function startAllReels() {
    for (let i = 0; i < reels.length; i++) {
        reels[i].style.animation = 'spin 0.1s linear infinite';
        startReel(i);
    }
}

// すべてのリールが停止したかチェックする関数
function checkAllReelsStopped() {
    if (intervals.every(interval => interval === null)) { // 全てのリールが停止したら
        enableStopButtons(false);
        checkWin();
        startButton.disabled = false;
        rerollButton.disabled = false; // 再ロールボタンを有効化
    }
}

// 勝利をチェックする関数
function checkWin() {
    const result = reels.map(reel => reel.textContent);
    if (result[0] === result[1] && result[1] === result[2]) {
        const symbol = result[0];
        const multiplier = payoutMultipliers[symbol];
        const winnings = currentBet * multiplier;
        messageDisplay.textContent = `おめでとう！ あなたは ${winnings} コインを獲得しました！`;
        money += winnings;
    } else {
        messageDisplay.textContent = "残念、もう一度挑戦しましょう。";
    }
    moneyDisplay.textContent = money;
}

// 再ロールを処理する関数
function handleReroll() {
    if (money >= currentBet) { // 再ロールには現在のベット額を消費
        money -= currentBet;
        moneyDisplay.textContent = money;
        messageDisplay.textContent = "";
        startAllReels();
        enableStopButtons(true);
        rerollButton.disabled = true;
    } else {
        messageDisplay.textContent = "お金が足りません。";
    }
}

// ストップボタンを有効/無効にする関数
function enableStopButtons(enabled) {
    stopButtons.forEach(button => button.disabled = !enabled);
}

// スタートボタンを処理する関数
function handleStart() {
    currentBet = parseInt(betInput.value);
    if (money >= currentBet) {
        money -= currentBet;
        moneyDisplay.textContent = money;
        messageDisplay.textContent = "";
        startAllReels();
        enableStopButtons(true);
        startButton.disabled = true;
        rerollButton.disabled = true;

        // スタートボタンを消し、ベット欄を中央に寄せる
        controlsContainer.classList.add('hidden-start');
    } else {
        messageDisplay.textContent = "お金が足りません。";
    }
}

// 初期設定：リールをリセットしてストップボタンを無効化
resetReels();
enableStopButtons(false);
rerollButton.disabled = true;

// スタートボタンのイベントリスナー
startButton.addEventListener('click', handleStart);

// 各リールのストップボタンのイベントリスナー
for (let i = 0; i < reels.length; i++) {
    stopButtons[i].addEventListener('click', () => {
        stopReel(i);
    });
}

// 再ロールボタンのイベントリスナー
rerollButton.addEventListener('click', handleReroll);
