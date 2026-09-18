"""
Studio-grade cartoon procedural audio synthesizer for 'Cluck & Drop: Bunker Buster'.
Generates 16-bit 44.1kHz punchy, commercial-grade sound effects for Godot 4.
"""

import math
import os
import random
import struct
import wave
import numpy as np

OUTPUT_DIR = r"d:\folder\tools\godot_demo\2\assets\audio"
os.makedirs(OUTPUT_DIR, exist_ok=True)
SAMPLE_RATE = 44100

def write_wav(filename, samples):
    """Writes a numpy float array (-1.0 to 1.0) as 16-bit PCM WAV."""
    path = os.path.join(OUTPUT_DIR, filename)
    # Peak normalization to -0.5 dB to prevent clipping while maximizing loudness
    peak = np.max(np.abs(samples))
    if peak > 1e-5:
        samples = samples / peak * 0.94
    else:
        samples = np.zeros_like(samples)
    
    int_samples = np.int16(samples * 32767)
    with wave.open(path, "w") as wf:
        wf.setnchannels(1) # Mono for spatial & mobile efficiency
        wf.setsampwidth(2) # 16-bit
        wf.setframerate(SAMPLE_RATE)
        wf.writeframes(int_samples.tobytes())
    print(f"Generated: {filename} ({len(samples)/SAMPLE_RATE:.2f}s, {os.path.getsize(path)} bytes)")

def adsr(length, a=0.01, d=0.05, s=0.7, r=0.1):
    """Generates an ADSR envelope array."""
    t = np.linspace(0, 1, length, endpoint=False)
    env = np.zeros(length)
    
    n_a = int(length * a)
    n_d = int(length * d)
    n_r = int(length * r)
    n_s = max(0, length - n_a - n_d - n_r)
    
    idx = 0
    if n_a > 0:
        env[idx:idx+n_a] = np.linspace(0, 1, n_a)
        idx += n_a
    if n_d > 0:
        env[idx:idx+n_d] = np.linspace(1, s, n_d)
        idx += n_d
    if n_s > 0:
        env[idx:idx+n_s] = s
        idx += n_s
    if n_r > 0:
        env[idx:idx+n_r] = np.linspace(s, 0, n_r)
    return env

# ==============================================================================
# SOUND RECIPES
# ==============================================================================

def gen_chicken_cluck():
    """Funny cartoon chicken cluck ('Bawk-bawk!') when dropping eggs."""
    duration = 0.32
    n = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n, endpoint=False)
    
    # Two distinct vocal pulses (formant cluck)
    # Pulse 1: 0 to 0.12s
    # Pulse 2: 0.15s to 0.30s
    p1 = (t >= 0.0) & (t < 0.12)
    t1 = t[p1]
    f1 = 620 + 250 * np.sin(np.pi * t1 / 0.12) # Pitch bump
    vib1 = 1.0 + 0.15 * np.sin(2 * np.pi * 32 * t1)
    wave1 = np.sin(2 * np.pi * f1 * t1) * vib1 + 0.3 * np.sin(4 * np.pi * f1 * t1)
    env1 = np.sin(np.pi * t1 / 0.12) ** 1.5
    
    p2 = (t >= 0.15) & (t < 0.30)
    t2 = t[p2] - 0.15
    f2 = 780 - 320 * (t2 / 0.15) # Downward squawk
    vib2 = 1.0 + 0.2 * np.sin(2 * np.pi * 28 * t2)
    wave2 = np.sin(2 * np.pi * f2 * t2) * vib2 + 0.4 * np.sin(4 * np.pi * f2 * t2) + 0.2 * np.sin(6 * np.pi * f2 * t2)
    env2 = (1.0 - t2 / 0.15) ** 1.8 * np.sin(np.pi * t2 / 0.04).clip(0, 1)
    
    out = np.zeros(n)
    out[p1] = wave1 * env1 * 0.85
    out[p2] = wave2 * env2 * 1.0
    
    # Subtle feather flutter noise
    noise = np.random.uniform(-0.15, 0.15, n) * np.exp(-t * 10)
    return out + noise

