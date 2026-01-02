// Self-Attention Visualization Logic

document.addEventListener('DOMContentLoaded', () => {
    initVisualization();
});

const inputTokens = ["The", "cat", "sat"];
const embeddingDim = 4;
let qMatrix, kMatrix, vMatrix;

function initVisualization() {
    renderEmbeddings();
    setupInteraction();
}

function renderEmbeddings() {
    const container = document.getElementById('embedding-matrix');
    const matrix = Utils.generateMatrix(inputTokens.length, embeddingDim);

    // Manual transform for this specific container since Utils uses generic
    container.style.gridTemplateColumns = `repeat(${embeddingDim}, 1fr)`;
    container.innerHTML = ''; // Clear

    matrix.forEach(row => {
        row.forEach(val => {
            const cell = document.createElement('div');
            cell.className = 'matrix-cell';
            cell.textContent = val;
            container.appendChild(cell);
        });
    });
}

function setupInteraction() {
    const btn = document.getElementById('btn-calc-qkv');
    btn.addEventListener('click', () => {
        generateQKV();
        renderQKV();
    });
}

function generateQKV() {
    qMatrix = Utils.generateMatrix(3, 3);
    kMatrix = Utils.generateMatrix(3, 3);
    vMatrix = Utils.generateMatrix(3, 3);
}

function renderQKV() {
    Utils.renderMatrix(qMatrix, 'matrix-q');
    Utils.renderMatrix(kMatrix, 'matrix-k');
    setupAttentionViz();
}

function setupAttentionViz() {
    const attScores = Utils.multiplyMatrices(qMatrix, kMatrix);
    Utils.renderMatrix(attScores, 'attention-scores');

    const scoreContainer = document.getElementById('attention-scores');
    const explainer = document.getElementById('calc-explainer');
    const scoreCells = scoreContainer.querySelectorAll('.matrix-cell');

    scoreCells.forEach(cell => {
        cell.addEventListener('mouseenter', () => {
            const r = cell.dataset.row;
            const c = cell.dataset.col;

            Utils.highlightRow('matrix-q', r, 'highlight-row');
            Utils.highlightCol('matrix-k', c, 'highlight-col');

            cell.classList.add('active-calc');
            explainer.innerHTML = `Dot Product: <span style="color:#00d4ff">Row ${parseInt(r) + 1} (Query)</span> · <span style="color:#ff6496">Col ${parseInt(c) + 1} (Key)</span> = ${cell.textContent}`;
        });

        cell.addEventListener('mouseleave', () => {
            Utils.clearHighlights(['matrix-q', 'matrix-k']);
            cell.classList.remove('active-calc');
            explainer.textContent = "Hover over a cell to see the calculation.";
        });
    });
}
