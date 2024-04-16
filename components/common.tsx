export const Z_99 = 2.576;

export function solveSampleSize(oneSideConfidenceInterval: number, sd: number, z: number) {
    return Math.ceil(Math.pow((z * sd) / oneSideConfidenceInterval, 2));
}

function getRoundedRectPath(x: number, y: number, width: number, height: number, radius: number) {
    const absWidth = Math.abs(width);
    const absHeight = Math.abs(height);
    const absX = width > 0 ? x : x + width;
    const absY = height > 0 ? y : y + height;

    return `
        M ${absX + radius}, ${absY}
        h ${absWidth - 2 * radius}
        a ${radius},${radius} 0 0 1 ${radius},${radius}
        v ${absHeight - 2 * radius}
        a ${radius},${radius} 0 0 1 ${-radius},${radius}
        h ${-absWidth + 2 * radius}
        a ${radius},${radius} 0 0 1 ${-radius},${-radius}
        v ${-absHeight + 2 * radius}
        a ${radius},${radius} 0 0 1 ${radius},${-radius}
        z
    `;
}

export const CustomBar = (props: any) => {
    const { fill, x, y, width, height } = props;
    const maxRadius = Math.min(Math.abs(width), Math.abs(height)) / 2;
    const radius = Math.min(Math.abs(height) / 3, maxRadius);

    return <path d={getRoundedRectPath(x, y, width, height, radius)} stroke="none" fill={fill} />;
};