def gen_egg_crack():
    """Crisp organic eggshell fracture with comic pop."""
    duration = 0.24
    n = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n, endpoint=False)
    
    # Sharp shell fracture clicks
    clicks = np.zeros(n)
    for offset in [0.0, 0.015, 0.032, 0.055]:
        idx = int(offset * SAMPLE_RATE)
        burst_len = int(0.012 * SAMPLE_RATE)
        if idx + burst_len < n:
            tb = np.linspace(0, 0.012, burst_len)
            clicks[idx:idx+burst_len] += np.random.uniform(-0.8, 0.8, burst_len) * np.exp(-tb * 350)
    
    # Hollow pop body (pitch drops 480 -> 160Hz)
    f_body = 480 * np.exp(-t * 18) + 160
    body = np.sin(2 * np.pi * f_body * t) * np.exp(-t * 22)
    
    # High frequency crackle
    crack_noise = np.random.uniform(-0.4, 0.4, n) * np.exp(-t * 35)
    
    return clicks * 0.7 + body * 0.6 + crack_noise * 0.3

def gen_egg_bounce():
    """Cartoon boing / rubbery bouncy thud."""
    duration = 0.25
    n = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n, endpoint=False)
    
    # Upward pitch bend (140Hz -> 360Hz)
    f = 140 + 220 * (1.0 - np.exp(-t * 25))
    wobble = 1.0 + 0.15 * np.sin(2 * np.pi * 16 * t) * np.exp(-t * 12)
    tone = np.sin(2 * np.pi * f * t * wobble) + 0.25 * np.sin(4 * np.pi * f * t)
    env = np.exp(-t * 14) * np.sin(np.clip(t / 0.008, 0, 1) * np.pi * 0.5)
    
    thud = np.sin(2 * np.pi * 80 * t) * np.exp(-t * 40) * 0.5
    return tone * env + thud

def gen_explosion_cartoon():
    """Punchy cartoon comic explosion with sub-bass, crackle, and debris rumble."""
    duration = 0.65
    n = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n, endpoint=False)
    
    # Layer 1: Instant transient punch (distorted blast click)
    click = np.random.uniform(-1.0, 1.0, n) * np.exp(-t * 70)
    
    # Layer 2: Deep sub-bass drop (220Hz down to 35Hz)
    f_bass = 220 * np.exp(-t * 8) + 35
    bass = np.sin(2 * np.pi * f_bass * t) * np.exp(-t * 4.5)
    # Soft saturation for warmth
    bass = np.tanh(bass * 2.2) * 0.7
    
    # Layer 3: Filtered noise fireball roar
    # Simple recursive low-pass emulation on noise
    raw_noise = np.random.uniform(-1.0, 1.0, n)
    smooth_noise = np.zeros(n)
    alpha = 0.12 # low pass coefficient
    for i in range(1, n):
        smooth_noise[i] = smooth_noise[i-1] + alpha * (raw_noise[i] - smooth_noise[i-1])
    roar = smooth_noise * np.exp(-t * 5.5) * 1.6
    
    # Layer 4: High crackle tail
    crackle = np.random.uniform(-0.3, 0.3, n) * (np.exp(-t * 6) - np.exp(-t * 25))
    
    return click * 0.8 + bass * 0.9 + roar * 0.8 + crackle * 0.4

def gen_wood_break():
    """Snappy organic wood splintering and plank snapping."""
    duration = 0.35
    n = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n, endpoint=False)
    
    # Multiple timber fiber snap impulses
    snaps = np.zeros(n)
    for offs in [0.002, 0.018, 0.038, 0.070, 0.110]:
        idx = int(offs * SAMPLE_RATE)
        blen = int(0.015 * SAMPLE_RATE)
        if idx + blen < n:
            tb = np.linspace(0, 0.015, blen)
            snaps[idx:idx+blen] += np.random.uniform(-0.9, 0.9, blen) * np.exp(-tb * 300)
    
    # Resonant hollow wood block pitch
    f_wood = 310 * np.exp(-t * 15) + 120
    body = np.sin(2 * np.pi * f_wood * t) * np.exp(-t * 18) * 0.6
    
    # Mid-frequency splinter crunch
    crunch = np.random.uniform(-0.5, 0.5, n) * np.exp(-t * 16)
    
    return snaps * 0.8 + body * 0.5 + crunch * 0.5

