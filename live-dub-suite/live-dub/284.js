"use strict";
(self.webpackChunkreactboilerplate =
  self.webpackChunkreactboilerplate || []).push([
  [284],
  {
    8908: (e, t, n) => {
      n.d(t, { A: () => c });
      var r = n(3337);
      const i = (e) => {
          const t = ((e) =>
            e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, n) =>
              n ? n.toUpperCase() : t.toLowerCase(),
            ))(e);
          return t.charAt(0).toUpperCase() + t.slice(1);
        },
        o = (...e) =>
          e
            .filter(
              (e, t, n) => Boolean(e) && "" !== e.trim() && n.indexOf(e) === t,
            )
            .join(" ")
            .trim(),
        a = (e) => {
          for (const t in e)
            if (t.startsWith("aria-") || "role" === t || "title" === t)
              return !0;
        };
      var s = {
        xmlns: "http://www.w3.org/2000/svg",
        width: 24,
        height: 24,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      };
      const u = (0, r.forwardRef)(
          (
            {
              color: e = "currentColor",
              size: t = 24,
              strokeWidth: n = 2,
              absoluteStrokeWidth: i,
              className: u = "",
              children: c,
              iconNode: l,
              ...h
            },
            f,
          ) =>
            (0, r.createElement)(
              "svg",
              {
                ref: f,
                ...s,
                width: t,
                height: t,
                stroke: e,
                strokeWidth: i ? (24 * Number(n)) / Number(t) : n,
                className: o("lucide", u),
                ...(!c && !a(h) && { "aria-hidden": "true" }),
                ...h,
              },
              [
                ...l.map(([e, t]) => (0, r.createElement)(e, t)),
                ...(Array.isArray(c) ? c : [c]),
              ],
            ),
        ),
        c = (e, t) => {
          const n = (0, r.forwardRef)(({ className: n, ...a }, s) => {
            return (0, r.createElement)(u, {
              ref: s,
              iconNode: t,
              className: o(
                `lucide-${((c = i(e)), c.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase())}`,
                `lucide-${e}`,
                n,
              ),
              ...a,
            });
            var c;
          });
          return ((n.displayName = i(e)), n);
        };
    },
    1480: (e, t, n) => {
      n.d(t, { A: () => r });
      const r = (0, n(8908).A)("calendar", [
        ["path", { d: "M8 2v4", key: "1cmpym" }],
        ["path", { d: "M16 2v4", key: "4m81vk" }],
        [
          "rect",
          { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" },
        ],
        ["path", { d: "M3 10h18", key: "8toen8" }],
      ]);
    },
    1639: (e, t, n) => {
      n.d(t, { A: () => r });
      const r = (0, n(8908).A)("circle-check", [
        ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
        ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }],
      ]);
    },
    3850: (e, t, n) => {
      n.d(t, { A: () => r });
      const r = (0, n(8908).A)("clock", [
        ["path", { d: "M12 6v6l4 2", key: "mmk7yg" }],
        ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
      ]);
    },
    7941: (e, t, n) => {
      n.d(t, { A: () => r });
      const r = (0, n(8908).A)("cloud", [
        [
          "path",
          {
            d: "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z",
            key: "p7xjir",
          },
        ],
      ]);
    },
    2007: (e, t, n) => {
      n.d(t, { A: () => r });
      const r = (0, n(8908).A)("copy", [
        [
          "rect",
          {
            width: "14",
            height: "14",
            x: "8",
            y: "8",
            rx: "2",
            ry: "2",
            key: "17jyea",
          },
        ],
        [
          "path",
          {
            d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
            key: "zix9uf",
          },
        ],
      ]);
    },
    3342: (e, t, n) => {
      n.d(t, { A: () => r });
      const r = (0, n(8908).A)("download", [
        ["path", { d: "M12 15V3", key: "m9g1x1" }],
        [
          "path",
          { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" },
        ],
        ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }],
      ]);
    },
    6798: (e, t, n) => {
      n.d(t, { A: () => r });
      const r = (0, n(8908).A)("funnel", [
        [
          "path",
          {
            d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
            key: "sc7q7i",
          },
        ],
      ]);
    },
    817: (e, t, n) => {
      n.d(t, { A: () => r });
      const r = (0, n(8908).A)("globe", [
        ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
        [
          "path",
          {
            d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",
            key: "13o1zl",
          },
        ],
        ["path", { d: "M2 12h20", key: "9i4pu4" }],
      ]);
    },
    315: (e, t, n) => {
      n.d(t, { A: () => r });
      const r = (0, n(8908).A)("pen", [
        [
          "path",
          {
            d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
            key: "1a8usu",
          },
        ],
      ]);
    },
    359: (e, t, n) => {
      n.d(t, { A: () => r });
      const r = (0, n(8908).A)("radio", [
        ["path", { d: "M16.247 7.761a6 6 0 0 1 0 8.478", key: "1fwjs5" }],
        ["path", { d: "M19.075 4.933a10 10 0 0 1 0 14.134", key: "ehdyv1" }],
        ["path", { d: "M4.925 19.067a10 10 0 0 1 0-14.134", key: "1q22gi" }],
        ["path", { d: "M7.753 16.239a6 6 0 0 1 0-8.478", key: "r2q7qm" }],
        ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }],
      ]);
    },
    8542: (e, t, n) => {
      n.d(t, { A: () => r });
      const r = (0, n(8908).A)("search", [
        ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
        ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
      ]);
    },
    7878: (e, t, n) => {
      n.d(t, { A: () => r });
      const r = (0, n(8908).A)("star", [
        [
          "path",
          {
            d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
            key: "r04s7s",
          },
        ],
      ]);
    },
    8037: (e, t, n) => {
      n.d(t, { A: () => r });
      const r = (0, n(8908).A)("trash-2", [
        ["path", { d: "M10 11v6", key: "nco0om" }],
        ["path", { d: "M14 11v6", key: "outv1u" }],
        [
          "path",
          { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" },
        ],
        ["path", { d: "M3 6h18", key: "d0wm0j" }],
        [
          "path",
          { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" },
        ],
      ]);
    },
    6653: (e, t, n) => {
      n.d(t, { A: () => r });
      const r = (0, n(8908).A)("triangle-alert", [
        [
          "path",
          {
            d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
            key: "wmoenq",
          },
        ],
        ["path", { d: "M12 9v4", key: "juzpu7" }],
        ["path", { d: "M12 17h.01", key: "p32p05" }],
      ]);
    },
    2722: (e, t, n) => {
      n.d(t, { HO: () => an, l_: () => bn });
      function r(e) {
        for (
          var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1;
          r < t;
          r++
        )
          n[r - 1] = arguments[r];
        throw new Error(
          "number" == typeof e
            ? "[MobX] minified error nr: " +
                e +
                (n.length ? " " + n.map(String).join(",") : "") +
                ". Find the full error at: https://github.com/mobxjs/mobx/blob/main/packages/mobx/src/errors.ts"
            : "[MobX] " + e,
        );
      }
      var i = {};
      function o() {
        return "undefined" != typeof globalThis
          ? globalThis
          : "undefined" != typeof window
            ? window
            : void 0 !== n.g
              ? n.g
              : "undefined" != typeof self
                ? self
                : i;
      }
      var a = Object.assign,
        s = Object.getOwnPropertyDescriptor,
        u = Object.defineProperty,
        c = Object.prototype,
        l = [];
      Object.freeze(l);
      var h = {};
      Object.freeze(h);
      var f = "undefined" != typeof Proxy,
        _ = Object.toString();
      function d() {
        f || r("Proxy not available");
      }
      function v(e) {
        var t = !1;
        return function () {
          if (!t) return ((t = !0), e.apply(this, arguments));
        };
      }
      var p = function () {};
      function b(e) {
        return "function" == typeof e;
      }
      function y(e) {
        switch (typeof e) {
          case "string":
          case "symbol":
          case "number":
            return !0;
        }
        return !1;
      }
      function g(e) {
        return null !== e && "object" == typeof e;
      }
      function m(e) {
        if (!g(e)) return !1;
        var t = Object.getPrototypeOf(e);
        if (null == t) return !0;
        var n = Object.hasOwnProperty.call(t, "constructor") && t.constructor;
        return "function" == typeof n && n.toString() === _;
      }
      function O(e) {
        var t = null == e ? void 0 : e.constructor;
        return (
          !!t &&
          ("GeneratorFunction" === t.name ||
            "GeneratorFunction" === t.displayName)
        );
      }
      function A(e, t, n) {
        u(e, t, { enumerable: !1, writable: !0, configurable: !0, value: n });
      }
      function w(e, t, n) {
        u(e, t, { enumerable: !1, writable: !1, configurable: !0, value: n });
      }
      function S(e, t) {
        var n = "isMobX" + e;
        return (
          (t.prototype[n] = !0),
          function (e) {
            return g(e) && !0 === e[n];
          }
        );
      }
      function k(e) {
        return e instanceof Map;
      }
      function j(e) {
        return e instanceof Set;
      }
      var x = void 0 !== Object.getOwnPropertySymbols;
      var E =
        "undefined" != typeof Reflect && Reflect.ownKeys
          ? Reflect.ownKeys
          : x
            ? function (e) {
                return Object.getOwnPropertyNames(e).concat(
                  Object.getOwnPropertySymbols(e),
                );
              }
            : Object.getOwnPropertyNames;
      function P(e) {
        return null === e ? null : "object" == typeof e ? "" + e : e;
      }
      function V(e, t) {
        return c.hasOwnProperty.call(e, t);
      }
      var T =
        Object.getOwnPropertyDescriptors ||
        function (e) {
          var t = {};
          return (
            E(e).forEach(function (n) {
              t[n] = s(e, n);
            }),
            t
          );
        };
      function C(e, t) {
        for (var n = 0; n < t.length; n++) {
          var r = t[n];
          ((r.enumerable = r.enumerable || !1),
            (r.configurable = !0),
            "value" in r && (r.writable = !0),
            Object.defineProperty(
              e,
              ((i = r.key),
              (o = void 0),
              "symbol" ==
              typeof (o = (function (e, t) {
                if ("object" != typeof e || null === e) return e;
                var n = e[Symbol.toPrimitive];
                if (void 0 !== n) {
                  var r = n.call(e, t || "default");
                  if ("object" != typeof r) return r;
                  throw new TypeError(
                    "@@toPrimitive must return a primitive value.",
                  );
                }
                return ("string" === t ? String : Number)(e);
              })(i, "string"))
                ? o
                : String(o)),
              r,
            ));
        }
        var i, o;
      }
      function L(e, t, n) {
        return (
          t && C(e.prototype, t),
          n && C(e, n),
          Object.defineProperty(e, "prototype", { writable: !1 }),
          e
        );
      }
      function N() {
        return (
          (N = Object.assign
            ? Object.assign.bind()
            : function (e) {
                for (var t = 1; t < arguments.length; t++) {
                  var n = arguments[t];
                  for (var r in n)
                    Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
                }
                return e;
              }),
          N.apply(this, arguments)
        );
      }
      function M(e, t) {
        ((e.prototype = Object.create(t.prototype)),
          (e.prototype.constructor = e),
          D(e, t));
      }
      function D(e, t) {
        return (
          (D = Object.setPrototypeOf
            ? Object.setPrototypeOf.bind()
            : function (e, t) {
                return ((e.__proto__ = t), e);
              }),
          D(e, t)
        );
      }
      function R(e) {
        if (void 0 === e)
          throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called",
          );
        return e;
      }
      function B(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
        return r;
      }
      function I(e, t) {
        var n =
          ("undefined" != typeof Symbol && e[Symbol.iterator]) ||
          e["@@iterator"];
        if (n) return (n = n.call(e)).next.bind(n);
        if (
          Array.isArray(e) ||
          (n = (function (e, t) {
            if (e) {
              if ("string" == typeof e) return B(e, t);
              var n = Object.prototype.toString.call(e).slice(8, -1);
              return (
                "Object" === n && e.constructor && (n = e.constructor.name),
                "Map" === n || "Set" === n
                  ? Array.from(e)
                  : "Arguments" === n ||
                      /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                    ? B(e, t)
                    : void 0
              );
            }
          })(e)) ||
          (t && e && "number" == typeof e.length)
        ) {
          n && (e = n);
          var r = 0;
          return function () {
            return r >= e.length ? { done: !0 } : { done: !1, value: e[r++] };
          };
        }
        throw new TypeError(
          "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
        );
      }
      var U = Symbol("mobx-stored-annotations");
      function K(e) {
        return Object.assign(function (t, n) {
          if (z(n)) return e.decorate_20223_(t, n);
          G(t, n, e);
        }, e);
      }
      function G(e, t, n) {
        (V(e, U) || A(e, U, N({}, e[U])),
          (function (e) {
            return e.annotationType_ === J;
          })(n) || (e[U][t] = n));
      }
      function z(e) {
        return "object" == typeof e && "string" == typeof e.kind;
      }
      var q = Symbol("mobx administration"),
        H = (function () {
          function e(e) {
            (void 0 === e && (e = "Atom"),
              (this.name_ = void 0),
              (this.isPendingUnobservation_ = !1),
              (this.isBeingObserved_ = !1),
              (this.observers_ = new Set()),
              (this.diffValue_ = 0),
              (this.lastAccessedBy_ = 0),
              (this.lowestObserverState_ = Ye.NOT_TRACKING_),
              (this.onBOL = void 0),
              (this.onBUOL = void 0),
              (this.name_ = e));
          }
          var t = e.prototype;
          return (
            (t.onBO = function () {
              this.onBOL &&
                this.onBOL.forEach(function (e) {
                  return e();
                });
            }),
            (t.onBUO = function () {
              this.onBUOL &&
                this.onBUOL.forEach(function (e) {
                  return e();
                });
            }),
            (t.reportObserved = function () {
              return Ot(this);
            }),
            (t.reportChanged = function () {
              (gt(), At(this), mt());
            }),
            (t.toString = function () {
              return this.name_;
            }),
            e
          );
        })(),
        W = S("Atom", H);
      function X(e, t, n) {
        (void 0 === t && (t = p), void 0 === n && (n = p));
        var r,
          i = new H(e);
        return (t !== p && Wt(zt, i, t, r), n !== p && Ht(i, n), i);
      }
      var F = {
        identity: function (e, t) {
          return e === t;
        },
        structural: function (e, t) {
          return _r(e, t);
        },
        default: function (e, t) {
          return Object.is
            ? Object.is(e, t)
            : e === t
              ? 0 !== e || 1 / e == 1 / t
              : e != e && t != t;
        },
        shallow: function (e, t) {
          return _r(e, t, 1);
        },
      };
      function $(e, t, n) {
        return nn(e)
          ? e
          : Array.isArray(e)
            ? Le.array(e, { name: n })
            : m(e)
              ? Le.object(e, void 0, { name: n })
              : k(e)
                ? Le.map(e, { name: n })
                : j(e)
                  ? Le.set(e, { name: n })
                  : "function" != typeof e || It(e) || en(e)
                    ? e
                    : O(e)
                      ? Zt(e)
                      : Bt(n, e);
      }
      function Y(e) {
        return e;
      }
      var J = "override";
      function Z(e, t) {
        return {
          annotationType_: e,
          options_: t,
          make_: Q,
          extend_: ee,
          decorate_20223_: te,
        };
      }
      function Q(e, t, n, r) {
        var i;
        if (null != (i = this.options_) && i.bound)
          return null === this.extend_(e, t, n, !1) ? 0 : 1;
        if (r === e.target_) return null === this.extend_(e, t, n, !1) ? 0 : 2;
        if (It(n.value)) return 1;
        var o = ne(e, this, t, n, !1);
        return (u(r, t, o), 2);
      }
      function ee(e, t, n, r) {
        var i = ne(e, this, t, n);
        return e.defineProperty_(t, i, r);
      }
      function te(e, t) {
        var n = t.kind,
          i = t.name,
          o = t.addInitializer,
          a = this;
        if ("field" != n) {
          var s, u, c, l, h, f;
          if ("method" == n)
            return (
              It(e) ||
                ((u = e),
                (e = ze(
                  null != (c = null == (l = a.options_) ? void 0 : l.name)
                    ? c
                    : i.toString(),
                  u,
                  null !=
                    (h = null == (f = a.options_) ? void 0 : f.autoAction) && h,
                ))),
              null != (s = this.options_) &&
                s.bound &&
                o(function () {
                  var e = this,
                    t = e[i].bind(e);
                  ((t.isMobxAction = !0), (e[i] = t));
                }),
              e
            );
          r(
            "Cannot apply '" +
              a.annotationType_ +
              "' to '" +
              String(i) +
              "' (kind: " +
              n +
              "):\n'" +
              a.annotationType_ +
              "' can only be used on properties with a function value.",
          );
        } else
          o(function () {
            G(this, i, a);
          });
      }
      function ne(e, t, n, r, i) {
        var o, a, s, u, c, l, h, f;
        (void 0 === i && (i = vt.safeDescriptors),
          (f = r),
          t.annotationType_,
          f.value);
        var _,
          d = r.value;
        null != (o = t.options_) &&
          o.bound &&
          (d = d.bind(null != (_ = e.proxy_) ? _ : e.target_));
        return {
          value: ze(
            null != (a = null == (s = t.options_) ? void 0 : s.name)
              ? a
              : n.toString(),
            d,
            null != (u = null == (c = t.options_) ? void 0 : c.autoAction) && u,
            null != (l = t.options_) && l.bound
              ? null != (h = e.proxy_)
                ? h
                : e.target_
              : void 0,
          ),
          configurable: !i || e.isPlainObject_,
          enumerable: !1,
          writable: !i,
        };
      }
      function re(e, t) {
        return {
          annotationType_: e,
          options_: t,
          make_: ie,
          extend_: oe,
          decorate_20223_: ae,
        };
      }
      function ie(e, t, n, r) {
        var i;
        if (r === e.target_) return null === this.extend_(e, t, n, !1) ? 0 : 2;
        if (
          null != (i = this.options_) &&
          i.bound &&
          (!V(e.target_, t) || !en(e.target_[t])) &&
          null === this.extend_(e, t, n, !1)
        )
          return 0;
        if (en(n.value)) return 1;
        var o = se(e, this, t, n, !1, !1);
        return (u(r, t, o), 2);
      }
      function oe(e, t, n, r) {
        var i,
          o = se(e, this, t, n, null == (i = this.options_) ? void 0 : i.bound);
        return e.defineProperty_(t, o, r);
      }
      function ae(e, t) {
        var n;
        var r = t.name,
          i = t.addInitializer;
        return (
          en(e) || (e = Zt(e)),
          null != (n = this.options_) &&
            n.bound &&
            i(function () {
              var e = this,
                t = e[r].bind(e);
              ((t.isMobXFlow = !0), (e[r] = t));
            }),
          e
        );
      }
      function se(e, t, n, r, i, o) {
        var a;
        (void 0 === o && (o = vt.safeDescriptors),
          (a = r),
          t.annotationType_,
          a.value);
        var s,
          u = r.value;
        (en(u) || (u = Zt(u)), i) &&
          ((u = u.bind(null != (s = e.proxy_) ? s : e.target_)).isMobXFlow =
            !0);
        return {
          value: u,
          configurable: !o || e.isPlainObject_,
          enumerable: !1,
          writable: !o,
        };
      }
      function ue(e, t) {
        return {
          annotationType_: e,
          options_: t,
          make_: ce,
          extend_: le,
          decorate_20223_: he,
        };
      }
      function ce(e, t, n) {
        return null === this.extend_(e, t, n, !1) ? 0 : 1;
      }
      function le(e, t, n, r) {
        return (
          (function (e, t, n, r) {
            (t.annotationType_, r.get);
            0;
          })(0, this, 0, n),
          e.defineComputedProperty_(
            t,
            N({}, this.options_, { get: n.get, set: n.set }),
            r,
          )
        );
      }
      function he(e, t) {
        var n = this,
          r = t.name;
        return (
          (0, t.addInitializer)(function () {
            var t = Hn(this)[q],
              i = N({}, n.options_, { get: e, context: this });
            (i.name || (i.name = "ObservableObject." + r.toString()),
              t.values_.set(r, new Ze(i)));
          }),
          function () {
            return this[q].getObservablePropValue_(r);
          }
        );
      }
      function fe(e, t) {
        return {
          annotationType_: e,
          options_: t,
          make_: _e,
          extend_: de,
          decorate_20223_: ve,
        };
      }
      function _e(e, t, n) {
        return null === this.extend_(e, t, n, !1) ? 0 : 1;
      }
      function de(e, t, n, r) {
        var i, o;
        return (
          (function (e, t, n, r) {
            t.annotationType_;
            0;
          })(0, this),
          e.defineObservableProperty_(
            t,
            n.value,
            null != (i = null == (o = this.options_) ? void 0 : o.enhancer)
              ? i
              : $,
            r,
          )
        );
      }
      function ve(e, t) {
        var n = this,
          r = t.kind,
          i = t.name,
          o = new WeakSet();
        function a(e, t) {
          var r,
            a,
            s = Hn(e)[q],
            u = new Fe(
              t,
              null != (r = null == (a = n.options_) ? void 0 : a.enhancer)
                ? r
                : $,
              "ObservableObject." + i.toString(),
              !1,
            );
          (s.values_.set(i, u), o.add(e));
        }
        if ("accessor" == r)
          return {
            get: function () {
              return (
                o.has(this) || a(this, e.get.call(this)),
                this[q].getObservablePropValue_(i)
              );
            },
            set: function (e) {
              return (
                o.has(this) || a(this, e),
                this[q].setObservablePropValue_(i, e)
              );
            },
            init: function (e) {
              return (o.has(this) || a(this, e), e);
            },
          };
      }
      var pe = "true",
        be = ye();
      function ye(e) {
        return {
          annotationType_: pe,
          options_: e,
          make_: ge,
          extend_: me,
          decorate_20223_: Oe,
        };
      }
      function ge(e, t, n, r) {
        var i, o, a, s;
        if (n.get) return Re.make_(e, t, n, r);
        if (n.set) {
          var c = ze(t.toString(), n.set);
          return r === e.target_
            ? null ===
              e.defineProperty_(t, {
                configurable: !vt.safeDescriptors || e.isPlainObject_,
                set: c,
              })
              ? 0
              : 2
            : (u(r, t, { configurable: !0, set: c }), 2);
        }
        if (r !== e.target_ && "function" == typeof n.value)
          return O(n.value)
            ? (null != (s = this.options_) && s.autoBind ? Zt.bound : Zt).make_(
                e,
                t,
                n,
                r,
              )
            : (null != (a = this.options_) && a.autoBind ? Bt.bound : Bt).make_(
                e,
                t,
                n,
                r,
              );
        var l,
          h =
            !1 === (null == (i = this.options_) ? void 0 : i.deep)
              ? Le.ref
              : Le;
        "function" == typeof n.value &&
          null != (o = this.options_) &&
          o.autoBind &&
          (n.value = n.value.bind(null != (l = e.proxy_) ? l : e.target_));
        return h.make_(e, t, n, r);
      }
      function me(e, t, n, r) {
        var i, o, a;
        if (n.get) return Re.extend_(e, t, n, r);
        if (n.set)
          return e.defineProperty_(
            t,
            {
              configurable: !vt.safeDescriptors || e.isPlainObject_,
              set: ze(t.toString(), n.set),
            },
            r,
          );
        "function" == typeof n.value &&
          null != (i = this.options_) &&
          i.autoBind &&
          (n.value = n.value.bind(null != (a = e.proxy_) ? a : e.target_));
        return (
          !1 === (null == (o = this.options_) ? void 0 : o.deep) ? Le.ref : Le
        ).extend_(e, t, n, r);
      }
      function Oe(e, t) {
        r("'" + this.annotationType_ + "' cannot be used as a decorator");
      }
      var Ae = { deep: !0, name: void 0, defaultDecorator: void 0, proxy: !0 };
      function we(e) {
        return e || Ae;
      }
      Object.freeze(Ae);
      var Se = fe("observable"),
        ke = fe("observable.ref", { enhancer: Y }),
        je = fe("observable.shallow", {
          enhancer: function (e, t, n) {
            return null == e || Fn(e) || Tn(e) || Bn(e) || Kn(e)
              ? e
              : Array.isArray(e)
                ? Le.array(e, { name: n, deep: !1 })
                : m(e)
                  ? Le.object(e, void 0, { name: n, deep: !1 })
                  : k(e)
                    ? Le.map(e, { name: n, deep: !1 })
                    : j(e)
                      ? Le.set(e, { name: n, deep: !1 })
                      : void 0;
          },
        }),
        xe = fe("observable.struct", {
          enhancer: function (e, t) {
            return _r(e, t) ? t : e;
          },
        }),
        Ee = K(Se);
      function Pe(e) {
        return !0 === e.deep
          ? $
          : !1 === e.deep
            ? Y
            : (t = e.defaultDecorator) &&
                null != (n = null == (r = t.options_) ? void 0 : r.enhancer)
              ? n
              : $;
        var t, n, r;
      }
      function Ve(e, t, n) {
        return z(t)
          ? Se.decorate_20223_(e, t)
          : y(t)
            ? void G(e, t, Se)
            : nn(e)
              ? e
              : m(e)
                ? Le.object(e, t, n)
                : Array.isArray(e)
                  ? Le.array(e, t)
                  : k(e)
                    ? Le.map(e, t)
                    : j(e)
                      ? Le.set(e, t)
                      : "object" == typeof e && null !== e
                        ? e
                        : Le.box(e, t);
      }
      a(Ve, Ee);
      var Te,
        Ce,
        Le = a(Ve, {
          box: function (e, t) {
            var n = we(t);
            return new Fe(e, Pe(n), n.name, !0, n.equals);
          },
          array: function (e, t) {
            var n = we(t);
            return (!1 === vt.useProxies || !1 === n.proxy ? sr : An)(
              e,
              Pe(n),
              n.name,
            );
          },
          map: function (e, t) {
            var n = we(t);
            return new Rn(e, Pe(n), n.name);
          },
          set: function (e, t) {
            var n = we(t);
            return new Un(e, Pe(n), n.name);
          },
          object: function (e, t, n) {
            return hr(function () {
              return Xt(
                !1 === vt.useProxies || !1 === (null == n ? void 0 : n.proxy)
                  ? Hn({}, n)
                  : (function (e, t) {
                      var n, r;
                      return (
                        d(),
                        (e = Hn(e, t)),
                        null != (r = (n = e[q]).proxy_)
                          ? r
                          : (n.proxy_ = new Proxy(e, cn))
                      );
                    })({}, n),
                e,
                t,
              );
            });
          },
          ref: K(ke),
          shallow: K(je),
          deep: Ee,
          struct: K(xe),
        }),
        Ne = "computed",
        Me = ue(Ne),
        De = ue("computed.struct", { equals: F.structural }),
        Re = function (e, t) {
          if (z(t)) return Me.decorate_20223_(e, t);
          if (y(t)) return G(e, t, Me);
          if (m(e)) return K(ue(Ne, e));
          var n = m(t) ? t : {};
          return ((n.get = e), n.name || (n.name = e.name || ""), new Ze(n));
        };
      (Object.assign(Re, Me), (Re.struct = K(De)));
      var Be,
        Ie = 0,
        Ue = 1,
        Ke =
          null !=
            (Te =
              null == (Ce = s(function () {}, "name"))
                ? void 0
                : Ce.configurable) && Te,
        Ge = {
          value: "action",
          configurable: !0,
          writable: !1,
          enumerable: !1,
        };
      function ze(e, t, n, r) {
        function i() {
          return qe(e, n, t, r || this, arguments);
        }
        return (
          void 0 === n && (n = !1),
          (i.isMobxAction = !0),
          (i.toString = function () {
            return t.toString();
          }),
          Ke && ((Ge.value = e), u(i, "name", Ge)),
          i
        );
      }
      function qe(e, t, n, i, o) {
        var a = (function (e, t, n, r) {
          var i = !1,
            o = 0;
          0;
          var a = vt.trackingDerivation,
            s = !t || !a;
          gt();
          var u = vt.allowStateChanges;
          s && (st(), (u = He(!0)));
          var c = ct(!0),
            l = {
              runAsAction_: s,
              prevDerivation_: a,
              prevAllowStateChanges_: u,
              prevAllowStateReads_: c,
              notifySpy_: i,
              startTime_: o,
              actionId_: Ue++,
              parentActionId_: Ie,
            };
          return ((Ie = l.actionId_), l);
        })(0, t);
        try {
          return n.apply(i, o);
        } catch (e) {
          throw ((a.error_ = e), e);
        } finally {
          !(function (e) {
            Ie !== e.actionId_ && r(30);
            ((Ie = e.parentActionId_),
              void 0 !== e.error_ && (vt.suppressReactionErrors = !0));
            (We(e.prevAllowStateChanges_),
              lt(e.prevAllowStateReads_),
              mt(),
              e.runAsAction_ && ut(e.prevDerivation_));
            0;
            vt.suppressReactionErrors = !1;
          })(a);
        }
      }
      function He(e) {
        var t = vt.allowStateChanges;
        return ((vt.allowStateChanges = e), t);
      }
      function We(e) {
        vt.allowStateChanges = e;
      }
      Be = Symbol.toPrimitive;
      var Xe,
        Fe = (function (e) {
          function t(t, n, r, i, o) {
            var a;
            return (
              void 0 === r && (r = "ObservableValue"),
              void 0 === i && (i = !0),
              void 0 === o && (o = F.default),
              ((a = e.call(this, r) || this).enhancer = void 0),
              (a.name_ = void 0),
              (a.equals = void 0),
              (a.hasUnreportedChange_ = !1),
              (a.interceptors_ = void 0),
              (a.changeListeners_ = void 0),
              (a.value_ = void 0),
              (a.dehancer = void 0),
              (a.enhancer = n),
              (a.name_ = r),
              (a.equals = o),
              (a.value_ = n(t, void 0, r)),
              a
            );
          }
          M(t, e);
          var n = t.prototype;
          return (
            (n.dehanceValue = function (e) {
              return void 0 !== this.dehancer ? this.dehancer(e) : e;
            }),
            (n.set = function (e) {
              this.value_;
              if ((e = this.prepareNewValue_(e)) !== vt.UNCHANGED) {
                (0, this.setNewValue_(e));
              }
            }),
            (n.prepareNewValue_ = function (e) {
              if ((rt(this), ln(this))) {
                var t = fn(this, { object: this, type: gn, newValue: e });
                if (!t) return vt.UNCHANGED;
                e = t.newValue;
              }
              return (
                (e = this.enhancer(e, this.value_, this.name_)),
                this.equals(this.value_, e) ? vt.UNCHANGED : e
              );
            }),
            (n.setNewValue_ = function (e) {
              var t = this.value_;
              ((this.value_ = e),
                this.reportChanged(),
                _n(this) &&
                  vn(this, {
                    type: gn,
                    object: this,
                    newValue: e,
                    oldValue: t,
                  }));
            }),
            (n.get = function () {
              return (this.reportObserved(), this.dehanceValue(this.value_));
            }),
            (n.intercept_ = function (e) {
              return hn(this, e);
            }),
            (n.observe_ = function (e, t) {
              return (
                t &&
                  e({
                    observableKind: "value",
                    debugObjectName: this.name_,
                    object: this,
                    type: gn,
                    newValue: this.value_,
                    oldValue: void 0,
                  }),
                dn(this, e)
              );
            }),
            (n.raw = function () {
              return this.value_;
            }),
            (n.toJSON = function () {
              return this.get();
            }),
            (n.toString = function () {
              return this.name_ + "[" + this.value_ + "]";
            }),
            (n.valueOf = function () {
              return P(this.get());
            }),
            (n[Be] = function () {
              return this.valueOf();
            }),
            t
          );
        })(H),
        $e = S("ObservableValue", Fe);
      Xe = Symbol.toPrimitive;
      var Ye,
        Je,
        Ze = (function () {
          function e(e) {
            ((this.dependenciesState_ = Ye.NOT_TRACKING_),
              (this.observing_ = []),
              (this.newObserving_ = null),
              (this.isBeingObserved_ = !1),
              (this.isPendingUnobservation_ = !1),
              (this.observers_ = new Set()),
              (this.diffValue_ = 0),
              (this.runId_ = 0),
              (this.lastAccessedBy_ = 0),
              (this.lowestObserverState_ = Ye.UP_TO_DATE_),
              (this.unboundDepsCount_ = 0),
              (this.value_ = new et(null)),
              (this.name_ = void 0),
              (this.triggeredBy_ = void 0),
              (this.isComputing_ = !1),
              (this.isRunningSetter_ = !1),
              (this.derivation = void 0),
              (this.setter_ = void 0),
              (this.isTracing_ = Je.NONE),
              (this.scope_ = void 0),
              (this.equals_ = void 0),
              (this.requiresReaction_ = void 0),
              (this.keepAlive_ = void 0),
              (this.onBOL = void 0),
              (this.onBUOL = void 0),
              e.get || r(31),
              (this.derivation = e.get),
              (this.name_ = e.name || "ComputedValue"),
              e.set && (this.setter_ = ze("ComputedValue-setter", e.set)),
              (this.equals_ =
                e.equals ||
                (e.compareStructural || e.struct ? F.structural : F.default)),
              (this.scope_ = e.context),
              (this.requiresReaction_ = e.requiresReaction),
              (this.keepAlive_ = !!e.keepAlive));
          }
          var t = e.prototype;
          return (
            (t.onBecomeStale_ = function () {
              !(function (e) {
                if (e.lowestObserverState_ !== Ye.UP_TO_DATE_) return;
                ((e.lowestObserverState_ = Ye.POSSIBLY_STALE_),
                  e.observers_.forEach(function (e) {
                    e.dependenciesState_ === Ye.UP_TO_DATE_ &&
                      ((e.dependenciesState_ = Ye.POSSIBLY_STALE_),
                      e.onBecomeStale_());
                  }));
              })(this);
            }),
            (t.onBO = function () {
              this.onBOL &&
                this.onBOL.forEach(function (e) {
                  return e();
                });
            }),
            (t.onBUO = function () {
              this.onBUOL &&
                this.onBUOL.forEach(function (e) {
                  return e();
                });
            }),
            (t.get = function () {
              if (
                (this.isComputing_ && r(32, this.name_, this.derivation),
                0 !== vt.inBatch ||
                  0 !== this.observers_.size ||
                  this.keepAlive_)
              ) {
                if ((Ot(this), nt(this))) {
                  var e = vt.trackingContext;
                  (this.keepAlive_ && !e && (vt.trackingContext = this),
                    this.trackAndCompute() &&
                      (function (e) {
                        if (e.lowestObserverState_ === Ye.STALE_) return;
                        ((e.lowestObserverState_ = Ye.STALE_),
                          e.observers_.forEach(function (t) {
                            t.dependenciesState_ === Ye.POSSIBLY_STALE_
                              ? (t.dependenciesState_ = Ye.STALE_)
                              : t.dependenciesState_ === Ye.UP_TO_DATE_ &&
                                (e.lowestObserverState_ = Ye.UP_TO_DATE_);
                          }));
                      })(this),
                    (vt.trackingContext = e));
                }
              } else
                nt(this) &&
                  (this.warnAboutUntrackedRead_(),
                  gt(),
                  (this.value_ = this.computeValue_(!1)),
                  mt());
              var t = this.value_;
              if (tt(t)) throw t.cause;
              return t;
            }),
            (t.set = function (e) {
              if (this.setter_) {
                (this.isRunningSetter_ && r(33, this.name_),
                  (this.isRunningSetter_ = !0));
                try {
                  this.setter_.call(this.scope_, e);
                } finally {
                  this.isRunningSetter_ = !1;
                }
              } else r(34, this.name_);
            }),
            (t.trackAndCompute = function () {
              var e = this.value_,
                t = this.dependenciesState_ === Ye.NOT_TRACKING_,
                n = this.computeValue_(!0),
                r = t || tt(e) || tt(n) || !this.equals_(e, n);
              return (r && (this.value_ = n), r);
            }),
            (t.computeValue_ = function (e) {
              this.isComputing_ = !0;
              var t,
                n = He(!1);
              if (e) t = it(this, this.derivation, this.scope_);
              else if (!0 === vt.disableErrorBoundaries)
                t = this.derivation.call(this.scope_);
              else
                try {
                  t = this.derivation.call(this.scope_);
                } catch (e) {
                  t = new et(e);
                }
              return (We(n), (this.isComputing_ = !1), t);
            }),
            (t.suspend_ = function () {
              this.keepAlive_ || (ot(this), (this.value_ = void 0));
            }),
            (t.observe_ = function (e, t) {
              var n = this,
                r = !0,
                i = void 0;
              return Ut(function () {
                var o = n.get();
                if (!r || t) {
                  var a = st();
                  (e({
                    observableKind: "computed",
                    debugObjectName: n.name_,
                    type: gn,
                    object: n,
                    newValue: o,
                    oldValue: i,
                  }),
                    ut(a));
                }
                ((r = !1), (i = o));
              });
            }),
            (t.warnAboutUntrackedRead_ = function () {}),
            (t.toString = function () {
              return this.name_ + "[" + this.derivation.toString() + "]";
            }),
            (t.valueOf = function () {
              return P(this.get());
            }),
            (t[Xe] = function () {
              return this.valueOf();
            }),
            e
          );
        })(),
        Qe = S("ComputedValue", Ze);
      (!(function (e) {
        ((e[(e.NOT_TRACKING_ = -1)] = "NOT_TRACKING_"),
          (e[(e.UP_TO_DATE_ = 0)] = "UP_TO_DATE_"),
          (e[(e.POSSIBLY_STALE_ = 1)] = "POSSIBLY_STALE_"),
          (e[(e.STALE_ = 2)] = "STALE_"));
      })(Ye || (Ye = {})),
        (function (e) {
          ((e[(e.NONE = 0)] = "NONE"),
            (e[(e.LOG = 1)] = "LOG"),
            (e[(e.BREAK = 2)] = "BREAK"));
        })(Je || (Je = {})));
      var et = function (e) {
        ((this.cause = void 0), (this.cause = e));
      };
      function tt(e) {
        return e instanceof et;
      }
      function nt(e) {
        switch (e.dependenciesState_) {
          case Ye.UP_TO_DATE_:
            return !1;
          case Ye.NOT_TRACKING_:
          case Ye.STALE_:
            return !0;
          case Ye.POSSIBLY_STALE_:
            for (
              var t = ct(!0), n = st(), r = e.observing_, i = r.length, o = 0;
              o < i;
              o++
            ) {
              var a = r[o];
              if (Qe(a)) {
                if (vt.disableErrorBoundaries) a.get();
                else
                  try {
                    a.get();
                  } catch (e) {
                    return (ut(n), lt(t), !0);
                  }
                if (e.dependenciesState_ === Ye.STALE_)
                  return (ut(n), lt(t), !0);
              }
            }
            return (ht(e), ut(n), lt(t), !1);
        }
      }
      function rt(e) {}
      function it(e, t, n) {
        var r = ct(!0);
        (ht(e),
          (e.newObserving_ = new Array(e.observing_.length + 100)),
          (e.unboundDepsCount_ = 0),
          (e.runId_ = ++vt.runId));
        var i,
          o = vt.trackingDerivation;
        if (
          ((vt.trackingDerivation = e),
          vt.inBatch++,
          !0 === vt.disableErrorBoundaries)
        )
          i = t.call(n);
        else
          try {
            i = t.call(n);
          } catch (e) {
            i = new et(e);
          }
        return (
          vt.inBatch--,
          (vt.trackingDerivation = o),
          (function (e) {
            for (
              var t = e.observing_,
                n = (e.observing_ = e.newObserving_),
                r = Ye.UP_TO_DATE_,
                i = 0,
                o = e.unboundDepsCount_,
                a = 0;
              a < o;
              a++
            ) {
              var s = n[a];
              (0 === s.diffValue_ &&
                ((s.diffValue_ = 1), i !== a && (n[i] = s), i++),
                s.dependenciesState_ > r && (r = s.dependenciesState_));
            }
            ((n.length = i), (e.newObserving_ = null), (o = t.length));
            for (; o--; ) {
              var u = t[o];
              (0 === u.diffValue_ && bt(u, e), (u.diffValue_ = 0));
            }
            for (; i--; ) {
              var c = n[i];
              1 === c.diffValue_ && ((c.diffValue_ = 0), pt(c, e));
            }
            r !== Ye.UP_TO_DATE_ &&
              ((e.dependenciesState_ = r), e.onBecomeStale_());
          })(e),
          lt(r),
          i
        );
      }
      function ot(e) {
        var t = e.observing_;
        e.observing_ = [];
        for (var n = t.length; n--; ) bt(t[n], e);
        e.dependenciesState_ = Ye.NOT_TRACKING_;
      }
      function at(e) {
        var t = st();
        try {
          return e();
        } finally {
          ut(t);
        }
      }
      function st() {
        var e = vt.trackingDerivation;
        return ((vt.trackingDerivation = null), e);
      }
      function ut(e) {
        vt.trackingDerivation = e;
      }
      function ct(e) {
        var t = vt.allowStateReads;
        return ((vt.allowStateReads = e), t);
      }
      function lt(e) {
        vt.allowStateReads = e;
      }
      function ht(e) {
        if (e.dependenciesState_ !== Ye.UP_TO_DATE_) {
          e.dependenciesState_ = Ye.UP_TO_DATE_;
          for (var t = e.observing_, n = t.length; n--; )
            t[n].lowestObserverState_ = Ye.UP_TO_DATE_;
        }
      }
      var ft = function () {
          ((this.version = 6),
            (this.UNCHANGED = {}),
            (this.trackingDerivation = null),
            (this.trackingContext = null),
            (this.runId = 0),
            (this.mobxGuid = 0),
            (this.inBatch = 0),
            (this.pendingUnobservations = []),
            (this.pendingReactions = []),
            (this.isRunningReactions = !1),
            (this.allowStateChanges = !1),
            (this.allowStateReads = !0),
            (this.enforceActions = !0),
            (this.spyListeners = []),
            (this.globalReactionErrorHandlers = []),
            (this.computedRequiresReaction = !1),
            (this.reactionRequiresObservable = !1),
            (this.observableRequiresReaction = !1),
            (this.disableErrorBoundaries = !1),
            (this.suppressReactionErrors = !1),
            (this.useProxies = !0),
            (this.verifyProxies = !1),
            (this.safeDescriptors = !0));
        },
        _t = !0,
        dt = !1,
        vt = (function () {
          var e = o();
          return (
            e.__mobxInstanceCount > 0 && !e.__mobxGlobals && (_t = !1),
            e.__mobxGlobals &&
              e.__mobxGlobals.version !== new ft().version &&
              (_t = !1),
            _t
              ? e.__mobxGlobals
                ? ((e.__mobxInstanceCount += 1),
                  e.__mobxGlobals.UNCHANGED || (e.__mobxGlobals.UNCHANGED = {}),
                  e.__mobxGlobals)
                : ((e.__mobxInstanceCount = 1), (e.__mobxGlobals = new ft()))
              : (setTimeout(function () {
                  dt || r(35);
                }, 1),
                new ft())
          );
        })();
      function pt(e, t) {
        (e.observers_.add(t),
          e.lowestObserverState_ > t.dependenciesState_ &&
            (e.lowestObserverState_ = t.dependenciesState_));
      }
      function bt(e, t) {
        (e.observers_.delete(t), 0 === e.observers_.size && yt(e));
      }
      function yt(e) {
        !1 === e.isPendingUnobservation_ &&
          ((e.isPendingUnobservation_ = !0), vt.pendingUnobservations.push(e));
      }
      function gt() {
        vt.inBatch++;
      }
      function mt() {
        if (0 == --vt.inBatch) {
          jt();
          for (var e = vt.pendingUnobservations, t = 0; t < e.length; t++) {
            var n = e[t];
            ((n.isPendingUnobservation_ = !1),
              0 === n.observers_.size &&
                (n.isBeingObserved_ && ((n.isBeingObserved_ = !1), n.onBUO()),
                n instanceof Ze && n.suspend_()));
          }
          vt.pendingUnobservations = [];
        }
      }
      function Ot(e) {
        var t = vt.trackingDerivation;
        return null !== t
          ? (t.runId_ !== e.lastAccessedBy_ &&
              ((e.lastAccessedBy_ = t.runId_),
              (t.newObserving_[t.unboundDepsCount_++] = e),
              !e.isBeingObserved_ &&
                vt.trackingContext &&
                ((e.isBeingObserved_ = !0), e.onBO())),
            e.isBeingObserved_)
          : (0 === e.observers_.size && vt.inBatch > 0 && yt(e), !1);
      }
      function At(e) {
        e.lowestObserverState_ !== Ye.STALE_ &&
          ((e.lowestObserverState_ = Ye.STALE_),
          e.observers_.forEach(function (e) {
            (e.dependenciesState_ === Ye.UP_TO_DATE_ && e.onBecomeStale_(),
              (e.dependenciesState_ = Ye.STALE_));
          }));
      }
      var wt = (function () {
        function e(e, t, n, r) {
          (void 0 === e && (e = "Reaction"),
            (this.name_ = void 0),
            (this.onInvalidate_ = void 0),
            (this.errorHandler_ = void 0),
            (this.requiresObservable_ = void 0),
            (this.observing_ = []),
            (this.newObserving_ = []),
            (this.dependenciesState_ = Ye.NOT_TRACKING_),
            (this.diffValue_ = 0),
            (this.runId_ = 0),
            (this.unboundDepsCount_ = 0),
            (this.isDisposed_ = !1),
            (this.isScheduled_ = !1),
            (this.isTrackPending_ = !1),
            (this.isRunning_ = !1),
            (this.isTracing_ = Je.NONE),
            (this.name_ = e),
            (this.onInvalidate_ = t),
            (this.errorHandler_ = n),
            (this.requiresObservable_ = r));
        }
        var t = e.prototype;
        return (
          (t.onBecomeStale_ = function () {
            this.schedule_();
          }),
          (t.schedule_ = function () {
            this.isScheduled_ ||
              ((this.isScheduled_ = !0), vt.pendingReactions.push(this), jt());
          }),
          (t.isScheduled = function () {
            return this.isScheduled_;
          }),
          (t.runReaction_ = function () {
            if (!this.isDisposed_) {
              (gt(), (this.isScheduled_ = !1));
              var e = vt.trackingContext;
              if (((vt.trackingContext = this), nt(this))) {
                this.isTrackPending_ = !0;
                try {
                  this.onInvalidate_();
                } catch (e) {
                  this.reportExceptionInDerivation_(e);
                }
              }
              ((vt.trackingContext = e), mt());
            }
          }),
          (t.track = function (e) {
            if (!this.isDisposed_) {
              gt();
              (0, (this.isRunning_ = !0));
              var t = vt.trackingContext;
              vt.trackingContext = this;
              var n = it(this, e, void 0);
              ((vt.trackingContext = t),
                (this.isRunning_ = !1),
                (this.isTrackPending_ = !1),
                this.isDisposed_ && ot(this),
                tt(n) && this.reportExceptionInDerivation_(n.cause),
                mt());
            }
          }),
          (t.reportExceptionInDerivation_ = function (e) {
            var t = this;
            if (this.errorHandler_) this.errorHandler_(e, this);
            else {
              if (vt.disableErrorBoundaries) throw e;
              (vt.suppressReactionErrors,
                vt.globalReactionErrorHandlers.forEach(function (n) {
                  return n(e, t);
                }));
            }
          }),
          (t.dispose = function () {
            this.isDisposed_ ||
              ((this.isDisposed_ = !0),
              this.isRunning_ || (gt(), ot(this), mt()));
          }),
          (t.getDisposer_ = function (e) {
            var t = this,
              n = function n() {
                (t.dispose(),
                  null == e ||
                    null == e.removeEventListener ||
                    e.removeEventListener("abort", n));
              };
            return (
              null == e ||
                null == e.addEventListener ||
                e.addEventListener("abort", n),
              (n[q] = this),
              n
            );
          }),
          (t.toString = function () {
            return "Reaction[" + this.name_ + "]";
          }),
          (t.trace = function (e) {
            void 0 === e && (e = !1);
          }),
          e
        );
      })();
      var St = 100,
        kt = function (e) {
          return e();
        };
      function jt() {
        vt.inBatch > 0 || vt.isRunningReactions || kt(xt);
      }
      function xt() {
        vt.isRunningReactions = !0;
        for (var e = vt.pendingReactions, t = 0; e.length > 0; ) {
          ++t === St && e.splice(0);
          for (var n = e.splice(0), r = 0, i = n.length; r < i; r++)
            n[r].runReaction_();
        }
        vt.isRunningReactions = !1;
      }
      var Et = S("Reaction", wt);
      var Pt = "action",
        Vt = "autoAction",
        Tt = "<unnamed action>",
        Ct = Z(Pt),
        Lt = Z("action.bound", { bound: !0 }),
        Nt = Z(Vt, { autoAction: !0 }),
        Mt = Z("autoAction.bound", { autoAction: !0, bound: !0 });
      function Dt(e) {
        return function (t, n) {
          return b(t)
            ? ze(t.name || Tt, t, e)
            : b(n)
              ? ze(t, n, e)
              : z(n)
                ? (e ? Nt : Ct).decorate_20223_(t, n)
                : y(n)
                  ? G(t, n, e ? Nt : Ct)
                  : y(t)
                    ? K(Z(e ? Vt : Pt, { name: t, autoAction: e }))
                    : void 0;
        };
      }
      var Rt = Dt(!1);
      Object.assign(Rt, Ct);
      var Bt = Dt(!0);
      function It(e) {
        return b(e) && !0 === e.isMobxAction;
      }
      function Ut(e, t) {
        var n, r, i, o, a;
        void 0 === t && (t = h);
        var s,
          u = null != (n = null == (r = t) ? void 0 : r.name) ? n : "Autorun";
        if (!t.scheduler && !t.delay)
          s = new wt(
            u,
            function () {
              this.track(f);
            },
            t.onError,
            t.requiresObservable,
          );
        else {
          var c = Gt(t),
            l = !1;
          s = new wt(
            u,
            function () {
              l ||
                ((l = !0),
                c(function () {
                  ((l = !1), s.isDisposed_ || s.track(f));
                }));
            },
            t.onError,
            t.requiresObservable,
          );
        }
        function f() {
          e(s);
        }
        return (
          (null != (i = t) && null != (o = i.signal) && o.aborted) ||
            s.schedule_(),
          s.getDisposer_(null == (a = t) ? void 0 : a.signal)
        );
      }
      (Object.assign(Bt, Nt), (Rt.bound = K(Lt)), (Bt.bound = K(Mt)));
      var Kt = function (e) {
        return e();
      };
      function Gt(e) {
        return e.scheduler
          ? e.scheduler
          : e.delay
            ? function (t) {
                return setTimeout(t, e.delay);
              }
            : Kt;
      }
      var zt = "onBO",
        qt = "onBUO";
      function Ht(e, t, n) {
        return Wt(qt, e, t, n);
      }
      function Wt(e, t, n, r) {
        var i = "function" == typeof r ? ur(t, n) : ur(t),
          o = b(r) ? r : n,
          a = e + "L";
        return (
          i[a] ? i[a].add(o) : (i[a] = new Set([o])),
          function () {
            var e = i[a];
            e && (e.delete(o), 0 === e.size && delete i[a]);
          }
        );
      }
      function Xt(e, t, n, r) {
        var i = T(t);
        return (
          hr(function () {
            var t = Hn(e, r)[q];
            E(i).forEach(function (e) {
              t.extend_(e, i[e], !n || !(e in n) || n[e]);
            });
          }),
          e
        );
      }
      var Ft = 0;
      function $t() {
        this.message = "FLOW_CANCELLED";
      }
      $t.prototype = Object.create(Error.prototype);
      var Yt = re("flow"),
        Jt = re("flow.bound", { bound: !0 }),
        Zt = Object.assign(function (e, t) {
          if (z(t)) return Yt.decorate_20223_(e, t);
          if (y(t)) return G(e, t, Yt);
          var n = e,
            r = n.name || "<unnamed flow>",
            i = function () {
              var e,
                t = arguments,
                i = ++Ft,
                o = Rt(r + " - runid: " + i + " - init", n).apply(this, t),
                a = void 0,
                s = new Promise(function (t, n) {
                  var s = 0;
                  function u(e) {
                    var t;
                    a = void 0;
                    try {
                      t = Rt(
                        r + " - runid: " + i + " - yield " + s++,
                        o.next,
                      ).call(o, e);
                    } catch (e) {
                      return n(e);
                    }
                    l(t);
                  }
                  function c(e) {
                    var t;
                    a = void 0;
                    try {
                      t = Rt(
                        r + " - runid: " + i + " - yield " + s++,
                        o.throw,
                      ).call(o, e);
                    } catch (e) {
                      return n(e);
                    }
                    l(t);
                  }
                  function l(e) {
                    if (!b(null == e ? void 0 : e.then))
                      return e.done
                        ? t(e.value)
                        : (a = Promise.resolve(e.value)).then(u, c);
                    e.then(l, n);
                  }
                  ((e = n), u(void 0));
                });
              return (
                (s.cancel = Rt(r + " - runid: " + i + " - cancel", function () {
                  try {
                    a && Qt(a);
                    var t = o.return(void 0),
                      n = Promise.resolve(t.value);
                    (n.then(p, p), Qt(n), e(new $t()));
                  } catch (t) {
                    e(t);
                  }
                })),
                s
              );
            };
          return ((i.isMobXFlow = !0), i);
        }, Yt);
      function Qt(e) {
        b(e.cancel) && e.cancel();
      }
      function en(e) {
        return !0 === (null == e ? void 0 : e.isMobXFlow);
      }
      function tn(e, t) {
        return (
          !!e &&
          (void 0 !== t
            ? !!Fn(e) && e[q].values_.has(t)
            : Fn(e) || !!e[q] || W(e) || Et(e) || Qe(e))
        );
      }
      function nn(e) {
        return tn(e);
      }
      function rn(e, t, n) {
        return (e.set(t, n), n);
      }
      function on(e, t) {
        if (null == e || "object" != typeof e || e instanceof Date || !nn(e))
          return e;
        if ($e(e) || Qe(e)) return on(e.get(), t);
        if (t.has(e)) return t.get(e);
        if (Tn(e)) {
          var n = rn(t, e, new Array(e.length));
          return (
            e.forEach(function (e, r) {
              n[r] = on(e, t);
            }),
            n
          );
        }
        if (Kn(e)) {
          var i = rn(t, e, new Set());
          return (
            e.forEach(function (e) {
              i.add(on(e, t));
            }),
            i
          );
        }
        if (Bn(e)) {
          var o = rn(t, e, new Map());
          return (
            e.forEach(function (e, n) {
              o.set(n, on(e, t));
            }),
            o
          );
        }
        var a = rn(t, e, {});
        return (
          (function (e) {
            if (Fn(e)) return e[q].ownKeys_();
            r(38);
          })(e).forEach(function (n) {
            c.propertyIsEnumerable.call(e, n) && (a[n] = on(e[n], t));
          }),
          a
        );
      }
      function an(e, t) {
        return on(e, new Map());
      }
      function sn(e, t) {
        (void 0 === t && (t = void 0), gt());
        try {
          return e.apply(t);
        } finally {
          mt();
        }
      }
      function un(e) {
        return e[q];
      }
      Zt.bound = K(Jt);
      var cn = {
        has: function (e, t) {
          return un(e).has_(t);
        },
        get: function (e, t) {
          return un(e).get_(t);
        },
        set: function (e, t, n) {
          var r;
          return !!y(t) && (null == (r = un(e).set_(t, n, !0)) || r);
        },
        deleteProperty: function (e, t) {
          var n;
          return !!y(t) && (null == (n = un(e).delete_(t, !0)) || n);
        },
        defineProperty: function (e, t, n) {
          var r;
          return null == (r = un(e).defineProperty_(t, n)) || r;
        },
        ownKeys: function (e) {
          return un(e).ownKeys_();
        },
        preventExtensions: function (e) {
          r(13);
        },
      };
      function ln(e) {
        return void 0 !== e.interceptors_ && e.interceptors_.length > 0;
      }
      function hn(e, t) {
        var n = e.interceptors_ || (e.interceptors_ = []);
        return (
          n.push(t),
          v(function () {
            var e = n.indexOf(t);
            -1 !== e && n.splice(e, 1);
          })
        );
      }
      function fn(e, t) {
        var n = st();
        try {
          for (
            var i = [].concat(e.interceptors_ || []), o = 0, a = i.length;
            o < a && ((t = i[o](t)) && !t.type && r(14), t);
            o++
          );
          return t;
        } finally {
          ut(n);
        }
      }
      function _n(e) {
        return void 0 !== e.changeListeners_ && e.changeListeners_.length > 0;
      }
      function dn(e, t) {
        var n = e.changeListeners_ || (e.changeListeners_ = []);
        return (
          n.push(t),
          v(function () {
            var e = n.indexOf(t);
            -1 !== e && n.splice(e, 1);
          })
        );
      }
      function vn(e, t) {
        var n = st(),
          r = e.changeListeners_;
        if (r) {
          for (var i = 0, o = (r = r.slice()).length; i < o; i++) r[i](t);
          ut(n);
        }
      }
      var pn = Symbol("mobx-keys");
      function bn(e, t, n) {
        return m(e)
          ? Xt(e, e, t, n)
          : (hr(function () {
              var r = Hn(e, n)[q];
              if (!e[pn]) {
                var i = Object.getPrototypeOf(e),
                  o = new Set([].concat(E(e), E(i)));
                (o.delete("constructor"), o.delete(q), A(i, pn, o));
              }
              e[pn].forEach(function (e) {
                return r.make_(e, !t || !(e in t) || t[e]);
              });
            }),
            e);
      }
      var yn = "splice",
        gn = "update",
        mn = {
          get: function (e, t) {
            var n = e[q];
            return t === q
              ? n
              : "length" === t
                ? n.getArrayLength_()
                : "string" != typeof t || isNaN(t)
                  ? V(wn, t)
                    ? wn[t]
                    : e[t]
                  : n.get_(parseInt(t));
          },
          set: function (e, t, n) {
            var r = e[q];
            return (
              "length" === t && r.setArrayLength_(n),
              "symbol" == typeof t || isNaN(t)
                ? (e[t] = n)
                : r.set_(parseInt(t), n),
              !0
            );
          },
          preventExtensions: function () {
            r(15);
          },
        },
        On = (function () {
          function e(e, t, n, r) {
            (void 0 === e && (e = "ObservableArray"),
              (this.owned_ = void 0),
              (this.legacyMode_ = void 0),
              (this.atom_ = void 0),
              (this.values_ = []),
              (this.interceptors_ = void 0),
              (this.changeListeners_ = void 0),
              (this.enhancer_ = void 0),
              (this.dehancer = void 0),
              (this.proxy_ = void 0),
              (this.lastKnownLength_ = 0),
              (this.owned_ = n),
              (this.legacyMode_ = r),
              (this.atom_ = new H(e)),
              (this.enhancer_ = function (e, n) {
                return t(e, n, "ObservableArray[..]");
              }));
          }
          var t = e.prototype;
          return (
            (t.dehanceValue_ = function (e) {
              return void 0 !== this.dehancer ? this.dehancer(e) : e;
            }),
            (t.dehanceValues_ = function (e) {
              return void 0 !== this.dehancer && e.length > 0
                ? e.map(this.dehancer)
                : e;
            }),
            (t.intercept_ = function (e) {
              return hn(this, e);
            }),
            (t.observe_ = function (e, t) {
              return (
                void 0 === t && (t = !1),
                t &&
                  e({
                    observableKind: "array",
                    object: this.proxy_,
                    debugObjectName: this.atom_.name_,
                    type: "splice",
                    index: 0,
                    added: this.values_.slice(),
                    addedCount: this.values_.length,
                    removed: [],
                    removedCount: 0,
                  }),
                dn(this, e)
              );
            }),
            (t.getArrayLength_ = function () {
              return (this.atom_.reportObserved(), this.values_.length);
            }),
            (t.setArrayLength_ = function (e) {
              ("number" != typeof e || isNaN(e) || e < 0) &&
                r("Out of range: " + e);
              var t = this.values_.length;
              if (e !== t)
                if (e > t) {
                  for (var n = new Array(e - t), i = 0; i < e - t; i++)
                    n[i] = void 0;
                  this.spliceWithArray_(t, 0, n);
                } else this.spliceWithArray_(e, t - e);
            }),
            (t.updateArrayLength_ = function (e, t) {
              (e !== this.lastKnownLength_ && r(16),
                (this.lastKnownLength_ += t),
                this.legacyMode_ && t > 0 && ar(e + t + 1));
            }),
            (t.spliceWithArray_ = function (e, t, n) {
              var r = this;
              this.atom_;
              var i = this.values_.length;
              if (
                (void 0 === e
                  ? (e = 0)
                  : e > i
                    ? (e = i)
                    : e < 0 && (e = Math.max(0, i + e)),
                (t =
                  1 === arguments.length
                    ? i - e
                    : null == t
                      ? 0
                      : Math.max(0, Math.min(t, i - e))),
                void 0 === n && (n = l),
                ln(this))
              ) {
                var o = fn(this, {
                  object: this.proxy_,
                  type: yn,
                  index: e,
                  removedCount: t,
                  added: n,
                });
                if (!o) return l;
                ((t = o.removedCount), (n = o.added));
              }
              if (
                ((n =
                  0 === n.length
                    ? n
                    : n.map(function (e) {
                        return r.enhancer_(e, void 0);
                      })),
                this.legacyMode_)
              ) {
                var a = n.length - t;
                this.updateArrayLength_(i, a);
              }
              var s = this.spliceItemsIntoValues_(e, t, n);
              return (
                (0 === t && 0 === n.length) || this.notifyArraySplice_(e, n, s),
                this.dehanceValues_(s)
              );
            }),
            (t.spliceItemsIntoValues_ = function (e, t, n) {
              var r;
              if (n.length < 1e4)
                return (r = this.values_).splice.apply(r, [e, t].concat(n));
              var i = this.values_.slice(e, e + t),
                o = this.values_.slice(e + t);
              this.values_.length += n.length - t;
              for (var a = 0; a < n.length; a++) this.values_[e + a] = n[a];
              for (var s = 0; s < o.length; s++)
                this.values_[e + n.length + s] = o[s];
              return i;
            }),
            (t.notifyArrayChildUpdate_ = function (e, t, n) {
              var r = !this.owned_ && !1,
                i = _n(this),
                o =
                  i || r
                    ? {
                        observableKind: "array",
                        object: this.proxy_,
                        type: gn,
                        debugObjectName: this.atom_.name_,
                        index: e,
                        newValue: t,
                        oldValue: n,
                      }
                    : null;
              (this.atom_.reportChanged(), i && vn(this, o));
            }),
            (t.notifyArraySplice_ = function (e, t, n) {
              var r = !this.owned_ && !1,
                i = _n(this),
                o =
                  i || r
                    ? {
                        observableKind: "array",
                        object: this.proxy_,
                        debugObjectName: this.atom_.name_,
                        type: yn,
                        index: e,
                        removed: n,
                        added: t,
                        removedCount: n.length,
                        addedCount: t.length,
                      }
                    : null;
              (this.atom_.reportChanged(), i && vn(this, o));
            }),
            (t.get_ = function (e) {
              if (!(this.legacyMode_ && e >= this.values_.length))
                return (
                  this.atom_.reportObserved(),
                  this.dehanceValue_(this.values_[e])
                );
            }),
            (t.set_ = function (e, t) {
              var n = this.values_;
              if (
                (this.legacyMode_ && e > n.length && r(17, e, n.length),
                e < n.length)
              ) {
                this.atom_;
                var i = n[e];
                if (ln(this)) {
                  var o = fn(this, {
                    type: gn,
                    object: this.proxy_,
                    index: e,
                    newValue: t,
                  });
                  if (!o) return;
                  t = o.newValue;
                }
                (t = this.enhancer_(t, i)) !== i &&
                  ((n[e] = t), this.notifyArrayChildUpdate_(e, t, i));
              } else {
                for (
                  var a = new Array(e + 1 - n.length), s = 0;
                  s < a.length - 1;
                  s++
                )
                  a[s] = void 0;
                ((a[a.length - 1] = t), this.spliceWithArray_(n.length, 0, a));
              }
            }),
            e
          );
        })();
      function An(e, t, n, r) {
        return (
          void 0 === n && (n = "ObservableArray"),
          void 0 === r && (r = !1),
          d(),
          hr(function () {
            var i = new On(n, t, r, !1);
            w(i.values_, q, i);
            var o = new Proxy(i.values_, mn);
            return (
              (i.proxy_ = o),
              e && e.length && i.spliceWithArray_(0, 0, e),
              o
            );
          })
        );
      }
      var wn = {
        clear: function () {
          return this.splice(0);
        },
        replace: function (e) {
          var t = this[q];
          return t.spliceWithArray_(0, t.values_.length, e);
        },
        toJSON: function () {
          return this.slice();
        },
        splice: function (e, t) {
          for (
            var n = arguments.length, r = new Array(n > 2 ? n - 2 : 0), i = 2;
            i < n;
            i++
          )
            r[i - 2] = arguments[i];
          var o = this[q];
          switch (arguments.length) {
            case 0:
              return [];
            case 1:
              return o.spliceWithArray_(e);
            case 2:
              return o.spliceWithArray_(e, t);
          }
          return o.spliceWithArray_(e, t, r);
        },
        spliceWithArray: function (e, t, n) {
          return this[q].spliceWithArray_(e, t, n);
        },
        push: function () {
          for (
            var e = this[q], t = arguments.length, n = new Array(t), r = 0;
            r < t;
            r++
          )
            n[r] = arguments[r];
          return (e.spliceWithArray_(e.values_.length, 0, n), e.values_.length);
        },
        pop: function () {
          return this.splice(Math.max(this[q].values_.length - 1, 0), 1)[0];
        },
        shift: function () {
          return this.splice(0, 1)[0];
        },
        unshift: function () {
          for (
            var e = this[q], t = arguments.length, n = new Array(t), r = 0;
            r < t;
            r++
          )
            n[r] = arguments[r];
          return (e.spliceWithArray_(0, 0, n), e.values_.length);
        },
        reverse: function () {
          return (
            vt.trackingDerivation && r(37, "reverse"),
            this.replace(this.slice().reverse()),
            this
          );
        },
        sort: function () {
          vt.trackingDerivation && r(37, "sort");
          var e = this.slice();
          return (e.sort.apply(e, arguments), this.replace(e), this);
        },
        remove: function (e) {
          var t = this[q],
            n = t.dehanceValues_(t.values_).indexOf(e);
          return n > -1 && (this.splice(n, 1), !0);
        },
      };
      function Sn(e, t) {
        "function" == typeof Array.prototype[e] && (wn[e] = t(e));
      }
      function kn(e) {
        return function () {
          var t = this[q];
          t.atom_.reportObserved();
          var n = t.dehanceValues_(t.values_);
          return n[e].apply(n, arguments);
        };
      }
      function jn(e) {
        return function (t, n) {
          var r = this,
            i = this[q];
          return (
            i.atom_.reportObserved(),
            i.dehanceValues_(i.values_)[e](function (e, i) {
              return t.call(n, e, i, r);
            })
          );
        };
      }
      function xn(e) {
        return function () {
          var t = this,
            n = this[q];
          n.atom_.reportObserved();
          var r = n.dehanceValues_(n.values_),
            i = arguments[0];
          return (
            (arguments[0] = function (e, n, r) {
              return i(e, n, r, t);
            }),
            r[e].apply(r, arguments)
          );
        };
      }
      (Sn("at", kn),
        Sn("concat", kn),
        Sn("flat", kn),
        Sn("includes", kn),
        Sn("indexOf", kn),
        Sn("join", kn),
        Sn("lastIndexOf", kn),
        Sn("slice", kn),
        Sn("toString", kn),
        Sn("toLocaleString", kn),
        Sn("toSorted", kn),
        Sn("toSpliced", kn),
        Sn("with", kn),
        Sn("every", jn),
        Sn("filter", jn),
        Sn("find", jn),
        Sn("findIndex", jn),
        Sn("findLast", jn),
        Sn("findLastIndex", jn),
        Sn("flatMap", jn),
        Sn("forEach", jn),
        Sn("map", jn),
        Sn("some", jn),
        Sn("toReversed", jn),
        Sn("reduce", xn),
        Sn("reduceRight", xn));
      var En,
        Pn,
        Vn = S("ObservableArrayAdministration", On);
      function Tn(e) {
        return g(e) && Vn(e[q]);
      }
      var Cn = {},
        Ln = "add",
        Nn = "delete";
      ((En = Symbol.iterator), (Pn = Symbol.toStringTag));
      var Mn,
        Dn,
        Rn = (function () {
          function e(e, t, n) {
            var i = this;
            (void 0 === t && (t = $),
              void 0 === n && (n = "ObservableMap"),
              (this.enhancer_ = void 0),
              (this.name_ = void 0),
              (this[q] = Cn),
              (this.data_ = void 0),
              (this.hasMap_ = void 0),
              (this.keysAtom_ = void 0),
              (this.interceptors_ = void 0),
              (this.changeListeners_ = void 0),
              (this.dehancer = void 0),
              (this.enhancer_ = t),
              (this.name_ = n),
              b(Map) || r(18),
              hr(function () {
                ((i.keysAtom_ = X("ObservableMap.keys()")),
                  (i.data_ = new Map()),
                  (i.hasMap_ = new Map()),
                  e && i.merge(e));
              }));
          }
          var t = e.prototype;
          return (
            (t.has_ = function (e) {
              return this.data_.has(e);
            }),
            (t.has = function (e) {
              var t = this;
              if (!vt.trackingDerivation) return this.has_(e);
              var n = this.hasMap_.get(e);
              if (!n) {
                var r = (n = new Fe(this.has_(e), Y, "ObservableMap.key?", !1));
                (this.hasMap_.set(e, r),
                  Ht(r, function () {
                    return t.hasMap_.delete(e);
                  }));
              }
              return n.get();
            }),
            (t.set = function (e, t) {
              var n = this.has_(e);
              if (ln(this)) {
                var r = fn(this, {
                  type: n ? gn : Ln,
                  object: this,
                  newValue: t,
                  name: e,
                });
                if (!r) return this;
                t = r.newValue;
              }
              return (n ? this.updateValue_(e, t) : this.addValue_(e, t), this);
            }),
            (t.delete = function (e) {
              var t = this;
              if (
                (this.keysAtom_, ln(this)) &&
                !fn(this, { type: Nn, object: this, name: e })
              )
                return !1;
              if (this.has_(e)) {
                var n = _n(this),
                  r = n
                    ? {
                        observableKind: "map",
                        debugObjectName: this.name_,
                        type: Nn,
                        object: this,
                        oldValue: this.data_.get(e).value_,
                        name: e,
                      }
                    : null;
                return (
                  sn(function () {
                    var n;
                    (t.keysAtom_.reportChanged(),
                      null == (n = t.hasMap_.get(e)) || n.setNewValue_(!1),
                      t.data_.get(e).setNewValue_(void 0),
                      t.data_.delete(e));
                  }),
                  n && vn(this, r),
                  !0
                );
              }
              return !1;
            }),
            (t.updateValue_ = function (e, t) {
              var n = this.data_.get(e);
              if ((t = n.prepareNewValue_(t)) !== vt.UNCHANGED) {
                var r = _n(this),
                  i = r
                    ? {
                        observableKind: "map",
                        debugObjectName: this.name_,
                        type: gn,
                        object: this,
                        oldValue: n.value_,
                        name: e,
                        newValue: t,
                      }
                    : null;
                (0, n.setNewValue_(t), r && vn(this, i));
              }
            }),
            (t.addValue_ = function (e, t) {
              var n = this;
              (this.keysAtom_,
                sn(function () {
                  var r,
                    i = new Fe(t, n.enhancer_, "ObservableMap.key", !1);
                  (n.data_.set(e, i),
                    (t = i.value_),
                    null == (r = n.hasMap_.get(e)) || r.setNewValue_(!0),
                    n.keysAtom_.reportChanged());
                }));
              var r = _n(this),
                i = r
                  ? {
                      observableKind: "map",
                      debugObjectName: this.name_,
                      type: Ln,
                      object: this,
                      name: e,
                      newValue: t,
                    }
                  : null;
              r && vn(this, i);
            }),
            (t.get = function (e) {
              return this.has(e)
                ? this.dehanceValue_(this.data_.get(e).get())
                : this.dehanceValue_(void 0);
            }),
            (t.dehanceValue_ = function (e) {
              return void 0 !== this.dehancer ? this.dehancer(e) : e;
            }),
            (t.keys = function () {
              return (this.keysAtom_.reportObserved(), this.data_.keys());
            }),
            (t.values = function () {
              var e = this,
                t = this.keys();
              return pr({
                next: function () {
                  var n = t.next(),
                    r = n.done,
                    i = n.value;
                  return { done: r, value: r ? void 0 : e.get(i) };
                },
              });
            }),
            (t.entries = function () {
              var e = this,
                t = this.keys();
              return pr({
                next: function () {
                  var n = t.next(),
                    r = n.done,
                    i = n.value;
                  return { done: r, value: r ? void 0 : [i, e.get(i)] };
                },
              });
            }),
            (t[En] = function () {
              return this.entries();
            }),
            (t.forEach = function (e, t) {
              for (var n, r = I(this); !(n = r()).done; ) {
                var i = n.value,
                  o = i[0],
                  a = i[1];
                e.call(t, a, o, this);
              }
            }),
            (t.merge = function (e) {
              var t = this;
              return (
                Bn(e) && (e = new Map(e)),
                sn(function () {
                  m(e)
                    ? (function (e) {
                        var t = Object.keys(e);
                        if (!x) return t;
                        var n = Object.getOwnPropertySymbols(e);
                        return n.length
                          ? [].concat(
                              t,
                              n.filter(function (t) {
                                return c.propertyIsEnumerable.call(e, t);
                              }),
                            )
                          : t;
                      })(e).forEach(function (n) {
                        return t.set(n, e[n]);
                      })
                    : Array.isArray(e)
                      ? e.forEach(function (e) {
                          var n = e[0],
                            r = e[1];
                          return t.set(n, r);
                        })
                      : k(e)
                        ? (e.constructor !== Map && r(19, e),
                          e.forEach(function (e, n) {
                            return t.set(n, e);
                          }))
                        : null != e && r(20, e);
                }),
                this
              );
            }),
            (t.clear = function () {
              var e = this;
              sn(function () {
                at(function () {
                  for (var t, n = I(e.keys()); !(t = n()).done; ) {
                    var r = t.value;
                    e.delete(r);
                  }
                });
              });
            }),
            (t.replace = function (e) {
              var t = this;
              return (
                sn(function () {
                  for (
                    var n,
                      i = (function (e) {
                        if (k(e) || Bn(e)) return e;
                        if (Array.isArray(e)) return new Map(e);
                        if (m(e)) {
                          var t = new Map();
                          for (var n in e) t.set(n, e[n]);
                          return t;
                        }
                        return r(21, e);
                      })(e),
                      o = new Map(),
                      a = !1,
                      s = I(t.data_.keys());
                    !(n = s()).done;
                  ) {
                    var u = n.value;
                    if (!i.has(u))
                      if (t.delete(u)) a = !0;
                      else {
                        var c = t.data_.get(u);
                        o.set(u, c);
                      }
                  }
                  for (var l, h = I(i.entries()); !(l = h()).done; ) {
                    var f = l.value,
                      _ = f[0],
                      d = f[1],
                      v = t.data_.has(_);
                    if ((t.set(_, d), t.data_.has(_))) {
                      var p = t.data_.get(_);
                      (o.set(_, p), v || (a = !0));
                    }
                  }
                  if (!a)
                    if (t.data_.size !== o.size) t.keysAtom_.reportChanged();
                    else
                      for (
                        var b = t.data_.keys(),
                          y = o.keys(),
                          g = b.next(),
                          O = y.next();
                        !g.done;
                      ) {
                        if (g.value !== O.value) {
                          t.keysAtom_.reportChanged();
                          break;
                        }
                        ((g = b.next()), (O = y.next()));
                      }
                  t.data_ = o;
                }),
                this
              );
            }),
            (t.toString = function () {
              return "[object ObservableMap]";
            }),
            (t.toJSON = function () {
              return Array.from(this);
            }),
            (t.observe_ = function (e, t) {
              return dn(this, e);
            }),
            (t.intercept_ = function (e) {
              return hn(this, e);
            }),
            L(e, [
              {
                key: "size",
                get: function () {
                  return (this.keysAtom_.reportObserved(), this.data_.size);
                },
              },
              {
                key: Pn,
                get: function () {
                  return "Map";
                },
              },
            ]),
            e
          );
        })(),
        Bn = S("ObservableMap", Rn);
      var In = {};
      ((Mn = Symbol.iterator), (Dn = Symbol.toStringTag));
      var Un = (function () {
          function e(e, t, n) {
            var i = this;
            (void 0 === t && (t = $),
              void 0 === n && (n = "ObservableSet"),
              (this.name_ = void 0),
              (this[q] = In),
              (this.data_ = new Set()),
              (this.atom_ = void 0),
              (this.changeListeners_ = void 0),
              (this.interceptors_ = void 0),
              (this.dehancer = void 0),
              (this.enhancer_ = void 0),
              (this.name_ = n),
              b(Set) || r(22),
              (this.enhancer_ = function (e, r) {
                return t(e, r, n);
              }),
              hr(function () {
                ((i.atom_ = X(i.name_)), e && i.replace(e));
              }));
          }
          var t = e.prototype;
          return (
            (t.dehanceValue_ = function (e) {
              return void 0 !== this.dehancer ? this.dehancer(e) : e;
            }),
            (t.clear = function () {
              var e = this;
              sn(function () {
                at(function () {
                  for (var t, n = I(e.data_.values()); !(t = n()).done; ) {
                    var r = t.value;
                    e.delete(r);
                  }
                });
              });
            }),
            (t.forEach = function (e, t) {
              for (var n, r = I(this); !(n = r()).done; ) {
                var i = n.value;
                e.call(t, i, i, this);
              }
            }),
            (t.add = function (e) {
              var t = this;
              if (
                (this.atom_, ln(this)) &&
                !fn(this, { type: Ln, object: this, newValue: e })
              )
                return this;
              if (!this.has(e)) {
                sn(function () {
                  (t.data_.add(t.enhancer_(e, void 0)),
                    t.atom_.reportChanged());
                });
                var n = !1,
                  r = _n(this),
                  i = r
                    ? {
                        observableKind: "set",
                        debugObjectName: this.name_,
                        type: Ln,
                        object: this,
                        newValue: e,
                      }
                    : null;
                (n, r && vn(this, i));
              }
              return this;
            }),
            (t.delete = function (e) {
              var t = this;
              if (
                ln(this) &&
                !fn(this, { type: Nn, object: this, oldValue: e })
              )
                return !1;
              if (this.has(e)) {
                var n = _n(this),
                  r = n
                    ? {
                        observableKind: "set",
                        debugObjectName: this.name_,
                        type: Nn,
                        object: this,
                        oldValue: e,
                      }
                    : null;
                return (
                  sn(function () {
                    (t.atom_.reportChanged(), t.data_.delete(e));
                  }),
                  n && vn(this, r),
                  !0
                );
              }
              return !1;
            }),
            (t.has = function (e) {
              return (
                this.atom_.reportObserved(),
                this.data_.has(this.dehanceValue_(e))
              );
            }),
            (t.entries = function () {
              var e = 0,
                t = Array.from(this.keys()),
                n = Array.from(this.values());
              return pr({
                next: function () {
                  var r = e;
                  return (
                    (e += 1),
                    r < n.length
                      ? { value: [t[r], n[r]], done: !1 }
                      : { done: !0 }
                  );
                },
              });
            }),
            (t.keys = function () {
              return this.values();
            }),
            (t.values = function () {
              this.atom_.reportObserved();
              var e = this,
                t = 0,
                n = Array.from(this.data_.values());
              return pr({
                next: function () {
                  return t < n.length
                    ? { value: e.dehanceValue_(n[t++]), done: !1 }
                    : { done: !0 };
                },
              });
            }),
            (t.replace = function (e) {
              var t = this;
              return (
                Kn(e) && (e = new Set(e)),
                sn(function () {
                  Array.isArray(e) || j(e)
                    ? (t.clear(),
                      e.forEach(function (e) {
                        return t.add(e);
                      }))
                    : null != e && r("Cannot initialize set from " + e);
                }),
                this
              );
            }),
            (t.observe_ = function (e, t) {
              return dn(this, e);
            }),
            (t.intercept_ = function (e) {
              return hn(this, e);
            }),
            (t.toJSON = function () {
              return Array.from(this);
            }),
            (t.toString = function () {
              return "[object ObservableSet]";
            }),
            (t[Mn] = function () {
              return this.values();
            }),
            L(e, [
              {
                key: "size",
                get: function () {
                  return (this.atom_.reportObserved(), this.data_.size);
                },
              },
              {
                key: Dn,
                get: function () {
                  return "Set";
                },
              },
            ]),
            e
          );
        })(),
        Kn = S("ObservableSet", Un),
        Gn = Object.create(null),
        zn = "remove",
        qn = (function () {
          function e(e, t, n, r) {
            (void 0 === t && (t = new Map()),
              void 0 === r && (r = be),
              (this.target_ = void 0),
              (this.values_ = void 0),
              (this.name_ = void 0),
              (this.defaultAnnotation_ = void 0),
              (this.keysAtom_ = void 0),
              (this.changeListeners_ = void 0),
              (this.interceptors_ = void 0),
              (this.proxy_ = void 0),
              (this.isPlainObject_ = void 0),
              (this.appliedAnnotations_ = void 0),
              (this.pendingKeys_ = void 0),
              (this.target_ = e),
              (this.values_ = t),
              (this.name_ = n),
              (this.defaultAnnotation_ = r),
              (this.keysAtom_ = new H("ObservableObject.keys")),
              (this.isPlainObject_ = m(this.target_)));
          }
          var t = e.prototype;
          return (
            (t.getObservablePropValue_ = function (e) {
              return this.values_.get(e).get();
            }),
            (t.setObservablePropValue_ = function (e, t) {
              var n = this.values_.get(e);
              if (n instanceof Ze) return (n.set(t), !0);
              if (ln(this)) {
                var r = fn(this, {
                  type: gn,
                  object: this.proxy_ || this.target_,
                  name: e,
                  newValue: t,
                });
                if (!r) return null;
                t = r.newValue;
              }
              if ((t = n.prepareNewValue_(t)) !== vt.UNCHANGED) {
                var i = _n(this),
                  o = i
                    ? {
                        type: gn,
                        observableKind: "object",
                        debugObjectName: this.name_,
                        object: this.proxy_ || this.target_,
                        oldValue: n.value_,
                        name: e,
                        newValue: t,
                      }
                    : null;
                (0, n.setNewValue_(t), i && vn(this, o));
              }
              return !0;
            }),
            (t.get_ = function (e) {
              return (
                vt.trackingDerivation && !V(this.target_, e) && this.has_(e),
                this.target_[e]
              );
            }),
            (t.set_ = function (e, t, n) {
              return (
                void 0 === n && (n = !1),
                V(this.target_, e)
                  ? this.values_.has(e)
                    ? this.setObservablePropValue_(e, t)
                    : n
                      ? Reflect.set(this.target_, e, t)
                      : ((this.target_[e] = t), !0)
                  : this.extend_(
                      e,
                      {
                        value: t,
                        enumerable: !0,
                        writable: !0,
                        configurable: !0,
                      },
                      this.defaultAnnotation_,
                      n,
                    )
              );
            }),
            (t.has_ = function (e) {
              if (!vt.trackingDerivation) return e in this.target_;
              this.pendingKeys_ || (this.pendingKeys_ = new Map());
              var t = this.pendingKeys_.get(e);
              return (
                t ||
                  ((t = new Fe(
                    e in this.target_,
                    Y,
                    "ObservableObject.key?",
                    !1,
                  )),
                  this.pendingKeys_.set(e, t)),
                t.get()
              );
            }),
            (t.make_ = function (e, t) {
              if ((!0 === t && (t = this.defaultAnnotation_), !1 !== t)) {
                if ((Yn(this, t, e), !(e in this.target_))) {
                  var n;
                  if (null != (n = this.target_[U]) && n[e]) return;
                  r(1, t.annotationType_, this.name_ + "." + e.toString());
                }
                for (var i = this.target_; i && i !== c; ) {
                  var o = s(i, e);
                  if (o) {
                    var a = t.make_(this, e, o, i);
                    if (0 === a) return;
                    if (1 === a) break;
                  }
                  i = Object.getPrototypeOf(i);
                }
                $n(this, t, e);
              }
            }),
            (t.extend_ = function (e, t, n, r) {
              if (
                (void 0 === r && (r = !1),
                !0 === n && (n = this.defaultAnnotation_),
                !1 === n)
              )
                return this.defineProperty_(e, t, r);
              Yn(this, n, e);
              var i = n.extend_(this, e, t, r);
              return (i && $n(this, n, e), i);
            }),
            (t.defineProperty_ = function (e, t, n) {
              (void 0 === n && (n = !1), this.keysAtom_);
              try {
                gt();
                var r = this.delete_(e);
                if (!r) return r;
                if (ln(this)) {
                  var i = fn(this, {
                    object: this.proxy_ || this.target_,
                    name: e,
                    type: Ln,
                    newValue: t.value,
                  });
                  if (!i) return null;
                  var o = i.newValue;
                  t.value !== o && (t = N({}, t, { value: o }));
                }
                if (n) {
                  if (!Reflect.defineProperty(this.target_, e, t)) return !1;
                } else u(this.target_, e, t);
                this.notifyPropertyAddition_(e, t.value);
              } finally {
                mt();
              }
              return !0;
            }),
            (t.defineObservableProperty_ = function (e, t, n, r) {
              (void 0 === r && (r = !1), this.keysAtom_);
              try {
                gt();
                var i = this.delete_(e);
                if (!i) return i;
                if (ln(this)) {
                  var o = fn(this, {
                    object: this.proxy_ || this.target_,
                    name: e,
                    type: Ln,
                    newValue: t,
                  });
                  if (!o) return null;
                  t = o.newValue;
                }
                var a = Xn(e),
                  s = {
                    configurable: !vt.safeDescriptors || this.isPlainObject_,
                    enumerable: !0,
                    get: a.get,
                    set: a.set,
                  };
                if (r) {
                  if (!Reflect.defineProperty(this.target_, e, s)) return !1;
                } else u(this.target_, e, s);
                var c = new Fe(t, n, "ObservableObject.key", !1);
                (this.values_.set(e, c),
                  this.notifyPropertyAddition_(e, c.value_));
              } finally {
                mt();
              }
              return !0;
            }),
            (t.defineComputedProperty_ = function (e, t, n) {
              (void 0 === n && (n = !1), this.keysAtom_);
              try {
                gt();
                var r = this.delete_(e);
                if (!r) return r;
                if (ln(this))
                  if (
                    !fn(this, {
                      object: this.proxy_ || this.target_,
                      name: e,
                      type: Ln,
                      newValue: void 0,
                    })
                  )
                    return null;
                (t.name || (t.name = "ObservableObject.key"),
                  (t.context = this.proxy_ || this.target_));
                var i = Xn(e),
                  o = {
                    configurable: !vt.safeDescriptors || this.isPlainObject_,
                    enumerable: !1,
                    get: i.get,
                    set: i.set,
                  };
                if (n) {
                  if (!Reflect.defineProperty(this.target_, e, o)) return !1;
                } else u(this.target_, e, o);
                (this.values_.set(e, new Ze(t)),
                  this.notifyPropertyAddition_(e, void 0));
              } finally {
                mt();
              }
              return !0;
            }),
            (t.delete_ = function (e, t) {
              if (
                (void 0 === t && (t = !1), this.keysAtom_, !V(this.target_, e))
              )
                return !0;
              if (
                ln(this) &&
                !fn(this, {
                  object: this.proxy_ || this.target_,
                  name: e,
                  type: zn,
                })
              )
                return null;
              try {
                var n, r;
                gt();
                var i,
                  o = _n(this),
                  a = this.values_.get(e),
                  u = void 0;
                if (!a && o)
                  u = null == (i = s(this.target_, e)) ? void 0 : i.value;
                if (t) {
                  if (!Reflect.deleteProperty(this.target_, e)) return !1;
                } else delete this.target_[e];
                if (
                  (a &&
                    (this.values_.delete(e),
                    a instanceof Fe && (u = a.value_),
                    At(a)),
                  this.keysAtom_.reportChanged(),
                  null == (n = this.pendingKeys_) ||
                    null == (r = n.get(e)) ||
                    r.set(e in this.target_),
                  o)
                ) {
                  var c = {
                    type: zn,
                    observableKind: "object",
                    object: this.proxy_ || this.target_,
                    debugObjectName: this.name_,
                    oldValue: u,
                    name: e,
                  };
                  (0, o && vn(this, c));
                }
              } finally {
                mt();
              }
              return !0;
            }),
            (t.observe_ = function (e, t) {
              return dn(this, e);
            }),
            (t.intercept_ = function (e) {
              return hn(this, e);
            }),
            (t.notifyPropertyAddition_ = function (e, t) {
              var n,
                r,
                i = _n(this);
              if (i) {
                var o = i
                  ? {
                      type: Ln,
                      observableKind: "object",
                      debugObjectName: this.name_,
                      object: this.proxy_ || this.target_,
                      name: e,
                      newValue: t,
                    }
                  : null;
                (0, i && vn(this, o));
              }
              (null == (n = this.pendingKeys_) ||
                null == (r = n.get(e)) ||
                r.set(!0),
                this.keysAtom_.reportChanged());
            }),
            (t.ownKeys_ = function () {
              return (this.keysAtom_.reportObserved(), E(this.target_));
            }),
            (t.keys_ = function () {
              return (
                this.keysAtom_.reportObserved(),
                Object.keys(this.target_)
              );
            }),
            e
          );
        })();
      function Hn(e, t) {
        var n;
        if (V(e, q)) return e;
        var r =
            null != (n = null == t ? void 0 : t.name) ? n : "ObservableObject",
          i = new qn(
            e,
            new Map(),
            String(r),
            (function (e) {
              var t;
              return e
                ? null != (t = e.defaultDecorator)
                  ? t
                  : ye(e)
                : void 0;
            })(t),
          );
        return (A(e, q, i), e);
      }
      var Wn = S("ObservableObjectAdministration", qn);
      function Xn(e) {
        return (
          Gn[e] ||
          (Gn[e] = {
            get: function () {
              return this[q].getObservablePropValue_(e);
            },
            set: function (t) {
              return this[q].setObservablePropValue_(e, t);
            },
          })
        );
      }
      function Fn(e) {
        return !!g(e) && Wn(e[q]);
      }
      function $n(e, t, n) {
        var r;
        null == (r = e.target_[U]) || delete r[n];
      }
      function Yn(e, t, n) {}
      var Jn,
        Zn,
        Qn = ir(0),
        er = (function () {
          var e = !1,
            t = {};
          return (
            Object.defineProperty(t, "0", {
              set: function () {
                e = !0;
              },
            }),
            (Object.create(t)[0] = 1),
            !1 === e
          );
        })(),
        tr = 0,
        nr = function () {};
      ((Jn = nr),
        (Zn = Array.prototype),
        Object.setPrototypeOf
          ? Object.setPrototypeOf(Jn.prototype, Zn)
          : void 0 !== Jn.prototype.__proto__
            ? (Jn.prototype.__proto__ = Zn)
            : (Jn.prototype = Zn));
      var rr = (function (e, t, n) {
        function r(t, n, r, i) {
          var o;
          return (
            void 0 === r && (r = "ObservableArray"),
            void 0 === i && (i = !1),
            (o = e.call(this) || this),
            hr(function () {
              var e = new On(r, n, i, !0);
              ((e.proxy_ = R(o)),
                w(R(o), q, e),
                t && t.length && o.spliceWithArray(0, 0, t),
                er && Object.defineProperty(R(o), "0", Qn));
            }),
            o
          );
        }
        M(r, e);
        var i = r.prototype;
        return (
          (i.concat = function () {
            this[q].atom_.reportObserved();
            for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
              t[n] = arguments[n];
            return Array.prototype.concat.apply(
              this.slice(),
              t.map(function (e) {
                return Tn(e) ? e.slice() : e;
              }),
            );
          }),
          (i[n] = function () {
            var e = this,
              t = 0;
            return pr({
              next: function () {
                return t < e.length
                  ? { value: e[t++], done: !1 }
                  : { done: !0, value: void 0 };
              },
            });
          }),
          L(r, [
            {
              key: "length",
              get: function () {
                return this[q].getArrayLength_();
              },
              set: function (e) {
                this[q].setArrayLength_(e);
              },
            },
            {
              key: t,
              get: function () {
                return "Array";
              },
            },
          ]),
          r
        );
      })(nr, Symbol.toStringTag, Symbol.iterator);
      function ir(e) {
        return {
          enumerable: !1,
          configurable: !0,
          get: function () {
            return this[q].get_(e);
          },
          set: function (t) {
            this[q].set_(e, t);
          },
        };
      }
      function or(e) {
        u(rr.prototype, "" + e, ir(e));
      }
      function ar(e) {
        if (e > tr) {
          for (var t = tr; t < e + 100; t++) or(t);
          tr = e;
        }
      }
      function sr(e, t, n) {
        return new rr(e, t, n);
      }
      function ur(e, t) {
        if ("object" == typeof e && null !== e) {
          if (Tn(e)) return (void 0 !== t && r(23), e[q].atom_);
          if (Kn(e)) return e.atom_;
          if (Bn(e)) {
            if (void 0 === t) return e.keysAtom_;
            var n = e.data_.get(t) || e.hasMap_.get(t);
            return (n || r(25, t, lr(e)), n);
          }
          if (Fn(e)) {
            if (!t) return r(26);
            var i = e[q].values_.get(t);
            return (i || r(27, t, lr(e)), i);
          }
          if (W(e) || Qe(e) || Et(e)) return e;
        } else if (b(e) && Et(e[q])) return e[q];
        r(28);
      }
      function cr(e, t) {
        return (
          e || r(29),
          void 0 !== t
            ? cr(ur(e, t))
            : W(e) || Qe(e) || Et(e) || Bn(e) || Kn(e)
              ? e
              : e[q]
                ? e[q]
                : void r(24, e)
        );
      }
      function lr(e, t) {
        var n;
        if (void 0 !== t) n = ur(e, t);
        else {
          if (It(e)) return e.name;
          n = Fn(e) || Bn(e) || Kn(e) ? cr(e) : ur(e);
        }
        return n.name_;
      }
      function hr(e) {
        var t = st(),
          n = He(!0);
        gt();
        try {
          return e();
        } finally {
          (mt(), We(n), ut(t));
        }
      }
      (Object.entries(wn).forEach(function (e) {
        var t = e[0],
          n = e[1];
        "concat" !== t && A(rr.prototype, t, n);
      }),
        ar(1e3));
      var fr = c.toString;
      function _r(e, t, n) {
        return (void 0 === n && (n = -1), dr(e, t, n));
      }
      function dr(e, t, n, r, i) {
        if (e === t) return 0 !== e || 1 / e == 1 / t;
        if (null == e || null == t) return !1;
        if (e != e) return t != t;
        var o = typeof e;
        if ("function" !== o && "object" !== o && "object" != typeof t)
          return !1;
        var a = fr.call(e);
        if (a !== fr.call(t)) return !1;
        switch (a) {
          case "[object RegExp]":
          case "[object String]":
            return "" + e == "" + t;
          case "[object Number]":
            return +e != +e ? +t != +t : 0 == +e ? 1 / +e == 1 / t : +e == +t;
          case "[object Date]":
          case "[object Boolean]":
            return +e == +t;
          case "[object Symbol]":
            return (
              "undefined" != typeof Symbol &&
              Symbol.valueOf.call(e) === Symbol.valueOf.call(t)
            );
          case "[object Map]":
          case "[object Set]":
            n >= 0 && n++;
        }
        ((e = vr(e)), (t = vr(t)));
        var s = "[object Array]" === a;
        if (!s) {
          if ("object" != typeof e || "object" != typeof t) return !1;
          var u = e.constructor,
            c = t.constructor;
          if (
            u !== c &&
            !(b(u) && u instanceof u && b(c) && c instanceof c) &&
            "constructor" in e &&
            "constructor" in t
          )
            return !1;
        }
        if (0 === n) return !1;
        (n < 0 && (n = -1), (i = i || []));
        for (var l = (r = r || []).length; l--; )
          if (r[l] === e) return i[l] === t;
        if ((r.push(e), i.push(t), s)) {
          if ((l = e.length) !== t.length) return !1;
          for (; l--; ) if (!dr(e[l], t[l], n - 1, r, i)) return !1;
        } else {
          var h,
            f = Object.keys(e);
          if (((l = f.length), Object.keys(t).length !== l)) return !1;
          for (; l--; )
            if (!V(t, (h = f[l])) || !dr(e[h], t[h], n - 1, r, i)) return !1;
        }
        return (r.pop(), i.pop(), !0);
      }
      function vr(e) {
        return Tn(e)
          ? e.slice()
          : k(e) || Bn(e) || j(e) || Kn(e)
            ? Array.from(e.entries())
            : e;
      }
      function pr(e) {
        return ((e[Symbol.iterator] = br), e);
      }
      function br() {
        return this;
      }
      (["Symbol", "Map", "Set"].forEach(function (e) {
        void 0 === o()[e] &&
          r("MobX requires global '" + e + "' to be available or polyfilled");
      }),
        "object" == typeof __MOBX_DEVTOOLS_GLOBAL_HOOK__ &&
          __MOBX_DEVTOOLS_GLOBAL_HOOK__.injectMobx({
            spy: function (e) {
              return function () {};
            },
            extras: { getDebugName: lr },
            $mobx: q,
          }));
    },
    8865: (e, t, n) => {
      var r = n(5736);
      ((t.createRoot = r.createRoot), (t.hydrateRoot = r.hydrateRoot));
    },
    5736: (e, t, n) => {
      (!(function e() {
        if (
          "undefined" != typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ &&
          "function" == typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE
        )
          try {
            __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(e);
          } catch (e) {}
      })(),
        (e.exports = n(8)));
    },
    3337: (e, t, n) => {
      e.exports = n(3808);
    },
    4143: (e, t, n) => {
      n.d(t, { Ay: () => p });
      var r = n(4703);
      const i = Symbol.for("Dexie"),
        o = globalThis[i] || (globalThis[i] = r);
      if (r.semVer !== o.semVer)
        throw new Error(
          `Two different versions of Dexie loaded in the same app: ${r.semVer} and ${o.semVer}`,
        );
      const {
          liveQuery: a,
          mergeRanges: s,
          rangesOverlap: u,
          RangeSet: c,
          cmp: l,
          Entity: h,
          PropModification: f,
          replacePrefix: _,
          add: d,
          remove: v,
        } = o,
        p = o;
    },
  },
]);
