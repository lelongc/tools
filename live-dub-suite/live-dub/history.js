(() => {
  "use strict";
  var A,
    n = {
      9813: (A, n, t) => {
        var r = t(3337),
          e = t(8865),
          o = t(7723);
        function a(A) {
          return (
            (a =
              "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                ? function (A) {
                    return typeof A;
                  }
                : function (A) {
                    return A &&
                      "function" == typeof Symbol &&
                      A.constructor === Symbol &&
                      A !== Symbol.prototype
                      ? "symbol"
                      : typeof A;
                  }),
            a(A)
          );
        }
        function i() {
          i = function () {
            return n;
          };
          var A,
            n = {},
            t = Object.prototype,
            r = t.hasOwnProperty,
            e =
              Object.defineProperty ||
              function (A, n, t) {
                A[n] = t.value;
              },
            o = "function" == typeof Symbol ? Symbol : {},
            c = o.iterator || "@@iterator",
            d = o.asyncIterator || "@@asyncIterator",
            l = o.toStringTag || "@@toStringTag";
          function s(A, n, t) {
            return (
              Object.defineProperty(A, n, {
                value: t,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              }),
              A[n]
            );
          }
          try {
            s({}, "");
          } catch (A) {
            s = function (A, n, t) {
              return (A[n] = t);
            };
          }
          function g(A, n, t, r) {
            var o = n && n.prototype instanceof u ? n : u,
              a = Object.create(o.prototype),
              i = new I(r || []);
            return (e(a, "_invoke", { value: S(A, t, i) }), a);
          }
          function p(A, n, t) {
            try {
              return { type: "normal", arg: A.call(n, t) };
            } catch (A) {
              return { type: "throw", arg: A };
            }
          }
          n.wrap = g;
          var b = "suspendedStart",
            w = "suspendedYield",
            m = "executing",
            B = "completed",
            E = {};
          function u() {}
          function y() {}
          function f() {}
          var h = {};
          s(h, c, function () {
            return this;
          });
          var v = Object.getPrototypeOf,
            k = v && v(v(N([])));
          k && k !== t && r.call(k, c) && (h = k);
          var x = (f.prototype = u.prototype = Object.create(h));
          function G(A) {
            ["next", "throw", "return"].forEach(function (n) {
              s(A, n, function (A) {
                return this._invoke(n, A);
              });
            });
          }
          function H(A, n) {
            function t(e, o, i, c) {
              var d = p(A[e], A, o);
              if ("throw" !== d.type) {
                var l = d.arg,
                  s = l.value;
                return s && "object" == a(s) && r.call(s, "__await")
                  ? n.resolve(s.__await).then(
                      function (A) {
                        t("next", A, i, c);
                      },
                      function (A) {
                        t("throw", A, i, c);
                      },
                    )
                  : n.resolve(s).then(
                      function (A) {
                        ((l.value = A), i(l));
                      },
                      function (A) {
                        return t("throw", A, i, c);
                      },
                    );
              }
              c(d.arg);
            }
            var o;
            e(this, "_invoke", {
              value: function (A, r) {
                function e() {
                  return new n(function (n, e) {
                    t(A, r, n, e);
                  });
                }
                return (o = o ? o.then(e, e) : e());
              },
            });
          }
          function S(n, t, r) {
            var e = b;
            return function (o, a) {
              if (e === m) throw new Error("Generator is already running");
              if (e === B) {
                if ("throw" === o) throw a;
                return { value: A, done: !0 };
              }
              for (r.method = o, r.arg = a; ; ) {
                var i = r.delegate;
                if (i) {
                  var c = C(i, r);
                  if (c) {
                    if (c === E) continue;
                    return c;
                  }
                }
                if ("next" === r.method) r.sent = r._sent = r.arg;
                else if ("throw" === r.method) {
                  if (e === b) throw ((e = B), r.arg);
                  r.dispatchException(r.arg);
                } else "return" === r.method && r.abrupt("return", r.arg);
                e = m;
                var d = p(n, t, r);
                if ("normal" === d.type) {
                  if (((e = r.done ? B : w), d.arg === E)) continue;
                  return { value: d.arg, done: r.done };
                }
                "throw" === d.type &&
                  ((e = B), (r.method = "throw"), (r.arg = d.arg));
              }
            };
          }
          function C(n, t) {
            var r = t.method,
              e = n.iterator[r];
            if (e === A)
              return (
                (t.delegate = null),
                ("throw" === r &&
                  n.iterator.return &&
                  ((t.method = "return"),
                  (t.arg = A),
                  C(n, t),
                  "throw" === t.method)) ||
                  ("return" !== r &&
                    ((t.method = "throw"),
                    (t.arg = new TypeError(
                      "The iterator does not provide a '" + r + "' method",
                    )))),
                E
              );
            var o = p(e, n.iterator, t.arg);
            if ("throw" === o.type)
              return (
                (t.method = "throw"),
                (t.arg = o.arg),
                (t.delegate = null),
                E
              );
            var a = o.arg;
            return a
              ? a.done
                ? ((t[n.resultName] = a.value),
                  (t.next = n.nextLoc),
                  "return" !== t.method && ((t.method = "next"), (t.arg = A)),
                  (t.delegate = null),
                  E)
                : a
              : ((t.method = "throw"),
                (t.arg = new TypeError("iterator result is not an object")),
                (t.delegate = null),
                E);
          }
          function L(A) {
            var n = { tryLoc: A[0] };
            (1 in A && (n.catchLoc = A[1]),
              2 in A && ((n.finallyLoc = A[2]), (n.afterLoc = A[3])),
              this.tryEntries.push(n));
          }
          function z(A) {
            var n = A.completion || {};
            ((n.type = "normal"), delete n.arg, (A.completion = n));
          }
          function I(A) {
            ((this.tryEntries = [{ tryLoc: "root" }]),
              A.forEach(L, this),
              this.reset(!0));
          }
          function N(n) {
            if (n || "" === n) {
              var t = n[c];
              if (t) return t.call(n);
              if ("function" == typeof n.next) return n;
              if (!isNaN(n.length)) {
                var e = -1,
                  o = function t() {
                    for (; ++e < n.length; )
                      if (r.call(n, e))
                        return ((t.value = n[e]), (t.done = !1), t);
                    return ((t.value = A), (t.done = !0), t);
                  };
                return (o.next = o);
              }
            }
            throw new TypeError(a(n) + " is not iterable");
          }
          return (
            (y.prototype = f),
            e(x, "constructor", { value: f, configurable: !0 }),
            e(f, "constructor", { value: y, configurable: !0 }),
            (y.displayName = s(f, l, "GeneratorFunction")),
            (n.isGeneratorFunction = function (A) {
              var n = "function" == typeof A && A.constructor;
              return (
                !!n &&
                (n === y || "GeneratorFunction" === (n.displayName || n.name))
              );
            }),
            (n.mark = function (A) {
              return (
                Object.setPrototypeOf
                  ? Object.setPrototypeOf(A, f)
                  : ((A.__proto__ = f), s(A, l, "GeneratorFunction")),
                (A.prototype = Object.create(x)),
                A
              );
            }),
            (n.awrap = function (A) {
              return { __await: A };
            }),
            G(H.prototype),
            s(H.prototype, d, function () {
              return this;
            }),
            (n.AsyncIterator = H),
            (n.async = function (A, t, r, e, o) {
              void 0 === o && (o = Promise);
              var a = new H(g(A, t, r, e), o);
              return n.isGeneratorFunction(t)
                ? a
                : a.next().then(function (A) {
                    return A.done ? A.value : a.next();
                  });
            }),
            G(x),
            s(x, l, "Generator"),
            s(x, c, function () {
              return this;
            }),
            s(x, "toString", function () {
              return "[object Generator]";
            }),
            (n.keys = function (A) {
              var n = Object(A),
                t = [];
              for (var r in n) t.push(r);
              return (
                t.reverse(),
                function A() {
                  for (; t.length; ) {
                    var r = t.pop();
                    if (r in n) return ((A.value = r), (A.done = !1), A);
                  }
                  return ((A.done = !0), A);
                }
              );
            }),
            (n.values = N),
            (I.prototype = {
              constructor: I,
              reset: function (n) {
                if (
                  ((this.prev = 0),
                  (this.next = 0),
                  (this.sent = this._sent = A),
                  (this.done = !1),
                  (this.delegate = null),
                  (this.method = "next"),
                  (this.arg = A),
                  this.tryEntries.forEach(z),
                  !n)
                )
                  for (var t in this)
                    "t" === t.charAt(0) &&
                      r.call(this, t) &&
                      !isNaN(+t.slice(1)) &&
                      (this[t] = A);
              },
              stop: function () {
                this.done = !0;
                var A = this.tryEntries[0].completion;
                if ("throw" === A.type) throw A.arg;
                return this.rval;
              },
              dispatchException: function (n) {
                if (this.done) throw n;
                var t = this;
                function e(r, e) {
                  return (
                    (i.type = "throw"),
                    (i.arg = n),
                    (t.next = r),
                    e && ((t.method = "next"), (t.arg = A)),
                    !!e
                  );
                }
                for (var o = this.tryEntries.length - 1; o >= 0; --o) {
                  var a = this.tryEntries[o],
                    i = a.completion;
                  if ("root" === a.tryLoc) return e("end");
                  if (a.tryLoc <= this.prev) {
                    var c = r.call(a, "catchLoc"),
                      d = r.call(a, "finallyLoc");
                    if (c && d) {
                      if (this.prev < a.catchLoc) return e(a.catchLoc, !0);
                      if (this.prev < a.finallyLoc) return e(a.finallyLoc);
                    } else if (c) {
                      if (this.prev < a.catchLoc) return e(a.catchLoc, !0);
                    } else {
                      if (!d)
                        throw new Error(
                          "try statement without catch or finally",
                        );
                      if (this.prev < a.finallyLoc) return e(a.finallyLoc);
                    }
                  }
                }
              },
              abrupt: function (A, n) {
                for (var t = this.tryEntries.length - 1; t >= 0; --t) {
                  var e = this.tryEntries[t];
                  if (
                    e.tryLoc <= this.prev &&
                    r.call(e, "finallyLoc") &&
                    this.prev < e.finallyLoc
                  ) {
                    var o = e;
                    break;
                  }
                }
                o &&
                  ("break" === A || "continue" === A) &&
                  o.tryLoc <= n &&
                  n <= o.finallyLoc &&
                  (o = null);
                var a = o ? o.completion : {};
                return (
                  (a.type = A),
                  (a.arg = n),
                  o
                    ? ((this.method = "next"), (this.next = o.finallyLoc), E)
                    : this.complete(a)
                );
              },
              complete: function (A, n) {
                if ("throw" === A.type) throw A.arg;
                return (
                  "break" === A.type || "continue" === A.type
                    ? (this.next = A.arg)
                    : "return" === A.type
                      ? ((this.rval = this.arg = A.arg),
                        (this.method = "return"),
                        (this.next = "end"))
                      : "normal" === A.type && n && (this.next = n),
                  E
                );
              },
              finish: function (A) {
                for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                  var t = this.tryEntries[n];
                  if (t.finallyLoc === A)
                    return (this.complete(t.completion, t.afterLoc), z(t), E);
                }
              },
              catch: function (A) {
                for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                  var t = this.tryEntries[n];
                  if (t.tryLoc === A) {
                    var r = t.completion;
                    if ("throw" === r.type) {
                      var e = r.arg;
                      z(t);
                    }
                    return e;
                  }
                }
                throw new Error("illegal catch attempt");
              },
              delegateYield: function (n, t, r) {
                return (
                  (this.delegate = {
                    iterator: N(n),
                    resultName: t,
                    nextLoc: r,
                  }),
                  "next" === this.method && (this.arg = A),
                  E
                );
              },
            }),
            n
          );
        }
        function c(A, n, t, r, e, o, a) {
          try {
            var i = A[o](a),
              c = i.value;
          } catch (A) {
            return void t(A);
          }
          i.done ? n(c) : Promise.resolve(c).then(r, e);
        }
        function d(A) {
          return function () {
            var n = this,
              t = arguments;
            return new Promise(function (r, e) {
              var o = A.apply(n, t);
              function a(A) {
                c(o, r, e, a, i, "next", A);
              }
              function i(A) {
                c(o, r, e, a, i, "throw", A);
              }
              a(void 0);
            });
          };
        }
        function l(A, n) {
          return (
            (function (A) {
              if (Array.isArray(A)) return A;
            })(A) ||
            (function (A, n) {
              var t =
                null == A
                  ? null
                  : ("undefined" != typeof Symbol && A[Symbol.iterator]) ||
                    A["@@iterator"];
              if (null != t) {
                var r,
                  e,
                  o,
                  a,
                  i = [],
                  c = !0,
                  d = !1;
                try {
                  if (((o = (t = t.call(A)).next), 0 === n)) {
                    if (Object(t) !== t) return;
                    c = !1;
                  } else
                    for (
                      ;
                      !(c = (r = o.call(t)).done) &&
                      (i.push(r.value), i.length !== n);
                      c = !0
                    );
                } catch (A) {
                  ((d = !0), (e = A));
                } finally {
                  try {
                    if (
                      !c &&
                      null != t.return &&
                      ((a = t.return()), Object(a) !== a)
                    )
                      return;
                  } finally {
                    if (d) throw e;
                  }
                }
                return i;
              }
            })(A, n) ||
            (function (A, n) {
              if (!A) return;
              if ("string" == typeof A) return s(A, n);
              var t = Object.prototype.toString.call(A).slice(8, -1);
              "Object" === t && A.constructor && (t = A.constructor.name);
              if ("Map" === t || "Set" === t) return Array.from(A);
              if (
                "Arguments" === t ||
                /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
              )
                return s(A, n);
            })(A, n) ||
            (function () {
              throw new TypeError(
                "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
              );
            })()
          );
        }
        function s(A, n) {
          (null == n || n > A.length) && (n = A.length);
          for (var t = 0, r = new Array(n); t < n; t++) r[t] = A[t];
          return r;
        }
        function g() {
          var A = l((0, r.useState)("en"), 2),
            n = A[0],
            t = A[1],
            e = l((0, r.useState)(!0), 2),
            a = e[0],
            c = e[1],
            s = l((0, r.useState)(0), 2),
            g = s[0],
            p = s[1];
          (0, r.useEffect)(function () {
            var A = !0;
            d(
              i().mark(function n() {
                var r;
                return i().wrap(function (n) {
                  for (;;)
                    switch ((n.prev = n.next)) {
                      case 0:
                        return ((n.next = 2), (0, o.LE)());
                      case 2:
                        ((r = n.sent), A && (t(r), c(!1)));
                      case 4:
                      case "end":
                        return n.stop();
                    }
                }, n);
              }),
            )();
            var n = (function () {
              var A = d(
                i().mark(function A(n, r) {
                  var e;
                  return i().wrap(function (A) {
                    for (;;)
                      switch ((A.prev = A.next)) {
                        case 0:
                          if ("sync" !== r || !n.uiLanguage) {
                            A.next = 7;
                            break;
                          }
                          if (!(e = n.uiLanguage.newValue)) {
                            A.next = 7;
                            break;
                          }
                          return ((A.next = 5), (0, o.LE)());
                        case 5:
                          (t(e),
                            p(function (A) {
                              return A + 1;
                            }));
                        case 7:
                        case "end":
                          return A.stop();
                      }
                  }, A);
                }),
              );
              return function (n, t) {
                return A.apply(this, arguments);
              };
            })();
            return (
              chrome.storage.onChanged.addListener(n),
              function () {
                ((A = !1), chrome.storage.onChanged.removeListener(n));
              }
            );
          }, []);
          var b = (0, r.useCallback)(
            (function () {
              var A = d(
                i().mark(function A(n) {
                  var r;
                  return i().wrap(function (A) {
                    for (;;)
                      switch ((A.prev = A.next)) {
                        case 0:
                          return ((A.next = 2), (0, o.xC)(n));
                        case 2:
                          return (
                            (r = A.sent) &&
                              (t(n),
                              p(function (A) {
                                return A + 1;
                              })),
                            A.abrupt("return", r)
                          );
                        case 5:
                        case "end":
                          return A.stop();
                      }
                  }, A);
                }),
              );
              return function (n) {
                return A.apply(this, arguments);
              };
            })(),
            [],
          );
          return {
            t: (0, r.useCallback)(
              function (A, n) {
                return (0, o.t)(A, n);
              },
              [n, g],
            ),
            locale: n,
            changeLanguage: b,
            supportedLanguages: (0, o.qX)(),
            isLoading: a,
          };
        }
        var p = t(8542),
          b = t(7941),
          w = t(359),
          m = t(1639),
          B = t(6653),
          E = t(8037);
        function u(A, n) {
          return (
            (function (A) {
              if (Array.isArray(A)) return A;
            })(A) ||
            (function (A, n) {
              var t =
                null == A
                  ? null
                  : ("undefined" != typeof Symbol && A[Symbol.iterator]) ||
                    A["@@iterator"];
              if (null != t) {
                var r,
                  e,
                  o,
                  a,
                  i = [],
                  c = !0,
                  d = !1;
                try {
                  if (((o = (t = t.call(A)).next), 0 === n)) {
                    if (Object(t) !== t) return;
                    c = !1;
                  } else
                    for (
                      ;
                      !(c = (r = o.call(t)).done) &&
                      (i.push(r.value), i.length !== n);
                      c = !0
                    );
                } catch (A) {
                  ((d = !0), (e = A));
                } finally {
                  try {
                    if (
                      !c &&
                      null != t.return &&
                      ((a = t.return()), Object(a) !== a)
                    )
                      return;
                  } finally {
                    if (d) throw e;
                  }
                }
                return i;
              }
            })(A, n) ||
            (function (A, n) {
              if (!A) return;
              if ("string" == typeof A) return y(A, n);
              var t = Object.prototype.toString.call(A).slice(8, -1);
              "Object" === t && A.constructor && (t = A.constructor.name);
              if ("Map" === t || "Set" === t) return Array.from(A);
              if (
                "Arguments" === t ||
                /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
              )
                return y(A, n);
            })(A, n) ||
            (function () {
              throw new TypeError(
                "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
              );
            })()
          );
        }
        function y(A, n) {
          (null == n || n > A.length) && (n = A.length);
          for (var t = 0, r = new Array(n); t < n; t++) r[t] = A[t];
          return r;
        }
        var f = function (A) {
            if (!A || Number.isNaN(A)) return "0.0m";
            var n = A / 6e4;
            if (n >= 60) {
              var t = Math.floor(n / 60),
                r = (n - 60 * t).toFixed(1);
              return "".concat(t, "h ").concat(r, "m");
            }
            return "".concat(n.toFixed(1), "m");
          },
          h = function (A) {
            var n = A.sessions,
              t = A.selectedSessionId,
              e = A.onSelectSession,
              o = A.onDeleteSession,
              a = A.onClearAll,
              i = A.t,
              c = u((0, r.useState)(""), 2),
              d = c[0],
              l = c[1],
              s = (0, r.useMemo)(
                function () {
                  return n
                    .filter(function (A) {
                      return (
                        A.tabTitle.toLowerCase().includes(d.toLowerCase()) ||
                        A.mainDomain.toLowerCase().includes(d.toLowerCase())
                      );
                    })
                    .sort(function (A, n) {
                      return n.startedAt - A.startedAt;
                    });
                },
                [n, d],
              ),
              g = (0, r.useMemo)(
                function () {
                  var A = {
                    Today: [],
                    Yesterday: [],
                    "This Week": [],
                    Earlier: [],
                  };
                  return (
                    s.forEach(function (n) {
                      var t = (function (A) {
                        new Date(A);
                        var n = new Date(),
                          t = new Date(
                            n.getFullYear(),
                            n.getMonth(),
                            n.getDate(),
                          ).getTime();
                        return A >= t
                          ? "Today"
                          : A >= t - 864e5
                            ? "Yesterday"
                            : A >= t - 5184e5
                              ? "This Week"
                              : "Earlier";
                      })(n.startedAt);
                      A[t].push(n);
                    }),
                    A
                  );
                },
                [s],
              );
            return r.createElement(
              "div",
              {
                className:
                  "w-80 h-full bg-white border-r border-slate-200 flex flex-col flex-shrink-0",
              },
              r.createElement(
                "div",
                {
                  className:
                    "p-4 border-b border-slate-100 flex flex-col gap-3",
                },
                r.createElement(
                  "h2",
                  {
                    className:
                      "text-xl font-bold text-slate-800 tracking-tight",
                  },
                  i ? i("history.sessions") : "Sessions",
                ),
                r.createElement(
                  "div",
                  { className: "relative" },
                  r.createElement(p.A, {
                    className:
                      "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400",
                    size: 14,
                  }),
                  r.createElement("input", {
                    type: "text",
                    placeholder: i
                      ? i("history.searchPlaceholder")
                      : "Search...",
                    className:
                      "w-full bg-slate-100 text-sm pl-9 pr-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-700",
                    value: d,
                    onChange: function (A) {
                      return l(A.target.value);
                    },
                  }),
                ),
              ),
              r.createElement(
                "div",
                { className: "flex-1 overflow-y-auto custom-scrollbar" },
                0 === s.length
                  ? r.createElement(
                      "div",
                      { className: "p-8 text-center text-slate-400 text-sm" },
                      i ? i("history.noSessions") : "No sessions yet",
                    )
                  : ["Today", "Yesterday", "This Week", "Earlier"].map(
                      function (A) {
                        return 0 === g[A].length
                          ? null
                          : r.createElement(
                              "div",
                              { key: A },
                              r.createElement(
                                "div",
                                {
                                  className:
                                    "px-4 py-2 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider sticky top-0 z-10 border-y border-slate-100/50",
                                },
                                A,
                              ),
                              r.createElement(
                                "div",
                                null,
                                g[A].map(function (A) {
                                  var n = (function (A) {
                                      if (
                                        null != A &&
                                        A.endedAt &&
                                        null != A &&
                                        A.startedAt
                                      )
                                        return Math.max(
                                          0,
                                          A.endedAt - A.startedAt,
                                        );
                                      var n =
                                        (null == A ? void 0 : A.segments) || [];
                                      return 0 === n.length
                                        ? 0
                                        : n.reduce(function (A, n) {
                                            return Math.max(A, n.endTime || 0);
                                          }, 0);
                                    })(A),
                                    a = "ongoing" === A.status;
                                  return r.createElement(
                                    "div",
                                    {
                                      key: A.id,
                                      onClick: function () {
                                        return e(A.id);
                                      },
                                      className:
                                        "group relative p-4 cursor-pointer transition-colors border-b border-slate-50 hover:bg-slate-50 ".concat(
                                          t === A.id
                                            ? "bg-indigo-50/60 border-l-4 border-l-indigo-500"
                                            : "border-l-4 border-l-transparent",
                                        ),
                                    },
                                    r.createElement(
                                      "div",
                                      {
                                        className:
                                          "flex justify-between items-start mb-1",
                                      },
                                      r.createElement(
                                        "h3",
                                        {
                                          className:
                                            "text-sm font-semibold line-clamp-2 leading-snug ".concat(
                                              t === A.id
                                                ? "text-indigo-700"
                                                : "text-slate-700",
                                            ),
                                        },
                                        A.tabTitle ||
                                          (i
                                            ? i("history.untitledSession")
                                            : "Untitled Session"),
                                      ),
                                    ),
                                    r.createElement(
                                      "div",
                                      {
                                        className:
                                          "flex items-center text-xs text-slate-500 gap-2 mb-1",
                                      },
                                      r.createElement(
                                        "span",
                                        {
                                          className:
                                            "font-medium text-slate-400",
                                        },
                                        A.mainDomain,
                                      ),
                                    ),
                                    r.createElement(
                                      "div",
                                      {
                                        className:
                                          "flex justify-between items-end mt-2",
                                      },
                                      r.createElement(
                                        "div",
                                        {
                                          className:
                                            "flex gap-2 items-center text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded",
                                        },
                                        A.fromLang,
                                        " ",
                                        r.createElement(
                                          "span",
                                          { className: "text-slate-300" },
                                          "→",
                                        ),
                                        " ",
                                        A.toLang,
                                      ),
                                      r.createElement(
                                        "div",
                                        {
                                          className:
                                            "flex items-center gap-1.5",
                                        },
                                        A.isSynced &&
                                          r.createElement(b.A, {
                                            size: 12,
                                            className: "text-slate-300",
                                          }),
                                        a
                                          ? r.createElement(w.A, {
                                              size: 12,
                                              className:
                                                "text-red-500 animate-pulse",
                                            })
                                          : "completed" === A.status
                                            ? r.createElement(
                                                r.Fragment,
                                                null,
                                                r.createElement(m.A, {
                                                  size: 12,
                                                  className: "text-emerald-500",
                                                }),
                                                r.createElement(
                                                  "span",
                                                  {
                                                    className:
                                                      "text-xs text-slate-500",
                                                  },
                                                  f(n),
                                                ),
                                              )
                                            : r.createElement(
                                                r.Fragment,
                                                null,
                                                r.createElement(B.A, {
                                                  size: 12,
                                                  className: "text-amber-500",
                                                }),
                                                r.createElement(
                                                  "span",
                                                  {
                                                    className:
                                                      "text-xs text-slate-500",
                                                  },
                                                  f(n),
                                                ),
                                              ),
                                      ),
                                    ),
                                    r.createElement(
                                      "button",
                                      {
                                        onClick: function (n) {
                                          (n.stopPropagation(), a || o(A.id));
                                        },
                                        disabled: a,
                                        className:
                                          "absolute right-2 top-2 p-1.5 rounded shadow-sm border border-slate-100 transition-opacity ".concat(
                                            a
                                              ? "text-slate-300 cursor-not-allowed opacity-0 group-hover:opacity-50"
                                              : "text-slate-400 hover:text-red-500 hover:bg-white opacity-0 group-hover:opacity-100",
                                          ),
                                        title: a
                                          ? "Cannot delete running session"
                                          : "Delete Session",
                                      },
                                      r.createElement(E.A, { size: 14 }),
                                    ),
                                  );
                                }),
                              ),
                            );
                      },
                    ),
              ),
              r.createElement(
                "div",
                { className: "border-t border-slate-200 bg-slate-50" },
                r.createElement(
                  "button",
                  {
                    onClick: function () {
                      return a();
                    },
                    className:
                      "w-full text-xs text-slate-500 hover:text-red-600 flex items-center justify-center gap-2 py-2 hover:bg-red-50 transition-colors",
                  },
                  r.createElement(E.A, { size: 12 }),
                  " ",
                  i ? i("history.clearAll") : "Clear All",
                ),
                r.createElement(
                  "div",
                  {
                    className:
                      "px-4 pb-3 pt-2 text-[10px] text-slate-400 text-center leading-relaxed",
                  },
                  "All history records are stored locally.",
                ),
              ),
            );
          },
          v = t(315),
          k = t(817),
          x = t(1480),
          G = t(2007),
          H = t(3342),
          S = t(3850),
          C = t(7878),
          L = t(6798),
          z = function (A) {
            var n = A.text,
              t = A.term;
            if (!t || !n.toLowerCase().includes(t.toLowerCase()))
              return r.createElement("span", null, n);
            var e = n.split(new RegExp("(".concat(t, ")"), "gi"));
            return r.createElement(
              "span",
              null,
              e.map(function (A, n) {
                return A.toLowerCase() === t.toLowerCase()
                  ? r.createElement(
                      "span",
                      {
                        key: n,
                        className:
                          "bg-yellow-200 dark:bg-yellow-800 text-black dark:text-white rounded px-0.5",
                      },
                      A,
                    )
                  : A;
              }),
            );
          },
          I = function (A) {
            var n,
              t,
              e,
              o,
              a = A.segment,
              i = A.viewMode,
              c = A.showTimestamp,
              d = A.onToggleStar,
              l = A.highlightTerm;
            return r.createElement(
              "div",
              {
                className:
                  "group flex items-start p-3 hover:bg-slate-50 border-b border-gray-100 transition-colors ".concat(
                    a.starred ? "bg-yellow-50/30" : "",
                  ),
              },
              c &&
                r.createElement(
                  "div",
                  {
                    className:
                      "w-20 flex-shrink-0 text-xs text-slate-400 font-mono mt-1 select-none",
                  },
                  ((n = a.startTime),
                  (t = Math.floor(n / 1e3)),
                  (e = Math.floor(t / 60)),
                  (o = t % 60),
                  "["
                    .concat(e.toString().padStart(2, "0"), ":")
                    .concat(o.toString().padStart(2, "0"), "]")),
                ),
              r.createElement(
                "button",
                {
                  onClick: function () {
                    return d(a.id);
                  },
                  className:
                    "w-8 h-8 flex items-center justify-center rounded hover:bg-slate-200 mr-3 flex-shrink-0 transition-all ".concat(
                      a.starred
                        ? "text-yellow-500"
                        : "text-slate-300 opacity-0 group-hover:opacity-100",
                    ),
                  "aria-label": a.starred ? "Unstar segment" : "Star segment",
                },
                r.createElement(C.A, {
                  size: 16,
                  fill: a.starred ? "currentColor" : "none",
                }),
              ),
              r.createElement(
                "div",
                { className: "flex-1 space-y-1" },
                ("bilingual" === i || "original" === i) &&
                  r.createElement(
                    "p",
                    {
                      className:
                        "text-slate-800 font-medium leading-relaxed ".concat(
                          "bilingual" === i ? "text-sm" : "text-base",
                        ),
                    },
                    r.createElement(z, { text: a.sourceText, term: l }),
                  ),
                ("bilingual" === i || "translation" === i) &&
                  a.targetText &&
                  r.createElement(
                    "p",
                    {
                      className: "text-slate-600 leading-relaxed ".concat(
                        "bilingual" === i ? "text-sm" : "text-base",
                      ),
                    },
                    r.createElement(z, { text: a.targetText, term: l }),
                  ),
              ),
            );
          },
          N = function (A) {
            var n = A.isOpen,
              t = A.title,
              e = void 0 === t ? "Confirm" : t,
              o = A.message,
              a = A.confirmText,
              i = void 0 === a ? "Confirm" : a,
              c = A.cancelText,
              d = void 0 === c ? "Cancel" : c,
              l = A.onConfirm,
              s = A.onCancel,
              g = A.isDanger,
              p = void 0 === g || g;
            return n
              ? r.createElement(
                  "div",
                  {
                    className:
                      "fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center",
                  },
                  r.createElement(
                    "div",
                    {
                      className:
                        "bg-white rounded-lg shadow-xl w-80 p-4 space-y-3",
                    },
                    r.createElement(
                      "h3",
                      { className: "text-lg font-semibold text-slate-800" },
                      e,
                    ),
                    r.createElement(
                      "p",
                      { className: "text-sm text-slate-600" },
                      o,
                    ),
                    r.createElement(
                      "div",
                      { className: "flex justify-end gap-2 pt-2" },
                      r.createElement(
                        "button",
                        {
                          onClick: s,
                          className:
                            "px-3 py-1.5 text-sm rounded border border-slate-200 text-slate-600 hover:bg-slate-100",
                        },
                        d,
                      ),
                      r.createElement(
                        "button",
                        {
                          onClick: l,
                          className:
                            "px-3 py-1.5 text-sm rounded text-white ".concat(
                              p
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-indigo-500 hover:bg-indigo-600",
                            ),
                        },
                        i,
                      ),
                    ),
                  ),
                )
              : null;
          };
        function j(A, n) {
          return (
            (function (A) {
              if (Array.isArray(A)) return A;
            })(A) ||
            (function (A, n) {
              var t =
                null == A
                  ? null
                  : ("undefined" != typeof Symbol && A[Symbol.iterator]) ||
                    A["@@iterator"];
              if (null != t) {
                var r,
                  e,
                  o,
                  a,
                  i = [],
                  c = !0,
                  d = !1;
                try {
                  if (((o = (t = t.call(A)).next), 0 === n)) {
                    if (Object(t) !== t) return;
                    c = !1;
                  } else
                    for (
                      ;
                      !(c = (r = o.call(t)).done) &&
                      (i.push(r.value), i.length !== n);
                      c = !0
                    );
                } catch (A) {
                  ((d = !0), (e = A));
                } finally {
                  try {
                    if (
                      !c &&
                      null != t.return &&
                      ((a = t.return()), Object(a) !== a)
                    )
                      return;
                  } finally {
                    if (d) throw e;
                  }
                }
                return i;
              }
            })(A, n) ||
            (function (A, n) {
              if (!A) return;
              if ("string" == typeof A) return T(A, n);
              var t = Object.prototype.toString.call(A).slice(8, -1);
              "Object" === t && A.constructor && (t = A.constructor.name);
              if ("Map" === t || "Set" === t) return Array.from(A);
              if (
                "Arguments" === t ||
                /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
              )
                return T(A, n);
            })(A, n) ||
            (function () {
              throw new TypeError(
                "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
              );
            })()
          );
        }
        function T(A, n) {
          (null == n || n > A.length) && (n = A.length);
          for (var t = 0, r = new Array(n); t < n; t++) r[t] = A[t];
          return r;
        }
        var O = function (A) {
            var n = A.session,
              t = A.onUpdateTitle,
              e = A.onDeleteSession,
              o = A.onToggleStar,
              a = A.onToast,
              i = j((0, r.useState)("bilingual"), 2),
              c = i[0],
              d = i[1],
              l = j((0, r.useState)(!0), 2),
              s = l[0],
              g = l[1],
              b = j((0, r.useState)(!1), 2),
              w = b[0],
              m = b[1],
              B = j((0, r.useState)(""), 2),
              u = B[0],
              y = B[1],
              f = j((0, r.useState)(!1), 2),
              h = f[0],
              z = f[1],
              T = j((0, r.useState)(n.tabTitle), 2),
              O = T[0],
              D = T[1],
              M = j((0, r.useState)(!1), 2),
              F = M[0],
              P = M[1],
              U = j((0, r.useState)(!1), 2),
              _ = U[0],
              X = U[1],
              Y = j((0, r.useState)(!0), 2),
              q = Y[0],
              R = Y[1],
              W = j((0, r.useState)("both"), 2),
              J = W[0],
              $ = W[1],
              K = (0, r.useRef)(!1),
              Q = "ongoing" === n.status;
            ((0, r.useEffect)(function () {
              chrome.storage.sync.get(
                {
                  historyDownloadIncludeTimestamp: !0,
                  historyDownloadLanguageMode: "both",
                },
                function (A) {
                  (R(A.historyDownloadIncludeTimestamp),
                    $(A.historyDownloadLanguageMode),
                    (K.current = !0));
                },
              );
            }, []),
              (0, r.useEffect)(
                function () {
                  K.current &&
                    chrome.storage.sync.set({
                      historyDownloadIncludeTimestamp: q,
                    });
                },
                [q],
              ),
              (0, r.useEffect)(
                function () {
                  K.current &&
                    chrome.storage.sync.set({ historyDownloadLanguageMode: J });
                },
                [J],
              ),
              (0, r.useEffect)(
                function () {
                  (y(""), m(!1), D(n.tabTitle), z(!1), P(!1), X(!1));
                },
                [n.id, n.tabTitle],
              ));
            var V = (0, r.useMemo)(
                function () {
                  return n.segments.filter(function (A) {
                    if (w && !A.starred) return !1;
                    if (u) {
                      var n,
                        t = u.toLowerCase(),
                        r = A.sourceText.toLowerCase().includes(t),
                        e =
                          null === (n = A.targetText) || void 0 === n
                            ? void 0
                            : n.toLowerCase().includes(t);
                      return r || e;
                    }
                    return !0;
                  });
                },
                [n.segments, w, u],
              ),
              Z = function () {
                (z(!1), O.trim() && O !== n.tabTitle ? t(O) : D(n.tabTitle));
              };
            return r.createElement(
              r.Fragment,
              null,
              r.createElement(N, {
                isOpen: F,
                title: "Confirm Deletion",
                message: "Delete this session? This cannot be undone.",
                onCancel: function () {
                  return P(!1);
                },
                onConfirm: function () {
                  (P(!1), e());
                },
              }),
              r.createElement(
                "div",
                {
                  className:
                    "flex-1 flex flex-col h-full overflow-hidden bg-white",
                },
                r.createElement(
                  "div",
                  {
                    className:
                      "p-6 border-b border-slate-200 bg-white shadow-sm z-20",
                  },
                  r.createElement(
                    "div",
                    { className: "flex justify-between items-start mb-4" },
                    r.createElement(
                      "div",
                      { className: "flex-1 mr-4" },
                      h
                        ? r.createElement("input", {
                            autoFocus: !0,
                            type: "text",
                            value: O,
                            onChange: function (A) {
                              return D(A.target.value);
                            },
                            onBlur: Z,
                            onKeyDown: function (A) {
                              ("Enter" === A.key && Z(),
                                "Escape" === A.key && (D(n.tabTitle), z(!1)));
                            },
                            className:
                              "text-2xl font-bold text-slate-800 w-full border-b-2 border-indigo-500 focus:outline-none bg-transparent",
                          })
                        : r.createElement(
                            "h1",
                            {
                              onClick: function () {
                                return z(!0);
                              },
                              className:
                                "text-2xl font-bold text-slate-800 flex items-center gap-2 cursor-pointer hover:text-indigo-700 group",
                            },
                            n.tabTitle,
                            r.createElement(v.A, {
                              size: 16,
                              className:
                                "text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity",
                            }),
                          ),
                      r.createElement(
                        "div",
                        {
                          className:
                            "flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500",
                        },
                        r.createElement(
                          "span",
                          { className: "flex items-center gap-1.5" },
                          r.createElement(k.A, { size: 14 }),
                          " ",
                          n.mainDomain,
                        ),
                        r.createElement("span", {
                          className: "w-1 h-1 bg-slate-300 rounded-full",
                        }),
                        r.createElement(
                          "span",
                          { className: "flex items-center gap-1.5" },
                          r.createElement(x.A, { size: 14 }),
                          " ",
                          new Date(n.startedAt).toLocaleDateString(),
                        ),
                        r.createElement("span", {
                          className: "w-1 h-1 bg-slate-300 rounded-full",
                        }),
                        r.createElement(
                          "span",
                          {
                            className:
                              "flex items-center gap-1.5 font-mono bg-slate-100 px-2 py-0.5 rounded text-xs",
                          },
                          n.fromLang,
                          " → ",
                          n.toLang,
                        ),
                      ),
                    ),
                    r.createElement(
                      "div",
                      { className: "flex items-center gap-2 relative" },
                      r.createElement(
                        "button",
                        {
                          onClick: function () {
                            var A = V.map(function (A) {
                              return ""
                                .concat(A.sourceText, "\n")
                                .concat(A.targetText || "");
                            }).join("\n\n");
                            (navigator.clipboard.writeText(A),
                              a &&
                                a({
                                  text: "Copied to clipboard",
                                  type: "success",
                                }));
                            try {
                              chrome.runtime.sendMessage({
                                type: "trackEvent",
                                eventName: "history_copy_all",
                                properties: {
                                  sessionId: n.id,
                                  segmentCount: V.length,
                                  hasFilter: u.length > 0 || w,
                                  fromLang: n.fromLang,
                                  toLang: n.toLang,
                                },
                              });
                            } catch (A) {}
                          },
                          className:
                            "p-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 rounded transition-colors",
                          title: "Copy All",
                        },
                        r.createElement(G.A, { size: 18 }),
                      ),
                      r.createElement(
                        "div",
                        { className: "relative" },
                        r.createElement(
                          "button",
                          {
                            onClick: function () {
                              return X(!_);
                            },
                            className:
                              "p-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 rounded transition-colors ".concat(
                                _ ? "bg-indigo-50 text-indigo-600" : "",
                              ),
                            title: "Download TXT",
                          },
                          r.createElement(H.A, { size: 18 }),
                        ),
                        _ &&
                          r.createElement(
                            r.Fragment,
                            null,
                            r.createElement("div", {
                              className: "fixed inset-0 z-30",
                              onClick: function () {
                                return X(!1);
                              },
                            }),
                            r.createElement(
                              "div",
                              {
                                className:
                                  "absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-200 p-4 z-40",
                              },
                              r.createElement(
                                "h3",
                                {
                                  className:
                                    "text-sm font-semibold text-slate-700 mb-3",
                                },
                                "Download as TXT",
                              ),
                              r.createElement(
                                "label",
                                {
                                  className:
                                    "flex items-center gap-2 mb-3 cursor-pointer select-none",
                                },
                                r.createElement("input", {
                                  type: "checkbox",
                                  checked: q,
                                  onChange: function (A) {
                                    return R(A.target.checked);
                                  },
                                  className:
                                    "rounded border-slate-300 text-indigo-600 focus:ring-indigo-500",
                                }),
                                r.createElement(
                                  "span",
                                  { className: "text-sm text-slate-700" },
                                  "Include timestamps in file",
                                ),
                              ),
                              r.createElement(
                                "div",
                                { className: "mb-4" },
                                r.createElement(
                                  "p",
                                  {
                                    className:
                                      "text-xs text-slate-500 mb-2 font-medium",
                                  },
                                  "Content:",
                                ),
                                r.createElement(
                                  "div",
                                  { className: "space-y-2" },
                                  r.createElement(
                                    "label",
                                    {
                                      className:
                                        "flex items-center gap-2 cursor-pointer select-none",
                                    },
                                    r.createElement("input", {
                                      type: "radio",
                                      name: "downloadLangMode",
                                      value: "both",
                                      checked: "both" === J,
                                      onChange: function (A) {
                                        return $(A.target.value);
                                      },
                                      className:
                                        "text-indigo-600 focus:ring-indigo-500",
                                    }),
                                    r.createElement(
                                      "span",
                                      { className: "text-sm text-slate-700" },
                                      "Both languages",
                                    ),
                                  ),
                                  r.createElement(
                                    "label",
                                    {
                                      className:
                                        "flex items-center gap-2 cursor-pointer select-none",
                                    },
                                    r.createElement("input", {
                                      type: "radio",
                                      name: "downloadLangMode",
                                      value: "original",
                                      checked: "original" === J,
                                      onChange: function (A) {
                                        return $(A.target.value);
                                      },
                                      className:
                                        "text-indigo-600 focus:ring-indigo-500",
                                    }),
                                    r.createElement(
                                      "span",
                                      { className: "text-sm text-slate-700" },
                                      "Original only",
                                    ),
                                  ),
                                  r.createElement(
                                    "label",
                                    {
                                      className:
                                        "flex items-center gap-2 cursor-pointer select-none",
                                    },
                                    r.createElement("input", {
                                      type: "radio",
                                      name: "downloadLangMode",
                                      value: "translation",
                                      checked: "translation" === J,
                                      onChange: function (A) {
                                        return $(A.target.value);
                                      },
                                      className:
                                        "text-indigo-600 focus:ring-indigo-500",
                                    }),
                                    r.createElement(
                                      "span",
                                      { className: "text-sm text-slate-700" },
                                      "Translation only",
                                    ),
                                  ),
                                ),
                              ),
                              r.createElement(
                                "button",
                                {
                                  onClick: function () {
                                    var A = V.map(function (A) {
                                        var n = [];
                                        if (q) {
                                          var t = "[".concat(
                                              new Date(A.startTime)
                                                .toISOString()
                                                .substring(14, 19),
                                              "]",
                                            ),
                                            r = A.starred ? "[*]" : "";
                                          n.push(
                                            ""
                                              .concat(t)
                                              .concat(r ? " " + r : ""),
                                          );
                                        }
                                        return (
                                          "both" === J
                                            ? (n.push(A.sourceText),
                                              n.push(A.targetText || ""))
                                            : "original" === J
                                              ? n.push(A.sourceText)
                                              : "translation" === J &&
                                                n.push(A.targetText || ""),
                                          n
                                            .filter(function (A) {
                                              return A;
                                            })
                                            .join("\n")
                                        );
                                      }),
                                      t = new Blob([A.join("\n\n")], {
                                        type: "text/plain",
                                      }),
                                      r = URL.createObjectURL(t),
                                      e = document.createElement("a");
                                    e.href = r;
                                    var o, i, c, d, l, s, g;
                                    try {
                                      var p = n.tabTitle
                                          .replace(/[<>:"/\\|?*]/g, "")
                                          .trim(),
                                        b =
                                          ((o = n.startedAt),
                                          (i = new Date(o)),
                                          (c = i.getFullYear()),
                                          (d = String(
                                            i.getMonth() + 1,
                                          ).padStart(2, "0")),
                                          (l = String(i.getDate()).padStart(
                                            2,
                                            "0",
                                          )),
                                          (s = String(i.getHours()).padStart(
                                            2,
                                            "0",
                                          )),
                                          (g = String(i.getMinutes()).padStart(
                                            2,
                                            "0",
                                          )),
                                          ""
                                            .concat(c, "-")
                                            .concat(d, "-")
                                            .concat(l, " ")
                                            .concat(s, ".")
                                            .concat(g)),
                                        m = ""
                                          .concat(n.fromLang, "-")
                                          .concat(n.toLang);
                                      p && p.length > 0
                                        ? (e.download = ""
                                            .concat(p, " - ")
                                            .concat(m, " - ")
                                            .concat(b, ".txt"))
                                        : (e.download = ""
                                            .concat(m, " - ")
                                            .concat(b, ".txt"));
                                    } catch (A) {
                                      e.download = "DubTab-".concat(
                                        Date.now(),
                                        ".txt",
                                      );
                                    }
                                    (e.click(),
                                      URL.revokeObjectURL(r),
                                      X(!1),
                                      a &&
                                        a({
                                          text: "Downloaded successfully",
                                          type: "success",
                                        }));
                                    try {
                                      chrome.runtime.sendMessage({
                                        type: "trackEvent",
                                        eventName: "history_download",
                                        properties: {
                                          sessionId: n.id,
                                          segmentCount: V.length,
                                          includeTimestamp: q,
                                          languageMode: J,
                                          hasFilter: u.length > 0 || w,
                                          fromLang: n.fromLang,
                                          toLang: n.toLang,
                                          filename: e.download,
                                        },
                                      });
                                    } catch (A) {}
                                  },
                                  className:
                                    "w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2",
                                },
                                r.createElement(H.A, { size: 16 }),
                                "Download",
                              ),
                            ),
                          ),
                      ),
                      r.createElement("div", {
                        className: "w-px h-6 bg-slate-200 mx-1",
                      }),
                      r.createElement(
                        "button",
                        {
                          onClick: function () {
                            return !Q && P(!0);
                          },
                          disabled: Q,
                          className: "p-2 rounded transition-colors ".concat(
                            Q
                              ? "text-slate-300 cursor-not-allowed"
                              : "text-slate-400 hover:bg-red-50 hover:text-red-500",
                          ),
                          title: Q
                            ? "Cannot delete running session"
                            : "Delete Session",
                        },
                        r.createElement(E.A, { size: 18 }),
                      ),
                    ),
                  ),
                  r.createElement(
                    "div",
                    {
                      className:
                        "flex flex-wrap gap-4 items-center justify-between pt-2",
                    },
                    r.createElement(
                      "div",
                      {
                        className:
                          "flex items-center bg-slate-100 rounded-lg p-1",
                      },
                      ["bilingual", "original", "translation"].map(
                        function (A) {
                          return r.createElement(
                            "button",
                            {
                              key: A,
                              onClick: function () {
                                d(A);
                                try {
                                  chrome.runtime.sendMessage({
                                    type: "trackEvent",
                                    eventName: "history_view_mode_changed",
                                    properties: {
                                      mode: A,
                                      sessionId: n.id,
                                      fromLang: n.fromLang,
                                      toLang: n.toLang,
                                    },
                                  });
                                } catch (A) {}
                              },
                              className:
                                "px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-all ".concat(
                                  c === A
                                    ? "bg-white text-indigo-600 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700",
                                ),
                            },
                            A,
                          );
                        },
                      ),
                    ),
                    r.createElement(
                      "div",
                      { className: "flex items-center gap-4" },
                      r.createElement(
                        "label",
                        {
                          className:
                            "flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none",
                        },
                        r.createElement("input", {
                          type: "checkbox",
                          checked: s,
                          onChange: function () {
                            return g(!s);
                          },
                          className:
                            "rounded border-slate-300 text-indigo-600 focus:ring-indigo-500",
                        }),
                        r.createElement(S.A, { size: 14 }),
                        " Timestamps",
                      ),
                      r.createElement(
                        "button",
                        {
                          onClick: function () {
                            return m(!w);
                          },
                          className:
                            "flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border transition-colors ".concat(
                              w
                                ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50",
                            ),
                        },
                        r.createElement(C.A, {
                          size: 14,
                          fill: w ? "currentColor" : "none",
                        }),
                        "Starred only",
                      ),
                    ),
                    r.createElement(
                      "div",
                      { className: "relative" },
                      r.createElement(p.A, {
                        className:
                          "absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400",
                        size: 14,
                      }),
                      r.createElement("input", {
                        type: "text",
                        placeholder: "Filter segments...",
                        value: u,
                        onChange: function (A) {
                          return y(A.target.value);
                        },
                        className:
                          "pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-full focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 w-48 transition-all",
                      }),
                    ),
                  ),
                ),
                r.createElement(
                  "div",
                  {
                    className: "flex-1 overflow-y-auto scroll-smooth bg-white",
                  },
                  0 === V.length
                    ? r.createElement(
                        "div",
                        {
                          className:
                            "flex flex-col items-center justify-center h-full text-slate-400 gap-2",
                        },
                        r.createElement(L.A, {
                          size: 32,
                          className: "text-slate-200",
                        }),
                        r.createElement(
                          "p",
                          null,
                          "No segments found matching your filters.",
                        ),
                      )
                    : r.createElement(
                        "div",
                        { className: "pb-20" },
                        V.map(function (A) {
                          return r.createElement(I, {
                            key: A.id,
                            segment: A,
                            viewMode: c,
                            showTimestamp: s,
                            onToggleStar: o,
                            highlightTerm: u,
                          });
                        }),
                      ),
                ),
              ),
            );
          },
          D = t(4143),
          M = t(2722);
        function F(A) {
          return (
            (F =
              "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                ? function (A) {
                    return typeof A;
                  }
                : function (A) {
                    return A &&
                      "function" == typeof Symbol &&
                      A.constructor === Symbol &&
                      A !== Symbol.prototype
                      ? "symbol"
                      : typeof A;
                  }),
            F(A)
          );
        }
        function P(A, n) {
          for (var t = 0; t < n.length; t++) {
            var r = n[t];
            ((r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              "value" in r && (r.writable = !0),
              Object.defineProperty(A, _(r.key), r));
          }
        }
        function U(A, n, t) {
          return (
            (n = _(n)) in A
              ? Object.defineProperty(A, n, {
                  value: t,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                })
              : (A[n] = t),
            A
          );
        }
        function _(A) {
          var n = (function (A, n) {
            if ("object" != F(A) || !A) return A;
            var t = A[Symbol.toPrimitive];
            if (void 0 !== t) {
              var r = t.call(A, n || "default");
              if ("object" != F(r)) return r;
              throw new TypeError(
                "@@toPrimitive must return a primitive value.",
              );
            }
            return ("string" === n ? String : Number)(A);
          })(A, "string");
          return "symbol" == F(n) ? n : String(n);
        }
        const X = new ((function () {
          function A() {
            var n = this;
            (!(function (A, n) {
              if (!(A instanceof n))
                throw new TypeError("Cannot call a class as a function");
            })(this, A),
              U(this, "name", "DubTab"),
              U(this, "IndexedDB_MAX_RECORD_COUNT", 300),
              U(this, "checkoutName", "dubtab"),
              U(this, "version", chrome.runtime.getManifest().version),
              U(this, "contactEmail", "support@dubtab.com"),
              U(this, "discordInviteUrl", "https://discord.gg/7V56xZ4sXQ"),
              U(this, "configs", {
                subscriptionURL: "http://dubtab.com/checkout/stripe/dubtab?",
                subscriptionURLTest:
                  "http://dubtab.com/checkout/stripe/dubtab?isTestMode=true&",
                freeDataLimit: 300,
                isTestMode: !1,
                starterHours: 9,
                proHours: 20,
                powerHours: 40,
                ultraHours: 80,
                starterMonthlyPrice: 19,
                proMonthlyPrice: 39,
                powerMonthlyPrice: 69,
                ultraMonthlyPrice: 129,
                starterAnnuallyPrice: 190,
                proAnnuallyPrice: 390,
                powerAnnuallyPrice: 690,
                ultraAnnuallyPrice: 1290,
                paygoSmallPackHours: 1,
                paygoStandardPackHours: 4,
                paygoLargePackHours: 15,
                paygoSmallPackPrice: 5,
                paygoStandardPackPrice: 15,
                paygoLargePackPrice: 45,
                customerPortalUrl:
                  "https://billing.stripe.com/p/login/14AbJ13Q77jC181gnv4c800",
                starterMonthlyPriceId: "price_1SoJoXGlX4IcdEWXXOQfY3RC",
                proMonthlyPriceId: "price_1SoJoXGlX4IcdEWX5RuHOOcH",
                powerMonthlyPriceId: "price_1SoJoXGlX4IcdEWXNYCIwtvC",
                ultraMonthlyPriceId: "price_1SoJoXGlX4IcdEWXEFsJCyF1",
                starterAnnuallyPriceId: "price_1SoJoXGlX4IcdEWXvC03kcND",
                proAnnuallyPriceId: "price_1SoJoWGlX4IcdEWXGzyA61ii",
                powerAnnuallyPriceId: "price_1SoJoWGlX4IcdEWX0ZxIWr3E",
                ultraAnnuallyPriceId: "price_1SoJoWGlX4IcdEWXJdHOSrYm",
                paygoSmallPackPriceId: "price_1SoJoWGlX4IcdEWX8dLjYJfE",
                paygoStandardPackPriceId: "price_1SoJoWGlX4IcdEWXjiaUUYfc",
                paygoLargePackPriceId: "price_1SoJoWGlX4IcdEWXFchcflAQ",
              }),
              U(
                this,
                "clientId",
                "781969812770-98iajtquasmhrrrm23fdo817d3s69rl6.apps.googleusercontent.com",
              ),
              U(this, "isNetworkError", !1),
              U(this, "updateConfigs", function (A) {
                n.configs = A;
              }),
              U(this, "getSubscriptionURL", function () {
                return n.configs.isTestMode
                  ? n.configs.subscriptionURLTest
                  : n.configs.subscriptionURL;
              }),
              (0, M.l_)(this));
          }
          var n, t, r;
          return (
            (n = A),
            (t = [
              {
                key: "getPropValue",
                value: function (A) {
                  return A in this ? (0, M.HO)(this[A]) : void 0;
                },
              },
            ]) && P(n.prototype, t),
            r && P(n, r),
            Object.defineProperty(n, "prototype", { writable: !1 }),
            A
          );
        })())();
        function Y(A) {
          return (
            (Y =
              "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                ? function (A) {
                    return typeof A;
                  }
                : function (A) {
                    return A &&
                      "function" == typeof Symbol &&
                      A.constructor === Symbol &&
                      A !== Symbol.prototype
                      ? "symbol"
                      : typeof A;
                  }),
            Y(A)
          );
        }
        function q() {
          q = function () {
            return n;
          };
          var A,
            n = {},
            t = Object.prototype,
            r = t.hasOwnProperty,
            e =
              Object.defineProperty ||
              function (A, n, t) {
                A[n] = t.value;
              },
            o = "function" == typeof Symbol ? Symbol : {},
            a = o.iterator || "@@iterator",
            i = o.asyncIterator || "@@asyncIterator",
            c = o.toStringTag || "@@toStringTag";
          function d(A, n, t) {
            return (
              Object.defineProperty(A, n, {
                value: t,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              }),
              A[n]
            );
          }
          try {
            d({}, "");
          } catch (A) {
            d = function (A, n, t) {
              return (A[n] = t);
            };
          }
          function l(A, n, t, r) {
            var o = n && n.prototype instanceof B ? n : B,
              a = Object.create(o.prototype),
              i = new L(r || []);
            return (e(a, "_invoke", { value: G(A, t, i) }), a);
          }
          function s(A, n, t) {
            try {
              return { type: "normal", arg: A.call(n, t) };
            } catch (A) {
              return { type: "throw", arg: A };
            }
          }
          n.wrap = l;
          var g = "suspendedStart",
            p = "suspendedYield",
            b = "executing",
            w = "completed",
            m = {};
          function B() {}
          function E() {}
          function u() {}
          var y = {};
          d(y, a, function () {
            return this;
          });
          var f = Object.getPrototypeOf,
            h = f && f(f(z([])));
          h && h !== t && r.call(h, a) && (y = h);
          var v = (u.prototype = B.prototype = Object.create(y));
          function k(A) {
            ["next", "throw", "return"].forEach(function (n) {
              d(A, n, function (A) {
                return this._invoke(n, A);
              });
            });
          }
          function x(A, n) {
            function t(e, o, a, i) {
              var c = s(A[e], A, o);
              if ("throw" !== c.type) {
                var d = c.arg,
                  l = d.value;
                return l && "object" == Y(l) && r.call(l, "__await")
                  ? n.resolve(l.__await).then(
                      function (A) {
                        t("next", A, a, i);
                      },
                      function (A) {
                        t("throw", A, a, i);
                      },
                    )
                  : n.resolve(l).then(
                      function (A) {
                        ((d.value = A), a(d));
                      },
                      function (A) {
                        return t("throw", A, a, i);
                      },
                    );
              }
              i(c.arg);
            }
            var o;
            e(this, "_invoke", {
              value: function (A, r) {
                function e() {
                  return new n(function (n, e) {
                    t(A, r, n, e);
                  });
                }
                return (o = o ? o.then(e, e) : e());
              },
            });
          }
          function G(n, t, r) {
            var e = g;
            return function (o, a) {
              if (e === b) throw new Error("Generator is already running");
              if (e === w) {
                if ("throw" === o) throw a;
                return { value: A, done: !0 };
              }
              for (r.method = o, r.arg = a; ; ) {
                var i = r.delegate;
                if (i) {
                  var c = H(i, r);
                  if (c) {
                    if (c === m) continue;
                    return c;
                  }
                }
                if ("next" === r.method) r.sent = r._sent = r.arg;
                else if ("throw" === r.method) {
                  if (e === g) throw ((e = w), r.arg);
                  r.dispatchException(r.arg);
                } else "return" === r.method && r.abrupt("return", r.arg);
                e = b;
                var d = s(n, t, r);
                if ("normal" === d.type) {
                  if (((e = r.done ? w : p), d.arg === m)) continue;
                  return { value: d.arg, done: r.done };
                }
                "throw" === d.type &&
                  ((e = w), (r.method = "throw"), (r.arg = d.arg));
              }
            };
          }
          function H(n, t) {
            var r = t.method,
              e = n.iterator[r];
            if (e === A)
              return (
                (t.delegate = null),
                ("throw" === r &&
                  n.iterator.return &&
                  ((t.method = "return"),
                  (t.arg = A),
                  H(n, t),
                  "throw" === t.method)) ||
                  ("return" !== r &&
                    ((t.method = "throw"),
                    (t.arg = new TypeError(
                      "The iterator does not provide a '" + r + "' method",
                    )))),
                m
              );
            var o = s(e, n.iterator, t.arg);
            if ("throw" === o.type)
              return (
                (t.method = "throw"),
                (t.arg = o.arg),
                (t.delegate = null),
                m
              );
            var a = o.arg;
            return a
              ? a.done
                ? ((t[n.resultName] = a.value),
                  (t.next = n.nextLoc),
                  "return" !== t.method && ((t.method = "next"), (t.arg = A)),
                  (t.delegate = null),
                  m)
                : a
              : ((t.method = "throw"),
                (t.arg = new TypeError("iterator result is not an object")),
                (t.delegate = null),
                m);
          }
          function S(A) {
            var n = { tryLoc: A[0] };
            (1 in A && (n.catchLoc = A[1]),
              2 in A && ((n.finallyLoc = A[2]), (n.afterLoc = A[3])),
              this.tryEntries.push(n));
          }
          function C(A) {
            var n = A.completion || {};
            ((n.type = "normal"), delete n.arg, (A.completion = n));
          }
          function L(A) {
            ((this.tryEntries = [{ tryLoc: "root" }]),
              A.forEach(S, this),
              this.reset(!0));
          }
          function z(n) {
            if (n || "" === n) {
              var t = n[a];
              if (t) return t.call(n);
              if ("function" == typeof n.next) return n;
              if (!isNaN(n.length)) {
                var e = -1,
                  o = function t() {
                    for (; ++e < n.length; )
                      if (r.call(n, e))
                        return ((t.value = n[e]), (t.done = !1), t);
                    return ((t.value = A), (t.done = !0), t);
                  };
                return (o.next = o);
              }
            }
            throw new TypeError(Y(n) + " is not iterable");
          }
          return (
            (E.prototype = u),
            e(v, "constructor", { value: u, configurable: !0 }),
            e(u, "constructor", { value: E, configurable: !0 }),
            (E.displayName = d(u, c, "GeneratorFunction")),
            (n.isGeneratorFunction = function (A) {
              var n = "function" == typeof A && A.constructor;
              return (
                !!n &&
                (n === E || "GeneratorFunction" === (n.displayName || n.name))
              );
            }),
            (n.mark = function (A) {
              return (
                Object.setPrototypeOf
                  ? Object.setPrototypeOf(A, u)
                  : ((A.__proto__ = u), d(A, c, "GeneratorFunction")),
                (A.prototype = Object.create(v)),
                A
              );
            }),
            (n.awrap = function (A) {
              return { __await: A };
            }),
            k(x.prototype),
            d(x.prototype, i, function () {
              return this;
            }),
            (n.AsyncIterator = x),
            (n.async = function (A, t, r, e, o) {
              void 0 === o && (o = Promise);
              var a = new x(l(A, t, r, e), o);
              return n.isGeneratorFunction(t)
                ? a
                : a.next().then(function (A) {
                    return A.done ? A.value : a.next();
                  });
            }),
            k(v),
            d(v, c, "Generator"),
            d(v, a, function () {
              return this;
            }),
            d(v, "toString", function () {
              return "[object Generator]";
            }),
            (n.keys = function (A) {
              var n = Object(A),
                t = [];
              for (var r in n) t.push(r);
              return (
                t.reverse(),
                function A() {
                  for (; t.length; ) {
                    var r = t.pop();
                    if (r in n) return ((A.value = r), (A.done = !1), A);
                  }
                  return ((A.done = !0), A);
                }
              );
            }),
            (n.values = z),
            (L.prototype = {
              constructor: L,
              reset: function (n) {
                if (
                  ((this.prev = 0),
                  (this.next = 0),
                  (this.sent = this._sent = A),
                  (this.done = !1),
                  (this.delegate = null),
                  (this.method = "next"),
                  (this.arg = A),
                  this.tryEntries.forEach(C),
                  !n)
                )
                  for (var t in this)
                    "t" === t.charAt(0) &&
                      r.call(this, t) &&
                      !isNaN(+t.slice(1)) &&
                      (this[t] = A);
              },
              stop: function () {
                this.done = !0;
                var A = this.tryEntries[0].completion;
                if ("throw" === A.type) throw A.arg;
                return this.rval;
              },
              dispatchException: function (n) {
                if (this.done) throw n;
                var t = this;
                function e(r, e) {
                  return (
                    (i.type = "throw"),
                    (i.arg = n),
                    (t.next = r),
                    e && ((t.method = "next"), (t.arg = A)),
                    !!e
                  );
                }
                for (var o = this.tryEntries.length - 1; o >= 0; --o) {
                  var a = this.tryEntries[o],
                    i = a.completion;
                  if ("root" === a.tryLoc) return e("end");
                  if (a.tryLoc <= this.prev) {
                    var c = r.call(a, "catchLoc"),
                      d = r.call(a, "finallyLoc");
                    if (c && d) {
                      if (this.prev < a.catchLoc) return e(a.catchLoc, !0);
                      if (this.prev < a.finallyLoc) return e(a.finallyLoc);
                    } else if (c) {
                      if (this.prev < a.catchLoc) return e(a.catchLoc, !0);
                    } else {
                      if (!d)
                        throw new Error(
                          "try statement without catch or finally",
                        );
                      if (this.prev < a.finallyLoc) return e(a.finallyLoc);
                    }
                  }
                }
              },
              abrupt: function (A, n) {
                for (var t = this.tryEntries.length - 1; t >= 0; --t) {
                  var e = this.tryEntries[t];
                  if (
                    e.tryLoc <= this.prev &&
                    r.call(e, "finallyLoc") &&
                    this.prev < e.finallyLoc
                  ) {
                    var o = e;
                    break;
                  }
                }
                o &&
                  ("break" === A || "continue" === A) &&
                  o.tryLoc <= n &&
                  n <= o.finallyLoc &&
                  (o = null);
                var a = o ? o.completion : {};
                return (
                  (a.type = A),
                  (a.arg = n),
                  o
                    ? ((this.method = "next"), (this.next = o.finallyLoc), m)
                    : this.complete(a)
                );
              },
              complete: function (A, n) {
                if ("throw" === A.type) throw A.arg;
                return (
                  "break" === A.type || "continue" === A.type
                    ? (this.next = A.arg)
                    : "return" === A.type
                      ? ((this.rval = this.arg = A.arg),
                        (this.method = "return"),
                        (this.next = "end"))
                      : "normal" === A.type && n && (this.next = n),
                  m
                );
              },
              finish: function (A) {
                for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                  var t = this.tryEntries[n];
                  if (t.finallyLoc === A)
                    return (this.complete(t.completion, t.afterLoc), C(t), m);
                }
              },
              catch: function (A) {
                for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                  var t = this.tryEntries[n];
                  if (t.tryLoc === A) {
                    var r = t.completion;
                    if ("throw" === r.type) {
                      var e = r.arg;
                      C(t);
                    }
                    return e;
                  }
                }
                throw new Error("illegal catch attempt");
              },
              delegateYield: function (n, t, r) {
                return (
                  (this.delegate = {
                    iterator: z(n),
                    resultName: t,
                    nextLoc: r,
                  }),
                  "next" === this.method && (this.arg = A),
                  m
                );
              },
            }),
            n
          );
        }
        function R(A, n, t, r, e, o, a) {
          try {
            var i = A[o](a),
              c = i.value;
          } catch (A) {
            return void t(A);
          }
          i.done ? n(c) : Promise.resolve(c).then(r, e);
        }
        function W(A) {
          return function () {
            var n = this,
              t = arguments;
            return new Promise(function (r, e) {
              var o = A.apply(n, t);
              function a(A) {
                R(o, r, e, a, i, "next", A);
              }
              function i(A) {
                R(o, r, e, a, i, "throw", A);
              }
              a(void 0);
            });
          };
        }
        function J(A) {
          try {
            var n = new D.Ay(X.name.toLowerCase() + "_" + A);
            return (
              n
                .version(1)
                .stores({
                  Session:
                    "++id,UserId,StartedAt,EndedAt,Status,TabTitle,TabURL,MainDomain,FromLang,ToLang,IsSynced",
                  Segment:
                    "++id,SessionId,StartTime,EndTime,SourceText,TargetText,Starred",
                }),
              n
            );
          } catch (A) {
            throw A;
          }
        }
        function $(A, n) {
          return K.apply(this, arguments);
        }
        function K() {
          return (K = W(
            q().mark(function A(n, t) {
              return q().wrap(
                function (A) {
                  for (;;)
                    switch ((A.prev = A.next)) {
                      case 0:
                        return (
                          (A.prev = 0),
                          (A.next = 3),
                          n.Segment.where("SessionId").equals(t).toArray()
                        );
                      case 3:
                        return A.abrupt("return", A.sent);
                      case 6:
                        throw ((A.prev = 6), (A.t0 = A.catch(0)), A.t0);
                      case 10:
                      case "end":
                        return A.stop();
                    }
                },
                A,
                null,
                [[0, 6]],
              );
            }),
          )).apply(this, arguments);
        }
        function Q(A, n, t, r) {
          return V.apply(this, arguments);
        }
        function V() {
          return (V = W(
            q().mark(function A(n, t, r, e) {
              return q().wrap(
                function (A) {
                  for (;;)
                    switch ((A.prev = A.next)) {
                      case 0:
                        return ((A.prev = 0), (A.next = 3), n[t].update(r, e));
                      case 3:
                        return A.abrupt("return", A.sent);
                      case 6:
                        throw ((A.prev = 6), (A.t0 = A.catch(0)), A.t0);
                      case 10:
                      case "end":
                        return A.stop();
                    }
                },
                A,
                null,
                [[0, 6]],
              );
            }),
          )).apply(this, arguments);
        }
        function Z(A, n, t) {
          return AA.apply(this, arguments);
        }
        function AA() {
          return (AA = W(
            q().mark(function A(n, t, r) {
              return q().wrap(
                function (A) {
                  for (;;)
                    switch ((A.prev = A.next)) {
                      case 0:
                        return ((A.prev = 0), (A.next = 3), n[t].delete(r));
                      case 3:
                        return A.abrupt("return", A.sent);
                      case 6:
                        throw ((A.prev = 6), (A.t0 = A.catch(0)), A.t0);
                      case 10:
                      case "end":
                        return A.stop();
                    }
                },
                A,
                null,
                [[0, 6]],
              );
            }),
          )).apply(this, arguments);
        }
        function nA(A, n) {
          return tA.apply(this, arguments);
        }
        function tA() {
          return (tA = W(
            q().mark(function A(n, t) {
              return q().wrap(
                function (A) {
                  for (;;)
                    switch ((A.prev = A.next)) {
                      case 0:
                        return ((A.prev = 0), (A.next = 3), n[t].clear());
                      case 3:
                        A.next = 10;
                        break;
                      case 6:
                        throw ((A.prev = 6), (A.t0 = A.catch(0)), A.t0);
                      case 10:
                      case "end":
                        return A.stop();
                    }
                },
                A,
                null,
                [[0, 6]],
              );
            }),
          )).apply(this, arguments);
        }
        function rA(A, n) {
          return eA.apply(this, arguments);
        }
        function eA() {
          return (eA = W(
            q().mark(function A(n, t) {
              return q().wrap(
                function (A) {
                  for (;;)
                    switch ((A.prev = A.next)) {
                      case 0:
                        return (
                          (A.prev = 0),
                          (A.next = 3),
                          n.Segment.where("SessionId").equals(t).delete()
                        );
                      case 3:
                        A.next = 10;
                        break;
                      case 6:
                        throw ((A.prev = 6), (A.t0 = A.catch(0)), A.t0);
                      case 10:
                      case "end":
                        return A.stop();
                    }
                },
                A,
                null,
                [[0, 6]],
              );
            }),
          )).apply(this, arguments);
        }
        function oA(A, n) {
          return aA.apply(this, arguments);
        }
        function aA() {
          return (aA = W(
            q().mark(function A(n, t) {
              return q().wrap(
                function (A) {
                  for (;;)
                    switch ((A.prev = A.next)) {
                      case 0:
                        return ((A.prev = 0), (A.next = 3), n[t].toArray());
                      case 3:
                        return A.abrupt("return", A.sent);
                      case 6:
                        throw ((A.prev = 6), (A.t0 = A.catch(0)), A.t0);
                      case 10:
                      case "end":
                        return A.stop();
                    }
                },
                A,
                null,
                [[0, 6]],
              );
            }),
          )).apply(this, arguments);
        }
        function iA(A) {
          return (
            (iA =
              "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                ? function (A) {
                    return typeof A;
                  }
                : function (A) {
                    return A &&
                      "function" == typeof Symbol &&
                      A.constructor === Symbol &&
                      A !== Symbol.prototype
                      ? "symbol"
                      : typeof A;
                  }),
            iA(A)
          );
        }
        function cA() {
          cA = function () {
            return n;
          };
          var A,
            n = {},
            t = Object.prototype,
            r = t.hasOwnProperty,
            e =
              Object.defineProperty ||
              function (A, n, t) {
                A[n] = t.value;
              },
            o = "function" == typeof Symbol ? Symbol : {},
            a = o.iterator || "@@iterator",
            i = o.asyncIterator || "@@asyncIterator",
            c = o.toStringTag || "@@toStringTag";
          function d(A, n, t) {
            return (
              Object.defineProperty(A, n, {
                value: t,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              }),
              A[n]
            );
          }
          try {
            d({}, "");
          } catch (A) {
            d = function (A, n, t) {
              return (A[n] = t);
            };
          }
          function l(A, n, t, r) {
            var o = n && n.prototype instanceof B ? n : B,
              a = Object.create(o.prototype),
              i = new L(r || []);
            return (e(a, "_invoke", { value: G(A, t, i) }), a);
          }
          function s(A, n, t) {
            try {
              return { type: "normal", arg: A.call(n, t) };
            } catch (A) {
              return { type: "throw", arg: A };
            }
          }
          n.wrap = l;
          var g = "suspendedStart",
            p = "suspendedYield",
            b = "executing",
            w = "completed",
            m = {};
          function B() {}
          function E() {}
          function u() {}
          var y = {};
          d(y, a, function () {
            return this;
          });
          var f = Object.getPrototypeOf,
            h = f && f(f(z([])));
          h && h !== t && r.call(h, a) && (y = h);
          var v = (u.prototype = B.prototype = Object.create(y));
          function k(A) {
            ["next", "throw", "return"].forEach(function (n) {
              d(A, n, function (A) {
                return this._invoke(n, A);
              });
            });
          }
          function x(A, n) {
            function t(e, o, a, i) {
              var c = s(A[e], A, o);
              if ("throw" !== c.type) {
                var d = c.arg,
                  l = d.value;
                return l && "object" == iA(l) && r.call(l, "__await")
                  ? n.resolve(l.__await).then(
                      function (A) {
                        t("next", A, a, i);
                      },
                      function (A) {
                        t("throw", A, a, i);
                      },
                    )
                  : n.resolve(l).then(
                      function (A) {
                        ((d.value = A), a(d));
                      },
                      function (A) {
                        return t("throw", A, a, i);
                      },
                    );
              }
              i(c.arg);
            }
            var o;
            e(this, "_invoke", {
              value: function (A, r) {
                function e() {
                  return new n(function (n, e) {
                    t(A, r, n, e);
                  });
                }
                return (o = o ? o.then(e, e) : e());
              },
            });
          }
          function G(n, t, r) {
            var e = g;
            return function (o, a) {
              if (e === b) throw new Error("Generator is already running");
              if (e === w) {
                if ("throw" === o) throw a;
                return { value: A, done: !0 };
              }
              for (r.method = o, r.arg = a; ; ) {
                var i = r.delegate;
                if (i) {
                  var c = H(i, r);
                  if (c) {
                    if (c === m) continue;
                    return c;
                  }
                }
                if ("next" === r.method) r.sent = r._sent = r.arg;
                else if ("throw" === r.method) {
                  if (e === g) throw ((e = w), r.arg);
                  r.dispatchException(r.arg);
                } else "return" === r.method && r.abrupt("return", r.arg);
                e = b;
                var d = s(n, t, r);
                if ("normal" === d.type) {
                  if (((e = r.done ? w : p), d.arg === m)) continue;
                  return { value: d.arg, done: r.done };
                }
                "throw" === d.type &&
                  ((e = w), (r.method = "throw"), (r.arg = d.arg));
              }
            };
          }
          function H(n, t) {
            var r = t.method,
              e = n.iterator[r];
            if (e === A)
              return (
                (t.delegate = null),
                ("throw" === r &&
                  n.iterator.return &&
                  ((t.method = "return"),
                  (t.arg = A),
                  H(n, t),
                  "throw" === t.method)) ||
                  ("return" !== r &&
                    ((t.method = "throw"),
                    (t.arg = new TypeError(
                      "The iterator does not provide a '" + r + "' method",
                    )))),
                m
              );
            var o = s(e, n.iterator, t.arg);
            if ("throw" === o.type)
              return (
                (t.method = "throw"),
                (t.arg = o.arg),
                (t.delegate = null),
                m
              );
            var a = o.arg;
            return a
              ? a.done
                ? ((t[n.resultName] = a.value),
                  (t.next = n.nextLoc),
                  "return" !== t.method && ((t.method = "next"), (t.arg = A)),
                  (t.delegate = null),
                  m)
                : a
              : ((t.method = "throw"),
                (t.arg = new TypeError("iterator result is not an object")),
                (t.delegate = null),
                m);
          }
          function S(A) {
            var n = { tryLoc: A[0] };
            (1 in A && (n.catchLoc = A[1]),
              2 in A && ((n.finallyLoc = A[2]), (n.afterLoc = A[3])),
              this.tryEntries.push(n));
          }
          function C(A) {
            var n = A.completion || {};
            ((n.type = "normal"), delete n.arg, (A.completion = n));
          }
          function L(A) {
            ((this.tryEntries = [{ tryLoc: "root" }]),
              A.forEach(S, this),
              this.reset(!0));
          }
          function z(n) {
            if (n || "" === n) {
              var t = n[a];
              if (t) return t.call(n);
              if ("function" == typeof n.next) return n;
              if (!isNaN(n.length)) {
                var e = -1,
                  o = function t() {
                    for (; ++e < n.length; )
                      if (r.call(n, e))
                        return ((t.value = n[e]), (t.done = !1), t);
                    return ((t.value = A), (t.done = !0), t);
                  };
                return (o.next = o);
              }
            }
            throw new TypeError(iA(n) + " is not iterable");
          }
          return (
            (E.prototype = u),
            e(v, "constructor", { value: u, configurable: !0 }),
            e(u, "constructor", { value: E, configurable: !0 }),
            (E.displayName = d(u, c, "GeneratorFunction")),
            (n.isGeneratorFunction = function (A) {
              var n = "function" == typeof A && A.constructor;
              return (
                !!n &&
                (n === E || "GeneratorFunction" === (n.displayName || n.name))
              );
            }),
            (n.mark = function (A) {
              return (
                Object.setPrototypeOf
                  ? Object.setPrototypeOf(A, u)
                  : ((A.__proto__ = u), d(A, c, "GeneratorFunction")),
                (A.prototype = Object.create(v)),
                A
              );
            }),
            (n.awrap = function (A) {
              return { __await: A };
            }),
            k(x.prototype),
            d(x.prototype, i, function () {
              return this;
            }),
            (n.AsyncIterator = x),
            (n.async = function (A, t, r, e, o) {
              void 0 === o && (o = Promise);
              var a = new x(l(A, t, r, e), o);
              return n.isGeneratorFunction(t)
                ? a
                : a.next().then(function (A) {
                    return A.done ? A.value : a.next();
                  });
            }),
            k(v),
            d(v, c, "Generator"),
            d(v, a, function () {
              return this;
            }),
            d(v, "toString", function () {
              return "[object Generator]";
            }),
            (n.keys = function (A) {
              var n = Object(A),
                t = [];
              for (var r in n) t.push(r);
              return (
                t.reverse(),
                function A() {
                  for (; t.length; ) {
                    var r = t.pop();
                    if (r in n) return ((A.value = r), (A.done = !1), A);
                  }
                  return ((A.done = !0), A);
                }
              );
            }),
            (n.values = z),
            (L.prototype = {
              constructor: L,
              reset: function (n) {
                if (
                  ((this.prev = 0),
                  (this.next = 0),
                  (this.sent = this._sent = A),
                  (this.done = !1),
                  (this.delegate = null),
                  (this.method = "next"),
                  (this.arg = A),
                  this.tryEntries.forEach(C),
                  !n)
                )
                  for (var t in this)
                    "t" === t.charAt(0) &&
                      r.call(this, t) &&
                      !isNaN(+t.slice(1)) &&
                      (this[t] = A);
              },
              stop: function () {
                this.done = !0;
                var A = this.tryEntries[0].completion;
                if ("throw" === A.type) throw A.arg;
                return this.rval;
              },
              dispatchException: function (n) {
                if (this.done) throw n;
                var t = this;
                function e(r, e) {
                  return (
                    (i.type = "throw"),
                    (i.arg = n),
                    (t.next = r),
                    e && ((t.method = "next"), (t.arg = A)),
                    !!e
                  );
                }
                for (var o = this.tryEntries.length - 1; o >= 0; --o) {
                  var a = this.tryEntries[o],
                    i = a.completion;
                  if ("root" === a.tryLoc) return e("end");
                  if (a.tryLoc <= this.prev) {
                    var c = r.call(a, "catchLoc"),
                      d = r.call(a, "finallyLoc");
                    if (c && d) {
                      if (this.prev < a.catchLoc) return e(a.catchLoc, !0);
                      if (this.prev < a.finallyLoc) return e(a.finallyLoc);
                    } else if (c) {
                      if (this.prev < a.catchLoc) return e(a.catchLoc, !0);
                    } else {
                      if (!d)
                        throw new Error(
                          "try statement without catch or finally",
                        );
                      if (this.prev < a.finallyLoc) return e(a.finallyLoc);
                    }
                  }
                }
              },
              abrupt: function (A, n) {
                for (var t = this.tryEntries.length - 1; t >= 0; --t) {
                  var e = this.tryEntries[t];
                  if (
                    e.tryLoc <= this.prev &&
                    r.call(e, "finallyLoc") &&
                    this.prev < e.finallyLoc
                  ) {
                    var o = e;
                    break;
                  }
                }
                o &&
                  ("break" === A || "continue" === A) &&
                  o.tryLoc <= n &&
                  n <= o.finallyLoc &&
                  (o = null);
                var a = o ? o.completion : {};
                return (
                  (a.type = A),
                  (a.arg = n),
                  o
                    ? ((this.method = "next"), (this.next = o.finallyLoc), m)
                    : this.complete(a)
                );
              },
              complete: function (A, n) {
                if ("throw" === A.type) throw A.arg;
                return (
                  "break" === A.type || "continue" === A.type
                    ? (this.next = A.arg)
                    : "return" === A.type
                      ? ((this.rval = this.arg = A.arg),
                        (this.method = "return"),
                        (this.next = "end"))
                      : "normal" === A.type && n && (this.next = n),
                  m
                );
              },
              finish: function (A) {
                for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                  var t = this.tryEntries[n];
                  if (t.finallyLoc === A)
                    return (this.complete(t.completion, t.afterLoc), C(t), m);
                }
              },
              catch: function (A) {
                for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                  var t = this.tryEntries[n];
                  if (t.tryLoc === A) {
                    var r = t.completion;
                    if ("throw" === r.type) {
                      var e = r.arg;
                      C(t);
                    }
                    return e;
                  }
                }
                throw new Error("illegal catch attempt");
              },
              delegateYield: function (n, t, r) {
                return (
                  (this.delegate = {
                    iterator: z(n),
                    resultName: t,
                    nextLoc: r,
                  }),
                  "next" === this.method && (this.arg = A),
                  m
                );
              },
            }),
            n
          );
        }
        function dA(A, n) {
          var t = Object.keys(A);
          if (Object.getOwnPropertySymbols) {
            var r = Object.getOwnPropertySymbols(A);
            (n &&
              (r = r.filter(function (n) {
                return Object.getOwnPropertyDescriptor(A, n).enumerable;
              })),
              t.push.apply(t, r));
          }
          return t;
        }
        function lA(A) {
          for (var n = 1; n < arguments.length; n++) {
            var t = null != arguments[n] ? arguments[n] : {};
            n % 2
              ? dA(Object(t), !0).forEach(function (n) {
                  sA(A, n, t[n]);
                })
              : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    A,
                    Object.getOwnPropertyDescriptors(t),
                  )
                : dA(Object(t)).forEach(function (n) {
                    Object.defineProperty(
                      A,
                      n,
                      Object.getOwnPropertyDescriptor(t, n),
                    );
                  });
          }
          return A;
        }
        function sA(A, n, t) {
          var r;
          return (
            (r = (function (A, n) {
              if ("object" != iA(A) || !A) return A;
              var t = A[Symbol.toPrimitive];
              if (void 0 !== t) {
                var r = t.call(A, n || "default");
                if ("object" != iA(r)) return r;
                throw new TypeError(
                  "@@toPrimitive must return a primitive value.",
                );
              }
              return ("string" === n ? String : Number)(A);
            })(n, "string")),
            (n = "symbol" == iA(r) ? r : String(r)) in A
              ? Object.defineProperty(A, n, {
                  value: t,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                })
              : (A[n] = t),
            A
          );
        }
        function gA(A, n, t, r, e, o, a) {
          try {
            var i = A[o](a),
              c = i.value;
          } catch (A) {
            return void t(A);
          }
          i.done ? n(c) : Promise.resolve(c).then(r, e);
        }
        function pA(A) {
          return function () {
            var n = this,
              t = arguments;
            return new Promise(function (r, e) {
              var o = A.apply(n, t);
              function a(A) {
                gA(o, r, e, a, i, "next", A);
              }
              function i(A) {
                gA(o, r, e, a, i, "throw", A);
              }
              a(void 0);
            });
          };
        }
        function bA(A, n) {
          return (
            (function (A) {
              if (Array.isArray(A)) return A;
            })(A) ||
            (function (A, n) {
              var t =
                null == A
                  ? null
                  : ("undefined" != typeof Symbol && A[Symbol.iterator]) ||
                    A["@@iterator"];
              if (null != t) {
                var r,
                  e,
                  o,
                  a,
                  i = [],
                  c = !0,
                  d = !1;
                try {
                  if (((o = (t = t.call(A)).next), 0 === n)) {
                    if (Object(t) !== t) return;
                    c = !1;
                  } else
                    for (
                      ;
                      !(c = (r = o.call(t)).done) &&
                      (i.push(r.value), i.length !== n);
                      c = !0
                    );
                } catch (A) {
                  ((d = !0), (e = A));
                } finally {
                  try {
                    if (
                      !c &&
                      null != t.return &&
                      ((a = t.return()), Object(a) !== a)
                    )
                      return;
                  } finally {
                    if (d) throw e;
                  }
                }
                return i;
              }
            })(A, n) ||
            (function (A, n) {
              if (!A) return;
              if ("string" == typeof A) return wA(A, n);
              var t = Object.prototype.toString.call(A).slice(8, -1);
              "Object" === t && A.constructor && (t = A.constructor.name);
              if ("Map" === t || "Set" === t) return Array.from(A);
              if (
                "Arguments" === t ||
                /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
              )
                return wA(A, n);
            })(A, n) ||
            (function () {
              throw new TypeError(
                "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
              );
            })()
          );
        }
        function wA(A, n) {
          (null == n || n > A.length) && (n = A.length);
          for (var t = 0, r = new Array(n); t < n; t++) r[t] = A[t];
          return r;
        }
        const mA = function () {
          var A = g().t,
            n = bA((0, r.useState)([]), 2),
            t = n[0],
            e = n[1],
            o = bA((0, r.useState)(null), 2),
            a = o[0],
            i = o[1],
            c = bA((0, r.useState)(!0), 2),
            d = c[0],
            l = c[1],
            s = bA((0, r.useState)(""), 2),
            p = s[0],
            b = s[1],
            w = bA((0, r.useState)(null), 2),
            m = w[0],
            B = w[1],
            E = bA((0, r.useState)({ open: !1, type: null, id: null }), 2),
            u = E[0],
            y = E[1],
            f = (0, r.useRef)(null),
            v = function (n) {
              return {
                id: n.id,
                userId: n.UserId,
                startedAt: n.StartedAt,
                endedAt: n.EndedAt,
                status: n.Status,
                tabTitle: n.TabTitle || A("history.untitledSession"),
                tabUrl: n.TabURL,
                mainDomain: n.MainDomain,
                fromLang: n.FromLang,
                toLang: n.ToLang,
                segments: n.Segments || [],
                isSynced: n.IsSynced,
              };
            },
            k = function (A) {
              var n =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : 0;
              return A.map(function (A) {
                return {
                  id: A.id,
                  sessionId: A.SessionId,
                  startTime: n ? Math.max(0, A.StartTime - n) : A.StartTime,
                  endTime: A.EndTime,
                  sourceText: A.SourceText,
                  targetText: A.TargetText,
                  starred: !!A.Starred,
                };
              }).sort(function (A, n) {
                return A.startTime - n.startTime;
              });
            },
            x = (0, r.useCallback)(
              (function () {
                var A = pA(
                  cA().mark(function A(n) {
                    var t,
                      r,
                      o,
                      a,
                      i = arguments;
                    return cA().wrap(
                      function (A) {
                        for (;;)
                          switch ((A.prev = A.next)) {
                            case 0:
                              if (
                                ((t =
                                  i.length > 1 && void 0 !== i[1] ? i[1] : 0),
                                (A.prev = 1),
                                (r = f.current) && n)
                              ) {
                                A.next = 5;
                                break;
                              }
                              return A.abrupt("return");
                            case 5:
                              return ((A.next = 7), $(r, n));
                            case 7:
                              ((o = A.sent),
                                (a = k(o, t)),
                                e(function (A) {
                                  return A.map(function (A) {
                                    return A.id === n
                                      ? lA(lA({}, A), {}, { segments: a })
                                      : A;
                                  });
                                }),
                                (A.next = 15));
                              break;
                            case 12:
                              ((A.prev = 12), (A.t0 = A.catch(1)));
                            case 15:
                            case "end":
                              return A.stop();
                          }
                      },
                      A,
                      null,
                      [[1, 12]],
                    );
                  }),
                );
                return function (n) {
                  return A.apply(this, arguments);
                };
              })(),
              [],
            );
          ((0, r.useEffect)(function () {
            var n = !0,
              t = (function () {
                var t = pA(
                  cA().mark(function t() {
                    var r, o, a, c, d, s;
                    return cA().wrap(
                      function (t) {
                        for (;;)
                          switch ((t.prev = t.next)) {
                            case 0:
                              return (
                                (t.prev = 0),
                                l(!0),
                                (t.next = 4),
                                new Promise(function (A, n) {
                                  try {
                                    chrome.runtime.sendMessage(
                                      { type: "getUserInfo" },
                                      function (t) {
                                        chrome.runtime.lastError
                                          ? n(chrome.runtime.lastError)
                                          : A(
                                              (null == t
                                                ? void 0
                                                : t.userInfo) || {},
                                            );
                                      },
                                    );
                                  } catch (A) {
                                    n(A);
                                  }
                                })
                              );
                            case 4:
                              if (
                                ((a = t.sent),
                                (c =
                                  (null == a ? void 0 : a.uid) ||
                                  (null == a ? void 0 : a.id) ||
                                  (null == a ? void 0 : a.userId)))
                              ) {
                                t.next = 8;
                                break;
                              }
                              throw new Error(A("history.notSignedIn"));
                            case 8:
                              return (
                                (f.current = J(c)),
                                (t.next = 11),
                                oA(f.current, "Session")
                              );
                            case 11:
                              if (
                                ((d = t.sent),
                                (s = d.map(v).sort(function (A, n) {
                                  return n.startedAt - A.startedAt;
                                })),
                                n)
                              ) {
                                t.next = 15;
                                break;
                              }
                              return t.abrupt("return");
                            case 15:
                              (e(s),
                                i(
                                  (null === (r = s[0]) || void 0 === r
                                    ? void 0
                                    : r.id) || null,
                                ),
                                null !== (o = s[0]) &&
                                  void 0 !== o &&
                                  o.id &&
                                  x(s[0].id, s[0].startedAt || 0),
                                (t.next = 24));
                              break;
                            case 20:
                              ((t.prev = 20),
                                (t.t0 = t.catch(0)),
                                n &&
                                  b(
                                    (null === t.t0 || void 0 === t.t0
                                      ? void 0
                                      : t.t0.message) ||
                                      "Failed to load history data.",
                                  ));
                            case 24:
                              return ((t.prev = 24), n && l(!1), t.finish(24));
                            case 27:
                            case "end":
                              return t.stop();
                          }
                      },
                      t,
                      null,
                      [[0, 20, 24, 27]],
                    );
                  }),
                );
                return function () {
                  return t.apply(this, arguments);
                };
              })();
            return (
              t(),
              function () {
                n = !1;
              }
            );
          }, []),
            (0, r.useEffect)(
              function () {
                var A = t.find(function (A) {
                  return A.id === a;
                });
                !A ||
                  (A.segments && 0 !== A.segments.length) ||
                  x(a, A.startedAt || 0);
              },
              [a, t, x],
            ),
            (0, r.useEffect)(
              function () {
                if (m) {
                  var A = setTimeout(function () {
                    return B(null);
                  }, 2e3);
                  return function () {
                    return clearTimeout(A);
                  };
                }
              },
              [m],
            ));
          var G = t.find(function (A) {
              return A.id === a;
            }),
            H = (0, r.useCallback)(
              (function () {
                var n = pA(
                  cA().mark(function n(r) {
                    var o, c;
                    return cA().wrap(
                      function (n) {
                        for (;;)
                          switch ((n.prev = n.next)) {
                            case 0:
                              if (
                                ((n.prev = 0),
                                "ongoing" !==
                                  (null ==
                                  (o = t.find(function (A) {
                                    return A.id === r;
                                  }))
                                    ? void 0
                                    : o.status))
                              ) {
                                n.next = 6;
                                break;
                              }
                              return (
                                B({
                                  text: A("history.cannotDeleteRunning"),
                                  type: "error",
                                }),
                                y({ open: !1, type: null, id: null }),
                                n.abrupt("return")
                              );
                            case 6:
                              if (!(c = f.current)) {
                                n.next = 12;
                                break;
                              }
                              return ((n.next = 10), rA(c, r));
                            case 10:
                              return ((n.next = 12), Z(c, "Session", r));
                            case 12:
                              (e(function (A) {
                                var n = A.filter(function (A) {
                                  return A.id !== r;
                                });
                                return (
                                  a === r && i(n.length > 0 ? n[0].id : null),
                                  n
                                );
                              }),
                                B({
                                  text: A("history.sessionDeleted"),
                                  type: "success",
                                }),
                                (n.next = 20));
                              break;
                            case 16:
                              ((n.prev = 16),
                                (n.t0 = n.catch(0)),
                                B({
                                  text: A("history.failedToDelete"),
                                  type: "error",
                                }));
                            case 20:
                              return (
                                (n.prev = 20),
                                y({ open: !1, type: null, id: null }),
                                n.finish(20)
                              );
                            case 23:
                            case "end":
                              return n.stop();
                          }
                      },
                      n,
                      null,
                      [[0, 16, 20, 23]],
                    );
                  }),
                );
                return function (A) {
                  return n.apply(this, arguments);
                };
              })(),
              [a, t],
            ),
            S =
              ((0, r.useCallback)(
                function () {
                  t.some(function (A) {
                    return "ongoing" === A.status;
                  })
                    ? B({
                        text: A("history.cannotClearRunning"),
                        type: "error",
                      })
                    : y({ open: !0, type: "clearAll", id: null });
                },
                [t],
              ),
              (0, r.useCallback)(
                function (A) {
                  a &&
                    e(function (n) {
                      return n.map(function (n) {
                        return n.id === a
                          ? lA(lA({}, n), {}, { tabTitle: A })
                          : n;
                      });
                    });
                },
                [a],
              )),
            C = (0, r.useCallback)(
              function (A) {
                a &&
                  (e(function (n) {
                    return n.map(function (n) {
                      return n.id !== a
                        ? n
                        : lA(
                            lA({}, n),
                            {},
                            {
                              segments: n.segments.map(function (n) {
                                return n.id === A
                                  ? lA(lA({}, n), {}, { starred: !n.starred })
                                  : n;
                              }),
                            },
                          );
                    });
                  }),
                  pA(
                    cA().mark(function n() {
                      var r, e, o, i;
                      return cA().wrap(
                        function (n) {
                          for (;;)
                            switch ((n.prev = n.next)) {
                              case 0:
                                if (
                                  ((n.prev = 0),
                                  (r = f.current),
                                  (e = t.find(function (A) {
                                    return A.id === a;
                                  })),
                                  r && e)
                                ) {
                                  n.next = 5;
                                  break;
                                }
                                return n.abrupt("return");
                              case 5:
                                return (
                                  (o = e.segments.find(function (n) {
                                    return n.id === A;
                                  })),
                                  (i = !o || !o.starred),
                                  (n.next = 9),
                                  Q(r, "Segment", A, { Starred: i })
                                );
                              case 9:
                                n.next = 15;
                                break;
                              case 11:
                                ((n.prev = 11),
                                  (n.t0 = n.catch(0)),
                                  B({
                                    text: "Failed to update star",
                                    type: "error",
                                  }));
                              case 15:
                              case "end":
                                return n.stop();
                            }
                        },
                        n,
                        null,
                        [[0, 11]],
                      );
                    }),
                  )());
              },
              [a, t],
            );
          return r.createElement(
            "div",
            {
              className:
                "flex flex-col h-screen w-full bg-slate-50 text-slate-900 font-sans",
            },
            m &&
              r.createElement(
                "div",
                {
                  className:
                    "fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-sm text-white z-50 transition-all ".concat(
                      "error" === m.type ? "bg-red-500" : "bg-emerald-500",
                    ),
                },
                m.text,
              ),
            r.createElement(N, {
              isOpen: u.open,
              title: A("common.confirm"),
              message:
                "clearAll" === u.type
                  ? A("history.clearAllTitle")
                  : A("history.deleteSessionTitle"),
              onCancel: function () {
                return y({ open: !1, type: null, id: null });
              },
              onConfirm: function () {
                "clearAll" === u.type
                  ? pA(
                      cA().mark(function n() {
                        var t;
                        return cA().wrap(
                          function (n) {
                            for (;;)
                              switch ((n.prev = n.next)) {
                                case 0:
                                  if (((n.prev = 0), !(t = f.current))) {
                                    n.next = 7;
                                    break;
                                  }
                                  return ((n.next = 5), nA(t, "Segment"));
                                case 5:
                                  return ((n.next = 7), nA(t, "Session"));
                                case 7:
                                  (e([]),
                                    i(null),
                                    B({
                                      text: A("history.historyCleared"),
                                      type: "success",
                                    }),
                                    (n.next = 15));
                                  break;
                                case 12:
                                  ((n.prev = 12),
                                    (n.t0 = n.catch(0)),
                                    B({
                                      text: A("history.failedToClear"),
                                      type: "error",
                                    }));
                                case 15:
                                  return (
                                    (n.prev = 15),
                                    y({ open: !1, type: null, id: null }),
                                    n.finish(15)
                                  );
                                case 18:
                                case "end":
                                  return n.stop();
                              }
                          },
                          n,
                          null,
                          [[0, 12, 15, 18]],
                        );
                      }),
                    )()
                  : "delete" === u.type && u.id && H(u.id);
              },
            }),
            d &&
              r.createElement(
                "div",
                {
                  className:
                    "flex-1 flex items-center justify-center text-slate-400",
                },
                A("history.loading"),
              ),
            !d &&
              p &&
              r.createElement(
                "div",
                {
                  className:
                    "flex-1 flex items-center justify-center text-red-500 px-4 text-center",
                },
                p,
              ),
            !d &&
              !p &&
              r.createElement(
                r.Fragment,
                null,
                r.createElement(
                  "div",
                  {
                    className:
                      "h-12 bg-indigo-500 text-white flex items-center px-4 flex-shrink-0 shadow-md z-30",
                  },
                  r.createElement(
                    "div",
                    { className: "flex items-center gap-2 font-bold text-lg" },
                    r.createElement("img", {
                      src: chrome.runtime.getURL("imgs/icon128.png"),
                      alt: "DubTab",
                      className: "w-6 h-6",
                    }),
                    r.createElement("span", null, "DubTab"),
                    r.createElement(
                      "span",
                      {
                        className:
                          "bg-indigo-400 px-2 py-0.5 rounded text-xs font-normal text-indigo-50 ml-2",
                      },
                      A("history.title"),
                    ),
                  ),
                  r.createElement(
                    "div",
                    { className: "ml-auto text-xs text-indigo-100" },
                    A("history.reviewSessions"),
                  ),
                ),
                r.createElement(
                  "div",
                  { className: "flex-1 flex overflow-hidden" },
                  r.createElement(h, {
                    sessions: t,
                    selectedSessionId: a,
                    onSelectSession: i,
                    onDeleteSession: function (A) {
                      return y({ open: !0, type: "delete", id: A });
                    },
                    onClearAll: function () {
                      return y({ open: !0, type: "clearAll", id: null });
                    },
                    t: A,
                  }),
                  G
                    ? r.createElement(O, {
                        session: G,
                        onUpdateTitle: S,
                        onDeleteSession: function () {
                          return y({ open: !0, type: "delete", id: a });
                        },
                        onToggleStar: C,
                        onToast: B,
                        t: A,
                      })
                    : r.createElement(
                        "div",
                        {
                          className:
                            "flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50 px-8",
                        },
                        r.createElement("img", {
                          src: chrome.runtime.getURL("imgs/icon128.png"),
                          alt: "DubTab",
                          className: "w-12 h-12 mb-4 opacity-30",
                        }),
                        r.createElement(
                          "p",
                          { className: "text-lg font-medium" },
                          A("history.noSessionSelected"),
                        ),
                        r.createElement(
                          "p",
                          { className: "text-sm mb-6" },
                          A("history.selectSession"),
                        ),
                      ),
                ),
              ),
          );
        };
        var BA = t(5072),
          EA = t.n(BA),
          uA = t(7825),
          yA = t.n(uA),
          fA = t(7659),
          hA = t.n(fA),
          vA = t(5056),
          kA = t.n(vA),
          xA = t(540),
          GA = t.n(xA),
          HA = t(1113),
          SA = t.n(HA),
          CA = t(5305),
          LA = {};
        ((LA.styleTagTransform = SA()),
          (LA.setAttributes = kA()),
          (LA.insert = hA().bind(null, "head")),
          (LA.domAPI = yA()),
          (LA.insertStyleElement = GA()));
        EA()(CA.A, LA);
        CA.A && CA.A.locals && CA.A.locals;
        var zA = document.getElementById("root");
        if (!zA) throw new Error("Could not find root element to mount to");
        e.createRoot(zA).render(
          r.createElement(r.StrictMode, null, r.createElement(mA, null)),
        );
      },
      5305: (A, n, t) => {
        t.d(n, { A: () => k });
        var r = t(2977),
          e = t.n(r),
          o = t(9655),
          a = t.n(o),
          i = t(1038),
          c = t.n(i),
          d = new URL(t(960), t.b),
          l = new URL(t(2031), t.b),
          s = new URL(t(5270), t.b),
          g = new URL(t(3569), t.b),
          p = new URL(t(2208), t.b),
          b = new URL(t(220), t.b),
          w = new URL(t(6749), t.b),
          m = a()(e()),
          B = c()(d),
          E = c()(l),
          u = c()(s),
          y = c()(g),
          f = c()(p),
          h = c()(b),
          v = c()(w);
        m.push([
          A.id,
          `/*\n! tailwindcss v3.4.1 | MIT License | https://tailwindcss.com\n*//*\n1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)\n2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)\n*/\n\n*,\n::before,\n::after {\n  box-sizing: border-box; /* 1 */\n  border-width: 0; /* 2 */\n  border-style: solid; /* 2 */\n  border-color: #E5E7EB; /* 2 */\n}\n\n::before,\n::after {\n  --tw-content: '';\n}\n\n/*\n1. Use a consistent sensible line-height in all browsers.\n2. Prevent adjustments of font size after orientation changes in iOS.\n3. Use a more readable tab size.\n4. Use the user's configured \`sans\` font-family by default.\n5. Use the user's configured \`sans\` font-feature-settings by default.\n6. Use the user's configured \`sans\` font-variation-settings by default.\n7. Disable tap highlights on iOS\n*/\n\nhtml,\n:host {\n  line-height: 1.5; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n  -moz-tab-size: 4; /* 3 */\n  -o-tab-size: 4;\n     tab-size: 4; /* 3 */\n  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; /* 4 */\n  font-feature-settings: normal; /* 5 */\n  font-variation-settings: normal; /* 6 */\n  -webkit-tap-highlight-color: transparent; /* 7 */\n}\n\n/*\n1. Remove the margin in all browsers.\n2. Inherit line-height from \`html\` so users can set them as a class directly on the \`html\` element.\n*/\n\nbody {\n  margin: 0; /* 1 */\n  line-height: inherit; /* 2 */\n}\n\n/*\n1. Add the correct height in Firefox.\n2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)\n3. Ensure horizontal rules are visible by default.\n*/\n\nhr {\n  height: 0; /* 1 */\n  color: inherit; /* 2 */\n  border-top-width: 1px; /* 3 */\n}\n\n/*\nAdd the correct text decoration in Chrome, Edge, and Safari.\n*/\n\nabbr:where([title]) {\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted;\n}\n\n/*\nRemove the default font size and weight for headings.\n*/\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: inherit;\n  font-weight: inherit;\n}\n\n/*\nReset links to optimize for opt-in styling instead of opt-out.\n*/\n\na {\n  color: inherit;\n  text-decoration: inherit;\n}\n\n/*\nAdd the correct font weight in Edge and Safari.\n*/\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/*\n1. Use the user's configured \`mono\` font-family by default.\n2. Use the user's configured \`mono\` font-feature-settings by default.\n3. Use the user's configured \`mono\` font-variation-settings by default.\n4. Correct the odd \`em\` font sizing in all browsers.\n*/\n\ncode,\nkbd,\nsamp,\npre {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; /* 1 */\n  font-feature-settings: normal; /* 2 */\n  font-variation-settings: normal; /* 3 */\n  font-size: 1em; /* 4 */\n}\n\n/*\nAdd the correct font size in all browsers.\n*/\n\nsmall {\n  font-size: 80%;\n}\n\n/*\nPrevent \`sub\` and \`sup\` elements from affecting the line height in all browsers.\n*/\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/*\n1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)\n2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)\n3. Remove gaps between table borders by default.\n*/\n\ntable {\n  text-indent: 0; /* 1 */\n  border-color: inherit; /* 2 */\n  border-collapse: collapse; /* 3 */\n}\n\n/*\n1. Change the font styles in all browsers.\n2. Remove the margin in Firefox and Safari.\n3. Remove default padding in all browsers.\n*/\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-feature-settings: inherit; /* 1 */\n  font-variation-settings: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  font-weight: inherit; /* 1 */\n  line-height: inherit; /* 1 */\n  color: inherit; /* 1 */\n  margin: 0; /* 2 */\n  padding: 0; /* 3 */\n}\n\n/*\nRemove the inheritance of text transform in Edge and Firefox.\n*/\n\nbutton,\nselect {\n  text-transform: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Remove default button styles.\n*/\n\nbutton,\n[type='button'],\n[type='reset'],\n[type='submit'] {\n  -webkit-appearance: button; /* 1 */\n  background-color: transparent; /* 2 */\n  background-image: none; /* 2 */\n}\n\n/*\nUse the modern Firefox focus style for all focusable elements.\n*/\n\n:-moz-focusring {\n  outline: auto;\n}\n\n/*\nRemove the additional \`:invalid\` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)\n*/\n\n:-moz-ui-invalid {\n  box-shadow: none;\n}\n\n/*\nAdd the correct vertical alignment in Chrome and Firefox.\n*/\n\nprogress {\n  vertical-align: baseline;\n}\n\n/*\nCorrect the cursor style of increment and decrement buttons in Safari.\n*/\n\n::-webkit-inner-spin-button,\n::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/*\n1. Correct the odd appearance in Chrome and Safari.\n2. Correct the outline style in Safari.\n*/\n\n[type='search'] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/*\nRemove the inner padding in Chrome and Safari on macOS.\n*/\n\n::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Change font properties to \`inherit\` in Safari.\n*/\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/*\nAdd the correct display in Chrome and Safari.\n*/\n\nsummary {\n  display: list-item;\n}\n\n/*\nRemoves the default spacing and border for appropriate elements.\n*/\n\nblockquote,\ndl,\ndd,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\nfigure,\np,\npre {\n  margin: 0;\n}\n\nfieldset {\n  margin: 0;\n  padding: 0;\n}\n\nlegend {\n  padding: 0;\n}\n\nol,\nul,\nmenu {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n/*\nReset default styling for dialogs.\n*/\ndialog {\n  padding: 0;\n}\n\n/*\nPrevent resizing textareas horizontally by default.\n*/\n\ntextarea {\n  resize: vertical;\n}\n\n/*\n1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)\n2. Set the default placeholder color to the user's configured gray 400 color.\n*/\n\ninput::-moz-placeholder, textarea::-moz-placeholder {\n  opacity: 1; /* 1 */\n  color: #9CA3AF; /* 2 */\n}\n\ninput::placeholder,\ntextarea::placeholder {\n  opacity: 1; /* 1 */\n  color: #9CA3AF; /* 2 */\n}\n\n/*\nSet the default cursor for buttons.\n*/\n\nbutton,\n[role="button"] {\n  cursor: pointer;\n}\n\n/*\nMake sure disabled buttons don't get the pointer cursor.\n*/\n:disabled {\n  cursor: default;\n}\n\n/*\n1. Make replaced elements \`display: block\` by default. (https://github.com/mozdevs/cssremedy/issues/14)\n2. Add \`vertical-align: middle\` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)\n   This can trigger a poorly considered lint error in some tools but is included by design.\n*/\n\nimg,\nsvg,\nvideo,\ncanvas,\naudio,\niframe,\nembed,\nobject {\n  display: block; /* 1 */\n  vertical-align: middle; /* 2 */\n}\n\n/*\nConstrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)\n*/\n\nimg,\nvideo {\n  max-width: 100%;\n  height: auto;\n}\n\n/* Make elements with the HTML hidden attribute stay hidden by default */\n[hidden] {\n  display: none;\n}\n\n[type='text'],input:where(:not([type])),[type='email'],[type='url'],[type='password'],[type='number'],[type='date'],[type='datetime-local'],[type='month'],[type='search'],[type='tel'],[type='time'],[type='week'],[multiple],textarea,select {\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none;\n  background-color: #fff;\n  border-color: #6B7280;\n  border-width: 1px;\n  border-radius: 0px;\n  padding-top: 0.5rem;\n  padding-right: 0.75rem;\n  padding-bottom: 0.5rem;\n  padding-left: 0.75rem;\n  font-size: 1rem;\n  line-height: 1.5rem;\n  --tw-shadow: 0 0 #0000;\n}\n\n[type='text']:focus, input:where(:not([type])):focus, [type='email']:focus, [type='url']:focus, [type='password']:focus, [type='number']:focus, [type='date']:focus, [type='datetime-local']:focus, [type='month']:focus, [type='search']:focus, [type='tel']:focus, [type='time']:focus, [type='week']:focus, [multiple]:focus, textarea:focus, select:focus {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n  --tw-ring-inset: var(--tw-empty,/*!*/ /*!*/);\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: #1C64F2;\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);\n  border-color: #1C64F2;\n}\n\ninput::-moz-placeholder, textarea::-moz-placeholder {\n  color: #6B7280;\n  opacity: 1;\n}\n\ninput::placeholder,textarea::placeholder {\n  color: #6B7280;\n  opacity: 1;\n}\n\n::-webkit-datetime-edit-fields-wrapper {\n  padding: 0;\n}\n\n::-webkit-date-and-time-value {\n  min-height: 1.5em;\n  text-align: inherit;\n}\n\n::-webkit-datetime-edit {\n  display: inline-flex;\n}\n\n::-webkit-datetime-edit,::-webkit-datetime-edit-year-field,::-webkit-datetime-edit-month-field,::-webkit-datetime-edit-day-field,::-webkit-datetime-edit-hour-field,::-webkit-datetime-edit-minute-field,::-webkit-datetime-edit-second-field,::-webkit-datetime-edit-millisecond-field,::-webkit-datetime-edit-meridiem-field {\n  padding-top: 0;\n  padding-bottom: 0;\n}\n\nselect {\n  background-image: url(${B});\n  background-position: right 0.5rem center;\n  background-repeat: no-repeat;\n  background-size: 1.5em 1.5em;\n  padding-right: 2.5rem;\n  -webkit-print-color-adjust: exact;\n          print-color-adjust: exact;\n}\n\n[multiple],[size]:where(select:not([size="1"])) {\n  background-image: initial;\n  background-position: initial;\n  background-repeat: unset;\n  background-size: initial;\n  padding-right: 0.75rem;\n  -webkit-print-color-adjust: unset;\n          print-color-adjust: unset;\n}\n\n[type='checkbox'],[type='radio'] {\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none;\n  padding: 0;\n  -webkit-print-color-adjust: exact;\n          print-color-adjust: exact;\n  display: inline-block;\n  vertical-align: middle;\n  background-origin: border-box;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n          user-select: none;\n  flex-shrink: 0;\n  height: 1rem;\n  width: 1rem;\n  color: #1C64F2;\n  background-color: #fff;\n  border-color: #6B7280;\n  border-width: 1px;\n  --tw-shadow: 0 0 #0000;\n}\n\n[type='checkbox'] {\n  border-radius: 0px;\n}\n\n[type='radio'] {\n  border-radius: 100%;\n}\n\n[type='checkbox']:focus,[type='radio']:focus {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n  --tw-ring-inset: var(--tw-empty,/*!*/ /*!*/);\n  --tw-ring-offset-width: 2px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: #1C64F2;\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);\n}\n\n[type='checkbox']:checked,[type='radio']:checked {\n  border-color: transparent;\n  background-color: currentColor;\n  background-size: 100% 100%;\n  background-position: center;\n  background-repeat: no-repeat;\n}\n\n[type='checkbox']:checked {\n  background-image: url(${E});\n}\n\n@media (forced-colors: active)  {\n\n  [type='checkbox']:checked {\n    -webkit-appearance: auto;\n       -moz-appearance: auto;\n            appearance: auto;\n  }\n}\n\n[type='radio']:checked {\n  background-image: url(${u});\n}\n\n@media (forced-colors: active)  {\n\n  [type='radio']:checked {\n    -webkit-appearance: auto;\n       -moz-appearance: auto;\n            appearance: auto;\n  }\n}\n\n[type='checkbox']:checked:hover,[type='checkbox']:checked:focus,[type='radio']:checked:hover,[type='radio']:checked:focus {\n  border-color: transparent;\n  background-color: currentColor;\n}\n\n[type='checkbox']:indeterminate {\n  background-image: url(${y});\n  border-color: transparent;\n  background-color: currentColor;\n  background-size: 100% 100%;\n  background-position: center;\n  background-repeat: no-repeat;\n}\n\n@media (forced-colors: active)  {\n\n  [type='checkbox']:indeterminate {\n    -webkit-appearance: auto;\n       -moz-appearance: auto;\n            appearance: auto;\n  }\n}\n\n[type='checkbox']:indeterminate:hover,[type='checkbox']:indeterminate:focus {\n  border-color: transparent;\n  background-color: currentColor;\n}\n\n[type='file'] {\n  background: unset;\n  border-color: inherit;\n  border-width: 0;\n  border-radius: 0;\n  padding: 0;\n  font-size: unset;\n  line-height: inherit;\n}\n\n[type='file']:focus {\n  outline: 1px solid ButtonText;\n  outline: 1px auto -webkit-focus-ring-color;\n}\n\n[data-tooltip-style^='light'] + .tooltip > .tooltip-arrow:before {\n  border-style: solid;\n  border-color: #e5e7eb;\n}\n\n[data-tooltip-style^='light'] + .tooltip[data-popper-placement^='top'] > .tooltip-arrow:before {\n  border-bottom-width: 1px;\n  border-right-width: 1px;\n}\n\n[data-tooltip-style^='light'] + .tooltip[data-popper-placement^='right'] > .tooltip-arrow:before {\n  border-bottom-width: 1px;\n  border-left-width: 1px;\n}\n\n[data-tooltip-style^='light'] + .tooltip[data-popper-placement^='bottom'] > .tooltip-arrow:before {\n  border-top-width: 1px;\n  border-left-width: 1px;\n}\n\n[data-tooltip-style^='light'] + .tooltip[data-popper-placement^='left'] > .tooltip-arrow:before {\n  border-top-width: 1px;\n  border-right-width: 1px;\n}\n\n.tooltip[data-popper-placement^='top'] > .tooltip-arrow {\n  bottom: -4px;\n}\n\n.tooltip[data-popper-placement^='bottom'] > .tooltip-arrow {\n  top: -4px;\n}\n\n.tooltip[data-popper-placement^='left'] > .tooltip-arrow {\n  right: -4px;\n}\n\n.tooltip[data-popper-placement^='right'] > .tooltip-arrow {\n  left: -4px;\n}\n\n.tooltip.invisible > .tooltip-arrow:before {\n  visibility: hidden;\n}\n\n[data-popper-arrow],[data-popper-arrow]:before {\n  position: absolute;\n  width: 8px;\n  height: 8px;\n  background: inherit;\n}\n\n[data-popper-arrow] {\n  visibility: hidden;\n}\n\n[data-popper-arrow]:before {\n  content: "";\n  visibility: visible;\n  transform: rotate(45deg);\n}\n\n[data-popper-arrow]:after {\n  content: "";\n  visibility: visible;\n  transform: rotate(45deg);\n  position: absolute;\n  width: 9px;\n  height: 9px;\n  background: inherit;\n}\n\n[role="tooltip"] > [data-popper-arrow]:before {\n  border-style: solid;\n  border-color: #e5e7eb;\n}\n\n.dark [role="tooltip"] > [data-popper-arrow]:before {\n  border-style: solid;\n  border-color: #4b5563;\n}\n\n[role="tooltip"] > [data-popper-arrow]:after {\n  border-style: solid;\n  border-color: #e5e7eb;\n}\n\n.dark [role="tooltip"] > [data-popper-arrow]:after {\n  border-style: solid;\n  border-color: #4b5563;\n}\n\n[data-popover][role="tooltip"][data-popper-placement^='top'] > [data-popper-arrow]:before {\n  border-bottom-width: 1px;\n  border-right-width: 1px;\n}\n\n[data-popover][role="tooltip"][data-popper-placement^='top'] > [data-popper-arrow]:after {\n  border-bottom-width: 1px;\n  border-right-width: 1px;\n}\n\n[data-popover][role="tooltip"][data-popper-placement^='right'] > [data-popper-arrow]:before {\n  border-bottom-width: 1px;\n  border-left-width: 1px;\n}\n\n[data-popover][role="tooltip"][data-popper-placement^='right'] > [data-popper-arrow]:after {\n  border-bottom-width: 1px;\n  border-left-width: 1px;\n}\n\n[data-popover][role="tooltip"][data-popper-placement^='bottom'] > [data-popper-arrow]:before {\n  border-top-width: 1px;\n  border-left-width: 1px;\n}\n\n[data-popover][role="tooltip"][data-popper-placement^='bottom'] > [data-popper-arrow]:after {\n  border-top-width: 1px;\n  border-left-width: 1px;\n}\n\n[data-popover][role="tooltip"][data-popper-placement^='left'] > [data-popper-arrow]:before {\n  border-top-width: 1px;\n  border-right-width: 1px;\n}\n\n[data-popover][role="tooltip"][data-popper-placement^='left'] > [data-popper-arrow]:after {\n  border-top-width: 1px;\n  border-right-width: 1px;\n}\n\n[data-popover][role="tooltip"][data-popper-placement^='top'] > [data-popper-arrow] {\n  bottom: -5px;\n}\n\n[data-popover][role="tooltip"][data-popper-placement^='bottom'] > [data-popper-arrow] {\n  top: -5px;\n}\n\n[data-popover][role="tooltip"][data-popper-placement^='left'] > [data-popper-arrow] {\n  right: -5px;\n}\n\n[data-popover][role="tooltip"][data-popper-placement^='right'] > [data-popper-arrow] {\n  left: -5px;\n}\n\n[role="tooltip"].invisible > [data-popper-arrow]:before {\n  visibility: hidden;\n}\n\n[role="tooltip"].invisible > [data-popper-arrow]:after {\n  visibility: hidden;\n}\n\n[type='text'],[type='email'],[type='url'],[type='password'],[type='number'],[type='date'],[type='datetime-local'],[type='month'],[type='search'],[type='tel'],[type='time'],[type='week'],[multiple],textarea,select {\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none;\n  background-color: #fff;\n  border-color: #6B7280;\n  border-width: 1px;\n  border-radius: 0px;\n  padding-top: 0.5rem;\n  padding-right: 0.75rem;\n  padding-bottom: 0.5rem;\n  padding-left: 0.75rem;\n  font-size: 1rem;\n  line-height: 1.5rem;\n  --tw-shadow: 0 0 #0000;\n}\n\n[type='text']:focus, [type='email']:focus, [type='url']:focus, [type='password']:focus, [type='number']:focus, [type='date']:focus, [type='datetime-local']:focus, [type='month']:focus, [type='search']:focus, [type='tel']:focus, [type='time']:focus, [type='week']:focus, [multiple]:focus, textarea:focus, select:focus {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n  --tw-ring-inset: var(--tw-empty,/*!*/ /*!*/);\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: #1C64F2;\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);\n  border-color: #1C64F2;\n}\n\ninput::-moz-placeholder, textarea::-moz-placeholder {\n  color: #6B7280;\n  opacity: 1;\n}\n\ninput::placeholder,textarea::placeholder {\n  color: #6B7280;\n  opacity: 1;\n}\n\n::-webkit-datetime-edit-fields-wrapper {\n  padding: 0;\n}\n\ninput[type="time"]::-webkit-calendar-picker-indicator {\n  background: none;\n}\n\nselect:not([size]) {\n  background-image: url(${f});\n  background-position: right 0.75rem center;\n  background-repeat: no-repeat;\n  background-size: 0.75em 0.75em;\n  padding-right: 2.5rem;\n  -webkit-print-color-adjust: exact;\n          print-color-adjust: exact;\n}\n\n:is([dir=rtl]) select:not([size]) {\n  background-position: left 0.75rem center;\n  padding-right: 0.75rem;\n  padding-left: 0;\n}\n\n[multiple] {\n  background-image: initial;\n  background-position: initial;\n  background-repeat: unset;\n  background-size: initial;\n  padding-right: 0.75rem;\n  -webkit-print-color-adjust: unset;\n          print-color-adjust: unset;\n}\n\n[type='checkbox'],[type='radio'] {\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none;\n  padding: 0;\n  -webkit-print-color-adjust: exact;\n          print-color-adjust: exact;\n  display: inline-block;\n  vertical-align: middle;\n  background-origin: border-box;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n          user-select: none;\n  flex-shrink: 0;\n  height: 1rem;\n  width: 1rem;\n  color: #1C64F2;\n  background-color: #fff;\n  border-color: #6B7280;\n  border-width: 1px;\n  --tw-shadow: 0 0 #0000;\n}\n\n[type='checkbox'] {\n  border-radius: 0px;\n}\n\n[type='radio'] {\n  border-radius: 100%;\n}\n\n[type='checkbox']:focus,[type='radio']:focus {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n  --tw-ring-inset: var(--tw-empty,/*!*/ /*!*/);\n  --tw-ring-offset-width: 2px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: #1C64F2;\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);\n}\n\n[type='checkbox']:checked,[type='radio']:checked,.dark [type='checkbox']:checked,.dark [type='radio']:checked {\n  border-color: transparent;\n  background-color: currentColor;\n  background-size: 0.55em 0.55em;\n  background-position: center;\n  background-repeat: no-repeat;\n}\n\n[type='checkbox']:checked {\n  background-image: url(${h});\n  background-repeat: no-repeat;\n  background-size: 0.55em 0.55em;\n  -webkit-print-color-adjust: exact;\n          print-color-adjust: exact;\n}\n\n[type='radio']:checked {\n  background-image: url(${u});\n  background-size: 1em 1em;\n}\n\n.dark [type='radio']:checked {\n  background-image: url(${u});\n  background-size: 1em 1em;\n}\n\n[type='checkbox']:indeterminate {\n  background-image: url(${v});\n  background-color: currentColor;\n  border-color: transparent;\n  background-position: center;\n  background-repeat: no-repeat;\n  background-size: 0.55em 0.55em;\n  -webkit-print-color-adjust: exact;\n          print-color-adjust: exact;\n}\n\n[type='checkbox']:indeterminate:hover,[type='checkbox']:indeterminate:focus {\n  border-color: transparent;\n  background-color: currentColor;\n}\n\n[type='file'] {\n  background: unset;\n  border-color: inherit;\n  border-width: 0;\n  border-radius: 0;\n  padding: 0;\n  font-size: unset;\n  line-height: inherit;\n}\n\n[type='file']:focus {\n  outline: 1px auto inherit;\n}\n\ninput[type=file]::file-selector-button {\n  color: white;\n  background: #1F2937;\n  border: 0;\n  font-weight: 500;\n  font-size: 0.875rem;\n  cursor: pointer;\n  padding-top: 0.625rem;\n  padding-bottom: 0.625rem;\n  padding-left: 2rem;\n  padding-right: 1rem;\n  margin-inline-start: -1rem;\n  margin-inline-end: 1rem;\n}\n\ninput[type=file]::file-selector-button:hover {\n  background: #374151;\n}\n\n:is([dir=rtl]) input[type=file]::file-selector-button {\n  padding-right: 2rem;\n  padding-left: 1rem;\n}\n\n.dark input[type=file]::file-selector-button {\n  color: white;\n  background: #4B5563;\n}\n\n.dark input[type=file]::file-selector-button:hover {\n  background: #6B7280;\n}\n\ninput[type="range"]::-webkit-slider-thumb {\n  height: 1.25rem;\n  width: 1.25rem;\n  background: #1C64F2;\n  border-radius: 9999px;\n  border: 0;\n  appearance: none;\n  -moz-appearance: none;\n  -webkit-appearance: none;\n  cursor: pointer;\n}\n\ninput[type="range"]:disabled::-webkit-slider-thumb {\n  background: #9CA3AF;\n}\n\n.dark input[type="range"]:disabled::-webkit-slider-thumb {\n  background: #6B7280;\n}\n\ninput[type="range"]:focus::-webkit-slider-thumb {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n  --tw-ring-opacity: 1px;\n  --tw-ring-color: rgb(164 202 254 / var(--tw-ring-opacity));\n}\n\ninput[type="range"]::-moz-range-thumb {\n  height: 1.25rem;\n  width: 1.25rem;\n  background: #1C64F2;\n  border-radius: 9999px;\n  border: 0;\n  appearance: none;\n  -moz-appearance: none;\n  -webkit-appearance: none;\n  cursor: pointer;\n}\n\ninput[type="range"]:disabled::-moz-range-thumb {\n  background: #9CA3AF;\n}\n\n.dark input[type="range"]:disabled::-moz-range-thumb {\n  background: #6B7280;\n}\n\ninput[type="range"]::-moz-range-progress {\n  background: #3F83F8;\n}\n\ninput[type="range"]::-ms-fill-lower {\n  background: #3F83F8;\n}\n\n*, ::before, ::after {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-gradient-from-position:  ;\n  --tw-gradient-via-position:  ;\n  --tw-gradient-to-position:  ;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(63 131 248 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n}\n\n::backdrop {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-gradient-from-position:  ;\n  --tw-gradient-via-position:  ;\n  --tw-gradient-to-position:  ;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(63 131 248 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n}\n.\\!container {\n  width: 100% !important;\n}\n.container {\n  width: 100%;\n}\n@media (min-width: 640px) {\n\n  .\\!container {\n    max-width: 640px !important;\n  }\n\n  .container {\n    max-width: 640px;\n  }\n}\n@media (min-width: 768px) {\n\n  .\\!container {\n    max-width: 768px !important;\n  }\n\n  .container {\n    max-width: 768px;\n  }\n}\n@media (min-width: 1024px) {\n\n  .\\!container {\n    max-width: 1024px !important;\n  }\n\n  .container {\n    max-width: 1024px;\n  }\n}\n@media (min-width: 1280px) {\n\n  .\\!container {\n    max-width: 1280px !important;\n  }\n\n  .container {\n    max-width: 1280px;\n  }\n}\n@media (min-width: 1536px) {\n\n  .\\!container {\n    max-width: 1536px !important;\n  }\n\n  .container {\n    max-width: 1536px;\n  }\n}\n.sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border-width: 0;\n}\n.pointer-events-none {\n  pointer-events: none;\n}\n.visible {\n  visibility: visible;\n}\n.invisible {\n  visibility: hidden;\n}\n.collapse {\n  visibility: collapse;\n}\n.static {\n  position: static;\n}\n.fixed {\n  position: fixed;\n}\n.absolute {\n  position: absolute;\n}\n.relative {\n  position: relative;\n}\n.sticky {\n  position: sticky;\n}\n.inset-0 {\n  inset: 0px;\n}\n.inset-x-0 {\n  left: 0px;\n  right: 0px;\n}\n.inset-y-0 {\n  top: 0px;\n  bottom: 0px;\n}\n.-bottom-1 {\n  bottom: -0.25rem;\n}\n.-left-1 {\n  left: -0.25rem;\n}\n.-left-1\\.5 {\n  left: -0.375rem;\n}\n.-left-3 {\n  left: -0.75rem;\n}\n.-right-1 {\n  right: -0.25rem;\n}\n.-top-1 {\n  top: -0.25rem;\n}\n.bottom-5 {\n  bottom: 1.25rem;\n}\n.left-0 {\n  left: 0px;\n}\n.left-1 {\n  left: 0.25rem;\n}\n.left-1\\/2 {\n  left: 50%;\n}\n.left-2 {\n  left: 0.5rem;\n}\n.left-2\\.5 {\n  left: 0.625rem;\n}\n.left-3 {\n  left: 0.75rem;\n}\n.left-4 {\n  left: 1rem;\n}\n.left-5 {\n  left: 1.25rem;\n}\n.left-6 {\n  left: 1.5rem;\n}\n.right-0 {\n  right: 0px;\n}\n.right-2 {\n  right: 0.5rem;\n}\n.right-4 {\n  right: 1rem;\n}\n.top-0 {\n  top: 0px;\n}\n.top-1\\/2 {\n  top: 50%;\n}\n.top-10 {\n  top: 2.5rem;\n}\n.top-2 {\n  top: 0.5rem;\n}\n.top-3 {\n  top: 0.75rem;\n}\n.top-4 {\n  top: 1rem;\n}\n.top-full {\n  top: 100%;\n}\n.-z-10 {\n  z-index: -10;\n}\n.z-0 {\n  z-index: 0;\n}\n.z-10 {\n  z-index: 10;\n}\n.z-20 {\n  z-index: 20;\n}\n.z-30 {\n  z-index: 30;\n}\n.z-40 {\n  z-index: 40;\n}\n.z-50 {\n  z-index: 50;\n}\n.z-auto {\n  z-index: auto;\n}\n.col-span-1 {\n  grid-column: span 1 / span 1;\n}\n.-m-1 {\n  margin: -0.25rem;\n}\n.-m-1\\.5 {\n  margin: -0.375rem;\n}\n.mx-1 {\n  margin-left: 0.25rem;\n  margin-right: 0.25rem;\n}\n.mx-4 {\n  margin-left: 1rem;\n  margin-right: 1rem;\n}\n.mx-auto {\n  margin-left: auto;\n  margin-right: auto;\n}\n.my-1 {\n  margin-top: 0.25rem;\n  margin-bottom: 0.25rem;\n}\n.my-6 {\n  margin-top: 1.5rem;\n  margin-bottom: 1.5rem;\n}\n.-mb-px {\n  margin-bottom: -1px;\n}\n.mb-1 {\n  margin-bottom: 0.25rem;\n}\n.mb-10 {\n  margin-bottom: 2.5rem;\n}\n.mb-2 {\n  margin-bottom: 0.5rem;\n}\n.mb-3 {\n  margin-bottom: 0.75rem;\n}\n.mb-4 {\n  margin-bottom: 1rem;\n}\n.mb-5 {\n  margin-bottom: 1.25rem;\n}\n.mb-6 {\n  margin-bottom: 1.5rem;\n}\n.me-2 {\n  margin-inline-end: 0.5rem;\n}\n.me-4 {\n  margin-inline-end: 1rem;\n}\n.ml-0 {\n  margin-left: 0px;\n}\n.ml-1 {\n  margin-left: 0.25rem;\n}\n.ml-2 {\n  margin-left: 0.5rem;\n}\n.ml-3 {\n  margin-left: 0.75rem;\n}\n.ml-6 {\n  margin-left: 1.5rem;\n}\n.ml-auto {\n  margin-left: auto;\n}\n.mr-2 {\n  margin-right: 0.5rem;\n}\n.mr-3 {\n  margin-right: 0.75rem;\n}\n.mr-4 {\n  margin-right: 1rem;\n}\n.mt-0 {\n  margin-top: 0px;\n}\n.mt-1 {\n  margin-top: 0.25rem;\n}\n.mt-1\\.5 {\n  margin-top: 0.375rem;\n}\n.mt-2 {\n  margin-top: 0.5rem;\n}\n.mt-3 {\n  margin-top: 0.75rem;\n}\n.mt-4 {\n  margin-top: 1rem;\n}\n.mt-6 {\n  margin-top: 1.5rem;\n}\n.line-clamp-2 {\n  overflow: hidden;\n  display: -webkit-box;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 2;\n}\n.block {\n  display: block;\n}\n.inline-block {\n  display: inline-block;\n}\n.\\!inline {\n  display: inline !important;\n}\n.inline {\n  display: inline;\n}\n.flex {\n  display: flex;\n}\n.inline-flex {\n  display: inline-flex;\n}\n.table {\n  display: table;\n}\n.grid {\n  display: grid;\n}\n.hidden {\n  display: none;\n}\n.h-0 {\n  height: 0px;\n}\n.h-0\\.5 {\n  height: 0.125rem;\n}\n.h-1 {\n  height: 0.25rem;\n}\n.h-1\\.5 {\n  height: 0.375rem;\n}\n.h-10 {\n  height: 2.5rem;\n}\n.h-12 {\n  height: 3rem;\n}\n.h-2 {\n  height: 0.5rem;\n}\n.h-2\\.5 {\n  height: 0.625rem;\n}\n.h-20 {\n  height: 5rem;\n}\n.h-3 {\n  height: 0.75rem;\n}\n.h-3\\.5 {\n  height: 0.875rem;\n}\n.h-36 {\n  height: 9rem;\n}\n.h-4 {\n  height: 1rem;\n}\n.h-5 {\n  height: 1.25rem;\n}\n.h-6 {\n  height: 1.5rem;\n}\n.h-7 {\n  height: 1.75rem;\n}\n.h-8 {\n  height: 2rem;\n}\n.h-9 {\n  height: 2.25rem;\n}\n.h-96 {\n  height: 24rem;\n}\n.h-auto {\n  height: auto;\n}\n.h-fit {\n  height: -moz-fit-content;\n  height: fit-content;\n}\n.h-full {\n  height: 100%;\n}\n.h-px {\n  height: 1px;\n}\n.h-screen {\n  height: 100vh;\n}\n.max-h-\\[90dvh\\] {\n  max-height: 90dvh;\n}\n.w-1 {\n  width: 0.25rem;\n}\n.w-1\\/2 {\n  width: 50%;\n}\n.w-10 {\n  width: 2.5rem;\n}\n.w-11 {\n  width: 2.75rem;\n}\n.w-12 {\n  width: 3rem;\n}\n.w-14 {\n  width: 3.5rem;\n}\n.w-16 {\n  width: 4rem;\n}\n.w-2 {\n  width: 0.5rem;\n}\n.w-2\\/4 {\n  width: 50%;\n}\n.w-20 {\n  width: 5rem;\n}\n.w-3 {\n  width: 0.75rem;\n}\n.w-3\\.5 {\n  width: 0.875rem;\n}\n.w-36 {\n  width: 9rem;\n}\n.w-4 {\n  width: 1rem;\n}\n.w-48 {\n  width: 12rem;\n}\n.w-5 {\n  width: 1.25rem;\n}\n.w-6 {\n  width: 1.5rem;\n}\n.w-64 {\n  width: 16rem;\n}\n.w-7 {\n  width: 1.75rem;\n}\n.w-72 {\n  width: 18rem;\n}\n.w-8 {\n  width: 2rem;\n}\n.w-80 {\n  width: 20rem;\n}\n.w-9 {\n  width: 2.25rem;\n}\n.w-auto {\n  width: auto;\n}\n.w-fit {\n  width: -moz-fit-content;\n  width: fit-content;\n}\n.w-full {\n  width: 100%;\n}\n.w-max {\n  width: -moz-max-content;\n  width: max-content;\n}\n.w-px {\n  width: 1px;\n}\n.max-w-2xl {\n  max-width: 42rem;\n}\n.max-w-3xl {\n  max-width: 48rem;\n}\n.max-w-4xl {\n  max-width: 56rem;\n}\n.max-w-5xl {\n  max-width: 64rem;\n}\n.max-w-6xl {\n  max-width: 72rem;\n}\n.max-w-7xl {\n  max-width: 80rem;\n}\n.max-w-\\[100vw\\] {\n  max-width: 100vw;\n}\n.max-w-lg {\n  max-width: 32rem;\n}\n.max-w-md {\n  max-width: 28rem;\n}\n.max-w-sm {\n  max-width: 24rem;\n}\n.max-w-xl {\n  max-width: 36rem;\n}\n.max-w-xs {\n  max-width: 20rem;\n}\n.flex-1 {\n  flex: 1 1 0%;\n}\n.flex-shrink {\n  flex-shrink: 1;\n}\n.flex-shrink-0 {\n  flex-shrink: 0;\n}\n.shrink-0 {\n  flex-shrink: 0;\n}\n.origin-\\[0\\] {\n  transform-origin: 0;\n}\n.-translate-x-1\\/2 {\n  --tw-translate-x: -50%;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.-translate-y-1\\/2 {\n  --tw-translate-y: -50%;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.-translate-y-4 {\n  --tw-translate-y: -1rem;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.-translate-y-6 {\n  --tw-translate-y: -1.5rem;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.rotate-180 {\n  --tw-rotate: 180deg;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.rotate-45 {\n  --tw-rotate: 45deg;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.scale-75 {\n  --tw-scale-x: .75;\n  --tw-scale-y: .75;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.transform {\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n@keyframes pulse {\n\n  50% {\n    opacity: .5;\n  }\n}\n.animate-pulse {\n  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;\n}\n@keyframes spin {\n\n  to {\n    transform: rotate(360deg);\n  }\n}\n.animate-spin {\n  animation: spin 1s linear infinite;\n}\n.cursor-default {\n  cursor: default;\n}\n.cursor-grab {\n  cursor: grab;\n}\n.cursor-not-allowed {\n  cursor: not-allowed;\n}\n.cursor-pointer {\n  cursor: pointer;\n}\n.cursor-wait {\n  cursor: wait;\n}\n.select-none {\n  -webkit-user-select: none;\n     -moz-user-select: none;\n          user-select: none;\n}\n.resize {\n  resize: both;\n}\n.snap-x {\n  scroll-snap-type: x var(--tw-scroll-snap-strictness);\n}\n.snap-mandatory {\n  --tw-scroll-snap-strictness: mandatory;\n}\n.snap-center {\n  scroll-snap-align: center;\n}\n.list-inside {\n  list-style-position: inside;\n}\n.list-decimal {\n  list-style-type: decimal;\n}\n.list-disc {\n  list-style-type: disc;\n}\n.list-none {\n  list-style-type: none;\n}\n.appearance-none {\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none;\n}\n.grid-flow-col {\n  grid-auto-flow: column;\n}\n.grid-cols-2 {\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n.grid-cols-4 {\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n}\n.grid-cols-7 {\n  grid-template-columns: repeat(7, minmax(0, 1fr));\n}\n.flex-col {\n  flex-direction: column;\n}\n.flex-wrap {\n  flex-wrap: wrap;\n}\n.items-start {\n  align-items: flex-start;\n}\n.items-end {\n  align-items: flex-end;\n}\n.items-center {\n  align-items: center;\n}\n.items-stretch {\n  align-items: stretch;\n}\n.justify-start {\n  justify-content: flex-start;\n}\n.justify-end {\n  justify-content: flex-end;\n}\n.justify-center {\n  justify-content: center;\n}\n.justify-between {\n  justify-content: space-between;\n}\n.gap-1 {\n  gap: 0.25rem;\n}\n.gap-1\\.5 {\n  gap: 0.375rem;\n}\n.gap-2 {\n  gap: 0.5rem;\n}\n.gap-3 {\n  gap: 0.75rem;\n}\n.gap-4 {\n  gap: 1rem;\n}\n.-space-x-4 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(-1rem * var(--tw-space-x-reverse));\n  margin-left: calc(-1rem * calc(1 - var(--tw-space-x-reverse)));\n}\n.-space-x-px > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(-1px * var(--tw-space-x-reverse));\n  margin-left: calc(-1px * calc(1 - var(--tw-space-x-reverse)));\n}\n.space-x-2 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(0.5rem * var(--tw-space-x-reverse));\n  margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));\n}\n.space-x-3 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(0.75rem * var(--tw-space-x-reverse));\n  margin-left: calc(0.75rem * calc(1 - var(--tw-space-x-reverse)));\n}\n.space-x-4 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(1rem * var(--tw-space-x-reverse));\n  margin-left: calc(1rem * calc(1 - var(--tw-space-x-reverse)));\n}\n.space-y-0 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0px * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0px * var(--tw-space-y-reverse));\n}\n.space-y-1 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0.25rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0.25rem * var(--tw-space-y-reverse));\n}\n.space-y-2 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));\n}\n.space-y-3 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0.75rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0.75rem * var(--tw-space-y-reverse));\n}\n.space-y-4 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(1rem * var(--tw-space-y-reverse));\n}\n.divide-x > :not([hidden]) ~ :not([hidden]) {\n  --tw-divide-x-reverse: 0;\n  border-right-width: calc(1px * var(--tw-divide-x-reverse));\n  border-left-width: calc(1px * calc(1 - var(--tw-divide-x-reverse)));\n}\n.divide-y > :not([hidden]) ~ :not([hidden]) {\n  --tw-divide-y-reverse: 0;\n  border-top-width: calc(1px * calc(1 - var(--tw-divide-y-reverse)));\n  border-bottom-width: calc(1px * var(--tw-divide-y-reverse));\n}\n.divide-gray-100 > :not([hidden]) ~ :not([hidden]) {\n  --tw-divide-opacity: 1;\n  border-color: rgb(243 244 246 / var(--tw-divide-opacity));\n}\n.divide-gray-200 > :not([hidden]) ~ :not([hidden]) {\n  --tw-divide-opacity: 1;\n  border-color: rgb(229 231 235 / var(--tw-divide-opacity));\n}\n.self-center {\n  align-self: center;\n}\n.overflow-auto {\n  overflow: auto;\n}\n.overflow-hidden {\n  overflow: hidden;\n}\n.overflow-y-auto {\n  overflow-y: auto;\n}\n.\\!overflow-x-hidden {\n  overflow-x: hidden !important;\n}\n.overflow-x-hidden {\n  overflow-x: hidden;\n}\n.overflow-y-hidden {\n  overflow-y: hidden;\n}\n.overflow-x-scroll {\n  overflow-x: scroll;\n}\n.\\!scroll-auto {\n  scroll-behavior: auto !important;\n}\n.scroll-smooth {\n  scroll-behavior: smooth;\n}\n.whitespace-nowrap {\n  white-space: nowrap;\n}\n.rounded {\n  border-radius: 0.25rem;\n}\n.rounded-\\[7px\\] {\n  border-radius: 7px;\n}\n.rounded-full {\n  border-radius: 9999px;\n}\n.rounded-lg {\n  border-radius: 0.5rem;\n}\n.rounded-md {\n  border-radius: 0.375rem;\n}\n.rounded-none {\n  border-radius: 0px;\n}\n.rounded-b {\n  border-bottom-right-radius: 0.25rem;\n  border-bottom-left-radius: 0.25rem;\n}\n.rounded-e-lg {\n  border-start-end-radius: 0.5rem;\n  border-end-end-radius: 0.5rem;\n}\n.rounded-l-lg {\n  border-top-left-radius: 0.5rem;\n  border-bottom-left-radius: 0.5rem;\n}\n.rounded-l-md {\n  border-top-left-radius: 0.375rem;\n  border-bottom-left-radius: 0.375rem;\n}\n.rounded-l-none {\n  border-top-left-radius: 0px;\n  border-bottom-left-radius: 0px;\n}\n.rounded-r-lg {\n  border-top-right-radius: 0.5rem;\n  border-bottom-right-radius: 0.5rem;\n}\n.rounded-r-none {\n  border-top-right-radius: 0px;\n  border-bottom-right-radius: 0px;\n}\n.rounded-s-lg {\n  border-start-start-radius: 0.5rem;\n  border-end-start-radius: 0.5rem;\n}\n.rounded-t {\n  border-top-left-radius: 0.25rem;\n  border-top-right-radius: 0.25rem;\n}\n.rounded-t-lg {\n  border-top-left-radius: 0.5rem;\n  border-top-right-radius: 0.5rem;\n}\n.border {\n  border-width: 1px;\n}\n.border-0 {\n  border-width: 0px;\n}\n.border-2 {\n  border-width: 2px;\n}\n.border-y {\n  border-top-width: 1px;\n  border-bottom-width: 1px;\n}\n.border-b {\n  border-bottom-width: 1px;\n}\n.border-b-0 {\n  border-bottom-width: 0px;\n}\n.border-b-2 {\n  border-bottom-width: 2px;\n}\n.border-l {\n  border-left-width: 1px;\n}\n.border-l-0 {\n  border-left-width: 0px;\n}\n.border-l-4 {\n  border-left-width: 4px;\n}\n.border-r {\n  border-right-width: 1px;\n}\n.border-r-0 {\n  border-right-width: 0px;\n}\n.border-t {\n  border-top-width: 1px;\n}\n.border-t-4 {\n  border-top-width: 4px;\n}\n.border-blue-500 {\n  --tw-border-opacity: 1;\n  border-color: rgb(63 131 248 / var(--tw-border-opacity));\n}\n.border-cyan-300 {\n  --tw-border-opacity: 1;\n  border-color: rgb(103 232 249 / var(--tw-border-opacity));\n}\n.border-cyan-500 {\n  --tw-border-opacity: 1;\n  border-color: rgb(6 182 212 / var(--tw-border-opacity));\n}\n.border-cyan-600 {\n  --tw-border-opacity: 1;\n  border-color: rgb(8 145 178 / var(--tw-border-opacity));\n}\n.border-cyan-700 {\n  --tw-border-opacity: 1;\n  border-color: rgb(14 116 144 / var(--tw-border-opacity));\n}\n.border-gray-100 {\n  --tw-border-opacity: 1;\n  border-color: rgb(243 244 246 / var(--tw-border-opacity));\n}\n.border-gray-200 {\n  --tw-border-opacity: 1;\n  border-color: rgb(229 231 235 / var(--tw-border-opacity));\n}\n.border-gray-300 {\n  --tw-border-opacity: 1;\n  border-color: rgb(209 213 219 / var(--tw-border-opacity));\n}\n.border-gray-400 {\n  --tw-border-opacity: 1;\n  border-color: rgb(156 163 175 / var(--tw-border-opacity));\n}\n.border-gray-500 {\n  --tw-border-opacity: 1;\n  border-color: rgb(107 114 128 / var(--tw-border-opacity));\n}\n.border-gray-600 {\n  --tw-border-opacity: 1;\n  border-color: rgb(75 85 99 / var(--tw-border-opacity));\n}\n.border-gray-900 {\n  --tw-border-opacity: 1;\n  border-color: rgb(17 24 39 / var(--tw-border-opacity));\n}\n.border-green-300 {\n  --tw-border-opacity: 1;\n  border-color: rgb(132 225 188 / var(--tw-border-opacity));\n}\n.border-green-500 {\n  --tw-border-opacity: 1;\n  border-color: rgb(14 159 110 / var(--tw-border-opacity));\n}\n.border-green-600 {\n  --tw-border-opacity: 1;\n  border-color: rgb(5 122 85 / var(--tw-border-opacity));\n}\n.border-green-700 {\n  --tw-border-opacity: 1;\n  border-color: rgb(4 108 78 / var(--tw-border-opacity));\n}\n.border-indigo-300 {\n  --tw-border-opacity: 1;\n  border-color: rgb(180 198 252 / var(--tw-border-opacity));\n}\n.border-indigo-400 {\n  --tw-border-opacity: 1;\n  border-color: rgb(141 162 251 / var(--tw-border-opacity));\n}\n.border-indigo-500 {\n  --tw-border-opacity: 1;\n  border-color: rgb(104 117 245 / var(--tw-border-opacity));\n}\n.border-lime-300 {\n  --tw-border-opacity: 1;\n  border-color: rgb(190 242 100 / var(--tw-border-opacity));\n}\n.border-lime-400 {\n  --tw-border-opacity: 1;\n  border-color: rgb(163 230 53 / var(--tw-border-opacity));\n}\n.border-lime-500 {\n  --tw-border-opacity: 1;\n  border-color: rgb(132 204 22 / var(--tw-border-opacity));\n}\n.border-pink-300 {\n  --tw-border-opacity: 1;\n  border-color: rgb(248 180 217 / var(--tw-border-opacity));\n}\n.border-pink-500 {\n  --tw-border-opacity: 1;\n  border-color: rgb(231 70 148 / var(--tw-border-opacity));\n}\n.border-pink-600 {\n  --tw-border-opacity: 1;\n  border-color: rgb(214 31 105 / var(--tw-border-opacity));\n}\n.border-purple-500 {\n  --tw-border-opacity: 1;\n  border-color: rgb(144 97 249 / var(--tw-border-opacity));\n}\n.border-purple-900 {\n  --tw-border-opacity: 1;\n  border-color: rgb(74 29 150 / var(--tw-border-opacity));\n}\n.border-red-300 {\n  --tw-border-opacity: 1;\n  border-color: rgb(248 180 180 / var(--tw-border-opacity));\n}\n.border-red-500 {\n  --tw-border-opacity: 1;\n  border-color: rgb(240 82 82 / var(--tw-border-opacity));\n}\n.border-red-600 {\n  --tw-border-opacity: 1;\n  border-color: rgb(224 36 36 / var(--tw-border-opacity));\n}\n.border-red-900 {\n  --tw-border-opacity: 1;\n  border-color: rgb(119 29 29 / var(--tw-border-opacity));\n}\n.border-slate-100 {\n  --tw-border-opacity: 1;\n  border-color: rgb(241 245 249 / var(--tw-border-opacity));\n}\n.border-slate-100\\/50 {\n  border-color: rgb(241 245 249 / 0.5);\n}\n.border-slate-200 {\n  --tw-border-opacity: 1;\n  border-color: rgb(226 232 240 / var(--tw-border-opacity));\n}\n.border-slate-300 {\n  --tw-border-opacity: 1;\n  border-color: rgb(203 213 225 / var(--tw-border-opacity));\n}\n.border-slate-50 {\n  --tw-border-opacity: 1;\n  border-color: rgb(248 250 252 / var(--tw-border-opacity));\n}\n.border-teal-300 {\n  --tw-border-opacity: 1;\n  border-color: rgb(126 220 226 / var(--tw-border-opacity));\n}\n.border-teal-500 {\n  --tw-border-opacity: 1;\n  border-color: rgb(6 148 162 / var(--tw-border-opacity));\n}\n.border-transparent {\n  border-color: transparent;\n}\n.border-white {\n  --tw-border-opacity: 1;\n  border-color: rgb(255 255 255 / var(--tw-border-opacity));\n}\n.border-yellow-200 {\n  --tw-border-opacity: 1;\n  border-color: rgb(252 233 106 / var(--tw-border-opacity));\n}\n.border-yellow-300 {\n  --tw-border-opacity: 1;\n  border-color: rgb(250 202 21 / var(--tw-border-opacity));\n}\n.border-yellow-400 {\n  --tw-border-opacity: 1;\n  border-color: rgb(227 160 8 / var(--tw-border-opacity));\n}\n.border-yellow-500 {\n  --tw-border-opacity: 1;\n  border-color: rgb(194 120 3 / var(--tw-border-opacity));\n}\n.border-yellow-600 {\n  --tw-border-opacity: 1;\n  border-color: rgb(159 88 10 / var(--tw-border-opacity));\n}\n.border-l-indigo-500 {\n  --tw-border-opacity: 1;\n  border-left-color: rgb(104 117 245 / var(--tw-border-opacity));\n}\n.border-l-transparent {\n  border-left-color: transparent;\n}\n.\\!bg-gray-50 {\n  --tw-bg-opacity: 1 !important;\n  background-color: rgb(249 250 251 / var(--tw-bg-opacity)) !important;\n}\n.\\!bg-transparent {\n  background-color: transparent !important;\n}\n.bg-black\\/30 {\n  background-color: rgb(0 0 0 / 0.3);\n}\n.bg-blue-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(225 239 254 / var(--tw-bg-opacity));\n}\n.bg-blue-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(28 100 242 / var(--tw-bg-opacity));\n}\n.bg-blue-700 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(26 86 219 / var(--tw-bg-opacity));\n}\n.bg-cyan-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(207 250 254 / var(--tw-bg-opacity));\n}\n.bg-cyan-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(165 243 252 / var(--tw-bg-opacity));\n}\n.bg-cyan-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(236 254 255 / var(--tw-bg-opacity));\n}\n.bg-cyan-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(6 182 212 / var(--tw-bg-opacity));\n}\n.bg-cyan-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(8 145 178 / var(--tw-bg-opacity));\n}\n.bg-cyan-700 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(14 116 144 / var(--tw-bg-opacity));\n}\n.bg-emerald-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(16 185 129 / var(--tw-bg-opacity));\n}\n.bg-gray-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(243 244 246 / var(--tw-bg-opacity));\n}\n.bg-gray-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(229 231 235 / var(--tw-bg-opacity));\n}\n.bg-gray-400 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(156 163 175 / var(--tw-bg-opacity));\n}\n.bg-gray-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(249 250 251 / var(--tw-bg-opacity));\n}\n.bg-gray-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(107 114 128 / var(--tw-bg-opacity));\n}\n.bg-gray-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(75 85 99 / var(--tw-bg-opacity));\n}\n.bg-gray-700 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(55 65 81 / var(--tw-bg-opacity));\n}\n.bg-gray-800 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(31 41 55 / var(--tw-bg-opacity));\n}\n.bg-gray-900 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(17 24 39 / var(--tw-bg-opacity));\n}\n.bg-green-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(222 247 236 / var(--tw-bg-opacity));\n}\n.bg-green-400 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(49 196 141 / var(--tw-bg-opacity));\n}\n.bg-green-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(243 250 247 / var(--tw-bg-opacity));\n}\n.bg-green-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(14 159 110 / var(--tw-bg-opacity));\n}\n.bg-green-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(5 122 85 / var(--tw-bg-opacity));\n}\n.bg-green-700 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(4 108 78 / var(--tw-bg-opacity));\n}\n.bg-indigo-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(229 237 255 / var(--tw-bg-opacity));\n}\n.bg-indigo-400 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(141 162 251 / var(--tw-bg-opacity));\n}\n.bg-indigo-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(240 245 255 / var(--tw-bg-opacity));\n}\n.bg-indigo-50\\/60 {\n  background-color: rgb(240 245 255 / 0.6);\n}\n.bg-indigo-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(104 117 245 / var(--tw-bg-opacity));\n}\n.bg-indigo-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(88 80 236 / var(--tw-bg-opacity));\n}\n.bg-lime-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(236 252 203 / var(--tw-bg-opacity));\n}\n.bg-lime-400 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(163 230 53 / var(--tw-bg-opacity));\n}\n.bg-lime-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(101 163 13 / var(--tw-bg-opacity));\n}\n.bg-pink-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(252 232 243 / var(--tw-bg-opacity));\n}\n.bg-pink-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(231 70 148 / var(--tw-bg-opacity));\n}\n.bg-pink-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(214 31 105 / var(--tw-bg-opacity));\n}\n.bg-purple-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(237 235 254 / var(--tw-bg-opacity));\n}\n.bg-purple-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(246 245 255 / var(--tw-bg-opacity));\n}\n.bg-purple-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(126 58 242 / var(--tw-bg-opacity));\n}\n.bg-purple-700 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(108 43 217 / var(--tw-bg-opacity));\n}\n.bg-red-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(253 232 232 / var(--tw-bg-opacity));\n}\n.bg-red-400 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(249 128 128 / var(--tw-bg-opacity));\n}\n.bg-red-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(253 242 242 / var(--tw-bg-opacity));\n}\n.bg-red-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(240 82 82 / var(--tw-bg-opacity));\n}\n.bg-red-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(224 36 36 / var(--tw-bg-opacity));\n}\n.bg-red-700 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(200 30 30 / var(--tw-bg-opacity));\n}\n.bg-slate-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(241 245 249 / var(--tw-bg-opacity));\n}\n.bg-slate-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(226 232 240 / var(--tw-bg-opacity));\n}\n.bg-slate-300 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(203 213 225 / var(--tw-bg-opacity));\n}\n.bg-slate-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(248 250 252 / var(--tw-bg-opacity));\n}\n.bg-teal-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(213 245 246 / var(--tw-bg-opacity));\n}\n.bg-teal-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(4 116 129 / var(--tw-bg-opacity));\n}\n.bg-transparent {\n  background-color: transparent;\n}\n.bg-white {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 255 255 / var(--tw-bg-opacity));\n}\n.bg-white\\/30 {\n  background-color: rgb(255 255 255 / 0.3);\n}\n.bg-white\\/50 {\n  background-color: rgb(255 255 255 / 0.5);\n}\n.bg-yellow-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(253 246 178 / var(--tw-bg-opacity));\n}\n.bg-yellow-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(252 233 106 / var(--tw-bg-opacity));\n}\n.bg-yellow-400 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(227 160 8 / var(--tw-bg-opacity));\n}\n.bg-yellow-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(253 253 234 / var(--tw-bg-opacity));\n}\n.bg-yellow-50\\/30 {\n  background-color: rgb(253 253 234 / 0.3);\n}\n.bg-yellow-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(159 88 10 / var(--tw-bg-opacity));\n}\n.bg-opacity-50 {\n  --tw-bg-opacity: 0.5;\n}\n.bg-gradient-to-br {\n  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));\n}\n.bg-gradient-to-r {\n  background-image: linear-gradient(to right, var(--tw-gradient-stops));\n}\n.from-cyan-400 {\n  --tw-gradient-from: #22d3ee var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(34 211 238 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n}\n.from-cyan-500 {\n  --tw-gradient-from: #06b6d4 var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(6 182 212 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n}\n.from-green-400 {\n  --tw-gradient-from: #31C48D var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(49 196 141 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n}\n.from-lime-200 {\n  --tw-gradient-from: #d9f99d var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(217 249 157 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n}\n.from-pink-400 {\n  --tw-gradient-from: #F17EB8 var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(241 126 184 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n}\n.from-pink-500 {\n  --tw-gradient-from: #E74694 var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(231 70 148 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n}\n.from-purple-500 {\n  --tw-gradient-from: #9061F9 var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(144 97 249 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n}\n.from-purple-600 {\n  --tw-gradient-from: #7E3AF2 var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(126 58 242 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n}\n.from-red-200 {\n  --tw-gradient-from: #FBD5D5 var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(251 213 213 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n}\n.from-red-400 {\n  --tw-gradient-from: #F98080 var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(249 128 128 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n}\n.from-teal-200 {\n  --tw-gradient-from: #AFECEF var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(175 236 239 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n}\n.from-teal-400 {\n  --tw-gradient-from: #16BDCA var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(22 189 202 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n}\n.via-cyan-500 {\n  --tw-gradient-to: rgb(6 182 212 / 0)  var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), #06b6d4 var(--tw-gradient-via-position), var(--tw-gradient-to);\n}\n.via-cyan-600 {\n  --tw-gradient-to: rgb(8 145 178 / 0)  var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), #0891b2 var(--tw-gradient-via-position), var(--tw-gradient-to);\n}\n.via-green-500 {\n  --tw-gradient-to: rgb(14 159 110 / 0)  var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), #0E9F6E var(--tw-gradient-via-position), var(--tw-gradient-to);\n}\n.via-lime-400 {\n  --tw-gradient-to: rgb(163 230 53 / 0)  var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), #a3e635 var(--tw-gradient-via-position), var(--tw-gradient-to);\n}\n.via-pink-500 {\n  --tw-gradient-to: rgb(231 70 148 / 0)  var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), #E74694 var(--tw-gradient-via-position), var(--tw-gradient-to);\n}\n.via-purple-600 {\n  --tw-gradient-to: rgb(126 58 242 / 0)  var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), #7E3AF2 var(--tw-gradient-via-position), var(--tw-gradient-to);\n}\n.via-red-300 {\n  --tw-gradient-to: rgb(248 180 180 / 0)  var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), #F8B4B4 var(--tw-gradient-via-position), var(--tw-gradient-to);\n}\n.via-red-500 {\n  --tw-gradient-to: rgb(240 82 82 / 0)  var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), #F05252 var(--tw-gradient-via-position), var(--tw-gradient-to);\n}\n.via-teal-500 {\n  --tw-gradient-to: rgb(6 148 162 / 0)  var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), #0694A2 var(--tw-gradient-via-position), var(--tw-gradient-to);\n}\n.to-cyan-500 {\n  --tw-gradient-to: #06b6d4 var(--tw-gradient-to-position);\n}\n.to-cyan-600 {\n  --tw-gradient-to: #0891b2 var(--tw-gradient-to-position);\n}\n.to-cyan-700 {\n  --tw-gradient-to: #0e7490 var(--tw-gradient-to-position);\n}\n.to-green-600 {\n  --tw-gradient-to: #057A55 var(--tw-gradient-to-position);\n}\n.to-lime-200 {\n  --tw-gradient-to: #d9f99d var(--tw-gradient-to-position);\n}\n.to-lime-500 {\n  --tw-gradient-to: #84cc16 var(--tw-gradient-to-position);\n}\n.to-orange-400 {\n  --tw-gradient-to: #FF8A4C var(--tw-gradient-to-position);\n}\n.to-pink-500 {\n  --tw-gradient-to: #E74694 var(--tw-gradient-to-position);\n}\n.to-pink-600 {\n  --tw-gradient-to: #D61F69 var(--tw-gradient-to-position);\n}\n.to-purple-700 {\n  --tw-gradient-to: #6C2BD9 var(--tw-gradient-to-position);\n}\n.to-red-600 {\n  --tw-gradient-to: #E02424 var(--tw-gradient-to-position);\n}\n.to-teal-600 {\n  --tw-gradient-to: #047481 var(--tw-gradient-to-position);\n}\n.to-yellow-200 {\n  --tw-gradient-to: #FCE96A var(--tw-gradient-to-position);\n}\n.fill-current {\n  fill: currentColor;\n}\n.fill-cyan-600 {\n  fill: #0891b2;\n}\n.fill-gray-600 {\n  fill: #4B5563;\n}\n.fill-green-500 {\n  fill: #0E9F6E;\n}\n.fill-pink-600 {\n  fill: #D61F69;\n}\n.fill-purple-600 {\n  fill: #7E3AF2;\n}\n.fill-red-600 {\n  fill: #E02424;\n}\n.fill-yellow-400 {\n  fill: #E3A008;\n}\n.object-cover {\n  -o-object-fit: cover;\n     object-fit: cover;\n}\n.p-0 {\n  padding: 0px;\n}\n.p-0\\.5 {\n  padding: 0.125rem;\n}\n.p-1 {\n  padding: 0.25rem;\n}\n.p-1\\.5 {\n  padding: 0.375rem;\n}\n.p-2 {\n  padding: 0.5rem;\n}\n.p-2\\.5 {\n  padding: 0.625rem;\n}\n.p-3 {\n  padding: 0.75rem;\n}\n.p-4 {\n  padding: 1rem;\n}\n.p-5 {\n  padding: 1.25rem;\n}\n.p-6 {\n  padding: 1.5rem;\n}\n.p-8 {\n  padding: 2rem;\n}\n.px-0 {\n  padding-left: 0px;\n  padding-right: 0px;\n}\n.px-0\\.5 {\n  padding-left: 0.125rem;\n  padding-right: 0.125rem;\n}\n.px-1 {\n  padding-left: 0.25rem;\n  padding-right: 0.25rem;\n}\n.px-1\\.5 {\n  padding-left: 0.375rem;\n  padding-right: 0.375rem;\n}\n.px-10 {\n  padding-left: 2.5rem;\n  padding-right: 2.5rem;\n}\n.px-2 {\n  padding-left: 0.5rem;\n  padding-right: 0.5rem;\n}\n.px-2\\.5 {\n  padding-left: 0.625rem;\n  padding-right: 0.625rem;\n}\n.px-3 {\n  padding-left: 0.75rem;\n  padding-right: 0.75rem;\n}\n.px-4 {\n  padding-left: 1rem;\n  padding-right: 1rem;\n}\n.px-5 {\n  padding-left: 1.25rem;\n  padding-right: 1.25rem;\n}\n.px-6 {\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n}\n.px-8 {\n  padding-left: 2rem;\n  padding-right: 2rem;\n}\n.py-0 {\n  padding-top: 0px;\n  padding-bottom: 0px;\n}\n.py-0\\.5 {\n  padding-top: 0.125rem;\n  padding-bottom: 0.125rem;\n}\n.py-1 {\n  padding-top: 0.25rem;\n  padding-bottom: 0.25rem;\n}\n.py-1\\.5 {\n  padding-top: 0.375rem;\n  padding-bottom: 0.375rem;\n}\n.py-2 {\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n}\n.py-2\\.5 {\n  padding-top: 0.625rem;\n  padding-bottom: 0.625rem;\n}\n.py-3 {\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem;\n}\n.py-4 {\n  padding-top: 1rem;\n  padding-bottom: 1rem;\n}\n.pb-2 {\n  padding-bottom: 0.5rem;\n}\n.pb-2\\.5 {\n  padding-bottom: 0.625rem;\n}\n.pb-20 {\n  padding-bottom: 5rem;\n}\n.pb-3 {\n  padding-bottom: 0.75rem;\n}\n.pe-4 {\n  padding-inline-end: 1rem;\n}\n.pl-0 {\n  padding-left: 0px;\n}\n.pl-10 {\n  padding-left: 2.5rem;\n}\n.pl-12 {\n  padding-left: 3rem;\n}\n.pl-16 {\n  padding-left: 4rem;\n}\n.pl-2 {\n  padding-left: 0.5rem;\n}\n.pl-2\\.5 {\n  padding-left: 0.625rem;\n}\n.pl-20 {\n  padding-left: 5rem;\n}\n.pl-3 {\n  padding-left: 0.75rem;\n}\n.pl-8 {\n  padding-left: 2rem;\n}\n.pl-9 {\n  padding-left: 2.25rem;\n}\n.pr-10 {\n  padding-right: 2.5rem;\n}\n.pr-3 {\n  padding-right: 0.75rem;\n}\n.pr-4 {\n  padding-right: 1rem;\n}\n.ps-4 {\n  padding-inline-start: 1rem;\n}\n.ps-5 {\n  padding-inline-start: 1.25rem;\n}\n.pt-0 {\n  padding-top: 0px;\n}\n.pt-2 {\n  padding-top: 0.5rem;\n}\n.pt-4 {\n  padding-top: 1rem;\n}\n.pt-5 {\n  padding-top: 1.25rem;\n}\n.text-left {\n  text-align: left;\n}\n.text-center {\n  text-align: center;\n}\n.font-mono {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;\n}\n.font-sans {\n  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";\n}\n.text-2xl {\n  font-size: 1.5rem;\n  line-height: 2rem;\n}\n.text-\\[10px\\] {\n  font-size: 10px;\n}\n.text-base {\n  font-size: 1rem;\n  line-height: 1.5rem;\n}\n.text-lg {\n  font-size: 1.125rem;\n  line-height: 1.75rem;\n}\n.text-sm {\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n}\n.text-xl {\n  font-size: 1.25rem;\n  line-height: 1.75rem;\n}\n.text-xs {\n  font-size: 0.75rem;\n  line-height: 1rem;\n}\n.font-bold {\n  font-weight: 700;\n}\n.font-medium {\n  font-weight: 500;\n}\n.font-normal {\n  font-weight: 400;\n}\n.font-semibold {\n  font-weight: 600;\n}\n.uppercase {\n  text-transform: uppercase;\n}\n.lowercase {\n  text-transform: lowercase;\n}\n.capitalize {\n  text-transform: capitalize;\n}\n.italic {\n  font-style: italic;\n}\n.leading-6 {\n  line-height: 1.5rem;\n}\n.leading-9 {\n  line-height: 2.25rem;\n}\n.leading-none {\n  line-height: 1;\n}\n.leading-relaxed {\n  line-height: 1.625;\n}\n.leading-snug {\n  line-height: 1.375;\n}\n.leading-tight {\n  line-height: 1.25;\n}\n.tracking-tight {\n  letter-spacing: -0.025em;\n}\n.tracking-wider {\n  letter-spacing: 0.05em;\n}\n.text-amber-500 {\n  --tw-text-opacity: 1;\n  color: rgb(245 158 11 / var(--tw-text-opacity));\n}\n.text-black {\n  --tw-text-opacity: 1;\n  color: rgb(0 0 0 / var(--tw-text-opacity));\n}\n.text-blue-500 {\n  --tw-text-opacity: 1;\n  color: rgb(63 131 248 / var(--tw-text-opacity));\n}\n.text-blue-700 {\n  --tw-text-opacity: 1;\n  color: rgb(26 86 219 / var(--tw-text-opacity));\n}\n.text-blue-800 {\n  --tw-text-opacity: 1;\n  color: rgb(30 66 159 / var(--tw-text-opacity));\n}\n.text-cyan-300 {\n  --tw-text-opacity: 1;\n  color: rgb(103 232 249 / var(--tw-text-opacity));\n}\n.text-cyan-500 {\n  --tw-text-opacity: 1;\n  color: rgb(6 182 212 / var(--tw-text-opacity));\n}\n.text-cyan-600 {\n  --tw-text-opacity: 1;\n  color: rgb(8 145 178 / var(--tw-text-opacity));\n}\n.text-cyan-700 {\n  --tw-text-opacity: 1;\n  color: rgb(14 116 144 / var(--tw-text-opacity));\n}\n.text-cyan-800 {\n  --tw-text-opacity: 1;\n  color: rgb(21 94 117 / var(--tw-text-opacity));\n}\n.text-cyan-900 {\n  --tw-text-opacity: 1;\n  color: rgb(22 78 99 / var(--tw-text-opacity));\n}\n.text-emerald-500 {\n  --tw-text-opacity: 1;\n  color: rgb(16 185 129 / var(--tw-text-opacity));\n}\n.text-gray-100 {\n  --tw-text-opacity: 1;\n  color: rgb(243 244 246 / var(--tw-text-opacity));\n}\n.text-gray-200 {\n  --tw-text-opacity: 1;\n  color: rgb(229 231 235 / var(--tw-text-opacity));\n}\n.text-gray-300 {\n  --tw-text-opacity: 1;\n  color: rgb(209 213 219 / var(--tw-text-opacity));\n}\n.text-gray-400 {\n  --tw-text-opacity: 1;\n  color: rgb(156 163 175 / var(--tw-text-opacity));\n}\n.text-gray-500 {\n  --tw-text-opacity: 1;\n  color: rgb(107 114 128 / var(--tw-text-opacity));\n}\n.text-gray-600 {\n  --tw-text-opacity: 1;\n  color: rgb(75 85 99 / var(--tw-text-opacity));\n}\n.text-gray-700 {\n  --tw-text-opacity: 1;\n  color: rgb(55 65 81 / var(--tw-text-opacity));\n}\n.text-gray-800 {\n  --tw-text-opacity: 1;\n  color: rgb(31 41 55 / var(--tw-text-opacity));\n}\n.text-gray-900 {\n  --tw-text-opacity: 1;\n  color: rgb(17 24 39 / var(--tw-text-opacity));\n}\n.text-green-500 {\n  --tw-text-opacity: 1;\n  color: rgb(14 159 110 / var(--tw-text-opacity));\n}\n.text-green-600 {\n  --tw-text-opacity: 1;\n  color: rgb(5 122 85 / var(--tw-text-opacity));\n}\n.text-green-700 {\n  --tw-text-opacity: 1;\n  color: rgb(4 108 78 / var(--tw-text-opacity));\n}\n.text-green-800 {\n  --tw-text-opacity: 1;\n  color: rgb(3 84 63 / var(--tw-text-opacity));\n}\n.text-green-900 {\n  --tw-text-opacity: 1;\n  color: rgb(1 71 55 / var(--tw-text-opacity));\n}\n.text-indigo-100 {\n  --tw-text-opacity: 1;\n  color: rgb(229 237 255 / var(--tw-text-opacity));\n}\n.text-indigo-50 {\n  --tw-text-opacity: 1;\n  color: rgb(240 245 255 / var(--tw-text-opacity));\n}\n.text-indigo-500 {\n  --tw-text-opacity: 1;\n  color: rgb(104 117 245 / var(--tw-text-opacity));\n}\n.text-indigo-600 {\n  --tw-text-opacity: 1;\n  color: rgb(88 80 236 / var(--tw-text-opacity));\n}\n.text-indigo-700 {\n  --tw-text-opacity: 1;\n  color: rgb(81 69 205 / var(--tw-text-opacity));\n}\n.text-indigo-800 {\n  --tw-text-opacity: 1;\n  color: rgb(66 56 157 / var(--tw-text-opacity));\n}\n.text-indigo-900 {\n  --tw-text-opacity: 1;\n  color: rgb(54 47 120 / var(--tw-text-opacity));\n}\n.text-lime-500 {\n  --tw-text-opacity: 1;\n  color: rgb(132 204 22 / var(--tw-text-opacity));\n}\n.text-lime-700 {\n  --tw-text-opacity: 1;\n  color: rgb(77 124 15 / var(--tw-text-opacity));\n}\n.text-lime-800 {\n  --tw-text-opacity: 1;\n  color: rgb(63 98 18 / var(--tw-text-opacity));\n}\n.text-lime-900 {\n  --tw-text-opacity: 1;\n  color: rgb(54 83 20 / var(--tw-text-opacity));\n}\n.text-pink-500 {\n  --tw-text-opacity: 1;\n  color: rgb(231 70 148 / var(--tw-text-opacity));\n}\n.text-pink-600 {\n  --tw-text-opacity: 1;\n  color: rgb(214 31 105 / var(--tw-text-opacity));\n}\n.text-pink-700 {\n  --tw-text-opacity: 1;\n  color: rgb(191 18 93 / var(--tw-text-opacity));\n}\n.text-pink-800 {\n  --tw-text-opacity: 1;\n  color: rgb(153 21 75 / var(--tw-text-opacity));\n}\n.text-pink-900 {\n  --tw-text-opacity: 1;\n  color: rgb(117 26 61 / var(--tw-text-opacity));\n}\n.text-purple-500 {\n  --tw-text-opacity: 1;\n  color: rgb(144 97 249 / var(--tw-text-opacity));\n}\n.text-purple-600 {\n  --tw-text-opacity: 1;\n  color: rgb(126 58 242 / var(--tw-text-opacity));\n}\n.text-purple-700 {\n  --tw-text-opacity: 1;\n  color: rgb(108 43 217 / var(--tw-text-opacity));\n}\n.text-purple-800 {\n  --tw-text-opacity: 1;\n  color: rgb(85 33 181 / var(--tw-text-opacity));\n}\n.text-red-500 {\n  --tw-text-opacity: 1;\n  color: rgb(240 82 82 / var(--tw-text-opacity));\n}\n.text-red-600 {\n  --tw-text-opacity: 1;\n  color: rgb(224 36 36 / var(--tw-text-opacity));\n}\n.text-red-700 {\n  --tw-text-opacity: 1;\n  color: rgb(200 30 30 / var(--tw-text-opacity));\n}\n.text-red-800 {\n  --tw-text-opacity: 1;\n  color: rgb(155 28 28 / var(--tw-text-opacity));\n}\n.text-red-900 {\n  --tw-text-opacity: 1;\n  color: rgb(119 29 29 / var(--tw-text-opacity));\n}\n.text-slate-200 {\n  --tw-text-opacity: 1;\n  color: rgb(226 232 240 / var(--tw-text-opacity));\n}\n.text-slate-300 {\n  --tw-text-opacity: 1;\n  color: rgb(203 213 225 / var(--tw-text-opacity));\n}\n.text-slate-400 {\n  --tw-text-opacity: 1;\n  color: rgb(148 163 184 / var(--tw-text-opacity));\n}\n.text-slate-500 {\n  --tw-text-opacity: 1;\n  color: rgb(100 116 139 / var(--tw-text-opacity));\n}\n.text-slate-600 {\n  --tw-text-opacity: 1;\n  color: rgb(71 85 105 / var(--tw-text-opacity));\n}\n.text-slate-700 {\n  --tw-text-opacity: 1;\n  color: rgb(51 65 85 / var(--tw-text-opacity));\n}\n.text-slate-800 {\n  --tw-text-opacity: 1;\n  color: rgb(30 41 59 / var(--tw-text-opacity));\n}\n.text-slate-900 {\n  --tw-text-opacity: 1;\n  color: rgb(15 23 42 / var(--tw-text-opacity));\n}\n.text-teal-500 {\n  --tw-text-opacity: 1;\n  color: rgb(6 148 162 / var(--tw-text-opacity));\n}\n.text-teal-600 {\n  --tw-text-opacity: 1;\n  color: rgb(4 116 129 / var(--tw-text-opacity));\n}\n.text-teal-700 {\n  --tw-text-opacity: 1;\n  color: rgb(3 102 114 / var(--tw-text-opacity));\n}\n.text-teal-800 {\n  --tw-text-opacity: 1;\n  color: rgb(5 80 92 / var(--tw-text-opacity));\n}\n.text-teal-900 {\n  --tw-text-opacity: 1;\n  color: rgb(1 68 81 / var(--tw-text-opacity));\n}\n.text-white {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity));\n}\n.text-yellow-400 {\n  --tw-text-opacity: 1;\n  color: rgb(227 160 8 / var(--tw-text-opacity));\n}\n.text-yellow-500 {\n  --tw-text-opacity: 1;\n  color: rgb(194 120 3 / var(--tw-text-opacity));\n}\n.text-yellow-700 {\n  --tw-text-opacity: 1;\n  color: rgb(142 75 16 / var(--tw-text-opacity));\n}\n.text-yellow-800 {\n  --tw-text-opacity: 1;\n  color: rgb(114 59 19 / var(--tw-text-opacity));\n}\n.text-yellow-900 {\n  --tw-text-opacity: 1;\n  color: rgb(99 49 18 / var(--tw-text-opacity));\n}\n.underline {\n  text-decoration-line: underline;\n}\n.placeholder-cyan-700::-moz-placeholder {\n  --tw-placeholder-opacity: 1;\n  color: rgb(14 116 144 / var(--tw-placeholder-opacity));\n}\n.placeholder-cyan-700::placeholder {\n  --tw-placeholder-opacity: 1;\n  color: rgb(14 116 144 / var(--tw-placeholder-opacity));\n}\n.placeholder-green-700::-moz-placeholder {\n  --tw-placeholder-opacity: 1;\n  color: rgb(4 108 78 / var(--tw-placeholder-opacity));\n}\n.placeholder-green-700::placeholder {\n  --tw-placeholder-opacity: 1;\n  color: rgb(4 108 78 / var(--tw-placeholder-opacity));\n}\n.placeholder-red-700::-moz-placeholder {\n  --tw-placeholder-opacity: 1;\n  color: rgb(200 30 30 / var(--tw-placeholder-opacity));\n}\n.placeholder-red-700::placeholder {\n  --tw-placeholder-opacity: 1;\n  color: rgb(200 30 30 / var(--tw-placeholder-opacity));\n}\n.placeholder-yellow-700::-moz-placeholder {\n  --tw-placeholder-opacity: 1;\n  color: rgb(142 75 16 / var(--tw-placeholder-opacity));\n}\n.placeholder-yellow-700::placeholder {\n  --tw-placeholder-opacity: 1;\n  color: rgb(142 75 16 / var(--tw-placeholder-opacity));\n}\n.opacity-0 {\n  opacity: 0;\n}\n.opacity-30 {\n  opacity: 0.3;\n}\n.opacity-50 {\n  opacity: 0.5;\n}\n.mix-blend-lighten {\n  mix-blend-mode: lighten;\n}\n.shadow {\n  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n.shadow-lg {\n  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n.shadow-md {\n  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n.shadow-sm {\n  --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);\n  --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n.shadow-xl {\n  --tw-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n.outline-none {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n}\n.outline {\n  outline-style: solid;\n}\n.ring-2 {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n}\n.ring-8 {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(8px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n}\n.ring-cyan-400 {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(34 211 238 / var(--tw-ring-opacity));\n}\n.ring-cyan-700 {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(14 116 144 / var(--tw-ring-opacity));\n}\n.ring-gray-300 {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(209 213 219 / var(--tw-ring-opacity));\n}\n.ring-gray-500 {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(107 114 128 / var(--tw-ring-opacity));\n}\n.ring-gray-800 {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(31 41 55 / var(--tw-ring-opacity));\n}\n.ring-green-500 {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(14 159 110 / var(--tw-ring-opacity));\n}\n.ring-pink-500 {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(231 70 148 / var(--tw-ring-opacity));\n}\n.ring-purple-500 {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(144 97 249 / var(--tw-ring-opacity));\n}\n.ring-red-500 {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(240 82 82 / var(--tw-ring-opacity));\n}\n.ring-white {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(255 255 255 / var(--tw-ring-opacity));\n}\n.ring-yellow-300 {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(250 202 21 / var(--tw-ring-opacity));\n}\n.blur {\n  --tw-blur: blur(8px);\n  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);\n}\n.drop-shadow-md {\n  --tw-drop-shadow: drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06));\n  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);\n}\n.filter {\n  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);\n}\n.backdrop-blur-sm {\n  --tw-backdrop-blur: blur(4px);\n  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);\n          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);\n}\n.backdrop-filter {\n  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);\n          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);\n}\n.transition {\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\n.transition-\\[color\\2c background-color\\2c border-color\\2c text-decoration-color\\2c fill\\2c stroke\\2c box-shadow\\] {\n  transition-property: color,background-color,border-color,text-decoration-color,fill,stroke,box-shadow;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\n.transition-all {\n  transition-property: all;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\n.transition-colors {\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\n.transition-opacity {\n  transition-property: opacity;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\n.transition-transform {\n  transition-property: transform;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\n.delay-0 {\n  transition-delay: 0s;\n}\n.duration-100 {\n  transition-duration: 100ms;\n}\n.duration-1000 {\n  transition-duration: 1000ms;\n}\n.duration-150 {\n  transition-duration: 150ms;\n}\n.duration-200 {\n  transition-duration: 200ms;\n}\n.duration-300 {\n  transition-duration: 300ms;\n}\n.duration-500 {\n  transition-duration: 500ms;\n}\n.duration-700 {\n  transition-duration: 700ms;\n}\n.duration-75 {\n  transition-duration: 75ms;\n}\n.ease-in {\n  transition-timing-function: cubic-bezier(0.4, 0, 1, 1);\n}\n.ease-in-out {\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n}\n.ease-out {\n  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);\n}\n.\\[overflow\\:-moz-scrollbars-none\\] {\n  overflow: -moz-scrollbars-none;\n}\n.\\[scrollbar-width\\:none\\] {\n  scrollbar-width: none;\n}\n.after\\:absolute::after {\n  content: var(--tw-content);\n  position: absolute;\n}\n.after\\:left-\\[2px\\]::after {\n  content: var(--tw-content);\n  left: 2px;\n}\n.after\\:left-\\[4px\\]::after {\n  content: var(--tw-content);\n  left: 4px;\n}\n.after\\:top-0::after {\n  content: var(--tw-content);\n  top: 0px;\n}\n.after\\:top-0\\.5::after {\n  content: var(--tw-content);\n  top: 0.125rem;\n}\n.after\\:top-\\[2px\\]::after {\n  content: var(--tw-content);\n  top: 2px;\n}\n.after\\:h-4::after {\n  content: var(--tw-content);\n  height: 1rem;\n}\n.after\\:h-5::after {\n  content: var(--tw-content);\n  height: 1.25rem;\n}\n.after\\:h-6::after {\n  content: var(--tw-content);\n  height: 1.5rem;\n}\n.after\\:w-4::after {\n  content: var(--tw-content);\n  width: 1rem;\n}\n.after\\:w-5::after {\n  content: var(--tw-content);\n  width: 1.25rem;\n}\n.after\\:w-6::after {\n  content: var(--tw-content);\n  width: 1.5rem;\n}\n.after\\:translate-x-full::after {\n  content: var(--tw-content);\n  --tw-translate-x: 100%;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.after\\:border-white::after {\n  content: var(--tw-content);\n  --tw-border-opacity: 1;\n  border-color: rgb(255 255 255 / var(--tw-border-opacity));\n}\n.first\\:ml-0:first-child {\n  margin-left: 0px;\n}\n.first\\:mt-0:first-child {\n  margin-top: 0px;\n}\n.first\\:rounded-t-lg:first-child {\n  border-top-left-radius: 0.5rem;\n  border-top-right-radius: 0.5rem;\n}\n.first\\:border-t-0:first-child {\n  border-top-width: 0px;\n}\n.first\\:pt-0:first-child {\n  padding-top: 0px;\n}\n.last\\:mr-0:last-child {\n  margin-right: 0px;\n}\n.last\\:rounded-b-lg:last-child {\n  border-bottom-right-radius: 0.5rem;\n  border-bottom-left-radius: 0.5rem;\n}\n.odd\\:bg-white:nth-child(odd) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 255 255 / var(--tw-bg-opacity));\n}\n.even\\:bg-gray-50:nth-child(even) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(249 250 251 / var(--tw-bg-opacity));\n}\n.hover\\:cursor-not-allowed:hover {\n  cursor: not-allowed;\n}\n.hover\\:border-gray-300:hover {\n  --tw-border-opacity: 1;\n  border-color: rgb(209 213 219 / var(--tw-border-opacity));\n}\n.hover\\:bg-blue-200:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(195 221 253 / var(--tw-bg-opacity));\n}\n.hover\\:bg-cyan-100:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(207 250 254 / var(--tw-bg-opacity));\n}\n.hover\\:bg-cyan-200:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(165 243 252 / var(--tw-bg-opacity));\n}\n.hover\\:bg-cyan-600:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(8 145 178 / var(--tw-bg-opacity));\n}\n.hover\\:bg-cyan-800:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(21 94 117 / var(--tw-bg-opacity));\n}\n.hover\\:bg-gray-100:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(243 244 246 / var(--tw-bg-opacity));\n}\n.hover\\:bg-gray-200:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(229 231 235 / var(--tw-bg-opacity));\n}\n.hover\\:bg-gray-50:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(249 250 251 / var(--tw-bg-opacity));\n}\n.hover\\:bg-gray-600:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(75 85 99 / var(--tw-bg-opacity));\n}\n.hover\\:bg-green-200:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(188 240 218 / var(--tw-bg-opacity));\n}\n.hover\\:bg-indigo-200:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(205 219 254 / var(--tw-bg-opacity));\n}\n.hover\\:bg-indigo-600:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(88 80 236 / var(--tw-bg-opacity));\n}\n.hover\\:bg-indigo-700:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(81 69 205 / var(--tw-bg-opacity));\n}\n.hover\\:bg-lime-200:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(217 249 157 / var(--tw-bg-opacity));\n}\n.hover\\:bg-pink-200:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(250 209 232 / var(--tw-bg-opacity));\n}\n.hover\\:bg-purple-200:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(220 215 254 / var(--tw-bg-opacity));\n}\n.hover\\:bg-red-200:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(251 213 213 / var(--tw-bg-opacity));\n}\n.hover\\:bg-red-50:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(253 242 242 / var(--tw-bg-opacity));\n}\n.hover\\:bg-red-600:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(224 36 36 / var(--tw-bg-opacity));\n}\n.hover\\:bg-slate-100:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(241 245 249 / var(--tw-bg-opacity));\n}\n.hover\\:bg-slate-200:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(226 232 240 / var(--tw-bg-opacity));\n}\n.hover\\:bg-slate-50:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(248 250 252 / var(--tw-bg-opacity));\n}\n.hover\\:bg-teal-200:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(175 236 239 / var(--tw-bg-opacity));\n}\n.hover\\:bg-white:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 255 255 / var(--tw-bg-opacity));\n}\n.hover\\:bg-yellow-200:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(252 233 106 / var(--tw-bg-opacity));\n}\n.hover\\:bg-gradient-to-br:hover {\n  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));\n}\n.hover\\:text-cyan-700:hover {\n  --tw-text-opacity: 1;\n  color: rgb(14 116 144 / var(--tw-text-opacity));\n}\n.hover\\:text-gray-600:hover {\n  --tw-text-opacity: 1;\n  color: rgb(75 85 99 / var(--tw-text-opacity));\n}\n.hover\\:text-gray-700:hover {\n  --tw-text-opacity: 1;\n  color: rgb(55 65 81 / var(--tw-text-opacity));\n}\n.hover\\:text-gray-900:hover {\n  --tw-text-opacity: 1;\n  color: rgb(17 24 39 / var(--tw-text-opacity));\n}\n.hover\\:text-indigo-600:hover {\n  --tw-text-opacity: 1;\n  color: rgb(88 80 236 / var(--tw-text-opacity));\n}\n.hover\\:text-indigo-700:hover {\n  --tw-text-opacity: 1;\n  color: rgb(81 69 205 / var(--tw-text-opacity));\n}\n.hover\\:text-red-500:hover {\n  --tw-text-opacity: 1;\n  color: rgb(240 82 82 / var(--tw-text-opacity));\n}\n.hover\\:text-red-600:hover {\n  --tw-text-opacity: 1;\n  color: rgb(224 36 36 / var(--tw-text-opacity));\n}\n.hover\\:text-slate-700:hover {\n  --tw-text-opacity: 1;\n  color: rgb(51 65 85 / var(--tw-text-opacity));\n}\n.hover\\:underline:hover {\n  text-decoration-line: underline;\n}\n.focus\\:z-10:focus {\n  z-index: 10;\n}\n.focus\\:border-blue-600:focus {\n  --tw-border-opacity: 1;\n  border-color: rgb(28 100 242 / var(--tw-border-opacity));\n}\n.focus\\:border-cyan-500:focus {\n  --tw-border-opacity: 1;\n  border-color: rgb(6 182 212 / var(--tw-border-opacity));\n}\n.focus\\:border-green-500:focus {\n  --tw-border-opacity: 1;\n  border-color: rgb(14 159 110 / var(--tw-border-opacity));\n}\n.focus\\:border-green-600:focus {\n  --tw-border-opacity: 1;\n  border-color: rgb(5 122 85 / var(--tw-border-opacity));\n}\n.focus\\:border-indigo-400:focus {\n  --tw-border-opacity: 1;\n  border-color: rgb(141 162 251 / var(--tw-border-opacity));\n}\n.focus\\:border-red-500:focus {\n  --tw-border-opacity: 1;\n  border-color: rgb(240 82 82 / var(--tw-border-opacity));\n}\n.focus\\:border-red-600:focus {\n  --tw-border-opacity: 1;\n  border-color: rgb(224 36 36 / var(--tw-border-opacity));\n}\n.focus\\:border-yellow-500:focus {\n  --tw-border-opacity: 1;\n  border-color: rgb(194 120 3 / var(--tw-border-opacity));\n}\n.focus\\:bg-gray-100:focus {\n  --tw-bg-opacity: 1;\n  background-color: rgb(243 244 246 / var(--tw-bg-opacity));\n}\n.focus\\:text-cyan-700:focus {\n  --tw-text-opacity: 1;\n  color: rgb(14 116 144 / var(--tw-text-opacity));\n}\n.focus\\:text-gray-900:focus {\n  --tw-text-opacity: 1;\n  color: rgb(17 24 39 / var(--tw-text-opacity));\n}\n.focus\\:outline-none:focus {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n}\n.focus\\:ring-0:focus {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n}\n.focus\\:ring-1:focus {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n}\n.focus\\:ring-2:focus {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n}\n.focus\\:ring-4:focus {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n}\n.focus\\:ring-blue-300:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(164 202 254 / var(--tw-ring-opacity));\n}\n.focus\\:ring-blue-400:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(118 169 250 / var(--tw-ring-opacity));\n}\n.focus\\:ring-blue-600:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(28 100 242 / var(--tw-ring-opacity));\n}\n.focus\\:ring-cyan-300:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(103 232 249 / var(--tw-ring-opacity));\n}\n.focus\\:ring-cyan-400:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(34 211 238 / var(--tw-ring-opacity));\n}\n.focus\\:ring-cyan-500:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(6 182 212 / var(--tw-ring-opacity));\n}\n.focus\\:ring-cyan-600:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(8 145 178 / var(--tw-ring-opacity));\n}\n.focus\\:ring-cyan-700:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(14 116 144 / var(--tw-ring-opacity));\n}\n.focus\\:ring-cyan-800:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(21 94 117 / var(--tw-ring-opacity));\n}\n.focus\\:ring-gray-200:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(229 231 235 / var(--tw-ring-opacity));\n}\n.focus\\:ring-gray-300:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(209 213 219 / var(--tw-ring-opacity));\n}\n.focus\\:ring-gray-400:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(156 163 175 / var(--tw-ring-opacity));\n}\n.focus\\:ring-gray-800:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(31 41 55 / var(--tw-ring-opacity));\n}\n.focus\\:ring-gray-900:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(17 24 39 / var(--tw-ring-opacity));\n}\n.focus\\:ring-green-200:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(188 240 218 / var(--tw-ring-opacity));\n}\n.focus\\:ring-green-300:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(132 225 188 / var(--tw-ring-opacity));\n}\n.focus\\:ring-green-400:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(49 196 141 / var(--tw-ring-opacity));\n}\n.focus\\:ring-green-500:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(14 159 110 / var(--tw-ring-opacity));\n}\n.focus\\:ring-green-600:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(5 122 85 / var(--tw-ring-opacity));\n}\n.focus\\:ring-green-800:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(3 84 63 / var(--tw-ring-opacity));\n}\n.focus\\:ring-indigo-300:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(180 198 252 / var(--tw-ring-opacity));\n}\n.focus\\:ring-indigo-400:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(141 162 251 / var(--tw-ring-opacity));\n}\n.focus\\:ring-indigo-500:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(104 117 245 / var(--tw-ring-opacity));\n}\n.focus\\:ring-indigo-500\\/50:focus {\n  --tw-ring-color: rgb(104 117 245 / 0.5);\n}\n.focus\\:ring-indigo-700:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(81 69 205 / var(--tw-ring-opacity));\n}\n.focus\\:ring-lime-200:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(217 249 157 / var(--tw-ring-opacity));\n}\n.focus\\:ring-lime-300:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(190 242 100 / var(--tw-ring-opacity));\n}\n.focus\\:ring-lime-400:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(163 230 53 / var(--tw-ring-opacity));\n}\n.focus\\:ring-lime-700:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(77 124 15 / var(--tw-ring-opacity));\n}\n.focus\\:ring-pink-200:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(250 209 232 / var(--tw-ring-opacity));\n}\n.focus\\:ring-pink-300:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(248 180 217 / var(--tw-ring-opacity));\n}\n.focus\\:ring-pink-400:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(241 126 184 / var(--tw-ring-opacity));\n}\n.focus\\:ring-pink-600:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(214 31 105 / var(--tw-ring-opacity));\n}\n.focus\\:ring-purple-200:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(220 215 254 / var(--tw-ring-opacity));\n}\n.focus\\:ring-purple-300:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(202 191 253 / var(--tw-ring-opacity));\n}\n.focus\\:ring-purple-400:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(172 148 250 / var(--tw-ring-opacity));\n}\n.focus\\:ring-purple-600:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(126 58 242 / var(--tw-ring-opacity));\n}\n.focus\\:ring-red-100:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(253 232 232 / var(--tw-ring-opacity));\n}\n.focus\\:ring-red-300:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(248 180 180 / var(--tw-ring-opacity));\n}\n.focus\\:ring-red-400:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(249 128 128 / var(--tw-ring-opacity));\n}\n.focus\\:ring-red-500:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(240 82 82 / var(--tw-ring-opacity));\n}\n.focus\\:ring-red-600:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(224 36 36 / var(--tw-ring-opacity));\n}\n.focus\\:ring-red-900:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(119 29 29 / var(--tw-ring-opacity));\n}\n.focus\\:ring-teal-300:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(126 220 226 / var(--tw-ring-opacity));\n}\n.focus\\:ring-teal-400:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(22 189 202 / var(--tw-ring-opacity));\n}\n.focus\\:ring-teal-600:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(4 116 129 / var(--tw-ring-opacity));\n}\n.focus\\:ring-yellow-300:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(250 202 21 / var(--tw-ring-opacity));\n}\n.focus\\:ring-yellow-400:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(227 160 8 / var(--tw-ring-opacity));\n}\n.focus\\:ring-yellow-500:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(194 120 3 / var(--tw-ring-opacity));\n}\n.enabled\\:hover\\:bg-blue-800:hover:enabled {\n  --tw-bg-opacity: 1;\n  background-color: rgb(30 66 159 / var(--tw-bg-opacity));\n}\n.enabled\\:hover\\:bg-cyan-100:hover:enabled {\n  --tw-bg-opacity: 1;\n  background-color: rgb(207 250 254 / var(--tw-bg-opacity));\n}\n.enabled\\:hover\\:bg-cyan-800:hover:enabled {\n  --tw-bg-opacity: 1;\n  background-color: rgb(21 94 117 / var(--tw-bg-opacity));\n}\n.enabled\\:hover\\:bg-gray-100:hover:enabled {\n  --tw-bg-opacity: 1;\n  background-color: rgb(243 244 246 / var(--tw-bg-opacity));\n}\n.enabled\\:hover\\:bg-gray-900:hover:enabled {\n  --tw-bg-opacity: 1;\n  background-color: rgb(17 24 39 / var(--tw-bg-opacity));\n}\n.enabled\\:hover\\:bg-green-100:hover:enabled {\n  --tw-bg-opacity: 1;\n  background-color: rgb(222 247 236 / var(--tw-bg-opacity));\n}\n.enabled\\:hover\\:bg-green-800:hover:enabled {\n  --tw-bg-opacity: 1;\n  background-color: rgb(3 84 63 / var(--tw-bg-opacity));\n}\n.enabled\\:hover\\:bg-indigo-100:hover:enabled {\n  --tw-bg-opacity: 1;\n  background-color: rgb(229 237 255 / var(--tw-bg-opacity));\n}\n.enabled\\:hover\\:bg-lime-100:hover:enabled {\n  --tw-bg-opacity: 1;\n  background-color: rgb(236 252 203 / var(--tw-bg-opacity));\n}\n.enabled\\:hover\\:bg-pink-100:hover:enabled {\n  --tw-bg-opacity: 1;\n  background-color: rgb(252 232 243 / var(--tw-bg-opacity));\n}\n.enabled\\:hover\\:bg-purple-800:hover:enabled {\n  --tw-bg-opacity: 1;\n  background-color: rgb(85 33 181 / var(--tw-bg-opacity));\n}\n.enabled\\:hover\\:bg-red-100:hover:enabled {\n  --tw-bg-opacity: 1;\n  background-color: rgb(253 232 232 / var(--tw-bg-opacity));\n}\n.enabled\\:hover\\:bg-red-800:hover:enabled {\n  --tw-bg-opacity: 1;\n  background-color: rgb(155 28 28 / var(--tw-bg-opacity));\n}\n.enabled\\:hover\\:bg-teal-100:hover:enabled {\n  --tw-bg-opacity: 1;\n  background-color: rgb(213 245 246 / var(--tw-bg-opacity));\n}\n.enabled\\:hover\\:bg-yellow-100:hover:enabled {\n  --tw-bg-opacity: 1;\n  background-color: rgb(253 246 178 / var(--tw-bg-opacity));\n}\n.enabled\\:hover\\:bg-yellow-500:hover:enabled {\n  --tw-bg-opacity: 1;\n  background-color: rgb(194 120 3 / var(--tw-bg-opacity));\n}\n.enabled\\:hover\\:bg-gradient-to-bl:hover:enabled {\n  background-image: linear-gradient(to bottom left, var(--tw-gradient-stops));\n}\n.enabled\\:hover\\:bg-gradient-to-br:hover:enabled {\n  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));\n}\n.enabled\\:hover\\:bg-gradient-to-l:hover:enabled {\n  background-image: linear-gradient(to left, var(--tw-gradient-stops));\n}\n.enabled\\:hover\\:from-teal-200:hover:enabled {\n  --tw-gradient-from: #AFECEF var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(175 236 239 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n}\n.enabled\\:hover\\:to-lime-200:hover:enabled {\n  --tw-gradient-to: #d9f99d var(--tw-gradient-to-position);\n}\n.enabled\\:hover\\:text-cyan-700:hover:enabled {\n  --tw-text-opacity: 1;\n  color: rgb(14 116 144 / var(--tw-text-opacity));\n}\n.enabled\\:hover\\:text-gray-700:hover:enabled {\n  --tw-text-opacity: 1;\n  color: rgb(55 65 81 / var(--tw-text-opacity));\n}\n.enabled\\:hover\\:text-gray-900:hover:enabled {\n  --tw-text-opacity: 1;\n  color: rgb(17 24 39 / var(--tw-text-opacity));\n}\n.disabled\\:cursor-not-allowed:disabled {\n  cursor: not-allowed;\n}\n.disabled\\:text-gray-400:disabled {\n  --tw-text-opacity: 1;\n  color: rgb(156 163 175 / var(--tw-text-opacity));\n}\n.disabled\\:opacity-50:disabled {\n  opacity: 0.5;\n}\n.group:first-child .group-first\\:hidden {\n  display: none;\n}\n.group\\/body:first-child .group\\/row:first-child .group-first\\/body\\:group-first\\/row\\:first\\:rounded-tl-lg:first-child {\n  border-top-left-radius: 0.5rem;\n}\n.group\\/head:first-child .group-first\\/head\\:first\\:rounded-tl-lg:first-child {\n  border-top-left-radius: 0.5rem;\n}\n.group\\/body:first-child .group\\/row:first-child .group-first\\/body\\:group-first\\/row\\:last\\:rounded-tr-lg:last-child {\n  border-top-right-radius: 0.5rem;\n}\n.group\\/head:first-child .group-first\\/head\\:last\\:rounded-tr-lg:last-child {\n  border-top-right-radius: 0.5rem;\n}\n.group\\/body:last-child .group\\/row:last-child .group-last\\/body\\:group-last\\/row\\:first\\:rounded-bl-lg:first-child {\n  border-bottom-left-radius: 0.5rem;\n}\n.group\\/body:last-child .group\\/row:last-child .group-last\\/body\\:group-last\\/row\\:last\\:rounded-br-lg:last-child {\n  border-bottom-right-radius: 0.5rem;\n}\n.group:hover .group-hover\\:bg-blue-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(195 221 253 / var(--tw-bg-opacity));\n}\n.group:hover .group-hover\\:bg-cyan-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(165 243 252 / var(--tw-bg-opacity));\n}\n.group:hover .group-hover\\:bg-gray-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(229 231 235 / var(--tw-bg-opacity));\n}\n.group:hover .group-hover\\:bg-gray-300 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(209 213 219 / var(--tw-bg-opacity));\n}\n.group:hover .group-hover\\:bg-gray-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(107 114 128 / var(--tw-bg-opacity));\n}\n.group:hover .group-hover\\:bg-green-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(188 240 218 / var(--tw-bg-opacity));\n}\n.group:hover .group-hover\\:bg-indigo-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(205 219 254 / var(--tw-bg-opacity));\n}\n.group:hover .group-hover\\:bg-lime-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(217 249 157 / var(--tw-bg-opacity));\n}\n.group:hover .group-hover\\:bg-pink-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(250 209 232 / var(--tw-bg-opacity));\n}\n.group:hover .group-hover\\:bg-purple-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(220 215 254 / var(--tw-bg-opacity));\n}\n.group:hover .group-hover\\:bg-red-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(251 213 213 / var(--tw-bg-opacity));\n}\n.group:hover .group-hover\\:bg-teal-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(175 236 239 / var(--tw-bg-opacity));\n}\n.group:hover .group-hover\\:bg-white\\/50 {\n  background-color: rgb(255 255 255 / 0.5);\n}\n.group:hover .group-hover\\:bg-yellow-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(252 233 106 / var(--tw-bg-opacity));\n}\n.group:hover .group-hover\\:text-gray-900 {\n  --tw-text-opacity: 1;\n  color: rgb(17 24 39 / var(--tw-text-opacity));\n}\n.group:hover .group-hover\\:opacity-100 {\n  opacity: 1;\n}\n.group:hover .group-hover\\:opacity-50 {\n  opacity: 0.5;\n}\n.group:focus .group-focus\\:outline-none {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n}\n.group:focus .group-focus\\:ring-4 {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n}\n.group:focus .group-focus\\:ring-cyan-500\\/25 {\n  --tw-ring-color: rgb(6 182 212 / 0.25);\n}\n.group:focus .group-focus\\:ring-white {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(255 255 255 / var(--tw-ring-opacity));\n}\n.group:enabled:hover .group-enabled\\:group-hover\\:bg-opacity-0 {\n  --tw-bg-opacity: 0;\n}\n.group:enabled:hover .group-enabled\\:group-hover\\:text-inherit {\n  color: inherit;\n}\n.peer:-moz-placeholder-shown ~ .peer-placeholder-shown\\:top-1\\/2 {\n  top: 50%;\n}\n.peer:placeholder-shown ~ .peer-placeholder-shown\\:top-1\\/2 {\n  top: 50%;\n}\n.peer:-moz-placeholder-shown ~ .peer-placeholder-shown\\:-translate-y-1\\/2 {\n  --tw-translate-y: -50%;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.peer:placeholder-shown ~ .peer-placeholder-shown\\:-translate-y-1\\/2 {\n  --tw-translate-y: -50%;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.peer:-moz-placeholder-shown ~ .peer-placeholder-shown\\:translate-y-0 {\n  --tw-translate-y: 0px;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.peer:placeholder-shown ~ .peer-placeholder-shown\\:translate-y-0 {\n  --tw-translate-y: 0px;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.peer:-moz-placeholder-shown ~ .peer-placeholder-shown\\:scale-100 {\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.peer:placeholder-shown ~ .peer-placeholder-shown\\:scale-100 {\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.peer:focus ~ .peer-focus\\:left-0 {\n  left: 0px;\n}\n.peer:focus ~ .peer-focus\\:top-2 {\n  top: 0.5rem;\n}\n.peer:focus ~ .peer-focus\\:-translate-y-4 {\n  --tw-translate-y: -1rem;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.peer:focus ~ .peer-focus\\:-translate-y-6 {\n  --tw-translate-y: -1.5rem;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.peer:focus ~ .peer-focus\\:scale-75 {\n  --tw-scale-x: .75;\n  --tw-scale-y: .75;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.peer:focus ~ .peer-focus\\:px-2 {\n  padding-left: 0.5rem;\n  padding-right: 0.5rem;\n}\n.peer:focus ~ .peer-focus\\:text-blue-600 {\n  --tw-text-opacity: 1;\n  color: rgb(28 100 242 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:block) {\n  display: block;\n}\n:is(.dark .dark\\:hidden) {\n  display: none;\n}\n:is(.dark .dark\\:divide-gray-700) > :not([hidden]) ~ :not([hidden]) {\n  --tw-divide-opacity: 1;\n  border-color: rgb(55 65 81 / var(--tw-divide-opacity));\n}\n:is(.dark .dark\\:border-none) {\n  border-style: none;\n}\n:is(.dark .dark\\:border-cyan-400) {\n  --tw-border-opacity: 1;\n  border-color: rgb(34 211 238 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-cyan-500) {\n  --tw-border-opacity: 1;\n  border-color: rgb(6 182 212 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-cyan-600) {\n  --tw-border-opacity: 1;\n  border-color: rgb(8 145 178 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-gray-500) {\n  --tw-border-opacity: 1;\n  border-color: rgb(107 114 128 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-gray-600) {\n  --tw-border-opacity: 1;\n  border-color: rgb(75 85 99 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-gray-700) {\n  --tw-border-opacity: 1;\n  border-color: rgb(55 65 81 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-gray-800) {\n  --tw-border-opacity: 1;\n  border-color: rgb(31 41 55 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-gray-900) {\n  --tw-border-opacity: 1;\n  border-color: rgb(17 24 39 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-green-400) {\n  --tw-border-opacity: 1;\n  border-color: rgb(49 196 141 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-green-500) {\n  --tw-border-opacity: 1;\n  border-color: rgb(14 159 110 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-green-600) {\n  --tw-border-opacity: 1;\n  border-color: rgb(5 122 85 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-indigo-600) {\n  --tw-border-opacity: 1;\n  border-color: rgb(88 80 236 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-lime-600) {\n  --tw-border-opacity: 1;\n  border-color: rgb(101 163 13 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-pink-600) {\n  --tw-border-opacity: 1;\n  border-color: rgb(214 31 105 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-red-400) {\n  --tw-border-opacity: 1;\n  border-color: rgb(249 128 128 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-red-500) {\n  --tw-border-opacity: 1;\n  border-color: rgb(240 82 82 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-red-600) {\n  --tw-border-opacity: 1;\n  border-color: rgb(224 36 36 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-teal-600) {\n  --tw-border-opacity: 1;\n  border-color: rgb(4 116 129 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-white) {\n  --tw-border-opacity: 1;\n  border-color: rgb(255 255 255 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-yellow-400) {\n  --tw-border-opacity: 1;\n  border-color: rgb(227 160 8 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-yellow-600) {\n  --tw-border-opacity: 1;\n  border-color: rgb(159 88 10 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:\\!bg-gray-700) {\n  --tw-bg-opacity: 1 !important;\n  background-color: rgb(55 65 81 / var(--tw-bg-opacity)) !important;\n}\n:is(.dark .dark\\:bg-black) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(0 0 0 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-blue-200) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(195 221 253 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-blue-600) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(28 100 242 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-cyan-100) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(207 250 254 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-cyan-200) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(165 243 252 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-cyan-600) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(8 145 178 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-cyan-900) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(22 78 99 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-gray-200) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(229 231 235 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-gray-300) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(209 213 219 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-gray-400) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(156 163 175 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-gray-500) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(107 114 128 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-gray-600) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(75 85 99 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-gray-700) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(55 65 81 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-gray-800) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(31 41 55 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-gray-800\\/30) {\n  background-color: rgb(31 41 55 / 0.3);\n}\n:is(.dark .dark\\:bg-gray-800\\/50) {\n  background-color: rgb(31 41 55 / 0.5);\n}\n:is(.dark .dark\\:bg-gray-900) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(17 24 39 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-green-100) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(222 247 236 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-green-200) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(188 240 218 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-green-500) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(14 159 110 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-green-600) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(5 122 85 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-green-900) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(1 71 55 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-indigo-200) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(205 219 254 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-indigo-500) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(104 117 245 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-indigo-600) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(88 80 236 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-lime-200) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(217 249 157 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-lime-600) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(101 163 13 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-pink-200) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(250 209 232 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-pink-600) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(214 31 105 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-purple-200) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(220 215 254 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-purple-500) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(144 97 249 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-purple-600) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(126 58 242 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-purple-900) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(74 29 150 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-red-100) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(253 232 232 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-red-200) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(251 213 213 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-red-500) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(240 82 82 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-red-600) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(224 36 36 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-red-900) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(119 29 29 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-teal-200) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(175 236 239 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-teal-600) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(4 116 129 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-transparent) {\n  background-color: transparent;\n}\n:is(.dark .dark\\:bg-yellow-100) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(253 246 178 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-yellow-200) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(252 233 106 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-yellow-600) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(159 88 10 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-yellow-800) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(114 59 19 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-yellow-900) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(99 49 18 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-opacity-80) {\n  --tw-bg-opacity: 0.8;\n}\n:is(.dark .dark\\:fill-gray-300) {\n  fill: #D1D5DB;\n}\n:is(.dark .dark\\:text-blue-600) {\n  --tw-text-opacity: 1;\n  color: rgb(28 100 242 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-blue-800) {\n  --tw-text-opacity: 1;\n  color: rgb(30 66 159 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-blue-900) {\n  --tw-text-opacity: 1;\n  color: rgb(35 56 118 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-cyan-100) {\n  --tw-text-opacity: 1;\n  color: rgb(207 250 254 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-cyan-300) {\n  --tw-text-opacity: 1;\n  color: rgb(103 232 249 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-cyan-500) {\n  --tw-text-opacity: 1;\n  color: rgb(6 182 212 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-cyan-600) {\n  --tw-text-opacity: 1;\n  color: rgb(8 145 178 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-cyan-800) {\n  --tw-text-opacity: 1;\n  color: rgb(21 94 117 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-cyan-900) {\n  --tw-text-opacity: 1;\n  color: rgb(22 78 99 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-gray-100) {\n  --tw-text-opacity: 1;\n  color: rgb(243 244 246 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-gray-200) {\n  --tw-text-opacity: 1;\n  color: rgb(229 231 235 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-gray-300) {\n  --tw-text-opacity: 1;\n  color: rgb(209 213 219 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-gray-400) {\n  --tw-text-opacity: 1;\n  color: rgb(156 163 175 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-gray-500) {\n  --tw-text-opacity: 1;\n  color: rgb(107 114 128 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-gray-600) {\n  --tw-text-opacity: 1;\n  color: rgb(75 85 99 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-gray-800) {\n  --tw-text-opacity: 1;\n  color: rgb(31 41 55 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-gray-900) {\n  --tw-text-opacity: 1;\n  color: rgb(17 24 39 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-green-400) {\n  --tw-text-opacity: 1;\n  color: rgb(49 196 141 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-green-500) {\n  --tw-text-opacity: 1;\n  color: rgb(14 159 110 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-green-600) {\n  --tw-text-opacity: 1;\n  color: rgb(5 122 85 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-green-800) {\n  --tw-text-opacity: 1;\n  color: rgb(3 84 63 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-green-900) {\n  --tw-text-opacity: 1;\n  color: rgb(1 71 55 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-indigo-600) {\n  --tw-text-opacity: 1;\n  color: rgb(88 80 236 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-indigo-800) {\n  --tw-text-opacity: 1;\n  color: rgb(66 56 157 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-indigo-900) {\n  --tw-text-opacity: 1;\n  color: rgb(54 47 120 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-lime-600) {\n  --tw-text-opacity: 1;\n  color: rgb(101 163 13 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-lime-800) {\n  --tw-text-opacity: 1;\n  color: rgb(63 98 18 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-lime-900) {\n  --tw-text-opacity: 1;\n  color: rgb(54 83 20 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-pink-600) {\n  --tw-text-opacity: 1;\n  color: rgb(214 31 105 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-pink-800) {\n  --tw-text-opacity: 1;\n  color: rgb(153 21 75 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-pink-900) {\n  --tw-text-opacity: 1;\n  color: rgb(117 26 61 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-purple-600) {\n  --tw-text-opacity: 1;\n  color: rgb(126 58 242 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-purple-800) {\n  --tw-text-opacity: 1;\n  color: rgb(85 33 181 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-purple-900) {\n  --tw-text-opacity: 1;\n  color: rgb(74 29 150 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-red-400) {\n  --tw-text-opacity: 1;\n  color: rgb(249 128 128 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-red-500) {\n  --tw-text-opacity: 1;\n  color: rgb(240 82 82 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-red-600) {\n  --tw-text-opacity: 1;\n  color: rgb(224 36 36 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-red-800) {\n  --tw-text-opacity: 1;\n  color: rgb(155 28 28 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-red-900) {\n  --tw-text-opacity: 1;\n  color: rgb(119 29 29 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-teal-600) {\n  --tw-text-opacity: 1;\n  color: rgb(4 116 129 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-teal-800) {\n  --tw-text-opacity: 1;\n  color: rgb(5 80 92 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-teal-900) {\n  --tw-text-opacity: 1;\n  color: rgb(1 68 81 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-white) {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-yellow-600) {\n  --tw-text-opacity: 1;\n  color: rgb(159 88 10 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-yellow-800) {\n  --tw-text-opacity: 1;\n  color: rgb(114 59 19 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-yellow-900) {\n  --tw-text-opacity: 1;\n  color: rgb(99 49 18 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:placeholder-gray-400)::-moz-placeholder {\n  --tw-placeholder-opacity: 1;\n  color: rgb(156 163 175 / var(--tw-placeholder-opacity));\n}\n:is(.dark .dark\\:placeholder-gray-400)::placeholder {\n  --tw-placeholder-opacity: 1;\n  color: rgb(156 163 175 / var(--tw-placeholder-opacity));\n}\n:is(.dark .dark\\:mix-blend-color) {\n  mix-blend-mode: color;\n}\n:is(.dark .dark\\:shadow-sm-light) {\n  --tw-shadow: 0 2px 5px 0px rgba(255, 255, 255, 0.08);\n  --tw-shadow-colored: 0 2px 5px 0px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n:is(.dark .dark\\:ring-cyan-800) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(21 94 117 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:ring-gray-400) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(156 163 175 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:ring-gray-500) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(107 114 128 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:ring-gray-800) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(31 41 55 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:ring-gray-900) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(17 24 39 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:ring-green-500) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(14 159 110 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:ring-pink-500) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(231 70 148 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:ring-purple-600) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(126 58 242 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:ring-red-700) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(200 30 30 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:ring-yellow-500) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(194 120 3 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:ring-offset-blue-700) {\n  --tw-ring-offset-color: #1A56DB;\n}\n:is(.dark .dark\\:ring-offset-cyan-600) {\n  --tw-ring-offset-color: #0891b2;\n}\n:is(.dark .dark\\:ring-offset-gray-800) {\n  --tw-ring-offset-color: #1F2937;\n}\n:is(.dark .dark\\:ring-offset-gray-900) {\n  --tw-ring-offset-color: #111827;\n}\n:is(.dark .dark\\:ring-offset-green-600) {\n  --tw-ring-offset-color: #057A55;\n}\n:is(.dark .dark\\:ring-offset-green-800) {\n  --tw-ring-offset-color: #03543F;\n}\n:is(.dark .dark\\:ring-offset-indigo-700) {\n  --tw-ring-offset-color: #5145CD;\n}\n:is(.dark .dark\\:ring-offset-lime-700) {\n  --tw-ring-offset-color: #4d7c0f;\n}\n:is(.dark .dark\\:ring-offset-pink-600) {\n  --tw-ring-offset-color: #D61F69;\n}\n:is(.dark .dark\\:ring-offset-purple-600) {\n  --tw-ring-offset-color: #7E3AF2;\n}\n:is(.dark .dark\\:ring-offset-red-600) {\n  --tw-ring-offset-color: #E02424;\n}\n:is(.dark .dark\\:ring-offset-red-900) {\n  --tw-ring-offset-color: #771D1D;\n}\n:is(.dark .dark\\:ring-offset-teal-600) {\n  --tw-ring-offset-color: #047481;\n}\n:is(.dark .dark\\:ring-offset-yellow-400) {\n  --tw-ring-offset-color: #E3A008;\n}\n:is(.dark .odd\\:dark\\:bg-gray-800):nth-child(odd) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(31 41 55 / var(--tw-bg-opacity));\n}\n:is(.dark .even\\:dark\\:bg-gray-700):nth-child(even) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(55 65 81 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:hover\\:bg-blue-300:hover) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(164 202 254 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:hover\\:bg-blue-700:hover) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(26 86 219 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:hover\\:bg-cyan-300:hover) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(103 232 249 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:hover\\:bg-cyan-700:hover) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(14 116 144 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:hover\\:bg-gray-300:hover) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(209 213 219 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:hover\\:bg-gray-600:hover) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(75 85 99 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:hover\\:bg-gray-700:hover) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(55 65 81 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:hover\\:bg-gray-800:hover) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(31 41 55 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:hover\\:bg-green-300:hover) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(132 225 188 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:hover\\:bg-indigo-300:hover) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(180 198 252 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:hover\\:bg-lime-300:hover) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(190 242 100 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:hover\\:bg-pink-300:hover) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(248 180 217 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:hover\\:bg-purple-300:hover) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(202 191 253 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:hover\\:bg-red-300:hover) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(248 180 180 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:hover\\:bg-teal-300:hover) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(126 220 226 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:hover\\:bg-yellow-300:hover) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(250 202 21 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:hover\\:text-gray-300:hover) {\n  --tw-text-opacity: 1;\n  color: rgb(209 213 219 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:hover\\:text-white:hover) {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:focus\\:border-blue-500:focus) {\n  --tw-border-opacity: 1;\n  border-color: rgb(63 131 248 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:focus\\:border-cyan-500:focus) {\n  --tw-border-opacity: 1;\n  border-color: rgb(6 182 212 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:focus\\:border-green-500:focus) {\n  --tw-border-opacity: 1;\n  border-color: rgb(14 159 110 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:focus\\:border-red-500:focus) {\n  --tw-border-opacity: 1;\n  border-color: rgb(240 82 82 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:focus\\:border-yellow-500:focus) {\n  --tw-border-opacity: 1;\n  border-color: rgb(194 120 3 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:focus\\:bg-cyan-600:focus) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(8 145 178 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:focus\\:bg-gray-600:focus) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(75 85 99 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:focus\\:text-white:focus) {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-blue-700:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(26 86 219 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-blue-800:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(30 66 159 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-cyan-500:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(6 182 212 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-cyan-600:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(8 145 178 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-cyan-700:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(14 116 144 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-cyan-800:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(21 94 117 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-gray-500:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(107 114 128 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-gray-600:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(75 85 99 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-gray-700:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(55 65 81 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-gray-800:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(31 41 55 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-gray-900:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(17 24 39 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-green-500:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(14 159 110 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-green-600:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(5 122 85 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-green-700:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(4 108 78 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-green-800:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(3 84 63 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-indigo-700:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(81 69 205 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-lime-700:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(77 124 15 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-lime-800:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(63 98 18 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-pink-600:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(214 31 105 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-pink-700:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(191 18 93 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-pink-800:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(153 21 75 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-purple-600:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(126 58 242 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-purple-800:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(85 33 181 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-purple-900:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(74 29 150 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-red-400:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(249 128 128 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-red-500:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(240 82 82 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-red-600:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(224 36 36 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-red-700:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(200 30 30 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-red-800:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(155 28 28 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-red-900:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(119 29 29 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-teal-600:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(4 116 129 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-teal-700:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(3 102 114 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-teal-800:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(5 80 92 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-yellow-400:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(227 160 8 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-yellow-500:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(194 120 3 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-yellow-700:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(142 75 16 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-yellow-900:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(99 49 18 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:border-cyan-700:hover:enabled) {\n  --tw-border-opacity: 1;\n  border-color: rgb(14 116 144 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:border-gray-700:hover:enabled) {\n  --tw-border-opacity: 1;\n  border-color: rgb(55 65 81 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:border-green-700:hover:enabled) {\n  --tw-border-opacity: 1;\n  border-color: rgb(4 108 78 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:border-indigo-700:hover:enabled) {\n  --tw-border-opacity: 1;\n  border-color: rgb(81 69 205 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:border-lime-700:hover:enabled) {\n  --tw-border-opacity: 1;\n  border-color: rgb(77 124 15 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:border-pink-700:hover:enabled) {\n  --tw-border-opacity: 1;\n  border-color: rgb(191 18 93 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:border-red-700:hover:enabled) {\n  --tw-border-opacity: 1;\n  border-color: rgb(200 30 30 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:border-teal-700:hover:enabled) {\n  --tw-border-opacity: 1;\n  border-color: rgb(3 102 114 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:border-yellow-700:hover:enabled) {\n  --tw-border-opacity: 1;\n  border-color: rgb(142 75 16 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:bg-cyan-700:hover:enabled) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(14 116 144 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:bg-gray-700:hover:enabled) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(55 65 81 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:bg-green-700:hover:enabled) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(4 108 78 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:bg-indigo-700:hover:enabled) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(81 69 205 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:bg-lime-700:hover:enabled) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(77 124 15 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:bg-pink-700:hover:enabled) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(191 18 93 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:bg-purple-700:hover:enabled) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(108 43 217 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:bg-red-700:hover:enabled) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(200 30 30 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:bg-teal-700:hover:enabled) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(3 102 114 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:bg-yellow-700:hover:enabled) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(142 75 16 / var(--tw-bg-opacity));\n}\n:is(.dark .enabled\\:dark\\:hover\\:bg-gray-700:hover):enabled {\n  --tw-bg-opacity: 1;\n  background-color: rgb(55 65 81 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:text-white:hover:enabled) {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity));\n}\n:is(.dark .enabled\\:dark\\:hover\\:text-white:hover):enabled {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity));\n}\n:is(.dark .disabled\\:dark\\:text-gray-500):disabled {\n  --tw-text-opacity: 1;\n  color: rgb(107 114 128 / var(--tw-text-opacity));\n}\n:is(.dark .group:hover .dark\\:group-hover\\:bg-blue-300) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(164 202 254 / var(--tw-bg-opacity));\n}\n:is(.dark .group:hover .dark\\:group-hover\\:bg-cyan-300) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(103 232 249 / var(--tw-bg-opacity));\n}\n:is(.dark .group:hover .dark\\:group-hover\\:bg-gray-500) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(107 114 128 / var(--tw-bg-opacity));\n}\n:is(.dark .group:hover .dark\\:group-hover\\:bg-gray-600) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(75 85 99 / var(--tw-bg-opacity));\n}\n:is(.dark .group:hover .dark\\:group-hover\\:bg-gray-700) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(55 65 81 / var(--tw-bg-opacity));\n}\n:is(.dark .group:hover .dark\\:group-hover\\:bg-gray-800\\/60) {\n  background-color: rgb(31 41 55 / 0.6);\n}\n:is(.dark .group:hover .dark\\:group-hover\\:bg-green-300) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(132 225 188 / var(--tw-bg-opacity));\n}\n:is(.dark .group:hover .dark\\:group-hover\\:bg-indigo-300) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(180 198 252 / var(--tw-bg-opacity));\n}\n:is(.dark .group:hover .dark\\:group-hover\\:bg-lime-300) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(190 242 100 / var(--tw-bg-opacity));\n}\n:is(.dark .group:hover .dark\\:group-hover\\:bg-pink-300) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(248 180 217 / var(--tw-bg-opacity));\n}\n:is(.dark .group:hover .dark\\:group-hover\\:bg-purple-300) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(202 191 253 / var(--tw-bg-opacity));\n}\n:is(.dark .group:hover .dark\\:group-hover\\:bg-red-300) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(248 180 180 / var(--tw-bg-opacity));\n}\n:is(.dark .group:hover .dark\\:group-hover\\:bg-teal-300) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(126 220 226 / var(--tw-bg-opacity));\n}\n:is(.dark .group:hover .dark\\:group-hover\\:bg-yellow-300) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(250 202 21 / var(--tw-bg-opacity));\n}\n:is(.dark .group:hover .dark\\:group-hover\\:text-white) {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity));\n}\n:is(.dark .group:focus .dark\\:group-focus\\:ring-gray-800\\/70) {\n  --tw-ring-color: rgb(31 41 55 / 0.7);\n}\n.peer:focus ~ :is(.dark .peer-focus\\:dark\\:text-blue-500) {\n  --tw-text-opacity: 1;\n  color: rgb(63 131 248 / var(--tw-text-opacity));\n}\n@media (min-width: 640px) {\n\n  .sm\\:col-span-1 {\n    grid-column: span 1 / span 1;\n  }\n\n  .sm\\:mx-auto {\n    margin-left: auto;\n    margin-right: auto;\n  }\n\n  .sm\\:mb-0 {\n    margin-bottom: 0px;\n  }\n\n  .sm\\:mt-0 {\n    margin-top: 0px;\n  }\n\n  .sm\\:flex {\n    display: flex;\n  }\n\n  .sm\\:grid {\n    display: grid;\n  }\n\n  .sm\\:h-10 {\n    height: 2.5rem;\n  }\n\n  .sm\\:h-6 {\n    height: 1.5rem;\n  }\n\n  .sm\\:h-7 {\n    height: 1.75rem;\n  }\n\n  .sm\\:w-10 {\n    width: 2.5rem;\n  }\n\n  .sm\\:w-6 {\n    width: 1.5rem;\n  }\n\n  .sm\\:grid-cols-2 {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n\n  .sm\\:gap-4 {\n    gap: 1rem;\n  }\n\n  .sm\\:px-4 {\n    padding-left: 1rem;\n    padding-right: 1rem;\n  }\n\n  .sm\\:px-6 {\n    padding-left: 1.5rem;\n    padding-right: 1.5rem;\n  }\n\n  .sm\\:pr-8 {\n    padding-right: 2rem;\n  }\n\n  .sm\\:text-center {\n    text-align: center;\n  }\n\n  .sm\\:text-base {\n    font-size: 1rem;\n    line-height: 1.5rem;\n  }\n\n  .sm\\:text-xs {\n    font-size: 0.75rem;\n    line-height: 1rem;\n  }\n}\n@media (min-width: 768px) {\n\n  .md\\:inset-0 {\n    inset: 0px;\n  }\n\n  .md\\:mx-2 {\n    margin-left: 0.5rem;\n    margin-right: 0.5rem;\n  }\n\n  .md\\:mr-6 {\n    margin-right: 1.5rem;\n  }\n\n  .md\\:mt-0 {\n    margin-top: 0px;\n  }\n\n  .md\\:block {\n    display: block;\n  }\n\n  .md\\:flex {\n    display: flex;\n  }\n\n  .md\\:hidden {\n    display: none;\n  }\n\n  .md\\:h-auto {\n    height: auto;\n  }\n\n  .md\\:h-full {\n    height: 100%;\n  }\n\n  .md\\:w-48 {\n    width: 12rem;\n  }\n\n  .md\\:w-auto {\n    width: auto;\n  }\n\n  .md\\:max-w-xl {\n    max-width: 36rem;\n  }\n\n  .md\\:flex-row {\n    flex-direction: row;\n  }\n\n  .md\\:items-center {\n    align-items: center;\n  }\n\n  .md\\:justify-between {\n    justify-content: space-between;\n  }\n\n  .md\\:space-x-8 > :not([hidden]) ~ :not([hidden]) {\n    --tw-space-x-reverse: 0;\n    margin-right: calc(2rem * var(--tw-space-x-reverse));\n    margin-left: calc(2rem * calc(1 - var(--tw-space-x-reverse)));\n  }\n\n  .md\\:rounded-none {\n    border-radius: 0px;\n  }\n\n  .md\\:rounded-l-lg {\n    border-top-left-radius: 0.5rem;\n    border-bottom-left-radius: 0.5rem;\n  }\n\n  .md\\:border-0 {\n    border-width: 0px;\n  }\n\n  .md\\:bg-transparent {\n    background-color: transparent;\n  }\n\n  .md\\:p-0 {\n    padding: 0px;\n  }\n\n  .md\\:text-sm {\n    font-size: 0.875rem;\n    line-height: 1.25rem;\n  }\n\n  .md\\:font-medium {\n    font-weight: 500;\n  }\n\n  .md\\:text-cyan-700 {\n    --tw-text-opacity: 1;\n    color: rgb(14 116 144 / var(--tw-text-opacity));\n  }\n\n  .md\\:hover\\:bg-transparent:hover {\n    background-color: transparent;\n  }\n\n  .md\\:hover\\:text-cyan-700:hover {\n    --tw-text-opacity: 1;\n    color: rgb(14 116 144 / var(--tw-text-opacity));\n  }\n\n  :is(.dark .md\\:dark\\:hover\\:bg-transparent:hover) {\n    background-color: transparent;\n  }\n\n  :is(.dark .md\\:dark\\:hover\\:text-white:hover) {\n    --tw-text-opacity: 1;\n    color: rgb(255 255 255 / var(--tw-text-opacity));\n  }\n}\n@media (min-width: 1024px) {\n\n  .lg\\:my-8 {\n    margin-top: 2rem;\n    margin-bottom: 2rem;\n  }\n}\n.\\[\\&\\:\\:-webkit-scrollbar\\]\\:\\!hidden::-webkit-scrollbar {\n  display: none !important;\n}\n.\\[\\&\\:\\:-webkit-scrollbar\\]\\:\\!h-0::-webkit-scrollbar {\n  height: 0px !important;\n}\n.\\[\\&\\:\\:-webkit-scrollbar\\]\\:\\!w-0::-webkit-scrollbar {\n  width: 0px !important;\n}\n.\\[\\&\\:\\:-webkit-scrollbar\\]\\:\\!bg-transparent::-webkit-scrollbar {\n  background-color: transparent !important;\n}\n.\\[\\&\\>\\*\\]\\:pointer-events-none>* {\n  pointer-events: none;\n}\n.\\[\\&\\>\\*\\]\\:cursor-grab>* {\n  cursor: grab;\n}\n.\\[\\&\\>\\*\\]\\:first\\:rounded-t-lg:first-child>* {\n  border-top-left-radius: 0.5rem;\n  border-top-right-radius: 0.5rem;\n}\n.\\[\\&\\>\\*\\]\\:last\\:rounded-b-lg:last-child>* {\n  border-bottom-right-radius: 0.5rem;\n  border-bottom-left-radius: 0.5rem;\n}\n.\\[\\&\\>\\*\\]\\:last\\:border-b-0:last-child>* {\n  border-bottom-width: 0px;\n}\n`,
          "",
          {
            version: 3,
            sources: ["webpack://./src/history/history.css"],
            names: [],
            mappings:
              "AAAA;;CAAc,CAAd;;;CAAc;;AAAd;;;EAAA,sBAAc,EAAd,MAAc;EAAd,eAAc,EAAd,MAAc;EAAd,mBAAc,EAAd,MAAc;EAAd,qBAAc,EAAd,MAAc;AAAA;;AAAd;;EAAA,gBAAc;AAAA;;AAAd;;;;;;;;CAAc;;AAAd;;EAAA,gBAAc,EAAd,MAAc;EAAd,8BAAc,EAAd,MAAc;EAAd,gBAAc,EAAd,MAAc;EAAd,cAAc;KAAd,WAAc,EAAd,MAAc;EAAd,+HAAc,EAAd,MAAc;EAAd,6BAAc,EAAd,MAAc;EAAd,+BAAc,EAAd,MAAc;EAAd,wCAAc,EAAd,MAAc;AAAA;;AAAd;;;CAAc;;AAAd;EAAA,SAAc,EAAd,MAAc;EAAd,oBAAc,EAAd,MAAc;AAAA;;AAAd;;;;CAAc;;AAAd;EAAA,SAAc,EAAd,MAAc;EAAd,cAAc,EAAd,MAAc;EAAd,qBAAc,EAAd,MAAc;AAAA;;AAAd;;CAAc;;AAAd;EAAA,yCAAc;UAAd,iCAAc;AAAA;;AAAd;;CAAc;;AAAd;;;;;;EAAA,kBAAc;EAAd,oBAAc;AAAA;;AAAd;;CAAc;;AAAd;EAAA,cAAc;EAAd,wBAAc;AAAA;;AAAd;;CAAc;;AAAd;;EAAA,mBAAc;AAAA;;AAAd;;;;;CAAc;;AAAd;;;;EAAA,+GAAc,EAAd,MAAc;EAAd,6BAAc,EAAd,MAAc;EAAd,+BAAc,EAAd,MAAc;EAAd,cAAc,EAAd,MAAc;AAAA;;AAAd;;CAAc;;AAAd;EAAA,cAAc;AAAA;;AAAd;;CAAc;;AAAd;;EAAA,cAAc;EAAd,cAAc;EAAd,kBAAc;EAAd,wBAAc;AAAA;;AAAd;EAAA,eAAc;AAAA;;AAAd;EAAA,WAAc;AAAA;;AAAd;;;;CAAc;;AAAd;EAAA,cAAc,EAAd,MAAc;EAAd,qBAAc,EAAd,MAAc;EAAd,yBAAc,EAAd,MAAc;AAAA;;AAAd;;;;CAAc;;AAAd;;;;;EAAA,oBAAc,EAAd,MAAc;EAAd,8BAAc,EAAd,MAAc;EAAd,gCAAc,EAAd,MAAc;EAAd,eAAc,EAAd,MAAc;EAAd,oBAAc,EAAd,MAAc;EAAd,oBAAc,EAAd,MAAc;EAAd,cAAc,EAAd,MAAc;EAAd,SAAc,EAAd,MAAc;EAAd,UAAc,EAAd,MAAc;AAAA;;AAAd;;CAAc;;AAAd;;EAAA,oBAAc;AAAA;;AAAd;;;CAAc;;AAAd;;;;EAAA,0BAAc,EAAd,MAAc;EAAd,6BAAc,EAAd,MAAc;EAAd,sBAAc,EAAd,MAAc;AAAA;;AAAd;;CAAc;;AAAd;EAAA,aAAc;AAAA;;AAAd;;CAAc;;AAAd;EAAA,gBAAc;AAAA;;AAAd;;CAAc;;AAAd;EAAA,wBAAc;AAAA;;AAAd;;CAAc;;AAAd;;EAAA,YAAc;AAAA;;AAAd;;;CAAc;;AAAd;EAAA,6BAAc,EAAd,MAAc;EAAd,oBAAc,EAAd,MAAc;AAAA;;AAAd;;CAAc;;AAAd;EAAA,wBAAc;AAAA;;AAAd;;;CAAc;;AAAd;EAAA,0BAAc,EAAd,MAAc;EAAd,aAAc,EAAd,MAAc;AAAA;;AAAd;;CAAc;;AAAd;EAAA,kBAAc;AAAA;;AAAd;;CAAc;;AAAd;;;;;;;;;;;;;EAAA,SAAc;AAAA;;AAAd;EAAA,SAAc;EAAd,UAAc;AAAA;;AAAd;EAAA,UAAc;AAAA;;AAAd;;;EAAA,gBAAc;EAAd,SAAc;EAAd,UAAc;AAAA;;AAAd;;CAAc;AAAd;EAAA,UAAc;AAAA;;AAAd;;CAAc;;AAAd;EAAA,gBAAc;AAAA;;AAAd;;;CAAc;;AAAd;EAAA,UAAc,EAAd,MAAc;EAAd,cAAc,EAAd,MAAc;AAAA;;AAAd;;EAAA,UAAc,EAAd,MAAc;EAAd,cAAc,EAAd,MAAc;AAAA;;AAAd;;CAAc;;AAAd;;EAAA,eAAc;AAAA;;AAAd;;CAAc;AAAd;EAAA,eAAc;AAAA;;AAAd;;;;CAAc;;AAAd;;;;;;;;EAAA,cAAc,EAAd,MAAc;EAAd,sBAAc,EAAd,MAAc;AAAA;;AAAd;;CAAc;;AAAd;;EAAA,eAAc;EAAd,YAAc;AAAA;;AAAd,wEAAc;AAAd;EAAA,aAAc;AAAA;;AAAd;EAAA,wBAAc;KAAd,qBAAc;UAAd,gBAAc;EAAd,sBAAc;EAAd,qBAAc;EAAd,iBAAc;EAAd,kBAAc;EAAd,mBAAc;EAAd,sBAAc;EAAd,sBAAc;EAAd,qBAAc;EAAd,eAAc;EAAd,mBAAc;EAAd,sBAAc;AAAA;;AAAd;EAAA,8BAAc;EAAd,mBAAc;EAAd,4CAAc;EAAd,2BAAc;EAAd,4BAAc;EAAd,wBAAc;EAAd,2GAAc;EAAd,yGAAc;EAAd,iFAAc;EAAd;AAAc;;AAAd;EAAA,cAAc;EAAd;AAAc;;AAAd;EAAA,cAAc;EAAd;AAAc;;AAAd;EAAA;AAAc;;AAAd;EAAA,iBAAc;EAAd;AAAc;;AAAd;EAAA;AAAc;;AAAd;EAAA,cAAc;EAAd;AAAc;;AAAd;EAAA,yDAAc;EAAd,wCAAc;EAAd,4BAAc;EAAd,4BAAc;EAAd,qBAAc;EAAd,iCAAc;UAAd;AAAc;;AAAd;EAAA,yBAAc;EAAd,4BAAc;EAAd,wBAAc;EAAd,wBAAc;EAAd,sBAAc;EAAd,iCAAc;UAAd;AAAc;;AAAd;EAAA,wBAAc;KAAd,qBAAc;UAAd,gBAAc;EAAd,UAAc;EAAd,iCAAc;UAAd,yBAAc;EAAd,qBAAc;EAAd,sBAAc;EAAd,6BAAc;EAAd,yBAAc;KAAd,sBAAc;UAAd,iBAAc;EAAd,cAAc;EAAd,YAAc;EAAd,WAAc;EAAd,cAAc;EAAd,sBAAc;EAAd,qBAAc;EAAd,iBAAc;EAAd;AAAc;;AAAd;EAAA;AAAc;;AAAd;EAAA;AAAc;;AAAd;EAAA,8BAAc;EAAd,mBAAc;EAAd,4CAAc;EAAd,2BAAc;EAAd,4BAAc;EAAd,wBAAc;EAAd,2GAAc;EAAd,yGAAc;EAAd;AAAc;;AAAd;EAAA,yBAAc;EAAd,8BAAc;EAAd,0BAAc;EAAd,2BAAc;EAAd;AAAc;;AAAd;EAAA,yDAAc;AAAA;;AAAd;;EAAA;IAAA,wBAAc;OAAd,qBAAc;YAAd;EAAc;AAAA;;AAAd;EAAA,yDAAc;AAAA;;AAAd;;EAAA;IAAA,wBAAc;OAAd,qBAAc;YAAd;EAAc;AAAA;;AAAd;EAAA,yBAAc;EAAd;AAAc;;AAAd;EAAA,yDAAc;EAAd,yBAAc;EAAd,8BAAc;EAAd,0BAAc;EAAd,2BAAc;EAAd,4BAAc;AAAA;;AAAd;;EAAA;IAAA,wBAAc;OAAd,qBAAc;YAAd;EAAc;AAAA;;AAAd;EAAA,yBAAc;EAAd;AAAc;;AAAd;EAAA,iBAAc;EAAd,qBAAc;EAAd,eAAc;EAAd,gBAAc;EAAd,UAAc;EAAd,gBAAc;EAAd;AAAc;;AAAd;EAAA,6BAAc;EAAd;AAAc;;AAAd;EAAA,mBAAc;EAAd;AAAc;;AAAd;EAAA,wBAAc;EAAd;AAAc;;AAAd;EAAA,wBAAc;EAAd;AAAc;;AAAd;EAAA,qBAAc;EAAd;AAAc;;AAAd;EAAA,qBAAc;EAAd;AAAc;;AAAd;EAAA;AAAc;;AAAd;EAAA;AAAc;;AAAd;EAAA;AAAc;;AAAd;EAAA;AAAc;;AAAd;EAAA;AAAc;;AAAd;EAAA,kBAAc;EAAd,UAAc;EAAd,WAAc;EAAd;AAAc;;AAAd;EAAA;AAAc;;AAAd;EAAA,WAAc;EAAd,mBAAc;EAAd;AAAc;;AAAd;EAAA,WAAc;EAAd,mBAAc;EAAd,wBAAc;EAAd,kBAAc;EAAd,UAAc;EAAd,WAAc;EAAd;AAAc;;AAAd;EAAA,mBAAc;EAAd;AAAc;;AAAd;EAAA,mBAAc;EAAd;AAAc;;AAAd;EAAA,mBAAc;EAAd;AAAc;;AAAd;EAAA,mBAAc;EAAd;AAAc;;AAAd;EAAA,wBAAc;EAAd;AAAc;;AAAd;EAAA,wBAAc;EAAd;AAAc;;AAAd;EAAA,wBAAc;EAAd;AAAc;;AAAd;EAAA,wBAAc;EAAd;AAAc;;AAAd;EAAA,qBAAc;EAAd;AAAc;;AAAd;EAAA,qBAAc;EAAd;AAAc;;AAAd;EAAA,qBAAc;EAAd;AAAc;;AAAd;EAAA,qBAAc;EAAd;AAAc;;AAAd;EAAA;AAAc;;AAAd;EAAA;AAAc;;AAAd;EAAA;AAAc;;AAAd;EAAA;AAAc;;AAAd;EAAA;AAAc;;AAAd;EAAA;AAAc;;AAAd;EAAA,wBAAc;KAAd,qBAAc;UAAd,gBAAc;EAAd,sBAAc;EAAd,qBAAc;EAAd,iBAAc;EAAd,kBAAc;EAAd,mBAAc;EAAd,sBAAc;EAAd,sBAAc;EAAd,qBAAc;EAAd,eAAc;EAAd,mBAAc;EAAd,sBAAc;AAAA;;AAAd;EAAA,8BAAc;EAAd,mBAAc;EAAd,4CAAc;EAAd,2BAAc;EAAd,4BAAc;EAAd,wBAAc;EAAd,2GAAc;EAAd,yGAAc;EAAd,iFAAc;EAAd;AAAc;;AAAd;EAAA,cAAc;EAAd;AAAc;;AAAd;EAAA,cAAc;EAAd;AAAc;;AAAd;EAAA;AAAc;;AAAd;EAAA;AAAc;;AAAd;EAAA,yDAAc;EAAd,yCAAc;EAAd,4BAAc;EAAd,8BAAc;EAAd,qBAAc;EAAd,iCAAc;UAAd;AAAc;;AAAd;EAAA,wCAAc;EAAd,sBAAc;EAAd;AAAc;;AAAd;EAAA,yBAAc;EAAd,4BAAc;EAAd,wBAAc;EAAd,wBAAc;EAAd,sBAAc;EAAd,iCAAc;UAAd;AAAc;;AAAd;EAAA,wBAAc;KAAd,qBAAc;UAAd,gBAAc;EAAd,UAAc;EAAd,iCAAc;UAAd,yBAAc;EAAd,qBAAc;EAAd,sBAAc;EAAd,6BAAc;EAAd,yBAAc;KAAd,sBAAc;UAAd,iBAAc;EAAd,cAAc;EAAd,YAAc;EAAd,WAAc;EAAd,cAAc;EAAd,sBAAc;EAAd,qBAAc;EAAd,iBAAc;EAAd;AAAc;;AAAd;EAAA;AAAc;;AAAd;EAAA;AAAc;;AAAd;EAAA,8BAAc;EAAd,mBAAc;EAAd,4CAAc;EAAd,2BAAc;EAAd,4BAAc;EAAd,wBAAc;EAAd,2GAAc;EAAd,yGAAc;EAAd;AAAc;;AAAd;EAAA,yBAAc;EAAd,8BAAc;EAAd,8BAAc;EAAd,2BAAc;EAAd;AAAc;;AAAd;EAAA,yDAAc;EAAd,4BAAc;EAAd,8BAAc;EAAd,iCAAc;UAAd;AAAc;;AAAd;EAAA,yDAAc;EAAd;AAAc;;AAAd;EAAA,yDAAc;EAAd;AAAc;;AAAd;EAAA,yDAAc;EAAd,8BAAc;EAAd,yBAAc;EAAd,2BAAc;EAAd,4BAAc;EAAd,8BAAc;EAAd,iCAAc;UAAd;AAAc;;AAAd;EAAA,yBAAc;EAAd;AAAc;;AAAd;EAAA,iBAAc;EAAd,qBAAc;EAAd,eAAc;EAAd,gBAAc;EAAd,UAAc;EAAd,gBAAc;EAAd;AAAc;;AAAd;EAAA;AAAc;;AAAd;EAAA,YAAc;EAAd,mBAAc;EAAd,SAAc;EAAd,gBAAc;EAAd,mBAAc;EAAd,eAAc;EAAd,qBAAc;EAAd,wBAAc;EAAd,kBAAc;EAAd,mBAAc;EAAd,0BAAc;EAAd,uBAAc;AAAA;;AAAd;EAAA;AAAc;;AAAd;EAAA,mBAAc;EAAd;AAAc;;AAAd;EAAA,YAAc;EAAd,mBAAc;AAAA;;AAAd;EAAA;AAAc;;AAAd;EAAA,eAAc;EAAd,cAAc;EAAd,mBAAc;EAAd,qBAAc;EAAd,SAAc;EAAd,gBAAc;EAAd,qBAAc;EAAd,wBAAc;EAAd;AAAc;;AAAd;EAAA;AAAc;;AAAd;EAAA;AAAc;;AAAd;EAAA,8BAAc;EAAd,mBAAc;EAAd,2GAAc;EAAd,yGAAc;EAAd,4FAAc;EAAd,sBAAc;EAAd;AAAc;;AAAd;EAAA,eAAc;EAAd,cAAc;EAAd,mBAAc;EAAd,qBAAc;EAAd,SAAc;EAAd,gBAAc;EAAd,qBAAc;EAAd,wBAAc;EAAd;AAAc;;AAAd;EAAA;AAAc;;AAAd;EAAA;AAAc;;AAAd;EAAA;AAAc;;AAAd;EAAA;AAAc;;AAAd;EAAA,wBAAc;EAAd,wBAAc;EAAd,mBAAc;EAAd,mBAAc;EAAd,cAAc;EAAd,cAAc;EAAd,cAAc;EAAd,eAAc;EAAd,eAAc;EAAd,aAAc;EAAd,aAAc;EAAd,kBAAc;EAAd,sCAAc;EAAd,8BAAc;EAAd,6BAAc;EAAd,4BAAc;EAAd,eAAc;EAAd,oBAAc;EAAd,sBAAc;EAAd,uBAAc;EAAd,wBAAc;EAAd,kBAAc;EAAd,2BAAc;EAAd,4BAAc;EAAd,sCAAc;EAAd,kCAAc;EAAd,2BAAc;EAAd,sBAAc;EAAd,8BAAc;EAAd,YAAc;EAAd,kBAAc;EAAd,gBAAc;EAAd,iBAAc;EAAd,kBAAc;EAAd,cAAc;EAAd,gBAAc;EAAd,aAAc;EAAd,mBAAc;EAAd,qBAAc;EAAd,2BAAc;EAAd,yBAAc;EAAd,0BAAc;EAAd,2BAAc;EAAd,uBAAc;EAAd,wBAAc;EAAd,yBAAc;EAAd;AAAc;;AAAd;EAAA,wBAAc;EAAd,wBAAc;EAAd,mBAAc;EAAd,mBAAc;EAAd,cAAc;EAAd,cAAc;EAAd,cAAc;EAAd,eAAc;EAAd,eAAc;EAAd,aAAc;EAAd,aAAc;EAAd,kBAAc;EAAd,sCAAc;EAAd,8BAAc;EAAd,6BAAc;EAAd,4BAAc;EAAd,eAAc;EAAd,oBAAc;EAAd,sBAAc;EAAd,uBAAc;EAAd,wBAAc;EAAd,kBAAc;EAAd,2BAAc;EAAd,4BAAc;EAAd,sCAAc;EAAd,kCAAc;EAAd,2BAAc;EAAd,sBAAc;EAAd,8BAAc;EAAd,YAAc;EAAd,kBAAc;EAAd,gBAAc;EAAd,iBAAc;EAAd,kBAAc;EAAd,cAAc;EAAd,gBAAc;EAAd,aAAc;EAAd,mBAAc;EAAd,qBAAc;EAAd,2BAAc;EAAd,yBAAc;EAAd,0BAAc;EAAd,2BAAc;EAAd,uBAAc;EAAd,wBAAc;EAAd,yBAAc;EAAd;AAAc;AACd;EAAA;AAAoB;AAApB;EAAA;AAAoB;AAApB;;EAAA;IAAA;EAAoB;;EAApB;IAAA;EAAoB;AAAA;AAApB;;EAAA;IAAA;EAAoB;;EAApB;IAAA;EAAoB;AAAA;AAApB;;EAAA;IAAA;EAAoB;;EAApB;IAAA;EAAoB;AAAA;AAApB;;EAAA;IAAA;EAAoB;;EAApB;IAAA;EAAoB;AAAA;AAApB;;EAAA;IAAA;EAAoB;;EAApB;IAAA;EAAoB;AAAA;AACpB;EAAA,kBAAmB;EAAnB,UAAmB;EAAnB,WAAmB;EAAnB,UAAmB;EAAnB,YAAmB;EAAnB,gBAAmB;EAAnB,sBAAmB;EAAnB,mBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,SAAmB;EAAnB;AAAmB;AAAnB;EAAA,QAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,iBAAmB;EAAnB;AAAmB;AAAnB;EAAA,iBAAmB;EAAnB;AAAmB;AAAnB;EAAA,mBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,gBAAmB;EAAnB,oBAAmB;EAAnB,4BAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,wBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,uBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,uBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,uBAAmB;EAAnB;AAAmB;AAAnB;EAAA,yBAAmB;EAAnB;AAAmB;AAAnB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;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,6BAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,4DAAmB;EAAnB,oEAAmB;EAAnB;AAAmB;AAAnB;EAAA,4DAAmB;EAAnB,mEAAmB;EAAnB;AAAmB;AAAnB;EAAA,4DAAmB;EAAnB,oEAAmB;EAAnB;AAAmB;AAAnB;EAAA,4DAAmB;EAAnB,qEAAmB;EAAnB;AAAmB;AAAnB;EAAA,4DAAmB;EAAnB,qEAAmB;EAAnB;AAAmB;AAAnB;EAAA,4DAAmB;EAAnB,oEAAmB;EAAnB;AAAmB;AAAnB;EAAA,4DAAmB;EAAnB,oEAAmB;EAAnB;AAAmB;AAAnB;EAAA,4DAAmB;EAAnB,oEAAmB;EAAnB;AAAmB;AAAnB;EAAA,4DAAmB;EAAnB,qEAAmB;EAAnB;AAAmB;AAAnB;EAAA,4DAAmB;EAAnB,qEAAmB;EAAnB;AAAmB;AAAnB;EAAA,4DAAmB;EAAnB,qEAAmB;EAAnB;AAAmB;AAAnB;EAAA,4DAAmB;EAAnB,oEAAmB;EAAnB;AAAmB;AAAnB;EAAA,oEAAmB;EAAnB;AAAmB;AAAnB;EAAA,oEAAmB;EAAnB;AAAmB;AAAnB;EAAA,qEAAmB;EAAnB;AAAmB;AAAnB;EAAA,qEAAmB;EAAnB;AAAmB;AAAnB;EAAA,qEAAmB;EAAnB;AAAmB;AAAnB;EAAA,qEAAmB;EAAnB;AAAmB;AAAnB;EAAA,sEAAmB;EAAnB;AAAmB;AAAnB;EAAA,oEAAmB;EAAnB;AAAmB;AAAnB;EAAA,oEAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,oBAAmB;KAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,iBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,qBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,qBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,qBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,gBAAmB;EAAnB;AAAmB;AAAnB;EAAA,qBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,qBAAmB;EAAnB;AAAmB;AAAnB;EAAA,mBAAmB;EAAnB;AAAmB;AAAnB;EAAA,qBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,iBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,iBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,eAAmB;EAAnB;AAAmB;AAAnB;EAAA,mBAAmB;EAAnB;AAAmB;AAAnB;EAAA,mBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,2BAAmB;EAAnB;AAAmB;AAAnB;EAAA,2BAAmB;EAAnB;AAAmB;AAAnB;EAAA,2BAAmB;EAAnB;AAAmB;AAAnB;EAAA,2BAAmB;EAAnB;AAAmB;AAAnB;EAAA,2BAAmB;EAAnB;AAAmB;AAAnB;EAAA,2BAAmB;EAAnB;AAAmB;AAAnB;EAAA,2BAAmB;EAAnB;AAAmB;AAAnB;E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AA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;A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EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,2BAGA;EAHA;AAGA;AAHA;EAAA,2BAGA;EAHA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA,oDAGA;EAHA,yDAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,sBAGA;EAHA;AAGA;AAHA;EAAA,sBAGA;EAHA;AAGA;AAHA;EAAA,sBAGA;EAHA;AAGA;AAHA;EAAA,sBAGA;EAHA;AAGA;AAHA;EAAA,sBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,sBAGA;EAHA;AAGA;AAHA;EAAA,sBAGA;EAHA;AAGA;AAHA;EAAA,sBAGA;EAHA;AAGA;AAHA;EAAA,sBAGA;EAHA;AAGA;AAHA;EAAA,sBAGA;EAHA;AAGA;AAHA;EAAA,sBAGA;EAHA;AAGA;AAHA;EAAA,sBAGA;EAHA;AAGA;AAHA;EAAA,sBAGA;EAHA;AAGA;AAHA;EAAA,sBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;;EAAA;IAAA;EAGA;;EAHA;IAAA,iBAGA;IAHA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA,kBAGA;IAHA;EAGA;;EAHA;IAAA,oBAGA;IAHA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA,eAGA;IAHA;EAGA;;EAHA;IAAA,kBAGA;IAHA;EAGA;AAAA;AAHA;;EAAA;IAAA;EAGA;;EAHA;IAAA,mBAGA;IAHA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA,uBAGA;IAHA,oDAGA;IAHA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA,8BAGA;IAHA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA,mBAGA;IAHA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA,oBAGA;IAHA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA,oBAGA;IAHA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA,oBAGA;IAHA;EAGA;AAAA;AAHA;;EAAA;IAAA,gBAGA;IAHA;EAGA;AAAA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA,8BAGA;EAHA;AAGA;AAHA;EAAA,kCAGA;EAHA;AAGA;AAHA;EAAA;AAGA",
            sourcesContent: [
              "@tailwind base;\r\n@tailwind components;\r\n@tailwind utilities;\r\n",
            ],
            sourceRoot: "",
          },
        ]);
        const k = m;
      },
    },
    t = {};
  function r(A) {
    var e = t[A];
    if (void 0 !== e) return e.exports;
    var o = (t[A] = { id: A, exports: {} });
    return (n[A].call(o.exports, o, o.exports, r), o.exports);
  }
  ((r.m = n),
    (A = []),
    (r.O = (n, t, e, o) => {
      if (!t) {
        var a = 1 / 0;
        for (l = 0; l < A.length; l++) {
          for (var [t, e, o] = A[l], i = !0, c = 0; c < t.length; c++)
            (!1 & o || a >= o) && Object.keys(r.O).every((A) => r.O[A](t[c]))
              ? t.splice(c--, 1)
              : ((i = !1), o < a && (a = o));
          if (i) {
            A.splice(l--, 1);
            var d = e();
            void 0 !== d && (n = d);
          }
        }
        return n;
      }
      o = o || 0;
      for (var l = A.length; l > 0 && A[l - 1][2] > o; l--) A[l] = A[l - 1];
      A[l] = [t, e, o];
    }),
    (r.n = (A) => {
      var n = A && A.__esModule ? () => A.default : () => A;
      return (r.d(n, { a: n }), n);
    }),
    (r.d = (A, n) => {
      for (var t in n)
        r.o(n, t) &&
          !r.o(A, t) &&
          Object.defineProperty(A, t, { enumerable: !0, get: n[t] });
    }),
    (r.g = (function () {
      if ("object" == typeof globalThis) return globalThis;
      try {
        return this || new Function("return this")();
      } catch (A) {
        if ("object" == typeof window) return window;
      }
    })()),
    (r.o = (A, n) => Object.prototype.hasOwnProperty.call(A, n)),
    (() => {
      r.b = document.baseURI || self.location.href;
      var A = { 141: 0 };
      r.O.j = (n) => 0 === A[n];
      var n = (n, t) => {
          var e,
            o,
            [a, i, c] = t,
            d = 0;
          if (a.some((n) => 0 !== A[n])) {
            for (e in i) r.o(i, e) && (r.m[e] = i[e]);
            if (c) var l = c(r);
          }
          for (n && n(t); d < a.length; d++)
            ((o = a[d]), r.o(A, o) && A[o] && A[o][0](), (A[o] = 0));
          return r.O(l);
        },
        t = (self.webpackChunkreactboilerplate =
          self.webpackChunkreactboilerplate || []);
      (t.forEach(n.bind(null, 0)), (t.push = n.bind(null, t.push.bind(t))));
    })(),
    (r.nc = void 0));
  var e = r.O(void 0, [583, 284, 207], () => r(9813));
  e = r.O(e);
})();
