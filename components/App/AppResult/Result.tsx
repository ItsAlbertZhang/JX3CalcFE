"use client";
// third party libraries
import { Card, CardBody, Divider, Spacer, Tooltip } from "@nextui-org/react";
import { MathJax, MathJaxContext } from "better-react-mathjax";

const Z_99 = 2.576;

export const Result = ({
    avg,
    sd,
    ci,
    n,
    max,
    min,
}: {
    avg: number;
    sd: number;
    ci: number;
    n: number;
    max: number;
    min: number;
}) => {
    const ciAbsolute = ci.toFixed(ci > 100 ? 0 : ci > 10 ? 1 : 2);
    const ciPercent = ((ci / avg) * 100).toFixed(3) + "%";
    const sdAbsolute = sd.toFixed(sd > 100 ? 0 : sd > 10 ? 1 : 2);
    const sdPercent = ((sd / avg) * 100).toFixed(3) + "%";
    const tooltip = (
        <div className="flex flex-col gap-2">
            <MathJaxContext>
                <p>置信区间: 有 99% 的把握认为真实 DPS 位于该区间内.</p>
                <div>
                    <p>
                        置信区间 =<MathJax inline>{"\\( \\frac{\\sigma}{\\sqrt{n}} \\cdot Z\\)"}</MathJax>
                    </p>
                    <p>
                        <MathJax inline>{"\\(\\sigma\\)"}</MathJax> : 标准差. 当前为 {sd}.
                    </p>
                    <p>
                        <MathJax inline>{"\\(n\\)"}</MathJax> : 样本量. 当前为 {n}.
                    </p>
                    <p>
                        <MathJax inline>{"\\(Z\\)"}</MathJax> : Z分数.
                    </p>
                    <p>对于正态分布, 99% 置信度的 Z分数 为 {Z_99}.</p>
                </div>
            </MathJaxContext>
            <Divider />
            <p>置信区间与标准差有何区别?</p>
            <p>
                置信区间是对<span className="text-orange-500">平均结果</span>的
                <span className="text-orange-500">落点区间</span>估计, 随计算次数增多
                <span className="text-orange-500">渐趋于0</span>.<br />
                而标准差是对<span className="text-orange-500">每次实验</span>的
                <span className="text-orange-500">离散程度</span>估计, 随计算次数增多
                <span className="text-orange-500">渐趋稳定</span>.
            </p>
            <p>
                例如, 投一枚质地均匀的硬币, 随实验次数增多,
                <br />
                置信区间渐趋于 0 , 而标准差渐趋于 0.5 .
            </p>
        </div>
    );
    return (
        <div className="basis-full flex flex-col justify-center items-center gap-4 sm:flex-row">
            <Card>
                <CardBody>
                    <p className="text-3xl">DPS: {avg}</p>
                </CardBody>
            </Card>
            <Tooltip showArrow={true} content={tooltip}>
                <Card>
                    <CardBody className="grid grid-rows-2 grid-flow-col justify-items-center items-center text-base text-center">
                        <p className="w-full">置信区间</p>
                        <p className="w-full">标准差</p>
                        <Spacer />
                        <Spacer />
                        <p className="w-full">
                            : <span className="text-sm">± </span>
                        </p>
                        <p className="w-full">
                            : <span className="text-sm">± </span>
                        </p>
                        <p>
                            {ciAbsolute} ({ciPercent})
                        </p>
                        <p>
                            {sdAbsolute} ({sdPercent})
                        </p>
                    </CardBody>
                </Card>
            </Tooltip>
            <Card>
                <CardBody className="grid grid-rows-2 grid-flow-col justify-items-center items-center text-base text-center">
                    <p>最高:</p>
                    <p>最低:</p>
                    <Spacer />
                    <Spacer />
                    <p>{max}</p>
                    <p>{min}</p>
                </CardBody>
            </Card>
        </div>
    );
};
