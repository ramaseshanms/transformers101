// Paged Attention Logic

document.addEventListener('DOMContentLoaded', () => {
    initPagedAttention();
});

const TOTAL_SLOTS = 16;
let logicalSlots = [];
let physicalSlots = []; // Array of physical indices
let currentLogicalIdx = 0;

function initPagedAttention() {
    const logContainer = document.getElementById('logical-mem');
    const phyContainer = document.getElementById('physical-mem');

    // Create Grid
    for (let i = 0; i < TOTAL_SLOTS; i++) {
        // Logical
        let lDiv = document.createElement('div');
        lDiv.className = 'kv-block';
        lDiv.id = `log-${i}`;
        lDiv.textContent = i;
        logContainer.appendChild(lDiv);

        // Physical
        let pDiv = document.createElement('div');
        pDiv.className = 'kv-block';
        pDiv.id = `phy-${i}`;
        pDiv.textContent = i; // Addr
        phyContainer.appendChild(pDiv);
    }

    // Create shuffled physical mapping to simulate fragmentation
    physicalSlots = Array.from({ length: TOTAL_SLOTS }, (_, i) => i);
    shuffleArray(physicalSlots);

    document.getElementById('btn-add-token').addEventListener('click', addToken);
    document.getElementById('btn-reset').addEventListener('click', resetMem);
}

function addToken() {
    if (currentLogicalIdx >= TOTAL_SLOTS) {
        log("Memory Full!");
        return;
    }

    const logicalId = `log-${currentLogicalIdx}`;
    const physicalAddr = physicalSlots[currentLogicalIdx];
    const physicalId = `phy-${physicalAddr}`;

    // Update visuals
    const lEl = document.getElementById(logicalId);
    const pEl = document.getElementById(physicalId);

    lEl.classList.add('occupied');

    // Animate mapping
    setTimeout(() => {
        pEl.classList.add('mapped-target');
        log(`Token ${currentLogicalIdx} -> Mapped to Physical Block ${physicalAddr}`);
    }, 200);

    currentLogicalIdx++;
}

function resetMem() {
    currentLogicalIdx = 0;
    shuffleArray(physicalSlots);
    document.querySelectorAll('.kv-block').forEach(el => {
        el.classList.remove('occupied', 'mapped-target');
    });
    log("Memory Reset. Physical blocks re-shuffled.");
}

function log(msg) {
    const el = document.getElementById('log');
    el.innerHTML += `<div>> ${msg}</div>`;
    el.scrollTop = el.scrollHeight;
}

// Fisher-Yates Shuffle
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
