export default async function getPosts(sinceId, limit) {
  const paramsArr = [
    ["since_id", sinceId],
    ["limit", limit],
  ].filter((param) => !!param[1]);
  const urlParamsObject = new URLSearchParams(paramsArr);

  const urlParams =
    paramsArr.length > 0 ? "?" + urlParamsObject.toString() : "";

  const queryUrl = "http://localhost:3000/api/posts" + urlParams;
  const queryResponse = await fetch(queryUrl);

  if (queryResponse.ok) {
    return await queryResponse.json();
  } else {
    const msg = await queryResponse.text();
    throw new Error(msg);
  }
}