def gen_stone_break():
    """Heavy stone shatter, rock impact and crumbling gravel."""
    duration = 0.42
    n = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n, endpoint=False)
    
    # Heavy dull thump transient
    thump = np.sin(2 * np.pi * 95 * t) * np.exp(-t * 14) + np.sin(2 * np.pi * 145 * t) * np.exp(-t * 18) * 0.6
    thump = np.tanh(thump * 1.8)
    
    # Low-passed rumble
    raw_n = np.random.uniform(-1.0, 1.0, n)
    low_n = np.zeros(n)
    alpha = 0.06
    for i in range(1, n):
        low_n[i] = low_n[i-1] + alpha * (raw_n[i] - low_n[i-1])
    rumble = low_n * np.exp(-t * 8) * 2.0
    
    # Gravel scatter clatter
    gravel = np.zeros(n)
    for i in range(12):
        t_rand = random.uniform(0.03, 0.35)
        idx = int(t_rand * SAMPLE_RATE)
        if idx < n:
            span = min(int(0.008 * SAMPLE_RATE), n - idx)
            gravel[idx:idx+span] += np.random.uniform(-0.4, 0.4, span)
            
    return thump * 0.7 + rumble * 0.6 + gravel * 0.4

def gen_glass_break():
    """Crisp crystalline glass & ice shatter."""
    duration = 0.38
    n = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n, endpoint=False)
    
    # Crystalline chime cluster (high inharmonic partials)
    partials = [1950, 2800, 3650, 4800, 6200]
    chimes = np.zeros(n)
    for p in partials:
        decay = random.uniform(12, 28)
        chimes += np.sin(2 * np.pi * p * t) * np.exp(-t * decay) * (1800.0 / p)
    
    # Sharp shatter snap
    snap = np.random.uniform(-0.8, 0.8, n) * np.exp(-t * 45)
    
    return chimes * 0.5 + snap * 0.6

def gen_steel_clang():
    """Metallic clang with ringing anvil resonance."""
    duration = 0.55
    n = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n, endpoint=False)
    
    # Inharmonic metal bar partials
    freqs = [620, 1140, 1850, 2760, 3900]
    weights = [1.0, 0.7, 0.4, 0.25, 0.15]
    decays = [6.0, 10.0, 16.0, 22.0, 30.0]
    
    metal = np.zeros(n)
    for f, w, d in zip(freqs, weights, decays):
        metal += np.sin(2 * np.pi * f * t) * w * np.exp(-t * d)
        
    # Hard iron hammer strike transient
    strike = np.random.uniform(-1.0, 1.0, n) * np.exp(-t * 90) * 0.6
    
    return metal * 0.8 + strike * 0.4

def gen_crystal_shatter():
    """Magical prismatic crystal chime shatter with sparkling harmonics."""
    duration = 0.52
    n = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n, endpoint=False)
    
    # E-major triad harmonic sparkle (E6=1318, G#6=1661, B6=1975, E7=2637, G#7=3322)
    chords = [1318.5, 1661.2, 1975.5, 2637.0, 3322.4]
    sparkle = np.zeros(n)
    for idx, f in enumerate(chords):
        phase_vib = np.sin(2 * np.pi * 7.0 * t) * 0.05
        sparkle += np.sin(2 * np.pi * f * t * (1.0 + phase_vib)) * np.exp(-t * (8.0 + idx * 3.0))
        
    glass_snap = np.random.uniform(-0.7, 0.7, n) * np.exp(-t * 50)
    return sparkle * 0.6 + glass_snap * 0.4

