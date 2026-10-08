let current={route:'dashboard'};
export function navigate(route){location.hash='#/'+route}
export function routeFromHash(){return (location.hash.replace(/^#\//,'')||'dashboard').split('/')[0]}
export function startRouter(render){const run=()=>{current={route:routeFromHash()};render(current)};window.addEventListener('hashchange',run);run()}
export function getRoute(){return current.route}