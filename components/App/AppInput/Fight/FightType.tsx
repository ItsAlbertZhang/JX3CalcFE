"use client";
// child components
import { ModalLua, ModalMacro } from "./FightModals";

// my libraries
import { fetchGet, openUrl, readLua } from "@/components/actions";
import { DataInput } from "@/components/definitions";

// third party libraries
import {
    Button,
    Card,
    CardBody,
    Modal,
    Select,
    SelectItem,
    SelectSection,
    Skeleton,
    Tooltip,
    User,
    useDisclosure,
} from "@nextui-org/react";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const methods = ["使用内置循环", "使用游戏内宏", "使用lua编程语言"];
const embed = {
    "0": {
        name: "自适应 - 崇光循环",
        talent: [5972, 18279, 22888, 6717, 34383, 34395, 34372, 17567, 25166, 34378, 34347, 37337],
        helper: "自适应循环基于条件语句。\n本循环是紫武一段加速下和橙武一、二段加速下的上限循环。\n由于需要兼容橙武，本循环的特效腰坠开启时机非最优。\n紫武若想准确计算，可选择严格循环。",
        // jx3box: 77777,
    },
    "32": {
        name: "严格 - 崇光月日循环",
        talent: [5972, 18279, 22888, 6717, 34383, 34395, 34372, 17567, 25166, 34378, 34347, 37337],
        helper: "严格循环基于技能序列，因此不兼容橙武。\n本循环是紫武一段加速下的常规循环。",
    },
    "33": {
        name: "严格 - 齐光错轴循环",
        talent: [5972, 18279, 22888, 6717, 34383, 34395, 34372, 17567, 25166, 34378, 34347, 34370],
        helper: "严格循环基于技能序列，因此不兼容橙武。\n本循环是日月齐光打法紫武一段加速下的上限循环。",
    },
    "34": {
        name: "严格 - 崇光双驱三满",
        talent: [5972, 18279, 22888, 6717, 34383, 34395, 34372, 17567, 25166, 34378, 34347, 37337],
        helper: "严格循环基于技能序列，因此不兼容橙武。\n本循环是紫武二段加速下的上限循环。",
    },
    "35": {
        name: "严格 - 崇光压缩循环",
        talent: [5972, 18279, 22888, 6717, 34383, 34395, 34372, 17567, 25166, 34378, 34347, 37337],
        helper: "严格循环基于技能序列，因此不兼容橙武。\n本循环是紫武一段加速下的上限循环。",
    },
    "1024": {
        name: "简单 - 一键宏循环",
        talent: [5972, 18279, 22888, 6717, 34383, 34395, 34372, 17567, 25166, 34378, 34347, 37337],
        helper: "简单循环基于简单条件语句，逻辑与游戏内宏保持完全一致。\n简单循环可以自由更改(部分)奇穴，计算器会保持逻辑(宏)并计算结果。",
    },
};
const prefix = "FightTypeEmbed";

const TypeEmbed = ({
    dataInputs,
    updateInputs,
    page,
    setPage,
}: {
    dataInputs: DataInput[];
    updateInputs: (fn: (draft: DataInput[]) => void) => void;
    page: number;
    setPage: (page: number) => void;
}) => {
    const index = page - 1;
    const selectItems = Object.entries(embed).map(([key, value]) => (
        <SelectItem key={`${prefix}${key}`} textValue={value.name}>
            <Tooltip content={<p className="whitespace-pre-line">{value.helper}</p>} placement="right" closeDelay={0}>
                {value.name}
            </Tooltip>
        </SelectItem>
    ));
    function createFightTypePage() {
        updateInputs((draft) => {
            const newDraft: DataInput[] = [{ ...draft[index], name: "基准页" }];
            const curr = draft[index].fight.data;
            for (const [key, value] of Object.entries(embed)) {
                if (newDraft[0].effects["武器·特效"] === "血月" && value.name.startsWith("严格")) {
                    continue;
                }
                if (Number(key) !== curr) {
                    const obj = JSON.parse(JSON.stringify(newDraft[0])) as DataInput;
                    obj.fight.data = Number(key);
                    obj.talents = value.talent;
                    obj.name = value.name;
                    newDraft.push(obj);
                }
            }
            return newDraft;
        });
        setPage(1);
    }
    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        if (e.target.value === `${prefix}-1`) {
            createFightTypePage();
        } else {
            const value = e.target.value.substring(prefix.length);
            updateInputs((draft) => {
                draft[index].fight.data = Number(value);
                draft[index].talents = embed[value as keyof typeof embed].talent;
            });
        }
    }
    return (
        <motion.div layout className="w-full basis-1/2">
            <Select
                label="循环选择"
                selectedKeys={[`${prefix}${dataInputs[index].fight.data as string}`]}
                onChange={handleChange}
                disallowEmptySelection
            >
                <SelectSection showDivider>
                    <SelectItem key={`${prefix}-1`} textValue="创建 循环选择 对比">
                        <Tooltip
                            content={
                                <p>
                                    <span className="text-red-500">删除其他所有页面, </span>将当前页面提升为
                                    <span className="text-green-500">基准页</span>,
                                    <br />
                                    并以其为基准, 创建<span className="text-green-500">对比循环选择</span>所需的页面.
                                </p>
                            }
                            placement="right"
                        >
                            创建 循环选择 对比
                        </Tooltip>
                    </SelectItem>
                </SelectSection>
                <SelectSection title="循环选择">{selectItems}</SelectSection>
            </Select>
        </motion.div>
    );
};

