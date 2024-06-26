"use client";
// my libraries
import { DataInput, Talent } from "@/components/definitions";
import { talentOptions } from "@/components/default";

// third party libraries
import { Image, Select, SelectItem } from "@nextui-org/react";
import { motion } from "framer-motion";

const SelectItemRender = ({ item }: { item: Talent }) => {
    return (
        <div key={item.skillID.toString()} className="flex justify-center items-center gap-2">
            <Image width={32} alt={item.name} src={`https://icon.jx3box.com/icon/${item.iconID}.png`} />
            <p className="grow">{item.name}</p>
        </div>
    );
};

export const Talents = ({
    dataInput,
    updateInput,
}: {
    dataInput: DataInput;
    updateInput: (fn: (draft: DataInput) => void) => void;
}) => {
    const qixue = talentOptions.map((items, idx) => (
        <Select
            key={`第${idx}重奇穴`}
            aria-label={`第${idx}重奇穴`}
            size="lg"
            disallowEmptySelection
            isDisabled={typeof dataInput.fight.data === "number" && dataInput.fight.data < 1024}
            selectedKeys={[dataInput.talents[idx].toString()]}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                updateInput((draft) => {
                    draft.talents[idx] = parseInt(e.target.value);
                });
            }}
            items={items}
            renderValue={(items) => {
                return items.map((item, jdx) =>
                    item.data ? <SelectItemRender key={`${idx}-${jdx}`} item={item.data} /> : <></>
                );
            }}
        >
            {(item) => (
                <SelectItem key={item.skillID.toString()} aria-label={item.skillID.toString()}>
                    <SelectItemRender item={item} />
                </SelectItem>
            )}
        </Select>
    ));

    return (
        <motion.div layout className="w-full grid grid-cols-2 xl:grid-cols-3 justify-items-center items-center gap-2">
            {qixue}
        </motion.div>
    );
};
