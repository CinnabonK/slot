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

const symbols = ['A', 'B', 'C', 'D'];
let intervals = [null, null, null];
let money = 10000;
let currentBet = 0;

const payoutMultipliers = {
    'A': 5,
    'B': 3,
    'C': 2,
    'D': 1
};

function resetReels() {
    for (let i = 0; i < reels.length; i++) {
        reels[i].textContent = symbols[0];
        reels[i].style.animation = 'none';
    }
}

function startReel(reelIndex) {
    intervals[reelIndex] = setInterval(() => {
        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        reels[reelIndex].textContent = randomSymbol;
    }, 100);
}

function stopReel(reelIndex) {
    clearInterval(intervals[reelIndex]);
    intervals[reelIndex] = null;
    reels[reelIndex].style.animation = 'none';
    checkAllReelsStopped();
}

function startAllReels() {
    for (let i = 0; i < reels.length; i++) {
        reels[i].style.animation = 'spin 0.1s linear infinite';
        startReel(i);
    }
}

function checkAllReelsStopped() {
    if (intervals.every(interval => interval === null)) {
        enableStopButtons(false);
        checkWin();
        startButton.disabled = false;
        rerollButton.disabled = false;
    }
}

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
    betInput.max = money;  // ベット額の最大値を更新
}

function handleReroll() {
    if (money >= currentBet) {
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

function enableStopButtons(enabled) {
    stopButtons.forEach(button => button.disabled = !enabled);
}

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

        controlsContainer.classList.add('hidden-start');
    } else {
        messageDisplay.textContent = "お金が足りません。";
    }
}

resetReels();
enableStopButtons(false);
rerollButton.disabled = true;
betInput.max = money; // 初期ベットの最大値を設定

startButton.addEventListener('click', handleStart);

for (let i = 0; i < reels.length; i++) {
    stopButtons[i].addEventListener('click', () => {
        stopReel(i);
    });
}

rerollButton.addEventListener('click', handleReroll);