def gen_obsidian_crack():
    """Deep volcanic thud with resonant runic energy snap."""
    duration = 0.48
    n = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n, endpoint=False)
    
    # Deep magma bass
    f_bass = 120 * np.exp(-t * 10) + 48
    bass = np.sin(2 * np.pi * f_bass * t) * np.exp(-t * 7)
    
    # Eerie runic harmonic sweep
    f_runic = 440 + 220 * np.sin(np.pi * t / duration)
    runic = np.sin(2 * np.pi * f_runic * t) * np.sin(2 * np.pi * (f_runic * 1.5) * t) * np.exp(-t * 8) * 0.4
    
    # Heavy stone crack
    crack = np.random.uniform(-0.9, 0.9, n) * np.exp(-t * 35)
    
    return bass * 0.8 + runic * 0.5 + crack * 0.6

def gen_monster_ouch():
    """Cartoon monster squeak / 'oof!' when taking damage."""
    duration = 0.22
    n = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n, endpoint=False)
    
    # Pitch drop 580Hz -> 260Hz with vocal flutter
    f = 580 * np.exp(-t * 7)
    flutter = 1.0 + 0.18 * np.sin(2 * np.pi * 38 * t)
    squeak = np.sin(2 * np.pi * f * t * flutter) + 0.35 * np.sin(4 * np.pi * f * t)
    env = np.sin(np.clip(t / 0.02, 0, 1) * np.pi * 0.5) * np.exp(-t * 14)
    
    return squeak * env

def gen_monster_defeat():
    """Comical cartoon pop, dizzy wobble and squishy splat."""
    duration = 0.42
    n = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n, endpoint=False)
    
    # Part 1: Rubbery comic pop (0.0 to 0.12s)
    f_pop = 280 + 640 * np.sin(np.pi * np.clip(t / 0.12, 0, 1))
    pop = np.sin(2 * np.pi * f_pop * t) * np.exp(-t * 22)
    
    # Part 2: Dizzy cartoon slide whistle descent
    p2 = t > 0.08
    t2 = t[p2] - 0.08
    f_slide = 1100 * np.exp(-t2 * 6.5) + 180
    wobble = 1.0 + 0.12 * np.sin(2 * np.pi * 20 * t2)
    slide = np.sin(2 * np.pi * f_slide * t2 * wobble) * np.exp(-t2 * 7) * 0.6
    
    # Splat squish noise
    splat = np.random.uniform(-0.4, 0.4, n) * np.exp(-t * 28)
    
    out = pop * 0.8 + splat * 0.4
    out[p2] += slide
    return out

def gen_drill_engine():
    """High-speed mechanical drill & rocket thruster whirr."""
    duration = 0.45
    n = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n, endpoint=False)
    
    # Ramping saw wave simulation
    f_ramp = 180 + 650 * (t / duration)
    saw = 2.0 * (t * f_ramp - np.floor(t * f_ramp + 0.5)) # saw wave
    buzz = np.sin(2 * np.pi * (f_ramp * 2.5) * t) * 0.4
    
    env = np.sin(np.pi * t / duration) ** 0.8
    # Spark sizzle
    spark = np.random.uniform(-0.35, 0.35, n) * env
    return (saw * 0.6 + buzz * 0.4 + spark * 0.3) * env

def gen_frost_freeze():
    """Icy gust + crystal freeze chime burst."""
    duration = 0.46
    n = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n, endpoint=False)
    
    # Rapid ascending chime (C6=1046, E6=1318, G6=1567, C7=2093)
    notes = [1046.5, 1318.5, 1567.9, 2093.0]
    chimes = np.zeros(n)
    for idx, freq in enumerate(notes):
        st = idx * 0.045
        mask = t >= st
        tm = t[mask] - st
        chimes[mask] += np.sin(2 * np.pi * freq * tm) * np.exp(-tm * 18) * 0.5
        
    # Freezing cold wind noise
    wind = np.random.uniform(-0.5, 0.5, n) * np.exp(-t * 7)
    return chimes * 0.7 + wind * 0.5