const TypeCustom = ({ onPress, valid, text }: { onPress: () => void; valid: boolean; text: string }) => {
    return (
        <Button
            onPress={onPress}
            color={valid ? "success" : "danger"}
            startContent={valid ? <FaCircleCheck /> : <FaCircleXmark />}
            className="min-w-min"
        >
            {text}
        </Button>
    );
};

const TypeLink = ({ dataInput }: { dataInput: DataInput }) => {
    type typeData = {
        author: string;
        title: string;
        avatar: string;
    };
    const [data, setData] = useState<typeData>();
    const fightData = dataInput.fight.data;
    const embedItem = embed[fightData as keyof typeof embed];
    const id = "jx3box" in embedItem ? embedItem.jx3box : undefined;
    const url = `https://www.jx3box.com/bps/${id}`;
    useEffect(() => {
        if (id === undefined) {
            setData(undefined);
        } else {
            fetchGet({ host: "cms.jx3box.com", path: `/api/cms/post/${id}` }).then((res) => {
                if (res.code === 0) {
                    setData({
                        author: res.data.author,
                        title: res.data.post_title,
                        avatar: res.data.author_info.user_avatar,
                    });
                }
            });
        }
    }, [dataInput.fight.data, id]);
    if (id)
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="w-full flex flex-col justify-center items-center"
            >
                <Card
                    isHoverable
                    isPressable
                    onPress={() => {
                        openUrl(url);
                    }}
                >
                    <Skeleton isLoaded={data !== undefined}>
                        <CardBody>
                            <User
                                name={data ? data.title : "loading"}
                                description={<p className="indent-2">作者: {data ? data.author : "loading..."}</p>}
                                avatarProps={{
                                    src: data ? data.avatar : "",
                                }}
                            />
                        </CardBody>
                    </Skeleton>
                </Card>
            </motion.div>
        );
    else return <></>;
};

export const FightType = ({
    dataInputs,
    updateInputs,
    page,
    setPage,
    allowLua,
}: {
    dataInputs: DataInput[];
    updateInputs: (fn: (draft: DataInput[]) => void) => void;
    page: number;
    setPage: (page: number) => void;
    allowLua: boolean;
}) => {
    const index = page - 1;
    const [method, setMethod] = useState(dataInputs[index].fight.method);
    const modal = useDisclosure();
    const valid = method === dataInputs[index].fight.method;

    const selectItems = methods.slice(0, allowLua ? methods.length : methods.length - 1).map((method) => (
        <SelectItem key={method} textValue={method}>
            {method}
        </SelectItem>
    ));

    async function selectLuaFile() {
        const file = await readLua();
        if (file.length > 0) {
            updateInputs((draft) => {
                draft[index].fight = {
                    method: methods[2],
                    data: file,
                };
            });
        }
    }
    function submitCustom(macros: string[]) {
        const data = macros.filter((item) => item !== ""); // 过滤空宏
        if (data.length > 0) {
            updateInputs((draft) => {
                draft[index].fight = {
                    method: methods[1],
                    data: data,
                };
            });
        }
    }

    const methodComponents = {
        [methods[0]]: {
            selectHelper: (
                <TypeEmbed dataInputs={dataInputs} updateInputs={updateInputs} page={page} setPage={setPage} />
            ),
            modalContent: <></>,
        },
        [methods[1]]: {
            selectHelper: <TypeCustom onPress={modal.onOpen} valid={valid} text="重新输入" />,
            modalContent: <ModalMacro submitCustom={submitCustom} />,
        },
        [methods[2]]: {
            selectHelper: <TypeCustom onPress={selectLuaFile} valid={valid} text="选择lua文件" />,
            modalContent: <ModalLua selectLuaFile={selectLuaFile} />,
        },
        default: {
            selectHelper: <></>,
            modalContent: <></>,
        },
    };

    const { selectHelper, modalContent } = methodComponents[method] || methodComponents.default;

    // 选择事件
    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setMethod(e.target.value);
        updateInputs((draft) => {
            draft[index].fight = {
                method: methods[0],
                data: 0,
            };
        });
        modal.onOpen();
    }

    return (
        <div className="w-full flex flex-col justify-center items-center gap-4">
            <motion.div layout className="w-full flex flex-col xl:flex-row justify-center items-center gap-4">
                <motion.div layout className="w-full basis-1/2">
                    <Select label="战斗规则" selectedKeys={[method]} onChange={handleChange} disallowEmptySelection>
                        {selectItems}
                    </Select>
                </motion.div>
                {selectHelper}
                <Modal
                    isOpen={modal.isOpen}
                    onOpenChange={modal.onOpenChange}
                    placement="center"
                    backdrop="blur"
                    scrollBehavior="inside"
                    isDismissable={false}
                    isKeyboardDismissDisabled={true}
                    hideCloseButton={true}
                >
                    {modalContent}
                </Modal>
            </motion.div>
            {/* {method === methods[0] ? <TypeLink dataInput={dataInputs[index]} /> : <></>} */}
        </div>
    );
};
