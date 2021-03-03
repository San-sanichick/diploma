import Vector2D from "./vector2d";

export default class Matrix {
    private matrix: Array<Array<number>>;

    constructor(matrix: Array<Array<number>>) {
        this.matrix = matrix;
    }

    /**
     * Matrix multiplication
     * @see https://stackoverflow.com/a/48694670
     * @param m1 First matrix
     * @param m2 Second matrix
     */
    public static multMatrixByMatrix(m1: Matrix, m2: Matrix) {
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

    get value() {
        return this.matrix;
    }
}