/////////
//
// Adapted from corresponding Typescript source
//
// Should use this to refactor whole bot
// https://github.com/solana-labs/solana-program-library/blob/3613cea3cabbb5f7e4445d6203b7292d413732da/token-swap/js/client/token-swap.js
//
// And import Orca consts from here
// https://gist.github.com/rawfalafel/f7c3a35289f99d2bf97e43636e369a5d
//
/////////

const accounts = require("./utils/accounts.js");
const tokenSwap = require("./models/tokenSwap.js");
const orcaConsts = require("./orcaConsts");

const solanaWeb3 = require('@solana/web3.js');
const spl = require('@solana/spl-token');

//---------------
// Accounts.tsx
//---------------
const queryMint = async (connection, pubKey) => {
    const address = pubKey.toBase58();
    let mint = mintCache.get()
}

const accountsCache = new Map();

const getCachedAccount = (
    predicate => {
        for (const account of accountsCache.values()) {
            if (predicate(account)) {
                return account;
            }
        }
    });

const approveAmount = function (
    instructions, cleanupInstructions, account, owner, amount, delegate
) {
    const transferAuthority = new solanaWeb3.Account();

    instructions.push(
        spl.Token.createApproveInstruction(
            new solanaWeb3.PublicKey(orcaConsts.programIds.token), account, delegate ?? transferAuthority.publicKey,
            owner, [], amount
        )
    );

    cleanupInstructions.push(
        spl.Token.createRevokeInstruction(new solanaWeb3.PublicKey(orcaConsts.programIds.token), account, owner, [])
    );

    return transferAuthority;
}

const getWrappedAccount = function (
    poolInfo, instructions, cleanupInstructions, payer, amount, signers
) {
    const account = new solanaWeb3.Account();
    instructions.push(
        solanaWeb3.SystemProgram.createAccount({
            fromPubkey: payer,
            newAccountPubkey: account.publicKey,
            lamports: amount,
            space: spl.AccountLayout.span,
            programId: new solanaWeb3.PublicKey(orcaConsts.programIds.token),
        })
    );

    instructions.push(
        spl.Token.createInitAccountInstruction(
            new solanaWeb3.PublicKey(orcaConsts.programIds.token),
            new solanaWeb3.PublicKey(orcaConsts.tokens.SOL.address),
            account.publicKey,
            payer
        )
    );

    cleanupInstructions.push(
        spl.Token.createCloseAccountInstruction(
            new solanaWeb3.PublicKey(orcaConsts.programIds.token),
            account.publicKey,
            payer, payer, []
        )
    );

    signers.push(account);

    return account.publicKey;
};

const findOrCreateAccountByMint = function(
    payer, owner, instructions, cleanupInstructions, accountRentExempt, mint, signers, excluded
) {
    const accountToFind = mint.toBase58();
    const account = getCachedAccount((acc) =>
        acc.info.mint.toBase58() === accountToFind &&
        acc.info.owner.toBase58() === owner.toBase58() &&
        (excluded === undefined || !excluded.has(acc.pubkey.toBase58()))
    );
    const isWrappedSol = accountToFind === orcaConsts.tokens.SOL.address;

    let toAccount;
    if (account && !isWrappedSol) {
        toAccount = account.pubkey;
    } else {
        const newToAccount = createSplAccount(
            instructions, payer, accountRentExempt, mint, owner, spl.AccountLayout.span
        );

        toAccount = newToAccount.publicKey;
        signers.push(newToAccount);

        if (isWrappedSol) {
            cleanupInstructions.push(
                spl.Token.createCloseAccountInstruction(
                    new solanaWeb3.PublicKey(orcaConsts.programIds.token),
                    toAccount, payer, payer, []
                )
            );
        }
    }

    return toAccount;
}

const createSplAccount = function (
    instructions, payer, accountRentExempt, mint, owner, space
) {
    const account = new solanaWeb3.Account();
    instructions.push(
        solanaWeb3.SystemProgram.createAccount({
            fromPubkey: payer,
            newAccountPubkey: account.publicKey,
            lamports: accountRentExempt,
            space,
            programId: new solanaWeb3.PublicKey(orcaConsts.programIds.token),
        })
    );

    instructions.push(
        spl.Token.createInitAccountInstruction(
            new solanaWeb3.PublicKey(orcaConsts.programIds.token),
            mint,
            account.publicKey,
            owner
        )
    );

    return account;
}

