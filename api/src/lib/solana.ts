export function detectExplorerClusterParam(rpcUrl: string): "devnet" | "testnet" | null {
  const rpc = rpcUrl.toLowerCase();
  if (rpc.includes("devnet")) {
    return "devnet";
  }
  if (rpc.includes("testnet")) {
    return "testnet";
  }
  return null;
}
