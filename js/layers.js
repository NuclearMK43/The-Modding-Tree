addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#00CDFF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('p', 21)) mult = mult.times(upgradeEffect('p', 21))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            title: "Begin",
            description: "Start generating points",
            cost: new Decimal(1),
        },
        12: {
            title: "Improved Production",
            description: "generate points 50% faster",
            cost: new Decimal(1),
            unlocked() {
                if (hasUpgrade('p', 11))
                 return true
                else
                 return false
            }
        },
        13: {
            title: "Production synergy",
            description: "Prestige points boost point production",
            cost: new Decimal(2),
            effect() {
                let eff = new Decimal(player[this.layer].points.add(1).pow(0.5))
                if (hasUpgrade('p', 23)) eff = eff.times(upgradeEffect('p', 23))
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {
                if (hasUpgrade('p', 11))
                 return true
                else
                 return false
            }
        },
        21: {
            title: "Reverse synergy",
            description: "Points boost prestige point production",
            cost: new Decimal(5),
            effect() {
                let eff = new Decimal(player.points.add(1).pow(0.15))
                if (hasUpgrade('p', 23)) eff = eff.times(upgradeEffect('p', 23))
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {
                if (hasUpgrade('p', 12))
                 return true
                else
                 return false
            }
        },
        22: {
            title: "Self synergy",
            description: "Points boost their own production",
            cost: new Decimal(8),
            effect() {
                let eff = new Decimal(player.points.add(1).pow(0.075))
                if (hasUpgrade('p', 23)) eff = eff.times(upgradeEffect('p', 23))
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {
                if (hasUpgrade('p', 21))
                 return true
                else
                 return false
            }
        },
        23: {
            title: "Synergy synergy",
            description: "Prestige points and points boost synergy effects",
            cost: new Decimal(15),
            effect() {
                return player.points.add(1).pow(0.3).add(player[this.layer].points).pow(0.1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {
                if (hasUpgrade('p', 22) && hasUpgrade('p', 13))
                 return true
                else
                 return false
            }
        },
    }
})
