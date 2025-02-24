class IdleGame {
    constructor() {
        this.resources = 0;
        this.clickPower = 1;
        this.autoClickerCount = 0;
        this.autoClickerCost = 10;
        this.autoClickerPower = 1;

        this.clickButton = document.getElementById('clickButton');
        this.resourcesDisplay = document.getElementById('resources');
        this.upgradesContainer = document.getElementById('upgrades');

        this.clickButton.addEventListener('click', () => this.click());
        this.createUpgradeButton();

        setInterval(() => this.autoClick(), 1000);
    }

    click() {
        this.resources += this.clickPower;
        this.updateDisplay();
    }

    autoClick() {
        this.resources += this.autoClickerCount * this.autoClickerPower;
        this.updateDisplay();
    }

    buyAutoClicker() {
        if (this.resources >= this.autoClickerCost) {
            this.resources -= this.autoClickerCost;
            this.autoClickerCount++;
            this.autoClickerCost = Math.ceil(this.autoClickerCost * 1.15);
            this.updateDisplay();
            this.createUpgradeButton();
        }
    }

    createUpgradeButton() {
        this.upgradesContainer.innerHTML = `
            <button id="buyAutoClicker">
                Buy Auto Clicker (Cost: ${this.autoClickerCost})
            </button>
        `;
        document.getElementById('buyAutoClicker').addEventListener('click', () => this.buyAutoClicker());
    }

    updateDisplay() {
        this.resourcesDisplay.textContent = Math.floor(this.resources);
    }
}

const game = new IdleGame();
