async function requestURL(url) {
    return await fetch(`https://api.microlink.io?url=${url}`)
        .then(e => e.json())
        .then(e => {
            const name = e.data.title;
            const icon = e.data.logo.url;
            return  {url: url, name: name, ico: icon};
        })
        .catch(e => console.log(e));
}

export default requestURL;
//document.querySelector("link[rel$='icon']")["href"]