def gen_acid_sizzle():
    """Sizzling bubbling acid foam and chemical hiss."""
    duration = 0.55
    n = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n, endpoint=False)
    
    # Corrosive hiss
    hiss = np.random.uniform(-0.6, 0.6, n) * np.exp(-t * 5.0)
    
    # Multiple randomized bubble pops
    bubbles = np.zeros(n)
    for _ in range(24):
        st = random.uniform(0.01, duration - 0.05)
        idx = int(st * SAMPLE_RATE)
        blen = int(0.018 * SAMPLE_RATE)
        if idx + blen < n:
            tb = np.linspace(0, 0.018, blen)
            fb = random.uniform(350, 950)
            bubbles[idx:idx+blen] += np.sin(2 * np.pi * fb * tb) * np.exp(-tb * 200) * 0.35
            
    return hiss * 0.6 + bubbles * 0.7

def gen_blackhole_vortex():
    """Deep cosmic gravity vortex with suction and sub-rumble."""
    duration = 0.65
    n = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n, endpoint=False)
    
    # Deep pulsating 50Hz drone
    sub = np.sin(2 * np.pi * 52 * t) * (1.0 + 0.3 * np.sin(2 * np.pi * 8 * t)) * np.exp(-t * 3.5)
    
    # Inward spiraling frequency sweep
    f_sweep = 750 * np.exp(-t * 5) + 65
    vortex = np.sin(2 * np.pi * f_sweep * t) * np.exp(-t * 4.0) * 0.6
    
    # Space void shimmer
    void_shimmer = np.sin(2 * np.pi * 1420 * t) * np.sin(2 * np.pi * 65 * t) * np.exp(-t * 5) * 0.3
    
    return sub * 0.8 + vortex * 0.7 + void_shimmer * 0.4

def gen_chick_chirp():
    """Adorable baby chick 'cheep-cheep!' chirp."""
    duration = 0.22
    n = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n, endpoint=False)
    
    # Rapid upward chirp 2.4kHz -> 3.6kHz
    p1 = t < 0.09
    t1 = t[p1]
    f1 = 2400 + 1300 * (t1 / 0.09)
    ch1 = np.sin(2 * np.pi * f1 * t1) * np.sin(np.pi * t1 / 0.09)
    
    p2 = (t >= 0.11) & (t < 0.20)
    t2 = t[p2] - 0.11
    f2 = 2600 + 1400 * (t2 / 0.09)
    ch2 = np.sin(2 * np.pi * f2 * t2) * np.sin(np.pi * t2 / 0.09)
    
    out = np.zeros(n)
    out[p1] = ch1 * 0.85
    out[p2] = ch2 * 1.0
    return out

def gen_button_click():
    """Satisfying juicy cartoon bubble pop for UI buttons."""
    duration = 0.08
    n = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n, endpoint=False)
    
    # Pitch bend 680Hz -> 1150Hz -> 520Hz
    f = 680 + 550 * np.sin(np.pi * t / duration)
    pop = np.sin(2 * np.pi * f * t) * np.sin(np.pi * t / duration) ** 1.2
    
    click = np.random.uniform(-0.3, 0.3, n) * np.exp(-t * 120)
    return pop * 0.9 + click * 0.3

def gen_wheel_tick():
    """Mechanical ratchet tooth click for lucky wheel."""
    duration = 0.035
    n = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n, endpoint=False)
    
    click = np.random.uniform(-1.0, 1.0, n) * np.exp(-t * 220)
    wood = np.sin(2 * np.pi * 1450 * t) * np.exp(-t * 150) * 0.6
    return click * 0.7 + wood * 0.6

def gen_star_chime():
    """Sparkling magical musical chime for stars."""
    duration = 0.45
    n = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n, endpoint=False)
    
    # Glockenspiel bell tone (E6=1318Hz, B6=1975Hz)
    bell = (np.sin(2 * np.pi * 1318.5 * t) + 0.45 * np.sin(2 * np.pi * 2637 * t) + 0.25 * np.sin(2 * np.pi * 3955 * t)) * np.exp(-t * 7)
    shimmer = np.sin(2 * np.pi * 1975.5 * t) * np.exp(-t * 9) * 0.5
    return bell * 0.7 + shimmer * 0.5

