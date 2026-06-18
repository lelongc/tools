(() => {
  "use strict";
  var e = {};
  e.g = (function () {
    if ("object" == typeof globalThis) return globalThis;
    try {
      return this || new Function("return this")();
    } catch (e) {
      if ("object" == typeof window) return window;
    }
  })();
  function t(e) {
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
  var n = {};
  function r() {
    return "undefined" != typeof globalThis
      ? globalThis
      : "undefined" != typeof window
        ? window
        : void 0 !== e.g
          ? e.g
          : "undefined" != typeof self
            ? self
            : n;
  }
  var o = Object.assign,
    a = Object.getOwnPropertyDescriptor,
    i = Object.defineProperty,
    s = Object.prototype,
    l = [];
  Object.freeze(l);
  var c = {};
  Object.freeze(c);
  var u = "undefined" != typeof Proxy,
    d = Object.toString();
  function p() {
    u || t("Proxy not available");
  }
  function g(e) {
    var t = !1;
    return function () {
      if (!t) return ((t = !0), e.apply(this, arguments));
    };
  }
  var h = function () {};
  function f(e) {
    return "function" == typeof e;
  }
  function m(e) {
    switch (typeof e) {
      case "string":
      case "symbol":
      case "number":
        return !0;
    }
    return !1;
  }
  function v(e) {
    return null !== e && "object" == typeof e;
  }
  function y(e) {
    if (!v(e)) return !1;
    var t = Object.getPrototypeOf(e);
    if (null == t) return !0;
    var n = Object.hasOwnProperty.call(t, "constructor") && t.constructor;
    return "function" == typeof n && n.toString() === d;
  }
  function b(e) {
    var t = null == e ? void 0 : e.constructor;
    return (
      !!t &&
      ("GeneratorFunction" === t.name || "GeneratorFunction" === t.displayName)
    );
  }
  function x(e, t, n) {
    i(e, t, { enumerable: !1, writable: !0, configurable: !0, value: n });
  }
  function w(e, t, n) {
    i(e, t, { enumerable: !1, writable: !1, configurable: !0, value: n });
  }
  function S(e, t) {
    var n = "isMobX" + e;
    return (
      (t.prototype[n] = !0),
      function (e) {
        return v(e) && !0 === e[n];
      }
    );
  }
  function k(e) {
    return e instanceof Map;
  }
  function T(e) {
    return e instanceof Set;
  }
  var _ = void 0 !== Object.getOwnPropertySymbols;
  var C =
    "undefined" != typeof Reflect && Reflect.ownKeys
      ? Reflect.ownKeys
      : _
        ? function (e) {
            return Object.getOwnPropertyNames(e).concat(
              Object.getOwnPropertySymbols(e),
            );
          }
        : Object.getOwnPropertyNames;
  function E(e) {
    return null === e ? null : "object" == typeof e ? "" + e : e;
  }
  function P(e, t) {
    return s.hasOwnProperty.call(e, t);
  }
  var O =
    Object.getOwnPropertyDescriptors ||
    function (e) {
      var t = {};
      return (
        C(e).forEach(function (n) {
          t[n] = a(e, n);
        }),
        t
      );
    };
  function M(e, t) {
    for (var n = 0; n < t.length; n++) {
      var r = t[n];
      ((r.enumerable = r.enumerable || !1),
        (r.configurable = !0),
        "value" in r && (r.writable = !0),
        Object.defineProperty(
          e,
          ((o = r.key),
          (a = void 0),
          "symbol" ==
          typeof (a = (function (e, t) {
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
          })(o, "string"))
            ? a
            : String(a)),
          r,
        ));
    }
    var o, a;
  }
  function L(e, t, n) {
    return (
      t && M(e.prototype, t),
      n && M(e, n),
      Object.defineProperty(e, "prototype", { writable: !1 }),
      e
    );
  }
  function z() {
    return (
      (z = Object.assign
        ? Object.assign.bind()
        : function (e) {
            for (var t = 1; t < arguments.length; t++) {
              var n = arguments[t];
              for (var r in n)
                Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
            }
            return e;
          }),
      z.apply(this, arguments)
    );
  }
  function N(e, t) {
    ((e.prototype = Object.create(t.prototype)),
      (e.prototype.constructor = e),
      A(e, t));
  }
  function A(e, t) {
    return (
      (A = Object.setPrototypeOf
        ? Object.setPrototypeOf.bind()
        : function (e, t) {
            return ((e.__proto__ = t), e);
          }),
      A(e, t)
    );
  }
  function D(e) {
    if (void 0 === e)
      throw new ReferenceError(
        "this hasn't been initialised - super() hasn't been called",
      );
    return e;
  }
  function V(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
    return r;
  }
  function B(e, t) {
    var n =
      ("undefined" != typeof Symbol && e[Symbol.iterator]) || e["@@iterator"];
    if (n) return (n = n.call(e)).next.bind(n);
    if (
      Array.isArray(e) ||
      (n = (function (e, t) {
        if (e) {
          if ("string" == typeof e) return V(e, t);
          var n = Object.prototype.toString.call(e).slice(8, -1);
          return (
            "Object" === n && e.constructor && (n = e.constructor.name),
            "Map" === n || "Set" === n
              ? Array.from(e)
              : "Arguments" === n ||
                  /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                ? V(e, t)
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
  var j = Symbol("mobx-stored-annotations");
  function I(e) {
    return Object.assign(function (t, n) {
      if (F(n)) return e.decorate_20223_(t, n);
      R(t, n, e);
    }, e);
  }
  function R(e, t, n) {
    (P(e, j) || x(e, j, z({}, e[j])),
      (function (e) {
        return e.annotationType_ === K;
      })(n) || (e[j][t] = n));
  }
  function F(e) {
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
          (this.lowestObserverState_ = Xe.NOT_TRACKING_),
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
          return bt(this);
        }),
        (t.reportChanged = function () {
          (vt(), xt(this), yt());
        }),
        (t.toString = function () {
          return this.name_;
        }),
        e
      );
    })(),
    U = S("Atom", H);
  function W(e, t, n) {
    (void 0 === t && (t = h), void 0 === n && (n = h));
    var r,
      o = new H(e);
    return (t !== h && Ut(Ft, o, t, r), n !== h && Ht(o, n), o);
  }
  var Y = {
    identity: function (e, t) {
      return e === t;
    },
    structural: function (e, t) {
      return cr(e, t);
    },
    default: function (e, t) {
      return Object.is
        ? Object.is(e, t)
        : e === t
          ? 0 !== e || 1 / e == 1 / t
          : e != e && t != t;
    },
    shallow: function (e, t) {
      return cr(e, t, 1);
    },
  };
  function G(e, t, n) {
    return en(e)
      ? e
      : Array.isArray(e)
        ? Le.array(e, { name: n })
        : y(e)
          ? Le.object(e, void 0, { name: n })
          : k(e)
            ? Le.map(e, { name: n })
            : T(e)
              ? Le.set(e, { name: n })
              : "function" != typeof e || Bt(e) || $t(e)
                ? e
                : b(e)
                  ? Zt(e)
                  : Vt(n, e);
  }
  function X(e) {
    return e;
  }
  var K = "override";
  function Z(e, t) {
    return {
      annotationType_: e,
      options_: t,
      make_: J,
      extend_: $,
      decorate_20223_: Q,
    };
  }
  function J(e, t, n, r) {
    var o;
    if (null != (o = this.options_) && o.bound)
      return null === this.extend_(e, t, n, !1) ? 0 : 1;
    if (r === e.target_) return null === this.extend_(e, t, n, !1) ? 0 : 2;
    if (Bt(n.value)) return 1;
    var a = ee(e, this, t, n, !1);
    return (i(r, t, a), 2);
  }
  function $(e, t, n, r) {
    var o = ee(e, this, t, n);
    return e.defineProperty_(t, o, r);
  }
  function Q(e, n) {
    var r = n.kind,
      o = n.name,
      a = n.addInitializer,
      i = this;
    if ("field" != r) {
      var s, l, c, u, d, p;
      if ("method" == r)
        return (
          Bt(e) ||
            ((l = e),
            (e = Fe(
              null != (c = null == (u = i.options_) ? void 0 : u.name)
                ? c
                : o.toString(),
              l,
              null != (d = null == (p = i.options_) ? void 0 : p.autoAction) &&
                d,
            ))),
          null != (s = this.options_) &&
            s.bound &&
            a(function () {
              var e = this,
                t = e[o].bind(e);
              ((t.isMobxAction = !0), (e[o] = t));
            }),
          e
        );
      t(
        "Cannot apply '" +
          i.annotationType_ +
          "' to '" +
          String(o) +
          "' (kind: " +
          r +
          "):\n'" +
          i.annotationType_ +
          "' can only be used on properties with a function value.",
      );
    } else
      a(function () {
        R(this, o, i);
      });
  }
  function ee(e, t, n, r, o) {
    var a, i, s, l, c, u, d, p;
    (void 0 === o && (o = gt.safeDescriptors),
      (p = r),
      t.annotationType_,
      p.value);
    var g,
      h = r.value;
    null != (a = t.options_) &&
      a.bound &&
      (h = h.bind(null != (g = e.proxy_) ? g : e.target_));
    return {
      value: Fe(
        null != (i = null == (s = t.options_) ? void 0 : s.name)
          ? i
          : n.toString(),
        h,
        null != (l = null == (c = t.options_) ? void 0 : c.autoAction) && l,
        null != (u = t.options_) && u.bound
          ? null != (d = e.proxy_)
            ? d
            : e.target_
          : void 0,
      ),
      configurable: !o || e.isPlainObject_,
      enumerable: !1,
      writable: !o,
    };
  }
  function te(e, t) {
    return {
      annotationType_: e,
      options_: t,
      make_: ne,
      extend_: re,
      decorate_20223_: oe,
    };
  }
  function ne(e, t, n, r) {
    var o;
    if (r === e.target_) return null === this.extend_(e, t, n, !1) ? 0 : 2;
    if (
      null != (o = this.options_) &&
      o.bound &&
      (!P(e.target_, t) || !$t(e.target_[t])) &&
      null === this.extend_(e, t, n, !1)
    )
      return 0;
    if ($t(n.value)) return 1;
    var a = ae(e, this, t, n, !1, !1);
    return (i(r, t, a), 2);
  }
  function re(e, t, n, r) {
    var o,
      a = ae(e, this, t, n, null == (o = this.options_) ? void 0 : o.bound);
    return e.defineProperty_(t, a, r);
  }
  function oe(e, t) {
    var n;
    var r = t.name,
      o = t.addInitializer;
    return (
      $t(e) || (e = Zt(e)),
      null != (n = this.options_) &&
        n.bound &&
        o(function () {
          var e = this,
            t = e[r].bind(e);
          ((t.isMobXFlow = !0), (e[r] = t));
        }),
      e
    );
  }
  function ae(e, t, n, r, o, a) {
    var i;
    (void 0 === a && (a = gt.safeDescriptors),
      (i = r),
      t.annotationType_,
      i.value);
    var s,
      l = r.value;
    ($t(l) || (l = Zt(l)), o) &&
      ((l = l.bind(null != (s = e.proxy_) ? s : e.target_)).isMobXFlow = !0);
    return {
      value: l,
      configurable: !a || e.isPlainObject_,
      enumerable: !1,
      writable: !a,
    };
  }
  function ie(e, t) {
    return {
      annotationType_: e,
      options_: t,
      make_: se,
      extend_: le,
      decorate_20223_: ce,
    };
  }
  function se(e, t, n) {
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
        z({}, this.options_, { get: n.get, set: n.set }),
        r,
      )
    );
  }
  function ce(e, t) {
    var n = this,
      r = t.name;
    return (
      (0, t.addInitializer)(function () {
        var t = Fn(this)[q],
          o = z({}, n.options_, { get: e, context: this });
        (o.name || (o.name = "ObservableObject." + r.toString()),
          t.values_.set(r, new Ze(o)));
      }),
      function () {
        return this[q].getObservablePropValue_(r);
      }
    );
  }
  function ue(e, t) {
    return {
      annotationType_: e,
      options_: t,
      make_: de,
      extend_: pe,
      decorate_20223_: ge,
    };
  }
  function de(e, t, n) {
    return null === this.extend_(e, t, n, !1) ? 0 : 1;
  }
  function pe(e, t, n, r) {
    var o, a;
    return (
      (function (e, t, n, r) {
        t.annotationType_;
        0;
      })(0, this),
      e.defineObservableProperty_(
        t,
        n.value,
        null != (o = null == (a = this.options_) ? void 0 : a.enhancer) ? o : G,
        r,
      )
    );
  }
  function ge(e, t) {
    var n = this,
      r = t.kind,
      o = t.name,
      a = new WeakSet();
    function i(e, t) {
      var r,
        i,
        s = Fn(e)[q],
        l = new Ye(
          t,
          null != (r = null == (i = n.options_) ? void 0 : i.enhancer) ? r : G,
          "ObservableObject." + o.toString(),
          !1,
        );
      (s.values_.set(o, l), a.add(e));
    }
    if ("accessor" == r)
      return {
        get: function () {
          return (
            a.has(this) || i(this, e.get.call(this)),
            this[q].getObservablePropValue_(o)
          );
        },
        set: function (e) {
          return (
            a.has(this) || i(this, e),
            this[q].setObservablePropValue_(o, e)
          );
        },
        init: function (e) {
          return (a.has(this) || i(this, e), e);
        },
      };
  }
  var he = "true",
    fe = me();
  function me(e) {
    return {
      annotationType_: he,
      options_: e,
      make_: ve,
      extend_: ye,
      decorate_20223_: be,
    };
  }
  function ve(e, t, n, r) {
    var o, a, s, l;
    if (n.get) return De.make_(e, t, n, r);
    if (n.set) {
      var c = Fe(t.toString(), n.set);
      return r === e.target_
        ? null ===
          e.defineProperty_(t, {
            configurable: !gt.safeDescriptors || e.isPlainObject_,
            set: c,
          })
          ? 0
          : 2
        : (i(r, t, { configurable: !0, set: c }), 2);
    }
    if (r !== e.target_ && "function" == typeof n.value)
      return b(n.value)
        ? (null != (l = this.options_) && l.autoBind ? Zt.bound : Zt).make_(
            e,
            t,
            n,
            r,
          )
        : (null != (s = this.options_) && s.autoBind ? Vt.bound : Vt).make_(
            e,
            t,
            n,
            r,
          );
    var u,
      d = !1 === (null == (o = this.options_) ? void 0 : o.deep) ? Le.ref : Le;
    "function" == typeof n.value &&
      null != (a = this.options_) &&
      a.autoBind &&
      (n.value = n.value.bind(null != (u = e.proxy_) ? u : e.target_));
    return d.make_(e, t, n, r);
  }
  function ye(e, t, n, r) {
    var o, a, i;
    if (n.get) return De.extend_(e, t, n, r);
    if (n.set)
      return e.defineProperty_(
        t,
        {
          configurable: !gt.safeDescriptors || e.isPlainObject_,
          set: Fe(t.toString(), n.set),
        },
        r,
      );
    "function" == typeof n.value &&
      null != (o = this.options_) &&
      o.autoBind &&
      (n.value = n.value.bind(null != (i = e.proxy_) ? i : e.target_));
    return (
      !1 === (null == (a = this.options_) ? void 0 : a.deep) ? Le.ref : Le
    ).extend_(e, t, n, r);
  }
  function be(e, n) {
    t("'" + this.annotationType_ + "' cannot be used as a decorator");
  }
  var xe = { deep: !0, name: void 0, defaultDecorator: void 0, proxy: !0 };
  function we(e) {
    return e || xe;
  }
  Object.freeze(xe);
  var Se = ue("observable"),
    ke = ue("observable.ref", { enhancer: X }),
    Te = ue("observable.shallow", {
      enhancer: function (e, t, n) {
        return null == e || Un(e) || En(e) || An(e) || Bn(e)
          ? e
          : Array.isArray(e)
            ? Le.array(e, { name: n, deep: !1 })
            : y(e)
              ? Le.object(e, void 0, { name: n, deep: !1 })
              : k(e)
                ? Le.map(e, { name: n, deep: !1 })
                : T(e)
                  ? Le.set(e, { name: n, deep: !1 })
                  : void 0;
      },
    }),
    _e = ue("observable.struct", {
      enhancer: function (e, t) {
        return cr(e, t) ? t : e;
      },
    }),
    Ce = I(Se);
  function Ee(e) {
    return !0 === e.deep
      ? G
      : !1 === e.deep
        ? X
        : (t = e.defaultDecorator) &&
            null != (n = null == (r = t.options_) ? void 0 : r.enhancer)
          ? n
          : G;
    var t, n, r;
  }
  function Pe(e, t, n) {
    return F(t)
      ? Se.decorate_20223_(e, t)
      : m(t)
        ? void R(e, t, Se)
        : en(e)
          ? e
          : y(e)
            ? Le.object(e, t, n)
            : Array.isArray(e)
              ? Le.array(e, t)
              : k(e)
                ? Le.map(e, t)
                : T(e)
                  ? Le.set(e, t)
                  : "object" == typeof e && null !== e
                    ? e
                    : Le.box(e, t);
  }
  o(Pe, Ce);
  var Oe,
    Me,
    Le = o(Pe, {
      box: function (e, t) {
        var n = we(t);
        return new Ye(e, Ee(n), n.name, !0, n.equals);
      },
      array: function (e, t) {
        var n = we(t);
        return (!1 === gt.useProxies || !1 === n.proxy ? rr : yn)(
          e,
          Ee(n),
          n.name,
        );
      },
      map: function (e, t) {
        var n = we(t);
        return new Nn(e, Ee(n), n.name);
      },
      set: function (e, t) {
        var n = we(t);
        return new Vn(e, Ee(n), n.name);
      },
      object: function (e, t, n) {
        return sr(function () {
          return Wt(
            !1 === gt.useProxies || !1 === (null == n ? void 0 : n.proxy)
              ? Fn({}, n)
              : (function (e, t) {
                  var n, r;
                  return (
                    p(),
                    (e = Fn(e, t)),
                    null != (r = (n = e[q]).proxy_)
                      ? r
                      : (n.proxy_ = new Proxy(e, an))
                  );
                })({}, n),
            e,
            t,
          );
        });
      },
      ref: I(ke),
      shallow: I(Te),
      deep: Ce,
      struct: I(_e),
    }),
    ze = "computed",
    Ne = ie(ze),
    Ae = ie("computed.struct", { equals: Y.structural }),
    De = function (e, t) {
      if (F(t)) return Ne.decorate_20223_(e, t);
      if (m(t)) return R(e, t, Ne);
      if (y(e)) return I(ie(ze, e));
      var n = y(t) ? t : {};
      return ((n.get = e), n.name || (n.name = e.name || ""), new Ze(n));
    };
  (Object.assign(De, Ne), (De.struct = I(Ae)));
  var Ve,
    Be = 0,
    je = 1,
    Ie =
      null !=
        (Oe =
          null == (Me = a(function () {}, "name"))
            ? void 0
            : Me.configurable) && Oe,
    Re = { value: "action", configurable: !0, writable: !1, enumerable: !1 };
  function Fe(e, t, n, r) {
    function o() {
      return qe(e, n, t, r || this, arguments);
    }
    return (
      void 0 === n && (n = !1),
      (o.isMobxAction = !0),
      (o.toString = function () {
        return t.toString();
      }),
      Ie && ((Re.value = e), i(o, "name", Re)),
      o
    );
  }
  function qe(e, n, r, o, a) {
    var i = (function (e, t, n, r) {
      var o = !1,
        a = 0;
      0;
      var i = gt.trackingDerivation,
        s = !t || !i;
      vt();
      var l = gt.allowStateChanges;
      s && (at(), (l = He(!0)));
      var c = st(!0),
        u = {
          runAsAction_: s,
          prevDerivation_: i,
          prevAllowStateChanges_: l,
          prevAllowStateReads_: c,
          notifySpy_: o,
          startTime_: a,
          actionId_: je++,
          parentActionId_: Be,
        };
      return ((Be = u.actionId_), u);
    })(0, n);
    try {
      return r.apply(o, a);
    } catch (e) {
      throw ((i.error_ = e), e);
    } finally {
      !(function (e) {
        Be !== e.actionId_ && t(30);
        ((Be = e.parentActionId_),
          void 0 !== e.error_ && (gt.suppressReactionErrors = !0));
        (Ue(e.prevAllowStateChanges_),
          lt(e.prevAllowStateReads_),
          yt(),
          e.runAsAction_ && it(e.prevDerivation_));
        0;
        gt.suppressReactionErrors = !1;
      })(i);
    }
  }
  function He(e) {
    var t = gt.allowStateChanges;
    return ((gt.allowStateChanges = e), t);
  }
  function Ue(e) {
    gt.allowStateChanges = e;
  }
  Ve = Symbol.toPrimitive;
  var We,
    Ye = (function (e) {
      function t(t, n, r, o, a) {
        var i;
        return (
          void 0 === r && (r = "ObservableValue"),
          void 0 === o && (o = !0),
          void 0 === a && (a = Y.default),
          ((i = e.call(this, r) || this).enhancer = void 0),
          (i.name_ = void 0),
          (i.equals = void 0),
          (i.hasUnreportedChange_ = !1),
          (i.interceptors_ = void 0),
          (i.changeListeners_ = void 0),
          (i.value_ = void 0),
          (i.dehancer = void 0),
          (i.enhancer = n),
          (i.name_ = r),
          (i.equals = a),
          (i.value_ = n(t, void 0, r)),
          i
        );
      }
      N(t, e);
      var n = t.prototype;
      return (
        (n.dehanceValue = function (e) {
          return void 0 !== this.dehancer ? this.dehancer(e) : e;
        }),
        (n.set = function (e) {
          this.value_;
          if ((e = this.prepareNewValue_(e)) !== gt.UNCHANGED) {
            (0, this.setNewValue_(e));
          }
        }),
        (n.prepareNewValue_ = function (e) {
          if ((tt(this), sn(this))) {
            var t = cn(this, { object: this, type: fn, newValue: e });
            if (!t) return gt.UNCHANGED;
            e = t.newValue;
          }
          return (
            (e = this.enhancer(e, this.value_, this.name_)),
            this.equals(this.value_, e) ? gt.UNCHANGED : e
          );
        }),
        (n.setNewValue_ = function (e) {
          var t = this.value_;
          ((this.value_ = e),
            this.reportChanged(),
            un(this) &&
              pn(this, { type: fn, object: this, newValue: e, oldValue: t }));
        }),
        (n.get = function () {
          return (this.reportObserved(), this.dehanceValue(this.value_));
        }),
        (n.intercept_ = function (e) {
          return ln(this, e);
        }),
        (n.observe_ = function (e, t) {
          return (
            t &&
              e({
                observableKind: "value",
                debugObjectName: this.name_,
                object: this,
                type: fn,
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
          return E(this.get());
        }),
        (n[Ve] = function () {
          return this.valueOf();
        }),
        t
      );
    })(H),
    Ge = S("ObservableValue", Ye);
  We = Symbol.toPrimitive;
  var Xe,
    Ke,
    Ze = (function () {
      function e(e) {
        ((this.dependenciesState_ = Xe.NOT_TRACKING_),
          (this.observing_ = []),
          (this.newObserving_ = null),
          (this.isBeingObserved_ = !1),
          (this.isPendingUnobservation_ = !1),
          (this.observers_ = new Set()),
          (this.diffValue_ = 0),
          (this.runId_ = 0),
          (this.lastAccessedBy_ = 0),
          (this.lowestObserverState_ = Xe.UP_TO_DATE_),
          (this.unboundDepsCount_ = 0),
          (this.value_ = new $e(null)),
          (this.name_ = void 0),
          (this.triggeredBy_ = void 0),
          (this.isComputing_ = !1),
          (this.isRunningSetter_ = !1),
          (this.derivation = void 0),
          (this.setter_ = void 0),
          (this.isTracing_ = Ke.NONE),
          (this.scope_ = void 0),
          (this.equals_ = void 0),
          (this.requiresReaction_ = void 0),
          (this.keepAlive_ = void 0),
          (this.onBOL = void 0),
          (this.onBUOL = void 0),
          e.get || t(31),
          (this.derivation = e.get),
          (this.name_ = e.name || "ComputedValue"),
          e.set && (this.setter_ = Fe("ComputedValue-setter", e.set)),
          (this.equals_ =
            e.equals ||
            (e.compareStructural || e.struct ? Y.structural : Y.default)),
          (this.scope_ = e.context),
          (this.requiresReaction_ = e.requiresReaction),
          (this.keepAlive_ = !!e.keepAlive));
      }
      var n = e.prototype;
      return (
        (n.onBecomeStale_ = function () {
          !(function (e) {
            if (e.lowestObserverState_ !== Xe.UP_TO_DATE_) return;
            ((e.lowestObserverState_ = Xe.POSSIBLY_STALE_),
              e.observers_.forEach(function (e) {
                e.dependenciesState_ === Xe.UP_TO_DATE_ &&
                  ((e.dependenciesState_ = Xe.POSSIBLY_STALE_),
                  e.onBecomeStale_());
              }));
          })(this);
        }),
        (n.onBO = function () {
          this.onBOL &&
            this.onBOL.forEach(function (e) {
              return e();
            });
        }),
        (n.onBUO = function () {
          this.onBUOL &&
            this.onBUOL.forEach(function (e) {
              return e();
            });
        }),
        (n.get = function () {
          if (
            (this.isComputing_ && t(32, this.name_, this.derivation),
            0 !== gt.inBatch || 0 !== this.observers_.size || this.keepAlive_)
          ) {
            if ((bt(this), et(this))) {
              var e = gt.trackingContext;
              (this.keepAlive_ && !e && (gt.trackingContext = this),
                this.trackAndCompute() &&
                  (function (e) {
                    if (e.lowestObserverState_ === Xe.STALE_) return;
                    ((e.lowestObserverState_ = Xe.STALE_),
                      e.observers_.forEach(function (t) {
                        t.dependenciesState_ === Xe.POSSIBLY_STALE_
                          ? (t.dependenciesState_ = Xe.STALE_)
                          : t.dependenciesState_ === Xe.UP_TO_DATE_ &&
                            (e.lowestObserverState_ = Xe.UP_TO_DATE_);
                      }));
                  })(this),
                (gt.trackingContext = e));
            }
          } else
            et(this) &&
              (this.warnAboutUntrackedRead_(),
              vt(),
              (this.value_ = this.computeValue_(!1)),
              yt());
          var n = this.value_;
          if (Qe(n)) throw n.cause;
          return n;
        }),
        (n.set = function (e) {
          if (this.setter_) {
            (this.isRunningSetter_ && t(33, this.name_),
              (this.isRunningSetter_ = !0));
            try {
              this.setter_.call(this.scope_, e);
            } finally {
              this.isRunningSetter_ = !1;
            }
          } else t(34, this.name_);
        }),
        (n.trackAndCompute = function () {
          var e = this.value_,
            t = this.dependenciesState_ === Xe.NOT_TRACKING_,
            n = this.computeValue_(!0),
            r = t || Qe(e) || Qe(n) || !this.equals_(e, n);
          return (r && (this.value_ = n), r);
        }),
        (n.computeValue_ = function (e) {
          this.isComputing_ = !0;
          var t,
            n = He(!1);
          if (e) t = nt(this, this.derivation, this.scope_);
          else if (!0 === gt.disableErrorBoundaries)
            t = this.derivation.call(this.scope_);
          else
            try {
              t = this.derivation.call(this.scope_);
            } catch (e) {
              t = new $e(e);
            }
          return (Ue(n), (this.isComputing_ = !1), t);
        }),
        (n.suspend_ = function () {
          this.keepAlive_ || (rt(this), (this.value_ = void 0));
        }),
        (n.observe_ = function (e, t) {
          var n = this,
            r = !0,
            o = void 0;
          return jt(function () {
            var a = n.get();
            if (!r || t) {
              var i = at();
              (e({
                observableKind: "computed",
                debugObjectName: n.name_,
                type: fn,
                object: n,
                newValue: a,
                oldValue: o,
              }),
                it(i));
            }
            ((r = !1), (o = a));
          });
        }),
        (n.warnAboutUntrackedRead_ = function () {}),
        (n.toString = function () {
          return this.name_ + "[" + this.derivation.toString() + "]";
        }),
        (n.valueOf = function () {
          return E(this.get());
        }),
        (n[We] = function () {
          return this.valueOf();
        }),
        e
      );
    })(),
    Je = S("ComputedValue", Ze);
  (!(function (e) {
    ((e[(e.NOT_TRACKING_ = -1)] = "NOT_TRACKING_"),
      (e[(e.UP_TO_DATE_ = 0)] = "UP_TO_DATE_"),
      (e[(e.POSSIBLY_STALE_ = 1)] = "POSSIBLY_STALE_"),
      (e[(e.STALE_ = 2)] = "STALE_"));
  })(Xe || (Xe = {})),
    (function (e) {
      ((e[(e.NONE = 0)] = "NONE"),
        (e[(e.LOG = 1)] = "LOG"),
        (e[(e.BREAK = 2)] = "BREAK"));
    })(Ke || (Ke = {})));
  var $e = function (e) {
    ((this.cause = void 0), (this.cause = e));
  };
  function Qe(e) {
    return e instanceof $e;
  }
  function et(e) {
    switch (e.dependenciesState_) {
      case Xe.UP_TO_DATE_:
        return !1;
      case Xe.NOT_TRACKING_:
      case Xe.STALE_:
        return !0;
      case Xe.POSSIBLY_STALE_:
        for (
          var t = st(!0), n = at(), r = e.observing_, o = r.length, a = 0;
          a < o;
          a++
        ) {
          var i = r[a];
          if (Je(i)) {
            if (gt.disableErrorBoundaries) i.get();
            else
              try {
                i.get();
              } catch (e) {
                return (it(n), lt(t), !0);
              }
            if (e.dependenciesState_ === Xe.STALE_) return (it(n), lt(t), !0);
          }
        }
        return (ct(e), it(n), lt(t), !1);
    }
  }
  function tt(e) {}
  function nt(e, t, n) {
    var r = st(!0);
    (ct(e),
      (e.newObserving_ = new Array(e.observing_.length + 100)),
      (e.unboundDepsCount_ = 0),
      (e.runId_ = ++gt.runId));
    var o,
      a = gt.trackingDerivation;
    if (
      ((gt.trackingDerivation = e),
      gt.inBatch++,
      !0 === gt.disableErrorBoundaries)
    )
      o = t.call(n);
    else
      try {
        o = t.call(n);
      } catch (e) {
        o = new $e(e);
      }
    return (
      gt.inBatch--,
      (gt.trackingDerivation = a),
      (function (e) {
        for (
          var t = e.observing_,
            n = (e.observing_ = e.newObserving_),
            r = Xe.UP_TO_DATE_,
            o = 0,
            a = e.unboundDepsCount_,
            i = 0;
          i < a;
          i++
        ) {
          var s = n[i];
          (0 === s.diffValue_ &&
            ((s.diffValue_ = 1), o !== i && (n[o] = s), o++),
            s.dependenciesState_ > r && (r = s.dependenciesState_));
        }
        ((n.length = o), (e.newObserving_ = null), (a = t.length));
        for (; a--; ) {
          var l = t[a];
          (0 === l.diffValue_ && ft(l, e), (l.diffValue_ = 0));
        }
        for (; o--; ) {
          var c = n[o];
          1 === c.diffValue_ && ((c.diffValue_ = 0), ht(c, e));
        }
        r !== Xe.UP_TO_DATE_ &&
          ((e.dependenciesState_ = r), e.onBecomeStale_());
      })(e),
      lt(r),
      o
    );
  }
  function rt(e) {
    var t = e.observing_;
    e.observing_ = [];
    for (var n = t.length; n--; ) ft(t[n], e);
    e.dependenciesState_ = Xe.NOT_TRACKING_;
  }
  function ot(e) {
    var t = at();
    try {
      return e();
    } finally {
      it(t);
    }
  }
  function at() {
    var e = gt.trackingDerivation;
    return ((gt.trackingDerivation = null), e);
  }
  function it(e) {
    gt.trackingDerivation = e;
  }
  function st(e) {
    var t = gt.allowStateReads;
    return ((gt.allowStateReads = e), t);
  }
  function lt(e) {
    gt.allowStateReads = e;
  }
  function ct(e) {
    if (e.dependenciesState_ !== Xe.UP_TO_DATE_) {
      e.dependenciesState_ = Xe.UP_TO_DATE_;
      for (var t = e.observing_, n = t.length; n--; )
        t[n].lowestObserverState_ = Xe.UP_TO_DATE_;
    }
  }
  var ut = function () {
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
    dt = !0,
    pt = !1,
    gt = (function () {
      var e = r();
      return (
        e.__mobxInstanceCount > 0 && !e.__mobxGlobals && (dt = !1),
        e.__mobxGlobals &&
          e.__mobxGlobals.version !== new ut().version &&
          (dt = !1),
        dt
          ? e.__mobxGlobals
            ? ((e.__mobxInstanceCount += 1),
              e.__mobxGlobals.UNCHANGED || (e.__mobxGlobals.UNCHANGED = {}),
              e.__mobxGlobals)
            : ((e.__mobxInstanceCount = 1), (e.__mobxGlobals = new ut()))
          : (setTimeout(function () {
              pt || t(35);
            }, 1),
            new ut())
      );
    })();
  function ht(e, t) {
    (e.observers_.add(t),
      e.lowestObserverState_ > t.dependenciesState_ &&
        (e.lowestObserverState_ = t.dependenciesState_));
  }
  function ft(e, t) {
    (e.observers_.delete(t), 0 === e.observers_.size && mt(e));
  }
  function mt(e) {
    !1 === e.isPendingUnobservation_ &&
      ((e.isPendingUnobservation_ = !0), gt.pendingUnobservations.push(e));
  }
  function vt() {
    gt.inBatch++;
  }
  function yt() {
    if (0 == --gt.inBatch) {
      Tt();
      for (var e = gt.pendingUnobservations, t = 0; t < e.length; t++) {
        var n = e[t];
        ((n.isPendingUnobservation_ = !1),
          0 === n.observers_.size &&
            (n.isBeingObserved_ && ((n.isBeingObserved_ = !1), n.onBUO()),
            n instanceof Ze && n.suspend_()));
      }
      gt.pendingUnobservations = [];
    }
  }
  function bt(e) {
    var t = gt.trackingDerivation;
    return null !== t
      ? (t.runId_ !== e.lastAccessedBy_ &&
          ((e.lastAccessedBy_ = t.runId_),
          (t.newObserving_[t.unboundDepsCount_++] = e),
          !e.isBeingObserved_ &&
            gt.trackingContext &&
            ((e.isBeingObserved_ = !0), e.onBO())),
        e.isBeingObserved_)
      : (0 === e.observers_.size && gt.inBatch > 0 && mt(e), !1);
  }
  function xt(e) {
    e.lowestObserverState_ !== Xe.STALE_ &&
      ((e.lowestObserverState_ = Xe.STALE_),
      e.observers_.forEach(function (e) {
        (e.dependenciesState_ === Xe.UP_TO_DATE_ && e.onBecomeStale_(),
          (e.dependenciesState_ = Xe.STALE_));
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
        (this.dependenciesState_ = Xe.NOT_TRACKING_),
        (this.diffValue_ = 0),
        (this.runId_ = 0),
        (this.unboundDepsCount_ = 0),
        (this.isDisposed_ = !1),
        (this.isScheduled_ = !1),
        (this.isTrackPending_ = !1),
        (this.isRunning_ = !1),
        (this.isTracing_ = Ke.NONE),
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
          ((this.isScheduled_ = !0), gt.pendingReactions.push(this), Tt());
      }),
      (t.isScheduled = function () {
        return this.isScheduled_;
      }),
      (t.runReaction_ = function () {
        if (!this.isDisposed_) {
          (vt(), (this.isScheduled_ = !1));
          var e = gt.trackingContext;
          if (((gt.trackingContext = this), et(this))) {
            this.isTrackPending_ = !0;
            try {
              this.onInvalidate_();
            } catch (e) {
              this.reportExceptionInDerivation_(e);
            }
          }
          ((gt.trackingContext = e), yt());
        }
      }),
      (t.track = function (e) {
        if (!this.isDisposed_) {
          vt();
          (0, (this.isRunning_ = !0));
          var t = gt.trackingContext;
          gt.trackingContext = this;
          var n = nt(this, e, void 0);
          ((gt.trackingContext = t),
            (this.isRunning_ = !1),
            (this.isTrackPending_ = !1),
            this.isDisposed_ && rt(this),
            Qe(n) && this.reportExceptionInDerivation_(n.cause),
            yt());
        }
      }),
      (t.reportExceptionInDerivation_ = function (e) {
        var t = this;
        if (this.errorHandler_) this.errorHandler_(e, this);
        else {
          if (gt.disableErrorBoundaries) throw e;
          (gt.suppressReactionErrors,
            gt.globalReactionErrorHandlers.forEach(function (n) {
              return n(e, t);
            }));
        }
      }),
      (t.dispose = function () {
        this.isDisposed_ ||
          ((this.isDisposed_ = !0), this.isRunning_ || (vt(), rt(this), yt()));
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
  function Tt() {
    gt.inBatch > 0 || gt.isRunningReactions || kt(_t);
  }
  function _t() {
    gt.isRunningReactions = !0;
    for (var e = gt.pendingReactions, t = 0; e.length > 0; ) {
      ++t === St && e.splice(0);
      for (var n = e.splice(0), r = 0, o = n.length; r < o; r++)
        n[r].runReaction_();
    }
    gt.isRunningReactions = !1;
  }
  var Ct = S("Reaction", wt);
  var Et = "action",
    Pt = "autoAction",
    Ot = "<unnamed action>",
    Mt = Z(Et),
    Lt = Z("action.bound", { bound: !0 }),
    zt = Z(Pt, { autoAction: !0 }),
    Nt = Z("autoAction.bound", { autoAction: !0, bound: !0 });
  function At(e) {
    return function (t, n) {
      return f(t)
        ? Fe(t.name || Ot, t, e)
        : f(n)
          ? Fe(t, n, e)
          : F(n)
            ? (e ? zt : Mt).decorate_20223_(t, n)
            : m(n)
              ? R(t, n, e ? zt : Mt)
              : m(t)
                ? I(Z(e ? Pt : Et, { name: t, autoAction: e }))
                : void 0;
    };
  }
  var Dt = At(!1);
  Object.assign(Dt, Mt);
  var Vt = At(!0);
  function Bt(e) {
    return f(e) && !0 === e.isMobxAction;
  }
  function jt(e, t) {
    var n, r, o, a, i;
    void 0 === t && (t = c);
    var s,
      l = null != (n = null == (r = t) ? void 0 : r.name) ? n : "Autorun";
    if (!t.scheduler && !t.delay)
      s = new wt(
        l,
        function () {
          this.track(p);
        },
        t.onError,
        t.requiresObservable,
      );
    else {
      var u = Rt(t),
        d = !1;
      s = new wt(
        l,
        function () {
          d ||
            ((d = !0),
            u(function () {
              ((d = !1), s.isDisposed_ || s.track(p));
            }));
        },
        t.onError,
        t.requiresObservable,
      );
    }
    function p() {
      e(s);
    }
    return (
      (null != (o = t) && null != (a = o.signal) && a.aborted) || s.schedule_(),
      s.getDisposer_(null == (i = t) ? void 0 : i.signal)
    );
  }
  (Object.assign(Vt, zt), (Dt.bound = I(Lt)), (Vt.bound = I(Nt)));
  var It = function (e) {
    return e();
  };
  function Rt(e) {
    return e.scheduler
      ? e.scheduler
      : e.delay
        ? function (t) {
            return setTimeout(t, e.delay);
          }
        : It;
  }
  var Ft = "onBO",
    qt = "onBUO";
  function Ht(e, t, n) {
    return Ut(qt, e, t, n);
  }
  function Ut(e, t, n, r) {
    var o = "function" == typeof r ? or(t, n) : or(t),
      a = f(r) ? r : n,
      i = e + "L";
    return (
      o[i] ? o[i].add(a) : (o[i] = new Set([a])),
      function () {
        var e = o[i];
        e && (e.delete(a), 0 === e.size && delete o[i]);
      }
    );
  }
  function Wt(e, t, n, r) {
    var o = O(t);
    return (
      sr(function () {
        var t = Fn(e, r)[q];
        C(o).forEach(function (e) {
          t.extend_(e, o[e], !n || !(e in n) || n[e]);
        });
      }),
      e
    );
  }
  var Yt = 0;
  function Gt() {
    this.message = "FLOW_CANCELLED";
  }
  Gt.prototype = Object.create(Error.prototype);
  var Xt = te("flow"),
    Kt = te("flow.bound", { bound: !0 }),
    Zt = Object.assign(function (e, t) {
      if (F(t)) return Xt.decorate_20223_(e, t);
      if (m(t)) return R(e, t, Xt);
      var n = e,
        r = n.name || "<unnamed flow>",
        o = function () {
          var e,
            t = arguments,
            o = ++Yt,
            a = Dt(r + " - runid: " + o + " - init", n).apply(this, t),
            i = void 0,
            s = new Promise(function (t, n) {
              var s = 0;
              function l(e) {
                var t;
                i = void 0;
                try {
                  t = Dt(r + " - runid: " + o + " - yield " + s++, a.next).call(
                    a,
                    e,
                  );
                } catch (e) {
                  return n(e);
                }
                u(t);
              }
              function c(e) {
                var t;
                i = void 0;
                try {
                  t = Dt(
                    r + " - runid: " + o + " - yield " + s++,
                    a.throw,
                  ).call(a, e);
                } catch (e) {
                  return n(e);
                }
                u(t);
              }
              function u(e) {
                if (!f(null == e ? void 0 : e.then))
                  return e.done
                    ? t(e.value)
                    : (i = Promise.resolve(e.value)).then(l, c);
                e.then(u, n);
              }
              ((e = n), l(void 0));
            });
          return (
            (s.cancel = Dt(r + " - runid: " + o + " - cancel", function () {
              try {
                i && Jt(i);
                var t = a.return(void 0),
                  n = Promise.resolve(t.value);
                (n.then(h, h), Jt(n), e(new Gt()));
              } catch (t) {
                e(t);
              }
            })),
            s
          );
        };
      return ((o.isMobXFlow = !0), o);
    }, Xt);
  function Jt(e) {
    f(e.cancel) && e.cancel();
  }
  function $t(e) {
    return !0 === (null == e ? void 0 : e.isMobXFlow);
  }
  function Qt(e, t) {
    return (
      !!e &&
      (void 0 !== t
        ? !!Un(e) && e[q].values_.has(t)
        : Un(e) || !!e[q] || U(e) || Ct(e) || Je(e))
    );
  }
  function en(e) {
    return Qt(e);
  }
  function tn(e, t, n) {
    return (e.set(t, n), n);
  }
  function nn(e, n) {
    if (null == e || "object" != typeof e || e instanceof Date || !en(e))
      return e;
    if (Ge(e) || Je(e)) return nn(e.get(), n);
    if (n.has(e)) return n.get(e);
    if (En(e)) {
      var r = tn(n, e, new Array(e.length));
      return (
        e.forEach(function (e, t) {
          r[t] = nn(e, n);
        }),
        r
      );
    }
    if (Bn(e)) {
      var o = tn(n, e, new Set());
      return (
        e.forEach(function (e) {
          o.add(nn(e, n));
        }),
        o
      );
    }
    if (An(e)) {
      var a = tn(n, e, new Map());
      return (
        e.forEach(function (e, t) {
          a.set(t, nn(e, n));
        }),
        a
      );
    }
    var i = tn(n, e, {});
    return (
      (function (e) {
        if (Un(e)) return e[q].ownKeys_();
        t(38);
      })(e).forEach(function (t) {
        s.propertyIsEnumerable.call(e, t) && (i[t] = nn(e[t], n));
      }),
      i
    );
  }
  function rn(e, t) {
    (void 0 === t && (t = void 0), vt());
    try {
      return e.apply(t);
    } finally {
      yt();
    }
  }
  function on(e) {
    return e[q];
  }
  Zt.bound = I(Kt);
  var an = {
    has: function (e, t) {
      return on(e).has_(t);
    },
    get: function (e, t) {
      return on(e).get_(t);
    },
    set: function (e, t, n) {
      var r;
      return !!m(t) && (null == (r = on(e).set_(t, n, !0)) || r);
    },
    deleteProperty: function (e, t) {
      var n;
      return !!m(t) && (null == (n = on(e).delete_(t, !0)) || n);
    },
    defineProperty: function (e, t, n) {
      var r;
      return null == (r = on(e).defineProperty_(t, n)) || r;
    },
    ownKeys: function (e) {
      return on(e).ownKeys_();
    },
    preventExtensions: function (e) {
      t(13);
    },
  };
  function sn(e) {
    return void 0 !== e.interceptors_ && e.interceptors_.length > 0;
  }
  function ln(e, t) {
    var n = e.interceptors_ || (e.interceptors_ = []);
    return (
      n.push(t),
      g(function () {
        var e = n.indexOf(t);
        -1 !== e && n.splice(e, 1);
      })
    );
  }
  function cn(e, n) {
    var r = at();
    try {
      for (
        var o = [].concat(e.interceptors_ || []), a = 0, i = o.length;
        a < i && ((n = o[a](n)) && !n.type && t(14), n);
        a++
      );
      return n;
    } finally {
      it(r);
    }
  }
  function un(e) {
    return void 0 !== e.changeListeners_ && e.changeListeners_.length > 0;
  }
  function dn(e, t) {
    var n = e.changeListeners_ || (e.changeListeners_ = []);
    return (
      n.push(t),
      g(function () {
        var e = n.indexOf(t);
        -1 !== e && n.splice(e, 1);
      })
    );
  }
  function pn(e, t) {
    var n = at(),
      r = e.changeListeners_;
    if (r) {
      for (var o = 0, a = (r = r.slice()).length; o < a; o++) r[o](t);
      it(n);
    }
  }
  var gn = Symbol("mobx-keys");
  var hn = "splice",
    fn = "update",
    mn = {
      get: function (e, t) {
        var n = e[q];
        return t === q
          ? n
          : "length" === t
            ? n.getArrayLength_()
            : "string" != typeof t || isNaN(t)
              ? P(bn, t)
                ? bn[t]
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
        t(15);
      },
    },
    vn = (function () {
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
      var n = e.prototype;
      return (
        (n.dehanceValue_ = function (e) {
          return void 0 !== this.dehancer ? this.dehancer(e) : e;
        }),
        (n.dehanceValues_ = function (e) {
          return void 0 !== this.dehancer && e.length > 0
            ? e.map(this.dehancer)
            : e;
        }),
        (n.intercept_ = function (e) {
          return ln(this, e);
        }),
        (n.observe_ = function (e, t) {
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
        (n.getArrayLength_ = function () {
          return (this.atom_.reportObserved(), this.values_.length);
        }),
        (n.setArrayLength_ = function (e) {
          ("number" != typeof e || isNaN(e) || e < 0) &&
            t("Out of range: " + e);
          var n = this.values_.length;
          if (e !== n)
            if (e > n) {
              for (var r = new Array(e - n), o = 0; o < e - n; o++)
                r[o] = void 0;
              this.spliceWithArray_(n, 0, r);
            } else this.spliceWithArray_(e, n - e);
        }),
        (n.updateArrayLength_ = function (e, n) {
          (e !== this.lastKnownLength_ && t(16),
            (this.lastKnownLength_ += n),
            this.legacyMode_ && n > 0 && nr(e + n + 1));
        }),
        (n.spliceWithArray_ = function (e, t, n) {
          var r = this;
          this.atom_;
          var o = this.values_.length;
          if (
            (void 0 === e
              ? (e = 0)
              : e > o
                ? (e = o)
                : e < 0 && (e = Math.max(0, o + e)),
            (t =
              1 === arguments.length
                ? o - e
                : null == t
                  ? 0
                  : Math.max(0, Math.min(t, o - e))),
            void 0 === n && (n = l),
            sn(this))
          ) {
            var a = cn(this, {
              object: this.proxy_,
              type: hn,
              index: e,
              removedCount: t,
              added: n,
            });
            if (!a) return l;
            ((t = a.removedCount), (n = a.added));
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
            var i = n.length - t;
            this.updateArrayLength_(o, i);
          }
          var s = this.spliceItemsIntoValues_(e, t, n);
          return (
            (0 === t && 0 === n.length) || this.notifyArraySplice_(e, n, s),
            this.dehanceValues_(s)
          );
        }),
        (n.spliceItemsIntoValues_ = function (e, t, n) {
          var r;
          if (n.length < 1e4)
            return (r = this.values_).splice.apply(r, [e, t].concat(n));
          var o = this.values_.slice(e, e + t),
            a = this.values_.slice(e + t);
          this.values_.length += n.length - t;
          for (var i = 0; i < n.length; i++) this.values_[e + i] = n[i];
          for (var s = 0; s < a.length; s++)
            this.values_[e + n.length + s] = a[s];
          return o;
        }),
        (n.notifyArrayChildUpdate_ = function (e, t, n) {
          var r = !this.owned_ && !1,
            o = un(this),
            a =
              o || r
                ? {
                    observableKind: "array",
                    object: this.proxy_,
                    type: fn,
                    debugObjectName: this.atom_.name_,
                    index: e,
                    newValue: t,
                    oldValue: n,
                  }
                : null;
          (this.atom_.reportChanged(), o && pn(this, a));
        }),
        (n.notifyArraySplice_ = function (e, t, n) {
          var r = !this.owned_ && !1,
            o = un(this),
            a =
              o || r
                ? {
                    observableKind: "array",
                    object: this.proxy_,
                    debugObjectName: this.atom_.name_,
                    type: hn,
                    index: e,
                    removed: n,
                    added: t,
                    removedCount: n.length,
                    addedCount: t.length,
                  }
                : null;
          (this.atom_.reportChanged(), o && pn(this, a));
        }),
        (n.get_ = function (e) {
          if (!(this.legacyMode_ && e >= this.values_.length))
            return (
              this.atom_.reportObserved(),
              this.dehanceValue_(this.values_[e])
            );
        }),
        (n.set_ = function (e, n) {
          var r = this.values_;
          if (
            (this.legacyMode_ && e > r.length && t(17, e, r.length),
            e < r.length)
          ) {
            this.atom_;
            var o = r[e];
            if (sn(this)) {
              var a = cn(this, {
                type: fn,
                object: this.proxy_,
                index: e,
                newValue: n,
              });
              if (!a) return;
              n = a.newValue;
            }
            (n = this.enhancer_(n, o)) !== o &&
              ((r[e] = n), this.notifyArrayChildUpdate_(e, n, o));
          } else {
            for (
              var i = new Array(e + 1 - r.length), s = 0;
              s < i.length - 1;
              s++
            )
              i[s] = void 0;
            ((i[i.length - 1] = n), this.spliceWithArray_(r.length, 0, i));
          }
        }),
        e
      );
    })();
  function yn(e, t, n, r) {
    return (
      void 0 === n && (n = "ObservableArray"),
      void 0 === r && (r = !1),
      p(),
      sr(function () {
        var o = new vn(n, t, r, !1);
        w(o.values_, q, o);
        var a = new Proxy(o.values_, mn);
        return (
          (o.proxy_ = a),
          e && e.length && o.spliceWithArray_(0, 0, e),
          a
        );
      })
    );
  }
  var bn = {
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
        var n = arguments.length, r = new Array(n > 2 ? n - 2 : 0), o = 2;
        o < n;
        o++
      )
        r[o - 2] = arguments[o];
      var a = this[q];
      switch (arguments.length) {
        case 0:
          return [];
        case 1:
          return a.spliceWithArray_(e);
        case 2:
          return a.spliceWithArray_(e, t);
      }
      return a.spliceWithArray_(e, t, r);
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
        gt.trackingDerivation && t(37, "reverse"),
        this.replace(this.slice().reverse()),
        this
      );
    },
    sort: function () {
      gt.trackingDerivation && t(37, "sort");
      var e = this.slice();
      return (e.sort.apply(e, arguments), this.replace(e), this);
    },
    remove: function (e) {
      var t = this[q],
        n = t.dehanceValues_(t.values_).indexOf(e);
      return n > -1 && (this.splice(n, 1), !0);
    },
  };
  function xn(e, t) {
    "function" == typeof Array.prototype[e] && (bn[e] = t(e));
  }
  function wn(e) {
    return function () {
      var t = this[q];
      t.atom_.reportObserved();
      var n = t.dehanceValues_(t.values_);
      return n[e].apply(n, arguments);
    };
  }
  function Sn(e) {
    return function (t, n) {
      var r = this,
        o = this[q];
      return (
        o.atom_.reportObserved(),
        o.dehanceValues_(o.values_)[e](function (e, o) {
          return t.call(n, e, o, r);
        })
      );
    };
  }
  function kn(e) {
    return function () {
      var t = this,
        n = this[q];
      n.atom_.reportObserved();
      var r = n.dehanceValues_(n.values_),
        o = arguments[0];
      return (
        (arguments[0] = function (e, n, r) {
          return o(e, n, r, t);
        }),
        r[e].apply(r, arguments)
      );
    };
  }
  (xn("at", wn),
    xn("concat", wn),
    xn("flat", wn),
    xn("includes", wn),
    xn("indexOf", wn),
    xn("join", wn),
    xn("lastIndexOf", wn),
    xn("slice", wn),
    xn("toString", wn),
    xn("toLocaleString", wn),
    xn("toSorted", wn),
    xn("toSpliced", wn),
    xn("with", wn),
    xn("every", Sn),
    xn("filter", Sn),
    xn("find", Sn),
    xn("findIndex", Sn),
    xn("findLast", Sn),
    xn("findLastIndex", Sn),
    xn("flatMap", Sn),
    xn("forEach", Sn),
    xn("map", Sn),
    xn("some", Sn),
    xn("toReversed", Sn),
    xn("reduce", kn),
    xn("reduceRight", kn));
  var Tn,
    _n,
    Cn = S("ObservableArrayAdministration", vn);
  function En(e) {
    return v(e) && Cn(e[q]);
  }
  var Pn = {},
    On = "add",
    Mn = "delete";
  ((Tn = Symbol.iterator), (_n = Symbol.toStringTag));
  var Ln,
    zn,
    Nn = (function () {
      function e(e, n, r) {
        var o = this;
        (void 0 === n && (n = G),
          void 0 === r && (r = "ObservableMap"),
          (this.enhancer_ = void 0),
          (this.name_ = void 0),
          (this[q] = Pn),
          (this.data_ = void 0),
          (this.hasMap_ = void 0),
          (this.keysAtom_ = void 0),
          (this.interceptors_ = void 0),
          (this.changeListeners_ = void 0),
          (this.dehancer = void 0),
          (this.enhancer_ = n),
          (this.name_ = r),
          f(Map) || t(18),
          sr(function () {
            ((o.keysAtom_ = W("ObservableMap.keys()")),
              (o.data_ = new Map()),
              (o.hasMap_ = new Map()),
              e && o.merge(e));
          }));
      }
      var n = e.prototype;
      return (
        (n.has_ = function (e) {
          return this.data_.has(e);
        }),
        (n.has = function (e) {
          var t = this;
          if (!gt.trackingDerivation) return this.has_(e);
          var n = this.hasMap_.get(e);
          if (!n) {
            var r = (n = new Ye(this.has_(e), X, "ObservableMap.key?", !1));
            (this.hasMap_.set(e, r),
              Ht(r, function () {
                return t.hasMap_.delete(e);
              }));
          }
          return n.get();
        }),
        (n.set = function (e, t) {
          var n = this.has_(e);
          if (sn(this)) {
            var r = cn(this, {
              type: n ? fn : On,
              object: this,
              newValue: t,
              name: e,
            });
            if (!r) return this;
            t = r.newValue;
          }
          return (n ? this.updateValue_(e, t) : this.addValue_(e, t), this);
        }),
        (n.delete = function (e) {
          var t = this;
          if (
            (this.keysAtom_, sn(this)) &&
            !cn(this, { type: Mn, object: this, name: e })
          )
            return !1;
          if (this.has_(e)) {
            var n = un(this),
              r = n
                ? {
                    observableKind: "map",
                    debugObjectName: this.name_,
                    type: Mn,
                    object: this,
                    oldValue: this.data_.get(e).value_,
                    name: e,
                  }
                : null;
            return (
              rn(function () {
                var n;
                (t.keysAtom_.reportChanged(),
                  null == (n = t.hasMap_.get(e)) || n.setNewValue_(!1),
                  t.data_.get(e).setNewValue_(void 0),
                  t.data_.delete(e));
              }),
              n && pn(this, r),
              !0
            );
          }
          return !1;
        }),
        (n.updateValue_ = function (e, t) {
          var n = this.data_.get(e);
          if ((t = n.prepareNewValue_(t)) !== gt.UNCHANGED) {
            var r = un(this),
              o = r
                ? {
                    observableKind: "map",
                    debugObjectName: this.name_,
                    type: fn,
                    object: this,
                    oldValue: n.value_,
                    name: e,
                    newValue: t,
                  }
                : null;
            (0, n.setNewValue_(t), r && pn(this, o));
          }
        }),
        (n.addValue_ = function (e, t) {
          var n = this;
          (this.keysAtom_,
            rn(function () {
              var r,
                o = new Ye(t, n.enhancer_, "ObservableMap.key", !1);
              (n.data_.set(e, o),
                (t = o.value_),
                null == (r = n.hasMap_.get(e)) || r.setNewValue_(!0),
                n.keysAtom_.reportChanged());
            }));
          var r = un(this),
            o = r
              ? {
                  observableKind: "map",
                  debugObjectName: this.name_,
                  type: On,
                  object: this,
                  name: e,
                  newValue: t,
                }
              : null;
          r && pn(this, o);
        }),
        (n.get = function (e) {
          return this.has(e)
            ? this.dehanceValue_(this.data_.get(e).get())
            : this.dehanceValue_(void 0);
        }),
        (n.dehanceValue_ = function (e) {
          return void 0 !== this.dehancer ? this.dehancer(e) : e;
        }),
        (n.keys = function () {
          return (this.keysAtom_.reportObserved(), this.data_.keys());
        }),
        (n.values = function () {
          var e = this,
            t = this.keys();
          return pr({
            next: function () {
              var n = t.next(),
                r = n.done,
                o = n.value;
              return { done: r, value: r ? void 0 : e.get(o) };
            },
          });
        }),
        (n.entries = function () {
          var e = this,
            t = this.keys();
          return pr({
            next: function () {
              var n = t.next(),
                r = n.done,
                o = n.value;
              return { done: r, value: r ? void 0 : [o, e.get(o)] };
            },
          });
        }),
        (n[Tn] = function () {
          return this.entries();
        }),
        (n.forEach = function (e, t) {
          for (var n, r = B(this); !(n = r()).done; ) {
            var o = n.value,
              a = o[0],
              i = o[1];
            e.call(t, i, a, this);
          }
        }),
        (n.merge = function (e) {
          var n = this;
          return (
            An(e) && (e = new Map(e)),
            rn(function () {
              y(e)
                ? (function (e) {
                    var t = Object.keys(e);
                    if (!_) return t;
                    var n = Object.getOwnPropertySymbols(e);
                    return n.length
                      ? [].concat(
                          t,
                          n.filter(function (t) {
                            return s.propertyIsEnumerable.call(e, t);
                          }),
                        )
                      : t;
                  })(e).forEach(function (t) {
                    return n.set(t, e[t]);
                  })
                : Array.isArray(e)
                  ? e.forEach(function (e) {
                      var t = e[0],
                        r = e[1];
                      return n.set(t, r);
                    })
                  : k(e)
                    ? (e.constructor !== Map && t(19, e),
                      e.forEach(function (e, t) {
                        return n.set(t, e);
                      }))
                    : null != e && t(20, e);
            }),
            this
          );
        }),
        (n.clear = function () {
          var e = this;
          rn(function () {
            ot(function () {
              for (var t, n = B(e.keys()); !(t = n()).done; ) {
                var r = t.value;
                e.delete(r);
              }
            });
          });
        }),
        (n.replace = function (e) {
          var n = this;
          return (
            rn(function () {
              for (
                var r,
                  o = (function (e) {
                    if (k(e) || An(e)) return e;
                    if (Array.isArray(e)) return new Map(e);
                    if (y(e)) {
                      var n = new Map();
                      for (var r in e) n.set(r, e[r]);
                      return n;
                    }
                    return t(21, e);
                  })(e),
                  a = new Map(),
                  i = !1,
                  s = B(n.data_.keys());
                !(r = s()).done;
              ) {
                var l = r.value;
                if (!o.has(l))
                  if (n.delete(l)) i = !0;
                  else {
                    var c = n.data_.get(l);
                    a.set(l, c);
                  }
              }
              for (var u, d = B(o.entries()); !(u = d()).done; ) {
                var p = u.value,
                  g = p[0],
                  h = p[1],
                  f = n.data_.has(g);
                if ((n.set(g, h), n.data_.has(g))) {
                  var m = n.data_.get(g);
                  (a.set(g, m), f || (i = !0));
                }
              }
              if (!i)
                if (n.data_.size !== a.size) n.keysAtom_.reportChanged();
                else
                  for (
                    var v = n.data_.keys(),
                      b = a.keys(),
                      x = v.next(),
                      w = b.next();
                    !x.done;
                  ) {
                    if (x.value !== w.value) {
                      n.keysAtom_.reportChanged();
                      break;
                    }
                    ((x = v.next()), (w = b.next()));
                  }
              n.data_ = a;
            }),
            this
          );
        }),
        (n.toString = function () {
          return "[object ObservableMap]";
        }),
        (n.toJSON = function () {
          return Array.from(this);
        }),
        (n.observe_ = function (e, t) {
          return dn(this, e);
        }),
        (n.intercept_ = function (e) {
          return ln(this, e);
        }),
        L(e, [
          {
            key: "size",
            get: function () {
              return (this.keysAtom_.reportObserved(), this.data_.size);
            },
          },
          {
            key: _n,
            get: function () {
              return "Map";
            },
          },
        ]),
        e
      );
    })(),
    An = S("ObservableMap", Nn);
  var Dn = {};
  ((Ln = Symbol.iterator), (zn = Symbol.toStringTag));
  var Vn = (function () {
      function e(e, n, r) {
        var o = this;
        (void 0 === n && (n = G),
          void 0 === r && (r = "ObservableSet"),
          (this.name_ = void 0),
          (this[q] = Dn),
          (this.data_ = new Set()),
          (this.atom_ = void 0),
          (this.changeListeners_ = void 0),
          (this.interceptors_ = void 0),
          (this.dehancer = void 0),
          (this.enhancer_ = void 0),
          (this.name_ = r),
          f(Set) || t(22),
          (this.enhancer_ = function (e, t) {
            return n(e, t, r);
          }),
          sr(function () {
            ((o.atom_ = W(o.name_)), e && o.replace(e));
          }));
      }
      var n = e.prototype;
      return (
        (n.dehanceValue_ = function (e) {
          return void 0 !== this.dehancer ? this.dehancer(e) : e;
        }),
        (n.clear = function () {
          var e = this;
          rn(function () {
            ot(function () {
              for (var t, n = B(e.data_.values()); !(t = n()).done; ) {
                var r = t.value;
                e.delete(r);
              }
            });
          });
        }),
        (n.forEach = function (e, t) {
          for (var n, r = B(this); !(n = r()).done; ) {
            var o = n.value;
            e.call(t, o, o, this);
          }
        }),
        (n.add = function (e) {
          var t = this;
          if (
            (this.atom_, sn(this)) &&
            !cn(this, { type: On, object: this, newValue: e })
          )
            return this;
          if (!this.has(e)) {
            rn(function () {
              (t.data_.add(t.enhancer_(e, void 0)), t.atom_.reportChanged());
            });
            var n = !1,
              r = un(this),
              o = r
                ? {
                    observableKind: "set",
                    debugObjectName: this.name_,
                    type: On,
                    object: this,
                    newValue: e,
                  }
                : null;
            (n, r && pn(this, o));
          }
          return this;
        }),
        (n.delete = function (e) {
          var t = this;
          if (sn(this) && !cn(this, { type: Mn, object: this, oldValue: e }))
            return !1;
          if (this.has(e)) {
            var n = un(this),
              r = n
                ? {
                    observableKind: "set",
                    debugObjectName: this.name_,
                    type: Mn,
                    object: this,
                    oldValue: e,
                  }
                : null;
            return (
              rn(function () {
                (t.atom_.reportChanged(), t.data_.delete(e));
              }),
              n && pn(this, r),
              !0
            );
          }
          return !1;
        }),
        (n.has = function (e) {
          return (
            this.atom_.reportObserved(),
            this.data_.has(this.dehanceValue_(e))
          );
        }),
        (n.entries = function () {
          var e = 0,
            t = Array.from(this.keys()),
            n = Array.from(this.values());
          return pr({
            next: function () {
              var r = e;
              return (
                (e += 1),
                r < n.length ? { value: [t[r], n[r]], done: !1 } : { done: !0 }
              );
            },
          });
        }),
        (n.keys = function () {
          return this.values();
        }),
        (n.values = function () {
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
        (n.replace = function (e) {
          var n = this;
          return (
            Bn(e) && (e = new Set(e)),
            rn(function () {
              Array.isArray(e) || T(e)
                ? (n.clear(),
                  e.forEach(function (e) {
                    return n.add(e);
                  }))
                : null != e && t("Cannot initialize set from " + e);
            }),
            this
          );
        }),
        (n.observe_ = function (e, t) {
          return dn(this, e);
        }),
        (n.intercept_ = function (e) {
          return ln(this, e);
        }),
        (n.toJSON = function () {
          return Array.from(this);
        }),
        (n.toString = function () {
          return "[object ObservableSet]";
        }),
        (n[Ln] = function () {
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
            key: zn,
            get: function () {
              return "Set";
            },
          },
        ]),
        e
      );
    })(),
    Bn = S("ObservableSet", Vn),
    jn = Object.create(null),
    In = "remove",
    Rn = (function () {
      function e(e, t, n, r) {
        (void 0 === t && (t = new Map()),
          void 0 === r && (r = fe),
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
          (this.isPlainObject_ = y(this.target_)));
      }
      var n = e.prototype;
      return (
        (n.getObservablePropValue_ = function (e) {
          return this.values_.get(e).get();
        }),
        (n.setObservablePropValue_ = function (e, t) {
          var n = this.values_.get(e);
          if (n instanceof Ze) return (n.set(t), !0);
          if (sn(this)) {
            var r = cn(this, {
              type: fn,
              object: this.proxy_ || this.target_,
              name: e,
              newValue: t,
            });
            if (!r) return null;
            t = r.newValue;
          }
          if ((t = n.prepareNewValue_(t)) !== gt.UNCHANGED) {
            var o = un(this),
              a = o
                ? {
                    type: fn,
                    observableKind: "object",
                    debugObjectName: this.name_,
                    object: this.proxy_ || this.target_,
                    oldValue: n.value_,
                    name: e,
                    newValue: t,
                  }
                : null;
            (0, n.setNewValue_(t), o && pn(this, a));
          }
          return !0;
        }),
        (n.get_ = function (e) {
          return (
            gt.trackingDerivation && !P(this.target_, e) && this.has_(e),
            this.target_[e]
          );
        }),
        (n.set_ = function (e, t, n) {
          return (
            void 0 === n && (n = !1),
            P(this.target_, e)
              ? this.values_.has(e)
                ? this.setObservablePropValue_(e, t)
                : n
                  ? Reflect.set(this.target_, e, t)
                  : ((this.target_[e] = t), !0)
              : this.extend_(
                  e,
                  { value: t, enumerable: !0, writable: !0, configurable: !0 },
                  this.defaultAnnotation_,
                  n,
                )
          );
        }),
        (n.has_ = function (e) {
          if (!gt.trackingDerivation) return e in this.target_;
          this.pendingKeys_ || (this.pendingKeys_ = new Map());
          var t = this.pendingKeys_.get(e);
          return (
            t ||
              ((t = new Ye(e in this.target_, X, "ObservableObject.key?", !1)),
              this.pendingKeys_.set(e, t)),
            t.get()
          );
        }),
        (n.make_ = function (e, n) {
          if ((!0 === n && (n = this.defaultAnnotation_), !1 !== n)) {
            if ((Yn(this, n, e), !(e in this.target_))) {
              var r;
              if (null != (r = this.target_[j]) && r[e]) return;
              t(1, n.annotationType_, this.name_ + "." + e.toString());
            }
            for (var o = this.target_; o && o !== s; ) {
              var i = a(o, e);
              if (i) {
                var l = n.make_(this, e, i, o);
                if (0 === l) return;
                if (1 === l) break;
              }
              o = Object.getPrototypeOf(o);
            }
            Wn(this, n, e);
          }
        }),
        (n.extend_ = function (e, t, n, r) {
          if (
            (void 0 === r && (r = !1),
            !0 === n && (n = this.defaultAnnotation_),
            !1 === n)
          )
            return this.defineProperty_(e, t, r);
          Yn(this, n, e);
          var o = n.extend_(this, e, t, r);
          return (o && Wn(this, n, e), o);
        }),
        (n.defineProperty_ = function (e, t, n) {
          (void 0 === n && (n = !1), this.keysAtom_);
          try {
            vt();
            var r = this.delete_(e);
            if (!r) return r;
            if (sn(this)) {
              var o = cn(this, {
                object: this.proxy_ || this.target_,
                name: e,
                type: On,
                newValue: t.value,
              });
              if (!o) return null;
              var a = o.newValue;
              t.value !== a && (t = z({}, t, { value: a }));
            }
            if (n) {
              if (!Reflect.defineProperty(this.target_, e, t)) return !1;
            } else i(this.target_, e, t);
            this.notifyPropertyAddition_(e, t.value);
          } finally {
            yt();
          }
          return !0;
        }),
        (n.defineObservableProperty_ = function (e, t, n, r) {
          (void 0 === r && (r = !1), this.keysAtom_);
          try {
            vt();
            var o = this.delete_(e);
            if (!o) return o;
            if (sn(this)) {
              var a = cn(this, {
                object: this.proxy_ || this.target_,
                name: e,
                type: On,
                newValue: t,
              });
              if (!a) return null;
              t = a.newValue;
            }
            var s = Hn(e),
              l = {
                configurable: !gt.safeDescriptors || this.isPlainObject_,
                enumerable: !0,
                get: s.get,
                set: s.set,
              };
            if (r) {
              if (!Reflect.defineProperty(this.target_, e, l)) return !1;
            } else i(this.target_, e, l);
            var c = new Ye(t, n, "ObservableObject.key", !1);
            (this.values_.set(e, c), this.notifyPropertyAddition_(e, c.value_));
          } finally {
            yt();
          }
          return !0;
        }),
        (n.defineComputedProperty_ = function (e, t, n) {
          (void 0 === n && (n = !1), this.keysAtom_);
          try {
            vt();
            var r = this.delete_(e);
            if (!r) return r;
            if (sn(this))
              if (
                !cn(this, {
                  object: this.proxy_ || this.target_,
                  name: e,
                  type: On,
                  newValue: void 0,
                })
              )
                return null;
            (t.name || (t.name = "ObservableObject.key"),
              (t.context = this.proxy_ || this.target_));
            var o = Hn(e),
              a = {
                configurable: !gt.safeDescriptors || this.isPlainObject_,
                enumerable: !1,
                get: o.get,
                set: o.set,
              };
            if (n) {
              if (!Reflect.defineProperty(this.target_, e, a)) return !1;
            } else i(this.target_, e, a);
            (this.values_.set(e, new Ze(t)),
              this.notifyPropertyAddition_(e, void 0));
          } finally {
            yt();
          }
          return !0;
        }),
        (n.delete_ = function (e, t) {
          if ((void 0 === t && (t = !1), this.keysAtom_, !P(this.target_, e)))
            return !0;
          if (
            sn(this) &&
            !cn(this, {
              object: this.proxy_ || this.target_,
              name: e,
              type: In,
            })
          )
            return null;
          try {
            var n, r;
            vt();
            var o,
              i = un(this),
              s = this.values_.get(e),
              l = void 0;
            if (!s && i)
              l = null == (o = a(this.target_, e)) ? void 0 : o.value;
            if (t) {
              if (!Reflect.deleteProperty(this.target_, e)) return !1;
            } else delete this.target_[e];
            if (
              (s &&
                (this.values_.delete(e),
                s instanceof Ye && (l = s.value_),
                xt(s)),
              this.keysAtom_.reportChanged(),
              null == (n = this.pendingKeys_) ||
                null == (r = n.get(e)) ||
                r.set(e in this.target_),
              i)
            ) {
              var c = {
                type: In,
                observableKind: "object",
                object: this.proxy_ || this.target_,
                debugObjectName: this.name_,
                oldValue: l,
                name: e,
              };
              (0, i && pn(this, c));
            }
          } finally {
            yt();
          }
          return !0;
        }),
        (n.observe_ = function (e, t) {
          return dn(this, e);
        }),
        (n.intercept_ = function (e) {
          return ln(this, e);
        }),
        (n.notifyPropertyAddition_ = function (e, t) {
          var n,
            r,
            o = un(this);
          if (o) {
            var a = o
              ? {
                  type: On,
                  observableKind: "object",
                  debugObjectName: this.name_,
                  object: this.proxy_ || this.target_,
                  name: e,
                  newValue: t,
                }
              : null;
            (0, o && pn(this, a));
          }
          (null == (n = this.pendingKeys_) ||
            null == (r = n.get(e)) ||
            r.set(!0),
            this.keysAtom_.reportChanged());
        }),
        (n.ownKeys_ = function () {
          return (this.keysAtom_.reportObserved(), C(this.target_));
        }),
        (n.keys_ = function () {
          return (this.keysAtom_.reportObserved(), Object.keys(this.target_));
        }),
        e
      );
    })();
  function Fn(e, t) {
    var n;
    if (P(e, q)) return e;
    var r = null != (n = null == t ? void 0 : t.name) ? n : "ObservableObject",
      o = new Rn(
        e,
        new Map(),
        String(r),
        (function (e) {
          var t;
          return e ? (null != (t = e.defaultDecorator) ? t : me(e)) : void 0;
        })(t),
      );
    return (x(e, q, o), e);
  }
  var qn = S("ObservableObjectAdministration", Rn);
  function Hn(e) {
    return (
      jn[e] ||
      (jn[e] = {
        get: function () {
          return this[q].getObservablePropValue_(e);
        },
        set: function (t) {
          return this[q].setObservablePropValue_(e, t);
        },
      })
    );
  }
  function Un(e) {
    return !!v(e) && qn(e[q]);
  }
  function Wn(e, t, n) {
    var r;
    null == (r = e.target_[j]) || delete r[n];
  }
  function Yn(e, t, n) {}
  var Gn,
    Xn,
    Kn = er(0),
    Zn = (function () {
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
    Jn = 0,
    $n = function () {};
  ((Gn = $n),
    (Xn = Array.prototype),
    Object.setPrototypeOf
      ? Object.setPrototypeOf(Gn.prototype, Xn)
      : void 0 !== Gn.prototype.__proto__
        ? (Gn.prototype.__proto__ = Xn)
        : (Gn.prototype = Xn));
  var Qn = (function (e, t, n) {
    function r(t, n, r, o) {
      var a;
      return (
        void 0 === r && (r = "ObservableArray"),
        void 0 === o && (o = !1),
        (a = e.call(this) || this),
        sr(function () {
          var e = new vn(r, n, o, !0);
          ((e.proxy_ = D(a)),
            w(D(a), q, e),
            t && t.length && a.spliceWithArray(0, 0, t),
            Zn && Object.defineProperty(D(a), "0", Kn));
        }),
        a
      );
    }
    N(r, e);
    var o = r.prototype;
    return (
      (o.concat = function () {
        this[q].atom_.reportObserved();
        for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
          t[n] = arguments[n];
        return Array.prototype.concat.apply(
          this.slice(),
          t.map(function (e) {
            return En(e) ? e.slice() : e;
          }),
        );
      }),
      (o[n] = function () {
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
  })($n, Symbol.toStringTag, Symbol.iterator);
  function er(e) {
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
  function tr(e) {
    i(Qn.prototype, "" + e, er(e));
  }
  function nr(e) {
    if (e > Jn) {
      for (var t = Jn; t < e + 100; t++) tr(t);
      Jn = e;
    }
  }
  function rr(e, t, n) {
    return new Qn(e, t, n);
  }
  function or(e, n) {
    if ("object" == typeof e && null !== e) {
      if (En(e)) return (void 0 !== n && t(23), e[q].atom_);
      if (Bn(e)) return e.atom_;
      if (An(e)) {
        if (void 0 === n) return e.keysAtom_;
        var r = e.data_.get(n) || e.hasMap_.get(n);
        return (r || t(25, n, ir(e)), r);
      }
      if (Un(e)) {
        if (!n) return t(26);
        var o = e[q].values_.get(n);
        return (o || t(27, n, ir(e)), o);
      }
      if (U(e) || Je(e) || Ct(e)) return e;
    } else if (f(e) && Ct(e[q])) return e[q];
    t(28);
  }
  function ar(e, n) {
    return (
      e || t(29),
      void 0 !== n
        ? ar(or(e, n))
        : U(e) || Je(e) || Ct(e) || An(e) || Bn(e)
          ? e
          : e[q]
            ? e[q]
            : void t(24, e)
    );
  }
  function ir(e, t) {
    var n;
    if (void 0 !== t) n = or(e, t);
    else {
      if (Bt(e)) return e.name;
      n = Un(e) || An(e) || Bn(e) ? ar(e) : or(e);
    }
    return n.name_;
  }
  function sr(e) {
    var t = at(),
      n = He(!0);
    vt();
    try {
      return e();
    } finally {
      (yt(), Ue(n), it(t));
    }
  }
  (Object.entries(bn).forEach(function (e) {
    var t = e[0],
      n = e[1];
    "concat" !== t && x(Qn.prototype, t, n);
  }),
    nr(1e3));
  var lr = s.toString;
  function cr(e, t, n) {
    return (void 0 === n && (n = -1), ur(e, t, n));
  }
  function ur(e, t, n, r, o) {
    if (e === t) return 0 !== e || 1 / e == 1 / t;
    if (null == e || null == t) return !1;
    if (e != e) return t != t;
    var a = typeof e;
    if ("function" !== a && "object" !== a && "object" != typeof t) return !1;
    var i = lr.call(e);
    if (i !== lr.call(t)) return !1;
    switch (i) {
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
    ((e = dr(e)), (t = dr(t)));
    var s = "[object Array]" === i;
    if (!s) {
      if ("object" != typeof e || "object" != typeof t) return !1;
      var l = e.constructor,
        c = t.constructor;
      if (
        l !== c &&
        !(f(l) && l instanceof l && f(c) && c instanceof c) &&
        "constructor" in e &&
        "constructor" in t
      )
        return !1;
    }
    if (0 === n) return !1;
    (n < 0 && (n = -1), (o = o || []));
    for (var u = (r = r || []).length; u--; ) if (r[u] === e) return o[u] === t;
    if ((r.push(e), o.push(t), s)) {
      if ((u = e.length) !== t.length) return !1;
      for (; u--; ) if (!ur(e[u], t[u], n - 1, r, o)) return !1;
    } else {
      var d,
        p = Object.keys(e);
      if (((u = p.length), Object.keys(t).length !== u)) return !1;
      for (; u--; )
        if (!P(t, (d = p[u])) || !ur(e[d], t[d], n - 1, r, o)) return !1;
    }
    return (r.pop(), o.pop(), !0);
  }
  function dr(e) {
    return En(e)
      ? e.slice()
      : k(e) || An(e) || T(e) || Bn(e)
        ? Array.from(e.entries())
        : e;
  }
  function pr(e) {
    return ((e[Symbol.iterator] = gr), e);
  }
  function gr() {
    return this;
  }
  function hr(e) {
    return (
      (hr =
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
      hr(e)
    );
  }
  function fr(e, t) {
    for (var n = 0; n < t.length; n++) {
      var r = t[n];
      ((r.enumerable = r.enumerable || !1),
        (r.configurable = !0),
        "value" in r && (r.writable = !0),
        Object.defineProperty(e, vr(r.key), r));
    }
  }
  function mr(e, t, n) {
    return (
      (t = vr(t)) in e
        ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = n),
      e
    );
  }
  function vr(e) {
    var t = (function (e, t) {
      if ("object" != hr(e) || !e) return e;
      var n = e[Symbol.toPrimitive];
      if (void 0 !== n) {
        var r = n.call(e, t || "default");
        if ("object" != hr(r)) return r;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === t ? String : Number)(e);
    })(e, "string");
    return "symbol" == hr(t) ? t : String(t);
  }
  (["Symbol", "Map", "Set"].forEach(function (e) {
    void 0 === r()[e] &&
      t("MobX requires global '" + e + "' to be available or polyfilled");
  }),
    "object" == typeof __MOBX_DEVTOOLS_GLOBAL_HOOK__ &&
      __MOBX_DEVTOOLS_GLOBAL_HOOK__.injectMobx({
        spy: function (e) {
          return function () {};
        },
        extras: { getDebugName: ir },
        $mobx: q,
      }));
  var yr = (function () {
    function e() {
      var t,
        n,
        r,
        o = this;
      (!(function (e, t) {
        if (!(e instanceof t))
          throw new TypeError("Cannot call a class as a function");
      })(this, e),
        mr(this, "name", "DubTab"),
        mr(this, "IndexedDB_MAX_RECORD_COUNT", 300),
        mr(this, "checkoutName", "dubtab"),
        mr(this, "version", chrome.runtime.getManifest().version),
        mr(this, "contactEmail", "support@dubtab.com"),
        mr(this, "discordInviteUrl", "https://discord.gg/7V56xZ4sXQ"),
        mr(this, "configs", {
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
        mr(
          this,
          "clientId",
          "781969812770-98iajtquasmhrrrm23fdo817d3s69rl6.apps.googleusercontent.com",
        ),
        mr(this, "isNetworkError", !1),
        mr(this, "updateConfigs", function (e) {
          o.configs = e;
        }),
        mr(this, "getSubscriptionURL", function () {
          return o.configs.isTestMode
            ? o.configs.subscriptionURLTest
            : o.configs.subscriptionURL;
        }),
        y((t = this))
          ? Wt(t, t, n, r)
          : sr(function () {
              var e = Fn(t, r)[q];
              if (!t[gn]) {
                var o = Object.getPrototypeOf(t),
                  a = new Set([].concat(C(t), C(o)));
                (a.delete("constructor"), a.delete(q), x(o, gn, a));
              }
              t[gn].forEach(function (t) {
                return e.make_(t, !n || !(t in n) || n[t]);
              });
            }));
    }
    var t, n, r;
    return (
      (t = e),
      (n = [
        {
          key: "getPropValue",
          value: function (e) {
            return e in this ? nn(this[e], new Map()) : void 0;
          },
        },
      ]) && fr(t.prototype, n),
      r && fr(t, r),
      Object.defineProperty(t, "prototype", { writable: !1 }),
      e
    );
  })();
  const br = new yr(),
    xr = JSON.parse(
      '{"common":{"start":"Start","stop":"Stop","cancel":"Cancel","confirm":"Confirm","delete":"Delete","save":"Save","close":"Close","loading":"Loading...","error":"Error","success":"Success","gotIt":"Got it"},"signIn":{"headline":"Real-time translation & dubbing","feature1":"Natural-sounding voices with multiple accents and styles","feature2":"50 languages, with privacy-first local history","feature3":"Understand podcasts in any language","continueWithGoogle":"Continue with Google"},"popup":{"sourceLanguage":"Source language","translateTo":"Translate to","automaticDetection":"Automatic Detection","searchLanguages":"Search languages...","remainingTime":"Remaining time","currentPage":"Current page:","startTranslation":"🌐 Start translation on this page","stopButton":"⏹ Stop","connected":"✓ Connected - start on this tab","starting":"Starting...","stopping":"Stopping...","viewHistory":"View transcripts history","upgradeButton":"Upgrade to unlock more minutes","minutesExhausted":"Minutes Exhausted","freeMinutesExhausted":"You\'ve used up all free minutes for DubTab.\\n\\nPlease upgrade your plan to get more minutes.","paidMinutesExhausted":"You\'ve used all minutes in your current plan. Minutes will reset with your next billing cycle.","paidMinutesExhaustedWithDate":"You\'ve used all minutes in your current plan.\\n\\nYour minutes will reset on {date}.","billingIssue":"Billing Issue","billingIssueMessage":"Your subscription is {status}. Please pay or update your payment method in the customer portal first.","pageDetectionFailed":"⚠️ Page Detection Failed","cannotDetectPage":"Cannot detect current page. Please try again.","cannotStartOnPage":"Cannot Start on This Page","pageNotSupported":"This page doesn\'t support audio capture.\\n\\nPlease open a video website (YouTube, Netflix, etc.) and try again.","audioCaptureError":"⚠️ Audio Capture Error","audioCaptureErrorMessage":"Failed to capture tab audio. Please refresh the page and try again.","quickStart":"Quick Start","step1":"Play a video or audio (YouTube, Netflix, etc.)","step2":"Click \\"Start\\" — you\'ll see subtitles AND hear the translation","tip":"💡 Make sure the audio is playing on the page before you start","instructionTip":"💡 Open a page with a playing video or audio (YouTube, Twitch, Zoom, etc.), then Click","instructionStart":"Start","instructionOnPage":"on that page.","planMinutes":"Plan","extraLifetime":"Extra (lifetime)","sourceLanguageTipsTitle":"Source Language Tips","sourceLanguageTipSingle":"Single-language audio → selecting it can improve accuracy","sourceLanguageTipMultiple":"Multiple languages → use Auto Detect"},"account":{"title":"Account Information","email":"Email","plan":"Plan","status":"Status","nextBillingDate":"Next Billing Date","endDate":"End date","minutesResetDate":"Minutes Reset Date","logOut":"Log Out","manageSubscription":"Manage Subscription","uiLanguage":"UI Language","uiLanguageTooltip":"This only affects interface buttons and text, not subtitle or translation languages.","noSubscriptionFound":"No Subscription Found","noSubscriptionMessage":"You don\'t have any subscription yet. Upgrade to manage subscription!","upgrade":"Upgrade"},"history":{"title":"History","reviewSessions":"Review your past sessions","loading":"Loading history...","noSessionSelected":"No session selected","selectSession":"Select a session from the list to review transcriptions.","clearAllTitle":"Clear all history? This cannot be undone.","deleteSessionTitle":"Delete this session? This cannot be undone.","sessionDeleted":"Session deleted","historyCleared":"History cleared","failedToDelete":"Failed to delete session","failedToClear":"Failed to clear history","failedToLoad":"Failed to load history data.","notSignedIn":"Not signed in. Please sign in to view history.","cannotDeleteRunning":"Cannot delete a running session. Please stop it first.","cannotClearRunning":"Cannot clear history while sessions are running. Please stop them first.","untitledSession":"Untitled Session","ongoing":"Ongoing","clearAll":"Clear All","sessions":"Sessions","noSessions":"No sessions yet","startNewSession":"Start a translation to see your history here.","copyAll":"Copy All","export":"Export","exportWord":"Word","exportTxt":"TXT","copied":"Copied!","failedToCopy":"Failed to copy","exportSuccess":"Exported successfully","exportFailed":"Export failed","starredOnly":"Starred only","searchPlaceholder":"Search transcripts...","duration":"Duration","from":"From","to":"To","segments":"segments","noTranscripts":"No transcripts in this session.","clickStar":"Click the star icon to save important segments."},"overlay":{"listening":"Listening for video/audio on this page","listeningTab":"Listening for audio in this tab","listeningTabDesc":"Make sure video is playing & unmuted. Captions will appear here automatically.","listeningPageChangeDesc":"You\'ve opened a new page. Captions will resume automatically when video/audio starts.","starting":"Starting...","translating":"Translating","stopped":"Stopped","clickStartToResume":"Click Start to resume","waitingForAudio":"Waiting for audio...","makeSureVideoPlaying":"Make sure video is playing and unmuted","resizeTooltip":"Drag the corner to resize","stopTabUpdated":"Captions paused because this tab changed pages. Click Start to continue.","stopTabRemoved":"Caption stopped because the tab was closed.","stopTabReplaced":"Caption stopped because the tab was replaced.","stopNoAudioTimeout":"No audio was detected for a while, so DubTab stopped automatically. Click Start to turn it back on.","pauseCaption":"Pause Caption","resumeCaption":"Resume Caption","bilingualMode":"Both","translationOnly":"Translation","originalOnly":"Original Only","settings":"Settings","close":"Close","scrollToBottom":"Scroll to bottom","fontSize":"Font Size","fontSizeSmall":"Small","fontSizeMedium":"Medium","fontSizeLarge":"Large","fontSizeXLarge":"Extra Large","theme":"Theme","themeDark":"Dark","themeLight":"Light","opacity":"Background Opacity","reset":"Reset","upgradeRequired":"Upgrade Required","freeQuotaExhausted":"Your free minutes are used up.\\n\\nUpgrade to continue enjoying real-time translation.","upgradeNow":"Upgrade Now","maybeLater":"Maybe Later","followVoice":"Follow Voice","followVoiceTooltip":"Follow the current TTS voice"},"dock":{"ready":"Ready","connecting":"Connecting...","translating":"Translating","error":"Error","pause":"Pause","sessionTime":"Session time","selectVoice":"Select Voice","audioMixer":"Audio Mixer","subtitleMode":"Subtitle Mode","captionPanel":"Caption Panel","cinemaMode":"Cinema Mode","panel":"Panel","cinema":"Cinema","audioOnly":"Audio Only","voiceOn":"Translated Voice On","voiceOff":"Translated Voice Off","voice":"Voice","settings":"Settings","collapse":"Collapse","expand":"Expand","close":"Close"},"voiceSelector":{"title":"VOICE","auto":"Auto","loadingVoices":"Loading voices...","noVoices":"No voices available","favorites":"FAVORITES","moreVoices":"MORE VOICES","switchingToVoice":"Switching to new voice: {voiceName}","previousVoiceFallback":"your previous voice","newVoiceFallback":"a new voice","voiceUnavailableSwitched":"Your previous voice \\"{previousVoice}\\" is no longer available. Switched to \\"{nextVoice}\\"."},"audioMixer":{"title":"AUDIO MIXER","originalAudio":"Original Audio","translatedVoice":"Translated Voice","voiceOnly":"Translation only","balanced":"Balanced","originalOnly":"Original only","audioDucking":"Audio Ducking","audioDuckingDesc":"Lower tab audio while voice plays","originalDuringVoice":"Original audio during voice","normalVolume":"Normal","duringVoice":"During voice"},"settingsPanel":{"title":"SETTINGS","captionPanelFontSize":"Caption Panel Font Size","cinemaModeFontSize":"Cinema Mode Font Size","backgroundOpacity":"Background Opacity","theme":"Theme","darkTheme":"🌙 Dark","lightTheme":"☀️ Light","resetSettings":"Reset Settings","resetDesc":"Restore all settings to their default values","resetButton":"🔄 Reset to Defaults","resetComplete":"✓ Reset Complete","subtitleDisplay":"Subtitle Display","showBothLanguages":"Show Both Languages","captionOrder":"Caption Order","originalFirst":"Original first","translationFirst":"Translation first","tooltipOriginal":"① Original","tooltipTranslation":"① Translation"},"quotaModal":{"freeTitle":"You\'ve used your free 10 minutes.","freeSubtitle":"To keep live translation & dubbing running:","paidTitleTemplate":"You\'ve used all your {plan} hours for this month.","paidTitle":"Minutes Exhausted","paidSubtitleBuyMore":"To keep DubTab running for the rest of this month, add extra lifetime hours:","paidSubtitleReached":"You\'ve reached your monthly minute limit, so this session is paused to avoid extra charges.","renewalInfo":"Your minutes will reset on {date}","extraHoursPack":"Extra hours pack","smallPack":"Small pack","smallPackDesc":"1 extra hour · lifetime, one time purchase","standardPack":"Standard pack","standardPackDesc":"4 extra hours · lifetime, one time purchase","largePack":"Large pack","largePackDesc":"15 extra hours · lifetime, one time purchase","processing":"Processing...","openingStripeCheckout":"Opening Stripe Checkout","monthly":"Monthly","yearly":"Yearly","upfront":"Upfront","toggleHint":"Get all hours upfront • No monthly reset","hoursPerMonth":"{hours} hours/month","hoursUpfrontPerYear":"{hours} hours upfront (per year)","perMonth":"/month","perYear":"/yr","perMonthShort":"/mo","approxPerMonth":"(~${price}/mo)","starter":"Starter","pro":"Pro","power":"Power","mostPopular":"Most Popular","seeAllPlans":"See all plans","maybeLater":"Maybe later"}}',
    );
  function wr() {
    wr = function () {
      return t;
    };
    var e,
      t = {},
      n = Object.prototype,
      r = n.hasOwnProperty,
      o =
        Object.defineProperty ||
        function (e, t, n) {
          e[t] = n.value;
        },
      a = "function" == typeof Symbol ? Symbol : {},
      i = a.iterator || "@@iterator",
      s = a.asyncIterator || "@@asyncIterator",
      l = a.toStringTag || "@@toStringTag";
    function c(e, t, n) {
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
      c({}, "");
    } catch (e) {
      c = function (e, t, n) {
        return (e[t] = n);
      };
    }
    function u(e, t, n, r) {
      var a = t && t.prototype instanceof v ? t : v,
        i = Object.create(a.prototype),
        s = new M(r || []);
      return (o(i, "_invoke", { value: C(e, n, s) }), i);
    }
    function d(e, t, n) {
      try {
        return { type: "normal", arg: e.call(t, n) };
      } catch (e) {
        return { type: "throw", arg: e };
      }
    }
    t.wrap = u;
    var p = "suspendedStart",
      g = "suspendedYield",
      h = "executing",
      f = "completed",
      m = {};
    function v() {}
    function y() {}
    function b() {}
    var x = {};
    c(x, i, function () {
      return this;
    });
    var w = Object.getPrototypeOf,
      S = w && w(w(L([])));
    S && S !== n && r.call(S, i) && (x = S);
    var k = (b.prototype = v.prototype = Object.create(x));
    function T(e) {
      ["next", "throw", "return"].forEach(function (t) {
        c(e, t, function (e) {
          return this._invoke(t, e);
        });
      });
    }
    function _(e, t) {
      function n(o, a, i, s) {
        var l = d(e[o], e, a);
        if ("throw" !== l.type) {
          var c = l.arg,
            u = c.value;
          return u && "object" == Sr(u) && r.call(u, "__await")
            ? t.resolve(u.__await).then(
                function (e) {
                  n("next", e, i, s);
                },
                function (e) {
                  n("throw", e, i, s);
                },
              )
            : t.resolve(u).then(
                function (e) {
                  ((c.value = e), i(c));
                },
                function (e) {
                  return n("throw", e, i, s);
                },
              );
        }
        s(l.arg);
      }
      var a;
      o(this, "_invoke", {
        value: function (e, r) {
          function o() {
            return new t(function (t, o) {
              n(e, r, t, o);
            });
          }
          return (a = a ? a.then(o, o) : o());
        },
      });
    }
    function C(t, n, r) {
      var o = p;
      return function (a, i) {
        if (o === h) throw new Error("Generator is already running");
        if (o === f) {
          if ("throw" === a) throw i;
          return { value: e, done: !0 };
        }
        for (r.method = a, r.arg = i; ; ) {
          var s = r.delegate;
          if (s) {
            var l = E(s, r);
            if (l) {
              if (l === m) continue;
              return l;
            }
          }
          if ("next" === r.method) r.sent = r._sent = r.arg;
          else if ("throw" === r.method) {
            if (o === p) throw ((o = f), r.arg);
            r.dispatchException(r.arg);
          } else "return" === r.method && r.abrupt("return", r.arg);
          o = h;
          var c = d(t, n, r);
          if ("normal" === c.type) {
            if (((o = r.done ? f : g), c.arg === m)) continue;
            return { value: c.arg, done: r.done };
          }
          "throw" === c.type &&
            ((o = f), (r.method = "throw"), (r.arg = c.arg));
        }
      };
    }
    function E(t, n) {
      var r = n.method,
        o = t.iterator[r];
      if (o === e)
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
          m
        );
      var a = d(o, t.iterator, n.arg);
      if ("throw" === a.type)
        return ((n.method = "throw"), (n.arg = a.arg), (n.delegate = null), m);
      var i = a.arg;
      return i
        ? i.done
          ? ((n[t.resultName] = i.value),
            (n.next = t.nextLoc),
            "return" !== n.method && ((n.method = "next"), (n.arg = e)),
            (n.delegate = null),
            m)
          : i
        : ((n.method = "throw"),
          (n.arg = new TypeError("iterator result is not an object")),
          (n.delegate = null),
          m);
    }
    function P(e) {
      var t = { tryLoc: e[0] };
      (1 in e && (t.catchLoc = e[1]),
        2 in e && ((t.finallyLoc = e[2]), (t.afterLoc = e[3])),
        this.tryEntries.push(t));
    }
    function O(e) {
      var t = e.completion || {};
      ((t.type = "normal"), delete t.arg, (e.completion = t));
    }
    function M(e) {
      ((this.tryEntries = [{ tryLoc: "root" }]),
        e.forEach(P, this),
        this.reset(!0));
    }
    function L(t) {
      if (t || "" === t) {
        var n = t[i];
        if (n) return n.call(t);
        if ("function" == typeof t.next) return t;
        if (!isNaN(t.length)) {
          var o = -1,
            a = function n() {
              for (; ++o < t.length; )
                if (r.call(t, o)) return ((n.value = t[o]), (n.done = !1), n);
              return ((n.value = e), (n.done = !0), n);
            };
          return (a.next = a);
        }
      }
      throw new TypeError(Sr(t) + " is not iterable");
    }
    return (
      (y.prototype = b),
      o(k, "constructor", { value: b, configurable: !0 }),
      o(b, "constructor", { value: y, configurable: !0 }),
      (y.displayName = c(b, l, "GeneratorFunction")),
      (t.isGeneratorFunction = function (e) {
        var t = "function" == typeof e && e.constructor;
        return (
          !!t && (t === y || "GeneratorFunction" === (t.displayName || t.name))
        );
      }),
      (t.mark = function (e) {
        return (
          Object.setPrototypeOf
            ? Object.setPrototypeOf(e, b)
            : ((e.__proto__ = b), c(e, l, "GeneratorFunction")),
          (e.prototype = Object.create(k)),
          e
        );
      }),
      (t.awrap = function (e) {
        return { __await: e };
      }),
      T(_.prototype),
      c(_.prototype, s, function () {
        return this;
      }),
      (t.AsyncIterator = _),
      (t.async = function (e, n, r, o, a) {
        void 0 === a && (a = Promise);
        var i = new _(u(e, n, r, o), a);
        return t.isGeneratorFunction(n)
          ? i
          : i.next().then(function (e) {
              return e.done ? e.value : i.next();
            });
      }),
      T(k),
      c(k, l, "Generator"),
      c(k, i, function () {
        return this;
      }),
      c(k, "toString", function () {
        return "[object Generator]";
      }),
      (t.keys = function (e) {
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
      (t.values = L),
      (M.prototype = {
        constructor: M,
        reset: function (t) {
          if (
            ((this.prev = 0),
            (this.next = 0),
            (this.sent = this._sent = e),
            (this.done = !1),
            (this.delegate = null),
            (this.method = "next"),
            (this.arg = e),
            this.tryEntries.forEach(O),
            !t)
          )
            for (var n in this)
              "t" === n.charAt(0) &&
                r.call(this, n) &&
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
          function o(r, o) {
            return (
              (s.type = "throw"),
              (s.arg = t),
              (n.next = r),
              o && ((n.method = "next"), (n.arg = e)),
              !!o
            );
          }
          for (var a = this.tryEntries.length - 1; a >= 0; --a) {
            var i = this.tryEntries[a],
              s = i.completion;
            if ("root" === i.tryLoc) return o("end");
            if (i.tryLoc <= this.prev) {
              var l = r.call(i, "catchLoc"),
                c = r.call(i, "finallyLoc");
              if (l && c) {
                if (this.prev < i.catchLoc) return o(i.catchLoc, !0);
                if (this.prev < i.finallyLoc) return o(i.finallyLoc);
              } else if (l) {
                if (this.prev < i.catchLoc) return o(i.catchLoc, !0);
              } else {
                if (!c)
                  throw new Error("try statement without catch or finally");
                if (this.prev < i.finallyLoc) return o(i.finallyLoc);
              }
            }
          }
        },
        abrupt: function (e, t) {
          for (var n = this.tryEntries.length - 1; n >= 0; --n) {
            var o = this.tryEntries[n];
            if (
              o.tryLoc <= this.prev &&
              r.call(o, "finallyLoc") &&
              this.prev < o.finallyLoc
            ) {
              var a = o;
              break;
            }
          }
          a &&
            ("break" === e || "continue" === e) &&
            a.tryLoc <= t &&
            t <= a.finallyLoc &&
            (a = null);
          var i = a ? a.completion : {};
          return (
            (i.type = e),
            (i.arg = t),
            a
              ? ((this.method = "next"), (this.next = a.finallyLoc), m)
              : this.complete(i)
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
            m
          );
        },
        finish: function (e) {
          for (var t = this.tryEntries.length - 1; t >= 0; --t) {
            var n = this.tryEntries[t];
            if (n.finallyLoc === e)
              return (this.complete(n.completion, n.afterLoc), O(n), m);
          }
        },
        catch: function (e) {
          for (var t = this.tryEntries.length - 1; t >= 0; --t) {
            var n = this.tryEntries[t];
            if (n.tryLoc === e) {
              var r = n.completion;
              if ("throw" === r.type) {
                var o = r.arg;
                O(n);
              }
              return o;
            }
          }
          throw new Error("illegal catch attempt");
        },
        delegateYield: function (t, n, r) {
          return (
            (this.delegate = { iterator: L(t), resultName: n, nextLoc: r }),
            "next" === this.method && (this.arg = e),
            m
          );
        },
      }),
      t
    );
  }
  function Sr(e) {
    return (
      (Sr =
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
      Sr(e)
    );
  }
  function kr(e, t, n, r, o, a, i) {
    try {
      var s = e[a](i),
        l = s.value;
    } catch (e) {
      return void n(e);
    }
    s.done ? t(l) : Promise.resolve(l).then(r, o);
  }
  function Tr(e) {
    return function () {
      var t = this,
        n = arguments;
      return new Promise(function (r, o) {
        var a = e.apply(t, n);
        function i(e) {
          kr(a, r, o, i, s, "next", e);
        }
        function s(e) {
          kr(a, r, o, i, s, "throw", e);
        }
        i(void 0);
      });
    };
  }
  var _r = {
      en: xr,
      "zh-CN": JSON.parse(
        '{"common":{"start":"开始","stop":"停止","cancel":"取消","confirm":"确认","delete":"删除","save":"保存","close":"关闭","loading":"加载中...","error":"错误","success":"成功","gotIt":"知道了"},"signIn":{"headline":"实时翻译与配音","feature1":"多种口音和风格的自然语音","feature2":"50 种语言，本地历史隐私优先","feature3":"听懂任何语言的播客","continueWithGoogle":"使用 Google 登录"},"popup":{"sourceLanguage":"源语言","translateTo":"翻译为","automaticDetection":"自动检测","searchLanguages":"搜索语言...","remainingTime":"剩余时长","currentPage":"当前页面：","startTranslation":"🌐 在此页面开始翻译","stopButton":"⏹ 停止","connected":"✓ 已连接 - 在此标签页启动","starting":"正在启动...","stopping":"正在停止...","viewHistory":"查看翻译历史","upgradeButton":"升级解锁更多时长","minutesExhausted":"时长已用完","freeMinutesExhausted":"您的 DubTab 免费时长已用完。\\n\\n请升级套餐以获取更多时长。","paidMinutesExhausted":"当前套餐的时长已用完，时长将在下个计费周期重置。","paidMinutesExhaustedWithDate":"当前套餐的时长已用完。\\n\\n您的时长将于 {date} 重置。","billingIssue":"账单问题","billingIssueMessage":"您的订阅状态为「{status}」。请先完成付款或在客户门户中更新付款方式。","pageDetectionFailed":"⚠️ 页面检测失败","cannotDetectPage":"无法检测当前页面，请重试。","cannotStartOnPage":"无法在此页面启动","pageNotSupported":"此页面不支持音频采集。\\n\\n请打开视频网站（如 YouTube、Netflix 等）后重试。","audioCaptureError":"⚠️ 音频采集错误","audioCaptureErrorMessage":"无法采集标签页音频，请刷新页面后重试。","quickStart":"快速上手","step1":"播放一个视频或音频（YouTube、Netflix 等）","step2":"点击「开始翻译」— 你会看到字幕并听到翻译配音","tip":"💡 启动前请确保页面有音频正在播放","instructionTip":"💡 打开正在播放视频或音频的页面（YouTube、Twitch、Zoom 等），然后点击","instructionStart":"开始","instructionOnPage":"即可。","planMinutes":"套餐","extraLifetime":"额外（终身）","sourceLanguageTipsTitle":"源语言选择建议","sourceLanguageTipSingle":"单一语言音频 → 手动选择可提高准确率","sourceLanguageTipMultiple":"多语言混合 → 使用自动检测"},"account":{"title":"账户信息","email":"邮箱","plan":"套餐","status":"状态","nextBillingDate":"下次扣款日期","endDate":"到期日期","minutesResetDate":"时长重置日期","logOut":"退出登录","manageSubscription":"管理订阅","uiLanguage":"界面语言","uiLanguageTooltip":"此设置仅影响界面按钮和文字，不影响字幕和翻译语言。","noSubscriptionFound":"未找到订阅","noSubscriptionMessage":"您还没有订阅。升级后即可管理订阅！","upgrade":"立即升级"},"history":{"title":"历史记录","reviewSessions":"回顾您的历史会话","loading":"正在加载历史记录...","noSessionSelected":"未选择会话","selectSession":"从列表中选择一个会话以查看转录内容。","clearAllTitle":"清除所有历史记录？此操作无法撤销。","deleteSessionTitle":"删除此会话？此操作无法撤销。","sessionDeleted":"会话已删除","historyCleared":"历史记录已清除","failedToDelete":"删除会话失败","failedToClear":"清除历史记录失败","failedToLoad":"加载历史数据失败。","notSignedIn":"未登录。请登录后查看历史记录。","cannotDeleteRunning":"无法删除正在进行的会话，请先停止。","cannotClearRunning":"有会话正在进行中，无法清除历史记录。请先停止。","untitledSession":"未命名会话","ongoing":"进行中","clearAll":"全部清除","sessions":"会话","noSessions":"暂无会话","startNewSession":"开始翻译后，您的历史记录将显示在这里。","copyAll":"复制全部","export":"导出","exportWord":"Word","exportTxt":"TXT","copied":"已复制！","failedToCopy":"复制失败","exportSuccess":"导出成功","exportFailed":"导出失败","starredOnly":"仅显示已收藏","searchPlaceholder":"搜索转录内容...","duration":"时长","from":"从","to":"至","segments":"条记录","noTranscripts":"此会话暂无转录内容。","clickStar":"点击星标图标以收藏重要片段。"},"overlay":{"listening":"正在监听此页面的视频/音频","listeningTab":"正在监听此标签页的音频","listeningTabDesc":"请确保视频正在播放且未静音，字幕将自动显示。","listeningPageChangeDesc":"您已打开新页面，视频/音频开始播放后字幕将自动恢复。","starting":"正在启动...","translating":"正在翻译","stopped":"已停止","clickStartToResume":"点击开始继续","waitingForAudio":"正在等待音频...","makeSureVideoPlaying":"请确认视频正在播放且未静音","resizeTooltip":"拖动右下角调整大小","stopTabUpdated":"页面已切换，字幕已暂停。点击开始继续。","stopTabRemoved":"标签页已关闭，字幕已停止。","stopTabReplaced":"标签页已替换，字幕已停止。","stopNoAudioTimeout":"一段时间内未检测到音频，DubTab 已自动停止。点击开始重新开启。","pauseCaption":"暂停字幕","resumeCaption":"继续字幕","bilingualMode":"双语","translationOnly":"仅译文","originalOnly":"仅原文","settings":"设置","close":"关闭","scrollToBottom":"滚动到底部","fontSize":"字体大小","fontSizeSmall":"小","fontSizeMedium":"中","fontSizeLarge":"大","fontSizeXLarge":"特大","theme":"主题","themeDark":"深色","themeLight":"浅色","opacity":"背景透明度","reset":"重置","upgradeRequired":"需要升级","freeQuotaExhausted":"您的免费时长已用完。\\n\\n升级后可继续享受实时翻译服务。","upgradeNow":"立即升级","maybeLater":"以后再说","followVoice":"跟随语音","followVoiceTooltip":"跟随当前语音朗读"},"dock":{"ready":"就绪","connecting":"连接中...","translating":"翻译中","error":"错误","pause":"暂停","sessionTime":"会话时间","selectVoice":"选择语音","audioMixer":"音频混音器","subtitleMode":"字幕模式","captionPanel":"字幕面板","cinemaMode":"影院模式","panel":"面板","cinema":"影院","audioOnly":"仅音频","voiceOn":"译文语音已开启","voiceOff":"译文语音已关闭","voice":"语音","settings":"设置","collapse":"收起","expand":"展开","close":"关闭"},"voiceSelector":{"title":"语音","auto":"自动","loadingVoices":"正在加载语音...","noVoices":"无可用语音","favorites":"收藏","moreVoices":"更多语音","switchingToVoice":"正在切换到新语音：{voiceName}","previousVoiceFallback":"之前选择的语音","newVoiceFallback":"新的语音","voiceUnavailableSwitched":"之前选择的语音“{previousVoice}”已不可用，已切换为“{nextVoice}”。"},"audioMixer":{"title":"音频混音器","originalAudio":"原始音频","translatedVoice":"译文语音","voiceOnly":"仅配音","balanced":"均衡","originalOnly":"仅原音","audioDucking":"音量自动降低","audioDuckingDesc":"播放语音时降低标签页音频","originalDuringVoice":"播放语音时的原音量","normalVolume":"正常","duringVoice":"播放时"},"settingsPanel":{"title":"设置","captionPanelFontSize":"字幕面板字体大小","cinemaModeFontSize":"影院模式字体大小","backgroundOpacity":"背景透明度","theme":"主题","darkTheme":"🌙 深色","lightTheme":"☀️ 浅色","resetSettings":"重置设置","resetDesc":"将所有设置还原为默认值","resetButton":"🔄 恢复默认值","resetComplete":"✓ 重置完成","subtitleDisplay":"字幕显示","showBothLanguages":"显示双语","captionOrder":"字幕顺序","originalFirst":"原文在上","translationFirst":"译文在上","tooltipOriginal":"① 原文","tooltipTranslation":"① 译文"},"quotaModal":{"freeTitle":"免费 10 分钟已用完","freeSubtitle":"如需继续实时翻译与配音服务：","paidTitleTemplate":"本月 {plan} 套餐时长已用完","paidTitle":"时长已用尽","paidSubtitleBuyMore":"如需本月继续使用 DubTab，可购买额外终身时长：","paidSubtitleReached":"您已达到本月时长上限，会话已暂停以避免额外费用。","renewalInfo":"您的时长将于 {date} 重置","extraHoursPack":"额外时长包","smallPack":"小时包","smallPackDesc":"1 小时 · 终身有效，一次性购买","standardPack":"标准包","standardPackDesc":"4 小时 · 终身有效，一次性购买","largePack":"大时包","largePackDesc":"15 小时 · 终身有效，一次性购买","processing":"处理中...","openingStripeCheckout":"正在打开支付页面","monthly":"月付","yearly":"年付","upfront":"一次到账","toggleHint":"全年时长一次到账 • 无月度重置","hoursPerMonth":"{hours} 小时/月","hoursUpfrontPerYear":"{hours} 小时一次到账（按年计）","perMonth":"/月","perYear":"/年","perMonthShort":"/月","approxPerMonth":"(约 ${price}/月)","starter":"入门版","pro":"专业版","power":"强力版","mostPopular":"最受欢迎","seeAllPlans":"查看所有套餐","maybeLater":"以后再说"}}',
      ),
      "zh-TW": JSON.parse(
        '{"common":{"start":"開始","stop":"停止","cancel":"取消","confirm":"確認","delete":"刪除","save":"儲存","close":"關閉","loading":"載入中...","error":"錯誤","success":"成功","gotIt":"了解"},"signIn":{"headline":"即時翻譯與配音","feature1":"多種口音和風格的自然語音","feature2":"50 種語言，本地歷史隱私優先","feature3":"聽懂任何語言的播客","continueWithGoogle":"使用 Google 登入"},"popup":{"sourceLanguage":"來源語言","translateTo":"翻譯成","automaticDetection":"自動偵測","searchLanguages":"搜尋語言...","remainingTime":"剩餘時間","currentPage":"目前頁面：","startTranslation":"🌐 在此頁面開始翻譯","stopButton":"⏹ 停止","connected":"✓ 已連線 - 在此分頁啟動","starting":"正在啟動...","stopping":"正在停止...","viewHistory":"檢視翻譯歷史","upgradeButton":"升級以解鎖更多時間","minutesExhausted":"時間已用盡","freeMinutesExhausted":"您的 DubTab 免費時間已用盡。\\n\\n請升級方案以取得更多時間。","paidMinutesExhausted":"目前方案的時間已用盡，時間將在下個計費週期重置。","paidMinutesExhaustedWithDate":"目前方案的時間已用盡。\\n\\n您的時間將於 {date} 重置。","billingIssue":"帳單問題","billingIssueMessage":"您的訂閱狀態為「{status}」。請先完成付款或在客戶入口網站中更新付款方式。","pageDetectionFailed":"⚠️ 頁面偵測失敗","cannotDetectPage":"無法偵測目前頁面，請重試。","cannotStartOnPage":"無法在此頁面啟動","pageNotSupported":"此頁面不支援音訊擷取。\\n\\n請開啟影片網站（如 YouTube、Netflix 等）後重試。","audioCaptureError":"⚠️ 音訊擷取錯誤","audioCaptureErrorMessage":"無法擷取分頁音訊，請重新整理頁面後重試。","quickStart":"快速入門","step1":"播放一個影片或音訊（YouTube、Netflix 等）","step2":"點擊「開始翻譯」— 你會看到字幕並聽到翻譯配音","tip":"💡 啟動前請確保頁面有音訊正在播放","instructionTip":"💡 開啟正在播放影片或音訊的頁面（YouTube、Twitch、Zoom 等），然後點擊","instructionStart":"開始","instructionOnPage":"即可。","planMinutes":"方案","extraLifetime":"額外（終身）","sourceLanguageTipsTitle":"來源語言選擇建議","sourceLanguageTipSingle":"單一語言音訊 → 手動選擇可提高準確率","sourceLanguageTipMultiple":"多語言混合 → 使用自動偵測"},"account":{"title":"帳戶資訊","email":"電子郵件","plan":"方案","status":"狀態","nextBillingDate":"下次扣款日期","endDate":"到期日期","minutesResetDate":"時間重置日期","logOut":"登出","manageSubscription":"管理訂閱","uiLanguage":"介面語言","uiLanguageTooltip":"此設定僅影響介面按鈕和文字，不影響字幕和翻譯語言。","noSubscriptionFound":"未找到訂閱","noSubscriptionMessage":"您尚未訂閱。升級後即可管理訂閱！","upgrade":"立即升級"},"history":{"title":"歷史記錄","reviewSessions":"回顧您的歷史工作階段","loading":"正在載入歷史記錄...","noSessionSelected":"未選取工作階段","selectSession":"從清單中選取一個工作階段以檢視逐字稿。","clearAllTitle":"清除所有歷史記錄？此操作無法復原。","deleteSessionTitle":"刪除此工作階段？此操作無法復原。","sessionDeleted":"工作階段已刪除","historyCleared":"歷史記錄已清除","failedToDelete":"刪除工作階段失敗","failedToClear":"清除歷史記錄失敗","failedToLoad":"載入歷史資料失敗。","notSignedIn":"尚未登入。請登入以檢視歷史記錄。","cannotDeleteRunning":"無法刪除進行中的工作階段，請先停止。","cannotClearRunning":"有工作階段正在進行中，無法清除歷史記錄。請先停止。","untitledSession":"未命名工作階段","ongoing":"進行中","clearAll":"全部清除","sessions":"工作階段","noSessions":"暫無工作階段","startNewSession":"開始翻譯後，您的歷史記錄將顯示於此。","copyAll":"複製全部","export":"匯出","exportWord":"Word","exportTxt":"TXT","copied":"已複製！","failedToCopy":"複製失敗","exportSuccess":"匯出成功","exportFailed":"匯出失敗","starredOnly":"僅顯示已收藏","searchPlaceholder":"搜尋逐字稿...","duration":"時長","from":"從","to":"至","segments":"條記錄","noTranscripts":"此工作階段暫無逐字稿。","clickStar":"點擊星號圖示以收藏重要片段。"},"overlay":{"listening":"正在監聽此頁面的影片/音訊","listeningTab":"正在監聽此分頁的音訊","listeningTabDesc":"請確保影片正在播放且未靜音，字幕將自動顯示。","listeningPageChangeDesc":"您已開啟新頁面，影片/音訊開始播放後字幕將自動恢復。","starting":"正在啟動...","translating":"正在翻譯","stopped":"已停止","clickStartToResume":"點擊開始繼續","waitingForAudio":"正在等待音訊...","makeSureVideoPlaying":"請確認影片正在播放且未靜音","resizeTooltip":"拖動右下角調整大小","stopTabUpdated":"頁面已切換，字幕已暫停。點擊開始繼續。","stopTabRemoved":"分頁已關閉，字幕已停止。","stopTabReplaced":"分頁已替換，字幕已停止。","stopNoAudioTimeout":"一段時間內未偵測到音訊，DubTab 已自動停止。點擊開始重新開啟。","pauseCaption":"暫停字幕","resumeCaption":"繼續字幕","bilingualMode":"雙語","translationOnly":"僅譯文","originalOnly":"僅原文","settings":"設定","close":"關閉","scrollToBottom":"捲動至底部","fontSize":"字體大小","fontSizeSmall":"小","fontSizeMedium":"中","fontSizeLarge":"大","fontSizeXLarge":"特大","theme":"主題","themeDark":"深色","themeLight":"淺色","opacity":"背景透明度","reset":"重設","upgradeRequired":"需要升級","freeQuotaExhausted":"您的免費時間已用盡。\\n\\n升級後可繼續享受即時翻譯服務。","upgradeNow":"立即升級","maybeLater":"稍後再說","followVoice":"跟隨語音","followVoiceTooltip":"跟隨目前語音朗讀"},"dock":{"ready":"就緒","connecting":"連線中...","translating":"翻譯中","error":"錯誤","pause":"暫停","sessionTime":"工作階段時間","selectVoice":"選擇語音","audioMixer":"音訊混音器","subtitleMode":"字幕模式","captionPanel":"字幕面板","cinemaMode":"影院模式","panel":"面板","cinema":"影院","audioOnly":"僅音訊","voiceOn":"譯文語音已開啟","voiceOff":"譯文語音已關閉","voice":"語音","settings":"設定","collapse":"收起","expand":"展開","close":"關閉"},"voiceSelector":{"title":"語音","auto":"自動","loadingVoices":"正在載入語音...","noVoices":"無可用語音","favorites":"收藏","moreVoices":"更多語音","switchingToVoice":"正在切換到新語音：{voiceName}","previousVoiceFallback":"先前選擇的語音","newVoiceFallback":"新的語音","voiceUnavailableSwitched":"先前選擇的語音「{previousVoice}」已不可用，已切換為「{nextVoice}」。"},"audioMixer":{"title":"音訊混音器","originalAudio":"原始音訊","translatedVoice":"譯文語音","voiceOnly":"僅配音","balanced":"均衡","originalOnly":"僅原音","audioDucking":"音量自動降低","audioDuckingDesc":"播放語音時降低分頁音訊","originalDuringVoice":"播放語音時的原音量","normalVolume":"正常","duringVoice":"播放時"},"settingsPanel":{"title":"設定","captionPanelFontSize":"字幕面板字體大小","cinemaModeFontSize":"影院模式字體大小","backgroundOpacity":"背景透明度","theme":"主題","darkTheme":"🌙 深色","lightTheme":"☀️ 淺色","resetSettings":"重置設定","resetDesc":"將所有設定還原為預設值","resetButton":"🔄 恢復預設值","resetComplete":"✓ 重置完成","subtitleDisplay":"字幕顯示","showBothLanguages":"顯示雙語","captionOrder":"字幕順序","originalFirst":"原文在上","translationFirst":"譯文在上","tooltipOriginal":"① 原文","tooltipTranslation":"① 譯文"},"quotaModal":{"freeTitle":"免費 10 分鐘已用完","freeSubtitle":"如需繼續即時翻譯與配音服務：","paidTitleTemplate":"本月 {plan} 方案時間已用完","paidTitle":"時間已用盡","paidSubtitleBuyMore":"如需本月繼續使用 DubTab，可購買額外終身時間：","paidSubtitleReached":"您已達到本月時間上限，工作階段已暫停以避免額外費用。","renewalInfo":"您的時間將於 {date} 重置","extraHoursPack":"額外時間包","smallPack":"小時包","smallPackDesc":"1 小時 · 終身有效，一次性購買","standardPack":"標準包","standardPackDesc":"4 小時 · 終身有效，一次性購買","largePack":"大時包","largePackDesc":"15 小時 · 終身有效，一次性購買","processing":"處理中...","openingStripeCheckout":"正在開啟支付頁面","monthly":"月付","yearly":"年付","upfront":"一次到帳","toggleHint":"全年時間一次到帳 • 無月度重置","hoursPerMonth":"{hours} 小時/月","hoursUpfrontPerYear":"{hours} 小時一次到帳（按年計）","perMonth":"/月","perYear":"/年","perMonthShort":"/月","approxPerMonth":"(約 ${price}/月)","starter":"入門版","pro":"專業版","power":"強力版","mostPopular":"最受歡迎","seeAllPlans":"檢視所有方案","maybeLater":"稍後再說"}}',
      ),
      ja: JSON.parse(
        '{"common":{"start":"開始","stop":"停止","cancel":"キャンセル","confirm":"確認","delete":"削除","save":"保存","close":"閉じる","loading":"読み込み中...","error":"エラー","success":"成功","gotIt":"了解"},"signIn":{"headline":"リアルタイム翻訳と吹き替え","feature1":"複数のアクセントとスタイルで自然な音声","feature2":"50言語対応、プライバシー優先のローカル履歴","feature3":"どんな言語のポッドキャストも理解","continueWithGoogle":"Googleでログイン"},"popup":{"sourceLanguage":"入力言語","translateTo":"翻訳先","automaticDetection":"自動検出","searchLanguages":"言語を検索...","remainingTime":"残り時間","currentPage":"現在のページ：","startTranslation":"🌐 このページで翻訳を開始","stopButton":"⏹ 停止","connected":"✓ 接続済み - このタブで開始","starting":"開始中...","stopping":"停止中...","viewHistory":"翻訳履歴を見る","upgradeButton":"アップグレードして時間を追加","minutesExhausted":"利用時間切れ","freeMinutesExhausted":"DubTabの無料時間を使い切りました。\\n\\nプランをアップグレードして、より多くの時間をご利用ください。","paidMinutesExhausted":"現在のプランの時間を使い切りました。次の請求サイクルでリセットされます。","paidMinutesExhaustedWithDate":"現在のプランの時間を使い切りました。\\n\\n{date} にリセットされます。","billingIssue":"請求の問題","billingIssueMessage":"サブスクリプションのステータスが「{status}」です。カスタマーポータルでお支払いまたは支払い方法の更新をお願いします。","pageDetectionFailed":"⚠️ ページ検出エラー","cannotDetectPage":"現在のページを検出できません。もう一度お試しください。","cannotStartOnPage":"このページでは開始できません","pageNotSupported":"このページは音声キャプチャに対応していません。\\n\\n動画サイト（YouTube、Netflixなど）を開いてから再度お試しください。","audioCaptureError":"⚠️ 音声キャプチャエラー","audioCaptureErrorMessage":"タブの音声をキャプチャできませんでした。ページを更新してから再度お試しください。","quickStart":"クイックスタート","step1":"動画や音声を再生する（YouTube、Netflixなど）","step2":"「翻訳を開始」をクリック — 字幕が表示され、翻訳音声が聞こえます","tip":"💡 開始前にページで音声が再生されていることを確認してください","instructionTip":"💡 動画や音声を再生中のページ（YouTube、Twitch、Zoomなど）を開いて、","instructionStart":"開始","instructionOnPage":"をクリックしてください。","planMinutes":"プラン","extraLifetime":"追加（永久）","sourceLanguageTipsTitle":"入力言語のヒント","sourceLanguageTipSingle":"単一言語の音声 → 手動選択で精度が向上します","sourceLanguageTipMultiple":"複数言語 → 自動検出を使用"},"account":{"title":"アカウント情報","email":"メールアドレス","plan":"プラン","status":"ステータス","nextBillingDate":"次回請求日","endDate":"終了日","minutesResetDate":"時間リセット日","logOut":"ログアウト","manageSubscription":"サブスクリプション管理","uiLanguage":"表示言語","uiLanguageTooltip":"この設定はインターフェースのボタンやテキストのみに影響し、字幕や翻訳言語には影響しません。","noSubscriptionFound":"サブスクリプションがありません","noSubscriptionMessage":"まだサブスクリプションがありません。アップグレードして管理しましょう！","upgrade":"アップグレード"},"history":{"title":"履歴","reviewSessions":"過去のセッションを確認","loading":"履歴を読み込み中...","noSessionSelected":"セッション未選択","selectSession":"リストからセッションを選択して、文字起こしを確認できます。","clearAllTitle":"すべての履歴を削除しますか？この操作は取り消せません。","deleteSessionTitle":"このセッションを削除しますか？この操作は取り消せません。","sessionDeleted":"セッションを削除しました","historyCleared":"履歴を削除しました","failedToDelete":"セッションの削除に失敗しました","failedToClear":"履歴の削除に失敗しました","failedToLoad":"履歴データの読み込みに失敗しました。","notSignedIn":"ログインしていません。履歴を表示するにはログインしてください。","cannotDeleteRunning":"実行中のセッションは削除できません。先に停止してください。","cannotClearRunning":"実行中のセッションがあるため、履歴を削除できません。先に停止してください。","untitledSession":"無題のセッション","ongoing":"進行中","clearAll":"すべて削除","sessions":"セッション","noSessions":"セッションがありません","startNewSession":"翻訳を開始すると、ここに履歴が表示されます。","copyAll":"すべてコピー","export":"エクスポート","exportWord":"Word","exportTxt":"TXT","copied":"コピーしました！","failedToCopy":"コピーに失敗しました","exportSuccess":"エクスポート完了","exportFailed":"エクスポートに失敗しました","starredOnly":"スター付きのみ","searchPlaceholder":"文字起こしを検索...","duration":"時間","from":"開始","to":"終了","segments":"件のセグメント","noTranscripts":"このセッションには文字起こしがありません。","clickStar":"スターアイコンをクリックして重要なセグメントを保存できます。"},"overlay":{"listening":"このページの動画/音声をリスニング中","listeningTab":"このタブの音声をリスニング中","listeningTabDesc":"動画が再生され、ミュートされていないことを確認してください。字幕は自動的に表示されます。","listeningPageChangeDesc":"新しいページが開かれました。動画/音声の再生が始まると字幕が自動的に再開されます。","starting":"開始中...","translating":"翻訳中","stopped":"停止中","clickStartToResume":"開始をクリックして再開","waitingForAudio":"音声を待機中...","makeSureVideoPlaying":"動画が再生中でミュートされていないことを確認してください","resizeTooltip":"右下の角をドラッグしてサイズ変更","stopTabUpdated":"このタブのページが変わったため、字幕を一時停止しました。開始をクリックして続行してください。","stopTabRemoved":"タブが閉じられたため、字幕を停止しました。","stopTabReplaced":"タブが置き換えられたため、字幕を停止しました。","stopNoAudioTimeout":"しばらく音声が検出されなかったため、DubTab は自動停止しました。開始をクリックして再開してください。","pauseCaption":"字幕を一時停止","resumeCaption":"字幕を再開","bilingualMode":"両方","translationOnly":"翻訳","originalOnly":"原文のみ","settings":"設定","close":"閉じる","scrollToBottom":"一番下にスクロール","fontSize":"フォントサイズ","fontSizeSmall":"小","fontSizeMedium":"中","fontSizeLarge":"大","fontSizeXLarge":"特大","theme":"テーマ","themeDark":"ダーク","themeLight":"ライト","opacity":"背景の透明度","reset":"リセット","upgradeRequired":"アップグレードが必要です","freeQuotaExhausted":"無料時間を使い切りました。\\n\\nアップグレードしてリアルタイム翻訳を続けましょう。","upgradeNow":"今すぐアップグレード","maybeLater":"後で","followVoice":"音声に追従","followVoiceTooltip":"現在のTTS音声に追従"},"dock":{"ready":"準備完了","connecting":"接続中...","translating":"翻訳中","error":"エラー","pause":"一時停止","sessionTime":"セッション時間","selectVoice":"音声を選択","audioMixer":"オーディオミキサー","subtitleMode":"字幕モード","captionPanel":"字幕パネル","cinemaMode":"シネマモード","panel":"パネル","cinema":"シネマ","audioOnly":"音声のみ","voiceOn":"翻訳音声オン","voiceOff":"翻訳音声オフ","voice":"音声","settings":"設定","close":"閉じる"},"voiceSelector":{"title":"音声","auto":"自動","loadingVoices":"音声を読み込み中...","noVoices":"利用可能な音声がありません","favorites":"お気に入り","moreVoices":"その他の音声","switchingToVoice":"新しい音声に切り替えています: {voiceName}","previousVoiceFallback":"以前の音声","newVoiceFallback":"新しい音声","voiceUnavailableSwitched":"以前の音声「{previousVoice}」は利用できなくなりました。「{nextVoice}」に切り替えました。"},"audioMixer":{"title":"オーディオミキサー","originalAudio":"元の音声","translatedVoice":"翻訳音声","voiceOnly":"吹き替えのみ","balanced":"バランス","originalOnly":"元の音声のみ","audioDucking":"オーディオダッキング","audioDuckingDesc":"音声再生時にタブの音量を下げる","originalDuringVoice":"音声再生中の元の音量","normalVolume":"通常","duringVoice":"再生中"},"settingsPanel":{"title":"設定","captionPanelFontSize":"字幕パネルのフォントサイズ","cinemaModeFontSize":"シネマモードのフォントサイズ","backgroundOpacity":"背景の透明度","theme":"テーマ","darkTheme":"🌙 ダーク","lightTheme":"☀️ ライト","resetSettings":"設定をリセット","resetDesc":"すべての設定をデフォルト値に戻す","resetButton":"🔄 デフォルトに戻す","resetComplete":"✓ リセット完了","subtitleDisplay":"字幕の表示","showBothLanguages":"両方の言語を表示","captionOrder":"字幕の順序","originalFirst":"原文を先に","translationFirst":"翻訳を先に","tooltipOriginal":"① 原文","tooltipTranslation":"① 翻訳"},"quotaModal":{"freeTitle":"無料の10分を使い切りました。","freeSubtitle":"リアルタイム翻訳と吹き替えを続けるには：","paidTitleTemplate":"今月の{plan}の時間を使い切りました。","paidTitle":"利用時間切れ","paidSubtitleBuyMore":"今月もDubTabを使い続けるには、永久追加時間を購入してください：","paidSubtitleReached":"月間上限に達しました。追加料金を避けるため、このセッションは一時停止されています。","renewalInfo":"利用時間は{date}にリセットされます","extraHoursPack":"追加時間パック","smallPack":"スモールパック","smallPackDesc":"1時間追加 · 永久、一回限りの購入","standardPack":"スタンダードパック","standardPackDesc":"4時間追加 · 永久、一回限りの購入","largePack":"ラージパック","largePackDesc":"15時間追加 · 永久、一回限りの購入","processing":"処理中...","openingStripeCheckout":"Stripe決済を開いています","monthly":"月額","yearly":"年額","upfront":"一括","toggleHint":"全時間を一括で受け取り • 月次リセットなし","hoursPerMonth":"{hours}時間/月","hoursUpfrontPerYear":"{hours}時間一括（年間）","perMonth":"/月","perYear":"/年","perMonthShort":"/月","approxPerMonth":"(約${price}/月)","starter":"スターター","pro":"プロ","power":"パワー","mostPopular":"人気No.1","seeAllPlans":"すべてのプランを見る","maybeLater":"後で"}}',
      ),
      ko: JSON.parse(
        '{"common":{"start":"시작","stop":"중지","cancel":"취소","confirm":"확인","delete":"삭제","save":"저장","close":"닫기","loading":"로딩 중...","error":"오류","success":"성공","gotIt":"확인"},"signIn":{"headline":"실시간 번역과 더빙","feature1":"다양한 억양과 스타일의 자연스러운 음성","feature2":"50개 언어 지원, 개인정보 보호 우선 로컬 기록","feature3":"어떤 언어의 팟캐스트도 이해","continueWithGoogle":"Google로 계속하기"},"popup":{"sourceLanguage":"원본 언어","translateTo":"번역 언어","automaticDetection":"자동 감지","searchLanguages":"언어 검색...","remainingTime":"남은 시간","currentPage":"현재 페이지:","startTranslation":"🌐 이 페이지에서 번역 시작","stopButton":"⏹ 중지","connected":"✓ 연결됨 - 이 탭에서 시작","starting":"시작 중...","stopping":"중지 중...","viewHistory":"번역 기록 보기","upgradeButton":"업그레이드하여 시간 더 받기","minutesExhausted":"이용 시간 소진","freeMinutesExhausted":"DubTab 무료 이용 시간을 모두 사용했어요.\\n\\n더 많은 시간을 이용하려면 플랜을 업그레이드해 주세요.","paidMinutesExhausted":"현재 플랜의 이용 시간을 모두 사용했어요. 다음 결제 주기에 초기화됩니다.","paidMinutesExhaustedWithDate":"현재 플랜의 이용 시간을 모두 사용했어요.\\n\\n{date}에 초기화됩니다.","billingIssue":"결제 문제","billingIssueMessage":"구독 상태가 \\"{status}\\"입니다. 고객 포털에서 결제를 완료하거나 결제 수단을 업데이트해 주세요.","pageDetectionFailed":"⚠️ 페이지 감지 실패","cannotDetectPage":"현재 페이지를 감지할 수 없어요. 다시 시도해 주세요.","cannotStartOnPage":"이 페이지에서 시작할 수 없음","pageNotSupported":"이 페이지는 오디오 캡처를 지원하지 않아요.\\n\\n동영상 사이트(YouTube, Netflix 등)를 열고 다시 시도해 주세요.","audioCaptureError":"⚠️ 오디오 캡처 오류","audioCaptureErrorMessage":"탭 오디오를 캡처하지 못했어요. 페이지를 새로고침하고 다시 시도해 주세요.","quickStart":"빠른 시작","step1":"동영상이나 오디오를 재생하세요 (YouTube, Netflix 등)","step2":"\\"번역 시작\\"을 클릭하면 — 자막이 표시되고 번역 음성이 들려요","tip":"💡 시작하기 전에 페이지에서 오디오가 재생 중인지 확인하세요","instructionTip":"💡 동영상이나 오디오가 재생 중인 페이지(YouTube, Twitch, Zoom 등)를 열고","instructionStart":"시작","instructionOnPage":"을 클릭하세요.","planMinutes":"플랜","extraLifetime":"추가 (평생)","sourceLanguageTipsTitle":"원본 언어 선택 팁","sourceLanguageTipSingle":"단일 언어 오디오 → 직접 선택하면 정확도가 향상됩니다","sourceLanguageTipMultiple":"여러 언어 → 자동 감지 사용"},"account":{"title":"계정 정보","email":"이메일","plan":"플랜","status":"상태","nextBillingDate":"다음 결제일","endDate":"종료일","minutesResetDate":"시간 초기화일","logOut":"로그아웃","manageSubscription":"구독 관리","uiLanguage":"인터페이스 언어","uiLanguageTooltip":"이 설정은 인터페이스 버튼과 텍스트에만 영향을 주며, 자막 및 번역 언어에는 영향을 주지 않아요.","noSubscriptionFound":"구독 없음","noSubscriptionMessage":"아직 구독이 없어요. 업그레이드하여 구독을 관리하세요!","upgrade":"업그레이드"},"history":{"title":"기록","reviewSessions":"이전 세션 확인하기","loading":"기록 불러오는 중...","noSessionSelected":"세션이 선택되지 않음","selectSession":"목록에서 세션을 선택하여 자막을 확인하세요.","clearAllTitle":"모든 기록을 삭제할까요? 되돌릴 수 없어요.","deleteSessionTitle":"이 세션을 삭제할까요? 되돌릴 수 없어요.","sessionDeleted":"세션이 삭제됨","historyCleared":"기록이 삭제됨","failedToDelete":"세션 삭제 실패","failedToClear":"기록 삭제 실패","failedToLoad":"기록 데이터를 불러오지 못했어요.","notSignedIn":"로그인하지 않았어요. 기록을 보려면 로그인해 주세요.","cannotDeleteRunning":"진행 중인 세션은 삭제할 수 없어요. 먼저 중지해 주세요.","cannotClearRunning":"진행 중인 세션이 있어 기록을 삭제할 수 없어요. 먼저 중지해 주세요.","untitledSession":"제목 없는 세션","ongoing":"진행 중","clearAll":"모두 삭제","sessions":"세션","noSessions":"세션이 없어요","startNewSession":"번역을 시작하면 여기에 기록이 표시돼요.","copyAll":"전체 복사","export":"내보내기","exportWord":"Word","exportTxt":"TXT","copied":"복사됨!","failedToCopy":"복사 실패","exportSuccess":"내보내기 성공","exportFailed":"내보내기 실패","starredOnly":"별표만 표시","searchPlaceholder":"자막 검색...","duration":"길이","from":"시작","to":"종료","segments":"개 세그먼트","noTranscripts":"이 세션에 자막이 없어요.","clickStar":"별표 아이콘을 클릭하여 중요한 세그먼트를 저장하세요."},"overlay":{"listening":"이 페이지의 동영상/오디오 듣는 중","listeningTab":"이 탭의 오디오 듣는 중","listeningTabDesc":"동영상이 재생 중이고 음소거가 해제되어 있는지 확인하세요. 자막이 자동으로 표시됩니다.","listeningPageChangeDesc":"새 페이지를 열었습니다. 동영상/오디오 재생이 시작되면 자막이 자동으로 다시 표시됩니다.","starting":"시작 중...","translating":"번역 중","stopped":"중지됨","clickStartToResume":"시작을 클릭해 계속","waitingForAudio":"오디오 대기 중...","makeSureVideoPlaying":"동영상이 재생 중이고 음소거되어 있지 않은지 확인하세요","resizeTooltip":"오른쪽 아래 모서리를 드래그해 크기 조절","stopTabUpdated":"이 탭의 페이지가 변경되어 자막이 일시정지되었습니다. 시작을 클릭해 계속하세요.","stopTabRemoved":"탭이 닫혀 자막이 중지되었습니다.","stopTabReplaced":"탭이 교체되어 자막이 중지되었습니다.","stopNoAudioTimeout":"한동안 오디오가 감지되지 않아 DubTab이 자동으로 중지되었습니다. 시작을 클릭해 다시 켜세요.","pauseCaption":"자막 일시정지","resumeCaption":"자막 계속하기","bilingualMode":"둘 다","translationOnly":"번역","originalOnly":"원본만","settings":"설정","close":"닫기","scrollToBottom":"맨 아래로 스크롤","fontSize":"글자 크기","fontSizeSmall":"작게","fontSizeMedium":"보통","fontSizeLarge":"크게","fontSizeXLarge":"아주 크게","theme":"테마","themeDark":"다크","themeLight":"라이트","opacity":"배경 투명도","reset":"초기화","upgradeRequired":"업그레이드 필요","freeQuotaExhausted":"무료 이용 시간을 모두 사용했어요.\\n\\n실시간 번역을 계속하려면 업그레이드해 주세요.","upgradeNow":"지금 업그레이드","maybeLater":"나중에","followVoice":"음성 따라가기","followVoiceTooltip":"현재 TTS 음성 따라가기"},"dock":{"ready":"준비됨","connecting":"연결 중...","translating":"번역 중","error":"오류","pause":"일시정지","sessionTime":"세션 시간","selectVoice":"음성 선택","audioMixer":"오디오 믹서","subtitleMode":"자막 모드","captionPanel":"자막 패널","cinemaMode":"시네마 모드","panel":"패널","cinema":"시네마","audioOnly":"오디오만","voiceOn":"번역 음성 켜짐","voiceOff":"번역 음성 꺼짐","voice":"음성","settings":"설정","close":"닫기"},"voiceSelector":{"title":"음성","auto":"자동","loadingVoices":"음성 로딩 중...","noVoices":"사용 가능한 음성이 없습니다","favorites":"즐겨찾기","moreVoices":"더 많은 음성","switchingToVoice":"새 음성으로 전환 중: {voiceName}","previousVoiceFallback":"이전에 선택한 음성","newVoiceFallback":"새 음성","voiceUnavailableSwitched":"이전에 선택한 음성 \\"{previousVoice}\\"을 더 이상 사용할 수 없습니다. \\"{nextVoice}\\"(으)로 전환했습니다."},"audioMixer":{"title":"오디오 믹서","originalAudio":"원본 오디오","translatedVoice":"번역 음성","voiceOnly":"더빙만","balanced":"균형","originalOnly":"원본만","audioDucking":"오디오 덕킹","audioDuckingDesc":"음성 재생 시 탭 오디오 낮추기","originalDuringVoice":"음성 재생 중 원본 음량","normalVolume":"일반","duringVoice":"재생 중"},"settingsPanel":{"title":"설정","captionPanelFontSize":"자막 패널 글자 크기","cinemaModeFontSize":"시네마 모드 글자 크기","backgroundOpacity":"배경 투명도","theme":"테마","darkTheme":"🌙 다크","lightTheme":"☀️ 라이트","resetSettings":"설정 초기화","resetDesc":"모든 설정을 기본값으로 복원","resetButton":"🔄 기본값으로 초기화","resetComplete":"✓ 초기화 완료","subtitleDisplay":"자막 표시","showBothLanguages":"두 언어 모두 표시","captionOrder":"자막 순서","originalFirst":"원본 먼저","translationFirst":"번역 먼저","tooltipOriginal":"① 원본","tooltipTranslation":"① 번역"},"quotaModal":{"freeTitle":"무료 10분을 모두 사용했어요.","freeSubtitle":"실시간 번역과 더빙을 계속하려면:","paidTitleTemplate":"이번 달 {plan} 시간을 모두 사용했어요.","paidTitle":"이용 시간 소진","paidSubtitleBuyMore":"이번 달에도 DubTab을 사용하려면 평생 추가 시간을 구매하세요:","paidSubtitleReached":"월간 한도에 도달했어요. 추가 요금을 피하기 위해 세션이 일시 중지되었습니다.","renewalInfo":"이용 시간이 {date}에 초기화됩니다","extraHoursPack":"추가 시간 패키지","smallPack":"소형 패키지","smallPackDesc":"1시간 추가 · 평생, 일회성 구매","standardPack":"표준 패키지","standardPackDesc":"4시간 추가 · 평생, 일회성 구매","largePack":"대형 패키지","largePackDesc":"15시간 추가 · 평생, 일회성 구매","processing":"처리 중...","openingStripeCheckout":"Stripe 결제 페이지 열기","monthly":"월간","yearly":"연간","upfront":"일괄 지급","toggleHint":"모든 시간을 일괄로 • 월간 초기화 없음","hoursPerMonth":"{hours}시간/월","hoursUpfrontPerYear":"{hours}시간 일괄 (연간)","perMonth":"/월","perYear":"/년","perMonthShort":"/월","approxPerMonth":"(약 ${price}/월)","starter":"스타터","pro":"프로","power":"파워","mostPopular":"가장 인기","seeAllPlans":"모든 플랜 보기","maybeLater":"나중에"}}',
      ),
      fr: JSON.parse(
        '{"common":{"start":"Démarrer","stop":"Arrêter","cancel":"Annuler","confirm":"Confirmer","delete":"Supprimer","save":"Enregistrer","close":"Fermer","loading":"Chargement...","error":"Erreur","success":"Succès","gotIt":"Compris"},"signIn":{"headline":"Traduction et doublage en temps réel","feature1":"Voix naturelles avec plusieurs accents et styles","feature2":"50 langues, avec historique local protégé","feature3":"Comprendre les podcasts dans n\'importe quelle langue","continueWithGoogle":"Continuer avec Google"},"popup":{"sourceLanguage":"Langue source","translateTo":"Traduire vers","automaticDetection":"Détection automatique","searchLanguages":"Rechercher une langue...","remainingTime":"Temps restant","currentPage":"Page actuelle :","startTranslation":"🌐 Lancer la traduction sur cette page","stopButton":"⏹ Arrêter","connected":"✓ Connecté - démarrer sur cet onglet","starting":"Démarrage...","stopping":"Arrêt...","viewHistory":"Voir l\'historique des transcriptions","upgradeButton":"Passer à un forfait supérieur","minutesExhausted":"Temps écoulé","freeMinutesExhausted":"Vous avez utilisé tout votre temps gratuit sur DubTab.\\n\\nVeuillez passer à un forfait supérieur pour obtenir plus de temps.","paidMinutesExhausted":"Vous avez utilisé tout le temps de votre forfait actuel. Votre temps sera réinitialisé au prochain cycle de facturation.","paidMinutesExhaustedWithDate":"Vous avez utilisé tout le temps de votre forfait actuel.\\n\\nVotre temps sera réinitialisé le {date}.","billingIssue":"Problème de facturation","billingIssueMessage":"Votre abonnement est « {status} ». Veuillez d\'abord effectuer le paiement ou mettre à jour votre mode de paiement dans le portail client.","pageDetectionFailed":"⚠️ Échec de détection de la page","cannotDetectPage":"Impossible de détecter la page actuelle. Veuillez réessayer.","cannotStartOnPage":"Impossible de démarrer sur cette page","pageNotSupported":"Cette page ne prend pas en charge la capture audio.\\n\\nVeuillez ouvrir un site vidéo (YouTube, Netflix, etc.) et réessayer.","audioCaptureError":"⚠️ Erreur de capture audio","audioCaptureErrorMessage":"Échec de la capture audio de l\'onglet. Veuillez actualiser la page et réessayer.","quickStart":"Guide rapide","step1":"Lancez une vidéo ou un audio (YouTube, Netflix, etc.)","step2":"Cliquez sur « Démarrer » — vous verrez les sous-titres ET entendrez la traduction","tip":"💡 Assurez-vous que l\'audio est en lecture sur la page avant de démarrer","instructionTip":"💡 Ouvrez une page avec une vidéo ou un audio en lecture (YouTube, Twitch, Zoom, etc.), puis cliquez sur","instructionStart":"Démarrer","instructionOnPage":"sur cette page.","planMinutes":"Forfait","extraLifetime":"Extra (à vie)","sourceLanguageTipsTitle":"Conseils pour la langue source","sourceLanguageTipSingle":"Audio mono-langue → le sélectionner peut améliorer la précision","sourceLanguageTipMultiple":"Plusieurs langues → utiliser la détection automatique"},"account":{"title":"Informations du compte","email":"E-mail","plan":"Forfait","status":"Statut","nextBillingDate":"Prochaine date de facturation","endDate":"Date de fin","minutesResetDate":"Date de réinitialisation du temps","logOut":"Se déconnecter","manageSubscription":"Gérer l\'abonnement","uiLanguage":"Langue de l\'interface","uiLanguageTooltip":"Ce paramètre n\'affecte que les boutons et le texte de l\'interface, pas les sous-titres ou les langues de traduction.","noSubscriptionFound":"Aucun abonnement trouvé","noSubscriptionMessage":"Vous n\'avez pas encore d\'abonnement. Passez à un forfait supérieur pour gérer votre abonnement !","upgrade":"Passer à un forfait supérieur"},"history":{"title":"Historique","reviewSessions":"Consultez vos sessions précédentes","loading":"Chargement de l\'historique...","noSessionSelected":"Aucune session sélectionnée","selectSession":"Sélectionnez une session dans la liste pour consulter les transcriptions.","clearAllTitle":"Effacer tout l\'historique ? Cette action est irréversible.","deleteSessionTitle":"Supprimer cette session ? Cette action est irréversible.","sessionDeleted":"Session supprimée","historyCleared":"Historique effacé","failedToDelete":"Échec de la suppression de la session","failedToClear":"Échec de l\'effacement de l\'historique","failedToLoad":"Échec du chargement des données de l\'historique.","notSignedIn":"Non connecté. Veuillez vous connecter pour voir l\'historique.","cannotDeleteRunning":"Impossible de supprimer une session en cours. Veuillez d\'abord l\'arrêter.","cannotClearRunning":"Impossible d\'effacer l\'historique pendant l\'exécution de sessions. Veuillez d\'abord les arrêter.","untitledSession":"Session sans titre","ongoing":"En cours","clearAll":"Tout effacer","sessions":"Sessions","noSessions":"Aucune session","startNewSession":"Lancez une traduction pour voir votre historique ici.","copyAll":"Tout copier","export":"Exporter","exportWord":"Word","exportTxt":"TXT","copied":"Copié !","failedToCopy":"Échec de la copie","exportSuccess":"Exportation réussie","exportFailed":"Échec de l\'exportation","starredOnly":"Favoris uniquement","searchPlaceholder":"Rechercher dans les transcriptions...","duration":"Durée","from":"De","to":"À","segments":"segments","noTranscripts":"Aucune transcription dans cette session.","clickStar":"Cliquez sur l\'étoile pour enregistrer les segments importants."},"overlay":{"listening":"Écoute des vidéos/audios sur cette page","listeningTab":"Écoute de l\'audio dans cet onglet","listeningTabDesc":"Assurez-vous que la vidéo est en cours de lecture et n\'est pas en sourdine. Les sous-titres apparaîtront automatiquement.","listeningPageChangeDesc":"Vous avez ouvert une nouvelle page. Les sous-titres reprendront automatiquement au démarrage de la vidéo/audio.","starting":"Démarrage...","translating":"Traduction en cours","stopped":"Arrêté","clickStartToResume":"Cliquez sur Start pour reprendre","waitingForAudio":"En attente de l’audio...","makeSureVideoPlaying":"Assurez-vous que la vidéo est en lecture et non coupée","resizeTooltip":"Faites glisser le coin pour redimensionner","stopTabUpdated":"Les sous-titres ont été mis en pause, car cet onglet a changé de page. Cliquez sur Start pour continuer.","stopTabRemoved":"Les sous-titres se sont arrêtés, car l’onglet a été fermé.","stopTabReplaced":"Les sous-titres se sont arrêtés, car l’onglet a été remplacé.","stopNoAudioTimeout":"Aucun audio n’a été détecté pendant un moment, donc DubTab s’est arrêté automatiquement. Cliquez sur Start pour le réactiver.","pauseCaption":"Mettre en pause les sous-titres","resumeCaption":"Reprendre les sous-titres","bilingualMode":"Les deux","translationOnly":"Traduction","originalOnly":"Original uniquement","settings":"Paramètres","close":"Fermer","scrollToBottom":"Défiler vers le bas","fontSize":"Taille de police","fontSizeSmall":"Petit","fontSizeMedium":"Moyen","fontSizeLarge":"Grand","fontSizeXLarge":"Très grand","theme":"Thème","themeDark":"Sombre","themeLight":"Clair","opacity":"Opacité du fond","reset":"Réinitialiser","upgradeRequired":"Mise à niveau requise","freeQuotaExhausted":"Votre temps gratuit est épuisé.\\n\\nPassez à un forfait supérieur pour continuer à profiter de la traduction en temps réel.","upgradeNow":"Passer à un forfait supérieur","maybeLater":"Plus tard","followVoice":"Suivre la voix","followVoiceTooltip":"Suivre la voix TTS actuelle"},"dock":{"ready":"Prêt","connecting":"Connexion...","translating":"Traduction en cours","error":"Erreur","pause":"Pause","sessionTime":"Temps de session","selectVoice":"Sélectionner la voix","audioMixer":"Mixeur audio","subtitleMode":"Mode sous-titres","captionPanel":"Panneau de sous-titres","cinemaMode":"Mode cinéma","panel":"Panneau","cinema":"Cinéma","audioOnly":"Audio seul","voiceOn":"Voix traduite activée","voiceOff":"Voix traduite désactivée","voice":"Voix","settings":"Paramètres","close":"Fermer"},"voiceSelector":{"title":"VOIX","auto":"Auto","loadingVoices":"Chargement des voix...","noVoices":"Aucune voix disponible","favorites":"FAVORIS","moreVoices":"PLUS DE VOIX","switchingToVoice":"Passage à la nouvelle voix : {voiceName}","previousVoiceFallback":"votre voix précédente","newVoiceFallback":"une nouvelle voix","voiceUnavailableSwitched":"Votre voix précédente « {previousVoice} » n\'est plus disponible. Passage à « {nextVoice} »."},"audioMixer":{"title":"MIXEUR AUDIO","originalAudio":"Audio original","translatedVoice":"Voix traduite","voiceOnly":"Doublage uniquement","balanced":"Équilibré","originalOnly":"Original uniquement","audioDucking":"Atténuation audio","audioDuckingDesc":"Baisser l\'audio de l\'onglet pendant la voix","originalDuringVoice":"Audio original pendant la voix","normalVolume":"Normal","duringVoice":"Pendant la voix"},"settingsPanel":{"title":"PARAMÈTRES","captionPanelFontSize":"Taille de police du panneau","cinemaModeFontSize":"Taille de police mode cinéma","backgroundOpacity":"Opacité du fond","theme":"Thème","darkTheme":"🌙 Sombre","lightTheme":"☀️ Clair","resetSettings":"Réinitialiser les paramètres","resetDesc":"Restaurer tous les paramètres aux valeurs par défaut","resetButton":"🔄 Réinitialiser","resetComplete":"✓ Réinitialisation terminée","subtitleDisplay":"Affichage des sous-titres","showBothLanguages":"Afficher les deux langues","captionOrder":"Ordre des sous-titres","originalFirst":"Original en premier","translationFirst":"Traduction en premier","tooltipOriginal":"① Original","tooltipTranslation":"① Traduction"},"quotaModal":{"freeTitle":"Vos 10 minutes gratuites sont épuisées.","freeSubtitle":"Pour continuer la traduction et le doublage en temps réel :","paidTitleTemplate":"Vous avez utilisé toutes vos heures {plan} ce mois-ci.","paidTitle":"Temps écoulé","paidSubtitleBuyMore":"Pour continuer à utiliser DubTab ce mois-ci, ajoutez des heures supplémentaires à vie :","paidSubtitleReached":"Vous avez atteint votre limite mensuelle. Cette session est en pause pour éviter des frais supplémentaires.","renewalInfo":"Votre temps sera réinitialisé le {date}","extraHoursPack":"Pack d\'heures supplémentaires","smallPack":"Petit pack","smallPackDesc":"1 heure supplémentaire · à vie, achat unique","standardPack":"Pack standard","standardPackDesc":"4 heures supplémentaires · à vie, achat unique","largePack":"Grand pack","largePackDesc":"15 heures supplémentaires · à vie, achat unique","processing":"Traitement...","openingStripeCheckout":"Ouverture du paiement Stripe","monthly":"Mensuel","yearly":"Annuel","upfront":"En une fois","toggleHint":"Toutes les heures d\'avance • Sans remise à zéro mensuelle","hoursPerMonth":"{hours} heures/mois","hoursUpfrontPerYear":"{hours} heures d\'avance (par an)","perMonth":"/mois","perYear":"/an","perMonthShort":"/mois","approxPerMonth":"(~${price}/mois)","starter":"Starter","pro":"Pro","power":"Power","mostPopular":"Le plus populaire","seeAllPlans":"Voir tous les forfaits","maybeLater":"Plus tard"}}',
      ),
      de: JSON.parse(
        '{"common":{"start":"Starten","stop":"Stoppen","cancel":"Abbrechen","confirm":"Bestätigen","delete":"Löschen","save":"Speichern","close":"Schließen","loading":"Wird geladen...","error":"Fehler","success":"Erfolg","gotIt":"Verstanden"},"signIn":{"headline":"Echtzeit-Übersetzung und Synchronisation","feature1":"Natürlich klingende Stimmen mit verschiedenen Akzenten und Stilen","feature2":"50 Sprachen, mit datenschutzfreundlichem lokalem Verlauf","feature3":"Podcasts in jeder Sprache verstehen","continueWithGoogle":"Mit Google fortfahren"},"popup":{"sourceLanguage":"Ausgangssprache","translateTo":"Übersetzen nach","automaticDetection":"Automatische Erkennung","searchLanguages":"Sprachen suchen...","remainingTime":"Verbleibende Zeit","currentPage":"Aktuelle Seite:","startTranslation":"🌐 Übersetzung auf dieser Seite starten","stopButton":"⏹ Stoppen","connected":"✓ Verbunden - in diesem Tab starten","starting":"Wird gestartet...","stopping":"Wird gestoppt...","viewHistory":"Transkriptionsverlauf anzeigen","upgradeButton":"Upgrade für mehr Zeit","minutesExhausted":"Zeit aufgebraucht","freeMinutesExhausted":"Sie haben Ihre kostenlose Zeit bei DubTab aufgebraucht.\\n\\nBitte upgraden Sie Ihren Plan, um mehr Zeit zu erhalten.","paidMinutesExhausted":"Sie haben die Zeit Ihres aktuellen Plans aufgebraucht. Die Zeit wird mit dem nächsten Abrechnungszeitraum zurückgesetzt.","paidMinutesExhaustedWithDate":"Sie haben die Zeit Ihres aktuellen Plans aufgebraucht.\\n\\nIhre Zeit wird am {date} zurückgesetzt.","billingIssue":"Abrechnungsproblem","billingIssueMessage":"Ihr Abonnement-Status ist \'{status}\'. Bitte führen Sie zunächst die Zahlung durch oder aktualisieren Sie Ihre Zahlungsmethode im Kundenportal.","pageDetectionFailed":"⚠️ Seitenerkennung fehlgeschlagen","cannotDetectPage":"Aktuelle Seite kann nicht erkannt werden. Bitte versuchen Sie es erneut.","cannotStartOnPage":"Auf dieser Seite nicht möglich","pageNotSupported":"Diese Seite unterstützt keine Audio-Aufnahme.\\n\\nBitte öffnen Sie eine Video-Website (YouTube, Netflix usw.) und versuchen Sie es erneut.","audioCaptureError":"⚠️ Audio-Aufnahmefehler","audioCaptureErrorMessage":"Tab-Audio konnte nicht aufgenommen werden. Bitte aktualisieren Sie die Seite und versuchen Sie es erneut.","quickStart":"Schnellstart","step1":"Spielen Sie ein Video oder Audio ab (YouTube, Netflix usw.)","step2":"Klicken Sie auf \\"Starten\\" — Sie sehen Untertitel UND hören die Übersetzung","tip":"💡 Stellen Sie sicher, dass Audio auf der Seite abgespielt wird, bevor Sie starten","instructionTip":"💡 Öffnen Sie eine Seite mit laufendem Video oder Audio (YouTube, Twitch, Zoom usw.) und klicken Sie dann auf","instructionStart":"Starten","instructionOnPage":"auf dieser Seite.","planMinutes":"Plan","extraLifetime":"Extra (lebenslang)","sourceLanguageTipsTitle":"Tipps zur Ausgangssprache","sourceLanguageTipSingle":"Einsprachiges Audio → Manuelle Auswahl kann die Genauigkeit verbessern","sourceLanguageTipMultiple":"Mehrere Sprachen → Automatische Erkennung verwenden"},"account":{"title":"Kontoinformationen","email":"E-Mail","plan":"Plan","status":"Status","nextBillingDate":"Nächstes Abrechnungsdatum","endDate":"Enddatum","minutesResetDate":"Zeit-Zurücksetzungsdatum","logOut":"Abmelden","manageSubscription":"Abonnement verwalten","uiLanguage":"Oberflächensprache","uiLanguageTooltip":"Diese Einstellung betrifft nur die Schaltflächen und Texte der Oberfläche, nicht die Untertitel- oder Übersetzungssprachen.","noSubscriptionFound":"Kein Abonnement gefunden","noSubscriptionMessage":"Sie haben noch kein Abonnement. Upgraden Sie, um Ihr Abonnement zu verwalten!","upgrade":"Upgraden"},"history":{"title":"Verlauf","reviewSessions":"Überprüfen Sie Ihre vergangenen Sitzungen","loading":"Verlauf wird geladen...","noSessionSelected":"Keine Sitzung ausgewählt","selectSession":"Wählen Sie eine Sitzung aus der Liste, um Transkriptionen anzuzeigen.","clearAllTitle":"Gesamten Verlauf löschen? Dies kann nicht rückgängig gemacht werden.","deleteSessionTitle":"Diese Sitzung löschen? Dies kann nicht rückgängig gemacht werden.","sessionDeleted":"Sitzung gelöscht","historyCleared":"Verlauf gelöscht","failedToDelete":"Sitzung konnte nicht gelöscht werden","failedToClear":"Verlauf konnte nicht gelöscht werden","failedToLoad":"Verlaufsdaten konnten nicht geladen werden.","notSignedIn":"Nicht angemeldet. Bitte melden Sie sich an, um den Verlauf anzuzeigen.","cannotDeleteRunning":"Laufende Sitzung kann nicht gelöscht werden. Bitte stoppen Sie sie zuerst.","cannotClearRunning":"Verlauf kann nicht gelöscht werden, während Sitzungen laufen. Bitte stoppen Sie sie zuerst.","untitledSession":"Unbenannte Sitzung","ongoing":"Laufend","clearAll":"Alles löschen","sessions":"Sitzungen","noSessions":"Noch keine Sitzungen","startNewSession":"Starten Sie eine Übersetzung, um Ihren Verlauf hier zu sehen.","copyAll":"Alles kopieren","export":"Exportieren","exportWord":"Word","exportTxt":"TXT","copied":"Kopiert!","failedToCopy":"Kopieren fehlgeschlagen","exportSuccess":"Erfolgreich exportiert","exportFailed":"Export fehlgeschlagen","starredOnly":"Nur Favoriten","searchPlaceholder":"Transkriptionen durchsuchen...","duration":"Dauer","from":"Von","to":"Bis","segments":"Segmente","noTranscripts":"Keine Transkriptionen in dieser Sitzung.","clickStar":"Klicken Sie auf das Stern-Symbol, um wichtige Segmente zu speichern."},"overlay":{"listening":"Hören auf Video/Audio auf dieser Seite","listeningTab":"Hören auf Audio in diesem Tab","listeningTabDesc":"Stellen Sie sicher, dass das Video abgespielt wird und nicht stummgeschaltet ist. Untertitel werden automatisch angezeigt.","listeningPageChangeDesc":"Sie haben eine neue Seite geöffnet. Untertitel werden automatisch fortgesetzt, wenn Video/Audio startet.","starting":"Wird gestartet...","translating":"Übersetzung läuft","stopped":"Gestoppt","clickStartToResume":"Zum Fortsetzen auf Start klicken","waitingForAudio":"Warte auf Audio...","makeSureVideoPlaying":"Stellen Sie sicher, dass das Video läuft und nicht stummgeschaltet ist","resizeTooltip":"Ziehen Sie die Ecke, um die Größe zu ändern","stopTabUpdated":"Untertitel wurden pausiert, weil dieser Tab die Seite gewechselt hat. Klicken Sie auf Start, um fortzufahren.","stopTabRemoved":"Die Untertitel wurden gestoppt, weil der Tab geschlossen wurde.","stopTabReplaced":"Die Untertitel wurden gestoppt, weil der Tab ersetzt wurde.","stopNoAudioTimeout":"Eine Weile wurde kein Audio erkannt, daher wurde DubTab automatisch gestoppt. Klicken Sie auf Start, um es wieder einzuschalten.","pauseCaption":"Untertitel pausieren","resumeCaption":"Untertitel fortsetzen","bilingualMode":"Beide","translationOnly":"Übersetzung","originalOnly":"Nur Original","settings":"Einstellungen","close":"Schließen","scrollToBottom":"Nach unten scrollen","fontSize":"Schriftgröße","fontSizeSmall":"Klein","fontSizeMedium":"Mittel","fontSizeLarge":"Groß","fontSizeXLarge":"Sehr groß","theme":"Design","themeDark":"Dunkel","themeLight":"Hell","opacity":"Hintergrund-Transparenz","reset":"Zurücksetzen","upgradeRequired":"Upgrade erforderlich","freeQuotaExhausted":"Ihre kostenlose Zeit ist aufgebraucht.\\n\\nUpgraden Sie, um weiterhin Echtzeit-Übersetzung zu genießen.","upgradeNow":"Jetzt upgraden","maybeLater":"Vielleicht später","followVoice":"Stimme folgen","followVoiceTooltip":"Der aktuellen TTS-Stimme folgen"},"dock":{"ready":"Bereit","connecting":"Verbinden...","translating":"Übersetzung läuft","error":"Fehler","pause":"Pause","sessionTime":"Sitzungszeit","selectVoice":"Stimme auswählen","audioMixer":"Audio-Mixer","subtitleMode":"Untertitelmodus","captionPanel":"Untertitel-Panel","cinemaMode":"Kino-Modus","panel":"Panel","cinema":"Kino","audioOnly":"Nur Audio","voiceOn":"Übersetzte Stimme ein","voiceOff":"Übersetzte Stimme aus","voice":"Stimme","settings":"Einstellungen","close":"Schließen"},"voiceSelector":{"title":"STIMME","auto":"Auto","loadingVoices":"Lade Stimmen...","noVoices":"Keine Stimmen verfügbar","favorites":"FAVORITEN","moreVoices":"WEITERE STIMMEN","switchingToVoice":"Wechsle zur neuen Stimme: {voiceName}","previousVoiceFallback":"Ihre vorherige Stimme","newVoiceFallback":"eine neue Stimme","voiceUnavailableSwitched":"Ihre vorherige Stimme „{previousVoice}“ ist nicht mehr verfügbar. Zu „{nextVoice}“ gewechselt."},"audioMixer":{"title":"AUDIO-MIXER","originalAudio":"Original-Audio","translatedVoice":"Übersetzte Stimme","voiceOnly":"Nur Synchronisation","balanced":"Ausgewogen","originalOnly":"Nur Original","audioDucking":"Audio-Ducking","audioDuckingDesc":"Tab-Audio während Sprachausgabe senken","originalDuringVoice":"Original-Audio während Sprachausgabe","normalVolume":"Normal","duringVoice":"Während Sprachausgabe"},"settingsPanel":{"title":"EINSTELLUNGEN","captionPanelFontSize":"Untertitel-Panel Schriftgröße","cinemaModeFontSize":"Kino-Modus Schriftgröße","backgroundOpacity":"Hintergrund-Transparenz","theme":"Design","darkTheme":"🌙 Dunkel","lightTheme":"☀️ Hell","resetSettings":"Einstellungen zurücksetzen","resetDesc":"Alle Einstellungen auf Standardwerte zurücksetzen","resetButton":"🔄 Auf Standard zurücksetzen","resetComplete":"✓ Zurücksetzen abgeschlossen","subtitleDisplay":"Untertitelanzeige","showBothLanguages":"Beide Sprachen anzeigen","captionOrder":"Untertitelreihenfolge","originalFirst":"Original zuerst","translationFirst":"Übersetzung zuerst","tooltipOriginal":"① Original","tooltipTranslation":"① Übersetzung"},"quotaModal":{"freeTitle":"Ihre kostenlosen 10 Minuten sind aufgebraucht.","freeSubtitle":"Um Echtzeit-Übersetzung und Synchronisation fortzusetzen:","paidTitleTemplate":"Sie haben alle {plan}-Stunden dieses Monats aufgebraucht.","paidTitle":"Zeit aufgebraucht","paidSubtitleBuyMore":"Um DubTab für den Rest dieses Monats zu nutzen, fügen Sie zusätzliche lebenslange Stunden hinzu:","paidSubtitleReached":"Sie haben Ihr monatliches Limit erreicht. Diese Sitzung wurde pausiert, um zusätzliche Kosten zu vermeiden.","renewalInfo":"Ihre Zeit wird am {date} zurückgesetzt","extraHoursPack":"Zusätzliche Stunden","smallPack":"Kleines Paket","smallPackDesc":"1 zusätzliche Stunde · lebenslang, einmaliger Kauf","standardPack":"Standardpaket","standardPackDesc":"4 zusätzliche Stunden · lebenslang, einmaliger Kauf","largePack":"Großes Paket","largePackDesc":"15 zusätzliche Stunden · lebenslang, einmaliger Kauf","processing":"Wird verarbeitet...","openingStripeCheckout":"Stripe Checkout wird geöffnet","monthly":"Monatlich","yearly":"Jährlich","upfront":"Im Voraus","toggleHint":"Alle Stunden im Voraus · Kein monatliches Reset","hoursPerMonth":"{hours} Stunden/Monat","hoursUpfrontPerYear":"{hours} Stunden im Voraus (pro Jahr)","perMonth":"/Monat","perYear":"/Jahr","perMonthShort":"/Mo.","approxPerMonth":"(~${price}/Mo.)","starter":"Starter","pro":"Pro","power":"Power","mostPopular":"Beliebteste","seeAllPlans":"Alle Pläne anzeigen","maybeLater":"Vielleicht später"}}',
      ),
      es: JSON.parse(
        '{"common":{"start":"Iniciar","stop":"Detener","cancel":"Cancelar","confirm":"Confirmar","delete":"Eliminar","save":"Guardar","close":"Cerrar","loading":"Cargando...","error":"Error","success":"Éxito","gotIt":"Entendido"},"signIn":{"headline":"Traducción y doblaje en tiempo real","feature1":"Voces naturales con múltiples acentos y estilos","feature2":"50 idiomas, con historial local que prioriza la privacidad","feature3":"Entender podcasts en cualquier idioma","continueWithGoogle":"Continuar con Google"},"popup":{"sourceLanguage":"Idioma de origen","translateTo":"Traducir a","automaticDetection":"Detección automática","searchLanguages":"Buscar idiomas...","remainingTime":"Tiempo restante","currentPage":"Página actual:","startTranslation":"🌐 Iniciar traducción en esta página","stopButton":"⏹ Detener","connected":"✓ Conectado - iniciar en esta pestaña","starting":"Iniciando...","stopping":"Deteniendo...","viewHistory":"Ver historial de transcripciones","upgradeButton":"Mejorar plan para más tiempo","minutesExhausted":"Tiempo agotado","freeMinutesExhausted":"Has usado todo tu tiempo gratuito en DubTab.\\n\\nPor favor, mejora tu plan para obtener más tiempo.","paidMinutesExhausted":"Has usado todo el tiempo de tu plan actual. El tiempo se reiniciará en tu próximo ciclo de facturación.","paidMinutesExhaustedWithDate":"Has usado todo el tiempo de tu plan actual.\\n\\nTu tiempo se reiniciará el {date}.","billingIssue":"Problema de facturación","billingIssueMessage":"Tu suscripción está en estado \\"{status}\\". Por favor, realiza el pago o actualiza tu método de pago en el portal del cliente primero.","pageDetectionFailed":"⚠️ Error al detectar la página","cannotDetectPage":"No se puede detectar la página actual. Por favor, inténtalo de nuevo.","cannotStartOnPage":"No se puede iniciar en esta página","pageNotSupported":"Esta página no admite captura de audio.\\n\\nPor favor, abre un sitio de videos (YouTube, Netflix, etc.) e inténtalo de nuevo.","audioCaptureError":"⚠️ Error de captura de audio","audioCaptureErrorMessage":"No se pudo capturar el audio de la pestaña. Por favor, actualiza la página e inténtalo de nuevo.","quickStart":"Inicio rápido","step1":"Reproduce un video o audio (YouTube, Netflix, etc.)","step2":"Haz clic en \\"Iniciar\\" — verás subtítulos Y escucharás la traducción","tip":"💡 Asegúrate de que el audio esté reproduciéndose en la página antes de iniciar","instructionTip":"💡 Abre una página con un video o audio reproduciéndose (YouTube, Twitch, Zoom, etc.) y luego haz clic en","instructionStart":"Iniciar","instructionOnPage":"en esa página.","planMinutes":"Plan","extraLifetime":"Extra (de por vida)","sourceLanguageTipsTitle":"Consejos de idioma de origen","sourceLanguageTipSingle":"Audio en un solo idioma → seleccionarlo puede mejorar la precisión","sourceLanguageTipMultiple":"Varios idiomas → usar detección automática"},"account":{"title":"Información de la cuenta","email":"Correo electrónico","plan":"Plan","status":"Estado","nextBillingDate":"Próxima fecha de facturación","endDate":"Fecha de fin","minutesResetDate":"Fecha de reinicio del tiempo","logOut":"Cerrar sesión","manageSubscription":"Gestionar suscripción","uiLanguage":"Idioma de la interfaz","uiLanguageTooltip":"Esta configuración solo afecta los botones y el texto de la interfaz, no los subtítulos ni los idiomas de traducción.","noSubscriptionFound":"No se encontró suscripción","noSubscriptionMessage":"Aún no tienes una suscripción. ¡Mejora tu plan para gestionarla!","upgrade":"Mejorar plan"},"history":{"title":"Historial","reviewSessions":"Revisa tus sesiones anteriores","loading":"Cargando historial...","noSessionSelected":"Ninguna sesión seleccionada","selectSession":"Selecciona una sesión de la lista para ver las transcripciones.","clearAllTitle":"¿Borrar todo el historial? Esta acción no se puede deshacer.","deleteSessionTitle":"¿Eliminar esta sesión? Esta acción no se puede deshacer.","sessionDeleted":"Sesión eliminada","historyCleared":"Historial borrado","failedToDelete":"Error al eliminar la sesión","failedToClear":"Error al borrar el historial","failedToLoad":"Error al cargar los datos del historial.","notSignedIn":"No has iniciado sesión. Por favor, inicia sesión para ver el historial.","cannotDeleteRunning":"No se puede eliminar una sesión en curso. Por favor, detenla primero.","cannotClearRunning":"No se puede borrar el historial mientras hay sesiones en curso. Por favor, detenllas primero.","untitledSession":"Sesión sin título","ongoing":"En curso","clearAll":"Borrar todo","sessions":"Sesiones","noSessions":"Aún no hay sesiones","startNewSession":"Inicia una traducción para ver tu historial aquí.","copyAll":"Copiar todo","export":"Exportar","exportWord":"Word","exportTxt":"TXT","copied":"¡Copiado!","failedToCopy":"Error al copiar","exportSuccess":"Exportación exitosa","exportFailed":"Error al exportar","starredOnly":"Solo favoritos","searchPlaceholder":"Buscar transcripciones...","duration":"Duración","from":"Desde","to":"Hasta","segments":"segmentos","noTranscripts":"No hay transcripciones en esta sesión.","clickStar":"Haz clic en el icono de estrella para guardar segmentos importantes."},"overlay":{"listening":"Escuchando video/audio en esta página","listeningTab":"Escuchando audio en esta pestaña","listeningTabDesc":"Asegúrate de que el video se esté reproduciendo y no esté silenciado. Los subtítulos aparecerán automáticamente.","listeningPageChangeDesc":"Has abierto una nueva página. Los subtítulos se reanudarán automáticamente cuando comience el video/audio.","starting":"Iniciando...","translating":"Traduciendo","stopped":"Detenido","clickStartToResume":"Haz clic en Start para continuar","waitingForAudio":"Esperando audio...","makeSureVideoPlaying":"Asegúrate de que el video se esté reproduciendo y no esté silenciado","resizeTooltip":"Arrastra la esquina para cambiar el tamaño","stopTabUpdated":"Los subtítulos se pausaron porque esta pestaña cambió de página. Haz clic en Start para continuar.","stopTabRemoved":"Los subtítulos se detuvieron porque la pestaña se cerró.","stopTabReplaced":"Los subtítulos se detuvieron porque la pestaña fue reemplazada.","stopNoAudioTimeout":"No se detectó audio durante un tiempo, así que DubTab se detuvo automáticamente. Haz clic en Start para volver a activarlo.","pauseCaption":"Pausar subtítulos","resumeCaption":"Reanudar subtítulos","bilingualMode":"Ambos","translationOnly":"Traducción","originalOnly":"Solo original","settings":"Ajustes","close":"Cerrar","scrollToBottom":"Ir al final","fontSize":"Tamaño de fuente","fontSizeSmall":"Pequeño","fontSizeMedium":"Mediano","fontSizeLarge":"Grande","fontSizeXLarge":"Muy grande","theme":"Tema","themeDark":"Oscuro","themeLight":"Claro","opacity":"Opacidad del fondo","reset":"Restablecer","upgradeRequired":"Mejora requerida","freeQuotaExhausted":"Tu tiempo gratuito se ha agotado.\\n\\nMejora tu plan para seguir disfrutando de la traducción en tiempo real.","upgradeNow":"Mejorar ahora","maybeLater":"Quizás después","followVoice":"Seguir voz","followVoiceTooltip":"Seguir la voz TTS actual"},"dock":{"ready":"Listo","connecting":"Conectando...","translating":"Traduciendo","error":"Error","pause":"Pausar","sessionTime":"Tiempo de sesión","selectVoice":"Seleccionar voz","audioMixer":"Mezclador de audio","subtitleMode":"Modo de subtítulos","captionPanel":"Panel de subtítulos","cinemaMode":"Modo cine","panel":"Panel","cinema":"Cine","audioOnly":"Solo audio","voiceOn":"Voz traducida activada","voiceOff":"Voz traducida desactivada","voice":"Voz","settings":"Ajustes","close":"Cerrar"},"voiceSelector":{"title":"VOZ","auto":"Auto","loadingVoices":"Cargando voces...","noVoices":"No hay voces disponibles","favorites":"FAVORITOS","moreVoices":"MÁS VOCES","switchingToVoice":"Cambiando a la nueva voz: {voiceName}","previousVoiceFallback":"tu voz anterior","newVoiceFallback":"una nueva voz","voiceUnavailableSwitched":"Tu voz anterior \\"{previousVoice}\\" ya no está disponible. Se cambió a \\"{nextVoice}\\"."},"audioMixer":{"title":"MEZCLADOR DE AUDIO","originalAudio":"Audio original","translatedVoice":"Voz traducida","voiceOnly":"Solo doblaje","balanced":"Equilibrado","originalOnly":"Solo original","audioDucking":"Atenuación de audio","audioDuckingDesc":"Bajar audio de la pestaña durante la voz","originalDuringVoice":"Audio original durante la voz","normalVolume":"Normal","duringVoice":"Durante la voz"},"settingsPanel":{"title":"AJUSTES","captionPanelFontSize":"Tamaño de fuente del panel","cinemaModeFontSize":"Tamaño de fuente modo cine","backgroundOpacity":"Opacidad del fondo","theme":"Tema","darkTheme":"🌙 Oscuro","lightTheme":"☀️ Claro","resetSettings":"Restablecer ajustes","resetDesc":"Restaurar todos los ajustes a sus valores predeterminados","resetButton":"🔄 Restablecer valores","resetComplete":"✓ Restablecimiento completado","subtitleDisplay":"Visualización de subtítulos","showBothLanguages":"Mostrar ambos idiomas","captionOrder":"Orden de subtítulos","originalFirst":"Original primero","translationFirst":"Traducción primero","tooltipOriginal":"① Original","tooltipTranslation":"① Traducción"},"quotaModal":{"freeTitle":"Has usado tus 10 minutos gratis.","freeSubtitle":"Para seguir con traducción y doblaje en tiempo real:","paidTitleTemplate":"Has usado todas las horas de {plan} de este mes.","paidTitle":"Tiempo agotado","paidSubtitleBuyMore":"Para seguir usando DubTab este mes, añade horas extra de por vida:","paidSubtitleReached":"Has alcanzado tu límite mensual. Esta sesión está pausada para evitar cargos adicionales.","renewalInfo":"Tu tiempo se reiniciará el {date}","extraHoursPack":"Paquete de horas extra","smallPack":"Paquete pequeño","smallPackDesc":"1 hora extra · de por vida, compra única","standardPack":"Paquete estándar","standardPackDesc":"4 horas extra · de por vida, compra única","largePack":"Paquete grande","largePackDesc":"15 horas extra · de por vida, compra única","processing":"Procesando...","openingStripeCheckout":"Abriendo pago en Stripe","monthly":"Mensual","yearly":"Anual","upfront":"Por adelantado","toggleHint":"Todas las horas por adelantado • Sin reinicio mensual","hoursPerMonth":"{hours} horas/mes","hoursUpfrontPerYear":"{hours} horas por adelantado (al año)","perMonth":"/mes","perYear":"/año","perMonthShort":"/mes","approxPerMonth":"(~${price}/mes)","starter":"Starter","pro":"Pro","power":"Power","mostPopular":"Más popular","seeAllPlans":"Ver todos los planes","maybeLater":"Quizás después"}}',
      ),
      "pt-BR": JSON.parse(
        '{"common":{"start":"Iniciar","stop":"Parar","cancel":"Cancelar","confirm":"Confirmar","delete":"Excluir","save":"Salvar","close":"Fechar","loading":"Carregando...","error":"Erro","success":"Sucesso","gotIt":"Entendi"},"signIn":{"headline":"Tradução e dublagem em tempo real","feature1":"Vozes com sons naturais e vários sotaques e estilos","feature2":"50 idiomas, com histórico local que prioriza a privacidade","feature3":"Entender podcasts em qualquer idioma","continueWithGoogle":"Continuar com Google"},"popup":{"sourceLanguage":"Idioma de origem","translateTo":"Traduzir para","automaticDetection":"Detecção automática","searchLanguages":"Buscar idiomas...","remainingTime":"Tempo restante","currentPage":"Página atual:","startTranslation":"🌐 Iniciar tradução nesta página","stopButton":"⏹ Parar","connected":"✓ Conectado - iniciar nesta aba","starting":"Iniciando...","stopping":"Parando...","viewHistory":"Ver histórico de transcrições","upgradeButton":"Fazer upgrade para mais tempo","minutesExhausted":"Tempo esgotado","freeMinutesExhausted":"Você usou todo o seu tempo gratuito no DubTab.\\n\\nPor favor, faça upgrade do seu plano para ter mais tempo.","paidMinutesExhausted":"Você usou todo o tempo do seu plano atual. O tempo será ressetado no próximo ciclo de cobrança.","paidMinutesExhaustedWithDate":"Você usou todo o tempo do seu plano atual.\\n\\nSeu tempo será resetado em {date}.","billingIssue":"Problema de cobrança","billingIssueMessage":"Sua assinatura está com status \\"{status}\\". Por favor, efetue o pagamento ou atualize seu método de pagamento no portal do cliente primeiro.","pageDetectionFailed":"⚠️ Falha na detecção da página","cannotDetectPage":"Não foi possível detectar a página atual. Por favor, tente novamente.","cannotStartOnPage":"Não é possível iniciar nesta página","pageNotSupported":"Esta página não suporta captura de áudio.\\n\\nPor favor, abra um site de vídeos (YouTube, Netflix, etc.) e tente novamente.","audioCaptureError":"⚠️ Erro de captura de áudio","audioCaptureErrorMessage":"Não foi possível capturar o áudio da aba. Por favor, atualize a página e tente novamente.","quickStart":"Início rápido","step1":"Reproduza um vídeo ou áudio (YouTube, Netflix, etc.)","step2":"Clique em \\"Iniciar\\" — você verá legendas E ouvirá a tradução","tip":"💡 Certifique-se de que o áudio esteja tocando na página antes de iniciar","instructionTip":"💡 Abra uma página com um vídeo ou áudio tocando (YouTube, Twitch, Zoom, etc.) e clique em","instructionStart":"Iniciar","instructionOnPage":"nessa página.","planMinutes":"Plano","extraLifetime":"Extra (vitalício)","sourceLanguageTipsTitle":"Dicas de idioma de origem","sourceLanguageTipSingle":"Áudio em um único idioma → selecioná-lo pode melhorar a precisão","sourceLanguageTipMultiple":"Vários idiomas → usar detecção automática"},"account":{"title":"Informações da conta","email":"E-mail","plan":"Plano","status":"Status","nextBillingDate":"Próxima data de cobrança","endDate":"Data de término","minutesResetDate":"Data de reset do tempo","logOut":"Sair","manageSubscription":"Gerenciar assinatura","uiLanguage":"Idioma da interface","uiLanguageTooltip":"Esta configuração afeta apenas os botões e textos da interface, não as legendas ou os idiomas de tradução.","noSubscriptionFound":"Nenhuma assinatura encontrada","noSubscriptionMessage":"Você ainda não tem uma assinatura. Faça upgrade para gerenciá-la!","upgrade":"Fazer upgrade"},"history":{"title":"Histórico","reviewSessions":"Revise suas sessões anteriores","loading":"Carregando histórico...","noSessionSelected":"Nenhuma sessão selecionada","selectSession":"Selecione uma sessão da lista para ver as transcrições.","clearAllTitle":"Limpar todo o histórico? Esta ação não pode ser desfeita.","deleteSessionTitle":"Excluir esta sessão? Esta ação não pode ser desfeita.","sessionDeleted":"Sessão excluída","historyCleared":"Histórico limpo","failedToDelete":"Falha ao excluir sessão","failedToClear":"Falha ao limpar histórico","failedToLoad":"Falha ao carregar dados do histórico.","notSignedIn":"Você não está logado. Por favor, faça login para ver o histórico.","cannotDeleteRunning":"Não é possível excluir uma sessão em andamento. Por favor, pare-a primeiro.","cannotClearRunning":"Não é possível limpar o histórico enquanto há sessões em andamento. Por favor, pare-as primeiro.","untitledSession":"Sessão sem título","ongoing":"Em andamento","clearAll":"Limpar tudo","sessions":"Sessões","noSessions":"Nenhuma sessão ainda","startNewSession":"Inicie uma tradução para ver seu histórico aqui.","copyAll":"Copiar tudo","export":"Exportar","exportWord":"Word","exportTxt":"TXT","copied":"Copiado!","failedToCopy":"Falha ao copiar","exportSuccess":"Exportação bem-sucedida","exportFailed":"Falha na exportação","starredOnly":"Apenas favoritos","searchPlaceholder":"Buscar transcrições...","duration":"Duração","from":"De","to":"Até","segments":"segmentos","noTranscripts":"Nenhuma transcrição nesta sessão.","clickStar":"Clique no ícone de estrela para salvar segmentos importantes."},"overlay":{"listening":"Ouvindo vídeo/áudio nesta página","listeningTab":"Ouvindo áudio nesta aba","listeningTabDesc":"Certifique-se de que o vídeo está reproduzindo e não está mudo. As legendas aparecerão automaticamente.","listeningPageChangeDesc":"Você abriu uma nova página. As legendas serão retomadas automaticamente quando o vídeo/áudio começar.","starting":"Iniciando...","translating":"Traduzindo","stopped":"Parado","clickStartToResume":"Clique em Start para continuar","waitingForAudio":"Aguardando áudio...","makeSureVideoPlaying":"Verifique se o vídeo está reproduzindo e não está no mudo","resizeTooltip":"Arraste o canto para redimensionar","stopTabUpdated":"As legendas foram pausadas porque esta aba mudou de página. Clique em Start para continuar.","stopTabRemoved":"As legendas foram interrompidas porque a aba foi fechada.","stopTabReplaced":"As legendas foram interrompidas porque a aba foi substituída.","stopNoAudioTimeout":"Nenhum áudio foi detectado por um tempo, então o DubTab parou automaticamente. Clique em Start para ativar novamente.","pauseCaption":"Pausar legendas","resumeCaption":"Retomar legendas","bilingualMode":"Ambos","translationOnly":"Tradução","originalOnly":"Apenas original","settings":"Configurações","close":"Fechar","scrollToBottom":"Ir para o final","fontSize":"Tamanho da fonte","fontSizeSmall":"Pequeno","fontSizeMedium":"Médio","fontSizeLarge":"Grande","fontSizeXLarge":"Extra grande","theme":"Tema","themeDark":"Escuro","themeLight":"Claro","opacity":"Opacidade do fundo","reset":"Resetar","upgradeRequired":"Upgrade necessário","freeQuotaExhausted":"Seu tempo gratuito acabou.\\n\\nFaça upgrade para continuar aproveitando a tradução em tempo real.","upgradeNow":"Fazer upgrade agora","maybeLater":"Talvez depois","followVoice":"Seguir voz","followVoiceTooltip":"Seguir a voz TTS atual"},"dock":{"ready":"Pronto","connecting":"Conectando...","translating":"Traduzindo","error":"Erro","pause":"Pausar","sessionTime":"Tempo de sessão","selectVoice":"Selecionar voz","audioMixer":"Mixer de áudio","subtitleMode":"Modo de legendas","captionPanel":"Painel de legendas","cinemaMode":"Modo cinema","panel":"Painel","cinema":"Cinema","audioOnly":"Somente áudio","voiceOn":"Voz traduzida ativada","voiceOff":"Voz traduzida desativada","voice":"Voz","settings":"Configurações","close":"Fechar"},"voiceSelector":{"title":"VOZ","auto":"Auto","loadingVoices":"Carregando vozes...","noVoices":"Nenhuma voz disponível","favorites":"FAVORITOS","moreVoices":"MAIS VOZES","switchingToVoice":"Mudando para a nova voz: {voiceName}","previousVoiceFallback":"sua voz anterior","newVoiceFallback":"uma nova voz","voiceUnavailableSwitched":"Sua voz anterior \\"{previousVoice}\\" não está mais disponível. Mudamos para \\"{nextVoice}\\"."},"audioMixer":{"title":"MIXER DE ÁUDIO","originalAudio":"Áudio original","translatedVoice":"Voz traduzida","voiceOnly":"Apenas dublagem","balanced":"Balanceado","originalOnly":"Apenas original","audioDucking":"Atenuação de áudio","audioDuckingDesc":"Diminuir áudio da aba durante a voz","originalDuringVoice":"Áudio original durante a voz","normalVolume":"Normal","duringVoice":"Durante a voz"},"settingsPanel":{"title":"CONFIGURAÇÕES","captionPanelFontSize":"Tamanho da fonte do painel","cinemaModeFontSize":"Tamanho da fonte modo cinema","backgroundOpacity":"Opacidade do fundo","theme":"Tema","darkTheme":"🌙 Escuro","lightTheme":"☀️ Claro","resetSettings":"Redefinir configurações","resetDesc":"Restaurar todas as configurações para os valores padrão","resetButton":"🔄 Redefinir para padrão","resetComplete":"✓ Redefinição concluída","subtitleDisplay":"Exibição de legendas","showBothLanguages":"Mostrar ambos os idiomas","captionOrder":"Ordem das legendas","originalFirst":"Original primeiro","translationFirst":"Tradução primeiro","tooltipOriginal":"① Original","tooltipTranslation":"① Tradução"},"quotaModal":{"freeTitle":"Você usou seus 10 minutos grátis.","freeSubtitle":"Para continuar com tradução e dublagem em tempo real:","paidTitleTemplate":"Você usou todas as horas do {plan} deste mês.","paidTitle":"Tempo esgotado","paidSubtitleBuyMore":"Para continuar usando o DubTab este mês, adicione horas extras vitalícias:","paidSubtitleReached":"Você atingiu seu limite mensal. Esta sessão foi pausada para evitar cobranças adicionais.","renewalInfo":"Seu tempo será resetado em {date}","extraHoursPack":"Pacote de horas extras","smallPack":"Pacote pequeno","smallPackDesc":"1 hora extra · vitalício, compra única","standardPack":"Pacote padrão","standardPackDesc":"4 horas extras · vitalício, compra única","largePack":"Pacote grande","largePackDesc":"15 horas extras · vitalício, compra única","processing":"Processando...","openingStripeCheckout":"Abrindo pagamento Stripe","monthly":"Mensal","yearly":"Anual","upfront":"Antecipado","toggleHint":"Todas as horas de uma vez • Sem reset mensal","hoursPerMonth":"{hours} horas/mês","hoursUpfrontPerYear":"{hours} horas antecipadas (por ano)","perMonth":"/mês","perYear":"/ano","perMonthShort":"/mês","approxPerMonth":"(~${price}/mês)","starter":"Starter","pro":"Pro","power":"Power","mostPopular":"Mais popular","seeAllPlans":"Ver todos os planos","maybeLater":"Talvez depois"}}',
      ),
    },
    Cr = "en",
    Er = xr;
  function Pr() {
    var e = navigator.language || navigator.userLanguage || "en";
    if (_r[e]) return e;
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
    var n = e.split("-")[0];
    return _r[n] ? n : "en";
  }
  function Or() {
    return Mr.apply(this, arguments);
  }
  function Mr() {
    return (Mr = Tr(
      wr().mark(function e() {
        return wr().wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return e.abrupt(
                  "return",
                  new Promise(function (e) {
                    chrome.storage.sync.get(["uiLanguage"], function (t) {
                      if (t.uiLanguage && _r[t.uiLanguage])
                        ((Cr = t.uiLanguage), (Er = _r[Cr]), e(Cr));
                      else {
                        var n = Pr();
                        ((Cr = n),
                          (Er = _r[n]),
                          chrome.storage.sync.set({ uiLanguage: n }),
                          e(n));
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
  function Lr() {
    return zr.apply(this, arguments);
  }
  function zr() {
    return (zr = Tr(
      wr().mark(function e() {
        return wr().wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                return ((e.next = 2), Or());
              case 2:
                return e.abrupt("return", Cr);
              case 3:
              case "end":
                return e.stop();
            }
        }, e);
      }),
    )).apply(this, arguments);
  }
  function Nr() {
    return Er;
  }
  var Ar = {
      dark: {
        containerBg: "40,40,40",
        topBarBg: "rgba(30,30,30,0.95)",
        topBarBorder: "rgba(255,255,255,0.15)",
        textPrimary: "rgba(255,255,255,0.9)",
        textSecondary: "rgba(255,255,255,0.7)",
        textTranslate: "rgba(255,255,255,0.95)",
        textOriginal: "rgba(255,255,255,0.7)",
        settingsPanelBg: "rgba(30,30,30,0.98)",
        lineBorder: "rgba(255,255,255,0.05)",
        buttonBg: "rgba(255,255,255,0.1)",
        buttonBorder: "rgba(255,255,255,0.2)",
        buttonHoverBg: "rgba(255,255,255,0.2)",
        dockBg: "rgba(24,24,27,0.95)",
        dockBorder: "rgba(255,255,255,0.1)",
        accentColor: "rgba(99,102,241,1)",
        accentColorHover: "rgba(129,140,248,1)",
      },
      light: {
        containerBg: "245,245,245",
        topBarBg: "rgba(255,255,255,0.95)",
        topBarBorder: "rgba(0,0,0,0.1)",
        textPrimary: "rgba(0,0,0,0.9)",
        textSecondary: "rgba(0,0,0,0.65)",
        textTranslate: "rgba(0,0,0,0.9)",
        textOriginal: "rgba(0,0,0,0.65)",
        settingsPanelBg: "rgba(255,255,255,0.98)",
        lineBorder: "rgba(0,0,0,0.08)",
        buttonBg: "rgba(0,0,0,0.05)",
        buttonBorder: "rgba(0,0,0,0.15)",
        buttonHoverBg: "rgba(0,0,0,0.1)",
        dockBg: "rgba(255,255,255,0.95)",
        dockBorder: "rgba(0,0,0,0.1)",
        accentColor: "rgba(99,102,241,1)",
        accentColorHover: "rgba(79,70,229,1)",
      },
    },
    Dr = {
      dragHandle:
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">\n    <circle cx="4" cy="3" r="1.5"/>\n    <circle cx="4" cy="8" r="1.5"/>\n    <circle cx="4" cy="13" r="1.5"/>\n    <circle cx="11" cy="3" r="1.5"/>\n    <circle cx="11" cy="8" r="1.5"/>\n    <circle cx="11" cy="13" r="1.5"/>\n  </svg>',
      play: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">\n    <path d="M8 5v14l11-7z"/>\n  </svg>',
      pause:
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">\n    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>\n  </svg>',
      power:
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n    <path d="M18.36 6.64a9 9 0 1 1-12.73 0"/>\n    <line x1="12" y1="2" x2="12" y2="12"/>\n  </svg>',
      volumeHigh:
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>\n    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>\n    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>\n  </svg>',
      settings:
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n    <circle cx="12" cy="12" r="3"/>\n    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>\n  </svg>',
      close:
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n    <line x1="18" y1="6" x2="6" y2="18"/>\n    <line x1="6" y1="6" x2="18" y2="18"/>\n  </svg>',
      chevronDown:
        '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n    <polyline points="6 9 12 15 18 9"/>\n  </svg>',
      music:
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n    <path d="M9 18V5l12-2v13"/>\n    <circle cx="6" cy="18" r="3"/>\n    <circle cx="18" cy="16" r="3"/>\n  </svg>',
      mic: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>\n    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>\n    <line x1="12" y1="19" x2="12" y2="23"/>\n    <line x1="8" y1="23" x2="16" y2="23"/>\n  </svg>',
      voice:
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n    <circle cx="9" cy="9" r="4"/>\n    <path d="M19 12c1.5-1.5 2.5-3.5 2.5-6S20 1.5 18 0"/>\n  </svg>',
      subtitles:
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n    <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>\n    <line x1="6" y1="15" x2="10" y2="15"></line>\n    <line x1="6" y1="9" x2="18" y2="9"></line>\n  </svg>',
      captionPanel:
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>\n    <line x1="7" y1="8" x2="17" y2="8"></line>\n    <line x1="7" y1="12" x2="17" y2="12"></line>\n    <line x1="7" y1="16" x2="13" y2="16"></line>\n  </svg>',
      waveform:
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">\n    <path d="M12 3v18"/>\n    <path d="M8 7v10"/>\n    <path d="M16 7v10"/>\n    <path d="M4 11v2"/>\n    <path d="M20 11v2"/>\n  </svg>',
      cinemaMode:
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n    <rect x="1" y="5" width="22" height="14" rx="2"></rect>\n    <rect x="4" y="14" width="16" height="3" rx="1" fill="currentColor" opacity="0.4"></rect>\n    <line x1="6" y1="15.5" x2="18" y2="15.5" stroke-width="1.5"></line>\n  </svg>',
      collapse:
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n    <line x1="6" y1="12" x2="18" y2="12"></line>\n  </svg>',
      expand:
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n    <polyline points="6 9 12 15 18 9"></polyline>\n  </svg>',
    };
  function Vr() {
    var e =
        "\n    /* Dock animations */\n    @keyframes bh-fade-in {\n      from { opacity: 0; transform: translateY(-10px); }\n      to { opacity: 1; transform: translateY(0); }\n    }\n\n    @keyframes bh-slide-down {\n      from { opacity: 0; transform: translateY(-8px); }\n      to { opacity: 1; transform: translateY(0); }\n    }\n\n    @keyframes bh-slide-down-center {\n      from { opacity: 0; transform: translate(-50%, -8px); }\n      to { opacity: 1; transform: translate(-50%, 0); }\n    }\n\n    @keyframes bh-slide-up {\n      from { opacity: 0; transform: translateY(20px) scale(0.95); }\n      to { opacity: 1; transform: translateY(0) scale(1); }\n    }\n\n    @keyframes bh-pulse-dot {\n      0%, 100% { opacity: 1; }\n      50% { opacity: 0.5; }\n    }\n\n    @keyframes spin {\n      from { transform: rotate(0deg); }\n      to { transform: rotate(360deg); }\n    }\n\n    @keyframes bh-spin {\n      from { transform: rotate(0deg); }\n      to { transform: rotate(360deg); }\n    }\n\n    /* Slider styles */\n    .bh-dock-slider {\n      -webkit-appearance: none;\n      appearance: none;\n      height: 4px;\n      border-radius: 2px;\n      background: rgba(255,255,255,0.15);\n      outline: none;\n      cursor: pointer;\n      flex: 1;\n    }\n    \n    .bh-dock-slider::-webkit-slider-thumb {\n      -webkit-appearance: none;\n      appearance: none;\n      width: 14px;\n      height: 14px;\n      border-radius: 50%;\n      background: rgba(99,102,241,1);\n      cursor: pointer;\n      transition: transform 0.15s ease;\n    }\n    \n    .bh-dock-slider::-webkit-slider-thumb:hover {\n      transform: scale(1.2);\n    }\n    \n    .bh-dock-slider::-moz-range-thumb {\n      width: 14px;\n      height: 14px;\n      border-radius: 50%;\n      background: rgba(99,102,241,1);\n      cursor: pointer;\n      border: none;\n    }\n    \n    /* Toggle switch */\n    .bh-toggle-switch {\n      position: relative;\n      width: 44px;\n      height: 24px;\n      background: rgba(255,255,255,0.15);\n      border-radius: 12px;\n      cursor: pointer;\n      transition: background 0.2s ease;\n    }\n    \n    .bh-toggle-switch.active {\n      background: rgba(99,102,241,1);\n    }\n    \n    .bh-toggle-switch::after {\n      content: '';\n      position: absolute;\n      top: 2px;\n      left: 2px;\n      width: 20px;\n      height: 20px;\n      background: white;\n      border-radius: 50%;\n      transition: transform 0.2s ease;\n    }\n    \n    .bh-toggle-switch.active::after {\n      transform: translateX(20px);\n    }\n    \n    /* Voice dropdown */\n    .bh-voice-dropdown {\n      position: relative;\n    }\n    \n    .bh-voice-dropdown-menu {\n      position: absolute;\n      top: 100%;\n      left: 50%;\n      transform: translateX(-50%);\n      margin-top: 8px;\n      background: rgba(30,30,30,0.98);\n      border: 1px solid rgba(255,255,255,0.1);\n      border-radius: 8px;\n      padding: 4px;\n      min-width: 120px;\n      max-height: 200px;\n      overflow-y: auto;\n      z-index: 1000;\n      animation: bh-slide-down-center 0.15s ease;\n    }\n    \n    .bh-voice-option {\n      padding: 8px 12px;\n      cursor: pointer;\n      border-radius: 4px;\n      font-size: 13px;\n      color: rgba(255,255,255,0.8);\n      transition: background 0.15s ease;\n    }\n    \n    .bh-voice-option:hover {\n      background: rgba(255,255,255,0.1);\n    }\n    \n    .bh-voice-option.selected {\n      background: rgba(99,102,241,0.3);\n      color: rgba(255,255,255,1);\n    }\n  ",
      t = document.getElementById("bh-dock-styles");
    (t ||
      (((t = document.createElement("style")).id = "bh-dock-styles"),
      document.head.appendChild(t)),
      t.textContent !== e && (t.textContent = e));
  }
  function Br(e, t) {
    var n =
        arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "dark",
      r = document.createElement("button"),
      o = Ar[n];
    return (
      (r.innerHTML = e),
      (r.title = t),
      (r.style.cssText =
        "\n    background: transparent;\n    border: none;\n    color: ".concat(
          o.textSecondary,
          ";\n    cursor: pointer;\n    padding: 6px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    border-radius: 6px;\n    transition: all 0.15s ease;\n  ",
        )),
      (r.onmouseenter = function () {
        ((r.style.background = o.buttonHoverBg),
          (r.style.color = o.textPrimary));
      }),
      (r.onmouseleave = function () {
        ((r.style.background = "transparent"),
          (r.style.color = o.textSecondary));
      }),
      r
    );
  }
  function jr(e, t) {
    var n =
        arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "dark",
      r =
        arguments.length > 3 && void 0 !== arguments[3]
          ? arguments[3]
          : function (e, t) {
              return t;
            };
    Vr();
    var o = Ar[n],
      a = !1,
      i = null;
    function s() {
      var n, a;
      (((i = document.createElement("div")).className = "bh-audio-mixer"),
        (i.style.cssText =
          "\n      position: absolute;\n      top: 100%;\n      right: 0;\n      margin-top: 8px;\n      width: 280px;\n      background: "
            .concat(o.dockBg, ";\n      border: 1px solid ")
            .concat(
              o.dockBorder,
              ";\n      border-radius: 12px;\n      padding: 16px;\n      box-shadow: 0 8px 32px rgba(0,0,0,0.4);\n      backdrop-filter: blur(20px);\n      z-index: 2147483647;\n      animation: bh-slide-down 0.15s ease;\n      display: none;\n    ",
            )));
      var s,
        g = document.createElement("div");
      ((g.style.cssText =
        "\n      font-size: 11px;\n      font-weight: 600;\n      color: ".concat(
          o.textSecondary,
          ";\n      letter-spacing: 0.5px;\n      margin-bottom: 16px;\n    ",
        )),
        (g.textContent = r("audioMixer.title", "AUDIO MIXER")),
        i.appendChild(g),
        i.appendChild(
          l(
            Dr.music,
            r("audioMixer.originalAudio", "Original Audio"),
            null !== (n = e.tabVolume) && void 0 !== n ? n : 80,
            function (n) {
              ((e.tabVolume = n), t("tabVolume", n), c());
            },
            "tabVolume",
          ),
        ),
        i.appendChild(
          l(
            Dr.voice,
            r("audioMixer.translatedVoice", "Translated Voice"),
            null !== (a = e.ttsVolume) && void 0 !== a ? a : 100,
            function (n) {
              ((e.ttsVolume = n), t("ttsVolume", n), c());
            },
            "ttsVolume",
          ),
        ),
        i.appendChild(
          (((s = document.createElement("div")).className =
            "js-preset-container"),
          (s.style.cssText =
            "\n      display: flex;\n      gap: 8px;\n      margin-bottom: 16px;\n    "),
          [
            {
              id: "original",
              label: r("audioMixer.originalOnly", "Original only"),
              tab: 100,
              tts: 0,
              ducking: !1,
            },
            {
              id: "balanced",
              label: r("audioMixer.balanced", "Balanced"),
              tab: 60,
              tts: 100,
              ducking: !0,
              targetDuckedVol: 25,
            },
            {
              id: "voice",
              label: r("audioMixer.voiceOnly", "Voice only"),
              tab: 0,
              tts: 100,
              ducking: !1,
            },
          ].forEach(function (n) {
            var a,
              l,
              g,
              h,
              f,
              m,
              v = document.createElement("div");
            ((v.dataset.presetId = n.id), (v.textContent = n.label));
            var y =
                "balanced" === n.id &&
                60 === (null !== (a = e.tabVolume) && void 0 !== a ? a : 60) &&
                100 ===
                  (null !== (l = e.ttsVolume) && void 0 !== l ? l : 100) &&
                !1 !== e.audioDuckingEnabled,
              b =
                "voice" === n.id &&
                0 === (null !== (g = e.tabVolume) && void 0 !== g ? g : 60) &&
                100 ===
                  (null !== (h = e.ttsVolume) && void 0 !== h ? h : 100) &&
                !1 === e.audioDuckingEnabled,
              x =
                "original" === n.id &&
                100 === (null !== (f = e.tabVolume) && void 0 !== f ? f : 60) &&
                0 === (null !== (m = e.ttsVolume) && void 0 !== m ? m : 100) &&
                !1 === e.audioDuckingEnabled,
              w = y || b || x;
            ((v.style.cssText =
              "\n        flex: 1;\n        padding: 6px 4px;\n        font-size: 11px;\n        text-align: center;\n        border-radius: 6px;\n        border: 1px solid "
                .concat(
                  w ? o.accentColor : o.dockBorder,
                  ";\n        background: ",
                )
                .concat(
                  w ? o.accentColor : "rgba(255,255,255,0.05)",
                  ";\n        color: ",
                )
                .concat(
                  w ? "#fff" : o.textSecondary,
                  ";\n        cursor: pointer;\n        transition: all 0.2s;\n        user-select: none;\n      ",
                )),
              w && v.classList.add("active-preset"),
              (v.onclick = function (a) {
                var s;
                (a.stopPropagation(),
                  c(),
                  (v.style.background = o.accentColor),
                  (v.style.color = "#fff"),
                  (v.style.borderColor = o.accentColor),
                  v.classList.add("active-preset"));
                var l = e.tabVolume;
                if (
                  (void 0 !== n.tab &&
                    ((e.tabVolume = n.tab),
                    (l = n.tab),
                    t("tabVolume", n.tab),
                    u("tabVolume", n.tab)),
                  void 0 !== n.tts &&
                    ((e.ttsVolume = n.tts),
                    t("ttsVolume", n.tts),
                    u("ttsVolume", n.tts)),
                  void 0 !== n.ducking &&
                    ((e.audioDuckingEnabled = n.ducking),
                    t("audioDuckingEnabled", n.ducking),
                    d(n.ducking)),
                  void 0 !== n.targetDuckedVol && n.ducking)
                ) {
                  var g = 0;
                  (l > 0 &&
                    ((g = Math.round(100 * (1 - n.targetDuckedVol / l))),
                    (g = Math.max(0, Math.min(100, g)))),
                    (e.duckingStrength = g),
                    t("duckingStrength", g),
                    p(n.targetDuckedVol));
                }
                var h =
                    void 0 !== n.targetDuckedVol
                      ? n.targetDuckedVol
                      : Math.round(
                          l *
                            (1 -
                              (null !== (s = e.duckingStrength) && void 0 !== s
                                ? s
                                : 70) /
                                100),
                        ),
                  f = i.querySelector(".js-ducking-hint");
                f &&
                  (f.textContent = ""
                    .concat(r("audioMixer.normalVolume", "Normal"), ": ")
                    .concat(l, "% → ")
                    .concat(r("audioMixer.duringVoice", "During voice"), ": ")
                    .concat(h, "%"));
              }),
              s.appendChild(v));
          }),
          s),
        ));
      var h = document.createElement("div");
      return (
        (h.style.cssText = "\n      height: 1px;\n      background: ".concat(
          o.dockBorder,
          ";\n      margin: 16px 0;\n    ",
        )),
        i.appendChild(h),
        i.appendChild(
          (function () {
            var n,
              a,
              s = document.createElement("div");
            s.style.cssText =
              "\n      background: rgba(255,255,255,0.03);\n      border-radius: 8px;\n      padding: 12px;\n    ";
            var l = document.createElement("div");
            l.style.cssText =
              "\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      margin-bottom: 8px;\n    ";
            var u = document.createElement("div");
            ((u.style.cssText =
              "\n      font-size: 14px;\n      font-weight: 500;\n      color: ".concat(
                o.textPrimary,
                ";\n    ",
              )),
              (u.textContent = r("audioMixer.audioDucking", "Audio Ducking")));
            var d = document.createElement("div");
            ((d.className = "bh-toggle-switch js-ducking-toggle ".concat(
              !1 !== e.audioDuckingEnabled ? "active" : "",
            )),
              (d.onclick = function (n) {
                n.stopPropagation();
                var r = !(!1 !== e.audioDuckingEnabled);
                ((e.audioDuckingEnabled = r),
                  r ? d.classList.add("active") : d.classList.remove("active"));
                var o = i.querySelector(".js-ducking-volume-row"),
                  a = i.querySelector(".js-ducking-volume-slider");
                (o && (o.style.opacity = r ? "1" : "0.5"),
                  a && (a.disabled = !r),
                  t("audioDuckingEnabled", r),
                  c());
              }),
              l.appendChild(u),
              l.appendChild(d),
              s.appendChild(l));
            var p = document.createElement("div");
            ((p.style.cssText =
              "\n      font-size: 12px;\n      color: ".concat(
                o.textSecondary,
                ";\n      margin-bottom: 12px;\n    ",
              )),
              (p.textContent = r(
                "audioMixer.audioDuckingDesc",
                "Lower tab audio while voice plays",
              )),
              s.appendChild(p));
            var g = document.createElement("div");
            ((g.className = "js-ducking-volume-row"),
              (g.style.cssText = "\n      opacity: ".concat(
                !1 !== e.audioDuckingEnabled ? "1" : "0.5",
                ";\n      transition: opacity 0.2s ease;\n    ",
              )));
            var h = null !== (n = e.tabVolume) && void 0 !== n ? n : 80,
              f = null !== (a = e.duckingStrength) && void 0 !== a ? a : 70,
              m = Math.round(h * (1 - f / 100)),
              v = document.createElement("div");
            v.style.cssText =
              "\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      margin-bottom: 6px;\n    ";
            var y = document.createElement("span");
            ((y.style.cssText =
              "\n      font-size: 12px;\n      color: ".concat(
                o.textSecondary,
                ";\n    ",
              )),
              (y.textContent = r(
                "audioMixer.originalDuringVoice",
                "Original audio during voice",
              )));
            var b = document.createElement("span");
            ((b.style.cssText =
              "\n      font-size: 12px;\n      color: ".concat(
                o.textSecondary,
                ";\n      font-weight: 500;\n    ",
              )),
              (b.textContent = "".concat(m, "%")),
              v.appendChild(y),
              v.appendChild(b),
              g.appendChild(v));
            var x = document.createElement("div"),
              w = document.createElement("input");
            ((w.type = "range"),
              (w.min = "0"),
              (w.max = "100"),
              (w.value = m),
              (w.disabled = !1 === e.audioDuckingEnabled),
              (w.className = "bh-dock-slider js-ducking-volume-slider"),
              (w.style.cssText +=
                "\n      width: 100%;\n      background: linear-gradient(to right, \n        "
                  .concat(o.accentColor, " 0%, \n        ")
                  .concat(o.accentColor, " ")
                  .concat(m, "%, \n        rgba(255,255,255,0.15) ")
                  .concat(
                    m,
                    "%, \n        rgba(255,255,255,0.15) 100%\n      );\n    ",
                  )),
              x.appendChild(w),
              g.appendChild(x));
            var S = document.createElement("div");
            ((S.className = "js-ducking-hint"),
              (S.style.cssText =
                "\n      font-size: 11px;\n      color: rgba(255,255,255,0.4);\n      margin-top: 4px;\n      text-align: center;\n    "));
            var k = function (e, t) {
              S.textContent = ""
                .concat(r("audioMixer.normalVolume", "Normal"), ": ")
                .concat(e, "% → ")
                .concat(r("audioMixer.duringVoice", "During voice"), ": ")
                .concat(t, "%");
            };
            return (
              k(h, m),
              (w.oninput = function (n) {
                var r,
                  a = parseInt(n.target.value);
                ((b.textContent = "".concat(a, "%")),
                  (w.style.background = "linear-gradient(to right, \n        "
                    .concat(o.accentColor, " 0%, \n        ")
                    .concat(o.accentColor, " ")
                    .concat(a, "%, \n        rgba(255,255,255,0.15) ")
                    .concat(
                      a,
                      "%, \n        rgba(255,255,255,0.15) 100%\n      )",
                    )));
                var i,
                  s = null !== (r = e.tabVolume) && void 0 !== r ? r : 80;
                (s <= 0
                  ? (i = 100)
                  : ((i = Math.round(100 * (1 - a / s))),
                    (i = Math.max(0, Math.min(100, i)))),
                  (e.duckingStrength = i),
                  k(s, a),
                  t("duckingStrength", i),
                  c());
              }),
              g.appendChild(S),
              s.appendChild(g),
              s
            );
          })(),
        ),
        (i.onclick = function (e) {
          return e.stopPropagation();
        }),
        i
      );
    }
    function l(e, t, n, r, a) {
      var i = document.createElement("div");
      (a && (i.dataset.sliderId = a),
        (i.style.cssText = "\n      margin-bottom: 14px;\n    "));
      var s = document.createElement("div");
      s.style.cssText =
        "\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      margin-bottom: 8px;\n    ";
      var l = document.createElement("div");
      ((l.style.cssText =
        "\n      display: flex;\n      align-items: center;\n      gap: 8px;\n      color: ".concat(
          o.textSecondary,
          ";\n    ",
        )),
        (l.innerHTML = e));
      var c = document.createElement("span");
      ((c.style.cssText = "\n      font-size: 13px;\n      color: ".concat(
        o.textPrimary,
        ";\n    ",
      )),
        (c.textContent = t),
        l.appendChild(c));
      var u = document.createElement("span");
      ((u.className = "val-text"),
        (u.style.cssText = "\n      font-size: 13px;\n      color: ".concat(
          o.textSecondary,
          ";\n      min-width: 36px;\n      text-align: right;\n    ",
        )),
        (u.textContent = "".concat(n, "%")),
        s.appendChild(l),
        s.appendChild(u),
        i.appendChild(s));
      var d = document.createElement("input");
      return (
        (d.type = "range"),
        (d.min = "0"),
        (d.max = "100"),
        (d.value = n),
        (d.className = "bh-dock-slider"),
        (d.style.cssText +=
          "\n      width: 100%;\n      background: linear-gradient(to right, \n        "
            .concat(o.accentColor, " 0%, \n        ")
            .concat(o.accentColor, " ")
            .concat(n, "%, \n        rgba(255,255,255,0.15) ")
            .concat(
              n,
              "%, \n        rgba(255,255,255,0.15) 100%\n      );\n    ",
            )),
        (d.oninput = function (e) {
          var t = parseInt(e.target.value);
          ((u.textContent = "".concat(t, "%")),
            (d.style.background = "linear-gradient(to right, \n        "
              .concat(o.accentColor, " 0%, \n        ")
              .concat(o.accentColor, " ")
              .concat(t, "%, \n        rgba(255,255,255,0.15) ")
              .concat(t, "%, \n        rgba(255,255,255,0.15) 100%\n      )")),
            r(t));
        }),
        i.appendChild(d),
        i
      );
    }
    return {
      getElement: function () {
        return (i || (i = s()), i);
      },
      show: function () {
        (i || (i = s()), (i.style.display = "block"), (a = !0));
      },
      hide: function () {
        (i && (i.style.display = "none"), (a = !1));
      },
      toggle: function () {
        return (a ? this.hide() : this.show(), a);
      },
      isVisible: function () {
        return a;
      },
      syncSettings: function () {
        var t, n, o;
        if (i) {
          var a = null !== (t = e.tabVolume) && void 0 !== t ? t : 80,
            s = null !== (n = e.ttsVolume) && void 0 !== n ? n : 100,
            l = null !== (o = e.duckingStrength) && void 0 !== o ? o : 70,
            c = Math.round(a * (1 - l / 100));
          (u("tabVolume", a),
            u("ttsVolume", s),
            d(!1 !== e.audioDuckingEnabled),
            p(c));
          var g = i.querySelector(".js-ducking-hint");
          g &&
            (g.textContent = ""
              .concat(r("audioMixer.normalVolume", "Normal"), ": ")
              .concat(a, "% → ")
              .concat(r("audioMixer.duringVoice", "During voice"), ": ")
              .concat(c, "%"));
        }
      },
      updateTheme: function (e) {
        var t = a;
        (i && i.parentNode && i.parentNode.removeChild(i),
          (i = null),
          t && this.show());
      },
    };
    function c() {
      var e = i.querySelector(".js-preset-container");
      e &&
        e.querySelectorAll("div").forEach(function (e) {
          ((e.style.background = "rgba(255,255,255,0.05)"),
            (e.style.color = o.textSecondary),
            (e.style.borderColor = o.dockBorder),
            e.classList.remove("active-preset"));
        });
    }
    function u(e, t) {
      var n = i.querySelector('[data-slider-id="'.concat(e, '"]'));
      if (n) {
        var r = n.querySelector("input"),
          a = n.querySelector(".val-text");
        (r &&
          ((r.value = t),
          (r.style.background = "linear-gradient(to right, \n        "
            .concat(o.accentColor, " 0%, \n        ")
            .concat(o.accentColor, " ")
            .concat(t, "%, \n        rgba(255,255,255,0.15) ")
            .concat(t, "%, \n        rgba(255,255,255,0.15) 100%\n      )"))),
          a && (a.textContent = "".concat(t, "%")));
      }
    }
    function d(e) {
      var t = i.querySelector(".js-ducking-toggle");
      t && (e ? t.classList.add("active") : t.classList.remove("active"));
      var n = i.querySelector(".js-ducking-volume-row"),
        r = i.querySelector(".js-ducking-volume-slider");
      (n && (n.style.opacity = e ? "1" : "0.5"), r && (r.disabled = !e));
    }
    function p(e) {
      var t = i.querySelector(".js-ducking-volume-slider");
      if (t) {
        var n;
        ((t.value = e),
          (t.style.background = "linear-gradient(to right, \n            "
            .concat(o.accentColor, " 0%, \n            ")
            .concat(o.accentColor, " ")
            .concat(e, "%, \n            rgba(255,255,255,0.15) ")
            .concat(
              e,
              "%, \n            rgba(255,255,255,0.15) 100%\n          )",
            )));
        null === (n = t.parentElement) ||
          void 0 === n ||
          null === (n = n.parentElement) ||
          void 0 === n ||
          n.querySelector("span:last-child");
        var r = t
          .closest(".js-ducking-volume-row")
          .querySelector("div > span:last-child");
        r && (r.textContent = "".concat(e, "%"));
      }
    }
  }
  var Ir = [
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
  var Rr = [
      {
        id: "en-female-1",
        name: "Ava",
        voiceName: "Ava",
        language: "en",
        gender: "female",
        description: "",
      },
      {
        id: "en-female-2",
        name: "Lena",
        voiceName: "Lena",
        language: "en",
        gender: "female",
        description: "",
      },
      {
        id: "en-female-3",
        name: "Maya",
        voiceName: "Maya",
        language: "en",
        gender: "female",
        description: "",
      },
      {
        id: "en-female-4",
        name: "Claire",
        voiceName: "Claire",
        language: "en",
        gender: "female",
        description: "",
      },
      {
        id: "en-female-5",
        name: "Nora",
        voiceName: "Nora",
        language: "en",
        gender: "female",
        description: "",
      },
      {
        id: "en-female-6",
        name: "Elise",
        voiceName: "Elise",
        language: "en",
        gender: "female",
        description: "",
      },
      {
        id: "en-female-7",
        name: "Sienna",
        voiceName: "Sienna",
        language: "en",
        gender: "female",
        description: "",
      },
      {
        id: "en-female-wavenet-1",
        name: "Emma",
        voiceName: "EmmaW",
        language: "en",
        gender: "female",
        description: "Google Wavenet",
        provider: "google",
        voice: "en-US-Wavenet-C",
        originalName: "en-US-Wavenet-C",
      },
      {
        id: "en-female-wavenet-2",
        name: "Olivia",
        voiceName: "OliviaW",
        language: "en",
        gender: "female",
        description: "Google Wavenet",
        provider: "google",
        voice: "en-US-Wavenet-E",
        originalName: "en-US-Wavenet-E",
      },
      {
        id: "en-male-1",
        name: "Ethan",
        voiceName: "Ethan",
        language: "en",
        gender: "male",
        description: "",
      },
      {
        id: "en-male-2",
        name: "Caleb",
        voiceName: "Caleb",
        language: "en",
        gender: "male",
        description: "",
      },
      {
        id: "en-male-3",
        name: "Miles",
        voiceName: "Miles",
        language: "en",
        gender: "male",
        description: "",
      },
      {
        id: "en-male-4",
        name: "Logan",
        voiceName: "Logan",
        language: "en",
        gender: "male",
        description: "",
      },
      {
        id: "en-neutral-gemini-1",
        name: "Ryan",
        voiceName: "Ryan",
        language: "en",
        gender: "neutral",
        description: "Google Gemini Flash",
        provider: "google",
        voice: "gemini-flash-Puck",
        originalName: "Puck",
      },
      {
        id: "en-neutral-gemini-lite-1",
        name: "Ryan Lite",
        voiceName: "RyanLite",
        language: "en",
        gender: "neutral",
        description: "Google Gemini Lite",
        provider: "google",
        voice: "gemini-lite-Puck",
        originalName: "Puck",
      },
      {
        id: "zh-female-1",
        name: "Xiao Bei",
        voiceName: "XiaoBei",
        language: "zh",
        gender: "female",
        description: "",
      },
      {
        id: "zh-female-2",
        name: "Xiao Ni",
        voiceName: "XiaoNi",
        language: "zh",
        gender: "female",
        description: "",
      },
      {
        id: "zh-female-3",
        name: "Xiao Xiao",
        voiceName: "XiaoXiao",
        language: "zh",
        gender: "female",
        description: "",
      },
      {
        id: "zh-female-4",
        name: "Xiao Yi",
        voiceName: "XiaoYi",
        language: "zh",
        gender: "female",
        description: "",
      },
      {
        id: "zh-female-wavenet-1",
        name: "Li Na",
        voiceName: "LiNaW",
        language: "zh",
        gender: "female",
        description: "Google Wavenet",
        provider: "google",
        voice: "cmn-CN-Wavenet-A",
        originalName: "cmn-CN-Wavenet-A",
      },
      {
        id: "zh-female-wavenet-2",
        name: "Wei Wei",
        voiceName: "WeiWeiW",
        language: "zh",
        gender: "female",
        description: "Google Wavenet",
        provider: "google",
        voice: "cmn-CN-Wavenet-D",
        originalName: "cmn-CN-Wavenet-D",
      },
      {
        id: "zh-male-1",
        name: "Yun Jian",
        voiceName: "YunJian",
        language: "zh",
        gender: "male",
        description: "",
      },
      {
        id: "zh-male-2",
        name: "Yun Xi",
        voiceName: "YunXi",
        language: "zh",
        gender: "male",
        description: "",
      },
      {
        id: "zh-male-3",
        name: "Yun Xia",
        voiceName: "YunXia",
        language: "zh",
        gender: "male",
        description: "",
      },
      {
        id: "zh-male-4",
        name: "Yun Yang",
        voiceName: "YunYang",
        language: "zh",
        gender: "male",
        description: "",
      },
      {
        id: "zh-male-wavenet-1",
        name: "Chen Wei",
        voiceName: "ChenWeiW",
        language: "zh",
        gender: "male",
        description: "Google Wavenet",
        provider: "google",
        voice: "cmn-CN-Wavenet-B",
        originalName: "cmn-CN-Wavenet-B",
      },
      {
        id: "zh-male-wavenet-2",
        name: "Zhang Ming",
        voiceName: "ZhangMingW",
        language: "zh",
        gender: "male",
        description: "Google Wavenet",
        provider: "google",
        voice: "cmn-CN-Wavenet-C",
        originalName: "cmn-CN-Wavenet-C",
      },
      {
        id: "ja-female-1",
        name: "Sakura",
        voiceName: "Sakura",
        language: "ja",
        gender: "female",
        description: "",
      },
      {
        id: "ja-female-2",
        name: "Yuki",
        voiceName: "Yuki",
        language: "ja",
        gender: "female",
        description: "",
      },
      {
        id: "ja-female-3",
        name: "Hana",
        voiceName: "Hana",
        language: "ja",
        gender: "female",
        description: "",
      },
      {
        id: "ja-female-4",
        name: "Aiko",
        voiceName: "Aiko",
        language: "ja",
        gender: "female",
        description: "",
      },
      {
        id: "ja-male-1",
        name: "Hiroshi",
        voiceName: "Hiroshi",
        language: "ja",
        gender: "male",
        description: "",
      },
      {
        id: "es-female-1",
        name: "Isabella",
        voiceName: "Isabella",
        language: "es",
        gender: "female",
        description: "",
      },
      {
        id: "es-male-1",
        name: "Diego",
        voiceName: "Diego",
        language: "es",
        gender: "male",
        description: "",
      },
      {
        id: "es-male-2",
        name: "Carlos",
        voiceName: "Carlos",
        language: "es",
        gender: "male",
        description: "",
      },
      {
        id: "pt-female-1",
        name: "Isabella",
        voiceName: "Isabella",
        language: "pt",
        gender: "female",
        description: "",
      },
      {
        id: "pt-male-1",
        name: "Lucas",
        voiceName: "Lucas",
        language: "pt",
        gender: "male",
        description: "",
      },
      {
        id: "pt-male-2",
        name: "Pedro",
        voiceName: "Pedro",
        language: "pt",
        gender: "male",
        description: "",
      },
      {
        id: "fr-female-1",
        name: "Camille",
        voiceName: "Camille",
        language: "fr",
        gender: "female",
        description: "",
      },
      {
        id: "it-female-1",
        name: "Giulia",
        voiceName: "Giulia",
        language: "it",
        gender: "female",
        description: "",
      },
      {
        id: "it-male-1",
        name: "Marco",
        voiceName: "Marco",
        language: "it",
        gender: "male",
        description: "",
      },
      {
        id: "hi-female-1",
        name: "Priya",
        voiceName: "Priya",
        language: "hi",
        gender: "female",
        description: "",
      },
      {
        id: "hi-female-2",
        name: "Aarti",
        voiceName: "Aarti",
        language: "hi",
        gender: "female",
        description: "",
      },
      {
        id: "hi-male-1",
        name: "Raj",
        voiceName: "Raj",
        language: "hi",
        gender: "male",
        description: "",
      },
      {
        id: "hi-male-2",
        name: "Arjun",
        voiceName: "Arjun",
        language: "hi",
        gender: "male",
        description: "",
      },
    ],
    Fr = Ir.reduce(function (e, t) {
      return (
        (e[t.code] = "".concat(t.name, " (").concat(t.nativeName, ")")),
        e
      );
    }, {});
  function qr(e) {
    return Rr.filter(function (t) {
      return t.language === e;
    });
  }
  function Hr(e, t) {
    var n =
      ("undefined" != typeof Symbol && e[Symbol.iterator]) || e["@@iterator"];
    if (!n) {
      if (
        Array.isArray(e) ||
        (n = (function (e, t) {
          if (!e) return;
          if ("string" == typeof e) return Ur(e, t);
          var n = Object.prototype.toString.call(e).slice(8, -1);
          "Object" === n && e.constructor && (n = e.constructor.name);
          if ("Map" === n || "Set" === n) return Array.from(e);
          if (
            "Arguments" === n ||
            /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
          )
            return Ur(e, t);
        })(e)) ||
        (t && e && "number" == typeof e.length)
      ) {
        n && (e = n);
        var r = 0,
          o = function () {};
        return {
          s: o,
          n: function () {
            return r >= e.length ? { done: !0 } : { done: !1, value: e[r++] };
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
    var a,
      i = !0,
      s = !1;
    return {
      s: function () {
        n = n.call(e);
      },
      n: function () {
        var e = n.next();
        return ((i = e.done), e);
      },
      e: function (e) {
        ((s = !0), (a = e));
      },
      f: function () {
        try {
          i || null == n.return || n.return();
        } finally {
          if (s) throw a;
        }
      },
    };
  }
  function Ur(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
    return r;
  }
  function Wr(e) {
    return (
      (Wr =
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
      Wr(e)
    );
  }
  function Yr() {
    Yr = function () {
      return t;
    };
    var e,
      t = {},
      n = Object.prototype,
      r = n.hasOwnProperty,
      o =
        Object.defineProperty ||
        function (e, t, n) {
          e[t] = n.value;
        },
      a = "function" == typeof Symbol ? Symbol : {},
      i = a.iterator || "@@iterator",
      s = a.asyncIterator || "@@asyncIterator",
      l = a.toStringTag || "@@toStringTag";
    function c(e, t, n) {
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
      c({}, "");
    } catch (e) {
      c = function (e, t, n) {
        return (e[t] = n);
      };
    }
    function u(e, t, n, r) {
      var a = t && t.prototype instanceof v ? t : v,
        i = Object.create(a.prototype),
        s = new M(r || []);
      return (o(i, "_invoke", { value: C(e, n, s) }), i);
    }
    function d(e, t, n) {
      try {
        return { type: "normal", arg: e.call(t, n) };
      } catch (e) {
        return { type: "throw", arg: e };
      }
    }
    t.wrap = u;
    var p = "suspendedStart",
      g = "suspendedYield",
      h = "executing",
      f = "completed",
      m = {};
    function v() {}
    function y() {}
    function b() {}
    var x = {};
    c(x, i, function () {
      return this;
    });
    var w = Object.getPrototypeOf,
      S = w && w(w(L([])));
    S && S !== n && r.call(S, i) && (x = S);
    var k = (b.prototype = v.prototype = Object.create(x));
    function T(e) {
      ["next", "throw", "return"].forEach(function (t) {
        c(e, t, function (e) {
          return this._invoke(t, e);
        });
      });
    }
    function _(e, t) {
      function n(o, a, i, s) {
        var l = d(e[o], e, a);
        if ("throw" !== l.type) {
          var c = l.arg,
            u = c.value;
          return u && "object" == Wr(u) && r.call(u, "__await")
            ? t.resolve(u.__await).then(
                function (e) {
                  n("next", e, i, s);
                },
                function (e) {
                  n("throw", e, i, s);
                },
              )
            : t.resolve(u).then(
                function (e) {
                  ((c.value = e), i(c));
                },
                function (e) {
                  return n("throw", e, i, s);
                },
              );
        }
        s(l.arg);
      }
      var a;
      o(this, "_invoke", {
        value: function (e, r) {
          function o() {
            return new t(function (t, o) {
              n(e, r, t, o);
            });
          }
          return (a = a ? a.then(o, o) : o());
        },
      });
    }
    function C(t, n, r) {
      var o = p;
      return function (a, i) {
        if (o === h) throw new Error("Generator is already running");
        if (o === f) {
          if ("throw" === a) throw i;
          return { value: e, done: !0 };
        }
        for (r.method = a, r.arg = i; ; ) {
          var s = r.delegate;
          if (s) {
            var l = E(s, r);
            if (l) {
              if (l === m) continue;
              return l;
            }
          }
          if ("next" === r.method) r.sent = r._sent = r.arg;
          else if ("throw" === r.method) {
            if (o === p) throw ((o = f), r.arg);
            r.dispatchException(r.arg);
          } else "return" === r.method && r.abrupt("return", r.arg);
          o = h;
          var c = d(t, n, r);
          if ("normal" === c.type) {
            if (((o = r.done ? f : g), c.arg === m)) continue;
            return { value: c.arg, done: r.done };
          }
          "throw" === c.type &&
            ((o = f), (r.method = "throw"), (r.arg = c.arg));
        }
      };
    }
    function E(t, n) {
      var r = n.method,
        o = t.iterator[r];
      if (o === e)
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
          m
        );
      var a = d(o, t.iterator, n.arg);
      if ("throw" === a.type)
        return ((n.method = "throw"), (n.arg = a.arg), (n.delegate = null), m);
      var i = a.arg;
      return i
        ? i.done
          ? ((n[t.resultName] = i.value),
            (n.next = t.nextLoc),
            "return" !== n.method && ((n.method = "next"), (n.arg = e)),
            (n.delegate = null),
            m)
          : i
        : ((n.method = "throw"),
          (n.arg = new TypeError("iterator result is not an object")),
          (n.delegate = null),
          m);
    }
    function P(e) {
      var t = { tryLoc: e[0] };
      (1 in e && (t.catchLoc = e[1]),
        2 in e && ((t.finallyLoc = e[2]), (t.afterLoc = e[3])),
        this.tryEntries.push(t));
    }
    function O(e) {
      var t = e.completion || {};
      ((t.type = "normal"), delete t.arg, (e.completion = t));
    }
    function M(e) {
      ((this.tryEntries = [{ tryLoc: "root" }]),
        e.forEach(P, this),
        this.reset(!0));
    }
    function L(t) {
      if (t || "" === t) {
        var n = t[i];
        if (n) return n.call(t);
        if ("function" == typeof t.next) return t;
        if (!isNaN(t.length)) {
          var o = -1,
            a = function n() {
              for (; ++o < t.length; )
                if (r.call(t, o)) return ((n.value = t[o]), (n.done = !1), n);
              return ((n.value = e), (n.done = !0), n);
            };
          return (a.next = a);
        }
      }
      throw new TypeError(Wr(t) + " is not iterable");
    }
    return (
      (y.prototype = b),
      o(k, "constructor", { value: b, configurable: !0 }),
      o(b, "constructor", { value: y, configurable: !0 }),
      (y.displayName = c(b, l, "GeneratorFunction")),
      (t.isGeneratorFunction = function (e) {
        var t = "function" == typeof e && e.constructor;
        return (
          !!t && (t === y || "GeneratorFunction" === (t.displayName || t.name))
        );
      }),
      (t.mark = function (e) {
        return (
          Object.setPrototypeOf
            ? Object.setPrototypeOf(e, b)
            : ((e.__proto__ = b), c(e, l, "GeneratorFunction")),
          (e.prototype = Object.create(k)),
          e
        );
      }),
      (t.awrap = function (e) {
        return { __await: e };
      }),
      T(_.prototype),
      c(_.prototype, s, function () {
        return this;
      }),
      (t.AsyncIterator = _),
      (t.async = function (e, n, r, o, a) {
        void 0 === a && (a = Promise);
        var i = new _(u(e, n, r, o), a);
        return t.isGeneratorFunction(n)
          ? i
          : i.next().then(function (e) {
              return e.done ? e.value : i.next();
            });
      }),
      T(k),
      c(k, l, "Generator"),
      c(k, i, function () {
        return this;
      }),
      c(k, "toString", function () {
        return "[object Generator]";
      }),
      (t.keys = function (e) {
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
      (t.values = L),
      (M.prototype = {
        constructor: M,
        reset: function (t) {
          if (
            ((this.prev = 0),
            (this.next = 0),
            (this.sent = this._sent = e),
            (this.done = !1),
            (this.delegate = null),
            (this.method = "next"),
            (this.arg = e),
            this.tryEntries.forEach(O),
            !t)
          )
            for (var n in this)
              "t" === n.charAt(0) &&
                r.call(this, n) &&
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
          function o(r, o) {
            return (
              (s.type = "throw"),
              (s.arg = t),
              (n.next = r),
              o && ((n.method = "next"), (n.arg = e)),
              !!o
            );
          }
          for (var a = this.tryEntries.length - 1; a >= 0; --a) {
            var i = this.tryEntries[a],
              s = i.completion;
            if ("root" === i.tryLoc) return o("end");
            if (i.tryLoc <= this.prev) {
              var l = r.call(i, "catchLoc"),
                c = r.call(i, "finallyLoc");
              if (l && c) {
                if (this.prev < i.catchLoc) return o(i.catchLoc, !0);
                if (this.prev < i.finallyLoc) return o(i.finallyLoc);
              } else if (l) {
                if (this.prev < i.catchLoc) return o(i.catchLoc, !0);
              } else {
                if (!c)
                  throw new Error("try statement without catch or finally");
                if (this.prev < i.finallyLoc) return o(i.finallyLoc);
              }
            }
          }
        },
        abrupt: function (e, t) {
          for (var n = this.tryEntries.length - 1; n >= 0; --n) {
            var o = this.tryEntries[n];
            if (
              o.tryLoc <= this.prev &&
              r.call(o, "finallyLoc") &&
              this.prev < o.finallyLoc
            ) {
              var a = o;
              break;
            }
          }
          a &&
            ("break" === e || "continue" === e) &&
            a.tryLoc <= t &&
            t <= a.finallyLoc &&
            (a = null);
          var i = a ? a.completion : {};
          return (
            (i.type = e),
            (i.arg = t),
            a
              ? ((this.method = "next"), (this.next = a.finallyLoc), m)
              : this.complete(i)
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
            m
          );
        },
        finish: function (e) {
          for (var t = this.tryEntries.length - 1; t >= 0; --t) {
            var n = this.tryEntries[t];
            if (n.finallyLoc === e)
              return (this.complete(n.completion, n.afterLoc), O(n), m);
          }
        },
        catch: function (e) {
          for (var t = this.tryEntries.length - 1; t >= 0; --t) {
            var n = this.tryEntries[t];
            if (n.tryLoc === e) {
              var r = n.completion;
              if ("throw" === r.type) {
                var o = r.arg;
                O(n);
              }
              return o;
            }
          }
          throw new Error("illegal catch attempt");
        },
        delegateYield: function (t, n, r) {
          return (
            (this.delegate = { iterator: L(t), resultName: n, nextLoc: r }),
            "next" === this.method && (this.arg = e),
            m
          );
        },
      }),
      t
    );
  }
  function Gr(e, t, n, r, o, a, i) {
    try {
      var s = e[a](i),
        l = s.value;
    } catch (e) {
      return void n(e);
    }
    s.done ? t(l) : Promise.resolve(l).then(r, o);
  }
  function Xr(e) {
    return function () {
      var t = this,
        n = arguments;
      return new Promise(function (r, o) {
        var a = e.apply(t, n);
        function i(e) {
          Gr(a, r, o, i, s, "next", e);
        }
        function s(e) {
          Gr(a, r, o, i, s, "throw", e);
        }
        i(void 0);
      });
    };
  }
  function Kr(e, t) {
    var n = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(e);
      (t &&
        (r = r.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        n.push.apply(n, r));
    }
    return n;
  }
  function Zr(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = null != arguments[t] ? arguments[t] : {};
      t % 2
        ? Kr(Object(n), !0).forEach(function (t) {
            Jr(e, t, n[t]);
          })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
          : Kr(Object(n)).forEach(function (t) {
              Object.defineProperty(
                e,
                t,
                Object.getOwnPropertyDescriptor(n, t),
              );
            });
    }
    return e;
  }
  function Jr(e, t, n) {
    return (
      (t = (function (e) {
        var t = (function (e, t) {
          if ("object" != Wr(e) || !e) return e;
          var n = e[Symbol.toPrimitive];
          if (void 0 !== n) {
            var r = n.call(e, t || "default");
            if ("object" != Wr(r)) return r;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return ("string" === t ? String : Number)(e);
        })(e, "string");
        return "symbol" == Wr(t) ? t : String(t);
      })(t)),
      t in e
        ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = n),
      e
    );
  }
  var $r = "https://discord.gg/7V56xZ4sXQ",
    Qr = Zr(
      Zr({}, Dr),
      {},
      {
        sparkles:
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">\n    <path d="M12 2L9.19 8.63L2 12L9.19 15.37L12 22L14.81 15.37L22 12L14.81 8.63L12 2Z"/>\n  </svg>',
        globe:
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n    <circle cx="12" cy="12" r="10"/>\n    <line x1="2" y1="12" x2="22" y2="12"/>\n    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>\n  </svg>',
        check:
          '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4">\n    <polyline points="20 6 9 17 4 12"/>\n  </svg>',
        playFilled:
          '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">\n    <polygon points="5 3 19 12 5 21 5 3"/>\n  </svg>',
        speaker:
          '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/>\n    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>\n    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>\n  </svg>',
        chevronDown:
          '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n    <polyline points="6 9 12 15 18 9"/>\n  </svg>',
      },
    ),
    eo = 864e5,
    to = {},
    no = {},
    ro = 0;
  function oo(e) {
    var t = to[e];
    return t
      ? Date.now() - t.timestamp > eo
        ? (delete to[e], null)
        : t.voices
      : null;
  }
  function ao(e, t) {
    to[e] = { voices: t, timestamp: Date.now() };
  }
  function io() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
      t = e.selectedVoice,
      n = void 0 === t ? "Ava" : t,
      r = e.selectedVoiceDisplayName,
      o = void 0 === r ? null : r,
      a = e.selectedLanguage,
      i = void 0 === a ? "en" : a,
      s = e.targetLanguage,
      l = void 0 === s ? null : s,
      c = e.autoMode,
      u = void 0 !== c && c,
      d = e.theme,
      p = void 0 === d ? "dark" : d,
      g = e.buttonElement,
      h = void 0 === g ? null : g,
      f = e.onVoiceSelect,
      m = void 0 === f ? function () {} : f,
      v = e.onLanguageChange,
      y = void 0 === v ? function () {} : v,
      b = e.onAutoToggle,
      x = void 0 === b ? function () {} : b,
      w = e.onClose,
      S = void 0 === w ? function () {} : w,
      k = e.overlayT,
      T =
        void 0 === k
          ? function (e, t) {
              return t;
            }
          : k,
      _ = Ar[p],
      C = Zr(
        Zr({}, _),
        {},
        {
          femaleText: "#F472B6",
          maleText: "#60A5FA",
          tagText: "#9CA3AF",
          cardBg: "rgba(255,255,255,0.03)",
          cardBorder: "rgba(255,255,255,0.08)",
          selectedCardBg: "rgba(99,102,241,0.1)",
          selectedCardBorder: "rgba(99,102,241,0.5)",
        },
      ),
      E = null,
      P = null,
      O = null,
      M = !1,
      L = i,
      z = u,
      N = n,
      A = o || n,
      D = l,
      V = null,
      B = null,
      j = null,
      I = null,
      R = null,
      F = null,
      q = null,
      H = !1,
      U = null,
      W = 0,
      Y = null,
      G = 0,
      X = null,
      K = null,
      Z = new Set(),
      J = !1;
    function $() {
      return Q.apply(this, arguments);
    }
    function Q() {
      return (Q = Xr(
        Yr().mark(function e() {
          var t, n;
          return Yr().wrap(
            function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (
                      (e.prev = 0),
                      (e.next = 3),
                      chrome.storage.sync.get([
                        "favoriteVoicesByLanguage",
                        "favoritesCollapsed",
                      ])
                    );
                  case 3:
                    ((t = e.sent),
                      (n = t.favoriteVoicesByLanguage || {}),
                      (Z = new Set(n[L] || [])),
                      (J = t.favoritesCollapsed || !1),
                      (e.next = 14));
                    break;
                  case 10:
                    ((e.prev = 10), (e.t0 = e.catch(0)), (Z = new Set()));
                  case 14:
                  case "end":
                    return e.stop();
                }
            },
            e,
            null,
            [[0, 10]],
          );
        }),
      )).apply(this, arguments);
    }
    function ee() {
      return te.apply(this, arguments);
    }
    function te() {
      return (te = Xr(
        Yr().mark(function e() {
          var t, n;
          return Yr().wrap(
            function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (
                      (e.prev = 0),
                      (e.next = 3),
                      chrome.storage.sync.get(["favoriteVoicesByLanguage"])
                    );
                  case 3:
                    return (
                      (t = e.sent),
                      ((n = t.favoriteVoicesByLanguage || {})[L] =
                        Array.from(Z)),
                      (e.next = 8),
                      chrome.storage.sync.set({ favoriteVoicesByLanguage: n })
                    );
                  case 8:
                    e.next = 14;
                    break;
                  case 11:
                    ((e.prev = 11), (e.t0 = e.catch(0)));
                  case 14:
                  case "end":
                    return e.stop();
                }
            },
            e,
            null,
            [[0, 11]],
          );
        }),
      )).apply(this, arguments);
    }
    function ne() {
      return re.apply(this, arguments);
    }
    function re() {
      return (re = Xr(
        Yr().mark(function e() {
          return Yr().wrap(
            function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (
                      (e.prev = 0),
                      (e.next = 3),
                      chrome.storage.sync.set({ favoritesCollapsed: J })
                    );
                  case 3:
                    e.next = 8;
                    break;
                  case 5:
                    ((e.prev = 5), (e.t0 = e.catch(0)));
                  case 8:
                  case "end":
                    return e.stop();
                }
            },
            e,
            null,
            [[0, 5]],
          );
        }),
      )).apply(this, arguments);
    }
    function oe() {
      return (oe = Xr(
        Yr().mark(function e(t) {
          return Yr().wrap(function (e) {
            for (;;)
              switch ((e.prev = e.next)) {
                case 0:
                  return (
                    Z.has(t) ? Z.delete(t) : Z.add(t),
                    (e.next = 3),
                    ee()
                  );
                case 3:
                  ve();
                case 4:
                case "end":
                  return e.stop();
              }
          }, e);
        }),
      )).apply(this, arguments);
    }
    var ae = function (e) {
      if (e) {
        ((e.innerHTML =
          '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/>\n      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>\n      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>\n    </svg>'),
          (e.style.color = Ar.dark.textSecondary),
          (e.style.background = "transparent"));
      }
    };
    function ie() {
      return D || L;
    }
    function se() {
      if (B && j)
        if (D && L !== D) {
          var e = (function (e) {
            if (!e) return "—";
            var t = Fr[e] || e;
            return "".concat(t, " (").concat(e, ")");
          })(D);
          ((j.textContent = T(
            "voiceSelector.targetLanguageWarning",
            "Target language: ".concat(
              e,
              ". Only voices in this language can be selected.",
            ),
          )),
            (B.style.display = "block"));
        } else B.style.display = "none";
    }
    function le() {
      return (le = Xr(
        Yr().mark(function e() {
          var t;
          return Yr().wrap(
            function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    if (!D) {
                      e.next = 3;
                      break;
                    }
                    return (se(), e.abrupt("return"));
                  case 3:
                    return (
                      (e.prev = 3),
                      (e.next = 6),
                      chrome.storage.sync.get(["targetLanguage"])
                    );
                  case 6:
                    ((t = e.sent).targetLanguage && (D = t.targetLanguage),
                      (e.next = 13));
                    break;
                  case 10:
                    ((e.prev = 10), (e.t0 = e.catch(3)));
                  case 13:
                    (se(), ve());
                  case 15:
                  case "end":
                    return e.stop();
                }
            },
            e,
            null,
            [[3, 10]],
          );
        }),
      )).apply(this, arguments);
    }
    function ce() {
      if (X)
        try {
          chrome.runtime.sendMessage({ type: "stopVoiceSample", requestId: X });
        } catch (e) {}
    }
    function ue(e) {
      return de.apply(this, arguments);
    }
    function de() {
      return (de = Xr(
        Yr().mark(function e(t) {
          var n, r, o;
          return Yr().wrap(function (e) {
            for (;;)
              switch ((e.prev = e.next)) {
                case 0:
                  if (!(n = oo(t))) {
                    e.next = 4;
                    break;
                  }
                  return e.abrupt("return", n);
                case 4:
                  if (!no[t]) {
                    e.next = 7;
                    break;
                  }
                  return e.abrupt("return", no[t]);
                case 7:
                  return (
                    (r = ro),
                    (o = Xr(
                      Yr().mark(function e() {
                        var n, a, i, s;
                        return Yr().wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  return (
                                    (e.prev = 0),
                                    (H = !0),
                                    (U = null),
                                    (e.next = 6),
                                    new Promise(function (e) {
                                      chrome.runtime.sendMessage(
                                        { type: "fetchVoices", language: t },
                                        function (t) {
                                          e(t);
                                        },
                                      );
                                    })
                                  );
                                case 6:
                                  if ((n = e.sent).ok) {
                                    e.next = 9;
                                    break;
                                  }
                                  throw new Error(
                                    n.error || "Failed to fetch voices",
                                  );
                                case 9:
                                  return (
                                    (a = n.voices.map(function (e) {
                                      var n,
                                        r,
                                        o =
                                          "object" === Wr(e.displayName)
                                            ? e.displayName[t] ||
                                              e.displayName.en ||
                                              e.id
                                            : e.displayName || e.id,
                                        a =
                                          (null === (n = e.perLocale) ||
                                          void 0 === n ||
                                          null === (n = n[t]) ||
                                          void 0 === n
                                            ? void 0
                                            : n.rank) || 999;
                                      return {
                                        id: e.id,
                                        name: o,
                                        voiceName: e.id,
                                        language: t,
                                        gender: e.gender || "neutral",
                                        tags: e.tags || [],
                                        description:
                                          (null === (r = e.tags) || void 0 === r
                                            ? void 0
                                            : r.join(", ")) || "",
                                        rank: a,
                                        sampleURL: e.sampleURL || null,
                                        responseFormat:
                                          e.responseFormat || "pcm",
                                        _raw: e,
                                      };
                                    })),
                                    (i = new Map()),
                                    a.forEach(function (e) {
                                      var t = e.id || e.voiceName || e.name,
                                        n = i.get(t);
                                      (!n ||
                                        (e.rank || 999) < (n.rank || 999)) &&
                                        i.set(t, e);
                                    }),
                                    (s = Array.from(i.values())).sort(
                                      function (e, t) {
                                        return (
                                          (e.rank || 999) - (t.rank || 999)
                                        );
                                      },
                                    ),
                                    r === ro && ao(t, s),
                                    s.filter(function (e) {
                                      return (
                                        e.responseFormat &&
                                        "pcm" !== e.responseFormat
                                      );
                                    }).length,
                                    e.abrupt("return", s)
                                  );
                                case 23:
                                  ((e.prev = 23),
                                    (e.t0 = e.catch(0)),
                                    (U = e.t0.message));
                                  try {
                                    chrome.runtime.sendMessage({
                                      type: "trackEvent",
                                      eventName: "voice_list_load_failed",
                                      properties: {
                                        language: t,
                                        error: e.t0.message || "unknown",
                                      },
                                    });
                                  } catch (e) {}
                                  return e.abrupt("return", qr(t));
                                case 30:
                                  return (
                                    (e.prev = 30),
                                    (H = !1),
                                    no[t] === o && delete no[t],
                                    e.finish(30)
                                  );
                                case 34:
                                case "end":
                                  return e.stop();
                              }
                          },
                          e,
                          null,
                          [[0, 23, 30, 34]],
                        );
                      }),
                    )()),
                    (no[t] = o),
                    e.abrupt("return", o)
                  );
                case 11:
                case "end":
                  return e.stop();
              }
          }, e);
        }),
      )).apply(this, arguments);
    }
    function pe() {
      return ge.apply(this, arguments);
    }
    function ge() {
      return (
        (ge = Xr(
          Yr().mark(function e() {
            var t,
              r,
              o,
              a,
              i,
              s,
              l,
              c,
              u,
              d,
              p,
              g,
              h,
              f = arguments;
            return Yr().wrap(
              function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      if (
                        ((t = f.length > 0 && void 0 !== f[0] ? f[0] : null), V)
                      ) {
                        e.next = 3;
                        break;
                      }
                      return e.abrupt("return");
                    case 3:
                      return (
                        (r = null),
                        (o = null),
                        (a = D || L),
                        (e.prev = 6),
                        (e.next = 9),
                        chrome.storage.sync.get(["voiceByLanguage"])
                      );
                    case 9:
                      ((i = e.sent),
                        (s = i.voiceByLanguage || {}),
                        (l = s[a]) &&
                          ((r = l.displayName || l.voiceName || l.voiceId),
                          (o = l.voiceId || l.voiceName)),
                        (e.next = 18));
                      break;
                    case 15:
                      ((e.prev = 15), (e.t0 = e.catch(6)));
                    case 18:
                      if (r) {
                        e.next = 31;
                        break;
                      }
                      return (
                        (e.prev = 19),
                        (e.next = 22),
                        chrome.storage.local.get([
                          "ttsVoiceDisplayName",
                          "ttsVoice",
                          "ttsVoiceId",
                        ])
                      );
                    case 22:
                      ((c = e.sent).ttsVoiceDisplayName &&
                        (r = c.ttsVoiceDisplayName),
                        !o && c.ttsVoiceId && (o = c.ttsVoiceId),
                        !o && c.ttsVoice && (o = c.ttsVoice),
                        (e.next = 31));
                      break;
                    case 28:
                      ((e.prev = 28), (e.t1 = e.catch(19)));
                    case 31:
                      if (
                        (!r &&
                          Array.isArray(t) &&
                          a === L &&
                          (u = t.find(function (e) {
                            return e.voiceName === n || e.name === n;
                          })) &&
                          u.name &&
                          ((r = u.name), (o = u.voiceName)),
                        r || !o)
                      ) {
                        e.next = 54;
                        break;
                      }
                      if (((d = null), !Array.isArray(t) || a !== L)) {
                        e.next = 38;
                        break;
                      }
                      ((d = t), (e.next = 53));
                      break;
                    case 38:
                      return (
                        (p = U),
                        (g = H),
                        (e.prev = 40),
                        (e.next = 43),
                        ue(a)
                      );
                    case 43:
                      ((d = e.sent), (e.next = 49));
                      break;
                    case 46:
                      ((e.prev = 46), (e.t2 = e.catch(40)));
                    case 49:
                      return ((e.prev = 49), (U = p), (H = g), e.finish(49));
                    case 53:
                      Array.isArray(d) &&
                        (h = d.find(function (e) {
                          return (
                            e.voiceName === o || e.id === o || e.name === o
                          );
                        })) &&
                        h.name &&
                        (r = h.name);
                    case 54:
                      (o || (o = N || n),
                        (N = o),
                        (A = r || A || n || "—"),
                        (V.textContent = A),
                        (V.title = A));
                    case 59:
                    case "end":
                      return e.stop();
                  }
              },
              e,
              null,
              [
                [6, 15],
                [19, 28],
                [40, 46, 49, 53],
              ],
            );
          }),
        )),
        ge.apply(this, arguments)
      );
    }
    function he() {
      var e,
        t = document.createElement("div");
      return (
        (t.className = "bh-voice-selector-overlay"),
        (t.style.cssText =
          "\n      position: fixed;\n      top: 0;\n      left: 0;\n      right: 0;\n      bottom: 0;\n      background: transparent;\n      z-index: 2147483647;\n    "),
        ((E = document.createElement("div")).className =
          "bh-voice-selector-modal"),
        (E.style.cssText =
          "\n      position: fixed;\n      width: 280px; \n      max-height: 480px;\n      padding: 16px;\n      background: "
            .concat(_.dockBg, ";\n      border: 1px solid ")
            .concat(
              _.dockBorder,
              ';\n      border-radius: 12px;\n      box-shadow: 0 8px 32px rgba(0,0,0,0.4);\n      backdrop-filter: blur(20px);\n      display: flex;\n      flex-direction: column;\n      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n      animation: bh-slide-down 0.15s ease;\n      z-index: 2147483648;\n      overflow: hidden;\n    ',
            )),
        fe(t),
        (E.onclick = function (e) {
          return e.stopPropagation();
        }),
        (t.onclick = function () {
          return we();
        }),
        K ||
          ((K = function (e) {
            if (
              e &&
              "voiceSampleState" === e.type &&
              X &&
              (null == e.requestId || String(e.requestId) === String(X))
            ) {
              if ("started" === e.state) {
                if (!Y) return;
                return (
                  (Y.innerHTML =
                    '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">\n          <rect x="6" y="6" width="12" height="12" rx="1"/>\n        </svg>'),
                  (Y.style.color = "white"),
                  void (Y.style.background = "rgba(99,102,241,0.3)")
                );
              }
              ("error" === e.state && xe("Failed to play audio", "error"),
                Y && ae(Y),
                (Y = null),
                (X = null));
            }
          }),
          chrome.runtime.onMessage.addListener(K)),
        E.appendChild(
          (function () {
            var e = document.createElement("div");
            e.style.cssText =
              "\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      margin-bottom: 16px; \n    ";
            var t = document.createElement("div");
            ((t.textContent = T("voiceSelector.title", "VOICE")),
              (t.style.cssText =
                "\n      font-size: 11px;\n      font-weight: 600;\n      color: ".concat(
                  _.textSecondary,
                  ";\n      letter-spacing: 0.5px;\n    ",
                )));
            var n = document.createElement("button");
            return (
              (n.innerHTML = Qr.close),
              (n.style.cssText =
                "\n      width: 20px;\n      height: 20px;\n      border: none;\n      background: transparent;\n      cursor: pointer;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      color: ".concat(
                  _.textSecondary,
                  ";\n      transition: all 0.15s ease;\n      opacity: 0.8;\n      padding: 0;\n    ",
                )),
              (n.onmouseenter = function () {
                ((n.style.opacity = "1"), (n.style.color = _.textPrimary));
              }),
              (n.onmouseleave = function () {
                ((n.style.opacity = "0.8"), (n.style.color = _.textSecondary));
              }),
              (n.onclick = function () {
                return we();
              }),
              e.appendChild(t),
              e.appendChild(n),
              e
            );
          })(),
        ),
        E.appendChild(
          (function () {
            var e = document.createElement("div");
            e.style.cssText =
              "\n      display: none;\n      padding: 8px 10px;\n      margin-bottom: 12px;\n      border-radius: 10px;\n      border: 1px solid rgba(245,158,11,0.45);\n      background: rgba(245,158,11,0.12);\n      color: #f59e0b;\n      font-size: 11px;\n      font-weight: 600;\n      line-height: 1.4;\n    ";
            var t = document.createElement("div");
            return (
              (t.textContent = ""),
              e.appendChild(t),
              (B = e),
              (j = t),
              se(),
              e
            );
          })(),
        ),
        E.appendChild(
          (function () {
            var e = document.createElement("div");
            e.style.cssText =
              "\n      padding: 8px 10px;\n      margin-bottom: 12px;\n      background: rgba(255,255,255,0.04);\n      border: 1px solid rgba(255,255,255,0.08);\n      border-radius: 10px;\n    ";
            var t = document.createElement("div");
            return (
              (t.textContent = T(
                "voiceSelector.currentVoice",
                "CURRENT VOICE",
              )),
              (t.style.cssText =
                "\n      font-size: 10px;\n      font-weight: 600;\n      color: ".concat(
                  _.textSecondary,
                  ";\n      letter-spacing: 0.5px;\n    ",
                )),
              ((V = document.createElement("div")).textContent = A || "—"),
              (V.title = A || "—"),
              (V.style.cssText =
                "\n      margin-top: 4px;\n      font-size: 13px;\n      font-weight: 600;\n      color: ".concat(
                  _.textPrimary,
                  ";\n      overflow: hidden;\n      text-overflow: ellipsis;\n      white-space: nowrap;\n    ",
                )),
              e.appendChild(t),
              e.appendChild(V),
              e
            );
          })(),
        ),
        E.appendChild(
          (function () {
            var e = document.createElement("div");
            e.style.cssText =
              "\n      display: flex;\n      align-items: center;\n      gap: 8px;\n      margin-bottom: 16px;\n    ";
            var t = document.createElement("button"),
              n = z,
              r = function (e) {
                ((t.style.background = e
                  ? "#6366f1"
                  : "rgba(255,255,255,0.05)"),
                  (t.style.color = e ? "white" : _.textPrimary),
                  (t.style.boxShadow = e
                    ? "0 0 8px rgba(99,102,241,0.3)"
                    : "none"));
              };
            ((t.innerHTML = "\n      "
              .concat(Qr.sparkles, "\n      <span>")
              .concat(T("voiceSelector.auto", "Auto"), "</span>\n    ")),
              (t.style.cssText =
                "\n      display: flex;\n      align-items: center;\n      gap: 5px;\n      padding: 6px 12px;\n      border: none;\n      border-radius: 16px;\n      font-size: 12px;\n      font-weight: 600;\n      cursor: pointer;\n      transition: all 0.2s ease;\n      flex-shrink: 0;\n    "),
              r(n),
              (t.onclick = function () {
                (r((z = !z)), x(z));
              }));
            var o = document.createElement("div");
            o.style.cssText =
              "\n      position: relative;\n      flex: 1;\n    ";
            var a = document.createElement("button");
            ((a.innerHTML = "\n      "
              .concat(
                Qr.globe,
                '\n      <span id="bh-voice-lang-text" style="flex: 1; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">',
              )
              .concat(Fr[L] || "English", "</span>\n      ")
              .concat(Qr.chevronDown, "\n    ")),
              (a.style.cssText =
                "\n      width: 100%;\n      display: flex;\n      align-items: center;\n      gap: 8px;\n      padding: 6px 10px;\n      background: rgba(255,255,255,0.05); /* Lighter bg */\n      border: none;\n      border-radius: 16px;\n      color: ".concat(
                  _.textPrimary,
                  ";\n      font-size: 12px;\n      font-weight: 500;\n      cursor: pointer;\n      transition: all 0.15s ease;\n    ",
                )),
              (a.onmouseenter = function () {
                a.style.background = "rgba(255,255,255,0.1)";
              }),
              (a.onmouseleave = function () {
                M || (a.style.background = "rgba(255,255,255,0.05)");
              }),
              ((I = document.createElement("div")).className =
                "bh-voice-lang-dropdown"),
              (I.style.cssText =
                "\n      display: none;\n      position: fixed;\n      background: "
                  .concat(_.dockBg, ";\n      border: 1px solid ")
                  .concat(
                    _.dockBorder,
                    ";\n      border-radius: 8px;\n      padding: 4px;\n      box-shadow: 0 4px 12px rgba(0,0,0,0.4);\n      z-index: 2147483649;\n      max-height: 300px;\n      overflow-y: auto;\n      min-width: 200px;\n    ",
                  )));
            var i = I;
            function s() {
              if ((M = !M)) {
                var e = a.getBoundingClientRect();
                ((i.style.top = "".concat(e.bottom + 4, "px")),
                  (i.style.left = "".concat(e.left, "px")),
                  (i.style.width = "".concat(e.width, "px")),
                  (i.style.display = "block"),
                  i.parentNode || document.documentElement.appendChild(i));
              } else i.style.display = "none";
              a.style.background = M
                ? "rgba(255,255,255,0.1)"
                : "rgba(255,255,255,0.05)";
            }
            (Ir.filter(function (e) {
              return e.supportTTS;
            })
              .map(function (e) {
                return e.code;
              })
              .forEach(function (e) {
                var t = document.createElement("div");
                ((t.textContent = Fr[e] || e),
                  (t.style.cssText =
                    "\n        padding: 6px 10px;\n        font-size: 12px;\n        color: ".concat(
                      e === L ? "#6366f1" : _.textPrimary,
                      ";\n        border-radius: 6px;\n        cursor: pointer;\n        transition: background 0.1s;\n      ",
                    )),
                  (t.onmouseenter = function () {
                    return (t.style.background = "rgba(255,255,255,0.05)");
                  }),
                  (t.onmouseleave = function () {
                    return (t.style.background = "transparent");
                  }),
                  (t.onclick = function (t) {
                    (t.stopPropagation(),
                      (L = e),
                      (document.getElementById(
                        "bh-voice-lang-text",
                      ).textContent = Fr[e] || e),
                      s(),
                      se(),
                      ve(),
                      y(e));
                  }),
                  i.appendChild(t));
              }),
              (a.onclick = function (e) {
                (e.stopPropagation(), s());
              }),
              R && document.removeEventListener("click", R));
            return (
              (R = function (e) {
                !M || o.contains(e.target) || i.contains(e.target) || s();
              }),
              document.addEventListener("click", R),
              o.appendChild(a),
              e.appendChild(o),
              e
            );
          })(),
        ),
        E.appendChild(
          (((e = document.createElement("div")).id = "bh-voice-list-container"),
          (e.style.cssText =
            "\n      flex: 1;\n      overflow-y: auto;\n      /* Custom scrollbar */\n      scrollbar-width: thin;\n      scrollbar-color: rgba(255,255,255,0.2) transparent;\n      margin-right: -8px; /* Offset scrollbar */\n      padding-right: 8px;\n    "),
          (O = e),
          setTimeout(ve, 0),
          e),
        ),
        t.appendChild(E),
        document.documentElement.appendChild(t),
        (P = t),
        t
      );
    }
    function fe(e) {
      if (h) {
        var t = h.getBoundingClientRect(),
          n = t.left + t.width / 2 - 140,
          r = t.bottom + 8,
          o = window.innerWidth,
          a = window.innerHeight;
        (n < 10 && (n = 10),
          n + 280 > o - 10 && (n = o - 280 - 10),
          r + 480 > a - 10 && (r = t.top - 480 - 8) < 10 && (r = (a - 480) / 2),
          (E.style.left = "".concat(n, "px")),
          (E.style.top = "".concat(r, "px")));
      } else
        ((E.style.left = "50%"),
          (E.style.top = "50%"),
          (E.style.transform = "translate(-50%, -50%)"));
    }
    function me(e, t) {
      return e !== W || t !== O || !t.isConnected;
    }
    function ve() {
      return ye.apply(this, arguments);
    }
    function ye() {
      return (ye = Xr(
        Yr().mark(function e() {
          var t,
            n,
            r,
            o,
            a,
            i,
            s,
            l,
            c,
            u,
            d,
            p,
            g,
            h,
            f,
            m,
            v,
            y,
            b,
            x,
            w,
            S,
            k,
            C,
            E,
            P,
            M,
            z;
          return Yr().wrap(
            function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    if (((t = ++W), (n = O) && n.isConnected)) {
                      e.next = 4;
                      break;
                    }
                    return e.abrupt("return");
                  case 4:
                    return (
                      se(),
                      (n.innerHTML =
                        '\n      <div style="text-align:center; padding: 40px; color: '
                          .concat(
                            _.textSecondary,
                            ';">\n        <div style="font-size: 12px; margin-bottom: 8px;">',
                          )
                          .concat(
                            T(
                              "voiceSelector.loadingVoices",
                              "Loading voices...",
                            ),
                            '</div>\n        <div style="width: 20px; height: 20px; margin: 0 auto; border: 2px solid rgba(255,255,255,0.2); border-top-color: #6366f1; border-radius: 50%; animation: bh-spin 0.8s linear infinite;"></div>\n      </div>\n    ',
                          )),
                      (e.prev = 6),
                      (e.next = 9),
                      ue(L)
                    );
                  case 9:
                    if (((r = e.sent), !me(t, n))) {
                      e.next = 12;
                      break;
                    }
                    return e.abrupt("return");
                  case 12:
                    return ((e.next = 14), pe(r));
                  case 14:
                    if (!me(t, n)) {
                      e.next = 16;
                      break;
                    }
                    return e.abrupt("return");
                  case 16:
                    if (((n.innerHTML = ""), 0 !== r.length)) {
                      e.next = 20;
                      break;
                    }
                    return (
                      (n.innerHTML =
                        '<div style="text-align:center; padding: 30px; color: '
                          .concat(_.textSecondary, '; font-size: 12px;">')
                          .concat(
                            T("voiceSelector.noVoices", "No voices available"),
                            "</div>",
                          )),
                      e.abrupt("return")
                    );
                  case 20:
                    return ((e.next = 22), $());
                  case 22:
                    if (!me(t, n)) {
                      e.next = 24;
                      break;
                    }
                    return e.abrupt("return");
                  case 24:
                    ((o = []),
                      (a = []),
                      r.forEach(function (e) {
                        Z.has(e.voiceName) ? o.push(e) : a.push(e);
                      }),
                      o.sort(function (e, t) {
                        return (e.rank || 999) - (t.rank || 999);
                      }),
                      a.sort(function (e, t) {
                        return (e.rank || 999) - (t.rank || 999);
                      }),
                      o.length > 0 &&
                        (((i = document.createElement("div")).style.cssText =
                          "margin-bottom: 8px;"),
                        ((s = document.createElement("div")).style.cssText =
                          "\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          margin-bottom: ".concat(
                            J ? "0" : "6px",
                            ";\n          padding: 6px 4px;\n          cursor: pointer;\n          border-radius: 6px;\n          transition: background 0.15s ease;\n        ",
                          )),
                        (s.onmouseenter = function () {
                          s.style.background = "rgba(255,255,255,0.03)";
                        }),
                        (s.onmouseleave = function () {
                          s.style.background = "transparent";
                        }),
                        ((l = document.createElement("span")).innerHTML = J
                          ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>'
                          : '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>'),
                        (l.style.cssText = "\n          color: ".concat(
                          _.textSecondary,
                          ";\n          display: flex;\n          align-items: center;\n          transition: transform 0.2s ease;\n        ",
                        )),
                        ((c = document.createElement("span")).innerHTML =
                          '<svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'),
                        (c.style.cssText =
                          "display: flex; align-items: center;"),
                        ((u = document.createElement("span")).textContent = ""
                          .concat(
                            T("voiceSelector.favorites", "FAVORITES"),
                            " (",
                          )
                          .concat(o.length, ")")),
                        (u.style.cssText =
                          "\n          font-size: 10px;\n          font-weight: 600;\n          letter-spacing: 0.5px;\n          color: ".concat(
                            _.textSecondary,
                            ";\n          white-space: nowrap;\n        ",
                          )),
                        ((d = document.createElement("div")).style.cssText =
                          "\n          flex: 1;\n          height: 1px;\n          background: linear-gradient(to right, rgba(245,158,11,0.3), transparent);\n        "),
                        s.appendChild(l),
                        s.appendChild(c),
                        s.appendChild(u),
                        s.appendChild(d),
                        (s.onclick = function () {
                          ((J = !J), ne(), ve());
                        }),
                        i.appendChild(s),
                        J ||
                          ((p = document.createElement("div")),
                          o.forEach(function (e) {
                            var t = e.language !== ie();
                            p.appendChild(be(e, t));
                          }),
                          i.appendChild(p)),
                        n.appendChild(i)),
                      (g = a).length > 0 &&
                        ((f = {
                          US: "🇺🇸 United States (US)",
                          UK: "🇬🇧 United Kingdom (UK)",
                          AU: "🇦🇺 Australia (AU)",
                          IN: "🇮🇳 India (IN)",
                          "pt-BR": "🇧🇷 Brazil (pt-BR)",
                          "pt-PT": "🇵🇹 Portugal (pt-PT)",
                          ES: "🇪🇸 Spain (ES)",
                          MX: "🇲🇽 Mexico (MX)",
                          AR: "🇦🇷 Argentina (AR)",
                          FR: "🇫🇷 France (FR)",
                          CA: "🇨🇦 Canada (CA)",
                          "zh-CN": "🇨🇳 Simplified (zh-CN)",
                          "zh-TW": "🇹🇼 Traditional (zh-TW)",
                          "zh-HK": "🇭🇰 Cantonese (zh-HK)",
                        }),
                        (h =
                          {
                            en: ["US", "UK", "AU", "IN"],
                            pt: ["pt-BR", "pt-PT"],
                          }[L] || []).length > 0
                          ? ((m = {}),
                            (v = []),
                            g.forEach(function (e) {
                              var t,
                                n = e.tags || [],
                                r = null,
                                o = Hr(h);
                              try {
                                for (o.s(); !(t = o.n()).done; ) {
                                  var a = t.value;
                                  if (n.includes(a)) {
                                    r = a;
                                    break;
                                  }
                                }
                              } catch (e) {
                                o.e(e);
                              } finally {
                                o.f();
                              }
                              r
                                ? (m[r] || (m[r] = []), m[r].push(e))
                                : v.push(e);
                            }),
                            h.forEach(function (e) {
                              var t = m[e];
                              if (t && 0 !== t.length) {
                                var r = document.createElement("div");
                                r.style.cssText =
                                  "\n              display: flex;\n              align-items: center;\n              gap: 8px;\n              margin-top: 14px;\n              margin-bottom: 6px;\n            ";
                                var o = document.createElement("span");
                                ((o.textContent = f[e] || e),
                                  (o.style.cssText =
                                    "\n              font-size: 10px;\n              font-weight: 500;\n              color: ".concat(
                                      _.textSecondary,
                                      ";\n              white-space: nowrap;\n            ",
                                    )));
                                var a = document.createElement("div");
                                ((a.style.cssText =
                                  "\n              flex: 1;\n              height: 1px;\n              background: linear-gradient(to right, rgba(255,255,255,0.15), transparent);\n            "),
                                  r.appendChild(o),
                                  r.appendChild(a),
                                  n.appendChild(r),
                                  t.forEach(function (e) {
                                    var t = e.language !== ie();
                                    n.appendChild(be(e, t));
                                  }));
                              }
                            }),
                            v.length > 0 &&
                              (((y =
                                document.createElement("div")).style.cssText =
                                "\n              display: flex;\n              align-items: center;\n              gap: 8px;\n              margin-top: 14px;\n              margin-bottom: 6px;\n            "),
                              ((b =
                                document.createElement("span")).textContent =
                                "🌐 Other"),
                              (b.style.cssText =
                                "\n              font-size: 10px;\n              font-weight: 500;\n              color: ".concat(
                                  _.textSecondary,
                                  ";\n              white-space: nowrap;\n            ",
                                )),
                              ((x =
                                document.createElement("div")).style.cssText =
                                "\n              flex: 1;\n              height: 1px;\n              background: linear-gradient(to right, rgba(255,255,255,0.15), transparent);\n            "),
                              y.appendChild(b),
                              y.appendChild(x),
                              n.appendChild(y),
                              v.forEach(function (e) {
                                var t = e.language !== ie();
                                n.appendChild(be(e, t));
                              })))
                          : g.forEach(function (e) {
                              var t = e.language !== ie();
                              n.appendChild(be(e, t));
                            })),
                      U &&
                        (((w = document.createElement("div")).style.cssText =
                          "\n          text-align: center;\n          padding: 10px 12px;\n          margin-top: 12px;\n          font-size: 11px;\n          color: #ef4444;\n          background: rgba(239, 68, 68, 0.1);\n          border: 1px solid rgba(239, 68, 68, 0.2);\n          border-radius: 8px;\n        "),
                        ((S = document.createElement("div")).textContent = "⚠"),
                        (S.style.cssText =
                          "font-size: 16px; margin-bottom: 4px;"),
                        ((k = document.createElement("div")).textContent = T(
                          "voiceSelector.loadFailed",
                          "Failed to load voices",
                        )),
                        (k.style.cssText =
                          "font-weight: 600; margin-bottom: 2px;"),
                        ((C = document.createElement("div")).textContent = T(
                          "voiceSelector.usingOfflineData",
                          "Using offline data",
                        )),
                        (C.style.cssText = "font-size: 10px; color: ".concat(
                          _.textSecondary,
                          ";",
                        )),
                        w.appendChild(S),
                        w.appendChild(k),
                        w.appendChild(C),
                        n.appendChild(w)),
                      ((E = document.createElement("div")).style.cssText =
                        "\n        margin-top: 16px;\n        padding: 12px;\n        background: rgba(88, 101, 242, 0.08);\n        border: 1px solid rgba(88, 101, 242, 0.2);\n        border-radius: 8px;\n        text-align: center;\n        cursor: pointer;\n        transition: all 0.2s ease;\n      "),
                      (E.onmouseenter = function () {
                        ((E.style.background = "rgba(88, 101, 242, 0.15)"),
                          (E.style.borderColor = "rgba(88, 101, 242, 0.4)"));
                      }),
                      (E.onmouseleave = function () {
                        ((E.style.background = "rgba(88, 101, 242, 0.08)"),
                          (E.style.borderColor = "rgba(88, 101, 242, 0.2)"));
                      }),
                      (E.onclick = function () {
                        window.open($r, "_blank");
                      }),
                      ((P = document.createElement("div")).innerHTML =
                        '<svg width="20" height="20" viewBox="0 0 24 24" fill="#5865F2">\n        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>\n      </svg>'),
                      (P.style.cssText = "margin-bottom: 6px;"),
                      ((M = document.createElement("div")).textContent = T(
                        "voiceSelector.requestVoice",
                        "Can't find the voice you need?",
                      )),
                      (M.style.cssText =
                        "\n        font-size: 11px;\n        color: ".concat(
                          _.textSecondary,
                          ";\n        margin-bottom: 4px;\n      ",
                        )),
                      ((z = document.createElement("div")).textContent = T(
                        "voiceSelector.requestOnDiscord",
                        "Request on Discord →",
                      )),
                      (z.style.cssText =
                        "\n        font-size: 12px;\n        font-weight: 600;\n        color: #5865F2;\n      "),
                      E.appendChild(P),
                      E.appendChild(M),
                      E.appendChild(z),
                      n.appendChild(E),
                      (e.next = 61));
                    break;
                  case 53:
                    if (((e.prev = 53), (e.t0 = e.catch(6)), !me(t, n))) {
                      e.next = 57;
                      break;
                    }
                    return e.abrupt("return");
                  case 57:
                    return (
                      (n.innerHTML =
                        '\n        <div style="text-align:center; padding: 30px; color: #ef4444;">\n          <div style="font-size: 12px; margin-bottom: 8px;">Failed to load voices</div>\n          <div style="font-size: 11px; color: '
                          .concat(_.textSecondary, ';">')
                          .concat(
                            e.t0.message,
                            "</div>\n        </div>\n      ",
                          )),
                      (e.next = 61),
                      pe()
                    );
                  case 61:
                  case "end":
                    return e.stop();
                }
            },
            e,
            null,
            [[6, 53]],
          );
        }),
      )).apply(this, arguments);
    }
    function be(e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
        n = e.voiceName === N || e.name === N,
        r = document.createElement("div"),
        o = n ? C.selectedCardBorder : "transparent",
        a = n ? C.selectedCardBg : "transparent",
        i = n ? C.selectedCardBorder : C.cardBorder,
        s = n ? "rgba(99,102,241,0.16)" : "rgba(255,255,255,0.03)";
      ((r.style.cssText =
        "\n      display: flex;\n      align-items: center;\n      gap: 12px;\n      padding: 8px 4px;\n      background: "
          .concat(a, ";\n      border: 1px solid ")
          .concat(o, ";\n      border-radius: 8px;\n      cursor: ")
          .concat(
            t ? "not-allowed" : "pointer",
            ";\n      transition: all 0.2s ease;\n      position: relative;\n    ",
          )),
        (r.onmouseenter = function () {
          ((r.style.backgroundColor = s),
            (r.style.borderColor = i),
            (r.style.borderRadius = "6px"),
            (r.style.paddingLeft = "8px"),
            (r.style.paddingRight = "8px"));
        }),
        (r.onmouseleave = function () {
          ((r.style.backgroundColor = a),
            (r.style.borderColor = o),
            (r.style.paddingLeft = "4px"),
            (r.style.paddingRight = "4px"));
        }));
      var l = Z.has(e.voiceName),
        c = document.createElement("button"),
        u =
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
        d =
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
      ((c.innerHTML = l ? u : d),
        (c.title = l ? "Remove from favorites" : "Add to favorites"),
        (c.style.cssText =
          "\n      width: 28px;\n      height: 28px;\n      border-radius: 50%;\n      border: none;\n      background: "
            .concat(
              l ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.05)",
              ";\n      color: ",
            )
            .concat(
              l ? "#f59e0b" : "rgba(255,255,255,0.4)",
              ";\n      cursor: pointer;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      transition: all 0.2s ease;\n      flex-shrink: 0;\n    ",
            )),
        (c.onmouseenter = function (e) {
          (e.stopPropagation(),
            (c.style.background = l
              ? "rgba(245,158,11,0.25)"
              : "rgba(245,158,11,0.1)"),
            (c.style.color = l ? "#fbbf24" : "#f59e0b"),
            (c.style.transform = "scale(1.1)"),
            l || (c.innerHTML = u));
        }),
        (c.onmouseleave = function (e) {
          (e.stopPropagation(),
            (c.style.background = l
              ? "rgba(245,158,11,0.15)"
              : "rgba(255,255,255,0.05)"),
            (c.style.color = l ? "#f59e0b" : "rgba(255,255,255,0.4)"),
            (c.style.transform = "scale(1)"),
            (c.innerHTML = l ? u : d));
        }),
        (c.onclick = function (t) {
          (t.stopPropagation(),
            (function (e) {
              oe.apply(this, arguments);
            })(e.voiceName));
        }));
      var p = document.createElement("div");
      p.style.cssText =
        "\n      flex: 1;\n      display: flex;\n      flex-direction: column;\n      gap: 2px;\n    ";
      var g = document.createElement("div");
      ((g.textContent = e.name),
        (g.style.cssText = "\n      color: "
          .concat(
            _.textPrimary,
            ";\n      font-size: 13px;\n      font-weight: ",
          )
          .concat(n ? "600" : "500", ";\n    ")));
      var h = document.createElement("div");
      h.style.cssText =
        "\n      font-size: 11px;\n      display: flex;\n      align-items: center;\n      gap: 4px;\n      opacity: 0.9;\n    ";
      var f = document.createElement("span");
      ((f.textContent = "female" === e.gender ? "Female" : "Male"),
        (f.style.color = "female" === e.gender ? C.femaleText : C.maleText));
      var v = document.createElement("span");
      ((v.textContent = "•"), (v.style.color = _.textSecondary));
      var y = document.createElement("span");
      ((y.textContent =
        e.description || ("female" === e.gender ? "Bright" : "Deep")),
        (y.style.color = _.textSecondary),
        h.appendChild(f),
        h.appendChild(v),
        h.appendChild(y),
        p.appendChild(g),
        p.appendChild(h));
      var b = document.createElement("button");
      return (
        (b.innerHTML = Qr.speaker),
        (b.title = "Play sample"),
        (b.style.cssText =
          "\n      width: 24px;\n      height: 24px;\n      border-radius: 50%;\n      border: none;\n      background: transparent;\n      color: ".concat(
            _.textSecondary,
            ";\n      cursor: pointer;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      transition: all 0.2s;\n    ",
          )),
        (b.onmouseenter = function (e) {
          (e.stopPropagation(),
            (b.style.color = "white"),
            (b.style.background = "rgba(255,255,255,0.1)"));
        }),
        (b.onmouseleave = function (e) {
          Y !== b &&
            ((b.style.color = _.textSecondary),
            (b.style.background = "transparent"));
        }),
        (b.onclick = function (t) {
          t.stopPropagation();
          var n = e.sampleURL;
          if (n) {
            if (Y === b && X) return (ce(), ae(b), (Y = null), void (X = null));
            (X && (ce(), Y && ae(Y), (Y = null), (X = null)),
              (b.innerHTML =
                '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n      <circle cx="12" cy="12" r="10" opacity="0.25"/>\n      <path d="M12 2 A10 10 0 0 1 22 12" stroke-linecap="round">\n        <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/>\n      </path>\n    </svg>'),
              (b.style.color = "#6366f1"),
              (Y = b));
            var r = String((G += 1));
            ((X = r),
              chrome.runtime.sendMessage(
                { type: "playVoiceSample", requestId: r, sampleUrl: n },
                function (e) {
                  if (chrome.runtime.lastError)
                    return (
                      Y === b && (ae(b), (Y = null), (X = null)),
                      void xe("Failed to play audio", "error")
                    );
                  e &&
                    !1 === e.ok &&
                    (Y === b && (ae(b), (Y = null), (X = null)),
                    xe(e.error || "Failed to play audio", "error"));
                },
              ));
          } else xe("No audio sample available", "warning");
        }),
        r.appendChild(c),
        r.appendChild(p),
        r.appendChild(b),
        (r.onclick = function () {
          if (t) {
            B &&
              "none" !== B.style.display &&
              B.animate &&
              B.animate(
                [
                  { transform: "translateX(0)" },
                  { transform: "translateX(-6px)" },
                  { transform: "translateX(6px)" },
                  { transform: "translateX(-4px)" },
                  { transform: "translateX(4px)" },
                  { transform: "translateX(0)" },
                ],
                { duration: 280, easing: "ease-in-out" },
              );
            var n = ie();
            xe("Please select a voice for ".concat(Fr[n] || n), "warning");
          } else
            (Xr(
              Yr().mark(function t() {
                var n, r;
                return Yr().wrap(
                  function (t) {
                    for (;;)
                      switch ((t.prev = t.next)) {
                        case 0:
                          return (
                            (t.prev = 0),
                            (t.next = 3),
                            chrome.storage.sync.get(["voiceByLanguage"])
                          );
                        case 3:
                          return (
                            (n = t.sent),
                            ((r = n.voiceByLanguage || {})[e.language] = {
                              voiceName: e.voiceName,
                              voiceId: e.id,
                              displayName: e.name,
                              responseFormat: e.responseFormat || "pcm",
                            }),
                            (t.next = 8),
                            chrome.storage.sync.set({ voiceByLanguage: r })
                          );
                        case 8:
                          return (
                            (t.next = 10),
                            chrome.storage.local.set({ needVoiceSelection: !1 })
                          );
                        case 10:
                          t.next = 16;
                          break;
                        case 13:
                          ((t.prev = 13), (t.t0 = t.catch(0)));
                        case 16:
                        case "end":
                          return t.stop();
                      }
                  },
                  t,
                  null,
                  [[0, 13]],
                );
              }),
            )(),
              (N = e.voiceName),
              (A = e.name),
              V && ((V.textContent = e.name), (V.title = e.name)),
              m(e.voiceName, e),
              we());
        }),
        r
      );
    }
    function xe(e) {
      var t =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "info";
      if (F && F.parentNode)
        (clearTimeout(q),
          (F.textContent = e),
          (F.style.animation = "none"),
          setTimeout(function () {
            F.style.animation = "bh-slide-down 0.2s ease";
          }, 10));
      else {
        var n = document.createElement("div");
        ((n.textContent = e),
          (n.style.cssText =
            "\n        position: fixed;\n        top: 20px;\n        left: 50%;\n        transform: translateX(-50%);\n        background: ".concat(
              "warning" === t ? "#f59e0b" : "#6366f1",
              ';\n        color: white;\n        padding: 12px 20px;\n        border-radius: 8px;\n        font-size: 13px;\n        font-weight: 500;\n        box-shadow: 0 4px 12px rgba(0,0,0,0.3);\n        z-index: 2147483649;\n        animation: bh-slide-down 0.2s ease;\n        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n      ',
            )),
          document.documentElement.appendChild(n),
          (F = n));
      }
      q = setTimeout(function () {
        F &&
          F.parentNode &&
          ((F.style.opacity = "0"),
          (F.style.transform = "translateX(-50%) translateY(-10px)"),
          (F.style.transition = "all 0.2s ease"),
          setTimeout(function () {
            (F && F.parentNode && F.parentNode.removeChild(F),
              (F = null),
              (q = null));
          }, 200));
      }, 2e3);
    }
    function we() {
      var e = P || document.querySelector(".bh-voice-selector-overlay");
      (e &&
        e.parentNode &&
        ((e.style.opacity = "0"),
        setTimeout(function () {
          e.parentNode && e.parentNode.removeChild(e);
        }, 150)),
        (P = null),
        (O = null),
        I && I.parentNode && (I.parentNode.removeChild(I), (I = null)),
        (M = !1),
        R && (document.removeEventListener("click", R), (R = null)),
        q && (clearTimeout(q), (q = null)),
        F && F.parentNode && (F.parentNode.removeChild(F), (F = null)),
        K && (chrome.runtime.onMessage.removeListener(K), (K = null)),
        S());
    }
    return {
      show: function () {
        P && P.isConnected
          ? E && fe()
          : (ue(L).catch(function (e) {}),
            he(),
            (function () {
              le.apply(this, arguments);
            })());
      },
      hide: function () {
        we();
      },
    };
  }
  function so(e) {
    return (
      (so =
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
      so(e)
    );
  }
  function lo() {
    lo = function () {
      return t;
    };
    var e,
      t = {},
      n = Object.prototype,
      r = n.hasOwnProperty,
      o =
        Object.defineProperty ||
        function (e, t, n) {
          e[t] = n.value;
        },
      a = "function" == typeof Symbol ? Symbol : {},
      i = a.iterator || "@@iterator",
      s = a.asyncIterator || "@@asyncIterator",
      l = a.toStringTag || "@@toStringTag";
    function c(e, t, n) {
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
      c({}, "");
    } catch (e) {
      c = function (e, t, n) {
        return (e[t] = n);
      };
    }
    function u(e, t, n, r) {
      var a = t && t.prototype instanceof v ? t : v,
        i = Object.create(a.prototype),
        s = new M(r || []);
      return (o(i, "_invoke", { value: C(e, n, s) }), i);
    }
    function d(e, t, n) {
      try {
        return { type: "normal", arg: e.call(t, n) };
      } catch (e) {
        return { type: "throw", arg: e };
      }
    }
    t.wrap = u;
    var p = "suspendedStart",
      g = "suspendedYield",
      h = "executing",
      f = "completed",
      m = {};
    function v() {}
    function y() {}
    function b() {}
    var x = {};
    c(x, i, function () {
      return this;
    });
    var w = Object.getPrototypeOf,
      S = w && w(w(L([])));
    S && S !== n && r.call(S, i) && (x = S);
    var k = (b.prototype = v.prototype = Object.create(x));
    function T(e) {
      ["next", "throw", "return"].forEach(function (t) {
        c(e, t, function (e) {
          return this._invoke(t, e);
        });
      });
    }
    function _(e, t) {
      function n(o, a, i, s) {
        var l = d(e[o], e, a);
        if ("throw" !== l.type) {
          var c = l.arg,
            u = c.value;
          return u && "object" == so(u) && r.call(u, "__await")
            ? t.resolve(u.__await).then(
                function (e) {
                  n("next", e, i, s);
                },
                function (e) {
                  n("throw", e, i, s);
                },
              )
            : t.resolve(u).then(
                function (e) {
                  ((c.value = e), i(c));
                },
                function (e) {
                  return n("throw", e, i, s);
                },
              );
        }
        s(l.arg);
      }
      var a;
      o(this, "_invoke", {
        value: function (e, r) {
          function o() {
            return new t(function (t, o) {
              n(e, r, t, o);
            });
          }
          return (a = a ? a.then(o, o) : o());
        },
      });
    }
    function C(t, n, r) {
      var o = p;
      return function (a, i) {
        if (o === h) throw new Error("Generator is already running");
        if (o === f) {
          if ("throw" === a) throw i;
          return { value: e, done: !0 };
        }
        for (r.method = a, r.arg = i; ; ) {
          var s = r.delegate;
          if (s) {
            var l = E(s, r);
            if (l) {
              if (l === m) continue;
              return l;
            }
          }
          if ("next" === r.method) r.sent = r._sent = r.arg;
          else if ("throw" === r.method) {
            if (o === p) throw ((o = f), r.arg);
            r.dispatchException(r.arg);
          } else "return" === r.method && r.abrupt("return", r.arg);
          o = h;
          var c = d(t, n, r);
          if ("normal" === c.type) {
            if (((o = r.done ? f : g), c.arg === m)) continue;
            return { value: c.arg, done: r.done };
          }
          "throw" === c.type &&
            ((o = f), (r.method = "throw"), (r.arg = c.arg));
        }
      };
    }
    function E(t, n) {
      var r = n.method,
        o = t.iterator[r];
      if (o === e)
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
          m
        );
      var a = d(o, t.iterator, n.arg);
      if ("throw" === a.type)
        return ((n.method = "throw"), (n.arg = a.arg), (n.delegate = null), m);
      var i = a.arg;
      return i
        ? i.done
          ? ((n[t.resultName] = i.value),
            (n.next = t.nextLoc),
            "return" !== n.method && ((n.method = "next"), (n.arg = e)),
            (n.delegate = null),
            m)
          : i
        : ((n.method = "throw"),
          (n.arg = new TypeError("iterator result is not an object")),
          (n.delegate = null),
          m);
    }
    function P(e) {
      var t = { tryLoc: e[0] };
      (1 in e && (t.catchLoc = e[1]),
        2 in e && ((t.finallyLoc = e[2]), (t.afterLoc = e[3])),
        this.tryEntries.push(t));
    }
    function O(e) {
      var t = e.completion || {};
      ((t.type = "normal"), delete t.arg, (e.completion = t));
    }
    function M(e) {
      ((this.tryEntries = [{ tryLoc: "root" }]),
        e.forEach(P, this),
        this.reset(!0));
    }
    function L(t) {
      if (t || "" === t) {
        var n = t[i];
        if (n) return n.call(t);
        if ("function" == typeof t.next) return t;
        if (!isNaN(t.length)) {
          var o = -1,
            a = function n() {
              for (; ++o < t.length; )
                if (r.call(t, o)) return ((n.value = t[o]), (n.done = !1), n);
              return ((n.value = e), (n.done = !0), n);
            };
          return (a.next = a);
        }
      }
      throw new TypeError(so(t) + " is not iterable");
    }
    return (
      (y.prototype = b),
      o(k, "constructor", { value: b, configurable: !0 }),
      o(b, "constructor", { value: y, configurable: !0 }),
      (y.displayName = c(b, l, "GeneratorFunction")),
      (t.isGeneratorFunction = function (e) {
        var t = "function" == typeof e && e.constructor;
        return (
          !!t && (t === y || "GeneratorFunction" === (t.displayName || t.name))
        );
      }),
      (t.mark = function (e) {
        return (
          Object.setPrototypeOf
            ? Object.setPrototypeOf(e, b)
            : ((e.__proto__ = b), c(e, l, "GeneratorFunction")),
          (e.prototype = Object.create(k)),
          e
        );
      }),
      (t.awrap = function (e) {
        return { __await: e };
      }),
      T(_.prototype),
      c(_.prototype, s, function () {
        return this;
      }),
      (t.AsyncIterator = _),
      (t.async = function (e, n, r, o, a) {
        void 0 === a && (a = Promise);
        var i = new _(u(e, n, r, o), a);
        return t.isGeneratorFunction(n)
          ? i
          : i.next().then(function (e) {
              return e.done ? e.value : i.next();
            });
      }),
      T(k),
      c(k, l, "Generator"),
      c(k, i, function () {
        return this;
      }),
      c(k, "toString", function () {
        return "[object Generator]";
      }),
      (t.keys = function (e) {
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
      (t.values = L),
      (M.prototype = {
        constructor: M,
        reset: function (t) {
          if (
            ((this.prev = 0),
            (this.next = 0),
            (this.sent = this._sent = e),
            (this.done = !1),
            (this.delegate = null),
            (this.method = "next"),
            (this.arg = e),
            this.tryEntries.forEach(O),
            !t)
          )
            for (var n in this)
              "t" === n.charAt(0) &&
                r.call(this, n) &&
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
          function o(r, o) {
            return (
              (s.type = "throw"),
              (s.arg = t),
              (n.next = r),
              o && ((n.method = "next"), (n.arg = e)),
              !!o
            );
          }
          for (var a = this.tryEntries.length - 1; a >= 0; --a) {
            var i = this.tryEntries[a],
              s = i.completion;
            if ("root" === i.tryLoc) return o("end");
            if (i.tryLoc <= this.prev) {
              var l = r.call(i, "catchLoc"),
                c = r.call(i, "finallyLoc");
              if (l && c) {
                if (this.prev < i.catchLoc) return o(i.catchLoc, !0);
                if (this.prev < i.finallyLoc) return o(i.finallyLoc);
              } else if (l) {
                if (this.prev < i.catchLoc) return o(i.catchLoc, !0);
              } else {
                if (!c)
                  throw new Error("try statement without catch or finally");
                if (this.prev < i.finallyLoc) return o(i.finallyLoc);
              }
            }
          }
        },
        abrupt: function (e, t) {
          for (var n = this.tryEntries.length - 1; n >= 0; --n) {
            var o = this.tryEntries[n];
            if (
              o.tryLoc <= this.prev &&
              r.call(o, "finallyLoc") &&
              this.prev < o.finallyLoc
            ) {
              var a = o;
              break;
            }
          }
          a &&
            ("break" === e || "continue" === e) &&
            a.tryLoc <= t &&
            t <= a.finallyLoc &&
            (a = null);
          var i = a ? a.completion : {};
          return (
            (i.type = e),
            (i.arg = t),
            a
              ? ((this.method = "next"), (this.next = a.finallyLoc), m)
              : this.complete(i)
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
            m
          );
        },
        finish: function (e) {
          for (var t = this.tryEntries.length - 1; t >= 0; --t) {
            var n = this.tryEntries[t];
            if (n.finallyLoc === e)
              return (this.complete(n.completion, n.afterLoc), O(n), m);
          }
        },
        catch: function (e) {
          for (var t = this.tryEntries.length - 1; t >= 0; --t) {
            var n = this.tryEntries[t];
            if (n.tryLoc === e) {
              var r = n.completion;
              if ("throw" === r.type) {
                var o = r.arg;
                O(n);
              }
              return o;
            }
          }
          throw new Error("illegal catch attempt");
        },
        delegateYield: function (t, n, r) {
          return (
            (this.delegate = { iterator: L(t), resultName: n, nextLoc: r }),
            "next" === this.method && (this.arg = e),
            m
          );
        },
      }),
      t
    );
  }
  function co(e, t) {
    return (
      (function (e) {
        if (Array.isArray(e)) return e;
      })(e) ||
      (function (e, t) {
        var n =
          null == e
            ? null
            : ("undefined" != typeof Symbol && e[Symbol.iterator]) ||
              e["@@iterator"];
        if (null != n) {
          var r,
            o,
            a,
            i,
            s = [],
            l = !0,
            c = !1;
          try {
            if (((a = (n = n.call(e)).next), 0 === t)) {
              if (Object(n) !== n) return;
              l = !1;
            } else
              for (
                ;
                !(l = (r = a.call(n)).done) &&
                (s.push(r.value), s.length !== t);
                l = !0
              );
          } catch (e) {
            ((c = !0), (o = e));
          } finally {
            try {
              if (!l && null != n.return && ((i = n.return()), Object(i) !== i))
                return;
            } finally {
              if (c) throw o;
            }
          }
          return s;
        }
      })(e, t) ||
      (function (e, t) {
        if (!e) return;
        if ("string" == typeof e) return uo(e, t);
        var n = Object.prototype.toString.call(e).slice(8, -1);
        "Object" === n && e.constructor && (n = e.constructor.name);
        if ("Map" === n || "Set" === n) return Array.from(e);
        if (
          "Arguments" === n ||
          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
        )
          return uo(e, t);
      })(e, t) ||
      (function () {
        throw new TypeError(
          "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
        );
      })()
    );
  }
  function uo(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
    return r;
  }
  function po(e, t, n, r, o, a, i) {
    try {
      var s = e[a](i),
        l = s.value;
    } catch (e) {
      return void n(e);
    }
    s.done ? t(l) : Promise.resolve(l).then(r, o);
  }
  function go(e, t) {
    var n =
        arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "dark",
      r =
        arguments.length > 3 && void 0 !== arguments[3]
          ? arguments[3]
          : function (e, t) {
              return t;
            };
    Vr();
    var o = !1,
      a = null;
    function i() {
      var o, i, c;
      document
        .querySelectorAll(".bh-language-order-tooltip")
        .forEach(function (e) {
          return e.remove();
        });
      var u = e.theme || n,
        d = Ar[u];
      (((a = document.createElement("div")).className =
        "bh-settings-panel-dock"),
        (a.style.cssText =
          "\n      position: absolute;\n      top: 100%;\n      right: 0;\n      margin-top: 8px;\n      width: 300px;\n      background: "
            .concat(d.dockBg, ";\n      border: 1px solid ")
            .concat(
              d.dockBorder,
              ";\n      border-radius: 12px;\n      padding: 16px;\n      box-shadow: 0 8px 32px rgba(0,0,0,0.4);\n      backdrop-filter: blur(20px);\n      z-index: 2147483647;\n      animation: bh-slide-down 0.15s ease;\n      display: none;\n      max-height: 70vh;\n      overflow-y: auto;\n    ",
            )));
      var p = document.createElement("div");
      ((p.style.cssText =
        "\n      font-size: 11px;\n      font-weight: 600;\n      color: ".concat(
          d.textSecondary,
          ";\n      letter-spacing: 0.5px;\n      margin-bottom: 16px;\n    ",
        )),
        (p.textContent = r("settingsPanel.title", "SETTINGS")),
        a.appendChild(p),
        a.appendChild(
          s(
            d,
            r("settingsPanel.captionPanelFontSize", "Caption Panel Font Size"),
            null !== (o = e.overlayFontSize) && void 0 !== o ? o : 18,
            12,
            32,
            function (n) {
              ((e.overlayFontSize = n), t("overlayFontSize", n));
            },
            "px",
          ),
        ),
        a.appendChild(
          s(
            d,
            r("settingsPanel.cinemaModeFontSize", "Cinema Mode Font Size"),
            null !== (i = e.stripFontSize) && void 0 !== i ? i : 30,
            20,
            75,
            function (n) {
              ((e.stripFontSize = n), t("stripFontSize", n));
            },
            "px",
          ),
        ),
        a.appendChild(
          s(
            d,
            r("settingsPanel.backgroundOpacity", "Background Opacity"),
            Math.round(
              100 *
                (null !== (c = e.backgroundOpacity) && void 0 !== c ? c : 0.95),
            ),
            0,
            100,
            function (n) {
              var r = n / 100;
              ((e.backgroundOpacity = r), t("backgroundOpacity", r));
            },
            "%",
          ),
        ));
      var g = document.createElement("div");
      ((g.style.cssText = "\n      height: 1px;\n      background: ".concat(
        d.dockBorder,
        ";\n      margin: 16px 0;\n    ",
      )),
        a.appendChild(g),
        a.appendChild(
          (function (n) {
            var o = document.createElement("div");
            o.style.cssText =
              "\n      background: rgba(255,255,255,0.03);\n      border-radius: 8px;\n      padding: 12px;\n    ";
            var a = document.createElement("div");
            ((a.style.cssText =
              "\n      font-size: 14px;\n      font-weight: 500;\n      color: ".concat(
                n.textPrimary,
                ";\n      margin-bottom: 12px;\n    ",
              )),
              (a.textContent = r(
                "settingsPanel.subtitleDisplay",
                "Subtitle Display",
              )));
            var i = document.createElement("div");
            i.style.cssText =
              "\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      margin-bottom: 12px;\n    ";
            var s = document.createElement("span");
            ((s.style.cssText =
              "\n      font-size: 13px;\n      color: ".concat(
                n.textPrimary,
                ";\n    ",
              )),
              (s.textContent = r(
                "settingsPanel.showBothLanguages",
                "Show Both Languages",
              )));
            var l = document.createElement("div");
            ((l.className = "bh-toggle-switch ".concat(
              !1 !== e.showBilingual ? "active" : "",
            )),
              (l.onclick = function (n) {
                (n.stopPropagation(),
                  (e.showBilingual = !e.showBilingual),
                  l.classList.toggle("active"),
                  t("showBilingual", e.showBilingual),
                  (c.style.display = e.showBilingual ? "block" : "none"));
              }),
              i.appendChild(s),
              i.appendChild(l));
            var c = document.createElement("div");
            c.style.cssText = "\n      display: ".concat(
              e.showBilingual ? "block" : "none",
              ";\n      margin-top: 4px;\n    ",
            );
            var u = document.createElement("div");
            ((u.style.cssText =
              "\n      font-size: 13px;\n      color: ".concat(
                n.textPrimary,
                ";\n      margin-bottom: 8px;\n    ",
              )),
              (u.textContent = r(
                "settingsPanel.captionOrder",
                "Caption Order",
              )));
            var d = document.createElement("div");
            d.style.cssText =
              "\n      display: flex;\n      background: rgba(255,255,255,0.08);\n      border-radius: 6px;\n      padding: 3px;\n      gap: 3px;\n    ";
            var p = document.createElement("button"),
              g = document.createElement("button"),
              h = function () {
                var t = e.swapLanguageOrder;
                ((p.style.background = t ? "transparent" : n.accentColor),
                  (p.style.color = t ? n.textSecondary : "#fff"),
                  (g.style.background = t ? n.accentColor : "transparent"),
                  (g.style.color = t ? "#fff" : n.textSecondary));
              },
              f = document.createElement("div");
            ((f.className = "bh-language-order-tooltip"),
              (f.style.cssText =
                "\n      position: fixed;\n      padding: 8px 10px;\n      background: rgba(0,0,0,0.9);\n      border-radius: 6px;\n      border-left: 2px solid ".concat(
                  n.accentColor,
                  ";\n      opacity: 0;\n      pointer-events: none;\n      transition: opacity 0.15s ease;\n      z-index: 2147483647;\n      backdrop-filter: blur(10px);\n    ",
                )));
            var m = document.createElement("div");
            m.style.cssText = "\n      font-size: 11px;\n      color: ".concat(
              n.textPrimary,
              ";\n      margin-bottom: 3px;\n    ",
            );
            var v = document.createElement("div");
            ((v.style.cssText =
              "\n      font-size: 11px;\n      color: ".concat(
                n.textSecondary,
                ";\n    ",
              )),
              f.appendChild(m),
              f.appendChild(v),
              document.body.appendChild(f));
            var y = function (e, t) {
                var n = e.getBoundingClientRect();
                ((f.style.left = "".concat(n.right + 12, "px")),
                  (f.style.top = "".concat(n.top + n.height / 2 - 20, "px")),
                  t
                    ? ((m.textContent = r(
                        "settingsPanel.tooltipTranslation",
                        "① Translation",
                      )),
                      (v.textContent = r(
                        "settingsPanel.tooltipOriginal",
                        "② Original",
                      )))
                    : ((m.textContent = r(
                        "settingsPanel.tooltipOriginal",
                        "① Original",
                      )),
                      (v.textContent = r(
                        "settingsPanel.tooltipTranslation",
                        "② Translation",
                      ))),
                  (f.style.opacity = "1"));
              },
              b = function () {
                f.style.opacity = "0";
              },
              x = function (r, o, a) {
                var i = e.swapLanguageOrder === a;
                ((r.style.cssText =
                  "\n        flex: 1;\n        padding: 6px 10px;\n        border-radius: 4px;\n        border: none;\n        cursor: pointer;\n        font-size: 12px;\n        font-weight: 500;\n        transition: all 0.15s ease;\n        background: "
                    .concat(
                      i ? n.accentColor : "transparent",
                      ";\n        color: ",
                    )
                    .concat(i ? "#fff" : n.textSecondary, ";\n      ")),
                  (r.textContent = o),
                  (r.onmouseenter = function () {
                    (e.swapLanguageOrder === a ||
                      (r.style.background = "rgba(255,255,255,0.1)"),
                      y(r, a));
                  }),
                  (r.onmouseleave = function () {
                    (h(), b());
                  }),
                  (r.onclick = function (n) {
                    (n.stopPropagation(),
                      e.swapLanguageOrder !== a &&
                        ((e.swapLanguageOrder = a),
                        t("swapLanguageOrder", a),
                        h()));
                  }));
              };
            return (
              x(p, r("settingsPanel.originalFirst", "Original first"), !1),
              x(
                g,
                r("settingsPanel.translationFirst", "Translation first"),
                !0,
              ),
              d.appendChild(p),
              d.appendChild(g),
              c.appendChild(u),
              c.appendChild(d),
              o.appendChild(a),
              o.appendChild(i),
              o.appendChild(c),
              o
            );
          })(d),
        ));
      var h = document.createElement("div");
      return (
        (h.style.cssText = "\n      height: 1px;\n      background: ".concat(
          d.dockBorder,
          ";\n      margin: 16px 0;\n    ",
        )),
        a.appendChild(h),
        a.appendChild(
          (function (n) {
            var o = document.createElement("div");
            o.style.cssText =
              "\n      background: rgba(255,255,255,0.03);\n      border-radius: 8px;\n      padding: 12px;\n    ";
            var a = document.createElement("div");
            ((a.style.cssText =
              "\n      font-size: 14px;\n      font-weight: 500;\n      color: ".concat(
                n.textPrimary,
                ";\n      margin-bottom: 12px;\n    ",
              )),
              (a.textContent = r(
                "settingsPanel.resetSettings",
                "Reset Settings",
              )));
            var i = document.createElement("div");
            ((i.style.cssText =
              "\n      font-size: 12px;\n      color: ".concat(
                n.textSecondary,
                ";\n      margin-bottom: 12px;\n      line-height: 1.4;\n    ",
              )),
              (i.textContent = r(
                "settingsPanel.resetDesc",
                "Restore all settings to their default values",
              )));
            var s = document.createElement("button");
            return (
              (s.style.cssText =
                "\n      width: 100%;\n      padding: 10px 12px;\n      border-radius: 6px;\n      cursor: pointer;\n      font-size: 13px;\n      font-weight: 500;\n      transition: all 0.2s;\n      background: rgba(239, 68, 68, 0.15);\n      border: 1px solid rgba(239, 68, 68, 0.3);\n      color: #ef4444;\n    "),
              (s.textContent = r(
                "settingsPanel.resetButton",
                "🔄 Reset to Defaults",
              )),
              (s.onmouseenter = function () {
                ((s.style.background = "rgba(239, 68, 68, 0.25)"),
                  (s.style.borderColor = "rgba(239, 68, 68, 0.4)"));
              }),
              (s.onmouseleave = function () {
                ((s.style.background = "rgba(239, 68, 68, 0.15)"),
                  (s.style.borderColor = "rgba(239, 68, 68, 0.3)"));
              }),
              (s.onclick = (function () {
                var n,
                  o =
                    ((n = lo().mark(function n(o) {
                      var a, i, c, u, d, p;
                      return lo().wrap(function (n) {
                        for (;;)
                          switch ((n.prev = n.next)) {
                            case 0:
                              (o.stopPropagation(),
                                (a = {
                                  overlayFontSize: 18,
                                  stripFontSize: 30,
                                  backgroundOpacity: 0.95,
                                  showBilingual: !0,
                                  swapLanguageOrder: !1,
                                }),
                                (i = 0),
                                (c = Object.entries(a)));
                            case 3:
                              if (!(i < c.length)) {
                                n.next = 11;
                                break;
                              }
                              return (
                                (u = co(c[i], 2)),
                                (d = u[0]),
                                (p = u[1]),
                                (e[d] = p),
                                (n.next = 8),
                                t(d, p)
                              );
                            case 8:
                              (i++, (n.next = 3));
                              break;
                            case 11:
                              ((s.textContent = r(
                                "settingsPanel.resetComplete",
                                "✓ Reset Complete",
                              )),
                                (s.style.background =
                                  "rgba(34, 197, 94, 0.15)"),
                                (s.style.borderColor =
                                  "rgba(34, 197, 94, 0.3)"),
                                (s.style.color = "#22c55e"),
                                setTimeout(function () {
                                  l();
                                }, 800));
                            case 16:
                            case "end":
                              return n.stop();
                          }
                      }, n);
                    })),
                    function () {
                      var e = this,
                        t = arguments;
                      return new Promise(function (r, o) {
                        var a = n.apply(e, t);
                        function i(e) {
                          po(a, r, o, i, s, "next", e);
                        }
                        function s(e) {
                          po(a, r, o, i, s, "throw", e);
                        }
                        i(void 0);
                      });
                    });
                return function (e) {
                  return o.apply(this, arguments);
                };
              })()),
              o.appendChild(a),
              o.appendChild(i),
              o.appendChild(s),
              o
            );
          })(d),
        ),
        (a.onclick = function (e) {
          return e.stopPropagation();
        }),
        a
      );
    }
    function s(e, t, n, r, o, a) {
      var i =
          arguments.length > 6 && void 0 !== arguments[6] ? arguments[6] : "",
        s = document.createElement("div");
      s.style.cssText = "\n      margin-bottom: 14px;\n    ";
      var l = document.createElement("div");
      l.style.cssText =
        "\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      margin-bottom: 8px;\n    ";
      var c = document.createElement("span");
      ((c.style.cssText = "\n      font-size: 13px;\n      color: ".concat(
        e.textPrimary,
        ";\n    ",
      )),
        (c.textContent = t));
      var u = document.createElement("span");
      ((u.style.cssText = "\n      font-size: 13px;\n      color: ".concat(
        e.textSecondary,
        ";\n      min-width: 40px;\n      text-align: right;\n    ",
      )),
        (u.textContent = "".concat(n).concat(i)),
        l.appendChild(c),
        l.appendChild(u),
        s.appendChild(l));
      var d = document.createElement("input");
      ((d.type = "range"),
        (d.min = r),
        (d.max = o),
        (d.value = n),
        (d.className = "bh-dock-slider"));
      var p = ((n - r) / (o - r)) * 100;
      return (
        (d.style.cssText +=
          "\n      width: 100%;\n      background: linear-gradient(to right,\n        "
            .concat(e.accentColor, " 0%,\n        ")
            .concat(e.accentColor, " ")
            .concat(p, "%,\n        rgba(255,255,255,0.15) ")
            .concat(
              p,
              "%,\n        rgba(255,255,255,0.15) 100%\n      );\n    ",
            )),
        (d.oninput = function (t) {
          var n = parseInt(t.target.value);
          u.textContent = "".concat(n).concat(i);
          var s = ((n - r) / (o - r)) * 100;
          ((d.style.background = "linear-gradient(to right,\n        "
            .concat(e.accentColor, " 0%,\n        ")
            .concat(e.accentColor, " ")
            .concat(s, "%,\n        rgba(255,255,255,0.15) ")
            .concat(s, "%,\n        rgba(255,255,255,0.15) 100%\n      )")),
            a(n));
        }),
        s.appendChild(d),
        s
      );
    }
    function l() {
      var e = o,
        t = a ? a.parentNode : null;
      (a && a.parentNode && a.parentNode.removeChild(a),
        (a = null),
        (o = !1),
        e &&
          t &&
          ((a = i()), t.appendChild(a), (a.style.display = "block"), (o = !0)));
    }
    return {
      getElement: function () {
        return (a || (a = i()), a);
      },
      show: function () {
        (a || (a = i()), (a.style.display = "block"), (o = !0));
      },
      hide: function () {
        (a && (a.style.display = "none"), (o = !1));
      },
      toggle: function () {
        return (o ? this.hide() : this.show(), o);
      },
      isVisible: function () {
        return o;
      },
      updateTheme: function (e) {
        l();
      },
    };
  }
  function ho(e) {
    return (
      (ho =
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
      ho(e)
    );
  }
  function fo() {
    fo = function () {
      return t;
    };
    var e,
      t = {},
      n = Object.prototype,
      r = n.hasOwnProperty,
      o =
        Object.defineProperty ||
        function (e, t, n) {
          e[t] = n.value;
        },
      a = "function" == typeof Symbol ? Symbol : {},
      i = a.iterator || "@@iterator",
      s = a.asyncIterator || "@@asyncIterator",
      l = a.toStringTag || "@@toStringTag";
    function c(e, t, n) {
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
      c({}, "");
    } catch (e) {
      c = function (e, t, n) {
        return (e[t] = n);
      };
    }
    function u(e, t, n, r) {
      var a = t && t.prototype instanceof v ? t : v,
        i = Object.create(a.prototype),
        s = new M(r || []);
      return (o(i, "_invoke", { value: C(e, n, s) }), i);
    }
    function d(e, t, n) {
      try {
        return { type: "normal", arg: e.call(t, n) };
      } catch (e) {
        return { type: "throw", arg: e };
      }
    }
    t.wrap = u;
    var p = "suspendedStart",
      g = "suspendedYield",
      h = "executing",
      f = "completed",
      m = {};
    function v() {}
    function y() {}
    function b() {}
    var x = {};
    c(x, i, function () {
      return this;
    });
    var w = Object.getPrototypeOf,
      S = w && w(w(L([])));
    S && S !== n && r.call(S, i) && (x = S);
    var k = (b.prototype = v.prototype = Object.create(x));
    function T(e) {
      ["next", "throw", "return"].forEach(function (t) {
        c(e, t, function (e) {
          return this._invoke(t, e);
        });
      });
    }
    function _(e, t) {
      function n(o, a, i, s) {
        var l = d(e[o], e, a);
        if ("throw" !== l.type) {
          var c = l.arg,
            u = c.value;
          return u && "object" == ho(u) && r.call(u, "__await")
            ? t.resolve(u.__await).then(
                function (e) {
                  n("next", e, i, s);
                },
                function (e) {
                  n("throw", e, i, s);
                },
              )
            : t.resolve(u).then(
                function (e) {
                  ((c.value = e), i(c));
                },
                function (e) {
                  return n("throw", e, i, s);
                },
              );
        }
        s(l.arg);
      }
      var a;
      o(this, "_invoke", {
        value: function (e, r) {
          function o() {
            return new t(function (t, o) {
              n(e, r, t, o);
            });
          }
          return (a = a ? a.then(o, o) : o());
        },
      });
    }
    function C(t, n, r) {
      var o = p;
      return function (a, i) {
        if (o === h) throw new Error("Generator is already running");
        if (o === f) {
          if ("throw" === a) throw i;
          return { value: e, done: !0 };
        }
        for (r.method = a, r.arg = i; ; ) {
          var s = r.delegate;
          if (s) {
            var l = E(s, r);
            if (l) {
              if (l === m) continue;
              return l;
            }
          }
          if ("next" === r.method) r.sent = r._sent = r.arg;
          else if ("throw" === r.method) {
            if (o === p) throw ((o = f), r.arg);
            r.dispatchException(r.arg);
          } else "return" === r.method && r.abrupt("return", r.arg);
          o = h;
          var c = d(t, n, r);
          if ("normal" === c.type) {
            if (((o = r.done ? f : g), c.arg === m)) continue;
            return { value: c.arg, done: r.done };
          }
          "throw" === c.type &&
            ((o = f), (r.method = "throw"), (r.arg = c.arg));
        }
      };
    }
    function E(t, n) {
      var r = n.method,
        o = t.iterator[r];
      if (o === e)
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
          m
        );
      var a = d(o, t.iterator, n.arg);
      if ("throw" === a.type)
        return ((n.method = "throw"), (n.arg = a.arg), (n.delegate = null), m);
      var i = a.arg;
      return i
        ? i.done
          ? ((n[t.resultName] = i.value),
            (n.next = t.nextLoc),
            "return" !== n.method && ((n.method = "next"), (n.arg = e)),
            (n.delegate = null),
            m)
          : i
        : ((n.method = "throw"),
          (n.arg = new TypeError("iterator result is not an object")),
          (n.delegate = null),
          m);
    }
    function P(e) {
      var t = { tryLoc: e[0] };
      (1 in e && (t.catchLoc = e[1]),
        2 in e && ((t.finallyLoc = e[2]), (t.afterLoc = e[3])),
        this.tryEntries.push(t));
    }
    function O(e) {
      var t = e.completion || {};
      ((t.type = "normal"), delete t.arg, (e.completion = t));
    }
    function M(e) {
      ((this.tryEntries = [{ tryLoc: "root" }]),
        e.forEach(P, this),
        this.reset(!0));
    }
    function L(t) {
      if (t || "" === t) {
        var n = t[i];
        if (n) return n.call(t);
        if ("function" == typeof t.next) return t;
        if (!isNaN(t.length)) {
          var o = -1,
            a = function n() {
              for (; ++o < t.length; )
                if (r.call(t, o)) return ((n.value = t[o]), (n.done = !1), n);
              return ((n.value = e), (n.done = !0), n);
            };
          return (a.next = a);
        }
      }
      throw new TypeError(ho(t) + " is not iterable");
    }
    return (
      (y.prototype = b),
      o(k, "constructor", { value: b, configurable: !0 }),
      o(b, "constructor", { value: y, configurable: !0 }),
      (y.displayName = c(b, l, "GeneratorFunction")),
      (t.isGeneratorFunction = function (e) {
        var t = "function" == typeof e && e.constructor;
        return (
          !!t && (t === y || "GeneratorFunction" === (t.displayName || t.name))
        );
      }),
      (t.mark = function (e) {
        return (
          Object.setPrototypeOf
            ? Object.setPrototypeOf(e, b)
            : ((e.__proto__ = b), c(e, l, "GeneratorFunction")),
          (e.prototype = Object.create(k)),
          e
        );
      }),
      (t.awrap = function (e) {
        return { __await: e };
      }),
      T(_.prototype),
      c(_.prototype, s, function () {
        return this;
      }),
      (t.AsyncIterator = _),
      (t.async = function (e, n, r, o, a) {
        void 0 === a && (a = Promise);
        var i = new _(u(e, n, r, o), a);
        return t.isGeneratorFunction(n)
          ? i
          : i.next().then(function (e) {
              return e.done ? e.value : i.next();
            });
      }),
      T(k),
      c(k, l, "Generator"),
      c(k, i, function () {
        return this;
      }),
      c(k, "toString", function () {
        return "[object Generator]";
      }),
      (t.keys = function (e) {
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
      (t.values = L),
      (M.prototype = {
        constructor: M,
        reset: function (t) {
          if (
            ((this.prev = 0),
            (this.next = 0),
            (this.sent = this._sent = e),
            (this.done = !1),
            (this.delegate = null),
            (this.method = "next"),
            (this.arg = e),
            this.tryEntries.forEach(O),
            !t)
          )
            for (var n in this)
              "t" === n.charAt(0) &&
                r.call(this, n) &&
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
          function o(r, o) {
            return (
              (s.type = "throw"),
              (s.arg = t),
              (n.next = r),
              o && ((n.method = "next"), (n.arg = e)),
              !!o
            );
          }
          for (var a = this.tryEntries.length - 1; a >= 0; --a) {
            var i = this.tryEntries[a],
              s = i.completion;
            if ("root" === i.tryLoc) return o("end");
            if (i.tryLoc <= this.prev) {
              var l = r.call(i, "catchLoc"),
                c = r.call(i, "finallyLoc");
              if (l && c) {
                if (this.prev < i.catchLoc) return o(i.catchLoc, !0);
                if (this.prev < i.finallyLoc) return o(i.finallyLoc);
              } else if (l) {
                if (this.prev < i.catchLoc) return o(i.catchLoc, !0);
              } else {
                if (!c)
                  throw new Error("try statement without catch or finally");
                if (this.prev < i.finallyLoc) return o(i.finallyLoc);
              }
            }
          }
        },
        abrupt: function (e, t) {
          for (var n = this.tryEntries.length - 1; n >= 0; --n) {
            var o = this.tryEntries[n];
            if (
              o.tryLoc <= this.prev &&
              r.call(o, "finallyLoc") &&
              this.prev < o.finallyLoc
            ) {
              var a = o;
              break;
            }
          }
          a &&
            ("break" === e || "continue" === e) &&
            a.tryLoc <= t &&
            t <= a.finallyLoc &&
            (a = null);
          var i = a ? a.completion : {};
          return (
            (i.type = e),
            (i.arg = t),
            a
              ? ((this.method = "next"), (this.next = a.finallyLoc), m)
              : this.complete(i)
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
            m
          );
        },
        finish: function (e) {
          for (var t = this.tryEntries.length - 1; t >= 0; --t) {
            var n = this.tryEntries[t];
            if (n.finallyLoc === e)
              return (this.complete(n.completion, n.afterLoc), O(n), m);
          }
        },
        catch: function (e) {
          for (var t = this.tryEntries.length - 1; t >= 0; --t) {
            var n = this.tryEntries[t];
            if (n.tryLoc === e) {
              var r = n.completion;
              if ("throw" === r.type) {
                var o = r.arg;
                O(n);
              }
              return o;
            }
          }
          throw new Error("illegal catch attempt");
        },
        delegateYield: function (t, n, r) {
          return (
            (this.delegate = { iterator: L(t), resultName: n, nextLoc: r }),
            "next" === this.method && (this.arg = e),
            m
          );
        },
      }),
      t
    );
  }
  function mo(e, t, n, r, o, a, i) {
    try {
      var s = e[a](i),
        l = s.value;
    } catch (e) {
      return void n(e);
    }
    s.done ? t(l) : Promise.resolve(l).then(r, o);
  }
  function vo(e) {
    return function () {
      var t = this,
        n = arguments;
      return new Promise(function (r, o) {
        var a = e.apply(t, n);
        function i(e) {
          mo(a, r, o, i, s, "next", e);
        }
        function s(e) {
          mo(a, r, o, i, s, "throw", e);
        }
        i(void 0);
      });
    };
  }
  function yo() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
      t = e.settings,
      n = void 0 === t ? {} : t,
      r = e.theme,
      o = void 0 === r ? "dark" : r,
      a = e.onStart,
      i = void 0 === a ? function () {} : a,
      s = e.onStop,
      l = void 0 === s ? function () {} : s,
      c = e.onClose,
      u = void 0 === c ? function () {} : c,
      d = e.onCollapse,
      p = void 0 === d ? function () {} : d,
      g = (e.onOpenSettings, e.onAudioMixerOpen),
      h =
        void 0 === g
          ? vo(
              fo().mark(function e() {
                return fo().wrap(function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                      case "end":
                        return e.stop();
                    }
                }, e);
              }),
            )
          : g,
      f = e.onSettingsChange,
      m = void 0 === f ? function () {} : f,
      v = e.onModeChange,
      y = void 0 === v ? function () {} : v,
      b = e.overlayT,
      x =
        void 0 === b
          ? function (e, t) {
              return t;
            }
          : b;
    Vr();
    var w = Ar[o],
      S = null,
      k = !1,
      T = !1,
      _ = 0,
      C = null,
      E = null,
      P = null,
      O = null,
      M = null,
      L = n.subtitleMode || "overlay",
      z = !1,
      N = null,
      A = null;
    function D() {
      if (S) {
        var e = S.getBoundingClientRect(),
          t = window.innerWidth,
          n = window.innerHeight,
          r = 16;
        if (z) {
          var o = parseFloat(S.style.left) || e.left,
            a = parseFloat(S.style.top) || e.top,
            i = !1;
          (e.right > t && ((o = t - e.width - r), (i = !0)),
            o < r && ((o = r), (i = !0)),
            e.bottom > n && ((a = n - e.height - r), (i = !0)),
            a < r && ((a = r), (i = !0)),
            i &&
              ((S.style.left = "".concat(o, "px")),
              (S.style.top = "".concat(a, "px"))));
        } else {
          if ((e.top < 0 && (S.style.top = "".concat(r, "px")), e.bottom > n)) {
            var s = n - e.height - r;
            S.style.top = "".concat(Math.max(r, s), "px");
          }
          if (e.left < 0 || e.right > t) {
            var l = Math.max(r, Math.min(t - e.width - r, (t - e.width) / 2));
            ((S.style.left = "".concat(l, "px")), (S.style.transform = "none"));
          }
        }
      }
    }
    var V = null,
      B = null,
      j = null,
      I = null,
      R = null;
    function F() {
      var e;
      return (
        ((S = document.createElement("div")).className = "bh-dock"),
        (S.id = "bh-caption-dock"),
        (S.style.cssText =
          "\n      position: fixed;\n      top: 16px;\n      left: 50%;\n      transform: translateX(-50%);\n      display: flex;\n      align-items: center;\n      gap: 6px;\n      padding: 6px 12px;\n      background: "
            .concat(w.dockBg, ";\n      border: 1px solid ")
            .concat(
              w.dockBorder,
              ';\n      border-radius: 24px;\n      box-shadow: 0 4px 24px rgba(0,0,0,0.3);\n      backdrop-filter: blur(20px);\n      z-index: 2147483646;\n      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n      user-select: none;\n      animation: bh-fade-in 0.2s ease;\n    ',
            )),
        (S.onmousedown = function (e) {
          (e.target === S ||
            e.target.classList.contains("bh-dock-drag-handle")) &&
            e.preventDefault();
        }),
        S.appendChild(
          (function () {
            var e = document.createElement("div");
            ((e.className = "bh-dock-drag-handle"),
              (e.innerHTML = Dr.dragHandle),
              (e.style.cssText = "\n      color: ".concat(
                w.textSecondary,
                ";\n      cursor: grab;\n      padding: 4px;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      opacity: 0.6;\n      transition: opacity 0.15s ease;\n    ",
              )),
              (e.onmouseenter = function () {
                e.style.opacity = "1";
              }),
              (e.onmouseleave = function () {
                e.style.opacity = "0.6";
              }));
            var t = !1,
              n = { x: 0, y: 0 };
            e.onmousedown = function (r) {
              ((t = !0), (e.style.cursor = "grabbing"));
              var o = S.getBoundingClientRect();
              ((n = { x: r.clientX - o.left, y: r.clientY - o.top }),
                r.preventDefault());
            };
            var r = function (e) {
                if (t) {
                  z = !0;
                  var r = e.clientX - n.x,
                    o = e.clientY - n.y;
                  ((S.style.left = "".concat(r, "px")),
                    (S.style.top = "".concat(o, "px")),
                    (S.style.transform = "none"));
                }
              },
              o = function () {
                t && ((t = !1), (e.style.cursor = "grab"));
              };
            return (
              (N = D),
              window.addEventListener("resize", N),
              document.addEventListener("mousemove", r),
              document.addEventListener("mouseup", o),
              e
            );
          })(),
        ),
        S.appendChild(
          (function () {
            var e = document.createElement("div");
            ((e.style.cssText =
              "\n      display: flex;\n      align-items: center;\n      gap: 8px;\n      padding: 6px 12px;\n      background: rgba(255,255,255,0.05);\n      border-radius: 16px;\n    "),
              ((V = document.createElement("div")).style.cssText =
                "\n      width: 8px;\n      height: 8px;\n      border-radius: 50%;\n      background: rgba(100,100,100,0.5);\n      transition: all 0.3s ease;\n    "),
              ((B = document.createElement("span")).style.cssText =
                "\n      font-size: 12px;\n      font-weight: 500;\n      color: ".concat(
                  w.textSecondary,
                  ";\n    ",
                )),
              (B.textContent = x("dock.ready", "Ready")));
            var t = document.createElement("span");
            return (
              (t.style.cssText =
                "\n      color: rgba(255,255,255,0.2);\n      font-size: 12px;\n    "),
              (t.textContent = "|"),
              ((j = document.createElement("span")).style.cssText =
                "\n      font-size: 12px;\n      font-weight: 500;\n      color: ".concat(
                  w.textSecondary,
                  ";\n      font-variant-numeric: tabular-nums;\n      cursor: default;\n    ",
                )),
              (j.textContent = "00:00"),
              (j.title = x("dock.sessionTime", "Session time")),
              e.appendChild(V),
              e.appendChild(B),
              e.appendChild(t),
              e.appendChild(j),
              e
            );
          })(),
        ),
        S.appendChild(U()),
        S.appendChild(
          (((I = document.createElement("button")).className = "bh-play-btn"),
          (I.style.cssText =
            "\n      height: 36px;\n      padding: 0 16px;\n      border-radius: 18px;\n      background: ".concat(
              w.accentColor,
              ";\n      border: none;\n      cursor: pointer;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      color: white;\n      transition: all 0.15s ease;\n      font-size: 14px;\n      font-weight: 500;\n      min-width: 70px;\n    ",
            )),
          (I.textContent = x("common.start", "Start")),
          (I.title = x("common.start", "Start")),
          (I.onmouseenter = function () {
            ((I.style.background = w.accentColorHover),
              (I.style.transform = "scale(1.05)"));
          }),
          (I.onmouseleave = function () {
            ((I.style.background = w.accentColor),
              (I.style.transform = "scale(1)"));
          }),
          (I.onclick = (function () {
            var e = vo(
              fo().mark(function e(t) {
                return fo().wrap(function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        if ((t.stopPropagation(), !T)) {
                          e.next = 3;
                          break;
                        }
                        return e.abrupt("return");
                      case 3:
                        if (!k) {
                          e.next = 8;
                          break;
                        }
                        return ((e.next = 6), X());
                      case 6:
                        e.next = 10;
                        break;
                      case 8:
                        return ((e.next = 10), Y());
                      case 10:
                      case "end":
                        return e.stop();
                    }
                }, e);
              }),
            );
            return function (t) {
              return e.apply(this, arguments);
            };
          })()),
          I),
        ),
        S.appendChild(
          (function () {
            var e = document.createElement("div");
            e.style.cssText =
              "\n      display: flex;\n      align-items: center;\n      gap: 6px;\n      padding: 6px 12px;\n      background: "
                .concat(
                  n.ttsEnabled
                    ? "rgba(99,102,241,0.2)"
                    : "rgba(255,255,255,0.05)",
                  ";\n      border: 1px solid ",
                )
                .concat(
                  n.ttsEnabled ? "rgba(99,102,241,0.4)" : "transparent",
                  ";\n      border-radius: 16px;\n      cursor: pointer;\n      transition: all 0.15s ease;\n    ",
                );
            var t =
                '\n      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n         <path d="M16 12c.5-1.5.5-3.5 0-5" />\n         <path d="M19 14.5c1.5-2.5 1.5-6.5 0-10" />\n         <circle cx="8" cy="9" r="4" />\n         <path d="M4 19c0-3.5 2.5-6 6-6h0c3.5 0 6 2.5 6 6" />\n      </svg>\n    ',
              r =
                '\n      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n         <circle cx="8" cy="9" r="4" />\n         <path d="M4 19c0-3.5 2.5-6 6-6h0c3.5 0 6 2.5 6 6" />\n         <path d="M17 7l5 5" />\n         <path d="M22 7l-5 5" />\n      </svg>\n    ',
              o = document.createElement("span");
            function a() {
              ((e.style.background = n.ttsEnabled
                ? "rgba(99,102,241,0.2)"
                : "rgba(255,255,255,0.05)"),
                (e.style.borderColor = n.ttsEnabled
                  ? "rgba(99,102,241,0.4)"
                  : "transparent"),
                (o.innerHTML = n.ttsEnabled ? t : r),
                (o.style.color = n.ttsEnabled
                  ? w.accentColor
                  : "rgba(255,255,255,0.4)"),
                (e.title = n.ttsEnabled
                  ? x("dock.voiceOn", "Translated Voice On")
                  : x("dock.voiceOff", "Translated Voice Off")),
                W());
            }
            return (
              (o.innerHTML = n.ttsEnabled ? t : r),
              (o.style.cssText =
                "\n      display: flex;\n      align-items: center;\n      color: ".concat(
                  n.ttsEnabled ? w.accentColor : "rgba(255,255,255,0.4)",
                  ";\n      transition: color 0.15s ease;\n    ",
                )),
              (e.title = n.ttsEnabled
                ? x("dock.voiceOn", "Translated Voice On")
                : x("dock.voiceOff", "Translated Voice Off")),
              e.appendChild(o),
              e,
              (e.onclick = function (e) {
                (e.stopPropagation(),
                  (n.ttsEnabled = !n.ttsEnabled),
                  a(),
                  m("ttsEnabled", n.ttsEnabled));
              }),
              (e.onmouseenter = function () {
                n.ttsEnabled ||
                  ((e.style.background = "rgba(255,255,255,0.08)"),
                  (o.style.color = "rgba(255,255,255,0.6)"));
              }),
              (e.onmouseleave = function () {
                ((e.style.background = n.ttsEnabled
                  ? "rgba(99,102,241,0.2)"
                  : "rgba(255,255,255,0.05)"),
                  n.ttsEnabled || (o.style.color = "rgba(255,255,255,0.4)"));
              }),
              (A = a),
              e
            );
          })(),
        ),
        S.appendChild(
          (function () {
            (R = document.createElement("button")).style.cssText =
              "\n      display: flex;\n      align-items: center;\n      gap: 6px;\n      padding: 6px 12px;\n      background: rgba(255,255,255,0.05);\n      border: 1px solid transparent;\n      border-radius: 16px;\n      cursor: "
                .concat(
                  n.ttsEnabled ? "pointer" : "default",
                  ";\n      font-size: 12px;\n      font-weight: 500;\n      color: ",
                )
                .concat(
                  w.textPrimary,
                  ";\n      transition: all 0.15s ease;\n      opacity: ",
                )
                .concat(n.ttsEnabled ? "1" : "0.4", ";\n    ");
            var e = document.createElement("span");
            e.className = "bh-voice-name";
            var t = n.ttsVoiceDisplayName;
            if (!t && n.ttsVoice) {
              var r = (function (e) {
                return Rr.find(function (t) {
                  return t.voiceName === e;
                });
              })(n.ttsVoice);
              r && ((t = r.name), (n.ttsVoiceDisplayName = t));
            }
            e.textContent = t || n.ttsVoice || "Ava";
            var a = document.createElement("span");
            ((a.innerHTML = Dr.chevronDown),
              (a.style.cssText =
                "\n      display: flex;\n      align-items: center;\n      color: ".concat(
                  w.textSecondary,
                  ";\n    ",
                )));
            var i = document.createElement("span");
            ((i.innerHTML = Dr.waveform),
              (i.style.cssText =
                "\n      display: flex;\n      align-items: center;\n      color: ".concat(
                  w.textSecondary,
                  ";\n    ",
                )));
            var s = document.createElement("span");
            return (
              (s.style.cssText =
                "\n      font-size: 12px;\n      color: ".concat(
                  w.textSecondary,
                  ";\n    ",
                )),
              (s.textContent = x("dock.voice", "Voice") + ":"),
              R.appendChild(i),
              R.appendChild(s),
              R.appendChild(e),
              R.appendChild(a),
              (R.onmouseenter = function () {
                R.style.background = "rgba(255,255,255,0.1)";
              }),
              (R.onmouseleave = function () {
                R.style.background = "rgba(255,255,255,0.05)";
              }),
              (R.title = x("dock.selectVoice", "Select Voice")),
              (R.onclick = function (e) {
                (e.stopPropagation(),
                  (function () {
                    P ||
                      (P = io({
                        selectedVoice: n.ttsVoice || "Ava",
                        selectedVoiceDisplayName: n.ttsVoiceDisplayName || null,
                        selectedLanguage: n.ttsLanguage || "en",
                        autoMode: n.ttsAutoMode || !1,
                        theme: o,
                        buttonElement: R,
                        overlayT: x,
                        onVoiceSelect: function (e, t) {
                          n.ttsEnabled ||
                            ((n.ttsEnabled = !0),
                            A && A(),
                            W(),
                            m("ttsEnabled", !0));
                          var r =
                            t && "string" == typeof t.id && t.id.trim()
                              ? t.id.trim()
                              : "";
                          ((n.ttsVoice = e),
                            (n.ttsVoiceId = r || ""),
                            (n.ttsLanguage = t.language),
                            (n.ttsVoiceDisplayName = t.name),
                            (n.ttsResponseFormat = t.responseFormat || "pcm"));
                          var o = R.querySelector(".bh-voice-name");
                          (o && (o.textContent = t.name),
                            m("ttsVoice", e),
                            m("ttsVoiceDisplayName", t.name),
                            m("ttsLanguage", t.language),
                            m("ttsVoiceId", r),
                            m("ttsResponseFormat", t.responseFormat || "pcm"));
                        },
                        onLanguageChange: function (e) {
                          ((n.ttsLanguage = e), m("ttsLanguage", e));
                        },
                        onAutoToggle: function (e) {
                          ((n.ttsAutoMode = e), m("ttsAutoMode", e));
                        },
                        onClose: function () {
                          P = null;
                        },
                      }));
                    P.show();
                  })());
              }),
              R
            );
          })(),
        ),
        S.appendChild(U()),
        S.appendChild(
          (function () {
            var e = document.createElement("div");
            e.style.cssText = "\n      position: relative;\n    ";
            var t = Br(Dr.volumeHigh, x("dock.audioMixer", "Audio Mixer"), o);
            return (
              (t.className = "bh-audio-btn"),
              (t.title = x("dock.audioMixer", "Audio Mixer")),
              (t.onclick = (function () {
                var t = vo(
                  fo().mark(function t(r) {
                    return fo().wrap(
                      function (t) {
                        for (;;)
                          switch ((t.prev = t.next)) {
                            case 0:
                              return (
                                r.stopPropagation(),
                                M && (M.remove(), (M = null)),
                                O && O.hide(),
                                (t.prev = 3),
                                (t.next = 6),
                                h()
                              );
                            case 6:
                              t.next = 11;
                              break;
                            case 8:
                              ((t.prev = 8), (t.t0 = t.catch(3)));
                            case 11:
                              (E ||
                                ((E = jr(n, m, o, x)),
                                e.appendChild(E.getElement())),
                                E.syncSettings && E.syncSettings(),
                                E.toggle());
                            case 14:
                            case "end":
                              return t.stop();
                          }
                      },
                      t,
                      null,
                      [[3, 8]],
                    );
                  }),
                );
                return function (e) {
                  return t.apply(this, arguments);
                };
              })()),
              e.appendChild(t),
              e
            );
          })(),
        ),
        S.appendChild(
          (function () {
            var e = document.createElement("div");
            e.style.cssText = "\n      position: relative;\n    ";
            var t = [
                {
                  id: "overlay",
                  label: x("dock.captionPanel", "Caption Panel"),
                  icon: Dr.captionPanel,
                },
                {
                  id: "strip",
                  label: x("dock.cinemaMode", "Cinema Mode"),
                  icon: Dr.cinemaMode,
                },
                {
                  id: "audioOnly",
                  label: x("dock.audioOnly", "Audio Only"),
                  icon: Dr.volumeHigh,
                  action: "collapse",
                },
              ],
              r = function () {
                return (
                  t.find(function (e) {
                    return e.id === L;
                  }) || t[0]
                );
              },
              o = document.createElement("button");
            ((o.className = "bh-subtitle-mode-btn"),
              (o.style.cssText =
                "\n      display: flex;\n      align-items: center;\n      gap: 6px;\n      padding: 6px 12px;\n      background: rgba(255,255,255,0.05);\n      border: 1px solid transparent;\n      border-radius: 16px;\n      cursor: pointer;\n      font-size: 12px;\n      font-weight: 500;\n      color: ".concat(
                  w.textPrimary,
                  ";\n      transition: all 0.15s ease;\n    ",
                )),
              (o.title = x("dock.subtitleMode", "Subtitle Mode")));
            var a = document.createElement("span");
            a.style.cssText =
              "\n      display: flex;\n      align-items: center;\n      color: ".concat(
                w.textSecondary,
                ";\n    ",
              );
            var i = document.createElement("span"),
              s = document.createElement("span");
            ((s.innerHTML = Dr.chevronDown),
              (s.style.cssText =
                "\n      display: flex;\n      align-items: center;\n      color: ".concat(
                  w.textSecondary,
                  ";\n    ",
                )),
              o.appendChild(a),
              o.appendChild(i),
              o.appendChild(s));
            var l = function () {
              var e = r();
              ((a.innerHTML = e.icon),
                (i.textContent =
                  "overlay" === e.id
                    ? x("dock.panel", "Panel")
                    : x("dock.cinema", "Cinema")));
            };
            return (
              l(),
              (o.onmouseenter = function () {
                o.style.background = "rgba(255,255,255,0.1)";
              }),
              (o.onmouseleave = function () {
                o.style.background = "rgba(255,255,255,0.05)";
              }),
              (o.onclick = function (r) {
                if ((r.stopPropagation(), M))
                  return (M.remove(), void (M = null));
                (E && E.hide(),
                  O && O.hide(),
                  ((M = document.createElement("div")).className =
                    "bh-voice-dropdown-menu"),
                  (M.style.minWidth = "170px"),
                  t.forEach(function (e) {
                    var t = document.createElement("div");
                    ((t.className = "bh-voice-option"),
                      (t.style.cssText =
                        "\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          justify-content: space-between;\n        "));
                    var r = document.createElement("div");
                    r.style.cssText =
                      "\n          display: flex;\n          align-items: center;\n          gap: 8px;\n        ";
                    var o = document.createElement("span");
                    ((o.innerHTML = e.icon),
                      (o.style.cssText =
                        "\n          display: flex;\n          align-items: center;\n          opacity: 0.8;\n        "));
                    var a = document.createElement("span");
                    if (
                      ((a.textContent = e.label),
                      r.appendChild(o),
                      r.appendChild(a),
                      t.appendChild(r),
                      e.id === L && "collapse" !== e.action)
                    ) {
                      var i = document.createElement("span");
                      ((i.textContent = "✓"),
                        (i.style.color = w.accentColor),
                        t.appendChild(i),
                        (t.style.background = "rgba(255,255,255,0.08)"));
                    }
                    ((t.onclick = function (t) {
                      if ((t.stopPropagation(), "collapse" === e.action))
                        return (M.remove(), (M = null), void p());
                      ((L = e.id),
                        (n.subtitleMode = e.id),
                        l(),
                        m("subtitleMode", e.id),
                        y(e.id),
                        M.remove(),
                        (M = null));
                    }),
                      M.appendChild(t));
                  }),
                  e.appendChild(M));
              }),
              e.appendChild(o),
              e
            );
          })(),
        ),
        S.appendChild(
          (function () {
            var e = document.createElement("div");
            e.style.cssText = "\n      position: relative;\n    ";
            var t = Br(Dr.settings, x("dock.settings", "Settings"), o);
            return (
              (t.className = "bh-settings-btn-dock"),
              (t.onclick = function (t) {
                (t.stopPropagation(),
                  E && E.hide(),
                  M && (M.remove(), (M = null)),
                  O || ((O = go(n, m, o, x)), e.appendChild(O.getElement())),
                  O.toggle());
              }),
              e.appendChild(t),
              e
            );
          })(),
        ),
        S.appendChild(
          (((e = Br(Dr.collapse, x("dock.collapse", "Collapse"), o)).className =
            "bh-collapse-btn-dock"),
          (e.onclick = function (e) {
            (e.stopPropagation(), H(), p());
          }),
          e),
        ),
        S.appendChild(
          (function () {
            var e = Br(Dr.close, x("dock.close", "Close"), o);
            return (
              (e.onclick = function (e) {
                (e.stopPropagation(), u());
              }),
              e
            );
          })(),
        ),
        document.addEventListener("click", q),
        S
      );
    }
    function q(e) {
      (E &&
        E.isVisible() &&
        !e.target.closest(".bh-audio-mixer") &&
        !e.target.closest(".bh-audio-btn") &&
        E.hide(),
        O &&
          O.isVisible() &&
          !e.target.closest(".bh-settings-panel-dock") &&
          !e.target.closest(".bh-settings-btn-dock") &&
          O.hide(),
        !M ||
          e.target.closest(".bh-voice-dropdown-menu") ||
          e.target.closest(".bh-subtitle-mode-btn") ||
          (M.remove(), (M = null)));
    }
    function H() {
      (E && E.hide(), O && O.hide(), M && (M.remove(), (M = null)));
    }
    function U() {
      var e = document.createElement("div");
      return (
        (e.style.cssText =
          "\n      width: 1px;\n      height: 24px;\n      background: ".concat(
            w.dockBorder,
            ";\n      margin: 0 4px;\n    ",
          )),
        e
      );
    }
    function W() {
      R &&
        ((R.style.opacity = n.ttsEnabled ? "1" : "0.4"),
        (R.style.cursor = n.ttsEnabled ? "pointer" : "default"));
    }
    function Y() {
      return G.apply(this, arguments);
    }
    function G() {
      return (G = vo(
        fo().mark(function e() {
          return fo().wrap(function (e) {
            for (;;)
              switch ((e.prev = e.next)) {
                case 0:
                  ((k = !0), Z(), J(), ee("listening"), i());
                case 5:
                case "end":
                  return e.stop();
              }
          }, e);
        }),
      )).apply(this, arguments);
    }
    function X() {
      return K.apply(this, arguments);
    }
    function K() {
      return (K = vo(
        fo().mark(function e() {
          return fo().wrap(
            function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return ((T = !0), Z(), (e.prev = 2), (e.next = 5), l());
                  case 5:
                    e.next = 10;
                    break;
                  case 7:
                    ((e.prev = 7), (e.t0 = e.catch(2)));
                  case 10:
                    ((T = !1), (k = !1), $(), Z(), ee("ready"));
                  case 15:
                  case "end":
                    return e.stop();
                }
            },
            e,
            null,
            [[2, 7]],
          );
        }),
      )).apply(this, arguments);
    }
    function Z() {
      I &&
        (T
          ? ((I.innerHTML =
              '\n        <div style="\n          width: 16px;\n          height: 16px;\n          border: 2px solid rgba(255,255,255,0.3);\n          border-top-color: white;\n          border-radius: 50%;\n          animation: spin 0.6s linear infinite;\n        "></div>\n      '),
            (I.style.cursor = "wait"))
          : k
            ? ((I.textContent = x("dock.pause", "Pause")),
              (I.title = x("common.stop", "Stop")),
              (I.style.cursor = "pointer"))
            : ((I.textContent = x("common.start", "Start")),
              (I.title = x("common.start", "Start")),
              (I.style.cursor = "pointer")));
    }
    function J() {
      ($(),
        (_ = 0),
        Q(),
        (C = setInterval(function () {
          (_++, Q());
        }, 1e3)));
    }
    function $() {
      C && (clearInterval(C), (C = null));
    }
    function Q() {
      var e, t, n;
      j &&
        (j.textContent =
          ((e = _),
          (t = Math.floor(e / 60)),
          (n = Math.floor(e % 60)),
          ""
            .concat(t.toString().padStart(2, "0"), ":")
            .concat(n.toString().padStart(2, "0"))));
    }
    function ee(e) {
      if (V && B)
        switch (e) {
          case "ready":
            ((V.style.background = "rgba(100,100,100,0.5)"),
              (V.style.animation = "none"),
              (B.textContent = x("dock.ready", "Ready")));
            break;
          case "connecting":
            ((V.style.background = "rgba(251,191,36,1)"),
              (V.style.animation = "bh-pulse-dot 1s infinite"),
              (B.textContent = x("dock.connecting", "Connecting...")));
            break;
          case "listening":
            ((V.style.background = "rgba(34,197,94,1)"),
              (V.style.animation = "none"),
              (B.textContent = x("dock.translating", "Translating")));
            break;
          case "error":
            ((V.style.background = "rgba(239,68,68,1)"),
              (V.style.animation = "none"),
              (B.textContent = x("dock.error", "Error")));
        }
    }
    return {
      getElement: function () {
        return (S || (S = F()), S);
      },
      show: function () {
        (S || (S = F()),
          N || ((N = D), window.addEventListener("resize", N)),
          (S.style.display = "flex"),
          document.documentElement.appendChild(S),
          D());
      },
      hide: function () {
        (N && (window.removeEventListener("resize", N), (N = null)),
          S && S.parentNode && S.parentNode.removeChild(S),
          $(),
          (z = !1),
          E && E.hide(),
          O && O.hide(),
          document.removeEventListener("click", q));
      },
      collapse: function () {
        S && (H(), (S.style.display = "none"));
      },
      updateStatus: ee,
      setCapturing: function (e) {
        ((k = e), Z(), e ? (J(), ee("listening")) : ($(), ee("ready")));
      },
      getIsCapturing: function () {
        return k;
      },
      updateTheme: function (e) {},
    };
  }
  function bo(e) {
    return (
      (bo =
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
      bo(e)
    );
  }
  function xo() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
      t = e.theme,
      n = void 0 === t ? "dark" : t,
      r = e.fontSize,
      o = void 0 === r ? 22 : r,
      a = e.backgroundOpacity,
      i = void 0 === a ? 0.7 : a,
      s = e.showBilingual,
      l = void 0 === s || s,
      c = e.swapLanguageOrder,
      u = void 0 !== c && c,
      d = e.deferPartial,
      p = void 0 !== d && d,
      g = e.overlayT,
      h =
        void 0 === g
          ? function (e, t) {
              return t || e;
            }
          : g,
      f = {
        fontSize: o,
        backgroundOpacity: i,
        theme: n,
        showBilingual: l,
        swapLanguageOrder: u,
        deferPartial: p,
      },
      m = null,
      v = null,
      y = null,
      b = null,
      x = null,
      w = null,
      S = null,
      k = null,
      T = !1,
      _ = { x: 0, y: 0 },
      C = !1,
      E = !1,
      P = !1,
      O = { translatedText: "", originalText: "" },
      M = null;
    function L() {
      if (m) {
        ((m.style.fontSize = "".concat(f.fontSize, "px")), j());
        var e = Math.max(0, Math.min(1, f.backgroundOpacity));
        ((m.style.background = "rgba(0, 0, 0, ".concat(e, ")")),
          (m.style.color = "rgba(255, 255, 255, 1)"));
      }
    }
    function z() {
      if (m && !T) {
        var e = m.getBoundingClientRect();
        if (e.width && e.height) {
          var t = window.innerWidth,
            n = window.innerHeight,
            r = 16;
          if (C) {
            var o = e.left,
              a = e.top,
              i = !1;
            return (
              e.right > t - r && ((o -= e.right - (t - r)), (i = !0)),
              o < r && ((o = r), (i = !0)),
              e.bottom > n - r && ((a -= e.bottom - (n - r)), (i = !0)),
              a < r && ((a = r), (i = !0)),
              void (
                i &&
                ((m.style.left = "".concat(o, "px")),
                (m.style.top = "".concat(a, "px")),
                (m.style.bottom = "auto"),
                (m.style.transform = "none"))
              )
            );
          }
          var s = Math.max(r, Math.min(80, n - e.height - r));
          if (
            ((m.style.bottom = "".concat(s, "px")),
            (m.style.top = "auto"),
            e.width > t - 32)
          ) {
            var l = Math.max(r, t - e.width - r);
            ((m.style.left = "".concat(l, "px")), (m.style.transform = "none"));
          } else
            ((m.style.left = "50%"), (m.style.transform = "translateX(-50%)"));
        }
      }
    }
    function N() {
      m &&
        requestAnimationFrame(function () {
          z();
        });
    }
    function A(e) {
      if (!e) return e;
      var t = Math.round(1650 / f.fontSize),
        n = Math.round(780 / f.fontSize),
        r = /[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/.test(e),
        o = r ? n : t;
      if (e.length <= o) return e;
      var a = r ? /[，。！？；：、]/g : /[\s,;:.!?]|\band\b|\bor\b|\bbut\b/gi,
        i = r ? 4 : 8,
        s = Math.floor(0.4 * o),
        l = Math.min(o, e.length - i);
      l < s && (l = Math.min(o, e.length - 1));
      for (var c, u = [], d = new RegExp(a); null !== (c = d.exec(e)); ) {
        var p = c.index + c[0].length;
        p > 0 && p < e.length && u.push(p);
      }
      var g = -1;
      if (
        (u.forEach(function (e) {
          e >= s && e <= l && (g = e);
        }),
        -1 === g)
      )
        if (r) g = l;
        else {
          var h = e.lastIndexOf(" ", l);
          g = h >= s ? h : l;
        }
      var m = e.slice(0, g).trim(),
        v = e.slice(g).trim();
      return "".concat(m, "\n").concat(v);
    }
    function D(e) {
      return e && "object" === bo(e)
        ? {
            translatedText:
              "string" == typeof e.translatedText
                ? e.translatedText
                : "string" == typeof e.textTranslated
                  ? e.textTranslated
                  : "",
            originalText:
              "string" == typeof e.originalText
                ? e.originalText
                : "string" == typeof e.textOriginal
                  ? e.textOriginal
                  : "",
          }
        : "string" == typeof e
          ? { translatedText: e, originalText: "" }
          : { translatedText: "", originalText: "" };
    }
    function V(e) {
      if (!e) return !1;
      var t = e.translatedText || "",
        n = e.originalText || "";
      return t.trim().length > 0 || n.trim().length > 0;
    }
    function B(e) {
      if (!e) return !1;
      var t = e.translatedText || "",
        n = e.originalText || "";
      return t.trim().length > 0 || (f.showBilingual && n.trim().length > 0);
    }
    function j() {
      if (x) {
        var e = Math.round(0.7 * f.fontSize);
        x.style.fontSize = "".concat(e, "px");
      }
    }
    function I() {
      var e =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
        t = e.title,
        n = void 0 === t ? "" : t,
        r = e.subtitle,
        o = void 0 === r ? "" : r,
        a = e.showDot,
        i = void 0 !== a && a,
        s = e.pulseDot,
        l = void 0 !== s && s;
      if (
        ((P = !0),
        y && (y.style.display = "none"),
        b && (b.style.display = "none"),
        w &&
          ((w.style.display = i ? "inline-block" : "none"),
          (w.style.animation = l ? "bh-pulse-dot 1.2s infinite" : "none")),
        S)
      ) {
        var c = n || "",
          u = o || "";
        S.innerHTML = u
          ? ""
              .concat(c, '<br><span style="font-size: 0.85em; opacity: 0.7;">')
              .concat(u, "</span>")
          : c;
      }
      x && (j(), (x.style.display = "inline-flex"));
    }
    function R() {
      I({
        title: h("overlay.waitingForAudio", "Waiting for audio..."),
        subtitle: h(
          "overlay.makeSureVideoPlaying",
          "Make sure video is playing & unmuted",
        ),
        showDot: !0,
        pulseDot: !0,
      });
    }
    function F(e) {
      if (y && b) {
        var t = D(e),
          n = t.translatedText || "",
          r = t.originalText || "",
          o = n.trim().length > 0,
          a = r.trim().length > 0,
          i = o,
          s = f.showBilingual && a,
          l = i && s;
        ((y.textContent = o ? A(n) : ""),
          (b.textContent = a ? A(r) : ""),
          (y.style.display = i ? "block" : "none"),
          (b.style.display = s ? "block" : "none"),
          (y.style.order = f.swapLanguageOrder ? "2" : "1"),
          (b.style.order = f.swapLanguageOrder ? "1" : "2"));
        ((y.style.marginTop = f.swapLanguageOrder && l ? "8px" : "0"),
          (b.style.marginTop = !f.swapLanguageOrder && l ? "8px" : "0"),
          x && (x.style.display = "none"),
          (P = !1));
      }
    }
    function q() {
      (((m = document.createElement("div")).id = "bh-subtitle-strip"),
        (m.style.cssText =
          '\n      position: fixed;\n      left: 50%;\n      bottom: 80px;\n      transform: translateX(-50%);\n      padding: 12px 16px;\n      border-radius: 6px;\n      font-weight: 500;\n      line-height: 1.4;\n      text-align: center;\n      z-index: 2147483645;\n      cursor: grab;\n      user-select: none;\n      min-width: clamp(280px, 28vw, 520px);\n      max-width: clamp(360px, 72vw, 980px);\n      text-shadow: 0 1px 2px rgba(0,0,0,0.8);\n      backdrop-filter: blur(2px);\n      transition: opacity 0.2s ease, transform 0.1s;\n      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;\n      pointer-events: auto;\n      display: none;\n      box-shadow: 0 2px 8px rgba(0,0,0,0.3);\n      white-space: pre-line;\n    '),
        ((v = document.createElement("div")).style.cssText =
          "\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      width: 100%;\n      padding-bottom: 6px;\n    "),
        ((y = document.createElement("div")).style.cssText =
          "\n      font-size: 1em;\n      font-weight: 600;\n      line-height: 1.1;\n      opacity: 1;\n      max-width: 100%;\n      word-break: break-word;\n      white-space: pre-line;\n      margin-top: 0;\n    "),
        ((b = document.createElement("div")).style.cssText =
          "\n      font-size: 0.88em;\n      font-weight: 400;\n      line-height: 1.1;\n      opacity: 0.88;\n      max-width: 100%;\n      word-break: break-word;\n      white-space: pre-line;\n      margin-top: 0;\n    "),
        ((x = document.createElement("div")).style.cssText =
          "\n      color: rgba(255, 255, 255, 0.6);\n      font-style: italic;\n      display: none;\n      flex-direction: column;\n      align-items: center;\n      gap: 6px;\n    "),
        ((w = document.createElement("span")).style.cssText =
          "\n      display: inline-block;\n      width: 6px;\n      height: 6px;\n      background: rgba(255,255,255,0.5);\n      border-radius: 50%;\n      animation: bh-pulse-dot 1.2s infinite;\n    "),
        ((S = document.createElement("span")).style.cssText =
          "\n      text-align: center;\n      line-height: 1.4;\n    "),
        (S.innerHTML = ""
          .concat(
            h("overlay.waitingForAudio", "Waiting for audio..."),
            '<br><span style="font-size: 0.85em; opacity: 0.7;">',
          )
          .concat(
            h(
              "overlay.makeSureVideoPlaying",
              "Make sure video is playing & unmuted",
            ),
            "</span>",
          )));
      var e = document.createElement("div");
      ((e.style.cssText =
        "\n      display: flex;\n      align-items: center;\n      gap: 8px;\n    "),
        e.appendChild(w),
        e.appendChild(S),
        x.appendChild(e),
        v.appendChild(y),
        v.appendChild(b),
        v.appendChild(x),
        m.appendChild(v),
        L());
      return (
        m.addEventListener("mousedown", function (e) {
          ((T = !0),
            (m.style.cursor = "grabbing"),
            (m.style.transition = "opacity 0.2s ease"));
          var t = m.getBoundingClientRect();
          ((_ = { x: e.clientX - t.left, y: e.clientY - t.top }),
            e.preventDefault(),
            e.stopPropagation());
        }),
        document.addEventListener("mousemove", function (e) {
          if (T) {
            C = !0;
            var t = e.clientX - _.x,
              n = e.clientY - _.y;
            ((m.style.bottom = "auto"),
              (m.style.transform = "none"),
              (m.style.left = "".concat(t, "px")),
              (m.style.top = "".concat(n, "px")));
          }
        }),
        document.addEventListener("mouseup", function () {
          T && ((T = !1), (m.style.cursor = "grab"), z());
        }),
        document.documentElement.appendChild(m),
        (M = function () {
          N();
        }),
        window.addEventListener("resize", M),
        m
      );
    }
    return {
      show: function () {
        (m || q(), (m.style.display = "block"), (m.style.opacity = "1"), N());
      },
      hide: function () {
        m && (m.style.display = "none");
      },
      showWaiting: function () {
        if ((m || q(), E && B(O)))
          return (
            F(O),
            (m.style.display = "block"),
            (m.style.opacity = "1"),
            void N()
          );
        (R(), (m.style.display = "block"), (m.style.opacity = "1"), N());
      },
      showMessage: function () {
        var e =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          t = e.title,
          n = void 0 === t ? "" : t,
          r = e.subtitle,
          o = void 0 === r ? "" : r,
          a = e.showDot,
          i = void 0 !== a && a;
        (m || q(),
          I({ title: n, subtitle: o, showDot: i, pulseDot: !1 }),
          (m.style.display = "block"),
          (m.style.opacity = "1"),
          N());
      },
      updateText: function (e) {
        m || q();
        var t,
          n = D(e),
          r =
            !(t = e) ||
            "object" !== bo(t) ||
            !Object.prototype.hasOwnProperty.call(t, "isFinal") ||
            !0 === t.isFinal;
        !f.deferPartial || r
          ? V(n)
            ? ((E = !0),
              (O = n),
              B(n)
                ? (F(n),
                  (m.style.opacity = "1"),
                  "none" === m.style.display && (m.style.display = "block"),
                  N())
                : this.showWaiting())
            : this.showWaiting()
          : B(O) || this.showWaiting();
      },
      fadeToText: function (e) {
        var t = this,
          n =
            arguments.length > 1 && void 0 !== arguments[1]
              ? arguments[1]
              : 260;
        (m || q(), k && (clearTimeout(k), (k = null)));
        var r = Math.max(180, Math.min(320, Number(n) || 260));
        ("none" === m.style.display && (m.style.display = "block"),
          (m.style.transition = "opacity ".concat(
            r,
            "ms ease, transform 0.1s",
          )),
          (m.style.opacity = "0"),
          (k = setTimeout(function () {
            (t.updateText(e), (k = null));
          }, r)));
      },
      updateSettings: function () {
        var e =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        if ((Object.assign(f, e), L(), m)) {
          if (B(O)) return (F(O), void N());
          ((V(O) || P) && R(), N());
        }
      },
      getElement: function () {
        return (m || q(), m);
      },
      hasDisplayableText: function () {
        return B(O);
      },
      setStatus: function () {},
      reset: function () {
        ((E = !1),
          (P = !1),
          (O = { translatedText: "", originalText: "" }),
          k && (clearTimeout(k), (k = null)));
      },
      destroy: function () {
        (m && m.parentNode && m.parentNode.removeChild(m),
          M && (window.removeEventListener("resize", M), (M = null)),
          (m = null),
          (v = null),
          (y = null),
          (b = null),
          (x = null),
          (w = null),
          (S = null),
          (E = !1),
          (P = !1),
          (O = { translatedText: "", originalText: "" }),
          k && (clearTimeout(k), (k = null)));
      },
    };
  }
  function wo(e, t) {
    var n = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(e);
      (t &&
        (r = r.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        n.push.apply(n, r));
    }
    return n;
  }
  function So(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = null != arguments[t] ? arguments[t] : {};
      t % 2
        ? wo(Object(n), !0).forEach(function (t) {
            ko(e, t, n[t]);
          })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
          : wo(Object(n)).forEach(function (t) {
              Object.defineProperty(
                e,
                t,
                Object.getOwnPropertyDescriptor(n, t),
              );
            });
    }
    return e;
  }
  function ko(e, t, n) {
    return (
      (t = (function (e) {
        var t = (function (e, t) {
          if ("object" != To(e) || !e) return e;
          var n = e[Symbol.toPrimitive];
          if (void 0 !== n) {
            var r = n.call(e, t || "default");
            if ("object" != To(r)) return r;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return ("string" === t ? String : Number)(e);
        })(e, "string");
        return "symbol" == To(t) ? t : String(t);
      })(t)),
      t in e
        ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = n),
      e
    );
  }
  function To(e) {
    return (
      (To =
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
      To(e)
    );
  }
  function _o(e, t) {
    var n =
      ("undefined" != typeof Symbol && e[Symbol.iterator]) || e["@@iterator"];
    if (!n) {
      if (
        Array.isArray(e) ||
        (n = (function (e, t) {
          if (!e) return;
          if ("string" == typeof e) return Co(e, t);
          var n = Object.prototype.toString.call(e).slice(8, -1);
          "Object" === n && e.constructor && (n = e.constructor.name);
          if ("Map" === n || "Set" === n) return Array.from(e);
          if (
            "Arguments" === n ||
            /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
          )
            return Co(e, t);
        })(e)) ||
        (t && e && "number" == typeof e.length)
      ) {
        n && (e = n);
        var r = 0,
          o = function () {};
        return {
          s: o,
          n: function () {
            return r >= e.length ? { done: !0 } : { done: !1, value: e[r++] };
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
    var a,
      i = !0,
      s = !1;
    return {
      s: function () {
        n = n.call(e);
      },
      n: function () {
        var e = n.next();
        return ((i = e.done), e);
      },
      e: function (e) {
        ((s = !0), (a = e));
      },
      f: function () {
        try {
          i || null == n.return || n.return();
        } finally {
          if (s) throw a;
        }
      },
    };
  }
  function Co(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
    return r;
  }
  function Eo() {
    Eo = function () {
      return t;
    };
    var e,
      t = {},
      n = Object.prototype,
      r = n.hasOwnProperty,
      o =
        Object.defineProperty ||
        function (e, t, n) {
          e[t] = n.value;
        },
      a = "function" == typeof Symbol ? Symbol : {},
      i = a.iterator || "@@iterator",
      s = a.asyncIterator || "@@asyncIterator",
      l = a.toStringTag || "@@toStringTag";
    function c(e, t, n) {
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
      c({}, "");
    } catch (e) {
      c = function (e, t, n) {
        return (e[t] = n);
      };
    }
    function u(e, t, n, r) {
      var a = t && t.prototype instanceof v ? t : v,
        i = Object.create(a.prototype),
        s = new M(r || []);
      return (o(i, "_invoke", { value: C(e, n, s) }), i);
    }
    function d(e, t, n) {
      try {
        return { type: "normal", arg: e.call(t, n) };
      } catch (e) {
        return { type: "throw", arg: e };
      }
    }
    t.wrap = u;
    var p = "suspendedStart",
      g = "suspendedYield",
      h = "executing",
      f = "completed",
      m = {};
    function v() {}
    function y() {}
    function b() {}
    var x = {};
    c(x, i, function () {
      return this;
    });
    var w = Object.getPrototypeOf,
      S = w && w(w(L([])));
    S && S !== n && r.call(S, i) && (x = S);
    var k = (b.prototype = v.prototype = Object.create(x));
    function T(e) {
      ["next", "throw", "return"].forEach(function (t) {
        c(e, t, function (e) {
          return this._invoke(t, e);
        });
      });
    }
    function _(e, t) {
      function n(o, a, i, s) {
        var l = d(e[o], e, a);
        if ("throw" !== l.type) {
          var c = l.arg,
            u = c.value;
          return u && "object" == To(u) && r.call(u, "__await")
            ? t.resolve(u.__await).then(
                function (e) {
                  n("next", e, i, s);
                },
                function (e) {
                  n("throw", e, i, s);
                },
              )
            : t.resolve(u).then(
                function (e) {
                  ((c.value = e), i(c));
                },
                function (e) {
                  return n("throw", e, i, s);
                },
              );
        }
        s(l.arg);
      }
      var a;
      o(this, "_invoke", {
        value: function (e, r) {
          function o() {
            return new t(function (t, o) {
              n(e, r, t, o);
            });
          }
          return (a = a ? a.then(o, o) : o());
        },
      });
    }
    function C(t, n, r) {
      var o = p;
      return function (a, i) {
        if (o === h) throw new Error("Generator is already running");
        if (o === f) {
          if ("throw" === a) throw i;
          return { value: e, done: !0 };
        }
        for (r.method = a, r.arg = i; ; ) {
          var s = r.delegate;
          if (s) {
            var l = E(s, r);
            if (l) {
              if (l === m) continue;
              return l;
            }
          }
          if ("next" === r.method) r.sent = r._sent = r.arg;
          else if ("throw" === r.method) {
            if (o === p) throw ((o = f), r.arg);
            r.dispatchException(r.arg);
          } else "return" === r.method && r.abrupt("return", r.arg);
          o = h;
          var c = d(t, n, r);
          if ("normal" === c.type) {
            if (((o = r.done ? f : g), c.arg === m)) continue;
            return { value: c.arg, done: r.done };
          }
          "throw" === c.type &&
            ((o = f), (r.method = "throw"), (r.arg = c.arg));
        }
      };
    }
    function E(t, n) {
      var r = n.method,
        o = t.iterator[r];
      if (o === e)
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
          m
        );
      var a = d(o, t.iterator, n.arg);
      if ("throw" === a.type)
        return ((n.method = "throw"), (n.arg = a.arg), (n.delegate = null), m);
      var i = a.arg;
      return i
        ? i.done
          ? ((n[t.resultName] = i.value),
            (n.next = t.nextLoc),
            "return" !== n.method && ((n.method = "next"), (n.arg = e)),
            (n.delegate = null),
            m)
          : i
        : ((n.method = "throw"),
          (n.arg = new TypeError("iterator result is not an object")),
          (n.delegate = null),
          m);
    }
    function P(e) {
      var t = { tryLoc: e[0] };
      (1 in e && (t.catchLoc = e[1]),
        2 in e && ((t.finallyLoc = e[2]), (t.afterLoc = e[3])),
        this.tryEntries.push(t));
    }
    function O(e) {
      var t = e.completion || {};
      ((t.type = "normal"), delete t.arg, (e.completion = t));
    }
    function M(e) {
      ((this.tryEntries = [{ tryLoc: "root" }]),
        e.forEach(P, this),
        this.reset(!0));
    }
    function L(t) {
      if (t || "" === t) {
        var n = t[i];
        if (n) return n.call(t);
        if ("function" == typeof t.next) return t;
        if (!isNaN(t.length)) {
          var o = -1,
            a = function n() {
              for (; ++o < t.length; )
                if (r.call(t, o)) return ((n.value = t[o]), (n.done = !1), n);
              return ((n.value = e), (n.done = !0), n);
            };
          return (a.next = a);
        }
      }
      throw new TypeError(To(t) + " is not iterable");
    }
    return (
      (y.prototype = b),
      o(k, "constructor", { value: b, configurable: !0 }),
      o(b, "constructor", { value: y, configurable: !0 }),
      (y.displayName = c(b, l, "GeneratorFunction")),
      (t.isGeneratorFunction = function (e) {
        var t = "function" == typeof e && e.constructor;
        return (
          !!t && (t === y || "GeneratorFunction" === (t.displayName || t.name))
        );
      }),
      (t.mark = function (e) {
        return (
          Object.setPrototypeOf
            ? Object.setPrototypeOf(e, b)
            : ((e.__proto__ = b), c(e, l, "GeneratorFunction")),
          (e.prototype = Object.create(k)),
          e
        );
      }),
      (t.awrap = function (e) {
        return { __await: e };
      }),
      T(_.prototype),
      c(_.prototype, s, function () {
        return this;
      }),
      (t.AsyncIterator = _),
      (t.async = function (e, n, r, o, a) {
        void 0 === a && (a = Promise);
        var i = new _(u(e, n, r, o), a);
        return t.isGeneratorFunction(n)
          ? i
          : i.next().then(function (e) {
              return e.done ? e.value : i.next();
            });
      }),
      T(k),
      c(k, l, "Generator"),
      c(k, i, function () {
        return this;
      }),
      c(k, "toString", function () {
        return "[object Generator]";
      }),
      (t.keys = function (e) {
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
      (t.values = L),
      (M.prototype = {
        constructor: M,
        reset: function (t) {
          if (
            ((this.prev = 0),
            (this.next = 0),
            (this.sent = this._sent = e),
            (this.done = !1),
            (this.delegate = null),
            (this.method = "next"),
            (this.arg = e),
            this.tryEntries.forEach(O),
            !t)
          )
            for (var n in this)
              "t" === n.charAt(0) &&
                r.call(this, n) &&
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
          function o(r, o) {
            return (
              (s.type = "throw"),
              (s.arg = t),
              (n.next = r),
              o && ((n.method = "next"), (n.arg = e)),
              !!o
            );
          }
          for (var a = this.tryEntries.length - 1; a >= 0; --a) {
            var i = this.tryEntries[a],
              s = i.completion;
            if ("root" === i.tryLoc) return o("end");
            if (i.tryLoc <= this.prev) {
              var l = r.call(i, "catchLoc"),
                c = r.call(i, "finallyLoc");
              if (l && c) {
                if (this.prev < i.catchLoc) return o(i.catchLoc, !0);
                if (this.prev < i.finallyLoc) return o(i.finallyLoc);
              } else if (l) {
                if (this.prev < i.catchLoc) return o(i.catchLoc, !0);
              } else {
                if (!c)
                  throw new Error("try statement without catch or finally");
                if (this.prev < i.finallyLoc) return o(i.finallyLoc);
              }
            }
          }
        },
        abrupt: function (e, t) {
          for (var n = this.tryEntries.length - 1; n >= 0; --n) {
            var o = this.tryEntries[n];
            if (
              o.tryLoc <= this.prev &&
              r.call(o, "finallyLoc") &&
              this.prev < o.finallyLoc
            ) {
              var a = o;
              break;
            }
          }
          a &&
            ("break" === e || "continue" === e) &&
            a.tryLoc <= t &&
            t <= a.finallyLoc &&
            (a = null);
          var i = a ? a.completion : {};
          return (
            (i.type = e),
            (i.arg = t),
            a
              ? ((this.method = "next"), (this.next = a.finallyLoc), m)
              : this.complete(i)
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
            m
          );
        },
        finish: function (e) {
          for (var t = this.tryEntries.length - 1; t >= 0; --t) {
            var n = this.tryEntries[t];
            if (n.finallyLoc === e)
              return (this.complete(n.completion, n.afterLoc), O(n), m);
          }
        },
        catch: function (e) {
          for (var t = this.tryEntries.length - 1; t >= 0; --t) {
            var n = this.tryEntries[t];
            if (n.tryLoc === e) {
              var r = n.completion;
              if ("throw" === r.type) {
                var o = r.arg;
                O(n);
              }
              return o;
            }
          }
          throw new Error("illegal catch attempt");
        },
        delegateYield: function (t, n, r) {
          return (
            (this.delegate = { iterator: L(t), resultName: n, nextLoc: r }),
            "next" === this.method && (this.arg = e),
            m
          );
        },
      }),
      t
    );
  }
  function Po(e, t, n, r, o, a, i) {
    try {
      var s = e[a](i),
        l = s.value;
    } catch (e) {
      return void n(e);
    }
    s.done ? t(l) : Promise.resolve(l).then(r, o);
  }
  function Oo(e) {
    return function () {
      var t = this,
        n = arguments;
      return new Promise(function (r, o) {
        var a = e.apply(t, n);
        function i(e) {
          Po(a, r, o, i, s, "next", e);
        }
        function s(e) {
          Po(a, r, o, i, s, "throw", e);
        }
        i(void 0);
      });
    };
  }
  var Mo = null;
  function Lo(e) {
    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
    if (!Mo) return t || e;
    var n,
      r = e.split("."),
      o = Mo,
      a = _o(r);
    try {
      for (a.s(); !(n = a.n()).done; ) {
        var i = n.value;
        if (!o || "object" !== To(o) || !(i in o)) return t || e;
        o = o[i];
      }
    } catch (e) {
      a.e(e);
    } finally {
      a.f();
    }
    return "string" == typeof o ? o : t || e;
  }
  (Oo(
    Eo().mark(function e() {
      return Eo().wrap(function (e) {
        for (;;)
          switch ((e.prev = e.next)) {
            case 0:
              return ((e.next = 2), Lr());
            case 2:
              Mo = Nr();
            case 3:
            case "end":
              return e.stop();
          }
      }, e);
    }),
  )(),
    chrome.storage.onChanged.addListener(function (e, t) {
      "sync" === t &&
        e.uiLanguage &&
        Oo(
          Eo().mark(function e() {
            return Eo().wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return ((e.next = 2), Lr());
                  case 2:
                    Mo = Nr();
                  case 3:
                  case "end":
                    return e.stop();
                }
            }, e);
          }),
        )();
    }),
    (function () {
      if (window.top === window.self) {
        var e,
          t,
          n,
          r,
          o,
          a = "bh-caption-overlay",
          i = 400,
          s = 200,
          l = 600,
          c = 400,
          u = "overlayLayout",
          d = "overlayResizeTooltipSeen",
          p = 12,
          g = 12e4,
          h = null,
          f = {},
          m = null,
          v = null,
          y = null,
          b = !1,
          x = null,
          w = !1,
          S = null,
          k = null,
          T = null,
          _ = !1,
          C = !1,
          E = { x: 0, y: 0 },
          P = { x: 0, y: 0 },
          O = !1,
          M = !1,
          L = "connecting",
          z = {},
          N = {
            position: "bottom",
            overlayFontSize: 18,
            stripFontSize: 30,
            shadow: 0.6,
            draggable: !0,
            width: l,
            height: c,
            left: null,
            top: null,
            showBilingual: !0,
            swapLanguageOrder: !1,
            backgroundOpacity: 0.95,
            theme: "dark",
            ttsEnabled: !0,
            subtitleMode: "overlay",
          },
          A = !1,
          D = !1,
          V = null,
          B = { x: 0, y: 0 },
          j = { x: 0, y: 0, w: 0, h: 0, top: 0, left: 0 },
          I = !1,
          R = 0,
          F = !1,
          q = 0,
          H = null,
          U = !0,
          W = !1,
          Y = null,
          G = null,
          X = null,
          K = !1,
          Z = !1,
          J = null,
          $ = null,
          Q = null,
          ee = null,
          te = [],
          ne = !0,
          re = null,
          oe = !0,
          ae = !1,
          ie = null,
          se = "overlay",
          le = null,
          ce = {
            dark: {
              containerBg: "24,24,27",
              topBarBg: "rgba(24,24,27,0.95)",
              topBarBorder: "rgba(255,255,255,0.15)",
              textPrimary: "rgba(255,255,255,0.9)",
              textSecondary: "rgba(255,255,255,0.7)",
              textTranslate: "rgba(255,255,255,0.95)",
              textOriginal: "rgba(255,255,255,0.7)",
              settingsPanelBg: "rgba(24,24,27,0.98)",
              lineBorder: "rgba(255,255,255,0.05)",
              buttonBg: "rgba(255,255,255,0.1)",
              buttonBorder: "rgba(255,255,255,0.2)",
              buttonHoverBg: "rgba(255,255,255,0.2)",
            },
            light: {
              containerBg: "245,245,245",
              topBarBg: "rgba(255,255,255,0.95)",
              topBarBorder: "rgba(0,0,0,0.1)",
              textPrimary: "rgba(0,0,0,0.9)",
              textSecondary: "rgba(0,0,0,0.65)",
              textTranslate: "rgba(0,0,0,0.9)",
              textOriginal: "rgba(0,0,0,0.65)",
              settingsPanelBg: "rgba(255,255,255,0.98)",
              lineBorder: "rgba(0,0,0,0.08)",
              buttonBg: "rgba(0,0,0,0.05)",
              buttonBorder: "rgba(0,0,0,0.15)",
              buttonHoverBg: "rgba(0,0,0,0.1)",
            },
          };
        (document.addEventListener("fullscreenchange", Ge),
          document.addEventListener("webkitfullscreenchange", Ge),
          document.addEventListener("mozfullscreenchange", Ge),
          document.addEventListener("MSFullscreenChange", Ge),
          Xe());
        var ue = 0,
          de = null,
          pe = { x: 0, y: 0 },
          ge = null,
          he = { x: 0, y: 0 },
          fe = null,
          me = null;
        try {
          chrome.runtime.onMessage.addListener(function (o, i, s) {
            if (o && o.type) {
              if ("ping-overlay" === o.type)
                return (s({ overlayReady: !0 }), !0);
              if ("show-overlay" === o.type)
                Oo(
                  Eo().mark(function e() {
                    return Eo().wrap(function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return (
                              (e.next = 2),
                              it({
                                hintMode: "start",
                                hintWhenEmpty: !0,
                                refreshVoices: !0,
                              })
                            );
                          case 2:
                          case "end":
                            return e.stop();
                        }
                    }, e);
                  }),
                )();
              else if ("wsStatusResponse" === o.type)
                o.wsReady
                  ? ct("connected")
                  : o.reconnectAttempt > 0
                    ? ct("reconnecting", { attempt: o.reconnectAttempt })
                    : ct("connecting");
              else if ("pageChangedListening" === o.type)
                Oo(
                  Eo().mark(function e() {
                    return Eo().wrap(function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return (
                              (e.next = 2),
                              it({ hintMode: "pageChange", resetTts: !0 })
                            );
                          case 2:
                          case "end":
                            return e.stop();
                        }
                    }, e);
                  }),
                )();
              else if ("hide-overlay" === o.type) lt();
              else if ("show-quota-exhausted-modal" === o.type) jt(o.userInfo);
              else if ("offscreenStopped" === o.type) {
                ((U = !1), (W = !1));
                var l = document.querySelector(".bh-stop-btn");
                (l && l.updateStyle && l.updateStyle(),
                  x && x.setCapturing(!1),
                  ct("disconnected"),
                  pt(),
                  (ae = !1),
                  (ie = null),
                  null != ee
                    ? (yt(null, { forceFullClear: !0 }), (ee = null))
                    : yt(null, { forceFullClear: !0 }),
                  mt(),
                  te.length > 0 && (te.length = 0),
                  Ft(),
                  at());
                try {
                  (Y && (clearTimeout(Y), (Y = null)),
                    t &&
                      ((t.style.transform = "translateY(0)"),
                      (t.style.opacity = "1")));
                } catch (e) {}
                try {
                  chrome.runtime.sendMessage({
                    type: "trackEvent",
                    eventName: "overlay_final_display_mode",
                    properties: {
                      mode: N.showBilingual ? "bilingual" : "translation_only",
                      trigger: "offscreen_stopped",
                      reason: o.reason || "user_action",
                    },
                  });
                } catch (e) {}
                !o.reason ||
                  ("tab_updated" !== o.reason &&
                    "tab_removed" !== o.reason &&
                    "tab_replaced" !== o.reason &&
                    "no_audio_timeout" !== o.reason) ||
                  (function (e) {
                    if (r && n && 0 !== r.children.length) {
                      var t = ce[N.theme] || ce.dark,
                        o = "dark" === N.theme,
                        a = "";
                      if ("tab_updated" === e)
                        a = Lo(
                          "overlay.stopTabUpdated",
                          "Captions paused because this tab changed pages. Click Start to continue.",
                        );
                      else if ("tab_removed" === e)
                        a = Lo(
                          "overlay.stopTabRemoved",
                          "Caption stopped because the tab was closed.",
                        );
                      else if ("tab_replaced" === e)
                        a = Lo(
                          "overlay.stopTabReplaced",
                          "Caption stopped because the tab was replaced.",
                        );
                      else {
                        if ("no_audio_timeout" !== e) return;
                        a = Lo(
                          "overlay.stopNoAudioTimeout",
                          "No audio detected on this page for a while. DubTab has stopped automatically. Please click Start to turn it back on.",
                        );
                      }
                      var i = document.createElement("div");
                      ((i.style.cssText =
                        "\n      height: 1px;\n      background: linear-gradient(to right, transparent, rgba(150,150,150,0.3), transparent);\n      margin: 16px 0 12px;\n    "),
                        r.appendChild(i));
                      var s = document.createElement("div");
                      ((s.style.cssText =
                        "\n      text-align: center;\n      font-size: 12px;\n      line-height: 1.5;\n      color: "
                          .concat(
                            t.textSecondary,
                            ";\n      padding: 10px 20px;\n      margin: 0 0 12px;\n      background: ",
                          )
                          .concat(
                            o
                              ? "rgba(255, 255, 255, 0.02)"
                              : "rgba(0, 0, 0, 0.02)",
                            ";\n      border-radius: 6px;\n    ",
                          )),
                        (s.textContent = a),
                        r.appendChild(s),
                        (H = null),
                        I ||
                          ((F = !0),
                          (q = performance.now() + 700),
                          n.scrollTo({
                            top: n.scrollHeight,
                            behavior: "smooth",
                          }),
                          setTimeout(function () {
                            F = !1;
                          }, 600)));
                    }
                  })(o.reason);
              } else if ("wsStatus" === o.type)
                (ct(o.status, {
                  attempt: o.attempt,
                  delay: o.delay,
                  message: o.message,
                  code: o.code,
                  reason: o.reason,
                }),
                  x &&
                    o.status &&
                    ("connected" === o.status
                      ? x.updateStatus("listening")
                      : "connecting" === o.status || "reconnecting" === o.status
                        ? x.updateStatus("connecting")
                        : ("disconnected" !== o.status &&
                            "error" !== o.status) ||
                          x.updateStatus("ready")));
              else if ("caption" === o.type) gt(o);
              else if ("tts_started" === o.type)
                !(function (e) {
                  var t = "strip" === se && Rt();
                  if (
                    ((ee = e),
                    (ae = !0),
                    yt(e),
                    ne && oe && (ht(e, { behavior: "auto", force: !0 }), ft()),
                    "strip" === se)
                  ) {
                    var n = Ut(e);
                    le &&
                      (t ? le.fadeToText(n, 260) : le.updateText(n), le.show());
                  }
                  (Ft(), Ue());
                })(o.lineId);
              else if ("tts_ended" === o.type) bt(o.lineId);
              else if ("tabCaptureError" === o.type)
                !(function (e) {
                  var t =
                      arguments.length > 1 && void 0 !== arguments[1]
                        ? arguments[1]
                        : "Error",
                    n = document.createElement("div");
                  if (
                    ((n.style.cssText =
                      "\n      position: fixed;\n      top: 20px;\n      right: 20px;\n      min-width: 300px;\n      max-width: 400px;\n      background: rgba(40,40,40,0.98);\n      color: #fff;\n      padding: 16px 20px;\n      border-radius: 8px;\n      box-shadow: 0 8px 32px rgba(0,0,0,0.6);\n      z-index: 2147483647;\n      font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;\n      backdrop-filter: blur(10px);\n      border: 1px solid rgba(255,100,100,0.5);\n      animation: slideInFromRight 0.3s ease-out;\n    "),
                    !document.getElementById("bh-notification-keyframes"))
                  ) {
                    var r = document.createElement("style");
                    ((r.id = "bh-notification-keyframes"),
                      (r.textContent =
                        "\n        @keyframes slideInFromRight {\n          from {\n            transform: translateX(100%);\n            opacity: 0;\n          }\n          to {\n            transform: translateX(0);\n            opacity: 1;\n          }\n        }\n      "),
                      document.head.appendChild(r));
                  }
                  var o = document.createElement("div");
                  ((o.style.cssText =
                    "\n      font-size: 14px;\n      font-weight: 600;\n      margin-bottom: 8px;\n      color: rgba(255,100,100,0.9);\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n    "),
                    (o.textContent = t));
                  var a = document.createElement("button");
                  ((a.innerHTML = "✕"),
                    (a.style.cssText =
                      "\n      background: transparent;\n      border: none;\n      color: rgba(255,255,255,0.7);\n      cursor: pointer;\n      font-size: 18px;\n      padding: 0;\n      margin-left: 12px;\n      transition: color 0.2s;\n    "),
                    (a.onmouseenter = function () {
                      a.style.color = "rgba(255,100,100,1)";
                    }),
                    (a.onmouseleave = function () {
                      a.style.color = "rgba(255,255,255,0.7)";
                    }),
                    (a.onclick = function () {
                      n.remove();
                    }),
                    o.appendChild(a));
                  var i = document.createElement("div");
                  ((i.style.cssText =
                    "\n      font-size: 13px;\n      line-height: 1.5;\n      color: rgba(255,255,255,0.9);\n    "),
                    (i.textContent = e),
                    n.appendChild(o),
                    n.appendChild(i),
                    document.documentElement.appendChild(n),
                    setTimeout(function () {
                      n.parentNode &&
                        ((n.style.animation =
                          "slideInFromRight 0.3s ease-in reverse"),
                        setTimeout(function () {
                          return n.remove();
                        }, 300));
                    }, 5e3));
                })(
                  o.error ||
                    "Failed to capture tab audio. Please refresh the page and try again.",
                  "⚠️ Audio Capture Error",
                );
              else if ("insufficientBalance" === o.type) {
                ((U = !1), (W = !1));
                var c = document.querySelector(".bh-stop-btn");
                (c && c.updateStyle && c.updateStyle(),
                  x && x.setCapturing(!1),
                  ct("disconnected"),
                  pt(),
                  at(),
                  Oo(
                    Eo().mark(function e() {
                      return Eo().wrap(function (e) {
                        for (;;)
                          switch ((e.prev = e.next)) {
                            case 0:
                              try {
                                chrome.runtime.sendMessage(
                                  { type: "getUserInfo" },
                                  function (e) {
                                    e && e.userInfo
                                      ? jt(e.userInfo)
                                      : jt({ userLevel: "free" });
                                  },
                                );
                              } catch (e) {
                                jt({ userLevel: "free" });
                              }
                            case 1:
                            case "end":
                              return e.stop();
                          }
                      }, e);
                    }),
                  )());
              } else if ("overlaySettings" === o.type && o.payload) {
                var u = ve((N = Object.assign(N, o.payload)).subtitleMode);
                N.subtitleMode = u;
                var d = se !== u;
                if (((se = u), document.getElementById(a))) {
                  ((e = document.getElementById(a)),
                    (t = e.querySelector(".bh-caption-topbar")),
                    (n = e.querySelector(".bh-caption-wrapper")),
                    (r = e.querySelector(".bh-caption-lines")),
                    wt(),
                    xt(),
                    e &&
                      t &&
                      ((t.style.pointerEvents = N.draggable ? "auto" : "none"),
                      (t.style.cursor = N.draggable ? "move" : "default"),
                      N.draggable || Pt()),
                    Ct(),
                    Et(),
                    St(),
                    kt(),
                    Ae());
                  var p = e.querySelector(".bh-bilingual-btn");
                  p && p.updateStyle && p.updateStyle();
                  var g = e.querySelector(".bh-stop-btn");
                  g && g.updateStyle && g.updateStyle();
                  var h = e.querySelector(".bh-swap-order-btn");
                  (h && (h.style.display = N.showBilingual ? "flex" : "none"),
                    d && It(),
                    Ue());
                }
              }
            }
          });
        } catch (e) {}
      }
      function ve(e) {
        return "strip" === e || "cinema" === e ? "strip" : "overlay";
      }
      function ye(e, t) {
        var n = Number(e);
        return Number.isFinite(n) ? n : t;
      }
      function be() {
        var e =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          t = window.innerWidth || l,
          n = window.innerHeight || c,
          r = p,
          o = Math.max(i, t - 2 * r),
          a = Math.max(s, n - 2 * r),
          u = Math.round(Math.min(Math.max(i, ye(e.width, l)), o)),
          d = Math.round(Math.min(Math.max(s, ye(e.height, c)), a));
        if (
          !(Number.isFinite(Number(e.left)) && Number.isFinite(Number(e.top)))
        )
          return { width: u, height: d, left: null, top: null };
        var g = u > t - 2 * r ? 0 : r,
          h = d > n - 2 * r ? 0 : r,
          f = Math.max(g, t - u - r),
          m = Math.max(h, n - d - r);
        return {
          width: u,
          height: d,
          left: Math.round(Math.min(Math.max(ye(e.left, g), g), f)),
          top: Math.round(Math.min(Math.max(ye(e.top, h), h), m)),
        };
      }
      function xe() {
        var e = be(
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
        );
        return (
          (N.width = e.width),
          (N.height = e.height),
          (N.left = e.left),
          (N.top = e.top),
          e
        );
      }
      function we() {
        if (!e) return null;
        var t = e.getBoundingClientRect();
        return be({
          width: t.width,
          height: t.height,
          left: t.left,
          top: t.top,
        });
      }
      function Se() {
        return ke.apply(this, arguments);
      }
      function ke() {
        return (ke = Oo(
          Eo().mark(function e() {
            var t;
            return Eo().wrap(
              function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      if ((t = we())) {
                        e.next = 3;
                        break;
                      }
                      return e.abrupt("return");
                    case 3:
                      return (
                        (N.width = t.width),
                        (N.height = t.height),
                        (N.left = t.left),
                        (N.top = t.top),
                        (e.prev = 7),
                        (e.next = 10),
                        chrome.storage.local.set(ko({}, u, t))
                      );
                    case 10:
                      e.next = 15;
                      break;
                    case 12:
                      ((e.prev = 12), (e.t0 = e.catch(7)));
                    case 15:
                    case "end":
                      return e.stop();
                  }
              },
              e,
              null,
              [[7, 12]],
            );
          }),
        )).apply(this, arguments);
      }
      function Te() {
        var e = (
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}
          ).immediate,
          t = void 0 !== e && e;
        (y && (clearTimeout(y), (y = null)),
          t
            ? Se()
            : (y = setTimeout(function () {
                ((y = null), Se());
              }, 250)));
      }
      function _e() {
        if (e) {
          var t = "light" !== N.theme;
          (e.style.setProperty(
            "--bh-resize-grip-color",
            t ? "rgba(255,255,255,0.58)" : "rgba(0,0,0,0.46)",
          ),
            e.style.setProperty(
              "--bh-resize-tooltip-bg",
              t ? "rgba(24,24,27,0.96)" : "rgba(255,255,255,0.98)",
            ),
            e.style.setProperty(
              "--bh-resize-tooltip-border",
              t ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.12)",
            ),
            e.style.setProperty(
              "--bh-resize-tooltip-color",
              t ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.82)",
            ));
        }
      }
      function Ce() {
        var e = (
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}
          ).markSeen,
          t = void 0 !== e && e;
        if ((v && (clearTimeout(v), (v = null)), m)) {
          m.classList.remove("bh-visible");
          var n = m;
          ((m = null),
            setTimeout(function () {
              n.parentNode && n.parentNode.removeChild(n);
            }, 220));
        }
        if (t)
          try {
            var r = chrome.storage.local.set(ko({}, d, !0));
            r && "function" == typeof r.catch && r.catch(function (e) {});
          } catch (e) {}
      }
      function Ee() {
        return Pe.apply(this, arguments);
      }
      function Pe() {
        return (Pe = Oo(
          Eo().mark(function t() {
            return Eo().wrap(
              function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      if (e && !m) {
                        t.next = 2;
                        break;
                      }
                      return t.abrupt("return");
                    case 2:
                      if (!w && "overlay" === se) {
                        t.next = 4;
                        break;
                      }
                      return t.abrupt("return");
                    case 4:
                      return (
                        (t.prev = 4),
                        (t.next = 7),
                        chrome.storage.local.get([d])
                      );
                    case 7:
                      if (!t.sent[d]) {
                        t.next = 10;
                        break;
                      }
                      return t.abrupt("return");
                    case 10:
                      t.next = 15;
                      break;
                    case 12:
                      ((t.prev = 12), (t.t0 = t.catch(4)));
                    case 15:
                      if (e && !m) {
                        t.next = 17;
                        break;
                      }
                      return t.abrupt("return");
                    case 17:
                      (((m = document.createElement("div")).className =
                        "bh-resize-tooltip"),
                        (m.textContent = Lo(
                          "overlay.resizeTooltip",
                          "Drag this corner to resize",
                        )),
                        e.appendChild(m),
                        requestAnimationFrame(function () {
                          m && m.classList.add("bh-visible");
                        }),
                        (v = setTimeout(function () {
                          Ce({ markSeen: !0 });
                        }, 5200)));
                    case 23:
                    case "end":
                      return t.stop();
                  }
              },
              t,
              null,
              [[4, 12]],
            );
          }),
        )).apply(this, arguments);
      }
      function Oe() {
        var e =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1200;
        R = performance.now() + e;
      }
      function Me() {
        h &&
          (ne
            ? ((h.textContent =
                "● " + Lo("overlay.followVoice", "Follow Voice")),
              (h.title = Lo(
                "overlay.followVoiceTooltip",
                "Follow the current TTS voice",
              )),
              (h.style.width = "auto"),
              (h.style.minWidth = "130px"),
              (h.style.height = "32px"),
              (h.style.borderRadius = "999px"),
              (h.style.padding = "0 12px"),
              (h.style.fontSize = "12px"),
              (h.style.fontWeight = "600"),
              (h.style.letterSpacing = "0.2px"),
              (h.style.whiteSpace = "nowrap"))
            : ((h.textContent = "↓"),
              (h.title = Lo("overlay.scrollToBottom", "Scroll to bottom")),
              (h.style.width = "40px"),
              (h.style.minWidth = "40px"),
              (h.style.height = "40px"),
              (h.style.borderRadius = "50%"),
              (h.style.padding = "0"),
              (h.style.fontSize = "20px"),
              (h.style.fontWeight = "600"),
              (h.style.letterSpacing = "normal"),
              (h.style.whiteSpace = "normal")));
      }
      function Le() {
        if (h) {
          var e = ne ? !oe : I;
          h.style.display = e ? "flex" : "none";
        }
      }
      function ze() {
        return (
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement ||
          document.documentElement
        );
      }
      function Ne() {
        if (k && T) {
          var e = (function (e) {
              var t =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : {};
              switch (e) {
                case "connecting":
                  return {
                    label: Lo("dock.connecting", "Connecting..."),
                    color: "rgba(251,191,36,1)",
                    pulse: !0,
                  };
                case "connected":
                  return {
                    label: Lo("overlay.translating", "Translating"),
                    color: "rgba(34,197,94,1)",
                    pulse: !1,
                  };
                case "reconnecting":
                  var n = t.attempt || 0;
                  return {
                    label: n > 0 ? "Reconnecting #".concat(n) : "Reconnecting",
                    color: "rgba(249,115,22,1)",
                    pulse: !0,
                  };
                case "error":
                  return {
                    label: Lo("dock.error", "Error"),
                    color: "rgba(239,68,68,1)",
                    pulse: !1,
                  };
                case "disconnected":
                  return {
                    label: Lo("overlay.stopped", "Stopped"),
                    color: "rgba(150,150,150,0.7)",
                    pulse: !1,
                  };
                default:
                  return {
                    label: U
                      ? Lo("overlay.translating", "Translating")
                      : Lo("dock.ready", "Ready"),
                    color: U ? "rgba(34,197,94,1)" : "rgba(150,150,150,0.7)",
                    pulse: !1,
                  };
              }
            })(L, z),
            t = e.label,
            n = e.color,
            r = e.pulse;
          ((k.style.background = n),
            (k.style.boxShadow =
              "disconnected" === L ? "none" : "0 0 8px ".concat(n)),
            (k.style.animation = r
              ? "pulse 1.4s ease-in-out infinite"
              : "none"),
            (T.textContent = t));
        }
      }
      function Ae() {
        if (S) {
          var e = ce[N.theme] || ce.dark,
            t = S.querySelector(".bh-collapsed-expand-btn");
          ((S.style.background = e.topBarBg),
            (S.style.border = "1px solid ".concat(e.topBarBorder)),
            (S.style.color = e.textPrimary),
            T && (T.style.color = e.textPrimary),
            t && (t.style.color = e.textSecondary));
        }
      }
      function De(e, t) {
        if (!S) return { left: e, top: t };
        var n = S.getBoundingClientRect(),
          r = 12,
          o = Math.max(r, window.innerWidth - n.width - r),
          a = Math.max(r, window.innerHeight - n.height - r);
        return {
          left: Math.min(Math.max(r, e), o),
          top: Math.min(Math.max(r, t), a),
        };
      }
      function Ve() {
        if (S && S.parentNode) {
          var e = S.getBoundingClientRect();
          if (e.width && e.height) {
            var t = De(e.left, e.top);
            (Math.abs(t.left - e.left) > 1 || Math.abs(t.top - e.top) > 1) &&
              ((S.style.left = "".concat(t.left, "px")),
              (S.style.top = "".concat(t.top, "px")),
              (S.style.transform = "none"));
          }
        }
      }
      function Be(e) {
        if (
          S &&
          0 === e.button &&
          !e.target.closest(".bh-collapsed-expand-btn")
        ) {
          var t = S.getBoundingClientRect();
          ((_ = !0),
            (O = !1),
            (P = { x: e.clientX, y: e.clientY }),
            (E = { x: e.clientX - t.left, y: e.clientY - t.top }),
            (S.style.left = "".concat(t.left, "px")),
            (S.style.top = "".concat(t.top, "px")),
            (S.style.transform = "none"),
            (S.style.cursor = "grabbing"),
            e.preventDefault());
        }
      }
      function je(e) {
        if (_ && S) {
          var t = e.clientX - P.x,
            n = e.clientY - P.y;
          if ((Math.hypot(t, n) > 3 && ((O = !0), (C = !0)), O)) {
            var r = De(e.clientX - E.x, e.clientY - E.y);
            ((S.style.left = "".concat(r.left, "px")),
              (S.style.top = "".concat(r.top, "px")),
              (S.style.transform = "none"),
              e.preventDefault());
          }
        }
      }
      function Ie() {
        _ &&
          ((_ = !1),
          S && ((S.style.cursor = "grab"), Ve()),
          setTimeout(function () {
            O = !1;
          }, 0));
      }
      function Re() {
        if ((Qe(), S)) return S;
        (((S = document.createElement("div")).id = "bh-collapsed-pill"),
          (S.style.cssText =
            '\n      position: fixed;\n      top: 16px;\n      left: 50%;\n      transform: translateX(-50%);\n      display: flex;\n      align-items: center;\n      gap: 10px;\n      min-height: 38px;\n      max-width: calc(100vw - 32px);\n      padding: 5px 6px 5px 12px;\n      border-radius: 999px;\n      box-shadow: 0 4px 24px rgba(0,0,0,0.3);\n      backdrop-filter: blur(20px);\n      z-index: 2147483647;\n      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n      user-select: none;\n      pointer-events: auto;\n      cursor: grab;\n      animation: bh-fade-in 0.2s ease;\n    '),
          ((k = document.createElement("span")).style.cssText =
            "\n      width: 8px;\n      height: 8px;\n      border-radius: 50%;\n      flex: 0 0 auto;\n      transition: all 0.2s ease;\n    "),
          ((T = document.createElement("span")).style.cssText =
            "\n      min-width: 0;\n      overflow: hidden;\n      text-overflow: ellipsis;\n      white-space: nowrap;\n      font-size: 12px;\n      font-weight: 600;\n      line-height: 1;\n    "));
        var e = document.createElement("button");
        return (
          (e.className = "bh-collapsed-expand-btn"),
          (e.innerHTML = Dr.expand),
          (e.title = Lo("dock.expand", "Expand")),
          (e.style.cssText =
            "\n      width: 28px;\n      height: 28px;\n      border: none;\n      border-radius: 50%;\n      background: transparent;\n      cursor: pointer;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      padding: 0;\n      flex: 0 0 auto;\n      transition: background 0.15s ease, color 0.15s ease;\n    "),
          (e.onmouseenter = function () {
            var t = ce[N.theme] || ce.dark;
            ((e.style.background = t.buttonHoverBg),
              (e.style.color = t.textPrimary));
          }),
          (e.onmouseleave = function () {
            var t = ce[N.theme] || ce.dark;
            ((e.style.background = "transparent"),
              (e.style.color = t.textSecondary));
          }),
          (e.onclick = function (e) {
            (e.stopPropagation(), Ye());
          }),
          (S.onmousedown = Be),
          M ||
            ((M = !0),
            document.addEventListener("mousemove", je),
            document.addEventListener("mouseup", Ie),
            window.addEventListener("resize", Ve)),
          (S.onclick = function (e) {
            O ? e.stopPropagation() : Ye();
          }),
          S.appendChild(k),
          S.appendChild(T),
          S.appendChild(e),
          Ae(),
          Ne(),
          S
        );
      }
      function Fe() {
        var e = (
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}
          ).anchorRect,
          t = void 0 === e ? null : e,
          n = Re(),
          r = ze();
        (n.parentNode !== r && r.appendChild(n),
          (n.style.display = "flex"),
          !C && t
            ? (function (e) {
                if (!S || !e) return !1;
                var t = S.getBoundingClientRect();
                if (!t.width || !t.height) return !1;
                var n = De(
                  e.left + e.width / 2 - t.width / 2,
                  e.top + e.height / 2 - t.height / 2,
                );
                ((S.style.left = "".concat(n.left, "px")),
                  (S.style.top = "".concat(n.top, "px")),
                  (S.style.transform = "none"));
              })(t)
            : C ||
              ((n.style.left = "50%"),
              (n.style.top = "16px"),
              (n.style.transform = "translateX(-50%)")),
          Ae(),
          Ne(),
          requestAnimationFrame(function () {
            Ve();
          }));
      }
      function qe() {
        S && S.parentNode && S.parentNode.removeChild(S);
      }
      function He() {
        if (
          (Ce(),
          e && (e.style.display = "none"),
          le && le.hide(),
          o && ((o.style.display = "none"), (Z = !1)),
          Y && (clearTimeout(Y), (Y = null)),
          x)
        )
          if (x.collapse) x.collapse();
          else if (x.getElement) {
            var t = x.getElement();
            t && (t.style.display = "none");
          }
      }
      function Ue() {
        w && (He(), Fe());
      }
      function We() {
        if (K && !w) {
          var e = (function () {
            if (!x || !x.getElement) return null;
            var e = x.getElement();
            if (!e) return null;
            var t = e.getBoundingClientRect();
            return t.width && t.height
              ? { left: t.left, top: t.top, width: t.width, height: t.height }
              : null;
          })();
          ((w = !0), He(), Fe({ anchorRect: e }));
        }
      }
      function Ye() {
        w &&
          ((w = !1),
          qe(),
          x ? x.show() : nt().show(),
          It(),
          ct(L, z),
          Ge(),
          requestAnimationFrame(function () {
            "overlay" === se &&
              n &&
              (ne && oe && null != ee
                ? ht(ee, { behavior: "auto", force: !0 })
                : I || (n.scrollTop = n.scrollHeight));
          }));
      }
      function Ge() {
        var t = ze();
        document.documentElement;
        if (e && e.parentNode !== t)
          try {
            t.appendChild(e);
          } catch (e) {}
        if (x && x.getElement) {
          var n = x.getElement();
          if (n && n.parentNode !== t)
            try {
              t.appendChild(n);
            } catch (e) {}
        }
        if (le && le.getElement) {
          var r = le.getElement();
          if (r && r.parentNode !== t)
            try {
              t.appendChild(r);
            } catch (e) {}
        }
        if (w && S && S.parentNode !== t)
          try {
            t.appendChild(S);
          } catch (e) {}
        Ve();
      }
      function Xe() {
        return Ke.apply(this, arguments);
      }
      function Ke() {
        return (Ke = Oo(
          Eo().mark(function e() {
            var t, n;
            return Eo().wrap(
              function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return (
                        (e.prev = 0),
                        (e.next = 3),
                        chrome.storage.sync.get(["overlaySettings"])
                      );
                    case 3:
                      return (
                        (t = e.sent).overlaySettings &&
                          (N = Object.assign(N, t.overlaySettings)),
                        (ne = !!N.ttsEnabled),
                        (N.subtitleMode = ve(N.subtitleMode)),
                        (se = N.subtitleMode),
                        (e.next = 10),
                        chrome.storage.local.get([
                          "ttsVoice",
                          "ttsVoiceId",
                          "ttsVoiceDisplayName",
                          "ttsLanguage",
                          "audioDuckingEnabled",
                          u,
                        ])
                      );
                    case 10:
                      ((n = e.sent).ttsVoice && (N.ttsVoice = n.ttsVoice),
                        n.ttsVoiceId && (N.ttsVoiceId = n.ttsVoiceId),
                        n.ttsVoiceDisplayName &&
                          (N.ttsVoiceDisplayName = n.ttsVoiceDisplayName),
                        n.ttsLanguage && (N.ttsLanguage = n.ttsLanguage),
                        Object.prototype.hasOwnProperty.call(
                          n,
                          "audioDuckingEnabled",
                        ) && (N.audioDuckingEnabled = !!n.audioDuckingEnabled),
                        xe(
                          So({ width: N.width, height: N.height }, n[u] || {}),
                        ),
                        Me(),
                        Le(),
                        (e.next = 24));
                      break;
                    case 21:
                      ((e.prev = 21), (e.t0 = e.catch(0)));
                    case 24:
                    case "end":
                      return e.stop();
                  }
              },
              e,
              null,
              [[0, 21]],
            );
          }),
        )).apply(this, arguments);
      }
      function Ze() {
        return Je.apply(this, arguments);
      }
      function Je() {
        return (Je = Oo(
          Eo().mark(function e() {
            var t;
            return Eo().wrap(
              function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return (
                        (e.prev = 0),
                        (e.next = 3),
                        chrome.storage.local.get(["audioDuckingEnabled"])
                      );
                    case 3:
                      ((t = e.sent),
                        Object.prototype.hasOwnProperty.call(
                          t,
                          "audioDuckingEnabled",
                        ) && (N.audioDuckingEnabled = !!t.audioDuckingEnabled),
                        (e.next = 10));
                      break;
                    case 7:
                      ((e.prev = 7), (e.t0 = e.catch(0)));
                    case 10:
                    case "end":
                      return e.stop();
                  }
              },
              e,
              null,
              [[0, 7]],
            );
          }),
        )).apply(this, arguments);
      }
      function $e() {
        try {
          chrome.runtime.sendMessage({
            type: "audioSettings",
            setting: "audioDuckingEnabled",
            value: !1 !== N.audioDuckingEnabled,
          });
        } catch (e) {}
      }
      function Qe() {
        var e =
            '\n      /* Spinner 动画 */\n      @keyframes spin {\n        to { transform: rotate(360deg); }\n      }\n\n      /* 脉冲动画（用于连接中状态） */\n      @keyframes pulse {\n        0%, 100% { opacity: 1; transform: scale(1); }\n        50% { opacity: 0.6; transform: scale(1.2); }\n      }\n\n      /* 淡入动画 */\n      @keyframes fadeIn {\n        from { opacity: 0; transform: translateY(-8px); }\n        to { opacity: 1; transform: translateY(0); }\n      }\n\n      /* TTS 指示器波形动画 */\n      @keyframes ttsWave {\n        0%, 100% { transform: scaleY(0.6); opacity: 0.6; }\n        50% { transform: scaleY(1.2); opacity: 1; }\n      }\n\n      /* 双语切换：用 CSS order 控制视觉顺序，避免 DOM 操作 */\n      .bh-caption-line-group {\n        display: flex !important;\n        flex-direction: column !important;\n      }\n      .bh-caption-line-group.bh-swapped .bh-caption-translate {\n        order: 2 !important;\n      }\n      .bh-caption-line-group.bh-swapped .bh-caption-original {\n        order: 1 !important;\n      }\n\n      /* 间距控制：默认译文在上，原文在下有间距 */\n      .bh-caption-translate {\n        margin-top: 0 !important;\n      }\n      .bh-caption-original {\n        margin-top: 6px !important;\n      }\n      /* swapped 模式：原文在上，译文在下有间距 */\n      .bh-caption-line-group.bh-swapped .bh-caption-translate {\n        margin-top: 6px !important;\n      }\n      .bh-caption-line-group.bh-swapped .bh-caption-original {\n        margin-top: 0 !important;\n      }\n\n      /* TTS 焦点高亮：仅提升文字与柔光 */\n      .bh-caption-line-group.bh-tts-speaking::before {\n        content: "";\n        position: absolute;\n        left: 6px;\n        right: 6px;\n        top: 6px;\n        bottom: 6px;\n        border-radius: 8px;\n        background: radial-gradient(\n          circle at 20% 50%,\n          rgba(129, 140, 248, 0.35),\n          rgba(129, 140, 248, 0)\n        );\n        filter: blur(10px);\n        opacity: 0.18;\n        pointer-events: none;\n        z-index: 0;\n      }\n\n      .bh-caption-line-group.bh-tts-speaking .bh-caption-translate {\n        font-weight: 700 !important;\n        color: rgba(255, 255, 255, 0.98) !important;\n        text-shadow: 0 0 10px rgba(129, 140, 248, 0.35);\n        opacity: 1 !important;\n      }\n\n      .bh-caption-line-group.bh-tts-speaking .bh-caption-original {\n        font-weight: 600 !important;\n        opacity: 0.85 !important;\n      }\n\n      .bh-light-theme .bh-caption-line-group.bh-tts-speaking .bh-caption-translate {\n        color: rgba(0, 0, 0, 0.95) !important;\n        text-shadow: 0 0 8px rgba(129, 140, 248, 0.25);\n      }\n\n      .bh-caption-line-group.bh-tts-past .bh-caption-translate,\n      .bh-caption-line-group.bh-tts-past .bh-caption-original {\n        opacity: 0.45 !important;\n      }\n\n      .bh-caption-line-group.bh-tts-future .bh-caption-translate,\n      .bh-caption-line-group.bh-tts-future .bh-caption-original {\n        opacity: 0.65 !important;\n      }\n\n      .bh-caption-line-group.bh-tts-future {\n        font-size: 0.98em;\n      }\n\n      /* TTS 音频指示器 */\n      .bh-tts-indicator {\n        position: absolute;\n        display: inline-flex;\n        align-items: flex-end;\n        gap: 2px;\n        height: 12px;\n        opacity: 0;\n        transform: scale(0.9);\n        transition: opacity 0.2s ease, transform 0.2s ease;\n        z-index: 1;\n        pointer-events: none;\n      }\n\n      .bh-tts-indicator span {\n        width: 2px;\n        height: 6px;\n        background: rgba(99, 102, 241, 0.9);\n        border-radius: 2px;\n        transform-origin: bottom center;\n        animation: ttsWave 0.8s ease-in-out infinite;\n      }\n\n      .bh-tts-indicator span:nth-child(2) {\n        height: 9px;\n        animation-delay: 0.1s;\n      }\n\n      .bh-tts-indicator span:nth-child(3) {\n        height: 7px;\n        animation-delay: 0.2s;\n      }\n\n      .bh-caption-line-group.bh-tts-speaking .bh-tts-indicator {\n        opacity: 1;\n        transform: scale(1);\n      }\n\n      .bh-caption-line-group .bh-caption-translate,\n      .bh-caption-line-group .bh-caption-original {\n        position: relative;\n        z-index: 2;\n      }\n\n      .bh-resize-se {\n        width: 28px !important;\n        height: 28px !important;\n        right: 0 !important;\n        bottom: 0 !important;\n        z-index: 24 !important;\n        border-radius: 0 0 10px 0;\n      }\n\n      .bh-resize-se::before {\n        content: none;\n      }\n\n      .bh-resize-se::after {\n        content: "";\n        position: absolute;\n        right: 8px;\n        bottom: 8px;\n        width: 10px;\n        height: 10px;\n        border-right: 1px solid var(--bh-resize-grip-color, rgba(255,255,255,0.58));\n        border-bottom: 1px solid var(--bh-resize-grip-color, rgba(255,255,255,0.58));\n        border-radius: 0 0 3px 0;\n        opacity: 0.34;\n        pointer-events: none;\n        transition: opacity 0.18s ease;\n      }\n\n      .bh-resize-se:hover::after {\n        opacity: 0.62;\n      }\n\n      .bh-resize-tooltip {\n        position: absolute;\n        right: 24px;\n        bottom: 26px;\n        padding: 7px 10px;\n        border-radius: 6px;\n        background: var(--bh-resize-tooltip-bg, rgba(24,24,27,0.96));\n        border: 1px solid var(--bh-resize-tooltip-border, rgba(255,255,255,0.14));\n        color: var(--bh-resize-tooltip-color, rgba(255,255,255,0.92));\n        box-shadow: 0 8px 24px rgba(0,0,0,0.28);\n        font-size: 12px;\n        font-weight: 600;\n        line-height: 1.2;\n        white-space: nowrap;\n        pointer-events: none;\n        opacity: 0;\n        transform: translateY(4px);\n        transition: opacity 0.2s ease, transform 0.2s ease;\n        z-index: 26;\n      }\n\n      .bh-resize-tooltip.bh-visible {\n        opacity: 1;\n        transform: translateY(0);\n      }\n\n      /* 滑块样式优化 */\n      input[type="range"].bh-slider {\n        -webkit-appearance: none;\n        appearance: none;\n        width: 100%;\n        height: 6px;\n        border-radius: 3px;\n        background: rgba(255,255,255,0.1);\n        outline: none;\n        cursor: pointer;\n      }\n\n      /* 滑块滑动条 */\n      input[type="range"].bh-slider::-webkit-slider-thumb {\n        -webkit-appearance: none;\n        appearance: none;\n        width: 16px;\n        height: 16px;\n        border-radius: 50%;\n        background: rgba(99,102,241,0.9);\n        cursor: pointer;\n        transition: background 0.2s, transform 0.2s;\n        margin-top: -5px; /* 垂直居中：(16px - 6px) / 2 = 5px */\n      }\n\n      input[type="range"].bh-slider::-webkit-slider-thumb:hover {\n        background: rgba(99,102,241,1);\n        transform: scale(1.2);\n      }\n\n      input[type="range"].bh-slider::-moz-range-thumb {\n        width: 16px;\n        height: 16px;\n        border-radius: 50%;\n        background: rgba(99,102,241,0.9);\n        cursor: pointer;\n        border: none;\n        transition: background 0.2s, transform 0.2s;\n      }\n\n      input[type="range"].bh-slider::-moz-range-thumb:hover {\n        background: rgba(99,102,241,1);\n        transform: scale(1.2);\n      }\n\n      /* 滑块轨道进度（已滑动部分） */\n      input[type="range"].bh-slider::-webkit-slider-runnable-track {\n        height: 6px;\n        border-radius: 3px;\n      }\n\n      input[type="range"].bh-slider::-moz-range-track {\n        height: 6px;\n        border-radius: 3px;\n        background: rgba(255,255,255,0.1);\n      }\n\n      input[type="range"].bh-slider::-moz-range-progress {\n        height: 6px;\n        border-radius: 3px;\n        background: rgba(99,102,241,0.6);\n      }\n    ',
          t = document.getElementById("bh-overlay-styles");
        (t ||
          (((t = document.createElement("style")).id = "bh-overlay-styles"),
          document.head.appendChild(t)),
          t.textContent !== e && (t.textContent = e));
      }
      function et() {
        if ((Qe(), e && document.body.contains(e))) return e;
        var i = document.getElementById(a);
        if (i) {
          ((t = (e = i).querySelector(".bh-caption-topbar")),
            (n = e.querySelector(".bh-caption-wrapper")),
            (r = e.querySelector(".bh-caption-lines")),
            (h = e.querySelector(".bh-scroll-to-bottom")),
            (f = {
              n: e.querySelector(".bh-resize-n"),
              e: e.querySelector(".bh-resize-e"),
              s: e.querySelector(".bh-resize-s"),
              w: e.querySelector(".bh-resize-w"),
              ne: e.querySelector(".bh-resize-ne"),
              se: e.querySelector(".bh-resize-se"),
              sw: e.querySelector(".bh-resize-sw"),
              nw: e.querySelector(".bh-resize-nw"),
            }),
            o || (o = document.querySelector(".bh-settings-panel")),
            (G = e.querySelector(".bh-status-dot")),
            (X = e.querySelector(".bh-status-text")),
            (m = e.querySelector(".bh-resize-tooltip")),
            _e(),
            Ee());
          var s = e.querySelector(".bh-bilingual-mode-btn");
          s && s.updateStyle && s.updateStyle();
          var l = e.querySelector(".bh-translation-only-btn");
          l && l.updateStyle && l.updateStyle();
          var c = e.querySelector(".bh-swap-order-btn");
          return (
            c && (c.style.display = N.showBilingual ? "flex" : "none"),
            Me(),
            Le(),
            e
          );
        }
        var u = xe(N),
          d = Number.isFinite(u.left) && Number.isFinite(u.top);
        (((e = document.createElement("div")).id = a),
          Object.assign(e.style, {
            position: "fixed",
            left: d ? u.left + "px" : "50%",
            top: d ? u.top + "px" : "50%",
            transform: d ? "none" : "translate(-50%, -50%)",
            width: u.width + "px",
            height: u.height + "px",
            background: "rgba("
              .concat(ce[N.theme].containerBg, ",")
              .concat(N.backgroundOpacity, ")"),
            color: ce[N.theme].textPrimary,
            borderRadius: "10px",
            zIndex: "2147483646",
            fontFamily:
              "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
            backdropFilter: "blur(10px)",
            overflow: "hidden",
          }),
          _e());
        var p = document.createElement("div");
        ((p.className = "bh-overlay-drag-handle"),
          (p.style.cssText =
            "\n      position: absolute;\n      top: 0;\n      left: 50%;\n      transform: translateX(-50%);\n      width: 100px;\n      height: 20px;\n      cursor: grab;\n      z-index: 20;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      opacity: 0;\n      transition: opacity 0.2s;\n    "));
        var g = document.createElement("div");
        ((g.className = "bh-overlay-drag-handle-bar"),
          (g.style.cssText =
            "\n      width: 48px;\n      height: 5px;\n      background: ".concat(
              "dark" === N.theme ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)",
              ";\n      border-radius: 2.5px;\n    ",
            )),
          p.appendChild(g),
          e.appendChild(p),
          e.addEventListener("mouseenter", function () {
            p.style.opacity = "1";
          }),
          e.addEventListener("mouseleave", function () {
            v || (p.style.opacity = "0");
          }));
        var v = !1,
          y = { x: 0, y: 0 };
        ((p.onmousedown = function (t) {
          (t.preventDefault(),
            t.stopPropagation(),
            (v = !0),
            (p.style.cursor = "grabbing"));
          var n = e.getBoundingClientRect();
          ((e.style.transform = "none"),
            (e.style.left = n.left + "px"),
            (e.style.top = n.top + "px"),
            (y.x = t.clientX - n.left),
            (y.y = t.clientY - n.top));
        }),
          window.addEventListener("mousemove", function (t) {
            if (v) {
              t.preventDefault();
              var n = t.clientX - y.x,
                r = t.clientY - y.y,
                o = e.getBoundingClientRect(),
                a = be({ width: o.width, height: o.height, left: n, top: r });
              ((e.style.left = a.left + "px"), (e.style.top = a.top + "px"));
            }
          }),
          window.addEventListener("mouseup", function () {
            v && ((v = !1), (p.style.cursor = "grab"), Te({ immediate: !0 }));
          }),
          ((t = document.createElement("div")).className = "bh-caption-topbar"),
          Object.assign(t.style, {
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            height: "40px",
            background: ce[N.theme].topBarBg,
            borderBottom: "1px solid ".concat(ce[N.theme].topBarBorder),
            borderRadius: "10px 10px 0 0",
            cursor: N.draggable ? "move" : "default",
            display: "none",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 12px",
            fontSize: "13px",
            fontWeight: "500",
            color: "rgba(255,255,255,0.9)",
            userSelect: "none",
            pointerEvents: "auto",
            gap: "8px",
            transition: "transform 0.3s ease, opacity 0.3s ease",
            transform: "translateY(0)",
            opacity: "1",
            zIndex: "10",
          }));
        var x = document.createElement("div");
        x.style.cssText =
          "\n      font-size: 12px;\n      font-weight: 600;\n      color: rgba(255,255,255,0.9);\n      flex-shrink: 0;\n      display: flex;\n      align-items: center;\n      gap: 6px;\n      flex: 1;\n      min-width: 0;\n    ";
        var w = document.createElement("span");
        w.textContent = "DubTab";
        var S = document.createElement("div");
        ((S.className = "bh-status-indicator"),
          (S.style.cssText =
            "\n      display: flex;\n      align-items: center;\n      gap: 6px;\n      font-size: 10px;\n      font-weight: 500;\n    "));
        var k = document.createElement("span");
        ((k.className = "bh-status-dot"),
          (k.style.cssText =
            "\n      width: 6px;\n      height: 6px;\n      border-radius: 50%;\n      background: rgba(100,100,100,0.5);\n      transition: all 0.3s ease;\n    "));
        var T = document.createElement("span");
        ((T.className = "bh-status-text"),
          (T.style.cssText =
            "\n      color: rgba(255,255,255,0.7);\n      display: none;\n    "),
          (T.textContent = ""),
          S.appendChild(k),
          S.appendChild(T),
          x.appendChild(w),
          x.appendChild(S),
          (G = k),
          (X = T));
        var _ = document.createElement("div");
        _.style.cssText =
          "\n      display: flex;\n      align-items: center;\n      gap: 8px;\n      flex: 0 0 auto;\n      justify-content: center;\n    ";
        var C = "Alt+Shift+S";
        (!(function () {
          try {
            chrome.runtime.sendMessage(
              { type: "getActiveShortcut" },
              function (e) {
                if (e && void 0 !== e.shortcut) {
                  C = e.shortcut;
                  var t = document.querySelector(".bh-stop-btn");
                  t && t.updateStyle && t.updateStyle();
                }
              },
            );
          } catch (e) {}
        })(),
          chrome.runtime.onMessage.addListener(function (e, t, n) {
            if ("toggle-capture-command" === e.type) {
              var r = document.querySelector(".bh-stop-btn");
              r && r.click();
            }
          }));
        var E = document.createElement("button");
        E.className = "bh-stop-btn";
        var P = function () {
          var e = ce[N.theme] || ce.dark,
            t = "\n        border: 1px solid "
              .concat(e.buttonBorder, ";\n        color: ")
              .concat(
                e.textPrimary,
                ";\n        padding: 4px 12px;\n        border-radius: 4px;\n        font-size: 12px;\n        font-weight: 500;\n        transition: all 0.2s;\n        pointer-events: auto;\n        display: flex;\n        align-items: center;\n        gap: 6px;\n      ",
              ),
            n = C ? " (".concat(C, ")") : "";
          if (W) {
            ((E.title = ""),
              (E.style.cssText =
                t +
                "\n          background: ".concat(
                  e.buttonHoverBg,
                  ";\n          cursor: wait;\n        ",
                )));
            var r =
                "dark" === N.theme
                  ? "rgba(255,255,255,0.3)"
                  : "rgba(0,0,0,0.3)",
              o =
                "dark" === N.theme
                  ? "rgba(255,255,255,0.9)"
                  : "rgba(0,0,0,0.9)";
            E.innerHTML =
              '\n          <span style="\n            display: inline-block;\n            width: 10px;\n            height: 10px;\n            border: 2px solid '
                .concat(r, ";\n            border-top-color: ")
                .concat(
                  o,
                  ';\n            border-radius: 50%;\n            animation: spin 0.6s linear infinite;\n          "></span>\n          <span>Stopping...</span>\n        ',
                );
          } else
            U
              ? ((E.title = "".concat(Lo("common.stop", "Stop")).concat(n)),
                (E.style.cssText =
                  t +
                  "\n          background: rgba(255,100,100,0.2);\n          border-color: rgba(255,100,100,0.4);\n          cursor: pointer;\n        "),
                (E.textContent = Lo("common.stop", "Stop")))
              : ((E.title = "".concat(Lo("common.start", "Start")).concat(n)),
                (E.style.cssText =
                  t +
                  "\n          background: rgba(100,200,100,0.2);\n          border-color: rgba(100,200,100,0.4);\n          cursor: pointer;\n        "),
                (E.textContent = Lo("common.start", "Start")));
        };
        ((E.updateStyle = P),
          P(),
          (E.onmouseenter = function () {
            W ||
              (E.style.background = U
                ? "rgba(255,100,100,0.3)"
                : "rgba(100,200,100,0.3)");
          }),
          (E.onmouseleave = function () {
            W ||
              (E.style.background = U
                ? "rgba(255,100,100,0.2)"
                : "rgba(100,200,100,0.2)");
          }),
          (E.onclick = (function () {
            var e = Oo(
              Eo().mark(function e(t) {
                var o;
                return Eo().wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          if ((t.stopPropagation(), !W)) {
                            e.next = 3;
                            break;
                          }
                          return e.abrupt("return");
                        case 3:
                          if (!U) {
                            e.next = 23;
                            break;
                          }
                          return (
                            (W = !0),
                            P(),
                            (e.prev = 6),
                            (e.next = 9),
                            chrome.runtime.sendMessage({
                              type: "offscreenStop",
                            })
                          );
                        case 9:
                          return (
                            (e.next = 11),
                            new Promise(function (e) {
                              return setTimeout(e, 800);
                            })
                          );
                        case 11:
                          e.next = 16;
                          break;
                        case 13:
                          ((e.prev = 13), (e.t0 = e.catch(6)));
                        case 16:
                          ((W = !1), (U = !1), P(), pt(), at(), (e.next = 31));
                          break;
                        case 23:
                          (r &&
                            r.children.length > 0 &&
                            (((o =
                              document.createElement("div")).style.cssText =
                              "\n            height: 1px;\n            background: linear-gradient(to right, transparent, rgba(100,200,100,0.5), transparent);\n            margin: 12px 0;\n          "),
                            r.appendChild(o),
                            (H = null),
                            n &&
                              !I &&
                              ((F = !0),
                              (q = performance.now() + 700),
                              n.scrollTo({
                                top: n.scrollHeight,
                                behavior: "smooth",
                              }),
                              setTimeout(function () {
                                F = !1;
                              }, 600))),
                            dt("start"),
                            (U = !0),
                            ct("connecting"),
                            P(),
                            It());
                          try {
                            chrome.runtime.sendMessage({
                              type: "startCapture",
                            });
                          } catch (e) {}
                        case 31:
                        case "end":
                          return e.stop();
                      }
                  },
                  e,
                  null,
                  [[6, 13]],
                );
              }),
            );
            return function (t) {
              return e.apply(this, arguments);
            };
          })()));
        var O = document.createElement("button");
        O.className = "bh-bilingual-mode-btn";
        var M = function () {
          var e = ce[N.theme] || ce.dark,
            t = N.showBilingual;
          ((O.style.cssText = "\n        background: "
            .concat(
              t ? "rgba(99,102,241,0.5)" : "rgba(100,100,100,0.08)",
              ";\n        border: 1px solid ",
            )
            .concat(
              t ? "rgba(99,102,241,0.6)" : e.buttonBorder,
              ";\n        color: ",
            )
            .concat(
              t ? "rgba(255,255,255,0.95)" : e.textSecondary,
              ";\n        padding: 4px 10px;\n        border-radius: 4px 0 0 4px;\n        cursor: pointer;\n        font-size: 11px;\n        font-weight: ",
            )
            .concat(
              t ? "600" : "500",
              ";\n        transition: all 0.2s;\n        pointer-events: auto;\n        border-right: none;\n        opacity: ",
            )
            .concat(t ? "1" : "0.7", ";\n      ")),
            (O.textContent = Lo("overlay.bilingualMode", "Both")));
        };
        ((O.updateStyle = M),
          (O.title = "Show both original and translation"),
          M(),
          (O.onmouseenter = function () {
            N.showBilingual ||
              ((O.style.opacity = "1"),
              (O.style.background = "rgba(100,100,100,0.15)"));
          }),
          (O.onmouseleave = function () {
            M();
          }),
          (O.onclick = (function () {
            var e = Oo(
              Eo().mark(function e(t) {
                return Eo().wrap(function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        if ((t.stopPropagation(), !N.showBilingual)) {
                          e.next = 3;
                          break;
                        }
                        return e.abrupt("return");
                      case 3:
                        return (
                          (N.showBilingual = !0),
                          M(),
                          z(),
                          Ct(),
                          n &&
                            ((F = !0),
                            (q = performance.now() + 700),
                            n.scrollTo({
                              top: n.scrollHeight,
                              behavior: "smooth",
                            }),
                            (I = !1),
                            Le(),
                            setTimeout(function () {
                              F = !1;
                            }, 600)),
                          (V.style.display = "flex"),
                          (e.next = 11),
                          Tt()
                        );
                      case 11:
                        "function" == typeof Ue && Ue();
                        try {
                          chrome.runtime.sendMessage({
                            type: "trackEvent",
                            eventName: "overlay_bilingual_mode_toggled",
                            properties: {
                              mode: "bilingual",
                              from: "overlay_ui",
                            },
                          });
                        } catch (e) {}
                      case 13:
                      case "end":
                        return e.stop();
                    }
                }, e);
              }),
            );
            return function (t) {
              return e.apply(this, arguments);
            };
          })()));
        var L = document.createElement("button");
        L.className = "bh-translation-only-btn";
        var z = function () {
          var e = ce[N.theme] || ce.dark,
            t = !N.showBilingual;
          ((L.style.cssText = "\n        background: "
            .concat(
              t ? "rgba(99,102,241,0.5)" : "rgba(100,100,100,0.08)",
              ";\n        border: 1px solid ",
            )
            .concat(
              t ? "rgba(99,102,241,0.6)" : e.buttonBorder,
              ";\n        color: ",
            )
            .concat(
              t ? "rgba(255,255,255,0.95)" : e.textSecondary,
              ";\n        padding: 4px 10px;\n        border-radius: 0 4px 4px 0;\n        cursor: pointer;\n        font-size: 11px;\n        font-weight: ",
            )
            .concat(
              t ? "600" : "500",
              ";\n        transition: all 0.2s;\n        pointer-events: auto;\n        opacity: ",
            )
            .concat(t ? "1" : "0.7", ";\n      ")),
            (L.textContent = Lo("overlay.translationOnly", "Translation")));
        };
        ((L.updateStyle = z),
          (L.title = "Show translation only"),
          z(),
          (L.onmouseenter = function () {
            N.showBilingual &&
              ((L.style.opacity = "1"),
              (L.style.background = "rgba(100,100,100,0.15)"));
          }),
          (L.onmouseleave = function () {
            z();
          }),
          (L.onclick = (function () {
            var e = Oo(
              Eo().mark(function e(t) {
                return Eo().wrap(function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        if ((t.stopPropagation(), N.showBilingual)) {
                          e.next = 3;
                          break;
                        }
                        return e.abrupt("return");
                      case 3:
                        return (
                          (N.showBilingual = !1),
                          M(),
                          z(),
                          Ct(),
                          n &&
                            ((F = !0),
                            (q = performance.now() + 700),
                            n.scrollTo({
                              top: n.scrollHeight,
                              behavior: "smooth",
                            }),
                            (I = !1),
                            Le(),
                            setTimeout(function () {
                              F = !1;
                            }, 600)),
                          (V.style.display = "none"),
                          (e.next = 11),
                          Tt()
                        );
                      case 11:
                        "function" == typeof Ue && Ue();
                        try {
                          chrome.runtime.sendMessage({
                            type: "trackEvent",
                            eventName: "overlay_bilingual_mode_toggled",
                            properties: {
                              mode: "translation_only",
                              from: "overlay_ui",
                            },
                          });
                        } catch (e) {}
                      case 13:
                      case "end":
                        return e.stop();
                    }
                }, e);
              }),
            );
            return function (t) {
              return e.apply(this, arguments);
            };
          })()));
        var V = document.createElement("button");
        V.className = "bh-swap-order-btn";
        var B = ce[N.theme] || ce.dark;
        ((V.style.cssText = "\n      background: "
          .concat(B.buttonBg, ";\n      border: 1px solid ")
          .concat(B.buttonBorder, ";\n      color: ")
          .concat(
            B.textPrimary,
            ";\n      padding: 4px 12px;\n      border-radius: 4px;\n      cursor: pointer;\n      font-size: 12px;\n      font-weight: 500;\n      transition: all 0.2s;\n      pointer-events: auto;\n      display: ",
          )
          .concat(
            N.showBilingual ? "flex" : "none",
            ";\n      align-items: center;\n      justify-content: center;\n    ",
          )),
          (V.innerHTML = "⇅"),
          (V.title = "Swap language order"),
          (V.onmouseenter = function () {
            var e = ce[N.theme] || ce.dark;
            V.style.background = e.buttonHoverBg;
          }),
          (V.onmouseleave = function () {
            var e = ce[N.theme] || ce.dark;
            V.style.background = e.buttonBg;
          }),
          (V.onclick = (function () {
            var e = Oo(
              Eo().mark(function e(t) {
                return Eo().wrap(function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        return (
                          t.stopPropagation(),
                          (N.swapLanguageOrder = !N.swapLanguageOrder),
                          Et(),
                          (e.next = 5),
                          Tt()
                        );
                      case 5:
                        "function" == typeof Ue && Ue();
                      case 6:
                      case "end":
                        return e.stop();
                    }
                }, e);
              }),
            );
            return function (t) {
              return e.apply(this, arguments);
            };
          })()));
        var j = document.createElement("div");
        j.style.cssText =
          "\n      display: flex;\n      align-items: center;\n      gap: 8px;\n      flex: 1;\n      justify-content: flex-end;\n      min-width: 0;\n    ";
        var K = document.createElement("button");
        K.className = "bh-settings-btn";
        var J = ce[N.theme] || ce.dark;
        ((K.style.cssText =
          "\n      background: transparent;\n      border: none;\n      color: ".concat(
            J.textSecondary,
            ";\n      cursor: pointer;\n      font-size: 18px;\n      padding: 4px;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      transition: all 0.2s;\n      pointer-events: auto;\n    ",
          )),
          (K.innerHTML = "⚙️"),
          (K.onmouseenter = function () {
            var e = ce[N.theme] || ce.dark;
            K.style.color = e.textPrimary;
          }),
          (K.onmouseleave = function () {
            var e = ce[N.theme] || ce.dark;
            K.style.color = e.textSecondary;
          }),
          (K.onclick = function (e) {
            e.stopPropagation();
            var t = "none" === o.style.display;
            (t
              ? (b || ae(), (o.style.display = "block"), (Z = !0))
              : ((o.style.display = "none"), (Z = !1)),
              t && "function" == typeof Ue && Ue());
          }));
        var $ = document.createElement("button");
        $.className = "bh-close-btn";
        var Q = ce[N.theme] || ce.dark;
        (($.style.cssText =
          "\n      background: transparent;\n      border: none;\n      color: ".concat(
            Q.textSecondary,
            ";\n      cursor: pointer;\n      font-size: 18px;\n      padding: 4px;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      transition: all 0.2s;\n      pointer-events: auto;\n    ",
          )),
          ($.innerHTML = "✕"),
          ($.onmouseenter = function () {
            $.style.color = "rgba(255,100,100,1)";
          }),
          ($.onmouseleave = function () {
            var e = ce[N.theme] || ce.dark;
            $.style.color = e.textSecondary;
          }),
          ($.onclick = function (e) {
            (e.stopPropagation(), lt());
            try {
              chrome.runtime.sendMessage({ type: "offscreenStop" });
            } catch (e) {}
          }));
        var te = document.createElement("div");
        ((te.className = "bh-bilingual-btn-group"),
          (te.style.cssText =
            "\n      display: flex;\n      align-items: center;\n      gap: 0;\n    "),
          te.appendChild(O),
          te.appendChild(L),
          _.appendChild(E),
          _.appendChild(te),
          _.appendChild(V),
          j.appendChild(K),
          j.appendChild($),
          t.appendChild(x),
          t.appendChild(_),
          t.appendChild(j),
          ((n = document.createElement("div")).className =
            "bh-caption-wrapper"),
          Object.assign(n.style, {
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            overflowY: "auto",
            overflowX: "hidden",
            padding: "16px",
            paddingTop: "16px",
            fontSize: N.overlayFontSize + "px",
            scrollBehavior: "smooth",
            cursor: "text",
            pointerEvents: "auto",
            borderRadius: "10px",
          }),
          ((r = document.createElement("div")).className = "bh-caption-lines"),
          Object.assign(r.style, {
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }),
          n.appendChild(r),
          ((h = document.createElement("button")).className =
            "bh-scroll-to-bottom"),
          (h.style.cssText =
            "\n      position: absolute;\n      right: 28px;\n      bottom: 24px;\n      width: 40px;\n      height: 40px;\n      background: rgba(99,102,241,0.9);\n      border: none;\n      border-radius: 50%;\n      cursor: pointer;\n      display: none;\n      align-items: center;\n      justify-content: center;\n      box-shadow: 0 4px 12px rgba(0,0,0,0.3);\n      transition: all 0.3s ease;\n      z-index: 20;\n      pointer-events: auto;\n      font-size: 20px;\n      color: white;\n    "),
          Me(),
          (h.onmouseenter = function () {
            ((h.style.background = "rgba(99,102,241,1)"),
              (h.style.transform = "scale(1.1)"));
          }),
          (h.onmouseleave = function () {
            ((h.style.background = "rgba(99,102,241,0.9)"),
              (h.style.transform = "scale(1)"));
          }),
          (h.onclick = function (e) {
            if ((e.stopPropagation(), ne)) {
              ((oe = !0), (I = !1), (R = 0));
              var t = null != ee ? ee : ie;
              return (
                null != t
                  ? ((q = performance.now() + 700),
                    ht(t, { behavior: "auto", force: !0 }),
                    null != ee && ft())
                  : n &&
                    ((F = !0),
                    (q = performance.now() + 700),
                    n.scrollTo({ top: n.scrollHeight, behavior: "smooth" }),
                    setTimeout(function () {
                      F = !1;
                    }, 600)),
                void Le()
              );
            }
            ((F = !0),
              (q = performance.now() + 700),
              n && n.scrollTo({ top: n.scrollHeight, behavior: "smooth" }),
              (I = !1),
              Le(),
              setTimeout(function () {
                F = !1;
              }, 600));
          }),
          Le(),
          e.appendChild(h),
          ((o = document.createElement("div")).className =
            "bh-settings-panel"));
        var re = ce[N.theme] || ce.dark;
        function ae() {
          if (e && o) {
            var t = e.getBoundingClientRect(),
              n = t.left + t.width / 2,
              r = t.top + t.height / 2;
            ((o.style.left = n + "px"),
              (o.style.top = r + "px"),
              (o.style.transform = "translate(-50%, -50%)"));
          }
        }
        o.style.cssText =
          "\n      position: fixed;\n      /* 初始位置由函数按 overlay 中心定位 */\n      top: 0;\n      left: 0;\n      transform: none;\n      width: 300px;\n      max-height: 70vh;\n      overflow-y: auto;\n      background: ".concat(
            re.settingsPanelBg,
            ";\n      border-radius: 12px;\n      padding: 20px;\n      box-shadow: 0 8px 32px rgba(0,0,0,0.8);\n      display: none;\n      z-index: 2147483647;\n      pointer-events: auto;\n    ",
          );
        var se = document.createElement("div");
        ((se.className = "bh-settings-drag-handle"),
          (se.style.cssText =
            "\n      position: absolute;\n      top: 0;\n      left: 50%;\n      transform: translateX(-50%);\n      width: 60px;\n      height: 6px;\n      background: ".concat(
              "dark" === N.theme ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
              ";\n      border-radius: 0 0 3px 3px;\n      cursor: grab;\n      transition: all 0.2s;\n      opacity: 0;\n      z-index: 10;\n    ",
            )),
          o.addEventListener("mouseenter", function () {
            se.style.opacity = "1";
          }),
          o.addEventListener("mouseleave", function () {
            ge || (se.style.opacity = "0");
          }));
        var ue = document.createElement("div");
        ue.style.cssText =
          "\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      margin-bottom: 20px;\n      margin-top: 8px;\n    ";
        var de = document.createElement("div");
        ((de.className = "bh-settings-title"),
          (de.style.cssText =
            "\n      font-size: 16px;\n      font-weight: 600;\n      color: ".concat(
              "dark" === N.theme ? "rgba(255,255,255,0.95)" : re.textPrimary,
              ";\n      flex: 1;\n    ",
            )),
          (de.textContent = Lo("overlay.settings", "Settings")));
        var pe = document.createElement("button");
        ((pe.style.cssText =
          "\n      background: transparent;\n      border: none;\n      color: ".concat(
            re.textSecondary,
            ";\n      cursor: pointer;\n      font-size: 20px;\n      padding: 0;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      transition: all 0.2s;\n    ",
          )),
          (pe.innerHTML = "✕"),
          (pe.onmouseenter = function () {
            pe.style.color = "rgba(255,100,100,1)";
          }),
          (pe.onmouseleave = function () {
            var e = ce[N.theme] || ce.dark;
            pe.style.color = e.textSecondary;
          }),
          (pe.onclick = function (e) {
            (e.stopPropagation(), (o.style.display = "none"), (Z = !1));
          }),
          ue.appendChild(de),
          ue.appendChild(pe));
        var ge = !1,
          he = { x: 0, y: 0 },
          fe = { x: 0, y: 0 };
        se.addEventListener("mousedown", function (e) {
          (e.preventDefault(), e.stopPropagation(), (ge = !0), (b = !0));
          var t = o.getBoundingClientRect();
          ((he.x = e.clientX - t.left),
            (he.y = e.clientY - t.top),
            (fe.x = t.left),
            (fe.y = t.top),
            (se.style.cursor = "grabbing"),
            (o.style.transform = "none"),
            (o.style.left = t.left + "px"),
            (o.style.top = t.top + "px"));
        });
        (window.addEventListener("mousemove", function (e) {
          if (ge) {
            e.preventDefault();
            var t = e.clientX - he.x,
              n = e.clientY - he.y,
              r = o.offsetHeight,
              a = window.innerWidth,
              i = window.innerHeight;
            ((t = Math.max(10, Math.min(t, a - 300 - 10))),
              (n = Math.max(10, Math.min(n, i - r - 10))),
              (o.style.left = t + "px"),
              (o.style.top = n + "px"));
          }
        }),
          window.addEventListener("mouseup", function () {
            ge &&
              ((ge = !1),
              (se.style.cursor = "grab"),
              setTimeout(function () {
                o.matches(":hover") || (se.style.opacity = "0");
              }, 100));
          }));
        var me = document.createElement("div");
        me.style.cssText = "margin-bottom: 20px;";
        var ve = document.createElement("div");
        ve.style.cssText = "\n      font-size: 13px;\n      color: ".concat(
          re.textPrimary,
          ";\n      margin-bottom: 8px;\n      display: flex;\n      justify-content: space-between;\n    ",
        );
        var ye = document.createElement("span");
        ye.textContent = Lo("overlay.fontSize", "Font Size");
        var we = document.createElement("span");
        ((we.style.color = "rgba(129,140,248,0.9)"),
          (we.textContent = N.overlayFontSize + "px"),
          ve.appendChild(ye),
          ve.appendChild(we));
        var Se = document.createElement("input");
        ((Se.type = "range"),
          (Se.min = "12"),
          (Se.max = "32"),
          (Se.value = N.overlayFontSize),
          (Se.className = "bh-slider"),
          (Se.style.background =
            "dark" === N.theme ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"));
        var ke = null;
        ((Se.oninput = function (e) {
          var t = parseInt(e.target.value);
          ((N.overlayFontSize = t),
            (we.textContent = t + "px"),
            wt(),
            Ue(),
            ke && clearTimeout(ke),
            (ke = setTimeout(function () {
              Tt();
            }, 300)));
        }),
          me.appendChild(ve),
          me.appendChild(Se));
        var Ce = document.createElement("div");
        Ce.style.cssText = "margin-bottom: 0;";
        var Pe = document.createElement("div");
        Pe.style.cssText = "\n      font-size: 13px;\n      color: ".concat(
          re.textPrimary,
          ";\n      margin-bottom: 8px;\n      display: flex;\n      justify-content: space-between;\n    ",
        );
        var ze = document.createElement("span");
        ze.textContent = Lo("overlay.opacity", "Background Opacity");
        var Ne = document.createElement("span");
        ((Ne.style.color = "rgba(129,140,248,0.9)"),
          (Ne.textContent = Math.round(100 * N.backgroundOpacity) + "%"),
          Pe.appendChild(ze),
          Pe.appendChild(Ne));
        var Ae = document.createElement("input");
        ((Ae.type = "range"),
          (Ae.min = "0"),
          (Ae.max = "100"),
          (Ae.value = Math.round(100 * N.backgroundOpacity)),
          (Ae.className = "bh-slider"),
          (Ae.style.background =
            "dark" === N.theme ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"));
        var De = null;
        ((Ae.oninput = function (e) {
          var t = parseInt(e.target.value) / 100;
          ((N.backgroundOpacity = t),
            (Ne.textContent = Math.round(100 * t) + "%"),
            St(),
            Ue(),
            De && clearTimeout(De),
            (De = setTimeout(function () {
              Tt();
            }, 300)));
        }),
          Ce.appendChild(Pe),
          Ce.appendChild(Ae));
        var Ve = document.createElement("div");
        Ve.style.cssText = "margin-top: 20px; margin-bottom: 0;";
        var Be = document.createElement("div");
        ((Be.style.cssText = "\n      font-size: 13px;\n      color: ".concat(
          re.textPrimary,
          ";\n      margin-bottom: 8px;\n    ",
        )),
          (Be.textContent = Lo("overlay.theme", "Theme")));
        var je = document.createElement("div");
        je.style.cssText = "\n      display: flex;\n      gap: 8px;\n    ";
        var Ie = document.createElement("button");
        Ie.className = "bh-theme-dark-btn";
        var Re = document.createElement("button");
        Re.className = "bh-theme-light-btn";
        var Fe = function () {
          var e = "dark" === N.theme,
            t = ce[N.theme] || ce.dark;
          ((Ie.style.cssText =
            "\n        flex: 1;\n        padding: 8px 12px;\n        border-radius: 6px;\n        cursor: pointer;\n        font-size: 12px;\n        font-weight: 500;\n        transition: all 0.2s;\n        background: "
              .concat(
                e ? "rgba(99,102,241,0.3)" : t.buttonBg,
                ";\n        border: 1px solid ",
              )
              .concat(
                e ? "rgba(99,102,241,0.5)" : t.buttonBorder,
                ";\n        color: ",
              )
              .concat(t.textPrimary, ";\n      ")),
            (Ie.textContent = e ? "🌙 Dark ✓" : "🌙 Dark"),
            (Re.style.cssText =
              "\n        flex: 1;\n        padding: 8px 12px;\n        border-radius: 6px;\n        cursor: pointer;\n        font-size: 12px;\n        font-weight: 500;\n        transition: all 0.2s;\n        background: "
                .concat(
                  e ? t.buttonBg : "rgba(99,102,241,0.3)",
                  ";\n        border: 1px solid ",
                )
                .concat(
                  e ? t.buttonBorder : "rgba(99,102,241,0.5)",
                  ";\n        color: ",
                )
                .concat(t.textPrimary, ";\n      ")),
            (Re.textContent = e ? "☀️ Light" : "☀️ Light ✓"));
        };
        (Fe(),
          (Ie.onclick = (function () {
            var e = Oo(
              Eo().mark(function e(t) {
                return Eo().wrap(function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        if ((t.stopPropagation(), "dark" !== N.theme)) {
                          e.next = 3;
                          break;
                        }
                        return e.abrupt("return");
                      case 3:
                        return (
                          (N.theme = "dark"),
                          Fe(),
                          kt(),
                          (e.next = 8),
                          Tt()
                        );
                      case 8:
                        "function" == typeof Ue && Ue();
                        try {
                          chrome.runtime.sendMessage({
                            type: "trackEvent",
                            eventName: "overlay_theme_toggled",
                            properties: {
                              theme: "dark",
                              from: "overlay_settings_panel",
                            },
                          });
                        } catch (e) {}
                      case 10:
                      case "end":
                        return e.stop();
                    }
                }, e);
              }),
            );
            return function (t) {
              return e.apply(this, arguments);
            };
          })()),
          (Re.onclick = (function () {
            var e = Oo(
              Eo().mark(function e(t) {
                return Eo().wrap(function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        if ((t.stopPropagation(), "light" !== N.theme)) {
                          e.next = 3;
                          break;
                        }
                        return e.abrupt("return");
                      case 3:
                        return (
                          (N.theme = "light"),
                          Fe(),
                          kt(),
                          (e.next = 8),
                          Tt()
                        );
                      case 8:
                        "function" == typeof Ue && Ue();
                        try {
                          chrome.runtime.sendMessage({
                            type: "trackEvent",
                            eventName: "overlay_theme_toggled",
                            properties: {
                              theme: "light",
                              from: "overlay_settings_panel",
                            },
                          });
                        } catch (e) {}
                      case 10:
                      case "end":
                        return e.stop();
                    }
                }, e);
              }),
            );
            return function (t) {
              return e.apply(this, arguments);
            };
          })()),
          je.appendChild(Ie),
          je.appendChild(Re),
          Ve.appendChild(Be),
          Ve.appendChild(je));
        var qe = document.createElement("button");
        ((qe.className = "bh-reset-btn"),
          (qe.style.cssText =
            "\n      background: rgba(99,102,241,0.2);\n      border: 1px solid rgba(99,102,241,0.4);\n      border-radius: 4px;\n      color: ".concat(
              re.textPrimary,
              ";\n      cursor: not-allowed;\n      font-size: 11px;\n      font-weight: 500;\n      padding: 4px 8px;\n      transition: all 0.2s;\n      pointer-events: none;\n      display: inline-flex;\n      align-items: center;\n      gap: 4px;\n      opacity: 0.55;\n      margin-left: auto;\n      margin-right: 16px;\n    ",
            )),
          (qe.textContent = Lo("overlay.reset", "Reset")),
          (qe.title = "Reset to default settings"));
        var He = function (e) {
          ((qe.disabled = !e),
            (qe.style.opacity = e ? "1" : "0.55"),
            (qe.style.cursor = e ? "pointer" : "not-allowed"),
            (qe.style.pointerEvents = e ? "auto" : "none"));
        };
        (He(!1),
          (qe.onmouseenter = function () {
            qe.disabled || (qe.style.background = "rgba(99,102,241,0.3)");
          }),
          (qe.onmouseleave = function () {
            qe.disabled || (qe.style.background = "rgba(99,102,241,0.2)");
          }),
          (qe.onclick = (function () {
            var e = Oo(
              Eo().mark(function e(t) {
                var n, r, o, a;
                return Eo().wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          if ((t.stopPropagation(), !qe.disabled)) {
                            e.next = 3;
                            break;
                          }
                          return e.abrupt("return");
                        case 3:
                          return (
                            (e.prev = 3),
                            (e.next = 6),
                            chrome.storage.sync.get(["overlayDefaults"])
                          );
                        case 6:
                          return (
                            (n = e.sent),
                            (r = n.overlayDefaults || {
                              overlayFontSize: 18,
                              stripFontSize: 30,
                              backgroundOpacity: 0.95,
                              showBilingual: !0,
                              swapLanguageOrder: !1,
                              theme: "dark",
                            }),
                            (N.overlayFontSize = r.overlayFontSize),
                            (N.stripFontSize = r.stripFontSize),
                            (N.backgroundOpacity = r.backgroundOpacity),
                            (N.showBilingual = r.showBilingual),
                            (N.swapLanguageOrder = r.swapLanguageOrder),
                            (N.theme = r.theme),
                            (Se.value = r.overlayFontSize),
                            (we.textContent = r.overlayFontSize + "px"),
                            (Ae.value = Math.round(100 * r.backgroundOpacity)),
                            (Ne.textContent =
                              Math.round(100 * r.backgroundOpacity) + "%"),
                            Fe(),
                            wt(),
                            St(),
                            Ct(),
                            Et(),
                            kt(),
                            le &&
                              le.updateSettings({ fontSize: N.stripFontSize }),
                            O && O.updateStyle && O.updateStyle(),
                            L && L.updateStyle && L.updateStyle(),
                            V &&
                              (V.style.display = N.showBilingual
                                ? "flex"
                                : "none"),
                            (e.next = 30),
                            Tt()
                          );
                        case 30:
                          return (He(!1), (e.next = 33), Ue());
                        case 33:
                          ((o = qe.textContent),
                            (qe.textContent = "✓ Reset!"),
                            setTimeout(function () {
                              qe.textContent = o;
                            }, 1500),
                            (e.next = 44));
                          break;
                        case 38:
                          ((e.prev = 38),
                            (e.t0 = e.catch(3)),
                            (a = qe.textContent),
                            (qe.textContent = "✗ Failed"),
                            setTimeout(function () {
                              qe.textContent = a;
                            }, 1500));
                        case 44:
                        case "end":
                          return e.stop();
                      }
                  },
                  e,
                  null,
                  [[3, 38]],
                );
              }),
            );
            return function (t) {
              return e.apply(this, arguments);
            };
          })()),
          ue.insertBefore(qe, pe));
        var Ue = (function () {
          var e = Oo(
            Eo().mark(function e() {
              var t, n, r;
              return Eo().wrap(
                function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        return (
                          (e.prev = 0),
                          (e.next = 3),
                          chrome.storage.sync.get(["overlayDefaults"])
                        );
                      case 3:
                        ((t = e.sent),
                          (n = t.overlayDefaults || {
                            overlayFontSize: 18,
                            stripFontSize: 30,
                            backgroundOpacity: 0.95,
                            showBilingual: !0,
                            swapLanguageOrder: !1,
                            theme: "dark",
                          }),
                          (r =
                            N.overlayFontSize !== n.overlayFontSize ||
                            N.stripFontSize !== n.stripFontSize ||
                            N.backgroundOpacity !== n.backgroundOpacity ||
                            N.showBilingual !== n.showBilingual ||
                            N.swapLanguageOrder !== n.swapLanguageOrder ||
                            N.theme !== n.theme),
                          He(r),
                          (e.next = 12));
                        break;
                      case 9:
                        ((e.prev = 9), (e.t0 = e.catch(0)));
                      case 12:
                      case "end":
                        return e.stop();
                    }
                },
                e,
                null,
                [[0, 9]],
              );
            }),
          );
          return function () {
            return e.apply(this, arguments);
          };
        })();
        (o.appendChild(se),
          o.appendChild(ue),
          o.appendChild(me),
          o.appendChild(Ce),
          o.appendChild(Ve),
          document.documentElement.appendChild(o));
        var We = function () {
          return Oe();
        };
        (n.addEventListener("wheel", We, { passive: !0 }),
          n.addEventListener("touchmove", We, { passive: !0 }),
          n.addEventListener(
            "mousedown",
            function (e) {
              (function (e, t) {
                if (!e || !t) return !1;
                var n = t.getBoundingClientRect(),
                  r = t.offsetWidth - t.clientWidth;
                return !(r <= 0) && e.clientX - n.left >= n.width - r;
              })(e, n) && Oe(2e3);
            },
            { passive: !0 },
          ),
          n.addEventListener("scroll", function (e) {
            var t = performance.now(),
              r = (function (e) {
                var t =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : 50;
                if (!e) return !0;
                var n = e.scrollTop;
                return e.scrollHeight - n - e.clientHeight <= t;
              })(n),
              o = t <= R;
            (o && ne && (oe && ((oe = !1), mt()), (I = !0)),
              o
                ? (ne || (I = !r), Le())
                : !ne && r && t < q
                  ? (h.style.display = "none")
                  : Le());
          }));
        return (
          [
            {
              dir: "n",
              cursor: "ns-resize",
              style: { top: "0", left: "0", right: "0", height: "8px" },
            },
            {
              dir: "e",
              cursor: "ew-resize",
              style: { right: "0", top: "0", bottom: "0", width: "8px" },
            },
            {
              dir: "s",
              cursor: "ns-resize",
              style: { bottom: "0", left: "0", right: "0", height: "8px" },
            },
            {
              dir: "w",
              cursor: "ew-resize",
              style: { left: "0", top: "0", bottom: "0", width: "8px" },
            },
            {
              dir: "ne",
              cursor: "nesw-resize",
              style: { top: "0", right: "0", width: "16px", height: "16px" },
            },
            {
              dir: "se",
              cursor: "nwse-resize",
              style: { bottom: "0", right: "0", width: "16px", height: "16px" },
            },
            {
              dir: "sw",
              cursor: "nesw-resize",
              style: { bottom: "0", left: "0", width: "16px", height: "16px" },
            },
            {
              dir: "nw",
              cursor: "nwse-resize",
              style: { top: "0", left: "0", width: "16px", height: "16px" },
            },
          ].forEach(function (t) {
            var n = t.dir,
              r = t.cursor,
              o = t.style,
              a = document.createElement("div");
            ((a.className = "bh-resize-".concat(n)),
              (a.dataset.direction = n),
              "se" === n &&
                (a.title = Lo(
                  "overlay.resizeTooltip",
                  "Drag this corner to resize",
                )));
            var i = n.includes("n") ? "20" : "10";
            (Object.assign(
              a.style,
              So(
                {
                  position: "absolute",
                  cursor: r,
                  pointerEvents: "auto",
                  zIndex: i,
                },
                o,
              ),
            ),
              (f[n] = a),
              e.appendChild(a));
          }),
          e.appendChild(t),
          e.appendChild(n),
          document.documentElement.appendChild(e),
          ae(),
          xt(),
          (function () {
            (Pt(), t && t.addEventListener("mousedown", Ot));
            (window.addEventListener("mouseup", Lt),
              window.addEventListener("mousemove", Mt));
          })(),
          Object.values(f).forEach(function (e) {
            e && e.addEventListener("mousedown", zt);
          }),
          window.addEventListener("mouseup", At),
          window.addEventListener("mousemove", Nt),
          (function () {
            if (!e || !t) return;
            (e.addEventListener("mouseenter", function () {
              (Y && (clearTimeout(Y), (Y = null)),
                (t.style.transform = "translateY(0)"),
                (t.style.opacity = "1"));
            }),
              e.addEventListener("mouseleave", function () {
                A ||
                  D ||
                  Z ||
                  !U ||
                  (Y && clearTimeout(Y),
                  (Y = setTimeout(function () {
                    (A ||
                      D ||
                      Z ||
                      !U ||
                      ((t.style.transform = "translateY(-100%)"),
                      (t.style.opacity = "0")),
                      (Y = null));
                  }, 300)));
              }));
          })(),
          tt(),
          Ee(),
          e
        );
      }
      function tt() {
        e &&
          X &&
          (e.offsetWidth < 550
            ? (X.style.display = "none")
            : "none" === X.style.display &&
              X.textContent &&
              (X.style.display = "inline"));
      }
      function nt() {
        return (
          x ||
          ((x = yo({
            settings: N,
            theme: N.theme,
            onStart: function () {
              ((U = !0),
                (W = !1),
                ct("connecting"),
                It(),
                chrome.runtime.sendMessage({ type: "startCapture" }),
                dt("start"));
            },
            onStop:
              ((r = Oo(
                Eo().mark(function e() {
                  return Eo().wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return (
                              (W = !0),
                              (e.prev = 1),
                              (e.next = 4),
                              chrome.runtime.sendMessage({
                                type: "offscreenStop",
                              })
                            );
                          case 4:
                            return (
                              (e.next = 6),
                              new Promise(function (e) {
                                return setTimeout(e, 800);
                              })
                            );
                          case 6:
                            e.next = 11;
                            break;
                          case 8:
                            ((e.prev = 8), (e.t0 = e.catch(1)));
                          case 11:
                            ((W = !1), (U = !1), pt(), at());
                          case 15:
                          case "end":
                            return e.stop();
                        }
                    },
                    e,
                    null,
                    [[1, 8]],
                  );
                }),
              )),
              function () {
                return r.apply(this, arguments);
              }),
            onClose: function () {
              lt();
              try {
                chrome.runtime.sendMessage({ type: "offscreenStop" });
              } catch (e) {}
            },
            onCollapse: function () {
              We();
            },
            onOpenSettings: function () {
              o &&
                ("none" === o.style.display
                  ? ((o.style.display = "block"), (Z = !0))
                  : ((o.style.display = "none"), (Z = !1)));
            },
            onAudioMixerOpen:
              ((n = Oo(
                Eo().mark(function e() {
                  return Eo().wrap(function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return ((e.next = 2), Ze());
                        case 2:
                          $e();
                        case 3:
                        case "end":
                          return e.stop();
                      }
                  }, e);
                }),
              )),
              function () {
                return n.apply(this, arguments);
              }),
            onSettingsChange:
              ((t = Oo(
                Eo().mark(function e(t, n) {
                  var r, o;
                  return Eo().wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return ((N[t] = n), (e.next = 3), Tt());
                          case 3:
                            if (
                              ("ttsEnabled" === t &&
                                ((ne = !!n)
                                  ? ((oe = !0),
                                    (I = !1),
                                    null != ee &&
                                      (ht(ee, { behavior: "auto", force: !0 }),
                                      ft()))
                                  : ((oe = !0),
                                    mt(),
                                    n ||
                                      ((ae = !1),
                                      (ie = null),
                                      yt(null, { forceFullClear: !0 }),
                                      (ee = null))),
                                Me(),
                                Le(),
                                le && le.updateSettings({ deferPartial: !n }),
                                "strip" === se &&
                                  le &&
                                  (n
                                    ? (Ft(), ae || Ht())
                                    : (le.setStatus(""), Ht()))),
                              "ttsVoice" !== t)
                            ) {
                              e.next = 16;
                              break;
                            }
                            return (
                              (e.prev = 5),
                              (e.next = 8),
                              chrome.storage.local.set({ ttsVoice: n })
                            );
                          case 8:
                            e.next = 13;
                            break;
                          case 10:
                            ((e.prev = 10), (e.t0 = e.catch(5)));
                          case 13:
                            ((r = ee),
                              te.length > 0 && (te.length = 0),
                              null != r &&
                                (Dt(N.ttsVoiceDisplayName || n), bt(r)));
                          case 16:
                            if ("ttsVoiceId" !== t) {
                              e.next = 31;
                              break;
                            }
                            if (
                              ((o = "string" == typeof n ? n.trim() : ""),
                              (e.prev = 18),
                              !o)
                            ) {
                              e.next = 24;
                              break;
                            }
                            return (
                              (e.next = 22),
                              chrome.storage.local.set({ ttsVoiceId: o })
                            );
                          case 22:
                            e.next = 26;
                            break;
                          case 24:
                            return (
                              (e.next = 26),
                              chrome.storage.local.remove("ttsVoiceId")
                            );
                          case 26:
                            e.next = 31;
                            break;
                          case 28:
                            ((e.prev = 28), (e.t1 = e.catch(18)));
                          case 31:
                            if ("ttsVoiceDisplayName" !== t) {
                              e.next = 45;
                              break;
                            }
                            if (((e.prev = 32), !n)) {
                              e.next = 38;
                              break;
                            }
                            return (
                              (e.next = 36),
                              chrome.storage.local.set({
                                ttsVoiceDisplayName: n,
                              })
                            );
                          case 36:
                            e.next = 40;
                            break;
                          case 38:
                            return (
                              (e.next = 40),
                              chrome.storage.local.remove("ttsVoiceDisplayName")
                            );
                          case 40:
                            e.next = 45;
                            break;
                          case 42:
                            ((e.prev = 42), (e.t2 = e.catch(32)));
                          case 45:
                            if ("ttsResponseFormat" !== t) {
                              e.next = 54;
                              break;
                            }
                            return (
                              (e.prev = 46),
                              (e.next = 49),
                              chrome.storage.local.set({
                                ttsResponseFormat: n || "pcm",
                              })
                            );
                          case 49:
                            e.next = 54;
                            break;
                          case 51:
                            ((e.prev = 51), (e.t3 = e.catch(46)));
                          case 54:
                            if ("audioDuckingEnabled" !== t) {
                              e.next = 63;
                              break;
                            }
                            return (
                              (e.prev = 55),
                              (e.next = 58),
                              chrome.storage.local.set({
                                audioDuckingEnabled: !!n,
                              })
                            );
                          case 58:
                            e.next = 63;
                            break;
                          case 60:
                            ((e.prev = 60), (e.t4 = e.catch(55)));
                          case 63:
                            if ("ttsLanguage" !== t) {
                              e.next = 72;
                              break;
                            }
                            return (
                              (e.prev = 64),
                              (e.next = 67),
                              chrome.storage.local.set({ ttsLanguage: n })
                            );
                          case 67:
                            e.next = 72;
                            break;
                          case 69:
                            ((e.prev = 69), (e.t5 = e.catch(64)));
                          case 72:
                            if (
                              ("overlayFontSize" === t && wt(),
                              "stripFontSize" === t &&
                                le &&
                                le.updateSettings({ fontSize: n }),
                              "backgroundOpacity" === t &&
                                (St(),
                                le &&
                                  le.updateSettings({ backgroundOpacity: n })),
                              "theme" === t &&
                                (kt(),
                                Ae(),
                                le && le.updateSettings({ theme: n })),
                              "showBilingual" === t &&
                                (Ct(),
                                le && le.updateSettings({ showBilingual: n })),
                              "swapLanguageOrder" === t &&
                                (Et(),
                                le &&
                                  le.updateSettings({ swapLanguageOrder: n })),
                              [
                                "tabVolume",
                                "ttsVolume",
                                "ttsEnabled",
                                "ttsVoice",
                                "ttsVoiceId",
                                "ttsResponseFormat",
                                "ttsLanguage",
                                "audioDuckingEnabled",
                                "duckingStrength",
                              ].includes(t))
                            )
                              try {
                                chrome.runtime.sendMessage({
                                  type: "audioSettings",
                                  setting: t,
                                  value: n,
                                });
                              } catch (e) {}
                          case 80:
                          case "end":
                            return e.stop();
                        }
                    },
                    e,
                    null,
                    [
                      [5, 10],
                      [18, 28],
                      [32, 42],
                      [46, 51],
                      [55, 60],
                      [64, 69],
                    ],
                  );
                }),
              )),
              function (e, n) {
                return t.apply(this, arguments);
              }),
            overlayT: Lo,
            onModeChange:
              ((e = Oo(
                Eo().mark(function e(t) {
                  var n;
                  return Eo().wrap(function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (
                            (n = ve(t)),
                            (se = n),
                            (N.subtitleMode = n),
                            It(),
                            (e.next = 7),
                            Tt()
                          );
                        case 7:
                          try {
                            chrome.runtime.sendMessage({
                              type: "trackEvent",
                              eventName: "overlay_mode_switched",
                              properties: { mode: n },
                            });
                          } catch (e) {}
                        case 8:
                        case "end":
                          return e.stop();
                      }
                  }, e);
                }),
              )),
              function (t) {
                return e.apply(this, arguments);
              }),
          })),
          x)
        );
        var e, t, n, r;
      }
      function rt() {
        var e = (
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}
          ).clearStripText,
          t = void 0 === e || e;
        ((ae = !1),
          (ie = null),
          (ee = null),
          (oe = !0),
          (I = !1),
          te.length > 0 && (te.length = 0),
          mt(),
          yt(null, { forceFullClear: !0 }),
          Le(),
          t && le && le.reset());
      }
      function ot() {
        return (
          le ||
            (le = xo({
              theme: N.theme,
              fontSize: N.stripFontSize,
              backgroundOpacity: N.backgroundOpacity,
              showBilingual: N.showBilingual,
              swapLanguageOrder: N.swapLanguageOrder,
              deferPartial: !N.ttsEnabled,
              overlayT: Lo,
            })),
          le
        );
      }
      function at() {
        if ("strip" === se) {
          var e = ot();
          (e.setStatus(""),
            e.hasDisplayableText && e.hasDisplayableText()
              ? e.show()
              : (e.reset(),
                e.showMessage({
                  title: Lo("overlay.stopped", "Stopped"),
                  subtitle: Lo(
                    "overlay.clickStartToResume",
                    "Click Start to resume",
                  ),
                })));
        } else le && (le.setStatus(""), le.reset(), le.hide());
      }
      function it() {
        return st.apply(this, arguments);
      }
      function st() {
        return (
          (st = Oo(
            Eo().mark(function e() {
              var t,
                n,
                o,
                a,
                i,
                s,
                l,
                c,
                u,
                d,
                p,
                h,
                f,
                m,
                v,
                y,
                b = arguments;
              return Eo().wrap(
                function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        return (
                          (n = (t = b.length > 0 && void 0 !== b[0] ? b[0] : {})
                            .hintMode),
                          (o = t.hintWhenEmpty),
                          (a = void 0 !== o && o),
                          (i = t.resetTts),
                          (s = void 0 !== i && i),
                          (l = t.refreshVoices),
                          void 0 !== l &&
                            l &&
                            (Object.keys(to).forEach(function (e) {
                              delete to[e];
                            }),
                            Object.keys(no).forEach(function (e) {
                              delete no[e];
                            }),
                            (ro += 1)),
                          (e.next = 4),
                          Xe()
                        );
                      case 4:
                        return (
                          $e(),
                          (c = "en"),
                          (e.prev = 6),
                          (e.next = 9),
                          chrome.storage.sync.get(["targetLanguage"])
                        );
                      case 9:
                        ((u = e.sent).targetLanguage && (c = u.targetLanguage),
                          (e.next = 16));
                        break;
                      case 13:
                        ((e.prev = 13), (e.t0 = e.catch(6)));
                      case 16:
                        if (
                          (N.ttsLanguage || (N.ttsLanguage = c),
                          et(),
                          (K = !0),
                          ct("connecting"),
                          (U = !0),
                          (W = !1),
                          s)
                        ) {
                          rt();
                          try {
                            chrome.runtime.sendMessage({
                              type: "offscreenResetSession",
                              reason: "page_changed",
                            });
                          } catch (e) {}
                        }
                        return (
                          (d = nt()).show(),
                          d.setCapturing(!0),
                          It(),
                          (e.prev = 27),
                          (e.next = 30),
                          chrome.storage.local.get(["needVoiceSelection"])
                        );
                      case 30:
                        (e.sent.needVoiceSelection &&
                          setTimeout(function () {
                            Bt();
                          }, 800),
                          (e.next = 37));
                        break;
                      case 34:
                        ((e.prev = 34), (e.t1 = e.catch(27)));
                      case 37:
                        return (
                          (e.prev = 37),
                          (e.next = 40),
                          chrome.storage.local.get(["voiceAvailabilityNotice"])
                        );
                      case 40:
                        if (
                          ((p = e.sent),
                          !(h = p.voiceAvailabilityNotice) || !h.createdAt)
                        ) {
                          e.next = 49;
                          break;
                        }
                        return (
                          (f = Date.now() - h.createdAt <= g),
                          (e.next = 46),
                          chrome.storage.local.remove("voiceAvailabilityNotice")
                        );
                      case 46:
                        (f &&
                          setTimeout(function () {
                            Vt(h);
                          }, 900),
                          (e.next = 52));
                        break;
                      case 49:
                        if (!h) {
                          e.next = 52;
                          break;
                        }
                        return (
                          (e.next = 52),
                          chrome.storage.local.remove("voiceAvailabilityNotice")
                        );
                      case 52:
                        e.next = 57;
                        break;
                      case 54:
                        ((e.prev = 54), (e.t2 = e.catch(37)));
                      case 57:
                        ((m = document.querySelector(".bh-stop-btn")) &&
                          m.updateStyle &&
                          m.updateStyle(),
                          (v = document.querySelector(".bh-bilingual-btn")) &&
                            v.updateStyle &&
                            v.updateStyle(),
                          (y = document.querySelector(".bh-swap-order-btn")) &&
                            (y.style.display = N.showBilingual
                              ? "flex"
                              : "none"),
                          n && (!a || (r && 0 === r.children.length)) && dt(n));
                        try {
                          chrome.runtime.sendMessage({ type: "queryWsStatus" });
                        } catch (e) {}
                      case 65:
                      case "end":
                        return e.stop();
                    }
                },
                e,
                null,
                [
                  [6, 13],
                  [27, 34],
                  [37, 54],
                ],
              );
            }),
          )),
          st.apply(this, arguments)
        );
      }
      function lt() {
        ((K = !1), (w = !1), qe(), Ce(), y && (clearTimeout(y), (y = null)));
        try {
          chrome.runtime.sendMessage({
            type: "trackEvent",
            eventName: "overlay_final_display_mode",
            properties: {
              mode: N.showBilingual ? "bilingual" : "translation_only",
              trigger: "hide_overlay",
            },
          });
        } catch (e) {}
        (e && e.parentNode && e.parentNode.removeChild(e),
          o && o.parentNode && o.parentNode.removeChild(o),
          x && (x.hide(), (x = null)),
          le && (le.destroy(), (le = null)),
          (se = "overlay"),
          (e = void 0),
          (n = void 0),
          (r = void 0),
          (H = null),
          (h = null),
          (o = void 0),
          (b = !1),
          (G = null),
          (X = null),
          (m = null),
          (S = null),
          (k = null),
          (T = null),
          (_ = !1),
          (C = !1),
          (E = { x: 0, y: 0 }),
          (P = { x: 0, y: 0 }),
          (O = !1));
      }
      function ct(n) {
        var r =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        if (((L = n || "connecting"), (z = r || {}), Ne(), G && X)) {
          var o = function () {
            return !!e && e.offsetWidth >= 550;
          };
          switch (n) {
            case "connecting":
              ((G.style.background = "rgba(255,200,0,0.8)"),
                (G.style.boxShadow = "0 0 8px rgba(255,200,0,0.6)"),
                (G.style.animation = "pulse 1.5s ease-in-out infinite"),
                (X.textContent = Lo("overlay.starting", "Starting...")),
                (X.style.display = o() ? "inline" : "none"));
              break;
            case "connected":
              ((G.style.background = "rgba(100,200,100,0.9)"),
                (G.style.boxShadow = "0 0 8px rgba(100,200,100,0.6)"),
                (G.style.animation = "none"),
                (X.textContent = Lo("overlay.translating", "Translating")),
                (X.style.display = o() ? "inline" : "none"));
              break;
            case "reconnecting":
              var a = r.attempt || 0;
              ((G.style.background = "rgba(255,150,0,0.8)"),
                (G.style.boxShadow = "0 0 8px rgba(255,150,0,0.6)"),
                (G.style.animation = "pulse 1s ease-in-out infinite"),
                (X.textContent = "Reconnecting ".concat(
                  a > 0 ? "#".concat(a) : "",
                  "...",
                )),
                (X.style.display = o() ? "inline" : "none"));
              break;
            case "error":
              var i = r.message || "Connection error";
              ((G.style.background = "rgba(255,100,100,0.9)"),
                (G.style.boxShadow = "0 0 8px rgba(255,100,100,0.6)"),
                (G.style.animation = "none"),
                (X.textContent = i),
                (X.style.display = o() ? "inline" : "none"));
              break;
            case "disconnected":
              ((G.style.background = "rgba(150,150,150,0.5)"),
                (G.style.boxShadow = "none"),
                (G.style.animation = "none"),
                (X.textContent = Lo("overlay.stopped", "Stopped")),
                (X.style.display = o() ? "inline" : "none"));
              try {
                (Y && (clearTimeout(Y), (Y = null)),
                  t &&
                    ((t.style.transform = "translateY(0)"),
                    (t.style.opacity = "1")));
              } catch (e) {}
              break;
            default:
              ((G.style.background = "rgba(100,100,100,0.5)"),
                (G.style.boxShadow = "none"),
                (G.style.animation = "none"),
                (X.style.display = "none"));
          }
        }
      }
      function ut(e, t) {
        if (e) {
          var n = e.querySelector(".bh-caption-translate"),
            r = e.querySelector(".bh-caption-original"),
            o = r && r.textContent.trim().length > 0,
            a = N.showBilingual && o,
            i = !!t,
            s = i || a,
            l = i && a;
          (n &&
            ((n.style.display = i ? "block" : "none"),
            (n.style.minHeight = i ? "1.5em" : "0"),
            (n.style.marginTop = N.swapLanguageOrder && l ? "6px" : "0")),
            r &&
              ((r.style.display = a ? "block" : "none"),
              (r.style.minHeight = a ? "1.4em" : "0"),
              (r.style.marginTop = !N.swapLanguageOrder && l ? "6px" : "0")),
            s
              ? ((e.style.padding = "8px 0"),
                (e.style.minHeight = l ? "60px" : "30px"),
                (e.style.borderBottomWidth = "1px"))
              : ((e.style.padding = "0"),
                (e.style.minHeight = "0"),
                (e.style.borderBottomWidth = "0")));
        }
      }
      function dt() {
        var e =
          arguments.length > 0 && void 0 !== arguments[0]
            ? arguments[0]
            : "start";
        if (r) {
          var t = ce[N.theme] || ce.dark,
            o = "dark" === N.theme;
          if (!J) {
            (((J = document.createElement("div")).className =
              "bh-listening-hint"),
              (J.style.cssText =
                "\n        text-align: center;\n        padding: 16px 20px;\n        margin: 12px 0;\n        background: "
                  .concat(
                    o ? "rgba(99, 102, 241, 0.08)" : "rgba(99, 102, 241, 0.06)",
                    ";\n        border: 1px solid ",
                  )
                  .concat(
                    o ? "rgba(99, 102, 241, 0.2)" : "rgba(99, 102, 241, 0.15)",
                    ";\n        border-radius: 8px;\n        animation: fadeIn 0.3s ease-out;\n      ",
                  )));
            var a = document.createElement("div");
            a.style.cssText =
              "\n        font-size: 13px;\n        font-weight: 500;\n        color: ".concat(
                o ? "rgba(99, 102, 241, 0.9)" : "rgba(99, 102, 241, 0.85)",
                ";\n        margin-bottom: 6px;\n      ",
              );
            var i = document.createElement("span");
            i.className = "bh-listening-main";
            var s = document.createElement("span");
            ((s.className = "bh-listening-dots"),
              (s.style.cssText =
                "\n        display: inline-block;\n        width: 20px;\n        text-align: left;\n      "),
              a.appendChild(i),
              a.appendChild(s));
            var l = document.createElement("div");
            ((l.className = "bh-listening-desc"),
              (l.style.cssText =
                "\n        font-size: 12px;\n        line-height: 1.4;\n        color: ".concat(
                  t.textSecondary,
                  ";\n        opacity: 0.8;\n      ",
                )),
              J.appendChild(a),
              J.appendChild(l));
            var c = 0,
              u = setInterval(function () {
                if (J && J.parentNode) {
                  var e = J.querySelector(".bh-listening-dots");
                  e && ((c = (c + 1) % 4), (e.textContent = ".".repeat(c)));
                } else clearInterval(u);
              }, 500);
            J._dotsInterval = u;
          }
          (J.parentNode === r && J === r.lastChild) || r.appendChild(J);
          var d = J.querySelector(".bh-listening-main"),
            p = J.querySelector(".bh-listening-desc");
          if (
            d &&
            p &&
            ("pageChange" === e
              ? ((d.textContent = Lo(
                  "overlay.listening",
                  "Listening for video/audio on this page",
                )),
                (p.textContent = Lo(
                  "overlay.listeningPageChangeDesc",
                  "You've opened a new page. Captions will resume automatically when video/audio starts.",
                )))
              : ((d.textContent = Lo(
                  "overlay.listeningTab",
                  "Listening for audio in this tab",
                )),
                (p.textContent = Lo(
                  "overlay.listeningTabDesc",
                  "Make sure video is playing & unmuted. Captions will appear here automatically.",
                ))),
            n && !I)
          ) {
            ((F = !0), (q = performance.now() + 700));
            try {
              n.scrollTo({ top: n.scrollHeight, behavior: "smooth" });
            } catch (e) {}
            setTimeout(function () {
              F = !1;
            }, 600);
          }
        }
      }
      function pt() {
        J &&
          (J._dotsInterval &&
            (clearInterval(J._dotsInterval), (J._dotsInterval = null)),
          J.parentNode && J.parentNode.removeChild(J),
          (J = null));
      }
      function gt(t) {
        var o = t.textOriginal,
          a = t.textTranslated,
          i = t.isNewSentence,
          s = t.isFinal,
          l = t.lineId,
          c = "string" == typeof o ? o : "",
          u = "string" == typeof a ? a : "",
          d = u.trim().length > 0 ? u : "",
          p = d.trim().length > 0;
        performance.now();
        if (K && ((e && document.body.contains(e)) || et(), r)) {
          J && (a || o) && pt();
          var g = null,
            h = null;
          if (
            (ne &&
              oe &&
              null != ee &&
              n &&
              (g = r.querySelector('[data-line-id="'.concat(ee, '"]'))) &&
              (h =
                g.getBoundingClientRect().top - n.getBoundingClientRect().top),
            !0 !== i && H && H.parentNode)
          ) {
            var f =
                H.querySelector(".bh-caption-translate-text") ||
                H.querySelector(".bh-caption-translate"),
              m = H.querySelector(".bh-caption-original");
            if (
              (f && f.textContent !== d && (f.textContent = d),
              m && m.textContent !== c && (m.textContent = c),
              ut(H, p),
              s && H)
            ) {
              (H.classList.remove("bh-current"),
                H.setAttribute("data-state", "final"),
                null != l &&
                  (H.setAttribute("data-line-id", String(l)),
                  te.push(l),
                  null != ee && yt(ee)));
              try {
                H.id = "sc-result-".concat(++ue);
              } catch (e) {}
            }
          } else {
            var v = (function (e, t) {
              var n = ce[N.theme] || ce.dark,
                r = document.createElement("div");
              ((r.className = N.swapLanguageOrder
                ? "bh-caption-line-group bh-swapped"
                : "bh-caption-line-group"),
                Object.assign(r.style, {
                  padding: "8px 0",
                  borderBottom: "1px solid ".concat(n.lineBorder),
                  minHeight: N.showBilingual ? "60px" : "30px",
                  position: "relative",
                }));
              var o = document.createElement("div");
              ((o.className = "bh-tts-indicator"),
                (o.innerHTML = "<span></span><span></span><span></span>"));
              var a = document.createElement("div");
              ((a.className = "bh-caption-translate"),
                Object.assign(a.style, {
                  fontSize: "1em",
                  fontWeight: "500",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  lineHeight: "1.5",
                  color: n.textTranslate,
                  minHeight: "1.5em",
                  paddingRight: "18px",
                  order: "1",
                }));
              var i = document.createElement("span");
              ((i.className = "bh-caption-translate-text"),
                (i.textContent = e || ""),
                a.appendChild(i),
                a.appendChild(o));
              var s = document.createElement("div");
              return (
                (s.className = "bh-caption-original"),
                Object.assign(s.style, {
                  fontSize: "0.85em",
                  opacity: "0.75",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  lineHeight: "1.4",
                  color: n.textOriginal,
                  display: N.showBilingual ? "block" : "none",
                  minHeight: N.showBilingual ? "1.4em" : "0",
                  order: "2",
                }),
                (s.textContent = t || ""),
                r.appendChild(a),
                r.appendChild(s),
                r
              );
            })(d, c);
            (v.classList.add("bh-current"),
              v.setAttribute("data-state", "temp"),
              r.appendChild(v),
              (H = v),
              ut(v, p),
              s &&
                null != l &&
                (v.classList.remove("bh-current"),
                v.setAttribute("data-state", "final"),
                v.setAttribute("data-line-id", String(l)),
                te.push(l),
                null != ee && yt(ee)));
          }
          if (g && null != h && n) {
            var y =
              g.getBoundingClientRect().top - n.getBoundingClientRect().top - h;
            if (Math.abs(y) > 1) {
              var b = !F;
              (b && (F = !0),
                (q = Math.max(q, performance.now() + 120)),
                (n.scrollTop += y),
                b &&
                  setTimeout(function () {
                    F = !1;
                  }, 50));
            }
          } else
            ne && oe && null != ee && n
              ? ht(ee, { behavior: "auto", force: !0 })
              : ne ||
                I ||
                !n ||
                ((q = performance.now() + (!0 === i ? 700 : 120)),
                requestAnimationFrame(function () {
                  requestAnimationFrame(function () {
                    if (n && !I) {
                      F = !0;
                      var e = !0 === i ? "smooth" : "auto";
                      ((q = Math.max(
                        q,
                        performance.now() + ("smooth" === e ? 700 : 120),
                      )),
                        n.scrollTo({ top: n.scrollHeight, behavior: e }),
                        setTimeout(
                          function () {
                            F = !1;
                          },
                          "smooth" === e ? 600 : 50,
                        ));
                    }
                  });
                }));
          ("strip" === se &&
            le &&
            Rt() &&
            (p &&
              le.updateText({
                translatedText: d,
                originalText: c,
                isFinal: !0 === s,
              }),
            Ft()),
            Ue());
        }
      }
      function ht(e) {
        var t =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        if (n && r && null != e) {
          var o = r.querySelector('[data-line-id="'.concat(e, '"]'));
          if (o) {
            F = !0;
            var a = t.behavior || "smooth",
              i = !!t.force;
            q = performance.now() + ("smooth" === a ? 700 : 120);
            var s = o.getBoundingClientRect(),
              l = n.getBoundingClientRect(),
              c = n.scrollTop + (s.top - l.top) - (l.height - s.height) / 2,
              u = Math.max(0, c);
            !i && Math.abs(n.scrollTop - u) < 2
              ? (F = !1)
              : (n.scrollTo({ top: u, behavior: a }),
                setTimeout(
                  function () {
                    F = !1;
                  },
                  "smooth" === a ? 600 : 50,
                ));
          }
        }
      }
      function ft() {
        re ||
          (re = setInterval(function () {
            ne && oe && null != ee
              ? ht(ee, { behavior: "auto", force: !0 })
              : mt();
          }, 120));
      }
      function mt() {
        re && (clearInterval(re), (re = null));
      }
      function vt(e) {
        if (e) {
          var t = e.querySelector(".bh-caption-translate"),
            n = e.querySelector(".bh-caption-translate-text"),
            r = e.querySelector(".bh-tts-indicator");
          if (t && n && r) {
            t.style.paddingRight = "18px";
            var o = n.firstChild,
              a = n.textContent || "";
            if (o && o.nodeType === Node.TEXT_NODE && a) {
              var i = document.createRange(),
                s = Math.max(0, a.length);
              (i.setStart(o, Math.max(0, s - 1)), i.setEnd(o, s));
              var l = i.getClientRects();
              if (l && 0 !== l.length) {
                var c = l[l.length - 1],
                  u = t.getBoundingClientRect(),
                  d = r.offsetWidth || 12,
                  p = r.offsetHeight || 12,
                  g = c.right - u.left + 6,
                  h = t.clientWidth - d - 2;
                g = Math.max(0, Math.min(g, h));
                var f = c.top - u.top + (c.height - p) / 2;
                ((f = Math.max(0, f)),
                  (r.style.left = "".concat(g, "px")),
                  (r.style.top = "".concat(f, "px")));
              }
            }
          }
        }
      }
      function yt(e) {
        var t = (
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
          ).forceFullClear,
          n = void 0 !== t && t;
        if (r) {
          var o = r.querySelectorAll(".bh-caption-line-group"),
            a = r.querySelectorAll("[data-line-id]");
          if (null != e) {
            o.forEach(function (e) {
              (e.classList.remove(
                "bh-tts-speaking",
                "bh-tts-past",
                "bh-tts-future",
              ),
                (e.style.background = ""),
                (e.style.borderLeft = ""),
                (e.style.paddingLeft = ""),
                (e.style.marginLeft = ""),
                (e.style.borderRadius = ""));
            });
            Array.from(a).map(function (e) {
              return e.getAttribute("data-line-id");
            });
            var i = '[data-line-id="'.concat(e, '"]'),
              s = r.querySelector(i);
            if (s) {
              var l = Number(e);
              if (!Number.isFinite(l))
                return (
                  s.classList.add("bh-tts-speaking"),
                  void requestAnimationFrame(function () {
                    return vt(s);
                  })
                );
              a.forEach(function (e) {
                var t = Number(e.getAttribute("data-line-id"));
                Number.isFinite(t) &&
                  (t === l
                    ? e.classList.add("bh-tts-speaking")
                    : t < l
                      ? e.classList.add("bh-tts-past")
                      : t > l && e.classList.add("bh-tts-future"));
              });
              s.classList.contains("bh-tts-speaking");
              requestAnimationFrame(function () {
                return vt(s);
              });
            }
          } else {
            if (ae && !n && null != ie) {
              o.forEach(function (e) {
                e.classList.remove("bh-tts-speaking");
              });
              var c = Number(ie);
              return void (
                Number.isFinite(c) &&
                a.forEach(function (e) {
                  var t = Number(e.getAttribute("data-line-id"));
                  Number.isFinite(t) &&
                    (e.classList.remove("bh-tts-past", "bh-tts-future"),
                    t <= c
                      ? e.classList.add("bh-tts-past")
                      : e.classList.add("bh-tts-future"));
                })
              );
            }
            o.forEach(function (e) {
              (e.classList.remove(
                "bh-tts-speaking",
                "bh-tts-past",
                "bh-tts-future",
              ),
                (e.style.background = ""),
                (e.style.borderLeft = ""),
                (e.style.paddingLeft = ""),
                (e.style.marginLeft = ""),
                (e.style.borderRadius = ""));
            });
          }
        }
      }
      function bt(e) {
        var t = te.indexOf(e);
        (-1 !== t && te.splice(t, 1),
          ee === e &&
            ((ie = e),
            yt(null),
            (ee = null),
            mt(),
            "strip" === se && le && le.updateText(""),
            ne ||
              I ||
              !n ||
              ((F = !0),
              (q = performance.now() + 700),
              n.scrollTo({ top: n.scrollHeight, behavior: "smooth" }),
              setTimeout(function () {
                F = !1;
              }, 600))),
          Ue());
      }
      function xt() {
        var t = 0.2 + 0.6 * Math.max(0, Math.min(1, Number(N.shadow || 0.6)));
        e && (e.style.boxShadow = "0 4px 18px rgba(0,0,0,".concat(t, ")"));
      }
      function wt() {
        e && n && (n.style.fontSize = N.overlayFontSize + "px");
      }
      function St() {
        if (e) {
          var t = Math.max(0, Math.min(1, Number(N.backgroundOpacity || 0.95))),
            n = ce[N.theme] || ce.dark;
          e.style.background = "rgba("
            .concat(n.containerBg, ",")
            .concat(t, ")");
        }
      }
      function kt() {
        if (e && t && r) {
          var n = ce[N.theme] || ce.dark,
            a = Math.max(0, Math.min(1, Number(N.backgroundOpacity || 0.95)));
          ((e.style.background = "rgba("
            .concat(n.containerBg, ",")
            .concat(a, ")")),
            (e.style.color = n.textPrimary),
            _e(),
            (t.style.background = n.topBarBg),
            (t.style.borderBottom = "1px solid ".concat(n.topBarBorder)));
          var i = t.querySelector("div");
          if (
            (i && (i.style.color = n.textPrimary),
            X && (X.style.color = n.textSecondary),
            t.querySelectorAll("button").forEach(function (e) {
              e.classList.contains("bh-stop-btn") ||
              e.classList.contains("bh-bilingual-mode-btn") ||
              e.classList.contains("bh-translation-only-btn")
                ? "function" == typeof e.updateStyle && e.updateStyle()
                : e.classList.contains("bh-swap-order-btn")
                  ? ((e.style.background = n.buttonBg),
                    (e.style.borderColor = n.buttonBorder),
                    (e.style.color = n.textPrimary))
                  : (e.classList.contains("bh-settings-btn") ||
                      e.classList.contains("bh-close-btn")) &&
                    (e.style.color = n.textSecondary);
            }),
            o)
          ) {
            o.style.background = n.settingsPanelBg;
            var s = o.querySelector(".bh-settings-drag-handle");
            s &&
              (s.style.background =
                "dark" === N.theme
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(0,0,0,0.2)");
            var l = o.querySelector(".bh-settings-title");
            (l &&
              (l.style.color =
                "dark" === N.theme ? "rgba(255,255,255,0.95)" : n.textPrimary),
              o.querySelectorAll("div").forEach(function (e) {
                var t = e.style.cssText;
                if (
                  t.includes("margin-bottom: 8px") &&
                  t.includes("justify-content: space-between")
                ) {
                  e.style.color = n.textPrimary;
                  var r = e.querySelectorAll("span");
                  r.length > 0 && (r[0].style.color = n.textPrimary);
                } else
                  "Theme" === e.textContent.trim() &&
                    t.includes("margin-bottom: 8px") &&
                    (e.style.color = n.textPrimary);
              }),
              o.querySelectorAll("input.bh-slider").forEach(function (e) {
                var t =
                  "dark" === N.theme
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)";
                e.style.background = t;
              }));
            var c = o.querySelector(".bh-theme-dark-btn"),
              u = o.querySelector(".bh-theme-light-btn");
            if (c && u) {
              var d = "dark" === N.theme;
              ((c.style.background = d ? "rgba(99,102,241,0.3)" : n.buttonBg),
                (c.style.borderColor = d
                  ? "rgba(99,102,241,0.5)"
                  : n.buttonBorder),
                (c.style.color = n.textPrimary),
                (u.style.background = d ? n.buttonBg : "rgba(99,102,241,0.3)"),
                (u.style.borderColor = d
                  ? n.buttonBorder
                  : "rgba(99,102,241,0.5)"),
                (u.style.color = n.textPrimary));
            }
            o.querySelectorAll("button").forEach(function (e) {
              "✕" === e.innerHTML
                ? (e.style.color = n.textSecondary)
                : e.classList.contains("bh-reset-btn") &&
                  (e.style.color = n.textPrimary);
            });
          }
          (r.querySelectorAll(".bh-caption-line-group").forEach(function (e) {
            e.style.borderBottomColor = n.lineBorder;
            var t = e.querySelector(".bh-caption-translate");
            t && (t.style.color = n.textTranslate);
            var r = e.querySelector(".bh-caption-original");
            r && (r.style.color = n.textOriginal);
          }),
            J &&
              ((J.style.color = n.textSecondary),
              (J.style.background =
                "dark" === N.theme
                  ? "rgba(100, 150, 255, 0.1)"
                  : "rgba(100, 150, 255, 0.08)"),
              (J.style.borderColor =
                "dark" === N.theme
                  ? "rgba(100, 150, 255, 0.2)"
                  : "rgba(100, 150, 255, 0.15)")));
        }
      }
      function Tt() {
        return _t.apply(this, arguments);
      }
      function _t() {
        return (_t = Oo(
          Eo().mark(function e() {
            var t;
            return Eo().wrap(
              function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return (
                        (e.prev = 0),
                        (t = ve(N.subtitleMode)),
                        (N.subtitleMode = t),
                        (e.next = 5),
                        chrome.storage.sync.set({
                          overlaySettings: {
                            overlayFontSize: N.overlayFontSize,
                            stripFontSize: N.stripFontSize,
                            backgroundOpacity: N.backgroundOpacity,
                            showBilingual: N.showBilingual,
                            swapLanguageOrder: N.swapLanguageOrder,
                            theme: N.theme,
                            subtitleMode: t,
                            ttsEnabled: N.ttsEnabled,
                          },
                        })
                      );
                    case 5:
                      e.next = 10;
                      break;
                    case 7:
                      ((e.prev = 7), (e.t0 = e.catch(0)));
                    case 10:
                    case "end":
                      return e.stop();
                  }
              },
              e,
              null,
              [[0, 7]],
            );
          }),
        )).apply(this, arguments);
      }
      function Ct() {
        r &&
          r.querySelectorAll(".bh-caption-line-group").forEach(function (e) {
            var t =
              e.querySelector(".bh-caption-translate-text") ||
              e.querySelector(".bh-caption-translate");
            ut(e, t && t.textContent.trim().length > 0);
          });
      }
      function Et() {
        r &&
          r.querySelectorAll(".bh-caption-line-group").forEach(function (e) {
            N.swapLanguageOrder
              ? e.classList.add("bh-swapped")
              : e.classList.remove("bh-swapped");
            var t =
              e.querySelector(".bh-caption-translate-text") ||
              e.querySelector(".bh-caption-translate");
            ut(e, t && t.textContent.trim().length > 0);
          });
      }
      function Pt() {
        (t && t.removeEventListener("mousedown", Ot),
          window.removeEventListener("mouseup", Lt),
          window.removeEventListener("mousemove", Mt));
      }
      function Ot(n) {
        if (N.draggable && !D) {
          (n.preventDefault(), n.stopPropagation(), (A = !0));
          var r = e.getBoundingClientRect();
          ((B.x = n.clientX - r.left),
            (B.y = n.clientY - r.top),
            (e.style.transform = "none"),
            (e.style.top = r.top + "px"),
            (e.style.left = r.left + "px"),
            (e.style.willChange = "left, top"),
            t && (t.style.cursor = "grabbing"));
        }
      }
      function Mt(t) {
        A &&
          !D &&
          (t.preventDefault(),
          (pe.x = t.clientX),
          (pe.y = t.clientY),
          de ||
            (de = requestAnimationFrame(function () {
              de = null;
              var t = pe.x - B.x,
                n = pe.y - B.y,
                r = be({
                  width: e.offsetWidth,
                  height: e.offsetHeight,
                  left: t,
                  top: n,
                });
              ((e.style.left = r.left + "px"), (e.style.top = r.top + "px"));
            })));
      }
      function Lt(n) {
        var r = A;
        if (
          ((A = !1),
          de && (cancelAnimationFrame(de), (de = null)),
          e && (e.style.willChange = "auto"),
          t && (t.style.cursor = N.draggable ? "move" : "default"),
          r && Te({ immediate: !0 }),
          !U)
        )
          return (
            Y && (clearTimeout(Y), (Y = null)),
            void (
              t &&
              ((t.style.transform = "translateY(0)"), (t.style.opacity = "1"))
            )
          );
        if (n && e && t) {
          var o = e.getBoundingClientRect();
          n.clientX >= o.left &&
          n.clientX <= o.right &&
          n.clientY >= o.top &&
          n.clientY <= o.bottom
            ? (Y && (clearTimeout(Y), (Y = null)),
              (t.style.transform = "translateY(0)"),
              (t.style.opacity = "1"))
            : (Y && clearTimeout(Y),
              (Y = setTimeout(function () {
                (U &&
                  ((t.style.transform = "translateY(-100%)"),
                  (t.style.opacity = "0")),
                  (Y = null));
              }, 300)));
        }
      }
      function zt(t) {
        if (!A) {
          (t.preventDefault(),
            t.stopPropagation(),
            Ce({ markSeen: !0 }),
            (D = !0),
            (V = t.target.dataset.direction));
          var n = e.getBoundingClientRect();
          ((j = {
            x: t.clientX,
            y: t.clientY,
            w: n.width,
            h: n.height,
            top: n.top,
            left: n.left,
          }),
            (e.style.transform = "none"),
            (e.style.top = n.top + "px"),
            (e.style.left = n.left + "px"),
            (e.style.willChange = "width, height, left, top"));
        }
      }
      function Nt(t) {
        D &&
          V &&
          (t.preventDefault(),
          (he.x = t.clientX),
          (he.y = t.clientY),
          ge ||
            (ge = requestAnimationFrame(function () {
              ge = null;
              var t = he.x - j.x,
                n = he.y - j.y,
                r = j.w,
                o = j.h,
                a = j.left,
                l = j.top;
              if (
                (V.includes("e") && (r = Math.max(i, j.w + t)), V.includes("w"))
              ) {
                var c = j.w - t;
                c >= i && ((r = c), (a = j.left + t));
              }
              if (
                (V.includes("s") && (o = Math.max(s, j.h + n)), V.includes("n"))
              ) {
                var u = j.h - n;
                u >= s && ((o = u), (l = j.top + n));
              }
              var d = be({ width: r, height: o, left: a, top: l });
              ((e.style.width = d.width + "px"),
                (e.style.height = d.height + "px"),
                (e.style.left = d.left + "px"),
                (e.style.top = d.top + "px"));
            })));
      }
      function At(n) {
        var r = D;
        if (
          ((D = !1),
          (V = null),
          ge && (cancelAnimationFrame(ge), (ge = null)),
          e && (e.style.willChange = "auto"),
          tt(),
          r && Te({ immediate: !0 }),
          !U)
        )
          return (
            Y && (clearTimeout(Y), (Y = null)),
            void (
              t &&
              ((t.style.transform = "translateY(0)"), (t.style.opacity = "1"))
            )
          );
        if (n && e && t) {
          var o = e.getBoundingClientRect();
          n.clientX >= o.left &&
          n.clientX <= o.right &&
          n.clientY >= o.top &&
          n.clientY <= o.bottom
            ? (Y && (clearTimeout(Y), (Y = null)),
              (t.style.transform = "translateY(0)"),
              (t.style.opacity = "1"))
            : (Y && clearTimeout(Y),
              (Y = setTimeout(function () {
                (U &&
                  ((t.style.transform = "translateY(-100%)"),
                  (t.style.opacity = "0")),
                  (Y = null));
              }, 300)));
        }
      }
      function Dt(e) {
        var t =
            arguments.length > 1 && void 0 !== arguments[1]
              ? arguments[1]
              : null,
          n = "dark" === N.theme,
          r = n ? "rgba(99,102,241,0.9)" : "rgba(79,70,229,0.9)",
          o = n ? "rgba(99,102,241,0.45)" : "rgba(79,70,229,0.35)",
          a = n ? "rgba(24,24,27,0.97)" : "rgba(255,255,255,0.98)",
          i = n ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.85)",
          s = "string" == typeof e && e.trim() ? e.trim() : "new voice";
        if (
          ($ && $.parentNode && $.parentNode.removeChild($),
          Q && (clearTimeout(Q), (Q = null)),
          !document.getElementById("bh-notification-keyframes"))
        ) {
          var l = document.createElement("style");
          ((l.id = "bh-notification-keyframes"),
            (l.textContent =
              "\n        @keyframes slideInFromRight {\n          from {\n            transform: translateX(100%);\n            opacity: 0;\n          }\n          to {\n            transform: translateX(0);\n            opacity: 1;\n          }\n        }\n      "),
            document.head.appendChild(l));
        }
        var c = document.createElement("div");
        c.style.cssText =
          "\n      position: fixed;\n      top: 20px;\n      right: 20px;\n      min-width: 260px;\n      max-width: 420px;\n      background: "
            .concat(a, ";\n      color: ")
            .concat(
              i,
              ";\n      padding: 12px 16px;\n      border-radius: 8px;\n      box-shadow: 0 8px 32px rgba(0,0,0,0.45);\n      z-index: 2147483647;\n      font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;\n      backdrop-filter: blur(10px);\n      border: 1px solid ",
            )
            .concat(o, ";\n      border-left: 4px solid ")
            .concat(
              r,
              ";\n      animation: slideInFromRight 0.3s ease-out;\n    ",
            );
        var u = document.createElement("div");
        u.style.cssText =
          "\n      font-size: 13px;\n      line-height: 1.5;\n      color: ".concat(
            i,
            ";\n    ",
          );
        var d = Lo(
          "voiceSelector.switchingToVoice",
          "Switching to new voice: {voiceName}",
        ).replace("{voiceName}", s);
        ((u.textContent = t || d),
          c.appendChild(u),
          document.documentElement.appendChild(c),
          ($ = c));
        var p = document.getElementById("bh-caption-dock");
        if (p && "function" == typeof p.getBoundingClientRect) {
          var g = p.getBoundingClientRect(),
            h = c.getBoundingClientRect(),
            f = 12,
            m = g.left + g.width / 2,
            v = Math.max(f, window.innerWidth - h.width - f),
            y = Math.min(Math.max(m - h.width / 2, 12), v),
            b = g.top + g.height / 2 < window.innerHeight / 2;
          if (
            ((c.style.left = "".concat(y, "px")),
            (c.style.right = "auto"),
            (c.style.bottom = "auto"),
            b)
          ) {
            var x = g.bottom + 8,
              w = Math.max(f, window.innerHeight - h.height - f);
            c.style.top = "".concat(Math.min(x, w), "px");
          } else {
            var S = g.top - h.height - 8;
            c.style.top = "".concat(Math.max(f, S), "px");
          }
        }
        Q = setTimeout(function () {
          ($ &&
            $.parentNode &&
            (($.style.animation = "slideInFromRight 0.3s ease-in reverse"),
            setTimeout(function () {
              ($ && $.parentNode && $.parentNode.removeChild($), ($ = null));
            }, 300)),
            (Q = null));
        }, 2500);
      }
      function Vt(e) {
        if (e && "voice_auto_switched" === e.type) {
          var t =
              "string" == typeof e.previousDisplayName &&
              e.previousDisplayName.trim()
                ? e.previousDisplayName.trim()
                : Lo(
                    "voiceSelector.previousVoiceFallback",
                    "your previous voice",
                  ),
            n =
              "string" == typeof e.nextDisplayName && e.nextDisplayName.trim()
                ? e.nextDisplayName.trim()
                : Lo("voiceSelector.newVoiceFallback", "a new voice");
          Dt(
            n,
            Lo(
              "voiceSelector.voiceUnavailableSwitched",
              'Your previous voice "{previousVoice}" is no longer available. Switched to "{nextVoice}".',
            )
              .replace("{previousVoice}", t)
              .replace("{nextVoice}", n),
          );
        }
      }
      function Bt() {
        var e = "dark" === N.theme,
          t = e ? "rgba(245,158,11,0.9)" : "rgba(217,119,6,0.9)",
          n = e ? "rgba(245,158,11,0.45)" : "rgba(217,119,6,0.35)",
          r = e ? "rgba(24,24,27,0.97)" : "rgba(255,255,255,0.98)",
          o = e ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.85)";
        if (
          (fe && fe.parentNode && fe.parentNode.removeChild(fe),
          me && (clearTimeout(me), (me = null)),
          !document.getElementById("bh-notification-keyframes"))
        ) {
          var a = document.createElement("style");
          ((a.id = "bh-notification-keyframes"),
            (a.textContent =
              "\n        @keyframes slideInFromRight {\n          from {\n            transform: translateX(100%);\n            opacity: 0;\n          }\n          to {\n            transform: translateX(0);\n            opacity: 1;\n          }\n        }\n      "),
            document.head.appendChild(a));
        }
        var i = document.createElement("div");
        i.style.cssText =
          "\n      position: fixed;\n      top: 20px;\n      right: 20px;\n      min-width: 280px;\n      max-width: 420px;\n      background: "
            .concat(r, ";\n      color: ")
            .concat(
              o,
              ";\n      padding: 12px 16px;\n      border-radius: 8px;\n      box-shadow: 0 8px 32px rgba(0,0,0,0.45);\n      z-index: 2147483647;\n      font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;\n      backdrop-filter: blur(10px);\n      border: 1px solid ",
            )
            .concat(n, ";\n      border-left: 4px solid ")
            .concat(
              t,
              ";\n      animation: slideInFromRight 0.3s ease-out;\n    ",
            );
        var s = document.createElement("div");
        ((s.style.cssText =
          "\n      font-size: 13px;\n      line-height: 1.5;\n      color: ".concat(
            o,
            ";\n    ",
          )),
          (s.textContent =
            "Please select a voice for TTS playback (click the Voice button in the dock)"),
          i.appendChild(s),
          document.documentElement.appendChild(i),
          (fe = i),
          (me = setTimeout(function () {
            (fe &&
              fe.parentNode &&
              ((fe.style.animation = "slideInFromRight 0.3s ease-in reverse"),
              setTimeout(function () {
                (fe && fe.parentNode && fe.parentNode.removeChild(fe),
                  (fe = null));
              }, 300)),
              (me = null));
          }, 4e3)));
      }
      function jt(e) {
        var t = e || {},
          n = t.userLevel,
          r = void 0 === n ? "free" : n,
          o = (t.proStatus, t.minutesRenewsAt),
          a = document.createElement("div");
        if (
          ((a.className = "bh-modal-overlay"),
          (a.style.cssText =
            "\n      position: fixed;\n      top: 0;\n      left: 0;\n      right: 0;\n      bottom: 0;\n      background: rgba(0, 0, 0, 0.7);\n      z-index: 2147483647;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      backdrop-filter: blur(4px);\n      animation: fadeIn 0.2s ease-out;\n    "),
          !document.getElementById("bh-modal-keyframes"))
        ) {
          var i = document.createElement("style");
          ((i.id = "bh-modal-keyframes"),
            (i.textContent =
              "\n        @keyframes fadeIn {\n          from { opacity: 0; }\n          to { opacity: 1; }\n        }\n        @keyframes scaleIn {\n          from { transform: scale(0.9); opacity: 0; }\n          to { transform: scale(1); opacity: 1; }\n        }\n      "),
            document.head.appendChild(i));
        }
        var s = document.createElement("div");
        ((s.className = "bh-modal"),
          (s.style.cssText =
            "\n      background: rgba(40, 40, 40, 0.98);\n      border-radius: 16px;\n      padding: 32px;\n      max-width: 520px;\n      width: 90%;\n      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);\n      font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif;\n      animation: scaleIn 0.3s ease-out;\n      border: 1px solid rgba(255, 255, 255, 0.1);\n    "));
        var l = document.createElement("div");
        l.style.cssText =
          "\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      gap: 8px;\n      margin-bottom: 20px;\n      opacity: 0.85;\n    ";
        var c = document.createElement("img");
        ((c.src = chrome.runtime.getURL("imgs/icon128.png")),
          (c.style.cssText =
            "\n      width: 32px;\n      height: 32px;\n      border-radius: 6px;\n    "));
        var u = document.createElement("div");
        ((u.style.cssText =
          "\n      font-size: 16px;\n      font-weight: 600;\n      color: rgba(255, 255, 255, 0.9);\n      letter-spacing: -0.3px;\n    "),
          (u.textContent = "DubTab"),
          l.appendChild(c),
          l.appendChild(u));
        var d =
          "starter" === r ||
          "pro" === r ||
          "power" === r ||
          "ultra" === r ||
          "plus" === r ||
          "custom" === r ||
          "business" === r ||
          "enterprise" === r;
        if (
          [
            "starter",
            "pro",
            "power",
            "ultra",
            "plus",
            "custom",
            "business",
            "enterprise",
          ].includes(r) &&
          o
        ) {
          var p =
              r && "string" == typeof r
                ? r.charAt(0).toUpperCase() + r.slice(1)
                : "your plan",
            g = document.createElement("div");
          ((g.style.cssText =
            "\n        font-size: 20px;\n        font-weight: 600;\n        color: rgba(255, 150, 100, 0.95);\n        text-align: center;\n        margin-bottom: 10px;\n      "),
            (g.textContent = d
              ? "You’ve used all your ".concat(p, " hours for this month.")
              : Lo("quotaModal.paidTitle", "Minutes Exhausted")),
            s.appendChild(l),
            s.appendChild(g));
          var h = document.createElement("div");
          if (
            ((h.style.cssText =
              "\n        font-size: 14px;\n        line-height: 1.6;\n        color: rgba(255, 255, 255, 0.85);\n        text-align: center;\n        margin-bottom: ".concat(
                d ? "16px" : "20px",
                ";\n      ",
              )),
            (h.textContent = d
              ? Lo(
                  "quotaModal.paidSubtitleBuyMore",
                  "To keep DubTab running for the rest of this month, add extra lifetime hours:",
                )
              : Lo(
                  "quotaModal.paidSubtitleReached",
                  "You've reached your monthly minute limit, so this session is paused to avoid extra charges.",
                )),
            s.appendChild(h),
            d)
          ) {
            var f = document.createElement("div");
            ((f.style.cssText =
              "\n          font-size: 13px;\n          font-weight: 600;\n          color: rgba(200, 220, 255, 0.9);\n          margin-bottom: 10px;\n          text-align: center;\n        "),
              (f.textContent = Lo(
                "quotaModal.extraHoursPack",
                "Extra hours pack",
              )),
              s.appendChild(f));
            var m = [
                {
                  title: Lo("quotaModal.smallPack", "Small pack"),
                  desc: Lo(
                    "quotaModal.smallPackDesc",
                    "1 extra hour · lifetime, one time purchase",
                  ),
                  price: "$5",
                  key: "paygo_small",
                  priceId: br.configs.paygoSmallPackPriceId,
                },
                {
                  title: Lo("quotaModal.standardPack", "Standard pack"),
                  desc: Lo(
                    "quotaModal.standardPackDesc",
                    "4 extra hours · lifetime, one time purchase",
                  ),
                  price: "$15",
                  key: "paygo_standard",
                  priceId: br.configs.paygoStandardPackPriceId,
                },
                {
                  title: Lo("quotaModal.largePack", "Large pack"),
                  desc: Lo(
                    "quotaModal.largePackDesc",
                    "15 extra hours · lifetime, one time purchase",
                  ),
                  price: "$45",
                  key: "paygo_large",
                  priceId: br.configs.paygoLargePackPriceId,
                },
              ],
              v = document.createElement("div");
            ((v.style.cssText =
              "\n          display: flex;\n          flex-direction: column;\n          gap: 12px;\n          margin-bottom: 16px;\n        "),
              m.forEach(function (e) {
                var t = document.createElement("div");
                t.style.cssText =
                  "\n            background: rgba(255, 255, 255, 0.05);\n            border: 1px solid rgba(255, 255, 255, 0.08);\n            border-radius: 10px;\n            padding: 12px 14px;\n            display: flex;\n            justify-content: space-between;\n            align-items: center;\n            gap: 12px;\n            cursor: pointer;\n            transition: all 0.2s;\n            transform: translateY(0);\n          ";
                var n = document.createElement("div");
                n.style.cssText =
                  "\n            display: flex;\n            flex-direction: column;\n            gap: 4px;\n          ";
                var r = document.createElement("div");
                ((r.style.cssText =
                  "\n            font-size: 14px;\n            font-weight: 600;\n            color: rgba(255, 255, 255, 0.95);\n          "),
                  (r.textContent = e.title));
                var o = document.createElement("div");
                ((o.style.cssText =
                  "\n            font-size: 12px;\n            color: rgba(255, 255, 255, 0.7);\n          "),
                  (o.textContent = e.desc),
                  n.appendChild(r),
                  n.appendChild(o));
                var a = document.createElement("div");
                ((a.style.cssText =
                  "\n            font-size: 14px;\n            font-weight: 700;\n            color: rgba(120, 210, 120, 0.95);\n          "),
                  (a.textContent = e.price),
                  t.appendChild(n),
                  t.appendChild(a),
                  v.appendChild(t),
                  (t.onmouseenter = function () {
                    ((t.style.background = "rgba(70, 70, 70, 0.7)"),
                      (t.style.borderColor = "rgba(100, 150, 255, 0.4)"),
                      (t.style.transform = "translateY(-2px)"));
                  }),
                  (t.onmouseleave = function () {
                    ((t.style.background = "rgba(255, 255, 255, 0.05)"),
                      (t.style.borderColor = "rgba(255, 255, 255, 0.08)"),
                      (t.style.transform = "translateY(0)"));
                  }),
                  (t.onclick = function () {
                    var n = e.priceId;
                    if (n) {
                      try {
                        chrome.runtime.sendMessage({
                          type: "trackEvent",
                          eventName: "quota_exhausted_modal_paygo_pack_clicked",
                          properties: { pack: e.key, priceId: n },
                        });
                      } catch (e) {}
                      var r = t.innerHTML;
                      ((t.style.opacity = "0.65"),
                        (t.style.pointerEvents = "none"),
                        (t.innerHTML =
                          '\n              <div style="text-align: center; width: 100%; color: rgba(255,255,255,0.9);">\n                Processing...\n                <div style="font-size: 12px; color: rgba(255,255,255,0.6);">Opening Stripe Checkout</div>\n              </div>\n            '),
                        chrome.runtime.sendMessage(
                          { type: "openStripeCheckout", priceId: n },
                          function () {
                            setTimeout(function () {
                              ((t.innerHTML = r),
                                (t.style.opacity = "1"),
                                (t.style.pointerEvents = "auto"));
                            }, 1500);
                          },
                        ));
                    }
                  }));
              }),
              s.appendChild(v));
          } else {
            var y = document.createElement("div");
            y.style.cssText =
              "\n          background: rgba(100, 150, 255, 0.1);\n          border: 1px solid rgba(100, 150, 255, 0.3);\n          border-radius: 8px;\n          padding: 12px 16px;\n          margin-bottom: 24px;\n          text-align: center;\n        ";
            var b = document.createElement("div");
            b.style.cssText =
              "\n          font-size: 13px;\n          color: rgba(255, 255, 255, 0.85);\n          line-height: 1.5;\n        ";
            var x = o;
            try {
              x = new Date(o).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });
            } catch (e) {}
            ((b.innerHTML =
              '\n          <strong style="color: rgba(100, 200, 255, 0.95);">'.concat(
                Lo(
                  "quotaModal.renewalInfo",
                  "Your minutes will reset on {date}",
                ).replace("{date}", x),
                "</strong>\n        ",
              )),
              y.appendChild(b),
              s.appendChild(y));
          }
          var w = document.createElement("div");
          w.style.cssText =
            "\n        display: flex;\n        gap: 12px;\n        justify-content: center;\n      ";
          var S = document.createElement("button");
          ((S.textContent = d
            ? Lo("quotaModal.maybeLater", "Maybe later")
            : Lo("common.close", "Close")),
            (S.style.cssText =
              "\n        padding: 10px 24px;\n        border-radius: 6px;\n        font-size: 14px;\n        font-weight: 500;\n        cursor: pointer;\n        transition: all 0.2s;\n        background: rgba(255, 255, 255, 0.1);\n        border: 1px solid rgba(255, 255, 255, 0.2);\n        color: rgba(255, 255, 255, 0.9);\n      "),
            (S.onmouseenter = function () {
              S.style.background = "rgba(255, 255, 255, 0.15)";
            }),
            (S.onmouseleave = function () {
              S.style.background = "rgba(255, 255, 255, 0.1)";
            }),
            (S.onclick = function () {
              a.remove();
            }),
            w.appendChild(S),
            s.appendChild(w));
        } else {
          var k = document.createElement("div");
          ((k.style.cssText =
            "\n        font-size: 22px;\n        font-weight: 600;\n        color: rgba(255, 255, 255, 0.95);\n        text-align: center;\n        margin-bottom: 8px;\n        line-height: 1.3;\n      "),
            (k.textContent = Lo(
              "quotaModal.freeTitle",
              "You've used your free 10 minutes.",
            )));
          var T = document.createElement("div");
          ((T.style.cssText =
            "\n        font-size: 14px;\n        color: rgba(255, 255, 255, 0.7);\n        text-align: center;\n        margin-bottom: 28px;\n      "),
            (T.textContent = Lo(
              "quotaModal.freeSubtitle",
              "To keep live translation & dubbing running:",
            )),
            s.appendChild(l),
            s.appendChild(k),
            s.appendChild(T));
          var _ = !1,
            C = document.createElement("div");
          C.style.cssText =
            "\n        display: flex;\n        flex-direction: column;\n        align-items: center;\n        margin-bottom: 20px;\n      ";
          var E = document.createElement("div");
          E.style.cssText =
            "\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        background: rgba(255, 255, 255, 0.08);\n        border-radius: 8px;\n        padding: 4px;\n        border: 1px solid rgba(255, 255, 255, 0.1);\n      ";
          var P = document.createElement("div");
          ((P.style.cssText =
            "\n        padding: 8px 20px;\n        border-radius: 6px;\n        font-size: 13px;\n        font-weight: 600;\n        cursor: pointer;\n        transition: all 0.2s;\n        background: rgba(99, 102, 241, 0.8);\n        color: rgba(255, 255, 255, 0.95);\n      "),
            (P.textContent = Lo("quotaModal.monthly", "Monthly")));
          var O = document.createElement("div");
          ((O.style.cssText =
            "\n        padding: 8px 20px;\n        border-radius: 6px;\n        font-size: 13px;\n        font-weight: 500;\n        cursor: pointer;\n        transition: all 0.2s;\n        background: transparent;\n        color: rgba(255, 255, 255, 0.6);\n      "),
            (O.innerHTML = ""
              .concat(
                Lo("quotaModal.yearly", "Yearly"),
                ' <span style="color: rgba(34, 197, 94, 0.9); font-weight: 600;">-17%</span> <span style="background: rgba(34, 197, 94, 0.2); color: rgba(34, 197, 94, 0.9); font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 4px; margin-left: 4px;">',
              )
              .concat(Lo("quotaModal.upfront", "Upfront"), "</span>")));
          var M = document.createElement("div");
          ((M.style.cssText =
            "\n        font-size: 12px;\n        color: rgba(255, 255, 255, 0.45);\n        margin-top: 8px;\n        display: none;\n      "),
            (M.textContent = Lo(
              "quotaModal.toggleHint",
              "Get all hours upfront • No monthly reset",
            )));
          var L = function () {
              _
                ? ((P.style.background = "transparent"),
                  (P.style.color = "rgba(255, 255, 255, 0.6)"),
                  (P.style.fontWeight = "500"),
                  (O.style.background = "rgba(99, 102, 241, 0.8)"),
                  (O.style.color = "rgba(255, 255, 255, 0.95)"),
                  (O.style.fontWeight = "600"),
                  (O.innerHTML = ""
                    .concat(
                      Lo("quotaModal.yearly", "Yearly"),
                      ' <span style="color: rgba(34, 197, 94, 1); font-weight: 600;">-17%</span> <span style="background: rgba(34, 197, 94, 0.25); color: rgba(34, 197, 94, 1); font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 4px; margin-left: 4px;">',
                    )
                    .concat(Lo("quotaModal.upfront", "Upfront"), "</span>")),
                  (M.style.display = "block"))
                : ((P.style.background = "rgba(99, 102, 241, 0.8)"),
                  (P.style.color = "rgba(255, 255, 255, 0.95)"),
                  (P.style.fontWeight = "600"),
                  (O.style.background = "transparent"),
                  (O.style.color = "rgba(255, 255, 255, 0.6)"),
                  (O.style.fontWeight = "500"),
                  (O.innerHTML = ""
                    .concat(
                      Lo("quotaModal.yearly", "Yearly"),
                      ' <span style="color: rgba(34, 197, 94, 0.9); font-weight: 600;">-17%</span> <span style="background: rgba(34, 197, 94, 0.15); color: rgba(34, 197, 94, 0.8); font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 4px; margin-left: 4px;">',
                    )
                    .concat(Lo("quotaModal.upfront", "Upfront"), "</span>")),
                  (M.style.display = "none"));
            },
            z = { onclick: null };
          ((P.onclick = function () {
            _ && ((_ = !1), z.onclick ? z.onclick() : (L(), Q()));
          }),
            (O.onclick = function () {
              _ || ((_ = !0), z.onclick ? z.onclick() : (L(), Q()));
            }),
            E.appendChild(P),
            E.appendChild(O),
            C.appendChild(E),
            C.appendChild(M),
            s.appendChild(C));
          var N = document.createElement("div");
          N.style.cssText =
            "\n        display: flex;\n        flex-direction: column;\n        gap: 16px;\n        margin-bottom: 24px;\n      ";
          var A = document.createElement("div");
          ((A.style.cssText =
            "\n        background: rgba(60, 60, 60, 0.6);\n        border: 1px solid rgba(255, 255, 255, 0.15);\n        border-radius: 10px;\n        padding: 18px 20px;\n        cursor: pointer;\n        transition: all 0.2s;\n      "),
            (A.onmouseenter = function () {
              ((A.style.background = "rgba(70, 70, 70, 0.7)"),
                (A.style.borderColor = "rgba(99, 102, 241, 0.4)"),
                (A.style.transform = "translateY(-2px)"));
            }),
            (A.onmouseleave = function () {
              ((A.style.background = "rgba(60, 60, 60, 0.6)"),
                (A.style.borderColor = "rgba(255, 255, 255, 0.15)"),
                (A.style.transform = "translateY(0)"));
            }),
            (A.onclick = Oo(
              Eo().mark(function e() {
                var t, n, r;
                return Eo().wrap(function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        ((t = _
                          ? br.configs.starterAnnuallyPriceId
                          : br.configs.starterMonthlyPriceId),
                          (n = _
                            ? br.configs.starterAnnuallyPrice
                            : br.configs.starterMonthlyPrice));
                        try {
                          chrome.runtime.sendMessage({
                            type: "trackEvent",
                            eventName:
                              "quota_exhausted_modal_starter_plan_clicked",
                            properties: {
                              plan: "starter",
                              billing: _ ? "yearly" : "monthly",
                              price: n,
                              priceId: t,
                              from: "overlay_quota_modal",
                            },
                          });
                        } catch (e) {}
                        ((A.style.opacity = "0.6"),
                          (A.style.pointerEvents = "none"),
                          (r = A.innerHTML),
                          (A.innerHTML =
                            '\n          <div style="text-align: center; padding: 10px;">\n            <div style="color: rgba(255,255,255,0.9); margin-bottom: 6px;">Processing...</div>\n            <div style="font-size: 12px; color: rgba(255,255,255,0.6);">Opening Stripe Checkout</div>\n          </div>\n        '));
                        try {
                          chrome.runtime.sendMessage(
                            { type: "openStripeCheckout", priceId: t },
                            function (e) {
                              setTimeout(function () {
                                ((A.innerHTML = r),
                                  (A.style.opacity = "1"),
                                  (A.style.pointerEvents = "auto"));
                              }, 1500);
                            },
                          );
                        } catch (e) {
                          ((A.innerHTML = r),
                            (A.style.opacity = "1"),
                            (A.style.pointerEvents = "auto"),
                            alert(
                              "Failed to open checkout. Please try again.",
                            ));
                        }
                      case 10:
                      case "end":
                        return e.stop();
                    }
                }, e);
              }),
            )));
          var D = document.createElement("div");
          D.style.cssText =
            "\n        display: flex;\n        justify-content: space-between;\n        align-items: center;\n        margin-bottom: 6px;\n      ";
          var V = document.createElement("div");
          ((V.style.cssText =
            "\n        font-size: 16px;\n        font-weight: 600;\n        color: rgba(255, 255, 255, 0.9);\n      "),
            (V.textContent = Lo("quotaModal.starter", "Starter")));
          var B = document.createElement("div");
          ((B.style.cssText =
            "\n        font-size: 20px;\n        font-weight: 700;\n        color: rgba(100, 200, 255, 0.95);\n      "),
            (B.textContent = "$".concat(br.configs.starterMonthlyPrice)));
          var j = document.createElement("span");
          ((j.style.cssText =
            "\n        font-size: 13px;\n        font-weight: 500;\n        color: rgba(255, 255, 255, 0.6);\n      "),
            (j.textContent = "/month"),
            B.appendChild(j),
            D.appendChild(V),
            D.appendChild(B));
          var I = document.createElement("div");
          ((I.style.cssText =
            "\n        font-size: 13px;\n        color: rgba(255, 255, 255, 0.7);\n        line-height: 1.4;\n      "),
            (I.textContent = "".concat(
              br.configs.starterHours,
              " hours/month",
            )),
            A.appendChild(D),
            A.appendChild(I));
          var R = document.createElement("div");
          ((R.style.cssText =
            "\n        position: relative;\n        background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(129, 140, 248, 0.1));\n        border: 1.5px solid rgba(99, 102, 241, 0.5);\n        border-radius: 10px;\n        padding: 18px 20px;\n        cursor: pointer;\n        transition: all 0.2s;\n      "),
            (R.onmouseenter = function () {
              ((R.style.background =
                "linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(129, 140, 248, 0.15))"),
                (R.style.borderColor = "rgba(99, 102, 241, 0.7)"),
                (R.style.transform = "translateY(-2px)"));
            }),
            (R.onmouseleave = function () {
              ((R.style.background =
                "linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(129, 140, 248, 0.1))"),
                (R.style.borderColor = "rgba(99, 102, 241, 0.5)"),
                (R.style.transform = "translateY(0)"));
            }),
            (R.onclick = Oo(
              Eo().mark(function e() {
                var t, n, r;
                return Eo().wrap(function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        ((t = _
                          ? br.configs.proAnnuallyPriceId
                          : br.configs.proMonthlyPriceId),
                          (n = _
                            ? br.configs.proAnnuallyPrice
                            : br.configs.proMonthlyPrice));
                        try {
                          chrome.runtime.sendMessage({
                            type: "trackEvent",
                            eventName: "quota_exhausted_modal_pro_plan_clicked",
                            properties: {
                              plan: "pro",
                              billing: _ ? "yearly" : "monthly",
                              price: n,
                              priceId: t,
                              from: "overlay_quota_modal",
                            },
                          });
                        } catch (e) {}
                        ((R.style.opacity = "0.6"),
                          (R.style.pointerEvents = "none"),
                          (r = R.innerHTML),
                          (R.innerHTML =
                            '\n          <div style="text-align: center; padding: 10px;">\n            <div style="color: rgba(255,255,255,0.9); margin-bottom: 6px;">Processing...</div>\n            <div style="font-size: 12px; color: rgba(255,255,255,0.6);">Opening Stripe Checkout</div>\n          </div>\n        '));
                        try {
                          chrome.runtime.sendMessage(
                            { type: "openStripeCheckout", priceId: t },
                            function (e) {
                              setTimeout(function () {
                                ((R.innerHTML = r),
                                  (R.style.opacity = "1"),
                                  (R.style.pointerEvents = "auto"));
                              }, 1500);
                            },
                          );
                        } catch (e) {
                          ((R.innerHTML = r),
                            (R.style.opacity = "1"),
                            (R.style.pointerEvents = "auto"),
                            alert(
                              "Failed to open checkout. Please try again.",
                            ));
                        }
                      case 10:
                      case "end":
                        return e.stop();
                    }
                }, e);
              }),
            )));
          var F = document.createElement("div");
          ((F.style.cssText =
            "\n        position: absolute;\n        top: -10px;\n        right: 16px;\n        background: rgba(99, 102, 241, 0.55);\n        border: 1px solid rgba(99, 102, 241, 0.6);\n        color: rgba(255, 255, 255, 0.95);\n        font-size: 11px;\n        font-weight: 600;\n        padding: 4px 10px;\n        border-radius: 12px;\n        text-transform: uppercase;\n        letter-spacing: 0.5px;\n      "),
            (F.textContent = Lo("quotaModal.mostPopular", "Most Popular")));
          var q = document.createElement("div");
          q.style.cssText =
            "\n        display: flex;\n        justify-content: space-between;\n        align-items: center;\n        margin-bottom: 6px;\n      ";
          var H = document.createElement("div");
          ((H.style.cssText =
            "\n        font-size: 16px;\n        font-weight: 600;\n        color: rgba(255, 255, 255, 0.95);\n      "),
            (H.textContent = Lo("quotaModal.pro", "Pro")));
          var U = document.createElement("div");
          ((U.style.cssText =
            "\n        font-size: 20px;\n        font-weight: 700;\n        color: rgba(129, 140, 248, 1);\n      "),
            (U.textContent = "$".concat(br.configs.proMonthlyPrice)));
          var W = document.createElement("span");
          ((W.style.cssText =
            "\n        font-size: 13px;\n        font-weight: 500;\n        color: rgba(255, 255, 255, 0.7);\n      "),
            (W.textContent = "/month"),
            U.appendChild(W),
            q.appendChild(H),
            q.appendChild(U));
          var Y = document.createElement("div");
          ((Y.style.cssText =
            "\n        font-size: 13px;\n        color: rgba(255, 255, 255, 0.8);\n        line-height: 1.4;\n      "),
            (Y.textContent = "".concat(br.configs.proHours, " hours/month")),
            R.appendChild(F),
            R.appendChild(q),
            R.appendChild(Y));
          var G = document.createElement("div");
          ((G.style.cssText =
            "\n        background: rgba(60, 60, 60, 0.6);\n        border: 1px solid rgba(255, 255, 255, 0.15);\n        border-radius: 10px;\n        padding: 18px 20px;\n        cursor: pointer;\n        transition: all 0.2s;\n      "),
            (G.onmouseenter = function () {
              ((G.style.background = "rgba(70, 70, 70, 0.7)"),
                (G.style.borderColor = "rgba(99, 102, 241, 0.4)"),
                (G.style.transform = "translateY(-2px)"));
            }),
            (G.onmouseleave = function () {
              ((G.style.background = "rgba(60, 60, 60, 0.6)"),
                (G.style.borderColor = "rgba(255, 255, 255, 0.15)"),
                (G.style.transform = "translateY(0)"));
            }),
            (G.onclick = Oo(
              Eo().mark(function e() {
                var t, n, r;
                return Eo().wrap(function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        ((t = _
                          ? br.configs.powerAnnuallyPriceId
                          : br.configs.powerMonthlyPriceId),
                          (n = _
                            ? br.configs.powerAnnuallyPrice
                            : br.configs.powerMonthlyPrice));
                        try {
                          chrome.runtime.sendMessage({
                            type: "trackEvent",
                            eventName:
                              "quota_exhausted_modal_power_plan_clicked",
                            properties: {
                              plan: "power",
                              billing: _ ? "yearly" : "monthly",
                              price: n,
                              priceId: t,
                              from: "overlay_quota_modal",
                            },
                          });
                        } catch (e) {}
                        ((G.style.opacity = "0.6"),
                          (G.style.pointerEvents = "none"),
                          (r = G.innerHTML),
                          (G.innerHTML =
                            '\n          <div style="text-align: center; padding: 10px;">\n            <div style="color: rgba(255,255,255,0.9); margin-bottom: 6px;">Processing...</div>\n            <div style="font-size: 12px; color: rgba(255,255,255,0.6);">Opening Stripe Checkout</div>\n          </div>\n        '));
                        try {
                          chrome.runtime.sendMessage(
                            { type: "openStripeCheckout", priceId: t },
                            function (e) {
                              setTimeout(function () {
                                ((G.innerHTML = r),
                                  (G.style.opacity = "1"),
                                  (G.style.pointerEvents = "auto"));
                              }, 1500);
                            },
                          );
                        } catch (e) {
                          ((G.innerHTML = r),
                            (G.style.opacity = "1"),
                            (G.style.pointerEvents = "auto"),
                            alert(
                              "Failed to open checkout. Please try again.",
                            ));
                        }
                      case 10:
                      case "end":
                        return e.stop();
                    }
                }, e);
              }),
            )));
          var X = document.createElement("div");
          X.style.cssText =
            "\n        display: flex;\n        justify-content: space-between;\n        align-items: center;\n        margin-bottom: 6px;\n      ";
          var K = document.createElement("div");
          ((K.style.cssText =
            "\n        font-size: 16px;\n        font-weight: 600;\n        color: rgba(255, 255, 255, 0.9);\n      "),
            (K.textContent = Lo("quotaModal.power", "Power")));
          var Z = document.createElement("div");
          ((Z.style.cssText =
            "\n        font-size: 20px;\n        font-weight: 700;\n        color: rgba(100, 200, 255, 0.95);\n      "),
            (Z.textContent = "$".concat(br.configs.powerMonthlyPrice)));
          var J = document.createElement("span");
          ((J.style.cssText =
            "\n        font-size: 13px;\n        font-weight: 500;\n        color: rgba(255, 255, 255, 0.6);\n      "),
            (J.textContent = "/month"),
            Z.appendChild(J),
            X.appendChild(K),
            X.appendChild(Z));
          var $ = document.createElement("div");
          (($.style.cssText =
            "\n        font-size: 13px;\n        color: rgba(255, 255, 255, 0.7);\n        line-height: 1.4;\n      "),
            ($.textContent = "".concat(br.configs.powerHours, " hours/month")),
            G.appendChild(X),
            G.appendChild($),
            N.appendChild(A),
            N.appendChild(R),
            N.appendChild(G),
            s.appendChild(N));
          var Q = function () {
            var e = br.configs;
            if (_) {
              var t = Math.round(e.starterAnnuallyPrice / 12),
                n = Math.round(e.proAnnuallyPrice / 12),
                r = Math.round(e.powerAnnuallyPrice / 12);
              ((B.innerHTML = "$"
                .concat(
                  e.starterAnnuallyPrice,
                  '<span style="font-size: 13px; font-weight: 500; color: rgba(255, 255, 255, 0.6);">/yr</span> <span style="font-size: 12px; font-weight: 400; color: rgba(255, 255, 255, 0.5);">(~$',
                )
                .concat(t, "/mo)</span>")),
                (U.innerHTML = "$"
                  .concat(
                    e.proAnnuallyPrice,
                    '<span style="font-size: 13px; font-weight: 500; color: rgba(255, 255, 255, 0.7);">/yr</span> <span style="font-size: 12px; font-weight: 400; color: rgba(255, 255, 255, 0.5);">(~$',
                  )
                  .concat(n, "/mo)</span>")),
                (Z.innerHTML = "$"
                  .concat(
                    e.powerAnnuallyPrice,
                    '<span style="font-size: 13px; font-weight: 500; color: rgba(255, 255, 255, 0.6);">/yr</span> <span style="font-size: 12px; font-weight: 400; color: rgba(255, 255, 255, 0.5);">(~$',
                  )
                  .concat(r, "/mo)</span>")),
                (I.textContent = "".concat(
                  12 * e.starterHours,
                  " hours upfront (per year)",
                )),
                (Y.textContent = "".concat(
                  12 * e.proHours,
                  " hours upfront (per year)",
                )),
                ($.textContent = "".concat(
                  12 * e.powerHours,
                  " hours upfront (per year)",
                )));
            } else
              ((B.innerHTML = "$".concat(
                e.starterMonthlyPrice,
                '<span style="font-size: 13px; font-weight: 500; color: rgba(255, 255, 255, 0.6);">/month</span>',
              )),
                (U.innerHTML = "$".concat(
                  e.proMonthlyPrice,
                  '<span style="font-size: 13px; font-weight: 500; color: rgba(255, 255, 255, 0.7);">/month</span>',
                )),
                (Z.innerHTML = "$".concat(
                  e.powerMonthlyPrice,
                  '<span style="font-size: 13px; font-weight: 500; color: rgba(255, 255, 255, 0.6);">/month</span>',
                )),
                (I.textContent = "".concat(e.starterHours, " hours/month")),
                (Y.textContent = "".concat(e.proHours, " hours/month")),
                ($.textContent = "".concat(e.powerHours, " hours/month")));
          };
          z.onclick = function () {
            (L(), Q());
            try {
              chrome.runtime.sendMessage({
                type: "trackEvent",
                eventName: "quota_exhausted_modal_billing_toggle",
                properties: {
                  billing: _ ? "yearly" : "monthly",
                  from: "overlay_quota_modal",
                },
              });
            } catch (e) {}
          };
          var ee = document.createElement("div");
          ee.style.cssText =
            "\n        display: flex;\n        gap: 12px;\n        justify-content: center;\n        align-items: center;\n      ";
          var te = document.createElement("button");
          ((te.textContent = Lo("quotaModal.seeAllPlans", "See all plans")),
            (te.style.cssText =
              "\n        padding: 10px 20px;\n        border-radius: 6px;\n        font-size: 13px;\n        font-weight: 600;\n        cursor: pointer;\n        transition: all 0.2s;\n        background: rgba(99, 102, 241, 0.8);\n        border: 1px solid rgba(99, 102, 241, 0.9);\n        color: rgba(255, 255, 255, 0.98);\n      "),
            (te.onmouseenter = function () {
              ((te.style.background = "rgba(99, 102, 241, 0.9)"),
                (te.style.borderColor = "rgba(99, 102, 241, 1)"),
                (te.style.transform = "translateY(-1px)"));
            }),
            (te.onmouseleave = function () {
              ((te.style.background = "rgba(99, 102, 241, 0.8)"),
                (te.style.borderColor = "rgba(99, 102, 241, 0.9)"),
                (te.style.transform = "translateY(0)"));
            }),
            (te.onclick = function () {
              try {
                chrome.runtime.sendMessage({
                  type: "trackEvent",
                  eventName: "quota_exhausted_modal_see_all_plans_clicked",
                  properties: {
                    userLevel: r || "free",
                    from: "overlay_quota_modal",
                  },
                });
              } catch (e) {}
              try {
                !(function () {
                  try {
                    chrome.runtime.sendMessage({ type: "openUpgradePage" });
                  } catch (e) {}
                })();
              } catch (e) {}
              a.remove();
            }));
          var ne = document.createElement("button");
          ((ne.textContent = Lo("quotaModal.maybeLater", "Maybe later")),
            (ne.style.cssText =
              "\n        padding: 10px 20px;\n        border-radius: 6px;\n        font-size: 13px;\n        font-weight: 400;\n        cursor: pointer;\n        transition: all 0.2s;\n        background: transparent;\n        border: 1px solid rgba(255, 255, 255, 0.12);\n        color: rgba(255, 255, 255, 0.5);\n      "),
            (ne.onmouseenter = function () {
              ((ne.style.background = "rgba(255, 255, 255, 0.05)"),
                (ne.style.borderColor = "rgba(255, 255, 255, 0.2)"),
                (ne.style.color = "rgba(255, 255, 255, 0.7)"));
            }),
            (ne.onmouseleave = function () {
              ((ne.style.background = "transparent"),
                (ne.style.borderColor = "rgba(255, 255, 255, 0.12)"),
                (ne.style.color = "rgba(255, 255, 255, 0.5)"));
            }),
            (ne.onclick = function () {
              try {
                chrome.runtime.sendMessage({
                  type: "trackEvent",
                  eventName: "quota_exhausted_modal_maybe_later_clicked",
                  properties: {
                    userLevel: r || "free",
                    from: "overlay_quota_modal",
                  },
                });
              } catch (e) {}
              a.remove();
            }),
            ee.appendChild(ne),
            ee.appendChild(te),
            s.appendChild(ee));
        }
        (a.appendChild(s), document.documentElement.appendChild(a));
      }
      function It() {
        var e = document.getElementById(a);
        if (w) return (He(), void Fe());
        if ("strip" === se) {
          if ((e && (e.style.display = "none"), Ce(), !U)) return void at();
          if ((ot(), le.show(), Rt())) Ht();
          else if (ee) {
            var t = Ut(ee);
            le.updateText(t);
          } else le.showWaiting();
          Ft();
        } else
          (e && (e.style.display = "block"),
            Ee(),
            le && (le.setStatus(""), le.hide()));
      }
      function Rt() {
        return !("strip" !== se || (N.ttsEnabled && ae));
      }
      function Ft() {
        le &&
          le.setStatus(
            "strip" === se && N.ttsEnabled && !ae && U ? "Voice buffering" : "",
          );
      }
      function qt(e) {
        if (!e) return { translatedText: "", originalText: "", isFinal: !1 };
        var t = e.querySelector(".bh-caption-translate-text"),
          n = e.querySelector(".bh-caption-original"),
          r =
            "final" === e.getAttribute("data-state") ||
            e.hasAttribute("data-line-id");
        return {
          translatedText: t ? t.textContent : "",
          originalText: n ? n.textContent : "",
          isFinal: r,
        };
      }
      function Ht() {
        if (le)
          if (U) {
            var e = N.ttsEnabled
              ? H && H.parentNode
                ? qt(H)
                : r && r.lastElementChild
                  ? qt(r.lastElementChild)
                  : { translatedText: "", originalText: "", isFinal: !1 }
              : (function () {
                  if (!r) return null;
                  var e = r.querySelectorAll(
                      '.bh-caption-line-group[data-state="final"]',
                    ),
                    t = e[e.length - 1];
                  return t ? qt(t) : null;
                })();
            e && e.translatedText
              ? le.updateText(e)
              : ((e && e.originalText) || N.ttsEnabled || le.reset(),
                le.showWaiting());
          } else at();
      }
      function Ut(e) {
        if (!r) return { translatedText: "", originalText: "", isFinal: !1 };
        var t = r.querySelector(
          '.bh-caption-line-group[data-line-id="'.concat(e, '"]'),
        );
        return t
          ? qt(t)
          : { translatedText: "", originalText: "", isFinal: !1 };
      }
    })());
})();
