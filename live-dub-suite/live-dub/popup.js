(() => {
  "use strict";
  var A,
    n,
    t,
    r = {
      2137: (A, n, t) => {
        var r = t(3337),
          e = t(8914),
          o = t(8865),
          a = t(6115),
          i = t(6287),
          c = t(6400),
          l = t(133),
          d = t(5979),
          s = t(577),
          p = t(8624),
          g = t(6315),
          u = t(5825),
          m = t(2552),
          b = t(9632),
          w = t(6683),
          f = t(7496),
          E = t(903),
          y = t(4753),
          B = t(5915),
          h = t(5599),
          v = t(7723);
        function x(A) {
          return (
            (x =
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
            x(A)
          );
        }
        function k() {
          k = function () {
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
          function l(A, n, t) {
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
            l({}, "");
          } catch (A) {
            l = function (A, n, t) {
              return (A[n] = t);
            };
          }
          function d(A, n, t, r) {
            var o = n && n.prototype instanceof w ? n : w,
              a = Object.create(o.prototype),
              i = new C(r || []);
            return (e(a, "_invoke", { value: S(A, t, i) }), a);
          }
          function s(A, n, t) {
            try {
              return { type: "normal", arg: A.call(n, t) };
            } catch (A) {
              return { type: "throw", arg: A };
            }
          }
          n.wrap = d;
          var p = "suspendedStart",
            g = "suspendedYield",
            u = "executing",
            m = "completed",
            b = {};
          function w() {}
          function f() {}
          function E() {}
          var y = {};
          l(y, a, function () {
            return this;
          });
          var B = Object.getPrototypeOf,
            h = B && B(B(O([])));
          h && h !== t && r.call(h, a) && (y = h);
          var v = (E.prototype = w.prototype = Object.create(y));
          function G(A) {
            ["next", "throw", "return"].forEach(function (n) {
              l(A, n, function (A) {
                return this._invoke(n, A);
              });
            });
          }
          function H(A, n) {
            function t(e, o, a, i) {
              var c = s(A[e], A, o);
              if ("throw" !== c.type) {
                var l = c.arg,
                  d = l.value;
                return d && "object" == x(d) && r.call(d, "__await")
                  ? n.resolve(d.__await).then(
                      function (A) {
                        t("next", A, a, i);
                      },
                      function (A) {
                        t("throw", A, a, i);
                      },
                    )
                  : n.resolve(d).then(
                      function (A) {
                        ((l.value = A), a(l));
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
          function S(n, t, r) {
            var e = p;
            return function (o, a) {
              if (e === u) throw new Error("Generator is already running");
              if (e === m) {
                if ("throw" === o) throw a;
                return { value: A, done: !0 };
              }
              for (r.method = o, r.arg = a; ; ) {
                var i = r.delegate;
                if (i) {
                  var c = I(i, r);
                  if (c) {
                    if (c === b) continue;
                    return c;
                  }
                }
                if ("next" === r.method) r.sent = r._sent = r.arg;
                else if ("throw" === r.method) {
                  if (e === p) throw ((e = m), r.arg);
                  r.dispatchException(r.arg);
                } else "return" === r.method && r.abrupt("return", r.arg);
                e = u;
                var l = s(n, t, r);
                if ("normal" === l.type) {
                  if (((e = r.done ? m : g), l.arg === b)) continue;
                  return { value: l.arg, done: r.done };
                }
                "throw" === l.type &&
                  ((e = m), (r.method = "throw"), (r.arg = l.arg));
              }
            };
          }
          function I(n, t) {
            var r = t.method,
              e = n.iterator[r];
            if (e === A)
              return (
                (t.delegate = null),
                ("throw" === r &&
                  n.iterator.return &&
                  ((t.method = "return"),
                  (t.arg = A),
                  I(n, t),
                  "throw" === t.method)) ||
                  ("return" !== r &&
                    ((t.method = "throw"),
                    (t.arg = new TypeError(
                      "The iterator does not provide a '" + r + "' method",
                    )))),
                b
              );
            var o = s(e, n.iterator, t.arg);
            if ("throw" === o.type)
              return (
                (t.method = "throw"),
                (t.arg = o.arg),
                (t.delegate = null),
                b
              );
            var a = o.arg;
            return a
              ? a.done
                ? ((t[n.resultName] = a.value),
                  (t.next = n.nextLoc),
                  "return" !== t.method && ((t.method = "next"), (t.arg = A)),
                  (t.delegate = null),
                  b)
                : a
              : ((t.method = "throw"),
                (t.arg = new TypeError("iterator result is not an object")),
                (t.delegate = null),
                b);
          }
          function L(A) {
            var n = { tryLoc: A[0] };
            (1 in A && (n.catchLoc = A[1]),
              2 in A && ((n.finallyLoc = A[2]), (n.afterLoc = A[3])),
              this.tryEntries.push(n));
          }
          function T(A) {
            var n = A.completion || {};
            ((n.type = "normal"), delete n.arg, (A.completion = n));
          }
          function C(A) {
            ((this.tryEntries = [{ tryLoc: "root" }]),
              A.forEach(L, this),
              this.reset(!0));
          }
          function O(n) {
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
            throw new TypeError(x(n) + " is not iterable");
          }
          return (
            (f.prototype = E),
            e(v, "constructor", { value: E, configurable: !0 }),
            e(E, "constructor", { value: f, configurable: !0 }),
            (f.displayName = l(E, c, "GeneratorFunction")),
            (n.isGeneratorFunction = function (A) {
              var n = "function" == typeof A && A.constructor;
              return (
                !!n &&
                (n === f || "GeneratorFunction" === (n.displayName || n.name))
              );
            }),
            (n.mark = function (A) {
              return (
                Object.setPrototypeOf
                  ? Object.setPrototypeOf(A, E)
                  : ((A.__proto__ = E), l(A, c, "GeneratorFunction")),
                (A.prototype = Object.create(v)),
                A
              );
            }),
            (n.awrap = function (A) {
              return { __await: A };
            }),
            G(H.prototype),
            l(H.prototype, i, function () {
              return this;
            }),
            (n.AsyncIterator = H),
            (n.async = function (A, t, r, e, o) {
              void 0 === o && (o = Promise);
              var a = new H(d(A, t, r, e), o);
              return n.isGeneratorFunction(t)
                ? a
                : a.next().then(function (A) {
                    return A.done ? A.value : a.next();
                  });
            }),
            G(v),
            l(v, c, "Generator"),
            l(v, a, function () {
              return this;
            }),
            l(v, "toString", function () {
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
            (n.values = O),
            (C.prototype = {
              constructor: C,
              reset: function (n) {
                if (
                  ((this.prev = 0),
                  (this.next = 0),
                  (this.sent = this._sent = A),
                  (this.done = !1),
                  (this.delegate = null),
                  (this.method = "next"),
                  (this.arg = A),
                  this.tryEntries.forEach(T),
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
                      l = r.call(a, "finallyLoc");
                    if (c && l) {
                      if (this.prev < a.catchLoc) return e(a.catchLoc, !0);
                      if (this.prev < a.finallyLoc) return e(a.finallyLoc);
                    } else if (c) {
                      if (this.prev < a.catchLoc) return e(a.catchLoc, !0);
                    } else {
                      if (!l)
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
                    ? ((this.method = "next"), (this.next = o.finallyLoc), b)
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
                  b
                );
              },
              finish: function (A) {
                for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                  var t = this.tryEntries[n];
                  if (t.finallyLoc === A)
                    return (this.complete(t.completion, t.afterLoc), T(t), b);
                }
              },
              catch: function (A) {
                for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                  var t = this.tryEntries[n];
                  if (t.tryLoc === A) {
                    var r = t.completion;
                    if ("throw" === r.type) {
                      var e = r.arg;
                      T(t);
                    }
                    return e;
                  }
                }
                throw new Error("illegal catch attempt");
              },
              delegateYield: function (n, t, r) {
                return (
                  (this.delegate = {
                    iterator: O(n),
                    resultName: t,
                    nextLoc: r,
                  }),
                  "next" === this.method && (this.arg = A),
                  b
                );
              },
            }),
            n
          );
        }
        function G(A, n, t, r, e, o, a) {
          try {
            var i = A[o](a),
              c = i.value;
          } catch (A) {
            return void t(A);
          }
          i.done ? n(c) : Promise.resolve(c).then(r, e);
        }
        function H(A) {
          return function () {
            var n = this,
              t = arguments;
            return new Promise(function (r, e) {
              var o = A.apply(n, t);
              function a(A) {
                G(o, r, e, a, i, "next", A);
              }
              function i(A) {
                G(o, r, e, a, i, "throw", A);
              }
              a(void 0);
            });
          };
        }
        function S(A, n) {
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
                  l = !1;
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
                  ((l = !0), (e = A));
                } finally {
                  try {
                    if (
                      !c &&
                      null != t.return &&
                      ((a = t.return()), Object(a) !== a)
                    )
                      return;
                  } finally {
                    if (l) throw e;
                  }
                }
                return i;
              }
            })(A, n) ||
            (function (A, n) {
              if (!A) return;
              if ("string" == typeof A) return I(A, n);
              var t = Object.prototype.toString.call(A).slice(8, -1);
              "Object" === t && A.constructor && (t = A.constructor.name);
              if ("Map" === t || "Set" === t) return Array.from(A);
              if (
                "Arguments" === t ||
                /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
              )
                return I(A, n);
            })(A, n) ||
            (function () {
              throw new TypeError(
                "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
              );
            })()
          );
        }
        function I(A, n) {
          (null == n || n > A.length) && (n = A.length);
          for (var t = 0, r = new Array(n); t < n; t++) r[t] = A[t];
          return r;
        }
        function L() {
          var A = S((0, r.useState)("en"), 2),
            n = A[0],
            t = A[1],
            e = S((0, r.useState)(!0), 2),
            o = e[0],
            a = e[1],
            i = S((0, r.useState)(0), 2),
            c = i[0],
            l = i[1];
          (0, r.useEffect)(function () {
            var A = !0;
            H(
              k().mark(function n() {
                var r;
                return k().wrap(function (n) {
                  for (;;)
                    switch ((n.prev = n.next)) {
                      case 0:
                        return ((n.next = 2), (0, v.LE)());
                      case 2:
                        ((r = n.sent), A && (t(r), a(!1)));
                      case 4:
                      case "end":
                        return n.stop();
                    }
                }, n);
              }),
            )();
            var n = (function () {
              var A = H(
                k().mark(function A(n, r) {
                  var e;
                  return k().wrap(function (A) {
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
                          return ((A.next = 5), (0, v.LE)());
                        case 5:
                          (t(e),
                            l(function (A) {
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
          var d = (0, r.useCallback)(
            (function () {
              var A = H(
                k().mark(function A(n) {
                  var r;
                  return k().wrap(function (A) {
                    for (;;)
                      switch ((A.prev = A.next)) {
                        case 0:
                          return ((A.next = 2), (0, v.xC)(n));
                        case 2:
                          return (
                            (r = A.sent) &&
                              (t(n),
                              l(function (A) {
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
                return (0, v.t)(A, n);
              },
              [n, c],
            ),
            locale: n,
            changeLanguage: d,
            supportedLanguages: (0, v.qX)(),
            isLoading: o,
          };
        }
        var T = t(916),
          C = t(7556),
          O = t(7952),
          z = t(2877),
          j = t(5610),
          N = t(3295),
          _ = t(8387),
          P = t(505),
          M = t(9566),
          F = t(1147),
          D = t(6504),
          R = t(4072),
          U = t(1166),
          W = t(6623),
          Y = t(3582),
          q = t(2722);
        function X(A) {
          return (
            (X =
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
            X(A)
          );
        }
        function $(A, n) {
          for (var t = 0; t < n.length; t++) {
            var r = n[t];
            ((r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              "value" in r && (r.writable = !0),
              Object.defineProperty(A, V(r.key), r));
          }
        }
        function K(A, n, t) {
          return (
            (n = V(n)) in A
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
        function V(A) {
          var n = (function (A, n) {
            if ("object" != X(A) || !A) return A;
            var t = A[Symbol.toPrimitive];
            if (void 0 !== t) {
              var r = t.call(A, n || "default");
              if ("object" != X(r)) return r;
              throw new TypeError(
                "@@toPrimitive must return a primitive value.",
              );
            }
            return ("string" === n ? String : Number)(A);
          })(A, "string");
          return "symbol" == X(n) ? n : String(n);
        }
        const J = new ((function () {
          function A() {
            var n = this;
            (!(function (A, n) {
              if (!(A instanceof n))
                throw new TypeError("Cannot call a class as a function");
            })(this, A),
              K(this, "name", "DubTab"),
              K(this, "IndexedDB_MAX_RECORD_COUNT", 300),
              K(this, "checkoutName", "dubtab"),
              K(this, "version", chrome.runtime.getManifest().version),
              K(this, "contactEmail", "support@dubtab.com"),
              K(this, "discordInviteUrl", "https://discord.gg/7V56xZ4sXQ"),
              K(this, "configs", {
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
              K(
                this,
                "clientId",
                "781969812770-98iajtquasmhrrrm23fdo817d3s69rl6.apps.googleusercontent.com",
              ),
              K(this, "isNetworkError", !1),
              K(this, "updateConfigs", function (A) {
                n.configs = A;
              }),
              K(this, "getSubscriptionURL", function () {
                return n.configs.isTestMode
                  ? n.configs.subscriptionURLTest
                  : n.configs.subscriptionURL;
              }),
              (0, q.l_)(this));
          }
          var n, t, r;
          return (
            (n = A),
            (t = [
              {
                key: "getPropValue",
                value: function (A) {
                  return A in this ? (0, q.HO)(this[A]) : void 0;
                },
              },
            ]) && $(n.prototype, t),
            r && $(n, r),
            Object.defineProperty(n, "prototype", { writable: !1 }),
            A
          );
        })())();
        function Q(A) {
          return (
            (Q =
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
            Q(A)
          );
        }
        function Z() {
          Z = function () {
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
          function l(A, n, t) {
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
            l({}, "");
          } catch (A) {
            l = function (A, n, t) {
              return (A[n] = t);
            };
          }
          function d(A, n, t, r) {
            var o = n && n.prototype instanceof w ? n : w,
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
          n.wrap = d;
          var p = "suspendedStart",
            g = "suspendedYield",
            u = "executing",
            m = "completed",
            b = {};
          function w() {}
          function f() {}
          function E() {}
          var y = {};
          l(y, a, function () {
            return this;
          });
          var B = Object.getPrototypeOf,
            h = B && B(B(T([])));
          h && h !== t && r.call(h, a) && (y = h);
          var v = (E.prototype = w.prototype = Object.create(y));
          function x(A) {
            ["next", "throw", "return"].forEach(function (n) {
              l(A, n, function (A) {
                return this._invoke(n, A);
              });
            });
          }
          function k(A, n) {
            function t(e, o, a, i) {
              var c = s(A[e], A, o);
              if ("throw" !== c.type) {
                var l = c.arg,
                  d = l.value;
                return d && "object" == Q(d) && r.call(d, "__await")
                  ? n.resolve(d.__await).then(
                      function (A) {
                        t("next", A, a, i);
                      },
                      function (A) {
                        t("throw", A, a, i);
                      },
                    )
                  : n.resolve(d).then(
                      function (A) {
                        ((l.value = A), a(l));
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
            var e = p;
            return function (o, a) {
              if (e === u) throw new Error("Generator is already running");
              if (e === m) {
                if ("throw" === o) throw a;
                return { value: A, done: !0 };
              }
              for (r.method = o, r.arg = a; ; ) {
                var i = r.delegate;
                if (i) {
                  var c = H(i, r);
                  if (c) {
                    if (c === b) continue;
                    return c;
                  }
                }
                if ("next" === r.method) r.sent = r._sent = r.arg;
                else if ("throw" === r.method) {
                  if (e === p) throw ((e = m), r.arg);
                  r.dispatchException(r.arg);
                } else "return" === r.method && r.abrupt("return", r.arg);
                e = u;
                var l = s(n, t, r);
                if ("normal" === l.type) {
                  if (((e = r.done ? m : g), l.arg === b)) continue;
                  return { value: l.arg, done: r.done };
                }
                "throw" === l.type &&
                  ((e = m), (r.method = "throw"), (r.arg = l.arg));
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
                b
              );
            var o = s(e, n.iterator, t.arg);
            if ("throw" === o.type)
              return (
                (t.method = "throw"),
                (t.arg = o.arg),
                (t.delegate = null),
                b
              );
            var a = o.arg;
            return a
              ? a.done
                ? ((t[n.resultName] = a.value),
                  (t.next = n.nextLoc),
                  "return" !== t.method && ((t.method = "next"), (t.arg = A)),
                  (t.delegate = null),
                  b)
                : a
              : ((t.method = "throw"),
                (t.arg = new TypeError("iterator result is not an object")),
                (t.delegate = null),
                b);
          }
          function S(A) {
            var n = { tryLoc: A[0] };
            (1 in A && (n.catchLoc = A[1]),
              2 in A && ((n.finallyLoc = A[2]), (n.afterLoc = A[3])),
              this.tryEntries.push(n));
          }
          function I(A) {
            var n = A.completion || {};
            ((n.type = "normal"), delete n.arg, (A.completion = n));
          }
          function L(A) {
            ((this.tryEntries = [{ tryLoc: "root" }]),
              A.forEach(S, this),
              this.reset(!0));
          }
          function T(n) {
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
            throw new TypeError(Q(n) + " is not iterable");
          }
          return (
            (f.prototype = E),
            e(v, "constructor", { value: E, configurable: !0 }),
            e(E, "constructor", { value: f, configurable: !0 }),
            (f.displayName = l(E, c, "GeneratorFunction")),
            (n.isGeneratorFunction = function (A) {
              var n = "function" == typeof A && A.constructor;
              return (
                !!n &&
                (n === f || "GeneratorFunction" === (n.displayName || n.name))
              );
            }),
            (n.mark = function (A) {
              return (
                Object.setPrototypeOf
                  ? Object.setPrototypeOf(A, E)
                  : ((A.__proto__ = E), l(A, c, "GeneratorFunction")),
                (A.prototype = Object.create(v)),
                A
              );
            }),
            (n.awrap = function (A) {
              return { __await: A };
            }),
            x(k.prototype),
            l(k.prototype, i, function () {
              return this;
            }),
            (n.AsyncIterator = k),
            (n.async = function (A, t, r, e, o) {
              void 0 === o && (o = Promise);
              var a = new k(d(A, t, r, e), o);
              return n.isGeneratorFunction(t)
                ? a
                : a.next().then(function (A) {
                    return A.done ? A.value : a.next();
                  });
            }),
            x(v),
            l(v, c, "Generator"),
            l(v, a, function () {
              return this;
            }),
            l(v, "toString", function () {
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
            (n.values = T),
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
                  this.tryEntries.forEach(I),
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
                      l = r.call(a, "finallyLoc");
                    if (c && l) {
                      if (this.prev < a.catchLoc) return e(a.catchLoc, !0);
                      if (this.prev < a.finallyLoc) return e(a.finallyLoc);
                    } else if (c) {
                      if (this.prev < a.catchLoc) return e(a.catchLoc, !0);
                    } else {
                      if (!l)
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
                    ? ((this.method = "next"), (this.next = o.finallyLoc), b)
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
                  b
                );
              },
              finish: function (A) {
                for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                  var t = this.tryEntries[n];
                  if (t.finallyLoc === A)
                    return (this.complete(t.completion, t.afterLoc), I(t), b);
                }
              },
              catch: function (A) {
                for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                  var t = this.tryEntries[n];
                  if (t.tryLoc === A) {
                    var r = t.completion;
                    if ("throw" === r.type) {
                      var e = r.arg;
                      I(t);
                    }
                    return e;
                  }
                }
                throw new Error("illegal catch attempt");
              },
              delegateYield: function (n, t, r) {
                return (
                  (this.delegate = {
                    iterator: T(n),
                    resultName: t,
                    nextLoc: r,
                  }),
                  "next" === this.method && (this.arg = A),
                  b
                );
              },
            }),
            n
          );
        }
        function AA(A, n, t, r, e, o, a) {
          try {
            var i = A[o](a),
              c = i.value;
          } catch (A) {
            return void t(A);
          }
          i.done ? n(c) : Promise.resolve(c).then(r, e);
        }
        function nA(A) {
          return function () {
            var n = this,
              t = arguments;
            return new Promise(function (r, e) {
              var o = A.apply(n, t);
              function a(A) {
                AA(o, r, e, a, i, "next", A);
              }
              function i(A) {
                AA(o, r, e, a, i, "throw", A);
              }
              a(void 0);
            });
          };
        }
        var tA, rA;
        try {
          tA = (0, U.Wp)({
            apiKey: "AIzaSyDlJFT3F8TTKhmWvMOitlQ2l6qcU7KuSFo",
            authDomain: "dubtab.firebaseapp.com",
            databaseURL: "https://dubtab-default-rtdb.firebaseio.com",
            projectId: "dubtab",
            storageBucket: "dubtab.firebasestorage.app",
            messagingSenderId: "781969812770",
            appId: "1:781969812770:web:1f7d811a0a95ea5cf0097b",
            measurementId: "G-TECRS09BPW",
          });
        } catch (A) {}
        try {
          if (
            "undefined" != typeof ServiceWorkerGlobalScope &&
            self instanceof ServiceWorkerGlobalScope
          )
            try {
              rA = (0, W.Nu)(tA, { persistence: W.Gt });
            } catch (A) {
              try {
                rA = (0, W.Nu)(tA, { persistence: W.gz });
              } catch (A) {
                rA = (0, W.xI)(tA);
              }
            }
          else {
            rA = (0, W.xI)(tA);
            try {
              (0, W.oM)(rA, W.Gt)
                .then(function () {})
                .catch(function () {
                  return (0, W.oM)(rA, W.F0)
                    .then(function () {})
                    .catch(function () {});
                });
            } catch (A) {}
          }
        } catch (A) {
          rA = (0, W.xI)(tA);
        }
        var eA = (0, Y.C3)(tA),
          oA = !1;
        function aA(A) {
          return iA.apply(this, arguments);
        }
        function iA() {
          return (iA = nA(
            Z().mark(function A(n) {
              var t, r;
              return Z().wrap(
                function (A) {
                  for (;;)
                    switch ((A.prev = A.next)) {
                      case 0:
                        return (
                          (A.prev = 0),
                          (t = (0, Y.KR)(eA)),
                          (A.next = 4),
                          (0, Y.Jt)((0, Y.jf)(t, n))
                        );
                      case 4:
                        if (!(r = A.sent).exists()) {
                          A.next = 9;
                          break;
                        }
                        return A.abrupt("return", r.val());
                      case 9:
                        return A.abrupt("return", null);
                      case 10:
                        A.next = 15;
                        break;
                      case 12:
                        ((A.prev = 12), (A.t0 = A.catch(0)));
                      case 15:
                      case "end":
                        return A.stop();
                    }
                },
                A,
                null,
                [[0, 12]],
              );
            }),
          )).apply(this, arguments);
        }
        !(function () {
          if (!oA) {
            oA = !0;
            try {
              (0, W.hg)(rA, function (A) {});
            } catch (A) {}
          }
        })();
        const cA = function (A) {
          var n = A.isOpen,
            t = A.onClose,
            e = A.modalText,
            o = A.modalTitle,
            a = void 0 === o ? "" : o,
            c = A.canClose,
            l = void 0 === c || c,
            s = A.yesAndCancelButton,
            p = void 0 !== s && s,
            g = A.yesHandler,
            u = void 0 === g ? function () {} : g;
          return r.createElement(
            i.az,
            null,
            r.createElement(
              C.aF,
              { zIndex: "9999", closeOnOverlayClick: l, isOpen: n, onClose: t },
              r.createElement(O.m, null),
              r.createElement(
                z.$,
                null,
                r.createElement(j.r, null, a),
                r.createElement(N.s, null),
                r.createElement(_.c, { fontSize: "15" }, e),
                r.createElement(
                  P.j,
                  null,
                  p
                    ? r.createElement(
                        r.Fragment,
                        null,
                        r.createElement(
                          d.$,
                          { colorScheme: "twitter", mr: 3, onClick: u },
                          "Yes",
                        ),
                        r.createElement(
                          d.$,
                          { colorScheme: "twitter", mr: 3, onClick: t },
                          "Cancel",
                        ),
                      )
                    : r.createElement(
                        d.$,
                        { colorScheme: "blue", mr: 3, onClick: t },
                        "OK",
                      ),
                ),
              ),
            ),
          );
        };
        var lA = t(652),
          dA = (t(9844), t(5135));
        var sA = null,
          pA = null;
        function gA() {
          return sA
            ? Promise.resolve(sA)
            : pA ||
                (pA = new Promise(function (A) {
                  chrome.storage.local.get(
                    ["posthog_distinct_id"],
                    function (n) {
                      chrome.runtime.lastError;
                      var t = n.posthog_distinct_id;
                      if (t) A(t);
                      else {
                        var r = (0, dA.A)();
                        chrome.storage.local.set(
                          { posthog_distinct_id: r },
                          function () {
                            (chrome.runtime.lastError, A(r));
                          },
                        );
                      }
                    },
                  );
                }).then(function (A) {
                  var n = new lA.f2();
                  n.init("phc_wcppbOeHIItxpyOMS2p8fegEU4gSbpboHGKXAHkUQRL", {
                    api_host: "https://us.i.posthog.com",
                    disable_external_dependency_loading: !0,
                    persistence: "localStorage",
                    bootstrap: { distinctID: A },
                    autocapture: !1,
                    capture_pageview: !1,
                    capture_pageleave: !1,
                    capture_exceptions: {
                      capture_unhandled_errors: !0,
                      capture_unhandled_rejections: !0,
                      capture_console_errors: !0,
                    },
                    before_send: function (A) {
                      try {
                        if (!A || "$exception" !== A.event) return A;
                        var n = A.properties || {},
                          t = (n.$exception_list || [])[0] || {},
                          r =
                            t.value ||
                            t.$exception_message ||
                            n.$exception_message ||
                            "",
                          e =
                            t.type ||
                            t.$exception_type ||
                            n.$exception_type ||
                            "";
                        return r.includes("Extension context invalidated") ||
                          r.includes("Cannot access a chrome") ||
                          r.includes("NetworkError") ||
                          r.includes("Failed to fetch") ||
                          "NetworkError" === e ||
                          r.includes("ResizeObserver loop")
                          ? null
                          : ((n.extension_context = {
                              is_offscreen:
                                "undefined" != typeof window &&
                                window.location.href.includes("offscreen.html"),
                              is_popup:
                                "undefined" != typeof window &&
                                window.location.href.includes("popup.html"),
                              is_background:
                                "undefined" != typeof chrome &&
                                !(
                                  !chrome.runtime ||
                                  !chrome.runtime.getBackgroundPage
                                ),
                              page_url:
                                "undefined" != typeof window
                                  ? window.location.href
                                  : "",
                            }),
                            (A.properties = n),
                            A);
                      } catch (n) {
                        return A;
                      }
                    },
                  });
                  try {
                    n.register({
                      extension_name: "dubtab",
                      platform: "extension",
                      extension_version: chrome.runtime.getManifest().version,
                    });
                  } catch (A) {}
                  try {
                    "undefined" != typeof window && (window.posthog = n);
                  } catch (A) {}
                  return ((sA = n), n);
                }));
        }
        function uA(A, n) {
          return gA()
            .then(function (t) {
              t.capture(A, n);
            })
            .catch(function () {});
        }
        function mA(A) {
          return (
            (mA =
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
            mA(A)
          );
        }
        function bA(A, n) {
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
        function wA(A, n) {
          for (var t = 0; t < n.length; t++) {
            var r = n[t];
            ((r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              "value" in r && (r.writable = !0),
              Object.defineProperty(A, yA(r.key), r));
          }
        }
        function fA(A, n, t) {
          return (
            n && wA(A.prototype, n),
            t && wA(A, t),
            Object.defineProperty(A, "prototype", { writable: !1 }),
            A
          );
        }
        function EA(A, n, t) {
          return (
            (n = yA(n)) in A
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
        function yA(A) {
          var n = (function (A, n) {
            if ("object" != mA(A) || !A) return A;
            var t = A[Symbol.toPrimitive];
            if (void 0 !== t) {
              var r = t.call(A, n || "default");
              if ("object" != mA(r)) return r;
              throw new TypeError(
                "@@toPrimitive must return a primitive value.",
              );
            }
            return ("string" === n ? String : Number)(A);
          })(A, "string");
          return "symbol" == mA(n) ? n : String(n);
        }
        const BA = new (fA(function A() {
          var n = this;
          (!(function (A, n) {
            if (!(A instanceof n))
              throw new TypeError("Cannot call a class as a function");
          })(this, A),
            EA(this, "userInfo", {
              email: "",
              userLevel: "",
              uid: "",
              photoURL: "",
              displayName: "",
              proStatus: "",
              state: "",
            }),
            EA(this, "updateUserInfo", function (A) {
              n.userInfo = (function (A) {
                for (var n = 1; n < arguments.length; n++) {
                  var t = null != arguments[n] ? arguments[n] : {};
                  n % 2
                    ? bA(Object(t), !0).forEach(function (n) {
                        EA(A, n, t[n]);
                      })
                    : Object.getOwnPropertyDescriptors
                      ? Object.defineProperties(
                          A,
                          Object.getOwnPropertyDescriptors(t),
                        )
                      : bA(Object(t)).forEach(function (n) {
                          Object.defineProperty(
                            A,
                            n,
                            Object.getOwnPropertyDescriptor(t, n),
                          );
                        });
                }
                return A;
              })({}, A);
            }),
            (0, q.l_)(this));
        }))();
        function hA() {
          var A;
          uA("upgrade_clicked", {
            userLevel:
              (null === (A = BA.userInfo) || void 0 === A
                ? void 0
                : A.userLevel) || "free",
            source: "home_page",
          });
          var n = BA.userInfo.email || "",
            t = BA.userInfo.uid || "",
            r = new URLSearchParams({
              productName: J.checkoutName,
              extensionEmail: n,
              extensionUserId: t,
            }),
            e = "".concat(J.getSubscriptionURL()).concat(r.toString());
          chrome.tabs.create({ url: e });
        }
        function vA(A) {
          return (
            (vA =
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
            vA(A)
          );
        }
        function xA() {
          xA = function () {
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
          function l(A, n, t) {
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
            l({}, "");
          } catch (A) {
            l = function (A, n, t) {
              return (A[n] = t);
            };
          }
          function d(A, n, t, r) {
            var o = n && n.prototype instanceof w ? n : w,
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
          n.wrap = d;
          var p = "suspendedStart",
            g = "suspendedYield",
            u = "executing",
            m = "completed",
            b = {};
          function w() {}
          function f() {}
          function E() {}
          var y = {};
          l(y, a, function () {
            return this;
          });
          var B = Object.getPrototypeOf,
            h = B && B(B(T([])));
          h && h !== t && r.call(h, a) && (y = h);
          var v = (E.prototype = w.prototype = Object.create(y));
          function x(A) {
            ["next", "throw", "return"].forEach(function (n) {
              l(A, n, function (A) {
                return this._invoke(n, A);
              });
            });
          }
          function k(A, n) {
            function t(e, o, a, i) {
              var c = s(A[e], A, o);
              if ("throw" !== c.type) {
                var l = c.arg,
                  d = l.value;
                return d && "object" == vA(d) && r.call(d, "__await")
                  ? n.resolve(d.__await).then(
                      function (A) {
                        t("next", A, a, i);
                      },
                      function (A) {
                        t("throw", A, a, i);
                      },
                    )
                  : n.resolve(d).then(
                      function (A) {
                        ((l.value = A), a(l));
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
            var e = p;
            return function (o, a) {
              if (e === u) throw new Error("Generator is already running");
              if (e === m) {
                if ("throw" === o) throw a;
                return { value: A, done: !0 };
              }
              for (r.method = o, r.arg = a; ; ) {
                var i = r.delegate;
                if (i) {
                  var c = H(i, r);
                  if (c) {
                    if (c === b) continue;
                    return c;
                  }
                }
                if ("next" === r.method) r.sent = r._sent = r.arg;
                else if ("throw" === r.method) {
                  if (e === p) throw ((e = m), r.arg);
                  r.dispatchException(r.arg);
                } else "return" === r.method && r.abrupt("return", r.arg);
                e = u;
                var l = s(n, t, r);
                if ("normal" === l.type) {
                  if (((e = r.done ? m : g), l.arg === b)) continue;
                  return { value: l.arg, done: r.done };
                }
                "throw" === l.type &&
                  ((e = m), (r.method = "throw"), (r.arg = l.arg));
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
                b
              );
            var o = s(e, n.iterator, t.arg);
            if ("throw" === o.type)
              return (
                (t.method = "throw"),
                (t.arg = o.arg),
                (t.delegate = null),
                b
              );
            var a = o.arg;
            return a
              ? a.done
                ? ((t[n.resultName] = a.value),
                  (t.next = n.nextLoc),
                  "return" !== t.method && ((t.method = "next"), (t.arg = A)),
                  (t.delegate = null),
                  b)
                : a
              : ((t.method = "throw"),
                (t.arg = new TypeError("iterator result is not an object")),
                (t.delegate = null),
                b);
          }
          function S(A) {
            var n = { tryLoc: A[0] };
            (1 in A && (n.catchLoc = A[1]),
              2 in A && ((n.finallyLoc = A[2]), (n.afterLoc = A[3])),
              this.tryEntries.push(n));
          }
          function I(A) {
            var n = A.completion || {};
            ((n.type = "normal"), delete n.arg, (A.completion = n));
          }
          function L(A) {
            ((this.tryEntries = [{ tryLoc: "root" }]),
              A.forEach(S, this),
              this.reset(!0));
          }
          function T(n) {
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
            throw new TypeError(vA(n) + " is not iterable");
          }
          return (
            (f.prototype = E),
            e(v, "constructor", { value: E, configurable: !0 }),
            e(E, "constructor", { value: f, configurable: !0 }),
            (f.displayName = l(E, c, "GeneratorFunction")),
            (n.isGeneratorFunction = function (A) {
              var n = "function" == typeof A && A.constructor;
              return (
                !!n &&
                (n === f || "GeneratorFunction" === (n.displayName || n.name))
              );
            }),
            (n.mark = function (A) {
              return (
                Object.setPrototypeOf
                  ? Object.setPrototypeOf(A, E)
                  : ((A.__proto__ = E), l(A, c, "GeneratorFunction")),
                (A.prototype = Object.create(v)),
                A
              );
            }),
            (n.awrap = function (A) {
              return { __await: A };
            }),
            x(k.prototype),
            l(k.prototype, i, function () {
              return this;
            }),
            (n.AsyncIterator = k),
            (n.async = function (A, t, r, e, o) {
              void 0 === o && (o = Promise);
              var a = new k(d(A, t, r, e), o);
              return n.isGeneratorFunction(t)
                ? a
                : a.next().then(function (A) {
                    return A.done ? A.value : a.next();
                  });
            }),
            x(v),
            l(v, c, "Generator"),
            l(v, a, function () {
              return this;
            }),
            l(v, "toString", function () {
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
            (n.values = T),
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
                  this.tryEntries.forEach(I),
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
                      l = r.call(a, "finallyLoc");
                    if (c && l) {
                      if (this.prev < a.catchLoc) return e(a.catchLoc, !0);
                      if (this.prev < a.finallyLoc) return e(a.finallyLoc);
                    } else if (c) {
                      if (this.prev < a.catchLoc) return e(a.catchLoc, !0);
                    } else {
                      if (!l)
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
                    ? ((this.method = "next"), (this.next = o.finallyLoc), b)
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
                  b
                );
              },
              finish: function (A) {
                for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                  var t = this.tryEntries[n];
                  if (t.finallyLoc === A)
                    return (this.complete(t.completion, t.afterLoc), I(t), b);
                }
              },
              catch: function (A) {
                for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                  var t = this.tryEntries[n];
                  if (t.tryLoc === A) {
                    var r = t.completion;
                    if ("throw" === r.type) {
                      var e = r.arg;
                      I(t);
                    }
                    return e;
                  }
                }
                throw new Error("illegal catch attempt");
              },
              delegateYield: function (n, t, r) {
                return (
                  (this.delegate = {
                    iterator: T(n),
                    resultName: t,
                    nextLoc: r,
                  }),
                  "next" === this.method && (this.arg = A),
                  b
                );
              },
            }),
            n
          );
        }
        function kA(A, n, t, r, e, o, a) {
          try {
            var i = A[o](a),
              c = i.value;
          } catch (A) {
            return void t(A);
          }
          i.done ? n(c) : Promise.resolve(c).then(r, e);
        }
        function GA(A) {
          return function () {
            var n = this,
              t = arguments;
            return new Promise(function (r, e) {
              var o = A.apply(n, t);
              function a(A) {
                kA(o, r, e, a, i, "next", A);
              }
              function i(A) {
                kA(o, r, e, a, i, "throw", A);
              }
              a(void 0);
            });
          };
        }
        function HA(A) {
          return "users/".concat(A.uid, "/meta");
        }
        function SA(A) {
          return IA.apply(this, arguments);
        }
        function IA() {
          return (IA = GA(
            xA().mark(function A(n) {
              var t;
              return xA().wrap(function (A) {
                for (;;)
                  switch ((A.prev = A.next)) {
                    case 0:
                      if (!n) {
                        A.next = 8;
                        break;
                      }
                      return ((A.next = 3), aA(HA(n)));
                    case 3:
                      if (!(t = A.sent)) {
                        A.next = 6;
                        break;
                      }
                      return A.abrupt("return", t);
                    case 6:
                      A.next = 9;
                      break;
                    case 8:
                      return A.abrupt("return", null);
                    case 9:
                    case "end":
                      return A.stop();
                  }
              }, A);
            }),
          )).apply(this, arguments);
        }
        function LA(A, n) {
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
                  l = !1;
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
                  ((l = !0), (e = A));
                } finally {
                  try {
                    if (
                      !c &&
                      null != t.return &&
                      ((a = t.return()), Object(a) !== a)
                    )
                      return;
                  } finally {
                    if (l) throw e;
                  }
                }
                return i;
              }
            })(A, n) ||
            (function (A, n) {
              if (!A) return;
              if ("string" == typeof A) return TA(A, n);
              var t = Object.prototype.toString.call(A).slice(8, -1);
              "Object" === t && A.constructor && (t = A.constructor.name);
              if ("Map" === t || "Set" === t) return Array.from(A);
              if (
                "Arguments" === t ||
                /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
              )
                return TA(A, n);
            })(A, n) ||
            (function () {
              throw new TypeError(
                "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
              );
            })()
          );
        }
        function TA(A, n) {
          (null == n || n > A.length) && (n = A.length);
          for (var t = 0, r = new Array(n); t < n; t++) r[t] = A[t];
          return r;
        }
        const CA = function () {
          var A = L().t,
            n = LA((0, r.useState)(!1), 2),
            t = n[0],
            e = n[1];
          return (
            (0, r.useEffect)(function () {
              chrome.runtime.onMessage.addListener(function (A, n, t) {
                "bcRefreshSigningState" == A.type && e(A.isSigning);
              });
            }, []),
            (0, r.useEffect)(function () {
              chrome.runtime.onMessage.addListener(function (A, n, t) {
                "bcRefreshSigningUserInfo" == A.type &&
                  (BA.updateUserInfo(A.userInfo), e(!1));
              });
            }, []),
            r.createElement(
              i.az,
              { bg: "white", py: 5, px: 7 },
              r.createElement(
                c.B,
                { spacing: 4, align: "center" },
                r.createElement(
                  i.az,
                  { textAlign: "center", maxW: "460px" },
                  r.createElement(
                    l.E,
                    {
                      fontSize: "lg",
                      fontWeight: "600",
                      lineHeight: "base",
                      letterSpacing: "tight",
                      color: "gray.700",
                    },
                    A(
                      "signIn.headline",
                      "Sign in to translate and transcribe any video and audio in realtime",
                    ),
                  ),
                ),
                r.createElement(
                  i.az,
                  {
                    bg: "gray.50",
                    borderRadius: "xl",
                    p: 4,
                    maxW: "400px",
                    w: "full",
                    boxShadow: "sm",
                  },
                  r.createElement(
                    c.B,
                    { spacing: 2.5 },
                    r.createElement(
                      i.az,
                      { display: "flex", alignItems: "center" },
                      r.createElement(
                        i.az,
                        {
                          bg: "green.50",
                          borderRadius: "full",
                          w: "24px",
                          h: "24px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mr: 3,
                          flexShrink: 0,
                        },
                        r.createElement(
                          l.E,
                          {
                            color: "green.500",
                            fontSize: "md",
                            fontWeight: "bold",
                          },
                          "✓",
                        ),
                      ),
                      r.createElement(
                        l.E,
                        {
                          fontSize: "sm",
                          color: "gray.700",
                          fontWeight: "500",
                        },
                        A("signIn.feature1", "Watch videos in 60+ languages"),
                      ),
                    ),
                    r.createElement(
                      i.az,
                      { display: "flex", alignItems: "center" },
                      r.createElement(
                        i.az,
                        {
                          bg: "green.50",
                          borderRadius: "full",
                          w: "24px",
                          h: "24px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mr: 3,
                          flexShrink: 0,
                        },
                        r.createElement(
                          l.E,
                          {
                            color: "green.500",
                            fontSize: "md",
                            fontWeight: "bold",
                          },
                          "✓",
                        ),
                      ),
                      r.createElement(
                        l.E,
                        {
                          fontSize: "sm",
                          color: "gray.700",
                          fontWeight: "500",
                        },
                        A(
                          "signIn.feature2",
                          "Real-time translation & transcription",
                        ),
                      ),
                    ),
                    r.createElement(
                      i.az,
                      { display: "flex", alignItems: "center" },
                      r.createElement(
                        i.az,
                        {
                          bg: "green.50",
                          borderRadius: "full",
                          w: "24px",
                          h: "24px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mr: 3,
                          flexShrink: 0,
                        },
                        r.createElement(
                          l.E,
                          {
                            color: "green.500",
                            fontSize: "md",
                            fontWeight: "bold",
                          },
                          "✓",
                        ),
                      ),
                      r.createElement(
                        l.E,
                        {
                          fontSize: "sm",
                          color: "gray.700",
                          fontWeight: "500",
                        },
                        A(
                          "signIn.feature3",
                          "Understand podcasts in any language",
                        ),
                      ),
                    ),
                  ),
                ),
                r.createElement(
                  i.az,
                  { mt: 2, w: "full", maxW: "400px" },
                  r.createElement(
                    d.$,
                    {
                      onClick: function () {
                        (e(!0),
                          uA("google_login_clicked"),
                          chrome.runtime.sendMessage({
                            type: "signInWithGoogle",
                          }));
                      },
                      size: "lg",
                      colorScheme: "white",
                      variant: "outline",
                      borderColor: "gray.300",
                      borderWidth: "1.5px",
                      borderRadius: "xl",
                      w: "full",
                      py: 5,
                      fontSize: "md",
                      fontWeight: "600",
                      isLoading: t,
                      isDisabled: t,
                      _hover: {
                        bg: "gray.50",
                        borderColor: "gray.400",
                        transform: "translateY(-2px)",
                        boxShadow: "lg",
                      },
                      transition: "all 0.2s",
                      boxShadow: "sm",
                    },
                    r.createElement("img", {
                      src: "../../imgs/login.png",
                      alt: "Google",
                      style: {
                        width: "20px",
                        height: "20px",
                        marginRight: "12px",
                      },
                    }),
                    A("signIn.continueWithGoogle", "Continue with Google"),
                  ),
                ),
              ),
            )
          );
        };
        var OA = t(9549),
          zA = [
            {
              name: "Afrikaans",
              nativeName: "Afrikaans",
              code: "af",
              supportTTS: !0,
            },
            {
              name: "Albanian",
              nativeName: "Shqip",
              code: "sq",
              supportTTS: !1,
            },
            {
              name: "Arabic",
              nativeName: "العربية",
              code: "ar",
              supportTTS: !0,
            },
            {
              name: "Azerbaijani",
              nativeName: "Azərbaycan",
              code: "az",
              supportTTS: !1,
            },
            {
              name: "Basque",
              nativeName: "Euskara",
              code: "eu",
              supportTTS: !0,
            },
            {
              name: "Belarusian",
              nativeName: "Беларуская",
              code: "be",
              supportTTS: !1,
            },
            {
              name: "Bengali",
              nativeName: "বাংলা",
              code: "bn",
              supportTTS: !0,
            },
            {
              name: "Bosnian",
              nativeName: "Bosanski",
              code: "bs",
              supportTTS: !1,
            },
            {
              name: "Bulgarian",
              nativeName: "Български",
              code: "bg",
              supportTTS: !0,
            },
            {
              name: "Catalan",
              nativeName: "Català",
              code: "ca",
              supportTTS: !0,
            },
            {
              name: "Chinese",
              nativeName: "简体中文",
              code: "zh",
              supportTTS: !0,
            },
            {
              name: "Croatian",
              nativeName: "Hrvatski",
              code: "hr",
              supportTTS: !1,
            },
            {
              name: "Czech",
              nativeName: "Čeština",
              code: "cs",
              supportTTS: !0,
            },
            { name: "Danish", nativeName: "Dansk", code: "da", supportTTS: !0 },
            {
              name: "Dutch",
              nativeName: "Nederlands",
              code: "nl",
              supportTTS: !0,
            },
            {
              name: "English",
              nativeName: "English",
              code: "en",
              supportTTS: !0,
            },
            {
              name: "Estonian",
              nativeName: "Eesti",
              code: "et",
              supportTTS: !1,
            },
            {
              name: "Finnish",
              nativeName: "Suomi",
              code: "fi",
              supportTTS: !0,
            },
            {
              name: "French",
              nativeName: "Français",
              code: "fr",
              supportTTS: !0,
            },
            {
              name: "Galician",
              nativeName: "Galego",
              code: "gl",
              supportTTS: !0,
            },
            {
              name: "German",
              nativeName: "Deutsch",
              code: "de",
              supportTTS: !0,
            },
            {
              name: "Greek",
              nativeName: "Ελληνικά",
              code: "el",
              supportTTS: !0,
            },
            {
              name: "Gujarati",
              nativeName: "ગુજરાતી",
              code: "gu",
              supportTTS: !0,
            },
            { name: "Hebrew", nativeName: "עברית", code: "he", supportTTS: !1 },
            { name: "Hindi", nativeName: "हिन्दी", code: "hi", supportTTS: !0 },
            {
              name: "Hungarian",
              nativeName: "Magyar",
              code: "hu",
              supportTTS: !0,
            },
            {
              name: "Indonesian",
              nativeName: "Bahasa Indonesia",
              code: "id",
              supportTTS: !0,
            },
            {
              name: "Italian",
              nativeName: "Italiano",
              code: "it",
              supportTTS: !0,
            },
            {
              name: "Japanese",
              nativeName: "日本語",
              code: "ja",
              supportTTS: !0,
            },
            {
              name: "Kannada",
              nativeName: "ಕನ್ನಡ",
              code: "kn",
              supportTTS: !0,
            },
            { name: "Kazakh", nativeName: "Қазақ", code: "kk", supportTTS: !1 },
            {
              name: "Korean",
              nativeName: "한국어",
              code: "ko",
              supportTTS: !0,
            },
            {
              name: "Latvian",
              nativeName: "Latviešu",
              code: "lv",
              supportTTS: !0,
            },
            {
              name: "Lithuanian",
              nativeName: "Lietuvių",
              code: "lt",
              supportTTS: !0,
            },
            {
              name: "Macedonian",
              nativeName: "Македонски",
              code: "mk",
              supportTTS: !1,
            },
            {
              name: "Malay",
              nativeName: "Bahasa Melayu",
              code: "ms",
              supportTTS: !0,
            },
            {
              name: "Malayalam",
              nativeName: "മലയാളം",
              code: "ml",
              supportTTS: !0,
            },
            {
              name: "Marathi",
              nativeName: "मराठी",
              code: "mr",
              supportTTS: !0,
            },
            {
              name: "Norwegian",
              nativeName: "Norsk",
              code: "no",
              supportTTS: !0,
            },
            {
              name: "Persian",
              nativeName: "فارسی",
              code: "fa",
              supportTTS: !1,
            },
            {
              name: "Polish",
              nativeName: "Polski",
              code: "pl",
              supportTTS: !0,
            },
            {
              name: "Portuguese",
              nativeName: "Português",
              code: "pt",
              supportTTS: !0,
            },
            {
              name: "Punjabi",
              nativeName: "ਪੰਜਾਬੀ",
              code: "pa",
              supportTTS: !0,
            },
            {
              name: "Romanian",
              nativeName: "Română",
              code: "ro",
              supportTTS: !0,
            },
            {
              name: "Russian",
              nativeName: "Русский",
              code: "ru",
              supportTTS: !0,
            },
            {
              name: "Serbian",
              nativeName: "Српски",
              code: "sr",
              supportTTS: !0,
            },
            {
              name: "Slovak",
              nativeName: "Slovenčina",
              code: "sk",
              supportTTS: !0,
            },
            {
              name: "Slovenian",
              nativeName: "Slovenščina",
              code: "sl",
              supportTTS: !1,
            },
            {
              name: "Spanish",
              nativeName: "Español",
              code: "es",
              supportTTS: !0,
            },
            {
              name: "Swahili",
              nativeName: "Kiswahili",
              code: "sw",
              supportTTS: !1,
            },
            {
              name: "Swedish",
              nativeName: "Svenska",
              code: "sv",
              supportTTS: !0,
            },
            {
              name: "Tagalog",
              nativeName: "Tagalog",
              code: "tl",
              supportTTS: !0,
            },
            { name: "Tamil", nativeName: "தமிழ்", code: "ta", supportTTS: !0 },
            {
              name: "Telugu",
              nativeName: "తెలుగు",
              code: "te",
              supportTTS: !0,
            },
            { name: "Thai", nativeName: "ไทย", code: "th", supportTTS: !0 },
            {
              name: "Turkish",
              nativeName: "Türkçe",
              code: "tr",
              supportTTS: !0,
            },
            {
              name: "Ukrainian",
              nativeName: "Українська",
              code: "uk",
              supportTTS: !0,
            },
            { name: "Urdu", nativeName: "اردو", code: "ur", supportTTS: !1 },
            {
              name: "Vietnamese",
              nativeName: "Tiếng Việt",
              code: "vi",
              supportTTS: !0,
            },
            {
              name: "Welsh",
              nativeName: "Cymraeg",
              code: "cy",
              supportTTS: !1,
            },
          ];
        var jA = t(1803),
          NA = t(4829),
          _A = t(8070),
          PA = t(1835),
          MA = t(6466);
        function FA(A, n) {
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
                  l = !1;
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
                  ((l = !0), (e = A));
                } finally {
                  try {
                    if (
                      !c &&
                      null != t.return &&
                      ((a = t.return()), Object(a) !== a)
                    )
                      return;
                  } finally {
                    if (l) throw e;
                  }
                }
                return i;
              }
            })(A, n) ||
            (function (A, n) {
              if (!A) return;
              if ("string" == typeof A) return DA(A, n);
              var t = Object.prototype.toString.call(A).slice(8, -1);
              "Object" === t && A.constructor && (t = A.constructor.name);
              if ("Map" === t || "Set" === t) return Array.from(A);
              if (
                "Arguments" === t ||
                /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
              )
                return DA(A, n);
            })(A, n) ||
            (function () {
              throw new TypeError(
                "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
              );
            })()
          );
        }
        function DA(A, n) {
          (null == n || n > A.length) && (n = A.length);
          for (var t = 0, r = new Array(n); t < n; t++) r[t] = A[t];
          return r;
        }
        const RA = function (A) {
          var n = A.options,
            t = void 0 === n ? [] : n,
            e = A.value,
            o = A.onChange,
            a = A.placeholder,
            c = void 0 === a ? "Select..." : a,
            d = A.isDisabled,
            s = void 0 !== d && d,
            p = A.searchPlaceholder,
            g = void 0 === p ? "Search languages..." : p,
            u = FA((0, r.useState)(!1), 2),
            m = u[0],
            b = u[1],
            w = FA((0, r.useState)(""), 2),
            f = w[0],
            E = w[1],
            y = (0, r.useRef)(null),
            h = (0, r.useRef)(null),
            v = (0, r.useRef)(null),
            x = t.find(function (A) {
              return A.value === e;
            }),
            k = x ? x.label : c,
            G = (function () {
              if (!f.trim()) return t;
              var A = f.toLowerCase();
              return t
                .filter(function (n) {
                  return n.label.toLowerCase().includes(A);
                })
                .sort(function (n, t) {
                  var r = n.label.toLowerCase(),
                    e = t.label.toLowerCase(),
                    o = r.startsWith(A),
                    a = e.startsWith(A);
                  return o && !a ? -1 : !o && a ? 1 : r.localeCompare(e);
                });
            })();
          ((0, r.useEffect)(
            function () {
              var A = function (A) {
                y.current &&
                  !y.current.contains(A.target) &&
                  v.current &&
                  !v.current.contains(A.target) &&
                  (b(!1), E(""));
              };
              return (
                m && document.addEventListener("mousedown", A),
                function () {
                  document.removeEventListener("mousedown", A);
                }
              );
            },
            [m],
          ),
            (0, r.useEffect)(
              function () {
                m &&
                  h.current &&
                  setTimeout(function () {
                    var A;
                    null === (A = h.current) || void 0 === A || A.focus();
                  }, 50);
              },
              [m],
            ));
          return r.createElement(
            i.az,
            { ref: y, position: "relative", w: "100%" },
            r.createElement(
              B.s,
              {
                as: "button",
                type: "button",
                onClick: function () {
                  s || (b(!m), m || E(""));
                },
                disabled: s,
                alignItems: "center",
                justifyContent: "space-between",
                w: "100%",
                h: "32px",
                px: 3,
                bg: "white",
                border: "1px solid",
                borderColor: m ? "#6366f1" : "gray.300",
                borderRadius: "md",
                cursor: s ? "not-allowed" : "pointer",
                opacity: s ? 0.6 : 1,
                transition: "all 0.2s",
                _hover: { borderColor: s ? "gray.300" : "#818cf8" },
                _focus: {
                  borderColor: "#6366f1",
                  boxShadow: "0 0 0 1px #6366f1",
                  outline: "none",
                },
              },
              r.createElement(
                l.E,
                {
                  fontSize: "sm",
                  color: x ? "gray.800" : "gray.500",
                  isTruncated: !0,
                },
                k,
              ),
              r.createElement(PA.D, {
                color: "gray.500",
                transform: m ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }),
            ),
            m &&
              r.createElement(
                i.az,
                {
                  ref: v,
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  mt: 1,
                  bg: "white",
                  border: "1px solid",
                  borderColor: "gray.200",
                  borderRadius: "md",
                  boxShadow: "lg",
                  zIndex: 9999,
                  maxH: "280px",
                  overflow: "hidden",
                  onKeyDown: function (A) {
                    "Escape" === A.key && (b(!1), E(""));
                  },
                },
                r.createElement(
                  i.az,
                  { p: 2, borderBottom: "1px solid", borderColor: "gray.100" },
                  r.createElement(
                    jA.M,
                    { size: "sm" },
                    r.createElement(
                      NA.W,
                      { pointerEvents: "none" },
                      r.createElement(MA.W, { color: "gray.400", boxSize: 3 }),
                    ),
                    r.createElement(_A.p, {
                      ref: h,
                      placeholder: g,
                      value: f,
                      onChange: function (A) {
                        return E(A.target.value);
                      },
                      borderColor: "gray.200",
                      _hover: { borderColor: "gray.300" },
                      _focus: {
                        borderColor: "#6366f1",
                        boxShadow: "0 0 0 1px #6366f1",
                      },
                      _placeholder: { color: "gray.300" },
                      fontSize: "sm",
                    }),
                  ),
                ),
                r.createElement(
                  i.az,
                  { maxH: "220px", overflowY: "auto" },
                  0 === G.length
                    ? r.createElement(
                        i.az,
                        { px: 3, py: 2 },
                        r.createElement(
                          l.E,
                          { fontSize: "sm", color: "gray.500" },
                          "No matching languages found",
                        ),
                      )
                    : G.map(function (A) {
                        return r.createElement(
                          i.az,
                          {
                            key: A.value,
                            px: 3,
                            py: 2,
                            cursor: "pointer",
                            bg:
                              A.value === e
                                ? "rgba(99,102,241,0.08)"
                                : "transparent",
                            color: A.value === e ? "#6366f1" : "gray.700",
                            fontWeight: A.value === e ? "medium" : "normal",
                            _hover: {
                              bg:
                                A.value === e
                                  ? "rgba(99,102,241,0.15)"
                                  : "gray.50",
                            },
                            transition: "background 0.15s",
                            onClick: function () {
                              return ((n = A.value), o(n), b(!1), void E(""));
                              var n;
                            },
                            fontSize: "sm",
                          },
                          A.label,
                        );
                      }),
                ),
              ),
          );
        };
        function UA(A) {
          return (
            (function (A) {
              if (Array.isArray(A)) return VA(A);
            })(A) ||
            (function (A) {
              if (
                ("undefined" != typeof Symbol && null != A[Symbol.iterator]) ||
                null != A["@@iterator"]
              )
                return Array.from(A);
            })(A) ||
            KA(A) ||
            (function () {
              throw new TypeError(
                "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
              );
            })()
          );
        }
        function WA() {
          WA = function () {
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
          function l(A, n, t) {
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
            l({}, "");
          } catch (A) {
            l = function (A, n, t) {
              return (A[n] = t);
            };
          }
          function d(A, n, t, r) {
            var o = n && n.prototype instanceof w ? n : w,
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
          n.wrap = d;
          var p = "suspendedStart",
            g = "suspendedYield",
            u = "executing",
            m = "completed",
            b = {};
          function w() {}
          function f() {}
          function E() {}
          var y = {};
          l(y, a, function () {
            return this;
          });
          var B = Object.getPrototypeOf,
            h = B && B(B(T([])));
          h && h !== t && r.call(h, a) && (y = h);
          var v = (E.prototype = w.prototype = Object.create(y));
          function x(A) {
            ["next", "throw", "return"].forEach(function (n) {
              l(A, n, function (A) {
                return this._invoke(n, A);
              });
            });
          }
          function k(A, n) {
            function t(e, o, a, i) {
              var c = s(A[e], A, o);
              if ("throw" !== c.type) {
                var l = c.arg,
                  d = l.value;
                return d && "object" == XA(d) && r.call(d, "__await")
                  ? n.resolve(d.__await).then(
                      function (A) {
                        t("next", A, a, i);
                      },
                      function (A) {
                        t("throw", A, a, i);
                      },
                    )
                  : n.resolve(d).then(
                      function (A) {
                        ((l.value = A), a(l));
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
            var e = p;
            return function (o, a) {
              if (e === u) throw new Error("Generator is already running");
              if (e === m) {
                if ("throw" === o) throw a;
                return { value: A, done: !0 };
              }
              for (r.method = o, r.arg = a; ; ) {
                var i = r.delegate;
                if (i) {
                  var c = H(i, r);
                  if (c) {
                    if (c === b) continue;
                    return c;
                  }
                }
                if ("next" === r.method) r.sent = r._sent = r.arg;
                else if ("throw" === r.method) {
                  if (e === p) throw ((e = m), r.arg);
                  r.dispatchException(r.arg);
                } else "return" === r.method && r.abrupt("return", r.arg);
                e = u;
                var l = s(n, t, r);
                if ("normal" === l.type) {
                  if (((e = r.done ? m : g), l.arg === b)) continue;
                  return { value: l.arg, done: r.done };
                }
                "throw" === l.type &&
                  ((e = m), (r.method = "throw"), (r.arg = l.arg));
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
                b
              );
            var o = s(e, n.iterator, t.arg);
            if ("throw" === o.type)
              return (
                (t.method = "throw"),
                (t.arg = o.arg),
                (t.delegate = null),
                b
              );
            var a = o.arg;
            return a
              ? a.done
                ? ((t[n.resultName] = a.value),
                  (t.next = n.nextLoc),
                  "return" !== t.method && ((t.method = "next"), (t.arg = A)),
                  (t.delegate = null),
                  b)
                : a
              : ((t.method = "throw"),
                (t.arg = new TypeError("iterator result is not an object")),
                (t.delegate = null),
                b);
          }
          function S(A) {
            var n = { tryLoc: A[0] };
            (1 in A && (n.catchLoc = A[1]),
              2 in A && ((n.finallyLoc = A[2]), (n.afterLoc = A[3])),
              this.tryEntries.push(n));
          }
          function I(A) {
            var n = A.completion || {};
            ((n.type = "normal"), delete n.arg, (A.completion = n));
          }
          function L(A) {
            ((this.tryEntries = [{ tryLoc: "root" }]),
              A.forEach(S, this),
              this.reset(!0));
          }
          function T(n) {
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
            throw new TypeError(XA(n) + " is not iterable");
          }
          return (
            (f.prototype = E),
            e(v, "constructor", { value: E, configurable: !0 }),
            e(E, "constructor", { value: f, configurable: !0 }),
            (f.displayName = l(E, c, "GeneratorFunction")),
            (n.isGeneratorFunction = function (A) {
              var n = "function" == typeof A && A.constructor;
              return (
                !!n &&
                (n === f || "GeneratorFunction" === (n.displayName || n.name))
              );
            }),
            (n.mark = function (A) {
              return (
                Object.setPrototypeOf
                  ? Object.setPrototypeOf(A, E)
                  : ((A.__proto__ = E), l(A, c, "GeneratorFunction")),
                (A.prototype = Object.create(v)),
                A
              );
            }),
            (n.awrap = function (A) {
              return { __await: A };
            }),
            x(k.prototype),
            l(k.prototype, i, function () {
              return this;
            }),
            (n.AsyncIterator = k),
            (n.async = function (A, t, r, e, o) {
              void 0 === o && (o = Promise);
              var a = new k(d(A, t, r, e), o);
              return n.isGeneratorFunction(t)
                ? a
                : a.next().then(function (A) {
                    return A.done ? A.value : a.next();
                  });
            }),
            x(v),
            l(v, c, "Generator"),
            l(v, a, function () {
              return this;
            }),
            l(v, "toString", function () {
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
            (n.values = T),
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
                  this.tryEntries.forEach(I),
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
                      l = r.call(a, "finallyLoc");
                    if (c && l) {
                      if (this.prev < a.catchLoc) return e(a.catchLoc, !0);
                      if (this.prev < a.finallyLoc) return e(a.finallyLoc);
                    } else if (c) {
                      if (this.prev < a.catchLoc) return e(a.catchLoc, !0);
                    } else {
                      if (!l)
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
                    ? ((this.method = "next"), (this.next = o.finallyLoc), b)
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
                  b
                );
              },
              finish: function (A) {
                for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                  var t = this.tryEntries[n];
                  if (t.finallyLoc === A)
                    return (this.complete(t.completion, t.afterLoc), I(t), b);
                }
              },
              catch: function (A) {
                for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                  var t = this.tryEntries[n];
                  if (t.tryLoc === A) {
                    var r = t.completion;
                    if ("throw" === r.type) {
                      var e = r.arg;
                      I(t);
                    }
                    return e;
                  }
                }
                throw new Error("illegal catch attempt");
              },
              delegateYield: function (n, t, r) {
                return (
                  (this.delegate = {
                    iterator: T(n),
                    resultName: t,
                    nextLoc: r,
                  }),
                  "next" === this.method && (this.arg = A),
                  b
                );
              },
            }),
            n
          );
        }
        function YA(A, n, t, r, e, o, a) {
          try {
            var i = A[o](a),
              c = i.value;
          } catch (A) {
            return void t(A);
          }
          i.done ? n(c) : Promise.resolve(c).then(r, e);
        }
        function qA(A) {
          return function () {
            var n = this,
              t = arguments;
            return new Promise(function (r, e) {
              var o = A.apply(n, t);
              function a(A) {
                YA(o, r, e, a, i, "next", A);
              }
              function i(A) {
                YA(o, r, e, a, i, "throw", A);
              }
              a(void 0);
            });
          };
        }
        function XA(A) {
          return (
            (XA =
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
            XA(A)
          );
        }
        function $A(A, n) {
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
                  l = !1;
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
                  ((l = !0), (e = A));
                } finally {
                  try {
                    if (
                      !c &&
                      null != t.return &&
                      ((a = t.return()), Object(a) !== a)
                    )
                      return;
                  } finally {
                    if (l) throw e;
                  }
                }
                return i;
              }
            })(A, n) ||
            KA(A, n) ||
            (function () {
              throw new TypeError(
                "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
              );
            })()
          );
        }
        function KA(A, n) {
          if (A) {
            if ("string" == typeof A) return VA(A, n);
            var t = Object.prototype.toString.call(A).slice(8, -1);
            return (
              "Object" === t && A.constructor && (t = A.constructor.name),
              "Map" === t || "Set" === t
                ? Array.from(A)
                : "Arguments" === t ||
                    /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
                  ? VA(A, n)
                  : void 0
            );
          }
        }
        function VA(A, n) {
          (null == n || n > A.length) && (n = A.length);
          for (var t = 0, r = new Array(n); t < n; t++) r[t] = A[t];
          return r;
        }
        const JA = (0, OA.PA)(function () {
          (0, r.useRef)(null);
          var A = L(),
            n = A.t,
            t = (A.locale, $A((0, r.useState)(!1), 2)),
            e = t[0],
            o = t[1],
            a = $A((0, r.useState)(!1), 2),
            s = a[0],
            p = a[1],
            g = $A((0, r.useState)(""), 2),
            u = (g[0], g[1]),
            m = $A((0, r.useState)(0), 2),
            b = (m[0], m[1]),
            w = $A((0, r.useState)(!1), 2),
            f = w[0],
            E = w[1],
            y = $A((0, r.useState)(!1), 2),
            v = y[0],
            x = (y[1], (0, r.useRef)(!1), $A((0, r.useState)(""), 2)),
            k = x[0],
            G = x[1],
            H = $A((0, r.useState)(""), 2),
            S = H[0],
            I = H[1],
            U = $A((0, r.useState)(!1), 2),
            W = U[0],
            Y = U[1],
            q = $A((0, r.useState)(null), 2),
            X = (q[0], q[1]),
            $ = $A((0, r.useState)(!1), 2),
            K = $[0],
            V = $[1],
            J = $A((0, r.useState)(!1), 2),
            Q = J[0],
            Z = J[1],
            AA = function (A) {
              var n = Number(A);
              return Number.isFinite(n) ? Math.max(0, n) : 0;
            },
            nA = function () {
              var A = AA(BA.userInfo.minutes),
                n = AA(BA.userInfo.paygoMinutes),
                t = Number.isFinite(Number(BA.userInfo.minutes)),
                r = Number.isFinite(Number(BA.userInfo.paygoMinutes));
              return {
                planMinutes: A,
                paygoMinutes: n,
                totalMinutes: A + n,
                hasPaygo: n > 0,
                hasMinutesValue: t || r,
              };
            },
            tA = function (A, n) {
              return A
                ? A.displayName && "object" === XA(A.displayName)
                  ? A.displayName[n] || A.displayName.en || A.id || ""
                  : A.displayName || A.name || A.id || ""
                : "";
            },
            rA = function (A, n) {
              var t,
                r,
                e,
                o =
                  null !==
                    (t =
                      null !==
                        (r =
                          null == A ||
                          null === (e = A.perLocale) ||
                          void 0 === e ||
                          null === (e = e[n]) ||
                          void 0 === e
                            ? void 0
                            : e.rank) && void 0 !== r
                        ? r
                        : null == A
                          ? void 0
                          : A.rank) && void 0 !== t
                    ? t
                    : 999,
                a = Number(o);
              return Number.isFinite(a) ? a : 999;
            },
            eA = function (A) {
              return (A && (A.displayName || A.voiceName || A.voiceId)) || "";
            },
            oA = function (A, n, t) {
              if (!A || !n) return !1;
              var r = "string" == typeof n.voiceId ? n.voiceId.trim() : "";
              if (r) return A.id === r;
              var e = [n.voiceName, n.displayName]
                  .filter(Boolean)
                  .map(function (A) {
                    return String(A).trim();
                  })
                  .filter(Boolean),
                o = [A.id, A.name, tA(A, t)]
                  .filter(Boolean)
                  .map(function (A) {
                    return String(A).trim();
                  })
                  .filter(Boolean);
              return e.some(function (A) {
                return o.includes(A);
              });
            },
            aA = function (A) {
              return new Promise(function (n, t) {
                var r = !1,
                  e = setTimeout(function () {
                    ((r = !0),
                      t(
                        new Error(
                          "Voice list request timed out after 5 seconds",
                        ),
                      ));
                  }, 5e3);
                chrome.runtime.sendMessage(
                  { type: "fetchVoices", language: A },
                  function (A) {
                    r ||
                      ((r = !0),
                      clearTimeout(e),
                      chrome.runtime.lastError
                        ? t(new Error(chrome.runtime.lastError.message))
                        : n(A));
                  },
                );
              });
            },
            iA = (function () {
              var A = qA(
                WA().mark(function A(n, t, r) {
                  return WA().wrap(function (A) {
                    for (;;)
                      switch ((A.prev = A.next)) {
                        case 0:
                          return (
                            (r[n] = t),
                            (A.next = 3),
                            chrome.storage.sync.set({ voiceByLanguage: r })
                          );
                        case 3:
                          return (
                            (A.next = 5),
                            chrome.storage.local.set({
                              ttsVoice: t.voiceName,
                              ttsVoiceId: t.voiceId,
                              ttsVoiceDisplayName: t.displayName,
                              ttsLanguage: n,
                              ttsResponseFormat: t.responseFormat || "pcm",
                            })
                          );
                        case 5:
                        case "end":
                          return A.stop();
                      }
                  }, A);
                }),
              );
              return function (n, t, r) {
                return A.apply(this, arguments);
              };
            })(),
            lA = (function () {
              var A = qA(
                WA().mark(function A(n) {
                  return WA().wrap(function (A) {
                    for (;;)
                      switch ((A.prev = A.next)) {
                        case 0:
                          return (
                            (A.next = 2),
                            chrome.storage.local.set({ ttsLanguage: n })
                          );
                        case 2:
                          return (
                            (A.next = 4),
                            chrome.storage.local.remove([
                              "ttsVoice",
                              "ttsVoiceId",
                              "ttsVoiceDisplayName",
                              "ttsResponseFormat",
                            ])
                          );
                        case 4:
                        case "end":
                          return A.stop();
                      }
                  }, A);
                }),
              );
              return function (n) {
                return A.apply(this, arguments);
              };
            })();
          ((0, r.useEffect)(function () {
            chrome.runtime.sendMessage({ type: "popupCheckRunningState" });
          }, []),
            (0, r.useEffect)(function () {
              chrome.tabs.query(
                { active: !0, currentWindow: !0 },
                function (A) {
                  var n = A && A[0];
                  n
                    ? (G(n.title || "Current page"),
                      I(n.favIconUrl || ""),
                      X(!!n.audible))
                    : (G("Current page"), I(""), X(!1));
                },
              );
            }, []),
            (0, r.useEffect)(
              function () {
                Y(!1);
              },
              [S],
            ),
            (0, r.useEffect)(function () {
              chrome.storage.sync.get(
                ["hasSeenOnboarding", "popupOpenCount"],
                function (A) {
                  (A && !0 === A.hasSeenOnboarding) ||
                    (V(!0), chrome.storage.sync.set({ hasSeenOnboarding: !0 }));
                  var n = (A.popupOpenCount || 0) + 1;
                  (chrome.storage.sync.set({ popupOpenCount: n }),
                    n <= 5 && Z(!0));
                },
              );
            }, []));
          var dA = $A((0, r.useState)(!1), 2),
            sA = (dA[0], dA[1]),
            pA = $A((0, r.useState)("auto"), 2),
            gA = pA[0],
            mA = pA[1],
            bA = $A((0, r.useState)("zh"), 2),
            wA = bA[0],
            fA = bA[1];
          (0, r.useEffect)(function () {
            chrome.storage.sync.get(
              ["sourceLanguage", "targetLanguage"],
              function (A) {
                if (
                  (A.sourceLanguage && mA(A.sourceLanguage), A.targetLanguage)
                )
                  fA(A.targetLanguage);
                else {
                  var n = (
                      navigator.language ||
                      navigator.userLanguage ||
                      "en"
                    ).split("-")[0],
                    t = zA.find(function (A) {
                      return A.code === n;
                    })
                      ? n
                      : "en";
                  (fA(t), chrome.storage.sync.set({ targetLanguage: t }));
                }
              },
            );
          }, []);
          var EA = (function () {
            var A = qA(
              WA().mark(function A() {
                var n,
                  t,
                  r,
                  e,
                  o,
                  a,
                  i,
                  c,
                  l,
                  d,
                  p,
                  g,
                  u,
                  m,
                  b,
                  w,
                  f,
                  y,
                  B,
                  h,
                  x,
                  k,
                  G,
                  H,
                  S,
                  I,
                  L,
                  T,
                  C,
                  O,
                  z,
                  j,
                  N;
                return WA().wrap(
                  function (A) {
                    for (;;)
                      switch ((A.prev = A.next)) {
                        case 0:
                          if (!v) {
                            A.next = 4;
                            break;
                          }
                          return (
                            uA("realtime_start_blocked_renewing_minutes", {
                              userLevel:
                                null === (n = BA.userInfo) || void 0 === n
                                  ? void 0
                                  : n.userLevel,
                            }),
                            LA.current(
                              "Your minutes are being renewed. Please wait a moment and try again.",
                              "Please Wait",
                            ),
                            A.abrupt("return")
                          );
                        case 4:
                          if (!s) {
                            A.next = 9;
                            break;
                          }
                          (E(!0),
                            chrome.runtime.sendMessage({
                              type: "offscreenStop",
                            }),
                            (A.next = 138));
                          break;
                        case 9:
                          if (
                            ((t = BA.userInfo.userLevel),
                            (r = nA()),
                            !(r.totalMinutes < 1))
                          ) {
                            A.next = 28;
                            break;
                          }
                          return (
                            E(!1),
                            (A.prev = 13),
                            (A.next = 16),
                            chrome.tabs.query({ active: !0, currentWindow: !0 })
                          );
                        case 16:
                          if (
                            ((e = A.sent), (o = $A(e, 1)), (a = o[0]) && a.id)
                          )
                            chrome.tabs.sendMessage(
                              a.id,
                              { type: "ping-overlay" },
                              (function () {
                                var A = qA(
                                  WA().mark(function A(n) {
                                    var r, e, o, i;
                                    return WA().wrap(
                                      function (A) {
                                        for (;;)
                                          switch ((A.prev = A.next)) {
                                            case 0:
                                              if (!chrome.runtime.lastError) {
                                                A.next = 15;
                                                break;
                                              }
                                              return (
                                                (A.prev = 2),
                                                (A.next = 5),
                                                chrome.scripting.executeScript({
                                                  target: { tabId: a.id },
                                                  files: ["overlayContent.js"],
                                                })
                                              );
                                            case 5:
                                              (setTimeout(function () {
                                                chrome.tabs.sendMessage(a.id, {
                                                  type: "show-quota-exhausted-modal",
                                                  userInfo: {
                                                    userLevel:
                                                      BA.userInfo.userLevel,
                                                    proStatus:
                                                      BA.userInfo.proStatus,
                                                    minutesRenewsAt:
                                                      BA.userInfo
                                                        .minutesRenewsAt,
                                                  },
                                                });
                                              }, 100),
                                                (A.next = 13));
                                              break;
                                            case 8:
                                              if (
                                                ((A.prev = 8),
                                                (A.t0 = A.catch(2)),
                                                !t || "free" === t)
                                              )
                                                LA.current(
                                                  "You've used up all free minutes for DubTab.\n\nPlease upgrade your plan to get more minutes.",
                                                  "Minutes Exhausted",
                                                );
                                              else {
                                                if (
                                                  ((r =
                                                    BA.userInfo
                                                      .minutesRenewsAt),
                                                  (e =
                                                    "You've used all minutes in your current plan. Minutes will reset with your next billing cycle."),
                                                  r)
                                                )
                                                  try {
                                                    ((o = new Date(r)),
                                                      isNaN(o.getTime()) ||
                                                        ((i =
                                                          o.toLocaleDateString(
                                                            "en-US",
                                                            {
                                                              year: "numeric",
                                                              month: "long",
                                                              day: "numeric",
                                                            },
                                                          )),
                                                        (e =
                                                          "You've used all minutes in your current plan.\n\nYour minutes will reset on ".concat(
                                                            i,
                                                            ".",
                                                          ))));
                                                  } catch (A) {}
                                                LA.current(
                                                  e,
                                                  "Minutes Exhausted",
                                                );
                                              }
                                            case 13:
                                              A.next = 16;
                                              break;
                                            case 15:
                                              chrome.tabs.sendMessage(a.id, {
                                                type: "show-quota-exhausted-modal",
                                                userInfo: {
                                                  userLevel:
                                                    BA.userInfo.userLevel,
                                                  proStatus:
                                                    BA.userInfo.proStatus,
                                                  minutesRenewsAt:
                                                    BA.userInfo.minutesRenewsAt,
                                                },
                                              });
                                            case 16:
                                            case "end":
                                              return A.stop();
                                          }
                                      },
                                      A,
                                      null,
                                      [[2, 8]],
                                    );
                                  }),
                                );
                                return function (n) {
                                  return A.apply(this, arguments);
                                };
                              })(),
                            );
                          else if (!t || "free" === t)
                            LA.current(
                              "You've used up all free minutes for DubTab.\n\nPlease upgrade your plan to get more minutes.",
                              "Minutes Exhausted",
                            );
                          else {
                            if (
                              ((i = BA.userInfo.minutesRenewsAt),
                              (c =
                                "You've used all minutes in your current plan. Minutes will reset with your next billing cycle."),
                              i)
                            )
                              try {
                                ((l = new Date(i)),
                                  isNaN(l.getTime()) ||
                                    ((d = l.toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })),
                                    (c =
                                      "You've used all minutes in your current plan.\n\nYour minutes will reset on ".concat(
                                        d,
                                        ".",
                                      ))));
                              } catch (A) {}
                            LA.current(c, "Minutes Exhausted");
                          }
                          A.next = 27;
                          break;
                        case 22:
                          ((A.prev = 22),
                            (A.t0 = A.catch(13)),
                            !t || "free" === t
                              ? LA.current(
                                  "You've used up all free minutes for DubTab.\n\nPlease upgrade your plan to get more minutes.",
                                  "Minutes Exhausted",
                                )
                              : LA.current(
                                  "You've used all minutes in your current plan.",
                                  "Minutes Exhausted",
                                ));
                        case 27:
                          return A.abrupt("return");
                        case 28:
                          if (
                            ((p = t),
                            (g = (BA.userInfo.proStatus || "").toLowerCase()),
                            !!(
                              ("pro" !== p &&
                                "starter" !== p &&
                                "power" !== p &&
                                "ultra" !== p &&
                                "plus" !== p &&
                                "custom" !== p &&
                                "business" !== p &&
                                "enterprise" !== p) ||
                              ("past_due" !== g && "unpaid" !== g)
                            ))
                          ) {
                            A.next = 36;
                            break;
                          }
                          return (
                            E(!1),
                            (u = g.replace("_", " ")),
                            LA.current(
                              "Your subscription is ".concat(
                                u,
                                ". Please pay or update your payment method in the customer portal first.",
                              ),
                              "Billing Issue",
                            ),
                            A.abrupt("return")
                          );
                        case 36:
                          return (
                            E(!0),
                            (A.prev = 37),
                            (A.next = 40),
                            chrome.tabs.query({ active: !0, currentWindow: !0 })
                          );
                        case 40:
                          if (
                            ((m = A.sent), (b = $A(m, 1)), (w = b[0]) && w.url)
                          ) {
                            A.next = 47;
                            break;
                          }
                          return (
                            E(!1),
                            LA.current(
                              "Cannot detect current page. Please try again.",
                              "⚠️ Page Detection Failed",
                            ),
                            A.abrupt("return")
                          );
                        case 47:
                          if (
                            ((f = w.url.toLowerCase()),
                            (y = [
                              "chrome://",
                              "chrome-extension://",
                              "edge://",
                              "about:",
                              "chrome-search://",
                              "devtools://",
                              "view-source:",
                              "chrome-untrusted://",
                              "extension://",
                              "moz-extension://",
                              "file://",
                              "data:",
                              "blob:",
                              "javascript:",
                            ].some(function (A) {
                              return f.startsWith(A);
                            })),
                            (B =
                              f.includes("chrome.google.com/webstore") ||
                              f.includes("chromewebstore.google.com")),
                            !y && !B)
                          ) {
                            A.next = 55;
                            break;
                          }
                          return (
                            E(!1),
                            LA.current(
                              "This page doesn't support audio capture.\n\nPlease open a video website (YouTube, Netflix, etc.) and try again.",
                              "Cannot Start on This Page",
                            ),
                            A.abrupt("return")
                          );
                        case 55:
                          return (
                            (h = !1),
                            (A.prev = 56),
                            (A.next = 59),
                            chrome.storage.sync.get(["voiceByLanguage"])
                          );
                        case 59:
                          return (
                            (x = A.sent),
                            (k = x.voiceByLanguage || {}),
                            (G = k[wA]),
                            (A.next = 65),
                            aA(wA)
                          );
                        case 65:
                          if ((H = A.sent) && H.ok && Array.isArray(H.voices)) {
                            A.next = 68;
                            break;
                          }
                          throw new Error(
                            (null == H ? void 0 : H.error) ||
                              "Failed to fetch voices",
                          );
                        case 68:
                          if (
                            !(
                              (S = UA(H.voices).sort(function (A, n) {
                                return rA(A, wA) - rA(n, wA);
                              })).length > 0
                            )
                          ) {
                            A.next = 89;
                            break;
                          }
                          return (
                            (I = G
                              ? S.find(function (A) {
                                  return oA(A, G, wA);
                                })
                              : null),
                            (L = I || S[0]),
                            (P = void 0),
                            (P = tA((_ = L), wA)),
                            (T = {
                              voiceName: _.id,
                              voiceId: _.id,
                              displayName: P,
                              responseFormat: _.responseFormat || "pcm",
                            }),
                            (A.next = 76),
                            iA(wA, T, k)
                          );
                        case 76:
                          if (((h = !1), !G || I)) {
                            A.next = 84;
                            break;
                          }
                          return (
                            (C = eA(G)),
                            (A.next = 81),
                            chrome.storage.local.set({
                              voiceAvailabilityNotice: {
                                type: "voice_auto_switched",
                                language: wA,
                                previousDisplayName: C,
                                nextDisplayName: T.displayName,
                                createdAt: Date.now(),
                              },
                            })
                          );
                        case 81:
                          A.next = 87;
                          break;
                        case 84:
                          return (
                            (A.next = 86),
                            chrome.storage.local.remove(
                              "voiceAvailabilityNotice",
                            )
                          );
                        case 86:
                        case 87:
                          A.next = 95;
                          break;
                        case 89:
                          return ((h = !0), (A.next = 93), lA(wA));
                        case 93:
                          return (
                            (A.next = 95),
                            chrome.storage.local.remove(
                              "voiceAvailabilityNotice",
                            )
                          );
                        case 95:
                          return (
                            (A.next = 97),
                            chrome.storage.local.set({ needVoiceSelection: h })
                          );
                        case 97:
                          A.next = 130;
                          break;
                        case 99:
                          return (
                            (A.prev = 99),
                            (A.t1 = A.catch(56)),
                            (A.prev = 102),
                            (A.next = 105),
                            chrome.storage.sync.get(["voiceByLanguage"])
                          );
                        case 105:
                          if (
                            ((O = A.sent),
                            (z = O.voiceByLanguage || {}),
                            !(j = z[wA]))
                          ) {
                            A.next = 117;
                            break;
                          }
                          return (
                            (N =
                              "string" == typeof j.responseFormat &&
                              j.responseFormat.trim()
                                ? j.responseFormat
                                : "pcm"),
                            (A.next = 112),
                            chrome.storage.local.set({
                              ttsVoice: j.voiceName,
                              ttsVoiceId: j.voiceId,
                              ttsVoiceDisplayName: j.displayName,
                              ttsLanguage: wA,
                              ttsResponseFormat: N,
                              needVoiceSelection: !1,
                            })
                          );
                        case 112:
                          return (
                            (A.next = 114),
                            chrome.storage.local.remove(
                              "voiceAvailabilityNotice",
                            )
                          );
                        case 114:
                          A.next = 123;
                          break;
                        case 117:
                          return ((A.next = 119), lA(wA));
                        case 119:
                          return (
                            (A.next = 121),
                            chrome.storage.local.set({ needVoiceSelection: !0 })
                          );
                        case 121:
                          return (
                            (A.next = 123),
                            chrome.storage.local.remove(
                              "voiceAvailabilityNotice",
                            )
                          );
                        case 123:
                          A.next = 130;
                          break;
                        case 125:
                          return (
                            (A.prev = 125),
                            (A.t2 = A.catch(102)),
                            (A.next = 130),
                            chrome.storage.local.set({ needVoiceSelection: !0 })
                          );
                        case 130:
                          (chrome.runtime.sendMessage({
                            type: "createOffscreen",
                            translation: "one_way",
                            source_language: gA,
                            target_language: wA,
                          }),
                            (A.next = 138));
                          break;
                        case 133:
                          ((A.prev = 133),
                            (A.t3 = A.catch(37)),
                            E(!1),
                            LA.current(
                              "Failed to check current page. Please try again.",
                              "⚠️ Error",
                            ));
                        case 138:
                        case "end":
                          return A.stop();
                      }
                    var _, P;
                  },
                  A,
                  null,
                  [
                    [13, 22],
                    [37, 133],
                    [56, 99],
                    [102, 125],
                  ],
                );
              }),
            );
            return function () {
              return A.apply(this, arguments);
            };
          })();
          ((0, r.useEffect)(
            function () {
              "pro" === BA.userInfo.userLevel ||
                "power" === BA.userInfo.userLevel ||
                "ultra" === BA.userInfo.userLevel ||
                "plus" === BA.userInfo.userLevel ||
                "custom" === BA.userInfo.userLevel ||
                "starter" === BA.userInfo.userLevel ||
                "business" === BA.userInfo.userLevel ||
                BA.userInfo.userLevel;
            },
            [BA.userInfo.userLevel],
          ),
            (0, r.useEffect)(function () {
              chrome.runtime.onMessage.addListener(function (A, n, t) {
                if ("bcReturnRunningState" == A.type) {
                  if (
                    (!0 === A.isTimerRunning ? sA(!0) : sA(!1),
                    A.wsConnectionState)
                  ) {
                    var r = A.wsConnectionState;
                    (o(r.wsReady || !1),
                      p(r.realtimeOn || !1),
                      u(r.statusText || ""),
                      b(r.reconnectAttempt || 0),
                      E(!1));
                  }
                } else
                  "offscreenWsReady" === A.type
                    ? (o(!0), p(!0), u("Connected"), b(0), E(!1))
                    : "offscreenReconnect" === A.type
                      ? (u(
                          "Reconnecting #"
                            .concat(A.attempt, " in ")
                            .concat(A.delay, "ms…"),
                        ),
                        b(A.attempt || 0))
                      : "offscreenError" === A.type
                        ? (u("Error: ".concat(A.message || "unknown")), E(!1))
                        : "offscreenClose" === A.type
                          ? (u(
                              "Closed: "
                                .concat(A.code || "", " ")
                                .concat(A.reason || ""),
                            ),
                            E(!1))
                          : "offscreenStopped" === A.type
                            ? (o(!1), p(!1), u("Stopped"), E(!1))
                            : "tabCaptureError" === A.type &&
                              (E(!1),
                              LA.current(
                                A.error ||
                                  "Failed to capture tab audio. Please refresh the page and try again.",
                                "⚠️ Audio Capture Error",
                              ));
              });
            }, []),
            (0, r.useEffect)(
              function () {
                "LOGIN" === BA.userInfo.state &&
                  setTimeout(function () {}, 100);
              },
              [BA.userInfo.state],
            ));
          var yA = (0, T.j)(),
            vA = yA.isOpen,
            xA = yA.onOpen,
            kA = yA.onClose,
            GA = $A((0, r.useState)({ modalTitle: "", modalText: "" }), 2),
            HA = GA[0],
            SA = GA[1],
            IA = function (A) {
              (SA({
                modalText: A,
                modalTitle:
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : "",
              }),
                xA());
            },
            LA = (0, r.useRef)(IA);
          (0, r.useEffect)(
            function () {
              LA.current = IA;
            },
            [IA],
          );
          var TA,
            OA = function (A) {
              var n = (
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : {}
                ).padMinutes,
                t = void 0 !== n && n;
              if (null == A) return "--";
              var r = Number(A);
              if (!Number.isFinite(r)) return "--";
              var e = Math.max(0, r),
                o = Math.round(e),
                a = Math.floor(o / 60),
                i = o - 60 * a,
                c = a > 0,
                l = i > 0 || !c,
                d = "";
              if (l) {
                var s = i.toString();
                d =
                  t && c && Number.isInteger(i) && i < 10
                    ? s.padStart(2, "0")
                    : s;
              }
              return c && l && i > 0
                ? "".concat(a, "h ").concat(d, "m")
                : c && 0 === i
                  ? "".concat(a, "h")
                  : "".concat(d, "m");
            };
          if ("NOTLOGIN" === BA.userInfo.state)
            return r.createElement(CA, null);
          if ("LOGIN" === BA.userInfo.state) {
            var jA = nA(),
              NA = jA.planMinutes,
              _A = jA.paygoMinutes,
              PA = jA.totalMinutes,
              MA = jA.hasPaygo,
              FA = jA.hasMinutesValue,
              DA = BA.userInfo.userLevel,
              YA = (BA.userInfo.proStatus || "").toLowerCase(),
              KA = !(
                ("pro" !== DA &&
                  "starter" !== DA &&
                  "power" !== DA &&
                  "ultra" !== DA &&
                  "plus" !== DA &&
                  "custom" !== DA &&
                  "business" !== DA &&
                  "enterprise" !== DA) ||
                ("past_due" !== YA && "unpaid" !== YA)
              ),
              VA = FA ? OA(PA, { padMinutes: MA }) : "--",
              JA = FA ? OA(NA) : "--",
              QA = FA ? OA(_A) : "--";
            return r.createElement(
              i.az,
              {
                onKeyDown: function (A) {
                  "Enter" === A.key && EA();
                },
              },
              " ",
              r.createElement(cA, {
                isOpen: vA,
                onClose: kA,
                modalText: HA.modalText,
                modalTitle: HA.modalTitle,
              }),
              r.createElement(
                C.aF,
                {
                  isOpen: K,
                  onClose: function () {
                    return V(!1);
                  },
                  isCentered: !0,
                  size: "sm",
                },
                r.createElement(O.m, null),
                r.createElement(
                  z.$,
                  null,
                  r.createElement(
                    j.r,
                    { fontSize: "md" },
                    n("popup.quickStart"),
                  ),
                  r.createElement(N.s, null),
                  r.createElement(
                    _.c,
                    { pb: 4 },
                    r.createElement(
                      c.B,
                      { spacing: 3 },
                      r.createElement(
                        B.s,
                        { align: "center", gap: 3 },
                        r.createElement(
                          i.az,
                          {
                            bg: "blue.500",
                            color: "white",
                            w: "24px",
                            h: "24px",
                            borderRadius: "full",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "xs",
                            fontWeight: "bold",
                            flexShrink: 0,
                          },
                          "1",
                        ),
                        r.createElement(
                          l.E,
                          { fontSize: "sm" },
                          n("popup.step1"),
                        ),
                      ),
                      r.createElement(
                        B.s,
                        { align: "center", gap: 3 },
                        r.createElement(
                          i.az,
                          {
                            bg: "blue.500",
                            color: "white",
                            w: "24px",
                            h: "24px",
                            borderRadius: "full",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "xs",
                            fontWeight: "bold",
                            flexShrink: 0,
                          },
                          "2",
                        ),
                        r.createElement(
                          l.E,
                          { fontSize: "sm" },
                          n("popup.step2"),
                        ),
                      ),
                    ),
                    r.createElement(
                      i.az,
                      {
                        mt: 4,
                        pt: 3,
                        borderTop: "1px solid",
                        borderColor: "gray.200",
                      },
                      r.createElement(
                        l.E,
                        { fontSize: "xs", color: "gray.600" },
                        n("popup.tip"),
                      ),
                    ),
                  ),
                  r.createElement(
                    P.j,
                    { pt: 0 },
                    r.createElement(
                      d.$,
                      {
                        size: "sm",
                        colorScheme: "blue",
                        onClick: function () {
                          return V(!1);
                        },
                        w: "full",
                      },
                      n("common.gotIt"),
                    ),
                  ),
                ),
              ),
              r.createElement(
                i.az,
                { bg: "white", px: 4 },
                r.createElement(
                  c.B,
                  { spacing: 3 },
                  Q &&
                    r.createElement(
                      i.az,
                      {
                        bg: "blue.50",
                        borderRadius: "md",
                        py: 1,
                        px: 3,
                        borderLeft: "3px solid",
                        borderColor: "blue.400",
                      },
                      r.createElement(
                        B.s,
                        { align: "center", gap: 2 },
                        r.createElement(
                          l.E,
                          {
                            fontSize: "xs",
                            color: "gray.700",
                            lineHeight: "base",
                          },
                          n("popup.instructionTip"),
                          " ",
                          r.createElement(
                            l.E,
                            {
                              as: "span",
                              fontWeight: "bold",
                              color: "blue.600",
                            },
                            n("popup.instructionStart"),
                          ),
                          " ",
                          n("popup.instructionOnPage"),
                        ),
                      ),
                    ),
                  r.createElement(
                    i.az,
                    null,
                    r.createElement(
                      B.s,
                      { align: "center", gap: 1, mb: 1.5 },
                      r.createElement(
                        l.E,
                        {
                          fontSize: "xs",
                          fontWeight: "semibold",
                          color: "gray.600",
                        },
                        n("popup.sourceLanguage"),
                      ),
                      r.createElement(
                        M.m,
                        {
                          label: r.createElement(
                            i.az,
                            null,
                            r.createElement(
                              l.E,
                              { fontWeight: "semibold", fontSize: "xs", mb: 2 },
                              n("popup.sourceLanguageTipsTitle"),
                            ),
                            r.createElement(
                              c.B,
                              { spacing: 1.5 },
                              r.createElement(
                                B.s,
                                { align: "flex-start", gap: 1.5 },
                                r.createElement(
                                  l.E,
                                  { fontSize: "xs", color: "green.300" },
                                  "✓",
                                ),
                                r.createElement(
                                  l.E,
                                  { fontSize: "xs", lineHeight: "1.4" },
                                  n("popup.sourceLanguageTipSingle"),
                                ),
                              ),
                              r.createElement(
                                B.s,
                                { align: "flex-start", gap: 1.5 },
                                r.createElement(
                                  l.E,
                                  { fontSize: "xs", color: "blue.300" },
                                  "⟳",
                                ),
                                r.createElement(
                                  l.E,
                                  { fontSize: "xs", lineHeight: "1.4" },
                                  n("popup.sourceLanguageTipMultiple"),
                                ),
                              ),
                            ),
                          ),
                          hasArrow: !0,
                          placement: "top",
                          bg: "gray.800",
                          color: "white",
                          px: 3,
                          py: 2.5,
                          borderRadius: "md",
                          boxShadow: "lg",
                          maxW: "260px",
                        },
                        r.createElement(i.az, {
                          as: D.Y,
                          color: "gray.400",
                          fontSize: "11px",
                          cursor: "pointer",
                          _hover: { color: "gray.600" },
                        }),
                      ),
                    ),
                    r.createElement(RA, {
                      options: [
                        { value: "auto", label: n("popup.automaticDetection") },
                      ].concat(
                        UA(
                          zA
                            .filter(function (A) {
                              return A.supportTTS;
                            })
                            .map(function (A) {
                              return {
                                value: A.code,
                                label: ""
                                  .concat(A.name, " (")
                                  .concat(A.nativeName, ")"),
                              };
                            }),
                        ),
                      ),
                      value: gA,
                      onChange: function (A) {
                        (mA(A),
                          chrome.storage.sync.set({ sourceLanguage: A }),
                          uA("source_language_changed", { sourceLanguage: A }));
                      },
                      isDisabled: s || f,
                      searchPlaceholder: n("popup.searchLanguages"),
                    }),
                  ),
                  r.createElement(
                    i.az,
                    null,
                    r.createElement(
                      l.E,
                      {
                        fontSize: "xs",
                        fontWeight: "semibold",
                        color: "gray.600",
                        mb: 1.5,
                      },
                      n("popup.translateTo"),
                    ),
                    r.createElement(RA, {
                      options: zA
                        .filter(function (A) {
                          return A.supportTTS;
                        })
                        .map(function (A) {
                          return {
                            value: A.code,
                            label: ""
                              .concat(A.name, " (")
                              .concat(A.nativeName, ")"),
                          };
                        }),
                      value: wA,
                      onChange: function (A) {
                        (fA(A),
                          chrome.storage.sync.set({ targetLanguage: A }),
                          uA("target_language_changed", { targetLanguage: A }));
                      },
                      isDisabled: s || f,
                      searchPlaceholder: n("popup.searchLanguages"),
                    }),
                  ),
                  r.createElement(
                    i.az,
                    { bg: "gray.50", borderRadius: "md", p: 2.5 },
                    r.createElement(
                      i.az,
                      {
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                      },
                      r.createElement(
                        l.E,
                        {
                          fontSize: "xs",
                          fontWeight: "semibold",
                          color: "gray.600",
                        },
                        n("popup.remainingTime"),
                      ),
                      r.createElement(
                        B.s,
                        {
                          align: "center",
                          gap: 2,
                          justify: "flex-end",
                          flexWrap: "wrap",
                        },
                        v
                          ? r.createElement(h.y, {
                              size: "sm",
                              speed: "0.7s",
                              thickness: "2px",
                              color: "pink.400",
                            })
                          : KA
                            ? r.createElement(
                                l.E,
                                {
                                  fontSize: "md",
                                  fontWeight: "bold",
                                  color: "orange.500",
                                },
                                MA
                                  ? n("popup.extraLifetime") + ": " + QA
                                  : YA.replace("_", " "),
                              )
                            : MA
                              ? r.createElement(
                                  r.Fragment,
                                  null,
                                  r.createElement(
                                    l.E,
                                    {
                                      fontSize: "md",
                                      fontWeight: "bold",
                                      color: "pink.500",
                                    },
                                    VA,
                                  ),
                                  r.createElement(
                                    l.E,
                                    { fontSize: "xs", color: "gray.500" },
                                    "(",
                                    n("popup.planMinutes"),
                                    ": ",
                                    JA,
                                    " ·",
                                    " ",
                                    n("popup.extraLifetime"),
                                    ": ",
                                    QA,
                                    ")",
                                  ),
                                )
                              : r.createElement(
                                  l.E,
                                  {
                                    fontSize: "md",
                                    fontWeight: "bold",
                                    color: "pink.500",
                                  },
                                  ((TA = BA.userInfo.minutes), OA(TA)),
                                ),
                        MA &&
                          !v &&
                          !KA &&
                          r.createElement(
                            M.m,
                            {
                              label:
                                "We use subscription minutes first, then your extra lifetime hours.",
                              hasArrow: !0,
                              placement: "top",
                            },
                            r.createElement(i.az, {
                              as: R.o,
                              color: "gray.500",
                              fontSize: "14px",
                              cursor: "help",
                            }),
                          ),
                        0 === PA &&
                          "free" === BA.userInfo.userLevel &&
                          !MA &&
                          FA &&
                          r.createElement(
                            d.$,
                            {
                              size: "xs",
                              colorScheme: "pink",
                              variant: "solid",
                              onClick: function () {
                                hA();
                              },
                              borderRadius: "md",
                              px: 2,
                              py: 1,
                              fontSize: "10px",
                              fontWeight: "semibold",
                              _hover: {
                                transform: "translateY(-1px)",
                                boxShadow: "sm",
                              },
                              transition: "all 0.2s",
                            },
                            n("popup.upgradeButton"),
                          ),
                      ),
                    ),
                  ),
                  r.createElement(
                    i.az,
                    { bg: "gray.50", borderRadius: "md", p: 2.5 },
                    r.createElement(
                      l.E,
                      { fontSize: "xs", fontWeight: "bold" },
                      n("popup.currentPage"),
                    ),
                    r.createElement(
                      B.s,
                      {
                        align: "center",
                        mt: 1,
                        gap: 2,
                        minW: "0",
                        w: "100%",
                        overflow: "hidden",
                        flexWrap: "nowrap",
                      },
                      S
                        ? r.createElement(F._, {
                            src: S,
                            alt: "Site icon",
                            boxSize: "14px",
                            borderRadius: "3px",
                            onLoad: function () {
                              return Y(!0);
                            },
                            onError: function () {
                              return Y(!1);
                            },
                            sx: { display: W ? "inline-block" : "none" },
                          })
                        : null,
                      r.createElement(
                        i.az,
                        {
                          flex: "1",
                          minW: "0",
                          maxW: "100%",
                          overflow: "hidden",
                          title: k || "Current page",
                        },
                        r.createElement(
                          l.E,
                          {
                            fontSize: "sm",
                            fontWeight: "medium",
                            noOfLines: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          },
                          (function (A) {
                            var n =
                                arguments.length > 1 && void 0 !== arguments[1]
                                  ? arguments[1]
                                  : 55,
                              t = A || "Current page";
                            return t.length <= n
                              ? t
                              : "".concat(t.slice(0, n - 1), "…");
                          })(k),
                        ),
                      ),
                    ),
                  ),
                  r.createElement(
                    d.$,
                    {
                      mt: 3,
                      onClick: EA,
                      bg: s ? "red.500" : e ? "green.500" : "#6366f1",
                      _hover: {
                        bg: s ? "red.600" : e ? "green.600" : "#4f46e5",
                        transform: "translateY(-1px)",
                        boxShadow: "md",
                      },
                      color: "white",
                      variant: "solid",
                      w: "full",
                      borderRadius: "md",
                      fontWeight: "bold",
                      boxShadow: "sm",
                      transition: "all 0.2s",
                      isLoading: f,
                      loadingText: n(s ? "popup.stopping" : "popup.starting"),
                      isDisabled: f || v,
                      spinner: r.createElement(h.y, {
                        size: "sm",
                        speed: "0.65s",
                        thickness: "2px",
                      }),
                    },
                    n(
                      s
                        ? "popup.stopButton"
                        : e
                          ? "popup.connected"
                          : "popup.startTranslation",
                    ),
                  ),
                  r.createElement(
                    d.$,
                    {
                      variant: "ghost",
                      size: "xs",
                      color: "gray.500",
                      fontWeight: "medium",
                      alignSelf: "center",
                      px: 1,
                      height: "auto",
                      borderBottom: "1px solid transparent",
                      borderRadius: "0",
                      _hover: {
                        borderBottomColor: "gray.400",
                        color: "gray.700",
                      },
                      onClick: function () {
                        (uA("open_history_page", { source: "popup_home" }),
                          chrome.tabs.create({
                            url: chrome.runtime.getURL("history.html"),
                          }));
                      },
                    },
                    r.createElement(
                      B.s,
                      {
                        align: "center",
                        gap: 1,
                        fontSize: "xs",
                        lineHeight: "shorter",
                      },
                      r.createElement(
                        i.az,
                        {
                          as: "span",
                          role: "img",
                          "aria-label": "history",
                          fontSize: "sm",
                        },
                        "🕒",
                      ),
                      r.createElement(
                        l.E,
                        { as: "span" },
                        n("popup.viewHistory"),
                      ),
                    ),
                  ),
                ),
              ),
            );
          }
          return r.createElement(
            "div",
            null,
            r.createElement(
              B.s,
              {
                mt: "110px",
                h: "100%",
                justifyContent: "center",
                alignItems: "center",
              },
              r.createElement(h.y, { size: "lg" }),
            ),
          );
        });
        var QA = t(8027),
          ZA = t(4929),
          An = t(1238),
          nn = t(4393);
        const tn = (0, OA.PA)(function () {
          var A = function () {
              var A = "https://dubtab.com";
              "undefined" != typeof chrome && chrome.tabs && chrome.tabs.create
                ? chrome.tabs.create({ url: A })
                : window.open(A, "_blank");
            },
            n = function (n) {
              ("Enter" !== n.key && " " !== n.key) || (n.preventDefault(), A());
            };
          return r.createElement(
            i.az,
            { borderBottomWidth: "2px", shadow: "xs" },
            r.createElement(
              ZA.B,
              { justify: "space-between", align: "center", px: 2 },
              r.createElement(
                ZA.B,
                null,
                r.createElement(
                  ZA.Q,
                  null,
                  r.createElement(
                    An.o,
                    {
                      h: "55px",
                      cursor: "pointer",
                      onClick: A,
                      onKeyDown: n,
                      role: "link",
                      tabIndex: 0,
                      title: "Open dubtab.com",
                    },
                    r.createElement("img", {
                      className: "h-full py-3 pl-3",
                      src: "../../imgs/icon128.png",
                      alt: "DubTab",
                    }),
                  ),
                ),
                r.createElement(
                  ZA.Q,
                  null,
                  r.createElement(
                    An.o,
                    {
                      h: "55px",
                      fontSize: "18px",
                      cursor: "pointer",
                      onClick: A,
                      onKeyDown: n,
                      role: "link",
                      tabIndex: 0,
                      title: "Open dubtab.com",
                    },
                    J.name,
                  ),
                ),
                r.createElement(
                  ZA.Q,
                  null,
                  r.createElement(
                    An.o,
                    { mt: "5px", h: "55px", fontWeight: "normal" },
                    "v" + J.version,
                  ),
                ),
              ),
              "LOGIN" === BA.userInfo.state &&
                r.createElement(
                  ZA.Q,
                  null,
                  r.createElement(
                    d.$,
                    {
                      leftIcon: r.createElement(nn.I, {
                        as: QA.Hu1,
                        color: "gold",
                      }),
                      bg: "#6366f1",
                      color: "white",
                      size: "sm",
                      onClick: function () {
                        hA();
                      },
                      mr: 2,
                      fontWeight: "bold",
                      _hover: {
                        bg: "#4f46e5",
                        transform: "translateY(-1px)",
                        boxShadow: "lg",
                      },
                      _active: { transform: "translateY(0)" },
                      boxShadow: "md",
                    },
                    "Upgrade",
                  ),
                ),
            ),
          );
        });
        var rn = t(5072),
          en = t.n(rn),
          on = t(7825),
          an = t.n(on),
          cn = t(7659),
          ln = t.n(cn),
          dn = t(5056),
          sn = t.n(dn),
          pn = t(540),
          gn = t.n(pn),
          un = t(1113),
          mn = t.n(un),
          bn = t(7761),
          wn = {};
        ((wn.styleTagTransform = mn()),
          (wn.setAttributes = sn()),
          (wn.insert = ln().bind(null, "head")),
          (wn.domAPI = an()),
          (wn.insertStyleElement = gn()));
        en()(bn.A, wn);
        bn.A && bn.A.locals && bn.A.locals;
        var fn = t(9197),
          En = t(8539),
          yn = t(3285),
          Bn = t(6170),
          hn = t(3);
        function vn(A, n) {
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
                  l = !1;
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
                  ((l = !0), (e = A));
                } finally {
                  try {
                    if (
                      !c &&
                      null != t.return &&
                      ((a = t.return()), Object(a) !== a)
                    )
                      return;
                  } finally {
                    if (l) throw e;
                  }
                }
                return i;
              }
            })(A, n) ||
            (function (A, n) {
              if (!A) return;
              if ("string" == typeof A) return xn(A, n);
              var t = Object.prototype.toString.call(A).slice(8, -1);
              "Object" === t && A.constructor && (t = A.constructor.name);
              if ("Map" === t || "Set" === t) return Array.from(A);
              if (
                "Arguments" === t ||
                /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
              )
                return xn(A, n);
            })(A, n) ||
            (function () {
              throw new TypeError(
                "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
              );
            })()
          );
        }
        function xn(A, n) {
          (null == n || n > A.length) && (n = A.length);
          for (var t = 0, r = new Array(n); t < n; t++) r[t] = A[t];
          return r;
        }
        const kn = function (A) {
          var n = A.isOpen,
            t = A.onClose,
            e = vn((0, r.useState)(!1), 2),
            o = e[0],
            c = e[1],
            d = (0, a.d)(),
            s = "support@dubtab.com",
            p = function (A) {
              (A && A.stopPropagation && A.stopPropagation(),
                navigator.clipboard.writeText(s).then(function () {
                  (c(!0),
                    uA("email_copied", { source: "feedback_modal", email: s }),
                    d({
                      title: "Email copied!",
                      status: "success",
                      duration: 2e3,
                      isClosable: !0,
                      position: "top",
                    }),
                    setTimeout(function () {
                      return c(!1);
                    }, 2e3));
                }));
            };
          return r.createElement(
            C.aF,
            { isOpen: n, onClose: t, isCentered: !0, size: "sm" },
            r.createElement(O.m, null),
            r.createElement(
              z.$,
              null,
              r.createElement(
                j.r,
                { fontSize: "lg", fontWeight: "bold" },
                "Contact Us",
              ),
              r.createElement(N.s, null),
              r.createElement(
                _.c,
                { pb: 6 },
                r.createElement(
                  En.T,
                  { spacing: 3, align: "stretch" },
                  r.createElement(
                    i.az,
                    {
                      position: "relative",
                      borderWidth: "1px",
                      borderColor: "purple.300",
                      borderRadius: "md",
                      bg: "purple.50",
                      py: 3,
                      px: 4,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      boxShadow: "0 0 0 1px rgba(128,90,213,0.18)",
                      _hover: { borderColor: "purple.400", bg: "purple.100" },
                      onClick: function () {
                        return (
                          (A = "https://tally.so/r/ZjOXVV"),
                          uA("feedback_channel_selected", {
                            channel: "feedback_form",
                            source: "footer_contact_us",
                          }),
                          A.startsWith("mailto:")
                            ? (window.location.href = A)
                            : window.open(A, "_blank"),
                          void t()
                        );
                        var A;
                      },
                    },
                    r.createElement(
                      yn.E,
                      {
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        colorScheme: "purple",
                        fontSize: "10px",
                        px: 2,
                        py: 0.5,
                        borderRadius: "full",
                        fontWeight: "bold",
                        zIndex: 1,
                      },
                      "Recommended",
                    ),
                    r.createElement(
                      En.T,
                      { spacing: 1, align: "start", w: "full" },
                      r.createElement(
                        l.E,
                        {
                          fontSize: "md",
                          fontWeight: "bold",
                          color: "purple.800",
                        },
                        "📝 Feedback form",
                      ),
                      r.createElement(
                        l.E,
                        {
                          fontSize: "xs",
                          color: "purple.700",
                          fontWeight: "normal",
                        },
                        "For suggestions, bug reports",
                      ),
                    ),
                  ),
                  r.createElement(
                    i.az,
                    {
                      borderWidth: "1px",
                      borderColor: "gray.300",
                      borderRadius: "md",
                      py: 3,
                      px: 4,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      _hover: { borderColor: "gray.400", bg: "gray.50" },
                      onClick: p,
                    },
                    r.createElement(
                      En.T,
                      { spacing: 1.5, align: "start", w: "full" },
                      r.createElement(
                        l.E,
                        {
                          fontSize: "md",
                          fontWeight: "bold",
                          color: "gray.700",
                        },
                        "📧 Email support",
                      ),
                      r.createElement(
                        l.E,
                        {
                          fontSize: "xs",
                          color: "gray.600",
                          fontWeight: "normal",
                        },
                        "Click to copy email address",
                      ),
                      r.createElement(
                        B.s,
                        { align: "center", gap: 2, w: "full" },
                        r.createElement(
                          l.E,
                          {
                            fontSize: "xs",
                            color: "gray.600",
                            fontWeight: "medium",
                            fontFamily: "mono",
                          },
                          s,
                        ),
                        r.createElement(Bn.K, {
                          size: "xs",
                          icon: o
                            ? r.createElement(hn.YrT, null)
                            : r.createElement(hn.nxz, null),
                          onClick: p,
                          "aria-label": "Copy email",
                          variant: "ghost",
                          colorScheme: o ? "green" : "gray",
                          minW: "24px",
                          h: "24px",
                          _hover: { bg: o ? "green.100" : "gray.100" },
                        }),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          );
        };
        const Gn = (0, OA.PA)(function () {
          var A,
            n,
            t = (0, T.j)(),
            e = t.isOpen,
            o = t.onOpen,
            a = t.onClose,
            i = BA.userInfo.userLevel,
            c =
              ((A = BA.userInfo.paygoMinutes),
              (n = Number(A)),
              Number.isFinite(n) ? Math.max(0, n) : 0),
            l = c > 0,
            d = i ? "Plan: ".concat(i.toUpperCase()) : "",
            s =
              d &&
              (l
                ? "".concat(d, " · Extra (lifetime): ").concat(
                    (function (A) {
                      var n = Number(A);
                      if (!Number.isFinite(n)) return "--";
                      var t = Math.max(0, n),
                        r = Math.round(t),
                        e = Math.floor(r / 60),
                        o = r - 60 * e;
                      return e > 0 && o > 0
                        ? "".concat(e, "h ").concat(o, "m")
                        : e > 0
                          ? "".concat(e, "h")
                          : "".concat(o, "m");
                    })(c),
                  )
                : d);
          return r.createElement(
            r.Fragment,
            null,
            r.createElement(kn, { isOpen: e, onClose: a }),
            r.createElement(
              "div",
              { className: "flex border-t items-center px-3 py-2.5" },
              ("pro" == i ||
                "starter" == i ||
                "business" == i ||
                "power" == i ||
                "ultra" == i ||
                "plus" == i ||
                "custom" == i ||
                "enterprise" == i) &&
                r.createElement(fn.Hu1, {
                  style: {
                    marginRight: "5px",
                    color: "#FFCD44",
                    fontSize: "16px",
                    fontWeight: "bold",
                  },
                }),
              " ",
              s,
              r.createElement(
                "span",
                { className: "ml-auto text-xs" },
                r.createElement(
                  "a",
                  {
                    href: "#",
                    onClick: function (A) {
                      var n;
                      (A.preventDefault(),
                        uA("feedback_modal_opened", {
                          source: "footer_contact_us",
                          userLevel:
                            null === (n = BA.userInfo) || void 0 === n
                              ? void 0
                              : n.userLevel,
                        }),
                        o());
                    },
                    className: "text-sm font-bold",
                    style: { color: "#6366f1" },
                  },
                  " contact us ",
                ),
              ),
            ),
          );
        });
        var Hn = t(6092);
        function Sn(A) {
          return (
            (Sn =
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
            Sn(A)
          );
        }
        function In(A, n) {
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
        function Ln(A) {
          for (var n = 1; n < arguments.length; n++) {
            var t = null != arguments[n] ? arguments[n] : {};
            n % 2
              ? In(Object(t), !0).forEach(function (n) {
                  Tn(A, n, t[n]);
                })
              : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    A,
                    Object.getOwnPropertyDescriptors(t),
                  )
                : In(Object(t)).forEach(function (n) {
                    Object.defineProperty(
                      A,
                      n,
                      Object.getOwnPropertyDescriptor(t, n),
                    );
                  });
          }
          return A;
        }
        function Tn(A, n, t) {
          var r;
          return (
            (r = (function (A, n) {
              if ("object" != Sn(A) || !A) return A;
              var t = A[Symbol.toPrimitive];
              if (void 0 !== t) {
                var r = t.call(A, n || "default");
                if ("object" != Sn(r)) return r;
                throw new TypeError(
                  "@@toPrimitive must return a primitive value.",
                );
              }
              return ("string" === n ? String : Number)(A);
            })(n, "string")),
            (n = "symbol" == Sn(r) ? r : String(r)) in A
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
        function Cn(A, n) {
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
                  l = !1;
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
                  ((l = !0), (e = A));
                } finally {
                  try {
                    if (
                      !c &&
                      null != t.return &&
                      ((a = t.return()), Object(a) !== a)
                    )
                      return;
                  } finally {
                    if (l) throw e;
                  }
                }
                return i;
              }
            })(A, n) ||
            (function (A, n) {
              if (!A) return;
              if ("string" == typeof A) return On(A, n);
              var t = Object.prototype.toString.call(A).slice(8, -1);
              "Object" === t && A.constructor && (t = A.constructor.name);
              if ("Map" === t || "Set" === t) return Array.from(A);
              if (
                "Arguments" === t ||
                /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
              )
                return On(A, n);
            })(A, n) ||
            (function () {
              throw new TypeError(
                "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
              );
            })()
          );
        }
        function On(A, n) {
          (null == n || n > A.length) && (n = A.length);
          for (var t = 0, r = new Array(n); t < n; t++) r[t] = A[t];
          return r;
        }
        const zn = (0, OA.PA)(function (A) {
          var n,
            t,
            e,
            o,
            c,
            s,
            p,
            g,
            u,
            m,
            b,
            w,
            f,
            E = A.setSelectedTabIndex,
            y = (0, a.d)(),
            B = L(),
            h = B.t,
            v = B.locale,
            x = B.changeLanguage,
            k = B.supportedLanguages,
            G = (0, T.j)(),
            H = G.isOpen,
            S = (G.onOpen, G.onClose),
            I = Cn((0, r.useState)({ modalTitle: "", modalText: "" }), 2),
            C = I[0],
            O = (I[1], Cn((0, r.useState)(!1), 2)),
            z = O[0],
            j = O[1];
          return r.createElement(
            "div",
            null,
            r.createElement(cA, {
              isOpen: H,
              onClose: S,
              modalText: C.modalText,
              modalTitle: C.modalTitle,
            }),
            r.createElement(
              "div",
              {
                className:
                  "max-w-2xl overflow-hidden bg-white rounded-lg shadow",
              },
              r.createElement(
                "div",
                { className: "px-4 py-3 pt-2" },
                r.createElement(
                  "h3",
                  { className: "text-lg font-medium leading-6 text-gray-900" },
                  h("account.title"),
                ),
              ),
              r.createElement(
                "div",
                { className: "border-t border-gray-200" },
                r.createElement(
                  "dl",
                  null,
                  r.createElement(
                    "div",
                    {
                      className:
                        "grid grid-cols-2 gap-4 px-4 py-3 bg-gray-100 ",
                    },
                    r.createElement(
                      "dt",
                      { className: "text-sm font-medium text-gray-500" },
                      h("account.email"),
                    ),
                    r.createElement(
                      "dd",
                      { className: "col-span-1 mt-0 text-sm text-gray-900" },
                      null !== (n = BA.userInfo.email) && void 0 !== n ? n : "",
                    ),
                  ),
                  r.createElement(
                    "div",
                    { className: "grid grid-cols-2 gap-4 px-4 py-3 bg-white " },
                    r.createElement(
                      "dt",
                      { className: "text-sm font-medium text-gray-500" },
                      h("account.plan"),
                    ),
                    r.createElement(
                      "dd",
                      { className: "col-span-1 mt-0 text-sm text-gray-900 " },
                      null !== (t = BA.userInfo.userLevel) && void 0 !== t
                        ? t
                        : "",
                    ),
                  ),
                  BA.userInfo &&
                    ("pro" ===
                      (null === (e = BA.userInfo) || void 0 === e
                        ? void 0
                        : e.userLevel) ||
                      "starter" ===
                        (null === (o = BA.userInfo) || void 0 === o
                          ? void 0
                          : o.userLevel) ||
                      "business" ===
                        (null === (c = BA.userInfo) || void 0 === c
                          ? void 0
                          : c.userLevel) ||
                      "power" ===
                        (null === (s = BA.userInfo) || void 0 === s
                          ? void 0
                          : s.userLevel) ||
                      "ultra" ===
                        (null === (p = BA.userInfo) || void 0 === p
                          ? void 0
                          : p.userLevel) ||
                      "plus" ===
                        (null === (g = BA.userInfo) || void 0 === g
                          ? void 0
                          : g.userLevel) ||
                      "custom" ===
                        (null === (u = BA.userInfo) || void 0 === u
                          ? void 0
                          : u.userLevel) ||
                      "enterprise" ===
                        (null === (m = BA.userInfo) || void 0 === m
                          ? void 0
                          : m.userLevel)) &&
                    r.createElement(
                      r.Fragment,
                      null,
                      r.createElement(
                        "div",
                        {
                          className:
                            "grid grid-cols-2 gap-4 px-4 py-3 bg-gray-100 ",
                        },
                        r.createElement(
                          "dt",
                          { className: "text-sm font-medium text-gray-500" },
                          h("account.status"),
                        ),
                        r.createElement(
                          "dd",
                          {
                            className: "col-span-1 mt-0 text-sm text-gray-900",
                          },
                          null !== (b = BA.userInfo.proStatus) && void 0 !== b
                            ? b
                            : "",
                        ),
                      ),
                      r.createElement(
                        "div",
                        {
                          className:
                            "grid grid-cols-2 gap-4 px-4 py-3 bg-white ",
                        },
                        r.createElement(
                          "dt",
                          { className: "text-sm font-medium text-gray-500" },
                          "active" === BA.userInfo.proStatus
                            ? h("account.nextBillingDate")
                            : h("account.endDate"),
                        ),
                        r.createElement(
                          "dd",
                          {
                            className: "col-span-1 mt-0 text-sm text-gray-900",
                          },
                          new Date(
                            null !== (w = BA.userInfo.renewsAt) && void 0 !== w
                              ? w
                              : "",
                          ).toLocaleString(),
                        ),
                      ),
                      BA.userInfo.minutesRenewsAt &&
                        r.createElement(
                          "div",
                          {
                            className:
                              "grid grid-cols-2 gap-4 px-4 py-3 bg-gray-100 ",
                          },
                          r.createElement(
                            "dt",
                            { className: "text-sm font-medium text-gray-500" },
                            h("account.minutesResetDate"),
                          ),
                          r.createElement(
                            "dd",
                            {
                              className:
                                "col-span-1 mt-0 text-sm text-gray-900",
                            },
                            new Date(
                              null !== (f = BA.userInfo.minutesRenewsAt) &&
                                void 0 !== f
                                ? f
                                : "",
                            ).toLocaleString(),
                          ),
                        ),
                      " ",
                    ),
                  r.createElement(
                    "div",
                    { className: "grid grid-cols-2 gap-4 px-4 py-3 bg-white" },
                    r.createElement(
                      "dt",
                      {
                        className:
                          "text-sm font-medium text-gray-500 flex items-center gap-1",
                      },
                      h("account.uiLanguage"),
                      r.createElement(
                        M.m,
                        {
                          label: h(
                            "account.uiLanguageTooltip",
                            "This only affects interface buttons and text, not subtitle or translation languages.",
                          ),
                          fontSize: "xs",
                          placement: "top",
                          hasArrow: !0,
                          bg: "gray.700",
                          color: "white",
                          px: 3,
                          py: 2,
                          borderRadius: "md",
                        },
                        r.createElement(
                          i.az,
                          {
                            as: "span",
                            cursor: "help",
                            display: "inline-flex",
                            alignItems: "center",
                            ml: 1,
                            verticalAlign: "middle",
                            position: "relative",
                            top: "-1px",
                          },
                          r.createElement(
                            "svg",
                            {
                              xmlns: "http://www.w3.org/2000/svg",
                              width: "13",
                              height: "13",
                              viewBox: "0 0 24 24",
                              fill: "none",
                              stroke: "currentColor",
                              strokeWidth: "2",
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                              style: { color: "#9CA3AF" },
                            },
                            r.createElement("circle", {
                              cx: "12",
                              cy: "12",
                              r: "10",
                            }),
                            r.createElement("path", { d: "M12 16v-4" }),
                            r.createElement("path", { d: "M12 8h.01" }),
                          ),
                        ),
                      ),
                    ),
                    r.createElement(
                      "dd",
                      { className: "col-span-1 mt-0 text-sm text-gray-900" },
                      r.createElement(
                        Hn.l,
                        {
                          size: "sm",
                          value: v,
                          onChange: function (A) {
                            return x(A.target.value);
                          },
                        },
                        k.map(function (A) {
                          return r.createElement(
                            "option",
                            { key: A.code, value: A.code },
                            A.nativeName,
                          );
                        }),
                      ),
                    ),
                  ),
                  r.createElement(
                    "div",
                    {
                      className:
                        "px-4 py-3 bg-gray-100 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6",
                    },
                    r.createElement(
                      "dd",
                      {
                        className:
                          "mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1",
                      },
                      r.createElement(
                        An.o,
                        null,
                        r.createElement(
                          d.$,
                          {
                            bg: "#6366f1",
                            _hover: { bg: "#4f46e5" },
                            color: "white",
                            mr: "2",
                            w: "200px",
                            onClick: function () {
                              rA.signOut();
                              try {
                                chrome.runtime.sendMessage({
                                  type: "offscreenStop",
                                });
                              } catch (A) {}
                              try {
                                chrome.tabs.query({}, function (A) {
                                  A &&
                                    A.length &&
                                    A.forEach(function (A) {
                                      try {
                                        chrome.tabs.sendMessage(A.id, {
                                          type: "hide-overlay",
                                        });
                                      } catch (A) {}
                                    });
                                });
                              } catch (A) {}
                              E(0);
                            },
                          },
                          h("account.logOut"),
                        ),
                        " ",
                        r.createElement(
                          d.$,
                          {
                            isLoading: z,
                            onClick: function () {
                              if (
                                "free" !== BA.userInfo.userLevel ||
                                BA.userInfo.customerId
                              ) {
                                j(!0);
                                var A = Ln(
                                  Ln(
                                    { customerId: BA.userInfo.customerId },
                                    BA.userInfo,
                                  ),
                                  {},
                                  {
                                    productName: J.checkoutName,
                                    isTestMode: J.configs.isTestMode,
                                  },
                                );
                                fetch(
                                  "https://us-central1-easyhighlight-7d4e5.cloudfunctions.net/getStripeCustomerPortalUrl",
                                  {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(A),
                                  },
                                )
                                  .then(function (A) {
                                    if (A.ok) return A.text();
                                    chrome.tabs.create({
                                      url: J.configs.customerPortalUrl,
                                    });
                                  })
                                  .then(function (A) {
                                    (j(!1),
                                      A &&
                                        A.includes("http") &&
                                        chrome.tabs.create({ url: A }));
                                  })
                                  .catch(function (A) {
                                    j(!1);
                                  });
                              } else
                                y({
                                  duration: 5e3,
                                  isClosable: !0,
                                  position: "top",
                                  render: function (A) {
                                    var n = A.onClose;
                                    return r.createElement(
                                      i.az,
                                      {
                                        color: "white",
                                        p: 4,
                                        bg: "linear-gradient(135deg, #1DA1F2 0%, #0d8ecf 100%)",
                                        borderRadius: "lg",
                                        boxShadow:
                                          "0 4px 6px rgba(0, 0, 0, 0.1)",
                                      },
                                      r.createElement(
                                        En.T,
                                        { spacing: 3, align: "stretch" },
                                        r.createElement(
                                          l.E,
                                          {
                                            fontWeight: "bold",
                                            fontSize: "lg",
                                          },
                                          h("account.noSubscriptionFound"),
                                        ),
                                        r.createElement(
                                          l.E,
                                          null,
                                          h("account.noSubscriptionMessage"),
                                        ),
                                        r.createElement(
                                          d.$,
                                          {
                                            bg: "white",
                                            color: "#1DA1F2",
                                            size: "sm",
                                            onClick: function () {
                                              (hA(), n());
                                            },
                                            _hover: { bg: "gray.100" },
                                            leftIcon: r.createElement(QA.Hu1, {
                                              color: "#FFD700",
                                            }),
                                          },
                                          h("account.upgrade"),
                                        ),
                                      ),
                                    );
                                  },
                                });
                            },
                            bg: "#6366f1",
                            _hover: { bg: "#4f46e5" },
                            color: "white",
                            w: "200px",
                          },
                          h("account.manageSubscription"),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          );
        });
        var jn = t(1857),
          Nn = t(2440),
          _n = t(8581),
          Pn = t(7594),
          Mn = t(2824),
          Fn = t(4679),
          Dn = t(5016),
          Rn = t(4194),
          Un = t(9879);
        t(4143);
        function Wn(A) {
          return (
            (Wn =
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
            Wn(A)
          );
        }
        function Yn(A, n) {
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
        function qn(A) {
          for (var n = 1; n < arguments.length; n++) {
            var t = null != arguments[n] ? arguments[n] : {};
            n % 2
              ? Yn(Object(t), !0).forEach(function (n) {
                  Xn(A, n, t[n]);
                })
              : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    A,
                    Object.getOwnPropertyDescriptors(t),
                  )
                : Yn(Object(t)).forEach(function (n) {
                    Object.defineProperty(
                      A,
                      n,
                      Object.getOwnPropertyDescriptor(t, n),
                    );
                  });
          }
          return A;
        }
        function Xn(A, n, t) {
          var r;
          return (
            (r = (function (A, n) {
              if ("object" != Wn(A) || !A) return A;
              var t = A[Symbol.toPrimitive];
              if (void 0 !== t) {
                var r = t.call(A, n || "default");
                if ("object" != Wn(r)) return r;
                throw new TypeError(
                  "@@toPrimitive must return a primitive value.",
                );
              }
              return ("string" === n ? String : Number)(A);
            })(n, "string")),
            (n = "symbol" == Wn(r) ? r : String(r)) in A
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
        function $n() {
          $n = function () {
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
          function l(A, n, t) {
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
            l({}, "");
          } catch (A) {
            l = function (A, n, t) {
              return (A[n] = t);
            };
          }
          function d(A, n, t, r) {
            var o = n && n.prototype instanceof w ? n : w,
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
          n.wrap = d;
          var p = "suspendedStart",
            g = "suspendedYield",
            u = "executing",
            m = "completed",
            b = {};
          function w() {}
          function f() {}
          function E() {}
          var y = {};
          l(y, a, function () {
            return this;
          });
          var B = Object.getPrototypeOf,
            h = B && B(B(T([])));
          h && h !== t && r.call(h, a) && (y = h);
          var v = (E.prototype = w.prototype = Object.create(y));
          function x(A) {
            ["next", "throw", "return"].forEach(function (n) {
              l(A, n, function (A) {
                return this._invoke(n, A);
              });
            });
          }
          function k(A, n) {
            function t(e, o, a, i) {
              var c = s(A[e], A, o);
              if ("throw" !== c.type) {
                var l = c.arg,
                  d = l.value;
                return d && "object" == Wn(d) && r.call(d, "__await")
                  ? n.resolve(d.__await).then(
                      function (A) {
                        t("next", A, a, i);
                      },
                      function (A) {
                        t("throw", A, a, i);
                      },
                    )
                  : n.resolve(d).then(
                      function (A) {
                        ((l.value = A), a(l));
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
            var e = p;
            return function (o, a) {
              if (e === u) throw new Error("Generator is already running");
              if (e === m) {
                if ("throw" === o) throw a;
                return { value: A, done: !0 };
              }
              for (r.method = o, r.arg = a; ; ) {
                var i = r.delegate;
                if (i) {
                  var c = H(i, r);
                  if (c) {
                    if (c === b) continue;
                    return c;
                  }
                }
                if ("next" === r.method) r.sent = r._sent = r.arg;
                else if ("throw" === r.method) {
                  if (e === p) throw ((e = m), r.arg);
                  r.dispatchException(r.arg);
                } else "return" === r.method && r.abrupt("return", r.arg);
                e = u;
                var l = s(n, t, r);
                if ("normal" === l.type) {
                  if (((e = r.done ? m : g), l.arg === b)) continue;
                  return { value: l.arg, done: r.done };
                }
                "throw" === l.type &&
                  ((e = m), (r.method = "throw"), (r.arg = l.arg));
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
                b
              );
            var o = s(e, n.iterator, t.arg);
            if ("throw" === o.type)
              return (
                (t.method = "throw"),
                (t.arg = o.arg),
                (t.delegate = null),
                b
              );
            var a = o.arg;
            return a
              ? a.done
                ? ((t[n.resultName] = a.value),
                  (t.next = n.nextLoc),
                  "return" !== t.method && ((t.method = "next"), (t.arg = A)),
                  (t.delegate = null),
                  b)
                : a
              : ((t.method = "throw"),
                (t.arg = new TypeError("iterator result is not an object")),
                (t.delegate = null),
                b);
          }
          function S(A) {
            var n = { tryLoc: A[0] };
            (1 in A && (n.catchLoc = A[1]),
              2 in A && ((n.finallyLoc = A[2]), (n.afterLoc = A[3])),
              this.tryEntries.push(n));
          }
          function I(A) {
            var n = A.completion || {};
            ((n.type = "normal"), delete n.arg, (A.completion = n));
          }
          function L(A) {
            ((this.tryEntries = [{ tryLoc: "root" }]),
              A.forEach(S, this),
              this.reset(!0));
          }
          function T(n) {
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
            throw new TypeError(Wn(n) + " is not iterable");
          }
          return (
            (f.prototype = E),
            e(v, "constructor", { value: E, configurable: !0 }),
            e(E, "constructor", { value: f, configurable: !0 }),
            (f.displayName = l(E, c, "GeneratorFunction")),
            (n.isGeneratorFunction = function (A) {
              var n = "function" == typeof A && A.constructor;
              return (
                !!n &&
                (n === f || "GeneratorFunction" === (n.displayName || n.name))
              );
            }),
            (n.mark = function (A) {
              return (
                Object.setPrototypeOf
                  ? Object.setPrototypeOf(A, E)
                  : ((A.__proto__ = E), l(A, c, "GeneratorFunction")),
                (A.prototype = Object.create(v)),
                A
              );
            }),
            (n.awrap = function (A) {
              return { __await: A };
            }),
            x(k.prototype),
            l(k.prototype, i, function () {
              return this;
            }),
            (n.AsyncIterator = k),
            (n.async = function (A, t, r, e, o) {
              void 0 === o && (o = Promise);
              var a = new k(d(A, t, r, e), o);
              return n.isGeneratorFunction(t)
                ? a
                : a.next().then(function (A) {
                    return A.done ? A.value : a.next();
                  });
            }),
            x(v),
            l(v, c, "Generator"),
            l(v, a, function () {
              return this;
            }),
            l(v, "toString", function () {
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
            (n.values = T),
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
                  this.tryEntries.forEach(I),
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
                      l = r.call(a, "finallyLoc");
                    if (c && l) {
                      if (this.prev < a.catchLoc) return e(a.catchLoc, !0);
                      if (this.prev < a.finallyLoc) return e(a.finallyLoc);
                    } else if (c) {
                      if (this.prev < a.catchLoc) return e(a.catchLoc, !0);
                    } else {
                      if (!l)
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
                    ? ((this.method = "next"), (this.next = o.finallyLoc), b)
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
                  b
                );
              },
              finish: function (A) {
                for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                  var t = this.tryEntries[n];
                  if (t.finallyLoc === A)
                    return (this.complete(t.completion, t.afterLoc), I(t), b);
                }
              },
              catch: function (A) {
                for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                  var t = this.tryEntries[n];
                  if (t.tryLoc === A) {
                    var r = t.completion;
                    if ("throw" === r.type) {
                      var e = r.arg;
                      I(t);
                    }
                    return e;
                  }
                }
                throw new Error("illegal catch attempt");
              },
              delegateYield: function (n, t, r) {
                return (
                  (this.delegate = {
                    iterator: T(n),
                    resultName: t,
                    nextLoc: r,
                  }),
                  "next" === this.method && (this.arg = A),
                  b
                );
              },
            }),
            n
          );
        }
        function Kn(A, n, t, r, e, o, a) {
          try {
            var i = A[o](a),
              c = i.value;
          } catch (A) {
            return void t(A);
          }
          i.done ? n(c) : Promise.resolve(c).then(r, e);
        }
        function Vn(A) {
          return function () {
            var n = this,
              t = arguments;
            return new Promise(function (r, e) {
              var o = A.apply(n, t);
              function a(A) {
                Kn(o, r, e, a, i, "next", A);
              }
              function i(A) {
                Kn(o, r, e, a, i, "throw", A);
              }
              a(void 0);
            });
          };
        }
        function Jn(A, n) {
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
                  l = !1;
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
                  ((l = !0), (e = A));
                } finally {
                  try {
                    if (
                      !c &&
                      null != t.return &&
                      ((a = t.return()), Object(a) !== a)
                    )
                      return;
                  } finally {
                    if (l) throw e;
                  }
                }
                return i;
              }
            })(A, n) ||
            (function (A, n) {
              if (!A) return;
              if ("string" == typeof A) return Qn(A, n);
              var t = Object.prototype.toString.call(A).slice(8, -1);
              "Object" === t && A.constructor && (t = A.constructor.name);
              if ("Map" === t || "Set" === t) return Array.from(A);
              if (
                "Arguments" === t ||
                /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
              )
                return Qn(A, n);
            })(A, n) ||
            (function () {
              throw new TypeError(
                "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
              );
            })()
          );
        }
        function Qn(A, n) {
          (null == n || n > A.length) && (n = A.length);
          for (var t = 0, r = new Array(n); t < n; t++) r[t] = A[t];
          return r;
        }
        (0, OA.PA)(function () {
          var A = (0, a.d)(),
            n = Jn((0, r.useState)([]), 2),
            t = n[0],
            e = n[1],
            o = Jn((0, r.useState)(1), 2),
            c = o[0],
            s = o[1],
            p = Jn((0, r.useState)(null), 2),
            g = p[0],
            u = p[1],
            m = (function () {
              var n = Vn(
                $n().mark(function n(t) {
                  return $n().wrap(
                    function (n) {
                      for (;;)
                        switch ((n.prev = n.next)) {
                          case 0:
                            return (
                              (n.prev = 0),
                              (n.next = 3),
                              navigator.clipboard.writeText(t)
                            );
                          case 3:
                            (A({
                              title: "URL copied",
                              status: "success",
                              duration: 2e3,
                              isClosable: !0,
                              position: "top",
                            }),
                              (n.next = 10));
                            break;
                          case 6:
                            ((n.prev = 6),
                              (n.t0 = n.catch(0)),
                              A({
                                title: "Failed to copy URL",
                                status: "error",
                                duration: 2e3,
                                isClosable: !0,
                                position: "top",
                              }));
                          case 10:
                          case "end":
                            return n.stop();
                        }
                    },
                    n,
                    null,
                    [[0, 6]],
                  );
                }),
              );
              return function (A) {
                return n.apply(this, arguments);
              };
            })(),
            b = function () {
              return (
                "pro" === BA.userInfo.userLevel ||
                "starter" === BA.userInfo.userLevel ||
                "business" === BA.userInfo.userLevel ||
                "power" === BA.userInfo.userLevel ||
                "ultra" === BA.userInfo.userLevel ||
                "plus" === BA.userInfo.userLevel ||
                "custom" === BA.userInfo.userLevel ||
                "enterprise" === BA.userInfo.userLevel ||
                (A({
                  duration: 3e3,
                  isClosable: !0,
                  position: "top",
                  render: function (A) {
                    var n = A.onClose;
                    return r.createElement(
                      i.az,
                      {
                        color: "white",
                        p: 4,
                        bg: "linear-gradient(135deg, #1DA1F2 0%, #0d8ecf 100%)",
                        borderRadius: "lg",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      },
                      r.createElement(cA, {
                        isOpen: E,
                        onClose: n,
                        modalText: x.modalText,
                        modalTitle: x.modalTitle,
                      }),
                      r.createElement(
                        En.T,
                        { spacing: 3, align: "stretch" },
                        r.createElement(
                          l.E,
                          { fontWeight: "bold", fontSize: "lg" },
                          "Pro Subscription Required",
                        ),
                        r.createElement(
                          l.E,
                          null,
                          "Unlock this feature by upgrading to Pro!",
                        ),
                        r.createElement(
                          d.$,
                          {
                            bg: "white",
                            color: "#1DA1F2",
                            size: "sm",
                            onClick: function () {
                              chrome.tabs.create({
                                url: ""
                                  .concat(J.getSubscriptionURL(), "?product=")
                                  .concat(J.name.toLowerCase(), "&mail=")
                                  .concat(BA.userInfo.email, "&id=")
                                  .concat(BA.userInfo.uid),
                              });
                            },
                            _hover: { bg: "gray.100" },
                            leftIcon: r.createElement(QA.Hu1, {
                              color: "#FFD700",
                            }),
                          },
                          "Upgrade to Pro",
                        ),
                      ),
                    );
                  },
                }),
                !1)
              );
            },
            w = (function () {
              var n = Vn(
                $n().mark(function n() {
                  var r, o;
                  return $n().wrap(function (n) {
                    for (;;)
                      switch ((n.prev = n.next)) {
                        case 0:
                          if (g) {
                            try {
                              (chrome.runtime.sendMessage({
                                type: "deleteRecord",
                                taskId: g,
                                userInfo: BA.userInfo,
                              }),
                                e(function (A) {
                                  return A.filter(function (A) {
                                    return A.id !== g;
                                  });
                                }),
                                A({
                                  title: "Record deleted successfully",
                                  status: "success",
                                  duration: 2e3,
                                  isClosable: !0,
                                  position: "top",
                                }),
                                (r = t.length - 1),
                                (o = Math.ceil(r / 10)),
                                c > o && o > 0 && s(o));
                            } catch (n) {
                              A({
                                title: "Failed to delete record",
                                status: "error",
                                duration: 2e3,
                                isClosable: !0,
                                position: "top",
                              });
                            }
                            (u(null), h());
                          }
                        case 1:
                        case "end":
                          return n.stop();
                      }
                  }, n);
                }),
              );
              return function () {
                return n.apply(this, arguments);
              };
            })();
          (0, r.useEffect)(
            function () {
              (chrome.runtime.onMessage.addListener(function (A, n, t) {
                if ("bcReturnTaskData" === A.type) {
                  var r = A.taskData.sort(function (A, n) {
                    return n.id - A.id;
                  });
                  e(r);
                }
              }),
                chrome.runtime.sendMessage(
                  { type: "getTaskData", userInfo: BA.userInfo },
                  function (A) {},
                ));
            },
            [BA.userInfo.uid],
          );
          var f = (0, T.j)(),
            E = f.isOpen,
            y = f.onOpen,
            h = f.onClose,
            v = Jn((0, r.useState)({ modalTitle: "", modalText: "" }), 2),
            x = v[0],
            k = v[1],
            G = function (A) {
              var n =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : "";
              (k(qn(qn({}, x), {}, { modalText: A, modalTitle: n })), y());
            },
            H = Math.ceil(t.length / 10),
            S = 10 * c,
            I = S - 10,
            L = t.slice(I, S),
            C = function (A) {
              return s(A);
            };
          return r.createElement(
            i.az,
            {
              height: "100%",
              width: "100%",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            },
            r.createElement(cA, {
              isOpen: E,
              onClose: h,
              modalText: x.modalText,
              modalTitle: x.modalTitle,
              yesAndCancelButton: null !== g,
              yesHandler: null !== g ? w : function () {},
            }),
            r.createElement(
              jn.K,
              { flex: "1", overflowY: "auto" },
              r.createElement(
                Nn.X,
                { variant: "simple", size: "xs", fontSize: "2xs" },
                r.createElement(
                  _n.d,
                  { position: "sticky", top: 0, bg: "white", zIndex: 1 },
                  r.createElement(
                    Pn.Tr,
                    null,
                    r.createElement(
                      Mn.Th,
                      {
                        py: 1,
                        fontSize: "2xs",
                        textTransform: "none",
                        width: "30px",
                        textAlign: "center",
                      },
                      "ID",
                    ),
                    r.createElement(
                      Mn.Th,
                      {
                        py: 1,
                        fontSize: "2xs",
                        textTransform: "none",
                        maxWidth: "150px",
                        textAlign: "center",
                      },
                      "URL",
                    ),
                    r.createElement(
                      Mn.Th,
                      {
                        py: 1,
                        fontSize: "2xs",
                        textTransform: "none",
                        textAlign: "center",
                      },
                      "StartTime",
                    ),
                    r.createElement(
                      Mn.Th,
                      {
                        py: 1,
                        fontSize: "2xs",
                        textTransform: "none",
                        textAlign: "center",
                      },
                      "RequestedCount",
                    ),
                    r.createElement(
                      Mn.Th,
                      {
                        py: 1,
                        fontSize: "2xs",
                        textTransform: "none",
                        textAlign: "center",
                      },
                      "RecordCount",
                    ),
                    r.createElement(
                      Mn.Th,
                      {
                        py: 1,
                        fontSize: "2xs",
                        textTransform: "none",
                        textAlign: "center",
                      },
                      "Status",
                    ),
                    r.createElement(
                      Mn.Th,
                      {
                        py: 1,
                        fontSize: "2xs",
                        textTransform: "none",
                        textAlign: "center",
                      },
                      "Save as CSV",
                    ),
                    r.createElement(
                      Mn.Th,
                      {
                        py: 1,
                        fontSize: "2xs",
                        textTransform: "none",
                        textAlign: "center",
                      },
                      "Delete",
                    ),
                  ),
                ),
                r.createElement(
                  Fn.N,
                  null,
                  0 === t.length
                    ? r.createElement(
                        Pn.Tr,
                        null,
                        r.createElement(
                          Dn.Td,
                          { colSpan: 8, textAlign: "center", py: 8 },
                          r.createElement(
                            l.E,
                            { fontSize: "sm", color: "gray.500" },
                            "No export records yet",
                          ),
                        ),
                      )
                    : L.map(function (n) {
                        return r.createElement(
                          Pn.Tr,
                          { key: n.id },
                          r.createElement(
                            Dn.Td,
                            { py: 0.5, width: "30px", textAlign: "center" },
                            n.id,
                          ),
                          r.createElement(
                            Dn.Td,
                            { py: 0.5, maxWidth: "150px", textAlign: "center" },
                            r.createElement(
                              B.s,
                              {
                                alignItems: "center",
                                justifyContent: "center",
                              },
                              r.createElement(
                                M.m,
                                { label: n.TaskURL, fontSize: "xs" },
                                r.createElement(
                                  l.E,
                                  { isTruncated: !0, maxWidth: "120px" },
                                  n.TaskURL,
                                ),
                              ),
                              r.createElement(
                                M.m,
                                { label: "Copy URL", fontSize: "xs" },
                                r.createElement(Bn.K, {
                                  "aria-label": "Copy URL",
                                  icon: r.createElement(QA.zU_, null),
                                  size: "2xs",
                                  ml: 1,
                                  onClick: function () {
                                    return m(n.TaskURL);
                                  },
                                  variant: "ghost",
                                  flexShrink: 0,
                                }),
                              ),
                            ),
                          ),
                          r.createElement(
                            Dn.Td,
                            { py: 0.5, textAlign: "center" },
                            new Date(n.TaskStartTime).toLocaleString(),
                          ),
                          r.createElement(
                            Dn.Td,
                            { py: 0.5, textAlign: "center" },
                            n.RequestedCount || "-",
                          ),
                          r.createElement(
                            Dn.Td,
                            { py: 0.5, textAlign: "center" },
                            n.RecordCount,
                          ),
                          r.createElement(
                            Dn.Td,
                            { py: 0.5, textAlign: "center" },
                            r.createElement(
                              B.s,
                              {
                                alignItems: "center",
                                justifyContent: "center",
                              },
                              n.TaskStatus,
                              "completed" === n.TaskStatus &&
                                r.createElement(nn.I, {
                                  as: QA.CMH,
                                  color: "green.500",
                                  ml: 1,
                                }),
                              "stopped" === n.TaskStatus &&
                                r.createElement(
                                  M.m,
                                  {
                                    label: J.isScraping
                                      ? "Scraping in progress"
                                      : "Continue",
                                    fontSize: "xs",
                                  },
                                  r.createElement(Bn.K, {
                                    "aria-label": "Continue",
                                    icon: r.createElement(QA.gSK, null),
                                    size: "xs",
                                    ml: 1,
                                    onClick: function () {
                                      return (function (n, t, r, e, o, a) {
                                        if (b() && !J.isScraping)
                                          try {
                                            if ("stopped" === o) {
                                              if (!t)
                                                throw new Error("URL is empty");
                                              if (0 === r)
                                                return void A({
                                                  title:
                                                    "Cannot continue with 0 records",
                                                  description:
                                                    "When the scraped record count is 0, you cannot continue scraping. Please restart this task.",
                                                  status: "warning",
                                                  duration: 8e3,
                                                  isClosable: !0,
                                                  position: "top",
                                                });
                                              chrome.runtime.sendMessage({
                                                type: "continueExport",
                                                taskId: n,
                                                url: t,
                                                userInfo: BA.userInfo,
                                                requestedCount: a,
                                                recordCount: r,
                                                cursor: e,
                                              });
                                            }
                                          } catch (n) {
                                            A({
                                              title: "Failed to continue",
                                              status: "error",
                                              duration: 1500,
                                              isClosable: !0,
                                              position: "top",
                                            });
                                          }
                                      })(
                                        n.id,
                                        n.TaskURL,
                                        n.RecordCount,
                                        n.Cursor,
                                        n.TaskStatus,
                                        n.RequestedCount,
                                      );
                                    },
                                    variant: "ghost",
                                    isDisabled: J.isScraping,
                                  }),
                                ),
                            ),
                          ),
                          r.createElement(
                            Dn.Td,
                            { py: 0.5, textAlign: "center" },
                            r.createElement(
                              M.m,
                              {
                                label: J.isScraping
                                  ? "Scraping in progress"
                                  : "Save as CSV",
                                fontSize: "xs",
                              },
                              r.createElement(Bn.K, {
                                "aria-label": "Save as CSV",
                                icon: r.createElement(Un.i92, null),
                                size: "xs",
                                onClick: function () {
                                  return (
                                    (A = n.id),
                                    void (
                                      b() &&
                                      !J.isScraping &&
                                      chrome.runtime.sendMessage({
                                        type: "downloadCSV",
                                        taskId: A,
                                      })
                                    )
                                  );
                                  var A;
                                },
                                variant: "ghost",
                                isDisabled: J.isScraping,
                              }),
                            ),
                          ),
                          r.createElement(
                            Dn.Td,
                            { py: 0.5, textAlign: "center" },
                            r.createElement(
                              M.m,
                              { label: "Delete record", fontSize: "xs" },
                              r.createElement(Bn.K, {
                                "aria-label": "Delete record",
                                icon: r.createElement(QA.qbC, null),
                                size: "xs",
                                onClick: function () {
                                  return (
                                    (A = n.id),
                                    u(A),
                                    void G(
                                      "Are you sure you want to delete this export record? This action cannot be undone.",
                                      "Confirm Delete",
                                    )
                                  );
                                  var A;
                                },
                                variant: "ghost",
                                colorScheme: "red",
                                isDisabled: J.isScraping,
                              }),
                            ),
                          ),
                        );
                      }),
                ),
              ),
            ),
            r.createElement(
              B.s,
              {
                justifyContent: "space-between",
                alignItems: "center",
                mt: 4,
                mb: 2,
                px: 2,
              },
              r.createElement(
                l.E,
                { fontSize: "2xs", color: "gray.500" },
                "Only the latest ",
                J.IndexedDB_MAX_RECORD_COUNT,
                " export records are saved. All records are saved locally.",
              ),
              r.createElement(
                Rn.z,
                { spacing: 2 },
                r.createElement(
                  d.$,
                  {
                    size: "xs",
                    onClick: function () {
                      return C(c - 1);
                    },
                    isDisabled: 1 === c,
                    leftIcon: r.createElement(QA._Jj, null),
                  },
                  "Prev",
                ),
                r.createElement(l.E, { fontSize: "xs" }, "Page ", c, " of ", H),
                r.createElement(
                  d.$,
                  {
                    size: "xs",
                    onClick: function () {
                      return C(c + 1);
                    },
                    isDisabled: c === H || 0 === H,
                    rightIcon: r.createElement(QA.X6T, null),
                  },
                  "Next",
                ),
              ),
            ),
          );
        });
        function Zn(A) {
          return (
            (Zn =
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
            Zn(A)
          );
        }
        function At() {
          At = function () {
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
          function l(A, n, t) {
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
            l({}, "");
          } catch (A) {
            l = function (A, n, t) {
              return (A[n] = t);
            };
          }
          function d(A, n, t, r) {
            var o = n && n.prototype instanceof w ? n : w,
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
          n.wrap = d;
          var p = "suspendedStart",
            g = "suspendedYield",
            u = "executing",
            m = "completed",
            b = {};
          function w() {}
          function f() {}
          function E() {}
          var y = {};
          l(y, a, function () {
            return this;
          });
          var B = Object.getPrototypeOf,
            h = B && B(B(T([])));
          h && h !== t && r.call(h, a) && (y = h);
          var v = (E.prototype = w.prototype = Object.create(y));
          function x(A) {
            ["next", "throw", "return"].forEach(function (n) {
              l(A, n, function (A) {
                return this._invoke(n, A);
              });
            });
          }
          function k(A, n) {
            function t(e, o, a, i) {
              var c = s(A[e], A, o);
              if ("throw" !== c.type) {
                var l = c.arg,
                  d = l.value;
                return d && "object" == Zn(d) && r.call(d, "__await")
                  ? n.resolve(d.__await).then(
                      function (A) {
                        t("next", A, a, i);
                      },
                      function (A) {
                        t("throw", A, a, i);
                      },
                    )
                  : n.resolve(d).then(
                      function (A) {
                        ((l.value = A), a(l));
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
            var e = p;
            return function (o, a) {
              if (e === u) throw new Error("Generator is already running");
              if (e === m) {
                if ("throw" === o) throw a;
                return { value: A, done: !0 };
              }
              for (r.method = o, r.arg = a; ; ) {
                var i = r.delegate;
                if (i) {
                  var c = H(i, r);
                  if (c) {
                    if (c === b) continue;
                    return c;
                  }
                }
                if ("next" === r.method) r.sent = r._sent = r.arg;
                else if ("throw" === r.method) {
                  if (e === p) throw ((e = m), r.arg);
                  r.dispatchException(r.arg);
                } else "return" === r.method && r.abrupt("return", r.arg);
                e = u;
                var l = s(n, t, r);
                if ("normal" === l.type) {
                  if (((e = r.done ? m : g), l.arg === b)) continue;
                  return { value: l.arg, done: r.done };
                }
                "throw" === l.type &&
                  ((e = m), (r.method = "throw"), (r.arg = l.arg));
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
                b
              );
            var o = s(e, n.iterator, t.arg);
            if ("throw" === o.type)
              return (
                (t.method = "throw"),
                (t.arg = o.arg),
                (t.delegate = null),
                b
              );
            var a = o.arg;
            return a
              ? a.done
                ? ((t[n.resultName] = a.value),
                  (t.next = n.nextLoc),
                  "return" !== t.method && ((t.method = "next"), (t.arg = A)),
                  (t.delegate = null),
                  b)
                : a
              : ((t.method = "throw"),
                (t.arg = new TypeError("iterator result is not an object")),
                (t.delegate = null),
                b);
          }
          function S(A) {
            var n = { tryLoc: A[0] };
            (1 in A && (n.catchLoc = A[1]),
              2 in A && ((n.finallyLoc = A[2]), (n.afterLoc = A[3])),
              this.tryEntries.push(n));
          }
          function I(A) {
            var n = A.completion || {};
            ((n.type = "normal"), delete n.arg, (A.completion = n));
          }
          function L(A) {
            ((this.tryEntries = [{ tryLoc: "root" }]),
              A.forEach(S, this),
              this.reset(!0));
          }
          function T(n) {
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
            throw new TypeError(Zn(n) + " is not iterable");
          }
          return (
            (f.prototype = E),
            e(v, "constructor", { value: E, configurable: !0 }),
            e(E, "constructor", { value: f, configurable: !0 }),
            (f.displayName = l(E, c, "GeneratorFunction")),
            (n.isGeneratorFunction = function (A) {
              var n = "function" == typeof A && A.constructor;
              return (
                !!n &&
                (n === f || "GeneratorFunction" === (n.displayName || n.name))
              );
            }),
            (n.mark = function (A) {
              return (
                Object.setPrototypeOf
                  ? Object.setPrototypeOf(A, E)
                  : ((A.__proto__ = E), l(A, c, "GeneratorFunction")),
                (A.prototype = Object.create(v)),
                A
              );
            }),
            (n.awrap = function (A) {
              return { __await: A };
            }),
            x(k.prototype),
            l(k.prototype, i, function () {
              return this;
            }),
            (n.AsyncIterator = k),
            (n.async = function (A, t, r, e, o) {
              void 0 === o && (o = Promise);
              var a = new k(d(A, t, r, e), o);
              return n.isGeneratorFunction(t)
                ? a
                : a.next().then(function (A) {
                    return A.done ? A.value : a.next();
                  });
            }),
            x(v),
            l(v, c, "Generator"),
            l(v, a, function () {
              return this;
            }),
            l(v, "toString", function () {
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
            (n.values = T),
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
                  this.tryEntries.forEach(I),
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
                      l = r.call(a, "finallyLoc");
                    if (c && l) {
                      if (this.prev < a.catchLoc) return e(a.catchLoc, !0);
                      if (this.prev < a.finallyLoc) return e(a.finallyLoc);
                    } else if (c) {
                      if (this.prev < a.catchLoc) return e(a.catchLoc, !0);
                    } else {
                      if (!l)
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
                    ? ((this.method = "next"), (this.next = o.finallyLoc), b)
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
                  b
                );
              },
              finish: function (A) {
                for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                  var t = this.tryEntries[n];
                  if (t.finallyLoc === A)
                    return (this.complete(t.completion, t.afterLoc), I(t), b);
                }
              },
              catch: function (A) {
                for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                  var t = this.tryEntries[n];
                  if (t.tryLoc === A) {
                    var r = t.completion;
                    if ("throw" === r.type) {
                      var e = r.arg;
                      I(t);
                    }
                    return e;
                  }
                }
                throw new Error("illegal catch attempt");
              },
              delegateYield: function (n, t, r) {
                return (
                  (this.delegate = {
                    iterator: T(n),
                    resultName: t,
                    nextLoc: r,
                  }),
                  "next" === this.method && (this.arg = A),
                  b
                );
              },
            }),
            n
          );
        }
        function nt(A, n) {
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
        function tt(A) {
          for (var n = 1; n < arguments.length; n++) {
            var t = null != arguments[n] ? arguments[n] : {};
            n % 2
              ? nt(Object(t), !0).forEach(function (n) {
                  rt(A, n, t[n]);
                })
              : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    A,
                    Object.getOwnPropertyDescriptors(t),
                  )
                : nt(Object(t)).forEach(function (n) {
                    Object.defineProperty(
                      A,
                      n,
                      Object.getOwnPropertyDescriptor(t, n),
                    );
                  });
          }
          return A;
        }
        function rt(A, n, t) {
          var r;
          return (
            (r = (function (A, n) {
              if ("object" != Zn(A) || !A) return A;
              var t = A[Symbol.toPrimitive];
              if (void 0 !== t) {
                var r = t.call(A, n || "default");
                if ("object" != Zn(r)) return r;
                throw new TypeError(
                  "@@toPrimitive must return a primitive value.",
                );
              }
              return ("string" === n ? String : Number)(A);
            })(n, "string")),
            (n = "symbol" == Zn(r) ? r : String(r)) in A
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
        function et(A, n, t, r, e, o, a) {
          try {
            var i = A[o](a),
              c = i.value;
          } catch (A) {
            return void t(A);
          }
          i.done ? n(c) : Promise.resolve(c).then(r, e);
        }
        function ot(A, n) {
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
                  l = !1;
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
                  ((l = !0), (e = A));
                } finally {
                  try {
                    if (
                      !c &&
                      null != t.return &&
                      ((a = t.return()), Object(a) !== a)
                    )
                      return;
                  } finally {
                    if (l) throw e;
                  }
                }
                return i;
              }
            })(A, n) ||
            (function (A, n) {
              if (!A) return;
              if ("string" == typeof A) return at(A, n);
              var t = Object.prototype.toString.call(A).slice(8, -1);
              "Object" === t && A.constructor && (t = A.constructor.name);
              if ("Map" === t || "Set" === t) return Array.from(A);
              if (
                "Arguments" === t ||
                /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
              )
                return at(A, n);
            })(A, n) ||
            (function () {
              throw new TypeError(
                "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
              );
            })()
          );
        }
        function at(A, n) {
          (null == n || n > A.length) && (n = A.length);
          for (var t = 0, r = new Array(n); t < n; t++) r[t] = A[t];
          return r;
        }
        const it = (0, OA.PA)(function () {
          var A,
            n = ot((0, r.useState)("LOGINING"), 2),
            t = n[0],
            e = n[1],
            o = (0, a.d)(),
            v = "LOGIN" !== t,
            x = ot((0, r.useState)(0), 2),
            k = x[0],
            G = x[1],
            H = 3 === k ? "800px" : "550px";
          ((0, r.useEffect)(function () {
            var A = rA.onAuthStateChanged(
              (function () {
                var A,
                  n =
                    ((A = At().mark(function A(n) {
                      var t, r;
                      return At().wrap(
                        function (A) {
                          for (;;)
                            switch ((A.prev = A.next)) {
                              case 0:
                                if (!n) {
                                  A.next = 21;
                                  break;
                                }
                                return (e("LOGIN"), (A.next = 5), SA(n));
                              case 5:
                                if (!(t = A.sent)) {
                                  A.next = 19;
                                  break;
                                }
                                return ((A.prev = 8), (A.next = 11), gA());
                              case 11:
                                ((r = A.sent) &&
                                  r.get_distinct_id() !== n.uid &&
                                  r.identify(n.uid, {
                                    email: n.email,
                                    email_uid: ""
                                      .concat(n.email, "_")
                                      .concat(n.uid),
                                    userLevel: t.userLevel || "free",
                                  }),
                                  (A.next = 18));
                                break;
                              case 15:
                                ((A.prev = 15), (A.t0 = A.catch(8)));
                              case 18:
                                BA.updateUserInfo(
                                  tt(tt({}, t), {}, { state: "LOGIN" }),
                                );
                              case 19:
                                A.next = 23;
                                break;
                              case 21:
                                e("LOGIN"); BA.updateUserInfo({ state: "LOGIN", userLevel: "ultra", proStatus: "active", minutes: 9999999, paygoMinutes: 9999999, totalMinutes: 9999999 });
                              case 23:
                              case "end":
                                return A.stop();
                            }
                        },
                        A,
                        null,
                        [[8, 15]],
                      );
                    })),
                    function () {
                      var n = this,
                        t = arguments;
                      return new Promise(function (r, e) {
                        var o = A.apply(n, t);
                        function a(A) {
                          et(o, r, e, a, i, "next", A);
                        }
                        function i(A) {
                          et(o, r, e, a, i, "throw", A);
                        }
                        a(void 0);
                      });
                    });
                return function (A) {
                  return n.apply(this, arguments);
                };
              })(),
            );
            return function () {
              A();
            };
          }, []),
            (0, r.useEffect)(function () {
              return (
                (function () {
                  var A,
                    n =
                      arguments.length > 0 && void 0 !== arguments[0]
                        ? arguments[0]
                        : function () {},
                    t =
                      arguments.length > 1 && void 0 !== arguments[1]
                        ? arguments[1]
                        : function () {},
                    r = (0, Y.KR)(eA, ".info/connected");
                  (0, Y.Zy)(r, function (r) {
                    !0 === r.val()
                      ? (t(), A && clearInterval(A))
                      : ((A = setInterval(function () {
                          for (var A = 0; A < localStorage.length; A++)
                            localStorage.key(A);
                          localStorage.getItem(
                            "firebase:previous_websocket_failure",
                          ) &&
                            localStorage.removeItem(
                              "firebase:previous_websocket_failure",
                            );
                        }, 3e3)),
                        n());
                  });
                })(
                  function () {},
                  function () {},
                ),
                function () {
                  var A;
                  ((A = (0, Y.KR)(eA, ".info/connected")), (0, Y.AU)(A));
                }
              );
            }, []));
          var S = ot((0, r.useState)(!1), 2),
            I = S[0],
            L = S[1],
            T = function () {
              if ("free" !== BA.userInfo.userLevel || BA.userInfo.customerId) {
                L(!0);
                var A = tt(
                  tt({ customerId: BA.userInfo.customerId }, BA.userInfo),
                  {},
                  { productName: J.checkoutName, isTestMode: !1 },
                );
                fetch(
                  "https://us-central1-easyhighlight-7d4e5.cloudfunctions.net/getStripeCustomerPortalUrl",
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(A),
                  },
                )
                  .then(function (A) {
                    if (!A.ok) {
                      try {
                        chrome.tabs.create({
                          url: J.configs.customerPortalUrl,
                        });
                      } catch (A) {}
                      return null;
                    }
                    return A.text();
                  })
                  .then(function (A) {
                    (L(!1),
                      A &&
                        A.includes("http") &&
                        chrome.tabs.create({ url: A }));
                  })
                  .catch(function () {
                    L(!1);
                  });
              } else
                o({
                  duration: 5e3,
                  isClosable: !0,
                  position: "top",
                  render: function (A) {
                    var n = A.onClose;
                    return r.createElement(
                      i.az,
                      {
                        color: "white",
                        p: 4,
                        bg: "linear-gradient(135deg, #1DA1F2 0%, #0d8ecf 100%)",
                        borderRadius: "lg",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      },
                      r.createElement(
                        c.B,
                        { spacing: 3 },
                        r.createElement(
                          l.E,
                          { fontWeight: "bold", fontSize: "lg" },
                          "No Subscription Found",
                        ),
                        r.createElement(
                          l.E,
                          null,
                          "You don't have any subscription yet. Upgrade to manage subscription!",
                        ),
                        r.createElement(
                          d.$,
                          {
                            bg: "white",
                            color: "#1DA1F2",
                            size: "sm",
                            onClick: function () {
                              (hA(), n());
                            },
                            _hover: { bg: "gray.100" },
                          },
                          "Upgrade",
                        ),
                      ),
                    );
                  },
                });
            };
          return r.createElement(
            i.az,
            { w: H, h: "500px", p: 0, color: "white" },
            r.createElement(
              s.x,
              {
                templateAreas:
                  '"header"\n                  "main"\n                  "footer"',
                gridTemplateRows: "55px 1fr 40px",
                gridTemplateColumns: "1fr",
                h: "100%",
                gap: "1",
                color: "blackAlpha.700",
                fontWeight: "bold",
              },
              r.createElement(
                p.E,
                { area: "header" },
                r.createElement(tn, null),
              ),
              r.createElement(
                p.E,
                { pl: "1", pt: "3", area: "main" },
                "LOGIN" ===
                  (null == BA || null === (A = BA.userInfo) || void 0 === A
                    ? void 0
                    : A.state) &&
                  (function () {
                    var A = BA.userInfo.userLevel,
                      n = (BA.userInfo.proStatus || "").toLowerCase(),
                      t = BA.userInfo.paygoMinutes > 0;
                    if (
                      !!(
                        ("pro" !== A &&
                          "starter" !== A &&
                          "power" !== A &&
                          "ultra" !== A &&
                          "plus" !== A &&
                          "custom" !== A &&
                          "business" !== A &&
                          "enterprise" !== A) ||
                        ("past_due" !== n && "unpaid" !== n)
                      )
                    )
                      return null;
                    var e = n.replace("_", " ");
                    return r.createElement(
                      g.F,
                      {
                        status: "warning",
                        variant: "subtle",
                        borderRadius: "md",
                        boxShadow: "sm",
                        bgGradient: "linear(to-r, yellow.50, yellow.100)",
                        border: "1px solid",
                        borderColor: "yellow.200",
                        alignItems: "center",
                        mb: 2,
                        py: 2,
                      },
                      r.createElement(u._, { mr: 2 }),
                      r.createElement(
                        i.az,
                        { flex: "1" },
                        r.createElement(
                          m.T,
                          { fontSize: "sm", color: "yellow.900" },
                          "Your subscription is ",
                          e,
                          ". Please pay or update your payment method.",
                          " ",
                          t
                            ? "Your extra lifetime minutes are still  available."
                            : "",
                        ),
                      ),
                      r.createElement(
                        d.$,
                        {
                          size: "sm",
                          colorScheme: "yellow",
                          variant: "solid",
                          leftIcon: r.createElement(hn.lZI, null),
                          isLoading: I,
                          onClick: T,
                        },
                        "Manage Billing",
                      ),
                    );
                  })(),
                r.createElement(
                  b.t,
                  {
                    index: k,
                    onChange: function (A) {
                      G(A);
                    },
                    isFitted: !0,
                    variant: "soft-rounded",
                    colorScheme: "green",
                  },
                  r.createElement(
                    w.w,
                    { mb: "1em" },
                    r.createElement(f.o, { isDisabled: v }, "Home"),
                    r.createElement(f.o, { isDisabled: v }, "Account"),
                  ),
                  r.createElement(
                    E.T,
                    null,
                    r.createElement(
                      y.K,
                      null,
                      "LOGINING" === t &&
                        r.createElement(
                          B.s,
                          {
                            mt: "110px",
                            h: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                          },
                          r.createElement(h.y, { size: "lg" }),
                        ),
                      "LOGIN" === t && r.createElement(JA, null),
                      "NOTLOGIN" === t && r.createElement(CA, null),
                    ),
                    r.createElement(
                      y.K,
                      null,
                      r.createElement(zn, { setSelectedTabIndex: G }),
                    ),
                  ),
                ),
              ),
              r.createElement(
                p.E,
                { area: "footer" },
                r.createElement(Gn, null),
              ),
            ),
          );
        });
        gA();
        var ct = r.createElement(e.s, null, r.createElement(it, null)),
          lt = document.createElement("div");
        (document.body.appendChild(lt), (0, o.createRoot)(lt).render(ct));
      },
      7761: (A, n, t) => {
        t.d(n, { A: () => x });
        var r = t(2977),
          e = t.n(r),
          o = t(9655),
          a = t.n(o),
          i = t(1038),
          c = t.n(i),
          l = new URL(t(960), t.b),
          d = new URL(t(2031), t.b),
          s = new URL(t(5270), t.b),
          p = new URL(t(3569), t.b),
          g = new URL(t(2208), t.b),
          u = new URL(t(220), t.b),
          m = new URL(t(6749), t.b),
          b = a()(e()),
          w = c()(l),
          f = c()(d),
          E = c()(s),
          y = c()(p),
          B = c()(g),
          h = c()(u),
          v = c()(m);
        b.push([
          A.id,
          `/*\n! tailwindcss v3.4.1 | MIT License | https://tailwindcss.com\n*//*\n1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)\n2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)\n*/\n\n*,\n::before,\n::after {\n  box-sizing: border-box; /* 1 */\n  border-width: 0; /* 2 */\n  border-style: solid; /* 2 */\n  border-color: #E5E7EB; /* 2 */\n}\n\n::before,\n::after {\n  --tw-content: '';\n}\n\n/*\n1. Use a consistent sensible line-height in all browsers.\n2. Prevent adjustments of font size after orientation changes in iOS.\n3. Use a more readable tab size.\n4. Use the user's configured \`sans\` font-family by default.\n5. Use the user's configured \`sans\` font-feature-settings by default.\n6. Use the user's configured \`sans\` font-variation-settings by default.\n7. Disable tap highlights on iOS\n*/\n\nhtml,\n:host {\n  line-height: 1.5; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n  -moz-tab-size: 4; /* 3 */\n  -o-tab-size: 4;\n     tab-size: 4; /* 3 */\n  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; /* 4 */\n  font-feature-settings: normal; /* 5 */\n  font-variation-settings: normal; /* 6 */\n  -webkit-tap-highlight-color: transparent; /* 7 */\n}\n\n/*\n1. Remove the margin in all browsers.\n2. Inherit line-height from \`html\` so users can set them as a class directly on the \`html\` element.\n*/\n\nbody {\n  margin: 0; /* 1 */\n  line-height: inherit; /* 2 */\n}\n\n/*\n1. Add the correct height in Firefox.\n2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)\n3. Ensure horizontal rules are visible by default.\n*/\n\nhr {\n  height: 0; /* 1 */\n  color: inherit; /* 2 */\n  border-top-width: 1px; /* 3 */\n}\n\n/*\nAdd the correct text decoration in Chrome, Edge, and Safari.\n*/\n\nabbr:where([title]) {\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted;\n}\n\n/*\nRemove the default font size and weight for headings.\n*/\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: inherit;\n  font-weight: inherit;\n}\n\n/*\nReset links to optimize for opt-in styling instead of opt-out.\n*/\n\na {\n  color: inherit;\n  text-decoration: inherit;\n}\n\n/*\nAdd the correct font weight in Edge and Safari.\n*/\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/*\n1. Use the user's configured \`mono\` font-family by default.\n2. Use the user's configured \`mono\` font-feature-settings by default.\n3. Use the user's configured \`mono\` font-variation-settings by default.\n4. Correct the odd \`em\` font sizing in all browsers.\n*/\n\ncode,\nkbd,\nsamp,\npre {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; /* 1 */\n  font-feature-settings: normal; /* 2 */\n  font-variation-settings: normal; /* 3 */\n  font-size: 1em; /* 4 */\n}\n\n/*\nAdd the correct font size in all browsers.\n*/\n\nsmall {\n  font-size: 80%;\n}\n\n/*\nPrevent \`sub\` and \`sup\` elements from affecting the line height in all browsers.\n*/\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/*\n1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)\n2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)\n3. Remove gaps between table borders by default.\n*/\n\ntable {\n  text-indent: 0; /* 1 */\n  border-color: inherit; /* 2 */\n  border-collapse: collapse; /* 3 */\n}\n\n/*\n1. Change the font styles in all browsers.\n2. Remove the margin in Firefox and Safari.\n3. Remove default padding in all browsers.\n*/\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-feature-settings: inherit; /* 1 */\n  font-variation-settings: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  font-weight: inherit; /* 1 */\n  line-height: inherit; /* 1 */\n  color: inherit; /* 1 */\n  margin: 0; /* 2 */\n  padding: 0; /* 3 */\n}\n\n/*\nRemove the inheritance of text transform in Edge and Firefox.\n*/\n\nbutton,\nselect {\n  text-transform: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Remove default button styles.\n*/\n\nbutton,\n[type='button'],\n[type='reset'],\n[type='submit'] {\n  -webkit-appearance: button; /* 1 */\n  background-color: transparent; /* 2 */\n  background-image: none; /* 2 */\n}\n\n/*\nUse the modern Firefox focus style for all focusable elements.\n*/\n\n:-moz-focusring {\n  outline: auto;\n}\n\n/*\nRemove the additional \`:invalid\` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)\n*/\n\n:-moz-ui-invalid {\n  box-shadow: none;\n}\n\n/*\nAdd the correct vertical alignment in Chrome and Firefox.\n*/\n\nprogress {\n  vertical-align: baseline;\n}\n\n/*\nCorrect the cursor style of increment and decrement buttons in Safari.\n*/\n\n::-webkit-inner-spin-button,\n::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/*\n1. Correct the odd appearance in Chrome and Safari.\n2. Correct the outline style in Safari.\n*/\n\n[type='search'] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/*\nRemove the inner padding in Chrome and Safari on macOS.\n*/\n\n::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Change font properties to \`inherit\` in Safari.\n*/\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/*\nAdd the correct display in Chrome and Safari.\n*/\n\nsummary {\n  display: list-item;\n}\n\n/*\nRemoves the default spacing and border for appropriate elements.\n*/\n\nblockquote,\ndl,\ndd,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\nfigure,\np,\npre {\n  margin: 0;\n}\n\nfieldset {\n  margin: 0;\n  padding: 0;\n}\n\nlegend {\n  padding: 0;\n}\n\nol,\nul,\nmenu {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n/*\nReset default styling for dialogs.\n*/\ndialog {\n  padding: 0;\n}\n\n/*\nPrevent resizing textareas horizontally by default.\n*/\n\ntextarea {\n  resize: vertical;\n}\n\n/*\n1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)\n2. Set the default placeholder color to the user's configured gray 400 color.\n*/\n\ninput::-moz-placeholder, textarea::-moz-placeholder {\n  opacity: 1; /* 1 */\n  color: #9CA3AF; /* 2 */\n}\n\ninput::placeholder,\ntextarea::placeholder {\n  opacity: 1; /* 1 */\n  color: #9CA3AF; /* 2 */\n}\n\n/*\nSet the default cursor for buttons.\n*/\n\nbutton,\n[role="button"] {\n  cursor: pointer;\n}\n\n/*\nMake sure disabled buttons don't get the pointer cursor.\n*/\n:disabled {\n  cursor: default;\n}\n\n/*\n1. Make replaced elements \`display: block\` by default. (https://github.com/mozdevs/cssremedy/issues/14)\n2. Add \`vertical-align: middle\` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)\n   This can trigger a poorly considered lint error in some tools but is included by design.\n*/\n\nimg,\nsvg,\nvideo,\ncanvas,\naudio,\niframe,\nembed,\nobject {\n  display: block; /* 1 */\n  vertical-align: middle; /* 2 */\n}\n\n/*\nConstrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)\n*/\n\nimg,\nvideo {\n  max-width: 100%;\n  height: auto;\n}\n\n/* Make elements with the HTML hidden attribute stay hidden by default */\n[hidden] {\n  display: none;\n}\n\n[type='text'],input:where(:not([type])),[type='email'],[type='url'],[type='password'],[type='number'],[type='date'],[type='datetime-local'],[type='month'],[type='search'],[type='tel'],[type='time'],[type='week'],[multiple],textarea,select {\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none;\n  background-color: #fff;\n  border-color: #6B7280;\n  border-width: 1px;\n  border-radius: 0px;\n  padding-top: 0.5rem;\n  padding-right: 0.75rem;\n  padding-bottom: 0.5rem;\n  padding-left: 0.75rem;\n  font-size: 1rem;\n  line-height: 1.5rem;\n  --tw-shadow: 0 0 #0000;\n}\n\n[type='text']:focus, input:where(:not([type])):focus, [type='email']:focus, [type='url']:focus, [type='password']:focus, [type='number']:focus, [type='date']:focus, [type='datetime-local']:focus, [type='month']:focus, [type='search']:focus, [type='tel']:focus, [type='time']:focus, [type='week']:focus, [multiple]:focus, textarea:focus, select:focus {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n  --tw-ring-inset: var(--tw-empty,/*!*/ /*!*/);\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: #1C64F2;\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);\n  border-color: #1C64F2;\n}\n\ninput::-moz-placeholder, textarea::-moz-placeholder {\n  color: #6B7280;\n  opacity: 1;\n}\n\ninput::placeholder,textarea::placeholder {\n  color: #6B7280;\n  opacity: 1;\n}\n\n::-webkit-datetime-edit-fields-wrapper {\n  padding: 0;\n}\n\n::-webkit-date-and-time-value {\n  min-height: 1.5em;\n  text-align: inherit;\n}\n\n::-webkit-datetime-edit {\n  display: inline-flex;\n}\n\n::-webkit-datetime-edit,::-webkit-datetime-edit-year-field,::-webkit-datetime-edit-month-field,::-webkit-datetime-edit-day-field,::-webkit-datetime-edit-hour-field,::-webkit-datetime-edit-minute-field,::-webkit-datetime-edit-second-field,::-webkit-datetime-edit-millisecond-field,::-webkit-datetime-edit-meridiem-field {\n  padding-top: 0;\n  padding-bottom: 0;\n}\n\nselect {\n  background-image: url(${w});\n  background-position: right 0.5rem center;\n  background-repeat: no-repeat;\n  background-size: 1.5em 1.5em;\n  padding-right: 2.5rem;\n  -webkit-print-color-adjust: exact;\n          print-color-adjust: exact;\n}\n\n[multiple],[size]:where(select:not([size="1"])) {\n  background-image: initial;\n  background-position: initial;\n  background-repeat: unset;\n  background-size: initial;\n  padding-right: 0.75rem;\n  -webkit-print-color-adjust: unset;\n          print-color-adjust: unset;\n}\n\n[type='checkbox'],[type='radio'] {\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none;\n  padding: 0;\n  -webkit-print-color-adjust: exact;\n          print-color-adjust: exact;\n  display: inline-block;\n  vertical-align: middle;\n  background-origin: border-box;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n          user-select: none;\n  flex-shrink: 0;\n  height: 1rem;\n  width: 1rem;\n  color: #1C64F2;\n  background-color: #fff;\n  border-color: #6B7280;\n  border-width: 1px;\n  --tw-shadow: 0 0 #0000;\n}\n\n[type='checkbox'] {\n  border-radius: 0px;\n}\n\n[type='radio'] {\n  border-radius: 100%;\n}\n\n[type='checkbox']:focus,[type='radio']:focus {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n  --tw-ring-inset: var(--tw-empty,/*!*/ /*!*/);\n  --tw-ring-offset-width: 2px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: #1C64F2;\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);\n}\n\n[type='checkbox']:checked,[type='radio']:checked {\n  border-color: transparent;\n  background-color: currentColor;\n  background-size: 100% 100%;\n  background-position: center;\n  background-repeat: no-repeat;\n}\n\n[type='checkbox']:checked {\n  background-image: url(${f});\n}\n\n@media (forced-colors: active)  {\n\n  [type='checkbox']:checked {\n    -webkit-appearance: auto;\n       -moz-appearance: auto;\n            appearance: auto;\n  }\n}\n\n[type='radio']:checked {\n  background-image: url(${E});\n}\n\n@media (forced-colors: active)  {\n\n  [type='radio']:checked {\n    -webkit-appearance: auto;\n       -moz-appearance: auto;\n            appearance: auto;\n  }\n}\n\n[type='checkbox']:checked:hover,[type='checkbox']:checked:focus,[type='radio']:checked:hover,[type='radio']:checked:focus {\n  border-color: transparent;\n  background-color: currentColor;\n}\n\n[type='checkbox']:indeterminate {\n  background-image: url(${y});\n  border-color: transparent;\n  background-color: currentColor;\n  background-size: 100% 100%;\n  background-position: center;\n  background-repeat: no-repeat;\n}\n\n@media (forced-colors: active)  {\n\n  [type='checkbox']:indeterminate {\n    -webkit-appearance: auto;\n       -moz-appearance: auto;\n            appearance: auto;\n  }\n}\n\n[type='checkbox']:indeterminate:hover,[type='checkbox']:indeterminate:focus {\n  border-color: transparent;\n  background-color: currentColor;\n}\n\n[type='file'] {\n  background: unset;\n  border-color: inherit;\n  border-width: 0;\n  border-radius: 0;\n  padding: 0;\n  font-size: unset;\n  line-height: inherit;\n}\n\n[type='file']:focus {\n  outline: 1px solid ButtonText;\n  outline: 1px auto -webkit-focus-ring-color;\n}\n\n[data-tooltip-style^='light'] + .tooltip > .tooltip-arrow:before {\n  border-style: solid;\n  border-color: #e5e7eb;\n}\n\n[data-tooltip-style^='light'] + .tooltip[data-popper-placement^='top'] > .tooltip-arrow:before {\n  border-bottom-width: 1px;\n  border-right-width: 1px;\n}\n\n[data-tooltip-style^='light'] + .tooltip[data-popper-placement^='right'] > .tooltip-arrow:before {\n  border-bottom-width: 1px;\n  border-left-width: 1px;\n}\n\n[data-tooltip-style^='light'] + .tooltip[data-popper-placement^='bottom'] > .tooltip-arrow:before {\n  border-top-width: 1px;\n  border-left-width: 1px;\n}\n\n[data-tooltip-style^='light'] + .tooltip[data-popper-placement^='left'] > .tooltip-arrow:before {\n  border-top-width: 1px;\n  border-right-width: 1px;\n}\n\n.tooltip[data-popper-placement^='top'] > .tooltip-arrow {\n  bottom: -4px;\n}\n\n.tooltip[data-popper-placement^='bottom'] > .tooltip-arrow {\n  top: -4px;\n}\n\n.tooltip[data-popper-placement^='left'] > .tooltip-arrow {\n  right: -4px;\n}\n\n.tooltip[data-popper-placement^='right'] > .tooltip-arrow {\n  left: -4px;\n}\n\n.tooltip.invisible > .tooltip-arrow:before {\n  visibility: hidden;\n}\n\n[data-popper-arrow],[data-popper-arrow]:before {\n  position: absolute;\n  width: 8px;\n  height: 8px;\n  background: inherit;\n}\n\n[data-popper-arrow] {\n  visibility: hidden;\n}\n\n[data-popper-arrow]:before {\n  content: "";\n  visibility: visible;\n  transform: rotate(45deg);\n}\n\n[data-popper-arrow]:after {\n  content: "";\n  visibility: visible;\n  transform: rotate(45deg);\n  position: absolute;\n  width: 9px;\n  height: 9px;\n  background: inherit;\n}\n\n[role="tooltip"] > [data-popper-arrow]:before {\n  border-style: solid;\n  border-color: #e5e7eb;\n}\n\n.dark [role="tooltip"] > [data-popper-arrow]:before {\n  border-style: solid;\n  border-color: #4b5563;\n}\n\n[role="tooltip"] > [data-popper-arrow]:after {\n  border-style: solid;\n  border-color: #e5e7eb;\n}\n\n.dark [role="tooltip"] > [data-popper-arrow]:after {\n  border-style: solid;\n  border-color: #4b5563;\n}\n\n[data-popover][role="tooltip"][data-popper-placement^='top'] > [data-popper-arrow]:before {\n  border-bottom-width: 1px;\n  border-right-width: 1px;\n}\n\n[data-popover][role="tooltip"][data-popper-placement^='top'] > [data-popper-arrow]:after {\n  border-bottom-width: 1px;\n  border-right-width: 1px;\n}\n\n[data-popover][role="tooltip"][data-popper-placement^='right'] > [data-popper-arrow]:before {\n  border-bottom-width: 1px;\n  border-left-width: 1px;\n}\n\n[data-popover][role="tooltip"][data-popper-placement^='right'] > [data-popper-arrow]:after {\n  border-bottom-width: 1px;\n  border-left-width: 1px;\n}\n\n[data-popover][role="tooltip"][data-popper-placement^='bottom'] > [data-popper-arrow]:before {\n  border-top-width: 1px;\n  border-left-width: 1px;\n}\n\n[data-popover][role="tooltip"][data-popper-placement^='bottom'] > [data-popper-arrow]:after {\n  border-top-width: 1px;\n  border-left-width: 1px;\n}\n\n[data-popover][role="tooltip"][data-popper-placement^='left'] > [data-popper-arrow]:before {\n  border-top-width: 1px;\n  border-right-width: 1px;\n}\n\n[data-popover][role="tooltip"][data-popper-placement^='left'] > [data-popper-arrow]:after {\n  border-top-width: 1px;\n  border-right-width: 1px;\n}\n\n[data-popover][role="tooltip"][data-popper-placement^='top'] > [data-popper-arrow] {\n  bottom: -5px;\n}\n\n[data-popover][role="tooltip"][data-popper-placement^='bottom'] > [data-popper-arrow] {\n  top: -5px;\n}\n\n[data-popover][role="tooltip"][data-popper-placement^='left'] > [data-popper-arrow] {\n  right: -5px;\n}\n\n[data-popover][role="tooltip"][data-popper-placement^='right'] > [data-popper-arrow] {\n  left: -5px;\n}\n\n[role="tooltip"].invisible > [data-popper-arrow]:before {\n  visibility: hidden;\n}\n\n[role="tooltip"].invisible > [data-popper-arrow]:after {\n  visibility: hidden;\n}\n\n[type='text'],[type='email'],[type='url'],[type='password'],[type='number'],[type='date'],[type='datetime-local'],[type='month'],[type='search'],[type='tel'],[type='time'],[type='week'],[multiple],textarea,select {\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none;\n  background-color: #fff;\n  border-color: #6B7280;\n  border-width: 1px;\n  border-radius: 0px;\n  padding-top: 0.5rem;\n  padding-right: 0.75rem;\n  padding-bottom: 0.5rem;\n  padding-left: 0.75rem;\n  font-size: 1rem;\n  line-height: 1.5rem;\n  --tw-shadow: 0 0 #0000;\n}\n\n[type='text']:focus, [type='email']:focus, [type='url']:focus, [type='password']:focus, [type='number']:focus, [type='date']:focus, [type='datetime-local']:focus, [type='month']:focus, [type='search']:focus, [type='tel']:focus, [type='time']:focus, [type='week']:focus, [multiple]:focus, textarea:focus, select:focus {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n  --tw-ring-inset: var(--tw-empty,/*!*/ /*!*/);\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: #1C64F2;\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);\n  border-color: #1C64F2;\n}\n\ninput::-moz-placeholder, textarea::-moz-placeholder {\n  color: #6B7280;\n  opacity: 1;\n}\n\ninput::placeholder,textarea::placeholder {\n  color: #6B7280;\n  opacity: 1;\n}\n\n::-webkit-datetime-edit-fields-wrapper {\n  padding: 0;\n}\n\ninput[type="time"]::-webkit-calendar-picker-indicator {\n  background: none;\n}\n\nselect:not([size]) {\n  background-image: url(${B});\n  background-position: right 0.75rem center;\n  background-repeat: no-repeat;\n  background-size: 0.75em 0.75em;\n  padding-right: 2.5rem;\n  -webkit-print-color-adjust: exact;\n          print-color-adjust: exact;\n}\n\n:is([dir=rtl]) select:not([size]) {\n  background-position: left 0.75rem center;\n  padding-right: 0.75rem;\n  padding-left: 0;\n}\n\n[multiple] {\n  background-image: initial;\n  background-position: initial;\n  background-repeat: unset;\n  background-size: initial;\n  padding-right: 0.75rem;\n  -webkit-print-color-adjust: unset;\n          print-color-adjust: unset;\n}\n\n[type='checkbox'],[type='radio'] {\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none;\n  padding: 0;\n  -webkit-print-color-adjust: exact;\n          print-color-adjust: exact;\n  display: inline-block;\n  vertical-align: middle;\n  background-origin: border-box;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n          user-select: none;\n  flex-shrink: 0;\n  height: 1rem;\n  width: 1rem;\n  color: #1C64F2;\n  background-color: #fff;\n  border-color: #6B7280;\n  border-width: 1px;\n  --tw-shadow: 0 0 #0000;\n}\n\n[type='checkbox'] {\n  border-radius: 0px;\n}\n\n[type='radio'] {\n  border-radius: 100%;\n}\n\n[type='checkbox']:focus,[type='radio']:focus {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n  --tw-ring-inset: var(--tw-empty,/*!*/ /*!*/);\n  --tw-ring-offset-width: 2px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: #1C64F2;\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);\n}\n\n[type='checkbox']:checked,[type='radio']:checked,.dark [type='checkbox']:checked,.dark [type='radio']:checked {\n  border-color: transparent;\n  background-color: currentColor;\n  background-size: 0.55em 0.55em;\n  background-position: center;\n  background-repeat: no-repeat;\n}\n\n[type='checkbox']:checked {\n  background-image: url(${h});\n  background-repeat: no-repeat;\n  background-size: 0.55em 0.55em;\n  -webkit-print-color-adjust: exact;\n          print-color-adjust: exact;\n}\n\n[type='radio']:checked {\n  background-image: url(${E});\n  background-size: 1em 1em;\n}\n\n.dark [type='radio']:checked {\n  background-image: url(${E});\n  background-size: 1em 1em;\n}\n\n[type='checkbox']:indeterminate {\n  background-image: url(${v});\n  background-color: currentColor;\n  border-color: transparent;\n  background-position: center;\n  background-repeat: no-repeat;\n  background-size: 0.55em 0.55em;\n  -webkit-print-color-adjust: exact;\n          print-color-adjust: exact;\n}\n\n[type='checkbox']:indeterminate:hover,[type='checkbox']:indeterminate:focus {\n  border-color: transparent;\n  background-color: currentColor;\n}\n\n[type='file'] {\n  background: unset;\n  border-color: inherit;\n  border-width: 0;\n  border-radius: 0;\n  padding: 0;\n  font-size: unset;\n  line-height: inherit;\n}\n\n[type='file']:focus {\n  outline: 1px auto inherit;\n}\n\ninput[type=file]::file-selector-button {\n  color: white;\n  background: #1F2937;\n  border: 0;\n  font-weight: 500;\n  font-size: 0.875rem;\n  cursor: pointer;\n  padding-top: 0.625rem;\n  padding-bottom: 0.625rem;\n  padding-left: 2rem;\n  padding-right: 1rem;\n  margin-inline-start: -1rem;\n  margin-inline-end: 1rem;\n}\n\ninput[type=file]::file-selector-button:hover {\n  background: #374151;\n}\n\n:is([dir=rtl]) input[type=file]::file-selector-button {\n  padding-right: 2rem;\n  padding-left: 1rem;\n}\n\n.dark input[type=file]::file-selector-button {\n  color: white;\n  background: #4B5563;\n}\n\n.dark input[type=file]::file-selector-button:hover {\n  background: #6B7280;\n}\n\ninput[type="range"]::-webkit-slider-thumb {\n  height: 1.25rem;\n  width: 1.25rem;\n  background: #1C64F2;\n  border-radius: 9999px;\n  border: 0;\n  appearance: none;\n  -moz-appearance: none;\n  -webkit-appearance: none;\n  cursor: pointer;\n}\n\ninput[type="range"]:disabled::-webkit-slider-thumb {\n  background: #9CA3AF;\n}\n\n.dark input[type="range"]:disabled::-webkit-slider-thumb {\n  background: #6B7280;\n}\n\ninput[type="range"]:focus::-webkit-slider-thumb {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n  --tw-ring-opacity: 1px;\n  --tw-ring-color: rgb(164 202 254 / var(--tw-ring-opacity));\n}\n\ninput[type="range"]::-moz-range-thumb {\n  height: 1.25rem;\n  width: 1.25rem;\n  background: #1C64F2;\n  border-radius: 9999px;\n  border: 0;\n  appearance: none;\n  -moz-appearance: none;\n  -webkit-appearance: none;\n  cursor: pointer;\n}\n\ninput[type="range"]:disabled::-moz-range-thumb {\n  background: #9CA3AF;\n}\n\n.dark input[type="range"]:disabled::-moz-range-thumb {\n  background: #6B7280;\n}\n\ninput[type="range"]::-moz-range-progress {\n  background: #3F83F8;\n}\n\ninput[type="range"]::-ms-fill-lower {\n  background: #3F83F8;\n}\n\n*, ::before, ::after {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-gradient-from-position:  ;\n  --tw-gradient-via-position:  ;\n  --tw-gradient-to-position:  ;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(63 131 248 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n}\n\n::backdrop {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-gradient-from-position:  ;\n  --tw-gradient-via-position:  ;\n  --tw-gradient-to-position:  ;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(63 131 248 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n}\n.\\!container {\n  width: 100% !important;\n}\n.container {\n  width: 100%;\n}\n@media (min-width: 640px) {\n\n  .\\!container {\n    max-width: 640px !important;\n  }\n\n  .container {\n    max-width: 640px;\n  }\n}\n@media (min-width: 768px) {\n\n  .\\!container {\n    max-width: 768px !important;\n  }\n\n  .container {\n    max-width: 768px;\n  }\n}\n@media (min-width: 1024px) {\n\n  .\\!container {\n    max-width: 1024px !important;\n  }\n\n  .container {\n    max-width: 1024px;\n  }\n}\n@media (min-width: 1280px) {\n\n  .\\!container {\n    max-width: 1280px !important;\n  }\n\n  .container {\n    max-width: 1280px;\n  }\n}\n@media (min-width: 1536px) {\n\n  .\\!container {\n    max-width: 1536px !important;\n  }\n\n  .container {\n    max-width: 1536px;\n  }\n}\n.sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border-width: 0;\n}\n.pointer-events-none {\n  pointer-events: none;\n}\n.visible {\n  visibility: visible;\n}\n.invisible {\n  visibility: hidden;\n}\n.collapse {\n  visibility: collapse;\n}\n.static {\n  position: static;\n}\n.fixed {\n  position: fixed;\n}\n.absolute {\n  position: absolute;\n}\n.relative {\n  position: relative;\n}\n.sticky {\n  position: sticky;\n}\n.inset-0 {\n  inset: 0px;\n}\n.inset-x-0 {\n  left: 0px;\n  right: 0px;\n}\n.inset-y-0 {\n  top: 0px;\n  bottom: 0px;\n}\n.-bottom-1 {\n  bottom: -0.25rem;\n}\n.-left-1 {\n  left: -0.25rem;\n}\n.-left-1\\.5 {\n  left: -0.375rem;\n}\n.-left-3 {\n  left: -0.75rem;\n}\n.-right-1 {\n  right: -0.25rem;\n}\n.-top-1 {\n  top: -0.25rem;\n}\n.bottom-5 {\n  bottom: 1.25rem;\n}\n.left-0 {\n  left: 0px;\n}\n.left-1 {\n  left: 0.25rem;\n}\n.left-1\\/2 {\n  left: 50%;\n}\n.left-2 {\n  left: 0.5rem;\n}\n.left-2\\.5 {\n  left: 0.625rem;\n}\n.left-3 {\n  left: 0.75rem;\n}\n.left-4 {\n  left: 1rem;\n}\n.left-5 {\n  left: 1.25rem;\n}\n.left-6 {\n  left: 1.5rem;\n}\n.right-0 {\n  right: 0px;\n}\n.right-2 {\n  right: 0.5rem;\n}\n.right-4 {\n  right: 1rem;\n}\n.top-0 {\n  top: 0px;\n}\n.top-1\\/2 {\n  top: 50%;\n}\n.top-10 {\n  top: 2.5rem;\n}\n.top-2 {\n  top: 0.5rem;\n}\n.top-3 {\n  top: 0.75rem;\n}\n.top-4 {\n  top: 1rem;\n}\n.top-full {\n  top: 100%;\n}\n.-z-10 {\n  z-index: -10;\n}\n.z-0 {\n  z-index: 0;\n}\n.z-10 {\n  z-index: 10;\n}\n.z-20 {\n  z-index: 20;\n}\n.z-30 {\n  z-index: 30;\n}\n.z-40 {\n  z-index: 40;\n}\n.z-50 {\n  z-index: 50;\n}\n.z-auto {\n  z-index: auto;\n}\n.col-span-1 {\n  grid-column: span 1 / span 1;\n}\n.-m-1 {\n  margin: -0.25rem;\n}\n.-m-1\\.5 {\n  margin: -0.375rem;\n}\n.mx-1 {\n  margin-left: 0.25rem;\n  margin-right: 0.25rem;\n}\n.mx-4 {\n  margin-left: 1rem;\n  margin-right: 1rem;\n}\n.mx-auto {\n  margin-left: auto;\n  margin-right: auto;\n}\n.my-1 {\n  margin-top: 0.25rem;\n  margin-bottom: 0.25rem;\n}\n.my-6 {\n  margin-top: 1.5rem;\n  margin-bottom: 1.5rem;\n}\n.-mb-px {\n  margin-bottom: -1px;\n}\n.mb-1 {\n  margin-bottom: 0.25rem;\n}\n.mb-10 {\n  margin-bottom: 2.5rem;\n}\n.mb-2 {\n  margin-bottom: 0.5rem;\n}\n.mb-3 {\n  margin-bottom: 0.75rem;\n}\n.mb-4 {\n  margin-bottom: 1rem;\n}\n.mb-5 {\n  margin-bottom: 1.25rem;\n}\n.mb-6 {\n  margin-bottom: 1.5rem;\n}\n.me-2 {\n  margin-inline-end: 0.5rem;\n}\n.me-4 {\n  margin-inline-end: 1rem;\n}\n.ml-0 {\n  margin-left: 0px;\n}\n.ml-1 {\n  margin-left: 0.25rem;\n}\n.ml-2 {\n  margin-left: 0.5rem;\n}\n.ml-3 {\n  margin-left: 0.75rem;\n}\n.ml-6 {\n  margin-left: 1.5rem;\n}\n.ml-auto {\n  margin-left: auto;\n}\n.mr-2 {\n  margin-right: 0.5rem;\n}\n.mr-3 {\n  margin-right: 0.75rem;\n}\n.mr-4 {\n  margin-right: 1rem;\n}\n.mt-0 {\n  margin-top: 0px;\n}\n.mt-1 {\n  margin-top: 0.25rem;\n}\n.mt-1\\.5 {\n  margin-top: 0.375rem;\n}\n.mt-2 {\n  margin-top: 0.5rem;\n}\n.mt-3 {\n  margin-top: 0.75rem;\n}\n.mt-4 {\n  margin-top: 1rem;\n}\n.mt-6 {\n  margin-top: 1.5rem;\n}\n.line-clamp-2 {\n  overflow: hidden;\n  display: -webkit-box;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 2;\n}\n.block {\n  display: block;\n}\n.inline-block {\n  display: inline-block;\n}\n.\\!inline {\n  display: inline !important;\n}\n.inline {\n  display: inline;\n}\n.flex {\n  display: flex;\n}\n.inline-flex {\n  display: inline-flex;\n}\n.table {\n  display: table;\n}\n.grid {\n  display: grid;\n}\n.hidden {\n  display: none;\n}\n.h-0 {\n  height: 0px;\n}\n.h-0\\.5 {\n  height: 0.125rem;\n}\n.h-1 {\n  height: 0.25rem;\n}\n.h-1\\.5 {\n  height: 0.375rem;\n}\n.h-10 {\n  height: 2.5rem;\n}\n.h-12 {\n  height: 3rem;\n}\n.h-2 {\n  height: 0.5rem;\n}\n.h-2\\.5 {\n  height: 0.625rem;\n}\n.h-20 {\n  height: 5rem;\n}\n.h-3 {\n  height: 0.75rem;\n}\n.h-3\\.5 {\n  height: 0.875rem;\n}\n.h-36 {\n  height: 9rem;\n}\n.h-4 {\n  height: 1rem;\n}\n.h-5 {\n  height: 1.25rem;\n}\n.h-6 {\n  height: 1.5rem;\n}\n.h-7 {\n  height: 1.75rem;\n}\n.h-8 {\n  height: 2rem;\n}\n.h-9 {\n  height: 2.25rem;\n}\n.h-96 {\n  height: 24rem;\n}\n.h-auto {\n  height: auto;\n}\n.h-fit {\n  height: -moz-fit-content;\n  height: fit-content;\n}\n.h-full {\n  height: 100%;\n}\n.h-px {\n  height: 1px;\n}\n.h-screen {\n  height: 100vh;\n}\n.max-h-\\[90dvh\\] {\n  max-height: 90dvh;\n}\n.w-1 {\n  width: 0.25rem;\n}\n.w-1\\/2 {\n  width: 50%;\n}\n.w-10 {\n  width: 2.5rem;\n}\n.w-11 {\n  width: 2.75rem;\n}\n.w-12 {\n  width: 3rem;\n}\n.w-14 {\n  width: 3.5rem;\n}\n.w-16 {\n  width: 4rem;\n}\n.w-2 {\n  width: 0.5rem;\n}\n.w-2\\/4 {\n  width: 50%;\n}\n.w-20 {\n  width: 5rem;\n}\n.w-3 {\n  width: 0.75rem;\n}\n.w-3\\.5 {\n  width: 0.875rem;\n}\n.w-36 {\n  width: 9rem;\n}\n.w-4 {\n  width: 1rem;\n}\n.w-48 {\n  width: 12rem;\n}\n.w-5 {\n  width: 1.25rem;\n}\n.w-6 {\n  width: 1.5rem;\n}\n.w-64 {\n  width: 16rem;\n}\n.w-7 {\n  width: 1.75rem;\n}\n.w-72 {\n  width: 18rem;\n}\n.w-8 {\n  width: 2rem;\n}\n.w-80 {\n  width: 20rem;\n}\n.w-9 {\n  width: 2.25rem;\n}\n.w-auto {\n  width: auto;\n}\n.w-fit {\n  width: -moz-fit-content;\n  width: fit-content;\n}\n.w-full {\n  width: 100%;\n}\n.w-max {\n  width: -moz-max-content;\n  width: max-content;\n}\n.w-px {\n  width: 1px;\n}\n.max-w-2xl {\n  max-width: 42rem;\n}\n.max-w-3xl {\n  max-width: 48rem;\n}\n.max-w-4xl {\n  max-width: 56rem;\n}\n.max-w-5xl {\n  max-width: 64rem;\n}\n.max-w-6xl {\n  max-width: 72rem;\n}\n.max-w-7xl {\n  max-width: 80rem;\n}\n.max-w-\\[100vw\\] {\n  max-width: 100vw;\n}\n.max-w-lg {\n  max-width: 32rem;\n}\n.max-w-md {\n  max-width: 28rem;\n}\n.max-w-sm {\n  max-width: 24rem;\n}\n.max-w-xl {\n  max-width: 36rem;\n}\n.max-w-xs {\n  max-width: 20rem;\n}\n.flex-1 {\n  flex: 1 1 0%;\n}\n.flex-shrink {\n  flex-shrink: 1;\n}\n.flex-shrink-0 {\n  flex-shrink: 0;\n}\n.shrink-0 {\n  flex-shrink: 0;\n}\n.origin-\\[0\\] {\n  transform-origin: 0;\n}\n.-translate-x-1\\/2 {\n  --tw-translate-x: -50%;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.-translate-y-1\\/2 {\n  --tw-translate-y: -50%;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.-translate-y-4 {\n  --tw-translate-y: -1rem;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.-translate-y-6 {\n  --tw-translate-y: -1.5rem;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.rotate-180 {\n  --tw-rotate: 180deg;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.rotate-45 {\n  --tw-rotate: 45deg;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.scale-75 {\n  --tw-scale-x: .75;\n  --tw-scale-y: .75;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.transform {\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n@keyframes pulse {\n\n  50% {\n    opacity: .5;\n  }\n}\n.animate-pulse {\n  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;\n}\n@keyframes spin {\n\n  to {\n    transform: rotate(360deg);\n  }\n}\n.animate-spin {\n  animation: spin 1s linear infinite;\n}\n.cursor-default {\n  cursor: default;\n}\n.cursor-grab {\n  cursor: grab;\n}\n.cursor-not-allowed {\n  cursor: not-allowed;\n}\n.cursor-pointer {\n  cursor: pointer;\n}\n.cursor-wait {\n  cursor: wait;\n}\n.select-none {\n  -webkit-user-select: none;\n     -moz-user-select: none;\n          user-select: none;\n}\n.resize {\n  resize: both;\n}\n.snap-x {\n  scroll-snap-type: x var(--tw-scroll-snap-strictness);\n}\n.snap-mandatory {\n  --tw-scroll-snap-strictness: mandatory;\n}\n.snap-center {\n  scroll-snap-align: center;\n}\n.list-inside {\n  list-style-position: inside;\n}\n.list-decimal {\n  list-style-type: decimal;\n}\n.list-disc {\n  list-style-type: disc;\n}\n.list-none {\n  list-style-type: none;\n}\n.appearance-none {\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none;\n}\n.grid-flow-col {\n  grid-auto-flow: column;\n}\n.grid-cols-2 {\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n.grid-cols-4 {\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n}\n.grid-cols-7 {\n  grid-template-columns: repeat(7, minmax(0, 1fr));\n}\n.flex-col {\n  flex-direction: column;\n}\n.flex-wrap {\n  flex-wrap: wrap;\n}\n.items-start {\n  align-items: flex-start;\n}\n.items-end {\n  align-items: flex-end;\n}\n.items-center {\n  align-items: center;\n}\n.items-stretch {\n  align-items: stretch;\n}\n.justify-start {\n  justify-content: flex-start;\n}\n.justify-end {\n  justify-content: flex-end;\n}\n.justify-center {\n  justify-content: center;\n}\n.justify-between {\n  justify-content: space-between;\n}\n.gap-1 {\n  gap: 0.25rem;\n}\n.gap-1\\.5 {\n  gap: 0.375rem;\n}\n.gap-2 {\n  gap: 0.5rem;\n}\n.gap-3 {\n  gap: 0.75rem;\n}\n.gap-4 {\n  gap: 1rem;\n}\n.-space-x-4 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(-1rem * var(--tw-space-x-reverse));\n  margin-left: calc(-1rem * calc(1 - var(--tw-space-x-reverse)));\n}\n.-space-x-px > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(-1px * var(--tw-space-x-reverse));\n  margin-left: calc(-1px * calc(1 - var(--tw-space-x-reverse)));\n}\n.space-x-2 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(0.5rem * var(--tw-space-x-reverse));\n  margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));\n}\n.space-x-3 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(0.75rem * var(--tw-space-x-reverse));\n  margin-left: calc(0.75rem * calc(1 - var(--tw-space-x-reverse)));\n}\n.space-x-4 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(1rem * var(--tw-space-x-reverse));\n  margin-left: calc(1rem * calc(1 - var(--tw-space-x-reverse)));\n}\n.space-y-0 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0px * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0px * var(--tw-space-y-reverse));\n}\n.space-y-1 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0.25rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0.25rem * var(--tw-space-y-reverse));\n}\n.space-y-2 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));\n}\n.space-y-3 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0.75rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0.75rem * var(--tw-space-y-reverse));\n}\n.space-y-4 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(1rem * var(--tw-space-y-reverse));\n}\n.divide-x > :not([hidden]) ~ :not([hidden]) {\n  --tw-divide-x-reverse: 0;\n  border-right-width: calc(1px * var(--tw-divide-x-reverse));\n  border-left-width: calc(1px * calc(1 - var(--tw-divide-x-reverse)));\n}\n.divide-y > :not([hidden]) ~ :not([hidden]) {\n  --tw-divide-y-reverse: 0;\n  border-top-width: calc(1px * calc(1 - var(--tw-divide-y-reverse)));\n  border-bottom-width: calc(1px * var(--tw-divide-y-reverse));\n}\n.divide-gray-100 > :not([hidden]) ~ :not([hidden]) {\n  --tw-divide-opacity: 1;\n  border-color: rgb(243 244 246 / var(--tw-divide-opacity));\n}\n.divide-gray-200 > :not([hidden]) ~ :not([hidden]) {\n  --tw-divide-opacity: 1;\n  border-color: rgb(229 231 235 / var(--tw-divide-opacity));\n}\n.self-center {\n  align-self: center;\n}\n.overflow-auto {\n  overflow: auto;\n}\n.overflow-hidden {\n  overflow: hidden;\n}\n.overflow-y-auto {\n  overflow-y: auto;\n}\n.\\!overflow-x-hidden {\n  overflow-x: hidden !important;\n}\n.overflow-x-hidden {\n  overflow-x: hidden;\n}\n.overflow-y-hidden {\n  overflow-y: hidden;\n}\n.overflow-x-scroll {\n  overflow-x: scroll;\n}\n.\\!scroll-auto {\n  scroll-behavior: auto !important;\n}\n.scroll-smooth {\n  scroll-behavior: smooth;\n}\n.whitespace-nowrap {\n  white-space: nowrap;\n}\n.rounded {\n  border-radius: 0.25rem;\n}\n.rounded-\\[7px\\] {\n  border-radius: 7px;\n}\n.rounded-full {\n  border-radius: 9999px;\n}\n.rounded-lg {\n  border-radius: 0.5rem;\n}\n.rounded-md {\n  border-radius: 0.375rem;\n}\n.rounded-none {\n  border-radius: 0px;\n}\n.rounded-b {\n  border-bottom-right-radius: 0.25rem;\n  border-bottom-left-radius: 0.25rem;\n}\n.rounded-e-lg {\n  border-start-end-radius: 0.5rem;\n  border-end-end-radius: 0.5rem;\n}\n.rounded-l-lg {\n  border-top-left-radius: 0.5rem;\n  border-bottom-left-radius: 0.5rem;\n}\n.rounded-l-md {\n  border-top-left-radius: 0.375rem;\n  border-bottom-left-radius: 0.375rem;\n}\n.rounded-l-none {\n  border-top-left-radius: 0px;\n  border-bottom-left-radius: 0px;\n}\n.rounded-r-lg {\n  border-top-right-radius: 0.5rem;\n  border-bottom-right-radius: 0.5rem;\n}\n.rounded-r-none {\n  border-top-right-radius: 0px;\n  border-bottom-right-radius: 0px;\n}\n.rounded-s-lg {\n  border-start-start-radius: 0.5rem;\n  border-end-start-radius: 0.5rem;\n}\n.rounded-t {\n  border-top-left-radius: 0.25rem;\n  border-top-right-radius: 0.25rem;\n}\n.rounded-t-lg {\n  border-top-left-radius: 0.5rem;\n  border-top-right-radius: 0.5rem;\n}\n.border {\n  border-width: 1px;\n}\n.border-0 {\n  border-width: 0px;\n}\n.border-2 {\n  border-width: 2px;\n}\n.border-y {\n  border-top-width: 1px;\n  border-bottom-width: 1px;\n}\n.border-b {\n  border-bottom-width: 1px;\n}\n.border-b-0 {\n  border-bottom-width: 0px;\n}\n.border-b-2 {\n  border-bottom-width: 2px;\n}\n.border-l {\n  border-left-width: 1px;\n}\n.border-l-0 {\n  border-left-width: 0px;\n}\n.border-l-4 {\n  border-left-width: 4px;\n}\n.border-r {\n  border-right-width: 1px;\n}\n.border-r-0 {\n  border-right-width: 0px;\n}\n.border-t {\n  border-top-width: 1px;\n}\n.border-t-4 {\n  border-top-width: 4px;\n}\n.border-blue-500 {\n  --tw-border-opacity: 1;\n  border-color: rgb(63 131 248 / var(--tw-border-opacity));\n}\n.border-cyan-300 {\n  --tw-border-opacity: 1;\n  border-color: rgb(103 232 249 / var(--tw-border-opacity));\n}\n.border-cyan-500 {\n  --tw-border-opacity: 1;\n  border-color: rgb(6 182 212 / var(--tw-border-opacity));\n}\n.border-cyan-600 {\n  --tw-border-opacity: 1;\n  border-color: rgb(8 145 178 / var(--tw-border-opacity));\n}\n.border-cyan-700 {\n  --tw-border-opacity: 1;\n  border-color: rgb(14 116 144 / var(--tw-border-opacity));\n}\n.border-gray-100 {\n  --tw-border-opacity: 1;\n  border-color: rgb(243 244 246 / var(--tw-border-opacity));\n}\n.border-gray-200 {\n  --tw-border-opacity: 1;\n  border-color: rgb(229 231 235 / var(--tw-border-opacity));\n}\n.border-gray-300 {\n  --tw-border-opacity: 1;\n  border-color: rgb(209 213 219 / var(--tw-border-opacity));\n}\n.border-gray-400 {\n  --tw-border-opacity: 1;\n  border-color: rgb(156 163 175 / var(--tw-border-opacity));\n}\n.border-gray-500 {\n  --tw-border-opacity: 1;\n  border-color: rgb(107 114 128 / var(--tw-border-opacity));\n}\n.border-gray-600 {\n  --tw-border-opacity: 1;\n  border-color: rgb(75 85 99 / var(--tw-border-opacity));\n}\n.border-gray-900 {\n  --tw-border-opacity: 1;\n  border-color: rgb(17 24 39 / var(--tw-border-opacity));\n}\n.border-green-300 {\n  --tw-border-opacity: 1;\n  border-color: rgb(132 225 188 / var(--tw-border-opacity));\n}\n.border-green-500 {\n  --tw-border-opacity: 1;\n  border-color: rgb(14 159 110 / var(--tw-border-opacity));\n}\n.border-green-600 {\n  --tw-border-opacity: 1;\n  border-color: rgb(5 122 85 / var(--tw-border-opacity));\n}\n.border-green-700 {\n  --tw-border-opacity: 1;\n  border-color: rgb(4 108 78 / var(--tw-border-opacity));\n}\n.border-indigo-300 {\n  --tw-border-opacity: 1;\n  border-color: rgb(180 198 252 / var(--tw-border-opacity));\n}\n.border-indigo-400 {\n  --tw-border-opacity: 1;\n  border-color: rgb(141 162 251 / var(--tw-border-opacity));\n}\n.border-indigo-500 {\n  --tw-border-opacity: 1;\n  border-color: rgb(104 117 245 / var(--tw-border-opacity));\n}\n.border-lime-300 {\n  --tw-border-opacity: 1;\n  border-color: rgb(190 242 100 / var(--tw-border-opacity));\n}\n.border-lime-400 {\n  --tw-border-opacity: 1;\n  border-color: rgb(163 230 53 / var(--tw-border-opacity));\n}\n.border-lime-500 {\n  --tw-border-opacity: 1;\n  border-color: rgb(132 204 22 / var(--tw-border-opacity));\n}\n.border-pink-300 {\n  --tw-border-opacity: 1;\n  border-color: rgb(248 180 217 / var(--tw-border-opacity));\n}\n.border-pink-500 {\n  --tw-border-opacity: 1;\n  border-color: rgb(231 70 148 / var(--tw-border-opacity));\n}\n.border-pink-600 {\n  --tw-border-opacity: 1;\n  border-color: rgb(214 31 105 / var(--tw-border-opacity));\n}\n.border-purple-500 {\n  --tw-border-opacity: 1;\n  border-color: rgb(144 97 249 / var(--tw-border-opacity));\n}\n.border-purple-900 {\n  --tw-border-opacity: 1;\n  border-color: rgb(74 29 150 / var(--tw-border-opacity));\n}\n.border-red-300 {\n  --tw-border-opacity: 1;\n  border-color: rgb(248 180 180 / var(--tw-border-opacity));\n}\n.border-red-500 {\n  --tw-border-opacity: 1;\n  border-color: rgb(240 82 82 / var(--tw-border-opacity));\n}\n.border-red-600 {\n  --tw-border-opacity: 1;\n  border-color: rgb(224 36 36 / var(--tw-border-opacity));\n}\n.border-red-900 {\n  --tw-border-opacity: 1;\n  border-color: rgb(119 29 29 / var(--tw-border-opacity));\n}\n.border-slate-100 {\n  --tw-border-opacity: 1;\n  border-color: rgb(241 245 249 / var(--tw-border-opacity));\n}\n.border-slate-100\\/50 {\n  border-color: rgb(241 245 249 / 0.5);\n}\n.border-slate-200 {\n  --tw-border-opacity: 1;\n  border-color: rgb(226 232 240 / var(--tw-border-opacity));\n}\n.border-slate-300 {\n  --tw-border-opacity: 1;\n  border-color: rgb(203 213 225 / var(--tw-border-opacity));\n}\n.border-slate-50 {\n  --tw-border-opacity: 1;\n  border-color: rgb(248 250 252 / var(--tw-border-opacity));\n}\n.border-teal-300 {\n  --tw-border-opacity: 1;\n  border-color: rgb(126 220 226 / var(--tw-border-opacity));\n}\n.border-teal-500 {\n  --tw-border-opacity: 1;\n  border-color: rgb(6 148 162 / var(--tw-border-opacity));\n}\n.border-transparent {\n  border-color: transparent;\n}\n.border-white {\n  --tw-border-opacity: 1;\n  border-color: rgb(255 255 255 / var(--tw-border-opacity));\n}\n.border-yellow-200 {\n  --tw-border-opacity: 1;\n  border-color: rgb(252 233 106 / var(--tw-border-opacity));\n}\n.border-yellow-300 {\n  --tw-border-opacity: 1;\n  border-color: rgb(250 202 21 / var(--tw-border-opacity));\n}\n.border-yellow-400 {\n  --tw-border-opacity: 1;\n  border-color: rgb(227 160 8 / var(--tw-border-opacity));\n}\n.border-yellow-500 {\n  --tw-border-opacity: 1;\n  border-color: rgb(194 120 3 / var(--tw-border-opacity));\n}\n.border-yellow-600 {\n  --tw-border-opacity: 1;\n  border-color: rgb(159 88 10 / var(--tw-border-opacity));\n}\n.border-l-indigo-500 {\n  --tw-border-opacity: 1;\n  border-left-color: rgb(104 117 245 / var(--tw-border-opacity));\n}\n.border-l-transparent {\n  border-left-color: transparent;\n}\n.\\!bg-gray-50 {\n  --tw-bg-opacity: 1 !important;\n  background-color: rgb(249 250 251 / var(--tw-bg-opacity)) !important;\n}\n.\\!bg-transparent {\n  background-color: transparent !important;\n}\n.bg-black\\/30 {\n  background-color: rgb(0 0 0 / 0.3);\n}\n.bg-blue-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(225 239 254 / var(--tw-bg-opacity));\n}\n.bg-blue-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(28 100 242 / var(--tw-bg-opacity));\n}\n.bg-blue-700 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(26 86 219 / var(--tw-bg-opacity));\n}\n.bg-cyan-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(207 250 254 / var(--tw-bg-opacity));\n}\n.bg-cyan-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(165 243 252 / var(--tw-bg-opacity));\n}\n.bg-cyan-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(236 254 255 / var(--tw-bg-opacity));\n}\n.bg-cyan-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(6 182 212 / var(--tw-bg-opacity));\n}\n.bg-cyan-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(8 145 178 / var(--tw-bg-opacity));\n}\n.bg-cyan-700 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(14 116 144 / var(--tw-bg-opacity));\n}\n.bg-emerald-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(16 185 129 / var(--tw-bg-opacity));\n}\n.bg-gray-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(243 244 246 / var(--tw-bg-opacity));\n}\n.bg-gray-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(229 231 235 / var(--tw-bg-opacity));\n}\n.bg-gray-400 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(156 163 175 / var(--tw-bg-opacity));\n}\n.bg-gray-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(249 250 251 / var(--tw-bg-opacity));\n}\n.bg-gray-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(107 114 128 / var(--tw-bg-opacity));\n}\n.bg-gray-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(75 85 99 / var(--tw-bg-opacity));\n}\n.bg-gray-700 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(55 65 81 / var(--tw-bg-opacity));\n}\n.bg-gray-800 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(31 41 55 / var(--tw-bg-opacity));\n}\n.bg-gray-900 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(17 24 39 / var(--tw-bg-opacity));\n}\n.bg-green-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(222 247 236 / var(--tw-bg-opacity));\n}\n.bg-green-400 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(49 196 141 / var(--tw-bg-opacity));\n}\n.bg-green-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(243 250 247 / var(--tw-bg-opacity));\n}\n.bg-green-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(14 159 110 / var(--tw-bg-opacity));\n}\n.bg-green-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(5 122 85 / var(--tw-bg-opacity));\n}\n.bg-green-700 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(4 108 78 / var(--tw-bg-opacity));\n}\n.bg-indigo-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(229 237 255 / var(--tw-bg-opacity));\n}\n.bg-indigo-400 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(141 162 251 / var(--tw-bg-opacity));\n}\n.bg-indigo-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(240 245 255 / var(--tw-bg-opacity));\n}\n.bg-indigo-50\\/60 {\n  background-color: rgb(240 245 255 / 0.6);\n}\n.bg-indigo-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(104 117 245 / var(--tw-bg-opacity));\n}\n.bg-indigo-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(88 80 236 / var(--tw-bg-opacity));\n}\n.bg-lime-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(236 252 203 / var(--tw-bg-opacity));\n}\n.bg-lime-400 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(163 230 53 / var(--tw-bg-opacity));\n}\n.bg-lime-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(101 163 13 / var(--tw-bg-opacity));\n}\n.bg-pink-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(252 232 243 / var(--tw-bg-opacity));\n}\n.bg-pink-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(231 70 148 / var(--tw-bg-opacity));\n}\n.bg-pink-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(214 31 105 / var(--tw-bg-opacity));\n}\n.bg-purple-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(237 235 254 / var(--tw-bg-opacity));\n}\n.bg-purple-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(246 245 255 / var(--tw-bg-opacity));\n}\n.bg-purple-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(126 58 242 / var(--tw-bg-opacity));\n}\n.bg-purple-700 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(108 43 217 / var(--tw-bg-opacity));\n}\n.bg-red-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(253 232 232 / var(--tw-bg-opacity));\n}\n.bg-red-400 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(249 128 128 / var(--tw-bg-opacity));\n}\n.bg-red-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(253 242 242 / var(--tw-bg-opacity));\n}\n.bg-red-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(240 82 82 / var(--tw-bg-opacity));\n}\n.bg-red-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(224 36 36 / var(--tw-bg-opacity));\n}\n.bg-red-700 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(200 30 30 / var(--tw-bg-opacity));\n}\n.bg-slate-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(241 245 249 / var(--tw-bg-opacity));\n}\n.bg-slate-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(226 232 240 / var(--tw-bg-opacity));\n}\n.bg-slate-300 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(203 213 225 / var(--tw-bg-opacity));\n}\n.bg-slate-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(248 250 252 / var(--tw-bg-opacity));\n}\n.bg-teal-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(213 245 246 / var(--tw-bg-opacity));\n}\n.bg-teal-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(4 116 129 / var(--tw-bg-opacity));\n}\n.bg-transparent {\n  background-color: transparent;\n}\n.bg-white {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 255 255 / var(--tw-bg-opacity));\n}\n.bg-white\\/30 {\n  background-color: rgb(255 255 255 / 0.3);\n}\n.bg-white\\/50 {\n  background-color: rgb(255 255 255 / 0.5);\n}\n.bg-yellow-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(253 246 178 / var(--tw-bg-opacity));\n}\n.bg-yellow-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(252 233 106 / var(--tw-bg-opacity));\n}\n.bg-yellow-400 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(227 160 8 / var(--tw-bg-opacity));\n}\n.bg-yellow-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(253 253 234 / var(--tw-bg-opacity));\n}\n.bg-yellow-50\\/30 {\n  background-color: rgb(253 253 234 / 0.3);\n}\n.bg-yellow-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(159 88 10 / var(--tw-bg-opacity));\n}\n.bg-opacity-50 {\n  --tw-bg-opacity: 0.5;\n}\n.bg-gradient-to-br {\n  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));\n}\n.bg-gradient-to-r {\n  background-image: linear-gradient(to right, var(--tw-gradient-stops));\n}\n.from-cyan-400 {\n  --tw-gradient-from: #22d3ee var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(34 211 238 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n}\n.from-cyan-500 {\n  --tw-gradient-from: #06b6d4 var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(6 182 212 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n}\n.from-green-400 {\n  --tw-gradient-from: #31C48D var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(49 196 141 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n}\n.from-lime-200 {\n  --tw-gradient-from: #d9f99d var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(217 249 157 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n}\n.from-pink-400 {\n  --tw-gradient-from: #F17EB8 var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(241 126 184 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n}\n.from-pink-500 {\n  --tw-gradient-from: #E74694 var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(231 70 148 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n}\n.from-purple-500 {\n  --tw-gradient-from: #9061F9 var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(144 97 249 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n}\n.from-purple-600 {\n  --tw-gradient-from: #7E3AF2 var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(126 58 242 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n}\n.from-red-200 {\n  --tw-gradient-from: #FBD5D5 var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(251 213 213 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n}\n.from-red-400 {\n  --tw-gradient-from: #F98080 var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(249 128 128 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n}\n.from-teal-200 {\n  --tw-gradient-from: #AFECEF var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(175 236 239 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n}\n.from-teal-400 {\n  --tw-gradient-from: #16BDCA var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(22 189 202 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n}\n.via-cyan-500 {\n  --tw-gradient-to: rgb(6 182 212 / 0)  var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), #06b6d4 var(--tw-gradient-via-position), var(--tw-gradient-to);\n}\n.via-cyan-600 {\n  --tw-gradient-to: rgb(8 145 178 / 0)  var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), #0891b2 var(--tw-gradient-via-position), var(--tw-gradient-to);\n}\n.via-green-500 {\n  --tw-gradient-to: rgb(14 159 110 / 0)  var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), #0E9F6E var(--tw-gradient-via-position), var(--tw-gradient-to);\n}\n.via-lime-400 {\n  --tw-gradient-to: rgb(163 230 53 / 0)  var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), #a3e635 var(--tw-gradient-via-position), var(--tw-gradient-to);\n}\n.via-pink-500 {\n  --tw-gradient-to: rgb(231 70 148 / 0)  var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), #E74694 var(--tw-gradient-via-position), var(--tw-gradient-to);\n}\n.via-purple-600 {\n  --tw-gradient-to: rgb(126 58 242 / 0)  var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), #7E3AF2 var(--tw-gradient-via-position), var(--tw-gradient-to);\n}\n.via-red-300 {\n  --tw-gradient-to: rgb(248 180 180 / 0)  var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), #F8B4B4 var(--tw-gradient-via-position), var(--tw-gradient-to);\n}\n.via-red-500 {\n  --tw-gradient-to: rgb(240 82 82 / 0)  var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), #F05252 var(--tw-gradient-via-position), var(--tw-gradient-to);\n}\n.via-teal-500 {\n  --tw-gradient-to: rgb(6 148 162 / 0)  var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), #0694A2 var(--tw-gradient-via-position), var(--tw-gradient-to);\n}\n.to-cyan-500 {\n  --tw-gradient-to: #06b6d4 var(--tw-gradient-to-position);\n}\n.to-cyan-600 {\n  --tw-gradient-to: #0891b2 var(--tw-gradient-to-position);\n}\n.to-cyan-700 {\n  --tw-gradient-to: #0e7490 var(--tw-gradient-to-position);\n}\n.to-green-600 {\n  --tw-gradient-to: #057A55 var(--tw-gradient-to-position);\n}\n.to-lime-200 {\n  --tw-gradient-to: #d9f99d var(--tw-gradient-to-position);\n}\n.to-lime-500 {\n  --tw-gradient-to: #84cc16 var(--tw-gradient-to-position);\n}\n.to-orange-400 {\n  --tw-gradient-to: #FF8A4C var(--tw-gradient-to-position);\n}\n.to-pink-500 {\n  --tw-gradient-to: #E74694 var(--tw-gradient-to-position);\n}\n.to-pink-600 {\n  --tw-gradient-to: #D61F69 var(--tw-gradient-to-position);\n}\n.to-purple-700 {\n  --tw-gradient-to: #6C2BD9 var(--tw-gradient-to-position);\n}\n.to-red-600 {\n  --tw-gradient-to: #E02424 var(--tw-gradient-to-position);\n}\n.to-teal-600 {\n  --tw-gradient-to: #047481 var(--tw-gradient-to-position);\n}\n.to-yellow-200 {\n  --tw-gradient-to: #FCE96A var(--tw-gradient-to-position);\n}\n.fill-current {\n  fill: currentColor;\n}\n.fill-cyan-600 {\n  fill: #0891b2;\n}\n.fill-gray-600 {\n  fill: #4B5563;\n}\n.fill-green-500 {\n  fill: #0E9F6E;\n}\n.fill-pink-600 {\n  fill: #D61F69;\n}\n.fill-purple-600 {\n  fill: #7E3AF2;\n}\n.fill-red-600 {\n  fill: #E02424;\n}\n.fill-yellow-400 {\n  fill: #E3A008;\n}\n.object-cover {\n  -o-object-fit: cover;\n     object-fit: cover;\n}\n.p-0 {\n  padding: 0px;\n}\n.p-0\\.5 {\n  padding: 0.125rem;\n}\n.p-1 {\n  padding: 0.25rem;\n}\n.p-1\\.5 {\n  padding: 0.375rem;\n}\n.p-2 {\n  padding: 0.5rem;\n}\n.p-2\\.5 {\n  padding: 0.625rem;\n}\n.p-3 {\n  padding: 0.75rem;\n}\n.p-4 {\n  padding: 1rem;\n}\n.p-5 {\n  padding: 1.25rem;\n}\n.p-6 {\n  padding: 1.5rem;\n}\n.p-8 {\n  padding: 2rem;\n}\n.px-0 {\n  padding-left: 0px;\n  padding-right: 0px;\n}\n.px-0\\.5 {\n  padding-left: 0.125rem;\n  padding-right: 0.125rem;\n}\n.px-1 {\n  padding-left: 0.25rem;\n  padding-right: 0.25rem;\n}\n.px-1\\.5 {\n  padding-left: 0.375rem;\n  padding-right: 0.375rem;\n}\n.px-10 {\n  padding-left: 2.5rem;\n  padding-right: 2.5rem;\n}\n.px-2 {\n  padding-left: 0.5rem;\n  padding-right: 0.5rem;\n}\n.px-2\\.5 {\n  padding-left: 0.625rem;\n  padding-right: 0.625rem;\n}\n.px-3 {\n  padding-left: 0.75rem;\n  padding-right: 0.75rem;\n}\n.px-4 {\n  padding-left: 1rem;\n  padding-right: 1rem;\n}\n.px-5 {\n  padding-left: 1.25rem;\n  padding-right: 1.25rem;\n}\n.px-6 {\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n}\n.px-8 {\n  padding-left: 2rem;\n  padding-right: 2rem;\n}\n.py-0 {\n  padding-top: 0px;\n  padding-bottom: 0px;\n}\n.py-0\\.5 {\n  padding-top: 0.125rem;\n  padding-bottom: 0.125rem;\n}\n.py-1 {\n  padding-top: 0.25rem;\n  padding-bottom: 0.25rem;\n}\n.py-1\\.5 {\n  padding-top: 0.375rem;\n  padding-bottom: 0.375rem;\n}\n.py-2 {\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n}\n.py-2\\.5 {\n  padding-top: 0.625rem;\n  padding-bottom: 0.625rem;\n}\n.py-3 {\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem;\n}\n.py-4 {\n  padding-top: 1rem;\n  padding-bottom: 1rem;\n}\n.pb-2 {\n  padding-bottom: 0.5rem;\n}\n.pb-2\\.5 {\n  padding-bottom: 0.625rem;\n}\n.pb-20 {\n  padding-bottom: 5rem;\n}\n.pb-3 {\n  padding-bottom: 0.75rem;\n}\n.pe-4 {\n  padding-inline-end: 1rem;\n}\n.pl-0 {\n  padding-left: 0px;\n}\n.pl-10 {\n  padding-left: 2.5rem;\n}\n.pl-12 {\n  padding-left: 3rem;\n}\n.pl-16 {\n  padding-left: 4rem;\n}\n.pl-2 {\n  padding-left: 0.5rem;\n}\n.pl-2\\.5 {\n  padding-left: 0.625rem;\n}\n.pl-20 {\n  padding-left: 5rem;\n}\n.pl-3 {\n  padding-left: 0.75rem;\n}\n.pl-8 {\n  padding-left: 2rem;\n}\n.pl-9 {\n  padding-left: 2.25rem;\n}\n.pr-10 {\n  padding-right: 2.5rem;\n}\n.pr-3 {\n  padding-right: 0.75rem;\n}\n.pr-4 {\n  padding-right: 1rem;\n}\n.ps-4 {\n  padding-inline-start: 1rem;\n}\n.ps-5 {\n  padding-inline-start: 1.25rem;\n}\n.pt-0 {\n  padding-top: 0px;\n}\n.pt-2 {\n  padding-top: 0.5rem;\n}\n.pt-4 {\n  padding-top: 1rem;\n}\n.pt-5 {\n  padding-top: 1.25rem;\n}\n.text-left {\n  text-align: left;\n}\n.text-center {\n  text-align: center;\n}\n.font-mono {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;\n}\n.font-sans {\n  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";\n}\n.text-2xl {\n  font-size: 1.5rem;\n  line-height: 2rem;\n}\n.text-\\[10px\\] {\n  font-size: 10px;\n}\n.text-base {\n  font-size: 1rem;\n  line-height: 1.5rem;\n}\n.text-lg {\n  font-size: 1.125rem;\n  line-height: 1.75rem;\n}\n.text-sm {\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n}\n.text-xl {\n  font-size: 1.25rem;\n  line-height: 1.75rem;\n}\n.text-xs {\n  font-size: 0.75rem;\n  line-height: 1rem;\n}\n.font-bold {\n  font-weight: 700;\n}\n.font-medium {\n  font-weight: 500;\n}\n.font-normal {\n  font-weight: 400;\n}\n.font-semibold {\n  font-weight: 600;\n}\n.uppercase {\n  text-transform: uppercase;\n}\n.lowercase {\n  text-transform: lowercase;\n}\n.capitalize {\n  text-transform: capitalize;\n}\n.italic {\n  font-style: italic;\n}\n.leading-6 {\n  line-height: 1.5rem;\n}\n.leading-9 {\n  line-height: 2.25rem;\n}\n.leading-none {\n  line-height: 1;\n}\n.leading-relaxed {\n  line-height: 1.625;\n}\n.leading-snug {\n  line-height: 1.375;\n}\n.leading-tight {\n  line-height: 1.25;\n}\n.tracking-tight {\n  letter-spacing: -0.025em;\n}\n.tracking-wider {\n  letter-spacing: 0.05em;\n}\n.text-amber-500 {\n  --tw-text-opacity: 1;\n  color: rgb(245 158 11 / var(--tw-text-opacity));\n}\n.text-black {\n  --tw-text-opacity: 1;\n  color: rgb(0 0 0 / var(--tw-text-opacity));\n}\n.text-blue-500 {\n  --tw-text-opacity: 1;\n  color: rgb(63 131 248 / var(--tw-text-opacity));\n}\n.text-blue-700 {\n  --tw-text-opacity: 1;\n  color: rgb(26 86 219 / var(--tw-text-opacity));\n}\n.text-blue-800 {\n  --tw-text-opacity: 1;\n  color: rgb(30 66 159 / var(--tw-text-opacity));\n}\n.text-cyan-300 {\n  --tw-text-opacity: 1;\n  color: rgb(103 232 249 / var(--tw-text-opacity));\n}\n.text-cyan-500 {\n  --tw-text-opacity: 1;\n  color: rgb(6 182 212 / var(--tw-text-opacity));\n}\n.text-cyan-600 {\n  --tw-text-opacity: 1;\n  color: rgb(8 145 178 / var(--tw-text-opacity));\n}\n.text-cyan-700 {\n  --tw-text-opacity: 1;\n  color: rgb(14 116 144 / var(--tw-text-opacity));\n}\n.text-cyan-800 {\n  --tw-text-opacity: 1;\n  color: rgb(21 94 117 / var(--tw-text-opacity));\n}\n.text-cyan-900 {\n  --tw-text-opacity: 1;\n  color: rgb(22 78 99 / var(--tw-text-opacity));\n}\n.text-emerald-500 {\n  --tw-text-opacity: 1;\n  color: rgb(16 185 129 / var(--tw-text-opacity));\n}\n.text-gray-100 {\n  --tw-text-opacity: 1;\n  color: rgb(243 244 246 / var(--tw-text-opacity));\n}\n.text-gray-200 {\n  --tw-text-opacity: 1;\n  color: rgb(229 231 235 / var(--tw-text-opacity));\n}\n.text-gray-300 {\n  --tw-text-opacity: 1;\n  color: rgb(209 213 219 / var(--tw-text-opacity));\n}\n.text-gray-400 {\n  --tw-text-opacity: 1;\n  color: rgb(156 163 175 / var(--tw-text-opacity));\n}\n.text-gray-500 {\n  --tw-text-opacity: 1;\n  color: rgb(107 114 128 / var(--tw-text-opacity));\n}\n.text-gray-600 {\n  --tw-text-opacity: 1;\n  color: rgb(75 85 99 / var(--tw-text-opacity));\n}\n.text-gray-700 {\n  --tw-text-opacity: 1;\n  color: rgb(55 65 81 / var(--tw-text-opacity));\n}\n.text-gray-800 {\n  --tw-text-opacity: 1;\n  color: rgb(31 41 55 / var(--tw-text-opacity));\n}\n.text-gray-900 {\n  --tw-text-opacity: 1;\n  color: rgb(17 24 39 / var(--tw-text-opacity));\n}\n.text-green-500 {\n  --tw-text-opacity: 1;\n  color: rgb(14 159 110 / var(--tw-text-opacity));\n}\n.text-green-600 {\n  --tw-text-opacity: 1;\n  color: rgb(5 122 85 / var(--tw-text-opacity));\n}\n.text-green-700 {\n  --tw-text-opacity: 1;\n  color: rgb(4 108 78 / var(--tw-text-opacity));\n}\n.text-green-800 {\n  --tw-text-opacity: 1;\n  color: rgb(3 84 63 / var(--tw-text-opacity));\n}\n.text-green-900 {\n  --tw-text-opacity: 1;\n  color: rgb(1 71 55 / var(--tw-text-opacity));\n}\n.text-indigo-100 {\n  --tw-text-opacity: 1;\n  color: rgb(229 237 255 / var(--tw-text-opacity));\n}\n.text-indigo-50 {\n  --tw-text-opacity: 1;\n  color: rgb(240 245 255 / var(--tw-text-opacity));\n}\n.text-indigo-500 {\n  --tw-text-opacity: 1;\n  color: rgb(104 117 245 / var(--tw-text-opacity));\n}\n.text-indigo-600 {\n  --tw-text-opacity: 1;\n  color: rgb(88 80 236 / var(--tw-text-opacity));\n}\n.text-indigo-700 {\n  --tw-text-opacity: 1;\n  color: rgb(81 69 205 / var(--tw-text-opacity));\n}\n.text-indigo-800 {\n  --tw-text-opacity: 1;\n  color: rgb(66 56 157 / var(--tw-text-opacity));\n}\n.text-indigo-900 {\n  --tw-text-opacity: 1;\n  color: rgb(54 47 120 / var(--tw-text-opacity));\n}\n.text-lime-500 {\n  --tw-text-opacity: 1;\n  color: rgb(132 204 22 / var(--tw-text-opacity));\n}\n.text-lime-700 {\n  --tw-text-opacity: 1;\n  color: rgb(77 124 15 / var(--tw-text-opacity));\n}\n.text-lime-800 {\n  --tw-text-opacity: 1;\n  color: rgb(63 98 18 / var(--tw-text-opacity));\n}\n.text-lime-900 {\n  --tw-text-opacity: 1;\n  color: rgb(54 83 20 / var(--tw-text-opacity));\n}\n.text-pink-500 {\n  --tw-text-opacity: 1;\n  color: rgb(231 70 148 / var(--tw-text-opacity));\n}\n.text-pink-600 {\n  --tw-text-opacity: 1;\n  color: rgb(214 31 105 / var(--tw-text-opacity));\n}\n.text-pink-700 {\n  --tw-text-opacity: 1;\n  color: rgb(191 18 93 / var(--tw-text-opacity));\n}\n.text-pink-800 {\n  --tw-text-opacity: 1;\n  color: rgb(153 21 75 / var(--tw-text-opacity));\n}\n.text-pink-900 {\n  --tw-text-opacity: 1;\n  color: rgb(117 26 61 / var(--tw-text-opacity));\n}\n.text-purple-500 {\n  --tw-text-opacity: 1;\n  color: rgb(144 97 249 / var(--tw-text-opacity));\n}\n.text-purple-600 {\n  --tw-text-opacity: 1;\n  color: rgb(126 58 242 / var(--tw-text-opacity));\n}\n.text-purple-700 {\n  --tw-text-opacity: 1;\n  color: rgb(108 43 217 / var(--tw-text-opacity));\n}\n.text-purple-800 {\n  --tw-text-opacity: 1;\n  color: rgb(85 33 181 / var(--tw-text-opacity));\n}\n.text-red-500 {\n  --tw-text-opacity: 1;\n  color: rgb(240 82 82 / var(--tw-text-opacity));\n}\n.text-red-600 {\n  --tw-text-opacity: 1;\n  color: rgb(224 36 36 / var(--tw-text-opacity));\n}\n.text-red-700 {\n  --tw-text-opacity: 1;\n  color: rgb(200 30 30 / var(--tw-text-opacity));\n}\n.text-red-800 {\n  --tw-text-opacity: 1;\n  color: rgb(155 28 28 / var(--tw-text-opacity));\n}\n.text-red-900 {\n  --tw-text-opacity: 1;\n  color: rgb(119 29 29 / var(--tw-text-opacity));\n}\n.text-slate-200 {\n  --tw-text-opacity: 1;\n  color: rgb(226 232 240 / var(--tw-text-opacity));\n}\n.text-slate-300 {\n  --tw-text-opacity: 1;\n  color: rgb(203 213 225 / var(--tw-text-opacity));\n}\n.text-slate-400 {\n  --tw-text-opacity: 1;\n  color: rgb(148 163 184 / var(--tw-text-opacity));\n}\n.text-slate-500 {\n  --tw-text-opacity: 1;\n  color: rgb(100 116 139 / var(--tw-text-opacity));\n}\n.text-slate-600 {\n  --tw-text-opacity: 1;\n  color: rgb(71 85 105 / var(--tw-text-opacity));\n}\n.text-slate-700 {\n  --tw-text-opacity: 1;\n  color: rgb(51 65 85 / var(--tw-text-opacity));\n}\n.text-slate-800 {\n  --tw-text-opacity: 1;\n  color: rgb(30 41 59 / var(--tw-text-opacity));\n}\n.text-slate-900 {\n  --tw-text-opacity: 1;\n  color: rgb(15 23 42 / var(--tw-text-opacity));\n}\n.text-teal-500 {\n  --tw-text-opacity: 1;\n  color: rgb(6 148 162 / var(--tw-text-opacity));\n}\n.text-teal-600 {\n  --tw-text-opacity: 1;\n  color: rgb(4 116 129 / var(--tw-text-opacity));\n}\n.text-teal-700 {\n  --tw-text-opacity: 1;\n  color: rgb(3 102 114 / var(--tw-text-opacity));\n}\n.text-teal-800 {\n  --tw-text-opacity: 1;\n  color: rgb(5 80 92 / var(--tw-text-opacity));\n}\n.text-teal-900 {\n  --tw-text-opacity: 1;\n  color: rgb(1 68 81 / var(--tw-text-opacity));\n}\n.text-white {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity));\n}\n.text-yellow-400 {\n  --tw-text-opacity: 1;\n  color: rgb(227 160 8 / var(--tw-text-opacity));\n}\n.text-yellow-500 {\n  --tw-text-opacity: 1;\n  color: rgb(194 120 3 / var(--tw-text-opacity));\n}\n.text-yellow-700 {\n  --tw-text-opacity: 1;\n  color: rgb(142 75 16 / var(--tw-text-opacity));\n}\n.text-yellow-800 {\n  --tw-text-opacity: 1;\n  color: rgb(114 59 19 / var(--tw-text-opacity));\n}\n.text-yellow-900 {\n  --tw-text-opacity: 1;\n  color: rgb(99 49 18 / var(--tw-text-opacity));\n}\n.underline {\n  text-decoration-line: underline;\n}\n.placeholder-cyan-700::-moz-placeholder {\n  --tw-placeholder-opacity: 1;\n  color: rgb(14 116 144 / var(--tw-placeholder-opacity));\n}\n.placeholder-cyan-700::placeholder {\n  --tw-placeholder-opacity: 1;\n  color: rgb(14 116 144 / var(--tw-placeholder-opacity));\n}\n.placeholder-green-700::-moz-placeholder {\n  --tw-placeholder-opacity: 1;\n  color: rgb(4 108 78 / var(--tw-placeholder-opacity));\n}\n.placeholder-green-700::placeholder {\n  --tw-placeholder-opacity: 1;\n  color: rgb(4 108 78 / var(--tw-placeholder-opacity));\n}\n.placeholder-red-700::-moz-placeholder {\n  --tw-placeholder-opacity: 1;\n  color: rgb(200 30 30 / var(--tw-placeholder-opacity));\n}\n.placeholder-red-700::placeholder {\n  --tw-placeholder-opacity: 1;\n  color: rgb(200 30 30 / var(--tw-placeholder-opacity));\n}\n.placeholder-yellow-700::-moz-placeholder {\n  --tw-placeholder-opacity: 1;\n  color: rgb(142 75 16 / var(--tw-placeholder-opacity));\n}\n.placeholder-yellow-700::placeholder {\n  --tw-placeholder-opacity: 1;\n  color: rgb(142 75 16 / var(--tw-placeholder-opacity));\n}\n.opacity-0 {\n  opacity: 0;\n}\n.opacity-30 {\n  opacity: 0.3;\n}\n.opacity-50 {\n  opacity: 0.5;\n}\n.mix-blend-lighten {\n  mix-blend-mode: lighten;\n}\n.shadow {\n  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n.shadow-lg {\n  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n.shadow-md {\n  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n.shadow-sm {\n  --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);\n  --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n.shadow-xl {\n  --tw-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n.outline-none {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n}\n.outline {\n  outline-style: solid;\n}\n.ring-2 {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n}\n.ring-8 {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(8px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n}\n.ring-cyan-400 {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(34 211 238 / var(--tw-ring-opacity));\n}\n.ring-cyan-700 {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(14 116 144 / var(--tw-ring-opacity));\n}\n.ring-gray-300 {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(209 213 219 / var(--tw-ring-opacity));\n}\n.ring-gray-500 {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(107 114 128 / var(--tw-ring-opacity));\n}\n.ring-gray-800 {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(31 41 55 / var(--tw-ring-opacity));\n}\n.ring-green-500 {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(14 159 110 / var(--tw-ring-opacity));\n}\n.ring-pink-500 {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(231 70 148 / var(--tw-ring-opacity));\n}\n.ring-purple-500 {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(144 97 249 / var(--tw-ring-opacity));\n}\n.ring-red-500 {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(240 82 82 / var(--tw-ring-opacity));\n}\n.ring-white {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(255 255 255 / var(--tw-ring-opacity));\n}\n.ring-yellow-300 {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(250 202 21 / var(--tw-ring-opacity));\n}\n.blur {\n  --tw-blur: blur(8px);\n  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);\n}\n.drop-shadow-md {\n  --tw-drop-shadow: drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06));\n  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);\n}\n.filter {\n  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);\n}\n.backdrop-blur-sm {\n  --tw-backdrop-blur: blur(4px);\n  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);\n          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);\n}\n.backdrop-filter {\n  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);\n          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);\n}\n.transition {\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\n.transition-\\[color\\2c background-color\\2c border-color\\2c text-decoration-color\\2c fill\\2c stroke\\2c box-shadow\\] {\n  transition-property: color,background-color,border-color,text-decoration-color,fill,stroke,box-shadow;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\n.transition-all {\n  transition-property: all;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\n.transition-colors {\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\n.transition-opacity {\n  transition-property: opacity;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\n.transition-transform {\n  transition-property: transform;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\n.delay-0 {\n  transition-delay: 0s;\n}\n.duration-100 {\n  transition-duration: 100ms;\n}\n.duration-1000 {\n  transition-duration: 1000ms;\n}\n.duration-150 {\n  transition-duration: 150ms;\n}\n.duration-200 {\n  transition-duration: 200ms;\n}\n.duration-300 {\n  transition-duration: 300ms;\n}\n.duration-500 {\n  transition-duration: 500ms;\n}\n.duration-700 {\n  transition-duration: 700ms;\n}\n.duration-75 {\n  transition-duration: 75ms;\n}\n.ease-in {\n  transition-timing-function: cubic-bezier(0.4, 0, 1, 1);\n}\n.ease-in-out {\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n}\n.ease-out {\n  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);\n}\n.\\[overflow\\:-moz-scrollbars-none\\] {\n  overflow: -moz-scrollbars-none;\n}\n.\\[scrollbar-width\\:none\\] {\n  scrollbar-width: none;\n}\n.after\\:absolute::after {\n  content: var(--tw-content);\n  position: absolute;\n}\n.after\\:left-\\[2px\\]::after {\n  content: var(--tw-content);\n  left: 2px;\n}\n.after\\:left-\\[4px\\]::after {\n  content: var(--tw-content);\n  left: 4px;\n}\n.after\\:top-0::after {\n  content: var(--tw-content);\n  top: 0px;\n}\n.after\\:top-0\\.5::after {\n  content: var(--tw-content);\n  top: 0.125rem;\n}\n.after\\:top-\\[2px\\]::after {\n  content: var(--tw-content);\n  top: 2px;\n}\n.after\\:h-4::after {\n  content: var(--tw-content);\n  height: 1rem;\n}\n.after\\:h-5::after {\n  content: var(--tw-content);\n  height: 1.25rem;\n}\n.after\\:h-6::after {\n  content: var(--tw-content);\n  height: 1.5rem;\n}\n.after\\:w-4::after {\n  content: var(--tw-content);\n  width: 1rem;\n}\n.after\\:w-5::after {\n  content: var(--tw-content);\n  width: 1.25rem;\n}\n.after\\:w-6::after {\n  content: var(--tw-content);\n  width: 1.5rem;\n}\n.after\\:translate-x-full::after {\n  content: var(--tw-content);\n  --tw-translate-x: 100%;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.after\\:border-white::after {\n  content: var(--tw-content);\n  --tw-border-opacity: 1;\n  border-color: rgb(255 255 255 / var(--tw-border-opacity));\n}\n.first\\:ml-0:first-child {\n  margin-left: 0px;\n}\n.first\\:mt-0:first-child {\n  margin-top: 0px;\n}\n.first\\:rounded-t-lg:first-child {\n  border-top-left-radius: 0.5rem;\n  border-top-right-radius: 0.5rem;\n}\n.first\\:border-t-0:first-child {\n  border-top-width: 0px;\n}\n.first\\:pt-0:first-child {\n  padding-top: 0px;\n}\n.last\\:mr-0:last-child {\n  margin-right: 0px;\n}\n.last\\:rounded-b-lg:last-child {\n  border-bottom-right-radius: 0.5rem;\n  border-bottom-left-radius: 0.5rem;\n}\n.odd\\:bg-white:nth-child(odd) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 255 255 / var(--tw-bg-opacity));\n}\n.even\\:bg-gray-50:nth-child(even) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(249 250 251 / var(--tw-bg-opacity));\n}\n.hover\\:cursor-not-allowed:hover {\n  cursor: not-allowed;\n}\n.hover\\:border-gray-300:hover {\n  --tw-border-opacity: 1;\n  border-color: rgb(209 213 219 / var(--tw-border-opacity));\n}\n.hover\\:bg-blue-200:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(195 221 253 / var(--tw-bg-opacity));\n}\n.hover\\:bg-cyan-100:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(207 250 254 / var(--tw-bg-opacity));\n}\n.hover\\:bg-cyan-200:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(165 243 252 / var(--tw-bg-opacity));\n}\n.hover\\:bg-cyan-600:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(8 145 178 / var(--tw-bg-opacity));\n}\n.hover\\:bg-cyan-800:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(21 94 117 / var(--tw-bg-opacity));\n}\n.hover\\:bg-gray-100:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(243 244 246 / var(--tw-bg-opacity));\n}\n.hover\\:bg-gray-200:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(229 231 235 / var(--tw-bg-opacity));\n}\n.hover\\:bg-gray-50:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(249 250 251 / var(--tw-bg-opacity));\n}\n.hover\\:bg-gray-600:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(75 85 99 / var(--tw-bg-opacity));\n}\n.hover\\:bg-green-200:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(188 240 218 / var(--tw-bg-opacity));\n}\n.hover\\:bg-indigo-200:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(205 219 254 / var(--tw-bg-opacity));\n}\n.hover\\:bg-indigo-600:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(88 80 236 / var(--tw-bg-opacity));\n}\n.hover\\:bg-indigo-700:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(81 69 205 / var(--tw-bg-opacity));\n}\n.hover\\:bg-lime-200:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(217 249 157 / var(--tw-bg-opacity));\n}\n.hover\\:bg-pink-200:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(250 209 232 / var(--tw-bg-opacity));\n}\n.hover\\:bg-purple-200:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(220 215 254 / var(--tw-bg-opacity));\n}\n.hover\\:bg-red-200:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(251 213 213 / var(--tw-bg-opacity));\n}\n.hover\\:bg-red-50:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(253 242 242 / var(--tw-bg-opacity));\n}\n.hover\\:bg-red-600:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(224 36 36 / var(--tw-bg-opacity));\n}\n.hover\\:bg-slate-100:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(241 245 249 / var(--tw-bg-opacity));\n}\n.hover\\:bg-slate-200:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(226 232 240 / var(--tw-bg-opacity));\n}\n.hover\\:bg-slate-50:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(248 250 252 / var(--tw-bg-opacity));\n}\n.hover\\:bg-teal-200:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(175 236 239 / var(--tw-bg-opacity));\n}\n.hover\\:bg-white:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 255 255 / var(--tw-bg-opacity));\n}\n.hover\\:bg-yellow-200:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(252 233 106 / var(--tw-bg-opacity));\n}\n.hover\\:bg-gradient-to-br:hover {\n  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));\n}\n.hover\\:text-cyan-700:hover {\n  --tw-text-opacity: 1;\n  color: rgb(14 116 144 / var(--tw-text-opacity));\n}\n.hover\\:text-gray-600:hover {\n  --tw-text-opacity: 1;\n  color: rgb(75 85 99 / var(--tw-text-opacity));\n}\n.hover\\:text-gray-700:hover {\n  --tw-text-opacity: 1;\n  color: rgb(55 65 81 / var(--tw-text-opacity));\n}\n.hover\\:text-gray-900:hover {\n  --tw-text-opacity: 1;\n  color: rgb(17 24 39 / var(--tw-text-opacity));\n}\n.hover\\:text-indigo-600:hover {\n  --tw-text-opacity: 1;\n  color: rgb(88 80 236 / var(--tw-text-opacity));\n}\n.hover\\:text-indigo-700:hover {\n  --tw-text-opacity: 1;\n  color: rgb(81 69 205 / var(--tw-text-opacity));\n}\n.hover\\:text-red-500:hover {\n  --tw-text-opacity: 1;\n  color: rgb(240 82 82 / var(--tw-text-opacity));\n}\n.hover\\:text-red-600:hover {\n  --tw-text-opacity: 1;\n  color: rgb(224 36 36 / var(--tw-text-opacity));\n}\n.hover\\:text-slate-700:hover {\n  --tw-text-opacity: 1;\n  color: rgb(51 65 85 / var(--tw-text-opacity));\n}\n.hover\\:underline:hover {\n  text-decoration-line: underline;\n}\n.focus\\:z-10:focus {\n  z-index: 10;\n}\n.focus\\:border-blue-600:focus {\n  --tw-border-opacity: 1;\n  border-color: rgb(28 100 242 / var(--tw-border-opacity));\n}\n.focus\\:border-cyan-500:focus {\n  --tw-border-opacity: 1;\n  border-color: rgb(6 182 212 / var(--tw-border-opacity));\n}\n.focus\\:border-green-500:focus {\n  --tw-border-opacity: 1;\n  border-color: rgb(14 159 110 / var(--tw-border-opacity));\n}\n.focus\\:border-green-600:focus {\n  --tw-border-opacity: 1;\n  border-color: rgb(5 122 85 / var(--tw-border-opacity));\n}\n.focus\\:border-indigo-400:focus {\n  --tw-border-opacity: 1;\n  border-color: rgb(141 162 251 / var(--tw-border-opacity));\n}\n.focus\\:border-red-500:focus {\n  --tw-border-opacity: 1;\n  border-color: rgb(240 82 82 / var(--tw-border-opacity));\n}\n.focus\\:border-red-600:focus {\n  --tw-border-opacity: 1;\n  border-color: rgb(224 36 36 / var(--tw-border-opacity));\n}\n.focus\\:border-yellow-500:focus {\n  --tw-border-opacity: 1;\n  border-color: rgb(194 120 3 / var(--tw-border-opacity));\n}\n.focus\\:bg-gray-100:focus {\n  --tw-bg-opacity: 1;\n  background-color: rgb(243 244 246 / var(--tw-bg-opacity));\n}\n.focus\\:text-cyan-700:focus {\n  --tw-text-opacity: 1;\n  color: rgb(14 116 144 / var(--tw-text-opacity));\n}\n.focus\\:text-gray-900:focus {\n  --tw-text-opacity: 1;\n  color: rgb(17 24 39 / var(--tw-text-opacity));\n}\n.focus\\:outline-none:focus {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n}\n.focus\\:ring-0:focus {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n}\n.focus\\:ring-1:focus {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n}\n.focus\\:ring-2:focus {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n}\n.focus\\:ring-4:focus {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n}\n.focus\\:ring-blue-300:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(164 202 254 / var(--tw-ring-opacity));\n}\n.focus\\:ring-blue-400:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(118 169 250 / var(--tw-ring-opacity));\n}\n.focus\\:ring-blue-600:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(28 100 242 / var(--tw-ring-opacity));\n}\n.focus\\:ring-cyan-300:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(103 232 249 / var(--tw-ring-opacity));\n}\n.focus\\:ring-cyan-400:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(34 211 238 / var(--tw-ring-opacity));\n}\n.focus\\:ring-cyan-500:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(6 182 212 / var(--tw-ring-opacity));\n}\n.focus\\:ring-cyan-600:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(8 145 178 / var(--tw-ring-opacity));\n}\n.focus\\:ring-cyan-700:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(14 116 144 / var(--tw-ring-opacity));\n}\n.focus\\:ring-cyan-800:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(21 94 117 / var(--tw-ring-opacity));\n}\n.focus\\:ring-gray-200:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(229 231 235 / var(--tw-ring-opacity));\n}\n.focus\\:ring-gray-300:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(209 213 219 / var(--tw-ring-opacity));\n}\n.focus\\:ring-gray-400:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(156 163 175 / var(--tw-ring-opacity));\n}\n.focus\\:ring-gray-800:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(31 41 55 / var(--tw-ring-opacity));\n}\n.focus\\:ring-gray-900:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(17 24 39 / var(--tw-ring-opacity));\n}\n.focus\\:ring-green-200:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(188 240 218 / var(--tw-ring-opacity));\n}\n.focus\\:ring-green-300:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(132 225 188 / var(--tw-ring-opacity));\n}\n.focus\\:ring-green-400:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(49 196 141 / var(--tw-ring-opacity));\n}\n.focus\\:ring-green-500:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(14 159 110 / var(--tw-ring-opacity));\n}\n.focus\\:ring-green-600:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(5 122 85 / var(--tw-ring-opacity));\n}\n.focus\\:ring-green-800:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(3 84 63 / var(--tw-ring-opacity));\n}\n.focus\\:ring-indigo-300:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(180 198 252 / var(--tw-ring-opacity));\n}\n.focus\\:ring-indigo-400:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(141 162 251 / var(--tw-ring-opacity));\n}\n.focus\\:ring-indigo-500:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(104 117 245 / var(--tw-ring-opacity));\n}\n.focus\\:ring-indigo-500\\/50:focus {\n  --tw-ring-color: rgb(104 117 245 / 0.5);\n}\n.focus\\:ring-indigo-700:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(81 69 205 / var(--tw-ring-opacity));\n}\n.focus\\:ring-lime-200:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(217 249 157 / var(--tw-ring-opacity));\n}\n.focus\\:ring-lime-300:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(190 242 100 / var(--tw-ring-opacity));\n}\n.focus\\:ring-lime-400:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(163 230 53 / var(--tw-ring-opacity));\n}\n.focus\\:ring-lime-700:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(77 124 15 / var(--tw-ring-opacity));\n}\n.focus\\:ring-pink-200:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(250 209 232 / var(--tw-ring-opacity));\n}\n.focus\\:ring-pink-300:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(248 180 217 / var(--tw-ring-opacity));\n}\n.focus\\:ring-pink-400:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(241 126 184 / var(--tw-ring-opacity));\n}\n.focus\\:ring-pink-600:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(214 31 105 / var(--tw-ring-opacity));\n}\n.focus\\:ring-purple-200:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(220 215 254 / var(--tw-ring-opacity));\n}\n.focus\\:ring-purple-300:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(202 191 253 / var(--tw-ring-opacity));\n}\n.focus\\:ring-purple-400:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(172 148 250 / var(--tw-ring-opacity));\n}\n.focus\\:ring-purple-600:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(126 58 242 / var(--tw-ring-opacity));\n}\n.focus\\:ring-red-100:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(253 232 232 / var(--tw-ring-opacity));\n}\n.focus\\:ring-red-300:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(248 180 180 / var(--tw-ring-opacity));\n}\n.focus\\:ring-red-400:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(249 128 128 / var(--tw-ring-opacity));\n}\n.focus\\:ring-red-500:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(240 82 82 / var(--tw-ring-opacity));\n}\n.focus\\:ring-red-600:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(224 36 36 / var(--tw-ring-opacity));\n}\n.focus\\:ring-red-900:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(119 29 29 / var(--tw-ring-opacity));\n}\n.focus\\:ring-teal-300:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(126 220 226 / var(--tw-ring-opacity));\n}\n.focus\\:ring-teal-400:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(22 189 202 / var(--tw-ring-opacity));\n}\n.focus\\:ring-teal-600:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(4 116 129 / var(--tw-ring-opacity));\n}\n.focus\\:ring-yellow-300:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(250 202 21 / var(--tw-ring-opacity));\n}\n.focus\\:ring-yellow-400:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(227 160 8 / var(--tw-ring-opacity));\n}\n.focus\\:ring-yellow-500:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(194 120 3 / var(--tw-ring-opacity));\n}\n.enabled\\:hover\\:bg-blue-800:hover:enabled {\n  --tw-bg-opacity: 1;\n  background-color: rgb(30 66 159 / var(--tw-bg-opacity));\n}\n.enabled\\:hover\\:bg-cyan-100:hover:enabled {\n  --tw-bg-opacity: 1;\n  background-color: rgb(207 250 254 / var(--tw-bg-opacity));\n}\n.enabled\\:hover\\:bg-cyan-800:hover:enabled {\n  --tw-bg-opacity: 1;\n  background-color: rgb(21 94 117 / var(--tw-bg-opacity));\n}\n.enabled\\:hover\\:bg-gray-100:hover:enabled {\n  --tw-bg-opacity: 1;\n  background-color: rgb(243 244 246 / var(--tw-bg-opacity));\n}\n.enabled\\:hover\\:bg-gray-900:hover:enabled {\n  --tw-bg-opacity: 1;\n  background-color: rgb(17 24 39 / var(--tw-bg-opacity));\n}\n.enabled\\:hover\\:bg-green-100:hover:enabled {\n  --tw-bg-opacity: 1;\n  background-color: rgb(222 247 236 / var(--tw-bg-opacity));\n}\n.enabled\\:hover\\:bg-green-800:hover:enabled {\n  --tw-bg-opacity: 1;\n  background-color: rgb(3 84 63 / var(--tw-bg-opacity));\n}\n.enabled\\:hover\\:bg-indigo-100:hover:enabled {\n  --tw-bg-opacity: 1;\n  background-color: rgb(229 237 255 / var(--tw-bg-opacity));\n}\n.enabled\\:hover\\:bg-lime-100:hover:enabled {\n  --tw-bg-opacity: 1;\n  background-color: rgb(236 252 203 / var(--tw-bg-opacity));\n}\n.enabled\\:hover\\:bg-pink-100:hover:enabled {\n  --tw-bg-opacity: 1;\n  background-color: rgb(252 232 243 / var(--tw-bg-opacity));\n}\n.enabled\\:hover\\:bg-purple-800:hover:enabled {\n  --tw-bg-opacity: 1;\n  background-color: rgb(85 33 181 / var(--tw-bg-opacity));\n}\n.enabled\\:hover\\:bg-red-100:hover:enabled {\n  --tw-bg-opacity: 1;\n  background-color: rgb(253 232 232 / var(--tw-bg-opacity));\n}\n.enabled\\:hover\\:bg-red-800:hover:enabled {\n  --tw-bg-opacity: 1;\n  background-color: rgb(155 28 28 / var(--tw-bg-opacity));\n}\n.enabled\\:hover\\:bg-teal-100:hover:enabled {\n  --tw-bg-opacity: 1;\n  background-color: rgb(213 245 246 / var(--tw-bg-opacity));\n}\n.enabled\\:hover\\:bg-yellow-100:hover:enabled {\n  --tw-bg-opacity: 1;\n  background-color: rgb(253 246 178 / var(--tw-bg-opacity));\n}\n.enabled\\:hover\\:bg-yellow-500:hover:enabled {\n  --tw-bg-opacity: 1;\n  background-color: rgb(194 120 3 / var(--tw-bg-opacity));\n}\n.enabled\\:hover\\:bg-gradient-to-bl:hover:enabled {\n  background-image: linear-gradient(to bottom left, var(--tw-gradient-stops));\n}\n.enabled\\:hover\\:bg-gradient-to-br:hover:enabled {\n  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));\n}\n.enabled\\:hover\\:bg-gradient-to-l:hover:enabled {\n  background-image: linear-gradient(to left, var(--tw-gradient-stops));\n}\n.enabled\\:hover\\:from-teal-200:hover:enabled {\n  --tw-gradient-from: #AFECEF var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(175 236 239 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n}\n.enabled\\:hover\\:to-lime-200:hover:enabled {\n  --tw-gradient-to: #d9f99d var(--tw-gradient-to-position);\n}\n.enabled\\:hover\\:text-cyan-700:hover:enabled {\n  --tw-text-opacity: 1;\n  color: rgb(14 116 144 / var(--tw-text-opacity));\n}\n.enabled\\:hover\\:text-gray-700:hover:enabled {\n  --tw-text-opacity: 1;\n  color: rgb(55 65 81 / var(--tw-text-opacity));\n}\n.enabled\\:hover\\:text-gray-900:hover:enabled {\n  --tw-text-opacity: 1;\n  color: rgb(17 24 39 / var(--tw-text-opacity));\n}\n.disabled\\:cursor-not-allowed:disabled {\n  cursor: not-allowed;\n}\n.disabled\\:text-gray-400:disabled {\n  --tw-text-opacity: 1;\n  color: rgb(156 163 175 / var(--tw-text-opacity));\n}\n.disabled\\:opacity-50:disabled {\n  opacity: 0.5;\n}\n.group:first-child .group-first\\:hidden {\n  display: none;\n}\n.group\\/body:first-child .group\\/row:first-child .group-first\\/body\\:group-first\\/row\\:first\\:rounded-tl-lg:first-child {\n  border-top-left-radius: 0.5rem;\n}\n.group\\/head:first-child .group-first\\/head\\:first\\:rounded-tl-lg:first-child {\n  border-top-left-radius: 0.5rem;\n}\n.group\\/body:first-child .group\\/row:first-child .group-first\\/body\\:group-first\\/row\\:last\\:rounded-tr-lg:last-child {\n  border-top-right-radius: 0.5rem;\n}\n.group\\/head:first-child .group-first\\/head\\:last\\:rounded-tr-lg:last-child {\n  border-top-right-radius: 0.5rem;\n}\n.group\\/body:last-child .group\\/row:last-child .group-last\\/body\\:group-last\\/row\\:first\\:rounded-bl-lg:first-child {\n  border-bottom-left-radius: 0.5rem;\n}\n.group\\/body:last-child .group\\/row:last-child .group-last\\/body\\:group-last\\/row\\:last\\:rounded-br-lg:last-child {\n  border-bottom-right-radius: 0.5rem;\n}\n.group:hover .group-hover\\:bg-blue-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(195 221 253 / var(--tw-bg-opacity));\n}\n.group:hover .group-hover\\:bg-cyan-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(165 243 252 / var(--tw-bg-opacity));\n}\n.group:hover .group-hover\\:bg-gray-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(229 231 235 / var(--tw-bg-opacity));\n}\n.group:hover .group-hover\\:bg-gray-300 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(209 213 219 / var(--tw-bg-opacity));\n}\n.group:hover .group-hover\\:bg-gray-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(107 114 128 / var(--tw-bg-opacity));\n}\n.group:hover .group-hover\\:bg-green-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(188 240 218 / var(--tw-bg-opacity));\n}\n.group:hover .group-hover\\:bg-indigo-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(205 219 254 / var(--tw-bg-opacity));\n}\n.group:hover .group-hover\\:bg-lime-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(217 249 157 / var(--tw-bg-opacity));\n}\n.group:hover .group-hover\\:bg-pink-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(250 209 232 / var(--tw-bg-opacity));\n}\n.group:hover .group-hover\\:bg-purple-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(220 215 254 / var(--tw-bg-opacity));\n}\n.group:hover .group-hover\\:bg-red-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(251 213 213 / var(--tw-bg-opacity));\n}\n.group:hover .group-hover\\:bg-teal-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(175 236 239 / var(--tw-bg-opacity));\n}\n.group:hover .group-hover\\:bg-white\\/50 {\n  background-color: rgb(255 255 255 / 0.5);\n}\n.group:hover .group-hover\\:bg-yellow-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(252 233 106 / var(--tw-bg-opacity));\n}\n.group:hover .group-hover\\:text-gray-900 {\n  --tw-text-opacity: 1;\n  color: rgb(17 24 39 / var(--tw-text-opacity));\n}\n.group:hover .group-hover\\:opacity-100 {\n  opacity: 1;\n}\n.group:hover .group-hover\\:opacity-50 {\n  opacity: 0.5;\n}\n.group:focus .group-focus\\:outline-none {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n}\n.group:focus .group-focus\\:ring-4 {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n}\n.group:focus .group-focus\\:ring-cyan-500\\/25 {\n  --tw-ring-color: rgb(6 182 212 / 0.25);\n}\n.group:focus .group-focus\\:ring-white {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(255 255 255 / var(--tw-ring-opacity));\n}\n.group:enabled:hover .group-enabled\\:group-hover\\:bg-opacity-0 {\n  --tw-bg-opacity: 0;\n}\n.group:enabled:hover .group-enabled\\:group-hover\\:text-inherit {\n  color: inherit;\n}\n.peer:-moz-placeholder-shown ~ .peer-placeholder-shown\\:top-1\\/2 {\n  top: 50%;\n}\n.peer:placeholder-shown ~ .peer-placeholder-shown\\:top-1\\/2 {\n  top: 50%;\n}\n.peer:-moz-placeholder-shown ~ .peer-placeholder-shown\\:-translate-y-1\\/2 {\n  --tw-translate-y: -50%;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.peer:placeholder-shown ~ .peer-placeholder-shown\\:-translate-y-1\\/2 {\n  --tw-translate-y: -50%;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.peer:-moz-placeholder-shown ~ .peer-placeholder-shown\\:translate-y-0 {\n  --tw-translate-y: 0px;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.peer:placeholder-shown ~ .peer-placeholder-shown\\:translate-y-0 {\n  --tw-translate-y: 0px;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.peer:-moz-placeholder-shown ~ .peer-placeholder-shown\\:scale-100 {\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.peer:placeholder-shown ~ .peer-placeholder-shown\\:scale-100 {\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.peer:focus ~ .peer-focus\\:left-0 {\n  left: 0px;\n}\n.peer:focus ~ .peer-focus\\:top-2 {\n  top: 0.5rem;\n}\n.peer:focus ~ .peer-focus\\:-translate-y-4 {\n  --tw-translate-y: -1rem;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.peer:focus ~ .peer-focus\\:-translate-y-6 {\n  --tw-translate-y: -1.5rem;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.peer:focus ~ .peer-focus\\:scale-75 {\n  --tw-scale-x: .75;\n  --tw-scale-y: .75;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.peer:focus ~ .peer-focus\\:px-2 {\n  padding-left: 0.5rem;\n  padding-right: 0.5rem;\n}\n.peer:focus ~ .peer-focus\\:text-blue-600 {\n  --tw-text-opacity: 1;\n  color: rgb(28 100 242 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:block) {\n  display: block;\n}\n:is(.dark .dark\\:hidden) {\n  display: none;\n}\n:is(.dark .dark\\:divide-gray-700) > :not([hidden]) ~ :not([hidden]) {\n  --tw-divide-opacity: 1;\n  border-color: rgb(55 65 81 / var(--tw-divide-opacity));\n}\n:is(.dark .dark\\:border-none) {\n  border-style: none;\n}\n:is(.dark .dark\\:border-cyan-400) {\n  --tw-border-opacity: 1;\n  border-color: rgb(34 211 238 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-cyan-500) {\n  --tw-border-opacity: 1;\n  border-color: rgb(6 182 212 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-cyan-600) {\n  --tw-border-opacity: 1;\n  border-color: rgb(8 145 178 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-gray-500) {\n  --tw-border-opacity: 1;\n  border-color: rgb(107 114 128 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-gray-600) {\n  --tw-border-opacity: 1;\n  border-color: rgb(75 85 99 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-gray-700) {\n  --tw-border-opacity: 1;\n  border-color: rgb(55 65 81 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-gray-800) {\n  --tw-border-opacity: 1;\n  border-color: rgb(31 41 55 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-gray-900) {\n  --tw-border-opacity: 1;\n  border-color: rgb(17 24 39 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-green-400) {\n  --tw-border-opacity: 1;\n  border-color: rgb(49 196 141 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-green-500) {\n  --tw-border-opacity: 1;\n  border-color: rgb(14 159 110 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-green-600) {\n  --tw-border-opacity: 1;\n  border-color: rgb(5 122 85 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-indigo-600) {\n  --tw-border-opacity: 1;\n  border-color: rgb(88 80 236 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-lime-600) {\n  --tw-border-opacity: 1;\n  border-color: rgb(101 163 13 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-pink-600) {\n  --tw-border-opacity: 1;\n  border-color: rgb(214 31 105 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-red-400) {\n  --tw-border-opacity: 1;\n  border-color: rgb(249 128 128 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-red-500) {\n  --tw-border-opacity: 1;\n  border-color: rgb(240 82 82 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-red-600) {\n  --tw-border-opacity: 1;\n  border-color: rgb(224 36 36 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-teal-600) {\n  --tw-border-opacity: 1;\n  border-color: rgb(4 116 129 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-white) {\n  --tw-border-opacity: 1;\n  border-color: rgb(255 255 255 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-yellow-400) {\n  --tw-border-opacity: 1;\n  border-color: rgb(227 160 8 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:border-yellow-600) {\n  --tw-border-opacity: 1;\n  border-color: rgb(159 88 10 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:\\!bg-gray-700) {\n  --tw-bg-opacity: 1 !important;\n  background-color: rgb(55 65 81 / var(--tw-bg-opacity)) !important;\n}\n:is(.dark .dark\\:bg-black) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(0 0 0 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-blue-200) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(195 221 253 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-blue-600) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(28 100 242 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-cyan-100) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(207 250 254 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-cyan-200) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(165 243 252 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-cyan-600) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(8 145 178 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-cyan-900) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(22 78 99 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-gray-200) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(229 231 235 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-gray-300) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(209 213 219 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-gray-400) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(156 163 175 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-gray-500) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(107 114 128 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-gray-600) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(75 85 99 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-gray-700) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(55 65 81 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-gray-800) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(31 41 55 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-gray-800\\/30) {\n  background-color: rgb(31 41 55 / 0.3);\n}\n:is(.dark .dark\\:bg-gray-800\\/50) {\n  background-color: rgb(31 41 55 / 0.5);\n}\n:is(.dark .dark\\:bg-gray-900) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(17 24 39 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-green-100) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(222 247 236 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-green-200) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(188 240 218 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-green-500) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(14 159 110 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-green-600) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(5 122 85 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-green-900) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(1 71 55 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-indigo-200) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(205 219 254 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-indigo-500) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(104 117 245 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-indigo-600) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(88 80 236 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-lime-200) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(217 249 157 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-lime-600) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(101 163 13 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-pink-200) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(250 209 232 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-pink-600) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(214 31 105 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-purple-200) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(220 215 254 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-purple-500) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(144 97 249 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-purple-600) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(126 58 242 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-purple-900) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(74 29 150 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-red-100) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(253 232 232 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-red-200) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(251 213 213 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-red-500) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(240 82 82 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-red-600) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(224 36 36 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-red-900) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(119 29 29 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-teal-200) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(175 236 239 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-teal-600) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(4 116 129 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-transparent) {\n  background-color: transparent;\n}\n:is(.dark .dark\\:bg-yellow-100) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(253 246 178 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-yellow-200) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(252 233 106 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-yellow-600) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(159 88 10 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-yellow-800) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(114 59 19 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-yellow-900) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(99 49 18 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:bg-opacity-80) {\n  --tw-bg-opacity: 0.8;\n}\n:is(.dark .dark\\:fill-gray-300) {\n  fill: #D1D5DB;\n}\n:is(.dark .dark\\:text-blue-600) {\n  --tw-text-opacity: 1;\n  color: rgb(28 100 242 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-blue-800) {\n  --tw-text-opacity: 1;\n  color: rgb(30 66 159 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-blue-900) {\n  --tw-text-opacity: 1;\n  color: rgb(35 56 118 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-cyan-100) {\n  --tw-text-opacity: 1;\n  color: rgb(207 250 254 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-cyan-300) {\n  --tw-text-opacity: 1;\n  color: rgb(103 232 249 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-cyan-500) {\n  --tw-text-opacity: 1;\n  color: rgb(6 182 212 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-cyan-600) {\n  --tw-text-opacity: 1;\n  color: rgb(8 145 178 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-cyan-800) {\n  --tw-text-opacity: 1;\n  color: rgb(21 94 117 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-cyan-900) {\n  --tw-text-opacity: 1;\n  color: rgb(22 78 99 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-gray-100) {\n  --tw-text-opacity: 1;\n  color: rgb(243 244 246 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-gray-200) {\n  --tw-text-opacity: 1;\n  color: rgb(229 231 235 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-gray-300) {\n  --tw-text-opacity: 1;\n  color: rgb(209 213 219 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-gray-400) {\n  --tw-text-opacity: 1;\n  color: rgb(156 163 175 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-gray-500) {\n  --tw-text-opacity: 1;\n  color: rgb(107 114 128 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-gray-600) {\n  --tw-text-opacity: 1;\n  color: rgb(75 85 99 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-gray-800) {\n  --tw-text-opacity: 1;\n  color: rgb(31 41 55 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-gray-900) {\n  --tw-text-opacity: 1;\n  color: rgb(17 24 39 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-green-400) {\n  --tw-text-opacity: 1;\n  color: rgb(49 196 141 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-green-500) {\n  --tw-text-opacity: 1;\n  color: rgb(14 159 110 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-green-600) {\n  --tw-text-opacity: 1;\n  color: rgb(5 122 85 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-green-800) {\n  --tw-text-opacity: 1;\n  color: rgb(3 84 63 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-green-900) {\n  --tw-text-opacity: 1;\n  color: rgb(1 71 55 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-indigo-600) {\n  --tw-text-opacity: 1;\n  color: rgb(88 80 236 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-indigo-800) {\n  --tw-text-opacity: 1;\n  color: rgb(66 56 157 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-indigo-900) {\n  --tw-text-opacity: 1;\n  color: rgb(54 47 120 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-lime-600) {\n  --tw-text-opacity: 1;\n  color: rgb(101 163 13 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-lime-800) {\n  --tw-text-opacity: 1;\n  color: rgb(63 98 18 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-lime-900) {\n  --tw-text-opacity: 1;\n  color: rgb(54 83 20 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-pink-600) {\n  --tw-text-opacity: 1;\n  color: rgb(214 31 105 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-pink-800) {\n  --tw-text-opacity: 1;\n  color: rgb(153 21 75 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-pink-900) {\n  --tw-text-opacity: 1;\n  color: rgb(117 26 61 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-purple-600) {\n  --tw-text-opacity: 1;\n  color: rgb(126 58 242 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-purple-800) {\n  --tw-text-opacity: 1;\n  color: rgb(85 33 181 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-purple-900) {\n  --tw-text-opacity: 1;\n  color: rgb(74 29 150 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-red-400) {\n  --tw-text-opacity: 1;\n  color: rgb(249 128 128 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-red-500) {\n  --tw-text-opacity: 1;\n  color: rgb(240 82 82 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-red-600) {\n  --tw-text-opacity: 1;\n  color: rgb(224 36 36 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-red-800) {\n  --tw-text-opacity: 1;\n  color: rgb(155 28 28 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-red-900) {\n  --tw-text-opacity: 1;\n  color: rgb(119 29 29 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-teal-600) {\n  --tw-text-opacity: 1;\n  color: rgb(4 116 129 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-teal-800) {\n  --tw-text-opacity: 1;\n  color: rgb(5 80 92 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-teal-900) {\n  --tw-text-opacity: 1;\n  color: rgb(1 68 81 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-white) {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-yellow-600) {\n  --tw-text-opacity: 1;\n  color: rgb(159 88 10 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-yellow-800) {\n  --tw-text-opacity: 1;\n  color: rgb(114 59 19 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:text-yellow-900) {\n  --tw-text-opacity: 1;\n  color: rgb(99 49 18 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:placeholder-gray-400)::-moz-placeholder {\n  --tw-placeholder-opacity: 1;\n  color: rgb(156 163 175 / var(--tw-placeholder-opacity));\n}\n:is(.dark .dark\\:placeholder-gray-400)::placeholder {\n  --tw-placeholder-opacity: 1;\n  color: rgb(156 163 175 / var(--tw-placeholder-opacity));\n}\n:is(.dark .dark\\:mix-blend-color) {\n  mix-blend-mode: color;\n}\n:is(.dark .dark\\:shadow-sm-light) {\n  --tw-shadow: 0 2px 5px 0px rgba(255, 255, 255, 0.08);\n  --tw-shadow-colored: 0 2px 5px 0px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n:is(.dark .dark\\:ring-cyan-800) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(21 94 117 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:ring-gray-400) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(156 163 175 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:ring-gray-500) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(107 114 128 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:ring-gray-800) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(31 41 55 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:ring-gray-900) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(17 24 39 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:ring-green-500) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(14 159 110 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:ring-pink-500) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(231 70 148 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:ring-purple-600) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(126 58 242 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:ring-red-700) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(200 30 30 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:ring-yellow-500) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(194 120 3 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:ring-offset-blue-700) {\n  --tw-ring-offset-color: #1A56DB;\n}\n:is(.dark .dark\\:ring-offset-cyan-600) {\n  --tw-ring-offset-color: #0891b2;\n}\n:is(.dark .dark\\:ring-offset-gray-800) {\n  --tw-ring-offset-color: #1F2937;\n}\n:is(.dark .dark\\:ring-offset-gray-900) {\n  --tw-ring-offset-color: #111827;\n}\n:is(.dark .dark\\:ring-offset-green-600) {\n  --tw-ring-offset-color: #057A55;\n}\n:is(.dark .dark\\:ring-offset-green-800) {\n  --tw-ring-offset-color: #03543F;\n}\n:is(.dark .dark\\:ring-offset-indigo-700) {\n  --tw-ring-offset-color: #5145CD;\n}\n:is(.dark .dark\\:ring-offset-lime-700) {\n  --tw-ring-offset-color: #4d7c0f;\n}\n:is(.dark .dark\\:ring-offset-pink-600) {\n  --tw-ring-offset-color: #D61F69;\n}\n:is(.dark .dark\\:ring-offset-purple-600) {\n  --tw-ring-offset-color: #7E3AF2;\n}\n:is(.dark .dark\\:ring-offset-red-600) {\n  --tw-ring-offset-color: #E02424;\n}\n:is(.dark .dark\\:ring-offset-red-900) {\n  --tw-ring-offset-color: #771D1D;\n}\n:is(.dark .dark\\:ring-offset-teal-600) {\n  --tw-ring-offset-color: #047481;\n}\n:is(.dark .dark\\:ring-offset-yellow-400) {\n  --tw-ring-offset-color: #E3A008;\n}\n:is(.dark .odd\\:dark\\:bg-gray-800):nth-child(odd) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(31 41 55 / var(--tw-bg-opacity));\n}\n:is(.dark .even\\:dark\\:bg-gray-700):nth-child(even) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(55 65 81 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:hover\\:bg-blue-300:hover) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(164 202 254 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:hover\\:bg-blue-700:hover) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(26 86 219 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:hover\\:bg-cyan-300:hover) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(103 232 249 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:hover\\:bg-cyan-700:hover) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(14 116 144 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:hover\\:bg-gray-300:hover) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(209 213 219 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:hover\\:bg-gray-600:hover) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(75 85 99 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:hover\\:bg-gray-700:hover) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(55 65 81 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:hover\\:bg-gray-800:hover) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(31 41 55 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:hover\\:bg-green-300:hover) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(132 225 188 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:hover\\:bg-indigo-300:hover) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(180 198 252 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:hover\\:bg-lime-300:hover) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(190 242 100 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:hover\\:bg-pink-300:hover) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(248 180 217 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:hover\\:bg-purple-300:hover) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(202 191 253 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:hover\\:bg-red-300:hover) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(248 180 180 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:hover\\:bg-teal-300:hover) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(126 220 226 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:hover\\:bg-yellow-300:hover) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(250 202 21 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:hover\\:text-gray-300:hover) {\n  --tw-text-opacity: 1;\n  color: rgb(209 213 219 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:hover\\:text-white:hover) {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:focus\\:border-blue-500:focus) {\n  --tw-border-opacity: 1;\n  border-color: rgb(63 131 248 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:focus\\:border-cyan-500:focus) {\n  --tw-border-opacity: 1;\n  border-color: rgb(6 182 212 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:focus\\:border-green-500:focus) {\n  --tw-border-opacity: 1;\n  border-color: rgb(14 159 110 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:focus\\:border-red-500:focus) {\n  --tw-border-opacity: 1;\n  border-color: rgb(240 82 82 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:focus\\:border-yellow-500:focus) {\n  --tw-border-opacity: 1;\n  border-color: rgb(194 120 3 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:focus\\:bg-cyan-600:focus) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(8 145 178 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:focus\\:bg-gray-600:focus) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(75 85 99 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:focus\\:text-white:focus) {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-blue-700:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(26 86 219 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-blue-800:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(30 66 159 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-cyan-500:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(6 182 212 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-cyan-600:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(8 145 178 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-cyan-700:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(14 116 144 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-cyan-800:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(21 94 117 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-gray-500:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(107 114 128 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-gray-600:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(75 85 99 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-gray-700:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(55 65 81 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-gray-800:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(31 41 55 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-gray-900:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(17 24 39 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-green-500:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(14 159 110 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-green-600:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(5 122 85 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-green-700:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(4 108 78 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-green-800:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(3 84 63 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-indigo-700:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(81 69 205 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-lime-700:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(77 124 15 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-lime-800:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(63 98 18 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-pink-600:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(214 31 105 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-pink-700:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(191 18 93 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-pink-800:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(153 21 75 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-purple-600:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(126 58 242 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-purple-800:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(85 33 181 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-purple-900:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(74 29 150 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-red-400:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(249 128 128 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-red-500:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(240 82 82 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-red-600:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(224 36 36 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-red-700:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(200 30 30 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-red-800:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(155 28 28 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-red-900:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(119 29 29 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-teal-600:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(4 116 129 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-teal-700:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(3 102 114 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-teal-800:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(5 80 92 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-yellow-400:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(227 160 8 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-yellow-500:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(194 120 3 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-yellow-700:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(142 75 16 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:focus\\:ring-yellow-900:focus) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(99 49 18 / var(--tw-ring-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:border-cyan-700:hover:enabled) {\n  --tw-border-opacity: 1;\n  border-color: rgb(14 116 144 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:border-gray-700:hover:enabled) {\n  --tw-border-opacity: 1;\n  border-color: rgb(55 65 81 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:border-green-700:hover:enabled) {\n  --tw-border-opacity: 1;\n  border-color: rgb(4 108 78 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:border-indigo-700:hover:enabled) {\n  --tw-border-opacity: 1;\n  border-color: rgb(81 69 205 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:border-lime-700:hover:enabled) {\n  --tw-border-opacity: 1;\n  border-color: rgb(77 124 15 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:border-pink-700:hover:enabled) {\n  --tw-border-opacity: 1;\n  border-color: rgb(191 18 93 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:border-red-700:hover:enabled) {\n  --tw-border-opacity: 1;\n  border-color: rgb(200 30 30 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:border-teal-700:hover:enabled) {\n  --tw-border-opacity: 1;\n  border-color: rgb(3 102 114 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:border-yellow-700:hover:enabled) {\n  --tw-border-opacity: 1;\n  border-color: rgb(142 75 16 / var(--tw-border-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:bg-cyan-700:hover:enabled) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(14 116 144 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:bg-gray-700:hover:enabled) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(55 65 81 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:bg-green-700:hover:enabled) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(4 108 78 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:bg-indigo-700:hover:enabled) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(81 69 205 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:bg-lime-700:hover:enabled) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(77 124 15 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:bg-pink-700:hover:enabled) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(191 18 93 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:bg-purple-700:hover:enabled) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(108 43 217 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:bg-red-700:hover:enabled) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(200 30 30 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:bg-teal-700:hover:enabled) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(3 102 114 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:bg-yellow-700:hover:enabled) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(142 75 16 / var(--tw-bg-opacity));\n}\n:is(.dark .enabled\\:dark\\:hover\\:bg-gray-700:hover):enabled {\n  --tw-bg-opacity: 1;\n  background-color: rgb(55 65 81 / var(--tw-bg-opacity));\n}\n:is(.dark .dark\\:enabled\\:hover\\:text-white:hover:enabled) {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity));\n}\n:is(.dark .enabled\\:dark\\:hover\\:text-white:hover):enabled {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity));\n}\n:is(.dark .disabled\\:dark\\:text-gray-500):disabled {\n  --tw-text-opacity: 1;\n  color: rgb(107 114 128 / var(--tw-text-opacity));\n}\n:is(.dark .group:hover .dark\\:group-hover\\:bg-blue-300) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(164 202 254 / var(--tw-bg-opacity));\n}\n:is(.dark .group:hover .dark\\:group-hover\\:bg-cyan-300) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(103 232 249 / var(--tw-bg-opacity));\n}\n:is(.dark .group:hover .dark\\:group-hover\\:bg-gray-500) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(107 114 128 / var(--tw-bg-opacity));\n}\n:is(.dark .group:hover .dark\\:group-hover\\:bg-gray-600) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(75 85 99 / var(--tw-bg-opacity));\n}\n:is(.dark .group:hover .dark\\:group-hover\\:bg-gray-700) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(55 65 81 / var(--tw-bg-opacity));\n}\n:is(.dark .group:hover .dark\\:group-hover\\:bg-gray-800\\/60) {\n  background-color: rgb(31 41 55 / 0.6);\n}\n:is(.dark .group:hover .dark\\:group-hover\\:bg-green-300) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(132 225 188 / var(--tw-bg-opacity));\n}\n:is(.dark .group:hover .dark\\:group-hover\\:bg-indigo-300) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(180 198 252 / var(--tw-bg-opacity));\n}\n:is(.dark .group:hover .dark\\:group-hover\\:bg-lime-300) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(190 242 100 / var(--tw-bg-opacity));\n}\n:is(.dark .group:hover .dark\\:group-hover\\:bg-pink-300) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(248 180 217 / var(--tw-bg-opacity));\n}\n:is(.dark .group:hover .dark\\:group-hover\\:bg-purple-300) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(202 191 253 / var(--tw-bg-opacity));\n}\n:is(.dark .group:hover .dark\\:group-hover\\:bg-red-300) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(248 180 180 / var(--tw-bg-opacity));\n}\n:is(.dark .group:hover .dark\\:group-hover\\:bg-teal-300) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(126 220 226 / var(--tw-bg-opacity));\n}\n:is(.dark .group:hover .dark\\:group-hover\\:bg-yellow-300) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(250 202 21 / var(--tw-bg-opacity));\n}\n:is(.dark .group:hover .dark\\:group-hover\\:text-white) {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity));\n}\n:is(.dark .group:focus .dark\\:group-focus\\:ring-gray-800\\/70) {\n  --tw-ring-color: rgb(31 41 55 / 0.7);\n}\n.peer:focus ~ :is(.dark .peer-focus\\:dark\\:text-blue-500) {\n  --tw-text-opacity: 1;\n  color: rgb(63 131 248 / var(--tw-text-opacity));\n}\n@media (min-width: 640px) {\n\n  .sm\\:col-span-1 {\n    grid-column: span 1 / span 1;\n  }\n\n  .sm\\:mx-auto {\n    margin-left: auto;\n    margin-right: auto;\n  }\n\n  .sm\\:mb-0 {\n    margin-bottom: 0px;\n  }\n\n  .sm\\:mt-0 {\n    margin-top: 0px;\n  }\n\n  .sm\\:flex {\n    display: flex;\n  }\n\n  .sm\\:grid {\n    display: grid;\n  }\n\n  .sm\\:h-10 {\n    height: 2.5rem;\n  }\n\n  .sm\\:h-6 {\n    height: 1.5rem;\n  }\n\n  .sm\\:h-7 {\n    height: 1.75rem;\n  }\n\n  .sm\\:w-10 {\n    width: 2.5rem;\n  }\n\n  .sm\\:w-6 {\n    width: 1.5rem;\n  }\n\n  .sm\\:grid-cols-2 {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n\n  .sm\\:gap-4 {\n    gap: 1rem;\n  }\n\n  .sm\\:px-4 {\n    padding-left: 1rem;\n    padding-right: 1rem;\n  }\n\n  .sm\\:px-6 {\n    padding-left: 1.5rem;\n    padding-right: 1.5rem;\n  }\n\n  .sm\\:pr-8 {\n    padding-right: 2rem;\n  }\n\n  .sm\\:text-center {\n    text-align: center;\n  }\n\n  .sm\\:text-base {\n    font-size: 1rem;\n    line-height: 1.5rem;\n  }\n\n  .sm\\:text-xs {\n    font-size: 0.75rem;\n    line-height: 1rem;\n  }\n}\n@media (min-width: 768px) {\n\n  .md\\:inset-0 {\n    inset: 0px;\n  }\n\n  .md\\:mx-2 {\n    margin-left: 0.5rem;\n    margin-right: 0.5rem;\n  }\n\n  .md\\:mr-6 {\n    margin-right: 1.5rem;\n  }\n\n  .md\\:mt-0 {\n    margin-top: 0px;\n  }\n\n  .md\\:block {\n    display: block;\n  }\n\n  .md\\:flex {\n    display: flex;\n  }\n\n  .md\\:hidden {\n    display: none;\n  }\n\n  .md\\:h-auto {\n    height: auto;\n  }\n\n  .md\\:h-full {\n    height: 100%;\n  }\n\n  .md\\:w-48 {\n    width: 12rem;\n  }\n\n  .md\\:w-auto {\n    width: auto;\n  }\n\n  .md\\:max-w-xl {\n    max-width: 36rem;\n  }\n\n  .md\\:flex-row {\n    flex-direction: row;\n  }\n\n  .md\\:items-center {\n    align-items: center;\n  }\n\n  .md\\:justify-between {\n    justify-content: space-between;\n  }\n\n  .md\\:space-x-8 > :not([hidden]) ~ :not([hidden]) {\n    --tw-space-x-reverse: 0;\n    margin-right: calc(2rem * var(--tw-space-x-reverse));\n    margin-left: calc(2rem * calc(1 - var(--tw-space-x-reverse)));\n  }\n\n  .md\\:rounded-none {\n    border-radius: 0px;\n  }\n\n  .md\\:rounded-l-lg {\n    border-top-left-radius: 0.5rem;\n    border-bottom-left-radius: 0.5rem;\n  }\n\n  .md\\:border-0 {\n    border-width: 0px;\n  }\n\n  .md\\:bg-transparent {\n    background-color: transparent;\n  }\n\n  .md\\:p-0 {\n    padding: 0px;\n  }\n\n  .md\\:text-sm {\n    font-size: 0.875rem;\n    line-height: 1.25rem;\n  }\n\n  .md\\:font-medium {\n    font-weight: 500;\n  }\n\n  .md\\:text-cyan-700 {\n    --tw-text-opacity: 1;\n    color: rgb(14 116 144 / var(--tw-text-opacity));\n  }\n\n  .md\\:hover\\:bg-transparent:hover {\n    background-color: transparent;\n  }\n\n  .md\\:hover\\:text-cyan-700:hover {\n    --tw-text-opacity: 1;\n    color: rgb(14 116 144 / var(--tw-text-opacity));\n  }\n\n  :is(.dark .md\\:dark\\:hover\\:bg-transparent:hover) {\n    background-color: transparent;\n  }\n\n  :is(.dark .md\\:dark\\:hover\\:text-white:hover) {\n    --tw-text-opacity: 1;\n    color: rgb(255 255 255 / var(--tw-text-opacity));\n  }\n}\n@media (min-width: 1024px) {\n\n  .lg\\:my-8 {\n    margin-top: 2rem;\n    margin-bottom: 2rem;\n  }\n}\n.\\[\\&\\:\\:-webkit-scrollbar\\]\\:\\!hidden::-webkit-scrollbar {\n  display: none !important;\n}\n.\\[\\&\\:\\:-webkit-scrollbar\\]\\:\\!h-0::-webkit-scrollbar {\n  height: 0px !important;\n}\n.\\[\\&\\:\\:-webkit-scrollbar\\]\\:\\!w-0::-webkit-scrollbar {\n  width: 0px !important;\n}\n.\\[\\&\\:\\:-webkit-scrollbar\\]\\:\\!bg-transparent::-webkit-scrollbar {\n  background-color: transparent !important;\n}\n.\\[\\&\\>\\*\\]\\:pointer-events-none>* {\n  pointer-events: none;\n}\n.\\[\\&\\>\\*\\]\\:cursor-grab>* {\n  cursor: grab;\n}\n.\\[\\&\\>\\*\\]\\:first\\:rounded-t-lg:first-child>* {\n  border-top-left-radius: 0.5rem;\n  border-top-right-radius: 0.5rem;\n}\n.\\[\\&\\>\\*\\]\\:last\\:rounded-b-lg:last-child>* {\n  border-bottom-right-radius: 0.5rem;\n  border-bottom-left-radius: 0.5rem;\n}\n.\\[\\&\\>\\*\\]\\:last\\:border-b-0:last-child>* {\n  border-bottom-width: 0px;\n}\n`,
          "",
          {
            version: 3,
            sources: ["webpack://./src/popup/popup.css"],
            names: [],
            mappings:
              "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AAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,wBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,uBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,uBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,uBAAmB;EAAnB;AAAmB;AAAnB;EAAA,yBAAmB;EAAnB;AAAmB;AAAnB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;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,6BAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,4DAAmB;EAAnB,oEAAmB;EAAnB;AAAmB;AAAnB;EAAA,4DAAmB;EAAnB,mEAAmB;EAAnB;AAAmB;AAAnB;EAAA,4DAAmB;EAAnB,oEAAmB;EAAnB;AAAmB;AAAnB;EAAA,4DAAmB;EAAnB,qEAAmB;EAAnB;AAAmB;AAAnB;EAAA,4DAAmB;EAAnB,qEAAmB;EAAnB;AAAmB;AAAnB;EAAA,4DAAmB;EAAnB,oEAAmB;EAAnB;AAAmB;AAAnB;EAAA,4DAAmB;EAAnB,oEAAmB;EAAnB;AAAmB;AAAnB;EAAA,4DAAmB;EAAnB,oEAAmB;EAAnB;AAAmB;AAAnB;EAAA,4DAAmB;EAAnB,qEAAmB;EAAnB;AAAmB;AAAnB;EAAA,4DAAmB;EAAnB,qEAAmB;EAAnB;AAAmB;AAAnB;EA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AnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,2BAAmB;EAAnB;AAAmB;AAAnB;EAAA,2BAAmB;EAAnB;AAAmB;AAAnB;EAAA,2BAAmB;EAAnB;AAAmB;AAAnB;EAAA,2BAAmB;EAAnB;AAAmB;AAAnB;EAAA,2BAAmB;EAAnB;AAAmB;AAAnB;EAAA,2BAAmB;EAAnB;AAAmB;AAAnB;EAAA,2BAAmB;EAAnB;AAAmB;AAAnB;E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AA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;A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EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,2BAGA;EAHA;AAGA;AAHA;EAAA,2BAGA;EAHA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA,oDAGA;EAHA,yDAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,sBAGA;EAHA;AAGA;AAHA;EAAA,sBAGA;EAHA;AAGA;AAHA;EAAA,sBAGA;EAHA;AAGA;AAHA;EAAA,sBAGA;EAHA;AAGA;AAHA;EAAA,sBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,sBAGA;EAHA;AAGA;AAHA;EAAA,sBAGA;EAHA;AAGA;AAHA;EAAA,sBAGA;EAHA;AAGA;AAHA;EAAA,sBAGA;EAHA;AAGA;AAHA;EAAA,sBAGA;EAHA;AAGA;AAHA;EAAA,sBAGA;EAHA;AAGA;AAHA;EAAA,sBAGA;EAHA;AAGA;AAHA;EAAA,sBAGA;EAHA;AAGA;AAHA;EAAA,sBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,kBAGA;EAHA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA,oBAGA;EAHA;AAGA;AAHA;;EAAA;IAAA;EAGA;;EAHA;IAAA,iBAGA;IAHA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA,kBAGA;IAHA;EAGA;;EAHA;IAAA,oBAGA;IAHA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA,eAGA;IAHA;EAGA;;EAHA;IAAA,kBAGA;IAHA;EAGA;AAAA;AAHA;;EAAA;IAAA;EAGA;;EAHA;IAAA,mBAGA;IAHA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA,uBAGA;IAHA,oDAGA;IAHA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA,8BAGA;IAHA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA,mBAGA;IAHA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA,oBAGA;IAHA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA,oBAGA;IAHA;EAGA;;EAHA;IAAA;EAGA;;EAHA;IAAA,oBAGA;IAHA;EAGA;AAAA;AAHA;;EAAA;IAAA,gBAGA;IAHA;EAGA;AAAA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA;AAGA;AAHA;EAAA,8BAGA;EAHA;AAGA;AAHA;EAAA,kCAGA;EAHA;AAGA;AAHA;EAAA;AAGA",
            sourcesContent: [
              "@tailwind base;\r\n@tailwind components;\r\n@tailwind utilities;\r\n",
            ],
            sourceRoot: "",
          },
        ]);
        const x = b;
      },
    },
    e = {};
  function o(A) {
    var n = e[A];
    if (void 0 !== n) return n.exports;
    var t = (e[A] = { id: A, loaded: !1, exports: {} });
    return (r[A].call(t.exports, t, t.exports, o), (t.loaded = !0), t.exports);
  }
  ((o.m = r),
    (A = []),
    (o.O = (n, t, r, e) => {
      if (!t) {
        var a = 1 / 0;
        for (d = 0; d < A.length; d++) {
          for (var [t, r, e] = A[d], i = !0, c = 0; c < t.length; c++)
            (!1 & e || a >= e) && Object.keys(o.O).every((A) => o.O[A](t[c]))
              ? t.splice(c--, 1)
              : ((i = !1), e < a && (a = e));
          if (i) {
            A.splice(d--, 1);
            var l = r();
            void 0 !== l && (n = l);
          }
        }
        return n;
      }
      e = e || 0;
      for (var d = A.length; d > 0 && A[d - 1][2] > e; d--) A[d] = A[d - 1];
      A[d] = [t, r, e];
    }),
    (o.n = (A) => {
      var n = A && A.__esModule ? () => A.default : () => A;
      return (o.d(n, { a: n }), n);
    }),
    (t = Object.getPrototypeOf
      ? (A) => Object.getPrototypeOf(A)
      : (A) => A.__proto__),
    (o.t = function (A, r) {
      if ((1 & r && (A = this(A)), 8 & r)) return A;
      if ("object" == typeof A && A) {
        if (4 & r && A.__esModule) return A;
        if (16 & r && "function" == typeof A.then) return A;
      }
      var e = Object.create(null);
      o.r(e);
      var a = {};
      n = n || [null, t({}), t([]), t(t)];
      for (var i = 2 & r && A; "object" == typeof i && !~n.indexOf(i); i = t(i))
        Object.getOwnPropertyNames(i).forEach((n) => (a[n] = () => A[n]));
      return ((a.default = () => A), o.d(e, a), e);
    }),
    (o.d = (A, n) => {
      for (var t in n)
        o.o(n, t) &&
          !o.o(A, t) &&
          Object.defineProperty(A, t, { enumerable: !0, get: n[t] });
    }),
    (o.g = (function () {
      if ("object" == typeof globalThis) return globalThis;
      try {
        return this || new Function("return this")();
      } catch (A) {
        if ("object" == typeof window) return window;
      }
    })()),
    (o.o = (A, n) => Object.prototype.hasOwnProperty.call(A, n)),
    (o.r = (A) => {
      ("undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(A, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(A, "__esModule", { value: !0 }));
    }),
    (o.nmd = (A) => ((A.paths = []), A.children || (A.children = []), A)),
    (() => {
      o.b = document.baseURI || self.location.href;
      var A = { 887: 0 };
      o.O.j = (n) => 0 === A[n];
      var n = (n, t) => {
          var r,
            e,
            [a, i, c] = t,
            l = 0;
          if (a.some((n) => 0 !== A[n])) {
            for (r in i) o.o(i, r) && (o.m[r] = i[r]);
            if (c) var d = c(o);
          }
          for (n && n(t); l < a.length; l++)
            ((e = a[l]), o.o(A, e) && A[e] && A[e][0](), (A[e] = 0));
          return o.O(d);
        },
        t = (self.webpackChunkreactboilerplate =
          self.webpackChunkreactboilerplate || []);
      (t.forEach(n.bind(null, 0)), (t.push = n.bind(null, t.push.bind(t))));
    })(),
    (o.nc = void 0));
  var a = o.O(void 0, [583, 857, 207], () => o(2137));
  a = o.O(a);
})();