def gen_victory_fanfare():
    """Joyful, triumphant cartoon victory jingle (C5 -> E5 -> G5 -> C6)."""
    duration = 0.85
    n = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n, endpoint=False)
    
    # Notes: C5=523.25, E5=659.25, G5=783.99, C6=1046.50
    notes = [
        (0.00, 0.16, 523.25),
        (0.16, 0.16, 659.25),
        (0.32, 0.16, 783.99),
        (0.48, 0.36, 1046.50)
    ]
    
    out = np.zeros(n)
    for start, dur, freq in notes:
        st_idx = int(start * SAMPLE_RATE)
        end_idx = min(st_idx + int(dur * SAMPLE_RATE), n)
        span = end_idx - st_idx
        if span > 0:
            ts = np.linspace(0, dur, span)
            # Rich brass/organ cartoon timbre: 1st, 2nd, 3rd harmonics
            tone = (np.sin(2 * np.pi * freq * ts) + 
                    0.45 * np.sin(4 * np.pi * freq * ts) + 
                    0.25 * np.sin(6 * np.pi * freq * ts) + 
                    0.15 * np.sin(8 * np.pi * freq * ts))
            env = np.sin(np.clip(ts / 0.015, 0, 1) * np.pi * 0.5) * np.exp(-ts * (3.5 if freq == 1046.5 else 6.0))
            out[st_idx:end_idx] += tone * env * 0.85
            
    return out

def gen_level_fail():
    """Playful cartoon 'womp-womp' trombone fail sound (encouraging, comical)."""
    duration = 0.75
    n = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n, endpoint=False)
    
    # 2 comedic descending brass 'womp' notes
    # Womp 1: 0.0s to 0.32s (260Hz -> 210Hz)
    # Womp 2: 0.36s to 0.72s (210Hz -> 155Hz with vibrato)
    notes = [
        (0.00, 0.32, 260, 215, 18),
        (0.35, 0.38, 215, 155, 14)
    ]
    
    out = np.zeros(n)
    for start, dur, f_start, f_end, vib_rate in notes:
        st_idx = int(start * SAMPLE_RATE)
        end_idx = min(st_idx + int(dur * SAMPLE_RATE), n)
        span = end_idx - st_idx
        if span > 0:
            ts = np.linspace(0, dur, span)
            f_slide = f_start + (f_end - f_start) * (ts / dur)
            vib = 1.0 + 0.08 * np.sin(2 * np.pi * vib_rate * ts)
            tone = (np.sin(2 * np.pi * f_slide * ts * vib) + 
                    0.5 * np.sin(4 * np.pi * f_slide * ts) + 
                    0.3 * np.sin(6 * np.pi * f_slide * ts))
            env = np.sin(np.pi * ts / dur) ** 0.8
            out[st_idx:end_idx] += tone * env * 0.85
            
    return out

def gen_coin_pickup():
    """Bright sparkling arcade coin bling (B5 -> E6)."""
    duration = 0.28
    n = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n, endpoint=False)
    
    # Note 1: B5 (987.77 Hz) for 0.08s
    # Note 2: E6 (1318.51 Hz) for 0.20s
    p1 = t < 0.08
    t1 = t[p1]
    w1 = (np.sin(2 * np.pi * 987.77 * t1) + 0.3 * np.sin(4 * np.pi * 987.77 * t1)) * np.exp(-t1 * 15)
    
    p2 = t >= 0.08
    t2 = t[p2] - 0.08
    w2 = (np.sin(2 * np.pi * 1318.51 * t2) + 0.35 * np.sin(4 * np.pi * 1318.51 * t2) + 0.2 * np.sin(6 * np.pi * 1318.51 * t2)) * np.exp(-t2 * 9)
    
    out = np.zeros(n)
    out[p1] = w1 * 0.8
    out[p2] = w2 * 1.0
    return out

