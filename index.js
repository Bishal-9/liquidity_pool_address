require("dotenv").config()

const ethers = require("ethers")

const provider_url =
    "https://mainnet.infura.io/v3/" + process.env.INFURA_API_KEY.toString().trim()
const provider = new ethers.JsonRpcProvider(provider_url)

const usdc_address = process.env.TOKEN0.toString().trim()
const weth_address = process.env.TOKEN1.toString().trim()
const uniswap_v3_factory_address = process.env.UNISWAP_V3_FACTORY_ADDRESS.toString().trim()

const get_abi = async (contract_address) => {
    let response
    const url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${contract_address}&apikey=${process.env.ETHERSCAN_API_KEY.toString().trim()}`

    await fetch(url)
        .then((_response) => _response.json())
        .then((_data) => (response = _data))
        .catch((_error) => {
            console.log("Etherscan ABI fetching error: ", _error)
        })

    return response
}

const main = async () => {

    const uniswap_v3_factory_abi = await get_abi(uniswap_v3_factory_address)
        .then(_response => JSON.parse(_response?.result))
        .catch(_error => {
            console.log("Uniswap v3 Factory ABI Error: ", _error)
        })
    const uniswap_v3_factory = new ethers.Contract(uniswap_v3_factory_address, uniswap_v3_factory_abi, provider)

    const liquidity_pool_address = uniswap_v3_factory
        .getFunction("getPool")(usdc_address, weth_address, 3000)
        .then((_response) => {
            console.log("Response: ", _response)
            return _response
        })
        .catch((_error) => {
            console.log("Error: ", _error)
        })
    console.log("Liquidity Pool Address: ", await liquidity_pool_address)
}
main()
