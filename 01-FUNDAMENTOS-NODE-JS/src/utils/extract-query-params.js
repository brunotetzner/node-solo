export function extractQueryParams(query) {
  const params = query.substr(1).split('&').reduce((queryParams, param) => {
    const [key, value] = param.split('=')
    queryParams[key] = value

    return queryParams
  }, {})
  return params
}