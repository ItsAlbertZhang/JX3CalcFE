export const Z_99 = 2.576;

export function solveSampleSize(oneSideConfidenceInterval: number, sd: number, z: number) {
    return Math.ceil(Math.pow((z * sd) / oneSideConfidenceInterval, 2));
}

function getRoundedRectPath(x: number, y: number, width: number, height: number, radius: number) {
    return `
        M ${x + radius}, ${y}
        h ${width - 2 * radius}
        a ${radius},${radius} 0 0 1 ${radius},${radius}
        v ${height - 2 * radius}
        a ${radius},${radius} 0 0 1 ${-radius},${radius}
        h ${-width + 2 * radius}
        a ${radius},${radius} 0 0 1 ${-radius},${-radius}
        v ${-height + 2 * radius}
        a ${radius},${radius} 0 0 1 ${radius},${-radius}
        z
    `;
}

export const CustomBar = (props: any) => {
    const { fill, x, y, width, height } = props;
    const maxRadius = Math.min(width, height) / 2;
    const radius = Math.min(height / 3, maxRadius);

    return <path d={getRoundedRectPath(x, y, width, height, radius)} stroke="none" fill={fill} />;
};
