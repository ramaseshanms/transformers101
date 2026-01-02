// Cross-Attention Logic

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-gen-cross').addEventListener('click', initCrossAttention);
});

let decQ, encK;

function initCrossAttention() {
    // Decoder Q (Batch 1, 3 tokens, 3 dim)
    decQ = Utils.generateMatrix(3, 3);
    // Encoder K (Batch 1, 3 tokens, 3 dim)
    encK = Utils.generateMatrix(3, 3);

    Utils.renderMatrix(decQ, 'dec-q');
    Utils.renderMatrix(encK, 'enc-k');

    // Calculates scores
    const scores = Utils.multiplyMatrices(decQ, encK);
    Utils.renderMatrix(scores, 'cross-scores');

    enableCrossInteraction();
}

function enableCrossInteraction() {
    const scores = document.getElementById('cross-scores').querySelectorAll('.matrix-cell');
    const explainer = document.getElementById('cross-explainer');

    scores.forEach(cell => {
        cell.addEventListener('mouseenter', () => {
            const r = cell.dataset.row;
            const c = cell.dataset.col;

            // Highlight Decoder Row (Query)
            Utils.highlightRow('dec-q', r, 'decoder-highlight');

            // Highlight Encoder Col (Key)
            Utils.highlightCol('enc-k', c, 'encoder-highlight');

            cell.classList.add('active-calc');
            explainer.innerHTML = `Decoder Token ${parseInt(r) + 1} attends to Encoder Token ${parseInt(c) + 1} with score <strong>${cell.textContent}</strong>`;
        });

        cell.addEventListener('mouseleave', () => {
            Utils.clearHighlights(['dec-q', 'enc-k']);
            cell.classList.remove('active-calc');
            explainer.textContent = "Hover over the scores to see the cross-module connection.";
        });
    });
}
