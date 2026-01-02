// Shared Utilities for Transformer Visualizations

const Utils = {
    generateMatrix: function (rows, cols) {
        let matrix = [];
        for (let i = 0; i < rows; i++) {
            let row = [];
            for (let j = 0; j < cols; j++) {
                row.push((Math.random() * 2 - 1).toFixed(2));
            }
            matrix.push(row);
        }
        return matrix;
    },

    renderMatrix: function (matrix, elementId, customClass = '') {
        const container = document.getElementById(elementId);
        if (!container) return;

        container.innerHTML = '';
        const cols = matrix[0].length;
        container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

        matrix.forEach((row, rowIndex) => {
            row.forEach((val, colIndex) => {
                const cell = document.createElement('div');
                cell.className = `matrix-cell ${customClass}`;
                cell.textContent = val;
                cell.dataset.row = rowIndex;
                cell.dataset.col = colIndex;
                container.appendChild(cell);
            });
        });
    },

    multiplyMatrices: function (m1, m2) {
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
    },

    highlightRow: function (containerId, rowIndex, className) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const cells = container.querySelectorAll('.matrix-cell');
        cells.forEach(cell => {
            if (cell.dataset.row === rowIndex) cell.classList.add(className);
        });
    },

    highlightCol: function (containerId, colIndex, className) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const cells = container.querySelectorAll('.matrix-cell');
        cells.forEach(cell => {
            if (cell.dataset.col === colIndex) cell.classList.add(className);
        });
    },

    clearHighlights: function (containerIds) {
        containerIds.forEach(id => {
            const container = document.getElementById(id);
            if (!container) return;
            const cells = container.querySelectorAll('.matrix-cell');
            cells.forEach(cell => {
                cell.classList.remove('highlight-row', 'highlight-col', 'active-calc', 'encoder-highlight', 'decoder-highlight');
            });
        });
    }
};
