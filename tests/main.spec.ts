import { Cell, Address, toNano } from "ton-core";
import { Blockchain } from "@ton-community/sandbox";
import { hex } from "../build/main.compiled.json";
import { MainContract } from "../wrappers/MainContract";

import "@ton-community/test-utils";

describe("main.fc contract tests", () => {
    it("should successfully increment the number", async () => {
        const blockchain = await Blockchain.create();
        const codeCell = Cell.fromBoc(Buffer.from(hex, "hex"))[0];

        const initAddress = await blockchain.treasury("initAddress");

        const myContract = blockchain.openContract(
            await MainContract.createFromConfig({
                number: 0,
                sender: initAddress.address,
            }, codeCell)
        );

        const senderWallet = await blockchain.treasury("sender");

        const sentMessageResult = await myContract.sendIncrement(
            senderWallet.getSender(),
            toNano("0.05"),
            1
        );

        expect(sentMessageResult.transactions).toHaveTransaction({
            from: senderWallet.address,
            to: myContract.address,
            success: true,
        });

        const data = await myContract.getData();

        expect(data.recent_sender.toString()).toBe(senderWallet.address.toString());
        expect(data.number).toEqual(1);
    });
});
