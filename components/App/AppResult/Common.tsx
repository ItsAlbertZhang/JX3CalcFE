// export const Z_99 = 2.576;

// export function solveSampleSize(oneSideConfidenceInterval: number, sd: number, z: number) {
//     return Math.ceil(Math.pow((z * sd) / oneSideConfidenceInterval, 2));
// }

function getHorizontalRoundedRectPath(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    radiusEndOnly: boolean
) {
    // const absWidth = Math.abs(width);
    // const absHeight = Math.abs(height);
    // const absX = width > 0 ? x : x + width;
    // const absY = height > 0 ? y : y + height;

    // return `
    //     M ${absX + radius}, ${absY}
    //     h ${absWidth - 2 * radius}
    //     a ${radius},${radius} 0 0 1 ${radius},${radius}
    //     v ${absHeight - 2 * radius}
    //     a ${radius},${radius} 0 0 1 ${-radius},${radius}
    //     h ${-absWidth + 2 * radius}
    //     a ${radius},${radius} 0 0 1 ${-radius},${-radius}
    //     v ${-absHeight + 2 * radius}
    //     a ${radius},${radius} 0 0 1 ${radius},${-radius}
    //     z
    // `;
    const sign = width > 0 ? 1 : -1;
    const flag = width > 0 ? 1 : 0;
    const radiusStart = radiusEndOnly ? 0 : radius;
    return `
        M ${x + sign * radiusStart}, ${y}
        h ${width - sign * (radiusStart + radius)}
        a ${radius},${radius} 0 0 ${flag} ${sign * radius},${radius}
        v ${height - 2 * radius}
        a ${radius},${radius} 0 0 ${flag} ${-sign * radius},${radius}
        h ${-width + sign * (radiusStart + radius)}
        a ${radiusStart},${radiusStart} 0 0 ${flag} ${-sign * radiusStart},${-radiusStart}
        v ${-height + 2 * radiusStart}
        a ${radiusStart},${radiusStart} 0 0 ${flag} ${sign * radiusStart},${-radiusStart}
        z
    `;
}

export const HorizontalRoundedBar = (props: any) => {
    const { fill, x, y, width, height } = props;
    const maxRadius = Math.min(Math.abs(width), Math.abs(height)) / 2;
    const radius = Math.min(Math.abs(height) / 3, maxRadius);

    return <path d={getHorizontalRoundedRectPath(x, y, width, height, radius, false)} stroke="none" fill={fill} />;
};

export const HorizontalEndRoundedBar = (props: any) => {
    const { fill, x, y, width, height } = props;
    const maxRadius = Math.min(Math.abs(width), Math.abs(height)) / 2;
    const radius = Math.min(Math.abs(height) / 3, maxRadius);

    return <path d={getHorizontalRoundedRectPath(x, y, width, height, radius, true)} stroke="none" fill={fill} />;
};
