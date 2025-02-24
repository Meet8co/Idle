class SpaceMiningColony {
    constructor() {
        this.minerals = 0;
        this.energy = 0;
        this.clickPower = 1;
        this.autoMiners = 0;
        this.solarPanels = 0;
        this.upgrades = {
            autoMiner: { count: 0, cost: 10, power: 1 },
            solarPanel: { count: 0, cost: 15, power: 1 },
            drill: { count: 0, cost: 50, power: 1 },
            energyStorage: { count: 0, cost: 100, capacity: 100 }
        };

        this.mineButton = document.getElementById('mineButton');
        this.mineralsDisplay = document.getElementById('minerals');
        this.energyDisplay = document.getElementById('energy');
        this.upgradesContainer = document.getElementById('upgrades');
        this.saveButton = document.getElementById('saveButton');
        this.loadButton = document.getElementById('loadButton');

        this.mineButton.addEventListener('click', () => this.mine());
        this.saveButton.addEventListener('click', () => this.saveGame());
        this.loadButton.addEventListener('click', () => this.loadGame());

        this.createUpgradeButtons();

        setInterval(() => this.update(), 1000);
    }

    mine() {
        this.minerals += this.clickPower;
        this.updateDisplay();
    }

    update() {
        this.minerals += this.upgrades.autoMiner.count * this.upgrades.autoMiner.power;
        this.energy += this.upgrades.solarPanel.count * this.upgrades.solarPanel.power;
        this.energy = Math.min(this.energy, this.getEnergyCapacity());
        this.updateDisplay();
    }

    buyUpgrade(upgradeType) {
        const upgrade = this.upgrades[upgradeType];
        if (this.minerals >= upgrade.cost) {
            this.minerals -= upgrade.cost;
            upgrade.count++;
            upgrade.cost = Math.ceil(upgrade.cost * 1.15);
            
            if (upgradeType === 'drill') {
                this.clickPower++;
            }

            this.updateDisplay();
            this.createUpgradeButtons();
        }
    }

    getEnergyCapacity() {
        return 100 + (this.upgrades.energyStorage.count * this.upgrades.energyStorage.capacity);
    }

    createUpgradeButtons() {
        this.upgradesContainer.innerHTML = '';
        for (const [type, upgrade] of Object.entries(this.upgrades)) {
            const button = document.createElement('button');
            button.textContent = `Buy ${type} (Cost: ${upgrade.cost} minerals)`;
            button.addEventListener('click', () => this.buyUpgrade(type));
            this.upgradesContainer.appendChild(button);
        }
    }

    updateDisplay() {
        this.mineralsDisplay.textContent = Math.floor(this.minerals);
        this.energyDisplay.textContent = `${Math.floor(this.energy)} / ${this.getEnergyCapacity()}`;
    }

    saveGame() {
        const gameState = {
            minerals: this.minerals,
            energy: this.energy,
            clickPower: this.clickPower,
            upgrades: this.upgrades
        };
        localStorage.setItem('spaceMiningColonySave', JSON.stringify(gameState));
        alert('Game saved!');
    }

    loadGame() {
        const savedGame = localStorage.getItem('spaceMiningColonySave');
        if (savedGame) {
            const gameState = JSON.parse(savedGame);
            this.minerals = gameState.minerals;
            this.energy = gameState.energy;
            this.clickPower = gameState.clickPower;
            this.upgrades = gameState.upgrades;
            this.updateDisplay();
            this.createUpgradeButtons();
            alert('Game loaded!');
        } else {
            alert('No saved game found!');
        }
    }
}

const game = new SpaceMiningColony();