const getErrorForTransaction = async (connection, txid) => {
    // wait for all confirmation before geting transaction
    await connection.confirmTransaction(txid, "max");

    const tx = await connection.getParsedConfirmedTransaction(txid);

    const errors = [];
    if (tx?.meta && tx.meta.logMessages) {
        tx.meta.logMessages.forEach((log) => {
            const regex = /Error: (.*)/gm;
            let m;
            while ((m = regex.exec(log)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                if (m.length > 1) {
                    errors.push(m[1]);
                }
            }
        });
    }

    return errors;
};

const sendTransaction = async (connection, account, instructions, signers) => {
    let transaction = new solanaWeb3.Transaction();
    instructions.forEach((instruction) => transaction.add(instruction));
    transaction.recentBlockhash = (
        await connection.getRecentBlockhash("max")
    ).blockhash;
    transaction.setSigners(
        account.publicKey, ...signers.map((s) => s.publicKey)
    );

    // signers.forEach((signer) => {console.log("Signers contain: " + signer.publicKey.toBase58() + signer.secretKey.toJSON());});
    // console.log("Transaction Signers contins before: " + transaction.signers);

    transaction.feePayer = account.publicKey;
    transaction.sign(account);
    for (const signer of signers) {
        // console.log("Partial Sign by " + signer.publicKey.toBase58());
        transaction.partialSign(signer);
    }

    const rawTransaction = transaction.serialize();
    let options = {
        skipPreflight: true,
        commitment: "finalized",
    };

    // const txid = await solanaWeb3.sendAndConfirmRawTransaction(connection, rawTransaction, options);
    const txid = await connection.sendRawTransaction(rawTransaction, options);

    const status = (
        await connection.confirmTransaction(txid, options && options.commitment)
    )
    if (status?.err) {
        // const errors = await getErrorForTransaction(connection, txid);
        console.log("Transaction failed... " + JSON.stringify(status));
    }

    return txid;
}


const swap = async function(connection, account, poolInfo, amountIn, minAmountOut) {
    // let connection = new solanaWeb3.Connection("https://devnet.solana.com");

    // const accountRentExempt = await connection.getMinimumBalanceForRentExemption(spl.AccountLayout.span);

    //---------------------------
    // SWAP
    //---------------------------

    let instructions = [];
    let cleanupInstructions = [];
    let signers = [];

    // const fromAccount = getWrappedAccount(
    //     poolInfo, instructions, cleanupInstructions,
    //     account.publicKey, amountIn + accountRentExempt, signers
    // );
    // const fromAccount = findOrCreateAccountByMint(
    //     account.publicKey, account.publicKey,
    //     instructions, cleanupInstructions, accountRentExempt,
    //     poolInfo.token1Mint,
    //     signers
    // )
    //
    // let toAccount = findOrCreateAccountByMint(
    //     account.publicKey, account.publicKey,
    //     instructions, cleanupInstructions, accountRentExempt,
    //     poolInfo.token2Mint,
    //     signers
    // );

    // const fromAccount = new solanaWeb3.PublicKey('At5gYkvPzv5TbxYiNcB9UwHjLb8e6doWXUf4pog9y7HF');
    // const toAccount = new solanaWeb3.PublicKey('BNqiPD66hi3ELLPUS6vpegSWckAU7S4qa1JAeSvCAMm8');
    const fromAccount = poolInfo.userSource;
    const toAccount = poolInfo.userDestination;

    const poolMint = await accounts.cache.queryMint(connection, poolInfo.poolMint);
    const authority = poolMint.mintAuthority;

    // Approve
    const transferAuthority = approveAmount(
        instructions, cleanupInstructions, fromAccount, account.publicKey, amountIn, undefined
    );
    signers.push(transferAuthority);

    // let hostFeeAccount = poolInfo.hostFeeAccount
    //     ? findOrCreateAccountByMint(
    //         account.publicKey, poolInfo.hostFeeAccount, instructions, cleanupInstructions,
    //         accountRentExempt, poolInfo.poolMint, signers
    //     ) : undefined;

    const holdingA = poolInfo.token1;
    const holdingB = poolInfo.token2;

    instructions.push(
        tokenSwap.swapInstruction(
            poolInfo.pool,
            authority,
            transferAuthority.publicKey,
            fromAccount,
            holdingA, holdingB,
            toAccount,
            poolInfo.poolMint,
            poolInfo.hostFeeAccount,
            new solanaWeb3.PublicKey(orcaConsts.programIds.tokenSwap),
            new solanaWeb3.PublicKey(orcaConsts.programIds.token),
            amountIn,
            minAmountOut,
            undefined,
            true
        )
    );

    let tx = await sendTransaction(
        connection, account, instructions.concat(cleanupInstructions),
        signers
    );

    console.log(tx);
}

module.exports = {swap, sendTransaction, approveAmount};
