/// スロットマシンのリール要素を取得
const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];

/// リール停止ボタンを取得
const stopButtons = [
    document.getElementById('stop1'),
    document.getElementById('stop2'),
    document.getElementById('stop3')
];

/// リトライボタン、スタートボタン、ベット入力フィールドを取得
const rerollButton = document.getElementById('reroll');
const startButton = document.getElementById('start');
const betInput = document.getElementById('bet');

/// 所持金やメッセージを表示する要素を取得
const moneyDisplay = document.getElementById('money');
const messageDisplay = document.getElementById('message');
const controlsContainer = document.querySelector('.controls');

/// スロットマシンで使用するシンボルの定義
const symbols = ['A', 'B', 'C', 'D'];

/// リールの回転を管理するためのタイマー
let intervals = [null, null, null];

/// ゲーム開始時の所持金を設定
let money = 10000;

/// 現在のベット額を保持する変数
let currentBet = 0;

/// 役と倍率のマッピングを定義
const payoutMultipliers = {
    'AAA': 4,
    'BBB': 3,
    'CCC': 2,
    'DDD': 1,
    'ABC': 5,
    'ACB': 3,
    'BAC': 3,
    'BCA': 3,
    'CAB': 3,
    'CBA': 3
};

/// 最高記録をローカルストレージから取得して表示
let highestMoney = localStorage.getItem('highestMoney') || 0;
document.getElementById('highest-money').textContent = highestMoney;

/// リールの表示を初期状態にリセットする関数
function resetReels() {
    for (let i = 0; i < reels.length; i++) {
        reels[i].innerHTML = `<span>${symbols[0]}</span>`;
        reels[i].style.animation = 'none';
        reels[i].classList.remove('stopping', 'win-animation', 'lose-animation', 'spin');
    }
}

/// リールの回転を開始する関数
function startReel(reelIndex) {
    reels[reelIndex].classList.add('spin'); /// 回転アニメーションを追加
    intervals[reelIndex] = setInterval(() => {
        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        reels[reelIndex].innerHTML = `<span>${randomSymbol}</span>`;
    }, 250);
}

/// リールの回転を停止する関数
function stopReel(reelIndex) {
    clearInterval(intervals[reelIndex]);
    intervals[reelIndex] = null;
    reels[reelIndex].classList.remove('spin'); /// 回転アニメーションを削除
    reels[reelIndex].classList.add('stopping'); /// 停止アニメーションを追加
    checkAllReelsStopped();
}

/// 全リールの回転を開始する関数
function startAllReels() {
    for (let i = 0; i < reels.length; i++) {
        startReel(i);
    }
}

/// 全てのリールが停止したかを確認し、停止後の処理を行う関数
function checkAllReelsStopped() {
    if (intervals.every(interval => interval === null)) {
        enableStopButtons(false); /// 停止ボタンを無効化
        checkWin(); /// 勝敗の確認
        startButton.disabled = false; /// スタートボタンを有効化
        rerollButton.disabled = false; /// リトライボタンを有効化
        betInput.disabled = false; /// ベット額の変更を再び許可
    }
}

/// スロットの結果に基づいて勝敗を判定し、所持金を更新する関数
function checkWin() {
    const result = reels.map(reel => reel.textContent).join('');
    let winnings = 0;

    /// 結果に対応するペイアウト倍率が存在する場合、獲得コインを計算
    if (payoutMultipliers[result]) {
        winnings = currentBet * payoutMultipliers[result];
    }

    /// 勝利時の処理
    if (winnings > 0) {
        messageDisplay.textContent = `おめでとう！ あなたは ${winnings} コインを獲得しました！`;
        reels.forEach(reel => reel.classList.add('win-animation')); /// 勝利アニメーション
    } else {
        /// 敗北時の処理
        messageDisplay.textContent = "残念、もう一度挑戦しましょう。";
        reels.forEach(reel => reel.classList.add('lose-animation')); /// 敗北アニメーション
    }

    /// 獲得したコインを所持金に追加
    money += winnings;
    moneyDisplay.textContent = money;
    betInput.max = money;

    /// 最高記録を更新
    if (money > highestMoney) {
        highestMoney = money;
        localStorage.setItem('highestMoney', highestMoney);
        document.getElementById('highest-money').textContent = highestMoney;
    }
}

/// リトライボタンが押された時の処理
function handleReroll() {
    // 現在のベット額を再取得
    currentBet = parseInt(betInput.value);

    // 現在のベット額でリトライが可能か確認
    if (money >= currentBet) {
        money -= currentBet;
        moneyDisplay.textContent = money;
        messageDisplay.textContent = "";
        startAllReels();
        enableStopButtons(true); // 停止ボタンを有効化
        rerollButton.disabled = true; // リトライボタンを無効化
        
        // リトライ時にベット額の変更を禁止
        betInput.disabled = true;
        
        // リトライ時にベット上限を更新
        betInput.max = money;
    } else {
        // 所持金が不足している場合の処理
        messageDisplay.textContent = "お金が足りません。";
    }
}

/// リール停止ボタンの有効化/無効化を行う関数
function enableStopButtons(enabled) {
    stopButtons.forEach(button => button.disabled = !enabled);
}

/// スタートボタンが押された時の処理
function handleStart() {
    /// 現在のベット額を取得
    currentBet = parseInt(betInput.value);
    
    /// ベット額が所持金を超えていないか確認
    if (money >= currentBet) {
        money -= currentBet;
        moneyDisplay.textContent = money;
        messageDisplay.textContent = "";
        startAllReels();
        enableStopButtons(true); /// 停止ボタンを有効化
        startButton.disabled = true; /// スタートボタンを無効化
        rerollButton.disabled = true; /// リトライボタンを無効化
        
        /// ベット額の変更を禁止
        betInput.disabled = true;

        controlsContainer.classList.add('hidden-start');
    } else {
        /// 所持金が不足している場合の処理
        messageDisplay.textContent = "お金が足りません。";
    }
}

/// 初期設定: リールリセット、停止ボタン無効化、リトライボタン無効化
resetReels();
enableStopButtons(false);
rerollButton.disabled = true;
betInput.max = money;

/// スタートボタンにイベントリスナーを追加
startButton.addEventListener('click', handleStart);

/// 各リール停止ボタンにイベントリスナーを追加
for (let i = 0; i < reels.length; i++) {
    stopButtons[i].addEventListener('click', () => {
        stopReel(i);
    });
}

/// リトライボタンにイベントリスナーを追加
rerollButton.addEventListener('click', handleReroll);

/// ベット額入力フィールドにイベントリスナーを追加
betInput.addEventListener('input', () => {
    /// 所持金を超えるベット額が入力された場合、最大ベット額に設定
    if (parseInt(betInput.value) > money) {
        betInput.value = money;
    }
});
