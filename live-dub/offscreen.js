(() => {
  "use strict";
  var e = [
    { name: "Afrikaans", nativeName: "Afrikaans", code: "af", supportTTS: !0 },
    { name: "Albanian", nativeName: "Shqip", code: "sq", supportTTS: !1 },
    { name: "Arabic", nativeName: "العربية", code: "ar", supportTTS: !0 },
    {
      name: "Azerbaijani",
      nativeName: "Azərbaycan",
      code: "az",
      supportTTS: !1,
    },
    { name: "Basque", nativeName: "Euskara", code: "eu", supportTTS: !0 },
    {
      name: "Belarusian",
      nativeName: "Беларуская",
      code: "be",
      supportTTS: !1,
    },
    { name: "Bengali", nativeName: "বাংলা", code: "bn", supportTTS: !0 },
    { name: "Bosnian", nativeName: "Bosanski", code: "bs", supportTTS: !1 },
    { name: "Bulgarian", nativeName: "Български", code: "bg", supportTTS: !0 },
    { name: "Catalan", nativeName: "Català", code: "ca", supportTTS: !0 },
    { name: "Chinese", nativeName: "简体中文", code: "zh", supportTTS: !0 },
    { name: "Croatian", nativeName: "Hrvatski", code: "hr", supportTTS: !1 },
    { name: "Czech", nativeName: "Čeština", code: "cs", supportTTS: !0 },
    { name: "Danish", nativeName: "Dansk", code: "da", supportTTS: !0 },
    { name: "Dutch", nativeName: "Nederlands", code: "nl", supportTTS: !0 },
    { name: "English", nativeName: "English", code: "en", supportTTS: !0 },
    { name: "Estonian", nativeName: "Eesti", code: "et", supportTTS: !1 },
    { name: "Finnish", nativeName: "Suomi", code: "fi", supportTTS: !0 },
    { name: "French", nativeName: "Français", code: "fr", supportTTS: !0 },
    { name: "Galician", nativeName: "Galego", code: "gl", supportTTS: !0 },
    { name: "German", nativeName: "Deutsch", code: "de", supportTTS: !0 },
    { name: "Greek", nativeName: "Ελληνικά", code: "el", supportTTS: !0 },
    { name: "Gujarati", nativeName: "ગુજરાતી", code: "gu", supportTTS: !0 },
    { name: "Hebrew", nativeName: "עברית", code: "he", supportTTS: !1 },
    { name: "Hindi", nativeName: "हिन्दी", code: "hi", supportTTS: !0 },
    { name: "Hungarian", nativeName: "Magyar", code: "hu", supportTTS: !0 },
    {
      name: "Indonesian",
      nativeName: "Bahasa Indonesia",
      code: "id",
      supportTTS: !0,
    },
    { name: "Italian", nativeName: "Italiano", code: "it", supportTTS: !0 },
    { name: "Japanese", nativeName: "日本語", code: "ja", supportTTS: !0 },
    { name: "Kannada", nativeName: "ಕನ್ನಡ", code: "kn", supportTTS: !0 },
    { name: "Kazakh", nativeName: "Қазақ", code: "kk", supportTTS: !1 },
    { name: "Korean", nativeName: "한국어", code: "ko", supportTTS: !0 },
    { name: "Latvian", nativeName: "Latviešu", code: "lv", supportTTS: !0 },
    { name: "Lithuanian", nativeName: "Lietuvių", code: "lt", supportTTS: !0 },
    {
      name: "Macedonian",
      nativeName: "Македонски",
      code: "mk",
      supportTTS: !1,
    },
    { name: "Malay", nativeName: "Bahasa Melayu", code: "ms", supportTTS: !0 },
    { name: "Malayalam", nativeName: "മലയാളം", code: "ml", supportTTS: !0 },
    { name: "Marathi", nativeName: "मराठी", code: "mr", supportTTS: !0 },
    { name: "Norwegian", nativeName: "Norsk", code: "no", supportTTS: !0 },
    { name: "Persian", nativeName: "فارسی", code: "fa", supportTTS: !1 },
    { name: "Polish", nativeName: "Polski", code: "pl", supportTTS: !0 },
    { name: "Portuguese", nativeName: "Português", code: "pt", supportTTS: !0 },
    { name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", code: "pa", supportTTS: !0 },
    { name: "Romanian", nativeName: "Română", code: "ro", supportTTS: !0 },
    { name: "Russian", nativeName: "Русский", code: "ru", supportTTS: !0 },
    { name: "Serbian", nativeName: "Српски", code: "sr", supportTTS: !0 },
    { name: "Slovak", nativeName: "Slovenčina", code: "sk", supportTTS: !0 },
    {
      name: "Slovenian",
      nativeName: "Slovenščina",
      code: "sl",
      supportTTS: !1,
    },
    { name: "Spanish", nativeName: "Español", code: "es", supportTTS: !0 },
    { name: "Swahili", nativeName: "Kiswahili", code: "sw", supportTTS: !1 },
    { name: "Swedish", nativeName: "Svenska", code: "sv", supportTTS: !0 },
    { name: "Tagalog", nativeName: "Tagalog", code: "tl", supportTTS: !0 },
    { name: "Tamil", nativeName: "தமிழ்", code: "ta", supportTTS: !0 },
    { name: "Telugu", nativeName: "తెలుగు", code: "te", supportTTS: !0 },
    { name: "Thai", nativeName: "ไทย", code: "th", supportTTS: !0 },
    { name: "Turkish", nativeName: "Türkçe", code: "tr", supportTTS: !0 },
    { name: "Ukrainian", nativeName: "Українська", code: "uk", supportTTS: !0 },
    { name: "Urdu", nativeName: "اردو", code: "ur", supportTTS: !1 },
    {
      name: "Vietnamese",
      nativeName: "Tiếng Việt",
      code: "vi",
      supportTTS: !0,
    },
    { name: "Welsh", nativeName: "Cymraeg", code: "cy", supportTTS: !1 },
  ];
  function t() {
    t = function () {
      return n;
    };
    var e,
      n = {},
      r = Object.prototype,
      a = r.hasOwnProperty,
      i =
        Object.defineProperty ||
        function (e, t, n) {
          e[t] = n.value;
        },
      c = "function" == typeof Symbol ? Symbol : {},
      u = c.iterator || "@@iterator",
      s = c.asyncIterator || "@@asyncIterator",
      l = c.toStringTag || "@@toStringTag";
    function f(e, t, n) {
      return (
        Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        }),
        e[t]
      );
    }
    try {
      f({}, "");
    } catch (e) {
      f = function (e, t, n) {
        return (e[t] = n);
      };
    }
    function p(e, t, n, r) {
      var a = t && t.prototype instanceof b ? t : b,
        o = Object.create(a.prototype),
        c = new O(r || []);
      return (i(o, "_invoke", { value: _(e, n, c) }), o);
    }
    function h(e, t, n) {
      try {
        return { type: "normal", arg: e.call(t, n) };
      } catch (e) {
        return { type: "throw", arg: e };
      }
    }
    n.wrap = p;
    var m = "suspendedStart",
      d = "suspendedYield",
      v = "executing",
      g = "completed",
      y = {};
    function b() {}
    function T() {}
    function w() {}
    var S = {};
    f(S, u, function () {
      return this;
    });
    var x = Object.getPrototypeOf,
      k = x && x(x(P([])));
    k && k !== r && a.call(k, u) && (S = k);
    var N = (w.prototype = b.prototype = Object.create(S));
    function M(e) {
      ["next", "throw", "return"].forEach(function (t) {
        f(e, t, function (e) {
          return this._invoke(t, e);
        });
      });
    }
    function A(e, t) {
      function n(r, i, c, u) {
        var s = h(e[r], e, i);
        if ("throw" !== s.type) {
          var l = s.arg,
            f = l.value;
          return f && "object" == o(f) && a.call(f, "__await")
            ? t.resolve(f.__await).then(
                function (e) {
                  n("next", e, c, u);
                },
                function (e) {
                  n("throw", e, c, u);
                },
              )
            : t.resolve(f).then(
                function (e) {
                  ((l.value = e), c(l));
                },
                function (e) {
                  return n("throw", e, c, u);
                },
              );
        }
        u(s.arg);
      }
      var r;
      i(this, "_invoke", {
        value: function (e, a) {
          function i() {
            return new t(function (t, r) {
              n(e, a, t, r);
            });
          }
          return (r = r ? r.then(i, i) : i());
        },
      });
    }
    function _(t, n, r) {
      var a = m;
      return function (i, o) {
        if (a === v) throw new Error("Generator is already running");
        if (a === g) {
          if ("throw" === i) throw o;
          return { value: e, done: !0 };
        }
        for (r.method = i, r.arg = o; ; ) {
          var c = r.delegate;
          if (c) {
            var u = E(c, r);
            if (u) {
              if (u === y) continue;
              return u;
            }
          }
          if ("next" === r.method) r.sent = r._sent = r.arg;
          else if ("throw" === r.method) {
            if (a === m) throw ((a = g), r.arg);
            r.dispatchException(r.arg);
          } else "return" === r.method && r.abrupt("return", r.arg);
          a = v;
          var s = h(t, n, r);
          if ("normal" === s.type) {
            if (((a = r.done ? g : d), s.arg === y)) continue;
            return { value: s.arg, done: r.done };
          }
          "throw" === s.type &&
            ((a = g), (r.method = "throw"), (r.arg = s.arg));
        }
      };
    }
    function E(t, n) {
      var r = n.method,
        a = t.iterator[r];
      if (a === e)
        return (
          (n.delegate = null),
          ("throw" === r &&
            t.iterator.return &&
            ((n.method = "return"),
            (n.arg = e),
            E(t, n),
            "throw" === n.method)) ||
            ("return" !== r &&
              ((n.method = "throw"),
              (n.arg = new TypeError(
                "The iterator does not provide a '" + r + "' method",
              )))),
          y
        );
      var i = h(a, t.iterator, n.arg);
      if ("throw" === i.type)
        return ((n.method = "throw"), (n.arg = i.arg), (n.delegate = null), y);
      var o = i.arg;
      return o
        ? o.done
          ? ((n[t.resultName] = o.value),
            (n.next = t.nextLoc),
            "return" !== n.method && ((n.method = "next"), (n.arg = e)),
            (n.delegate = null),
            y)
          : o
        : ((n.method = "throw"),
          (n.arg = new TypeError("iterator result is not an object")),
          (n.delegate = null),
          y);
    }
    function L(e) {
      var t = { tryLoc: e[0] };
      (1 in e && (t.catchLoc = e[1]),
        2 in e && ((t.finallyLoc = e[2]), (t.afterLoc = e[3])),
        this.tryEntries.push(t));
    }
    function I(e) {
      var t = e.completion || {};
      ((t.type = "normal"), delete t.arg, (e.completion = t));
    }
    function O(e) {
      ((this.tryEntries = [{ tryLoc: "root" }]),
        e.forEach(L, this),
        this.reset(!0));
    }
    function P(t) {
      if (t || "" === t) {
        var n = t[u];
        if (n) return n.call(t);
        if ("function" == typeof t.next) return t;
        if (!isNaN(t.length)) {
          var r = -1,
            i = function n() {
              for (; ++r < t.length; )
                if (a.call(t, r)) return ((n.value = t[r]), (n.done = !1), n);
              return ((n.value = e), (n.done = !0), n);
            };
          return (i.next = i);
        }
      }
      throw new TypeError(o(t) + " is not iterable");
    }
    return (
      (T.prototype = w),
      i(N, "constructor", { value: w, configurable: !0 }),
      i(w, "constructor", { value: T, configurable: !0 }),
      (T.displayName = f(w, l, "GeneratorFunction")),
      (n.isGeneratorFunction = function (e) {
        var t = "function" == typeof e && e.constructor;
        return (
          !!t && (t === T || "GeneratorFunction" === (t.displayName || t.name))
        );
      }),
      (n.mark = function (e) {
        return (
          Object.setPrototypeOf
            ? Object.setPrototypeOf(e, w)
            : ((e.__proto__ = w), f(e, l, "GeneratorFunction")),
          (e.prototype = Object.create(N)),
          e
        );
      }),
      (n.awrap = function (e) {
        return { __await: e };
      }),
      M(A.prototype),
      f(A.prototype, s, function () {
        return this;
      }),
      (n.AsyncIterator = A),
      (n.async = function (e, t, r, a, i) {
        void 0 === i && (i = Promise);
        var o = new A(p(e, t, r, a), i);
        return n.isGeneratorFunction(t)
          ? o
          : o.next().then(function (e) {
              return e.done ? e.value : o.next();
            });
      }),
      M(N),
      f(N, l, "Generator"),
      f(N, u, function () {
        return this;
      }),
      f(N, "toString", function () {
        return "[object Generator]";
      }),
      (n.keys = function (e) {
        var t = Object(e),
          n = [];
        for (var r in t) n.push(r);
        return (
          n.reverse(),
          function e() {
            for (; n.length; ) {
              var r = n.pop();
              if (r in t) return ((e.value = r), (e.done = !1), e);
            }
            return ((e.done = !0), e);
          }
        );
      }),
      (n.values = P),
      (O.prototype = {
        constructor: O,
        reset: function (t) {
          if (
            ((this.prev = 0),
            (this.next = 0),
            (this.sent = this._sent = e),
            (this.done = !1),
            (this.delegate = null),
            (this.method = "next"),
            (this.arg = e),
            this.tryEntries.forEach(I),
            !t)
          )
            for (var n in this)
              "t" === n.charAt(0) &&
                a.call(this, n) &&
                !isNaN(+n.slice(1)) &&
                (this[n] = e);
        },
        stop: function () {
          this.done = !0;
          var e = this.tryEntries[0].completion;
          if ("throw" === e.type) throw e.arg;
          return this.rval;
        },
        dispatchException: function (t) {
          if (this.done) throw t;
          var n = this;
          function r(r, a) {
            return (
              (c.type = "throw"),
              (c.arg = t),
              (n.next = r),
              a && ((n.method = "next"), (n.arg = e)),
              !!a
            );
          }
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var o = this.tryEntries[i],
              c = o.completion;
            if ("root" === o.tryLoc) return r("end");
            if (o.tryLoc <= this.prev) {
              var u = a.call(o, "catchLoc"),
                s = a.call(o, "finallyLoc");
              if (u && s) {
                if (this.prev < o.catchLoc) return r(o.catchLoc, !0);
                if (this.prev < o.finallyLoc) return r(o.finallyLoc);
              } else if (u) {
                if (this.prev < o.catchLoc) return r(o.catchLoc, !0);
              } else {
                if (!s)
                  throw new Error("try statement without catch or finally");
                if (this.prev < o.finallyLoc) return r(o.finallyLoc);
              }
            }
          }
        },
        abrupt: function (e, t) {
          for (var n = this.tryEntries.length - 1; n >= 0; --n) {
            var r = this.tryEntries[n];
            if (
              r.tryLoc <= this.prev &&
              a.call(r, "finallyLoc") &&
              this.prev < r.finallyLoc
            ) {
              var i = r;
              break;
            }
          }
          i &&
            ("break" === e || "continue" === e) &&
            i.tryLoc <= t &&
            t <= i.finallyLoc &&
            (i = null);
          var o = i ? i.completion : {};
          return (
            (o.type = e),
            (o.arg = t),
            i
              ? ((this.method = "next"), (this.next = i.finallyLoc), y)
              : this.complete(o)
          );
        },
        complete: function (e, t) {
          if ("throw" === e.type) throw e.arg;
          return (
            "break" === e.type || "continue" === e.type
              ? (this.next = e.arg)
              : "return" === e.type
                ? ((this.rval = this.arg = e.arg),
                  (this.method = "return"),
                  (this.next = "end"))
                : "normal" === e.type && t && (this.next = t),
            y
          );
        },
        finish: function (e) {
          for (var t = this.tryEntries.length - 1; t >= 0; --t) {
            var n = this.tryEntries[t];
            if (n.finallyLoc === e)
              return (this.complete(n.completion, n.afterLoc), I(n), y);
          }
        },
        catch: function (e) {
          for (var t = this.tryEntries.length - 1; t >= 0; --t) {
            var n = this.tryEntries[t];
            if (n.tryLoc === e) {
              var r = n.completion;
              if ("throw" === r.type) {
                var a = r.arg;
                I(n);
              }
              return a;
            }
          }
          throw new Error("illegal catch attempt");
        },
        delegateYield: function (t, n, r) {
          return (
            (this.delegate = { iterator: P(t), resultName: n, nextLoc: r }),
            "next" === this.method && (this.arg = e),
            y
          );
        },
      }),
      n
    );
  }
  function n(e, t) {
    var n =
      ("undefined" != typeof Symbol && e[Symbol.iterator]) || e["@@iterator"];
    if (!n) {
      if (
        Array.isArray(e) ||
        (n = (function (e, t) {
          if (!e) return;
          if ("string" == typeof e) return r(e, t);
          var n = Object.prototype.toString.call(e).slice(8, -1);
          "Object" === n && e.constructor && (n = e.constructor.name);
          if ("Map" === n || "Set" === n) return Array.from(e);
          if (
            "Arguments" === n ||
            /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
          )
            return r(e, t);
        })(e)) ||
        (t && e && "number" == typeof e.length)
      ) {
        n && (e = n);
        var a = 0,
          i = function () {};
        return {
          s: i,
          n: function () {
            return a >= e.length ? { done: !0 } : { done: !1, value: e[a++] };
          },
          e: function (e) {
            throw e;
          },
          f: i,
        };
      }
      throw new TypeError(
        "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
      );
    }
    var o,
      c = !0,
      u = !1;
    return {
      s: function () {
        n = n.call(e);
      },
      n: function () {
        var e = n.next();
        return ((c = e.done), e);
      },
      e: function (e) {
        ((u = !0), (o = e));
      },
      f: function () {
        try {
          c || null == n.return || n.return();
        } finally {
          if (u) throw o;
        }
      },
    };
  }
  function r(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
    return r;
  }
  function a(e, t, n, r, a, i, o) {
    try {
      var c = e[i](o),
        u = c.value;
    } catch (e) {
      return void n(e);
    }
    c.done ? t(u) : Promise.resolve(u).then(r, a);
  }
  function i(e) {
    return function () {
      var t = this,
        n = arguments;
      return new Promise(function (r, i) {
        var o = e.apply(t, n);
        function c(e) {
          a(o, r, i, c, u, "next", e);
        }
        function u(e) {
          a(o, r, i, c, u, "throw", e);
        }
        c(void 0);
      });
    };
  }
  function o(e) {
    return (
      (o =
        "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
          ? function (e) {
              return typeof e;
            }
          : function (e) {
              return e &&
                "function" == typeof Symbol &&
                e.constructor === Symbol &&
                e !== Symbol.prototype
                ? "symbol"
                : typeof e;
            }),
      o(e)
    );
  }
  var c = "",
    u = 24e3,
    s = 2,
    l = 400,
    f = 2500,
    p = "pcm";
  function h(t) {
    if ("auto" === t) return "Auto Detect";
    var n = e.find(function (e) {
      return e.code === t;
    });
    return n ? n.name : t;
  }
  function m(e) {
    try {
      return new URL(e).hostname;
    } catch (e) {
      return "";
    }
  }
  var d,
    v = "one_way",
    g = "auto",
    y = "zh";
  function b(e) {
    return e && "string" == typeof e
      ? e.trim().toLowerCase().replace(/_/g, "-")
      : "";
  }
  function T() {
    var e,
      t,
      n,
      r = String(v || "").toLowerCase();
    return (
      !(
        !r ||
        "none" === r ||
        "off" === r ||
        "transcription" === r ||
        "transcribe" === r
      ) &&
      !!y &&
      (!g ||
        "auto" === g ||
        ((e = y),
        (t = b(g)),
        (n = b(e)),
        !(t && n && (t === n || t.split("-")[0] === n.split("-")[0]))))
    );
  }
  function w(e) {
    var t = b(
      (function (e) {
        return (
          (e &&
            "object" === o(e) &&
            (e.language || e.lang || e.language_code)) ||
          ""
        );
      })(e),
    );
    if (!t || "auto" === t) return !0;
    var n = b(y);
    return !n || "auto" === n || t === n || t.split("-")[0] === n.split("-")[0];
  }
  function S(e) {
    if (!e || "object" !== o(e)) return "none";
    var t =
      "string" == typeof e.translation_status
        ? e.translation_status.trim().toLowerCase()
        : "";
    return "original" === t || "translation" === t || "none" === t ? t : "none";
  }
  var x,
    k,
    N,
    M,
    A,
    _,
    E,
    L,
    I,
    O = Promise.resolve(),
    P = 0,
    j = new Set(),
    C = "",
    F = 0,
    R = 1e3,
    B = null,
    V = null,
    z = null,
    U = null,
    G = [],
    W = new Map(),
    D = 0,
    q = null,
    H = new Map(),
    K = [],
    Y = 0,
    J = new Map(),
    $ = new Set(),
    Q = null,
    X = null,
    Z = [],
    ee = 0.8,
    te = 1,
    ne = !0,
    re = !0,
    ae = 0.7,
    ie = !1,
    oe = null,
    ce = "",
    ue = "",
    se = !1,
    le = 0,
    fe = 10,
    pe = 1e3,
    he = !1;
  function me() {
    return (me = i(
      t().mark(function e(n, r, a) {
        var i, o, c, u, s, l, f, p, v;
        return t().wrap(
          function (e) {
            for (;;)
              switch ((e.prev = e.next)) {
                case 0:
                  if (d === a) {
                    e.next = 2;
                    break;
                  }
                  return e.abrupt("return");
                case 2:
                  if (((i = "string" == typeof n), !n || i)) {
                    e.next = 25;
                    break;
                  }
                  if (!("undefined" != typeof Blob && n instanceof Blob)) {
                    e.next = 21;
                    break;
                  }
                  return ((e.prev = 7), (e.next = 10), n.arrayBuffer());
                case 10:
                  if (!nt(e.sent)) {
                    e.next = 13;
                    break;
                  }
                  return e.abrupt("return");
                case 13:
                  e.next = 19;
                  break;
                case 15:
                  return (
                    (e.prev = 15),
                    (e.t0 = e.catch(7)),
                    e.abrupt("return")
                  );
                case 19:
                  e.next = 23;
                  break;
                case 21:
                  if (!nt(n)) {
                    e.next = 23;
                    break;
                  }
                  return e.abrupt("return");
                case 23:
                  return e.abrupt("return");
                case 25:
                  if (
                    ((e.prev = 26),
                    (o = JSON.parse(n)),
                    performance.now(),
                    !o || "ready" !== o.type)
                  ) {
                    e.next = 38;
                    break;
                  }
                  try {
                    chrome.runtime.sendMessage({ type: "offscreenWsReady" });
                  } catch (e) {}
                  if (L)
                    try {
                      chrome.runtime.sendMessage({
                        type: "show-overlay",
                        tabId: L,
                      });
                    } catch (e) {}
                  try {
                    ((c = h(g)),
                      (u = h(y)),
                      (s = m(ue)),
                      chrome.runtime.sendMessage({
                        type: "trackEvent",
                        eventName: "task_started",
                        properties: {
                          from_lang: c,
                          to_lang: u,
                          domain: s,
                          tabUrl: ue,
                          tabTitle: ce,
                        },
                      }));
                  } catch (e) {}
                  (ge()
                    .then(function () {
                      le = 0;
                    })
                    .catch(function (e) {
                      ve("startAudioStreaming_failed");
                    }),
                    (e.next = 79));
                  break;
                case 38:
                  if (!o || "tts_end" !== o.type) {
                    e.next = 43;
                    break;
                  }
                  (at(o), (e.next = 79));
                  break;
                case 43:
                  if (!o || "tts_error" !== o.type) {
                    e.next = 48;
                    break;
                  }
                  (ot(o), (e.next = 79));
                  break;
                case 48:
                  if (!(o && o.tokens && Array.isArray(o.tokens))) {
                    e.next = 56;
                    break;
                  }
                  (performance.now(), ht(o), performance.now(), (e.next = 79));
                  break;
                case 56:
                  if (
                    !o ||
                    "error" !== o.type ||
                    "insufficient_balance_bypass" !== o.reason
                  ) {
                    e.next = 65;
                    break;
                  }
                  try {
                    chrome.runtime.sendMessage({
                      type: "trackEvent",
                      eventName: "quota_exhausted",
                      properties: {
                        balance: o.balance || 0,
                        message: o.message || "Balance depleted",
                      },
                    });
                  } catch (e) {}
                  try {
                    chrome.runtime.sendMessage({
                      type: "insufficientBalance",
                      tabId: L,
                      balance: o.balance || 0,
                      message:
                        o.message ||
                        "Your balance has been depleted. Connection will be closed.",
                    });
                  } catch (e) {}
                  he = !0;
                  try {
                    d && d.close();
                  } catch (e) {}
                  (Se(), (e.next = 79));
                  break;
                case 65:
                  if (
                    !o ||
                    ("transcript" !== o.type &&
                      "partial" !== o.type &&
                      "final" !== o.type)
                  ) {
                    e.next = 79;
                    break;
                  }
                  if ((l = o.text || o.transcript || "") && L) {
                    e.next = 70;
                    break;
                  }
                  return e.abrupt("return");
                case 70:
                  if (!se) {
                    e.next = 73;
                    break;
                  }
                  return e.abrupt("return");
                case 73:
                  ((f = {
                    type: "caption",
                    tabId: L,
                    isFinal: "final" === o.type,
                  }),
                    (p = T()),
                    (v = Be(l)),
                    p ? (f.textOriginal = v) : (f.textTranslated = v));
                  try {
                    chrome.runtime.sendMessage(f);
                  } catch (e) {}
                  f.isFinal && rt(f.textTranslated, !0);
                case 79:
                  e.next = 84;
                  break;
                case 81:
                  ((e.prev = 81), (e.t1 = e.catch(26)));
                case 84:
                case "end":
                  return e.stop();
              }
          },
          e,
          null,
          [
            [7, 15],
            [26, 81],
          ],
        );
      }),
    )).apply(this, arguments);
  }
  function de(e) {
    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    if (
      (e,
      !d ||
        (d.readyState !== WebSocket.OPEN &&
          d.readyState !== WebSocket.CONNECTING))
    ) {
      ((se = !1),
        t &&
          (t.translation && (v = t.translation),
          t.source_language && (g = t.source_language),
          t.target_language && (y = t.target_language)));
      var n = new URL("wss://ws3.soniccaption.com/realtime");
      (n.searchParams.set("translation", v),
        n.searchParams.set("source_language", g),
        n.searchParams.set("target_language", y),
        c && n.searchParams.set("voice", c),
        n.searchParams.set("idToken", e));
      var r = (function () {
        for (
          var e =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
            t = "",
            n = 0;
          n < 6;
          n++
        )
          t += e.charAt(Math.floor(62 * Math.random()));
        var r = new Date(),
          a = r.getFullYear(),
          i = String(r.getMonth() + 1).padStart(2, "0"),
          o = String(r.getDate()).padStart(2, "0"),
          c = String(r.getHours()).padStart(2, "0"),
          u = String(r.getMinutes()).padStart(2, "0"),
          s = String(r.getSeconds()).padStart(2, "0");
        return (
          "".concat(a).concat(i).concat(o).concat(c).concat(u).concat(s) + t
        );
      })();
      (n.searchParams.set("taskId", r),
        ce && n.searchParams.set("tabTitle", ce),
        ue && n.searchParams.set("tabUrl", ue));
      var a = n.toString();
      try {
        var i = new URL(a);
        i.searchParams.has("idToken") &&
          i.searchParams.set("idToken", "REDACTED");
      } catch (e) {}
      clearTimeout(I);
      try {
        chrome.runtime.sendMessage({ type: "offscreenConnecting" });
      } catch (e) {}
      var o = (d = new WebSocket(a));
      ((O = Promise.resolve()),
        (d.binaryType = "arraybuffer"),
        (d.onopen = function () {}),
        (d.onmessage = function (e) {
          if (d === o) {
            var t = performance.now(),
              n = e ? e.data : void 0;
            O = O.then(function () {
              return (function (e, t, n) {
                return me.apply(this, arguments);
              })(n, t, o);
            }).catch(function (e) {});
          }
        }),
        (d.onerror = function (e) {
          if (d === o)
            try {
              chrome.runtime.sendMessage({
                type: "offscreenError",
                message: String((e && e.message) || "ws_error"),
              });
            } catch (e) {}
        }),
        (d.onclose = function (e) {
          if (d === o) {
            try {
              chrome.runtime.sendMessage({
                type: "offscreenClose",
                code: e.code,
                reason: e.reason,
              });
            } catch (e) {}
            (Se(), he || ve("ws_close"));
          }
        }));
    }
  }
  function ve(e) {
    if (!he)
      if (le >= fe) {
        ((he = !0), clearTimeout(I));
        try {
          chrome.runtime.sendMessage({
            type: "offscreenError",
            message: "max_reconnect_exceeded",
          });
        } catch (e) {}
      } else {
        le += 1;
        var t = 200 * Math.random(),
          n = Math.min(3e4, pe * Math.pow(2, le - 1)) + t;
        try {
          chrome.runtime.sendMessage({
            type: "offscreenReconnect",
            attempt: le,
            delay: Math.round(n),
            reason: e,
          });
        } catch (e) {}
        (clearTimeout(I),
          (I = setTimeout(function () {
            if (!he)
              try {
                chrome.runtime.sendMessage({ type: "offscreenRequestAuth" });
              } catch (e) {}
          }, n)));
      }
  }
  function ge() {
    return ye.apply(this, arguments);
  }
  function ye() {
    return (ye = i(
      t().mark(function e() {
        var n, r, a, i;
        return t().wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return (
                  (e.next = 2),
                  new Promise(function (e) {
                    return setTimeout(e, 50);
                  })
                );
              case 2:
                return (
                  (e.next = 4),
                  new Promise(function (e, t) {
                    chrome.runtime.sendMessage(
                      { type: "requestTabStreamId" },
                      function (n) {
                        chrome.runtime.lastError
                          ? t(new Error(chrome.runtime.lastError.message))
                          : n && n.ok && n.streamId
                            ? e({ streamId: n.streamId, tabId: n.tabId })
                            : t(new Error((n && n.error) || "no streamId"));
                      },
                    );
                  })
                );
              case 4:
                if (((n = e.sent), (r = n.streamId), (L = n.tabId || L)))
                  try {
                    chrome.runtime.sendMessage({
                      type: "show-overlay",
                      tabId: L,
                    });
                  } catch (e) {}
                return (
                  (a = {
                    audio: {
                      mandatory: {
                        chromeMediaSource: "tab",
                        chromeMediaSourceId: r,
                      },
                    },
                    video: !1,
                  }),
                  (e.next = 11),
                  navigator.mediaDevices.getUserMedia(a)
                );
              case 11:
                return (
                  (i = e.sent),
                  (A = i),
                  (x = new (
                    window.AudioContext || window.webkitAudioContext
                  )()),
                  (k = x.createMediaStreamSource(i)),
                  (e.next = 19),
                  Te()
                );
              case 19:
                try {
                  (((M = x.createGain()).gain.value = ee),
                    k.connect(M).connect(x.destination));
                } catch (e) {}
                i.getTracks().forEach(function (e) {
                  e.onended = function () {
                    return Se();
                  };
                });
              case 21:
              case "end":
                return e.stop();
            }
        }, e);
      }),
    )).apply(this, arguments);
  }
  function be(e) {
    for (var t = new Int16Array(e.length), n = 0; n < e.length; n++) {
      var r = Math.max(-1, Math.min(1, e[n]));
      t[n] = r < 0 ? 32768 * r : 32767 * r;
    }
    return t;
  }
  function Te() {
    return we.apply(this, arguments);
  }
  function we() {
    return (we = i(
      t().mark(function e() {
        var n;
        return t().wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                if (x.audioWorklet) {
                  e.next = 2;
                  break;
                }
                throw new Error("AudioWorklet not supported");
              case 2:
                return (
                  (n = chrome.runtime.getURL("offscreen/audio-worklet.js")),
                  (e.next = 5),
                  x.audioWorklet.addModule(n)
                );
              case 5:
                (((N = new AudioWorkletNode(x, "pcm-capture")).port.onmessage =
                  function (e) {
                    try {
                      var t = be(e.data);
                      d && d.readyState === WebSocket.OPEN && d.send(t.buffer);
                    } catch (e) {}
                  }),
                  k.connect(N));
              case 8:
              case "end":
                return e.stop();
            }
        }, e);
      }),
    )).apply(this, arguments);
  }
  function Se() {
    try {
      if (A) {
        try {
          A.getTracks().forEach(function (e) {
            return (e.onended = null);
          });
        } catch (e) {}
        try {
          A.getTracks().forEach(function (e) {
            "function" == typeof e.stop && e.stop();
          });
        } catch (e) {}
      }
    } catch (e) {}
    try {
      N && N.disconnect();
    } catch (e) {}
    try {
      M && M.disconnect();
    } catch (e) {}
    try {
      k && k.disconnect();
    } catch (e) {}
    try {
      var e = x;
      (x && x.close(), E && e && E.context === e && (E = void 0));
    } catch (e) {}
    ((N = void 0),
      (M = void 0),
      (k = void 0),
      (x = void 0),
      (A = void 0),
      ut());
  }
  var xe = 0,
    ke = 0,
    Ne = null,
    Me = 0,
    Ae = 30,
    _e = "<end>",
    Ee = [],
    Le = [],
    Ie = new Map(),
    Oe = !1,
    Pe = !0,
    je = !1;
  function Ce(e) {
    return e.join("");
  }
  var Fe = /[.!?…,;:、，；：。？！…｡､．﹒؟،؛۔॥]+$/,
    Re = /[)"'\]\}》】）”’」』〉]+$/;
  function Be(e) {
    return "string" != typeof e ? "" : e.replace(/(^|[\r\n])[ \t]+/g, "$1");
  }
  function Ve(e) {
    if (!e) return null;
    if (E && E.context === e) return E;
    try {
      (((E = e.createGain()).gain.value = te), E.connect(e.destination));
    } catch (e) {
      E = void 0;
    }
    return E;
  }
  function ze() {
    if (x && "closed" !== x.state) return (Ve(x), x);
    if (!_ || "closed" === _.state)
      try {
        _ = new (window.AudioContext || window.webkitAudioContext)({
          sampleRate: u,
        });
      } catch (e) {
        _ = new (window.AudioContext || window.webkitAudioContext)();
      }
    return (Ve(_), _);
  }
  function Ue(e, t, n) {
    if (e)
      try {
        chrome.runtime.sendMessage({
          type: "voiceSampleState",
          requestId: e,
          state: t,
          error: n,
        });
      } catch (e) {}
  }
  function Ge() {
    if (V) {
      try {
        ((V.onended = null), (V.onerror = null));
      } catch (e) {}
      ((V = null), (z = null));
    }
  }
  function We() {
    var e =
      arguments.length > 0 && void 0 !== arguments[0]
        ? arguments[0]
        : "stopped";
    if (V) {
      var t = z;
      try {
        (V.pause(), (V.currentTime = 0));
      } catch (e) {}
      (Ge(), Ue(t, e));
    }
  }
  function De() {
    return (De = i(
      t().mark(function e(n, r) {
        var a, i, o, c;
        return t().wrap(
          function (e) {
            for (;;)
              switch ((e.prev = e.next)) {
                case 0:
                  if (r) {
                    e.next = 3;
                    break;
                  }
                  return (Ue(n, "error", "missing_url"), e.abrupt("return"));
                case 3:
                  if (
                    (V && We("stopped"),
                    (a = new Audio()),
                    (V = a),
                    (z = n),
                    (i = !1),
                    (a.preload = "auto"),
                    (a.src = r),
                    (a.volume = Math.max(0, Math.min(1, te))),
                    (o = function () {
                      i || (z === n && ((i = !0), Ue(n, "started")));
                    }),
                    (a.onplay = o),
                    (a.onplaying = o),
                    (a.onended = function () {
                      z === n && (Ge(), Ue(n, "ended"));
                    }),
                    (a.onerror = function () {
                      z === n && (Ge(), Ue(n, "error", "load_error"));
                    }),
                    (e.prev = 16),
                    !(c = a.play()) || "function" != typeof c.then)
                  ) {
                    e.next = 21;
                    break;
                  }
                  return ((e.next = 21), c);
                case 21:
                  if (z === n) {
                    e.next = 23;
                    break;
                  }
                  return e.abrupt("return");
                case 23:
                  (o(), (e.next = 32));
                  break;
                case 26:
                  if (((e.prev = 26), (e.t0 = e.catch(16)), z === n)) {
                    e.next = 30;
                    break;
                  }
                  return e.abrupt("return");
                case 30:
                  (Ge(),
                    Ue(n, "error", (e.t0 && e.t0.message) || "playback_error"));
                case 32:
                case "end":
                  return e.stop();
              }
          },
          e,
          null,
          [[16, 26]],
        );
      }),
    )).apply(this, arguments);
  }
  function qe() {
    re &&
      M &&
      ie &&
      (oe = setTimeout(function () {
        if (j.size > 0) oe = null;
        else {
          ie = !1;
          try {
            M.gain.setTargetAtTime(ee, x.currentTime, 0.2);
          } catch (e) {
            M.gain.value = ee;
          }
          oe = null;
        }
      }, 300));
  }
  function He() {
    (H.forEach(function (e) {
      return clearTimeout(e);
    }),
      H.clear());
  }
  function Ke() {
    return Ye.apply(this, arguments);
  }
  function Ye() {
    return (Ye = i(
      t().mark(function e() {
        var n, r, a;
        return t().wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                if (!("pcm" !== p && Z.length > 0)) {
                  e.next = 8;
                  break;
                }
                return ((e.next = 4), et());
              case 4:
                return ((n = e.sent), (K = []), (Y = 0), e.abrupt("return", n));
              case 8:
                return (
                  (r = K),
                  (a = Y),
                  (K = []),
                  (Y = 0),
                  e.abrupt("return", { buffers: r, duration: a })
                );
              case 13:
              case "end":
                return e.stop();
            }
        }, e);
      }),
    )).apply(this, arguments);
  }
  function Je() {
    (Q && (clearTimeout(Q), (Q = null)), (X = null));
  }
  function $e(e) {
    if (null != e) {
      $.add(e);
      W.get(e);
      (W.delete(e), J.delete(e));
      var t = G.indexOf(e);
      (-1 !== t && G.splice(t, 1), X === e && Je());
    }
  }
  function Qe() {
    var e = (
        arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}
      ).allowWait,
      t = void 0 !== e && e;
    if (!(j.size > 0 || null != q)) {
      var n = (function () {
        for (; G.length > 0; ) {
          var e = G[0];
          if (!$.has(e)) return e;
          (G.shift(), $.delete(e));
        }
        return null;
      })();
      if (n) {
        var r,
          a = J.get(n);
        if (a && a.buffers && a.buffers.length > 0)
          return (
            Je(),
            void (function (e, t) {
              if (!t || !t.buffers || 0 === t.buffers.length)
                return void $e(e, "empty_audio");
              var n = ze();
              if (!n) return void $e(e, "no_audio_context");
              "suspended" === n.state && n.resume().catch(function () {});
              W.get(e);
              J.delete(e);
              var r = G.indexOf(e);
              -1 !== r && G.splice(r, 1);
              ((q = e),
                (function () {
                  if (re && M && !ie) {
                    ie = !0;
                    var e = ee * (1 - ae);
                    try {
                      M.gain.setTargetAtTime(e, x.currentTime, 0.1);
                    } catch (t) {
                      M.gain.value = e;
                    }
                    oe && (clearTimeout(oe), (oe = null));
                  }
                })());
              var a = n.currentTime;
              P && P > a && (a = P);
              (t.buffers.forEach(function (t, r) {
                var i = n.createBufferSource();
                ((i.buffer = t),
                  (n === x && E) || E ? i.connect(E) : i.connect(n.destination),
                  0 === r &&
                    (function (e, t, n) {
                      if (L && null != e && n && !H.has(e)) {
                        var r = Math.max(0, 1e3 * (t - n.currentTime)),
                          a = setTimeout(function () {
                            if ((H.delete(e), L && 0 !== j.size && U !== e)) {
                              U = e;
                              try {
                                (chrome.runtime.sendMessage({
                                  type: "tts_started",
                                  tabId: L,
                                  lineId: e,
                                }),
                                  W.get(e));
                              } catch (e) {}
                            }
                          }, r);
                        H.set(e, a);
                      }
                    })(e, a, n),
                  i.start(a),
                  j.add(i),
                  (a += t.duration),
                  (i.onended = function () {
                    return (function (e) {
                      if ((j.delete(e), qe(), 0 === j.size && null != q)) {
                        var t = q;
                        ((q = null),
                          (function (e) {
                            if (!W.has(e)) return;
                            q = null;
                            W.get(e);
                            if (L)
                              try {
                                chrome.runtime.sendMessage({
                                  type: "tts_ended",
                                  tabId: L,
                                  lineId: e,
                                });
                              } catch (e) {}
                            U === e && (U = null);
                            (W.delete(e), J.delete(e));
                            var t = G.indexOf(e);
                            -1 !== t && G.splice(t, 1);
                            ((P = 0), Qe({ allowWait: !0 }));
                          })(t));
                      }
                    })(i);
                  }));
              }),
                (P = a));
            })(n, a)
          );
        t &&
          ((X === (r = n) && Q) ||
            (Je(),
            (X = r),
            (Q = setTimeout(function () {
              X === r &&
                ((Q = null),
                (X = null),
                $e(r, "timeout"),
                Qe({ allowWait: !0 }));
            }, f))));
      } else Je();
    }
  }
  function Xe(e) {
    if (e && !(e.byteLength < 2)) {
      var t = ze();
      if (t) {
        "suspended" === t.state && t.resume().catch(function () {});
        var n = Math.floor(e.byteLength / 2);
        if (0 !== n) {
          var r;
          if (e.byteOffset % 2 == 0)
            r = new Int16Array(e.buffer, e.byteOffset, n);
          else {
            var a = new ArrayBuffer(e.byteLength);
            (new Uint8Array(a).set(e), (r = new Int16Array(a)));
          }
          for (
            var i = t.createBuffer(1, n, u), o = i.getChannelData(0), c = 0;
            c < n;
            c++
          )
            o[c] = r[c] / 32768;
          (K.push(i), (Y += i.duration));
        }
      }
    }
  }
  function Ze(e, t) {
    var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;
    if (!e || e.length < n + t.length) return !1;
    for (var r = 0; r < t.length; r += 1)
      if (e[n + r] !== t.charCodeAt(r)) return !1;
    return !0;
  }
  function et() {
    return tt.apply(this, arguments);
  }
  function tt() {
    return (tt = i(
      t().mark(function e() {
        var r, a, i, o, c, u, s, l, f, p;
        return t().wrap(
          function (e) {
            for (;;)
              switch ((e.prev = e.next)) {
                case 0:
                  if (0 !== Z.length) {
                    e.next = 3;
                    break;
                  }
                  return e.abrupt("return", { buffers: [], duration: 0 });
                case 3:
                  ((r = Z.reduce(function (e, t) {
                    return e + t.byteLength;
                  }, 0)),
                    (a = new Uint8Array(r)),
                    (i = 0),
                    (o = n(Z)));
                  try {
                    for (o.s(); !(c = o.n()).done; )
                      ((u = c.value), a.set(u, i), (i += u.byteLength));
                  } catch (e) {
                    o.e(e);
                  } finally {
                    o.f();
                  }
                  if (
                    ((Z = []),
                    (s = Array.from(a.slice(0, 4))
                      .map(function (e) {
                        return String.fromCharCode(e);
                      })
                      .join("")),
                    "OggS" === s,
                    (l = ze()))
                  ) {
                    e.next = 18;
                    break;
                  }
                  return e.abrupt("return", { buffers: [], duration: 0 });
                case 18:
                  if ("suspended" !== l.state) {
                    e.next = 21;
                    break;
                  }
                  return ((e.next = 21), l.resume().catch(function () {}));
                case 21:
                  return (
                    (e.prev = 21),
                    (f = a.buffer.slice(
                      a.byteOffset,
                      a.byteOffset + a.byteLength,
                    )),
                    (e.next = 25),
                    l.decodeAudioData(f)
                  );
                case 25:
                  return (
                    (p = e.sent),
                    e.abrupt("return", { buffers: [p], duration: p.duration })
                  );
                case 30:
                  return (
                    (e.prev = 30),
                    (e.t0 = e.catch(21)),
                    e.abrupt("return", { buffers: [], duration: 0 })
                  );
                case 34:
                case "end":
                  return e.stop();
              }
          },
          e,
          null,
          [[21, 30]],
        );
      }),
    )).apply(this, arguments);
  }
  function nt(e) {
    var t;
    if (e instanceof ArrayBuffer) t = new Uint8Array(e);
    else {
      if (!ArrayBuffer.isView(e)) return !1;
      t = new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
    }
    if (!t.length || t[0] !== s) return !1;
    if (he || !ne || 0 === G.length) return !0;
    var n = t.subarray(1);
    Array.from(n.slice(0, 16))
      .map(function (e) {
        return e.toString(16).padStart(2, "0");
      })
      .join(" ");
    if ("pcm" === p) Xe(n);
    else {
      if (
        n.byteLength >= 4 &&
        0 === Z.length &&
        !Ze(n, "OggS") &&
        !(function (e) {
          return (
            !!Ze(e, "ID3") ||
            (!(e.length < 2) && 255 === e[0] && 224 == (224 & e[1]))
          );
        })(n)
      )
        return ((p = "pcm"), (Z = []), Xe(n), !0);
      !(function (e) {
        if (e && !(e.byteLength < 4)) {
          var t = new Uint8Array(e.byteLength);
          (t.set(e), Z.push(t));
        }
      })(n);
    }
    return !0;
  }
  function rt(e, t, n) {
    if (ne && t && T()) {
      var r = Be(e).trim();
      if (r) {
        var a = Date.now();
        if (
          !(r === C && a - F < R) &&
          ((C = r), (F = a), c && d && d.readyState === WebSocket.OPEN)
        )
          try {
            null != n && (W.set(n, r), G.push(n));
            var i = { type: "tts_request", text: r, voice: c, lineId: n };
            d.send(JSON.stringify(i));
          } catch (e) {}
      }
    }
  }
  function at(e) {
    return it.apply(this, arguments);
  }
  function it() {
    return (it = i(
      t().mark(function e(n) {
        var r, a, i, o, c;
        return t().wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return (
                  (r = n && n.lineId),
                  (a = "number" == typeof r ? r : Number(r)),
                  (e.next = 4),
                  Ke()
                );
              case 4:
                if (
                  ((i = e.sent),
                  (o = i.buffers),
                  (c = i.duration),
                  Number.isFinite(a))
                ) {
                  e.next = 10;
                  break;
                }
                return e.abrupt("return");
              case 10:
                if (!$.has(a)) {
                  e.next = 15;
                  break;
                }
                return ($.delete(a), W.delete(a), e.abrupt("return"));
              case 15:
                if (W.has(a)) {
                  e.next = 18;
                  break;
                }
                return e.abrupt("return");
              case 18:
                if (o && 0 !== o.length) {
                  e.next = 21;
                  break;
                }
                return ($e(a, "empty_audio"), e.abrupt("return"));
              case 21:
                (W.get(a), J.set(a, { buffers: o, duration: c }), Qe());
              case 25:
              case "end":
                return e.stop();
            }
        }, e);
      }),
    )).apply(this, arguments);
  }
  function ot(e) {
    ut();
  }
  function ct() {
    var e = j.size > 0 || null != U,
      t = G.length > 0 || null != q;
    if (e || t)
      if (e) {
        B && (clearTimeout(B), (B = null));
        var n = U;
        n && W.get(n);
        if (
          ((P = 0),
          (C = ""),
          (F = 0),
          He(),
          Je(),
          (G = []),
          W.clear(),
          (K = []),
          (Y = 0),
          (Z = []),
          J.clear(),
          $.clear(),
          (q = null),
          E)
        )
          try {
            var r = E.context.currentTime,
              a = l / 1e3;
            (E.gain.cancelScheduledValues(r),
              E.gain.setValueAtTime(E.gain.value, r),
              E.gain.linearRampToValueAtTime(0, r + a));
          } catch (e) {
            try {
              E.gain.value = 0;
            } catch (e) {}
          }
        B = setTimeout(function () {
          if (((B = null), ut(), null != n && L))
            try {
              chrome.runtime.sendMessage({
                type: "tts_ended",
                tabId: L,
                lineId: n,
              });
            } catch (e) {}
        }, l);
      } else ut();
  }
  function ut() {
    (B && (clearTimeout(B), (B = null)), Je());
    j.size;
    ((P = 0),
      (C = ""),
      (F = 0),
      (q = null),
      (Z = []),
      j.forEach(function (e) {
        try {
          e.stop();
        } catch (e) {}
      }),
      j.clear(),
      He(),
      (G = []),
      W.clear(),
      (K = []),
      (Y = 0),
      J.clear(),
      $.clear(),
      (U = null));
    var e = _;
    if (_ && _ !== x)
      try {
        _.close();
      } catch (e) {}
    if (((_ = void 0), E && e && E.context === e && (E = void 0), E))
      try {
        var t = E.context;
        E.gain.setTargetAtTime(te, t.currentTime, 0.05);
      } catch (e) {
        try {
          E.gain.value = te;
        } catch (e) {}
      }
    qe();
  }
  function st(e, t) {
    var n =
      arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 256;
    if (t && 0 !== t.length) {
      var r = (e || []).join(""),
        a = (t || []).join("");
      if (a && !(r && a.length < r.length && r.indexOf(a) >= 0)) {
        if (a === r || a.startsWith(r) || r.startsWith(a) || a.indexOf(r) >= 0)
          return ((e.length = 0), void e.push(a));
        for (
          var i = Math.min(r.length, a.length), o = 0;
          o < i && r.charCodeAt(o) === a.charCodeAt(o);
        )
          o++;
        if (o >= 4 && o >= 0.6 * i) return ((e.length = 0), void e.push(a));
        var c = Math.min(8, a.length);
        if (c >= 4 && r.length >= c) {
          var u = a.slice(0, c),
            s = r.lastIndexOf(u),
            l = s >= 0 && s >= Math.max(0, r.length - n),
            f = s >= 0 && a.length >= r.length - s;
          if (l && f) return ((e.length = 0), void e.push(r.slice(0, s) + a));
        }
        for (var p = 0, h = Math.min(n, r.length, a.length); h > 0; h--)
          if (r.slice(-h) === a.slice(0, h)) {
            p = h;
            break;
          }
        var m = p ? r + a.slice(p) : r + a;
        ((e.length = 0), e.push(m));
      }
    }
  }
  function lt() {
    ((Ee = []), (Le = []), Ie.clear(), !1, !1);
  }
  function ft(e, t) {
    if (t && 0 !== t.length) {
      var r,
        a = n(t);
      try {
        for (a.s(); !(r = a.n()).done; ) {
          var i = r.value;
          if (i) {
            var o = Number(i.start_ms);
            if (Number.isFinite(o)) {
              var c = "string" == typeof i.text ? i.text : "";
              c && e.set(o, c);
            }
          }
        }
      } catch (e) {
        a.e(e);
      } finally {
        a.f();
      }
    }
  }
  function pt(e) {
    return e && 0 !== e.size
      ? Array.from(e.entries())
          .sort(function (e, t) {
            return e[0] - t[0];
          })
          .map(function (e) {
            return e[1];
          })
          .join("")
      : "";
  }
  function ht(e) {
    try {
      var t = performance.now(),
        r = e.tokens || [];
      if (!Array.isArray(r) || 0 === r.length) return;
      se = !0;
      var a = r.some(function (e) {
          return "none" !== S(e);
        }),
        i = r.some(function (e) {
          return "none" === S(e);
        });
      a ? ((je = !1), Ie.size > 0 && Ie.clear()) : i && (je = !0);
      ke > 0 && (t - ke).toFixed(2);
      ke = t;
      var o,
        c = [],
        u = [],
        s = [],
        l = [],
        f = [],
        p = [],
        h = !1,
        m = !1,
        d = !1,
        v = !1,
        g = !1,
        y = !1,
        b = !0,
        T = !0,
        x = !1,
        k = n(r);
      try {
        for (k.s(); !(o = k.n()).done; ) {
          var N = o.value;
          if ((N && "string" == typeof N.text && N.text.includes(_e), N)) {
            var M = S(N),
              A = "string" == typeof N.text ? N.text : "";
            if (("none" !== M && (y = !0), "original" === M)) {
              if (((m = !0), A === _e)) {
                (!0, (h = !0));
                continue;
              }
              (Oe && !x && A && ((Pe = !0), (Oe = !1), lt()),
                x ? A && s.push(A) : A && c.push(A),
                N.is_final || (b = !1));
            } else if ("translation" === M) {
              if (!w(N)) continue;
              ((d = !0),
                A && u.push(A),
                N.is_final || (T = !1),
                N.is_final && (x = !0));
            } else if ("none" === M) {
              if (((v = !0), A === _e)) {
                (!0, (h = !0), (g = !0), (x = !0));
                continue;
              }
              var _ = x;
              ((m = !0),
                (d = !0),
                Oe && !_ && A && ((Pe = !0), (Oe = !1), lt()),
                _
                  ? (A && s.push(A),
                    A && l.push(A),
                    je && Number.isFinite(Number(N.start_ms)) && A && p.push(N))
                  : je && Number.isFinite(Number(N.start_ms)) && A
                    ? f.push(N)
                    : (A && c.push(A), A && u.push(A)),
                N.is_final || ((b = !1), (T = !1)));
            }
          }
        }
      } catch (e) {
        k.e(e);
      } finally {
        k.f();
      }
      if (je && !y) {
        if ((f.length > 0 && ft(Ie, f), Ie.size > 0)) {
          var E = pt(Ie);
          ((Ee.length = 0), Ee.push(E), (Le.length = 0), Le.push(E));
        }
      } else (st(Ee, c), st(Le, u));
      (h && m && b && !0, v && !x && (g || T) && (x = !0));
      var I = !1;
      if (x && d && T) {
        var O = Ce(Le);
        if (
          !(I = (function (e) {
            if ("string" != typeof e) return !1;
            var t = Be(e).trim();
            return !!t && !!(t = t.replace(Re, "")) && Fe.test(t);
          })(O))
        ) {
          Be(O).trim().slice(0, 120);
          if (je && !y && p.length > 0) {
            ft(Ie, p);
            var P = pt(Ie);
            ((Ee.length = 0), Ee.push(P), (Le.length = 0), Le.push(P));
          }
          (s.length > 0 || l.length > 0) && (st(Ee, s), st(Le, l));
        }
      }
      var j = [],
        C = "incremental";
      if (I) {
        (st(Ee, c), st(Le, u));
        var F = Ce(Ee),
          R = Ce(Le);
        if (
          (j.push({
            textOriginal: F,
            textTranslated: R,
            isNew: !1,
            isFinal: !0,
          }),
          s.length > 0 || p.length > 0)
        ) {
          if ((lt(), je && p.length > 0)) {
            ft(Ie, p);
            var B = pt(Ie);
            ((Ee.length = 0), Ee.push(B), (Le.length = 0), Le.push(B));
          } else (st(Ee, s), st(Le, l));
          var V = Ce(Ee),
            z = Ce(Le);
          (j.push({
            textOriginal: V,
            textTranslated: z,
            isNew: !0,
            isFinal: !1,
          }),
            (C = "finalPlusNextStart"));
        } else ((Oe = !0), (C = "finalOnly"));
      } else {
        (st(Ee, c), st(Le, u));
        var U = Ce(Ee),
          G = Ce(Le);
        (j.push({ textOriginal: U, textTranslated: G, isNew: Pe, isFinal: !1 }),
          (C = "incremental"));
      }
      if (L) {
        var W = function (t) {
          var n = Be(t.textOriginal),
            r = Be(t.textTranslated),
            a = null;
          !0 === t.isFinal && (a = ++D);
          try {
            chrome.runtime.sendMessage({
              type: "caption",
              tabId: L,
              textOriginal: n,
              textTranslated: r,
              isNewSentence: t.isNew,
              isFinal: !0 === t.isFinal,
              lineId: a,
              raw: e,
            });
          } catch (e) {}
          ((xe = performance.now()), rt(r, !0 === t.isFinal, a));
        };
        if (1 === j.length) {
          var q = j[0];
          if ("finalOnly" === C) (W(q), (Pe = !1));
          else {
            var H = performance.now() - xe;
            (H >= Me || 0 === xe
              ? W(q)
              : (clearTimeout(Ne),
                (Ne = setTimeout(function () {
                  return W(q);
                }, Me - H))),
              (Pe = !1));
          }
        } else
          2 === j.length &&
            (W(j[0]),
            (Pe = !1),
            clearTimeout(Ne),
            (Ne = setTimeout(function () {
              (W(j[1]), (Pe = !1));
            }, Ae)));
      }
    } catch (e) {}
  }
  function mt() {
    return c || "";
  }
  function dt(e) {
    var t = e.nextName,
      n = e.nextId,
      r = mt(),
      a = !1;
    if ("string" == typeof t) {
      var i = t.trim();
      i && (i, (a = !0));
    }
    if (("string" == typeof n && ((c = n.trim()), (a = !0)), a)) {
      var o = mt();
      if (o && o !== r) {
        var u = j.size > 0 || null != U,
          s = G.length > 0 || null != q;
        u ? ct("voice_change") : s && ut();
      }
    }
  }
  chrome.runtime.onMessage.addListener(function (e) {
    if (e && "offscreenAuth" === e.type && e.idToken) {
      if (he) return;
      var t = {
        translation: e.translation,
        source_language: e.source_language,
        target_language: e.target_language,
      };
      (e.idToken, (ce = e.tabTitle || ""), (ue = e.tabUrl || ""));
      var n =
        "string" == typeof e.ttsVoice && e.ttsVoice.trim()
          ? e.ttsVoice.trim()
          : "";
      n && n;
      var r =
        "string" == typeof e.ttsVoiceId && e.ttsVoiceId.trim()
          ? e.ttsVoiceId.trim()
          : "";
      ((c = r),
        Object.prototype.hasOwnProperty.call(e, "ttsEnabled") &&
          (ne = !!e.ttsEnabled),
        (p =
          "string" == typeof e.ttsResponseFormat && e.ttsResponseFormat.trim()
            ? e.ttsResponseFormat.trim().toLowerCase()
            : "pcm"),
        lt(),
        "",
        "",
        (Pe = !0),
        (Oe = !1),
        (se = !1),
        ut(),
        de(e.idToken, t));
    }
    if (
      (e && "offscreenStart" === e.type && ((he = !1), (le = 0)),
      e && "offscreenStop" === e.type)
    ) {
      he = !0;
      try {
        clearTimeout(I);
      } catch (e) {}
      ut();
      try {
        d && d.close();
      } catch (e) {}
      try {
        d = void 0;
      } catch (e) {}
      (Se(), lt(), "", "", (Pe = !0), (Oe = !1), (se = !1));
      try {
        chrome.runtime.sendMessage({ type: "offscreenStopped" });
      } catch (e) {}
    }
    if (
      (e &&
        "offscreenResetSession" === e.type &&
        (Ne && (clearTimeout(Ne), (Ne = null)),
        lt(),
        "",
        "",
        (Pe = !0),
        (Oe = !1),
        (se = !1),
        (xe = 0),
        0,
        ut()),
      e && "audioSettings" === e.type)
    ) {
      var a = e.setting,
        i = e.value;
      switch (a) {
        case "tabVolume":
          if (((ee = Math.max(0, Math.min(1, i / 100))), M)) {
            var o = ie && re ? ee * (1 - ae) : ee;
            try {
              M.gain.setTargetAtTime(o, x.currentTime, 0.05);
            } catch (e) {
              M.gain.value = o;
            }
          }
          break;
        case "ttsVolume":
          if (((te = Math.max(0, Math.min(1, i / 100))), E))
            try {
              var u = E.context;
              E.gain.setTargetAtTime(te, u.currentTime, 0.05);
            } catch (e) {
              E.gain.value = te;
            }
          break;
        case "audioDuckingEnabled":
          if (!(re = !!i) && ie && ((ie = !1), M))
            try {
              M.gain.setTargetAtTime(ee, x.currentTime, 0.1);
            } catch (e) {
              M.gain.value = ee;
            }
          break;
        case "duckingStrength":
          if (((ae = Math.max(0, Math.min(1, i / 100))), ie && M)) {
            var s = ee * (1 - ae);
            try {
              M.gain.setTargetAtTime(s, x.currentTime, 0.1);
            } catch (e) {
              M.gain.value = s;
            }
          }
          break;
        case "ttsEnabled":
          (ne = !!i) || ut();
          break;
        case "ttsVoice":
          dt({ nextName: i });
          break;
        case "ttsVoiceId":
          dt({ nextId: i });
          break;
        case "ttsLanguage":
          "string" == typeof i && i.trim();
          break;
        case "ttsResponseFormat":
          if ("string" == typeof i && i.trim()) {
            var l = i.trim().toLowerCase();
            l !== p && (p = l);
          } else "pcm" !== p && (p = "pcm");
      }
    }
    (e &&
      "offscreenPlayVoiceSample" === e.type &&
      (function (e, t) {
        De.apply(this, arguments);
      })(e.requestId, e.sampleUrl),
      e &&
        "offscreenStopVoiceSample" === e.type &&
        ((e.requestId && e.requestId !== z) || We("stopped")));
  });
  try {
    chrome.runtime.sendMessage({ type: "offscreenReady" });
  } catch (e) {}
})();
