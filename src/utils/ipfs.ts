export async function TryFetchIpfsFile(contentHash: string) {

    try {
        // commenting it out as environment variable is not yet supported in hosting service
        // const response = await fetch(`${process.env.IPFS_DEDICATED_GATEWAY}/ipfs/${contentHash}`)
        const response = await fetch(`https://apecity.infura-ipfs.io/ipfs/${contentHash}`)
        if (response.ok) {
            return await response.json()
        }
    }
    catch (e) {
        console.error('Unable to fetch from Cloudflare')
    }

    try {
        const response = await fetch(`https://cloudflare-ipfs.com/ipfs/${contentHash}`)
        if (response.ok) {
            return await response.json()
        }
    }
    catch (e) {
        console.error('Unable to fetch from Cloudflare')
    }

    try {
        const response = await fetch(`https://ipfs.io/ipfs/${contentHash}`)
        if (response.ok) {
            return await response.json()
        }
    }
    catch (e) {
        console.error('Unable to fetch from IPFS')
    }

    return null
}