def gen_cartoon_bgm():
    """Whimsical, jaunty cartoon background music (16.0s seamless loop at 120 BPM)."""
    duration = 16.0 # Exactly 8 bars at 120 BPM
    n = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n, endpoint=False)
    
    bpm = 120.0
    beat_dur = 60.0 / bpm # 0.5s
    sixteenth = beat_dur / 4.0 # 0.125s
    
    out = np.zeros(n)
    
    # 1. Bouncing Upright Bass (Root-5th walking pattern in C - Am - F - G)
    chord_roots = [
        130.81, 130.81, # C3 (Bar 1-2)
        110.00, 110.00, # A2 (Bar 3-4)
        87.31,  87.31,  # F2 (Bar 5-6)
        98.00,  98.00   # G2 (Bar 7-8)
    ]
    
    for bar in range(8):
        root = chord_roots[bar]
        fifth = root * 1.5
        octave = root * 2.0
        # 4 beats per bar
        bass_pattern = [root, fifth, octave, fifth]
        for beat in range(4):
            f_note = bass_pattern[beat]
            st = (bar * 4 + beat) * beat_dur
            st_idx = int(st * SAMPLE_RATE)
            dur_note = 0.38 # Plucky staccato
            span = min(int(dur_note * SAMPLE_RATE), n - st_idx)
            if span > 0:
                ts = np.linspace(0, dur_note, span)
                bass_tone = (np.sin(2 * np.pi * f_note * ts) + 
                             0.5 * np.sin(4 * np.pi * f_note * ts) + 
                             0.2 * np.sin(6 * np.pi * f_note * ts))
                env = np.exp(-ts * 8.5)
                out[st_idx:st_idx+span] += bass_tone * env * 0.45

    # 2. Syncopated Pizzicato Chord Stabs (on off-beats 2 and 4)
    chords_freqs = [
        [261.63, 329.63, 392.00], # C major (C4, E4, G4)
        [261.63, 329.63, 392.00],
        [220.00, 261.63, 329.63], # A minor (A3, C4, E4)
        [220.00, 261.63, 329.63],
        [174.61, 261.63, 349.23], # F major (F3, C4, F4)
        [174.61, 261.63, 349.23],
        [196.00, 246.94, 293.66], # G major (G3, B3, D4)
        [196.00, 246.94, 392.00]
    ]
    
    for bar in range(8):
        chord = chords_freqs[bar]
        for beat in [1, 3]: # Off-beats
            st = (bar * 4 + beat + 0.5) * beat_dur # Syncopated and-of-beat
            st_idx = int(st * SAMPLE_RATE)
            dur_pizz = 0.22
            span = min(int(dur_pizz * SAMPLE_RATE), n - st_idx)
            if span > 0:
                ts = np.linspace(0, dur_pizz, span)
                for cf in chord:
                    pizz = (np.sin(2 * np.pi * cf * ts) + 0.3 * np.sin(4 * np.pi * cf * ts)) * np.exp(-ts * 16.0)
                    out[st_idx:st_idx+span] += pizz * 0.18

    # 3. Playful Marimba Melody
    # Catchy cartoon hook: C5, D5, E5, G5, A5 variations
    melody_notes = [
        # Bar 1: C5, E5, G5, E5
        (0.0, 0.22, 523.25), (0.5, 0.22, 659.25), (1.0, 0.35, 783.99), (1.5, 0.22, 659.25),
        # Bar 2: D5, E5, D5, C5
        (2.0, 0.22, 587.33), (2.5, 0.22, 659.25), (3.0, 0.35, 587.33), (3.5, 0.35, 523.25),
        # Bar 3: A4, C5, E5, C5
        (4.0, 0.22, 440.00), (4.5, 0.22, 523.25), (5.0, 0.35, 659.25), (5.5, 0.22, 523.25),
        # Bar 4: G4, B4, D5, B4
        (6.0, 0.22, 392.00), (6.5, 0.22, 493.88), (7.0, 0.40, 587.33),
        # Bar 5: F5, E5, D5, C5 (descending trill)
        (8.0, 0.20, 698.46), (8.5, 0.20, 659.25), (9.0, 0.20, 587.33), (9.5, 0.35, 523.25),
        # Bar 6: D5, E5, F5, G5
        (10.0, 0.20, 587.33), (10.5, 0.20, 659.25), (11.0, 0.20, 698.46), (11.5, 0.35, 783.99),
        # Bar 7: A5, G5, E5, D5
        (12.0, 0.22, 880.00), (12.5, 0.22, 783.99), (13.0, 0.35, 659.25), (13.5, 0.22, 587.33),
        # Bar 8: C5, D5, C5 (resolving)
        (14.0, 0.25, 523.25), (14.5, 0.25, 587.33), (15.0, 0.60, 523.25)
    ]
    
    for start_t, dur_m, freq in melody_notes:
        st_idx = int(start_t * SAMPLE_RATE)
        span = min(int(dur_m * SAMPLE_RATE), n - st_idx)
        if span > 0:
            ts = np.linspace(0, dur_m, span)
            # Marimba acoustic tone: hollow wooden bar resonance (fundamental + 3.9f + 9.2f)
            marimba = (np.sin(2 * np.pi * freq * ts) * 1.0 + 
                       np.sin(2 * np.pi * (freq * 3.92) * ts) * 0.25 * np.exp(-ts * 28.0) +
                       np.sin(2 * np.pi * (freq * 2.0) * ts) * 0.20)
            env = np.exp(-ts * 7.5) * np.sin(np.clip(ts / 0.006, 0, 1) * np.pi * 0.5)
            out[st_idx:st_idx+span] += marimba * env * 0.40

    # 4. Light Wooden Shaker & Woodblock Rhythm
    for beat in range(32):
        st = beat * beat_dur
        st_idx = int(st * SAMPLE_RATE)
        # Woodblock on beat
        wb_span = min(int(0.04 * SAMPLE_RATE), n - st_idx)
        if wb_span > 0:
            ts = np.linspace(0, 0.04, wb_span)
            wb_tone = np.sin(2 * np.pi * 880 * ts) * np.exp(-ts * 140)
            out[st_idx:st_idx+wb_span] += wb_tone * 0.12
            
        # Shaker on 16th notes
        for sixteenth_idx in range(4):
            shk_st = st + sixteenth_idx * sixteenth
            shk_idx = int(shk_st * SAMPLE_RATE)
            shk_span = min(int(0.025 * SAMPLE_RATE), n - shk_idx)
            if shk_span > 0:
                shk_noise = np.random.uniform(-0.15, 0.15, shk_span) * (0.8 if sixteenth_idx % 2 == 0 else 0.4)
                out[shk_idx:shk_idx+shk_span] += shk_noise * 0.15

    return out

