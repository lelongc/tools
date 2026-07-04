import { combatState } from './combat.js?v=17';
import { ZONE_NAMES, getZone } from './world.js?v=17';

export function updateHUD(player) {
    // Update Zone Text
    const zoneNameEl = document.getElementById('hud-zone-name');
    if (zoneNameEl) {
        const zoneIdx = getZone(Math.floor((player.x + player.width/2) / 32));
        zoneNameEl.textContent = ZONE_NAMES[zoneIdx];
    }

    // Update HP Bar
    const hpBar = document.getElementById('hud-hp-bar');
    const hpText = document.getElementById('hud-hp-text');
    if (hpBar && hpText) {
        const hpPercent = Math.max(0, (combatState.hp / 100)) * 100;
        hpBar.style.width = hpPercent + '%';
        hpText.textContent = Math.floor(combatState.hp) + ' / 100';
    }

    // Update Mana/Energy Bar
    const manaBar = document.getElementById('hud-mana-bar');
    const manaText = document.getElementById('hud-mana-text');
    if (manaBar && manaText) {
        // Pseudo-mana based on bio-drill charge as a placeholder, or just 100%
        let manaPercent = 100;
        if (combatState.isCharging) {
            manaPercent = (combatState.chargeTime / 1.0) * 100;
        }
        manaPercent = Math.min(100, Math.max(0, manaPercent));
        manaBar.style.width = manaPercent + '%';
        manaText.textContent = Math.floor(manaPercent) + '%';
    }

    // Update Cooldown Overlays
    const cdDash = document.getElementById('cd-dash');
    if (cdDash) {
        if (combatState.dashStrikeCooldown > 0) {
            const pct = (combatState.dashStrikeCooldown / 1.5) * 100;
            cdDash.style.height = pct + '%';
        } else {
            cdDash.style.height = '0%';
        }
    }
    
    const cdShield = document.getElementById('cd-shield'); // Used for bio-drill
    if (cdShield) {
        if (combatState.bioDrillCooldown > 0) {
            const pct = (combatState.bioDrillCooldown / 3.0) * 100;
            cdShield.style.height = pct + '%';
        } else {
            cdShield.style.height = '0%';
        }
    }
    
    const cdSonar = document.getElementById('cd-sonar'); // Used for upward blast
    if (cdSonar) {
        if (combatState.upwardBlastCooldown > 0) {
            const pct = (combatState.upwardBlastCooldown / 2.0) * 100;
            cdSonar.style.height = pct + '%';
        } else {
            cdSonar.style.height = '0%';
        }
    }
    
    const cdUltimate = document.getElementById('cd-ultimate'); // Used for low sweep
    if (cdUltimate) {
        if (combatState.lowSweepCooldown > 0) {
            const pct = (combatState.lowSweepCooldown / 2.5) * 100;
            cdUltimate.style.height = pct + '%';
        } else {
            cdUltimate.style.height = '0%';
        }
    }

    // Update Minimap Pips
    const playerPip = document.getElementById('hud-minimap-player');
    const coordText = document.getElementById('hud-minimap-coords');
    if (playerPip && coordText) {
        // Map is 80x30 tiles (2560x960 px)
        const mapW = 2560;
        const mapH = 960;
        // Transform player position to minimap center-relative percentage
        const xPct = ((player.x / mapW) - 0.5) * 100;
        const yPct = ((player.y / mapH) - 0.5) * 100;
        
        playerPip.style.transform = `translate(${xPct}px, ${yPct}px)`;
        coordText.textContent = `X: ${Math.floor(player.x)} | Y: ${Math.floor(player.y)}`;
    }
}
