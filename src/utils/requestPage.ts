/**
 * The async function `requestURL` to fetch the metadata of website from the local server.
 * When the request fails, it will infer the name and icon and return.
 * @param url
 * @returns {Promise<any>}
 */
async function requestURL(url: string): Promise<{url: string, ico: string, name: string}> {
    const urlObj = (()=>{
        try {
            return new URL(url);
        } catch (e) {
            throw e;
        }
    })();

    const response = await (await fetch(
        `http://localhost:3000/fetch-meta?url=${encodeURIComponent(url)}`
    )).json();

    if (response.error) return {
        "url": url,
        "ico": urlObj.origin + "/favicon.ico",
        "name": urlObj.hostname.split(".").slice(0, -1).join(".")
    }

    return {"url": url, "ico": response.icon, "name": response.title};
}
// await requestURL("https://www.doubao.com/");

export default requestURL;
//document.querySelector("link[rel$='icon']")["href"]