# ==============================================================================
# MAIN EXECUTION
# ==============================================================================
if __name__ == "__main__":
    print(f"Synthesizing custom sound effects into: {OUTPUT_DIR}")
    
    sounds = {
        "chicken_cluck.wav": gen_chicken_cluck,
        "egg_crack.wav": gen_egg_crack,
        "egg_bounce.wav": gen_egg_bounce,
        "explosion_cartoon.wav": gen_explosion_cartoon,
        "wood_break.wav": gen_wood_break,
        "stone_break.wav": gen_stone_break,
        "glass_break.wav": gen_glass_break,
        "steel_clang.wav": gen_steel_clang,
        "crystal_shatter.wav": gen_crystal_shatter,
        "obsidian_crack.wav": gen_obsidian_crack,
        "monster_ouch.wav": gen_monster_ouch,
        "monster_defeat.wav": gen_monster_defeat,
        "drill_engine.wav": gen_drill_engine,
        "frost_freeze.wav": gen_frost_freeze,
        "acid_sizzle.wav": gen_acid_sizzle,
        "blackhole_vortex.wav": gen_blackhole_vortex,
        "chick_chirp.wav": gen_chick_chirp,
        "button_click.wav": gen_button_click,
        "wheel_tick.wav": gen_wheel_tick,
        "star_chime.wav": gen_star_chime,
        "victory_fanfare.wav": gen_victory_fanfare,
        "level_fail.wav": gen_level_fail,
        "coin_pickup.wav": gen_coin_pickup,
        "cartoon_bunker_bgm.wav": gen_cartoon_bgm,
    }
    
    for fname, func in sounds.items():
        samples = func()
        write_wav(fname, samples)
        
    print(f"\n[SUCCESS] Successfully generated all {len(sounds)} custom sound effects!")
