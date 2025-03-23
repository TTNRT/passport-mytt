export function parse(json) {
    if ('string' == typeof json) {
        json = JSON.parse(json)
    }
  
    var profile = {}
    profile.id = String(json.id)
    profile.username = json.username
    profile.email = json.email
    profile.fullname = json.fullname
    profile.avatar = json.avatar
    return profile
}