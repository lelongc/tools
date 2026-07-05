import { combatState } from './combat.js?v=1783257459';
import { ZONE_NAMES, getZone } from './world.js?v=1783257459';

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
        const mapW = 2560;
        const mapH = 960;
        const xPct = ((player.x / mapW) - 0.5) * 100;
        const yPct = ((player.y / mapH) - 0.5) * 100;
        
        playerPip.style.transform = `translate(${xPct}px, ${yPct}px)`;
        coordText.textContent = `X: ${Math.floor(player.x)} | Y: ${Math.floor(player.y)}`;
    }

    // Update Target HUD (Closest Enemy)
    const targetHud = document.getElementById('target-hud');
    const targetName = document.getElementById('target-name');
    const targetHp = document.getElementById('target-hp-bar');
    
    if (targetHud && targetName && targetHp && window.enemyManager) {
        let closest = null;
        let minDist = 300; // Only show if within 300 pixels
        
        window.enemyManager.enemies.forEach(e => {
            if (e.hp > 0 && e.sprite && e.sprite.active) {
                const dist = Math.hypot(e.sprite.x - player.x, e.sprite.y - player.y);
                if (dist < minDist) {
                    minDist = dist;
                    closest = e;
                }
            }
        });
        
        if (closest) {
            targetHud.classList.remove('hidden');
            targetHud.classList.add('flex');
            
            // Glitch truth name logic
            if (window.truthRevealed) {
                // Randomly glitch between truth and normal
                if (Math.random() < 0.2) {
                    targetName.textContent = closest.truthName;
                    targetName.classList.add('animate-pulse');
                    targetName.style.filter = "contrast(2) hue-rotate(90deg)";
                } else {
                    targetName.textContent = closest.name || closest.type;
                    targetName.classList.remove('animate-pulse');
                    targetName.style.filter = "none";
                }
            } else {
                targetName.textContent = closest.name || closest.type;
            }
            
            const hpPct = Math.max(0, (closest.hp / closest.maxHp) * 100);
            targetHp.style.width = hpPct + '%';
        } else {
            targetHud.classList.add('hidden');
            targetHud.classList.remove('flex');
        }
    }
}

export const DialogueSystem = {
    isActive: false,
    queue: [],
    currentText: "",
    charIndex: 0,
    typingTimer: null,
    onCompleteCallback: null,

    show(text, avatarType = 'normal', duration = 4000, onComplete = null) {
        this.queue.push({ text, avatarType, duration, onComplete });
        if (!this.isActive) {
            this.playNext();
        }
    },

    playNext() {
        if (this.queue.length === 0) {
            this.hide();
            return;
        }

        this.isActive = true;
        const dialog = this.queue.shift();
        this.currentText = dialog.text;
        this.charIndex = 0;
        this.onCompleteCallback = dialog.onComplete;

        const container = document.getElementById('dialogue-container');
        const textEl = document.getElementById('dialogue-text');
        const avatarEl = document.getElementById('dialogue-avatar');
        
        if (!container) return;

        // Show container
        container.classList.remove('translate-y-32', 'opacity-0', 'pointer-events-none');
        
        // Apply avatar styling based on type
        avatarEl.src = `assets/el_avatar_${dialog.avatarType}.png`;
        
        if (dialog.avatarType === 'glitch') {
            avatarEl.style.filter = "contrast(1.5) saturate(2) hue-rotate(90deg)";
        } else {
            avatarEl.style.filter = "none";
        }

        textEl.innerHTML = "";
        
        if (this.typingTimer) clearInterval(this.typingTimer);
        
        this.typingTimer = setInterval(() => {
            if (this.charIndex < this.currentText.length) {
                textEl.innerHTML += this.currentText.charAt(this.charIndex);
                this.charIndex++;
            } else {
                clearInterval(this.typingTimer);
                setTimeout(() => {
                    if (this.onCompleteCallback) this.onCompleteCallback();
                    this.playNext();
                }, dialog.duration);
            }
        }, 30); // 30ms per char typewriter effect
    },

    hide() {
        this.isActive = false;
        const container = document.getElementById('dialogue-container');
        if(container) {
            container.classList.add('translate-y-32', 'opacity-0', 'pointer-events-none');
        }
    }
};

window.DialogueSystem = DialogueSystem;

export const GlitchSystem = {
    glitchTimer: null,
    
    // intensity is optional for now, duration in ms
    trigger(duration = 500) {
        const body = document.body;
        
        // Don't restart if already glitching heavily
        if (body.classList.contains('glitch-active')) return;
        
        body.classList.add('glitch-active');
        
        if (this.glitchTimer) clearTimeout(this.glitchTimer);
        
        this.glitchTimer = setTimeout(() => {
            body.classList.remove('glitch-active');
        }, duration);
    }
};

window.GlitchSystem = GlitchSystem;
