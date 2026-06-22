"use strict";
(self.webpackChunkreactboilerplate =
  self.webpackChunkreactboilerplate || []).push([
  [207],
  {
    7723: (e, t, a) => {
      a.d(t, { LE: () => V, qX: () => M, t: () => z, xC: () => k });
      var i = a(4174),
        o = a(731),
        n = a(1507),
        r = a(7980),
        s = a(9423),
        u = a(4605),
        l = a(5894),
        c = a(6725),
        d = a(6040);
      function p() {
        p = function () {
          return t;
        };
        var e,
          t = {},
          a = Object.prototype,
          i = a.hasOwnProperty,
          o =
            Object.defineProperty ||
            function (e, t, a) {
              e[t] = a.value;
            },
          n = "function" == typeof Symbol ? Symbol : {},
          r = n.iterator || "@@iterator",
          s = n.asyncIterator || "@@asyncIterator",
          u = n.toStringTag || "@@toStringTag";
        function l(e, t, a) {
          return (
            Object.defineProperty(e, t, {
              value: a,
              enumerable: !0,
              configurable: !0,
              writable: !0,
            }),
            e[t]
          );
        }
        try {
          l({}, "");
        } catch (e) {
          l = function (e, t, a) {
            return (e[t] = a);
          };
        }
        function c(e, t, a, i) {
          var n = t && t.prototype instanceof b ? t : b,
            r = Object.create(n.prototype),
            s = new L(i || []);
          return (o(r, "_invoke", { value: M(e, a, s) }), r);
        }
        function d(e, t, a) {
          try {
            return { type: "normal", arg: e.call(t, a) };
          } catch (e) {
            return { type: "throw", arg: e };
          }
        }
        t.wrap = c;
        var m = "suspendedStart",
          h = "suspendedYield",
          f = "executing",
          S = "completed",
          v = {};
        function b() {}
        function T() {}
        function y() {}
        var x = {};
        l(x, r, function () {
          return this;
        });
        var P = Object.getPrototypeOf,
          w = P && P(P(E([])));
        w && w !== a && i.call(w, r) && (x = w);
        var k = (y.prototype = b.prototype = Object.create(x));
        function D(e) {
          ["next", "throw", "return"].forEach(function (t) {
            l(e, t, function (e) {
              return this._invoke(t, e);
            });
          });
        }
        function z(e, t) {
          function a(o, n, r, s) {
            var u = d(e[o], e, n);
            if ("throw" !== u.type) {
              var l = u.arg,
                c = l.value;
              return c && "object" == g(c) && i.call(c, "__await")
                ? t.resolve(c.__await).then(
                    function (e) {
                      a("next", e, r, s);
                    },
                    function (e) {
                      a("throw", e, r, s);
                    },
                  )
                : t.resolve(c).then(
                    function (e) {
                      ((l.value = e), r(l));
                    },
                    function (e) {
                      return a("throw", e, r, s);
                    },
                  );
            }
            s(u.arg);
          }
          var n;
          o(this, "_invoke", {
            value: function (e, i) {
              function o() {
                return new t(function (t, o) {
                  a(e, i, t, o);
                });
              }
              return (n = n ? n.then(o, o) : o());
            },
          });
        }
        function M(t, a, i) {
          var o = m;
          return function (n, r) {
            if (o === f) throw new Error("Generator is already running");
            if (o === S) {
              if ("throw" === n) throw r;
              return { value: e, done: !0 };
            }
            for (i.method = n, i.arg = r; ; ) {
              var s = i.delegate;
              if (s) {
                var u = V(s, i);
                if (u) {
                  if (u === v) continue;
                  return u;
                }
              }
              if ("next" === i.method) i.sent = i._sent = i.arg;
              else if ("throw" === i.method) {
                if (o === m) throw ((o = S), i.arg);
                i.dispatchException(i.arg);
              } else "return" === i.method && i.abrupt("return", i.arg);
              o = f;
              var l = d(t, a, i);
              if ("normal" === l.type) {
                if (((o = i.done ? S : h), l.arg === v)) continue;
                return { value: l.arg, done: i.done };
              }
              "throw" === l.type &&
                ((o = S), (i.method = "throw"), (i.arg = l.arg));
            }
          };
        }
        function V(t, a) {
          var i = a.method,
            o = t.iterator[i];
          if (o === e)
            return (
              (a.delegate = null),
              ("throw" === i &&
                t.iterator.return &&
                ((a.method = "return"),
                (a.arg = e),
                V(t, a),
                "throw" === a.method)) ||
                ("return" !== i &&
                  ((a.method = "throw"),
                  (a.arg = new TypeError(
                    "The iterator does not provide a '" + i + "' method",
                  )))),
              v
            );
          var n = d(o, t.iterator, a.arg);
          if ("throw" === n.type)
            return (
              (a.method = "throw"),
              (a.arg = n.arg),
              (a.delegate = null),
              v
            );
          var r = n.arg;
          return r
            ? r.done
              ? ((a[t.resultName] = r.value),
                (a.next = t.nextLoc),
                "return" !== a.method && ((a.method = "next"), (a.arg = e)),
                (a.delegate = null),
                v)
              : r
            : ((a.method = "throw"),
              (a.arg = new TypeError("iterator result is not an object")),
              (a.delegate = null),
              v);
        }
        function O(e) {
          var t = { tryLoc: e[0] };
          (1 in e && (t.catchLoc = e[1]),
            2 in e && ((t.finallyLoc = e[2]), (t.afterLoc = e[3])),
            this.tryEntries.push(t));
        }
        function C(e) {
          var t = e.completion || {};
          ((t.type = "normal"), delete t.arg, (e.completion = t));
        }
        function L(e) {
          ((this.tryEntries = [{ tryLoc: "root" }]),
            e.forEach(O, this),
            this.reset(!0));
        }
        function E(t) {
          if (t || "" === t) {
            var a = t[r];
            if (a) return a.call(t);
            if ("function" == typeof t.next) return t;
            if (!isNaN(t.length)) {
              var o = -1,
                n = function a() {
                  for (; ++o < t.length; )
                    if (i.call(t, o))
                      return ((a.value = t[o]), (a.done = !1), a);
                  return ((a.value = e), (a.done = !0), a);
                };
              return (n.next = n);
            }
          }
          throw new TypeError(g(t) + " is not iterable");
        }
        return (
          (T.prototype = y),
          o(k, "constructor", { value: y, configurable: !0 }),
          o(y, "constructor", { value: T, configurable: !0 }),
          (T.displayName = l(y, u, "GeneratorFunction")),
          (t.isGeneratorFunction = function (e) {
            var t = "function" == typeof e && e.constructor;
            return (
              !!t &&
              (t === T || "GeneratorFunction" === (t.displayName || t.name))
            );
          }),
          (t.mark = function (e) {
            return (
              Object.setPrototypeOf
                ? Object.setPrototypeOf(e, y)
                : ((e.__proto__ = y), l(e, u, "GeneratorFunction")),
              (e.prototype = Object.create(k)),
              e
            );
          }),
          (t.awrap = function (e) {
            return { __await: e };
          }),
          D(z.prototype),
          l(z.prototype, s, function () {
            return this;
          }),
          (t.AsyncIterator = z),
          (t.async = function (e, a, i, o, n) {
            void 0 === n && (n = Promise);
            var r = new z(c(e, a, i, o), n);
            return t.isGeneratorFunction(a)
              ? r
              : r.next().then(function (e) {
                  return e.done ? e.value : r.next();
                });
          }),
          D(k),
          l(k, u, "Generator"),
          l(k, r, function () {
            return this;
          }),
          l(k, "toString", function () {
            return "[object Generator]";
          }),
          (t.keys = function (e) {
            var t = Object(e),
              a = [];
            for (var i in t) a.push(i);
            return (
              a.reverse(),
              function e() {
                for (; a.length; ) {
                  var i = a.pop();
                  if (i in t) return ((e.value = i), (e.done = !1), e);
                }
                return ((e.done = !0), e);
              }
            );
          }),
          (t.values = E),
          (L.prototype = {
            constructor: L,
            reset: function (t) {
              if (
                ((this.prev = 0),
                (this.next = 0),
                (this.sent = this._sent = e),
                (this.done = !1),
                (this.delegate = null),
                (this.method = "next"),
                (this.arg = e),
                this.tryEntries.forEach(C),
                !t)
              )
                for (var a in this)
                  "t" === a.charAt(0) &&
                    i.call(this, a) &&
                    !isNaN(+a.slice(1)) &&
                    (this[a] = e);
            },
            stop: function () {
              this.done = !0;
              var e = this.tryEntries[0].completion;
              if ("throw" === e.type) throw e.arg;
              return this.rval;
            },
            dispatchException: function (t) {
              if (this.done) throw t;
              var a = this;
              function o(i, o) {
                return (
                  (s.type = "throw"),
                  (s.arg = t),
                  (a.next = i),
                  o && ((a.method = "next"), (a.arg = e)),
                  !!o
                );
              }
              for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                var r = this.tryEntries[n],
                  s = r.completion;
                if ("root" === r.tryLoc) return o("end");
                if (r.tryLoc <= this.prev) {
                  var u = i.call(r, "catchLoc"),
                    l = i.call(r, "finallyLoc");
                  if (u && l) {
                    if (this.prev < r.catchLoc) return o(r.catchLoc, !0);
                    if (this.prev < r.finallyLoc) return o(r.finallyLoc);
                  } else if (u) {
                    if (this.prev < r.catchLoc) return o(r.catchLoc, !0);
                  } else {
                    if (!l)
                      throw new Error("try statement without catch or finally");
                    if (this.prev < r.finallyLoc) return o(r.finallyLoc);
                  }
                }
              }
            },
            abrupt: function (e, t) {
              for (var a = this.tryEntries.length - 1; a >= 0; --a) {
                var o = this.tryEntries[a];
                if (
                  o.tryLoc <= this.prev &&
                  i.call(o, "finallyLoc") &&
                  this.prev < o.finallyLoc
                ) {
                  var n = o;
                  break;
                }
              }
              n &&
                ("break" === e || "continue" === e) &&
                n.tryLoc <= t &&
                t <= n.finallyLoc &&
                (n = null);
              var r = n ? n.completion : {};
              return (
                (r.type = e),
                (r.arg = t),
                n
                  ? ((this.method = "next"), (this.next = n.finallyLoc), v)
                  : this.complete(r)
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
                v
              );
            },
            finish: function (e) {
              for (var t = this.tryEntries.length - 1; t >= 0; --t) {
                var a = this.tryEntries[t];
                if (a.finallyLoc === e)
                  return (this.complete(a.completion, a.afterLoc), C(a), v);
              }
            },
            catch: function (e) {
              for (var t = this.tryEntries.length - 1; t >= 0; --t) {
                var a = this.tryEntries[t];
                if (a.tryLoc === e) {
                  var i = a.completion;
                  if ("throw" === i.type) {
                    var o = i.arg;
                    C(a);
                  }
                  return o;
                }
              }
              throw new Error("illegal catch attempt");
            },
            delegateYield: function (t, a, i) {
              return (
                (this.delegate = { iterator: E(t), resultName: a, nextLoc: i }),
                "next" === this.method && (this.arg = e),
                v
              );
            },
          }),
          t
        );
      }
      function g(e) {
        return (
          (g =
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
          g(e)
        );
      }
      function m(e, t) {
        var a =
          ("undefined" != typeof Symbol && e[Symbol.iterator]) ||
          e["@@iterator"];
        if (!a) {
          if (
            Array.isArray(e) ||
            (a = (function (e, t) {
              if (!e) return;
              if ("string" == typeof e) return h(e, t);
              var a = Object.prototype.toString.call(e).slice(8, -1);
              "Object" === a && e.constructor && (a = e.constructor.name);
              if ("Map" === a || "Set" === a) return Array.from(e);
              if (
                "Arguments" === a ||
                /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)
              )
                return h(e, t);
            })(e)) ||
            (t && e && "number" == typeof e.length)
          ) {
            a && (e = a);
            var i = 0,
              o = function () {};
            return {
              s: o,
              n: function () {
                return i >= e.length
                  ? { done: !0 }
                  : { done: !1, value: e[i++] };
              },
              e: function (e) {
                throw e;
              },
              f: o,
            };
          }
          throw new TypeError(
            "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
          );
        }
        var n,
          r = !0,
          s = !1;
        return {
          s: function () {
            a = a.call(e);
          },
          n: function () {
            var e = a.next();
            return ((r = e.done), e);
          },
          e: function (e) {
            ((s = !0), (n = e));
          },
          f: function () {
            try {
              r || null == a.return || a.return();
            } finally {
              if (s) throw n;
            }
          },
        };
      }
      function h(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var a = 0, i = new Array(t); a < t; a++) i[a] = e[a];
        return i;
      }
      function f(e, t, a, i, o, n, r) {
        try {
          var s = e[n](r),
            u = s.value;
        } catch (e) {
          return void a(e);
        }
        s.done ? t(u) : Promise.resolve(u).then(i, o);
      }
      function S(e) {
        return function () {
          var t = this,
            a = arguments;
          return new Promise(function (i, o) {
            var n = e.apply(t, a);
            function r(e) {
              f(n, i, o, r, s, "next", e);
            }
            function s(e) {
              f(n, i, o, r, s, "throw", e);
            }
            r(void 0);
          });
        };
      }
      var v = [
          { code: "en", name: "English", nativeName: "English" },
          {
            code: "zh-CN",
            name: "Chinese (Simplified)",
            nativeName: "简体中文",
          },
          {
            code: "zh-TW",
            name: "Chinese (Traditional)",
            nativeName: "繁體中文",
          },
          { code: "ja", name: "Japanese", nativeName: "日本語" },
          { code: "ko", name: "Korean", nativeName: "한국어" },
          { code: "fr", name: "French", nativeName: "Français" },
          { code: "de", name: "German", nativeName: "Deutsch" },
          { code: "es", name: "Spanish", nativeName: "Español" },
          {
            code: "pt-BR",
            name: "Portuguese (Brazil)",
            nativeName: "Português (Brasil)",
          },
        ],
        b = {
          en: i,
          "zh-CN": o,
          "zh-TW": n,
          ja: r,
          ko: s,
          fr: u,
          de: l,
          es: c,
          "pt-BR": d,
        },
        T = "en",
        y = i;
      function x() {
        var e = navigator.language || navigator.userLanguage || "en";
        if (b[e]) return e;
        var t = {
          zh: "zh-CN",
          "zh-Hans": "zh-CN",
          "zh-Hant": "zh-TW",
          "zh-HK": "zh-TW",
          "zh-MO": "zh-TW",
          pt: "pt-BR",
          "pt-PT": "pt-BR",
        };
        if (t[e]) return t[e];
        var a = e.split("-")[0];
        return b[a] ? a : "en";
      }
      function P() {
        return w.apply(this, arguments);
      }
      function w() {
        return (w = S(
          p().mark(function e() {
            return p().wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return e.abrupt(
                      "return",
                      new Promise(function (e) {
                        chrome.storage.sync.get(["uiLanguage"], function (t) {
                          if (t.uiLanguage && b[t.uiLanguage])
                            ((T = t.uiLanguage), (y = b[T]), e(T));
                          else {
                            var a = x();
                            ((T = a),
                              (y = b[a]),
                              chrome.storage.sync.set({ uiLanguage: a }),
                              e(a));
                          }
                        });
                      }),
                    );
                  case 1:
                  case "end":
                    return e.stop();
                }
            }, e);
          }),
        )).apply(this, arguments);
      }
      function k(e) {
        return D.apply(this, arguments);
      }
      function D() {
        return (D = S(
          p().mark(function e(t) {
            return p().wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    if (b[t]) {
                      e.next = 3;
                      break;
                    }
                    return e.abrupt("return", !1);
                  case 3:
                    return (
                      (T = t),
                      (y = b[t]),
                      e.abrupt(
                        "return",
                        new Promise(function (e) {
                          chrome.storage.sync.set(
                            { uiLanguage: t },
                            function () {
                              e(!0);
                            },
                          );
                        }),
                      )
                    );
                  case 6:
                  case "end":
                    return e.stop();
                }
            }, e);
          }),
        )).apply(this, arguments);
      }
      function z(e) {
        var t,
          a =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "",
          o = e.split("."),
          n = y,
          r = m(o);
        try {
          for (r.s(); !(t = r.n()).done; ) {
            var s = t.value;
            if (!n || "object" !== g(n) || !(s in n)) {
              n = void 0;
              break;
            }
            n = n[s];
          }
        } catch (e) {
          r.e(e);
        } finally {
          r.f();
        }
        if ("string" == typeof n) return n;
        if ("en" !== T) {
          n = i;
          var u,
            l = m(o);
          try {
            for (l.s(); !(u = l.n()).done; ) {
              var c = u.value;
              if (!n || "object" !== g(n) || !(c in n)) {
                n = void 0;
                break;
              }
              n = n[c];
            }
          } catch (e) {
            l.e(e);
          } finally {
            l.f();
          }
          if ("string" == typeof n) return n;
        }
        return a || e;
      }
      function M() {
        return v;
      }
      function V() {
        return O.apply(this, arguments);
      }
      function O() {
        return (O = S(
          p().mark(function e() {
            return p().wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return ((e.next = 2), P());
                  case 2:
                    return e.abrupt("return", T);
                  case 3:
                  case "end":
                    return e.stop();
                }
            }, e);
          }),
        )).apply(this, arguments);
      }
    },
    2208: (e) => {
      e.exports =
        "data:image/svg+xml,%3csvg aria-hidden=%27true%27 xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 10 6%27%3e %3cpath stroke=%27%236B7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27m1 1 4 4 4-4%27/%3e %3c/svg%3e";
    },
    6749: (e) => {
      e.exports =
        "data:image/svg+xml,%3csvg aria-hidden=%27true%27 xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 16 12%27%3e %3cpath stroke=%27white%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%273%27 d=%27M0.5 6h14%27/%3e %3c/svg%3e";
    },
    220: (e) => {
      e.exports =
        "data:image/svg+xml,%3csvg aria-hidden=%27true%27 xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 16 12%27%3e %3cpath stroke=%27white%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%273%27 d=%27M1 5.917 5.724 10.5 15 1.5%27/%3e %3c/svg%3e";
    },
    5270: (e) => {
      e.exports =
        "data:image/svg+xml,%3csvg viewBox=%270 0 16 16%27 fill=%27white%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3ccircle cx=%278%27 cy=%278%27 r=%273%27/%3e%3c/svg%3e";
    },
    2031: (e) => {
      e.exports =
        "data:image/svg+xml,%3csvg viewBox=%270 0 16 16%27 fill=%27white%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath d=%27M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z%27/%3e%3c/svg%3e";
    },
    3569: (e) => {
      e.exports =
        "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 16 16%27%3e%3cpath stroke=%27white%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M4 8h8%27/%3e%3c/svg%3e";
    },
    960: (e) => {
      e.exports =
        "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236B7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e";
    },
    5894: (e) => {
      e.exports = JSON.parse(
        '{"common":{"start":"Starten","stop":"Stoppen","cancel":"Abbrechen","confirm":"Bestätigen","delete":"Löschen","save":"Speichern","close":"Schließen","loading":"Wird geladen...","error":"Fehler","success":"Erfolg","gotIt":"Verstanden"},"signIn":{"headline":"Echtzeit-Übersetzung und Synchronisation","feature1":"Natürlich klingende Stimmen mit verschiedenen Akzenten und Stilen","feature2":"50 Sprachen, mit datenschutzfreundlichem lokalem Verlauf","feature3":"Podcasts in jeder Sprache verstehen","continueWithGoogle":"Mit Google fortfahren"},"popup":{"sourceLanguage":"Ausgangssprache","translateTo":"Übersetzen nach","automaticDetection":"Automatische Erkennung","searchLanguages":"Sprachen suchen...","remainingTime":"Verbleibende Zeit","currentPage":"Aktuelle Seite:","startTranslation":"🌐 Übersetzung auf dieser Seite starten","stopButton":"⏹ Stoppen","connected":"✓ Verbunden - in diesem Tab starten","starting":"Wird gestartet...","stopping":"Wird gestoppt...","viewHistory":"Transkriptionsverlauf anzeigen","upgradeButton":"Upgrade für mehr Zeit","minutesExhausted":"Zeit aufgebraucht","freeMinutesExhausted":"Sie haben Ihre kostenlose Zeit bei DubTab aufgebraucht.\\n\\nBitte upgraden Sie Ihren Plan, um mehr Zeit zu erhalten.","paidMinutesExhausted":"Sie haben die Zeit Ihres aktuellen Plans aufgebraucht. Die Zeit wird mit dem nächsten Abrechnungszeitraum zurückgesetzt.","paidMinutesExhaustedWithDate":"Sie haben die Zeit Ihres aktuellen Plans aufgebraucht.\\n\\nIhre Zeit wird am {date} zurückgesetzt.","billingIssue":"Abrechnungsproblem","billingIssueMessage":"Ihr Abonnement-Status ist \'{status}\'. Bitte führen Sie zunächst die Zahlung durch oder aktualisieren Sie Ihre Zahlungsmethode im Kundenportal.","pageDetectionFailed":"⚠️ Seitenerkennung fehlgeschlagen","cannotDetectPage":"Aktuelle Seite kann nicht erkannt werden. Bitte versuchen Sie es erneut.","cannotStartOnPage":"Auf dieser Seite nicht möglich","pageNotSupported":"Diese Seite unterstützt keine Audio-Aufnahme.\\n\\nBitte öffnen Sie eine Video-Website (YouTube, Netflix usw.) und versuchen Sie es erneut.","audioCaptureError":"⚠️ Audio-Aufnahmefehler","audioCaptureErrorMessage":"Tab-Audio konnte nicht aufgenommen werden. Bitte aktualisieren Sie die Seite und versuchen Sie es erneut.","quickStart":"Schnellstart","step1":"Spielen Sie ein Video oder Audio ab (YouTube, Netflix usw.)","step2":"Klicken Sie auf \\"Starten\\" — Sie sehen Untertitel UND hören die Übersetzung","tip":"💡 Stellen Sie sicher, dass Audio auf der Seite abgespielt wird, bevor Sie starten","instructionTip":"💡 Öffnen Sie eine Seite mit laufendem Video oder Audio (YouTube, Twitch, Zoom usw.) und klicken Sie dann auf","instructionStart":"Starten","instructionOnPage":"auf dieser Seite.","planMinutes":"Plan","extraLifetime":"Extra (lebenslang)","sourceLanguageTipsTitle":"Tipps zur Ausgangssprache","sourceLanguageTipSingle":"Einsprachiges Audio → Manuelle Auswahl kann die Genauigkeit verbessern","sourceLanguageTipMultiple":"Mehrere Sprachen → Automatische Erkennung verwenden"},"account":{"title":"Kontoinformationen","email":"E-Mail","plan":"Plan","status":"Status","nextBillingDate":"Nächstes Abrechnungsdatum","endDate":"Enddatum","minutesResetDate":"Zeit-Zurücksetzungsdatum","logOut":"Abmelden","manageSubscription":"Abonnement verwalten","uiLanguage":"Oberflächensprache","uiLanguageTooltip":"Diese Einstellung betrifft nur die Schaltflächen und Texte der Oberfläche, nicht die Untertitel- oder Übersetzungssprachen.","noSubscriptionFound":"Kein Abonnement gefunden","noSubscriptionMessage":"Sie haben noch kein Abonnement. Upgraden Sie, um Ihr Abonnement zu verwalten!","upgrade":"Upgraden"},"history":{"title":"Verlauf","reviewSessions":"Überprüfen Sie Ihre vergangenen Sitzungen","loading":"Verlauf wird geladen...","noSessionSelected":"Keine Sitzung ausgewählt","selectSession":"Wählen Sie eine Sitzung aus der Liste, um Transkriptionen anzuzeigen.","clearAllTitle":"Gesamten Verlauf löschen? Dies kann nicht rückgängig gemacht werden.","deleteSessionTitle":"Diese Sitzung löschen? Dies kann nicht rückgängig gemacht werden.","sessionDeleted":"Sitzung gelöscht","historyCleared":"Verlauf gelöscht","failedToDelete":"Sitzung konnte nicht gelöscht werden","failedToClear":"Verlauf konnte nicht gelöscht werden","failedToLoad":"Verlaufsdaten konnten nicht geladen werden.","notSignedIn":"Nicht angemeldet. Bitte melden Sie sich an, um den Verlauf anzuzeigen.","cannotDeleteRunning":"Laufende Sitzung kann nicht gelöscht werden. Bitte stoppen Sie sie zuerst.","cannotClearRunning":"Verlauf kann nicht gelöscht werden, während Sitzungen laufen. Bitte stoppen Sie sie zuerst.","untitledSession":"Unbenannte Sitzung","ongoing":"Laufend","clearAll":"Alles löschen","sessions":"Sitzungen","noSessions":"Noch keine Sitzungen","startNewSession":"Starten Sie eine Übersetzung, um Ihren Verlauf hier zu sehen.","copyAll":"Alles kopieren","export":"Exportieren","exportWord":"Word","exportTxt":"TXT","copied":"Kopiert!","failedToCopy":"Kopieren fehlgeschlagen","exportSuccess":"Erfolgreich exportiert","exportFailed":"Export fehlgeschlagen","starredOnly":"Nur Favoriten","searchPlaceholder":"Transkriptionen durchsuchen...","duration":"Dauer","from":"Von","to":"Bis","segments":"Segmente","noTranscripts":"Keine Transkriptionen in dieser Sitzung.","clickStar":"Klicken Sie auf das Stern-Symbol, um wichtige Segmente zu speichern."},"overlay":{"listening":"Hören auf Video/Audio auf dieser Seite","listeningTab":"Hören auf Audio in diesem Tab","listeningTabDesc":"Stellen Sie sicher, dass das Video abgespielt wird und nicht stummgeschaltet ist. Untertitel werden automatisch angezeigt.","listeningPageChangeDesc":"Sie haben eine neue Seite geöffnet. Untertitel werden automatisch fortgesetzt, wenn Video/Audio startet.","starting":"Wird gestartet...","translating":"Übersetzung läuft","stopped":"Gestoppt","clickStartToResume":"Zum Fortsetzen auf Start klicken","waitingForAudio":"Warte auf Audio...","makeSureVideoPlaying":"Stellen Sie sicher, dass das Video läuft und nicht stummgeschaltet ist","resizeTooltip":"Ziehen Sie die Ecke, um die Größe zu ändern","stopTabUpdated":"Untertitel wurden pausiert, weil dieser Tab die Seite gewechselt hat. Klicken Sie auf Start, um fortzufahren.","stopTabRemoved":"Die Untertitel wurden gestoppt, weil der Tab geschlossen wurde.","stopTabReplaced":"Die Untertitel wurden gestoppt, weil der Tab ersetzt wurde.","stopNoAudioTimeout":"Eine Weile wurde kein Audio erkannt, daher wurde DubTab automatisch gestoppt. Klicken Sie auf Start, um es wieder einzuschalten.","pauseCaption":"Untertitel pausieren","resumeCaption":"Untertitel fortsetzen","bilingualMode":"Beide","translationOnly":"Übersetzung","originalOnly":"Nur Original","settings":"Einstellungen","close":"Schließen","scrollToBottom":"Nach unten scrollen","fontSize":"Schriftgröße","fontSizeSmall":"Klein","fontSizeMedium":"Mittel","fontSizeLarge":"Groß","fontSizeXLarge":"Sehr groß","theme":"Design","themeDark":"Dunkel","themeLight":"Hell","opacity":"Hintergrund-Transparenz","reset":"Zurücksetzen","upgradeRequired":"Upgrade erforderlich","freeQuotaExhausted":"Ihre kostenlose Zeit ist aufgebraucht.\\n\\nUpgraden Sie, um weiterhin Echtzeit-Übersetzung zu genießen.","upgradeNow":"Jetzt upgraden","maybeLater":"Vielleicht später","followVoice":"Stimme folgen","followVoiceTooltip":"Der aktuellen TTS-Stimme folgen"},"dock":{"ready":"Bereit","connecting":"Verbinden...","translating":"Übersetzung läuft","error":"Fehler","pause":"Pause","sessionTime":"Sitzungszeit","selectVoice":"Stimme auswählen","audioMixer":"Audio-Mixer","subtitleMode":"Untertitelmodus","captionPanel":"Untertitel-Panel","cinemaMode":"Kino-Modus","panel":"Panel","cinema":"Kino","audioOnly":"Nur Audio","voiceOn":"Übersetzte Stimme ein","voiceOff":"Übersetzte Stimme aus","voice":"Stimme","settings":"Einstellungen","close":"Schließen"},"voiceSelector":{"title":"STIMME","auto":"Auto","loadingVoices":"Lade Stimmen...","noVoices":"Keine Stimmen verfügbar","favorites":"FAVORITEN","moreVoices":"WEITERE STIMMEN","switchingToVoice":"Wechsle zur neuen Stimme: {voiceName}","previousVoiceFallback":"Ihre vorherige Stimme","newVoiceFallback":"eine neue Stimme","voiceUnavailableSwitched":"Ihre vorherige Stimme „{previousVoice}“ ist nicht mehr verfügbar. Zu „{nextVoice}“ gewechselt."},"audioMixer":{"title":"AUDIO-MIXER","originalAudio":"Original-Audio","translatedVoice":"Übersetzte Stimme","voiceOnly":"Nur Synchronisation","balanced":"Ausgewogen","originalOnly":"Nur Original","audioDucking":"Audio-Ducking","audioDuckingDesc":"Tab-Audio während Sprachausgabe senken","originalDuringVoice":"Original-Audio während Sprachausgabe","normalVolume":"Normal","duringVoice":"Während Sprachausgabe"},"settingsPanel":{"title":"EINSTELLUNGEN","captionPanelFontSize":"Untertitel-Panel Schriftgröße","cinemaModeFontSize":"Kino-Modus Schriftgröße","backgroundOpacity":"Hintergrund-Transparenz","theme":"Design","darkTheme":"🌙 Dunkel","lightTheme":"☀️ Hell","resetSettings":"Einstellungen zurücksetzen","resetDesc":"Alle Einstellungen auf Standardwerte zurücksetzen","resetButton":"🔄 Auf Standard zurücksetzen","resetComplete":"✓ Zurücksetzen abgeschlossen","subtitleDisplay":"Untertitelanzeige","showBothLanguages":"Beide Sprachen anzeigen","captionOrder":"Untertitelreihenfolge","originalFirst":"Original zuerst","translationFirst":"Übersetzung zuerst","tooltipOriginal":"① Original","tooltipTranslation":"① Übersetzung"},"quotaModal":{"freeTitle":"Ihre kostenlosen 10 Minuten sind aufgebraucht.","freeSubtitle":"Um Echtzeit-Übersetzung und Synchronisation fortzusetzen:","paidTitleTemplate":"Sie haben alle {plan}-Stunden dieses Monats aufgebraucht.","paidTitle":"Zeit aufgebraucht","paidSubtitleBuyMore":"Um DubTab für den Rest dieses Monats zu nutzen, fügen Sie zusätzliche lebenslange Stunden hinzu:","paidSubtitleReached":"Sie haben Ihr monatliches Limit erreicht. Diese Sitzung wurde pausiert, um zusätzliche Kosten zu vermeiden.","renewalInfo":"Ihre Zeit wird am {date} zurückgesetzt","extraHoursPack":"Zusätzliche Stunden","smallPack":"Kleines Paket","smallPackDesc":"1 zusätzliche Stunde · lebenslang, einmaliger Kauf","standardPack":"Standardpaket","standardPackDesc":"4 zusätzliche Stunden · lebenslang, einmaliger Kauf","largePack":"Großes Paket","largePackDesc":"15 zusätzliche Stunden · lebenslang, einmaliger Kauf","processing":"Wird verarbeitet...","openingStripeCheckout":"Stripe Checkout wird geöffnet","monthly":"Monatlich","yearly":"Jährlich","upfront":"Im Voraus","toggleHint":"Alle Stunden im Voraus · Kein monatliches Reset","hoursPerMonth":"{hours} Stunden/Monat","hoursUpfrontPerYear":"{hours} Stunden im Voraus (pro Jahr)","perMonth":"/Monat","perYear":"/Jahr","perMonthShort":"/Mo.","approxPerMonth":"(~${price}/Mo.)","starter":"Starter","pro":"Pro","power":"Power","mostPopular":"Beliebteste","seeAllPlans":"Alle Pläne anzeigen","maybeLater":"Vielleicht später"}}',
      );
    },
    4174: (e) => {
      e.exports = JSON.parse(
        '{"common":{"start":"Start","stop":"Stop","cancel":"Cancel","confirm":"Confirm","delete":"Delete","save":"Save","close":"Close","loading":"Loading...","error":"Error","success":"Success","gotIt":"Got it"},"signIn":{"headline":"Real-time translation & dubbing","feature1":"Natural-sounding voices with multiple accents and styles","feature2":"50 languages, with privacy-first local history","feature3":"Understand podcasts in any language","continueWithGoogle":"Continue with Google"},"popup":{"sourceLanguage":"Source language","translateTo":"Translate to","automaticDetection":"Automatic Detection","searchLanguages":"Search languages...","remainingTime":"Remaining time","currentPage":"Current page:","startTranslation":"🌐 Start translation on this page","stopButton":"⏹ Stop","connected":"✓ Connected - start on this tab","starting":"Starting...","stopping":"Stopping...","viewHistory":"View transcripts history","upgradeButton":"Upgrade to unlock more minutes","minutesExhausted":"Minutes Exhausted","freeMinutesExhausted":"You\'ve used up all free minutes for DubTab.\\n\\nPlease upgrade your plan to get more minutes.","paidMinutesExhausted":"You\'ve used all minutes in your current plan. Minutes will reset with your next billing cycle.","paidMinutesExhaustedWithDate":"You\'ve used all minutes in your current plan.\\n\\nYour minutes will reset on {date}.","billingIssue":"Billing Issue","billingIssueMessage":"Your subscription is {status}. Please pay or update your payment method in the customer portal first.","pageDetectionFailed":"⚠️ Page Detection Failed","cannotDetectPage":"Cannot detect current page. Please try again.","cannotStartOnPage":"Cannot Start on This Page","pageNotSupported":"This page doesn\'t support audio capture.\\n\\nPlease open a video website (YouTube, Netflix, etc.) and try again.","audioCaptureError":"⚠️ Audio Capture Error","audioCaptureErrorMessage":"Failed to capture tab audio. Please refresh the page and try again.","quickStart":"Quick Start","step1":"Play a video or audio (YouTube, Netflix, etc.)","step2":"Click \\"Start\\" — you\'ll see subtitles AND hear the translation","tip":"💡 Make sure the audio is playing on the page before you start","instructionTip":"💡 Open a page with a playing video or audio (YouTube, Twitch, Zoom, etc.), then Click","instructionStart":"Start","instructionOnPage":"on that page.","planMinutes":"Plan","extraLifetime":"Extra (lifetime)","sourceLanguageTipsTitle":"Source Language Tips","sourceLanguageTipSingle":"Single-language audio → selecting it can improve accuracy","sourceLanguageTipMultiple":"Multiple languages → use Auto Detect"},"account":{"title":"Account Information","email":"Email","plan":"Plan","status":"Status","nextBillingDate":"Next Billing Date","endDate":"End date","minutesResetDate":"Minutes Reset Date","logOut":"Log Out","manageSubscription":"Manage Subscription","uiLanguage":"UI Language","uiLanguageTooltip":"This only affects interface buttons and text, not subtitle or translation languages.","noSubscriptionFound":"No Subscription Found","noSubscriptionMessage":"You don\'t have any subscription yet. Upgrade to manage subscription!","upgrade":"Upgrade"},"history":{"title":"History","reviewSessions":"Review your past sessions","loading":"Loading history...","noSessionSelected":"No session selected","selectSession":"Select a session from the list to review transcriptions.","clearAllTitle":"Clear all history? This cannot be undone.","deleteSessionTitle":"Delete this session? This cannot be undone.","sessionDeleted":"Session deleted","historyCleared":"History cleared","failedToDelete":"Failed to delete session","failedToClear":"Failed to clear history","failedToLoad":"Failed to load history data.","notSignedIn":"Not signed in. Please sign in to view history.","cannotDeleteRunning":"Cannot delete a running session. Please stop it first.","cannotClearRunning":"Cannot clear history while sessions are running. Please stop them first.","untitledSession":"Untitled Session","ongoing":"Ongoing","clearAll":"Clear All","sessions":"Sessions","noSessions":"No sessions yet","startNewSession":"Start a translation to see your history here.","copyAll":"Copy All","export":"Export","exportWord":"Word","exportTxt":"TXT","copied":"Copied!","failedToCopy":"Failed to copy","exportSuccess":"Exported successfully","exportFailed":"Export failed","starredOnly":"Starred only","searchPlaceholder":"Search transcripts...","duration":"Duration","from":"From","to":"To","segments":"segments","noTranscripts":"No transcripts in this session.","clickStar":"Click the star icon to save important segments."},"overlay":{"listening":"Listening for video/audio on this page","listeningTab":"Listening for audio in this tab","listeningTabDesc":"Make sure video is playing & unmuted. Captions will appear here automatically.","listeningPageChangeDesc":"You\'ve opened a new page. Captions will resume automatically when video/audio starts.","starting":"Starting...","translating":"Translating","stopped":"Stopped","clickStartToResume":"Click Start to resume","waitingForAudio":"Waiting for audio...","makeSureVideoPlaying":"Make sure video is playing and unmuted","resizeTooltip":"Drag the corner to resize","stopTabUpdated":"Captions paused because this tab changed pages. Click Start to continue.","stopTabRemoved":"Caption stopped because the tab was closed.","stopTabReplaced":"Caption stopped because the tab was replaced.","stopNoAudioTimeout":"No audio was detected for a while, so DubTab stopped automatically. Click Start to turn it back on.","pauseCaption":"Pause Caption","resumeCaption":"Resume Caption","bilingualMode":"Both","translationOnly":"Translation","originalOnly":"Original Only","settings":"Settings","close":"Close","scrollToBottom":"Scroll to bottom","fontSize":"Font Size","fontSizeSmall":"Small","fontSizeMedium":"Medium","fontSizeLarge":"Large","fontSizeXLarge":"Extra Large","theme":"Theme","themeDark":"Dark","themeLight":"Light","opacity":"Background Opacity","reset":"Reset","upgradeRequired":"Upgrade Required","freeQuotaExhausted":"Your free minutes are used up.\\n\\nUpgrade to continue enjoying real-time translation.","upgradeNow":"Upgrade Now","maybeLater":"Maybe Later","followVoice":"Follow Voice","followVoiceTooltip":"Follow the current TTS voice"},"dock":{"ready":"Ready","connecting":"Connecting...","translating":"Translating","error":"Error","pause":"Pause","sessionTime":"Session time","selectVoice":"Select Voice","audioMixer":"Audio Mixer","subtitleMode":"Subtitle Mode","captionPanel":"Caption Panel","cinemaMode":"Cinema Mode","panel":"Panel","cinema":"Cinema","audioOnly":"Audio Only","voiceOn":"Translated Voice On","voiceOff":"Translated Voice Off","voice":"Voice","settings":"Settings","collapse":"Collapse","expand":"Expand","close":"Close"},"voiceSelector":{"title":"VOICE","auto":"Auto","loadingVoices":"Loading voices...","noVoices":"No voices available","favorites":"FAVORITES","moreVoices":"MORE VOICES","switchingToVoice":"Switching to new voice: {voiceName}","previousVoiceFallback":"your previous voice","newVoiceFallback":"a new voice","voiceUnavailableSwitched":"Your previous voice \\"{previousVoice}\\" is no longer available. Switched to \\"{nextVoice}\\"."},"audioMixer":{"title":"AUDIO MIXER","originalAudio":"Original Audio","translatedVoice":"Translated Voice","voiceOnly":"Translation only","balanced":"Balanced","originalOnly":"Original only","audioDucking":"Audio Ducking","audioDuckingDesc":"Lower tab audio while voice plays","originalDuringVoice":"Original audio during voice","normalVolume":"Normal","duringVoice":"During voice"},"settingsPanel":{"title":"SETTINGS","captionPanelFontSize":"Caption Panel Font Size","cinemaModeFontSize":"Cinema Mode Font Size","backgroundOpacity":"Background Opacity","theme":"Theme","darkTheme":"🌙 Dark","lightTheme":"☀️ Light","resetSettings":"Reset Settings","resetDesc":"Restore all settings to their default values","resetButton":"🔄 Reset to Defaults","resetComplete":"✓ Reset Complete","subtitleDisplay":"Subtitle Display","showBothLanguages":"Show Both Languages","captionOrder":"Caption Order","originalFirst":"Original first","translationFirst":"Translation first","tooltipOriginal":"① Original","tooltipTranslation":"① Translation"},"quotaModal":{"freeTitle":"You\'ve used your free 10 minutes.","freeSubtitle":"To keep live translation & dubbing running:","paidTitleTemplate":"You\'ve used all your {plan} hours for this month.","paidTitle":"Minutes Exhausted","paidSubtitleBuyMore":"To keep DubTab running for the rest of this month, add extra lifetime hours:","paidSubtitleReached":"You\'ve reached your monthly minute limit, so this session is paused to avoid extra charges.","renewalInfo":"Your minutes will reset on {date}","extraHoursPack":"Extra hours pack","smallPack":"Small pack","smallPackDesc":"1 extra hour · lifetime, one time purchase","standardPack":"Standard pack","standardPackDesc":"4 extra hours · lifetime, one time purchase","largePack":"Large pack","largePackDesc":"15 extra hours · lifetime, one time purchase","processing":"Processing...","openingStripeCheckout":"Opening Stripe Checkout","monthly":"Monthly","yearly":"Yearly","upfront":"Upfront","toggleHint":"Get all hours upfront • No monthly reset","hoursPerMonth":"{hours} hours/month","hoursUpfrontPerYear":"{hours} hours upfront (per year)","perMonth":"/month","perYear":"/yr","perMonthShort":"/mo","approxPerMonth":"(~${price}/mo)","starter":"Starter","pro":"Pro","power":"Power","mostPopular":"Most Popular","seeAllPlans":"See all plans","maybeLater":"Maybe later"}}',
      );
    },
    6725: (e) => {
      e.exports = JSON.parse(
        '{"common":{"start":"Iniciar","stop":"Detener","cancel":"Cancelar","confirm":"Confirmar","delete":"Eliminar","save":"Guardar","close":"Cerrar","loading":"Cargando...","error":"Error","success":"Éxito","gotIt":"Entendido"},"signIn":{"headline":"Traducción y doblaje en tiempo real","feature1":"Voces naturales con múltiples acentos y estilos","feature2":"50 idiomas, con historial local que prioriza la privacidad","feature3":"Entender podcasts en cualquier idioma","continueWithGoogle":"Continuar con Google"},"popup":{"sourceLanguage":"Idioma de origen","translateTo":"Traducir a","automaticDetection":"Detección automática","searchLanguages":"Buscar idiomas...","remainingTime":"Tiempo restante","currentPage":"Página actual:","startTranslation":"🌐 Iniciar traducción en esta página","stopButton":"⏹ Detener","connected":"✓ Conectado - iniciar en esta pestaña","starting":"Iniciando...","stopping":"Deteniendo...","viewHistory":"Ver historial de transcripciones","upgradeButton":"Mejorar plan para más tiempo","minutesExhausted":"Tiempo agotado","freeMinutesExhausted":"Has usado todo tu tiempo gratuito en DubTab.\\n\\nPor favor, mejora tu plan para obtener más tiempo.","paidMinutesExhausted":"Has usado todo el tiempo de tu plan actual. El tiempo se reiniciará en tu próximo ciclo de facturación.","paidMinutesExhaustedWithDate":"Has usado todo el tiempo de tu plan actual.\\n\\nTu tiempo se reiniciará el {date}.","billingIssue":"Problema de facturación","billingIssueMessage":"Tu suscripción está en estado \\"{status}\\". Por favor, realiza el pago o actualiza tu método de pago en el portal del cliente primero.","pageDetectionFailed":"⚠️ Error al detectar la página","cannotDetectPage":"No se puede detectar la página actual. Por favor, inténtalo de nuevo.","cannotStartOnPage":"No se puede iniciar en esta página","pageNotSupported":"Esta página no admite captura de audio.\\n\\nPor favor, abre un sitio de videos (YouTube, Netflix, etc.) e inténtalo de nuevo.","audioCaptureError":"⚠️ Error de captura de audio","audioCaptureErrorMessage":"No se pudo capturar el audio de la pestaña. Por favor, actualiza la página e inténtalo de nuevo.","quickStart":"Inicio rápido","step1":"Reproduce un video o audio (YouTube, Netflix, etc.)","step2":"Haz clic en \\"Iniciar\\" — verás subtítulos Y escucharás la traducción","tip":"💡 Asegúrate de que el audio esté reproduciéndose en la página antes de iniciar","instructionTip":"💡 Abre una página con un video o audio reproduciéndose (YouTube, Twitch, Zoom, etc.) y luego haz clic en","instructionStart":"Iniciar","instructionOnPage":"en esa página.","planMinutes":"Plan","extraLifetime":"Extra (de por vida)","sourceLanguageTipsTitle":"Consejos de idioma de origen","sourceLanguageTipSingle":"Audio en un solo idioma → seleccionarlo puede mejorar la precisión","sourceLanguageTipMultiple":"Varios idiomas → usar detección automática"},"account":{"title":"Información de la cuenta","email":"Correo electrónico","plan":"Plan","status":"Estado","nextBillingDate":"Próxima fecha de facturación","endDate":"Fecha de fin","minutesResetDate":"Fecha de reinicio del tiempo","logOut":"Cerrar sesión","manageSubscription":"Gestionar suscripción","uiLanguage":"Idioma de la interfaz","uiLanguageTooltip":"Esta configuración solo afecta los botones y el texto de la interfaz, no los subtítulos ni los idiomas de traducción.","noSubscriptionFound":"No se encontró suscripción","noSubscriptionMessage":"Aún no tienes una suscripción. ¡Mejora tu plan para gestionarla!","upgrade":"Mejorar plan"},"history":{"title":"Historial","reviewSessions":"Revisa tus sesiones anteriores","loading":"Cargando historial...","noSessionSelected":"Ninguna sesión seleccionada","selectSession":"Selecciona una sesión de la lista para ver las transcripciones.","clearAllTitle":"¿Borrar todo el historial? Esta acción no se puede deshacer.","deleteSessionTitle":"¿Eliminar esta sesión? Esta acción no se puede deshacer.","sessionDeleted":"Sesión eliminada","historyCleared":"Historial borrado","failedToDelete":"Error al eliminar la sesión","failedToClear":"Error al borrar el historial","failedToLoad":"Error al cargar los datos del historial.","notSignedIn":"No has iniciado sesión. Por favor, inicia sesión para ver el historial.","cannotDeleteRunning":"No se puede eliminar una sesión en curso. Por favor, detenla primero.","cannotClearRunning":"No se puede borrar el historial mientras hay sesiones en curso. Por favor, detenllas primero.","untitledSession":"Sesión sin título","ongoing":"En curso","clearAll":"Borrar todo","sessions":"Sesiones","noSessions":"Aún no hay sesiones","startNewSession":"Inicia una traducción para ver tu historial aquí.","copyAll":"Copiar todo","export":"Exportar","exportWord":"Word","exportTxt":"TXT","copied":"¡Copiado!","failedToCopy":"Error al copiar","exportSuccess":"Exportación exitosa","exportFailed":"Error al exportar","starredOnly":"Solo favoritos","searchPlaceholder":"Buscar transcripciones...","duration":"Duración","from":"Desde","to":"Hasta","segments":"segmentos","noTranscripts":"No hay transcripciones en esta sesión.","clickStar":"Haz clic en el icono de estrella para guardar segmentos importantes."},"overlay":{"listening":"Escuchando video/audio en esta página","listeningTab":"Escuchando audio en esta pestaña","listeningTabDesc":"Asegúrate de que el video se esté reproduciendo y no esté silenciado. Los subtítulos aparecerán automáticamente.","listeningPageChangeDesc":"Has abierto una nueva página. Los subtítulos se reanudarán automáticamente cuando comience el video/audio.","starting":"Iniciando...","translating":"Traduciendo","stopped":"Detenido","clickStartToResume":"Haz clic en Start para continuar","waitingForAudio":"Esperando audio...","makeSureVideoPlaying":"Asegúrate de que el video se esté reproduciendo y no esté silenciado","resizeTooltip":"Arrastra la esquina para cambiar el tamaño","stopTabUpdated":"Los subtítulos se pausaron porque esta pestaña cambió de página. Haz clic en Start para continuar.","stopTabRemoved":"Los subtítulos se detuvieron porque la pestaña se cerró.","stopTabReplaced":"Los subtítulos se detuvieron porque la pestaña fue reemplazada.","stopNoAudioTimeout":"No se detectó audio durante un tiempo, así que DubTab se detuvo automáticamente. Haz clic en Start para volver a activarlo.","pauseCaption":"Pausar subtítulos","resumeCaption":"Reanudar subtítulos","bilingualMode":"Ambos","translationOnly":"Traducción","originalOnly":"Solo original","settings":"Ajustes","close":"Cerrar","scrollToBottom":"Ir al final","fontSize":"Tamaño de fuente","fontSizeSmall":"Pequeño","fontSizeMedium":"Mediano","fontSizeLarge":"Grande","fontSizeXLarge":"Muy grande","theme":"Tema","themeDark":"Oscuro","themeLight":"Claro","opacity":"Opacidad del fondo","reset":"Restablecer","upgradeRequired":"Mejora requerida","freeQuotaExhausted":"Tu tiempo gratuito se ha agotado.\\n\\nMejora tu plan para seguir disfrutando de la traducción en tiempo real.","upgradeNow":"Mejorar ahora","maybeLater":"Quizás después","followVoice":"Seguir voz","followVoiceTooltip":"Seguir la voz TTS actual"},"dock":{"ready":"Listo","connecting":"Conectando...","translating":"Traduciendo","error":"Error","pause":"Pausar","sessionTime":"Tiempo de sesión","selectVoice":"Seleccionar voz","audioMixer":"Mezclador de audio","subtitleMode":"Modo de subtítulos","captionPanel":"Panel de subtítulos","cinemaMode":"Modo cine","panel":"Panel","cinema":"Cine","audioOnly":"Solo audio","voiceOn":"Voz traducida activada","voiceOff":"Voz traducida desactivada","voice":"Voz","settings":"Ajustes","close":"Cerrar"},"voiceSelector":{"title":"VOZ","auto":"Auto","loadingVoices":"Cargando voces...","noVoices":"No hay voces disponibles","favorites":"FAVORITOS","moreVoices":"MÁS VOCES","switchingToVoice":"Cambiando a la nueva voz: {voiceName}","previousVoiceFallback":"tu voz anterior","newVoiceFallback":"una nueva voz","voiceUnavailableSwitched":"Tu voz anterior \\"{previousVoice}\\" ya no está disponible. Se cambió a \\"{nextVoice}\\"."},"audioMixer":{"title":"MEZCLADOR DE AUDIO","originalAudio":"Audio original","translatedVoice":"Voz traducida","voiceOnly":"Solo doblaje","balanced":"Equilibrado","originalOnly":"Solo original","audioDucking":"Atenuación de audio","audioDuckingDesc":"Bajar audio de la pestaña durante la voz","originalDuringVoice":"Audio original durante la voz","normalVolume":"Normal","duringVoice":"Durante la voz"},"settingsPanel":{"title":"AJUSTES","captionPanelFontSize":"Tamaño de fuente del panel","cinemaModeFontSize":"Tamaño de fuente modo cine","backgroundOpacity":"Opacidad del fondo","theme":"Tema","darkTheme":"🌙 Oscuro","lightTheme":"☀️ Claro","resetSettings":"Restablecer ajustes","resetDesc":"Restaurar todos los ajustes a sus valores predeterminados","resetButton":"🔄 Restablecer valores","resetComplete":"✓ Restablecimiento completado","subtitleDisplay":"Visualización de subtítulos","showBothLanguages":"Mostrar ambos idiomas","captionOrder":"Orden de subtítulos","originalFirst":"Original primero","translationFirst":"Traducción primero","tooltipOriginal":"① Original","tooltipTranslation":"① Traducción"},"quotaModal":{"freeTitle":"Has usado tus 10 minutos gratis.","freeSubtitle":"Para seguir con traducción y doblaje en tiempo real:","paidTitleTemplate":"Has usado todas las horas de {plan} de este mes.","paidTitle":"Tiempo agotado","paidSubtitleBuyMore":"Para seguir usando DubTab este mes, añade horas extra de por vida:","paidSubtitleReached":"Has alcanzado tu límite mensual. Esta sesión está pausada para evitar cargos adicionales.","renewalInfo":"Tu tiempo se reiniciará el {date}","extraHoursPack":"Paquete de horas extra","smallPack":"Paquete pequeño","smallPackDesc":"1 hora extra · de por vida, compra única","standardPack":"Paquete estándar","standardPackDesc":"4 horas extra · de por vida, compra única","largePack":"Paquete grande","largePackDesc":"15 horas extra · de por vida, compra única","processing":"Procesando...","openingStripeCheckout":"Abriendo pago en Stripe","monthly":"Mensual","yearly":"Anual","upfront":"Por adelantado","toggleHint":"Todas las horas por adelantado • Sin reinicio mensual","hoursPerMonth":"{hours} horas/mes","hoursUpfrontPerYear":"{hours} horas por adelantado (al año)","perMonth":"/mes","perYear":"/año","perMonthShort":"/mes","approxPerMonth":"(~${price}/mes)","starter":"Starter","pro":"Pro","power":"Power","mostPopular":"Más popular","seeAllPlans":"Ver todos los planes","maybeLater":"Quizás después"}}',
      );
    },
    4605: (e) => {
      e.exports = JSON.parse(
        '{"common":{"start":"Démarrer","stop":"Arrêter","cancel":"Annuler","confirm":"Confirmer","delete":"Supprimer","save":"Enregistrer","close":"Fermer","loading":"Chargement...","error":"Erreur","success":"Succès","gotIt":"Compris"},"signIn":{"headline":"Traduction et doublage en temps réel","feature1":"Voix naturelles avec plusieurs accents et styles","feature2":"50 langues, avec historique local protégé","feature3":"Comprendre les podcasts dans n\'importe quelle langue","continueWithGoogle":"Continuer avec Google"},"popup":{"sourceLanguage":"Langue source","translateTo":"Traduire vers","automaticDetection":"Détection automatique","searchLanguages":"Rechercher une langue...","remainingTime":"Temps restant","currentPage":"Page actuelle :","startTranslation":"🌐 Lancer la traduction sur cette page","stopButton":"⏹ Arrêter","connected":"✓ Connecté - démarrer sur cet onglet","starting":"Démarrage...","stopping":"Arrêt...","viewHistory":"Voir l\'historique des transcriptions","upgradeButton":"Passer à un forfait supérieur","minutesExhausted":"Temps écoulé","freeMinutesExhausted":"Vous avez utilisé tout votre temps gratuit sur DubTab.\\n\\nVeuillez passer à un forfait supérieur pour obtenir plus de temps.","paidMinutesExhausted":"Vous avez utilisé tout le temps de votre forfait actuel. Votre temps sera réinitialisé au prochain cycle de facturation.","paidMinutesExhaustedWithDate":"Vous avez utilisé tout le temps de votre forfait actuel.\\n\\nVotre temps sera réinitialisé le {date}.","billingIssue":"Problème de facturation","billingIssueMessage":"Votre abonnement est « {status} ». Veuillez d\'abord effectuer le paiement ou mettre à jour votre mode de paiement dans le portail client.","pageDetectionFailed":"⚠️ Échec de détection de la page","cannotDetectPage":"Impossible de détecter la page actuelle. Veuillez réessayer.","cannotStartOnPage":"Impossible de démarrer sur cette page","pageNotSupported":"Cette page ne prend pas en charge la capture audio.\\n\\nVeuillez ouvrir un site vidéo (YouTube, Netflix, etc.) et réessayer.","audioCaptureError":"⚠️ Erreur de capture audio","audioCaptureErrorMessage":"Échec de la capture audio de l\'onglet. Veuillez actualiser la page et réessayer.","quickStart":"Guide rapide","step1":"Lancez une vidéo ou un audio (YouTube, Netflix, etc.)","step2":"Cliquez sur « Démarrer » — vous verrez les sous-titres ET entendrez la traduction","tip":"💡 Assurez-vous que l\'audio est en lecture sur la page avant de démarrer","instructionTip":"💡 Ouvrez une page avec une vidéo ou un audio en lecture (YouTube, Twitch, Zoom, etc.), puis cliquez sur","instructionStart":"Démarrer","instructionOnPage":"sur cette page.","planMinutes":"Forfait","extraLifetime":"Extra (à vie)","sourceLanguageTipsTitle":"Conseils pour la langue source","sourceLanguageTipSingle":"Audio mono-langue → le sélectionner peut améliorer la précision","sourceLanguageTipMultiple":"Plusieurs langues → utiliser la détection automatique"},"account":{"title":"Informations du compte","email":"E-mail","plan":"Forfait","status":"Statut","nextBillingDate":"Prochaine date de facturation","endDate":"Date de fin","minutesResetDate":"Date de réinitialisation du temps","logOut":"Se déconnecter","manageSubscription":"Gérer l\'abonnement","uiLanguage":"Langue de l\'interface","uiLanguageTooltip":"Ce paramètre n\'affecte que les boutons et le texte de l\'interface, pas les sous-titres ou les langues de traduction.","noSubscriptionFound":"Aucun abonnement trouvé","noSubscriptionMessage":"Vous n\'avez pas encore d\'abonnement. Passez à un forfait supérieur pour gérer votre abonnement !","upgrade":"Passer à un forfait supérieur"},"history":{"title":"Historique","reviewSessions":"Consultez vos sessions précédentes","loading":"Chargement de l\'historique...","noSessionSelected":"Aucune session sélectionnée","selectSession":"Sélectionnez une session dans la liste pour consulter les transcriptions.","clearAllTitle":"Effacer tout l\'historique ? Cette action est irréversible.","deleteSessionTitle":"Supprimer cette session ? Cette action est irréversible.","sessionDeleted":"Session supprimée","historyCleared":"Historique effacé","failedToDelete":"Échec de la suppression de la session","failedToClear":"Échec de l\'effacement de l\'historique","failedToLoad":"Échec du chargement des données de l\'historique.","notSignedIn":"Non connecté. Veuillez vous connecter pour voir l\'historique.","cannotDeleteRunning":"Impossible de supprimer une session en cours. Veuillez d\'abord l\'arrêter.","cannotClearRunning":"Impossible d\'effacer l\'historique pendant l\'exécution de sessions. Veuillez d\'abord les arrêter.","untitledSession":"Session sans titre","ongoing":"En cours","clearAll":"Tout effacer","sessions":"Sessions","noSessions":"Aucune session","startNewSession":"Lancez une traduction pour voir votre historique ici.","copyAll":"Tout copier","export":"Exporter","exportWord":"Word","exportTxt":"TXT","copied":"Copié !","failedToCopy":"Échec de la copie","exportSuccess":"Exportation réussie","exportFailed":"Échec de l\'exportation","starredOnly":"Favoris uniquement","searchPlaceholder":"Rechercher dans les transcriptions...","duration":"Durée","from":"De","to":"À","segments":"segments","noTranscripts":"Aucune transcription dans cette session.","clickStar":"Cliquez sur l\'étoile pour enregistrer les segments importants."},"overlay":{"listening":"Écoute des vidéos/audios sur cette page","listeningTab":"Écoute de l\'audio dans cet onglet","listeningTabDesc":"Assurez-vous que la vidéo est en cours de lecture et n\'est pas en sourdine. Les sous-titres apparaîtront automatiquement.","listeningPageChangeDesc":"Vous avez ouvert une nouvelle page. Les sous-titres reprendront automatiquement au démarrage de la vidéo/audio.","starting":"Démarrage...","translating":"Traduction en cours","stopped":"Arrêté","clickStartToResume":"Cliquez sur Start pour reprendre","waitingForAudio":"En attente de l’audio...","makeSureVideoPlaying":"Assurez-vous que la vidéo est en lecture et non coupée","resizeTooltip":"Faites glisser le coin pour redimensionner","stopTabUpdated":"Les sous-titres ont été mis en pause, car cet onglet a changé de page. Cliquez sur Start pour continuer.","stopTabRemoved":"Les sous-titres se sont arrêtés, car l’onglet a été fermé.","stopTabReplaced":"Les sous-titres se sont arrêtés, car l’onglet a été remplacé.","stopNoAudioTimeout":"Aucun audio n’a été détecté pendant un moment, donc DubTab s’est arrêté automatiquement. Cliquez sur Start pour le réactiver.","pauseCaption":"Mettre en pause les sous-titres","resumeCaption":"Reprendre les sous-titres","bilingualMode":"Les deux","translationOnly":"Traduction","originalOnly":"Original uniquement","settings":"Paramètres","close":"Fermer","scrollToBottom":"Défiler vers le bas","fontSize":"Taille de police","fontSizeSmall":"Petit","fontSizeMedium":"Moyen","fontSizeLarge":"Grand","fontSizeXLarge":"Très grand","theme":"Thème","themeDark":"Sombre","themeLight":"Clair","opacity":"Opacité du fond","reset":"Réinitialiser","upgradeRequired":"Mise à niveau requise","freeQuotaExhausted":"Votre temps gratuit est épuisé.\\n\\nPassez à un forfait supérieur pour continuer à profiter de la traduction en temps réel.","upgradeNow":"Passer à un forfait supérieur","maybeLater":"Plus tard","followVoice":"Suivre la voix","followVoiceTooltip":"Suivre la voix TTS actuelle"},"dock":{"ready":"Prêt","connecting":"Connexion...","translating":"Traduction en cours","error":"Erreur","pause":"Pause","sessionTime":"Temps de session","selectVoice":"Sélectionner la voix","audioMixer":"Mixeur audio","subtitleMode":"Mode sous-titres","captionPanel":"Panneau de sous-titres","cinemaMode":"Mode cinéma","panel":"Panneau","cinema":"Cinéma","audioOnly":"Audio seul","voiceOn":"Voix traduite activée","voiceOff":"Voix traduite désactivée","voice":"Voix","settings":"Paramètres","close":"Fermer"},"voiceSelector":{"title":"VOIX","auto":"Auto","loadingVoices":"Chargement des voix...","noVoices":"Aucune voix disponible","favorites":"FAVORIS","moreVoices":"PLUS DE VOIX","switchingToVoice":"Passage à la nouvelle voix : {voiceName}","previousVoiceFallback":"votre voix précédente","newVoiceFallback":"une nouvelle voix","voiceUnavailableSwitched":"Votre voix précédente « {previousVoice} » n\'est plus disponible. Passage à « {nextVoice} »."},"audioMixer":{"title":"MIXEUR AUDIO","originalAudio":"Audio original","translatedVoice":"Voix traduite","voiceOnly":"Doublage uniquement","balanced":"Équilibré","originalOnly":"Original uniquement","audioDucking":"Atténuation audio","audioDuckingDesc":"Baisser l\'audio de l\'onglet pendant la voix","originalDuringVoice":"Audio original pendant la voix","normalVolume":"Normal","duringVoice":"Pendant la voix"},"settingsPanel":{"title":"PARAMÈTRES","captionPanelFontSize":"Taille de police du panneau","cinemaModeFontSize":"Taille de police mode cinéma","backgroundOpacity":"Opacité du fond","theme":"Thème","darkTheme":"🌙 Sombre","lightTheme":"☀️ Clair","resetSettings":"Réinitialiser les paramètres","resetDesc":"Restaurer tous les paramètres aux valeurs par défaut","resetButton":"🔄 Réinitialiser","resetComplete":"✓ Réinitialisation terminée","subtitleDisplay":"Affichage des sous-titres","showBothLanguages":"Afficher les deux langues","captionOrder":"Ordre des sous-titres","originalFirst":"Original en premier","translationFirst":"Traduction en premier","tooltipOriginal":"① Original","tooltipTranslation":"① Traduction"},"quotaModal":{"freeTitle":"Vos 10 minutes gratuites sont épuisées.","freeSubtitle":"Pour continuer la traduction et le doublage en temps réel :","paidTitleTemplate":"Vous avez utilisé toutes vos heures {plan} ce mois-ci.","paidTitle":"Temps écoulé","paidSubtitleBuyMore":"Pour continuer à utiliser DubTab ce mois-ci, ajoutez des heures supplémentaires à vie :","paidSubtitleReached":"Vous avez atteint votre limite mensuelle. Cette session est en pause pour éviter des frais supplémentaires.","renewalInfo":"Votre temps sera réinitialisé le {date}","extraHoursPack":"Pack d\'heures supplémentaires","smallPack":"Petit pack","smallPackDesc":"1 heure supplémentaire · à vie, achat unique","standardPack":"Pack standard","standardPackDesc":"4 heures supplémentaires · à vie, achat unique","largePack":"Grand pack","largePackDesc":"15 heures supplémentaires · à vie, achat unique","processing":"Traitement...","openingStripeCheckout":"Ouverture du paiement Stripe","monthly":"Mensuel","yearly":"Annuel","upfront":"En une fois","toggleHint":"Toutes les heures d\'avance • Sans remise à zéro mensuelle","hoursPerMonth":"{hours} heures/mois","hoursUpfrontPerYear":"{hours} heures d\'avance (par an)","perMonth":"/mois","perYear":"/an","perMonthShort":"/mois","approxPerMonth":"(~${price}/mois)","starter":"Starter","pro":"Pro","power":"Power","mostPopular":"Le plus populaire","seeAllPlans":"Voir tous les forfaits","maybeLater":"Plus tard"}}',
      );
    },
    7980: (e) => {
      e.exports = JSON.parse(
        '{"common":{"start":"開始","stop":"停止","cancel":"キャンセル","confirm":"確認","delete":"削除","save":"保存","close":"閉じる","loading":"読み込み中...","error":"エラー","success":"成功","gotIt":"了解"},"signIn":{"headline":"リアルタイム翻訳と吹き替え","feature1":"複数のアクセントとスタイルで自然な音声","feature2":"50言語対応、プライバシー優先のローカル履歴","feature3":"どんな言語のポッドキャストも理解","continueWithGoogle":"Googleでログイン"},"popup":{"sourceLanguage":"入力言語","translateTo":"翻訳先","automaticDetection":"自動検出","searchLanguages":"言語を検索...","remainingTime":"残り時間","currentPage":"現在のページ：","startTranslation":"🌐 このページで翻訳を開始","stopButton":"⏹ 停止","connected":"✓ 接続済み - このタブで開始","starting":"開始中...","stopping":"停止中...","viewHistory":"翻訳履歴を見る","upgradeButton":"アップグレードして時間を追加","minutesExhausted":"利用時間切れ","freeMinutesExhausted":"DubTabの無料時間を使い切りました。\\n\\nプランをアップグレードして、より多くの時間をご利用ください。","paidMinutesExhausted":"現在のプランの時間を使い切りました。次の請求サイクルでリセットされます。","paidMinutesExhaustedWithDate":"現在のプランの時間を使い切りました。\\n\\n{date} にリセットされます。","billingIssue":"請求の問題","billingIssueMessage":"サブスクリプションのステータスが「{status}」です。カスタマーポータルでお支払いまたは支払い方法の更新をお願いします。","pageDetectionFailed":"⚠️ ページ検出エラー","cannotDetectPage":"現在のページを検出できません。もう一度お試しください。","cannotStartOnPage":"このページでは開始できません","pageNotSupported":"このページは音声キャプチャに対応していません。\\n\\n動画サイト（YouTube、Netflixなど）を開いてから再度お試しください。","audioCaptureError":"⚠️ 音声キャプチャエラー","audioCaptureErrorMessage":"タブの音声をキャプチャできませんでした。ページを更新してから再度お試しください。","quickStart":"クイックスタート","step1":"動画や音声を再生する（YouTube、Netflixなど）","step2":"「翻訳を開始」をクリック — 字幕が表示され、翻訳音声が聞こえます","tip":"💡 開始前にページで音声が再生されていることを確認してください","instructionTip":"💡 動画や音声を再生中のページ（YouTube、Twitch、Zoomなど）を開いて、","instructionStart":"開始","instructionOnPage":"をクリックしてください。","planMinutes":"プラン","extraLifetime":"追加（永久）","sourceLanguageTipsTitle":"入力言語のヒント","sourceLanguageTipSingle":"単一言語の音声 → 手動選択で精度が向上します","sourceLanguageTipMultiple":"複数言語 → 自動検出を使用"},"account":{"title":"アカウント情報","email":"メールアドレス","plan":"プラン","status":"ステータス","nextBillingDate":"次回請求日","endDate":"終了日","minutesResetDate":"時間リセット日","logOut":"ログアウト","manageSubscription":"サブスクリプション管理","uiLanguage":"表示言語","uiLanguageTooltip":"この設定はインターフェースのボタンやテキストのみに影響し、字幕や翻訳言語には影響しません。","noSubscriptionFound":"サブスクリプションがありません","noSubscriptionMessage":"まだサブスクリプションがありません。アップグレードして管理しましょう！","upgrade":"アップグレード"},"history":{"title":"履歴","reviewSessions":"過去のセッションを確認","loading":"履歴を読み込み中...","noSessionSelected":"セッション未選択","selectSession":"リストからセッションを選択して、文字起こしを確認できます。","clearAllTitle":"すべての履歴を削除しますか？この操作は取り消せません。","deleteSessionTitle":"このセッションを削除しますか？この操作は取り消せません。","sessionDeleted":"セッションを削除しました","historyCleared":"履歴を削除しました","failedToDelete":"セッションの削除に失敗しました","failedToClear":"履歴の削除に失敗しました","failedToLoad":"履歴データの読み込みに失敗しました。","notSignedIn":"ログインしていません。履歴を表示するにはログインしてください。","cannotDeleteRunning":"実行中のセッションは削除できません。先に停止してください。","cannotClearRunning":"実行中のセッションがあるため、履歴を削除できません。先に停止してください。","untitledSession":"無題のセッション","ongoing":"進行中","clearAll":"すべて削除","sessions":"セッション","noSessions":"セッションがありません","startNewSession":"翻訳を開始すると、ここに履歴が表示されます。","copyAll":"すべてコピー","export":"エクスポート","exportWord":"Word","exportTxt":"TXT","copied":"コピーしました！","failedToCopy":"コピーに失敗しました","exportSuccess":"エクスポート完了","exportFailed":"エクスポートに失敗しました","starredOnly":"スター付きのみ","searchPlaceholder":"文字起こしを検索...","duration":"時間","from":"開始","to":"終了","segments":"件のセグメント","noTranscripts":"このセッションには文字起こしがありません。","clickStar":"スターアイコンをクリックして重要なセグメントを保存できます。"},"overlay":{"listening":"このページの動画/音声をリスニング中","listeningTab":"このタブの音声をリスニング中","listeningTabDesc":"動画が再生され、ミュートされていないことを確認してください。字幕は自動的に表示されます。","listeningPageChangeDesc":"新しいページが開かれました。動画/音声の再生が始まると字幕が自動的に再開されます。","starting":"開始中...","translating":"翻訳中","stopped":"停止中","clickStartToResume":"開始をクリックして再開","waitingForAudio":"音声を待機中...","makeSureVideoPlaying":"動画が再生中でミュートされていないことを確認してください","resizeTooltip":"右下の角をドラッグしてサイズ変更","stopTabUpdated":"このタブのページが変わったため、字幕を一時停止しました。開始をクリックして続行してください。","stopTabRemoved":"タブが閉じられたため、字幕を停止しました。","stopTabReplaced":"タブが置き換えられたため、字幕を停止しました。","stopNoAudioTimeout":"しばらく音声が検出されなかったため、DubTab は自動停止しました。開始をクリックして再開してください。","pauseCaption":"字幕を一時停止","resumeCaption":"字幕を再開","bilingualMode":"両方","translationOnly":"翻訳","originalOnly":"原文のみ","settings":"設定","close":"閉じる","scrollToBottom":"一番下にスクロール","fontSize":"フォントサイズ","fontSizeSmall":"小","fontSizeMedium":"中","fontSizeLarge":"大","fontSizeXLarge":"特大","theme":"テーマ","themeDark":"ダーク","themeLight":"ライト","opacity":"背景の透明度","reset":"リセット","upgradeRequired":"アップグレードが必要です","freeQuotaExhausted":"無料時間を使い切りました。\\n\\nアップグレードしてリアルタイム翻訳を続けましょう。","upgradeNow":"今すぐアップグレード","maybeLater":"後で","followVoice":"音声に追従","followVoiceTooltip":"現在のTTS音声に追従"},"dock":{"ready":"準備完了","connecting":"接続中...","translating":"翻訳中","error":"エラー","pause":"一時停止","sessionTime":"セッション時間","selectVoice":"音声を選択","audioMixer":"オーディオミキサー","subtitleMode":"字幕モード","captionPanel":"字幕パネル","cinemaMode":"シネマモード","panel":"パネル","cinema":"シネマ","audioOnly":"音声のみ","voiceOn":"翻訳音声オン","voiceOff":"翻訳音声オフ","voice":"音声","settings":"設定","close":"閉じる"},"voiceSelector":{"title":"音声","auto":"自動","loadingVoices":"音声を読み込み中...","noVoices":"利用可能な音声がありません","favorites":"お気に入り","moreVoices":"その他の音声","switchingToVoice":"新しい音声に切り替えています: {voiceName}","previousVoiceFallback":"以前の音声","newVoiceFallback":"新しい音声","voiceUnavailableSwitched":"以前の音声「{previousVoice}」は利用できなくなりました。「{nextVoice}」に切り替えました。"},"audioMixer":{"title":"オーディオミキサー","originalAudio":"元の音声","translatedVoice":"翻訳音声","voiceOnly":"吹き替えのみ","balanced":"バランス","originalOnly":"元の音声のみ","audioDucking":"オーディオダッキング","audioDuckingDesc":"音声再生時にタブの音量を下げる","originalDuringVoice":"音声再生中の元の音量","normalVolume":"通常","duringVoice":"再生中"},"settingsPanel":{"title":"設定","captionPanelFontSize":"字幕パネルのフォントサイズ","cinemaModeFontSize":"シネマモードのフォントサイズ","backgroundOpacity":"背景の透明度","theme":"テーマ","darkTheme":"🌙 ダーク","lightTheme":"☀️ ライト","resetSettings":"設定をリセット","resetDesc":"すべての設定をデフォルト値に戻す","resetButton":"🔄 デフォルトに戻す","resetComplete":"✓ リセット完了","subtitleDisplay":"字幕の表示","showBothLanguages":"両方の言語を表示","captionOrder":"字幕の順序","originalFirst":"原文を先に","translationFirst":"翻訳を先に","tooltipOriginal":"① 原文","tooltipTranslation":"① 翻訳"},"quotaModal":{"freeTitle":"無料の10分を使い切りました。","freeSubtitle":"リアルタイム翻訳と吹き替えを続けるには：","paidTitleTemplate":"今月の{plan}の時間を使い切りました。","paidTitle":"利用時間切れ","paidSubtitleBuyMore":"今月もDubTabを使い続けるには、永久追加時間を購入してください：","paidSubtitleReached":"月間上限に達しました。追加料金を避けるため、このセッションは一時停止されています。","renewalInfo":"利用時間は{date}にリセットされます","extraHoursPack":"追加時間パック","smallPack":"スモールパック","smallPackDesc":"1時間追加 · 永久、一回限りの購入","standardPack":"スタンダードパック","standardPackDesc":"4時間追加 · 永久、一回限りの購入","largePack":"ラージパック","largePackDesc":"15時間追加 · 永久、一回限りの購入","processing":"処理中...","openingStripeCheckout":"Stripe決済を開いています","monthly":"月額","yearly":"年額","upfront":"一括","toggleHint":"全時間を一括で受け取り • 月次リセットなし","hoursPerMonth":"{hours}時間/月","hoursUpfrontPerYear":"{hours}時間一括（年間）","perMonth":"/月","perYear":"/年","perMonthShort":"/月","approxPerMonth":"(約${price}/月)","starter":"スターター","pro":"プロ","power":"パワー","mostPopular":"人気No.1","seeAllPlans":"すべてのプランを見る","maybeLater":"後で"}}',
      );
    },
    9423: (e) => {
      e.exports = JSON.parse(
        '{"common":{"start":"시작","stop":"중지","cancel":"취소","confirm":"확인","delete":"삭제","save":"저장","close":"닫기","loading":"로딩 중...","error":"오류","success":"성공","gotIt":"확인"},"signIn":{"headline":"실시간 번역과 더빙","feature1":"다양한 억양과 스타일의 자연스러운 음성","feature2":"50개 언어 지원, 개인정보 보호 우선 로컬 기록","feature3":"어떤 언어의 팟캐스트도 이해","continueWithGoogle":"Google로 계속하기"},"popup":{"sourceLanguage":"원본 언어","translateTo":"번역 언어","automaticDetection":"자동 감지","searchLanguages":"언어 검색...","remainingTime":"남은 시간","currentPage":"현재 페이지:","startTranslation":"🌐 이 페이지에서 번역 시작","stopButton":"⏹ 중지","connected":"✓ 연결됨 - 이 탭에서 시작","starting":"시작 중...","stopping":"중지 중...","viewHistory":"번역 기록 보기","upgradeButton":"업그레이드하여 시간 더 받기","minutesExhausted":"이용 시간 소진","freeMinutesExhausted":"DubTab 무료 이용 시간을 모두 사용했어요.\\n\\n더 많은 시간을 이용하려면 플랜을 업그레이드해 주세요.","paidMinutesExhausted":"현재 플랜의 이용 시간을 모두 사용했어요. 다음 결제 주기에 초기화됩니다.","paidMinutesExhaustedWithDate":"현재 플랜의 이용 시간을 모두 사용했어요.\\n\\n{date}에 초기화됩니다.","billingIssue":"결제 문제","billingIssueMessage":"구독 상태가 \\"{status}\\"입니다. 고객 포털에서 결제를 완료하거나 결제 수단을 업데이트해 주세요.","pageDetectionFailed":"⚠️ 페이지 감지 실패","cannotDetectPage":"현재 페이지를 감지할 수 없어요. 다시 시도해 주세요.","cannotStartOnPage":"이 페이지에서 시작할 수 없음","pageNotSupported":"이 페이지는 오디오 캡처를 지원하지 않아요.\\n\\n동영상 사이트(YouTube, Netflix 등)를 열고 다시 시도해 주세요.","audioCaptureError":"⚠️ 오디오 캡처 오류","audioCaptureErrorMessage":"탭 오디오를 캡처하지 못했어요. 페이지를 새로고침하고 다시 시도해 주세요.","quickStart":"빠른 시작","step1":"동영상이나 오디오를 재생하세요 (YouTube, Netflix 등)","step2":"\\"번역 시작\\"을 클릭하면 — 자막이 표시되고 번역 음성이 들려요","tip":"💡 시작하기 전에 페이지에서 오디오가 재생 중인지 확인하세요","instructionTip":"💡 동영상이나 오디오가 재생 중인 페이지(YouTube, Twitch, Zoom 등)를 열고","instructionStart":"시작","instructionOnPage":"을 클릭하세요.","planMinutes":"플랜","extraLifetime":"추가 (평생)","sourceLanguageTipsTitle":"원본 언어 선택 팁","sourceLanguageTipSingle":"단일 언어 오디오 → 직접 선택하면 정확도가 향상됩니다","sourceLanguageTipMultiple":"여러 언어 → 자동 감지 사용"},"account":{"title":"계정 정보","email":"이메일","plan":"플랜","status":"상태","nextBillingDate":"다음 결제일","endDate":"종료일","minutesResetDate":"시간 초기화일","logOut":"로그아웃","manageSubscription":"구독 관리","uiLanguage":"인터페이스 언어","uiLanguageTooltip":"이 설정은 인터페이스 버튼과 텍스트에만 영향을 주며, 자막 및 번역 언어에는 영향을 주지 않아요.","noSubscriptionFound":"구독 없음","noSubscriptionMessage":"아직 구독이 없어요. 업그레이드하여 구독을 관리하세요!","upgrade":"업그레이드"},"history":{"title":"기록","reviewSessions":"이전 세션 확인하기","loading":"기록 불러오는 중...","noSessionSelected":"세션이 선택되지 않음","selectSession":"목록에서 세션을 선택하여 자막을 확인하세요.","clearAllTitle":"모든 기록을 삭제할까요? 되돌릴 수 없어요.","deleteSessionTitle":"이 세션을 삭제할까요? 되돌릴 수 없어요.","sessionDeleted":"세션이 삭제됨","historyCleared":"기록이 삭제됨","failedToDelete":"세션 삭제 실패","failedToClear":"기록 삭제 실패","failedToLoad":"기록 데이터를 불러오지 못했어요.","notSignedIn":"로그인하지 않았어요. 기록을 보려면 로그인해 주세요.","cannotDeleteRunning":"진행 중인 세션은 삭제할 수 없어요. 먼저 중지해 주세요.","cannotClearRunning":"진행 중인 세션이 있어 기록을 삭제할 수 없어요. 먼저 중지해 주세요.","untitledSession":"제목 없는 세션","ongoing":"진행 중","clearAll":"모두 삭제","sessions":"세션","noSessions":"세션이 없어요","startNewSession":"번역을 시작하면 여기에 기록이 표시돼요.","copyAll":"전체 복사","export":"내보내기","exportWord":"Word","exportTxt":"TXT","copied":"복사됨!","failedToCopy":"복사 실패","exportSuccess":"내보내기 성공","exportFailed":"내보내기 실패","starredOnly":"별표만 표시","searchPlaceholder":"자막 검색...","duration":"길이","from":"시작","to":"종료","segments":"개 세그먼트","noTranscripts":"이 세션에 자막이 없어요.","clickStar":"별표 아이콘을 클릭하여 중요한 세그먼트를 저장하세요."},"overlay":{"listening":"이 페이지의 동영상/오디오 듣는 중","listeningTab":"이 탭의 오디오 듣는 중","listeningTabDesc":"동영상이 재생 중이고 음소거가 해제되어 있는지 확인하세요. 자막이 자동으로 표시됩니다.","listeningPageChangeDesc":"새 페이지를 열었습니다. 동영상/오디오 재생이 시작되면 자막이 자동으로 다시 표시됩니다.","starting":"시작 중...","translating":"번역 중","stopped":"중지됨","clickStartToResume":"시작을 클릭해 계속","waitingForAudio":"오디오 대기 중...","makeSureVideoPlaying":"동영상이 재생 중이고 음소거되어 있지 않은지 확인하세요","resizeTooltip":"오른쪽 아래 모서리를 드래그해 크기 조절","stopTabUpdated":"이 탭의 페이지가 변경되어 자막이 일시정지되었습니다. 시작을 클릭해 계속하세요.","stopTabRemoved":"탭이 닫혀 자막이 중지되었습니다.","stopTabReplaced":"탭이 교체되어 자막이 중지되었습니다.","stopNoAudioTimeout":"한동안 오디오가 감지되지 않아 DubTab이 자동으로 중지되었습니다. 시작을 클릭해 다시 켜세요.","pauseCaption":"자막 일시정지","resumeCaption":"자막 계속하기","bilingualMode":"둘 다","translationOnly":"번역","originalOnly":"원본만","settings":"설정","close":"닫기","scrollToBottom":"맨 아래로 스크롤","fontSize":"글자 크기","fontSizeSmall":"작게","fontSizeMedium":"보통","fontSizeLarge":"크게","fontSizeXLarge":"아주 크게","theme":"테마","themeDark":"다크","themeLight":"라이트","opacity":"배경 투명도","reset":"초기화","upgradeRequired":"업그레이드 필요","freeQuotaExhausted":"무료 이용 시간을 모두 사용했어요.\\n\\n실시간 번역을 계속하려면 업그레이드해 주세요.","upgradeNow":"지금 업그레이드","maybeLater":"나중에","followVoice":"음성 따라가기","followVoiceTooltip":"현재 TTS 음성 따라가기"},"dock":{"ready":"준비됨","connecting":"연결 중...","translating":"번역 중","error":"오류","pause":"일시정지","sessionTime":"세션 시간","selectVoice":"음성 선택","audioMixer":"오디오 믹서","subtitleMode":"자막 모드","captionPanel":"자막 패널","cinemaMode":"시네마 모드","panel":"패널","cinema":"시네마","audioOnly":"오디오만","voiceOn":"번역 음성 켜짐","voiceOff":"번역 음성 꺼짐","voice":"음성","settings":"설정","close":"닫기"},"voiceSelector":{"title":"음성","auto":"자동","loadingVoices":"음성 로딩 중...","noVoices":"사용 가능한 음성이 없습니다","favorites":"즐겨찾기","moreVoices":"더 많은 음성","switchingToVoice":"새 음성으로 전환 중: {voiceName}","previousVoiceFallback":"이전에 선택한 음성","newVoiceFallback":"새 음성","voiceUnavailableSwitched":"이전에 선택한 음성 \\"{previousVoice}\\"을 더 이상 사용할 수 없습니다. \\"{nextVoice}\\"(으)로 전환했습니다."},"audioMixer":{"title":"오디오 믹서","originalAudio":"원본 오디오","translatedVoice":"번역 음성","voiceOnly":"더빙만","balanced":"균형","originalOnly":"원본만","audioDucking":"오디오 덕킹","audioDuckingDesc":"음성 재생 시 탭 오디오 낮추기","originalDuringVoice":"음성 재생 중 원본 음량","normalVolume":"일반","duringVoice":"재생 중"},"settingsPanel":{"title":"설정","captionPanelFontSize":"자막 패널 글자 크기","cinemaModeFontSize":"시네마 모드 글자 크기","backgroundOpacity":"배경 투명도","theme":"테마","darkTheme":"🌙 다크","lightTheme":"☀️ 라이트","resetSettings":"설정 초기화","resetDesc":"모든 설정을 기본값으로 복원","resetButton":"🔄 기본값으로 초기화","resetComplete":"✓ 초기화 완료","subtitleDisplay":"자막 표시","showBothLanguages":"두 언어 모두 표시","captionOrder":"자막 순서","originalFirst":"원본 먼저","translationFirst":"번역 먼저","tooltipOriginal":"① 원본","tooltipTranslation":"① 번역"},"quotaModal":{"freeTitle":"무료 10분을 모두 사용했어요.","freeSubtitle":"실시간 번역과 더빙을 계속하려면:","paidTitleTemplate":"이번 달 {plan} 시간을 모두 사용했어요.","paidTitle":"이용 시간 소진","paidSubtitleBuyMore":"이번 달에도 DubTab을 사용하려면 평생 추가 시간을 구매하세요:","paidSubtitleReached":"월간 한도에 도달했어요. 추가 요금을 피하기 위해 세션이 일시 중지되었습니다.","renewalInfo":"이용 시간이 {date}에 초기화됩니다","extraHoursPack":"추가 시간 패키지","smallPack":"소형 패키지","smallPackDesc":"1시간 추가 · 평생, 일회성 구매","standardPack":"표준 패키지","standardPackDesc":"4시간 추가 · 평생, 일회성 구매","largePack":"대형 패키지","largePackDesc":"15시간 추가 · 평생, 일회성 구매","processing":"처리 중...","openingStripeCheckout":"Stripe 결제 페이지 열기","monthly":"월간","yearly":"연간","upfront":"일괄 지급","toggleHint":"모든 시간을 일괄로 • 월간 초기화 없음","hoursPerMonth":"{hours}시간/월","hoursUpfrontPerYear":"{hours}시간 일괄 (연간)","perMonth":"/월","perYear":"/년","perMonthShort":"/월","approxPerMonth":"(약 ${price}/월)","starter":"스타터","pro":"프로","power":"파워","mostPopular":"가장 인기","seeAllPlans":"모든 플랜 보기","maybeLater":"나중에"}}',
      );
    },
    6040: (e) => {
      e.exports = JSON.parse(
        '{"common":{"start":"Iniciar","stop":"Parar","cancel":"Cancelar","confirm":"Confirmar","delete":"Excluir","save":"Salvar","close":"Fechar","loading":"Carregando...","error":"Erro","success":"Sucesso","gotIt":"Entendi"},"signIn":{"headline":"Tradução e dublagem em tempo real","feature1":"Vozes com sons naturais e vários sotaques e estilos","feature2":"50 idiomas, com histórico local que prioriza a privacidade","feature3":"Entender podcasts em qualquer idioma","continueWithGoogle":"Continuar com Google"},"popup":{"sourceLanguage":"Idioma de origem","translateTo":"Traduzir para","automaticDetection":"Detecção automática","searchLanguages":"Buscar idiomas...","remainingTime":"Tempo restante","currentPage":"Página atual:","startTranslation":"🌐 Iniciar tradução nesta página","stopButton":"⏹ Parar","connected":"✓ Conectado - iniciar nesta aba","starting":"Iniciando...","stopping":"Parando...","viewHistory":"Ver histórico de transcrições","upgradeButton":"Fazer upgrade para mais tempo","minutesExhausted":"Tempo esgotado","freeMinutesExhausted":"Você usou todo o seu tempo gratuito no DubTab.\\n\\nPor favor, faça upgrade do seu plano para ter mais tempo.","paidMinutesExhausted":"Você usou todo o tempo do seu plano atual. O tempo será ressetado no próximo ciclo de cobrança.","paidMinutesExhaustedWithDate":"Você usou todo o tempo do seu plano atual.\\n\\nSeu tempo será resetado em {date}.","billingIssue":"Problema de cobrança","billingIssueMessage":"Sua assinatura está com status \\"{status}\\". Por favor, efetue o pagamento ou atualize seu método de pagamento no portal do cliente primeiro.","pageDetectionFailed":"⚠️ Falha na detecção da página","cannotDetectPage":"Não foi possível detectar a página atual. Por favor, tente novamente.","cannotStartOnPage":"Não é possível iniciar nesta página","pageNotSupported":"Esta página não suporta captura de áudio.\\n\\nPor favor, abra um site de vídeos (YouTube, Netflix, etc.) e tente novamente.","audioCaptureError":"⚠️ Erro de captura de áudio","audioCaptureErrorMessage":"Não foi possível capturar o áudio da aba. Por favor, atualize a página e tente novamente.","quickStart":"Início rápido","step1":"Reproduza um vídeo ou áudio (YouTube, Netflix, etc.)","step2":"Clique em \\"Iniciar\\" — você verá legendas E ouvirá a tradução","tip":"💡 Certifique-se de que o áudio esteja tocando na página antes de iniciar","instructionTip":"💡 Abra uma página com um vídeo ou áudio tocando (YouTube, Twitch, Zoom, etc.) e clique em","instructionStart":"Iniciar","instructionOnPage":"nessa página.","planMinutes":"Plano","extraLifetime":"Extra (vitalício)","sourceLanguageTipsTitle":"Dicas de idioma de origem","sourceLanguageTipSingle":"Áudio em um único idioma → selecioná-lo pode melhorar a precisão","sourceLanguageTipMultiple":"Vários idiomas → usar detecção automática"},"account":{"title":"Informações da conta","email":"E-mail","plan":"Plano","status":"Status","nextBillingDate":"Próxima data de cobrança","endDate":"Data de término","minutesResetDate":"Data de reset do tempo","logOut":"Sair","manageSubscription":"Gerenciar assinatura","uiLanguage":"Idioma da interface","uiLanguageTooltip":"Esta configuração afeta apenas os botões e textos da interface, não as legendas ou os idiomas de tradução.","noSubscriptionFound":"Nenhuma assinatura encontrada","noSubscriptionMessage":"Você ainda não tem uma assinatura. Faça upgrade para gerenciá-la!","upgrade":"Fazer upgrade"},"history":{"title":"Histórico","reviewSessions":"Revise suas sessões anteriores","loading":"Carregando histórico...","noSessionSelected":"Nenhuma sessão selecionada","selectSession":"Selecione uma sessão da lista para ver as transcrições.","clearAllTitle":"Limpar todo o histórico? Esta ação não pode ser desfeita.","deleteSessionTitle":"Excluir esta sessão? Esta ação não pode ser desfeita.","sessionDeleted":"Sessão excluída","historyCleared":"Histórico limpo","failedToDelete":"Falha ao excluir sessão","failedToClear":"Falha ao limpar histórico","failedToLoad":"Falha ao carregar dados do histórico.","notSignedIn":"Você não está logado. Por favor, faça login para ver o histórico.","cannotDeleteRunning":"Não é possível excluir uma sessão em andamento. Por favor, pare-a primeiro.","cannotClearRunning":"Não é possível limpar o histórico enquanto há sessões em andamento. Por favor, pare-as primeiro.","untitledSession":"Sessão sem título","ongoing":"Em andamento","clearAll":"Limpar tudo","sessions":"Sessões","noSessions":"Nenhuma sessão ainda","startNewSession":"Inicie uma tradução para ver seu histórico aqui.","copyAll":"Copiar tudo","export":"Exportar","exportWord":"Word","exportTxt":"TXT","copied":"Copiado!","failedToCopy":"Falha ao copiar","exportSuccess":"Exportação bem-sucedida","exportFailed":"Falha na exportação","starredOnly":"Apenas favoritos","searchPlaceholder":"Buscar transcrições...","duration":"Duração","from":"De","to":"Até","segments":"segmentos","noTranscripts":"Nenhuma transcrição nesta sessão.","clickStar":"Clique no ícone de estrela para salvar segmentos importantes."},"overlay":{"listening":"Ouvindo vídeo/áudio nesta página","listeningTab":"Ouvindo áudio nesta aba","listeningTabDesc":"Certifique-se de que o vídeo está reproduzindo e não está mudo. As legendas aparecerão automaticamente.","listeningPageChangeDesc":"Você abriu uma nova página. As legendas serão retomadas automaticamente quando o vídeo/áudio começar.","starting":"Iniciando...","translating":"Traduzindo","stopped":"Parado","clickStartToResume":"Clique em Start para continuar","waitingForAudio":"Aguardando áudio...","makeSureVideoPlaying":"Verifique se o vídeo está reproduzindo e não está no mudo","resizeTooltip":"Arraste o canto para redimensionar","stopTabUpdated":"As legendas foram pausadas porque esta aba mudou de página. Clique em Start para continuar.","stopTabRemoved":"As legendas foram interrompidas porque a aba foi fechada.","stopTabReplaced":"As legendas foram interrompidas porque a aba foi substituída.","stopNoAudioTimeout":"Nenhum áudio foi detectado por um tempo, então o DubTab parou automaticamente. Clique em Start para ativar novamente.","pauseCaption":"Pausar legendas","resumeCaption":"Retomar legendas","bilingualMode":"Ambos","translationOnly":"Tradução","originalOnly":"Apenas original","settings":"Configurações","close":"Fechar","scrollToBottom":"Ir para o final","fontSize":"Tamanho da fonte","fontSizeSmall":"Pequeno","fontSizeMedium":"Médio","fontSizeLarge":"Grande","fontSizeXLarge":"Extra grande","theme":"Tema","themeDark":"Escuro","themeLight":"Claro","opacity":"Opacidade do fundo","reset":"Resetar","upgradeRequired":"Upgrade necessário","freeQuotaExhausted":"Seu tempo gratuito acabou.\\n\\nFaça upgrade para continuar aproveitando a tradução em tempo real.","upgradeNow":"Fazer upgrade agora","maybeLater":"Talvez depois","followVoice":"Seguir voz","followVoiceTooltip":"Seguir a voz TTS atual"},"dock":{"ready":"Pronto","connecting":"Conectando...","translating":"Traduzindo","error":"Erro","pause":"Pausar","sessionTime":"Tempo de sessão","selectVoice":"Selecionar voz","audioMixer":"Mixer de áudio","subtitleMode":"Modo de legendas","captionPanel":"Painel de legendas","cinemaMode":"Modo cinema","panel":"Painel","cinema":"Cinema","audioOnly":"Somente áudio","voiceOn":"Voz traduzida ativada","voiceOff":"Voz traduzida desativada","voice":"Voz","settings":"Configurações","close":"Fechar"},"voiceSelector":{"title":"VOZ","auto":"Auto","loadingVoices":"Carregando vozes...","noVoices":"Nenhuma voz disponível","favorites":"FAVORITOS","moreVoices":"MAIS VOZES","switchingToVoice":"Mudando para a nova voz: {voiceName}","previousVoiceFallback":"sua voz anterior","newVoiceFallback":"uma nova voz","voiceUnavailableSwitched":"Sua voz anterior \\"{previousVoice}\\" não está mais disponível. Mudamos para \\"{nextVoice}\\"."},"audioMixer":{"title":"MIXER DE ÁUDIO","originalAudio":"Áudio original","translatedVoice":"Voz traduzida","voiceOnly":"Apenas dublagem","balanced":"Balanceado","originalOnly":"Apenas original","audioDucking":"Atenuação de áudio","audioDuckingDesc":"Diminuir áudio da aba durante a voz","originalDuringVoice":"Áudio original durante a voz","normalVolume":"Normal","duringVoice":"Durante a voz"},"settingsPanel":{"title":"CONFIGURAÇÕES","captionPanelFontSize":"Tamanho da fonte do painel","cinemaModeFontSize":"Tamanho da fonte modo cinema","backgroundOpacity":"Opacidade do fundo","theme":"Tema","darkTheme":"🌙 Escuro","lightTheme":"☀️ Claro","resetSettings":"Redefinir configurações","resetDesc":"Restaurar todas as configurações para os valores padrão","resetButton":"🔄 Redefinir para padrão","resetComplete":"✓ Redefinição concluída","subtitleDisplay":"Exibição de legendas","showBothLanguages":"Mostrar ambos os idiomas","captionOrder":"Ordem das legendas","originalFirst":"Original primeiro","translationFirst":"Tradução primeiro","tooltipOriginal":"① Original","tooltipTranslation":"① Tradução"},"quotaModal":{"freeTitle":"Você usou seus 10 minutos grátis.","freeSubtitle":"Para continuar com tradução e dublagem em tempo real:","paidTitleTemplate":"Você usou todas as horas do {plan} deste mês.","paidTitle":"Tempo esgotado","paidSubtitleBuyMore":"Para continuar usando o DubTab este mês, adicione horas extras vitalícias:","paidSubtitleReached":"Você atingiu seu limite mensal. Esta sessão foi pausada para evitar cobranças adicionais.","renewalInfo":"Seu tempo será resetado em {date}","extraHoursPack":"Pacote de horas extras","smallPack":"Pacote pequeno","smallPackDesc":"1 hora extra · vitalício, compra única","standardPack":"Pacote padrão","standardPackDesc":"4 horas extras · vitalício, compra única","largePack":"Pacote grande","largePackDesc":"15 horas extras · vitalício, compra única","processing":"Processando...","openingStripeCheckout":"Abrindo pagamento Stripe","monthly":"Mensal","yearly":"Anual","upfront":"Antecipado","toggleHint":"Todas as horas de uma vez • Sem reset mensal","hoursPerMonth":"{hours} horas/mês","hoursUpfrontPerYear":"{hours} horas antecipadas (por ano)","perMonth":"/mês","perYear":"/ano","perMonthShort":"/mês","approxPerMonth":"(~${price}/mês)","starter":"Starter","pro":"Pro","power":"Power","mostPopular":"Mais popular","seeAllPlans":"Ver todos os planos","maybeLater":"Talvez depois"}}',
      );
    },
    731: (e) => {
      e.exports = JSON.parse(
        '{"common":{"start":"开始","stop":"停止","cancel":"取消","confirm":"确认","delete":"删除","save":"保存","close":"关闭","loading":"加载中...","error":"错误","success":"成功","gotIt":"知道了"},"signIn":{"headline":"实时翻译与配音","feature1":"多种口音和风格的自然语音","feature2":"50 种语言，本地历史隐私优先","feature3":"听懂任何语言的播客","continueWithGoogle":"使用 Google 登录"},"popup":{"sourceLanguage":"源语言","translateTo":"翻译为","automaticDetection":"自动检测","searchLanguages":"搜索语言...","remainingTime":"剩余时长","currentPage":"当前页面：","startTranslation":"🌐 在此页面开始翻译","stopButton":"⏹ 停止","connected":"✓ 已连接 - 在此标签页启动","starting":"正在启动...","stopping":"正在停止...","viewHistory":"查看翻译历史","upgradeButton":"升级解锁更多时长","minutesExhausted":"时长已用完","freeMinutesExhausted":"您的 DubTab 免费时长已用完。\\n\\n请升级套餐以获取更多时长。","paidMinutesExhausted":"当前套餐的时长已用完，时长将在下个计费周期重置。","paidMinutesExhaustedWithDate":"当前套餐的时长已用完。\\n\\n您的时长将于 {date} 重置。","billingIssue":"账单问题","billingIssueMessage":"您的订阅状态为「{status}」。请先完成付款或在客户门户中更新付款方式。","pageDetectionFailed":"⚠️ 页面检测失败","cannotDetectPage":"无法检测当前页面，请重试。","cannotStartOnPage":"无法在此页面启动","pageNotSupported":"此页面不支持音频采集。\\n\\n请打开视频网站（如 YouTube、Netflix 等）后重试。","audioCaptureError":"⚠️ 音频采集错误","audioCaptureErrorMessage":"无法采集标签页音频，请刷新页面后重试。","quickStart":"快速上手","step1":"播放一个视频或音频（YouTube、Netflix 等）","step2":"点击「开始翻译」— 你会看到字幕并听到翻译配音","tip":"💡 启动前请确保页面有音频正在播放","instructionTip":"💡 打开正在播放视频或音频的页面（YouTube、Twitch、Zoom 等），然后点击","instructionStart":"开始","instructionOnPage":"即可。","planMinutes":"套餐","extraLifetime":"额外（终身）","sourceLanguageTipsTitle":"源语言选择建议","sourceLanguageTipSingle":"单一语言音频 → 手动选择可提高准确率","sourceLanguageTipMultiple":"多语言混合 → 使用自动检测"},"account":{"title":"账户信息","email":"邮箱","plan":"套餐","status":"状态","nextBillingDate":"下次扣款日期","endDate":"到期日期","minutesResetDate":"时长重置日期","logOut":"退出登录","manageSubscription":"管理订阅","uiLanguage":"界面语言","uiLanguageTooltip":"此设置仅影响界面按钮和文字，不影响字幕和翻译语言。","noSubscriptionFound":"未找到订阅","noSubscriptionMessage":"您还没有订阅。升级后即可管理订阅！","upgrade":"立即升级"},"history":{"title":"历史记录","reviewSessions":"回顾您的历史会话","loading":"正在加载历史记录...","noSessionSelected":"未选择会话","selectSession":"从列表中选择一个会话以查看转录内容。","clearAllTitle":"清除所有历史记录？此操作无法撤销。","deleteSessionTitle":"删除此会话？此操作无法撤销。","sessionDeleted":"会话已删除","historyCleared":"历史记录已清除","failedToDelete":"删除会话失败","failedToClear":"清除历史记录失败","failedToLoad":"加载历史数据失败。","notSignedIn":"未登录。请登录后查看历史记录。","cannotDeleteRunning":"无法删除正在进行的会话，请先停止。","cannotClearRunning":"有会话正在进行中，无法清除历史记录。请先停止。","untitledSession":"未命名会话","ongoing":"进行中","clearAll":"全部清除","sessions":"会话","noSessions":"暂无会话","startNewSession":"开始翻译后，您的历史记录将显示在这里。","copyAll":"复制全部","export":"导出","exportWord":"Word","exportTxt":"TXT","copied":"已复制！","failedToCopy":"复制失败","exportSuccess":"导出成功","exportFailed":"导出失败","starredOnly":"仅显示已收藏","searchPlaceholder":"搜索转录内容...","duration":"时长","from":"从","to":"至","segments":"条记录","noTranscripts":"此会话暂无转录内容。","clickStar":"点击星标图标以收藏重要片段。"},"overlay":{"listening":"正在监听此页面的视频/音频","listeningTab":"正在监听此标签页的音频","listeningTabDesc":"请确保视频正在播放且未静音，字幕将自动显示。","listeningPageChangeDesc":"您已打开新页面，视频/音频开始播放后字幕将自动恢复。","starting":"正在启动...","translating":"正在翻译","stopped":"已停止","clickStartToResume":"点击开始继续","waitingForAudio":"正在等待音频...","makeSureVideoPlaying":"请确认视频正在播放且未静音","resizeTooltip":"拖动右下角调整大小","stopTabUpdated":"页面已切换，字幕已暂停。点击开始继续。","stopTabRemoved":"标签页已关闭，字幕已停止。","stopTabReplaced":"标签页已替换，字幕已停止。","stopNoAudioTimeout":"一段时间内未检测到音频，DubTab 已自动停止。点击开始重新开启。","pauseCaption":"暂停字幕","resumeCaption":"继续字幕","bilingualMode":"双语","translationOnly":"仅译文","originalOnly":"仅原文","settings":"设置","close":"关闭","scrollToBottom":"滚动到底部","fontSize":"字体大小","fontSizeSmall":"小","fontSizeMedium":"中","fontSizeLarge":"大","fontSizeXLarge":"特大","theme":"主题","themeDark":"深色","themeLight":"浅色","opacity":"背景透明度","reset":"重置","upgradeRequired":"需要升级","freeQuotaExhausted":"您的免费时长已用完。\\n\\n升级后可继续享受实时翻译服务。","upgradeNow":"立即升级","maybeLater":"以后再说","followVoice":"跟随语音","followVoiceTooltip":"跟随当前语音朗读"},"dock":{"ready":"就绪","connecting":"连接中...","translating":"翻译中","error":"错误","pause":"暂停","sessionTime":"会话时间","selectVoice":"选择语音","audioMixer":"音频混音器","subtitleMode":"字幕模式","captionPanel":"字幕面板","cinemaMode":"影院模式","panel":"面板","cinema":"影院","audioOnly":"仅音频","voiceOn":"译文语音已开启","voiceOff":"译文语音已关闭","voice":"语音","settings":"设置","collapse":"收起","expand":"展开","close":"关闭"},"voiceSelector":{"title":"语音","auto":"自动","loadingVoices":"正在加载语音...","noVoices":"无可用语音","favorites":"收藏","moreVoices":"更多语音","switchingToVoice":"正在切换到新语音：{voiceName}","previousVoiceFallback":"之前选择的语音","newVoiceFallback":"新的语音","voiceUnavailableSwitched":"之前选择的语音“{previousVoice}”已不可用，已切换为“{nextVoice}”。"},"audioMixer":{"title":"音频混音器","originalAudio":"原始音频","translatedVoice":"译文语音","voiceOnly":"仅配音","balanced":"均衡","originalOnly":"仅原音","audioDucking":"音量自动降低","audioDuckingDesc":"播放语音时降低标签页音频","originalDuringVoice":"播放语音时的原音量","normalVolume":"正常","duringVoice":"播放时"},"settingsPanel":{"title":"设置","captionPanelFontSize":"字幕面板字体大小","cinemaModeFontSize":"影院模式字体大小","backgroundOpacity":"背景透明度","theme":"主题","darkTheme":"🌙 深色","lightTheme":"☀️ 浅色","resetSettings":"重置设置","resetDesc":"将所有设置还原为默认值","resetButton":"🔄 恢复默认值","resetComplete":"✓ 重置完成","subtitleDisplay":"字幕显示","showBothLanguages":"显示双语","captionOrder":"字幕顺序","originalFirst":"原文在上","translationFirst":"译文在上","tooltipOriginal":"① 原文","tooltipTranslation":"① 译文"},"quotaModal":{"freeTitle":"免费 10 分钟已用完","freeSubtitle":"如需继续实时翻译与配音服务：","paidTitleTemplate":"本月 {plan} 套餐时长已用完","paidTitle":"时长已用尽","paidSubtitleBuyMore":"如需本月继续使用 DubTab，可购买额外终身时长：","paidSubtitleReached":"您已达到本月时长上限，会话已暂停以避免额外费用。","renewalInfo":"您的时长将于 {date} 重置","extraHoursPack":"额外时长包","smallPack":"小时包","smallPackDesc":"1 小时 · 终身有效，一次性购买","standardPack":"标准包","standardPackDesc":"4 小时 · 终身有效，一次性购买","largePack":"大时包","largePackDesc":"15 小时 · 终身有效，一次性购买","processing":"处理中...","openingStripeCheckout":"正在打开支付页面","monthly":"月付","yearly":"年付","upfront":"一次到账","toggleHint":"全年时长一次到账 • 无月度重置","hoursPerMonth":"{hours} 小时/月","hoursUpfrontPerYear":"{hours} 小时一次到账（按年计）","perMonth":"/月","perYear":"/年","perMonthShort":"/月","approxPerMonth":"(约 ${price}/月)","starter":"入门版","pro":"专业版","power":"强力版","mostPopular":"最受欢迎","seeAllPlans":"查看所有套餐","maybeLater":"以后再说"}}',
      );
    },
    1507: (e) => {
      e.exports = JSON.parse(
        '{"common":{"start":"開始","stop":"停止","cancel":"取消","confirm":"確認","delete":"刪除","save":"儲存","close":"關閉","loading":"載入中...","error":"錯誤","success":"成功","gotIt":"了解"},"signIn":{"headline":"即時翻譯與配音","feature1":"多種口音和風格的自然語音","feature2":"50 種語言，本地歷史隱私優先","feature3":"聽懂任何語言的播客","continueWithGoogle":"使用 Google 登入"},"popup":{"sourceLanguage":"來源語言","translateTo":"翻譯成","automaticDetection":"自動偵測","searchLanguages":"搜尋語言...","remainingTime":"剩餘時間","currentPage":"目前頁面：","startTranslation":"🌐 在此頁面開始翻譯","stopButton":"⏹ 停止","connected":"✓ 已連線 - 在此分頁啟動","starting":"正在啟動...","stopping":"正在停止...","viewHistory":"檢視翻譯歷史","upgradeButton":"升級以解鎖更多時間","minutesExhausted":"時間已用盡","freeMinutesExhausted":"您的 DubTab 免費時間已用盡。\\n\\n請升級方案以取得更多時間。","paidMinutesExhausted":"目前方案的時間已用盡，時間將在下個計費週期重置。","paidMinutesExhaustedWithDate":"目前方案的時間已用盡。\\n\\n您的時間將於 {date} 重置。","billingIssue":"帳單問題","billingIssueMessage":"您的訂閱狀態為「{status}」。請先完成付款或在客戶入口網站中更新付款方式。","pageDetectionFailed":"⚠️ 頁面偵測失敗","cannotDetectPage":"無法偵測目前頁面，請重試。","cannotStartOnPage":"無法在此頁面啟動","pageNotSupported":"此頁面不支援音訊擷取。\\n\\n請開啟影片網站（如 YouTube、Netflix 等）後重試。","audioCaptureError":"⚠️ 音訊擷取錯誤","audioCaptureErrorMessage":"無法擷取分頁音訊，請重新整理頁面後重試。","quickStart":"快速入門","step1":"播放一個影片或音訊（YouTube、Netflix 等）","step2":"點擊「開始翻譯」— 你會看到字幕並聽到翻譯配音","tip":"💡 啟動前請確保頁面有音訊正在播放","instructionTip":"💡 開啟正在播放影片或音訊的頁面（YouTube、Twitch、Zoom 等），然後點擊","instructionStart":"開始","instructionOnPage":"即可。","planMinutes":"方案","extraLifetime":"額外（終身）","sourceLanguageTipsTitle":"來源語言選擇建議","sourceLanguageTipSingle":"單一語言音訊 → 手動選擇可提高準確率","sourceLanguageTipMultiple":"多語言混合 → 使用自動偵測"},"account":{"title":"帳戶資訊","email":"電子郵件","plan":"方案","status":"狀態","nextBillingDate":"下次扣款日期","endDate":"到期日期","minutesResetDate":"時間重置日期","logOut":"登出","manageSubscription":"管理訂閱","uiLanguage":"介面語言","uiLanguageTooltip":"此設定僅影響介面按鈕和文字，不影響字幕和翻譯語言。","noSubscriptionFound":"未找到訂閱","noSubscriptionMessage":"您尚未訂閱。升級後即可管理訂閱！","upgrade":"立即升級"},"history":{"title":"歷史記錄","reviewSessions":"回顧您的歷史工作階段","loading":"正在載入歷史記錄...","noSessionSelected":"未選取工作階段","selectSession":"從清單中選取一個工作階段以檢視逐字稿。","clearAllTitle":"清除所有歷史記錄？此操作無法復原。","deleteSessionTitle":"刪除此工作階段？此操作無法復原。","sessionDeleted":"工作階段已刪除","historyCleared":"歷史記錄已清除","failedToDelete":"刪除工作階段失敗","failedToClear":"清除歷史記錄失敗","failedToLoad":"載入歷史資料失敗。","notSignedIn":"尚未登入。請登入以檢視歷史記錄。","cannotDeleteRunning":"無法刪除進行中的工作階段，請先停止。","cannotClearRunning":"有工作階段正在進行中，無法清除歷史記錄。請先停止。","untitledSession":"未命名工作階段","ongoing":"進行中","clearAll":"全部清除","sessions":"工作階段","noSessions":"暫無工作階段","startNewSession":"開始翻譯後，您的歷史記錄將顯示於此。","copyAll":"複製全部","export":"匯出","exportWord":"Word","exportTxt":"TXT","copied":"已複製！","failedToCopy":"複製失敗","exportSuccess":"匯出成功","exportFailed":"匯出失敗","starredOnly":"僅顯示已收藏","searchPlaceholder":"搜尋逐字稿...","duration":"時長","from":"從","to":"至","segments":"條記錄","noTranscripts":"此工作階段暫無逐字稿。","clickStar":"點擊星號圖示以收藏重要片段。"},"overlay":{"listening":"正在監聽此頁面的影片/音訊","listeningTab":"正在監聽此分頁的音訊","listeningTabDesc":"請確保影片正在播放且未靜音，字幕將自動顯示。","listeningPageChangeDesc":"您已開啟新頁面，影片/音訊開始播放後字幕將自動恢復。","starting":"正在啟動...","translating":"正在翻譯","stopped":"已停止","clickStartToResume":"點擊開始繼續","waitingForAudio":"正在等待音訊...","makeSureVideoPlaying":"請確認影片正在播放且未靜音","resizeTooltip":"拖動右下角調整大小","stopTabUpdated":"頁面已切換，字幕已暫停。點擊開始繼續。","stopTabRemoved":"分頁已關閉，字幕已停止。","stopTabReplaced":"分頁已替換，字幕已停止。","stopNoAudioTimeout":"一段時間內未偵測到音訊，DubTab 已自動停止。點擊開始重新開啟。","pauseCaption":"暫停字幕","resumeCaption":"繼續字幕","bilingualMode":"雙語","translationOnly":"僅譯文","originalOnly":"僅原文","settings":"設定","close":"關閉","scrollToBottom":"捲動至底部","fontSize":"字體大小","fontSizeSmall":"小","fontSizeMedium":"中","fontSizeLarge":"大","fontSizeXLarge":"特大","theme":"主題","themeDark":"深色","themeLight":"淺色","opacity":"背景透明度","reset":"重設","upgradeRequired":"需要升級","freeQuotaExhausted":"您的免費時間已用盡。\\n\\n升級後可繼續享受即時翻譯服務。","upgradeNow":"立即升級","maybeLater":"稍後再說","followVoice":"跟隨語音","followVoiceTooltip":"跟隨目前語音朗讀"},"dock":{"ready":"就緒","connecting":"連線中...","translating":"翻譯中","error":"錯誤","pause":"暫停","sessionTime":"工作階段時間","selectVoice":"選擇語音","audioMixer":"音訊混音器","subtitleMode":"字幕模式","captionPanel":"字幕面板","cinemaMode":"影院模式","panel":"面板","cinema":"影院","audioOnly":"僅音訊","voiceOn":"譯文語音已開啟","voiceOff":"譯文語音已關閉","voice":"語音","settings":"設定","collapse":"收起","expand":"展開","close":"關閉"},"voiceSelector":{"title":"語音","auto":"自動","loadingVoices":"正在載入語音...","noVoices":"無可用語音","favorites":"收藏","moreVoices":"更多語音","switchingToVoice":"正在切換到新語音：{voiceName}","previousVoiceFallback":"先前選擇的語音","newVoiceFallback":"新的語音","voiceUnavailableSwitched":"先前選擇的語音「{previousVoice}」已不可用，已切換為「{nextVoice}」。"},"audioMixer":{"title":"音訊混音器","originalAudio":"原始音訊","translatedVoice":"譯文語音","voiceOnly":"僅配音","balanced":"均衡","originalOnly":"僅原音","audioDucking":"音量自動降低","audioDuckingDesc":"播放語音時降低分頁音訊","originalDuringVoice":"播放語音時的原音量","normalVolume":"正常","duringVoice":"播放時"},"settingsPanel":{"title":"設定","captionPanelFontSize":"字幕面板字體大小","cinemaModeFontSize":"影院模式字體大小","backgroundOpacity":"背景透明度","theme":"主題","darkTheme":"🌙 深色","lightTheme":"☀️ 淺色","resetSettings":"重置設定","resetDesc":"將所有設定還原為預設值","resetButton":"🔄 恢復預設值","resetComplete":"✓ 重置完成","subtitleDisplay":"字幕顯示","showBothLanguages":"顯示雙語","captionOrder":"字幕順序","originalFirst":"原文在上","translationFirst":"譯文在上","tooltipOriginal":"① 原文","tooltipTranslation":"① 譯文"},"quotaModal":{"freeTitle":"免費 10 分鐘已用完","freeSubtitle":"如需繼續即時翻譯與配音服務：","paidTitleTemplate":"本月 {plan} 方案時間已用完","paidTitle":"時間已用盡","paidSubtitleBuyMore":"如需本月繼續使用 DubTab，可購買額外終身時間：","paidSubtitleReached":"您已達到本月時間上限，工作階段已暫停以避免額外費用。","renewalInfo":"您的時間將於 {date} 重置","extraHoursPack":"額外時間包","smallPack":"小時包","smallPackDesc":"1 小時 · 終身有效，一次性購買","standardPack":"標準包","standardPackDesc":"4 小時 · 終身有效，一次性購買","largePack":"大時包","largePackDesc":"15 小時 · 終身有效，一次性購買","processing":"處理中...","openingStripeCheckout":"正在開啟支付頁面","monthly":"月付","yearly":"年付","upfront":"一次到帳","toggleHint":"全年時間一次到帳 • 無月度重置","hoursPerMonth":"{hours} 小時/月","hoursUpfrontPerYear":"{hours} 小時一次到帳（按年計）","perMonth":"/月","perYear":"/年","perMonthShort":"/月","approxPerMonth":"(約 ${price}/月)","starter":"入門版","pro":"專業版","power":"強力版","mostPopular":"最受歡迎","seeAllPlans":"檢視所有方案","maybeLater":"稍後再說"}}',
      );
    },
  },
]);
