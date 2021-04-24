export default class Matrix {
    private matrix: Array<Array<number>>;

    constructor(matrix: Array<Array<number>>) {
        this.matrix = matrix;
    }

    /**
     * Matrix multiplication
     * @see https://stackoverflow.com/a/48694670
     * @param {Matrix} m1 First matrix
     * @param {Matrix} m2 Second matrix
     * @returns {Matrix} new matrix as a result of multimplication
     */
    public static multMatrixByMatrix(m1: Matrix, m2: Matrix): Matrix {
        let result = new Array<number>(m1.rows).fill(0).map(
            row => new Array(m2.cols).fill(0)
        );

        result = result.map((row, i) => {
            return row.map((val, j) => {
                return m1.value[i].reduce((sum, elm, k) => sum + (elm * m2.value[k][j]), 0);
            })
        });

        return new Matrix(result);
    }

    get rows() {
        return this.matrix.length;
    }

    get cols() {
        return this.matrix[0].length;
    }

    /**
     * Matrix value as a 2D array
     */
    get value() {
        return this.matrix;
    }
}