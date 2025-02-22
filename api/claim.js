import { ethers } from "ethers";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

    const { address } = req.body;
    if (!ethers.utils.isAddress(address)) return res.status(400).json({ message: "Invalid address" });

    // Konfigurasi provider & wallet
    const provider = new ethers.providers.JsonRpcProvider("https://testnet-rpc.monad.io");
    const privateKey = process.env.PRIVATE_KEY;  // Simpan di Vercel env
    const wallet = new ethers.Wallet(privateKey, provider);

    // Kontrak Faucet
    const contractAddress = "0x67b32f1146e0ea1d3234bb0b6ae965bac138ee94"; // Ganti dengan kontrak faucet kamu
    const abi = [ "function sendFaucet(address recipient) external" ];
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    try {
        const tx = await contract.sendFaucet(address);
        await tx.wait();
        res.status(200).json({ message: "Success!", txHash: tx.hash });
    } catch (error) {
        res.status(500).json({ message: "Transaction failed", error: error.toString() });
    }
}
