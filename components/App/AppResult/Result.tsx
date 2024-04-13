"use client";
// my libraries
import { Z_99 } from "@/components/Common";
// third party libraries
import { Card, CardBody, Tooltip } from "@nextui-org/react";
import { MathJax, MathJaxContext } from "better-react-mathjax";

export const Result = ({ avg, sd, ci, n }: { avg: number; sd: number; ci: number; n: number }) => {
    const ciAbsolute = ci.toFixed(ci > 100 ? 0 : ci > 10 ? 1 : 2);
    const ciPercent = ((ci / avg) * 100).toFixed(3) + "%";
    const tooltip = (
        <div className="flex flex-col gap-2">
            <MathJaxContext>
                <p>有 99% 的把握认为真实 DPS 位于该区间内.</p>
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
        </div>
    );
    return (
        <div className="basis-full flex flex-col justify-center items-center gap-4 sm:flex-row">
            <Card>
                <CardBody>
                    <p className="text-2xl">DPS: {avg}</p>
                </CardBody>
            </Card>
            <Tooltip showArrow={true} content={tooltip}>
                <Card>
                    <CardBody>
                        <p className="text-2xl">
                            置信区间: <span className="text-xl">±</span>
                            {ciAbsolute} / <span className="text-xl">±</span>
                            {ciPercent}
                        </p>
                    </CardBody>
                </Card>
            </Tooltip>
        </div>
    );
};
