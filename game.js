class SpaceMiningEmpire {
    constructor() {
        this.minerals = 0;
        this.energy = 0;
        this.darkMatter = 0;
        this.clickPower = 1;
        this.upgrades = {
            autoMiner: { count: 0, cost: 10, power: 1 },
            solarPanel: { count: 0, cost: 15, power: 1 },
            drill: { count: 0, cost: 50, power: 1 },
            energyStorage: { count: 0, cost: 100, capacity: 100 },
            mineralRefinery: { count: 0, cost: 200, power: 1 },
            fusionReactor: { count: 0, cost: 500, power: 5 },
        };
        this.techTree = {
            improvedMining: { unlocked: false, cost: 1, effect: 2 },
            efficientEnergy: { unlocked: false, cost: 2, effect: 2 },
            advancedDrilling: { unlocked: false, cost: 3, effect: 3 },
            darkMatterExtraction: { unlocked: false, cost: 5, effect: 0.1 },
        };

        this.initializeDOM();
        this.createUpgradeButtons();
        this.createTechTree();

        setInterval(() => this.update(), 1000);
    }

    initializeDOM() {
        this.mineButton = document.getElementById('mineButton');
        this.mineralsDisplay = document.getElementById('minerals');
        this.energyDisplay = document.getElementById('energy');
        this.darkMatterDisplay = document.getElementById('darkMatter');
        this.upgradesContainer = document.getElementById('upgrades');
        this.techTreeContainer = document.getElementById('techTree');
        this.saveButton = document.getElementById('saveButton');
        this.loadButton = document.getElementById('loadButton');
        this.rebirthButton = document.getElementById('rebirthButton');
        this.darkMatterGainDisplay = document.getElementById('darkMatterGain');

        this.mineButton.addEventListener('click', () => this.mine());
        this.saveButton.addEventListener('click', () => this.saveGame());
        this.loadButton.addEventListener('click', () => this.loadGame());
        this.rebirthButton.addEventListener('click', () => this.rebirth());
    }

    mine() {
        this.minerals += this.clickPower;
        this.updateDisplay();
    }

    update() {
        this.minerals += this.getAutoMinerProduction();
        this.energy += this.getEnergyProduction();
        this.energy = Math.min(this.energy, this.getEnergyCapacity());
        this.updateDisplay();
    }

    getAutoMinerProduction() {
        let production = this.upgrades.autoMiner.count * this.upgrades.autoMiner.power;
        production += this.upgrades.mineralRefinery.count * this.upgrades.mineralRefinery.power;
        if (this.techTree.improvedMining.unlocked) production *= this.techTree.improvedMining.effect;
        return production;
    }

    getEnergyProduction() {
        let production = this.upgrades.solarPanel.count * this.upgrades.solarPanel.power;
        production += this.upgrades.fusionReactor.count * this.upgrades.fusionReactor.power;
        if (this.techTree.efficientEnergy.unlocked) production *= this.techTree.efficientEnergy.effect;
        return production;
    }

    getEnergyCapacity() {
        return 100 + (this.upgrades.energyStorage.count * this.upgrades.energyStorage.capacity);
    }

    buyUpgrade(upgradeType) {
        const upgrade = this.upgrades[upgradeType];
        if (this.minerals >= upgrade.cost) {
            this.minerals -= upgrade.cost;
            upgrade.count++;
            upgrade.cost = Math.ceil(upgrade.cost * 1.15);
            
            if (upgradeType === 'drill') {
                this.clickPower++;
                if (this.techTree.advancedDrilling.unlocked) {
                    this.clickPower += this.techTree.advancedDrilling.effect - 1;
                }
            }

            this.updateDisplay();
            this.createUpgradeButtons();
        }
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

    createTechTree() {
        this.techTreeContainer.innerHTML = '';
        for (const [tech, details] of Object.entries(this.techTree)) {
            const button = document.createElement('button');
            button.textContent = `${tech} (Cost: ${details.cost} Dark Matter)`;
            button.disabled = details.unlocked;
            button.addEventListener('click', () => this.unlockTech(tech));
            this.techTreeContainer.appendChild(button);
        }
    }

    unlockTech(tech) {
        const techDetails = this.techTree[tech];
        if (!techDetails.unlocked && this.darkMatter >= techDetails.cost) {
            this.darkMatter -= techDetails.cost;
            techDetails.unlocked = true;
            this.updateDisplay();
            this.createTechTree();
        }
    }

    calculateDarkMatterGain() {
        return Math.floor(Math.sqrt(this.minerals / 1e6));
    }

    rebirth() {
        const darkMatterGain = this.calculateDarkMatterGain();
        if (darkMatterGain > 0) {
            this.darkMatter += darkMatterGain;
            this.minerals = 0;
            this.energy = 0;
            this.clickPower = 1;
            for (const upgrade of Object.values(this.upgrades)) {
                upgrade.count = 0;
                upgrade.cost = Math.ceil(upgrade.cost / 1.15);
            }
            this.updateDisplay();
            this.createUpgradeButtons();
        }
    }

    updateDisplay() {
        this.mineralsDisplay.textContent = Math.floor(this.minerals);
        this.energyDisplay.textContent = `${Math.floor(this.energy)} / ${this.getEnergyCapacity()}`;
        this.darkMatterDisplay.textContent = Math.floor(this.darkMatter);
        this.darkMatterGainDisplay.textContent = this.calculateDarkMatterGain();
    }

    saveGame() {
        const gameState = {
            minerals: this.minerals,
            energy: this.energy,
            darkMatter: this.darkMatter,
            clickPower: this.clickPower,
            upgrades: this.upgrades,
            techTree: this.techTree
        };
        localStorage.setItem('spaceMiningEmpireSave', JSON.stringify(gameState));
        alert('Game saved!');
    }

    loadGame() {
        const savedGame = localStorage.getItem('spaceMiningEmpireSave');
        if (savedGame) {
            const gameState = JSON.parse(savedGame);
            this.minerals = gameState.minerals;
            this.energy = gameState.energy;
            this.darkMatter = gameState.darkMatter;
            this.clickPower = gameState.clickPower;
            this.upgrades = gameState.upgrades;
            this.techTree = gameState.techTree;
            this.updateDisplay();
            this.createUpgradeButtons();
            this.createTechTree();
            alert('Game loaded!');
        } else {
            alert('No saved game found!');
        }
    }
}

const game = new SpaceMiningEmpire();
