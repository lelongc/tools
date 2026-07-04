import { combatState } from './combat.js';
import { ZONE_NAMES, getZone } from './world.js';

export function updateHUD(player) {
    // Update Zone Text
    const zoneNameEl = document.getElementById('hud-zone-name');
    if (zoneNameEl) {
        const zoneIdx = getZone(Math.floor((player.x + player.width/2) / 32));
        zoneNameEl.textContent = ZONE_NAMES[zoneIdx];
    }

    // Update HP Cores
    const hpCoresEl = document.getElementById('hud-hp-cores');
    const hpText = document.getElementById('hud-hp-text');
    if (hpCoresEl && hpText) {
        const totalCores = 5;
        const activeCores = Math.ceil(combatState.hp / 20); // Each core = 20 HP
        
        let html = '';
        for(let i = 0; i < totalCores; i++) {
            if (i < activeCores) {
                // Active Hexagon Core (Cyan)
                html += `<div class="w-6 h-6 bg-primary" style="clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%); box-shadow: 0 0 8px rgba(0,255,255,0.8);"></div>`;
            } else {
                // Empty Hexagon Core
                html += `<div class="w-6 h-6 bg-surface border-2 border-primary/30" style="clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);"></div>`;
            }
        }
        hpCoresEl.innerHTML = html;
        hpText.textContent = `${activeCores} / ${totalCores}`;
    }

    // Update Overdrive Bar
    const manaBar = document.getElementById('hud-mana-bar');
    const manaText = document.getElementById('hud-mana-text');
    const overdriveLabel = document.getElementById('overdrive-label');
    
    if (manaBar && manaText) {
        let manaPercent = (combatState.energy / combatState.maxEnergy) * 100;
        manaPercent = Math.min(100, Math.max(0, manaPercent));
        manaBar.style.width = manaPercent + '%';
        manaText.textContent = Math.floor(combatState.energy) + ' / ' + combatState.maxEnergy;
        
        // Neon Surge Effect
        if (combatState.energy >= 50) {
            manaBar.classList.add('animate-pulse');
            manaBar.style.boxShadow = '0 0 15px rgba(68,255,68,0.8)';
            if (overdriveLabel) {
                overdriveLabel.classList.add('text-secondary', 'animate-pulse');
                overdriveLabel.classList.remove('text-secondary/80');
            }
        } else {
            manaBar.classList.remove('animate-pulse');
            manaBar.style.boxShadow = '0 0 8px rgba(68,255,68,0.4)';
            if (overdriveLabel) {
                overdriveLabel.classList.remove('text-secondary', 'animate-pulse');
                overdriveLabel.classList.add('text-secondary/80');
            }
        }
    }

    // Update Cooldown Overlays
    
    // Skill J (Slash, Low Sweep, Up Slash, Pogo)
    const cdDash = document.getElementById('cd-dash');
    if (cdDash) {
        const attackPct = combatState.attackCooldown / 0.5; // Combo step max is 0.5
        const sweepPct = combatState.lowSweepCooldown / combatState.lowSweepMaxCooldown;
        const upPct = combatState.upSlashCooldown / combatState.upSlashMaxCooldown;
        const pogoPct = combatState.pogoSlashCooldown / combatState.pogoSlashMaxCooldown;
        
        const pct = Math.max(0, attackPct, sweepPct, upPct, pogoPct) * 100;
        cdDash.style.height = pct + '%';
    }
    
    // Skill I (Bio-drill, Ground Smash, Rising Blast)
    const cdShield = document.getElementById('cd-shield'); 
    const slotI = document.getElementById('skill-slot-i');
    if (cdShield) {
        const bioPct = combatState.bioDrillCooldown / combatState.bioDrillMaxCooldown;
        const smashPct = combatState.smashCooldown / combatState.smashMaxCooldown;
        const blastPct = combatState.risingBlastCooldown / combatState.risingBlastMaxCooldown;
        
        const pct = Math.max(0, bioPct, smashPct, blastPct) * 100;
        cdShield.style.height = pct + '%';
        
        if (slotI) {
            if (combatState.energy < 30) slotI.classList.add('opacity-40', 'grayscale');
            else slotI.classList.remove('opacity-40', 'grayscale');
        }
    }
    
    // Skill L (Nova)
    const cdSonar = document.getElementById('cd-sonar'); 
    const slotL = document.getElementById('skill-slot-l');
    if (cdSonar) {
        const pct = (Math.max(0, combatState.lightningNovaCooldown) / combatState.lightningNovaMaxCooldown) * 100;
        cdSonar.style.height = pct + '%';
        
        if (slotL) {
            if (combatState.energy < 50) slotL.classList.add('opacity-40', 'grayscale');
            else slotL.classList.remove('opacity-40', 'grayscale');
        }
    }
    
    // Skill K (Dash Strike / Charge)
    const cdUltimate = document.getElementById('cd-ultimate'); 
    if (cdUltimate) {
        const pct = (Math.max(0, combatState.dashStrikeCooldown) / combatState.dashStrikeMaxCooldown) * 100;
        cdUltimate.style.height = pct + '%';
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
