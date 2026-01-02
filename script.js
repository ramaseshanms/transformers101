// Transformer Visualization Logic

document.addEventListener('DOMContentLoaded', () => {
    initVisualization();
});

// Demo Data (Simplified for visualization)
const inputTokens = ["The", "cat", "sat"];
const embeddingDim = 4; // keeping it small for visuals

// Random matrix generator
function generateMatrix(rows, cols) {
    let matrix = [];
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < cols; j++) {
            // Random value between -1 and 1, rounded to 2 decimals
            row.push((Math.random() * 2 - 1).toFixed(2));
        }
        matrix.push(row);
    }
    return matrix;
}

function initVisualization() {
    renderEmbeddings();
    setupInteraction();
}

function renderEmbeddings() {
    const container = document.getElementById('embedding-matrix');
    // 3 tokens x 4 dimensions
    const matrix = generateMatrix(inputTokens.length, embeddingDim);
    
    // Set grid style
    container.style.gridTemplateColumns = `repeat(${embeddingDim}, 1fr)`;
    
    matrix.forEach(row => {
        row.forEach(val => {
            const cell = document.createElement('div');
            cell.className = 'matrix-cell';
            cell.textContent = val;
            container.appendChild(cell);
        });
    });
}

// Q, K, V Generation & Display
let qMatrix, kMatrix, vMatrix;

function setupInteraction() {
    const btn = document.getElementById('btn-calc-qkv');
    btn.addEventListener('click', () => {
        generateQKV();
        renderQKV();
        // Scroll to next section smoothly if needed or just unlock it
    });
}

function generateQKV() {
    // For simplicity, we'll just generate them directly rather than doing input * W_q
    qMatrix = generateMatrix(3, 3); // 3x3 for simplicity in dot product
    kMatrix = generateMatrix(3, 3); // Transposed K usually, but let's keep it simple
    vMatrix = generateMatrix(3, 3);
}

function renderQKV() {
    renderMatrix(qMatrix, 'matrix-q');
    renderMatrix(kMatrix, 'matrix-k'); // Actually K^T
    
    // Now trigger the attention scores calc setup
    setupAttentionViz();
}

function renderMatrix(matrix, elementId) {
    const container = document.getElementById(elementId);
    container.innerHTML = ''; // Clear prev
    const cols = matrix[0].length;
    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    
    matrix.forEach((row, rowIndex) => {
        row.forEach((val, colIndex) => {
            const cell = document.createElement('div');
            cell.className = 'matrix-cell';
            cell.textContent = val;
            cell.dataset.row = rowIndex;
            cell.dataset.col = colIndex;
            container.appendChild(cell);
        });
    });
}

function setupAttentionViz() {
    // Generate the Attention Score matrix (Q * K^T)
    // 3x3 matrix Result
    const attScores = multiplyMatrices(qMatrix, kMatrix);
    renderMatrix(attScores, 'attention-scores');
    
    // Add hover effects for "Visual Math"
    const scoreContainer = document.getElementById('attention-scores');
    const qContainer = document.getElementById('matrix-q');
    const kContainer = document.getElementById('matrix-k');
    const explainer = document.getElementById('calc-explainer');

    const scoreCells = scoreContainer.querySelectorAll('.matrix-cell');
    
    scoreCells.forEach(cell => {
        cell.addEventListener('mouseenter', () => {
            const r = cell.dataset.row;
            const c = cell.dataset.col;
            
            // Highlight Row in Q
            highlightRow(qContainer, r, 'highlight-row');
            // Highlight Col in K
            highlightCol(kContainer, c, 'highlight-col');
            
            // Highlight self
            cell.classList.add('active-calc');
            
            // Show math explanation
            explainer.innerHTML = `Dot Product: <span style="color:#00d4ff">Row ${parseInt(r)+1} (Query)</span> · <span style="color:#ff6496">Col ${parseInt(c)+1} (Key)</span> = ${cell.textContent}`;
        });

        cell.addEventListener('mouseleave', () => {
            clearHighlights(qContainer);
            clearHighlights(kContainer);
            cell.classList.remove('active-calc');
            explainer.textContent = "Hover over a cell to see the calculation.";
        });
    });
}

function highlightRow(container, rowIndex, className) {
    const cells = container.querySelectorAll('.matrix-cell');
    cells.forEach(cell => {
        if (cell.dataset.row === rowIndex) {
            cell.classList.add(className);
        }
    });
}

function highlightCol(container, colIndex, className) {
    const cells = container.querySelectorAll('.matrix-cell');
    cells.forEach(cell => {
        if (cell.dataset.col === colIndex) {
            cell.classList.add(className);
        }
    });
}

function clearHighlights(container) {
    const cells = container.querySelectorAll('.matrix-cell');
    cells.forEach(cell => {
        cell.classList.remove('highlight-row', 'highlight-col');
    });
}

// Matrix Multiplication Helper
function multiplyMatrices(m1, m2) {
    var result = [];
    for (var r = 0; r < m1.length; r++) {
        result[r] = [];
        for (var c = 0; c < m2[0].length; c++) {
            var sum = 0;
            for (var i = 0; i < m1[0].length; i++) {
                sum += parseFloat(m1[r][i]) * parseFloat(m2[i][c]);
            }
            result[r][c] = sum.toFixed(2);
        }
    }
    return result;
}
