var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key2, value) => key2 in obj ? __defProp(obj, key2, { enumerable: true, configurable: true, writable: true, value }) : obj[key2] = value;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __publicField = (obj, key2, value) => __defNormalProp(obj, typeof key2 !== "symbol" ? key2 + "" : key2, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);

// .svelte-kit/output/server/chunks/equality.js
function equals(value) {
  return value === this.v;
}
function safe_not_equal(a2, b) {
  return a2 != a2 ? b == b : a2 !== b || a2 !== null && typeof a2 === "object" || typeof a2 === "function";
}
function safe_equals(value) {
  return !safe_not_equal(value, this.v);
}
var init_equality = __esm({
  ".svelte-kit/output/server/chunks/equality.js"() {
  }
});

// .svelte-kit/output/server/chunks/index2.js
function run_all(arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i]();
  }
}
function subscribe_to_store(store, run, invalidate) {
  if (store == null) {
    run(void 0);
    if (invalidate) invalidate(void 0);
    return noop;
  }
  const unsub = store.subscribe(
    run,
    // @ts-expect-error
    invalidate
  );
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function lifecycle_outside_component(name2) {
  {
    throw new Error("lifecycle_outside_component");
  }
}
function is_void(name2) {
  return VOID_ELEMENT_NAMES.includes(name2) || name2.toLowerCase() === "!doctype";
}
function is_boolean_attribute(name2) {
  return DOM_BOOLEAN_ATTRIBUTES.includes(name2);
}
function is_passive_event(name2) {
  return PASSIVE_EVENTS.includes(name2);
}
function escape_html(value, is_attr) {
  const str = String(value ?? "");
  const pattern2 = is_attr ? ATTR_REGEX : CONTENT_REGEX;
  pattern2.lastIndex = 0;
  let escaped2 = "";
  let last2 = 0;
  while (pattern2.test(str)) {
    const i = pattern2.lastIndex - 1;
    const ch = str[i];
    escaped2 += str.substring(last2, i) + (ch === "&" ? "&amp;" : ch === '"' ? "&quot;" : "&lt;");
    last2 = i + 1;
  }
  return escaped2 + str.substring(last2);
}
function getContext(key2) {
  const context_map = get_or_init_context_map();
  const result = (
    /** @type {T} */
    context_map.get(key2)
  );
  return result;
}
function setContext(key2, context) {
  get_or_init_context_map().set(key2, context);
  return context;
}
function get_or_init_context_map(name2) {
  if (current_component === null) {
    lifecycle_outside_component();
  }
  return current_component.c ?? (current_component.c = new Map(get_parent_context(current_component) || void 0));
}
function push(fn) {
  current_component = { p: current_component, c: null, d: null };
}
function pop() {
  var component6 = (
    /** @type {Component} */
    current_component
  );
  var ondestroy = component6.d;
  if (ondestroy) {
    on_destroy.push(...ondestroy);
  }
  current_component = component6.p;
}
function get_parent_context(component_context) {
  let parent = component_context.p;
  while (parent !== null) {
    const context_map = parent.c;
    if (context_map !== null) {
      return context_map;
    }
    parent = parent.p;
  }
  return null;
}
function element(payload, tag, attributes_fn = noop, children_fn = noop) {
  payload.out += "<!---->";
  if (tag) {
    payload.out += `<${tag} `;
    attributes_fn();
    payload.out += `>`;
    if (!is_void(tag)) {
      children_fn();
      if (!RAW_TEXT_ELEMENTS.includes(tag)) {
        payload.out += EMPTY_COMMENT;
      }
      payload.out += `</${tag}>`;
    }
  }
  payload.out += "<!---->";
}
function render(component6, options2 = {}) {
  const payload = { out: "", css: /* @__PURE__ */ new Set(), head: { title: "", out: "" } };
  const prev_on_destroy = on_destroy;
  on_destroy = [];
  payload.out += BLOCK_OPEN;
  if (options2.context) {
    push();
    current_component.c = options2.context;
  }
  component6(payload, options2.props ?? {}, {}, {});
  if (options2.context) {
    pop();
  }
  payload.out += BLOCK_CLOSE;
  for (const cleanup of on_destroy) cleanup();
  on_destroy = prev_on_destroy;
  let head = payload.head.out + payload.head.title;
  for (const { hash: hash2, code } of payload.css) {
    head += `<style id="${hash2}">${code}</style>`;
  }
  return {
    head,
    html: payload.out,
    body: payload.out
  };
}
function attr(name2, value, is_boolean = false) {
  if (value == null || !value && is_boolean || value === "" && name2 === "class") return "";
  const assignment = is_boolean ? "" : `="${escape_html(value, true)}"`;
  return ` ${name2}${assignment}`;
}
function spread_attributes(attrs, classes, styles, flags = 0) {
  if (classes) {
    const classlist = attrs.class ? [attrs.class] : [];
    for (const key2 in classes) {
      if (classes[key2]) {
        classlist.push(key2);
      }
    }
    attrs.class = classlist.join(" ");
  }
  let attr_str = "";
  let name2;
  const is_html = (flags & ELEMENT_IS_NAMESPACED) === 0;
  const lowercase = (flags & ELEMENT_PRESERVE_ATTRIBUTE_CASE) === 0;
  for (name2 in attrs) {
    if (typeof attrs[name2] === "function") continue;
    if (name2[0] === "$" && name2[1] === "$") continue;
    if (INVALID_ATTR_NAME_CHAR_REGEX.test(name2)) continue;
    if (lowercase) {
      name2 = name2.toLowerCase();
    }
    attr_str += attr(name2, attrs[name2], is_html && is_boolean_attribute(name2));
  }
  return attr_str;
}
function spread_props(props) {
  const merged_props = {};
  let key2;
  for (let i = 0; i < props.length; i++) {
    const obj = props[i];
    for (key2 in obj) {
      merged_props[key2] = obj[key2];
    }
  }
  return merged_props;
}
function stringify(value) {
  return typeof value === "string" ? value : value == null ? "" : value + "";
}
function style_object_to_string(style_object) {
  return Object.keys(style_object).filter(
    /** @param {any} key */
    (key2) => style_object[key2] != null && style_object[key2] !== ""
  ).map(
    /** @param {any} key */
    (key2) => `${key2}: ${escape_html(style_object[key2], true)};`
  ).join(" ");
}
function add_styles(style_object) {
  const styles = style_object_to_string(style_object);
  return styles ? ` style="${styles}"` : "";
}
function store_get(store_values, store_name, store) {
  if (store_name in store_values && store_values[store_name][0] === store) {
    return store_values[store_name][2];
  }
  store_values[store_name]?.[1]();
  store_values[store_name] = [store, null, void 0];
  const unsub = subscribe_to_store(
    store,
    /** @param {any} v */
    (v) => store_values[store_name][2] = v
  );
  store_values[store_name][1] = unsub;
  return store_values[store_name][2];
}
function unsubscribe_stores(store_values) {
  for (const store_name in store_values) {
    store_values[store_name][1]();
  }
}
function value_or_fallback(value, fallback) {
  return value === void 0 ? fallback() : value;
}
function slot(payload, slot_fn, slot_props, fallback_fn) {
  if (slot_fn !== void 0) {
    slot_fn(payload, slot_props);
  }
}
function rest_props(props, rest) {
  const rest_props2 = {};
  let key2;
  for (key2 in props) {
    if (!rest.includes(key2)) {
      rest_props2[key2] = props[key2];
    }
  }
  return rest_props2;
}
function sanitize_props(props) {
  const { children, $$slots, ...sanitized } = props;
  return sanitized;
}
function bind_props(props_parent, props_now) {
  for (const key2 in props_now) {
    const initial_value = props_parent[key2];
    const value = props_now[key2];
    if (initial_value === void 0 && value !== void 0 && Object.getOwnPropertyDescriptor(props_parent, key2)?.set) {
      props_parent[key2] = value;
    }
  }
}
function ensure_array_like(array_like_or_iterator) {
  return array_like_or_iterator?.length !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
}
function once(get_value) {
  let value = (
    /** @type {V} */
    UNINITIALIZED
  );
  return () => {
    if (value === UNINITIALIZED) {
      value = get_value();
    }
    return value;
  };
}
var is_array, array_from, define_property, noop, HYDRATION_START, HYDRATION_END, HYDRATION_ERROR, ELEMENT_IS_NAMESPACED, ELEMENT_PRESERVE_ATTRIBUTE_CASE, UNINITIALIZED, VOID_ELEMENT_NAMES, DOM_BOOLEAN_ATTRIBUTES, PASSIVE_EVENTS, ATTR_REGEX, CONTENT_REGEX, current_component, BLOCK_OPEN, BLOCK_CLOSE, EMPTY_COMMENT, INVALID_ATTR_NAME_CHAR_REGEX, RAW_TEXT_ELEMENTS, on_destroy;
var init_index2 = __esm({
  ".svelte-kit/output/server/chunks/index2.js"() {
    is_array = Array.isArray;
    array_from = Array.from;
    define_property = Object.defineProperty;
    noop = () => {
    };
    HYDRATION_START = "[";
    HYDRATION_END = "]";
    HYDRATION_ERROR = {};
    ELEMENT_IS_NAMESPACED = 1;
    ELEMENT_PRESERVE_ATTRIBUTE_CASE = 1 << 1;
    UNINITIALIZED = Symbol();
    VOID_ELEMENT_NAMES = [
      "area",
      "base",
      "br",
      "col",
      "command",
      "embed",
      "hr",
      "img",
      "input",
      "keygen",
      "link",
      "meta",
      "param",
      "source",
      "track",
      "wbr"
    ];
    DOM_BOOLEAN_ATTRIBUTES = [
      "allowfullscreen",
      "async",
      "autofocus",
      "autoplay",
      "checked",
      "controls",
      "default",
      "disabled",
      "formnovalidate",
      "hidden",
      "indeterminate",
      "ismap",
      "loop",
      "multiple",
      "muted",
      "nomodule",
      "novalidate",
      "open",
      "playsinline",
      "readonly",
      "required",
      "reversed",
      "seamless",
      "selected",
      "webkitdirectory"
    ];
    PASSIVE_EVENTS = ["wheel", "touchstart", "touchmove", "touchend", "touchcancel"];
    ATTR_REGEX = /[&"<]/g;
    CONTENT_REGEX = /[&<]/g;
    current_component = null;
    BLOCK_OPEN = `<!--${HYDRATION_START}-->`;
    BLOCK_CLOSE = `<!--${HYDRATION_END}-->`;
    EMPTY_COMMENT = `<!---->`;
    INVALID_ATTR_NAME_CHAR_REGEX = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
    RAW_TEXT_ELEMENTS = ["textarea", "script", "style", "title"];
    on_destroy = [];
  }
});

// .svelte-kit/output/server/chunks/exports.js
function resolve(base2, path) {
  if (path[0] === "/" && path[1] === "/") return path;
  let url = new URL(base2, internal);
  url = new URL(path, url);
  return url.protocol === internal.protocol ? url.pathname + url.search + url.hash : url.href;
}
function normalize_path(path, trailing_slash) {
  if (path === "/" || trailing_slash === "ignore") return path;
  if (trailing_slash === "never") {
    return path.endsWith("/") ? path.slice(0, -1) : path;
  } else if (trailing_slash === "always" && !path.endsWith("/")) {
    return path + "/";
  }
  return path;
}
function decode_pathname(pathname) {
  return pathname.split("%25").map(decodeURI).join("%25");
}
function decode_params(params) {
  for (const key2 in params) {
    params[key2] = decodeURIComponent(params[key2]);
  }
  return params;
}
function make_trackable(url, callback, search_params_callback) {
  const tracked = new URL(url);
  Object.defineProperty(tracked, "searchParams", {
    value: new Proxy(tracked.searchParams, {
      get(obj, key2) {
        if (key2 === "get" || key2 === "getAll" || key2 === "has") {
          return (param) => {
            search_params_callback(param);
            return obj[key2](param);
          };
        }
        callback();
        const value = Reflect.get(obj, key2);
        return typeof value === "function" ? value.bind(obj) : value;
      }
    }),
    enumerable: true,
    configurable: true
  });
  for (const property of tracked_url_properties) {
    Object.defineProperty(tracked, property, {
      get() {
        callback();
        return url[property];
      },
      enumerable: true,
      configurable: true
    });
  }
  {
    tracked[Symbol.for("nodejs.util.inspect.custom")] = (depth, opts, inspect) => {
      return inspect(url, opts);
    };
  }
  {
    disable_hash(tracked);
  }
  return tracked;
}
function disable_hash(url) {
  allow_nodejs_console_log(url);
  Object.defineProperty(url, "hash", {
    get() {
      throw new Error(
        "Cannot access event.url.hash. Consider using `$page.url.hash` inside a component instead"
      );
    }
  });
}
function disable_search(url) {
  allow_nodejs_console_log(url);
  for (const property of ["search", "searchParams"]) {
    Object.defineProperty(url, property, {
      get() {
        throw new Error(`Cannot access url.${property} on a page with prerendering enabled`);
      }
    });
  }
}
function allow_nodejs_console_log(url) {
  {
    url[Symbol.for("nodejs.util.inspect.custom")] = (depth, opts, inspect) => {
      return inspect(new URL(url), opts);
    };
  }
}
function has_data_suffix(pathname) {
  return pathname.endsWith(DATA_SUFFIX) || pathname.endsWith(HTML_DATA_SUFFIX);
}
function add_data_suffix(pathname) {
  if (pathname.endsWith(".html")) return pathname.replace(/\.html$/, HTML_DATA_SUFFIX);
  return pathname.replace(/\/$/, "") + DATA_SUFFIX;
}
function strip_data_suffix(pathname) {
  if (pathname.endsWith(HTML_DATA_SUFFIX)) {
    return pathname.slice(0, -HTML_DATA_SUFFIX.length) + ".html";
  }
  return pathname.slice(0, -DATA_SUFFIX.length);
}
function validator(expected) {
  function validate(module, file) {
    if (!module) return;
    for (const key2 in module) {
      if (key2[0] === "_" || expected.has(key2)) continue;
      const values = [...expected.values()];
      const hint = hint_for_supported_files(key2, file?.slice(file.lastIndexOf("."))) ?? `valid exports are ${values.join(", ")}, or anything with a '_' prefix`;
      throw new Error(`Invalid export '${key2}'${file ? ` in ${file}` : ""} (${hint})`);
    }
  }
  return validate;
}
function hint_for_supported_files(key2, ext = ".js") {
  const supported_files = [];
  if (valid_layout_exports.has(key2)) {
    supported_files.push(`+layout${ext}`);
  }
  if (valid_page_exports.has(key2)) {
    supported_files.push(`+page${ext}`);
  }
  if (valid_layout_server_exports.has(key2)) {
    supported_files.push(`+layout.server${ext}`);
  }
  if (valid_page_server_exports.has(key2)) {
    supported_files.push(`+page.server${ext}`);
  }
  if (valid_server_exports.has(key2)) {
    supported_files.push(`+server${ext}`);
  }
  if (supported_files.length > 0) {
    return `'${key2}' is a valid export in ${supported_files.slice(0, -1).join(", ")}${supported_files.length > 1 ? " or " : ""}${supported_files.at(-1)}`;
  }
}
var internal, tracked_url_properties, DATA_SUFFIX, HTML_DATA_SUFFIX, valid_layout_exports, valid_page_exports, valid_layout_server_exports, valid_page_server_exports, valid_server_exports, validate_layout_exports, validate_page_exports, validate_layout_server_exports, validate_page_server_exports, validate_server_exports;
var init_exports = __esm({
  ".svelte-kit/output/server/chunks/exports.js"() {
    internal = new URL("sveltekit-internal://");
    tracked_url_properties = /** @type {const} */
    [
      "href",
      "pathname",
      "search",
      "toString",
      "toJSON"
    ];
    DATA_SUFFIX = "/__data.json";
    HTML_DATA_SUFFIX = ".html__data.json";
    valid_layout_exports = /* @__PURE__ */ new Set([
      "load",
      "prerender",
      "csr",
      "ssr",
      "trailingSlash",
      "config"
    ]);
    valid_page_exports = /* @__PURE__ */ new Set([...valid_layout_exports, "entries"]);
    valid_layout_server_exports = /* @__PURE__ */ new Set([...valid_layout_exports]);
    valid_page_server_exports = /* @__PURE__ */ new Set([...valid_layout_server_exports, "actions", "entries"]);
    valid_server_exports = /* @__PURE__ */ new Set([
      "GET",
      "POST",
      "PATCH",
      "PUT",
      "DELETE",
      "OPTIONS",
      "HEAD",
      "fallback",
      "prerender",
      "trailingSlash",
      "config",
      "entries"
    ]);
    validate_layout_exports = validator(valid_layout_exports);
    validate_page_exports = validator(valid_page_exports);
    validate_layout_server_exports = validator(valid_layout_server_exports);
    validate_page_server_exports = validator(valid_page_server_exports);
    validate_server_exports = validator(valid_server_exports);
  }
});

// .svelte-kit/output/server/chunks/index.js
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
function writable(value, start = noop) {
  let stop = null;
  const subscribers = /* @__PURE__ */ new Set();
  function set2(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set2(fn(
      /** @type {T} */
      value
    ));
  }
  function subscribe(run, invalidate = noop) {
    const subscriber = [run, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set2, update) || noop;
    }
    run(
      /** @type {T} */
      value
    );
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0 && stop) {
        stop();
        stop = null;
      }
    };
  }
  return { set: set2, update, subscribe };
}
function derived(stores, fn, initial_value) {
  const single = !Array.isArray(stores);
  const stores_array = single ? [stores] : stores;
  if (!stores_array.every(Boolean)) {
    throw new Error("derived() expects stores as input, got a falsy value");
  }
  const auto = fn.length < 2;
  return readable(initial_value, (set2, update) => {
    let started = false;
    const values = [];
    let pending = 0;
    let cleanup = noop;
    const sync = () => {
      if (pending) {
        return;
      }
      cleanup();
      const result = fn(single ? values[0] : values, set2, update);
      if (auto) {
        set2(result);
      } else {
        cleanup = typeof result === "function" ? result : noop;
      }
    };
    const unsubscribers = stores_array.map(
      (store, i) => subscribe_to_store(
        store,
        (value) => {
          values[i] = value;
          pending &= ~(1 << i);
          if (started) {
            sync();
          }
        },
        () => {
          pending |= 1 << i;
        }
      )
    );
    started = true;
    sync();
    return function stop() {
      run_all(unsubscribers);
      cleanup();
      started = false;
    };
  });
}
function readonly(store) {
  return {
    // @ts-expect-error TODO i suspect the bind is unnecessary
    subscribe: store.subscribe.bind(store)
  };
}
function get2(store) {
  let value;
  subscribe_to_store(store, (_) => value = _)();
  return value;
}
var subscriber_queue;
var init_chunks = __esm({
  ".svelte-kit/output/server/chunks/index.js"() {
    init_index2();
    init_equality();
    subscriber_queue = [];
  }
});

// .svelte-kit/output/server/chunks/client.js
function get3(key2, parse3 = JSON.parse) {
  try {
    return parse3(sessionStorage[key2]);
  } catch {
  }
}
var SNAPSHOT_KEY, SCROLL_KEY;
var init_client = __esm({
  ".svelte-kit/output/server/chunks/client.js"() {
    init_exports();
    SNAPSHOT_KEY = "sveltekit:snapshot";
    SCROLL_KEY = "sveltekit:scroll";
    get3(SCROLL_KEY) ?? {};
    get3(SNAPSHOT_KEY) ?? {};
  }
});

// .svelte-kit/output/server/chunks/index3.js
var showMenu;
var init_index3 = __esm({
  ".svelte-kit/output/server/chunks/index3.js"() {
    init_chunks();
    init_client();
    showMenu = writable(true);
  }
});

// .svelte-kit/output/server/entries/pages/_layout.svelte.js
var layout_svelte_exports = {};
__export(layout_svelte_exports, {
  default: () => _layout
});
function isFunction(value) {
  return typeof value === "function";
}
function extract(value, defaultValue) {
  if (isFunction(value)) {
    const getter = value;
    return getter() ?? defaultValue ?? getter();
  }
  return value ?? defaultValue ?? value;
}
function NavBar($$payload) {
  var $$store_subs;
  const screen = new MediaQuery("(min-width: 640px)");
  if (screen.matches) {
    $$payload.out += "<!--[-->";
    if (store_get($$store_subs ?? ($$store_subs = {}), "$showMenu", showMenu)) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<nav class="fixed left-[50%] top-3 z-[1] w-[65%] translate-x-[-50%] rounded-xl border-2 border-teal-500 bg-teal-100/95 p-2 svelte-h64d8q"><ul class="flex justify-around font-[CG] text-xl font-medium text-teal-950"><li><a href="/" class="flex items-center justify-center gap-x-2"><svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-[0.85px] shrink-0"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>Home</a></li> <li><a href="/search" class="flex items-center justify-center gap-x-2"><svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-[0.85px] shrink-0"><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"></path><path d="m7.5 4.27 9 5.15"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><line x1="12" x2="12" y1="22" y2="12"></line><circle cx="18.5" cy="15.5" r="2.5"></circle><path d="M20.27 17.27 22 19"></path></svg>Explore</a></li> <li><a href="/profile" class="flex items-center justify-center gap-x-2"><svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-[0.85px] shrink-0"><path d="M18 20a6 6 0 0 0-12 0"></path><circle cx="12" cy="10" r="4"></circle><circle cx="12" cy="12" r="10"></circle></svg>Profile</a></li></ul></nav>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]-->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<nav class="fixed z-[1] bottom-0 left-[50%] w-full translate-x-[-50%] border-t-2 border-t-teal-500 bg-teal-100 p-[0.095rem] svelte-h64d8q"><ul class="flex items-center justify-around font-[CG] text-lg font-medium text-teal-950"><li><a href="/" class="flex flex-col items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>Home</a></li> <li><a href="/search" class="flex flex-col items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"></path><path d="m7.5 4.27 9 5.15"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><line x1="12" x2="12" y1="22" y2="12"></line><circle cx="18.5" cy="15.5" r="2.5"></circle><path d="M20.27 17.27 22 19"></path></svg>Explore</a></li> <li><a href="/profile" class="flex flex-col items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M18 20a6 6 0 0 0-12 0"></path><circle cx="12" cy="10" r="4"></circle><circle cx="12" cy="12" r="10"></circle></svg>Profile</a></li></ul></nav>`;
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
}
function _layout($$payload, $$props) {
  push();
  let { children } = $$props;
  NavBar($$payload);
  $$payload.out += `<!----> `;
  children($$payload);
  $$payload.out += `<!---->`;
  pop();
}
var _propQuery, _query, _mediaQueryList, _effectRegistered, _matches, MediaQuery;
var init_layout_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/_layout.svelte.js"() {
    init_index2();
    init_index3();
    init_client();
    MediaQuery = class {
      constructor(query) {
        __privateAdd(this, _propQuery);
        __privateAdd(this, _query, once(() => extract(__privateGet(this, _propQuery))));
        __privateAdd(this, _mediaQueryList, once(() => window.matchMedia(__privateGet(this, _query).call(this))));
        __privateAdd(this, _effectRegistered, false);
        __privateAdd(this, _matches);
        __privateSet(this, _propQuery, query);
      }
      get matches() {
        return __privateGet(this, _matches);
      }
    };
    _propQuery = new WeakMap();
    _query = new WeakMap();
    _mediaQueryList = new WeakMap();
    _effectRegistered = new WeakMap();
    _matches = new WeakMap();
  }
});

// .svelte-kit/output/server/nodes/0.js
var __exports = {};
__export(__exports, {
  component: () => component,
  fonts: () => fonts,
  imports: () => imports,
  index: () => index,
  stylesheets: () => stylesheets
});
var index, component_cache, component, imports, stylesheets, fonts;
var init__ = __esm({
  ".svelte-kit/output/server/nodes/0.js"() {
    index = 0;
    component = async () => component_cache ?? (component_cache = (await Promise.resolve().then(() => (init_layout_svelte(), layout_svelte_exports))).default);
    imports = ["_app/immutable/nodes/0.CBorhE66.js", "_app/immutable/chunks/disclose-version.BogR3-rD.js", "_app/immutable/chunks/index-client.C_P2apAl.js", "_app/immutable/chunks/if.Bf3PrYk7.js", "_app/immutable/chunks/index._JopWsWO.js", "_app/immutable/chunks/render.B7uRD5bS.js", "_app/immutable/chunks/store.N7t0lmzn.js", "_app/immutable/chunks/entry.C7CvdWvJ.js", "_app/immutable/chunks/3.BlDwM_1K.js", "_app/immutable/chunks/index.CjbkOuJp.js"];
    stylesheets = ["_app/immutable/assets/0.xHrMGI8c.css"];
    fonts = ["_app/immutable/assets/Ranade-Variable.a8w2nmG0.woff2", "_app/immutable/assets/Ranade-Variable.BusvjXns.woff", "_app/immutable/assets/Ranade-Variable.BlTBvjyt.ttf", "_app/immutable/assets/GeneralSans-Variable.p1VyP7gg.woff2", "_app/immutable/assets/GeneralSans-Variable.DAqniUaj.woff", "_app/immutable/assets/GeneralSans-Variable.D4t1btYN.ttf", "_app/immutable/assets/ClashGrotesk-Variable.BS-lg9W7.woff2", "_app/immutable/assets/ClashGrotesk-Variable.lreXlFCG.woff", "_app/immutable/assets/ClashGrotesk-Variable.Cp-iDUFA.ttf", "_app/immutable/assets/Expose-Variable.DOiM6JnU.woff2", "_app/immutable/assets/Expose-Variable.BrRoCReo.woff", "_app/immutable/assets/Expose-Variable.BbWQLyIk.ttf", "_app/immutable/assets/Satoshi-Variable.CFg-z2ne.woff2", "_app/immutable/assets/Satoshi-Variable.B5cVmYQo.woff", "_app/immutable/assets/Satoshi-Variable.ChAXbpFa.ttf", "_app/immutable/assets/abel-regular-webfont.PhOfDRhI.woff2", "_app/immutable/assets/abel-regular-webfont.CKipWEl7.woff"];
  }
});

// .svelte-kit/output/server/chunks/stores.js
var getStores, page;
var init_stores = __esm({
  ".svelte-kit/output/server/chunks/stores.js"() {
    init_index2();
    init_client();
    getStores = () => {
      const stores = getContext("__svelte__");
      return {
        /** @type {typeof page} */
        page: {
          subscribe: stores.page.subscribe
        },
        /** @type {typeof navigating} */
        navigating: {
          subscribe: stores.navigating.subscribe
        },
        /** @type {typeof updated} */
        updated: stores.updated
      };
    };
    page = {
      subscribe(fn) {
        const store = getStores().page;
        return store.subscribe(fn);
      }
    };
  }
});

// .svelte-kit/output/server/entries/fallbacks/error.svelte.js
var error_svelte_exports = {};
__export(error_svelte_exports, {
  default: () => Error2
});
function Error2($$payload, $$props) {
  push();
  var $$store_subs;
  $$payload.out += `<h1>${escape_html(store_get($$store_subs ?? ($$store_subs = {}), "$page", page).status)}</h1> <p>${escape_html(store_get($$store_subs ?? ($$store_subs = {}), "$page", page).error?.message)}</p>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
var init_error_svelte = __esm({
  ".svelte-kit/output/server/entries/fallbacks/error.svelte.js"() {
    init_index2();
    init_stores();
  }
});

// .svelte-kit/output/server/nodes/1.js
var __exports2 = {};
__export(__exports2, {
  component: () => component2,
  fonts: () => fonts2,
  imports: () => imports2,
  index: () => index2,
  stylesheets: () => stylesheets2
});
var index2, component_cache2, component2, imports2, stylesheets2, fonts2;
var init__2 = __esm({
  ".svelte-kit/output/server/nodes/1.js"() {
    index2 = 1;
    component2 = async () => component_cache2 ?? (component_cache2 = (await Promise.resolve().then(() => (init_error_svelte(), error_svelte_exports))).default);
    imports2 = ["_app/immutable/nodes/1.w5CRfpLB.js", "_app/immutable/chunks/disclose-version.BogR3-rD.js", "_app/immutable/chunks/index-client.C_P2apAl.js", "_app/immutable/chunks/render.B7uRD5bS.js", "_app/immutable/chunks/lifecycle.ToRgGMcZ.js", "_app/immutable/chunks/store.N7t0lmzn.js", "_app/immutable/chunks/entry.C7CvdWvJ.js", "_app/immutable/chunks/stores.CL5OZR4V.js"];
    stylesheets2 = [];
    fonts2 = [];
  }
});

// .svelte-kit/output/server/chunks/chevron-down.js
function default_slot($$props) {
  var children = $$props.$$slots?.default;
  if (children === true) {
    return $$props.children;
  } else {
    return children;
  }
}
function onDestroy(fn) {
  var context = (
    /** @type {Component} */
    current_component
  );
  (context.d ?? (context.d = [])).push(fn);
}
async function tick() {
}
function find(iter, tar, key2) {
  for (key2 of iter.keys()) {
    if (dequal(key2, tar)) return key2;
  }
}
function dequal(foo, bar) {
  var ctor, len, tmp;
  if (foo === bar) return true;
  if (foo && bar && (ctor = foo.constructor) === bar.constructor) {
    if (ctor === Date) return foo.getTime() === bar.getTime();
    if (ctor === RegExp) return foo.toString() === bar.toString();
    if (ctor === Array) {
      if ((len = foo.length) === bar.length) {
        while (len-- && dequal(foo[len], bar[len])) ;
      }
      return len === -1;
    }
    if (ctor === Set) {
      if (foo.size !== bar.size) {
        return false;
      }
      for (len of foo) {
        tmp = len;
        if (tmp && typeof tmp === "object") {
          tmp = find(bar, tmp);
          if (!tmp) return false;
        }
        if (!bar.has(tmp)) return false;
      }
      return true;
    }
    if (ctor === Map) {
      if (foo.size !== bar.size) {
        return false;
      }
      for (len of foo) {
        tmp = len[0];
        if (tmp && typeof tmp === "object") {
          tmp = find(bar, tmp);
          if (!tmp) return false;
        }
        if (!dequal(len[1], bar.get(tmp))) {
          return false;
        }
      }
      return true;
    }
    if (ctor === ArrayBuffer) {
      foo = new Uint8Array(foo);
      bar = new Uint8Array(bar);
    } else if (ctor === DataView) {
      if ((len = foo.byteLength) === bar.byteLength) {
        while (len-- && foo.getInt8(len) === bar.getInt8(len)) ;
      }
      return len === -1;
    }
    if (ArrayBuffer.isView(foo)) {
      if ((len = foo.byteLength) === bar.byteLength) {
        while (len-- && foo[len] === bar[len]) ;
      }
      return len === -1;
    }
    if (!ctor || typeof foo === "object") {
      len = 0;
      for (ctor in foo) {
        if (has.call(foo, ctor) && ++len && !has.call(bar, ctor)) return false;
        if (!(ctor in bar) || !dequal(foo[ctor], bar[ctor])) return false;
      }
      return Object.keys(bar).length === len;
    }
  }
  return foo !== foo && bar !== bar;
}
function back(array2, index7, increment, loop = true) {
  const previousIndex = index7 - increment;
  if (previousIndex <= 0) {
    return loop ? array2[array2.length - 1] : array2[0];
  }
  return array2[previousIndex];
}
function forward(array2, index7, increment, loop = true) {
  const nextIndex = index7 + increment;
  if (nextIndex > array2.length - 1) {
    return loop ? array2[0] : array2[array2.length - 1];
  }
  return array2[nextIndex];
}
function next(array2, index7, loop = true) {
  if (index7 === array2.length - 1) {
    return loop ? array2[0] : array2[index7];
  }
  return array2[index7 + 1];
}
function prev(array2, currentIndex, loop = true) {
  if (currentIndex <= 0) {
    return loop ? array2[array2.length - 1] : array2[0];
  }
  return array2[currentIndex - 1];
}
function last(array2) {
  return array2[array2.length - 1];
}
function wrapArray(array2, startIndex) {
  return array2.map((_, index7) => array2[(startIndex + index7) % array2.length]);
}
function toggle(item, array2, compare = dequal) {
  const itemIdx = array2.findIndex((innerItem) => compare(innerItem, item));
  if (itemIdx !== -1) {
    array2.splice(itemIdx, 1);
  } else {
    array2.push(item);
  }
  return array2;
}
function styleToString(style) {
  return Object.keys(style).reduce((str, key2) => {
    if (style[key2] === void 0)
      return str;
    return str + `${key2}:${style[key2]};`;
  }, "");
}
function disabledAttr(disabled) {
  return disabled ? true : void 0;
}
function omit(obj, ...keys) {
  const result = {};
  for (const key2 of Object.keys(obj)) {
    if (!keys.includes(key2)) {
      result[key2] = obj[key2];
    }
  }
  return result;
}
function stripValues(inputObject, toStrip, recursive) {
  return Object.fromEntries(Object.entries(inputObject).filter(([_, value]) => !dequal(value, toStrip)));
}
function removeUndefined(obj) {
  const result = {};
  for (const key2 in obj) {
    const value = obj[key2];
    if (value !== void 0) {
      result[key2] = value;
    }
  }
  return result;
}
function lightable(value) {
  function subscribe(run) {
    run(value);
    return () => {
    };
  }
  return { subscribe };
}
function getElementByMeltId(id) {
  if (!isBrowser)
    return null;
  const el = document.querySelector(`[data-melt-id="${id}"]`);
  return isHTMLElement$1(el) ? el : null;
}
function makeElement(name2, args) {
  const { stores, action, returned } = args ?? {};
  const derivedStore = (() => {
    if (stores && returned) {
      return derived(stores, (values) => {
        const result = returned(values);
        if (isFunctionWithParams(result)) {
          const fn = (...args2) => {
            return hiddenAction(removeUndefined({
              ...result(...args2),
              [`data-melt-${name2}`]: "",
              action: action ?? noop2
            }));
          };
          fn.action = action ?? noop2;
          return fn;
        }
        return hiddenAction(removeUndefined({
          ...result,
          [`data-melt-${name2}`]: "",
          action: action ?? noop2
        }));
      });
    } else {
      const returnedFn = returned;
      const result = returnedFn?.();
      if (isFunctionWithParams(result)) {
        const resultFn = (...args2) => {
          return hiddenAction(removeUndefined({
            ...result(...args2),
            [`data-melt-${name2}`]: "",
            action: action ?? noop2
          }));
        };
        resultFn.action = action ?? noop2;
        return lightable(resultFn);
      }
      return lightable(hiddenAction(removeUndefined({
        ...result,
        [`data-melt-${name2}`]: "",
        action: action ?? noop2
      })));
    }
  })();
  const actionFn = action ?? (() => {
  });
  actionFn.subscribe = derivedStore.subscribe;
  return actionFn;
}
function createElHelpers(prefix2) {
  const name2 = (part) => part ? `${prefix2}-${part}` : prefix2;
  const attribute = (part) => `data-melt-${prefix2}${part ? `-${part}` : ""}`;
  const selector = (part) => `[data-melt-${prefix2}${part ? `-${part}` : ""}]`;
  const getEl = (part) => document.querySelector(selector(part));
  return {
    name: name2,
    attribute,
    selector,
    getEl
  };
}
function isElement$1(element2) {
  return element2 instanceof Element;
}
function isHTMLElement$1(element2) {
  return element2 instanceof HTMLElement;
}
function isHTMLInputElement(element2) {
  return element2 instanceof HTMLInputElement;
}
function isHTMLLabelElement(element2) {
  return element2 instanceof HTMLLabelElement;
}
function isHTMLButtonElement(element2) {
  return element2 instanceof HTMLButtonElement;
}
function isElementDisabled(element2) {
  const ariaDisabled = element2.getAttribute("aria-disabled");
  const disabled = element2.getAttribute("disabled");
  const dataDisabled = element2.hasAttribute("data-disabled");
  if (ariaDisabled === "true" || disabled !== null || dataDisabled) {
    return true;
  }
  return false;
}
function isContentEditable$1(element2) {
  if (!isHTMLElement$1(element2))
    return false;
  return element2.isContentEditable;
}
function isObject(value) {
  return value !== null && typeof value === "object";
}
function isReadable(value) {
  return isObject(value) && "subscribe" in value;
}
function executeCallbacks(...callbacks) {
  return (...args) => {
    for (const callback of callbacks) {
      if (typeof callback === "function") {
        callback(...args);
      }
    }
  };
}
function noop2() {
}
function addEventListener(target, event, handler2, options2) {
  const events = Array.isArray(event) ? event : [event];
  events.forEach((_event) => target.addEventListener(_event, handler2, options2));
  return () => {
    events.forEach((_event) => target.removeEventListener(_event, handler2, options2));
  };
}
function addMeltEventListener(target, event, handler2, options2) {
  const events = Array.isArray(event) ? event : [event];
  if (typeof handler2 === "function") {
    const handlerWithMelt = withMelt((_event) => handler2(_event));
    events.forEach((_event) => target.addEventListener(_event, handlerWithMelt, options2));
    return () => {
      events.forEach((_event) => target.removeEventListener(_event, handlerWithMelt, options2));
    };
  }
  return () => noop2();
}
function dispatchMeltEvent(originalEvent) {
  const node = originalEvent.currentTarget;
  if (!isHTMLElement$1(node))
    return null;
  const customMeltEvent = new CustomEvent(`m-${originalEvent.type}`, {
    detail: {
      originalEvent
    },
    cancelable: true
  });
  node.dispatchEvent(customMeltEvent);
  return customMeltEvent;
}
function withMelt(handler2) {
  return (event) => {
    const customEvent = dispatchMeltEvent(event);
    if (customEvent?.defaultPrevented)
      return;
    return handler2(event);
  };
}
function addHighlight(element2) {
  element2.setAttribute("data-highlighted", "");
}
function removeHighlight(element2) {
  element2.removeAttribute("data-highlighted");
}
function getOptions(el) {
  return Array.from(el.querySelectorAll('[role="option"]:not([data-disabled])')).filter((el2) => isHTMLElement$1(el2));
}
function withGet(store) {
  return {
    ...store,
    get: () => get2(store)
  };
}
function sleep(ms) {
  return new Promise((resolve2) => setTimeout(resolve2, ms));
}
function generateId() {
  return nanoid(10);
}
function generateIds(args) {
  return args.reduce((acc, curr) => {
    acc[curr] = generateId();
    return acc;
  }, {});
}
function debounce(fn, wait = 500) {
  let timeout;
  const debounced = (...args) => {
    clearTimeout(timeout);
    const later = () => fn(...args);
    timeout = setTimeout(later, wait);
  };
  debounced.destroy = () => clearTimeout(timeout);
  return debounced;
}
function getPlatform() {
  const agent = navigator.userAgentData;
  return agent?.platform ?? navigator.platform;
}
function assignStyle(el, style) {
  if (!el)
    return;
  const previousStyle = el.style.cssText;
  Object.assign(el.style, style);
  return () => {
    el.style.cssText = previousStyle;
  };
}
function setCSSProperty(el, property, value) {
  if (!el)
    return;
  const previousValue = el.style.getPropertyValue(property);
  el.style.setProperty(property, value);
  return () => {
    if (previousValue) {
      el.style.setProperty(property, previousValue);
    } else {
      el.style.removeProperty(property);
    }
  };
}
function getPaddingProperty(documentElement) {
  const documentLeft = documentElement.getBoundingClientRect().left;
  const scrollbarX = Math.round(documentLeft) + documentElement.scrollLeft;
  return scrollbarX ? "paddingLeft" : "paddingRight";
}
function removeScroll(_document) {
  const doc = document;
  const win = doc.defaultView ?? window;
  const { documentElement, body: body2 } = doc;
  const locked = body2.hasAttribute(LOCK_CLASSNAME);
  if (locked)
    return noop2;
  body2.setAttribute(LOCK_CLASSNAME, "");
  const scrollbarWidth = win.innerWidth - documentElement.clientWidth;
  const setScrollbarWidthProperty = () => setCSSProperty(documentElement, "--scrollbar-width", `${scrollbarWidth}px`);
  const paddingProperty = getPaddingProperty(documentElement);
  const scrollbarSidePadding = win.getComputedStyle(body2)[paddingProperty];
  const setStyle = () => assignStyle(body2, {
    overflow: "hidden",
    [paddingProperty]: `calc(${scrollbarSidePadding} + ${scrollbarWidth}px)`
  });
  const setIOSStyle = () => {
    const { scrollX, scrollY, visualViewport } = win;
    const offsetLeft = visualViewport?.offsetLeft ?? 0;
    const offsetTop = visualViewport?.offsetTop ?? 0;
    const restoreStyle = assignStyle(body2, {
      position: "fixed",
      overflow: "hidden",
      top: `${-(scrollY - Math.floor(offsetTop))}px`,
      left: `${-(scrollX - Math.floor(offsetLeft))}px`,
      right: "0",
      [paddingProperty]: `calc(${scrollbarSidePadding} + ${scrollbarWidth}px)`
    });
    return () => {
      restoreStyle?.();
      win.scrollTo(scrollX, scrollY);
    };
  };
  const cleanups = [setScrollbarWidthProperty(), isIos() ? setIOSStyle() : setStyle()];
  return () => {
    cleanups.forEach((fn) => fn?.());
    body2.removeAttribute(LOCK_CLASSNAME);
  };
}
function derivedVisible(obj) {
  const { open, forceVisible, activeTrigger } = obj;
  return derived([open, forceVisible, activeTrigger], ([$open, $forceVisible, $activeTrigger]) => ($open || $forceVisible) && $activeTrigger !== null);
}
function effect2(stores, fn, opts = {}) {
  const { skipFirstRun } = opts;
  let isFirstRun = true;
  let cb = void 0;
  const destroy = derived(stores, (stores2) => {
    cb?.();
    if (isFirstRun && skipFirstRun) {
      isFirstRun = false;
    } else {
      cb = fn(stores2);
    }
  }).subscribe(noop2);
  const unsub = () => {
    destroy();
    cb?.();
  };
  safeOnDestroy(unsub);
  return unsub;
}
function toWritableStores(properties) {
  const result = {};
  Object.keys(properties).forEach((key2) => {
    const propertyKey = key2;
    const value = properties[propertyKey];
    result[propertyKey] = withGet(writable(value));
  });
  return result;
}
function handleRovingFocus(nextElement) {
  if (!isBrowser)
    return;
  sleep(1).then(() => {
    const currentFocusedElement = document.activeElement;
    if (!isHTMLElement$1(currentFocusedElement) || currentFocusedElement === nextElement)
      return;
    currentFocusedElement.tabIndex = -1;
    if (nextElement) {
      nextElement.tabIndex = 0;
      nextElement.focus();
    }
  });
}
function createTypeaheadSearch(args = {}) {
  const withDefaults = { ...defaults$3, ...args };
  const typed = withGet(writable([]));
  const resetTyped = debounce(() => {
    typed.update(() => []);
  });
  const handleTypeaheadSearch = (key2, items) => {
    if (ignoredKeys.has(key2))
      return;
    const currentItem = withDefaults.getCurrentItem();
    const $typed = get2(typed);
    if (!Array.isArray($typed)) {
      return;
    }
    $typed.push(key2.toLowerCase());
    typed.set($typed);
    const candidateItems = items.filter((item) => {
      if (item.getAttribute("disabled") === "true" || item.getAttribute("aria-disabled") === "true" || item.hasAttribute("data-disabled")) {
        return false;
      }
      return true;
    });
    const isRepeated = $typed.length > 1 && $typed.every((char) => char === $typed[0]);
    const normalizeSearch = isRepeated ? $typed[0] : $typed.join("");
    const currentItemIndex = isHTMLElement$1(currentItem) ? candidateItems.indexOf(currentItem) : -1;
    let wrappedItems = wrapArray(candidateItems, Math.max(currentItemIndex, 0));
    const excludeCurrentItem = normalizeSearch.length === 1;
    if (excludeCurrentItem) {
      wrappedItems = wrappedItems.filter((v) => v !== currentItem);
    }
    const nextItem = wrappedItems.find((item) => item?.innerText && item.innerText.toLowerCase().startsWith(normalizeSearch.toLowerCase()));
    if (isHTMLElement$1(nextItem) && nextItem !== currentItem) {
      withDefaults.onMatch(nextItem);
    }
    resetTyped();
  };
  return {
    typed,
    resetTyped,
    handleTypeaheadSearch
  };
}
function getPortalParent(node) {
  let parent = node.parentElement;
  while (isHTMLElement$1(parent) && !parent.hasAttribute("data-portal")) {
    parent = parent.parentElement;
  }
  return parent || "body";
}
function getPortalDestination(node, portalProp) {
  if (portalProp !== void 0)
    return portalProp;
  const portalParent = getPortalParent(node);
  if (portalParent === "body")
    return document.body;
  return null;
}
function isOrContainsTarget(node, target) {
  return node === target || node.contains(target);
}
function getOwnerDocument(el) {
  return el?.ownerDocument ?? document;
}
function createClickOutsideIgnore(meltId) {
  return (e) => {
    const target = e.target;
    const triggerEl = getElementByMeltId(meltId);
    if (!triggerEl || !isElement$1(target))
      return false;
    const id = triggerEl.id;
    if (isHTMLLabelElement(target) && id === target.htmlFor) {
      return true;
    }
    if (target.closest(`label[for="${id}"]`)) {
      return true;
    }
    return false;
  };
}
function toReadableStores(properties) {
  const result = {};
  Object.keys(properties).forEach((key2) => {
    const propertyKey = key2;
    const value = properties[propertyKey];
    if (isReadable(value)) {
      result[propertyKey] = withGet(value);
    } else {
      result[propertyKey] = withGet(readable(value));
    }
  });
  return result;
}
function createHiddenInput(props) {
  const withDefaults = {
    ...defaults$2,
    ...removeUndefined(props)
  };
  const { name: elName } = createElHelpers(withDefaults.prefix);
  const { value, name: name2, disabled, required, type, checked } = toReadableStores(omit(withDefaults, "prefix"));
  const nameStore = name2;
  const actualChecked = withGet.derived([checked, type], ([$checked, $type]) => {
    if ($type === "checkbox") {
      return $checked === "indeterminate" ? false : $checked;
    }
    return void 0;
  });
  const hiddenInput = makeElement(elName("hidden-input"), {
    stores: [value, nameStore, disabled, required, type, actualChecked],
    returned: ([$value, $name, $disabled, $required, $type, $checked]) => {
      return {
        name: $name,
        value: $value?.toString(),
        "aria-hidden": "true",
        hidden: true,
        disabled: $disabled,
        required: $required,
        tabIndex: -1,
        type: $type,
        checked: $checked,
        style: styleToString({
          position: "absolute",
          opacity: 0,
          "pointer-events": "none",
          margin: 0,
          transform: "translateX(-100%)"
        })
      };
    },
    action: (node) => {
      const unsub = executeCallbacks(value.subscribe((newValue) => {
        if (type.get() === "checkbox") {
          return;
        }
        node.value = newValue;
        node.dispatchEvent(new Event("change", { bubbles: true }));
      }), actualChecked.subscribe(() => {
        if (type.get() !== "checkbox") {
          return;
        }
        node.dispatchEvent(new Event("change", { bubbles: true }));
      }));
      return {
        destroy: unsub
      };
    }
  });
  return hiddenInput;
}
function clamp(start, value, end) {
  return max(start, min(value, end));
}
function evaluate(value, param) {
  return typeof value === "function" ? value(param) : value;
}
function getSide(placement) {
  return placement.split("-")[0];
}
function getAlignment(placement) {
  return placement.split("-")[1];
}
function getOppositeAxis(axis) {
  return axis === "x" ? "y" : "x";
}
function getAxisLength(axis) {
  return axis === "y" ? "height" : "width";
}
function getSideAxis(placement) {
  return ["top", "bottom"].includes(getSide(placement)) ? "y" : "x";
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.replace(/start|end/g, (alignment) => oppositeAlignmentMap[alignment]);
}
function getSideList(side, isStart, rtl) {
  const lr = ["left", "right"];
  const rl = ["right", "left"];
  const tb = ["top", "bottom"];
  const bt = ["bottom", "top"];
  switch (side) {
    case "top":
    case "bottom":
      if (rtl) return isStart ? rl : lr;
      return isStart ? lr : rl;
    case "left":
    case "right":
      return isStart ? tb : bt;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === "start", rtl);
  if (alignment) {
    list = list.map((side) => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, (side) => oppositeSideMap[side]);
}
function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}
function getPaddingObject(padding) {
  return typeof padding !== "number" ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  const {
    x,
    y,
    width,
    height
  } = rect;
  return {
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    x,
    y
  };
}
function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = getSideAxis(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const alignLength = getAxisLength(alignmentAxis);
  const side = getSide(placement);
  const isVertical = sideAxis === "y";
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case "top":
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case "bottom":
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case "right":
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case "left":
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch (getAlignment(placement)) {
    case "start":
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case "end":
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}
async function detectOverflow(state, options2) {
  var _await$platform$isEle;
  if (options2 === void 0) {
    options2 = {};
  }
  const {
    x,
    y,
    platform: platform2,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = "clippingAncestors",
    rootBoundary = "viewport",
    elementContext = "floating",
    altBoundary = false,
    padding = 0
  } = evaluate(options2, state);
  const paddingObject = getPaddingObject(padding);
  const altContext = elementContext === "floating" ? "reference" : "floating";
  const element2 = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = rectToClientRect(await platform2.getClippingRect({
    element: ((_await$platform$isEle = await (platform2.isElement == null ? void 0 : platform2.isElement(element2))) != null ? _await$platform$isEle : true) ? element2 : element2.contextElement || await (platform2.getDocumentElement == null ? void 0 : platform2.getDocumentElement(elements.floating)),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === "floating" ? {
    x,
    y,
    width: rects.floating.width,
    height: rects.floating.height
  } : rects.reference;
  const offsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(elements.floating));
  const offsetScale = await (platform2.isElement == null ? void 0 : platform2.isElement(offsetParent)) ? await (platform2.getScale == null ? void 0 : platform2.getScale(offsetParent)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  };
  const elementClientRect = rectToClientRect(platform2.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements,
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}
async function convertValueToCoords(state, options2) {
  const {
    placement,
    platform: platform2,
    elements
  } = state;
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const isVertical = getSideAxis(placement) === "y";
  const mainAxisMulti = ["left", "top"].includes(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = evaluate(options2, state);
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === "number" ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: 0,
    crossAxis: 0,
    alignmentAxis: null,
    ...rawValue
  };
  if (alignment && typeof alignmentAxis === "number") {
    crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}
function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || "").toLowerCase();
  }
  return "#document";
}
function getWindow(node) {
  var _node$ownerDocument;
  return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
  return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
  if (typeof ShadowRoot === "undefined") {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element2) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle$1(element2);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !["inline", "contents"].includes(display);
}
function isTableElement(element2) {
  return ["table", "td", "th"].includes(getNodeName(element2));
}
function isTopLayer(element2) {
  return [":popover-open", ":modal"].some((selector) => {
    try {
      return element2.matches(selector);
    } catch (e) {
      return false;
    }
  });
}
function isContainingBlock(elementOrCss) {
  const webkit = isWebKit();
  const css = isElement(elementOrCss) ? getComputedStyle$1(elementOrCss) : elementOrCss;
  return css.transform !== "none" || css.perspective !== "none" || (css.containerType ? css.containerType !== "normal" : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== "none" : false) || !webkit && (css.filter ? css.filter !== "none" : false) || ["transform", "perspective", "filter"].some((value) => (css.willChange || "").includes(value)) || ["paint", "layout", "strict", "content"].some((value) => (css.contain || "").includes(value));
}
function getContainingBlock(element2) {
  let currentNode = getParentNode(element2);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else if (isTopLayer(currentNode)) {
      return null;
    }
    currentNode = getParentNode(currentNode);
  }
  return null;
}
function isWebKit() {
  if (typeof CSS === "undefined" || !CSS.supports) return false;
  return CSS.supports("-webkit-backdrop-filter", "none");
}
function isLastTraversableNode(node) {
  return ["html", "body", "#document"].includes(getNodeName(node));
}
function getComputedStyle$1(element2) {
  return getWindow(element2).getComputedStyle(element2);
}
function getNodeScroll(element2) {
  if (isElement(element2)) {
    return {
      scrollLeft: element2.scrollLeft,
      scrollTop: element2.scrollTop
    };
  }
  return {
    scrollLeft: element2.scrollX,
    scrollTop: element2.scrollY
  };
}
function getParentNode(node) {
  if (getNodeName(node) === "html") {
    return node;
  }
  const result = (
    // Step into the shadow DOM of the parent of a slotted node.
    node.assignedSlot || // DOM Element detected.
    node.parentNode || // ShadowRoot detected.
    isShadowRoot(node) && node.host || // Fallback.
    getDocumentElement(node)
  );
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  if (traverseIframes === void 0) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    const frameElement = getFrameElement(win);
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
  }
  return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
}
function getFrameElement(win) {
  return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}
function getCssDimensions(element2) {
  const css = getComputedStyle$1(element2);
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = isHTMLElement(element2);
  const offsetWidth = hasOffset ? element2.offsetWidth : width;
  const offsetHeight = hasOffset ? element2.offsetHeight : height;
  const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}
function unwrapElement(element2) {
  return !isElement(element2) ? element2.contextElement : element2;
}
function getScale(element2) {
  const domElement = unwrapElement(element2);
  if (!isHTMLElement(domElement)) {
    return createCoords(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $
  } = getCssDimensions(domElement);
  let x = ($ ? round(rect.width) : rect.width) / width;
  let y = ($ ? round(rect.height) : rect.height) / height;
  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y
  };
}
function getVisualOffsets(element2) {
  const win = getWindow(element2);
  if (!isWebKit() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element2, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element2)) {
    return false;
  }
  return isFixed;
}
function getBoundingClientRect(element2, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element2.getBoundingClientRect();
  const domElement = unwrapElement(element2);
  let scale = createCoords(1);
  if (includeScale) {
    if (offsetParent) {
      if (isElement(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element2);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
  let x = (clientRect.left + visualOffsets.x) / scale.x;
  let y = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win = getWindow(domElement);
    const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
    let currentWin = win;
    let currentIFrame = getFrameElement(currentWin);
    while (currentIFrame && offsetParent && offsetWin !== currentWin) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = getComputedStyle$1(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += left;
      y += top;
      currentWin = getWindow(currentIFrame);
      currentIFrame = getFrameElement(currentWin);
    }
  }
  return rectToClientRect({
    width,
    height,
    x,
    y
  });
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    elements,
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isFixed = strategy === "fixed";
  const documentElement = getDocumentElement(offsetParent);
  const topLayer = elements ? isTopLayer(elements.floating) : false;
  if (offsetParent === documentElement || topLayer && isFixed) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = createCoords(1);
  const offsets = createCoords(0);
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y
  };
}
function getClientRects(element2) {
  return Array.from(element2.getClientRects());
}
function getWindowScrollBarX(element2) {
  return getBoundingClientRect(getDocumentElement(element2)).left + getNodeScroll(element2).scrollLeft;
}
function getDocumentRect(element2) {
  const html = getDocumentElement(element2);
  const scroll = getNodeScroll(element2);
  const body2 = element2.ownerDocument.body;
  const width = max(html.scrollWidth, html.clientWidth, body2.scrollWidth, body2.clientWidth);
  const height = max(html.scrollHeight, html.clientHeight, body2.scrollHeight, body2.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(element2);
  const y = -scroll.scrollTop;
  if (getComputedStyle$1(body2).direction === "rtl") {
    x += max(html.clientWidth, body2.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}
function getViewportRect(element2, strategy) {
  const win = getWindow(element2);
  const html = getDocumentElement(element2);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = isWebKit();
    if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x,
    y
  };
}
function getInnerBoundingClientRect(element2, strategy) {
  const clientRect = getBoundingClientRect(element2, true, strategy === "fixed");
  const top = clientRect.top + element2.clientTop;
  const left = clientRect.left + element2.clientLeft;
  const scale = isHTMLElement(element2) ? getScale(element2) : createCoords(1);
  const width = element2.clientWidth * scale.x;
  const height = element2.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;
  return {
    width,
    height,
    x,
    y
  };
}
function getClientRectFromClippingAncestor(element2, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === "viewport") {
    rect = getViewportRect(element2, strategy);
  } else if (clippingAncestor === "document") {
    rect = getDocumentRect(getDocumentElement(element2));
  } else if (isElement(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element2);
    rect = {
      ...clippingAncestor,
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y
    };
  }
  return rectToClientRect(rect);
}
function hasFixedPositionAncestor(element2, stopNode) {
  const parentNode = getParentNode(element2);
  if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
    return false;
  }
  return getComputedStyle$1(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
}
function getClippingElementAncestors(element2, cache) {
  const cachedResult = cache.get(element2);
  if (cachedResult) {
    return cachedResult;
  }
  let result = getOverflowAncestors(element2, [], false).filter((el) => isElement(el) && getNodeName(el) !== "body");
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = getComputedStyle$1(element2).position === "fixed";
  let currentNode = elementIsFixed ? getParentNode(element2) : element2;
  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle$1(currentNode);
    const currentNodeIsContaining = isContainingBlock(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === "fixed") {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && ["absolute", "fixed"].includes(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element2, currentNode);
    if (shouldDropCurrentNode) {
      result = result.filter((ancestor) => ancestor !== currentNode);
    } else {
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = getParentNode(currentNode);
  }
  cache.set(element2, result);
  return result;
}
function getClippingRect(_ref) {
  let {
    element: element2,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === "clippingAncestors" ? isTopLayer(element2) ? [] : getClippingElementAncestors(element2, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element2, clippingAncestor, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element2, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
}
function getDimensions(element2) {
  const {
    width,
    height
  } = getCssDimensions(element2);
  return {
    width,
    height
  };
}
function getRectRelativeToOffsetParent(element2, offsetParent, strategy) {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const isFixed = strategy === "fixed";
  const rect = getBoundingClientRect(element2, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = createCoords(0);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  const x = rect.left + scroll.scrollLeft - offsets.x;
  const y = rect.top + scroll.scrollTop - offsets.y;
  return {
    x,
    y,
    width: rect.width,
    height: rect.height
  };
}
function isStaticPositioned(element2) {
  return getComputedStyle$1(element2).position === "static";
}
function getTrueOffsetParent(element2, polyfill) {
  if (!isHTMLElement(element2) || getComputedStyle$1(element2).position === "fixed") {
    return null;
  }
  if (polyfill) {
    return polyfill(element2);
  }
  return element2.offsetParent;
}
function getOffsetParent(element2, polyfill) {
  const win = getWindow(element2);
  if (isTopLayer(element2)) {
    return win;
  }
  if (!isHTMLElement(element2)) {
    let svgOffsetParent = getParentNode(element2);
    while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
      if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
        return svgOffsetParent;
      }
      svgOffsetParent = getParentNode(svgOffsetParent);
    }
    return win;
  }
  let offsetParent = getTrueOffsetParent(element2, polyfill);
  while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) {
    return win;
  }
  return offsetParent || getContainingBlock(element2) || win;
}
function isRTL(element2) {
  return getComputedStyle$1(element2).direction === "rtl";
}
function observeMove(element2, onMove) {
  let io = null;
  let timeoutId;
  const root2 = getDocumentElement(element2);
  function cleanup() {
    var _io;
    clearTimeout(timeoutId);
    (_io = io) == null || _io.disconnect();
    io = null;
  }
  function refresh(skip, threshold) {
    if (skip === void 0) {
      skip = false;
    }
    if (threshold === void 0) {
      threshold = 1;
    }
    cleanup();
    const {
      left,
      top,
      width,
      height
    } = element2.getBoundingClientRect();
    if (!skip) {
      onMove();
    }
    if (!width || !height) {
      return;
    }
    const insetTop = floor(top);
    const insetRight = floor(root2.clientWidth - (left + width));
    const insetBottom = floor(root2.clientHeight - (top + height));
    const insetLeft = floor(left);
    const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
    const options2 = {
      rootMargin,
      threshold: max(0, min(1, threshold)) || 1
    };
    let isFirstUpdate = true;
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;
      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }
        if (!ratio) {
          timeoutId = setTimeout(() => {
            refresh(false, 1e-7);
          }, 1e3);
        } else {
          refresh(false, ratio);
        }
      }
      isFirstUpdate = false;
    }
    try {
      io = new IntersectionObserver(handleObserve, {
        ...options2,
        // Handle <iframe>s
        root: root2.ownerDocument
      });
    } catch (e) {
      io = new IntersectionObserver(handleObserve, options2);
    }
    io.observe(element2);
  }
  refresh(true);
  return cleanup;
}
function autoUpdate(reference, floating, update, options2) {
  if (options2 === void 0) {
    options2 = {};
  }
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === "function",
    layoutShift = typeof IntersectionObserver === "function",
    animationFrame = false
  } = options2;
  const referenceEl = unwrapElement(reference);
  const ancestors = ancestorScroll || ancestorResize ? [...referenceEl ? getOverflowAncestors(referenceEl) : [], ...getOverflowAncestors(floating)] : [];
  ancestors.forEach((ancestor) => {
    ancestorScroll && ancestor.addEventListener("scroll", update, {
      passive: true
    });
    ancestorResize && ancestor.addEventListener("resize", update);
  });
  const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
  let reobserveFrame = -1;
  let resizeObserver = null;
  if (elementResize) {
    resizeObserver = new ResizeObserver((_ref) => {
      let [firstEntry] = _ref;
      if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        reobserveFrame = requestAnimationFrame(() => {
          var _resizeObserver;
          (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
        });
      }
      update();
    });
    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }
    resizeObserver.observe(floating);
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && (nextRefRect.x !== prevRefRect.x || nextRefRect.y !== prevRefRect.y || nextRefRect.width !== prevRefRect.width || nextRefRect.height !== prevRefRect.height)) {
      update();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update();
  return () => {
    var _resizeObserver2;
    ancestors.forEach((ancestor) => {
      ancestorScroll && ancestor.removeEventListener("scroll", update);
      ancestorResize && ancestor.removeEventListener("resize", update);
    });
    cleanupIo == null || cleanupIo();
    (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
    resizeObserver = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}
function useFloating(reference, floating, opts = {}) {
  if (!floating || !reference || opts === null)
    return {
      destroy: noop2
    };
  const options2 = { ...defaultConfig$1, ...opts };
  const arrowEl = floating.querySelector("[data-arrow=true]");
  const middleware = [];
  if (options2.flip) {
    middleware.push(flip({
      boundary: options2.boundary,
      padding: options2.overflowPadding,
      ...isObject(options2.flip) && options2.flip
    }));
  }
  const arrowOffset = isHTMLElement$1(arrowEl) ? arrowEl.offsetHeight / 2 : 0;
  if (options2.gutter || options2.offset) {
    const data = options2.gutter ? { mainAxis: options2.gutter } : options2.offset;
    if (data?.mainAxis != null) {
      data.mainAxis += arrowOffset;
    }
    middleware.push(offset(data));
  }
  middleware.push(shift({
    boundary: options2.boundary,
    crossAxis: options2.overlap,
    padding: options2.overflowPadding
  }));
  if (arrowEl) {
    middleware.push(arrow({ element: arrowEl, padding: 8 }));
  }
  middleware.push(size({
    padding: options2.overflowPadding,
    apply({ rects, availableHeight, availableWidth }) {
      if (options2.sameWidth) {
        Object.assign(floating.style, {
          width: `${Math.round(rects.reference.width)}px`,
          minWidth: "unset"
        });
      }
      if (options2.fitViewport) {
        Object.assign(floating.style, {
          maxWidth: `${availableWidth}px`,
          maxHeight: `${availableHeight}px`
        });
      }
    }
  }));
  function compute() {
    if (!reference || !floating)
      return;
    if (isHTMLElement$1(reference) && !reference.ownerDocument.documentElement.contains(reference))
      return;
    const { placement, strategy } = options2;
    computePosition(reference, floating, {
      placement,
      middleware,
      strategy
    }).then((data) => {
      const x = Math.round(data.x);
      const y = Math.round(data.y);
      const [side, align] = getSideAndAlignFromPlacement(data.placement);
      floating.setAttribute("data-side", side);
      floating.setAttribute("data-align", align);
      Object.assign(floating.style, {
        position: options2.strategy,
        top: `${y}px`,
        left: `${x}px`
      });
      if (isHTMLElement$1(arrowEl) && data.middlewareData.arrow) {
        const { x: x2, y: y2 } = data.middlewareData.arrow;
        const dir = data.placement.split("-")[0];
        arrowEl.setAttribute("data-side", dir);
        Object.assign(arrowEl.style, {
          position: "absolute",
          left: x2 != null ? `${x2}px` : "",
          top: y2 != null ? `${y2}px` : "",
          [dir]: `calc(100% - ${arrowOffset}px)`,
          transform: ARROW_TRANSFORM[dir],
          backgroundColor: "inherit",
          zIndex: "inherit"
        });
      }
      return data;
    });
  }
  Object.assign(floating.style, {
    position: options2.strategy
  });
  return {
    destroy: autoUpdate(reference, floating, compute)
  };
}
function getSideAndAlignFromPlacement(placement) {
  const [side, align = "center"] = placement.split("-");
  return [side, align];
}
function ownKeys(e, r2) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r2 && (o = o.filter(function(r22) {
      return Object.getOwnPropertyDescriptor(e, r22).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t = null != arguments[r2] ? arguments[r2] : {};
    r2 % 2 ? ownKeys(Object(t), true).forEach(function(r22) {
      _defineProperty(e, r22, t[r22]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r22) {
      Object.defineProperty(e, r22, Object.getOwnPropertyDescriptor(t, r22));
    });
  }
  return e;
}
function _defineProperty(obj, key2, value) {
  key2 = _toPropertyKey(key2);
  if (key2 in obj) {
    Object.defineProperty(obj, key2, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key2] = value;
  }
  return obj;
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== void 0) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key2 = _toPrimitive(arg, "string");
  return typeof key2 === "symbol" ? key2 : String(key2);
}
function isValidEvent(e, node) {
  if ("button" in e && e.button > 0)
    return false;
  const target = e.target;
  if (!isElement$1(target))
    return false;
  const ownerDocument = target.ownerDocument;
  if (!ownerDocument || !ownerDocument.documentElement.contains(target)) {
    return false;
  }
  return node && !isOrContainsTarget(node, target);
}
function isHighestLayer(node) {
  return Array.from(layers).at(-1) === node;
}
function createLabel() {
  const root2 = makeElement("label", {
    action: (node) => {
      const mouseDown = addMeltEventListener(node, "mousedown", (e) => {
        if (!e.defaultPrevented && e.detail > 1) {
          e.preventDefault();
        }
      });
      return {
        destroy: mouseDown
      };
    }
  });
  return {
    elements: {
      root: root2
    }
  };
}
function createListbox(props) {
  const withDefaults = { ...defaults$1, ...props };
  const activeTrigger = withGet(writable(null));
  const highlightedItem = withGet(writable(null));
  const selectedWritable = withDefaults.selected ?? writable(withDefaults.defaultSelected);
  const selected = overridable(selectedWritable, withDefaults?.onSelectedChange);
  const highlighted = derived(highlightedItem, ($highlightedItem) => $highlightedItem ? getOptionProps($highlightedItem) : void 0);
  const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
  const open = overridable(openWritable, withDefaults?.onOpenChange);
  const options2 = toWritableStores({
    ...omit(withDefaults, "open", "defaultOpen", "builder", "ids"),
    multiple: withDefaults.multiple ?? false
  });
  const { scrollAlignment, loop, closeOnOutsideClick, escapeBehavior, preventScroll, portal, forceVisible, positioning, multiple, arrowSize, disabled, required, typeahead, name: nameProp, highlightOnHover, onOutsideClick, preventTextSelectionOverflow: preventTextSelectionOverflow2 } = options2;
  const { name: name2, selector } = createElHelpers(withDefaults.builder);
  const ids = toWritableStores({ ...generateIds(listboxIdParts), ...withDefaults.ids });
  const { handleTypeaheadSearch } = createTypeaheadSearch({
    onMatch: (element2) => {
      highlightedItem.set(element2);
      element2.scrollIntoView({ block: scrollAlignment.get() });
    },
    getCurrentItem() {
      return highlightedItem.get();
    }
  });
  function getOptionProps(el) {
    const value = el.getAttribute("data-value");
    const label2 = el.getAttribute("data-label");
    const disabled2 = el.hasAttribute("data-disabled");
    return {
      value: value ? JSON.parse(value) : value,
      label: label2 ?? el.textContent ?? void 0,
      disabled: disabled2 ? true : false
    };
  }
  const setOption = (newOption) => {
    selected.update(($option) => {
      const $multiple = multiple.get();
      if ($multiple) {
        const optionArr = Array.isArray($option) ? [...$option] : [];
        return toggle(newOption, optionArr, (itemA, itemB) => dequal(itemA.value, itemB.value));
      }
      return newOption;
    });
  };
  function selectItem(item) {
    const props2 = getOptionProps(item);
    setOption(props2);
  }
  async function openMenu() {
    open.set(true);
    await tick();
    const menuElement = document.getElementById(ids.menu.get());
    if (!isHTMLElement$1(menuElement))
      return;
    const selectedItem = menuElement.querySelector("[aria-selected=true]");
    if (!isHTMLElement$1(selectedItem))
      return;
    highlightedItem.set(selectedItem);
  }
  function closeMenu() {
    open.set(false);
    highlightedItem.set(null);
  }
  const isVisible = derivedVisible({ open, forceVisible, activeTrigger });
  const isSelected = derived([selected], ([$selected]) => {
    return (value) => {
      if (Array.isArray($selected)) {
        return $selected.some((o) => dequal(o.value, value));
      }
      if (isObject(value)) {
        return dequal($selected?.value, stripValues(value, void 0));
      }
      return dequal($selected?.value, value);
    };
  });
  const isHighlighted = derived([highlighted], ([$value]) => {
    return (item) => {
      return dequal($value?.value, item);
    };
  });
  const trigger = makeElement(name2("trigger"), {
    stores: [open, highlightedItem, disabled, ids.menu, ids.trigger, ids.label],
    returned: ([$open, $highlightedItem, $disabled, $menuId, $triggerId, $labelId]) => {
      return {
        "aria-activedescendant": $highlightedItem?.id,
        "aria-autocomplete": "list",
        "aria-controls": $menuId,
        "aria-expanded": $open,
        "aria-labelledby": $labelId,
        "data-state": $open ? "open" : "closed",
        // autocomplete: 'off',
        id: $triggerId,
        role: "combobox",
        disabled: disabledAttr($disabled),
        type: withDefaults.builder === "select" ? "button" : void 0
      };
    },
    action: (node) => {
      activeTrigger.set(node);
      const isInput3 = isHTMLInputElement(node);
      const unsubscribe = executeCallbacks(
        addMeltEventListener(node, "click", () => {
          node.focus();
          const $open = open.get();
          if ($open) {
            closeMenu();
          } else {
            openMenu();
          }
        }),
        // Handle all input key events including typing, meta, and navigation.
        addMeltEventListener(node, "keydown", (e) => {
          const $open = open.get();
          if (!$open) {
            if (INTERACTION_KEYS.includes(e.key)) {
              return;
            }
            if (e.key === kbd.TAB) {
              return;
            }
            if (e.key === kbd.BACKSPACE && isInput3 && node.value === "") {
              return;
            }
            if (e.key === kbd.SPACE && isHTMLButtonElement(node)) {
              return;
            }
            openMenu();
            tick().then(() => {
              const $selectedItem = selected.get();
              if ($selectedItem)
                return;
              const menuEl = document.getElementById(ids.menu.get());
              if (!isHTMLElement$1(menuEl))
                return;
              const enabledItems = Array.from(menuEl.querySelectorAll(`${selector("item")}:not([data-disabled]):not([data-hidden])`)).filter((item) => isHTMLElement$1(item));
              if (!enabledItems.length)
                return;
              if (e.key === kbd.ARROW_DOWN) {
                highlightedItem.set(enabledItems[0]);
                enabledItems[0].scrollIntoView({ block: scrollAlignment.get() });
              } else if (e.key === kbd.ARROW_UP) {
                highlightedItem.set(last(enabledItems));
                last(enabledItems).scrollIntoView({ block: scrollAlignment.get() });
              }
            });
          }
          if (e.key === kbd.TAB) {
            closeMenu();
            return;
          }
          if (e.key === kbd.ENTER && !e.isComposing || e.key === kbd.SPACE && isHTMLButtonElement(node)) {
            e.preventDefault();
            const $highlightedItem = highlightedItem.get();
            if ($highlightedItem) {
              selectItem($highlightedItem);
            }
            if (!multiple.get()) {
              closeMenu();
            }
          }
          if (e.key === kbd.ARROW_UP && e.altKey) {
            closeMenu();
          }
          if (FIRST_LAST_KEYS.includes(e.key)) {
            e.preventDefault();
            const menuElement = document.getElementById(ids.menu.get());
            if (!isHTMLElement$1(menuElement))
              return;
            const itemElements = getOptions(menuElement);
            if (!itemElements.length)
              return;
            const candidateNodes = itemElements.filter((opt) => !isElementDisabled(opt) && opt.dataset.hidden === void 0);
            const $currentItem = highlightedItem.get();
            const currentIndex = $currentItem ? candidateNodes.indexOf($currentItem) : -1;
            const $loop = loop.get();
            const $scrollAlignment = scrollAlignment.get();
            let nextItem;
            switch (e.key) {
              case kbd.ARROW_DOWN:
                nextItem = next(candidateNodes, currentIndex, $loop);
                break;
              case kbd.ARROW_UP:
                nextItem = prev(candidateNodes, currentIndex, $loop);
                break;
              case kbd.PAGE_DOWN:
                nextItem = forward(candidateNodes, currentIndex, 10, $loop);
                break;
              case kbd.PAGE_UP:
                nextItem = back(candidateNodes, currentIndex, 10, $loop);
                break;
              case kbd.HOME:
                nextItem = candidateNodes[0];
                break;
              case kbd.END:
                nextItem = last(candidateNodes);
                break;
              default:
                return;
            }
            highlightedItem.set(nextItem);
            nextItem?.scrollIntoView({ block: $scrollAlignment });
          } else if (typeahead.get()) {
            const menuEl = document.getElementById(ids.menu.get());
            if (!isHTMLElement$1(menuEl))
              return;
            handleTypeaheadSearch(e.key, getOptions(menuEl));
          }
        })
      );
      return {
        destroy() {
          activeTrigger.set(null);
          unsubscribe();
        }
      };
    }
  });
  const menu = makeElement(name2("menu"), {
    stores: [isVisible, ids.menu],
    returned: ([$isVisible, $menuId]) => {
      return {
        hidden: $isVisible ? void 0 : true,
        id: $menuId,
        role: "listbox",
        style: $isVisible ? void 0 : styleToString({ display: "none" })
      };
    },
    action: (node) => {
      let unsubPopper = noop2;
      const unsubscribe = executeCallbacks(
        // Bind the popper portal to the input element.
        effect2([isVisible, portal, closeOnOutsideClick, positioning, activeTrigger], ([$isVisible, $portal, $closeOnOutsideClick, $positioning, $activeTrigger]) => {
          unsubPopper();
          if (!$isVisible || !$activeTrigger)
            return;
          tick().then(() => {
            unsubPopper();
            const ignoreHandler = createClickOutsideIgnore(ids.trigger.get());
            unsubPopper = usePopper(node, {
              anchorElement: $activeTrigger,
              open,
              options: {
                floating: $positioning,
                focusTrap: null,
                modal: {
                  closeOnInteractOutside: $closeOnOutsideClick,
                  onClose: closeMenu,
                  shouldCloseOnInteractOutside: (e) => {
                    onOutsideClick.get()?.(e);
                    if (e.defaultPrevented)
                      return false;
                    const target = e.target;
                    if (!isElement$1(target))
                      return false;
                    if (target === $activeTrigger || $activeTrigger.contains(target)) {
                      return false;
                    }
                    if (ignoreHandler(e))
                      return false;
                    return true;
                  }
                },
                escapeKeydown: { handler: closeMenu, behaviorType: escapeBehavior },
                portal: getPortalDestination(node, $portal),
                preventTextSelectionOverflow: { enabled: preventTextSelectionOverflow2 }
              }
            }).destroy;
          });
        })
      );
      return {
        destroy: () => {
          unsubscribe();
          unsubPopper();
        }
      };
    }
  });
  const { elements: { root: labelBuilder } } = createLabel();
  const { action: labelAction } = get2(labelBuilder);
  const label = makeElement(name2("label"), {
    stores: [ids.label, ids.trigger],
    returned: ([$labelId, $triggerId]) => {
      return {
        id: $labelId,
        for: $triggerId
      };
    },
    action: labelAction
  });
  const option = makeElement(name2("option"), {
    stores: [isSelected],
    returned: ([$isSelected]) => (props2) => {
      const selected2 = $isSelected(props2.value);
      return {
        "data-value": JSON.stringify(props2.value),
        "data-label": props2.label,
        "data-disabled": disabledAttr(props2.disabled),
        "aria-disabled": props2.disabled ? true : void 0,
        "aria-selected": selected2,
        "data-selected": selected2 ? "" : void 0,
        id: generateId(),
        role: "option"
      };
    },
    action: (node) => {
      const unsubscribe = executeCallbacks(addMeltEventListener(node, "click", (e) => {
        if (isElementDisabled(node)) {
          e.preventDefault();
          return;
        }
        selectItem(node);
        if (!multiple.get()) {
          closeMenu();
        }
      }), effect2(highlightOnHover, ($highlightOnHover) => {
        if (!$highlightOnHover)
          return;
        const unsub = executeCallbacks(addMeltEventListener(node, "mouseover", () => {
          highlightedItem.set(node);
        }), addMeltEventListener(node, "mouseleave", () => {
          highlightedItem.set(null);
        }));
        return unsub;
      }));
      return { destroy: unsubscribe };
    }
  });
  const group = makeElement(name2("group"), {
    returned: () => {
      return (groupId) => ({
        role: "group",
        "aria-labelledby": groupId
      });
    }
  });
  const groupLabel = makeElement(name2("group-label"), {
    returned: () => {
      return (groupId) => ({
        id: groupId
      });
    }
  });
  const hiddenInput = createHiddenInput({
    value: derived([selected], ([$selected]) => {
      const value = Array.isArray($selected) ? $selected.map((o) => o.value) : $selected?.value;
      return typeof value === "string" ? value : JSON.stringify(value);
    }),
    name: readonly(nameProp),
    required,
    prefix: withDefaults.builder
  });
  const arrow2 = makeElement(name2("arrow"), {
    stores: arrowSize,
    returned: ($arrowSize) => ({
      "data-arrow": true,
      style: styleToString({
        position: "absolute",
        width: `var(--arrow-size, ${$arrowSize}px)`,
        height: `var(--arrow-size, ${$arrowSize}px)`
      })
    })
  });
  effect2([highlightedItem], ([$highlightedItem]) => {
    if (!isBrowser)
      return;
    const menuElement = document.getElementById(ids.menu.get());
    if (!isHTMLElement$1(menuElement))
      return;
    getOptions(menuElement).forEach((node) => {
      if (node === $highlightedItem) {
        addHighlight(node);
      } else {
        removeHighlight(node);
      }
    });
  });
  effect2([open, preventScroll], ([$open, $preventScroll]) => {
    if (!isBrowser || !$open || !$preventScroll)
      return;
    return removeScroll();
  });
  return {
    ids,
    elements: {
      trigger,
      group,
      option,
      menu,
      groupLabel,
      label,
      hiddenInput,
      arrow: arrow2
    },
    states: {
      open,
      selected,
      highlighted,
      highlightedItem
    },
    helpers: {
      isSelected,
      isHighlighted,
      closeMenu
    },
    options: options2
  };
}
function Icon($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "name",
    "color",
    "size",
    "strokeWidth",
    "absoluteStrokeWidth",
    "iconNode"
  ]);
  push();
  let name2 = value_or_fallback($$props["name"], () => void 0);
  let color = value_or_fallback($$props["color"], () => "currentColor");
  let size2 = value_or_fallback($$props["size"], () => 24);
  let strokeWidth = value_or_fallback($$props["strokeWidth"], () => 2);
  let absoluteStrokeWidth = value_or_fallback($$props["absoluteStrokeWidth"], () => false);
  let iconNode = value_or_fallback($$props["iconNode"], () => []);
  const mergeClasses = (...classes) => classes.filter((className, index7, array2) => {
    return Boolean(className) && array2.indexOf(className) === index7;
  }).join(" ");
  const each_array = ensure_array_like(iconNode);
  $$payload.out += `<svg${spread_attributes(
    {
      ...defaultAttributes,
      ...$$restProps,
      width: size2,
      height: size2,
      stroke: color,
      "stroke-width": absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size2) : strokeWidth,
      class: mergeClasses("lucide-icon", "lucide", name2 ? `lucide-${name2}` : "", $$sanitized_props.class)
    },
    void 0,
    void 0,
    3
  )}><!--[-->`;
  for (let $$index = 0; $$index < each_array.length; $$index++) {
    const $$item = each_array[$$index];
    const [tag, attrs] = $$item;
    element($$payload, tag, () => {
      $$payload.out += `${spread_attributes({ ...attrs }, void 0, void 0, 3)}`;
    });
  }
  $$payload.out += `<!--]--><!---->`;
  slot($$payload, default_slot($$props), {});
  $$payload.out += `<!----></svg>`;
  bind_props($$props, {
    name: name2,
    color,
    size: size2,
    strokeWidth,
    absoluteStrokeWidth,
    iconNode
  });
  pop();
}
function Check($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [["path", { "d": "M20 6 9 17l-5-5" }]];
  Icon($$payload, spread_props([
    { name: "check" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, default_slot($$props), {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Chevron_down($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [["path", { "d": "m6 9 6 6 6-6" }]];
  Icon($$payload, spread_props([
    { name: "chevron-down" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, default_slot($$props), {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
var has, hiddenAction, isFunctionWithParams, isBrowser, isFunction2, safeOnDestroy, overridable, urlAlphabet, nanoid, kbd, FIRST_KEYS, LAST_KEYS, FIRST_LAST_KEYS, isDom, pt, isTouchDevice, isMac, isApple, isIos, LOCK_CLASSNAME, ignoredKeys, defaults$3, defaults$2, layers$2, useEscapeKeydown, isResponsibleEscapeLayer, shouldIgnoreEvent, shouldInvokeResponsibleLayerHandler, min, max, round, floor, createCoords, oppositeSideMap, oppositeAlignmentMap, computePosition$1, arrow$1, flip$1, offset$1, shift$1, size$1, noOffsets, getElementRects, platform, offset, shift, flip, size, arrow, computePosition, defaultConfig$1, ARROW_TRANSFORM, candidateSelectors, candidateSelector, NoElement, matches, getRootNode, isInert, isContentEditable, getCandidates, getCandidatesIteratively, hasTabIndex, getTabIndex, getSortOrderTabIndex, sortOrderedTabbables, isInput, isHiddenInput, isDetailsWithSummary, getCheckedRadio, isTabbableRadio, isRadio, isNonTabbableRadio, isNodeAttached, isZeroArea, isHidden, isDisabledFromFieldset, isNodeMatchingSelectorFocusable, isNodeMatchingSelectorTabbable, isValidShadowRootTabbable, sortByOrder, tabbable, focusable, isTabbable, focusableCandidateSelector, isFocusable, activeFocusTraps, isSelectableInput, isEscapeEvent, isTabEvent, isKeyForward, isKeyBackward, delay, findIndex, valueOrHandler, getActualTarget, internalTrapStack, createFocusTrap, useFocusTrap, useModal, layers$1, usePreventTextSelectionOverflow, preventTextSelectionOverflow, getUserSelect, setUserSelect, isHighestLayer$1, defaultConfig, usePopper, usePortal, layers, useInteractOutside, INTERACTION_KEYS, defaults$1, listboxIdParts, defaults, defaultAttributes;
var init_chevron_down = __esm({
  ".svelte-kit/output/server/chunks/chevron-down.js"() {
    init_chunks();
    init_index2();
    has = Object.prototype.hasOwnProperty;
    ({
      type: "hidden",
      "aria-hidden": true,
      hidden: true,
      tabIndex: -1,
      style: styleToString({
        position: "absolute",
        opacity: 0,
        "pointer-events": "none",
        margin: 0,
        transform: "translateX(-100%)"
      })
    });
    hiddenAction = (obj) => {
      return new Proxy(obj, {
        get(target, prop, receiver) {
          return Reflect.get(target, prop, receiver);
        },
        ownKeys(target) {
          return Reflect.ownKeys(target).filter((key2) => key2 !== "action");
        }
      });
    };
    isFunctionWithParams = (fn) => {
      return typeof fn === "function";
    };
    makeElement("empty");
    isBrowser = typeof document !== "undefined";
    isFunction2 = (v) => typeof v === "function";
    safeOnDestroy = (fn) => {
      try {
        onDestroy(fn);
      } catch {
        return fn;
      }
    };
    withGet.writable = function(initial2) {
      const internal2 = writable(initial2);
      let value = initial2;
      return {
        subscribe: internal2.subscribe,
        set(newValue) {
          internal2.set(newValue);
          value = newValue;
        },
        update(updater) {
          const newValue = updater(value);
          internal2.set(newValue);
          value = newValue;
        },
        get() {
          return value;
        }
      };
    };
    withGet.derived = function(stores, fn) {
      const subscribers = /* @__PURE__ */ new Map();
      const get22 = () => {
        const values = Array.isArray(stores) ? stores.map((store) => store.get()) : stores.get();
        return fn(values);
      };
      const subscribe = (subscriber) => {
        const unsubscribers = [];
        const storesArr = Array.isArray(stores) ? stores : [stores];
        storesArr.forEach((store) => {
          unsubscribers.push(store.subscribe(() => {
            subscriber(get22());
          }));
        });
        subscriber(get22());
        subscribers.set(subscriber, unsubscribers);
        return () => {
          const unsubscribers2 = subscribers.get(subscriber);
          if (unsubscribers2) {
            for (const unsubscribe of unsubscribers2) {
              unsubscribe();
            }
          }
          subscribers.delete(subscriber);
        };
      };
      return {
        get: get22,
        subscribe
      };
    };
    overridable = (_store, onChange) => {
      const store = withGet(_store);
      const update = (updater, sideEffect) => {
        store.update((curr) => {
          const next2 = updater(curr);
          let res = next2;
          if (onChange) {
            res = onChange({ curr, next: next2 });
          }
          sideEffect?.(res);
          return res;
        });
      };
      const set2 = (curr) => {
        update(() => curr);
      };
      return {
        ...store,
        update,
        set: set2
      };
    };
    urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
    nanoid = (size2 = 21) => {
      let id = "";
      let i = size2;
      while (i--) {
        id += urlAlphabet[Math.random() * 64 | 0];
      }
      return id;
    };
    kbd = {
      ALT: "Alt",
      ARROW_DOWN: "ArrowDown",
      ARROW_LEFT: "ArrowLeft",
      ARROW_RIGHT: "ArrowRight",
      ARROW_UP: "ArrowUp",
      BACKSPACE: "Backspace",
      CAPS_LOCK: "CapsLock",
      CONTROL: "Control",
      DELETE: "Delete",
      END: "End",
      ENTER: "Enter",
      ESCAPE: "Escape",
      F1: "F1",
      F10: "F10",
      F11: "F11",
      F12: "F12",
      F2: "F2",
      F3: "F3",
      F4: "F4",
      F5: "F5",
      F6: "F6",
      F7: "F7",
      F8: "F8",
      F9: "F9",
      HOME: "Home",
      META: "Meta",
      PAGE_DOWN: "PageDown",
      PAGE_UP: "PageUp",
      SHIFT: "Shift",
      SPACE: " ",
      TAB: "Tab",
      CTRL: "Control",
      ASTERISK: "*",
      A: "a",
      P: "p"
    };
    FIRST_KEYS = [kbd.ARROW_DOWN, kbd.PAGE_UP, kbd.HOME];
    LAST_KEYS = [kbd.ARROW_UP, kbd.PAGE_DOWN, kbd.END];
    FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS];
    isDom = () => typeof window !== "undefined";
    pt = (v) => isDom() && v.test(getPlatform().toLowerCase());
    isTouchDevice = () => isDom() && !!navigator.maxTouchPoints;
    isMac = () => pt(/^mac/) && !isTouchDevice();
    isApple = () => pt(/mac|iphone|ipad|ipod/i);
    isIos = () => isApple() && !isMac();
    LOCK_CLASSNAME = "data-melt-scroll-lock";
    ignoredKeys = /* @__PURE__ */ new Set(["Shift", "Control", "Alt", "Meta", "CapsLock", "NumLock"]);
    defaults$3 = {
      onMatch: handleRovingFocus,
      getCurrentItem: () => document.activeElement
    };
    defaults$2 = {
      prefix: "",
      disabled: readable(false),
      required: readable(false),
      name: readable(void 0),
      type: readable(void 0),
      checked: void 0
    };
    layers$2 = /* @__PURE__ */ new Map();
    useEscapeKeydown = (node, config = {}) => {
      let unsub = noop2;
      function update(config2 = {}) {
        unsub();
        const options2 = { behaviorType: "close", ...config2 };
        const behaviorType = isReadable(options2.behaviorType) ? options2.behaviorType : withGet(readable(options2.behaviorType));
        layers$2.set(node, behaviorType);
        const onKeyDown = (e) => {
          if (e.key !== kbd.ESCAPE || !isResponsibleEscapeLayer(node))
            return;
          const target = e.target;
          if (!isHTMLElement$1(target))
            return;
          e.preventDefault();
          if (shouldIgnoreEvent(e, options2.ignore))
            return;
          if (shouldInvokeResponsibleLayerHandler(behaviorType.get())) {
            options2.handler?.(e);
          }
        };
        unsub = executeCallbacks(addEventListener(document, "keydown", onKeyDown, { passive: false }), effect2(behaviorType, ($behaviorType) => {
          if ($behaviorType === "close" || $behaviorType === "defer-otherwise-close" && [...layers$2.keys()][0] === node) {
            node.dataset.escapee = "";
          } else {
            delete node.dataset.escapee;
          }
        }), behaviorType.destroy || noop2);
      }
      update(config);
      return {
        update,
        destroy() {
          layers$2.delete(node);
          delete node.dataset.escapee;
          unsub();
        }
      };
    };
    isResponsibleEscapeLayer = (node) => {
      const layersArr = [...layers$2];
      const topMostLayer = layersArr.findLast(([_, behaviorType]) => {
        const $behaviorType = behaviorType.get();
        return $behaviorType === "close" || $behaviorType === "ignore";
      });
      if (topMostLayer)
        return topMostLayer[0] === node;
      const [firstLayerNode] = layersArr[0];
      return firstLayerNode === node;
    };
    shouldIgnoreEvent = (e, ignore) => {
      if (!ignore)
        return false;
      if (isFunction2(ignore) && ignore(e))
        return true;
      if (Array.isArray(ignore) && ignore.some((ignoreEl) => e.target === ignoreEl)) {
        return true;
      }
      return false;
    };
    shouldInvokeResponsibleLayerHandler = (behaviorType) => {
      return behaviorType === "close" || behaviorType === "defer-otherwise-close";
    };
    min = Math.min;
    max = Math.max;
    round = Math.round;
    floor = Math.floor;
    createCoords = (v) => ({
      x: v,
      y: v
    });
    oppositeSideMap = {
      left: "right",
      right: "left",
      bottom: "top",
      top: "bottom"
    };
    oppositeAlignmentMap = {
      start: "end",
      end: "start"
    };
    computePosition$1 = async (reference, floating, config) => {
      const {
        placement = "bottom",
        strategy = "absolute",
        middleware = [],
        platform: platform2
      } = config;
      const validMiddleware = middleware.filter(Boolean);
      const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(floating));
      let rects = await platform2.getElementRects({
        reference,
        floating,
        strategy
      });
      let {
        x,
        y
      } = computeCoordsFromPlacement(rects, placement, rtl);
      let statefulPlacement = placement;
      let middlewareData = {};
      let resetCount = 0;
      for (let i = 0; i < validMiddleware.length; i++) {
        const {
          name: name2,
          fn
        } = validMiddleware[i];
        const {
          x: nextX,
          y: nextY,
          data,
          reset: reset2
        } = await fn({
          x,
          y,
          initialPlacement: placement,
          placement: statefulPlacement,
          strategy,
          middlewareData,
          rects,
          platform: platform2,
          elements: {
            reference,
            floating
          }
        });
        x = nextX != null ? nextX : x;
        y = nextY != null ? nextY : y;
        middlewareData = {
          ...middlewareData,
          [name2]: {
            ...middlewareData[name2],
            ...data
          }
        };
        if (reset2 && resetCount <= 50) {
          resetCount++;
          if (typeof reset2 === "object") {
            if (reset2.placement) {
              statefulPlacement = reset2.placement;
            }
            if (reset2.rects) {
              rects = reset2.rects === true ? await platform2.getElementRects({
                reference,
                floating,
                strategy
              }) : reset2.rects;
            }
            ({
              x,
              y
            } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
          }
          i = -1;
        }
      }
      return {
        x,
        y,
        placement: statefulPlacement,
        strategy,
        middlewareData
      };
    };
    arrow$1 = (options2) => ({
      name: "arrow",
      options: options2,
      async fn(state) {
        const {
          x,
          y,
          placement,
          rects,
          platform: platform2,
          elements,
          middlewareData
        } = state;
        const {
          element: element2,
          padding = 0
        } = evaluate(options2, state) || {};
        if (element2 == null) {
          return {};
        }
        const paddingObject = getPaddingObject(padding);
        const coords = {
          x,
          y
        };
        const axis = getAlignmentAxis(placement);
        const length = getAxisLength(axis);
        const arrowDimensions = await platform2.getDimensions(element2);
        const isYAxis = axis === "y";
        const minProp = isYAxis ? "top" : "left";
        const maxProp = isYAxis ? "bottom" : "right";
        const clientProp = isYAxis ? "clientHeight" : "clientWidth";
        const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
        const startDiff = coords[axis] - rects.reference[axis];
        const arrowOffsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(element2));
        let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;
        if (!clientSize || !await (platform2.isElement == null ? void 0 : platform2.isElement(arrowOffsetParent))) {
          clientSize = elements.floating[clientProp] || rects.floating[length];
        }
        const centerToReference = endDiff / 2 - startDiff / 2;
        const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
        const minPadding = min(paddingObject[minProp], largestPossiblePadding);
        const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);
        const min$1 = minPadding;
        const max2 = clientSize - arrowDimensions[length] - maxPadding;
        const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
        const offset2 = clamp(min$1, center, max2);
        const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset2 && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
        const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max2 : 0;
        return {
          [axis]: coords[axis] + alignmentOffset,
          data: {
            [axis]: offset2,
            centerOffset: center - offset2 - alignmentOffset,
            ...shouldAddOffset && {
              alignmentOffset
            }
          },
          reset: shouldAddOffset
        };
      }
    });
    flip$1 = function(options2) {
      if (options2 === void 0) {
        options2 = {};
      }
      return {
        name: "flip",
        options: options2,
        async fn(state) {
          var _middlewareData$arrow, _middlewareData$flip;
          const {
            placement,
            middlewareData,
            rects,
            initialPlacement,
            platform: platform2,
            elements
          } = state;
          const {
            mainAxis: checkMainAxis = true,
            crossAxis: checkCrossAxis = true,
            fallbackPlacements: specifiedFallbackPlacements,
            fallbackStrategy = "bestFit",
            fallbackAxisSideDirection = "none",
            flipAlignment = true,
            ...detectOverflowOptions
          } = evaluate(options2, state);
          if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
            return {};
          }
          const side = getSide(placement);
          const initialSideAxis = getSideAxis(initialPlacement);
          const isBasePlacement = getSide(initialPlacement) === initialPlacement;
          const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
          const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
          const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
          if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
            fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
          }
          const placements = [initialPlacement, ...fallbackPlacements];
          const overflow = await detectOverflow(state, detectOverflowOptions);
          const overflows = [];
          let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
          if (checkMainAxis) {
            overflows.push(overflow[side]);
          }
          if (checkCrossAxis) {
            const sides = getAlignmentSides(placement, rects, rtl);
            overflows.push(overflow[sides[0]], overflow[sides[1]]);
          }
          overflowsData = [...overflowsData, {
            placement,
            overflows
          }];
          if (!overflows.every((side2) => side2 <= 0)) {
            var _middlewareData$flip2, _overflowsData$filter;
            const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
            const nextPlacement = placements[nextIndex];
            if (nextPlacement) {
              return {
                data: {
                  index: nextIndex,
                  overflows: overflowsData
                },
                reset: {
                  placement: nextPlacement
                }
              };
            }
            let resetPlacement = (_overflowsData$filter = overflowsData.filter((d) => d.overflows[0] <= 0).sort((a2, b) => a2.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
            if (!resetPlacement) {
              switch (fallbackStrategy) {
                case "bestFit": {
                  var _overflowsData$filter2;
                  const placement2 = (_overflowsData$filter2 = overflowsData.filter((d) => {
                    if (hasFallbackAxisSideDirection) {
                      const currentSideAxis = getSideAxis(d.placement);
                      return currentSideAxis === initialSideAxis || // Create a bias to the `y` side axis due to horizontal
                      // reading directions favoring greater width.
                      currentSideAxis === "y";
                    }
                    return true;
                  }).map((d) => [d.placement, d.overflows.filter((overflow2) => overflow2 > 0).reduce((acc, overflow2) => acc + overflow2, 0)]).sort((a2, b) => a2[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
                  if (placement2) {
                    resetPlacement = placement2;
                  }
                  break;
                }
                case "initialPlacement":
                  resetPlacement = initialPlacement;
                  break;
              }
            }
            if (placement !== resetPlacement) {
              return {
                reset: {
                  placement: resetPlacement
                }
              };
            }
          }
          return {};
        }
      };
    };
    offset$1 = function(options2) {
      if (options2 === void 0) {
        options2 = 0;
      }
      return {
        name: "offset",
        options: options2,
        async fn(state) {
          var _middlewareData$offse, _middlewareData$arrow;
          const {
            x,
            y,
            placement,
            middlewareData
          } = state;
          const diffCoords = await convertValueToCoords(state, options2);
          if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
            return {};
          }
          return {
            x: x + diffCoords.x,
            y: y + diffCoords.y,
            data: {
              ...diffCoords,
              placement
            }
          };
        }
      };
    };
    shift$1 = function(options2) {
      if (options2 === void 0) {
        options2 = {};
      }
      return {
        name: "shift",
        options: options2,
        async fn(state) {
          const {
            x,
            y,
            placement
          } = state;
          const {
            mainAxis: checkMainAxis = true,
            crossAxis: checkCrossAxis = false,
            limiter = {
              fn: (_ref) => {
                let {
                  x: x2,
                  y: y2
                } = _ref;
                return {
                  x: x2,
                  y: y2
                };
              }
            },
            ...detectOverflowOptions
          } = evaluate(options2, state);
          const coords = {
            x,
            y
          };
          const overflow = await detectOverflow(state, detectOverflowOptions);
          const crossAxis = getSideAxis(getSide(placement));
          const mainAxis = getOppositeAxis(crossAxis);
          let mainAxisCoord = coords[mainAxis];
          let crossAxisCoord = coords[crossAxis];
          if (checkMainAxis) {
            const minSide = mainAxis === "y" ? "top" : "left";
            const maxSide = mainAxis === "y" ? "bottom" : "right";
            const min2 = mainAxisCoord + overflow[minSide];
            const max2 = mainAxisCoord - overflow[maxSide];
            mainAxisCoord = clamp(min2, mainAxisCoord, max2);
          }
          if (checkCrossAxis) {
            const minSide = crossAxis === "y" ? "top" : "left";
            const maxSide = crossAxis === "y" ? "bottom" : "right";
            const min2 = crossAxisCoord + overflow[minSide];
            const max2 = crossAxisCoord - overflow[maxSide];
            crossAxisCoord = clamp(min2, crossAxisCoord, max2);
          }
          const limitedCoords = limiter.fn({
            ...state,
            [mainAxis]: mainAxisCoord,
            [crossAxis]: crossAxisCoord
          });
          return {
            ...limitedCoords,
            data: {
              x: limitedCoords.x - x,
              y: limitedCoords.y - y
            }
          };
        }
      };
    };
    size$1 = function(options2) {
      if (options2 === void 0) {
        options2 = {};
      }
      return {
        name: "size",
        options: options2,
        async fn(state) {
          const {
            placement,
            rects,
            platform: platform2,
            elements
          } = state;
          const {
            apply = () => {
            },
            ...detectOverflowOptions
          } = evaluate(options2, state);
          const overflow = await detectOverflow(state, detectOverflowOptions);
          const side = getSide(placement);
          const alignment = getAlignment(placement);
          const isYAxis = getSideAxis(placement) === "y";
          const {
            width,
            height
          } = rects.floating;
          let heightSide;
          let widthSide;
          if (side === "top" || side === "bottom") {
            heightSide = side;
            widthSide = alignment === (await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating)) ? "start" : "end") ? "left" : "right";
          } else {
            widthSide = side;
            heightSide = alignment === "end" ? "top" : "bottom";
          }
          const maximumClippingHeight = height - overflow.top - overflow.bottom;
          const maximumClippingWidth = width - overflow.left - overflow.right;
          const overflowAvailableHeight = min(height - overflow[heightSide], maximumClippingHeight);
          const overflowAvailableWidth = min(width - overflow[widthSide], maximumClippingWidth);
          const noShift = !state.middlewareData.shift;
          let availableHeight = overflowAvailableHeight;
          let availableWidth = overflowAvailableWidth;
          if (isYAxis) {
            availableWidth = alignment || noShift ? min(overflowAvailableWidth, maximumClippingWidth) : maximumClippingWidth;
          } else {
            availableHeight = alignment || noShift ? min(overflowAvailableHeight, maximumClippingHeight) : maximumClippingHeight;
          }
          if (noShift && !alignment) {
            const xMin = max(overflow.left, 0);
            const xMax = max(overflow.right, 0);
            const yMin = max(overflow.top, 0);
            const yMax = max(overflow.bottom, 0);
            if (isYAxis) {
              availableWidth = width - 2 * (xMin !== 0 || xMax !== 0 ? xMin + xMax : max(overflow.left, overflow.right));
            } else {
              availableHeight = height - 2 * (yMin !== 0 || yMax !== 0 ? yMin + yMax : max(overflow.top, overflow.bottom));
            }
          }
          await apply({
            ...state,
            availableWidth,
            availableHeight
          });
          const nextDimensions = await platform2.getDimensions(elements.floating);
          if (width !== nextDimensions.width || height !== nextDimensions.height) {
            return {
              reset: {
                rects: true
              }
            };
          }
          return {};
        }
      };
    };
    noOffsets = /* @__PURE__ */ createCoords(0);
    getElementRects = async function(data) {
      const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
      const getDimensionsFn = this.getDimensions;
      const floatingDimensions = await getDimensionsFn(data.floating);
      return {
        reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
        floating: {
          x: 0,
          y: 0,
          width: floatingDimensions.width,
          height: floatingDimensions.height
        }
      };
    };
    platform = {
      convertOffsetParentRelativeRectToViewportRelativeRect,
      getDocumentElement,
      getClippingRect,
      getOffsetParent,
      getElementRects,
      getClientRects,
      getDimensions,
      getScale,
      isElement,
      isRTL
    };
    offset = offset$1;
    shift = shift$1;
    flip = flip$1;
    size = size$1;
    arrow = arrow$1;
    computePosition = (reference, floating, options2) => {
      const cache = /* @__PURE__ */ new Map();
      const mergedOptions = {
        platform,
        ...options2
      };
      const platformWithCache = {
        ...mergedOptions.platform,
        _c: cache
      };
      return computePosition$1(reference, floating, {
        ...mergedOptions,
        platform: platformWithCache
      });
    };
    defaultConfig$1 = {
      strategy: "absolute",
      placement: "top",
      gutter: 5,
      flip: true,
      sameWidth: false,
      overflowPadding: 8
    };
    ARROW_TRANSFORM = {
      bottom: "rotate(45deg)",
      left: "rotate(135deg)",
      top: "rotate(225deg)",
      right: "rotate(315deg)"
    };
    candidateSelectors = ["input:not([inert])", "select:not([inert])", "textarea:not([inert])", "a[href]:not([inert])", "button:not([inert])", "[tabindex]:not(slot):not([inert])", "audio[controls]:not([inert])", "video[controls]:not([inert])", '[contenteditable]:not([contenteditable="false"]):not([inert])', "details>summary:first-of-type:not([inert])", "details:not([inert])"];
    candidateSelector = /* @__PURE__ */ candidateSelectors.join(",");
    NoElement = typeof Element === "undefined";
    matches = NoElement ? function() {
    } : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    getRootNode = !NoElement && Element.prototype.getRootNode ? function(element2) {
      var _element$getRootNode;
      return element2 === null || element2 === void 0 ? void 0 : (_element$getRootNode = element2.getRootNode) === null || _element$getRootNode === void 0 ? void 0 : _element$getRootNode.call(element2);
    } : function(element2) {
      return element2 === null || element2 === void 0 ? void 0 : element2.ownerDocument;
    };
    isInert = function isInert2(node, lookUp) {
      var _node$getAttribute;
      if (lookUp === void 0) {
        lookUp = true;
      }
      var inertAtt = node === null || node === void 0 ? void 0 : (_node$getAttribute = node.getAttribute) === null || _node$getAttribute === void 0 ? void 0 : _node$getAttribute.call(node, "inert");
      var inert = inertAtt === "" || inertAtt === "true";
      var result = inert || lookUp && node && isInert2(node.parentNode);
      return result;
    };
    isContentEditable = function isContentEditable2(node) {
      var _node$getAttribute2;
      var attValue = node === null || node === void 0 ? void 0 : (_node$getAttribute2 = node.getAttribute) === null || _node$getAttribute2 === void 0 ? void 0 : _node$getAttribute2.call(node, "contenteditable");
      return attValue === "" || attValue === "true";
    };
    getCandidates = function getCandidates2(el, includeContainer, filter) {
      if (isInert(el)) {
        return [];
      }
      var candidates = Array.prototype.slice.apply(el.querySelectorAll(candidateSelector));
      if (includeContainer && matches.call(el, candidateSelector)) {
        candidates.unshift(el);
      }
      candidates = candidates.filter(filter);
      return candidates;
    };
    getCandidatesIteratively = function getCandidatesIteratively2(elements, includeContainer, options2) {
      var candidates = [];
      var elementsToCheck = Array.from(elements);
      while (elementsToCheck.length) {
        var element2 = elementsToCheck.shift();
        if (isInert(element2, false)) {
          continue;
        }
        if (element2.tagName === "SLOT") {
          var assigned = element2.assignedElements();
          var content = assigned.length ? assigned : element2.children;
          var nestedCandidates = getCandidatesIteratively2(content, true, options2);
          if (options2.flatten) {
            candidates.push.apply(candidates, nestedCandidates);
          } else {
            candidates.push({
              scopeParent: element2,
              candidates: nestedCandidates
            });
          }
        } else {
          var validCandidate = matches.call(element2, candidateSelector);
          if (validCandidate && options2.filter(element2) && (includeContainer || !elements.includes(element2))) {
            candidates.push(element2);
          }
          var shadowRoot = element2.shadowRoot || // check for an undisclosed shadow
          typeof options2.getShadowRoot === "function" && options2.getShadowRoot(element2);
          var validShadowRoot = !isInert(shadowRoot, false) && (!options2.shadowRootFilter || options2.shadowRootFilter(element2));
          if (shadowRoot && validShadowRoot) {
            var _nestedCandidates = getCandidatesIteratively2(shadowRoot === true ? element2.children : shadowRoot.children, true, options2);
            if (options2.flatten) {
              candidates.push.apply(candidates, _nestedCandidates);
            } else {
              candidates.push({
                scopeParent: element2,
                candidates: _nestedCandidates
              });
            }
          } else {
            elementsToCheck.unshift.apply(elementsToCheck, element2.children);
          }
        }
      }
      return candidates;
    };
    hasTabIndex = function hasTabIndex2(node) {
      return !isNaN(parseInt(node.getAttribute("tabindex"), 10));
    };
    getTabIndex = function getTabIndex2(node) {
      if (!node) {
        throw new Error("No node provided");
      }
      if (node.tabIndex < 0) {
        if ((/^(AUDIO|VIDEO|DETAILS)$/.test(node.tagName) || isContentEditable(node)) && !hasTabIndex(node)) {
          return 0;
        }
      }
      return node.tabIndex;
    };
    getSortOrderTabIndex = function getSortOrderTabIndex2(node, isScope) {
      var tabIndex = getTabIndex(node);
      if (tabIndex < 0 && isScope && !hasTabIndex(node)) {
        return 0;
      }
      return tabIndex;
    };
    sortOrderedTabbables = function sortOrderedTabbables2(a2, b) {
      return a2.tabIndex === b.tabIndex ? a2.documentOrder - b.documentOrder : a2.tabIndex - b.tabIndex;
    };
    isInput = function isInput2(node) {
      return node.tagName === "INPUT";
    };
    isHiddenInput = function isHiddenInput2(node) {
      return isInput(node) && node.type === "hidden";
    };
    isDetailsWithSummary = function isDetailsWithSummary2(node) {
      var r2 = node.tagName === "DETAILS" && Array.prototype.slice.apply(node.children).some(function(child) {
        return child.tagName === "SUMMARY";
      });
      return r2;
    };
    getCheckedRadio = function getCheckedRadio2(nodes, form) {
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].checked && nodes[i].form === form) {
          return nodes[i];
        }
      }
    };
    isTabbableRadio = function isTabbableRadio2(node) {
      if (!node.name) {
        return true;
      }
      var radioScope = node.form || getRootNode(node);
      var queryRadios = function queryRadios2(name2) {
        return radioScope.querySelectorAll('input[type="radio"][name="' + name2 + '"]');
      };
      var radioSet;
      if (typeof window !== "undefined" && typeof window.CSS !== "undefined" && typeof window.CSS.escape === "function") {
        radioSet = queryRadios(window.CSS.escape(node.name));
      } else {
        try {
          radioSet = queryRadios(node.name);
        } catch (err) {
          console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", err.message);
          return false;
        }
      }
      var checked = getCheckedRadio(radioSet, node.form);
      return !checked || checked === node;
    };
    isRadio = function isRadio2(node) {
      return isInput(node) && node.type === "radio";
    };
    isNonTabbableRadio = function isNonTabbableRadio2(node) {
      return isRadio(node) && !isTabbableRadio(node);
    };
    isNodeAttached = function isNodeAttached2(node) {
      var _nodeRoot;
      var nodeRoot = node && getRootNode(node);
      var nodeRootHost = (_nodeRoot = nodeRoot) === null || _nodeRoot === void 0 ? void 0 : _nodeRoot.host;
      var attached = false;
      if (nodeRoot && nodeRoot !== node) {
        var _nodeRootHost, _nodeRootHost$ownerDo, _node$ownerDocument;
        attached = !!((_nodeRootHost = nodeRootHost) !== null && _nodeRootHost !== void 0 && (_nodeRootHost$ownerDo = _nodeRootHost.ownerDocument) !== null && _nodeRootHost$ownerDo !== void 0 && _nodeRootHost$ownerDo.contains(nodeRootHost) || node !== null && node !== void 0 && (_node$ownerDocument = node.ownerDocument) !== null && _node$ownerDocument !== void 0 && _node$ownerDocument.contains(node));
        while (!attached && nodeRootHost) {
          var _nodeRoot2, _nodeRootHost2, _nodeRootHost2$ownerD;
          nodeRoot = getRootNode(nodeRootHost);
          nodeRootHost = (_nodeRoot2 = nodeRoot) === null || _nodeRoot2 === void 0 ? void 0 : _nodeRoot2.host;
          attached = !!((_nodeRootHost2 = nodeRootHost) !== null && _nodeRootHost2 !== void 0 && (_nodeRootHost2$ownerD = _nodeRootHost2.ownerDocument) !== null && _nodeRootHost2$ownerD !== void 0 && _nodeRootHost2$ownerD.contains(nodeRootHost));
        }
      }
      return attached;
    };
    isZeroArea = function isZeroArea2(node) {
      var _node$getBoundingClie = node.getBoundingClientRect(), width = _node$getBoundingClie.width, height = _node$getBoundingClie.height;
      return width === 0 && height === 0;
    };
    isHidden = function isHidden2(node, _ref) {
      var displayCheck = _ref.displayCheck, getShadowRoot = _ref.getShadowRoot;
      if (getComputedStyle(node).visibility === "hidden") {
        return true;
      }
      var isDirectSummary = matches.call(node, "details>summary:first-of-type");
      var nodeUnderDetails = isDirectSummary ? node.parentElement : node;
      if (matches.call(nodeUnderDetails, "details:not([open]) *")) {
        return true;
      }
      if (!displayCheck || displayCheck === "full" || displayCheck === "legacy-full") {
        if (typeof getShadowRoot === "function") {
          var originalNode = node;
          while (node) {
            var parentElement = node.parentElement;
            var rootNode = getRootNode(node);
            if (parentElement && !parentElement.shadowRoot && getShadowRoot(parentElement) === true) {
              return isZeroArea(node);
            } else if (node.assignedSlot) {
              node = node.assignedSlot;
            } else if (!parentElement && rootNode !== node.ownerDocument) {
              node = rootNode.host;
            } else {
              node = parentElement;
            }
          }
          node = originalNode;
        }
        if (isNodeAttached(node)) {
          return !node.getClientRects().length;
        }
        if (displayCheck !== "legacy-full") {
          return true;
        }
      } else if (displayCheck === "non-zero-area") {
        return isZeroArea(node);
      }
      return false;
    };
    isDisabledFromFieldset = function isDisabledFromFieldset2(node) {
      if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(node.tagName)) {
        var parentNode = node.parentElement;
        while (parentNode) {
          if (parentNode.tagName === "FIELDSET" && parentNode.disabled) {
            for (var i = 0; i < parentNode.children.length; i++) {
              var child = parentNode.children.item(i);
              if (child.tagName === "LEGEND") {
                return matches.call(parentNode, "fieldset[disabled] *") ? true : !child.contains(node);
              }
            }
            return true;
          }
          parentNode = parentNode.parentElement;
        }
      }
      return false;
    };
    isNodeMatchingSelectorFocusable = function isNodeMatchingSelectorFocusable2(options2, node) {
      if (node.disabled || // we must do an inert look up to filter out any elements inside an inert ancestor
      //  because we're limited in the type of selectors we can use in JSDom (see related
      //  note related to `candidateSelectors`)
      isInert(node) || isHiddenInput(node) || isHidden(node, options2) || // For a details element with a summary, the summary element gets the focus
      isDetailsWithSummary(node) || isDisabledFromFieldset(node)) {
        return false;
      }
      return true;
    };
    isNodeMatchingSelectorTabbable = function isNodeMatchingSelectorTabbable2(options2, node) {
      if (isNonTabbableRadio(node) || getTabIndex(node) < 0 || !isNodeMatchingSelectorFocusable(options2, node)) {
        return false;
      }
      return true;
    };
    isValidShadowRootTabbable = function isValidShadowRootTabbable2(shadowHostNode) {
      var tabIndex = parseInt(shadowHostNode.getAttribute("tabindex"), 10);
      if (isNaN(tabIndex) || tabIndex >= 0) {
        return true;
      }
      return false;
    };
    sortByOrder = function sortByOrder2(candidates) {
      var regularTabbables = [];
      var orderedTabbables = [];
      candidates.forEach(function(item, i) {
        var isScope = !!item.scopeParent;
        var element2 = isScope ? item.scopeParent : item;
        var candidateTabindex = getSortOrderTabIndex(element2, isScope);
        var elements = isScope ? sortByOrder2(item.candidates) : element2;
        if (candidateTabindex === 0) {
          isScope ? regularTabbables.push.apply(regularTabbables, elements) : regularTabbables.push(element2);
        } else {
          orderedTabbables.push({
            documentOrder: i,
            tabIndex: candidateTabindex,
            item,
            isScope,
            content: elements
          });
        }
      });
      return orderedTabbables.sort(sortOrderedTabbables).reduce(function(acc, sortable) {
        sortable.isScope ? acc.push.apply(acc, sortable.content) : acc.push(sortable.content);
        return acc;
      }, []).concat(regularTabbables);
    };
    tabbable = function tabbable2(container, options2) {
      options2 = options2 || {};
      var candidates;
      if (options2.getShadowRoot) {
        candidates = getCandidatesIteratively([container], options2.includeContainer, {
          filter: isNodeMatchingSelectorTabbable.bind(null, options2),
          flatten: false,
          getShadowRoot: options2.getShadowRoot,
          shadowRootFilter: isValidShadowRootTabbable
        });
      } else {
        candidates = getCandidates(container, options2.includeContainer, isNodeMatchingSelectorTabbable.bind(null, options2));
      }
      return sortByOrder(candidates);
    };
    focusable = function focusable2(container, options2) {
      options2 = options2 || {};
      var candidates;
      if (options2.getShadowRoot) {
        candidates = getCandidatesIteratively([container], options2.includeContainer, {
          filter: isNodeMatchingSelectorFocusable.bind(null, options2),
          flatten: true,
          getShadowRoot: options2.getShadowRoot
        });
      } else {
        candidates = getCandidates(container, options2.includeContainer, isNodeMatchingSelectorFocusable.bind(null, options2));
      }
      return candidates;
    };
    isTabbable = function isTabbable2(node, options2) {
      options2 = options2 || {};
      if (!node) {
        throw new Error("No node provided");
      }
      if (matches.call(node, candidateSelector) === false) {
        return false;
      }
      return isNodeMatchingSelectorTabbable(options2, node);
    };
    focusableCandidateSelector = /* @__PURE__ */ candidateSelectors.concat("iframe").join(",");
    isFocusable = function isFocusable2(node, options2) {
      options2 = options2 || {};
      if (!node) {
        throw new Error("No node provided");
      }
      if (matches.call(node, focusableCandidateSelector) === false) {
        return false;
      }
      return isNodeMatchingSelectorFocusable(options2, node);
    };
    activeFocusTraps = {
      activateTrap: function activateTrap(trapStack, trap) {
        if (trapStack.length > 0) {
          var activeTrap = trapStack[trapStack.length - 1];
          if (activeTrap !== trap) {
            activeTrap.pause();
          }
        }
        var trapIndex = trapStack.indexOf(trap);
        if (trapIndex === -1) {
          trapStack.push(trap);
        } else {
          trapStack.splice(trapIndex, 1);
          trapStack.push(trap);
        }
      },
      deactivateTrap: function deactivateTrap(trapStack, trap) {
        var trapIndex = trapStack.indexOf(trap);
        if (trapIndex !== -1) {
          trapStack.splice(trapIndex, 1);
        }
        if (trapStack.length > 0) {
          trapStack[trapStack.length - 1].unpause();
        }
      }
    };
    isSelectableInput = function isSelectableInput2(node) {
      return node.tagName && node.tagName.toLowerCase() === "input" && typeof node.select === "function";
    };
    isEscapeEvent = function isEscapeEvent2(e) {
      return (e === null || e === void 0 ? void 0 : e.key) === "Escape" || (e === null || e === void 0 ? void 0 : e.key) === "Esc" || (e === null || e === void 0 ? void 0 : e.keyCode) === 27;
    };
    isTabEvent = function isTabEvent2(e) {
      return (e === null || e === void 0 ? void 0 : e.key) === "Tab" || (e === null || e === void 0 ? void 0 : e.keyCode) === 9;
    };
    isKeyForward = function isKeyForward2(e) {
      return isTabEvent(e) && !e.shiftKey;
    };
    isKeyBackward = function isKeyBackward2(e) {
      return isTabEvent(e) && e.shiftKey;
    };
    delay = function delay2(fn) {
      return setTimeout(fn, 0);
    };
    findIndex = function findIndex2(arr, fn) {
      var idx = -1;
      arr.every(function(value, i) {
        if (fn(value)) {
          idx = i;
          return false;
        }
        return true;
      });
      return idx;
    };
    valueOrHandler = function valueOrHandler2(value) {
      for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        params[_key - 1] = arguments[_key];
      }
      return typeof value === "function" ? value.apply(void 0, params) : value;
    };
    getActualTarget = function getActualTarget2(event) {
      return event.target.shadowRoot && typeof event.composedPath === "function" ? event.composedPath()[0] : event.target;
    };
    internalTrapStack = [];
    createFocusTrap = function createFocusTrap2(elements, userOptions) {
      var doc = (userOptions === null || userOptions === void 0 ? void 0 : userOptions.document) || document;
      var trapStack = (userOptions === null || userOptions === void 0 ? void 0 : userOptions.trapStack) || internalTrapStack;
      var config = _objectSpread2({
        returnFocusOnDeactivate: true,
        escapeDeactivates: true,
        delayInitialFocus: true,
        isKeyForward,
        isKeyBackward
      }, userOptions);
      var state = {
        // containers given to createFocusTrap()
        // @type {Array<HTMLElement>}
        containers: [],
        // list of objects identifying tabbable nodes in `containers` in the trap
        // NOTE: it's possible that a group has no tabbable nodes if nodes get removed while the trap
        //  is active, but the trap should never get to a state where there isn't at least one group
        //  with at least one tabbable node in it (that would lead to an error condition that would
        //  result in an error being thrown)
        // @type {Array<{
        //   container: HTMLElement,
        //   tabbableNodes: Array<HTMLElement>, // empty if none
        //   focusableNodes: Array<HTMLElement>, // empty if none
        //   posTabIndexesFound: boolean,
        //   firstTabbableNode: HTMLElement|undefined,
        //   lastTabbableNode: HTMLElement|undefined,
        //   firstDomTabbableNode: HTMLElement|undefined,
        //   lastDomTabbableNode: HTMLElement|undefined,
        //   nextTabbableNode: (node: HTMLElement, forward: boolean) => HTMLElement|undefined
        // }>}
        containerGroups: [],
        // same order/length as `containers` list
        // references to objects in `containerGroups`, but only those that actually have
        //  tabbable nodes in them
        // NOTE: same order as `containers` and `containerGroups`, but __not necessarily__
        //  the same length
        tabbableGroups: [],
        nodeFocusedBeforeActivation: null,
        mostRecentlyFocusedNode: null,
        active: false,
        paused: false,
        // timer ID for when delayInitialFocus is true and initial focus in this trap
        //  has been delayed during activation
        delayInitialFocusTimer: void 0,
        // the most recent KeyboardEvent for the configured nav key (typically [SHIFT+]TAB), if any
        recentNavEvent: void 0
      };
      var trap;
      var getOption = function getOption2(configOverrideOptions, optionName, configOptionName) {
        return configOverrideOptions && configOverrideOptions[optionName] !== void 0 ? configOverrideOptions[optionName] : config[configOptionName || optionName];
      };
      var findContainerIndex = function findContainerIndex2(element2, event) {
        var composedPath = typeof (event === null || event === void 0 ? void 0 : event.composedPath) === "function" ? event.composedPath() : void 0;
        return state.containerGroups.findIndex(function(_ref) {
          var container = _ref.container, tabbableNodes = _ref.tabbableNodes;
          return container.contains(element2) || // fall back to explicit tabbable search which will take into consideration any
          //  web components if the `tabbableOptions.getShadowRoot` option was used for
          //  the trap, enabling shadow DOM support in tabbable (`Node.contains()` doesn't
          //  look inside web components even if open)
          (composedPath === null || composedPath === void 0 ? void 0 : composedPath.includes(container)) || tabbableNodes.find(function(node) {
            return node === element2;
          });
        });
      };
      var getNodeForOption = function getNodeForOption2(optionName) {
        var optionValue = config[optionName];
        if (typeof optionValue === "function") {
          for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            params[_key2 - 1] = arguments[_key2];
          }
          optionValue = optionValue.apply(void 0, params);
        }
        if (optionValue === true) {
          optionValue = void 0;
        }
        if (!optionValue) {
          if (optionValue === void 0 || optionValue === false) {
            return optionValue;
          }
          throw new Error("`".concat(optionName, "` was specified but was not a node, or did not return a node"));
        }
        var node = optionValue;
        if (typeof optionValue === "string") {
          node = doc.querySelector(optionValue);
          if (!node) {
            throw new Error("`".concat(optionName, "` as selector refers to no known node"));
          }
        }
        return node;
      };
      var getInitialFocusNode = function getInitialFocusNode2() {
        var node = getNodeForOption("initialFocus");
        if (node === false) {
          return false;
        }
        if (node === void 0 || !isFocusable(node, config.tabbableOptions)) {
          if (findContainerIndex(doc.activeElement) >= 0) {
            node = doc.activeElement;
          } else {
            var firstTabbableGroup = state.tabbableGroups[0];
            var firstTabbableNode = firstTabbableGroup && firstTabbableGroup.firstTabbableNode;
            node = firstTabbableNode || getNodeForOption("fallbackFocus");
          }
        }
        if (!node) {
          throw new Error("Your focus-trap needs to have at least one focusable element");
        }
        return node;
      };
      var updateTabbableNodes = function updateTabbableNodes2() {
        state.containerGroups = state.containers.map(function(container) {
          var tabbableNodes = tabbable(container, config.tabbableOptions);
          var focusableNodes = focusable(container, config.tabbableOptions);
          var firstTabbableNode = tabbableNodes.length > 0 ? tabbableNodes[0] : void 0;
          var lastTabbableNode = tabbableNodes.length > 0 ? tabbableNodes[tabbableNodes.length - 1] : void 0;
          var firstDomTabbableNode = focusableNodes.find(function(node) {
            return isTabbable(node);
          });
          var lastDomTabbableNode = focusableNodes.slice().reverse().find(function(node) {
            return isTabbable(node);
          });
          var posTabIndexesFound = !!tabbableNodes.find(function(node) {
            return getTabIndex(node) > 0;
          });
          return {
            container,
            tabbableNodes,
            focusableNodes,
            /** True if at least one node with positive `tabindex` was found in this container. */
            posTabIndexesFound,
            /** First tabbable node in container, __tabindex__ order; `undefined` if none. */
            firstTabbableNode,
            /** Last tabbable node in container, __tabindex__ order; `undefined` if none. */
            lastTabbableNode,
            // NOTE: DOM order is NOT NECESSARILY "document position" order, but figuring that out
            //  would require more than just https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
            //  because that API doesn't work with Shadow DOM as well as it should (@see
            //  https://github.com/whatwg/dom/issues/320) and since this first/last is only needed, so far,
            //  to address an edge case related to positive tabindex support, this seems like a much easier,
            //  "close enough most of the time" alternative for positive tabindexes which should generally
            //  be avoided anyway...
            /** First tabbable node in container, __DOM__ order; `undefined` if none. */
            firstDomTabbableNode,
            /** Last tabbable node in container, __DOM__ order; `undefined` if none. */
            lastDomTabbableNode,
            /**
             * Finds the __tabbable__ node that follows the given node in the specified direction,
             *  in this container, if any.
             * @param {HTMLElement} node
             * @param {boolean} [forward] True if going in forward tab order; false if going
             *  in reverse.
             * @returns {HTMLElement|undefined} The next tabbable node, if any.
             */
            nextTabbableNode: function nextTabbableNode(node) {
              var forward2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
              var nodeIdx = tabbableNodes.indexOf(node);
              if (nodeIdx < 0) {
                if (forward2) {
                  return focusableNodes.slice(focusableNodes.indexOf(node) + 1).find(function(el) {
                    return isTabbable(el);
                  });
                }
                return focusableNodes.slice(0, focusableNodes.indexOf(node)).reverse().find(function(el) {
                  return isTabbable(el);
                });
              }
              return tabbableNodes[nodeIdx + (forward2 ? 1 : -1)];
            }
          };
        });
        state.tabbableGroups = state.containerGroups.filter(function(group) {
          return group.tabbableNodes.length > 0;
        });
        if (state.tabbableGroups.length <= 0 && !getNodeForOption("fallbackFocus")) {
          throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
        }
        if (state.containerGroups.find(function(g) {
          return g.posTabIndexesFound;
        }) && state.containerGroups.length > 1) {
          throw new Error("At least one node with a positive tabindex was found in one of your focus-trap's multiple containers. Positive tabindexes are only supported in single-container focus-traps.");
        }
      };
      var getActiveElement = function getActiveElement2(el) {
        var activeElement = el.activeElement;
        if (!activeElement) {
          return;
        }
        if (activeElement.shadowRoot && activeElement.shadowRoot.activeElement !== null) {
          return getActiveElement2(activeElement.shadowRoot);
        }
        return activeElement;
      };
      var tryFocus = function tryFocus2(node) {
        if (node === false) {
          return;
        }
        if (node === getActiveElement(document)) {
          return;
        }
        if (!node || !node.focus) {
          tryFocus2(getInitialFocusNode());
          return;
        }
        node.focus({
          preventScroll: !!config.preventScroll
        });
        state.mostRecentlyFocusedNode = node;
        if (isSelectableInput(node)) {
          node.select();
        }
      };
      var getReturnFocusNode = function getReturnFocusNode2(previousActiveElement) {
        var node = getNodeForOption("setReturnFocus", previousActiveElement);
        return node ? node : node === false ? false : previousActiveElement;
      };
      var findNextNavNode = function findNextNavNode2(_ref2) {
        var target = _ref2.target, event = _ref2.event, _ref2$isBackward = _ref2.isBackward, isBackward = _ref2$isBackward === void 0 ? false : _ref2$isBackward;
        target = target || getActualTarget(event);
        updateTabbableNodes();
        var destinationNode = null;
        if (state.tabbableGroups.length > 0) {
          var containerIndex = findContainerIndex(target, event);
          var containerGroup = containerIndex >= 0 ? state.containerGroups[containerIndex] : void 0;
          if (containerIndex < 0) {
            if (isBackward) {
              destinationNode = state.tabbableGroups[state.tabbableGroups.length - 1].lastTabbableNode;
            } else {
              destinationNode = state.tabbableGroups[0].firstTabbableNode;
            }
          } else if (isBackward) {
            var startOfGroupIndex = findIndex(state.tabbableGroups, function(_ref3) {
              var firstTabbableNode = _ref3.firstTabbableNode;
              return target === firstTabbableNode;
            });
            if (startOfGroupIndex < 0 && (containerGroup.container === target || isFocusable(target, config.tabbableOptions) && !isTabbable(target, config.tabbableOptions) && !containerGroup.nextTabbableNode(target, false))) {
              startOfGroupIndex = containerIndex;
            }
            if (startOfGroupIndex >= 0) {
              var destinationGroupIndex = startOfGroupIndex === 0 ? state.tabbableGroups.length - 1 : startOfGroupIndex - 1;
              var destinationGroup = state.tabbableGroups[destinationGroupIndex];
              destinationNode = getTabIndex(target) >= 0 ? destinationGroup.lastTabbableNode : destinationGroup.lastDomTabbableNode;
            } else if (!isTabEvent(event)) {
              destinationNode = containerGroup.nextTabbableNode(target, false);
            }
          } else {
            var lastOfGroupIndex = findIndex(state.tabbableGroups, function(_ref4) {
              var lastTabbableNode = _ref4.lastTabbableNode;
              return target === lastTabbableNode;
            });
            if (lastOfGroupIndex < 0 && (containerGroup.container === target || isFocusable(target, config.tabbableOptions) && !isTabbable(target, config.tabbableOptions) && !containerGroup.nextTabbableNode(target))) {
              lastOfGroupIndex = containerIndex;
            }
            if (lastOfGroupIndex >= 0) {
              var _destinationGroupIndex = lastOfGroupIndex === state.tabbableGroups.length - 1 ? 0 : lastOfGroupIndex + 1;
              var _destinationGroup = state.tabbableGroups[_destinationGroupIndex];
              destinationNode = getTabIndex(target) >= 0 ? _destinationGroup.firstTabbableNode : _destinationGroup.firstDomTabbableNode;
            } else if (!isTabEvent(event)) {
              destinationNode = containerGroup.nextTabbableNode(target);
            }
          }
        } else {
          destinationNode = getNodeForOption("fallbackFocus");
        }
        return destinationNode;
      };
      var checkPointerDown = function checkPointerDown2(e) {
        var target = getActualTarget(e);
        if (findContainerIndex(target, e) >= 0) {
          return;
        }
        if (valueOrHandler(config.clickOutsideDeactivates, e)) {
          trap.deactivate({
            // NOTE: by setting `returnFocus: false`, deactivate() will do nothing,
            //  which will result in the outside click setting focus to the node
            //  that was clicked (and if not focusable, to "nothing"); by setting
            //  `returnFocus: true`, we'll attempt to re-focus the node originally-focused
            //  on activation (or the configured `setReturnFocus` node), whether the
            //  outside click was on a focusable node or not
            returnFocus: config.returnFocusOnDeactivate
          });
          return;
        }
        if (valueOrHandler(config.allowOutsideClick, e)) {
          return;
        }
        e.preventDefault();
      };
      var checkFocusIn = function checkFocusIn2(event) {
        var target = getActualTarget(event);
        var targetContained = findContainerIndex(target, event) >= 0;
        if (targetContained || target instanceof Document) {
          if (targetContained) {
            state.mostRecentlyFocusedNode = target;
          }
        } else {
          event.stopImmediatePropagation();
          var nextNode;
          var navAcrossContainers = true;
          if (state.mostRecentlyFocusedNode) {
            if (getTabIndex(state.mostRecentlyFocusedNode) > 0) {
              var mruContainerIdx = findContainerIndex(state.mostRecentlyFocusedNode);
              var tabbableNodes = state.containerGroups[mruContainerIdx].tabbableNodes;
              if (tabbableNodes.length > 0) {
                var mruTabIdx = tabbableNodes.findIndex(function(node) {
                  return node === state.mostRecentlyFocusedNode;
                });
                if (mruTabIdx >= 0) {
                  if (config.isKeyForward(state.recentNavEvent)) {
                    if (mruTabIdx + 1 < tabbableNodes.length) {
                      nextNode = tabbableNodes[mruTabIdx + 1];
                      navAcrossContainers = false;
                    }
                  } else {
                    if (mruTabIdx - 1 >= 0) {
                      nextNode = tabbableNodes[mruTabIdx - 1];
                      navAcrossContainers = false;
                    }
                  }
                }
              }
            } else {
              if (!state.containerGroups.some(function(g) {
                return g.tabbableNodes.some(function(n) {
                  return getTabIndex(n) > 0;
                });
              })) {
                navAcrossContainers = false;
              }
            }
          } else {
            navAcrossContainers = false;
          }
          if (navAcrossContainers) {
            nextNode = findNextNavNode({
              // move FROM the MRU node, not event-related node (which will be the node that is
              //  outside the trap causing the focus escape we're trying to fix)
              target: state.mostRecentlyFocusedNode,
              isBackward: config.isKeyBackward(state.recentNavEvent)
            });
          }
          if (nextNode) {
            tryFocus(nextNode);
          } else {
            tryFocus(state.mostRecentlyFocusedNode || getInitialFocusNode());
          }
        }
        state.recentNavEvent = void 0;
      };
      var checkKeyNav = function checkKeyNav2(event) {
        var isBackward = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
        state.recentNavEvent = event;
        var destinationNode = findNextNavNode({
          event,
          isBackward
        });
        if (destinationNode) {
          if (isTabEvent(event)) {
            event.preventDefault();
          }
          tryFocus(destinationNode);
        }
      };
      var checkKey = function checkKey2(event) {
        if (isEscapeEvent(event) && valueOrHandler(config.escapeDeactivates, event) !== false) {
          event.preventDefault();
          trap.deactivate();
          return;
        }
        if (config.isKeyForward(event) || config.isKeyBackward(event)) {
          checkKeyNav(event, config.isKeyBackward(event));
        }
      };
      var checkClick = function checkClick2(e) {
        var target = getActualTarget(e);
        if (findContainerIndex(target, e) >= 0) {
          return;
        }
        if (valueOrHandler(config.clickOutsideDeactivates, e)) {
          return;
        }
        if (valueOrHandler(config.allowOutsideClick, e)) {
          return;
        }
        e.preventDefault();
        e.stopImmediatePropagation();
      };
      var addListeners = function addListeners2() {
        if (!state.active) {
          return;
        }
        activeFocusTraps.activateTrap(trapStack, trap);
        state.delayInitialFocusTimer = config.delayInitialFocus ? delay(function() {
          tryFocus(getInitialFocusNode());
        }) : tryFocus(getInitialFocusNode());
        doc.addEventListener("focusin", checkFocusIn, true);
        doc.addEventListener("mousedown", checkPointerDown, {
          capture: true,
          passive: false
        });
        doc.addEventListener("touchstart", checkPointerDown, {
          capture: true,
          passive: false
        });
        doc.addEventListener("click", checkClick, {
          capture: true,
          passive: false
        });
        doc.addEventListener("keydown", checkKey, {
          capture: true,
          passive: false
        });
        return trap;
      };
      var removeListeners = function removeListeners2() {
        if (!state.active) {
          return;
        }
        doc.removeEventListener("focusin", checkFocusIn, true);
        doc.removeEventListener("mousedown", checkPointerDown, true);
        doc.removeEventListener("touchstart", checkPointerDown, true);
        doc.removeEventListener("click", checkClick, true);
        doc.removeEventListener("keydown", checkKey, true);
        return trap;
      };
      var checkDomRemoval = function checkDomRemoval2(mutations) {
        var isFocusedNodeRemoved = mutations.some(function(mutation) {
          var removedNodes = Array.from(mutation.removedNodes);
          return removedNodes.some(function(node) {
            return node === state.mostRecentlyFocusedNode;
          });
        });
        if (isFocusedNodeRemoved) {
          tryFocus(getInitialFocusNode());
        }
      };
      var mutationObserver = typeof window !== "undefined" && "MutationObserver" in window ? new MutationObserver(checkDomRemoval) : void 0;
      var updateObservedNodes = function updateObservedNodes2() {
        if (!mutationObserver) {
          return;
        }
        mutationObserver.disconnect();
        if (state.active && !state.paused) {
          state.containers.map(function(container) {
            mutationObserver.observe(container, {
              subtree: true,
              childList: true
            });
          });
        }
      };
      trap = {
        get active() {
          return state.active;
        },
        get paused() {
          return state.paused;
        },
        activate: function activate(activateOptions) {
          if (state.active) {
            return this;
          }
          var onActivate = getOption(activateOptions, "onActivate");
          var onPostActivate = getOption(activateOptions, "onPostActivate");
          var checkCanFocusTrap = getOption(activateOptions, "checkCanFocusTrap");
          if (!checkCanFocusTrap) {
            updateTabbableNodes();
          }
          state.active = true;
          state.paused = false;
          state.nodeFocusedBeforeActivation = doc.activeElement;
          onActivate === null || onActivate === void 0 || onActivate();
          var finishActivation = function finishActivation2() {
            if (checkCanFocusTrap) {
              updateTabbableNodes();
            }
            addListeners();
            updateObservedNodes();
            onPostActivate === null || onPostActivate === void 0 || onPostActivate();
          };
          if (checkCanFocusTrap) {
            checkCanFocusTrap(state.containers.concat()).then(finishActivation, finishActivation);
            return this;
          }
          finishActivation();
          return this;
        },
        deactivate: function deactivate(deactivateOptions) {
          if (!state.active) {
            return this;
          }
          var options2 = _objectSpread2({
            onDeactivate: config.onDeactivate,
            onPostDeactivate: config.onPostDeactivate,
            checkCanReturnFocus: config.checkCanReturnFocus
          }, deactivateOptions);
          clearTimeout(state.delayInitialFocusTimer);
          state.delayInitialFocusTimer = void 0;
          removeListeners();
          state.active = false;
          state.paused = false;
          updateObservedNodes();
          activeFocusTraps.deactivateTrap(trapStack, trap);
          var onDeactivate = getOption(options2, "onDeactivate");
          var onPostDeactivate = getOption(options2, "onPostDeactivate");
          var checkCanReturnFocus = getOption(options2, "checkCanReturnFocus");
          var returnFocus = getOption(options2, "returnFocus", "returnFocusOnDeactivate");
          onDeactivate === null || onDeactivate === void 0 || onDeactivate();
          var finishDeactivation = function finishDeactivation2() {
            delay(function() {
              if (returnFocus) {
                tryFocus(getReturnFocusNode(state.nodeFocusedBeforeActivation));
              }
              onPostDeactivate === null || onPostDeactivate === void 0 || onPostDeactivate();
            });
          };
          if (returnFocus && checkCanReturnFocus) {
            checkCanReturnFocus(getReturnFocusNode(state.nodeFocusedBeforeActivation)).then(finishDeactivation, finishDeactivation);
            return this;
          }
          finishDeactivation();
          return this;
        },
        pause: function pause(pauseOptions) {
          if (state.paused || !state.active) {
            return this;
          }
          var onPause = getOption(pauseOptions, "onPause");
          var onPostPause = getOption(pauseOptions, "onPostPause");
          state.paused = true;
          onPause === null || onPause === void 0 || onPause();
          removeListeners();
          updateObservedNodes();
          onPostPause === null || onPostPause === void 0 || onPostPause();
          return this;
        },
        unpause: function unpause(unpauseOptions) {
          if (!state.paused || !state.active) {
            return this;
          }
          var onUnpause = getOption(unpauseOptions, "onUnpause");
          var onPostUnpause = getOption(unpauseOptions, "onPostUnpause");
          state.paused = false;
          onUnpause === null || onUnpause === void 0 || onUnpause();
          updateTabbableNodes();
          addListeners();
          updateObservedNodes();
          onPostUnpause === null || onPostUnpause === void 0 || onPostUnpause();
          return this;
        },
        updateContainerElements: function updateContainerElements(containerElements) {
          var elementsAsArray = [].concat(containerElements).filter(Boolean);
          state.containers = elementsAsArray.map(function(element2) {
            return typeof element2 === "string" ? doc.querySelector(element2) : element2;
          });
          if (state.active) {
            updateTabbableNodes();
          }
          updateObservedNodes();
          return this;
        }
      };
      trap.updateContainerElements(elements);
      return trap;
    };
    useFocusTrap = (node, config = {}) => {
      let unsub = noop2;
      const update = (config2) => {
        unsub();
        const trap = createFocusTrap(node, {
          returnFocusOnDeactivate: false,
          allowOutsideClick: true,
          escapeDeactivates: false,
          clickOutsideDeactivates: false,
          ...config2
        });
        unsub = trap.deactivate;
        trap.activate();
      };
      update(config);
      return { destroy: unsub, update };
    };
    useModal = (node, config) => {
      let unsubInteractOutside = noop2;
      function update(config2) {
        unsubInteractOutside();
        const { onClose, shouldCloseOnInteractOutside, closeOnInteractOutside } = config2;
        function closeModal() {
          onClose?.();
        }
        function onInteractOutsideStart(e) {
          const target = e.target;
          if (!isElement$1(target))
            return;
          e.stopImmediatePropagation();
        }
        function onInteractOutside(e) {
          if (!shouldCloseOnInteractOutside?.(e))
            return;
          e.stopImmediatePropagation();
          closeModal();
        }
        unsubInteractOutside = useInteractOutside(node, {
          onInteractOutsideStart,
          onInteractOutside: closeOnInteractOutside ? onInteractOutside : void 0,
          enabled: closeOnInteractOutside
        }).destroy;
      }
      update(config);
      return {
        update,
        destroy() {
          unsubInteractOutside();
        }
      };
    };
    layers$1 = /* @__PURE__ */ new Set();
    usePreventTextSelectionOverflow = (node, config = {}) => {
      layers$1.add(node);
      let unsubEvents = noop2;
      let unsubSelectionLock = noop2;
      const documentObj = getOwnerDocument(node);
      let isPointerDownInside = false;
      const update = (config2) => {
        unsubEvents();
        resetSelectionLock();
        const options2 = { enabled: true, ...config2 };
        const enabled = isReadable(options2.enabled) ? options2.enabled : withGet(readable(options2.enabled));
        const onPointerDown = (e) => {
          const target = e.target;
          if (!isHighestLayer$1(node) || !isHTMLElement$1(target) || !enabled.get())
            return;
          isPointerDownInside = isOrContainsTarget(node, target);
          if (isPointerDownInside) {
            unsubSelectionLock = preventTextSelectionOverflow(node);
          }
        };
        unsubEvents = executeCallbacks(addEventListener(documentObj, "pointerdown", onPointerDown, true), addEventListener(documentObj, "pointerup", resetSelectionLock, true));
      };
      const resetSelectionLock = () => {
        unsubSelectionLock();
        unsubSelectionLock = noop2;
        isPointerDownInside = false;
      };
      update(config);
      return {
        destroy() {
          layers$1.delete(node);
          unsubEvents();
          resetSelectionLock();
        },
        update
      };
    };
    preventTextSelectionOverflow = (node) => {
      const body2 = document.body;
      const originalBodyUserSelect = getUserSelect(body2);
      const originalNodeUserSelect = getUserSelect(node);
      setUserSelect(body2, "none");
      setUserSelect(node, "text");
      return () => {
        setUserSelect(body2, originalBodyUserSelect);
        setUserSelect(node, originalNodeUserSelect);
      };
    };
    getUserSelect = (node) => node.style.userSelect || node.style.webkitUserSelect;
    setUserSelect = (node, value) => {
      node.style.userSelect = value;
      node.style.webkitUserSelect = value;
    };
    isHighestLayer$1 = (node) => [...layers$1].at(-1) === node;
    defaultConfig = {
      floating: {},
      focusTrap: {},
      modal: {},
      escapeKeydown: {},
      portal: "body",
      preventTextSelectionOverflow: {}
    };
    usePopper = (popperElement, args) => {
      popperElement.dataset.escapee = "";
      const { anchorElement, open, options: options2 } = args;
      if (!anchorElement || !open || !options2) {
        return { destroy: noop2 };
      }
      const opts = { ...defaultConfig, ...options2 };
      const callbacks = [];
      if (opts.portal !== null) {
        callbacks.push(usePortal(popperElement, opts.portal).destroy);
      }
      callbacks.push(useFloating(anchorElement, popperElement, opts.floating).destroy);
      if (opts.focusTrap !== null) {
        callbacks.push(useFocusTrap(popperElement, {
          fallbackFocus: popperElement,
          ...opts.focusTrap
        }).destroy);
      }
      if (opts.modal !== null) {
        callbacks.push(useModal(popperElement, {
          onClose: () => {
            if (isHTMLElement$1(anchorElement)) {
              open.set(false);
              anchorElement.focus();
            }
          },
          shouldCloseOnInteractOutside: (e) => {
            if (e.defaultPrevented)
              return false;
            if (isHTMLElement$1(anchorElement) && anchorElement.contains(e.target)) {
              return false;
            }
            return true;
          },
          ...opts.modal
        }).destroy);
      }
      if (opts.escapeKeydown !== null) {
        callbacks.push(useEscapeKeydown(popperElement, {
          handler: () => {
            open.set(false);
          },
          ...opts.escapeKeydown
        }).destroy);
      }
      if (opts.preventTextSelectionOverflow !== null) {
        callbacks.push(usePreventTextSelectionOverflow(popperElement).destroy);
      }
      const unsubscribe = executeCallbacks(...callbacks);
      return {
        destroy() {
          unsubscribe();
        }
      };
    };
    usePortal = (el, target = "body") => {
      let targetEl;
      if (!isHTMLElement$1(target) && typeof target !== "string") {
        return {
          destroy: noop2
        };
      }
      async function update(newTarget = "body") {
        target = newTarget;
        if (typeof target === "string") {
          targetEl = document.querySelector(target);
          if (targetEl === null) {
            await tick();
            targetEl = document.querySelector(target);
          }
          if (targetEl === null) {
            throw new Error(`No element found matching css selector: "${target}"`);
          }
        } else if (target instanceof HTMLElement) {
          targetEl = target;
        } else {
          throw new TypeError(`Unknown portal target type: ${target === null ? "null" : typeof target}. Allowed types: string (CSS selector) or HTMLElement.`);
        }
        el.dataset.portal = "";
        targetEl.appendChild(el);
        el.hidden = false;
      }
      function destroy() {
        el.remove();
      }
      update(target);
      return {
        update,
        destroy
      };
    };
    layers = /* @__PURE__ */ new Set();
    useInteractOutside = (node, config = {}) => {
      let unsubEvents = noop2;
      let unsubPointerDown = noop2;
      let unsubPointerUp = noop2;
      let unsubResetInterceptedEvents = noop2;
      layers.add(node);
      const documentObj = getOwnerDocument(node);
      let isPointerDown = false;
      let isPointerDownInside = false;
      const interceptedEvents = {
        pointerdown: false,
        pointerup: false,
        mousedown: false,
        mouseup: false,
        touchstart: false,
        touchend: false,
        click: false
      };
      const resetInterceptedEvents = () => {
        for (const eventType in interceptedEvents) {
          interceptedEvents[eventType] = false;
        }
      };
      const isAnyEventIntercepted = () => {
        for (const isIntercepted of Object.values(interceptedEvents)) {
          if (isIntercepted)
            return true;
        }
        return false;
      };
      const setupCapturePhaseHandlerAndMarkAsIntercepted = (eventType, handler2) => {
        return addEventListener(documentObj, eventType, (e) => {
          interceptedEvents[eventType] = true;
          handler2?.(e);
        }, true);
      };
      const setupBubblePhaseHandlerAndMarkAsNotIntercepted = (eventType, handler2) => {
        return addEventListener(documentObj, eventType, (e) => {
          interceptedEvents[eventType] = false;
          handler2?.(e);
        });
      };
      function update(config2) {
        unsubEvents();
        unsubPointerDown();
        unsubPointerUp();
        unsubResetInterceptedEvents();
        resetInterceptedEvents();
        const { onInteractOutside, onInteractOutsideStart, enabled } = { enabled: true, ...config2 };
        if (!enabled)
          return;
        let wasTopLayerInPointerDownCapture = false;
        const onPointerDownDebounced = debounce((e) => {
          if (!wasTopLayerInPointerDownCapture || isAnyEventIntercepted())
            return;
          if (onInteractOutside && isValidEvent(e, node))
            onInteractOutsideStart?.(e);
          const target = e.target;
          if (isElement$1(target) && isOrContainsTarget(node, target)) {
            isPointerDownInside = true;
          }
          isPointerDown = true;
        }, 10);
        unsubPointerDown = onPointerDownDebounced.destroy;
        const onPointerUpDebounced = debounce((e) => {
          if (wasTopLayerInPointerDownCapture && !isAnyEventIntercepted() && shouldTriggerInteractOutside(e)) {
            onInteractOutside?.(e);
          }
          resetPointerState();
        }, 10);
        unsubPointerUp = onPointerUpDebounced.destroy;
        const resetInterceptedEventsDebounced = debounce(resetInterceptedEvents, 20);
        unsubResetInterceptedEvents = resetInterceptedEventsDebounced.destroy;
        const markTopLayerInPointerDown = () => {
          wasTopLayerInPointerDownCapture = isHighestLayer(node);
        };
        unsubEvents = executeCallbacks(
          /** Capture Events For Interaction Start */
          setupCapturePhaseHandlerAndMarkAsIntercepted("pointerdown", markTopLayerInPointerDown),
          setupCapturePhaseHandlerAndMarkAsIntercepted("mousedown", markTopLayerInPointerDown),
          setupCapturePhaseHandlerAndMarkAsIntercepted("touchstart", markTopLayerInPointerDown),
          /**
           * Intercepted events are reset only at the end of an interaction, allowing
           * interception at the start while still capturing the entire interaction.
           * Additionally, intercepted events are reset in the capture phase with `resetInterceptedEventsDebounced`,
           * accommodating events not invoked in the bubbling phase due to user interception.
           */
          setupCapturePhaseHandlerAndMarkAsIntercepted("pointerup", resetInterceptedEventsDebounced),
          setupCapturePhaseHandlerAndMarkAsIntercepted("mouseup", resetInterceptedEventsDebounced),
          setupCapturePhaseHandlerAndMarkAsIntercepted("touchend", resetInterceptedEventsDebounced),
          setupCapturePhaseHandlerAndMarkAsIntercepted("click", resetInterceptedEventsDebounced),
          /** Bubbling Events For Interaction Start */
          setupBubblePhaseHandlerAndMarkAsNotIntercepted("pointerdown", onPointerDownDebounced),
          setupBubblePhaseHandlerAndMarkAsNotIntercepted("mousedown", onPointerDownDebounced),
          setupBubblePhaseHandlerAndMarkAsNotIntercepted("touchstart", onPointerDownDebounced),
          /**
           * To effectively detect an end of an interaction, we must monitor all relevant events,
           * not just `click` events. This is because on touch devices, actions like pressing,
           * moving the finger, and lifting it off the screen may not trigger a `click` event,
           * but should still invoke `onPointerUp` to properly handle the interaction.
           */
          setupBubblePhaseHandlerAndMarkAsNotIntercepted("pointerup", onPointerUpDebounced),
          setupBubblePhaseHandlerAndMarkAsNotIntercepted("mouseup", onPointerUpDebounced),
          setupBubblePhaseHandlerAndMarkAsNotIntercepted("touchend", onPointerUpDebounced),
          setupBubblePhaseHandlerAndMarkAsNotIntercepted("click", onPointerUpDebounced)
        );
      }
      function shouldTriggerInteractOutside(e) {
        if (isPointerDown && !isPointerDownInside && isValidEvent(e, node)) {
          return true;
        }
        return false;
      }
      function resetPointerState() {
        isPointerDown = false;
        isPointerDownInside = false;
      }
      update(config);
      return {
        update,
        destroy() {
          unsubEvents();
          unsubPointerDown();
          unsubPointerUp();
          unsubResetInterceptedEvents();
          layers.delete(node);
        }
      };
    };
    INTERACTION_KEYS = [kbd.ARROW_LEFT, kbd.ESCAPE, kbd.ARROW_RIGHT, kbd.SHIFT, kbd.CAPS_LOCK, kbd.CONTROL, kbd.ALT, kbd.META, kbd.ENTER, kbd.F1, kbd.F2, kbd.F3, kbd.F4, kbd.F5, kbd.F6, kbd.F7, kbd.F8, kbd.F9, kbd.F10, kbd.F11, kbd.F12];
    defaults$1 = {
      positioning: {
        placement: "bottom",
        sameWidth: true
      },
      scrollAlignment: "nearest",
      loop: true,
      defaultOpen: false,
      closeOnOutsideClick: true,
      preventScroll: true,
      escapeBehavior: "close",
      forceVisible: false,
      portal: "body",
      builder: "listbox",
      disabled: false,
      required: false,
      name: void 0,
      typeahead: true,
      highlightOnHover: true,
      onOutsideClick: void 0,
      preventTextSelectionOverflow: true
    };
    listboxIdParts = ["trigger", "menu", "label"];
    defaults = {
      isDateDisabled: void 0,
      isDateUnavailable: void 0,
      value: void 0,
      preventDeselect: false,
      numberOfMonths: 1,
      pagedNavigation: false,
      weekStartsOn: 0,
      fixedWeeks: false,
      calendarLabel: "Event Date",
      locale: "en",
      minValue: void 0,
      maxValue: void 0,
      disabled: false,
      readonly: false,
      weekdayFormat: "narrow"
    };
    ({
      isDateDisabled: void 0,
      isDateUnavailable: void 0,
      value: void 0,
      positioning: {
        placement: "bottom"
      },
      escapeBehavior: "close",
      closeOnOutsideClick: true,
      onOutsideClick: void 0,
      preventScroll: false,
      forceVisible: false,
      locale: "en",
      granularity: void 0,
      disabled: false,
      readonly: false,
      minValue: void 0,
      maxValue: void 0,
      weekdayFormat: "narrow",
      ...omit(defaults, "isDateDisabled", "isDateUnavailable", "value", "locale", "disabled", "readonly", "minValue", "maxValue", "weekdayFormat")
    });
    defaultAttributes = {
      xmlns: "http://www.w3.org/2000/svg",
      width: 24,
      height: 24,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": 2,
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    };
  }
});

// .svelte-kit/output/server/entries/pages/_page.svelte.js
var page_svelte_exports = {};
__export(page_svelte_exports, {
  default: () => _page
});
function createSelect(props) {
  const listbox = createListbox({ ...props, builder: "select" });
  const selectedLabel = derived(listbox.states.selected, ($selected) => {
    if (Array.isArray($selected)) {
      return $selected.map((o) => o.label).join(", ");
    }
    return $selected?.label ?? "";
  });
  return {
    ...listbox,
    elements: {
      ...listbox.elements
    },
    states: {
      ...listbox.states,
      selectedLabel
    }
  };
}
function LogoWithName($$payload) {
  $$payload.out += `<svg class="h-[95px] w-[240px] sm:h-[145px] sm:w-[385px]" width="355" height="145" viewBox="0 0 1021 236" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M275.165 75.3559C275.165 72.9299 275.995 70.9507 277.655 69.4185C279.443 67.7586 281.677 66.9286 284.359 66.9286H337.221C349.607 66.9286 359.439 70.5677 366.717 77.8458C374.123 84.9963 377.825 94.5728 377.825 106.575C377.825 121.642 371.25 132.304 358.098 138.561V139.136C363.844 141.562 368.249 145.265 371.313 150.244C374.378 155.097 375.91 161.034 375.91 168.057V187.784C375.91 192.636 374.378 196.339 371.313 198.893C368.249 201.447 363.78 202.724 357.906 202.724V169.206C357.906 161.672 356.183 155.99 352.735 152.16C349.415 148.201 344.435 146.222 337.796 146.222H292.977V187.784C292.977 192.636 291.445 196.339 288.381 198.893C285.444 201.447 281.039 202.724 275.165 202.724V75.3559ZM336.646 130.708C343.669 130.708 349.224 128.538 353.31 124.196C357.523 119.855 359.63 113.917 359.63 106.384C359.63 98.7227 357.651 92.8491 353.693 88.7631C349.734 84.6771 344.052 82.6341 336.646 82.6341H292.977V130.708H336.646ZM402.727 80.1442C402.727 75.4198 404.324 71.7807 407.516 69.227C410.708 66.5455 415.113 65.2048 420.731 65.2048L467.082 176.484L463.443 185.486L464.783 186.061L513.815 65.2048C519.433 65.2048 523.839 66.5455 527.031 69.227C530.351 71.9084 532.011 75.6113 532.011 80.3357V202.724C520.136 202.724 514.198 197.808 514.198 187.976V107.342L519.178 94.1259L517.646 93.7429L474.934 197.552C474.296 199.085 473.275 200.298 471.87 201.192C470.465 202.213 468.997 202.724 467.465 202.724C465.805 202.724 464.273 202.277 462.868 201.383C461.463 200.489 460.442 199.212 459.804 197.552L417.092 93.5513L415.56 94.1259L420.54 107.15V187.976C420.54 192.828 419.008 196.531 415.943 199.085C413.006 201.511 408.601 202.724 402.727 202.724V80.1442ZM606.79 202.724C596.064 202.724 586.743 201.192 578.826 198.127C571.037 195.063 565.1 190.977 561.014 185.869C556.928 180.762 554.885 175.271 554.885 169.397C554.885 164.545 556.162 160.842 558.716 158.289C561.269 155.607 565.164 154.267 570.399 154.267C570.399 165.12 573.655 173.42 580.167 179.166C586.679 184.784 595.809 187.593 607.556 187.593C618.792 187.593 627.411 185.741 633.413 182.038C639.414 178.208 642.414 172.59 642.414 165.184C642.414 160.715 641.265 157.076 638.967 154.267C636.796 151.33 633.029 148.84 627.667 146.797C622.431 144.626 614.834 142.455 604.874 140.285C593.127 137.731 583.806 134.794 576.911 131.474C570.016 128.027 564.972 123.877 561.78 119.025C558.588 114.173 556.992 108.172 556.992 101.021C556.992 93.8706 558.971 87.6139 562.929 82.251C567.015 76.7605 572.761 72.5468 580.167 69.61C587.573 66.6732 596.192 65.2048 606.024 65.2048C615.345 65.2048 623.644 66.5455 630.923 69.227C638.328 71.7807 644.074 75.4836 648.16 80.3357C652.374 85.0602 654.481 90.423 654.481 96.4243C654.481 100.127 653.268 103.064 650.842 105.235C648.543 107.278 644.904 108.299 639.925 108.299C638.52 98.595 635.072 91.5084 629.582 87.0393C624.219 82.5703 616.366 80.3357 606.024 80.3357C596.064 80.3357 588.403 82.1234 583.04 85.6986C577.677 89.1461 574.996 94.0621 574.996 100.446C574.996 104.915 575.953 108.618 577.869 111.555C579.912 114.364 583.295 116.79 588.02 118.833C592.872 120.876 599.639 122.856 608.322 124.771C621.346 127.58 631.561 130.708 638.967 134.156C646.5 137.603 651.927 141.817 655.247 146.797C658.567 151.777 660.227 157.906 660.227 165.184C660.227 176.803 655.375 185.997 645.67 192.764C635.966 199.404 623.006 202.724 606.79 202.724ZM713.594 82.8256H666.86C666.86 72.2276 671.84 66.9286 681.799 66.9286H778.139C778.139 77.5266 773.16 82.8256 763.2 82.8256H731.597V187.784C731.597 192.636 730.065 196.339 727.001 198.893C723.936 201.447 719.467 202.724 713.594 202.724V82.8256ZM798.32 75.3559C798.32 72.9299 799.214 70.9507 801.002 69.4185C802.789 67.7586 804.96 66.9286 807.514 66.9286H892.362C892.362 72.2915 891.277 76.2498 889.106 78.8035C886.935 81.3572 883.551 82.6341 878.955 82.6341H816.324V125.537H869.953C869.953 130.9 868.867 134.858 866.697 137.412C864.526 139.966 861.206 141.242 856.737 141.242H816.324V185.294H882.977C887.446 185.294 890.766 186.571 892.936 189.125C895.107 191.679 896.192 195.637 896.192 201H807.514C804.96 201 802.789 200.234 801.002 198.702C799.214 197.042 798.32 194.999 798.32 192.573V75.3559ZM918.214 75.3559C918.214 72.9299 919.044 70.9507 920.704 69.4185C922.491 67.7586 924.726 66.9286 927.407 66.9286H980.27C992.656 66.9286 1002.49 70.5677 1009.77 77.8458C1017.17 84.9963 1020.87 94.5728 1020.87 106.575C1020.87 121.642 1014.3 132.304 1001.15 138.561V139.136C1006.89 141.562 1011.3 145.265 1014.36 150.244C1017.43 155.097 1018.96 161.034 1018.96 168.057V187.784C1018.96 192.636 1017.43 196.339 1014.36 198.893C1011.3 201.447 1006.83 202.724 1000.96 202.724V169.206C1000.96 161.672 999.231 155.99 995.784 152.16C992.464 148.201 987.484 146.222 980.844 146.222H936.026V187.784C936.026 192.636 934.494 196.339 931.43 198.893C928.493 201.447 924.088 202.724 918.214 202.724V75.3559ZM979.695 130.708C986.718 130.708 992.272 128.538 996.358 124.196C1000.57 119.855 1002.68 113.917 1002.68 106.384C1002.68 98.7227 1000.7 92.8491 996.741 88.7631C992.783 84.6771 987.101 82.6341 979.695 82.6341H936.026V130.708H979.695Z" fill="#282F2D"></path><path d="M148.75 137.311C148.75 149.969 151.859 162.342 157.683 172.867C163.506 183.392 171.784 191.595 181.468 196.439C191.153 201.283 201.809 202.55 212.09 200.081C222.371 197.611 231.815 191.516 239.227 182.565C246.639 173.615 251.687 162.211 253.732 149.796C255.777 137.382 254.727 124.513 250.716 112.819C246.705 101.124 239.911 91.1289 231.196 84.0965C222.48 77.0641 212.233 73.3106 201.75 73.3106C201.75 98.3041 201.75 112.317 201.75 137.311H148.75Z" stroke="#282F2D" stroke-width="8.51247"></path><path d="M254.75 137.311C254.75 172.657 231.048 201.311 201.809 201.311C172.571 201.311 146.75 172.657 146.75 137.311C146.75 101.964 172.571 73.3105 201.809 73.3105C231.048 73.3105 254.75 101.964 254.75 137.311Z" fill="#E1E9E5"></path><mask id="path-4-inside-1_44_35" fill="white"><path d="M233.897 179.084C225.039 188.198 213.711 193.247 201.974 193.31C190.237 193.373 178.87 188.448 169.942 179.429C161.014 170.41 155.117 157.897 153.325 144.167C151.533 130.437 153.964 116.401 160.176 104.614C166.388 92.8257 175.968 84.069 187.174 79.9361C198.38 75.8033 210.467 76.5691 221.237 82.0941C232.006 87.6191 240.742 97.5363 245.856 110.042C250.969 122.547 252.121 136.81 249.101 150.235L201.75 135.311L233.897 179.084Z"></path></mask><path d="M233.897 179.084C225.039 188.198 213.711 193.247 201.974 193.31C190.237 193.373 178.87 188.448 169.942 179.429C161.014 170.41 155.117 157.897 153.325 144.167C151.533 130.437 153.964 116.401 160.176 104.614C166.388 92.8257 175.968 84.069 187.174 79.9361C198.38 75.8033 210.467 76.5691 221.237 82.0941C232.006 87.6191 240.742 97.5363 245.856 110.042C250.969 122.547 252.121 136.81 249.101 150.235L201.75 135.311L233.897 179.084Z" fill="white" stroke="#282F2D" stroke-width="17.0249" mask="url(#path-4-inside-1_44_35)"></path><path d="M246.751 133.311C246.751 162.029 226.603 185.311 201.751 185.311C176.898 185.311 156.751 162.029 156.751 133.311C156.751 104.592 176.898 81.3105 201.751 81.3105C226.603 81.3105 246.751 104.592 246.751 133.311Z" fill="#E1E9E5"></path><mask id="path-6-inside-2_44_35" fill="white"><path d="M207.887 89.7582C215.819 91.0244 223.243 94.9338 229.219 100.992C235.195 107.05 239.455 114.985 241.46 123.793C243.466 132.601 243.127 141.887 240.486 150.476C237.845 159.066 233.021 166.572 226.624 172.048C220.227 177.523 212.544 180.721 204.547 181.237C196.549 181.752 188.597 179.563 181.695 174.946C174.793 170.328 169.252 163.49 165.772 155.295C162.292 147.101 161.03 137.918 162.145 128.909L202.25 135.311L207.887 89.7582Z"></path></mask><path d="M207.887 89.7582C215.819 91.0244 223.243 94.9338 229.219 100.992C235.195 107.05 239.455 114.985 241.46 123.793C243.466 132.601 243.127 141.887 240.486 150.476C237.845 159.066 233.021 166.572 226.624 172.048C220.227 177.523 212.544 180.721 204.547 181.237C196.549 181.752 188.597 179.563 181.695 174.946C174.793 170.328 169.252 163.49 165.772 155.295C162.292 147.101 161.03 137.918 162.145 128.909L202.25 135.311L207.887 89.7582Z" fill="#D9D9D9" stroke="#282F2D" stroke-width="17.0249" mask="url(#path-6-inside-2_44_35)"></path><ellipse cx="203.75" cy="137.311" rx="34" ry="40" fill="#E1E9E5"></ellipse><g filter="url(#filter0_d_44_35)"><path d="M132.918 133.168C132.918 170.778 94.4329 201.268 46.9588 201.268C-0.515282 201.268 24.6797 170.778 24.6797 133.168C24.6797 95.5573 -0.515282 65.068 46.9588 65.068C94.4329 65.068 132.918 95.5573 132.918 133.168Z" fill="#282F2D"></path></g><defs><filter id="filter0_d_44_35" x="0.975061" y="65.068" width="148.968" height="170.249" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dy="17.0249"></feOffset><feGaussianBlur stdDeviation="8.51247"></feGaussianBlur><feComposite in2="hardAlpha" operator="out"></feComposite><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_44_35"></feBlend><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_44_35" result="shape"></feBlend></filter></defs></svg>`;
}
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  const {
    elements: {
      trigger,
      menu,
      option,
      group,
      groupLabel,
      label
    },
    states: { selectedLabel, open, selected },
    helpers: { isSelected }
  } = createSelect({
    forceVisible: true,
    positioning: {
      placement: "bottom",
      fitViewport: true,
      sameWidth: true
    }
  });
  const options2 = ["Hostel", "Rooms", "Flats", "PG's"];
  let selectedLocation = void 0;
  store_get($$store_subs ?? ($$store_subs = {}), "$selected", selected)?.value;
  $$payload.out += `<main class="flex min-h-svh w-full items-center justify-center"><div class="flex w-full -translate-y-8 flex-col items-center justify-between space-y-6 sm:w-[95%] sm:space-y-8 lg:w-[85%] lg:-translate-y-10"><div class="flex w-full flex-col items-center justify-center">`;
  LogoWithName($$payload);
  $$payload.out += `<!----> <h1 class="m-1 text-wrap text-center font-[GS] text-3xl font-medium text-[#282F2D] sm:text-5xl">Your perfect space. A click away.</h1></div> <div class="flex w-full flex-col items-center justify-between gap-y-3 sm:flex-row sm:gap-x-2"><div class="relative flex w-[95%] flex-col sm:w-[65%] lg:w-[75%]"><label class="font-[GS] text-base text-teal-900 sm:text-lg" for="input">Get started</label> <input${attr("value", selectedLocation)} autocomplete="off" id="input" placeholder="Start searching for your locality or college" type="text"${attr("class", `w-full shrink-0 ${stringify("rounded-xl")} bg-[#021f1e] px-[10px] py-[12px] font-[CG] text-lg text-stone-100 transition-all duration-500 placeholder:text-sm placeholder:text-stone-300/80 focus:outline-none focus:ring-1 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-transparent sm:placeholder:text-base`)}> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div> <div class="flex w-[80%] flex-col sm:w-[40%] lg:w-[45%]"><label${spread_attributes(
    {
      class: "font-[GS] text-base text-teal-900 sm:text-lg",
      ...store_get($$store_subs ?? ($$store_subs = {}), "$label", label)
    },
    { "svelte-jrs6b9": true }
  )}>Select type</label> <div class="flex h-full w-full flex-col gap-y-[5px]"><button${spread_attributes(
    {
      id: "",
      class: "flex items-center justify-between rounded-xl border border-teal-600 bg-teal-200 bg-opacity-40 px-[11px] py-[10px] font-[CG] text-lg font-normal text-teal-900 hover:bg-teal-100",
      ...store_get($$store_subs ?? ($$store_subs = {}), "$trigger", trigger),
      "aria-label": "Place Type"
    },
    { "svelte-jrs6b9": true }
  )}>${escape_html(store_get($$store_subs ?? ($$store_subs = {}), "$selectedLabel", selectedLabel) || "Choose from Hostels, rooms...")} `;
  Chevron_down($$payload, { class: "size-5 shrink-0" });
  $$payload.out += `<!----></button> `;
  if (store_get($$store_subs ?? ($$store_subs = {}), "$open", open)) {
    $$payload.out += "<!--[-->";
    const each_array_1 = ensure_array_like(options2);
    $$payload.out += `<div${spread_attributes(
      {
        class: "flex min-h-fit flex-col gap-y-1 rounded-xl bg-teal-200 p-2 font-[CG] text-lg",
        ...store_get($$store_subs ?? ($$store_subs = {}), "$menu", menu)
      },
      { "svelte-jrs6b9": true }
    )}><!--[-->`;
    for (let $$index_1 = 0; $$index_1 < each_array_1.length; $$index_1++) {
      const item = each_array_1[$$index_1];
      const __MELTUI_BUILDER_1__ = store_get($$store_subs ?? ($$store_subs = {}), "$option", option)({ value: item, label: item });
      const __MELTUI_BUILDER_0__ = store_get($$store_subs ?? ($$store_subs = {}), "$group", group)(item);
      $$payload.out += `<div${spread_attributes({ ...__MELTUI_BUILDER_0__ }, { "svelte-jrs6b9": true })}><div${spread_attributes(
        {
          class: "hover:bg-magnum-100 focus:text-magnum-700 relative flex cursor-pointer items-center justify-between rounded-lg px-3 py-1 text-neutral-800 focus:z-10 data-[highlighted]:rounded-xl data-[highlighted]:bg-teal-400 data-[disabled]:opacity-50",
          ...__MELTUI_BUILDER_1__
        },
        { "svelte-jrs6b9": true }
      )}>${escape_html(item)} <div${attr("class", `check ${stringify(store_get($$store_subs ?? ($$store_subs = {}), "$isSelected", isSelected)(item) ? "block" : "hidden")}`)}>`;
      Check($$payload, { class: "size-4 shrink-0" });
      $$payload.out += `<!----></div></div></div>`;
    }
    $$payload.out += `<!--]--></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div></div> <button class="search-btn relative gap-x-2 rounded-xl border border-teal-600 bg-teal-200 stroke-teal-800 px-[22px] py-[8px] text-center font-[CG] text-lg font-normal text-teal-900 sm:self-center sm:px-[25px] sm:py-[10px] md:self-end lg:self-end svelte-jrs6b9">Search</button></div></div></main>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
var init_page_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/_page.svelte.js"() {
    init_index2();
    init_chevron_down();
    init_chunks();
    init_client();
  }
});

// .svelte-kit/output/server/nodes/2.js
var __exports3 = {};
__export(__exports3, {
  component: () => component3,
  fonts: () => fonts3,
  imports: () => imports3,
  index: () => index3,
  stylesheets: () => stylesheets3
});
var index3, component_cache3, component3, imports3, stylesheets3, fonts3;
var init__3 = __esm({
  ".svelte-kit/output/server/nodes/2.js"() {
    index3 = 2;
    component3 = async () => component_cache3 ?? (component_cache3 = (await Promise.resolve().then(() => (init_page_svelte(), page_svelte_exports))).default);
    imports3 = ["_app/immutable/nodes/2.CiK28lzQ.js", "_app/immutable/chunks/disclose-version.BogR3-rD.js", "_app/immutable/chunks/index-client.C_P2apAl.js", "_app/immutable/chunks/render.B7uRD5bS.js", "_app/immutable/chunks/if.Bf3PrYk7.js", "_app/immutable/chunks/chevron-down.De1h_W75.js", "_app/immutable/chunks/entry.C7CvdWvJ.js", "_app/immutable/chunks/misc.BvfwgVPg.js", "_app/immutable/chunks/props.C-_ZoY2P.js", "_app/immutable/chunks/lifecycle.ToRgGMcZ.js", "_app/immutable/chunks/index._JopWsWO.js", "_app/immutable/chunks/store.N7t0lmzn.js"];
    stylesheets3 = ["_app/immutable/assets/2.BDhitTM-.css"];
    fonts3 = [];
  }
});

// .svelte-kit/output/server/entries/pages/dorms/_page.server.ts.js
var page_server_ts_exports = {};
__export(page_server_ts_exports, {
  load: () => load
});
var load;
var init_page_server_ts = __esm({
  ".svelte-kit/output/server/entries/pages/dorms/_page.server.ts.js"() {
    load = async () => {
      return {};
    };
  }
});

// .svelte-kit/output/server/nodes/3.js
var __exports4 = {};
__export(__exports4, {
  fonts: () => fonts4,
  imports: () => imports4,
  index: () => index4,
  server: () => page_server_ts_exports,
  server_id: () => server_id,
  stylesheets: () => stylesheets4
});
var index4, server_id, imports4, stylesheets4, fonts4;
var init__4 = __esm({
  ".svelte-kit/output/server/nodes/3.js"() {
    init_page_server_ts();
    index4 = 3;
    server_id = "src/routes/dorms/+page.server.ts";
    imports4 = [];
    stylesheets4 = [];
    fonts4 = [];
  }
});

// .svelte-kit/output/server/entries/pages/dorms/_id_/_page.server.ts.js
var page_server_ts_exports2 = {};
__export(page_server_ts_exports2, {
  load: () => load2
});
var load2;
var init_page_server_ts2 = __esm({
  ".svelte-kit/output/server/entries/pages/dorms/_id_/_page.server.ts.js"() {
    load2 = async () => {
      return {};
    };
  }
});

// .svelte-kit/output/server/chunks/image.js
function getImageCdnForUrl(url) {
  return getImageCdnForUrlByDomain(url) || getImageCdnForUrlByPath(url);
}
function getImageCdnForUrlByDomain(url) {
  if (typeof url === "string" && !url.startsWith("https://")) {
    return false;
  }
  const { hostname } = toUrl(url);
  if (cdnDomains.has(hostname)) {
    return cdnDomains.get(hostname);
  }
  for (const [subdomain, cdn] of cdnSubdomains) {
    if (hostname.endsWith(`.${subdomain}`)) {
      return cdn;
    }
  }
  return false;
}
function getImageCdnForUrlByPath(url) {
  const { pathname } = toUrl(url);
  for (const [prefix2, cdn] of Object.entries(paths)) {
    if (pathname.startsWith(prefix2)) {
      return cdn;
    }
  }
  return false;
}
function getDirective(key2) {
  let keyArray = Object.keys(OBJECT_TO_DIRECTIVES_MAP);
  let directive = keyArray.find((k) => OBJECT_TO_DIRECTIVES_MAP[k] === key2) || "";
  return directive;
}
function getParameterArray(url) {
  let url_string = url.toString();
  let paramArray = [];
  if (url_string) {
    let splitURL = url_string.split("imgeng=");
    if (splitURL.length > 1) {
      paramArray = splitURL[1].split("/");
    }
  }
  return paramArray;
}
function getBaseUrl(url) {
  let url_string = url.toString();
  let baseUrl = "";
  if (url_string) {
    let splitURL = url_string.split("imgeng=");
    if (splitURL.length > 1) {
      baseUrl = splitURL[0].slice(0, -1);
    } else {
      baseUrl = url_string;
    }
  }
  return baseUrl;
}
function build_IE_directives(directives) {
  return Object.entries(directives).reduce((acc, [k, v]) => {
    return acc + maybe_create_directive(k, v);
  }, "");
}
function build_IE_query_string(directives_string) {
  if (directives_string && directives_string !== "") {
    return `imgeng=${directives_string}`;
  }
  return "";
}
function maybe_create_directive(directive, value) {
  let translated_directive = OBJECT_TO_DIRECTIVES_MAP[directive];
  if (translated_directive && (value || value === 0)) {
    return `/${translated_directive}_${value}`;
  }
  return "";
}
function getDirectives(paramArray) {
  let directives = {};
  paramArray.forEach((para) => {
    let keyValue = para.split("_");
    if (keyValue.length > 1) {
      let key2 = keyValue[0];
      let value = keyValue[1];
      let directiveKey = getDirective(key2);
      if (directiveKey) {
        directives[directiveKey] = value;
      }
    }
  });
  return directives;
}
function extractFilename(cdnUrl) {
  const url = new URL(cdnUrl);
  const noOrigin = url.pathname + url.search + url.hash;
  const urlFilenameIdx = noOrigin.lastIndexOf("http");
  const plainFilenameIdx = noOrigin.lastIndexOf("/");
  let filename = "";
  if (urlFilenameIdx >= 0) {
    filename = noOrigin.slice(urlFilenameIdx);
  } else if (plainFilenameIdx >= 0) {
    filename = noOrigin.slice(plainFilenameIdx + 1);
  }
  return filename;
}
function isFileUrl(filename) {
  return filename.startsWith("http");
}
function splitFileUrl(fileUrl) {
  const url = new URL(fileUrl);
  return {
    pathname: url.origin + url.pathname || "",
    search: url.search || "",
    hash: url.hash || ""
  };
}
function trimFilename(cdnUrl) {
  const url = new URL(cdnUrl);
  const filename = extractFilename(cdnUrl);
  const filenamePathPart = isFileUrl(filename) ? splitFileUrl(filename).pathname : filename;
  url.pathname = url.pathname.replace(filenamePathPart, "");
  url.search = "";
  url.hash = "";
  return url.toString();
}
function extractOperations(cdnUrl) {
  const withoutFilename = trimFilename(cdnUrl);
  const url = new URL(withoutFilename);
  const operationsMarker = url.pathname.indexOf("/-/");
  if (operationsMarker === -1) {
    return [];
  }
  const operationsStr = url.pathname.substring(operationsMarker);
  return operationsStr.split("/-/").filter(Boolean).map((operation) => normalizeCdnOperation(operation));
}
function getDelegatedCdn(url, cdn) {
  if (!(cdn in delegators)) {
    return false;
  }
  const maybeDelegate = delegators[cdn];
  if (!maybeDelegate) {
    return false;
  }
  return maybeDelegate(url);
}
function getCanonicalCdnForUrl(url, defaultCdn) {
  const cdn = getImageCdnForUrl(url) || defaultCdn;
  if (!cdn) {
    return false;
  }
  const maybeDelegated = getDelegatedCdn(url, cdn);
  if (maybeDelegated) {
    return maybeDelegated;
  }
  return { cdn, url };
}
function transformSharedProps({
  width,
  height,
  priority,
  layout = "constrained",
  aspectRatio,
  ...props
}) {
  width = width && Number(width) || void 0;
  height = height && Number(height) || void 0;
  if (priority) {
    props.loading || (props.loading = "eager");
    props.fetchpriority || (props.fetchpriority = "high");
  } else {
    props.loading || (props.loading = "lazy");
    props.decoding || (props.decoding = "async");
  }
  if (props.alt === "") {
    props.role || (props.role = "presentation");
  }
  if (aspectRatio) {
    if (width) {
      if (height) ;
      else {
        height = Math.round(width / aspectRatio);
      }
    } else if (height) {
      width = Math.round(height * aspectRatio);
    } else ;
  } else if (width && height) {
    aspectRatio = width / height;
  } else ;
  return {
    width,
    height,
    aspectRatio,
    layout,
    ...props
  };
}
function transformProps(props) {
  let {
    src,
    cdn,
    transformer,
    background,
    layout,
    objectFit,
    breakpoints,
    width,
    height,
    aspectRatio,
    unstyled,
    ...transformedProps
  } = transformSharedProps(props);
  const canonical = src ? getCanonicalCdnForUrl(src, cdn) : void 0;
  let url = src;
  if (canonical) {
    url = canonical.url;
    transformer || (transformer = getTransformer(canonical.cdn));
  }
  if (transformer && background === "auto") {
    const lowResHeight = aspectRatio ? Math.round(LOW_RES_WIDTH / aspectRatio) : void 0;
    const lowResImage = transformer({
      url,
      width: LOW_RES_WIDTH,
      height: lowResHeight
    });
    if (lowResImage) {
      background = lowResImage.toString();
    }
  }
  const styleProps = {
    width,
    height,
    aspectRatio,
    layout,
    objectFit,
    background
  };
  transformedProps.sizes || (transformedProps.sizes = getSizes(width, layout));
  if (!unstyled) {
    transformedProps.style = {
      ...getStyle(styleProps),
      ...transformedProps.style
    };
  }
  if (transformer) {
    transformedProps.srcset = getSrcSet({
      src: url,
      width,
      height,
      aspectRatio,
      layout,
      breakpoints,
      transformer,
      cdn
    });
    const transformed = transformer({ url, width, height });
    if (transformed) {
      url = transformed;
    }
    if (layout === "fullWidth" || layout === "constrained") {
      width = void 0;
      height = void 0;
    }
  }
  return {
    ...transformedProps,
    src: url?.toString(),
    width,
    height
  };
}
function a(t, o) {
  const r2 = RegExp(t, "g");
  return (e) => {
    if (typeof e != "string")
      throw new TypeError(`expected an argument of type string, but got ${typeof e}`);
    return e.match(r2) ? e.replace(r2, o) : e;
  };
}
function c(o, r$1 = r) {
  if (!o || typeof o != "object" || Array.isArray(o))
    throw new TypeError(`expected an argument of type object, but got ${typeof o}`);
  return Object.keys(o).map((e) => `${r$1(e)}: ${o[e]};`).join(`
`);
}
function Image($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  push();
  let parentStyle, props, alt, styleObj, src, width, height, loading, decoding, srcset, role, sizes, fetchpriority, style;
  ({ style: parentStyle, ...props } = $$sanitized_props);
  ({
    alt,
    style: styleObj,
    src,
    width,
    height,
    loading,
    decoding,
    srcset,
    role,
    sizes,
    fetchpriority
  } = transformProps(props));
  style = [c(styleObj || {}), parentStyle].filter(Boolean).join(";");
  $$payload.out += `<img${spread_attributes({
    ...$$sanitized_props,
    style,
    loading,
    width,
    height,
    decoding,
    role,
    fetchpriority,
    alt: alt?.toString(),
    src: src?.toString(),
    srcset: srcset?.toString(),
    sizes: sizes?.toString()
  })} onload="this.__e=event" onerror="this.__e=event">`;
  pop();
}
var domains, subdomains, paths, roundIfNumeric, setParamIfDefined, setParamIfUndefined, getNumericParam, toRelativeUrl, toCanonicalUrlString, toUrl, cdnDomains, cdnSubdomains, transform$o, transform$n, transform$m, shopifyRegex, parse$8, generate$9, transform$l, transform$k, transform$j, cloudinaryRegex, parseTransforms$2, formatUrl$3, parse$7, generate$8, transform$i, cloudflareRegex, parseTransforms$1, formatUrl$2, parse$6, generate$7, transform$h, transform$g, storyBlokAssets, storyBlokImg2, splitFilters, generateFilters, parse$5, generate$6, transform$f, transform$e, delegateUrl, generate$5, transform$d, transform$c, transform$b, transform$a, transform$9, OBJECT_TO_DIRECTIVES_MAP, transform$8, transform$7, cloudflareImagesRegex, parseTransforms, formatUrl$1, parse$4, generate$4, transform$6, parse$3, generate$3, transform$5, transform$4, skippedParams, parse$2, generate$2, transform$3, getTransformParams, transform$2, uploadcareRegex, normalizeCdnOperation, parseOperations, formatUrl, parse$12, generate$1, transform$1, ALLOWED_FORMATS, STORAGE_URL_PREFIX, RENDER_URL_PREFIX, isRenderUrl, parse2, generate, transform, delegators, getTransformer, getSizes, pixelate, getStyle, DEFAULT_RESOLUTIONS, LOW_RES_WIDTH, getBreakpoints, getSrcSetEntries, getSrcSet, r;
var init_image = __esm({
  ".svelte-kit/output/server/chunks/image.js"() {
    init_index2();
    domains = {
      "images.ctfassets.net": "contentful",
      "cdn.builder.io": "builder.io",
      "images.prismic.io": "imgix",
      "www.datocms-assets.com": "imgix",
      "cdn.sanity.io": "imgix",
      "images.unsplash.com": "imgix",
      "cdn.shopify.com": "shopify",
      "s7d1.scene7.com": "scene7",
      "ip.keycdn.com": "keycdn",
      "assets.caisy.io": "bunny",
      "images.contentstack.io": "contentstack",
      "ucarecdn.com": "uploadcare"
    };
    subdomains = {
      "imgix.net": "imgix",
      "files.wordpress.com": "wordpress",
      "b-cdn.net": "bunny",
      "storyblok.com": "storyblok",
      "kc-usercontent.com": "kontent.ai",
      "cloudinary.com": "cloudinary",
      "kxcdn.com": "keycdn",
      "imgeng.in": "imageengine",
      "imagekit.io": "imagekit",
      "cloudimg.io": "cloudimage",
      "ucarecdn.com": "uploadcare",
      "supabase.co": "supabase"
    };
    paths = {
      "/cdn-cgi/image/": "cloudflare",
      "/cdn-cgi/imagedelivery/": "cloudflare_images",
      "/_next/image": "nextjs",
      "/_next/static": "nextjs",
      "/_vercel/image": "vercel",
      "/is/image": "scene7",
      "/_ipx/": "ipx",
      "/_image": "astro",
      "/.netlify/images": "netlify",
      "/storage/v1/object/public/": "supabase",
      "/storage/v1/render/image/public/": "supabase"
    };
    roundIfNumeric = (value) => {
      if (!value) {
        return value;
      }
      const num = Number(value);
      return isNaN(num) ? value : Math.round(num);
    };
    setParamIfDefined = (url, key2, value, deleteExisting, roundValue) => {
      if (value) {
        if (roundValue) {
          value = roundIfNumeric(value);
        }
        url.searchParams.set(key2, value.toString());
      } else if (deleteExisting) {
        url.searchParams.delete(key2);
      }
    };
    setParamIfUndefined = (url, key2, value) => {
      if (!url.searchParams.has(key2)) {
        url.searchParams.set(key2, value.toString());
      }
    };
    getNumericParam = (url, key2) => {
      const value = Number(url.searchParams.get(key2));
      return isNaN(value) ? void 0 : value;
    };
    toRelativeUrl = (url) => {
      const { pathname, search } = url;
      return `${pathname}${search}`;
    };
    toCanonicalUrlString = (url) => {
      return url.hostname === "n" ? toRelativeUrl(url) : url.toString();
    };
    toUrl = (url, base2) => {
      return typeof url === "string" ? new URL(url, base2 ?? "http://n/") : url;
    };
    cdnDomains = new Map(Object.entries(domains));
    cdnSubdomains = Object.entries(subdomains);
    transform$o = ({ url: originalUrl, width, height, format }) => {
      const url = toUrl(originalUrl);
      if (width && width > 4e3) {
        if (height) {
          height = Math.round(height * 4e3 / width);
        }
        width = 4e3;
      }
      if (height && height > 4e3) {
        if (width) {
          width = Math.round(width * 4e3 / height);
        }
        height = 4e3;
      }
      setParamIfDefined(url, "w", width, true, true);
      setParamIfDefined(url, "h", height, true, true);
      setParamIfDefined(url, "fm", format);
      setParamIfUndefined(url, "fit", "fill");
      return url;
    };
    transform$n = ({ url: originalUrl, width, height, format }) => {
      const url = toUrl(originalUrl);
      setParamIfDefined(url, "width", width, true, true);
      setParamIfDefined(url, "height", height, true, true);
      setParamIfDefined(url, "format", format);
      if (width && height) {
        setParamIfUndefined(url, "fit", "cover");
        setParamIfUndefined(url, "sharp", "true");
      }
      return url;
    };
    transform$m = ({ url: originalUrl, width, height, format }) => {
      const url = toUrl(originalUrl);
      setParamIfDefined(url, "w", width, true, true);
      setParamIfDefined(url, "h", height, true, true);
      setParamIfUndefined(url, "fit", "min");
      if (format) {
        url.searchParams.set("fm", format);
        const fm = url.searchParams.get("auto");
        if (fm === "format") {
          url.searchParams.delete("auto");
        } else if (fm?.includes("format")) {
          url.searchParams.set("auto", fm.split(",").filter((s2) => s2 !== "format").join(","));
        }
      } else {
        url.searchParams.delete("fm");
        if (!url.searchParams.get("auto")?.includes("format")) {
          url.searchParams.append("auto", "format");
        }
      }
      return url;
    };
    shopifyRegex = /(.+?)(?:_(?:(pico|icon|thumb|small|compact|medium|large|grande|original|master)|(\d*)x(\d*)))?(?:_crop_([a-z]+))?(\.[a-zA-Z]+)(\.png|\.jpg|\.webp|\.avif)?$/;
    parse$8 = (imageUrl) => {
      const url = toUrl(imageUrl);
      const match = url.pathname.match(shopifyRegex);
      if (!match) {
        throw new Error("Invalid Shopify URL");
      }
      const [, path, size2, width, height, crop, extension, format] = match;
      url.pathname = `${path}${extension}`;
      const widthString = width ? width : url.searchParams.get("width");
      const heightString = height ? height : url.searchParams.get("height");
      url.searchParams.delete("width");
      url.searchParams.delete("height");
      return {
        base: url.toString(),
        width: Number(widthString) || void 0,
        height: Number(heightString) || void 0,
        format: format ? format.slice(1) : void 0,
        params: { crop, size: size2 },
        cdn: "shopify"
      };
    };
    generate$9 = ({ base: base2, width, height, format, params }) => {
      const url = toUrl(base2);
      setParamIfDefined(url, "width", width, true, true);
      setParamIfDefined(url, "height", height, true, true);
      setParamIfDefined(url, "crop", params?.crop);
      setParamIfDefined(url, "format", format);
      return url;
    };
    transform$l = ({ url: originalUrl, width, height }) => {
      const parsed = parse$8(originalUrl);
      if (!parsed) {
        return;
      }
      const props = {
        ...parsed,
        width,
        height
      };
      return generate$9(props);
    };
    transform$k = ({ url: originalUrl, width, height }) => {
      const url = toUrl(originalUrl);
      setParamIfDefined(url, "w", width, true, true);
      setParamIfDefined(url, "h", height, true, true);
      setParamIfUndefined(url, "crop", "1");
      return url;
    };
    transform$j = ({ url: originalUrl, width, height }) => {
      const url = toUrl(originalUrl);
      setParamIfDefined(url, "w", width, true, true);
      setParamIfDefined(url, "h", height, true, true);
      setParamIfDefined(url, "q", getNumericParam(url, "q"), true);
      return url;
    };
    cloudinaryRegex = /https?:\/\/(?<host>[^\/]+)\/(?<cloudName>[^\/]+)\/(?<assetType>image|video|raw)\/(?<deliveryType>upload|fetch|private|authenticated|sprite|facebook|twitter|youtube|vimeo)\/?(?<signature>s\-\-[a-zA-Z0-9]+\-\-)?\/?(?<transformations>(?:[^_\/]+_[^,\/]+,?)*)?\/(?:(?<version>v\d+)\/)?(?<idAndFormat>[^\s]+)$/g;
    parseTransforms$2 = (transformations) => {
      return transformations ? Object.fromEntries(transformations.split(",").map((t) => t.split("_"))) : {};
    };
    formatUrl$3 = ({ host, cloudName, assetType, deliveryType, signature, transformations = {}, version, id, format }) => {
      if (format) {
        transformations.f = format;
      }
      const transformString = Object.entries(transformations).map(([key2, value]) => `${key2}_${value}`).join(",");
      const pathSegments = [
        host,
        cloudName,
        assetType,
        deliveryType,
        signature,
        transformString,
        version,
        id
      ].filter(Boolean).join("/");
      return `https://${pathSegments}`;
    };
    parse$7 = (imageUrl) => {
      const url = toUrl(imageUrl);
      const matches2 = [...url.toString().matchAll(cloudinaryRegex)];
      if (!matches2.length) {
        throw new Error("Invalid Cloudinary URL");
      }
      const group = matches2[0].groups || {};
      const { transformations: transformString = "", idAndFormat, ...baseParams } = group;
      delete group.idAndFormat;
      const lastDotIndex = idAndFormat.lastIndexOf(".");
      const id = lastDotIndex < 0 ? idAndFormat : idAndFormat.slice(0, lastDotIndex);
      const originalFormat = lastDotIndex < 0 ? void 0 : idAndFormat.slice(lastDotIndex + 1);
      const { w, h, f, ...transformations } = parseTransforms$2(transformString);
      const format = f && f !== "auto" ? f : originalFormat;
      const base2 = formatUrl$3({ ...baseParams, id, transformations });
      return {
        base: base2,
        width: Number(w) || void 0,
        height: Number(h) || void 0,
        format,
        cdn: "cloudinary",
        params: {
          ...group,
          id: group.deliveryType === "fetch" ? idAndFormat : id,
          format,
          transformations
        }
      };
    };
    generate$8 = ({ base: base2, width, height, format, params }) => {
      var _a;
      const parsed = parse$7(base2.toString());
      const props = {
        transformations: {},
        ...parsed.params,
        ...params,
        format: format || "auto"
      };
      if (width) {
        props.transformations.w = roundIfNumeric(width).toString();
      }
      if (height) {
        props.transformations.h = roundIfNumeric(height).toString();
      }
      (_a = props.transformations).c || (_a.c = "lfill");
      return formatUrl$3(props);
    };
    transform$i = ({ url: originalUrl, width, height, format = "auto" }) => {
      const parsed = parse$7(originalUrl);
      if (!parsed) {
        throw new Error("Invalid Cloudinary URL");
      }
      if (parsed.params?.assetType !== "image") {
        throw new Error("Cloudinary transformer only supports images");
      }
      if (parsed.params?.signature) {
        throw new Error("Cloudinary transformer does not support signed URLs");
      }
      const props = {
        ...parsed,
        width,
        height,
        format
      };
      return generate$8(props);
    };
    cloudflareRegex = /https?:\/\/(?<host>[^\/]+)\/cdn-cgi\/image\/(?<transformations>[^\/]+)?\/(?<path>.*)$/g;
    parseTransforms$1 = (transformations) => Object.fromEntries(transformations.split(",").map((t) => t.split("=")));
    formatUrl$2 = ({ host, transformations = {}, path }) => {
      const transformString = Object.entries(transformations).map(([key2, value]) => `${key2}=${value}`).join(",");
      const pathSegments = [
        host,
        "cdn-cgi",
        "image",
        transformString,
        path
      ].join("/");
      return `https://${pathSegments}`;
    };
    parse$6 = (imageUrl) => {
      const url = toUrl(imageUrl);
      const matches2 = [...url.toString().matchAll(cloudflareRegex)];
      if (!matches2.length) {
        throw new Error("Invalid Cloudflare URL");
      }
      const group = matches2[0].groups || {};
      const { transformations: transformString, ...baseParams } = group;
      const { width, height, f, ...transformations } = parseTransforms$1(transformString);
      formatUrl$2({ ...baseParams, transformations });
      return {
        base: url.toString(),
        width: Number(width) || void 0,
        height: Number(height) || void 0,
        format: f,
        cdn: "cloudflare",
        params: { ...group, transformations }
      };
    };
    generate$7 = ({ base: base2, width, height, format, params }) => {
      var _a;
      const parsed = parse$6(base2.toString());
      const props = {
        transformations: {},
        ...parsed.params,
        ...params
      };
      if (width) {
        props.transformations.width = width?.toString();
      }
      if (height) {
        props.transformations.height = height?.toString();
      }
      if (format) {
        props.transformations.f = format === "jpg" ? "jpeg" : format;
      }
      (_a = props.transformations).fit || (_a.fit = "cover");
      return new URL(formatUrl$2(props));
    };
    transform$h = ({ url: originalUrl, width, height, format = "auto" }) => {
      const parsed = parse$6(originalUrl);
      if (!parsed) {
        throw new Error("Invalid Cloudflare URL");
      }
      const props = {
        ...parsed,
        width,
        height,
        format
      };
      return generate$7(props);
    };
    transform$g = ({ url: originalUrl, width, height }) => {
      const url = toUrl(originalUrl);
      setParamIfDefined(url, "width", width, true, true);
      if (width && height) {
        setParamIfUndefined(url, "aspect_ratio", `${width}:${height}`);
      }
      return url;
    };
    storyBlokAssets = /(?<id>\/f\/\d+\/\d+x\d+\/\w+\/[^\/]+)\/?(?<modifiers>m\/?(?<crop>\d+x\d+:\d+x\d+)?\/?(?<resize>(?<flipx>\-)?(?<width>\d+)x(?<flipy>\-)?(?<height>\d+))?\/?(filters\:(?<filters>[^\/]+))?)?$/g;
    storyBlokImg2 = /^(?<modifiers>\/(?<crop>\d+x\d+:\d+x\d+)?\/?(?<resize>(?<flipx>\-)?(?<width>\d+)x(?<flipy>\-)?(?<height>\d+))?\/?(filters\:(?<filters>[^\/]+))?\/?)?(?<id>\/f\/.+)$/g;
    splitFilters = (filters) => {
      if (!filters) {
        return {};
      }
      return Object.fromEntries(filters.split(":").map((filter) => {
        if (!filter)
          return [];
        const [key2, value] = filter.split("(");
        return [key2, value.replace(")", "")];
      }));
    };
    generateFilters = (filters) => {
      if (!filters) {
        return void 0;
      }
      const filterItems = Object.entries(filters).map(([key2, value]) => `${key2}(${value ?? ""})`);
      if (filterItems.length === 0) {
        return void 0;
      }
      return `filters:${filterItems.join(":")}`;
    };
    parse$5 = (imageUrl) => {
      const url = toUrl(imageUrl);
      const regex = url.hostname === "img2.storyblok.com" ? storyBlokImg2 : storyBlokAssets;
      const [matches2] = url.pathname.matchAll(regex);
      if (!matches2 || !matches2.groups) {
        throw new Error("Invalid Storyblok URL");
      }
      const { id, crop, width, height, filters, flipx, flipy } = matches2.groups;
      const { format, ...filterMap } = splitFilters(filters);
      if (url.hostname === "img2.storyblok.com") {
        url.hostname = "a.storyblok.com";
      }
      return {
        base: url.origin + id,
        width: Number(width) || void 0,
        height: Number(height) || void 0,
        format,
        params: {
          crop,
          filters: filterMap,
          flipx,
          flipy
        },
        cdn: "storyblok"
      };
    };
    generate$6 = ({ base: base2, width = 0, height = 0, format, params = {} }) => {
      const { crop, filters, flipx = "", flipy = "" } = params;
      const size2 = `${flipx}${width}x${flipy}${height}`;
      return new URL([base2, "m", crop, size2, generateFilters(filters), format].filter(Boolean).join("/"));
    };
    transform$f = ({ url: originalUrl, width, height, format }) => {
      const parsed = parse$5(originalUrl);
      if (!parsed) {
        return;
      }
      if (format) {
        if (!parsed.params) {
          parsed.params = { filters: {} };
        }
        if (!parsed.params.filters) {
          parsed.params.filters = {};
        }
        parsed.params.filters.format = format;
      }
      return generate$6({
        ...parsed,
        width,
        height
      });
    };
    transform$e = ({ url: originalUrl, width, height, format }) => {
      const url = toUrl(originalUrl);
      setParamIfDefined(url, "w", width, true, true);
      setParamIfDefined(url, "h", height, true, true);
      setParamIfDefined(url, "fm", format, true);
      if (width && height) {
        setParamIfUndefined(url, "fit", "crop");
      }
      return url;
    };
    delegateUrl = (url) => {
      const parsed = toUrl(url);
      const source2 = parsed.searchParams.get("url");
      if (!source2 || !source2.startsWith("http")) {
        return false;
      }
      const cdn = getImageCdnForUrlByDomain(source2);
      if (!cdn) {
        return false;
      }
      return {
        cdn,
        url: source2
      };
    };
    generate$5 = ({ base: base2, width, params: { quality = 75, root: root2 = "_vercel" } = {} }) => {
      const url = new URL("http://n");
      url.pathname = `/${root2}/image`;
      url.searchParams.set("url", base2.toString());
      setParamIfDefined(url, "w", width, false, true);
      setParamIfUndefined(url, "q", quality);
      return toRelativeUrl(url);
    };
    transform$d = ({ url, width, cdn }) => {
      const parsedUrl = toUrl(url);
      const isNextImage = parsedUrl.pathname.startsWith("/_next/image") || parsedUrl.pathname.startsWith("/_vercel/image");
      const src = isNextImage ? parsedUrl.searchParams.get("url") : url.toString();
      if (!src) {
        return void 0;
      }
      setParamIfDefined(parsedUrl, "w", width, true, true);
      if (isNextImage) {
        return toCanonicalUrlString(parsedUrl);
      }
      return generate$5({
        base: src,
        width,
        params: { root: cdn === "nextjs" ? "_next" : "_vercel" }
      });
    };
    transform$c = (params) => transform$d({ ...params, cdn: "nextjs" });
    transform$b = ({ url: originalUrl, width, height, format }) => {
      const url = toUrl(originalUrl);
      setParamIfDefined(url, "wid", width, true, true);
      setParamIfDefined(url, "hei", height, true, true);
      setParamIfDefined(url, "fmt", format, true);
      setParamIfDefined(url, "qlt", getNumericParam(url, "qlt"), true);
      setParamIfDefined(url, "scl", getNumericParam(url, "scl"), true);
      setParamIfUndefined(url, "fit", "crop");
      if (!width && !height) {
        setParamIfUndefined(url, "scl", 1);
      }
      return url;
    };
    transform$a = ({ url: originalUrl, width, height, format }) => {
      const url = toUrl(originalUrl);
      setParamIfDefined(url, "width", width, true, true);
      setParamIfDefined(url, "height", height, true, true);
      setParamIfDefined(url, "format", format, true);
      setParamIfDefined(url, "quality", getNumericParam(url, "quality"), true);
      setParamIfUndefined(url, "enlarge", 0);
      return url;
    };
    transform$9 = ({ url: originalUrl, width, height, format }) => {
      const url = toUrl(originalUrl);
      setParamIfDefined(url, "width", width, true, true);
      setParamIfDefined(url, "height", height, true, true);
      setParamIfDefined(url, "format", format);
      setParamIfDefined(url, "quality", getNumericParam(url, "quality"), true);
      return url;
    };
    OBJECT_TO_DIRECTIVES_MAP = {
      width: "w",
      height: "h",
      autoWidthWithFallback: "w_auto",
      auto_width_fallback: "w_auto",
      scaleToScreenWidth: "pc",
      scale_to_screen_width: "pc",
      crop: "cr",
      outputFormat: "f",
      format: "f",
      fit: "m",
      fitMethod: "m",
      compression: "cmpr",
      sharpness: "s",
      rotate: "r",
      inline: "in",
      keepMeta: "meta",
      keep_meta: "meta",
      noOptimization: "pass",
      no_optimization: "pass",
      force_download: "dl",
      max_device_pixel_ratio: "maxdpr",
      maxDevicePixelRatio: "maxdpr"
    };
    transform$8 = ({ url: originalUrl, width, height, format }) => {
      const url = toUrl(originalUrl);
      const src = getBaseUrl(url);
      let directives = {};
      const param = url.toString() === src ? [] : getParameterArray(url);
      if (param.length) {
        directives = getDirectives(param);
      }
      if (width) {
        directives["width"] = width;
      }
      if (height) {
        directives["height"] = height;
      }
      if (format) {
        directives["format"] = format;
      }
      if (!directives.hasOwnProperty("fit")) {
        directives = { ...directives, "fit": "cropbox" };
      }
      let directives_string = build_IE_directives(directives);
      let query_string = build_IE_query_string(directives_string);
      let query_prefix = query_string === "" ? "" : src.includes("?") ? "&" : "?";
      return `${src}${query_prefix}${query_string}`;
    };
    transform$7 = ({ url: originalUrl, width, height, format }) => {
      const url = toUrl(originalUrl);
      setParamIfDefined(url, "width", width, true, true);
      setParamIfDefined(url, "height", height, true, true);
      setParamIfDefined(url, "format", format);
      if (!url.searchParams.has("format")) {
        setParamIfUndefined(url, "auto", "webp");
      }
      if (width && height) {
        setParamIfUndefined(url, "fit", "crop");
      }
      return url;
    };
    cloudflareImagesRegex = /https?:\/\/(?<host>[^\/]+)\/cdn-cgi\/imagedelivery\/(?<accountHash>[^\/]+)\/(?<imageId>[^\/]+)\/*(?<transformations>[^\/]+)*$/g;
    parseTransforms = (transformations) => Object.fromEntries(transformations?.split(",")?.map((t) => t.split("=")) ?? []);
    formatUrl$1 = ({ host, accountHash, transformations = {}, imageId }) => {
      const transformString = Object.entries(transformations).map(([key2, value]) => `${key2}=${value}`).join(",");
      const pathSegments = [
        host,
        "cdn-cgi",
        "imagedelivery",
        accountHash,
        imageId,
        transformString
      ].join("/");
      return `https://${pathSegments}`;
    };
    parse$4 = (imageUrl) => {
      const url = toUrl(imageUrl);
      const matches2 = [...url.toString().matchAll(cloudflareImagesRegex)];
      if (!matches2.length) {
        throw new Error("Invalid Cloudflare Images URL");
      }
      const group = matches2[0].groups || {};
      const { transformations: transformString, ...baseParams } = group;
      const { w, h, f, ...transformations } = parseTransforms(transformString);
      return {
        base: url.toString(),
        width: Number(w) || void 0,
        height: Number(h) || void 0,
        format: f,
        cdn: "cloudflare_images",
        params: { ...baseParams, transformations }
      };
    };
    generate$4 = ({ base: base2, width, height, format, params }) => {
      var _a;
      const parsed = parse$4(base2.toString());
      const props = {
        transformations: {},
        ...parsed.params,
        ...params
      };
      if (width) {
        props.transformations.w = width?.toString();
      }
      if (height) {
        props.transformations.h = height?.toString();
      }
      if (format) {
        props.transformations.f = format;
      }
      (_a = props.transformations).fit || (_a.fit = "cover");
      return new URL(formatUrl$1(props));
    };
    transform$6 = ({ url: originalUrl, width, height, format = "auto" }) => {
      const parsed = parse$4(originalUrl);
      if (!parsed) {
        throw new Error("Invalid Cloudflare Images URL");
      }
      const props = {
        ...parsed,
        width,
        height,
        format
      };
      return generate$4(props);
    };
    parse$3 = (imageUrl) => {
      const url = toUrl(imageUrl);
      const [modifiers, ...id] = url.pathname.split("/").slice(1);
      const params = Object.fromEntries(modifiers.split(",").map((modifier) => {
        const [key2, value] = modifier.split("_");
        return [key2, value];
      }));
      if (params.s) {
        const [width, height] = params.s.split("x");
        params.w || (params.w = width);
        params.h || (params.h = height);
      }
      return {
        base: id.join("/"),
        width: Number(params.w) || void 0,
        height: Number(params.h) || void 0,
        quality: Number(params.q) || void 0,
        format: params.f || "auto",
        params,
        cdn: "ipx"
      };
    };
    generate$3 = ({ base: id, width, height, format, params }) => {
      const modifiers = params?.modifiers ?? {};
      if (width && height) {
        modifiers.s = `${width}x${height}`;
      } else if (width) {
        modifiers.w = `${width}`;
      } else if (height) {
        modifiers.h = `${height}`;
      }
      if (format) {
        modifiers.f = format;
      }
      const base2 = params?.base.endsWith("/") ? params?.base : `${params?.base}/`;
      const modifiersString = Object.entries(modifiers).map(([key2, value]) => `${key2}_${value}`).join(",");
      const stringId = id.toString();
      const image = stringId.startsWith("/") ? stringId.slice(1) : stringId;
      return `${base2}${modifiersString}/${image}`;
    };
    transform$5 = (options2) => {
      const url = String(options2.url);
      const parsedUrl = toUrl(url);
      const defaultBase = parsedUrl.pathname.startsWith("/_ipx") && parsedUrl.hostname !== "n" ? `${parsedUrl.origin}/_ipx` : "/_ipx";
      const base2 = options2.cdnOptions?.ipx?.base ?? defaultBase;
      const isIpxUrl = base2 && base2 !== "/" && url.startsWith(base2);
      if (isIpxUrl) {
        const parsed = parse$3(url.replace(base2, ""));
        return generate$3({
          ...parsed,
          ...options2,
          params: {
            ...options2.cdnOptions?.ipx,
            base: base2
          }
        });
      }
      return generate$3({
        ...options2,
        base: url,
        params: {
          ...options2.cdnOptions?.ipx,
          base: base2
        }
      });
    };
    transform$4 = ({ url: originalUrl, width, height, format }) => {
      const parsedUrl = toUrl(originalUrl);
      const href = toCanonicalUrlString(new URL(parsedUrl.pathname, parsedUrl.origin));
      const url = { searchParams: new URLSearchParams() };
      setParamIfDefined(url, "href", href, true, true);
      setParamIfDefined(url, "w", width, true, true);
      setParamIfDefined(url, "h", height, true, true);
      setParamIfDefined(url, "f", format);
      return `/_image?${url.searchParams.toString()}`;
    };
    skippedParams = /* @__PURE__ */ new Set([
      "w",
      "h",
      "q",
      "fm",
      "url",
      "width",
      "height",
      "quality"
    ]);
    parse$2 = (url) => {
      const parsed = toUrl(url);
      const width = Number(parsed.searchParams.get("w") ?? parsed.searchParams.get("width")) ?? void 0;
      const height = Number(parsed.searchParams.get("h") ?? parsed.searchParams.get("height")) ?? void 0;
      const quality = Number(parsed.searchParams.get("q") ?? parsed.searchParams.get("quality")) || void 0;
      const format = parsed.searchParams.get("fm") || void 0;
      const base2 = parsed.searchParams.get("url") || "";
      const params = {
        quality
      };
      parsed.searchParams.forEach((value, key2) => {
        if (skippedParams.has(key2)) {
          return;
        }
        params[key2] = value;
      });
      parsed.search = "";
      return {
        base: base2,
        width,
        height,
        format,
        params,
        cdn: "netlify"
      };
    };
    generate$2 = ({ base: base2, width, height, format, params: { site, quality, ...params } = {} }) => {
      const url = toUrl("/.netlify/images", site);
      Object.entries(params).forEach(([key2, value]) => setParamIfDefined(url, key2, value));
      setParamIfDefined(url, "q", quality, true, true);
      setParamIfDefined(url, "w", width, true, true);
      setParamIfDefined(url, "h", height, true, true);
      setParamIfDefined(url, "fm", format);
      setParamIfUndefined(url, "fit", "cover");
      url.searchParams.set("url", base2.toString());
      return toCanonicalUrlString(url);
    };
    transform$3 = (options2) => {
      const url = toUrl(options2.url);
      if (url.pathname.startsWith("/.netlify/images")) {
        const { params, base: base2, format } = parse$2(url);
        return generate$2({
          base: base2,
          format,
          ...options2,
          params: {
            ...params,
            // If hostname is "n", we're dealing with a relative URL, so we don't need to set the site param
            site: url.hostname === "n" ? void 0 : url.origin
          }
        });
      }
      return generate$2({
        ...options2,
        base: options2.url,
        params: {
          site: options2.cdnOptions?.netlify?.site
        }
      });
    };
    getTransformParams = (url) => {
      const transforms = url.searchParams.get("tr") || "";
      return transforms.split(",").reduce((acc, transform2) => {
        const [key2, value] = transform2.split("-");
        acc[key2] = value;
        return acc;
      }, {});
    };
    transform$2 = ({ url: originalUrl, width, height, format }) => {
      const url = toUrl(originalUrl);
      const transformParams = getTransformParams(url);
      transformParams.w = width ? Math.round(width) : width;
      transformParams.h = height ? Math.round(height) : height;
      if (!transformParams.f) {
        transformParams.f = "auto";
      }
      if (format) {
        transformParams.f = format;
      }
      const tr = Object.keys(transformParams).map((key2) => {
        const value = transformParams[key2];
        if (value) {
          return `${key2}-${value}`;
        }
      }).filter((x) => x).join(",");
      url.searchParams.set("tr", tr);
      return url;
    };
    uploadcareRegex = /^https?:\/\/(?<host>[^\/]+)\/(?<uuid>[^\/]+)/g;
    normalizeCdnOperation = (operation) => {
      if (typeof operation !== "string" || !operation) {
        return "";
      }
      let str = operation.trim();
      if (str.startsWith("-/")) {
        str = str.slice(2);
      } else if (str.startsWith("/")) {
        str = str.slice(1);
      }
      if (str.endsWith("/")) {
        str = str.slice(0, str.length - 1);
      }
      return str;
    };
    parseOperations = (operations) => {
      return operations.length ? operations.reduce((acc, operation) => {
        const [key2, value] = operation.split("/");
        return {
          ...acc,
          [key2]: value
        };
      }, {}) : {};
    };
    formatUrl = ({ host, uuid, operations = {}, filename }) => {
      const operationString = Object.entries(operations).map(([key2, value]) => `${key2}/${value}`).join("/-/");
      const pathSegments = [
        host,
        uuid,
        operationString ? `-/${operationString}` : "",
        filename
      ].join("/");
      return `https://${pathSegments}`;
    };
    parse$12 = (imageUrl) => {
      const url = toUrl(imageUrl);
      const matchers = [...url.toString().matchAll(uploadcareRegex)];
      if (!matchers.length) {
        throw new Error("Invalid Uploadcare URL");
      }
      const group = matchers[0].groups || {};
      const { ...baseParams } = group;
      const filename = extractFilename(url.toString());
      const { format: f, ...operations } = parseOperations(extractOperations(url.toString()));
      const format = f && f !== "auto" ? f : "auto";
      const base2 = formatUrl({
        ...baseParams,
        filename: filename || void 0,
        operations: {
          ...operations,
          format
        }
      });
      return {
        base: base2,
        cdn: "uploadcare",
        params: {
          ...group,
          filename: filename || void 0,
          operations: {
            ...operations,
            format
          }
        }
      };
    };
    generate$1 = ({ base: base2, width, height, params }) => {
      const baseUrl = base2.toString();
      const parsed = parse$12(baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
      const props = {
        operations: {},
        ...parsed.params,
        ...params
      };
      if (width && height) {
        props.operations = {
          ...props.operations,
          resize: `${width}x${height}`
        };
      } else {
        if (width) {
          props.operations = {
            ...props.operations,
            resize: `${width}x`
          };
        }
        if (height) {
          props.operations = {
            ...props.operations,
            resize: `x${height}`
          };
        }
      }
      return formatUrl(props);
    };
    transform$1 = ({ url: originalUrl, width, height }) => {
      const parsed = parse$12(originalUrl);
      if (!parsed) {
        throw new Error("Invalid Uploadcare URL");
      }
      const props = {
        ...parsed,
        width,
        height
      };
      return generate$1(props);
    };
    ALLOWED_FORMATS = ["origin"];
    STORAGE_URL_PREFIX = "/storage/v1/object/public/";
    RENDER_URL_PREFIX = "/storage/v1/render/image/public/";
    isRenderUrl = (url) => url.pathname.startsWith(RENDER_URL_PREFIX);
    parse2 = (imageUrl) => {
      const url = toUrl(imageUrl);
      const isRender = isRenderUrl(url);
      if (!isRender) {
        return {
          cdn: "supabase",
          base: url.origin + url.pathname
        };
      }
      const imagePath = url.pathname.replace(RENDER_URL_PREFIX, "");
      const quality = url.searchParams.has("quality") ? Number(url.searchParams.get("quality")) : void 0;
      const width = url.searchParams.has("width") ? Number(url.searchParams.get("width")) : void 0;
      const height = url.searchParams.has("height") ? Number(url.searchParams.get("height")) : void 0;
      const format = url.searchParams.has("format") ? url.searchParams.get("format") : void 0;
      const resize = url.searchParams.has("resize") ? url.searchParams.get("resize") : void 0;
      return {
        cdn: "supabase",
        base: url.origin + STORAGE_URL_PREFIX + imagePath,
        width,
        height,
        format,
        params: {
          quality,
          resize
        }
      };
    };
    generate = ({ base: base2, width, height, format, params }) => {
      const parsed = parse2(base2.toString());
      base2 = parsed.base;
      width = width || parsed.width;
      height = height || parsed.height;
      format = format || parsed.format;
      params = { ...parsed.params, ...params };
      const searchParams = new URLSearchParams();
      if (width)
        searchParams.set("width", roundIfNumeric(width).toString());
      if (height)
        searchParams.set("height", roundIfNumeric(height).toString());
      if (format && ALLOWED_FORMATS.includes(format)) {
        searchParams.set("format", format);
      }
      if (params?.quality) {
        searchParams.set("quality", roundIfNumeric(params.quality).toString());
      }
      if (params?.resize)
        searchParams.set("resize", params.resize);
      if (searchParams.toString() === "")
        return base2;
      return parsed.base.replace(STORAGE_URL_PREFIX, RENDER_URL_PREFIX) + "?" + searchParams.toString();
    };
    transform = ({ url, width, height, format, cdnOptions }) => {
      const parsed = parse2(url);
      return generate({
        base: parsed.base,
        width: width || parsed.width,
        height: height || parsed.height,
        format: format || parsed.format,
        params: cdnOptions?.supabase || parsed.params
      });
    };
    delegators = {
      vercel: delegateUrl,
      nextjs: delegateUrl
    };
    getTransformer = (cdn) => ({
      imgix: transform$m,
      contentful: transform$o,
      "builder.io": transform$n,
      shopify: transform$l,
      wordpress: transform$k,
      cloudimage: transform$j,
      cloudinary: transform$i,
      bunny: transform$g,
      storyblok: transform$f,
      cloudflare: transform$h,
      vercel: transform$d,
      nextjs: transform$c,
      scene7: transform$b,
      "kontent.ai": transform$e,
      keycdn: transform$a,
      directus: transform$9,
      imageengine: transform$8,
      contentstack: transform$7,
      "cloudflare_images": transform$6,
      ipx: transform$5,
      astro: transform$4,
      netlify: transform$3,
      imagekit: transform$2,
      uploadcare: transform$1,
      supabase: transform
    })[cdn];
    getSizes = (width, layout) => {
      if (!width || !layout) {
        return void 0;
      }
      switch (layout) {
        case `constrained`:
          return `(min-width: ${width}px) ${width}px, 100vw`;
        case `fixed`:
          return `${width}px`;
        case `fullWidth`:
          return `100vw`;
        default:
          return void 0;
      }
    };
    pixelate = (value) => value || value === 0 ? `${value}px` : void 0;
    getStyle = ({
      width,
      height,
      aspectRatio,
      layout,
      objectFit = "cover",
      background
    }) => {
      const styleEntries = [
        ["object-fit", objectFit]
      ];
      if (background?.startsWith("https:") || background?.startsWith("http:") || background?.startsWith("data:")) {
        styleEntries.push(["background-image", `url(${background})`]);
        styleEntries.push(["background-size", "cover"]);
        styleEntries.push(["background-repeat", "no-repeat"]);
      } else {
        styleEntries.push(["background", background]);
      }
      if (layout === "fixed") {
        styleEntries.push(["width", pixelate(width)]);
        styleEntries.push(["height", pixelate(height)]);
      }
      if (layout === "constrained") {
        styleEntries.push(["max-width", pixelate(width)]);
        styleEntries.push(["max-height", pixelate(height)]);
        styleEntries.push([
          "aspect-ratio",
          aspectRatio ? `${aspectRatio}` : void 0
        ]);
        styleEntries.push(["width", "100%"]);
      }
      if (layout === "fullWidth") {
        styleEntries.push(["width", "100%"]);
        styleEntries.push([
          "aspect-ratio",
          aspectRatio ? `${aspectRatio}` : void 0
        ]);
        styleEntries.push(["height", pixelate(height)]);
      }
      return Object.fromEntries(
        styleEntries.filter(([, value]) => value)
      );
    };
    DEFAULT_RESOLUTIONS = [
      6016,
      // 6K
      5120,
      // 5K
      4480,
      // 4.5K
      3840,
      // 4K
      3200,
      // QHD+
      2560,
      // WQXGA
      2048,
      // QXGA
      1920,
      // 1080p
      1668,
      // Various iPads
      1280,
      // 720p
      1080,
      // iPhone 6-8 Plus
      960,
      // older horizontal phones
      828,
      // iPhone XR/11
      750,
      // iPhone 6-8
      640
      // older and lower-end phones
    ];
    LOW_RES_WIDTH = 24;
    getBreakpoints = ({
      width,
      layout,
      resolutions = DEFAULT_RESOLUTIONS
    }) => {
      if (layout === "fullWidth") {
        return resolutions;
      }
      if (!width) {
        return [];
      }
      const doubleWidth = width * 2;
      if (layout === "fixed") {
        return [width, doubleWidth];
      }
      if (layout === "constrained") {
        return [
          // Always include the image at 1x and 2x the specified width
          width,
          doubleWidth,
          // Filter out any resolutions that are larger than the double-res image
          ...resolutions.filter((w) => w < doubleWidth)
        ];
      }
      return [];
    };
    getSrcSetEntries = ({
      src,
      width,
      layout = "constrained",
      height,
      aspectRatio,
      breakpoints,
      cdn,
      transformer,
      format
    }) => {
      const canonical = getCanonicalCdnForUrl(src, cdn);
      if (canonical && !transformer) {
        transformer = getTransformer(canonical.cdn);
      }
      if (!transformer) {
        return [];
      }
      breakpoints || (breakpoints = getBreakpoints({ width, layout }));
      return breakpoints.sort((a2, b) => a2 - b).map((bp) => {
        let transformedHeight;
        if (height && aspectRatio) {
          transformedHeight = Math.round(bp / aspectRatio);
        }
        return {
          url: canonical ? canonical.url : src,
          width: bp,
          height: transformedHeight,
          format
        };
      });
    };
    getSrcSet = (options2) => {
      let { src, cdn, transformer } = options2;
      const canonical = getCanonicalCdnForUrl(src, cdn);
      if (canonical && !transformer) {
        transformer = getTransformer(canonical.cdn);
      }
      if (!transformer) {
        return "";
      }
      return getSrcSetEntries({ ...options2, transformer }).map((transform2) => {
        const url = transformer(transform2);
        return `${url?.toString()} ${transform2.width}w`;
      }).join(",\n");
    };
    r = a(/[A-Z]/, (o) => `-${o.toLowerCase()}`);
  }
});

// .svelte-kit/output/server/entries/pages/dorms/_id_/_page.svelte.js
var page_svelte_exports2 = {};
__export(page_svelte_exports2, {
  default: () => _page2
});
function _page2($$payload, $$props) {
  push();
  var $$store_subs;
  let id = store_get($$store_subs ?? ($$store_subs = {}), "$page", page).url.searchParams.get("id");
  $$payload.out += `<button class="absolute z-[1] m-2 hidden rounded-3xl bg-teal-950 p-2 sm:block">`;
  if (!store_get($$store_subs ?? ($$store_subs = {}), "$showMenu", showMenu)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu stroke-teal-100"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x stroke-teal-100"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>`;
  }
  $$payload.out += `<!--]--></button> <main class="flex min-h-svh w-full justify-center svelte-56zkis"><div class="flex min-h-full w-[75%] flex-col"><div${add_styles({
    "--carousel": `carousel-${stringify(id)}`
  })} class="carousel svelte-56zkis">`;
  Image($$payload, {
    src: "https://picsum.photos/id/42/750/300",
    layout: "fullWidth"
  });
  $$payload.out += `<!----></div> <div class="info-body h-[60%]"><h1 class="font-[CG] text-3xl">Dorm Heading goes here</h1></div></div></main>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
var init_page_svelte2 = __esm({
  ".svelte-kit/output/server/entries/pages/dorms/_id_/_page.svelte.js"() {
    init_index2();
    init_index3();
    init_image();
    init_stores();
  }
});

// .svelte-kit/output/server/nodes/4.js
var __exports5 = {};
__export(__exports5, {
  component: () => component4,
  fonts: () => fonts5,
  imports: () => imports5,
  index: () => index5,
  server: () => page_server_ts_exports2,
  server_id: () => server_id2,
  stylesheets: () => stylesheets5
});
var index5, component_cache4, component4, server_id2, imports5, stylesheets5, fonts5;
var init__5 = __esm({
  ".svelte-kit/output/server/nodes/4.js"() {
    init_page_server_ts2();
    index5 = 4;
    component4 = async () => component_cache4 ?? (component_cache4 = (await Promise.resolve().then(() => (init_page_svelte2(), page_svelte_exports2))).default);
    server_id2 = "src/routes/dorms/[id]/+page.server.ts";
    imports5 = ["_app/immutable/nodes/4.Cer5qIbN.js", "_app/immutable/chunks/disclose-version.BogR3-rD.js", "_app/immutable/chunks/index-client.C_P2apAl.js", "_app/immutable/chunks/if.Bf3PrYk7.js", "_app/immutable/chunks/image.B1SIqFMn.js", "_app/immutable/chunks/misc.BvfwgVPg.js", "_app/immutable/chunks/lifecycle.ToRgGMcZ.js", "_app/immutable/chunks/props.C-_ZoY2P.js", "_app/immutable/chunks/store.N7t0lmzn.js", "_app/immutable/chunks/entry.C7CvdWvJ.js", "_app/immutable/chunks/index.CjbkOuJp.js", "_app/immutable/chunks/stores.CL5OZR4V.js"];
    stylesheets5 = ["_app/immutable/assets/4.C70HtXhd.css"];
    fonts5 = [];
  }
});

// .svelte-kit/output/server/entries/pages/search/_page.server.ts.js
var page_server_ts_exports3 = {};
__export(page_server_ts_exports3, {
  load: () => load3
});
var load3;
var init_page_server_ts3 = __esm({
  ".svelte-kit/output/server/entries/pages/search/_page.server.ts.js"() {
    load3 = async () => {
      return {};
    };
  }
});

// .svelte-kit/output/server/entries/pages/search/_page.svelte.js
var page_svelte_exports3 = {};
__export(page_svelte_exports3, {
  default: () => _page3
});
function createCombobox(props) {
  const listbox = createListbox({ ...props, builder: "combobox", typeahead: false });
  const inputValue = writable("");
  const touchedInput = writable(false);
  const input = makeElement(name("input"), {
    stores: [listbox.elements.trigger, inputValue],
    returned: ([$trigger, $inputValue]) => {
      return {
        ...omit($trigger, "action"),
        role: "combobox",
        value: $inputValue,
        autocomplete: "off"
      };
    },
    action: (node) => {
      const unsubscribe = executeCallbacks(
        addMeltEventListener(node, "input", (e) => {
          if (!isHTMLInputElement(e.target) && !isContentEditable$1(e.target))
            return;
          touchedInput.set(true);
        }),
        // This shouldn't be cancelled ever, so we don't use addMeltEventListener.
        addEventListener(node, "input", (e) => {
          if (isHTMLInputElement(e.target)) {
            inputValue.set(e.target.value);
          }
          if (isContentEditable$1(e.target)) {
            inputValue.set(e.target.innerText);
          }
        })
      );
      const { destroy } = listbox.elements.trigger(node);
      return {
        destroy() {
          destroy?.();
          unsubscribe();
        }
      };
    }
  });
  effect2(listbox.states.open, ($open) => {
    if (!$open) {
      touchedInput.set(false);
    }
  });
  return {
    ...listbox,
    elements: {
      ...omit(listbox.elements, "trigger"),
      input
    },
    states: {
      ...listbox.states,
      touchedInput,
      inputValue
    }
  };
}
function Chevron_up($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [["path", { "d": "m18 15-6-6-6 6" }]];
  Icon($$payload, spread_props([
    { name: "chevron-up" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, default_slot($$props), {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function _page3($$payload, $$props) {
  push();
  var $$store_subs;
  const {
    elements: { menu, input, option, label },
    states: { open, inputValue, touchedInput, selected },
    helpers: { isSelected }
  } = createCombobox({ forceVisible: true });
  let Options = ["PG's", "Hostels", "Rooms", "Flats"];
  const toOption = (option2) => ({
    value: option2,
    label: option2,
    disabled: false
  });
  let filtered = (() => {
    let filtered2 = store_get($$store_subs ?? ($$store_subs = {}), "$touchedInput", touchedInput) ? Options.filter((x) => {
      const normalizedInput = store_get($$store_subs ?? ($$store_subs = {}), "$inputValue", inputValue).toLowerCase();
      return x.toLowerCase().includes(normalizedInput);
    }) : Options;
    return filtered2;
  })();
  const each_array_1 = ensure_array_like([0, 1, 2, 3, 4, 5, 6, 7]);
  $$payload.out += `<button class="absolute m-2 hidden rounded-3xl bg-teal-950 p-2 sm:block">`;
  if (!store_get($$store_subs ?? ($$store_subs = {}), "$showMenu", showMenu)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu stroke-teal-100"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x stroke-teal-100"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>`;
  }
  $$payload.out += `<!--]--></button> <main class="flex min-h-svh w-full flex-col divide-y divide-gray-300"><div class="flex h-[25svh] w-full items-center justify-center md:h-[20svh]"><div class="flex h-[75%] w-[90%] flex-col items-center justify-center gap-2 md:flex-row lg:w-[80%]"><input type="text" placeholder="Start searching" class="h-fit w-full rounded-2xl border-none bg-[#021f1e] p-3 font-[CG] text-stone-100 outline-none placeholder:text-stone-300/90"> <div class="flex flex-col gap-1 self-start md:self-center"><div class="relative"><input${spread_attributes(
    {
      ...store_get($$store_subs ?? ($$store_subs = {}), "$input", input),
      class: "flex h-10 items-center justify-between rounded-2xl border border-teal-600 bg-teal-200 px-3 py-6 font-[CG] text-teal-900 outline-none placeholder:text-teal-900 lg:pr-20",
      placeholder: "Select type"
    },
    { "svelte-1o2gdfk": true }
  )}> <div class="text-magnum-900 absolute right-2 top-1/2 z-10 -translate-y-1/2">`;
  if (store_get($$store_subs ?? ($$store_subs = {}), "$open", open)) {
    $$payload.out += "<!--[-->";
    Chevron_up($$payload, { class: "size-4 stroke-teal-900" });
  } else {
    $$payload.out += "<!--[!-->";
    Chevron_down($$payload, { class: "size-4 stroke-teal-900" });
  }
  $$payload.out += `<!--]--></div></div></div> `;
  if (store_get($$store_subs ?? ($$store_subs = {}), "$open", open)) {
    $$payload.out += "<!--[-->";
    const each_array = ensure_array_like(filtered);
    $$payload.out += `<ul${spread_attributes(
      {
        class: "z-10 flex max-h-[300px] flex-col overflow-hidden rounded-lg",
        ...store_get($$store_subs ?? ($$store_subs = {}), "$menu", menu)
      },
      { "svelte-1o2gdfk": true }
    )}><div class="flex max-h-full flex-col gap-0 overflow-y-auto rounded-xl bg-teal-200 px-2 py-2 font-[CG] text-teal-900" tabindex="0">`;
    if (each_array.length !== 0) {
      $$payload.out += "<!--[-->";
      for (let index7 = 0; index7 < each_array.length; index7++) {
        const value = each_array[index7];
        const __MELTUI_BUILDER_0__ = store_get($$store_subs ?? ($$store_subs = {}), "$option", option)(toOption(value));
        $$payload.out += `<li${spread_attributes(
          {
            ...__MELTUI_BUILDER_0__,
            class: "hover:bg-magnum-100 data-[highlighted]:text-magnum-900 relative cursor-pointer scroll-my-2 rounded-2xl py-2 pl-4 pr-4 data-[highlighted]:bg-teal-400 data-[disabled]:opacity-50"
          },
          { "svelte-1o2gdfk": true }
        )}>`;
        if (store_get($$store_subs ?? ($$store_subs = {}), "$isSelected", isSelected)(value)) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<div class="check absolute left-2 top-3 z-10 text-teal-900">`;
          Check($$payload, { class: "size-4" });
          $$payload.out += `<!----></div>`;
        } else {
          $$payload.out += "<!--[!-->";
        }
        $$payload.out += `<!--]--> <div class="pl-4"><span class="font-medium">${escape_html(value)}</span></div></li>`;
      }
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<li class="relative cursor-pointer rounded-md py-1 pl-8 pr-4">No results found</li>`;
    }
    $$payload.out += `<!--]--></div></ul>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div></div> <div class="grid min-h-[75svh] w-full grid-cols-[1fr] md:min-h-[80svh] md:grid-cols-[25%_75%]"><div class="border-gray-80 sticky top-0 hidden h-svh border-r border-gray-400 md:block">filters</div> <div class="mt-2 flex min-h-full flex-col items-center gap-y-4"><!--[-->`;
  for (let $$index_1 = 0; $$index_1 < each_array_1.length; $$index_1++) {
    const item = each_array_1[$$index_1];
    $$payload.out += `<a class="contents"${attr("href", `/dorms/id?id=${item}`)}><div class="card flex min-h-[325px] w-[95%] flex-col justify-between rounded-[calc(0.5rem+0.75rem)] border-2 border-teal-800 bg-[#e2e9e6] p-2 font-[Expose] text-gray-950 md:min-h-[400px] md:w-[60%]" id="card"><div${add_styles({
      "--carousel": `carousel-${stringify(item)}`
    })} class="carousel flex w-full snap-x snap-mandatory overflow-x-auto rounded-[calc(1.25rem-0.5rem)] svelte-1o2gdfk">`;
    Image($$payload, {
      class: "",
      background: "auto",
      src: "https://picsum.photos/id/42/750/300",
      alt: "A lovely bath",
      layout: "fullWidth"
    });
    $$payload.out += `<!----></div> <div class="info-body"><h1 class="text-xl">Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci ullam esse
								necessitatibus beatae possimus similique delectus saepe qui harum in? Harum fugit
								placeat maiores, hic neque asperiores nostrum atque alias?</h1></div> <div class="flex w-full flex-wrap items-center justify-between"><p class="text-xl">\u20B9 8000/month</p> <button class="rounded-xl bg-teal-300 p-4 font-[CG]">See more</button></div></div></a>`;
  }
  $$payload.out += `<!--]--></div></div></main>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
var name;
var init_page_svelte3 = __esm({
  ".svelte-kit/output/server/entries/pages/search/_page.svelte.js"() {
    init_index2();
    init_index3();
    init_chevron_down();
    init_chunks();
    init_image();
    ({ name } = createElHelpers("combobox"));
  }
});

// .svelte-kit/output/server/nodes/5.js
var __exports6 = {};
__export(__exports6, {
  component: () => component5,
  fonts: () => fonts6,
  imports: () => imports6,
  index: () => index6,
  server: () => page_server_ts_exports3,
  server_id: () => server_id3,
  stylesheets: () => stylesheets6
});
var index6, component_cache5, component5, server_id3, imports6, stylesheets6, fonts6;
var init__6 = __esm({
  ".svelte-kit/output/server/nodes/5.js"() {
    init_page_server_ts3();
    index6 = 5;
    component5 = async () => component_cache5 ?? (component_cache5 = (await Promise.resolve().then(() => (init_page_svelte3(), page_svelte_exports3))).default);
    server_id3 = "src/routes/search/+page.server.ts";
    imports6 = ["_app/immutable/nodes/5.BPpNGTJG.js", "_app/immutable/chunks/disclose-version.BogR3-rD.js", "_app/immutable/chunks/index-client.C_P2apAl.js", "_app/immutable/chunks/render.B7uRD5bS.js", "_app/immutable/chunks/if.Bf3PrYk7.js", "_app/immutable/chunks/chevron-down.De1h_W75.js", "_app/immutable/chunks/entry.C7CvdWvJ.js", "_app/immutable/chunks/misc.BvfwgVPg.js", "_app/immutable/chunks/props.C-_ZoY2P.js", "_app/immutable/chunks/lifecycle.ToRgGMcZ.js", "_app/immutable/chunks/image.B1SIqFMn.js", "_app/immutable/chunks/index._JopWsWO.js", "_app/immutable/chunks/store.N7t0lmzn.js", "_app/immutable/chunks/index.CjbkOuJp.js"];
    stylesheets6 = ["_app/immutable/assets/5.BnLdIB8e.css"];
    fonts6 = [];
  }
});

// .svelte-kit/output/server/chunks/internal.js
init_equality();
init_index2();
var base = "";
var assets = base;
var initial = { base, assets };
function override(paths2) {
  base = paths2.base;
  assets = paths2.assets;
}
function reset() {
  base = initial.base;
  assets = initial.assets;
}
var public_env = {};
var safe_public_env = {};
function set_private_env(environment) {
}
function set_public_env(environment) {
  public_env = environment;
}
function set_safe_public_env(environment) {
  safe_public_env = environment;
}
var DERIVED = 1 << 1;
var EFFECT = 1 << 2;
var RENDER_EFFECT = 1 << 3;
var BLOCK_EFFECT = 1 << 4;
var BRANCH_EFFECT = 1 << 5;
var ROOT_EFFECT = 1 << 6;
var UNOWNED = 1 << 7;
var DISCONNECTED = 1 << 8;
var CLEAN = 1 << 9;
var DIRTY = 1 << 10;
var MAYBE_DIRTY = 1 << 11;
var INERT = 1 << 12;
var DESTROYED = 1 << 13;
var EFFECT_RAN = 1 << 14;
var HEAD_EFFECT = 1 << 18;
function effect_update_depth_exceeded() {
  {
    throw new Error("effect_update_depth_exceeded");
  }
}
function hydration_failed() {
  {
    throw new Error("hydration_failed");
  }
}
function state_unsafe_mutation() {
  {
    throw new Error("state_unsafe_mutation");
  }
}
function push_effect(effect22, parent_effect) {
  var parent_last = parent_effect.last;
  if (parent_last === null) {
    parent_effect.last = parent_effect.first = effect22;
  } else {
    parent_last.next = effect22;
    effect22.prev = parent_last;
    parent_effect.last = effect22;
  }
}
function create_effect(type, fn, sync, push22 = true) {
  var is_root = (type & ROOT_EFFECT) !== 0;
  var effect22 = {
    ctx: current_component_context,
    deps: null,
    nodes: null,
    f: type | DIRTY,
    first: null,
    fn,
    last: null,
    next: null,
    parent: is_root ? null : current_effect,
    prev: null,
    teardown: null,
    transitions: null,
    version: 0
  };
  if (sync) {
    var previously_flushing_effect = is_flushing_effect;
    try {
      set_is_flushing_effect(true);
      update_effect(effect22);
      effect22.f |= EFFECT_RAN;
    } catch (e) {
      destroy_effect(effect22);
      throw e;
    } finally {
      set_is_flushing_effect(previously_flushing_effect);
    }
  } else if (fn !== null) {
    schedule_effect(effect22);
  }
  var inert = sync && effect22.deps === null && effect22.first === null && effect22.nodes === null && effect22.teardown === null;
  if (!inert && !is_root && push22) {
    if (current_effect !== null) {
      push_effect(effect22, current_effect);
    }
    if (current_reaction !== null && (current_reaction.f & DERIVED) !== 0) {
      push_effect(effect22, current_reaction);
    }
  }
  return effect22;
}
function effect_root(fn) {
  const effect22 = create_effect(ROOT_EFFECT, fn, true);
  return () => {
    destroy_effect(effect22);
  };
}
function effect(fn) {
  return create_effect(EFFECT, fn, false);
}
function branch(fn, push22 = true) {
  return create_effect(RENDER_EFFECT | BRANCH_EFFECT, fn, true, push22);
}
function execute_effect_teardown(effect22) {
  var teardown = effect22.teardown;
  if (teardown !== null) {
    const previous_reaction = current_reaction;
    set_current_reaction(null);
    try {
      teardown.call(null);
    } finally {
      set_current_reaction(previous_reaction);
    }
  }
}
function destroy_effect(effect22, remove_dom = true) {
  var removed = false;
  if ((remove_dom || (effect22.f & HEAD_EFFECT) !== 0) && effect22.nodes !== null) {
    var node = effect22.nodes.start;
    var end = effect22.nodes.end;
    while (node !== null) {
      var next2 = node === end ? null : (
        /** @type {TemplateNode} */
        node.nextSibling
      );
      node.remove();
      node = next2;
    }
    removed = true;
  }
  destroy_effect_children(effect22, remove_dom && !removed);
  remove_reactions(effect22, 0);
  set_signal_status(effect22, DESTROYED);
  if (effect22.transitions) {
    for (const transition of effect22.transitions) {
      transition.stop();
    }
  }
  execute_effect_teardown(effect22);
  var parent = effect22.parent;
  if (parent !== null && (effect22.f & BRANCH_EFFECT) !== 0 && parent.first !== null) {
    unlink_effect(effect22);
  }
  effect22.next = effect22.prev = effect22.teardown = effect22.ctx = effect22.deps = effect22.parent = effect22.fn = effect22.nodes = null;
}
function unlink_effect(effect22) {
  var parent = effect22.parent;
  var prev2 = effect22.prev;
  var next2 = effect22.next;
  if (prev2 !== null) prev2.next = next2;
  if (next2 !== null) next2.prev = prev2;
  if (parent !== null) {
    if (parent.first === effect22) parent.first = next2;
    if (parent.last === effect22) parent.last = prev2;
  }
}
function flush_tasks() {
}
function hydration_mismatch(location) {
  {
    console.warn("hydration_mismatch");
  }
}
function destroy_derived_children(derived2) {
  destroy_effect_children(derived2);
  var deriveds = derived2.deriveds;
  if (deriveds !== null) {
    derived2.deriveds = null;
    for (var i = 0; i < deriveds.length; i += 1) {
      destroy_derived(deriveds[i]);
    }
  }
}
function update_derived(derived2) {
  destroy_derived_children(derived2);
  var value = update_reaction(derived2);
  var status = (current_skip_reaction || (derived2.f & UNOWNED) !== 0) && derived2.deps !== null ? MAYBE_DIRTY : CLEAN;
  set_signal_status(derived2, status);
  if (!derived2.equals(value)) {
    derived2.v = value;
    derived2.version = increment_version();
  }
}
function destroy_derived(signal) {
  destroy_derived_children(signal);
  remove_reactions(signal, 0);
  set_signal_status(signal, DESTROYED);
  signal.first = signal.last = signal.deps = signal.reactions = // @ts-expect-error `signal.fn` cannot be `null` while the signal is alive
  signal.fn = null;
}
var FLUSH_MICROTASK = 0;
var FLUSH_SYNC = 1;
var current_scheduler_mode = FLUSH_MICROTASK;
var is_micro_task_queued = false;
var is_flushing_effect = false;
function set_is_flushing_effect(value) {
  is_flushing_effect = value;
}
var current_queued_root_effects = [];
var flush_count = 0;
var current_reaction = null;
function set_current_reaction(reaction) {
  current_reaction = reaction;
}
var current_effect = null;
var new_deps = null;
var skipped_deps = 0;
var current_untracked_writes = null;
function set_current_untracked_writes(value) {
  current_untracked_writes = value;
}
var current_version = 0;
var current_skip_reaction = false;
var current_component_context = null;
function increment_version() {
  return current_version++;
}
function is_runes() {
  return current_component_context !== null && current_component_context.l === null;
}
function check_dirtiness(reaction) {
  var _a;
  var flags = reaction.f;
  if ((flags & DIRTY) !== 0) {
    return true;
  }
  if ((flags & MAYBE_DIRTY) !== 0) {
    var dependencies = reaction.deps;
    if (dependencies !== null) {
      var is_unowned = (flags & UNOWNED) !== 0;
      var i;
      if ((flags & DISCONNECTED) !== 0) {
        for (i = 0; i < dependencies.length; i++) {
          ((_a = dependencies[i]).reactions ?? (_a.reactions = [])).push(reaction);
        }
        reaction.f ^= DISCONNECTED;
      }
      for (i = 0; i < dependencies.length; i++) {
        var dependency = dependencies[i];
        if (check_dirtiness(
          /** @type {Derived} */
          dependency
        )) {
          update_derived(
            /** @type {Derived} */
            dependency
          );
        }
        if (dependency.version > reaction.version) {
          return true;
        }
        if (is_unowned) {
          if (!current_skip_reaction && !dependency?.reactions?.includes(reaction)) {
            (dependency.reactions ?? (dependency.reactions = [])).push(reaction);
          }
        }
      }
    }
    set_signal_status(reaction, CLEAN);
  }
  return false;
}
function handle_error(error, effect22, component_context) {
  {
    throw error;
  }
}
function update_reaction(reaction) {
  var previous_deps = new_deps;
  var previous_skipped_deps = skipped_deps;
  var previous_untracked_writes = current_untracked_writes;
  var previous_reaction = current_reaction;
  var previous_skip_reaction = current_skip_reaction;
  new_deps = /** @type {null | Value[]} */
  null;
  skipped_deps = 0;
  current_untracked_writes = null;
  current_reaction = (reaction.f & (BRANCH_EFFECT | ROOT_EFFECT)) === 0 ? reaction : null;
  current_skip_reaction = !is_flushing_effect && (reaction.f & UNOWNED) !== 0;
  try {
    var result = (
      /** @type {Function} */
      (0, reaction.fn)()
    );
    var deps = reaction.deps;
    if (new_deps !== null) {
      var dependency;
      var i;
      if (deps !== null) {
        var array2 = skipped_deps === 0 ? new_deps : deps.slice(0, skipped_deps).concat(new_deps);
        var set2 = array2.length > 16 ? new Set(array2) : null;
        for (i = skipped_deps; i < deps.length; i++) {
          dependency = deps[i];
          if (set2 !== null ? !set2.has(dependency) : !array2.includes(dependency)) {
            remove_reaction(reaction, dependency);
          }
        }
      }
      if (deps !== null && skipped_deps > 0) {
        deps.length = skipped_deps + new_deps.length;
        for (i = 0; i < new_deps.length; i++) {
          deps[skipped_deps + i] = new_deps[i];
        }
      } else {
        reaction.deps = deps = new_deps;
      }
      if (!current_skip_reaction) {
        for (i = skipped_deps; i < deps.length; i++) {
          dependency = deps[i];
          var reactions = dependency.reactions;
          if (reactions === null) {
            dependency.reactions = [reaction];
          } else if (reactions[reactions.length - 1] !== reaction && !reactions.includes(reaction)) {
            reactions.push(reaction);
          }
        }
      }
    } else if (deps !== null && skipped_deps < deps.length) {
      remove_reactions(reaction, skipped_deps);
      deps.length = skipped_deps;
    }
    return result;
  } finally {
    new_deps = previous_deps;
    skipped_deps = previous_skipped_deps;
    current_untracked_writes = previous_untracked_writes;
    current_reaction = previous_reaction;
    current_skip_reaction = previous_skip_reaction;
  }
}
function remove_reaction(signal, dependency) {
  const reactions = dependency.reactions;
  let reactions_length = 0;
  if (reactions !== null) {
    reactions_length = reactions.length - 1;
    const index7 = reactions.indexOf(signal);
    if (index7 !== -1) {
      if (reactions_length === 0) {
        dependency.reactions = null;
      } else {
        reactions[index7] = reactions[reactions_length];
        reactions.pop();
      }
    }
  }
  if (reactions_length === 0 && (dependency.f & DERIVED) !== 0) {
    set_signal_status(dependency, MAYBE_DIRTY);
    if ((dependency.f & (UNOWNED | DISCONNECTED)) === 0) {
      dependency.f ^= DISCONNECTED;
    }
    remove_reactions(
      /** @type {Derived} **/
      dependency,
      0
    );
  }
}
function remove_reactions(signal, start_index) {
  var dependencies = signal.deps;
  if (dependencies === null) return;
  var active_dependencies = start_index === 0 ? null : dependencies.slice(0, start_index);
  var seen = /* @__PURE__ */ new Set();
  for (var i = start_index; i < dependencies.length; i++) {
    var dependency = dependencies[i];
    if (seen.has(dependency)) continue;
    seen.add(dependency);
    if (active_dependencies === null || !active_dependencies.includes(dependency)) {
      remove_reaction(signal, dependency);
    }
  }
}
function destroy_effect_children(signal, remove_dom = false) {
  var effect22 = signal.first;
  signal.first = signal.last = null;
  while (effect22 !== null) {
    var next2 = effect22.next;
    destroy_effect(effect22, remove_dom);
    effect22 = next2;
  }
}
function update_effect(effect22) {
  var flags = effect22.f;
  if ((flags & DESTROYED) !== 0) {
    return;
  }
  set_signal_status(effect22, CLEAN);
  var component_context = effect22.ctx;
  var previous_effect = current_effect;
  var previous_component_context = current_component_context;
  current_effect = effect22;
  current_component_context = component_context;
  try {
    if ((flags & BLOCK_EFFECT) === 0) {
      destroy_effect_children(effect22);
    }
    execute_effect_teardown(effect22);
    var teardown = update_reaction(effect22);
    effect22.teardown = typeof teardown === "function" ? teardown : null;
    effect22.version = current_version;
  } catch (error) {
    handle_error(
      /** @type {Error} */
      error
    );
  } finally {
    current_effect = previous_effect;
    current_component_context = previous_component_context;
  }
}
function infinite_loop_guard() {
  if (flush_count > 1e3) {
    flush_count = 0;
    effect_update_depth_exceeded();
  }
  flush_count++;
}
function flush_queued_root_effects(root_effects) {
  var length = root_effects.length;
  if (length === 0) {
    return;
  }
  infinite_loop_guard();
  var previously_flushing_effect = is_flushing_effect;
  is_flushing_effect = true;
  try {
    for (var i = 0; i < length; i++) {
      var effect22 = root_effects[i];
      if (effect22.first === null && (effect22.f & BRANCH_EFFECT) === 0) {
        flush_queued_effects([effect22]);
      } else {
        var collected_effects = [];
        process_effects(effect22, collected_effects);
        flush_queued_effects(collected_effects);
      }
    }
  } finally {
    is_flushing_effect = previously_flushing_effect;
  }
}
function flush_queued_effects(effects) {
  var length = effects.length;
  if (length === 0) return;
  for (var i = 0; i < length; i++) {
    var effect22 = effects[i];
    if ((effect22.f & (DESTROYED | INERT)) === 0 && check_dirtiness(effect22)) {
      update_effect(effect22);
      if (effect22.deps === null && effect22.first === null && effect22.nodes === null) {
        if (effect22.teardown === null) {
          unlink_effect(effect22);
        } else {
          effect22.fn = null;
        }
      }
    }
  }
}
function process_deferred() {
  is_micro_task_queued = false;
  if (flush_count > 1001) {
    return;
  }
  const previous_queued_root_effects = current_queued_root_effects;
  current_queued_root_effects = [];
  flush_queued_root_effects(previous_queued_root_effects);
  if (!is_micro_task_queued) {
    flush_count = 0;
  }
}
function schedule_effect(signal) {
  if (current_scheduler_mode === FLUSH_MICROTASK) {
    if (!is_micro_task_queued) {
      is_micro_task_queued = true;
      queueMicrotask(process_deferred);
    }
  }
  var effect22 = signal;
  while (effect22.parent !== null) {
    effect22 = effect22.parent;
    var flags = effect22.f;
    if ((flags & BRANCH_EFFECT) !== 0) {
      if ((flags & CLEAN) === 0) return;
      set_signal_status(effect22, MAYBE_DIRTY);
    }
  }
  current_queued_root_effects.push(effect22);
}
function process_effects(effect22, collected_effects) {
  var current_effect2 = effect22.first;
  var effects = [];
  main_loop: while (current_effect2 !== null) {
    var flags = current_effect2.f;
    var is_active = (flags & (DESTROYED | INERT)) === 0;
    var is_branch = flags & BRANCH_EFFECT;
    var is_clean = (flags & CLEAN) !== 0;
    var child = current_effect2.first;
    if (is_active && (!is_branch || !is_clean)) {
      if (is_branch) {
        set_signal_status(current_effect2, CLEAN);
      }
      if ((flags & RENDER_EFFECT) !== 0) {
        if (!is_branch && check_dirtiness(current_effect2)) {
          update_effect(current_effect2);
          child = current_effect2.first;
        }
        if (child !== null) {
          current_effect2 = child;
          continue;
        }
      } else if ((flags & EFFECT) !== 0) {
        if (is_branch || is_clean) {
          if (child !== null) {
            current_effect2 = child;
            continue;
          }
        } else {
          effects.push(current_effect2);
        }
      }
    }
    var sibling = current_effect2.next;
    if (sibling === null) {
      let parent = current_effect2.parent;
      while (parent !== null) {
        if (effect22 === parent) {
          break main_loop;
        }
        var parent_sibling = parent.next;
        if (parent_sibling !== null) {
          current_effect2 = parent_sibling;
          continue main_loop;
        }
        parent = parent.parent;
      }
    }
    current_effect2 = sibling;
  }
  for (var i = 0; i < effects.length; i++) {
    child = effects[i];
    collected_effects.push(child);
    process_effects(child, collected_effects);
  }
}
function flush_sync(fn) {
  var previous_scheduler_mode = current_scheduler_mode;
  var previous_queued_root_effects = current_queued_root_effects;
  try {
    infinite_loop_guard();
    const root_effects = [];
    current_scheduler_mode = FLUSH_SYNC;
    current_queued_root_effects = root_effects;
    is_micro_task_queued = false;
    flush_queued_root_effects(previous_queued_root_effects);
    var result = fn?.();
    flush_tasks();
    if (current_queued_root_effects.length > 0 || root_effects.length > 0) {
      flush_sync();
    }
    flush_count = 0;
    return result;
  } finally {
    current_scheduler_mode = previous_scheduler_mode;
    current_queued_root_effects = previous_queued_root_effects;
  }
}
function get(signal) {
  var flags = signal.f;
  if ((flags & DESTROYED) !== 0) {
    return signal.v;
  }
  if (current_reaction !== null) {
    var deps = current_reaction.deps;
    if (new_deps === null && deps !== null && deps[skipped_deps] === signal) {
      skipped_deps++;
    } else if (deps === null || skipped_deps === 0 || deps[skipped_deps - 1] !== signal) {
      if (new_deps === null) {
        new_deps = [signal];
      } else if (new_deps[new_deps.length - 1] !== signal) {
        new_deps.push(signal);
      }
    }
    if (current_untracked_writes !== null && current_effect !== null && (current_effect.f & CLEAN) !== 0 && (current_effect.f & BRANCH_EFFECT) === 0 && current_untracked_writes.includes(signal)) {
      set_signal_status(current_effect, DIRTY);
      schedule_effect(current_effect);
    }
  }
  if ((flags & DERIVED) !== 0) {
    var derived2 = (
      /** @type {Derived} */
      signal
    );
    if (check_dirtiness(derived2)) {
      update_derived(derived2);
    }
  }
  return signal.v;
}
var STATUS_MASK = ~(DIRTY | MAYBE_DIRTY | CLEAN);
function set_signal_status(signal, status) {
  signal.f = signal.f & STATUS_MASK | status;
}
function push2(props, runes = false, fn) {
  current_component_context = {
    p: current_component_context,
    c: null,
    e: null,
    m: false,
    s: props,
    x: null,
    l: null
  };
  if (!runes) {
    current_component_context.l = {
      s: null,
      u: null,
      r1: [],
      r2: /* @__PURE__ */ source(false)
    };
  }
}
function pop2(component6) {
  const context_stack_item = current_component_context;
  if (context_stack_item !== null) {
    const effects = context_stack_item.e;
    if (effects !== null) {
      context_stack_item.e = null;
      for (var i = 0; i < effects.length; i++) {
        effect(effects[i]);
      }
    }
    current_component_context = context_stack_item.p;
    context_stack_item.m = true;
  }
  return (
    /** @type {T} */
    {}
  );
}
// @__NO_SIDE_EFFECTS__
function source(v) {
  return {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v,
    reactions: null,
    equals,
    version: 0
  };
}
// @__NO_SIDE_EFFECTS__
function mutable_source(initial_value) {
  var _a;
  const s2 = /* @__PURE__ */ source(initial_value);
  s2.equals = safe_equals;
  if (current_component_context !== null && current_component_context.l !== null) {
    ((_a = current_component_context.l).s ?? (_a.s = [])).push(s2);
  }
  return s2;
}
function set(source2, value) {
  if (current_reaction !== null && is_runes() && (current_reaction.f & DERIVED) !== 0) {
    state_unsafe_mutation();
  }
  if (!source2.equals(value)) {
    source2.v = value;
    source2.version = increment_version();
    mark_reactions(source2, DIRTY);
    if (is_runes() && current_effect !== null && (current_effect.f & CLEAN) !== 0 && (current_effect.f & BRANCH_EFFECT) === 0) {
      if (new_deps !== null && new_deps.includes(source2)) {
        set_signal_status(current_effect, DIRTY);
        schedule_effect(current_effect);
      } else {
        if (current_untracked_writes === null) {
          set_current_untracked_writes([source2]);
        } else {
          current_untracked_writes.push(source2);
        }
      }
    }
  }
  return value;
}
function mark_reactions(signal, status) {
  var reactions = signal.reactions;
  if (reactions === null) return;
  var runes = is_runes();
  var length = reactions.length;
  for (var i = 0; i < length; i++) {
    var reaction = reactions[i];
    var flags = reaction.f;
    if ((flags & DIRTY) !== 0) continue;
    if (!runes && reaction === current_effect) continue;
    set_signal_status(reaction, status);
    if ((flags & (CLEAN | UNOWNED)) !== 0) {
      if ((flags & DERIVED) !== 0) {
        mark_reactions(
          /** @type {Derived} */
          reaction,
          MAYBE_DIRTY
        );
      } else {
        schedule_effect(
          /** @type {Effect} */
          reaction
        );
      }
    }
  }
}
var hydrating = false;
function set_hydrating(value) {
  hydrating = value;
}
var hydrate_node;
function set_hydrate_node(node) {
  return hydrate_node = node;
}
function hydrate_next() {
  if (hydrate_node === null) {
    hydration_mismatch();
    throw HYDRATION_ERROR;
  }
  return hydrate_node = /** @type {TemplateNode} */
  hydrate_node.nextSibling;
}
var $window;
function init_operations() {
  if ($window !== void 0) {
    return;
  }
  $window = window;
  var element_prototype = Element.prototype;
  element_prototype.__click = void 0;
  element_prototype.__className = "";
  element_prototype.__attributes = null;
  element_prototype.__e = void 0;
  Text.prototype.__t = void 0;
}
function empty() {
  return document.createTextNode("");
}
function clear_text_content(node) {
  node.textContent = "";
}
var all_registered_events = /* @__PURE__ */ new Set();
var root_event_handles = /* @__PURE__ */ new Set();
function handle_event_propagation(event) {
  var handler_element = this;
  var owner_document = (
    /** @type {Node} */
    handler_element.ownerDocument
  );
  var event_name = event.type;
  var path = event.composedPath?.() || [];
  var current_target = (
    /** @type {null | Element} */
    path[0] || event.target
  );
  var path_idx = 0;
  var handled_at = event.__root;
  if (handled_at) {
    var at_idx = path.indexOf(handled_at);
    if (at_idx !== -1 && (handler_element === document || handler_element === /** @type {any} */
    window)) {
      event.__root = handler_element;
      return;
    }
    var handler_idx = path.indexOf(handler_element);
    if (handler_idx === -1) {
      return;
    }
    if (at_idx <= handler_idx) {
      path_idx = at_idx;
    }
  }
  current_target = /** @type {Element} */
  path[path_idx] || event.target;
  if (current_target === handler_element) return;
  define_property(event, "currentTarget", {
    configurable: true,
    get() {
      return current_target || owner_document;
    }
  });
  try {
    var throw_error;
    var other_errors = [];
    while (current_target !== null) {
      var parent_element = current_target.parentNode || /** @type {any} */
      current_target.host || null;
      try {
        var delegated = current_target["__" + event_name];
        if (delegated !== void 0 && !/** @type {any} */
        current_target.disabled) {
          if (is_array(delegated)) {
            var [fn, ...data] = delegated;
            fn.apply(current_target, [event, ...data]);
          } else {
            delegated.call(current_target, event);
          }
        }
      } catch (error) {
        if (throw_error) {
          other_errors.push(error);
        } else {
          throw_error = error;
        }
      }
      if (event.cancelBubble || parent_element === handler_element || parent_element === null) {
        break;
      }
      current_target = parent_element;
    }
    if (throw_error) {
      for (let error of other_errors) {
        queueMicrotask(() => {
          throw error;
        });
      }
      throw throw_error;
    }
  } finally {
    event.__root = handler_element;
    current_target = handler_element;
  }
}
function assign_nodes(start, end) {
  current_effect.nodes ?? (current_effect.nodes = { start, end });
}
function mount(component6, options2) {
  const anchor = options2.anchor ?? options2.target.appendChild(empty());
  return _mount(component6, { ...options2, anchor });
}
function hydrate(component6, options2) {
  options2.intro = options2.intro ?? false;
  const target = options2.target;
  const was_hydrating = hydrating;
  const previous_hydrate_node = hydrate_node;
  try {
    var anchor = (
      /** @type {TemplateNode} */
      target.firstChild
    );
    while (anchor && (anchor.nodeType !== 8 || /** @type {Comment} */
    anchor.data !== HYDRATION_START)) {
      anchor = /** @type {TemplateNode} */
      anchor.nextSibling;
    }
    if (!anchor) {
      throw HYDRATION_ERROR;
    }
    set_hydrating(true);
    set_hydrate_node(
      /** @type {Comment} */
      anchor
    );
    hydrate_next();
    const instance = _mount(component6, { ...options2, anchor });
    if (hydrate_node === null || hydrate_node.nodeType !== 8 || /** @type {Comment} */
    hydrate_node.data !== HYDRATION_END) {
      hydration_mismatch();
      throw HYDRATION_ERROR;
    }
    set_hydrating(false);
    return (
      /**  @type {Exports} */
      instance
    );
  } catch (error) {
    if (error === HYDRATION_ERROR) {
      if (options2.recover === false) {
        hydration_failed();
      }
      init_operations();
      clear_text_content(target);
      set_hydrating(false);
      return mount(component6, options2);
    }
    throw error;
  } finally {
    set_hydrating(was_hydrating);
    set_hydrate_node(previous_hydrate_node);
  }
}
var document_listeners = /* @__PURE__ */ new Map();
function _mount(Component, { target, anchor, props = {}, events, context, intro = true }) {
  init_operations();
  var registered_events = /* @__PURE__ */ new Set();
  var event_handle = (events2) => {
    for (var i = 0; i < events2.length; i++) {
      var event_name = events2[i];
      if (registered_events.has(event_name)) continue;
      registered_events.add(event_name);
      var passive = is_passive_event(event_name);
      target.addEventListener(event_name, handle_event_propagation, { passive });
      var n = document_listeners.get(event_name);
      if (n === void 0) {
        document.addEventListener(event_name, handle_event_propagation, { passive });
        document_listeners.set(event_name, 1);
      } else {
        document_listeners.set(event_name, n + 1);
      }
    }
  };
  event_handle(array_from(all_registered_events));
  root_event_handles.add(event_handle);
  var component6 = void 0;
  var unmount2 = effect_root(() => {
    branch(() => {
      if (context) {
        push2({});
        var ctx = (
          /** @type {ComponentContext} */
          current_component_context
        );
        ctx.c = context;
      }
      if (events) {
        props.$$events = events;
      }
      if (hydrating) {
        assign_nodes(
          /** @type {TemplateNode} */
          anchor,
          null
        );
      }
      component6 = Component(anchor, props) || {};
      if (hydrating) {
        current_effect.nodes.end = hydrate_node;
      }
      if (context) {
        pop2();
      }
    });
    return () => {
      for (var event_name of registered_events) {
        target.removeEventListener(event_name, handle_event_propagation);
        var n = (
          /** @type {number} */
          document_listeners.get(event_name)
        );
        if (--n === 0) {
          document.removeEventListener(event_name, handle_event_propagation);
          document_listeners.delete(event_name);
        } else {
          document_listeners.set(event_name, n);
        }
      }
      root_event_handles.delete(event_handle);
      mounted_components.delete(component6);
    };
  });
  mounted_components.set(component6, unmount2);
  return component6;
}
var mounted_components = /* @__PURE__ */ new WeakMap();
function unmount(component6) {
  const fn = mounted_components.get(component6);
  fn?.();
}
function asClassComponent$1(component6) {
  return class extends Svelte4Component {
    /** @param {any} options */
    constructor(options2) {
      super({
        component: component6,
        ...options2
      });
    }
  };
}
var _events, _instance;
var Svelte4Component = class {
  /**
   * @param {ComponentConstructorOptions & {
   *  component: any;
   * 	immutable?: boolean;
   * 	hydrate?: boolean;
   * 	recover?: false;
   * }} options
   */
  constructor(options2) {
    /** @type {any} */
    __privateAdd(this, _events);
    /** @type {Record<string, any>} */
    __privateAdd(this, _instance);
    var sources = /* @__PURE__ */ new Map();
    var add_source = (key2, value) => {
      var s2 = /* @__PURE__ */ mutable_source(value);
      sources.set(key2, s2);
      return s2;
    };
    const props = new Proxy(
      { ...options2.props || {}, $$events: {} },
      {
        get(target, prop) {
          return get(sources.get(prop) ?? add_source(prop, Reflect.get(target, prop)));
        },
        has(target, prop) {
          get(sources.get(prop) ?? add_source(prop, Reflect.get(target, prop)));
          return Reflect.has(target, prop);
        },
        set(target, prop, value) {
          set(sources.get(prop) ?? add_source(prop, value), value);
          return Reflect.set(target, prop, value);
        }
      }
    );
    __privateSet(this, _instance, (options2.hydrate ? hydrate : mount)(options2.component, {
      target: options2.target,
      props,
      context: options2.context,
      intro: options2.intro ?? false,
      recover: options2.recover
    }));
    flush_sync();
    __privateSet(this, _events, props.$$events);
    for (const key2 of Object.keys(__privateGet(this, _instance))) {
      if (key2 === "$set" || key2 === "$destroy" || key2 === "$on") continue;
      define_property(this, key2, {
        get() {
          return __privateGet(this, _instance)[key2];
        },
        /** @param {any} value */
        set(value) {
          __privateGet(this, _instance)[key2] = value;
        },
        enumerable: true
      });
    }
    __privateGet(this, _instance).$set = /** @param {Record<string, any>} next */
    (next2) => {
      Object.assign(props, next2);
    };
    __privateGet(this, _instance).$destroy = () => {
      unmount(__privateGet(this, _instance));
    };
  }
  /** @param {Record<string, any>} props */
  $set(props) {
    __privateGet(this, _instance).$set(props);
  }
  /**
   * @param {string} event
   * @param {(...args: any[]) => any} callback
   * @returns {any}
   */
  $on(event, callback) {
    __privateGet(this, _events)[event] = __privateGet(this, _events)[event] || [];
    const cb = (...args) => callback.call(this, ...args);
    __privateGet(this, _events)[event].push(cb);
    return () => {
      __privateGet(this, _events)[event] = __privateGet(this, _events)[event].filter(
        /** @param {any} fn */
        (fn) => fn !== cb
      );
    };
  }
  $destroy() {
    __privateGet(this, _instance).$destroy();
  }
};
_events = new WeakMap();
_instance = new WeakMap();
function asClassComponent(component6) {
  const component_constructor = asClassComponent$1(component6);
  const _render = (props, { context } = {}) => {
    const result = render(component6, { props, context });
    return {
      css: { code: "", map: null },
      head: result.head,
      html: result.body
    };
  };
  component_constructor.render = _render;
  return component_constructor;
}
var prerendering = false;
function Root($$payload, $$props) {
  push();
  let {
    stores,
    page: page2,
    constructors,
    components = [],
    form,
    data_0 = null,
    data_1 = null
  } = $$props;
  {
    setContext("__svelte__", stores);
  }
  {
    stores.page.set(page2);
  }
  if (constructors[1]) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<!---->`;
    constructors[0]?.($$payload, {
      data: data_0,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        constructors[1]?.($$payload2, { data: data_1, form });
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<!---->`;
    constructors[0]?.($$payload, { data: data_0, form });
    $$payload.out += `<!---->`;
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  pop();
}
var root = asClassComponent(Root);
var options = {
  app_dir: "_app",
  app_template_contains_nonce: false,
  csp: { "mode": "auto", "directives": { "upgrade-insecure-requests": false, "block-all-mixed-content": false }, "reportOnly": { "upgrade-insecure-requests": false, "block-all-mixed-content": false } },
  csrf_check_origin: true,
  embedded: false,
  env_public_prefix: "PUBLIC_",
  env_private_prefix: "",
  hooks: null,
  // added lazily, via `get_hooks`
  preload_strategy: "modulepreload",
  root,
  service_worker: false,
  templates: {
    app: ({ head, body: body2, assets: assets2, nonce, env }) => '<!doctype html>\n<html lang="en" data-theme="light">\n	<head>\n		<meta charset="utf-8" />\n		<link rel="icon" href="' + assets2 + '/16x16.svg" />\n		<meta name="viewport" content="width=device-width, initial-scale=1" />\n		' + head + '\n	</head>\n	<body data-sveltekit-preload-data="hover">\n		<div style="display: contents">' + body2 + "</div>\n	</body>\n</html>\n",
    error: ({ status, message }) => '<!doctype html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<title>' + message + `</title>

		<style>
			body {
				--bg: white;
				--fg: #222;
				--divider: #ccc;
				background: var(--bg);
				color: var(--fg);
				font-family:
					system-ui,
					-apple-system,
					BlinkMacSystemFont,
					'Segoe UI',
					Roboto,
					Oxygen,
					Ubuntu,
					Cantarell,
					'Open Sans',
					'Helvetica Neue',
					sans-serif;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 100vh;
				margin: 0;
			}

			.error {
				display: flex;
				align-items: center;
				max-width: 32rem;
				margin: 0 1rem;
			}

			.status {
				font-weight: 200;
				font-size: 3rem;
				line-height: 1;
				position: relative;
				top: -0.05rem;
			}

			.message {
				border-left: 1px solid var(--divider);
				padding: 0 0 0 1rem;
				margin: 0 0 0 1rem;
				min-height: 2.5rem;
				display: flex;
				align-items: center;
			}

			.message h1 {
				font-weight: 400;
				font-size: 1em;
				margin: 0;
			}

			@media (prefers-color-scheme: dark) {
				body {
					--bg: #222;
					--fg: #ddd;
					--divider: #666;
				}
			}
		</style>
	</head>
	<body>
		<div class="error">
			<span class="status">` + status + '</span>\n			<div class="message">\n				<h1>' + message + "</h1>\n			</div>\n		</div>\n	</body>\n</html>\n"
  },
  version_hash: "14zdib5"
};
async function get_hooks() {
  return {};
}

// .svelte-kit/output/server/index.js
init_exports();
init_chunks();
var DEV = false;
var SVELTE_KIT_ASSETS = "/_svelte_kit_assets";
var ENDPOINT_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"];
var PAGE_METHODS = ["GET", "POST", "HEAD"];
function negotiate(accept, types) {
  const parts = [];
  accept.split(",").forEach((str, i) => {
    const match = /([^/ \t]+)\/([^; \t]+)[ \t]*(?:;[ \t]*q=([0-9.]+))?/.exec(str);
    if (match) {
      const [, type, subtype, q = "1"] = match;
      parts.push({ type, subtype, q: +q, i });
    }
  });
  parts.sort((a2, b) => {
    if (a2.q !== b.q) {
      return b.q - a2.q;
    }
    if (a2.subtype === "*" !== (b.subtype === "*")) {
      return a2.subtype === "*" ? 1 : -1;
    }
    if (a2.type === "*" !== (b.type === "*")) {
      return a2.type === "*" ? 1 : -1;
    }
    return a2.i - b.i;
  });
  let accepted;
  let min_priority = Infinity;
  for (const mimetype of types) {
    const [type, subtype] = mimetype.split("/");
    const priority = parts.findIndex(
      (part) => (part.type === type || part.type === "*") && (part.subtype === subtype || part.subtype === "*")
    );
    if (priority !== -1 && priority < min_priority) {
      accepted = mimetype;
      min_priority = priority;
    }
  }
  return accepted;
}
function is_content_type(request, ...types) {
  const type = request.headers.get("content-type")?.split(";", 1)[0].trim() ?? "";
  return types.includes(type.toLowerCase());
}
function is_form_content_type(request) {
  return is_content_type(
    request,
    "application/x-www-form-urlencoded",
    "multipart/form-data",
    "text/plain"
  );
}
var HttpError = class {
  /**
   * @param {number} status
   * @param {{message: string} extends App.Error ? (App.Error | string | undefined) : App.Error} body
   */
  constructor(status, body2) {
    this.status = status;
    if (typeof body2 === "string") {
      this.body = { message: body2 };
    } else if (body2) {
      this.body = body2;
    } else {
      this.body = { message: `Error: ${status}` };
    }
  }
  toString() {
    return JSON.stringify(this.body);
  }
};
var Redirect = class {
  /**
   * @param {300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308} status
   * @param {string} location
   */
  constructor(status, location) {
    this.status = status;
    this.location = location;
  }
};
var SvelteKitError = class extends Error {
  /**
   * @param {number} status
   * @param {string} text
   * @param {string} message
   */
  constructor(status, text2, message) {
    super(message);
    this.status = status;
    this.text = text2;
  }
};
var ActionFailure = class {
  /**
   * @param {number} status
   * @param {T} data
   */
  constructor(status, data) {
    this.status = status;
    this.data = data;
  }
};
function json(data, init2) {
  const body2 = JSON.stringify(data);
  const headers2 = new Headers(init2?.headers);
  if (!headers2.has("content-length")) {
    headers2.set("content-length", encoder$3.encode(body2).byteLength.toString());
  }
  if (!headers2.has("content-type")) {
    headers2.set("content-type", "application/json");
  }
  return new Response(body2, {
    ...init2,
    headers: headers2
  });
}
var encoder$3 = new TextEncoder();
function text(body2, init2) {
  const headers2 = new Headers(init2?.headers);
  if (!headers2.has("content-length")) {
    const encoded = encoder$3.encode(body2);
    headers2.set("content-length", encoded.byteLength.toString());
    return new Response(encoded, {
      ...init2,
      headers: headers2
    });
  }
  return new Response(body2, {
    ...init2,
    headers: headers2
  });
}
function coalesce_to_error(err) {
  return err instanceof Error || err && /** @type {any} */
  err.name && /** @type {any} */
  err.message ? (
    /** @type {Error} */
    err
  ) : new Error(JSON.stringify(err));
}
function normalize_error(error) {
  return (
    /** @type {import('../runtime/control.js').Redirect | HttpError | SvelteKitError | Error} */
    error
  );
}
function get_status(error) {
  return error instanceof HttpError || error instanceof SvelteKitError ? error.status : 500;
}
function get_message(error) {
  return error instanceof SvelteKitError ? error.text : "Internal Error";
}
function method_not_allowed(mod, method) {
  return text(`${method} method not allowed`, {
    status: 405,
    headers: {
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405
      // "The server must generate an Allow header field in a 405 status code response"
      allow: allowed_methods(mod).join(", ")
    }
  });
}
function allowed_methods(mod) {
  const allowed = ENDPOINT_METHODS.filter((method) => method in mod);
  if ("GET" in mod || "HEAD" in mod) allowed.push("HEAD");
  return allowed;
}
function static_error_page(options2, status, message) {
  let page2 = options2.templates.error({ status, message });
  return text(page2, {
    headers: { "content-type": "text/html; charset=utf-8" },
    status
  });
}
async function handle_fatal_error(event, options2, error) {
  error = error instanceof HttpError ? error : coalesce_to_error(error);
  const status = get_status(error);
  const body2 = await handle_error_and_jsonify(event, options2, error);
  const type = negotiate(event.request.headers.get("accept") || "text/html", [
    "application/json",
    "text/html"
  ]);
  if (event.isDataRequest || type === "application/json") {
    return json(body2, {
      status
    });
  }
  return static_error_page(options2, status, body2.message);
}
async function handle_error_and_jsonify(event, options2, error) {
  if (error instanceof HttpError) {
    return error.body;
  }
  const status = get_status(error);
  const message = get_message(error);
  return await options2.hooks.handleError({ error, event, status, message }) ?? { message };
}
function redirect_response(status, location) {
  const response = new Response(void 0, {
    status,
    headers: { location }
  });
  return response;
}
function clarify_devalue_error(event, error) {
  if (error.path) {
    return `Data returned from \`load\` while rendering ${event.route.id} is not serializable: ${error.message} (data${error.path})`;
  }
  if (error.path === "") {
    return `Data returned from \`load\` while rendering ${event.route.id} is not a plain object`;
  }
  return error.message;
}
function stringify_uses(node) {
  const uses = [];
  if (node.uses && node.uses.dependencies.size > 0) {
    uses.push(`"dependencies":${JSON.stringify(Array.from(node.uses.dependencies))}`);
  }
  if (node.uses && node.uses.search_params.size > 0) {
    uses.push(`"search_params":${JSON.stringify(Array.from(node.uses.search_params))}`);
  }
  if (node.uses && node.uses.params.size > 0) {
    uses.push(`"params":${JSON.stringify(Array.from(node.uses.params))}`);
  }
  if (node.uses?.parent) uses.push('"parent":1');
  if (node.uses?.route) uses.push('"route":1');
  if (node.uses?.url) uses.push('"url":1');
  return `"uses":{${uses.join(",")}}`;
}
async function render_endpoint(event, mod, state) {
  const method = (
    /** @type {import('types').HttpMethod} */
    event.request.method
  );
  let handler2 = mod[method] || mod.fallback;
  if (method === "HEAD" && mod.GET && !mod.HEAD) {
    handler2 = mod.GET;
  }
  if (!handler2) {
    return method_not_allowed(mod, method);
  }
  const prerender = mod.prerender ?? state.prerender_default;
  if (prerender && (mod.POST || mod.PATCH || mod.PUT || mod.DELETE)) {
    throw new Error("Cannot prerender endpoints that have mutative methods");
  }
  if (state.prerendering && !prerender) {
    if (state.depth > 0) {
      throw new Error(`${event.route.id} is not prerenderable`);
    } else {
      return new Response(void 0, { status: 204 });
    }
  }
  try {
    let response = await handler2(
      /** @type {import('@sveltejs/kit').RequestEvent<Record<string, any>>} */
      event
    );
    if (!(response instanceof Response)) {
      throw new Error(
        `Invalid response from route ${event.url.pathname}: handler should return a Response object`
      );
    }
    if (state.prerendering) {
      response = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: new Headers(response.headers)
      });
      response.headers.set("x-sveltekit-prerender", String(prerender));
    }
    return response;
  } catch (e) {
    if (e instanceof Redirect) {
      return new Response(void 0, {
        status: e.status,
        headers: { location: e.location }
      });
    }
    throw e;
  }
}
function is_endpoint_request(event) {
  const { method, headers: headers2 } = event.request;
  if (ENDPOINT_METHODS.includes(method) && !PAGE_METHODS.includes(method)) {
    return true;
  }
  if (method === "POST" && headers2.get("x-sveltekit-action") === "true") return false;
  const accept = event.request.headers.get("accept") ?? "*/*";
  return negotiate(accept, ["*", "text/html"]) !== "text/html";
}
function compact(arr) {
  return arr.filter(
    /** @returns {val is NonNullable<T>} */
    (val) => val != null
  );
}
var escaped = {
  "<": "\\u003C",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var DevalueError = class extends Error {
  /**
   * @param {string} message
   * @param {string[]} keys
   */
  constructor(message, keys) {
    super(message);
    this.name = "DevalueError";
    this.path = keys.join("");
  }
};
function is_primitive(thing) {
  return Object(thing) !== thing;
}
var object_proto_names = /* @__PURE__ */ Object.getOwnPropertyNames(
  Object.prototype
).sort().join("\0");
function is_plain_object(thing) {
  const proto = Object.getPrototypeOf(thing);
  return proto === Object.prototype || proto === null || Object.getOwnPropertyNames(proto).sort().join("\0") === object_proto_names;
}
function get_type(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function get_escaped_char(char) {
  switch (char) {
    case '"':
      return '\\"';
    case "<":
      return "\\u003C";
    case "\\":
      return "\\\\";
    case "\n":
      return "\\n";
    case "\r":
      return "\\r";
    case "	":
      return "\\t";
    case "\b":
      return "\\b";
    case "\f":
      return "\\f";
    case "\u2028":
      return "\\u2028";
    case "\u2029":
      return "\\u2029";
    default:
      return char < " " ? `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}` : "";
  }
}
function stringify_string(str) {
  let result = "";
  let last_pos = 0;
  const len = str.length;
  for (let i = 0; i < len; i += 1) {
    const char = str[i];
    const replacement = get_escaped_char(char);
    if (replacement) {
      result += str.slice(last_pos, i) + replacement;
      last_pos = i + 1;
    }
  }
  return `"${last_pos === 0 ? str : result + str.slice(last_pos)}"`;
}
function enumerable_symbols(object) {
  return Object.getOwnPropertySymbols(object).filter(
    (symbol) => Object.getOwnPropertyDescriptor(object, symbol).enumerable
  );
}
var chars$1 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafe_chars = /[<\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
function uneval(value, replacer) {
  const counts = /* @__PURE__ */ new Map();
  const keys = [];
  const custom = /* @__PURE__ */ new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new DevalueError(`Cannot stringify a function`, keys);
    }
    if (!is_primitive(thing)) {
      if (counts.has(thing)) {
        counts.set(thing, counts.get(thing) + 1);
        return;
      }
      counts.set(thing, 1);
      if (replacer) {
        const str2 = replacer(thing);
        if (typeof str2 === "string") {
          custom.set(thing, str2);
          return;
        }
      }
      const type = get_type(thing);
      switch (type) {
        case "Number":
        case "BigInt":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach((value2, i) => {
            keys.push(`[${i}]`);
            walk(value2);
            keys.pop();
          });
          break;
        case "Set":
          Array.from(thing).forEach(walk);
          break;
        case "Map":
          for (const [key2, value2] of thing) {
            keys.push(
              `.get(${is_primitive(key2) ? stringify_primitive$1(key2) : "..."})`
            );
            walk(value2);
            keys.pop();
          }
          break;
        default:
          if (!is_plain_object(thing)) {
            throw new DevalueError(
              `Cannot stringify arbitrary non-POJOs`,
              keys
            );
          }
          if (enumerable_symbols(thing).length > 0) {
            throw new DevalueError(
              `Cannot stringify POJOs with symbolic keys`,
              keys
            );
          }
          for (const key2 in thing) {
            keys.push(`.${key2}`);
            walk(thing[key2]);
            keys.pop();
          }
      }
    }
  }
  walk(value);
  const names = /* @__PURE__ */ new Map();
  Array.from(counts).filter((entry) => entry[1] > 1).sort((a2, b) => b[1] - a2[1]).forEach((entry, i) => {
    names.set(entry[0], get_name(i));
  });
  function stringify22(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (is_primitive(thing)) {
      return stringify_primitive$1(thing);
    }
    if (custom.has(thing)) {
      return custom.get(thing);
    }
    const type = get_type(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return `Object(${stringify22(thing.valueOf())})`;
      case "RegExp":
        return `new RegExp(${stringify_string(thing.source)}, "${thing.flags}")`;
      case "Date":
        return `new Date(${thing.getTime()})`;
      case "Array":
        const members = (
          /** @type {any[]} */
          thing.map(
            (v, i) => i in thing ? stringify22(v) : ""
          )
        );
        const tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return `[${members.join(",")}${tail}]`;
      case "Set":
      case "Map":
        return `new ${type}([${Array.from(thing).map(stringify22).join(",")}])`;
      default:
        const obj = `{${Object.keys(thing).map((key2) => `${safe_key(key2)}:${stringify22(thing[key2])}`).join(",")}}`;
        const proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? `Object.assign(Object.create(null),${obj})` : `Object.create(null)`;
        }
        return obj;
    }
  }
  const str = stringify22(value);
  if (names.size) {
    const params = [];
    const statements = [];
    const values = [];
    names.forEach((name2, thing) => {
      params.push(name2);
      if (custom.has(thing)) {
        values.push(
          /** @type {string} */
          custom.get(thing)
        );
        return;
      }
      if (is_primitive(thing)) {
        values.push(stringify_primitive$1(thing));
        return;
      }
      const type = get_type(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values.push(`Object(${stringify22(thing.valueOf())})`);
          break;
        case "RegExp":
          values.push(thing.toString());
          break;
        case "Date":
          values.push(`new Date(${thing.getTime()})`);
          break;
        case "Array":
          values.push(`Array(${thing.length})`);
          thing.forEach((v, i) => {
            statements.push(`${name2}[${i}]=${stringify22(v)}`);
          });
          break;
        case "Set":
          values.push(`new Set`);
          statements.push(
            `${name2}.${Array.from(thing).map((v) => `add(${stringify22(v)})`).join(".")}`
          );
          break;
        case "Map":
          values.push(`new Map`);
          statements.push(
            `${name2}.${Array.from(thing).map(([k, v]) => `set(${stringify22(k)}, ${stringify22(v)})`).join(".")}`
          );
          break;
        default:
          values.push(
            Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}"
          );
          Object.keys(thing).forEach((key2) => {
            statements.push(
              `${name2}${safe_prop(key2)}=${stringify22(thing[key2])}`
            );
          });
      }
    });
    statements.push(`return ${str}`);
    return `(function(${params.join(",")}){${statements.join(
      ";"
    )}}(${values.join(",")}))`;
  } else {
    return str;
  }
}
function get_name(num) {
  let name2 = "";
  do {
    name2 = chars$1[num % chars$1.length] + name2;
    num = ~~(num / chars$1.length) - 1;
  } while (num >= 0);
  return reserved.test(name2) ? `${name2}0` : name2;
}
function escape_unsafe_char(c2) {
  return escaped[c2] || c2;
}
function escape_unsafe_chars(str) {
  return str.replace(unsafe_chars, escape_unsafe_char);
}
function safe_key(key2) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key2) ? key2 : escape_unsafe_chars(JSON.stringify(key2));
}
function safe_prop(key2) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key2) ? `.${key2}` : `[${escape_unsafe_chars(JSON.stringify(key2))}]`;
}
function stringify_primitive$1(thing) {
  if (typeof thing === "string") return stringify_string(thing);
  if (thing === void 0) return "void 0";
  if (thing === 0 && 1 / thing < 0) return "-0";
  const str = String(thing);
  if (typeof thing === "number") return str.replace(/^(-)?0\./, "$1.");
  if (typeof thing === "bigint") return thing + "n";
  return str;
}
var UNDEFINED = -1;
var HOLE = -2;
var NAN = -3;
var POSITIVE_INFINITY = -4;
var NEGATIVE_INFINITY = -5;
var NEGATIVE_ZERO = -6;
function stringify2(value, reducers) {
  const stringified = [];
  const indexes = /* @__PURE__ */ new Map();
  const custom = [];
  for (const key2 in reducers) {
    custom.push({ key: key2, fn: reducers[key2] });
  }
  const keys = [];
  let p = 0;
  function flatten(thing) {
    if (typeof thing === "function") {
      throw new DevalueError(`Cannot stringify a function`, keys);
    }
    if (indexes.has(thing)) return indexes.get(thing);
    if (thing === void 0) return UNDEFINED;
    if (Number.isNaN(thing)) return NAN;
    if (thing === Infinity) return POSITIVE_INFINITY;
    if (thing === -Infinity) return NEGATIVE_INFINITY;
    if (thing === 0 && 1 / thing < 0) return NEGATIVE_ZERO;
    const index22 = p++;
    indexes.set(thing, index22);
    for (const { key: key2, fn } of custom) {
      const value2 = fn(thing);
      if (value2) {
        stringified[index22] = `["${key2}",${flatten(value2)}]`;
        return index22;
      }
    }
    let str = "";
    if (is_primitive(thing)) {
      str = stringify_primitive(thing);
    } else {
      const type = get_type(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          str = `["Object",${stringify_primitive(thing)}]`;
          break;
        case "BigInt":
          str = `["BigInt",${thing}]`;
          break;
        case "Date":
          const valid = !isNaN(thing.getDate());
          str = `["Date","${valid ? thing.toISOString() : ""}"]`;
          break;
        case "RegExp":
          const { source: source2, flags } = thing;
          str = flags ? `["RegExp",${stringify_string(source2)},"${flags}"]` : `["RegExp",${stringify_string(source2)}]`;
          break;
        case "Array":
          str = "[";
          for (let i = 0; i < thing.length; i += 1) {
            if (i > 0) str += ",";
            if (i in thing) {
              keys.push(`[${i}]`);
              str += flatten(thing[i]);
              keys.pop();
            } else {
              str += HOLE;
            }
          }
          str += "]";
          break;
        case "Set":
          str = '["Set"';
          for (const value2 of thing) {
            str += `,${flatten(value2)}`;
          }
          str += "]";
          break;
        case "Map":
          str = '["Map"';
          for (const [key2, value2] of thing) {
            keys.push(
              `.get(${is_primitive(key2) ? stringify_primitive(key2) : "..."})`
            );
            str += `,${flatten(key2)},${flatten(value2)}`;
            keys.pop();
          }
          str += "]";
          break;
        default:
          if (!is_plain_object(thing)) {
            throw new DevalueError(
              `Cannot stringify arbitrary non-POJOs`,
              keys
            );
          }
          if (enumerable_symbols(thing).length > 0) {
            throw new DevalueError(
              `Cannot stringify POJOs with symbolic keys`,
              keys
            );
          }
          if (Object.getPrototypeOf(thing) === null) {
            str = '["null"';
            for (const key2 in thing) {
              keys.push(`.${key2}`);
              str += `,${stringify_string(key2)},${flatten(thing[key2])}`;
              keys.pop();
            }
            str += "]";
          } else {
            str = "{";
            let started = false;
            for (const key2 in thing) {
              if (started) str += ",";
              started = true;
              keys.push(`.${key2}`);
              str += `${stringify_string(key2)}:${flatten(thing[key2])}`;
              keys.pop();
            }
            str += "}";
          }
      }
    }
    stringified[index22] = str;
    return index22;
  }
  const index7 = flatten(value);
  if (index7 < 0) return `${index7}`;
  return `[${stringified.join(",")}]`;
}
function stringify_primitive(thing) {
  const type = typeof thing;
  if (type === "string") return stringify_string(thing);
  if (thing instanceof String) return stringify_string(thing.toString());
  if (thing === void 0) return UNDEFINED.toString();
  if (thing === 0 && 1 / thing < 0) return NEGATIVE_ZERO.toString();
  if (type === "bigint") return `["BigInt","${thing}"]`;
  return String(thing);
}
function is_action_json_request(event) {
  const accept = negotiate(event.request.headers.get("accept") ?? "*/*", [
    "application/json",
    "text/html"
  ]);
  return accept === "application/json" && event.request.method === "POST";
}
async function handle_action_json_request(event, options2, server2) {
  const actions = server2?.actions;
  if (!actions) {
    const no_actions_error = new SvelteKitError(
      405,
      "Method Not Allowed",
      "POST method not allowed. No actions exist for this page"
    );
    return action_json(
      {
        type: "error",
        error: await handle_error_and_jsonify(event, options2, no_actions_error)
      },
      {
        status: no_actions_error.status,
        headers: {
          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405
          // "The server must generate an Allow header field in a 405 status code response"
          allow: "GET"
        }
      }
    );
  }
  check_named_default_separate(actions);
  try {
    const data = await call_action(event, actions);
    if (false) ;
    if (data instanceof ActionFailure) {
      return action_json({
        type: "failure",
        status: data.status,
        // @ts-expect-error we assign a string to what is supposed to be an object. That's ok
        // because we don't use the object outside, and this way we have better code navigation
        // through knowing where the related interface is used.
        data: stringify_action_response(
          data.data,
          /** @type {string} */
          event.route.id
        )
      });
    } else {
      return action_json({
        type: "success",
        status: data ? 200 : 204,
        // @ts-expect-error see comment above
        data: stringify_action_response(
          data,
          /** @type {string} */
          event.route.id
        )
      });
    }
  } catch (e) {
    const err = normalize_error(e);
    if (err instanceof Redirect) {
      return action_json_redirect(err);
    }
    return action_json(
      {
        type: "error",
        error: await handle_error_and_jsonify(event, options2, check_incorrect_fail_use(err))
      },
      {
        status: get_status(err)
      }
    );
  }
}
function check_incorrect_fail_use(error) {
  return error instanceof ActionFailure ? new Error('Cannot "throw fail()". Use "return fail()"') : error;
}
function action_json_redirect(redirect) {
  return action_json({
    type: "redirect",
    status: redirect.status,
    location: redirect.location
  });
}
function action_json(data, init2) {
  return json(data, init2);
}
function is_action_request(event) {
  return event.request.method === "POST";
}
async function handle_action_request(event, server2) {
  const actions = server2?.actions;
  if (!actions) {
    event.setHeaders({
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405
      // "The server must generate an Allow header field in a 405 status code response"
      allow: "GET"
    });
    return {
      type: "error",
      error: new SvelteKitError(
        405,
        "Method Not Allowed",
        "POST method not allowed. No actions exist for this page"
      )
    };
  }
  check_named_default_separate(actions);
  try {
    const data = await call_action(event, actions);
    if (false) ;
    if (data instanceof ActionFailure) {
      return {
        type: "failure",
        status: data.status,
        data: data.data
      };
    } else {
      return {
        type: "success",
        status: 200,
        // @ts-expect-error this will be removed upon serialization, so `undefined` is the same as omission
        data
      };
    }
  } catch (e) {
    const err = normalize_error(e);
    if (err instanceof Redirect) {
      return {
        type: "redirect",
        status: err.status,
        location: err.location
      };
    }
    return {
      type: "error",
      error: check_incorrect_fail_use(err)
    };
  }
}
function check_named_default_separate(actions) {
  if (actions.default && Object.keys(actions).length > 1) {
    throw new Error(
      "When using named actions, the default action cannot be used. See the docs for more info: https://kit.svelte.dev/docs/form-actions#named-actions"
    );
  }
}
async function call_action(event, actions) {
  const url = new URL(event.request.url);
  let name2 = "default";
  for (const param of url.searchParams) {
    if (param[0].startsWith("/")) {
      name2 = param[0].slice(1);
      if (name2 === "default") {
        throw new Error('Cannot use reserved action name "default"');
      }
      break;
    }
  }
  const action = actions[name2];
  if (!action) {
    throw new SvelteKitError(404, "Not Found", `No action with name '${name2}' found`);
  }
  if (!is_form_content_type(event.request)) {
    throw new SvelteKitError(
      415,
      "Unsupported Media Type",
      `Form actions expect form-encoded data \u2014 received ${event.request.headers.get(
        "content-type"
      )}`
    );
  }
  return action(event);
}
function uneval_action_response(data, route_id) {
  return try_deserialize(data, uneval, route_id);
}
function stringify_action_response(data, route_id) {
  return try_deserialize(data, stringify2, route_id);
}
function try_deserialize(data, fn, route_id) {
  try {
    return fn(data);
  } catch (e) {
    const error = (
      /** @type {any} */
      e
    );
    if ("path" in error) {
      let message = `Data returned from action inside ${route_id} is not serializable: ${error.message}`;
      if (error.path !== "") message += ` (data.${error.path})`;
      throw new Error(message);
    }
    throw error;
  }
}
var INVALIDATED_PARAM = "x-sveltekit-invalidated";
var TRAILING_SLASH_PARAM = "x-sveltekit-trailing-slash";
function b64_encode(buffer) {
  if (globalThis.Buffer) {
    return Buffer.from(buffer).toString("base64");
  }
  const little_endian = new Uint8Array(new Uint16Array([1]).buffer)[0] > 0;
  return btoa(
    new TextDecoder(little_endian ? "utf-16le" : "utf-16be").decode(
      new Uint16Array(new Uint8Array(buffer))
    )
  );
}
async function load_server_data({ event, state, node, parent }) {
  if (!node?.server) return null;
  let is_tracking = true;
  const uses = {
    dependencies: /* @__PURE__ */ new Set(),
    params: /* @__PURE__ */ new Set(),
    parent: false,
    route: false,
    url: false,
    search_params: /* @__PURE__ */ new Set()
  };
  const url = make_trackable(
    event.url,
    () => {
      if (is_tracking) {
        uses.url = true;
      }
    },
    (param) => {
      if (is_tracking) {
        uses.search_params.add(param);
      }
    }
  );
  if (state.prerendering) {
    disable_search(url);
  }
  const result = await node.server.load?.call(null, {
    ...event,
    fetch: (info, init2) => {
      new URL(info instanceof Request ? info.url : info, event.url);
      return event.fetch(info, init2);
    },
    /** @param {string[]} deps */
    depends: (...deps) => {
      for (const dep of deps) {
        const { href } = new URL(dep, event.url);
        uses.dependencies.add(href);
      }
    },
    params: new Proxy(event.params, {
      get: (target, key2) => {
        if (is_tracking) {
          uses.params.add(key2);
        }
        return target[
          /** @type {string} */
          key2
        ];
      }
    }),
    parent: async () => {
      if (is_tracking) {
        uses.parent = true;
      }
      return parent();
    },
    route: new Proxy(event.route, {
      get: (target, key2) => {
        if (is_tracking) {
          uses.route = true;
        }
        return target[
          /** @type {'id'} */
          key2
        ];
      }
    }),
    url,
    untrack(fn) {
      is_tracking = false;
      try {
        return fn();
      } finally {
        is_tracking = true;
      }
    }
  });
  return {
    type: "data",
    data: result ?? null,
    uses,
    slash: node.server.trailingSlash
  };
}
async function load_data({
  event,
  fetched,
  node,
  parent,
  server_data_promise,
  state,
  resolve_opts,
  csr
}) {
  const server_data_node = await server_data_promise;
  if (!node?.universal?.load) {
    return server_data_node?.data ?? null;
  }
  const result = await node.universal.load.call(null, {
    url: event.url,
    params: event.params,
    data: server_data_node?.data ?? null,
    route: event.route,
    fetch: create_universal_fetch(event, state, fetched, csr, resolve_opts),
    setHeaders: event.setHeaders,
    depends: () => {
    },
    parent,
    untrack: (fn) => fn()
  });
  return result ?? null;
}
function create_universal_fetch(event, state, fetched, csr, resolve_opts) {
  const universal_fetch = async (input, init2) => {
    const cloned_body = input instanceof Request && input.body ? input.clone().body : null;
    const cloned_headers = input instanceof Request && [...input.headers].length ? new Headers(input.headers) : init2?.headers;
    let response = await event.fetch(input, init2);
    const url = new URL(input instanceof Request ? input.url : input, event.url);
    const same_origin = url.origin === event.url.origin;
    let dependency;
    if (same_origin) {
      if (state.prerendering) {
        dependency = { response, body: null };
        state.prerendering.dependencies.set(url.pathname, dependency);
      }
    } else {
      const mode = input instanceof Request ? input.mode : init2?.mode ?? "cors";
      if (mode === "no-cors") {
        response = new Response("", {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        });
      } else {
        const acao = response.headers.get("access-control-allow-origin");
        if (!acao || acao !== event.url.origin && acao !== "*") {
          throw new Error(
            `CORS error: ${acao ? "Incorrect" : "No"} 'Access-Control-Allow-Origin' header is present on the requested resource`
          );
        }
      }
    }
    const proxy = new Proxy(response, {
      get(response2, key2, _receiver) {
        async function push_fetched(body2, is_b64) {
          const status_number = Number(response2.status);
          if (isNaN(status_number)) {
            throw new Error(
              `response.status is not a number. value: "${response2.status}" type: ${typeof response2.status}`
            );
          }
          fetched.push({
            url: same_origin ? url.href.slice(event.url.origin.length) : url.href,
            method: event.request.method,
            request_body: (
              /** @type {string | ArrayBufferView | undefined} */
              input instanceof Request && cloned_body ? await stream_to_string(cloned_body) : init2?.body
            ),
            request_headers: cloned_headers,
            response_body: body2,
            response: response2,
            is_b64
          });
        }
        if (key2 === "arrayBuffer") {
          return async () => {
            const buffer = await response2.arrayBuffer();
            if (dependency) {
              dependency.body = new Uint8Array(buffer);
            }
            if (buffer instanceof ArrayBuffer) {
              await push_fetched(b64_encode(buffer), true);
            }
            return buffer;
          };
        }
        async function text2() {
          const body2 = await response2.text();
          if (!body2 || typeof body2 === "string") {
            await push_fetched(body2, false);
          }
          if (dependency) {
            dependency.body = body2;
          }
          return body2;
        }
        if (key2 === "text") {
          return text2;
        }
        if (key2 === "json") {
          return async () => {
            return JSON.parse(await text2());
          };
        }
        return Reflect.get(response2, key2, response2);
      }
    });
    if (csr) {
      const get4 = response.headers.get;
      response.headers.get = (key2) => {
        const lower = key2.toLowerCase();
        const value = get4.call(response.headers, lower);
        if (value && !lower.startsWith("x-sveltekit-")) {
          const included = resolve_opts.filterSerializedResponseHeaders(lower, value);
          if (!included) {
            throw new Error(
              `Failed to get response header "${lower}" \u2014 it must be included by the \`filterSerializedResponseHeaders\` option: https://kit.svelte.dev/docs/hooks#server-hooks-handle (at ${event.route.id})`
            );
          }
        }
        return value;
      };
    }
    return proxy;
  };
  return (input, init2) => {
    const response = universal_fetch(input, init2);
    response.catch(() => {
    });
    return response;
  };
}
async function stream_to_string(stream) {
  let result = "";
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    result += decoder.decode(value);
  }
  return result;
}
function hash(...values) {
  let hash2 = 5381;
  for (const value of values) {
    if (typeof value === "string") {
      let i = value.length;
      while (i) hash2 = hash2 * 33 ^ value.charCodeAt(--i);
    } else if (ArrayBuffer.isView(value)) {
      const buffer = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
      let i = buffer.length;
      while (i) hash2 = hash2 * 33 ^ buffer[--i];
    } else {
      throw new TypeError("value must be a string or TypedArray");
    }
  }
  return (hash2 >>> 0).toString(36);
}
var escape_html_attr_dict = {
  "&": "&amp;",
  '"': "&quot;"
};
var escape_html_attr_regex = new RegExp(
  // special characters
  `[${Object.keys(escape_html_attr_dict).join("")}]|[\\ud800-\\udbff](?![\\udc00-\\udfff])|[\\ud800-\\udbff][\\udc00-\\udfff]|[\\udc00-\\udfff]`,
  "g"
);
function escape_html_attr(str) {
  const escaped_str = str.replace(escape_html_attr_regex, (match) => {
    if (match.length === 2) {
      return match;
    }
    return escape_html_attr_dict[match] ?? `&#${match.charCodeAt(0)};`;
  });
  return `"${escaped_str}"`;
}
var replacements = {
  "<": "\\u003C",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var pattern = new RegExp(`[${Object.keys(replacements).join("")}]`, "g");
function serialize_data(fetched, filter, prerendering2 = false) {
  const headers2 = {};
  let cache_control = null;
  let age = null;
  let varyAny = false;
  for (const [key2, value] of fetched.response.headers) {
    if (filter(key2, value)) {
      headers2[key2] = value;
    }
    if (key2 === "cache-control") cache_control = value;
    else if (key2 === "age") age = value;
    else if (key2 === "vary" && value.trim() === "*") varyAny = true;
  }
  const payload = {
    status: fetched.response.status,
    statusText: fetched.response.statusText,
    headers: headers2,
    body: fetched.response_body
  };
  const safe_payload = JSON.stringify(payload).replace(pattern, (match) => replacements[match]);
  const attrs = [
    'type="application/json"',
    "data-sveltekit-fetched",
    `data-url=${escape_html_attr(fetched.url)}`
  ];
  if (fetched.is_b64) {
    attrs.push("data-b64");
  }
  if (fetched.request_headers || fetched.request_body) {
    const values = [];
    if (fetched.request_headers) {
      values.push([...new Headers(fetched.request_headers)].join(","));
    }
    if (fetched.request_body) {
      values.push(fetched.request_body);
    }
    attrs.push(`data-hash="${hash(...values)}"`);
  }
  if (!prerendering2 && fetched.method === "GET" && cache_control && !varyAny) {
    const match = /s-maxage=(\d+)/g.exec(cache_control) ?? /max-age=(\d+)/g.exec(cache_control);
    if (match) {
      const ttl = +match[1] - +(age ?? "0");
      attrs.push(`data-ttl="${ttl}"`);
    }
  }
  return `<script ${attrs.join(" ")}>${safe_payload}<\/script>`;
}
var s = JSON.stringify;
var encoder$2 = new TextEncoder();
function sha256(data) {
  if (!key[0]) precompute();
  const out = init.slice(0);
  const array2 = encode$1(data);
  for (let i = 0; i < array2.length; i += 16) {
    const w = array2.subarray(i, i + 16);
    let tmp;
    let a2;
    let b;
    let out0 = out[0];
    let out1 = out[1];
    let out2 = out[2];
    let out3 = out[3];
    let out4 = out[4];
    let out5 = out[5];
    let out6 = out[6];
    let out7 = out[7];
    for (let i2 = 0; i2 < 64; i2++) {
      if (i2 < 16) {
        tmp = w[i2];
      } else {
        a2 = w[i2 + 1 & 15];
        b = w[i2 + 14 & 15];
        tmp = w[i2 & 15] = (a2 >>> 7 ^ a2 >>> 18 ^ a2 >>> 3 ^ a2 << 25 ^ a2 << 14) + (b >>> 17 ^ b >>> 19 ^ b >>> 10 ^ b << 15 ^ b << 13) + w[i2 & 15] + w[i2 + 9 & 15] | 0;
      }
      tmp = tmp + out7 + (out4 >>> 6 ^ out4 >>> 11 ^ out4 >>> 25 ^ out4 << 26 ^ out4 << 21 ^ out4 << 7) + (out6 ^ out4 & (out5 ^ out6)) + key[i2];
      out7 = out6;
      out6 = out5;
      out5 = out4;
      out4 = out3 + tmp | 0;
      out3 = out2;
      out2 = out1;
      out1 = out0;
      out0 = tmp + (out1 & out2 ^ out3 & (out1 ^ out2)) + (out1 >>> 2 ^ out1 >>> 13 ^ out1 >>> 22 ^ out1 << 30 ^ out1 << 19 ^ out1 << 10) | 0;
    }
    out[0] = out[0] + out0 | 0;
    out[1] = out[1] + out1 | 0;
    out[2] = out[2] + out2 | 0;
    out[3] = out[3] + out3 | 0;
    out[4] = out[4] + out4 | 0;
    out[5] = out[5] + out5 | 0;
    out[6] = out[6] + out6 | 0;
    out[7] = out[7] + out7 | 0;
  }
  const bytes = new Uint8Array(out.buffer);
  reverse_endianness(bytes);
  return base64(bytes);
}
var init = new Uint32Array(8);
var key = new Uint32Array(64);
function precompute() {
  function frac(x) {
    return (x - Math.floor(x)) * 4294967296;
  }
  let prime = 2;
  for (let i = 0; i < 64; prime++) {
    let is_prime = true;
    for (let factor = 2; factor * factor <= prime; factor++) {
      if (prime % factor === 0) {
        is_prime = false;
        break;
      }
    }
    if (is_prime) {
      if (i < 8) {
        init[i] = frac(prime ** (1 / 2));
      }
      key[i] = frac(prime ** (1 / 3));
      i++;
    }
  }
}
function reverse_endianness(bytes) {
  for (let i = 0; i < bytes.length; i += 4) {
    const a2 = bytes[i + 0];
    const b = bytes[i + 1];
    const c2 = bytes[i + 2];
    const d = bytes[i + 3];
    bytes[i + 0] = d;
    bytes[i + 1] = c2;
    bytes[i + 2] = b;
    bytes[i + 3] = a2;
  }
}
function encode$1(str) {
  const encoded = encoder$2.encode(str);
  const length = encoded.length * 8;
  const size2 = 512 * Math.ceil((length + 65) / 512);
  const bytes = new Uint8Array(size2 / 8);
  bytes.set(encoded);
  bytes[encoded.length] = 128;
  reverse_endianness(bytes);
  const words = new Uint32Array(bytes.buffer);
  words[words.length - 2] = Math.floor(length / 4294967296);
  words[words.length - 1] = length;
  return words;
}
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
function base64(bytes) {
  const l = bytes.length;
  let result = "";
  let i;
  for (i = 2; i < l; i += 3) {
    result += chars[bytes[i - 2] >> 2];
    result += chars[(bytes[i - 2] & 3) << 4 | bytes[i - 1] >> 4];
    result += chars[(bytes[i - 1] & 15) << 2 | bytes[i] >> 6];
    result += chars[bytes[i] & 63];
  }
  if (i === l + 1) {
    result += chars[bytes[i - 2] >> 2];
    result += chars[(bytes[i - 2] & 3) << 4];
    result += "==";
  }
  if (i === l) {
    result += chars[bytes[i - 2] >> 2];
    result += chars[(bytes[i - 2] & 3) << 4 | bytes[i - 1] >> 4];
    result += chars[(bytes[i - 1] & 15) << 2];
    result += "=";
  }
  return result;
}
var array = new Uint8Array(16);
function generate_nonce() {
  crypto.getRandomValues(array);
  return base64(array);
}
var quoted = /* @__PURE__ */ new Set([
  "self",
  "unsafe-eval",
  "unsafe-hashes",
  "unsafe-inline",
  "none",
  "strict-dynamic",
  "report-sample",
  "wasm-unsafe-eval",
  "script"
]);
var crypto_pattern = /^(nonce|sha\d\d\d)-/;
var _use_hashes, _script_needs_csp, _style_needs_csp, _directives, _script_src, _script_src_elem, _style_src, _style_src_attr, _style_src_elem, _nonce;
var BaseProvider = class {
  /**
   * @param {boolean} use_hashes
   * @param {import('types').CspDirectives} directives
   * @param {string} nonce
   */
  constructor(use_hashes, directives, nonce) {
    /** @type {boolean} */
    __privateAdd(this, _use_hashes);
    /** @type {boolean} */
    __privateAdd(this, _script_needs_csp);
    /** @type {boolean} */
    __privateAdd(this, _style_needs_csp);
    /** @type {import('types').CspDirectives} */
    __privateAdd(this, _directives);
    /** @type {import('types').Csp.Source[]} */
    __privateAdd(this, _script_src);
    /** @type {import('types').Csp.Source[]} */
    __privateAdd(this, _script_src_elem);
    /** @type {import('types').Csp.Source[]} */
    __privateAdd(this, _style_src);
    /** @type {import('types').Csp.Source[]} */
    __privateAdd(this, _style_src_attr);
    /** @type {import('types').Csp.Source[]} */
    __privateAdd(this, _style_src_elem);
    /** @type {string} */
    __privateAdd(this, _nonce);
    __privateSet(this, _use_hashes, use_hashes);
    __privateSet(this, _directives, directives);
    const d = __privateGet(this, _directives);
    __privateSet(this, _script_src, []);
    __privateSet(this, _script_src_elem, []);
    __privateSet(this, _style_src, []);
    __privateSet(this, _style_src_attr, []);
    __privateSet(this, _style_src_elem, []);
    const effective_script_src = d["script-src"] || d["default-src"];
    const script_src_elem = d["script-src-elem"];
    const effective_style_src = d["style-src"] || d["default-src"];
    const style_src_attr = d["style-src-attr"];
    const style_src_elem = d["style-src-elem"];
    __privateSet(this, _script_needs_csp, !!effective_script_src && effective_script_src.filter((value) => value !== "unsafe-inline").length > 0 || !!script_src_elem && script_src_elem.filter((value) => value !== "unsafe-inline").length > 0);
    __privateSet(this, _style_needs_csp, !!effective_style_src && effective_style_src.filter((value) => value !== "unsafe-inline").length > 0 || !!style_src_attr && style_src_attr.filter((value) => value !== "unsafe-inline").length > 0 || !!style_src_elem && style_src_elem.filter((value) => value !== "unsafe-inline").length > 0);
    this.script_needs_nonce = __privateGet(this, _script_needs_csp) && !__privateGet(this, _use_hashes);
    this.style_needs_nonce = __privateGet(this, _style_needs_csp) && !__privateGet(this, _use_hashes);
    __privateSet(this, _nonce, nonce);
  }
  /** @param {string} content */
  add_script(content) {
    if (__privateGet(this, _script_needs_csp)) {
      const d = __privateGet(this, _directives);
      if (__privateGet(this, _use_hashes)) {
        const hash2 = sha256(content);
        __privateGet(this, _script_src).push(`sha256-${hash2}`);
        if (d["script-src-elem"]?.length) {
          __privateGet(this, _script_src_elem).push(`sha256-${hash2}`);
        }
      } else {
        if (__privateGet(this, _script_src).length === 0) {
          __privateGet(this, _script_src).push(`nonce-${__privateGet(this, _nonce)}`);
        }
        if (d["script-src-elem"]?.length) {
          __privateGet(this, _script_src_elem).push(`nonce-${__privateGet(this, _nonce)}`);
        }
      }
    }
  }
  /** @param {string} content */
  add_style(content) {
    if (__privateGet(this, _style_needs_csp)) {
      const empty_comment_hash = "9OlNO0DNEeaVzHL4RZwCLsBHA8WBQ8toBp/4F5XV2nc=";
      const d = __privateGet(this, _directives);
      if (__privateGet(this, _use_hashes)) {
        const hash2 = sha256(content);
        __privateGet(this, _style_src).push(`sha256-${hash2}`);
        if (d["style-src-attr"]?.length) {
          __privateGet(this, _style_src_attr).push(`sha256-${hash2}`);
        }
        if (d["style-src-elem"]?.length) {
          if (hash2 !== empty_comment_hash && !d["style-src-elem"].includes(`sha256-${empty_comment_hash}`)) {
            __privateGet(this, _style_src_elem).push(`sha256-${empty_comment_hash}`);
          }
          __privateGet(this, _style_src_elem).push(`sha256-${hash2}`);
        }
      } else {
        if (__privateGet(this, _style_src).length === 0 && !d["style-src"]?.includes("unsafe-inline")) {
          __privateGet(this, _style_src).push(`nonce-${__privateGet(this, _nonce)}`);
        }
        if (d["style-src-attr"]?.length) {
          __privateGet(this, _style_src_attr).push(`nonce-${__privateGet(this, _nonce)}`);
        }
        if (d["style-src-elem"]?.length) {
          if (!d["style-src-elem"].includes(`sha256-${empty_comment_hash}`)) {
            __privateGet(this, _style_src_elem).push(`sha256-${empty_comment_hash}`);
          }
          __privateGet(this, _style_src_elem).push(`nonce-${__privateGet(this, _nonce)}`);
        }
      }
    }
  }
  /**
   * @param {boolean} [is_meta]
   */
  get_header(is_meta = false) {
    const header = [];
    const directives = { ...__privateGet(this, _directives) };
    if (__privateGet(this, _style_src).length > 0) {
      directives["style-src"] = [
        ...directives["style-src"] || directives["default-src"] || [],
        ...__privateGet(this, _style_src)
      ];
    }
    if (__privateGet(this, _style_src_attr).length > 0) {
      directives["style-src-attr"] = [
        ...directives["style-src-attr"] || [],
        ...__privateGet(this, _style_src_attr)
      ];
    }
    if (__privateGet(this, _style_src_elem).length > 0) {
      directives["style-src-elem"] = [
        ...directives["style-src-elem"] || [],
        ...__privateGet(this, _style_src_elem)
      ];
    }
    if (__privateGet(this, _script_src).length > 0) {
      directives["script-src"] = [
        ...directives["script-src"] || directives["default-src"] || [],
        ...__privateGet(this, _script_src)
      ];
    }
    if (__privateGet(this, _script_src_elem).length > 0) {
      directives["script-src-elem"] = [
        ...directives["script-src-elem"] || [],
        ...__privateGet(this, _script_src_elem)
      ];
    }
    for (const key2 in directives) {
      if (is_meta && (key2 === "frame-ancestors" || key2 === "report-uri" || key2 === "sandbox")) {
        continue;
      }
      const value = (
        /** @type {string[] | true} */
        directives[key2]
      );
      if (!value) continue;
      const directive = [key2];
      if (Array.isArray(value)) {
        value.forEach((value2) => {
          if (quoted.has(value2) || crypto_pattern.test(value2)) {
            directive.push(`'${value2}'`);
          } else {
            directive.push(value2);
          }
        });
      }
      header.push(directive.join(" "));
    }
    return header.join("; ");
  }
};
_use_hashes = new WeakMap();
_script_needs_csp = new WeakMap();
_style_needs_csp = new WeakMap();
_directives = new WeakMap();
_script_src = new WeakMap();
_script_src_elem = new WeakMap();
_style_src = new WeakMap();
_style_src_attr = new WeakMap();
_style_src_elem = new WeakMap();
_nonce = new WeakMap();
var CspProvider = class extends BaseProvider {
  get_meta() {
    const content = this.get_header(true);
    if (!content) {
      return;
    }
    return `<meta http-equiv="content-security-policy" content=${escape_html_attr(content)}>`;
  }
};
var CspReportOnlyProvider = class extends BaseProvider {
  /**
   * @param {boolean} use_hashes
   * @param {import('types').CspDirectives} directives
   * @param {string} nonce
   */
  constructor(use_hashes, directives, nonce) {
    super(use_hashes, directives, nonce);
    if (Object.values(directives).filter((v) => !!v).length > 0) {
      const has_report_to = directives["report-to"]?.length ?? 0 > 0;
      const has_report_uri = directives["report-uri"]?.length ?? 0 > 0;
      if (!has_report_to && !has_report_uri) {
        throw Error(
          "`content-security-policy-report-only` must be specified with either the `report-to` or `report-uri` directives, or both"
        );
      }
    }
  }
};
var Csp = class {
  /**
   * @param {import('./types.js').CspConfig} config
   * @param {import('./types.js').CspOpts} opts
   */
  constructor({ mode, directives, reportOnly }, { prerender }) {
    /** @readonly */
    __publicField(this, "nonce", generate_nonce());
    /** @type {CspProvider} */
    __publicField(this, "csp_provider");
    /** @type {CspReportOnlyProvider} */
    __publicField(this, "report_only_provider");
    const use_hashes = mode === "hash" || mode === "auto" && prerender;
    this.csp_provider = new CspProvider(use_hashes, directives, this.nonce);
    this.report_only_provider = new CspReportOnlyProvider(use_hashes, reportOnly, this.nonce);
  }
  get script_needs_nonce() {
    return this.csp_provider.script_needs_nonce || this.report_only_provider.script_needs_nonce;
  }
  get style_needs_nonce() {
    return this.csp_provider.style_needs_nonce || this.report_only_provider.style_needs_nonce;
  }
  /** @param {string} content */
  add_script(content) {
    this.csp_provider.add_script(content);
    this.report_only_provider.add_script(content);
  }
  /** @param {string} content */
  add_style(content) {
    this.csp_provider.add_style(content);
    this.report_only_provider.add_style(content);
  }
};
function defer() {
  let fulfil;
  let reject;
  const promise = new Promise((f, r2) => {
    fulfil = f;
    reject = r2;
  });
  return { promise, fulfil, reject };
}
function create_async_iterator() {
  const deferred = [defer()];
  return {
    iterator: {
      [Symbol.asyncIterator]() {
        return {
          next: async () => {
            const next2 = await deferred[0].promise;
            if (!next2.done) deferred.shift();
            return next2;
          }
        };
      }
    },
    push: (value) => {
      deferred[deferred.length - 1].fulfil({
        value,
        done: false
      });
      deferred.push(defer());
    },
    done: () => {
      deferred[deferred.length - 1].fulfil({ done: true });
    }
  };
}
var updated = {
  ...readable(false),
  check: () => false
};
var encoder$1 = new TextEncoder();
async function render_response({
  branch: branch2,
  fetched,
  options: options2,
  manifest: manifest2,
  state,
  page_config,
  status,
  error = null,
  event,
  resolve_opts,
  action_result
}) {
  if (state.prerendering) {
    if (options2.csp.mode === "nonce") {
      throw new Error('Cannot use prerendering if config.kit.csp.mode === "nonce"');
    }
    if (options2.app_template_contains_nonce) {
      throw new Error("Cannot use prerendering if page template contains %sveltekit.nonce%");
    }
  }
  const { client } = manifest2._;
  const modulepreloads = new Set(client.imports);
  const stylesheets7 = new Set(client.stylesheets);
  const fonts7 = new Set(client.fonts);
  const link_header_preloads = /* @__PURE__ */ new Set();
  const inline_styles = /* @__PURE__ */ new Map();
  let rendered;
  const form_value = action_result?.type === "success" || action_result?.type === "failure" ? action_result.data ?? null : null;
  let base$1 = base;
  let assets$1 = assets;
  let base_expression = s(base);
  if (!state.prerendering?.fallback) {
    const segments = event.url.pathname.slice(base.length).split("/").slice(2);
    base$1 = segments.map(() => "..").join("/") || ".";
    base_expression = `new URL(${s(base$1)}, location).pathname.slice(0, -1)`;
    if (!assets || assets[0] === "/" && assets !== SVELTE_KIT_ASSETS) {
      assets$1 = base$1;
    }
  }
  if (page_config.ssr) {
    const props = {
      stores: {
        page: writable(null),
        navigating: writable(null),
        updated
      },
      constructors: await Promise.all(branch2.map(({ node }) => node.component())),
      form: form_value
    };
    let data2 = {};
    for (let i = 0; i < branch2.length; i += 1) {
      data2 = { ...data2, ...branch2[i].data };
      props[`data_${i}`] = data2;
    }
    props.page = {
      error,
      params: (
        /** @type {Record<string, any>} */
        event.params
      ),
      route: event.route,
      status,
      url: event.url,
      data: data2,
      form: form_value,
      state: {}
    };
    override({ base: base$1, assets: assets$1 });
    {
      try {
        rendered = options2.root.render(props);
      } finally {
        reset();
      }
    }
    for (const { node } of branch2) {
      for (const url of node.imports) modulepreloads.add(url);
      for (const url of node.stylesheets) stylesheets7.add(url);
      for (const url of node.fonts) fonts7.add(url);
      if (node.inline_styles) {
        Object.entries(await node.inline_styles()).forEach(([k, v]) => inline_styles.set(k, v));
      }
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  let head = "";
  let body2 = rendered.html;
  const csp = new Csp(options2.csp, {
    prerender: !!state.prerendering
  });
  const prefixed = (path) => {
    if (path.startsWith("/")) {
      return base + path;
    }
    return `${assets$1}/${path}`;
  };
  if (inline_styles.size > 0) {
    const content = Array.from(inline_styles.values()).join("\n");
    const attributes = [];
    if (csp.style_needs_nonce) attributes.push(` nonce="${csp.nonce}"`);
    csp.add_style(content);
    head += `
	<style${attributes.join("")}>${content}</style>`;
  }
  for (const dep of stylesheets7) {
    const path = prefixed(dep);
    const attributes = ['rel="stylesheet"'];
    if (inline_styles.has(dep)) {
      attributes.push("disabled", 'media="(max-width: 0)"');
    } else {
      if (resolve_opts.preload({ type: "css", path })) {
        const preload_atts = ['rel="preload"', 'as="style"'];
        link_header_preloads.add(`<${encodeURI(path)}>; ${preload_atts.join(";")}; nopush`);
      }
    }
    head += `
		<link href="${path}" ${attributes.join(" ")}>`;
  }
  for (const dep of fonts7) {
    const path = prefixed(dep);
    if (resolve_opts.preload({ type: "font", path })) {
      const ext = dep.slice(dep.lastIndexOf(".") + 1);
      const attributes = [
        'rel="preload"',
        'as="font"',
        `type="font/${ext}"`,
        `href="${path}"`,
        "crossorigin"
      ];
      head += `
		<link ${attributes.join(" ")}>`;
    }
  }
  const global = `__sveltekit_${options2.version_hash}`;
  const { data, chunks } = get_data(
    event,
    options2,
    branch2.map((b) => b.server_data),
    global
  );
  if (page_config.ssr && page_config.csr) {
    body2 += `
			${fetched.map(
      (item) => serialize_data(item, resolve_opts.filterSerializedResponseHeaders, !!state.prerendering)
    ).join("\n			")}`;
  }
  if (page_config.csr) {
    if (client.uses_env_dynamic_public && state.prerendering) {
      modulepreloads.add(`${options2.app_dir}/env.js`);
    }
    const included_modulepreloads = Array.from(modulepreloads, (dep) => prefixed(dep)).filter(
      (path) => resolve_opts.preload({ type: "js", path })
    );
    for (const path of included_modulepreloads) {
      link_header_preloads.add(`<${encodeURI(path)}>; rel="modulepreload"; nopush`);
      if (options2.preload_strategy !== "modulepreload") {
        head += `
		<link rel="preload" as="script" crossorigin="anonymous" href="${path}">`;
      } else if (state.prerendering) {
        head += `
		<link rel="modulepreload" href="${path}">`;
      }
    }
    const blocks = [];
    const load_env_eagerly = client.uses_env_dynamic_public && state.prerendering;
    const properties = [`base: ${base_expression}`];
    if (assets) {
      properties.push(`assets: ${s(assets)}`);
    }
    if (client.uses_env_dynamic_public) {
      properties.push(`env: ${load_env_eagerly ? "null" : s(public_env)}`);
    }
    if (chunks) {
      blocks.push("const deferred = new Map();");
      properties.push(`defer: (id) => new Promise((fulfil, reject) => {
							deferred.set(id, { fulfil, reject });
						})`);
      properties.push(`resolve: ({ id, data, error }) => {
							const { fulfil, reject } = deferred.get(id);
							deferred.delete(id);

							if (error) reject(error);
							else fulfil(data);
						}`);
    }
    blocks.push(`${global} = {
						${properties.join(",\n						")}
					};`);
    const args = ["app", "element"];
    blocks.push("const element = document.currentScript.parentElement;");
    if (page_config.ssr) {
      const serialized = { form: "null", error: "null" };
      blocks.push(`const data = ${data};`);
      if (form_value) {
        serialized.form = uneval_action_response(
          form_value,
          /** @type {string} */
          event.route.id
        );
      }
      if (error) {
        serialized.error = uneval(error);
      }
      const hydrate2 = [
        `node_ids: [${branch2.map(({ node }) => node.index).join(", ")}]`,
        "data",
        `form: ${serialized.form}`,
        `error: ${serialized.error}`
      ];
      if (status !== 200) {
        hydrate2.push(`status: ${status}`);
      }
      if (options2.embedded) {
        hydrate2.push(`params: ${uneval(event.params)}`, `route: ${s(event.route)}`);
      }
      const indent = "	".repeat(load_env_eagerly ? 7 : 6);
      args.push(`{
${indent}	${hydrate2.join(`,
${indent}	`)}
${indent}}`);
    }
    if (load_env_eagerly) {
      blocks.push(`import(${s(`${base$1}/${options2.app_dir}/env.js`)}).then(({ env }) => {
						${global}.env = env;

						Promise.all([
							import(${s(prefixed(client.start))}),
							import(${s(prefixed(client.app))})
						]).then(([kit, app]) => {
							kit.start(${args.join(", ")});
						});
					});`);
    } else {
      blocks.push(`Promise.all([
						import(${s(prefixed(client.start))}),
						import(${s(prefixed(client.app))})
					]).then(([kit, app]) => {
						kit.start(${args.join(", ")});
					});`);
    }
    if (options2.service_worker) {
      const opts = "";
      blocks.push(`if ('serviceWorker' in navigator) {
						addEventListener('load', function () {
							navigator.serviceWorker.register('${prefixed("service-worker.js")}'${opts});
						});
					}`);
    }
    const init_app = `
				{
					${blocks.join("\n\n					")}
				}
			`;
    csp.add_script(init_app);
    body2 += `
			<script${csp.script_needs_nonce ? ` nonce="${csp.nonce}"` : ""}>${init_app}<\/script>
		`;
  }
  const headers2 = new Headers({
    "x-sveltekit-page": "true",
    "content-type": "text/html"
  });
  if (state.prerendering) {
    const http_equiv = [];
    const csp_headers = csp.csp_provider.get_meta();
    if (csp_headers) {
      http_equiv.push(csp_headers);
    }
    if (state.prerendering.cache) {
      http_equiv.push(`<meta http-equiv="cache-control" content="${state.prerendering.cache}">`);
    }
    if (http_equiv.length > 0) {
      head = http_equiv.join("\n") + head;
    }
  } else {
    const csp_header = csp.csp_provider.get_header();
    if (csp_header) {
      headers2.set("content-security-policy", csp_header);
    }
    const report_only_header = csp.report_only_provider.get_header();
    if (report_only_header) {
      headers2.set("content-security-policy-report-only", report_only_header);
    }
    if (link_header_preloads.size) {
      headers2.set("link", Array.from(link_header_preloads).join(", "));
    }
  }
  head += rendered.head;
  const html = options2.templates.app({
    head,
    body: body2,
    assets: assets$1,
    nonce: (
      /** @type {string} */
      csp.nonce
    ),
    env: safe_public_env
  });
  const transformed = await resolve_opts.transformPageChunk({
    html,
    done: true
  }) || "";
  if (!chunks) {
    headers2.set("etag", `"${hash(transformed)}"`);
  }
  return !chunks ? text(transformed, {
    status,
    headers: headers2
  }) : new Response(
    new ReadableStream({
      async start(controller) {
        controller.enqueue(encoder$1.encode(transformed + "\n"));
        for await (const chunk of chunks) {
          controller.enqueue(encoder$1.encode(chunk));
        }
        controller.close();
      },
      type: "bytes"
    }),
    {
      headers: {
        "content-type": "text/html"
      }
    }
  );
}
function get_data(event, options2, nodes, global) {
  let promise_id = 1;
  let count = 0;
  const { iterator, push: push3, done } = create_async_iterator();
  function replacer(thing) {
    if (typeof thing?.then === "function") {
      const id = promise_id++;
      count += 1;
      thing.then(
        /** @param {any} data */
        (data) => ({ data })
      ).catch(
        /** @param {any} error */
        async (error) => ({
          error: await handle_error_and_jsonify(event, options2, error)
        })
      ).then(
        /**
         * @param {{data: any; error: any}} result
         */
        async ({ data, error }) => {
          count -= 1;
          let str;
          try {
            str = uneval({ id, data, error }, replacer);
          } catch {
            error = await handle_error_and_jsonify(
              event,
              options2,
              new Error(`Failed to serialize promise while rendering ${event.route.id}`)
            );
            data = void 0;
            str = uneval({ id, data, error }, replacer);
          }
          push3(`<script>${global}.resolve(${str})<\/script>
`);
          if (count === 0) done();
        }
      );
      return `${global}.defer(${id})`;
    }
  }
  try {
    const strings = nodes.map((node) => {
      if (!node) return "null";
      return `{"type":"data","data":${uneval(node.data, replacer)},${stringify_uses(node)}${node.slash ? `,"slash":${JSON.stringify(node.slash)}` : ""}}`;
    });
    return {
      data: `[${strings.join(",")}]`,
      chunks: count > 0 ? iterator : null
    };
  } catch (e) {
    throw new Error(clarify_devalue_error(
      event,
      /** @type {any} */
      e
    ));
  }
}
function get_option(nodes, option) {
  return nodes.reduce(
    (value, node) => {
      return (
        /** @type {Value} TypeScript's too dumb to understand this */
        node?.universal?.[option] ?? node?.server?.[option] ?? value
      );
    },
    /** @type {Value | undefined} */
    void 0
  );
}
async function respond_with_error({
  event,
  options: options2,
  manifest: manifest2,
  state,
  status,
  error,
  resolve_opts
}) {
  if (event.request.headers.get("x-sveltekit-error")) {
    return static_error_page(
      options2,
      status,
      /** @type {Error} */
      error.message
    );
  }
  const fetched = [];
  try {
    const branch2 = [];
    const default_layout = await manifest2._.nodes[0]();
    const ssr = get_option([default_layout], "ssr") ?? true;
    const csr = get_option([default_layout], "csr") ?? true;
    if (ssr) {
      state.error = true;
      const server_data_promise = load_server_data({
        event,
        state,
        node: default_layout,
        // eslint-disable-next-line @typescript-eslint/require-await
        parent: async () => ({})
      });
      const server_data = await server_data_promise;
      const data = await load_data({
        event,
        fetched,
        node: default_layout,
        // eslint-disable-next-line @typescript-eslint/require-await
        parent: async () => ({}),
        resolve_opts,
        server_data_promise,
        state,
        csr
      });
      branch2.push(
        {
          node: default_layout,
          server_data,
          data
        },
        {
          node: await manifest2._.nodes[1](),
          // 1 is always the root error
          data: null,
          server_data: null
        }
      );
    }
    return await render_response({
      options: options2,
      manifest: manifest2,
      state,
      page_config: {
        ssr,
        csr
      },
      status,
      error: await handle_error_and_jsonify(event, options2, error),
      branch: branch2,
      fetched,
      event,
      resolve_opts
    });
  } catch (e) {
    if (e instanceof Redirect) {
      return redirect_response(e.status, e.location);
    }
    return static_error_page(
      options2,
      get_status(e),
      (await handle_error_and_jsonify(event, options2, e)).message
    );
  }
}
function once2(fn) {
  let done = false;
  let result;
  return () => {
    if (done) return result;
    done = true;
    return result = fn();
  };
}
var encoder = new TextEncoder();
async function render_data(event, route, options2, manifest2, state, invalidated_data_nodes, trailing_slash) {
  if (!route.page) {
    return new Response(void 0, {
      status: 404
    });
  }
  try {
    const node_ids = [...route.page.layouts, route.page.leaf];
    const invalidated = invalidated_data_nodes ?? node_ids.map(() => true);
    let aborted = false;
    const url = new URL(event.url);
    url.pathname = normalize_path(url.pathname, trailing_slash);
    const new_event = { ...event, url };
    const functions = node_ids.map((n, i) => {
      return once2(async () => {
        try {
          if (aborted) {
            return (
              /** @type {import('types').ServerDataSkippedNode} */
              {
                type: "skip"
              }
            );
          }
          const node = n == void 0 ? n : await manifest2._.nodes[n]();
          return load_server_data({
            event: new_event,
            state,
            node,
            parent: async () => {
              const data2 = {};
              for (let j = 0; j < i; j += 1) {
                const parent = (
                  /** @type {import('types').ServerDataNode | null} */
                  await functions[j]()
                );
                if (parent) {
                  Object.assign(data2, parent.data);
                }
              }
              return data2;
            }
          });
        } catch (e) {
          aborted = true;
          throw e;
        }
      });
    });
    const promises = functions.map(async (fn, i) => {
      if (!invalidated[i]) {
        return (
          /** @type {import('types').ServerDataSkippedNode} */
          {
            type: "skip"
          }
        );
      }
      return fn();
    });
    let length = promises.length;
    const nodes = await Promise.all(
      promises.map(
        (p, i) => p.catch(async (error) => {
          if (error instanceof Redirect) {
            throw error;
          }
          length = Math.min(length, i + 1);
          return (
            /** @type {import('types').ServerErrorNode} */
            {
              type: "error",
              error: await handle_error_and_jsonify(event, options2, error),
              status: error instanceof HttpError || error instanceof SvelteKitError ? error.status : void 0
            }
          );
        })
      )
    );
    const { data, chunks } = get_data_json(event, options2, nodes);
    if (!chunks) {
      return json_response(data);
    }
    return new Response(
      new ReadableStream({
        async start(controller) {
          controller.enqueue(encoder.encode(data));
          for await (const chunk of chunks) {
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
        },
        type: "bytes"
      }),
      {
        headers: {
          // we use a proprietary content type to prevent buffering.
          // the `text` prefix makes it inspectable
          "content-type": "text/sveltekit-data",
          "cache-control": "private, no-store"
        }
      }
    );
  } catch (e) {
    const error = normalize_error(e);
    if (error instanceof Redirect) {
      return redirect_json_response(error);
    } else {
      return json_response(await handle_error_and_jsonify(event, options2, error), 500);
    }
  }
}
function json_response(json2, status = 200) {
  return text(typeof json2 === "string" ? json2 : JSON.stringify(json2), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "private, no-store"
    }
  });
}
function redirect_json_response(redirect) {
  return json_response({
    type: "redirect",
    location: redirect.location
  });
}
function get_data_json(event, options2, nodes) {
  let promise_id = 1;
  let count = 0;
  const { iterator, push: push3, done } = create_async_iterator();
  const reducers = {
    /** @param {any} thing */
    Promise: (thing) => {
      if (typeof thing?.then === "function") {
        const id = promise_id++;
        count += 1;
        let key2 = "data";
        thing.catch(
          /** @param {any} e */
          async (e) => {
            key2 = "error";
            return handle_error_and_jsonify(
              event,
              options2,
              /** @type {any} */
              e
            );
          }
        ).then(
          /** @param {any} value */
          async (value) => {
            let str;
            try {
              str = stringify2(value, reducers);
            } catch {
              const error = await handle_error_and_jsonify(
                event,
                options2,
                new Error(`Failed to serialize promise while rendering ${event.route.id}`)
              );
              key2 = "error";
              str = stringify2(error, reducers);
            }
            count -= 1;
            push3(`{"type":"chunk","id":${id},"${key2}":${str}}
`);
            if (count === 0) done();
          }
        );
        return id;
      }
    }
  };
  try {
    const strings = nodes.map((node) => {
      if (!node) return "null";
      if (node.type === "error" || node.type === "skip") {
        return JSON.stringify(node);
      }
      return `{"type":"data","data":${stringify2(node.data, reducers)},${stringify_uses(
        node
      )}${node.slash ? `,"slash":${JSON.stringify(node.slash)}` : ""}}`;
    });
    return {
      data: `{"type":"data","nodes":[${strings.join(",")}]}
`,
      chunks: count > 0 ? iterator : null
    };
  } catch (e) {
    throw new Error(clarify_devalue_error(
      event,
      /** @type {any} */
      e
    ));
  }
}
function load_page_nodes(page2, manifest2) {
  return Promise.all([
    // we use == here rather than === because [undefined] serializes as "[null]"
    ...page2.layouts.map((n) => n == void 0 ? n : manifest2._.nodes[n]()),
    manifest2._.nodes[page2.leaf]()
  ]);
}
var MAX_DEPTH = 10;
async function render_page(event, page2, options2, manifest2, state, resolve_opts) {
  if (state.depth > MAX_DEPTH) {
    return text(`Not found: ${event.url.pathname}`, {
      status: 404
      // TODO in some cases this should be 500. not sure how to differentiate
    });
  }
  if (is_action_json_request(event)) {
    const node = await manifest2._.nodes[page2.leaf]();
    return handle_action_json_request(event, options2, node?.server);
  }
  try {
    const nodes = await load_page_nodes(page2, manifest2);
    const leaf_node = (
      /** @type {import('types').SSRNode} */
      nodes.at(-1)
    );
    let status = 200;
    let action_result = void 0;
    if (is_action_request(event)) {
      action_result = await handle_action_request(event, leaf_node.server);
      if (action_result?.type === "redirect") {
        return redirect_response(action_result.status, action_result.location);
      }
      if (action_result?.type === "error") {
        status = get_status(action_result.error);
      }
      if (action_result?.type === "failure") {
        status = action_result.status;
      }
    }
    const should_prerender_data = nodes.some((node) => node?.server?.load);
    const data_pathname = add_data_suffix(event.url.pathname);
    const should_prerender = get_option(nodes, "prerender") ?? false;
    if (should_prerender) {
      const mod = leaf_node.server;
      if (mod?.actions) {
        throw new Error("Cannot prerender pages with actions");
      }
    } else if (state.prerendering) {
      return new Response(void 0, {
        status: 204
      });
    }
    state.prerender_default = should_prerender;
    const fetched = [];
    if (get_option(nodes, "ssr") === false && !(state.prerendering && should_prerender_data)) {
      return await render_response({
        branch: [],
        fetched,
        page_config: {
          ssr: false,
          csr: get_option(nodes, "csr") ?? true
        },
        status,
        error: null,
        event,
        options: options2,
        manifest: manifest2,
        state,
        resolve_opts
      });
    }
    const branch2 = [];
    let load_error = null;
    const server_promises = nodes.map((node, i) => {
      if (load_error) {
        throw load_error;
      }
      return Promise.resolve().then(async () => {
        try {
          if (node === leaf_node && action_result?.type === "error") {
            throw action_result.error;
          }
          return await load_server_data({
            event,
            state,
            node,
            parent: async () => {
              const data = {};
              for (let j = 0; j < i; j += 1) {
                const parent = await server_promises[j];
                if (parent) Object.assign(data, parent.data);
              }
              return data;
            }
          });
        } catch (e) {
          load_error = /** @type {Error} */
          e;
          throw load_error;
        }
      });
    });
    const csr = get_option(nodes, "csr") ?? true;
    const load_promises = nodes.map((node, i) => {
      if (load_error) throw load_error;
      return Promise.resolve().then(async () => {
        try {
          return await load_data({
            event,
            fetched,
            node,
            parent: async () => {
              const data = {};
              for (let j = 0; j < i; j += 1) {
                Object.assign(data, await load_promises[j]);
              }
              return data;
            },
            resolve_opts,
            server_data_promise: server_promises[i],
            state,
            csr
          });
        } catch (e) {
          load_error = /** @type {Error} */
          e;
          throw load_error;
        }
      });
    });
    for (const p of server_promises) p.catch(() => {
    });
    for (const p of load_promises) p.catch(() => {
    });
    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i];
      if (node) {
        try {
          const server_data = await server_promises[i];
          const data = await load_promises[i];
          branch2.push({ node, server_data, data });
        } catch (e) {
          const err = normalize_error(e);
          if (err instanceof Redirect) {
            if (state.prerendering && should_prerender_data) {
              const body2 = JSON.stringify({
                type: "redirect",
                location: err.location
              });
              state.prerendering.dependencies.set(data_pathname, {
                response: text(body2),
                body: body2
              });
            }
            return redirect_response(err.status, err.location);
          }
          const status2 = get_status(err);
          const error = await handle_error_and_jsonify(event, options2, err);
          while (i--) {
            if (page2.errors[i]) {
              const index7 = (
                /** @type {number} */
                page2.errors[i]
              );
              const node2 = await manifest2._.nodes[index7]();
              let j = i;
              while (!branch2[j]) j -= 1;
              return await render_response({
                event,
                options: options2,
                manifest: manifest2,
                state,
                resolve_opts,
                page_config: { ssr: true, csr: true },
                status: status2,
                error,
                branch: compact(branch2.slice(0, j + 1)).concat({
                  node: node2,
                  data: null,
                  server_data: null
                }),
                fetched
              });
            }
          }
          return static_error_page(options2, status2, error.message);
        }
      } else {
        branch2.push(null);
      }
    }
    if (state.prerendering && should_prerender_data) {
      let { data, chunks } = get_data_json(
        event,
        options2,
        branch2.map((node) => node?.server_data)
      );
      if (chunks) {
        for await (const chunk of chunks) {
          data += chunk;
        }
      }
      state.prerendering.dependencies.set(data_pathname, {
        response: text(data),
        body: data
      });
    }
    const ssr = get_option(nodes, "ssr") ?? true;
    return await render_response({
      event,
      options: options2,
      manifest: manifest2,
      state,
      resolve_opts,
      page_config: {
        csr: get_option(nodes, "csr") ?? true,
        ssr
      },
      status,
      error: null,
      branch: ssr === false ? [] : compact(branch2),
      action_result,
      fetched
    });
  } catch (e) {
    return await respond_with_error({
      event,
      options: options2,
      manifest: manifest2,
      state,
      status: 500,
      error: e,
      resolve_opts
    });
  }
}
function exec(match, params, matchers) {
  const result = {};
  const values = match.slice(1);
  const values_needing_match = values.filter((value) => value !== void 0);
  let buffered = 0;
  for (let i = 0; i < params.length; i += 1) {
    const param = params[i];
    let value = values[i - buffered];
    if (param.chained && param.rest && buffered) {
      value = values.slice(i - buffered, i + 1).filter((s2) => s2).join("/");
      buffered = 0;
    }
    if (value === void 0) {
      if (param.rest) result[param.name] = "";
      continue;
    }
    if (!param.matcher || matchers[param.matcher](value)) {
      result[param.name] = value;
      const next_param = params[i + 1];
      const next_value = values[i + 1];
      if (next_param && !next_param.rest && next_param.optional && next_value && param.chained) {
        buffered = 0;
      }
      if (!next_param && !next_value && Object.keys(result).length === values_needing_match.length) {
        buffered = 0;
      }
      continue;
    }
    if (param.optional && param.chained) {
      buffered++;
      continue;
    }
    return;
  }
  if (buffered) return;
  return result;
}
var parse_1 = parse$1;
var serialize_1 = serialize;
var __toString = Object.prototype.toString;
var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
function parse$1(str, options2) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  var obj = {};
  var opt = options2 || {};
  var dec = opt.decode || decode;
  var index7 = 0;
  while (index7 < str.length) {
    var eqIdx = str.indexOf("=", index7);
    if (eqIdx === -1) {
      break;
    }
    var endIdx = str.indexOf(";", index7);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index7 = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    var key2 = str.slice(index7, eqIdx).trim();
    if (void 0 === obj[key2]) {
      var val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.charCodeAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key2] = tryDecode(val, dec);
    }
    index7 = endIdx + 1;
  }
  return obj;
}
function serialize(name2, val, options2) {
  var opt = options2 || {};
  var enc = opt.encode || encode;
  if (typeof enc !== "function") {
    throw new TypeError("option encode is invalid");
  }
  if (!fieldContentRegExp.test(name2)) {
    throw new TypeError("argument name is invalid");
  }
  var value = enc(val);
  if (value && !fieldContentRegExp.test(value)) {
    throw new TypeError("argument val is invalid");
  }
  var str = name2 + "=" + value;
  if (null != opt.maxAge) {
    var maxAge = opt.maxAge - 0;
    if (isNaN(maxAge) || !isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    var expires = opt.expires;
    if (!isDate(expires) || isNaN(expires.valueOf())) {
      throw new TypeError("option expires is invalid");
    }
    str += "; Expires=" + expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += "; HttpOnly";
  }
  if (opt.secure) {
    str += "; Secure";
  }
  if (opt.partitioned) {
    str += "; Partitioned";
  }
  if (opt.priority) {
    var priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
    switch (priority) {
      case "low":
        str += "; Priority=Low";
        break;
      case "medium":
        str += "; Priority=Medium";
        break;
      case "high":
        str += "; Priority=High";
        break;
      default:
        throw new TypeError("option priority is invalid");
    }
  }
  if (opt.sameSite) {
    var sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true:
        str += "; SameSite=Strict";
        break;
      case "lax":
        str += "; SameSite=Lax";
        break;
      case "strict":
        str += "; SameSite=Strict";
        break;
      case "none":
        str += "; SameSite=None";
        break;
      default:
        throw new TypeError("option sameSite is invalid");
    }
  }
  return str;
}
function decode(str) {
  return str.indexOf("%") !== -1 ? decodeURIComponent(str) : str;
}
function encode(val) {
  return encodeURIComponent(val);
}
function isDate(val) {
  return __toString.call(val) === "[object Date]" || val instanceof Date;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch (e) {
    return str;
  }
}
function validate_options(options2) {
  if (options2?.path === void 0) {
    throw new Error("You must specify a `path` when setting, deleting or serializing cookies");
  }
}
function get_cookies(request, url, trailing_slash) {
  const header = request.headers.get("cookie") ?? "";
  const initial_cookies = parse_1(header, { decode: (value) => value });
  const normalized_url = normalize_path(url.pathname, trailing_slash);
  const new_cookies = {};
  const defaults2 = {
    httpOnly: true,
    sameSite: "lax",
    secure: url.hostname === "localhost" && url.protocol === "http:" ? false : true
  };
  const cookies = {
    // The JSDoc param annotations appearing below for get, set and delete
    // are necessary to expose the `cookie` library types to
    // typescript users. `@type {import('@sveltejs/kit').Cookies}` above is not
    // sufficient to do so.
    /**
     * @param {string} name
     * @param {import('cookie').CookieParseOptions} opts
     */
    get(name2, opts) {
      const c2 = new_cookies[name2];
      if (c2 && domain_matches(url.hostname, c2.options.domain) && path_matches(url.pathname, c2.options.path)) {
        return c2.value;
      }
      const decoder = opts?.decode || decodeURIComponent;
      const req_cookies = parse_1(header, { decode: decoder });
      const cookie = req_cookies[name2];
      return cookie;
    },
    /**
     * @param {import('cookie').CookieParseOptions} opts
     */
    getAll(opts) {
      const decoder = opts?.decode || decodeURIComponent;
      const cookies2 = parse_1(header, { decode: decoder });
      for (const c2 of Object.values(new_cookies)) {
        if (domain_matches(url.hostname, c2.options.domain) && path_matches(url.pathname, c2.options.path)) {
          cookies2[c2.name] = c2.value;
        }
      }
      return Object.entries(cookies2).map(([name2, value]) => ({ name: name2, value }));
    },
    /**
     * @param {string} name
     * @param {string} value
     * @param {import('./page/types.js').Cookie['options']} options
     */
    set(name2, value, options2) {
      validate_options(options2);
      set_internal(name2, value, { ...defaults2, ...options2 });
    },
    /**
     * @param {string} name
     *  @param {import('./page/types.js').Cookie['options']} options
     */
    delete(name2, options2) {
      validate_options(options2);
      cookies.set(name2, "", { ...options2, maxAge: 0 });
    },
    /**
     * @param {string} name
     * @param {string} value
     *  @param {import('./page/types.js').Cookie['options']} options
     */
    serialize(name2, value, options2) {
      validate_options(options2);
      let path = options2.path;
      if (!options2.domain || options2.domain === url.hostname) {
        path = resolve(normalized_url, path);
      }
      return serialize_1(name2, value, { ...defaults2, ...options2, path });
    }
  };
  function get_cookie_header(destination, header2) {
    const combined_cookies = {
      // cookies sent by the user agent have lowest precedence
      ...initial_cookies
    };
    for (const key2 in new_cookies) {
      const cookie = new_cookies[key2];
      if (!domain_matches(destination.hostname, cookie.options.domain)) continue;
      if (!path_matches(destination.pathname, cookie.options.path)) continue;
      const encoder2 = cookie.options.encode || encodeURIComponent;
      combined_cookies[cookie.name] = encoder2(cookie.value);
    }
    if (header2) {
      const parsed = parse_1(header2, { decode: (value) => value });
      for (const name2 in parsed) {
        combined_cookies[name2] = parsed[name2];
      }
    }
    return Object.entries(combined_cookies).map(([name2, value]) => `${name2}=${value}`).join("; ");
  }
  function set_internal(name2, value, options2) {
    let path = options2.path;
    if (!options2.domain || options2.domain === url.hostname) {
      path = resolve(normalized_url, path);
    }
    new_cookies[name2] = { name: name2, value, options: { ...options2, path } };
  }
  return { cookies, new_cookies, get_cookie_header, set_internal };
}
function domain_matches(hostname, constraint) {
  if (!constraint) return true;
  const normalized = constraint[0] === "." ? constraint.slice(1) : constraint;
  if (hostname === normalized) return true;
  return hostname.endsWith("." + normalized);
}
function path_matches(path, constraint) {
  if (!constraint) return true;
  const normalized = constraint.endsWith("/") ? constraint.slice(0, -1) : constraint;
  if (path === normalized) return true;
  return path.startsWith(normalized + "/");
}
function add_cookies_to_headers(headers2, cookies) {
  for (const new_cookie of cookies) {
    const { name: name2, value, options: options2 } = new_cookie;
    headers2.append("set-cookie", serialize_1(name2, value, options2));
    if (options2.path.endsWith(".html")) {
      const path = add_data_suffix(options2.path);
      headers2.append("set-cookie", serialize_1(name2, value, { ...options2, path }));
    }
  }
}
var setCookie = { exports: {} };
var defaultParseOptions = {
  decodeValues: true,
  map: false,
  silent: false
};
function isNonEmptyString(str) {
  return typeof str === "string" && !!str.trim();
}
function parseString(setCookieValue, options2) {
  var parts = setCookieValue.split(";").filter(isNonEmptyString);
  var nameValuePairStr = parts.shift();
  var parsed = parseNameValuePair(nameValuePairStr);
  var name2 = parsed.name;
  var value = parsed.value;
  options2 = options2 ? Object.assign({}, defaultParseOptions, options2) : defaultParseOptions;
  try {
    value = options2.decodeValues ? decodeURIComponent(value) : value;
  } catch (e) {
    console.error(
      "set-cookie-parser encountered an error while decoding a cookie with value '" + value + "'. Set options.decodeValues to false to disable this feature.",
      e
    );
  }
  var cookie = {
    name: name2,
    value
  };
  parts.forEach(function(part) {
    var sides = part.split("=");
    var key2 = sides.shift().trimLeft().toLowerCase();
    var value2 = sides.join("=");
    if (key2 === "expires") {
      cookie.expires = new Date(value2);
    } else if (key2 === "max-age") {
      cookie.maxAge = parseInt(value2, 10);
    } else if (key2 === "secure") {
      cookie.secure = true;
    } else if (key2 === "httponly") {
      cookie.httpOnly = true;
    } else if (key2 === "samesite") {
      cookie.sameSite = value2;
    } else if (key2 === "partitioned") {
      cookie.partitioned = true;
    } else {
      cookie[key2] = value2;
    }
  });
  return cookie;
}
function parseNameValuePair(nameValuePairStr) {
  var name2 = "";
  var value = "";
  var nameValueArr = nameValuePairStr.split("=");
  if (nameValueArr.length > 1) {
    name2 = nameValueArr.shift();
    value = nameValueArr.join("=");
  } else {
    value = nameValuePairStr;
  }
  return { name: name2, value };
}
function parse(input, options2) {
  options2 = options2 ? Object.assign({}, defaultParseOptions, options2) : defaultParseOptions;
  if (!input) {
    if (!options2.map) {
      return [];
    } else {
      return {};
    }
  }
  if (input.headers) {
    if (typeof input.headers.getSetCookie === "function") {
      input = input.headers.getSetCookie();
    } else if (input.headers["set-cookie"]) {
      input = input.headers["set-cookie"];
    } else {
      var sch = input.headers[Object.keys(input.headers).find(function(key2) {
        return key2.toLowerCase() === "set-cookie";
      })];
      if (!sch && input.headers.cookie && !options2.silent) {
        console.warn(
          "Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning."
        );
      }
      input = sch;
    }
  }
  if (!Array.isArray(input)) {
    input = [input];
  }
  options2 = options2 ? Object.assign({}, defaultParseOptions, options2) : defaultParseOptions;
  if (!options2.map) {
    return input.filter(isNonEmptyString).map(function(str) {
      return parseString(str, options2);
    });
  } else {
    var cookies = {};
    return input.filter(isNonEmptyString).reduce(function(cookies2, str) {
      var cookie = parseString(str, options2);
      cookies2[cookie.name] = cookie;
      return cookies2;
    }, cookies);
  }
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString;
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  var cookiesStrings = [];
  var pos = 0;
  var start;
  var ch;
  var lastComma;
  var nextStart;
  var cookiesSeparatorFound;
  function skipWhitespace() {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  }
  function notSpecialChar() {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  }
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.substring(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
    }
  }
  return cookiesStrings;
}
setCookie.exports = parse;
setCookie.exports.parse = parse;
var parseString_1 = setCookie.exports.parseString = parseString;
var splitCookiesString_1 = setCookie.exports.splitCookiesString = splitCookiesString;
function create_fetch({ event, options: options2, manifest: manifest2, state, get_cookie_header, set_internal }) {
  const server_fetch = async (info, init2) => {
    const original_request = normalize_fetch_input(info, init2, event.url);
    let mode = (info instanceof Request ? info.mode : init2?.mode) ?? "cors";
    let credentials = (info instanceof Request ? info.credentials : init2?.credentials) ?? "same-origin";
    return options2.hooks.handleFetch({
      event,
      request: original_request,
      fetch: async (info2, init3) => {
        const request = normalize_fetch_input(info2, init3, event.url);
        const url = new URL(request.url);
        if (!request.headers.has("origin")) {
          request.headers.set("origin", event.url.origin);
        }
        if (info2 !== original_request) {
          mode = (info2 instanceof Request ? info2.mode : init3?.mode) ?? "cors";
          credentials = (info2 instanceof Request ? info2.credentials : init3?.credentials) ?? "same-origin";
        }
        if ((request.method === "GET" || request.method === "HEAD") && (mode === "no-cors" && url.origin !== event.url.origin || url.origin === event.url.origin)) {
          request.headers.delete("origin");
        }
        if (url.origin !== event.url.origin) {
          if (`.${url.hostname}`.endsWith(`.${event.url.hostname}`) && credentials !== "omit") {
            const cookie = get_cookie_header(url, request.headers.get("cookie"));
            if (cookie) request.headers.set("cookie", cookie);
          }
          return fetch(request);
        }
        const prefix2 = assets || base;
        const decoded = decodeURIComponent(url.pathname);
        const filename = (decoded.startsWith(prefix2) ? decoded.slice(prefix2.length) : decoded).slice(1);
        const filename_html = `${filename}/index.html`;
        const is_asset = manifest2.assets.has(filename);
        const is_asset_html = manifest2.assets.has(filename_html);
        if (is_asset || is_asset_html) {
          const file = is_asset ? filename : filename_html;
          if (state.read) {
            const type = is_asset ? manifest2.mimeTypes[filename.slice(filename.lastIndexOf("."))] : "text/html";
            return new Response(state.read(file), {
              headers: type ? { "content-type": type } : {}
            });
          }
          return await fetch(request);
        }
        if (credentials !== "omit") {
          const cookie = get_cookie_header(url, request.headers.get("cookie"));
          if (cookie) {
            request.headers.set("cookie", cookie);
          }
          const authorization = event.request.headers.get("authorization");
          if (authorization && !request.headers.has("authorization")) {
            request.headers.set("authorization", authorization);
          }
        }
        if (!request.headers.has("accept")) {
          request.headers.set("accept", "*/*");
        }
        if (!request.headers.has("accept-language")) {
          request.headers.set(
            "accept-language",
            /** @type {string} */
            event.request.headers.get("accept-language")
          );
        }
        const response = await respond(request, options2, manifest2, {
          ...state,
          depth: state.depth + 1
        });
        const set_cookie = response.headers.get("set-cookie");
        if (set_cookie) {
          for (const str of splitCookiesString_1(set_cookie)) {
            const { name: name2, value, ...options3 } = parseString_1(str, {
              decodeValues: false
            });
            const path = options3.path ?? (url.pathname.split("/").slice(0, -1).join("/") || "/");
            set_internal(name2, value, {
              path,
              encode: (value2) => value2,
              .../** @type {import('cookie').CookieSerializeOptions} */
              options3
            });
          }
        }
        return response;
      }
    });
  };
  return (input, init2) => {
    const response = server_fetch(input, init2);
    response.catch(() => {
    });
    return response;
  };
}
function normalize_fetch_input(info, init2, url) {
  if (info instanceof Request) {
    return info;
  }
  return new Request(typeof info === "string" ? new URL(info, url) : info, init2);
}
var body;
var etag;
var headers;
function get_public_env(request) {
  body ?? (body = `export const env=${JSON.stringify(public_env)}`);
  etag ?? (etag = `W/${Date.now()}`);
  headers ?? (headers = new Headers({
    "content-type": "application/javascript; charset=utf-8",
    etag
  }));
  if (request.headers.get("if-none-match") === etag) {
    return new Response(void 0, { status: 304, headers });
  }
  return new Response(body, { headers });
}
function get_page_config(nodes) {
  let current = {};
  for (const node of nodes) {
    if (!node?.universal?.config && !node?.server?.config) continue;
    current = {
      ...current,
      ...node?.universal?.config,
      ...node?.server?.config
    };
  }
  return Object.keys(current).length ? current : void 0;
}
var default_transform = ({ html }) => html;
var default_filter = () => false;
var default_preload = ({ type }) => type === "js" || type === "css";
var page_methods = /* @__PURE__ */ new Set(["GET", "HEAD", "POST"]);
var allowed_page_methods = /* @__PURE__ */ new Set(["GET", "HEAD", "OPTIONS"]);
async function respond(request, options2, manifest2, state) {
  const url = new URL(request.url);
  if (options2.csrf_check_origin) {
    const forbidden = is_form_content_type(request) && (request.method === "POST" || request.method === "PUT" || request.method === "PATCH" || request.method === "DELETE") && request.headers.get("origin") !== url.origin;
    if (forbidden) {
      const csrf_error = new HttpError(
        403,
        `Cross-site ${request.method} form submissions are forbidden`
      );
      if (request.headers.get("accept") === "application/json") {
        return json(csrf_error.body, { status: csrf_error.status });
      }
      return text(csrf_error.body.message, { status: csrf_error.status });
    }
  }
  let rerouted_path;
  try {
    rerouted_path = options2.hooks.reroute({ url: new URL(url) }) ?? url.pathname;
  } catch {
    return text("Internal Server Error", {
      status: 500
    });
  }
  let decoded;
  try {
    decoded = decode_pathname(rerouted_path);
  } catch {
    return text("Malformed URI", { status: 400 });
  }
  let route = null;
  let params = {};
  if (base && !state.prerendering?.fallback) {
    if (!decoded.startsWith(base)) {
      return text("Not found", { status: 404 });
    }
    decoded = decoded.slice(base.length) || "/";
  }
  if (decoded === `/${options2.app_dir}/env.js`) {
    return get_public_env(request);
  }
  if (decoded.startsWith(`/${options2.app_dir}`)) {
    const headers22 = new Headers();
    headers22.set("cache-control", "public, max-age=0, must-revalidate");
    return text("Not found", { status: 404, headers: headers22 });
  }
  const is_data_request = has_data_suffix(decoded);
  let invalidated_data_nodes;
  if (is_data_request) {
    decoded = strip_data_suffix(decoded) || "/";
    url.pathname = strip_data_suffix(url.pathname) + (url.searchParams.get(TRAILING_SLASH_PARAM) === "1" ? "/" : "") || "/";
    url.searchParams.delete(TRAILING_SLASH_PARAM);
    invalidated_data_nodes = url.searchParams.get(INVALIDATED_PARAM)?.split("").map((node) => node === "1");
    url.searchParams.delete(INVALIDATED_PARAM);
  }
  if (!state.prerendering?.fallback) {
    const matchers = await manifest2._.matchers();
    for (const candidate of manifest2._.routes) {
      const match = candidate.pattern.exec(decoded);
      if (!match) continue;
      const matched = exec(match, candidate.params, matchers);
      if (matched) {
        route = candidate;
        params = decode_params(matched);
        break;
      }
    }
  }
  let trailing_slash = void 0;
  const headers2 = {};
  let cookies_to_add = {};
  const event = {
    // @ts-expect-error `cookies` and `fetch` need to be created after the `event` itself
    cookies: null,
    // @ts-expect-error
    fetch: null,
    getClientAddress: state.getClientAddress || (() => {
      throw new Error(
        `${"@sveltejs/adapter-netlify"} does not specify getClientAddress. Please raise an issue`
      );
    }),
    locals: {},
    params,
    platform: state.platform,
    request,
    route: { id: route?.id ?? null },
    setHeaders: (new_headers) => {
      for (const key2 in new_headers) {
        const lower = key2.toLowerCase();
        const value = new_headers[key2];
        if (lower === "set-cookie") {
          throw new Error(
            "Use `event.cookies.set(name, value, options)` instead of `event.setHeaders` to set cookies"
          );
        } else if (lower in headers2) {
          throw new Error(`"${key2}" header is already set`);
        } else {
          headers2[lower] = value;
          if (state.prerendering && lower === "cache-control") {
            state.prerendering.cache = /** @type {string} */
            value;
          }
        }
      }
    },
    url,
    isDataRequest: is_data_request,
    isSubRequest: state.depth > 0
  };
  let resolve_opts = {
    transformPageChunk: default_transform,
    filterSerializedResponseHeaders: default_filter,
    preload: default_preload
  };
  try {
    if (route) {
      if (url.pathname === base || url.pathname === base + "/") {
        trailing_slash = "always";
      } else if (route.page) {
        const nodes = await load_page_nodes(route.page, manifest2);
        if (DEV) ;
        trailing_slash = get_option(nodes, "trailingSlash");
      } else if (route.endpoint) {
        const node = await route.endpoint();
        trailing_slash = node.trailingSlash;
        if (DEV) ;
      }
      if (!is_data_request) {
        const normalized = normalize_path(url.pathname, trailing_slash ?? "never");
        if (normalized !== url.pathname && !state.prerendering?.fallback) {
          return new Response(void 0, {
            status: 308,
            headers: {
              "x-sveltekit-normalize": "1",
              location: (
                // ensure paths starting with '//' are not treated as protocol-relative
                (normalized.startsWith("//") ? url.origin + normalized : normalized) + (url.search === "?" ? "" : url.search)
              )
            }
          });
        }
      }
      if (state.before_handle || state.emulator?.platform) {
        let config = {};
        let prerender = false;
        if (route.endpoint) {
          const node = await route.endpoint();
          config = node.config ?? config;
          prerender = node.prerender ?? prerender;
        } else if (route.page) {
          const nodes = await load_page_nodes(route.page, manifest2);
          config = get_page_config(nodes) ?? config;
          prerender = get_option(nodes, "prerender") ?? false;
        }
        if (state.before_handle) {
          state.before_handle(event, config, prerender);
        }
        if (state.emulator?.platform) {
          event.platform = await state.emulator.platform({ config, prerender });
        }
      }
    }
    const { cookies, new_cookies, get_cookie_header, set_internal } = get_cookies(
      request,
      url,
      trailing_slash ?? "never"
    );
    cookies_to_add = new_cookies;
    event.cookies = cookies;
    event.fetch = create_fetch({
      event,
      options: options2,
      manifest: manifest2,
      state,
      get_cookie_header,
      set_internal
    });
    if (state.prerendering && !state.prerendering.fallback) disable_search(url);
    const response = await options2.hooks.handle({
      event,
      resolve: (event2, opts) => resolve2(event2, opts).then((response2) => {
        for (const key2 in headers2) {
          const value = headers2[key2];
          response2.headers.set(
            key2,
            /** @type {string} */
            value
          );
        }
        add_cookies_to_headers(response2.headers, Object.values(cookies_to_add));
        if (state.prerendering && event2.route.id !== null) {
          response2.headers.set("x-sveltekit-routeid", encodeURI(event2.route.id));
        }
        return response2;
      })
    });
    if (response.status === 200 && response.headers.has("etag")) {
      let if_none_match_value = request.headers.get("if-none-match");
      if (if_none_match_value?.startsWith('W/"')) {
        if_none_match_value = if_none_match_value.substring(2);
      }
      const etag2 = (
        /** @type {string} */
        response.headers.get("etag")
      );
      if (if_none_match_value === etag2) {
        const headers22 = new Headers({ etag: etag2 });
        for (const key2 of [
          "cache-control",
          "content-location",
          "date",
          "expires",
          "vary",
          "set-cookie"
        ]) {
          const value = response.headers.get(key2);
          if (value) headers22.set(key2, value);
        }
        return new Response(void 0, {
          status: 304,
          headers: headers22
        });
      }
    }
    if (is_data_request && response.status >= 300 && response.status <= 308) {
      const location = response.headers.get("location");
      if (location) {
        return redirect_json_response(new Redirect(
          /** @type {any} */
          response.status,
          location
        ));
      }
    }
    return response;
  } catch (e) {
    if (e instanceof Redirect) {
      const response = is_data_request ? redirect_json_response(e) : route?.page && is_action_json_request(event) ? action_json_redirect(e) : redirect_response(e.status, e.location);
      add_cookies_to_headers(response.headers, Object.values(cookies_to_add));
      return response;
    }
    return await handle_fatal_error(event, options2, e);
  }
  async function resolve2(event2, opts) {
    try {
      if (opts) {
        resolve_opts = {
          transformPageChunk: opts.transformPageChunk || default_transform,
          filterSerializedResponseHeaders: opts.filterSerializedResponseHeaders || default_filter,
          preload: opts.preload || default_preload
        };
      }
      if (state.prerendering?.fallback) {
        return await render_response({
          event: event2,
          options: options2,
          manifest: manifest2,
          state,
          page_config: { ssr: false, csr: true },
          status: 200,
          error: null,
          branch: [],
          fetched: [],
          resolve_opts
        });
      }
      if (route) {
        const method = (
          /** @type {import('types').HttpMethod} */
          event2.request.method
        );
        let response;
        if (is_data_request) {
          response = await render_data(
            event2,
            route,
            options2,
            manifest2,
            state,
            invalidated_data_nodes,
            trailing_slash ?? "never"
          );
        } else if (route.endpoint && (!route.page || is_endpoint_request(event2))) {
          response = await render_endpoint(event2, await route.endpoint(), state);
        } else if (route.page) {
          if (page_methods.has(method)) {
            response = await render_page(event2, route.page, options2, manifest2, state, resolve_opts);
          } else {
            const allowed_methods2 = new Set(allowed_page_methods);
            const node = await manifest2._.nodes[route.page.leaf]();
            if (node?.server?.actions) {
              allowed_methods2.add("POST");
            }
            if (method === "OPTIONS") {
              response = new Response(null, {
                status: 204,
                headers: {
                  allow: Array.from(allowed_methods2.values()).join(", ")
                }
              });
            } else {
              const mod = [...allowed_methods2].reduce(
                (acc, curr) => {
                  acc[curr] = true;
                  return acc;
                },
                /** @type {Record<string, any>} */
                {}
              );
              response = method_not_allowed(mod, method);
            }
          }
        } else {
          throw new Error("This should never happen");
        }
        if (request.method === "GET" && route.page && route.endpoint) {
          const vary = response.headers.get("vary")?.split(",")?.map((v) => v.trim().toLowerCase());
          if (!(vary?.includes("accept") || vary?.includes("*"))) {
            response = new Response(response.body, {
              status: response.status,
              statusText: response.statusText,
              headers: new Headers(response.headers)
            });
            response.headers.append("Vary", "Accept");
          }
        }
        return response;
      }
      if (state.error && event2.isSubRequest) {
        return await fetch(request, {
          headers: {
            "x-sveltekit-error": "true"
          }
        });
      }
      if (state.error) {
        return text("Internal Server Error", {
          status: 500
        });
      }
      if (state.depth === 0) {
        return await respond_with_error({
          event: event2,
          options: options2,
          manifest: manifest2,
          state,
          status: 404,
          error: new SvelteKitError(404, "Not Found", `Not found: ${event2.url.pathname}`),
          resolve_opts
        });
      }
      if (state.prerendering) {
        return text("not found", { status: 404 });
      }
      return await fetch(request);
    } catch (e) {
      return await handle_fatal_error(event2, options2, e);
    } finally {
      event2.cookies.set = () => {
        throw new Error("Cannot use `cookies.set(...)` after the response has been generated");
      };
      event2.setHeaders = () => {
        throw new Error("Cannot use `setHeaders(...)` after the response has been generated");
      };
    }
  }
}
function filter_private_env(env, { public_prefix, private_prefix }) {
  return Object.fromEntries(
    Object.entries(env).filter(
      ([k]) => k.startsWith(private_prefix) && (public_prefix === "" || !k.startsWith(public_prefix))
    )
  );
}
function filter_public_env(env, { public_prefix, private_prefix }) {
  return Object.fromEntries(
    Object.entries(env).filter(
      ([k]) => k.startsWith(public_prefix) && (private_prefix === "" || !k.startsWith(private_prefix))
    )
  );
}
var prerender_env_handler = {
  get({ type }, prop) {
    throw new Error(
      `Cannot read values from $env/dynamic/${type} while prerendering (attempted to read env.${prop.toString()}). Use $env/static/${type} instead`
    );
  }
};
var _options, _manifest;
var Server = class {
  /** @param {import('@sveltejs/kit').SSRManifest} manifest */
  constructor(manifest2) {
    /** @type {import('types').SSROptions} */
    __privateAdd(this, _options);
    /** @type {import('@sveltejs/kit').SSRManifest} */
    __privateAdd(this, _manifest);
    __privateSet(this, _options, options);
    __privateSet(this, _manifest, manifest2);
  }
  /**
   * @param {{
   *   env: Record<string, string>;
   *   read?: (file: string) => ReadableStream;
   * }} opts
   */
  async init({ env, read }) {
    const prefixes = {
      public_prefix: __privateGet(this, _options).env_public_prefix,
      private_prefix: __privateGet(this, _options).env_private_prefix
    };
    const private_env = filter_private_env(env, prefixes);
    const public_env2 = filter_public_env(env, prefixes);
    set_private_env(
      prerendering ? new Proxy({ type: "private" }, prerender_env_handler) : private_env
    );
    set_public_env(
      prerendering ? new Proxy({ type: "public" }, prerender_env_handler) : public_env2
    );
    set_safe_public_env(public_env2);
    if (!__privateGet(this, _options).hooks) {
      try {
        const module = await get_hooks();
        __privateGet(this, _options).hooks = {
          handle: module.handle || (({ event, resolve: resolve2 }) => resolve2(event)),
          handleError: module.handleError || (({ error }) => console.error(error)),
          handleFetch: module.handleFetch || (({ request, fetch: fetch2 }) => fetch2(request)),
          reroute: module.reroute || (() => {
          })
        };
      } catch (error) {
        {
          throw error;
        }
      }
    }
  }
  /**
   * @param {Request} request
   * @param {import('types').RequestOptions} options
   */
  async respond(request, options2) {
    return respond(request, __privateGet(this, _options), __privateGet(this, _manifest), {
      ...options2,
      error: false,
      depth: 0
    });
  }
};
_options = new WeakMap();
_manifest = new WeakMap();

// .svelte-kit/netlify-tmp/manifest.js
var manifest = (() => {
  function __memo(fn) {
    let value;
    return () => value ?? (value = value = fn());
  }
  return {
    appDir: "_app",
    appPath: "_app",
    assets: /* @__PURE__ */ new Set(["16x16.svg", "dormster.png", "dormster.svg", "favicon.png"]),
    mimeTypes: { ".svg": "image/svg+xml", ".png": "image/png" },
    _: {
      client: { "start": "_app/immutable/entry/start.Lvlu9UmR.js", "app": "_app/immutable/entry/app.CNGnchPM.js", "imports": ["_app/immutable/entry/start.Lvlu9UmR.js", "_app/immutable/chunks/entry.C7CvdWvJ.js", "_app/immutable/chunks/index-client.C_P2apAl.js", "_app/immutable/entry/app.CNGnchPM.js", "_app/immutable/chunks/index-client.C_P2apAl.js", "_app/immutable/chunks/render.B7uRD5bS.js", "_app/immutable/chunks/disclose-version.BogR3-rD.js", "_app/immutable/chunks/if.Bf3PrYk7.js", "_app/immutable/chunks/3.BlDwM_1K.js", "_app/immutable/chunks/props.C-_ZoY2P.js"], "stylesheets": [], "fonts": [], "uses_env_dynamic_public": false },
      nodes: [
        __memo(() => Promise.resolve().then(() => (init__(), __exports))),
        __memo(() => Promise.resolve().then(() => (init__2(), __exports2))),
        __memo(() => Promise.resolve().then(() => (init__3(), __exports3))),
        __memo(() => Promise.resolve().then(() => (init__4(), __exports4))),
        __memo(() => Promise.resolve().then(() => (init__5(), __exports5))),
        __memo(() => Promise.resolve().then(() => (init__6(), __exports6)))
      ],
      routes: [
        {
          id: "/",
          pattern: /^\/$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 2 },
          endpoint: null
        },
        {
          id: "/dorms",
          pattern: /^\/dorms\/?$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 3 },
          endpoint: null
        },
        {
          id: "/dorms/[id]",
          pattern: /^\/dorms\/([^/]+?)\/?$/,
          params: [{ "name": "id", "optional": false, "rest": false, "chained": false }],
          page: { layouts: [0], errors: [1], leaf: 4 },
          endpoint: null
        },
        {
          id: "/search",
          pattern: /^\/search\/?$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 5 },
          endpoint: null
        }
      ],
      matchers: async () => {
        return {};
      },
      server_assets: {}
    }
  };
})();
var prerendered = /* @__PURE__ */ new Set([]);

// .svelte-kit/netlify-tmp/entry.js
var server = new Server(manifest);
var prefix = `/${manifest.appPath}/`;
var initialized = server.init({
  // @ts-ignore
  env: Deno.env.toObject()
});
async function handler(request, context) {
  if (is_static_file(request)) {
    return;
  }
  await initialized;
  return server.respond(request, {
    platform: { context },
    getClientAddress() {
      return context.ip;
    }
  });
}
function is_static_file(request) {
  const url = new URL(request.url);
  if (url.pathname.startsWith(prefix)) {
    return true;
  }
  const pathname = url.pathname.replace(/\/$/, "");
  let file = pathname.substring(1);
  try {
    file = decodeURIComponent(file);
  } catch {
  }
  return manifest.assets.has(file) || manifest.assets.has(file + "/index.html") || prerendered.has(pathname || "/");
}
export {
  handler as default
};
/*!
* tabbable 6.2.0
* @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
*/
/*!
* focus-trap 7.5.4
* @license MIT, https://github.com/focus-trap/focus-trap/blob/master/LICENSE
*/
/**
 * @license lucide-svelte v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
//# sourceMappingURL=render.js.map
